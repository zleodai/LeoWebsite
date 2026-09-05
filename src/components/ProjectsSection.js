import { useMemo, useState } from 'react';
import { ArrowRight, Code2, Gamepad2, RotateCcw, Search, X } from 'lucide-react';
import { ProjectDialog } from './ProjectDialog';
import { SectionHeader } from './SectionHeader';

export function ProjectsSection({ section, projects, labels }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [skill, setSkill] = useState('all');
  const [sort, setSort] = useState('featured');
  const [selectedProject, setSelectedProject] = useState(null);
  const skills = useMemo(() => [...new Set(projects.flatMap((project) => project.skills))]
    .sort((a, b) => a.localeCompare(b)), [projects]);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return projects.filter((project) => {
      const searchable = [project.title, project.type, project.category, project.description, ...project.skills]
        .join(' ').toLowerCase();
      return (category === 'all' || project.category === category)
        && (skill === 'all' || project.skills.includes(skill))
        && terms.every((term) => searchable.includes(term));
    }).sort((a, b) => {
      if (sort === 'name') return a.title.localeCompare(b.title);
      if (sort === 'name-desc') return b.title.localeCompare(a.title);
      return Number(b.featured) - Number(a.featured) || a.priority - b.priority || a.title.localeCompare(b.title);
    });
  }, [projects, query, category, skill, sort]);

  const reset = () => {
    setQuery('');
    setCategory('all');
    setSkill('all');
    setSort('featured');
  };
  const isFiltered = query !== '' || category !== 'all' || skill !== 'all' || sort !== 'featured';

  return (
    <section id={section.id} className="pageSection projectBrowser" aria-labelledby={`${section.id}-title`}>
      <SectionHeader id={`${section.id}-title`} title={section.title} description={section.description} />
      <div className="projectToolbar">
        <label className="projectSearch">
          <Search size={18} aria-hidden="true" />
          <input type="search" aria-label="Search projects" placeholder="Search projects" value={query}
            onChange={(event) => setQuery(event.target.value)} />
          <button type="button" className="iconButton clearSearch" aria-label="Clear search" title="Clear search"
            disabled={!query} onClick={() => setQuery('')}><X size={16} aria-hidden="true" /></button>
        </label>
        <label className="projectFilter">
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            <option value="Game">Games</option>
            <option value="Technical">Technical</option>
          </select>
        </label>
        <label className="projectFilter">
          <span>Technology</span>
          <select value={skill} onChange={(event) => setSkill(event.target.value)}>
            <option value="all">All technologies</option>
            {skills.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label className="projectFilter">
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured first</option>
            <option value="name">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </label>
      </div>
      <div className="projectResultsBar">
        <p role="status">{results.length} of {projects.length} projects</p>
        <button type="button" className="resetFilters" disabled={!isFiltered} onClick={reset}>
          <RotateCcw size={14} aria-hidden="true" /> Reset
        </button>
      </div>
      <div className="projectTableScroll">
        <table className="projectTable">
          <caption className="visuallyHidden">Projects</caption>
          <thead><tr><th scope="col">Project</th><th scope="col">Category</th><th scope="col" className="skillsColumn">Technologies</th></tr></thead>
          <tbody>
            {results.map((project) => {
              const Icon = project.category === 'Game' ? Gamepad2 : Code2;
              return (
                <tr key={project.id} className="projectRow" onClick={(event) => {
                  event.currentTarget.querySelector('button').focus({ preventScroll: true });
                  setSelectedProject(project);
                }}>
                  <td>
                    <div className="projectIdentity">
                      {project.cover ? <img className="projectThumbnail" src={project.cover} alt="" loading="lazy" />
                        : <span className="projectThumbnail projectGlyph"><Icon size={20} aria-hidden="true" /></span>}
                      <div>
                        <button className="projectTitle" type="button" aria-haspopup="dialog"
                          onClick={(event) => { event.stopPropagation(); setSelectedProject(project); }}>
                          {project.title}<ArrowRight size={14} aria-hidden="true" />
                        </button>
                        <p className="projectType">{project.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="projectCategory">{project.category}</td>
                  <td className="skillsColumn projectSkillsPreview">{project.skills.slice(0, 3).join(', ')}
                    {project.skills.length > 3 ? <span className="skillOverflow"> +{project.skills.length - 3}</span> : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {results.length === 0 ? <div className="projectEmpty"><Search size={24} aria-hidden="true" /><h3>No projects found</h3>
          <button type="button" className="button buttonSecondary" onClick={reset}>Clear filters</button></div> : null}
      </div>
      {selectedProject ? <ProjectDialog project={selectedProject} labels={labels} onClose={() => setSelectedProject(null)} /> : null}
    </section>
  );
}
