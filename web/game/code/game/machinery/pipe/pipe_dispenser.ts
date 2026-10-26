// From code/game/machinery/pipe/pipe_dispenser.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10867, "/obj/machinery/pipedispenser", "/obj/machinery", {
	wait: 0,
	anchored: 1,
	name: "pipe dispenser",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "pipe_d",
	density: 1,
});

// /obj/machinery/pipedispenser/proc/attack_paw  (code/game/machinery/pipe/pipe_dispenser.dm:10)  may sleep
rt.def("/obj/machinery/pipedispenser/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/pipedispenser/proc/attack_hand  (code/game/machinery/pipe/pipe_dispenser.dm:13)  may sleep
rt.def("/obj/machinery/pipedispenser/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	dat = fmt("\n<b>Regular pipes:</b><BR>\n<A href='?src=＃;make=＀;dir=1'>Pipe</A><BR>\n<A href='?src=＃;make=＀;dir=5'>Bent Pipe</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Manifold</A><BR>\n<A href='?src=＃;make=＀;dir=1'>4-Way Manifold</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Manual Valve</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Digital Valve</A><BR>\n<b>Devices:</b><BR>\n<A href='?src=＃;make=＀;dir=1'>Connector</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Vent</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Gas Pump</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Passive Gate</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Volume Pump</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Scrubber</A><BR>\n<A href='?src=＃;makemeter=1'>Meter</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Gas Filter</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Gas Mixer</A><BR>\n<b>Heat exchange:</b><BR>\n<A href='?src=＃;make=＀;dir=1'>Pipe</A><BR>\n<A href='?src=＃;make=＀;dir=5'>Bent Pipe</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Manifold</A><BR>\n<A href='?src=＃;make=＀;dir=1'>4-Way Manifold</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Junction</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Heat Exchanger</A><BR>\n", [live(f.src), T("/obj/machinery/atmospherics/pipe/simple"), live(f.src), T("/obj/machinery/atmospherics/pipe/simple"), live(f.src), T("/obj/machinery/atmospherics/pipe/manifold"), live(f.src), T("/obj/machinery/atmospherics/pipe/manifold4w"), live(f.src), T("/obj/machinery/atmospherics/components/binary/valve"), live(f.src), T("/obj/machinery/atmospherics/components/binary/valve/digital"), live(f.src), T("/obj/machinery/atmospherics/components/unary/portables_connector"), live(f.src), T("/obj/machinery/atmospherics/components/unary/vent_pump"), live(f.src), T("/obj/machinery/atmospherics/components/binary/pump"), live(f.src), T("/obj/machinery/atmospherics/components/binary/passive_gate"), live(f.src), T("/obj/machinery/atmospherics/components/binary/volume_pump"), live(f.src), T("/obj/machinery/atmospherics/components/unary/vent_scrubber"), live(f.src), live(f.src), T("/obj/machinery/atmospherics/components/trinary/filter"), live(f.src), T("/obj/machinery/atmospherics/components/trinary/mixer"), live(f.src), T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple"), live(f.src), T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple"), live(f.src), T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold"), live(f.src), T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w"), live(f.src), T("/obj/machinery/atmospherics/pipe/heat_exchanging/junction"), live(f.src), T("/obj/machinery/atmospherics/components/unary/heat_exchanger")]);
	rt.op(f, "Browse", [], [live(f.args[0]), fmt("<HEAD><TITLE>＀</TITLE></HEAD><TT>＀</TT>", [live(f.src), live(dat)]), "window=pipedispenser"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(f.args[0]), "pipedispenser"]);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/pipedispenser/proc/Topic  (code/game/machinery/pipe/pipe_dispenser.dm:48)  may sleep
