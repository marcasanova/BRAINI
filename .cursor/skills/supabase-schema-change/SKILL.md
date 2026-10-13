---
name: supabase-schema-change
description: >-
  Proposes Supabase schema changes after reading live MCP state: SQL for
  tables, RLS, RPC, triggers. Use when changing the database, schema,
  migrations, ALTER TABLE, policies, RLS, RPC, or BDD/Supabase structure.
---

# Supabase schema change

## Cuándo aplicar

Cualquier cambio de esquema: tablas, columnas, enums, RLS/políticas, RPC, triggers, grants. El MCP es **solo lectura**; el agente propone, el humano ejecuta.

## Flujo obligatorio

1. **MCP vivo** — consultar tablas/columnas/RLS/RPC afectados (`read_only=true` en `.cursor/mcp.json`). No inventar nombres.
2. **Doc opcional** — 0–1 archivo (`docs/07-MODELO-DE-DATOS.md` o `docs/10-BACKEND-SUPABASE.md`) solo si el MCP no basta. Si hay duda, **gana el remoto**.
3. **Plan** — en lenguaje natural: qué cambia, por qué, impacto en roles, Edge Functions y frontend (`queries/`, `rpc/`).
4. **SQL propuesto** — script completo con justificación breve por bloque (`CREATE` / `ALTER` / `DROP POLICY` / funciones, etc.).
5. **Parar** — esperar **OK explícito** del humano. No ejecutar SQL en remoto. **No crear** `supabase/migrations/`: el esquema se aplica en el dashboard de Supabase.
6. **Tras confirmación de ejecución** — listar follow-ups de código: `src/integrations/supabase/queries/`, `rpc/`, Edge en `supabase/functions/`.

## Gotchas

- Invitaciones: `director_invited` / `teacher_invited` / `parent_invited` — nunca `*_invites`.
- No recrear signup, waitlist ni flujos fuera de alcance v2.0.
- `service_role` solo en Edge Functions; la SPA usa anon + RLS.
- Super admin = `admin_emails`, no fila en `user_roles`.

## Formato de entrega al humano

```markdown
### Plan
- ...

### SQL propuesto
```sql
-- ...
```

### Por qué
- ...

### Impacto código (tras tu OK y ejecución)
- ...
```

No aplicar el SQL hasta que el humano confirme.
