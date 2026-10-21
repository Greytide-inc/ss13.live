// From code/modules/power/apc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10301, "/obj/machinery/power/apc", "/obj/machinery/power", {
	lon_range: 1.5,
	area: null,
	areastring: null,
	cell: null,
	start_charge: 90,
	cell_type: 2500,
	opened: 0,
	shorted: 0,
	lighting: 3,
	equipment: 3,
	environ: 3,
	operating: 1,
	charging: 0,
	chargemode: 1,
	chargecount: 0,
	locked: 1,
	coverlocked: 1,
	aidisabled: 0,
	tdir: null,
	terminal: null,
	lastused_light: 0,
	lastused_equip: 0,
	lastused_environ: 0,
	lastused_total: 0,
	main_status: 0,
	malfhack: 0,
	malfai: null,
	has_electronics: 0,
	overload: 1,
	beenhit: 0,
	occupier: null,
	transfer_in_progress: 0,
	longtermpower: 10,
	auto_name: 0,
	failure_timer: 0,
	force_update: 0,
	update_state: -1,
	update_overlay: -1,
	icon_update_needed: 0,
	anchored: 1,
	name: "area power controller",
	desc: "A control terminal for the area electrical systems.",
	icon_state: "apc0",
	use_power: 0,
	req_access: null,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 50,
	resistance_flags: 2,
	powernet: 0,
});

// /obj/machinery/power/apc/proc/connect_to_network  (code/modules/power/apc.dm:103)  may sleep
rt.def("/obj/machinery/power/apc/proc/connect_to_network", function* connect_to_network(f: Frame) {
	if (!truthy(rt.sv(f, "terminal"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "terminal"), "connect_to_network", []);
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/New  (code/modules/power/apc.dm:106)  may sleep
rt.def("/obj/machinery/power/apc/proc/New", function* New(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy(rt.sv(f, "req_access"))) {
		rt.setSv(f, "req_access", rt.list(11));
	}
	if (!truthy(rt.sv(f, "armor"))) {
		rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 20, "laser", 10, "energy", 100, "bomb", 30, "bio", 100, "rad", 100, "fire", 90, "acid", 50]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("apcs_list", live(f.src), add);
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/apc"), [live(f.src)])));
	if (truthy(live(f.args[2]))) {
		yield* g.srcCall(f, "setDir", live(f.args[1]));
	}
	rt.setFv(f, "tdir", live(f.src), rt.sv(f, "dir"));
	yield* g.srcCall(f, "setDir", 2);
	if (truthy(rt.sv(f, "auto_name"))) {
		rt.setSv(f, "name", fmt("ÿ\u0016＀ APC", [(yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))]));
	}
	if (truthy(rt.bitAnd(rt.fv(f, "tdir", live(f.src)), 3))) {
		$0 = 0;
	} else {
		if (isEqual(rt.fv(f, "tdir", live(f.src)), 4)) {
			$0 = 24;
		} else {
			$0 = -24;
		}
	}
	rt.setSv(f, "pixel_x", $0);
	if (truthy(rt.bitAnd(rt.fv(f, "tdir", live(f.src)), 3))) {
		if (isEqual(rt.fv(f, "tdir", live(f.src)), 1)) {
			$0 = 24;
		} else {
			$0 = -24;
		}
	} else {
		$0 = 0;
	}
	rt.setSv(f, "pixel_y", $0);
	if (!truthy(live(f.args[2]))) return f.dot;
	rt.setSv(f, "area", (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])));
	rt.setSv(f, "opened", 1);
	rt.setSv(f, "operating", 0);
	rt.setSv(f, "name", fmt("＀ APC", [rt.fv(f, "name", rt.sv(f, "area"))]));
	(rt.modSrcVar(f, "stat", 8, rt.bitOr));
	yield* g.callName(f, live(f.src), "update_icon", []);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/power/apc/proc/update")])), 5]);
	return f.dot;
}, true, { args: ["loc", "ndir", "building"] });

// /obj/machinery/power/apc/proc/Destroy  (code/modules/power/apc.dm:136)  may sleep
rt.def("/obj/machinery/power/apc/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("apcs_list", live(f.src), subtract));
	if ((truthy(rt.sv(f, "malfai")) && truthy(rt.sv(f, "operating")))) {
		rt.setFv(f, "processing_time", rt.fv(f, "malf_picker", rt.sv(f, "malfai")), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [subtract(rt.gv(f, "processing_time", rt.fv(f, "malf_picker", rt.sv(f, "malfai"))), 10), 1000]))])));
	}
	rt.setFv(f, "power_light", rt.sv(f, "area"), 0);
	rt.setFv(f, "power_equip", rt.sv(f, "area"), 0);
	rt.setFv(f, "power_environ", rt.sv(f, "area"), 0);
	yield* g.callName(f, rt.sv(f, "area"), "power_change", []);
	if (truthy(rt.sv(f, "occupier"))) {
		yield* g.srcCall(f, "malfvacate", 1);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	if (truthy(rt.sv(f, "cell"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cell")]);
	}
	if (truthy(rt.sv(f, "terminal"))) {
		yield* g.srcCall(f, "disconnect_terminal");
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/handle_atom_del  (code/modules/power/apc.dm:155)  may sleep
rt.def("/obj/machinery/power/apc/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!isEqual(live(A), rt.sv(f, "cell"))) return f.dot;
	rt.setSv(f, "cell", null);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/make_terminal  (code/modules/power/apc.dm:163)  may sleep
rt.def("/obj/machinery/power/apc/proc/make_terminal", function* make_terminal(f: Frame) {
	rt.setSv(f, "terminal", (yield* g.new_(f, T("/obj/machinery/power/terminal"), [rt.fv(f, "loc", live(f.src))])));
	yield* g.callName(f, rt.sv(f, "terminal"), "setDir", [rt.sv(f, "tdir")]);
	rt.setFv(f, "master", rt.sv(f, "terminal"), live(f.src));
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/Initialize  (code/modules/power/apc.dm:168)  may sleep
rt.def("/obj/machinery/power/apc/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	rt.setSv(f, "has_electronics", 2);
	if (truthy(rt.sv(f, "cell_type"))) {
		rt.setFv(f, "cell", live(f.src), (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell"), [live(f.src)])));
		rt.setFv(f, "maxcharge", rt.sv(f, "cell"), rt.sv(f, "cell_type"));
		rt.setFv(f, "charge", rt.sv(f, "cell"), divide(multiply(rt.sv(f, "start_charge"), rt.fv(f, "maxcharge", rt.sv(f, "cell"))), 100));
	}
	if ((truthy((yield* g.call(f, P("/proc/isarea"), null, [(A = rt.gv(f, "loc", rt.fv(f, "loc", live(f.src))))]))) && rt.fv(f, "areastring", live(f.src)) === null)) {
		rt.setFv(f, "area", live(f.src), live(A));
	} else {
		rt.setFv(f, "area", live(f.src), (yield* g.call(f, P("/proc/get_area_by_name"), null, [rt.sv(f, "areastring")])));
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "make_terminal");
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/power/apc/proc/update")])), 5]);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/power/apc/proc/examine  (code/modules/power/apc.dm:192)
rt.def("/obj/machinery/power/apc/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "opened"))) {
		if ((truthy(rt.sv(f, "has_electronics")) && truthy(rt.sv(f, "terminal")))) {
			$0 = live(f.args[0]);
			if (isEqual(rt.sv(f, "opened"), 2)) {
				$1 = "removed";
			} else {
				$1 = "open";
			}
			if (truthy(rt.sv(f, "cell"))) {
				$2 = "installed";
			} else {
				$2 = "missing";
			}
			rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The cover is ＀ and the power cell is ＀.", [$1, $2])]);
		} else {
			$0 = live(f.args[0]);
			if (!truthy(rt.sv(f, "terminal"))) {
				$1 = "not";
			} else {
				$1 = "";
			}
			rt.call(f, P("/proc/to_chat"), null, [$0, fmt("It's ＀ wired up.", [$1])]);
			$0 = live(f.args[0]);
			if (!truthy(rt.sv(f, "has_electronics"))) {
				$1 = "n't";
			} else {
				$1 = "";
			}
			rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The electronics are＀ installed.", [$1])]);
		}
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 8))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "The cover is closed. Something is wrong with it. It doesn't work."]);
		} else {
			if (truthy(rt.sv(f, "malfhack"))) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "The cover is broken. It may be hard to force it open."]);
			} else {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "The cover is closed."]);
			}
		}
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/power/apc/proc/update_icon  (code/modules/power/apc.dm:214)
rt.def("/obj/machinery/power/apc/proc/update_icon", function update_icon(f: Frame) {
	let update: Value = null, basestate: Value = null, O: Value = null;
	let $0: any;
	f.vars = () => [update, basestate, O, $0];
	if (!truthy((update = rt.callSrc(f, "check_updates", [])))) {
		rt.setSv(f, "icon_update_needed", 0);
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(live(update), 1))) {
		if (truthy(rt.bitAnd(rt.sv(f, "update_state"), 128))) {
			rt.setSv(f, "icon_state", "apc0");
		} else {
			if (truthy(rt.bitAnd(rt.sv(f, "update_state"), 6))) {
				if (truthy(rt.sv(f, "cell"))) {
					$0 = "2";
				} else {
					$0 = "1";
				}
				basestate = fmt("apc＀", [$0]);
				if (truthy(rt.bitAnd(rt.sv(f, "update_state"), 2))) {
					if (truthy(rt.bitAnd(rt.sv(f, "update_state"), 24))) {
						rt.setSv(f, "icon_state", "apcmaint");
					} else {
						rt.setSv(f, "icon_state", live(basestate));
					}
				} else {
					if (truthy(rt.bitAnd(rt.sv(f, "update_state"), 4))) {
						if ((truthy(rt.bitAnd(rt.sv(f, "update_state"), 16)) || truthy(rt.sv(f, "malfhack")))) {
							rt.setSv(f, "icon_state", fmt("＀-b-nocover", [live(basestate)]));
						} else {
							rt.setSv(f, "icon_state", fmt("＀-nocover", [live(basestate)]));
						}
					}
				}
			} else {
				if (truthy(rt.bitAnd(rt.sv(f, "update_state"), 16))) {
					rt.setSv(f, "icon_state", "apc-b");
				} else {
					if (truthy(rt.bitAnd(rt.sv(f, "update_state"), 32))) {
						rt.setSv(f, "icon_state", "apcemag");
					} else {
						if (truthy(rt.bitAnd(rt.sv(f, "update_state"), 64))) {
							rt.setSv(f, "icon_state", "apcewires");
						} else {
							if (truthy(rt.bitAnd(rt.sv(f, "update_state"), 8))) {
								rt.setSv(f, "icon_state", "apc0");
							}
						}
					}
				}
			}
		}
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "update_state"), 128))) {
		rt.callSrc(f, "cut_overlays", []);
	}
	if (truthy(rt.bitAnd(live(update), 2))) {
		rt.callSrc(f, "cut_overlays", []);
		if ((!truthy(rt.bitAnd(rt.sv(f, "stat"), 9)) && truthy(rt.bitAnd(rt.sv(f, "update_state"), 128)))) {
			O = rt.list(fmt("apcox-＀", [rt.sv(f, "locked")]), fmt("apco3-＀", [rt.sv(f, "charging")]));
			if (truthy(rt.sv(f, "operating"))) {
				O = rt.modify(live(O), fmt("apco0-＀", [rt.sv(f, "equipment")]), add);
				O = rt.modify(live(O), fmt("apco1-＀", [rt.sv(f, "lighting")]), add);
				O = rt.modify(live(O), fmt("apco2-＀", [rt.sv(f, "environ")]), add);
			}
			rt.callSrc(f, "add_overlay", [live(O)]);
		}
	}
	if (truthy(rt.bitAnd(rt.sv(f, "update_state"), 128))) {
		$0 = rt.sv(f, "charging");
		if ($0 === 0) {
			rt.setSv(f, "light_color", "#FA8282");
		} else if ($0 === 1) {
			rt.setSv(f, "light_color", "#6496FA");
		} else if ($0 === 2) {
			rt.setSv(f, "light_color", "#64C864");
		}
		rt.callSrc(f, "set_light", [rt.sv(f, "lon_range")]);
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "update_state"), 32))) {
			rt.setSv(f, "light_color", "#6496FA");
			rt.callSrc(f, "set_light", [rt.sv(f, "lon_range")]);
		} else {
			rt.callSrc(f, "set_light", [0]);
		}
	}
	rt.setSv(f, "icon_update_needed", 0);
	return f.dot;
});

