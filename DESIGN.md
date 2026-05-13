---
name: NetPortal
description: Portal de prospección y contratación de internet por fibra óptica
colors:
  primary: "#4f46e5"
  primary-hover: "#4338ca"
  accent: "#6366f1"
  secondary: "#e2e8f0"
  secondary-fg: "#0f172a"
  neutral-bg: "#f8fafc"
  neutral-fg: "#020617"
  neutral-muted: "#64748b"
  neutral-border: "#e2e8f0"
  destructive: "#ef4444"
  warning: "#eab308"
  warning-bg: "#fefce8"
  dark-bg: "#0a0a0a"
  dark-fg: "#fafafa"
  dark-secondary: "#27272a"
  dark-border: "#27272a"
  dark-muted: "#52525b"
  dark-muted-fg: "#a1a1aa"
  surface-card: "#ffffff"
  surface-card-dark: "#09090b"
typography:
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.025em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "12px 40px 12px 40px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "12px 40px 12px 40px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.lg}"
    padding: "12px 32px 12px 32px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.full}"
    padding: "14px 32px 14px 32px"
    border: "1px solid {colors.neutral-border}"
  input-default:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.lg}"
    padding: "12px 12px 12px 44px"
  card-default:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.xl}"
    padding: "20px 20px 20px 20px"
---
# Design System: NetPortal

## 1. Overview

**Creative North Star: "El Asesor Confiable"**

NetPortal es un portal de prospección de internet que equilibra la calidez del servicio al cliente venezolano con la precisión técnica de una empresa de telecomunicaciones. El diseño es claro, directo y sin adornos innecesarios — como un asesor que no te hace repetir la misma información dos veces.

La interfaz prioriza el progreso visible y la confianza. Cada paso del flujo de contratación es una conversación, no un formulario. Los espacios son generosos, los estados son obvios, las transiciones son suaves pero sin teatralidad. El color primario (índigo) actúa como guía silenciosa — señala lo importante sin necesidad de llamar la atención.

Este sistema rechaza explícitamente: fondos de stock genéricos, sobrecarga de tarjetas idénticas, efectos de vidrio decorativos, texto con gradiente decorativo, y cualquier cosa que parezca una plantilla de startup SaaS sin editar.

### Key Characteristics:
- **Espacios generosos**: el contenido respira. Sin compresión innecesaria.
- **Progreso táctil**: cada paso completado se siente como un logro pequeño pero real.
- **Confianza visual**: botones sólidos, bordes nítidos, sombras sutiles. Nada frágil.
- **Identidad local natural**: cédula, RIF, ámbitos, vivienda horizontal/vertical — formatos venezolanos integrados sin banderas ni clichés.
- **Modo oscuro intencional**: no es un "tema extra", es un ciudadano de primera clase para asesores que trabajan de noche.

## 2. Colors

La paleta de NetPortal usa índigo como ancla primaria sobre neutros cálidos-grisáceos. El amarillo aparece puntualmente como acento secundario en decisiones financieras (modalidad de pago).

### Primary
- **Indigo Ancla** (`#4f46e5`): Color de acción principal. Botones primarios, enlaces, indicadores de paso activo, fondo de iconos seleccionados. Saturado sin ser agresivo.

### Accent
- **Indigo Suave** (`#6366f1`): Hover states del primario, acentos secundarios, badges. Un paso más claro que el primario.

### Neutral
- **Fondo Claro** (`#f8fafc`): Fondo de página general. Gris muy claro con un toque azulado apenas perceptible.
- **Texto Principal** (`#020617`): Cabeceras y contenido primario. Casi negro, con un dejo azul pizarra.
- **Texto Secundario** (`#64748b`): Subtítulos, descripciones, metadatos. Gris azulado medio.
- **Borde** (`#e2e8f0`): Bordes de inputs, tarjetas, separadores. Línea sutil que no compite.
- **Superficie Tarjeta** (`#ffffff`): Blanco puro para tarjetas, inputs, contenedores de contenido.

### Dark Mode
- **Fondo Oscuro** (`#0a0a0a`): Negro con un susurro de textura. Fondo de página en modo oscuro.
- **Texto Oscuro** (`#fafafa`): Blanco roto para cabeceras y cuerpo en oscuro.
- **Superficie Oscura** (`#09090b`): Tarjetas y contenedores en oscuro. Un pelo más claro que el fondo.
- **Borde Oscuro** (`#27272a`): Bordes y separadores en modo oscuro.

