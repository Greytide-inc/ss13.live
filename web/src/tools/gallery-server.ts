// gallery-server - Tiny static file server for the sprite gallery (`npm run gallery`). Serves the
// whole repo root, so the browser can fetch both `icons/*.dmi` and the compiled DMI loader/gallery
// JS by plain relative paths. Also serves `GET /api/icons`, a JSON list of every `icons/**/*.dmi`
// path (relative to the repo root), which the gallery page uses to fill its search box.
//
// No dependencies beyond node:http/fs: this is a dev tool, not shipped code.

import { createServer } from "node:http";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// build/dist/src/tools/gallery-server.js -> up 4 to web/, then up 1 more to the repo root
let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);
const repoRoot = dirname(webDir);

const MIME: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".dmi": "image/png", // a .dmi IS a PNG (with extra metadata in a text chunk); <img>/Image() need this mime
	".png": "image/png",
	".mjs": "text/javascript; charset=utf-8", // pixi.js's ESM build, served for the drawing page's import map
};

function listDmiFiles(): string[] {
	const out: string[] = [];
	const walk = (dir: string) => {
		for (const name of readdirSync(dir)) {
			const p = join(dir, name);
			const st = statSync(p);
			if (st.isDirectory()) walk(p);
			else if (name.endsWith(".dmi")) out.push(relative(repoRoot, p).split("\\").join("/"));
		}
	};
	walk(join(repoRoot, "icons"));
	out.sort();
	return out;
}

const port = Number(process.env.PORT) || 8471;

const server = createServer((req, res) => {
	try {
		const url = new URL(req.url ?? "/", "http://localhost");
		let path = decodeURIComponent(url.pathname);
		if (path === "/") path = "/web/gallery/index.html";

		if (path === "/api/icons") {
			const body = JSON.stringify(listDmiFiles());
			res.writeHead(200, { "content-type": "application/json; charset=utf-8", "content-length": Buffer.byteLength(body) });
			res.end(body);
			return;
		}

		// no ".." path traversal: resolve against repoRoot and check it's still inside
		const full = join(repoRoot, path);
		if (!full.startsWith(repoRoot)) {
			res.writeHead(403);
			res.end("forbidden");
			return;
		}
		const bytes = readFileSync(full);
		const mime = MIME[extname(full)] ?? "application/octet-stream";
		res.writeHead(200, { "content-type": mime, "content-length": bytes.length });
		res.end(bytes);
	} catch (err) {
		res.writeHead(404);
		res.end(`not found: ${(err as Error).message}`);
	}
});

server.listen(port, "127.0.0.1", () => {
	console.log(`DMI sprite gallery: http://127.0.0.1:${port}/`);
	console.log("Ctrl-C to stop.");
});
