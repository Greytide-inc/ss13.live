// From code/game/objects/items/weapons/teleportation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7345, "/obj/item/weapon/locator", "/obj/item/weapon", {
	temp: null,
	frequency: 1451,
	broadcasting: null,
	listening: 1,
	flags: 64,
	throw_speed: 3,
	throw_range: 7,
	name: "locator",
	desc: "Used to track those with locater implants.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "locator",
	w_class: 2,
	item_state: "electronic",
	materials: null,
	origin_tech: "magnets=3;bluespace=2",
});

// /obj/item/weapon/locator/proc/<init>  (code/game/objects/items/weapons/teleportation.dm:28)
rt.def("/obj/item/weapon/locator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400]));
	return f.dot;
});

// /obj/item/weapon/locator/proc/attack_self  (code/game/objects/items/weapons/teleportation.dm:32)  may sleep
rt.def("/obj/item/weapon/locator/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null;
	f.vars = () => [user, dat];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = null;
	if (truthy(rt.fv(f, "temp", live(f.src)))) {
		dat = fmt("＀<BR><BR><A href='byond://?src=＃;temp=1'>Clear</A>", [rt.fv(f, "temp", live(f.src)), live(f.src)]);
	} else {
		dat = fmt("\n<B>Persistent Signal Locator</B><HR>\nFrequency:\n<A href='byond://?src=＃;freq=-10'>-</A>\n<A href='byond://?src=＃;freq=-2'>-</A> ＀\n<A href='byond://?src=＃;freq=2'>+</A>\n<A href='byond://?src=＃;freq=10'>+</A><BR>\n\n<A href='?src=＃;refresh=1'>Refresh</A>", [live(f.src), live(f.src), (yield* g.call(f, P("/proc/format_frequency"), null, [rt.fv(f, "frequency", live(f.src))])), live(f.src), live(f.src), live(f.src)]);
	}
	rt.op(f, "Browse", [], [live(user), live(dat), "window=radio"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "radio"]);
	return live(f.dot);
}, true);

