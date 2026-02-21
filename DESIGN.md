## Objetivo visual

Debe comunicar **claridad**, **confianza** y **orden** con una estética **moderna y sobria**
La UI tiene que sentirse “infraestructura” (fiable, limpia, profesional).

Principios:
- **Blanco dominante** (claridad / aire).
- **Contraste alto** para legibilidad (accesibilidad real, no estética).
- **Acentos cálidos** para reforzar la idea de “luz” (sin caer en colores infantiles).
- **Consistencia extrema**: 1 color primario, 1 acento, grises neutros.

---

## Paleta de colores (recomendada)

### Colores base
- **Primary / Azul profundo (brand):** `#0F172A`  
  Uso: header, títulos fuertes, fondos oscuros puntuales, texto sobre fondos claros cuando se necesite “autoridad”.

- **Primary / Azul acción (UI):** `#2563EB`  
  Uso: botones primarios, links, estados activos, foco.

- **Accent / Dorado suave (luz):** `#FBBF24`  
  Uso: highlights, badges, detalles de énfasis (no usar como color dominante de fondos).

### Neutros
- **Background:** `#FFFFFF`
- **Surface (cards/sections suaves):** `#F8FAFC`
- **Border / Dividers:** `#E2E8F0`
- **Text primary:** `#0B1220` *(o usar `#0F172A` si querés consistencia)*
- **Text secondary:** `#475569`

### Estados (UI)
- **Success:** `#16A34A`
- **Warning:** `#F59E0B` *(si ya usás dorado como acento, este debe usarse con moderación)*
- **Error:** `#DC2626`
- **Info:** `#0EA5E9`

---

## Reglas de uso

1. **Blanco + azul** son el 80–90% del UI.
2. El **dorado** es un **acento** (máx. 5–10%).
3. Evitar degradados fuertes. Si se usan, que sean **sutiles** y con el azul como base.
4. No usar más de **1 acento** adicional al dorado.
5. Separación clara por capas: `background` → `surface` → `border` → `content`.

---

## Tipografía

- **Onest**
- Jerarquía:
  - H1: 40–56px / bold
  - H2: 28–36px / semibold
  - Body: 16–18px / regular
  - UI labels: 12–14px / medium

Line-height:
- Titulares: 1.1–1.2
- Cuerpo: 1.5–1.7

---

## Componentes (si vas a usarlos)

### Botones
- **Primary:** fondo `#2563EB`, texto blanco, hover oscurece levemente.
- **Secondary:** borde `#E2E8F0`, texto `#0F172A`, fondo blanco, hover `#F8FAFC`.
- **Accent (limitado):** fondo `#FBBF24`, texto `#0F172A`, usar solo para un CTA puntual o badges.

### Cards
- Fondo: `#FFFFFF` o `#F8FAFC`
- Borde: `#E2E8F0`
- Sombra: suave (evitar sombras pesadas estilo “startup 2018”).

### Inputs
- Fondo blanco, borde `#E2E8F0`
- Focus ring: `#2563EB` con opacidad (importante para accesibilidad).

---

## Layout y espaciado

- Grid recomendado: **12 columnas**, max-width 1100–1200px
- Padding de sección: 64–96px (desktop), 40–56px (mobile)
- Radius:
  - Cards: 16–20px
  - Botones/inputs: 12–14px
- Íconos: línea simple (Lucide o similar).

---

## Estilo de ilustraciones / mockups

- Mockups tipo “app” con fondo blanco, bordes suaves, y pequeños acentos dorados.

---

## Accesibilidad (mínimo obligatorio)

- Contraste texto/fondo: apuntar a **WCAG AA**.
- Tamaño mínimo de texto: 14px en UI, ideal 16px.
- Estados de foco visibles (no remover outlines sin reemplazo).
- CTA principal único por sección crítica.

---