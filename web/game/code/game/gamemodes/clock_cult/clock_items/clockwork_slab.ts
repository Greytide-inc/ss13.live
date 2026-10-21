// From code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8949, "/obj/item/clockwork/slab", "/obj/item/clockwork", {
	stored_components: null,
	busy: null,
	production_time: 0,
	target_component_id: null,
	no_cost: 0,
	speed_multiplier: 1,
	produces_components: 1,
	selected_scripture: "Driver",
	recollecting: 0,
	slab_ability: null,
	quickbound: null,
	maximum_quickbound: 5,
	clockwork_desc: "A link between the Celestial Derelict and the mortal plane. Contains limitless knowledge, fabricates components, and outputs a stream of information that only a trained eye can detect.\nUse the <span class='brass'>Hierophant Network</span> action button to communicate with other servants.\nClockwork slabs will only make components if held or if inside an item held by a human, and when making a component will prevent all other slabs held from making components.\nHitting a slab, a Servant with a slab, or a cache will <b>transfer</b> this slab's components into the target, the target's slab, or the global cache, respectively.",
	name: "clockwork slab",
	desc: "A strange metal tablet. A clock in the center turns around and around.",
	icon_state: "dread_ipad",
	slot_flags: 512,
	w_class: 2,
	actions_types: null,
});

// /obj/item/clockwork/slab/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:11)
rt.def("/obj/item/clockwork/slab/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stored_components", rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 0, "hierophant_ansible", 0]));
	$0 = $0;
	rt.setSv(f, "quickbound", rt.list(T("/datum/clockwork_scripture/ranged_ability/geis_prep"), T("/datum/clockwork_scripture/create_object/replicant"), T("/datum/clockwork_scripture/create_object/tinkerers_cache")));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/clock/hierophant")));
	return f.dot;
});

rt.type(8950, "/obj/item/clockwork/slab/starter", "/obj/item/clockwork/slab", {
	stored_components: null,
});

// /obj/item/clockwork/slab/starter/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:27)
rt.def("/obj/item/clockwork/slab/starter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stored_components", rt.alist(f, ["belligerent_eye", 1, "vanguard_cogwheel", 1, "geis_capacitor", 1, "replicant_alloy", 1, "hierophant_ansible", 1]));
	return f.dot;
});

rt.type(8951, "/obj/item/clockwork/slab/internal", "/obj/item/clockwork/slab", {
	quickbound: null,
	no_cost: 1,
	produces_components: 0,
	name: "scripture motor",
});

// /obj/item/clockwork/slab/internal/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:31)
rt.def("/obj/item/clockwork/slab/internal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "quickbound", rt.list());
	return f.dot;
});

rt.type(8952, "/obj/item/clockwork/slab/debug", "/obj/item/clockwork/slab", {
	speed_multiplier: 0,
	no_cost: 1,
});

