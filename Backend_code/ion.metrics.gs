/**
 * ION Metrics (Reports-only)
 * - Discovery + mapping por módulos preferidos
 * - Ejecución vía Reports (/reports + /reports/{id}/report + /reports/{id}/data)
 * - Cache server-side 10 minutos por org+range+metric
 *
 * Restricción: NO usar endpoints de customers/subscriptions/orders para las métricas.
 */

const ION_METRICS_CACHE_TTL_SECONDS = 600; // 10 min

const ION_METRICS_PREFERRED_MODULES = [
  "DASHBOARDS_REPORTS_MODULE",
  "V1_BILLING_REPORTS_MODULE",
  "INVOICE_REPORTS_MODULE",
  "REPORTS_REPORTS_MODULE",
];

const ION_RANGE_LAST_MONTH = "LAST_MONTH"; // mes calendario anterior (ION RelativeDateRange enum)

function ionMetricsDiscovery_(req, user) {
  const orgId = getOrgIdForIon_(user);
  const range = ionMetricsParseRange_(req);

  const mapping = ionMetricsResolveMapping_(orgId, { force: true }); // discovery real
  return { ok: true, orgId, range, mapping };
}

function ionMetricsSummary_(req, user) {
  const orgId = getOrgIdForIon_(user);
  const range = ionMetricsParseRange_(req);

  return ionMetricsWithCache_(orgId, range, "summary", function () {
    const mapping = ionMetricsResolveMapping_(orgId, {});
    const m = mapping.metrics.total_spend_last_month;

    const out = ionMetricsRunSpendTotal_(orgId, m, range);
    return { ok: true, orgId, range, ...out };
  });
}

function ionMetricsTopCustomers_(req, user) {
  const orgId = getOrgIdForIon_(user);
  const range = ionMetricsParseRange_(req);
  const limit = ionMetricsParseLimit_(req, 10);

  return ionMetricsWithCache_(orgId, range, "top_customers_" + limit, function () {
    const mapping = ionMetricsResolveMapping_(orgId, {});
    const m = mapping.metrics.top_customers_last_month;

    const out = ionMetricsRunTopCustomers_(orgId, m, range, limit);
    return { ok: true, orgId, range, limit, ...out };
  });
}

function ionMetricsByVendor_(req, user) {
  const orgId = getOrgIdForIon_(user);
  const range = ionMetricsParseRange_(req);

  return ionMetricsWithCache_(orgId, range, "by_vendor", function () {
    const mapping = ionMetricsResolveMapping_(orgId, {});
    const m = mapping.metrics.by_vendor_last_month;

    const out = ionMetricsRunByVendor_(orgId, m, range);
    return { ok: true, orgId, range, ...out };
  });
}

function ionMetricsActiveCustomers_(req, user) {
  const orgId = getOrgIdForIon_(user);
  const range = ionMetricsParseRange_(req);

  return ionMetricsWithCache_(orgId, range, "active_customers", function () {
    const mapping = ionMetricsResolveMapping_(orgId, {});
    const m = mapping.metrics.active_customers_last_month;

    const out = ionMetricsRunActiveCustomers_(orgId, m, range);
    return { ok: true, orgId, range, ...out };
  });
}

/* =========================
   Cache wrapper
   ========================= */

function ionMetricsWithCache_(orgId, range, metricKey, fn) {
  try {
    const cache = CacheService.getScriptCache();
    const cacheKey = `ion:metrics:${orgId}:${range}:${metricKey}`;
    const hit = cache.get(cacheKey);
    if (hit) return JSON.parse(hit);

    const value = fn();
    cache.put(cacheKey, JSON.stringify(value), ION_METRICS_CACHE_TTL_SECONDS);
    return value;
  } catch (e) {
    return { ok: false, error: String(e && (e.message || e)) };
  }
}

/* =========================
   Mapping + discovery
   ========================= */

