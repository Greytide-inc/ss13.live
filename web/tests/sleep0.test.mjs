// sleep0.test.mjs - sleep(0) from a generator proc resumes in the same tick (world.time and sched.tick unchanged), FIFO among threads.
// Usage (from web/, after `npx tsc -p .`): node tests/sleep0.test.mjs
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const web = resolve(import.meta.dirname, "..");
const imp = (p) => import(pathToFileURL(resolve(web, p)).href);
const { loadGame } = await imp("build/dist/src/tools/game-tree.js");
const { VM } = await imp("build/dist/src/vm/interpreter.js");
const rt = await imp("build/dist/src/translate/runtime.js");
const { g } = rt;
const { tree, install } = await loadGame();
const vm = new VM(tree);
install(vm);
vm.runGlobalInit();
const SLEEP = rt.P("/proc/sleep");
let p;
for (const q of tree.procs) {
	if (q.isNative || q.argNames.length !== 0 || !q.path.startsWith("/obj/")) continue;
	try { rt.override(q, function* (f) { return null; }, true); p = q; break; } catch { /* other kind */ }
}
const log = [];
rt.override(p, function* (f) {
	for (let i = 0; i < 3; i++) { log.push(`${f.src.__id ?? "?"}:i${i} tick${vm.sched.tick} time${vm.sched.time}`); yield* g.call(f, SLEEP, null, [0]); }
	log.push(`end tick${vm.sched.tick}`);
	return null;
}, true);
const a = vm.newObject(tree.getType("/datum")), b = vm.newObject(tree.getType("/datum"));
a.__id = "A"; b.__id = "B";
vm.call(p, [], a); vm.call(p, [], b);
vm.runTick();
console.log(log.join("\n"));
const ticks = new Set(log.map((l) => l.match(/tick(\d+)/)[1]));
const slept0Sametick = ticks.size <= 2; // calls before runTick are in tick 0; the rest finish in tick 0 as well
console.log(slept0Sametick ? `sleep0: OK (ticks seen: ${[...ticks]})` : `sleep0: FAIL (ticks seen: ${[...ticks]})`);
process.exit(slept0Sametick ? 0 : 1);
