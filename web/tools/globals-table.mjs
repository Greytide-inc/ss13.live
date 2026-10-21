// globals-table.mjs - the global variable names of web/game/_globals.ts in index order, and the source key of each ("name", or "name#2", "name#3" for the later globals that share a name).
// Used by the bundler (translate-tg.mjs: rt.gl("name") -> $l(index)).
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export function globalNames(file = resolve(web, "game/_globals.ts")) {
	const m = readFileSync(file, "utf8").match(/rt\.globals\(\[\n([\s\S]*?)\n\]\);/);
	if (!m) throw new Error(`${file}: no rt.globals([...]) table`);
	return [...m[1].matchAll(/^\t\[("(?:[^"\\]|\\.)*")/gm)].map((x) => JSON.parse(x[1]));
}
/** keys[i] = the source key of global i; index = key -> i. */
export function globalKeys(names = globalNames()) {
	const seen = new Map(), keys = [], index = new Map();
	for (const n of names) {
		const c = (seen.get(n) ?? 0) + 1;
		seen.set(n, c);
		const k = c === 1 ? n : `${n}#${c}`;
		index.set(k, keys.length);
		keys.push(k);
	}
	return { keys, index };
}
