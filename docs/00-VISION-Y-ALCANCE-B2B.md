# Visión y alcance B2B — BRAINI BrainiFamily

**Versión:** 2.0  
**Modelo:** B2B invite-only

---

## 1. Qué es BRAINI

BRAINI es una plataforma de **neurobienestar e inteligencia emocional** para familias con niños de aproximadamente 3 a 12 años, desplegada a través de **centros educativos** (Educación Infantil y Primaria).

El núcleo operativo es **BrainiFamily** (`/brainifamily/*`):

- Programa secuencial de **misiones (sesiones)** y **actividades**.
- **Diario emocional**.
- **Tests de inteligencia emocional** (TMMS padres, test emocional niños).
- Paneles de **super admin**, **director** y **teacher** para gestión del centro.
- Experiencia de **padre/tutor** para consumo del programa y seguimiento del progreso del menor.

Las landings **Braini Kids** y **Braini Juniors** son líneas informativas sin lógica transaccional.

---

## 2. Principios de producto

### 2.1 Acceso solo por invitación

- **No hay autoregistro público.** Nadie se da de alta de forma autónoma ni gratuita.
- Todo usuario entra al sistema mediante un **enlace de invitación** generado por quien ya tiene acceso.
- Tras la primera activación (contraseña + onboarding), el acceso posterior es por **login** (`/brainifamily/login`).

### 2.2 Dos pasos de acceso para el padre

1. **Primera vez:** enlace del teacher → configurar contraseña → onboarding → app.
2. **Visitas posteriores:** login con email y contraseña.

### 2.3 Un centro, una jerarquía

Un **centro** (`schools`) es el contenedor: directores, teachers, clases y alumnado pertenecen a ese contexto.

**Jerarquía operativa:**

```
super_admin → crea centros e invita directores
director    → gestiona su centro; invita teachers
teacher     → gestiona sus clases y niños; invita padres
parent      → consume el programa y gestiona el perfil del menor
```

### 2.4 Un usuario — un rol

- Cada `auth.users` tiene **un único rol** (`parent`, `teacher` o `director`).
- El rol se almacena en `user_roles`.
- Un mismo email **no puede** acumular roles distintos.
- Al generar cualquier invitación, el sistema **debe detectar** si el email ya existe como usuario en la plataforma.

### 2.5 Separación padre / teacher en el menor

| Responsabilidad | Padre | Teacher |
|-----------------|-------|---------|
| Modificar perfil del niño | Sí | No (solo antes de vincular padre: datos estructurales mínimos) |
| Realizar actividades / usar la app | Sí (vía cuenta padre) | No |
| Ver progreso, diario, medallas | Sí (sus hijos) | Sí (solo lectura; niños de sus clases) |
| Generar invitación al padre | No | Sí |

El menor **no tiene cuenta propia**; el progreso gamificado se consume a través de la cuenta del padre/tutor.

### 2.6 Contenido pedagógico inmutable en producción

Las tablas `missions`, `activities` y `medals` son **catálogo gestionado por desarrollo**. Ningún rol de la plataforma (admin, director, teacher, padre) puede crear, editar ni eliminar misiones o actividades.

### 2.7 Multi-centro y multi-hijo

- Un padre puede tener **varios hijos** en la misma cuenta, **sin límite**.
- Los hijos pueden pertenecer a **centros distintos**.
- El selector de hijo muestra a qué colegio pertenece cada uno; cada hijo tiene su **progreso independiente**.

---

## 3. Roles (resumen)

| Rol | Ámbito | Capacidades resumidas |
|-----|--------|----------------------|
| `super_admin` | Plataforma global | CRUD completo sobre centros, usuarios, invitaciones y datos |
| `director` | Su centro (`school_id`) | CRUD completo dentro del ecosistema de su colegio |
| `teacher` | Sus clases (`teacher_id`) | CRUD de sus clases y alumnos; invitar padres; ver progreso de sus alumnos (solo lectura) |
| `parent` | Sus hijos vinculados | Modificar perfiles; consumir programa; diario y tests |

Detalle en [04-ROLES-Y-PERMISOS.md](./04-ROLES-Y-PERMISOS.md).

---

## 4. Fuera de alcance (v2.0)

| Elemento | Estado |
|----------|--------|
| Registro público `/brainifamily/signup` | Eliminado del producto |
| Waitlist | Eliminado |
| Test Genius (`/test-genius`) | Eliminado |
| Conferencia (`/conferencia`) | Eliminado |
| Envío automático de emails de invitación | Fase futura; enlace manual |
| Apps nativas móviles | No contempladas |
| Facturación / CRM / LMS externos | No integrados |
| Edición de misiones/actividades por usuarios | No permitido |

---

## 5. Cumplimiento y datos personales

El hecho de que el **centro/teacher** introduzca datos de menores implica responsabilidad en **protección de datos** (RGPD / LOPDGDD). Debe reflejarse en:

- Acuerdos con el centro educativo.
- Aviso de privacidad (enlace desde flujos de invitación).
- Consentimiento del padre al activar su cuenta vía enlace.

---

## 6. Criterios de éxito (producto)

- Un centro completo el ciclo: admin crea colegio → director → teacher → padre → actividad completada con persistencia.
- Un padre con dos hijos (mismo o distinto centro) gestiona ambos desde una cuenta.
- Un teacher visualiza el progreso de todos sus alumnos sin poder modificarlo.
- Un login sin cuenta previa devuelve error claro.
- Ningún usuario puede autoregistrarse fuera del flujo de invitación.

Casos detallados en [09-CRITERIOS-ACEPTACION.md](./09-CRITERIOS-ACEPTACION.md).

---

## 7. Documentación relacionada

- Flujos: [01-ONBOARDING-POR-ROL.md](./01-ONBOARDING-POR-ROL.md)
- Permisos: [04-ROLES-Y-PERMISOS.md](./04-ROLES-Y-PERMISOS.md)
- Datos: [05-MODELO-DATOS.md](./05-MODELO-DATOS.md) · [06-ERD.md](./06-ERD.md)
- Requisitos: [07-SRS.md](./07-SRS.md) · [08-TDD.md](./08-TDD.md)
