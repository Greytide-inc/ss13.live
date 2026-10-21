// From code/modules/surgery/organs/helpers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/getorgan  (code/modules/surgery/organs/helpers.dm:11)
rt.def("/mob/living/carbon/proc/getorgan", function getorgan(f: Frame, typepath: Value) {
	return rt.locateIn(f, live(typepath), rt.sv(f, "internal_organs"));
});

// /mob/living/carbon/proc/getorganszone  (code/modules/surgery/organs/helpers.dm:14)
rt.def("/mob/living/carbon/proc/getorganszone", function getorganszone(f: Frame, zone: Value, subzones: Value) {
	let returnorg: Value = null, X: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [subzones, returnorg, X, O, $e];
	if (live(subzones) === null) {
		subzones = 0;
	}
	returnorg = rt.list();
	if (truthy(live(subzones))) {
		if (isEqual(live(zone), "head")) {
			returnorg = add(rt.callSrc(f, "getorganszone", ["eyes"]), rt.callSrc(f, "getorganszone", ["mouth"]));
		}
		if (isEqual(live(zone), "chest")) {
			returnorg = rt.callSrc(f, "getorganszone", ["groin"]);
		}
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "internal_organs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		O = live(X);
		if (isEqual(live(zone), rt.fv(f, "zone", live(O)))) {
			returnorg = rt.modify(live(returnorg), live(O), add);
		}
	}
	rt.endFor(f, 0);
	return live(returnorg);
});

// /mob/living/carbon/proc/getorganslot  (code/modules/surgery/organs/helpers.dm:29)
rt.def("/mob/living/carbon/proc/getorganslot", function getorganslot(f: Frame, slot: Value) {
	return rt.index(rt.sv(f, "internal_organs_slot"), live(slot));
});