// /obj/machinery/power/apc/proc/check_updates  (code/modules/power/apc.dm:279)
rt.def("/obj/machinery/power/apc/proc/check_updates", function check_updates(f: Frame) {
	let last_update_state: Value = null, last_update_overlay: Value = null, results: Value = null;
	f.vars = () => [last_update_state, last_update_overlay, results];
	last_update_state = rt.sv(f, "update_state");
	last_update_overlay = rt.sv(f, "update_overlay");
	rt.setSv(f, "update_state", 0);
	rt.setSv(f, "update_overlay", 0);
	if (truthy(rt.sv(f, "cell"))) {
		(rt.modSrcVar(f, "update_state", 1, rt.bitOr));
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		(rt.modSrcVar(f, "update_state", 16, rt.bitOr));
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 8))) {
		(rt.modSrcVar(f, "update_state", 8, rt.bitOr));
	}
	if (truthy(rt.sv(f, "opened"))) {
		if (isEqual(rt.sv(f, "opened"), 1)) {
			(rt.modSrcVar(f, "update_state", 2, rt.bitOr));
		}
		if (isEqual(rt.sv(f, "opened"), 2)) {
			(rt.modSrcVar(f, "update_state", 4, rt.bitOr));
		}
	} else {
		if ((truthy(rt.sv(f, "emagged")) || truthy(rt.sv(f, "malfai")))) {
			(rt.modSrcVar(f, "update_state", 32, rt.bitOr));
		} else {
			if (truthy(rt.sv(f, "panel_open"))) {
				(rt.modSrcVar(f, "update_state", 64, rt.bitOr));
			}
		}
	}
	if (rt.le(rt.sv(f, "update_state"), 1)) {
		(rt.modSrcVar(f, "update_state", 128, rt.bitOr));
	}
	if (truthy(rt.sv(f, "operating"))) {
		(rt.modSrcVar(f, "update_overlay", 8192, rt.bitOr));
	}
	if (truthy(rt.bitAnd(rt.sv(f, "update_state"), 128))) {
		if (truthy(rt.sv(f, "locked"))) {
			(rt.modSrcVar(f, "update_overlay", 4096, rt.bitOr));
		}
		if (!truthy(rt.sv(f, "charging"))) {
			(rt.modSrcVar(f, "update_overlay", 1, rt.bitOr));
		} else {
			if (isEqual(rt.sv(f, "charging"), 1)) {
				(rt.modSrcVar(f, "update_overlay", 2, rt.bitOr));
			} else {
				if (isEqual(rt.sv(f, "charging"), 2)) {
					(rt.modSrcVar(f, "update_overlay", 4, rt.bitOr));
				}
			}
		}
		if (!truthy(rt.sv(f, "equipment"))) {
			(rt.modSrcVar(f, "update_overlay", 8, rt.bitOr));
		} else {
			if (isEqual(rt.sv(f, "equipment"), 1)) {
				(rt.modSrcVar(f, "update_overlay", 16, rt.bitOr));
			} else {
				if (isEqual(rt.sv(f, "equipment"), 2)) {
					(rt.modSrcVar(f, "update_overlay", 32, rt.bitOr));
				}
			}
		}
		if (!truthy(rt.sv(f, "lighting"))) {
			(rt.modSrcVar(f, "update_overlay", 64, rt.bitOr));
		} else {
			if (isEqual(rt.sv(f, "lighting"), 1)) {
				(rt.modSrcVar(f, "update_overlay", 128, rt.bitOr));
			} else {
				if (isEqual(rt.sv(f, "lighting"), 2)) {
					(rt.modSrcVar(f, "update_overlay", 256, rt.bitOr));
				}
			}
		}
		if (!truthy(rt.sv(f, "environ"))) {
			(rt.modSrcVar(f, "update_overlay", 512, rt.bitOr));
		} else {
			if (isEqual(rt.sv(f, "environ"), 1)) {
				(rt.modSrcVar(f, "update_overlay", 1024, rt.bitOr));
			} else {
				if (isEqual(rt.sv(f, "environ"), 2)) {
					(rt.modSrcVar(f, "update_overlay", 2048, rt.bitOr));
				}
			}
		}
	}
	results = 0;
	if ((isEqual(live(last_update_state), rt.sv(f, "update_state")) && isEqual(live(last_update_overlay), rt.sv(f, "update_overlay")))) {
		return 0;
	}
	if (!isEqual(live(last_update_state), rt.sv(f, "update_state"))) {
		results = rt.modify(live(results), 1, add);
	}
	if (!isEqual(live(last_update_overlay), rt.sv(f, "update_overlay"))) {
		results = rt.modify(live(results), 2, add);
	}
	return live(results);
});

