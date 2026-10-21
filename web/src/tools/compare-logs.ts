// compare-logs - Compare a VM boot log against the BYOND reference log.
// Usage (from web/, after `npm run build`, or via `web/tools/compare-logs.sh`):
//   node build/dist/src/tools/compare-logs.js <vm-log> [options]
//   --reference <file>    default web/reference/byond-boot.log
//   --game-log <file>     default web/reference/byond-data-logs/game.log (optional; only used for
//                         the "mode 'extended'" milestone -- omit if the VM log has no such file)
//   --runtime-log <file>  default web/reference/byond-data-logs/runtime.log (optional; extra known
//                         runtime signatures, in case any show up there and not in byond-boot.log)
//   --no-game-log / --no-runtime-log   skip the optional reference file entirely (no missing-file warning)
//
// Reports milestones (ordered key lines, pass/missing/out-of-order), a runtime signature diff
// (known-vs-new), and a summary line. Exit code 0 only if every milestone passed and there are
// zero new runtimes.

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = resolve(fileURLToPath(import.meta.url), "../../../../../..");

// -------------------------------------------------------------------------------------------
// 1. Tolerance table: text a real BYOND run varies between boots. Each rule strips or replaces
//    the random/time-dependent part of a line before it's used for comparison, so two logs from
//    different runs (or different RNG seeds) still match on everything that should be identical.
// -------------------------------------------------------------------------------------------
interface ToleranceRule {
	name: string; // for --stats / debugging only
	pattern: RegExp;
	replace: string; // passed to String.replace; may reference capture groups ($1, ...)
	note: string;
}

export const TOLERANCE_RULES: readonly ToleranceRule[] = [
	{ name: "log-timestamp", pattern: /^\[\d\d:\d\d:\d\d\]\s?/, replace: "", note: "world.log prefixes runtime dump lines with [HH:MM:SS]; wall time obviously differs run to run" },
	{ name: "boot-date-line", pattern: /^\w{3} \w{3} +\d+ \d\d:\d\d:\d\d \d{4}$/, replace: "<date>", note: "DreamDaemon's startup banner date/time" },
	{ name: "clock-time", pattern: /\b\d\d:\d\d:\d\d\b/, replace: "<time>", note: "'World loaded at 17:18:01' etc." },
	{ name: "duration-seconds", pattern: /within [\d.]+ seconds!/, replace: "within <t> seconds!", note: "every 'Initialized X subsystem within N seconds!' and 'Initializations complete within N seconds!' line" },
	{ name: "duration-s-suffix", pattern: /\b\d+(?:\.\d+)?s(!|\b)/, replace: "<t>s$1", note: "'Loaded station in 3s!' and 'Game start took 0s' (tg prints decimals too: '50.6s')" },
	{ name: "atom-count", pattern: /^Initialized \d+ atoms$/, replace: "Initialized <n> atoms", note: "atom count depends on which ruins/caves generated (random)" },
	{ name: "ruin-placement", pattern: /^Ruin ".*" placed at \(\d+, \d+, \d+\)$/, replace: 'Ruin "<name>" placed at <coords>', note: "ruin choice and position are random every boot" },
	{ name: "ruin-loaded", pattern: /^GAME: .* loaded at at \d+,\d+,\d+$/, replace: "GAME: <ruin> loaded at at <coords>", note: "game.log's mirror of the ruin-placement lines" },
	{ name: "turf-coords", pattern: /\(\d+,\s*\d+,\s*\d+\)/, replace: "<coords>", note: "coordinates inside runtime tracebacks (e.g. the random asteroid-cave runtime)" },
	{ name: "active-turf-count", pattern: /There are \d+ active turfs/, replace: "There are <n> active turfs", note: "roundstart atmos-difference warning count, depends on random map generation" },
	{ name: "wasted-turf-count", pattern: /[\d.]+ Seconds were wasted processing \d+ turf\(s\) \(connected to \d+ other turfs\)/, replace: "<t> Seconds were wasted processing <n> turf(s) (connected to <n> other turfs)", note: "same roundstart atmos warning, the other half" },
];

export function normalizeLine(line: string): string {
	let s = line;
	for (const rule of TOLERANCE_RULES) s = s.replace(rule.pattern, rule.replace);
	return s;
}

