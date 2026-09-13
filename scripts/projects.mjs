import {readFile,readdir} from 'node:fs/promises';

export async function loadProjects(){
  const directory=new URL('../content/projects/',import.meta.url);
  const filenames=(await readdir(directory)).filter(name=>name.endsWith('.json')).sort();
  const ids=new Set();
  const projects=await Promise.all(filenames.map(async filename=>{
    const project=JSON.parse(await readFile(new URL(filename,directory),'utf8'));
    const requireValue=(valid,message)=>{if(!valid)throw new Error(`${filename}: ${message}`);};
    for(const field of ['id','title','categoryTitle','description']){
      requireValue(typeof project[field]==='string'&&project[field].trim(),`${field} must be a nonempty string`);
    }
    requireValue(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id),'id must be a lowercase, hyphen-separated slug');
    requireValue(!ids.has(project.id),`duplicate id ${project.id}`);
    ids.add(project.id);
    for(const field of ['technicalWork','technologies']){
      requireValue(Array.isArray(project[field])&&project[field].every(item=>typeof item==='string'&&item.trim()),`${field} must be an array of nonempty strings (or an empty array)`);
    }
    for(const field of ['period','sourceLinkMessage','sourceLink']){
      requireValue(project[field]===undefined||typeof project[field]==='string',`${field} must be a string when provided`);
    }
    requireValue(project.order===undefined||Number.isFinite(project.order),'order must be a number when provided');
    requireValue(project.section===undefined||['technical','game'].includes(project.section),'section must be technical or game when provided');
    if(project.sourceLink){
      let url;
      try{url=new URL(project.sourceLink);}catch{throw new Error(`${filename}: sourceLink must be a full HTTP or HTTPS URL`);}
      requireValue(['http:','https:'].includes(url.protocol),'sourceLink must use HTTP or HTTPS');
    }
    return project;
  }));
  return projects.sort((a,b)=>(a.order??99)-(b.order??99)||a.title.localeCompare(b.title));
}
