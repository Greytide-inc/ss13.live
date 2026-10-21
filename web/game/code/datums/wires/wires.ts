// From code/datums/wires/wires.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/is_wire_tool  (code/datums/wires/wires.dm:4)
rt.def("/proc/is_wire_tool", function is_wire_tool(f: Frame, I: Value) {
	let A: Value = null;
	f.vars = () => [A];
	if (truthy((rt.istype(live(I), T("/obj/item/device/multitool")) ? 1 : 0))) {
		return 1;
	}
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
		return 1;
	}
	if (truthy((rt.istype(live(I), T("/obj/item/device/assembly")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "attachable", (A = live(I))))) {
			return 1;
		}
	}
	return live(f.dot);
});

rt.type(1058, "/datum/wires", "/datum", {
	holder: null,
	holder_type: null,
	proper_name: "Unknown",
	wires: null,
	cut_wires: null,
	colors: null,
	assemblies: null,
	randomize: 0,
});

// /datum/wires/proc/<init>  (code/datums/wires/wires.dm:22)
rt.def("/datum/wires/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "wires", rt.list());
	$0 = $0;
	rt.setSv(f, "cut_wires", rt.list());
	$0 = $0;
	rt.setSv(f, "colors", rt.list());
	$0 = $0;
	rt.setSv(f, "assemblies", rt.list());
	return f.dot;
});

