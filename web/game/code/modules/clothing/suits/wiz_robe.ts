// From code/modules/clothing/suits/wiz_robe.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8189, "/obj/item/clothing/head/wizard", "/obj/item/clothing/head", {
	name: "wizard hat",
	desc: "Strange-looking hat-wear that most certainly belongs to a real magic user.",
	icon_state: "wizard",
	gas_transfer_coefficient: 0.01,
	permeability_coefficient: 0.01,
	armor: null,
	strip_delay: 50,
	equip_delay_other: 50,
	resistance_flags: 34,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/blue_wizard"),
});

// /obj/item/clothing/head/wizard/proc/<init>  (code/modules/clothing/suits/wiz_robe.dm:7)
rt.def("/obj/item/clothing/head/wizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 20, "laser", 20, "energy", 20, "bomb", 20, "bio", 20, "rad", 20, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(8193, "/obj/item/clothing/head/wizard/fake", "/obj/item/clothing/head/wizard", {
	name: "wizard hat",
	desc: "It has WIZZARD written across it in sequins. Comes with a cool beard.",
	icon_state: "wizard-fake",
	gas_transfer_coefficient: 1,
	permeability_coefficient: 1,
	armor: null,
	resistance_flags: 4,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/blue_wizard"),
});

// /obj/item/clothing/head/wizard/fake/proc/<init>  (code/modules/clothing/suits/wiz_robe.dm:37)
rt.def("/obj/item/clothing/head/wizard/fake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(7917, "/obj/item/clothing/suit/wizrobe", "/obj/item/clothing/suit", {
	name: "wizard robe",
	desc: "A magnificent, gem-lined robe that seems to radiate power.",
	icon_state: "wizard",
	item_state: "wizrobe",
	gas_transfer_coefficient: 0.01,
	permeability_coefficient: 0.01,
	body_parts_covered: 414,
	armor: null,
	allowed: null,
	flags_inv: 4,
	strip_delay: 50,
	equip_delay_other: 50,
	resistance_flags: 34,
});

// /obj/item/clothing/suit/wizrobe/proc/<init>  (code/modules/clothing/suits/wiz_robe.dm:69)
rt.def("/obj/item/clothing/suit/wizrobe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 20, "laser", 20, "energy", 20, "bomb", 20, "bio", 20, "rad", 20, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/teleportation_scroll")));
	return f.dot;
});

rt.type(7926, "/obj/item/clothing/suit/wizrobe/fake", "/obj/item/clothing/suit/wizrobe", {
	name: "wizard robe",
	desc: "A rather dull blue robe meant to mimick real wizard robes.",
	icon_state: "wizard-fake",
	item_state: "wizrobe",
	gas_transfer_coefficient: 1,
	permeability_coefficient: 1,
	armor: null,
	resistance_flags: 4,
});

// /obj/item/clothing/suit/wizrobe/fake/proc/<init>  (code/modules/clothing/suits/wiz_robe.dm:126)
rt.def("/obj/item/clothing/suit/wizrobe/fake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(8195, "/obj/item/clothing/head/wizard/marisa/fake", "/obj/item/clothing/head/wizard/marisa", {
	name: "witch hat",
	desc: "Strange-looking hat-wear, makes you want to cast fireballs.",
	icon_state: "marisa",
	gas_transfer_coefficient: 1,
	permeability_coefficient: 1,
	armor: null,
	resistance_flags: 4,
});

// /obj/item/clothing/head/wizard/marisa/fake/proc/<init>  (code/modules/clothing/suits/wiz_robe.dm:135)
rt.def("/obj/item/clothing/head/wizard/marisa/fake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(7922, "/obj/item/clothing/suit/wizrobe/marisa/fake", "/obj/item/clothing/suit/wizrobe/marisa", {
	name: "witch robe",
	desc: "Magic is all about the spell power, ZE!",
	icon_state: "marisa",
	item_state: "marisarobe",
	gas_transfer_coefficient: 1,
	permeability_coefficient: 1,
	armor: null,
	resistance_flags: 4,
});

// /obj/item/clothing/suit/wizrobe/marisa/fake/proc/<init>  (code/modules/clothing/suits/wiz_robe.dm:145)
rt.def("/obj/item/clothing/suit/wizrobe/marisa/fake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(7927, "/obj/item/clothing/suit/wizrobe/paper", "/obj/item/clothing/suit/wizrobe", {
	robe_charge: 1,
	name: "papier-mache robe",
	desc: "A robe held together by various bits of clear-tape and paste.",
	icon_state: "wizard-paper",
	item_state: "wizrobe",
	actions_types: null,
});

