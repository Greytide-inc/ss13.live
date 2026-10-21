// From code/modules/mob/living/silicon/pai/pai_shell.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/pai/proc/fold_out  (code/modules/mob/living/silicon/pai/pai_shell.dm:3)  may sleep
rt.def("/mob/living/silicon/pai/proc/fold_out", function* fold_out(f: Frame, force: Value) {
	let _P: Value = null, L: Value = null;
	f.vars = () => [force, _P, L];
	if (live(force) === null) {
		force = 0;
	}
	if (rt.lt(rt.sv(f, "emitterhealth"), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your holochassis emitters are still too unstable! Please wait for automatic repair.</span>"]);
		return 0;
	}
	if ((!truthy(rt.sv(f, "canholo")) && !truthy(live(force)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your master or another force has disabled your holochassis emitters!</span>"]);
		return 0;
	}
	if (truthy(rt.sv(f, "holoform"))) {
		f.dot = (yield* g.srcCall(f, "fold_in", live(force)));
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "emittersemicd"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Error: Holochassis emitters recycling. Please try again later.</span>"]);
		return 0;
	}
	rt.setSv(f, "emittersemicd", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/silicon/pai/proc/emittercool")])), rt.sv(f, "emittercd")]);
	rt.setSv(f, "canmove", 1);
	rt.setSv(f, "density", 1);
	if (truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "card")), T("/obj/item/device/pda")) ? 1 : 0))) {
		rt.setFv(f, "pai", (_P = rt.fv(f, "loc", rt.sv(f, "card"))), null);
		yield* g.callName(f, live(_P), "visible_message", [fmt("<span class='notice'>＀ ejects itself from ＀!</span>", [live(f.src), live(_P)])]);
	}
	if (truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "card")), T("/mob/living")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, (L = rt.fv(f, "loc", rt.sv(f, "card"))), "temporarilyRemoveItemFromInventory", [rt.sv(f, "card")])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Error: Unable to expand to mobile form. Chassis is restrained by some device or person.</span>"]);
			return 0;
		}
	}
	yield* g.srcCall(f, "forceMove", rt.getStep(f, rt.sv(f, "card"), 0));
	yield* g.callName(f, rt.sv(f, "card"), "forceMove", [live(f.src)]);
	if (truthy(rt.sv(f, "client"))) {
		rt.setFv(f, "perspective", rt.sv(f, "client"), 1);
		rt.setFv(f, "eye", rt.sv(f, "client"), live(f.src));
	}
	yield* g.srcCall(f, "set_light", 0);
	rt.setSv(f, "icon_state", fmt("＀", [rt.sv(f, "chassis")]));
	yield* g.srcCall(f, "visible_message", fmt("<span class='boldnotice'>＀ folds out its holochassis emitter and forms a holoshell around itself!</span>", [live(f.src)]));
	rt.setSv(f, "holoform", 1);
	return f.dot;
}, true);

