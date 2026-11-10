#!/usr/bin/env node
// pb-imports - the file tops of web/game/**/*.ts: --paths writes the runtime import as "#runtime" (not ../../../build/dist/src/translate/runtime.js); --names keeps in `const { T, P, ... } = rt;` only the names the file uses (translate-tg writes the full line back into the bundle). Usage: node tools/pb-imports.mjs [--paths] [--names] [--check] [files...]
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const gameDir = path.join(import.meta.dirname, "..", "game");
const args = process.argv.slice(2);
const flag = (n) => args.includes(n), explicit = args.filter((a) => !a.startsWith("--"));
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
	e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".ts") ? [path.join(d, e.name)] : []);
const PATH_RE = /^(import (?:type )?(?:\* as rt|\{ [A-Za-z, ]+ \}) from )"(?:\.\.\/)*(?:\.\/)?(?:build\/)?dist\/src\/translate\/runtime\.js";$/;
const NAMES = /^const \{ ([A-Za-z, ]+) \} = rt;$/;
const st = { paths: 0, names: 0, dropped: 0, empty: 0, skipped: [] };

for (const file of explicit.length ? explicit : walk(gameDir)) {
	let text = fs.readFileSync(file, "utf8"), changed = false;
	const lines = text.split("\n");
	if (flag("--paths")) for (let i = 0; i < Math.min(lines.length, 12); i++) {
		const m = PATH_RE.exec(lines[i]);
		if (m) { lines[i] = `${m[1]}"#runtime";`; st.paths++; changed = true; }
	}
	if (flag("--names")) {
		const at = lines.findIndex((l, i) => i < 12 && NAMES.test(l));
		if (at >= 0) {
			const have = NAMES.exec(lines[at])[1].split(", ");
			if (have.join() !== "T,P,g,truthy,isEqual,add,subtract,multiply,divide,fmt") st.skipped.push(path.relative(gameDir, file));
			else {
				const rest = lines.filter((_, i) => i !== at).join("\n");
				const sf = ts.createSourceFile(file, rest, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
				const used = new Set();
				const visit = (n) => {
					if (ts.isIdentifier(n)) {
						const p = n.parent;
						const prop = (ts.isPropertyAccessExpression(p) && p.name === n) || (ts.isPropertyAssignment(p) && p.name === n)
							|| ((ts.isMethodDeclaration(p) || ts.isPropertyDeclaration(p) || ts.isPropertySignature(p)) && p.name === n);
						if (!prop) used.add(n.text);
					}
					ts.forEachChild(n, visit);
				};
				visit(sf);
				const keep = have.filter((x) => used.has(x));
				st.dropped += have.length - keep.length; st.names++;
				if (!keep.length) st.empty++;
				lines[at] = keep.length ? `const { ${keep.join(", ")} } = rt;` : "";
				changed = true;
			}
		}
	}
	if (changed && !flag("--check")) fs.writeFileSync(file, lines.join("\n"));
}
console.log(`paths: ${st.paths} lines; names: ${st.names} files (${st.dropped} names dropped, ${st.empty} files use none); left alone: ${st.skipped.join(", ") || "none"}`);
