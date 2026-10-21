// From code/game/objects/items/blueprints.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9651, "/obj/item/areaeditor", "/obj/item", {
	fluffnotice: "Nobody's gonna read this stuff!",
	attack_verb: null,
	name: "area modification item",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "blueprints",
});

// /obj/item/areaeditor/proc/attack_self  (code/game/objects/items/blueprints.dm:24)  may sleep
rt.def("/obj/item/areaeditor/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let text: Value = null;
	let $0: any;
	f.vars = () => [user, text, $0];
	yield* g.srcCall(f, "add_fingerprint", live(user));
	text = fmt("<BODY><HTML><head><title>＀</title></head> <h2>＀ ＀</h2> <small>＀</small><hr>", [live(f.src), (yield* g.call(f, P("/proc/station_name"), null, [])), rt.fv(f, "name", live(f.src)), rt.sv(f, "fluffnotice")]);
	$0 = (yield* g.srcCall(f, "get_area_type"));
	if ($0 === 2) {
		text = rt.modify(live(text), fmt("<p>According to the ＀, you are now in an unclaimed territory.</p> <p><a href='?src=＃;create_area=1'>Mark this place as new area.</a></p>", [rt.fv(f, "name", live(f.src)), live(f.src)]), add);
	} else if ($0 === 3) {
		text = rt.modify(live(text), fmt("<p>This place is not noted on the ＀.</p>", [rt.fv(f, "name", live(f.src))]), add);
	}
	return live(text);
}, true);

