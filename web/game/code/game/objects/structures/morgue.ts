// From code/game/objects/structures/morgue.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12812, "/obj/structure/bodycontainer", "/obj/structure", {
	connected: null,
	locked: 0,
	opendir: 2,
	anchored: 1,
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "morgue1",
	density: 1,
	obj_integrity: 400,
	max_integrity: 400,
});

// /obj/structure/bodycontainer/proc/Destroy  (code/game/objects/structures/morgue.dm:29)  may sleep
rt.def("/obj/structure/bodycontainer/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "open");
	if (truthy(rt.sv(f, "connected"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "connected")]);
		rt.setSv(f, "connected", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/bodycontainer/proc/on_log  (code/game/objects/structures/morgue.dm:36)
rt.def("/obj/structure/bodycontainer/proc/on_log", function on_log(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { args: ["login"] });

// /obj/structure/bodycontainer/proc/relaymove  (code/game/objects/structures/morgue.dm:43)  may sleep
rt.def("/obj/structure/bodycontainer/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(rt.fv(f, "stat", live(user))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "open");
	return f.dot;
}, true);

// /obj/structure/bodycontainer/proc/attack_paw  (code/game/objects/structures/morgue.dm:48)  may sleep
rt.def("/obj/structure/bodycontainer/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/structure/bodycontainer/proc/attack_hand  (code/game/objects/structures/morgue.dm:52)  may sleep
rt.def("/obj/structure/bodycontainer/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>It's locked.</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "connected"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "That doesn't appear to have a tray."]);
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "loc", rt.sv(f, "connected")), live(f.src))) {
		yield* g.srcCall(f, "open");
	} else {
		yield* g.srcCall(f, "close");
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/structure/bodycontainer/proc/attack_robot  (code/game/objects/structures/morgue.dm:64)  may sleep
rt.def("/obj/structure/bodycontainer/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.callName(f, live(user), "Adjacent", [live(f.src)])))) {
		return live(f.dot);
	}
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/structure/bodycontainer/proc/attackby  (code/game/objects/structures/morgue.dm:69)  may sleep
rt.def("/obj/structure/bodycontainer/proc/attackby", function* attackby(f: Frame) {
	let t: Value = null;
	f.vars = () => [t];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
		t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "What would you like the label to be?", fmt("＀", [rt.sv(f, "name")]), null]));
		if (!isEqual((yield* g.callName(f, live(f.args[1]), "get_active_held_item", [])), live(f.args[0]))) {
			return live(f.dot);
		}
		if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.fv(f, "loc", live(f.src)), live(f.args[1])))) {
			return live(f.dot);
		}
		if (truthy(live(t))) {
			rt.setSv(f, "name", fmt("＀- '＀'", [rt.initial(f, live(f.src), "name"), live(t)]));
		} else {
			rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// /obj/structure/bodycontainer/proc/deconstruct  (code/game/objects/structures/morgue.dm:84)  may sleep
rt.def("/obj/structure/bodycontainer/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 5]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/bodycontainer/proc/container_resist  (code/game/objects/structures/morgue.dm:88)  may sleep
rt.def("/obj/structure/bodycontainer/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "open");
	return f.dot;
}, true);

// /obj/structure/bodycontainer/proc/relay_container_resist  (code/game/objects/structures/morgue.dm:91)  may sleep
rt.def("/obj/structure/bodycontainer/proc/relay_container_resist", function* relay_container_resist(f: Frame, user: Value, O: Value) {
	f.vars = () => [user, O];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You slam yourself into the side of ＀.</span>", [live(O)])]);
	yield* g.srcCall(f, "container_resist", live(user));
	return f.dot;
}, true);

// /obj/structure/bodycontainer/proc/open  (code/game/objects/structures/morgue.dm:95)  may sleep
rt.def("/obj/structure/bodycontainer/proc/open", function* open(f: Frame) {
	let _T: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [_T, AM, $e];
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
	_T = rt.getStep(f, live(f.src), rt.sv(f, "opendir"));
	AM = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.callName(f, live(AM), "forceMove", [live(_T)]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/bodycontainer/proc/close  (code/game/objects/structures/morgue.dm:102)  may sleep
rt.def("/obj/structure/bodycontainer/proc/close", function* close(f: Frame) {
	let AM: Value = null;
	let $e: any;
	f.vars = () => [AM, $e];
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
	AM = null;
	rt.forList(f, 0, rt.fv(f, "loc", rt.sv(f, "connected")), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if ((!truthy(rt.fv(f, "anchored", live(AM))) || isEqual(live(AM), rt.sv(f, "connected")))) {
			yield* g.callName(f, live(AM), "forceMove", [live(f.src)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/bodycontainer/proc/get_remote_view_fullscreens  (code/game/objects/structures/morgue.dm:109)  may sleep
rt.def("/obj/structure/bodycontainer/proc/get_remote_view_fullscreens", function* get_remote_view_fullscreens(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(isEqual(rt.fv(f, "stat", live(user)), 2) || !truthy(rt.bitAnd(rt.fv(f, "sight", live(user)), 12)))) return f.dot;
	yield* g.callName(f, live(user), "overlay_fullscreen", ["remote_view", T("/obj/screen/fullscreen/impaired"), 2]);
	return f.dot;
}, true);

rt.type(12813, "/obj/structure/bodycontainer/morgue", "/obj/structure/bodycontainer", {
	opendir: 4,
	name: "morgue",
	desc: "Used to keep bodies in until someone fetches them.",
	icon_state: "morgue1",
});

// /obj/structure/bodycontainer/morgue/proc/New  (code/game/objects/structures/morgue.dm:121)  may sleep
rt.def("/obj/structure/bodycontainer/morgue/proc/New", function* New(f: Frame) {
	rt.setSv(f, "connected", (yield* g.new_(f, T("/obj/structure/tray/m_tray"), [live(f.src)])));
	rt.setFv(f, "connected", rt.sv(f, "connected"), live(f.src));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/bodycontainer/morgue/proc/update_icon  (code/game/objects/structures/morgue.dm:126)
rt.def("/obj/structure/bodycontainer/morgue/proc/update_icon", function update_icon(f: Frame) {
	let compiled: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [compiled, M, $e];
	if ((!truthy(rt.sv(f, "connected")) || !isEqual(rt.fv(f, "loc", rt.sv(f, "connected")), live(f.src)))) {
		rt.setSv(f, "icon_state", "morgue0");
	} else {
		if (isEqual(rt.len(f, rt.sv(f, "contents")), 1)) {
			rt.setSv(f, "icon_state", "morgue1");
		} else {
			rt.setSv(f, "icon_state", "morgue2");
			if (!truthy(rt.length((compiled = rt.call(f, P("/proc/recursive_mob_check"), null, [live(f.src), 0, 0]))))) {
				rt.setSv(f, "icon_state", "morgue3");
				return live(f.dot);
			}
			M = null;
			rt.forList(f, 0, live(compiled), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if ((truthy(rt.fv(f, "client", live(M))) && !truthy(rt.fv(f, "suiciding", live(M))))) {
					rt.setSv(f, "icon_state", "morgue4");
					break;
				}
			}
			rt.endFor(f, 0);
		}
	}
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalcrematoriums  (code/game/objects/structures/morgue.dm:149)
rt.def("/datum/controller/global_vars/proc/InitGlobalcrematoriums", function InitGlobalcrematoriums(f: Frame) {
	rt.setGl("crematoriums", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "crematoriums", add);
	return f.dot;
});

rt.type(12814, "/obj/structure/bodycontainer/crematorium", "/obj/structure/bodycontainer", {
	id: 1,
	opendir: 2,
	name: "crematorium",
	desc: "A human incinerator. Works well on barbeque nights.",
	icon_state: "crema1",
});

// /obj/structure/bodycontainer/crematorium/proc/attack_robot  (code/game/objects/structures/morgue.dm:158)
rt.def("/obj/structure/bodycontainer/crematorium/proc/attack_robot", function attack_robot(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is locked against you.</span>", [live(f.src)])]);
	return live(f.dot);
});

// /obj/structure/bodycontainer/crematorium/proc/Destroy  (code/game/objects/structures/morgue.dm:162)  may sleep
rt.def("/obj/structure/bodycontainer/crematorium/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.gl("crematoriums"), "Remove", [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/bodycontainer/crematorium/proc/New  (code/game/objects/structures/morgue.dm:166)  may sleep
rt.def("/obj/structure/bodycontainer/crematorium/proc/New", function* New(f: Frame) {
	rt.setSv(f, "connected", (yield* g.new_(f, T("/obj/structure/tray/c_tray"), [live(f.src)])));
	rt.setFv(f, "connected", rt.sv(f, "connected"), live(f.src));
	yield* g.callName(f, rt.gl("crematoriums"), "Add", [live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/bodycontainer/crematorium/proc/update_icon  (code/game/objects/structures/morgue.dm:173)
rt.def("/obj/structure/bodycontainer/crematorium/proc/update_icon", function update_icon(f: Frame) {
	if ((!truthy(rt.sv(f, "connected")) || !isEqual(rt.fv(f, "loc", rt.sv(f, "connected")), live(f.src)))) {
		rt.setSv(f, "icon_state", "crema0");
	} else {
		if (rt.gt(rt.getLen(f, rt.fv(f, "contents", live(f.src))), 1)) {
			rt.setFv(f, "icon_state", live(f.src), "crema2");
		} else {
			rt.setFv(f, "icon_state", live(f.src), "crema1");
		}
		if (truthy(rt.sv(f, "locked"))) {
			rt.setFv(f, "icon_state", live(f.src), "crema_active");
		}
	}
	return live(f.dot);
});

// /obj/structure/bodycontainer/crematorium/proc/cremate  (code/game/objects/structures/morgue.dm:191)  may sleep
rt.def("/obj/structure/bodycontainer/crematorium/proc/cremate", function* cremate(f: Frame, user: Value) {
	let conts: Value = null, M: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [user, conts, M, O, $e];
	if (truthy(rt.sv(f, "locked"))) {
		return live(f.dot);
	}
	if (!truthy(rt.getLen(f, (conts = subtract(subtract((yield* g.srcCall(f, "GetAllContents")), live(f.src)), rt.sv(f, "connected")))))) {
		yield* g.srcCall(f, "audible_message", "<span class='italics'>You hear a hollow crackle.</span>");
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "audible_message", "<span class='italics'>You hear a roar as the crematorium activates.</span>");
		rt.setSv(f, "locked", 1);
		yield* g.srcCall(f, "update_icon");
		M = null;
		rt.forList(f, 0, live(conts), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (!isEqual(rt.fv(f, "stat", live(M)), 2)) {
				yield* g.callName(f, live(M), "emote", ["scream"]);
			}
			if (truthy(live(user))) {
				yield* g.callName(f, live(user), "log_message", [fmt("Cremated <b>＀/＀</b>", [live(M), rt.fv(f, "ckey", live(M))]), "Attack log"]);
				yield* g.call(f, P("/proc/log_attack"), null, [fmt("[＀] <b>＀/＀</b> cremated <b>＀/＀</b>", [(yield* g.call(f, P("/proc/time_stamp"), null, [])), live(user), rt.fv(f, "ckey", live(user)), live(M), rt.fv(f, "ckey", live(M))])]);
			} else {
				yield* g.call(f, P("/proc/log_attack"), null, [fmt("[＀] <b>UNKNOWN</b> cremated <b>＀/＀</b>", [(yield* g.call(f, P("/proc/time_stamp"), null, [])), live(M), rt.fv(f, "ckey", live(M))])]);
			}
			yield* g.callName(f, live(M), "death", [1]);
			if (truthy(live(M))) {
				yield* g.callName(f, live(M), "ghostize", []);
				yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
			}
		}
		rt.endFor(f, 0);
		O = null;
		rt.forList(f, 0, live(conts), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			if (!isEqual(live(O), rt.sv(f, "connected"))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
			}
		}
		rt.endFor(f, 0);
		yield* g.new_(f, T("/obj/effect/decal/cleanable/ash"), [live(f.src)]);
		yield* g.call(f, P("/proc/sleep"), null, [30]);
		if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
		rt.setSv(f, "locked", 0);
		yield* g.srcCall(f, "update_icon");
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/ding.ogg"), 50, 1]);
	}
	return f.dot;
}, true);

rt.type(12815, "/obj/structure/bodycontainer/crematorium/creamatorium", "/obj/structure/bodycontainer/crematorium", {
	name: "creamatorium",
	desc: "A human incinerator. Works well during ice cream socials.",
});

// /obj/structure/bodycontainer/crematorium/creamatorium/proc/cremate  (code/game/objects/structures/morgue.dm:232)  may sleep
rt.def("/obj/structure/bodycontainer/crematorium/creamatorium/proc/cremate", function* cremate(f: Frame) {
	let icecreams: Value = null, i_scream: Value = null, IC: Value = null, IC_1: Value = null;
	let $e: any;
	f.vars = () => [icecreams, i_scream, IC, IC_1, $e];
	icecreams = (yield* g.new_(f, T("/list"), []));
	i_scream = null;
	rt.forList(f, 0, (yield* g.srcCall(f, "GetAllContents")), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i_scream = $e;
		yield* g.callName(f, (IC = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/icecream"), []))), "set_cone_type", ["waffle"]);
		yield* g.callName(f, live(IC), "add_mob_flavor", [live(i_scream)]);
		icecreams = rt.modify(live(icecreams), live(IC), add);
	}
	rt.endFor(f, 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	IC_1 = null;
	rt.forList(f, 0, live(icecreams), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		IC_1 = $e;
		yield* g.callName(f, live(IC_1), "forceMove", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["user"] });

rt.type(12816, "/obj/structure/tray", "/obj/structure", {
	connected: null,
	anchored: 1,
	pass_flags: 32,
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	density: 1,
	layer: 2.9,
	obj_integrity: 350,
	max_integrity: 350,
});

// /obj/structure/tray/proc/Destroy  (code/game/objects/structures/morgue.dm:259)  may sleep
rt.def("/obj/structure/tray/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "connected"))) {
		rt.setFv(f, "connected", rt.sv(f, "connected"), null);
		yield* g.callName(f, rt.sv(f, "connected"), "update_icon", []);
		rt.setSv(f, "connected", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/tray/proc/deconstruct  (code/game/objects/structures/morgue.dm:265)  may sleep
rt.def("/obj/structure/tray/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/tray/proc/attack_paw  (code/game/objects/structures/morgue.dm:269)  may sleep
rt.def("/obj/structure/tray/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/structure/tray/proc/attack_hand  (code/game/objects/structures/morgue.dm:272)  may sleep
rt.def("/obj/structure/tray/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.fv(f, "connected", live(f.src)))) {
		yield* g.callName(f, rt.sv(f, "connected"), "close", []);
		yield* g.srcCall(f, "add_fingerprint", live(user));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>That's not connected to anything!</span>"]);
	}
	return f.dot;
}, true);

// /obj/structure/tray/proc/MouseDrop_T  (code/game/objects/structures/morgue.dm:279)
rt.def("/obj/structure/tray/proc/MouseDrop_T", function MouseDrop_T(f: Frame, O: Value, user: Value) {
	let M: Value = null;
	f.vars = () => [M];
	if (((((!truthy((rt.istype(live(O), T("/atom/movable")) ? 1 : 0)) || truthy(rt.fv(f, "anchored", live(O)))) || !truthy(rt.callSrc(f, "Adjacent", [live(user)]))) || !truthy(rt.callName(f, live(user), "Adjacent", [live(O)]))) || isEqual(rt.fv(f, "loc", live(O)), live(user)))) {
		return live(f.dot);
	}
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [live(O)]))) {
		if (!truthy((rt.istype(live(O), T("/obj/structure/closet/body_bag")) ? 1 : 0))) {
			return live(f.dot);
		}
	} else {
		if (truthy(rt.gv(f, "buckled", (M = live(O))))) {
			return live(f.dot);
		}
	}
	if (((!truthy(rt.call(f, P("/proc/ismob"), null, [live(user)])) || truthy(rt.fv(f, "lying", live(user)))) || truthy(rt.callName(f, live(user), "incapacitated", [])))) {
		return live(f.dot);
	}
	rt.setFv(f, "loc", live(O), rt.fv(f, "loc", live(f.src)));
	if (!isEqual(live(user), live(O))) {
		rt.callSrc(f, "visible_message", [fmt("<span class='warning'>＀ stuffs ＀ into ＀.</span>", [live(user), live(O), live(f.src)])]);
	}
	return live(f.dot);
});

rt.type(12818, "/obj/structure/tray/m_tray", "/obj/structure/tray", {
	name: "morgue tray",
	desc: "Apply corpse before closing.",
	icon_state: "morguet",
});

// /obj/structure/tray/m_tray/proc/CanPass  (code/game/objects/structures/morgue.dm:312)
rt.def("/obj/structure/tray/m_tray/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(height), 0)) {
		return 1;
	}
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [1])))) {
		return 1;
	}
	if (truthy(rt.locateIn(f, T("/obj/structure/table"), rt.getStep(f, live(mover), 0)))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /obj/structure/tray/m_tray/proc/CanAStarPass  (code/game/objects/structures/morgue.dm:323)
rt.def("/obj/structure/tray/m_tray/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, dir: Value, caller: Value) {
	let mover: Value = null;
	f.vars = () => [mover];
	f.dot = (!truthy(rt.sv(f, "density")) ? 1 : 0);
	if (!truthy((rt.istype(live(caller), T("/atom/movable")) ? 1 : 0))) return f.dot;
	mover = live(caller);
	f.dot = (live(f.dot) || rt.callName(f, live(mover), "checkpass", [1]));
	return f.dot;
});
