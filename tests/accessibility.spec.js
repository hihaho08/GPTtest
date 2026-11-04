import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function checkAccessibility(page) {
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator("dialog")
    .evaluateAll((elements) =>
      Promise.all(
        elements.flatMap((element) =>
          element.getAnimations().map((animation) => animation.finished),
        ),
      ),
    );
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
}

test("desktop page has no automatic WCAG A/AA violations", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await checkAccessibility(page);
});

test("appointment dialog has accessible labels and readable text", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.getByRole("button", { name: "Randevu Alın", exact: true }).click();
  await checkAccessibility(page);
});

test("mobile page and open navigation pass automatic WCAG checks", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await checkAccessibility(page);
  await page.getByRole("button", { name: "Menüyü aç", exact: true }).click();
  await checkAccessibility(page);
});
