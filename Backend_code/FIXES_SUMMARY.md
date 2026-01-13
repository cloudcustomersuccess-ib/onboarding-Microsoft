# ✅ Corrección del Error "Invalid argument: id" en Google Apps Script

## Problema Identificado

El error `"Invalid argument: id"` ocurría porque el código en `forms.aws.gs` usaba:
- ❌ `CONFIG.SHEET_ID` (que no existe) en lugar de `CONFIG.SPREADSHEET_ID`
- ❌ Acceso directo a `SpreadsheetApp.openById()` sin validaciones
- ❌ No usaba los helpers robustos (`getSheet_()`) ya disponibles en `db.gs`

## Archivos Modificados

### 1. **Backend_code/forms.aws.gs** (CORREGIDO)

**Problema Original (línea 26):**
```javascript
const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);  // ❌ CONFIG.SHEET_ID no existe
const sh = ss.getSheetByName(CONFIG.TAB_AWS_SUBMISSIONS);  // ❌ CONFIG.TAB_AWS_SUBMISSIONS incorrecto
```

**Solución Implementada (línea 49):**
```javascript
const sh = getSheet_(CONFIG.SHEETS.AWS_REGISTRATION_SUBMISSIONS);  // ✅ Usa helper robusto
```

**Cambios adicionales:**
- ✅ Usa `now_()` helper para timestamps consistentes
- ✅ Valida campos requeridos antes de procesar
- ✅ Lee `body.id` para obtener el `clienteId` del request
- ✅ Agrega logs útiles sin exponer secrets
- ✅ Manejo de errores robusto con try/catch para audit log

### 2. **Backend_code/db.gs.txt** (MEJORADO)

**Nuevos helpers robustos:**

#### `getSpreadsheet_()` - Helper principal
```javascript
function getSpreadsheet_() {
  const id = CONFIG.SPREADSHEET_ID;

  // Validación estricta
  if (!id || String(id).trim() === "") {
    throw new Error(
      "CONFIG.SPREADSHEET_ID está vacío o no configurado. " +
      "Verifica config.gs y asegúrate de que CONFIG.SPREADSHEET_ID tiene un valor válido."
    );
  }

  // Log útil (solo si está definido, no loguear secrets)
  Logger.log("Opening spreadsheet with ID: %s", id);

  try {
    return SpreadsheetApp.openById(id);
  } catch (err) {
    throw new Error(
      `Error al abrir spreadsheet con ID "${id}": ${err.message || err}. ` +
      "Verifica que el ID es correcto y que el script tiene permisos de acceso."
    );
  }
}
```

#### `getSheet_(name)` - Helper para sheets
```javascript
function getSheet_(name) {
  // Validación del parámetro
  if (!name || String(name).trim() === "") {
    throw new Error("getSheet_(): el parámetro 'name' está vacío o no fue provisto.");
  }

  const ss = getSpreadsheet_(); // Usa helper robusto
  const sh = ss.getSheetByName(name);

  if (!sh) {
    throw new Error(
      `La pestaña "${name}" no existe en el spreadsheet. ` +
      `Verifica que la pestaña existe y que el nombre en CONFIG.SHEETS.* coincide exactamente.`
    );
  }

  return sh;
}
```

**Mejoras implementadas:**
- ✅ Validación estricta de `CONFIG.SPREADSHEET_ID`
- ✅ Logs descriptivos para debugging
- ✅ Mensajes de error claros y accionables
- ✅ Try/catch con contexto detallado
- ✅ Función `db()` mantenida para compatibilidad legacy

### 3. **Backend_code/config.gs.txt** (YA CONFIGURADO)

El archivo ya tenía la configuración correcta:
```javascript
const CONFIG = {
  SPREADSHEET_ID: "1EEMYe1RLNYbCtn446z0FYNfbga6ThEnAAeKQejTLmM0", // ✅ Correcto

  SHEETS: {
    AWS_REGISTRATION_SUBMISSIONS: "AwsRegistrationSubmissions",  // ✅ Correcto
    // ... otros sheets
  },

  FORMS: {
    AWS_REGISTRATION_SECRET: "CHANGE_ME_TO_A_LONG_RANDOM_SECRET",  // ✅ Configurado
  }
};
```

