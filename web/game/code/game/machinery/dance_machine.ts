// From code/game/machinery/dance_machine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10786, "/obj/machinery/disco", "/obj/machinery", {
	active: 0,
	rangers: null,
	charge: 35,
	stop: 0,
	spotlights: null,
	sparkles: null,
	selection: null,
	anchored: 0,
	verb_say: "states",
	name: "radiant dance machine mark IV",
	desc: "The first three prototypes were discontinued after mass casualty incidents.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "disco0",
	density: 1,
	req_access: null,
}, { global: { songs: 756 } });

// /obj/machinery/disco/proc/<init>  (code/game/machinery/dance_machine.dm:13)
rt.def("/obj/machinery/disco/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "rangers", rt.list());
	$0 = $0;
	rt.setSv(f, "spotlights", rt.list());
	$0 = $0;
	rt.setSv(f, "sparkles", rt.list());
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(10));
	return f.dot;
});

rt.type(1491, "/datum/track", "/datum", {
	song_name: "generic",
	song_path: null,
	song_length: 0,
	song_beat: 0,
	GBP_required: 0,
});

// /datum/track/proc/New  (code/game/machinery/dance_machine.dm:34)
rt.def("/datum/track/proc/New", function New(f: Frame, name: Value, path: Value, length: Value, beat: Value) {
	rt.setSv(f, "song_name", live(name));
	rt.setSv(f, "song_path", live(path));
	rt.setSv(f, "song_length", live(length));
	rt.setSv(f, "song_beat", live(beat));
	return f.dot;
});

