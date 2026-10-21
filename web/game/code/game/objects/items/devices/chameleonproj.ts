// From code/game/objects/items/devices/chameleonproj.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9228, "/obj/item/device/chameleon", "/obj/item/device", {
	can_use: 1,
	active_dummy: null,
	saved_appearance: null,
	flags: 68,
	throw_speed: 3,
	throw_range: 5,
	name: "chameleon-projector",
	icon_state: "shield0",
	slot_flags: 512,
	item_state: "electronic",
	throwforce: 5,
	w_class: 2,
	origin_tech: "syndicate=4;magnets=4",
});

// /obj/item/device/chameleon/proc/New  (code/game/objects/items/devices/chameleonproj.dm:17)  may sleep
rt.def("/obj/item/device/chameleon/proc/New", function* New(f: Frame) {
	let butt: Value = null;
	f.vars = () => [butt];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "saved_appearance", rt.initial(f, (butt = T("/obj/item/weapon/cigbutt")), "appearance"));
	return f.dot;
}, true);

// /obj/item/device/chameleon/proc/dropped  (code/game/objects/items/devices/chameleonproj.dm:22)  may sleep
rt.def("/obj/item/device/chameleon/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "disrupt");
	return f.dot;
}, true);

// /obj/item/device/chameleon/proc/equipped  (code/game/objects/items/devices/chameleonproj.dm:26)  may sleep
rt.def("/obj/item/device/chameleon/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "disrupt");
	return f.dot;
}, true);

// /obj/item/device/chameleon/proc/attack_self  (code/game/objects/items/devices/chameleonproj.dm:30)  may sleep
rt.def("/obj/item/device/chameleon/proc/attack_self", function* attack_self(f: Frame) {
	yield* g.srcCall(f, "toggle");
	return f.dot;
}, true);

// /obj/item/device/chameleon/proc/afterattack  (code/game/objects/items/devices/chameleonproj.dm:33)  may sleep
rt.def("/obj/item/device/chameleon/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let temp: Value = null;
	f.vars = () => [target, user, proximity, temp];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "check_sprite", live(target))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "active_dummy"))) return f.dot;
	if (!(truthy((rt.istype(live(target), T("/obj/item")) ? 1 : 0)) && !truthy((rt.istype(live(target), T("/obj/item/weapon/disk/nuclear")) ? 1 : 0)))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/weapons/flash.ogg"), 100, 1, -6]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Scanned ＀.</span>", [live(target)])]);
	rt.setFv(f, "appearance", (temp = (yield* g.new_(f, T("/obj"), []))), rt.fv(f, "appearance", live(target)));
	rt.setFv(f, "layer", live(temp), rt.initial(f, live(target), "layer"));
	rt.setFv(f, "plane", live(temp), rt.initial(f, live(target), "plane"));
	rt.setSv(f, "saved_appearance", rt.fv(f, "appearance", live(temp)));
	return f.dot;
}, true);

// /obj/item/device/chameleon/proc/check_sprite  (code/game/objects/items/devices/chameleonproj.dm:47)
rt.def("/obj/item/device/chameleon/proc/check_sprite", function check_sprite(f: Frame, target: Value) {
	if (truthy((rt.isIn(f, rt.fv(f, "icon_state", live(target)), rt.call(f, P("/proc/icon_states"), null, [rt.fv(f, "icon", live(target))])) ? 1 : 0))) {
		return 1;
	}
	return 0;
});

