// From code/modules/power/singularity/collector.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalrad_collectors  (code/modules/power/singularity/collector.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalrad_collectors", function InitGlobalrad_collectors(f: Frame) {
	rt.setGl("rad_collectors", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "rad_collectors", add);
	return f.dot;
});

rt.type(10328, "/obj/machinery/power/rad_collector", "/obj/machinery/power", {
	loaded_tank: null,
	last_power: 0,
	active: 0,
	locked: 0,
	drainratio: 1,
	anchored: 0,
	name: "Radiation Collector Array",
	desc: "A device which uses Hawking Radiation and plasma to produce power.",
	icon: rt.rsc("icons/obj/singularity.dmi"),
	icon_state: "ca",
	density: 1,
	req_access: null,
	obj_integrity: 350,
	max_integrity: 350,
	integrity_failure: 80,
});

// /obj/machinery/power/rad_collector/proc/<init>  (code/modules/power/singularity/collector.dm:11)
rt.def("/obj/machinery/power/rad_collector/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(11));
	return f.dot;
});

// /obj/machinery/power/rad_collector/proc/New  (code/modules/power/singularity/collector.dm:23)  may sleep
rt.def("/obj/machinery/power/rad_collector/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("rad_collectors", live(f.src), add);
	return f.dot;
}, true);

