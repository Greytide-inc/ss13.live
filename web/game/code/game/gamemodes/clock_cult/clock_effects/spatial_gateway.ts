// From code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11422, "/obj/effect/clockwork/spatial_gateway", "/obj/effect/clockwork", {
	sender: 1,
	both_ways: 0,
	lifetime: 25,
	uses: 1,
	linked_gateway: null,
	timerid: null,
	clockwork_desc: "A gateway in reality.",
	light_range: 2,
	light_power: 3,
	light_color: "#6A4D2F",
	name: "spatial gateway",
	desc: "A gently thrumming tear in reality.",
	icon_state: "spatial_gateway",
	density: 1,
});

// /obj/effect/clockwork/spatial_gateway/proc/Initialize  (code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm:19)  may sleep
rt.def("/obj/effect/clockwork/spatial_gateway/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/clockwork/spatial_gateway/proc/check_setup")])), 1]);
	return f.dot;
}, true);

// /obj/effect/clockwork/spatial_gateway/proc/Destroy  (code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm:23)  may sleep
rt.def("/obj/effect/clockwork/spatial_gateway/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "timerid")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/clockwork/spatial_gateway/proc/check_setup  (code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm:27)  may sleep
rt.def("/obj/effect/clockwork/spatial_gateway/proc/check_setup", function* check_setup(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "linked_gateway"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "both_ways"))) {
		rt.setSv(f, "clockwork_desc", "A gateway in reality. It can both send and receive objects.");
	} else {
		if (truthy(rt.sv(f, "sender"))) {
			$0 = "send";
		} else {
			$0 = "receive";
		}
		rt.setSv(f, "clockwork_desc", fmt("A gateway in reality. It can only ＀ objects.", [$0]));
	}
	rt.setSv(f, "timerid", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), rt.sv(f, "lifetime"), 8])));
	return f.dot;
}, true);

// /obj/effect/clockwork/spatial_gateway/proc/setup_gateway  (code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm:38)
rt.def("/obj/effect/clockwork/spatial_gateway/proc/setup_gateway", function setup_gateway(f: Frame, gatewayB: Value, set_duration: Value, set_uses: Value, two_way: Value) {
	if (((!truthy(live(gatewayB)) || !truthy(live(set_duration))) || !truthy(rt.sv(f, "uses")))) {
		return 0;
	}
	rt.setSv(f, "linked_gateway", live(gatewayB));
	rt.setFv(f, "linked_gateway", live(gatewayB), live(f.src));
	if (truthy(live(two_way))) {
		rt.setSv(f, "both_ways", 1);
		rt.setFv(f, "both_ways", live(gatewayB), 1);
	} else {
		rt.setSv(f, "sender", 1);
		rt.setFv(f, "sender", live(gatewayB), 0);
		rt.setFv(f, "density", live(gatewayB), 0);
	}
	rt.setSv(f, "lifetime", live(set_duration));
	rt.setFv(f, "lifetime", live(gatewayB), live(set_duration));
	rt.setSv(f, "uses", live(set_uses));
	rt.setFv(f, "uses", live(gatewayB), live(set_uses));
	return 1;
});

