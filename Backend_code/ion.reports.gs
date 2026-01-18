/**
 * ION - Reports API + Reports Client helpers
 */

function ionReports_(req, user) {
  const orgId = getOrgIdForIon_(user);

  const rawQuery = (req && req.query) ? req.query : {};
  const cleanQuery = {};
  const internalParams = new Set(["path", "sessionToken", "token", "callback", "format"]);

  Object.keys(rawQuery).forEach((k) => {
    if (!internalParams.has(k)) cleanQuery[k] = rawQuery[k];
  });

  const q = ionNormalizeReportsQuery_(cleanQuery);
  const result = ionRequest_(orgId, "GET", "/reports", { query: q });

  return { ok: true, orgId, data: result.data || {} };
}

/**
 * GET /reports/{reportId}
 * (metadata ligero)
 */
function ionReportMetadata_(req, user, reportId) {
  const orgId = getOrgIdForIon_(user);
  reportId = String(reportId || "").trim();
  if (!reportId) throw new Error("reportId requerido");

  const rawQuery = (req && req.query) ? req.query : {};
  const cleanQuery = {};
  const internalParams = new Set(["path", "sessionToken", "token", "callback", "format"]);

  Object.keys(rawQuery).forEach((k) => {
    if (!internalParams.has(k)) cleanQuery[k] = rawQuery[k];
  });

  const q = ionNormalizeReportMetadataQuery_(cleanQuery);
  const path = `/reports/${encodeURIComponent(reportId)}`;
  const result = ionRequest_(orgId, "GET", path, { query: q });

  return { ok: true, orgId, report: result.data || null };
}

/**
 * POST /reports/{reportId}/report
 * (definition completo, con specs utilizable para pedir /data)
 */
function ionReportDefinition_(req, user, reportId) {
  const orgId = getOrgIdForIon_(user);
  reportId = String(reportId || "").trim();
  if (!reportId) throw new Error("reportId requerido");

  const path = `/reports/${encodeURIComponent(reportId)}/report`;
  // Normalmente no hace falta body. En caso de gateway raro, mandamos {}.
  const result = ionRequest_(orgId, "POST", path, { body: {} });

  return { ok: true, orgId, report: result.data || null };
}

/**
 * POST /reports/{reportId}/data
 */
function ionReportData_(req, user, reportId) {
  const orgId = getOrgIdForIon_(user);
  reportId = String(reportId || "").trim();
  if (!reportId) throw new Error("reportId requerido");

  const body = (req && req.body && req.body.report) ? req.body.report : (req && req.body) || {};
  const path = `/reports/${encodeURIComponent(reportId)}/data`;
  const result = ionRequest_(orgId, "POST", path, { body: body });

  return { ok: true, orgId, data: result.data || null };
}

/* =========================
   Reports client (interno)
   ========================= */

function ionListReportsByModule__(orgId, moduleName) {
  const q = {};
  if (moduleName) q.module = String(moduleName);
  const result = ionRequest_(orgId, "GET", "/reports", { query: q });
  return result.data || {};
}

function ionGetReportDefinition__(orgId, reportId) {
  const path = `/reports/${encodeURIComponent(String(reportId))}/report`;
  const result = ionRequest_(orgId, "POST", path, { body: {} });
  return result.data || null;
}

function ionGetReportData__(orgId, reportId, reportPayload) {
  const path = `/reports/${encodeURIComponent(String(reportId))}/data`;
  const result = ionRequest_(orgId, "POST", path, { body: reportPayload || {} });
  return result.data || null;
}

/* =========================
   Normalizers
   ========================= */

function ionNormalizeReportsQuery_(q) {
  const out = {};
  const src = q || {};
  const map = { "report_module": "module" };

  Object.keys(src).forEach((k) => {
    const kk = map[k] || k;
    out[kk] = src[k];
  });
  return out;
}

function ionNormalizeReportMetadataQuery_(q) {
  const out = {};
  const src = q || {};
  const map = { "include_metadata": "includeMetadata" };

  Object.keys(src).forEach((k) => {
    const kk = map[k] || k;
    out[kk] = src[k];
  });
  return out;
}
