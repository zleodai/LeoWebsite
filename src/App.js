import { useEffect, useMemo, useState } from 'react';
import './App.css';

function resolveHref(href) {
  if (!href || href.startsWith('http') || href.startsWith('mailto:')) {
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

function getSkillLabels(skillIds, skillMap) {
  return skillIds.map((skillId) => skillMap.get(skillId)?.label || skillId);
}

function SectionHeader({ title, description, id }) {
  return (
    <div className="sectionHeader">
      <h2 id={id} className="terminalTitle">
        {title}
      </h2>
      <p>{description}</p>
    </div>
  );
}

function SkillOverlay({ labels, overlay, skill, projects, workExperience, onClose }) {
  if (!skill) {
    return null;
  }

  const hasProjects = projects.length > 0;
  const hasWorkExperience = workExperience.length > 0;

  return (
    <div className="skillOverlay" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section className="skillOverlayPanel" role="dialog" aria-modal="true" aria-labelledby="skill-overlay-title">
        <div className="skillOverlayHeader">
          <div>
            <p className="projectType">{overlay.eyebrow}</p>
            <h2 id="skill-overlay-title">{skill.label}</h2>
            {skill.summary ? <p>{skill.summary}</p> : null}
          </div>
          <button className="overlayCloseButton" type="button" onClick={onClose} aria-label={overlay.closeLabel}>
            {overlay.closeLabel}
          </button>
        </div>

        <div className="skillOverlayBody">
          {!hasProjects && !hasWorkExperience ? <p>{overlay.emptyMessage}</p> : null}

          {hasProjects ? (
            <div className="overlaySection">
              <h3>{overlay.projectsTitle}</h3>
              <div className="overlayResultGrid">
                {projects.map((project) => (
                  <article className="overlayResultCard" key={project.id}>
                    <p className="projectType">{project.type}</p>
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                    {project.stack?.length ? (
                      <div className="projectStack" aria-label={labels.technologies}>
                        {project.stack.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    ) : null}
                    {project.bullets?.length ? (
                      <ul>
                        {project.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                    {project.link ? (
                      <a className="inlineProjectLink" href={project.link} target="_blank" rel="noopener noreferrer">
                        {labels.openProject}
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {hasWorkExperience ? (
            <div className="overlaySection">
              <h3>{overlay.experienceTitle}</h3>
              <div className="overlayResultGrid">
                {workExperience.map((job) => (
                  <article className="overlayResultCard" key={job.id}>
                    <h4>{job.role}</h4>
                    <p className="muted">
                      {job.company}
                      {labels.separator}
                      {job.period}
                    </p>
                    <ul>
                      {job.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function App() {
  const [siteContent, setSiteContent] = useState(null);
  const [projectContent, setProjectContent] = useState(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([loadJson('/data/siteContent.json'), loadJson('/data/projects.json')])
      .then(([nextSiteContent, nextProjectContent]) => {
        if (!isMounted) {
          return;
        }

        setSiteContent(nextSiteContent);
        setProjectContent(nextProjectContent);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!siteContent || !projectContent) {
    return <div className="App" aria-busy="true" />;
  }

  return <PortfolioApp siteContent={siteContent} projectContent={projectContent} />;
}

function PortfolioApp({ siteContent, projectContent }) {
  const [typedTagline, setTypedTagline] = useState('');
  const [hoveredSkillId, setHoveredSkillId] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);

  const skillMap = useMemo(() => new Map(siteContent.skills.map((skill) => [skill.id, skill])), [siteContent.skills]);
  const activeSkillId = hoveredSkillId || selectedSkillId;
  const selectedSkill = selectedSkillId ? skillMap.get(selectedSkillId) : null;

  const allProjects = useMemo(
    () => [
      ...projectContent.technicalProjects.map((project) => ({ ...project, group: 'technical' })),
      ...projectContent.gameProjects.map((project) => ({ ...project, type: project.type || siteContent.sections.gameProjects.title, group: 'game' })),
    ],
    [projectContent.gameProjects, projectContent.technicalProjects, siteContent.sections.gameProjects.title]
  );

  const overlayProjects = selectedSkillId ? allProjects.filter((project) => project.skillIds?.includes(selectedSkillId)) : [];
  const overlayWorkExperience = selectedSkillId
    ? siteContent.workExperience.filter((job) => job.skillIds?.includes(selectedSkillId))
    : [];

  useEffect(() => {
    document.title = siteContent.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', siteContent.meta.description);
  }, [siteContent.meta.description, siteContent.meta.title]);

  useEffect(() => {
    if (typedTagline === siteContent.hero.tagline) {
      return;
    }

    const timeout = setTimeout(() => {
      setTypedTagline((prev) => siteContent.hero.tagline.slice(0, prev.length + 1));
    }, siteContent.typing.speedMs);

    return () => clearTimeout(timeout);
  }, [siteContent.hero.tagline, siteContent.typing.speedMs, typedTagline]);

  useEffect(() => {
    if (!selectedSkillId) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedSkillId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSkillId]);

  function cardSkillClass(skillIds = []) {
    if (!activeSkillId) {
      return '';
    }

    return skillIds.includes(activeSkillId) ? 'is-skill-match' : 'is-skill-muted';
  }

  function renderAction(action) {
    const className = action.variant === 'primary' ? 'PrimaryButton' : 'GhostButton';

    return (
      <a
        className={className}
        download={action.download}
        href={resolveHref(action.href)}
        key={action.label}
        rel={action.external || action.download ? 'noopener noreferrer' : undefined}
        target={action.external || action.download ? '_blank' : undefined}
      >
        {action.label}
      </a>
    );
  }

  return (
    <div className="App">
      <nav className="TopNav">
        <p className="TopBrand">{siteContent.nav.brand}</p>
        <div className="TopLinks">
          {siteContent.nav.links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="Main">
        <section id="about" className="HeroPanel">
          <div className="sectionInner">
            <p className="eyebrow">{siteContent.hero.eyebrow}</p>
            <h1 className="typeTitle">{siteContent.hero.name}</h1>
            <p className="tagline typeWriter">{typedTagline}</p>
            <p className="terminalParagraph">{siteContent.hero.summary}</p>
            <div className="heroChips">
              {getSkillLabels(siteContent.hero.highlightSkillIds, skillMap).map((skillLabel) => (
                <span key={skillLabel}>{skillLabel}</span>
              ))}
            </div>
            <div className="heroActions">{siteContent.hero.actions.map(renderAction)}</div>
          </div>
        </section>

        <section id={siteContent.sections.skills.id} className="PageSection">
          <div className="sectionInner">
            <SectionHeader title={siteContent.sections.skills.title} description={siteContent.sections.skills.description} />
            <div className="skillsGrid">
              {siteContent.skills.map((skill) => {
                const isActive = activeSkillId === skill.id;

                return (
                  <button
                    className={`skillButton ${isActive ? 'is-active' : ''}`}
                    key={skill.id}
                    onBlur={() => setHoveredSkillId(null)}
                    onClick={() => setSelectedSkillId(skill.id)}
                    onFocus={() => setHoveredSkillId(skill.id)}
                    onMouseEnter={() => setHoveredSkillId(skill.id)}
                    onMouseLeave={() => setHoveredSkillId(null)}
                    type="button"
                  >
                    <span>{skill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section id={siteContent.sections.technicalProjects.id} className="PageSection">
          <div className="sectionInner">
            <SectionHeader
              title={siteContent.sections.technicalProjects.title}
              description={siteContent.sections.technicalProjects.description}
            />
            <div className="technicalGrid">
              {projectContent.technicalProjects.map((project) => (
                <article className={`technicalCard ${cardSkillClass(project.skillIds)}`} key={project.id}>
                  <div className="projectMeta">
                    <p className="projectType">{project.type}</p>
                    <h3>{project.title}</h3>
                    <p className="projectDescription">{project.description}</p>
                    <div className="projectStack" aria-label={siteContent.labels.technologies}>
                      {project.stack.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                    <ul>
                      {project.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    {project.link ? (
                      <a className="inlineProjectLink" href={project.link} target="_blank" rel="noopener noreferrer">
                        {siteContent.labels.openProject}
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="PageSection" aria-labelledby="game-work-title">
          <div className="sectionInner">
            <SectionHeader
              id="game-work-title"
              title={siteContent.sections.gameProjects.title}
              description={siteContent.sections.gameProjects.description}
            />
            <div className="gameGrid">
              {projectContent.gameProjects.map((project) => (
                <a
                  className={`gameCard ${cardSkillClass(project.skillIds)}`}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${siteContent.labels.openProject}: ${project.title}`}
                  key={project.id}
                >
                  <img className="projectCoverImage" src={project.cover} alt={project.title} />
                  <div className="projectMeta">
                    <h3>{project.title}</h3>
                    <p className="projectDescription">{project.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id={siteContent.sections.experience.id} className="PageSection">
          <div className="sectionInner">
            <SectionHeader title={siteContent.sections.experience.title} description={siteContent.sections.experience.description} />
            <div className="experienceGrid">
              {siteContent.workExperience.map((job) => (
                <article className={`experienceCard ${cardSkillClass(job.skillIds)}`} key={job.id}>
                  <h3>{job.role}</h3>
                  <p className="muted">
                    {job.company}
                    {siteContent.labels.separator}
                    {job.period}
                  </p>
                  <ul>
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id={siteContent.sections.education.id} className="PageSection">
          <div className="sectionInner">
            <SectionHeader title={siteContent.sections.education.title} description={siteContent.sections.education.description} />
            <div className="educationGrid">
              {siteContent.education.map((item) => (
                <article className="educationCard" key={`${item.school}-${item.degree}`}>
                  <h3>{item.degree}</h3>
                  <p className="muted">
                    {item.school}
                    {siteContent.labels.separator}
                    {item.period}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id={siteContent.sections.contact.id} className="PageSection">
          <div className="sectionInner">
            <SectionHeader title={siteContent.sections.contact.title} description={siteContent.sections.contact.description} />
            <div className="contactGrid">
              {siteContent.contactLinks.map((contact) => (
                <a
                  className="contactButton"
                  href={contact.href}
                  target={contact.external ? '_blank' : undefined}
                  rel={contact.external ? 'noopener noreferrer' : undefined}
                  key={contact.label + contact.value}
                  aria-label={`${contact.label}: ${contact.value}`}
                >
                  <span>{contact.label}</span>
                  {contact.value}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SkillOverlay
        labels={siteContent.labels}
        overlay={siteContent.overlay}
        skill={selectedSkill}
        projects={overlayProjects}
        workExperience={overlayWorkExperience}
        onClose={() => setSelectedSkillId(null)}
      />
    </div>
  );
}

export default App;