// /obj/item/weapon/locator/proc/Topic  (code/game/objects/items/weapons/teleportation.dm:51)  may sleep
rt.def("/obj/item/weapon/locator/proc/Topic", function* Topic(f: Frame) {
	let current_location: Value = null, sr: Value = null, W: Value = null, tr: Value = null, direct: Value = null, M: Value = null, M_1: Value = null;
	let $e: any;
	f.vars = () => [current_location, sr, W, tr, direct, M, M_1, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		return live(f.dot);
	}
	if ((!truthy((current_location = rt.getStep(f, live(f.usr), 0))) || isEqual(rt.fv(f, "z", live(current_location)), 2))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("The ＀ is malfunctioning.", [live(f.src)])]);
		return live(f.dot);
	}
	if ((truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)]))) || (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))))) {
		yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
		if (truthy(rt.at(live(f.args[1]), "refresh"))) {
			rt.setFv(f, "temp", live(f.src), "<B>Persistent Signal Locator</B><HR>");
			if (truthy((sr = rt.getStep(f, live(f.src), 0)))) {
				rt.modField(f, live(f.src), "temp", "<B>Located Beacons:</B><BR>", add);
				W = null;
				rt.forList(f, 0, rt.gl("teleportbeacons"), T("/obj/item/device/radio/beacon"));
				while (($e = rt.next(f, 0)) !== undefined) {
					W = $e;
					if (isEqual(rt.fv(f, "frequency", live(W)), rt.fv(f, "frequency", live(f.src)))) {
						if ((isEqual(rt.gv(f, "z", (tr = rt.getStep(f, live(W), 0))), rt.fv(f, "z", live(sr))) && truthy(live(tr)))) {
							if (rt.lt((direct = (yield* g.call(f, P("/proc/max"), null, [rt.op(f, "Abs", [], [subtract(rt.fv(f, "x", live(tr)), rt.fv(f, "x", live(sr)))]), rt.op(f, "Abs", [], [subtract(rt.fv(f, "y", live(tr)), rt.fv(f, "y", live(sr)))])]))), 5)) {
								direct = "very strong";
							} else {
								if (rt.lt(live(direct), 10)) {
									direct = "strong";
								} else {
									if (rt.lt(live(direct), 20)) {
										direct = "weak";
									} else {
										direct = "very weak";
									}
								}
							}
							rt.modField(f, live(f.src), "temp", fmt("＀-＀-＀<BR>", [rt.fv(f, "code", live(W)), (yield* g.call(f, P("/proc/dir2text"), null, [rt.getDir(f, live(sr), live(tr))])), live(direct)]), add);
						}
					}
				}
				rt.endFor(f, 0);
				rt.modField(f, live(f.src), "temp", "<B>Extranneous Signals:</B><BR>", add);
				W = null;
				rt.forList(f, 0, rt.gl("tracked_implants"), T("/obj/item/weapon/implant/tracking"));
				while (($e = rt.next(f, 0)) !== undefined) {
					W = $e;
					if ((!truthy(rt.fv(f, "imp_in", live(W))) || !truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", live(W))]))))) {
						continue;
					}
					if (isEqual(rt.gv(f, "stat", (M = rt.fv(f, "loc", live(W)))), 2)) {
						if (rt.lt(add(rt.fv(f, "timeofdeath", live(M)), 6000), rt.worldTime(f))) {
							continue;
						}
					}
					if ((isEqual(rt.gv(f, "z", (tr = rt.getStep(f, live(W), 0))), rt.fv(f, "z", live(sr))) && truthy(live(tr)))) {
						if (rt.lt((direct = (yield* g.call(f, P("/proc/max"), null, [rt.op(f, "Abs", [], [subtract(rt.fv(f, "x", live(tr)), rt.fv(f, "x", live(sr)))]), rt.op(f, "Abs", [], [subtract(rt.fv(f, "y", live(tr)), rt.fv(f, "y", live(sr)))])]))), 20)) {
							if (rt.lt(live(direct), 5)) {
								direct = "very strong";
							} else {
								if (rt.lt(live(direct), 10)) {
									direct = "strong";
								} else {
									direct = "weak";
								}
							}
							rt.modField(f, live(f.src), "temp", fmt("＀-＀-＀<BR>", [rt.gv(f, "name", rt.fv(f, "imp_in", live(W))), (yield* g.call(f, P("/proc/dir2text"), null, [rt.getDir(f, live(sr), live(tr))])), live(direct)]), add);
						}
					}
				}
				rt.endFor(f, 0);
				rt.modField(f, live(f.src), "temp", fmt("<B>You are at [＀,＀,＀]</B> in orbital coordinates.<BR><BR><A href='byond://?src=＃;refresh=1'>Refresh</A><BR>", [rt.fv(f, "x", live(sr)), rt.fv(f, "y", live(sr)), rt.fv(f, "z", live(sr)), live(f.src)]), add);
			} else {
				rt.modField(f, live(f.src), "temp", "<B><FONT color='red'>Processing Error:</FONT></B> Unable to locate orbital position.<BR>", add);
			}
		} else {
			if (truthy(rt.at(live(f.args[1]), "freq"))) {
				rt.modField(f, live(f.src), "frequency", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "freq")])), add);
				rt.setFv(f, "frequency", live(f.src), (yield* g.call(f, P("/proc/sanitize_frequency"), null, [rt.fv(f, "frequency", live(f.src))])));
			} else {
				if (truthy(rt.at(live(f.args[1]), "temp"))) {
					rt.setFv(f, "temp", live(f.src), null);
				}
			}
		}
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", live(f.src))])))) {
			yield* g.srcCall(f, "attack_self", rt.fv(f, "loc", live(f.src)));
		} else {
			M_1 = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [1, live(f.src)])), T("/mob"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M_1 = $e;
				if (truthy(rt.fv(f, "client", live(M_1)))) {
					yield* g.callName(f, live(f.src), "attack_self", [live(M_1)]);
				}
			}
			rt.endFor(f, 0);
		}
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

rt.type(7346, "/obj/item/weapon/hand_tele", "/obj/item/weapon", {
	active_portal_pairs: null,
	max_portal_pairs: 3,
	throw_speed: 3,
	throw_range: 5,
	name: "hand tele",
	desc: "A portable item using blue-space technology.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "hand_tele",
	item_state: "electronic",
	throwforce: 0,
	w_class: 2,
	materials: null,
	origin_tech: "magnets=3;bluespace=4",
	armor: null,
	resistance_flags: 99,
});

// /obj/item/weapon/hand_tele/proc/<init>  (code/game/objects/items/weapons/teleportation.dm:139)
rt.def("/obj/item/weapon/hand_tele/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 30, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	return f.dot;
});

// /obj/item/weapon/hand_tele/proc/Initialize  (code/game/objects/items/weapons/teleportation.dm:147)  may sleep
rt.def("/obj/item/weapon/hand_tele/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "active_portal_pairs", rt.list());
	return f.dot;
}, true);

