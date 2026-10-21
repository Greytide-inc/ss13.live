// From code/game/gamemodes/clock_cult/clock_scripture.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1197, "/datum/clockwork_scripture", "/datum", {
	descname: "useless",
	name: "scripture",
	desc: "Ancient Ratvarian lore. This piece seems particularly mundane.",
	invocations: null,
	channel_time: 10,
	consumed_components: null,
	slab: null,
	invoker: null,
	whispered: 0,
	usage_tip: "This piece seems to serve no purpose and is a waste of components.",
	invokers_required: 1,
	multiple_invokers_used: 0,
	multiple_invokers_optional: 0,
	tier: "Peripheral",
	quickbind: 0,
	quickbind_desc: "This shouldn't be quickbindable. File a bug report!",
	primary_component: null,
	sort_priority: 1,
	used_slab_components: null,
	used_cache_components: null,
}, { global: { neovgre_penalty: 645, inathneq_penalty: 646, sevtug_penalty: 647, nezbere_penalty: 648, nzcrentr_penalty: 649 } });

// /datum/clockwork_scripture/proc/<init>  (code/game/gamemodes/clock_cult/clock_scripture.dm:16)
rt.def("/datum/clockwork_scripture/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list());
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 0, "hierophant_ansible", 0]));
	rt.setSv(f, "used_slab_components", rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 0, "hierophant_ansible", 0]));
	rt.setSv(f, "used_cache_components", rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 0, "hierophant_ansible", 0]));
	return f.dot;
});

// /datum/clockwork_scripture/proc/New  (code/game/gamemodes/clock_cult/clock_scripture.dm:49)
rt.def("/datum/clockwork_scripture/proc/New", function New(f: Frame) {
	rt.callSrc(f, "creation_update", []);
	return f.dot;
});

// /datum/clockwork_scripture/proc/run_scripture  (code/game/gamemodes/clock_cult/clock_scripture.dm:56)  may sleep
rt.def("/datum/clockwork_scripture/proc/run_scripture", function* run_scripture(f: Frame) {
	let successful: Value = null, i: Value = null, j: Value = null;
	let $e: any;
	f.vars = () => [successful, i, j, $e];
	successful = 0;
	if ((truthy((yield* g.srcCall(f, "can_recite"))) && truthy((yield* g.srcCall(f, "has_requirements"))))) {
		if (truthy(rt.fv(f, "busy", rt.sv(f, "slab")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), fmt("<span class='warning'>＀ refuses to work, displaying the message: \"＀!\"</span>", [rt.sv(f, "slab"), rt.fv(f, "busy", rt.sv(f, "slab"))])]);
			return 0;
		}
		rt.setFv(f, "busy", rt.sv(f, "slab"), fmt("Invocation (＀) in progress", [rt.sv(f, "name")]));
		if (truthy(rt.gl("ratvar_awakens"))) {
			(rt.modSrcVar(f, "channel_time", 0.5, multiply));
		} else {
			if (!truthy(rt.fv(f, "no_cost", rt.sv(f, "slab")))) {
				i = null;
				rt.forList(f, 0, rt.sv(f, "consumed_components"));
				while (($e = rt.next(f, 0)) !== undefined) {
					i = $e;
					if (truthy(rt.index(rt.sv(f, "consumed_components"), live(i)))) {
						j = null;
						rt.forRange(f, 1, 1, rt.index(rt.sv(f, "consumed_components"), live(i)), 1);
						while (($e = rt.next(f, 1)) !== undefined) {
							j = $e;
							if (truthy(rt.index(rt.fv(f, "stored_components", rt.sv(f, "slab")), live(i)))) {
								rt.incAt(rt.fv(f, "stored_components", rt.sv(f, "slab")), live(i), -1, true);
								rt.incAt(rt.sv(f, "used_slab_components"), live(i), 1, true);
							} else {
								rt.incAt(rt.gl("clockwork_component_cache"), live(i), -1, true);
								rt.incAt(rt.sv(f, "used_cache_components"), live(i), 1, true);
							}
						}
						rt.endFor(f, 1);
					}
				}
				rt.endFor(f, 0);
				yield* g.call(f, P("/proc/update_slab_info"), null, []);
			}
		}
		(rt.modSrcVar(f, "channel_time", rt.fv(f, "speed_multiplier", rt.sv(f, "slab")), multiply));
		if (((!truthy((yield* g.srcCall(f, "recital"))) || !truthy((yield* g.srcCall(f, "check_special_requirements")))) || !truthy((yield* g.srcCall(f, "scripture_effects"))))) {
			i = null;
			rt.forList(f, 0, rt.sv(f, "used_slab_components"));
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				if (truthy(rt.index(rt.sv(f, "used_slab_components"), live(i)))) {
					if (truthy(rt.sv(f, "slab"))) {
						rt.modAt(rt.fv(f, "stored_components", rt.sv(f, "slab")), live(i), rt.index(rt.sv(f, "consumed_components"), live(i)), add);
					} else {
						rt.modAt(rt.gl("clockwork_component_cache"), live(i), rt.index(rt.sv(f, "consumed_components"), live(i)), add);
					}
				}
			}
			rt.endFor(f, 0);
			i = null;
			rt.forList(f, 0, rt.sv(f, "used_cache_components"));
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				if (truthy(rt.index(rt.sv(f, "used_cache_components"), live(i)))) {
					rt.modAt(rt.gl("clockwork_component_cache"), live(i), rt.index(rt.sv(f, "consumed_components"), live(i)), add);
				}
			}
			rt.endFor(f, 0);
			yield* g.call(f, P("/proc/update_slab_info"), null, []);
		} else {
			successful = 1;
		}
	}
	if (truthy(rt.sv(f, "slab"))) {
		rt.setFv(f, "busy", rt.sv(f, "slab"), null);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(successful);
}, true);

