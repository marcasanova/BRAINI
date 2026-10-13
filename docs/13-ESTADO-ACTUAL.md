# Estado actual — BRAINI

**Versión:** 3.1  
**Rama:** `develop` · **Fecha:** septiembre 2026

---

## 1. Resumen ejecutivo

BRAINI en `develop` es una SPA moderna (React 19, Vite 8, Tailwind 4, RR7) con dominio B2B invite-only operativo contra Supabase remoto. El frontend está reorganizado en capas (`app` / `products` / `shared` / `integrations`), con lazy routes, registry de actividades y suite de tests híbrida (Vitest + Playwright smoke).

---

## 2. Stack real (package.json)

| Dependencia | Versión |
|-------------|---------|
| React / React DOM | 19.3.0 |
| Vite | 8.3.0 |
| Tailwind CSS | 4.3.3 |
| React Router | 7.18.4 |
| TanStack React Query | 5.103.2 |
| @supabase/supabase-js | 2.117.1 |
| Vitest | 4.1.11 |
| Playwright | 1.63.0 |
| TypeScript | 5.9.3 |

**Node:** 20.19+ o 22.12+ (recomendado 22.x).

---

## 3. Modernización completada (commits develop)

| Fase | Commit | Entregable |
|------|--------|------------|
| 0 | `b4658c9` | Testing, docs versionadas, baseline |
| 1 | `f74bdd5` | Lazy routes, registry actividades, bundle |
| 2 | `a5a0d6a` | Limpieza Lovable, Sonner, poda deps |
| 3 | `49f117b` | Reorg `app/products/shared/integrations` |
| 4 | `e802e53` | Capa datos React Query + queries Supabase |
| 5 | `2acf557` | React 19 |
| 6 | `5276966` | Vite 8 |
| 7 | `5e03dd8` | Tailwind 4 |
| 8 | `964d912` | React Router 7 |
| 9 | `363ec01` | TS strict, ESLint, analyzer, QA E2E |
| Navbar | `6942819` | Navbar y landings portados desde `main` |

---

## 4. Supabase remoto (MCP julio 2026)

| Aspecto | Estado |
|---------|--------|
| Proyecto | `igwoavsazbycqmdweger` (eu-west-2) |
| Postgres | 17.4.1.064 |
| Tablas `public` | 19, todas con RLS |
| Edge Functions | 3 ACTIVE (`complete-*-invite`) |
| RPC negocio | 16+ funciones verificadas |

### Divergencias docs v2.0 → realidad remota

| Tema | Doc antiguo | Remoto actual |
|------|-------------|---------------|
| RLS progreso teacher/director | «Pendiente» | **Implementado** (`*_select_teacher`, `*_select_director`) |
| Validación email | `email_exists_in_platform` propuesto | **`email_platform_status`** existe |
| React en TDD | React 18 | **React 19** en repo |

---

## 5. Frontend — qué hay hoy

| Área | Estado |
|------|--------|
| Hub + landings Kids/Juniors/Family | ✓ con NavbarLandings |
| Login + recuperación contraseña | ✓ |
| Flujos invitación (director/teacher/parent) | ✓ vía Edge |
| Paneles admin, director, teacher | ✓ |
| App padre (misiones, actividades, diario, tests) | ✓ |
| Onboarding padre/hijo | ✓ |
| Multi-hijo (`CurrentChildProvider`) | ✓ |
| Redirects legacy | ✓ en router |
| Signup / waitlist / test-genius / conferencia | ✗ eliminados |

---

## 6. Testing — qué hay hoy

| Suite | Cantidad ref. | Comando |
|-------|---------------|---------|
| Unit/integración | 28 | `npm run test:run` |
| E2E smoke | 26 | `npm run test:e2e:smoke` |
| Gate | lint + test + build | `npm run verify` (verde; el lint deja avisos de hooks y fast refresh, sin errores) |

### Bundle (septiembre 2026, `npm run build`)

| Asset | Tamaño | gzip |
|-------|--------|------|
| index JS | 85 KB | 27 KB |
| vendor-react | 207 KB | 65 KB |
| vendor-supabase | 214 KB | 55 KB |
| vendor-radix | 88 KB | 28 KB |
| activities-puzzles (lazy) | 282 KB | 67 KB |

