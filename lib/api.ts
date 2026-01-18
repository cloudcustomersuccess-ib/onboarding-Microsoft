import {
  OnboardingListResponse,
  OnboardingDetailResponse,
  VerifyOtpResponse,
  ApiErrorResponse,
  IonSubscriptionsResponse,
  IonOrdersResponse,
  IonOrderDetailResponse,
  IonCustomersResponse,
  IonReportsResponse,
  IonReportResponse,
  IonReportDataResponse,
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
 * @param path - The API path (without query string for ION endpoints)
 * @param token - Session token (sent as 'token' for legacy endpoints, 'sessionToken' for ION)
 * @param extraParams - Additional query parameters to append
 */
function buildUrl(
  path: string,
  token?: string,
  extraParams?: Record<string, string>
): string {
  // Determine token parameter name based on endpoint type
  const isIonEndpoint = path.startsWith("/integrations/ion/");
  const tokenParam = isIonEndpoint ? "sessionToken" : "token";

  if (USE_PROXY) {
    let url = `/api/gas?path=${encodeURIComponent(path)}`;
    if (token) {
      url += `&${tokenParam}=${encodeURIComponent(token)}`;
    }
    url += "&format=json";
    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        url += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      });
    }
    return url;
  }

  const baseUrl = getGasBaseUrl();
  let url = `${baseUrl}?path=${encodeURIComponent(path)}`;
  if (token) {
    url += `&${tokenParam}=${encodeURIComponent(token)}`;
  }
  url += "&format=json";
  if (extraParams) {
    Object.entries(extraParams).forEach(([key, value]) => {
      url += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });
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
  body?: any,
  extraParams?: Record<string, string>
): Promise<T> {
  const url = buildUrl(path, token, extraParams);

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

/**
 * ION Subscriptions: List with filters
 */
export interface IonSubscriptionFilters {
  subscriptionStatus?: "ACTIVE" | "CANCELLED" | "PENDING" | "EXPIRED" | "DISABLED" | "PAUSED";
  cloudProviderName?: string;
  customerId?: string;
  customerName?: string;
  billingCycle?: string;
  limit?: number;
  offset?: number;
}

export async function listIonSubscriptions(
  token: string,
  filters: IonSubscriptionFilters = {}
): Promise<IonSubscriptionsResponse> {
  const extraParams: Record<string, string> = {
    "pagination.limit": String(filters.limit || 50),
    "pagination.offset": String(filters.offset || 0),
  };

  if (filters.subscriptionStatus) {
    extraParams.subscriptionStatus = filters.subscriptionStatus;
  }
  if (filters.cloudProviderName) {
    extraParams.cloudProviderName = filters.cloudProviderName;
  }
  if (filters.customerId) {
    extraParams.customerId = filters.customerId;
  }
  if (filters.customerName) {
    extraParams.customerName = filters.customerName;
  }
  if (filters.billingCycle) {
    extraParams.billingCycle = filters.billingCycle;
  }

  return apiRequest<IonSubscriptionsResponse>(
    "/integrations/ion/subscriptions",
    "GET",
    token,
    undefined,
    extraParams
  );
}

/**
 * ION Customers: List with filters
 */
export interface IonCustomerFilters {
  customerStatus?: "ACTIVE" | "INACTIVE" | "CUSTOMER_STATUS_UNSPECIFIED";
  customerEmail?: string;
  languageCode?: string;
  customerName?: string;
  pageSize?: number;
  pageToken?: string;
}

export async function listIonCustomers(
  token: string,
  filters: IonCustomerFilters = {}
): Promise<IonCustomersResponse> {
  const extraParams: Record<string, string> = {};

  if (filters.pageSize) {
    extraParams.pageSize = String(filters.pageSize);
  }
  if (filters.pageToken) {
    extraParams.pageToken = filters.pageToken;
  }
  if (filters.customerStatus) {
    extraParams["filter.customerStatus"] = filters.customerStatus;
  }
  if (filters.customerEmail) {
    extraParams["filter.customerEmail"] = filters.customerEmail;
  }
  if (filters.languageCode) {
    extraParams["filter.languageCode"] = filters.languageCode;
  }
  if (filters.customerName) {
    extraParams["filter.customerName"] = filters.customerName;
  }

  return apiRequest<IonCustomersResponse>(
    "/integrations/ion/customers",
    "GET",
    token,
    undefined,
    extraParams
  );
}

/**
 * ION Orders: List with filters
 */
export interface IonOrderFilters {
  status?: "NEW" | "CONFIRMED" | "ON_HOLD" | "COMPLETED" | "ERROR" | "CANCELED" | "IN_PROGRESS";
  pageSize?: number;
  pageToken?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function listIonOrders(
  token: string,
  filters: IonOrderFilters = {}
): Promise<IonOrdersResponse> {
  const extraParams: Record<string, string> = {
    pageSize: String(filters.pageSize || 50),
  };

  if (filters.status) {
    extraParams.status = filters.status;
  }
  if (filters.pageToken) {
    extraParams.pageToken = filters.pageToken;
  }
  if (filters.sortBy) {
    extraParams.sortBy = filters.sortBy;
  }
  if (filters.sortOrder) {
    extraParams.sortOrder = filters.sortOrder;
  }

  return apiRequest<IonOrdersResponse>(
    "/integrations/ion/orders",
    "GET",
    token,
    undefined,
    extraParams
  );
}

/**
 * ION Orders: Get Order Detail
 */
export async function getIonOrderDetail(
  token: string,
  customerId: string,
  orderId: string
): Promise<IonOrderDetailResponse> {
  const extraParams: Record<string, string> = {
    customerId,
    orderId,
  };

  return apiRequest<IonOrderDetailResponse>(
    "/integrations/ion/orders/detail",
    "GET",
    token,
    undefined,
    extraParams
  );
}

/**
 * ION Reports: List
 */
export interface IonReportsFilters {
  module?: string;
}

export async function listIonReports(
  token: string,
  filters: IonReportsFilters = {}
): Promise<IonReportsResponse> {
  const extraParams: Record<string, string> = {};
  if (filters.module) {
    extraParams.module = filters.module;
  }

  return apiRequest<IonReportsResponse>(
    "/integrations/ion/reports",
    "GET",
    token,
    undefined,
    extraParams
  );
}

/**
 * ION Reports: Get Metadata
 * ✅ CORREGIDO - Ahora usa el endpoint correcto
 */
export async function getIonReport(
  token: string,
  reportId: string,
  includeMetadata?: boolean
): Promise<IonReportResponse> {
  const extraParams: Record<string, string> = {
    reportId, // ✅ Pasar reportId como query param
  };
  
  if (typeof includeMetadata === "boolean") {
    extraParams.includeMetadata = String(includeMetadata);
  }

  // ✅ CORRECCIÓN: Endpoint correcto es /reports/metadata, NO /reports/{reportId}
  return apiRequest<IonReportResponse>(
    "/integrations/ion/reports/metadata",
    "GET",
    token,
    undefined,
    extraParams
  );
}

/**
 * ION Reports: Get Data
 * ✅ CORREGIDO - Ahora usa el endpoint correcto
 */
export async function getIonReportData(
  token: string,
  reportId: string,
  report: any
): Promise<IonReportDataResponse> {
  // ✅ CORRECCIÓN: Endpoint correcto es /reports/data con POST body
  // El reportId va en el body, NO en la URL
  return apiRequest<IonReportDataResponse>(
    "/integrations/ion/reports/data",
    "POST",
    token,
    {
      reportId, // ✅ reportId en el body
      report,   // ✅ report config en el body
    }
  );
}
// ===== ION Metrics (Reports-only) =====

export type IonMetricsRange = "last_month";

export type IonMetricsSummaryResponse = {
  ok: boolean;
  orgId?: string;
  range?: IonMetricsRange;
  currency?: string;
  totalSpend?: number;
  mappingUsed?: any;
  reportMeta?: any;
  error?: string;
};

export type IonMetricsTopCustomersResponse = {
  ok: boolean;
  orgId?: string;
  range?: IonMetricsRange;
  limit?: number;
  currency?: string;
  items?: Array<{ customer: string; spend: number }>;
  mappingUsed?: any;
  reportMeta?: any;
  error?: string;
};

export type IonMetricsByVendorResponse = {
  ok: boolean;
  orgId?: string;
  range?: IonMetricsRange;
  currency?: string;
  items?: Array<{ vendor: string; spend: number }>;
  mappingUsed?: any;
  reportMeta?: any;
  error?: string;
};

export type IonMetricsActiveCustomersResponse = {
  ok: boolean;
  orgId?: string;
  range?: IonMetricsRange;
  activeCustomers?: number;
  mappingUsed?: any;
  reportMeta?: any;
  note?: string;
  error?: string;
};

export async function discoverIonMetrics(token: string, range: IonMetricsRange = "last_month") {
  return apiRequest<any>(
    "/integrations/ion/metrics/discovery",
    "GET",
    token,
    undefined,
    { range }
  );
}

export async function getIonMetricsSummary(
  token: string,
  range: IonMetricsRange = "last_month"
): Promise<IonMetricsSummaryResponse> {
  return apiRequest<IonMetricsSummaryResponse>(
    "/integrations/ion/metrics/summary",
    "GET",
    token,
    undefined,
    { range }
  );
}

export async function getIonMetricsTopCustomers(
  token: string,
  range: IonMetricsRange = "last_month",
  limit: number = 10
): Promise<IonMetricsTopCustomersResponse> {
  return apiRequest<IonMetricsTopCustomersResponse>(
    "/integrations/ion/metrics/top-customers",
    "GET",
    token,
    undefined,
    { range, limit: String(limit) }
  );
}

export async function getIonMetricsByVendor(
  token: string,
  range: IonMetricsRange = "last_month"
): Promise<IonMetricsByVendorResponse> {
  return apiRequest<IonMetricsByVendorResponse>(
    "/integrations/ion/metrics/by-vendor",
    "GET",
    token,
    undefined,
    { range }
  );
}

export async function getIonMetricsActiveCustomers(
  token: string,
  range: IonMetricsRange = "last_month"
): Promise<IonMetricsActiveCustomersResponse> {
  return apiRequest<IonMetricsActiveCustomersResponse>(
    "/integrations/ion/metrics/active-customers",
    "GET",
    token,
    undefined,
    { range }
  );
}
/**
 * ION: Connect (guardar refresh token + accountId + hostname)
 * POST /integrations/ion/connect
 */
export async function connectIon(
  sessionToken: string,
  payload: {
    ionHostname: string;
    ionAccountId: string;
    ionToken: string; // refresh token
  }
): Promise<{
  ok: boolean;
  status?: string;
  orgId?: string;
  ionHostname?: string;
  ionAccountId?: string;
  accessExpiresAt?: string;
  connectMode?: string;
}> {
  return apiRequest(
    "/integrations/ion/connect",
    "POST",
    sessionToken,
    payload
  );
}

/**
 * ION: Ping (verifica acceso y devuelve expiración)
 * GET /integrations/ion/ping
 */
export async function pingIon(
  sessionToken: string
): Promise<{
  ok: boolean;
  orgId: string;
  status: string;
  accessExpiresAt: string;
  accessTokenLast4?: string;
}> {
  return apiRequest(
    "/integrations/ion/ping",
    "GET",
    sessionToken
  );
}