// /mob/living/silicon/pai/proc/fold_in  (code/modules/mob/living/silicon/pai/pai_shell.dm:47)  may sleep
rt.def("/mob/living/silicon/pai/proc/fold_in", function* fold_in(f: Frame, force: Value) {
	let _T: Value = null;
	f.vars = () => [force, _T];
	if (live(force) === null) {
		force = 0;
	}
	rt.setSv(f, "emittersemicd", 1);
	if (!truthy(live(force))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/silicon/pai/proc/emittercool")])), rt.sv(f, "emittercd")]);
	} else {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/silicon/pai/proc/emittercool")])), rt.sv(f, "emitteroverloadcd")]);
	}
	rt.setSv(f, "icon_state", fmt("＀", [rt.sv(f, "chassis")]));
	if (!truthy(rt.sv(f, "holoform"))) {
		f.dot = (yield* g.srcCall(f, "fold_out", live(force)));
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ deactivates its holochassis emitter and folds back into a compact card!</span>", [live(f.src)]));
	yield* g.srcCall(f, "stop_pulling");
	if (truthy(rt.sv(f, "client"))) {
		rt.setFv(f, "perspective", rt.sv(f, "client"), 1);
		rt.setFv(f, "eye", rt.sv(f, "client"), rt.sv(f, "card"));
	}
	_T = rt.getStep(f, live(f.src), 0);
	yield* g.callName(f, rt.sv(f, "card"), "forceMove", [live(_T)]);
	yield* g.srcCall(f, "forceMove", rt.sv(f, "card"));
	rt.setSv(f, "canmove", 0);
	rt.setSv(f, "density", 0);
	yield* g.srcCall(f, "set_light", 0);
	rt.setSv(f, "holoform", 0);
	if (!truthy(rt.sv(f, "resting"))) return f.dot;
	yield* g.srcCall(f, "lay_down");
	return f.dot;
}, true);

// /mob/living/silicon/pai/proc/choose_chassis  (code/modules/mob/living/silicon/pai/pai_shell.dm:71)  may sleep
rt.def("/mob/living/silicon/pai/proc/choose_chassis", function* choose_chassis(f: Frame) {
	let choice: Value = null;
	f.vars = () => [choice];
	if (!truthy((choice = (yield* g.op(f, "Prompt", [1], [null, null, "What would you like to use for your holochassis composite?", live(f.src), rt.sv(f, "possible_chassis")]))))) {
		return 0;
	}
	rt.setSv(f, "chassis", live(choice));
	rt.setSv(f, "icon_state", fmt("＀", [rt.sv(f, "chassis")]));
	if (truthy(rt.sv(f, "resting"))) {
		rt.setSv(f, "icon_state", fmt("＀_rest", [rt.sv(f, "chassis")]));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='boldnotice'>You switch your holochassis projection composite to ＀</span>", [rt.sv(f, "chassis")])]);
	return f.dot;
}, true);

// /mob/living/silicon/pai/proc/lay_down  (code/modules/mob/living/silicon/pai/pai_shell.dm:81)  may sleep
rt.def("/mob/living/silicon/pai/proc/lay_down", function* lay_down(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_resting_icon", rt.sv(f, "resting"));
	return f.dot;
}, true);

// /mob/living/silicon/pai/proc/update_resting_icon  (code/modules/mob/living/silicon/pai/pai_shell.dm:86)
rt.def("/mob/living/silicon/pai/proc/update_resting_icon", function update_resting_icon(f: Frame, rest: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy(live(rest))) {
		rt.setSv(f, "icon_state", fmt("＀_rest", [rt.sv(f, "chassis")]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀", [rt.sv(f, "chassis")]));
	}
	if (isEqual(rt.sv(f, "loc"), rt.sv(f, "card"))) return f.dot;
	$0 = live(f.src);
	if (truthy(live(rest))) {
		$1 = "lays down for a moment...";
	} else {
		$1 = "perks up from the ground";
	}
	rt.callSrc(f, "visible_message", [fmt("<span class='notice'>＀ ＀</span>", [$0, $1])]);
	return f.dot;
});

// /mob/living/silicon/pai/proc/toggle_integrated_light  (code/modules/mob/living/silicon/pai/pai_shell.dm:96)
rt.def("/mob/living/silicon/pai/proc/toggle_integrated_light", function toggle_integrated_light(f: Frame) {
	if (!truthy(rt.sv(f, "luminosity"))) {
		rt.callSrc(f, "set_light", [rt.sv(f, "brightness_power")]);
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You enable your integrated light.</span>"]);
	} else {
		rt.callSrc(f, "set_light", [0]);
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You disable your integrated light.</span>"]);
	}
	return f.dot;
});

// /mob/living/silicon/pai/proc/movement_delay  (code/modules/mob/living/silicon/pai/pai_shell.dm:104)
rt.def("/mob/living/silicon/pai/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	f.dot = rt.modify(live(f.dot), 1, add);
	return f.dot;
});
