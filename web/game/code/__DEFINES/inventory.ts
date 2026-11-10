// Based on /tg/station's code/__DEFINES/inventory.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// inventory.dm:60
rt.def("/proc/slotdefine2slotbit", function slotdefine2slotbit(f: Frame, slotdefine: Value) {
	f.dot = 0;
	if (slotdefine === slot_back) {
		f.dot = SLOT_BACK;
	} else if (slotdefine === slot_wear_mask) {
		f.dot = SLOT_MASK;
	} else if (slotdefine === slot_neck) {
		f.dot = SLOT_NECK;
	} else if (slotdefine === slot_belt) {
		f.dot = SLOT_BELT;
	} else if (slotdefine === slot_wear_id) {
		f.dot = SLOT_ID;
	} else if (slotdefine === slot_ears) {
		f.dot = SLOT_EARS;
	} else if (slotdefine === slot_glasses) {
		f.dot = SLOT_EYES;
	} else if (slotdefine === slot_gloves) {
		f.dot = SLOT_GLOVES;
	} else if (slotdefine === slot_head) {
		f.dot = SLOT_HEAD;
	} else if (slotdefine === slot_shoes) {
		f.dot = SLOT_FEET;
	} else if (slotdefine === slot_wear_suit) {
		f.dot = SLOT_OCLOTHING;
	} else if (slotdefine === slot_w_uniform) {
		f.dot = SLOT_ICLOTHING;
	} else if (slotdefine === slot_l_store || slotdefine === 16) {
		f.dot = 2048;
	}
	return f.dot;
});