function ionMetricsResolveMapping_(orgId, opts) {
  opts = opts || {};
  const force = !!opts.force;

  const cache = CacheService.getScriptCache();
  const key = `ion:metrics:mapping:${orgId}`;
  if (!force) {
    const hit = cache.get(key);
    if (hit) return JSON.parse(hit);
  }

  const discovery = ionMetricsDiscoverReports_(orgId);

  const metrics = {
    total_spend_last_month: ionPickBestReport_(discovery, "total_spend_last_month"),
    top_customers_last_month: ionPickBestReport_(discovery, "top_customers_last_month"),
    by_vendor_last_month: ionPickBestReport_(discovery, "by_vendor_last_month"),
    active_customers_last_month: ionPickBestReport_(discovery, "active_customers_last_month"),
  };

  const mapping = {
    generatedAt: now_(),
    preferredModules: ION_METRICS_PREFERRED_MODULES,
    metrics: metrics,
    // Para debugging/UI: candidatos por métrica
    candidates: discovery.candidatesByMetric,
  };

  cache.put(key, JSON.stringify(mapping), 6 * 60 * 60); // 6h
  return mapping;
}

function ionMetricsDiscoverReports_(orgId) {
  const all = [];
  const byModule = {};

  ION_METRICS_PREFERRED_MODULES.forEach(function (moduleName) {
    const res = ionListReportsByModule__(orgId, moduleName);
    const reports = (res && res.reports) ? res.reports : [];
    byModule[moduleName] = reports;
    reports.forEach(function (r) {
      all.push(Object.assign({ module: moduleName }, r));
    });
  });

  const candidatesByMetric = {
    total_spend_last_month: ionScoreReports_(all, "total_spend_last_month"),
    top_customers_last_month: ionScoreReports_(all, "top_customers_last_month"),
    by_vendor_last_month: ionScoreReports_(all, "by_vendor_last_month"),
    active_customers_last_month: ionScoreReports_(all, "active_customers_last_month"),
  };

  return { all: all, byModule: byModule, candidatesByMetric: candidatesByMetric };
}

function ionPickBestReport_(discovery, metricKey) {
  const list = discovery.candidatesByMetric[metricKey] || [];
  if (!list.length) {
    return {
      metricKey: metricKey,
      selected: null,
      note: "No candidates found. Use discovery endpoint to inspect available reports.",
    };
  }
  const best = list[0];
  return {
    metricKey: metricKey,
    module: best.module,
    reportId: best.reportId,
    reportTemplateId: best.reportTemplateId || "",
    displayName: best.displayName || "",
    category: best.category || "",
    providerIds: best.providerIds || [],
    score: best.__score || 0,
    dateRange: { kind: "relative", relativeDateRange: ION_RANGE_LAST_MONTH },
    // columnas “requeridas” (heurísticas)
    requiredColumns: ionRequiredColumnsForMetric_(metricKey),
    recommendedFilters: [],
  };
}

function ionRequiredColumnsForMetric_(metricKey) {
  if (metricKey === "total_spend_last_month") return ["cost/amount"];
  if (metricKey === "top_customers_last_month") return ["customer", "cost/amount"];
  if (metricKey === "by_vendor_last_month") return ["vendor/provider", "cost/amount"];
  if (metricKey === "active_customers_last_month") return ["customer", "(optional) cost/amount"];
  return [];
}

/* =========================
   Scoring heurístico
   ========================= */

function ionScoreReports_(reports, metricKey) {
  const scored = (reports || []).map(function (r) {
    const s = ionScoreReportForMetric_(r, metricKey);
    const out = Object.assign({}, r);
    out.__score = s;
    return out;
  });

  scored.sort(function (a, b) { return (b.__score || 0) - (a.__score || 0); });
  return scored.filter(function (r) { return (r.__score || 0) > 0; }).slice(0, 20);
}

