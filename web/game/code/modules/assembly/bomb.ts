// From code/modules/assembly/bomb.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9386, "/obj/item/device/onetankbomb", "/obj/item/device", {
	status: 0,
	bombassembly: null,
	bombtank: null,
	throw_speed: 2,
	throw_range: 4,
	flags: 64,
	name: "bomb",
	icon: rt.rsc("icons/obj/tank.dmi"),
	item_state: "assembly",
	throwforce: 5,
	w_class: 3,
	origin_tech: "materials=1;engineering=1",
});

// /obj/item/device/onetankbomb/proc/examine  (code/modules/assembly/bomb.dm:16)  may sleep
rt.def("/obj/item/device/onetankbomb/proc/examine", function* examine(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, live(f.args[0]), "examinate", [rt.sv(f, "bombtank")]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/onetankbomb/proc/update_icon  (code/modules/assembly/bomb.dm:23)
rt.def("/obj/item/device/onetankbomb/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "bombtank"))) {
		rt.setSv(f, "icon_state", rt.fv(f, "icon_state", rt.sv(f, "bombtank")));
	}
	if (!truthy(rt.sv(f, "bombassembly"))) return f.dot;
	rt.callSrc(f, "add_overlay", [rt.fv(f, "icon_state", rt.sv(f, "bombassembly"))]);
	rt.callSrc(f, "copy_overlays", [rt.sv(f, "bombassembly")]);
	rt.callSrc(f, "add_overlay", ["bomb_assembly"]);
	return f.dot;
});

// /obj/item/device/onetankbomb/proc/attackby  (code/modules/assembly/bomb.dm:28)  may sleep
rt.def("/obj/item/device/onetankbomb/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/analyzer")) ? 1 : 0))) {
		yield* g.callName(f, rt.sv(f, "bombtank"), "attackby", [live(f.args[0]), live(f.args[1])]);
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.sv(f, "status")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You disassemble ＀.</span>", [live(f.src)])]);
		rt.setFv(f, "loc", rt.sv(f, "bombassembly"), rt.fv(f, "loc", live(f.args[1])));
		rt.setFv(f, "master", rt.sv(f, "bombassembly"), null);
		rt.setSv(f, "bombassembly", null);
		rt.setFv(f, "loc", rt.sv(f, "bombtank"), rt.fv(f, "loc", live(f.args[1])));
		rt.setFv(f, "master", rt.sv(f, "bombtank"), null);
		rt.setSv(f, "bombtank", null);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && truthy(rt.fv(f, "welding", live(f.args[0]))))) {
		if (!truthy(rt.sv(f, "status"))) {
			rt.setSv(f, "status", 1);
			rt.modGl("bombers", fmt("＀ welded a single tank bomb. Temp: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), subtract(rt.gv(f, "temperature", rt.fv(f, "air_contents", rt.sv(f, "bombtank"))), 273.1499938964844)]), add);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ welded a single tank bomb. Temp: ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])])), subtract(rt.gv(f, "temperature", rt.fv(f, "air_contents", rt.sv(f, "bombtank"))), 273.1499938964844)])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>A pressure hole has been bored to ＀ valve. ＄！ can now be ignited.</span>", [rt.sv(f, "bombtank"), rt.sv(f, "bombtank")])]);
		} else {
			rt.setSv(f, "status", 0);
			rt.modGl("bombers", fmt("＀ unwelded a single tank bomb. Temp: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), subtract(rt.gv(f, "temperature", rt.fv(f, "air_contents", rt.sv(f, "bombtank"))), 273.1499938964844)]), add);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The hole has been closed.</span>"]);
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/device/onetankbomb/proc/attack_self  (code/modules/assembly/bomb.dm:59)  may sleep
rt.def("/obj/item/device/onetankbomb/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, rt.sv(f, "bombassembly"), "attack_self", [live(user), 1]);
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return live(f.dot);
}, true);

// /obj/item/device/onetankbomb/proc/receive_signal  (code/modules/assembly/bomb.dm:64)  may sleep
rt.def("/obj/item/device/onetankbomb/proc/receive_signal", function* receive_signal(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("＀ *beep* *beep*", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))]), "*beep* *beep*");
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	if (!truthy(live(f.src))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "status"))) {
		yield* g.callName(f, rt.sv(f, "bombtank"), "ignite", []);
	} else {
		yield* g.callName(f, rt.sv(f, "bombtank"), "release", []);
	}
	return f.dot;
}, true);

// /obj/item/device/onetankbomb/proc/Crossed  (code/modules/assembly/bomb.dm:75)  may sleep
rt.def("/obj/item/device/onetankbomb/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (!truthy(rt.sv(f, "bombassembly"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "bombassembly"), "Crossed", [live(AM)]);
	return f.dot;
}, true);

