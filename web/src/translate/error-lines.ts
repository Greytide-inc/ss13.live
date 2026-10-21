// error-lines.ts - where a runtime error in translated code happened, read off the JS stack only when one happens.
// tools/translate-tg.mjs builds translated-tg.js with every game file at the same lines and columns, and writes
// translated-tg.lines.json next to it: each file's first bundle line, its rt.def lines, and game/_dm-lines.json (each
// proc's DM file:line by game line and column, kept from the old `f.at = N` statements by tools/strip-at.mjs). So the
// innermost translated-tg.js frame of the error's stack gives the game/ file:line, and from there the DM file:line,
// which tg's /exception (file, line) and so compare-logs still use.

/** build/translated-tg.lines.json (see tools/translate-tg.mjs). */
interface LinesFile {
	files: string[];
	starts: number[];
	/** Per file, flat: rt.def line, proc path, rt.def line, proc path, ... */
	defs: (number | string)[][];
	/** "file|path" (#n for the n-th def of a path in one file): [DM file, DM line at the rt.def, (line, column, DM line)...]. */
	dm: Record<string, (number | string)[]>;
}

export interface ErrorSource {
	/** "game/code/.../x.ts:12" */
	game: string;
	/** "code/.../x.dm:103", or null if the proc has no DM lines (written at translation time). */
	dm: string | null;
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
 * "file.dm:line" where proc number `id` (the id-th rt.def of the game files, in bundle order) starts in the DM
 * source, or "?:0" if it has no DM lines. What tg's error fallback and the heartbeat stacks print for a translated
 * frame (the bytecode's SourceInfo at offset 0 before the JSON went). Loads translated-tg.lines.json on first use.
 */
export function procStart(id: number): string {
	if (startLines === null) {
		if (table === undefined && bundleUrl !== null) table = load(bundleUrl);
		if (!table) return "?:0";
		const out: string[] = [];
		table.files.forEach((file, fi) => {
			const defs = table!.defs[fi], nth = new Map<string, number>();
			for (let i = 1; i < defs.length; i += 2) {
				const path = defs[i] as string, n = (nth.get(path) ?? 0) + 1;
				nth.set(path, n);
				const e = table!.dm[`${file}|${path}${n > 1 ? `#${n}` : ""}`];
				out.push(e ? `${e[0]}:${e[1]}` : "?:0");
			}
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
export function errorSource(err: unknown, procPath: string): ErrorSource | null {
	const stack = err instanceof Error ? err.stack : undefined;
	if (!stack) return null;
	// a file loaded into the running world (runtime.hotSwap) is its own script, hot/FILE.ts, with the game file's lines.
	// The build's line table doesn't fit an edited file, so the innermost such frame is reported as it stands, with no DM line.
	const h = HOT_RE.exec(stack), b = stack.indexOf("translated-tg.js");
	if (h !== null && (b < 0 || h.index < b)) return { game: `game/${h[1]}:${h[2]} (hot-loaded)`, dm: null };
	for (const m of stack.matchAll(STACK_RE)) {
		if (table === undefined) table = load(m[1]);
		if (!table) return null;
		const r = at(table, Number(m[2]), Number(m[3]) - 1, procPath);
		if (r !== null) return r;
	}
	return null;
}

/** Bundle line b, column col, if that's in proc procPath. */
function at(table: LinesFile, b: number, col: number, procPath: string): ErrorSource | null {
	const starts = table.starts;
	let lo = 0, hi = starts.length - 1;
	while (lo < hi) {
		const mid = (lo + hi + 1) >> 1;
		if (starts[mid] <= b) lo = mid;
		else hi = mid - 1;
	}
	if (starts[lo] > b) return null;
	const file = table.files[lo], line = b - starts[lo] + 1, defs = table.defs[lo];
	let d = -1;
	for (let i = 0; i < defs.length && (defs[i] as number) <= line; i += 2) d = i;
	if (d < 0 || defs[d + 1] !== procPath) return null;
	let nth = 1;
	for (let i = 0; i < d; i += 2) if (defs[i + 1] === procPath) nth++;
	const e = table.dm[`${file}|${procPath}${nth > 1 ? `#${nth}` : ""}`];
	const game = `game/${file}:${line}`;
	if (!e) return { game, dm: null };
	const rel = line - (defs[d] as number);
	let v = e[1], exact: number | string | undefined;
	for (let i = 2; i < e.length; i += 3) {
		const l = e[i] as number, c = e[i + 1] as number;
		if (c < 0) {
			if (l === rel && -1 - c === col) exact = e[i + 2];
		} else if (l < rel || (l === rel && c <= col)) v = e[i + 2];
	}
	if (exact !== undefined) v = exact;
	return { game, dm: typeof v === "number" ? `${e[0]}:${v}` : v };
}
