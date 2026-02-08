# Descripción teórica de BRAINI Emotions

## 1. ¿Qué es BRAINI Emotions?

**BRAINI Emotions** es una plataforma digital de **neurobienestar emocional** que ofrece programas de desarrollo emocional basados en evidencias científicas. La herramienta se dirige a **familias** y a **centros educativos** (Educación Infantil y Primaria) mediante tres líneas de producto:

- **Braini Kids**: implantación en centros de Educación Infantil (acceso al programa, sesiones, recursos y formación para docentes).
- **Braini Juniors**: implantación en centros de Educación Primaria (misma estructura que Kids).
- **Braini Family**: programa interactivo para **familias**, que es el núcleo de la aplicación web que analizamos aquí.

En conjunto, BRAINI Emotions se presenta como un **Programa de Neurobienestar Emocional** con “juegos, retos y actividades basadas en evidencias científicas”.

---

## 2. En qué consiste la herramienta (Braini Family)

La parte de la herramienta que corresponde a **Braini Family** es una **aplicación web** en la que las familias (padres, madres o tutores) realizan, junto con sus hijos, un itinerario estructurado de **sesiones** y **actividades** para trabajar la inteligencia emocional en el hogar.

### 2.1 Público objetivo

- **Personas adultas**: padres, madres, abuelos/as, tutores/as (registro y gestión del perfil).
- **Menores**: niños y niñas de **3 a 12 años**, con perfiles diferenciados por **nivel educativo** (Infantil 3, 4 y 5 años; 1º y 2º de Primaria; u “Otro”).

La herramienta está pensada para usarse **en familia**: las actividades se hacen con el niño o la niña, y el adulto acompaña y sigue el programa desde la misma cuenta.

### 2.2 Estructura pedagógica: misiones y retos

El contenido se organiza en:

- **Misiones (sesiones)**  
  Cada misión es una unidad de trabajo (equivalente a una “sesión”). Hay una **Misión 0** introductoria (“¡Comienza la aventura!”) y un conjunto de **sesiones numeradas** (por ejemplo, 25 sesiones en la descripción del producto). Cada sesión tiene título y descripción.

- **Retos (actividades)**  
  Dentro de cada misión hay **varios retos** (actividades). Cada reto es una actividad concreta (juegos, ejercicios, preguntas, masajes, etc.) con instrucciones, duración estimada y, en muchos casos, referencia a base científica.

- **Tipos de actividad**  
  Las actividades se clasifican en cuatro pilares, cada uno con un color y un rol claro:
  1. **Inteligencia Emocional** (azul): reconocer, nombrar y entender emociones (juegos, historias, preguntas).
  2. **Regulación Emocional** (turquesa): calmarse, escuchar el cuerpo, respirar y relajarse.
  3. **Vínculo Afectivo** (rosa): cierre afectivo de la sesión (abrazo, mirada, palabras bonitas).
  4. **Acompañamiento Emocional** (amarillo): contenido solo para adultos (orientaciones para acompañar al menor en el día a día).

Esta estructura permite explicar la herramienta como un **programa secuencial de misiones y retos** centrado en emociones, regulación, vínculo y acompañamiento.

### 2.3 Progresión y gamificación

- **Estados de sesión**: cada misión puede estar **bloqueada**, **actual** o **completada**, de modo que el usuario avanza de forma ordenada.
- **Medallas**: al completar una misión se desbloquea una **medalla** (asociada al nivel educativo del menor, p. ej. 3, 4 o 5 años). La obtención de la medalla se muestra con una animación.
- **Mapa de misiones**: existe un “mapa de misiones” descargable para que la familia vea el recorrido completo y lo que van logrando.

Con esto, la herramienta no solo enseña contenidos emocionales, sino que **incentiva la continuidad** mediante progresión y recompensas simbólicas.

### 2.4 Contenido de las actividades

Cada actividad puede incluir:

- **Duración** (mínimo y máximo en minutos).
- **Instrucciones**: “Cómo se juega” y, en su caso, “Para qué” (objetivo).
- **Base científica**: explicación breve de la investigación o beneficios (popup “Base científica”).
- **Contenido interactivo**: según la actividad, pueden aparecer pasos numerados, vídeos, imágenes, selección de emociones, ejercicios de masaje/relajación, preguntas reflexivas, etc.

Las emociones trabajadas se apoyan en un catálogo amplio (alegría, tristeza, miedo, rabia, celos, vergüenza, sorpresa, frustración, tranquilidad, etc.), con recursos visuales (ilustraciones) almacenados en la plataforma.

En resumen: la herramienta combina **contenido psicoeducativo**, **actividades lúdicas** y **referencia a evidencia** para que las familias entiendan tanto el “qué hacer” como el “por qué”.

---

## 3. Funcionalidades principales (qué hace la herramienta)

### 3.1 Hub y acceso por programas

- **Página principal (Hub)**: el usuario elige entre Braini Kids, Braini Juniors o Braini Family. Cada programa tiene su landing y su propuesta de valor.
- **Braini Family**: acceso a la landing del programa familiar y, desde ahí, a **registro** e **inicio de sesión**.

### 3.2 Autenticación y perfiles