// /obj/item/areaeditor/proc/Topic  (code/game/objects/items/blueprints.dm:38)  may sleep
rt.def("/obj/item/areaeditor/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=blueprints"], false);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "create_area"))) {
		if (isEqual((yield* g.srcCall(f, "get_area_type")), 2)) {
			yield* g.call(f, P("/proc/create_area"), null, [live(f.usr)]);
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

rt.type(9652, "/obj/item/areaeditor/blueprints", "/obj/item/areaeditor", {
	showing: null,
	viewing: null,
	legend: 0,
	fluffnotice: "Property of Nanotrasen. For heads of staff only. Store in high-secure storage.",
	name: "station blueprints",
	desc: "Blueprints of the station. There is a \"Classified\" stamp and several coffee stains on it.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "blueprints",
	resistance_flags: 99,
});

// /obj/item/areaeditor/blueprints/proc/<init>  (code/game/objects/items/blueprints.dm:56)
rt.def("/obj/item/areaeditor/blueprints/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "showing", rt.list());
	return f.dot;
});

// /obj/item/areaeditor/blueprints/proc/Destroy  (code/game/objects/items/blueprints.dm:62)  may sleep
rt.def("/obj/item/areaeditor/blueprints/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "clear_viewer");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/areaeditor/blueprints/proc/attack_self  (code/game/objects/items/blueprints.dm:67)  may sleep
rt.def("/obj/item/areaeditor/blueprints/proc/attack_self", function* attack_self(f: Frame) {
	let A: Value = null, popup: Value = null;
	f.vars = () => [A, popup];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "legend"))) {
		A = (yield* g.srcCall(f, "get_area"));
		if (isEqual((yield* g.srcCall(f, "get_area_type")), 1)) {
			f.dot = rt.modify(live(f.dot), fmt("<p>According to ％！, you are now in <b>\"＀\"</b>.</p>", [live(f.src), (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "name", live(A))]))]), add);
			f.dot = rt.modify(live(f.dot), fmt("<p>You may <a href='?src=＃;edit_area=1'>make an amendment</a> to the drawing.</p>", [live(f.src)]), add);
		}
		f.dot = rt.modify(live(f.dot), fmt("<p><a href='?src=＃;view_legend=1'>View wire colour legend</a></p>", [live(f.src)]), add);
		if (!truthy(rt.sv(f, "viewing"))) {
			f.dot = rt.modify(live(f.dot), fmt("<p><a href='?src=＃;view_blueprints=1'>View structural data</a></p>", [live(f.src)]), add);
		} else {
			f.dot = rt.modify(live(f.dot), fmt("<p><a href='?src=＃;refresh=1'>Refresh structural data</a></p>", [live(f.src)]), add);
			f.dot = rt.modify(live(f.dot), fmt("<p><a href='?src=＃;hide_blueprints=1'>Hide structural data</a></p>", [live(f.src)]), add);
		}
	} else {
		if (isEqual(rt.sv(f, "legend"), 1)) {
			f.dot = rt.modify(live(f.dot), fmt("<a href='?src=＃;exit_legend=1'><< Back</a>", [live(f.src)]), add);
			f.dot = rt.modify(live(f.dot), (yield* g.srcCall(f, "view_wire_devices", live(f.args[0]))), add);
		} else {
			f.dot = rt.modify(live(f.dot), fmt("<a href='?src=＃;view_legend=1'><< Back</a>", [live(f.src)]), add);
			f.dot = rt.modify(live(f.dot), (yield* g.srcCall(f, "view_wire_set", live(f.args[0]), rt.sv(f, "legend"))), add);
		}
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "blueprints", fmt("＀", [live(f.src)]), 700, 500]))), "set_content", [live(f.dot)]);
	yield* g.callName(f, live(popup), "open", []);
	yield* g.call(f, P("/proc/onclose"), null, [live(f.args[0]), "blueprints"]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/areaeditor/blueprints/proc/Topic  (code/game/objects/items/blueprints.dm:94)  may sleep
rt.def("/obj/item/areaeditor/blueprints/proc/Topic", function* Topic(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.at(live(f.args[1]), "edit_area"))) {
		if (!isEqual((yield* g.srcCall(f, "get_area_type")), 1)) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "edit_area");
	}
	if (truthy(rt.at(live(f.args[1]), "exit_legend"))) {
		rt.setSv(f, "legend", 0);
	}
	if (truthy(rt.at(live(f.args[1]), "view_legend"))) {
		rt.setSv(f, "legend", 1);
	}
	if (truthy(rt.at(live(f.args[1]), "view_wireset"))) {
		rt.setSv(f, "legend", rt.at(live(f.args[1]), "view_wireset"));
	}
	if (truthy(rt.at(live(f.args[1]), "view_blueprints"))) {
		yield* g.srcCall(f, "set_viewer", live(f.usr), "<span class='notice'>You flip the blueprints over to view the complex information diagram.</span>");
	}
	if (truthy(rt.at(live(f.args[1]), "hide_blueprints"))) {
		yield* g.srcCall(f, "clear_viewer", live(f.usr), "<span class='notice'>You flip the blueprints over to view the simple information diagram.</span>");
	}
	if (truthy(rt.at(live(f.args[1]), "refresh"))) {
		yield* g.srcCall(f, "clear_viewer", live(f.usr));
		yield* g.srcCall(f, "set_viewer", live(f.usr));
	}
	yield* g.srcCall(f, "attack_self", live(f.usr));
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/item/areaeditor/blueprints/proc/get_images  (code/game/objects/items/blueprints.dm:116)
rt.def("/obj/item/areaeditor/blueprints/proc/get_images", function get_images(f: Frame, _T: Value, viewsize: Value) {
	let tt: Value = null, TT: Value = null;
	let $e: any;
	f.vars = () => [tt, TT, $e];
	f.dot = rt.list();
	tt = null;
	rt.forList(f, 0, rt.call(f, P("/proc/block"), null, [rt.locate(rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(_T)), live(viewsize)), 1]), rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(_T)), live(viewsize)), 1]), rt.fv(f, "z", live(_T))), rt.locate(rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(_T)), live(viewsize)), rt.fv(f, "maxx", rt.world())]), rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(_T)), live(viewsize)), rt.fv(f, "maxy", rt.world())]), rt.fv(f, "z", live(_T)))]));
	while (($e = rt.next(f, 0)) !== undefined) {
		tt = $e;
		if (truthy(rt.gv(f, "blueprint_data", (TT = live(tt))))) {
			f.dot = rt.modify(live(f.dot), rt.fv(f, "blueprint_data", live(TT)), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/areaeditor/blueprints/proc/set_viewer  (code/game/objects/items/blueprints.dm:123)
rt.def("/obj/item/areaeditor/blueprints/proc/set_viewer", function set_viewer(f: Frame, user: Value, message: Value) {
	let viewscale: Value = null;
	f.vars = () => [message, viewscale];
	if (live(message) === null) {
		message = "";
	}
	if (!(truthy(live(user)) && truthy(rt.fv(f, "client", live(user))))) return f.dot;
	if (truthy(rt.sv(f, "viewing"))) {
		rt.callSrc(f, "clear_viewer", []);
	}
	rt.setSv(f, "viewing", rt.fv(f, "client", live(user)));
	viewscale = rt.call(f, P("/proc/getviewsize"), null, [rt.fv(f, "view", rt.sv(f, "viewing"))]);
	rt.setSv(f, "showing", rt.callSrc(f, "get_images", [rt.getStep(f, live(user), 0), rt.call(f, P("/proc/round"), null, [divide(rt.call(f, P("/proc/max"), null, [rt.index(live(viewscale), 1), rt.index(live(viewscale), 2)]), 2)])]));
	(rt.modField(f, rt.sv(f, "viewing"), "images", rt.sv(f, "showing"), rt.bitOr));
	if (!truthy(live(message))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), live(message)]);
	return f.dot;
});

// /obj/item/areaeditor/blueprints/proc/clear_viewer  (code/game/objects/items/blueprints.dm:135)
rt.def("/obj/item/areaeditor/blueprints/proc/clear_viewer", function clear_viewer(f: Frame, user: Value, message: Value) {
	f.vars = () => [message];
	if (live(message) === null) {
		message = "";
	}
	if (truthy(rt.sv(f, "viewing"))) {
		(rt.modField(f, rt.sv(f, "viewing"), "images", rt.sv(f, "showing"), subtract));
		rt.setSv(f, "viewing", null);
	}
	rt.callName(f, rt.sv(f, "showing"), "Cut", []);
	if (!truthy(live(message))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), live(message)]);
	return f.dot;
});