// /obj/effect/clockwork/spatial_gateway/proc/examine  (code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm:56)
rt.def("/obj/effect/clockwork/spatial_gateway/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='brass'>It has ＀ uses remaining.</span>", [rt.sv(f, "uses")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/effect/clockwork/spatial_gateway/proc/attack_ghost  (code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm:62)  may sleep
rt.def("/obj/effect/clockwork/spatial_gateway/proc/attack_ghost", function* attack_ghost(f: Frame) {
	if (truthy(rt.sv(f, "linked_gateway"))) {
		yield* g.callName(f, live(f.args[0]), "forceMove", [rt.getStep(f, rt.sv(f, "linked_gateway"), 0)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/effect/clockwork/spatial_gateway/proc/attack_hand  (code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm:66)  may sleep
rt.def("/obj/effect/clockwork/spatial_gateway/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let L: Value = null;
	f.vars = () => [user, L];
	if (!truthy(rt.sv(f, "uses"))) {
		return 0;
	}
	if (((truthy(rt.fv(f, "pulling", live(user))) && isEqual(rt.fv(f, "a_intent", live(user)), "grab")) && truthy((rt.istype(rt.fv(f, "pulling", live(user)), T("/mob/living")) ? 1 : 0)))) {
		if (((truthy(rt.gv(f, "buckled", (L = rt.fv(f, "pulling", live(user))))) || truthy(rt.fv(f, "anchored", live(L)))) || truthy((yield* g.callName(f, live(L), "has_buckled_mobs", []))))) {
			return 0;
		}
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ shoves ＀ into ＀!</span>", [live(user), live(L), live(f.src)]), fmt("<span class='danger'>You shove ＀ into ＀!</span>", [live(L), live(f.src)])]);
		yield* g.callName(f, live(user), "stop_pulling", []);
		yield* g.srcCall(f, "pass_through_gateway", live(L));
		return 1;
	}
	if (!truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src)])))) {
		return 0;
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ climbs through ＀!</span>", [live(user), live(f.src)]), fmt("<span class='danger'>You brace yourself and step through ＀...</span>", [live(f.src)])]);
	yield* g.srcCall(f, "pass_through_gateway", live(user));
	return 1;
}, true);

// /obj/effect/clockwork/spatial_gateway/proc/attackby  (code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm:83)  may sleep
rt.def("/obj/effect/clockwork/spatial_gateway/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/nullrod")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ dispels ＀ with ＀!</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='danger'>You close ＀ with ＀!</span>", [live(f.src), live(f.args[0])])]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "linked_gateway")]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 1;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clockwork/slab")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='heavy_brass'>\"I don't think you want to drop your slab into that.\"\n\"If you really want to, try throwing it.\"</span>"]);
		return 1;
	}
	if ((truthy((yield* g.callName(f, live(f.args[1]), "drop_item", []))) && truthy(rt.sv(f, "uses")))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ drops ＀ into ＀!</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='danger'>You drop ＀ into ＀!</span>", [live(f.args[0]), live(f.src)])]);
		yield* g.srcCall(f, "pass_through_gateway", live(f.args[0]), 1);
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/effect/clockwork/spatial_gateway/proc/ex_act  (code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm:98)  may sleep
rt.def("/obj/effect/clockwork/spatial_gateway/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if ((isEqual(live(severity), 1) && truthy(rt.sv(f, "uses")))) {
		rt.setSv(f, "uses", 0);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ is disrupted!</span>", [live(f.src)]));
		rt.op(f, "Animate", [2, 10], [null, live(f.src), "alpha", 0, "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 2), "time", 10, "flags", 1]);
		yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "timerid")]);
		rt.setSv(f, "timerid", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 10, 8])));
		rt.setFv(f, "uses", rt.sv(f, "linked_gateway"), 0);
		yield* g.callName(f, rt.sv(f, "linked_gateway"), "visible_message", [fmt("<span class='warning'>＀ is disrupted!</span>", [rt.sv(f, "linked_gateway")])]);
		rt.op(f, "Animate", [2, 10], [null, rt.sv(f, "linked_gateway"), "alpha", 0, "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 2), "time", 10, "flags", 1]);
		yield* g.call(f, P("/proc/deltimer"), null, [rt.fv(f, "timerid", rt.sv(f, "linked_gateway"))]);
		rt.setFv(f, "timerid", rt.sv(f, "linked_gateway"), (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), rt.sv(f, "linked_gateway")])), 10, 8])));
		return 1;
	}
	return 0;
}, true, { waitfor: false });

// /obj/effect/clockwork/spatial_gateway/proc/Bumped  (code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm:113)  may sleep
rt.def("/obj/effect/clockwork/spatial_gateway/proc/Bumped", function* Bumped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(live(f.args[0])) && !(!truthy(live(f.args[0])) || truthy(rt.fv(f, "gc_destroyed", live(f.args[0])))))) return f.dot;
	yield* g.srcCall(f, "pass_through_gateway", live(f.args[0]));
	return f.dot;
}, true, { args: ["A"] });

// /obj/effect/clockwork/spatial_gateway/proc/pass_through_gateway  (code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm:118)  may sleep
rt.def("/obj/effect/clockwork/spatial_gateway/proc/pass_through_gateway", function* pass_through_gateway(f: Frame, A: Value, no_cost: Value) {
	let user: Value = null;
	f.vars = () => [A, no_cost, user];
	if (!truthy(rt.sv(f, "linked_gateway"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 0;
	}
	if (!truthy(rt.sv(f, "sender"))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ bounces off ＀!</span>", [live(A), live(f.src)]));
		return 0;
	}
	if (!truthy(rt.sv(f, "uses"))) {
		return 0;
	}
	if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [(user = live(A)), fmt("<span class='warning'><b>You pass through ＀ and appear elsewhere!</b></span>", [live(f.src)])]);
	}
	yield* g.callName(f, rt.sv(f, "linked_gateway"), "visible_message", [fmt("<span class='warning'>A shape appears in ＀ before emerging!</span>", [rt.sv(f, "linked_gateway")])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/empulse.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "linked_gateway"), rt.rsc("sound/effects/empulse.ogg"), 50, 1]);
	rt.setSv(f, "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 1.5));
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", divide((yield* g.call(f, P("/proc/matrix"), null, [])), 1.5), "time", 10, "flags", 1]);
	rt.setFv(f, "transform", rt.sv(f, "linked_gateway"), multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 1.5));
	rt.op(f, "Animate", [2, 8], [null, rt.sv(f, "linked_gateway"), "transform", divide((yield* g.call(f, P("/proc/matrix"), null, [])), 1.5), "time", 10, "flags", 1]);
	yield* g.callName(f, live(A), "forceMove", [rt.getStep(f, rt.sv(f, "linked_gateway"), 0)]);
	if (!truthy(live(no_cost))) {
		rt.setSv(f, "uses", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "uses"), 1)])));
		rt.setFv(f, "uses", rt.sv(f, "linked_gateway"), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "uses", rt.sv(f, "linked_gateway")), 1)])));
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/clockwork/spatial_gateway/proc/check_uses")])), 10]);
	return 1;
}, true);

