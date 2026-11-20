import { expect, test } from "@playwright/test";

test.describe("navigation", () => {
  test("header links reach every page and mark the current one", async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      "Desktop header only; the mobile menu has its own test.",
    );
    await page.goto("/");
    for (const [label, path, heading] of [
      ["Work", "/work", "Selected work"],
      ["About", "/about", "About me"],
      ["Resume", "/resume", "Sam Mugabo"],
      ["Contact", "/contact", "Let’s talk"],
    ] as const) {
      await page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: label })
        .click();
      await expect(page).toHaveURL(path);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        heading,
      );
      const current = page
        .getByRole("navigation", { name: "Primary" })
        .locator('a[aria-current="page"]');
      await expect(current).toHaveText(label);
    }
  });

  test("mobile menu opens, traps focus, closes on Escape and navigates", async ({
    page,
    isMobile,
  }) => {
    test.skip(
      !isMobile,
      "The menu button exists only below the md breakpoint.",
    );
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    // Focus cannot leave a modal dialog.
    for (let i = 0; i < 8; i += 1) await page.keyboard.press("Tab");
    expect(
      await page.evaluate(
        () => document.activeElement?.closest("dialog") !== null,
      ),
    ).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();

    await toggle.click();
    await dialog.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL("/about");
    await expect(dialog).toBeHidden();
  });

  test("skip link is first and moves focus to main", async ({ page }) => {
    await page.goto("/about");
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    expect(await page.evaluate(() => document.activeElement?.id)).toBe("main");
  });
});

test.describe("hero API card", () => {
  test("tabs switch endpoints with the keyboard", async ({ page }) => {
    await page.goto("/");
    const whoami = page.getByRole("tab", { name: "whoami" });
    await expect(whoami).toHaveAttribute("aria-selected", "true");
    await whoami.focus();
    await page.keyboard.press("ArrowRight");
    const stack = page.getByRole("tab", { name: "stack" });
    await expect(stack).toBeFocused();
    await expect(stack).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("/api/sam/stack");
    await expect(page.getByRole("tabpanel")).toContainText('"backend"');
    await page.keyboard.press("End");
    await expect(page.getByRole("tabpanel")).toContainText("/api/sam/now");
  });

  test("the endpoints it shows are real", async ({ request }) => {
    for (const [path, key] of [
      ["/api/sam", "name"],
      ["/api/sam/stack", "backend"],
      ["/api/sam/now", "role"],
    ] as const) {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("application/json");
      expect(Object.keys(await response.json())).toContain(key);
    }
  });

  test("the email can be copied", async ({ browser, browserName }) => {
    test.skip(
      browserName !== "chromium",
      "Clipboard permissions are Chromium-only.",
    );
    const context = await browser.newContext({
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const page = await context.newPage();
    await page.goto("/");
    const contact = page.locator("#contact");
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

test.describe("work", () => {
  test("filters narrow the list and live in the URL", async ({ page }) => {
    await page.goto("/work");
    const rows = page.locator("#case-studies-title + div ul.grid > li");
    await expect(rows).toHaveCount(6);

    await page.getByRole("button", { name: /^Mobile/ }).click();
    await expect(rows).toHaveCount(2);
    await expect(page).toHaveURL(/category=mobile/);
    await expect(page.getByRole("button", { name: /^Mobile/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.goto("/work?category=backend");
    await expect(
      page.getByRole("button", { name: /^Backend/ }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(rows).toHaveCount(2);

    await page.getByRole("button", { name: /^All/ }).click();
    await expect(rows).toHaveCount(6);
    await expect(page).toHaveURL("/work");
  });

  test("case studies render and link to each other", async ({ page }) => {
    await page.goto("/work/malaria-check");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "MalariaCheck",
    );
    await expect(page.locator("pre.shiki").first()).toBeVisible();
    await expect(
      page.getByRole("img", { name: /MalariaCheck assessment/ }),
    ).toBeVisible();

    await page
      .getByRole("navigation", { name: "More case studies" })
      .getByRole("link", { name: /Next case study/ })
      .click();
    await expect(page).toHaveURL("/work/eucl-internship");
    await expect(page.getByText("Internal software, not public")).toBeVisible();
  });

  test("unknown slug shows the 404 page", async ({ page }) => {
    const response = await page.goto("/work/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "This page doesn’t exist",
    );
    await page.getByRole("link", { name: "Go to the home page" }).click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("contact", () => {
  test("shows inline errors, then success, with the API mocked", async ({
    page,
  }) => {
    await page.route("**/api/contact", async (route) => {
      const body = route.request().postDataJSON() as { email?: string };
      if (body.email === "nope@example.com") {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            ok: false,
            error: "Please check the highlighted fields.",
            fields: { email: "Server rejected this address." },
          }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/contact");
    const form = page.locator("form");
    if ((await form.count()) === 0) {
      test.skip(
        true,
        "Form is disabled until RESEND_API_KEY is configured; the email fallback is shown instead.",
      );
    }

    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByLabel("Name")).toBeFocused();

    await page.getByLabel("Name").fill("Test Person");
    await page.getByLabel("Email").fill("nope@example.com");
    await page
      .getByLabel("Message")
      .fill("This is a message that is long enough to pass validation.");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Server rejected this address.")).toBeVisible();

    await page.getByLabel("Email").fill("person@example.com");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("Thank you");
  });

  test("without a form, the email address is offered", async ({ page }) => {
    await page.goto("/contact");
    await expect(
      page.getByRole("link", { name: "popesir112@gmail.com" }).first(),
    ).toBeVisible();
  });
});

test.describe("motion and fallbacks", () => {
  test("reduced motion disables smooth scroll and keeps every section", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForTimeout(1500);
    expect(await page.locator("canvas").count()).toBe(0);
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains("lenis"),
      ),
    ).toBe(false);
    // Every section is still there and readable.
    for (const id of [
      "hero",
      "work",
      "principles",
      "experience",
      "toolkit",
      "contact",
    ]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    await context.close();
  });

  test("home page is complete without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "I build the APIs",
    );
    // The hero's API response is server-rendered.
    await expect(page.getByRole("tabpanel")).toContainText('"Sam Mugabo"');
    await expect(page.locator("#work article")).toHaveCount(5);
    await expect(
      page.getByRole("heading", { name: "Public repositories" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "A year on GitHub" }),
    ).toBeVisible();
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
      for (const path of [
        "/",
        "/work",
        "/work/zunga",
        "/about",
        "/resume",
        "/contact",
      ]) {
        await page.goto(path);
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
