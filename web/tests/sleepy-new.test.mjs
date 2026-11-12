// sleepy-new.test.mjs - tools/sleepy-new.mjs finds a plain proc that news a type whose New sleeps (the shape that made every
// explosion end the page, 69fb3a500), and on web/game finds exactly the reviewed list below. Usage (from web/): node tests/sleepy-new.test.mjs
// A new hit: make the proc a function* with `yield* new_(...)` if that New really waits (`node tools/sleepy-new.mjs --why` shows
// the calls down to the wait), else add it here with the reason it can't.
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sleepyNews } from "../tools/sleepy-new.mjs";

// Reviewed 2026-11-12: each New is a plain proc; its chain matches a wait only by a shared name.
const REVIEWED = new Map([
	["/datum/admins/proc/makeAbductorTeam | /datum/round_event/ghost_role/abductor", "round_event/New calls setup(); this type's is the empty base one"],
	["/datum/admins/proc/makeAliens | /datum/round_event/ghost_role/alien_infestation", "its setup() is rand and prob only"],
	["/datum/admins/proc/makeRevenant | /datum/round_event/ghost_role/revenant", "New sets a var and calls round_event/New; setup() is the empty base one"],
	["/datum/admins/proc/makeSpaceNinja | /datum/round_event/ghost_role/ninja", "its setup() is one rand"],
	["/datum/spellbook_entry/summon/ghosts/proc/Buy | /datum/round_event/wizard/ghost", "setup() is the empty base one"],
	["/datum/cameranet/proc/getCameraChunk | /datum/camerachunk", "New calls camera can_use() and can_see(), both plain var checks and range()"],
	["/datum/stack/proc/Copy | /datum/stack", "New's elements.Copy() is a list's own Copy"],
	["/obj/item/projectile/energy/chrono_beam/proc/on_hit | /obj/effect/chrono_field", "getFlatIcon is plain; its Insert() is a list's and an icon's"],
	["/obj/machinery/clonepod/proc/return_air | /datum/gas_mixture/immutable/cloner", "garbage_collect > add_gas copies a gas list (a list's own Copy)"],
]);

let bad = 0;
const fail = (t) => { bad++; console.log(`FAIL sleepy-new: ${t}`); };

// planted: a plain proc news /datum/a (its New calls a function* that sleeps) and /datum/b (its New only calls a list's Copy,
// and src.wait() resolves to /datum/c's wait only on /datum/c's own type line)
const dir = mkdtempSync(join(tmpdir(), "sleepy-new-"));
try {
	mkdirSync(join(dir, "code"));
	writeFileSync(join(dir, "code/t.ts"), `import * as rt from "#runtime";
rt.type(1, "/datum/a", "/datum", {});
rt.type(2, "/datum/b", "/datum", {});
rt.type(3, "/datum/c", "/datum", {});
rt.def("/datum/c/proc/wait", function* wait(f) { yield* sleep(10); return f.dot; });
rt.def("/datum/c/proc/Copy", function Copy(f) { this.wait(); return f.dot; });
rt.def("/datum/a/proc/New", function New(f) { rt.call(f, P("/proc/nap"), null, []); return f.dot; });
rt.def("/proc/nap", function* nap(f) { yield* sleep(1); return f.dot; });
rt.def("/datum/b/proc/New", function New(f) { this.wait(); f.argsList.Copy(1); return f.dot; });
rt.def("/proc/boom", function boom(f) { new_(T("/datum/a")); new_(T("/datum/b")); return f.dot; });
rt.def("/proc/boom2", function* boom2(f) { yield* new_(T("/datum/a")); return f.dot; });
`);
	const got = sleepyNews(dir).map((h) => `${h.proc} | ${h.type}`);
	if (got.join() !== "/proc/boom | /datum/a") fail(`planted: got [${got.join(", ")}], want [/proc/boom | /datum/a]`);
} finally { rmSync(dir, { recursive: true, force: true }); }

const hits = sleepyNews();
const keys = new Set(hits.map((h) => `${h.proc} | ${h.type}`));
for (const h of hits) if (!REVIEWED.has(`${h.proc} | ${h.type}`)) fail(`${h.file}:${h.line} ${h.proc} news ${h.type}, whose New can wait (a plain proc can't: make it a function* with yield* new_, or review it here)\n    ${h.trail}`);
for (const k of REVIEWED.keys()) if (!keys.has(k)) fail(`reviewed "${k}" no longer found: take it off the list`);
console.log(bad ? `sleepy-new: ${bad} FAILED` : `sleepy-new: OK (${hits.length} reviewed)`);
process.exit(bad ? 1 : 0);