// /obj/item/device/onetankbomb/proc/on_found  (code/modules/assembly/bomb.dm:79)  may sleep
rt.def("/obj/item/device/onetankbomb/proc/on_found", function* on_found(f: Frame, finder: Value) {
	f.vars = () => [finder];
	if (!truthy(rt.sv(f, "bombassembly"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "bombassembly"), "on_found", [live(finder)]);
	return f.dot;
}, true);

// /obj/item/weapon/tank/proc/bomb_assemble  (code/modules/assembly/bomb.dm:85)  may sleep
rt.def("/obj/item/weapon/tank/proc/bomb_assemble", function* bomb_assemble(f: Frame, W: Value, user: Value) {
	let S: Value = null, M: Value = null, R: Value = null;
	f.vars = () => [W, user, S, M, R];
	S = live(W);
	M = live(user);
	if (isEqual((rt.istype(rt.fv(f, "a_left", live(S)), T("/obj/item/device/assembly/igniter")) ? 1 : 0), (rt.istype(rt.fv(f, "a_right", live(S)), T("/obj/item/device/assembly/igniter")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(M), "drop_item", [])))) {
		return live(f.dot);
	}
	R = (yield* g.new_(f, T("/obj/item/device/onetankbomb"), [rt.sv(f, "loc")]));
	yield* g.callName(f, live(M), "temporarilyRemoveItemFromInventory", [live(f.src), 1]);
	if (!truthy((yield* g.callName(f, live(M), "put_in_hands", [live(R)])))) {
		yield* g.srcCall(f, "forceMove", rt.getStep(f, live(M), 0));
	}
	rt.setFv(f, "bombassembly", live(R), live(S));
	rt.setFv(f, "master", live(S), live(R));
	rt.setFv(f, "loc", live(S), live(R));
	rt.setFv(f, "bombtank", live(R), live(f.src));
	rt.setSv(f, "master", live(R));
	rt.setSv(f, "loc", live(R));
	yield* g.callName(f, live(R), "update_icon", []);
	return live(f.dot);
}, true);

// /obj/item/weapon/tank/proc/ignite  (code/modules/assembly/bomb.dm:109)  may sleep
rt.def("/obj/item/weapon/tank/proc/ignite", function* ignite(f: Frame) {
	let fuel_moles: Value = null, strength: Value = null, ground_zero: Value = null;
	f.vars = () => [fuel_moles, strength, ground_zero];
	yield* g.callName(f, rt.sv(f, "air_contents"), "assert_gases", ["plasma", "o2"]);
	fuel_moles = add(rt.index(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "plasma"), 1), divide(rt.index(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "o2"), 1), 6));
	yield* g.callName(f, rt.sv(f, "air_contents"), "garbage_collect", []);
	strength = 1;
	ground_zero = rt.getStep(f, rt.sv(f, "loc"), 0);
	rt.setSv(f, "loc", null);
	if (rt.gt(rt.fv(f, "temperature", rt.sv(f, "air_contents")), 673.1500244140625)) {
		if (rt.ge((strength = divide(live(fuel_moles), 15)), 1)) {
			yield* g.call(f, P("/proc/explosion"), null, [live(ground_zero), (yield* g.call(f, P("/proc/round"), null, [live(strength), 1])), (yield* g.call(f, P("/proc/round"), null, [multiply(live(strength), 2), 1])), (yield* g.call(f, P("/proc/round"), null, [multiply(live(strength), 3), 1])), (yield* g.call(f, P("/proc/round"), null, [multiply(live(strength), 4), 1]))]);
		} else {
			if (rt.ge(live(strength), 0.5)) {
				yield* g.call(f, P("/proc/explosion"), null, [live(ground_zero), 0, 1, 2, 4]);
			} else {
				if (rt.ge(live(strength), 0.20000000298023224)) {
					yield* g.call(f, P("/proc/explosion"), null, [live(ground_zero), -1, 0, 1, 2]);
				} else {
					yield* g.callName(f, live(ground_zero), "assume_air", [rt.sv(f, "air_contents")]);
					yield* g.callName(f, live(ground_zero), "hotspot_expose", [1000, 125]);
				}
			}
		}
	} else {
		if (rt.gt(rt.fv(f, "temperature", rt.sv(f, "air_contents")), 523.1500244140625)) {
			if (rt.ge((strength = divide(live(fuel_moles), 20)), 1)) {
				yield* g.call(f, P("/proc/explosion"), null, [live(ground_zero), 0, (yield* g.call(f, P("/proc/round"), null, [live(strength), 1])), (yield* g.call(f, P("/proc/round"), null, [multiply(live(strength), 2), 1])), (yield* g.call(f, P("/proc/round"), null, [multiply(live(strength), 3), 1]))]);
			} else {
				if (rt.ge(live(strength), 0.5)) {
					yield* g.call(f, P("/proc/explosion"), null, [live(ground_zero), -1, 0, 1, 2]);
				} else {
					yield* g.callName(f, live(ground_zero), "assume_air", [rt.sv(f, "air_contents")]);
					yield* g.callName(f, live(ground_zero), "hotspot_expose", [1000, 125]);
				}
			}
		} else {
			if (rt.gt(rt.fv(f, "temperature", rt.sv(f, "air_contents")), 373.1499938964844)) {
				if (rt.ge((strength = divide(live(fuel_moles), 25)), 1)) {
					yield* g.call(f, P("/proc/explosion"), null, [live(ground_zero), -1, 0, (yield* g.call(f, P("/proc/round"), null, [live(strength), 1])), (yield* g.call(f, P("/proc/round"), null, [multiply(live(strength), 3), 1]))]);
				} else {
					yield* g.callName(f, live(ground_zero), "assume_air", [rt.sv(f, "air_contents")]);
					yield* g.callName(f, live(ground_zero), "hotspot_expose", [1000, 125]);
				}
			} else {
				yield* g.callName(f, live(ground_zero), "assume_air", [rt.sv(f, "air_contents")]);
				yield* g.callName(f, live(ground_zero), "hotspot_expose", [1000, 125]);
			}
		}
	}
	yield* g.srcCall(f, "air_update_turf");
	if (truthy(rt.sv(f, "master"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "master")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/tank/proc/release  (code/modules/assembly/bomb.dm:161)  may sleep
rt.def("/obj/item/weapon/tank/proc/release", function* release(f: Frame) {
	let removed: Value = null, _T: Value = null;
	f.vars = () => [removed, _T];
	removed = (yield* g.callName(f, rt.sv(f, "air_contents"), "remove", [(yield* g.callName(f, rt.sv(f, "air_contents"), "total_moles", []))]));
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(_T), "assume_air", [live(removed)]);
	yield* g.srcCall(f, "air_update_turf");
	return f.dot;
}, true);
