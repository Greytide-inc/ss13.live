#!/usr/bin/env node
// name-check.mjs - DM's compile check for game code: a name in a proc that nothing in web/game declares (a typo) is an error.
// Usage (from web/): node tools/name-check.mjs [FILE...]   (no FILE: every game file; exit 1 if anything was found)
// The game code is never type-checked (translate-tg.mjs only strips types), and almost every value is a `Value` ("any DM thing"),
// so TypeScript can't say `W.remove_feul` is wrong. DM's compiler did: an unknown var or proc stopped the build. This does the
// same on names alone, inside rt.def/rt.tail procs:
//   o.name and o.name(...)        name is some type's var, some proc, or a JS member (a list's .push), else "unknown var or proc"
//   rt.fv/setFv/sv/setSv(f, "n")  n is some type's var;  rt.callSrc(f, "n") / rt.callName(f, o, "n"): n is some proc
//   rt.gl/setGl("n")              n is a global of game/_globals.ts
//   a bare name                   declared in the proc or file, a global proc, a #define (_defines.d.ts), a JS global, or a name
//                                 the build lowers (GLOB, new_, list, each, prob, pick), else "undeclared name" (JS: ReferenceError)
// Names only: `W.health` on a welder passes because mobs have a health var. Receivers rooted in a file-level name (rt, Math) are
// JS and skipped. Runs in npm test (tests/name-check.test.mjs).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import ts from "typescript";
import { procFunction, procNameSets, scopeNames, varNameSet, jsMethodNames, JS_VARS, SRC_FIELDS } from "./proc-calls.mjs";
import { readDefines } from "./define-names.mjs";
import { globalKeys } from "./globals-table.mjs";

const web = resolve(import.meta.dirname, ".."), game = resolve(web, "game");
const { procNames, globalProcs } = procNameSets(game), varNames = varNameSet(game);
const members = new Set([...procNames, ...varNames, ...JS_VARS, ...SRC_FIELDS, ...jsMethodNames()]);
const vars = new Set([...varNames, ...JS_VARS, ...SRC_FIELDS]);
const globals = new Set(globalKeys().index.keys()), defines = readDefines(), jsGlobals = new Set(Object.getOwnPropertyNames(globalThis));
const LOWERED = new Set(["GLOB", "new_", "list", "each", "prob", "pick", "parent_proc", "undefined", "arguments"]);
const VAR_CALLS = new Set(["fv", "setFv", "sv", "setSv"]);

/** the root identifier under a chain of property reads, element reads, calls and parentheses (`a.b[c].d()` -> a) */
const rootOf = (x) => { while (ts.isPropertyAccessExpression(x) || ts.isElementAccessExpression(x) || ts.isCallExpression(x) || ts.isParenthesizedExpression(x) || ts.isNonNullExpression(x)) x = x.expression; return x; };
/** whether identifier n is a name being declared, a label, a property key or part of a type: not a use */
const notUse = (n) => {
	const p = n.parent;
	return (ts.isPropertyAccessExpression(p) && p.name === n) || (ts.isPropertyAssignment(p) && p.name === n) || ts.isLabeledStatement(p) || ts.isBreakOrContinueStatement(p)
		|| ((ts.isVariableDeclaration(p) || ts.isParameter(p) || ts.isFunctionLike(p) || ts.isBindingElement(p)) && p.name === n) || ts.isTypeNode(p) || ts.isQualifiedName(p);
};

/** [{ line, name, why }] for one file's text (rel = its path, for scope only) */
export function checkText(rel, text) {
	const sf = ts.createSourceFile(rel, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS), scope = scopeNames(sf), out = [];
	const add = (node, name, why) => out.push({ line: sf.getLineAndCharacterOfPosition(node.getStart()).line + 1, name, why });
	// each proc (procFunction's rt.def/rt.tail at the file's top level) walked with its names looked up once, not per node
	let own, all;
	const visit = (n) => {
		if (ts.isPropertyAccessExpression(n) && ts.isIdentifier(n.name) && !members.has(n.name.text)) {
			const r = rootOf(n.expression); // a chain rooted at a name the proc doesn't bind is JS (jsReceiver)
			if (!(ts.isIdentifier(r) && (r.text === "f" || r.text === "GLOB" || !own.has(r.text)))) add(n.name, n.name.text, "unknown var or proc");
		}
		if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression)) {
			const m = n.expression.name.text, at = VAR_CALLS.has(m) || m === "callSrc" ? 1 : m === "callName" ? 2 : m === "gl" || m === "setGl" ? 0 : -1;
			const s = at >= 0 && n.arguments[at] && ts.isStringLiteral(n.arguments[at]) ? n.arguments[at] : null;
			if (s && !(VAR_CALLS.has(m) ? vars : m === "gl" || m === "setGl" ? globals : procNames).has(s.text)) add(s, s.text, `unknown name in rt.${m}`);
		}
		if (ts.isIdentifier(n) && !notUse(n)) {
			const t = n.text;
			if (!all.has(t) && !globalProcs.has(t) && !defines.has(t) && !jsGlobals.has(t) && !LOWERED.has(t)) add(n, t, "undeclared name");
		}
		ts.forEachChild(n, visit);
	};
	for (const st of sf.statements) {
		const fn = ts.isExpressionStatement(st) && ts.isCallExpression(st.expression) ? st.expression.arguments[1] : null;
		if (!fn || !procFunction(fn)) continue;
		own = scope.own(fn); all = scope.all(fn);
		visit(fn);
	}
	return out;
}

export const gameFiles = () => {
	const out = [];
	const walk = (d) => { for (const e of readdirSync(d)) { const p = resolve(d, e); if (statSync(p).isDirectory()) walk(p); else if (e.endsWith(".ts") && !e.endsWith(".d.ts")) out.push(p); } };
	walk(game);
	return out;
};

/** checks each file, reports each finding with say(text), returns how many */
export function checkFiles(files, say) {
	let n = 0;
	for (const p of files) for (const h of checkText(relative(web, p), readFileSync(p, "utf8"))) { n++; say(`${relative(web, p)}:${h.line}: ${h.why}: ${h.name}`); }
	return n;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
	const files = process.argv.length > 2 ? process.argv.slice(2).map((p) => resolve(p)) : gameFiles();
	const n = checkFiles(files, console.log);
	console.log(n ? `name-check: ${n} FOUND in ${files.length} files` : `name-check: OK (${files.length} files)`);
	process.exit(n ? 1 : 0);
}
