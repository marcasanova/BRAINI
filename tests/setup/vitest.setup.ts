import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./msw/server";

// Node ≥ 25 trae un localStorage/sessionStorage global que, sin --localstorage-file, no funciona
// y tapa el de jsdom. Usamos el de la ventana de jsdom para que los tests vean el del navegador.
const jsdomWindow = (globalThis as { jsdom?: { window: Window } }).jsdom?.window;
if (jsdomWindow) {
  for (const key of ["localStorage", "sessionStorage"] as const) {
    Object.defineProperty(globalThis, key, { configurable: true, value: jsdomWindow[key] });
  }
}

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
