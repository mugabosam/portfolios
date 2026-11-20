import { expect, type Page, test } from "@playwright/test";

/** Waits for the intro curtain to lift, so the page underneath is usable. */
async function ready(page: Page, path = "/") {
  await page.goto(path);
  await expect(page.locator(".intro")).toBeHidden({ timeout: 6000 });
}

test.describe("one-page navigation", () => {
  test("header links scroll to each section and mark it current", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Desktop header only; the menu has its own test.");
    await ready(page);
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const [label, heading] of [
      ["Work", "#work-title"],
      ["About", "#about-title"],
      ["Experience", "#experience-title"],
      ["Contact", "#contact-title"],
    ] as const) {
      await nav.getByRole("link", { name: label }).click();
      await expect(page.locator(heading)).toBeInViewport();
      await expect(nav.getByRole("link", { name: label })).toHaveAttribute(
        "aria-current",
        "true",
      );
    }
  });

  test("from another page, a header link opens its section", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Desktop header only.");
    await page.goto("/resume");
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL("/#about");
    await expect(page.locator("#about-title")).toBeInViewport();
  });

  test("mobile menu traps focus, closes on Escape and scrolls to a section", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "The menu button exists only below md.");
    await ready(page);
    const toggle = page.getByRole("button", { name: "Menu" });
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 5; i += 1) await page.keyboard.press("Tab");
    expect(
      await page.evaluate(
        () => document.activeElement?.closest("dialog") !== null,
      ),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();

    await toggle.click();
    await dialog.getByRole("link", { name: "Experience" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.locator("#experience-title")).toBeInViewport();
  });

  test("old page addresses land on their section", async ({ page }) => {
    for (const [from, to] of [
      ["/work", "/#work"],
      ["/work/zunga", "/#work"],
      ["/about", "/#about"],
      ["/contact", "/#contact"],
    ] as const) {
      await page.goto(from);
      await expect(page).toHaveURL(to);
    }
  });

  test("skip link is first and moves focus to main", async ({ page }) => {
    await page.goto("/resume");
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    expect(await page.evaluate(() => document.activeElement?.id)).toBe("main");
  });

  test("the header stays readable on blue sections", async ({ page }) => {
    await ready(page);
    await page.evaluate(() =>
      document.getElementById("work")!.scrollIntoView(),
    );
    await expect(page.locator(".site-header")).toHaveAttribute(
      "data-tone",
      "blue",
    );
    // The logo mark turns white on blue.
    const fill = await page
      .locator(".site-header .logo-mark rect")
      .first()
      .evaluate((el) => getComputedStyle(el).fill);
    expect(fill).toBe("rgb(255, 255, 255)");
  });
});

test.describe("hero", () => {
  test("the intro plays once per visit", async ({ page }) => {
    await page.goto("/");
    const intro = page.locator(".intro");
    await expect(intro).toHaveCount(1);
    await expect(intro).toBeHidden({ timeout: 6000 });
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-intro", "seen");
    await expect(page.locator(".intro")).toBeHidden();
  });

  test("says who Sam is and leads to the work", async ({ page }) => {
    await ready(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "I build web and mobile apps, front to back.",
    );
    await page.getByRole("link", { name: "View work" }).click();
    await expect(page.locator("#work-title")).toBeInViewport();
  });
});

