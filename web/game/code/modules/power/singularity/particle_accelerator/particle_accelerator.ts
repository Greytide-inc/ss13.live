// From code/modules/power/singularity/particle_accelerator/particle_accelerator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12978, "/obj/structure/particle_accelerator", "/obj/structure", {
	master: null,
	construction_state: 0,
	reference: null,
	powered: 0,
	strength: null,
	anchored: 0,
	name: "Particle Accelerator",
	desc: "Part of a Particle Accelerator.",
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	icon_state: "none",
	density: 1,
	obj_integrity: 500,
	max_integrity: 500,
	armor: null,
});

// /obj/structure/particle_accelerator/proc/<init>  (code/modules/power/singularity/particle_accelerator/particle_accelerator.dm:31)
rt.def("/obj/structure/particle_accelerator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 20, "laser", 20, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 90, "acid", 80]));
	return f.dot;
});

// /obj/structure/particle_accelerator/proc/examine  (code/modules/power/singularity/particle_accelerator/particle_accelerator.dm:40)
rt.def("/obj/structure/particle_accelerator/proc/examine", function examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "construction_state");
	if ($0 === 0) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "Looks like it's not attached to the flooring"]);
	} else if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It is missing some cables"]);
	} else if ($0 === 2) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "The panel is open"]);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Alt-click to rotate it clockwise.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/particle_accelerator/proc/Destroy  (code/modules/power/singularity/particle_accelerator/particle_accelerator.dm:55)  may sleep
rt.def("/obj/structure/particle_accelerator/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "construction_state", 0);
	if (truthy(rt.sv(f, "master"))) {
		(rt.modField(f, rt.sv(f, "master"), "connected_parts", live(f.src), subtract));
		rt.setFv(f, "assembled", rt.sv(f, "master"), 0);
		rt.setSv(f, "master", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/particle_accelerator/verb/rotate  (code/modules/power/singularity/particle_accelerator/particle_accelerator.dm:65)
rt.def("/obj/structure/particle_accelerator/verb/rotate", function rotate(f: Frame) {
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "anchored"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "It is fastened to the floor!"]);
		return 0;
	}
	rt.callSrc(f, "setDir", [rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), -90])]);
	return 1;
}, false, { verb: { name: "Rotate Clockwise", category: "Object", src: 3, range: 1 } });

// /obj/structure/particle_accelerator/proc/AltClick  (code/modules/power/singularity/particle_accelerator/particle_accelerator.dm:74)  may sleep
rt.def("/obj/structure/particle_accelerator/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 1)) {
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "rotate");
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/particle_accelerator/verb/rotateccw  (code/modules/power/singularity/particle_accelerator/particle_accelerator.dm:88)
rt.def("/obj/structure/particle_accelerator/verb/rotateccw", function rotateccw(f: Frame) {
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "anchored"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "It is fastened to the floor!"]);
		return 0;
	}
	rt.callSrc(f, "setDir", [rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 90])]);
	return 1;
}, false, { verb: { name: "Rotate Counter Clockwise", category: "Object", src: 3, range: 1 } });

