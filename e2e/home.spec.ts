import { test, expect } from "@playwright/test";

test("landing page shows auth actions", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Nisarg's TradeLab" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Create account" }),
  ).toBeVisible();
});
