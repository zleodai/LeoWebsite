import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {loadProjects} from './projects.mjs';

const base=new URL('../',import.meta.url);
const site=JSON.parse(await readFile(new URL('content/site.json',base),'utf8'));
const allProjects=await loadProjects();
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const ext='target="_blank" rel="noopener noreferrer"';
const links=[['resume','Resume'],['projects','Projects'],['aboutme','About Me']];
const chips=items=>`<ul class="tags">${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
const contacts=site.contactLinks.filter(link=>['GitHub','itch.io','Email','LinkedIn'].includes(link.label));
const contactLinks=()=>contacts.map(link=>`<a href="${esc(link.href)}" ${link.external?ext:''}>${esc(link.label)}${link.external?'<span aria-hidden="true"> ↗</span>':''}</a>`).join('');
const header=page=>`<header class="site-header"><a class="wordmark" href="/" aria-label="Leo — home">Leo</a><nav aria-label="Main navigation">${links.map(([path,label])=>`<a href="/${path}/" ${path===page?'aria-current="page"':''}>${label}</a>`).join('')}</nav></header>`;
const footer=()=>`<footer class="site-footer"><a href="/">Leo Dai</a><nav aria-label="Contact and profiles">${contactLinks()}</nav></footer>`;
const shell=(page,title,description,body)=>`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#000000">
<meta name="description" content="${esc(description)}"><title>${title} — Leo Dai</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='16'/%3E%3Ctext x='9' y='24' fill='white' font-family='sans-serif' font-size='23'%3EL%3C/text%3E%3C/svg%3E">
<link rel="preload" href="/assets/montserrat.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/assets/style.css">
</head><body class="interior ${page}-page"><a class="skip-link" href="#main">Skip to content</a>${header(page)}<main id="main" class="page-content">${body}</main>${footer()}</body></html>`;

const tools=['Unity','Unreal Engine','Roblox Studio','Git','Rojo','Node.js','React','SQLite','PostgreSQL','PyTorch'];
const languages=['C#','Python','C++','JavaScript','TypeScript','Go','Lua','Luau'];
const resume=`
<section class="page-intro resume-intro" aria-labelledby="resume-title">
  <h1 id="resume-title" class="sentence-title"><span class="sentence-prefix">Download</span> <a href="/assets/Leo-Dai-Resume.pdf" download="Leo Dai Resume.pdf">Resume<span class="download-arrow" aria-hidden="true">↓</span></a></h1>
  <p class="intro-note">${esc(site.hero.summary)}</p>
  <nav class="section-nav" aria-label="Résumé sections"><a href="#tools">Tools</a><a href="#languages">Languages</a><a href="#experience">Experience</a></nav>
