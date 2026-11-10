// define-names - tg's #define names in web/game procs (phrasebook step 4). game/_defines.d.ts declares them (`declare const DEAD: 2;`);
// translate-tg writes the number back where a proc names one, so the bundle is what it was before the names. Shared by translate-tg and pb-defines.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { procFunction } from "./proc-calls.mjs";

export const DEFINES_FILE = path.join(import.meta.dirname, "..", "game", "_defines.d.ts");

/** name -> the number's text, read from `declare const NAME: 123;` lines (empty map when the file isn't there) */
export function readDefines(file = DEFINES_FILE) {
	const m = new Map();
	if (!fs.existsSync(file)) return m;
	for (const l of fs.readFileSync(file, "utf8").split("\n")) {
		const x = /^declare const (\w+): (-?[\d.e+]+);/.exec(l);
		if (x) m.set(x[1], x[2]);
	}
	return m;
}

/** Is identifier n a use of define `table.get(n.text)` in a proc: not a property or declaration name, not a callee, not a name the proc or file binds. */
export function isDefineUse(n, table, scope) {
	if (!ts.isIdentifier(n) || !table.has(n.text) || !procFunction(n)) return false;
	const p = n.parent;
	if ((ts.isPropertyAccessExpression(p) && p.name === n) || (ts.isPropertyAssignment(p) && p.name === n) || ts.isShorthandPropertyAssignment(p)
		|| ((ts.isVariableDeclaration(p) || ts.isParameter(p) || ts.isFunctionLike(p) || ts.isBindingElement(p) || ts.isPropertyDeclaration(p) || ts.isMethodDeclaration(p)) && p.name === n)
		|| (ts.isCallExpression(p) && p.expression === n) || ts.isLabeledStatement(p) || ts.isBreakOrContinueStatement(p)) return false;
	return !scope.all(n).has(n.text);
}