// /obj/item/weapon/hand_tele/proc/afterattack  (code/game/objects/items/weapons/teleportation.dm:151)  may sleep
rt.def("/obj/item/weapon/hand_tele/proc/afterattack", function* afterattack(f: Frame) {
	if (truthy((yield* g.srcCall(f, "is_parent_of_portal", live(f.args[0]))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You dispel ＀ remotely with ％！!</span>", [live(f.args[0]), live(f.src)])]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["target", "user", "proximity", "params"] });

// /obj/item/weapon/hand_tele/proc/attack_self  (code/game/objects/items/weapons/teleportation.dm:158)  may sleep
rt.def("/obj/item/weapon/hand_tele/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let current_location: Value = null, current_area: Value = null, L: Value = null, com: Value = null, A: Value = null, turfs: Value = null, _T: Value = null, A_5: Value = null, t1: Value = null, _T_5: Value = null, A_6: Value = null, created: Value = null;
	let $e: any;
	f.vars = () => [user, current_location, current_area, L, com, A, turfs, _T, A_5, t1, _T_5, A_6, created, $e];
	current_location = rt.getStep(f, live(user), 0);
	current_area = rt.fv(f, "loc", live(current_location));
	if ((((!truthy(live(current_location)) || truthy(rt.fv(f, "noteleport", live(current_area)))) || rt.gt(rt.fv(f, "z", live(current_location)), 12)) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＄！ is malfunctioning.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	L = rt.list();
	com = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/teleporter"));
	while (($e = rt.next(f, 0)) !== undefined) {
		com = $e;
		if (truthy(rt.fv(f, "target", live(com)))) {
			if ((!truthy((A = (yield* g.call(f, P("/proc/get_area"), null, [rt.fv(f, "target", live(com))])))) || truthy(rt.fv(f, "noteleport", live(A))))) {
				continue;
			}
			if (((truthy(rt.fv(f, "power_station", live(com))) && truthy(rt.gv(f, "teleporter_hub", rt.fv(f, "power_station", live(com))))) && truthy(rt.gv(f, "engaged", rt.fv(f, "power_station", live(com)))))) {
				rt.setAt(live(L), fmt("＀ (Active)", [(yield* g.call(f, P("/proc/get_area"), null, [rt.fv(f, "target", live(com))]))]), rt.fv(f, "target", live(com)));
			} else {
				rt.setAt(live(L), fmt("＀ (Inactive)", [(yield* g.call(f, P("/proc/get_area"), null, [rt.fv(f, "target", live(com))]))]), rt.fv(f, "target", live(com)));
			}
		}
	}
	rt.endFor(f, 0);
	turfs = rt.list();
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [null, 10, "orange", 1], rt.Args.Named)), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if ((rt.gt(rt.fv(f, "x", live(_T)), subtract(rt.fv(f, "maxx", rt.world()), 8)) || rt.lt(rt.fv(f, "x", live(_T)), 8))) {
			continue;
		}
		if ((rt.gt(rt.fv(f, "y", live(_T)), subtract(rt.fv(f, "maxy", rt.world()), 8)) || rt.lt(rt.fv(f, "y", live(_T)), 8))) {
			continue;
		}
		if (truthy(rt.gv(f, "noteleport", (A_5 = rt.fv(f, "loc", live(_T)))))) {
			continue;
		}
		turfs = rt.modify(live(turfs), live(_T), add);
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(turfs)))) {
		rt.setAt(live(L), "None (Dangerous)", rt.op(f, "PickUnweighted", [1], [live(turfs)]));
	}
	if (((!truthy((t1 = (yield* g.op(f, "Prompt", [1], [null, "Hand Teleporter", "Please select a teleporter to lock in on.", live(user), live(L)])))) || !isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(f.src))) || truthy((yield* g.callName(f, live(user), "incapacitated", []))))) {
		return live(f.dot);
	}
	if (rt.ge(rt.len(f, rt.sv(f, "active_portal_pairs")), rt.sv(f, "max_portal_pairs"))) {
		yield* g.callName(f, live(user), "show_message", [fmt("<span class='notice'>＄！ is recharging!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	_T_5 = rt.index(live(L), live(t1));
	if (truthy(rt.gv(f, "noteleport", (A_6 = (yield* g.call(f, P("/proc/get_area"), null, [live(_T_5)])))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＄！ is malfunctioning.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "show_message", ["<span class='notice'>Locked In.</span>", 2]);
	if (!isEqual(rt.length((created = (yield* g.call(f, P("/proc/create_portal_pair"), null, [live(current_location), (yield* g.call(f, P("/proc/get_teleport_turf"), null, [rt.getStep(f, live(_T_5), 0)])), live(f.src), 300, 1])))), 2)) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/try_move_adjacent"), null, [rt.index(live(created), 1)]);
	rt.setAt(rt.sv(f, "active_portal_pairs"), rt.index(live(created), 1), rt.index(live(created), 2));
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/hand_tele/proc/on_portal_destroy  (code/game/objects/items/weapons/teleportation.dm:205)
rt.def("/obj/item/weapon/hand_tele/proc/on_portal_destroy", function on_portal_destroy(f: Frame, _P: Value) {
	(rt.modSrcVar(f, "active_portal_pairs", live(_P), subtract));
	return f.dot;
});

// /obj/item/weapon/hand_tele/proc/is_parent_of_portal  (code/game/objects/items/weapons/teleportation.dm:208)
rt.def("/obj/item/weapon/hand_tele/proc/is_parent_of_portal", function is_parent_of_portal(f: Frame, _P: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	if (!truthy((rt.istype(live(_P), T("/obj/effect/portal")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(rt.index(rt.sv(f, "active_portal_pairs"), live(_P)))) {
		return 1;
	}
	i = null;
	rt.forList(f, 0, rt.sv(f, "active_portal_pairs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (isEqual(rt.index(rt.sv(f, "active_portal_pairs"), live(i)), live(_P))) {
			return 2;
		}
	}
	rt.endFor(f, 0);
	return 0;
});