### Named Rules
**La Regla del Guía Silencioso.** El índigo (primario) aparece en máximo 10-15% de cualquier pantalla en modo lectura, concentrado en elementos interactivos y de navegación. Su distribución estratégica es lo que lo hace efectivo. En superficies de decisión (selector de plan, resumen), puede ocupar más espacio cuando es funcional, no decorativo.

**La Regla del Amarillo Funcional.** El amarillo (`#eab308`) se usa exclusivamente para decisiones financieras: modalidad de pago, descuentos, recargos. No aparece en branding ni decoración. Cuando aparece, el usuario sabe que es una decisión económica.

## 3. Typography

**Body Font:** Inter (con ui-sans-serif, system-ui, sans-serif como fallback)
**Mono Font:** JetBrains Mono (con ui-monospace, monospace como fallback)

**Character:** Inter es profesional sin ser corporativo. Sus formas abiertas y su altura-x generosa lo hacen legible en tamaños pequeños — crítico para formularios densos. La combinación con JetBrains Mono para datos técnicos (velocidades, IDs, códigos de zona) crea una distinción silenciosa entre contenido editorial y contenido de sistema.

### Hierarchy
- **Headline** (700, `clamp(1.5rem, 4vw, 2.25rem)`, 1.15): Títulos de página en el flujo. Aparecen una vez por pantalla, en el FlowHeader.
- **Title** (700, `1.125rem`, 1.3): Títulos de sección dentro de cada paso. "Resumen de contratación", "Tipo de instalación".
- **Body** (400, `0.875rem`, 1.5): Texto corriente, descripciones, contenido de tarjetas. Limitado a 70 caracteres por línea en pantallas grandes.
- **Label** (600, `0.75rem`, 1.25, tracking `0.025em`): Etiquetas de formulario, metadatos, texto legal. En mayúscula opcional para énfasis.
- **Caption** (400, `0.75rem`, 1.3): Notas al pie, mensajes de error, textos secundarios.
- **Mono** (400, `0.8125rem`, 1.4): Datos técnicos, velocidades, IDs de zona, montos en tablas.

### Named Rules
**La Regla de la Jerarquía Plana.** No más de tres niveles tipográficos visibles simultáneamente en cualquier pantalla. Si aparece un cuarto nivel, es señal de que la información necesita reorganizarse, no agrandarse.

## 4. Elevation

NetPortal usa un sistema híbrido: sombras sutiles para elevar acciones primarias y superposición tonal para separación estructural. Las tarjetas y contenedores son planos por defecto (fondo ligeramente distinto del fondo de página, sin sombra). Las sombras aparecen solo como respuesta a estado (hover en botones, modales, elementos activos).

En modo oscuro, las sombras se atenúan drásticamente (casi invisibles) y la separación se logra exclusivamente por diferencia tonal entre superficies.

### Shadow Vocabulary
- **Shadow-sm** (`0 1px 2px 0 rgb(0 0 0 / 0.05)`): Elementos sutiles que necesitan micro-separación.
- **Shadow-lg** (`0 10px 15px -3px rgb(0 0 0 / 0.1)`): Tarjetas destacadas, modales, dropdowns.
- **Shadow-xl** (`0 20px 25px -5px rgb(0 0 0 / 0.1)`): Botones primarios, elementos flotantes importantes.
- **Glow Coloreado** (`0 20px 25px -5px {color}/30`): Versión tintada del shadow-xl para botones primarios. El color se adapta al elemento.

### Named Rules
**La Regla Plano-por-Defecto.** Las superficies en reposo no tienen sombra. La sombra es una respuesta a estado: hover, foco, selección. El 80% de la interfaz es plana en un momento dado.

## 5. Components

### Buttons
- **Shape:** Generosamente redondeados (12px radio). Botones de acción primaria usan border-radius completo en casos especiales (CTAs en landing).
- **Primary:** Fondo índigo (`#4f46e5`), texto blanco. Padding vertical 12px, horizontal 40px. Sombra coloreada (índigo al 30%).
- **Hover / Focus:** Fondo índigo oscuro (`#4338ca`), sombra más intensa (índigo al 50%). Transición de 300ms con ease. Focus-visible: anillo de 2px con offset 2px.
- **Secondary / Ghost:** Fondo transparente, borde sutil o sin borde. Cambian a fondo secundario en hover.
- **Gradient CTA:** Degradado lineal de índigo oscuro a índigo para acciones de alta importancia (confirmar contratación, continuar al siguiente paso).

