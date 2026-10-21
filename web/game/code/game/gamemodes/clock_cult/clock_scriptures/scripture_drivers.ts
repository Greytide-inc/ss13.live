// From code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1199, "/datum/clockwork_scripture/channeled/belligerent", "/datum/clockwork_scripture/channeled", {
	descname: "Channeled, Area Slowdown",
	name: "Belligerent",
	desc: "Forces all nearby non-servants to walk rather than run, doing minor damage. Chanted every two seconds for up to thirty seconds.",
	chant_invocations: null,
	chant_amount: 15,
	chant_interval: 20,
	channel_time: 20,
	usage_tip: "Useful for crowd control in a populated area and disrupting mass movement.",
	tier: "Driver",
	primary_component: "belligerent_eye",
	sort_priority: 1,
	quickbind: 1,
	quickbind_desc: "Forces nearby non-Servants to walk, doing minor damage with each chant.<br><b>Maximum 15 chants.</b>",
});

// /datum/clockwork_scripture/channeled/belligerent/proc/chant_effects  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:22)  may sleep
rt.def("/datum/clockwork_scripture/channeled/belligerent/proc/chant_effects", function* chant_effects(f: Frame, chant_number: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [chant_number, C, $e];
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/hearers"), null, [7, rt.sv(f, "invoker")])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.callName(f, live(C), "apply_status_effect", [T("/datum/status_effect/belligerent")]);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

rt.type(1212, "/datum/clockwork_scripture/create_object/judicial_visor", "/datum/clockwork_scripture/create_object", {
	descname: "Delayed Area Knockdown Glasses",
	name: "Judicial Visor",
	desc: "Forms a visor that, when worn, will grant the ability to smite an area, knocking down, muting, and damaging non-Servants.",
	invocations: null,
	channel_time: 10,
	consumed_components: null,
	whispered: 1,
	creator_message: "<span class='brass'>You form a judicial visor, which is capable of smiting the unworthy.</span>",
	usage_tip: "The visor has a thirty-second cooldown once used, and the marker it creates has a delay of 3 seconds before exploding.",
	tier: "Driver",
	space_allowed: 1,
	primary_component: "belligerent_eye",
	sort_priority: 2,
	quickbind: 1,
	quickbind_desc: "Creates a Judicial Visor, which can create a Judicial Marker at an area, knocking down, muting, and damaging non-Servants after a delay.",
	object_path: rt.typePath("/obj/item/clothing/glasses/judicial_visor"),
});

// /datum/clockwork_scripture/create_object/judicial_visor/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:32)
rt.def("/datum/clockwork_scripture/create_object/judicial_visor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Grant me the flames of Engine!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 1]));
	return f.dot;
});

rt.type(1232, "/datum/clockwork_scripture/vanguard", "/datum/clockwork_scripture", {
	descname: "Self Stun Immunity",
	name: "Vanguard",
	desc: "Provides twenty seconds of stun immunity. At the end of the twenty seconds, the invoker is knocked down for the equivalent of 25% of all stuns they absorbed. Excessive absorption will cause unconsciousness.",
	invocations: null,
	channel_time: 30,
	usage_tip: "You cannot reactivate Vanguard while still shielded by it.",
	tier: "Driver",
	primary_component: "vanguard_cogwheel",
	sort_priority: 3,
	quickbind: 1,
	quickbind_desc: "Allows you to temporarily absorb stuns. All stuns absorbed will affect you when disabled.",
});

// /datum/clockwork_scripture/vanguard/proc/check_special_requirements  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:63)
rt.def("/datum/clockwork_scripture/vanguard/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	if ((((!truthy(rt.gl("ratvar_awakens")) && truthy((rt.istype(rt.fv(f, "stun_absorption", rt.sv(f, "invoker")), T("/list")) ? 1 : 0))) && truthy(rt.index(rt.fv(f, "stun_absorption", rt.sv(f, "invoker")), "vanguard"))) && rt.gt(rt.index(rt.index(rt.fv(f, "stun_absorption", rt.sv(f, "invoker")), "vanguard"), "end_time"), rt.worldTime(f)))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='warning'>You are already shielded by a Vanguard!</span>"]);
		return 0;
	}
	return 1;
});

