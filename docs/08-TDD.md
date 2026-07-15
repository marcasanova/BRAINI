# TDD — Technical Design Document

**Versión:** 2.0

---

## 1. Arquitectura

```
┌─────────────┐     HTTPS (anon key)      ┌──────────────────────────────┐
│   Browser   │ ────────────────────────► │ Supabase                     │
│  React SPA  │                             │ • Auth (GoTrue)              │
└─────────────┘     invoke Edge Functions   │ • PostgREST + RLS            │
       │           ───────────────────────► │ • Storage (assets públicos)  │
       │                                     │ • Edge Functions (service)   │
       └──────────────────────────────────── └──────────────────────────────┘
```

**Orden de implementación acordado:**

1. Documentación (`docs/`) — **completada v2.0**
2. Backend (BD, RLS, RPC, Edge Functions, migraciones)
3. Frontend (alineado con docs)

---

## 2. Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 18, TypeScript, Vite, react-router-dom, TanStack Query |
| UI | Radix / shadcn, Tailwind CSS |
| Backend | Supabase (PostgreSQL 17, Auth, Storage, Edge Functions Deno) |
| Cliente | `@supabase/supabase-js` ^2.49 |
| Despliegue front | Hosting estático (p. ej. Vercel) |

---

## 3. Estructura del repositorio (objetivo)

```
BRAINI/
├── docs/                    # Fuente de verdad v2.0
├── src/                     # SPA React (fase 3)
├── supabase/
│   ├── migrations/          # Pendiente: exportar desde Supabase
│   ├── functions/
│   │   ├── complete-director-invite/
│   │   ├── complete-teacher-invite/
│   │   └── complete-parent-invite/
│   └── config.toml
└── public/
```

---

## 4. Autenticación

- Email + contraseña (Supabase Auth).
- **Sin** `signUp` público en frontend.
- Alta de usuarios solo vía Edge Functions con `auth.admin.createUser` al completar invitación.
- Recuperación de contraseña: `resetPasswordForEmail` → `/brainifamily/update-password`.
- JWT gestionado por cliente Supabase.

### 4.1 Resolución de rol

```sql
-- RPC: get_my_role()
-- 1. Si is_super_admin() → role = 'super_admin'
-- 2. Si no, lee user_roles
-- 3. Devuelve role + school_id (director/teacher)
```

---

## 5. Row Level Security — estado y gaps

### 5.1 Implementado

| Tabla | Políticas existentes |
|-------|---------------------|
| `children` | Padre CRUD propios; teacher INSERT/SELECT/UPDATE (antes de vincular); director SELECT por centro; super_admin SELECT |
| `classes` | Teacher CRUD propias; director SELECT centro |
| `parent_invited` | Teacher INSERT/SELECT/UPDATE su escuela |
| `teacher_invited` | Director INSERT/SELECT/UPDATE su centro |
| `director_invited` | Super admin CRUD |
| `schools` | SELECT por centro / super admin |

### 5.2 Pendiente (requerido por v2.0)

Ampliar **SELECT** para teacher y director en:

| Tabla | Política objetivo |
|-------|-------------------|
| `child_missions` | Teacher: alumnos de sus clases. Director: alumnos de su centro. Super admin: todo |
| `child_activities` | Idem |
| `child_medals` | Idem |
| `emotional_diary` | Teacher: alumnos de sus clases. Director: su centro. Padre: escritura propia |

**Sin estas políticas**, el dashboard teacher no puede mostrar progreso aunque la UI lo intente.

### 5.3 Validación de email en invitaciones

**Requisito nuevo:** RPC o función auxiliar `email_exists_in_platform(p_email)` que consulte:

1. `auth.users` (vía SECURITY DEFINER o Edge Function).
2. Tablas `parents`, `teachers`, `directors` por email.

Usar en:

- `create_director_invite`
- `create_teacher_invite`
- `create_parent_invite` (permitir si solo existe como `parent`)

---

## 6. RPC — catálogo

| RPC | Parámetros | Retorno | Invocador |
|-----|------------|---------|-----------|
| `get_my_role` | — | json | Cliente autenticado |
| `is_super_admin` | — | boolean | Interno |
| `admin_create_school` | p_name | uuid | Super admin |
| `create_director_invite` | p_school_id, p_email | jsonb | Super admin |
| `create_teacher_invite` | p_school_id, p_email | jsonb | Director |
| `create_parent_invite` | p_child_id, p_email | jsonb | Teacher |
| `get_*_invite_by_token` | p_token | table | Edge / anon preview |
| `complete_*_invite` | invite_id, user_id, email, nombre | jsonb | Edge Function |
| `upsert_emotional_diary` | user_id, child_id, emotions, obs, date | row | Padre |

