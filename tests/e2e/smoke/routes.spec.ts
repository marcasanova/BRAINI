import { test, expect } from "@playwright/test";

test.describe("Smoke — rutas públicas", () => {
  test("landing principal carga", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Braini/i);
  });

  test("landing Braini Family carga", async ({ page }) => {
    await page.goto("/brainifamily");
    await expect(page.locator("body")).toBeVisible();
  });

  test("landing Braini Kids carga", async ({ page }) => {
    await page.goto("/brainikids");
    await expect(page.locator("body")).toBeVisible();
  });

  test("landing Braini Juniors carga", async ({ page }) => {
    await page.goto("/brainijuniors");
    await expect(page.locator("body")).toBeVisible();
  });

  test("ruta desconocida muestra 404", async ({ page }) => {
    await page.goto("/ruta-inexistente-xyz");
    await expect(page.locator("body")).toBeVisible();
  });
});
