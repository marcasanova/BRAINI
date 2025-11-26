# Guía de Limpieza de Dependencias

## 📋 Proceso Recomendado

### Paso 1: Backup (Opcional pero recomendado)
```bash
# Crear un backup del package.json actual
cp package.json package.json.backup
```

### Paso 2: Limpiar archivos de dependencias
```bash
# Eliminar node_modules
rm -rf node_modules

# Eliminar lock files (elige según tu gestor)
rm -f package-lock.json  # Si usas npm
# O
rm -f bun.lockb  # Si usas bun
```

### Paso 3: Reinstalar dependencias limpias
```bash
# Si usas npm:
npm install

# Si usas bun:
bun install
```

### Paso 4: Verificar que todo funciona
```bash
# Verificar que no hay errores
npm run build

# O probar en desarrollo
npm run dev
```

## 🔍 Análisis de Dependencias Actuales

### Dependencias que SÍ se usan:
- ✅ `@tanstack/react-query` - Usado en App.tsx
- ✅ `react-router-dom` - Usado en toda la app
- ✅ `@supabase/supabase-js` - Usado en toda la app
- ✅ `lucide-react` - Iconos en toda la app
- ✅ `tailwind-merge`, `clsx` - Utilidades de estilos
- ✅ `zod`, `react-hook-form`, `@hookform/resolvers` - Validación de formularios
- ✅ `date-fns` - Manejo de fechas
- ✅ `sonner` - Notificaciones toast
- ✅ Todos los `@radix-ui/*` - Componentes UI (shadcn/ui)

### Dependencias que podrían no usarse directamente:
- ⚠️ `recharts` - Solo usado en componentes UI (chart.tsx)
- ⚠️ `embla-carousel-react` - Solo usado en componentes UI (carousel.tsx)
- ⚠️ `cmdk` - Solo usado en componentes UI (command.tsx)
- ⚠️ `input-otp` - Solo usado en componentes UI (input-otp.tsx)
- ⚠️ `vaul` - Solo usado en componentes UI (drawer.tsx)
- ⚠️ `next-themes` - Podría no usarse (verificar)
- ⚠️ `react-resizable-panels` - Solo usado en componentes UI (resizable.tsx)
- ⚠️ `react-day-picker` - Solo usado en componentes UI (calendar.tsx)

**Nota:** Aunque estos paquetes solo se usen en componentes UI, son necesarios si esos componentes se usan en algún lugar de la aplicación.

## 🧹 Comandos de Limpieza Rápida

### Opción 1: Limpieza completa (Recomendada)
```bash
# 1. Eliminar node_modules y lock files
rm -rf node_modules package-lock.json bun.lockb

# 2. Reinstalar (elige según tu gestor)
npm install
# O
bun install

# 3. Verificar
npm run build
```

### Opción 2: Solo limpiar node_modules (más rápido)
```bash
rm -rf node_modules
npm install
```

## ⚠️ Advertencias

1. **No elimines `package.json`** - Contiene todas las dependencias necesarias
2. **Mantén los archivos de configuración** - `vite.config.ts`, `tailwind.config.ts`, etc.
3. **Verifica después de limpiar** - Asegúrate de que `npm run build` funciona

## 📊 Tamaño Actual

- `node_modules`: ~339MB
- `package-lock.json`: ~(tamaño variable)
- `bun.lockb`: ~(si existe)

## ✅ Después de la Limpieza

Una vez reinstaladas las dependencias, deberías tener:
- ✅ `node_modules/` limpio y actualizado
- ✅ `package-lock.json` o `bun.lockb` regenerado
- ✅ Todas las dependencias instaladas correctamente
- ✅ Sin archivos duplicados o corruptos

