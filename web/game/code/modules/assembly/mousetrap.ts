// From code/modules/assembly/mousetrap.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9377, "/obj/item/device/assembly/mousetrap", "/obj/item/device/assembly", {
	armed: 0,
	attachable: 1,
	name: "mousetrap",
	desc: "A handy little spring-loaded trap for catching pesty rodents.",
	icon_state: "mousetrap",
	materials: null,
	origin_tech: "combat=1;materials=2;engineering=1",
});

// /obj/item/device/assembly/mousetrap/proc/<init>  (code/modules/assembly/mousetrap.dm:5)
rt.def("/obj/item/device/assembly/mousetrap/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100]));
	return f.dot;
});

// /obj/item/device/assembly/mousetrap/proc/examine  (code/modules/assembly/mousetrap.dm:12)
rt.def("/obj/item/device/assembly/mousetrap/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "armed"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "The mousetrap is armed!"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "The mousetrap is not armed."]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/assembly/mousetrap/proc/activate  (code/modules/assembly/mousetrap.dm:19)  may sleep
rt.def("/obj/item/device/assembly/mousetrap/proc/activate", function* activate(f: Frame) {
	let user: Value = null;
	f.vars = () => [user];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	rt.setSv(f, "armed", (!truthy(rt.sv(f, "armed")) ? 1 : 0));
	if (!truthy(rt.sv(f, "armed"))) {
		if (truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if ((rt.ge((yield* g.callName(f, (user = live(f.usr)), "getBrainLoss", [])), 60) || (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(user)), 256)) && truthy(rt.op(f, "Prob", [], [50]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Your hand slips, setting off the trigger!</span>"]);
				yield* g.srcCall(f, "pulse", 0);
			}
		}
	}
	yield* g.srcCall(f, "update_icon");
	if (!truthy(live(f.usr))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.usr)), rt.rsc("sound/weapons/handcuffs.ogg"), 30, 1, -3]);
	return f.dot;
}, true);

// /obj/item/device/assembly/mousetrap/proc/describe  (code/modules/assembly/mousetrap.dm:32)
rt.def("/obj/item/device/assembly/mousetrap/proc/describe", function describe(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "armed"))) {
		$0 = "primed";
	} else {
		$0 = "safe";
	}
	return fmt("The pressure switch is ＀.", [$0]);
});

