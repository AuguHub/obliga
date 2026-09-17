const PREFIX='obliga-'+new URL(self.registration.scope).pathname+'-';
const CACHE=PREFIX+'v1.2.0-2';
const ASSETS=['./','./index.html','./style.css','./style.css?v=1.2.0','./app.js','./app.js?v=1.2.0','./engine.js','./content.js','./cases.js','./word-cases.js','./case-engine.js','./case-ui.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||!event.request.url.startsWith(self.registration.scope))return;event.respondWith(caches.open(CACHE).then(cache=>cache.match(event.request).then(cached=>cached||fetch(event.request).catch(()=>event.request.mode==='navigate'?cache.match('./index.html'):Response.error()))));});
