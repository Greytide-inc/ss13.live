// From code/game/objects/structures/windoor_assembly.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12897, "/obj/structure/windoor_assembly", "/obj/structure", {
	ini_dir: null,
	electronics: null,
	created_name: null,
	facing: "l",
	secure: 0,
	state: "01",
	anchored: 0,
	CanAtmosPass: -1,
	icon: rt.rsc("icons/obj/doors/windoor.dmi"),
	name: "windoor Assembly",
	icon_state: "l_windoor_assembly01",
	density: 0,
	dir: 1,
});

// /obj/structure/windoor_assembly/proc/examine  (code/game/objects/structures/windoor_assembly.dm:32)
rt.def("/obj/structure/windoor_assembly/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Alt-click to rotate it clockwise.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/windoor_assembly/proc/New  (code/game/objects/structures/windoor_assembly.dm:36)  may sleep
rt.def("/obj/structure/windoor_assembly/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "dir", live(f.args[1]));
	}
	rt.setSv(f, "ini_dir", rt.sv(f, "dir"));
	yield* g.srcCall(f, "air_update_turf", 1);
	return f.dot;
}, true, { args: ["loc", "set_dir"] });

// /obj/structure/windoor_assembly/proc/Destroy  (code/game/objects/structures/windoor_assembly.dm:44)  may sleep
rt.def("/obj/structure/windoor_assembly/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "density", 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/windoor_assembly/proc/Move  (code/game/objects/structures/windoor_assembly.dm:48)  may sleep
rt.def("/obj/structure/windoor_assembly/proc/Move", function* Move(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.sv(f, "loc");
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "setDir", rt.sv(f, "ini_dir"));
	yield* g.srcCall(f, "move_update_air", live(_T));
	return f.dot;
}, true);

// /obj/structure/windoor_assembly/proc/update_icon  (code/game/objects/structures/windoor_assembly.dm:54)
rt.def("/obj/structure/windoor_assembly/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = rt.sv(f, "facing");
	if (truthy(rt.sv(f, "secure"))) {
		$1 = "secure_";
	} else {
		$1 = "";
	}
	rt.setSv(f, "icon_state", fmt("＀_＀windoor_assembly＀", [$0, $1, rt.sv(f, "state")]));
	return f.dot;
});

// /obj/structure/windoor_assembly/proc/CanPass  (code/game/objects/structures/windoor_assembly.dm:57)
rt.def("/obj/structure/windoor_assembly/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let W: Value = null;
	f.vars = () => [height, W];
	if (live(height) === null) {
		height = 0;
	}
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [2])))) {
		return 1;
	}
	if (isEqual(rt.getDir(f, rt.sv(f, "loc"), live(target)), rt.sv(f, "dir"))) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	if (truthy((rt.istype(live(mover), T("/obj/structure/window")) ? 1 : 0))) {
		W = live(mover);
		if (!truthy(rt.call(f, P("/proc/valid_window_location"), null, [rt.sv(f, "loc"), rt.fv(f, "ini_dir", live(W))]))) {
			return 0;
		}
	} else {
		if (truthy((rt.istype(live(mover), T("/obj/structure/windoor_assembly")) ? 1 : 0))) {
			W = live(mover);
			if (!truthy(rt.call(f, P("/proc/valid_window_location"), null, [rt.sv(f, "loc"), rt.fv(f, "ini_dir", live(W))]))) {
				return 0;
			}
		} else {
			if ((truthy((rt.istype(live(mover), T("/obj/machinery/door/window")) ? 1 : 0)) && !truthy(rt.call(f, P("/proc/valid_window_location"), null, [rt.sv(f, "loc"), rt.fv(f, "dir", live(mover))])))) {
				return 0;
			}
		}
	}
	return 1;
});

// /obj/structure/windoor_assembly/proc/CanAtmosPass  (code/game/objects/structures/windoor_assembly.dm:74)
rt.def("/obj/structure/windoor_assembly/proc/CanAtmosPass", function CanAtmosPass(f: Frame, _T: Value) {
	if (isEqual(rt.getDir(f, rt.sv(f, "loc"), live(_T)), rt.sv(f, "dir"))) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	return 1;
});

// /obj/structure/windoor_assembly/proc/CheckExit  (code/game/objects/structures/windoor_assembly.dm:80)
rt.def("/obj/structure/windoor_assembly/proc/CheckExit", function CheckExit(f: Frame, mover: Value, target: Value) {
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [2])))) {
		return 1;
	}
	if (isEqual(rt.getDir(f, rt.sv(f, "loc"), live(target)), rt.sv(f, "dir"))) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	return 1;
});