// -------------------------------------------------------------------------------------------
// 2. Milestones. Rather than hand-typing the subsystem list, we scan the reference log itself:
//    every "Initialized X subsystem ..." line becomes its own ordered milestone, in the order it
//    appears in web/reference/byond-boot.log. Everything else (world open, map load, atom count,
//    init complete, game start, and -- if a game.log is given -- the saved mode) is a fixed
//    landmark. Milestones are produced by walking a log top to bottom and classifying each line;
//    the reference log's classified stream *is* the ordered milestone list.
// -------------------------------------------------------------------------------------------
export interface Milestone {
	kind: string; // stable id used to find the matching line in another log; "subsystem:Name" for subsystems
	label: string; // human-readable, normalized text for the report
	expected?: string; // for milestones whose *value* (not just presence) must match, e.g. mode
}

// Lines DreamDaemon itself prints (not tg's game code) that the VM has no equivalent for and never
// will: "World opened on network port N." comes from BYOND's own networking, which the VM doesn't
// have. These milestones are reported as "n/a" rather than "missing"/"pass" and
// don't count toward the pass/total tally, so a clean boot can still exit 0.
const HOST_ONLY_KINDS = new Set<string>([
	"world_opened",
	// tg_js removed this subsystem on purpose (getipintel): the reference log still has its line.
	"subsystem:XKeyScore",
]);

interface ClassifyResult {
	kind: string;
	label: string;
	value?: string; // captured value, e.g. the subsystem name or the mode string
}

const MILESTONE_PATTERNS: { kind: string; regex: RegExp; label: (m: RegExpMatchArray) => string; value?: (m: RegExpMatchArray) => string }[] = [
	{ kind: "world_opened", regex: /^World opened on network port \d+\.$/, label: () => "World opened on network port <port>." },
	{ kind: "map_config", regex: /^map_config .*$/, label: (m) => normalizeLine(m[0]) },
	{ kind: "global_vars", regex: /^(\d+) global variables$/, label: () => "<n> global variables" },
	{ kind: "world_loaded", regex: /^World loaded at \d\d:\d\d:\d\d$/, label: () => "World loaded at <time>" },
	{ kind: "subsystem", regex: /^Initialized (.+) subsystem within [\d.]+ seconds!$/, label: (m) => `Initialized ${m[1]} subsystem`, value: (m) => m[1] },
	{ kind: "loading_map", regex: /^Loading (.+)\.\.\.$/, label: (m) => `Loading ${m[1]}...` },
	{ kind: "loaded_station", regex: /^Loaded station in \d+(?:\.\d+)?s!$/, label: () => "Loaded station in <t>s!" },
	{ kind: "atoms", regex: /^Initialized \d+ atoms$/, label: () => "Initialized <n> atoms" },
	{ kind: "init_complete", regex: /^Initializations complete within [\d.]+ seconds!$/, label: () => "Initializations complete within <t> seconds!" },
	{ kind: "game_start", regex: /^Game start took \d+(?:\.\d+)?s$/, label: () => "Game start took <t>s" },
	{ kind: "mode", regex: /^(?:\[\d\d:\d\d:\d\d\])?GAME: Saved mode is '(\w+)'$/, label: (m) => `mode '${m[1]}'`, value: (m) => m[1] },
];

function classifyLine(rawLine: string): ClassifyResult | null {
	const line = rawLine.replace(/\r$/, "");
	for (const p of MILESTONE_PATTERNS) {
		const m = line.match(p.regex);
		if (m) {
			const kind = p.kind === "subsystem" ? `subsystem:${m[1]}` : p.kind;
			return { kind, label: p.label(m), value: p.value?.(m) };
		}
	}
	return null;
}

/** Build the ordered milestone list by classifying every line of the reference log(s), in order. */
export function buildMilestones(referenceText: string, gameLogText?: string): Milestone[] {
	const out: Milestone[] = [];
	for (const line of referenceText.split("\n")) {
		const c = classifyLine(line);
		if (c) out.push({ kind: c.kind, label: c.label, expected: c.value });
	}
	if (gameLogText) {
		for (const line of gameLogText.split("\n")) {
			const c = classifyLine(line);
			if (c && c.kind === "mode") out.push({ kind: c.kind, label: c.label, expected: c.value });
		}
	}
	return out;
}

