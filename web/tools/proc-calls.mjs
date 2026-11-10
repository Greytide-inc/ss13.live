// proc-calls.mjs - What counts as a proc call written by hand in web/game (detranslate step 8): the name rules shared by the bundler (translate-tg.mjs lowers them) and the robot (dt-calls.mjs writes them).
// A call `X.name(args)` is a DM proc call when `name` is the last part of some rt.def path and not one of JS_NAMES, and X is `this`,
// an expression, or rooted at a name its proc (or tail) declares (`A.x()`, `f.usr.say()`; not `Math.floor`, `rt.R.glob`, a file
// helper's `ms.filter`); `name(args)` is a global proc call when /proc/name has an rt.def and neither its proc nor the file's top
// level declares a `name` of its own; `parent_proc(args)` is DM's `..()`.
// A var read `X.name` (detranslate step 9a, readableVar) is DM's when `name` is a var some rt.type declares, not one of JS_VARS, and X
// is rooted the same way (not bare `f`, the frame); on `this` only for SRC_FIELDS, the DM names that aren't properties (`this.loc`).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";

/** DM proc names that are also JS method names game code calls on JS values (`ms.filter`, `nm.slice`): calls to them stay rt.callName. */
export const JS_NAMES = new Set(["filter", "apply", "clear", "pop", "trim", "get", "strike", "drop", "add", "fill", "slice", "blink", "search", "eval"]);
const JS_GLOBALS = new Set(Object.getOwnPropertyNames(globalThis));
/** what a JS method's name could be (prototypes of the built-ins game code holds); a DM proc named like one must be in JS_NAMES. */
const jsMethodNames = () => {
	const s = new Set();
	for (const o of [Array, String, Map, Set, Object, Function, RegExp, Number, Promise, Date, WeakMap, globalThis.Iterator].filter(Boolean))
		for (const k of Object.getOwnPropertyNames(o.prototype)) s.add(k);
	return s;
};

/** DM var names with a JS meaning (runtime.ts NOT_PROPS' first line): `o.length` stays a JS read, the DM var stays rt.fv. */
export const JS_VARS = new Set(["length", "size", "next", "value", "message", "stack", "caller", "arguments", "prototype"]);
/** the rest of NOT_PROPS: DM vars that are engine members, never properties, so `this.loc` is lowered to rt.sv (tests/dt-props.test.mjs). */
export const SRC_FIELDS = new Set(["type", "loc", "x", "y", "z", "contents", "key", "len", "items", "index", "contains", "copy", "cut", "drop", "range", "map", "owner", "sync"]);

/** Every var name an rt.type block in game/ declares (a `\tname: ` line between `rt.type(...{` and `});`). */
export function varNameSet(gameDir) {
	const out = new Set();
	const walk = (d) => {
		for (const e of readdirSync(d)) {
			const p = resolve(d, e);
			if (statSync(p).isDirectory()) walk(p);
			else if (e.endsWith(".ts")) {
				let inType = false;
				for (const line of readFileSync(p, "utf8").split("\n")) {
					if (inType) {
						if (line === "});") inType = false;
						else { const m = /^\t([A-Za-z_$][\w$]*): /.exec(line); if (m) out.add(m[1]); }
					} else if (line.startsWith("rt.type(") && line.endsWith("{")) inType = true;
				}
			}
		}
	};
	walk(gameDir);
	for (const n of JS_VARS) out.delete(n);
	return out;
}

