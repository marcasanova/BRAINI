# Documentación BRAINI — BrainiFamily B2B

**Versión:** 2.0 — B2B invite-only  
**Última actualización:** junio 2026  
**Estado:** Fuente de verdad para desarrollo (backend → frontend)

BRAINI es una plataforma de neurobienestar e inteligencia emocional desplegada en **centros educativos**. El acceso es **exclusivamente por invitación**; no existe autoregistro público.

---

## Índice de documentos


| Doc                                                                                          | Contenido                                         |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [00-VISION-Y-ALCANCE-B2B.md](./00-VISION-Y-ALCANCE-B2B.md)                                   | Visión, principios, fuera de alcance              |
| [01-ONBOARDING-POR-ROL.md](./01-ONBOARDING-POR-ROL.md)                                       | Flujos paso a paso por rol (admin → padre)        |
| [02-PADRES-MULTI-HIJO-E-INVITACIONES.md](./02-PADRES-MULTI-HIJO-E-INVITACIONES.md)           | Invitaciones padre, multi-hijo, multi-centro      |
| [03-TEACHER-CLASES-NINOS-INVITACION-PADRE.md](./03-TEACHER-CLASES-NINOS-INVITACION-PADRE.md) | Responsabilidades del teacher                     |
| [04-ROLES-Y-PERMISOS.md](./04-ROLES-Y-PERMISOS.md)                                           | Matriz de permisos por rol y ámbito               |
| [05-MODELO-DATOS.md](./05-MODELO-DATOS.md)                                                   | Tablas, campos, derivaciones, reglas de negocio   |
| [06-ERD.md](./06-ERD.md)                                                                     | Diagrama entidad-relación (PostgreSQL / Supabase) |
| [07-SRS.md](./07-SRS.md)                                                                     | Requisitos funcionales y no funcionales           |
| [08-TDD.md](./08-TDD.md)                                                                     | Arquitectura técnica, RPC, Edge Functions, RLS    |
| [09-CRITERIOS-ACEPTACION.md](./09-CRITERIOS-ACEPTACION.md)                                   | Casos de aceptación para validar el sistema       |


---

## Orden de lectura recomendado

1. **00** — Entender el modelo de negocio.
2. **01 + 02 + 03** — Flujos operativos.
3. **04** — Quién puede hacer qué.
4. **05 + 06** — Modelo de datos.
5. **07 + 08** — Especificación e implementación técnica.
6. **09** — Validación antes de entregar.

---

## Convenciones

- **Rol** = `super_admin` | `director` | `teacher` | `parent` (un usuario, un rol).
- **Centro** = fila en `schools`; contenedor contractual y de datos.
- **Invitación** = enlace con token; mecanismo único de alta de usuarios.
- Los catálogos pedagógicos (`missions`, `activities`, `medals`) son **solo lectura** en producción; los modifica el equipo de desarrollo.

---

## Fuera de alcance (v2.0)

- Autoregistro público (`/signup`).
- Waitlist, Test Genius, Conferencia.
- Envío automático de correos transaccionales (enlace manual hasta integrar proveedor).
- Edición de contenido pedagógico por usuarios de la plataforma.

