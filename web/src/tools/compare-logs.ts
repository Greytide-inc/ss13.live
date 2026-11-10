// compare-logs - Check a VM boot log: every milestone (world loaded, each subsystem up, round started)
// in order, and no runtime at all.
// Usage (from web/, after `npm run build`, or via `web/tools/compare-logs.sh`):
//   node build/dist/src/tools/compare-logs.js <vm-log>
// The log is one stream: world.log then the round's game.log (boot-check joins them).
// Exit code 0 only if every milestone passed and there are no runtimes.

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = resolve(fileURLToPath(import.meta.url), "../../../../../..");

// -------------------------------------------------------------------------------------------
// 1. Milestones: the key lines of a Box boot, in the order they must appear. Once read off the
//    recorded BYOND boot (archive/byond-reference/byond-boot.log); now kept here. Left out: "World opened on
//    network port" (DreamDaemon's own networking) and XKeyScore (removed on purpose).
//    A line matches a milestone by its kind; times, counts and coordinates are free.
// -------------------------------------------------------------------------------------------
export interface Milestone {
	kind: string; // stable id used to find the matching line; "subsystem:Name" for subsystems
	label: string; // readable text for the report
	expected?: string; // for milestones whose *value* (not just presence) must match: the mode
}

const SUBSYSTEMS_BEFORE_MAP = ["Server Tasks", "Jobs", "Events", "Ticker"];
const SUBSYSTEMS_AFTER_ATOMS = ["Language", "Machines", "Shuttle", "Weather", "Atmospherics", "Minimap", "Assets", "Icon Smoothing", "Overlay", "Lighting", "Persistence"];
const sub = (name: string): Milestone => ({ kind: `subsystem:${name}`, label: `Initialized ${name} subsystem` });

export const MILESTONES: readonly Milestone[] = [
	{ kind: "map_config", label: "map_config not found: data/next_map.json" },
	{ kind: "global_vars", label: "<n> global variables" },
	{ kind: "world_loaded", label: "World loaded at <time>" },
	...SUBSYSTEMS_BEFORE_MAP.map(sub),
	{ kind: "loading_map", label: "Loading Box Station..." },
	{ kind: "loaded_station", label: "Loaded station in <t>s!" },
	sub("Mapping"),
	{ kind: "atoms", label: "Initialized <n> atoms" },
	sub("Atoms"),
	...SUBSYSTEMS_AFTER_ATOMS.map(sub),
	{ kind: "init_complete", label: "Initializations complete within <t> seconds!" },
	{ kind: "game_start", label: "Game start took <t>s" },
	{ kind: "mode", label: "mode 'extended'", expected: "extended" },
];

interface ClassifyResult {
	kind: string;
	value?: string; // captured value: the mode string
}

const MILESTONE_PATTERNS: { kind: string; regex: RegExp }[] = [
	{ kind: "map_config", regex: /^map_config .*$/ },
	{ kind: "global_vars", regex: /^\d+ global variables$/ },
	{ kind: "world_loaded", regex: /^World loaded at \d\d:\d\d:\d\d$/ },
	{ kind: "subsystem", regex: /^Initialized (.+) subsystem within [\d.]+ seconds!$/ },
	{ kind: "loading_map", regex: /^Loading (.+)\.\.\.$/ },
	{ kind: "loaded_station", regex: /^Loaded station in \d+(?:\.\d+)?s!$/ },
	{ kind: "atoms", regex: /^Initialized \d+ atoms$/ },
	{ kind: "init_complete", regex: /^Initializations complete within [\d.]+ seconds!$/ },
	{ kind: "game_start", regex: /^Game start took \d+(?:\.\d+)?s$/ },
	{ kind: "mode", regex: /^(?:\[\d\d:\d\d:\d\d\])?GAME: Saved mode is '(\w+)'$/ },
];

function classifyLine(rawLine: string): ClassifyResult | null {
	const line = rawLine.replace(/\r$/, "");
	for (const p of MILESTONE_PATTERNS) {
		const m = line.match(p.regex);
		if (m) {
			if (p.kind === "subsystem") return { kind: `subsystem:${m[1]}` };
			return { kind: p.kind, value: p.kind === "mode" ? m[1] : undefined };
		}
	}
	return null;
}

