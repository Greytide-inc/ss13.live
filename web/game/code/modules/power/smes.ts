// From code/modules/power/smes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10302, "/obj/machinery/power/smes", "/obj/machinery/power", {
	capacity: 5000000,
	charge: 0,
	input_attempt: 1,
	inputting: 1,
	input_level: 50000,
	input_level_max: 200000,
	input_available: 0,
	output_attempt: 1,
	outputting: 1,
	output_level: 50000,
	output_level_max: 200000,
	output_used: 0,
	terminal: null,
	anchored: 1,
	name: "power storage unit",
	desc: "A high-capacity superconducting magnetic energy storage (SMES) unit.",
	icon_state: "smes",
	density: 1,
	use_power: 0,
});

// /obj/machinery/power/smes/proc/examine  (code/modules/power/smes.dm:42)
rt.def("/obj/machinery/power/smes/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "terminal"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>This SMES has no power terminal!</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/power/smes/proc/New  (code/modules/power/smes.dm:47)  may sleep
rt.def("/obj/machinery/power/smes/proc/New", function* New(f: Frame) {
	let B: Value = null, d: Value = null, _T: Value = null, term: Value = null;
	f.vars = () => [B, d, _T, term];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/smes"), [null]))), "apply_default_parts", [live(f.src)]);
	rt.spawnTail(f, 5, "/obj/machinery/power/smes/proc/New: spawn at modules/power/smes.dm:51", B, d, _T, term);
	return live(f.dot);
}, true);

// a spawn(5) body of /obj/machinery/power/smes/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/power/smes/proc/New: spawn at modules/power/smes.dm:51", function* (f: Frame, B: Value, d: Value, _T: Value, term: Value) {
	let $e: any;
	f.vars = () => [B, d, _T, term, $e];
	d = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	blk38: {
		while (($e = rt.next(f, 0)) !== undefined) {
			d = $e;
			_T = rt.getStep(f, live(f.src), live(d));
			term = null;
			rt.forList(f, 1, live(_T), T("/obj/machinery/power/terminal"));
			while (($e = rt.next(f, 1)) !== undefined) {
				term = $e;
				if ((truthy(live(term)) && isEqual(rt.fv(f, "dir", live(term)), (yield* g.call(f, P("/proc/turn"), null, [live(d), 180]))))) {
					rt.setSv(f, "terminal", live(term));
					break blk38;
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "terminal"))) {
		(rt.modSrcVar(f, "stat", 1, rt.bitOr));
		return live(f.dot);
	}
	rt.setFv(f, "master", rt.sv(f, "terminal"), live(f.src));
	yield* g.srcCall(f, "update_icon");
	return null;
});

rt.type(6769, "/obj/item/weapon/circuitboard/machine/smes", "/obj/item/weapon/circuitboard/machine", {
	def_components: null,
	name: "SMES (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/smes"),
	origin_tech: "programming=3;powerstorage=3;engineering=3",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/smes/proc/<init>  (code/modules/power/smes.dm:75)
rt.def("/obj/item/weapon/circuitboard/machine/smes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "def_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/cell"), T("/obj/item/weapon/stock_parts/cell/high/empty")]));
	$0 = $0;
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/stack/cable_coil"), 5, T("/obj/item/weapon/stock_parts/cell"), 5, T("/obj/item/weapon/stock_parts/capacitor"), 1]));
	return f.dot;
});