// /obj/item/clockwork/slab/debug/proc/attack_hand  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:40)  may sleep
rt.def("/obj/item/clockwork/slab/debug/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])))) return f.dot;
	yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [live(f.args[0])]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(8953, "/obj/item/clockwork/slab/cyborg", "/obj/item/clockwork/slab", {
	clockwork_desc: "A divine link to the Celestial Derelict, allowing for limited recital of scripture.\nHitting a slab, a Servant with a slab, or a cache will <b>transfer</b> this slab's components into the target, the target's slab, or the global cache, respectively.",
	quickbound: null,
	maximum_quickbound: 6,
	actions_types: null,
});

// /obj/item/clockwork/slab/cyborg/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:47)
rt.def("/obj/item/clockwork/slab/cyborg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "quickbound", rt.list(T("/datum/clockwork_scripture/ranged_ability/judicial_marker"), T("/datum/clockwork_scripture/ranged_ability/linked_vanguard"), T("/datum/clockwork_scripture/create_object/tinkerers_cache")));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

rt.type(8954, "/obj/item/clockwork/slab/cyborg/engineer", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// /obj/item/clockwork/slab/cyborg/engineer/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:53)
rt.def("/obj/item/clockwork/slab/cyborg/engineer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "quickbound", rt.list(T("/datum/clockwork_scripture/create_object/replicant"), T("/datum/clockwork_scripture/create_object/cogscarab"), T("/datum/clockwork_scripture/create_object/soul_vessel"), T("/datum/clockwork_scripture/create_object/sigil_of_transmission"), T("/datum/clockwork_scripture/create_object/interdiction_lens")));
	return f.dot;
});

rt.type(8955, "/obj/item/clockwork/slab/cyborg/medical", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// /obj/item/clockwork/slab/cyborg/medical/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:57)
rt.def("/obj/item/clockwork/slab/cyborg/medical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "quickbound", rt.list(T("/datum/clockwork_scripture/ranged_ability/linked_vanguard"), T("/datum/clockwork_scripture/ranged_ability/sentinels_compromise"), T("/datum/clockwork_scripture/create_object/vitality_matrix"), T("/datum/clockwork_scripture/channeled/mending_mantra"), T("/datum/clockwork_scripture/fellowship_armory")));
	return f.dot;
});

rt.type(8956, "/obj/item/clockwork/slab/cyborg/security", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// /obj/item/clockwork/slab/cyborg/security/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:61)
rt.def("/obj/item/clockwork/slab/cyborg/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "quickbound", rt.list(T("/datum/clockwork_scripture/channeled/belligerent"), T("/datum/clockwork_scripture/ranged_ability/judicial_marker"), T("/datum/clockwork_scripture/channeled/taunting_tirade"), T("/datum/clockwork_scripture/channeled/volt_blaster")));
	return f.dot;
});

rt.type(8957, "/obj/item/clockwork/slab/cyborg/peacekeeper", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// /obj/item/clockwork/slab/cyborg/peacekeeper/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:65)
rt.def("/obj/item/clockwork/slab/cyborg/peacekeeper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "quickbound", rt.list(T("/datum/clockwork_scripture/channeled/belligerent"), T("/datum/clockwork_scripture/ranged_ability/judicial_marker"), T("/datum/clockwork_scripture/channeled/taunting_tirade"), T("/datum/clockwork_scripture/channeled/volt_blaster")));
	return f.dot;
});

rt.type(8958, "/obj/item/clockwork/slab/cyborg/janitor", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// /obj/item/clockwork/slab/cyborg/janitor/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:69)
rt.def("/obj/item/clockwork/slab/cyborg/janitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "quickbound", rt.list(T("/datum/clockwork_scripture/create_object/replicant"), T("/datum/clockwork_scripture/create_object/sigil_of_transgression"), T("/datum/clockwork_scripture/create_object/ocular_warden"), T("/datum/clockwork_scripture/create_object/mania_motor"), T("/datum/clockwork_scripture/create_object/tinkerers_daemon")));
	return f.dot;
});

rt.type(8959, "/obj/item/clockwork/slab/cyborg/service", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// /obj/item/clockwork/slab/cyborg/service/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:73)
rt.def("/obj/item/clockwork/slab/cyborg/service/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "quickbound", rt.list(T("/datum/clockwork_scripture/create_object/replicant"), T("/datum/clockwork_scripture/create_object/tinkerers_cache"), T("/datum/clockwork_scripture/spatial_gateway"), T("/datum/clockwork_scripture/fellowship_armory"), T("/datum/clockwork_scripture/create_object/clockwork_obelisk")));
	return f.dot;
});

rt.type(8960, "/obj/item/clockwork/slab/cyborg/miner", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// /obj/item/clockwork/slab/cyborg/miner/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:77)
rt.def("/obj/item/clockwork/slab/cyborg/miner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "quickbound", rt.list(T("/datum/clockwork_scripture/ranged_ability/linked_vanguard"), T("/datum/clockwork_scripture/spatial_gateway"), T("/datum/clockwork_scripture/channeled/volt_blaster")));
	return f.dot;
});

// /obj/item/clockwork/slab/cyborg/proc/access_display  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:80)  may sleep
rt.def("/obj/item/clockwork/slab/cyborg/proc/access_display", function* access_display(f: Frame) {
	if (!truthy(rt.gl("ratvar_awakens"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Use the action buttons to recite your limited set of scripture!</span>"]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clockwork/slab/cyborg/proc/ratvar_act  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:86)  may sleep
rt.def("/obj/item/clockwork/slab/cyborg/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.gl("ratvar_awakens"))) return f.dot;
	yield* g.callName(f, rt.gl("SStgui"), "close_uis", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/clockwork/slab/proc/Initialize  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:91)  may sleep
rt.def("/obj/item/clockwork/slab/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/update_slab_info"), null, [live(f.src)]);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	rt.setSv(f, "production_time", add(rt.worldTime(f), 450));
	return f.dot;
}, true);

// /obj/item/clockwork/slab/proc/Destroy  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:97)  may sleep
rt.def("/obj/item/clockwork/slab/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	if ((truthy(rt.sv(f, "slab_ability")) && truthy(rt.fv(f, "ranged_ability_user", rt.sv(f, "slab_ability"))))) {
		yield* g.callName(f, rt.sv(f, "slab_ability"), "remove_ranged_ability", []);
	}
	rt.setSv(f, "slab_ability", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clockwork/slab/proc/dropped  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:104)  may sleep
rt.def("/obj/item/clockwork/slab/proc/dropped", function* dropped(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clockwork/slab/proc/check_on_mob"), live(f.args[0])])), 1]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clockwork/slab/proc/check_on_mob  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:108)  may sleep
rt.def("/obj/item/clockwork/slab/proc/check_on_mob", function* check_on_mob(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(((truthy(live(user)) && !truthy((rt.isIn(f, live(f.src), rt.fv(f, "held_items", live(user))) ? 1 : 0))) && truthy(rt.sv(f, "slab_ability"))) && truthy(rt.fv(f, "ranged_ability_user", rt.sv(f, "slab_ability"))))) return f.dot;
	yield* g.callName(f, rt.sv(f, "slab_ability"), "remove_ranged_ability", []);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// /obj/item/clockwork/slab/proc/process  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:113)  may sleep
rt.def("/obj/item/clockwork/slab/proc/process", function* process(f: Frame) {
	let servants: Value = null, production_slowdown: Value = null, M: Value = null, L: Value = null, component_to_generate: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [servants, production_slowdown, M, L, component_to_generate, S, $e];
	if (!truthy(rt.sv(f, "produces_components"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "production_time"), rt.worldTime(f))) {
		return live(f.dot);
	}
	servants = 0;
	production_slowdown = 0;
	M = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(M)]))) && (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/silicon")) ? 1 : 0))))) {
			servants = rt.inc(live(servants), 1);
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(live(servants), 6)) {
		(servants = rt.modify(live(servants), 6, subtract));
		production_slowdown = (yield* g.call(f, P("/proc/min"), null, [multiply(150, live(servants)), 1350]));
	}
	rt.setSv(f, "production_time", add(add(rt.worldTime(f), 450), live(production_slowdown)));
	L = null;
	if (!(truthy((rt.istype((L = (yield* g.call(f, P("/proc/get_atom_on_turf"), null, [live(f.src), T("/mob/living")]))), T("/mob/living")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/can_recite_scripture"), null, [live(L)]))))) return f.dot;
	if (!truthy((component_to_generate = rt.sv(f, "target_component_id")))) {
		component_to_generate = (yield* g.call(f, P("/proc/get_weighted_component_id"), null, [live(f.src)]));
	}
	rt.incAt(rt.sv(f, "stored_components"), live(component_to_generate), 1, true);
	yield* g.call(f, P("/proc/update_slab_info"), null, [live(f.src)]);
	S = null;
	rt.forList(f, 0, (yield* g.callName(f, live(L), "GetAllContents", [])), T("/obj/item/clockwork/slab"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (isEqual(live(S), live(f.src))) {
			continue;
		}
		rt.setFv(f, "production_time", live(S), add(rt.sv(f, "production_time"), 50));
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='warning'>Your slab cl＀s as it produces a </span><span class='＀'>component</span><span class='warning'>.</span>", [rt.op(f, "PickUnweighted", [4], ["ank", "ink", "unk", "ang"]), (yield* g.call(f, P("/proc/get_component_span"), null, [live(component_to_generate)]))])]);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/clockwork/slab/proc/examine  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:142)
rt.def("/obj/item/clockwork/slab/proc/examine", function examine(f: Frame) {
	let i: Value = null, quickbind_slot: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [i, quickbind_slot, $0, $1, $2, $3, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	if (truthy(rt.length(rt.sv(f, "quickbound")))) {
		i = null;
		rt.forRange(f, 0, 1, rt.len(f, rt.sv(f, "quickbound")), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (!truthy(rt.index(rt.sv(f, "quickbound"), live(i)))) {
				continue;
			}
			quickbind_slot = rt.index(rt.sv(f, "quickbound"), live(i));
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<b>Quickbind</b> button: <span class='＀'>＀</span>.", [rt.call(f, P("/proc/get_component_span"), null, [rt.initial(f, live(quickbind_slot), "primary_component")]), rt.initial(f, live(quickbind_slot), "name")])]);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.gl("clockwork_caches"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<b>Stored components (with global cache):</b>"]);
		i = null;
		rt.forList(f, 0, rt.sv(f, "stored_components"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			$0 = live(f.args[0]);
			$1 = rt.call(f, P("/proc/get_component_span"), null, [live(i)]);
			$2 = rt.call(f, P("/proc/get_component_name"), null, [live(i)]);
			if (!isEqual(live(i), "replicant_alloy")) {
				$3 = "s";
			} else {
				$3 = "";
			}
			rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='＀_small'><i>＀＀:</i> <b>＀</b> (<b>＀</b>)</span>", [$1, $2, $3, rt.index(rt.sv(f, "stored_components"), live(i)), add(rt.index(rt.sv(f, "stored_components"), live(i)), rt.index(rt.gl("clockwork_component_cache"), live(i)))])]);
		}
		rt.endFor(f, 0);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<b>Stored components:</b>"]);
		i = null;
		rt.forList(f, 0, rt.sv(f, "stored_components"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			$0 = live(f.args[0]);
			$1 = rt.call(f, P("/proc/get_component_span"), null, [live(i)]);
			$2 = rt.call(f, P("/proc/get_component_name"), null, [live(i)]);
			if (!isEqual(live(i), "replicant_alloy")) {
				$3 = "s";
			} else {
				$3 = "";
			}
			rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='＀_small'><i>＀＀:</i> <b>＀</b></span>", [$1, $2, $3, rt.index(rt.sv(f, "stored_components"), live(i))])]);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/clockwork/slab/proc/attack  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:162)  may sleep
rt.def("/obj/item/clockwork/slab/proc/attack", function* attack(f: Frame) {
	let targetslab: Value = null, highest_component_amount: Value = null, S: Value = null, totalcomponents: Value = null, i: Value = null, i_2: Value = null;
	let $e: any;
	f.vars = () => [targetslab, highest_component_amount, S, totalcomponents, i, i_2, $e];
	if ((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])]))) && truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])]))))) {
		targetslab = null;
		highest_component_amount = 0;
		S = null;
		rt.forList(f, 0, (yield* g.callName(f, live(f.args[0]), "GetAllContents", [])), T("/obj/item/clockwork/slab"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			if (!truthy((rt.istype(live(S), T("/obj/item/clockwork/slab/internal")) ? 1 : 0))) {
				totalcomponents = 0;
				i = null;
				rt.forList(f, 1, rt.fv(f, "stored_components", live(S)));
				while (($e = rt.next(f, 1)) !== undefined) {
					i = $e;
					totalcomponents = rt.modify(live(totalcomponents), rt.index(rt.fv(f, "stored_components", live(S)), live(i)), add);
				}
				rt.endFor(f, 1);
				if ((!truthy(live(targetslab)) || rt.gt(live(totalcomponents), live(highest_component_amount)))) {
					highest_component_amount = live(totalcomponents);
					targetslab = live(S);
				}
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(targetslab))) {
			if (isEqual(live(targetslab), live(f.src))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='heavy_brass'>\"You can't transfer components into your own slab, idiot.\"</span>"]);
			} else {
				i_2 = null;
				rt.forList(f, 0, rt.sv(f, "stored_components"));
				while (($e = rt.next(f, 0)) !== undefined) {
					i_2 = $e;
					rt.modAt(rt.fv(f, "stored_components", live(targetslab)), live(i_2), rt.index(rt.sv(f, "stored_components"), live(i_2)), add);
					rt.setAt(rt.sv(f, "stored_components"), live(i_2), 0);
				}
				rt.endFor(f, 0);
				yield* g.call(f, P("/proc/update_slab_info"), null, [live(targetslab)]);
				yield* g.call(f, P("/proc/update_slab_info"), null, [live(f.src)]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ empties ＀ into ＀'s ＀.</span>", [live(f.args[1]), live(f.src), live(f.args[0]), rt.fv(f, "name", live(targetslab))]), fmt("<span class='notice'>You transfer your slab's components into ＀'s ＀.</span>", [live(f.args[0]), rt.fv(f, "name", live(targetslab))])]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ has no slabs to transfer components to.</span>", [live(f.args[0])])]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/clockwork/slab/proc/attackby  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:190)  may sleep
rt.def("/obj/item/clockwork/slab/proc/attackby", function* attackby(f: Frame) {
	let ratvarian: Value = null, C: Value = null, S: Value = null, needs_update: Value = null, i: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $e: any;
	f.vars = () => [ratvarian, C, S, needs_update, i, $0, $1, $2, $3, $4, $e];
	ratvarian = (yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])]));
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/clockwork/component")) ? 1 : 0)) && truthy(live(ratvarian)))) {
		if (!truthy(rt.gv(f, "component_id", (C = live(f.args[0]))))) {
			return 0;
		}
		$0 = live(f.args[1]);
		$1 = fmt("<span class='notice'>＀ inserts ＀ into ＀.</span>", [live(f.args[1]), live(C), live(f.src)]);
		$2 = live(C);
		$3 = live(f.src);
		if (truthy(rt.gl("clockwork_caches"))) {
			$4 = ", where it is added to the global cache";
		} else {
			$4 = "";
		}
		yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You insert ＀ into ＀＀.</span>", [$2, $3, $4])]);
		if (truthy(rt.gl("clockwork_caches"))) {
			rt.incAt(rt.gl("clockwork_component_cache"), rt.fv(f, "component_id", live(C)), 1, true);
			yield* g.call(f, P("/proc/update_slab_info"), null, []);
		} else {
			rt.incAt(rt.sv(f, "stored_components"), rt.fv(f, "component_id", live(C)), 1, true);
			yield* g.call(f, P("/proc/update_slab_info"), null, [live(f.src)]);
		}
		yield* g.callName(f, live(f.args[1]), "drop_item", []);
		yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
		return 1;
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/clockwork/slab")) ? 1 : 0)) && truthy(live(ratvarian)))) {
			S = live(f.args[0]);
			needs_update = 0;
			i = null;
			rt.forList(f, 0, rt.sv(f, "stored_components"));
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				rt.modAt(rt.sv(f, "stored_components"), live(i), rt.index(rt.fv(f, "stored_components", live(S)), live(i)), add);
				rt.setAt(rt.fv(f, "stored_components", live(S)), live(i), 0);
				if (truthy(rt.index(rt.fv(f, "stored_components", live(S)), live(i)))) {
					needs_update = 1;
				}
			}
			rt.endFor(f, 0);
			if (truthy(live(needs_update))) {
				yield* g.call(f, P("/proc/update_slab_info"), null, [live(f.src)]);
				yield* g.call(f, P("/proc/update_slab_info"), null, [live(S)]);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ empties ＀ into ＀.</span>", [live(f.args[1]), live(f.src), live(S)]), fmt("<span class='notice'>You transfer your slab's components into ＀.</span>", [live(S)])]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/clockwork/slab/proc/ui_action_click  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:223)  may sleep
rt.def("/obj/item/clockwork/slab/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	let Q: Value = null;
	f.vars = () => [user, action, Q];
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/clock/hierophant")) ? 1 : 0))) {
		yield* g.srcCall(f, "show_hierophant", live(user));
	} else {
		if (!truthy((rt.istype(live(action), T("/datum/action/item_action/clock/quickbind")) ? 1 : 0))) return f.dot;
		Q = live(action);
		yield* g.srcCall(f, "recite_scripture", rt.index(rt.sv(f, "quickbound"), rt.fv(f, "scripture_index", live(Q))), live(user), 0);
	}
	return f.dot;
}, true);

// /obj/item/clockwork/slab/proc/show_hierophant  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:230)  may sleep
rt.def("/obj/item/clockwork/slab/proc/show_hierophant", function* show_hierophant(f: Frame, user: Value) {
	let message: Value = null;
	f.vars = () => [user, message];
	if (!truthy((yield* g.callName(f, live(user), "can_speak_vocal", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You cannot speak into the slab!</span>"]);
		return 0;
	}
	if ((((!truthy((message = (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), "Enter a message to send to your fellow servants.", "Hierophant"])))) || !truthy(live(user))) || !truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src)])))) || !truthy((yield* g.callName(f, live(user), "can_speak_vocal", []))))) {
		return 0;
	}
	yield* g.call(f, P("/proc/clockwork_say"), null, [live(user), (yield* g.call(f, P("/proc/text2ratvar"), null, [fmt("Servants, hear my words. ＀", [(yield* g.call(f, P("/proc/html_decode"), null, [live(message)]))])])), 1]);
	yield* g.call(f, P("/proc/titled_hierophant_message"), null, [live(user), live(message)]);
	return 1;
}, true);

// /obj/item/clockwork/slab/proc/attack_self  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:242)  may sleep
rt.def("/obj/item/clockwork/slab/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='heavy_brass'>\"You reek of blood. You've got a lot of nerve to even look at that slab.\"</span>"]);
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>A sizzling sound comes from ＀'s hands!</span>", [live(user)]), fmt("<span class='userdanger'>＀ suddenly grows extremely hot in your hands!</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/weapons/sear.ogg"), 50, 1]);
		yield* g.callName(f, live(user), "drop_item", []);
		yield* g.callName(f, live(user), "emote", ["scream"]);
		yield* g.callName(f, live(user), "apply_damage", [5, "fire", "l_arm"]);
		yield* g.callName(f, live(user), "apply_damage", [5, "fire", "r_arm"]);
		return 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The information on ＀'s display shifts rapidly. After a moment, your head begins to pound, and you tear your eyes away.</span>", [live(f.src)])]);
		rt.modField(f, live(user), "confused", 5, add);
		rt.modField(f, live(user), "dizziness", 5, add);
		return 0;
	}
	if (truthy(rt.sv(f, "busy"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ refuses to work, displaying the message: \"＀!\"</span>", [live(f.src), rt.sv(f, "busy")])]);
		return 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/can_recite_scripture"), null, [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='nezbere'>＀ hums fitfully in your hands, but doesn't seem to do anything...</span>", [live(f.src)])]);
		return 0;
	}
	yield* g.srcCall(f, "access_display", live(user));
	return f.dot;
}, true);

