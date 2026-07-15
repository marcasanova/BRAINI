# Padres — multi-hijo, multi-centro e invitaciones

**Versión:** 2.0

---

## 1. Modelo mental

- Cada **niño** tiene su propia **invitación** (token/enlace).
- El **mismo email** puede recibir **varias** invitaciones (una por hijo).
- La **contraseña pertenece a la cuenta del padre**, no al niño.
- Un padre puede tener hijos en **centros distintos** con la **misma cuenta**.
- **No hay límite** de hijos por cuenta.

---

## 2. Primera invitación vs siguientes

| Situación | Comportamiento |
|-----------|----------------|
| Padre **sin** cuenta | Enlace → contraseña nueva + onboarding padre + onboarding hijo |
| Padre **con** cuenta (mismo email) | Enlace → login (sin nueva contraseña) → vincular hijo → onboarding hijo si aplica |

---

## 3. Reglas de negocio

### 3.1 Una invitación por operación

- Cada fila en `parent_invited` referencia **un** `child_id` y **un** `email`.
- Al generar nueva invitación para el mismo niño, las `pending` anteriores pasan a `revoked`.
- Solo una invitación `pending` vigente por `child_id`.

### 3.2 Caducidad

- **15 días** desde la creación (`expires_at`).
- Invitación caducada → mensaje al padre; teacher debe regenerar enlace.

### 3.3 Completar invitación

**Cuenta nueva:**

1. Edge `complete-parent-invite` → `auth.admin.createUser`.
2. RPC `complete_parent_invite`:
   - Inserta/actualiza `user_roles` (`parent`).
   - Inserta/actualiza `parents`.
   - Asigna `children.parent_id`.
   - Marca invitación `completed`.

**Cuenta existente:**

1. Padre inicia sesión (o ya tiene sesión activa con el mismo email).
2. Edge Function valida que el email de sesión = email de invitación.
3. RPC `complete_parent_invite` sin `createUser`.
4. Vincula nuevo `child_id`.

### 3.4 Email obligatorio para el enlace

- El teacher puede crear `children` **sin** email del padre.
- Para llamar a `create_parent_invite` el email es **obligatorio**.
- Sin email no hay token ni enlace.

---

## 4. Multi-hijo

### 4.1 Selector de hijo

- Contexto `CurrentChildProvider` mantiene el hijo activo.
- Si hay más de un hijo, el padre elige cuál gestionar.
- Cada hijo tiene progreso (`child_missions`, `child_activities`, `child_medals`) independiente.

### 4.2 Onboarding por hijo

- Cada hijo tiene su propio `profile_completed`.
- Tras vincular un segundo hijo, solo se muestra onboarding del **nuevo** hijo si está incompleto.
- El onboarding padre **no se repite**.

---

## 5. Multi-centro

### 5.1 Mismo padre, distintos colegios

Un padre puede tener:

- Hijo A en Colegio X (teacher T1).
- Hijo B en Colegio Y (teacher T2).

Ambos vinculados a la misma cuenta `parents.id`.

### 5.2 Visualización

- El selector de hijo muestra el **nombre del centro** (`schools.name` vía `children.school_id`).
- El progreso, diario y tests son **por hijo**, no mezclados.
- Las políticas RLS del padre aplican a todos sus hijos independientemente del centro.

### 5.3 Restricción de rol

- Si el email del padre ya es `teacher` o `director`, **no puede** recibir invitación como padre con ese mismo email (un usuario — un rol).

---

## 6. Casos borde

| Caso | Tratamiento |
|------|-------------|
| Padre inicia sesión con email distinto al de la invitación | Rechazar: «Este enlace es para el correo X» |
| Invitación caducada | Mensaje estándar; teacher regenera |
| Padre ya vinculado al mismo hijo | Idempotencia: completar sin error o mensaje «Ya estabas vinculado» |
| Hijo ya vinculado a otro padre | Error `child_already_linked_other_parent` |
| Email de invitación pertenece a teacher/director | No generar invitación padre; mensaje al teacher |

---

## 7. Flujo UX segunda invitación

1. Usuario abre enlace con `token`.
2. Preview carga datos del niño y del centro.
3. Sistema detecta cuenta existente (`parents.email` o Auth).
4. Pantalla: «Ya tienes cuenta. **Inicia sesión** para vincular a **[Nombre hijo]**».
5. Formulario: email (solo lectura) + contraseña para login.
6. Tras `signInWithPassword` correcto (o sesión activa): completar invitación.
7. Saltar onboarding padre → onboarding hijo si procede → home.

---

## 8. Resumen en una frase

**La contraseña es de la cuenta del padre; los enlaces adicionales solo atan nuevos hijos tras autenticación, sin límite de hijos ni de centros.**
