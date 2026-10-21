// From code/game/objects/items/devices/pressureplates.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9278, "/obj/item/device/pressure_plate", "/obj/item/device", {
	trigger_mob: 1,
	trigger_item: 0,
	trigger_silent: 0,
	trigger_sound: rt.rsc("sound/effects/pressureplate.ogg"),
	sigdev: null,
	roundstart_signaller: 0,
	roundstart_signaller_freq: 1447,
	roundstart_signaller_code: 30,
	roundstart_hide: 0,
	removable_signaller: 1,
	active: 0,
	tile_overlay: null,
	crossed: 0,
	trigger_delay: 10,
	level: 1,
	name: "pressure plate",
	desc: "Useful for autismforts",
	item_state: "flash",
	icon_state: "pressureplate",
});

// /obj/item/device/pressure_plate/proc/Initialize  (code/game/objects/items/devices/pressureplates.dm:24)  may sleep
rt.def("/obj/item/device/pressure_plate/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "tile_overlay", (yield* g.call(f, P("/proc/image"), null, ["icon", rt.rsc("icons/turf/floors.dmi"), "icon_state", "pp_overlay"], rt.Args.Named)));
	if (!truthy(rt.sv(f, "roundstart_signaller"))) return f.dot;
	rt.setSv(f, "sigdev", (yield* g.new_(f, T("/obj/item/device/assembly/signaler"), [])));
	rt.setFv(f, "code", rt.sv(f, "sigdev"), rt.sv(f, "roundstart_signaller_code"));
	rt.setFv(f, "frequency", rt.sv(f, "sigdev"), rt.sv(f, "roundstart_signaller_freq"));
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "hide", 1);
	return f.dot;
}, true);

// /obj/item/device/pressure_plate/proc/Crossed  (code/game/objects/items/devices/pressureplates.dm:34)
rt.def("/obj/item/device/pressure_plate/proc/Crossed", function Crossed(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy(rt.sv(f, "active"))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)) && truthy(rt.sv(f, "trigger_mob")))) {
		rt.callSrc(f, "step_living", [(L = live(f.args[0]))]);
		rt.setSv(f, "crossed", 1);
	} else {
		if (truthy(rt.sv(f, "trigger_item"))) {
			rt.callSrc(f, "step_item", [live(f.args[0])]);
			rt.setSv(f, "crossed", 1);
		}
	}
	if (!truthy(rt.sv(f, "trigger_silent"))) {
		if (truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) {
			rt.callName(f, rt.sv(f, "loc"), "visible_message", ["<span class='danger'>Click!</span>"]);
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "trigger_sound"), 50, 1]);
		}
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["AM"] });

// /obj/item/device/pressure_plate/proc/Uncrossed  (code/game/objects/items/devices/pressureplates.dm:51)  may sleep
rt.def("/obj/item/device/pressure_plate/proc/Uncrossed", function* Uncrossed(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (truthy(rt.sv(f, "crossed"))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "trigger_sound"), 50, 1]);
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [(L = live(f.args[0])), fmt("<span class='warning'>You feel something click back into place as you step off ＀!</span>", [rt.sv(f, "loc")])]);
		}
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/device/pressure_plate/proc/trigger")])), rt.sv(f, "trigger_delay")]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["AM"] });

// /obj/item/device/pressure_plate/proc/trigger  (code/game/objects/items/devices/pressureplates.dm:59)  may sleep
rt.def("/obj/item/device/pressure_plate/proc/trigger", function* trigger(f: Frame) {
	if (!truthy((rt.istype(rt.sv(f, "sigdev"), T("/obj/item/device/assembly/signaler")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, rt.sv(f, "sigdev"), "signal", []);
	return f.dot;
}, true);

// /obj/item/device/pressure_plate/proc/step_living  (code/game/objects/items/devices/pressureplates.dm:63)
rt.def("/obj/item/device/pressure_plate/proc/step_living", function step_living(f: Frame, L: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(L), "<span class='warning'>You feel a click under your feet!</span>"]);
	return f.dot;
});

// /obj/item/device/pressure_plate/proc/attackby  (code/game/objects/items/devices/pressureplates.dm:69)  may sleep
rt.def("/obj/item/device/pressure_plate/proc/attackby", function* attackby(f: Frame) {
	if ((((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/signaler")) ? 1 : 0)) && !truthy((rt.istype(rt.sv(f, "sigdev"), T("/obj/item/device/assembly/signaler")) ? 1 : 0))) && truthy(rt.sv(f, "removable_signaller"))) && truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)]))))) {
		rt.setSv(f, "sigdev", live(f.args[0]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You attach ＀ to ＀!</span>", [live(f.args[0]), live(f.src)])]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["I", "L"] });

// /obj/item/device/pressure_plate/proc/attack_self  (code/game/objects/items/devices/pressureplates.dm:75)  may sleep
rt.def("/obj/item/device/pressure_plate/proc/attack_self", function* attack_self(f: Frame) {
	if ((truthy(rt.sv(f, "removable_signaller")) && truthy((rt.istype(rt.sv(f, "sigdev"), T("/obj/item/device/assembly/signaler")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You remove ＀ from ＀</span>", [rt.sv(f, "sigdev"), live(f.src)])]);
		if (!truthy((yield* g.callName(f, live(f.args[0]), "put_in_hands", [rt.sv(f, "sigdev")])))) {
			yield* g.callName(f, rt.sv(f, "sigdev"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		}
		rt.setSv(f, "sigdev", null);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["L"] });

// /obj/item/device/pressure_plate/proc/hide  (code/game/objects/items/devices/pressureplates.dm:89)  may sleep
rt.def("/obj/item/device/pressure_plate/proc/hide", function* hide(f: Frame, yes: Value) {
	f.vars = () => [yes];
	if (truthy(live(yes))) {
		rt.setSv(f, "invisibility", 100);
		rt.setSv(f, "anchored", 1);
		rt.setSv(f, "icon_state", null);
		rt.setSv(f, "active", 1);
		if (truthy(rt.sv(f, "tile_overlay"))) {
			rt.modField(f, rt.sv(f, "loc"), "overlays", rt.sv(f, "tile_overlay"), add);
		}
	} else {
		if (truthy(rt.sv(f, "crossed"))) {
			yield* g.srcCall(f, "trigger");
		}
		rt.setSv(f, "invisibility", rt.initial(f, live(f.src), "invisibility"));
		rt.setSv(f, "anchored", 0);
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		rt.setSv(f, "active", 0);
		if (!truthy(rt.sv(f, "tile_overlay"))) return f.dot;
		(rt.modField(f, rt.sv(f, "loc"), "overlays", rt.sv(f, "tile_overlay"), subtract));
	}
	return f.dot;
}, true);
