# BRAINI — Braini Emotions

Plataforma de **neurobienestar e inteligencia emocional** para centros educativos y familias con niños de aproximadamente 3 a 7 años. TFM — documentación de entrada al repositorio.

---

## 1. Descripción general

BRAINI es un **hub multi-producto** con tres líneas de cara al público y una aplicación B2B operativa:


| Producto            | Ruta              | Estado                       |
| ------------------- | ----------------- | ---------------------------- |
| Hub Braini Emotions | `/`               | Landing principal            |
| Braini Kids         | `/brainikids`     | En desarrollo (placeholder)  |
| Braini Juniors      | `/brainijuniors`  | En desarrollo (placeholder)  |
| **BrainiFamily**    | `/brainifamily/`* | App B2B — núcleo del sistema |


**BrainiFamily** despliega un programa secuencial de misiones y actividades gamificadas, diario emocional, tests de inteligencia emocional y paneles de gestión para centros. El modelo es **B2B invite-only**: no hay registro público; cada usuario entra mediante un enlace de invitación con token.

**Jerarquía operativa:**

```
super_admin → crea centros e invita directores
director    → gestiona su centro; invita teachers
teacher     → gestiona clases y alumnos; invita padres
parent      → consume el programa y gestiona el perfil del menor
```

El menor no tiene cuenta propia; el progreso se consume a través de la cuenta del padre/tutor.

**Más detalle:** [docs/01-PROBLEMA-Y-CONTEXTO.md](docs/01-PROBLEMA-Y-CONTEXTO.md) · [docs/04-VISION-Y-ALCANCE-B2B.md](docs/04-VISION-Y-ALCANCE-B2B.md)

---



## 2. Stack tecnológico


| Capa                | Tecnología                                              | Versión                            |
| ------------------- | ------------------------------------------------------- | ---------------------------------- |
| UI                  | React                                                   | 19.3.0                             |
| Lenguaje            | TypeScript                                              | 5.9.3                              |
| Bundler             | Vite                                                    | 8.3.0                              |
| Estilos             | Tailwind CSS                                            | 4.3.3                              |
| Routing             | React Router                                            | 7.18.4                             |
| Datos cliente       | TanStack React Query                                    | 5.103.2                            |
| Componentes         | Radix UI + patrón shadcn/ui                             | —                                  |
| Backend (BaaS)      | Supabase (Auth, PostgreSQL 17, Storage, Edge Functions) | —                                  |
| Cliente Supabase    | @supabase/supabase-js                                   | 2.117.1                            |
| Tests unitarios     | Vitest + React Testing Library + MSW                    | 4.1.11                             |
| Tests E2E           | Playwright                                              | 1.63.0                             |
| Despliegue frontend | Vercel (SPA estática)                                   | —                                  |
| Runtime             | Node.js                                                 | 20.19+ / 22.12+ (recomendado 22.x) |


Arquitectura: **SPA** servida como sitio estático; autorización con RLS y RPC en PostgreSQL (Supabase).

**Más detalle:** [docs/03-ARQUITECTURA-Y-STACK.md](docs/03-ARQUITECTURA-Y-STACK.md)

---



## 3. Instalación y ejecución



### Requisitos previos

- **Node.js** 20.19+ o 22.12+ (recomendado: 22.x)
- **npm** 9+
- Proyecto Supabase con variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`



### Instalación

```sh
git clone https://github.com/marcasanova/BRAINI.git
cd BRAINI
npm install
```

Crea un archivo `.env` en la raíz (puedes partir de [`.env.example`](.env.example)):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon
```

`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` son claves de **cliente** (van al navegador). La protección de datos la dan Auth, RLS y las Edge Functions. La clave `service_role` **no** pertenece a este repositorio.



### Ejecución en local

```sh
npm run dev
```

