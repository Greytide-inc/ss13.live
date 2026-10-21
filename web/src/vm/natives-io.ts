// File built-ins over the virtual file system (src/vfs/vfs.ts), and the `<<` output operator
//. Behaviour measured in BYOND 511 through web/tests/dm/files.dm and the VFS quirk
// test (web/reference/byond-quirk-tests/q5-vfs.*) unless marked "unverified".
//
// A file value is a Resource: `file("x")` and a compiled-in 'x' are the same kind of value, and
// both print as their path.

import type { VM } from "./interpreter.js";
import { DMList, DMObject } from "./objects.js";
import { Resource } from "./objtree.js";
import { DMRuntimeError, NotImplementedError, stringify, type Value } from "./value.js";
import { stripMarkers } from "./markers.js";

/** The value `world.log` reads as while it's null (DreamDaemon's own log): output goes to vm.worldLog. */
export class WorldLogOut extends Resource {
	constructor() {
		super("");
	}
}

/** The path a file argument names: a file value's path, or text. Null for anything else. */
export function filePath(v: Value): string | null {
	if (v instanceof WorldLogOut) return null;
	if (v instanceof Resource) return v.path;
	if (typeof v === "string") return v;
	return null;
}

/**
 * `target << value`. Measured: to a file it appends the text and a newline (like text2file).
 * World.log and file output drop \proper / \improper markers (vm/markers.ts).
 * To world.log (null) it prints a line. To null it does nothing. To the world, mobs, clients and
 * lists it reaches players: recorded in vm.clients' outbox (vm/clients.ts).
 */
export function output(vm: VM, target: Value, value: Value): void {
	if (target === null) return;
	if (target instanceof WorldLogOut) {
		vm.worldLog(stripMarkers(outputText(value)));
		return;
	}
	if (target instanceof Resource) {
		vm.vfs.appendText(target.path, stripMarkers(outputText(value)));
		return;
	}
	if (target instanceof DMObject && target.type.special) return target.type.special.output(target, value);
	if (target instanceof DMObject || target instanceof DMList) {
		if (vm.clients.list.length) vm.clients.output(target, value); // the world, mobs, lists of them
		return;
	}
	if (typeof target === "string" || typeof target === "number") return; // unverified
	throw new NotImplementedError(`output to ${stringify(target)}`);
}

const outputText = (v: Value): string => stringify(v);

export function installIoNatives(vm: VM): void {
	const def = (path: string, fn: (vm: VM, args: Value[]) => Value) => vm.natives.set(path, fn);

	// file(path): a file value. Measured: "[file("a/b.txt")]" is "a/b.txt". A file value passes through.
	// Measured: file(a runtime file value) is the runtime error "invalid filename", but file() of a
	// compiled-in 'resource' literal (or a var holding one) returns that resource.
	def("/proc/file", (_vm, [p = null]) => {
		if (p instanceof Resource) {
			if (p.compiled) return p;
			throw new DMRuntimeError("invalid filename");
		}
		if (typeof p === "string") return new Resource(p);
		return null; // unverified
	});
	def("/proc/isfile", (_vm, [v = null]) => (v instanceof Resource && !(v instanceof WorldLogOut) ? 1 : 0));
	def("/proc/fexists", (vm, [p = null]) => {
		const path = filePath(p);
		return path !== null && vm.vfs.exists(path) ? 1 : 0;
	});
	// Measured: null for a missing file, "" for a directory; CRLF comes back as LF (test_f_crlf; lone
	// CRs unmeasured, left alone).
	def("/proc/file2text", (vm, [p = null]) => {
		const path = filePath(p);
		return path === null ? null : (vm.vfs.readText(path)?.replace(/\r\n/g, "\n") ?? null);
	});
	// Measured: appends Text and a newline, creating missing directories; returns 1.
	def("/proc/text2file", (vm, [t = null, p = null]) => {
		const path = filePath(p);
		if (path === null) return 0;
		vm.vfs.appendText(path, stripMarkers(stringify(t)));
		return 1;
	});
	def("/proc/fdel", (vm, [p = null]) => {
		const path = filePath(p);
		return path !== null && vm.vfs.delete(path) ? 1 : 0;
	});
	def("/proc/fcopy", (vm, [src = null, dst = null]) => {
		const a = filePath(src), b = filePath(dst);
		return a !== null && b !== null && vm.vfs.copy(a, b) ? 1 : 0;
	});
	// Measured: flist("dir/") lists the directory (subdirectories end in "/"); flist("dir/x")
	// lists the entries of dir/ starting with "x". Our order is alphabetical (BYOND's is the host
	// file system's, see vfs.ts).
	def("/proc/flist", (vm, [p = null]) => new DMList(vm.vfs.list(filePath(p) ?? "")));
}