export interface MilestoneCheck {
	milestone: Milestone;
	status: "pass" | "missing" | "out-of-order" | "wrong-value";
	foundLine?: number; // 1-based line number in the checked log
	foundValue?: string;
}

/** Check an ordered milestone list against a (VM) log's text. */
export function checkMilestones(milestones: readonly Milestone[], logText: string): MilestoneCheck[] {
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
// 2. Runtimes. A "Runtime in <file>,<line>: <message>" line's signature is the proc it happened in (its
//    "proc name: X (/path)" line); no proc line: "file,line". The message text is free text.
// -------------------------------------------------------------------------------------------
const RUNTIME_RE = /^(?:\[\d\d:\d\d:\d\d\]\s?)?Runtime in ([^,]+),(\d+): (.*)$/;

export interface RuntimeHit {
	signature: string; // "/datum/getrev/New" (the proc), or "file.dm,123" with no proc line
	where: string; // "getrev.dm,27"
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
		const proc = detail.find((l) => l.startsWith("proc name:"))?.match(/\((\/[^)]*)\)$/)?.[1];
		out.push({ signature: proc ?? `${m[1]},${m[2]}`, where: `${m[1]},${m[2]}`, message: m[3], line: i + 1, detail });
	});
	return out;
}

export type RuntimeReport = RuntimeHit;

// Every runtime in the VM log counts: there is no list of known ones.
export function compareRuntimes(vmLogText: string): RuntimeReport[] {
	return findRuntimes(vmLogText);
}

// -------------------------------------------------------------------------------------------
// 3. CLI: read the log, run both checks, print the report, set exit code.
// -------------------------------------------------------------------------------------------
export interface CompareResult {
	milestoneChecks: MilestoneCheck[];
	runtimes: RuntimeReport[];
	passed: number;
	total: number;
	newRuntimes: number;
	ok: boolean;
}

export function compareLogs(vmLogText: string, milestones: readonly Milestone[] = MILESTONES): CompareResult {
	const milestoneChecks = checkMilestones(milestones, vmLogText);
	const runtimes = compareRuntimes(vmLogText);
	const passed = milestoneChecks.filter((c) => c.status === "pass").length;
	const total = milestoneChecks.length;
	const newRuntimes = runtimes.length;
	return { milestoneChecks, runtimes, passed, total, newRuntimes, ok: passed === total && newRuntimes === 0 };
}

export function printReport(result: CompareResult): void {
	console.log("=== Milestones ===");
	for (const c of result.milestoneChecks) {
		const tag = c.status === "pass" ? "pass   " : c.status === "missing" ? "missing" : c.status === "wrong-value" ? "wrong  " : "OOO    ";
		let extra = "";
		if (c.status === "pass") extra = ` (line ${c.foundLine})`;
		else if (c.status === "out-of-order") extra = ` (found at line ${c.foundLine}, but before an earlier milestone)`;
		else if (c.status === "wrong-value") extra = ` (found '${c.foundValue}' at line ${c.foundLine}, wanted '${c.milestone.expected}')`;
		console.log(`[${tag}] ${c.milestone.label}${extra}`);
	}
	console.log("\n=== Runtimes ===");
	if (result.runtimes.length === 0) {
		console.log("(none found in the VM log)");
	}
	for (const r of result.runtimes) {
		console.log(`NEW  ${r.where} (${r.signature}): ${r.message} (line ${r.line})`);
	}

	console.log(`\n=== Summary ===`);
	console.log(`milestones ${result.passed}/${result.total}, new runtimes ${result.newRuntimes}`);
}

function main(argv: string[]): number {
	if (argv.length !== 1) {
		console.error("usage: compare-logs <vm-log>");
		return 2;
	}
	const vmLogPath = resolve(argv[0]);
	if (!existsSync(vmLogPath)) {
		console.error(`VM log not found: ${vmLogPath}`);
		return 2;
	}
	const result = compareLogs(readFileSync(vmLogPath, "utf8"));
	printReport(result);
	return result.ok ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	process.exitCode = main(process.argv.slice(2));
}
