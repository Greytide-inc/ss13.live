// From code/game/objects/structures/barsigns.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12658, "/obj/structure/sign/barsign", "/obj/structure/sign", {
	barsigns: null,
	hiddensigns: null,
	emagged: 0,
	state: 0,
	prev_sign: "",
	panel_open: 0,
	name: "Bar Sign",
	desc: "A bar sign with no writing on it",
	icon: rt.rsc("icons/obj/barsigns.dmi"),
	icon_state: "empty",
	req_access: null,
	obj_integrity: 500,
	max_integrity: 500,
	integrity_failure: 250,
	armor: null,
	buildable_sign: 0,
});

// /obj/structure/sign/barsign/proc/<init>  (code/game/objects/structures/barsigns.dm:12)
rt.def("/obj/structure/sign/barsign/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "barsigns", rt.list());
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(25));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 20, "laser", 20, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/structure/sign/barsign/proc/New  (code/game/objects/structures/barsigns.dm:23)  may sleep
rt.def("/obj/structure/sign/barsign/proc/New", function* New(f: Frame) {
	let bartype: Value = null, signinfo: Value = null;
	let $e: any;
	f.vars = () => [bartype, signinfo, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	bartype = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/barsign")])), T("/datum/barsign")));
	while (($e = rt.next(f, 0)) !== undefined) {
		bartype = $e;
		if (!truthy(rt.gv(f, "hidden", (signinfo = (yield* g.new_(f, live(bartype), [])))))) {
			rt.modSrcVar(f, "barsigns", live(signinfo), add);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "set_sign", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "barsigns")]));
	return f.dot;
}, true);

// /obj/structure/sign/barsign/proc/set_sign  (code/game/objects/structures/barsigns.dm:39)
rt.def("/obj/structure/sign/barsign/proc/set_sign", function set_sign(f: Frame, sign: Value) {
	if (!truthy((rt.istype(live(sign), T("/datum/barsign")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", rt.fv(f, "icon", live(sign)));
	rt.setSv(f, "name", rt.fv(f, "name", live(sign)));
	if (truthy(rt.fv(f, "desc", live(sign)))) {
		rt.setSv(f, "desc", rt.fv(f, "desc", live(sign)));
	} else {
		rt.setSv(f, "desc", fmt("It displays \"＀\".", [rt.sv(f, "name")]));
	}
	return f.dot;
});

// /obj/structure/sign/barsign/proc/obj_break  (code/game/objects/structures/barsigns.dm:51)
rt.def("/obj/structure/sign/barsign/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(!truthy(rt.sv(f, "broken")) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	rt.setSv(f, "broken", 1);
	return f.dot;
});

// /obj/structure/sign/barsign/proc/deconstruct  (code/game/objects/structures/barsigns.dm:55)  may sleep
rt.def("/obj/structure/sign/barsign/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.sv(f, "loc"), 2]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/sign/barsign/proc/play_attack_sound  (code/game/objects/structures/barsigns.dm:60)
rt.def("/obj/structure/sign/barsign/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/glasshit.ogg"), 75, 1]);
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/structure/sign/barsign/proc/attack_ai  (code/game/objects/structures/barsigns.dm:67)  may sleep
rt.def("/obj/structure/sign/barsign/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/structure/sign/barsign/proc/attack_hand  (code/game/objects/structures/barsigns.dm:72)  may sleep
rt.def("/obj/structure/sign/barsign/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.callName(f, live(f.src), "allowed", [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='info'>Access denied.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "broken"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class ='danger'>The controls seem unresponsive.</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "pick_sign");
	return f.dot;
}, true);

// /obj/structure/sign/barsign/proc/attackby  (code/game/objects/structures/barsigns.dm:84)  may sleep
rt.def("/obj/structure/sign/barsign/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (!truthy((yield* g.srcCall(f, "allowed", live(f.args[1]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='info'>Access denied.</span>"]);
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "panel_open"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You open the maintenance panel.</span>"]);
			yield* g.srcCall(f, "set_sign", (yield* g.new_(f, T("/datum/barsign/hiddensigns/signoff"), [])));
			rt.setSv(f, "panel_open", 1);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You close the maintenance panel.</span>"]);
			if ((!truthy(rt.sv(f, "broken")) && !truthy(rt.sv(f, "emagged")))) {
				yield* g.srcCall(f, "set_sign", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "barsigns")]));
			} else {
				if (truthy(rt.sv(f, "emagged"))) {
					yield* g.srcCall(f, "set_sign", (yield* g.new_(f, T("/datum/barsign/hiddensigns/syndibarsign"), [])));
				} else {
					yield* g.srcCall(f, "set_sign", (yield* g.new_(f, T("/datum/barsign/hiddensigns/empbarsign"), [])));
				}
			}
			rt.setSv(f, "panel_open", 0);
		}
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0)) && truthy(rt.sv(f, "panel_open")))) {
			C = live(f.args[0]);
			if (truthy(rt.sv(f, "emagged"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Sign has been damaged beyond repair!</span>"]);
				return live(f.dot);
			} else {
				if (!truthy(rt.sv(f, "broken"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This sign is functioning properly!</span>"]);
					return live(f.dot);
				}
			}
			if (truthy((yield* g.callName(f, live(C), "use", [2])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You replace the burnt wiring.</span>"]);
				rt.setSv(f, "broken", 0);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need at least two lengths of cable!</span>"]);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user"] });

// /obj/structure/sign/barsign/proc/emp_act  (code/game/objects/structures/barsigns.dm:121)
rt.def("/obj/structure/sign/barsign/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	rt.callSrc(f, "set_sign", [rt.new_(f, T("/datum/barsign/hiddensigns/empbarsign"), [])]);
	rt.setSv(f, "broken", 1);
	return f.dot;
});

// /obj/structure/sign/barsign/proc/emag_act  (code/game/objects/structures/barsigns.dm:128)  may sleep
rt.def("/obj/structure/sign/barsign/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(rt.sv(f, "broken")) || truthy(rt.sv(f, "emagged")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Nothing interesting happens!</span>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You emag the barsign. Takeover in progress...</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [100]);
	yield* g.srcCall(f, "set_sign", (yield* g.new_(f, T("/datum/barsign/hiddensigns/syndibarsign"), [])));
	rt.setSv(f, "emagged", 1);
	rt.setSv(f, "req_access", rt.list(150));
	return f.dot;
}, true);

// /obj/structure/sign/barsign/proc/pick_sign  (code/game/objects/structures/barsigns.dm:141)  may sleep
rt.def("/obj/structure/sign/barsign/proc/pick_sign", function* pick_sign(f: Frame) {
	let picked_name: Value = null;
	f.vars = () => [picked_name];
	if (!truthy((picked_name = (yield* g.op(f, "Prompt", [1], [null, null, "Bar Sign", "Available Signage", rt.sv(f, "barsigns")]))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "set_sign", live(picked_name));
	return f.dot;
}, true);
