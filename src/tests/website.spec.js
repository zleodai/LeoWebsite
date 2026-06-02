const { test, expect } = require('@playwright/test');
const projectContent = require('../../public/data/projects.json');
const siteContent = require('../../public/data/siteContent.json');

const technicalProjects = projectContent.technicalProjects;
const overlaySkill = siteContent.skills.find((skill) =>
  technicalProjects.some((project) => project.skillIds.includes(skill.id))
);
const matchedProject = technicalProjects.find((project) => project.skillIds.includes(overlaySkill.id));
const unmatchedProject = technicalProjects.find((project) => !project.skillIds.includes(overlaySkill.id));

function technicalCard(page, project) {
  return page.locator('.technicalCard').filter({
    has: page.getByRole('heading', { name: project.title, exact: true }),
  });
}

async function expectNoHorizontalOverflow(page) {
  const dimensions = await page.locator('html').evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

test('renders JSON-backed portfolio content', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(siteContent.meta.title);
  await expect(page.getByRole('heading', { level: 1, name: siteContent.hero.name })).toBeVisible();
  await expect(page.locator('.technicalCard')).toHaveCount(technicalProjects.length);
  await expectNoHorizontalOverflow(page);
});

test('opens and closes the related-work overlay from a skill', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: overlaySkill.label, exact: true }).click();

  const dialog = page.getByRole('dialog', { name: overlaySkill.label });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: matchedProject.title, exact: true })).toBeVisible();

  await dialog.getByRole('button', { name: siteContent.overlay.closeLabel, exact: true }).click();
  await expect(dialog).toBeHidden();
});

test('highlights matching projects while hovering over a skill', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: overlaySkill.label, exact: true }).hover();

  await expect(technicalCard(page, matchedProject)).toHaveClass(/is-skill-match/);
  await expect(technicalCard(page, unmatchedProject)).toHaveClass(/is-skill-muted/);
});

test('fits within a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: siteContent.hero.name })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