function ionScoreReportForMetric_(r, metricKey) {
  const name = String(r && r.displayName || "").toLowerCase();
  const cat = String(r && r.category || "").toLowerCase();
  const module = String(r && r.module || "").toLowerCase();

  // base: preferencia de módulo (orden)
  const moduleBoost = (function () {
    const idx = ION_METRICS_PREFERRED_MODULES.indexOf(String(r.module || ""));
    return idx === -1 ? 0 : (20 - idx * 3);
  })();

  // tokens por métrica
  const tokens = {
    total_spend_last_month: ["dashboard", "kpi", "spend", "cost", "billing", "total", "summary", "usage"],
    top_customers_last_month: ["customer", "customers", "top", "billing customers", "usage customers", "consumption"],
    by_vendor_last_month: ["vendor", "provider", "cloud", "manufacturer", "billing by", "cost by"],
    active_customers_last_month: ["active customers", "customer count", "customers active", "active"],
  };

  const t = tokens[metricKey] || [];
  let score = 0;

  t.forEach(function (w) {
    if (name.indexOf(w) !== -1) score += 12;
    if (cat.indexOf(w) !== -1) score += 6;
  });

  // Bonus por pertenecer a billing/invoice
  if (cat.indexOf("billing") !== -1 || cat.indexOf("invoice") !== -1) score += 10;

  // Penaliza reports raros
  if (name.indexOf("test") !== -1 || name.indexOf("sample") !== -1) score -= 20;

  score += moduleBoost;

  return score;
}

/* =========================
   Ejecutores (report -> data -> output)
   ========================= */

function ionMetricsRunSpendTotal_(orgId, mappingItem, range) {
  const ctx = ionMetricsPrepareReportExecution_(orgId, mappingItem, range);
  const parsed = ionMetricsParseRows_(ctx);

  // Preferencia: si existe columna “total” agregada -> usa esa, si no suma.
  const costIdx = ionFindColumnIndex_(ctx.columns, ["total", "cost", "amount", "billing", "charge", "price"]);
  const total = ionSumByColumn_(parsed.rows, costIdx);

  return {
    mappingUsed: mappingItem,
    currency: parsed.currency || "",
    totalSpend: total,
    reportMeta: { reportId: ctx.reportId, displayName: ctx.displayName, module: ctx.module },
  };
}

function ionMetricsRunTopCustomers_(orgId, mappingItem, range, limit) {
  const ctx = ionMetricsPrepareReportExecution_(orgId, mappingItem, range);
  const parsed = ionMetricsParseRows_(ctx);

  const customerIdx = ionFindColumnIndex_(ctx.columns, ["customer", "customer_name", "reseller", "end customer", "account"]);
  const costIdx = ionFindColumnIndex_(ctx.columns, ["cost", "amount", "billing", "charge", "total", "price"]);

  const grouped = {};
  parsed.rows.forEach(function (row) {
    const name = ionCellToString_(row, customerIdx) || "Unknown";
    const val = ionCellToNumber_(row, costIdx) || 0;
    grouped[name] = (grouped[name] || 0) + val;
  });

  const items = Object.keys(grouped).map(function (k) {
    return { customer: k, spend: grouped[k] };
  });

  items.sort(function (a, b) { return b.spend - a.spend; });

  return {
    mappingUsed: mappingItem,
    currency: parsed.currency || "",
    items: items.slice(0, Math.max(1, Number(limit || 10))),
    reportMeta: { reportId: ctx.reportId, displayName: ctx.displayName, module: ctx.module },
  };
}

function ionMetricsRunByVendor_(orgId, mappingItem, range) {
  const ctx = ionMetricsPrepareReportExecution_(orgId, mappingItem, range);
  const parsed = ionMetricsParseRows_(ctx);

  const vendorIdx = ionFindColumnIndex_(ctx.columns, ["vendor", "provider", "cloud provider", "manufacturer"]);
  const costIdx = ionFindColumnIndex_(ctx.columns, ["cost", "amount", "billing", "charge", "total", "price"]);

  const grouped = {};
  parsed.rows.forEach(function (row) {
    const vendor = ionCellToString_(row, vendorIdx) || "Unknown";
    const val = ionCellToNumber_(row, costIdx) || 0;
    grouped[vendor] = (grouped[vendor] || 0) + val;
  });

  const items = Object.keys(grouped).map(function (k) {
    return { vendor: k, spend: grouped[k] };
  });

  items.sort(function (a, b) { return b.spend - a.spend; });

  return {
    mappingUsed: mappingItem,
    currency: parsed.currency || "",
    items: items,
    reportMeta: { reportId: ctx.reportId, displayName: ctx.displayName, module: ctx.module },
  };
}

