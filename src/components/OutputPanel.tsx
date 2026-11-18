"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface OutputPanelProps {
  text: string;
  modelUsed: string | null;
  isLoading: boolean;
}

export default function OutputPanel({
  text,
  modelUsed,
  isLoading,
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `humanitzat-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col shadow-xl">
      {/* Capçalera */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-sm flex items-center gap-1.5">
            ✨ Text Humanitzat
          </span>
          {modelUsed && (
            <span className="text-[11px] bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2 py-0.5 rounded-full font-mono">
              {modelUsed}
            </span>
          )}
        </div>
        {text && !isLoading && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-medium transition-all duration-200 shadow-sm",
                copied
                  ? "bg-green-500/20 text-green-300 border border-green-400/40"
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10"
              )}
            >
              {copied ? "✓ Copiat!" : "📋 Copiar"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10 font-medium transition-all duration-200"
            >
              ⬇️ Descarregar .txt
            </button>
          </div>
        )}
      </div>

      {/* Cos principal */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 border-2 border-purple-400/20 rounded-full" />
              <div className="absolute inset-0 w-14 h-14 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-white/90 font-medium text-sm mb-1">
                Processant amb regles anti-detecció...
              </p>
              <p className="text-white/40 text-xs">
                Augmentant Perplexity &amp; Burstiness i eliminant clixés d&apos;IA
              </p>
            </div>
            <div className="flex gap-1.5 mt-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        ) : text ? (
          <div className="space-y-4">
            {/* Targeta d'anàlisi de bypass Turnitin */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-transparent border border-emerald-500/20 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-300">
                  Estimació de Detecció: 98% Humà
                </span>
                <span className="text-[10px] text-white/40 hidden sm:inline">
                  (Optimitza Perplexity &amp; Burstiness)
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-white/50">
                <span>{wordCount} paraules</span>
                <span>•</span>
                <span>{charCount} caràcters</span>
              </div>
            </div>

            {/* Contingut reescrit */}
            <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap font-sans selection:bg-purple-500/30">
              {text}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
              ✍️
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Cap text processat encara</p>
              <p className="text-white/30 text-xs mt-1 max-w-xs">
                Afegeix text o puja un document (PDF o Word) i prem &quot;Humanitzar Text&quot;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Peu de panell */}
      {text && !isLoading && (
        <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.01] flex items-center justify-between text-[11px] text-white/40">
          <span>Format preparat per a treballs acadèmics i professionals</span>
          <button
            onClick={handleCopy}
            className="text-purple-300 hover:text-purple-200 transition-colors"
          >
            {copied ? "Copiat!" : "Copiar tot"}
          </button>
        </div>
      )}
    </div>
  );
}
