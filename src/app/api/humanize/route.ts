import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { humanizeText } from "@/lib/ai-providers";
import { HumanizationLevel, Language } from "@/types";

export async function POST(request: Request) {
  try {
    // Verifica autenticació
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autenticat. Si us plau, inicia sessió per utilitzar l'eina." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { text, level, language } = body as {
      text: string;
      level: HumanizationLevel;
      language: Language;
    };

    // Validació
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "El text no pot estar buit." },
        { status: 400 }
      );
    }

    if (text.length > 25000) {
      return NextResponse.json(
        { error: "El text és massa llarg. El límit recomanat és de 25.000 caràcters per petició." },
        { status: 400 }
      );
    }

    const validLevels: HumanizationLevel[] = ["subtle", "moderate", "strong"];
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: "Nivell d'humanització invàlid." },
        { status: 400 }
      );
    }

    const validLanguages: Language[] = ["ca", "es", "en"];
    if (!validLanguages.includes(language)) {
      return NextResponse.json(
        { error: "Idioma no suportat. Usa català (ca), castellà (es) o anglès (en)." },
        { status: 400 }
      );
    }

    // Humanitza el text usant la cadena de models amb fallback automàtic
    const result = await humanizeText(text, level, language);

    return NextResponse.json({
      humanizedText: result.text,
      modelUsed: result.model,
      originalChars: text.length,
      humanizedChars: result.text.length,
    });
  } catch (error) {
    console.error("Humanize API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconegut";
    return NextResponse.json(
      { error: `Error en humanitzar: ${errorMessage}` },
      { status: 500 }
    );
  }
}
