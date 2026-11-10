// name-check.test.mjs - tools/name-check.mjs finds typos planted in a proc (an unknown var, proc, quoted name, undeclared name),
// passes the correct spellings, and finds nothing in web/game. Usage (from web/): node tests/name-check.test.mjs
import { checkFiles, checkText, gameFiles } from "../tools/name-check.mjs";

const planted = `import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
rt.def("/obj/machinery/door/firedoor/proc/test_weld", function* test_weld(f: Frame, W: Value, user: Value) {
	if (!(yield* W.remove_fuel(0, user))) return f.dot;
	if (!(yield* W.remove_feul(0, user))) return f.dot;
	const s = W.usesonud, ok = W.usesound, n = Math.max(1, 2), L = [ok];
	L.push(s);
	rt.fv(f, "toolspeeed", W);
	rt.callName(f, user, "visible_mesage", []);
	weld_it(this);
	this.welded = !this.welded ? 1 : 0;
	return n;
}, true);
`;
const want = ["5 remove_feul", "6 usesonud", "8 toolspeeed", "9 visible_mesage", "10 weld_it"];
const got = checkText("game/test.ts", planted).map((h) => `${h.line} ${h.name}`);
let bad = 0;
if (got.join() !== want.join()) { bad++; console.log(`FAIL name-check planted: got [${got.join(", ")}], want [${want.join(", ")}]`); }
if (checkFiles(gameFiles(), (t) => console.log(`FAIL name-check game/: ${t}`))) bad++;
console.log(bad ? `name-check: ${bad} FAILED` : "name-check: OK");
process.exit(bad ? 1 : 0);
