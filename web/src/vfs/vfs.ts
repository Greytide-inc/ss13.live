// vfs.ts - The virtual file system: a read-only base layer (loaded from a VfsBundle, see
// bundle-format.ts / src/tools/bundle-vfs.ts) plus a writable in-memory overlay for things tg
// writes at runtime (data/logs, savefiles, etc). Overlay persistence to IndexedDB is the worker's job;
// here it's plain JS Maps, gone when the process exits.
//
// This module implements path handling and the flist/fexists/file2text/text2file/fdel/fcopy
// semantics measured against real BYOND 511 (see web/reference/byond-quirk-tests/ for the quirk-test
// transcript). It does NOT wire itself into the VM's native procs -- that's the next chunk's
// job, using the API below.
//
// ---- BYOND 511 path & file semantics this module implements ----
//  - Backslash and forward slash are both accepted as separators; "./" prefixes are stripped.
//    Paths are relative to the world's directory (repo root here). A leading "/" is stripped
//    (treated as relative), which is an assumption -- not measured in BYOND.
//  - Case sensitivity: real BYOND on Linux is case-SENSITIVE, but tg was written for BYOND on
//    Windows, where lookups ignore case, and its code relies on that (musician.dm asks for
//    "sound/piano/Ab1.ogg", the file is ab1.ogg). So an exact match wins, and on a miss the
//    base layer is searched case-insensitively (lazy lower-case index, see resolve()).
//  - fexists(path): true for both files and directories; trailing slash on a directory doesn't
//    matter ("d1" and "d1/" both exist if d1 is a directory).
//  - file2text(path): returns the file's content; returns "" (empty string, NOT null) if path
//    is a directory; returns null if path does not exist at all.
//  - flist(path): two distinct modes --
//      path ends with "/" (or is ""): lists that directory's immediate children. Files are
//        their bare name; subdirectories get a trailing "/" appended. Real BYOND's ordering is
//        filesystem-dependent (measured: neither alphabetical nor insertion order) -- this
//        module returns children sorted alphabetically for determinism, which does not match
//        BYOND's actual order but no known tg code depends on flist() order.
//      path does NOT end with "/": treated as a PREFIX FILTER on the parent directory, i.e.
//        flist("d1") lists entries in "." whose name starts with "d1" (which is how a bare
//        directory name like "d1" ends up matching just itself, shown as "d1/"). This is
//        surprising but is exactly what real BYOND 511 does (measured).
//      A missing directory yields an empty list (never null).
//  - text2file(text, path): APPENDS "text\n" to path (there is no overwrite mode -- this is
//    also true in real BYOND; to replace a file's content, fdel it first). Creates any missing
//    parent directories. Returns true on success.
//  - fcopy(src, dst): copies src's content to dst, creating dst's missing parent directories
//    (mirrors text2file's auto-mkdir; not itself measured in BYOND, but assumed consistent).
//  - fdel(path): deletes a file, or (path ending in "/") a directory and everything under it.
//    Does not touch the parent directory itself. Returns true if something was deleted.

import type { VfsBundle } from "./bundle-format.js";

function normalize(path: string): string {
	let p = path.replace(/\\/g, "/");
	while (p.startsWith("./")) p = p.slice(2);
	if (p.startsWith("/")) p = p.slice(1);
	return p;
}

function stripTrailingSlash(p: string): string {
	return p.endsWith("/") ? p.slice(0, -1) : p;
}

function dirOf(p: string): string {
	// Parent directory of a normalized, non-slash-terminated path, WITH trailing slash ("" for root).
	const idx = p.lastIndexOf("/");
	return idx < 0 ? "" : p.slice(0, idx + 1);
}

function baseNameOf(p: string): string {
	const idx = p.lastIndexOf("/");
	return idx < 0 ? p : p.slice(idx + 1);
}

export class Vfs {
	private readonly baseFiles: Map<string, string>;
	private readonly baseDirs: Set<string>; // normalized, trailing "/", "" = root

	// Overlay: null value = tombstone (deleted from base or overlay).
	private readonly overlayFiles = new Map<string, string | null>();
	private readonly overlayDirs = new Map<string, boolean>(); // true = created, false = deleted (tombstone)

	/** Bumps on every write, copy and delete, so a caller can tell whether an export is stale. */
	revision = 0;

	constructor(bundle: VfsBundle) {
		this.baseFiles = new Map(Object.entries(bundle.files));
		this.baseDirs = new Set(bundle.dirs);
	}

	// ---- directory existence, honoring overlay tombstones/creations and their ancestors ----