/** { procNames, globalProcs } from every rt.def path under game/. Stops if a DM proc is named like a JS method but isn't in JS_NAMES. */
export function procNameSets(gameDir) {
	const procNames = new Set(), globalProcs = new Set(), waitNames = new Set(), waitGlobals = new Set(NATIVE_WAITS.map((p) => p.slice(6)));
	const walk = (d) => {
		for (const e of readdirSync(d)) {
			const p = resolve(d, e);
			if (statSync(p).isDirectory()) walk(p);
			else if (e.endsWith(".ts")) for (const m of readFileSync(p, "utf8").matchAll(/rt\.def\("([^"]+)"(,\s*function\s*\*)?/g)) {
				const path = m[1], name = path.slice(path.lastIndexOf("/") + 1);
				procNames.add(name);
				if (path === `/proc/${name}` && name !== "eval") globalProcs.add(name);
				if (m[2]) { waitNames.add(name); if (path === `/proc/${name}`) waitGlobals.add(name); }
			}
		}
	};
	walk(gameDir);
	const js = jsMethodNames(), clash = [...procNames].filter((n) => js.has(n) && !JS_NAMES.has(n));
	// (a newer Node's new method, or a new proc: in JS_NAMES its plain calls would turn into JS calls, so give them back their old spelling first)
	if (clash.length) throw new Error(`proc-calls: DM procs named like JS methods: ${clash.join(", ")}. Write their calls as rt.callName/g.callName, then add the names to JS_NAMES in tools/proc-calls.mjs`);
	if (procNames.has("parent_proc")) throw new Error("proc-calls: a DM proc named parent_proc: its calls would be taken for ..()");
	for (const b of ["prob", "pick", "each", "list", "new_"]) if (globalProcs.has(b)) throw new Error(`proc-calls: a global proc /proc/${b}: its calls would be taken for the DM built-in ${b}() (DM_BUILTINS)`);
	for (const p of NATIVE_WAITS) waitNames.add(p.slice(6));
	return { procNames, globalProcs, waitNames, waitGlobals };
}

/** Every name node binds anywhere inside it (variables, parameters, functions, imports). */
export function declaredNames(node) {
	const out = new Set();
	const bind = (n) => {
		if (ts.isIdentifier(n)) out.add(n.text);
		else if (ts.isObjectBindingPattern(n) || ts.isArrayBindingPattern(n)) for (const e of n.elements) if (!ts.isOmittedExpression(e)) bind(e.name);
	};
	const visit = (n) => {
		if (ts.isVariableDeclaration(n) || ts.isParameter(n) || ts.isBindingElement(n)) bind(n.name);
		else if ((ts.isFunctionDeclaration(n) || ts.isFunctionExpression(n) || ts.isClassDeclaration(n)) && n.name) out.add(n.name.text);
		else if (ts.isImportClause(n) && n.name) out.add(n.name.text);
		else if (ts.isNamespaceImport(n) || ts.isImportSpecifier(n)) out.add(n.name.text);
		ts.forEachChild(n, visit);
	};
	visit(node);
	return out;
}

/**
 * For a parsed file, the names in scope at a node: own(n), what its proc (or tail) function binds anywhere (its own name, f,
 * the arguments and locals, nested functions' too); all(n), those plus what the file's top level binds (imports,
 * `const { T } = rt`, helpers): a bare call to one of these isn't a global proc call. Outside a proc: own is empty, all is
 * every name the file binds.
 */
export function scopeNames(sf) {
	const top = new Set(), own = new Map(), all = new Map(), none = new Set();
	let file = null;
	for (const st of sf.statements) {
		const c = ts.isExpressionStatement(st) && ts.isCallExpression(st.expression) ? st.expression.expression.getText(sf) : "";
		if (c !== "rt.def" && c !== "rt.tail") for (const x of declaredNames(st)) top.add(x);
	}
	const ownOf = (fn) => { let s = own.get(fn); if (!s) own.set(fn, (s = declaredNames(fn))); return s; };
	return {
		own: (n) => { const fn = procFunction(n); return fn ? ownOf(fn) : none; },
		all: (n) => {
			const fn = procFunction(n);
			if (!fn) return (file ??= declaredNames(sf));
			let s = all.get(fn);
			if (!s) all.set(fn, (s = new Set([...top, ...ownOf(fn)])));
			return s;
		},
	};
}

/**
 * True if a call on `recv` (at node n) is a JS method call whatever its name: in a proc, a property chain rooted at a name the
 * proc doesn't bind; outside one, rooted at rt, g or a JS global (anything else there is a mistake the bundler stops on).
 */
export function jsReceiver(recv, n, scope) {
	let r = recv;
	while (ts.isPropertyAccessExpression(r) || ts.isElementAccessExpression(r)) r = r.expression;
	if (!ts.isIdentifier(r)) return false;
	if (globRoot(r, scope)) return false;
	return procFunction(n) ? !scope.own(n).has(r.text) : r.text === "rt" || r.text === "g" || JS_GLOBALS.has(r.text);
}

