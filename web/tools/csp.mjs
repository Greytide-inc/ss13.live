// csp - The game page's Content-Security-Policy allows only the inline <script>s it
// was written with, by their sha256. fixCsp(html) puts the current hashes into the page's CSP <meta> (build-static runs it after
// its own edits to index.html); tests/static/csp.test.mjs fails when worker/index.html's hashes are out of date.
//   node tools/csp.mjs           rewrite worker/index.html's hashes in place (after editing one of its inline scripts)
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function fixCsp(html) {
	const hashes = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => `'sha256-${createHash("sha256").update(m[1], "utf8").digest("base64")}'`);
	const re = /(<meta http-equiv="Content-Security-Policy" content="[^"]*script-src 'self')((?: 'sha256-[^']+')*)/;
	if (!re.test(html)) throw new Error("csp: no CSP <meta> with \"script-src 'self'\" found");
	return html.replace(re, (_, a) => a + hashes.map((h) => " " + h).join(""));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const f = join(dirname(fileURLToPath(import.meta.url)), "../worker/index.html");
	const a = readFileSync(f, "utf8"), b = fixCsp(a);
	if (a !== b) writeFileSync(f, b);
	console.log(a === b ? "csp: hashes already current" : "csp: hashes updated in worker/index.html");
}
