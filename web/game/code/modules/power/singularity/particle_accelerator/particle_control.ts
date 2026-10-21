// From code/modules/power/singularity/particle_accelerator/particle_control.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10630, "/obj/machinery/particle_accelerator/control_box", "/obj/machinery/particle_accelerator", {
	strength_upper_limit: 2,
	interface_control: 1,
	connected_parts: null,
	assembled: 0,
	construction_state: 0,
	active: 0,
	strength: 0,
	powered: 0,
	anchored: 0,
	name: "Particle Accelerator Control Console",
	desc: "This controls the density of the particles.",
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	icon_state: "control_box",
	density: 1,
	use_power: 0,
	idle_power_usage: 500,
	active_power_usage: 10000,
	dir: 1,
	mouse_opacity: 2,
});

// /obj/machinery/particle_accelerator/control_box/proc/New  (code/modules/power/singularity/particle_accelerator/particle_control.dm:23)  may sleep
rt.def("/obj/machinery/particle_accelerator/control_box/proc/New", function* New(f: Frame) {
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/particle_accelerator/control_box"), [live(f.src)])));
	rt.setSv(f, "connected_parts", rt.list());
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/particle_accelerator/control_box/proc/Destroy  (code/modules/power/singularity/particle_accelerator/particle_control.dm:29)  may sleep
rt.def("/obj/machinery/particle_accelerator/control_box/proc/Destroy", function* Destroy(f: Frame) {
	let CP: Value = null, part: Value = null;
	let $e: any;
	f.vars = () => [CP, part, $e];
	if (truthy(rt.sv(f, "active"))) {
		yield* g.srcCall(f, "toggle_power");
	}
	CP = null;
	rt.forList(f, 0, rt.sv(f, "connected_parts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CP = $e;
		rt.setFv(f, "master", (part = live(CP)), null);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "connected_parts"), "Cut", []);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/particle_accelerator/control_box/proc/attack_hand  (code/modules/power/singularity/particle_accelerator/particle_control.dm:39)  may sleep
rt.def("/obj/machinery/particle_accelerator/control_box/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (isEqual(rt.sv(f, "construction_state"), 3)) {
		yield* g.srcCall(f, "interact", live(user));
	} else {
		if (!isEqual(rt.sv(f, "construction_state"), 2)) return f.dot;
		yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(user)]);
	}
	return f.dot;
}, true);

// /obj/machinery/particle_accelerator/control_box/proc/update_state  (code/modules/power/singularity/particle_accelerator/particle_control.dm:45)
rt.def("/obj/machinery/particle_accelerator/control_box/proc/update_state", function update_state(f: Frame) {
	let CP: Value = null, part: Value = null;
	let $e: any;
	f.vars = () => [CP, part, $e];
	if (rt.lt(rt.sv(f, "construction_state"), 3)) {
		rt.setSv(f, "use_power", 0);
		rt.setSv(f, "assembled", 0);
		rt.setSv(f, "active", 0);
		CP = null;
		rt.forList(f, 0, rt.sv(f, "connected_parts"));
		while (($e = rt.next(f, 0)) !== undefined) {
			CP = $e;
			rt.setFv(f, "strength", (part = live(CP)), null);
			rt.setFv(f, "powered", live(part), 0);
			rt.callName(f, live(part), "update_icon", []);
		}
		rt.endFor(f, 0);
		rt.callName(f, rt.sv(f, "connected_parts"), "Cut", []);
		return live(f.dot);
	}
	if (truthy(rt.callSrc(f, "part_scan", []))) return f.dot;
	rt.setSv(f, "use_power", 1);
	rt.setSv(f, "active", 0);
	rt.callName(f, rt.sv(f, "connected_parts"), "Cut", []);
	return f.dot;
});

// /obj/machinery/particle_accelerator/control_box/proc/update_icon  (code/modules/power/singularity/particle_accelerator/particle_control.dm:63)
rt.def("/obj/machinery/particle_accelerator/control_box/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "icon_state", "control_boxp1");
	} else {
		if (truthy(rt.sv(f, "use_power"))) {
			if (truthy(rt.sv(f, "assembled"))) {
				rt.setSv(f, "icon_state", "control_boxp");
			} else {
				rt.setSv(f, "icon_state", "ucontrol_boxp");
			}
		} else {
			$0 = rt.sv(f, "construction_state");
			if ($0 === 0 || $0 === 1) {
				rt.setSv(f, "icon_state", "control_box");
			} else if ($0 === 2) {
				rt.setSv(f, "icon_state", "control_boxw");
			} else {
				rt.setSv(f, "icon_state", "control_boxc");
			}
		}
	}
	return f.dot;
});