// /obj/machinery/power/apc/proc/attackby  (code/modules/power/apc.dm:355)  may sleep
rt.def("/obj/machinery/power/apc/proc/attackby", function* attackby(f: Frame) {
	let host_turf: Value = null, C: Value = null, _T: Value = null, N: Value = null, WT: Value = null;
	let $0: any, $1: any;
	f.vars = () => [host_turf, C, _T, N, WT, $0, $1];
	if ((truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon")) ? 1 : 0)) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[1])])), 1))) {
		return (yield* g.callName(f, live(f.src), "attack_hand", [live(f.args[1])]));
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "opened"))) {
			if (isEqual(rt.sv(f, "has_electronics"), 1)) {
				if (truthy(rt.sv(f, "terminal"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Disconnect the wires first!</span>"]);
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You are trying to remove the power control board...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if (isEqual(rt.sv(f, "has_electronics"), 1)) {
						rt.setSv(f, "has_electronics", 0);
						if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
							yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has broken the power control board inside ＀!", [rt.fv(f, "name", live(f.args[1])), rt.fv(f, "name", live(f.src))]), "<span class='notice'>You break the charred power control board and remove the remains.</span>", "<span class='italics'>You hear a crack.</span>"]);
							return live(f.dot);
						} else {
							if (truthy(rt.sv(f, "emagged"))) {
								rt.setSv(f, "emagged", 0);
								yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has discarded emaged power control board from ＀!", [rt.fv(f, "name", live(f.args[1])), rt.fv(f, "name", live(f.src))]), "<span class='notice'>You discarded shorten board.</span>"]);
								return live(f.dot);
							} else {
								if (truthy(rt.sv(f, "malfhack"))) {
									yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has discarded strangely programmed power control board from ＀!", [rt.fv(f, "name", live(f.args[1])), rt.fv(f, "name", live(f.src))]), "<span class='notice'>You discarded strangely programmed board.</span>"]);
									rt.setSv(f, "malfai", null);
									rt.setSv(f, "malfhack", 0);
									return live(f.dot);
								} else {
									yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has removed the power control board from ＀!", [rt.fv(f, "name", live(f.args[1])), rt.fv(f, "name", live(f.src))]), "<span class='notice'>You remove the power control board.</span>"]);
									yield* g.new_(f, T("/obj/item/weapon/electronics/apc"), [rt.sv(f, "loc")]);
									return live(f.dot);
								}
							}
						}
					}
				}
			} else {
				if (!isEqual(rt.sv(f, "opened"), 2)) {
					rt.setSv(f, "opened", 0);
					rt.setSv(f, "coverlocked", 1);
					yield* g.srcCall(f, "update_icon");
					return live(f.dot);
				}
			}
		} else {
			if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
				if ((truthy(rt.sv(f, "coverlocked")) && !truthy(rt.bitAnd(rt.sv(f, "stat"), 8)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The cover is locked and cannot be opened!</span>"]);
					return live(f.dot);
				} else {
					if (truthy(rt.sv(f, "panel_open"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Exposed wires prevents you from opening it!</span>"]);
						return live(f.dot);
					} else {
						rt.setSv(f, "opened", 1);
						yield* g.srcCall(f, "update_icon");
						return live(f.dot);
					}
				}
			}
		}
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0)) && truthy(rt.sv(f, "opened")))) {
			if (truthy(rt.sv(f, "cell"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is a power cell already installed!</span>"]);
				return live(f.dot);
			} else {
				if (truthy(rt.bitAnd(rt.sv(f, "stat"), 8))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is no connector for your power cell!</span>"]);
					return live(f.dot);
				}
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(f.args[0]), "forceMove", [live(f.src)]);
				rt.setSv(f, "cell", live(f.args[0]));
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has inserted the power cell to ＀!", [rt.fv(f, "name", live(f.args[1])), rt.fv(f, "name", live(f.src))]), "<span class='notice'>You insert the power cell.</span>"]);
				rt.setSv(f, "chargecount", 0);
				yield* g.srcCall(f, "update_icon");
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
				if (truthy(rt.sv(f, "opened"))) {
					if (truthy(rt.sv(f, "cell"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Close the APC first!</span>"]);
						return live(f.dot);
					} else {
						if (isEqual(rt.sv(f, "has_electronics"), 1)) {
							rt.setSv(f, "has_electronics", 2);
							(rt.modSrcVar(f, "stat", 16777207, rt.bitAnd));
							yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You screw the circuit electronics into place.</span>"]);
						} else {
							if (isEqual(rt.sv(f, "has_electronics"), 2)) {
								rt.setSv(f, "has_electronics", 1);
								(rt.modSrcVar(f, "stat", 8, rt.bitOr));
								yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unfasten the electronics.</span>"]);
							} else {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is nothing to secure!</span>"]);
								return live(f.dot);
							}
						}
						yield* g.srcCall(f, "update_icon");
					}
				} else {
					if (truthy(rt.sv(f, "emagged"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The interface is broken!</span>"]);
					} else {
						if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 8)) && !truthy(rt.sv(f, "opened")))) {
							yield* g.callSuper(f, [], rt.Args.Same);
						} else {
							rt.setSv(f, "panel_open", (!truthy(rt.sv(f, "panel_open")) ? 1 : 0));
							$0 = live(f.args[1]);
							if (truthy(rt.sv(f, "panel_open"))) {
								$1 = "exposed";
							} else {
								$1 = "unexposed";
							}
							yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("The wires have been ＀", [$1])]);
							yield* g.srcCall(f, "update_icon");
						}
					}
				}
			} else {
				if (truthy((yield* g.callName(f, live(f.args[0]), "GetID", [])))) {
					if (truthy(rt.sv(f, "emagged"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The interface is broken!</span>"]);
					} else {
						if (truthy(rt.sv(f, "opened"))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must close the cover to swipe an ID card!</span>"]);
						} else {
							if (truthy(rt.sv(f, "panel_open"))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must close the panel!</span>"]);
							} else {
								if (truthy(rt.bitAnd(rt.sv(f, "stat"), 9))) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Nothing happens!</span>"]);
								} else {
									if (((truthy((yield* g.srcCall(f, "allowed", live(f.usr)))) && !truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["ID Scan"])))) && !truthy(rt.sv(f, "malfhack")))) {
										rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
										$0 = live(f.args[1]);
										if (truthy(rt.sv(f, "locked"))) {
											$1 = "lock";
										} else {
											$1 = "unlock";
										}
										yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the APC interface.</span>", [$1])]);
										yield* g.srcCall(f, "update_icon");
									} else {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Access denied.</span>"]);
									}
								}
							}
						}
					}
				} else {
					if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0)) && truthy(rt.sv(f, "opened")))) {
						if (!truthy((host_turf = rt.getStep(f, live(f.src), 0)))) {
							rt.throw_(f, (yield* g.new_(f, T("/exception"), ["attackby on APC when it's not on a turf", "code/modules/power/apc.dm", 478])));
							return live(f.dot);
						}
						if (truthy(rt.fv(f, "intact", live(host_turf)))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must remove the floor plating in front of the APC first!</span>"]);
							return live(f.dot);
						} else {
							if (truthy(rt.sv(f, "terminal"))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This APC is already wired!</span>"]);
								return live(f.dot);
							} else {
								if (isEqual(rt.sv(f, "has_electronics"), 0)) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is nothing to wire!</span>"]);
									return live(f.dot);
								}
							}
						}
						if (rt.lt((yield* g.callName(f, (C = live(f.args[0])), "get_amount", [])), 10)) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need ten lengths of cable for APC!</span>"]);
							return live(f.dot);
						}
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ adds cables to the APC frame.", [rt.fv(f, "name", live(f.args[1]))]), "<span class='notice'>You start adding cables to the APC frame...</span>"]);
						yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
							if ((rt.lt((yield* g.callName(f, live(C), "get_amount", [])), 10) || !truthy(live(C)))) {
								return live(f.dot);
							}
							if ((((rt.ge((yield* g.callName(f, live(C), "get_amount", [])), 10) && !truthy(rt.sv(f, "terminal"))) && truthy(rt.sv(f, "opened"))) && rt.gt(rt.sv(f, "has_electronics"), 0))) {
								_T = rt.getStep(f, live(f.src), 0);
								N = (yield* g.callName(f, live(_T), "get_cable_node", []));
								if ((truthy(rt.op(f, "Prob", [], [50])) && truthy((yield* g.call(f, P("/proc/electrocute_mob"), null, [live(f.usr), live(N), live(N), 1, 1]))))) {
									yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, live(f.src)]);
									return live(f.dot);
								}
								yield* g.callName(f, live(C), "use", [10]);
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add cables to the APC frame.</span>"]);
								yield* g.srcCall(f, "make_terminal");
								yield* g.callName(f, rt.sv(f, "terminal"), "connect_to_network", []);
							}
						}
					} else {
						if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0)) && truthy(rt.sv(f, "terminal"))) && truthy(rt.sv(f, "opened")))) {
							yield* g.callName(f, rt.sv(f, "terminal"), "dismantle", [live(f.args[1]), live(f.args[0])]);
						} else {
							if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/electronics/apc")) ? 1 : 0)) && truthy(rt.sv(f, "opened")))) {
								if (!isEqual(rt.sv(f, "has_electronics"), 0)) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You cannot put the board inside, there already is one!</span>"]);
									return live(f.dot);
								} else {
									if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You cannot put the board inside, the frame is damaged!</span>"]);
										return live(f.dot);
									}
								}
								yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ inserts the power control board into ＀.", [rt.fv(f, "name", live(f.args[1])), live(f.src)]), "<span class='notice'>You start to insert the power control board into the frame...</span>"]);
								yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
								if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 10, "target", live(f.src)], rt.Args.Named)))) {
									if (isEqual(rt.sv(f, "has_electronics"), 0)) {
										rt.setSv(f, "has_electronics", 1);
										rt.setSv(f, "locked", 1);
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You place the power control board inside the frame.</span>"]);
										yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
									}
								}
							} else {
								if ((((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && truthy(rt.sv(f, "opened"))) && isEqual(rt.sv(f, "has_electronics"), 0)) && !truthy(rt.sv(f, "terminal")))) {
									if (rt.lt((yield* g.callName(f, (WT = live(f.args[0])), "get_fuel", [])), 3)) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more welding fuel to complete this task!</span>"]);
										return live(f.dot);
									}
									yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ welds ＀.", [rt.fv(f, "name", live(f.args[1])), live(f.src)]), "<span class='notice'>You start welding the APC frame...</span>", "<span class='italics'>You hear welding.</span>"]);
									yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(WT)), 50, 1]);
									if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
										if ((!truthy(live(f.src)) || !truthy((yield* g.callName(f, live(WT), "remove_fuel", [3, live(f.args[1])]))))) {
											return live(f.dot);
										}
										if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) || isEqual(rt.sv(f, "opened"), 2))) {
											yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc")]);
											yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has cut ＀ apart with ＀.", [rt.fv(f, "name", live(f.args[1])), live(f.src), live(f.args[0])]), "<span class='notice'>You disassembled the broken APC frame.</span>"]);
										} else {
											yield* g.new_(f, T("/obj/item/wallframe/apc"), [rt.sv(f, "loc")]);
											yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has cut ＀ from the wall with ＀.", [rt.fv(f, "name", live(f.args[1])), live(f.src), live(f.args[0])]), "<span class='notice'>You cut the APC frame from the wall.</span>"]);
										}
										yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
										return live(f.dot);
									}
								} else {
									if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/wallframe/apc")) ? 1 : 0)) && truthy(rt.sv(f, "opened")))) {
										if (!((truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) || isEqual(rt.sv(f, "opened"), 2)) || rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")))) {
											yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You found no reason for repairing this APC</span>"]);
											return live(f.dot);
										}
										if ((!truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) && isEqual(rt.sv(f, "opened"), 2))) {
											yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ replaces missing APC's cover.", [rt.fv(f, "name", live(f.args[1]))]), "<span class='notice'>You begin to replace APC's cover...</span>"]);
											if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
												yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You replace missing APC's cover.</span>"]);
												yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
												rt.setSv(f, "opened", 1);
												yield* g.srcCall(f, "update_icon");
											}
											return live(f.dot);
										}
										if (truthy(rt.sv(f, "has_electronics"))) {
											yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You cannot repair this APC until you remove the electronics still inside!</span>"]);
											return live(f.dot);
										}
										yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ replaces the damaged APC frame with a new one.", [rt.fv(f, "name", live(f.args[1]))]), "<span class='notice'>You begin to replace the damaged APC frame...</span>"]);
										if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(f.src)], rt.Args.Named)))) {
											yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You replace the damaged APC frame with a new one.</span>"]);
											yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
											(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
											rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
											if (isEqual(rt.sv(f, "opened"), 2)) {
												rt.setSv(f, "opened", 1);
											}
											yield* g.srcCall(f, "update_icon");
										}
									} else {
										if (((truthy(rt.sv(f, "panel_open")) && !truthy(rt.sv(f, "opened"))) && truthy((yield* g.call(f, P("/proc/is_wire_tool"), null, [live(f.args[0])]))))) {
											yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[1])]);
										} else {
											return (yield* g.callSuper(f, [], rt.Args.Same));
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/power/apc/proc/run_obj_armor  (code/modules/power/apc.dm:588)
rt.def("/obj/machinery/power/apc/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (((isEqual(live(f.args[2]), "melee") && rt.lt(live(f.args[0]), 15)) && (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) || truthy(rt.sv(f, "malfai"))))) {
		return 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// /obj/machinery/power/apc/proc/obj_break  (code/modules/power/apc.dm:594)  may sleep
rt.def("/obj/machinery/power/apc/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) return f.dot;
	yield* g.srcCall(f, "set_broken");
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/deconstruct  (code/modules/power/apc.dm:598)  may sleep
rt.def("/obj/machinery/power/apc/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) return f.dot;
	if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		yield* g.srcCall(f, "set_broken");
	}
	if (isEqual(rt.sv(f, "opened"), 2)) return f.dot;
	rt.setSv(f, "opened", 2);
	yield* g.srcCall(f, "visible_message", "<span class='warning'>The APC cover is knocked down!</span>");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/emag_act  (code/modules/power/apc.dm:607)
rt.def("/obj/machinery/power/apc/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (!(!truthy(rt.sv(f, "emagged")) && !truthy(rt.sv(f, "malfhack")))) return f.dot;
	if (truthy(rt.sv(f, "opened"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You must close the cover to swipe an ID card!</span>"]);
	} else {
		if (truthy(rt.sv(f, "panel_open"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You must close the panel first!</span>"]);
		} else {
			if (truthy(rt.bitAnd(rt.sv(f, "stat"), 9))) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Nothing happens!</span>"]);
			} else {
				rt.call(f, P("/proc/flick"), null, ["apc-spark", live(f.src)]);
				rt.setSv(f, "emagged", 1);
				rt.setSv(f, "locked", 0);
				rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You emag the APC interface.</span>"]);
				rt.callSrc(f, "update_icon", []);
			}
		}
	}
	return f.dot;
});

// /obj/machinery/power/apc/proc/attack_hand  (code/modules/power/apc.dm:624)  may sleep
rt.def("/obj/machinery/power/apc/proc/attack_hand", function* attack_hand(f: Frame) {
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	if (((isEqual(live(f.usr), live(f.args[0])) && truthy(rt.sv(f, "opened"))) && !truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon")) ? 1 : 0)))) {
		if (truthy(rt.sv(f, "cell"))) {
			yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("＀ removes ％！ from ＀!", [live(f.args[0]), rt.sv(f, "cell"), live(f.src)]), fmt("<span class='notice'>You remove ％！.</span>", [rt.sv(f, "cell")])]);
			yield* g.callName(f, live(f.args[0]), "put_in_hands", [rt.sv(f, "cell")]);
			yield* g.callName(f, rt.sv(f, "cell"), "update_icon", []);
			rt.setFv(f, "cell", live(f.src), null);
			rt.setSv(f, "charging", 0);
			yield* g.callName(f, live(f.src), "update_icon", []);
		}
		return live(f.dot);
	}
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 8)) && !truthy(rt.sv(f, "opened")))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/power/apc/proc/ui_interact  (code/modules/power/apc.dm:641)  may sleep
rt.def("/obj/machinery/power/apc/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state, $0, $1, $2];
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
	if (!truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) {
		yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "apc", rt.sv(f, "name"), 535, 515, live(master_ui), live(state)]))), "open", []);
	}
	if (!truthy(live(ui))) return f.dot;
	$0 = live(ui);
	$1 = "state";
	if (truthy(rt.sv(f, "failure_timer"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	yield* g.callName(f, $0, "set_autoupdate", [$1, $2], rt.Args.Named);
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/ui_data  (code/modules/power/apc.dm:650)
rt.def("/obj/machinery/power/apc/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $9: any;
	f.vars = () => [data, $0, $1, $2, $3, $4, $5, $6, $7, $8, $9];
	$0 = "locked";
	$1 = rt.sv(f, "locked");
	$2 = "failTime";
	$3 = rt.sv(f, "failure_timer");
	$4 = "isOperating";
	$5 = rt.sv(f, "operating");
	$6 = "externalPower";
	$7 = rt.sv(f, "main_status");
	$8 = "powerCellStatus";
	if (truthy(rt.sv(f, "cell"))) {
		$9 = rt.callName(f, rt.sv(f, "cell"), "percent", []);
	} else {
		$9 = null;
	}
	return (data = rt.alist(f, [$0, $1, $2, $3, $4, $5, $6, $7, $8, $9, "chargeMode", rt.sv(f, "chargemode"), "chargingStatus", rt.sv(f, "charging"), "totalLoad", rt.sv(f, "lastused_total"), "coverLocked", rt.sv(f, "coverlocked"), "siliconUser", (rt.fv(f, "has_unlimited_silicon_privilege", live(user)) || rt.callName(f, live(user), "using_power_flow_console", [])), "malfStatus", rt.callSrc(f, "get_malf_status", [live(user)]), "powerChannels", rt.list(rt.alist(f, ["title", "Equipment", "powerLoad", rt.sv(f, "lastused_equip"), "status", rt.sv(f, "equipment"), "topicParams", rt.alist(f, ["auto", rt.alist(f, ["eqp", 3]), "on", rt.alist(f, ["eqp", 2]), "off", rt.alist(f, ["eqp", 1])])]), rt.alist(f, ["title", "Lighting", "powerLoad", rt.sv(f, "lastused_light"), "status", rt.sv(f, "lighting"), "topicParams", rt.alist(f, ["auto", rt.alist(f, ["lgt", 3]), "on", rt.alist(f, ["lgt", 2]), "off", rt.alist(f, ["lgt", 1])])]), rt.alist(f, ["title", "Environment", "powerLoad", rt.sv(f, "lastused_environ"), "status", rt.sv(f, "environ"), "topicParams", rt.alist(f, ["auto", rt.alist(f, ["env", 3]), "on", rt.alist(f, ["env", 2]), "off", rt.alist(f, ["env", 1])])]))]));
});

// /obj/machinery/power/apc/proc/get_malf_status  (code/modules/power/apc.dm:700)
rt.def("/obj/machinery/power/apc/proc/get_malf_status", function get_malf_status(f: Frame, malf: Value) {
	if ((truthy((rt.istype(live(malf), T("/mob/living/silicon/ai")) ? 1 : 0)) && truthy(rt.fv(f, "malf_picker", live(malf))))) {
		if (isEqual(rt.sv(f, "malfai"), (rt.fv(f, "parent", live(malf)) || live(malf)))) {
			if (isEqual(rt.sv(f, "occupier"), live(malf))) {
				return 3;
			} else {
				if (truthy((rt.istype(rt.fv(f, "loc", live(malf)), T("/obj/machinery/power/apc")) ? 1 : 0))) {
					return 4;
				} else {
					return 2;
				}
			}
		} else {
			return 1;
		}
	} else {
		return 0;
	}
	return f.dot;
});

// /obj/machinery/power/apc/proc/report  (code/modules/power/apc.dm:714)
rt.def("/obj/machinery/power/apc/proc/report", function report(f: Frame) {
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any;
	f.vars = () => [$0, $1, $2, $3, $4, $5];
	$0 = rt.fv(f, "name", rt.sv(f, "area"));
	$1 = rt.sv(f, "equipment");
	$2 = rt.sv(f, "lighting");
	$3 = rt.sv(f, "environ");
	$4 = add(add(rt.sv(f, "lastused_equip"), rt.sv(f, "lastused_light")), rt.sv(f, "lastused_environ"));
	if (truthy(rt.sv(f, "cell"))) {
		$5 = rt.callName(f, rt.sv(f, "cell"), "percent", []);
	} else {
		$5 = "N/C";
	}
	return fmt("＀ : ＀/＀/＀ (＀) : ＀ (＀)", [$0, $1, $2, $3, $4, $5, rt.sv(f, "charging")]);
});

// /obj/machinery/power/apc/proc/update  (code/modules/power/apc.dm:717)  may sleep
rt.def("/obj/machinery/power/apc/proc/update", function* update(f: Frame) {
	if (((truthy(rt.sv(f, "operating")) && !truthy(rt.sv(f, "shorted"))) && !truthy(rt.sv(f, "failure_timer")))) {
		rt.setFv(f, "power_light", rt.sv(f, "area"), (rt.gt(rt.sv(f, "lighting"), 1) ? 1 : 0));
		rt.setFv(f, "power_equip", rt.sv(f, "area"), (rt.gt(rt.sv(f, "equipment"), 1) ? 1 : 0));
		rt.setFv(f, "power_environ", rt.sv(f, "area"), (rt.gt(rt.sv(f, "environ"), 1) ? 1 : 0));
	} else {
		rt.setFv(f, "power_light", rt.sv(f, "area"), 0);
		rt.setFv(f, "power_equip", rt.sv(f, "area"), 0);
		rt.setFv(f, "power_environ", rt.sv(f, "area"), 0);
	}
	yield* g.callName(f, rt.sv(f, "area"), "power_change", []);
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/can_use  (code/modules/power/apc.dm:728)
rt.def("/obj/machinery/power/apc/proc/can_use", function can_use(f: Frame, user: Value, loud: Value) {
	let AI: Value = null, robot: Value = null;
	f.vars = () => [loud, AI, robot];
	if (live(loud) === null) {
		loud = 0;
	}
	if (truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(user)]))) {
		return 1;
	}
	if (truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(user)))) {
		AI = live(user);
		robot = live(user);
		if ((truthy(rt.fv(f, "aidisabled", live(f.src))) || ((truthy(rt.sv(f, "malfhack")) && truthy((rt.istype(rt.sv(f, "malfai"), T("/mob/living/silicon/ai")) ? 1 : 0))) && ((truthy((rt.istype(live(AI), T("/mob/living/silicon/ai")) ? 1 : 0)) && (!isEqual(rt.sv(f, "malfai"), live(AI)) && !isEqual(rt.sv(f, "malfai"), rt.fv(f, "parent", live(AI))))) || (truthy((rt.istype(live(robot), T("/mob/living/silicon/robot")) ? 1 : 0)) && truthy((rt.isIn(f, live(robot), rt.fv(f, "connected_robots", rt.sv(f, "malfai"))) ? 1 : 0))))))) {
			if (!truthy(live(loud))) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＄！ has eee disabled!</span>", [live(f.src)])]);
			}
			return 0;
		}
	}
	return 1;
});