/** the bare name GLOB in a proc where neither the proc nor the file binds one: DM's globals (readableGlobal) */
const globRoot = (r, scope) => ts.isIdentifier(r) && r.text === "GLOB" && !!procFunction(r) && !scope.all(r).has("GLOB");
/**
 * The DM global a hand-written `GLOB.name` in a proc stands for (detranslate step 9g, tg's own spelling: GLOB.player_list, GLOB.SSair),
 * or null: the global `name` of game/_globals.ts (its first one of that name). Read rt.gl("name"), `=` rt.setGl, `+=` rt.modGl, `++`
 * rt.incGl; GLOB itself is no value (`GLOB.GLOB` is the global named GLOB).
 */
export const readableGlobal = (n, scope) => (ts.isPropertyAccessExpression(n) && !n.questionDotToken && ts.isIdentifier(n.name) && globRoot(n.expression, scope) ? n.name.text : null);

/** The proc (or tail) function a node is in: the function expression of the top-level rt.def / rt.tail around it, or null. */
export function procFunction(n) {
	for (let p = n; p; p = p.parent) {
		if (ts.isFunctionExpression(p) && ts.isCallExpression(p.parent) && p.parent.arguments[1] === p && ts.isExpressionStatement(p.parent.parent)
			&& ts.isSourceFile(p.parent.parent.parent) && /^rt\.(def|tail)$/.test(p.parent.expression.getText())) return p;
	}
	return null;
}
/**
 * Whether `this` and the frame's src part ways in the proc (or tail) around n: it assigns `f.src` (DM's `src = null`). A tail
 * also runs on its proc's frame (rt.tail's `.call(f.src, ...)` hands it src as the sleep ended), so a tail whose proc assigns
 * f.src counts too; the owner is the tail's name before ": spawn at" (a tail with another name, or whose proc isn't in the
 * file, counts as moving).
 */
const SRC_ASSIGN = /\bf\.src\s*=[^=]/;
const movesCache = new WeakMap();
export function procMovesSrc(n) {
	const pf = procFunction(n);
	if (!pf) return false;
	let r = movesCache.get(pf);
	if (r !== undefined) return r;
	r = SRC_ASSIGN.test(pf.getText());
	const call = pf.parent;
	if (!r && call.expression.getText() === "rt.tail") {
		const name = call.arguments[0], i = ts.isStringLiteral(name) ? name.text.indexOf(": ") : -1;
		r = true;
		if (i > 0) {
			const owner = name.text.slice(0, i);
			let found = false;
			for (const st of call.parent.parent.statements) {
				const c = ts.isExpressionStatement(st) && ts.isCallExpression(st.expression) ? st.expression : null;
				if (c && c.expression.getText() === "rt.def" && ts.isStringLiteral(c.arguments[0]) && c.arguments[0].text === owner) {
					found = true;
					if (SRC_ASSIGN.test(c.getText())) { r = true; break; }
					r = false;
				}
			}
			if (!found) r = true;
		}
	}
	movesCache.set(pf, r);
	return r;
}
/** The nearest function around n (arrows included): whether a call there runs as a generator's. */
export function nearestFunction(n) {
	for (let p = n.parent; p; p = p.parent) if (ts.isFunctionLike(p)) return p;
	return null;
}
/** The nearest non-arrow function around n: `this` there is src only when it's the proc's own function. */
export function thisFunction(n) {
	for (let p = n.parent; p; p = p.parent) if (ts.isFunctionLike(p) && !ts.isArrowFunction(p)) return p;
	return null;
}

/**
 * The built-in procs that can pause the caller (src/vm: requestSleep, a prompt; tests/dt-calls.test.mjs checks the list). With every
 * proc defined as a function*, they are what a call can wait on (procNameSets' waitNames: a method name some definition of which can
 * pause, waitGlobals: a global proc's).
 */
export const NATIVE_WAITS = ["/proc/sleep", "/proc/alert", "/proc/winget", "/proc/winexists"];
/**
 * Whether a proc call (readableCall's) can pause, so needs `yield*` written before it in a function* (detranslate step 9f): `..()`
 * always, a method call when any proc of that name is a function*, a global proc when it is one or a pausing built-in.
 */
