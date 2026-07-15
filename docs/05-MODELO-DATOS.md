# Modelo de datos — BRAINI

**Versión:** 2.0  
**Fuente de verdad en producción:** PostgreSQL (`public`) en Supabase proyecto BRAINI.

---

## 1. Dominios del modelo

| Dominio | Tablas principales |
|---------|-------------------|
| Organización | `schools`, `directors`, `teachers`, `classes` |
| Identidad y roles | `auth.users`, `user_roles`, `admin_emails` |
| Familia | `parents`, `children` |
| Invitaciones | `director_invited`, `teacher_invited`, `parent_invited` |
| Catálogo pedagógico | `courses`, `missions`, `activities`, `medals` |
| Progreso | `child_missions`, `child_activities`, `child_medals` |
| Diario | `emotional_diary` |

**Eliminadas del producto v2.0:** `waitlist`, `test_genius_evaluations`, `centro_escolar` (columna), `children_count` (columna), `platform_admin_emails` (usar `admin_emails`).

---

## 2. Enumeraciones

| Enum | Valores | Uso |
|------|---------|-----|
| `user_role_enum` | `parent`, `teacher`, `director` | `user_roles.role` |
| `invite_status_enum` | `pending`, `completed`, `expired`, `revoked` | Tablas `*_invited` |
| `level_status` | `locked`, `current`, `completed` | `child_missions.status` |
| `genero_enum` | `niño`, `niña`, `prefiero_no_decirlo` | `children.genero` |
| `relacion_con_menor_enum` | `madre`, `padre`, `abuelo_a`, `tutor_a`, `otro` | `parents.relacion_con_menor` |
| `nivel_educativo_children` | `infantil_3` … `primaria_6` | `classes`, `children` |
| `activity_type_enum` | `inteligencia_emocional`, `regulacion_emocional`, `vinculo_afectivo`, `acompañamiento_emocional` | `activities` |

---

## 3. Tablas de organización

### 3.1 `schools`

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK | |
| name | text NOT NULL | Nombre del centro |
| active | boolean | default true |
| created_at, updated_at | timestamptz | |

### 3.2 `directors`

Varios registros pueden compartir el mismo `school_id`.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK, FK → auth.users | |
| school_id | uuid FK → schools | NOT NULL |
| email | text | |
| nombre | text NOT NULL | |
| active | boolean | default true |

### 3.3 `teachers`

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK, FK → auth.users | |
| school_id | uuid FK → schools | NOT NULL |
| email | text | |
| nombre | text NOT NULL | |
| active | boolean | default true |

### 3.4 `classes`

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK | |
| school_id | uuid FK | |
| teacher_id | uuid FK → teachers | |
| course_id | int FK → courses | NOT NULL |
| name | text NOT NULL | UNIQUE (teacher_id, name) |
| nivel_educativo | enum NOT NULL | Coherente con course_id |
| academic_year | text | Opcional |
| active | boolean | default true |

---

## 4. Familia

### 4.1 `parents`

| Columna | Tipo | Onboarding | Notas |
|---------|------|------------|-------|
| id | uuid PK, FK → auth.users | — | |
| email | text NOT NULL UNIQUE | Solo lectura (invitación) | |
| nombre | text NOT NULL | **Obligatorio** | |
| apellidos | text | Opcional | |
| telefono_contacto | text | Opcional | CHECK formato ES |
| relacion_con_menor | enum NOT NULL | **Obligatorio** | default `otro` |
| profile_completed | boolean | — | default false |

### 4.2 `children`

| Columna | Tipo | Quién introduce | Notas |
|---------|------|-----------------|-------|
| id | uuid PK | Sistema | |
| parent_id | uuid FK → parents | Invitación | **NULL** hasta vincular padre |
| class_id | uuid FK → classes | Teacher | NOT NULL |
| school_id | uuid FK → schools | **Trigger** desde clase | NOT NULL |
| course_id | int FK → courses | **Trigger** desde clase | |
| nivel_educativo | enum | **Trigger** desde clase | NOT NULL; solo lectura para padre |
| nombre | text NOT NULL | Teacher; padre valida | |
| apellidos | text | Teacher; padre valida | |
| genero | enum | **Padre obligatorio** | |
| fecha_nacimiento | date | **Padre obligatorio** | |
| profile_completed | boolean | Sistema | default false |
| active | boolean | | default true |

