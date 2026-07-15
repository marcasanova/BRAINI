# SRS — Software Requirements Specification

**Versión:** 2.0  
**Producto:** BRAINI BrainiFamily B2B

---

## 1. Introducción

### 1.1 Propósito

Definir **qué debe hacer** el software BRAINI y **bajo qué condiciones**, como base para implementación backend y posteriormente frontend.

### 1.2 Actores

| Actor | Descripción |
|-------|-------------|
| Visitante | Sin sesión; solo landings y login |
| Super admin | Email en `admin_emails`; gestión global |
| Director | Usuario en `directors` + `user_roles.director` |
| Teacher | Usuario en `teachers` + `user_roles.teacher` |
| Parent | Usuario en `parents` + `user_roles.parent` |
| Sistema | Supabase (Auth, DB, Storage, Edge Functions) |

---

## 2. Requisitos funcionales

### 2.1 Acceso y autenticación

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-AUTH-01 | No existe registro público; alta solo vía invitación | Must |
| FR-AUTH-02 | Login único (`/brainifamily/login`) para todos los roles | Must |
| FR-AUTH-03 | Login sin cuenta previa devuelve error (no crea cuenta) | Must |
| FR-AUTH-04 | Recuperación de contraseña vía email Supabase | Must |
| FR-AUTH-05 | Post-login: `get_my_role()` redirige al panel correcto | Must |
| FR-AUTH-06 | Completar invitación director/teacher/parent vía Edge Functions | Must |
| FR-AUTH-07 | Segunda invitación padre (mismo email): login sin nueva contraseña | Must |
| FR-AUTH-08 | Al generar invitación: validar si email ya existe en el sistema | Must |

### 2.2 Super admin

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-ADM-01 | Crear centros (`admin_create_school`) | Must |
| FR-ADM-02 | Invitar directores (`create_director_invite`) | Must |
| FR-ADM-03 | CRUD y visualización global de todos los datos | Must |

### 2.3 Director

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-DIR-01 | Activar cuenta vía invitación | Must |
| FR-DIR-02 | Invitar teachers de su centro | Must |
| FR-DIR-03 | CRUD teachers, clases, alumnos de su `school_id` | Must |
| FR-DIR-04 | Ver progreso de todos los alumnos de su centro (solo lectura) | Must |
| FR-DIR-05 | Varios directores pueden compartir el mismo centro | Must |

### 2.4 Teacher

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-TCH-01 | Activar cuenta vía invitación | Must |
| FR-TCH-02 | CRUD de sus clases | Must |
| FR-TCH-03 | Crear alumnos en sus clases (con o sin email inicial) | Must |
| FR-TCH-04 | Generar invitación padre (email obligatorio para enlace) | Must |
| FR-TCH-05 | Editar alumno solo mientras `parent_id IS NULL` | Must |
| FR-TCH-06 | Ver progreso, diario y medallas de sus alumnos (solo lectura) | Must |
| FR-TCH-07 | No acceder a clases de otros teachers del mismo centro | Must |

### 2.5 Parent

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-PAR-01 | Activar cuenta vía invitación (contraseña) | Must |
| FR-PAR-02 | Onboarding padre: nombre + relación obligatorios; apellidos y teléfono opcionales | Must |
| FR-PAR-03 | Onboarding hijo: género y fecha nacimiento obligatorios; validar nombre/apellidos | Must |
| FR-PAR-04 | Segunda invitación: saltar onboarding padre | Must |
| FR-PAR-05 | Multi-hijo sin límite; multi-centro en misma cuenta | Must |
| FR-PAR-06 | Selector de hijo muestra centro de cada uno | Must |
| FR-PAR-07 | Solo el padre modifica perfil del niño tras vinculación | Must |

### 2.6 Programa pedagógico

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-PROG-01 | Progreso inicializado al crear alumno (trigger `setup_child`) | Must |
| FR-PROG-02 | Padre valora actividades (1–5 + opinión) | Must |
| FR-PROG-03 | Progresión de misiones y medallas vía triggers BD | Must |
| FR-PROG-04 | Contenido de actividades renderizado en frontend | Must |
| FR-PROG-05 | Catálogo (missions, activities, medals) solo editable por desarrollo | Must |

