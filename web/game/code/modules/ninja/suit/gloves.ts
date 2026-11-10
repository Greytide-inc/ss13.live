// Based on /tg/station's code/modules/ninja/suit/gloves.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7697, "/obj/item/clothing/gloves/space_ninja", "/obj/item/clothing/gloves", {
	draining: 0,
	candrain: 0,
	mindrain: 200,
	maxdrain: 400,
	desc: "These nano-enhanced gloves insulate from electricity and provide fire resistance.",
	name: "ninja gloves",
	icon_state: "s-ninja",
	item_state: "s-ninja",
	siemens_coefficient: 0,
	cold_protection: 1536,
	min_cold_protection_temperature: 2,
	heat_protection: 1536,
	max_heat_protection_temperature: 1500,
	strip_delay: 120,
	resistance_flags: 35,
});

// gloves.dm:42
rt.def("/obj/item/clothing/gloves/space_ninja/proc/Touch", function* Touch(f: Frame, A: Value, proximity: Value) {
	let suit: Value = null;
	if (!this.candrain || this.draining) {
		return 0;
	}
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) {
		return 0;
	}
	let H: Value = this.loc;
	if (!rt.istype((suit = H.wear_suit), T("/obj/item/clothing/suit/space/space_ninja"))) {
		return 0;
	}
	if (isturf(A)) {
		return 0;
	}
	if (!proximity) {
		return 0;
	}
	yield* A.add_fingerprint(H);
	this.draining = 1;
	f.dot = (yield* A.ninjadrain_act(suit, H, this));
	this.draining = 0;
	if (isnum(f.dot)) {
		if (f.dot) {
			to_chat(H, fmt("<span class='notice'>Gained <B>＀</B> energy from ％！.</span>", [f.dot, A]));
		} else {
			to_chat(H, fmt("<span class='danger'>＄！ has run dry of power, you must find another source!</span>", [A]));
		}
	} else {
		f.dot = 0;
	}
	return f.dot;
}, true);

// gloves.dm:74
rt.def("/obj/item/clothing/gloves/space_ninja/proc/toggledrain", function toggledrain(f: Frame) {
	let U: Value = null;
	let $1: any;
	let $0: any = (U = this.loc);
	if (this.candrain) {

		$1 = "disable";
	} else {
		$1 = "enable";
	}
	to_chat($0, `You <b>${$1}</b> special interaction.`);
	this.candrain = (!this.candrain ? 1 : 0);
	return f.dot;
});

// gloves.dm:79
rt.def("/obj/item/clothing/gloves/space_ninja/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!rt.bitAnd(this.flags, NODROP)) return f.dot;
	let $0: any = user;
	to_chat($0, `The energy drain mechanism is: <B>${this.candrain ? "active" : "inactive"}</B>.`);
	return f.dot;
}, false);