function ionMetricsRunActiveCustomers_(orgId, mappingItem, range) {
  const ctx = ionMetricsPrepareReportExecution_(orgId, mappingItem, range);
  const parsed = ionMetricsParseRows_(ctx);

  // intento 1: columna count ya agregada
  const countIdx = ionFindColumnIndex_(ctx.columns, ["active customers", "customer count", "customers active", "count"]);
  if (countIdx !== -1 && parsed.rows.length) {
    // si es un reporte KPI, a veces viene 1 fila 1 valor
    const n = ionCellToNumber_(parsed.rows[0], countIdx);
    if (n != null && n >= 0) {
      return {
        mappingUsed: mappingItem,
        activeCustomers: Math.round(n),
        reportMeta: { reportId: ctx.reportId, displayName: ctx.displayName, module: ctx.module },
      };
    }
  }

  // fallback mínimo: contar customers únicos con spend > 0
  const customerIdx = ionFindColumnIndex_(ctx.columns, ["customer", "customer_name", "reseller", "end customer", "account"]);
  const costIdx = ionFindColumnIndex_(ctx.columns, ["cost", "amount", "billing", "charge", "total", "price"]);

  const seen = {};
  parsed.rows.forEach(function (row) {
    const name = ionCellToString_(row, customerIdx);
    if (!name) return;

    let ok = true;
    if (costIdx !== -1) {
      const v = ionCellToNumber_(row, costIdx) || 0;
      ok = v > 0;
    }
    if (ok) seen[name] = true;
  });

  return {
    mappingUsed: mappingItem,
    activeCustomers: Object.keys(seen).length,
    reportMeta: { reportId: ctx.reportId, displayName: ctx.displayName, module: ctx.module },
    note: "Count computed from report rows (minimal aggregation).",
  };
}

/* =========================
   Preparación de ejecución
   ========================= */

function ionMetricsPrepareReportExecution_(orgId, mappingItem, range) {
  if (!mappingItem || !mappingItem.reportId) {
    throw new Error("No report mapped for this metric. Call /integrations/ion/metrics/discovery to inspect candidates.");
  }

  const reportId = String(mappingItem.reportId);
  const module = String(mappingItem.module || "");
  const displayName = String(mappingItem.displayName || "");

  // cache de definition por org+reportId (6h)
  const cache = CacheService.getScriptCache();
  const defKey = `ion:report:def:${orgId}:${reportId}`;
  let report = null;
  const defHit = cache.get(defKey);
  if (defHit) {
    report = JSON.parse(defHit);
  } else {
    report = ionGetReportDefinition__(orgId, reportId);
    if (!report) throw new Error("Report definition not returned by ION");
    cache.put(defKey, JSON.stringify(report), 6 * 60 * 60);
  }

  const payload = ionBuildReportPayloadForRange_(report, range);
  const data = ionGetReportData__(orgId, reportId, payload);
  if (!data) throw new Error("Report data empty");

  const responseReport = data.report || report;
  const columns = ionExtractColumns_(responseReport);

  const rows = (
    (data.data && data.data.rows) ||
    data.rows ||
    []
  );

  return { reportId: reportId, module: module, displayName: displayName, report: responseReport, columns: columns, rows: rows, rawData: data };
}

function ionBuildReportPayloadForRange_(report, range) {
  const payload = JSON.parse(JSON.stringify(report || {}));
  payload.specs = payload.specs || {};
  payload.specs.dateRangeOption = payload.specs.dateRangeOption || {};
  payload.specs.dateRangeOption.selectedRange = payload.specs.dateRangeOption.selectedRange || {};

  // rango coherente: mes calendario anterior
  if (range === "last_month") {
    payload.specs.dateRangeOption.selectedRange = { relativeDateRange: ION_RANGE_LAST_MONTH };
  } else {
    // default
    payload.specs.dateRangeOption.selectedRange = { relativeDateRange: ION_RANGE_LAST_MONTH };
  }

  // (opcional) limitar filas si tu cuenta devuelve demasiadas
  payload.specs.rowsLimit = payload.specs.rowsLimit || "5000";
  return payload;
}