// /obj/machinery/power/smes/proc/RefreshParts  (code/modules/power/smes.dm:81)
rt.def("/obj/machinery/power/smes/proc/RefreshParts", function RefreshParts(f: Frame) {
	let IO: Value = null, MC: Value = null, C: Value = null, CP: Value = null, PC: Value = null;
	let $e: any;
	f.vars = () => [IO, MC, C, CP, PC, $e];
	IO = 0;
	MC = 0;
	C = null;
	CP = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/capacitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CP = $e;
		IO = rt.modify(live(IO), rt.fv(f, "rating", live(CP)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "input_level_max", multiply(rt.initial(f, live(f.src), "input_level_max"), live(IO)));
	rt.setSv(f, "output_level_max", multiply(rt.initial(f, live(f.src), "output_level_max"), live(IO)));
	PC = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/cell"));
	while (($e = rt.next(f, 0)) !== undefined) {
		PC = $e;
		MC = rt.modify(live(MC), rt.fv(f, "maxcharge", live(PC)), add);
		C = rt.modify(live(C), rt.fv(f, "charge", live(PC)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "capacity", multiply(divide(live(MC), 15000), 1000000));
	if (!(!truthy(rt.initial(f, live(f.src), "charge")) && !truthy(rt.sv(f, "charge")))) return f.dot;
	rt.setSv(f, "charge", multiply(divide(live(C), 15000), 1000000));
	return f.dot;
});

// /obj/machinery/power/smes/proc/attackby  (code/modules/power/smes.dm:94)  may sleep
rt.def("/obj/machinery/power/smes/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, term: Value = null, dir: Value = null, _T_1: Value = null, C: Value = null, N: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [_T, term, dir, _T_1, C, N, $0, $1, $2, $e];
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), fmt("＀-o", [rt.initial(f, live(f.src), "icon_state")]), rt.initial(f, live(f.src), "icon_state"), live(f.args[0]))))) {
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_change_direction_wrench", live(f.args[1]), live(f.args[0]))))) {
		rt.setSv(f, "terminal", null);
		_T = rt.getStep(f, live(f.src), rt.sv(f, "dir"));
		term = null;
		rt.forList(f, 0, live(_T), T("/obj/machinery/power/terminal"));
		while (($e = rt.next(f, 0)) !== undefined) {
			term = $e;
			if ((truthy(live(term)) && isEqual(rt.fv(f, "dir", live(term)), (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180]))))) {
				rt.setSv(f, "terminal", live(term));
				rt.setFv(f, "master", rt.sv(f, "terminal"), live(f.src));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Terminal found.</span>"]);
				break;
			}
		}
		rt.endFor(f, 0);
		if (!truthy(rt.sv(f, "terminal"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='alert'>No power terminal found.</span>"]);
			return live(f.dot);
		}
		(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
		if (truthy(rt.bitAnd((dir = rt.getDir(f, live(f.args[1]), live(f.src))), subtract(live(dir), 1)))) {
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "terminal"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This SMES already has a power terminal!</span>"]);
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "panel_open"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must open the maintenance panel first!</span>"]);
			return live(f.dot);
		}
		if (truthy(rt.gv(f, "intact", (_T_1 = rt.getStep(f, live(f.args[1]), 0))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must first remove the floor plating!</span>"]);
			return live(f.dot);
		}
		if (rt.lt((yield* g.callName(f, (C = live(f.args[0])), "get_amount", [])), 10)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more wires!</span>"]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start building the power terminal...</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
		if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named))) && rt.ge((yield* g.callName(f, live(C), "get_amount", [])), 10))) {
			if ((rt.lt((yield* g.callName(f, live(C), "get_amount", [])), 10) || !truthy(live(C)))) {
				return live(f.dot);
			}
			N = (yield* g.callName(f, live(_T_1), "get_cable_node", []));
			if ((truthy(rt.op(f, "Prob", [], [50])) && truthy((yield* g.call(f, P("/proc/electrocute_mob"), null, [live(f.usr), live(N), live(N), 1, 1]))))) {
				yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, live(f.src)]);
				return live(f.dot);
			}
			yield* g.callName(f, live(C), "use", [10]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has built a power terminal.", [rt.fv(f, "name", live(f.args[1]))]), "<span class='notice'>You build the power terminal.</span>"]);
			yield* g.srcCall(f, "make_terminal", live(_T_1));
			yield* g.callName(f, rt.sv(f, "terminal"), "connect_to_network", []);
		}
		return live(f.dot);
	}
	if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0)) && truthy(rt.sv(f, "terminal"))) && truthy(rt.sv(f, "panel_open")))) {
		yield* g.callName(f, rt.sv(f, "terminal"), "dismantle", [live(f.args[1]), live(f.args[0])]);
		return live(f.dot);
	}
	_T = rt.getStep(f, live(f.src), 0);
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		$0 = live(f.src);
		$1 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.args[1])]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.args[1])])]);
		if (truthy(live(_T))) {
			$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		} else {
			$2 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been deconstructed by ＀ in ＀", [$0, $1, fmt("＀", [$2])]), 0, 1]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has been deconstructed by ＀", [live(f.src), (yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])]))])]);
		yield* g.srcCall(f, "investigate_log", fmt("SMES deconstructed by ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])]))]), "singulo");
		return live(f.dot);
	} else {
		if ((truthy(rt.sv(f, "panel_open")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0)))) {
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/power/smes/proc/default_deconstruction_crowbar  (code/modules/power/smes.dm:183)  may sleep
rt.def("/obj/machinery/power/smes/proc/default_deconstruction_crowbar", function* default_deconstruction_crowbar(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0)) && truthy(rt.sv(f, "terminal")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You must first remove the power terminal!</span>"]);
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["C"] });

// /obj/machinery/power/smes/proc/on_deconstruction  (code/modules/power/smes.dm:190)
rt.def("/obj/machinery/power/smes/proc/on_deconstruction", function on_deconstruction(f: Frame) {
	let cell: Value = null;
	let $e: any;
	f.vars = () => [cell, $e];
	cell = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/cell"));
	while (($e = rt.next(f, 0)) !== undefined) {
		cell = $e;
		rt.setFv(f, "charge", live(cell), multiply(divide(rt.sv(f, "charge"), rt.sv(f, "capacity")), rt.fv(f, "maxcharge", live(cell))));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/power/smes/proc/Destroy  (code/modules/power/smes.dm:194)  may sleep
rt.def("/obj/machinery/power/smes/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null, _T: Value = null;
	f.vars = () => [A, _T];
	if ((truthy(rt.gl("SSticker")) && truthy((yield* g.callName(f, rt.gl("SSticker"), "IsRoundInProgress", []))))) {
		A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
		_T = rt.getStep(f, live(f.src), 0);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("SMES deleted at ＀＀", [live(A), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("SMES deleted at ＀＀", [live(A), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
		yield* g.srcCall(f, "investigate_log", fmt("<font color='red'>deleted</font> at ＀＀", [live(A), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]), "singulo");
	}
	if (truthy(rt.sv(f, "terminal"))) {
		yield* g.srcCall(f, "disconnect_terminal");
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/power/smes/proc/make_terminal  (code/modules/power/smes.dm:207)  may sleep
rt.def("/obj/machinery/power/smes/proc/make_terminal", function* make_terminal(f: Frame, _T: Value) {
	f.vars = () => [_T];
	rt.setSv(f, "terminal", (yield* g.new_(f, T("/obj/machinery/power/terminal"), [live(_T)])));
	yield* g.callName(f, rt.sv(f, "terminal"), "setDir", [rt.getDir(f, live(_T), live(f.src))]);
	rt.setFv(f, "master", rt.sv(f, "terminal"), live(f.src));
	(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
	return f.dot;
}, true);

// /obj/machinery/power/smes/proc/disconnect_terminal  (code/modules/power/smes.dm:214)
rt.def("/obj/machinery/power/smes/proc/disconnect_terminal", function disconnect_terminal(f: Frame) {
	if (!truthy(rt.sv(f, "terminal"))) return f.dot;
	rt.setFv(f, "master", rt.sv(f, "terminal"), null);
	rt.setSv(f, "terminal", null);
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	return f.dot;
});

// /obj/machinery/power/smes/proc/update_icon  (code/modules/power/smes.dm:220)
rt.def("/obj/machinery/power/smes/proc/update_icon", function update_icon(f: Frame) {
	let clevel: Value = null;
	f.vars = () => [clevel];
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "panel_open"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "outputting"))) {
		rt.callSrc(f, "add_overlay", ["smes-op1"]);
	} else {
		rt.callSrc(f, "add_overlay", ["smes-op0"]);
	}
	if (truthy(rt.sv(f, "inputting"))) {
		rt.callSrc(f, "add_overlay", ["smes-oc1"]);
	} else {
		if (truthy(rt.sv(f, "input_attempt"))) {
			rt.callSrc(f, "add_overlay", ["smes-oc0"]);
		}
	}
	if (!rt.gt((clevel = rt.callSrc(f, "chargedisplay", [])), 0)) return f.dot;
	rt.callSrc(f, "add_overlay", [fmt("smes-og＀", [live(clevel)])]);
	return f.dot;
});

// /obj/machinery/power/smes/proc/chargedisplay  (code/modules/power/smes.dm:244)
rt.def("/obj/machinery/power/smes/proc/chargedisplay", function chargedisplay(f: Frame) {
	return rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/round"), null, [divide(multiply(5.5, rt.sv(f, "charge")), rt.sv(f, "capacity"))]), 5])]);
});

// /obj/machinery/power/smes/proc/process  (code/modules/power/smes.dm:247)
rt.def("/obj/machinery/power/smes/proc/process", function process(f: Frame) {
	let last_disp: Value = null, last_chrg: Value = null, last_onln: Value = null, load: Value = null;
	f.vars = () => [last_disp, last_chrg, last_onln, load];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	last_disp = rt.callSrc(f, "chargedisplay", []);
	last_chrg = rt.sv(f, "inputting");
	last_onln = rt.sv(f, "outputting");
	if ((truthy(rt.sv(f, "terminal")) && truthy(rt.sv(f, "input_attempt")))) {
		rt.setSv(f, "input_available", rt.callName(f, rt.sv(f, "terminal"), "surplus", []));
		if (truthy(rt.sv(f, "inputting"))) {
			if (rt.gt(rt.sv(f, "input_available"), 0)) {
				rt.modSrcVar(f, "charge", multiply((load = rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/min"), null, [divide(subtract(rt.sv(f, "capacity"), rt.sv(f, "charge")), 0.05000000074505806), rt.sv(f, "input_level")]), rt.sv(f, "input_available")])), 0.05000000074505806), add);
				rt.callSrc(f, "add_load", [live(load)]);
			} else {
				rt.setSv(f, "inputting", 0);
			}
		} else {
			if ((truthy(rt.sv(f, "input_attempt")) && rt.gt(rt.sv(f, "input_available"), 0))) {
				rt.setSv(f, "inputting", 1);
			}
		}
	} else {
		rt.setSv(f, "inputting", 0);
	}
	if (truthy(rt.sv(f, "output_attempt"))) {
		if (truthy(rt.sv(f, "outputting"))) {
			rt.setSv(f, "output_used", rt.call(f, P("/proc/min"), null, [divide(rt.sv(f, "charge"), 0.05000000074505806), rt.sv(f, "output_level")]));
			(rt.modSrcVar(f, "charge", multiply(rt.sv(f, "output_used"), 0.05000000074505806), subtract));
			rt.callSrc(f, "add_avail", [rt.sv(f, "output_used")]);
			if (rt.lt(rt.sv(f, "output_used"), 0.00009999999747378752)) {
				rt.setSv(f, "outputting", 0);
				rt.callSrc(f, "investigate_log", ["lost power and turned <font color='red'>off</font>", "singulo"]);
			}
		} else {
			if (((truthy(rt.sv(f, "output_attempt")) && rt.gt(rt.sv(f, "charge"), rt.sv(f, "output_level"))) && rt.gt(rt.sv(f, "output_level"), 0))) {
				rt.setSv(f, "outputting", 1);
			} else {
				rt.setSv(f, "output_used", 0);
			}
		}
	} else {
		rt.setSv(f, "outputting", 0);
	}
	if (!((!isEqual(live(last_disp), rt.callSrc(f, "chargedisplay", [])) || !isEqual(live(last_chrg), rt.sv(f, "inputting"))) || !isEqual(live(last_onln), rt.sv(f, "outputting")))) return f.dot;
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/power/smes/proc/restore  (code/modules/power/smes.dm:305)
rt.def("/obj/machinery/power/smes/proc/restore", function restore(f: Frame) {
	let excess: Value = null, clev: Value = null;
	f.vars = () => [excess, clev];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "outputting"))) {
		rt.setSv(f, "output_used", 0);
		return live(f.dot);
	}
	excess = rt.fv(f, "netexcess", rt.sv(f, "powernet"));
	excess = rt.call(f, P("/proc/min"), null, [rt.sv(f, "output_used"), live(excess)]);
	excess = rt.call(f, P("/proc/min"), null, [divide(subtract(rt.sv(f, "capacity"), rt.sv(f, "charge")), 0.05000000074505806), live(excess)]);
	clev = rt.callSrc(f, "chargedisplay", []);
	rt.modSrcVar(f, "charge", multiply(live(excess), 0.05000000074505806), add);
	(rt.modField(f, rt.sv(f, "powernet"), "netexcess", live(excess), subtract));
	(rt.modSrcVar(f, "output_used", live(excess), subtract));
	if (!isEqual(live(clev), rt.callSrc(f, "chargedisplay", []))) {
		rt.callSrc(f, "update_icon", []);
	}
	return live(f.dot);
});

// /obj/machinery/power/smes/proc/add_load  (code/modules/power/smes.dm:333)
rt.def("/obj/machinery/power/smes/proc/add_load", function add_load(f: Frame, amount: Value) {
	if (!(truthy(rt.sv(f, "terminal")) && truthy(rt.fv(f, "powernet", rt.sv(f, "terminal"))))) return f.dot;
	rt.modField(f, rt.fv(f, "powernet", rt.sv(f, "terminal")), "load", live(amount), add);
	return f.dot;
});

// /obj/machinery/power/smes/proc/ui_interact  (code/modules/power/smes.dm:338)  may sleep
rt.def("/obj/machinery/power/smes/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
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
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "smes", rt.sv(f, "name"), 340, 440, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/power/smes/proc/ui_data  (code/modules/power/smes.dm:344)
rt.def("/obj/machinery/power/smes/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	f.vars = () => [data];
	return (data = rt.alist(f, ["capacityPercent", rt.call(f, P("/proc/round"), null, [divide(multiply(100, rt.sv(f, "charge")), rt.sv(f, "capacity")), 0.10000000149011612]), "capacity", rt.sv(f, "capacity"), "charge", rt.sv(f, "charge"), "inputAttempt", rt.sv(f, "input_attempt"), "inputting", rt.sv(f, "inputting"), "inputLevel", rt.sv(f, "input_level"), "inputLevelMax", rt.sv(f, "input_level_max"), "inputAvailable", rt.sv(f, "input_available"), "outputAttempt", rt.sv(f, "output_attempt"), "outputting", rt.sv(f, "outputting"), "outputLevel", rt.sv(f, "output_level"), "outputLevelMax", rt.sv(f, "output_level_max"), "outputUsed", rt.sv(f, "output_used")]));
});

// /obj/machinery/power/smes/proc/ui_act  (code/modules/power/smes.dm:364)  may sleep
rt.def("/obj/machinery/power/smes/proc/ui_act", function* ui_act(f: Frame) {
	let target: Value = null, adjust: Value = null;
	let $0: any;
	f.vars = () => [target, adjust, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "tryinput") {
		rt.setSv(f, "input_attempt", (!truthy(rt.sv(f, "input_attempt")) ? 1 : 0));
		yield* g.srcCall(f, "log_smes", rt.fv(f, "ckey", live(f.usr)));
		yield* g.srcCall(f, "update_icon");
		f.dot = 1;
	} else if ($0 === "tryoutput") {
		rt.setSv(f, "output_attempt", (!truthy(rt.sv(f, "output_attempt")) ? 1 : 0));
		yield* g.srcCall(f, "log_smes", rt.fv(f, "ckey", live(f.usr)));
		yield* g.srcCall(f, "update_icon");
		f.dot = 1;
	} else if ($0 === "input") {
		target = rt.at(live(f.args[1]), "target");
		adjust = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "adjust")]));
		if (isEqual(live(target), "input")) {
			if (((target = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "input_level"), rt.sv(f, "name"), fmt("New input target (0-＀):", [rt.sv(f, "input_level_max")]), null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
				f.dot = 1;
			}
		} else {
			if (isEqual(live(target), "min")) {
				target = 0;
				f.dot = 1;
			} else {
				if (isEqual(live(target), "max")) {
					target = rt.sv(f, "input_level_max");
					f.dot = 1;
				} else {
					if (truthy(live(adjust))) {
						target = add(rt.sv(f, "input_level"), live(adjust));
						f.dot = 1;
					} else {
						if ((yield* g.call(f, P("/proc/text2num"), null, [live(target)])) !== null) {
							target = (yield* g.call(f, P("/proc/text2num"), null, [live(target)]));
							f.dot = 1;
						}
					}
				}
			}
		}
		if (truthy(live(f.dot))) {
			rt.setSv(f, "input_level", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [live(target), rt.sv(f, "input_level_max")]))])));
			yield* g.srcCall(f, "log_smes", rt.fv(f, "ckey", live(f.usr)));
		}
	} else if ($0 === "output") {
		target = rt.at(live(f.args[1]), "target");
		adjust = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "adjust")]));
		if (isEqual(live(target), "input")) {
			if (((target = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "output_level"), rt.sv(f, "name"), fmt("New output target (0-＀):", [rt.sv(f, "output_level_max")]), null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
				f.dot = 1;
			}
		} else {
			if (isEqual(live(target), "min")) {
				target = 0;
				f.dot = 1;
			} else {
				if (isEqual(live(target), "max")) {
					target = rt.sv(f, "output_level_max");
					f.dot = 1;
				} else {
					if (truthy(live(adjust))) {
						target = add(rt.sv(f, "output_level"), live(adjust));
						f.dot = 1;
					} else {
						if ((yield* g.call(f, P("/proc/text2num"), null, [live(target)])) !== null) {
							target = (yield* g.call(f, P("/proc/text2num"), null, [live(target)]));
							f.dot = 1;
						}
					}
				}
			}
		}
		if (!truthy(live(f.dot))) return f.dot;
		rt.setSv(f, "output_level", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [live(target), rt.sv(f, "output_level_max")]))])));
		yield* g.srcCall(f, "log_smes", rt.fv(f, "ckey", live(f.usr)));
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/power/smes/proc/log_smes  (code/modules/power/smes.dm:423)
rt.def("/obj/machinery/power/smes/proc/log_smes", function log_smes(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any;
	f.vars = () => [user, $0, $1, $2, $3, $4, $5];
	if (live(user) === null) {
		user = "";
	}
	if (rt.gt(rt.sv(f, "input_level"), rt.sv(f, "output_level"))) {
		$0 = "<font color='green'>";
	} else {
		$0 = "<font color='red'>";
	}
	$1 = rt.sv(f, "input_level");
	$2 = rt.sv(f, "output_level");
	$3 = rt.sv(f, "charge");
	if (truthy(rt.sv(f, "output_attempt"))) {
		$4 = "<font color='green'>on</font>";
	} else {
		$4 = "<font color='red'>off</font>";
	}
	if (truthy(rt.sv(f, "input_attempt"))) {
		$5 = "<font color='green'>auto</font>";
	} else {
		$5 = "<font color='red'>off</font>";
	}
	rt.callSrc(f, "investigate_log", [fmt("input/output; ＀＀/＀</font> | Charge: ＀ | Output-mode: ＀ | Input-mode: ＀ by ＀", [$0, $1, $2, $3, $4, $5, live(user)]), "singulo"]);
	return f.dot;
});

