// game-tree.ts - the program for Node tools and tests: build/game-types.js (types, procs, globals) and
// build/translated-tg.js (the procs' code), both made by tools/translate-tg.mjs. There's no tgstation.json any more.
// Usage: const { tree, install } = await loadGame(); const vm = new VM(tree); install(vm);

import { pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ObjectTree } from "../vm/objtree.js";
import { gameProgram } from "../vm/typedefs.js";
import type { VM } from "../vm/interpreter.js";

// build/dist/src/tools/game-tree.js -> up 4 to web/
let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);

/** The game's type tree, and `install(vm)`: points a VM's procs at the translated code (needed before running any). */
export async function loadGame(): Promise<{ tree: ObjectTree; install: (vm: VM) => number }> {
	const rt = await import("../translate/runtime.js");
	await import(pathToFileURL(resolve(webDir, "build/game-types.js")).href);
	await import(pathToFileURL(resolve(webDir, "build/translated-tg.js")).href);
	return { tree: new ObjectTree(gameProgram()), install: (vm) => rt.install(vm) };
}
