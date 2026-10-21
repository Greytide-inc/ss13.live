// From code/modules/admin/verbs/buildmode.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11201, "/obj/screen/buildmode", "/obj/screen", {
	bd: null,
	icon: rt.rsc("icons/misc/buildmode.dmi"),
});

// /obj/screen/buildmode/proc/New  (code/modules/admin/verbs/buildmode.dm:17)  may sleep
rt.def("/obj/screen/buildmode/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "bd", live(f.src), live(f.args[0]));
	return f.dot;
}, true, { args: ["bd"] });

rt.type(11202, "/obj/screen/buildmode/mode", "/obj/screen/buildmode", {
	icon_state: "buildmode1",
	name: "Toggle Mode",
	screen_loc: "NORTH,WEST",
});

// /obj/screen/buildmode/mode/proc/Click  (code/modules/admin/verbs/buildmode.dm:26)  may sleep
rt.def("/obj/screen/buildmode/mode/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let pa: Value = null;
	f.vars = () => [location, control, params, pa];
	if (truthy((yield* g.callName(f, (pa = (yield* g.call(f, P("/proc/params2list"), null, [live(params)]))), "Find", ["left"])))) {
		yield* g.callName(f, rt.sv(f, "bd"), "toggle_modes", []);
	} else {
		if (truthy((yield* g.callName(f, live(pa), "Find", ["right"])))) {
			yield* g.callName(f, rt.sv(f, "bd"), "change_settings", [live(f.usr)]);
		}
	}
	yield* g.srcCall(f, "update_icon");
	return 1;
}, true);

// /obj/screen/buildmode/mode/proc/update_icon  (code/modules/admin/verbs/buildmode.dm:36)
rt.def("/obj/screen/buildmode/mode/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("buildmode＀", [rt.fv(f, "mode", rt.sv(f, "bd"))]));
	return live(f.dot);
});

rt.type(11203, "/obj/screen/buildmode/help", "/obj/screen/buildmode", {
	icon_state: "buildhelp",
	screen_loc: "NORTH,WEST+1",
	name: "Buildmode Help",
});

// /obj/screen/buildmode/help/proc/Click  (code/modules/admin/verbs/buildmode.dm:45)
rt.def("/obj/screen/buildmode/help/proc/Click", function Click(f: Frame) {
	rt.callName(f, rt.sv(f, "bd"), "show_help", [live(f.usr)]);
	return 1;
});

rt.type(11204, "/obj/screen/buildmode/bdir", "/obj/screen/buildmode", {
	icon_state: "build",
	screen_loc: "NORTH,WEST+2",
	name: "Change Dir",
});

// /obj/screen/buildmode/bdir/proc/update_icon  (code/modules/admin/verbs/buildmode.dm:55)
rt.def("/obj/screen/buildmode/bdir/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "setDir", [rt.fv(f, "build_dir", rt.sv(f, "bd"))]);
	return live(f.dot);
});

rt.type(11205, "/obj/screen/buildmode/quit", "/obj/screen/buildmode", {
	icon_state: "buildquit",
	screen_loc: "NORTH,WEST+3",
	name: "Quit Buildmode",
});

// /obj/screen/buildmode/quit/proc/Click  (code/modules/admin/verbs/buildmode.dm:64)  may sleep
rt.def("/obj/screen/buildmode/quit/proc/Click", function* Click(f: Frame) {
	yield* g.callName(f, rt.sv(f, "bd"), "quit", []);
	return 1;
}, true);

// /obj/screen/buildmode/bdir/proc/Click  (code/modules/admin/verbs/buildmode.dm:68)
rt.def("/obj/screen/buildmode/bdir/proc/Click", function Click(f: Frame) {
	rt.callName(f, rt.sv(f, "bd"), "change_dir", []);
	rt.callSrc(f, "update_icon", []);
	return 1;
});

