// dmi-size - Node-only reader for an icon file's frame size, used by the VM's icon Width()/Height().
//
// A .dmi's Description may set `width = N` / `height = N` (each defaults to 32 when absent); a plain
// PNG (no Description) is one frame the size of the whole image. Parsing is the DMI loader's
// (src/dmi/dmi-node.ts), checked identical to the old standalone reader on all 622 repo icons.
// Measured in BYOND 511: tests/dm/icons.dm (test_ic_dmi_size).

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseDmiBytes } from "../dmi/dmi-node.js";

/** The frame size of an icon file's bytes, or null if they aren't a readable PNG. */
export function iconFrameSize(bytes: Uint8Array): [number, number] | null {
	const dmi = parseDmiBytes(bytes);
	return dmi && [dmi.width, dmi.height];
}

/** A VM.iconSize hook: looks each resource path up under the given folders, caching the answer. */
export function iconSizeReader(baseDirs: string[]): (path: string) => [number, number] | null {
	const cache = new Map<string, [number, number] | null>();
	return (path) => {
		let hit = cache.get(path);
		if (hit !== undefined) return hit;
		hit = null;
		for (const dir of baseDirs) {
			try {
				hit = iconFrameSize(readFileSync(resolve(dir, path.replace(/\\/g, "/"))));
				break;
			} catch {
				// not in this folder
			}
		}
		cache.set(path, hit);
		return hit;
	};
}
