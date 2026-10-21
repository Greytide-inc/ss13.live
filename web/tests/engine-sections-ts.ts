// engine-sections-ts.ts - runs tests/engine-sections.ts on the TS fixture program (tests/fixtures/). Its own process: the
// fixture's types and procs register in the runtime's one global table, which the game bundle (run.ts section 1) also uses.
// Prints the report lines, then "failures N". `node build/dist/tests/engine-sections-ts.js`
import { makeFixtureVm } from "./fixtures/lib.js";
import "./fixtures/program.js";
import { runEngineSections } from "./engine-sections.js";

const { lines, failures } = await runEngineSections(() => makeFixtureVm());
for (const l of lines) console.log(l);
console.log(`failures ${failures}`);
process.exitCode = failures ? 1 : 0;