// /datum/clockwork_scripture/proc/can_recite  (code/game/gamemodes/clock_cult/clock_scripture.dm:96)
rt.def("/datum/clockwork_scripture/proc/can_recite", function can_recite(f: Frame) {
	if (((!truthy(rt.sv(f, "invoker")) || !truthy(rt.sv(f, "slab"))) || !isEqual(rt.callName(f, rt.sv(f, "invoker"), "get_active_held_item", []), rt.sv(f, "slab")))) {
		return 0;
	}
	if (!truthy(rt.callName(f, rt.sv(f, "invoker"), "can_speak_vocal", []))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='warning'>You are unable to speak the words of the scripture!</span>"]);
		return 0;
	}
	return 1;
});

// /datum/clockwork_scripture/proc/has_requirements  (code/game/gamemodes/clock_cult/clock_scripture.dm:105)
rt.def("/datum/clockwork_scripture/proc/has_requirements", function has_requirements(f: Frame) {
	let checked_penalty: Value = null, component_printout: Value = null, failed: Value = null, i: Value = null, cache_components: Value = null, total_components: Value = null, nearby_servants: Value = null, L: Value = null, message: Value = null, ratvarian_prob: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $e: any;
	f.vars = () => [checked_penalty, component_printout, failed, i, cache_components, total_components, nearby_servants, L, message, ratvarian_prob, $0, $1, $2, $3, $4, $e];
	checked_penalty = 0;
	if ((!truthy(rt.gl("ratvar_awakens")) && !truthy(rt.fv(f, "no_cost", rt.sv(f, "slab"))))) {
		checked_penalty = rt.callSrc(f, "check_offstation_penalty", []);
		component_printout = "<span class='warning'>You lack the components to recite this piece of scripture!";
		failed = 0;
		i = null;
		rt.forList(f, 0, rt.sv(f, "consumed_components"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (truthy(rt.gl("clockwork_caches"))) {
				$0 = rt.index(rt.gl("clockwork_component_cache"), live(i));
			} else {
				$0 = 0;
			}
			cache_components = $0;
			total_components = add(rt.index(rt.fv(f, "stored_components", rt.sv(f, "slab")), live(i)), live(cache_components));
			if ((truthy(rt.index(rt.sv(f, "consumed_components"), live(i))) && rt.lt(live(total_components), rt.index(rt.sv(f, "consumed_components"), live(i))))) {
				$0 = rt.call(f, P("/proc/get_component_span"), null, [live(i)]);
				$1 = live(total_components);
				$2 = rt.index(rt.sv(f, "consumed_components"), live(i));
				$3 = rt.call(f, P("/proc/get_component_name"), null, [live(i)]);
				if (!isEqual(live(i), "replicant_alloy")) {
					$4 = "s";
				} else {
					$4 = "";
				}
				component_printout = rt.modify(live(component_printout), fmt("\nYou have <span class='＀_small'><b>＀/＀</b> ＀＀.</span>", [$0, $1, $2, $3, $4]), add);
				failed = 1;
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(failed))) {
			component_printout = rt.modify(live(component_printout), "</span>", add);
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), live(component_printout)]);
			return 0;
		}
	}
	if ((((truthy(rt.sv(f, "multiple_invokers_used")) && !truthy(rt.sv(f, "multiple_invokers_optional"))) && !truthy(rt.gl("ratvar_awakens"))) && !truthy(rt.fv(f, "no_cost", rt.sv(f, "slab"))))) {
		nearby_servants = 0;
		L = null;
		rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [1, rt.getStep(f, rt.sv(f, "invoker"), 0)]), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (truthy(rt.call(f, P("/proc/can_recite_scripture"), null, [live(L)]))) {
				nearby_servants = rt.inc(live(nearby_servants), 1);
			}
		}
		rt.endFor(f, 0);
		if (rt.lt(live(nearby_servants), rt.sv(f, "invokers_required"))) {
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), fmt("<span class='warning'>There aren't enough non-mute servants nearby (＀/＀)!</span>", [live(nearby_servants), rt.sv(f, "invokers_required")])]);
			return 0;
		}
	}
	if (!truthy(rt.callSrc(f, "check_special_requirements", []))) {
		return 0;
	}
	if ((truthy(live(checked_penalty)) && !truthy(rt.fv(f, "busy", rt.sv(f, "slab"))))) {
		message = null;
		ratvarian_prob = 0;
		$0 = rt.sv(f, "primary_component");
		if ($0 === "belligerent_eye") {
			message = rt.op(f, "PickUnweighted", [1], [rt.gl("neovgre_penalty")]);
			ratvarian_prob = 55;
		} else if ($0 === "vanguard_cogwheel") {
			message = rt.op(f, "PickUnweighted", [1], [rt.gl("inathneq_penalty")]);
			ratvarian_prob = 25;
		} else if ($0 === "geis_capacitor") {
			message = rt.op(f, "PickUnweighted", [1], [rt.gl("sevtug_penalty")]);
			ratvarian_prob = 40;
		} else if ($0 === "replicant_alloy") {
			message = rt.op(f, "PickUnweighted", [1], [rt.gl("nezbere_penalty")]);
			ratvarian_prob = 10;
		} else if ($0 === "hierophant_ansible") {
			message = rt.op(f, "PickUnweighted", [1], [rt.gl("nzcrentr_penalty")]);
			ratvarian_prob = 70;
		}
		if (truthy(live(message))) {
			if (truthy(rt.op(f, "Prob", [], [live(ratvarian_prob)]))) {
				message = rt.call(f, P("/proc/text2ratvar"), null, [live(message)]);
			}
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), fmt("<span class='＀_large'>\"＀\"</span>", [rt.call(f, P("/proc/get_component_span"), null, [rt.sv(f, "primary_component")]), live(message)])]);
			rt.op(f, "OutputReference", [rt.R.srcVar("invoker")], [rt.rsc("sound/magic/clockwork/invoke_general.ogg")], false);
		}
	}
	return 1;
});

