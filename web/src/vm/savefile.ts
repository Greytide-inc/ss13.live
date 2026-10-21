// /savefile. The tree lives in memory and is written to the VFS file at its path (as text, see
// encodeTree; not BYOND's binary format) when Flush() is called and when the object is freed or
// deleted (measured, tests/dm/savefile_persist.dm: tg never calls Flush, it opens a savefile in a
// proc, writes, and lets it go; the next open on that path sees the data). VFS overlay export/import
// (vfs.ts) carries the files to IndexedDB.
//
// A savefile is a tree of directories; each directory can also hold one value. BYOND 511, measured
// (tests/dm/boot_blockers.dm):
//  - new /savefile("p") creates an empty file at p in the VFS. cd starts at "/", name is the path.
//  - S["k"] and S["k"] >> v read the value at cd/k; S["k"] = v and S["k"] << v write it. The key can
//    be a path ("sub/k"). Reading a missing key creates it (it then shows up in dir) and gives null.
//  - S << v and S >> v write/read the value of the cd directory itself.
//  - cd accepts absolute and relative paths and ".."; it creates the directory it names.
//  - dir is a live list of the cd directory's children: Add creates one, Remove deletes one, Cut
//    empties it. BYOND orders children by its internal string ids; we keep insertion order.
//  - Lists and objects are stored as copies: changing the list afterwards doesn't change what was
//    saved, and each read gives a new list / a new object of the same type with the same vars.
//  - A second savefile opened on the same path doesn't see unflushed writes (it starts empty here).
//    Measured beyond that, and NOT modelled: while two handles on one path are alive BYOND shares
//    parts of their trees oddly (reads of keys the other handle wrote come back null, writes show
//    up in both, a Flush by the first doesn't make its data visible to a second open). We give each
//    handle its own tree, loaded from the file at open; the last one to flush or be freed wins.
//  - Writing to a savefile whose file was fdel'ed is the runtime error "bad savefile or list".
//  - new /savefile with no path gets a random temporary name.

import type { VM } from "./interpreter.js";
import { DMList, DMObject } from "./objects.js";
import { DMType, Resource, fromBase64 } from "./objtree.js";
import { live } from "./objects.js";
import { DMRuntimeError, formatNumber, stringify, type Value } from "./value.js";

export class SaveNode {
	/** Written to on purpose (a value, even null, or dir.Add). Nodes that only exist because a read
	 * or a cd named them aren't saved (measured: tg's load of an empty character slot leaves no dir). */
	kept = false;
	value: Stored = null;
	readonly children = new Map<string, SaveNode>();
}

/** A saved object: its type and the vars that differ from the type's defaults (as stored copies). */
export class SavedObject {
	constructor(
		readonly type: DMType,
		readonly vars: [string, Stored][],
	) {}
}
export class SavedList {
	constructor(readonly items: [Stored, Stored | undefined][]) {}
}
type Stored = Value | SavedObject | SavedList;

export class SaveState {
	readonly root = new SaveNode();
	cd: string[] = [];
	/** Changed since the last write to the VFS. */
	dirty = false;
	constructor(
		readonly name: string,
		/** VFS path; null for a temporary savefile (nothing on disk). */
		readonly path: string | null = null,
		/** Where path-backed handles with unwritten changes are listed. */
		readonly pending: Set<SaveState> | null = null,
	) {}
	touch(): void {
		this.dirty = true;
		if (this.path !== null) this.pending?.add(this);
	}
}

/** The hooks a type with engine-side state installs (see DMType.special). */
export interface ObjectHooks {
	/** A var read; undefined means "not special, read it normally". */
	get(o: DMObject, name: string): Value | undefined;
	/** A var write; false means "not special, write it normally". */
	set(o: DMObject, name: string, v: Value): boolean;
	index(o: DMObject, i: Value): Value;
	setIndex(o: DMObject, i: Value, v: Value): void;
	/** `o << v` */
	output(o: DMObject, v: Value): void;
	/** `o >> v` */
	input(o: DMObject): Value;
	/** The object was freed by the GC or `del`eted. */
	free?(o: DMObject): void;
}

const states = new WeakMap<DMObject, SaveState>();
/** the savefile handles' engine-side state, for vm/snapshot.ts. */
export const savefileStates = states;