// /obj/item/areaeditor/blueprints/proc/dropped  (code/game/objects/items/blueprints.dm:142)  may sleep
rt.def("/obj/item/areaeditor/blueprints/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "clear_viewer");
	rt.setSv(f, "legend", 0);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/areaeditor/proc/get_area  (code/game/objects/items/blueprints.dm:148)
rt.def("/obj/item/areaeditor/proc/get_area", function get_area(f: Frame) {
	let _T: Value = null, A: Value = null;
	f.vars = () => [_T, A];
	_T = rt.getStep(f, live(f.usr), 0);
	return (A = rt.fv(f, "loc", live(_T)));
});

// /obj/item/areaeditor/proc/get_area_type  (code/game/objects/items/blueprints.dm:153)
rt.def("/obj/item/areaeditor/proc/get_area_type", function get_area_type(f: Frame, A: Value) {
	let SPECIALS: Value = null, type: Value = null;
	let $e: any;
	f.vars = () => [A, SPECIALS, type, $e];
	if (live(A) === null) {
		A = rt.callSrc(f, "get_area", []);
	}
	if (truthy(rt.fv(f, "outdoors", live(A)))) {
		return 2;
	}
	SPECIALS = rt.list(T("/area/shuttle"), T("/area/admin"), T("/area/arrival"), T("/area/centcom"), T("/area/asteroid"), T("/area/tdome"), T("/area/wizard_station"), T("/area/prison"));
	type = null;
	rt.forList(f, 0, live(SPECIALS));
	while (($e = rt.next(f, 0)) !== undefined) {
		type = $e;
		if (truthy(rt.op(f, "IsType", [], [live(A), live(type)]))) {
			return 3;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /obj/item/areaeditor/blueprints/proc/view_wire_devices  (code/game/objects/items/blueprints.dm:171)
rt.def("/obj/item/areaeditor/blueprints/proc/view_wire_devices", function view_wire_devices(f: Frame, user: Value) {
	let message: Value = null, wireset: Value = null;
	let $e: any;
	f.vars = () => [message, wireset, $e];
	message = "<br>You examine the wire legend.<br>";
	wireset = null;
	rt.forList(f, 0, rt.gl("wire_color_directory"));
	while (($e = rt.next(f, 0)) !== undefined) {
		wireset = $e;
		message = rt.modify(live(message), fmt("<br><a href='?src=＃;view_wireset=＀'>＀</a>", [live(f.src), live(wireset), rt.index(rt.gl("wire_name_directory"), live(wireset))]), add);
	}
	rt.endFor(f, 0);
	return (message = rt.modify(live(message), "</p>", add));
});

// /obj/item/areaeditor/blueprints/proc/view_wire_set  (code/game/objects/items/blueprints.dm:179)
rt.def("/obj/item/areaeditor/blueprints/proc/view_wire_set", function view_wire_set(f: Frame, user: Value, wireset: Value) {
	let device: Value = null, message: Value = null, Col: Value = null, wire_name: Value = null;
	let $e: any;
	f.vars = () => [device, message, Col, wire_name, $e];
	device = null;
	rt.forList(f, 0, rt.gl("wire_color_directory"));
	while (($e = rt.next(f, 0)) !== undefined) {
		device = $e;
		if (isEqual(fmt("＀", [live(device)]), live(wireset))) {
			message = fmt("<p><b>＀:</b>", [rt.index(rt.gl("wire_name_directory"), live(device))]);
			Col = null;
			rt.forList(f, 1, rt.index(rt.gl("wire_color_directory"), live(device)));
			while (($e = rt.next(f, 1)) !== undefined) {
				Col = $e;
				if (!truthy(rt.call(f, P("/proc/findtext"), null, [(wire_name = rt.index(rt.index(rt.gl("wire_color_directory"), live(device)), live(Col))), "__dud"]))) {
					message = rt.modify(live(message), fmt("<p><span style='color: ＀'>＀</span>: ＀</p>", [live(Col), live(Col), live(wire_name)]), add);
				}
			}
			rt.endFor(f, 1);
			return (message = rt.modify(live(message), "</p>", add));
		}
	}
	rt.endFor(f, 0);
	return "";
});

// /proc/create_area  (code/game/objects/items/blueprints.dm:191)  may sleep
rt.def("/proc/create_area", function* create_area(f: Frame, creator: Value) {
	let res: Value = null, turfs: Value = null, str: Value = null, old: Value = null, old_gravity: Value = null, A: Value = null, key: Value = null, _T: Value = null, old_area: Value = null, RA: Value = null, D: Value = null, FD: Value = null;
	let $0: any, $e: any;
	f.vars = () => [creator, res, turfs, str, old, old_gravity, A, key, _T, old_area, RA, D, FD, $0, $e];
	if (!truthy((rt.istype((res = (yield* g.call(f, P("/proc/detect_room"), null, [rt.getStep(f, live(creator), 0)]))), T("/list")) ? 1 : 0))) {
		$0 = live(res);
		if ($0 === 1) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(creator), "<span class='warning'>The new area must be completely airtight.</span>"]);
			return live(f.dot);
		} else if ($0 === 2) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(creator), "<span class='warning'>The new area is too large.</span>"]);
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(creator), "<span class='warning'>Error! Please notify administration.</span>"]);
			return live(f.dot);
		}
	}
	turfs = live(res);
	if ((!truthy((str = (yield* g.call(f, P("/proc/trim"), null, [(yield* g.call(f, P("/proc/stripped_input"), null, [live(creator), "New area name:", "Blueprint Editing", "", 42]))])))) || !truthy(rt.length(live(str))))) {
		return live(f.dot);
	}
	if (rt.gt(rt.length(live(str)), 50)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(creator), "<span class='warning'>The given name is too long.  The area remains undefined.</span>"]);
		return live(f.dot);
	}
	old = (yield* g.call(f, P("/proc/get_area"), null, [rt.getStep(f, live(creator), 0)]));
	old_gravity = rt.fv(f, "has_gravity", live(old));
	A = null;
	key = null;
	rt.forList(f, 0, live(turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		if (isEqual(live(key), live(str))) {
			A = rt.index(live(turfs), live(key));
		}
		if (truthy(rt.index(live(turfs), live(key)))) {
			(turfs = rt.modify(live(turfs), rt.index(live(turfs), live(key)), subtract));
			(turfs = rt.modify(live(turfs), live(key), subtract));
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(A))) {
		yield* g.callName(f, live(A), "set_dynamic_lighting", []);
		_T = null;
		rt.forList(f, 0, live(turfs), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			old_area = rt.fv(f, "loc", live(_T));
			rt.modField(f, live(A), "contents", live(_T), add);
			yield* g.callName(f, live(_T), "change_area", [live(old_area), live(_T)]);
		}
		rt.endFor(f, 0);
	} else {
		yield* g.callName(f, (A = (yield* g.new_(f, T("/area"), []))), "setup", [live(str)]);
		yield* g.callName(f, live(A), "set_dynamic_lighting", []);
		_T = null;
		rt.forList(f, 0, live(turfs), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			old_area = rt.fv(f, "loc", live(_T));
			rt.modField(f, live(A), "contents", live(_T), add);
			yield* g.callName(f, live(_T), "change_area", [live(old_area), live(_T)]);
		}
		rt.endFor(f, 0);
	}
	rt.setFv(f, "has_gravity", live(A), live(old_gravity));
	RA = null;
	rt.forList(f, 0, rt.fv(f, "related", live(old)), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RA = $e;
		if (truthy(rt.fv(f, "firedoors", live(RA)))) {
			D = null;
			rt.forList(f, 1, rt.fv(f, "firedoors", live(RA)));
			while (($e = rt.next(f, 1)) !== undefined) {
				D = $e;
				yield* g.callName(f, (FD = live(D)), "CalculateAffectingAreas", []);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(creator), fmt("<span class='notice'>You have created a new area, named ＀. It is now weather proof, and constructing an APC will allow it to be powered.</span>", [live(str)])]);
	return 1;
}, true);

