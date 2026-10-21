// From code/modules/spells/spell_types/construct_spells.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/effect/proc_holder/spell/aoe_turf/area_conversion/proc/cast  (code/modules/spells/spell_types/construct_spells.dm:27)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/area_conversion/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [targets, user, _T, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/items/welder.ogg"), 75, 1]);
	_T = null;
	rt.forList(f, 0, live(targets), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.callName(f, live(_T), "narsie_act", [0, 1, subtract(100, multiply((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(_T)])), 25))]);
	}
	rt.endFor(f, 0);
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

// /obj/effect/proc_holder/spell/aoe_turf/conjure/floor/proc/<init>  (code/modules/spells/spell_types/construct_spells.dm:42)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/floor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list(T("/turf/open/floor/engine/cult")));
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

// /obj/effect/proc_holder/spell/aoe_turf/conjure/wall/proc/<init>  (code/modules/spells/spell_types/construct_spells.dm:60)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/wall/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list(T("/turf/closed/wall/mineral/cult/artificer")));
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

// /obj/effect/proc_holder/spell/aoe_turf/conjure/wall/reinforced/proc/<init>  (code/modules/spells/spell_types/construct_spells.dm:74)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/wall/reinforced/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list(T("/turf/closed/wall/r_wall")));
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

// /obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone/proc/<init>  (code/modules/spells/spell_types/construct_spells.dm:89)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list(T("/obj/item/device/soulstone")));
	return f.dot;
});

rt.type(11362, "/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone/noncult", "/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone", {
	summon_type: null,
});

// /obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone/noncult/proc/<init>  (code/modules/spells/spell_types/construct_spells.dm:96)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone/noncult/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list(T("/obj/item/device/soulstone/anybody")));
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

// /obj/effect/proc_holder/spell/aoe_turf/conjure/lesserforcewall/proc/<init>  (code/modules/spells/spell_types/construct_spells.dm:110)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/lesserforcewall/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list(T("/obj/effect/forcefield/cult")));
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

// /obj/effect/proc_holder/spell/targeted/abyssal_gaze/proc/cast  (code/modules/spells/spell_types/construct_spells.dm:189)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/abyssal_gaze/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null;
	f.vars = () => [targets, user, target];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy(rt.length(live(targets)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>No target found in range.</span>"]);
		yield* g.srcCall(f, "revert_cast");
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, (target = rt.index(live(targets), 1)), (yield* g.call(f, P("/proc/oview"), null, [rt.sv(f, "range")]))) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is too far away!</span>", [live(target)])]);
		yield* g.srcCall(f, "revert_cast");
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<span class='userdanger'>A freezing darkness surrounds you...</span>"]);
	yield* g.callName(f, live(target), "playsound_local", [rt.getStep(f, live(target), 0), rt.rsc("sound/hallucinations/i_see_you1.ogg"), 50, 1]);
	yield* g.callName(f, live(user), "playsound_local", [rt.getStep(f, live(user), 0), rt.rsc("sound/effects/ghost2.ogg"), 50, 1]);
	yield* g.callName(f, live(target), "adjust_blindness", [5]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/proc_holder/spell/targeted/abyssal_gaze/proc/cure_blindness"), live(target)])), 40]);
	(rt.modField(f, live(target), "bodytemperature", 200, subtract));
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/targeted/abyssal_gaze/proc/cure_blindness  (code/modules/spells/spell_types/construct_spells.dm:209)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/abyssal_gaze/proc/cure_blindness", function* cure_blindness(f: Frame, target: Value) {
	f.vars = () => [target];
	yield* g.callName(f, live(target), "adjust_blindness", [-5]);
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

// /obj/effect/proc_holder/spell/targeted/dominate/proc/cast  (code/modules/spells/spell_types/construct_spells.dm:229)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/dominate/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let S: Value = null;
	f.vars = () => [targets, user, S];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy(rt.length(live(targets)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>No target found in range.</span>"]);
		yield* g.srcCall(f, "revert_cast");
		return live(f.dot);
	}
	if (truthy(rt.gv(f, "ckey", (S = rt.index(live(targets), 1))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is too intelligent to dominate!</span>", [live(S)])]);
		yield* g.srcCall(f, "revert_cast");
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "stat", live(S)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is dead!</span>", [live(S)])]);
		yield* g.srcCall(f, "revert_cast");
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "sentience_type", live(S)), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ cannot be dominated!</span>", [live(S)])]);
		yield* g.srcCall(f, "revert_cast");
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, live(S), (yield* g.call(f, P("/proc/oview"), null, [rt.sv(f, "range")]))) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is too far away!</span>", [live(S)])]);
		yield* g.srcCall(f, "revert_cast");
		return live(f.dot);
	}
	yield* g.callName(f, live(S), "add_atom_colour", ["#990000", 4]);
	rt.setFv(f, "faction", live(S), rt.list("cult"));
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(S), 0), rt.rsc("sound/effects/ghost.ogg"), 100, 1]);
	yield* g.new_(f, T("/obj/effect/temp_visual/cult/sac"), [rt.getStep(f, live(S), 0)]);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/targeted/dominate/proc/can_target  (code/modules/spells/spell_types/construct_spells.dm:262)
rt.def("/obj/effect/proc_holder/spell/targeted/dominate/proc/can_target", function can_target(f: Frame, target: Value) {
	if ((!truthy((rt.istype(live(target), T("/mob/living/simple_animal")) ? 1 : 0)) || truthy(rt.fv(f, "stat", live(target))))) {
		return 0;
	}
	if (truthy((rt.isIn(f, "cult", rt.fv(f, "faction", live(target))) ? 1 : 0))) {
		return 0;
	}
	return 1;
});
