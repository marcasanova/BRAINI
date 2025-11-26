# Análisis de Archivos: MAIN (Production) vs DEVELOP

## 📊 Resumen General

- **MAIN (production)**: ~60 archivos TypeScript/TSX
- **DEVELOP**: ~107 archivos TypeScript/TSX  
- **Diferencia**: ~47 archivos nuevos en develop

---

## 📁 ARCHIVOS DE PRODUCTION (MAIN)

### Componentes de Landing/Waitlist (en `src/components/`)
Estos archivos son específicos de la versión de producción y están diseñados para la landing page y waitlist:

- ✅ `src/components/LandingPage.tsx` - **Landing page de producción** (803 líneas)
- ✅ `src/components/ConferenciaPage.tsx` - Página de conferencia (producción)
- ✅ `src/components/TestGeniusPage.tsx` - Página de test genius (producción)
- ✅ `src/components/NotFound.tsx` - Página 404 (producción)

### Archivos de Configuración
- ✅ `index.html` - Con SEO completo y meta tags de producción
- ✅ `public/favicon.ico` - Favicon de producción
- ✅ `package-lock.json` - Lock file de producción
- ✅ `vercel.json` - Configuración de Vercel (si existe)

---

## 🆕 ARCHIVOS DE DEVELOP (Nuevos)

### 📚 Documentación
- 📄 `docs/CONFIGURACION_TRIAL_USERS.md` - Documentación de trial users
- 📄 `docs/TRIAL_USERS_QUICK_REFERENCE.md` - Referencia rápida

### 🎨 Componentes de la Aplicación Principal

#### Layout y Navegación
- `src/components/Backgrounds.tsx` - Wrapper de fondos y cards
- `src/components/navigation/Navbar.tsx` - Barra de navegación responsive
- `src/components/navigation/ProtectedRoute.tsx` - Ruta protegida

#### Actividades (Sesiones)
- `src/components/activities/ActivityList.tsx`
- `src/components/activities/ActivityNavigation.tsx`
- `src/components/activities/ActivityRating.tsx`
- `src/components/activities/content/Ses1Act1.tsx`
- `src/components/activities/content/Ses1Act2.tsx`
- `src/components/activities/content/Ses2Act1.tsx`
- `src/components/activities/content/Ses2Act2.tsx`
- `src/components/activities/content/Ses3Act1.tsx`
- `src/components/activities/content/Ses3Act2.tsx`
- `src/components/activities/content/Ses4Act1.tsx`
- `src/components/activities/content/Ses4Act2.tsx`
- `src/components/activities/utils/activityColors.tsx`
- `src/components/activities/utils/SuccessPopup.tsx`
- `src/components/activities/utils/textFormatter.tsx`

#### Diario Emocional
- `src/components/emotionalDiary/EmotionCalendar.tsx`
- `src/components/emotionalDiary/EmotionEntry.tsx`
- `src/components/emotionalDiary/EmotionSelector.tsx`

#### Niveles/Sesiones
- `src/components/levels/LevelItem.tsx`
- `src/components/levels/LevelList.tsx`
- `src/components/levels/LevelNavigation.tsx`

#### Medallas
- `src/components/medals/Medal.tsx`
- `src/components/medals/MedalAnimation.tsx`
- `src/components/medals/MedalGrid.tsx`
- `src/components/medals/MedalShelf.tsx`

#### Utilidades
- `src/components/MapDownload.tsx`

### 📄 Páginas de la Aplicación (en `src/pages/`)

#### Autenticación
- `src/pages/auth/Login.tsx`
- `src/pages/auth/SignUp.tsx`
- `src/pages/auth/Profile.tsx`

#### Onboarding
- `src/pages/onboarding/ParentsProfile.tsx`
- `src/pages/onboarding/ChildProfile.tsx`

#### Core de la Aplicación
- `src/pages/core/Home.tsx` - Panel principal
- `src/pages/core/Activities.tsx` - Lista de actividades
- `src/pages/core/ActivityDetail.tsx` - Detalle de actividad
- `src/pages/core/DiarioEmocional.tsx` - Diario emocional

#### Inteligencia Emocional
- `src/pages/intelligence/InteligenciaEmocional.tsx`
- `src/pages/intelligence/tests/TestTMMSPadres.tsx`
- `src/pages/intelligence/tests/TestEmocionalNinos.tsx`

#### Soporte
- `src/pages/support/EmailVerified.tsx`
- `src/pages/support/NotFound.tsx`
- `src/pages/support/UpdatePassword.tsx`
- `src/pages/support/VerifyEmail.tsx`

#### Trial Users
- `src/pages/Conferencia.tsx` - Página de registro para trial users

### 🪝 Hooks Personalizados
- `src/hooks/useEmotionalDiary.tsx`
- `src/hooks/useUserActivities.tsx`
- `src/hooks/useUserLevels.tsx`
- `src/hooks/useUserMedals.tsx`

