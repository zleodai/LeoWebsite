import { SectionHeader } from './SectionHeader';

export function EducationSection({ section, education, labels }) {
  return (
    <section id={section.id} className="pageSection" aria-labelledby={`${section.id}-title`}>
      <SectionHeader id={`${section.id}-title`} title={section.title} description={section.description} />
      <div className="educationList">
        {education.map((item) => (
          <article className="educationItem" key={`${item.school}-${item.degree}`}>
            <h3>{item.degree}</h3>
            <p className="itemMeta">
              {item.school}
              {labels.separator}
              {item.period}
            </p>
            {item.gpa ? <p>GPA: {item.gpa}</p> : null}
            {item.courses?.length ? (
              <details className="coursework">
                <summary>Relevant coursework</summary>
                <ul>
                  {item.courses.map((course) => <li key={course}>{course}</li>)}
                </ul>
              </details>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