test.describe("assistant", () => {
  const ask = async (page: Page, text: string) => {
    const input = page.getByRole("textbox").first();
    await input.fill(text);
    await input.press("Enter");
  };
  const log = (page: Page) => page.getByRole("log", { name: "Conversation" });

  test("opens with a short conversation", async ({ page }) => {
    await ready(page);
    await expect(log(page)).toContainText("What does Sam do?");
    await expect(log(page)).toContainText("Is he open to new roles?");
  });

  test("hands over the CV when asked", async ({ page }) => {
    await ready(page);
    const download = page.waitForEvent("download");
    await ask(page, "cv");
    expect((await download).suggestedFilename()).toBe("resume.pdf");
    await expect(log(page)).toContainText("Here is Sam's CV");
  });

  test("answers questions in plain words", async ({ page }) => {
    await ready(page);
    await ask(page, "Where is he based?");
    await expect(log(page)).toContainText("Kigali, Rwanda");
    await ask(page, "What did he study?");
    await expect(log(page)).toContainText("University of Rwanda");
    await ask(page, "something unrelated");
    await expect(log(page)).toContainText("I don't have an answer");
  });

  test("walks through a message to Sam", async ({ page }) => {
    await ready(page);
    await ask(page, "contact");
    await expect(log(page)).toContainText("What's your name?");
    await ask(page, "Test Person");
    await expect(log(page)).toContainText("Which email");
    await ask(page, "not-an-email");
    await expect(log(page)).toContainText("doesn't look right");
    await ask(page, "person@example.com");
    await expect(log(page)).toContainText("And your message?");
    await ask(page, "We would like to talk about a frontend role.");
    await expect(log(page)).toContainText("Shall I send it?");
    await expect(log(page)).toContainText("person@example.com");
    await ask(page, "cancel");
    await expect(log(page)).toContainText("Nothing was sent");
  });

  test("opens a project summary", async ({ page }) => {
    await ready(page);
    await page
      .getByRole("list", { name: "Suggestions" })
      .getByRole("link", { name: "Projects" })
      .click();
    const zunga = log(page).getByRole("button", { name: "Zunga" });
    // Keyboard, so nothing scrolls the page (which moves the hero scene).
    await expect(zunga).toBeInViewport({ ratio: 1 });
    await zunga.focus();
    await page.keyboard.press("Enter");
    const sheet = page.getByRole("dialog", { name: "Zunga" });
    await expect(sheet).toBeVisible();
    await expect(sheet).toContainText("The problem");
    await sheet.getByRole("button", { name: "Back to the projects" }).click();
    await expect(sheet).toBeHidden();
  });
});

test.describe("work", () => {
  test("every project is a plain summary with no code", async ({ page }) => {
    await ready(page);
    await expect(page.locator("#work article")).toHaveCount(6);
    expect(await page.locator("pre, code").count()).toBe(0);
  });

  test("a card opens its details and Escape closes them", async ({ page }) => {
    await ready(page);
    // The last card: in the stacked deck no other card ever covers it.
    const button = page.getByRole("button", {
      name: "See the details: Inventory Pro",
    });
    // Cards fade in as they arrive (hidden until then, so not yet a
    // "button" to the accessibility tree): scroll first, then wait.
    await page
      .locator('[data-open-project="inventory-pro"]')
      .evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect(button).toBeVisible();
    await button.click();
    const sheet = page.getByRole("dialog", { name: "Inventory Pro" });
    await expect(sheet).toBeVisible();
    await expect(sheet).toContainText("What I built");
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(button).toBeFocused();
  });
});

test.describe("contact", () => {
  test("the email can be copied", async ({ browser, browserName }) => {
    test.skip(
      browserName !== "chromium",
      "Clipboard permissions are Chromium-only.",
    );
    const context = await browser.newContext({
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const page = await context.newPage();
    await ready(page);
    const contact = page.locator("#contact");
    // Its content fades in once scrolled into view.
    await contact.scrollIntoViewIfNeeded();
    await contact.getByRole("button", { name: "Copy" }).click();
    await expect(contact.getByRole("status")).toHaveText(
      "Email address copied",
    );
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      "popesir112@gmail.com",
    );
    await context.close();
  });
});

test.describe("motion and fallbacks", () => {
  test("reduced motion: no intro, no smooth scroll, every section", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForTimeout(1500);
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains("lenis"),
      ),
    ).toBe(false);
    await expect(page.locator(".intro")).toBeHidden();
    for (const id of ["hero", "work", "about", "experience", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    // The hero is one screen tall: no scroll scene.
    expect(
      await page
        .locator("#hero")
        .evaluate((el) => el.getBoundingClientRect().height),
    ).toBeLessThanOrEqual(800);
    await context.close();
  });

  test("the page is complete without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "I build web and mobile apps",
    );
    await expect(page.getByRole("log")).toContainText("What does Sam do?");
    await expect(page.locator("#work article")).toHaveCount(6);
    for (const name of ["About me", "Experience", "Have something to build?"])
      await expect(page.getByRole("heading", { name })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await context.close();
  });

  test("no horizontal overflow at common viewports", async ({ browser }) => {
    const viewports: [number, number][] = [
      [360, 740],
      [390, 844],
      [768, 1024],
      [1280, 800],
      [1440, 900],
      [1920, 1080],
    ];
    for (const [width, height] of viewports) {
      const context = await browser.newContext({
        viewport: { width, height },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      for (const path of ["/", "/resume"]) {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
      await context.close();
    }
  });
});
