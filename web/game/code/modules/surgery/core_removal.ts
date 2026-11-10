// Based on /tg/station's code/modules/surgery/core_removal.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(1312, "/datum/surgery/core_removal", "/datum/surgery", {
	name: "core removal",
	steps: null,
	possible_locs: null,
	species: null,
});

// core_removal.dm:3
rt.def("/datum/surgery/core_removal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/extract_core"));
	this.possible_locs = list("r_arm", "l_arm", "r_leg", "l_leg", "chest", "head");

	this.species = list(T("/mob/living/simple_animal/slime"));
	return f.dot;
});

// core_removal.dm:8
rt.def("/datum/surgery/core_removal/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	if (target.stat == 2) {
		return 1;
	}
	return 0;
});

rt.type(1331, "/datum/surgery_step/extract_core", "/datum/surgery_step", {
	name: "extract core",
	implements: null,
	time: 16,
});

// core_removal.dm:15
rt.def("/datum/surgery_step/extract_core/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/hemostat"), 100, T("/obj/item/weapon/crowbar"), 100]);
	return f.dot;
});

// core_removal.dm:19
rt.def("/datum/surgery_step/extract_core/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to extract a core from ${target}.`, `<span class='notice'>You begin to extract a core from ${target}...</span>`);
	return f.dot;
});

// core_removal.dm:22
rt.def("/datum/surgery_step/extract_core/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let slime: Value = null;
	if ((slime = target).cores > 0) {
		slime.cores--;
		user.visible_message(`${user} successfully extracts a core from ${target}!`, fmt("<span class='notice'>You successfully extract a core from ＀. ＀ core５ remaining.</span>", [target, slime.cores]));
		yield* new_(slime.coretype, slime.loc);
		if (slime.cores <= 0) {
			slime.icon_state = `${slime.colour} baby slime dead-nocore`;
			return 1;
		} else {
			return 0;
		}
	} else {
		to_chat(user, `<span class='warning'>There aren't any cores left in ${target}!</span>`);
		return 1;
	}
}, true);
