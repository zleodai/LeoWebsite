import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
async function walk(directory){const result=[];for(const item of await readdir(directory,{withFileTypes:true})){const file=path.join(directory,item.name);result.push(...(item.isDirectory()?await walk(file):[file]));}return result;}
const files=await walk(root);
const pages=files.filter(file=>file.endsWith('.html'));
assert.equal(pages.length,4,'Expected Home, Resume, Projects, and About Me');
const docs=new Map(await Promise.all(pages.map(async file=>[file,await readFile(file,'utf8')])));
let checkedLinks=0;
for(const [file,html] of docs){
  assert.match(html,/<html lang="en">/);
  assert.match(html,/<meta name="viewport"/);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`One page heading in ${file}`);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(ids.length,new Set(ids).size,`Duplicate IDs in ${file}`);
  const pageUrl='http://localhost/'+path.relative(root,file).replaceAll('\\','/');
  for(const [,raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    const href=raw.replaceAll('&amp;','&');
    const url=new URL(href,pageUrl);
    assert(['http:','https:','mailto:','tel:','data:'].includes(url.protocol),`Unexpected URL ${href}`);
    if(url.origin!=='http://localhost')continue;
    let target=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if((await stat(target)).isDirectory())target=path.join(target,'index.html');
    assert(files.includes(target),`Missing local target: ${href}`);
    if(url.hash){const text=docs.get(target);assert(text?.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`Missing anchor: ${href}`);}
    checkedLinks++;
  }
}
const css=await readFile(path.join(root,'assets/style.css'),'utf8');
for(const [,href] of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))assert(files.includes(path.resolve(root,'.'+href)),`Missing CSS asset ${href}`);
const projectHtml=docs.get(path.join(root,'projects/index.html'));
assert.equal((projectHtml.match(/class="project"/g)||[]).length,16);
assert.equal((projectHtml.match(/<details\b/g)||[]).length,(projectHtml.match(/<\/details>/g)||[]).length);
const pdf=await readFile(path.join(root,'assets/Leo-Dai-Resume.pdf'));
assert.equal(pdf.subarray(0,5).toString(),'%PDF-');
const portrait=await readFile(path.join(root,'assets/headshot3.jpg'));
assert.equal(portrait.subarray(0,3).toString('hex'),'ffd8ff');
console.log(`PASS: ${pages.length} pages, 16 projects, ${checkedLinks} local links/assets/anchors, font, JPEG, and résumé PDF.`);

