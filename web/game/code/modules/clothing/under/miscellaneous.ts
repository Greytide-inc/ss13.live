// Based on /tg/station's code/modules/clothing/under/miscellaneous.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8354, "/obj/item/clothing/under/acj", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "administrative cybernetic jumpsuit",
	icon_state: "syndicate",
	item_state: "bl_suit",
	item_color: "syndicate",
	desc: "A cybernetically enhanced jumpsuit used for administrative duties.",
	gas_transfer_coefficient: 0.01,
	permeability_coefficient: 0.01,
	body_parts_covered: 2046,
	armor: null,
	cold_protection: 2046,
	min_cold_protection_temperature: 2,
	heat_protection: 2046,
	max_heat_protection_temperature: 1500,
	resistance_flags: 34,
});

// miscellaneous.dm:147
rt.def("/obj/item/clothing/under/acj/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]);
	return f.dot;
});

rt.type(8403, "/obj/item/clothing/under/maid", "/obj/item/clothing/under", {
	fitted: 2,
	can_adjust: 0,
	name: "maid costume",
	desc: "Maid in China.",
	icon_state: "maid",
	item_state: "maid",
	item_color: "maid",
	body_parts_covered: 6,
});

// miscellaneous.dm:507
rt.def("/obj/item/clothing/under/maid/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null;
	f.dot = (yield* parent_proc());
	yield* (A = (yield* new_(T("/obj/item/clothing/accessory/maidapron"), this))).attach(this, null);
	return f.dot;
}, true);

rt.type(8415, "/obj/item/clothing/under/plasmaman", "/obj/item/clothing/under", {
	next_extinguish: 0,
	extinguish_cooldown: 100,
	extinguishes_left: 5,
	can_adjust: 0,
	name: "plasma envirosuit",
	desc: "A special containment suit that allows plasma-based lifeforms to exist safely in an oxygenated environment, and automatically extinguishes them in a crisis. Despite being airtight, it's not spaceworthy.",
	icon_state: "plasmaman",
	item_state: "plasmaman",
	item_color: "plasmaman",
	armor: null,
	body_parts_covered: 2046,
	strip_delay: 80,
});

// miscellaneous.dm:617
rt.def("/obj/item/clothing/under/plasmaman/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 0, "fire", 95, "acid", 95]);
	return f.dot;
});

// miscellaneous.dm:627
rt.def("/obj/item/clothing/under/plasmaman/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>There are ${this.extinguishes_left} extinguisher charges left in this suit.</span>`);
	return f.dot;
}, false);

// miscellaneous.dm:632
rt.def("/obj/item/clothing/under/plasmaman/proc/Extinguish", function* Extinguish(f: Frame, H: Value) {
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (H.on_fire) {
		if (this.extinguishes_left) {
			if (this.next_extinguish > rt.worldTime(f)) {
				return f.dot;
			}
			this.next_extinguish = rt.worldTime(f) + this.extinguish_cooldown;
			this.extinguishes_left--;
			H.visible_message(`<span class='warning'>${H}'s suit automatically extinguishes them!</span>`, "<span class='warning'>Your suit automatically extinguishes you.</span>");
			yield* H.ExtinguishMob();
			yield* new_(T("/obj/effect/particle_effect/water"), rt.getStep(f, H, 0));
		}
	}
	return 0;
}, true);

// miscellaneous.dm:647
rt.def("/obj/item/clothing/under/plasmaman/proc/attackby", function* attackby(f: Frame, E: Value, user: Value, params: Value) {
	if (rt.istype(E, T("/obj/item/device/extinguisher_refill"))) {
		if (this.extinguishes_left == 5) {
			to_chat(user, "<span class='notice'>The inbuilt extinguisher is full.</span>");
			return f.dot;
		} else {
			this.extinguishes_left = 5;
			to_chat(user, "<span class='notice'>You refill the suit's built-in extinguisher, using up the cartridge.</span>");
			yield* qdel(E);
			return f.dot;
		}
	}
	return f.dot;
}, true);
