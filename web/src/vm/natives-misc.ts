// Built-ins tg's boot touches that belong to later phases. Most are placeholders so boot
// can get past them; each says what it really does and what's missing.
//
//  - /image, image(), /matrix, matrix(), rgb(): real values (plain vars), no drawing here.
//  - /icon and icon_states(): real, as recipes (see the /icon section). A file's frame size comes
//    from the host's vm.iconSize hook, its state list from vm.iconStates, its pixels from
//    vm.loadIcon; without a hook, 32x32 / no states / no pixels.
//  - sound(): a /sound datum, nothing plays here.
//  - _dm_db_*: the MySQL layer, disabled (the database is off in config). Every
//    connection fails.
//  - md5(): real.

import { objectOperators, type NativeProc, type VM } from "./interpreter.js";
import { normLookVar, parseColorText } from "./look.js";
import { DMList, DMObject } from "./objects.js";
import { Resource } from "./objtree.js";
import { type IconOp, type IconRecipe, type RGBA, evalRecipe, getPixel, recipeSize, recipeStates } from "../dmi/icon-ops.js";
import { DMRuntimeError, fround, stringify, type Value } from "./value.js";
import { DMAtom } from "./world.js";

const num = (v: Value, dflt: number): number => (typeof v === "number" ? v : dflt);

/** rgb(r, g, b[, a]): "#rrggbb" or "#rrggbbaa", each channel truncated and clamped to 0..255 (measured, test_rgb). */
export function rgb(args: Value[]): string {
	const hex = (v: Value) => {
		const n = Math.max(0, Math.min(255, Math.trunc(num(v, 0))));
		return (n < 16 ? "0" : "") + n.toString(16);
	};
	let s = "#" + hex(args[0] ?? null) + hex(args[1] ?? null) + hex(args[2] ?? null);
	if (args.length > 3 && args[3] !== null) s += hex(args[3]);
	return s;
}

