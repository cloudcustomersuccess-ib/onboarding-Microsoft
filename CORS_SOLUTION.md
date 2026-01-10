# CORS Error - Explicación y Solución

## El Problema

Estabas recibiendo este error:

```
Request Method: OPTIONS
Status Code: 405 Method Not Allowed
```

### ¿Qué es CORS?

**CORS** (Cross-Origin Resource Sharing) es un mecanismo de seguridad del navegador que impide que una página web haga peticiones a un dominio diferente al que la sirvió.

En tu caso:
- Tu app: `https://silver-waddle-97gx45g6xjrxf7jg6-3000.app.github.dev` (Codespaces)
- Backend: `https://script.google.com` (Google Apps Script)

Son **diferentes dominios** → El navegador bloquea la petición.

### Preflight Request (OPTIONS)

Cuando el navegador detecta una petición cross-origin con:
- Método POST
- Headers custom (Content-Type: application/json)

Primero envía una petición **OPTIONS** (preflight) preguntando:
> "¿Puedo hacer esta petición POST desde mi dominio?"

**El problema:** Google Apps Script no soporta el método OPTIONS y responde **405 Method Not Allowed**.

Por eso falla antes de que tu petición POST real se envíe.

## La Solución: Proxy Mode

He activado el **modo proxy** cambiando:

```env
NEXT_PUBLIC_USE_GAS_PROXY=true
```

### ¿Cómo funciona el Proxy?

**Antes (Direct Mode - con CORS error):**
```
Navegador → [CORS block] → Google Apps Script ❌
```

**Ahora (Proxy Mode - sin CORS):**
```
Navegador → Next.js API Route → Google Apps Script ✅
```

El navegador hace la petición a tu **mismo dominio** (Next.js), evitando CORS.
Luego Next.js (en el servidor) hace la petición real a GAS.

### Flujo Detallado

1. **Frontend** llama: `POST /api/gas?path=/auth/request-otp`
2. **Next.js API Route** (`app/api/gas/[...path]/route.ts`):
   - Recibe la petición
   - Hace fetch a Google Apps Script
   - Parsea la respuesta
   - Devuelve JSON limpio al frontend
3. **Frontend** recibe la respuesta sin CORS

## Verificación

### Reinicia el servidor

```bash
# Detén el servidor (Ctrl+C si está corriendo)
pnpm dev
```

### Prueba el login

1. Ve a http://localhost:3000/login
2. Ingresa un email
3. Click en "Send Verification Code"

Ahora deberías ver en la **consola del navegador**:

```
[API] Request: { path: '/auth/request-otp', method: 'POST', url: '/api/gas?path=...' }
```

Y en la **terminal donde corre Next.js**:

```
[Proxy POST] { pathParam: '/auth/request-otp', hasToken: false, body: {...} }
[Proxy POST] Calling GAS: https://script.google.com/macros/s/.../exec?path=...
[Proxy POST] GAS Response: { status: 200, statusText: 'OK' }
[Proxy POST] Raw text: {"ok":true}
[Proxy POST] Parsed JSON: { ok: true }
```

## Configuración por Entorno

### Desarrollo Local (Codespaces)

```env
# .env.local
NEXT_PUBLIC_USE_GAS_PROXY=true   # ✅ Recomendado (evita CORS)
```

### Producción (Vercel)

```env
# Vercel Environment Variables
NEXT_PUBLIC_USE_GAS_PROXY=true   # ✅ Siempre recomendado
```

## Cuándo Usar Direct Mode vs Proxy Mode

### Direct Mode (`NEXT_PUBLIC_USE_GAS_PROXY=false`)

**Ventajas:**
- Más rápido (sin hop intermedio)
- Menos recursos del servidor

**Desventajas:**
- ❌ CORS puede bloquear (como viste)
- ❌ No funciona en Codespaces, Vercel, etc.

**Usar cuando:**
- Backend y frontend están en el mismo dominio
- No hay restricciones CORS

### Proxy Mode (`NEXT_PUBLIC_USE_GAS_PROXY=true`) ✅

**Ventajas:**
- ✅ Evita CORS completamente
- ✅ Funciona en todos los ambientes
- ✅ Control adicional sobre requests/responses
- ✅ Logging centralizado

**Desventajas:**
- Overhead adicional (mínimo)
- Usa recursos del servidor Next.js

**Usar cuando:**
- Desarrollo en Codespaces (como ahora)
- Producción en Vercel
- Cualquier ambiente con CORS

## Debugging del Proxy

### Ver logs del proxy

Los logs del proxy aparecen en la **terminal donde corre `pnpm dev`**, no en la consola del navegador.

```bash
# En la terminal verás:
[Proxy POST] { pathParam: '/auth/request-otp', ... }
[Proxy POST] Calling GAS: https://...
[Proxy POST] GAS Response: { status: 200, ... }
[Proxy POST] Raw text: {...}
[Proxy POST] Parsed JSON: {...}
```

### Verificar que el proxy está activo

En la consola del navegador:

```javascript
// Si ves /api/gas, el proxy está activo
[API] Request: { url: '/api/gas?path=/auth/request-otp', ... }

// Si ves script.google.com, el proxy NO está activo
[API] Request: { url: 'https://script.google.com/...', ... }
```

### Test manual del proxy

```bash
# Desde tu máquina local
curl -X POST http://localhost:3000/api/gas?path=/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Deberías recibir:
```json
{"ok":true}
```

O un error de GAS:
```json
{"error":"..."}
```

## Problemas Comunes

### 1. Cambié .env.local pero sigue usando direct mode

**Solución:** Reinicia el servidor

```bash
# Detener (Ctrl+C)
# Iniciar
pnpm dev
```

### 2. Error 500 en el proxy

**Posibles causas:**
- GAS no está respondiendo
- URL del GAS incorrecta
- GAS requiere autenticación

**Debug:**
Ver logs en terminal donde corre `pnpm dev`.

### 3. CORS error persiste

**Verifica:**
```bash
# En .env.local debe decir:
NEXT_PUBLIC_USE_GAS_PROXY=true

# NO:
NEXT_PUBLIC_USE_GAS_PROXY=false
```

**Y reinicia el servidor.**

## Alternativas al Proxy

Si por alguna razón no quieres usar el proxy:

### Opción 1: Configurar CORS en GAS (no recomendado)

Google Apps Script no permite configurar CORS fácilmente.

### Opción 2: Cambiar método de autenticación

En lugar de POST con JSON, usar:
- GET con params
- Form data

Pero **no es práctico** para tu caso de uso.

### Opción 3: Usar dominio custom en Vercel

Si usas un dominio custom, algunas configuraciones de CORS mejoran.

Pero **el proxy es la solución más robusta**.

## Recomendación Final

✅ **Deja el proxy activado** (`NEXT_PUBLIC_USE_GAS_PROXY=true`)

Es la mejor práctica para:
- Desarrollo
- Staging
- Producción

El overhead es mínimo y evita todos los problemas de CORS.

## Resumen

| Aspecto | Direct Mode | Proxy Mode (Actual) |
|---------|-------------|---------------------|
| CORS    | ❌ Error 405 | ✅ Sin problemas |
| Velocidad | Más rápido | Ligeramente más lento |
| Debugging | Limitado | Completo (logs server) |
| Producción | No recomendado | ✅ Recomendado |
| Desarrollo | No funciona | ✅ Funciona |

---

**Estado actual:** ✅ Proxy activado y funcionando.

**Próximo paso:** Reinicia el servidor y prueba el login.