// /datum/clockwork_scripture/proc/check_offstation_penalty  (code/game/gamemodes/clock_cult/clock_scripture.dm:157)
rt.def("/datum/clockwork_scripture/proc/check_offstation_penalty", function check_offstation_penalty(f: Frame) {
	let _T: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [_T, i, $e];
	if ((!truthy((_T = rt.getStep(f, rt.sv(f, "invoker"), 0))) || (((!isEqual(rt.fv(f, "z", live(_T)), 2) && !isEqual(rt.fv(f, "z", live(_T)), 1)) && !isEqual(rt.fv(f, "z", live(_T)), 5)) && !isEqual(rt.fv(f, "z", live(_T)), 5)))) {
		(rt.modSrcVar(f, "channel_time", 2, multiply));
		i = null;
		rt.forList(f, 0, rt.sv(f, "consumed_components"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (truthy(rt.index(rt.sv(f, "consumed_components"), live(i)))) {
				(rt.modAt(rt.sv(f, "consumed_components"), live(i), 2, multiply));
			}
		}
		rt.endFor(f, 0);
		return 1;
	}
	return 0;
});

// /datum/clockwork_scripture/proc/recital  (code/game/gamemodes/clock_cult/clock_scripture.dm:170)  may sleep
rt.def("/datum/clockwork_scripture/proc/recital", function* recital(f: Frame) {
	let L: Value = null, invocation: Value = null, invocation_0: Value = null, L_1: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [L, invocation, invocation_0, L_1, $0, $1, $e];
	if ((!truthy(rt.sv(f, "channel_time")) && truthy(rt.len(f, rt.sv(f, "invocations"))))) {
		if (truthy(rt.sv(f, "multiple_invokers_used"))) {
			L = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, rt.sv(f, "invoker")])), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				L = $e;
				if (truthy((yield* g.call(f, P("/proc/can_recite_scripture"), null, [live(L)])))) {
					invocation = null;
					rt.forList(f, 1, rt.sv(f, "invocations"));
					while (($e = rt.next(f, 1)) !== undefined) {
						invocation = $e;
						yield* g.call(f, P("/proc/clockwork_say"), null, [live(L), (yield* g.call(f, P("/proc/text2ratvar"), null, [live(invocation)])), rt.sv(f, "whispered")]);
					}
					rt.endFor(f, 1);
				}
			}
			rt.endFor(f, 0);
		} else {
			invocation_0 = null;
			rt.forList(f, 0, rt.sv(f, "invocations"));
			while (($e = rt.next(f, 0)) !== undefined) {
				invocation_0 = $e;
				yield* g.call(f, P("/proc/clockwork_say"), null, [rt.sv(f, "invoker"), (yield* g.call(f, P("/proc/text2ratvar"), null, [live(invocation_0)])), rt.sv(f, "whispered")]);
			}
			rt.endFor(f, 0);
		}
	}
	$0 = rt.sv(f, "invoker");
	if (rt.le(rt.sv(f, "channel_time"), 0)) {
		$1 = "recite";
	} else {
		$1 = "begin reciting";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='brass'>You ＀ a piece of scripture entitled \"＀\".</span>", [$1, rt.sv(f, "name")])]);
	if (!truthy(rt.sv(f, "channel_time"))) {
		return 1;
	}
	invocation_0 = null;
	rt.forList(f, 0, rt.sv(f, "invocations"));
	while (($e = rt.next(f, 0)) !== undefined) {
		invocation_0 = $e;
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, rt.sv(f, "invoker"), null, divide(rt.sv(f, "channel_time"), rt.len(f, rt.sv(f, "invocations"))), "target", rt.sv(f, "invoker"), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/clockwork_scripture/proc/check_special_requirements")]))], rt.Args.Named)))) {
			rt.setFv(f, "busy", rt.sv(f, "slab"), null);
			return 0;
		}
		if (truthy(rt.sv(f, "multiple_invokers_used"))) {
			L_1 = null;
			rt.forList(f, 1, (yield* g.call(f, P("/proc/range"), null, [1, rt.getStep(f, rt.sv(f, "invoker"), 0)])), T("/mob/living"));
			while (($e = rt.next(f, 1)) !== undefined) {
				L_1 = $e;
				if (truthy((yield* g.call(f, P("/proc/can_recite_scripture"), null, [live(L_1)])))) {
					yield* g.call(f, P("/proc/clockwork_say"), null, [live(L_1), (yield* g.call(f, P("/proc/text2ratvar"), null, [live(invocation_0)])), rt.sv(f, "whispered")]);
				}
			}
			rt.endFor(f, 1);
		} else {
			yield* g.call(f, P("/proc/clockwork_say"), null, [rt.sv(f, "invoker"), (yield* g.call(f, P("/proc/text2ratvar"), null, [live(invocation_0)])), rt.sv(f, "whispered")]);
		}
	}
	rt.endFor(f, 0);
	return 1;
}, true);