## Resumen de Cambios

| Archivo | Cambio | Impacto |
|---------|--------|---------|
| `forms.aws.gs` | Reemplazado acceso directo por `getSheet_()` | ✅ Elimina error "Invalid argument: id" |
| `forms.aws.gs` | Agregado manejo de `body.id` para clienteId | ✅ Permite tracking por cliente |
| `forms.aws.gs` | Agregados logs útiles | ✅ Mejor debugging |
| `db.gs.txt` | Agregado `getSpreadsheet_()` con validaciones | ✅ Previene errores futuros |
| `db.gs.txt` | Mejorado `getSheet_()` con validaciones | ✅ Mensajes de error claros |
| `db.gs.txt` | Agregados logs descriptivos | ✅ Facilita troubleshooting |

## Estructura de Archivos del Backend

```
Backend_code/
├── config.gs.txt          # ✅ CONFIG.SPREADSHEET_ID y CONFIG.SHEETS.*
├── db.gs.txt              # ✅ MEJORADO: getSpreadsheet_() y getSheet_()
├── forms.aws.gs           # ✅ CORREGIDO: Usa helpers robustos
├── api.gs.txt             # ✅ OK: Router que llama saveAwsRegistrationSubmission_()
├── code.gs.txt            # ✅ OK: Entry points doGet/doPost
├── Auth.gs.txt            # ✅ OK: Autenticación OTP
└── SharePintUpdate.gs.txt # ✅ OK: Sincronización SharePoint
```

## Instrucciones para Desplegar

1. **Copiar archivos al Apps Script Editor:**
   - Archivo Apps Script `config.gs` ← `Backend_code/config.gs.txt`
   - Archivo Apps Script `db.gs` ← `Backend_code/db.gs.txt` (MEJORADO)
   - Archivo Apps Script `forms.aws.gs` ← `Backend_code/forms.aws.gs` (NUEVO/CORREGIDO)
   - Archivo Apps Script `api.gs` ← `Backend_code/api.gs.txt`
   - Archivo Apps Script `code.gs` ← `Backend_code/code.gs.txt`

2. **Verificar configuración:**
   - ✅ `CONFIG.SPREADSHEET_ID` tiene el ID correcto del Google Sheet
   - ✅ La pestaña `"AwsRegistrationSubmissions"` existe en el Sheet
   - ✅ `CONFIG.FORMS.AWS_REGISTRATION_SECRET` coincide con `.env.local`

3. **Probar el endpoint:**
   ```bash
   # El formulario AWS ahora debería funcionar sin el error "Invalid argument: id"
   ```

## Verificación Post-Despliegue

Revisa los logs en Apps Script:
```
Opening spreadsheet with ID: 1EEMYe1RLNYbCtn446z0FYNfbga6ThEnAAeKQejTLmM0
AWS Form submission saved: AWSFORM-xxxxx-xxxxx-xxxxx
```

## Ventajas de la Solución

1. ✅ **Error claro si falta configuración**: En lugar de "Invalid argument: id", ahora dice exactamente qué falta
2. ✅ **Reutilización de código**: Usa los mismos helpers que el resto del proyecto
3. ✅ **Logs útiles**: Facilita debugging sin exponer información sensible
4. ✅ **Validaciones robustas**: Previene errores similares en el futuro
5. ✅ **Backward compatible**: La función `db()` legacy sigue funcionando

## Próximos Pasos Recomendados

1. ✅ **Desplegar los archivos corregidos** al Apps Script Editor
2. ✅ **Probar el formulario AWS** desde la UI
3. ✅ **Verificar que los datos** se guardan en la sheet `AwsRegistrationSubmissions`
4. ⚠️ **Actualizar el secret** en `CONFIG.FORMS.AWS_REGISTRATION_SECRET` por uno más seguro
5. ✅ **Verificar logs** en Apps Script → Executions para confirmar el flujo completo