export const callCanWait = (rc, { waitNames, waitGlobals }) => rc.kind === "super" || (rc.kind === "global" ? waitGlobals.has(rc.name) : waitNames.has(rc.name));

/**
 * The hand-written proc call n stands for, or null: { kind, name, at (the name's node), recv (kind "name") }. kind: "name"
 * `X.name(args)`, "src" `this.name(args)`, "global" `name(args)` (/proc/name), "super" `parent_proc(args)` (DM's `..()`).
 */
export function readableCall(n, { procNames, globalProcs, scope }) {
	if (!ts.isCallExpression(n) || n.questionDotToken) return null;
	const e = n.expression;
	if (ts.isIdentifier(e)) {
		if (!globalProcs.has(e.text) && e.text !== "parent_proc") return null;
		if (scope.all(n).has(e.text)) return null;
		return { kind: e.text === "parent_proc" ? "super" : "global", name: e.text, at: e };
	}
	if (!ts.isPropertyAccessExpression(e) || e.questionDotToken || !ts.isIdentifier(e.name) || globRoot(e.expression, scope)) return null;
	const name = e.name.text;
	if (!procNames.has(name) || JS_NAMES.has(name) || jsReceiver(e.expression, n, scope)) return null;
	return { kind: e.expression.kind === ts.SyntaxKind.ThisKeyword ? "src" : "name", name, at: e.name, recv: e.expression };
}

/**
 * The hand-written DM var access n stands for, or null: { kind, name, recv }. n is a property read `X.name` (not a call's callee:
 * that's readableCall's). kind "field" `X.name` (rt.fv), "src" `this.name` for SRC_FIELDS (rt.sv). Its write `X.name = v` is the
 * assignment whose left side this is; the bundler decides what a use other than a read or `=` means.
 */
export function readableVar(n, { varNames, scope }) {
	if (!ts.isPropertyAccessExpression(n) || n.questionDotToken || !ts.isIdentifier(n.name) || !varNames.has(n.name.text)) return null;
	if (ts.isCallExpression(n.parent) && n.parent.expression === n) return null;
	const r = n.expression, name = n.name.text;
	if (!procFunction(n)) return null;
	if (r.kind === ts.SyntaxKind.ThisKeyword) return SRC_FIELDS.has(name) ? { kind: "src", name, recv: r } : null;
	if (ts.isIdentifier(r) && r.text === "f") return null;
	if (globRoot(r, scope) || jsReceiver(r, n, scope)) return null;
	return { kind: "field", name, recv: r };
}

/**
 * DM's operators (detranslate step 9b): inside a proc (procFunction) every arithmetic and comparison operator is DM's, and the
 * bundler lowers it to the runtime call the translator wrote: `a + b` -> add(a, b), `a < b` -> rt.lt(a, b), `-a` -> rt.neg(a)
 * (`-1`, `-Infinity` are constants), `a == b` -> isEqual(a, b) and `a != b` -> !isEqual(a, b) (step 9i), `x += v` -> x = rt.modify(x, v, add) (rt.modSrcVar on this.x, rt.modField on o.x), `x++` ->
 * x = rt.inc(x, 1) (rt.incSrcVar, rt.incField). DM's bit operators stay calls (rt.bitOr: 16 bits, lists): the bundler stops on a
 * plain one in a proc. Outside procs (a file's own helper functions) operators are JavaScript's.
 */
const K = ts.SyntaxKind;
export const DM_BINARY = { __proto__: null, [K.PlusToken]: "add", [K.MinusToken]: "subtract", [K.AsteriskToken]: "multiply", [K.SlashToken]: "divide",
	[K.PercentToken]: "rt.modulus", [K.AsteriskAsteriskToken]: "rt.power", [K.LessThanToken]: "rt.lt", [K.LessThanEqualsToken]: "rt.le",
	[K.GreaterThanToken]: "rt.gt", [K.GreaterThanEqualsToken]: "rt.ge", [K.EqualsEqualsToken]: "isEqual" };
/** `a != b` in a proc: `!isEqual(a, b)` (detranslate step 9i; `===` and `!==` stay JavaScript's) */
export const DM_NEGATED = { __proto__: null, [K.ExclamationEqualsToken]: "isEqual" };
export const DM_ASSIGN = { __proto__: null, [K.PlusEqualsToken]: "add", [K.MinusEqualsToken]: "subtract", [K.AsteriskEqualsToken]: "multiply",
	[K.SlashEqualsToken]: "divide", [K.PercentEqualsToken]: "rt.modulus" };
