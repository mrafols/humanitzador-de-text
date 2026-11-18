"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import TextInputPanel from "@/components/TextInputPanel";
import OutputPanel from "@/components/OutputPanel";
import ControlsPanel from "@/components/ControlsPanel";
import { HumanizationLevel, Language } from "@/types";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [level, setLevel] = useState<HumanizationLevel>("moderate");
  const [language, setLanguage] = useState<Language>("ca");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-white/60 flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Carregant l&apos;aplicació...</span>
        </div>
      </div>
    );
  }

  const handleHumanize = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setOutputText("");
    setModelUsed(null);

    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, level, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en humanitzar el text");
      }

      setOutputText(data.humanizedText);
      setModelUsed(data.modelUsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconegut");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex flex-col text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col">
        {/* Banner informatiu d'estat si cal */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-400/30 rounded-2xl px-4 py-3 flex items-start gap-3 backdrop-blur shadow-lg">
            <span className="text-red-400 text-lg flex-shrink-0">⚠️</span>
            <div className="flex-1">
              <p className="text-red-300 text-sm font-semibold">Avís del procés</p>
              <p className="text-red-200/80 text-xs mt-0.5 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400/60 hover:text-red-300 transition-colors text-lg leading-none p-1"
              aria-label="Tancar error"
            >
              ×
            </button>
          </div>
        )}

        {/* Layout principal responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px_1fr] gap-4 flex-1">
          {/* Panell 1: Entrada de text o document */}
          <div className="h-full min-h-[460px]">
            <TextInputPanel
              text={inputText}
              onTextChange={setInputText}
              isLoading={isLoading}
            />
          </div>

          {/* Panell 2: Controls i paràmetres anti-detecció */}
          <div className="h-full">
            <ControlsPanel
              level={level}
              onLevelChange={setLevel}
              language={language}
              onLanguageChange={setLanguage}
              onHumanize={handleHumanize}
              isLoading={isLoading}
              hasText={inputText.trim().length > 0}
            />
          </div>

          {/* Panell 3: Sortida humanitzada */}
          <div className="h-full min-h-[460px]">
            <OutputPanel
              text={outputText}
              modelUsed={modelUsed}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Peu de pàgina informatiu */}
        <footer className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-2">
          <span>Cadena automàtica: Gemini 2.0 Flash ➔ Groq Llama 3.3 ➔ Gemini 1.5 ➔ Groq 8B</span>
          <span>Optimitzat per a desplegament a Vercel</span>
        </footer>
      </main>
    </div>
  );
}
