// error-lines.ts - where a runtime error in translated code happened, read off the JS stack only when one happens.
// tools/translate-tg.mjs builds translated-tg.js with every game file at the same lines, and writes
// translated-tg.lines.json next to it: each file's first bundle line and its rt.def lines. So the innermost
// translated-tg.js frame of the error's stack gives the game/ file:line, which the error log and tg's /exception
// (file, line) print.

/** build/translated-tg.lines.json (see tools/translate-tg.mjs). */
interface LinesFile {
	files: string[];
	starts: number[];
	/** Per file, flat: rt.def line, proc path, rt.def line, proc path, ... */
	defs: (number | string)[][];
}

let table: LinesFile | null | undefined;
/** translated-tg.js's URL, from the stack of its first rt.def call (runtime.def), for procStart. */
let bundleUrl: string | null = null;
let startLines: string[] | null = null;
const HOT_RE = /\bhot\/([^\s():]+\.ts):(\d+):\d+/;
const STACK_RE = /([a-z]+:[^\s()@]*?translated-tg\.js)(?:\?[^:\s()]*)?:(\d+):(\d+)/g;

function load(bundleUrl: string): LinesFile | null {
	try {
		const url = new URL("translated-tg.lines.json", bundleUrl);
		if (url.protocol === "file:") {
			const { readFileSync } = process.getBuiltinModule("node:fs");
			const { fileURLToPath } = process.getBuiltinModule("node:url");
			return JSON.parse(readFileSync(fileURLToPath(url), "utf8")) as LinesFile;
		}
		const x = new XMLHttpRequest(); // only on the first runtime error; a worker may load synchronously
		x.open("GET", url.href, false);
		x.send();
		return x.status === 200 ? (JSON.parse(x.responseText) as LinesFile) : null;
	} catch {
		return null;
	}
}

/** called by runtime.def on the bundle's first rt.def: remembers the bundle's URL from the call's stack. */
export function noteBundle(stack: string | undefined): void {
	if (bundleUrl !== null || !stack) return;
	for (const m of stack.matchAll(STACK_RE)) return void (bundleUrl = m[1]);
}

/**
 * "game/code/.../x.ts:line" of proc number `id`'s rt.def (the id-th rt.def of the game files, in bundle order), or "?:0"
 * if the table isn't there. What tg's error fallback and the heartbeat stacks print for a translated frame with no
 * position of its own. Loads translated-tg.lines.json on first use.
 */
export function procStart(id: number): string {
	if (startLines === null) {
		if (table === undefined && bundleUrl !== null) table = load(bundleUrl);
		if (!table) return "?:0";
		const out: string[] = [];
		table.files.forEach((file, fi) => {
			const defs = table!.defs[fi];
			for (let i = 0; i < defs.length; i += 2) out.push(`game/${file}:${defs[i]}`);
		});
		startLines = out;
	}
	return startLines[id] ?? "?:0";
}

/**
 * Where `err` (a JS error thrown by translated code) happened in proc `procPath`: its innermost translated-tg.js stack
 * frame in that proc (an error a proc carries up to its caller is reported for each). Null if the stack doesn't show
 * the proc (e.g. a proc replaced by hand-written JS).
 */
export function errorSource(err: unknown, procPath: string): string | null {
	const stack = err instanceof Error ? err.stack : undefined;
	if (!stack) return null;
	// a file loaded into the running world (runtime.hotSwap) is its own script, hot/FILE.ts, with the game file's lines.
	// The build's line table doesn't fit an edited file, so the innermost such frame is reported as it stands.
	const h = HOT_RE.exec(stack), b = stack.indexOf("translated-tg.js");
	if (h !== null && (b < 0 || h.index < b)) return `game/${h[1]}:${h[2]} (hot-loaded)`;
	for (const m of stack.matchAll(STACK_RE)) {
		if (table === undefined) table = load(m[1]);
		if (!table) return null;
		const r = at(table, Number(m[2]), procPath);
		if (r !== null) return r;
	}
	return null;
}

/** "game/FILE:line" for bundle line b, if that's in proc procPath. */
function at(table: LinesFile, b: number, procPath: string): string | null {
	const starts = table.starts;
	let lo = 0, hi = starts.length - 1;
	while (lo < hi) {
		const mid = (lo + hi + 1) >> 1;
		if (starts[mid] <= b) lo = mid;
		else hi = mid - 1;
	}
	if (starts[lo] > b) return null;
	const line = b - starts[lo] + 1, defs = table.defs[lo];
	let d = -1;
	for (let i = 0; i < defs.length && (defs[i] as number) <= line; i += 2) d = i;
	if (d < 0 || defs[d + 1] !== procPath) return null;
	return `game/${table.files[lo]}:${line}`;
}
