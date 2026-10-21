// From code/game/objects/items/devices/camera_bug.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9227, "/obj/item/device/camera_bug", "/obj/item/device", {
	current: null,
	last_net_update: 0,
	bugged_cameras: null,
	track_mode: 0,
	last_tracked: 0,
	refresh_interval: 50,
	tracked_name: null,
	tracking: null,
	last_found: null,
	last_seen: null,
	throw_speed: 4,
	throw_range: 20,
	flags: 4,
	name: "camera bug",
	desc: "For illicit snooping through the camera network.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "camera_bug",
	w_class: 1,
	item_state: "camera_bug",
	origin_tech: "syndicate=1;engineering=3",
});

// /obj/item/device/camera_bug/proc/<init>  (code/game/objects/items/devices/camera_bug.dm:23)
rt.def("/obj/item/device/camera_bug/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bugged_cameras", rt.list());
	return f.dot;
});

// /obj/item/device/camera_bug/proc/New  (code/game/objects/items/devices/camera_bug.dm:36)  may sleep
rt.def("/obj/item/device/camera_bug/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/device/camera_bug/proc/Destroy  (code/game/objects/items/devices/camera_bug.dm:40)  may sleep
rt.def("/obj/item/device/camera_bug/proc/Destroy", function* Destroy(f: Frame) {
	let cam_tag: Value = null, camera: Value = null;
	let $e: any;
	f.vars = () => [cam_tag, camera, $e];
	yield* g.srcCall(f, "get_cameras");
	cam_tag = null;
	rt.forList(f, 0, rt.sv(f, "bugged_cameras"));
	while (($e = rt.next(f, 0)) !== undefined) {
		cam_tag = $e;
		if (isEqual(rt.gv(f, "bug", (camera = rt.index(rt.sv(f, "bugged_cameras"), live(cam_tag)))), live(f.src))) {
			rt.setFv(f, "bug", live(camera), null);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "bugged_cameras", rt.list());
	if (truthy(rt.sv(f, "tracking"))) {
		rt.setSv(f, "tracking", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/camera_bug/proc/interact  (code/game/objects/items/devices/camera_bug.dm:52)  may sleep
rt.def("/obj/item/device/camera_bug/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	f.vars = () => [user, popup];
	if (live(user) === null) {
		user = live(f.usr);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [null, live(user), null, "camerabug", null, "Camera Bug", "nref", live(f.src)], rt.Args.Named))), "set_content", [(yield* g.srcCall(f, "menu", (yield* g.srcCall(f, "get_cameras"))))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/item/device/camera_bug/proc/attack_self  (code/game/objects/items/devices/camera_bug.dm:57)  may sleep
rt.def("/obj/item/device/camera_bug/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/item/device/camera_bug/proc/check_eye  (code/game/objects/items/devices/camera_bug.dm:61)  may sleep
rt.def("/obj/item/device/camera_bug/proc/check_eye", function* check_eye(f: Frame, user: Value) {
	let _T: Value = null;
	f.vars = () => [user, _T];
	if ((((!isEqual(rt.sv(f, "loc"), live(user)) || truthy((yield* g.callName(f, live(user), "incapacitated", [])))) || truthy(rt.fv(f, "eye_blind", live(user)))) || !truthy(rt.sv(f, "current")))) {
		yield* g.callName(f, live(user), "unset_machine", []);
		return 0;
	}
	if ((!isEqual(rt.gv(f, "z", (_T = rt.getStep(f, rt.fv(f, "loc", live(user)), 0))), rt.fv(f, "z", rt.sv(f, "current"))) || !truthy((yield* g.callName(f, rt.sv(f, "current"), "can_use", []))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀ has lost the signal.</span>", [live(f.src)])]);
		rt.setSv(f, "current", null);
		yield* g.callName(f, live(user), "unset_machine", []);
		return 0;
	}
	return 1;
}, true);

// /obj/item/device/camera_bug/proc/on_unset_machine  (code/game/objects/items/devices/camera_bug.dm:72)  may sleep
rt.def("/obj/item/device/camera_bug/proc/on_unset_machine", function* on_unset_machine(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "reset_perspective", [null]);
	return f.dot;
}, true);

// /obj/item/device/camera_bug/proc/get_cameras  (code/game/objects/items/devices/camera_bug.dm:75)  may sleep
rt.def("/obj/item/device/camera_bug/proc/get_cameras", function* get_cameras(f: Frame) {
	let camera: Value = null;
	let $e: any;
	f.vars = () => [camera, $e];
	if (rt.gt(rt.worldTime(f), add(rt.sv(f, "last_net_update"), 100))) {
		rt.setSv(f, "bugged_cameras", rt.list());
		camera = null;
		rt.forList(f, 0, rt.fv(f, "cameras", rt.gl("cameranet")), T("/obj/machinery/camera"));
		while (($e = rt.next(f, 0)) !== undefined) {
			camera = $e;
			if ((truthy(rt.fv(f, "stat", live(camera))) || !truthy((yield* g.callName(f, live(camera), "can_use", []))))) {
				continue;
			}
			if (truthy(rt.length(rt.bitAnd(rt.list("SS13", "MINE"), rt.fv(f, "network", live(camera)))))) {
				rt.setAt(rt.sv(f, "bugged_cameras"), rt.fv(f, "c_tag", live(camera)), live(camera));
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/sortList"), null, [rt.sv(f, "bugged_cameras")]);
	return rt.sv(f, "bugged_cameras");
}, true);

// /obj/item/device/camera_bug/proc/menu  (code/game/objects/items/devices/camera_bug.dm:87)
rt.def("/obj/item/device/camera_bug/proc/menu", function menu(f: Frame, cameras: Value) {
	let html: Value = null, entry: Value = null, C: Value = null, functions: Value = null, time_diff: Value = null, outstring: Value = null, m: Value = null, s: Value = null;
	let $0: any, $e: any;
	f.vars = () => [html, entry, C, functions, time_diff, outstring, m, s, $0, $e];
	if ((!truthy(live(cameras)) || !truthy(rt.len(f, live(cameras))))) {
		return "No bugged cameras found.";
	}
	html = null;
	$0 = rt.sv(f, "track_mode");
	if ($0 === 0) {
		html = fmt("<h3>Select a camera:</h3> <a href='?src=＃;view'>[Cancel camera view]</a><hr><table>", [live(f.src)]);
		entry = null;
		rt.forList(f, 0, live(cameras));
		while (($e = rt.next(f, 0)) !== undefined) {
			entry = $e;
			C = rt.index(live(cameras), live(entry));
			functions = "";
			if (isEqual(rt.fv(f, "bug", live(C)), live(f.src))) {
				functions = fmt(" - <a href='?src=＃;monitor=＃'>[Monitor]</a> <a href='?src=＃;emp=＃'>[Disable]</a>", [live(f.src), live(C), live(f.src), live(C)]);
			} else {
				functions = fmt(" - <a href='?src=＃;monitor=＃'>[Monitor]</a>", [live(f.src), live(C)]);
			}
			html = rt.modify(live(html), fmt("<tr><td><a href='?src=＃;view=＃'>＀</a></td><td>＀</td></tr>", [live(f.src), live(C), live(entry), live(functions)]), add);
		}
		rt.endFor(f, 0);
	} else if ($0 === 1) {
		if (truthy(rt.sv(f, "current"))) {
			html = fmt("Analyzing Camera '＀' <a href='?＃;mode=0'>[Select Camera]</a><br>", [rt.fv(f, "c_tag", rt.sv(f, "current")), live(f.src)]);
			html = rt.modify(live(html), rt.callSrc(f, "camera_report", []), add);
		} else {
			rt.setSv(f, "track_mode", 0);
			return rt.callSelf(f, [live(cameras)]);
		}
	} else if ($0 === 2) {
		if (truthy(rt.sv(f, "tracking"))) {
			html = fmt("Tracking '＀'  <a href='?＃;mode=0'>[Cancel Tracking]</a>  <a href='?src=＃;view'>[Cancel camera view]</a><br>", [rt.sv(f, "tracked_name"), live(f.src), live(f.src)]);
			if (truthy(rt.sv(f, "last_found"))) {
				time_diff = rt.call(f, P("/proc/round"), null, [divide(subtract(rt.worldTime(f), rt.sv(f, "last_seen")), 150)]);
				C = rt.index(rt.sv(f, "bugged_cameras"), rt.sv(f, "last_found"));
				outstring = null;
				if (truthy(live(C))) {
					outstring = fmt("<a href='?＃;view=＃'>＀</a>", [live(f.src), live(C), rt.sv(f, "last_found")]);
				} else {
					outstring = rt.sv(f, "last_found");
				}
				if (!truthy(live(time_diff))) {
					html = rt.modify(live(html), fmt("Last seen near ＀ (now)<br>", [live(outstring)]), add);
				} else {
					m = rt.call(f, P("/proc/round"), null, [divide(live(time_diff), 4)]);
					if (!truthy((s = multiply(subtract(live(time_diff), multiply(4, live(m))), 15)))) {
						s = "00";
					}
					html = rt.modify(live(html), fmt("Last seen near ＀ (＀:＀ minute５ ago)<br>", [live(outstring), live(m), live(s)]), add);
				}
				if ((truthy(live(C)) && isEqual(rt.fv(f, "bug", live(C)), live(f.src)))) {
					html = rt.modify(live(html), fmt("<a href='?src=＃;emp=＃'>[Disable]</a>", [live(f.src), live(C)]), add);
				}
			} else {
				html = rt.modify(live(html), "Not yet seen.", add);
			}
		} else {
			rt.setSv(f, "track_mode", 0);
			return rt.callSelf(f, [live(cameras)]);
		}
	}
	return live(html);
});

// /obj/item/device/camera_bug/proc/get_seens  (code/game/objects/items/devices/camera_bug.dm:140)
rt.def("/obj/item/device/camera_bug/proc/get_seens", function get_seens(f: Frame) {
	let seen: Value = null;
	f.vars = () => [seen];
	if (!(truthy(rt.sv(f, "current")) && truthy(rt.callName(f, rt.sv(f, "current"), "can_use", [])))) return f.dot;
	return (seen = rt.callName(f, rt.sv(f, "current"), "can_see", []));
});

// /obj/item/device/camera_bug/proc/camera_report  (code/game/objects/items/devices/camera_bug.dm:146)
rt.def("/obj/item/device/camera_bug/proc/camera_report", function camera_report(f: Frame) {
	let dat: Value = null, seen: Value = null, names: Value = null, S: Value = null, stage: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [dat, seen, names, S, stage, M, $e];
	dat = "";
	if ((truthy((seen = rt.callSrc(f, "get_seens", []))) && rt.ge(rt.len(f, live(seen)), 1))) {
		names = rt.list();
		S = null;
		rt.forList(f, 0, live(seen), T("/obj/singularity"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			if (truthy((rt.isIn(f, rt.fv(f, "name", live(S)), live(names)) ? 1 : 0))) {
				rt.incAt(live(names), rt.fv(f, "name", live(S)), 1, true);
				dat = rt.modify(live(dat), fmt("＀ (＀)", [rt.fv(f, "name", live(S)), rt.index(live(names), rt.fv(f, "name", live(S)))]), add);
			} else {
				rt.setAt(live(names), rt.fv(f, "name", live(S)), 1);
				dat = rt.modify(live(dat), fmt("＀", [rt.fv(f, "name", live(S))]), add);
			}
			dat = rt.modify(live(dat), fmt(" (Stage ＀)", [(stage = add(rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "current_size", live(S)), 2)]), 1))]), add);
			dat = rt.modify(live(dat), fmt(" <a href='?＃;track=＃'>[Track]</a><br>", [live(f.src), live(S)]), add);
		}
		rt.endFor(f, 0);
		M = null;
		rt.forList(f, 0, live(seen), T("/obj/mecha"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (truthy((rt.isIn(f, rt.fv(f, "name", live(M)), live(names)) ? 1 : 0))) {
				rt.incAt(live(names), rt.fv(f, "name", live(M)), 1, true);
				dat = rt.modify(live(dat), fmt("＀ (＀)", [rt.fv(f, "name", live(M)), rt.index(live(names), rt.fv(f, "name", live(M)))]), add);
			} else {
				rt.setAt(live(names), rt.fv(f, "name", live(M)), 1);
				dat = rt.modify(live(dat), fmt("＀", [rt.fv(f, "name", live(M))]), add);
			}
			dat = rt.modify(live(dat), fmt(" <a href='?＃;track=＃'>[Track]</a><br>", [live(f.src), live(M)]), add);
		}
		rt.endFor(f, 0);
		M = null;
		rt.forList(f, 0, live(seen), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (truthy((rt.isIn(f, rt.fv(f, "name", live(M)), live(names)) ? 1 : 0))) {
				rt.incAt(live(names), rt.fv(f, "name", live(M)), 1, true);
				dat = rt.modify(live(dat), fmt("＀ (＀)", [rt.fv(f, "name", live(M)), rt.index(live(names), rt.fv(f, "name", live(M)))]), add);
			} else {
				rt.setAt(live(names), rt.fv(f, "name", live(M)), 1);
				dat = rt.modify(live(dat), fmt("＀", [rt.fv(f, "name", live(M))]), add);
			}
			if ((truthy(rt.fv(f, "buckled", live(M))) && !truthy(rt.fv(f, "lying", live(M))))) {
				dat = rt.modify(live(dat), " (Sitting)", add);
			}
			if (truthy(rt.fv(f, "lying", live(M)))) {
				dat = rt.modify(live(dat), " (Laying down)", add);
			}
			dat = rt.modify(live(dat), fmt(" <a href='?＃;track=＃'>[Track]</a><br>", [live(f.src), live(M)]), add);
		}
		rt.endFor(f, 0);
		if (isEqual(rt.length(live(dat)), 0)) {
			dat = rt.modify(live(dat), "No motion detected.", add);
		}
		return live(dat);
	} else {
		return "Camera Offline<br>";
	}
	return f.dot;
});

// /obj/item/device/camera_bug/proc/Topic  (code/game/objects/items/devices/camera_bug.dm:190)  may sleep
rt.def("/obj/item/device/camera_bug/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let cameras: Value = null, C: Value = null, seen: Value = null, A: Value = null, _T: Value = null;
	f.vars = () => [href, href_list, cameras, C, seen, A, _T];
	if (!isEqual(live(f.usr), rt.sv(f, "loc"))) {
		yield* g.callName(f, live(f.usr), "unset_machine", []);
		rt.op(f, "Browse", [], [live(f.usr), null, "window=camerabug"], false);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy((rt.isIn(f, "mode", live(href_list)) ? 1 : 0))) {
		rt.setSv(f, "track_mode", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "mode")])));
	}
	if (truthy((rt.isIn(f, "monitor", live(href_list)) ? 1 : 0))) {
		cameras = (yield* g.call(f, P("/proc/flatten_list"), null, [rt.sv(f, "bugged_cameras")]));
		if ((truthy((C = rt.locateIn(f, rt.at(live(href_list), "monitor"), live(cameras)))) && truthy((rt.istype(live(C), T("/obj/machinery/camera")) ? 1 : 0)))) {
			rt.setSv(f, "track_mode", 1);
			rt.setSv(f, "current", live(C));
			yield* g.callName(f, live(f.usr), "reset_perspective", [null]);
			yield* g.srcCall(f, "interact");
		}
	}
	if (truthy((rt.isIn(f, "track", live(href_list)) ? 1 : 0))) {
		if ((truthy((seen = (yield* g.srcCall(f, "get_seens")))) && rt.ge(rt.len(f, live(seen)), 1))) {
			if ((truthy((A = rt.locateIn(f, rt.at(live(href_list), "track"), live(seen)))) && truthy((rt.istype(live(A), T("/atom")) ? 1 : 0)))) {
				rt.setSv(f, "tracking", live(A));
				rt.setSv(f, "tracked_name", rt.fv(f, "name", live(A)));
				rt.setSv(f, "last_found", rt.fv(f, "c_tag", rt.sv(f, "current")));
				rt.setSv(f, "last_seen", rt.worldTime(f));
				rt.setSv(f, "track_mode", 2);
			}
		}
	}
	if (truthy((rt.isIn(f, "emp", live(href_list)) ? 1 : 0))) {
		cameras = (yield* g.call(f, P("/proc/flatten_list"), null, [rt.sv(f, "bugged_cameras")]));
		if (((truthy((C = rt.locateIn(f, rt.at(live(href_list), "emp"), live(cameras)))) && truthy((rt.istype(live(C), T("/obj/machinery/camera")) ? 1 : 0))) && isEqual(rt.fv(f, "bug", live(C)), live(f.src)))) {
			yield* g.callName(f, live(C), "emp_act", [1]);
			rt.setFv(f, "bug", live(C), null);
			(rt.modSrcVar(f, "bugged_cameras", rt.fv(f, "c_tag", live(C)), subtract));
		}
		yield* g.srcCall(f, "interact");
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, "close", live(href_list)) ? 1 : 0))) {
		yield* g.callName(f, live(f.usr), "unset_machine", []);
		rt.setSv(f, "current", null);
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, "view", live(href_list)) ? 1 : 0))) {
		cameras = (yield* g.call(f, P("/proc/flatten_list"), null, [rt.sv(f, "bugged_cameras")]));
		if ((truthy((C = rt.locateIn(f, rt.at(live(href_list), "view"), live(cameras)))) && truthy((rt.istype(live(C), T("/obj/machinery/camera")) ? 1 : 0)))) {
			if (!truthy((yield* g.callName(f, live(C), "can_use", [])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Something's wrong with that camera!  You can't get a feed.</span>"]);
				return live(f.dot);
			}
			if ((!truthy((_T = rt.getStep(f, rt.sv(f, "loc"), 0))) || !isEqual(rt.fv(f, "z", live(C)), rt.fv(f, "z", live(_T))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You can't get a signal!</span>"]);
				return live(f.dot);
			}
			rt.setSv(f, "current", live(C));
			rt.spawnTail(f, 6, "/obj/item/device/camera_bug/proc/Topic: spawn at game/objects/items/devices/camera_bug.dm:243", href, href_list, cameras, C, seen, A, _T);
			return live(f.dot);
		} else {
			yield* g.callName(f, live(f.usr), "unset_machine", []);
		}
	}
	yield* g.srcCall(f, "interact");
	return f.dot;
}, true);

// a spawn(6) body of /obj/item/device/camera_bug/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/camera_bug/proc/Topic: spawn at game/objects/items/devices/camera_bug.dm:243", function* (f: Frame, href: Value, href_list: Value, cameras: Value, C: Value, seen: Value, A: Value, _T: Value) {
	f.vars = () => [href, href_list, cameras, C, seen, A, _T];
	if (truthy((yield* g.callName(f, live(f.src), "check_eye", [live(f.usr)])))) {
		yield* g.callName(f, live(f.usr), "reset_perspective", [live(C)]);
		yield* g.srcCall(f, "interact");
	} else {
		yield* g.callName(f, live(f.usr), "unset_machine", []);
		rt.op(f, "Browse", [], [live(f.usr), null, "window=camerabug"], false);
	}
	return null;
});