rt.type(1841, "/datum/buildmode", "/datum", {
	mode: 1,
	holder: null,
	buttons: null,
	build_dir: 2,
	throw_atom: null,
	cornerA: null,
	cornerB: null,
	generator_path: null,
	varholder: "name",
	valueholder: "derp",
	stored: null,
	objholder: rt.typePath("/obj/structure/closet"),
});

// /datum/buildmode/proc/<init>  (code/modules/admin/verbs/buildmode.dm:75)
rt.def("/datum/buildmode/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "buttons", rt.list());
	return f.dot;
});

// /datum/buildmode/proc/New  (code/modules/admin/verbs/buildmode.dm:87)  may sleep
rt.def("/datum/buildmode/proc/New", function* New(f: Frame, c: Value) {
	f.vars = () => [c];
	yield* g.srcCall(f, "create_buttons");
	rt.setSv(f, "holder", live(c));
	rt.setFv(f, "click_intercept", rt.sv(f, "holder"), live(f.src));
	rt.setFv(f, "show_popup_menus", rt.sv(f, "holder"), 0);
	rt.modField(f, rt.sv(f, "holder"), "screen", rt.sv(f, "buttons"), add);
	return f.dot;
}, true);

// /datum/buildmode/proc/quit  (code/modules/admin/verbs/buildmode.dm:94)  may sleep
rt.def("/datum/buildmode/proc/quit", function* quit(f: Frame) {
	(rt.modField(f, rt.sv(f, "holder"), "screen", rt.sv(f, "buttons"), subtract));
	rt.setFv(f, "click_intercept", rt.sv(f, "holder"), null);
	rt.setFv(f, "show_popup_menus", rt.sv(f, "holder"), 1);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

// /datum/buildmode/proc/Destroy  (code/modules/admin/verbs/buildmode.dm:102)  may sleep
rt.def("/datum/buildmode/proc/Destroy", function* Destroy(f: Frame) {
	let button: Value = null;
	let $e: any;
	f.vars = () => [button, $e];
	rt.setSv(f, "stored", null);
	button = null;
	rt.forList(f, 0, rt.sv(f, "buttons"));
	while (($e = rt.next(f, 0)) !== undefined) {
		button = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(button)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/buildmode/proc/create_buttons  (code/modules/admin/verbs/buildmode.dm:106)  may sleep
rt.def("/datum/buildmode/proc/create_buttons", function* create_buttons(f: Frame) {
	rt.modSrcVar(f, "buttons", (yield* g.new_(f, T("/obj/screen/buildmode/mode"), [live(f.src)])), add);
	rt.modSrcVar(f, "buttons", (yield* g.new_(f, T("/obj/screen/buildmode/help"), [live(f.src)])), add);
	rt.modSrcVar(f, "buttons", (yield* g.new_(f, T("/obj/screen/buildmode/bdir"), [live(f.src)])), add);
	rt.modSrcVar(f, "buttons", (yield* g.new_(f, T("/obj/screen/buildmode/quit"), [live(f.src)])), add);
	return f.dot;
}, true);

// /datum/buildmode/proc/toggle_modes  (code/modules/admin/verbs/buildmode.dm:112)
rt.def("/datum/buildmode/proc/toggle_modes", function toggle_modes(f: Frame) {
	rt.setSv(f, "mode", add(rt.modulus(rt.sv(f, "mode"), 6), 1));
	rt.callSrc(f, "Reset", []);
	return live(f.dot);
});

// /datum/buildmode/proc/show_help  (code/modules/admin/verbs/buildmode.dm:117)
rt.def("/datum/buildmode/proc/show_help", function show_help(f: Frame, user: Value) {
	let dat: Value = null;
	let $0: any;
	f.vars = () => [dat, $0];
	dat = rt.list();
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		dat = rt.modify(live(dat), "***********************************************************", add);
		dat = rt.modify(live(dat), "Left Mouse Button        = Construct / Upgrade", add);
		dat = rt.modify(live(dat), "Right Mouse Button       = Deconstruct / Delete / Downgrade", add);
		dat = rt.modify(live(dat), "Left Mouse Button + ctrl = R-Window", add);
		dat = rt.modify(live(dat), "Left Mouse Button + alt  = Airlock", add);
		dat = rt.modify(live(dat), "", add);
		dat = rt.modify(live(dat), "Use the button in the upper left corner to", add);
		dat = rt.modify(live(dat), "change the direction of built objects.", add);
		dat = rt.modify(live(dat), "***********************************************************", add);
	} else if ($0 === 2) {
		dat = rt.modify(live(dat), "***********************************************************", add);
		dat = rt.modify(live(dat), "Right Mouse Button on buildmode button = Set object type", add);
		dat = rt.modify(live(dat), "Left Mouse Button on turf/obj          = Place objects", add);
		dat = rt.modify(live(dat), "Right Mouse Button                     = Delete objects", add);
		dat = rt.modify(live(dat), "", add);
		dat = rt.modify(live(dat), "Use the button in the upper left corner to", add);
		dat = rt.modify(live(dat), "change the direction of built objects.", add);
		dat = rt.modify(live(dat), "***********************************************************", add);
	} else if ($0 === 3) {
		dat = rt.modify(live(dat), "***********************************************************", add);
		dat = rt.modify(live(dat), "Right Mouse Button on buildmode button = Select var(type) & value", add);
		dat = rt.modify(live(dat), "Left Mouse Button on turf/obj/mob      = Set var(type) & value", add);
		dat = rt.modify(live(dat), "Right Mouse Button on turf/obj/mob     = Reset var's value", add);
		dat = rt.modify(live(dat), "***********************************************************", add);
	} else if ($0 === 4) {
		dat = rt.modify(live(dat), "***********************************************************", add);
		dat = rt.modify(live(dat), "Left Mouse Button on turf/obj/mob      = Select", add);
		dat = rt.modify(live(dat), "Right Mouse Button on turf/obj/mob     = Throw", add);
		dat = rt.modify(live(dat), "***********************************************************", add);
	} else if ($0 === 5) {
		dat = rt.modify(live(dat), "***********************************************************", add);
		dat = rt.modify(live(dat), "Left Mouse Button on turf/obj/mob      = Select corner", add);
		dat = rt.modify(live(dat), "Right Mouse Button on buildmode button = Select generator", add);
		dat = rt.modify(live(dat), "***********************************************************", add);
	} else if ($0 === 6) {
		dat = rt.modify(live(dat), "***********************************************************", add);
		dat = rt.modify(live(dat), "Left Mouse Button on obj/turf/mob   = Spawn a Copy of selected target", add);
		dat = rt.modify(live(dat), "Right Mouse Button on obj/mob = Select target to copy", add);
		dat = rt.modify(live(dat), "***********************************************************", add);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<font color='blue'>＀</font>", [rt.callName(f, live(dat), "Join", ["\n"])])]);
	return f.dot;
});

// /datum/buildmode/proc/change_settings  (code/modules/admin/verbs/buildmode.dm:162)  may sleep
rt.def("/datum/buildmode/proc/change_settings", function* change_settings(f: Frame, user: Value) {
	let target_path: Value = null, locked: Value = null, thetype: Value = null, gen_paths: Value = null, type: Value = null;
	let $0: any;
	f.vars = () => [user, target_path, locked, thetype, gen_paths, type, $0];
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		return 1;
	} else if ($0 === 2) {
		rt.setSv(f, "objholder", (yield* g.call(f, P("/proc/text2path"), null, [(target_path = (yield* g.op(f, "Prompt", [2], ["/obj/structure/closet", "Typepath", "Enter typepath:", live(user), null])))])));
		if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "objholder")])))) {
			rt.setSv(f, "objholder", (yield* g.call(f, P("/proc/pick_closest_path"), null, [live(target_path)])));
			if (!truthy(rt.sv(f, "objholder"))) {
				rt.setSv(f, "objholder", T("/obj/structure/closet"));
				yield* g.call(f, P("/proc/alert"), null, ["That path is not allowed."]);
			}
		} else {
			if ((truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "objholder"), T("/mob")]))) && !truthy((yield* g.call(f, P("/proc/check_rights"), null, [32, 0]))))) {
				rt.setSv(f, "objholder", T("/obj/structure/closet"));
			}
		}
	} else if ($0 === 3) {
		locked = rt.list("vars", "key", "ckey", "client", "firemut", "ishulk", "telekinesis", "xray", "virus", "viruses", "cuffed", "ka", "last_eaten", "urine");
		rt.setSv(f, "varholder", (yield* g.op(f, "Prompt", [2], ["name", "Name", "Enter variable name:", live(user), null])));
		if (truthy((rt.isIn(f, rt.sv(f, "varholder"), (live(locked) && (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [32, 0]))) ? 1 : 0))) ? 1 : 0))) {
			return 1;
		}
		if (!truthy((thetype = (yield* g.op(f, "Prompt", [0], [null, "Type", "Select variable type:", live(user), rt.list("text", "number", "mob-reference", "obj-reference", "turf-reference")]))))) {
			return 1;
		}
		$0 = live(thetype);
		if ($0 === "text") {
			rt.setSv(f, "valueholder", (yield* g.op(f, "Prompt", [2], ["value", "Value", "Enter variable value:", live(user), null])));
		} else if ($0 === "number") {
			rt.setSv(f, "valueholder", (yield* g.op(f, "Prompt", [32], [123, "Value", "Enter variable value:", live(user), null])));
		} else if ($0 === "mob-reference") {
			rt.setSv(f, "valueholder", (yield* g.op(f, "Prompt", [8], [null, "Value", "Enter variable value:", live(user), rt.gl("mob_list")])));
		} else if ($0 === "obj-reference") {
			rt.setSv(f, "valueholder", (yield* g.op(f, "Prompt", [4], [null, "Value", "Enter variable value:", live(user), rt.world()])));
		} else if ($0 === "turf-reference") {
			rt.setSv(f, "valueholder", (yield* g.op(f, "Prompt", [16], [null, "Value", "Enter variable value:", live(user), rt.world()])));
		}
	} else if ($0 === 5) {
		gen_paths = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/mapGenerator")])), T("/datum/mapGenerator"));
		if (!truthy((type = (yield* g.op(f, "Prompt", [1], [null, "Type", "Select Generator Type", live(user), live(gen_paths)]))))) {
			return live(f.dot);
		}
		rt.setSv(f, "generator_path", live(type));
		rt.setSv(f, "cornerA", null);
		rt.setSv(f, "cornerB", null);
	}
	return f.dot;
}, true);

