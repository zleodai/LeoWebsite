export function PageShell({ nav, children }) {
  return (
    <div className="appShell">
      <header className="siteHeader">
        <a className="siteBrand" href="#about">
          {nav.brand}
        </a>
        <nav className="siteNav" aria-label="Primary navigation">
          {nav.links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="pageStack">{children}</main>
    </div>
  );
}
