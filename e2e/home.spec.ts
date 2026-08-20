import { test, expect } from "@playwright/test";

test("landing page shows hero and auth actions", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Turn Your Trading History Into Measurable Improvement/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start Trading Journal" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
});
