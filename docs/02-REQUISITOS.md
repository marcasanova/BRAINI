# Requisitos — BRAINI BrainiFamily B2B

**Versión:** 3.0  
**Base:** SRS v2.0 actualizado al stack y tooling de julio 2026

---

## 1. Introducción

### 1.1 Propósito

Definir **qué debe hacer** el software BRAINI y **bajo qué condiciones**, como contrato entre producto, implementación y validación (ver [12-CRITERIOS-DE-ACEPTACION](12-CRITERIOS-DE-ACEPTACION.md)).

### 1.2 Actores

| Actor | Descripción |
|-------|-------------|
| Visitante | Sin sesión; landings y login |
| Super admin | Email en `admin_emails`; gestión global |
| Director | `directors` + `user_roles.director` |
| Teacher | `teachers` + `user_roles.teacher` |
| Parent | `parents` + `user_roles.parent` |
| Sistema | Supabase (Auth, DB, Storage, Edge Functions) |

---

## 2. Requisitos funcionales

### 2.1 Acceso y autenticación (FR-AUTH)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-AUTH-01 | No existe registro público; alta solo vía invitación | Must |
| FR-AUTH-02 | Login único (`/brainifamily/login`) para todos los roles | Must |
| FR-AUTH-03 | Login sin cuenta previa devuelve error; no crea cuenta | Must |
| FR-AUTH-04 | Recuperación de contraseña vía email Supabase | Must |
| FR-AUTH-05 | Post-login: `get_my_role()` redirige al panel correcto | Must |
| FR-AUTH-06 | Completar invitación director/teacher/parent vía Edge Functions | Must |
| FR-AUTH-07 | Segunda invitación padre (mismo email): login sin nueva contraseña | Must |
| FR-AUTH-08 | Al generar invitación: validar si email ya existe en el sistema | Must |

### 2.2 Super admin (FR-ADM)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-ADM-01 | Crear centros (`admin_create_school`) | Must |
| FR-ADM-02 | Invitar directores (`create_director_invite`) | Must |
| FR-ADM-03 | CRUD y visualización global de todos los datos | Must |

### 2.3 Director (FR-DIR)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-DIR-01 | Activar cuenta vía invitación | Must |
| FR-DIR-02 | Invitar teachers de su centro | Must |
| FR-DIR-03 | CRUD teachers, clases, alumnos de su `school_id` | Must |
| FR-DIR-04 | Ver progreso de todos los alumnos de su centro (solo lectura) | Must |
| FR-DIR-05 | Varios directores pueden compartir el mismo centro | Must |

### 2.4 Teacher (FR-TCH)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-TCH-01 | Activar cuenta vía invitación | Must |
| FR-TCH-02 | CRUD de sus clases | Must |
| FR-TCH-03 | Crear alumnos en sus clases (con o sin email inicial) | Must |
| FR-TCH-04 | Generar invitación padre (email obligatorio para enlace) | Must |
| FR-TCH-05 | Editar alumno solo mientras `parent_id IS NULL` | Must |
| FR-TCH-06 | Ver progreso, diario y medallas de sus alumnos (solo lectura) | Must |
| FR-TCH-07 | No acceder a clases de otros teachers del mismo centro | Must |

### 2.5 Parent (FR-PAR)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-PAR-01 | Activar cuenta vía invitación (contraseña) | Must |
| FR-PAR-02 | Onboarding padre: nombre + relación obligatorios; apellidos y teléfono opcionales | Must |
| FR-PAR-03 | Onboarding hijo: género y fecha nacimiento obligatorios; validar nombre/apellidos | Must |
| FR-PAR-04 | Segunda invitación: saltar onboarding padre | Must |
| FR-PAR-05 | Multi-hijo sin límite; multi-centro en misma cuenta | Must |
| FR-PAR-06 | Selector de hijo muestra centro de cada uno | Must |
| FR-PAR-07 | Solo el padre modifica perfil del niño tras vinculación | Must |

### 2.6 Programa pedagógico (FR-PROG)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-PROG-01 | Progreso inicializado al crear alumno (trigger `setup_child`) | Must |
| FR-PROG-02 | Padre valora actividades (1–5 + opinión) | Must |
| FR-PROG-03 | Progresión de misiones y medallas vía triggers BD | Must |
| FR-PROG-04 | Contenido de actividades renderizado en frontend | Must |
| FR-PROG-05 | Catálogo (`missions`, `activities`, `medals`) solo editable por desarrollo | Must |

### 2.7 Diario emocional (FR-DIARY)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-DIARY-01 | Padre crea/edita entradas por hijo y fecha | Must |
| FR-DIARY-02 | Teacher y director leen diario de alumnos de su ámbito | Must |
| FR-DIARY-03 | RPC `upsert_emotional_diary` | Must |

