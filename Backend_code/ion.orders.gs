/**
 * ION - Orders API
 * Endpoint para listar pedidos de StreamOne ION
 * GET /api/v3/accounts/{accountId}/orders
 */

function ionOrders_(req, user) {
  const orgId = getOrgIdForIon_(user);

  // Filtrar parámetros internos del router
  const rawQuery = (req && req.query) ? req.query : {};
  const cleanQuery = {};

  // Lista de parámetros que son del router y NO deben ir a ION
  const internalParams = new Set(['path', 'sessionToken', 'token', 'callback']);

  Object.keys(rawQuery).forEach(k => {
    if (!internalParams.has(k)) {
      cleanQuery[k] = rawQuery[k];
    }
  });

  // Normalizar params
  const q = ionNormalizeOrdersQuery_(cleanQuery);

  // Defaults de paginación (ION Orders usa pageSize/pageToken)
  if (q["pageSize"] == null || q["pageSize"] === "") {
    q["pageSize"] = "50";
  }

  // Usar el wrapper que maneja todo
  const result = ionRequest_(orgId, "GET", "/orders", { query: q });

  return {
    ok: true,
    orgId,
    count: Array.isArray(result.data && result.data.orders) ? result.data.orders.length : undefined,
    data: {
      orders: result.data.orders || [],
      nextPageToken: result.data.nextPageToken || null,
    },
  };
}

/**
 * ION - Get Order Detail
 * GET /api/v3/accounts/{accountId}/customers/{customerId}/orders/{orderId}
 */
function ionOrderDetail_(req, user) {
  const orgId = getOrgIdForIon_(user);

  const rawQuery = (req && req.query) ? req.query : {};
  const customerId = String(rawQuery.customerId || "").trim();
  const orderId = String(rawQuery.orderId || "").trim();

  if (!customerId) throw new Error("customerId requerido");
  if (!orderId) throw new Error("orderId requerido");

  // Construir path: /customers/{customerId}/orders/{orderId}
  const path = `/customers/${encodeURIComponent(customerId)}/orders/${encodeURIComponent(orderId)}`;

  const result = ionRequest_(orgId, "GET", path, {});

  return {
    ok: true,
    orgId,
    order: result.data || null,
  };
}

/**
 * Normaliza claves de query para /orders
 */
function ionNormalizeOrdersQuery_(q) {
  const out = {};
  const src = q || {};

  // Mapeo de snake_case a camelCase/ION format
  const map = {
    "page_size": "pageSize",
    "page_token": "pageToken",
    "order_status": "status",
    "exclude_sub_accounts": "filter.excludeSubAccounts",
    "account_id_list": "filter.accountIdList",
    "customer_id_list": "filter.customerIdList",
    "provider_name_list": "filter.providerNameList",
    "sort_by": "sortBy",
    "sort_order": "sortOrder",
  };

  Object.keys(src).forEach((k) => {
    const v = src[k];
    const kk = map[k] || k;
    out[kk] = v;
  });

  return out;
}
