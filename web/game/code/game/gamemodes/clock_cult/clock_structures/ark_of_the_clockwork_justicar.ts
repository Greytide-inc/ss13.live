// From code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12150, "/obj/structure/destructible/clockwork/massive/celestial_gateway", "/obj/structure/destructible/clockwork/massive", {
	progress_in_seconds: 0,
	purpose_fulfilled: 0,
	first_sound_played: 0,
	second_sound_played: 0,
	third_sound_played: 0,
	fourth_sound_played: 0,
	glow: null,
	countdown: null,
	required_components: null,
	clockwork_desc: "A portal to the Celestial Derelict. Massive and intimidating, it is the only thing that can both transport Ratvar and withstand the massive amount of energy he emits.",
	can_be_repaired: 0,
	immune_to_servant_attacks: 1,
	name: "ark of the Clockwork Justicar",
	desc: "A massive, thrumming rip in spacetime.",
	obj_integrity: 500,
	max_integrity: 500,
	mouse_opacity: 2,
	icon: rt.rsc("icons/effects/clockwork_effects.dmi"),
	icon_state: "nothing",
	density: 0,
	invisibility: 100,
	resistance_flags: 98,
});

// /obj/structure/destructible/clockwork/massive/celestial_gateway/proc/<init>  (code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm:24)
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_components", rt.alist(f, ["belligerent_eye", 15, "vanguard_cogwheel", 15, "geis_capacitor", 15, "replicant_alloy", 15, "hierophant_ansible", 15]));
	return f.dot;
});

// /obj/structure/destructible/clockwork/massive/celestial_gateway/proc/Initialize  (code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm:27)
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/spawn_animation")]);
	return f.dot;
});