La aplicación queda disponible en **[http://localhost:8080/](http://localhost:8080/)**.

### Scripts principales


| Script                   | Descripción                          |
| ------------------------ | ------------------------------------ |
| `npm run dev`            | Servidor de desarrollo (puerto 8080) |
| `npm run build`          | Build de producción (`dist/`)        |
| `npm run preview`        | Preview del build                    |
| `npm run lint`           | ESLint                               |
| `npm run test`           | Vitest en modo watch                 |
| `npm run test:run`       | Vitest una pasada                    |
| `npm run test:e2e:smoke` | Playwright smoke (rutas públicas)    |
| `npm run verify`         | `lint` + `test:run` + `build`        |


**Más detalle (testing y calidad):** [docs/11-TESTING-Y-CALIDAD.md](docs/11-TESTING-Y-CALIDAD.md)

---



## 4. Estructura del proyecto

```
BRAINI/
├── README.md                 # Este archivo (entrada TFM)
├── docs/                     # Documentación técnica 00–13
│   └── presentacion/         # Slides TFM (PDF)
├── public/                   # Assets estáticos (logos, etc.)
├── src/
│   ├── app/                  # Bootstrap, router, providers
│   ├── products/             # hub, brainikids, brainijuniors, brainifamily
│   ├── shared/               # UI, navegación, guards, utilidades
│   ├── integrations/         # Cliente Supabase, queries, RPC, Edge helpers
│   └── styles/               # CSS global (Tailwind 4)
├── supabase/
│   └── functions/            # Edge Functions (complete-*-invite)
├── tests/
│   ├── setup/                # Vitest, MSW
│   ├── fixtures/
│   └── e2e/                  # Playwright smoke
├── package.json
└── vercel.json
```

**Más detalle:** [docs/03-ARQUITECTURA-Y-STACK.md](docs/03-ARQUITECTURA-Y-STACK.md) · [docs/09-DISENO-TECNICO-FRONTEND.md](docs/09-DISENO-TECNICO-FRONTEND.md)

El esquema SQL vive en Supabase (dashboard + MCP), no en este repo. Las Edge Functions sí están en `supabase/functions/` y hay que redesplegarlas en el dashboard cuando cambie el fuente.

---



## 5. Funcionalidades principales



### Landings y acceso

- **Hub** (`/`): presentación de Braini Emotions y líneas de producto.
- **Braini Kids / Juniors**: placeholders «En desarrollo» con enlace al hub.
- **BrainiFamily** (`/brainifamily`): landing con acceso a login.
- **Login único** (`/brainifamily/login`) para todos los roles autenticados.



### Por rol (BrainiFamily)


| Rol             | Panel                    | Funcionalidades principales                                               |
| --------------- | ------------------------ | ------------------------------------------------------------------------- |
| **Super admin** | `/brainifamily/admin`    | Crear centros; invitar directores; visión global                          |
| **Director**    | `/brainifamily/director` | Gestionar teachers, clases y alumnos de su centro; invitar teachers       |
| **Teacher**     | `/brainifamily/teacher`  | CRUD de sus clases y alumnos; invitar padres; ver progreso (solo lectura) |
| **Padre/tutor** | `/brainifamily/home`     | Programa (misiones/actividades), diario emocional, tests IE, multi-hijo   |




### Programa pedagógico (padre)

- Misiones secuenciales con actividades valorables (1–5).
- Diario emocional por hijo.
- Tests de inteligencia emocional (TMMS padres, test emocional niños).
- Selector de hijo con soporte multi-centro.



### Invitaciones (onboarding)

- Alta **solo por invitación** (director, teacher, padre); token con caducidad de 15 días.
- Flujo completo: admin → director → teacher → padre → uso del programa.

**Más detalle:** [docs/02-REQUISITOS.md](docs/02-REQUISITOS.md) · [docs/05-ROLES-Y-PERMISOS.md](docs/05-ROLES-Y-PERMISOS.md) · [docs/06-FLUJOS-ONBOARDING-E-INVITACIONES.md](docs/06-FLUJOS-ONBOARDING-E-INVITACIONES.md)

---



## 6. Cuentas de evaluación (Colegio TFM)

El alta es **invite-only**. Para la corrección del TFM hay un centro demo (**Colegio TFM**) y cinco cuentas. Login:

**https://www.brainiemotions.com/brainifamily/login**

La **contraseña** se facilita en el formulario de entrega del máster; no se publica en este repositorio. Cierra sesión entre una cuenta y la siguiente.


| Email | Rol | Tras el login |
| ----- | --- | ------------- |
| `tfm.parent@brainiemotions.com` | parent | `/brainifamily/home` |
| `tfm.teacher@brainiemotions.com` | teacher | `/brainifamily/teacher` |
| `tfm.teacher2@brainiemotions.com` | teacher | `/brainifamily/teacher` |
| `tfm.director@brainiemotions.com` | director | `/brainifamily/director` |
| `tfm.admin@brainiemotions.com` | super_admin | `/brainifamily/admin` |


### Recorrido sugerido para la evaluación

Orden recomendado en [https://www.brainiemotions.com/](https://www.brainiemotions.com/):

1. **Landings:** `/` (hub), `/brainikids` y `/brainijuniors` (placeholders «en desarrollo»), `/brainifamily` (acceso a login).
2. **Padre** (`tfm.parent@…`): selector con **Alba**, **Bruno**, **Diego** y **Elena**. **Carla** y **Fabio** no aparecen: siguen sin familia vinculada.
3. **Teacher 1** (`tfm.teacher@…`): clase **Infantil TFM 4 años** (Alba, Bruno y Carla sin familia) y **Infantil TFM 5 años** (Diego).
4. **Teacher 2** (`tfm.teacher2@…`): solo **Infantil TFM B** (Elena y Fabio sin familia). No ve las clases del teacher 1.
5. **Director** (`tfm.director@…`): los dos teachers, las tres clases y los seis alumnos del Colegio TFM.
6. **Admin** (`tfm.admin@…`): el Colegio TFM en el panel global.

El seed deja el programa pedagógico en su estado inicial (misión actual, resto bloqueado). No hay valoraciones ni diario rellenados a propósito.

---



## Presentación y materiales de entrega (TFM)

- **Slides (Canva, acceso público):** https://canva.link/hnjd5s1evfs60h0
- **Slides (archivo en el repo):** [docs/presentacion/TFM_Presentacion_BrainiFamily.pdf](docs/presentacion/TFM_Presentacion_BrainiFamily.pdf)
- **Despliegue:** https://www.brainiemotions.com/
- **Vídeo de explicación:** _pendiente — se añadirá la URL pública cuando esté publicado_

---



## 7. Licencia y propiedad intelectual

El código se publica en modo *source-available* para evaluación académica del TFM. **Todos los derechos reservados** (Genius Minds School / Braini Emotions): sin permiso de uso comercial, redistribución ni obras derivadas sin autorización escrita.

- [LICENSE](LICENSE)
- [NOTICE](NOTICE)
- [SECURITY.md](SECURITY.md) — reporte de vulnerabilidades

---



## 8. Privacidad

La [Política de Privacidad y Protección de Datos](https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/documentos/POLITICA%20DE%20PRIVACIDAD%20Y%20PROTECCION%20DE%20DATOS.pdf) (PDF) está alojada en Supabase Storage y enlazada desde la aplicación (landings, login y aceptación obligatoria en los flujos de invitación).

Contacto: info@brainiemotions.com

---



## Documentación técnica completa

La carpeta `[docs/](docs/)` contiene la documentación detallada (problema → requisitos → arquitectura → dominio → estado actual). Punto de entrada: **[docs/00-INDICE.md](docs/00-INDICE.md)**.


| Doc                                                      | Contenido                               |
| -------------------------------------------------------- | --------------------------------------- |
| [00-INDICE](docs/00-INDICE.md)                           | Mapa y orden de lectura                 |
| [01-PROBLEMA](docs/01-PROBLEMA-Y-CONTEXTO.md)            | Contexto y actores                      |
| [02-REQUISITOS](docs/02-REQUISITOS.md)                   | Requisitos funcionales y no funcionales |
| [03-ARQUITECTURA](docs/03-ARQUITECTURA-Y-STACK.md)       | Stack y decisiones                      |
| [04-VISIÓN B2B](docs/04-VISION-Y-ALCANCE-B2B.md)         | Alcance y principios                    |
| [05-ROLES](docs/05-ROLES-Y-PERMISOS.md)                  | Matrices de permisos                    |
| [06-FLUJOS](docs/06-FLUJOS-ONBOARDING-E-INVITACIONES.md) | Onboarding e invitaciones               |
| [07-DATOS](docs/07-MODELO-DE-DATOS.md)                   | Modelo de datos                         |
| [08-ERD](docs/08-ERD.md)                                 | Diagrama entidad-relación               |
| [09-FRONTEND](docs/09-DISENO-TECNICO-FRONTEND.md)        | Diseño técnico frontend                 |
| [10-SUPABASE](docs/10-BACKEND-SUPABASE.md)               | Backend Supabase                        |
| [11-TESTING](docs/11-TESTING-Y-CALIDAD.md)               | Testing y calidad                       |
| [12-CA](docs/12-CRITERIOS-DE-ACEPTACION.md)              | Criterios de aceptación                 |
| [13-ESTADO](docs/13-ESTADO-ACTUAL.md)                    | Estado actual del proyecto              |


---



## Despliegue

**Producción:** [https://www.brainiemotions.com/](https://www.brainiemotions.com/)

Hosting estático en **Vercel** (`vercel.json` con rewrites SPA). Backend: **Supabase Cloud**. Variables de entorno en producción (mismas que en `.env.example`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

El desarrollo local sigue en `http://localhost:8080/` (`npm run dev`).

Antes de publicar el repositorio en abierto, revisar la checklist de seguridad del dashboard en [docs/13-ESTADO-ACTUAL.md](docs/13-ESTADO-ACTUAL.md) (sección 12).

