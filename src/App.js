import { useEffect, useMemo, useState } from 'react';
import { ContactSection } from './components/ContactSection';
import { EducationSection } from './components/EducationSection';
import { ExperienceSection } from './components/ExperienceSection';
import { Hero } from './components/Hero';
import { PageShell } from './components/PageShell';
import { ProjectsSection } from './components/ProjectsSection';
import { getProjects, loadPortfolioContent } from './data/content';
import './styles/theme.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/projects.css';

function App() {
  const [content, setContent] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    loadPortfolioContent()
      .then((nextContent) => {
        if (isMounted) {
          setContent(nextContent);
        }
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) {
          setLoadError(error);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!content) {
      return;
    }

    document.title = content.site.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.site.meta.description);
  }, [content]);

  const projects = useMemo(() => (content ? getProjects(content.projects) : null), [content]);

  if (loadError) {
    return (
      <main className="loadState" role="alert">
        <h1>Unable to load portfolio content.</h1>
        <p>Please refresh the page to try again.</p>
      </main>
    );
  }

  if (!content || !projects) {
    return <main className="loadState" aria-busy="true" />;
  }

  return (
    <PageShell nav={content.site.nav}>
      <Hero hero={content.site.hero} />
      <ExperienceSection section={content.site.sections.experience} jobs={content.site.workExperience} labels={content.site.labels} />
      <ProjectsSection
        section={content.site.sections.projects}
        projects={projects}
        labels={content.site.labels}
      />
      <EducationSection section={content.site.sections.education} education={content.site.education} labels={content.site.labels} />
      <ContactSection section={content.site.sections.contact} contacts={content.site.contactLinks} />
    </PageShell>
  );
}

export default App;
