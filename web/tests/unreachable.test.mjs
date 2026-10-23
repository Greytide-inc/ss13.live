// unreachable.test.mjs - no statement in web/game sits right after a return or throw in the same block (dead code:
// Firefox warns "unreachable code after return statement" for each, and a few were tg bugs, e.g. cryo never ejecting
// a dead patient). Usage (from web/): node tests/unreachable.test.mjs
import ts from "typescript";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../game");
const files = readdirSync(root, { recursive: true }).filter((p) => p.endsWith(".ts")).map((p) => join(root, p));
const bad = [];
for (const file of files) {
	const src = readFileSync(file, "utf8");
	if (!src.includes("return") && !src.includes("throw")) continue;
	const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
	const visit = (node) => {
		const stmts = ts.isBlock(node) || ts.isSourceFile(node) || ts.isCaseClause(node) || ts.isDefaultClause(node) ? node.statements : null;
		if (stmts) for (let i = 0; i < stmts.length - 1; i++) {
			if (!ts.isReturnStatement(stmts[i]) && !ts.isThrowStatement(stmts[i])) continue;
			const next = stmts[i + 1];
			if (ts.isFunctionDeclaration(next)) continue;
			bad.push(`${relative(root, file)}:${sf.getLineAndCharacterOfPosition(next.getStart()).line + 1}: ${next.getText().split("\n")[0].slice(0, 80)}`);
			break;
		}
		ts.forEachChild(node, visit);
	};
	visit(sf);
}
for (const b of bad) console.log("FAIL unreachable: game/" + b);
console.log(bad.length ? `unreachable: ${bad.length} FAILED` : `unreachable: OK (${files.length} files)`);
process.exit(bad.length ? 1 : 0);