// ---- ExportText/ImportText -------------------------------------------------------------------
// BYOND 511's savefile export format (measured with a real DreamDaemon, see
// web/reference/byond-quirk-tests/q6-savefile.dme and q7-savefile.dme):
//   A plain value at the exported key is `. = <literal>\n\n`.
//   An object is `. = object(".0")\n\n` plus a `.0\n\ttype = <path>\n\t<var> = <value>\n...\n\n`
//   block per referenced object, one block per distinct object reached, `.0`, `.1`, ... in the
//   order first seen.
//   Lists are `list(a,b,"k" = v,...)` (associative pairs use "key" = value, mixed by position
//   with plain entries). Strings are quoted; \, " and newline are escaped as \\, \" and \n.
//   Numbers use the same formatting as text interpolation (formatNumber).
// icon2base64 (code/modules/goonchat/browserOutput.dm) is the one place tg's code actually
// parses this back out, and only for an /icon: it needs the "icon" var to export as
// `filedata("name=<n>;length=<len>;crc32=0x<hex>;encoding=base64",{"\n<PEM-wrapped base64, 64
// cols>\n"})`. There's no DMI loader here, so every icon exports the SAME placeholder
// 1x1 PNG; a later version could replace PLACEHOLDER_PNG with the atom's real rendered frame.
// Not implemented: exporting a directory with several keys (BYOND nests each child's block
// under the parent, which is a different, more indented shape). Only used by the character
// preferences backup (preferences_savefile.dm), never by boot.

const PLACEHOLDER_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==";
const PLACEHOLDER_PNG = fromBase64(PLACEHOLDER_B64);

/** Standard CRC-32 (IEEE 802.3 / zlib polynomial), used only to fill filedata()'s crc32= field.
 * BYOND's own value is some internal, undocumented variant (measured: it does NOT match this
 * algorithm run over the same bytes) but nothing in tg's DM code reads the field back -- only the
 * base64 payload between the braces -- so any stable 32-bit value is fine here. */
const CRC_TABLE = (() => {
	const t = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		t[n] = c >>> 0;
	}
	return t;
})();
function crc32(data: Uint8Array): number {
	let c = 0xffffffff;
	for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
	return (c ^ 0xffffffff) >>> 0;
}

/** BYOND wraps base64 at 64 columns (measured), same as PEM/MIME. */
function wrapBase64(b64: string): string {
	const lines: string[] = [];
	for (let i = 0; i < b64.length; i += 64) lines.push(b64.slice(i, i + 64));
	return lines.join("\n");
}

/** DM string literal quoting for export. Measured: \, " and a literal newline are escaped. */
function quoteString(s: string): string {
	return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\t/g, "\\t")}"`;
}

function isIconType(vm: VM, t: DMType): boolean {
	const iconType = vm.tree.getType("/icon");
	return iconType !== undefined && t.isSubtypeOf(iconType);
}

/** The .dmi path an /icon object's "icon" var ultimately points to (a Resource, set by New() in
 * natives-misc.ts). Falls back to a generic name when there's none (icon() with no source file). */
function iconResourceName(o: SavedObject): string {
	for (const [k, v] of o.vars) {
		if (k === "icon" && v instanceof Resource) {
			const slash = v.path.lastIndexOf("/");
			return slash < 0 ? v.path : v.path.slice(slash + 1);
		}
	}
	return "icon.png";
}

function buildExportText(vm: VM, top: Stored): string {
	const objects: SavedObject[] = [];
	const literal = (v: Stored): string => {
		if (v === null) return "null";
		if (typeof v === "number") return formatNumber(v);
		if (typeof v === "string") return quoteString(v);
		if (v instanceof Resource) return `'${v.path}'`; // unverified: a plain (non-icon) file var
		if (v instanceof SavedList) {
			const parts = v.items.map(([k, a]) => (a === undefined ? literal(k) : `${literal(k)} = ${literal(a)}`));
			return `list(${parts.join(",")})`;
		}
		if (v instanceof SavedObject) {
			let i = objects.indexOf(v);
			if (i < 0) i = objects.push(v) - 1;
			return `object(".${i}")`;
		}
		return stringify(v as Value); // DMType/DMProc paths: unverified in this format
	};
	const renderObject = (i: number, o: SavedObject): string => {
		if (isIconType(vm, o.type)) {
			const name = iconResourceName(o);
			const b64 = PLACEHOLDER_B64;
			const crc = crc32(PLACEHOLDER_PNG).toString(16).padStart(8, "0");
			return (
				`.${i}\n\ttype = ${o.type.path}\n\ticon = filedata("name=${name};length=${PLACEHOLDER_PNG.length};` +
				`crc32=0x${crc};encoding=base64",{"\n${wrapBase64(b64)}\n"})\n`
			);
		}
		let s = `.${i}\n\ttype = ${o.type.path}\n`;
		for (const [k, x] of o.vars) s += `\t${k} = ${literal(x)}\n`;
		return s;
	};
	let out = `. = ${literal(top)}\n`;
	for (let i = 0; i < objects.length; i++) out += renderObject(i, objects[i]);
	return out;
}