// /datum/clockwork_scripture/vanguard/proc/scripture_effects  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:70)  may sleep
rt.def("/datum/clockwork_scripture/vanguard/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	if (truthy(rt.gl("ratvar_awakens"))) {
		L = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [7, rt.getStep(f, rt.sv(f, "invoker"), 0)])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if ((!isEqual(rt.fv(f, "stat", live(L)), 2) && truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))))) {
				yield* g.callName(f, live(L), "apply_status_effect", [T("/datum/status_effect/vanguard_shield")]);
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
	} else {
		yield* g.callName(f, rt.sv(f, "invoker"), "apply_status_effect", [T("/datum/status_effect/vanguard_shield")]);
	}
	return 1;
}, true);

rt.type(1227, "/datum/clockwork_scripture/ranged_ability/sentinels_compromise", "/datum/clockwork_scripture/ranged_ability", {
	descname: "Convert Brute/Burn/Oxygen to Half Toxin",
	name: "Sentinel's Compromise",
	desc: "Charges your slab with healing power, allowing you to convert all of a target Servant's brute, burn, and oxygen damage to half as much toxin damage.",
	invocations: null,
	channel_time: 30,
	consumed_components: null,
	usage_tip: "The Compromise is very fast to invoke, and will remove holy water from the target Servant.",
	tier: "Driver",
	primary_component: "vanguard_cogwheel",
	sort_priority: 4,
	quickbind: 1,
	quickbind_desc: "Allows you to convert a Servant's brute, burn, and oxygen damage to half toxin damage.<br><b>Click your slab to disable.</b>",
	slab_icon: "compromise",
	ranged_message: "<span class='inathneq_small'><i>You charge the clockwork slab with healing power.</i>\n<b>Left-click a fellow Servant or yourself to heal!\nClick your slab to cancel.</b></span>",
	ranged_type: rt.typePath("/obj/effect/proc_holder/slab/compromise"),
});

// /datum/clockwork_scripture/ranged_ability/sentinels_compromise/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:86)
rt.def("/datum/clockwork_scripture/ranged_ability/sentinels_compromise/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Mend the wounds of...", "...my inferior flesh."));
	rt.setSv(f, "consumed_components", rt.alist(f, ["vanguard_cogwheel", 1]));
	return f.dot;
});

rt.type(1228, "/datum/clockwork_scripture/ranged_ability/geis_prep", "/datum/clockwork_scripture/ranged_ability", {
	descname: "Melee Convert Attack",
	name: "Geis",
	desc: "Charges your slab with divine energy, allowing you to bind a nearby heretic for conversion. This is very obvious and will make your slab visible in-hand.",
	invocations: null,
	whispered: 1,
	channel_time: 20,
	usage_tip: "Is melee range and does not penetrate mindshield implants. Much more efficient than a Sigil of Submission at low Servant amounts.",
	tier: "Driver",
	primary_component: "geis_capacitor",
	sort_priority: 5,
	quickbind: 1,
	quickbind_desc: "Allows you to bind and start converting an adjacent target non-Servant.<br><b>Click your slab to disable.</b>",
	slab_icon: "geis",
	ranged_message: "<span class='sevtug_small'><i>You charge the clockwork slab with divine energy.</i>\n<b>Left-click a target within melee range to convert!\nClick your slab to cancel.</b></span>",
	timeout_time: 100,
	ranged_type: rt.typePath("/obj/effect/proc_holder/slab/geis"),
});

// /datum/clockwork_scripture/ranged_ability/geis_prep/proc/run_scripture  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:123)  may sleep
rt.def("/datum/clockwork_scripture/ranged_ability/geis_prep/proc/run_scripture", function* run_scripture(f: Frame) {
	let servants: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [servants, M, $e];
	servants = 0;
	if (!truthy(rt.gl("ratvar_awakens"))) {
		M = null;
		rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (truthy((yield* g.call(f, P("/proc/can_recite_scripture"), null, [live(M), 1])))) {
				servants = rt.inc(live(servants), 1);
			}
		}
		rt.endFor(f, 0);
	}
	if (rt.gt(live(servants), 6)) {
		rt.setSv(f, "whispered", 0);
		(servants = rt.modify(live(servants), 6, subtract));
		rt.setSv(f, "channel_time", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "channel_time"), multiply(live(servants), 3)), 50])));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(1233, "/datum/clockwork_scripture/geis", "/datum/clockwork_scripture", {
	target: null,
	binding: null,
	name: "Geis Conversion",
	invocations: null,
	channel_time: 49,
	tier: "Peripheral",
});

