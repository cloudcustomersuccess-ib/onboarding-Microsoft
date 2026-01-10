# Quick Start Guide

Guía rápida para poner en marcha el proyecto.

## Instalación Rápida

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno (ya está configurado)
# .env.local ya contiene la URL del backend de GAS

# 3. Ejecutar en desarrollo
pnpm dev

# 4. Abrir navegador
# http://localhost:3000
```

## Build y Deploy

```bash
# Build para producción
pnpm build

# Ejecutar build
pnpm start

# Deploy a Vercel (desde repo Git)
vercel
```

## Estructura de Rutas

- `/` - Landing page pública
- `/login` - Login con OTP (2 pasos)
- `/app` - Redirige a `/app/onboarding-tracker`
- `/app/onboarding-tracker` - Lista de onboardings
- `/app/onboarding-tracker/[clienteId]` - Detalle con checklist y notas
- `/app/soporte` - Página de soporte
- `/app/formacion` - Recursos de formación
- `/app/growth-news` - Noticias y novedades

## Testing del Login

Para probar el login necesitas:

1. Un usuario registrado en Google Sheets (tabla `Users`)
2. Email configurado en Power Automate para envío de OTP
3. El backend GAS desplegado y funcionando

### Flujo de Login

1. Ve a `/login`
2. Ingresa tu email
3. Recibirás un OTP de 6 dígitos por email
4. Ingresa el código
5. Serás redirigido a `/app/onboarding-tracker`

## Variables de Entorno

Archivo `.env.local`:

```env
NEXT_PUBLIC_GAS_BASE_URL=https://script.google.com/macros/s/AKfycbxMIFYo9MEN9C3AE56B184h0dW-CaVzG2-YnN1CoqHhFGfLwa_Ti3EdKuGxP4S4gfLXtQ/exec
NEXT_PUBLIC_USE_GAS_PROXY=false
```

- `NEXT_PUBLIC_GAS_BASE_URL`: URL del Google Apps Script Web App
- `NEXT_PUBLIC_USE_GAS_PROXY`:
  - `false` (default) = llamadas directas a GAS
  - `true` = usar proxy Next.js (recomendado para producción si hay CORS)

## Comandos Disponibles

```bash
pnpm dev        # Desarrollo (http://localhost:3000)
pnpm build      # Build de producción
pnpm start      # Ejecutar build de producción
pnpm lint       # Linter (si está configurado)
```

## Tecnologías Utilizadas

- **Next.js 16** (App Router)
- **TypeScript**
- **Ant Design 6** (UI)
- **pnpm** (package manager)
- **Google Apps Script** (backend)

## Arquitectura

```
Frontend (Next.js)
    ↓
[Direct/Proxy Mode]
    ↓
Google Apps Script (backend)
    ↓
Google Sheets (database)
```

## Modos de API

### Direct Mode (default)
```
Browser → GAS directamente
```

Ventajas:
- Más rápido
- Sin overhead

Desventajas:
- Puede tener CORS en algunos ambientes

### Proxy Mode
```
Browser → Next.js API Route → GAS
```

Ventajas:
- Soluciona CORS
- Control adicional

Desventajas:
- Overhead adicional
- Ligeramente más lento

Para cambiar entre modos:
```env
NEXT_PUBLIC_USE_GAS_PROXY=true   # Proxy mode
NEXT_PUBLIC_USE_GAS_PROXY=false  # Direct mode
```

## Estructura de Datos

### Session (localStorage)
```typescript
{
  token: string,        // JWT del backend
  user: {
    UserId: string,
    Email: string,
    OrganizationId?: string,
    FullName?: string,
    Role?: string
  }
}
```

### Onboarding
```typescript
{
  ClienteID: string,
  Manufacturer?: string,
  Status?: string,
  Language?: string,
  OrganizationId?: string,
  PrimaryContactEmail?: string,
  PartnerName?: string,
  UpdatedAt?: string
}
```

## Funcionalidades Principales

### 1. Login OTP
- Email → Código OTP por email → Token JWT
- Sesión guardada en localStorage
- Token enviado en cada request

### 2. Onboarding Tracker
- Lista de onboardings del usuario
- Filtros y paginación
- Click para ver detalle

### 3. Checklist Interactivo
- Campos boolean detectados automáticamente
- Switches para toggle
- Updates en tiempo real a Google Sheets
- Sync a SharePoint vía Power Automate

### 4. Sistema de Notas
- Añadir notas a onboardings
- Histórico de notas
- Scoped por tipo y visibilidad

## Troubleshooting

### Error: Module not found
```bash
# Reinstalar dependencias
rm -rf node_modules .pnpm-store
pnpm install
```

### Error: Cannot connect to backend
```bash
# Verificar .env.local
# Verificar que GAS esté desplegado
# Verificar CORS si usas direct mode
```

### Build errors
```bash
# Limpiar caché
rm -rf .next
pnpm build
```

### CORS errors en producción
```env
# Cambiar a proxy mode
NEXT_PUBLIC_USE_GAS_PROXY=true
```

## Deploy a Vercel

1. Push a GitHub
2. Importar en Vercel
3. Configurar env vars:
   - `NEXT_PUBLIC_GAS_BASE_URL`
   - `NEXT_PUBLIC_USE_GAS_PROXY=true`
4. Deploy

## Próximos Pasos

1. Probar el login con un usuario real
2. Verificar la lista de onboardings
3. Probar el checklist interactivo
4. Añadir notas
5. Personalizar estilos según branding
6. Deploy a Vercel

## Soporte

- Ver `README.md` para documentación completa
- Ver `SETUP.md` para setup detallado
- Consultar la página de Soporte en la app