// /obj/structure/destructible/clockwork/massive/celestial_gateway/proc/spawn_animation  (code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm:31)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/spawn_animation", function* spawn_animation(f: Frame) {
	let _T: Value = null, open_turfs: Value = null, OT: Value = null, L: Value = null, gate_area: Value = null;
	let $e: any;
	f.vars = () => [_T, open_turfs, OT, L, gate_area, $e];
	yield* g.new_(f, T("/obj/effect/clockwork/general_marker/inathneq"), [(_T = rt.getStep(f, live(f.src), 0))]);
	yield* g.call(f, P("/proc/hierophant_message"), null, [fmt("<span class='inathneq'>\"＀!\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, ["Engine, come forth and show your servants your mercy"]))])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 30, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	yield* g.new_(f, T("/obj/effect/clockwork/general_marker/sevtug"), [live(_T)]);
	yield* g.call(f, P("/proc/hierophant_message"), null, [fmt("<span class='sevtug'>\"＀!\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, ["Engine, come forth and show this station your decorating skills"]))])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 45, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	yield* g.new_(f, T("/obj/effect/clockwork/general_marker/nezbere"), [live(_T)]);
	yield* g.call(f, P("/proc/hierophant_message"), null, [fmt("<span class='nezbere'>\"＀!!\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, ["Engine, come forth and shine your light across this realm"]))])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 60, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	yield* g.new_(f, T("/obj/effect/clockwork/general_marker/nzcrentr"), [live(_T)]);
	yield* g.call(f, P("/proc/hierophant_message"), null, [fmt("<span class='nzcrentr'>\"＀.\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, ["Engine, come forth"]))])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 75, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 100, 0]);
	open_turfs = rt.list();
	OT = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, live(_T)])), T("/turf/open"));
	while (($e = rt.next(f, 0)) !== undefined) {
		OT = $e;
		if (!truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(OT), 1])))) {
			(open_turfs = rt.modify(live(open_turfs), live(OT), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(open_turfs)))) {
		L = null;
		rt.forList(f, 0, live(_T), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			yield* g.callName(f, live(L), "forceMove", [rt.op(f, "PickUnweighted", [1], [live(open_turfs)])]);
		}
		rt.endFor(f, 0);
	}
	(rt.modSrcVar(f, "resistance_flags", 16777151, rt.bitAnd));
	rt.setSv(f, "density", 1);
	rt.setSv(f, "invisibility", 0);
	rt.setSv(f, "glow", (yield* g.new_(f, T("/obj/effect/clockwork/overlay/gateway_glow"), [rt.getStep(f, live(f.src), 0)])));
	rt.setSv(f, "countdown", (yield* g.new_(f, T("/obj/effect/countdown/clockworkgate"), [live(f.src)])));
	yield* g.callName(f, rt.sv(f, "countdown"), "start", []);
	yield* g.call(f, P("/proc/hierophant_message"), null, [fmt("<span class='large_brass'><b>An Ark of the Clockwork Justicar has been created in ＀!</b></span>", [rt.gv(f, "map_name", (gate_area = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))))]), 0, live(f.src)]);
	yield* g.callName(f, rt.gl("SSshuttle"), "registerHostileEnvironment", [live(f.src)]);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/massive/celestial_gateway/proc/Destroy  (code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm:68)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/Destroy", function* Destroy(f: Frame) {
	let gate_area: Value = null, was_stranded: Value = null;
	f.vars = () => [gate_area, was_stranded];
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), subtract));
	if (!truthy(rt.sv(f, "purpose_fulfilled"))) {
		yield* g.call(f, P("/proc/hierophant_message"), null, [fmt("<span class='large_brass'><b>An Ark of the Clockwork Justicar has fallen at ＀!</b></span>", [rt.gv(f, "map_name", (gate_area = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))))])]);
		yield* g.call(f, P("/proc/send_to_playing_players"), null, [(yield* g.call(f, P("/proc/sound"), null, [null, null, null, 0, "channel", 1020], rt.Args.Named))]);
	}
	was_stranded = (isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "stranded") ? 1 : 0);
	yield* g.callName(f, rt.gl("SSshuttle"), "clearHostileEnvironment", [live(f.src)]);
	if ((!truthy(live(was_stranded)) && !truthy(rt.sv(f, "purpose_fulfilled")))) {
		yield* g.call(f, P("/proc/priority_announce"), null, ["Massive energy anomaly no longer on short-range scanners.", "Anomaly Alert"]);
	}
	if (truthy(rt.sv(f, "glow"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "glow")]);
		rt.setSv(f, "glow", null);
	}
	if (truthy(rt.sv(f, "countdown"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "countdown")]);
		rt.setSv(f, "countdown", null);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/massive/celestial_gateway/proc/deconstruct  (code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm:86)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (!truthy(live(disassembled))) {
			(rt.modSrcVar(f, "resistance_flags", 64, rt.bitOr));
			yield* g.callName(f, rt.sv(f, "countdown"), "stop", []);
			yield* g.srcCall(f, "visible_message", fmt("<span class='userdanger'>＀ begins to pulse uncontrollably... you might want to run!</span>", [live(f.src)]));
			yield* g.call(f, P("/proc/send_to_playing_players"), null, [(yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/effects/clockcult_gateway_disrupted.ogg"), null, 0, "channel", 1020, "volume", 50], rt.Args.Named))]);
			yield* g.srcCall(f, "make_glow");
			rt.setFv(f, "icon_state", rt.sv(f, "glow"), "clockwork_gateway_disrupted");
			(rt.modSrcVar(f, "resistance_flags", 64, rt.bitOr));
			yield* g.call(f, P("/proc/sleep"), null, [27]);
			yield* g.call(f, P("/proc/explosion"), null, [live(f.src), 1, 3, 8, 8]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/massive/celestial_gateway/proc/make_glow  (code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm:100)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/make_glow", function* make_glow(f: Frame) {
	if (truthy(rt.sv(f, "glow"))) return f.dot;
	rt.setSv(f, "glow", (yield* g.new_(f, T("/obj/effect/clockwork/overlay/gateway_glow"), [rt.getStep(f, live(f.src), 0)])));
	rt.setFv(f, "linked", rt.sv(f, "glow"), live(f.src));
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/massive/celestial_gateway/proc/ex_act  (code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm:105)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	let damage: Value = null;
	f.vars = () => [severity, damage];
	yield* g.srcCall(f, "take_damage", (damage = (yield* g.call(f, P("/proc/max"), null, [divide(multiply(rt.sv(f, "obj_integrity"), 0.699999988079071), live(severity)), 100]))), "brute", "bomb", 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/destructible/clockwork/massive/celestial_gateway/proc/attackby  (code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm:109)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null, S: Value = null, used_components: Value = null, used_all: Value = null, i: Value = null, to_use: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [C, S, used_components, used_all, i, to_use, $0, $1, $2, $3, $e];
	if ((!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])]))) || !truthy((yield* g.srcCall(f, "still_needs_components"))))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clockwork/component")) ? 1 : 0))) {
		C = live(f.args[0]);
		if (truthy(rt.index(rt.sv(f, "required_components"), rt.fv(f, "component_id", live(C))))) {
			rt.incAt(rt.sv(f, "required_components"), rt.fv(f, "component_id", live(C)), -1, true);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to ＀.</span>", [live(C), live(f.src)])]);
			yield* g.callName(f, live(f.args[1]), "drop_item", []);
			yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
		} else {
			$0 = live(f.args[1]);
			$1 = live(f.src);
			$2 = (yield* g.call(f, P("/proc/get_component_name"), null, [rt.fv(f, "component_id", live(C))]));
			if (!isEqual(rt.fv(f, "component_id", live(C)), "replicant_alloy")) {
				$3 = "s";
			} else {
				$3 = "";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ has enough ＀＀.</span>", [$1, $2, $3])]);
		}
		return 1;
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clockwork/slab")) ? 1 : 0))) {
			S = live(f.args[0]);
			used_components = 0;
			used_all = 1;
			i = null;
			rt.forList(f, 0, rt.fv(f, "stored_components", live(S)));
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				if (truthy(rt.index(rt.sv(f, "required_components"), live(i)))) {
					to_use = (yield* g.call(f, P("/proc/min"), null, [rt.index(rt.fv(f, "stored_components", live(S)), live(i)), rt.index(rt.sv(f, "required_components"), live(i))]));
					(rt.modAt(rt.sv(f, "required_components"), live(i), live(to_use), subtract));
					(rt.modAt(rt.fv(f, "stored_components", live(S)), live(i), live(to_use), subtract));
					if (truthy(live(to_use))) {
						used_components = 1;
					}
					if (truthy(rt.index(rt.fv(f, "stored_components", live(S)), live(i)))) {
						used_all = 0;
					}
				}
			}
			rt.endFor(f, 0);
			if (truthy(live(used_components))) {
				yield* g.call(f, P("/proc/update_slab_info"), null, [live(S)]);
				$0 = live(f.args[1]);
				$1 = live(f.args[1]);
				if (truthy(live(used_all))) {
					$1 = $1;
					$2 = "";
				} else {
					$2 = " partially";
				}
				$1 = fmt("<span class='notice'>＀＀ empties ＀ into ＀.</span>", [$1, $2, live(S), live(f.src)]);
				if (truthy(live(used_all))) {
					$2 = "all";
				} else {
					$2 = "some";
				}
				yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You offload ＀ of your slab's components into ＀.</span>", [$2, live(f.src)])]);
			}
			return 1;
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/destructible/clockwork/massive/celestial_gateway/proc/still_needs_components  (code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm:143)
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/still_needs_components", function still_needs_components(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forList(f, 0, rt.sv(f, "required_components"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(rt.index(rt.sv(f, "required_components"), live(i)))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/structure/destructible/clockwork/massive/celestial_gateway/proc/get_arrival_text  (code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm:148)
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/get_arrival_text", function get_arrival_text(f: Frame, s_on_time: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	f.dot = "IMMINENT";
	if (!truthy(rt.sv(f, "obj_integrity"))) {
		f.dot = "DETONATING";
	} else {
		if (!rt.gt(subtract(300, rt.sv(f, "progress_in_seconds")), 0)) return f.dot;
		$0 = rt.call(f, P("/proc/round"), null, [rt.call(f, P("/proc/max"), null, [divide(subtract(300, rt.sv(f, "progress_in_seconds")), 1), 0]), 1]);
		if (truthy(live(s_on_time))) {
			$1 = "S";
		} else {
			$1 = "";
		}
		f.dot = fmt("＀＀", [$0, $1]);
	}
	return f.dot;
});

