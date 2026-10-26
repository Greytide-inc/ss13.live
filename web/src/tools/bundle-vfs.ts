// bundle-vfs - Pack the data files tg reads at runtime into one JSON bundle for the VFS base layer.
// Usage (from web/, after `npm run build`, or via `web/tools/bundle-vfs.sh`):
//   node build/dist/src/tools/bundle-vfs.js [outfile]
//   outfile defaults to web/build/vfs-bundle.json
//
// What's included and why:
//   config/           every file: game_options.txt, maps.txt, jobs.txt, title_screens/*.txt, etc.
//                     (title_screens/images/*: names only, see PRESENCE ONLY rule below)
//   _maps/*.dmm, *.json (recursive: map_files/, RandomRuins/, RandomZLevels/, shuttles/, templates/)
//                     read by code/modules/mapping/reader.dm (file2text on the .dmm) and
//                     code/datums/map_config.dm (file2text+json_decode on the per-station .json)
//   strings/          every file (incl. strings/names/): read via json_load()/file2text() by
//                     __HELPERS/_string_lists.dm, ion_laws.json, npc_chatter.json, etc.
//   html/create_object.html, code/modules/tooltip/tooltip.html, tgui/tgui.html, code/modules/html_interface/html_interface.html (crew monitor window)
//                     small literal file2text() targets (admin tools, tooltip popup, tgui shell)
//
//   icons/minimaps/   PRESENCE ONLY (empty content): SSminimap checks fexists() on the backup
//                     "<map>_<z>.png" and passes it to fcopy_rsc; without it the subsystem gives up
//                     and never logs "Initialized Minimap subsystem". The bytes are the renderer's job.
//
// Excluded: icons/ (apart from the above), sound/ bytes (names only, see RULES), and
// data/ (doesn't exist in the repo; it's created at runtime and belongs entirely to the writable
// overlay, not the base layer).
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";
import type { VfsBundle } from "../vfs/bundle-format.js";

export const repoRoot = resolve6(fileURLToPath(import.meta.url));
function resolve6(fileUrl: string): string {
	// build/dist/src/tools/bundle-vfs.js -> up 5 to web/, up 1 more to repo root
	let dir = dirname(fileUrl);
	for (let i = 0; i < 5; i++) dir = dirname(dir);
	return dir;
}

interface Rule {
	dir: string; // repo-root-relative, no trailing slash
	recursive: boolean;
	extFilter?: (name: string) => boolean; // if set, only files passing this are included
	presenceOnly?: boolean; // binary files: record that they exist, with empty content
}

const RULES: Rule[] = [
	{ dir: "config", recursive: true, extFilter: (n) => !/\.(png|dmi|ogg|wav)$/i.test(n) },
	{ dir: "_maps", recursive: true, extFilter: (n) => /\.(dmm|json)$/i.test(n) },
	{ dir: "strings", recursive: true },
	{ dir: "icons/minimaps", recursive: false, presenceOnly: true },
	// PRESENCE ONLY: fexists()/flist() on sound files (musician.dm's fexists(note file), GLOB.guitar_notes = flist("sound/guitar/")); the page fetches the real file.
	{ dir: "sound", recursive: true, extFilter: (n) => /\.(ogg|wav|mid)$/i.test(n), presenceOnly: true },
	// config/title_screens/images is left out on purpose: SStitle.PreInit's flist() finds no title screen, so the lobby turf stays blank.png and
	// the join splash (/obj/screen/splash) has no picture; the page draws ss13.live's own lobby pictures instead (worker/lobby-art.js).
];
const EXTRA_FILES = ["html/create_object.html", "code/modules/tooltip/tooltip.html", "tgui/tgui.html", "code/modules/html_interface/html_interface.html"];

function normDir(p: string): string {
	const s = p.replace(/\\/g, "/").replace(/\/+$/, "");
	return s === "" ? "" : s + "/";
}

function walk(root: string, relBase: string, recursive: boolean, extFilter: ((n: string) => boolean) | undefined, files: Map<string, string>, dirs: Set<string>, presenceOnly = false) {
	dirs.add(normDir(relBase));
	const entries = readdirSync(join(root, relBase), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
	for (const e of entries) {
		const relPath = relBase ? `${relBase}/${e.name}` : e.name;
		if (e.isDirectory()) {
			if (recursive) walk(root, relPath, recursive, extFilter, files, dirs, presenceOnly);
			else dirs.add(normDir(relPath));
		} else if (e.isFile()) {
			if (extFilter && !extFilter(e.name)) continue;
			files.set(relPath, presenceOnly ? "" : readFileSync(join(root, relPath), "utf8"));
		}
	}
}

export function buildBundle(root: string): VfsBundle {
	const files = new Map<string, string>();
	const dirs = new Set<string>([""]);

	for (const rule of RULES) {
		walk(root, rule.dir, rule.recursive, rule.extFilter, files, dirs, rule.presenceOnly);
	}
	for (const f of EXTRA_FILES) {
		files.set(f, readFileSync(join(root, f), "utf8"));
	}

	// Every ancestor of every included path must itself be a listed dir, or flist() on a
	// parent (e.g. "" or "config/") would miss it as a child entry.
	for (const p of [...files.keys(), ...dirs]) {
		let d = dirname(p.endsWith("/") ? p.slice(0, -1) : p);
		while (d && d !== ".") {
			dirs.add(normDir(d));
			d = dirname(d);
		}
	}
	dirs.add("");

	// SSticker does pick(world.file2list("strings/round_start_sounds.txt")); the file's trailing newline gives a
	// "" entry, and the VM's fixed RNG seed always picks it, so UNTIL(SSticker.login_music) never ends (no lobby music).
	// A real BYOND server picks it 1 time in 5 at random; here we drop the empty entry so the music always plays.
	const rs = files.get("strings/round_start_sounds.txt");
	if (typeof rs === "string") files.set("strings/round_start_sounds.txt", rs.replace(/\n+$/, ""));

	return { generatedAt: new Date().toISOString(), files: Object.fromEntries(files), dirs: [...dirs].sort() };
}

function main() {
	const out = process.argv[2] ?? join(repoRoot, "web/build/vfs-bundle.json");
	const bundle = buildBundle(repoRoot);
	mkdirSync(dirname(out), { recursive: true });
	const json = JSON.stringify(bundle);
	writeFileSync(out, json);
	const fileCount = Object.keys(bundle.files).length;
	console.log(`wrote ${relative(repoRoot, out)}: ${fileCount} files, ${bundle.dirs.length} dirs, ${json.length} bytes`);
}

if (process.argv[1] && resolvePath(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main();
}
