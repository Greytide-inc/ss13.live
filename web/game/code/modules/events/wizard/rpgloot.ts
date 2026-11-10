// Based on /tg/station's code/modules/events/wizard/rpgloot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


rt.type(349, "/datum/round_event/wizard/rpgloot", "/datum/round_event/wizard", {});

// rpgloot.dm:10
rt.def("/datum/round_event/wizard/rpgloot/proc/start", function* start(f: Frame) {
	let I: Value = null, S: Value = null, scroll: Value = null;
	let upgrade_scroll_chance: Value = 0;
	for (I of each(rt.world(), T("/obj/item"))) {
		if (!rt.istype(I.rpg_loot, T("/datum/rpg_loot"))) {
			I.rpg_loot = (yield* new_(T("/datum/rpg_loot"), I));
		}
		if (rt.istype(I, T("/obj/item/weapon/storage"))) {
			S = I;
			if (prob(upgrade_scroll_chance) && rt.len(f, S.contents) < S.storage_slots && !S.invisibility) {
				scroll = (yield* new_(T("/obj/item/upgradescroll")));
				yield* S.handle_item_insertion(scroll, 1);
				upgrade_scroll_chance = max(0, upgrade_scroll_chance - 100);
			}
			upgrade_scroll_chance += 25;
		}
	}
	GLOB.rpg_loot_items = 1;
	return f.dot;
}, true);

rt.type(9976, "/obj/item/upgradescroll", "/obj/item", {
	upgrade_amount: 1,
	can_backfire: 1,
	one_use: 1,
	w_class: 1,
	name: "item fortification scroll",
	desc: "Somehow, this piece of paper can be applied to items to make them \"better\". Apparently there's a risk of losing the item if it's already \"too good\". <i>This all feels so arbitrary...</i>",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll",
});

// rpgloot.dm:36
rt.def("/obj/item/upgradescroll/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let rpg_loot_datum: Value = null;
	if (!proximity || !rt.istype(target, T("/obj/item"))) {
		return f.dot;
	}
	if (!rt.istype((rpg_loot_datum = target.rpg_loot), T("/datum/rpg_loot"))) {
		rpg_loot_datum = (yield* new_(T("/datum/rpg_loot"), target));
	}
	let quality: Value = rpg_loot_datum.quality;
	if (this.can_backfire && quality > 9 && prob((quality - 9) * 10)) {
		to_chat(user, `<span class='danger'>${target} violently glows blue for a while, then evaporates.</span>`);
		yield* target.burn();
	} else {
		to_chat(user, `<span class='notice'>${target} glows blue and seems vaguely "better"!</span>`);
		rpg_loot_datum.modify(this.upgrade_amount);
	}
	if (!this.one_use) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(2315, "/datum/rpg_loot", "/datum", {
	positive_prefix: "okay",
	negative_prefix: "weak",
	suffix: "something profound",
	quality: 0,
	attached: null,
	original_name: null,
});

// rpgloot.dm:71
rt.def("/datum/rpg_loot/proc/New", function New(f: Frame, attached_item: Value) {
	this.attached = attached_item;
	this.randomise();
	return f.dot;
});

// rpgloot.dm:76
rt.def("/datum/rpg_loot/proc/Destroy", function Destroy(f: Frame) {
	this.attached = null;
	return f.dot;
});

// rpgloot.dm:83
rt.def("/datum/rpg_loot/proc/randomise", function randomise(f: Frame) {
	let new_quality: Value = rt.op(f, "PickWeighted", [16], [1, 15, 2, 14, 2, 13, 2, 12, 3, 11, 3, 10, 3, 9, 4, 8, 4, 7, 4, 6, 5, 5, 5, 4, 5, 3, 6, 2, 6, 1, 6, 0]);
	this.suffix = pick(GLOB.suffixes);
	this.positive_prefix = pick(GLOB.prefixespositive);
	this.negative_prefix = pick(GLOB.prefixesnegative);
	if (prob(50)) {
		new_quality = -new_quality;
	}
	this.modify(new_quality);
	return f.dot;
});

// rpgloot.dm:95
rt.def("/datum/rpg_loot/proc/rename", function rename(f: Frame) {
	let I: Value = this.attached;
	if (!this.original_name) {
		this.original_name = I.name;
	}
	if (this.quality < 0) {
		I.name = `${this.negative_prefix} ${this.original_name} of ${this.suffix} ${this.quality}`;
	} else if (this.quality == 0) {
		I.name = `${this.original_name} of ${this.suffix}`;
	} else {
		if (!(this.quality > 0)) return f.dot;
		I.name = `${this.positive_prefix} ${this.original_name} of ${this.suffix} +${this.quality}`;
	}
	return f.dot;
});

// rpgloot.dm:106
rt.def("/datum/rpg_loot/proc/modify", function modify(f: Frame, quality_mod: Value) {
	let value: Value = null;
	let I: Value = this.attached;
	this.quality += quality_mod;
	I.force = max(0, I.force + quality_mod);
	I.throwforce = max(0, I.throwforce + quality_mod);
	for (value of each(I.armor)) {
		rt.modAt(I.armor, value, this.quality, add);
	}
	this.rename();
	return f.dot;
});