	private dirTombstoned(dir: string): boolean {
		// A directory is gone if it (or any ancestor) was deleted in the overlay and not
		// recreated since (recreation happens implicitly on any write under it).
		let d = dir;
		for (;;) {
			const o = this.overlayDirs.get(d);
			if (o === false) return true;
			if (o === true) return false;
			if (d === "") return false;
			d = dirOf(stripTrailingSlash(d));
		}
	}

	private dirExists(dir: string): boolean {
		// dir is normalized WITH trailing slash ("" = root).
		if (this.overlayDirs.get(dir) === true) return true;
		if (this.dirTombstoned(dir)) return false;
		if (dir === "") return true;
		return this.baseDirs.has(dir);
	}

	private markDirCreated(dir: string) {
		// Creating a file/dir implicitly (re)creates every ancestor directory.
		let d = dir;
		for (;;) {
			this.overlayDirs.set(d, true);
			if (d === "") break;
			d = dirOf(stripTrailingSlash(d));
		}
	}

	private fileExists(path: string): boolean {
		const o = this.overlayFiles.get(path);
		if (o !== undefined) return o !== null;
		if (!this.baseFiles.has(path)) return false;
		return !this.dirTombstoned(dirOf(path));
	}

	private lowerIndex: Map<string, string> | null = null; // lower-cased base path (no trailing slash) -> real path

	/**
	 * The real base-layer spelling of a path, for callers that hand the name to something
	 * case-sensitive (the page's fetch). Exact names come back unchanged and cost nothing; a miss
	 * is looked up case-insensitively (Windows BYOND behaviour, see the header); no match: unchanged.
	 */
	resolve(path: string): string {
		const n = normalize(path);
		const p = stripTrailingSlash(n);
		if (p === "" || this.overlayFiles.has(p) || this.baseFiles.has(p) || this.baseDirs.has(p + "/")) return n;
		if (!this.lowerIndex) {
			const idx = (this.lowerIndex = new Map());
			for (const d of this.baseDirs) if (d !== "") idx.set(stripTrailingSlash(d).toLowerCase(), stripTrailingSlash(d));
			for (const f of this.baseFiles.keys()) idx.set(f.toLowerCase(), f);
		}
		const hit = this.lowerIndex.get(p.toLowerCase());
		return hit === undefined ? n : hit + (n.endsWith("/") ? "/" : "");
	}

	// ---- public API ----

	/** fexists(): true for a file or a directory, trailing slash optional. */
	exists(path: string): boolean {
		const p = stripTrailingSlash(this.resolve(path));
		if (p === "") return true; // root always exists
		return this.fileExists(p) || this.dirExists(p + "/");
	}

	isDir(path: string): boolean {
		const p = stripTrailingSlash(this.resolve(path));
		return this.dirExists(p === "" ? "" : p + "/");
	}

	/** file2text(): file content, "" for a directory, null if nothing exists at path. */
	readText(path: string): string | null {
		const p = stripTrailingSlash(this.resolve(path));
		const o = this.overlayFiles.get(p);
		if (o !== undefined) return o; // null = tombstoned (deleted)
		if (this.isDir(p)) return "";
		if (this.baseFiles.has(p) && !this.dirTombstoned(dirOf(p))) return this.baseFiles.get(p)!;
		return null;
	}

	/** the file as the bundle has it (the world before any writes), ignoring the overlay. Null if not in the bundle. */
	baseText(path: string): string | null {
		return this.baseFiles.get(stripTrailingSlash(this.resolve(path))) ?? null;
	}

	/** Same content as readText, UTF-8 encoded. Null if the path doesn't exist. */
	readBytes(path: string): Uint8Array | null {
		const text = this.readText(path);
		return text === null ? null : new TextEncoder().encode(text);
	}

	/** flist(): see the module doc comment for the two modes. Never returns null. */
	list(path: string): string[] {
		const norm = normalize(path);
		if (norm === "" || norm.endsWith("/")) {
			return this.childrenOf(norm);
		}
		const parent = dirOf(norm);
		const prefix = baseNameOf(norm);
		return this.childrenOf(parent).filter((name) => name.startsWith(prefix));
	}

