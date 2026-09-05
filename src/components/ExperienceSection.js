import { SectionHeader } from './SectionHeader';

export function ExperienceSection({ section, jobs, labels }) {
  return (
    <section id={section.id} className="pageSection" aria-labelledby={`${section.id}-title`}>
      <SectionHeader id={`${section.id}-title`} title={section.title} description={section.description} />
      <div className="experienceList">
        {jobs.map((job) => (
          <article className="experienceItem" key={job.id}>
            <div>
              <h3>{job.role}</h3>
              <p className="itemMeta">
                {job.company}
                {labels.separator}
                {job.period}
              </p>
            </div>
            <ul>
              {job.bullets.slice(0, 2).map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