// /obj/item/clothing/suit/wizrobe/paper/proc/<init>  (code/modules/clothing/suits/wiz_robe.dm:154)
rt.def("/obj/item/clothing/suit/wizrobe/paper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/stickmen")));
	return f.dot;
});

// /obj/item/clothing/suit/wizrobe/paper/proc/ui_action_click  (code/modules/clothing/suits/wiz_robe.dm:158)  may sleep
rt.def("/obj/item/clothing/suit/wizrobe/paper/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	f.vars = () => [user, action];
	yield* g.srcCall(f, "stickmen");
	return f.dot;
}, true);

// /obj/item/clothing/suit/wizrobe/paper/verb/stickmen  (code/modules/clothing/suits/wiz_robe.dm:165)  may sleep
rt.def("/obj/item/clothing/suit/wizrobe/paper/verb/stickmen", function* stickmen(f: Frame) {
	let M: Value = null, factions: Value = null;
	f.vars = () => [M, factions];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "robe_charge"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>＄robe's internal magic supply is still recharging!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "say", ["Rise, my creation! Off your page into this realm!"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/magic/summon_magic.ogg"), 50, 1, 1]);
	M = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/stickman"), [rt.getStep(f, live(f.usr), 0)]));
	factions = rt.fv(f, "faction", live(f.usr));
	rt.setFv(f, "faction", live(M), live(factions));
	rt.setFv(f, "robe_charge", live(f.src), 0);
	yield* g.call(f, P("/proc/sleep"), null, [30]);
	rt.setFv(f, "robe_charge", live(f.src), 1);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>＄robe hums, its internal magic supply restored.</span>"]);
	return f.dot;
}, true, { verb: { name: "Summon Stick Minions", category: "Object", src: 11 } });

rt.type(7727, "/obj/item/clothing/suit/space/hardsuit/shielded/wizard", "/obj/item/clothing/suit/space/hardsuit/shielded", {
	recharge_rate: 0,
	current_charges: 15,
	recharge_cooldown: 1e+31,
	shield_state: "shield-red",
	shield_on: "shield-red",
	name: "battlemage armour",
	desc: "Not all wizards are afraid of getting up close and personal.",
	icon_state: "battlemage",
	item_state: "battlemage",
	min_cold_protection_temperature: 160,
	max_heat_protection_temperature: 600,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/shielded/wizard"),
	armor: null,
	slowdown: 0,
	resistance_flags: 34,
});

// /obj/item/clothing/suit/space/hardsuit/shielded/wizard/proc/<init>  (code/modules/clothing/suits/wiz_robe.dm:197)
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/wizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 20, "laser", 20, "energy", 20, "bomb", 20, "bio", 20, "rad", 20, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(7959, "/obj/item/clothing/head/helmet/space/hardsuit/shielded/wizard", "/obj/item/clothing/head/helmet/space/hardsuit/shielded", {
	name: "battlemage helmet",
	desc: "A suitably impressive helmet..",
	icon_state: "battlemage",
	item_state: "battlemage",
	min_cold_protection_temperature: 160,
	max_heat_protection_temperature: 600,
	armor: null,
	actions_types: null,
	resistance_flags: 34,
});

// /obj/item/clothing/head/helmet/space/hardsuit/shielded/wizard/proc/<init>  (code/modules/clothing/suits/wiz_robe.dm:208)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/shielded/wizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 20, "laser", 20, "energy", 20, "bomb", 20, "bio", 20, "rad", 20, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "actions_types", null);
	return f.dot;
});

rt.type(9972, "/obj/item/wizard_armour_charge", "/obj/item", {
	name: "battlemage shield charges",
	desc: "A powerful rune that will increase the number of hits a suit of battlemage armour can take before failing..",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "electricity2",
});

// /obj/item/wizard_armour_charge/proc/afterattack  (code/modules/clothing/suits/wiz_robe.dm:222)  may sleep
rt.def("/obj/item/wizard_armour_charge/proc/afterattack", function* afterattack(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/suit/space/hardsuit/shielded/wizard")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The rune can only be used on battlemage armour!</span>"]);
		return live(f.dot);
	}
	rt.modField(f, live(f.args[0]), "current_charges", 8, add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You charge ％！. It can now absorb ＀ hits.</span>", [live(f.args[0]), rt.fv(f, "current_charges", live(f.args[0]))])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["W", "user"] });