// /obj/effect/clockwork/spatial_gateway/proc/check_uses  (code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm:144)  may sleep
rt.def("/obj/effect/clockwork/spatial_gateway/proc/check_uses", function* check_uses(f: Frame) {
	if (truthy(rt.sv(f, "uses"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "linked_gateway")]);
	return f.dot;
}, true);

// /atom/movable/proc/procure_gateway  (code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm:150)  may sleep
rt.def("/atom/movable/proc/procure_gateway", function* procure_gateway(f: Frame, invoker: Value, time_duration: Value, gateway_uses: Value, two_way: Value) {
	let possible_targets: Value = null, teleportnames: Value = null, O: Value = null, A: Value = null, locname: Value = null, L: Value = null, input_target_key: Value = null, target: Value = null, L_4: Value = null, istargetobelisk: Value = null, issrcobelisk: Value = null, CO: Value = null, efficiency: Value = null, S1: Value = null, S2: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $e: any;
	f.vars = () => [invoker, time_duration, gateway_uses, two_way, possible_targets, teleportnames, O, A, locname, L, input_target_key, target, L_4, istargetobelisk, issrcobelisk, CO, efficiency, S1, S2, $0, $1, $2, $3, $4, $5, $6, $e];
	possible_targets = rt.list();
	teleportnames = rt.list();
	O = null;
	rt.forList(f, 0, rt.gl("all_clockwork_objects"), T("/obj/structure/destructible/clockwork/powered/clockwork_obelisk"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((((!truthy((yield* g.callName(f, live(O), "Adjacent", [live(invoker)]))) && !isEqual(live(O), live(f.src))) && rt.le(rt.fv(f, "z", live(O)), 12)) && truthy(rt.fv(f, "anchored", live(O))))) {
			A = (yield* g.call(f, P("/proc/get_area"), null, [live(O)]));
			locname = rt.initial(f, live(A), "name");
			rt.setAt(live(possible_targets), (yield* g.call(f, P("/proc/avoid_assoc_duplicate_keys"), null, [fmt("＀ ＀", [live(locname), rt.fv(f, "name", live(O))]), live(teleportnames)])), live(O));
		}
	}
	rt.endFor(f, 0);
	L = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((((!truthy(rt.fv(f, "stat", live(L))) && truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)])))) && !truthy((yield* g.callName(f, live(L), "Adjacent", [live(invoker)])))) && rt.le(rt.fv(f, "z", live(L)), 12))) {
			rt.setAt(live(possible_targets), (yield* g.call(f, P("/proc/avoid_assoc_duplicate_keys"), null, [fmt("＀ (＀)", [rt.fv(f, "name", live(L)), rt.fv(f, "real_name", live(L))]), live(teleportnames)])), live(L));
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(possible_targets)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(invoker), "<span class='warning'>There are no other eligible targets for a Spatial Gateway!</span>"]);
		return 0;
	}
	input_target_key = (yield* g.op(f, "Prompt", [1], [null, "Spatial Gateway", "Choose a target to form a rift to.", live(invoker), live(possible_targets)]));
	target = rt.index(live(possible_targets), live(input_target_key));
	if (((((((!truthy(live(f.src)) || !truthy(live(input_target_key))) || !truthy(live(invoker))) || !truthy((yield* g.callName(f, live(invoker), "canUseTopic", [live(f.src), (!truthy((rt.istype(live(invoker), T("/mob/living/silicon")) ? 1 : 0)) ? 1 : 0)])))) || !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(invoker)])))) || (truthy((rt.istype(live(f.src), T("/obj/item")) ? 1 : 0)) && !isEqual((yield* g.callName(f, live(invoker), "get_active_held_item", [])), live(f.src)))) || !truthy((yield* g.callName(f, live(invoker), "can_speak_vocal", []))))) {
		return 0;
	}
	if (!truthy(live(target))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(invoker), "<span class='warning'>That target no longer exists!</span>"]);
		return (yield* g.srcCall(f, "procure_gateway", live(invoker), live(time_duration), live(gateway_uses), live(two_way)));
	}
	if (truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) {
		if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [(L_4 = live(target))])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(invoker), "<span class='warning'>That target is no longer a Servant!</span>"]);
			return (yield* g.srcCall(f, "procure_gateway", live(invoker), live(time_duration), live(gateway_uses), live(two_way)));
		}
		if (!isEqual(rt.fv(f, "stat", live(L_4)), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(invoker), "<span class='warning'>That Servant is no longer conscious!</span>"]);
			return (yield* g.srcCall(f, "procure_gateway", live(invoker), live(time_duration), live(gateway_uses), live(two_way)));
		}
	}
	istargetobelisk = (rt.istype(live(target), T("/obj/structure/destructible/clockwork/powered/clockwork_obelisk")) ? 1 : 0);
	if (truthy((issrcobelisk = (rt.istype(live(f.src), T("/obj/structure/destructible/clockwork/powered/clockwork_obelisk")) ? 1 : 0)))) {
		if (!truthy(rt.sv(f, "anchored"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(invoker), fmt("<span class='warning'>＀ is no longer secured!</span>", [live(f.src)])]);
			return 0;
		}
		if (truthy(rt.gv(f, "active", (CO = live(f.src))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(invoker), fmt("<span class='warning'>＀ is now sustaining a gateway!</span>", [live(f.src)])]);
			return 0;
		}
	}
	if (truthy(live(istargetobelisk))) {
		if (!truthy(rt.fv(f, "anchored", live(target)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(invoker), fmt("<span class='warning'>That ＀ is no longer secured!</span>", [rt.fv(f, "name", live(target))])]);
			return (yield* g.srcCall(f, "procure_gateway", live(invoker), live(time_duration), live(gateway_uses), live(two_way)));
		}
		if (truthy(rt.gv(f, "active", (CO = live(target))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(invoker), fmt("<span class='warning'>That ＀ is sustaining a gateway, and cannot receive another!</span>", [rt.fv(f, "name", live(target))])]);
			return (yield* g.srcCall(f, "procure_gateway", live(invoker), live(time_duration), live(gateway_uses), live(two_way)));
		}
		efficiency = (yield* g.callName(f, live(CO), "get_efficiency_mod", []));
		gateway_uses = (yield* g.call(f, P("/proc/round"), null, [multiply(live(gateway_uses), multiply(2, live(efficiency))), 1]));
		time_duration = (yield* g.call(f, P("/proc/round"), null, [multiply(live(time_duration), multiply(2, live(efficiency))), 1]));
		rt.setFv(f, "active", live(CO), 1);
	}
	$0 = live(invoker);
	$1 = fmt("<span class='warning'>The air in front of ＀ ripples before suddenly tearing open!</span>", [live(invoker)]);
	if (truthy(live(two_way))) {
		$2 = "two-way";
	} else {
		$2 = "one-way";
	}
	$3 = live(input_target_key);
	$4 = divide(live(time_duration), 10);
	$5 = live(gateway_uses);
	if (rt.gt(live(gateway_uses), 1)) {
		$6 = "s";
	} else {
		$6 = "";
	}
	yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='brass'>With a word, you rip open a ＀ rift to ＀. It will last for ＀ seconds and has ＀ use＀.</span>", [$2, $3, $4, $5, $6])]);
	if (truthy(live(issrcobelisk))) {
		$0 = rt.getStep(f, live(f.src), 0);
	} else {
		$0 = rt.getStep(f, rt.getStep(f, live(invoker), 0), rt.fv(f, "dir", live(invoker)));
	}
	S1 = (yield* g.new_(f, T("/obj/effect/clockwork/spatial_gateway"), [$0]));
	if (truthy(live(istargetobelisk))) {
		$0 = rt.getStep(f, live(target), 0);
	} else {
		$0 = rt.getStep(f, rt.getStep(f, live(target), 0), rt.fv(f, "dir", live(target)));
	}
	S2 = (yield* g.new_(f, T("/obj/effect/clockwork/spatial_gateway"), [$0]));
	yield* g.callName(f, live(S1), "setup_gateway", [live(S2), live(time_duration), live(gateway_uses), live(two_way)]);
	yield* g.callName(f, live(S2), "visible_message", [fmt("<span class='warning'>The air in front of ＀ ripples before suddenly tearing open!</span>", [live(target)])]);
	return 1;
}, true);