Baseline pre-optimización: index ~1.1 MB. Detalle en [11-TESTING-Y-CALIDAD](11-TESTING-Y-CALIDAD.md).

---

## 7. Gaps conocidos

| Prioridad | Gap | Impacto | Acción sugerida |
|-----------|-----|---------|-----------------|
| — | **Esquema solo en remoto** | Decisión de producto: SQL en dashboard, consulta MCP | No crear `supabase/migrations/` |
| Media | **Advisors Supabase** | `setup_child` ejecutable por anon; OTP largo; leaked passwords off | Checklist en la sección 12; aplicar en el dashboard |
| Baja | **Emails invitación automáticos** | Enlace manual | Fase futura |
| Baja | **Postgres patches** | Versión 17.4.1.064 con parches | Planificar upgrade Supabase |
| Baja | **E2E autenticado** | Solo smoke sin sesión por defecto | `.env.test` en staging |

---

## 8. Estructura repo vs objetivo

| Path | Estado |
|------|--------|
| `src/app/` | ✓ |
| `src/products/` | ✓ hub + 3 productos |
| `src/shared/` | ✓ |
| `src/integrations/supabase/` | ✓ |
| `supabase/functions/` | ✓ 3 Edge Functions (fuente a desplegar) |
| `supabase/migrations/` | No aplica (esquema en dashboard) |
| `docs/00–13` | ✓ narrativa nueva |
| `docs/README.md` | ✗ eliminado (solo README raíz) |

---

## 9. Despliegue

- **Frontend:** Vercel (SPA, `vercel.json`) — [https://www.brainiemotions.com/](https://www.brainiemotions.com/).
- **Backend:** Supabase Cloud (sin cambios desde este doc).
- **Rama develop:** 11+ commits por delante de `origin/develop` (push bajo petición explícita).

---

## 10. Próximos pasos sugeridos

1. Endurecer permisos RPC y Auth según la checklist de la sección 12.
2. E2E autenticado en staging para CA-PIPE-01 automatizado.
3. Emails transaccionales de invitación (fuera v2.0).

---

## 11. Documentación

La documentación v3.0 en `docs/00-INDICE.md` … `docs/13-ESTADO-ACTUAL.md` sustituye la numeración antigua (`00-VISION` … `09-CA`, `08-TDD`, `BASELINE`, `docs/README.md`).

Validación Supabase: MCP solo lectura en docs 05, 07, 08, 10 y este documento.

---

## 12. Checklist de seguridad (dashboard, manual)

**Obligatorio revisar en el Supabase Dashboard antes de cambiar el repo de GitHub a público.** El agente no aplica estos cambios: el esquema se edita en el dashboard y el MCP del repo es de solo lectura.

| Ítem | Dónde | Qué comprobar | Revisado |
|------|--------|----------------|----------|
| `GRANT EXECUTE` de `setup_child` | Database → Functions / SQL | El rol `anon` no debería poder ejecutar `setup_child`. Si el advisor lo marca, revocar ese grant. | |
| OTP y contraseñas filtradas | Authentication → Providers / Password | Longitud del OTP y protección de contraseñas filtradas (leaked password protection) según el advisor de Auth. | |
| Edge Functions | Edge Functions | `complete-director-invite`, `complete-teacher-invite` y `complete-parent-invite` en estado ACTIVE y alineadas con `supabase/functions/*/index.ts`. Si el dashboard y el repo divergen, republicar el código del repo. | |
| Secretos en git | Repo | `.env` no trackeado; sin `service_role` en el código; ver [SECURITY.md](../SECURITY.md) y [LICENSE](../LICENSE). | Repo preparado (sept 2026) |
| Privacidad en UI | App | PDF enlazado desde landings/login; checkbox de aceptación en invites. | Hecho en código (sept 2026) |

Fecha de revisión dashboard Auth/RPC: _pendiente (humano)_.

Tras completar las filas Auth/RPC/Edge: push → GitHub Settings → Change visibility → Public.