export interface MilestoneCheck {
	milestone: Milestone;
	status: "pass" | "missing" | "out-of-order" | "wrong-value" | "n/a";
	foundLine?: number; // 1-based line number in the checked log
	foundValue?: string;
}

/** Check an ordered milestone list against a (VM) log's text. */
export function checkMilestones(milestones: Milestone[], logText: string): MilestoneCheck[] {
	const lines = logText.split("\n");
	// Classify every line once, keyed by kind -> sorted list of {line, value}.
	const byKind = new Map<string, { line: number; value?: string }[]>();
	lines.forEach((raw, i) => {
		const c = classifyLine(raw);
		if (!c) return;
		if (!byKind.has(c.kind)) byKind.set(c.kind, []);
		byKind.get(c.kind)!.push({ line: i + 1, value: c.value });
	});

	const results: MilestoneCheck[] = [];
	let cursor = 0; // last matched line number; next milestone must be found at or after this to count as in-order
	for (const ms of milestones) {
		if (HOST_ONLY_KINDS.has(ms.kind)) {
			results.push({ milestone: ms, status: "n/a" });
			continue;
		}
		const candidates = byKind.get(ms.kind) ?? [];
		// If the milestone requires a specific value (mode), only candidates with that value count.
		const matching = ms.expected !== undefined && ms.kind === "mode" ? candidates.filter((c) => c.value === ms.expected) : candidates;
		if (matching.length === 0) {
			// distinguish "present but wrong value" from "not present at all" for the mode milestone
			if (ms.kind === "mode" && candidates.length > 0) {
				results.push({ milestone: ms, status: "wrong-value", foundLine: candidates[0].line, foundValue: candidates[0].value });
			} else {
				results.push({ milestone: ms, status: "missing" });
			}
			continue;
		}
		// earliest occurrence at or after the cursor is in-order; otherwise it exists but out of order
		const inOrder = matching.find((c) => c.line >= cursor);
		if (inOrder) {
			results.push({ milestone: ms, status: "pass", foundLine: inOrder.line, foundValue: inOrder.value });
			cursor = inOrder.line + 1;
		} else {
			results.push({ milestone: ms, status: "out-of-order", foundLine: matching[0].line, foundValue: matching[0].value });
		}
	}
	return results;
}

// -------------------------------------------------------------------------------------------
// 3. Runtimes. A "Runtime in <file>,<line>: <message>" line's (file, line) pair is its signature.
//    The message text is not part of the signature: it's free text and not worth matching exactly.
// -------------------------------------------------------------------------------------------
const RUNTIME_RE = /^(?:\[\d\d:\d\d:\d\d\]\s?)?Runtime in ([^,]+),(\d+): (.*)$/;

export interface RuntimeHit {
	signature: string; // "file.dm,123"
	message: string;
	line: number; // 1-based line number where the "Runtime in ..." line was found
	detail: string[]; // the indented lines that follow it (proc name, src, call stack)
}

export function findRuntimes(logText: string): RuntimeHit[] {
	const out: RuntimeHit[] = [];
	const lines = logText.split("\n").map((l) => l.replace(/\r$/, ""));
	lines.forEach((raw, i) => {
		const m = raw.match(RUNTIME_RE);
		if (!m) return;
		const detail: string[] = [];
		for (let j = i + 1; j < lines.length && /^\s+\S/.test(lines[j]); j++) detail.push(lines[j].trim());
		out.push({ signature: `${m[1]},${m[2]}`, message: m[3], line: i + 1, detail });
	});
	return out;
}

export interface RuntimeReport {
	signature: string;
	message: string;
	line: number;
	known: boolean; // true if this signature also appears in the reference (boot log and/or runtime.log)
	race?: string; // set when it matches TIMING_RACES: a real tg race; reported, but not counted as new
	variant?: string; // set when it matches TG_BUG_VARIANTS: another form of a reference runtime; not counted
	rngBug?: string; // set when it matches RNG_TG_BUGS: a real tg bug that only triggers by chance; not counted
}

