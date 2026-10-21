// shadow-paint.test - the cast shadows painter (src/render/sight-shadow-paint.ts) in headless Chromium: a repaint after the eye moved
// matches a fresh painter's first paint of the same spot (the old one cleared its counting canvas at 1/16 strength after the first paint,
// so soft edges came out too dark), and prints the ms a paint takes (software canvas: a browser drawing on the GPU may differ).
// Usage: npm run build, then node tests/static/shadow-paint.test.mjs   (a few seconds)
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const web = join(dirname(fileURLToPath(import.meta.url)), "..", ".."), dist = join(web, "build", "dist");
const H = process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell";
const prof = join(web, "build", "shadow-paint-test-profile");
const page = `<script type="module">
import { shadowPainter } from "/src/render/sight-shadow-paint.js";
import { packOpacity } from "/src/render/sight-shadow.js";
const w = 23, h = 19; let s = 7; const r = () => (s = (s * 1103515245 + 12345) % 2147483648) % 100;
const o = new Uint8Array(w * h).map((_, k) => (k % w === 0 || k % w === 8 || k % w === 14 || (k / w | 0) === 6 || r() < 15) ? 1 : 0);
o[11 + 9 * w] = 0;
const opq = packOpacity(100, 100, w, h, o);
const alpha = (p) => Array.from(p.canvas.getContext("2d").getImageData(0, 0, p.canvas.width, p.canvas.height).data.filter((_, i) => i % 4 === 3));
const p = shadowPainter(); let ms = 0;
for (let i = 0; i < 200; i++) ms += p.paint(opq, 111.5 + (i % 32) / 32, 109.5 + 0.01 * i, "full").ms;
const again = alpha(p.paint(opq, 111.7, 109.3, "full")), fresh = alpha(shadowPainter().paint(opq, 111.7, 109.3, "full"));
let differ = 0, most = 0; again.forEach((v, i) => { const d = Math.abs(v - fresh[i]); if (d) differ++; most = Math.max(most, d); });
fetch("/result", { method: "POST", body: JSON.stringify({ ms: ms / 200, pixels: fresh.length, differ, most }) });
</script>`;
if (!existsSync(join(dist, "src/render/sight-shadow-paint.js"))) { console.log("FAIL no build: run npm run build first"); process.exit(1); }
let done;
const result = new Promise((r) => (done = r));
const srv = createServer((q, r) => {
	if (q.method === "POST") { let b = ""; q.on("data", (d) => (b += d)); q.on("end", () => { r.end(); done(JSON.parse(b)); }); return; }
	const p = q.url.split("?")[0];
	if (p === "/") { r.writeHead(200, { "content-type": "text/html" }).end(page); return; }
	const f = join(dist, p);
	if (!f.startsWith(dist) || !existsSync(f)) { r.writeHead(404).end(); return; }
	r.writeHead(200, { "content-type": "text/javascript" }).end(readFileSync(f));
}).listen(8496, "127.0.0.1");
rmSync(prof, { recursive: true, force: true });
const chrome = spawn(H, ["--no-sandbox", "--headless", `--user-data-dir=${prof}`, "http://127.0.0.1:8496/"], { stdio: "ignore" });
const res = await Promise.race([result, new Promise((r) => setTimeout(() => r(null), 30000))]);
chrome.kill(); srv.close();
if (!res) { console.log("FAIL no answer from the page in 30 s"); process.exit(1); }
console.log(`a paint: ${res.ms.toFixed(2)} ms (software canvas)`);
const ok = res.differ === 0;
console.log((ok ? "ok   " : "FAIL ") + `a repaint matches a fresh paint (${res.differ} of ${res.pixels} pixels differ, by up to ${res.most})`);
process.exit(ok ? 0 : 1);
