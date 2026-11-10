// Based on /tg/station's code/modules/tgui/external.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// external.dm:34
rt.def("/datum/proc/ui_data", function ui_data(f: Frame, user: Value) {
	return list();
});

// external.dm:49
rt.def("/datum/proc/ui_act", function ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	if (!(!ui || ui.status != UI_INTERACTIVE)) return f.dot;
	return 1;
});

// external.dm:91
rt.def("/client/verb/uiclose", function* uiclose(f: Frame, ref: Value) {
	let ui: Value = null;
	if (!rt.istype((ui = rt.locateIn(f, ref, rt.world())), T("/datum/tgui"))) return f.dot;
	if (ui.user != this.mob) return f.dot; // tg_js: only your own window (refs count up, so any player could close anyone's)
	yield* ui.close();
	if (!(this && this.mob)) return f.dot;
	yield* this.mob.unset_machine();
	return f.dot;
}, true, { hidden: true, verb: { name: "uiclose" }, argTypes: [{ type: 2 }] });
