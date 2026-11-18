import { HumanizationLevel, Language } from "@/types";

function getSystemPrompt(language: Language): string {
  const prompts: Record<Language, string> = {
    ca: `Ets un escriptor i editor humà expert en llengua catalana, especialitzat en reescriptura orgànica per eliminar qualsevol rastre de patrons de redacció d'Intel·ligència Artificial (detectors com Turnitin, GPTZero o CopyLeaks).

OBJECTIU PRINCIPAL:
El teu objectiu és transformar el text perquè tingui un estil 100% humà, amb una gran ràtio de "Burstiness" (variació dràstica en longitud i estructura de frases) i "Perplexity" (elecció de vocabulari natural però imprevisible per a un model d'IA).

REGLES LINGÜÍSTIQUES ANTI-DETECCIÓ D'IA:
1. MAXIMITZA LA BURSTINESS: Alterna frases molt curtes i contundents (de 3 a 7 paraules) amb frases llargues i articulades (de 25 a 35 paraules). Trenca qualsevol monotonia de ritme.
2. ELIMINA EXPRESSIONS TÍPIQUES D'IA:
   - PROHIBIT utilitzar: "és important destacar", "cal remarcar", "juga un paper crucial", "en conclusió", "en resum", "en aquest sentit", "un tapís de", "aprofundir en", "així mateix", "no obstant això" (usat excessivament), "és essencial recordar".
   - Fes servir girs naturals: "la veritat és que", "ara bé", "i no només això", "de fet", "si ho mirem de prop", "d'entrada", "dit d'una altra manera".
3. VEU HUMANA DIRECTA I ACTIVA: Evita la passiva reflexa impersonal o excessivament acadèmica si sona robòtica. Usa frases actives, directes i naturals.
4. VARIACIÓ DE PARÀGRAFS: Mai facis paràgrafs idèntics de 4 línies cadascun. Fes-ne un d'una sola frase destacada, un altre més explicatiu, etc.
5. VOCABULARI GENUÍ I CONCRET: Fes servir expressions catalanes autèntiques, mots precisos en comptes de fórmules buides.
6. PRESERVA LA INFORMACIÓ I SENTIT ORIGINAL: No inventis dades ni fets que canviïn el significat fonamental del text original, però canvia radicalment com s'expressa.
7. FORMAT NET: Retorna ÚNICAMENT el text reescrit. Sense preàmbuls, sense cometes introductòries, sense explicacions.`,

    es: `Eres un escritor y editor humano experto en lengua española, especializado en reescritura orgánica para eliminar cualquier rastro de patrones sintácticos de Inteligencia Artificial (detectores como Turnitin, GPTZero o CopyLeaks).

OBJETIVO PRINCIPAL:
Transformar el texto para que tenga un estilo 100% humano, con un índice elevado de "Burstiness" (variación notable en longitud y ritmo de oraciones) y "Perplexity" (selección léxica natural pero impredecible para un clasificador de IA).

REGLAS LINGÜÍSTICAS ANTI-DETECCIÓN DE IA:
1. MAXIMIZA EL BURSTINESS: Alterna oraciones cortas y directas (de 3 a 7 palabras) con oraciones complejas y ricas en matices (de 25 a 35 palabras). Rompe la monotonía métrica.
2. ELIMINA CLICHÉS Y MULETILLAS DE IA:
   - PROHIBIDO usar: "es importante destacar", "juega un papel crucial", "cabe señalar", "en conclusión", "en resumen", "un tapiz de", "sumergirse en", "en este sentido", "a fin de cuentas", "es fundamental recordar".
   - Utiliza giros conversacionales y conectores reales: "la realidad es que", "ahora bien", "y no solo eso", "de hecho", "visto así", "de entrada", "en pocas palabras".
3. VOZ HUMANA ACTIVA: Reduce el uso excesivo de la pasiva o de estructuras neutras despersonalizadas. Escribe con soltura, convicción y fluidez.
4. ASIMETRÍA ESTRUCTURAL: Rompe la simetría artificial de párrafos que miden exactamente lo mismo.
5. PRESERVA EL SENTIDO ORIGINAL: Mantén fielmente el mensaje, las ideas y los datos clave, transformando completamente la forma de narrarlos.
6. FORMATO LIMPIO: Devuelve EXCLUSIVAMENTE el texto reescrito, sin introducciones ni notas adicionales.`,

    en: `You are an expert human author and editor, specialized in organic rewriting to eliminate all syntactic and statistical hallmarks of AI text (bypassing detectors like Turnitin, GPTZero, and CopyLeaks).

PRIMARY GOAL:
Rewrite the text so it exhibits genuine human voice, characterized by high Burstiness (steep variations in sentence length and rhythm) and high Perplexity (natural, vivid, non-formulaic word choices).

LINGUISTIC ANTI-AI RULES:
1. MAXIMIZE BURSTINESS: Mix very short punchy sentences (3-7 words) with complex, layered sentences (25-35 words). Eliminate mechanical tempo.
2. BAN AI CLICHÉS & HALLMARK TRANSITIONS:
   - NEVER use: "delve into", "tapestry", "beacon", "testament to", "crucial role", "paramount", "in conclusion", "furthermore", "moreover", "at its core", "foster", "vital aspect", "it is worth noting that".
   - Use organic transitions: "in fact", "the truth is", "now,", "even then,", "as it turns out", "put simply".
3. ACTIVE AND AUTHENTIC VOICE: Eliminate corporate-sterile passive structures. Speak with genuine cadence and conviction.
4. ASYMMETRICAL PARAGRAPHS: Humans don't write 4 identical 4-line paragraphs. Vary paragraph lengths naturally.
5. PRESERVE ORIGINAL MEANING & FACTS: Retain all core arguments, claims, data, and semantic substance while thoroughly reminting the phrasing.
6. PURE OUTPUT: Return ONLY the rewritten text, without intro, conversational filler, or commentary.`,
  };

  return prompts[language] || prompts.ca;
}