**Regla:** no existe `centro_escolar` como texto libre; el centro se muestra vía `school_id` → `schools.name`.

---

## 5. Invitaciones

Estructura común:

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| email | text NOT NULL | Normalizado lower(trim) |
| school_id | uuid FK | |
| token | text UNIQUE | |
| expires_at | timestamptz | **now() + 15 days** |
| status | invite_status_enum | default `pending` |
| invited_by | uuid | Según tipo |
| completed_at | timestamptz | nullable |

### 5.1 `director_invited`

- `invited_by` → auth.users (super admin).
- `director_id` → directors (nullable hasta completar).

### 5.2 `teacher_invited`

- `invited_by` → directors.id.
- `teacher_id` → teachers (nullable hasta completar).

### 5.3 `parent_invited`

- `child_id` → children (**obligatorio**; el niño existe antes de invitar).
- `invited_by` → teachers.id.
- Al crear nueva invitación: revoca `pending` anterior del mismo `child_id`.

---

## 6. Catálogo pedagógico (solo desarrollo)

### 6.1 `courses`

Catálogo de cursos/niveles. Determina qué misiones se asignan.

### 6.2 `missions`

| Columna | Notas |
|---------|-------|
| id | PK |
| titulo, descripcion | |
| course_id | FK; define itinerario por curso |

### 6.3 `activities`

Vinculadas a `mission_id`. Contenido pedagógico en BD; renderizado en frontend por componentes React.

### 6.4 `medals`

Una medalla por misión (`mission_id` UNIQUE).

---

## 7. Progreso

### 7.1 Inicialización

Trigger `setup_child` al INSERT/UPDATE de `children.course_id`:

1. Crea `child_missions` para todas las misiones del `course_id`.
2. Primera misión → `status = current`; resto → `locked`.
3. Crea `child_activities` para todas las actividades del curso.

### 7.2 `child_missions`

| Columna | Notas |
|---------|-------|
| child_id, mission_id | |
| status | `locked` / `current` / `completed` |
| started_at, completed_at | |

Progresión vía trigger `complete_mission` al valorar actividad.

### 7.3 `child_activities`

| Columna | Notas |
|---------|-------|
| puntuacion | 1–5 (padre) |
| opinion | texto opcional |

### 7.4 `child_medals`

Otorgadas por trigger al completar misión.

---

## 8. Diario emocional

### `emotional_diary`

| Columna | Notas |
|---------|-------|
| user_id | FK → auth.users (padre) |
| child_id | FK → children |
| entry_date | date NOT NULL |
| emotion_names | varchar[] |
| observations | text |

Upsert vía RPC `upsert_emotional_diary`. Una entrada lógica por (user_id, child_id, entry_date).

---

## 9. Triggers y funciones clave

| Objeto | Función |
|--------|---------|
| `children_sync_from_class` | Hereda school_id, course_id, nivel_educativo de la clase |
| `classes_propagate_to_children` | Propaga cambios de clase a alumnos existentes |
| `validate_class_course_nivel` | Valida coherencia curso/nivel en clases |
| `setup_child` | Inicializa misiones y actividades del niño |
| `complete_mission` | Avanza progreso y otorga medallas |
| `get_my_role` | Resuelve rol + school_id |
| `create_*_invite` | Genera invitaciones con token |
| `complete_*_invite` | Completa invitación y crea vínculos |
| `is_super_admin` | Comprueba admin_emails |

Listado completo en [08-TDD.md](./08-TDD.md).

---

## 10. Reglas de derivación automática

| Dato mostrado al padre | Origen |
|------------------------|--------|
| Nombre del colegio | `children.school_id` → `schools.name` |
| Nivel educativo del niño | `children.nivel_educativo` (desde clase) |
| Curso / itinerario de misiones | `children.course_id` (desde clase) |

El padre **no introduce** centro ni curso manualmente.

---

## 11. user_roles

| Columna | Notas |
|---------|-------|
| id | PK = auth.users.id |
| role | Un único rol por usuario |

Comentario en BD: *«Un usuario tiene un único rol: parent, teacher o director.»*

Super admin no está en `user_roles`; se resuelve por `admin_emails`.
