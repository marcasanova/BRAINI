import { test, expect } from "@playwright/test";

test.describe("Smoke — legacy redirects", () => {
  test("/login redirige a /brainifamily/login", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/brainifamily\/login/);
  });

  test("/home redirige a /brainifamily/home (y sin auth a login)", async ({ page }) => {
    await page.goto("/home");
    await expect(page).toHaveURL(/\/brainifamily\/login/);
  });

  test("/signup redirige a /brainifamily/login", async ({ page }) => {
    await page.goto("/signup");
    await expect(page).toHaveURL(/\/brainifamily\/login/);
  });

  test("/profile redirige a ruta protegida (login sin auth)", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/brainifamily\/login/);
  });

  test("/parents-profile redirige a login sin auth", async ({ page }) => {
    await page.goto("/parents-profile");
    await expect(page).toHaveURL(/\/brainifamily\/login/);
  });

  test("/test-tmms-padres redirige a ruta brainifamily", async ({ page }) => {
    await page.goto("/test-tmms-padres");
    await expect(page).toHaveURL(/\/brainifamily\/login/);
  });
});
