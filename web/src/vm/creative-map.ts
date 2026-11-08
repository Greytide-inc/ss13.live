// Creative mode's map: a flat square of floor, made when the world starts instead of read from a .dmm in _maps/.
// Always SIZE tiles across, the most that fits, so it is the same every time and the full build can save it as a world
// (world-creative.snap.gz, ~15 s load instead of ~40). ?map=creative (boot.ts: --map creative) writes it to the VFS where tg's map loader looks
// (_maps/map_files/creative/creative.dmm) plus data/next_map.json naming it, so SSmapping loads it as the station (z2).
// The floor is ringed by RIM tiles of indestructible wall: wider than half the 15-tile view, so space beyond is never in sight.
// The area is tg's away-mission beach, renamed Creative: gravity, powered without an APC, and fully lit (dynamic_lighting 0), so no
// tile gets a light overlay or shadows (the saved world ~12 MB smaller than with /area/ruin/unpowered's own lighting).
// Everyone late-joins on the middle tile (/obj/effect/landmark/latejoin; ghosts start there too).
// Trimmed for a smaller saved world (measured 2026-11-08 on the 239 floor: 178.5 MB raw): z5 is plain space
// (Space.dmm) instead of Lavaland.dmm (~32 MB), with minetype "none" so SSmapping seeds no lava ruins or rivers,
// and the space ruin budget is 0 (~20 MB of ruins on z3-z10). The other z-levels stay: tg's code names them by number.

const RIM = 8;
export const SIZE = 255 - 2 * RIM; // 239: the map, rim included, fills tg's 255-wide z-level

/** The _maps json and the .dmm text for a floor `size` tiles across (SIZE in the game; smaller in tests). */
export function creativeMap(size: number): { json: string; dmm: string } {
	const area = '/area/awaymission/beach{name = "Creative"}', floor = "/turf/open/floor/plasteel";
	const keys = [
		`"w" = (/turf/closed/indestructible,${area})`,
		`"f" = (${floor},${area})`,
		`"s" = (/obj/effect/landmark/latejoin,/obj/effect/landmark/observer_start,${floor},${area})`,
	];
	const across = size + 2 * RIM, mid = RIM + Math.floor(size / 2);
	const rows: string[] = [];
	for (let y = 0; y < across; y++) {
		let row = "";
		for (let x = 0; x < across; x++) {
			const inside = x >= RIM && x < RIM + size && y >= RIM && y < RIM + size;
			row += !inside ? "w" : x === mid && y === mid ? "s" : "f";
		}
		rows.push(row);
	}
	const dmm = `${keys.join("\n")}\n\n(1,1,1) = {"\n${rows.join("\n")}\n"}\n`;
	const json = JSON.stringify({ map_name: "Creative", map_path: "map_files/creative", map_file: "creative.dmm", minetype: "none", transition_config: "default" });
	return { json, dmm };
}

/** Sets a VM up for creative mode (see the top of this file): the map in its VFS, no Lavaland, no space ruins. */
export function setUpCreative(vm: { vfs: { writeText(path: string, text: string): void; readText(path: string): string | null }; compiledMapSwaps: Record<string, string> | null }): void {
	const m = creativeMap(SIZE);
	vm.vfs.writeText("_maps/map_files/creative/creative.dmm", m.dmm);
	vm.vfs.writeText("data/next_map.json", m.json);
	vm.vfs.writeText("config/game_options.txt", (vm.vfs.readText("config/game_options.txt") ?? "").replace(/^Space_Budget \d+/im, "SPACE_BUDGET 0"));
	vm.compiledMapSwaps = { "_maps/map_files/Mining/Lavaland.dmm": "_maps/map_files/generic/Space.dmm" }; // game/_maps.ts's z5
}
