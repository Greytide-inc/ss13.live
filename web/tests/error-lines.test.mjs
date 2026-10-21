// error-lines.test.mjs - a runtime error in translated tg reports its game/ file:line (JS stack) and DM file:line.
// Forces tg's open.dm,103 bug (`air.compare()` on a turf with no air: "Cannot execute null.compare()") on a 3x3 space map.
// Usage (from web/, env loaded, after `npx tsc -p .` and `node tools/translate-tg.mjs`): node tests/error-lines.test.mjs
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const web = resolve(import.meta.dirname, "..");
const imp = (p) => import(pathToFileURL(resolve(web, p)).href);
const { loadGame } = await imp("build/dist/src/tools/game-tree.js"); // the game files, no tgstation.json
const { VM } = await imp("build/dist/src/vm/interpreter.js");
const { tree, install } = await loadGame();
const vm = new VM(tree);
vm.debugInfo = true;
const errors = [];
vm.onRuntimeError = (e) => errors.push(e);
install(vm);
vm.runGlobalInit();
errors.length = 0;
vm.map.resize(3, 3, 1, false); // world.turf: /turf/open/space, never initialized, so its air is null
const turf = vm.map.turfAt(2, 2, 1);
vm.call(tree.getType("/turf/open").procs.get("Initalize_Atmos"), [1], turf);

const want = { message: "Cannot execute null.compare().", proc: "/turf/open/proc/Initalize_Atmos", source: "code/game/turfs/open.dm:103" };
const gameFile = "game/code/game/turfs/open.ts";
const lines = readFileSync(resolve(web, gameFile), "utf8").split("\n");
const wantLine = lines.findIndex((l) => l.includes('"compare", [live(enemy_air)]')) + 1;
let fail = 0;
const check = (what, ok) => { console.log(`${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fail++; };
check(`one runtime error (got ${errors.length})`, errors.length === 1);
const e = errors[0] ?? {};
console.log(`     ${e.message} | ${e.proc} (${e.game}, DM ${e.source})`);
check(`message "${want.message}"`, e.message === want.message);
check(`proc ${want.proc}`, e.proc === want.proc);
check(`game ${gameFile}:${wantLine}`, e.game === `${gameFile}:${wantLine}`);
check(`DM ${want.source}`, e.source === want.source);
console.log(fail ? `error-lines: ${fail} FAILED` : "error-lines: OK");
process.exit(fail ? 1 : 0);
