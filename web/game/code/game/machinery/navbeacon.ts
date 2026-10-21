// From code/game/machinery/navbeacon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10807, "/obj/machinery/navbeacon", "/obj/machinery", {
	open: 0,
	locked: 1,
	freq: 1445,
	location: "",
	codes: null,
	codes_txt: "",
	level: 1,
	anchored: 1,
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "navbeacon0-f",
	name: "navigation beacon",
	desc: "A radio beacon used for bot navigation.",
	layer: 2.5,
	obj_integrity: 500,
	max_integrity: 500,
	armor: null,
	req_access: null,
});

// /obj/machinery/navbeacon/proc/<init>  (code/game/machinery/navbeacon.dm:15)
rt.def("/obj/machinery/navbeacon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 70, "bullet", 70, "laser", 70, "energy", 70, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 80]));
	rt.setSv(f, "req_access", rt.list(10, 29));
	return f.dot;
});

// /obj/machinery/navbeacon/proc/New  (code/game/machinery/navbeacon.dm:27)  may sleep
rt.def("/obj/machinery/navbeacon/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_codes");
	yield* g.srcCall(f, "hide", rt.gv(f, "intact", (_T = rt.sv(f, "loc"))));
	if (truthy(rt.at(rt.sv(f, "codes"), "patrol"))) {
		if (!truthy(rt.index(rt.gl("navbeacons"), fmt("＀", [rt.sv(f, "z")])))) {
			rt.setAt(rt.gl("navbeacons"), fmt("＀", [rt.sv(f, "z")]), rt.list());
		}
		rt.modAt(rt.gl("navbeacons"), fmt("＀", [rt.sv(f, "z")]), live(f.src), add);
	}
	if (!truthy(rt.at(rt.sv(f, "codes"), "delivery"))) return f.dot;
	rt.modGl("deliverybeacons", live(f.src), add);
	rt.modGl("deliverybeacontags", rt.sv(f, "location"), add);
	return f.dot;
}, true);