// /obj/item/device/chameleon/proc/toggle  (code/game/objects/items/devices/chameleonproj.dm:52)  may sleep
rt.def("/obj/item/device/chameleon/proc/toggle", function* toggle(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if ((!truthy(rt.sv(f, "can_use")) || !truthy(rt.sv(f, "saved_appearance")))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "active_dummy"))) {
		yield* g.srcCall(f, "eject_all");
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/pop.ogg"), 100, 1, -6]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "active_dummy")]);
		rt.setSv(f, "active_dummy", null);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You deactivate ％！.</span>", [live(f.src)])]);
		yield* g.new_(f, T("/obj/effect/temp_visual/emp/pulse"), [rt.getStep(f, live(f.src), 0)]);
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/pop.ogg"), 100, 1, -6]);
		yield* g.callName(f, (C = (yield* g.new_(f, T("/obj/effect/dummy/chameleon"), [rt.fv(f, "loc", live(f.usr))]))), "activate", [live(f.usr), rt.sv(f, "saved_appearance"), live(f.src)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You activate ％！.</span>", [live(f.src)])]);
		yield* g.new_(f, T("/obj/effect/temp_visual/emp/pulse"), [rt.getStep(f, live(f.src), 0)]);
	}
	return f.dot;
}, true);

// /obj/item/device/chameleon/proc/disrupt  (code/game/objects/items/devices/chameleonproj.dm:69)  may sleep
rt.def("/obj/item/device/chameleon/proc/disrupt", function* disrupt(f: Frame, delete_dummy: Value) {
	let M: Value = null, spark_system: Value = null;
	let $e: any;
	f.vars = () => [delete_dummy, M, spark_system, $e];
	if (live(delete_dummy) === null) {
		delete_dummy = 1;
	}
	if (!truthy(rt.sv(f, "active_dummy"))) return f.dot;
	M = null;
	rt.forList(f, 0, rt.sv(f, "active_dummy"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>Your chameleon-projector deactivates.</span>"]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (spark_system = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [5, 0, live(f.src)]);
	yield* g.callName(f, live(spark_system), "attach", [live(f.src)]);
	yield* g.callName(f, live(spark_system), "start", []);
	yield* g.srcCall(f, "eject_all");
	if (truthy(live(delete_dummy))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "active_dummy")]);
	}
	rt.setSv(f, "active_dummy", null);
	rt.setSv(f, "can_use", 0);
	rt.spawnTail(f, 50, "/obj/item/device/chameleon/proc/disrupt: spawn at game/objects/items/devices/chameleonproj.dm:80", delete_dummy, M, spark_system);
	return f.dot;
}, true);

// a spawn(50) body of /obj/item/device/chameleon/proc/disrupt, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/chameleon/proc/disrupt: spawn at game/objects/items/devices/chameleonproj.dm:80", function* (f: Frame, delete_dummy: Value, M: Value, spark_system: Value) {
	f.vars = () => [delete_dummy, M, spark_system];
	rt.setSv(f, "can_use", 1);
	return null;
});

