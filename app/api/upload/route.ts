import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 10MB limit." }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let content = "";

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const { default: pdfParse } = await import("pdf-parse");
      const parsed = await pdfParse(buffer);
      content = parsed.text;
    } else if (
      file.type.startsWith("text/") ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md")
    ) {
      content = buffer.toString("utf8");
    } else if (file.name.endsWith(".csv")) {
      const parsed = Papa.parse<Record<string, string>>(buffer.toString("utf8"), {
        header: true,
        skipEmptyLines: true,
      });
      content = JSON.stringify(parsed.data, null, 2);
    } else if (file.name.endsWith(".json") || file.type === "application/json") {
      content = JSON.stringify(JSON.parse(buffer.toString("utf8")), null, 2);
    } else {
      return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
    }

    return NextResponse.json({
      content: content.slice(0, 40_000),
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
    });
  } catch {
    return NextResponse.json({ error: "Unable to process the uploaded file." }, { status: 500 });
  }
}
