// reads the compile-time maps straight from their .dmm files (web/game/_maps.ts lists them), instead of
// the Maps section of tgstation.json (gone). Gives exactly what OpenDream's DMMParser wrote there
// (OpenDream's DMCompiler/Compiler/DMM/DMMParser.cs), checked tile by tile
// against the JSON by tools/map-compare.mjs (retired):
// - a cell's last turf and last area win; every other type is an object, in file order; unknown types are skipped;
// - var overrides are constants: numbers, strings, null, 'resource', /type/path, list(...) (keys optional);
//   a repeated var name keeps the last value;
// - each file's z-levels start after the previous file's: zOffset = max(zOffset + 1, that map's MaxZ).
// Values come out in the JSON's form (JsonValue: types by number), so the VM loads them like the JSON's.

import type { JsonValue } from "./json.js";
import { JsonVarType } from "./json.js";
import type { DMType } from "./objtree.js";

/** A compile-time map as DMCompiler writes it (Maps[] in the JSON). */
export interface CompiledMap {
	MaxX: number;
	MaxY: number;
	MaxZ: number;
	CellDefinitions: Record<string, CompiledCell>;
	Blocks: { X: number; Y: number; Z: number; Width: number; Height: number; Cells: string[] }[];
}
export interface CompiledObject {
	Type: number;
	VarOverrides?: Record<string, JsonValue>;
}
export interface CompiledCell {
	Name?: string;
	Turf?: CompiledObject;
	Area?: CompiledObject;
	Objects?: CompiledObject[];
}

/** OpenDream's string markers for \proper and \improper (vm/markers.ts byondMarkers turns them into the VM's). */
const PROPER = "\uFF10", IMPROPER = "\uFF11";
const NUMBER = /-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/iy, INTEGER = /\d+/y;

/**
 * Parses one .dmm file. `typeOf` finds a type by path; `turf`/`area` are /turf and /area (a cell's turf or area is
 * any subtype). `file` only names the file in errors.
 */
