"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { HumanizationLevel, Language } from "@/types";
import { cn } from "@/lib/utils";

interface TextInputPanelProps {
  text: string;
  onTextChange: (text: string) => void;
  isLoading: boolean;
}

export default function TextInputPanel({
  text,
  onTextChange,
  isLoading,
}: TextInputPanelProps) {
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [isExtracting, setIsExtracting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsExtracting(true);
      setFileName(file.name);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/extract-text", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error en extreure el text");
        }

        onTextChange(data.text);
        setActiveTab("text");
      } catch (error) {
        alert(
          `Error: ${error instanceof Error ? error.message : "Error desconegut"}`
        );
      } finally {
        setIsExtracting(false);
      }
    },
    [onTextChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    disabled: isLoading || isExtracting,
  });

  const charCount = text.length;
  const maxChars = 10000;
  const charPercent = Math.min((charCount / maxChars) * 100, 100);

  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("text")}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors",
            activeTab === "text"
              ? "text-white bg-white/10 border-b-2 border-purple-400"
              : "text-white/50 hover:text-white/80"
          )}
        >
          ✍️ Text
        </button>
        <button
          onClick={() => setActiveTab("file")}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors",
            activeTab === "file"
              ? "text-white bg-white/10 border-b-2 border-purple-400"
              : "text-white/50 hover:text-white/80"
          )}
        >
          📎 Fitxer
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        {activeTab === "text" ? (
          <>
            <textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Enganxa aquí el text generat per IA que vols humanitzar..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-white placeholder-white/30 resize-none outline-none text-sm leading-relaxed min-h-[300px]"
              maxLength={maxChars}
            />
            {/* Progress bar caràcters */}
            <div className="mt-3 space-y-1">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    charPercent > 90
                      ? "bg-red-400"
                      : charPercent > 70
                        ? "bg-yellow-400"
                        : "bg-purple-400"
                  )}
                  style={{ width: `${charPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/40">
                <span>
                  {charCount.toLocaleString()} / {maxChars.toLocaleString()}{" "}
                  caràcters
                </span>
                {text && (
                  <button
                    onClick={() => {
                      onTextChange("");
                      setFileName(null);
                    }}
                    className="text-white/40 hover:text-red-400 transition-colors"
                  >
                    Esborrar
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              "flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-200 min-h-[300px]",
              isDragActive
                ? "border-purple-400 bg-purple-500/10"
                : "border-white/20 hover:border-purple-400/50 hover:bg-white/5",
              (isLoading || isExtracting) && "opacity-50 cursor-not-allowed"
            )}
          >
            <input {...getInputProps()} />
            {isExtracting ? (
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60 text-sm">Extraient text...</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-4">
                  {isDragActive ? "📂" : "📁"}
                </div>
                <p className="text-white font-medium mb-2">
                  {isDragActive
                    ? "Deixa anar el fitxer aquí"
                    : "Arrossega un fitxer o fes clic"}
                </p>
                <p className="text-white/40 text-sm">
                  Suporta PDF, DOCX i TXT (màx. 10MB)
                </p>
                {fileName && (
                  <div className="mt-4 bg-purple-500/20 border border-purple-400/30 rounded-lg px-4 py-2">
                    <p className="text-purple-300 text-sm">📄 {fileName}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
