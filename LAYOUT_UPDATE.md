# Onboarding Tracker - Layout Update

## Resumen de Cambios Implementados

Se ha reorganizado completamente el layout del Onboarding Tracker según el nuevo esquema proporcionado. A continuación se detallan todos los cambios realizados.

---

## 🎨 Nuevo Layout (3 Columnas)

### Estructura Desktop

```
┌──────────────┬─────────────────────────────┬──────────────────┐
│              │  STEPPER (GENERAL STEPS)    │                  │
│   SIDEBAR    │  ─────────────────────────  │    TIMELINE      │
│  (General    │                             │                  │
│   Steps)     │    CARDS (SUBSTEP           │                  │
│              │    INSTRUCTIONS)            │  NOTAS           │
│              │                             │  GENERALES       │
│  Paso 1 ⚪   │  [Título del substep]       │                  │
│  Paso 2 ⚪   │  [Instrucciones...]         │  ──────────────  │
│  Paso 3 🔒   │                             │  GENERAL %       │
│              │  [Añadir nota] [Soporte]    │  AGENT CARD      │
│              │  [Marcar como completado]   │                  │
└──────────────┴─────────────────────────────┴──────────────────┘
     4 cols              12 cols                    8 cols
```

### Distribución de Columnas

- **Columna Izquierda (4/24)**: GENERAL STEPS (stepper vertical)
- **Columna Central (12/24)**: SUBSTEPS STEPPER (arriba) + INSTRUCTION CARD (abajo)
- **Columna Derecha (8/24)**: TIMELINE + NOTES + (PROGRESS % + AGENT CARD)

---

## 📋 Componentes Actualizados

### 1️⃣ **GENERAL STEPS (Main Steps Card)**

**Cambios:**
- ✅ Ahora usa `titlePlacement="vertical"` para mostrar el progress circle vertical
- ✅ Los pasos muestran:
  - Título del paso (ej. "Paso 1: Configuración Inicial")
  - Estado debajo del título (Completado / Pendiente / No iniciado)
  - Progress circle con % calculado por subpasos completados
- ✅ Paso 3 tiene candado 🔒 hasta que Paso 1 y 2 = 100%
- ✅ Tooltip en el candado explica la condición de desbloqueo

**Código clave:**
```typescript
<Steps
  current={currentStepIndex}
  direction="vertical"
  titlePlacement="vertical"
  items={stepsUI.map((s) => ({
    title: <Text strong>{s.title}</Text>,
    description: <Text type={...}>{s.statusText}</Text>,
    percent: s.percent,
    disabled: !!s.locked,
    icon: s.locked ? <Tooltip>...</Tooltip> : undefined,
  }))}
/>
```

---

### 2️⃣ **STEPPER (Substeps of Main Step)**

**Cambios:**
- ✅ Se muestra horizontal en desktop, vertical en móvil
- ✅ Los subpasos completados muestran ✓ (CheckCircleFilled)
- ✅ El subpaso actual está en estado "process" (azul)
- ✅ Los subpasos futuros están en "wait" y deshabilitados si el anterior no está completado
- ✅ **Gating estricto**: no se puede saltar subpasos

**Código clave:**
```typescript
<Steps
  current={currentSubIndex}
  direction={orientation} // "horizontal" o "vertical"
  items={substeps.map((s, idx) => ({
    title: s.title,
    disabled: s.disabled,
    status: s.done ? "finish" : idx === currentSubIndex ? "process" : "wait",
    icon: s.done ? <CheckCircleFilled /> : undefined,
  }))}
/>
```

---

### 3️⃣ **CARDS (Substep Instructions)**

**Cambios:**
- ✅ Card con sombra sutil y border-radius de 8px
- ✅ Tag "Instrucciones" en color azul en el header
- ✅ Contenido scrollable dentro del card (flex layout)
- ✅ Botones de acción en footer:
  - "Añadir nota" (abre modal para nota de substep)
  - "Soporte" (mailto al customer success)
  - "Marcar como completado" (botón primary, size large)
- ✅ Divider separa el contenido de los botones