### 📦 Constantes
- `src/constants/levelStatus.ts`

### 🎨 Assets Públicos (desde develop)
- `public/LogoInstagram.svg`
- `public/avatars/profile1.jpeg`
- `public/avatars/profile2.jpg`
- `public/avatars/profile3.jpg`
- `public/logo/BRAINI_black.png`
- `public/logo/BRAINI_white.png`
- `public/logo/LogoBrainiEnfadado.png`
- `public/logo/LogoBraini_new.png`
- `public/logo/logoBraini.png`

---

## 🔄 ARCHIVOS MODIFICADOS (Existen en ambas ramas)

### Configuración del Proyecto
- `package.json` - Dependencias actualizadas (develop tiene más: @tanstack/react-query, recharts, etc.)
- `tailwind.config.ts` - Colores corporativos actualizados (develop)
- `src/index.css` - Estilos personalizados completos (develop)
- `src/App.tsx` - Rutas completas de la aplicación (develop)
- `README.md` - Documentación genérica (develop)
- `eslint.config.js`
- `postcss.config.js`
- `components.json`

### Componentes UI (shadcn/ui)
Todos los componentes en `src/components/ui/` fueron actualizados desde develop:
- `accordion.tsx`, `alert-dialog.tsx`, `alert.tsx`, `avatar.tsx`, `badge.tsx`, `button.tsx`, `calendar.tsx`, `card.tsx`, `carousel.tsx`, `chart.tsx`, `checkbox.tsx`, `collapsible.tsx`, `command.tsx`, `context-menu.tsx`, `dialog.tsx`, `drawer.tsx`, `dropdown-menu.tsx`, `form.tsx`, `hover-card.tsx`, `input-otp.tsx`, `input.tsx`, `label.tsx`, `menubar.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `popover.tsx`, `progress.tsx`, `radio-group.tsx`, `resizable.tsx`, `scroll-area.tsx`, `select.tsx`, `separator.tsx`, `sheet.tsx`, `sidebar.tsx`, `skeleton.tsx`, `slider.tsx`, `sonner.tsx`, `switch.tsx`, `table.tsx`, `tabs.tsx`, `textarea.tsx`, `toast.tsx`, `toaster.tsx`, `toggle-group.tsx`, `toggle.tsx`, `tooltip.tsx`, `use-toast.ts`

### Otros
- `src/App.css`
- `src/lib/supabaseClient.ts`
- `src/lib/utils.ts`
- `src/main.tsx`
- `src/hooks/use-mobile.tsx`
- `src/hooks/use-toast.ts`
- `public/robots.txt`

---

## ⚠️ ARCHIVOS QUE EXISTEN SOLO EN MAIN (No en develop)

- `src/components/ConferenciaPage.tsx` - Versión de producción (diferente a `src/pages/Conferencia.tsx` de develop)
- `src/components/TestGeniusPage.tsx` - Solo en producción
- `vercel.json` - Configuración de Vercel (si existe)

---

## 📝 NOTAS IMPORTANTES

1. **LandingPage**: 
   - MAIN tiene: `src/components/LandingPage.tsx` (803 líneas, usa assets locales)
   - DEVELOP tenía: `src/pages/LandingPage.tsx` (697 líneas, usa Supabase Storage)
   - **Decisión**: Se mantuvo la de MAIN (producción)

2. **Conferencia**:
   - MAIN tiene: `src/components/ConferenciaPage.tsx`
   - DEVELOP tiene: `src/pages/Conferencia.tsx` (para trial users)
   - **Ambas se mantienen** (diferentes propósitos)

3. **NotFound**:
   - MAIN tiene: `src/components/NotFound.tsx`
   - DEVELOP tiene: `src/pages/support/NotFound.tsx`
   - **Ambas se mantienen** (diferentes ubicaciones)

4. **Estructura de carpetas**:
   - MAIN: Componentes principales en `src/components/`
   - DEVELOP: Páginas organizadas en `src/pages/` con subcarpetas (auth, core, onboarding, etc.)

---

## 🎯 Resumen Final

**DEVELOP aporta:**
- ✅ Toda la aplicación funcional (sesiones, actividades, diario emocional, tests)
- ✅ Sistema de autenticación completo
- ✅ Onboarding de padres e hijos
- ✅ Sistema de trial users
- ✅ Componentes UI actualizados
- ✅ Hooks personalizados
- ✅ Documentación

**MAIN aporta:**
- ✅ Landing page de producción (con SEO completo)
- ✅ Páginas de marketing (ConferenciaPage, TestGeniusPage)
- ✅ Configuración de producción (index.html con SEO, favicon)
- ✅ Configuración de Vercel

**Resultado del merge:**
- ✅ Se mantiene la landing page de producción
- ✅ Se integra toda la aplicación de develop
- ✅ Se preservan los assets y configuraciones de producción