// /obj/item/device/chameleon/proc/eject_all  (code/game/objects/items/devices/chameleonproj.dm:83)  may sleep
rt.def("/obj/item/device/chameleon/proc/eject_all", function* eject_all(f: Frame) {
	let A: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [A, M, $e];
	A = null;
	rt.forList(f, 0, rt.sv(f, "active_dummy"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.setFv(f, "loc", live(A), rt.fv(f, "loc", rt.sv(f, "active_dummy")));
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)])))) {
			yield* g.callName(f, (M = live(A)), "reset_perspective", [null]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(11948, "/obj/effect/dummy/chameleon", "/obj/effect/dummy", {
	can_move: 0,
	master: null,
	name: "",
	desc: "",
	density: 0,
});

// /obj/effect/dummy/chameleon/proc/activate  (code/game/objects/items/devices/chameleonproj.dm:97)
rt.def("/obj/effect/dummy/chameleon/proc/activate", function activate(f: Frame, M: Value, saved_appearance: Value, C: Value) {
	rt.setSv(f, "appearance", live(saved_appearance));
	rt.setFv(f, "loc", live(M), live(f.src));
	rt.setSv(f, "master", live(C));
	rt.setFv(f, "active_dummy", rt.sv(f, "master"), live(f.src));
	return f.dot;
});

// /obj/effect/dummy/chameleon/proc/attackby  (code/game/objects/items/devices/chameleonproj.dm:103)  may sleep
rt.def("/obj/effect/dummy/chameleon/proc/attackby", function* attackby(f: Frame) {
	yield* g.callName(f, rt.sv(f, "master"), "disrupt", []);
	return f.dot;
}, true);

// /obj/effect/dummy/chameleon/proc/attack_hand  (code/game/objects/items/devices/chameleonproj.dm:106)  may sleep
rt.def("/obj/effect/dummy/chameleon/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callName(f, rt.sv(f, "master"), "disrupt", []);
	return f.dot;
}, true);

// /obj/effect/dummy/chameleon/proc/attack_animal  (code/game/objects/items/devices/chameleonproj.dm:109)  may sleep
rt.def("/obj/effect/dummy/chameleon/proc/attack_animal", function* attack_animal(f: Frame) {
	yield* g.callName(f, rt.sv(f, "master"), "disrupt", []);
	return f.dot;
}, true);

// /obj/effect/dummy/chameleon/proc/attack_slime  (code/game/objects/items/devices/chameleonproj.dm:112)  may sleep
rt.def("/obj/effect/dummy/chameleon/proc/attack_slime", function* attack_slime(f: Frame) {
	yield* g.callName(f, rt.sv(f, "master"), "disrupt", []);
	return f.dot;
}, true);

// /obj/effect/dummy/chameleon/proc/attack_alien  (code/game/objects/items/devices/chameleonproj.dm:115)  may sleep
rt.def("/obj/effect/dummy/chameleon/proc/attack_alien", function* attack_alien(f: Frame) {
	yield* g.callName(f, rt.sv(f, "master"), "disrupt", []);
	return f.dot;
}, true);

// /obj/effect/dummy/chameleon/proc/ex_act  (code/game/objects/items/devices/chameleonproj.dm:118)  may sleep
rt.def("/obj/effect/dummy/chameleon/proc/ex_act", function* ex_act(f: Frame, S: Value, _T: Value) {
	f.vars = () => [S, _T];
	yield* g.srcCall(f, "contents_explosion", live(S), live(_T));
	yield* g.callName(f, rt.sv(f, "master"), "disrupt", []);
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/dummy/chameleon/proc/bullet_act  (code/game/objects/items/devices/chameleonproj.dm:122)  may sleep
rt.def("/obj/effect/dummy/chameleon/proc/bullet_act", function* bullet_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "master"), "disrupt", []);
	return f.dot;
}, true);

// /obj/effect/dummy/chameleon/proc/relaymove  (code/game/objects/items/devices/chameleonproj.dm:126)  may sleep
rt.def("/obj/effect/dummy/chameleon/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	let amount: Value = null;
	let $0: any;
	f.vars = () => [user, direction, amount, $0];
	if ((truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open/space")) ? 1 : 0)) || !truthy(live(direction)))) {
		return live(f.dot);
	}
	if (rt.lt(rt.sv(f, "can_move"), rt.worldTime(f))) {
		amount = null;
		$0 = rt.fv(f, "bodytemperature", live(user));
		if (rt.inRange($0, 300, 9.999999848243207e+30)) {
			amount = 10;
		} else if (rt.inRange($0, 295, 300)) {
			amount = 13;
		} else if (rt.inRange($0, 280, 295)) {
			amount = 16;
		} else if (rt.inRange($0, 260, 280)) {
			amount = 20;
		} else {
			amount = 25;
		}
		rt.setSv(f, "can_move", add(rt.worldTime(f), live(amount)));
		yield* g.call(f, P("/proc/step"), null, [live(f.src), live(direction)]);
	}
	return live(f.dot);
}, true);

// /obj/effect/dummy/chameleon/proc/Destroy  (code/game/objects/items/devices/chameleonproj.dm:148)  may sleep
rt.def("/obj/effect/dummy/chameleon/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.sv(f, "master"), "disrupt", [0]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
