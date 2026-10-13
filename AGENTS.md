# AGENTS.md — Braini Emotions

Instrucciones para agentes de código. El README es para humanos (TFM, instalación, credenciales). Este archivo es la constitución del repo.

## Project overview

Hub multi-producto de neurobienestar emocional educativo:


| Ruta              | Producto            | Estado                                             |
| ----------------- | ------------------- | -------------------------------------------------- |
| `/`               | Hub Braini Emotions | Landing comercial B2B (CTA = reunión por `mailto`) |
| `/brainikids`     | Braini Kids         | Placeholder «en desarrollo»                        |
| `/brainijuniors`  | Braini Juniors      | Placeholder «en desarrollo»                        |
| `/brainifamily/*` | **BrainiFamily**    | App B2B operativa (núcleo)                         |


**Modelo:** invite-only. No hay signup público, waitlist ni `signUp` en el cliente. El alta de usuarios va solo por Edge Functions `complete-*-invite`.

**Roles:** `super_admin` (email en `admin_emails`, no en `user_roles`) → `director` → `teacher` → `parent`. Un usuario, un rol. El niño o niña es fila en `children` sin cuenta propia.

## Setup commands

```sh
npm install
# .env en la raíz: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm run dev          # http://localhost:8080/
```

## Testing instructions

```sh
npm run test:run           # Vitest
npm run test:e2e:smoke     # Playwright smoke
npm run verify             # lint + test:run + build
```

Tras cambios relevantes, ejecutar los checks que apliquen y corregir fallos antes de dar por terminada la tarea. Para decidir **qué** correr e interpretar fallos → skill **run-tests**.

## Architecture

- **SPA Vite** (no Next.js). React 19, React Router 7, Tailwind 4, TanStack Query, Supabase JS.
- Alias `@/` → `src/`.
- Capas: `src/app/` (bootstrap/router) · `src/products/` (hub, kids, juniors, brainifamily) · `src/shared/` · `src/integrations/supabase/`.
- Datos: queries / RPC / Edge solo en `src/integrations/supabase/`. Las páginas no hablan a PostgREST directamente.
- Login único: `/brainifamily/login`. Redirects legacy (`/login`, `/home`, …) → `/brainifamily/*`.

## Domain gotchas

- Tablas de invitación: `director_invited`, `teacher_invited`, `parent_invited` — **nunca** `*_invites`.
- Catálogo pedagógico (`missions`, `activities`, `medals`): solo lectura para roles de plataforma.
- Fuera de alcance v2.0: signup, waitlist, Test Genius, Conferencia, emails transaccionales automáticos.

## Schema and MCP

Cualquier cambio de esquema (tablas, columnas, RLS, RPC, triggers) → skill **supabase-schema-change**.

El esquema **no** se versiona en git (no hay `supabase/migrations/`). Fuente de verdad = remoto vía MCP (`read_only=true`); el humano aplica el SQL en el dashboard. El agente **propone**; **tú** ejecutas. Antes de inventar tablas/RPC/RLS, consultar el remoto.

Código de Edge Functions **sí** vive en el repo: `supabase/functions/complete-*-invite/`. Tras cambiarlo hay que redesplegarlo en Supabase (dashboard).

Los docs `05`, `07`, `08`, `10` y `13` son snapshots. Si hay duda entre doc y remoto, **gana el remoto**.

## Security

- `SUPABASE_SERVICE_ROLE_KEY` solo en Edge Functions (`supabase/functions/`), nunca en la SPA.
- No pegar `.env`, `.env.test` ni secretos en el chat.
- No inventar alta de usuarios por `signUp` en cliente.

## Docs on demand

Índice: `docs/00-INDICE.md`. Fuente larga para humanos; no volcar módulos enteros.

Protocolo:

1. Empieza por este `AGENTS.md` + código (+ MCP si la tarea es datos).
2. Abre docs solo si falta un contrato o una decisión de dominio.
3. Como máximo **1–2 archivos** por turno, según la tarea:

| Si la tarea es… | Abre… |
|-----------------|--------|
| Arquitectura / stack | `docs/03-ARQUITECTURA-Y-STACK.md` |
| Roles / permisos / RLS | `docs/05-ROLES-Y-PERMISOS.md` (+ MCP) |
| Esquema / tablas | MCP primero; `docs/07` o `docs/08` solo si hace falta |
| Rutas / frontend | `docs/09-DISENO-TECNICO-FRONTEND.md` |
| Edge / Auth / Storage | `docs/10-BACKEND-SUPABASE.md` |
| Tests | skill `run-tests`; `docs/11` si hace falta |
| Invitaciones | skill `invite-onboarding`; `docs/06` si el skill no basta |
| Gaps / estado | `docs/13-ESTADO-ACTUAL.md` |

4. No abras `docs/01`–`04` salvo producto o alcance. Resume o cita la ruta; no copies párrafos largos al chat.

## Skills

| Tarea | Skill |
|-------|--------|
| Invitaciones, tokens, alta, `complete-*-invite` | **invite-onboarding** |
| Tests, verify, smoke, coverage | **run-tests** |
| Schema, SQL, RLS, RPC, triggers | **supabase-schema-change** |
