# Baseline de rendimiento — Fase 0

**Fecha:** 2026-07-15  
**Rama:** develop  
**Node:** 22.17.0

## Bundle (pre-optimización)

| Asset | Tamaño aprox. |
|-------|----------------|
| `dist/assets/index-*.js` | ~1.1 MB |
| `dist/assets/index-*.css` | ~120 KB |
| `dist/` total | ~9.3 MB |

## Objetivos del plan

- JS bundle inicial: < 400 KB (sin gzip)
- Lazy routes + lazy puzzles en ActivityDetail
- Gate pre-push: `npm run verify` + `npm run test:e2e:smoke`
