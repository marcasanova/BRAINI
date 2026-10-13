---
name: run-tests
description: >-
  Decides and runs the right Braini test commands (Vitest, Playwright smoke,
  verify, coverage). Use when running tests, fixing failing suites, pre-push
  checks, ejecución completa, vitest, playwright, smoke, or coverage.
---

# Run tests

## Cuándo aplicar

Tras cambios de código, al pedir “ejecutar tests”, “verify”, smoke E2E, cobertura, o al interpretar fallos de la suite.

## Escalado de comandos

| Situación | Comando |
|-----------|---------|
| Cambio de módulo con `.test.ts(x)` | `npm run test:run` (o filtro Vitest del archivo) |
| Rutas, auth, guards, redirects legacy | `npm run test:e2e:smoke` |
| Ejecución completa / pre-push | `npm run verify` (+ smoke si tocó router/guards) |
| Cobertura | `npm run test:coverage` |

```sh
npm run test:run           # Vitest una pasada
npm run test:e2e:smoke     # Playwright smoke
npm run verify             # lint + test:run + build
npm run test:coverage      # cobertura v8
```

## Paths

- Unit/integración: `src/**/*.test.ts(x)` junto al código
- Infra: `tests/setup/` (Vitest, MSW, test-utils), `tests/fixtures/`
- E2E smoke: `tests/e2e/smoke/` · config `tests/e2e/playwright.config.ts`

## Reglas

- Corregir fallos antes de dar la tarea por terminada.
- E2E autenticado es opcional y requiere `.env.test` (plantilla `.env.test.example`). **No inventar** email/contraseña.
- Smoke por defecto = rutas públicas, redirects y guards sin sesión.
- Detalle largo solo si hace falta: `docs/11-TESTING-Y-CALIDAD.md`.

## Checklist

1. ¿Qué capa tocó el cambio? (unit vs rutas/auth vs gate completo)
2. ¿Se ejecutó el comando mínimo suficiente?
3. ¿Fallos reproducidos y corregidos?
