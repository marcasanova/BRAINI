# Teacher — clases, niños e invitación al padre

**Versión:** 2.0

---

## 1. Responsabilidad del teacher

El teacher es el **origen de datos del alumnado** en el aula. Sus responsabilidades:

1. **Crear y mantener clases** propias dentro de su centro.
2. **Crear registros de `children`** asignados a una clase.
3. **Generar invitaciones** al padre/tutor (requiere email).
4. **Visualizar** el progreso completo de sus alumnos (solo lectura).

El teacher **no consume** el programa gamificado ni realiza actividades en nombre del niño.

---

## 2. Ámbito de actuación

| Recurso | Ámbito |
|---------|--------|
| Clases | Solo las suyas (`classes.teacher_id = auth.uid()`) |
| Alumnos | Solo los de sus clases |
| Invitaciones padre | Solo para sus alumnos |
| Progreso | Solo lectura de sus alumnos |

No puede ver ni modificar clases de **otro teacher**, aunque pertenezcan al mismo centro.

---

## 3. Crear clase

### 3.1 Campos

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `name` | Sí | Nombre de la clase; único por teacher |
| `course_id` | Sí | Curso pedagógico (determina misiones) |
| `nivel_educativo` | Sí | Enum alineado con `course_id` |
| `academic_year` | No | Ej. «2025-2026» |
| `school_id` | Automático | Del registro `teachers` |
| `teacher_id` | Automático | `auth.uid()` |

### 3.2 Validación

Trigger `validate_class_course_nivel` garantiza coherencia entre `course_id` y `nivel_educativo`.

---

## 4. Crear alumno

### 4.1 Datos mínimos del teacher

| Campo | Obligatorio al crear |
|-------|---------------------|
| `nombre` | Sí |
| `apellidos` | No |
| `class_id` | Sí (clase del teacher) |
| Email del padre | **No** (se puede añadir después) |

### 4.2 Derivación automática

Al insertar en `children`, el trigger `children_sync_from_class` asigna:

- `school_id` ← `classes.school_id`
- `course_id` ← `classes.course_id`
- `nivel_educativo` ← `classes.nivel_educativo`

Estado inicial:

- `parent_id = NULL`
- `profile_completed = false`

Trigger `setup_child` crea filas en `child_missions` y `child_activities` según el `course_id`.

### 4.3 Edición por teacher

| Momento | ¿Puede editar? |
|---------|----------------|
| Antes de vincular padre (`parent_id IS NULL`) | Sí: nombre, apellidos, clase |
| Tras vincular padre | **No** (solo el padre modifica el perfil) |

Política RLS: `children_update_teacher_before_parent_linked`.

---

## 5. Invitación al padre

### 5.1 Requisitos

- El alumno debe existir en `children`.
- El **email es obligatorio** para generar el enlace (`create_parent_invite`).
- El teacher puede haber creado el alumno días antes sin email y añadirlo al invitar.

### 5.2 Proceso

1. Teacher introduce email del padre/tutor.
2. Sistema valida:
   - Formato de email.
   - Email no pertenece a usuario con rol distinto de `parent`.
   - Si ya es `parent` → invitación de vinculación (segundo hijo).
3. RPC `create_parent_invite(child_id, email)`:
   - Revoca invitaciones `pending` previas del mismo `child_id`.
   - Genera token único.
   - Caducidad: 15 días.
4. URL: `/brainifamily/invite/parent?token=...`
5. Teacher **copia y comparte** manualmente (WhatsApp, email del centro, etc.).

### 5.3 Regenerar invitación

- Nueva llamada a `create_parent_invite` revoca la `pending` anterior.
- Útil si caducó o el padre perdió el enlace.

### 5.4 Estado de invitación en dashboard

El teacher ve por alumno:

| Estado | Significado |
|--------|-------------|
| Sin invitación | Alumno creado; email no proporcionado |
| `pending` | Enlace generado; padre no ha activado |
| `completed` | Padre vinculado |
| `expired` / `revoked` | Enlace no válido; regenerar |

---

## 6. Visualización del progreso (solo lectura)

Desde la ficha del alumno, el teacher puede **consultar** (no modificar):

| Dato | Tabla / origen |
|------|----------------|
| Misiones y estado | `child_missions` |
| Actividades y valoraciones | `child_activities` |
| Medallas | `child_medals` |
| Diario emocional | `emotional_diary` |
| Perfil del niño | `children` |

> **Nota de implementación:** las políticas RLS actuales deben ampliarse para conceder **SELECT** al teacher sobre tablas de progreso. Ver [04-ROLES-Y-PERMISOS.md](./04-ROLES-Y-PERMISOS.md) y [08-TDD.md](./08-TDD.md).

---

## 7. Lo que el teacher NO hace

- No completa onboarding del padre ni del niño (campos de género, fecha nacimiento, etc.).
- No introduce `centro_escolar` manualmente (derivado de `school_id`).
- No modifica misiones, actividades ni medallas del catálogo.
- No invita padres de clases de otros teachers.
- No realiza actividades en la app en nombre del menor.

---

## 8. Responsabilidad del padre (tras el enlace)

1. Activar cuenta (contraseña) o iniciar sesión (si ya existe).
2. Completar onboarding padre (primera vez).
3. Completar onboarding hijo: validar nombre/apellidos; obligatorio género y fecha nacimiento.
4. Consumir el programa (actividades, diario, tests) vía su cuenta.

Ver [01-ONBOARDING-POR-ROL.md](./01-ONBOARDING-POR-ROL.md).
