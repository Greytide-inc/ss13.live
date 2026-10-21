// client-dump - What a connected player would see, as JSON: used by `boot.ts --connect`.
// For each client: its mob, eye (ref and x/y/z), view, client.screen (type, screen_loc and the
// appearance in station.json's format), client.images count, and the messages sent to it
// (counts by type, plus the first few of each type in full).
// Also eyeTile {x,y,z}: the turf client.eye is on, and viewTiles: every tile within `view`
// of it (a (2*view+1) square, clipped at the map edge) in station.json's tile format (tile-dump.ts).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { encodeDmi } from "../dmi/dmi-node.js";
import { evalRecipe } from "../dmi/icon-ops.js";
import { repoRoot } from "./repo-root.js";
import type { VM } from "../vm/interpreter.js";
import { buildClientView } from "../worker/client-view.js";

// The view itself is built by client-view.ts (browser-safe, shared with the worker).
export function dumpClients(vm: VM, file: string): Record<string, unknown> {
	const out = buildClientView(vm);
	mkdirSync(dirname(file), { recursive: true });
	// Runtime icons (fcopy_rsc'd /icons) become real .dmi files next to the dump; icon paths point at them.
	const written = new Map<string, string>();
	const replacer = (k: string, v: unknown) => {
		const recipe = k === "icon" && typeof v === "string" ? vm.runtimeIcons.get(v) : undefined;
		if (!recipe) return v;
		if (!written.has(v as string)) {
			const out = resolve(dirname(file), v as string);
			mkdirSync(dirname(out), { recursive: true });
			writeFileSync(out, encodeDmi(evalRecipe(recipe, (p) => vm.loadIcon?.(p) ?? null)));
			written.set(v as string, relative(repoRoot, out));
		}
		return written.get(v as string);
	};
	writeFileSync(file, JSON.stringify(out, replacer, 1));
	return out;
}
