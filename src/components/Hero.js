import { resolveHref } from '../data/content';

function ActionLink({ action }) {
  const className = action.variant === 'primary' ? 'button buttonPrimary' : 'button buttonSecondary';

  return (
    <a
      className={className}
      download={action.download}
      href={resolveHref(action.href)}
      rel={action.external || action.download ? 'noopener noreferrer' : undefined}
      target={action.external || action.download ? '_blank' : undefined}
    >
      {action.label}
    </a>
  );
}

export function Hero({ hero }) {
  return (
    <section id="about" className="heroSection">
      <p className="eyebrow">{hero.eyebrow}</p>
      <h1>{hero.name}</h1>
      <p className="heroTagline">{hero.tagline}</p>
      <p className="heroSummary">{hero.summary}</p>
      <div className="heroActions">
        {hero.actions.map((action) => (
          <ActionLink action={action} key={action.label} />
        ))}
      </div>
      <div className="gameStrip">
        {hero.games.map((game) => (
          <a className="gamePreview" key={game.title} href={game.href} target="_blank" rel="noopener noreferrer">
            <img src={game.cover} alt="" width="315" height="250" />
            <span>{game.title}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
