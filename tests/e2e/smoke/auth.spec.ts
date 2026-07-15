import { test, expect } from "@playwright/test";

test.describe("Smoke — auth redirect", () => {
  test("/brainifamily/home sin auth redirige a login", async ({ page }) => {
    await page.goto("/brainifamily/home");
    await expect(page).toHaveURL(/\/brainifamily\/login/);
  });

  test("/brainifamily/login carga formulario", async ({ page }) => {
    await page.goto("/brainifamily/login");
    await expect(page.locator("body")).toBeVisible();
  });
});
