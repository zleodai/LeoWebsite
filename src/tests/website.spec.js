const { test, expect } = require('@playwright/test');
const projectContent = require('../../public/data/projects.json');
const siteContent = require('../../public/data/siteContent.json');

const allProjects = [...projectContent.technicalProjects, ...projectContent.gameProjects];

async function expectNoHorizontalOverflow(page) {
  const dimensions = await page.locator('html').evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

async function topOffset(page, selector) {
  return page.locator(selector).evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
}

test('renders the simplified portfolio content', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(siteContent.meta.title);
  await expect(page.getByRole('heading', { level: 1, name: siteContent.hero.name })).toBeVisible();
  await expect(page.locator('.projectRow')).toHaveCount(allProjects.length);
  await expect(page.locator('#skills')).toHaveCount(0);
  await expect(page.locator('.siteNav a[href="#skills"]')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test('places experience before projects and education after projects', async ({ page }) => {
  await page.goto('/');

  const experienceTop = await topOffset(page, '#experience');
  const projectsTop = await topOffset(page, '#projects');
  const educationTop = await topOffset(page, '#education');

  expect(experienceTop).toBeLessThan(projectsTop);
  expect(projectsTop).toBeLessThan(educationTop);
});

test('combines search with category and technology filters, including an empty result', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search projects' }).fill('  REWIND  ');
  await expect(page.getByRole('button', { name: 'RALCOOP', exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: 'Category', exact: true }).selectOption('Game');
  await page.getByRole('combobox', { name: 'Technology', exact: true }).selectOption('WebGL');
  await expect(page.locator('.projectRow')).toHaveCount(1);
  await page.getByRole('combobox', { name: 'Technology', exact: true }).selectOption('Python');
  await expect(page.getByRole('heading', { name: 'No projects found' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await expect(page.locator('.projectRow')).toHaveCount(allProjects.length);
});

test('sorts projects by name in both directions', async ({ page }) => {
  await page.goto('/');
  const names = allProjects.map((project) => project.title).sort((a, b) => a.localeCompare(b));
  await page.getByRole('combobox', { name: 'Sort', exact: true }).selectOption('name');
  await expect(page.locator('.projectTitle')).toHaveText(names);
  await page.getByRole('combobox', { name: 'Sort', exact: true }).selectOption('name-desc');
  await expect(page.locator('.projectTitle')).toHaveText([...names].reverse());
});

test('uses only each project stack for technology filters, previews, and overlays', async ({ page }) => {
  await page.goto('/');
  const technologies = [...new Set(allProjects.flatMap((project) => project.stack))]
    .sort((a, b) => a.localeCompare(b));
  const filter = page.getByRole('combobox', { name: 'Technology', exact: true });
  await expect(filter.locator('option')).toHaveText(['All technologies', ...technologies]);

  for (const project of allProjects) {
    const trigger = page.getByRole('button', { name: project.title, exact: true });
    const preview = page.getByRole('row').filter({ has: trigger }).locator('.projectSkillsPreview');
    const overflow = project.stack.length > 3 ? ` +${project.stack.length - 3}` : '';
    await expect(preview).toHaveText(project.stack.slice(0, 3).join(', ') + overflow);
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: project.title });
    await expect(dialog.getByRole('heading', { name: 'Languages & Technologies' })).toBeVisible();
    await expect(dialog.locator('.techList span')).toHaveText(project.stack);
    await page.keyboard.press('Escape');
  }
});

test('keeps the requested racing link and separates experimental branch work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Autonomous Racing Agent', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Autonomous Racing Agent' });
  await expect(dialog.getByRole('link', { name: 'Open project' }))
    .toHaveAttribute('href', 'https://github.com/Law47/AutonomousRacingAgent');
  await expect(dialog.getByText(/The main implementation combines a Gymnasium environment/)).toBeVisible();
  await expect(dialog.getByText(/Extended the experimental BernoulliShift branch/)).toBeVisible();
});

test('keeps planning methods searchable without presenting them as technologies', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search projects' }).fill('GOAP');
  await expect(page.locator('.projectRow')).toHaveCount(2);
  await page.getByRole('combobox', { name: 'Category', exact: true }).selectOption('Technical');
  await expect(page.getByRole('button', { name: 'Tactical GOAP Agents', exact: true })).toBeVisible();
  await expect(page.locator('.projectRow')).toHaveCount(1);
  await page.getByRole('combobox', { name: 'Category', exact: true }).selectOption('Game');
  await expect(page.getByRole('button', { name: 'Photophobic Teyeme', exact: true })).toBeVisible();
  await expect(page.locator('.projectRow')).toHaveCount(1);
});

test('opens complete project details and restores focus after dismissal', async ({ page }) => {
  await page.goto('/');
  const project = allProjects.find((item) => item.id === 'ralcoop');
  const trigger = page.getByRole('button', { name: project.title, exact: true });
  await trigger.focus();
  await trigger.press('Enter');
  const dialog = page.getByRole('dialog', { name: project.title });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(project.description, { exact: true })).toBeVisible();
  for (const skill of project.stack) await expect(dialog.locator('.techList').getByText(skill, { exact: true })).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Open project' })).toHaveAttribute('href', project.link);
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('link', { name: 'Open project' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Close project' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await trigger.click();
  await page.mouse.click(4, 4);
  await expect(dialog).toHaveCount(0);
});

test('opens rows without external links and keeps filters when closing', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search projects' }).fill('Realtime Procedural');
  await page.locator('.projectRow .projectCategory').click();
  const dialog = page.getByRole('dialog', { name: 'Realtime Procedural Generation' });
  await expect(dialog.getByText('Project link unavailable')).toBeVisible();
  await expect(dialog.getByRole('link')).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Close project' }).click();
  await expect(page.getByRole('searchbox', { name: 'Search projects' })).toHaveValue('Realtime Procedural');
  await expect(page.locator('.projectRow')).toHaveCount(1);
});

test('fits within a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: siteContent.hero.name })).toBeVisible();
  await expect(page.locator('.siteNav')).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.getByRole('button', { name: 'RALCOOP', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'RALCOOP' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Open project' })).toBeInViewport();
  await expect(dialog.getByRole('button', { name: 'Close project' })).toBeInViewport();
  const dimensions = await dialog.evaluate((element) => ({ width: element.clientWidth, scrollWidth: element.scrollWidth }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width);
  await expectNoHorizontalOverflow(page);
});
