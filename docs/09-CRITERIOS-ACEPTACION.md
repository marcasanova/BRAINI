# Criterios de aceptación — BRAINI v2.0

**Versión:** 2.0

Casos de prueba de negocio para validar el sistema tras cada fase de implementación.

---

## 1. Acceso y autenticación

### CA-AUTH-01 — Sin autoregistro

**Dado** un visitante sin cuenta  
**Cuando** intenta acceder a `/brainifamily/signup` o registrarse  
**Entonces** no existe ruta de registro público; solo login o invitación.

### CA-AUTH-02 — Login sin cuenta

**Dado** un email que nunca activó una invitación  
**Cuando** intenta login con cualquier contraseña  
**Entonces** recibe error de credenciales; no se crea cuenta.

### CA-AUTH-03 — Login multi-rol

**Dado** usuarios activos de cada rol  
**Cuando** hacen login  
**Entonces** cada uno es redirigido a su panel (`/admin`, `/director`, `/teacher`, `/home`).

### CA-AUTH-04 — Recuperación de contraseña

**Dado** un padre con cuenta activa  
**Cuando** solicita recuperar contraseña  
**Entonces** recibe email y puede establecer nueva contraseña.

---

## 2. Pipeline completo del centro

### CA-PIPE-01 — Ciclo feliz end-to-end

**Dado** un super admin  
**Cuando** crea centro → invita director → director invita teacher → teacher crea clase y alumno → invita padre → padre completa onboarding → valora una actividad  
**Entonces** todo persiste en BD y el teacher ve el progreso actualizado (solo lectura).

### CA-PIPE-02 — Progreso inicializado al crear alumno

**Dado** un teacher que crea un alumno en una clase con `course_id` válido  
**Cuando** se inserta en `children`  
**Entonces** existen filas en `child_missions` y `child_activities` para ese `child_id`.

---

## 3. Invitaciones

### CA-INV-01 — Primera invitación padre

**Dado** un alumno sin padre vinculado  
**Cuando** el teacher genera invitación con email nuevo  
**Entonces** se crea `parent_invited` con `status=pending`, token y caducidad 15 días.

### CA-INV-02 — Sin email no hay enlace

**Dado** un alumno creado sin email  
**Cuando** el teacher intenta generar enlace sin proporcionar email  
**Entonces** el sistema rechaza la operación.

### CA-INV-03 — Email con rol incompatible

**Dado** un email que ya es `teacher` en la plataforma  
**Cuando** otro teacher intenta invitar ese email como padre  
**Entonces** se rechaza con mensaje claro.

### CA-INV-04 — Segunda invitación mismo padre

**Dado** un padre ya registrado con hijo A  
**Cuando** recibe invitación para hijo B (mismo email)  
**Entonces** inicia sesión (sin nueva contraseña), se vincula hijo B, salta onboarding padre, completa onboarding hijo B si aplica.

### CA-INV-05 — Regenerar invitación

**Dado** una invitación `pending` para un niño  
**Cuando** el teacher genera nueva invitación para el mismo niño  
**Entonces** la anterior pasa a `revoked` y la nueva es `pending`.

### CA-INV-06 — Invitación caducada

**Dado** una invitación con `expires_at` en el pasado  
**Cuando** el padre abre el enlace  
**Entonces** ve mensaje de caducidad; no puede activar.

### CA-INV-07 — Email mismatch en sesión

**Dado** un padre logueado con email A  
**Cuando** abre invitación para email B  
**Entonces** se rechaza la vinculación.

---

## 4. Onboarding

### CA-ONB-01 — Onboarding padre primera vez

**Campos obligatorios:** nombre, relacion_con_menor, email (solo lectura).  
**Opcionales:** apellidos, telefono_contacto.

### CA-ONB-02 — Onboarding hijo

**Obligatorios:** genero, fecha_nacimiento.  
**Validar:** nombre, apellidos (introducidos por teacher).  
**Solo lectura:** nivel_educativo (heredado de clase).

### CA-ONB-03 — Centro derivado

**Dado** un padre en onboarding hijo  
**Cuando** ve el nivel educativo o centro  
**Entonces** son valores heredados de la clase; no puede editarlos.

---

## 5. Multi-hijo y multi-centro

### CA-MULTI-01 — Dos hijos mismo centro

