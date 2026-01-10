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
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON response. Snippet: ${snippet}`);
    }
    throw error;
  }
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
