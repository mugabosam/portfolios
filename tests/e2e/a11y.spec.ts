import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/work",
  "/work/malaria-check",
  "/work/eucl-internship",
  "/about",
  "/resume",
  "/contact",
  "/contact/sent",
  "/contact/error",
  "/styleguide",
  "/this-page-does-not-exist",
];

for (const route of routes) {
  test(`${route} has no axe violations`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(route);
    // Let finite animations (preloader demo, reveals) settle so contrast is
    // measured at rest. Infinite ones (scroll cue, orbit) never finish.
    await page.evaluate(() =>
      Promise.allSettled(
        document
          .getAnimations()
          .filter(
            (animation) =>
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