// /obj/machinery/disco/proc/add_track  (code/game/machinery/dance_machine.dm:40)
rt.def("/obj/machinery/disco/proc/add_track", function add_track(f: Frame, file: Value, name: Value, length: Value, beat: Value) {
	let S: Value = null, _T: Value = null;
	f.vars = () => [name, length, beat, S, _T];
	if (!truthy((rt.istype((S = live(file)), T("/sound")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(live(name))) {
		name = fmt("＀", [live(file)]);
	}
	if (!truthy(live(beat))) {
		beat = 5;
	}
	if (!truthy(live(length))) {
		length = 2400;
	}
	rt.modGl("songs", (_T = rt.new_(f, T("/datum/track"), [live(name), live(file), live(length), live(beat)])), add);
	return f.dot;
});

// /obj/machinery/disco/proc/Initialize  (code/game/machinery/dance_machine.dm:53)  may sleep
rt.def("/obj/machinery/disco/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "selection", rt.index(rt.gl("songs"), 1));
	return f.dot;
}, true);

// /obj/machinery/disco/proc/Destroy  (code/game/machinery/dance_machine.dm:58)  may sleep
rt.def("/obj/machinery/disco/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "dance_over");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/disco/proc/attackby  (code/game/machinery/dance_machine.dm:62)  may sleep
rt.def("/obj/machinery/disco/proc/attackby", function* attackby(f: Frame) {
	if (!truthy(rt.sv(f, "active"))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			if ((!truthy(rt.sv(f, "anchored")) && !truthy((yield* g.srcCall(f, "isinspace"))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You secure the ＀ to the floor.</span>", [live(f.src)])]);
				rt.setSv(f, "anchored", 1);
			} else {
				if (truthy(rt.sv(f, "anchored"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You unsecure and disconnect the ＀.</span>", [live(f.src)])]);
					rt.setSv(f, "anchored", 0);
				}
			}
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/disco/proc/update_icon  (code/game/machinery/dance_machine.dm:76)
rt.def("/obj/machinery/disco/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "icon_state", "disco1");
	} else {
		rt.setSv(f, "icon_state", "disco0");
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/machinery/disco/proc/interact  (code/game/machinery/dance_machine.dm:83)  may sleep
rt.def("/obj/machinery/disco/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, dat, popup, $0, $1];
	if (!truthy(rt.sv(f, "anchored"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This device must be anchored by a wrench!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "allowed", live(user))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Error: Access Denied - Message: Only the engineering department can be trusted with this kind of power.</span>"]);
		yield* g.callName(f, live(user), "playsound_local", [live(f.src), rt.rsc("sound/misc/compiler-failure.ogg"), 25, 1]);
		return live(f.dot);
	}
	if ((!truthy((yield* g.srcCall(f, "Adjacent", live(user)))) && !truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = rt.list();
	dat = rt.modify(live(dat), "<div class='statusDisplay' style='text-align:center'>", add);
	$0 = live(f.src);
	if (!truthy(rt.sv(f, "active"))) {
		$1 = "BREAK IT DOWN";
	} else {
		$1 = "SHUT IT DOWN";
	}
	dat = rt.modify(live(dat), fmt("<b><A href='?src=＃;action=toggle'>＀<b></A><br>", [$0, $1]), add);
	dat = rt.modify(live(dat), "</div><br>", add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=select'> Select Track</A><br>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("Track Selected: ＀<br>", [rt.fv(f, "song_name", rt.sv(f, "selection"))]), add);
	dat = rt.modify(live(dat), fmt("Track Length: ＀ seconds<br><br>", [divide(rt.fv(f, "song_length", rt.sv(f, "selection")), 10)]), add);
	dat = rt.modify(live(dat), "<br>DJ's Soundboard:<b><br>", add);
	dat = rt.modify(live(dat), "<div class='statusDisplay'><div style='text-align:center'>", add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=horn'>Air Horn</A>  ", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=alert'>Station Alert</A>  ", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=siren'>Warning Siren</A>  ", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=honk'>Honk</A><br>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=pump'>Shotgun Pump</A>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=pop'>Gunshot</A>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=saber'>Esword</A>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=harm'>Harm Alarm</A>", [live(f.src)]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "vending", "Radiance Dance Machine - Mark IV", 400, 350]))), "set_content", [(yield* g.callName(f, live(dat), "Join", []))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/disco/proc/Topic  (code/game/machinery/dance_machine.dm:116)  may sleep
rt.def("/obj/machinery/disco/proc/Topic", function* Topic(f: Frame) {
	let available: Value = null, S: Value = null, selected: Value = null;
	let $0: any, $e: any;
	f.vars = () => [available, S, selected, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	$0 = rt.at(live(f.args[1]), "action");
	if ($0 === "toggle") {
		if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "active"))) {
			if (rt.gt(rt.sv(f, "stop"), rt.worldTime(f))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>Error: The device is still resetting from the last activation, it will be ready again in ＀ seconds.</span>", [(yield* g.call(f, P("/proc/round"), null, [divide(subtract(rt.sv(f, "stop"), rt.worldTime(f)), 10)]))])]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/misc/compiler-failure.ogg"), 50, 1]);
				return live(f.dot);
			}
			rt.setSv(f, "active", 1);
			yield* g.srcCall(f, "update_icon");
			yield* g.srcCall(f, "dance_setup");
			if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
				rt.setFv(f, "isprocessing", live(f.src), 1);
				rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
			}
			yield* g.srcCall(f, "lights_spin");
			yield* g.srcCall(f, "updateUsrDialog");
		} else {
			if (truthy(rt.sv(f, "active"))) {
				rt.setSv(f, "stop", 0);
				yield* g.srcCall(f, "updateUsrDialog");
			}
		}
	} else if ($0 === "select") {
		if (truthy(rt.sv(f, "active"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Error: You cannot change the song until the current one is over.</span>"]);
			return live(f.dot);
		}
		available = rt.list();
		S = null;
		rt.forList(f, 0, rt.gl("songs"), T("/datum/track"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			rt.setAt(live(available), rt.fv(f, "song_name", live(S)), live(S));
		}
		rt.endFor(f, 0);
		selected = (yield* g.op(f, "Prompt", [1], [null, "Track:", "Choose your song", live(f.usr), live(available)]));
		if ((((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || !truthy(live(selected))) || !truthy((rt.istype(rt.index(live(available), live(selected)), T("/datum/track")) ? 1 : 0)))) {
			return live(f.dot);
		}
		rt.setSv(f, "selection", rt.index(live(available), live(selected)));
		yield* g.srcCall(f, "updateUsrDialog");
	} else if ($0 === "horn") {
		yield* g.srcCall(f, "deejay", rt.rsc("sound/items/airhorn2.ogg"));
	} else if ($0 === "alert") {
		yield* g.srcCall(f, "deejay", rt.rsc("sound/misc/notice1.ogg"));
	} else if ($0 === "siren") {
		yield* g.srcCall(f, "deejay", rt.rsc("sound/machines/engine_alert1.ogg"));
	} else if ($0 === "honk") {
		yield* g.srcCall(f, "deejay", rt.rsc("sound/items/bikehorn.ogg"));
	} else if ($0 === "pump") {
		yield* g.srcCall(f, "deejay", rt.rsc("sound/weapons/shotgunpump.ogg"));
	} else if ($0 === "pop") {
		yield* g.srcCall(f, "deejay", rt.rsc("sound/weapons/gunshot3.ogg"));
	} else if ($0 === "saber") {
		yield* g.srcCall(f, "deejay", rt.rsc("sound/weapons/saberon.ogg"));
	} else if ($0 === "harm") {
		yield* g.srcCall(f, "deejay", rt.rsc("sound/ai/harmalarm.ogg"));
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/disco/proc/deejay  (code/game/machinery/dance_machine.dm:168)
rt.def("/obj/machinery/disco/proc/deejay", function deejay(f: Frame, S: Value) {
	if ((((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || !truthy(rt.sv(f, "active"))) || rt.lt(rt.sv(f, "charge"), 5))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>The device is not able to play more DJ sounds at this time.</span>"]);
		return live(f.dot);
	}
	(rt.modSrcVar(f, "charge", 5, subtract));
	rt.call(f, P("/proc/playsound"), null, [live(f.src), live(S), 300, 1]);
	return f.dot;
});

// /obj/machinery/disco/proc/dance_setup  (code/game/machinery/dance_machine.dm:175)  may sleep
rt.def("/obj/machinery/disco/proc/dance_setup", function* dance_setup(f: Frame) {
	let cen: Value = null, t: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [cen, t, L, $e];
	rt.setSv(f, "stop", add(rt.worldTime(f), rt.fv(f, "song_length", rt.sv(f, "selection"))));
	cen = rt.getStep(f, live(f.src), 0);
	rt.setFv(f, "loc", rt.gl("dview_mob"), rt.getStep(f, live(f.src), 0));
	rt.setFv(f, "see_invisible", rt.gl("dview_mob"), 20);
	t = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [3, rt.gl("dview_mob")])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if ((isEqual(rt.fv(f, "x", live(t)), rt.fv(f, "x", live(cen))) && rt.gt(rt.fv(f, "y", live(t)), rt.fv(f, "y", live(cen))))) {
			rt.setFv(f, "light_color", (L = (yield* g.new_(f, T("/obj/item/device/flashlight/spotlight"), [live(t)]))), "red");
			rt.setFv(f, "light_power", live(L), subtract(30, multiply((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)])), 8)));
			rt.setFv(f, "range", live(L), add(1, (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)]))));
			rt.modSrcVar(f, "spotlights", live(L), add);
			continue;
		}
		if ((isEqual(rt.fv(f, "x", live(t)), rt.fv(f, "x", live(cen))) && rt.lt(rt.fv(f, "y", live(t)), rt.fv(f, "y", live(cen))))) {
			rt.setFv(f, "light_color", (L = (yield* g.new_(f, T("/obj/item/device/flashlight/spotlight"), [live(t)]))), "purple");
			rt.setFv(f, "light_power", live(L), subtract(30, multiply((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)])), 8)));
			rt.setFv(f, "range", live(L), add(1, (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)]))));
			rt.modSrcVar(f, "spotlights", live(L), add);
			continue;
		}
		if ((rt.gt(rt.fv(f, "x", live(t)), rt.fv(f, "x", live(cen))) && isEqual(rt.fv(f, "y", live(t)), rt.fv(f, "y", live(cen))))) {
			rt.setFv(f, "light_color", (L = (yield* g.new_(f, T("/obj/item/device/flashlight/spotlight"), [live(t)]))), "#ffff00");
			rt.setFv(f, "light_power", live(L), subtract(30, multiply((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)])), 8)));
			rt.setFv(f, "range", live(L), add(1, (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)]))));
			rt.modSrcVar(f, "spotlights", live(L), add);
			continue;
		}
		if ((rt.lt(rt.fv(f, "x", live(t)), rt.fv(f, "x", live(cen))) && isEqual(rt.fv(f, "y", live(t)), rt.fv(f, "y", live(cen))))) {
			rt.setFv(f, "light_color", (L = (yield* g.new_(f, T("/obj/item/device/flashlight/spotlight"), [live(t)]))), "green");
			rt.setFv(f, "light_power", live(L), subtract(30, multiply((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)])), 8)));
			rt.setFv(f, "range", live(L), add(1, (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)]))));
			rt.modSrcVar(f, "spotlights", live(L), add);
			continue;
		}
		if (((isEqual(add(rt.fv(f, "x", live(t)), 1), rt.fv(f, "x", live(cen))) && isEqual(add(rt.fv(f, "y", live(t)), 1), rt.fv(f, "y", live(cen)))) || (isEqual(add(rt.fv(f, "x", live(t)), 2), rt.fv(f, "x", live(cen))) && isEqual(add(rt.fv(f, "y", live(t)), 2), rt.fv(f, "y", live(cen)))))) {
			rt.setFv(f, "light_color", (L = (yield* g.new_(f, T("/obj/item/device/flashlight/spotlight"), [live(t)]))), "sw");
			rt.setFv(f, "light_power", live(L), subtract(30, multiply((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)])), 8)));
			rt.setFv(f, "range", live(L), add(1.399999976158142, (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)]))));
			rt.modSrcVar(f, "spotlights", live(L), add);
			continue;
		}
		if (((isEqual(subtract(rt.fv(f, "x", live(t)), 1), rt.fv(f, "x", live(cen))) && isEqual(subtract(rt.fv(f, "y", live(t)), 1), rt.fv(f, "y", live(cen)))) || (isEqual(subtract(rt.fv(f, "x", live(t)), 2), rt.fv(f, "x", live(cen))) && isEqual(subtract(rt.fv(f, "y", live(t)), 2), rt.fv(f, "y", live(cen)))))) {
			rt.setFv(f, "light_color", (L = (yield* g.new_(f, T("/obj/item/device/flashlight/spotlight"), [live(t)]))), "ne");
			rt.setFv(f, "light_power", live(L), subtract(30, multiply((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)])), 8)));
			rt.setFv(f, "range", live(L), add(1.399999976158142, (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)]))));
			rt.modSrcVar(f, "spotlights", live(L), add);
			continue;
		}
		if (((isEqual(subtract(rt.fv(f, "x", live(t)), 1), rt.fv(f, "x", live(cen))) && isEqual(add(rt.fv(f, "y", live(t)), 1), rt.fv(f, "y", live(cen)))) || (isEqual(subtract(rt.fv(f, "x", live(t)), 2), rt.fv(f, "x", live(cen))) && isEqual(add(rt.fv(f, "y", live(t)), 2), rt.fv(f, "y", live(cen)))))) {
			rt.setFv(f, "light_color", (L = (yield* g.new_(f, T("/obj/item/device/flashlight/spotlight"), [live(t)]))), "se");
			rt.setFv(f, "light_power", live(L), subtract(30, multiply((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)])), 8)));
			rt.setFv(f, "range", live(L), add(1.399999976158142, (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)]))));
			rt.modSrcVar(f, "spotlights", live(L), add);
			continue;
		}
		if (((isEqual(add(rt.fv(f, "x", live(t)), 1), rt.fv(f, "x", live(cen))) && isEqual(subtract(rt.fv(f, "y", live(t)), 1), rt.fv(f, "y", live(cen)))) || (isEqual(add(rt.fv(f, "x", live(t)), 2), rt.fv(f, "x", live(cen))) && isEqual(subtract(rt.fv(f, "y", live(t)), 2), rt.fv(f, "y", live(cen)))))) {
			rt.setFv(f, "light_color", (L = (yield* g.new_(f, T("/obj/item/device/flashlight/spotlight"), [live(t)]))), "nw");
			rt.setFv(f, "light_power", live(L), subtract(30, multiply((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)])), 8)));
			rt.setFv(f, "range", live(L), add(1.399999976158142, (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)]))));
			rt.modSrcVar(f, "spotlights", live(L), add);
			continue;
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "loc", rt.gl("dview_mob"), null);
	return f.dot;
}, true);