// Runtimes that are genuine races in tg's own DM code, which real BYOND hits too under the same
// interleaving, but which a short BYOND reference boot is unlikely to show because they need a
// subsystem to pause mid-run (MC_TICK_CHECK) at the wrong moment -- and the VM, being slower per
// tick, pauses far more often. Matched on signature AND exact message so nothing else slips through.
// Each entry needs a measured reason.
export const TIMING_RACES: { signature: string; message: string; note: string }[] = [
	{
		signature: "npcpool.dm,48",
		message: "Cannot read null.ckey",
		note:
			"SSnpcpool walks a Copy() of GLOB.simple_animals across paused fires; a mob qdel'd meanwhile is " +
			"hard-deleted by SSgarbage (/mob/Destroy returns QDEL_HINT_HARDDEL), and BYOND's del nulls the " +
			"list entry (measured: tests/dm test_bb_del_nulls_list_copy)",
	},
];

// Runtimes that are a second form of a tg bug the reference already shows, where which form
// appears depends only on random map generation. Each entry is matched on signature AND exact
// message, and its `matches` check must tie the hit to the sibling runtime the reference has,
// so the same line failing for any other reason is still NEW.
const COORDS_RE = /\((\d+),(\d+),(\d+)\)/;
function coordsOf(line: string | undefined): [number, number, number] | null {
	const m = line?.match(COORDS_RE);
	return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

export const TG_BUG_VARIANTS: {
	signature: string;
	message: string;
	note: string;
	matches: (hit: RuntimeHit, all: RuntimeHit[]) => boolean;
}[] = [
	{
		// Null-air asteroid cave bug: sibling open.dm,103 lands after
		// this hit for a west/south neighbour, before it for an east/north one.
		signature: "gas_mixture.dm,395",
		message: "Cannot read null.gases",
		note:
			"a west/south neighbour of a null-air random cave reached it first in setup_allturfs, or an " +
			"east/north one was linked by the cave's own turn just before the cave crashed on it; same tg " +
			"bug as the reference's open.dm,103 null.compare() (asteroid cave Initialize skips ..() when its " +
			"tunnel sanity check fails)",
		matches: (hit, all) => {
			const stack = hit.detail.join("\n");
			if (!stack.includes("compare(null)") || !/setup allturfs\(\)/.test(stack)) return false;
			const from = coordsOf(hit.detail.find((l) => /: Initalize Atmos\(/.test(l)));
			if (!from) return false;
			return all.some((o) => {
				if (o.signature !== "open.dm,103" || o.message !== "Cannot execute null.compare().") return false;
				const src = o.detail.find((l) => l.startsWith("src:"));
				if (!src || !/\/turf\/open\/floor\/plating\/asteroid\/airless\/cave\b/.test(src)) return false;
				const at = coordsOf(src);
				if (!at || at[2] !== from[2]) return false;
				const isWestOrSouth = (at[0] === from[0] + 1 && at[1] === from[1]) || (at[0] === from[0] && at[1] === from[1] + 1);
				const isEastOrNorth = (from[0] === at[0] + 1 && at[1] === from[1]) || (at[0] === from[0] && from[1] === at[1] + 1);
				if (isWestOrSouth) return o.line > hit.line;
				if (isEastOrNorth) return o.line < hit.line;
				return false;
			});
		},
	},
];

// Runtimes that are real tg bugs which only trigger by chance during play (an RNG roll, or a rare
// combat/damage interleaving), so a short BYOND reference boot is unlikely to show them, but a
// real BYOND run hits the exact same runtime under the same interleaving -- proved by a DM test
// recorded in BYOND (web/tests/dm/), not by a VM-only argument. Matched on signature AND exact
// message, plus a stack check (never just line+message) so an unrelated bug at the same line
// still counts as NEW.
export const RNG_TG_BUGS: {
	signature: string;
	message: string;
	note: string;
	matches: (hit: RuntimeHit) => boolean;
}[] = [
	{
		// /obj/machinery/porta_turret/take_damage does `. = ..()`. The parent chain
		// (obj_destruction -> deconstruct -> qdel(src) -> Destroy()) runs synchronously inside that
		// ..() call when the hit is lethal, and Destroy() nulls spark_system. Back in take_damage's
		// own tail, `if(.) if(prob(30)) spark_system.start()` then runs on the now-null var. This is
		// plain DM behaviour (an override's tail keeps running after ..() already tore src down) plus
		// a 30% roll, not a VM difference: web/tests/dm/turret_bug.dm's test_ov_null_after_super
		// reproduces the identical shape (override calls ..() into a synchronous qdel-style Destroy()
		// that nulls a var, then uses it) and BYOND 511 gives the same "Cannot execute null.start()."
		// abort-that-proc-caller-continues result (recorded in expected.txt).
		signature: "portable_turret.dm,317",
		message: "Cannot execute null.start().",
		note:
			"take_damage's `. = ..()` synchronously runs obj_destruction -> deconstruct -> qdel -> Destroy, " +
			"which nulls spark_system; take_damage's own prob(30) tail then calls spark_system.start() on it. " +
			"Measured in BYOND 511 with the same shape: web/tests/dm/turret_bug.dm, test_ov_null_after_super.",
		matches: (hit) => hit.detail.some((l) => l.startsWith("proc name:") && l.includes("/obj/machinery/porta_turret/take_damage")),
	},
	{
		// A KA (holds_charge FALSE) qdel'd while stored in a storage item that a mob holds/wears.
		// atom/movable/Destroy runs datum Destroy first (which qdels the gun's active_timers), and only
		// after that `loc.handle_atom_del(src)` -> /obj/item/weapon/storage/handle_atom_del ->
		// remove_from_storage -> W.dropped(M) (storage.dm:373). kinetic_accelerator/dropped() then does
		// addtimer(empty_if_not_held, 2) on the already-destroyed gun; nothing cancels it, and it fires
		// with cell == null (energy/Destroy QDEL_NULL(cell)) and loc == null. Pure DM ordering; BYOND
		// runs the same code. Found by reading the source, not by a BYOND recording.
		signature: "kinetic_accelerator.dm,101",
		message: "Cannot read null.charge",
		note:
			"a KA qdel'd inside a mob-held storage item: atom/movable/Destroy cancels timers, then " +
			"handle_atom_del -> remove_from_storage -> dropped() re-adds the empty_if_not_held timer on the dead gun, " +
			"which fires with cell null. Source-read.",
		matches: (hit) => hit.detail.some((l) => l.startsWith("proc name:") && l.includes("kinetic_accelerator/empty")) && hit.detail.some((l) => l.includes("empty if not held()")),
	},
];

export function compareRuntimes(vmLogText: string, referenceTexts: string[]): RuntimeReport[] {
	const known = new Set<string>();
	for (const t of referenceTexts) for (const r of findRuntimes(t)) known.add(r.signature);
	const hits = findRuntimes(vmLogText);
	return hits.map((r) => {
		const race = TIMING_RACES.find((x) => x.signature === r.signature && x.message === r.message);
		const variant = TG_BUG_VARIANTS.find((x) => x.signature === r.signature && x.message === r.message && x.matches(r, hits));
		const rngBug = RNG_TG_BUGS.find((x) => x.signature === r.signature && x.message === r.message && x.matches(r));
		return {
			...r,
			known: known.has(r.signature),
			...(race ? { race: race.note } : {}),
			...(variant ? { variant: variant.note } : {}),
			...(rngBug ? { rngBug: rngBug.note } : {}),
		};
	});
}

// -------------------------------------------------------------------------------------------
// 4. CLI: read files, run the three checks, print the report, set exit code.
// -------------------------------------------------------------------------------------------
export interface CompareResult {
	milestoneChecks: MilestoneCheck[];
	runtimes: RuntimeReport[];
	passed: number;
	total: number;
	newRuntimes: number;
	ok: boolean;
}

export function compareLogs(vmLogText: string, referenceText: string, gameLogText?: string, runtimeLogText?: string): CompareResult {
	const milestones = buildMilestones(referenceText, gameLogText);
	const milestoneChecks = checkMilestones(milestones, vmLogText);
	const referenceTexts = [referenceText, ...(runtimeLogText ? [runtimeLogText] : [])];
	const runtimes = compareRuntimes(vmLogText, referenceTexts);
	const passed = milestoneChecks.filter((c) => c.status === "pass").length;
	const total = milestoneChecks.filter((c) => c.status !== "n/a").length;
	const newRuntimes = runtimes.filter((r) => !r.known && !r.race && !r.variant && !r.rngBug).length;
	return { milestoneChecks, runtimes, passed, total, newRuntimes, ok: passed === total && newRuntimes === 0 };
}

export function printReport(result: CompareResult): void {
	console.log("=== Milestones ===");
	for (const c of result.milestoneChecks) {
		const tag = c.status === "pass" ? "pass   " : c.status === "n/a" ? "n/a    " : c.status === "missing" ? "missing" : c.status === "wrong-value" ? "wrong  " : "OOO    ";
		let extra = "";
		if (c.status === "pass") extra = ` (line ${c.foundLine})`;
		else if (c.status === "n/a") extra = " (DreamDaemon's own line, or a subsystem tg_js removed on purpose)";
		else if (c.status === "out-of-order") extra = ` (found at line ${c.foundLine}, but before an earlier milestone)`;
		else if (c.status === "wrong-value") extra = ` (found '${c.foundValue}' at line ${c.foundLine}, wanted '${c.milestone.expected}')`;
		console.log(`[${tag}] ${c.milestone.label}${extra}`);
	}
	console.log("\n=== Runtimes ===");
	if (result.runtimes.length === 0) {
		console.log("(none found in the VM log)");
	}
	for (const r of result.runtimes) {
		const tag = r.known ? "known" : r.race ? "race " : r.variant ? "varnt" : r.rngBug ? "rngbg" : "NEW  ";
		let why = "";
		if (!r.known && r.race) why = ` -- tg timing race, not counted: ${r.race}`;
		else if (!r.known && r.variant) why = ` -- variant of a reference tg bug, not counted: ${r.variant}`;
		else if (!r.known && r.rngBug) why = ` -- RNG-triggered tg bug, not counted: ${r.rngBug}`;
		console.log(`${tag}  ${r.signature}: ${r.message} (line ${r.line})${why}`);
	}

	const naCount = result.milestoneChecks.filter((c) => c.status === "n/a").length;
	console.log(`\n=== Summary ===`);
	const raceCount = result.runtimes.filter((r) => r.race && !r.known).length;
	const variantCount = result.runtimes.filter((r) => r.variant && !r.known && !r.race).length;
	const rngBugCount = result.runtimes.filter((r) => r.rngBug && !r.known && !r.race && !r.variant).length;
	console.log(
		`milestones ${result.passed}/${result.total} (${naCount} n/a), new runtimes ${result.newRuntimes}, timing races ${raceCount}, tg-bug variants ${variantCount}, rng tg bugs ${rngBugCount}`,
	);
}

function readOpt(path: string | undefined, label: string): string | undefined {
	if (!path) return undefined;
	if (!existsSync(path)) {
		console.log(`(note: ${label} not found at ${path}, skipping)`);
		return undefined;
	}
	return readFileSync(path, "utf8");
}

function main(argv: string[]): number {
	let vmLogPath: string | undefined;
	let referencePath = resolve(repoRoot, "web/reference/byond-boot.log");
	let gameLogPath: string | undefined = resolve(repoRoot, "web/reference/byond-data-logs/game.log");
	let runtimeLogPath: string | undefined = resolve(repoRoot, "web/reference/byond-data-logs/runtime.log");
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === "--reference") referencePath = resolve(argv[++i]);
		else if (a === "--game-log") gameLogPath = resolve(argv[++i]);
		else if (a === "--runtime-log") runtimeLogPath = resolve(argv[++i]);
		else if (a === "--no-game-log") gameLogPath = undefined;
		else if (a === "--no-runtime-log") runtimeLogPath = undefined;
		else if (!vmLogPath) vmLogPath = resolve(argv[i]);
		else {
			console.error(`unexpected argument: ${a}`);
			return 2;
		}
	}
	if (!vmLogPath) {
		console.error("usage: compare-logs <vm-log> [--reference file] [--game-log file] [--runtime-log file]");
		return 2;
	}
	if (!existsSync(vmLogPath)) {
		console.error(`VM log not found: ${vmLogPath}`);
		return 2;
	}
	if (!existsSync(referencePath)) {
		console.error(`reference log not found: ${referencePath}`);
		return 2;
	}
	const vmLogText = readFileSync(vmLogPath, "utf8");
	const referenceText = readFileSync(referencePath, "utf8");
	const gameLogText = readOpt(gameLogPath, "game.log");
	const runtimeLogText = readOpt(runtimeLogPath, "runtime.log");

	const result = compareLogs(vmLogText, referenceText, gameLogText, runtimeLogText);
	printReport(result);
	return result.ok ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	process.exitCode = main(process.argv.slice(2));
}