rt.type(1198, "/datum/clockwork_scripture/channeled", "/datum/clockwork_scripture", {
	chant_invocations: null,
	chant_amount: 5,
	chant_interval: 10,
});

// /datum/clockwork_scripture/channeled/proc/chant_effects  empty
rt.def("/datum/clockwork_scripture/channeled/proc/chant_effects", undefined, false, { args: ["chant_number"] });

// /datum/clockwork_scripture/channeled/proc/<init>  (code/game/gamemodes/clock_cult/clock_scripture.dm:199)
rt.def("/datum/clockwork_scripture/channeled/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "chant_invocations", rt.list("AYY LMAO"));
	return f.dot;
});

// /datum/clockwork_scripture/channeled/proc/check_offstation_penalty  (code/game/gamemodes/clock_cult/clock_scripture.dm:204)
rt.def("/datum/clockwork_scripture/channeled/proc/check_offstation_penalty", function check_offstation_penalty(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) return f.dot;
	(rt.modSrcVar(f, "chant_interval", 2, multiply));
	return f.dot;
});

// /datum/clockwork_scripture/channeled/proc/scripture_effects  (code/game/gamemodes/clock_cult/clock_scripture.dm:209)  may sleep
rt.def("/datum/clockwork_scripture/channeled/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "chant_amount"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, rt.sv(f, "invoker"), null, rt.sv(f, "chant_interval"), "target", rt.sv(f, "invoker"), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/clockwork_scripture/proc/can_recite")]))], rt.Args.Named)))) {
			break;
		}
		yield* g.call(f, P("/proc/clockwork_say"), null, [rt.sv(f, "invoker"), (yield* g.call(f, P("/proc/text2ratvar"), null, [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "chant_invocations")])])), rt.sv(f, "whispered")]);
		if (!truthy((yield* g.srcCall(f, "chant_effects", live(i))))) {
			break;
		}
	}
	rt.endFor(f, 0);
	if ((truthy(rt.sv(f, "invoker")) && truthy(rt.sv(f, "slab")))) {
		yield* g.srcCall(f, "chant_end_effects");
	}
	return 1;
}, true);