// /obj/machinery/particle_accelerator/control_box/proc/Topic  (code/modules/power/singularity/particle_accelerator/particle_control.dm:80)  may sleep
rt.def("/obj/machinery/particle_accelerator/control_box/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "interface_control"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='error'>ERROR: Request timed out. Check wire contacts.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=pacontrol"], false);
		yield* g.callName(f, live(f.usr), "unset_machine", []);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "togglep"))) {
		if (!truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Power"])))) {
			yield* g.srcCall(f, "toggle_power");
		}
	} else {
		if (truthy(rt.at(live(f.args[1]), "scan"))) {
			yield* g.srcCall(f, "part_scan");
		} else {
			if (truthy(rt.at(live(f.args[1]), "strengthup"))) {
				if (!truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Strength"])))) {
					yield* g.srcCall(f, "add_strength");
				}
			} else {
				if (truthy(rt.at(live(f.args[1]), "strengthdown"))) {
					if (!truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Strength"])))) {
						yield* g.srcCall(f, "remove_strength");
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "updateDialog");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/particle_accelerator/control_box/proc/strength_change  (code/modules/power/singularity/particle_accelerator/particle_control.dm:110)
rt.def("/obj/machinery/particle_accelerator/control_box/proc/strength_change", function strength_change(f: Frame) {
	let CP: Value = null, part: Value = null;
	let $e: any;
	f.vars = () => [CP, part, $e];
	CP = null;
	rt.forList(f, 0, rt.sv(f, "connected_parts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CP = $e;
		rt.setFv(f, "strength", (part = live(CP)), rt.sv(f, "strength"));
		rt.callName(f, live(part), "update_icon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/particle_accelerator/control_box/proc/add_strength  (code/modules/power/singularity/particle_accelerator/particle_control.dm:116)
rt.def("/obj/machinery/particle_accelerator/control_box/proc/add_strength", function add_strength(f: Frame, s: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	if (!(truthy(rt.sv(f, "assembled")) && rt.lt(rt.sv(f, "strength"), rt.sv(f, "strength_upper_limit")))) return f.dot;
	rt.incSrcVar(f, "strength", 1, true);
	rt.callSrc(f, "strength_change", []);
	$0 = rt.sv(f, "strength");
	$1 = fmt("＀＀ ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)])]);
	if (truthy(live(f.src))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])]);
	} else {
		$2 = "nonexistent location";
	}
	rt.call(f, P("/proc/message_admins"), null, [fmt("PA Control Computer increased to ＀ by ＀ in ＀", [$0, $1, fmt("＀", [$2])]), 0, 1]);
	rt.call(f, P("/proc/log_game"), null, [fmt("PA Control Computer increased to ＀ by ＀ in ＀", [rt.sv(f, "strength"), rt.call(f, P("/proc/key_name"), null, [live(f.usr)]), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
	rt.callSrc(f, "investigate_log", [fmt("increased to <font color='red'>＀</font> by ＀", [rt.sv(f, "strength"), rt.call(f, P("/proc/key_name"), null, [live(f.usr)])]), "singulo"]);
	return f.dot;
});

// /obj/machinery/particle_accelerator/control_box/proc/remove_strength  (code/modules/power/singularity/particle_accelerator/particle_control.dm:126)
rt.def("/obj/machinery/particle_accelerator/control_box/proc/remove_strength", function remove_strength(f: Frame, s: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	if (!(truthy(rt.sv(f, "assembled")) && rt.gt(rt.sv(f, "strength"), 0))) return f.dot;
	rt.incSrcVar(f, "strength", -1, true);
	rt.callSrc(f, "strength_change", []);
	$0 = rt.sv(f, "strength");
	$1 = fmt("＀＀ ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)])]);
	if (truthy(live(f.src))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])]);
	} else {
		$2 = "nonexistent location";
	}
	rt.call(f, P("/proc/message_admins"), null, [fmt("PA Control Computer decreased to ＀ by ＀ in ＀", [$0, $1, fmt("＀", [$2])]), 0, 1]);
	rt.call(f, P("/proc/log_game"), null, [fmt("PA Control Computer decreased to ＀ by ＀ in ＀", [rt.sv(f, "strength"), rt.call(f, P("/proc/key_name"), null, [live(f.usr)]), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
	rt.callSrc(f, "investigate_log", [fmt("decreased to <font color='green'>＀</font> by ＀", [rt.sv(f, "strength"), rt.call(f, P("/proc/key_name"), null, [live(f.usr)])]), "singulo"]);
	return f.dot;
});

// /obj/machinery/particle_accelerator/control_box/proc/power_change  (code/modules/power/singularity/particle_accelerator/particle_control.dm:136)
rt.def("/obj/machinery/particle_accelerator/control_box/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "active", 0);
		rt.setSv(f, "use_power", 0);
	} else {
		if (!(!truthy(rt.sv(f, "stat")) && isEqual(rt.sv(f, "construction_state"), 3))) return f.dot;
		rt.setSv(f, "use_power", 1);
	}
	return f.dot;
});

// /obj/machinery/particle_accelerator/control_box/proc/process  (code/modules/power/singularity/particle_accelerator/particle_control.dm:146)  may sleep
rt.def("/obj/machinery/particle_accelerator/control_box/proc/process", function* process(f: Frame) {
	let PE: Value = null;
	let $e: any;
	f.vars = () => [PE, $e];
	if (!truthy(rt.sv(f, "active"))) return f.dot;
	if (rt.lt(rt.len(f, rt.sv(f, "connected_parts")), 6)) {
		yield* g.srcCall(f, "investigate_log", "lost a connected part; It <font color='red'>powered down</font>.", "singulo");
		yield* g.srcCall(f, "toggle_power");
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	PE = null;
	rt.forList(f, 0, rt.sv(f, "connected_parts"), T("/obj/structure/particle_accelerator/particle_emitter"));
	while (($e = rt.next(f, 0)) !== undefined) {
		PE = $e;
		yield* g.callName(f, live(PE), "emit_particle", [rt.sv(f, "strength")]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/particle_accelerator/control_box/proc/part_scan  (code/modules/power/singularity/particle_accelerator/particle_control.dm:156)
rt.def("/obj/machinery/particle_accelerator/control_box/proc/part_scan", function part_scan(f: Frame) {
	let ldir: Value = null, rdir: Value = null, odir: Value = null, _T: Value = null, F: Value = null;
	f.vars = () => [ldir, rdir, odir, _T, F];
	ldir = rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), -90]);
	rdir = rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 90]);
	odir = rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180]);
	_T = rt.sv(f, "loc");
	rt.setSv(f, "assembled", 0);
	rt.setSv(f, "critical_machine", 0);
	if (!truthy((F = rt.locateIn(f, T("/obj/structure/particle_accelerator/fuel_chamber"), rt.call(f, P("/proc/orange"), null, [1, live(f.src)]))))) {
		return 0;
	}
	rt.callSrc(f, "setDir", [rt.fv(f, "dir", live(F))]);
	rt.callName(f, rt.sv(f, "connected_parts"), "Cut", []);
	if (!truthy(rt.callSrc(f, "check_part", [(_T = rt.getStep(f, live(_T), live(rdir))), T("/obj/structure/particle_accelerator/fuel_chamber")]))) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "check_part", [(_T = rt.getStep(f, live(_T), live(odir))), T("/obj/structure/particle_accelerator/end_cap")]))) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "check_part", [(_T = rt.getStep(f, (_T = rt.getStep(f, live(_T), rt.sv(f, "dir"))), rt.sv(f, "dir"))), T("/obj/structure/particle_accelerator/power_box")]))) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "check_part", [(_T = rt.getStep(f, live(_T), rt.sv(f, "dir"))), T("/obj/structure/particle_accelerator/particle_emitter/center")]))) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "check_part", [(_T = rt.getStep(f, live(_T), live(ldir))), T("/obj/structure/particle_accelerator/particle_emitter/left")]))) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "check_part", [(_T = rt.getStep(f, (_T = rt.getStep(f, live(_T), live(rdir))), live(rdir))), T("/obj/structure/particle_accelerator/particle_emitter/right")]))) {
		return 0;
	}
	rt.setSv(f, "assembled", 1);
	rt.setSv(f, "critical_machine", 1);
	return 1;
});