// /obj/item/clockwork/slab/proc/access_display  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:265)  may sleep
rt.def("/obj/item/clockwork/slab/proc/access_display", function* access_display(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)])))) {
		return 0;
	}
	yield* g.srcCall(f, "ui_interact", live(user));
	return 1;
}, true);

// /obj/item/clockwork/slab/proc/ui_interact  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:271)  may sleep
rt.def("/obj/item/clockwork/slab/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("inventory_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "clockwork_slab", rt.sv(f, "name"), 800, 420, live(master_ui), live(state)]))), "set_autoupdate", [0]);
	yield* g.callName(f, live(ui), "set_style", ["clockwork"]);
	yield* g.callName(f, live(ui), "open", []);
	return f.dot;
}, true);

// /obj/item/clockwork/slab/proc/recite_scripture  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:279)  may sleep
rt.def("/obj/item/clockwork/slab/proc/recite_scripture", function* recite_scripture(f: Frame, scripture: Value, user: Value) {
	let initial_tier: Value = null, scripture_to_recite: Value = null;
	f.vars = () => [scripture, user, initial_tier, scripture_to_recite];
	if ((((!truthy(live(scripture)) || !truthy(live(user))) || !truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src)])))) || !truthy((yield* g.call(f, P("/proc/can_recite_scripture"), null, [live(user)]))))) {
		return 0;
	}
	if (!isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(f.src))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to hold the slab in your active hand to recite scripture!</span>"]);
		return 0;
	}
	if (!isEqual((initial_tier = rt.initial(f, live(scripture), "tier")), "Peripheral")) {
		if (((!truthy(rt.gl("ratvar_awakens")) && !truthy(rt.sv(f, "no_cost"))) && !truthy(rt.index(rt.fv(f, "scripture_states", rt.gl("SSticker")), live(initial_tier))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>That scripture is not unlocked, and cannot be recited!</span>"]);
			return 0;
		}
	}
	rt.setFv(f, "slab", (scripture_to_recite = (yield* g.new_(f, live(scripture), []))), live(f.src));
	rt.setFv(f, "invoker", live(scripture_to_recite), live(user));
	yield* g.callName(f, live(scripture_to_recite), "run_scripture", []);
	return 1;
}, true, { argTypes: [{ path: "/datum/clockwork_scripture" }, { type: 8, path: "/mob/living" }] });

