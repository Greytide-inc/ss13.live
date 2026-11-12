#!/usr/bin/env node
// sleepy-new.mjs - Lists every plain (non-generator) proc that does new_(T("/literal")) where that type's New or <init> can reach a real wait.
// Usage (from web/): node tools/sleepy-new.mjs [GAME_DIR] [--why]   (--why: the calls down to the wait; prints one "proc | type | file:line" per hit; default GAME_DIR web/game)
// Why: a plain proc can't pause, so when the New it starts sleeps the runtime throws "slept under a plain proc's new"
// (runtime.ts callGenFromPlain). That crash reached a player once: every explosion ended the page (69fb3a500). This finds
// the shape before a player does. tests/sleepy-new.test.mjs holds the reviewed list.
// Rule, on names alone like the bundler (proc-calls.mjs): a proc can wait if it calls sleep/alert/winget/winexists/input()/
// sleepThen/sleepKeep, or calls by name any proc that can wait (src.x() only x on its own type line; a bare x() only /proc/x) (a `set waitfor = 0` proc doesn't pass it on), its parent_proc
// can wait, or it news a type whose New can. A New with waitfor 0 still counts: the runtime throw ignores it.
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import ts from "typescript";

const JS_NAMES = new Set(["filter", "apply", "clear", "pop", "trim", "get", "strike", "drop", "add", "fill", "slice", "blink", "search", "eval"]);
const NATIVE_WAITS = new Set(["sleep", "alert", "winget", "winexists"]);
const str = (n) => (n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) ? n.text : null);
const lastSeg = (p) => p.slice(p.lastIndexOf("/") + 1);
const procArgName = (n) => (n && ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "P" && str(n.arguments[0]) ? lastSeg(str(n.arguments[0])) : null);
const typeArg = (n) => (n && ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "T" ? str(n.arguments[0]) : null);
/** every name bound anywhere inside node */
function declaredIn(node) {
	const out = new Set();
	const bind = (n) => { if (ts.isIdentifier(n)) out.add(n.text); else if (ts.isObjectBindingPattern(n) || ts.isArrayBindingPattern(n)) for (const e of n.elements) if (!ts.isOmittedExpression(e)) bind(e.name); };
	const visit = (n) => {
		if (ts.isVariableDeclaration(n) || ts.isParameter(n) || ts.isBindingElement(n)) bind(n.name);
		else if ((ts.isFunctionDeclaration(n) || ts.isFunctionExpression(n) || ts.isClassDeclaration(n)) && n.name) out.add(n.name.text);
		ts.forEachChild(n, visit);
	};
	visit(node);
	return out;
}
const nearFn = (n) => { for (let p = n.parent; p; p = p.parent) if (ts.isFunctionLike(p)) return p; return null; };
const rootOf = (e) => { while (ts.isPropertyAccessExpression(e) || ts.isElementAccessExpression(e)) e = e.expression; return e; };