// /obj/machinery/power/apc/proc/ui_act  (code/modules/power/apc.dm:747)  may sleep
rt.def("/obj/machinery/power/apc/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || !truthy((yield* g.srcCall(f, "can_use", live(f.usr), 1)))) || ((truthy(rt.sv(f, "locked")) && !truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(f.usr)))) && !truthy(rt.sv(f, "failure_timer"))))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "lock") {
		if (truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(f.usr)))) {
			if ((truthy(rt.sv(f, "emagged")) || truthy(rt.bitAnd(rt.sv(f, "stat"), 9)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The APC does not respond to the command."]);
			} else {
				rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
				yield* g.srcCall(f, "update_icon");
				f.dot = 1;
			}
		}
	} else if ($0 === "cover") {
		rt.setSv(f, "coverlocked", (!truthy(rt.sv(f, "coverlocked")) ? 1 : 0));
		f.dot = 1;
	} else if ($0 === "breaker") {
		yield* g.srcCall(f, "toggle_breaker");
		f.dot = 1;
	} else if ($0 === "charge") {
		rt.setSv(f, "chargemode", (!truthy(rt.sv(f, "chargemode")) ? 1 : 0));
		if (!truthy(rt.sv(f, "chargemode"))) {
			rt.setSv(f, "charging", 0);
			yield* g.srcCall(f, "update_icon");
		}
		f.dot = 1;
	} else if ($0 === "channel") {
		if (truthy(rt.at(live(f.args[1]), "eqp"))) {
			rt.setSv(f, "equipment", (yield* g.srcCall(f, "setsubsystem", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "eqp")])))));
			yield* g.srcCall(f, "update_icon");
			yield* g.srcCall(f, "update");
		} else {
			if (truthy(rt.at(live(f.args[1]), "lgt"))) {
				rt.setSv(f, "lighting", (yield* g.srcCall(f, "setsubsystem", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "lgt")])))));
				yield* g.srcCall(f, "update_icon");
				yield* g.srcCall(f, "update");
			} else {
				if (truthy(rt.at(live(f.args[1]), "env"))) {
					rt.setSv(f, "environ", (yield* g.srcCall(f, "setsubsystem", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "env")])))));
					yield* g.srcCall(f, "update_icon");
					yield* g.srcCall(f, "update");
				}
			}
		}
		f.dot = 1;
	} else if ($0 === "overload") {
		if (truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(f.usr)))) {
			yield* g.srcCall(f, "overload_lighting");
			f.dot = 1;
		}
	} else if ($0 === "hack") {
		if (truthy((yield* g.srcCall(f, "get_malf_status", live(f.usr))))) {
			yield* g.srcCall(f, "malfhack", live(f.usr));
		}
	} else if ($0 === "occupy") {
		if (truthy((yield* g.srcCall(f, "get_malf_status", live(f.usr))))) {
			yield* g.srcCall(f, "malfoccupy", live(f.usr));
		}
	} else if ($0 === "deoccupy") {
		if (truthy((yield* g.srcCall(f, "get_malf_status", live(f.usr))))) {
			yield* g.srcCall(f, "malfvacate");
		}
	} else if ($0 === "reboot") {
		rt.setSv(f, "failure_timer", 0);
		yield* g.srcCall(f, "update_icon");
		yield* g.srcCall(f, "update");
	}
	return 1;
}, true, { args: ["action", "params"] });