/** Parses back a `. = <literal>\n\n` export (cheap version: no object(".N") blocks -- nothing in
 * tg's code round-trips an object through ImportText, only icon2base64 reads ExportText's text
 * directly with splittext/copytext). Returns undefined if the text isn't in that shape. */
export function parseExportedValue(text: string): Stored | undefined {
	const m = /^\.\s*=\s*/.exec(text);
	if (!m) return undefined;
	let i = m[0].length;
	const skipSpace = () => {
		while (i < text.length && /\s/.test(text[i])) i++;
	};
	const parseValue = (): Stored => {
		skipSpace();
		if (text.startsWith("null", i)) {
			i += 4;
			return null;
		}
		if (text[i] === '"') {
			i++;
			let s = "";
			while (i < text.length && text[i] !== '"') {
				if (text[i] === "\\") {
					const c = text[i + 1];
					s += c === "n" ? "\n" : c === "t" ? "\t" : c;
					i += 2;
				} else {
					s += text[i++];
				}
			}
			i++; // closing quote
			return s;
		}
		if (text.startsWith("list(", i)) {
			i += 5;
			const items: [Stored, Stored | undefined][] = [];
			skipSpace();
			while (text[i] !== ")") {
				if (i >= text.length) throw new Error("unclosed list(");
				const first = parseValue();
				skipSpace();
				if (text[i] === "=") {
					i++;
					items.push([first, parseValue()]);
				} else {
					items.push([first, undefined]);
				}
				skipSpace();
				if (text[i] === ",") {
					i++;
					skipSpace();
				}
			}
			i++; // closing paren
			return new SavedList(items);
		}
		const numMatch = /^-?\d+(\.\d+)?/.exec(text.slice(i));
		if (numMatch) {
			i += numMatch[0].length;
			return Number(numMatch[0]);
		}
		throw new Error("unrecognised value"); // e.g. object(".N"): give up on the whole text
	};
	try {
		return parseValue();
	} catch {
		return undefined;
	}
}

function resolvePath(cd: string[], path: string): string[] {
	const out = path.startsWith("/") ? [] : cd.slice();
	for (const seg of path.split("/")) {
		if (seg === "" || seg === ".") continue;
		if (seg === "..") out.pop();
		else out.push(seg);
	}
	return out;
}

function nodeAt(st: SaveState, segs: string[]): SaveNode {
	let n = st.root;
	for (const s of segs) {
		let c = n.children.get(s);
		if (!c) {
			n.children.set(s, (c = new SaveNode()));
			st.touch();
		}
		n = c;
	}
	return n;
}

// ---- the file format: our own JSON, not BYOND's binary ------------------------------------------
const MAGIC = "SAVEFILE-JSON-1\n";
type Enc = null | number | string | { n: string } | { r: string; c?: 1 } | { t: string } | { l: [Enc, Enc?][] } | { o: string; v: [string, Enc][] };
interface EncNode {
	v?: Enc;
	c?: [string, EncNode][];
}

function encodeValue(s: Stored): Enc {
	if (s === null || typeof s === "string") return s;
	if (typeof s === "number") return Number.isFinite(s) ? s : { n: String(s) };
	if (s instanceof Resource) return s.compiled ? { r: s.path, c: 1 } : { r: s.path };
	if (s instanceof SavedList) return { l: s.items.map(([k, a]) => (a === undefined ? [encodeValue(k)] : [encodeValue(k), encodeValue(a)])) };
	if (s instanceof SavedObject) return { o: s.type.path, v: s.vars.map(([k, x]) => [k, encodeValue(x)]) };
	if (s instanceof DMType) return { t: s.path };
	return null; // procs and other engine values can't be saved
}

function encodeNode(n: SaveNode): EncNode | null {
	const c: [string, EncNode][] = [];
	for (const [k, child] of n.children) {
		const e = encodeNode(child);
		if (e) c.push([k, e]);
	}
	if (!n.kept && !c.length) return null;
	const e: EncNode = {};
	if (n.value !== null) e.v = encodeValue(n.value);
	if (c.length) e.c = c;
	return e;
}

