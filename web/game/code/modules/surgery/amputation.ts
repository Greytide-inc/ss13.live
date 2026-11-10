// Based on /tg/station's code/modules/surgery/amputation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1310, "/datum/surgery/amputation", "/datum/surgery", {
	name: "amputation",
	steps: null,
	possible_locs: null,
	requires_organic_bodypart: 0,
	species: null,
});

// amputation.dm:4
rt.def("/datum/surgery/amputation/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/saw"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/sever_limb"));
	this.possible_locs = list("r_arm", "l_arm", "l_leg", "r_leg", "head");

	this.species = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"));
	return f.dot;
});

rt.type(1329, "/datum/surgery_step/sever_limb", "/datum/surgery_step", {
	name: "sever limb",
	implements: null,
	time: 64,
});

// amputation.dm:12
rt.def("/datum/surgery_step/sever_limb/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/scalpel"), 100, T("/obj/item/weapon/circular_saw"), 100, T("/obj/item/weapon/melee/energy/sword/cyborg/saw"), 100, T("/obj/item/weapon/melee/arm_blade"), 80, T("/obj/item/weapon/twohanded/required/chainsaw"), 80, T("/obj/item/weapon/mounted_chainsaw"), 80, T("/obj/item/weapon/twohanded/fireaxe"), 50, T("/obj/item/weapon/hatchet"), 40, T("/obj/item/weapon/kitchen/knife/butcher"), 25]);
	return f.dot;
});

// amputation.dm:16
rt.def("/datum/surgery_step/sever_limb/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to sever ${target}'s ${parse_zone(target_zone)}!`, `<span class='notice'>You begin to sever ${target}'s ${parse_zone(target_zone)}...</span>`);
	return f.dot;
});

// amputation.dm:19
rt.def("/datum/surgery_step/sever_limb/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let target_limb: Value = null;
	let L: Value = target;
	user.visible_message(`${user} severs ${L}'s ${parse_zone(target_zone)}!`, `<span class='notice'>You sever ${L}'s ${parse_zone(target_zone)}.</span>`);
	if (surgery.operated_bodypart) {
		yield* (target_limb = surgery.operated_bodypart).drop_limb();
	}
	return 1;
}, true);
