import { resolveHref } from '../data/content';
import { SectionHeader } from './SectionHeader';

export function ContactSection({ section, contacts }) {
  return (
    <section id={section.id} className="pageSection" aria-labelledby={`${section.id}-title`}>
      <SectionHeader id={`${section.id}-title`} title={section.title} description={section.description} />
      <div className="contactList">
        {contacts.map((contact) => (
          <a
            className="contactLink"
            href={resolveHref(contact.href)}
            target={contact.external ? '_blank' : undefined}
            rel={contact.external ? 'noopener noreferrer' : undefined}
            key={contact.label + contact.value}
          >
            <span>{contact.label}</span>
            {contact.value}
          </a>
        ))}
      </div>
    </section>
  );
}