</section>
<section class="content-section skill-section" id="tools" aria-labelledby="tools-title"><h2 id="tools-title" class="sentence-title"><span class="sentence-prefix">Here are</span> Tools <span class="sentence-suffix">I use</span></h2>${chips(tools)}</section>
<section class="content-section skill-section" id="languages" aria-labelledby="languages-title"><h2 id="languages-title" class="sentence-title"><span class="sentence-prefix">Here are</span> Languages <span class="sentence-suffix">I enjoy using</span></h2>${chips(languages)}</section>
<section class="content-section" id="experience" aria-labelledby="experience-title"><h2 id="experience-title" class="sentence-title"><span class="sentence-prefix">Here is my</span> Experience</h2>
<div class="experience-list">${site.workExperience.map(job=>`<article class="experience-item"><div class="experience-meta"><h3>${esc(job.company)}</h3><p>${esc(job.period)}</p></div><div class="experience-description"><h4>${esc(job.role)}</h4><ul>${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}</ul></div></article>`).join('')}</div></section>
<aside class="page-outro"><p>See the work behind the résumé.</p><a class="text-link" href="/projects/">Explore my projects <span aria-hidden="true">→</span></a></aside>`;

const projectMarkup=(project,index)=>`<details class="project" id="${esc(project.id)}"><summary><span class="project-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><span class="project-summary"><span class="project-name">${esc(project.title)}</span><span class="project-type">${esc(project.categoryTitle)}</span></span><span class="project-toggle" aria-hidden="true"></span></summary><div class="project-detail"><p class="project-description">${esc(project.description)}</p>${project.technologies.length?chips(project.technologies):''}${project.period?`<p class="project-period">${esc(project.period)}</p>`:''}${project.technicalWork.length?`<h3>Technical work</h3><ul class="project-bullets">${project.technicalWork.map(b=>`<li>${esc(b)}</li>`).join('')}</ul>`:''}${project.sourceLink?`<a class="text-link" href="${esc(project.sourceLink)}" ${ext}>${esc(project.sourceLinkMessage?.trim()||'View source')} <span aria-hidden="true">↗</span></a>`:''}</div></details>`;
const technicalProjects=allProjects.filter(project=>project.section!=='game');
const gameProjects=allProjects.filter(project=>project.section==='game');
const projectPage=`
<section class="project-section" id="technical-projects" aria-labelledby="projects-title"><h1 id="projects-title" class="sentence-title"><span class="sentence-prefix">Here are my</span> Projects</h1><div class="project-list">${technicalProjects.map(projectMarkup).join('')}</div></section>
<section class="project-section" id="game-projects" aria-labelledby="game-projects-title"><h2 id="game-projects-title" class="sentence-title"><span class="sentence-prefix">Here are my</span> Game Projects</h2><div class="project-list">${gameProjects.map(projectMarkup).join('')}</div></section>`;

const education=site.education[0];
const about=`
<section class="page-intro about-intro" aria-labelledby="about-title"><h1 id="about-title" class="sentence-title"><span class="sentence-prefix">Here is more</span> About Me</h1>
<div class="about-layout"><div class="about-copy"><p class="large-copy">${esc(site.hero.summary)}</p><p>My projects span game AI, graphics, telemetry, developer tools, and web applications. I’m interested in the systems behind an experience, from how an agent makes a decision to how data moves through an application.</p><p>I work primarily in Unity and C#, alongside Python, C++, JavaScript, Go, and Lua. My portfolio includes independent tools, academic collaborations, and games built with small teams.</p><a class="text-link" href="/projects/">Take a look at my projects <span aria-hidden="true">→</span></a></div><div class="about-portrait"><img class="portrait" src="/assets/headshot3.jpg" alt="Leo Dai" width="320" height="320"></div></div></section>
<section class="content-section education-section" aria-labelledby="education-title"><h2 id="education-title" class="sentence-title">Education</h2><div class="education-detail"><div><h3>${esc(education.school)}</h3><p>${esc(education.degree)}</p><p class="muted">${esc(education.period)} · GPA ${esc(education.gpa)}</p></div><details class="course-details"><summary>Coursework</summary>${chips(education.courses)}</details></div></section>
<section class="content-section contact-section" aria-labelledby="contact-title"><h2 id="contact-title" class="sentence-title">Let’s talk</h2><p>${esc(site.sections.contact.description)}.</p><a class="contact-email" href="mailto:awsomeleodai@gmail.com">awsomeleodai@gmail.com</a><div class="contact-links">${contactLinks()}</div></section>`;

for(const [slug,title,description,body] of [
  ['resume','Resume','Leo Dai’s experience, programming languages, tools, and downloadable résumé.',resume],
  ['projects','Projects','Programming projects by Leo Dai: game AI, telemetry, graphics, tools, and collaborative work.',projectPage],
  ['aboutme','About Me','About Leo Dai, a developer and computer science student in Los Angeles.',about]
]){
  const directory=new URL(`dist/${slug}/`,base);
  await mkdir(directory,{recursive:true});
  await writeFile(new URL('index.html',directory),shell(slug,title,description,body));
}
console.log(`Rendered résumé, ${allProjects.length} projects, and About Me. Static site: dist/`);

