// From code/game/machinery/hologram.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10796, "/obj/machinery/holopad", "/obj/machinery", {
	masters: null,
	last_request: 0,
	holo_range: 5,
	temp: "",
	holo_calls: null,
	outgoing_call: null,
	flags: 16,
	anchored: 1,
	name: "holopad",
	desc: "It's a floor-mounted device for projecting holographic images.",
	icon_state: "holopad0",
	layer: 2.5,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 100,
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
}, { global: { force_answer_call: 757, holopads: 758 } });

// /obj/machinery/holopad/proc/<init>  (code/game/machinery/hologram.dm:44)
rt.def("/obj/machinery/holopad/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "masters", rt.list());
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 20, "laser", 20, "energy", 20, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 0]));
	return f.dot;
});

// /obj/machinery/holopad/proc/Initialize  (code/game/machinery/hologram.dm:54)  may sleep
rt.def("/obj/machinery/holopad/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/holopad"), [null]))), "apply_default_parts", [live(f.src)]);
	rt.modGl("holopads", live(f.src), add);
	return f.dot;
}, true);

// /obj/machinery/holopad/proc/Destroy  (code/game/machinery/hologram.dm:61)  may sleep
rt.def("/obj/machinery/holopad/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null, HC: Value = null;
	let $e: any;
	f.vars = () => [I, HC, $e];
	if (truthy(rt.sv(f, "outgoing_call"))) {
		yield* g.callName(f, rt.sv(f, "outgoing_call"), "ConnectionFailure", [live(f.src)]);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "holo_calls"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, (HC = live(I)), "ConnectionFailure", [live(f.src)]);
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, rt.sv(f, "masters"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.srcCall(f, "clear_holo", live(I));
	}
	rt.endFor(f, 0);
	(rt.modGl("holopads", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/holopad/proc/power_change  (code/game/machinery/hologram.dm:73)  may sleep
rt.def("/obj/machinery/holopad/proc/power_change", function* power_change(f: Frame) {
	if (truthy((yield* g.srcCall(f, "powered")))) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
		if (!truthy(rt.sv(f, "outgoing_call"))) return f.dot;
		yield* g.callName(f, rt.sv(f, "outgoing_call"), "ConnectionFailure", [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/machinery/holopad/proc/obj_break  (code/game/machinery/hologram.dm:81)  may sleep
rt.def("/obj/machinery/holopad/proc/obj_break", function* obj_break(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "outgoing_call"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "outgoing_call"), "ConnectionFailure", [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/holopad/proc/RefreshParts  (code/game/machinery/hologram.dm:87)
rt.def("/obj/machinery/holopad/proc/RefreshParts", function RefreshParts(f: Frame) {
	let holograph_range: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [holograph_range, B, $e];
	holograph_range = 4;
	B = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/capacitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		holograph_range = rt.modify(live(holograph_range), multiply(1, rt.fv(f, "rating", live(B))), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "holo_range", live(holograph_range));
	return f.dot;
});

// /obj/machinery/holopad/proc/attackby  (code/game/machinery/hologram.dm:92)  may sleep
rt.def("/obj/machinery/holopad/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "holopad_open", "holopad0", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["P", "user", "params"] });

// /obj/machinery/holopad/proc/AltClick  (code/game/machinery/hologram.dm:109)  may sleep
rt.def("/obj/machinery/holopad/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "hangup_all_calls");
	return live(f.dot);
}, true);

// /obj/machinery/holopad/proc/interact  (code/game/machinery/hologram.dm:114)  may sleep
rt.def("/obj/machinery/holopad/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, one_answered_call: Value = null, one_unanswered_call: Value = null, I: Value = null, HC: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, dat, one_answered_call, one_unanswered_call, I, HC, popup, $e];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (((truthy(rt.sv(f, "outgoing_call")) || truthy((yield* g.callName(f, live(user), "incapacitated", [])))) || !truthy((yield* g.srcCall(f, "is_operational"))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = null;
	if (truthy(rt.sv(f, "temp"))) {
		dat = rt.sv(f, "temp");
	} else {
		dat = fmt("<a href='?src=＃;AIrequest=1'>Request an AI's presence.</a><br>", [live(f.src)]);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;Holocall=1'>Call another holopad.</a><br>", [live(f.src)]), add);
		if (truthy(rt.length(rt.sv(f, "holo_calls")))) {
			dat = rt.modify(live(dat), "=====================================================<br>", add);
		}
		one_answered_call = 0;
		one_unanswered_call = 0;
		I = null;
		rt.forList(f, 0, rt.sv(f, "holo_calls"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (!isEqual(rt.gv(f, "connected_holopad", (HC = live(I))), live(f.src))) {
				dat = rt.modify(live(dat), fmt("<a href='?src=＃;connectcall=＃'>Answer call from ＀.</a><br>", [live(f.src), live(HC), (yield* g.call(f, P("/proc/get_area"), null, [rt.fv(f, "calling_holopad", live(HC))]))]), add);
				one_unanswered_call = 1;
			} else {
				one_answered_call = 1;
			}
		}
		rt.endFor(f, 0);
		if ((truthy(live(one_answered_call)) && truthy(live(one_unanswered_call)))) {
			dat = rt.modify(live(dat), "=====================================================<br>", add);
		}
		I = null;
		rt.forList(f, 0, rt.sv(f, "holo_calls"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (isEqual(rt.gv(f, "connected_holopad", (HC = live(I))), live(f.src))) {
				dat = rt.modify(live(dat), fmt("<a href='?src=＃;disconnectcall=＃'>Disconnect call from ＀.</a><br>", [live(f.src), live(HC), rt.fv(f, "user", live(HC))]), add);
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "holopad", rt.sv(f, "name"), 300, 130]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/holopad/proc/hangup_all_calls  (code/game/machinery/hologram.dm:157)  may sleep
rt.def("/obj/machinery/holopad/proc/hangup_all_calls", function* hangup_all_calls(f: Frame) {
	let I: Value = null, HC: Value = null;
	let $e: any;
	f.vars = () => [I, HC, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "holo_calls"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, (HC = live(I)), "Disconnect", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/holopad/proc/Topic  (code/game/machinery/hologram.dm:162)  may sleep
rt.def("/obj/machinery/holopad/proc/Topic", function* Topic(f: Frame) {
	let area: Value = null, AI: Value = null, callnames: Value = null, I: Value = null, A: Value = null, result: Value = null, call_to_connect: Value = null, call_to_disconnect: Value = null;
	let $e: any;
	f.vars = () => [area, AI, callnames, I, A, result, call_to_connect, call_to_disconnect, $e];
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	if (!truthy((yield* g.srcCall(f, "is_operational")))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "AIrequest"))) {
		if (rt.lt(add(rt.sv(f, "last_request"), 200), rt.worldTime(f))) {
			rt.setSv(f, "last_request", rt.worldTime(f));
			rt.setSv(f, "temp", "You requested an AI's presence.<BR>");
			rt.modSrcVar(f, "temp", fmt("<A href='?src=＃;mainmenu=1'>Main Menu</A>", [live(f.src)]), add);
			area = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
			AI = null;
			rt.forList(f, 0, rt.gl("silicon_mobs"), T("/mob/living/silicon/ai"));
			while (($e = rt.next(f, 0)) !== undefined) {
				AI = $e;
				if (!truthy(rt.fv(f, "client", live(AI)))) {
					continue;
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(AI), fmt("<span class='info'>Your presence is requested at <a href='?src=＃;jumptoholopad=＃'>％！</a>.</span>", [live(AI), live(f.src), live(area)])]);
			}
			rt.endFor(f, 0);
		} else {
			rt.setSv(f, "temp", "A request for AI presence was already sent recently.<BR>");
			rt.modSrcVar(f, "temp", fmt("<A href='?src=＃;mainmenu=1'>Main Menu</A>", [live(f.src)]), add);
		}
	} else {
		if (truthy(rt.at(live(f.args[1]), "Holocall"))) {
			if (truthy(rt.sv(f, "outgoing_call"))) {
				return live(f.dot);
			}
			rt.setSv(f, "temp", "You must stand on the holopad to make a call!<br>");
			rt.modSrcVar(f, "temp", fmt("<A href='?src=＃;mainmenu=1'>Main Menu</A>", [live(f.src)]), add);
			if (isEqual(rt.fv(f, "loc", live(f.usr)), rt.sv(f, "loc"))) {
				callnames = rt.list();
				I = null;
				rt.forList(f, 0, rt.gl("holopads"));
				while (($e = rt.next(f, 0)) !== undefined) {
					I = $e;
					if (truthy((A = (yield* g.call(f, P("/proc/get_area"), null, [live(I)]))))) {
						if (!truthy(rt.index(live(callnames), live(A)))) {
							rt.setAt(live(callnames), live(A), rt.list());
						}
						rt.modAt(live(callnames), live(A), live(I), add);
					}
				}
				rt.endFor(f, 0);
				(callnames = rt.modify(live(callnames), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), subtract));
				result = (yield* g.op(f, "Prompt", [1], [null, "Holocall", "Choose an area to call", live(f.usr), live(callnames)]));
				if ((((!truthy(live(f.usr)) || truthy(rt.fv(f, "gc_destroyed", live(f.usr)))) || !truthy(live(result))) || truthy(rt.sv(f, "outgoing_call")))) {
					return live(f.dot);
				}
				if (isEqual(rt.fv(f, "loc", live(f.usr)), rt.sv(f, "loc"))) {
					rt.setSv(f, "temp", "Dialing...<br>");
					rt.modSrcVar(f, "temp", fmt("<A href='?src=＃;mainmenu=1'>Main Menu</A>", [live(f.src)]), add);
					yield* g.new_(f, T("/datum/holocall"), [live(f.usr), live(f.src), rt.index(live(callnames), live(result))]);
				}
			}
		} else {
			if (truthy(rt.at(live(f.args[1]), "connectcall"))) {
				if (!(!truthy((call_to_connect = rt.locateIn(f, rt.at(live(f.args[1]), "connectcall"), rt.world()))) || truthy(rt.fv(f, "gc_destroyed", live(call_to_connect))))) {
					yield* g.callName(f, live(call_to_connect), "Answer", [live(f.src)]);
				}
				rt.setSv(f, "temp", "");
			} else {
				if (truthy(rt.at(live(f.args[1]), "disconnectcall"))) {
					if (!(!truthy((call_to_disconnect = rt.locateIn(f, rt.at(live(f.args[1]), "disconnectcall"), rt.world()))) || truthy(rt.fv(f, "gc_destroyed", live(call_to_disconnect))))) {
						yield* g.callName(f, live(call_to_disconnect), "Disconnect", [live(f.src)]);
					}
					rt.setSv(f, "temp", "");
				} else {
					if (truthy(rt.at(live(f.args[1]), "mainmenu"))) {
						rt.setSv(f, "temp", "");
						if (truthy(rt.sv(f, "outgoing_call"))) {
							yield* g.callName(f, rt.sv(f, "outgoing_call"), "Disconnect", []);
						}
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "updateDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/holopad/proc/attack_ai  (code/game/machinery/hologram.dm:225)  may sleep
rt.def("/obj/machinery/holopad/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!isEqual(rt.gv(f, "loc", rt.fv(f, "eyeobj", live(user))), rt.fv(f, "loc", live(f.src)))) {
		yield* g.callName(f, rt.fv(f, "eyeobj", live(user)), "setLoc", [rt.getStep(f, live(f.src), 0)]);
	} else {
		if (!truthy(rt.index(rt.sv(f, "masters"), live(user)))) {
			yield* g.srcCall(f, "activate_holo", live(user));
		} else {
			yield* g.srcCall(f, "clear_holo", live(user));
		}
	}
	return f.dot;
}, true);

// /obj/machinery/holopad/proc/process  (code/game/machinery/hologram.dm:238)  may sleep
rt.def("/obj/machinery/holopad/proc/process", function* process(f: Frame) {
	let I: Value = null, master: Value = null, AI: Value = null, pad_close: Value = null, h: Value = null, HC: Value = null;
	let $e: any;
	f.vars = () => [I, master, AI, pad_close, h, HC, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "masters"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		master = live(I);
		if (!truthy((rt.istype((AI = live(master)), T("/mob/living/silicon/ai")) ? 1 : 0))) {
			AI = null;
		}
		if ((((!(!truthy(live(master)) || truthy(rt.fv(f, "gc_destroyed", live(master)))) && !truthy((yield* g.callName(f, live(master), "incapacitated", [])))) && truthy(rt.fv(f, "client", live(master)))) && (!truthy(live(AI)) || truthy(rt.fv(f, "eyeobj", live(AI)))))) {
			if (truthy((yield* g.srcCall(f, "is_operational")))) {
				if (truthy(live(AI))) {
					if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.fv(f, "eyeobj", live(AI)), live(f.src)])), rt.sv(f, "holo_range"))) {
						continue;
					}
					if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [(pad_close = (yield* g.call(f, P("/proc/get_closest_atom"), null, [T("/obj/machinery/holopad"), rt.gl("holopads"), rt.fv(f, "eyeobj", live(AI))]))), rt.fv(f, "eyeobj", live(AI))])), rt.sv(f, "holo_range"))) {
						h = rt.index(rt.sv(f, "masters"), live(master));
						yield* g.srcCall(f, "unset_holo", live(master));
						yield* g.callName(f, live(pad_close), "set_holo", [live(master), live(h)]);
						continue;
					}
				} else {
					continue;
				}
			}
		}
		yield* g.srcCall(f, "clear_holo", live(master));
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "outgoing_call"))) {
		yield* g.callName(f, rt.sv(f, "outgoing_call"), "Check", []);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "holo_calls"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!isEqual(rt.gv(f, "connected_holopad", (HC = live(I))), live(f.src))) {
			if ((truthy(rt.gl("force_answer_call")) && rt.gt(rt.worldTime(f), add(rt.fv(f, "call_start_time", live(HC)), 100)))) {
				yield* g.callName(f, live(HC), "Answer", [live(f.src)]);
				break;
			}
			if (truthy(rt.sv(f, "outgoing_call"))) {
				yield* g.callName(f, live(HC), "Disconnect", [live(f.src)]);
			} else {
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/twobeep.ogg"), 100]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/holopad/proc/activate_holo  (code/game/machinery/hologram.dm:275)  may sleep
rt.def("/obj/machinery/holopad/proc/activate_holo", function* activate_holo(f: Frame, user: Value) {
	let AI: Value = null, Hologram: Value = null;
	f.vars = () => [user, AI, Hologram];
	if (!truthy((rt.istype((AI = live(user)), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		AI = null;
	}
	if ((truthy((yield* g.srcCall(f, "is_operational"))) && (!truthy(live(AI)) || isEqual(rt.gv(f, "loc", rt.fv(f, "eyeobj", live(AI))), rt.sv(f, "loc"))))) {
		if ((truthy(live(AI)) && truthy((rt.istype(rt.fv(f, "current", live(AI)), T("/obj/machinery/holopad")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>ERROR:</span>  Image feed in progress."]);
			return live(f.dot);
		}
		Hologram = (yield* g.new_(f, T("/obj/effect/overlay/holo_pad_hologram"), [rt.sv(f, "loc")]));
		if (truthy(live(AI))) {
			rt.setFv(f, "icon", live(Hologram), rt.fv(f, "holo_icon", live(AI)));
		} else {
			rt.setFv(f, "icon", live(Hologram), rt.fv(f, "icon", live(user)));
			rt.setFv(f, "icon_state", live(Hologram), rt.fv(f, "icon_state", live(user)));
			yield* g.callName(f, live(Hologram), "copy_overlays", [live(user), 1]);
			rt.setFv(f, "alpha", live(Hologram), 100);
			yield* g.callName(f, live(Hologram), "add_atom_colour", ["#77abff", 4]);
			rt.setFv(f, "Impersonation", live(Hologram), live(user));
		}
		yield* g.callName(f, live(Hologram), "copy_known_languages_from", [null, live(user), "replace", 1], rt.Args.Named);
		rt.setFv(f, "mouse_opacity", live(Hologram), 0);
		rt.setFv(f, "layer", live(Hologram), 5);
		rt.setFv(f, "anchored", live(Hologram), 1);
		rt.setFv(f, "name", live(Hologram), fmt("＀ (Hologram)", [rt.fv(f, "name", live(user))]));
		yield* g.callName(f, live(Hologram), "set_light", [2]);
		yield* g.srcCall(f, "set_holo", live(user), live(Hologram));
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>A holographic image of ＀ flickers to life before your eyes!</span>", [live(user)]));
		return live(Hologram);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>ERROR:</span> Unable to project hologram."]);
	}
	return f.dot;
}, true);

// /obj/machinery/holopad/proc/Hear  (code/game/machinery/hologram.dm:313)  may sleep
rt.def("/obj/machinery/holopad/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	let master: Value = null, I: Value = null, HC: Value = null;
	let $e: any;
	f.vars = () => [message, speaker, message_language, raw_message, radio_freq, spans, message_mode, master, I, HC, $e];
	if (((truthy(live(speaker)) && truthy(rt.len(f, rt.sv(f, "masters")))) && !truthy(live(radio_freq)))) {
		master = null;
		rt.forList(f, 0, rt.sv(f, "masters"), T("/mob/living/silicon/ai"));
		while (($e = rt.next(f, 0)) !== undefined) {
			master = $e;
			if ((truthy(rt.index(rt.sv(f, "masters"), live(master))) && !isEqual(live(speaker), live(master)))) {
				yield* g.callName(f, live(master), "relay_speech", [live(message), live(speaker), live(message_language), live(raw_message), live(radio_freq), live(spans), live(message_mode)]);
			}
		}
		rt.endFor(f, 0);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "holo_calls"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if ((isEqual(rt.gv(f, "connected_holopad", (HC = live(I))), live(f.src)) && !isEqual(live(speaker), rt.fv(f, "hologram", live(HC))))) {
			yield* g.callName(f, rt.fv(f, "user", live(HC)), "Hear", [live(message), live(speaker), live(message_language), live(raw_message), live(radio_freq), live(spans), live(message_mode)]);
		}
	}
	rt.endFor(f, 0);
	if (!(truthy(rt.sv(f, "outgoing_call")) && isEqual(live(speaker), rt.fv(f, "user", rt.sv(f, "outgoing_call"))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "hologram", rt.sv(f, "outgoing_call")), "say", [live(raw_message)]);
	return f.dot;
}, true);

// /obj/machinery/holopad/proc/SetLightsAndPower  (code/game/machinery/hologram.dm:327)
rt.def("/obj/machinery/holopad/proc/SetLightsAndPower", function SetLightsAndPower(f: Frame) {
	let total_users: Value = null;
	let $0: any;
	f.vars = () => [total_users, $0];
	if (rt.gt((total_users = add(rt.len(f, rt.sv(f, "masters")), rt.length(rt.sv(f, "holo_calls")))), 0)) {
		$0 = 2;
	} else {
		$0 = 1;
	}
	rt.setSv(f, "use_power", $0);
	rt.setSv(f, "active_power_usage", add(1, multiply(2, live(total_users))));
	if (truthy(live(total_users))) {
		rt.callSrc(f, "set_light", [2]);
		rt.setSv(f, "icon_state", "holopad1");
	} else {
		rt.callSrc(f, "set_light", [0]);
		rt.setSv(f, "icon_state", "holopad0");
	}
	return f.dot;
});

// /obj/machinery/holopad/proc/set_holo  (code/game/machinery/hologram.dm:339)
rt.def("/obj/machinery/holopad/proc/set_holo", function set_holo(f: Frame, user: Value, h: Value) {
	let AI: Value = null;
	f.vars = () => [AI];
	rt.setAt(rt.sv(f, "masters"), live(user), live(h));
	if (truthy((rt.istype((AI = live(user)), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		rt.setFv(f, "current", live(AI), live(f.src));
	}
	rt.callSrc(f, "SetLightsAndPower", []);
	return 1;
});

// /obj/machinery/holopad/proc/clear_holo  (code/game/machinery/hologram.dm:346)  may sleep
rt.def("/obj/machinery/holopad/proc/clear_holo", function* clear_holo(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/qdel"), null, [rt.index(rt.sv(f, "masters"), live(user))]);
	yield* g.srcCall(f, "unset_holo", live(user));
	return 1;
}, true);

// /obj/machinery/holopad/proc/unset_holo  (code/game/machinery/hologram.dm:351)
rt.def("/obj/machinery/holopad/proc/unset_holo", function unset_holo(f: Frame, user: Value) {
	let AI: Value = null;
	f.vars = () => [AI];
	if ((truthy((rt.istype((AI = live(user)), T("/mob/living/silicon/ai")) ? 1 : 0)) && isEqual(rt.fv(f, "current", live(AI)), live(f.src)))) {
		rt.setFv(f, "current", live(AI), null);
	}
	(rt.modSrcVar(f, "masters", live(user), subtract));
	rt.callSrc(f, "SetLightsAndPower", []);
	return 1;
});

// /obj/machinery/holopad/proc/move_hologram  (code/game/machinery/hologram.dm:359)  may sleep
rt.def("/obj/machinery/holopad/proc/move_hologram", function* move_hologram(f: Frame, user: Value, new_turf: Value) {
	let H: Value = null, holo_area: Value = null, eye_area: Value = null;
	f.vars = () => [user, new_turf, H, holo_area, eye_area];
	if (truthy(rt.index(rt.sv(f, "masters"), live(user)))) {
		yield* g.call(f, P("/proc/step_to"), null, [(H = rt.index(rt.sv(f, "masters"), live(user))), live(new_turf)]);
		rt.setFv(f, "loc", live(H), live(new_turf));
		holo_area = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
		if (!truthy((rt.isIn(f, (eye_area = rt.fv(f, "loc", live(new_turf))), rt.fv(f, "related", live(holo_area))) ? 1 : 0))) {
			yield* g.srcCall(f, "clear_holo", live(user));
		}
	}
	return 1;
}, true);

rt.type(11775, "/obj/effect/overlay/holo_pad_hologram", "/obj/effect/overlay", {
	Impersonation: null,
	HC: null,
});

// /obj/effect/overlay/holo_pad_hologram/proc/Destroy  (code/game/machinery/hologram.dm:377)  may sleep
rt.def("/obj/effect/overlay/holo_pad_hologram/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "Impersonation", null);
	if (truthy(rt.sv(f, "HC"))) {
		yield* g.callName(f, rt.sv(f, "HC"), "Disconnect", [rt.fv(f, "calling_holopad", rt.sv(f, "HC"))]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/overlay/holo_pad_hologram/proc/examine  (code/game/machinery/hologram.dm:385)  may sleep
rt.def("/obj/effect/overlay/holo_pad_hologram/proc/examine", function* examine(f: Frame) {
	if (truthy(rt.sv(f, "Impersonation"))) {
		return (yield* g.callName(f, rt.sv(f, "Impersonation"), "examine", [live(f.args[0])]));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user"] });

rt.type(6722, "/obj/item/weapon/circuitboard/machine/holopad", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "AI Holopad (Machine Board)",
	build_path: rt.typePath("/obj/machinery/holopad"),
	origin_tech: "programming=1",
});

// /obj/item/weapon/circuitboard/machine/holopad/proc/<init>  (code/game/machinery/hologram.dm:392)
rt.def("/obj/item/weapon/circuitboard/machine/holopad/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), 1]));
	return f.dot;
});
