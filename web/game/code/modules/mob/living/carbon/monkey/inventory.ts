// Based on /tg/station's code/modules/mob/living/carbon/monkey/inventory.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// inventory.dm:2
rt.def("/mob/living/carbon/monkey/proc/can_equip", function can_equip(f: Frame, I: Value, slot: Value, disable_warning: Value) {
	disable_warning ??= 0;
	if (slot === slot_hands) {
		if (this.get_empty_held_indexes()) {
			return 1;
		}
		return 0;
	} else if (slot === slot_wear_mask) {
		if (this.wear_mask) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_MASK)) {
			return 0;
		}
		return 1;
	} else if (slot === slot_neck) {
		if (this.wear_neck) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_NECK)) {
			return 0;
		}
		return 1;
	} else if (slot === slot_head) {
		if (this.head) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_HEAD)) {
			return 0;
		}
		return 1;
	} else if (slot === 1) {
		if (this.back) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_BACK)) {
			return 0;
		}
		return 1;
	}
	return 0;
});
