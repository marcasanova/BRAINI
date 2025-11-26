# Configuración de Usuarios de Prueba (Trial Users) - Conferencia

## 📋 Índice

1. [Resumen](#resumen)
2. [Cambios en Base de Datos](#cambios-en-base-de-datos)
3. [Cambios en Código Frontend](#cambios-en-código-frontend)
4. [Flujo Completo](#flujo-completo)
5. [Cómo Revertir los Cambios](#cómo-revertir-los-cambios)
6. [Troubleshooting](#troubleshooting)

---

## 📝 Resumen

Este documento detalla la implementación del sistema de **prueba gratuita** para usuarios que acceden mediante un QR que redirige a la ruta `/conferencia`. Estos usuarios:

- Solo necesitan registrarse con: **nombre, email y contraseña**
- **NO** necesitan completar el onboarding (ni perfil de padre ni de hijo)
- Tienen acceso automático a **3 sesiones** (niveles)
- Su email se **auto-verifica** automáticamente
- Son marcados con el flag `is_trial_user = true`

---

## 🗄️ Cambios en Base de Datos

### 1. Añadir Campo `is_trial_user` en Tabla `parents`

**Ubicación:** Supabase Dashboard → Database → Table Editor → `parents`

**SQL a ejecutar:**
```sql
ALTER TABLE public.parents 
ADD COLUMN IF NOT EXISTS is_trial_user BOOLEAN DEFAULT false;
```

**Descripción:** Campo booleano que identifica si un usuario es de prueba o no.

**Verificación:**
- El campo debe aparecer en la tabla `parents`
- Default value: `false`
- Nullable: `true`

---

### 2. Crear Función RPC para Auto-verificación de Email

**Ubicación:** Supabase Dashboard → Database → SQL Editor

**SQL a ejecutar:**
```sql
-- Función para auto-verificar email de usuarios trial
CREATE OR REPLACE FUNCTION public.auto_verify_trial_user(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Actualizar solo email_confirmed_at (confirmed_at se actualiza automáticamente)
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = user_id;
  
  -- Verificar que se actualizó correctamente
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;
END;
$$;
```

**Permisos:**
```sql
-- Permitir que usuarios autenticados llamen a esta función
GRANT EXECUTE ON FUNCTION public.auto_verify_trial_user(UUID) TO authenticated;
```

**Descripción:** Esta función actualiza `email_confirmed_at` en `auth.users` para verificar automáticamente el email sin necesidad de que el usuario haga clic en el enlace.

**Nota importante:** `confirmed_at` es una columna generada y NO se puede actualizar manualmente. Solo actualizamos `email_confirmed_at`.

**Verificación:**
```sql
-- Probar la función (reemplazar con un user_id válido)
SELECT public.auto_verify_trial_user('user-id-aqui');
```

---

### 3. Verificar Políticas RLS

**Ubicación:** Supabase Dashboard → Database → Policies → `parents`

**Políticas necesarias:**

1. **INSERT Policy:** "Solo dueño puede crear su perfil"
   - Command: `INSERT`
   - WITH CHECK: `(auth.uid() = id)`
   - ✅ Ya existe y está correcta

2. **SELECT Policy:** "Solo dueño puede leer su perfil"
   - Command: `SELECT`
   - USING: `(auth.uid() = id)`
   - ✅ Ya existe y está correcta

3. **UPDATE Policy:** "Solo dueño puede modificar su perfil"
   - Command: `UPDATE`
   - USING: `(auth.uid() = id)`
   - ✅ Ya existe y está correcta

4. **DELETE Policy:** "Solo dueño puede borrar su perfil"
   - Command: `DELETE`
   - USING: `(auth.uid() = id)`
   - ✅ Ya existe y está correcta

**Nota:** Las políticas RLS están correctas. El problema inicial era el orden del flujo (hacer login antes de insertar).

---

## 💻 Cambios en Código Frontend

### 1. Crear Página `/conferencia`

**Archivo:** `src/pages/Conferencia.tsx`

**Descripción:** Landing page con formulario de registro para usuarios de prueba.

**Características:**
- Formulario con 3 campos: nombre, email, contraseña (en ese orden)
- Validaciones en frontend
- Auto-verificación de email mediante función RPC
- Creación de registro en `parents` con `is_trial_user = true`
- Login automático después del registro
- Redirección a `/home`

**Flujo del código:**
1. Validar formulario
2. `signUp()` - Crear usuario en Auth
3. `rpc('auto_verify_trial_user')` - Auto-verificar email
4. `signInWithPassword()` - Hacer login (necesario para RLS)
5. `upsert()` en `parents` - Crear/actualizar registro
6. Redirigir a `/home`

**Código completo:** Ver archivo `src/pages/Conferencia.tsx`

---

### 2. Añadir Ruta en App.tsx

**Archivo:** `src/App.tsx`

**Cambio realizado:**
```typescript
// Import añadido
import Conferencia from './pages/Conferencia';

// Ruta añadida (sin ProtectedRoute)
<Route path="/conferencia" element={<Conferencia />} />
```

**Línea aproximada:** Después de la ruta `/` y antes de `/signup`

---

### 3. Modificar Login.tsx

**Archivo:** `src/pages/auth/Login.tsx`

**Cambio realizado:**

**Antes:**
```typescript
const { data: parentData, error: parentError } = await supabase
  .from('parents')
  .select('profile_completed')
  .eq('id', userId)
  .single();
```

**Después:**
```typescript
const { data: parentData, error: parentError } = await supabase
  .from('parents')
  .select('profile_completed, is_trial_user')  // ← Añadido is_trial_user
  .eq('id', userId)
  .single();
```

**Y añadir después de verificar `profile_completed`:**
```typescript
// Verificar si es usuario de prueba (saltar todo el onboarding)
if (parentData.is_trial_user === true) {
  navigate('/home');
  return;
}
```

**Ubicación:** En la función `handleSubmit`, después de la verificación de `profile_completed === false`

**Orden completo de verificación en Login:**
1. Si `profile_completed === false` → `/parents-profile`
2. Si `is_trial_user === true` → `/home` (saltar todo)
3. Si no existe `child` → `/child-profile`
4. Si todo está completo → `/home`

---

### 4. Modificar ParentsProfile.tsx

**Archivo:** `src/pages/onboarding/ParentsProfile.tsx`

**Cambio realizado:**

**Antes:**
```typescript
const { data, error: fetchError } = await supabase
  .from('parents')
  .select('profile_completed, nombre, apellidos, dni, fecha_nacimiento, relacion_con_menor, telefono_contacto, codigo_postal, nivel_educativo, genero, pais_origen, ciudad_origen, idioma_casa, estilo_crianza, expectativas_programa')
  .eq('id', user.id)
  .single();
```

**Después:**
```typescript
const { data, error: fetchError } = await supabase
  .from('parents')
  .select('profile_completed, nombre, apellidos, dni, fecha_nacimiento, relacion_con_menor, telefono_contacto, codigo_postal, nivel_educativo, genero, pais_origen, ciudad_origen, idioma_casa, estilo_crianza, expectativas_programa, is_trial_user')  // ← Añadido is_trial_user
  .eq('id', user.id)
  .single();
```

**Y añadir después de verificar `profile_completed`:**
```typescript
// Verificar si es usuario de prueba (saltar onboarding)
if (data.is_trial_user === true) {
  navigate('/home');
  return;
}
```

**Ubicación:** En el `useEffect` que carga el perfil (alrededor de línea 115-166)

---

### 5. Modificar ChildProfile.tsx

**Archivo:** `src/pages/onboarding/ChildProfile.tsx`

**Cambio realizado:**

**Añadir al inicio del `useEffect` (después de obtener el user):**
```typescript
// Verificar si es usuario de prueba (saltar onboarding)
const { data: parentData, error: parentError } = await supabase
  .from('parents')
  .select('is_trial_user')
  .eq('id', user.id)
  .single();

if (parentError && parentError.code !== 'PGRST116') {
  // Error real, no solo "no encontrado"
  throw parentError;
}

if (parentData?.is_trial_user === true) {
  navigate('/home');
  return;
}

// Luego continúa con la verificación de children existente
```

**Ubicación:** En el `useEffect` inicial (alrededor de línea 73-99), después de obtener el usuario y antes de verificar `children`

---

## 🔄 Flujo Completo

### Flujo de Usuario de Prueba (Trial User)

```
1. Usuario escanea QR
   ↓
2. Redirige a /conferencia
   ↓
3. Completa formulario:
   - Nombre
   - Email
   - Contraseña
   ↓
4. Clic en "Comenzar mi prueba gratuita"
   ↓
5. Backend:
   a) signUp() → Crea usuario en Auth
   b) rpc('auto_verify_trial_user') → Auto-verifica email
   c) signInWithPassword() → Inicia sesión
   d) upsert() en parents → Crea/actualiza registro con:
      - id: user.id
      - email: email
      - nombre: nombre
      - profile_completed: true
      - is_trial_user: true
   e) Triggers automáticos:
      - trigger_parents_levels → Crea 3 niveles en parents_levels
      - trigger_parents_activities → Crea actividades (si aplica)
   ↓
6. Redirige a /home
   ↓
7. Usuario tiene acceso a 3 sesiones ✅
```

### Flujo de Login Posterior

```
1. Usuario hace login
   ↓
2. Login.tsx verifica:
   - profile_completed === false? → /parents-profile
   - is_trial_user === true? → /home ✅ (salta todo)
   - No existe child? → /child-profile
   - Todo completo? → /home
   ↓
3. Si es trial user → Va directo a /home
```

---

## 🔙 Cómo Revertir los Cambios

### Paso 1: Eliminar Campo de Base de Datos

**SQL a ejecutar:**
```sql
ALTER TABLE public.parents 
DROP COLUMN IF EXISTS is_trial_user;
```

**Verificación:** El campo debe desaparecer de la tabla `parents`

---

### Paso 2: Eliminar Función RPC

**SQL a ejecutar:**
```sql
DROP FUNCTION IF EXISTS public.auto_verify_trial_user(UUID);
```

**Verificación:** La función debe desaparecer de Database Functions

---

### Paso 3: Eliminar Página Conferencia

**Archivo a eliminar:**
- `src/pages/Conferencia.tsx`

**Comando:**
```bash
rm src/pages/Conferencia.tsx
```

---

### Paso 4: Eliminar Ruta en App.tsx

**Archivo:** `src/App.tsx`

**Eliminar:**
```typescript
// Eliminar import
import Conferencia from './pages/Conferencia';

// Eliminar ruta
<Route path="/conferencia" element={<Conferencia />} />
```

---

### Paso 5: Revertir Login.tsx

**Archivo:** `src/pages/auth/Login.tsx`

**Revertir:**
```typescript
// Cambiar de:
.select('profile_completed, is_trial_user')

// A:
.select('profile_completed')

// Y eliminar:
if (parentData.is_trial_user === true) {
  navigate('/home');
  return;
}
```

---

### Paso 6: Revertir ParentsProfile.tsx

**Archivo:** `src/pages/onboarding/ParentsProfile.tsx`

**Revertir:**
```typescript
// Cambiar de:
.select('profile_completed, nombre, apellidos, dni, fecha_nacimiento, relacion_con_menor, telefono_contacto, codigo_postal, nivel_educativo, genero, pais_origen, ciudad_origen, idioma_casa, estilo_crianza, expectativas_programa, is_trial_user')

// A:
.select('profile_completed, nombre, apellidos, dni, fecha_nacimiento, relacion_con_menor, telefono_contacto, codigo_postal, nivel_educativo, genero, pais_origen, ciudad_origen, idioma_casa, estilo_crianza, expectativas_programa')

// Y eliminar:
if (data.is_trial_user === true) {
  navigate('/home');
  return;
}
```

---

### Paso 7: Revertir ChildProfile.tsx

**Archivo:** `src/pages/onboarding/ChildProfile.tsx`

**Eliminar el bloque completo:**
```typescript
// Eliminar todo este bloque:
const { data: parentData, error: parentError } = await supabase
  .from('parents')
  .select('is_trial_user')
  .eq('id', user.id)
  .single();

if (parentError && parentError.code !== 'PGRST116') {
  throw parentError;
}

if (parentData?.is_trial_user === true) {
  navigate('/home');
  return;
}
```

---

### Paso 8: Limpiar Usuarios de Prueba (Opcional)

Si quieres eliminar los usuarios de prueba creados:

**SQL a ejecutar:**
```sql
-- Ver usuarios de prueba
SELECT id, email, nombre, is_trial_user 
FROM public.parents 
WHERE is_trial_user = true;

-- Eliminar usuarios de prueba (CUIDADO: esto elimina también los usuarios de Auth)
-- Solo ejecutar si estás seguro
DELETE FROM auth.users 
WHERE id IN (
  SELECT id FROM public.parents WHERE is_trial_user = true
);
-- Los registros en parents se eliminarán automáticamente por CASCADE
```

**⚠️ ADVERTENCIA:** Esto eliminará permanentemente los usuarios de prueba. Asegúrate de hacer un backup antes.

---

## 🔍 Troubleshooting

### Error 403 Forbidden al insertar en parents

**Causa:** El usuario no está autenticado cuando se intenta insertar.

**Solución:** Asegúrate de que el flujo sea:
1. `signUp()` → Crea usuario
2. `signInWithPassword()` → Inicia sesión
3. `upsert()` en parents → Inserta (ahora con sesión activa)

---

### Error 400: null value in column "email"

**Causa:** Falta el campo `email` en el INSERT.

**Solución:** Asegúrate de incluir `email` en el objeto de inserción:
```typescript
.insert({
  id: signInData.user.id,
  email: email.trim(),  // ← No olvidar este campo
  nombre: nombre.trim(),
  profile_completed: true,
  is_trial_user: true
});
```

---

### Error 409 Conflict

**Causa:** Ya existe un registro con ese `id` o `email`.

**Solución:** Usar `upsert` en lugar de `insert`:
```typescript
.upsert({
  // ... datos
}, {
  onConflict: 'id'
});
```

---

### Error: "column confirmed_at can only be updated to DEFAULT"

**Causa:** Intentaste actualizar `confirmed_at` que es una columna generada.

**Solución:** Solo actualizar `email_confirmed_at` en la función RPC:
```sql
UPDATE auth.users
SET email_confirmed_at = NOW()  -- Solo esto
WHERE id = user_id;
-- NO actualizar confirmed_at
```

---

### Usuarios de prueba no pueden acceder a sesiones

**Causa:** Los triggers no se ejecutaron o fallaron.

**Solución:**
1. Verificar que los triggers existan:
   - `trigger_parents_levels`
   - `trigger_parents_activities`
2. Verificar que la función `new_parents_levels()` esté configurada para crear solo 3 niveles
3. Verificar en `parents_levels` que el usuario tenga 3 registros

---

## 📊 Verificación Final

### Checklist de Implementación

- [ ] Campo `is_trial_user` añadido en tabla `parents`
- [ ] Función RPC `auto_verify_trial_user` creada y con permisos
- [ ] Página `Conferencia.tsx` creada
- [ ] Ruta `/conferencia` añadida en `App.tsx`
- [ ] `Login.tsx` modificado para detectar trial users
- [ ] `ParentsProfile.tsx` modificado para redirigir trial users
- [ ] `ChildProfile.tsx` modificado para redirigir trial users
- [ ] Políticas RLS verificadas y funcionando
- [ ] Triggers verificados (crean 3 niveles)

### Pruebas a Realizar

1. **Registro desde `/conferencia`:**
   - [ ] Formulario se muestra correctamente
   - [ ] Validaciones funcionan
   - [ ] Registro se completa sin errores
   - [ ] Email se auto-verifica
   - [ ] Redirige a `/home`

2. **Verificación en Base de Datos:**
   - [ ] Registro en `parents` con `is_trial_user = true`
   - [ ] `email_confirmed_at` tiene fecha en `auth.users`
   - [ ] 3 registros en `parents_levels` para el usuario

3. **Login Posterior:**
   - [ ] Login funciona correctamente
   - [ ] Redirige a `/home` (no a onboarding)
   - [ ] Tiene acceso a 3 sesiones

4. **Protección de Onboarding:**
   - [ ] No puede acceder a `/parents-profile`
   - [ ] No puede acceder a `/child-profile`
   - [ ] Redirige automáticamente a `/home`

---

## 📝 Notas Adicionales

### Migración de Usuarios de Prueba a Completos

Si en el futuro quieres convertir un usuario de prueba a completo:

```sql
-- Cambiar flag y forzar onboarding
UPDATE public.parents
SET 
  is_trial_user = false,
  profile_completed = false
WHERE id = 'user-id-aqui';
```

Esto forzará al usuario a completar el onboarding normal.

---

### Límite de Niveles

Actualmente, la función `new_parents_levels()` está configurada para crear solo 3 niveles (id <= 3). Esto está correcto para la prueba gratuita.

Cuando implementes el pago, puedes:
1. Modificar la función para crear todos los niveles
2. O usar la función `add_premium_levels()` para añadir niveles premium

---

### Seguridad

- La función RPC `auto_verify_trial_user` usa `SECURITY DEFINER` para tener permisos de admin
- Solo usuarios autenticados pueden llamarla (GRANT TO authenticated)
- Las políticas RLS siguen protegiendo los datos

---

## 📅 Fecha de Implementación

**Implementado:** [Fecha actual]
**Versión:** 1.0
**Estado:** ✅ Activo

---

## 👥 Contacto

Para dudas o problemas con esta configuración, consultar este documento o revisar los commits relacionados.

---

**Última actualización:** [Fecha de última modificación]

