// Based on /tg/station's code/modules/surgery/organs/helpers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// helpers.dm:11
rt.def("/mob/living/carbon/proc/getorgan", function getorgan(f: Frame, typepath: Value) {
	return rt.locateIn(f, typepath, this.internal_organs);
});

// helpers.dm:14
rt.def("/mob/living/carbon/proc/getorganszone", function getorganszone(f: Frame, zone: Value, subzones: Value) {
	let X: Value = null, O: Value = null;
	subzones ??= 0;
	let returnorg: Value = list();
	if (subzones) {
		if (zone == "head") {
			returnorg = this.getorganszone("eyes") + this.getorganszone("mouth");
		}
		if (zone == "chest") {
			returnorg = this.getorganszone("groin");
		}
	}
	for (X of each(this.internal_organs)) {
		O = X;
		if (zone == O.zone) {
			returnorg += O;
		}
	}
	return returnorg;
});

// helpers.dm:29
rt.def("/mob/living/carbon/proc/getorganslot", function getorganslot(f: Frame, slot: Value) {
	return rt.index(this.internal_organs_slot, slot);
});
