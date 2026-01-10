# Troubleshooting Guide

## Error: API request error

Si ves este error en la consola:
```
API request error: {}
at apiRequest (lib/api.ts:92:13)
```

### Diagnóstico Rápido

1. **Accede a la página de diagnósticos**: http://localhost:3000/diagnostics
2. Haz clic en "Run Diagnostics"
3. Revisa los resultados

### Causas Comunes

#### 1. Backend GAS no está desplegado o no es accesible

**Síntomas:**
- Error de red (Network error)
- HTTP 404
- CORS error

**Solución:**
1. Verifica que el Google Apps Script esté desplegado como Web App
2. Asegúrate de que el deployment esté configurado como:
   - Execute as: **Me** (tu cuenta)
   - Who has access: **Anyone** (o el nivel apropiado)
3. Verifica que la URL en `.env.local` sea la correcta
4. Prueba la URL directamente en el navegador

#### 2. CORS bloqueando la petición

**Síntomas:**
- Error CORS en consola
- `Access-Control-Allow-Origin` error

**Solución:**
Cambiar a modo proxy:

```env
# .env.local
NEXT_PUBLIC_USE_GAS_PROXY=true
```

Luego reinicia el servidor:
```bash
pnpm dev
```

#### 3. Google Apps Script requiere autenticación

**Síntomas:**
- Redirect a login de Google
- HTTP 302
- Response HTML en lugar de JSON

**Solución:**
Verifica en el deployment de GAS:
- "Who has access" debe ser "Anyone" para endpoints públicos como `/auth/request-otp`
- O implementa OAuth si es necesario

#### 4. URL del backend incorrecta

**Síntomas:**
- HTTP 404
- "Script not found"

**Solución:**
1. Ve a Google Apps Script
2. Click en "Deploy" > "Manage deployments"
3. Copia la URL del Web App
4. Actualiza `.env.local`:

```env
NEXT_PUBLIC_GAS_BASE_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec
```

5. Reinicia el servidor

#### 5. Formato de respuesta incorrecto

**Síntomas:**
- "Invalid JSON response"
- Parse error

**Solución:**
Verifica que el backend GAS use `HtmlService` para responder:

```javascript
function respond_(req, obj, status) {
  return HtmlService.createHtmlOutput(JSON.stringify(obj));
}
```

### Debugging Detallado

#### Ver logs en consola del navegador

Con las mejoras implementadas, ahora verás logs detallados:

```
[API] Request: { path: '/auth/request-otp', method: 'POST', ... }
[API] Response: { status: 200, statusText: 'OK', ... }
[API] Raw response text: {...}
[API] Parsed JSON: {...}
```

#### Verificar variables de entorno

En el navegador (consola):

```javascript
console.log({
  gasUrl: process.env.NEXT_PUBLIC_GAS_BASE_URL,
  useProxy: process.env.NEXT_PUBLIC_USE_GAS_PROXY
});
```

**Nota:** Solo funcionará si las variables tienen el prefijo `NEXT_PUBLIC_`

#### Probar endpoint directamente

```bash
# Usando curl
curl -X POST \
  'https://script.google.com/macros/s/TU_SCRIPT_ID/exec?path=/auth/request-otp' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com"}'
```

Deberías recibir:
```json
{"ok": true}
```

O un error descriptivo:
```json
{"error": "Email requerido"}
```

### Checklist de Verificación

- [ ] El servidor Next.js está corriendo (`pnpm dev`)
- [ ] El archivo `.env.local` existe y tiene las variables correctas
- [ ] La URL del GAS es correcta y termina en `/exec`
- [ ] El GAS está desplegado y accesible
- [ ] El endpoint `/auth/request-otp` existe en el GAS
- [ ] El GAS tiene permisos correctos (Anyone can access)
- [ ] No hay errores en los logs de GAS (Executions tab)

### Soluciones Específicas por Entorno

#### Desarrollo Local (Codespaces/localhost)

```env
NEXT_PUBLIC_GAS_BASE_URL=https://script.google.com/macros/s/TU_ID/exec
NEXT_PUBLIC_USE_GAS_PROXY=false  # Direct mode es OK en dev
```

#### Producción (Vercel)

```env
NEXT_PUBLIC_GAS_BASE_URL=https://script.google.com/macros/s/TU_ID/exec
NEXT_PUBLIC_USE_GAS_PROXY=true   # Recomendado para evitar CORS
```

### Testing del Backend Manualmente

#### 1. Test de request OTP

```javascript
// En consola del navegador
fetch('https://script.google.com/macros/s/TU_ID/exec?path=/auth/request-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
})
.then(r => r.text())
.then(t => console.log('Response:', t))
.catch(e => console.error('Error:', e));
```

#### 2. Test de verify OTP (requiere OTP real)

```javascript
fetch('https://script.google.com/macros/s/TU_ID/exec?path=/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', otp: '123456' })
})
.then(r => r.text())
.then(t => console.log('Response:', t));
```

### Problemas Conocidos

#### 1. Google Apps Script tiene límite de ejecuciones

**Síntoma:** Funciona intermitentemente

**Solución:**
- Espera unos minutos
- Verifica quotas en Google Cloud Console

#### 2. Next.js no recarga env vars

**Síntoma:** Cambios en `.env.local` no se aplican

**Solución:**
```bash
# Detén el servidor (Ctrl+C)
# Reinicia
pnpm dev
```

#### 3. Caché del navegador

**Síntoma:** Respuestas viejas

**Solución:**
- Abre DevTools
- Click derecho en refresh → "Empty Cache and Hard Reload"
- O usa modo incógnito

### Logs Útiles

#### En Google Apps Script

1. Ve a "Executions" en el editor de GAS
2. Filtra por "All" executions
3. Busca errores recientes
4. Click para ver stack trace

#### En Next.js

Verás logs en terminal donde corre `pnpm dev`:

```
[API] Request: ...
[API] Response: ...
```

#### En Navegador

F12 → Console → Filtra por `[API]` o `[Login]`

### Contacto y Soporte

Si después de seguir estos pasos el problema persiste:

1. Captura los logs completos de:
   - Consola del navegador (F12)
   - Terminal de Next.js
   - Executions de Google Apps Script

2. Verifica la página de diagnósticos: `/diagnostics`

3. Revisa que el backend GAS esté usando las funciones correctas según el código compartido

### Recursos Adicionales

- [Google Apps Script Web Apps](https://developers.google.com/apps-script/guides/web)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