### 2.7 Diario emocional

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-DIARY-01 | Padre crea/edita entradas por hijo y fecha | Must |
| FR-DIARY-02 | Teacher y director leen diario de alumnos de su ámbito | Must |
| FR-DIARY-03 | RPC `upsert_emotional_diary` | Must |

### 2.8 Tests inteligencia emocional

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-TEST-01 | Test TMMS padres disponible para padres autenticados | Must |
| FR-TEST-02 | Test emocional niños disponible en contexto del hijo | Must |
| FR-TEST-03 | No obligatorios en onboarding | Should |

### 2.9 Invitaciones

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-INV-01 | Token único; caducidad 15 días | Must |
| FR-INV-02 | Estados: pending, completed, expired, revoked | Must |
| FR-INV-03 | Regenerar invitación padre revoca pending anterior del mismo niño | Must |
| FR-INV-04 | Enlace manual (copiar); sin envío email automático en v2.0 | Must |
| FR-INV-05 | Rechazar invitación si email ya tiene rol incompatible | Must |

### 2.10 Landings

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-LAND-01 | BrainiFamily landing: solo botón Login (sin registro) | Must |
| FR-LAND-02 | Hub `/` y landings Kids/Juniors: informativas | Should |
| FR-LAND-03 | Rutas legacy redirigen a `/brainifamily/*` | Should |

### 2.11 Eliminados (no implementar)

| ID | Requisito |
|----|-----------|
| FR-OUT-01 | ~~Registro público /signup~~ |
| FR-OUT-02 | ~~Waitlist~~ |
| FR-OUT-03 | ~~Test Genius~~ |
| FR-OUT-04 | ~~Conferencia~~ |

---

## 3. Requisitos no funcionales

### 3.1 Seguridad

| ID | Requisito |
|----|-----------|
| NFR-SEC-01 | Solo `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en cliente |
| NFR-SEC-02 | Service role solo en Edge Functions |
| NFR-SEC-03 | RLS habilitado en todas las tablas de negocio |
| NFR-SEC-04 | Operaciones privilegiadas vía RPC SECURITY DEFINER |
| NFR-SEC-05 | Validación de tokens y `expires_at` en servidor |

### 3.2 Rendimiento y UX

| ID | Requisito |
|----|-----------|
| NFR-PERF-01 | React Query para caché de datos |
| NFR-PERF-02 | Timeouts en verificación de sesión |

### 3.3 Mantenibilidad

| ID | Requisito |
|----|-----------|
| NFR-MAIN-01 | TypeScript en frontend |
| NFR-MAIN-02 | Migraciones SQL versionadas en `supabase/migrations` |
| NFR-MAIN-03 | Edge Functions versionadas en `supabase/functions` |
| NFR-MAIN-04 | Documentación en `docs/` como fuente de verdad |

### 3.4 Internacionalización

| ID | Requisito |
|----|-----------|
| NFR-I18N-01 | UI en español |

---

## 4. Restricciones

- Backend: **Supabase** (Auth + PostgreSQL + Storage + Edge Functions).
- Reglas de progresión en **triggers BD**; el cliente no es fuente de verdad.
- Un email = un rol; sin excepciones.
- Contenido pedagógico gestionado solo por el equipo de desarrollo.

---

## 5. Trazabilidad

| Área | Documento |
|------|-----------|
| Flujos | [01-ONBOARDING-POR-ROL.md](./01-ONBOARDING-POR-ROL.md) |
| Permisos | [04-ROLES-Y-PERMISOS.md](./04-ROLES-Y-PERMISOS.md) |
| Datos | [05-MODELO-DATOS.md](./05-MODELO-DATOS.md) |
| Técnico | [08-TDD.md](./08-TDD.md) |
| Aceptación | [09-CRITERIOS-ACEPTACION.md](./09-CRITERIOS-ACEPTACION.md) |
