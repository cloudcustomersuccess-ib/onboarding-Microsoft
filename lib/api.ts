import {
  OnboardingListResponse,
  OnboardingDetailResponse,
  VerifyOtpResponse,
  ApiErrorResponse,
} from "@/types";

// Configuration
const GAS_BASE_URL = process.env.NEXT_PUBLIC_GAS_BASE_URL;
const USE_PROXY = process.env.NEXT_PUBLIC_USE_GAS_PROXY === "true";

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

/**
 * Parse response from Google Apps Script.
 * GAS returns Content-Type: text/html but body is JSON.
 */
async function parseGASResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const snippet = text.slice(0, 200);

  try {
    if (text.trim().startsWith("<!doctype html") || text.trim().startsWith("<html")) {
      const extracted = extractJsonFromGASHtml(text);
      if (extracted) {
        return extracted as T;
      }
    }

    const json = JSON.parse(text);
    if (json.error) {
      throw new Error(json.error);
    }
    return json as T;
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

/**
 * Build URL for GAS endpoint
 */
function buildUrl(path: string, token?: string): string {
  if (USE_PROXY) {
    let url = `/api/gas?path=${encodeURIComponent(path)}`;
    if (token) {
      url += `&token=${encodeURIComponent(token)}`;
    }
    return url;
  }

  const baseUrl = getGasBaseUrl();
  let url = `${baseUrl}?path=${encodeURIComponent(path)}`;
  if (token) {
    url += `&token=${encodeURIComponent(token)}`;
  }
  return url;
}

/**
 * Make API request
 */
async function apiRequest<T>(
  path: string,
  method: "GET" | "POST" | "DELETE" = "GET",
  token?: string,
  body?: any
): Promise<T> {
  const url = buildUrl(path, token);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method === "POST" && body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok && response.status >= 400) {
      const errorData = await parseGASResponse<ApiErrorResponse>(response);
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await parseGASResponse<T>(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Auth: Request OTP
 */
export async function requestOtp(email: string): Promise<{ ok: boolean }> {
  return apiRequest<{ ok: boolean }>("/auth/request-otp", "POST", undefined, {
    email,
  });
}

/**
 * Auth: Verify OTP
 */
export async function verifyOtp(
  email: string,
  otp: string
): Promise<VerifyOtpResponse> {
  const response = await apiRequest<VerifyOtpResponse>(
    "/auth/verify-otp",
    "POST",
    undefined,
    { email, otp }
  );
  return response;
}

/**
 * Onboardings: List
 */
export async function listOnboardings(
  token: string
): Promise<OnboardingListResponse> {
  return apiRequest<OnboardingListResponse>("/onboardings", "GET", token);
}

/**
 * Onboardings: Get Detail
 */
export async function getOnboardingDetail(
  token: string,
  clienteId: string
): Promise<OnboardingDetailResponse> {
  return apiRequest<OnboardingDetailResponse>(
    `/onboardings/${encodeURIComponent(clienteId)}`,
    "GET",
    token
  );
}

/**
 * Onboardings: Update Field
 */
export async function updateField(
  token: string,
  clienteId: string,
  fieldKey: string,
  value: any
): Promise<{ ok: boolean; fieldKey: string; value: any }> {
  return apiRequest<{ ok: boolean; fieldKey: string; value: any }>(
    `/onboardings/${encodeURIComponent(clienteId)}/fields`,
    "POST",
    token,
    { fieldKey, value }
  );
}

/**
 * Onboardings: Add Note
 */
export async function addNote(
  token: string,
  clienteId: string,
  payload: {
    scopeType?: string;
    substepKey?: string;
    visibility?: string;
    body: string;
  }
): Promise<{ ok: boolean; noteId: string }> {
  return apiRequest<{ ok: boolean; noteId: string }>(
    `/onboardings/${encodeURIComponent(clienteId)}/notes`,
    "POST",
    token,
    payload
  );
}

/**
 * Onboardings: Delete Note
 */
export async function deleteNote(
  token: string,
  clienteId: string,
  noteId: string
): Promise<{ ok: boolean }> {
  return apiRequest<{ ok: boolean }>(
    `/onboardings/${encodeURIComponent(clienteId)}/notes/${encodeURIComponent(noteId)}`,
    "DELETE",
    token
  );
}

/**
 * Forms: Submit AWS Registration Form
 * This endpoint is PUBLIC (no token required in path, but uses secret in body)
 */
export async function submitAwsRegistration(
  secret: string,
  clienteId: string,
  userEmail: string,
  data: {
    partnerLegalName: string;
    legalRepName: string;
    email: string;
    partnerPathType: string;
    partnerTier: string;
    apnId: string;
    solutionProvider: string;
    awsCompetency: string;
    reservedInstances: string;
    dedicatedOrg: string;
    customerDedicatedOrg: string;
    supportPlan: string;
  }
): Promise<{ ok: boolean; submissionId?: string }> {
  // Validate secret exists
  if (!secret) {
    throw new Error(
      "AWS Registration Secret no configurado. Por favor configura NEXT_PUBLIC_AWS_REGISTRATION_SECRET en .env.local"
    );
  }

  // Use existing apiRequest helper (matches project pattern)
  // apiRequest sends body as JSON automatically
  return apiRequest<{ ok: boolean; submissionId?: string }>(
    "/forms/aws-registration/save",
    "POST",
    undefined, // no token required for this public endpoint
    {
      secret,
      id: clienteId,
      userEmail,
      data,
    }
  );
}
