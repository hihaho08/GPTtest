import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });

test("shows the original office contact information and precise map location", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Haklarınız için",
  );
  const contact = page.locator("#iletisim");
  await expect(contact.locator('a[href="tel:+905369234865"]')).toContainText(
    "0536 923 48 65",
  );
  await expect(
    contact.locator('a[href="mailto:av.aysegulcetinkaya@gmail.com"]'),
  ).toContainText("av.aysegulcetinkaya@gmail.com");
  const directions = contact.getByRole("link", { name: /Gakko Kervansaray/ });
  await expect(directions).toContainText(
    "Kat: 5, İç Kapı No: 63, İzmit / Kocaeli",
  );
  const map = new URL(await directions.getAttribute("href"));
  expect(map.hostname).toBe("www.google.com");
  expect(map.searchParams.get("query")).toBe("40.762877,29.921912");
  await expect(directions).toHaveAttribute("rel", /noopener/);
  await expect(contact).toContainText("Pazartesi – Cuma");
  await expect(contact).toContainText("10.00 – 18.00");
  await expect(
    page.getByRole("link", { name: "WhatsApp üzerinden iletişime geçin" }),
  ).toHaveAttribute("href", "https://wa.me/905369234865");
});

const serviceCases = [
  ["Ceza Hukuku", "Soruşturma ve kovuşturma"],
  ["Aile Hukuku", "Boşanma süreçleri"],
  ["Ticaret Hukuku", "Ticari sözleşmeler"],
  ["İş ve Çalışma Hukuku", "İşçi alacakları"],
  ["Gayrimenkul Hukuku", "Kira ilişkileri"],
  ["Miras Hukuku", "Vasiyetname hazırlanması"],
];

for (const [title, topic] of serviceCases) {
  test(`${title}: opens useful details and carries the chosen area into the appointment`, async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.locator(".services-grid").getByRole("button"),
    ).toHaveCount(6);
    await page
      .getByRole("button", {
        name: `${title} hakkında bilgi alın`,
        exact: true,
      })
      .click();
    const details = page.getByRole("dialog", { name: title, exact: true });
    await expect(details).toBeVisible();
    await expect(
      details.getByRole("listitem").filter({ hasText: topic }),
    ).toBeVisible();
    await details
      .getByRole("button", { name: "Bu konuda görüşmek istiyorum" })
      .click();
    const appointment = page.getByRole("dialog");
    await expect(
      appointment.getByLabel("Hangi konuda görüşmek istersiniz?"),
    ).toHaveValue(title);
    await expect(
      appointment.getByRole("button", { name: /WhatsApp ile randevu isteyin/ }),
    ).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });
}

test("Escape closes the service dialog, restores its trigger focus and allows page scrolling", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Ceza Hukuku hakkında bilgi alın",
    exact: true,
  });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  const scrollBeforeEscape = await page.evaluate(() => window.scrollY);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await page.mouse.move(500, 700);
  await page.mouse.wheel(0, 420);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(scrollBeforeEscape);
});

test("appointment opens the correct WhatsApp message without sending or storing the typed note", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__openedWindows = [];
    window.open = (...args) => {
      window.__openedWindows.push(args);
      return null;
    };
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Bir görüşmeyle başlayalım", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Hangi konuda görüşmek istersiniz?")
    .selectOption("Aile Hukuku");
  const note =
    "  Görüşmek istediğim konu: velayet & boşanma.\nTürkçe karakterler: ğ, ş, İ, ı.  ";
  const noteField = dialog.getByLabel(/Kısa bir not/);
  await noteField.fill(note);
  await dialog
    .getByRole("button", { name: /WhatsApp ile randevu isteyin/ })
    .click();
  const calls = await page.evaluate(() => window.__openedWindows);
  expect(calls).toHaveLength(1);
  const [destination, target, options] = calls[0];
  const whatsapp = new URL(destination);
  expect(whatsapp.origin + whatsapp.pathname).toBe(
    "https://wa.me/905369234865",
  );
  expect(whatsapp.searchParams.get("text")).toBe(
    `Merhaba, aile hukuku konusunda görüşme için randevu almak istiyorum.\n\n${note.trim()}`,
  );
  expect(target).toBe("_blank");
  expect(options).toBe("noopener,noreferrer");
  await expect(noteField).toHaveValue(note);
  await expect(dialog).toBeVisible();
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  expect(await page.context().cookies()).toEqual([]);
});

test("appointment cancellation restores focus to its original button", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Bir görüşmeyle başlayalım",
    exact: true,
  });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("FAQ expands real answers and keeps only the selected question open", async ({
  page,
}) => {
  await page.goto("/");
  const first = page
    .locator("details")
    .filter({
      has: page.locator("summary", {
        hasText: "İlk görüşmeye gelirken hangi belgeleri hazırlamalıyım?",
      }),
    });
  await expect(first.locator(".faq-answer")).not.toBeVisible();
  await first.locator("summary").click();
  await expect(first.locator(".faq-answer")).toBeVisible();
  await expect(first.locator(".faq-answer")).toContainText(
    "Kimlik belgenizle birlikte",
  );
  const fees = page
    .locator("details")
    .filter({
      has: page.locator("summary", {
        hasText: "Danışmanlık ve avukatlık ücreti nasıl belirlenir?",
      }),
    });
  await fees.locator("summary").click();
  await expect(fees.locator(".faq-answer")).toContainText(
    "avukatlık asgari ücret tarifesi",
  );
  await expect(fees.locator(".faq-answer")).toBeVisible();
  await expect(first.locator(".faq-answer")).not.toBeVisible();
});

