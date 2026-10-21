// From code/game/gamemodes/clock_cult/clock_structures/clockwork_obelisk.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12153, "/obj/structure/destructible/clockwork/powered/clockwork_obelisk", "/obj/structure/destructible/clockwork/powered", {
	hierophant_cost: 25,
	gateway_cost: 2000,
	clockwork_desc: "A powerful obelisk that can send a message to all servants or open a gateway to a target servant or clockwork obelisk.",
	active_icon: "obelisk",
	inactive_icon: "obelisk_inactive",
	unanchored_icon: "obelisk_unwrenched",
	construction_value: 20,
	name: "clockwork obelisk",
	desc: "A large brass obelisk hanging in midair.",
	icon_state: "obelisk_inactive",
	max_integrity: 150,
	obj_integrity: 150,
	break_message: "<span class='warning'>The obelisk falls to the ground, undamaged!</span>",
	debris: null,
});

// /obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/<init>  (code/game/gamemodes/clock_cult/clock_structures/clockwork_obelisk.dm:14)
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "debris", rt.alist(f, [T("/obj/item/clockwork/alloy_shards/small"), 4, T("/obj/item/clockwork/alloy_shards/medium"), 2, T("/obj/item/clockwork/component/hierophant_ansible/obelisk"), 1]));
	return f.dot;
});

// /obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/Initialize  (code/game/gamemodes/clock_cult/clock_structures/clockwork_obelisk.dm:21)
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "toggle", [1]);
	return f.dot;
});

// /obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/examine  (code/game/gamemodes/clock_cult/clock_structures/clockwork_obelisk.dm:25)
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='nzcrentr_small'>It requires <b>＀W</b> to broadcast over the Hierophant Network, and <b>＀W</b> to open a Spatial Gateway.</span>", [rt.sv(f, "hierophant_cost"), rt.sv(f, "gateway_cost")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/can_be_unfasten_wrench  (code/game/gamemodes/clock_cult/clock_structures/clockwork_obelisk.dm:31)
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		if (!truthy(live(f.args[1]))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ is currently sustaining a gateway!</span>", [live(f.src)])]);
		}
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user", "silent"] });

// /obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/forced_disable  (code/game/gamemodes/clock_cult/clock_structures/clockwork_obelisk.dm:38)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/forced_disable", function* forced_disable(f: Frame, bad_effects: Value) {
	let affected: Value = null, SG: Value = null;
	let $e: any;
	f.vars = () => [bad_effects, affected, SG, $e];
	affected = 0;
	SG = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/effect/clockwork/spatial_gateway"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SG = $e;
		yield* g.callName(f, live(SG), "ex_act", [1]);
		affected = rt.inc(live(affected), 1);
	}
	rt.endFor(f, 0);
	if (truthy(live(bad_effects))) {
		affected = rt.modify(live(affected), (yield* g.srcCall(f, "try_use_power", 100)), add);
	}
	return live(affected);
}, true);

// /obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/attack_hand  (code/game/gamemodes/clock_cult/clock_structures/clockwork_obelisk.dm:46)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let choice: Value = null, input: Value = null;
	let $0: any;
	f.vars = () => [user, choice, input, $0];
	if (((!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)]))) || rt.lt((yield* g.srcCall(f, "total_accessable_power")), rt.sv(f, "hierophant_cost"))) || !truthy(rt.sv(f, "anchored")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You place your hand on ＀, but it doesn't react.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	$0 = (choice = (yield* g.call(f, P("/proc/alert"), null, [live(user), fmt("You place your hand on ＀...", [live(f.src)]), null, "Hierophant Broadcast", "Spatial Gateway", "Cancel"])));
	if ($0 === "Hierophant Broadcast") {
		if (truthy(rt.sv(f, "active"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is sustaining a gateway and cannot broadcast!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(user), "can_speak_vocal", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You cannot speak through ＀!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please choose a message to send over the Hierophant Network.", "Hierophant Broadcast", ""]));
		if (((!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)]))) || !truthy(live(input))) || !truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src), (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) ? 1 : 0)]))))) {
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "anchored"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is no longer secured!</span>", [live(f.src)])]);
			return 0;
		}
		if (truthy(rt.sv(f, "active"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is sustaining a gateway and cannot broadcast!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(user), "can_speak_vocal", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You cannot speak through ＀!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.srcCall(f, "try_use_power", rt.sv(f, "hierophant_cost"))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ lacks the power to broadcast!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/clockwork_say"), null, [live(user), (yield* g.call(f, P("/proc/text2ratvar"), null, [fmt("Hierophant Broadcast, activate! ＀", [(yield* g.call(f, P("/proc/html_decode"), null, [live(input)]))])]))]);
		yield* g.call(f, P("/proc/titled_hierophant_message"), null, [live(user), live(input), "big_brass", "large_brass"]);
	} else if ($0 === "Spatial Gateway") {
		if (truthy(rt.sv(f, "active"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is already sustaining a gateway!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(user), "can_speak_vocal", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to be able to speak to open a gateway!</span>"]);
			return live(f.dot);
		}
		if (!truthy((yield* g.srcCall(f, "try_use_power", rt.sv(f, "gateway_cost"))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ lacks the power to open a gateway!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (truthy((yield* g.srcCall(f, "procure_gateway", live(user), (yield* g.call(f, P("/proc/round"), null, [multiply(100, (yield* g.srcCall(f, "get_efficiency_mod"))), 1])), (yield* g.call(f, P("/proc/round"), null, [multiply(5, (yield* g.srcCall(f, "get_efficiency_mod"))), 1])), 1)))) {
			yield* g.srcCall(f, "process");
			if (!truthy(rt.sv(f, "active"))) {
				rt.setSv(f, "active", 1);
				yield* g.call(f, P("/proc/clockwork_say"), null, [live(user), (yield* g.call(f, P("/proc/text2ratvar"), null, ["Spatial Gateway, activate!"]))]);
				return live(f.dot);
			}
		}
		yield* g.srcCall(f, "return_power", rt.sv(f, "gateway_cost"));
	}
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/process  (code/game/gamemodes/clock_cult/clock_structures/clockwork_obelisk.dm:94)
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/process", function process(f: Frame) {
	let SG: Value = null;
	f.vars = () => [SG];
	if (!truthy(rt.sv(f, "anchored"))) {
		return live(f.dot);
	}
	if ((truthy((SG = rt.locateIn(f, T("/obj/effect/clockwork/spatial_gateway"), rt.sv(f, "loc")))) && truthy(rt.fv(f, "timerid", live(SG))))) {
		rt.setSv(f, "icon_state", rt.sv(f, "active_icon"));
		rt.setSv(f, "density", 0);
		rt.setSv(f, "active", 1);
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "inactive_icon"));
		rt.setSv(f, "density", 1);
		rt.setSv(f, "active", 0);
	}
	return f.dot;
}, false, { waitfor: false });