**Diseño:**
```typescript
<Card
  title={title}
  extra={<Tag icon={<FileTextOutlined />} color="blue">Instrucciones</Tag>}
  style={{
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    borderRadius: 8,
  }}
>
  {/* Contenido scrollable */}
  <div style={{ flex: 1, overflow: "auto" }}>
    <Typography.Paragraph>{description}</Typography.Paragraph>
  </div>

  <Divider />

  {/* Botones de acción */}
  <Flex justify="space-between">
    <Space>
      <Button icon={<MessageOutlined />}>Añadir nota</Button>
      <Button icon={<CustomerServiceOutlined />}>Soporte</Button>
    </Space>
    <Button type="primary" size="large" icon={<CheckOutlined />}>
      Marcar como completado
    </Button>
  </Flex>
</Card>
```

---

### 4️⃣ **TIMELINE**

**Cambios:**
- ✅ Altura fija de 350px con scroll interno
- ✅ **Auto-scroll al subpaso actual** con timeout de 200ms
- ✅ Estados visuales mejorados:
  - **Completado**: ✅ verde + fecha de completado
  - **Actual**: ⏳ spinner azul + texto "Pendiente"
  - **Futuro**: ⏱️ reloj gris (50% opacidad)
- ✅ El subpaso actual aparece en **negrita** (font-weight: bold)
- ✅ Panel scrollable con padding-right: 8px para evitar corte

**Formato de fecha:**
- Muestra: "Completado el [fecha]" para items done
- Muestra: "Pendiente" para el item actual
- No muestra nada para items futuros

**Código clave:**
```typescript
useEffect(() => {
  if (!containerRef.current || !currentRef.current) return;
  const parent = containerRef.current;
  const child = currentRef.current;
  setTimeout(() => {
    parent.scrollTop = Math.max(0, child.offsetTop - 100);
  }, 200);
}, [currentKey]);
```

---

### 5️⃣ **NOTAS GENERALES**

**Características:**
- ✅ Altura fija de 280px con scroll interno
- ✅ Botón "Añadir nota" en el header del card (size: small)
- ✅ Lista de notas con autor, fecha y contenido
- ✅ Modal para crear nueva nota general (scopeType: GENERAL)
- ✅ Placeholder: "Aún no hay notas." cuando la lista está vacía

**Funcionalidad:**
- Las notas generales son visibles para toda la organización (visibility: PUBLIC)
- Se crean con `POST /onboardings/{clienteId}/notes`
- Se refrescan automáticamente tras crear una nota

---

### 6️⃣ **GENERAL % (Overall Progress)**

**Cambios:**
- ✅ Ahora usa `Progress type="dashboard"`
- ✅ Tamaño aumentado a 120px de diámetro
- ✅ **Gradiente teal corporate**: #005657 → #003031
- ✅ Formato personalizado mostrando el porcentaje en grande (24px)
- ✅ Debajo del progress: "X de Y subpasos completados"
- ✅ Layout vertical centrado (Flex vertical)

**Diseño:**
```typescript
<Progress
  type="dashboard"
  percent={percent}
  size={120}
  strokeColor={{
    "0%": "#005657",
    "100%": "#003031",
  }}
  format={(percent) => (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 24, fontWeight: "bold", color: "#003031" }}>
        {percent}%
      </div>
    </div>
  )}
/>
```

---

### 7️⃣ **AGENT CARD**

**Cambios CRÍTICOS:**
- ✅ **Colores corporate teal** (inspirado en Uiverse.io):
  - Fondo inferior: `#005657` (teal primary)
  - Fondo inferior dark mode: `#003031` (teal oscuro)
  - Border hover en avatar: `#005657`
  - Iconos y hover: transición de `#005657` a `#003031`
- ✅ Tamaño: 280x280px
- ✅ **Animación hover elegante**:
  - Card se expande (top-left border-radius cambia)
  - Avatar se mueve a esquina superior izquierda y se hace circular
  - Fondo inferior sube (top: 20%)
  - Border-radius dinámico (80px en esquina superior izquierda)
- ✅ Botón "Contactar" con colores invertidos en hover
- ✅ Icono de email en la esquina superior derecha

**CSS Highlights:**
```css
.card .bottom {
  background: #005657; /* Teal corporate */
  transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
}

.card:hover .bottom {
  top: 20%;
  border-radius: 80px 29px 29px 29px;
}

.card:hover .profilePic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 7px solid #005657;
}
```