### 6.1 `create_parent_invite` — comportamiento actual

- Valida teacher propietario del alumno.
- Email obligatorio.
- Revoca `pending` anterior del mismo `child_id`.
- `expires_at = now() + interval '15 days'`.

### 6.2 `complete_parent_invite` — comportamiento actual

- Valida invitación `pending` no caducada.
- Crea/actualiza `user_roles` (parent) y `parents`.
- Asigna `children.parent_id`.
- **Pendiente:** asegurar que `parents.email` se rellena desde invitación/Auth.

---

## 7. Edge Functions

| Función | verify_jwt | Flujo |
|---------|------------|-------|
| `complete-director-invite` | false | token → preview / complete → createUser → RPC |
| `complete-teacher-invite` | false | Idem |
| `complete-parent-invite` | false | token → preview; complete con createUser o sesión JWT existente → RPC |

### 7.1 `complete-parent-invite` — ramas

1. **Preview** (`action: preview`): datos invitación + escuela + hijo + detección cuenta existente.
2. **Cuenta nueva:** `admin.createUser` → `complete_parent_invite`.
3. **Cuenta existente (mismo email):** `signInWithPassword` o sesión JWT → `complete_parent_invite` sin createUser.
4. **Rollback:** si RPC falla tras createUser, `deleteUser`.

### 7.2 Funciones eliminadas / no necesarias

- `check-email-exists` — reemplazar por validación integrada en RPC de invitaciones.

---

## 8. Triggers

| Trigger | Evento | Efecto |
|---------|--------|--------|
| `trg_children_sync_from_class` | BEFORE INSERT/UPDATE children.class_id | Copia school_id, course_id, nivel_educativo |
| `trg_classes_propagate_to_children` | AFTER UPDATE classes | Propaga a alumnos de la clase |
| `trg_validate_class_course_nivel` | BEFORE INSERT/UPDATE classes | Valida coherencia |
| `trigger_setup_child` | AFTER INSERT/UPDATE children.course_id | Crea child_missions + child_activities |
| `trigger_complete_mission` | AFTER INSERT/UPDATE child_activities.puntuacion | Avanza misión; otorga medalla |

---

## 9. Variables de entorno

### Frontend

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Edge Functions

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 10. Storage

Buckets públicos para:

- Emociones (infantil / primaria)
- Assets de actividades
- Documentos legales (política de privacidad)

---

## 11. Roadmap técnico (backend primero)

### Fase 2a — Base de datos

- [ ] Exportar esquema actual a `supabase/migrations`
- [ ] Añadir políticas RLS SELECT para teacher/director en progreso y diario
- [ ] RPC `email_exists_in_platform` + integrar en `create_*_invite`
- [ ] Asegurar `parents.email` en `complete_parent_invite`
- [ ] Políticas CRUD director según [04-ROLES-Y-PERMISOS.md](./04-ROLES-Y-PERMISOS.md)
- [ ] Políticas super_admin INSERT/UPDATE/DELETE donde falten

### Fase 2b — Edge Functions

- [ ] Sincronizar las 3 functions en repo con producción
- [ ] Manejo uniforme de email existente en teacher/director invites

### Fase 3 — Frontend

- [ ] Eliminar SignUp, Conferencia, TestGenius, waitlist
- [ ] Landing BrainiFamily: solo login
- [ ] Onboarding: campos obligatorios según docs
- [ ] Validación email al invitar (UI + mensajes)
- [ ] Selector hijo con nombre de centro

---

## 12. Seguridad

1. Service role **nunca** en bundle frontend.
2. Validar tokens y caducidad en servidor.
3. CORS acotado en Edge Functions en producción.
4. Revisar políticas con rol `public` vs `authenticated`.

---

## 13. Referencias

| Tema | Archivo |
|------|---------|
| Modelo datos | [05-MODELO-DATOS.md](./05-MODELO-DATOS.md) |
| ERD | [06-ERD.md](./06-ERD.md) |
| Permisos | [04-ROLES-Y-PERMISOS.md](./04-ROLES-Y-PERMISOS.md) |
| Aceptación | [09-CRITERIOS-ACEPTACION.md](./09-CRITERIOS-ACEPTACION.md) |
