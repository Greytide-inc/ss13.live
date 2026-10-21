// From code/game/mecha/combat/combat.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12103, "/obj/mecha/combat", "/obj/mecha", {
	internal_damage_threshold: 50,
	force: 30,
	armor: null,
});

// /obj/mecha/combat/proc/<init>  (code/game/mecha/combat/combat.dm:4)  may sleep
rt.def("/obj/mecha/combat/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 30, "laser", 15, "energy", 20, "bomb", 20, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	return f.dot;
}, true);

// /obj/mecha/combat/proc/CheckParts  (code/game/mecha/combat/combat.dm:7)  may sleep
rt.def("/obj/mecha/combat/proc/CheckParts", function* CheckParts(f: Frame) {
	let C: Value = null, SM: Value = null;
	f.vars = () => [C, SM];
	yield* g.callSuper(f, [], rt.Args.Same);
	C = rt.locateIn(f, T("/obj/item/weapon/stock_parts/capacitor"), rt.sv(f, "contents"));
	SM = rt.locateIn(f, T("/obj/item/weapon/stock_parts/scanning_module"), rt.sv(f, "contents"));
	rt.setSv(f, "step_energy_drain", subtract(20, multiply(5, rt.fv(f, "rating", live(SM)))));
	rt.modAt(rt.sv(f, "armor"), "energy", multiply(rt.fv(f, "rating", live(C)), 10), add);
	yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(SM)]);
	return f.dot;
}, true, { args: ["parts_list"] });

// /obj/mecha/combat/proc/moved_inside  (code/game/mecha/combat/combat.dm:16)  may sleep
rt.def("/obj/mecha/combat/proc/moved_inside", function* moved_inside(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		if ((truthy(rt.fv(f, "client", live(f.args[0]))) && isEqual(rt.gv(f, "mouse_pointer_icon", rt.fv(f, "client", live(f.args[0]))), rt.initial(f, rt.fv(f, "client", live(f.args[0])), "mouse_pointer_icon")))) {
			rt.setFv(f, "mouse_pointer_icon", rt.fv(f, "client", live(f.args[0])), rt.rsc("icons/mecha/mecha_mouse.dmi"));
		}
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true, { args: ["H"] });

// /obj/mecha/combat/proc/mmi_moved_inside  (code/game/mecha/combat/combat.dm:24)  may sleep
rt.def("/obj/mecha/combat/proc/mmi_moved_inside", function* mmi_moved_inside(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		if ((truthy(rt.fv(f, "client", rt.sv(f, "occupant"))) && isEqual(rt.gv(f, "mouse_pointer_icon", rt.fv(f, "client", rt.sv(f, "occupant"))), rt.initial(f, rt.fv(f, "client", rt.sv(f, "occupant")), "mouse_pointer_icon")))) {
			rt.setFv(f, "mouse_pointer_icon", rt.fv(f, "client", rt.sv(f, "occupant")), rt.rsc("icons/mecha/mecha_mouse.dmi"));
		}
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true, { args: ["mmi_as_oc", "user"] });

// /obj/mecha/combat/proc/go_out  (code/game/mecha/combat/combat.dm:33)  may sleep
rt.def("/obj/mecha/combat/proc/go_out", function* go_out(f: Frame) {
	if (((truthy(rt.sv(f, "occupant")) && truthy(rt.fv(f, "client", rt.sv(f, "occupant")))) && isEqual(rt.gv(f, "mouse_pointer_icon", rt.fv(f, "client", rt.sv(f, "occupant"))), rt.rsc("icons/mecha/mecha_mouse.dmi")))) {
		rt.setFv(f, "mouse_pointer_icon", rt.fv(f, "client", rt.sv(f, "occupant")), rt.initial(f, rt.fv(f, "client", rt.sv(f, "occupant")), "mouse_pointer_icon"));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