/* =========================
   Parsing rows + helpers
   ========================= */

function ionMetricsParseRows_(ctx) {
  const rows = Array.isArray(ctx.rows) ? ctx.rows : [];
  const currency = ionDetectCurrency_(ctx.report, rows);
  return { rows: rows, currency: currency };
}

function ionExtractColumns_(report) {
  const specs = (report && report.specs) ? report.specs : {};
  const columns =
    specs.selectedColumns ||
    specs.selected_columns ||
    specs.columns ||
    specs.allColumns ||
    specs.all_columns ||
    [];
  return Array.isArray(columns) ? columns : [];
}

function ionFindColumnIndex_(columns, hints) {
  const cols = columns || [];
  const hs = hints || [];
  for (let i = 0; i < hs.length; i++) {
    const hint = String(hs[i]).toLowerCase();
    const idx = cols.findIndex(function (c) {
      const templateId = String((c && (c.columnTemplateId || c.column_template_id)) || "").toLowerCase();
      const displayName = String((c && c.displayName) || "").toLowerCase();
      return templateId.indexOf(hint) !== -1 || displayName.indexOf(hint) !== -1;
    });
    if (idx !== -1) return idx;
  }
  return -1;
}

function ionSumByColumn_(rows, colIdx) {
  if (colIdx < 0) return 0;
  let total = 0;
  rows.forEach(function (r) {
    const v = ionCellToNumber_(r, colIdx);
    if (v != null && isFinite(v)) total += v;
  });
  return total;
}

function ionCellValues_(row) {
  if (!row) return [];
  const v = row.values || row.Values || [];
  return Array.isArray(v) ? v : [];
}

function ionCellToNumber_(row, idx) {
  const values = ionCellValues_(row);
  if (idx < 0 || idx >= values.length) return null;
  return ionValueToNumber_(values[idx]);
}

function ionCellToString_(row, idx) {
  const values = ionCellValues_(row);
  if (idx < 0 || idx >= values.length) return "";
  return ionValueToString_(values[idx]);
}

function ionValueToNumber_(value) {
  if (!value) return null;
  if (value.moneyValue && typeof value.moneyValue.value === "number") return value.moneyValue.value;
  if (typeof value.floatValue === "number") return value.floatValue;
  if (typeof value.intValue === "number") return value.intValue;
  if (typeof value.stringValue === "string") {
    const n = Number(value.stringValue);
    return isFinite(n) ? n : null;
  }
  return null;
}

function ionValueToString_(value) {
  if (!value) return "";
  if (typeof value.stringValue === "string") return value.stringValue;
  if (value.moneyValue && typeof value.moneyValue.value === "number") return String(value.moneyValue.value);
  if (typeof value.intValue === "number") return String(value.intValue);
  if (typeof value.floatValue === "number") return String(value.floatValue);
  // internalLinkValue text
  if (value.internalLinkValue && value.internalLinkValue.text) return String(value.internalLinkValue.text);
  return "";
}

function ionDetectCurrency_(report, rows) {
  const fromSpecs =
    report && report.specs && report.specs.currencyOption &&
      (report.specs.currencyOption.selected_currency && report.specs.currencyOption.selected_currency.code);

  if (fromSpecs) return String(fromSpecs);

  for (let i = 0; i < (rows || []).length; i++) {
    const values = ionCellValues_(rows[i]);
    for (let j = 0; j < values.length; j++) {
      if (values[j] && values[j].moneyValue && values[j].moneyValue.currency) {
        return String(values[j].moneyValue.currency);
      }
    }
  }
  return "";
}

/* =========================
   Params
   ========================= */

function ionMetricsParseRange_(req) {
  const q = (req && req.query) ? req.query : {};
  const r = String(q.range || "last_month").trim().toLowerCase();
  // estándar soportado: last_month
  return (r === "last_month") ? "last_month" : "last_month";
}

function ionMetricsParseLimit_(req, def) {
  const q = (req && req.query) ? req.query : {};
  const n = Number(q.limit || def || 10);
  if (!isFinite(n) || n <= 0) return def || 10;
  return Math.min(100, Math.floor(n));
}
