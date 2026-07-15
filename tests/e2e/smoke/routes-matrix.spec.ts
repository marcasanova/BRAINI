import { test, expect } from "@playwright/test";

const PUBLIC_ROUTES = [
  { path: "/", title: /Braini/i },
  { path: "/brainikids" },
  { path: "/brainijuniors" },
  { path: "/brainifamily" },
  { path: "/brainifamily/login" },
  { path: "/brainifamily/update-password" },
  { path: "/brainifamily/invite/director" },
  { path: "/brainifamily/invite/teacher" },
  { path: "/brainifamily/invite/parent" },
] as const;

const REMOVED_ROUTES = ["/test-genius", "/conferencia", "/waitlist"];

test.describe("Smoke — matriz de rutas públicas", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.path} responde sin error`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator("body")).toBeVisible();
      if ("title" in route && route.title) {
        await expect(page).toHaveTitle(route.title);
      }
    });
  }

  for (const path of REMOVED_ROUTES) {
    test(`${path} no es una ruta de producto (404 o sin contenido legacy)`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("body")).toBeVisible();
      const legacyMarkers = ["test genius", "conferencia"];
      const bodyText = (await page.locator("body").innerText()).toLowerCase();
      for (const marker of legacyMarkers) {
        expect(bodyText).not.toContain(marker);
      }
    });
  }

  test("rutas protegidas sin auth redirigen a login", async ({ page }) => {
    const protectedPaths = [
      "/brainifamily/home",
      "/brainifamily/admin",
      "/brainifamily/director",
      "/brainifamily/teacher",
    ];

    for (const path of protectedPaths) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/brainifamily\/login/);
    }
  });
});