// /obj/item/clockwork/slab/proc/recollection  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:297)
rt.def("/obj/item/clockwork/slab/proc/recollection", function recollection(f: Frame) {
	let textlist: Value = null, i: Value = null, servants: Value = null, production_time: Value = null, M: Value = null, production_text_addon: Value = null, production_text: Value = null, i_5: Value = null, quickbind_slot: Value = null;
	let $e: any;
	f.vars = () => [textlist, i, servants, production_time, M, production_text_addon, production_text, i_5, quickbind_slot, $e];
	textlist = rt.list("If you're seeing this, file a bug report.");
	if (truthy(rt.gl("ratvar_awakens"))) {
		textlist = rt.list("<font color=#BE8700 size=3><b>");
		i = null;
		rt.forRange(f, 0, 1, 100, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			textlist = rt.modify(live(textlist), "HONOR RATVAR ", add);
		}
		rt.endFor(f, 0);
		textlist = rt.modify(live(textlist), "</b></font>", add);
	} else {
		servants = 0;
		production_time = 450;
		M = null;
		rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if ((truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(M)])) && (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/silicon")) ? 1 : 0))))) {
				servants = rt.inc(live(servants), 1);
			}
		}
		rt.endFor(f, 0);
		if (rt.gt(live(servants), 6)) {
			(servants = rt.modify(live(servants), 6, subtract));
			production_time = rt.modify(live(production_time), rt.call(f, P("/proc/min"), null, [multiply(150, live(servants)), 1350]), add);
		}
		production_text_addon = "";
		if (!isEqual(live(production_time), 1800)) {
			production_text_addon = fmt(", which increases for each human or silicon servant above <b>＀</b>", [6]);
		}
		production_time = divide(live(production_time), 600);
		production_text = null;
		if (truthy(rt.call(f, P("/proc/round"), null, [live(production_time)]))) {
			production_text = rt.list(fmt("<b>＀ minute５", [rt.call(f, P("/proc/round"), null, [live(production_time)])]));
		}
		if (!isEqual(live(production_time), rt.call(f, P("/proc/round"), null, [live(production_time)]))) {
			(production_time = rt.modify(live(production_time), rt.call(f, P("/proc/round"), null, [live(production_time)]), subtract));
			(production_time = rt.modify(live(production_time), 60, multiply));
			if (!truthy(rt.length(live(production_text)))) {
				production_text = rt.list(fmt("<b>＀ second５", [rt.call(f, P("/proc/round"), null, [live(production_time), 1])]));
			} else {
				production_text = rt.modify(live(production_text), fmt(" and ＀ second５", [rt.call(f, P("/proc/round"), null, [live(production_time), 1])]), add);
			}
		}
		production_text = rt.modify(live(production_text), "</b>", add);
		textlist = rt.list(fmt("<font color=#BE8700 size=3><b><center>Chetr nyy hagehguf-naq-ubabe Ratvar.</center></b></font><br>First and foremost, you serve Ratvar, the Clockwork Justicar, in any ways he sees fit. This is with no regard to your personal well-being, and you would do well to think of the larger scale of things than your life. Ratvar wishes retribution upon those that trapped him in Reebe - the Nar-Sian cultists - and you are to help him obtain it.<br><br>Ratvar, being trapped in Reebe, the Celestial Derelict, cannot directly affect the mortal plane. However, links, such as this Clockwork Slab, can be created to draw <b><font color=#BE8700>Components</font></b>, fragments of the Justicar, from Reebe, and those Components can be used to draw power and material from Reebe through arcane chants known as <b><font color=#BE8700>Scripture</font></b>.<br><br>One component of a random type is made in this slab every ＀.<br><font color=#BE8700>Components</font> are stored either within slabs, where they can only be accessed by that slab, or in the Global Cache accessed by Tinkerer's Caches, which all slabs can draw from to recite scripture.<br>There are five types of component, and in general, <font color=#6E001A>Belligerent Eyes</font> are aggressive and judgemental, <font color=#1E8CE1>Vanguard Cogwheels</font> are defensive and repairing, <font color=#AF0AAF>Geis Capacitors</font> are for conversion and control, <font color=#5A6068>Replicant Alloy</font> is for construction and fuel, and <font color=#DAAA18>Hierophant Ansibles</font> are for transmission and power, though in combination their effects become more nuanced.<br><br>There are also four tiers of <font color=#BE8700>Scripture</font>; <font color=#BE8700>＀</font>, <font color=#BE8700>＀</font>, <font color=#BE8700>＀</font>, and <font color=#BE8700>＀</font>.<br>Each tier has additional requirements, including Servants, Tinkerer's Caches, and <b>Construction Value</b>(<b>CV</b>). Construction Value is gained by creating structures or converting the station, and everything too large to hold will grant some amount of it.<br><br>This would be a massive amount of information to try and keep track of, but all Servants have the <b><font color=#BE8700>Global Records</font></b> alert, which appears in the top right.<br>Mousing over that alert will display Servants, Caches, CV, and other information, such as the tiers of scripture that are unlocked.<br><br>On that note, <font color=#BE8700>Scripture</font> is recited through <b><font color=#BE8700>Recital</font></b>, the first and most important function of the slab, which also allows <b>Quickbinding</b> scripture.<br>All scripture requires some amount of <font color=#BE8700>Components</font> to recite, and only the weakest scripture does not consume any components when recited.<br>However, weak is relative when it comes to scripture; even the 'weakest' could be enough to dominate a station in the hands of cunning Servants, and higher tiers of scripture are even stronger in the right hands.<br><br>Some effects of scripture include granting the invoker a temporary complete immunity to stuns, summoning a turret that can attack anything that sets eyes on it, or even binding a powerful guardian to the invoker.<br>However, the most important scripture is <font color=#AF0AAF>Geis</font>, which allows you to convert heathens with relative ease.<br><br>The second function of the clockwork slab is <b><font color=#BE8700>Recollection</font></b>, which will display this guide.<br><br>The remaining functions are several buttons in the top left while holding the slab.<br>From left to right, they are:<br><b><font color=#DAAA18>Hierophant Network</font></b>, which allows communication to other Servants.<br>", [(production_text = rt.callName(f, (production_text = rt.modify(live(production_text), live(production_text_addon), add)), "Join", [])), "Driver", "Script", "Application", "Judgement"]));
		if (truthy(rt.length(rt.sv(f, "quickbound")))) {
			i_5 = null;
			rt.forRange(f, 0, 1, rt.sv(f, "maximum_quickbound"), 1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i_5 = $e;
				if ((rt.lt(rt.length(rt.sv(f, "quickbound")), live(i_5)) || !truthy(rt.index(rt.sv(f, "quickbound"), live(i_5))))) {
					textlist = rt.modify(live(textlist), "A <b>Quickbind</b> slot, currently set to <b><font color=#BE8700>Nothing</font></b>.<br>", add);
				} else {
					textlist = rt.modify(live(textlist), fmt("A <b>Quickbind</b> slot, currently set to <b><font color=＀>＀</font></b>.<br>", [rt.call(f, P("/proc/get_component_color_bright"), null, [rt.initial(f, (quickbind_slot = rt.index(rt.sv(f, "quickbound"), live(i_5))), "primary_component")]), rt.initial(f, live(quickbind_slot), "name")]), add);
				}
			}
			rt.endFor(f, 0);
		}
		textlist = rt.modify(live(textlist), "<br>Examine the slab or swap to Recital to check the number of components it has available.<br><br><font color=#BE8700 size=3><b><center>Purge all untruths and honor Ratvar.</center></b></font>", add);
	}
	return rt.callName(f, live(textlist), "Join", []);
});