// /obj/machinery/power/apc/proc/toggle_breaker  (code/modules/power/apc.dm:804)  may sleep
rt.def("/obj/machinery/power/apc/proc/toggle_breaker", function* toggle_breaker(f: Frame) {
	rt.setSv(f, "operating", (!truthy(rt.sv(f, "operating")) ? 1 : 0));
	yield* g.srcCall(f, "update");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/malfhack  (code/modules/power/apc.dm:809)  may sleep
rt.def("/obj/machinery/power/apc/proc/malfhack", function* malfhack(f: Frame, malf: Value) {
	let A: Value = null;
	f.vars = () => [malf, A];
	if (!truthy((rt.istype(live(malf), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!isEqual((yield* g.srcCall(f, "get_malf_status", live(malf))), 1)) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "malfhacking", live(malf)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(malf), "You are already hacking an APC."]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(malf), "Beginning override of APC systems. This takes some time, and you cannot perform other actions during the process."]);
	rt.setFv(f, "malfhack", live(malf), live(f.src));
	rt.setFv(f, "malfhacking", live(malf), (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(malf), P("/mob/living/silicon/ai/proc/malfhacked"), live(f.src)])), 600, 8])));
	A = null;
	rt.setFv(f, "target", (A = (yield* g.callName(f, live(malf), "throw_alert", ["hackingapc", T("/obj/screen/alert/hackingapc")]))), live(f.src));
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/malfoccupy  (code/modules/power/apc.dm:825)  may sleep
rt.def("/obj/machinery/power/apc/proc/malfoccupy", function* malfoccupy(f: Frame, malf: Value) {
	f.vars = () => [malf];
	if (!truthy((rt.istype(live(malf), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.fv(f, "loc", live(malf)), T("/obj/machinery/power/apc")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(malf), "<span class='warning'>You must evacuate your current APC first!</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "can_shunt", live(malf)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(malf), "<span class='warning'>You cannot shunt!</span>"]);
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "z", live(f.src)), 2)) {
		return live(f.dot);
	}
	rt.setSv(f, "occupier", (yield* g.new_(f, T("/mob/living/silicon/ai"), [live(f.src), rt.fv(f, "laws", live(malf)), live(malf)])));
	yield* g.callName(f, rt.sv(f, "occupier"), "adjustOxyLoss", [(yield* g.callName(f, live(malf), "getOxyLoss", []))]);
	if (!truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.fv(f, "name", rt.sv(f, "occupier")), "APC Copy"])))) {
		rt.setFv(f, "name", rt.sv(f, "occupier"), fmt("＀ APC Copy", [rt.fv(f, "name", live(malf))]));
	}
	if (truthy(rt.fv(f, "parent", live(malf)))) {
		rt.setFv(f, "parent", rt.sv(f, "occupier"), rt.fv(f, "parent", live(malf)));
	} else {
		rt.setFv(f, "parent", rt.sv(f, "occupier"), live(malf));
	}
	rt.setFv(f, "shunted", live(malf), 1);
	rt.setFv(f, "name", rt.fv(f, "eyeobj", rt.sv(f, "occupier")), fmt("＀ (AI Eye)", [rt.fv(f, "name", rt.sv(f, "occupier"))]));
	if (truthy(rt.fv(f, "parent", live(malf)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(malf)]);
	}
	rt.modField(f, rt.sv(f, "occupier"), "verbs", P("/mob/living/silicon/ai/proc/corereturn"), add);
	yield* g.callName(f, rt.sv(f, "occupier"), "cancel_camera", []);
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/malfvacate  (code/modules/power/apc.dm:852)  may sleep
rt.def("/obj/machinery/power/apc/proc/malfvacate", function* malfvacate(f: Frame, forced: Value) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [forced, _P, $e];
	if (!truthy(rt.sv(f, "occupier"))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "parent", rt.sv(f, "occupier"))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "parent", rt.sv(f, "occupier"))), 2))) {
		yield* g.callName(f, rt.fv(f, "mind", rt.sv(f, "occupier")), "transfer_to", [rt.fv(f, "parent", rt.sv(f, "occupier"))]);
		rt.setFv(f, "shunted", rt.fv(f, "parent", rt.sv(f, "occupier")), 0);
		yield* g.callName(f, rt.fv(f, "parent", rt.sv(f, "occupier")), "setOxyLoss", [(yield* g.callName(f, rt.sv(f, "occupier"), "getOxyLoss", []))]);
		yield* g.callName(f, rt.fv(f, "parent", rt.sv(f, "occupier")), "cancel_camera", []);
		(rt.modField(f, rt.fv(f, "parent", rt.sv(f, "occupier")), "verbs", P("/mob/living/silicon/ai/proc/corereturn"), subtract));
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "occupier")]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupier"), "<span class='danger'>Primary core damaged, unable to return core processes.</span>"]);
		if (!truthy(live(forced))) return f.dot;
		rt.setFv(f, "loc", rt.sv(f, "occupier"), rt.fv(f, "loc", live(f.src)));
		yield* g.callName(f, rt.sv(f, "occupier"), "death", []);
		yield* g.callName(f, rt.sv(f, "occupier"), "gib", []);
		_P = null;
		rt.forList(f, 0, rt.gl("pinpointer_list"), T("/obj/item/weapon/pinpointer"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_P = $e;
			yield* g.callName(f, live(_P), "switch_mode_to", [1]);
			rt.setFv(f, "nuke_warning", live(_P), 0);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/transfer_ai  (code/modules/power/apc.dm:872)  may sleep
rt.def("/obj/machinery/power/apc/proc/transfer_ai", function* transfer_ai(f: Frame, interaction: Value, user: Value, AI: Value, card: Value) {
	let _T: Value = null;
	f.vars = () => [interaction, user, AI, card, _T];
	if (truthy(rt.fv(f, "AI", live(card)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is already occupied!</span>", [live(card)])]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "occupier"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>There's nothing in ＀ to transfer!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if ((!truthy(rt.fv(f, "mind", rt.sv(f, "occupier"))) || !truthy(rt.fv(f, "client", rt.sv(f, "occupier"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is either inactive or destroyed!</span>", [rt.sv(f, "occupier")])]);
		return live(f.dot);
	}
	if (!truthy(rt.gv(f, "stat", rt.fv(f, "parent", rt.sv(f, "occupier"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is refusing all attempts at transfer!</span>", [rt.sv(f, "occupier")])]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "transfer_in_progress"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There's already a transfer in progress!</span>"]);
		return live(f.dot);
	}
	if ((!isEqual(live(interaction), 1) || truthy(rt.fv(f, "stat", rt.sv(f, "occupier"))))) {
		return live(f.dot);
	}
	if (!truthy((_T = rt.getStep(f, live(user), 0)))) {
		return live(f.dot);
	}
	rt.setSv(f, "transfer_in_progress", 1);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ slots ＀ into ＀...</span>", [live(user), live(card), live(f.src)]), "<span class='notice'>Transfer process initiated. Sending request for AI approval...</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	rt.op(f, "OutputReference", [rt.R.srcVar("occupier")], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/misc/notice2.ogg")]))], false);
	if (isEqual((yield* g.call(f, P("/proc/alert"), null, [rt.sv(f, "occupier"), fmt("＀ is attempting to transfer you to ＇！. Do you consent to this?", [live(user), rt.fv(f, "name", live(card))]), "APC Transfer", "Yes - Transfer Me", "No - Keep Me Here"])), "No - Keep Me Here")) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>AI denied transfer request. Process terminated.</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 1]);
		rt.setSv(f, "transfer_in_progress", 0);
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "loc", live(user)), live(_T))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Location changed. Process terminated.</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupier"), fmt("<span class='warning'>＀ moved away! Transfer canceled.</span>", [live(user)])]);
		rt.setSv(f, "transfer_in_progress", 0);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>AI accepted request. Transferring stored intelligence to ＀...</span>", [live(card)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupier"), fmt("<span class='notice'>Transfer starting. You will be moved to ＀ shortly.</span>", [live(card)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 50, "target", live(f.src)], rt.Args.Named)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupier"), fmt("<span class='warning'>＀ was interrupted! Transfer canceled.</span>", [live(user)])]);
		rt.setSv(f, "transfer_in_progress", 0);
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "occupier")) || !truthy(live(card)))) {
		rt.setSv(f, "transfer_in_progress", 0);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ transfers ＀ to ＀!</span>", [live(user), rt.sv(f, "occupier"), live(card)]), fmt("<span class='notice'>Transfer complete! ＀ is now stored in ＀.</span>", [rt.sv(f, "occupier"), live(card)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupier"), fmt("<span class='notice'>Transfer complete! You've been stored in ＀'s ＀.</span>", [live(user), rt.fv(f, "name", live(card))])]);
	yield* g.callName(f, rt.sv(f, "occupier"), "forceMove", [live(card)]);
	rt.setFv(f, "AI", live(card), rt.sv(f, "occupier"));
	rt.setFv(f, "shunted", rt.fv(f, "parent", rt.sv(f, "occupier")), 0);
	yield* g.callName(f, rt.sv(f, "occupier"), "cancel_camera", []);
	rt.setSv(f, "occupier", null);
	rt.setSv(f, "transfer_in_progress", 0);
	return live(f.dot);
}, true);