// /obj/structure/particle_accelerator/proc/attackby  (code/modules/power/singularity/particle_accelerator/particle_accelerator.dm:99)  may sleep
rt.def("/obj/structure/particle_accelerator/proc/attackby", function* attackby(f: Frame) {
	let did_something: Value = null, CC: Value = null;
	let $0: any;
	f.vars = () => [did_something, CC, $0];
	did_something = 0;
	$0 = rt.sv(f, "construction_state");
	if ($0 === 0) {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy((yield* g.srcCall(f, "isinspace"))))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
			rt.setSv(f, "anchored", 1);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ secures the ＀ to the floor.", [rt.fv(f, "name", live(f.args[1])), rt.sv(f, "name")]), "You secure the external bolts."]);
			rt.setSv(f, "construction_state", 1);
			did_something = 1;
		}
	} else if ($0 === 1) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
			rt.setSv(f, "anchored", 0);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ detaches the ＀ from the floor.", [rt.fv(f, "name", live(f.args[1])), rt.sv(f, "name")]), "You remove the external bolts."]);
			rt.setSv(f, "construction_state", 0);
			did_something = 1;
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
				if (truthy((yield* g.callName(f, (CC = live(f.args[0])), "use", [1])))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ adds wires to the ＀.", [rt.fv(f, "name", live(f.args[1])), rt.sv(f, "name")]), "You add some wires."]);
					rt.setSv(f, "construction_state", 2);
					did_something = 1;
				}
			}
		}
	} else if ($0 === 2) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ removes some wires from the ＀.", [rt.fv(f, "name", live(f.args[1])), rt.sv(f, "name")]), "You remove some wires."]);
			rt.setSv(f, "construction_state", 1);
			did_something = 1;
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ closes the ＀'s access panel.", [rt.fv(f, "name", live(f.args[1])), rt.sv(f, "name")]), "You close the access panel."]);
				rt.setSv(f, "construction_state", 3);
				did_something = 1;
			}
		}
	} else if ($0 === 3) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ opens the ＀'s access panel.", [rt.fv(f, "name", live(f.args[1])), rt.sv(f, "name")]), "You open the access panel."]);
			rt.setSv(f, "construction_state", 2);
			did_something = 1;
		}
	}
	if (truthy(live(did_something))) {
		yield* g.callName(f, live(f.args[1]), "changeNext_move", [8]);
		yield* g.srcCall(f, "update_state");
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/structure/particle_accelerator/proc/deconstruct  (code/modules/power/singularity/particle_accelerator/particle_accelerator.dm:151)  may sleep
rt.def("/obj/structure/particle_accelerator/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 5]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/particle_accelerator/proc/Move  (code/modules/power/singularity/particle_accelerator/particle_accelerator.dm:156)  may sleep
rt.def("/obj/structure/particle_accelerator/proc/Move", function* Move(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "master")) && truthy(rt.fv(f, "active", rt.sv(f, "master"))))) return f.dot;
	yield* g.callName(f, rt.sv(f, "master"), "toggle_power", []);
	yield* g.srcCall(f, "investigate_log", "was moved whilst active; it <font color='red'>powered down</font>.", "singulo");
	return f.dot;
}, true);

// /obj/structure/particle_accelerator/proc/update_icon  (code/modules/power/singularity/particle_accelerator/particle_accelerator.dm:163)
rt.def("/obj/structure/particle_accelerator/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "construction_state");
	if ($0 === 0 || $0 === 1) {
		rt.setSv(f, "icon_state", fmt("＀", [rt.sv(f, "reference")]));
	} else if ($0 === 2) {
		rt.setSv(f, "icon_state", fmt("＀w", [rt.sv(f, "reference")]));
	} else if ($0 === 3) {
		if (truthy(rt.sv(f, "powered"))) {
			rt.setSv(f, "icon_state", fmt("＀p＀", [rt.sv(f, "reference"), rt.sv(f, "strength")]));
		} else {
			rt.setSv(f, "icon_state", fmt("＀c", [rt.sv(f, "reference")]));
		}
	}
	return f.dot;
});

// /obj/structure/particle_accelerator/proc/update_state  (code/modules/power/singularity/particle_accelerator/particle_accelerator.dm:176)
rt.def("/obj/structure/particle_accelerator/proc/update_state", function update_state(f: Frame) {
	if (!truthy(rt.sv(f, "master"))) return f.dot;
	rt.callName(f, rt.sv(f, "master"), "update_state", []);
	return f.dot;
});

// /obj/structure/particle_accelerator/proc/connect_master  (code/modules/power/singularity/particle_accelerator/particle_accelerator.dm:179)
rt.def("/obj/structure/particle_accelerator/proc/connect_master", function connect_master(f: Frame, O: Value) {
	if (isEqual(rt.fv(f, "dir", live(O)), rt.sv(f, "dir"))) {
		rt.setSv(f, "master", live(O));
		return 1;
	}
	return 0;
});