// /obj/machinery/disco/proc/hierofunk  (code/game/machinery/dance_machine.dm:238)  may sleep
rt.def("/obj/machinery/disco/proc/hierofunk", function* hierofunk(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.call(f, P("/proc/spawn_atom_to_turf"), null, [T("/obj/effect/temp_visual/hierophant/telegraph/edge"), live(f.src), 1, 0]);
		yield* g.call(f, P("/proc/sleep"), null, [5]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/disco/proc/lights_spin  (code/game/machinery/dance_machine.dm:243)  may sleep
rt.def("/obj/machinery/disco/proc/lights_spin", function* lights_spin(f: Frame) {
	let i: Value = null, S: Value = null, reveal: Value = null, glow: Value = null;
	let $0: any, $e: any;
	f.vars = () => [i, S, reveal, glow, $0, $e];
	i = null;
	rt.forRange(f, 0, 1, 25, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || !truthy(rt.sv(f, "active")))) {
			return live(f.dot);
		}
		rt.setFv(f, "alpha", (S = (yield* g.new_(f, T("/obj/effect/overlay/sparkles"), [live(f.src)]))), 0);
		rt.modSrcVar(f, "sparkles", live(S), add);
		$0 = live(i);
		if (rt.inRange($0, 1, 8)) {
			yield* g.callName(f, live(S), "orbit", [live(f.src), 30, 1, 60, 36, 1, 0]);
		} else if (rt.inRange($0, 9, 16)) {
			yield* g.callName(f, live(S), "orbit", [live(f.src), 62, 1, 60, 36, 1, 0]);
		} else if (rt.inRange($0, 17, 24)) {
			yield* g.callName(f, live(S), "orbit", [live(f.src), 95, 1, 60, 36, 1, 0]);
		} else if ($0 === 25) {
			rt.setFv(f, "pixel_y", live(S), 7);
			yield* g.callName(f, live(S), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [7]);
	}
	rt.endFor(f, 0);
	if (isEqual(rt.fv(f, "song_name", rt.sv(f, "selection")), "Engineering's Ultimate High-Energy Hustle")) {
		yield* g.call(f, P("/proc/sleep"), null, [280]);
	}
	reveal = null;
	rt.forList(f, 0, rt.sv(f, "sparkles"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		reveal = $e;
		rt.setFv(f, "alpha", live(reveal), 255);
	}
	rt.endFor(f, 0);
	while (truthy(rt.sv(f, "active"))) {
		glow = null;
		rt.forList(f, 0, rt.sv(f, "spotlights"), T("/obj/item/device/flashlight/spotlight"));
		while (($e = rt.next(f, 0)) !== undefined) {
			glow = $e;
			if ((((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || !truthy(rt.sv(f, "active"))) || (!truthy(live(glow)) || truthy(rt.fv(f, "gc_destroyed", live(glow)))))) {
				return live(f.dot);
			}
			if (isEqual(rt.fv(f, "light_color", live(glow)), "red")) {
				rt.setFv(f, "light_color", live(glow), "nw");
				rt.setFv(f, "light_power", live(glow), multiply(rt.fv(f, "light_power", live(glow)), 1.4800000190734863));
				rt.setFv(f, "light_range", live(glow), 0);
				yield* g.callName(f, live(glow), "update_light", []);
				continue;
			}
			if (isEqual(rt.fv(f, "light_color", live(glow)), "nw")) {
				rt.setFv(f, "light_color", live(glow), "green");
				rt.setFv(f, "light_range", live(glow), multiply(rt.fv(f, "range", live(glow)), 1.100000023841858));
				rt.setFv(f, "light_power", live(glow), multiply(rt.fv(f, "light_power", live(glow)), 2));
				yield* g.callName(f, live(glow), "update_light", []);
				continue;
			}
			if (isEqual(rt.fv(f, "light_color", live(glow)), "green")) {
				rt.setFv(f, "light_color", live(glow), "sw");
				rt.setFv(f, "light_power", live(glow), multiply(rt.fv(f, "light_power", live(glow)), 0.5));
				rt.setFv(f, "light_range", live(glow), 0);
				yield* g.callName(f, live(glow), "update_light", []);
				continue;
			}
			if (isEqual(rt.fv(f, "light_color", live(glow)), "sw")) {
				rt.setFv(f, "light_color", live(glow), "purple");
				rt.setFv(f, "light_power", live(glow), multiply(rt.fv(f, "light_power", live(glow)), 2.2699999809265137));
				rt.setFv(f, "light_range", live(glow), multiply(rt.fv(f, "range", live(glow)), 1.149999976158142));
				yield* g.callName(f, live(glow), "update_light", []);
				continue;
			}
			if (isEqual(rt.fv(f, "light_color", live(glow)), "purple")) {
				rt.setFv(f, "light_color", live(glow), "se");
				rt.setFv(f, "light_power", live(glow), multiply(rt.fv(f, "light_power", live(glow)), 0.4399999976158142));
				rt.setFv(f, "light_range", live(glow), 0);
				yield* g.callName(f, live(glow), "update_light", []);
				continue;
			}
			if (isEqual(rt.fv(f, "light_color", live(glow)), "se")) {
				rt.setFv(f, "light_color", live(glow), "#ffff00");
				rt.setFv(f, "light_range", live(glow), multiply(rt.fv(f, "range", live(glow)), 0.8999999761581421));
				yield* g.callName(f, live(glow), "update_light", []);
				continue;
			}
			if (isEqual(rt.fv(f, "light_color", live(glow)), "#ffff00")) {
				rt.setFv(f, "light_color", live(glow), "ne");
				rt.setFv(f, "light_range", live(glow), 0);
				yield* g.callName(f, live(glow), "update_light", []);
				continue;
			}
			if (isEqual(rt.fv(f, "light_color", live(glow)), "ne")) {
				rt.setFv(f, "light_color", live(glow), "red");
				rt.setFv(f, "light_power", live(glow), multiply(rt.fv(f, "light_power", live(glow)), 0.6800000071525574));
				rt.setFv(f, "light_range", live(glow), multiply(rt.fv(f, "range", live(glow)), 0.8500000238418579));
				yield* g.callName(f, live(glow), "update_light", []);
				continue;
			}
		}
		rt.endFor(f, 0);
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/machinery/disco/proc/hierofunk")]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [rt.fv(f, "song_beat", rt.sv(f, "selection"))]);
	}
	return f.dot;
}, true);

// /obj/machinery/disco/proc/dance  (code/game/machinery/dance_machine.dm:321)  may sleep
rt.def("/obj/machinery/disco/proc/dance", function* dance(f: Frame, M: Value) {
	let $0: any;
	f.vars = () => [M, $0];
	$0 = (yield* g.call(f, P("/proc/rand"), null, [0, 9]));
	if (rt.inRange($0, 0, 1)) {
		yield* g.srcCall(f, "dance2", live(M));
	} else if (rt.inRange($0, 2, 3)) {
		yield* g.srcCall(f, "dance3", live(M));
	} else if (rt.inRange($0, 4, 6)) {
		yield* g.srcCall(f, "dance4", live(M));
	} else if (rt.inRange($0, 7, 9)) {
		yield* g.srcCall(f, "dance5", live(M));
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/disco/proc/dance2  (code/game/machinery/dance_machine.dm:332)  may sleep
rt.def("/obj/machinery/disco/proc/dance2", function* dance2(f: Frame, M: Value) {
	let i: Value = null, d: Value = null;
	let $e: any;
	f.vars = () => [M, i, d, $e];
	i = null;
	i = 1;
	while (rt.lt(live(i), 10)) {
		d = null;
		rt.forList(f, 0, rt.list(1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2));
		while (($e = rt.next(f, 0)) !== undefined) {
			d = $e;
			yield* g.callName(f, live(M), "setDir", [live(d)]);
			if (isEqual(live(i), 8)) {
				yield* g.callName(f, live(M), "emote", ["flip"]);
			}
			yield* g.call(f, P("/proc/sleep"), null, [1]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/sleep"), null, [20]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

// /obj/machinery/disco/proc/dance3  (code/game/machinery/dance_machine.dm:341)  may sleep
rt.def("/obj/machinery/disco/proc/dance3", function* dance3(f: Frame, M: Value) {
	let initial_matrix: Value = null, i: Value = null;
	let $0: any, $e: any;
	f.vars = () => [M, initial_matrix, i, $0, $e];
	initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]));
	i = null;
	rt.forRange(f, 0, 1, 75, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy(live(M))) {
			return live(f.dot);
		}
		$0 = live(i);
		if (rt.inRange($0, 1, 15)) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [0, 1]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		} else if (rt.inRange($0, 16, 30)) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [1, -1]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		} else if (rt.inRange($0, 31, 45)) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [-1, -1]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		} else if (rt.inRange($0, 46, 60)) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [-1, 1]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		} else if (rt.inRange($0, 61, 75)) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [1, 0]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		}
		yield* g.callName(f, live(M), "setDir", [(yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(M)), 90]))]);
		$0 = rt.fv(f, "dir", live(M));
		if ($0 === 1) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [0, 3]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		} else if ($0 === 2) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [0, -3]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		} else if ($0 === 4) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [3, 0]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		} else if ($0 === 8) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [-3, 0]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(M), "lying_fix", []);
	return f.dot;
}, true);

