---
name: invite-onboarding
description: >-
  Pipeline B2B de invitaciones y alta de usuarios en BrainiFamily (director,
  teacher, parent). Use when working on invites, tokens, complete-*-invite Edge
  Functions, onboarding, alta de usuarios, director_invited, teacher_invited,
  parent_invited, or invite links.
---

# Invite onboarding

## Cuándo aplicar

Cualquier cambio en invitaciones, tokens UUID, Edge `complete-*-invite`, paneles que generan enlaces, o pantallas `/brainifamily/invite/*`.

## Pipeline

```
super_admin → invita director
director    → invita teacher
teacher     → crea clase + niño → invita padre
padre       → onboarding → app
```

Super admin no se invita: email en `admin_emails`.

## Tablas y naming

- `director_invited`, `teacher_invited`, `parent_invited` — **nunca** `*_invites`.
- Token UUID; caducidad típica 15 días.
- Estados de invitación: pendiente → `completed` (y manejo de expirados/usados).

## Código canónico

| Pieza | Ruta |
|-------|------|
| Edge director | `supabase/functions/complete-director-invite/` |
| Edge teacher | `supabase/functions/complete-teacher-invite/` |
| Edge parent | `supabase/functions/complete-parent-invite/` |
| Cliente Edge | `src/integrations/supabase/edge/invites.ts` |
| RPC invites | `src/integrations/supabase/rpc/invites.ts` |
| Errores invite | `src/integrations/supabase/lib/inviteErrors.ts` |
| UI invite | `src/products/brainifamily/pages/invite/` |

Rutas UI: `/brainifamily/invite/director|teacher|parent?token=...`

## Flujo Edge (director / teacher)

1. Cliente: `preview` + token → RPC `get_*_invite_by_token`.
2. Usuario: nombre + contraseña (mín. 6).
3. Cliente: `complete` → Edge `auth.admin.createUser` → RPC `complete_*_invite`.
4. Si RPC falla: rollback `deleteUser`.
5. Redirección a `/brainifamily/login`.

## Parent: ramas

- Usuario nuevo: crear Auth + vincular al `child`.
- Padre ya existente: puede vincular **otro hijo** (multi-hijo); no reinventar signup.

Detalle: `docs/06-FLUJOS-ONBOARDING-E-INVITACIONES.md`, `docs/10-BACKEND-SUPABASE.md`.

## Prohibido

- Signup público, waitlist, `signUp` en el cliente.
- Emails transaccionales automáticos (fuera de alcance v2.0; enlace manual).
- Inventar tablas/RPC sin contrastar MCP o docs 06/10.

## Checklist rápido

1. ¿El token se valida en preview antes de complete?
2. ¿Service role solo en Edge?
3. ¿Naming `*_invited`?
4. ¿Tras complete, el rol y la fila de dominio (`directors` / `teachers` / `parents`) quedan coherentes?