function decodeValue(vm: VM, e: Enc): Stored {
	if (e === null || typeof e !== "object") return e;
	if ("n" in e) return Number(e.n);
	if ("r" in e) return new Resource(e.r, e.c === 1);
	if ("t" in e) return vm.tree.getType(e.t) ?? null;
	if ("l" in e) return new SavedList(e.l.map(([k, a]) => [decodeValue(vm, k), a === undefined ? undefined : decodeValue(vm, a)]));
	const type = vm.tree.getType(e.o);
	return type ? new SavedObject(type, e.v.map(([k, x]) => [k, decodeValue(vm, x)])) : null; // its type is gone from this build
}

function decodeNode(vm: VM, e: EncNode, n: SaveNode): void {
	if (e.v !== undefined) n.value = decodeValue(vm, e.v);
	for (const [k, c] of e.c ?? []) {
		const child = new SaveNode();
		child.kept = true;
		n.children.set(k, child);
		decodeNode(vm, c, child);
	}
}

/** Fills `st` from a file's text; anything that isn't ours (empty, or damaged) gives an empty tree. */
function loadTree(vm: VM, st: SaveState, text: string | null): void {
	if (!text || !text.startsWith(MAGIC)) return;
	try {
		decodeNode(vm, JSON.parse(text.slice(MAGIC.length)) as EncNode, st.root);
	} catch {
		st.root.children.clear();
		st.root.value = null;
	}
}

