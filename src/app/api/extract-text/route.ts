import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autenticat. Si us plau, inicia sessió." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Cap fitxer rebut." },
        { status: 400 }
      );
    }

    const fileName = file.name || "document";
    const fileType = file.type || "";
    const buffer = Buffer.from(await file.arrayBuffer());

    let extractedText = "";

    // PDF (.pdf)
    if (
      fileType === "application/pdf" ||
      fileName.toLowerCase().endsWith(".pdf")
    ) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfModule = require("pdf-parse");
        if (typeof pdfModule === "function") {
          const pdfData = await pdfModule(buffer);
          extractedText = pdfData.text || "";
        } else if (pdfModule?.PDFParse) {
          const parser = new pdfModule.PDFParse({ data: buffer });
          const res = await parser.getText();
          extractedText = res?.text || "";
          if (parser.destroy) await parser.destroy();
        } else if (pdfModule?.default) {
          if (typeof pdfModule.default === "function") {
            const pdfData = await pdfModule.default(buffer);
            extractedText = pdfData.text || "";
          } else if (pdfModule.default?.PDFParse) {
            const parser = new pdfModule.default.PDFParse({ data: buffer });
            const res = await parser.getText();
            extractedText = res?.text || "";
            if (parser.destroy) await parser.destroy();
          }
        }
      } catch (pdfErr) {
        console.error("Error parsing PDF:", pdfErr);
        return NextResponse.json(
          { error: "Error en processar el fitxer PDF. Comprova que no tingui contrasenya ni estigui corrupte." },
          { status: 422 }
        );
      }
    }
    // DOCX (.docx)
    else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.toLowerCase().endsWith(".docx")
    ) {
      try {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || "";
      } catch (docxErr) {
        console.error("Error parsing DOCX:", docxErr);
        return NextResponse.json(
          { error: "Error en extreure el text del document Word (.docx)." },
          { status: 422 }
        );
      }
    }
    // Plain text / Markdown (.txt, .md, etc.)
    else if (
      fileType.startsWith("text/") ||
      fileName.toLowerCase().endsWith(".txt") ||
      fileName.toLowerCase().endsWith(".md")
    ) {
      extractedText = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "Format no suportat. Admetem PDF (.pdf), Word (.docx) i text pla (.txt)." },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "El document sembla estar buit o conté només imatges sense text extret." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text: extractedText.trim(),
      fileName,
      fileType,
      charCount: extractedText.trim().length,
    });
  } catch (error) {
    console.error("Extract text API error:", error);
    return NextResponse.json(
      { error: "Error intern en extreure el text del fitxer." },
      { status: 500 }
    );
  }
}
