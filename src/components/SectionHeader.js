export function SectionHeader({ title, description, id }) {
  return (
    <div className="sectionHeader">
      <h2 id={id}>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
