import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const args=process.argv.slice(2);
const portArg=args.indexOf('--port');
const port=Number(portArg>=0?args[portArg+1]:(process.env.PORT||5173));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.ttf':'font/ttf','.pdf':'application/pdf','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
  try{
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file=path.resolve(root,'.'+pathname);
    if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden');}
    let info=await stat(file);
    if(info.isDirectory()){file=path.join(file,'index.html');info=await stat(file);}
    const bytes=await readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':bytes.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:bytes);
  }catch(error){
    const status=error instanceof URIError?400:404;
    res.writeHead(status,{'Content-Type':'text/html; charset=utf-8'});
    res.end(status===404?'<!doctype html><title>Page not found</title><body style="background:black;color:white;font-family:system-ui;padding:3rem"><h1>Page not found</h1><a href="/" style="color:white">Back to Leo’s portfolio</a>':'Bad request');
  }
});
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${server.address().port}`));