test("privacy and legal information are readable dialogs with usable close controls", async ({
  page,
}) => {
  await page.goto("/");
  const privacyButton = page.getByRole("button", {
    name: "Gizlilik",
    exact: true,
  });
  await privacyButton.click();
  const privacy = page.getByRole("dialog", { name: "Gizliliğiniz önemli." });
  await expect(privacy).toBeVisible();
  await expect(privacy).toContainText("tarayıcıda kalıcı olarak saklanmaz");
  await expect(privacy).toContainText(
    "Mesaj, siz WhatsApp üzerinden göndermeden büromuza iletilmez.",
  );
  await privacy.getByRole("button", { name: "Pencereyi kapat" }).click();
  await expect(privacyButton).toBeFocused();
  await page
    .getByRole("button", { name: "Yasal bilgilendirme", exact: true })
    .click();
  const legal = page.getByRole("dialog", {
    name: "Yasal bilgilendirme",
    exact: true,
  });
  await expect(legal).toContainText("genel bilgilendirme amacı taşır");
  await expect(legal).toContainText(
    "tek başına avukat–müvekkil ilişkisi oluşturmaz",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("local image and Turkish web fonts load with no browser runtime or resource errors", async ({
  page,
}) => {
  const scriptErrors = [];
  const failedResources = [];
  page.on("pageerror", (error) => scriptErrors.push(error.message));
  page.on("requestfailed", (request) =>
    failedResources.push(
      `${request.method()} ${request.url()} ${request.failure()?.errorText}`,
    ),
  );
  page.on("response", (response) => {
    if (response.status() >= 400)
      failedResources.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      page
        .locator(".hero-image")
        .evaluate((image) => image.complete && image.naturalWidth > 0),
    )
    .toBe(true);
  const fontState = await page.evaluate(() => ({
    manrope: document.fonts.check(
      '400 16px "Manrope"',
      "Ayşegül Çetinkaya ĞğİıŞş",
    ),
    cormorant: document.fonts.check(
      '400 16px "Cormorant Garamond"',
      "Ayşegül Çetinkaya ĞğİıŞş",
    ),
    loadedFontFamilies: [...document.fonts]
      .filter((font) => font.status === "loaded")
      .map((font) => font.family),
    requestedFonts: performance
      .getEntriesByType("resource")
      .filter((entry) => /\.woff2?(?:\?|$)/.test(entry.name))
      .map((entry) => entry.name),
  }));
  expect(fontState.manrope).toBe(true);
  expect(fontState.cormorant).toBe(true);
  expect(fontState.loadedFontFamilies.join(" ")).toContain("Manrope");
  expect(fontState.loadedFontFamilies.join(" ")).toContain(
    "Cormorant Garamond",
  );
  expect(fontState.requestedFonts.length).toBeGreaterThan(0);
  expect(scriptErrors).toEqual([]);
  expect(failedResources).toEqual([]);
});

for (const width of [320, 390, 768, 1440]) {
  test(`page and appointment remain within a ${width}px viewport`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const pageWidth = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(pageWidth.content).toBeLessThanOrEqual(pageWidth.viewport + 1);
    await page
      .getByRole("button", { name: "Bir görüşmeyle başlayalım", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const bounds = await dialog.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
    await expect(
      dialog.getByLabel("Hangi konuda görüşmek istersiniz?"),
    ).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Pencereyi kapat" }),
    ).toBeVisible();
  });
}

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, follows an actual section anchor, and closes on Escape with focus restored", async ({
    page,
  }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menüyü aç", exact: true });
    await toggle.click();
    await expect(
      page.getByRole("button", { name: "Menüyü kapat", exact: true }),
    ).toHaveAttribute("aria-expanded", "true");
    const navigation = page.getByRole("navigation", { name: "Mobil gezinme" });
    await expect(navigation).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await navigation.locator('a[href="#calisma-alanlari"]').click();
    await expect(page).toHaveURL(/#calisma-alanlari$/);
    await expect(navigation).toHaveCount(0);
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    await expect(page.locator("#services-title")).toBeInViewport();
    await page.getByRole("button", { name: "Menüyü aç", exact: true }).click();
    await page.keyboard.press("Escape");
    const closedToggle = page.getByRole("button", {
      name: "Menüyü aç",
      exact: true,
    });
    await expect(closedToggle).toHaveAttribute("aria-expanded", "false");
    await expect(closedToggle).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("can open appointment from the menu and returns page scrolling after closing it", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menüyü aç", exact: true }).click();
    await page
      .getByRole("navigation", { name: "Mobil gezinme" })
      .getByRole("button", { name: "Randevu Alın" })
      .click();
    await expect(
      page.getByRole("navigation", { name: "Mobil gezinme" }),
    ).toHaveCount(0);
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });
});