/** one record per rt.def / rt.tail with its calls, plus each rt.type's parent */
function readGame(game) {
	const files = [], defs = [], tails = new Map(), typeParent = new Map();
	(function walk(d) { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith(".ts") && !e.name.endsWith(".d.ts")) files.push(p); } })(game);
	for (const file of files) {
		const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
		const rel = relative(game, file);
		const kindOf = (st) => ts.isExpressionStatement(st) && ts.isCallExpression(st.expression) && ts.isPropertyAccessExpression(st.expression.expression)
			&& ts.isIdentifier(st.expression.expression.expression) && st.expression.expression.expression.text === "rt"
			&& /^(def|tail|type)$/.test(st.expression.expression.name.text) ? st.expression.expression.name.text : null;
		const top = new Set();
		for (const st of sf.statements) if (!kindOf(st)) for (const x of declaredIn(st)) top.add(x);
		for (const st of sf.statements) {
			const kind = kindOf(st);
			if (!kind) continue;
			const call = st.expression, a = call.arguments;
			if (kind === "type") { const p = str(a[1]); if (p) typeParent.set(p, str(a[2])); continue; }
			const name0 = str(a[0]), fn = a[1];
			if (!name0 || !fn || !(ts.isFunctionExpression(fn) || ts.isArrowFunction(fn))) continue;
			const own = declaredIn(fn);
			const d = { kind, path: name0, file: rel, gen: !!fn.asteriskToken, directWait: false, calls: [], inline: [],
				waitfor0: kind === "def" && /\bwaitfor:\s*false/.test(a.slice(2).map((x) => x.getText(sf)).join(" ")) };
			if (kind === "def") { const i = name0.search(/\/(proc|verb)\//); d.type = i < 0 ? "" : name0.slice(0, i); d.name = lastSeg(name0); }
			else { d.name = name0; tails.set(rel + "::" + name0, d); }
			const visit = (n) => {
				if (ts.isCallExpression(n)) {
					const e = n.expression, args = n.arguments, nf = nearFn(n);
					const gen = !!(nf && nf.asteriskToken), yielded = ts.isYieldExpression(n.parent) && !!n.parent.asteriskToken;
					let c = null;
					if (ts.isIdentifier(e)) {
						const id = e.text;
						if (!own.has(id) && !top.has(id)) c = id === "new_" ? { t: "new", type: typeArg(args[0]) } : id === "parent_proc" ? { t: "super" } : NATIVE_WAITS.has(id) ? { t: "wait" } : { t: "global", name: id };
					} else if (ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.name)) {
						const nm = e.name.text, r = e.expression;
						if (ts.isIdentifier(r) && (r.text === "g" || r.text === "rt") && !own.has(r.text)) {
							if (nm === "op") c = str(args[1]) === "Prompt" ? { t: "wait" } : null;
							else if (nm === "call") { const p = procArgName(args[1]); c = p ? { t: "global", name: p } : { t: "dyn" }; }
							else if (nm === "callName" || nm === "callDyn") { const s = str(args[2]); c = s ? { t: "method", name: s } : { t: "dyn" }; }
							else if (nm === "callSrc" || nm === "srcCall") { const s = str(args[1]); c = s ? { t: "method", name: s, self: true } : { t: "dyn" }; }
							else if (nm === "callSelf") c = { t: "self" };
							else if (nm === "callSuper") c = { t: "super" };
							else if (nm === "new_" || nm === "newOv") c = { t: "new", type: typeArg(args[1]) };
							else if (nm === "del") c = { t: "method", name: "Del" };
							else if (nm === "sleepThen" || nm === "sleepKeep") { c = { t: "wait" }; const s = str(args[2]); if (s) d.inline.push(s); }
						} else if (!(ts.isPropertyAccessExpression(r) && ts.isIdentifier(r.expression) && r.expression.text === "f" && /^args(List)?$/.test(r.name.text))
							&& !(ts.isElementAccessExpression(r) && r.expression.getText(sf) === "f.args")) { // f.argsList.Copy(): a list's own proc
							const root = rootOf(r);
							c = { t: "unres", name: nm, self: r.kind === ts.SyntaxKind.ThisKeyword, dm: !ts.isIdentifier(root) || root.text === "GLOB" || own.has(root.text) };
						}
					}
					if (c) {
						Object.assign(c, { yielded, gen, line: sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1 });
						d.calls.push(c);
						if (c.t === "wait") d.directWait = true;
					}
				}
				ts.forEachChild(n, visit);
			};
			visit(fn.body);
			defs.push(d);
		}
	}
	return { defs, tails, typeParent };
}

