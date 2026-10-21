// From code/modules/tgui/external.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/proc/ui_data  (code/modules/tgui/external.dm:34)
rt.def("/datum/proc/ui_data", function ui_data(f: Frame, user: Value) {
	return rt.list();
});

// /datum/proc/ui_act  (code/modules/tgui/external.dm:49)
rt.def("/datum/proc/ui_act", function ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	if (!(!truthy(live(ui)) || !isEqual(rt.fv(f, "status", live(ui)), 2))) return f.dot;
	return 1;
});

// /client/verb/uiclose  (code/modules/tgui/external.dm:91)  may sleep
rt.def("/client/verb/uiclose", function* uiclose(f: Frame, ref: Value) {
	let ui: Value = null;
	f.vars = () => [ref, ui];
	if (!truthy((rt.istype((ui = rt.locateIn(f, live(ref), rt.world())), T("/datum/tgui")) ? 1 : 0))) return f.dot;
	if (!isEqual(rt.fv(f, "user", live(ui)), rt.sv(f, "mob"))) return f.dot; // tg_js: only your own window (refs count up, so any player could close anyone's)
	yield* g.callName(f, live(ui), "close", []);
	if (!(truthy(live(f.src)) && truthy(rt.fv(f, "mob", live(f.src))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "mob", live(f.src)), "unset_machine", []);
	return f.dot;
}, true, { hidden: true, verb: { name: "uiclose" }, argTypes: [{ type: 2 }] });