// /obj/machinery/power/apc/proc/surplus  (code/modules/power/apc.dm:927)
rt.def("/obj/machinery/power/apc/proc/surplus", function surplus(f: Frame) {
	if (truthy(rt.sv(f, "terminal"))) {
		return rt.callName(f, rt.sv(f, "terminal"), "surplus", []);
	}
	return 0;
});

// /obj/machinery/power/apc/proc/add_load  (code/modules/power/apc.dm:932)
rt.def("/obj/machinery/power/apc/proc/add_load", function add_load(f: Frame, amount: Value) {
	if (!(truthy(rt.sv(f, "terminal")) && truthy(rt.fv(f, "powernet", rt.sv(f, "terminal"))))) return f.dot;
	rt.modField(f, rt.fv(f, "powernet", rt.sv(f, "terminal")), "load", live(amount), add);
	return f.dot;
});

// /obj/machinery/power/apc/proc/avail  (code/modules/power/apc.dm:937)
rt.def("/obj/machinery/power/apc/proc/avail", function avail(f: Frame) {
	if (truthy(rt.sv(f, "terminal"))) {
		return rt.callName(f, rt.sv(f, "terminal"), "avail", []);
	}
	return 0;
});

// /obj/machinery/power/apc/proc/process  (code/modules/power/apc.dm:943)  may sleep
rt.def("/obj/machinery/power/apc/proc/process", function* process(f: Frame) {
	let last_lt: Value = null, last_eq: Value = null, last_en: Value = null, last_ch: Value = null, excess: Value = null, cellused: Value = null, ch: Value = null;
	f.vars = () => [last_lt, last_eq, last_en, last_ch, excess, cellused, ch];
	if (truthy(rt.sv(f, "icon_update_needed"))) {
		yield* g.srcCall(f, "update_icon");
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 9))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "requires_power", rt.sv(f, "area")))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "failure_timer"))) {
		yield* g.srcCall(f, "update");
		yield* g.srcCall(f, "queue_icon_update");
		rt.incSrcVar(f, "failure_timer", -1, true);
		rt.setSv(f, "force_update", 1);
		return live(f.dot);
	}
	rt.setSv(f, "lastused_light", (yield* g.callName(f, rt.sv(f, "area"), "usage", [6])));
	rt.modSrcVar(f, "lastused_light", (yield* g.callName(f, rt.sv(f, "area"), "usage", [2])), add);
	rt.setSv(f, "lastused_equip", (yield* g.callName(f, rt.sv(f, "area"), "usage", [1])));
	rt.modSrcVar(f, "lastused_equip", (yield* g.callName(f, rt.sv(f, "area"), "usage", [5])), add);
	rt.setSv(f, "lastused_environ", (yield* g.callName(f, rt.sv(f, "area"), "usage", [3])));
	rt.modSrcVar(f, "lastused_environ", (yield* g.callName(f, rt.sv(f, "area"), "usage", [7])), add);
	yield* g.callName(f, rt.sv(f, "area"), "clear_usage", []);
	rt.setSv(f, "lastused_total", add(add(rt.sv(f, "lastused_light"), rt.sv(f, "lastused_equip")), rt.sv(f, "lastused_environ")));
	last_lt = rt.sv(f, "lighting");
	last_eq = rt.sv(f, "equipment");
	last_en = rt.sv(f, "environ");
	last_ch = rt.sv(f, "charging");
	excess = (yield* g.srcCall(f, "surplus"));
	if (!truthy((yield* g.callName(f, live(f.src), "avail", [])))) {
		rt.setSv(f, "main_status", 0);
	} else {
		if (rt.lt(live(excess), 0)) {
			rt.setSv(f, "main_status", 1);
		} else {
			rt.setSv(f, "main_status", 2);
		}
	}
	if ((truthy(rt.sv(f, "cell")) && !truthy(rt.sv(f, "shorted")))) {
		cellused = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "charge", rt.sv(f, "cell")), multiply(rt.gl("CELLRATE"), rt.sv(f, "lastused_total"))]));
		yield* g.callName(f, rt.sv(f, "cell"), "use", [live(cellused)]);
		if (rt.gt(live(excess), rt.sv(f, "lastused_total"))) {
			yield* g.callName(f, rt.sv(f, "cell"), "give", [live(cellused)]);
			yield* g.srcCall(f, "add_load", divide(live(cellused), rt.gl("CELLRATE")));
		} else {
			if (rt.ge(add(divide(rt.fv(f, "charge", rt.sv(f, "cell")), rt.gl("CELLRATE")), live(excess)), rt.sv(f, "lastused_total"))) {
				rt.setFv(f, "charge", rt.sv(f, "cell"), (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "maxcharge", rt.sv(f, "cell")), add(rt.fv(f, "charge", rt.sv(f, "cell")), multiply(rt.gl("CELLRATE"), live(excess)))])));
				yield* g.srcCall(f, "add_load", live(excess));
				rt.setSv(f, "charging", 0);
			} else {
				rt.setSv(f, "charging", 0);
				rt.setSv(f, "chargecount", 0);
				rt.setSv(f, "equipment", (yield* g.srcCall(f, "autoset", rt.sv(f, "equipment"), 0)));
				rt.setSv(f, "lighting", (yield* g.srcCall(f, "autoset", rt.sv(f, "lighting"), 0)));
				rt.setSv(f, "environ", (yield* g.srcCall(f, "autoset", rt.sv(f, "environ"), 0)));
			}
		}
		if ((truthy(rt.sv(f, "charging")) && rt.lt(rt.sv(f, "longtermpower"), 10))) {
			rt.modSrcVar(f, "longtermpower", 1, add);
		} else {
			if (rt.gt(rt.sv(f, "longtermpower"), -10)) {
				(rt.modSrcVar(f, "longtermpower", 2, subtract));
			}
		}
		if (rt.le(rt.fv(f, "charge", rt.sv(f, "cell")), 0)) {
			rt.setSv(f, "equipment", (yield* g.srcCall(f, "autoset", rt.sv(f, "equipment"), 0)));
			rt.setSv(f, "lighting", (yield* g.srcCall(f, "autoset", rt.sv(f, "lighting"), 0)));
			rt.setSv(f, "environ", (yield* g.srcCall(f, "autoset", rt.sv(f, "environ"), 0)));
			yield* g.callName(f, rt.sv(f, "area"), "poweralert", [0, live(f.src)]);
		} else {
			if ((rt.lt((yield* g.callName(f, rt.sv(f, "cell"), "percent", [])), 15) && rt.lt(rt.sv(f, "longtermpower"), 0))) {
				rt.setSv(f, "equipment", (yield* g.srcCall(f, "autoset", rt.sv(f, "equipment"), 2)));
				rt.setSv(f, "lighting", (yield* g.srcCall(f, "autoset", rt.sv(f, "lighting"), 2)));
				rt.setSv(f, "environ", (yield* g.srcCall(f, "autoset", rt.sv(f, "environ"), 1)));
				yield* g.callName(f, rt.sv(f, "area"), "poweralert", [0, live(f.src)]);
			} else {
				if ((rt.lt((yield* g.callName(f, rt.sv(f, "cell"), "percent", [])), 30) && rt.lt(rt.sv(f, "longtermpower"), 0))) {
					rt.setSv(f, "equipment", (yield* g.srcCall(f, "autoset", rt.sv(f, "equipment"), 2)));
					rt.setSv(f, "lighting", (yield* g.srcCall(f, "autoset", rt.sv(f, "lighting"), 1)));
					rt.setSv(f, "environ", (yield* g.srcCall(f, "autoset", rt.sv(f, "environ"), 1)));
					yield* g.callName(f, rt.sv(f, "area"), "poweralert", [0, live(f.src)]);
				} else {
					rt.setSv(f, "equipment", (yield* g.srcCall(f, "autoset", rt.sv(f, "equipment"), 1)));
					rt.setSv(f, "lighting", (yield* g.srcCall(f, "autoset", rt.sv(f, "lighting"), 1)));
					rt.setSv(f, "environ", (yield* g.srcCall(f, "autoset", rt.sv(f, "environ"), 1)));
					yield* g.callName(f, rt.sv(f, "area"), "poweralert", [1, live(f.src)]);
					if (rt.gt((yield* g.callName(f, rt.sv(f, "cell"), "percent", [])), 75)) {
						yield* g.callName(f, rt.sv(f, "area"), "poweralert", [1, live(f.src)]);
					}
				}
			}
		}
		if (((truthy(rt.sv(f, "chargemode")) && isEqual(rt.sv(f, "charging"), 1)) && truthy(rt.sv(f, "operating")))) {
			if (rt.gt(live(excess), 0)) {
				yield* g.srcCall(f, "add_load", divide((ch = (yield* g.call(f, P("/proc/min"), null, [multiply(live(excess), rt.gl("CELLRATE")), multiply(rt.fv(f, "maxcharge", rt.sv(f, "cell")), rt.gl("CHARGELEVEL"))]))), rt.gl("CELLRATE")));
				yield* g.callName(f, rt.sv(f, "cell"), "give", [live(ch)]);
			} else {
				rt.setSv(f, "charging", 0);
				rt.setSv(f, "chargecount", 0);
			}
		}
		if (rt.ge(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "maxcharge", rt.sv(f, "cell")))) {
			rt.setFv(f, "charge", rt.sv(f, "cell"), rt.fv(f, "maxcharge", rt.sv(f, "cell")));
			rt.setSv(f, "charging", 2);
		}
		if (truthy(rt.sv(f, "chargemode"))) {
			if (!truthy(rt.sv(f, "charging"))) {
				if (rt.gt(live(excess), multiply(rt.fv(f, "maxcharge", rt.sv(f, "cell")), rt.gl("CHARGELEVEL")))) {
					rt.incSrcVar(f, "chargecount", 1, true);
				} else {
					rt.setSv(f, "chargecount", 0);
				}
				if (isEqual(rt.sv(f, "chargecount"), 10)) {
					rt.setSv(f, "chargecount", 0);
					rt.setSv(f, "charging", 1);
				}
			}
		} else {
			rt.setSv(f, "charging", 0);
			rt.setSv(f, "chargecount", 0);
		}
	} else {
		rt.setSv(f, "charging", 0);
		rt.setSv(f, "chargecount", 0);
		rt.setSv(f, "equipment", (yield* g.srcCall(f, "autoset", rt.sv(f, "equipment"), 0)));
		rt.setSv(f, "lighting", (yield* g.srcCall(f, "autoset", rt.sv(f, "lighting"), 0)));
		rt.setSv(f, "environ", (yield* g.srcCall(f, "autoset", rt.sv(f, "environ"), 0)));
		yield* g.callName(f, rt.sv(f, "area"), "poweralert", [0, live(f.src)]);
	}
	if ((((!isEqual(live(last_lt), rt.sv(f, "lighting")) || !isEqual(live(last_eq), rt.sv(f, "equipment"))) || !isEqual(live(last_en), rt.sv(f, "environ"))) || truthy(rt.sv(f, "force_update")))) {
		rt.setSv(f, "force_update", 0);
		yield* g.srcCall(f, "queue_icon_update");
		yield* g.srcCall(f, "update");
	} else {
		if (isEqual(live(last_ch), rt.sv(f, "charging"))) return f.dot;
		yield* g.srcCall(f, "queue_icon_update");
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/power/apc/proc/autoset  (code/modules/power/apc.dm:1104)
rt.def("/obj/machinery/power/apc/proc/autoset", function autoset(f: Frame, val: Value, on: Value) {
	if (isEqual(live(on), 0)) {
		if (isEqual(live(val), 2)) {
			return 0;
		} else {
			if (isEqual(live(val), 3)) {
				return 1;
			}
		}
	} else {
		if (isEqual(live(on), 1)) {
			if (isEqual(live(val), 1)) {
				return 3;
			}
		} else {
			if (isEqual(live(on), 2)) {
				if (isEqual(live(val), 3)) {
					return 1;
				}
			}
		}
	}
	return live(val);
});

// /obj/machinery/power/apc/proc/reset  (code/modules/power/apc.dm:1118)  may sleep
rt.def("/obj/machinery/power/apc/proc/reset", function* reset(f: Frame, wire: Value) {
	let $0: any;
	f.vars = () => [wire, $0];
	$0 = live(wire);
	if ($0 === "ID Scan") {
		rt.setSv(f, "locked", 1);
	} else if ($0 === "Main Power 1" || $0 === "Main Power 2") {
		if ((!truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Main Power 1"]))) && !truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Main Power 2"]))))) {
			rt.setSv(f, "shorted", 0);
		}
	} else if ($0 === "AI Connection") {
		if (!truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["AI Connection"])))) {
			rt.setSv(f, "aidisabled", 0);
		}
	} else if ($0 === "emp") {
		rt.setSv(f, "equipment", 3);
		rt.setSv(f, "environ", 3);
		yield* g.srcCall(f, "update_icon");
		yield* g.srcCall(f, "update");
	}
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/emp_act  (code/modules/power/apc.dm:1136)  may sleep
rt.def("/obj/machinery/power/apc/proc/emp_act", function* emp_act(f: Frame) {
	if (truthy(rt.sv(f, "cell"))) {
		yield* g.callName(f, rt.sv(f, "cell"), "emp_act", [live(f.args[0])]);
	}
	if (truthy(rt.sv(f, "occupier"))) {
		yield* g.callName(f, rt.sv(f, "occupier"), "emp_act", [live(f.args[0])]);
	}
	rt.setSv(f, "lighting", 0);
	rt.setSv(f, "equipment", 0);
	rt.setSv(f, "environ", 0);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "update");
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/power/apc/proc/reset"), "emp"])), 600]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/power/apc/proc/blob_act  (code/modules/power/apc.dm:1148)  may sleep
rt.def("/obj/machinery/power/apc/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	yield* g.srcCall(f, "set_broken");
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/disconnect_terminal  (code/modules/power/apc.dm:1152)
rt.def("/obj/machinery/power/apc/proc/disconnect_terminal", function disconnect_terminal(f: Frame) {
	if (!truthy(rt.sv(f, "terminal"))) return f.dot;
	rt.setFv(f, "master", rt.sv(f, "terminal"), null);
	rt.setSv(f, "terminal", null);
	return f.dot;
});

// /obj/machinery/power/apc/proc/set_broken  (code/modules/power/apc.dm:1156)  may sleep
rt.def("/obj/machinery/power/apc/proc/set_broken", function* set_broken(f: Frame) {
	if ((truthy(rt.sv(f, "malfai")) && truthy(rt.sv(f, "operating")))) {
		rt.setFv(f, "processing_time", rt.fv(f, "malf_picker", rt.sv(f, "malfai")), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [subtract(rt.gv(f, "processing_time", rt.fv(f, "malf_picker", rt.sv(f, "malfai"))), 10), 1000]))])));
	}
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.setSv(f, "operating", 0);
	if (truthy(rt.sv(f, "occupier"))) {
		yield* g.srcCall(f, "malfvacate", 1);
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "update");
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/overload_lighting  (code/modules/power/apc.dm:1168)  may sleep
rt.def("/obj/machinery/power/apc/proc/overload_lighting", function* overload_lighting(f: Frame) {
	if ((!truthy(rt.sv(f, "operating")) || truthy(rt.sv(f, "shorted")))) {
		return live(f.dot);
	}
	if (!(truthy(rt.sv(f, "cell")) && rt.ge(rt.fv(f, "charge", rt.sv(f, "cell")), 20))) return f.dot;
	yield* g.callName(f, rt.sv(f, "cell"), "use", [20]);
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/machinery/power/apc/proc/break_lights")]);
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/break_lights  (code/modules/power/apc.dm:1175)  may sleep
rt.def("/obj/machinery/power/apc/proc/break_lights", function* break_lights(f: Frame) {
	let A: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [A, L, $e];
	A = null;
	rt.forList(f, 0, rt.fv(f, "related", rt.sv(f, "area")), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		L = null;
		rt.forList(f, 1, live(A), T("/obj/machinery/light"));
		while (($e = rt.next(f, 1)) !== undefined) {
			L = $e;
			rt.setFv(f, "on", live(L), 1);
			yield* g.callName(f, live(L), "break_light_tube", []);
			rt.setFv(f, "on", live(L), 0);
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/shock  (code/modules/power/apc.dm:1183)  may sleep
rt.def("/obj/machinery/power/apc/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	f.vars = () => [user, prb];
	if (!truthy(rt.op(f, "Prob", [], [live(prb)]))) {
		return 0;
	}
	yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, live(f.src)]);
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/alien")) ? 1 : 0))) {
		return 0;
	}
	if (truthy((yield* g.call(f, P("/proc/electrocute_mob"), null, [live(user), live(f.src), live(f.src), 1, 1])))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/setsubsystem  (code/modules/power/apc.dm:1194)
rt.def("/obj/machinery/power/apc/proc/setsubsystem", function setsubsystem(f: Frame, val: Value) {
	let $0: any;
	f.vars = () => [$0];
	if ((truthy(rt.sv(f, "cell")) && rt.gt(rt.fv(f, "charge", rt.sv(f, "cell")), 0))) {
		if (isEqual(live(val), 1)) {
			$0 = 0;
		} else {
			$0 = live(val);
		}
		return $0;
	}
	if (isEqual(live(val), 3)) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /obj/machinery/power/apc/proc/energy_fail  (code/modules/power/apc.dm:1203)
rt.def("/obj/machinery/power/apc/proc/energy_fail", function energy_fail(f: Frame, duration: Value) {
	let M: Value = null, A: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [M, A, I, $e];
	M = null;
	rt.forList(f, 0, rt.fv(f, "contents", rt.sv(f, "area")), T("/obj/machinery"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.fv(f, "critical_machine", live(M)))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	A = null;
	rt.forList(f, 0, rt.gl("ai_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.call(f, P("/proc/get_area"), null, [(I = live(A))]), rt.sv(f, "area"))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "failure_timer", rt.call(f, P("/proc/max"), null, [rt.sv(f, "failure_timer"), rt.call(f, P("/proc/round"), null, [live(duration)])]));
	return f.dot;
});
