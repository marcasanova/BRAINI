# BRAINI - Waitlist App

Una aplicación moderna y elegante para capturar emails de usuarios interesados en **Braini**, una plataforma de bienestar emocional y mental.

## 🚀 Características

- **Diseño Responsive**: Optimizado para todos los dispositivos (móvil, tablet, desktop)
- **UI/UX Moderna**: Interfaz atractiva con animaciones suaves y paleta de colores personalizada
- **Formulario Simplificado**: Solo requiere email para unirse a la waitlist
- **Integración Supabase**: Base de datos simple para almacenar emails
- **Notificaciones Toast**: Feedback inmediato para el usuario
- **Diseño Geométrico**: Fondo decorativo con formas y animaciones CSS
- **Social Proof**: Muestra un número fijo de personas registradas para generar confianza

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (base de datos simple)
- **UI Components**: Radix UI primitives
- **Iconos**: Lucide React

## 📱 Diseño Responsive

La aplicación está completamente optimizada para:
- **Móviles**: Diseño adaptativo con elementos apilados
- **Tablets**: Layout intermedio con mejor aprovechamiento del espacio
- **Desktop**: Vista completa con grid de características

## 🎨 Paleta de Colores

- **Braini Blue**: Color principal (#4A90E2)
- **Braini Pink**: Acentos (#FF69B4)
- **Braini Yellow**: Destacados (#FFD700)
- **Braini Turquoise**: Elementos decorativos (#40E0D0)

## 🚀 Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone <URL_DEL_REPO>

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` con:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### Base de Datos Supabase

Crea una tabla `waitlist` con la siguiente estructura:

```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── WaitlistApp.tsx      # Componente principal
│   ├── WaitlistForm.tsx     # Formulario de la waitlist
│   ├── WaitlistStats.tsx    # Estadísticas estáticas
│   ├── GeometricBackground.tsx # Fondo decorativo
│   └── ui/                  # Componentes shadcn/ui
├── hooks/
│   └── use-toast.ts         # Hook para notificaciones
├── lib/
│   └── supabaseClient.ts    # Cliente de Supabase
└── App.tsx                  # Punto de entrada
```

## 🎯 Funcionalidades

1. **Formulario de Waitlist**: Captura emails de usuarios
2. **Validación**: Verifica formato de email y duplicados
3. **Feedback Visual**: Estados de carga y confirmación
4. **Manejo de Errores**: Gestión de errores de red y validación
5. **Responsive Design**: Adaptable a todos los tamaños de pantalla
6. **Social Proof**: Muestra número fijo de personas registradas

## 🌟 Características de UX

- **Animaciones Suaves**: Transiciones y hover effects
- **Estados de Carga**: Indicadores visuales durante operaciones
- **Mensajes Claros**: Feedback inmediato para todas las acciones
- **Accesibilidad**: Labels, placeholders y estructura semántica
- **Performance**: Carga rápida y transiciones fluidas
- **Social Proof**: Número fijo de "39 personas" para generar confianza

## 📊 Funcionalidades de la Waitlist

### **Formulario Simple:**
- Solo campo de email
- Validación en tiempo real
- Manejo de duplicados
- Estados de loading y éxito

### **Social Proof:**
- Muestra "39 personas ya registradas"
- Diseño atractivo con iconos
- Mensaje motivacional
- Genera confianza y urgencia

### **Integración Supabase:**
- Almacenamiento de emails
- Prevención de duplicados
- Base de datos escalable
- Fácil de mantener

## 🚀 Deployment

### Lovable
Simplemente abre [Lovable](https://lovable.dev) y haz clic en Share -> Publish.

### Manual
```bash
npm run build
# Subir la carpeta dist/ a tu hosting
```

## 🔮 Próximos Pasos

- [ ] Integración con servicios de email marketing
- [ ] Dashboard de administración
- [ ] Analytics y métricas
- [ ] Personalización de mensajes
- [ ] Integración con redes sociales
- [ ] A/B testing del formulario

## 💡 Ventajas de la Implementación Simple

1. **Mantenimiento Fácil**: Sin funciones SQL complejas
2. **Performance Óptima**: Sin consultas pesadas
3. **Escalabilidad**: Fácil de expandir
4. **Social Proof Efectivo**: Número fijo genera confianza
5. **Desarrollo Rápido**: Funcionalidad básica pero efectiva

---

**Braini** - Mind and emotions in harmony ✨