export const BIT_OPS = new Set([K.BarToken, K.AmpersandToken, K.CaretToken, K.LessThanLessThanToken, K.GreaterThanGreaterThanToken,
	K.GreaterThanGreaterThanGreaterThanToken, K.BarEqualsToken, K.AmpersandEqualsToken, K.CaretEqualsToken, K.LessThanLessThanEqualsToken,
	K.GreaterThanGreaterThanEqualsToken, K.GreaterThanGreaterThanGreaterThanEqualsToken, K.AsteriskAsteriskEqualsToken]);
/** `-1`, `-Infinity`: a constant, not DM's negation */
export const constNeg = (n) => ts.isPrefixUnaryExpression(n) && n.operator === K.MinusToken
	&& (ts.isNumericLiteral(n.operand) || (ts.isIdentifier(n.operand) && n.operand.text === "Infinity"));
export const RT_ALIASES = ["T", "P", "g", "truthy", "isEqual", "add", "subtract", "multiply", "divide", "fmt"];
/** the names a file's top level takes from the runtime (`const { T, add, ... } = rt;`) */
export function rtAliases(sf) {
	const out = new Set();
	for (const st of sf.statements) {
		if (!ts.isVariableStatement(st)) continue;
		for (const d of st.declarationList.declarations)
			if (ts.isObjectBindingPattern(d.name) && d.initializer && ts.isIdentifier(d.initializer) && d.initializer.text === "rt")
				for (const e of d.name.elements) if (!e.propertyName && ts.isIdentifier(e.name)) out.add(e.name.text);
	}
	// pb-imports: a file with the standard head lists only the names it writes; the build treats it as having all of them (strip.ts keeps its older 7-name line)
	const head = sf.statements.some((x) => ts.isImportDeclaration(x) && x.importClause?.isTypeOnly && x.importClause.namedBindings?.elements?.map((e) => e.name.text).join() === "Frame,Value");
	if (head && !(out.size === 7 && out.has("fmt") && !out.has("subtract"))) for (const n of RT_ALIASES) out.add(n);
	return out;
}
/** how an operator's runtime function is written at n: its bare alias where the file has one its proc doesn't shadow, else rt.name */
export const opFunction = (fn, n, aliases, scope) => (fn.startsWith("rt.") || (aliases.has(fn) && !scope.own(n).has(fn)) ? fn : `rt.${fn}`);
/** a left side `x op= v` and `x++` may repeat (lowered to `x = rt.modify(x, v, op)`): a local, f.dot, f.args[N] */
export const plainTarget = (n) => ts.isIdentifier(n)
	|| (ts.isPropertyAccessExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "f" && ts.isIdentifier(n.name))
	|| (ts.isElementAccessExpression(n) && ts.isPropertyAccessExpression(n.expression) && n.expression.getText() === "f.args" && ts.isNumericLiteral(n.argumentExpression));

/**
 * DM built-ins written as plain calls (detranslate step 9c): in a proc, `prob(p)` is rt.op(f, "Prob", [], [p]) and `pick(a, b)`
 * rt.op(f, "PickUnweighted", [2], [a, b]) (the count of its arguments first), unless the proc or the file binds the name.
 */
export const DM_BUILTINS = { __proto__: null, prob: "Prob", pick: "PickUnweighted" };
/** `list(a, b)` in a proc is DM's list() (detranslate step 9j): rt.list(a, b), unless the proc or the file binds `list` */
/**
 * `new_(T("/obj/x"), a, b)` in a proc is DM's `new /obj/x(a, b)` (detranslate step 9k): rt.new_(f, T, [a, b]); `yield* new_(...)`
 * (a New() that may sleep) g.new_. Named arguments and var overrides keep the old spelling (rt.Args.Named, rt.newOv).
 */
/** the object literal that is a proc call's named arguments (detranslate step 10a): its last argument `{ key: value }`, or null */
export const namedObj = (n) => { const l = n.arguments[n.arguments.length - 1]; return l && ts.isObjectLiteralExpression(l) ? l : null; };
export const isNewCall = (n, scope) => ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "new_" && !!procFunction(n) && !scope.all(n).has("new_");
export const isListCall = (n, scope) => ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "list" && !!procFunction(n) && !scope.all(n).has("list");

