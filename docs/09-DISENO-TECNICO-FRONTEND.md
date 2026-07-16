# Diseño técnico frontend — BRAINI

**Versión:** 3.0  
**Stack:** React 19, Vite 8, Tailwind 4, React Router 7, TanStack Query 5

---

## 1. Punto de entrada

```
src/app/
├── main.tsx          # Monta React + providers
├── App.tsx           # QueryClient, Toaster (Sonner)
├── router.tsx        # Rutas lazy + guards
└── RouteLoading.tsx  # Fallback Suspense
```

`main.tsx` arranca la SPA; `router.tsx` define toda la navegación con `React.lazy` y `Suspense`.

---

## 2. Estructura por capas

```
src/
├── app/                    # Bootstrap y routing
├── products/
│   ├── hub/                # Landing principal (/)
│   ├── brainikids/         # Landing /brainikids
│   ├── brainijuniors/      # Landing /brainijuniors
│   └── brainifamily/       # App B2B completa
│       ├── pages/          # Pantallas por ruta
│       ├── features/       # Módulos UI (activities, medals, teacher…)
│       ├── hooks/          # Hooks de dominio
│       ├── contexts/       # CurrentChild, Teacher
│       └── lib/            # Utilidades de invitaciones teacher
├── shared/
│   ├── components/         # Navbar, guards, backgrounds
│   ├── ui/                 # shadcn/Radix primitives
│   ├── pages/              # NotFound, UpdatePassword
│   └── lib/                # utils, constants, clipboard
├── integrations/
│   └── supabase/           # Cliente, queries, RPC, edge helpers
└── styles/
    └── index.css           # Tailwind 4 + tokens globales
```

---

## 3. Productos y rutas

### Hub y landings (públicas)

| Ruta | Componente | Notas |
|------|------------|-------|
| `/` | `hub/LandingPage` | NavbarLandings fija, CTA Hablemos |
| `/brainikids` | `brainikids/BrainiKidsLanding` | Informativa |
| `/brainijuniors` | `brainijuniors/BrainiJuniorsLanding` | Informativa |
| `/brainifamily` | `brainifamily/BrainiFamilyLanding` | Solo login; sin signup |

### Auth e invitaciones (públicas)

| Ruta | Componente |
|------|------------|
| `/brainifamily/login` | `pages/auth/Login` |
| `/brainifamily/update-password` | `shared/pages/support/UpdatePassword` |
| `/brainifamily/invite/director` | `pages/invite/CompleteDirectorInvite` |
| `/brainifamily/invite/teacher` | `pages/invite/CompleteTeacherInvite` |
| `/brainifamily/invite/parent` | `pages/invite/CompleteParentInvite` |

### Paneles por rol (guards)

| Ruta | Guard | Componente |
|------|-------|------------|
| `/brainifamily/admin` | `AdminRoute` | `pages/admin/AdminDashboard` |
| `/brainifamily/director` | `DirectorRoute` | `pages/director/DirectorDashboard` |
| `/brainifamily/teacher` | `TeacherRoute` + `TeacherProvider` | `pages/teacher/*` |
| Rutas padre (ver abajo) | `ProtectedRoute` | Varios |

### App padre (`ProtectedRoute` + `CurrentChildProvider`)

| Ruta | Componente |
|------|------------|
| `/brainifamily/home` | `pages/core/Home` |
| `/brainifamily/parents-profile` | `pages/onboarding/ParentsProfile` |
| `/brainifamily/child-profile` | `pages/onboarding/ChildProfile` |
| `/brainifamily/profile` | `pages/auth/Profile` |
| `/brainifamily/sesion/:id` | `pages/core/Activities` |
| `/brainifamily/sesion/:missionId/actividad/:activityId` | `pages/core/ActivityDetail` |
| `/brainifamily/diario-emocional` | `pages/core/DiarioEmocional` |
| `/brainifamily/inteligencia-emocional` | `pages/intelligence/InteligenciaEmocional` |
| `/brainifamily/test-tmms-padres` | `pages/intelligence/tests/TestTMMSPadres` |
| `/brainifamily/test-emocional-ninos` | `pages/intelligence/tests/TestEmocionalNinos` |