**Dado** un padre con hijo A  
**Cuando** se vincula hijo B del mismo centro  
**Entonces** un login, selector con ambos hijos, progreso independiente.

### CA-MULTI-02 — Hijos en centros distintos

**Dado** un padre con hijo en Colegio X  
**Cuando** se vincula hijo en Colegio Y  
**Entonces** misma cuenta; selector muestra colegio de cada hijo; progresos separados.

### CA-MULTI-03 — Sin límite de hijos

**Dado** un padre con N hijos vinculados  
**Cuando** se vincula el hijo N+1  
**Entonces** operación exitosa sin tope artificial.

---

## 6. Permisos por rol

### CA-PERM-01 — Teacher solo sus clases

**Dado** dos teachers del mismo centro  
**Cuando** T1 consulta alumnos  
**Entonces** solo ve alumnos de sus clases, no los de T2.

### CA-PERM-02 — Teacher edita alumno antes de padre

**Dado** un alumno con `parent_id IS NULL`  
**Cuando** el teacher modifica nombre  
**Entonces** operación permitida.

### CA-PERM-03 — Teacher no edita tras vincular padre

**Dado** un alumno con `parent_id` asignado  
**Cuando** el teacher intenta modificar perfil  
**Entonces** operación denegada.

### CA-PERM-04 — Padre modifica su hijo

**Dado** un padre vinculado  
**Cuando** actualiza género o fecha nacimiento  
**Entonces** operación permitida.

### CA-PERM-05 — Teacher ve progreso (solo lectura)

**Dado** un alumno con actividades valoradas  
**Cuando** el teacher abre ficha de progreso  
**Entonces** ve misiones, actividades, medallas y diario; no puede modificar puntuaciones.

### CA-PERM-06 — Director CRUD su centro

**Dado** un director del Colegio X  
**Cuando** gestiona teachers, clases o alumnos de X  
**Entonces** operaciones permitidas.

### CA-PERM-07 — Director no accede otro centro

**Dado** un director del Colegio X  
**Cuando** intenta ver datos del Colegio Y  
**Entonces** acceso denegado.

### CA-PERM-08 — Super admin global

**Dado** un super admin  
**Cuando** consulta cualquier centro, usuario o progreso  
**Entonces** acceso permitido.

### CA-PERM-09 — Un rol por email

**Dado** un email registrado como teacher  
**Cuando** se intenta crear cuenta director o padre con el mismo email  
**Entonces** se rechaza.

### CA-PERM-10 — Catálogo pedagógico inmutable

**Dado** cualquier rol de plataforma  
**Cuando** intenta INSERT/UPDATE/DELETE en `missions` o `activities`  
**Entonces** operación denegada.

---

## 7. Programa y diario

### CA-PROG-01 — Valorar actividad

**Dado** un padre con hijo activo y actividad `current`  
**Cuando** valora con puntuación 1–5  
**Entonces** se guarda en `child_activities` y puede avanzar progreso de misión.

### CA-DIARY-01 — Diario padre

**Dado** un padre autenticado  
**Cuando** crea entrada de diario para su hijo  
**Entonces** persiste en `emotional_diary`.

### CA-DIARY-02 — Diario visible para teacher

**Dado** un padre que escribió en el diario  
**Cuando** el teacher del alumno consulta la ficha  
**Entonces** ve las entradas (solo lectura).

---

## 8. Tests inteligencia emocional

### CA-TEST-01 — TMMS padres

**Dado** un padre autenticado  
**Cuando** accede a `/brainifamily/test-tmms-padres`  
**Entonces** puede completar el test (no obligatorio en onboarding).

### CA-TEST-02 — Test emocional niños

**Dado** un padre con hijo seleccionado  
**Cuando** accede al test emocional niños  
**Entonces** puede completarlo en contexto del hijo.

---

## 9. Eliminados

### CA-OUT-01

Las rutas `/test-genius`, `/conferencia`, waitlist y signup público **no existen** ni son accesibles.

---

## 10. Checklist de fase

| Fase | Criterios mínimos |
|------|-------------------|
| Backend | CA-INV-*, CA-PERM-05, CA-PIPE-02, CA-PERM-09 |
| Frontend | CA-AUTH-*, CA-ONB-*, CA-MULTI-*, CA-OUT-01 |
| Integración | CA-PIPE-01 (end-to-end completo) |
