// Service worker for the static build (generated into dist/sw.js by tools/build-static.mjs: MANIFEST and VERSION are filled in there).
// Every file in dist is downloaded into a cache named after the build hash. Only a fully downloaded build ever becomes
// active, old caches are deleted on activation, and IndexedDB (savefiles) is never touched.
const VERSION = "__VERSION__";
const MANIFEST = __MANIFEST__; // [[path, bytes], ...] relative to this file
const CACHE = "ss13-" + VERSION;
const chan = new BroadcastChannel("ss13-sw");
const base = new URL("./", self.location.href);
const urlOf = (p) => new URL(p, base).href;

async function precache() {
	const cache = await caches.open(CACHE); // a cache left by an earlier failed attempt of this same build is resumed
	const have = new Set((await cache.keys()).map((r) => r.url));
	const total = MANIFEST.reduce((a, [, s]) => a + s, 0);
	let done = 0, last = 0;
	for (const [p, s] of MANIFEST) if (have.has(urlOf(p))) done += s;
	const todo = MANIFEST.filter(([p]) => !have.has(urlOf(p)));
	const report = (force) => { const now = Date.now(); if (force || now - last > 150) { last = now; chan.postMessage({ type: "progress", version: VERSION, done, total }); } };
	report(true);
	let next = 0;
	const worker = async () => {
		while (next < todo.length) {
			const [p, s] = todo[next++];
			const res = await fetch(urlOf(p), { cache: "no-cache" });
			if (!res.ok) throw new Error(res.status + " " + p);
			await cache.put(urlOf(p), res);
			done += s; report(false);
		}
	};
	await Promise.all(Array.from({ length: 6 }, worker));
	if ((await cache.keys()).length < MANIFEST.length) throw new Error("cache incomplete");
	report(true);
}

self.addEventListener("install", (e) => {
	e.waitUntil(precache().then(() => {
		chan.postMessage({ type: "installed", version: VERSION });
		if (!self.registration.active) return self.skipWaiting(); // first visit: take over at once. Updates wait for the page's say-so
	}, (err) => { chan.postMessage({ type: "failed", version: VERSION, error: String(err) }); throw err; })); // rejecting = no half cache becomes active
});

self.addEventListener("activate", (e) => {
	e.waitUntil((async () => {
		for (const k of await caches.keys()) if (k.startsWith("ss13-") && k !== CACHE) await caches.delete(k);
		await self.clients.claim();
	})());
});

self.addEventListener("message", (e) => { if (e.data === "skipWaiting") self.skipWaiting(); else if (e.data === "version") e.source.postMessage({ type: "version", version: VERSION }); });

self.addEventListener("fetch", (e) => {
	const req = e.request;
	if (req.method !== "GET" || !req.url.startsWith(base.href)) return;
	e.respondWith((async () => {
		const cache = await caches.open(CACHE);
		const hit = await cache.match(req, { ignoreSearch: true }) || (new URL(req.url).pathname === base.pathname && await cache.match(urlOf("index.html")));
		return hit || fetch(req);
	})());
});