### Redirects legacy

Rutas antiguas (`/login`, `/home`, `/signup`, `/sesion/:id`, etc.) redirigen a `/brainifamily/*` en `router.tsx`.

---

## 4. Guards de navegación

| Guard | Ubicación | Comportamiento |
|-------|-----------|----------------|
| `ProtectedRoute` | `shared/components/navigation/` | Sesión + rol parent; redirige onboarding |
| `AdminRoute` | idem | `is_super_admin` vía `get_my_role` |
| `DirectorRoute` | idem | Rol director |
| `TeacherRoute` | idem | Rol teacher |

Post-login: `integrations/supabase/rpc/roles.ts` → `getMyRole()` → redirección según rol.

---

## 5. Capa de datos (`integrations/supabase/`)

```
integrations/supabase/
├── client.ts              # createClient(VITE_*)
├── types/database.types.ts
├── queries/               # Lecturas PostgREST + React Query
│   ├── children.ts
│   ├── missions.ts
│   ├── activities.ts
│   ├── medals.ts
│   ├── emotional-diary.ts
│   └── teachers.ts
├── rpc/
│   ├── roles.ts           # get_my_role
│   └── invites.ts         # create_*_invite
└── edge/
    └── invites.ts         # fetch a Edge Functions
```

Patrón: páginas/hooks → queries → `supabase.from()` o `.rpc()` → invalidación React Query en mutaciones.

---

## 6. Registry de actividades

Las actividades pedagógicas tienen componente React propio en `features/activities/content/`:

- `registry.ts` — mapa `activityId` → componente lazy.
- `ActivityDetail.tsx` — resuelve el componente vía registry.
- Puzzles pesados (ej. `activities-puzzles` chunk ~211 KB) se cargan bajo demanda.

Esto evita incluir todo el contenido pedagógico en el bundle inicial.

---

## 7. Contextos de dominio

| Contexto | Uso |
|----------|-----|
| `CurrentChildProvider` | Hijo activo del padre; selector multi-hijo |
| `TeacherProvider` | Estado del panel teacher (clase seleccionada, etc.) |

---

## 8. UI y notificaciones

- **Componentes base:** Radix UI + patrón shadcn en `shared/ui/`.
- **Estilos:** Tailwind CSS 4 con plugin `@tailwindcss/vite`.
- **Toasts:** Sonner (`shared/ui/sonner.tsx`) — migrado desde Radix Toast en Fase 2.
- **Navegación landings:** `NavbarLandings` (fija, logos desde `public/logo/`).
- **Navegación app:** `Navbar` (contexto autenticado).

---

## 9. Code splitting

Todas las páginas en `router.tsx` usan `lazy()`. Vite genera chunks separados:

| Chunk | Contenido aprox. |
|-------|------------------|
| `index-*.js` | Entry + router |
| `vendor-react-*.js` | React, RR7 |
| `vendor-supabase-*.js` | @supabase/supabase-js |
| `vendor-radix-*.js` | Radix primitives |
| `activities-puzzles-*.js` | Puzzles (lazy) |

Métricas en [11-TESTING-Y-CALIDAD](11-TESTING-Y-CALIDAD.md).

---

## 10. Variables de entorno

```env
VITE_SUPABASE_URL=https://igwoavsazbycqmdweger.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
```

Solo estas dos en cliente. Service role nunca en frontend.

---

## 11. Alias de imports

Vite resuelve `@/` → `src/` (configurado en `vite.config.ts` y `tsconfig`).

Ejemplo: `import { supabase } from "@/integrations/supabase/client"`.

---

## 12. Siguiente lectura

- [03-ARQUITECTURA-Y-STACK](03-ARQUITECTURA-Y-STACK.md) — decisiones globales.
- [10-BACKEND-SUPABASE](10-BACKEND-SUPABASE.md) — contrato RPC/Edge.
- [11-TESTING-Y-CALIDAD](11-TESTING-Y-CALIDAD.md) — tests del frontend.
