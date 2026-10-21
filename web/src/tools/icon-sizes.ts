// icon-sizes - Write web/build/icon-sizes.json: the frame size and state list of every .dmi/.png in the
// repo, keyed by repo-relative path: { path: [width, height, [[name, dirs, frames, movement 0/1], ...]] }.
// The browser worker (src/worker/) answers icon Width()/Height() and icon_states() from this table,
// since it can't read files synchronously or inflate the zTXt chunk. Same answers as dmi-size.ts's
// iconSizeReader and dmi-node.ts's iconStatesReader on [repoRoot] (which boot.ts uses): a path missing
// from the table means null there too.
// Usage (from web/): npm run icon-sizes

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { repoRoot } from "./repo-root.js";
import { parseDmiBytes } from "../dmi/dmi-node.js";

const SKIP = new Set(["web", "env", ".git", "node_modules"]);
const sizes: Record<string, [number, number, [string, number, number, number][]]> = {};
const walk = (dir: string): void => {
	for (const e of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, e.name);
		if (e.isDirectory()) {
			if (!(dir === repoRoot && SKIP.has(e.name)) && e.name !== "node_modules") walk(p);
		} else if (/\.(dmi|png)$/i.test(e.name)) {
			const d = parseDmiBytes(readFileSync(p));
			if (d) sizes[relative(repoRoot, p).split("\\").join("/")] = [d.width, d.height, d.states.map((s) => [s.name, s.dirs, s.frames, s.movement ? 1 : 0])];
		}
	}
};
walk(repoRoot);
const out = resolve(repoRoot, "web/build/icon-sizes.json");
writeFileSync(out, JSON.stringify(sizes));
console.log(`${Object.keys(sizes).length} icon sizes and state lists -> ${out}`);
