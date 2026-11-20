import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/resume", "/this-page-does-not-exist"];

for (const route of routes) {
  test(`${route} has no axe violations`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(route);
    // Let finite, time-based animations (the hero card's entrance) settle so
    // contrast is measured at rest. Infinite ones (the live status dot) and
    // scroll-driven ones (header, timeline line) never finish.
    await page.evaluate(() =>
      Promise.allSettled(
        document
          .getAnimations()
          .filter(
            (animation) =>
              animation.timeline instanceof DocumentTimeline &&
              animation.effect?.getTiming().iterations !== Infinity,
          )
          .map((animation) => animation.finished),
      ),
    );

    const { violations } = await new AxeBuilder({ page })
      .withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22aa",
        "best-practice",
      ])
      .analyze();

    const summary = violations.map(
      (v) =>
        `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`,
    );
    expect(summary).toEqual([]);
  });
}

test("mobile menu has no axe violations when open", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "The menu button only exists below the md breakpoint.");
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();

  const { violations } = await new AxeBuilder({ page })
    .withTags([
      "wcag2a",
      "wcag2aa",
      "wcag21a",
      "wcag21aa",
      "wcag22aa",
      "best-practice",
    ])
    .analyze();
  expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});

test("project details sheet has no axe violations", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");
  await expect(page.locator(".intro")).toBeHidden({ timeout: 6000 });
  const button = page.getByRole("button", {
    name: "See the details: Inventory Pro",
  });
  await page
    .locator('[data-open-project="inventory-pro"]')
    .evaluate((el) => el.scrollIntoView({ block: "center" }));
  await expect(button).toBeVisible();
  await button.click();
  await expect(
    page.getByRole("dialog", { name: "Inventory Pro" }),
  ).toBeVisible();
  await page.waitForTimeout(600);

  const { violations } = await new AxeBuilder({ page })
    .include(".project-sheet")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});