// /datum/clockwork_scripture/geis/proc/Destroy  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:143)  may sleep
rt.def("/datum/clockwork_scripture/geis/proc/Destroy", function* Destroy(f: Frame) {
	if ((truthy(rt.sv(f, "binding")) && !(!truthy(rt.sv(f, "binding")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "binding")))))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "binding")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/clockwork_scripture/geis/proc/can_recite  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:148)
rt.def("/datum/clockwork_scripture/geis/proc/can_recite", function can_recite(f: Frame) {
	if (!truthy(rt.sv(f, "target"))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/clockwork_scripture/geis/proc/run_scripture  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:154)  may sleep
rt.def("/datum/clockwork_scripture/geis/proc/run_scripture", function* run_scripture(f: Frame) {
	let servants: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [servants, M, $e];
	servants = 0;
	if (!truthy(rt.gl("ratvar_awakens"))) {
		M = null;
		rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (truthy((yield* g.call(f, P("/proc/can_recite_scripture"), null, [live(M), 1])))) {
				servants = rt.inc(live(servants), 1);
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.fv(f, "buckled", rt.sv(f, "target")))) {
		yield* g.callName(f, rt.fv(f, "buckled", rt.sv(f, "target")), "unbuckle_mob", [rt.sv(f, "target"), 1]);
	}
	rt.setSv(f, "binding", (yield* g.new_(f, T("/obj/structure/destructible/clockwork/geis_binding"), [rt.getStep(f, rt.sv(f, "target"), 0)])));
	if (rt.gt(live(servants), 6)) {
		(servants = rt.modify(live(servants), 6, subtract));
		rt.setSv(f, "channel_time", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "channel_time"), multiply(live(servants), 7)), 120])));
		rt.setFv(f, "can_resist", rt.sv(f, "binding"), 1);
	}
	yield* g.callName(f, rt.sv(f, "binding"), "setDir", [rt.fv(f, "dir", rt.sv(f, "target"))]);
	yield* g.callName(f, rt.sv(f, "binding"), "buckle_mob", [rt.sv(f, "target"), 1]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/clockwork_scripture/geis/proc/check_special_requirements  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:170)
rt.def("/datum/clockwork_scripture/geis/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	return ((((rt.sv(f, "target") && rt.sv(f, "binding")) && (isEqual(rt.fv(f, "buckled", rt.sv(f, "target")), rt.sv(f, "binding")) ? 1 : 0)) && (!truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "target")])) ? 1 : 0)) && (!isEqual(rt.fv(f, "stat", rt.sv(f, "target")), 2) ? 1 : 0));
});

// /datum/clockwork_scripture/geis/proc/scripture_effects  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:173)  may sleep
rt.def("/datum/clockwork_scripture/geis/proc/scripture_effects", function* scripture_effects(f: Frame) {
	return (yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [rt.sv(f, "target")]));
}, true);

rt.type(1200, "/datum/clockwork_scripture/channeled/taunting_tirade", "/datum/clockwork_scripture/channeled", {
	flee_time: 47,
	grace_period: 3,
	progbar: null,
	descname: "Channeled, Mobile Confusion Trail",
	name: "Taunting Tirade",
	desc: "Allows movement for five seconds, leaving a trail that confuses and knocks down. Chanted every second for up to thirty seconds.",
	chant_invocations: null,
	chant_amount: 5,
	chant_interval: 10,
	consumed_components: null,
	usage_tip: "Useful for fleeing attackers, as few will be able to follow someone using this scripture.",
	tier: "Driver",
	primary_component: "geis_capacitor",
	sort_priority: 6,
	quickbind: 1,
	quickbind_desc: "Allows movement for five seconds, leaving a trail that confuses and knocks down.<br><b>Maximum 5 chants.</b>",
});

// /datum/clockwork_scripture/channeled/taunting_tirade/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:184)
rt.def("/datum/clockwork_scripture/channeled/taunting_tirade/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "chant_invocations", rt.list("Hostiles on my back!", "Enemies on my trail!", "Gonna try and shake my tail.", "Bogeys on my six!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["geis_capacitor", 1]));
	return f.dot;
});