// /obj/machinery/disco/proc/dance4  (code/game/machinery/dance_machine.dm:389)  may sleep
rt.def("/obj/machinery/disco/proc/dance4", function* dance4(f: Frame, M: Value) {
	let speed: Value = null, time: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [M, speed, time, i, $e];
	speed = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
	time = 30;
	while (truthy(live(time))) {
		yield* g.call(f, P("/proc/sleep"), null, [live(speed)]);
		i = null;
		rt.forRange(f, 0, 1, live(speed), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.callName(f, live(M), "setDir", [rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
			yield* g.callName(f, live(M), "lay_down", [1]);
			time = rt.inc(live(time), -1);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/disco/proc/dance5  (code/game/machinery/dance_machine.dm:400)  may sleep
rt.def("/obj/machinery/disco/proc/dance5", function* dance5(f: Frame, M: Value) {
	let initial_matrix: Value = null, i: Value = null;
	let $0: any, $e: any;
	f.vars = () => [M, initial_matrix, i, $0, $e];
	rt.op(f, "Animate", [2, 8], [null, live(M), "transform", (yield* g.call(f, P("/proc/matrix"), null, [180, 5])), "time", 1, "loop", 0]);
	initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]));
	i = null;
	rt.forRange(f, 0, 1, 60, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy(live(M))) {
			return live(f.dot);
		}
		if (rt.lt(live(i), 31)) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [0, 1]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		}
		if (rt.gt(live(i), 30)) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [0, -1]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		}
		yield* g.callName(f, live(M), "setDir", [(yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(M)), 90]))]);
		$0 = rt.fv(f, "dir", live(M));
		if ($0 === 1) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [0, 3]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		} else if ($0 === 2) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [0, -3]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		} else if ($0 === 4) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [3, 0]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		} else if ($0 === 8) {
			yield* g.callName(f, (initial_matrix = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Translate", [-3, 0]);
			rt.op(f, "Animate", [2, 8], [null, live(M), "transform", live(initial_matrix), "time", 1, "loop", 0]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(M), "lying_fix", []);
	return f.dot;
}, true);

// /mob/living/proc/lying_fix  (code/game/machinery/dance_machine.dm:437)
rt.def("/mob/living/proc/lying_fix", function lying_fix(f: Frame) {
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", null, "time", 1, "loop", 0]);
	rt.setSv(f, "lying_prev", 0);
	return f.dot;
});

// /obj/machinery/disco/proc/dance_over  (code/game/machinery/dance_machine.dm:441)  may sleep
rt.def("/obj/machinery/disco/proc/dance_over", function* dance_over(f: Frame) {
	let SL: Value = null, SP: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [SL, SP, L, $e];
	SL = null;
	rt.forList(f, 0, rt.sv(f, "spotlights"), T("/obj/item/device/flashlight/spotlight"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SL = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(SL)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "spotlights"), "Cut", []);
	SP = null;
	rt.forList(f, 0, rt.sv(f, "sparkles"), T("/obj/effect/overlay/sparkles"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SP = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(SP)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "sparkles"), "Cut", []);
	L = null;
	rt.forList(f, 0, rt.sv(f, "rangers"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((!truthy(live(L)) || !truthy(rt.fv(f, "client", live(L))))) {
			continue;
		}
		yield* g.callName(f, live(L), "stop_sound_channel", [1021]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "rangers", rt.list());
	return f.dot;
}, true);

// /obj/machinery/disco/proc/process  (code/game/machinery/dance_machine.dm:456)  may sleep
rt.def("/obj/machinery/disco/proc/process", function* process(f: Frame) {
	let M: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [M, L, $e];
	if (rt.lt(rt.sv(f, "charge"), 35)) {
		rt.modSrcVar(f, "charge", 1, add);
	}
	if ((rt.lt(rt.worldTime(f), rt.sv(f, "stop")) && truthy(rt.sv(f, "active")))) {
		M = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [10, live(f.src)])), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (!truthy((rt.isIn(f, live(M), rt.sv(f, "rangers")) ? 1 : 0))) {
				rt.setAt(rt.sv(f, "rangers"), live(M), 1);
				yield* g.callName(f, live(M), "playsound_local", [null, rt.getStep(f, live(M), 0), null, rt.fv(f, "song_path", rt.sv(f, "selection")), null, 100, "channel", 1021], rt.Args.Named);
			}
			if ((truthy(rt.op(f, "Prob", [], [add(5, multiply((yield* g.srcCall(f, "allowed", live(M))), 4))])) && truthy(rt.fv(f, "canmove", live(M))))) {
				yield* g.srcCall(f, "dance", live(M));
			}
		}
		rt.endFor(f, 0);
		L = null;
		rt.forList(f, 0, rt.sv(f, "rangers"), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)])), 10)) {
				(rt.modSrcVar(f, "rangers", live(L), subtract));
				if ((!truthy(live(L)) || !truthy(rt.fv(f, "client", live(L))))) {
					continue;
				}
				yield* g.callName(f, live(L), "stop_sound_channel", [1021]);
			}
		}
		rt.endFor(f, 0);
	} else {
		if (!truthy(rt.sv(f, "active"))) return f.dot;
		rt.setSv(f, "active", 0);
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		yield* g.srcCall(f, "dance_over");
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_off.ogg"), 50, 1]);
		rt.setSv(f, "icon_state", "disco0");
		rt.setSv(f, "stop", add(rt.worldTime(f), 100));
	}
	return f.dot;
}, true, { waitfor: false });
