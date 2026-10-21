// test-aids - Player test aids shared by the page's boot worker and node benches (tools/view-bench.mjs):
// a round-start join (Ready as one job) and an admin ghost. Plain VM calls, no DOM, no Node imports.

import type { VM } from "../vm/interpreter.js";
import { DMObject, live } from "../vm/objects.js";
import { refOf } from "../vm/refs.js";
import type { Value } from "../vm/value.js";

const JOB_PREFS = ["civilian", "medsci", "engsec"].flatMap((dep) => ["high", "med", "low"].map((lvl) => `job_${dep}_${lvl}`));

function ticker(vm: VM): DMObject | null {
	const t = live(vm.globals[vm.tree.globalNames.indexOf("SSticker")]);
	return t instanceof DMObject ? t : null;
}

/** Holds the lobby countdown (so the round doesn't start before the player is Ready). */
export function holdLobby(vm: VM): void {
	ticker(vm)?.setVar("timeLeft", 36000);
}

/** Readies client c in the lobby as `job` alone, at High, and starts the round at once: tg's DivideOccupations then
 *  gives the job and puts the mob on its station landmark. Returns the job choices it cleared, for restoreJobPrefs
 *  once the player has spawned (null if c has no prefs). */
export function readyAtRoundStart(vm: VM, c: DMObject, job: string): Record<string, Value> | null {
	const prefs = live(c.getVar("prefs"));
	if (!(prefs instanceof DMObject)) return null;
	// Only this job, at High (Assistant is a tick box: from all-off, the click ticks it).
	const saved: Record<string, Value> = {};
	for (const k of JOB_PREFS) { saved[k] = prefs.getVar(k); prefs.setVar(k, 0); }
	vm.clients.topic(c, `_src_=prefs;preference=job;task=setJobLevel;level=1;text=${encodeURIComponent(job)}`);
	vm.clients.topic(c, `src=${refOf(c.getVar("mob"))};ready=1`);
	ticker(vm)?.setVar("start_immediately", 1);
	return saved;
}

/** Puts back the job choices readyAtRoundStart cleared, so the character setup window shows the player's own. */
export function restoreJobPrefs(c: DMObject, saved: Record<string, Value>): void {
	const prefs = live(c.getVar("prefs"));
	if (prefs instanceof DMObject) for (const k in saved) prefs.setVar(k, saved[k]);
}

/** Admin ghost: runs the Aghost verb as client c (the local player is an admin). True if c's mob is a ghost after. */
export function aghost(vm: VM, c: DMObject): boolean {
	vm.clients.command(c, "aghost");
	const m = live(c.getVar("mob"));
	return m instanceof DMObject && m.type.path.startsWith("/mob/dead/observer");
}
