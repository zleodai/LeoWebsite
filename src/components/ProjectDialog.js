import { useEffect, useRef } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { resolveHref } from '../data/content';

export function ProjectDialog({ project, labels, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  const dismissBackdrop = (event) => {
    if (event.target !== dialogRef.current) return;
    const bounds = dialogRef.current.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  };

  const containTabFocus = (event) => {
    if (event.key !== 'Tab') return;
    const elements = dialogRef.current.querySelectorAll('button, a[href], [tabindex="0"]');
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog ref={dialogRef} className="projectDialog" aria-labelledby="project-dialog-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={dismissBackdrop} onKeyDown={containTabFocus}>
      <header className="projectDialogHeader">
        <div>
          <p className="itemMeta">{project.category} / {project.type}</p>
          <h2 id="project-dialog-title">{project.title}</h2>
          {project.period ? <p>{project.period}</p> : null}
        </div>
        <button type="button" className="iconButton" onClick={onClose} aria-label="Close project" title="Close project" autoFocus>
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <div className="projectDialogBody" tabIndex={0} role="region" aria-label="Project details">
        {project.cover ? <img className="projectDetailImage" src={project.cover} alt={`${project.title} cover`} /> : null}
        <p>{project.description}</p>
        <section aria-labelledby="project-skills-title">
          <h3 id="project-skills-title">Languages & Technologies</h3>
          <div className="techList" aria-label="Project technologies">
            {project.skills.map((item) => <span key={item}>{item}</span>)}
          </div>
        </section>
        {project.bullets?.length ? <section aria-labelledby="project-contributions-title">
          <h3 id="project-contributions-title">Contributions</h3>
          <ul>{project.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
        </section> : null}
      </div>
      <footer className="projectDialogFooter">
        {project.link ? <a className="button buttonPrimary" href={resolveHref(project.link)} target="_blank" rel="noopener noreferrer">
          {labels.openProject}<ExternalLink size={16} aria-hidden="true" />
        </a> : <p>Project link unavailable</p>}
      </footer>
    </dialog>
  );
}