// /obj/item/clockwork/slab/proc/ui_data  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:382)  may sleep
rt.def("/obj/item/clockwork/slab/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, temp_data: Value = null, i: Value = null, s: Value = null, S: Value = null, scripture_color: Value = null, temp_info: Value = null, found: Value = null, costs_components: Value = null, i_8: Value = null, really_temp_data: Value = null, i_9: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, data, temp_data, i, s, S, scripture_color, temp_info, found, costs_components, i_8, really_temp_data, i_9, $0, $e];
	rt.setAt((data = rt.list()), "components", (yield* g.callName(f, rt.sv(f, "stored_components"), "Copy", [])));
	temp_data = rt.list("<font color=#B18B25>");
	i = null;
	rt.forList(f, 0, rt.at(live(data), "components"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		temp_data = rt.modify(live(temp_data), fmt("<font color=＀>＀ <b>＀</b></font>", [(yield* g.call(f, P("/proc/get_component_color_bright"), null, [live(i)])), (yield* g.call(f, P("/proc/get_component_acronym"), null, [live(i)])), rt.index(rt.at(live(data), "components"), live(i))]), add);
		if (!isEqual(live(i), "hierophant_ansible")) {
			temp_data = rt.modify(live(temp_data), " ", add);
		} else {
			temp_data = rt.modify(live(temp_data), " (", add);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.gl("clockwork_caches"))) {
		i = null;
		rt.forList(f, 0, rt.gl("clockwork_component_cache"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			temp_data = rt.modify(live(temp_data), fmt("<font color=＀>＀ <b>＀</b></font>", [(yield* g.call(f, P("/proc/get_component_color_bright"), null, [live(i)])), (yield* g.call(f, P("/proc/get_component_acronym"), null, [live(i)])), add(rt.index(rt.at(live(data), "components"), live(i)), rt.index(rt.gl("clockwork_component_cache"), live(i)))]), add);
			if (!isEqual(live(i), "hierophant_ansible")) {
				temp_data = rt.modify(live(temp_data), " ", add);
			}
		}
		rt.endFor(f, 0);
	} else {
		temp_data = rt.modify(live(temp_data), "<b>NONE</b>", add);
	}
	temp_data = (yield* g.callName(f, (temp_data = rt.modify(live(temp_data), ")</font>", add)), "Join", []));
	rt.setAt(live(data), "components", live(temp_data));
	$0 = rt.sv(f, "selected_scripture");
	if ($0 === "Driver") {
		rt.setAt(live(data), "tier_info", "<font color=#B18B25><b>These scriptures are permenantly unlocked.</b></font>");
	} else if ($0 === "Script") {
		if (truthy(rt.index(rt.fv(f, "scripture_states", rt.gl("SSticker")), "Script"))) {
			rt.setAt(live(data), "tier_info", "<font color=#B18B25><b>These scriptures are permenantly unlocked.</b></font>");
		} else {
			rt.setAt(live(data), "tier_info", fmt("<font color=#B18B25><i>These scriptures require at least <b>＀</b> Servants and <b>＀</b> Tinkerer's Cache.</i></font>", [6, 1]));
		}
	} else if ($0 === "Application") {
		if (truthy(rt.index(rt.fv(f, "scripture_states", rt.gl("SSticker")), "Application"))) {
			rt.setAt(live(data), "tier_info", "<font color=#B18B25><b>These scriptures are permenantly unlocked.</b></font>");
		} else {
			rt.setAt(live(data), "tier_info", fmt("<font color=#B18B25><i>These scriptures require at least <b>＀</b> Servants, <b>＀</b> Tinkerer's Caches, and <b>＀CV</b>.</i></font>", [9, 3, 100]));
		}
	} else if ($0 === "Judgement") {
		if (truthy(rt.index(rt.fv(f, "scripture_states", rt.gl("SSticker")), "Judgement"))) {
			rt.setAt(live(data), "tier_info", "<font color=#B18B25><b>This scripture is permenantly unlocked.</b></font>");
		} else {
			rt.setAt(live(data), "tier_info", fmt("<font color=#B18B25><i>This scripture requires at least <b>＀</b> Servants, <b>＀</b> Tinkerer's Caches, and <b>＀CV</b>.<br>In addition, there may not be any active non-Servant AIs.</i></font>", [12, 5, 300]));
		}
	}
	rt.setAt(live(data), "selected", rt.sv(f, "selected_scripture"));
	rt.setAt(live(data), "target_comp", "<font color=#B18B25>NONE</font>");
	if (truthy(rt.sv(f, "target_component_id"))) {
		rt.setAt(live(data), "target_comp", fmt("<font color=＀>＀</font>", [(yield* g.call(f, P("/proc/get_component_color_bright"), null, [rt.sv(f, "target_component_id")])), (yield* g.call(f, P("/proc/get_component_acronym"), null, [rt.sv(f, "target_component_id")]))]));
	}
	yield* g.call(f, P("/proc/generate_all_scripture"), null, []);
	rt.setAt(live(data), "scripture", rt.list());
	s = null;
	rt.forList(f, 0, rt.gl("all_scripture"));
	while (($e = rt.next(f, 0)) !== undefined) {
		s = $e;
		if (isEqual(rt.gv(f, "tier", (S = rt.index(rt.gl("all_scripture"), live(s)))), rt.sv(f, "selected_scripture"))) {
			scripture_color = (yield* g.call(f, P("/proc/get_component_color_bright"), null, [rt.fv(f, "primary_component", live(S))]));
			temp_info = rt.alist(f, ["name", fmt("<font color=＀><b>＀</b></font>", [live(scripture_color), rt.fv(f, "name", live(S))]), "descname", fmt("<font color=＀>(＀)</font>", [live(scripture_color), rt.fv(f, "descname", live(S))]), "tip", fmt("＀\n＀", [rt.fv(f, "desc", live(S)), rt.fv(f, "usage_tip", live(S))]), "required", rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 0, "hierophant_ansible", 0]), "type", fmt("＀", [rt.fv(f, "type", live(S))]), "quickbind", rt.fv(f, "quickbind", live(S))]);
			if (truthy((found = (yield* g.callName(f, rt.sv(f, "quickbound"), "Find", [rt.fv(f, "type", live(S))]))))) {
				rt.setAt(live(temp_info), "bound", fmt("<b>＀</b>", [live(found)]));
			}
			if (rt.gt(rt.fv(f, "invokers_required", live(S)), 1)) {
				rt.setAt(live(temp_info), "invokers", fmt("<font color=#B18B25>Invokers: <b>＀</b></font>", [rt.fv(f, "invokers_required", live(S))]));
			}
			costs_components = 0;
			i_8 = null;
			rt.forList(f, 1, rt.fv(f, "consumed_components", live(S)));
			while (($e = rt.next(f, 1)) !== undefined) {
				i_8 = $e;
				if (truthy(rt.index(rt.fv(f, "consumed_components", live(S)), live(i_8)))) {
					rt.modAt(rt.at(live(temp_info), "required"), live(i_8), rt.index(rt.fv(f, "consumed_components", live(S)), live(i_8)), add);
					costs_components = 1;
				}
			}
			rt.endFor(f, 1);
			if (truthy(live(costs_components))) {
				really_temp_data = rt.list(": ");
				i_9 = null;
				rt.forList(f, 1, rt.at(live(temp_info), "required"));
				while (($e = rt.next(f, 1)) !== undefined) {
					i_9 = $e;
					if (truthy(rt.index(rt.at(live(temp_info), "required"), live(i_9)))) {
						really_temp_data = rt.modify(live(really_temp_data), fmt("<font color=＀>＀ <b>＀</b></font> ", [(yield* g.call(f, P("/proc/get_component_color_bright"), null, [live(i_9)])), (yield* g.call(f, P("/proc/get_component_acronym"), null, [live(i_9)])), rt.index(rt.at(live(temp_info), "required"), live(i_9))]), add);
					}
				}
				rt.endFor(f, 1);
				really_temp_data = (yield* g.callName(f, live(really_temp_data), "Join", []));
				rt.setAt(live(temp_info), "required", live(really_temp_data));
			} else {
				rt.setAt(live(temp_info), "required", "");
			}
			rt.modAt(live(data), "scripture", rt.list(live(temp_info)), add);
		}
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "recollection", rt.sv(f, "recollecting"));
	if (truthy(rt.sv(f, "recollecting"))) {
		rt.setAt(live(data), "rec_text", (yield* g.srcCall(f, "recollection")));
	}
	return live(data);
}, true);