// /datum/clockwork_scripture/channeled/proc/chant_end_effects  (code/game/gamemodes/clock_cult/clock_scripture.dm:222)
rt.def("/datum/clockwork_scripture/channeled/proc/chant_end_effects", function chant_end_effects(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='brass'>You cease your chant.</span>"]);
	return f.dot;
});

rt.type(1203, "/datum/clockwork_scripture/create_object", "/datum/clockwork_scripture", {
	creator_message: "<span class='brass'>You create a meme.</span>",
	observer_message: null,
	one_per_tile: 0,
	prevent_path: null,
	space_allowed: 0,
	object_path: rt.typePath("/obj/item/clockwork"),
});

// /datum/clockwork_scripture/create_object/proc/New  (code/game/gamemodes/clock_cult/clock_scripture.dm:235)
rt.def("/datum/clockwork_scripture/create_object/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "prevent_path"))) return f.dot;
	rt.setSv(f, "prevent_path", rt.sv(f, "object_path"));
	return f.dot;
});

// /datum/clockwork_scripture/create_object/proc/check_special_requirements  (code/game/gamemodes/clock_cult/clock_scripture.dm:240)
rt.def("/datum/clockwork_scripture/create_object/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.getStep(f, rt.sv(f, "invoker"), 0);
	if ((!truthy(rt.sv(f, "space_allowed")) && truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='warning'>You need solid ground to place this object!</span>"]);
		return 0;
	}
	if ((truthy(rt.sv(f, "one_per_tile")) && truthy(rt.locateIn(f, rt.sv(f, "prevent_path"), live(_T))))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='warning'>You can only place one of this object on each tile!</span>"]);
		return 0;
	}
	return 1;
});

// /datum/clockwork_scripture/create_object/proc/scripture_effects  (code/game/gamemodes/clock_cult/clock_scripture.dm:250)  may sleep
rt.def("/datum/clockwork_scripture/create_object/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let O: Value = null;
	f.vars = () => [O];
	if ((truthy(rt.sv(f, "creator_message")) && truthy(rt.sv(f, "observer_message")))) {
		yield* g.callName(f, rt.sv(f, "invoker"), "visible_message", [rt.sv(f, "observer_message"), rt.sv(f, "creator_message")]);
	} else {
		if (truthy(rt.sv(f, "creator_message"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), rt.sv(f, "creator_message")]);
		}
	}
	yield* g.callName(f, (O = (yield* g.new_(f, rt.sv(f, "object_path"), [rt.getStep(f, rt.sv(f, "invoker"), 0)]))), "ratvar_act", []);
	if (truthy((rt.istype(live(O), T("/obj/item")) ? 1 : 0))) {
		yield* g.callName(f, rt.sv(f, "invoker"), "put_in_hands", [live(O)]);
	}
	return 1;
}, true);

