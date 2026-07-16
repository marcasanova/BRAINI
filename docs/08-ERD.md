# ERD — BRAINI

**Versión:** 3.0  
**Esquema:** PostgreSQL `public` + `auth.users`  
**Proyecto Supabase:** BRAINI (`igwoavsazbycqmdweger`, eu-west-2)  
**Validación:** MCP `list_tables` — 19 tablas, todas con RLS

---

## 1. Diagrama entidad-relación

```mermaid
erDiagram
  AUTH_USERS ||--o| USER_ROLES : "1 rol"
  AUTH_USERS ||--o| PARENTS : "si parent"
  AUTH_USERS ||--o| TEACHERS : "si teacher"
  AUTH_USERS ||--o| DIRECTORS : "si director"
  AUTH_USERS ||--o{ EMOTIONAL_DIARY : "escribe"

  SCHOOLS ||--o{ DIRECTORS : "1:N"
  SCHOOLS ||--o{ TEACHERS : "1:N"
  SCHOOLS ||--o{ CLASSES : "1:N"
  SCHOOLS ||--o{ CHILDREN : "1:N"
  SCHOOLS ||--o{ DIRECTOR_INVITED : "1:N"
  SCHOOLS ||--o{ TEACHER_INVITED : "1:N"
  SCHOOLS ||--o{ PARENT_INVITED : "1:N"

  DIRECTORS ||--o{ TEACHER_INVITED : "invita"
  TEACHERS ||--o{ CLASSES : "1:N"
  TEACHERS ||--o{ PARENT_INVITED : "invita"

  COURSES ||--o{ CLASSES : "1:N"
  COURSES ||--o{ MISSIONS : "1:N"
  COURSES ||--o{ CHILDREN : "hereda"

  CLASSES ||--o{ CHILDREN : "1:N"

  PARENTS ||--o{ CHILDREN : "1:N multi-centro"

  CHILDREN ||--o{ CHILD_MISSIONS : "1:N"
  CHILDREN ||--o{ CHILD_ACTIVITIES : "1:N"
  CHILDREN ||--o{ CHILD_MEDALS : "1:N"
  CHILDREN ||--o{ EMOTIONAL_DIARY : "1:N"
  CHILDREN ||--o{ PARENT_INVITED : "1:N histórico"

  MISSIONS ||--o{ ACTIVITIES : "1:N"
  MISSIONS ||--o{ CHILD_MISSIONS : "1:N"
  MISSIONS ||--|| MEDALS : "1:1"

  ACTIVITIES ||--o{ CHILD_ACTIVITIES : "1:N"
  MEDALS ||--o{ CHILD_MEDALS : "1:N"

  ADMIN_EMAILS }o--|| AUTH_USERS : "super_admin por email"
```

---

## 2. Convenciones

| Convención | Detalle |
|------------|---------|
| Invitaciones | `director_invited`, `teacher_invited`, `parent_invited` (no `*_invites`) |
| Super admin | `admin_emails` — no fila en `user_roles` |
| Menor sin cuenta | `children.parent_id` nullable hasta invitación padre |
| Catálogo | `missions`, `activities`, `medals` — inmutables en producción |

---

## 3. Cardinalidades clave

| Relación | Cardinalidad |
|----------|--------------|
| schools → directors | 1:N (varios directores/centro) |
| schools → teachers | 1:N |
| teachers → classes | 1:N |
| classes → children | 1:N |
| parents → children | 1:N (multi-centro) |
| children → parent_invited | 1:N histórico; 1 `pending` vigente |
| missions → activities | 1:N |
| missions → medals | 1:1 |
| courses → missions | 1:N |

---

## 4. Tablas por dominio

| Dominio | Tablas (19) |
|---------|-------------|
| Identidad (5) | `admin_emails`, `user_roles`, `parents`, `teachers`, `directors` |
| Organización (2) | `schools`, `classes` |
| Invitaciones (3) | `director_invited`, `teacher_invited`, `parent_invited` |
| Alumnado (1) | `children` |
| Catálogo (4) | `courses`, `missions`, `activities`, `medals` |
| Progreso (3) | `child_missions`, `child_activities`, `child_medals` |
| Diario (1) | `emotional_diary` |

Más `auth.users` (esquema `auth`, gestionado por Supabase Auth).

---

## 5. Flujo de datos del pipeline

```mermaid
flowchart TB
  subgraph org [Organización]
    S[schools]
    D[directors]
    T[teachers]
    C[classes]
  end
  subgraph invite [Invitaciones]
    DI[director_invited]
    TI[teacher_invited]
    PI[parent_invited]
  end
  subgraph family [Familia]
    P[parents]
    CH[children]
  end
  subgraph prog [Progreso]
    CM[child_missions]
    CA[child_activities]
    CMD[child_medals]
  end
  S --> DI --> D
  S --> TI --> T
  T --> C --> CH
  T --> PI --> P
  P --> CH
  CH --> CM
  CH --> CA
  CH --> CMD
```

---

## 6. Triggers que mantienen integridad

| Trigger | Efecto en el modelo |
|---------|-------------------|
| `children_sync_from_class` | `children` hereda contexto de `classes` |
| `classes_propagate_to_children` | Cambios de clase propagados a alumnos |
| `validate_class_course_nivel` | Integridad `courses` ↔ `nivel_educativo` |
| `setup_child` | Materializa progreso al crear alumno |
| `complete_mission` | Cierra misión y asigna medalla |

---

## 7. Referencia cruzada

- Campos y reglas: [07-MODELO-DE-DATOS](07-MODELO-DE-DATOS.md)
- RPC y Edge: [10-BACKEND-SUPABASE](10-BACKEND-SUPABASE.md)
- Permisos: [05-ROLES-Y-PERMISOS](05-ROLES-Y-PERMISOS.md)