// /obj/item/clockwork/slab/proc/ui_act  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:466)  may sleep
rt.def("/obj/item/clockwork/slab/proc/ui_act", function* ui_act(f: Frame) {
	let components: Value = null, i: Value = null, cache_components: Value = null, input_component: Value = null, path: Value = null, found_index: Value = null, target_index: Value = null, S: Value = null;
	let $0: any, $e: any;
	f.vars = () => [components, i, cache_components, input_component, path, found_index, target_index, S, $0, $e];
	$0 = live(f.args[0]);
	if ($0 === "toggle") {
		rt.setSv(f, "recollecting", (!truthy(rt.sv(f, "recollecting")) ? 1 : 0));
	} else if ($0 === "recite") {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/clockwork/slab/proc/recite_scripture"), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "category")])), live(f.usr), 0]);
	} else if ($0 === "select") {
		rt.setSv(f, "selected_scripture", rt.at(live(f.args[1]), "category"));
	} else if ($0 === "component") {
		components = rt.list("Random Components");
		i = null;
		rt.forList(f, 0, rt.gl("clockwork_component_cache"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			cache_components = 0;
			if (truthy(rt.gl("clockwork_caches"))) {
				cache_components = rt.index(rt.gl("clockwork_component_cache"), live(i));
			}
			rt.setAt(live(components), fmt("＀ ＀", [(yield* g.call(f, P("/proc/get_component_name"), null, [live(i)])), add(live(cache_components), rt.index(rt.sv(f, "stored_components"), live(i)))]), live(i));
		}
		rt.endFor(f, 0);
		if ((truthy((input_component = (yield* g.op(f, "Prompt", [1], [null, null, "Target Component", "Choose a component type.", live(components)])))) && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
			rt.setSv(f, "target_component_id", rt.index(live(components), live(input_component)));
		}
	} else if ($0 === "bind") {
		path = (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "category")]));
		if (truthy((found_index = (yield* g.callName(f, rt.sv(f, "quickbound"), "Find", [live(path)]))))) {
			if (isEqual(rt.length(rt.sv(f, "quickbound")), live(found_index))) {
				(rt.modSrcVar(f, "quickbound", live(path), subtract));
			} else {
				rt.setAt(rt.sv(f, "quickbound"), live(found_index), null);
			}
			yield* g.srcCall(f, "update_quickbind");
		} else {
			if ((((truthy((yield* g.call(f, P("/proc/isnum"), null, [(target_index = (yield* g.op(f, "Prompt", [33], [null, null, "Input", fmt("Position of ＀, 1 to ＀?", [rt.initial(f, live(path), "name"), rt.sv(f, "maximum_quickbound")]), null])))]))) && rt.gt(live(target_index), 0)) && rt.le(live(target_index), rt.sv(f, "maximum_quickbound"))) && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
				S = null;
				if (rt.ge(rt.length(rt.sv(f, "quickbound")), live(target_index))) {
					S = rt.index(rt.sv(f, "quickbound"), live(target_index));
				}
				if (!isEqual(live(S), live(path))) {
					yield* g.srcCall(f, "quickbind_to_slot", live(path), live(target_index));
				}
			}
		}
	}
	return 1;
}, true, { args: ["action", "params"] });

