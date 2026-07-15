# Baseline de rendimiento — Fase 0

**Fecha:** 2026-07-15  
**Rama:** develop  
**Node:** 22.17.0

## Bundle (post Fase 1 — lazy routes + registry)

| Asset | Tamaño aprox. |
|-------|----------------|
| `dist/assets/index-*.js` | ~107 KB |
| `dist/assets/vendor-react-*.js` | ~143 KB |
| `dist/assets/vendor-supabase-*.js` | ~173 KB |
| `dist/assets/vendor-radix-*.js` | ~142 KB |
| `dist/assets/activities-puzzles-*.js` | ~211 KB (lazy) |
| `dist/assets/index-*.css` | ~120 KB |

**Baseline Fase 0:** index JS ~1.1 MB monolítico.

## Objetivos del plan

- JS bundle inicial: < 400 KB (sin gzip)
- Lazy routes + lazy puzzles en ActivityDetail
- Gate pre-push: `npm run verify` + `npm run test:e2e:smoke`