export function parseDmm(text: string, file: string, zOffset: number, typeOf: (path: string) => DMType | undefined, turf: DMType, area: DMType): CompiledMap {
	let i = 0;
	const n = text.length;
	const fail = (msg: string): never => {
		const line = text.slice(0, i).split("\n").length;
		throw new Error(`${file}:${line}: ${msg}`);
	};
	const ws = (): void => {
		for (;;) {
			const c = text.charCodeAt(i);
			if (c === 32 || c === 9 || c === 10 || c === 13) i++;
			else if (c === 47 && text.charCodeAt(i + 1) === 47) { // comment to end of line
				while (i < n && text.charCodeAt(i) !== 10) i++;
			} else if (c === 47 && text.charCodeAt(i + 1) === 42) {
				const e = text.indexOf("*/", i + 2);
				i = e < 0 ? n : e + 2;
			} else return;
		}
	};
	const expect = (s: string): void => {
		ws();
		if (!text.startsWith(s, i)) fail(`expected '${s}'`);
		i += s.length;
	};
	const peek = (s: string): boolean => {
		ws();
		return text.startsWith(s, i);
	};
	const isPathChar = (c: number): boolean => (c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 95 || c === 47;
	const path = (): string => {
		ws();
		const a = i;
		while (i < n && isPathChar(text.charCodeAt(i))) i++;
		return text.slice(a, i);
	};
	const isWordChar = (c: number): boolean => (c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 95;
	const ident = (): string => {
		ws();
		const a = i;
		while (i < n && isWordChar(text.charCodeAt(i))) i++;
		if (a === i) fail("expected a name");
		return text.slice(a, i);
	};
	const typeRef = (p: string): JsonValue => {
		const t = typeOf(p);
		if (!t) fail(`no type ${p}`);
		return { type: JsonVarType.Type, value: t!.id };
	};
	// A "..." string; the {"..."} multi-line form only in map blocks.
	const str = (): string => {
		expect('"');
		let out = "";
		for (;;) {
			if (i >= n) fail("unterminated string");
			const c = text[i++];
			if (c === '"') return out;
			if (c === "[") fail("embedded expressions aren't allowed in map strings");
			if (c !== "\\") {
				out += c;
				continue;
			}
			const e = text[i++];
			if (/[a-zA-Z]/.test(e)) {
				let w = e;
				while (/[a-zA-Z]/.test(text[i])) w += text[i++];
				if ((w === "improper" || w === "proper") && out === "") {
					out = w === "proper" ? PROPER : IMPROPER;
					while (text[i] === " ") i++;
				} else if (w === "n") out += "\n";
				else if (w === "t") out += "\t";
				else fail(`text macro \\${w} isn't supported in map strings (src/vm/dmm.ts)`);
			} else if (e === '"' || e === "\\" || e === "[" || e === "]" || e === "'") out += e;
			else fail(`escape \\${e} isn't supported in map strings (src/vm/dmm.ts)`);
		}
	};
	const value = (): JsonValue => {
		ws();
		const c = text[i];
		if (c === '"') return str();
		if (c === "'") {
			const e = text.indexOf("'", i + 1);
			if (e < 0) fail("unterminated 'resource'");
			const r = text.slice(i + 1, e);
			i = e + 1;
			return { type: JsonVarType.Resource, resourcePath: r };
		}
		if (c === "/") return typeRef(path());
		NUMBER.lastIndex = i;
		const m = NUMBER.exec(text);
		if (m) {
			i += m[0].length;
			return Number(m[0]);
		}
		const w = ident();
		if (w === "null") return null;
		if (w === "list") {
			expect("(");
			const values: unknown[] = [];
			if (!peek(")")) {
				for (;;) {
					ws();
					// a bare name before '=' is a string key: list(a = 1)
					const save = i;
					let key: JsonValue | undefined;
					if (isWordChar(text.charCodeAt(i)) && text.charCodeAt(i) > 57) {
						const k = ident();
						if (peek("=") && !text.startsWith("==", i)) key = k;
						else i = save;
					}
					let v = value();
					if (key === undefined && peek("=") && !text.startsWith("==", i)) {
						i++;
						key = v;
						v = value();
					} else if (key !== undefined) {
						expect("=");
						v = value();
					}
					values.push(key === undefined ? v : { key, value: v });
					if (peek(",")) {
						i++;
						continue;
					}
					break;
				}
			}
			expect(")");
			return { type: JsonVarType.List, values } as unknown as JsonValue;
		}
		return fail(`can't read the value '${w}' (src/vm/dmm.ts reads constants only)`);
	};

	const map: CompiledMap = { MaxX: 0, MaxY: 0, MaxZ: 0, CellDefinitions: {}, Blocks: [] };
	let nameLen = -1;
	for (;;) {
		ws();
		if (i >= n) break;
		if (text[i] === '"') { // "aa" = (/obj/x{var = 1; ...}, /turf/y, /area/z)
			const name = str();
			expect("=");
			expect("(");
			const cell: CompiledCell = { Name: name, Objects: [] };
			for (;;) {
				const p = path();
				if (!p) fail("expected a type path");
				const t = typeOf(p);
				const obj: CompiledObject = { Type: t ? t.id : -1 };
				if (peek("{")) {
					i++;
					if (!peek("}")) {
						for (;;) {
							const k = ident();
							expect("=");
							(obj.VarOverrides ??= {})[k] = value();
							if (peek(";")) {
								i++;
								if (peek("}")) break;
								continue;
							}
							break;
						}
					}
					expect("}");
				}
				if (t) {
					if (t.isSubtypeOf(turf)) cell.Turf = obj;
					else if (t.isSubtypeOf(area)) cell.Area = obj;
					else cell.Objects!.push(obj);
				}
				if (peek(",")) {
					i++;
					continue;
				}
				break;
			}
			expect(")");
			if (nameLen === -1) nameLen = name.length;
			if (name.length !== nameLen) fail(`cell name "${name}" isn't ${nameLen} characters long`);
			map.CellDefinitions[name] = cell;
		} else if (text[i] === "(") { // (x,y,z) = {"\nrows\n"}
			i++;
			const xyz = [0, 0, 0];
			for (let k = 0; k < 3; k++) {
				if (k) expect(",");
				ws();
				INTEGER.lastIndex = i;
				const m = INTEGER.exec(text);
				if (!m) fail("expected an integer");
				xyz[k] = Number(m![0]);
				i += m![0].length;
			}
			expect(")");
			expect("=");
			expect('{"');
			const e = text.indexOf('"}', i);
			if (e < 0) fail("unterminated map block");
			const block = { X: xyz[0], Y: xyz[1], Z: xyz[2] + zOffset, Width: 0, Height: 0, Cells: [] as string[] };
			const [w, h] = readRows(text, i, e, nameLen, block.Cells);
			if (w < 0) fail("map block row length isn't a whole number of cells");
			block.Width = w;
			block.Height = h;
			i = e + 2;
			map.MaxX = Math.max(map.MaxX, block.X + block.Width - 1);
			map.MaxY = Math.max(map.MaxY, block.Y + block.Height - 1);
			map.MaxZ = Math.max(map.MaxZ, block.Z);
			map.Blocks.push(block);
		} else fail(`unexpected '${text[i]}'`);
	}
	return map;
}

/**
 * A map block's rows (text[i..e)) into `cells`, one cell name per tile, row by row. Returns [width, height], or
 * width -1 if a row isn't a whole number of cells. One row per line, blank lines skipped, whitespace around a row
 * ignored. Its own small function, scanned in place: it's most of the parse (325k tiles), and split/trim per line
 * inside parseDmm took ~3x longer.
 */
function readRows(text: string, i: number, e: number, nameLen: number, cells: string[]): [number, number] {
	let width = 0, height = 0;
	while (i < e) {
		let le = text.indexOf("\n", i);
		if (le < 0 || le > e) le = e;
		let a = i, b = le;
		while (a < b && text.charCodeAt(a) <= 32) a++;
		while (b > a && text.charCodeAt(b - 1) <= 32) b--;
		i = le + 1;
		if (a === b) continue;
		const len = b - a;
		if (len % nameLen !== 0) return [-1, 0];
		if (width < len / nameLen) width = len / nameLen;
		height++;
		for (let x = a; x < b; x += nameLen) cells.push(text.slice(x, x + nameLen));
	}
	return [width, height];
}

/** Parses the listed .dmm files in order, each starting on the z-level after the last one's (as DMCompiler does). */
export function parseDmms(files: string[], read: (file: string) => string | null, typeOf: (path: string) => DMType | undefined): CompiledMap[] {
	const turf = typeOf("/turf"), area = typeOf("/area");
	if (!turf || !area) throw new Error("no /turf or /area type");
	let zOffset = 0;
	return files.map((f) => {
		const text = read(f);
		if (text === null) throw new Error(`compiled map ${f} not found`);
		const m = parseDmm(text, f, zOffset, typeOf, turf, area);
		zOffset = Math.max(zOffset + 1, m.MaxZ);
		return m;
	});
}
