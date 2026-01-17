/**
 * ION - Customers API
 * GET /api/v3/accounts/{accountId}/customers
 */
function ionCustomers_(req, user) {
  const orgId = getOrgIdForIon_(user);

  const rawQuery = (req && req.query) ? req.query : {};
  const cleanQuery = {};
  const internalParams = new Set(["path", "sessionToken", "token", "callback", "format"]);

  Object.keys(rawQuery).forEach((k) => {
    if (!internalParams.has(k)) {
      cleanQuery[k] = rawQuery[k];
    }
  });

  const q = ionNormalizeCustomersQuery_(cleanQuery);

  if (q.pageSize == null || q.pageSize === "") {
    q.pageSize = "100";
  }

  const result = ionRequest_(orgId, "GET", "/customers", { query: q });

  return {
    ok: true,
    orgId,
    count: Array.isArray(result.data && result.data.customers) ? result.data.customers.length : undefined,
    data: {
      customers: (result.data && result.data.customers) || [],
      nextPageToken: (result.data && result.data.nextPageToken) || null,
    },
  };
}

function ionNormalizeCustomersQuery_(q) {
  const out = {};
  const src = q || {};

  const map = {
    "page_size": "pageSize",
    "page_token": "pageToken",
    "customer_status": "filter.customerStatus",
    "customer_email": "filter.customerEmail",
    "language_code": "filter.languageCode",
    "customer_name": "filter.customerName",
    "customerStatus": "filter.customerStatus",
    "customerEmail": "filter.customerEmail",
    "languageCode": "filter.languageCode",
    "customerName": "filter.customerName",
  };

  Object.keys(src).forEach((k) => {
    const v = src[k];
    const kk = map[k] || k;
    out[kk] = v;
  });

  return out;
}