// /obj/item/device/camera_bug/proc/process  (code/game/objects/items/devices/camera_bug.dm:257)  may sleep
rt.def("/obj/item/device/camera_bug/proc/process", function* process(f: Frame) {
	let M: Value = null, tracking_cams: Value = null, b_cams: Value = null, entry: Value = null, target_region: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [M, tracking_cams, b_cams, entry, target_region, C, $e];
	if ((isEqual(rt.sv(f, "track_mode"), 0) || rt.lt(rt.worldTime(f), add(rt.sv(f, "last_tracked"), rt.sv(f, "refresh_interval"))))) {
		return live(f.dot);
	}
	rt.setSv(f, "last_tracked", rt.worldTime(f));
	if (isEqual(rt.sv(f, "track_mode"), 2)) {
		if (!truthy(rt.sv(f, "tracking"))) {
			yield* g.callName(f, live(f.src), "updateSelfDialog", []);
			return live(f.dot);
		}
		if (!isEqual(rt.fv(f, "name", rt.sv(f, "tracking")), rt.sv(f, "tracked_name"))) {
			if (truthy((rt.istype((M = rt.sv(f, "tracking")), T("/mob")) ? 1 : 0))) {
				if (!(isEqual(rt.sv(f, "tracked_name"), "Unknown") && truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.fv(f, "name", rt.sv(f, "tracking")), "Unknown"]))))) {
					if (!(isEqual(rt.sv(f, "tracked_name"), rt.fv(f, "real_name", live(M))) && truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.fv(f, "name", rt.sv(f, "tracking")), rt.fv(f, "real_name", live(M))]))))) {
						yield* g.callName(f, live(f.src), "updateSelfDialog", []);
						return live(f.dot);
					}
				}
			} else {
				yield* g.callName(f, live(f.src), "updateSelfDialog", []);
				return live(f.dot);
			}
		}
		tracking_cams = rt.list();
		b_cams = (yield* g.srcCall(f, "get_cameras"));
		entry = null;
		rt.forList(f, 0, live(b_cams));
		while (($e = rt.next(f, 0)) !== undefined) {
			entry = $e;
			tracking_cams = rt.modify(live(tracking_cams), rt.index(live(b_cams), live(entry)), add);
		}
		rt.endFor(f, 0);
		target_region = (yield* g.call(f, P("/proc/view"), null, [rt.sv(f, "tracking")]));
		C = null;
		rt.forList(f, 0, rt.bitAnd(live(target_region), live(tracking_cams)), T("/obj/machinery/camera"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (!truthy((yield* g.call(f, P("/proc/can_see"), null, [live(C), rt.sv(f, "tracking")])))) {
				continue;
			}
			if (truthy((yield* g.callName(f, live(C), "can_use", [])))) {
				rt.setSv(f, "last_found", rt.fv(f, "c_tag", live(C)));
				rt.setSv(f, "last_seen", rt.worldTime(f));
				break;
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callName(f, live(f.src), "updateSelfDialog", []);
	return f.dot;
}, true, { waitfor: false });