- **Registro e inicio de sesión** (Supabase Auth): solo usuarios registrados acceden al contenido de Braini Family.
- **Perfil del adulto (onboarding)**: nombre y relación con el menor (madre, padre, abuelo/a, tutor/a, otros). Si el perfil no está completado, se guía al usuario a terminarlo antes de ir al “home”.
- **Perfil del menor (onboarding)**: nombre, apellidos, género, nivel educativo. Esto permite personalizar medallas, mensajes (p. ej. “¡[Nombre], empieza la aventura!”) y, en su caso, contenidos.
- **Perfil de usuario**: gestión del perfil una vez dentro de la app (ruta `/brainifamily/profile`).

### 3.3 Home (panel principal)

- **Título personalizado** con el nombre del niño o niña (“¡[Nombre], empieza la aventura!”).
- **Estantería de medallas**: medallas obtenidas y total disponible, según nivel educativo.
- **Misión 0**: explicación del mapa de misiones y de los cuatro tipos de actividades (Inteligencia Emocional, Regulación, Vínculo Afectivo, Acompañamiento Emocional), con opción de **descargar el mapa**.
- **Listado de misiones (sesiones)**: cada misión se muestra con su estado (bloqueada, actual, completada) y permite entrar a ver sus retos.

### 3.4 Sesión (misión) y retos

- **Vista de una misión**: título, descripción y lista de **retos (actividades)** de esa sesión.
- **Navegación entre sesiones**: ir a la misión anterior o siguiente sin volver al home.
- **Listado de retos**: cada reto muestra tipo de actividad, estado (completado o no) y permite abrirlo.

### 3.5 Detalle de actividad (reto)

- **Contenido específico** según la actividad (componentes por sesión y número de actividad: Ses1Act1, Ses1Act2, Ses2Act1, Ses2Act2, … Ses10Act1, etc.).
- **Instrucciones estándar**: duración, “Cómo se juega”, “Base científica”.
- **Interacción**: pasos, vídeos, imágenes, selección de emociones, ejercicios (p. ej. “Pizza para cenar” como actividad de masaje y relajación en Sesión 2).
- **Valoración**: al finalizar, el usuario puede valorar la actividad (por ejemplo, valoración por estrellas o similar).
- **Progreso**: al completar una actividad se avanza; al completar todas las de la misión, se desbloquea la medalla y se muestra la animación correspondiente.

### 3.6 Diario emocional

- **Registro diario de emociones**: la familia puede registrar cómo se ha sentido el niño o la niña en un día concreto.
- **Selector de emociones**: elección de una o varias emociones a partir del catálogo (con imágenes).
- **Calendario**: visualización por mes y por día; posibilidad de ver y editar entradas pasadas.
- **Observaciones**: campo de texto para notas asociadas al día.

Sirve para **hacer seguimiento emocional** en el tiempo y complementar las misiones con un registro continuo.

### 3.7 Inteligencia emocional y tests

- **Sección “Inteligencia Emocional”**: página que presenta la evaluación de la inteligencia emocional propia y del menor.
- **Tests validados**: enlace a tests desarrollados o evaluados por investigadores de la **Universidad de Cádiz** y la **Universidad de Alicante** (mencionados en la interfaz).
- **Test TMMS para padres**: cuestionario de meta-conocimiento emocional para adultos.
- **Test emocional para niños**: evaluación adaptada para menores.

Con esto, la herramienta no solo ofrece actividades, sino también **evaluación basada en evidencia** para padres e hijos.

---

## 4. Base técnica (resumen)

- **Frontend**: aplicación **React** (TypeScript) con **Vite**, **React Router**, **Tailwind CSS** y componentes **shadcn/ui**.
- **Backend y datos**: **Supabase** (autenticación, base de datos y almacenamiento). Tablas relevantes incluyen: usuarios/padres, hijos (`children`), sesiones (`levels`), progreso por sesión (`parents_levels`), actividades y progreso por actividad, medallas (`medals`, `parents_medals`), y entradas del diario emocional.
- **Estado y datos**: **TanStack React Query** para gestión de datos asíncronos; hooks propios para sesiones, actividades, medallas y diario emocional.
- **Rutas protegidas**: solo usuarios autenticados acceden a home, perfiles, sesiones, actividades, diario y tests.

---

## 5. Cómo explicar la herramienta en una frase

**BRAINI Emotions (Braini Family)** es una **plataforma web de neurobienestar emocional para familias** que, mediante **misiones y retos** (sesiones y actividades), trabaja la **inteligencia emocional**, la **regulación emocional**, el **vínculo afectivo** y el **acompañamiento emocional** con niños de 3 a 12 años, usando actividades lúdicas, base científica, **diario emocional** y **tests validados** (padres e hijos), con **progresión gamificada** (medallas y mapa de misiones).

---

## 6. Posibles usos de esta descripción

- Presentaciones del producto a instituciones, centros o familias.
- Documentación interna o para colaboradores.
- Resumen para informes, memorias de proyecto o solicitudes de financiación.
- Base para textos de comunicación o marketing (adaptando el tono según el canal).

Si necesitas una versión más corta (elevator pitch), una versión solo técnica o una versión solo pedagógica, se puede extraer a partir de este documento.
