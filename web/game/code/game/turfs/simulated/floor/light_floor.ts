// From code/game/turfs/simulated/floor/light_floor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4564, "/turf/open/floor/light", "/turf/open/floor", {
	on: 1,
	state: 0,
	coloredlights: null,
	currentcolor: 1,
	can_modify_colour: 1,
	broken_states: null,
	name: "light floor",
	desc: "A wired glass tile embedded into the floor.",
	light_range: 5,
	icon_state: "light_on",
	floor_tile: rt.typePath("/obj/item/stack/tile/light"),
});

// /turf/open/floor/light/proc/<init>  (code/game/turfs/simulated/floor/light_floor.dm:7)
rt.def("/turf/open/floor/light/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "broken_states", rt.list("light_broken"));
	rt.setSv(f, "coloredlights", rt.list("g", "r", "y", "b", "p", "w", "s", "o", "g"));
	return f.dot;
});

// /turf/open/floor/light/proc/Initialize  (code/game/turfs/simulated/floor/light_floor.dm:16)  may sleep
rt.def("/turf/open/floor/light/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /turf/open/floor/light/proc/break_tile  (code/game/turfs/simulated/floor/light_floor.dm:20)
rt.def("/turf/open/floor/light/proc/break_tile", function break_tile(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "light_range", 0);
	rt.callSrc(f, "update_light", []);
	return f.dot;
});

// /turf/open/floor/light/proc/update_icon  (code/game/turfs/simulated/floor/light_floor.dm:25)
rt.def("/turf/open/floor/light/proc/update_icon", function update_icon(f: Frame) {
	let num: Value = null;
	let $0: any;
	f.vars = () => [num, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "on"))) {
		$0 = rt.sv(f, "state");
		if ($0 === 0) {
			rt.setSv(f, "icon_state", fmt("light_on-＀", [rt.index(rt.sv(f, "coloredlights"), rt.sv(f, "currentcolor"))]));
			rt.callSrc(f, "set_light", [1]);
		} else if ($0 === 1) {
			rt.setSv(f, "icon_state", fmt("light_on_flicker＀", [(num = rt.op(f, "PickUnweighted", [4], ["1", "2", "3", "4"]))]));
			rt.callSrc(f, "set_light", [1]);
		} else if ($0 === 2) {
			rt.setSv(f, "icon_state", "light_on_broken");
			rt.callSrc(f, "set_light", [1]);
		} else if ($0 === 3) {
			rt.setSv(f, "icon_state", "light_off");
			rt.callSrc(f, "set_light", [0]);
		}
	} else {
		rt.callSrc(f, "set_light", [0]);
		rt.setSv(f, "icon_state", "light_off");
	}
	return f.dot;
});

// /turf/open/floor/light/proc/ChangeTurf  (code/game/turfs/simulated/floor/light_floor.dm:47)  may sleep
rt.def("/turf/open/floor/light/proc/ChangeTurf", function* ChangeTurf(f: Frame) {
	yield* g.srcCall(f, "set_light", 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["T"] });

// /turf/open/floor/light/proc/attack_hand  (code/game/turfs/simulated/floor/light_floor.dm:51)  may sleep
rt.def("/turf/open/floor/light/proc/attack_hand", function* attack_hand(f: Frame) {
	if (!truthy(rt.sv(f, "can_modify_colour"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "on", 1);
		rt.setSv(f, "currentcolor", 1);
		return live(f.dot);
	} else {
		rt.incSrcVar(f, "currentcolor", 1, true);
	}
	if (rt.gt(rt.sv(f, "currentcolor"), rt.len(f, rt.sv(f, "coloredlights")))) {
		rt.setSv(f, "on", 0);
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /turf/open/floor/light/proc/attack_ai  (code/game/turfs/simulated/floor/light_floor.dm:65)  may sleep
rt.def("/turf/open/floor/light/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /turf/open/floor/light/proc/attackby  (code/game/turfs/simulated/floor/light_floor.dm:68)  may sleep
rt.def("/turf/open/floor/light/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/light/bulb")) ? 1 : 0))) return f.dot;
	if ((truthy(rt.sv(f, "state")) && truthy((yield* g.callName(f, live(f.args[1]), "drop_item", []))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		rt.setSv(f, "state", 0);
		yield* g.srcCall(f, "update_icon");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You replace the light bulb.</span>"]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The lightbulb seems fine, no need to replace it.</span>"]);
	}
	return f.dot;
}, true, { args: ["C", "user", "params"] });

rt.type(4565, "/turf/open/floor/light/colour_cycle", "/turf/open/floor/light", {
	coloredlights: null,
	can_modify_colour: 0,
});

// /turf/open/floor/light/colour_cycle/proc/<init>  (code/game/turfs/simulated/floor/light_floor.dm:82)
rt.def("/turf/open/floor/light/colour_cycle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "coloredlights", rt.list("cycle_all"));
	return f.dot;
});

rt.type(4566, "/turf/open/floor/light/colour_cycle/dancefloor_a", "/turf/open/floor/light/colour_cycle", {
	coloredlights: null,
	name: "dancefloor",
	desc: "Funky floor.",
});

// /turf/open/floor/light/colour_cycle/dancefloor_a/proc/<init>  (code/game/turfs/simulated/floor/light_floor.dm:92)
rt.def("/turf/open/floor/light/colour_cycle/dancefloor_a/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "coloredlights", rt.list("dancefloor_A"));
	return f.dot;
});

rt.type(4567, "/turf/open/floor/light/colour_cycle/dancefloor_b", "/turf/open/floor/light/colour_cycle", {
	coloredlights: null,
	name: "dancefloor",
	desc: "Funky floor.",
});

// /turf/open/floor/light/colour_cycle/dancefloor_b/proc/<init>  (code/game/turfs/simulated/floor/light_floor.dm:97)
rt.def("/turf/open/floor/light/colour_cycle/dancefloor_b/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "coloredlights", rt.list("dancefloor_B"));
	return f.dot;
});