// /datum/buildmode/proc/change_dir  (code/modules/admin/verbs/buildmode.dm:206)
rt.def("/datum/buildmode/proc/change_dir", function change_dir(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "build_dir");
	if ($0 === 1) {
		rt.setSv(f, "build_dir", 4);
	} else if ($0 === 4) {
		rt.setSv(f, "build_dir", 2);
	} else if ($0 === 2) {
		rt.setSv(f, "build_dir", 8);
	} else if ($0 === 8) {
		rt.setSv(f, "build_dir", 9);
	} else if ($0 === 9) {
		rt.setSv(f, "build_dir", 1);
	}
	return 1;
});

// /datum/buildmode/proc/Reset  (code/modules/admin/verbs/buildmode.dm:221)
rt.def("/datum/buildmode/proc/Reset", function Reset(f: Frame) {
	rt.setSv(f, "cornerA", null);
	rt.setSv(f, "cornerB", null);
	return f.dot;
});

// /proc/togglebuildmode  (code/modules/admin/verbs/buildmode.dm:226)  may sleep
rt.def("/proc/togglebuildmode", function* togglebuildmode(f: Frame, M: Value) {
	let B: Value = null;
	f.vars = () => [M, B];
	if (!truthy(rt.fv(f, "client", live(M)))) return f.dot;
	if (truthy((rt.istype(rt.gv(f, "click_intercept", rt.fv(f, "client", live(M))), T("/datum/buildmode")) ? 1 : 0))) {
		yield* g.callName(f, (B = rt.gv(f, "click_intercept", rt.fv(f, "client", live(M)))), "quit", []);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has left build mode.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	} else {
		yield* g.new_(f, T("/datum/buildmode"), [rt.fv(f, "client", live(M))]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has entered build mode.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has entered build mode.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	}
	return f.dot;
}, true, { verb: { name: "Toggle Build Mode", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /datum/buildmode/proc/InterceptClickOn  (code/modules/admin/verbs/buildmode.dm:238)  may sleep
rt.def("/datum/buildmode/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, user: Value, params: Value, object: Value) {
	let pa: Value = null, right_click: Value = null, left_click: Value = null, alt_click: Value = null, ctrl_click: Value = null, _T: Value = null, WIN: Value = null, A: Value = null, G: Value = null;
	let $0: any;
	f.vars = () => [user, params, object, pa, right_click, left_click, alt_click, ctrl_click, _T, WIN, A, G, $0];
	pa = (yield* g.call(f, P("/proc/params2list"), null, [live(params)]));
	right_click = (yield* g.callName(f, live(pa), "Find", ["right"]));
	left_click = (yield* g.callName(f, live(pa), "Find", ["left"]));
	alt_click = (yield* g.callName(f, live(pa), "Find", ["alt"]));
	ctrl_click = (yield* g.callName(f, live(pa), "Find", ["ctrl"]));
	f.dot = 1;
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		if ((((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(object)]))) && truthy(live(left_click))) && !truthy(live(alt_click))) && !truthy(live(ctrl_click)))) {
			_T = live(object);
			if (truthy((rt.istype(live(object), T("/turf/open/space")) ? 1 : 0))) {
				yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/open/floor/plasteel")]);
			} else {
				if (truthy((rt.istype(live(object), T("/turf/open/floor")) ? 1 : 0))) {
					yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/closed/wall")]);
				} else {
					if (truthy((rt.istype(live(object), T("/turf/closed/wall")) ? 1 : 0))) {
						yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/closed/wall/r_wall")]);
					}
				}
			}
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("Build Mode: ＀ built ＀ at (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(_T), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
			return live(f.dot);
		} else {
			if (truthy(live(right_click))) {
				yield* g.call(f, P("/proc/log_admin"), null, [fmt("Build Mode: ＀ deleted ＀ at (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(object), rt.fv(f, "x", live(object)), rt.fv(f, "y", live(object)), rt.fv(f, "z", live(object))])]);
				if (truthy((rt.istype(live(object), T("/turf/closed/wall")) ? 1 : 0))) {
					yield* g.callName(f, (_T = live(object)), "ChangeTurf", [T("/turf/open/floor/plasteel")]);
				} else {
					if (truthy((rt.istype(live(object), T("/turf/open/floor")) ? 1 : 0))) {
						yield* g.callName(f, (_T = live(object)), "ChangeTurf", [T("/turf/open/space")]);
					} else {
						if (truthy((rt.istype(live(object), T("/turf/closed/wall/r_wall")) ? 1 : 0))) {
							yield* g.callName(f, (_T = live(object)), "ChangeTurf", [T("/turf/closed/wall")]);
						} else {
							if (truthy((rt.istype(live(object), T("/obj")) ? 1 : 0))) {
								yield* g.call(f, P("/proc/qdel"), null, [live(object)]);
							}
						}
					}
				}
				return live(f.dot);
			} else {
				if (((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(object)]))) && truthy(live(alt_click))) && truthy(live(left_click)))) {
					yield* g.call(f, P("/proc/log_admin"), null, [fmt("Build Mode: ＀ built an airlock at (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.fv(f, "x", live(object)), rt.fv(f, "y", live(object)), rt.fv(f, "z", live(object))])]);
					yield* g.new_(f, T("/obj/machinery/door/airlock"), [rt.getStep(f, live(object), 0)]);
				} else {
					if (((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(object)]))) && truthy(live(ctrl_click))) && truthy(live(left_click)))) {
						$0 = rt.sv(f, "build_dir");
						if ($0 === 1) {
							yield* g.callName(f, (WIN = (yield* g.new_(f, T("/obj/structure/window/reinforced"), [rt.getStep(f, live(object), 0)]))), "setDir", [1]);
						} else if ($0 === 2) {
							yield* g.callName(f, (WIN = (yield* g.new_(f, T("/obj/structure/window/reinforced"), [rt.getStep(f, live(object), 0)]))), "setDir", [2]);
						} else if ($0 === 4) {
							yield* g.callName(f, (WIN = (yield* g.new_(f, T("/obj/structure/window/reinforced"), [rt.getStep(f, live(object), 0)]))), "setDir", [4]);
						} else if ($0 === 8) {
							yield* g.callName(f, (WIN = (yield* g.new_(f, T("/obj/structure/window/reinforced"), [rt.getStep(f, live(object), 0)]))), "setDir", [8]);
						} else if ($0 === 9) {
							yield* g.callName(f, (WIN = (yield* g.new_(f, T("/obj/structure/window/reinforced/fulltile"), [rt.getStep(f, live(object), 0)]))), "setDir", [9]);
						}
						yield* g.call(f, P("/proc/log_admin"), null, [fmt("Build Mode: ＀ built a window at (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.fv(f, "x", live(object)), rt.fv(f, "y", live(object)), rt.fv(f, "z", live(object))])]);
					}
				}
			}
		}
	} else if ($0 === 2) {
		if (truthy(live(left_click))) {
			if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "objholder"), T("/turf")])))) {
				_T = rt.getStep(f, live(object), 0);
				yield* g.call(f, P("/proc/log_admin"), null, [fmt("Build Mode: ＀ modified ＀ (＀,＀,＀) to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(_T), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T)), rt.sv(f, "objholder")])]);
				yield* g.callName(f, live(_T), "ChangeTurf", [rt.sv(f, "objholder")]);
			} else {
				yield* g.callName(f, (A = (yield* g.new_(f, rt.sv(f, "objholder"), [rt.getStep(f, live(object), 0)]))), "setDir", [rt.sv(f, "build_dir")]);
				yield* g.call(f, P("/proc/log_admin"), null, [fmt("Build Mode: ＀ modified ＀'s (＀,＀,＀) dir to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(A), rt.fv(f, "x", live(A)), rt.fv(f, "y", live(A)), rt.fv(f, "z", live(A)), rt.sv(f, "build_dir")])]);
			}
		} else {
			if (truthy(live(right_click))) {
				if (truthy((rt.istype(live(object), T("/obj")) ? 1 : 0))) {
					yield* g.call(f, P("/proc/log_admin"), null, [fmt("Build Mode: ＀ deleted ＀ at (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(object), rt.fv(f, "x", live(object)), rt.fv(f, "y", live(object)), rt.fv(f, "z", live(object))])]);
					yield* g.call(f, P("/proc/qdel"), null, [live(object)]);
				}
			}
		}
	} else if ($0 === 3) {
		if (truthy(live(left_click))) {
			if (truthy((yield* g.callName(f, rt.fv(f, "vars", live(object)), "Find", [rt.sv(f, "varholder")])))) {
				if (truthy((yield* g.callName(f, live(object), "vv_edit_var", [rt.sv(f, "varholder"), rt.sv(f, "valueholder")])))) {
					yield* g.call(f, P("/proc/log_admin"), null, [fmt("Build Mode: ＀ modified ＀'s ＀ to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.fv(f, "name", live(object)), rt.sv(f, "varholder"), rt.sv(f, "valueholder")])]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Varedit rejected</span>"]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ does not have a var called '＀'</span>", [rt.initial(f, live(object), "name"), rt.sv(f, "varholder")])]);
			}
		}
		if (truthy(live(right_click))) {
			if (truthy((yield* g.callName(f, rt.fv(f, "vars", live(object)), "Find", [rt.sv(f, "varholder")])))) {
				if (truthy((yield* g.callName(f, live(object), "vv_edit_var", [rt.sv(f, "varholder"), rt.initial(f, rt.fv(f, "vars", live(object)), rt.sv(f, "varholder"))])))) {
					yield* g.call(f, P("/proc/log_admin"), null, [fmt("Build Mode: ＀ modified ＀'s ＀ to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.fv(f, "name", live(object)), rt.sv(f, "varholder"), rt.sv(f, "valueholder")])]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Varedit rejected</span>"]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ does not have a var called '＀'</span>", [rt.initial(f, live(object), "name"), rt.sv(f, "varholder")])]);
			}
		}
	} else if ($0 === 4) {
		if (truthy(live(left_click))) {
			if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(object)])))) {
				return live(f.dot);
			}
			rt.setSv(f, "throw_atom", live(object));
		}
		if (truthy(live(right_click))) {
			if (truthy(rt.sv(f, "throw_atom"))) {
				yield* g.callName(f, rt.sv(f, "throw_atom"), "throw_at", [live(object), 10, 1, live(user)]);
				yield* g.call(f, P("/proc/log_admin"), null, [fmt("Build Mode: ＀ threw ＀ at ＀ (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.sv(f, "throw_atom"), live(object), rt.fv(f, "x", live(object)), rt.fv(f, "y", live(object)), rt.fv(f, "z", live(object))])]);
			}
		}
	} else if ($0 === 5) {
		if (!truthy(rt.sv(f, "cornerA"))) {
			rt.setSv(f, "cornerA", rt.getStep(f, live(object), 0));
			return live(f.dot);
		}
		if ((truthy(rt.sv(f, "cornerA")) && !truthy(rt.sv(f, "cornerB")))) {
			rt.setSv(f, "cornerB", rt.getStep(f, live(object), 0));
		}
		if (truthy(live(left_click))) {
			if ((truthy(rt.sv(f, "cornerA")) && truthy(rt.sv(f, "cornerB")))) {
				if (!truthy(rt.sv(f, "generator_path"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Select generator type first.</span>"]);
				}
				yield* g.callName(f, (G = (yield* g.new_(f, rt.sv(f, "generator_path"), []))), "defineRegion", [rt.sv(f, "cornerA"), rt.sv(f, "cornerB"), 1]);
				yield* g.callName(f, live(G), "generate", []);
				rt.setSv(f, "cornerA", null);
				rt.setSv(f, "cornerB", null);
				return live(f.dot);
			}
		}
		rt.setSv(f, "cornerA", null);
		rt.setSv(f, "cornerB", null);
	} else if ($0 === 6) {
		if (truthy(live(left_click))) {
			_T = rt.getStep(f, live(object), 0);
			if (truthy(rt.sv(f, "stored"))) {
				yield* g.call(f, P("/proc/DuplicateObject"), null, [null, rt.sv(f, "stored"), "perfectcopy", 1, "newloc", live(_T)], rt.Args.Named);
			}
		} else {
			if (!truthy(live(right_click))) return f.dot;
			if (!truthy((rt.istype(live(object), T("/atom/movable")) ? 1 : 0))) return f.dot;
			rt.setSv(f, "stored", live(object));
		}
	}
	return f.dot;
}, true);