---

## 📱 Responsividad

### Breakpoints

- **Desktop (xl: ≥1200px)**:
  - Columna izquierda: 4/24
  - Columna central: 12/24
  - Columna derecha: 8/24

- **Mobile/Tablet (xs: <1200px)**:
  - Todas las columnas apiladas verticalmente (24/24)
  - Substeps stepper cambia a orientación vertical
  - Progress y Agent Card se apilan en 2 columnas (12/24 cada uno)

---

## 🎯 Funcionalidades Clave

### Gating de Subpasos
1. **Paso 1 y 2**: Siempre disponibles
2. **Paso 3**: BLOQUEADO hasta que Paso 1 y 2 = 100%
3. **Subpasos**: Cada uno bloqueado hasta completar el anterior

### Auto-selección
- Al cambiar de paso principal, se auto-selecciona el **primer subpaso incompleto**
- El timeline hace **auto-scroll al subpaso actual** al cargar

### Cálculo de Progreso
- **Por paso**: % = (subpasos completados / total subpasos)
- **Global**: % = (todos los subpasos completados / todos los subpasos)

### Estados
- **No iniciado**: 0% completado
- **Pendiente**: >0% y <100%
- **Completado**: 100%

---

## 🚀 Cómo Probar

1. **Iniciar el servidor**:
   ```bash
   pnpm run dev
   ```

2. **Navegar a**:
   ```
   http://localhost:3000/app/onboarding-tracker/[clienteId]
   ```

3. **Verificar**:
   - ✅ Layout de 3 columnas en desktop
   - ✅ Paso 3 bloqueado si Paso 1 y 2 no están al 100%
   - ✅ Progress circles muestran % correcto
   - ✅ Timeline con auto-scroll al subpaso actual
   - ✅ AgentCard con hover animation y colores teal
   - ✅ Progress dashboard con gradiente teal
   - ✅ Substeps con gating estricto
   - ✅ Notas generales funcionando
   - ✅ Dark/light mode funciona en todos los componentes

---

## 📦 Archivos Modificados

1. **OnboardingTrackerContent.tsx**
   - Layout reorganizado (4-12-8 columns)
   - Timeline 350px, Notes 280px
   - Progress y Agent Card lado a lado

2. **TrackerCards.tsx**
   - MainStepsCard: titlePlacement="vertical"
   - SubstepsStepper: estados process/finish/wait
   - SubstepInstructionCard: nueva estructura flex
   - TimelineCard: auto-scroll mejorado + estados visuales
   - OverallProgressCard: dashboard con gradiente teal

3. **AgentCard.tsx**
   - Removido prop --accent (ahora hardcodeado)

4. **agent-card.module.css**
   - Colores corporate teal (#005657, #003031)
   - Animaciones según Uiverse.io
   - Dark mode adaptado

---

## ✅ Checklist de Validación

- [x] Layout 3 columnas funciona en desktop
- [x] Layout responsive en mobile (apilado)
- [x] Paso 3 se desbloquea correctamente
- [x] Progress circles calculan % correcto
- [x] Substeps con gating estricto
- [x] Timeline auto-scroll funciona
- [x] Timeline muestra fechas de completado
- [x] Timeline muestra spinner en actual
- [x] Notas generales se pueden crear
- [x] Progress dashboard con gradiente teal
- [x] AgentCard con colores corporate
- [x] AgentCard hover animation funciona
- [x] Dark mode en AgentCard
- [x] Substeps stepper cambia orientación
- [x] No hay scroll de página (solo interno)
- [x] Traducciones ES/EN/PT funcionan
- [x] Build sin errores

---

## 🎨 Paleta de Colores Corporate

```css
/* Teal Primary */
--teal-primary: #005657;

/* Teal Dark (Accent) */
--teal-dark: #003031;

/* Gradiente para Progress */
background: linear-gradient(135deg, #005657 0%, #003031 100%);
```

Aplicado en:
- AgentCard background
- Progress dashboard stroke
- Botones y acentos principales

---

**Actualización completada el**: 2026-01-11
**Estado**: ✅ Listo para producción