/**
 * DM's list loop written plainly (detranslate step 9h): in a proc, `for (M of each(L, T("/mob"))) {...}` is DM's
 * `for(var/mob/M in L)` (the list as it was when the loop began, only items of that type; `each(L)`: every item), M a local
 * declared at the top. The bundler writes the translator's `rt.forList(f, K, L, T); while (($e = rt.next(f, K)) !== undefined) { M = $e;`
 * ... `} rt.endFor(f, K);` on the same lines. K, the frame's enumerator slot, is eachSlot's: one past the deepest list or range loop
 * around it in its proc (a plain one's, or a translated one's `rt.next(f, K)` in its condition or first statement, or an
 * `if` whose condition reads one), else 0.
 */
export const isEachLoop = (n, scope) => ts.isForOfStatement(n) && !n.awaitModifier && ts.isCallExpression(n.expression) && ts.isIdentifier(n.expression.expression)
	&& n.expression.expression.text === "each" && !!procFunction(n) && !scope.all(n).has("each");
/** the K of the first `rt.next(f, K)` in n (not inside a nested function), or -1 */
const nextSlotIn = (n) => {
	let k = -1;
	const look = (x) => {
		if (k >= 0 || ts.isFunctionLike(x)) return;
		if (ts.isCallExpression(x) && x.expression.getText() === "rt.next" && x.arguments.length === 2 && ts.isNumericLiteral(x.arguments[1])) { k = +x.arguments[1].text; return; }
		ts.forEachChild(x, look);
	};
	look(n);
	return k;
};
/** the enumerator slot a loop statement holds while its body runs, or -1: a plain list loop's, or a translated one's */
export function loopSlot(st, scope) {
	if (isEachLoop(st, scope)) return eachSlot(st, scope);
	if (ts.isIfStatement(st)) return nextSlotIn(st.expression); // a loop that always breaks: `if (($e = rt.next(f, K)) !== undefined) {`
	if (!ts.isWhileStatement(st) && !ts.isDoStatement(st) && !ts.isForStatement(st)) return -1;
	const c = st.expression ?? st.condition, k = c ? nextSlotIn(c) : -1;
	if (k >= 0) return k;
	const first = ts.isBlock(st.statement) ? st.statement.statements[0] : null;
	return first && ts.isIfStatement(first) ? nextSlotIn(first.expression) : -1;
}
export function eachSlot(n, scope) {
	const fn = procFunction(n);
	let s = 0;
	for (let p = n.parent; p && p !== fn; p = p.parent) { const k = loopSlot(p, scope); if (k >= 0) s = Math.max(s, k + 1); }
	return s;
}

/**
 * `x = x;` that does nothing (detranslate step 9e): a statement of its own assigning a name to itself, where the name is a parameter
 * or a let/var of an enclosing function, the let's declaration ending before it (else it would throw: TDZ, a const, no such name).
 */
export function selfAssignment(st) {
	if (!ts.isExpressionStatement(st)) return false;
	let e = st.expression;
	while (ts.isParenthesizedExpression(e)) e = e.expression;
	if (!ts.isBinaryExpression(e) || e.operatorToken.kind !== ts.SyntaxKind.EqualsToken || !ts.isIdentifier(e.left) || !ts.isIdentifier(e.right) || e.left.text !== e.right.text) return false;
	const name = e.left.text, at = st.getStart();
	for (let fn = st.parent; fn; fn = fn.parent) {
		if (!ts.isFunctionLike(fn)) continue;
		if (fn.parameters.some((p) => ts.isIdentifier(p.name) && p.name.text === name)) return true;
		let found = null;
		const look = (n) => {
			if (found || (n !== fn && ts.isFunctionLike(n))) return;
			if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === name) found = n;
			else ts.forEachChild(n, look);
		};
		ts.forEachChild(fn, look);
		if (found) {
			const list = found.parent;
			return !(list.flags & ts.NodeFlags.Const) && ((list.flags & ts.NodeFlags.Let) === 0 || found.end <= at);
		}
	}
	return false;
}