export function installSavefile(vm: VM): void {
	const type = vm.tree.getType("/savefile");
	if (!type) return;

	/** Handles with changes not yet in the VFS. Only path-backed ones are ever added. */
	const dirty = new Set<SaveState>();
	vm.savefileDirty = dirty; // reachable for vm/snapshot.ts (SaveState.pending points at it)
	const commit = (st: SaveState): void => {
		dirty.delete(st);
		st.dirty = false;
		// An fdel'ed file stays gone (BYOND errors on the write; a later flush must not bring it back).
		if (st.path === null || !vm.vfs.exists(st.path)) return;
		vm.vfs.writeText(st.path, MAGIC + JSON.stringify(encodeNode(st.root) ?? {}));
	};
	/** Before a write: BYOND raises this when the file is gone. */
	const checkFile = (st: SaveState): void => {
		if (st.path !== null && !vm.vfs.exists(st.path)) throw new DMRuntimeError("bad savefile or list");
	};
	vm.flushSavefiles = () => {
		for (const st of [...dirty]) commit(st);
	};

	const store = (v: Value): Stored => {
		v = live(v);
		if (v instanceof DMList)
			return new SavedList(v.items.map((x) => {
				const k = store(x), a = v.assocOf(x);
				return [k, a !== undefined ? store(a) : undefined];
			}));
		if (v instanceof DMObject) {
			const vars: [string, Stored][] = [];
			for (const [k, x] of v.ownVars()) if (!v.type.tmpVars.has(k) && !v.type.constVars.has(k)) vars.push([k, store(x)]);
			return new SavedObject(v.type, vars);
		}
		return v;
	};
	const load = (s: Stored): Value => {
		if (s instanceof SavedList) {
			const l = new DMList();
			for (const [k, a] of s.items) {
				const key = load(k);
				l.push(key, a !== undefined ? load(a) : undefined);
			}
			return l;
		}
		if (s instanceof SavedObject) {
			// Unverified: whether BYOND calls New() on a loaded object. We don't.
			const o = vm.allocObject(s.type);
			for (const [k, x] of s.vars) o.setVar(k, load(x));
			return o;
		}
		return s;
	};
	const stateOf = (o: DMObject): SaveState => {
		let st = states.get(o);
		if (!st) states.set(o, (st = new SaveState(stringify(o.getVar("name")), null, dirty)));
		return st;
	};
	const keyNode = (o: DMObject, i: Value) => {
		const st = stateOf(o);
		return nodeAt(st, resolvePath(st.cd, stringify(i)));
	};

	type.special = {
		get(o, name) {
			switch (name) {
				case "cd": return "/" + stateOf(o).cd.join("/");
				case "dir": return new SaveDirList(stateOf(o), nodeAt(stateOf(o), stateOf(o).cd));
				case "eof": return 1; // unverified beyond: 1 on an empty file and after a read
			}
			return undefined;
		},
		set(o, name, v) {
			if (name === "cd") {
				const st = stateOf(o);
				st.cd = resolvePath(st.cd, stringify(v));
				nodeAt(st, st.cd);
				return true;
			}
			return name === "dir" || name === "eof"; // unverified: read-only
		},
		index: (o, i) => load(keyNode(o, i).value),
		setIndex(o, i, v) {
			checkFile(stateOf(o));
			const n = keyNode(o, i);
			n.value = store(v);
			n.kept = true;
			stateOf(o).touch();
		},
		output(o, v) {
			const st = stateOf(o);
			checkFile(st);
			const n = nodeAt(st, st.cd);
			n.value = store(v);
			n.kept = true;
			st.touch();
		},
		free(o) {
			const st = states.get(o);
			if (st?.dirty) commit(st);
		},
		input(o) {
			const st = stateOf(o);
			return load(nodeAt(st, st.cd).value);
		},
	};
	for (const t of vm.tree.types) if (t.isSubtypeOf(type)) t.special = type.special;

	vm.natives.set("/savefile/proc/New", (vm, [filename = null], src) => {
		const o = src as DMObject;
		const path = filename === null ? tempName(vm) : stringify(filename);
		o.setVar("name", path);
		o.setVar("cd", "/");
		if (filename === null) {
			states.set(o, new SaveState(path));
			return null;
		}
		// A handle that was dropped but not yet freed still has its data to write: BYOND frees it at once.
		for (const d of dirty) {
			if (d.path === path) {
				vm.gcSafePoint(o);
				break;
			}
		}
		const st = new SaveState(path, path, dirty);
		states.set(o, st);
		if (vm.vfs.exists(path)) loadTree(vm, st, vm.vfs.readText(path));
		else vm.vfs.writeText(path, "");
		return null;
	});
	vm.natives.set("/savefile/proc/Flush", (_vm, _a, src) => {
		const st = states.get(src as DMObject);
		if (st) commit(st);
		return null;
	});
	vm.natives.set("/savefile/proc/Lock", () => 1);
	vm.natives.set("/savefile/proc/Unlock", () => 1);
	vm.natives.set("/savefile/proc/ExportText", (vm, [path = null], src) => {
		const o = src as DMObject;
		const st = stateOf(o);
		const node = nodeAt(st, resolvePath(st.cd, path === null ? "." : stringify(path)));
		return buildExportText(vm, node.value);
	});
	vm.natives.set("/savefile/proc/ImportText", (vm, [path = null, file = null], src) => {
		const o = src as DMObject;
		const st = stateOf(o);
		const text = file instanceof Resource ? vm.vfs.readText(file.path) : typeof file === "string" ? vm.vfs.readText(file) : null;
		if (text === null) return 0;
		const parsed = parseExportedValue(text);
		if (parsed === undefined) return 0;
		checkFile(st);
		const n = nodeAt(st, resolvePath(st.cd, path === null ? "." : stringify(path)));
		n.value = parsed;
		n.kept = true;
		st.touch();
		return 1;
	});
}

function tempName(vm: VM): string {
	return Math.floor(vm.rng.next() * 0xffffffff).toString(16).toUpperCase().padStart(8, "0");
}

/** `savefile.dir`: the children of the cd directory; changes write through to the tree. */
export class SaveDirList extends DMList {
	constructor(readonly st: SaveState, readonly node: SaveNode) {
		super([...node.children.keys()]);
	}
	override add(v: Value): void {
		if (v instanceof DMList) {
			for (const x of v.items.slice()) this.add(x);
			return;
		}
		const k = stringify(v);
		if (!this.node.children.has(k)) this.node.children.set(k, new SaveNode());
		this.node.children.get(k)!.kept = true;
		this.sync();
	}
	override push(v: Value): void {
		this.add(v);
	}
	override remove(v: Value): boolean {
		if (v instanceof DMList) {
			let any = false;
			for (const x of v.items.slice()) if (this.remove(x)) any = true;
			return any;
		}
		const had = this.node.children.delete(stringify(v));
		this.sync();
		return had;
	}
	override removeOne(v: Value): boolean {
		return this.remove(v);
	}
	override cut(from: number, to: number): void {
		for (const k of this.items.slice(from, to)) this.node.children.delete(stringify(k));
		this.sync();
	}
	private sync(): void {
		this.st.touch();
		const a = this.own();
		a.length = 0;
		a.push(...this.node.children.keys());
		this.dropIndex();
	}
}