// /obj/machinery/particle_accelerator/control_box/proc/check_part  (code/modules/power/singularity/particle_accelerator/particle_control.dm:197)
rt.def("/obj/machinery/particle_accelerator/control_box/proc/check_part", function check_part(f: Frame, _T: Value, type: Value) {
	let PA: Value = null;
	f.vars = () => [PA];
	if ((truthy(rt.op(f, "IsType", [], [(PA = rt.locateIn(f, T("/obj/structure/particle_accelerator"), live(_T))), live(type)])) && isEqual(rt.fv(f, "construction_state", live(PA)), 3))) {
		if (truthy(rt.callName(f, live(PA), "connect_master", [live(f.src)]))) {
			rt.callName(f, rt.sv(f, "connected_parts"), "Add", [live(PA)]);
			return 1;
		}
	}
	return 0;
});

// /obj/machinery/particle_accelerator/control_box/proc/toggle_power  (code/modules/power/singularity/particle_accelerator/particle_control.dm:206)
rt.def("/obj/machinery/particle_accelerator/control_box/proc/toggle_power", function toggle_power(f: Frame) {
	let CP: Value = null, part: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [CP, part, $0, $1, $e];
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		$0 = "<font color='green'>ON</font>";
	} else {
		$0 = "<font color='red'>OFF</font>";
	}
	if (truthy(live(f.usr))) {
		$1 = rt.call(f, P("/proc/key_name"), null, [live(f.usr)]);
	} else {
		$1 = "outside forces";
	}
	rt.callSrc(f, "investigate_log", [fmt("turned ＀ by ＀", [$0, $1]), "singulo"]);
	if (truthy(rt.sv(f, "active"))) {
		$0 = "ON";
	} else {
		$0 = "OFF";
	}
	if (truthy(live(f.usr))) {
		$1 = rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]);
	} else {
		$1 = "outside forces";
	}
	rt.call(f, P("/proc/message_admins"), null, [fmt("PA Control Computer turned ＀ by ＀(<A HREF='?_src_=holder;adminmoreinfo=＃'>?</A>) (<A HREF='?_src_=holder;adminplayerobservefollow=＃'>FLW</A>) in (＀,＀,＀ - <A HREF='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [$0, $1, live(f.usr), live(f.usr), rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z"), rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z")]), 0, 1]);
	if (truthy(rt.sv(f, "active"))) {
		$0 = "ON";
	} else {
		$0 = "OFF";
	}
	if (truthy(live(f.usr))) {
		$1 = fmt("＀", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)])]);
	} else {
		$1 = "outside forces";
	}
	rt.call(f, P("/proc/log_game"), null, [fmt("PA Control Computer turned ＀ by ＀ in (＀,＀,＀)", [$0, $1, rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z")])]);
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "use_power", 2);
		CP = null;
		rt.forList(f, 0, rt.sv(f, "connected_parts"));
		while (($e = rt.next(f, 0)) !== undefined) {
			CP = $e;
			rt.setFv(f, "strength", (part = live(CP)), rt.sv(f, "strength"));
			rt.setFv(f, "powered", live(part), 1);
			rt.callName(f, live(part), "update_icon", []);
		}
		rt.endFor(f, 0);
	} else {
		rt.setSv(f, "use_power", 1);
		CP = null;
		rt.forList(f, 0, rt.sv(f, "connected_parts"));
		while (($e = rt.next(f, 0)) !== undefined) {
			CP = $e;
			rt.setFv(f, "strength", (part = live(CP)), null);
			rt.setFv(f, "powered", live(part), 0);
			rt.callName(f, live(part), "update_icon", []);
		}
		rt.endFor(f, 0);
	}
	return 1;
});