rt.def("/obj/machinery/pipedispenser/proc/Topic", function* Topic(f: Frame) {
	let p_type: Value = null, p_dir: Value = null, _P: Value = null;
	f.vars = () => [p_type, p_dir, _P];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if (((((!truthy(rt.sv(f, "anchored")) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.fv(f, "stat", live(f.usr)))) || truthy((yield* g.callName(f, live(f.usr), "restrained", [])))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "loc"), live(f.usr)])), 1))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=pipedispenser"], false);
		return 1;
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	if (truthy(rt.at(live(f.args[1]), "make"))) {
		if (rt.lt(rt.sv(f, "wait"), rt.worldTime(f))) {
			p_type = (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "make")])); if (!rt.isIn(f, live(p_type), rt.gl("pipe_types"))) return 1; // tg's own hole: make= took any type path, and wrenching the fitting created it
			p_dir = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "dir")]));
			yield* g.callName(f, (_P = (yield* g.new_(f, T("/obj/item/pipe"), [null, rt.fv(f, "loc", live(f.src)), "pipe_type", live(p_type), "dir", live(p_dir)], rt.Args.Named))), "add_fingerprint", [live(f.usr)]);
			rt.setSv(f, "wait", add(rt.worldTime(f), 10));
		}
	}
	if (truthy(rt.at(live(f.args[1]), "makemeter"))) {
		if (rt.lt(rt.sv(f, "wait"), rt.worldTime(f))) {
			yield* g.new_(f, T("/obj/item/pipe_meter"), [rt.fv(f, "loc", live(f.src))]);
			rt.setSv(f, "wait", add(rt.worldTime(f), 15));
		}
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/pipedispenser/proc/attackby  (code/game/machinery/pipe/pipe_dispenser.dm:69)  may sleep
rt.def("/obj/machinery/pipedispenser/proc/attackby", function* attackby(f: Frame) {
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/pipe")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/pipe_meter")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You put ＀ back into ＀.</span>", [live(f.args[0]), live(f.src)])]);
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			if ((!truthy(rt.sv(f, "anchored")) && !truthy((yield* g.srcCall(f, "isinspace"))))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin to fasten ％！ to the floor...</span>", [live(f.src)])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ fastens ％！.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You fasten ％！. Now it can dispense pipes.</span>", [live(f.src)]), "<span class='italics'>You hear ratchet.</span>"]);
					rt.setSv(f, "anchored", 1);
					(rt.modSrcVar(f, "stat", 8, rt.bitAnd));
					if (isEqual(rt.fv(f, "machine", live(f.usr)), live(f.src))) {
						rt.op(f, "Browse", [], [live(f.usr), null, "window=pipedispenser"], false);
					}
				}
			} else {
				if (truthy(rt.sv(f, "anchored"))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin to unfasten ％！ from the floor...</span>", [live(f.src)])]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
						yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ unfastens ％！.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You unfasten ％！. Now it can be pulled somewhere else.</span>", [live(f.src)]), "<span class='italics'>You hear ratchet.</span>"]);
						rt.setSv(f, "anchored", 0);
						(rt.modSrcVar(f, "stat", 16777207, rt.bitOr));
						yield* g.srcCall(f, "power_change");
					}
				}
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(10868, "/obj/machinery/pipedispenser/disposal", "/obj/machinery/pipedispenser", {
	anchored: 1,
	name: "disposal pipe dispenser",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "pipe_d",
	density: 1,
});

// /obj/machinery/pipedispenser/disposal/proc/MouseDrop_T  (code/game/machinery/pipe/pipe_dispenser.dm:124)  may sleep
rt.def("/obj/machinery/pipedispenser/disposal/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, pipe: Value, usr: Value) {
	f.vars = () => [pipe, usr];
	if (((!truthy(rt.fv(f, "canmove", live(usr))) || truthy(rt.fv(f, "stat", live(usr)))) || truthy((yield* g.callName(f, live(usr), "restrained", []))))) {
		return live(f.dot);
	}
	if (((!truthy((rt.istype(live(pipe), T("/obj/structure/disposalconstruct")) ? 1 : 0)) && !truthy((rt.istype(live(pipe), T("/obj/structure/c_transit_tube")) ? 1 : 0))) && !truthy((rt.istype(live(pipe), T("/obj/structure/c_transit_tube_pod")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if ((rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(usr), live(f.src)])), 1) || rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(pipe)])), 1))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "anchored", live(pipe)))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(pipe)]);
	return f.dot;
}, true);

