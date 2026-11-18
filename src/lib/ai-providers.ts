import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { HumanizationLevel, Language } from "@/types";
import { buildHumanizePrompt } from "./prompts";

export interface AIResult {
  text: string;
  model: string;
}

interface ProviderTask {
  name: string;
  isAvailable: () => boolean;
  execute: () => Promise<string>;
}

// Helper per netejar la resposta de l'IA (cometes al voltant o residus de markdown)
function cleanOutput(raw: string): string {
  let cleaned = raw.trim();
  if (
    (cleaned.startsWith('"""') && cleaned.endsWith('"""')) ||
    (cleaned.startsWith("```") && cleaned.endsWith("```"))
  ) {
    cleaned = cleaned.replace(/^("""|```[a-z]*\n?)/i, "").replace(/("""|```)$/, "").trim();
  }
  return cleaned;
}

// --- Generador de Gemini ---
async function callGemini(
  modelName: string,
  text: string,
  level: HumanizationLevel,
  language: Language
): Promise<string> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_GEMINI_API_KEY no configurada");

  const genAI = new GoogleGenerativeAI(apiKey);
  const promptData = buildHumanizePrompt(text, level, language);

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: promptData.system,
    generationConfig: {
      temperature: level === "strong" ? 0.95 : level === "moderate" ? 0.85 : 0.7,
      topP: 0.95,
    },
  });

  const result = await model.generateContent(promptData.user);
  const response = result.response;
  const humanized = response.text();

  if (!humanized || humanized.trim().length === 0) {
    throw new Error(`${modelName} ha retornat una resposta buida`);
  }

  return cleanOutput(humanized);
}

// --- Generador de Groq ---
async function callGroq(
  modelName: string,
  text: string,
  level: HumanizationLevel,
  language: Language
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY no configurada");

  const groq = new Groq({ apiKey });
  const { system, user } = buildHumanizePrompt(text, level, language);

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    model: modelName,
    temperature: level === "strong" ? 0.95 : level === "moderate" ? 0.85 : 0.7,
    max_tokens: 8192,
  });

  const humanized = completion.choices[0]?.message?.content;

  if (!humanized || humanized.trim().length === 0) {
    throw new Error(`Groq (${modelName}) ha retornat una resposta buida`);
  }

  return cleanOutput(humanized);
}

// --- Cadena intel·ligent amb esgotament de tokens i fallback automàtic entre models ---
export async function humanizeText(
  text: string,
  level: HumanizationLevel,
  language: Language
): Promise<AIResult> {
  const hasGeminiKey = Boolean(process.env.GOOGLE_GEMINI_API_KEY);
  const hasGroqKey = Boolean(process.env.GROQ_API_KEY);

  if (!hasGeminiKey && !hasGroqKey) {
    throw new Error(
      "Cal configurar almenys una clau d'API gratuïta (GOOGLE_GEMINI_API_KEY o GROQ_API_KEY) a .env."
    );
  }

  // Llista ordenada de models per a esgotar quotes de manera òptima:
  // 1. Gemini 2.5 Flash (ràpid, gratuït, màxima comprensió multilingüe)
  // 2. Groq GPT-OSS 120B (màxima capacitat sintàctica lliure)
  // 3. Gemini Flash Latest (quota de producció de Google)
  // 4. Groq Qwen 3.8 27B (extraordinària fluïdesa en català i castellà)
  // 5. Gemini 2.5 Flash Lite (quota addicional independent)
  // 6. Groq GPT-OSS 20B (alta velocitat)
  const pipeline: ProviderTask[] = [
    {
      name: "Google Gemini 2.5 Flash",
      isAvailable: () => hasGeminiKey,
      execute: () => callGemini("gemini-2.5-flash", text, level, language),
    },
    {
      name: "Groq GPT-OSS 120B",
      isAvailable: () => hasGroqKey,
      execute: () => callGroq("openai/gpt-oss-120b", text, level, language),
    },
    {
      name: "Google Gemini Flash",
      isAvailable: () => hasGeminiKey,
      execute: () => callGemini("gemini-flash-latest", text, level, language),
    },
    {
      name: "Groq Qwen 3.8 27B",
      isAvailable: () => hasGroqKey,
      execute: () => callGroq("qwen/qwen3.8-27b", text, level, language),
    },
    {
      name: "Google Gemini 2.5 Flash Lite",
      isAvailable: () => hasGeminiKey,
      execute: () => callGemini("gemini-2.5-flash-lite", text, level, language),
    },
    {
      name: "Groq GPT-OSS 20B",
      isAvailable: () => hasGroqKey,
      execute: () => callGroq("openai/gpt-oss-20b", text, level, language),
    },
  ];

  const errors: { model: string; error: string }[] = [];

  for (const step of pipeline) {
    if (!step.isAvailable()) continue;

    try {
      console.log(`[AI-Pipeline] Provant model: ${step.name}...`);
      const output = await step.execute();
      console.log(`[AI-Pipeline] Èxit amb: ${step.name}`);
      return {
        text: output,
        model: step.name,
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[AI-Pipeline] ${step.name} no disponible: ${errMsg}. Provant següent...`);
      errors.push({ model: step.name, error: errMsg });
    }
  }

  const summary = errors.map((e) => `${e.model}: ${e.error}`).join(" | ");
  throw new Error(`S'han exhaurit les quotes de tots els models. Detalls: ${summary}`);
}