// /obj/machinery/power/smes/proc/emp_act  (code/modules/power/smes.dm:427)  may sleep
rt.def("/obj/machinery/power/smes/proc/emp_act", function* emp_act(f: Frame) {
	rt.setSv(f, "input_attempt", (yield* g.call(f, P("/proc/rand"), null, [0, 1])));
	rt.setSv(f, "inputting", rt.sv(f, "input_attempt"));
	rt.setSv(f, "output_attempt", (yield* g.call(f, P("/proc/rand"), null, [0, 1])));
	rt.setSv(f, "outputting", rt.sv(f, "output_attempt"));
	rt.setSv(f, "output_level", (yield* g.call(f, P("/proc/rand"), null, [0, rt.sv(f, "output_level_max")])));
	rt.setSv(f, "input_level", (yield* g.call(f, P("/proc/rand"), null, [0, rt.sv(f, "input_level_max")])));
	(rt.modSrcVar(f, "charge", divide(1000000, live(f.args[0])), subtract));
	if (rt.lt(rt.sv(f, "charge"), 0)) {
		rt.setSv(f, "charge", 0);
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "log_smes", "an emp");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

rt.type(10304, "/obj/machinery/power/smes/magical", "/obj/machinery/power/smes", {
	name: "magical power storage unit",
	desc: "A high-capacity superconducting magnetic energy storage (SMES) unit. Magically produces power.",
});

// /obj/machinery/power/smes/magical/proc/process  (code/modules/power/smes.dm:450)
rt.def("/obj/machinery/power/smes/magical/proc/process", function process(f: Frame) {
	rt.setSv(f, "capacity", 9.999999848243207e+30);
	rt.setSv(f, "charge", 9.999999848243207e+30);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { waitfor: false });