rt.type(1224, "/datum/clockwork_scripture/ranged_ability", "/datum/clockwork_scripture", {
	slab_icon: "dread_ipad",
	ranged_message: "This is a huge goddamn bug, how'd you cast this?",
	timeout_time: 0,
	allow_mobility: 1,
	progbar: null,
	ranged_type: rt.typePath("/obj/effect/proc_holder/slab"),
});

// /datum/clockwork_scripture/ranged_ability/proc/Destroy  (code/game/gamemodes/clock_cult/clock_scripture.dm:270)  may sleep
rt.def("/datum/clockwork_scripture/ranged_ability/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "progbar")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/clockwork_scripture/ranged_ability/proc/scripture_effects  (code/game/gamemodes/clock_cult/clock_scripture.dm:275)  may sleep
rt.def("/datum/clockwork_scripture/ranged_ability/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let end_time: Value = null, successful: Value = null, _T: Value = null;
	f.vars = () => [end_time, successful, _T];
	rt.setFv(f, "icon_state", rt.sv(f, "slab"), rt.sv(f, "slab_icon"));
	rt.setFv(f, "slab_ability", rt.sv(f, "slab"), (yield* g.new_(f, rt.sv(f, "ranged_type"), [rt.sv(f, "slab")])));
	rt.setFv(f, "slab", rt.fv(f, "slab_ability", rt.sv(f, "slab")), rt.sv(f, "slab"));
	yield* g.callName(f, rt.fv(f, "slab_ability", rt.sv(f, "slab")), "add_ranged_ability", [rt.sv(f, "invoker"), rt.sv(f, "ranged_message")]);
	yield* g.callName(f, rt.sv(f, "invoker"), "update_inv_hands", []);
	end_time = add(rt.worldTime(f), rt.sv(f, "timeout_time"));
	successful = 0;
	if (truthy(rt.sv(f, "timeout_time"))) {
		rt.setSv(f, "progbar", (yield* g.new_(f, T("/datum/progressbar"), [rt.sv(f, "invoker"), rt.sv(f, "timeout_time"), rt.sv(f, "slab")])));
	}
	_T = rt.getStep(f, rt.sv(f, "invoker"), 0);
	while ((((truthy(rt.sv(f, "slab")) && truthy(rt.fv(f, "slab_ability", rt.sv(f, "slab")))) && !truthy(rt.gv(f, "finished", rt.fv(f, "slab_ability", rt.sv(f, "slab"))))) && ((truthy(rt.gv(f, "in_progress", rt.fv(f, "slab_ability", rt.sv(f, "slab")))) || !truthy(rt.sv(f, "timeout_time"))) || rt.le(rt.worldTime(f), live(end_time)))) && (truthy(rt.sv(f, "allow_mobility")) || (truthy((yield* g.srcCall(f, "can_recite"))) && isEqual(live(_T), rt.getStep(f, rt.sv(f, "invoker"), 0))))) {
		if (truthy(rt.sv(f, "progbar"))) {
			if (truthy(rt.gv(f, "in_progress", rt.fv(f, "slab_ability", rt.sv(f, "slab"))))) {
				yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "progbar")]);
			} else {
				yield* g.callName(f, rt.sv(f, "progbar"), "update", [subtract(live(end_time), rt.worldTime(f))]);
			}
		}
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	if (truthy(rt.sv(f, "slab"))) {
		if (truthy(rt.fv(f, "slab_ability", rt.sv(f, "slab")))) {
			successful = rt.gv(f, "successful", rt.fv(f, "slab_ability", rt.sv(f, "slab")));
			if (!truthy(rt.gv(f, "finished", rt.fv(f, "slab_ability", rt.sv(f, "slab"))))) {
				yield* g.callName(f, rt.fv(f, "slab_ability", rt.sv(f, "slab")), "remove_ranged_ability", []);
			}
		}
		rt.setFv(f, "icon_state", rt.sv(f, "slab"), "dread_ipad");
		if (truthy(rt.sv(f, "invoker"))) {
			yield* g.callName(f, rt.sv(f, "invoker"), "update_inv_hands", []);
		}
	}
	return live(successful);
}, true);
