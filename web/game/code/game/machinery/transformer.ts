// From code/game/machinery/transformer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10855, "/obj/machinery/transformer", "/obj/machinery", {
	transform_dead: 0,
	transform_standing: 0,
	cooldown_duration: 600,
	cooldown: 0,
	cooldown_timer: null,
	robot_cell_charge: 5000,
	countdown: null,
	masterAI: null,
	anchored: 1,
	name: "１Automatic Robotic Factory 5000",
	desc: "A large metallic machine with an entrance and an exit. A sign on the side reads, 'human go in, robot come out'. The human must be lying down and alive. Has to cooldown between each use.",
	icon: rt.rsc("icons/obj/recycling.dmi"),
	icon_state: "separator-AO1",
	layer: 4.5,
	density: 0,
});

// /obj/machinery/transformer/proc/Initialize  (code/game/machinery/transformer.dm:22)  may sleep
rt.def("/obj/machinery/transformer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.new_(f, T("/obj/machinery/conveyor/auto"), [rt.locate(subtract(rt.sv(f, "x"), 1), rt.sv(f, "y"), rt.sv(f, "z")), 8]);
	yield* g.new_(f, T("/obj/machinery/conveyor/auto"), [rt.sv(f, "loc"), 8]);
	yield* g.new_(f, T("/obj/machinery/conveyor/auto"), [rt.locate(add(rt.sv(f, "x"), 1), rt.sv(f, "y"), rt.sv(f, "z")), 8]);
	rt.setSv(f, "countdown", (yield* g.new_(f, T("/obj/effect/countdown/transformer"), [live(f.src)])));
	yield* g.callName(f, rt.sv(f, "countdown"), "start", []);
	return f.dot;
}, true);

// /obj/machinery/transformer/proc/examine  (code/game/machinery/transformer.dm:30)
rt.def("/obj/machinery/transformer/proc/examine", function examine(f: Frame) {
	let seconds_remaining: Value = null;
	f.vars = () => [seconds_remaining];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "cooldown")) && (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0))))) return f.dot;
	seconds_remaining = divide(subtract(rt.sv(f, "cooldown_timer"), rt.worldTime(f)), 10);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("It will be ready in ＀ seconds.", [rt.call(f, P("/proc/max"), null, [0, live(seconds_remaining)])])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/transformer/proc/Destroy  (code/game/machinery/transformer.dm:37)  may sleep
rt.def("/obj/machinery/transformer/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "countdown"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "countdown")]);
	}
	rt.setSv(f, "countdown", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/transformer/proc/power_change  (code/game/machinery/transformer.dm:42)
rt.def("/obj/machinery/transformer/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/transformer/proc/update_icon  (code/game/machinery/transformer.dm:46)
rt.def("/obj/machinery/transformer/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) || isEqual(rt.sv(f, "cooldown"), 1))) {
		rt.setSv(f, "icon_state", "separator-AO0");
	} else {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	}
	return f.dot;
});

// /obj/machinery/transformer/proc/Bumped  (code/game/machinery/transformer.dm:53)  may sleep
rt.def("/obj/machinery/transformer/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let move_dir: Value = null, H: Value = null;
	f.vars = () => [AM, move_dir, H];
	if (isEqual(rt.sv(f, "cooldown"), 1)) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(AM), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	move_dir = rt.getDir(f, rt.sv(f, "loc"), rt.fv(f, "loc", live(AM)));
	H = live(AM);
	if (!((truthy(rt.sv(f, "transform_standing")) || truthy(rt.fv(f, "lying", live(H)))) && isEqual(live(move_dir), 4))) return f.dot;
	rt.setFv(f, "loc", live(AM), rt.fv(f, "loc", live(f.src)));
	yield* g.srcCall(f, "do_transform", live(AM));
	return f.dot;
}, true);

// /obj/machinery/transformer/proc/CanPass  (code/game/machinery/transformer.dm:68)
rt.def("/obj/machinery/transformer/proc/CanPass", function CanPass(f: Frame) {
	let dir: Value = null;
	f.vars = () => [dir];
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (isEqual((dir = rt.getDir(f, live(f.src), live(f.args[0]))), 4)) {
			return rt.callSuper(f, [], rt.Args.Same);
		}
	}
	return 0;
}, false, { args: ["mover", "target", "height"] });

// /obj/machinery/transformer/proc/process  (code/game/machinery/transformer.dm:75)
rt.def("/obj/machinery/transformer/proc/process", function process(f: Frame) {
	if (!(truthy(rt.sv(f, "cooldown")) && rt.le(rt.sv(f, "cooldown_timer"), rt.worldTime(f)))) return f.dot;
	rt.setSv(f, "cooldown", 0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/transformer/proc/do_transform  (code/game/machinery/transformer.dm:80)  may sleep
rt.def("/obj/machinery/transformer/proc/do_transform", function* do_transform(f: Frame, H: Value) {
	let R: Value = null;
	f.vars = () => [H, R];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "cooldown"), 1)) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "transform_dead")) && isEqual(rt.fv(f, "stat", live(H)), 2))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 0]);
		return live(f.dot);
	}
	rt.setSv(f, "cooldown", 1);
	rt.setSv(f, "cooldown_timer", add(rt.worldTime(f), rt.sv(f, "cooldown_duration")));
	yield* g.srcCall(f, "update_icon");
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 50, 1]);
	yield* g.callName(f, live(H), "emote", ["scream"]);
	yield* g.callName(f, live(H), "adjustBruteLoss", [(yield* g.call(f, P("/proc/max"), null, [0, subtract(80, (yield* g.callName(f, live(H), "getBruteLoss", [])))]))]);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	yield* g.srcCall(f, "use_power", 5000);
	rt.setFv(f, "maxcharge", rt.gv(f, "cell", (R = (yield* g.callName(f, live(H), "Robotize", [])))), rt.sv(f, "robot_cell_charge"));
	rt.setFv(f, "charge", rt.fv(f, "cell", live(R)), rt.sv(f, "robot_cell_charge"));
	yield* g.callName(f, live(R), "SetLockdown", []);
	if (truthy(rt.sv(f, "masterAI"))) {
		rt.setFv(f, "connected_ai", live(R), rt.sv(f, "masterAI"));
		yield* g.callName(f, live(R), "lawsync", []);
		rt.setFv(f, "lawupdate", live(R), 1);
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/transformer/proc/unlock_new_robot"), live(R)])), 50]);
	return f.dot;
}, true);

// /obj/machinery/transformer/proc/unlock_new_robot  (code/game/machinery/transformer.dm:116)  may sleep
rt.def("/obj/machinery/transformer/proc/unlock_new_robot", function* unlock_new_robot(f: Frame, R: Value) {
	f.vars = () => [R];
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/ping.ogg"), 50, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [30]);
	if (!truthy(live(R))) return f.dot;
	yield* g.callName(f, live(R), "SetLockdown", [0]);
	yield* g.callName(f, live(R), "notify_ai", [1]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/silicon/robot" }] });
