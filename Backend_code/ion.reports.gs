/**
 * ION - Reports API
 */
function ionReports_(req, user) {
  const orgId = getOrgIdForIon_(user);

  const rawQuery = (req && req.query) ? req.query : {};
  const cleanQuery = {};
  const internalParams = new Set(["path", "sessionToken", "token", "callback"]);

  Object.keys(rawQuery).forEach((k) => {
    if (!internalParams.has(k)) {
      cleanQuery[k] = rawQuery[k];
    }
  });

  const q = ionNormalizeReportsQuery_(cleanQuery);
  const result = ionRequest_(orgId, "GET", "/reports", { query: q });

  return {
    ok: true,
    orgId,
    data: result.data || {},
  };
}

function ionReportMetadata_(req, user, reportId) {
  const orgId = getOrgIdForIon_(user);
  reportId = String(reportId || "").trim();
  if (!reportId) throw new Error("reportId requerido");

  const rawQuery = (req && req.query) ? req.query : {};
  const cleanQuery = {};
  const internalParams = new Set(["path", "sessionToken", "token", "callback"]);

  Object.keys(rawQuery).forEach((k) => {
    if (!internalParams.has(k)) {
      cleanQuery[k] = rawQuery[k];
    }
  });

  const q = ionNormalizeReportMetadataQuery_(cleanQuery);
  const path = `/reports/${encodeURIComponent(reportId)}`;
  const result = ionRequest_(orgId, "GET", path, { query: q });

  return {
    ok: true,
    orgId,
    report: result.data || null,
  };
}

function ionReportData_(req, user, reportId) {
  const orgId = getOrgIdForIon_(user);
  reportId = String(reportId || "").trim();
  if (!reportId) throw new Error("reportId requerido");

  const body = (req && req.body && req.body.report) ? req.body.report : (req && req.body) || {};
  const path = `/reports/${encodeURIComponent(reportId)}/data`;
  const result = ionRequest_(orgId, "POST", path, { body: body });

  return {
    ok: true,
    orgId,
    data: result.data || null,
  };
}

function ionNormalizeReportsQuery_(q) {
  const out = {};
  const src = q || {};

  const map = {
    "report_module": "module",
  };

  Object.keys(src).forEach((k) => {
    const v = src[k];
    const kk = map[k] || k;
    out[kk] = v;
  });

  return out;
}

function ionNormalizeReportMetadataQuery_(q) {
  const out = {};
  const src = q || {};

  const map = {
    "include_metadata": "includeMetadata",
  };

  Object.keys(src).forEach((k) => {
    const v = src[k];
    const kk = map[k] || k;
    out[kk] = v;
  });

  return out;
}