/** [{proc, type, file, line}] sorted: plain procs that new a type whose New/<init> can reach a wait */
export function sleepyNews(game = resolve(import.meta.dirname, "../game")) {
	const { defs, tails, typeParent } = readGame(game);
	const real = defs.filter((d) => d.kind === "def");
	const procNames = new Set(real.map((d) => d.name)), globalNames = new Set(real.filter((d) => d.path === "/proc/" + d.name).map((d) => d.name));
	for (const d of defs) for (const c of d.calls) {
		if (c.t === "global") c.t = globalNames.has(c.name) ? "global" : "other";
		else if (c.t === "unres") c.t = procNames.has(c.name) && ((!JS_NAMES.has(c.name) && c.dm) || c.yielded) ? "method" : "other";
	}
	const byTypeName = new Map();
	for (const d of real) byTypeName.set(d.type + "|" + d.name, d);
	const ancestors = (t) => { const o = []; for (let p = typeParent.get(t); p && o.length < 60; p = typeParent.get(p)) o.push(p); return o; };
	for (const d of real) d.superDef = d.type ? ancestors(d.type).map((a) => byTypeName.get(a + "|" + d.name)).find(Boolean) ?? null : null;
	const reach = new Map(defs.map((d) => [d, d.directWait])), why = new Map(); // why: the call that made a def reach
	const nameReach = new Map(); // name -> the defs of that name that can wait (and pass it on: not waitfor 0)
	const lineage = new Map(), lin = (t) => lineage.get(t) ?? lineage.set(t, new Set([t, ...ancestors(t)])).get(t);
	/** the def a call reaches a wait through, or null. src.x() only reaches x on the caller's own type, its ancestors or its subtypes */
	const callee = (d, c) => {
		if (c.t === "global") { const x = byTypeName.get("|" + c.name); return x && reach.get(x) && !x.waitfor0 ? x : null; }
		const rs = nameReach.get(c.name);
		if (!rs) return null;
		if (!c.self || !d.type) return rs[0];
		return rs.find((x) => lin(d.type).has(x.type) || lin(x.type).has(d.type)) ?? null;
	};
	const newDef = (type) => { // the New/<init> that waits, true for an unknown type (may pause), else null
		if (!type || !typeParent.has(type)) return true;
		for (const t of [type, ...ancestors(type)]) for (const n of ["New", "<init>"]) { const x = byTypeName.get(t + "|" + n); if (x && reach.get(x)) return x; }
		return null;
	};
	const newReach = (type) => !!newDef(type);
	const trail = (d) => { // "New > stoplag > sleep": names down to the wait
		const out = [];
		for (let i = 0; d && d !== true && i < 12; i++) {
			const c = why.get(d);
			out.push(d.path + (c && c.line ? ":" + c.line : ""));
			if (!c) { out.push("(waits)"); break; }
			d = c.t === "method" || c.t === "global" ? callee(d, c) : c.t === "super" ? d.superDef : c.t === "new" ? newDef(c.type) : c.t === "tail" ? tails.get(d.file + "::" + c.name) : null;
			if (c.t === "dyn") out.push("(dynamic call)");
			if (d === true) out.push("(new of an unknown type)");
		}
		return out.join(" > ");
	};
	for (let changed = true; changed;) {
		changed = false;
		for (const d of defs) {
			if (reach.get(d)) continue;
			const c = d.calls.find((c) => ((c.t === "method" || c.t === "global") && callee(d, c)) || c.t === "dyn"
				|| (c.t === "super" && d.superDef && reach.get(d.superDef) && !d.superDef.waitfor0) || (c.t === "new" && newReach(c.type)));
			const s = c ? null : d.inline.find((s) => reach.get(tails.get(d.file + "::" + s)));
			if (c || s) { reach.set(d, true); why.set(d, c ? c : { t: "tail", name: s }); changed = true; }
		}
		for (const d of real) if (reach.get(d) && !d.waitfor0 && !d.listed) { d.listed = true; (nameReach.get(d.name) ?? nameReach.set(d.name, []).get(d.name)).push(d); changed = true; }
	}
	const hits = [];
	for (const d of defs) for (const c of d.calls) if (c.t === "new" && c.type && !c.gen && !c.yielded && newReach(c.type)) hits.push({ proc: d.path, type: c.type, file: "game/" + d.file, line: c.line, trail: trail(newDef(c.type)) });
	const seen = new Set();
	return hits.filter((h) => !seen.has(h.proc + "|" + h.type) && seen.add(h.proc + "|" + h.type)).sort((a, b) => (a.proc + a.type < b.proc + b.type ? -1 : 1));
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const dir = process.argv.slice(2).find((a) => !a.startsWith("--")), t0 = Date.now(), hits = sleepyNews(dir ? resolve(dir) : undefined);
	for (const h of hits) console.log(`${h.proc} | ${h.type} | ${h.file}:${h.line}` + (process.argv.includes("--why") ? `\n    ${h.trail}` : ""));
	console.log(`${hits.length} plain procs new a type whose New can wait (${Date.now() - t0} ms)`);
}
