// persist-replay - puts the player's saved files into a world loaded from the pre-started snapshot, and redoes the
// parts of init that read them.
//
// Why: BYOND's world/New reads tg's persistence files during init (Ian's age, Poly's words, Runtime's kittens, Pun Pun's
// name, secret satchels, engravings, trophies, the saved game mode). The world snapshot ran that init at build time,
// when none of those files existed, so a world loaded from it has the build's answers. After loading it, this module:
//   1. writes the build's own pending savefile changes to the file layer first, so a stale handle from the build can't
//      later overwrite the player's copy of the same file;
//   2. imports the player's files (IndexedDB) over the file layer;
//   3. for each rule whose file the player has and the build didn't read (the bundle has no such file, or a different
//      one), redoes that file's init step with tg's own procs: the pets are deleted and created again at the same spot
//      (their Initialize reads the file: an age-0 Ian turns into the puppy, as at mapload), SSpersistence's loaders run
//      again (after removing what the build's run placed), SSticker.load_mode() re-reads the mode.
// Not redone (narrowed): the title screen's previous_title.dat (cosmetic), the goonchat icon
// cache, the ban list and admin notes (single player). A saved data/next_map.json naming another map is not a job for
// this module: the worker does a normal boot then (the snapshot only holds the default map), see snapshotMapOk().
import type { VM } from "./interpreter.js";
import { DMList, DMObject, live } from "./objects.js";
import { DMAtom } from "./world.js";
import { stringify, type Value } from "./value.js";

export interface ReplayRule {
	/** The saved file that init reads. */
	file: string;
	/** Atoms to delete and create again at the same place: `find` (exact type path, optionally only with this name),
	 *  re-created as `as` (default: the same type). */
	recreate?: { find: string; name?: string; as?: string }[];
	/** Atoms (exact type) the build's init placed and the loader below places again: deleted first. */
	remove?: string[];
	/** Procs to call again: [global object (e.g. "SSpersistence"), proc name]. */
	call?: [string, string][];
	/** A line for the log after the step (reads the new state), e.g. Ian's age. */
	report?: (vm: VM, made: DMObject[]) => string;
}

const v = (o: DMObject, name: string) => (o.hasVar(name) ? stringify(live(o.getVar(name))) : "?");
const listLen = (x: Value) => { const l = live(x); return l instanceof DMList ? l.len : 0; };

/** tg 2017's persistence reads at init (grep '"data/' code/): see the module comment. */
export const TG_REPLAY: ReplayRule[] = [
	{
		file: "data/npc_saves/Ian.sav",
		// At build time there was no Ian.sav: age 0, so Ian made the puppy "Ian" and deleted himself.
		recreate: [{ find: "/mob/living/simple_animal/pet/dog/corgi/Ian" }, { find: "/mob/living/simple_animal/pet/dog/corgi/puppy", name: "Ian", as: "/mob/living/simple_animal/pet/dog/corgi/Ian" }],
		report: (_vm, made) => made.map((m) => `${m.deleted ? "Ian (now the puppy)" : `Ian age ${v(m, "age")}, record_age ${v(m, "record_age")}`}`).join("; "),
	},
	{
		file: "data/npc_saves/Poly.sav",
		recreate: [{ find: "/mob/living/simple_animal/parrot/Poly" }],
		report: (_vm, made) => made.map((m) => `Poly rounds_survived ${v(m, "rounds_survived")}, longest_survival ${v(m, "longest_survival")}, ${listLen(m.getVar("speech_buffer"))} phrases`).join("; "),
	},
	{
		file: "data/npc_saves/Runtime.sav",
		recreate: [{ find: "/mob/living/simple_animal/pet/cat/Runtime" }],
		report: (_vm, made) => made.map((m) => `Runtime family ${listLen(m.getVar("family"))} kinds`).join("; "),
	},
	{
		file: "data/npc_saves/Punpun.sav",
		recreate: [{ find: "/mob/living/carbon/monkey/punpun" }],
		report: (_vm, made) => made.map((m) => `Pun Pun named "${v(m, "name")}"`).join("; "),
	},
	{ file: "data/npc_saves/SecretSatchels.sav", remove: ["/obj/item/weapon/storage/backpack/satchel/flat/secret"], call: [["SSpersistence", "LoadSatchels"]] },
	{ file: "data/npc_saves/ChiselMessages.sav", remove: ["/obj/structure/chisel_message"], call: [["SSpersistence", "LoadChiselMessages"]] },
	{ file: "data/npc_saves/TrophyItems.sav", call: [["SSpersistence", "LoadTrophies"]] },
	{ file: "data/mode.txt", call: [["SSticker", "load_mode"]] },
];

