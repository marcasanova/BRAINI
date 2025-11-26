# Referencia Rápida - Usuarios de Prueba (Trial Users)

## 🎯 Resumen Ejecutivo

Sistema de prueba gratuita para usuarios que acceden mediante QR → `/conferencia`. Solo necesitan nombre, email y contraseña. Acceso automático a 3 sesiones sin onboarding.

---

## 📋 Checklist de Implementación

### Base de Datos
- [ ] Campo `is_trial_user BOOLEAN` en tabla `parents`
- [ ] Función RPC `auto_verify_trial_user(UUID)` creada
- [ ] Permisos GRANT EXECUTE en función RPC

### Frontend
- [ ] Página `src/pages/Conferencia.tsx` creada
- [ ] Ruta `/conferencia` en `App.tsx`
- [ ] `Login.tsx` detecta `is_trial_user`
- [ ] `ParentsProfile.tsx` redirige trial users
- [ ] `ChildProfile.tsx` redirige trial users

---

## 🔄 Flujo Rápido

```
QR → /conferencia → Formulario → signUp() → auto-verify → signIn() → upsert(parents) → /home
```

---

## 🔙 Revertir (Comandos Rápidos)

```sql
-- 1. Eliminar campo
ALTER TABLE public.parents DROP COLUMN IF EXISTS is_trial_user;

-- 2. Eliminar función
DROP FUNCTION IF EXISTS public.auto_verify_trial_user(UUID);
```

```bash
# 3. Eliminar archivo
rm src/pages/Conferencia.tsx
```

Luego revertir cambios en: `App.tsx`, `Login.tsx`, `ParentsProfile.tsx`, `ChildProfile.tsx`

---

## 🐛 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| 403 Forbidden | Usuario no autenticado | Hacer `signIn()` antes de `upsert()` |
| 400 null email | Falta campo email | Añadir `email` al insert |
| 409 Conflict | Registro ya existe | Usar `upsert` en lugar de `insert` |

---

**Ver documentación completa:** `CONFIGURACION_TRIAL_USERS.md`

