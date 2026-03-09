import { useEffect, useState } from 'react';
import './App.css';

const sep = ' • ';

const aboutSummary = 'I enjoy doing Game Jams and working in Unity.';
const taglineText = 'Hi, how you doing';
const TAGLINE_TYPING_SPEED_MS = 150;

const highlights = ['Unity', 'C#', 'Python'];

const workExperience = [
  {
    company: 'Well Frog Studios LLC',
    role: 'Technical Developer',
    period: 'Sept 2025 - Dec 2025',
    bullets: ['Built a playable mobile game prototype using Unity.'],
  },
  {
    company: 'Arkenzo Interactive',
    role: 'Technical Designer',
    period: 'May 2024 - Aug 2024',
    bullets: ['Prototyped gameplay concepts in Unreal Engine.'],
  },
  {
    company: 'Target',
    role: 'General Merchandise Expert',
    period: 'Oct 2021 - Present',
    bullets: ['Retail work :/'],
  },
];

const projects = [
  {
    title: "The Walls Weren't Always Red",
    link: 'https://law47.itch.io/the-walls-werent-always-red',
    cover: 'https://img.itch.zone/aW1nLzI1NzU2MDk2LnBuZw==/315x250%23c/9Yq5Wf.png',
    description: 'A puzzle-horror concept with evolving color-based navigation and tension pacing.',
  },
  {
    title: 'Photophobic Teyeme',
    link: 'https://law47.itch.io/photophobic-teyeme',
    cover: 'https://img.itch.zone/aW1nLzIzNjkwNzIwLnBuZw==/315x250%23c/491s4R.png',
    description: 'A dark ambient prototype where fear mechanics and uncertainty shape every play decision.',
  },
  {
    title: 'RALCOOP',
    link: 'https://law47.itch.io/ralcoop',
    cover: 'https://img.itch.zone/aW1nLzIyNTMyMTQ5LnBuZw==/315x250%23c/5wVbQi.png',
    description: 'A co-op experiment focused on synced timing and team-driven movement loops.',
  },
  {
    title: 'Unstable',
    link: 'https://law47.itch.io/unstable',
    cover: 'https://img.itch.zone/aW1nLzE4NTM3NDkxLnBuZw==/315x250%23c/iN2bVF.png',
    description: 'A gameplay loop that escalates risk and rewards as systems destabilize.',
  },
  {
    title: 'Smainter Smail',
    link: 'https://law47.itch.io/smainter-smail',
    cover: 'https://img.itch.zone/aW1nLzE3NDQwMTcwLnBuZw==/315x250%23c/y7X99T.png',
    description: 'A fast-paced, satirical action piece blending delivery mechanics with chaotic timing.',
  },
];

const contactLinks = [
  {
    label: 'Email',
    value: 'awsomeleodai@gmail.com',
    href: 'mailto:awsomeleodai@gmail.com',
  },
];

function App() {
  const [typedTagline, setTypedTagline] = useState('');

  useEffect(() => {
    if (typedTagline === taglineText) {
      return;
    }

    const timeout = setTimeout(() => {
      setTypedTagline((prev) => taglineText.slice(0, prev.length + 1));
    }, TAGLINE_TYPING_SPEED_MS);

    return () => clearTimeout(timeout);
  }, [typedTagline]);

  return (
    <div className="App">
      <nav className="TopNav">
        <p className="TopBrand">$ Leo Dai</p>
        <div className="TopLinks">
          <a href="#about">about</a>
          <a href="#projects">projects</a>
          <a href="#experience">experience</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <main className="Main">
        <section id="about" className="HeroPanel">
          <div className="sectionInner">
            <p className="eyebrow">&gt; game_developer</p>
            <h1 className="typeTitle">Leo Dai</h1>
            <p className="tagline typeWriter">{typedTagline}</p>
            <p className="terminalParagraph">{aboutSummary}</p>
            <div className="heroChips">
              {highlights.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="heroActions">
              <a
                href={`${process.env.PUBLIC_URL}/2026%20Resume.pdf`}
                className="PrimaryButton"
                target="_blank"
                rel="noopener noreferrer"
                download="2026 Resume.pdf"
              >
                resume
              </a>
            </div>
          </div>
        </section>

        <section id="projects" className="PageSection">
          <div className="sectionInner">
            <div className="sectionHeader">
              <h2 className="terminalTitle">game projects</h2>
              <p>Recent work with playable demos and jam builds.</p>
            </div>
            <div className="projectGrid">
              {projects.map((project) => (
                <a
                  className="projectCard"
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title} on Itch`}
                  key={project.title}
                >
                  <img className="projectCoverImage" src={project.cover} alt={`${project.title} cover`} />
                  <div className="projectMeta">
                    <h3>{project.title}</h3>
                    <p className="projectDescription">{project.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="PageSection">
          <div className="sectionInner">
            <div className="sectionHeader">
              <h2 className="terminalTitle">experience</h2>
              <p>Selected roles and hands-on outcomes.</p>
            </div>
            <div className="experienceGrid">
              {workExperience.map((job) => (
                <article className="experienceCard" key={`${job.company}-${job.role}`}>
                  <h3>{job.role}</h3>
                  <p className="muted">
                    {job.company}
                    {sep}
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

        <section id="contact" className="PageSection">
          <div className="sectionInner">
            <div className="sectionHeader">
              <h2 className="terminalTitle">contact</h2>
              <p>Let's discuss collaboration or opportunities.</p>
            </div>
            <div className="contactGrid">
              {contactLinks.map((contact) => (
                <a className="contactEmailButton" href={contact.href} key={contact.label + contact.value} aria-label={`Open ${contact.label}`}>
                  {contact.value}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
