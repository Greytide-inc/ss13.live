// The Cloudflare Pages worker for ss13.live (plans/site.md): tools/site-pages.mjs copies it into the deploy folder as _worker.js,
// filling in BUILD (the build's hash) and BIG (the files over Pages' 25 MiB limit, kept in the R2 bucket under BUILD/).
// Every other file is Pages' own static copy. Same answers as tools/server.mjs gives: no type sniffing, no foreign frames,
// .dmi files are PNGs.
const BUILD = "__BUILD__";
const BIG = new Set(__BIG__); // "/web/build/world.snap.gz", ...
const TYPES = { ".js": "text/javascript", ".gz": "application/octet-stream", ".json": "application/json", ".dmi": "image/png", ".dmf": "text/plain" };
const typeOf = (p) => TYPES[p.slice(p.lastIndexOf("."))];

// A big file: the browser's copy if it has this build's (If-None-Match), else Cloudflare's edge copy, else R2.
// The R2 key holds the build hash, so a copy never goes stale: repeat visits cost no R2 reads.
async function big(req, env, ctx, path) {
	const etag = `"${BUILD}"`;
	const head = { "Content-Type": typeOf(path) ?? "application/octet-stream", "Cache-Control": "no-cache", ETag: etag };
	if (req.headers.get("If-None-Match") === etag) return new Response(null, { status: 304, headers: head });
	const key = BUILD + path, edgeKey = new Request(new URL("/__big/" + key, req.url));
	const edge = await caches.default.match(edgeKey);
	if (edge) return new Response(req.method === "HEAD" ? null : edge.body, { headers: head });
	const obj = await env.BIG.get(key);
	if (!obj) return new Response("not found", { status: 404 });
	const [mine, cached] = obj.body.tee();
	ctx.waitUntil(caches.default.put(edgeKey, new Response(cached, { headers: { ...head, "Content-Length": String(obj.size), "Cache-Control": "public, max-age=31536000, immutable" } })));
	return new Response(req.method === "HEAD" ? null : mine, { headers: { ...head, "Content-Length": String(obj.size) } });
}

export default {
	async fetch(req, env, ctx) {
		const path = new URL(req.url).pathname;
		let res;
		if (path.startsWith("/web/scenarios/")) res = new Response("not found", { status: 404 }); // test scripts stay private
		else if (BIG.has(path) && (req.method === "GET" || req.method === "HEAD")) res = await big(req, env, ctx, path);
		else if (path.endsWith(".html")) { // Pages redirects x.html to x; a redirect breaks popup frames and the service worker's copy
			const u = new URL(req.url);
			u.pathname = path.replace(/(index)?\.html$/, "");
			res = await env.ASSETS.fetch(new Request(u, req));
		} else res = await env.ASSETS.fetch(req);
		res = new Response(res.body, res);
		res.headers.set("X-Content-Type-Options", "nosniff");
		res.headers.set("X-Frame-Options", "SAMEORIGIN"); // not DENY: the game's popups are frames of popup.html
		const t = res.ok && typeOf(path);
		if (t === "image/png" || t === "text/plain") res.headers.set("Content-Type", t);
		return res;
	},
};
