# Modelo de datos — BRAINI

**Versión:** 3.0  
**Validación:** MCP `list_tables` + `execute_sql` — proyecto `igwoavsazbycqmdweger`, julio 2026

---

## 1. Resumen

**19 tablas** en esquema `public`, todas con **RLS habilitado**. Dominios:

| Dominio | Tablas |
|---------|--------|
| Organización | `schools`, `directors`, `teachers`, `classes` |
| Identidad / roles | `auth.users`, `user_roles`, `admin_emails` |
| Familia | `parents`, `children` |
| Invitaciones | `director_invited`, `teacher_invited`, `parent_invited` |
| Catálogo | `courses`, `missions`, `activities`, `medals` |
| Progreso | `child_missions`, `child_activities`, `child_medals` |
| Diario | `emotional_diary` |

**Eliminadas en v2.0 (no recrear):** `waitlist`, `test_genius_evaluations`, `platform_admin_emails` (→ `admin_emails`), columna `centro_escolar`, columna `children_count`.

---

## 2. Enumeraciones (verificadas en remoto)

| Enum | Valores |
|------|---------|
| `user_role_enum` | `parent`, `teacher`, `director` |
| `invite_status_enum` | `pending`, `completed`, `expired`, `revoked` |
| `level_status` | `locked`, `current`, `completed` |
| `genero_enum` | `niño`, `niña`, `prefiero_no_decirlo` |
| `relacion_con_menor_enum` | `madre`, `padre`, `abuelo_a`, `tutor_a`, `otro` |
| `nivel_educativo_children` | `infantil_3` … `infantil_5`, `primaria_1` … `primaria_6` |
| `activity_type_enum` | `inteligencia_emocional`, `regulacion_emocional`, `vinculo_afectivo`, `acompañamiento_emocional` |

---

## 3. Organización del centro

### `schools`

Centros educativos; creados por super admin.

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | uuid PK | |
| `name` | text NOT NULL | |
| `active` | boolean | default `true` |
| `created_at`, `updated_at` | timestamptz | |

### `directors`

Equipo directivo; **varios registros por centro** permitidos.

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | uuid PK FK → `auth.users` | |
| `school_id` | uuid FK NOT NULL | |
| `email`, `nombre` | text | `nombre` NOT NULL |
| `active` | boolean | default `true` |

### `teachers`

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | uuid PK FK → `auth.users` | |
| `school_id` | uuid FK NOT NULL | |
| `email`, `nombre` | text | `nombre` NOT NULL |
| `active` | boolean | |

### `classes`

Clases creadas por teachers; nombre único por teacher.

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | uuid PK | |
| `school_id` | uuid FK | De `teachers` |
| `teacher_id` | uuid FK | `auth.uid()` al crear |
| `course_id` | uuid FK NOT NULL | |
| `name` | text NOT NULL | UNIQUE (`teacher_id`, `name`) |
| `nivel_educativo` | enum NOT NULL | Validado con `course_id` |
| `academic_year` | text | Opcional |
| `active` | boolean | |

---

## 4. Familia

### `parents`

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | uuid PK FK → `auth.users` | |
| `email` | text NOT NULL UNIQUE | Solo lectura en onboarding |
| `nombre` | text NOT NULL | Obligatorio en onboarding |
| `apellidos` | text | Opcional |
| `telefono_contacto` | text | Opcional; CHECK formato ES |
| `relacion_con_menor` | enum NOT NULL | default `otro` |
| `profile_completed` | boolean | default `false` |

### `children`

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | uuid PK | |
| `parent_id` | uuid FK nullable | Hasta completar invitación padre |
| `class_id` | uuid FK NOT NULL | |
| `school_id` | uuid FK NOT NULL | Trigger desde clase |
| `course_id` | uuid FK | Trigger desde clase |
| `nivel_educativo` | enum NOT NULL | Trigger; solo lectura padre |
| `nombre` | text NOT NULL | |
| `apellidos` | text | |
| `genero` | enum | Padre obligatorio en onboarding |
| `fecha_nacimiento` | date | Padre obligatorio en onboarding |
| `profile_completed` | boolean | default `false` |
| `active` | boolean | |

**Sin** columna `centro_escolar` texto; el centro se muestra vía `school_id` → `schools.name`.

---

## 5. Invitaciones

Estructura común en `director_invited`, `teacher_invited`, `parent_invited`:

| Columna | Notas |
|---------|-------|
| `id` | uuid PK |
| `email` | NOT NULL (lower trim) |
| `school_id` | FK |
| `token` | UNIQUE |
| `expires_at` | `now() + 15 días` |
| `status` | `invite_status_enum`, default `pending` |
| `invited_by` | Según tipo (ver abajo) |
| `completed_at` | nullable |

