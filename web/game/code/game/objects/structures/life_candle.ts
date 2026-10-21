// From code/game/objects/structures/life_candle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12794, "/obj/structure/life_candle", "/obj/structure", {
	icon_state_active: "candle1_lit",
	icon_state_inactive: "candle1",
	lit_luminosity: 2,
	linked_minds: null,
	mob_type: rt.typePath("/mob/living/carbon/human"),
	outfit: null,
	respawn_time: 50,
	respawn_sound: rt.rsc("sound/magic/staff_animation.ogg"),
	light_color: "#FAA019",
	anchored: 1,
	name: "life candle",
	desc: "You are dead. Insert quarter to continue.",
	icon: rt.rsc("icons/obj/candle.dmi"),
	icon_state: "candle1",
	resistance_flags: 115,
});

// /obj/structure/life_candle/proc/<init>  (code/game/objects/structures/life_candle.dm:16)
rt.def("/obj/structure/life_candle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "linked_minds", rt.list());
	return f.dot;
});

// /obj/structure/life_candle/proc/attack_hand  (code/game/objects/structures/life_candle.dm:28)  may sleep
rt.def("/obj/structure/life_candle/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.fv(f, "mind", live(user)))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, rt.fv(f, "mind", live(user)), rt.sv(f, "linked_minds")) ? 1 : 0))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ reaches out and pinches the flame of ＀.</span>", [live(user), live(f.src)]), fmt("<span class='warning'>You sever the connection between yourself and ＀.</span>", [live(f.src)])]);
		(rt.modSrcVar(f, "linked_minds", rt.fv(f, "mind", live(user)), subtract));
	} else {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ touches ＀. It seems to respond to their presence!</span>", [live(user), live(f.src)]), fmt("<span class='warning'>You create a connection between you and ＀.</span>", [live(f.src)])]);
		(rt.modSrcVar(f, "linked_minds", rt.fv(f, "mind", live(user)), rt.bitOr));
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "float", rt.len(f, rt.sv(f, "linked_minds")));
	if (truthy(rt.len(f, rt.sv(f, "linked_minds")))) {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
		yield* g.srcCall(f, "set_light", rt.sv(f, "lit_luminosity"));
	} else {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		yield* g.srcCall(f, "set_light", 0);
	}
	return f.dot;
}, true);

// /obj/structure/life_candle/proc/update_icon  (code/game/objects/structures/life_candle.dm:47)
rt.def("/obj/structure/life_candle/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.len(f, rt.sv(f, "linked_minds")))) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_state_active"));
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_state_inactive"));
	}
	return f.dot;
});

// /obj/structure/life_candle/proc/examine  (code/game/objects/structures/life_candle.dm:53)
rt.def("/obj/structure/life_candle/proc/examine", function examine(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.len(f, rt.sv(f, "linked_minds")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀ is active, and linked to ＀ souls.", [live(f.src), rt.len(f, rt.sv(f, "linked_minds"))])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It is static, still, unmoving."]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/life_candle/proc/process  (code/game/objects/structures/life_candle.dm:60)  may sleep
rt.def("/obj/structure/life_candle/proc/process", function* process(f: Frame) {
	let m: Value = null, mind: Value = null;
	let $e: any;
	f.vars = () => [m, mind, $e];
	if (!truthy(rt.len(f, rt.sv(f, "linked_minds")))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		return live(f.dot);
	}
	m = null;
	rt.forList(f, 0, rt.sv(f, "linked_minds"));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		if ((!truthy(rt.gv(f, "current", (mind = live(m)))) || (truthy(rt.fv(f, "current", live(mind))) && isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(mind))), 2)))) {
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/life_candle/proc/respawn"), live(mind)])), rt.sv(f, "respawn_time"), 1]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/life_candle/proc/respawn  (code/game/objects/structures/life_candle.dm:70)  may sleep
rt.def("/obj/structure/life_candle/proc/respawn", function* respawn(f: Frame, mind: Value) {
	let _T: Value = null, body: Value = null, ghostie: Value = null;
	f.vars = () => [mind, _T, body, ghostie];
	_T = rt.getStep(f, live(f.src), 0);
	body = null;
	if (truthy(rt.fv(f, "current", live(mind)))) {
		if (!isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(mind))), 2)) {
			return live(f.dot);
		} else {
			body = rt.fv(f, "current", live(mind));
		}
	}
	if (!truthy(live(body))) {
		body = (yield* g.new_(f, rt.sv(f, "mob_type"), [live(_T)]));
		if ((truthy(rt.gv(f, "client", (ghostie = (yield* g.callName(f, live(mind), "get_ghost", [1]))))) && truthy(rt.gv(f, "prefs", rt.fv(f, "client", live(ghostie)))))) {
			yield* g.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(ghostie))), "copy_to", [live(body)]);
		}
		yield* g.callName(f, live(mind), "transfer_to", [live(body)]);
	} else {
		yield* g.callName(f, live(body), "forceMove", [live(_T)]);
		yield* g.callName(f, live(body), "revive", [1, 1]);
	}
	yield* g.callName(f, live(mind), "grab_ghost", [1]);
	yield* g.callName(f, live(body), "flash_act", []);
	if ((truthy((rt.istype(live(body), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy((rt.istype(rt.sv(f, "outfit"), T("/datum/outfit")) ? 1 : 0)))) {
		yield* g.callName(f, rt.sv(f, "outfit"), "equip", [live(body)]);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.sv(f, "respawn_sound"), 50, 1]);
	return f.dot;
}, true, { argTypes: [{ path: "/datum/mind" }] });
