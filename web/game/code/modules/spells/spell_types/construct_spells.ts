// Based on /tg/station's code/modules/spells/spell_types/construct_spells.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11371, "/obj/effect/proc_holder/spell/aoe_turf/area_conversion", "/obj/effect/proc_holder/spell/aoe_turf", {
	name: "Area Conversion",
	desc: "This spell instantly converts a small area around you.",
	school: "transmutation",
	charge_max: 50,
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	range: 2,
	action_icon_state: "areaconvert",
	action_background_icon_state: "bg_cult",
});

// construct_spells.dm:27
rt.def("/obj/effect/proc_holder/spell/aoe_turf/area_conversion/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null;
	user ??= f.usr;
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/items/welder.ogg"), 75, 1);
	for (_T of each(targets, T("/turf"))) {
		yield* _T.narsie_act(0, 1, 100 - get_dist(user, _T) * 25);
	}
	return f.dot;
}, true);

rt.type(11357, "/obj/effect/proc_holder/spell/aoe_turf/conjure/floor", "/obj/effect/proc_holder/spell/aoe_turf/conjure", {
	summon_type: null,
	name: "Summon Cult Floor",
	desc: "This spell constructs a cult floor",
	school: "conjuration",
	charge_max: 20,
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	range: 0,
	action_icon_state: "floorconstruct",
	action_background_icon_state: "bg_cult",
});

// construct_spells.dm:42
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/floor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list(T("/turf/open/floor/engine/cult"));
	return f.dot;
});

rt.type(11358, "/obj/effect/proc_holder/spell/aoe_turf/conjure/wall", "/obj/effect/proc_holder/spell/aoe_turf/conjure", {
	summon_type: null,
	name: "Summon Cult Wall",
	desc: "This spell constructs a cult wall",
	school: "conjuration",
	charge_max: 100,
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	range: 0,
	action_icon_state: "lesserconstruct",
	action_background_icon_state: "bg_cult",
});

// construct_spells.dm:60
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/wall/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list(T("/turf/closed/wall/mineral/cult/artificer"));
	return f.dot;
});

rt.type(11359, "/obj/effect/proc_holder/spell/aoe_turf/conjure/wall/reinforced", "/obj/effect/proc_holder/spell/aoe_turf/conjure/wall", {
	summon_type: null,
	name: "Greater Construction",
	desc: "This spell constructs a reinforced metal wall",
	school: "conjuration",
	charge_max: 300,
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	range: 0,
});

// construct_spells.dm:74
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/wall/reinforced/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list(T("/turf/closed/wall/r_wall"));
	return f.dot;
});

rt.type(11360, "/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone", "/obj/effect/proc_holder/spell/aoe_turf/conjure", {
	summon_type: null,
	name: "Summon Soulstone",
	desc: "This spell reaches into Nar-Sie's realm, summoning one of the legendary fragments across time and space",
	school: "conjuration",
	charge_max: 3000,
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	range: 0,
	action_icon_state: "summonsoulstone",
	action_background_icon_state: "bg_demon",
});

// construct_spells.dm:89
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list(T("/obj/item/device/soulstone"));
	return f.dot;
});

rt.type(11362, "/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone/noncult", "/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone", {
	summon_type: null,
});

// construct_spells.dm:96
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone/noncult/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list(T("/obj/item/device/soulstone/anybody"));
	return f.dot;
});

rt.type(11363, "/obj/effect/proc_holder/spell/aoe_turf/conjure/lesserforcewall", "/obj/effect/proc_holder/spell/aoe_turf/conjure", {
	summon_lifespan: 200,
	name: "Shield",
	desc: "This spell creates a temporary forcefield to shield yourself and allies from incoming fire",
	school: "transmutation",
	charge_max: 300,
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	range: 0,
	summon_type: null,
	action_icon_state: "cultforcewall",
	action_background_icon_state: "bg_demon",
});

// construct_spells.dm:110
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/lesserforcewall/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list(T("/obj/effect/forcefield/cult"));
	return f.dot;
});

