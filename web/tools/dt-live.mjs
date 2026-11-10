#!/usr/bin/env node
// dt-live.mjs - Detranslate robot (plans/archive/detranslate.md step 6b): drops live() from game code.
// Usage (from web/): node tools/dt-live.mjs [--check] [FILE...]   (no FILE: every .ts under game/)
//   --check changes nothing, prints what it would do. Afterwards: node tools/remap-dm-cols.mjs HEAD.
// Every game-code live() wraps a proc's own local, arg, `.`, usr or src, and step 6 counted it nulling a deleted object
// 0 times in ~960M calls. Since 6b those keep a deleted object as is (vars, globals and list items still read null; using
// its vars is the runtime error null gives, counted in boot logs: VM.deletedUses). So live(x) -> x, in parentheses unless x
// binds as tightly as a call; `live` leaves the file's `const { ... } = rt;` once no call is left.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import ts from "typescript";

const web = resolve(import.meta.dirname, "..");
const check = process.argv.includes("--check");
const targets = process.argv.slice(2).filter((a) => a !== "--check");
const files = [];
if (targets.length) files.push(...targets.map((t) => resolve(t)));
else {
	const walk = (d) => { for (const e of readdirSync(d)) { const p = resolve(d, e); if (statSync(p).isDirectory()) walk(p); else if (e.endsWith(".ts")) files.push(p); } };
	walk(resolve(web, "game"));
}

const K = ts.SyntaxKind;
const TIGHT = new Set([K.ParenthesizedExpression, K.Identifier, K.ThisKeyword, K.NumericLiteral, K.StringLiteral, K.NullKeyword,
	K.PropertyAccessExpression, K.ElementAccessExpression, K.CallExpression, K.ArrayLiteralExpression]);
const isLive = (n) => ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "live" && !n.questionDotToken
	&& n.arguments.length === 1 && !ts.isSpreadElement(n.arguments[0]);

let total = { calls: 0, files: 0 }, left = 0;
for (const file of files) {
	const rel = relative(web, file);
	const text = readFileSync(file, "utf8");
	if (!text.includes("live")) continue;
	const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
	let calls = 0;
	const slice = (n) => text.slice(n.getStart(sf), n.end);
	const splice = (s, base, edits) => { for (const [a, b, r] of edits.sort((x, y) => y[0] - x[0])) s = s.slice(0, a - base) + r + s.slice(b - base); return s; };
	// n's text with the rewrites inside it
	const render = (n) => {
		if (isLive(n)) {
			calls++;
			const a = n.arguments[0], t = render(a);
			return TIGHT.has(a.kind) ? t : `(${t})`;
		}
		const edits = [];
		ts.forEachChild(n, (k) => { const r = render(k); if (r !== slice(k)) edits.push([k.getStart(sf), k.end, r]); });
		return edits.length ? splice(slice(n), n.getStart(sf), edits) : slice(n);
	};
	const edits = [];
	ts.forEachChild(sf, (k) => { const r = render(k); if (r !== slice(k)) edits.push([k.getStart(sf), k.end, r]); });
	let out = splice(text, 0, edits);
	// `live` used no more (not even as a value): out of the destructuring of rt
	if (!/\blive\b(?!:)/.test(out.replace(/^const \{[^}\n]*\} = rt;$/gm, "").replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`|\/\/.*$/gm, "")))
		out = out.replace(/^(const \{[^}\n]*)\blive, ([^}\n]*\} = rt;)$/m, "$1$2");
	else left++;
	if (out === text) continue;
	total.calls += calls; total.files++;
	if (targets.length) console.log(`${rel}: live(x) -> x ${calls}`);
	if (check) continue;
	writeFileSync(file, out);
}
console.log(`${total.files} files: live(x) -> x ${total.calls}${left ? `; ${left} files still use live` : ""}${check ? " (--check: nothing written)" : ""}`);