// /obj/item/device/assembly/mousetrap/proc/update_icon  (code/modules/assembly/mousetrap.dm:36)  may sleep
rt.def("/obj/item/device/assembly/mousetrap/proc/update_icon", function* update_icon(f: Frame) {
	if (truthy(rt.sv(f, "armed"))) {
		rt.setSv(f, "icon_state", "mousetraparmed");
	} else {
		rt.setSv(f, "icon_state", "mousetrap");
	}
	if (!truthy(rt.sv(f, "holder"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "holder"), "update_icon", []);
	return f.dot;
}, true);

// /obj/item/device/assembly/mousetrap/proc/triggered  (code/modules/assembly/mousetrap.dm:43)  may sleep
rt.def("/obj/item/device/assembly/mousetrap/proc/triggered", function* triggered(f: Frame, target: Value, type: Value) {
	let affecting: Value = null, H: Value = null, M: Value = null;
	let $0: any;
	f.vars = () => [target, type, affecting, H, M, $0];
	if (live(type) === null) {
		type = "feet";
	}
	if (!truthy(rt.sv(f, "armed"))) {
		return live(f.dot);
	}
	affecting = null;
	if (truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(target);
		if (truthy((rt.isIn(f, 15, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/snap.ogg"), 50, 1]);
			rt.setSv(f, "armed", 0);
			yield* g.srcCall(f, "update_icon");
			yield* g.srcCall(f, "pulse", 0);
			return 0;
		}
		$0 = live(type);
		if ($0 === "feet") {
			if (!truthy(rt.fv(f, "shoes", live(H)))) {
				affecting = (yield* g.callName(f, live(H), "get_bodypart", [rt.op(f, "PickUnweighted", [2], ["l_leg", "r_leg"])]));
				yield* g.callName(f, live(H), "Knockdown", [60]);
			}
		} else if ($0 === "l_hand" || $0 === "r_hand") {
			if (!truthy(rt.fv(f, "gloves", live(H)))) {
				affecting = (yield* g.callName(f, live(H), "get_bodypart", [live(type)]));
				yield* g.callName(f, live(H), "Stun", [60]);
			}
		}
		if (truthy(live(affecting))) {
			if (truthy((yield* g.callName(f, live(affecting), "receive_damage", [1, 0])))) {
				yield* g.callName(f, live(H), "update_damage_overlays", []);
			}
		}
	} else {
		if (truthy((rt.istype(live(target), T("/mob/living/simple_animal/mouse")) ? 1 : 0))) {
			M = live(target);
			yield* g.srcCall(f, "visible_message", "<span class='boldannounce'>SPLAT!</span>");
			yield* g.callName(f, live(M), "splat", []);
		}
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/snap.ogg"), 50, 1]);
	rt.setSv(f, "armed", 0);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "pulse", 0);
	return f.dot;
}, true);

// /obj/item/device/assembly/mousetrap/proc/attack_self  (code/modules/assembly/mousetrap.dm:77)  may sleep
rt.def("/obj/item/device/assembly/mousetrap/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let which_hand: Value = null;
	f.vars = () => [user, which_hand];
	if (!truthy(rt.sv(f, "armed"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You arm ＀.</span>", [live(f.src)])]);
	} else {
		if (((rt.ge((yield* g.callName(f, live(user), "getBrainLoss", [])), 60) || truthy(rt.bitAnd(rt.fv(f, "disabilities", live(user)), 256))) && truthy(rt.op(f, "Prob", [], [50])))) {
			which_hand = "l_hand";
			if (!truthy(rt.modulus(rt.fv(f, "active_hand_index", live(user)), 2))) {
				which_hand = "r_hand";
			}
			yield* g.srcCall(f, "triggered", live(user), live(which_hand));
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ accidentally sets off ＀, breaking their fingers.</span>", [live(user), live(f.src)]), fmt("<span class='warning'>You accidentally trigger ＀!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You disarm ＀.</span>", [live(f.src)])]);
	}
	rt.setSv(f, "armed", (!truthy(rt.sv(f, "armed")) ? 1 : 0));
	yield* g.srcCall(f, "update_icon");
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/weapons/handcuffs.ogg"), 30, 1, -3]);
	return f.dot;
}, true);

// /obj/item/device/assembly/mousetrap/proc/attack_hand  (code/modules/assembly/mousetrap.dm:96)  may sleep
rt.def("/obj/item/device/assembly/mousetrap/proc/attack_hand", function* attack_hand(f: Frame) {
	let which_hand: Value = null;
	f.vars = () => [which_hand];
	if (truthy(rt.sv(f, "armed"))) {
		if (((rt.ge((yield* g.callName(f, live(f.args[0]), "getBrainLoss", [])), 60) || truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[0])), 256))) && truthy(rt.op(f, "Prob", [], [50])))) {
			which_hand = "l_hand";
			if (!truthy(rt.modulus(rt.fv(f, "active_hand_index", live(f.args[0])), 2))) {
				which_hand = "r_hand";
			}
			yield* g.srcCall(f, "triggered", live(f.args[0]), live(which_hand));
			yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ accidentally sets off ＀, breaking their fingers.</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='warning'>You accidentally trigger ＀!</span>", [live(f.src)])]);
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/assembly/mousetrap/proc/Crossed  (code/modules/assembly/mousetrap.dm:109)  may sleep
rt.def("/obj/item/device/assembly/mousetrap/proc/Crossed", function* Crossed(f: Frame) {
	let MM: Value = null, H: Value = null;
	f.vars = () => [MM, H];
	if (truthy(rt.sv(f, "armed"))) {
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) {
			if (!truthy(rt.bitAnd(rt.gv(f, "movement_type", (MM = live(f.args[0]))), 2))) {
				if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
					if (isEqual(rt.gv(f, "m_intent", (H = live(f.args[0]))), "run")) {
						yield* g.srcCall(f, "triggered", live(H));
						yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀ accidentally steps on ＀.</span>", [live(H), live(f.src)]), fmt("<span class='warning'>You accidentally step on ＀</span>", [live(f.src)])]);
					}
				} else {
					if (truthy((rt.istype(live(MM), T("/mob/living/simple_animal/mouse")) ? 1 : 0))) {
						yield* g.srcCall(f, "triggered", live(MM));
					}
				}
			}
		} else {
			if (truthy(rt.fv(f, "density", live(f.args[0])))) {
				yield* g.srcCall(f, "triggered", live(f.args[0]));
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM"] });

// /obj/item/device/assembly/mousetrap/proc/on_found  (code/modules/assembly/mousetrap.dm:127)  may sleep
rt.def("/obj/item/device/assembly/mousetrap/proc/on_found", function* on_found(f: Frame, finder: Value) {
	let $0: any, $1: any;
	f.vars = () => [finder, $0, $1];
	if (truthy(rt.sv(f, "armed"))) {
		yield* g.callName(f, live(finder), "visible_message", [fmt("<span class='warning'>＀ accidentally sets off ＀, breaking their fingers.</span>", [live(finder), live(f.src)]), fmt("<span class='warning'>You accidentally trigger ＀!</span>", [live(f.src)])]);
		$0 = live(finder);
		if (isEqual(rt.modulus(rt.fv(f, "active_hand_index", live(finder)), 2), 0)) {
			$1 = "r_hand";
		} else {
			$1 = "l_hand";
		}
		yield* g.srcCall(f, "triggered", $0, $1);
		return 1;
	}
	return 0;
}, true);

// /obj/item/device/assembly/mousetrap/proc/hitby  (code/modules/assembly/mousetrap.dm:135)  may sleep
rt.def("/obj/item/device/assembly/mousetrap/proc/hitby", function* hitby(f: Frame) {
	if (!truthy(rt.sv(f, "armed"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ is triggered by ＀.</span>", [live(f.src), live(f.args[0])]));
	yield* g.srcCall(f, "triggered", null);
	return f.dot;
}, true, { args: ["A"] });