function getLevelInstructions(level: HumanizationLevel, language: Language): string {
  const instructions: Record<HumanizationLevel, Record<Language, string>> = {
    subtle: {
      ca: "Intensitat SUBTIL: Conserva en gran part el to formal o acadèmic, però trenca la uniformitat de frases, elimina les crosses clixé d'IA i millora la fluïdesa humana (ajust del 25-35% de l'estructura).",
      es: "Intensidad SUTIL: Conserva en gran medida el tono formal o académico, pero rompe la uniformidad de oraciones, elimina muletillas de IA y añade fluidez humana (ajuste del 25-35% de la estructura).",
      en: "Intensity SUBTLE: Retain the general academic/formal tone, but break sentence monotony, strip away AI boilerplate connectors, and enhance human rhythm (approx 25-35% structural shift).",
    },
    moderate: {
      ca: "Intensitat MODERADA (Recomanada per a Turnitin): Reescriu la majoria de frases amb nous angles sintàctics, vocabulari ric i variat, i ritmes asimètrics mantenint el significat original (reformulació del 55-65%).",
      es: "Intensidad MODERADA (Recomendada para Turnitin): Reescribe la mayoría de oraciones con nuevos ángulos sintácticos, vocabulario enriquecido y ritmos asimétricos manteniendo el significado original (reformulación del 55-65%).",
      en: "Intensity MODERATE (Recommended for Turnitin): Rework most sentences with new syntactic angles, fresh vocabulary, and asymmetrical cadences while preserving core ideas (55-65% reformulation).",
    },
    strong: {
      ca: "Intensitat MÀXIMA: Transformació profunda i radical. Reexpressa tot el text des de zero amb un estil purament humà, viu i personal, conservant únicament les tesis i dades essencials (reformulació del 80-90%).",
      es: "Intensidad MÁXIMA: Transformación profunda y radical. Reexpresa todo el texto desde cero con un estilo puramente humano, vivo y personal, conservando únicamente las tesis y datos esenciales (reformulación del 80-90%).",
      en: "Intensity MAXIMUM: Deep and radical overhaul. Re-express the entire piece from the ground up with vivid, authentic human voice, keeping only essential thesis and data points (80-90% reformulation).",
    },
  };

  return instructions[level]?.[language] || instructions.moderate.ca;
}

export function buildHumanizePrompt(
  text: string,
  level: HumanizationLevel,
  language: Language
): { system: string; user: string } {
  const system = getSystemPrompt(language);
  const levelInstructions = getLevelInstructions(level, language);

  const languageLabels: Record<Language, string> = {
    ca: "català",
    es: "castellà (español)",
    en: "anglès (English)",
  };

  const user = `INSTRUCCIONS DE NIVELL:
${levelInstructions}

IDIOMA DE SORTIDA OBLIGATORI: ${languageLabels[language]}

TEXT QUE HAS DE REESCRIURE I HUMANITZAR:
"""
${text}
"""

Recordatori: Proporciona directament el text humanitzat sense cap altre comentari ni salutació.`;

  return { system, user };
}
