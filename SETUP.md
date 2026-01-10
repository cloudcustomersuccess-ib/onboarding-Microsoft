# Setup Guide - Partner Onboarding Platform

Este documento describe los comandos exactos para inicializar el proyecto desde cero en un repositorio vacío.

## Comandos de Inicialización

### 1. Inicializar proyecto y dependencias

```bash
# Inicializar package.json
pnpm init

# Instalar Next.js, React y TypeScript
pnpm add next@latest react@latest react-dom@latest
pnpm add -D typescript @types/react @types/node @types/react-dom

# Instalar Ant Design
pnpm add antd
pnpm add @ant-design/nextjs-registry
```

### 2. Crear estructura de carpetas

```bash
# Crear estructura completa
mkdir -p app/\(public\)
mkdir -p app/login
mkdir -p app/app/onboarding-tracker/\[clienteId\]
mkdir -p app/app/soporte
mkdir -p app/app/formacion
mkdir -p app/app/growth-news
mkdir -p app/api/gas/\[...path\]
mkdir -p lib
mkdir -p types
```

### 3. Configurar scripts en package.json

Editar `package.json` y añadir:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 4. Variables de entorno

```bash
# Copiar template de variables de entorno
cp .env.local.example .env.local

# Editar .env.local con tu configuración
```

### 5. Ejecutar el proyecto

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Ejecutar build de producción
pnpm start
```

## Estructura Final de Archivos

```
.
├── app/
│   ├── (public)/
│   │   └── page.tsx                    # Landing page pública
│   ├── login/
│   │   └── page.tsx                    # Página de login OTP
│   ├── app/
│   │   ├── layout.tsx                  # Layout protegido con menú
│   │   ├── page.tsx                    # Redirect a onboarding-tracker
│   │   ├── onboarding-tracker/
│   │   │   ├── page.tsx               # Lista de onboardings
│   │   │   └── [clienteId]/
│   │   │       └── page.tsx           # Detalle con checklist y notas
│   │   ├── soporte/
│   │   │   └── page.tsx               # Página de soporte
│   │   ├── formacion/
│   │   │   └── page.tsx               # Página de formación
│   │   └── growth-news/
│   │       └── page.tsx               # Página de noticias
│   ├── api/
│   │   └── gas/
│   │       └── [...path]/
│   │           └── route.ts           # Proxy opcional a GAS
│   ├── layout.tsx                      # Root layout con AntD
│   └── globals.css                     # Estilos globales
│
├── lib/
│   ├── api.ts                          # Cliente API para GAS
│   └── session.ts                      # Gestión de sesión localStorage
│
├── types/
│   └── index.ts                        # Tipos TypeScript
│
├── middleware.ts                       # Middleware de Next.js
├── next.config.ts                      # Configuración Next.js
├── tsconfig.json                       # Configuración TypeScript
├── .env.local.example                  # Template variables de entorno
├── .env.local                          # Variables de entorno (no commitear)
├── .gitignore                          # Git ignore
├── package.json                        # Dependencias y scripts
└── README.md                           # Documentación principal
```

## Archivos Clave Creados

### 1. Configuración
- `next.config.ts` - Configuración de Next.js
- `tsconfig.json` - Configuración de TypeScript
- `middleware.ts` - Protección de rutas
- `.env.local.example` - Template de variables de entorno

### 2. Core
- `lib/api.ts` - Cliente API con funciones para GAS
- `lib/session.ts` - Gestión de sesión (saveSession, getToken, etc.)
- `types/index.ts` - Tipos TypeScript (User, Onboarding, Mirror, Note)

### 3. Layouts
- `app/layout.tsx` - Root layout con Ant Design Provider
- `app/app/layout.tsx` - Layout protegido con Sider y Header

### 4. Páginas Públicas
- `app/(public)/page.tsx` - Landing page
- `app/login/page.tsx` - Login OTP (2 pasos)

### 5. Páginas Protegidas
- `app/app/page.tsx` - Redirect a tracker
- `app/app/onboarding-tracker/page.tsx` - Lista de onboardings
- `app/app/onboarding-tracker/[clienteId]/page.tsx` - Detalle con checklist
- `app/app/soporte/page.tsx` - Soporte
- `app/app/formacion/page.tsx` - Formación
- `app/app/growth-news/page.tsx` - Noticias

### 6. API Routes
- `app/api/gas/[...path]/route.ts` - Proxy a Google Apps Script

## Justificación de pnpm

Usamos **pnpm** por:

1. **Eficiencia**: Hard links en lugar de copiar archivos (ahorra espacio)
2. **Velocidad**: Instalaciones más rápidas que npm/yarn
3. **Seguridad**: Mejor aislamiento de dependencias
4. **Estándar moderno**: Recomendado por Vercel y usado en monorepos
5. **Compatibilidad**: 100% compatible con npm (mismo package.json)

## Notas Importantes

### Google Apps Script
- El backend GAS responde con `Content-Type: text/html` pero el body es JSON
- El token se pasa por query param o body (NO por headers)
- Implementamos parsing robusto: `res.text()` → `JSON.parse()`

### Modos de API
- **Direct mode** (default): Frontend llama directamente a GAS
- **Proxy mode**: Frontend → Next.js API → GAS (mejor para CORS)
- Cambiar con `NEXT_PUBLIC_USE_GAS_PROXY=true/false`

### Autenticación
- OTP enviado por Power Automate + Outlook
- Token JWT generado por GAS
- Sesión guardada en localStorage
- Protección en layout de `/app`

### Checklist
- Detecta campos boolean automáticamente
- Switches interactivos
- Updates en tiempo real a Google Sheets
- Sync a SharePoint vía Power Automate

## Testing

Para probar el login necesitas:
1. Un usuario registrado en la sheet `Users`
2. Email configurado en Power Automate
3. Backend GAS desplegado como Web App

## Deploy a Vercel

```bash
# Desde la raíz del proyecto
vercel

# O conectar repo en vercel.com
```

Variables de entorno en Vercel:
- `NEXT_PUBLIC_GAS_BASE_URL` - URL del Web App de GAS
- `NEXT_PUBLIC_USE_GAS_PROXY=true` - Usar proxy (recomendado)

## Solución de Problemas

### Error: "Cannot find module '@ant-design/nextjs-registry'"
```bash
pnpm add @ant-design/nextjs-registry
```

### CORS errors
```bash
# En .env.local
NEXT_PUBLIC_USE_GAS_PROXY=true
```

### TypeScript errors
```bash
pnpm add -D @types/node @types/react @types/react-dom
```

### Build errors
```bash
# Limpiar caché
rm -rf .next
pnpm build
```

## Soporte

Para problemas técnicos, consultar:
- README.md para documentación completa
- Código de Google Apps Script adjunto
- Página de Soporte en la aplicación
