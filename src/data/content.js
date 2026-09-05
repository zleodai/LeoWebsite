export function resolveHref(href) {
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return href;
  }

  return `${process.env.PUBLIC_URL}${href}`;
}

async function loadJson(path) {
  const response = await fetch(resolveHref(path));

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json();
}

function withProjectDefaults(project, sourceType) {
  return {
    category: sourceType,
    priority: 999,
    featured: false,
    stack: [],
    ...project,
  };
}

function sortByPriority(left, right) {
  return left.priority - right.priority || left.title.localeCompare(right.title);
}

export async function loadPortfolioContent() {
  const [site, projects] = await Promise.all([loadJson('/data/siteContent.json'), loadJson('/data/projects.json')]);

  return { site, projects };
}

export function getProjects(projects) {
  const allProjects = [
    ...projects.technicalProjects.map((project) => withProjectDefaults(project, 'Technical')),
    ...projects.gameProjects.map((project) => withProjectDefaults(project, 'Game')),
  ].sort(sortByPriority);

  return allProjects.map((project) => ({
    ...project,
    skills: [...new Set(project.stack)],
  }));
}
