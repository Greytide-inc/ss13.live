// script-check - dt-in: checks a scripted run's log against its script.
// Usage: node build/dist/src/tools/diff/script-check.js SCRIPT.txt BOOT.log
//   1. every action line in the script has exactly one "[script] tick T ...: VERB ARGS -> RESULT" line in the log
//   2. no action's result is "no target ...", "no mob", "no client", "ERROR ..."; no goto "gave up" / "no path"
//   3. each `# expect N: REGEX` line in the script (N = minimum matching log lines, default 1) is met by the log's [script] lines
// Prints one line per problem and a summary; exit 0 = every action happened and every expectation was met.

import { readFileSync } from "node:fs";
import { parseScript } from "../../worker/scenario-script.js";

const [scriptFile, logFile] = process.argv.slice(2);
if (!scriptFile || !logFile) { console.error("usage: script-check SCRIPT.txt BOOT.log"); process.exit(2); }

const srcText = readFileSync(scriptFile, "utf8");
const actions = parseScript(srcText);
const lines = readFileSync(logFile, "utf8").split("\n").filter((l) => l.startsWith("[script] "));
const problems: string[] = [];

// 1 + 2: one log line per action, in order (a log line is "[script] tick T world.time W: VERB ARGS -> RESULT")
const done = lines.filter((l) => /^\[script\] tick \d+ world\.time [\d.]+: \S+ .*? -> /.test(l) && !/: goto \S+ -> (arrived|gave up|no target|in doorway)/.test(l));
let at = 0, ok = 0;
for (const a of actions) {
	const want = `: ${a.verb} ${a.args} -> `;
	let found = -1;
	for (let i = at; i < done.length; i++) if (done[i].includes(want)) { found = i; break; }
	if (found < 0) { problems.push(`line ${a.line}: no log line for "${a.text}"`); continue; }
	at = found + 1;
	const res = done[found].slice(done[found].indexOf(want) + want.length);
	if (/^(no target|no mob|no client|ERROR)/.test(res)) problems.push(`line ${a.line}: "${a.text}" -> ${res.slice(0, 120)}`);
	else ok++;
}
for (const l of lines) if (/: goto \S+ -> (gave up|no target|no path)/.test(l)) problems.push(l.slice(0, 200));

// expectations
let exp = 0;
for (const m of srcText.matchAll(/^#\s*expect(?:\s+(\d+))?\s*:\s*(.+)$/gm)) {
	exp++;
	const n = Number(m[1] ?? 1), re = new RegExp(m[2].trim());
	const c = lines.filter((l) => re.test(l)).length;
	console.log(`  expect ${n}+ ${c >= n ? "ok  " : "FAIL"} (${c}): ${m[2].trim()}`);
	if (c < n) problems.push(`expectation not met (${c} < ${n}): ${m[2].trim()}`);
}
for (const p of problems) console.log("PROBLEM " + p);
console.log(`script-check ${scriptFile}: ${ok}/${actions.length} actions ran, ${exp} expectations, ${problems.length} problems -> ${problems.length ? "FAIL" : "OK"}`);
process.exit(problems.length ? 1 : 0);