### Cards / Containers
- **Corner Style:** 16px radio (rounded-2xl) para tarjetas principales, 12px (rounded-xl) para contenedores internos.
- **Background:** Blanco (`#ffffff`) sobre fondo gris claro en modo claro; zinc-900 (`#18181b` aprox) sobre fondo casi negro en modo oscuro.
- **Shadow Strategy:** Sin sombra en reposo. Sombra sutil (shadow-lg) solo en hover o cuando el contenido está activo.
- **Border:** 1px sólido del color de borde neutral.
- **Internal Padding:** 20px (p-5) en todas las direcciones.

### Inputs / Fields
- **Style:** Borde de 2px sólido. Fondo blanco. Radio de 12px. Icono a la izquierda (24px de margen).
- **Focus:** Borde cambia a índigo (`#4f46e5`), sin glow ni sombra. Transición de 200ms.
- **Error:** Borde cambia a rojo (`#ef4444`). Icono de alerta y texto de error debajo del input. No cambia la estructura del layout.
- **Disabled:** Opacidad reducida (50%), sin cambios de color adicionales.

### Navigation (FlowHeader)
- **Style:** Barra fija superior, 64px de alto. Fondo blanco/oscuro con blur (backdrop-blur-xl). Borde inferior sutil de 1px.
- **Typography:** Título en Title weight (700), subtítulo en Caption (400). Todo truncado a una línea.
- **Icon Buttons:** 36px círculos con fondo teñido (azul claro para volver, amarillo claro para inicio). Hover intensifica el fondo.

### Selectors (Plan / Installation / Financing)
- **Shape:** 16px radio, borde de 2px. Layout de grid (2 columnas en escritorio, 1 en móvil).
- **Default:** Borde neutral, fondo blanco/oscuro.
- **Selected:** Borde índigo (o amarillo para financiamiento), fondo teñido (índigo 5% / amarillo 5%). Indicador de selección animado (spring layoutId).
- **Content:** Icono en caja de 40px con fondo teñido, texto descriptivo, precio destacado.

### Signature: ShineBorder
- **Propósito:** Borde animado con gradiente radial para envolver contenido destacado (resumen de contratación).
- **Comportamiento:** Máscara CSS con animación infinita de fondo. El gradiente se mueve en diagonal durante 14s por ciclo.
- **Uso:** Exclusivo para el resumen final de contratación. Una sola instancia por flujo.

## 6. Do's and Don'ts

### Do:
- **Do** usar el índigo como guía funcional: botones, enlaces, indicadores de paso, selección activa. Su presencia debe tener una razón.
- **Do** mantener espacios generosos entre secciones. El contenido debe respirar.
- **Do** mostrar el progreso del flujo en cada paso: el StepIndicator debe ser visible y claro.
- **Do** usar animaciones sutiles (opacidad + translateY de framer-motion) para la entrada de cada paso. 500ms de duración, ease-out.
- **Do** mostrar inmediatamente los errores de validación al perder el foco del campo.
- **Do** usar el amarillo solo para decisiones financieras: forma de pago, recargos, descuentos.
- **Do** mantener el modo oscuro como un ciudadano de primera clase. Probarlo con los mismos criterios que el modo claro.

### Don't:
- **Don't** usar texto con gradiente (`background-clip: text`) decorativo. Solo existe en el hero del landing. En el flujo de contratación, prohibido.
- **Don't** usar bordes laterales de más de 1px como acento decorativo en tarjetas o listas.
- **Don't** usar efectos de blur o glassmorphism decorativos. Sin fondos vidriosos sin propósito.
- **Don't** usar la plantilla héroe-métrica (número grande + etiqueta pequeña + stats + gradiente). Ya está en el landing, no se repite en el flujo.
- **Don't** duplicar tarjetas idénticas en grid. Cada elemento debe diferenciarse.
- **Don't** usar modales como primera opción. Preferir expansión inline o pasos progresivos.
- **Don't** asumir que la paleta de colores define el branding. El branding está en el tono, los espacios y la claridad del flujo, no en la saturación del índigo.
- **Don't** mezclar estilos de iconos. Usar Lucide icons consistentemente en todo el flujo.