// /obj/structure/destructible/clockwork/massive/celestial_gateway/proc/examine  (code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm:155)
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/examine", function examine(f: Frame) {
	let i: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [i, $0, $1, $2, $3, $e];
	rt.setSv(f, "icon_state", "spatial_gateway");
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	if ((truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) {
		if (truthy(rt.callSrc(f, "still_needs_components", []))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='big'><b>Components required until activation:</b></span>"]);
			i = null;
			rt.forList(f, 0, rt.sv(f, "required_components"));
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				if (truthy(rt.index(rt.sv(f, "required_components"), live(i)))) {
					$0 = live(f.args[0]);
					$1 = rt.call(f, P("/proc/get_component_span"), null, [live(i)]);
					$2 = rt.call(f, P("/proc/get_component_name"), null, [live(i)]);
					if (!isEqual(live(i), "replicant_alloy")) {
						$3 = "s";
					} else {
						$3 = "";
					}
					rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='＀'>＀＀:</span> <span class='＀_large'>＀</span>", [$1, $2, $3, rt.call(f, P("/proc/get_component_span"), null, [live(i)]), rt.index(rt.sv(f, "required_components"), live(i))])]);
				}
			}
			rt.endFor(f, 0);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='big'><b>Seconds until Ratvar's arrival:</b> ＀</span>", [rt.callSrc(f, "get_arrival_text", [1])])]);
			$0 = rt.sv(f, "progress_in_seconds");
			if (rt.inRange($0, -9.999999848243207e+30, 119)) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>It's still opening.</span>"]);
			} else if (rt.inRange($0, 119, 239)) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>It's reached the Celestial Derelict and is drawing power from it.</span>"]);
			} else if (rt.inRange($0, 239, 9.999999848243207e+30)) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>Ratvar is coming through the gateway!</span>"]);
			}
		}
	} else {
		$0 = rt.sv(f, "progress_in_seconds");
		if (rt.inRange($0, -9.999999848243207e+30, 119)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It's a swirling mass of blackness.</span>"]);
		} else if (rt.inRange($0, 119, 239)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It seems to be leading somewhere.</span>"]);
		} else if (rt.inRange($0, 239, 9.999999848243207e+30)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='boldwarning'>Something is coming through!</span>"]);
		}
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/destructible/clockwork/massive/celestial_gateway/proc/process  (code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm:184)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/process", function* process(f: Frame) {
	let M: Value = null, convert_dist: Value = null, t: Value = null, _T: Value = null, W: Value = null, dist: Value = null, used_components: Value = null, i: Value = null, to_use: Value = null, O: Value = null, gate_area: Value = null, startpoint: Value = null, x0: Value = null, y0: Value = null, I: Value = null, _T_5: Value = null, dist_6: Value = null;
	let $0: any, $e: any;
	f.vars = () => [M, convert_dist, t, _T, W, dist, used_components, i, to_use, O, gate_area, startpoint, x0, y0, I, _T_5, dist_6, $0, $e];
	if ((!truthy(rt.sv(f, "first_sound_played")) || truthy(rt.op(f, "Prob", [], [7])))) {
		M = null;
		rt.forList(f, 0, rt.gl("player_list"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if ((truthy(live(M)) && !truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'><b>You hear otherworldly sounds from the ＀...</span>", [(yield* g.call(f, P("/proc/dir2text"), null, [rt.getDir(f, rt.getStep(f, live(M), 0), rt.getStep(f, live(f.src), 0))]))])]);
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "obj_integrity"))) {
		return 0;
	}
	convert_dist = add(1, (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.call(f, P("/proc/Floor"), null, [rt.sv(f, "progress_in_seconds"), 15])), 0.06700000166893005)])));
	t = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", rt.sv(f, "loc")), live(convert_dist)), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", rt.sv(f, "loc")), live(convert_dist)), 1])), rt.fv(f, "z", rt.sv(f, "loc"))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", rt.sv(f, "loc")), live(convert_dist)), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", rt.sv(f, "loc")), live(convert_dist)), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", rt.sv(f, "loc")))])));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if (!truthy((_T = live(t)))) {
			continue;
		}
		if (rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [live(_T), live(f.src)])), 2)) {
			if (truthy((rt.istype(live(_T), T("/turf/closed/wall")) ? 1 : 0))) {
				yield* g.callName(f, (W = live(_T)), "dismantle_wall", []);
			} else {
				if ((truthy(live(t)) && (truthy((rt.istype(live(_T), T("/turf/closed")) ? 1 : 0)) || !truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(_T)])))))) {
					yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/open/floor/clockwork")]);
				}
			}
		}
		if (rt.lt((dist = (yield* g.call(f, P("/proc/cheap_hypotenuse"), null, [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.sv(f, "x"), rt.sv(f, "y")]))), live(convert_dist))) {
			yield* g.callName(f, live(_T), "ratvar_act", [0, 1, 3]);
		}
	}
	rt.endFor(f, 0);
	if (truthy((yield* g.srcCall(f, "still_needs_components")))) {
		if (!truthy(rt.sv(f, "first_sound_played"))) {
			yield* g.call(f, P("/proc/priority_announce"), null, ["Massive energy anomaly detected on short-range scanners. Attempting to triangulate location...", "Anomaly Alert"]);
			yield* g.call(f, P("/proc/send_to_playing_players"), null, [(yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/effects/clockcult_gateway_charging.ogg"), null, 1, "channel", 1020, "volume", 10], rt.Args.Named))]);
			rt.setSv(f, "first_sound_played", 1);
		}
		yield* g.srcCall(f, "make_glow");
		rt.setFv(f, "icon_state", rt.sv(f, "glow"), "clockwork_gateway_components");
		used_components = 0;
		i = null;
		rt.forList(f, 0, rt.sv(f, "required_components"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (truthy(rt.index(rt.sv(f, "required_components"), live(i)))) {
				to_use = (yield* g.call(f, P("/proc/min"), null, [rt.index(rt.gl("clockwork_component_cache"), live(i)), rt.index(rt.sv(f, "required_components"), live(i))]));
				(rt.modAt(rt.sv(f, "required_components"), live(i), live(to_use), subtract));
				(rt.modAt(rt.gl("clockwork_component_cache"), live(i), live(to_use), subtract));
				if (truthy(live(to_use))) {
					used_components = 1;
				}
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(used_components))) {
			yield* g.call(f, P("/proc/update_slab_info"), null, []);
		}
		if (truthy((yield* g.srcCall(f, "still_needs_components")))) {
			return live(f.dot);
		}
	}
	O = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, live(f.src)])), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (((!truthy(rt.fv(f, "pulledby", live(O))) && !truthy((rt.istype(live(O), T("/obj/effect")) ? 1 : 0))) && truthy(rt.fv(f, "density", live(O))))) {
			if ((!truthy((yield* g.call(f, P("/proc/step_away"), null, [live(O), live(f.src), 2]))) || rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [live(O), live(f.src)])), 2))) {
				yield* g.callName(f, live(O), "take_damage", [50, "fire", "bomb"]);
			}
			yield* g.callName(f, live(O), "update_icon", []);
		}
	}
	rt.endFor(f, 0);
	$0 = (rt.modSrcVar(f, "progress_in_seconds", 1, add));
	if (rt.inRange($0, -9.999999848243207e+30, 119)) {
		if (!truthy(rt.sv(f, "second_sound_played"))) {
			yield* g.call(f, P("/proc/send_to_playing_players"), null, [(yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/effects/clockcult_gateway_charging.ogg"), null, 1, "channel", 1020, "volume", 30], rt.Args.Named))]);
			rt.setSv(f, "second_sound_played", 1);
		}
		yield* g.srcCall(f, "make_glow");
		rt.setFv(f, "icon_state", rt.sv(f, "glow"), "clockwork_gateway_charging");
	} else if (rt.inRange($0, 119, 239)) {
		if (!truthy(rt.sv(f, "third_sound_played"))) {
			yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Location of massive energy anomaly has been triangulated. Location: ＀.", [rt.gv(f, "map_name", (gate_area = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))))]), "Anomaly Alert"]);
			yield* g.call(f, P("/proc/send_to_playing_players"), null, [(yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/effects/clockcult_gateway_active.ogg"), null, 1, "channel", 1020, "volume", 35], rt.Args.Named))]);
			rt.setSv(f, "third_sound_played", 1);
		}
		yield* g.srcCall(f, "make_glow");
		rt.setFv(f, "icon_state", rt.sv(f, "glow"), "clockwork_gateway_active");
	} else if (rt.inRange($0, 239, 300)) {
		if (!truthy(rt.sv(f, "fourth_sound_played"))) {
			yield* g.call(f, P("/proc/send_to_playing_players"), null, [(yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/effects/clockcult_gateway_closing.ogg"), null, 1, "channel", 1020, "volume", 40], rt.Args.Named))]);
			rt.setSv(f, "fourth_sound_played", 1);
		}
		yield* g.srcCall(f, "make_glow");
		rt.setFv(f, "icon_state", rt.sv(f, "glow"), "clockwork_gateway_closing");
	} else if (rt.inRange($0, 300, 9.999999848243207e+30)) {
		if (truthy(rt.sv(f, "purpose_fulfilled"))) return f.dot;
		yield* g.callName(f, rt.sv(f, "countdown"), "stop", []);
		(rt.modSrcVar(f, "resistance_flags", 64, rt.bitOr));
		rt.setSv(f, "purpose_fulfilled", 1);
		yield* g.srcCall(f, "make_glow");
		rt.op(f, "Animate", [2, 8], [null, rt.sv(f, "glow"), "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 1.5), "alpha", 255, "time", 125]);
		yield* g.call(f, P("/proc/send_to_playing_players"), null, [(yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/effects/ratvar_rises.ogg"), null, 0, "channel", 1020], rt.Args.Named))]);
		yield* g.call(f, P("/proc/sleep"), null, [125]);
		yield* g.srcCall(f, "make_glow");
		rt.op(f, "Animate", [2, 8], [null, rt.sv(f, "glow"), "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 3), "alpha", 0, "time", 5]);
		startpoint = rt.getStep(f, live(f.src), 0);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 3, 8]);
		yield* g.call(f, P("/proc/sleep"), null, [3]);
		rt.setGl("clockwork_gateway_activated", 1);
		yield* g.new_(f, T("/obj/structure/destructible/clockwork/massive/ratvar"), [live(startpoint)]);
		yield* g.call(f, P("/proc/send_to_playing_players"), null, [fmt("<span class='inathneq_large'>\"＀!\"</span>\n<span class='sevtug_large'>\"＀!\"</span>\n<span class='nezbere_large'>\"＀!!\"</span>\n<span class='nzcrentr_large'>\"＀.\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, ["See Engine's mercy"])), (yield* g.call(f, P("/proc/text2ratvar"), null, ["Observe Engine's design skills"])), (yield* g.call(f, P("/proc/text2ratvar"), null, ["Behold Engine's light"])), (yield* g.call(f, P("/proc/text2ratvar"), null, ["Gaze upon Engine's power"]))])]);
		yield* g.call(f, P("/proc/send_to_playing_players"), null, [rt.rsc("sound/magic/clockwork/invoke_general.ogg")]);
		x0 = rt.fv(f, "x", live(startpoint));
		y0 = rt.fv(f, "y", live(startpoint));
		I = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/spiral_range_turfs"), null, [255, live(startpoint)])));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (!truthy((_T_5 = live(I)))) {
				continue;
			}
			if (rt.lt((dist_6 = (yield* g.call(f, P("/proc/cheap_hypotenuse"), null, [rt.fv(f, "x", live(_T_5)), rt.fv(f, "y", live(_T_5)), live(x0), live(y0)]))), 100)) {
				dist_6 = 1;
			} else {
				dist_6 = 0;
			}
			yield* g.callName(f, live(_T_5), "ratvar_act", [live(dist_6), 1]);
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true, { waitfor: false });
