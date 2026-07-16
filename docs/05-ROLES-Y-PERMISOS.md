# Roles y permisos — BRAINI

**Versión:** 3.0  
**Validación RLS:** proyecto Supabase `igwoavsazbycqmdweger` (MCP, julio 2026)

---

## 1. Principios

1. **Un usuario — un rol** en `user_roles` (`parent` | `teacher` | `director`).
2. **Super admin** vía `admin_emails` (precedencia sobre `user_roles`; RPC `is_super_admin()`).
3. **Ámbito acotado** por rol: centro, clases propias o hijos vinculados.
4. **Catálogo pedagógico** solo lectura para todos los roles de plataforma.
5. **Progreso:** padre escribe; teacher y director solo leen (RLS SELECT implementado en remoto).

---

## 2. Matriz `children`

| Operación | super_admin | director | teacher | parent |
|-----------|:-----------:|:--------:|:-------:|:------:|
| Crear (sin padre) | ✓ | ✓ (su centro) | ✓ (sus clases) | — |
| Leer | ✓ | ✓ (su centro) | ✓ (sus clases) | ✓ (sus hijos) |
| Modificar perfil | ✓ | ✓ (su centro) | ✓ si `parent_id IS NULL` | ✓ (sus hijos) |
| Eliminar | ✓ | ✓ (su centro) | ✓ (sus clases, sin padre) | ✓ (sus hijos) |

**Políticas RLS verificadas:** `children_select_teacher_by_class`, `children_select_director_by_school`, `children_update_teacher_before_parent_linked`, `children_all_super_admin`.

---

## 3. Matriz progreso y diario

| Recurso | super_admin | director | teacher | parent |
|---------|:-----------:|:--------:|:-------:|:------:|
| child_missions leer | ✓ | ✓ (centro) | ✓ (sus alumnos) | ✓ (sus hijos) |
| child_missions escribir | ✓ | — | — | ✓ |
| child_activities leer | ✓ | ✓ | ✓ | ✓ |
| child_activities escribir | ✓ | — | — | ✓ |
| child_medals leer | ✓ | ✓ | ✓ | ✓ |
| emotional_diary leer | ✓ | ✓ | ✓ | ✓ |
| emotional_diary escribir | ✓ | — | — | ✓ |

**Nota MCP:** La documentación v2.0 marcaba como pendiente el SELECT de teacher/director en tablas de progreso. En el remoto actual **ya existen** políticas `*_select_teacher` y `*_select_director` usando `teacher_owns_child()` y `director_in_child_school()`.

---

## 4. Matriz organización del centro

| Recurso | super_admin | director | teacher | parent |
|---------|:-----------:|:--------:|:-------:|:------:|
| schools CRUD | ✓ | R (su centro) | R (su centro) | R (vía hijos) |
| directors CRUD | ✓ | R/U (propio) | — | — |
| teachers CRUD | ✓ | ✓ (centro) | R/U (propio) | — |
| classes CRUD | ✓ | ✓ (centro) | ✓ (propias) | — |
| director_invited CRUD | ✓ | — | — | — |
| teacher_invited CRUD | ✓ | ✓ (centro) | — | — |
| parent_invited CRUD | ✓ | R (centro) | ✓ (sus alumnos) | — |

---

## 5. Matriz catálogo pedagógico

| Recurso | super_admin | director | teacher | parent | Desarrollo |
|---------|:-----------:|:--------:|:-------:|:------:|:----------:|
| courses | R | R | R | — | CRUD (BD) |
| missions | R | R | R | R | CRUD (BD) |
| activities | R | R | R | R | CRUD (BD) |
| medals | R | R | R | R | CRUD (BD) |

RLS: `missions` y `activities` — SELECT solo autenticados; sin políticas INSERT/UPDATE para roles de plataforma.

---

## 6. Matriz invitaciones y validación de email

| Acción | Quién | Validación |
|--------|-------|------------|
| Invitar director | super_admin | Rechazar si email ya es usuario (`email_platform_status`) |
| Invitar teacher | director | Idem |
| Invitar padre | teacher | Permitir si ya es `parent` (vincular otro hijo); rechazar `teacher`/`director` |

---

## 7. Descripción por rol

### Super admin

- Email en `admin_emails` (1–3 correos típicos).
- Panel: `/brainifamily/admin`.
- Acceso global vía políticas `*_all_super_admin` y RPC privilegiadas.

### Director

- Varios directores pueden compartir un `school_id`.
- Panel: `/brainifamily/director`.
- CRUD teachers, clases, alumnos de su centro; invita teachers.

### Teacher

- Ámbito: `classes.teacher_id = auth.uid()`.
- Panel: `/brainifamily/teacher`.
- CRUD clases y alumnos; invita padres; progreso solo lectura.
- No ve clases de otros teachers del mismo centro.

### Parent

- Ámbito: `children.parent_id = auth.uid()`.
- Panel: `/brainifamily/home` (con selector de hijo).
- Multi-hijo y multi-centro sin límite.
- Único rol que escribe progreso y diario.

---

## 8. Login y autorización

| Paso | Comportamiento |
|------|----------------|
| Login | `/brainifamily/login` — único para todos los roles |
| Post-login | `get_my_role()` → redirección |
| Sin cuenta | Error de credenciales; no se crea usuario |
| Rutas protegidas | Guards frontend + RLS backend |

| Rol | Destino post-login |
|-----|-------------------|
| `super_admin` | `/brainifamily/admin` |
| `director` | `/brainifamily/director` |
| `teacher` | `/brainifamily/teacher` |
| `parent` | Onboarding pendiente o `/brainifamily/home` |

---

## 9. Tests de inteligencia emocional

| Test | Quién | Obligatorio |
|------|-------|-------------|
| TMMS padres | Padre | No |
| Test emocional niños | Padre (contexto hijo) | No |

Rutas: `/brainifamily/inteligencia-emocional`, `/brainifamily/test-tmms-padres`, `/brainifamily/test-emocional-ninos`.

---

## 10. Helpers RLS (remoto)

| Función | Uso en políticas |
|---------|------------------|
| `is_super_admin()` | Acceso global super admin |
| `teacher_owns_child(child_id)` | SELECT progreso/diario teacher |
| `director_in_child_school(child_id)` | SELECT progreso/diario director |
| `auth_current_user_email_lower()` | Lectura propia en `admin_emails` |
