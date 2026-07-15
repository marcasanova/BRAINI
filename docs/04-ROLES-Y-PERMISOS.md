# Roles y permisos — BRAINI

**Versión:** 2.0

---

## 1. Principios

1. **Un usuario — un rol** (`user_roles`: `parent` | `teacher` | `director`).
2. **Super admin** se resuelve por email en `admin_emails` (precedencia sobre `user_roles`).
3. Cada rol opera en un **ámbito** acotado (plataforma, centro, clases propias, hijos propios).
4. El **catálogo pedagógico** (`missions`, `activities`, `medals`) es **solo lectura** para todos los roles; lo gestiona desarrollo.
5. Las **modificaciones de progreso** (puntuaciones, opiniones, entradas de diario) las hace el **padre**; el teacher y el director solo **leen**.

---

## 2. Matriz de permisos — datos del menor (`children`)

| Operación | super_admin | director | teacher | parent |
|-----------|:-----------:|:--------:|:-------:|:------:|
| Crear (sin padre) | ✓ | ✓ (su centro) | ✓ (sus clases) | — |
| Leer | ✓ | ✓ (su centro) | ✓ (sus clases) | ✓ (sus hijos) |
| Modificar perfil | ✓ | ✓ (su centro) | ✓ solo si `parent_id IS NULL` | ✓ (sus hijos) |
| Eliminar | ✓ | ✓ (su centro) | ✓ (sus clases, según reglas) | ✓ (sus hijos) |

---

## 3. Matriz — progreso y diario

| Recurso | super_admin | director | teacher | parent |
|---------|:-----------:|:--------:|:-------:|:------:|
| `child_missions` — leer | ✓ | ✓ (su centro) | ✓ (sus alumnos) | ✓ (sus hijos) |
| `child_missions` — escribir | ✓ | — | — | ✓ (sus hijos) |
| `child_activities` — leer | ✓ | ✓ (su centro) | ✓ (sus alumnos) | ✓ (sus hijos) |
| `child_activities` — escribir | ✓ | — | — | ✓ (sus hijos) |
| `child_medals` — leer | ✓ | ✓ (su centro) | ✓ (sus alumnos) | ✓ (sus hijos) |
| `emotional_diary` — leer | ✓ | ✓ (su centro) | ✓ (sus alumnos) | ✓ (sus hijos) |
| `emotional_diary` — escribir | ✓ | — | — | ✓ (sus hijos) |

> **Pendiente backend:** ampliar RLS para SELECT de teacher y director sobre tablas de progreso. Hoy solo el padre tiene acceso completo.

---

## 4. Matriz — organización del centro

| Recurso | super_admin | director | teacher | parent |
|---------|:-----------:|:--------:|:-------:|:------:|
| `schools` — CRUD | ✓ | R (su centro) | R (su centro) | — |
| `directors` — CRUD | ✓ | R/U (propio) | — | — |
| `teachers` — CRUD | ✓ | ✓ (su centro) | R/U (propio) | — |
| `classes` — CRUD | ✓ | ✓ (su centro) | ✓ (propias) | — |
| `director_invited` — CRUD | ✓ | — | — | — |
| `teacher_invited` — CRUD | ✓ | ✓ (su centro) | — | — |
| `parent_invited` — CRUD | ✓ | R (su centro) | ✓ (sus alumnos) | — |

---

## 5. Matriz — catálogo pedagógico (solo desarrollo)

| Recurso | super_admin | director | teacher | parent | Desarrollo |
|---------|:-----------:|:--------:|:-------:|:------:|:----------:|
| `courses` | R | R | R | — | CRUD |
| `missions` | R | R | R | R | CRUD |
| `activities` | R | R | R | R | CRUD |
| `medals` | R | R | R | R | CRUD |

Ningún rol de plataforma puede INSERT/UPDATE/DELETE en estas tablas en producción.

---

## 6. Matriz — invitaciones y validación de email

| Acción | Quién | Validación email existente |
|--------|-------|---------------------------|
| Invitar director | super_admin | Obligatoria; rechazar si email ya es usuario |
| Invitar teacher | director | Obligatoria; rechazar si email ya es usuario |
| Invitar padre | teacher | Obligatoria; permitir si ya es `parent`; rechazar si es otro rol |

**Regla:** al introducir un email para generar enlace, el sistema consulta Auth y tablas de perfiles para detectar si ya existe un usuario, **independientemente del rol o momento del flujo**.

---

## 7. Descripción por rol

### 7.1 Super admin

- **Ámbito:** plataforma completa.
- **Puede:** crear/ver/modificar/eliminar centros, directores, teachers, clases, alumnos, invitaciones, progreso.
- **Acceso:** email en `admin_emails`.
- **Panel:** `/brainifamily/admin`.

### 7.2 Director

- **Ámbito:** su `school_id` (puede haber varios directores por centro).
- **Puede:** CRUD completo dentro de su colegio: teachers, clases, alumnos, invitaciones teacher, visualización de progreso.
- **No puede:** actuar sobre otros centros ni clases de teachers ajenos fuera de su ámbito de lectura/gestión del centro.
- **Panel:** `/brainifamily/director`.

### 7.3 Teacher

- **Ámbito:** sus clases (`teacher_id`).
- **Puede:** CRUD de sus clases y alumnos; invitar padres; ver progreso de sus alumnos (solo lectura).
- **No puede:** ver/modificar clases de otro teacher del mismo centro.
- **Panel:** `/brainifamily/teacher`.

### 7.4 Parent

- **Ámbito:** hijos con `parent_id = auth.uid()`.
- **Puede:** modificar perfil propio y de sus hijos; realizar actividades; diario; tests.
- **Multi-centro:** todos los hijos vinculados a su cuenta, sin límite.
- **Panel:** `/brainifamily/home` y rutas protegidas de familia.

---

## 8. Login y autorización

- **Un único login** (`/brainifamily/login`) para todos los roles.
- Post-login: `get_my_role()` determina redirección.
- Sin cuenta previa (nunca activó invitación): **error de credenciales**; no hay registro alternativo.
- Rutas protegidas validan rol + pertenencia al ámbito (RLS + guards en frontend).

---

## 9. Tests de inteligencia emocional

| Test | Quién | Obligatorio |
|------|-------|-------------|
| TMMS padres | Padre | No (disponible en app) |
| Test emocional niños | Padre (en contexto del hijo) | No |

Rutas: `/brainifamily/inteligencia-emocional`, `/brainifamily/test-tmms-padres`, `/brainifamily/test-emocional-ninos`.

---

## 10. Referencia RLS objetivo

Las políticas deben implementarse según esta matriz. Estado actual y gaps en [08-TDD.md](./08-TDD.md) §5.
