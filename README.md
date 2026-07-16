# BRAINI — Braini Emotions

Plataforma de neurobienestar e inteligencia emocional educativa. Hub multi-producto (Braini Kids, Braini Juniors, Braini Family) con app B2B **Braini Family** para centros, docentes y familias.

## Requisitos

- **Node.js** 20.19+ o 22.12+ (recomendado: 22.x)
- **npm** 9+

## Configuración local

```sh
git clone https://github.com/marcasanova/BRAINI.git
cd BRAINI
npm install
```

Crea un archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo (puerto 8080) |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest en modo watch |
| `npm run test:run` | Vitest una pasada (CI / pre-push) |
| `npm run test:coverage` | Cobertura de tests |
| `npm run test:e2e` | Playwright E2E completo |
| `npm run test:e2e:smoke` | Playwright smoke (rápido, post-fase) |
| `npm run analyze` | Build + informe visual de bundles (`stats.html`) |
| `npm run verify` | `lint` + `test:run` + `build` |

## Testing

Estructura **híbrida** (todo versionado en git):

```
src/**/*.test.ts(x)     # tests junto al código
tests/setup/            # Vitest, MSW, test-utils
tests/fixtures/         # datos fake
tests/e2e/              # Playwright smoke y flows
```

- **Unit / integración:** Vitest + React Testing Library + MSW (sin tocar Supabase remoto).
- **E2E smoke:** Playwright — rutas públicas, redirects legacy (`/login`, `/home`), matriz de rutas y guards sin auth.
- **E2E autenticado (opcional):** copia `.env.test.example` → `.env.test` con usuario de staging.
- **Bundle analyzer:** `npm run analyze` genera `stats.html` (ignorado en git).

Artefactos generados (`coverage/`, `playwright-report/`, etc.) están en `.gitignore`.

## Documentación técnica

Ver [docs/00-INDICE.md](docs/00-INDICE.md) — fuente de verdad B2B (problema → requisitos → arquitectura → dominio → estado actual).

## Despliegue

Hosting estático en **Vercel** (`vercel.json` rewrites SPA). Variables de entorno: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS 4 + shadcn/ui (Radix)
- Supabase (Auth, PostgreSQL, Storage, Edge Functions)
- React Router 7, TanStack Query 5
