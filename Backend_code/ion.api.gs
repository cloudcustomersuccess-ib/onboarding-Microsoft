/**
 * ION Integration (StreamOne® Ion v3)
 * Connect duradero usando REFRESH token.
 *
 * Connect NO usa validateAccess porque validateAccess valida ACCESS tokens.
 * La validación real es: si /oauth/token devuelve access_token, refresh token es válido.
 */

const ION_INACTIVITY_DAYS = 90;
const ION_ACCESS_SKEW_SECONDS = 60;
const ION_ENC_KEY_PROP = "ION_ENC_KEY_B64";

/**
 * POST /integrations/ion/connect
 * Body:
 * {
 *   "ionHostname": "ion.tdsynnex.com",
 *   "ionAccountId": "19875",
 *   "ionToken": "<REFRESH_TOKEN>"
 * }
 */
function ionConnect_(req, user) {
  const body = req.body || {};

  const ionHostname = String(body.ionHostname || "").trim();
  const ionAccountId = String(body.ionAccountId || "").trim();
  const ionRefreshToken = String(body.ionToken || "").trim(); // ✅ refresh token

  if (!ionHostname) throw new Error("ionHostname requerido");
  if (!ionAccountId) throw new Error("ionAccountId requerido");
  if (!ionRefreshToken) throw new Error("ionToken requerido (debe ser el REFRESH token)");

  const orgId = getOrgIdForIon_(user);
  const now = now_();

  // ✅ Lock: refresh token es single-use
  const lock = ionLock_();
  try {
    // 1) Validar refresh token refrescando a access token
    const tokenPair = ionRefreshTokens_(ionHostname, ionRefreshToken);

    const accessToken = String(tokenPair.access_token || "");
    if (!accessToken) {
      throw new Error("ION oauth/token no devolvió access_token (refresh token inválido o respuesta inesperada)");
    }

    // refresh token puede rotar (single-use). Guardar el nuevo si viene
    const refreshTokenNew = String(tokenPair.refresh_token || ionRefreshToken);

    const expiresIn = Number(tokenPair.expires_in || 0);
    const accessExpiresAtIso =
      ionIsoPlusSeconds_(expiresIn > 0 ? (expiresIn - ION_ACCESS_SKEW_SECONDS) : 0);

    // 2) Guardar en Sheets
    ionConnUpsert_(orgId, {
      ionHostname,
      ionAccountId,
      refreshTokenCiphertext: ionEncryptToken_(refreshTokenNew),
      accessTokenCiphertext: ionEncryptToken_(accessToken),
      accessExpiresAt: accessExpiresAtIso,
      lastUsedAt: now,
      lastValidatedAt: now,
      tokenLast4: refreshTokenNew.slice(-4),
      status: "connected",
      lastError: "",
      revokedAt: "",
    });

    return {
      ok: true,
      status: "connected",
      orgId,
      ionHostname,
      ionAccountId,
      accessExpiresAt: accessExpiresAtIso,
      // campo para “ver” que estás usando este código nuevo
      connectMode: "refresh_token_only_no_validateAccess",
    };
  } catch (err) {
    // Guardar error “limpio”
    ionConnUpsert_(orgId, {
      ionHostname,
      ionAccountId,
      status: "needs_reauth",
      lastError: String(err && (err.message || err)),
      lastValidatedAt: now,
    });
    throw err;
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/** POST /oauth/token (grant_type=refresh_token) */
function ionRefreshTokens_(hostname, refreshToken) {
  const url = `https://${hostname}/oauth/token`;
  const payload =
    `grant_type=refresh_token&refresh_token=${encodeURIComponent(String(refreshToken || ""))}`;

  const res = UrlFetchApp.fetch(url, {
    method: "post",
    muteHttpExceptions: true,
    contentType: "application/x-www-form-urlencoded",
    payload,
  });

  const code = res.getResponseCode();
  const text = res.getContentText() || "";

  if (code >= 200 && code < 300) {
    try { return JSON.parse(text); }
    catch (_) { throw new Error(`ION oauth/token returned non-JSON (HTTP ${code}). ${safeIonErr_(text)}`); }
  }

  throw new Error(`ION oauth/token failed (HTTP ${code}). ${safeIonErr_(text)}`);
}

/** Regla 90 días + refresh automático (para cuando empieces a llamar endpoints reales) */
function ionEnsureAccessToken_(orgId) {
  orgId = String(orgId || "").trim();
  if (!orgId) throw new Error("ionEnsureAccessToken_: orgId requerido");

  const existing = ionConnFindByOrg_(orgId);
  if (!existing) throw new Error("ION: conexión no encontrada (reconectar)");

  const conn = existing.data || {};
  const now = new Date();

  const lastUsedAt = ionParseDate_(conn.lastUsedAt);
  if (lastUsedAt && ionDaysBetween_(lastUsedAt, now) > ION_INACTIVITY_DAYS) {
    ionPurgeConnection_(orgId, "Purged due to inactivity > 90 days");
    throw new Error("ION: conexión eliminada por inactividad (>90 días). Reconfigura ION en la app.");
  }

  if (String(conn.status || "") !== "connected") {
    throw new Error(`ION: status=${conn.status || "unknown"} (reconectar)`);
  }

  const accessExpiresAt = ionParseDate_(conn.accessExpiresAt);
  if (accessExpiresAt && accessExpiresAt.getTime() > now.getTime()) {
    const access = ionDecryptToken_(String(conn.accessTokenCiphertext || ""));
    if (access) {
      ionConnUpsert_(orgId, { lastUsedAt: now_() });
      return access;
    }
  }

  const lock = ionLock_();
  try {
    const again = ionConnFindByOrg_(orgId);
    const c2 = (again && again.data) || {};

    const refresh = ionDecryptToken_(String(c2.refreshTokenCiphertext || ""));
    if (!refresh) throw new Error("ION: no hay refresh token guardado (reconectar)");

    const tokenPair = ionRefreshTokens_(String(c2.ionHostname || ""), refresh);
    const accessNew = String(tokenPair.access_token || "");
    if (!accessNew) throw new Error("ION oauth/token no devolvió access_token");

    const refreshNew = String(tokenPair.refresh_token || refresh);
    const expiresIn = Number(tokenPair.expires_in || 0);
    const accessExpiresAtIso =
      ionIsoPlusSeconds_(expiresIn > 0 ? (expiresIn - ION_ACCESS_SKEW_SECONDS) : 0);

    ionConnUpsert_(orgId, {
      refreshTokenCiphertext: ionEncryptToken_(refreshNew),
      accessTokenCiphertext: ionEncryptToken_(accessNew),
      accessExpiresAt: accessExpiresAtIso,
      lastUsedAt: now_(),
      lastValidatedAt: now_(),
      tokenLast4: refreshNew.slice(-4),
      status: "connected",
      lastError: "",
    });

    return accessNew;
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function ionPurgeConnection_(orgId, reason) {
  const now = now_();
  ionConnUpsert_(orgId, {
    refreshTokenCiphertext: "",
    accessTokenCiphertext: "",
    accessExpiresAt: "",
    status: "needs_reauth",
    revokedAt: now,
    lastError: String(reason || "Purged"),
    lastUsedAt: now,
  });
}

// ===== Encryption (sin terceros) =====
function ionEncryptToken_(plaintext) {
  plaintext = String(plaintext || "");
  if (!plaintext) return "";

  const key = ionGetOrCreateEncKeyBytes_();
  const iv = ionRandomBytes_(16);
  const pt = ionUtf8Bytes_(plaintext);
  const ct = ionXorWithKeystream_(pt, key, iv);

  const mac = Utilities.computeHmacSha256Signature(
    ionBytesConcat_(iv, ct),
    key
  );

  return JSON.stringify({
    v: 1,
    iv: Utilities.base64Encode(iv),
    ct: Utilities.base64Encode(ct),
    mac: Utilities.base64Encode(mac),
  });
}

function ionDecryptToken_(ciphertext) {
  ciphertext = String(ciphertext || "").trim();
  if (!ciphertext) return "";

  let obj;
  try { obj = JSON.parse(ciphertext); }
  catch (_) { throw new Error("ION decrypt: ciphertext no es JSON válido"); }

  const key = ionGetOrCreateEncKeyBytes_();
  const iv = Utilities.base64Decode(String(obj.iv || ""));
  const ct = Utilities.base64Decode(String(obj.ct || ""));
  const mac = Utilities.base64Decode(String(obj.mac || ""));

  const mac2 = Utilities.computeHmacSha256Signature(
    ionBytesConcat_(iv, ct),
    key
  );

  if (!ionTimingSafeEqual_(mac, mac2)) {
    throw new Error("ION decrypt: MAC inválido");
  }

  const pt = ionXorWithKeystream_(ct, key, iv);
  return ionUtf8FromBytes_(pt);
}

function ionGetOrCreateEncKeyBytes_() {
  const props = PropertiesService.getScriptProperties();
  let b64 = String(props.getProperty(ION_ENC_KEY_PROP) || "").trim();

  if (!b64) {
    const seed = `${Utilities.getUuid()}:${Date.now()}:${Math.random()}`;
    const keyBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, seed);
    b64 = Utilities.base64Encode(keyBytes);
    props.setProperty(ION_ENC_KEY_PROP, b64);
  }
  return Utilities.base64Decode(b64);
}

function ionRandomBytes_(n) {
  const seed = `${Utilities.getUuid()}:${Date.now()}:${Math.random()}`;
  const h = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, seed);
  const out = [];
  while (out.length < n) {
    for (let i = 0; i < h.length && out.length < n; i++) out.push(h[i] & 0xff);
  }
  return out;
}

function ionXorWithKeystream_(bytes, key, iv) {
  const out = [];
  let counter = 0;
  let offset = 0;

  while (offset < bytes.length) {
    const ctrBytes = ionInt32be_(counter++);
    const msg = ionBytesConcat_(iv, ctrBytes);
    const block = Utilities.computeHmacSha256Signature(msg, key);

    for (let i = 0; i < block.length && offset < bytes.length; i++) {
      out.push((bytes[offset] ^ (block[i] & 0xff)) & 0xff);
      offset++;
    }
  }
  return out;
}

function ionInt32be_(n) {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

function ionBytesConcat_(a, b) {
  return ([]).concat(a || [], b || []);
}

function ionTimingSafeEqual_(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= (a[i] ^ b[i]);
  return diff === 0;
}

function ionUtf8Bytes_(s) {
  return Utilities.newBlob(String(s), "text/plain").getBytes();
}

function ionUtf8FromBytes_(bytes) {
  return Utilities.newBlob(bytes).getDataAsString("UTF-8");
}

function safeIonErr_(text) {
  text = String(text || "");
  return text.length > 300 ? text.slice(0, 300) + "…" : text;
}

function ionIsoPlusSeconds_(seconds) {
  const d = new Date(Date.now() + Math.max(0, Number(seconds || 0)) * 1000);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}

function ionParseDate_(v) {
  if (!v) return null;
  if (v instanceof Date) return v;
  const s = String(v).trim();
  if (!s) return null;
  const isoish = s.replace(" ", "T");
  const d = new Date(isoish);
  return isNaN(d.getTime()) ? null : d;
}

function ionDaysBetween_(d1, d2) {
  const ms = Math.abs(d2.getTime() - d1.getTime());
  return ms / (1000 * 60 * 60 * 24);
}

function getOrgIdForIon_(user) {
  if (!user) throw new Error("Auth user missing");
  const orgId = String(user.OrganizationId || user.orgId || "").trim();
  if (!orgId) throw new Error("User has no OrganizationId/orgId");
  return orgId;
}

function ionLock_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  return lock;
}
function ionPing_(req, user) {
  const orgId = getOrgIdForIon_(user);

  // fuerza el flujo “real” (usa cache si vale, refresca si no)
  const access = ionEnsureAccessToken_(orgId);

  // lee el registro para devolver expiración actual
  const existing = ionConnFindByOrg_(orgId);
  const conn = (existing && existing.data) || {};

  return {
    ok: true,
    orgId,
    status: String(conn.status || ""),
    accessExpiresAt: normalizeTs_(conn.accessExpiresAt),
    accessTokenLast4: String(access || "").slice(-4),
  };
}
function normalizeTs_(v) {
  if (!v) return "";
  // Si la celda viene como Date (a veces Sheets lo devuelve así)
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  }
  // Si viene como número (serial date raro)
  if (typeof v === "number") {
    const d = new Date(Math.round((v - 25569) * 86400 * 1000)); // Excel/Sheets serial -> ms
    if (!isNaN(d.getTime())) {
      return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    }
  }
  // Si es string, lo devolvemos tal cual
  return String(v);
}
