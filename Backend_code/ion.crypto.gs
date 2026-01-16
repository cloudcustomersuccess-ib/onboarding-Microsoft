/**
 * ION TOKEN CRYPTO (Apps Script)
 * - Guarda clave maestra en ScriptProperties (base64)
 * - Cifra con XOR contra keystream derivado de HMAC-SHA256 (nonce + counter)
 * - Incluye MAC (HMAC) para detectar manipulación
 */

const ION_CRYPTO_ = {
  KEY_PROP: "ION_TOKEN_KEY_B64",
  VERSION: 1,
  NONCE_BYTES: 16,
  KEY_BYTES: 32,
  MAC_BYTES: 32,
};

function ionCryptoEnsureKey_() {
  const props = PropertiesService.getScriptProperties();
  let keyB64 = props.getProperty(ION_CRYPTO_.KEY_PROP);
  if (keyB64) return keyB64;

  // Genera 32 bytes pseudo-aleatorios de forma razonable en Apps Script
  const seed = [
    Utilities.getUuid(),
    String(Date.now()),
    String(Math.random()),
    Session.getActiveUser().getEmail() || "",
  ].join("|");

  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    seed,
    Utilities.Charset.UTF_8
  ); // 32 bytes

  keyB64 = Utilities.base64Encode(digest);
  props.setProperty(ION_CRYPTO_.KEY_PROP, keyB64);
  return keyB64;
}

function ionCryptoKeyBytes_() {
  const keyB64 = ionCryptoEnsureKey_();
  const bytes = Utilities.base64Decode(keyB64);
  if (bytes.length !== ION_CRYPTO_.KEY_BYTES) {
    throw new Error("ION crypto master key invalid length.");
  }
  return bytes;
}

function ionRandomBytes_(n) {
  // Deriva bytes de SHA-256 encadenando seeds (suficiente para nonce)
  let out = [];
  let counter = 0;
  while (out.length < n) {
    const seed = `${Utilities.getUuid()}|${Date.now()}|${Math.random()}|${counter++}`;
    const block = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      seed,
      Utilities.Charset.UTF_8
    );
    out = out.concat(block);
  }
  return out.slice(0, n);
}

function ionHmac_(keyBytes, dataBytes) {
  // Devuelve bytes HMAC-SHA256
  return Utilities.computeHmacSha256Signature(dataBytes, keyBytes);
}

function ionConcatBytes_(a, b) {
  return a.concat(b);
}

function ionInt32be_(i) {
  // 4 bytes big-endian
  return [
    (i >>> 24) & 0xff,
    (i >>> 16) & 0xff,
    (i >>> 8) & 0xff,
    i & 0xff,
  ];
}

function ionXor_(a, b) {
  const out = [];
  for (let i = 0; i < a.length; i++) out.push(a[i] ^ b[i]);
  return out;
}

function ionEncryptToken_(plaintext) {
  plaintext = String(plaintext || "");
  if (!plaintext) throw new Error("Token vacío (no se puede cifrar).");

  const key = ionCryptoKeyBytes_();
  const nonce = ionRandomBytes_(ION_CRYPTO_.NONCE_BYTES);
  const pt = Utilities.newBlob(plaintext, "text/plain", "t").getBytes();

  // Keystream por bloques (32 bytes cada HMAC)
  let ct = [];
  let offset = 0;
  let counter = 0;

  while (offset < pt.length) {
    const ksBlock = ionHmac_(key, ionConcatBytes_(nonce, ionInt32be_(counter++))); // 32 bytes
    const chunk = pt.slice(offset, offset + ksBlock.length);
    const ksChunk = ksBlock.slice(0, chunk.length);
    ct = ct.concat(ionXor_(chunk, ksChunk));
    offset += chunk.length;
  }

  // MAC = HMAC(key, nonce || ciphertext)
  const mac = ionHmac_(key, ionConcatBytes_(nonce, ct));

  const envelope = {
    v: ION_CRYPTO_.VERSION,
    n: Utilities.base64Encode(nonce),
    c: Utilities.base64Encode(ct),
    t: Utilities.base64Encode(mac),
  };

  return JSON.stringify(envelope);
}

function ionDecryptToken_(ciphertext) {
  ciphertext = String(ciphertext || "");
  if (!ciphertext) throw new Error("Ciphertext vacío (no se puede descifrar).");

  let env;
  try {
    env = JSON.parse(ciphertext);
  } catch (e) {
    throw new Error("Ciphertext no es JSON válido.");
  }

  if (!env || env.v !== ION_CRYPTO_.VERSION) throw new Error("Versión de cifrado no soportada.");

  const key = ionCryptoKeyBytes_();
  const nonce = Utilities.base64Decode(String(env.n || ""));
  const ct = Utilities.base64Decode(String(env.c || ""));
  const mac = Utilities.base64Decode(String(env.t || ""));

  // Verifica MAC
  const expected = ionHmac_(key, ionConcatBytes_(nonce, ct));
  const ok = expected.length === mac.length && expected.every((b, i) => b === mac[i]);
  if (!ok) throw new Error("MAC inválido: ciphertext manipulado o clave incorrecta.");

  // Descifra (XOR simétrico)
  let pt = [];
  let offset = 0;
  let counter = 0;

  while (offset < ct.length) {
    const ksBlock = ionHmac_(key, ionConcatBytes_(nonce, ionInt32be_(counter++)));
    const chunk = ct.slice(offset, offset + ksBlock.length);
    const ksChunk = ksBlock.slice(0, chunk.length);
    pt = pt.concat(ionXor_(chunk, ksChunk));
    offset += chunk.length;
  }

  return Utilities.newBlob(pt).getDataAsString("UTF-8");
}