### 2.8 Tests de inteligencia emocional (FR-TEST)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-TEST-01 | TMMS padres en `/brainifamily/test-tmms-padres` | Should |
| FR-TEST-02 | Test emocional niños en contexto del hijo activo | Should |
| FR-TEST-03 | No obligatorios para completar onboarding | Should |

### 2.9 Invitaciones (FR-INV)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-INV-01 | Token único; caducidad 15 días | Must |
| FR-INV-02 | Estados: `pending`, `completed`, `expired`, `revoked` | Must |
| FR-INV-03 | Regenerar revoca `pending` anterior del mismo niño | Must |
| FR-INV-04 | Enlace manual (sin email automático en v2.0) | Must |
| FR-INV-05 | Rechazar email con rol incompatible | Must |

### 2.10 Landings (FR-LAND)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-LAND-01 | BrainiFamily landing solo Login (sin signup) | Must |
| FR-LAND-02 | Hub, Kids, Juniors informativas | Should |
| FR-LAND-03 | Rutas legacy redirigen a `/brainifamily/*` | Should |

### 2.11 Fuera de alcance — no implementar (FR-OUT)

| ID | Elemento |
|----|----------|
| FR-OUT-01 | `/brainifamily/signup` |
| FR-OUT-02 | Waitlist |
| FR-OUT-03 | Test Genius |
| FR-OUT-04 | Conferencia |

---

## 3. Requisitos no funcionales

### 3.1 Seguridad (NFR-SEC)

| ID | Requisito |
|----|-----------|
| NFR-SEC-01 | Cliente solo expone `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` |
| NFR-SEC-02 | Service role solo en Edge Functions (nunca en frontend) |
| NFR-SEC-03 | RLS habilitado en tablas de negocio |
| NFR-SEC-04 | Operaciones privilegiadas vía RPC `SECURITY DEFINER` con validación interna |
| NFR-SEC-05 | Validar tokens y `expires_at` en servidor |

### 3.2 Rendimiento (NFR-PERF)

| ID | Requisito |
|----|-----------|
| NFR-PERF-01 | TanStack React Query para caché de datos |
| NFR-PERF-02 | Lazy loading de rutas y actividades pesadas (puzzles) |
| NFR-PERF-03 | Bundle JS inicial < 400 KB sin gzip (objetivo post-Fase 1) |

### 3.3 Mantenibilidad (NFR-MAIN)

| ID | Requisito |
|----|-----------|
| NFR-MAIN-01 | TypeScript en frontend |
| NFR-MAIN-02 | Migraciones SQL versionadas (objetivo; ver gap en doc 13) |
| NFR-MAIN-03 | Edge Functions versionadas en `supabase/functions/` |
| NFR-MAIN-04 | `docs/` como fuente de verdad de dominio |
| NFR-MAIN-05 | Gate pre-push: `npm run verify` + `npm run test:e2e:smoke` |

### 3.4 Testing (NFR-TEST)

| ID | Requisito |
|----|-----------|
| NFR-TEST-01 | Vitest + RTL + MSW para unit/integración |
| NFR-TEST-02 | Playwright smoke E2E sin auth remoto |
| NFR-TEST-03 | E2E autenticado opcional con `.env.test` |

### 3.5 Internacionalización (NFR-I18N)

| ID | Requisito |
|----|-----------|
| NFR-I18N-01 | UI en español |

### 3.6 Despliegue (NFR-DEPLOY)

| ID | Requisito |
|----|-----------|
| NFR-DEPLOY-01 | Hosting estático en Vercel (SPA rewrites) |
| NFR-DEPLOY-02 | Node 20.19+ o 22.12+ para desarrollo y CI |

---

## 4. Restricciones de diseño

- Backend: Supabase BaaS (PostgreSQL 17, Auth, Storage, Edge Deno).
- Progresión pedagógica: triggers en BD, no solo en cliente.
- Un email = un rol; sin acumulación de roles.
- Catálogo pedagógico inmutable para usuarios de la plataforma.

---

## 5. Trazabilidad

| Documento | Relación |
|-----------|----------|
| [06-FLUJOS](06-FLUJOS-ONBOARDING-E-INVITACIONES.md) | Detalle operativo de FR-AUTH, FR-INV, FR-PAR |
| [05-ROLES](05-ROLES-Y-PERMISOS.md) | FR-DIR, FR-TCH, FR-PAR en matrices |
| [12-CRITERIOS](12-CRITERIOS-DE-ACEPTACION.md) | CA-* verificables por FR |
