import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Nisarg's TradeLab" }),
  ).toBeVisible();
  await expect(page.getByText("Track. Analyze. Improve.")).toBeVisible();
});
