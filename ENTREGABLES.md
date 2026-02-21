# Entregables: Calculadora de Inflación (Producción)

Este documento detalla el cumplimiento de los requerimientos para el proyecto de la Calculadora de Inflación, construida con un stack moderno y diseñada para alta performance, SEO y monetización.

## 1. Plan de Implementación (MVP + Extensiones)

### Fase 1: MVP (Completada)
- [x] **Core:** Configuración de Next.js 15+ con App Router.
- [x] **Diseño:** Sistema de diseño basado en `DESIGN.md` (Azul profundo, Dorado suave).
- [x] **ETL:** Pipeline para obtener datos del IPC oficial (INDEC) vía API de datos.gob.ar.
- [x] **Cálculos:** Motor de cálculo para ajuste, inflación acumulada y CAGR con precisión de 2-4 decimales.
- [x] **UI:** Formulario reactivo, panel de resultados, tabla resumen y gráfico interactivo (Chart.js/Recharts).
- [x] **Exportación:** Copiado de resultados formateados y descarga de CSV.
- [x] **SEO:** Metadatos dinámicos, JSON-LD (Schema.org) y FAQPage.
- [x] **Monetización:** Espacios reservados para AdSense con prevención de CLS.

### Fase 2: Extensiones (En Arquitectura)
- [ ] **Ajuste Inverso:** Invertir lógica origen-destino (previsto en `lib/calculations`).
- [ ] **Modo Embed:** Script ligero para incrustar el widget en sitios externos (en progreso).
- [ ] **API Pública:** Endpoint read-only `/api/v1/ipc/argentina`.

---

## 2. Estructura de Carpetas

```text
/src
  /app           -> Rutas, Layouts (SEO, Google Analytics)
  /components
    /calculator  -> Formulario, Resultado, Metodología
    /charts      -> Gráficos interactivos
    /seo         -> Schema.org, FAQ
    /ui          -> Componentes atómicos (Button, Card, Input)
    /ads         -> Sockets de AdSense con reserva de espacio
  /lib
    /calculations -> Motor matemático + Tests unitarios
    /ipc-data    -> Carga y parseo de datos (public/data)
    /format      -> Helpers de moneda y fechas
    /analytics   -> Event tracking (GA4)
  /data
    /etl         -> Scripts de actualización (fetch-ipc.ts)
/public
  /data         -> Persistencia JSON (ipc-argentina.json)
```

---

## 3. Esquema de Datos (Persistencia)

Para máxima velocidad (LCP < 2s), se utiliza un esquema de **Flat JSON** servido de forma estática, actualizable por el ETL.

**Estructura del Dataset:**
- `country`: string (ej: "argentina")
- `currency`: string (ej: "ARS")
- `base`: string (ej: "2016-12")
- `source`: string (Institución oficial)
- `lastUpdated`: ISO Date
- `series`: Array de `entry { date: "YYYY-MM", value: number }`

---

## 4. Motor de Cálculo (Fórmulas)

Implementado en `src/lib/calculations.ts`.
- **Ajuste:** `Monto * (IPC_dest / IPC_orig)`
- **Inflación Acumulada:** `((IPC_dest / IPC_orig) - 1) * 100`
- **CAGR:** `((IPC_dest / IPC_orig)^(12/meses) - 1) * 100`

*Verificados con tests en `src/lib/calculations.test.ts`.*

---

## 5. Estrategia ETL y Actualización

### Pipeline
1. **Fetch:** El script `fetch-ipc.ts` consulta el endpoint oficial de Series de Tiempo.
2. **Normalización:** Valida valores nulos, redondea a 2 decimales y detecta saltos de meses.
3. **Persistencia:** Guarda el archivo en `public/data/ipc-argentina.json`.
4. **Automatización:** Se recomienda un **GitHub Action** (cron: `0 0 * * *`) que ejecute el script y haga push automático de los datos una vez por semana coincidiendo con el calendario del INDEC.

---

## 6. Checklist de Lanzamiento

- **SEO:**
  - [x] Title tags únicos por país.
  - [x] Meta description con keywords relevantes.
  - [x] Schema.org `WebApplication` y `FAQPage`.
  - [x] Sitemap generado (pendiente dinámico).
- **AdSense:**
  - [x] Espacios reservados (Sidebar, Bottom, Above Result).
  - [x] Mensaje "Espacio publicitario" para transparencia.
- **Performance:**
  - [x] Imágenes optimizadas (si hubiera).
  - [x] CSS crítico via Tailwind + Global CSS.
  - [x] Carga diferida de gráficos (Client-only components).

---

## 7. Supuestos y Decisiones
- Se asume el **IPC Nacional (Base 2016)** como estándar de facto.
- Para meses sin datos (retraso de publicación), el calculador impide la selección y explica el motivo ("Sin datos oficiales").
- El diseño no tiene modo oscuro (dark mode) por omisión en `DESIGN.md`, manteniendo el blanco/azul como autoridad visual.