// /obj/item/areaeditor/proc/edit_area  (code/game/objects/items/blueprints.dm:248)  may sleep
rt.def("/obj/item/areaeditor/proc/edit_area", function* edit_area(f: Frame) {
	let A: Value = null, prevname: Value = null, str: Value = null, RA: Value = null, D: Value = null, FD: Value = null;
	let $e: any;
	f.vars = () => [A, prevname, str, RA, D, FD, $e];
	A = (yield* g.srcCall(f, "get_area"));
	prevname = fmt("＀", [rt.fv(f, "name", live(A))]);
	if (((!truthy((str = (yield* g.call(f, P("/proc/trim"), null, [(yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "New area name:", "Area Creation", "", 42]))])))) || !truthy(rt.length(live(str)))) || isEqual(live(str), live(prevname)))) {
		return live(f.dot);
	}
	if (rt.gt(rt.length(live(str)), 50)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>The given name is too long.  The area's name is unchanged.</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "set_area_machinery_title", live(A), live(str), live(prevname));
	RA = null;
	rt.forList(f, 0, rt.fv(f, "related", live(A)), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RA = $e;
		rt.setFv(f, "name", live(RA), live(str));
		if (truthy(rt.fv(f, "firedoors", live(RA)))) {
			D = null;
			rt.forList(f, 1, rt.fv(f, "firedoors", live(RA)));
			while (($e = rt.next(f, 1)) !== undefined) {
				D = $e;
				yield* g.callName(f, (FD = live(D)), "CalculateAffectingAreas", []);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You rename the '＀' to '＀'.</span>", [live(prevname), live(str)])]);
	yield* g.srcCall(f, "interact");
	return 1;
}, true);

// /obj/item/areaeditor/proc/set_area_machinery_title  (code/game/objects/items/blueprints.dm:269)
rt.def("/obj/item/areaeditor/proc/set_area_machinery_title", function set_area_machinery_title(f: Frame, A: Value, title: Value, oldtitle: Value) {
	let RA: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [RA, M, $e];
	if (!truthy(live(oldtitle))) {
		return live(f.dot);
	}
	RA = null;
	rt.forList(f, 0, rt.fv(f, "related", live(A)), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RA = $e;
		M = null;
		rt.forList(f, 1, live(RA), T("/obj/machinery/airalarm"));
		while (($e = rt.next(f, 1)) !== undefined) {
			M = $e;
			rt.setFv(f, "name", live(M), rt.call(f, P("/proc/replacetext"), null, [rt.fv(f, "name", live(M)), live(oldtitle), live(title)]));
		}
		rt.endFor(f, 1);
		M = null;
		rt.forList(f, 1, live(RA), T("/obj/machinery/power/apc"));
		while (($e = rt.next(f, 1)) !== undefined) {
			M = $e;
			rt.setFv(f, "name", live(M), rt.call(f, P("/proc/replacetext"), null, [rt.fv(f, "name", live(M)), live(oldtitle), live(title)]));
		}
		rt.endFor(f, 1);
		M = null;
		rt.forList(f, 1, live(RA), T("/obj/machinery/atmospherics/components/unary/vent_scrubber"));
		while (($e = rt.next(f, 1)) !== undefined) {
			M = $e;
			rt.setFv(f, "name", live(M), rt.call(f, P("/proc/replacetext"), null, [rt.fv(f, "name", live(M)), live(oldtitle), live(title)]));
		}
		rt.endFor(f, 1);
		M = null;
		rt.forList(f, 1, live(RA), T("/obj/machinery/atmospherics/components/unary/vent_pump"));
		while (($e = rt.next(f, 1)) !== undefined) {
			M = $e;
			rt.setFv(f, "name", live(M), rt.call(f, P("/proc/replacetext"), null, [rt.fv(f, "name", live(M)), live(oldtitle), live(title)]));
		}
		rt.endFor(f, 1);
		M = null;
		rt.forList(f, 1, live(RA), T("/obj/machinery/door"));
		while (($e = rt.next(f, 1)) !== undefined) {
			M = $e;
			rt.setFv(f, "name", live(M), rt.call(f, P("/proc/replacetext"), null, [rt.fv(f, "name", live(M)), live(oldtitle), live(title)]));
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /turf/open/proc/check_tile_is_border  (code/game/objects/items/blueprints.dm:295)
rt.def("/turf/open/proc/check_tile_is_border", function check_tile_is_border(f: Frame) {
	let AM: Value = null;
	let $0: any, $e: any;
	f.vars = () => [AM, $0, $e];
	AM = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if (isEqual(rt.fv(f, "CanAtmosPass", live(AM)), -1)) {
			$0 = rt.callName(f, live(AM), "CanAtmosPass", [live(f.src)]);
		} else {
			if (isEqual(rt.fv(f, "CanAtmosPass", live(AM)), -2)) {
				$0 = (!truthy(rt.fv(f, "density", live(AM))) ? 1 : 0);
			} else {
				$0 = rt.fv(f, "CanAtmosPass", live(AM));
			}
		}
		if (!truthy($0)) {
			return 3;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /proc/detect_room  (code/game/objects/items/blueprints.dm:305)
rt.def("/proc/detect_room", function detect_room(f: Frame, first: Value) {
	let found: Value = null, pending: Value = null, border: Value = null, _T: Value = null, dir: Value = null, skip: Value = null, W: Value = null, D: Value = null, NT: Value = null, A: Value = null, V: Value = null, F: Value = null, direction: Value = null, U: Value = null;
	let $0: any, $e: any;
	f.vars = () => [found, pending, border, _T, dir, skip, W, D, NT, A, V, F, direction, U, $0, $e];
	found = rt.new_(f, T("/list"), []);
	pending = rt.list(live(first));
	border = rt.list();
	while (truthy(rt.len(f, live(pending)))) {
		if (rt.gt(add(rt.len(f, live(found)), rt.len(f, live(pending))), 300)) {
			return 2;
		}
		(pending = rt.modify(live(pending), (_T = rt.index(live(pending), 1)), subtract));
		dir = null;
		rt.forList(f, 0, rt.gl("cardinal"));
		while (($e = rt.next(f, 0)) !== undefined) {
			dir = $e;
			skip = 0;
			W = null;
			rt.forList(f, 1, live(_T), T("/obj/structure/window"));
			while (($e = rt.next(f, 1)) !== undefined) {
				W = $e;
				if ((isEqual(live(dir), rt.fv(f, "dir", live(W))) || truthy((rt.isIn(f, rt.fv(f, "dir", live(W)), rt.list(5, 6, 9, 10)) ? 1 : 0)))) {
					skip = 1;
					break;
				}
			}
			rt.endFor(f, 1);
			if (truthy(live(skip))) {
				continue;
			}
			D = null;
			rt.forList(f, 1, live(_T), T("/obj/machinery/door/window"));
			while (($e = rt.next(f, 1)) !== undefined) {
				D = $e;
				if (isEqual(live(dir), rt.fv(f, "dir", live(D)))) {
					skip = 1;
					break;
				}
			}
			rt.endFor(f, 1);
			if (truthy(live(skip))) {
				continue;
			}
			if (((!truthy(rt.call(f, P("/proc/isturf"), null, [(NT = rt.getStep(f, live(_T), live(dir)))])) || truthy((rt.isIn(f, live(NT), live(found)) ? 1 : 0))) || truthy((rt.isIn(f, live(NT), live(pending)) ? 1 : 0)))) {
				continue;
			}
			$0 = rt.callName(f, live(NT), "check_tile_is_border", []);
			if ($0 === 1) {
				pending = rt.modify(live(pending), live(NT), add);
			} else if ($0 === 2) {
				A = rt.fv(f, "loc", live(NT));
				if (!truthy(rt.index(live(found), rt.fv(f, "name", live(A))))) {
					rt.setAt(live(found), rt.fv(f, "name", live(A)), rt.fv(f, "loc", live(NT)));
				}
			} else if ($0 === 3) {
				rt.modAt(live(border), live(NT), live(dir), add);
			} else if ($0 === 4) {
				return 1;
			}
		}
		rt.endFor(f, 0);
		found = rt.modify(live(found), live(_T), add);
	}
	V = null;
	rt.forList(f, 0, live(border));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		F = live(V);
		direction = null;
		rt.forList(f, 1, rt.gl("cardinal"));
		while (($e = rt.next(f, 1)) !== undefined) {
			direction = $e;
			if (isEqual(live(direction), rt.index(live(border), live(F)))) {
				continue;
			}
			if ((truthy((rt.isIn(f, (U = rt.getStep(f, live(F), live(direction))), live(border)) ? 1 : 0)) || truthy((rt.isIn(f, live(U), live(found)) ? 1 : 0)))) {
				continue;
			}
			if (isEqual(rt.callName(f, live(U), "check_tile_is_border", []), 3)) {
				found = rt.modify(live(found), live(U), add);
			}
		}
		rt.endFor(f, 1);
		(found = rt.modify(live(found), live(F), rt.bitOr));
	}
	rt.endFor(f, 0);
	return live(found);
});
