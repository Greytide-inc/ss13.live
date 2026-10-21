// From code/game/machinery/porta_turret/portable_turret_construct.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10870, "/obj/machinery/porta_turret_construct", "/obj/machinery", {
	build_step: 0,
	finish_name: "turret",
	installed_gun: null,
	name: "turret frame",
	icon: rt.rsc("icons/obj/turrets.dmi"),
	icon_state: "turret_frame",
	density: 1,
});

// /obj/machinery/porta_turret_construct/proc/attackby  (code/game/machinery/porta_turret/portable_turret_construct.dm:22)  may sleep
rt.def("/obj/machinery/porta_turret_construct/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null, WT: Value = null, E: Value = null, turret: Value = null, t: Value = null;
	let $0: any;
	f.vars = () => [M, WT, E, turret, t, $0];
	$0 = rt.sv(f, "build_step");
	if ($0 === 0) {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.sv(f, "anchored")))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You secure the external bolts.</span>"]);
			rt.setSv(f, "anchored", 1);
			rt.setSv(f, "build_step", 1);
			return live(f.dot);
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0)) && !truthy(rt.sv(f, "anchored")))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You dismantle the turret construction.</span>"]);
				yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 5]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				return live(f.dot);
			}
		}
	} else if ($0 === 1) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/metal")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (M = live(f.args[0])), "use", [2])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add some metal armor to the interior frame.</span>"]);
				rt.setSv(f, "build_step", 2);
				rt.setSv(f, "icon_state", "turret_frame2");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need two sheets of metal to continue construction!</span>"]);
			}
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unfasten the external bolts.</span>"]);
				rt.setSv(f, "anchored", 0);
				rt.setSv(f, "build_step", 0);
				return live(f.dot);
			}
		}
	} else if ($0 === 2) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You bolt the metal armor into place.</span>"]);
			rt.setSv(f, "build_step", 3);
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, (WT = live(f.args[0])), "isOn", [])))) {
					return live(f.dot);
				}
				if (rt.lt((yield* g.callName(f, live(WT), "get_fuel", [])), 5)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more fuel to complete this task!</span>"]);
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start to remove the turret's interior metal armor...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if ((!truthy((yield* g.callName(f, live(WT), "isOn", []))) || !truthy((yield* g.callName(f, live(WT), "remove_fuel", [5, live(f.args[1])]))))) {
						return live(f.dot);
					}
					rt.setSv(f, "build_step", 1);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the turret's interior metal armor.</span>"]);
					yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]);
					return live(f.dot);
				}
			}
		}
	} else if ($0 === 3) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gun/energy")) ? 1 : 0))) {
			E = live(f.args[0]);
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(E), "forceMove", [live(f.src)]);
			rt.setSv(f, "installed_gun", live(E));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to the turret.</span>", [live(f.args[0])])]);
			rt.setSv(f, "build_step", 4);
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the turret's metal armor bolts.</span>"]);
				rt.setSv(f, "build_step", 2);
				return live(f.dot);
			}
		}
	} else if ($0 === 4) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/prox_sensor")) ? 1 : 0))) {
			rt.setSv(f, "build_step", 5);
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the proximity sensor to the turret.</span>"]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			return live(f.dot);
		}
	} else if ($0 === 5) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			rt.setSv(f, "build_step", 6);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You close the internal access hatch.</span>"]);
			return live(f.dot);
		}
	} else if ($0 === 6) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/metal")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (M = live(f.args[0])), "use", [2])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add some metal armor to the exterior frame.</span>"]);
				rt.setSv(f, "build_step", 7);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need two sheets of metal to continue construction!</span>"]);
			}
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
				rt.setSv(f, "build_step", 5);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You open the internal access hatch.</span>"]);
				return live(f.dot);
			}
		}
	} else if ($0 === 7) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (!truthy((yield* g.callName(f, (WT = live(f.args[0])), "isOn", [])))) {
				return live(f.dot);
			}
			if (rt.lt((yield* g.callName(f, live(WT), "get_fuel", [])), 5)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more fuel to complete this task!</span>"]);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You begin to weld the turret's armor down...</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if ((!truthy((yield* g.callName(f, live(WT), "isOn", []))) || !truthy((yield* g.callName(f, live(WT), "remove_fuel", [5, live(f.args[1])]))))) {
					return live(f.dot);
				}
				rt.setSv(f, "build_step", 8);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You weld the turret's armor down.</span>"]);
				turret = null;
				if ((truthy((rt.istype(rt.sv(f, "installed_gun"), T("/obj/item/weapon/gun/energy/laser/bluetag")) ? 1 : 0)) || truthy((rt.istype(rt.sv(f, "installed_gun"), T("/obj/item/weapon/gun/energy/laser/redtag")) ? 1 : 0)))) {
					turret = (yield* g.new_(f, T("/obj/machinery/porta_turret/lasertag"), [rt.sv(f, "loc")]));
				} else {
					turret = (yield* g.new_(f, T("/obj/machinery/porta_turret"), [rt.sv(f, "loc")]));
				}
				rt.setFv(f, "name", live(turret), rt.sv(f, "finish_name"));
				rt.setFv(f, "installation", live(turret), rt.fv(f, "type", rt.sv(f, "installed_gun")));
				yield* g.callName(f, live(turret), "setup", [rt.sv(f, "installed_gun")]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You pry off the turret's exterior armor.</span>"]);
				yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]);
				rt.setSv(f, "build_step", 6);
				return live(f.dot);
			}
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
		if (!truthy((t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Enter new turret name", rt.sv(f, "name"), rt.sv(f, "finish_name")]))))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.srcCall(f, "Adjacent", live(f.args[1]))))) {
			return live(f.dot);
		}
		rt.setSv(f, "finish_name", live(t));
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/porta_turret_construct/proc/attack_hand  (code/game/machinery/porta_turret/portable_turret_construct.dm:183)  may sleep
rt.def("/obj/machinery/porta_turret_construct/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [user, $0];
	$0 = rt.sv(f, "build_step");
	if ($0 === 4) {
		rt.setSv(f, "build_step", 3);
		yield* g.callName(f, rt.sv(f, "installed_gun"), "forceMove", [rt.sv(f, "loc")]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove ＀ from the turret frame.</span>", [rt.sv(f, "installed_gun")])]);
		rt.setSv(f, "installed_gun", null);
	} else if ($0 === 5) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You remove the prox sensor from the turret frame.</span>"]);
		yield* g.new_(f, T("/obj/item/device/assembly/prox_sensor"), [rt.sv(f, "loc")]);
		rt.setSv(f, "build_step", 4);
	}
	return f.dot;
}, true);

// /obj/machinery/porta_turret_construct/proc/Destroy  (code/game/machinery/porta_turret/portable_turret_construct.dm:201)  may sleep
rt.def("/obj/machinery/porta_turret_construct/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "installed_gun"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "installed_gun")]);
		rt.setSv(f, "installed_gun", null);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);