	/** All immediate children of a directory (files bare, subdirs with trailing "/"), sorted. */
	private childrenOf(dir: string): string[] {
		if (!this.dirExists(dir)) return [];
		const names = new Set<string>();

		const consider = (fullPath: string, isDir: boolean) => {
			if (!fullPath.startsWith(dir)) return;
			const rest = fullPath.slice(dir.length);
			if (rest === "") return;
			const slash = rest.indexOf("/");
			if (isDir) {
				names.add(slash >= 0 ? rest.slice(0, slash + 1) : rest + "/");
			} else if (slash < 0) {
				names.add(rest);
			}
		};

		for (const f of this.baseFiles.keys()) {
			if (!this.dirTombstoned(dirOf(f))) consider(f, false);
		}
		for (const d of this.baseDirs) {
			if (d !== dir && d !== "" && !this.dirTombstoned(d)) consider(d, true);
		}
		for (const [f, v] of this.overlayFiles) {
			if (v === null) {
				const rest = f.slice(dir.length);
				if (f.startsWith(dir) && rest !== "" && rest.indexOf("/") < 0) names.delete(rest);
			} else consider(f, false);
		}
		for (const [d, created] of this.overlayDirs) {
			if (d === dir || d === "") continue;
			if (created) consider(d, true);
			else {
				const rest = d.slice(dir.length);
				if (d.startsWith(dir) && rest !== "") names.delete(rest.split("/")[0] + "/");
			}
		}
		// Measured (tests/dm/boot_natives.dm, and q5): subdirectories first, then files,
		// each in byte (ASCII) order: "sub/", "B.txt", "a.txt". Unverified beyond these two cases.
		const all = [...names];
		return [...all.filter((n) => n.endsWith("/")).sort(), ...all.filter((n) => !n.endsWith("/")).sort()];
	}

	/** text2file(): always appends "text\n"; creates missing parent directories. Returns true. */
	appendText(path: string, text: string): boolean {
		const p = stripTrailingSlash(normalize(path));
		const existing = this.readText(p) ?? "";
		this.revision++;
		this.overlayFiles.set(p, existing + text + "\n");
		this.markDirCreated(dirOf(p));
		return true;
	}

	/** Replaces a file's content (creating parent directories). Used for new savefiles. */
	writeText(path: string, text: string): void {
		const p = stripTrailingSlash(normalize(path));
		this.revision++;
		this.overlayFiles.set(p, text);
		this.markDirCreated(dirOf(p));
	}

	/** fcopy(): copy src's content to dst, creating dst's missing parent directories. */
	copy(src: string, dst: string): boolean {
		src = this.resolve(src);
		const content = this.readText(src);
		const p = stripTrailingSlash(normalize(dst));
		this.revision++;
		if (content === null) {
			// Measured: copying a missing file fails (0) but still leaves an empty dst.
			this.overlayFiles.set(p, "");
			this.markDirCreated(dirOf(p));
			return false;
		}
		this.overlayFiles.set(p, content);
		this.markDirCreated(dirOf(p));
		return true;
	}

	/** fdel(): delete a file, or (trailing "/") a directory and everything under it. */
	delete(path: string): boolean {
		this.revision++;
		const norm = this.resolve(path);
		if (norm.endsWith("/") || this.isDir(norm)) {
			const dir = stripTrailingSlash(norm) + "/";
			if (!this.dirExists(dir)) return false;
			for (const f of [...this.baseFiles.keys(), ...this.overlayFiles.keys()]) {
				if (f.startsWith(dir)) this.overlayFiles.set(f, null);
			}
			for (const d of [...this.baseDirs, ...this.overlayDirs.keys()]) {
				if (d.startsWith(dir) || d === dir) this.overlayDirs.set(d, false);
			}
			return true;
		}
		const p = stripTrailingSlash(norm);
		if (!this.fileExists(p)) return false;
		this.overlayFiles.set(p, null);
		return true;
	}

	// ---- overlay export/import (for IndexedDB: the worker stores this object) ----

	/**
	 * The files written at runtime, as path -> UTF-8 bytes. `filter` picks paths (default: all).
	 * Files deleted from the base layer aren't listed, so a store that is replaced by each export
	 * loses them; a base file that was deleted and then the store reloaded comes back (ponytail:
	 * no tombstones; tg only fdels its own data/ files).
	 */
	exportOverlay(filter: (path: string) => boolean = () => true): Record<string, Uint8Array> {
		const enc = new TextEncoder();
		const out: Record<string, Uint8Array> = {};
		for (const [p, text] of this.overlayFiles) if (text !== null && filter(p)) out[p] = enc.encode(text);
		return out;
	}

	/** Puts files from exportOverlay back into the overlay (creating directories), replacing what is there. */
	importOverlay(files: Record<string, Uint8Array>): void {
		const dec = new TextDecoder();
		for (const [p, bytes] of Object.entries(files)) this.writeText(p, dec.decode(bytes));
	}
}