// /obj/machinery/navbeacon/proc/Destroy  (code/game/machinery/navbeacon.dm:42)  may sleep
rt.def("/obj/machinery/navbeacon/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modAt(rt.gl("navbeacons"), fmt("＀", [rt.sv(f, "z")]), live(f.src), subtract));
	(rt.modGl("deliverybeacons", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/navbeacon/proc/set_codes  (code/game/machinery/navbeacon.dm:48)
rt.def("/obj/machinery/navbeacon/proc/set_codes", function set_codes(f: Frame) {
	let entries: Value = null, e: Value = null, index: Value = null, key: Value = null, val: Value = null;
	let $e: any;
	f.vars = () => [entries, e, index, key, val, $e];
	if (!truthy(rt.sv(f, "codes_txt"))) {
		return live(f.dot);
	}
	rt.setSv(f, "codes", rt.new_(f, T("/list"), []));
	entries = rt.call(f, P("/proc/splittext"), null, [rt.sv(f, "codes_txt"), ";"]);
	e = null;
	rt.forList(f, 0, live(entries));
	while (($e = rt.next(f, 0)) !== undefined) {
		e = $e;
		if (truthy((index = rt.call(f, P("/proc/findtext"), null, [live(e), "="])))) {
			key = rt.call(f, P("/proc/copytext"), null, [live(e), 1, live(index)]);
			val = rt.call(f, P("/proc/copytext"), null, [live(e), add(live(index), 1)]);
			rt.setAt(rt.sv(f, "codes"), live(key), live(val));
		} else {
			rt.setAt(rt.sv(f, "codes"), live(e), "1");
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/navbeacon/proc/hide  (code/game/machinery/navbeacon.dm:68)
rt.def("/obj/machinery/navbeacon/proc/hide", function hide(f: Frame, intact: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(live(intact))) {
		$0 = 100;
	} else {
		$0 = 0;
	}
	rt.setSv(f, "invisibility", $0);
	rt.callSrc(f, "updateicon", []);
	return f.dot;
});

// /obj/machinery/navbeacon/proc/updateicon  (code/game/machinery/navbeacon.dm:73)
rt.def("/obj/machinery/navbeacon/proc/updateicon", function updateicon(f: Frame) {
	let state: Value = null;
	f.vars = () => [state];
	state = fmt("navbeacon＀", [rt.sv(f, "open")]);
	if (truthy(rt.sv(f, "invisibility"))) {
		rt.setSv(f, "icon_state", fmt("＀-f", [live(state)]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀", [live(state)]));
	}
	return f.dot;
});

// /obj/machinery/navbeacon/proc/attackby  (code/game/machinery/navbeacon.dm:82)  may sleep
rt.def("/obj/machinery/navbeacon/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [_T, $0, $1, $2];
	if (truthy(rt.gv(f, "intact", (_T = rt.sv(f, "loc"))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		rt.setSv(f, "open", (!truthy(rt.sv(f, "open")) ? 1 : 0));
		$0 = live(f.args[1]);
		$1 = live(f.args[1]);
		if (truthy(rt.sv(f, "open"))) {
			$1 = $1;
			$2 = "opens";
		} else {
			$2 = "closes";
		}
		$1 = fmt("＀ ＀ the beacon's cover.", [$1, $2]);
		if (truthy(rt.sv(f, "open"))) {
			$2 = "open";
		} else {
			$2 = "close";
		}
		yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You ＀ the beacon's cover.</span>", [$2])]);
		yield* g.srcCall(f, "updateicon");
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/device/pda")) ? 1 : 0)))) {
			if (truthy(rt.sv(f, "open"))) {
				if (truthy((yield* g.callName(f, live(f.src), "allowed", [live(f.args[1])])))) {
					rt.setFv(f, "locked", live(f.src), (!truthy(rt.fv(f, "locked", live(f.src))) ? 1 : 0));
					$0 = live(f.args[1]);
					if (truthy(rt.fv(f, "locked", live(f.src)))) {
						$1 = "locked";
					} else {
						$1 = "unlocked";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Controls are now ＀.</span>", [$1])]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Access denied.</span>"]);
				}
				yield* g.srcCall(f, "updateDialog");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must open the cover first!</span>"]);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/navbeacon/proc/attack_ai  (code/game/machinery/navbeacon.dm:107)  may sleep
rt.def("/obj/machinery/navbeacon/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "interact", live(user), 1);
	return f.dot;
}, true);

// /obj/machinery/navbeacon/proc/attack_hand  (code/game/machinery/navbeacon.dm:113)  may sleep
rt.def("/obj/machinery/navbeacon/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "interact", live(user), 0);
	return f.dot;
}, true);

// /obj/machinery/navbeacon/proc/interact  (code/game/machinery/navbeacon.dm:116)  may sleep
rt.def("/obj/machinery/navbeacon/proc/interact", function* interact(f: Frame, user: Value, ai: Value) {
	let _T: Value = null, t: Value = null, key: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [user, ai, _T, t, key, popup, $0, $1, $e];
	if (live(ai) === null) {
		ai = 0;
	}
	if (truthy(rt.gv(f, "intact", (_T = rt.sv(f, "loc"))))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "open")) && !truthy(live(ai)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The beacon's control cover is closed!</span>"]);
		return live(f.dot);
	}
	t = null;
	if ((truthy(rt.sv(f, "locked")) && !truthy(live(ai)))) {
		if (truthy(rt.sv(f, "location"))) {
			$0 = rt.sv(f, "location");
		} else {
			$0 = "(none)";
		}
		t = fmt("<TT><B>Navigation Beacon</B><HR><BR>\n<i>(swipe card to unlock controls)</i><BR>\nLocation: ＀</A><BR>\nTransponder Codes:<UL>", [$0]);
		key = null;
		rt.forList(f, 0, rt.sv(f, "codes"));
		while (($e = rt.next(f, 0)) !== undefined) {
			key = $e;
			t = rt.modify(live(t), fmt("<LI>＀ ... ＀", [live(key), rt.index(rt.sv(f, "codes"), live(key))]), add);
		}
		rt.endFor(f, 0);
		t = rt.modify(live(t), "<UL></TT>", add);
	} else {
		$0 = live(f.src);
		if (truthy(rt.sv(f, "location"))) {
			$1 = rt.sv(f, "location");
		} else {
			$1 = "None";
		}
		t = fmt("<TT><B>Navigation Beacon</B><HR><BR>\n<i>(swipe card to lock controls)</i><BR>\n\n<HR>\nLocation: <A href='byond://?src=＃;locedit=1'>＀</A><BR>\nTransponder Codes:<UL>", [$0, $1]);
		key = null;
		rt.forList(f, 0, rt.sv(f, "codes"));
		while (($e = rt.next(f, 0)) !== undefined) {
			key = $e;
			t = rt.modify(live(t), fmt("<LI>＀ ... ＀", [live(key), rt.index(rt.sv(f, "codes"), live(key))]), add);
			t = rt.modify(live(t), fmt("\t<A href='byond://?src=＃;edit=1;code=＀'>Edit</A>", [live(f.src), live(key)]), add);
			t = rt.modify(live(t), fmt("\t<A href='byond://?src=＃;delete=1;code=＀'>Delete</A><BR>", [live(f.src), live(key)]), add);
		}
		rt.endFor(f, 0);
		t = rt.modify(live(t), fmt("\t<A href='byond://?src=＃;add=1;'>Add New</A><BR>", [live(f.src)]), add);
		t = rt.modify(live(t), "<UL></TT>", add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "navbeacon", "Navigation Beacon", 300, 400]))), "set_content", [live(t)]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/machinery/navbeacon/proc/Topic  (code/game/machinery/navbeacon.dm:159)  may sleep
rt.def("/obj/machinery/navbeacon/proc/Topic", function* Topic(f: Frame) {
	let newloc: Value = null, codekey: Value = null, newkey: Value = null, codeval: Value = null, newval: Value = null, newkey_0: Value = null, newval_1: Value = null;
	f.vars = () => [newloc, codekey, newkey, codeval, newval, newkey_0, newval_1];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!(truthy(rt.sv(f, "open")) && !truthy(rt.sv(f, "locked")))) return f.dot;
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.at(live(f.args[1]), "locedit"))) {
		if (truthy((newloc = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], [null, rt.sv(f, "location"), "Navigation Beacon", "Enter New Location", null]))])), 1, 1024]))))) {
			rt.setSv(f, "location", live(newloc));
			yield* g.srcCall(f, "updateDialog");
		}
	} else {
		if (truthy(rt.at(live(f.args[1]), "edit"))) {
			codekey = rt.at(live(f.args[1]), "code");
			if (!truthy((newkey = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Enter Transponder Code Key", "Navigation Beacon", live(codekey)]))))) {
				return live(f.dot);
			}
			codeval = rt.index(rt.sv(f, "codes"), live(codekey));
			if (!truthy((newval = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Enter Transponder Code Value", "Navigation Beacon", live(codeval)]))))) {
				newval = live(codekey);
				return live(f.dot);
			}
			yield* g.callName(f, rt.sv(f, "codes"), "Remove", [live(codekey)]);
			rt.setAt(rt.sv(f, "codes"), live(newkey), live(newval));
			yield* g.srcCall(f, "updateDialog");
		} else {
			if (truthy(rt.at(live(f.args[1]), "delete"))) {
				codekey = rt.at(live(f.args[1]), "code");
				yield* g.callName(f, rt.sv(f, "codes"), "Remove", [live(codekey)]);
				yield* g.srcCall(f, "updateDialog");
			} else {
				if (!truthy(rt.at(live(f.args[1]), "add"))) return f.dot;
				if (!truthy((newkey_0 = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Enter New Transponder Code Key", "Navigation Beacon"]))))) {
					return live(f.dot);
				}
				if (!truthy((newval_1 = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Enter New Transponder Code Value", "Navigation Beacon"]))))) {
					newval_1 = "1";
					return live(f.dot);
				}
				if (!truthy(rt.sv(f, "codes"))) {
					rt.setSv(f, "codes", (yield* g.new_(f, T("/list"), [])));
				}
				rt.setAt(rt.sv(f, "codes"), live(newkey_0), live(newval_1));
				yield* g.srcCall(f, "updateDialog");
			}
		}
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });
