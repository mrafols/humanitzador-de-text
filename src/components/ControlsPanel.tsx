"use client";

import { HumanizationLevel, Language } from "@/types";
import { cn } from "@/lib/utils";

interface ControlsPanelProps {
  level: HumanizationLevel;
  onLevelChange: (level: HumanizationLevel) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onHumanize: () => void;
  isLoading: boolean;
  hasText: boolean;
}

const levels: { value: HumanizationLevel; label: string; desc: string; color: string }[] = [
  {
    value: "subtle",
    label: "🌱 Subtil",
    desc: "Canvis lleugers, estil conservat",
    color: "from-green-500/20 to-green-600/20 border-green-400/40 text-green-300",
  },
  {
    value: "moderate",
    label: "⚡ Moderat",
    desc: "Reescriptura significativa",
    color: "from-yellow-500/20 to-orange-600/20 border-yellow-400/40 text-yellow-300",
  },
  {
    value: "strong",
    label: "🔥 Intens",
    desc: "Transformació completa",
    color: "from-red-500/20 to-pink-600/20 border-red-400/40 text-red-300",
  },
];

const languages: { value: Language; flag: string; label: string }[] = [
  { value: "ca", flag: "🏴󠁥󠁳󠁣󠁴󠁿", label: "Català" },
  { value: "es", flag: "🇪🇸", label: "Castellà" },
  { value: "en", flag: "🇬🇧", label: "Anglès" },
];

export default function ControlsPanel({
  level,
  onLevelChange,
  language,
  onLanguageChange,
  onHumanize,
  isLoading,
  hasText,
}: ControlsPanelProps) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-6">
      {/* Nivell */}
      <div>
        <label className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3 block">
          Nivell d&apos;Humanització
        </label>
        <div className="space-y-2">
          {levels.map((l) => (
            <button
              key={l.value}
              onClick={() => onLevelChange(l.value)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl border bg-gradient-to-r transition-all duration-200",
                level === l.value
                  ? `${l.color} ring-1 ring-white/20`
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
              )}
            >
              <div className="font-medium text-sm">{l.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{l.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Idioma */}
      <div>
        <label className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3 block">
          Idioma del Text
        </label>
        <div className="grid grid-cols-3 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => onLanguageChange(lang.value)}
              className={cn(
                "py-2 px-2 rounded-xl border text-center transition-all duration-200 text-sm",
                language === lang.value
                  ? "border-purple-400/60 bg-purple-500/20 text-purple-300"
                  : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
              )}
            >
              <div className="text-lg">{lang.flag}</div>
              <div className="text-xs mt-0.5 font-medium">{lang.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Botó principal */}
      <button
        onClick={onHumanize}
        disabled={isLoading || !hasText}
        className={cn(
          "w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200",
          "bg-gradient-to-r from-purple-600 to-pink-600",
          "hover:from-purple-500 hover:to-pink-500",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-pink-600",
          "text-white shadow-lg shadow-purple-500/25",
          "active:scale-95",
          isLoading && "animate-pulse"
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Humanitzant...
          </span>
        ) : (
          "✨ Humanitzar Text"
        )}
      </button>

      {/* Info */}
      <div className="bg-white/5 rounded-xl p-3 space-y-2">
        <p className="text-white/40 text-xs font-medium">ℹ️ Com funciona</p>
        <ul className="text-white/30 text-xs space-y-1">
          <li>• Varia estructura de frases</li>
          <li>• Afegeix connectors naturals</li>
          <li>• Elimina patrons d&apos;IA</li>
          <li>• Preserva el significat original</li>
        </ul>
      </div>
    </div>
  );
}
