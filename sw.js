/* Service worker · Polisportiva Vico
   - la pagina si scarica sempre aggiornata dalla rete (se c'è), altrimenti si apre dalla copia salvata
   - librerie e font vengono salvati per aprire l'app più in fretta
   - i dati (Firebase) non passano di qui: restano sempre in tempo reale */
const V='vico-v1',SHELL=['./','icon-192.png','icon-512.png'];
const LIBS=['cdn.tailwindcss.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','www.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put('./',c));return x}).catch(()=>caches.match('./')));
    return;
  }
  if(u.origin===location.origin||LIBS.includes(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>{
      const net=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque')){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x}).catch(()=>hit);
      return hit||net;
    }));
  }
});
