// rebuild-log - Adds one line to REBUILDS.log (repo root, not in git) each time the playable copy (web/dist) or a saved round is rebuilt:
// what, the commit it was built from, who started it (SS13_REBUILD=1 marks the launcher script), when.
import { appendFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "../..");

export function logRebuild(what, warnings = []) {
	let ver = "?";
	try {
		ver = execSync("git rev-parse --short HEAD", { cwd: repo, encoding: "utf8" }).trim();
		if (execSync("git status --porcelain --untracked-files=no", { cwd: repo, encoding: "utf8" }).trim()) ver += " + uncommitted edits";
	} catch {}
	const by = process.env.SS13_REBUILD ? "ss13 script" : "by hand";
	const d = new Date(), p = (n) => String(n).padStart(2, "0");
	const at = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
	appendFileSync(join(repo, "REBUILDS.log"), `REBUILD ${what.padEnd(26)} VERSION ${ver.padEnd(30)} FROM ${by.padEnd(12)} AT ${at}\n` + warnings.map((w) => `        WARNING: ${w}\n`).join(""));
}