export function installMiscNatives(vm: VM): void {
	const def = (path: string, fn: NativeProc) => vm.natives.set(path, fn);
	const type = (p: string) => vm.tree.getType(p);

	// ---- /image. The first argument is the icon (or an atom/image whose look is copied); after it,
	// the first atom is loc, the first text is icon_state, then numbers are layer, dir, pixel_x,
	// pixel_y. Arguments arrive by position in image(icon, loc, icon_state, layer, dir, pixel_x,
	// pixel_y), so a named `dir = 4` comes as [icon, null, state, null, 4]: a number at position 3+
	// fills at least that position's slot, a number earlier (loc/state left out) the next free slot.
	// Measured in BYOND 511 (ov1, tests/render-rules/nested.dm): image(i, "s", dir = 4) -> dir 4,
	// layer FLOAT_LAYER; image(i, "s", 5, 8) and image(i, null, "s", 5, 8) -> layer 5, dir 8.
	const APPEARANCE_VARS = ["icon", "icon_state", "dir", "layer", "pixel_x", "pixel_y", "color", "alpha", "name", "plane"];
	const NUM_SLOTS = ["layer", "dir", "pixel_x", "pixel_y"];
	def("/image/proc/New", (vm, args, src) => {
		const img = src as DMObject;
		const first = args[0] ?? null;
		if (first instanceof DMObject) {
			for (const k of APPEARANCE_VARS) if (first.hasVar(k) && img.hasVar(k)) img.setVar(k, first.getVar(k));
		} else if (first !== null) img.setVar("icon", first);
		let gotState = false, slot = 0;
		for (let p = 1; p < args.length; p++) {
			const a = args[p];
			if (a instanceof DMAtom && img.hasVar("loc")) img.setVar("loc", a);
			else if (typeof a === "string" && !gotState) {
				img.setVar("icon_state", a);
				gotState = true;
			} else if (typeof a === "number") {
				slot = Math.max(slot, p - 3);
				if (slot >= NUM_SLOTS.length) continue;
				const k = NUM_SLOTS[slot++];
				img.setVar(k, k === "pixel_x" || k === "pixel_y" ? normLookVar(k, a)! : a); // pixel offsets measured: truncated
				if (k === "dir") vm.appearances.dirFixed.add(img); // kept when drawn, even SOUTH (appearances.ts)
			}
		}
		return null;
	});
	def("/proc/image", (vm, args) => vm.newObject(type("/image")!, args));

	// ---- /icon. Runtime icon building : each /icon carries an immutable recipe
	// (src/dmi/icon-ops.ts), and each proc just adds a step. Pixels are only worked out when asked for
	// (GetPixel here, or a drawing tool reading vm.runtimeIcons); Width/Height and icon_states() walk
	// the recipe without pixels.
	const recipes = new WeakMap<DMObject, IconRecipe>();
	vm.iconRecipes = recipes; // reachable for vm/snapshot.ts
	const fileSize = (p: string) => vm.iconSize?.(p) ?? null;
	const sizeOf = (vm: VM, v: Value, depth = 0): [number, number] => {
		if (v instanceof DMObject) {
			const r = recipes.get(v);
			if (r) return recipeSize(r, fileSize);
			return depth < 8 && v.hasVar("icon") ? sizeOf(vm, v.getVar("icon"), depth + 1) : [32, 32];
		}
		const path = v instanceof Resource ? v.path : typeof v === "string" ? v : null;
		const rt = path === null ? undefined : vm.runtimeIcons.get(path);
		if (rt) return recipeSize(rt, fileSize);
		return (path !== null && vm.iconSize?.(path)) || [32, 32];
	};
	/** Anything DM accepts as an icon, as a recipe source: a file path, a runtime icon, another /icon. */
	const iconSrc = (vm: VM, v: Value): IconRecipe["src"] => {
		if (v instanceof DMObject) return recipes.get(v) ?? (v.hasVar("icon") ? iconSrc(vm, v.getVar("icon")) : null);
		const path = v instanceof Resource ? v.path : typeof v === "string" ? v : null;
		return path === null ? null : vm.runtimeIcons.get(path) ?? path;
	};
	const asRecipe = (s: IconRecipe["src"]): IconRecipe => (s !== null && typeof s !== "string" ? s : { src: s, state: null, dir: 0, frame: 0, ops: [] });
	const recipeOf = (vm: VM, o: Value): IconRecipe => {
		if (!(o instanceof DMObject)) throw new DMRuntimeError("bad icon");
		return recipes.get(o) ?? { src: iconSrc(vm, o), state: null, dir: 0, frame: 0, ops: [] };
	};
	// ponytail: copying ops per call is O(n^2) for one icon with thousands of steps (SSminimap's
	// per-turf Blend, off by default in config). Share a prefix chain if that ever runs.
	const addOp = (vm: VM, src: Value, op: IconOp) => {
		const r = recipeOf(vm, src);
		recipes.set(src as DMObject, { ...r, ops: [...r.ops, op] });
		return null;
	};
	const pixelsOf = (vm: VM, o: Value) => evalRecipe(recipeOf(vm, o), (p) => vm.loadIcon?.(p) ?? null);
	/** A colour argument: "#rgb[a]", "#rrggbb[aa]" or a name (measured: case doesn't matter). [rgba, had alpha] or null. */
	const colorArg = (v: Value): [RGBA, boolean] | null => {
		if (typeof v !== "string") return null;
		const m = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(v);
		const h = m ? (m[1].length <= 4 ? [...m[1]].map((c) => c + c).join("") : m[1]) : parseColorText(v)?.slice(1);
		if (!h) return null;
		return [[0, 2, 4, 6].map((i) => (i < h.length ? parseInt(h.slice(i, i + 2), 16) : 255)) as RGBA, h.length === 8];
	};
	def("/icon/proc/New", (vm, [icon = null, state = null, dir = null, frame = null], src) => {
		const o = src as DMObject;
		o.setVar("icon", icon instanceof DMObject && icon.hasVar("icon") ? icon.getVar("icon") : icon);
		recipes.set(o, { src: iconSrc(vm, icon), state: typeof state === "string" ? state : null, dir: num(dir, 0), frame: num(frame, 0), ops: [] });
		return null;
	});
	def("/icon/proc/Blend", (vm, [icon = null, mode = null, x = null, y = null], src) => {
		const m = num(mode, 0);
		if (typeof icon === "string") {
			// measured: an unknown colour is a runtime error in BYOND, but a non-fatal one (the caller
			// carries on). Here: quietly nothing.
			const c = colorArg(icon);
			return c ? addOp(vm, src, { mode: m, color: c[0] }) : null;
		}
		const s = iconSrc(vm, icon);
		return s === null ? null : addOp(vm, src, { mode: m, x: num(x, 1), y: num(y, 1), icon: asRecipe(s) });
	});
	def("/icon/proc/GetPixel", (vm, [x = null, y = null, state = null, dir = null, frame = null], src) =>
		getPixel(pixelsOf(vm, src), num(x, 0), num(y, 0), typeof state === "string" ? state : null, num(dir, 0), num(frame, 0)));
	def("/proc/icon", (vm, args) => vm.newObject(type("/icon")!, args));
	def("/icon/proc/Width", (vm, _a, src) => sizeOf(vm, src)[0]);
	def("/icon/proc/Height", (vm, _a, src) => sizeOf(vm, src)[1]);
	def("/icon/proc/Scale", (vm, [w = null, h = null], src) =>
		typeof w === "number" && typeof h === "number" ? addOp(vm, src, { kind: "scale", w: Math.trunc(w), h: Math.trunc(h) }) : null);
	def("/icon/proc/Crop", (vm, [x1 = null, y1 = null, x2 = null, y2 = null], src) => {
		const c = [x1, y1, x2, y2].map((n) => Math.trunc(num(n, NaN)));
		return c.some(isNaN) ? null : addOp(vm, src, { kind: "crop", x1: c[0], y1: c[1], x2: c[2], y2: c[3] });
	});
	def("/icon/proc/Flip", (vm, [dir = null], src) => addOp(vm, src, { kind: "flip", dir: num(dir, 0) }));
	def("/icon/proc/Turn", (vm, [angle = null], src) => addOp(vm, src, { kind: "turn", angle: num(angle, 0) }));
	def("/icon/proc/Shift", (vm, [dir = null, offset = null, wrap = null], src) =>
		addOp(vm, src, { kind: "shift", dir: num(dir, 0), offset: Math.trunc(num(offset, 0)), wrap: !!wrap }));
	def("/icon/proc/SwapColor", (vm, [from = null, to = null], src) => {
		const f = colorArg(from), t = colorArg(to);
		if ((from !== null && !f) || (to !== null && !t)) return null; // unverified: bad colours
		return addOp(vm, src, { kind: "swap", from: f ? f[0] : null, exact: f ? f[1] : false, to: t ? t[0] : null });
	});
	def("/icon/proc/SetIntensity", (vm, [r = null, g = r, b = r], src) => {
		const [R, G, B] = [num(r, 1), num(g, num(r, 1)), num(b, num(r, 1))];
		return addOp(vm, src, { kind: "map", m: [R, 0, 0, 0, 0, G, 0, 0, 0, 0, B, 0, 0, 0, 0, 1, 0, 0, 0, 0], alpha: false });
	});
	def("/icon/proc/MapColors", (vm, args, src) => {
		// The 20-number layout: rows for old red, green, blue, alpha, then the offsets (0..1).
		const m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0];
		if (args.length && args.every((a) => typeof a === "string")) {
			// Colours: MapColors(red, green, blue[, rgb0]) leaves alpha alone (measured);
			// MapColors(red, green, blue, alpha, rgb0) maps it too, with "#rrggbb" meaning alpha 255.
			if (args.length < 3 || args.length > 5) return null;
			const cs = args.map((a) => colorArg(a)?.[0]);
			if (cs.some((c) => !c)) return null;
			const alpha = args.length === 5, rows = alpha ? [0, 1, 2, 3, 4] : [0, 1, 2, 4];
			cs.forEach((c, i) => c!.forEach((v, k) => (k < 3 || alpha) && (m[rows[i] * 4 + k] = v / 255)));
			return addOp(vm, src, { kind: "map", m, alpha });
		}
		const n = args.map((a) => num(a, 0));
		// Numbers: 9 (3x3) or 12 (3x3 + offsets) leave alpha alone; 20 is the full 4x4 + offsets.
		// measured: 16 is a (non-fatal) runtime error in BYOND and changes nothing; so do other counts here.
		if (n.length === 20) return addOp(vm, src, { kind: "map", m: n, alpha: true });
		if (n.length !== 9 && n.length !== 12) return null;
		for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) m[r * 4 + c] = n[r * 3 + c];
		if (n.length === 12) for (let c = 0; c < 3; c++) m[16 + c] = n[9 + c];
		return addOp(vm, src, { kind: "map", m, alpha: false });
	});
	def("/icon/proc/DrawBox", (vm, [rgb = null, x1 = null, y1 = null, x2 = null, y2 = null], src) => {
		const c = colorArg(rgb);
		if (rgb !== null && !c) return null;
		const X1 = Math.trunc(num(x1, 1)), Y1 = Math.trunc(num(y1, 1));
		return addOp(vm, src, { kind: "box", color: c ? c[0] : null, x1: X1, y1: Y1, x2: Math.trunc(num(x2, X1)), y2: Math.trunc(num(y2, Y1)) });
	});
	def("/icon/proc/Insert", (vm, [icon = null, state = null, dir = null, frame = null, moving = null, delay = null], src) => {
		const s = iconSrc(vm, icon);
		if (s === null) return null;
		return addOp(vm, src, {
			kind: "insert", icon: asRecipe(s), state: typeof state === "string" ? state : "",
			dir: num(dir, 0), frame: Math.trunc(num(frame, 0)), delay: typeof delay === "number" ? delay : null, moving: !!moving,
		});
	});
	// icon_states(icon, mode): measured: each name once, in file order, whatever the mode.
	def("/proc/icon_states", (vm, [icon = null]) => {
		const s = iconSrc(vm, icon);
		return new DMList(s === null ? [] : recipeStates(asRecipe(s), (p) => vm.iconStates?.(p) ?? null));
	});
	def("/proc/isicon", (vm, [v = null]) => {
		const it = type("/icon");
		if (v instanceof DMObject && it && v.type.isSubtypeOf(it)) return 1;
		return v instanceof Resource && /\.dmi$/i.test(v.path) ? 1 : 0;
	});
	// fcopy_rsc(/icon) caches a snapshot as a file (measured: isfile 1, isicon 1, not an /icon).
	// The path is our own name; BYOND's cache names aren't reproduced.
	def("/proc/fcopy_rsc", (vm, [f = null]) => {
		const it = type("/icon");
		if (!(f instanceof DMObject && it && f.type.isSubtypeOf(it))) return f;
		const path = `rsc/icon${vm.runtimeIcons.size + 1}.dmi`;
		vm.runtimeIcons.set(path, recipeOf(vm, f));
		return new Resource(path);
	});

	// ---- /matrix: [a b c; d e f] maps (x, y) to (a*x + b*y + c, d*x + e*y + f), as in BYOND.
	const M = (o: Value) => {
		if (!(o instanceof DMObject)) throw new DMRuntimeError("bad matrix");
		return o;
	};
	const getM = (o: DMObject) => ["a", "b", "c", "d", "e", "f"].map((k) => num(o.getVar(k), 0));
	const setM = (o: DMObject, v: number[]) => ["a", "b", "c", "d", "e", "f"].forEach((k, i) => o.setVar(k, fround(v[i])));
	const mul = (x: number[], y: number[]) => {
		// x then y (BYOND's Multiply: src = src * m, applying src first).
		const [a, b, c, d, e, f] = x, [A, B, C, D, E, F] = y;
		return [A * a + B * d, A * b + B * e, A * c + B * f + C, D * a + E * d, D * b + E * e, D * c + E * f + F];
	};
	def("/matrix/proc/New", (_vm, args, src) => {
		const o = M(src);
		if (args[0] instanceof DMObject) setM(o, getM(args[0]));
		else if (args.length >= 6) setM(o, args.slice(0, 6).map((v) => num(v, 0)));
		else setM(o, [1, 0, 0, 0, 1, 0]); // unverified: other argument counts
		return null;
	});
	def("/proc/matrix", (vm, args) => vm.newObject(type("/matrix")!, args));
	def("/matrix/proc/Multiply", (_vm, [m = null], src) => {
		const o = M(src);
		if (m instanceof DMObject) setM(o, mul(getM(o), getM(m)));
		else setM(o, getM(o).map((x) => x * num(m, 1)));
		return o;
	});
	def("/matrix/proc/Scale", (_vm, [x = null, y = null], src) => {
		const o = M(src);
		const sx = num(x, 1), sy = y === null ? sx : num(y, 1);
		setM(o, mul(getM(o), [sx, 0, 0, 0, sy, 0]));
		return o;
	});
	def("/matrix/proc/Translate", (_vm, [x = null, y = null], src) => {
		const o = M(src);
		const tx = num(x, 0), ty = y === null ? tx : num(y, 0);
		setM(o, mul(getM(o), [1, 0, tx, 0, 1, ty]));
		return o;
	});
	def("/matrix/proc/Turn", (_vm, [angle = null], src) => {
		// Clockwise degrees (BYOND's screen y points up).
		const o = M(src);
		const r = (num(angle, 0) * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
		setM(o, mul(getM(o), [c, s, 0, -s, c, 0]));
		return o;
	});
	def("/matrix/proc/Invert", (_vm, _a, src) => {
		const o = M(src);
		const [a, b, c, d, e, f] = getM(o);
		const det = a * e - b * d;
		if (det !== 0) setM(o, [e / det, -b / det, (b * f - c * e) / det, -d / det, a / det, (c * d - a * f) / det]);
		return o;
	});
	// Measured: operators make a new matrix. M/N is M * inverse(N). +, - are per-element.
	const matrixType = type("/matrix")!;
	const isM = (v: Value): v is DMObject => v instanceof DMObject && v.type.isSubtypeOf(matrixType);
	const inverse = (m: number[]) => {
		const [a, b, c, d, e, f] = m;
		const det = a * e - b * d;
		return det === 0 ? m : [e / det, -b / det, (b * f - c * e) / det, -d / det, a / det, (c * d - a * f) / det];
	};
	const fresh = (v: number[]) => {
		const o = vm.newObject(matrixType, []) as DMObject;
		setM(o, v);
		return o;
	};
	objectOperators.hook = (op, a, b) => {
		if (!isM(a)) return undefined;
		const x = getM(a);
		if (isM(b)) {
			const y = getM(b);
			switch (op) {
				case "+": return fresh(x.map((v, i) => v + y[i]));
				case "-": return fresh(x.map((v, i) => v - y[i]));
				case "*": return fresh(mul(x, y));
				case "/": return fresh(mul(x, inverse(y)));
			}
		}
		if (typeof b === "number" && (op === "*" || op === "/")) return fresh(x.map((v) => (op === "*" ? v * b : v / b)));
		return undefined;
	};
	// turn(matrix, angle): a turned copy (measured: the original is unchanged).
	vm.matrixTurn = (m, angle) => {
		if (!isM(m)) return undefined;
		const r = (angle * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
		return fresh(mul(getM(m), [c, s, 0, -s, c, 0]));
	};
	for (const [name, sign] of [["Add", 1], ["Subtract", -1]] as const) {
		def(`/matrix/proc/${name}`, (_vm, [m = null], src) => {
			const o = M(src);
			const other = getM(M(m));
			setM(o, getM(o).map((x, i) => x + sign * other[i]));
			return o;
		});
	}

	// ---- sound (the page plays it)
	def("/proc/sound", (vm, args) => vm.newObject(type("/sound")!, args));

	// ---- database (disabled). Connect()/is_connected stay 0, so every tg caller that checks them never queries.
	// execute reports success with no rows (next_row 0): tg's jobban_buildcache and friends query without a
	// connection check, and their warn_execute would otherwise print "A SQL error occured" in chat (sql1).
	// Audited: every unguarded caller reads rows only behind NextRow().
	for (const p of ["close", "columns", "connect", "error_msg", "execute", "is_connected", "new_con", "new_query", "next_row", "quote", "row_count", "rows_affected"]) {
		def(`/proc/_dm_db_${p}`, () => (p === "error_msg" ? "database disabled" : p === "quote" ? "" : p === "execute" ? 1 : p === "is_connected" || p === "connect" || p === "next_row" ? 0 : null));
	}

	// ---- md5 (text, or a file's contents). Unverified: md5 of a file value hashes the file.
	def("/proc/md5", (vm, [t = null]) => {
		if (t === null) return null;
		if (typeof t === "number") return ""; // measured: md5(5) is ""
		const s = t instanceof Resource ? vm.vfs.readText(t.path) : stringify(t);
		return s === null ? null : md5(s);
	});
}

/** MD5 of a text's bytes (one byte per char, as BYOND 511 has no Unicode), lowercase hex. */
export function md5(str: string): string {
	const bytes: number[] = [];
	for (let i = 0; i < str.length; i++) bytes.push(str.charCodeAt(i) & 0xff);
	const len = bytes.length;
	bytes.push(0x80);
	while (bytes.length % 64 !== 56) bytes.push(0);
	const bits = len * 8;
	for (let i = 0; i < 8; i++) bytes.push(i < 4 ? (bits >>> (8 * i)) & 0xff : i === 4 ? Math.floor(bits / 2 ** 32) & 0xff : 0);
	const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0);
	const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
	let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
	for (let off = 0; off < bytes.length; off += 64) {
		const M = Array.from({ length: 16 }, (_, i) => bytes[off + i * 4] | (bytes[off + i * 4 + 1] << 8) | (bytes[off + i * 4 + 2] << 16) | (bytes[off + i * 4 + 3] << 24));
		let A = a0, B = b0, C = c0, D = d0;
		for (let i = 0; i < 64; i++) {
			let F: number, g: number;
			if (i < 16) { F = (B & C) | (~B & D); g = i; }
			else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
			else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
			else { F = C ^ (B | ~D); g = (7 * i) % 16; }
			const s = S[(i >> 4) * 4 + (i % 4)];
			const tmp = D;
			D = C;
			C = B;
			const x = (A + F + K[i] + M[g]) | 0;
			B = (B + ((x << s) | (x >>> (32 - s)))) | 0;
			A = tmp;
		}
		a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
	}
	return [a0, b0, c0, d0].map((w) => Array.from({ length: 4 }, (_, i) => ((w >>> (8 * i)) & 0xff).toString(16).padStart(2, "0")).join("")).join("");
}