// /obj/machinery/particle_accelerator/control_box/proc/interact  (code/modules/power/singularity/particle_accelerator/particle_control.dm:228)  may sleep
rt.def("/obj/machinery/particle_accelerator/control_box/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	f.vars = () => [user, dat, popup];
	if ((rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1) || truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		if (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
			yield* g.callName(f, live(user), "unset_machine", []);
			rt.op(f, "Browse", [], [live(user), null, "window=pacontrol"], false);
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "";
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;close=1'>Close</A><BR><BR>", [live(f.src)]), add);
	dat = rt.modify(live(dat), "<h3>Status</h3>", add);
	if (!truthy(rt.sv(f, "assembled"))) {
		dat = rt.modify(live(dat), "Unable to detect all parts!<BR>", add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;scan=1'>Run Scan</A><BR><BR>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), "All parts in place.<BR><BR>", add);
		dat = rt.modify(live(dat), "Power:", add);
		if (truthy(rt.sv(f, "active"))) {
			dat = rt.modify(live(dat), "On<BR>", add);
		} else {
			dat = rt.modify(live(dat), "Off <BR>", add);
		}
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;togglep=1'>Toggle Power</A><BR><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("Particle Strength: ＀ ", [rt.sv(f, "strength")]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;strengthdown=1'>--</A>|<A href='?src=＃;strengthup=1'>++</A><BR><BR>", [live(f.src), live(f.src)]), add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "pacontrol", rt.sv(f, "name"), 420, 300]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.sv(f, "icon"), rt.sv(f, "icon_state")]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/particle_accelerator/control_box/proc/examine  (code/modules/power/singularity/particle_accelerator/particle_control.dm:258)
rt.def("/obj/machinery/particle_accelerator/control_box/proc/examine", function examine(f: Frame) {
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
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/particle_accelerator/control_box/proc/attackby  (code/modules/power/singularity/particle_accelerator/particle_control.dm:271)  may sleep
rt.def("/obj/machinery/particle_accelerator/control_box/proc/attackby", function* attackby(f: Frame) {
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
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/particle_accelerator/control_box/proc/blob_act  (code/modules/power/singularity/particle_accelerator/particle_control.dm:322)  may sleep
rt.def("/obj/machinery/particle_accelerator/control_box/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