const globalObj = (vm: VM, name: string): DMObject | null => {
	const i = vm.tree.globalNames.indexOf(name);
	const o = i >= 0 ? live(vm.globals[i]) : null;
	return o instanceof DMObject ? o : null;
};

/** tg's qdel (the unit test's program defines one too). */
function destroy(vm: VM, o: DMObject): void {
	const q = vm.tree.globalProcs.get("qdel");
	if (!q) throw new Error("restoreSaves: the program has no /proc/qdel");
	vm.call(q, [o]);
}

/**
 * Steps 1-3 of the module comment. `files` is the player's store (path -> bytes). Returns log lines (one per step taken).
 * Call right after loadSnapshot + resumeWorld, before any tick runs.
 */
export function restoreSaves(vm: VM, files: Record<string, Uint8Array>, rules: ReplayRule[] = TG_REPLAY): string[] {
	const out: string[] = [];
	vm.flushSavefiles(); // 1
	const dec = new TextDecoder();
	const changed = new Set<string>();
	for (const r of rules) {
		const mine = files[r.file];
		if (mine && dec.decode(mine) !== vm.vfs.baseText(r.file)) changed.add(r.file);
	}
	vm.vfs.importOverlay(files); // 2
	for (const r of rules) { // 3
		if (!changed.has(r.file)) continue;
		const did: string[] = [];
		const made: DMObject[] = [];
		for (const c of r.recreate ?? []) {
			const type = vm.tree.getType(c.find), as = vm.tree.getType(c.as ?? c.find);
			if (!type || !as) continue;
			for (const a of [...vm.map.atoms]) {
				if (a.deleted || a.type !== type || (c.name !== undefined && stringify(live(a.getVar("name"))) !== c.name)) continue;
				const loc = live(vm.getField(a, "loc"));
				if (!(loc instanceof DMAtom)) continue;
				destroy(vm, a);
				made.push(vm.newObject(as, [loc]));
				did.push(`re-created ${c.find}${c.name ? ` "${c.name}"` : ""} as ${as.path} at ${vm.getField(loc, "x")},${vm.getField(loc, "y")},${vm.getField(loc, "z")}`);
			}
		}
		for (const path of r.remove ?? []) {
			const type = vm.tree.getType(path);
			let n = 0;
			if (type) for (const a of [...vm.map.atoms]) if (!a.deleted && a.type === type) { destroy(vm, a); n++; }
			did.push(`removed ${n} ${path}`);
		}
		for (const [g, name] of r.call ?? []) {
			const o = globalObj(vm, g), p = o?.type.procs.get(name);
			if (!o || !p) { did.push(`${g}.${name}() not found`); continue; }
			vm.call(p, [], o);
			did.push(`${g}.${name}()`);
		}
		const rep = r.report?.(vm, made);
		out.push(`[vm-boot] saved file ${r.file} (from the player's saves) read again: ${did.join(", ") || "nothing to redo"}${rep ? `; ${rep}` : ""}`);
	}
	return out;
}

/** False when the player's saves pick a map other than the snapshot's (data/next_map.json from a map vote): boot normally then.
 *  `snapMapFile` is the snapshot's map file (map_file of its _maps json, e.g. "runtimestation.dmm"). The BoxStation snapshot is built
 *  without next_map.json, i.e. on /datum/map_config's default map, BoxStation.dmm; a missing or broken file keeps the page's map. Compared without case. */
export function snapshotMapOk(files: Record<string, Uint8Array>, snapMapFile = "BoxStation.dmm"): boolean {
	const f = files["data/next_map.json"];
	if (!f) return true; // no saved choice: the round uses the map the page asked for, which is the snapshot's
	try {
		const j = JSON.parse(new TextDecoder().decode(f)) as { map_file?: string };
		return (j.map_file ?? "BoxStation.dmm").toLowerCase() === snapMapFile.toLowerCase();
	} catch {
		return true; // tg's LoadConfig rejects a broken file and keeps the default map too
	}
}