// /obj/machinery/pipedispenser/disposal/proc/attack_hand  (code/game/machinery/pipe/pipe_dispenser.dm:139)  may sleep
rt.def("/obj/machinery/pipedispenser/disposal/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	dat = fmt("<b>Disposal Pipes</b><br><br>\n<A href='?src=＃;dmake=＀'>Pipe</A><BR>\n<A href='?src=＃;dmake=＀'>Bent Pipe</A><BR>\n<A href='?src=＃;dmake=＀'>Junction</A><BR>\n<A href='?src=＃;dmake=＀'>Y-Junction</A><BR>\n<A href='?src=＃;dmake=＀'>Trunk</A><BR>\n<A href='?src=＃;dmake=＀'>Bin</A><BR>\n<A href='?src=＃;dmake=＀'>Outlet</A><BR>\n<A href='?src=＃;dmake=＀'>Chute</A><BR>\n<A href='?src=＃;dmake=＀'>Sort Junction</A><BR>\n", [live(f.src), 0, live(f.src), 1, live(f.src), 2, live(f.src), 4, live(f.src), 5, live(f.src), 6, live(f.src), 7, live(f.src), 8, live(f.src), 9]);
	rt.op(f, "Browse", [], [live(f.args[0]), fmt("<HEAD><TITLE>＀</TITLE></HEAD><TT>＀</TT>", [live(f.src), live(dat)]), "window=pipedispenser"], false);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/pipedispenser/disposal/proc/Topic  (code/game/machinery/pipe/pipe_dispenser.dm:159)  may sleep
rt.def("/obj/machinery/pipedispenser/disposal/proc/Topic", function* Topic(f: Frame) {
	let p_type: Value = null, C: Value = null;
	f.vars = () => [p_type, C];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	if (truthy(rt.at(live(f.args[1]), "dmake"))) {
		if (rt.lt(rt.sv(f, "wait"), rt.worldTime(f))) {
			p_type = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "dmake")]));
			if (!truthy((yield* g.callName(f, (C = (yield* g.new_(f, T("/obj/structure/disposalconstruct"), [rt.fv(f, "loc", live(f.src)), live(p_type)]))), "can_place", [])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>There's not enough room to build that here!</span>"]);
				yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
				return live(f.dot);
			}
			yield* g.callName(f, live(C), "add_fingerprint", [live(f.usr)]);
			yield* g.callName(f, live(C), "update_icon", []);
			rt.setSv(f, "wait", add(rt.worldTime(f), 15));
		}
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

rt.type(10869, "/obj/machinery/pipedispenser/disposal/transit_tube", "/obj/machinery/pipedispenser/disposal", {
	anchored: 1,
	name: "transit tube dispenser",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "pipe_d",
	density: 1,
});

// /obj/machinery/pipedispenser/disposal/transit_tube/proc/attack_hand  (code/game/machinery/pipe/pipe_dispenser.dm:188)  may sleep
rt.def("/obj/machinery/pipedispenser/disposal/transit_tube/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	dat = fmt("<B>Transit Tubes:</B><BR>\n<A href='?src=＃;tube=＀'>Straight Tube</A><BR>\n<A href='?src=＃;tube=＀'>Straight Tube with Crossing</A><BR>\n<A href='?src=＃;tube=＀'>Curved Tube</A><BR>\n<A href='?src=＃;tube=＀'>Diagonal Tube</A><BR>\n<A href='?src=＃;tube=＀'>Diagonal Tube with Crossing</A><BR>\n<A href='?src=＃;tube=＀'>Junction</A><BR>\n<b>Station Equipment:</b><BR>\n<A href='?src=＃;tube=＀'>Through Tube Station</A><BR>\n<A href='?src=＃;tube=＀'>Terminus Tube Station</A><BR>\n<A href='?src=＃;tube=＀'>Transit Tube Pod</A><BR>\n", [live(f.src), 0, live(f.src), 1, live(f.src), 2, live(f.src), 3, live(f.src), 4, live(f.src), 5, live(f.src), 6, live(f.src), 7, live(f.src), 8]);
	rt.op(f, "Browse", [], [live(f.args[0]), fmt("<HEAD><TITLE>＀</TITLE></HEAD><TT>＀</TT>", [live(f.src), live(dat)]), "window=pipedispenser"], false);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/pipedispenser/disposal/transit_tube/proc/Topic  (code/game/machinery/pipe/pipe_dispenser.dm:209)  may sleep
rt.def("/obj/machinery/pipedispenser/disposal/transit_tube/proc/Topic", function* Topic(f: Frame) {
	let tube_type: Value = null, C: Value = null;
	let $0: any;
	f.vars = () => [tube_type, C, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	if (rt.lt(rt.sv(f, "wait"), rt.worldTime(f))) {
		if (truthy(rt.at(live(f.args[1]), "tube"))) {
			tube_type = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "tube")]));
			C = null;
			$0 = live(tube_type);
			if ($0 === 0) {
				C = (yield* g.new_(f, T("/obj/structure/c_transit_tube"), [rt.sv(f, "loc")]));
			} else if ($0 === 1) {
				C = (yield* g.new_(f, T("/obj/structure/c_transit_tube/crossing"), [rt.sv(f, "loc")]));
			} else if ($0 === 2) {
				C = (yield* g.new_(f, T("/obj/structure/c_transit_tube/curved"), [rt.sv(f, "loc")]));
			} else if ($0 === 3) {
				C = (yield* g.new_(f, T("/obj/structure/c_transit_tube/diagonal"), [rt.sv(f, "loc")]));
			} else if ($0 === 4) {
				C = (yield* g.new_(f, T("/obj/structure/c_transit_tube/diagonal/crossing"), [rt.sv(f, "loc")]));
			} else if ($0 === 5) {
				C = (yield* g.new_(f, T("/obj/structure/c_transit_tube/junction"), [rt.sv(f, "loc")]));
			} else if ($0 === 6) {
				C = (yield* g.new_(f, T("/obj/structure/c_transit_tube/station"), [rt.sv(f, "loc")]));
			} else if ($0 === 7) {
				C = (yield* g.new_(f, T("/obj/structure/c_transit_tube/station/reverse"), [rt.sv(f, "loc")]));
			} else if ($0 === 8) {
				C = (yield* g.new_(f, T("/obj/structure/c_transit_tube_pod"), [rt.sv(f, "loc")]));
			}
			if (truthy(live(C))) {
				yield* g.callName(f, live(C), "add_fingerprint", [live(f.usr)]);
			}
			rt.setSv(f, "wait", add(rt.worldTime(f), 15));
		}
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });
