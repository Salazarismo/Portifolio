import { expect, test } from "@playwright/test";

// --- HERO: a tese é o único <h1> da página (contrato do semantics-gate).
// Conta-se "main h1": o dev toolbar do Astro injeta h1 em shadow DOM que o
// locator atravessa; no build, o semantics-gate cobra a contagem global. ---
test("PT home: o único H1 é a tese", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main h1")).toHaveCount(1);
  await expect(page.locator("#hero-thesis")).toContainText(
    "Eu construo o sistema que funciona quando nada mais funciona.",
  );
});

test("EN home: o único H1 é a tese", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator("main h1")).toHaveCount(1);
  await expect(page.locator("#hero-thesis")).toContainText(
    "I build the system that works when nothing else does.",
  );
});

// --- TOGGLE: troca a ênfase SEM reload, escrevendo data-mode no wrapper ---
test("toggle recrutador→cliente troca o modo sem navegar", async ({ page }) => {
  await page.goto("/");
  const root = page.locator("#home-root");
  await expect(root).toHaveAttribute("data-mode", "recruiter"); // default do SSR

  const clientRadio = page.getByRole("radio", { name: "Para clientes" });
  await clientRadio.scrollIntoViewIfNeeded();
  // client:visible: o clique só tem efeito depois da hidratação da island.
  await expect(async () => {
    await clientRadio.click();
    await expect(root).toHaveAttribute("data-mode", "client", { timeout: 500 });
  }).toPass();

  await expect(page).toHaveURL(/\/$/); // não navegou
  await expect(page.locator("#cta .hm-when-client")).toBeVisible();
  await expect(page.locator("#cta .hm-when-recruiter")).toBeHidden();
});

// --- TECLADO: o radiogroup do toggle anda por setas (roving tabindex) ---
test("toggle é operável por teclado", async ({ page }) => {
  await page.goto("/");
  const recruiterRadio = page.getByRole("radio", { name: "Para recrutadores" });
  const clientRadio = page.getByRole("radio", { name: "Para clientes" });
  await recruiterRadio.scrollIntoViewIfNeeded();

  await expect(async () => {
    await recruiterRadio.focus();
    await page.keyboard.press("ArrowRight");
    await expect(clientRadio).toHaveAttribute("aria-checked", "true", { timeout: 500 });
  }).toPass();

  await page.keyboard.press("ArrowLeft");
  await expect(recruiterRadio).toHaveAttribute("aria-checked", "true");
});

// --- ÂNCORA: o CTA do hero aponta para a seção que existe ---
test("CTA do hero ancora em #em-campo existente", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href="#em-campo"]')).toHaveCount(1);
  await expect(page.locator("#em-campo")).toHaveCount(1);
});

// As páginas de projeto usam o nav do BaseLayout (slot), não o Header.astro
// (#site-header só existe em /docs) — os seletores abaixo apontam pro markup real.
test("Locale toggle keeps equivalent path", async ({ page }) => {
  await page.goto("/projects/p5");
  const nav = page.locator('nav[aria-label="Principal"]');
  await nav.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/projects\/p5\/?$/);

  await nav.getByRole("link", { name: "PT", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/p5\/?$/);
});

test("Nav does not overlap project hero", async ({ page }) => {
  await page.goto("/projects/p7/");
  const nav = page.locator('nav[aria-label="Principal"]');
  await expect(nav).toBeVisible();
  const navBox = await nav.boundingBox();
  const h1Box = await page.locator("h1").first().boundingBox();

  expect(navBox).not.toBeNull();
  expect(h1Box).not.toBeNull();
  expect(h1Box!.y).toBeGreaterThanOrEqual(navBox!.y + navBox!.height);
});