// /obj/item/clockwork/slab/proc/quickbind_to_slot  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:503)  may sleep
rt.def("/obj/item/clockwork/slab/proc/quickbind_to_slot", function* quickbind_to_slot(f: Frame, scripture: Value, index: Value) {
	let quickbind_slot: Value = null;
	f.vars = () => [scripture, index, quickbind_slot];
	if (((!truthy((yield* g.call(f, P("/proc/ispath"), null, [live(scripture)]))) || !truthy(live(scripture))) || truthy((rt.isIn(f, live(scripture), rt.sv(f, "quickbound")) ? 1 : 0)))) {
		return live(f.dot);
	}
	while (rt.lt(rt.length(rt.sv(f, "quickbound")), live(index))) {
		rt.modSrcVar(f, "quickbound", null, add);
	}
	if ((truthy((quickbind_slot = rt.index(rt.gl("all_scripture"), rt.index(rt.sv(f, "quickbound"), live(index))))) && !truthy(rt.fv(f, "quickbind", live(quickbind_slot))))) {
		return live(f.dot);
	}
	rt.setAt(rt.sv(f, "quickbound"), live(index), live(scripture));
	yield* g.srcCall(f, "update_quickbind");
	return f.dot;
}, true);

// /obj/item/clockwork/slab/proc/update_quickbind  (code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm:514)  may sleep
rt.def("/obj/item/clockwork/slab/proc/update_quickbind", function* update_quickbind(f: Frame) {
	let Q: Value = null, i: Value = null, Q_1: Value = null, quickbind_slot: Value = null, temp_desc: Value = null, c: Value = null;
	let $e: any;
	f.vars = () => [Q, i, Q_1, quickbind_slot, temp_desc, c, $e];
	Q = null;
	rt.forList(f, 0, rt.sv(f, "actions"), T("/datum/action/item_action/clock/quickbind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Q = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(Q)]);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.length(rt.sv(f, "quickbound")))) return f.dot;
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, rt.sv(f, "quickbound")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy(rt.index(rt.sv(f, "quickbound"), live(i)))) {
			continue;
		}
		rt.setFv(f, "scripture_index", (Q_1 = (yield* g.new_(f, T("/datum/action/item_action/clock/quickbind"), [live(f.src)]))), live(i));
		quickbind_slot = rt.index(rt.gl("all_scripture"), rt.index(rt.sv(f, "quickbound"), live(i)));
		rt.setFv(f, "name", live(Q_1), fmt("＀ (＀)", [rt.fv(f, "name", live(quickbind_slot)), rt.fv(f, "scripture_index", live(Q_1))]));
		temp_desc = rt.list();
		c = null;
		rt.forList(f, 1, rt.fv(f, "consumed_components", live(quickbind_slot)));
		while (($e = rt.next(f, 1)) !== undefined) {
			c = $e;
			if (truthy(rt.index(rt.fv(f, "consumed_components", live(quickbind_slot)), live(c)))) {
				temp_desc = rt.modify(live(temp_desc), fmt("<font color=＀>＀ <b>＀</b></font> ", [(yield* g.call(f, P("/proc/get_component_color_bright"), null, [live(c)])), (yield* g.call(f, P("/proc/get_component_acronym"), null, [live(c)])), rt.index(rt.fv(f, "consumed_components", live(quickbind_slot)), live(c))]), add);
			}
		}
		rt.endFor(f, 1);
		if (truthy(rt.length(live(temp_desc)))) {
			temp_desc = rt.modify(live(temp_desc), "<br>", add);
		}
		temp_desc = rt.modify(live(temp_desc), fmt("＀", [rt.fv(f, "quickbind_desc", live(quickbind_slot))]), add);
		rt.setFv(f, "desc", live(Q_1), (yield* g.callName(f, live(temp_desc), "Join", [])));
		rt.setFv(f, "button_icon_state", live(Q_1), rt.fv(f, "name", live(quickbind_slot)));
		yield* g.callName(f, live(Q_1), "UpdateButtonIcon", []);
		if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0))) {
			yield* g.callName(f, live(Q_1), "Grant", [rt.sv(f, "loc")]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