// /obj/machinery/power/rad_collector/proc/Destroy  (code/modules/power/singularity/collector.dm:27)  may sleep
rt.def("/obj/machinery/power/rad_collector/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("rad_collectors", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/power/rad_collector/proc/process  (code/modules/power/singularity/collector.dm:32)
rt.def("/obj/machinery/power/rad_collector/proc/process", function process(f: Frame) {
	if (truthy(rt.sv(f, "loaded_tank"))) {
		if (!truthy(rt.index(rt.gv(f, "gases", rt.fv(f, "air_contents", rt.sv(f, "loaded_tank"))), "plasma"))) {
			rt.callSrc(f, "investigate_log", ["<font color='red'>out of fuel</font>.", "singulo"]);
			rt.callSrc(f, "eject", []);
		} else {
			(rt.modAt(rt.index(rt.gv(f, "gases", rt.fv(f, "air_contents", rt.sv(f, "loaded_tank"))), "plasma"), 1, multiply(0.0010000000474974513, rt.sv(f, "drainratio")), subtract));
			rt.callName(f, rt.fv(f, "air_contents", rt.sv(f, "loaded_tank")), "garbage_collect", []);
		}
	}
	return live(f.dot);
}, false, { waitfor: false });

// /obj/machinery/power/rad_collector/proc/attack_hand  (code/modules/power/singularity/collector.dm:42)  may sleep
rt.def("/obj/machinery/power/rad_collector/proc/attack_hand", function* attack_hand(f: Frame) {
	let fuel: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [fuel, $0, $1, $2, $3];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "anchored"))) return f.dot;
	if (!truthy(rt.fv(f, "locked", live(f.src)))) {
		yield* g.srcCall(f, "toggle_power");
		$0 = live(f.args[0]);
		$1 = rt.fv(f, "name", live(f.args[0]));
		$2 = rt.fv(f, "name", live(f.src));
		if (truthy(rt.sv(f, "active"))) {
			$3 = "on";
		} else {
			$3 = "off";
		}
		$1 = fmt("＀ turns the ＀ ＀.", [$1, $2, $3]);
		$2 = rt.fv(f, "name", live(f.src));
		if (truthy(rt.sv(f, "active"))) {
			$3 = "on";
		} else {
			$3 = "off";
		}
		yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You turn the ＀ ＀.</span>", [$2, $3])]);
		fuel = null;
		if (truthy(rt.sv(f, "loaded_tank"))) {
			fuel = rt.index(rt.gv(f, "gases", rt.fv(f, "air_contents", rt.sv(f, "loaded_tank"))), "plasma");
		}
		if (truthy(live(fuel))) {
			$0 = rt.index(live(fuel), 1);
		} else {
			$0 = 0;
		}
		fuel = $0;
		if (truthy(rt.sv(f, "active"))) {
			$0 = "<font color='green'>on</font>";
		} else {
			$0 = "<font color='red'>off</font>";
		}
		$1 = rt.fv(f, "key", live(f.args[0]));
		if (truthy(rt.sv(f, "loaded_tank"))) {
			$2 = fmt("Fuel: ＀%", [(yield* g.call(f, P("/proc/round"), null, [divide(live(fuel), 0.28999999165534973)]))]);
		} else {
			$2 = "<font color='red'>It is empty</font>";
		}
		yield* g.srcCall(f, "investigate_log", fmt("turned ＀ by ＀. ＀.", [$0, $1, $2]), "singulo");
		return live(f.dot);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The controls are locked!</span>"]);
		return live(f.dot);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/power/rad_collector/proc/can_be_unfasten_wrench  (code/modules/power/singularity/collector.dm:62)
rt.def("/obj/machinery/power/rad_collector/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame) {
	if (truthy(rt.sv(f, "loaded_tank"))) {
		if (!truthy(live(f.args[1]))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Remove the plasma tank first!</span>"]);
		}
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user", "silent"] });

// /obj/machinery/power/rad_collector/proc/default_unfasten_wrench  (code/modules/power/singularity/collector.dm:68)  may sleep
rt.def("/obj/machinery/power/rad_collector/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!isEqual(live(f.dot), 2)) return f.dot;
	if (truthy(rt.sv(f, "anchored"))) {
		yield* g.srcCall(f, "connect_to_network");
	} else {
		yield* g.srcCall(f, "disconnect_from_network");
	}
	return f.dot;
}, true, { args: ["user", "W", "time"] });

// /obj/machinery/power/rad_collector/proc/attackby  (code/modules/power/singularity/collector.dm:76)  may sleep
rt.def("/obj/machinery/power/rad_collector/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>The ＀ detects that ＀W were recently produced.</span>", [rt.fv(f, "name", live(f.args[0])), rt.sv(f, "last_power")])]);
		return 1;
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/analyzer")) ? 1 : 0)) && truthy(rt.sv(f, "loaded_tank")))) {
			yield* g.srcCall(f, "atmosanalyzer_scan", rt.fv(f, "air_contents", rt.sv(f, "loaded_tank")), live(f.args[1]));
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/tank/internals/plasma")) ? 1 : 0))) {
				if (!truthy(rt.sv(f, "anchored"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ needs to be secured to the floor first!</span>", [live(f.src)])]);
					return 1;
				}
				if (truthy(rt.sv(f, "loaded_tank"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There's already a plasma tank loaded!</span>"]);
					return 1;
				}
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return 1;
				}
				rt.setSv(f, "loaded_tank", live(f.args[0]));
				yield* g.callName(f, live(f.args[0]), "forceMove", [live(f.src)]);
				yield* g.srcCall(f, "update_icons");
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
					if (truthy(rt.sv(f, "loaded_tank"))) {
						if (truthy(rt.sv(f, "locked"))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The controls are locked!</span>"]);
							return 1;
						}
						yield* g.srcCall(f, "eject");
						return 1;
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There isn't a tank loaded!</span>"]);
						return 1;
					}
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
						yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]), 0);
						return 1;
					} else {
						if (truthy((yield* g.callName(f, live(f.args[0]), "GetID", [])))) {
							if (truthy((yield* g.srcCall(f, "allowed", live(f.args[1]))))) {
								if (truthy(rt.sv(f, "active"))) {
									rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
									$0 = live(f.args[1]);
									if (truthy(rt.sv(f, "locked"))) {
										$1 = "lock";
									} else {
										$1 = "unlock";
									}
									yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the controls.</span>", [$1])]);
								} else {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The controls can only be locked when ％！ is active!</span>", [live(f.src)])]);
								}
							} else {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Access denied.</span>"]);
								return 1;
							}
						} else {
							return (yield* g.callSuper(f, [], rt.Args.Same));
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/power/rad_collector/proc/obj_break  (code/modules/power/singularity/collector.dm:121)
rt.def("/obj/machinery/power/rad_collector/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(!truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	rt.callSrc(f, "eject", []);
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	return f.dot;
});

// /obj/machinery/power/rad_collector/proc/eject  (code/modules/power/singularity/collector.dm:128)
rt.def("/obj/machinery/power/rad_collector/proc/eject", function eject(f: Frame) {
	let Z: Value = null;
	f.vars = () => [Z];
	rt.setSv(f, "locked", 0);
	if (!truthy((Z = rt.fv(f, "loaded_tank", live(f.src))))) {
		return live(f.dot);
	}
	rt.setFv(f, "loc", live(Z), rt.getStep(f, live(f.src), 0));
	rt.setFv(f, "layer", live(Z), rt.initial(f, live(Z), "layer"));
	rt.setFv(f, "plane", live(Z), rt.initial(f, live(Z), "plane"));
	rt.setFv(f, "loaded_tank", live(f.src), null);
	if (truthy(rt.sv(f, "active"))) {
		rt.callSrc(f, "toggle_power", []);
	} else {
		rt.callSrc(f, "update_icons", []);
	}
	return f.dot;
});

// /obj/machinery/power/rad_collector/proc/receive_pulse  (code/modules/power/singularity/collector.dm:140)
rt.def("/obj/machinery/power/rad_collector/proc/receive_pulse", function receive_pulse(f: Frame, pulse_strength: Value) {
	let power_produced: Value = null;
	let $0: any;
	f.vars = () => [power_produced, $0];
	if ((truthy(rt.sv(f, "loaded_tank")) && truthy(rt.sv(f, "active")))) {
		if (truthy(rt.index(rt.gv(f, "gases", rt.fv(f, "air_contents", rt.sv(f, "loaded_tank"))), "plasma"))) {
			$0 = rt.index(rt.index(rt.gv(f, "gases", rt.fv(f, "air_contents", rt.sv(f, "loaded_tank"))), "plasma"), 1);
		} else {
			$0 = 0;
		}
		power_produced = $0;
		(power_produced = rt.modify(live(power_produced), multiply(live(pulse_strength), 10), multiply));
		rt.callSrc(f, "add_avail", [live(power_produced)]);
		rt.setSv(f, "last_power", live(power_produced));
		return live(f.dot);
	}
	return live(f.dot);
});

// /obj/machinery/power/rad_collector/proc/update_icons  (code/modules/power/singularity/collector.dm:150)
rt.def("/obj/machinery/power/rad_collector/proc/update_icons", function update_icons(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "loaded_tank"))) {
		rt.callSrc(f, "add_overlay", ["ptank"]);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "active"))) return f.dot;
	rt.callSrc(f, "add_overlay", ["on"]);
	return f.dot;
});

// /obj/machinery/power/rad_collector/proc/toggle_power  (code/modules/power/singularity/collector.dm:160)
rt.def("/obj/machinery/power/rad_collector/proc/toggle_power", function toggle_power(f: Frame) {
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "icon_state", "ca_on");
		rt.call(f, P("/proc/flick"), null, ["ca_active", live(f.src)]);
	} else {
		rt.setSv(f, "icon_state", "ca");
		rt.call(f, P("/proc/flick"), null, ["ca_deactive", live(f.src)]);
	}
	rt.callSrc(f, "update_icons", []);
	return live(f.dot);
});