// /obj/structure/windoor_assembly/proc/attackby  (code/game/objects/structures/windoor_assembly.dm:90)  may sleep
rt.def("/obj/structure/windoor_assembly/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, RG: Value = null, R: Value = null, WD: Value = null, _P: Value = null, CC: Value = null, ae: Value = null, t: Value = null, windoor: Value = null;
	let $0: any, $e: any;
	f.vars = () => [WT, RG, R, WD, _P, CC, ae, t, windoor, $0, $e];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	$0 = rt.sv(f, "state");
	if ($0 === "01") {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && !truthy(rt.sv(f, "anchored")))) {
			if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ disassembles the windoor assembly.", [live(f.args[1])]), "<span class='notice'>You start to disassemble the windoor assembly...</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if ((!truthy(live(f.src)) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You disassemble the windoor assembly.</span>"]);
					yield* g.callName(f, (RG = (yield* g.new_(f, T("/obj/item/stack/sheet/rglass"), [rt.getStep(f, live(f.src), 0), 5]))), "add_fingerprint", [live(f.args[1])]);
					if (truthy(rt.sv(f, "secure"))) {
						yield* g.callName(f, (R = (yield* g.new_(f, T("/obj/item/stack/rods"), [rt.getStep(f, live(f.src), 0), 4]))), "add_fingerprint", [live(f.args[1])]);
					}
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				}
			} else {
				return live(f.dot);
			}
		}
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.sv(f, "anchored")))) {
			WD = null;
			rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/machinery/door/window"));
			while (($e = rt.next(f, 0)) !== undefined) {
				WD = $e;
				if (isEqual(rt.fv(f, "dir", live(WD)), rt.sv(f, "dir"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a windoor in that location!</span>"]);
					return live(f.dot);
				}
			}
			rt.endFor(f, 0);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ secures the windoor assembly to the floor.", [live(f.args[1])]), "<span class='notice'>You start to secure the windoor assembly to the floor...</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if ((!truthy(live(f.src)) || truthy(rt.sv(f, "anchored")))) {
					return live(f.dot);
				}
				WD = null;
				rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/machinery/door/window"));
				while (($e = rt.next(f, 0)) !== undefined) {
					WD = $e;
					if (isEqual(rt.fv(f, "dir", live(WD)), rt.sv(f, "dir"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a windoor in that location!</span>"]);
						return live(f.dot);
					}
				}
				rt.endFor(f, 0);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You secure the windoor assembly.</span>"]);
				rt.setSv(f, "anchored", 1);
				if (truthy(rt.sv(f, "secure"))) {
					rt.setSv(f, "name", "secure anchored windoor assembly");
				} else {
					rt.setSv(f, "name", "anchored windoor assembly");
				}
			}
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && truthy(rt.sv(f, "anchored")))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ unsecures the windoor assembly to the floor.", [live(f.args[1])]), "<span class='notice'>You start to unsecure the windoor assembly to the floor...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if ((!truthy(live(f.src)) || !truthy(rt.sv(f, "anchored")))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unsecure the windoor assembly.</span>"]);
					rt.setSv(f, "anchored", 0);
					if (truthy(rt.sv(f, "secure"))) {
						rt.setSv(f, "name", "secure windoor assembly");
					} else {
						rt.setSv(f, "name", "windoor assembly");
					}
				}
			} else {
				if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/plasteel")) ? 1 : 0)) && !truthy(rt.sv(f, "secure")))) {
					if (rt.lt((yield* g.callName(f, (_P = live(f.args[0])), "get_amount", [])), 2)) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more plasteel to do this!</span>"]);
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start to reinforce the windoor with plasteel...</span>"]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 40, "target", live(f.src)], rt.Args.Named)))) {
						if (((!truthy(live(f.src)) || truthy(rt.sv(f, "secure"))) || rt.lt((yield* g.callName(f, live(_P), "get_amount", [])), 2))) {
							return live(f.dot);
						}
						yield* g.callName(f, live(_P), "use", [2]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You reinforce the windoor.</span>"]);
						rt.setSv(f, "secure", 1);
						if (truthy(rt.sv(f, "anchored"))) {
							rt.setSv(f, "name", "secure anchored windoor assembly");
						} else {
							rt.setSv(f, "name", "secure windoor assembly");
						}
					}
				} else {
					if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0)) && truthy(rt.sv(f, "anchored")))) {
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ wires the windoor assembly.", [live(f.args[1])]), "<span class='notice'>You start to wire the windoor assembly...</span>"]);
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 40, "target", live(f.src)], rt.Args.Named)))) {
							if (((!truthy(live(f.src)) || !truthy(rt.sv(f, "anchored"))) || !isEqual(rt.fv(f, "state", live(f.src)), "01"))) {
								return live(f.dot);
							}
							if (!truthy((yield* g.callName(f, (CC = live(f.args[0])), "use", [1])))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more cable to do this!</span>"]);
								return live(f.dot);
							}
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You wire the windoor.</span>"]);
							rt.setSv(f, "state", "02");
							if (truthy(rt.sv(f, "secure"))) {
								rt.setSv(f, "name", "secure wired windoor assembly");
							} else {
								rt.setSv(f, "name", "wired windoor assembly");
							}
						}
					} else {
						return (yield* g.callSuper(f, [], rt.Args.Same));
					}
				}
			}
		}
	} else if ($0 === "02") {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ cuts the wires from the airlock assembly.", [live(f.args[1])]), "<span class='notice'>You start to cut the wires from airlock assembly...</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if ((!truthy(live(f.src)) || !isEqual(rt.sv(f, "state"), "02"))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You cut the windoor wires.</span>"]);
				yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, live(f.args[1]), 0), 1]);
				rt.setSv(f, "state", "01");
				if (truthy(rt.sv(f, "secure"))) {
					rt.setSv(f, "name", "secure anchored windoor assembly");
				} else {
					rt.setSv(f, "name", "anchored windoor assembly");
				}
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/electronics/airlock")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ installs the electronics into the airlock assembly.", [live(f.args[1])]), "<span class='notice'>You start to install electronics into the airlock assembly...</span>"]);
				rt.setFv(f, "loc", live(f.args[0]), live(f.src));
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 40, "target", live(f.src)], rt.Args.Named)))) {
					if ((!truthy(live(f.src)) || truthy(rt.sv(f, "electronics")))) {
						rt.setFv(f, "loc", live(f.args[0]), rt.fv(f, "loc", live(f.src)));
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You install the airlock electronics.</span>"]);
					rt.setSv(f, "name", "near finished windoor assembly");
					rt.setSv(f, "electronics", live(f.args[0]));
				} else {
					rt.setFv(f, "loc", live(f.args[0]), rt.sv(f, "loc"));
				}
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
					if (!truthy(rt.sv(f, "electronics"))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ removes the electronics from the airlock assembly.", [live(f.args[1])]), "<span class='notice'>You start to uninstall electronics from the airlock assembly...</span>"]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
						if ((!truthy(live(f.src)) || !truthy(rt.sv(f, "electronics")))) {
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the airlock electronics.</span>"]);
						rt.setSv(f, "name", "wired windoor assembly");
						ae = null;
						ae = rt.sv(f, "electronics");
						rt.setSv(f, "electronics", null);
						rt.setFv(f, "loc", live(ae), rt.sv(f, "loc"));
					}
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
						if (!truthy((t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Enter the name for the door.", rt.sv(f, "name"), rt.sv(f, "created_name"), 42]))))) {
							return live(f.dot);
						}
						if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.sv(f, "loc"), live(f.usr)))) {
							return live(f.dot);
						}
						rt.setSv(f, "created_name", live(t));
						return live(f.dot);
					} else {
						if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
							if (!truthy(rt.sv(f, "electronics"))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>The assembly is missing electronics!</span>"]);
								return live(f.dot);
							}
							rt.op(f, "Browse", [], [live(f.usr), null, "window=windoor_access"], false);
							yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
							yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ pries the windoor into the frame.", [live(f.args[1])]), "<span class='notice'>You start prying the windoor into the frame...</span>"]);
							if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
								if ((truthy(rt.sv(f, "loc")) && truthy(rt.sv(f, "electronics")))) {
									rt.setSv(f, "density", 1);
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You finish the windoor.</span>"]);
									if (truthy(rt.sv(f, "secure"))) {
										windoor = (yield* g.new_(f, T("/obj/machinery/door/window/brigdoor"), [rt.sv(f, "loc")]));
										if (isEqual(rt.sv(f, "facing"), "l")) {
											rt.setFv(f, "icon_state", live(windoor), "leftsecureopen");
											rt.setFv(f, "base_state", live(windoor), "leftsecure");
										} else {
											rt.setFv(f, "icon_state", live(windoor), "rightsecureopen");
											rt.setFv(f, "base_state", live(windoor), "rightsecure");
										}
										yield* g.callName(f, live(windoor), "setDir", [rt.sv(f, "dir")]);
										rt.setFv(f, "density", live(windoor), 0);
										if (truthy(rt.fv(f, "one_access", rt.sv(f, "electronics")))) {
											rt.setFv(f, "req_one_access", live(windoor), rt.fv(f, "accesses", rt.sv(f, "electronics")));
										} else {
											rt.setFv(f, "req_access", live(windoor), rt.fv(f, "accesses", rt.sv(f, "electronics")));
										}
										rt.setFv(f, "electronics", live(windoor), rt.sv(f, "electronics"));
										rt.setFv(f, "loc", rt.sv(f, "electronics"), live(windoor));
										if (truthy(rt.sv(f, "created_name"))) {
											rt.setFv(f, "name", live(windoor), rt.sv(f, "created_name"));
										}
										yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
										yield* g.callName(f, live(windoor), "close", []);
									} else {
										windoor = (yield* g.new_(f, T("/obj/machinery/door/window"), [rt.sv(f, "loc")]));
										if (isEqual(rt.sv(f, "facing"), "l")) {
											rt.setFv(f, "icon_state", live(windoor), "leftopen");
											rt.setFv(f, "base_state", live(windoor), "left");
										} else {
											rt.setFv(f, "icon_state", live(windoor), "rightopen");
											rt.setFv(f, "base_state", live(windoor), "right");
										}
										yield* g.callName(f, live(windoor), "setDir", [rt.sv(f, "dir")]);
										rt.setFv(f, "density", live(windoor), 0);
										rt.setFv(f, "req_access", live(windoor), rt.fv(f, "accesses", rt.sv(f, "electronics")));
										rt.setFv(f, "electronics", live(windoor), rt.sv(f, "electronics"));
										rt.setFv(f, "loc", rt.sv(f, "electronics"), live(windoor));
										if (truthy(rt.sv(f, "created_name"))) {
											rt.setFv(f, "name", live(windoor), rt.sv(f, "created_name"));
										}
										yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
										yield* g.callName(f, live(windoor), "close", []);
									}
								}
							}
						} else {
							return (yield* g.callSuper(f, [], rt.Args.Same));
						}
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/windoor_assembly/verb/revrotate  (code/game/objects/structures/windoor_assembly.dm:326)
rt.def("/obj/structure/windoor_assembly/verb/revrotate", function revrotate(f: Frame) {
	let target_dir: Value = null;
	f.vars = () => [target_dir];
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "anchored"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ cannot be rotated while it is fastened to the floor!</span>", [live(f.src)])]);
		return 0;
	}
	target_dir = rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 270]);
	if (!truthy(rt.call(f, P("/proc/valid_window_location"), null, [rt.sv(f, "loc"), live(target_dir)]))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ cannot be rotated in that direction!</span>", [live(f.src)])]);
		return 0;
	}
	rt.callSrc(f, "setDir", [live(target_dir)]);
	rt.setSv(f, "ini_dir", rt.sv(f, "dir"));
	rt.callSrc(f, "update_icon", []);
	return 1;
}, false, { verb: { name: "Rotate Windoor Assembly", category: "Object", src: 3, range: 1 } });

// /obj/structure/windoor_assembly/proc/AltClick  (code/game/objects/structures/windoor_assembly.dm:345)  may sleep
rt.def("/obj/structure/windoor_assembly/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 1)) {
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "revrotate");
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/windoor_assembly/verb/flip  (code/game/objects/structures/windoor_assembly.dm:359)
rt.def("/obj/structure/windoor_assembly/verb/flip", function flip(f: Frame) {
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "facing"), "l")) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>The windoor will now slide to the right.</span>"]);
		rt.setSv(f, "facing", "r");
	} else {
		rt.setSv(f, "facing", "l");
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>The windoor will now slide to the left.</span>"]);
	}
	rt.callSrc(f, "update_icon", []);
	return live(f.dot);
}, false, { verb: { name: "Flip Windoor Assembly", category: "Object", src: 3, range: 1 } });