**Diferencias por tabla:**

| Tabla | Campo extra | `invited_by` |
|-------|-------------|--------------|
| `director_invited` | `director_id` nullable | `auth.users` (super admin) |
| `teacher_invited` | `teacher_id` nullable | `directors.id` |
| `parent_invited` | `child_id` obligatorio | `teachers.id` |

`create_parent_invite` revoca `pending` anterior del mismo `child_id`.

---

## 6. Catálogo pedagógico

| Tabla | Relación | Notas |
|-------|----------|-------|
| `courses` | — | Catálogo de niveles; determina misiones |
| `missions` | FK `course_id` | Sesiones del programa |
| `activities` | FK `mission_id` | Contenido BD + render React |
| `medals` | FK `mission_id` UNIQUE | 1 medalla por misión |

Solo lectura para roles de plataforma en producción.

---

## 7. Progreso

### Inicialización (`setup_child`)

Al INSERT/UPDATE de `children.course_id`:

- Crea `child_missions`: primera misión = `current`, resto = `locked`.
- Crea `child_activities` para cada actividad de las misiones del curso.

### `child_missions`

| Columna | Notas |
|---------|-------|
| `child_id`, `mission_id` | FK |
| `status` | `locked` / `current` / `completed` |
| `started_at`, `completed_at` | timestamps |

Progresión vía trigger `complete_mission` al valorar actividades.

### `child_activities`

| Columna | Notas |
|---------|-------|
| `child_id`, `activity_id` | FK |
| `puntuacion` | 1–5 (padre) |
| `opinion` | text opcional |

### `child_medals`

Asignación automática al completar misión (trigger).

---

## 8. Diario emocional — `emotional_diary`

| Columna | Notas |
|---------|-------|
| `user_id` | FK `auth.users` (padre) |
| `child_id` | FK |
| `entry_date` | date NOT NULL |
| `emotion_names` | varchar[] |
| `observations` | text |

Upsert vía RPC `upsert_emotional_diary`. Una entrada lógica por (`user_id`, `child_id`, `entry_date`).

---

## 9. Identidad y roles

### `user_roles`

| Columna | Notas |
|---------|-------|
| `id` | PK = `auth.users.id` |
| `role` | `user_role_enum` — un rol por usuario |

Super admin **no** está en `user_roles`; se resuelve con `admin_emails` + `is_super_admin()`.

### `admin_emails`

Emails con acceso al dashboard super admin (típicamente 1–3 correos).

---

## 10. Triggers y funciones

| Objeto | Tabla / evento | Función |
|--------|----------------|---------|
| `trg_children_sync_from_class` | `children` BEFORE INSERT/UPDATE | Hereda `school_id`, `course_id`, `nivel_educativo` |
| `trg_classes_propagate_to_children` | `classes` AFTER UPDATE | Propaga cambios a alumnos |
| `trg_validate_class_course_nivel` | `classes` BEFORE INSERT/UPDATE | Valida coherencia curso/nivel |
| `trigger_setup_child` | `children` AFTER INSERT/UPDATE `course_id` | Inicializa progreso |
| `trigger_complete_mission` | `child_activities` AFTER INSERT/UPDATE | Avanza misión + medalla |
| `set_updated_at` | Varias tablas | Actualiza `updated_at` |

---

## 11. Derivaciones automáticas

| Dato mostrado al padre | Origen |
|------------------------|--------|
| Nombre colegio | `children.school_id` → `schools.name` |
| Nivel educativo | `children.nivel_educativo` (de clase) |
| Curso / itinerario | `children.course_id` (de clase) |

---

## 12. RPC públicas (remoto)

| RPC | Propósito |
|-----|-----------|
| `get_my_role()` | Rol + `school_id` |
| `is_super_admin()` | Comprueba `admin_emails` |
| `email_platform_status(p_email)` | Estado del email en plataforma |
| `admin_create_school(p_name)` | Alta centro |
| `create_director_invite` | Invitación director |
| `create_teacher_invite` | Invitación teacher |
| `create_parent_invite` | Invitación padre |
| `get_*_invite_by_token` | Preview invitación |
| `complete_*_invite` | Activar rol + vínculos |
| `upsert_emotional_diary` | CRUD diario |
| `teacher_owns_child`, `director_in_child_school` | Helpers RLS |

Detalle de invocación en [10-BACKEND-SUPABASE](10-BACKEND-SUPABASE.md).

---

## 13. Gap documentado

Las **migraciones SQL** no están versionadas en el repositorio (`supabase/migrations/` vacío o ausente). El esquema descrito refleja el **remoto**; ver [13-ESTADO-ACTUAL](13-ESTADO-ACTUAL.md).