// /datum/clockwork_scripture/channeled/taunting_tirade/proc/chant_effects  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:196)  may sleep
rt.def("/datum/clockwork_scripture/channeled/taunting_tirade/proc/chant_effects", function* chant_effects(f: Frame, chant_number: Value) {
	let invoker_old_color: Value = null, endtime: Value = null;
	f.vars = () => [chant_number, invoker_old_color, endtime];
	yield* g.callName(f, rt.sv(f, "invoker"), "visible_message", [fmt("<span class='warning'>＀ is suddenly covered with a thin layer of purple smoke!</span>", [rt.sv(f, "invoker")])]);
	invoker_old_color = rt.fv(f, "color", rt.sv(f, "invoker"));
	rt.setFv(f, "color", rt.sv(f, "invoker"), rt.list("#AF0AAF", "#AF0AAF", "#AF0AAF", "#000000"));
	rt.op(f, "Animate", [2, 6], [null, rt.sv(f, "invoker"), "color", live(invoker_old_color), "time", add(rt.sv(f, "flee_time"), rt.sv(f, "grace_period"))]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "invoker"), P("/atom/proc/update_atom_colour")])), add(rt.sv(f, "flee_time"), rt.sv(f, "grace_period"))]);
	endtime = add(rt.worldTime(f), rt.sv(f, "flee_time"));
	rt.setSv(f, "progbar", (yield* g.new_(f, T("/datum/progressbar"), [rt.sv(f, "invoker"), rt.sv(f, "flee_time"), rt.sv(f, "invoker")])));
	rt.setFv(f, "color", rt.fv(f, "bar", rt.sv(f, "progbar")), rt.list("#AF0AAF", "#AF0AAF", "#AF0AAF", "#000000"));
	rt.op(f, "Animate", [2, 6], [null, rt.fv(f, "bar", rt.sv(f, "progbar")), "color", rt.initial(f, rt.fv(f, "bar", rt.sv(f, "progbar")), "color"), "time", add(rt.sv(f, "flee_time"), rt.sv(f, "grace_period"))]);
	while (rt.lt(rt.worldTime(f), live(endtime)) && truthy((yield* g.srcCall(f, "can_recite")))) {
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		yield* g.new_(f, T("/obj/structure/destructible/clockwork/taunting_trail"), [rt.fv(f, "loc", rt.sv(f, "invoker"))]);
		yield* g.callName(f, rt.sv(f, "progbar"), "update", [subtract(live(endtime), rt.worldTime(f))]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "progbar")]);
	if ((truthy((yield* g.srcCall(f, "can_recite"))) && !isEqual(live(chant_number), rt.sv(f, "chant_amount")))) {
		yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "grace_period")]);
	} else {
		return 0;
	}
	return 1;
}, true);

// /datum/clockwork_scripture/channeled/taunting_tirade/proc/chant_end_effects  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:217)  may sleep
rt.def("/datum/clockwork_scripture/channeled/taunting_tirade/proc/chant_end_effects", function* chant_end_effects(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "progbar")]);
	return f.dot;
}, true);

rt.type(1213, "/datum/clockwork_scripture/create_object/replicant", "/datum/clockwork_scripture/create_object", {
	descname: "New Clockwork Slab",
	name: "Replicant",
	desc: "Creates a new clockwork slab.",
	invocations: null,
	channel_time: 10,
	whispered: 1,
	creator_message: "<span class='brass'>You copy a piece of replicant alloy and command it into a new slab.</span>",
	usage_tip: "This is inefficient as a way to produce components, as the slab produced must be held by someone with no other slabs to produce components.",
	tier: "Driver",
	space_allowed: 1,
	primary_component: "replicant_alloy",
	sort_priority: 7,
	quickbind: 1,
	quickbind_desc: "Creates a new Clockwork Slab.",
	object_path: rt.typePath("/obj/item/clockwork/slab"),
});

// /datum/clockwork_scripture/create_object/replicant/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:225)
rt.def("/datum/clockwork_scripture/create_object/replicant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Metal, become greater!"));
	return f.dot;
});