// /datum/wires/proc/New  (code/datums/wires/wires.dm:30)
rt.def("/datum/wires/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.op(f, "IsType", [], [live(f.args[0]), rt.sv(f, "holder_type")]))) {
		rt.call(f, P("/proc/CRASH"), null, ["Wire holder is not of the expected type!"]);
		return live(f.dot);
	}
	rt.setFv(f, "holder", live(f.src), live(f.args[0]));
	if (truthy(rt.sv(f, "randomize"))) {
		rt.callSrc(f, "randomize", []);
	} else {
		if (!truthy(rt.index(rt.gl("wire_color_directory"), rt.sv(f, "holder_type")))) {
			rt.callSrc(f, "randomize", []);
			rt.setAt(rt.gl("wire_color_directory"), rt.sv(f, "holder_type"), rt.sv(f, "colors"));
			rt.setAt(rt.gl("wire_name_directory"), rt.sv(f, "holder_type"), rt.sv(f, "proper_name"));
		} else {
			rt.setSv(f, "colors", rt.index(rt.gl("wire_color_directory"), rt.sv(f, "holder_type")));
		}
	}
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/proc/Destroy  (code/datums/wires/wires.dm:48)  may sleep
rt.def("/datum/wires/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "holder", null);
	rt.setSv(f, "assemblies", rt.list());
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/wires/proc/add_duds  (code/datums/wires/wires.dm:53)
rt.def("/datum/wires/proc/add_duds", function add_duds(f: Frame, duds: Value) {
	let dud: Value = null;
	f.vars = () => [duds, dud];
	while (truthy(live(duds))) {
		if (truthy((rt.isIn(f, (dud = add("__dud", fmt("＀", [(duds = rt.inc(live(duds), -1))]))), rt.sv(f, "wires")) ? 1 : 0))) {
			continue;
		}
		rt.modSrcVar(f, "wires", live(dud), add);
	}
	return f.dot;
});

// /datum/wires/proc/randomize  (code/datums/wires/wires.dm:78)
rt.def("/datum/wires/proc/randomize", function randomize(f: Frame) {
	let my_possible_colors: Value = null, wire: Value = null;
	let $e: any;
	f.vars = () => [my_possible_colors, wire, $e];
	my_possible_colors = rt.callName(f, rt.gl("possible_colors"), "Copy", []);
	wire = null;
	rt.forList(f, 0, rt.call(f, P("/proc/shuffle"), null, [rt.sv(f, "wires")]));
	while (($e = rt.next(f, 0)) !== undefined) {
		wire = $e;
		rt.setAt(rt.sv(f, "colors"), rt.call(f, P("/proc/pick_n_take"), null, [live(my_possible_colors)]), live(wire));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/wires/proc/shuffle_wires  (code/datums/wires/wires.dm:84)
rt.def("/datum/wires/proc/shuffle_wires", function shuffle_wires(f: Frame) {
	rt.callName(f, rt.sv(f, "colors"), "Cut", []);
	rt.callSrc(f, "randomize", []);
	return f.dot;
});

// /datum/wires/proc/repair  (code/datums/wires/wires.dm:88)
rt.def("/datum/wires/proc/repair", function repair(f: Frame) {
	rt.callName(f, rt.sv(f, "cut_wires"), "Cut", []);
	return f.dot;
});

// /datum/wires/proc/get_wire  (code/datums/wires/wires.dm:91)
rt.def("/datum/wires/proc/get_wire", function get_wire(f: Frame, color: Value) {
	return rt.index(rt.sv(f, "colors"), live(color));
});

// /datum/wires/proc/get_attached  (code/datums/wires/wires.dm:94)
rt.def("/datum/wires/proc/get_attached", function get_attached(f: Frame, color: Value) {
	if (truthy(rt.index(rt.sv(f, "assemblies"), live(color)))) {
		return rt.index(rt.sv(f, "assemblies"), live(color));
	}
	return null;
});

// /datum/wires/proc/is_attached  (code/datums/wires/wires.dm:99)
rt.def("/datum/wires/proc/is_attached", function is_attached(f: Frame, color: Value) {
	if (!truthy(rt.index(rt.sv(f, "assemblies"), live(color)))) return f.dot;
	return 1;
});

// /datum/wires/proc/is_cut  (code/datums/wires/wires.dm:103)
rt.def("/datum/wires/proc/is_cut", function is_cut(f: Frame, wire: Value) {
	return (rt.isIn(f, live(wire), rt.sv(f, "cut_wires")) ? 1 : 0);
});

// /datum/wires/proc/is_color_cut  (code/datums/wires/wires.dm:106)
rt.def("/datum/wires/proc/is_color_cut", function is_color_cut(f: Frame, color: Value) {
	return rt.callSrc(f, "is_cut", [rt.callSrc(f, "get_wire", [live(color)])]);
});

// /datum/wires/proc/is_all_cut  (code/datums/wires/wires.dm:109)
rt.def("/datum/wires/proc/is_all_cut", function is_all_cut(f: Frame) {
	if (!isEqual(rt.len(f, rt.sv(f, "cut_wires")), rt.len(f, rt.sv(f, "wires")))) return f.dot;
	return 1;
});

// /datum/wires/proc/cut  (code/datums/wires/wires.dm:113)  may sleep
rt.def("/datum/wires/proc/cut", function* cut(f: Frame, wire: Value) {
	f.vars = () => [wire];
	if (truthy((yield* g.srcCall(f, "is_cut", live(wire))))) {
		(rt.modSrcVar(f, "cut_wires", live(wire), subtract));
		yield* g.callSrc(f, "on_cut", [null, live(wire), "mend", 1], rt.Args.Named);
	} else {
		rt.modSrcVar(f, "cut_wires", live(wire), add);
		yield* g.callSrc(f, "on_cut", [null, live(wire), "mend", 0], rt.Args.Named);
	}
	return f.dot;
}, true);

// /datum/wires/proc/cut_color  (code/datums/wires/wires.dm:121)  may sleep
rt.def("/datum/wires/proc/cut_color", function* cut_color(f: Frame, color: Value) {
	f.vars = () => [color];
	yield* g.srcCall(f, "cut", (yield* g.srcCall(f, "get_wire", live(color))));
	return f.dot;
}, true);

// /datum/wires/proc/cut_random  (code/datums/wires/wires.dm:124)  may sleep
rt.def("/datum/wires/proc/cut_random", function* cut_random(f: Frame) {
	yield* g.srcCall(f, "cut", rt.index(rt.sv(f, "wires"), (yield* g.call(f, P("/proc/rand"), null, [1, rt.len(f, rt.sv(f, "wires"))]))));
	return f.dot;
}, true);

// /datum/wires/proc/cut_all  (code/datums/wires/wires.dm:127)  may sleep
rt.def("/datum/wires/proc/cut_all", function* cut_all(f: Frame) {
	let wire: Value = null;
	let $e: any;
	f.vars = () => [wire, $e];
	wire = null;
	rt.forList(f, 0, rt.sv(f, "wires"));
	while (($e = rt.next(f, 0)) !== undefined) {
		wire = $e;
		yield* g.srcCall(f, "cut", live(wire));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/wires/proc/pulse  (code/datums/wires/wires.dm:131)  may sleep
rt.def("/datum/wires/proc/pulse", function* pulse(f: Frame, wire: Value) {
	f.vars = () => [wire];
	if (truthy((yield* g.srcCall(f, "is_cut", live(wire))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "on_pulse", live(wire));
	return f.dot;
}, true);

// /datum/wires/proc/pulse_color  (code/datums/wires/wires.dm:136)  may sleep
rt.def("/datum/wires/proc/pulse_color", function* pulse_color(f: Frame, color: Value) {
	f.vars = () => [color];
	yield* g.srcCall(f, "pulse", (yield* g.srcCall(f, "get_wire", live(color))));
	return f.dot;
}, true);

// /datum/wires/proc/pulse_assembly  (code/datums/wires/wires.dm:139)  may sleep
rt.def("/datum/wires/proc/pulse_assembly", function* pulse_assembly(f: Frame, S: Value) {
	let color: Value = null;
	let $e: any;
	f.vars = () => [S, color, $e];
	color = null;
	rt.forList(f, 0, rt.sv(f, "assemblies"));
	while (($e = rt.next(f, 0)) !== undefined) {
		color = $e;
		if (isEqual(live(S), rt.index(rt.sv(f, "assemblies"), live(color)))) {
			yield* g.srcCall(f, "pulse_color", live(color));
			return 1;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/wires/proc/attach_assembly  (code/datums/wires/wires.dm:145)
rt.def("/datum/wires/proc/attach_assembly", function attach_assembly(f: Frame, color: Value, S: Value) {
	if (!(((truthy(live(S)) && truthy((rt.istype(live(S), T("/obj/item/device/assembly")) ? 1 : 0))) && truthy(rt.fv(f, "attachable", live(S)))) && !truthy(rt.callSrc(f, "is_attached", [live(color)])))) return f.dot;
	rt.setAt(rt.sv(f, "assemblies"), live(color), live(S));
	rt.setFv(f, "loc", live(S), rt.sv(f, "holder"));
	rt.setFv(f, "connected", live(S), live(f.src));
	return live(S);
});

// /datum/wires/proc/detach_assembly  (code/datums/wires/wires.dm:152)
rt.def("/datum/wires/proc/detach_assembly", function detach_assembly(f: Frame, color: Value) {
	let S: Value = null;
	f.vars = () => [S];
	if (!(truthy((S = rt.callSrc(f, "get_attached", [live(color)]))) && truthy((rt.istype(live(S), T("/obj/item/device/assembly")) ? 1 : 0)))) return f.dot;
	(rt.modSrcVar(f, "assemblies", live(color), subtract));
	rt.setFv(f, "connected", live(S), null);
	rt.setFv(f, "loc", live(S), rt.fv(f, "loc", rt.sv(f, "holder")));
	return live(S);
});

// /datum/wires/proc/emp_pulse  (code/datums/wires/wires.dm:160)  may sleep
rt.def("/datum/wires/proc/emp_pulse", function* emp_pulse(f: Frame) {
	let possible_wires: Value = null, remaining_pulses: Value = null, wire: Value = null;
	let $e: any;
	f.vars = () => [possible_wires, remaining_pulses, wire, $e];
	possible_wires = (yield* g.call(f, P("/proc/shuffle"), null, [rt.sv(f, "wires")]));
	remaining_pulses = 3;
	wire = null;
	rt.forList(f, 0, live(possible_wires));
	while (($e = rt.next(f, 0)) !== undefined) {
		wire = $e;
		if (truthy(rt.op(f, "Prob", [], [33]))) {
			yield* g.srcCall(f, "pulse", live(wire));
		}
		remaining_pulses = rt.inc(live(remaining_pulses), -1);
		if (rt.ge(live(remaining_pulses), 0)) {
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/wires/proc/get_status  (code/datums/wires/wires.dm:175)
rt.def("/datum/wires/proc/get_status", function get_status(f: Frame) {
	return rt.list();
});

// /datum/wires/proc/interact  (code/datums/wires/wires.dm:185)  may sleep
rt.def("/datum/wires/proc/interact", function* interact(f: Frame, user: Value) {
	let A: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [user, A, I, $e];
	if (!truthy((yield* g.srcCall(f, "interactable", live(user))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "ui_interact", live(user));
	A = null;
	rt.forList(f, 0, rt.sv(f, "assemblies"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((truthy((rt.istype((I = rt.index(rt.sv(f, "assemblies"), live(A))), T("/obj/item")) ? 1 : 0)) && truthy((yield* g.callName(f, live(I), "on_found", [live(user)]))))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/wires/proc/ui_status  (code/datums/wires/wires.dm:197)  may sleep
rt.def("/datum/wires/proc/ui_status", function* ui_status(f: Frame) {
	if (truthy((yield* g.srcCall(f, "interactable", live(f.args[0]))))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return -1;
}, true, { args: ["user"] });

// /datum/wires/proc/ui_interact  (code/datums/wires/wires.dm:203)  may sleep
rt.def("/datum/wires/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "wires";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("physical_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "wires", fmt("＀ wires", [rt.fv(f, "name", rt.sv(f, "holder"))]), 350, add(150, multiply(rt.len(f, rt.sv(f, "wires")), 30)), live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /datum/wires/proc/ui_data  (code/datums/wires/wires.dm:209)
rt.def("/datum/wires/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, payload: Value = null, color: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $e: any;
	f.vars = () => [data, payload, color, $0, $1, $2, $3, $4, $e];
	data = rt.list();
	payload = rt.list();
	color = null;
	rt.forList(f, 0, rt.sv(f, "colors"));
	while (($e = rt.next(f, 0)) !== undefined) {
		color = $e;
		$0 = live(payload);
		$1 = "color";
		$2 = live(color);
		$3 = "wire";
		if ((truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(user)])) || truthy(rt.callName(f, live(user), "is_holding_item_of_type", [T("/obj/item/device/multitool/abductor")])))) {
			$4 = rt.callSrc(f, "get_wire", [live(color)]);
		} else {
			$4 = null;
		}
		rt.callName(f, $0, "Add", [rt.list(rt.alist(f, [$1, $2, $3, $4, "cut", rt.callSrc(f, "is_color_cut", [live(color)]), "attached", rt.callSrc(f, "is_attached", [live(color)])]))]);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "wires", live(payload));
	rt.setAt(live(data), "status", rt.callSrc(f, "get_status", []));
	return live(data);
});

// /datum/wires/proc/ui_act  (code/datums/wires/wires.dm:223)  may sleep
rt.def("/datum/wires/proc/ui_act", function* ui_act(f: Frame) {
	let target_wire: Value = null, L: Value = null, I: Value = null, O: Value = null, A: Value = null;
	let $0: any;
	f.vars = () => [target_wire, L, I, O, A, $0];
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || !truthy((yield* g.srcCall(f, "interactable", live(f.usr)))))) {
		return live(f.dot);
	}
	target_wire = rt.at(live(f.args[1]), "wire");
	L = live(f.usr);
	I = (yield* g.callName(f, live(L), "get_active_held_item", []));
	$0 = live(f.args[0]);
	if ($0 === "cut") {
		if ((truthy((rt.istype(live(I), T("/obj/item/weapon/wirecutters")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)]))))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "holder"), rt.fv(f, "usesound", live(I)), 20, 1]);
			yield* g.srcCall(f, "cut_color", live(target_wire));
			f.dot = 1;
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='warning'>You need wirecutters!</span>"]);
		}
	} else if ($0 === "pulse") {
		if ((truthy((rt.istype(live(I), T("/obj/item/device/multitool")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)]))))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "holder"), rt.rsc("sound/weapons/empty.ogg"), 20, 1]);
			yield* g.srcCall(f, "pulse_color", live(target_wire));
			f.dot = 1;
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='warning'>You need a multitool!</span>"]);
		}
	} else if ($0 === "attach") {
		if (truthy((yield* g.srcCall(f, "is_attached", live(target_wire))))) {
			if (truthy((O = (yield* g.srcCall(f, "detach_assembly", live(target_wire)))))) {
				yield* g.callName(f, live(L), "put_in_hands", [live(O)]);
				f.dot = 1;
			}
		} else {
			if (!truthy((rt.istype(live(I), T("/obj/item/device/assembly")) ? 1 : 0))) return f.dot;
			if (truthy(rt.gv(f, "attachable", (A = live(I))))) {
				if (!truthy((yield* g.callName(f, live(L), "drop_item", [])))) {
					return live(f.dot);
				}
				yield* g.srcCall(f, "attach_assembly", live(target_wire), live(A));
				f.dot = 1;
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='warning'>You need an attachable assembly!</span>"]);
			}
		}
	}
	return f.dot;
}, true, { args: ["action", "params"] });
