import { NextRequest, NextResponse } from "next/server";

const GAS_BASE_URL = process.env.NEXT_PUBLIC_GAS_BASE_URL;

function getGasBaseUrl(): string {
  if (!GAS_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_GAS_BASE_URL is required. Set it in your environment."
    );
  }
  if (GAS_BASE_URL.startsWith("/")) {
    throw new Error(
      "NEXT_PUBLIC_GAS_BASE_URL must be an absolute URL, not a relative path."
    );
  }
  return GAS_BASE_URL;
}

async function parseGasJson(response: Response) {
  const text = await response.text();
  const snippet = text.slice(0, 200);

  try {
    if (text.trim().startsWith("<!doctype html") || text.trim().startsWith("<html")) {
      const extracted = extractJsonFromGASHtml(text);
      if (extracted) {
        return extracted;
      }
    }

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
  if (!initMatch) {
    return null;
  }

  const decodedInit = unescapeGasInit_(initMatch[1]);
  try {
    const initJson = JSON.parse(decodedInit);
    const userHtml = typeof initJson.userHtml === "string" ? initJson.userHtml : "";
    if (!userHtml) {
      return null;
    }
    try {
      return JSON.parse(userHtml);
    } catch {
      return { error: userHtml };
    }
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
  const token = searchParams.get("token");
  const baseUrl = getGasBaseUrl();

  let url = `${baseUrl}?path=${encodeURIComponent(pathParam)}`;
  if (token) {
    url += `&token=${encodeURIComponent(token)}`;
  }

  return { url };
}

export async function GET(request: NextRequest) {
  try {
    const { url } = buildGasUrl(request);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await parseGasJson(response);
    return NextResponse.json(json, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Proxy error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = buildGasUrl(request);
    const body = await request.json();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await parseGasJson(response);
    return NextResponse.json(json, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Proxy error" },
      { status: 500 }
    );
  }
}