rt.type(1214, "/datum/clockwork_scripture/create_object/tinkerers_cache", "/datum/clockwork_scripture/create_object", {
	descname: "Necessary Structure, Shares Components",
	name: "Tinkerer's Cache",
	desc: "Forms a cache that can store an infinite amount of components. All caches are linked and will provide components to slabs. Striking a cache with a slab will transfer that slab's components to the global cache.",
	invocations: null,
	channel_time: 50,
	consumed_components: null,
	creator_message: "<span class='brass'>You form a tinkerer's cache, which is capable of storing components, which will automatically be used by slabs.</span>",
	observer_message: "<span class='warning'>A hollow brass spire rises and begins to blaze!</span>",
	usage_tip: "Slabs will draw components from the global cache after the slab's own repositories, making caches extremely useful.",
	tier: "Driver",
	one_per_tile: 1,
	primary_component: "replicant_alloy",
	sort_priority: 8,
	quickbind: 1,
	quickbind_desc: "Creates a Tinkerer's Cache, which stores components globally for slab access.",
	object_path: rt.typePath("/obj/structure/destructible/clockwork/cache"),
}, { global: { prev_cost: 653 } });

// /datum/clockwork_scripture/create_object/tinkerers_cache/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:247)
rt.def("/datum/clockwork_scripture/create_object/tinkerers_cache/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Constructing...", "...a cache!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 1, "hierophant_ansible", 0]));
	return f.dot;
});

// /datum/clockwork_scripture/create_object/tinkerers_cache/proc/creation_update  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:261)
rt.def("/datum/clockwork_scripture/create_object/tinkerers_cache/proc/creation_update", function creation_update(f: Frame) {
	let cache_cost_increase: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [cache_cost_increase, i, $e];
	if (!isEqual((cache_cost_increase = rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/round"), null, [multiply(rt.gl("clockwork_caches"), 0.4000000059604645)]), 10])), rt.gl("prev_cost"))) {
		rt.setGl("prev_cost", live(cache_cost_increase));
		rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 1, "hierophant_ansible", 0]));
		i = null;
		rt.forList(f, 0, rt.sv(f, "consumed_components"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (!isEqual(live(i), "replicant_alloy")) {
				rt.modAt(rt.sv(f, "consumed_components"), live(i), live(cache_cost_increase), add);
			}
		}
		rt.endFor(f, 0);
		return 1;
	}
	return 0;
});

rt.type(1215, "/datum/clockwork_scripture/create_object/wraith_spectacles", "/datum/clockwork_scripture/create_object", {
	descname: "Limited Xray Vision Glasses",
	name: "Wraith Spectacles",
	desc: "Fabricates a pair of glasses which grant true sight but cause gradual vision loss.",
	invocations: null,
	channel_time: 10,
	whispered: 1,
	creator_message: "<span class='brass'>You form a pair of wraith spectacles, which grant true sight but cause gradual vision loss.</span>",
	usage_tip: "\"True sight\" means that you are able to see through walls and in darkness.",
	tier: "Driver",
	space_allowed: 1,
	primary_component: "hierophant_ansible",
	sort_priority: 9,
	quickbind: 1,
	quickbind_desc: "Creates a pair of Wraith Spectacles, which grant true sight but cause gradual vision loss.",
	object_path: rt.typePath("/obj/item/clothing/glasses/wraith_spectacles"),
});

// /datum/clockwork_scripture/create_object/wraith_spectacles/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:277)
rt.def("/datum/clockwork_scripture/create_object/wraith_spectacles/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Show the truth of this world to me!"));
	return f.dot;
});

rt.type(1216, "/datum/clockwork_scripture/create_object/sigil_of_transgression", "/datum/clockwork_scripture/create_object", {
	descname: "Trap, Stunning",
	name: "Sigil of Transgression",
	desc: "Wards a tile with a sigil, which will stun the next non-Servant to cross it.",
	invocations: null,
	channel_time: 50,
	consumed_components: null,
	whispered: 1,
	creator_message: "<span class='brass'>A sigil silently appears below you. The next non-Servant to cross it will be stunned.</span>",
	usage_tip: "The sigil, while fairly powerful in its stun, does not induce muteness in its victim.",
	tier: "Driver",
	one_per_tile: 1,
	primary_component: "hierophant_ansible",
	sort_priority: 10,
	quickbind: 1,
	quickbind_desc: "Creates a Sigil of Transgression, which will stun the next non-Servant to cross it.",
	object_path: rt.typePath("/obj/effect/clockwork/sigil/transgression"),
});

// /datum/clockwork_scripture/create_object/sigil_of_transgression/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm:298)
rt.def("/datum/clockwork_scripture/create_object/sigil_of_transgression/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Divinity, smite...", "...those who tresspass here!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["hierophant_ansible", 1]));
	return f.dot;
});