rt.type(11301, "/obj/effect/proc_holder/spell/targeted/abyssal_gaze", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 0,
	name: "Abyssal Gaze",
	desc: "This spell instills a deep terror in your target, temporarily chilling and blinding it.",
	charge_max: 750,
	range: 5,
	selection_type: "range",
	stat_allowed: 0,
	school: "evocation",
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	action_background_icon_state: "bg_demon",
	action_icon_state: "abyssal_gaze",
});

// construct_spells.dm:189
rt.def("/obj/effect/proc_holder/spell/targeted/abyssal_gaze/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null;
	user ??= f.usr;
	if (!rt.length(targets)) {
		to_chat(user, "<span class='notice'>No target found in range.</span>");
		yield* this.revert_cast();
		return f.dot;
	}
	if (!rt.isIn(f, (target = rt.index(targets, 1)), oview(this.range))) {
		to_chat(user, `<span class='notice'>${target} is too far away!</span>`);
		yield* this.revert_cast();
		return f.dot;
	}
	to_chat(target, "<span class='userdanger'>A freezing darkness surrounds you...</span>");
	target.playsound_local(rt.getStep(f, target, 0), rt.rsc("sound/hallucinations/i_see_you1.ogg"), 50, 1);
	user.playsound_local(rt.getStep(f, user, 0), rt.rsc("sound/effects/ghost2.ogg"), 50, 1);
	yield* target.adjust_blindness(5);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/proc_holder/spell/targeted/abyssal_gaze/proc/cure_blindness"), target)), 40);
	target.bodytemperature -= 200;
	return f.dot;
}, true);

// construct_spells.dm:209
rt.def("/obj/effect/proc_holder/spell/targeted/abyssal_gaze/proc/cure_blindness", function* cure_blindness(f: Frame, target: Value) {
	yield* target.adjust_blindness(-5);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

rt.type(11302, "/obj/effect/proc_holder/spell/targeted/dominate", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 0,
	name: "Dominate",
	desc: "This spell dominates the mind of a lesser creature, causing it to see you as an ally.",
	charge_max: 600,
	range: 7,
	selection_type: "range",
	stat_allowed: 0,
	school: "evocation",
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	action_background_icon_state: "bg_demon",
	action_icon_state: "dominate",
});

// construct_spells.dm:229
rt.def("/obj/effect/proc_holder/spell/targeted/dominate/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let S: Value = null;
	user ??= f.usr;
	if (!rt.length(targets)) {
		to_chat(user, "<span class='notice'>No target found in range.</span>");
		yield* this.revert_cast();
		return f.dot;
	}
	if ((S = rt.index(targets, 1)).ckey) {
		to_chat(user, `<span class='warning'>${S} is too intelligent to dominate!</span>`);
		yield* this.revert_cast();
		return f.dot;
	}
	if (S.stat) {
		to_chat(user, `<span class='warning'>${S} is dead!</span>`);
		yield* this.revert_cast();
		return f.dot;
	}
	if (S.sentience_type != SENTIENCE_ORGANIC) {
		to_chat(user, `<span class='warning'>${S} cannot be dominated!</span>`);
		yield* this.revert_cast();
		return f.dot;
	}
	if (!rt.isIn(f, S, oview(this.range))) {
		to_chat(user, `<span class='notice'>${S} is too far away!</span>`);
		yield* this.revert_cast();
		return f.dot;
	}
	S.add_atom_colour("#990000", FIXED_COLOUR_PRIORITY);
	S.faction = list("cult");
	playsound(rt.getStep(f, S, 0), rt.rsc("sound/effects/ghost.ogg"), 100, 1);
	yield* new_(T("/obj/effect/temp_visual/cult/sac"), rt.getStep(f, S, 0));
	return f.dot;
}, true);

// construct_spells.dm:262
rt.def("/obj/effect/proc_holder/spell/targeted/dominate/proc/can_target", function can_target(f: Frame, target: Value) {
	if (!rt.istype(target, T("/mob/living/simple_animal")) || target.stat) {
		return 0;
	}
	if (rt.isIn(f, "cult", target.faction)) {
		return 0;
	}
	return 1;
});
