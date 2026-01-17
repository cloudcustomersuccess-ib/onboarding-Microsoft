import { NextRequest, NextResponse } from "next/server";

// ✅ Recomendado: en server puedes usar una env NO pública.
// Si aún no la tienes, esto mantiene compatibilidad con NEXT_PUBLIC_GAS_BASE_URL.
const GAS_BASE_URL =
  process.env.GAS_BASE_URL || process.env.NEXT_PUBLIC_GAS_BASE_URL;

function getGasBaseUrl(): string {
  if (!GAS_BASE_URL) {
    throw new Error(
      "GAS_BASE_URL (recommended) or NEXT_PUBLIC_GAS_BASE_URL is required. Set it in your environment."
    );
  }
  if (GAS_BASE_URL.startsWith("/")) {
    throw new Error("GAS_BASE_URL must be an absolute URL, not a relative path.");
  }
  return GAS_BASE_URL;
}

async function parseGasJson(response: Response) {
  const text = await response.text();
  const snippet = text.slice(0, 200);
  const trimmed = text.trim();

  try {
    // 1) Si viene HTML, intenta extraer JSON de varias formas
    if (trimmed.startsWith("<!doctype html") || trimmed.startsWith("<html")) {
      const extracted =
        extractJsonFromGASHtml(text) ??
        extractFirstJsonObject(text) ??
        extractJsonp(text);

      if (extracted != null) return extracted;

      throw new Error(`Invalid JSON response. Snippet: ${snippet}`);
    }

    // 2) JSONP (callback({...}))
    const jsonp = extractJsonp(trimmed);
    if (jsonp != null) return jsonp;

    // 3) JSON normal
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON response. Snippet: ${snippet}`);
    }
    throw error;
  }
}

function extractJsonFromGASHtml(text: string): unknown | null {
  const initMatch = text.match(/goog\.script\.init\("([\s\S]*?)",\s*""/);
  if (!initMatch) return null;

  const decodedInit = unescapeGasInit_(initMatch[1]);

  try {
    const initJson = JSON.parse(decodedInit);
    const userHtml =
      typeof initJson.userHtml === "string" ? initJson.userHtml : "";
    if (!userHtml) return null;

    try {
      return JSON.parse(userHtml);
    } catch {
      return { error: userHtml };
    }
  } catch {
    return null;
  }
}

// ✅ “Plan B” cuando no existe goog.script.init: extrae el primer { ... } grande del HTML
function extractFirstJsonObject(text: string): unknown | null {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return null;

  const candidate = text.slice(first, last + 1).trim();
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

// ✅ JSONP: callback(<json>)
function extractJsonp(text: string): unknown | null {
  const m = text.match(/^[\w$.]+\(([\s\S]*)\);?\s*$/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

function unescapeGasInit_(input: string): string {
  return input
    .replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/\\u([0-9A-Fa-f]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function buildGasUrl(request: NextRequest): { url: string } {
  const searchParams = request.nextUrl.searchParams;
  const pathParam = searchParams.get("path") ?? "/";
  const baseUrl = getGasBaseUrl();

  let url = `${baseUrl}?path=${encodeURIComponent(pathParam)}`;

  // ✅ Forzar format=json siempre (si el caller no lo pasa)
  if (!searchParams.has("format")) {
    url += `&format=json`;
  }

  // Forward all query params except 'path' (ya lo hemos puesto arriba)
  searchParams.forEach((value, key) => {
    if (key !== "path") {
      url += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
  });

  return { url };
}

export async function GET(request: NextRequest) {
  try {
    const { url } = buildGasUrl(request);

    const response = await fetch(url, {
      method: "GET",
      // ✅ importante: no cachear respuestas
      cache: "no-store",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await parseGasJson(response);
    return NextResponse.json(json, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Proxy error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = buildGasUrl(request);

    // ✅ Más robusto que request.json(): no revienta si viene vacío/no-JSON
    const rawBody = await request.text();
    const bodyToSend = rawBody?.length ? rawBody : "{}";

    const response = await fetch(url, {
      method: "POST",
      cache: "no-store",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyToSend,
    });

    const json = await parseGasJson(response);
    return NextResponse.json(json, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Proxy error",
      },
      { status: 500 }
    );
  }
}
