// From code/game/machinery/washing_machine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10856, "/obj/machinery/washing_machine", "/obj/machinery", {
	busy: 0,
	bloody_mess: 0,
	has_corgi: 0,
	color_source: null,
	max_wash_capacity: 5,
	anchored: 1,
	state_open: 1,
	name: "washing machine",
	desc: "Gets rid of those pesky bloodstains, or your money back!",
	icon: rt.rsc("icons/obj/machines/washing_machine.dmi"),
	icon_state: "wm_1_0",
	density: 1,
});

// /obj/machinery/washing_machine/proc/examine  (code/game/machinery/washing_machine.dm:16)
rt.def("/obj/machinery/washing_machine/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Alt-click it to start a wash cycle.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/washing_machine/proc/AltClick  (code/game/machinery/washing_machine.dm:20)  may sleep
rt.def("/obj/machinery/washing_machine/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src)])))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "busy"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "state_open"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Close the door first</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "bloody_mess"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ must be cleaned up first.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "has_corgi"))) {
		rt.setSv(f, "bloody_mess", 1);
	}
	rt.setSv(f, "busy", 1);
	yield* g.srcCall(f, "update_icon");
	yield* g.call(f, P("/proc/sleep"), null, [200]);
	yield* g.srcCall(f, "wash_cycle");
	return f.dot;
}, true);

// /obj/machinery/washing_machine/proc/clean_blood  (code/game/machinery/washing_machine.dm:43)
rt.def("/obj/machinery/washing_machine/proc/clean_blood", function clean_blood(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "busy"))) return f.dot;
	rt.setSv(f, "bloody_mess", 0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/washing_machine/proc/wash_cycle  (code/game/machinery/washing_machine.dm:50)  may sleep
rt.def("/obj/machinery/washing_machine/proc/wash_cycle", function* wash_cycle(f: Frame) {
	let X: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [X, AM, $e];
	X = null;
	rt.forList(f, 0, rt.sv(f, "contents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (AM = live(X)), "clean_blood", []);
		yield* g.callName(f, live(AM), "machine_wash", [live(f.src)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "busy", 0);
	if (truthy(rt.sv(f, "color_source"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "color_source")]);
		rt.setSv(f, "color_source", null);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(9020, "/obj/item/stack/sheet/hairlesshide", "/obj/item/stack/sheet", {
	name: "hairless hide",
	desc: "This hide was stripped of its hair, but still needs washing and tanning.",
	singular_name: "hairless hide piece",
	icon_state: "sheet-hairlesshide",
	origin_tech: null,
});

// /obj/item/stack/sheet/hairlesshide/proc/machine_wash  (code/game/machinery/washing_machine.dm:67)  may sleep
rt.def("/obj/item/stack/sheet/hairlesshide/proc/machine_wash", function* machine_wash(f: Frame, WM: Value) {
	let WL: Value = null;
	f.vars = () => [WM, WL];
	rt.setFv(f, "amount", (WL = (yield* g.new_(f, T("/obj/item/stack/sheet/wetleather"), [rt.sv(f, "loc")]))), rt.sv(f, "amount"));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/clothing/suit/hooded/ian_costume/proc/machine_wash  (code/game/machinery/washing_machine.dm:72)  may sleep
rt.def("/obj/item/clothing/suit/hooded/ian_costume/proc/machine_wash", function* machine_wash(f: Frame, WM: Value) {
	f.vars = () => [WM];
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi"), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/paper/proc/machine_wash  (code/game/machinery/washing_machine.dm:76)
rt.def("/obj/item/weapon/paper/proc/machine_wash", function machine_wash(f: Frame, WM: Value) {
	let CR: Value = null;
	f.vars = () => [CR];
	if (!truthy(rt.fv(f, "color_source", live(WM)))) return f.dot;
	if (!truthy((rt.istype(rt.fv(f, "color_source", live(WM)), T("/obj/item/toy/crayon")) ? 1 : 0))) return f.dot;
	rt.callSrc(f, "add_atom_colour", [rt.gv(f, "paint_color", (CR = rt.fv(f, "color_source", live(WM)))), 3]);
	return f.dot;
});

// /mob/living/simple_animal/pet/dog/corgi/proc/machine_wash  (code/game/machinery/washing_machine.dm:82)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/machine_wash", function* machine_wash(f: Frame, WM: Value) {
	f.vars = () => [WM];
	yield* g.srcCall(f, "gib");
	return f.dot;
}, true);

rt.type(8261, "/obj/item/clothing/under/color", "/obj/item/clothing/under", {
	desc: "A standard issue colored jumpsuit. Variety is the spice of life!",
});

// /obj/item/clothing/under/color/proc/machine_wash  (code/game/machinery/washing_machine.dm:85)
rt.def("/obj/item/clothing/under/color/proc/machine_wash", function machine_wash(f: Frame, WM: Value) {
	rt.callSrc(f, "jumpsuit_wash", [live(WM)]);
	return f.dot;
});

rt.type(8282, "/obj/item/clothing/under/rank", "/obj/item/clothing/under", {});

// /obj/item/clothing/under/rank/proc/machine_wash  (code/game/machinery/washing_machine.dm:88)
rt.def("/obj/item/clothing/under/rank/proc/machine_wash", function machine_wash(f: Frame, WM: Value) {
	rt.callSrc(f, "jumpsuit_wash", [live(WM)]);
	return f.dot;
});

// /obj/item/clothing/under/proc/jumpsuit_wash  (code/game/machinery/washing_machine.dm:91)
rt.def("/obj/item/clothing/under/proc/jumpsuit_wash", function jumpsuit_wash(f: Frame, WM: Value) {
	let wash_color: Value = null, U: Value = null, _T: Value = null, J: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [wash_color, U, _T, J, R, $e];
	if (!truthy(rt.fv(f, "color_source", live(WM)))) return f.dot;
	wash_color = rt.gv(f, "item_color", rt.fv(f, "color_source", live(WM)));
	U = null;
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/under/color")]));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		J = live(_T);
		if (isEqual(live(wash_color), rt.initial(f, live(J), "item_color"))) {
			U = live(J);
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(U))) {
		_T = null;
		rt.forList(f, 0, rt.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/under/rank")]));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			R = live(_T);
			if (isEqual(live(wash_color), rt.initial(f, live(R), "item_color"))) {
				U = live(R);
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(live(U))) return f.dot;
	rt.setSv(f, "item_state", rt.initial(f, live(U), "item_state"));
	rt.setSv(f, "icon_state", rt.initial(f, live(U), "icon_state"));
	rt.setSv(f, "item_color", live(wash_color));
	rt.setSv(f, "name", rt.initial(f, live(U), "name"));
	rt.setSv(f, "desc", "The colors are a bit dodgy.");
	rt.setSv(f, "can_adjust", rt.initial(f, live(U), "can_adjust"));
	if (!(!truthy(rt.sv(f, "can_adjust")) && truthy(rt.sv(f, "adjusted")))) return f.dot;
	rt.callSrc(f, "toggle_jumpsuit_adjust", []);
	return f.dot;
});

rt.type(7663, "/obj/item/clothing/gloves/color", "/obj/item/clothing/gloves", {});

// /obj/item/clothing/gloves/color/proc/machine_wash  (code/game/machinery/washing_machine.dm:116)
rt.def("/obj/item/clothing/gloves/color/proc/machine_wash", function machine_wash(f: Frame, WM: Value) {
	let wash_color: Value = null, _T: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [wash_color, _T, G, $e];
	if (!truthy(rt.fv(f, "color_source", live(WM)))) return f.dot;
	wash_color = rt.gv(f, "item_color", rt.fv(f, "color_source", live(WM)));
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/gloves/color")]));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		G = live(_T);
		if (isEqual(live(wash_color), rt.initial(f, live(G), "item_color"))) {
			rt.setSv(f, "item_state", rt.initial(f, live(G), "item_state"));
			rt.setSv(f, "icon_state", rt.initial(f, live(G), "icon_state"));
			rt.setSv(f, "item_color", live(wash_color));
			rt.setSv(f, "name", rt.initial(f, live(G), "name"));
			rt.setSv(f, "desc", "The colors are a bit dodgy.");
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(8464, "/obj/item/clothing/shoes/sneakers", "/obj/item/clothing/shoes", {});

// /obj/item/clothing/shoes/sneakers/proc/machine_wash  (code/game/machinery/washing_machine.dm:132)  may sleep
rt.def("/obj/item/clothing/shoes/sneakers/proc/machine_wash", function* machine_wash(f: Frame, WM: Value) {
	let wash_color: Value = null, _T: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [WM, wash_color, _T, S, $e];
	if (truthy(rt.sv(f, "chained"))) {
		rt.setSv(f, "chained", 0);
		rt.setSv(f, "slowdown", 0);
		yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs"), [rt.sv(f, "loc")]);
	}
	if (!truthy(rt.fv(f, "color_source", live(WM)))) return f.dot;
	wash_color = rt.gv(f, "item_color", rt.fv(f, "color_source", live(WM)));
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/shoes/sneakers")])));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		S = live(_T);
		if (isEqual(live(wash_color), rt.initial(f, live(S), "item_color"))) {
			rt.setSv(f, "icon_state", rt.initial(f, live(S), "icon_state"));
			rt.setSv(f, "item_color", live(wash_color));
			rt.setSv(f, "name", rt.initial(f, live(S), "name"));
			rt.setSv(f, "desc", "The colors are a bit dodgy.");
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/bedsheet/proc/machine_wash  (code/game/machinery/washing_machine.dm:145)
rt.def("/obj/item/weapon/bedsheet/proc/machine_wash", function machine_wash(f: Frame, WM: Value) {
	let wash_color: Value = null, _T: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [wash_color, _T, B, $e];
	if (!truthy(rt.fv(f, "color_source", live(WM)))) return f.dot;
	wash_color = rt.gv(f, "item_color", rt.fv(f, "color_source", live(WM)));
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/bedsheet")]));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		B = live(_T);
		if (isEqual(live(wash_color), rt.initial(f, live(B), "item_color"))) {
			rt.setSv(f, "icon_state", rt.initial(f, live(B), "icon_state"));
			rt.setSv(f, "item_color", live(wash_color));
			rt.setSv(f, "name", rt.initial(f, live(B), "name"));
			rt.setSv(f, "desc", "The colors are a bit dodgy.");
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/clothing/head/soft/proc/machine_wash  (code/game/machinery/washing_machine.dm:157)
rt.def("/obj/item/clothing/head/soft/proc/machine_wash", function machine_wash(f: Frame, WM: Value) {
	let wash_color: Value = null, _T: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [wash_color, _T, H, $e];
	if (!truthy(rt.fv(f, "color_source", live(WM)))) return f.dot;
	wash_color = rt.gv(f, "item_color", rt.fv(f, "color_source", live(WM)));
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/head/soft")]));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		H = live(_T);
		if (isEqual(live(wash_color), rt.initial(f, live(H), "item_color"))) {
			rt.setSv(f, "icon_state", rt.initial(f, live(H), "icon_state"));
			rt.setSv(f, "item_color", live(wash_color));
			rt.setSv(f, "name", rt.initial(f, live(H), "name"));
			rt.setSv(f, "desc", "The colors are a bit dodgy.");
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/washing_machine/proc/relaymove  (code/game/machinery/washing_machine.dm:170)  may sleep
rt.def("/obj/machinery/washing_machine/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "container_resist", live(user));
	return f.dot;
}, true);

// /obj/machinery/washing_machine/proc/container_resist  (code/game/machinery/washing_machine.dm:173)  may sleep
rt.def("/obj/machinery/washing_machine/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "busy"))) return f.dot;
	yield* g.srcCall(f, "add_fingerprint", live(user));
	yield* g.srcCall(f, "open_machine");
	return f.dot;
}, true);

// /obj/machinery/washing_machine/proc/update_icon  (code/game/machinery/washing_machine.dm:180)
rt.def("/obj/machinery/washing_machine/proc/update_icon", function update_icon(f: Frame) {
	let full: Value = null;
	let $0: any;
	f.vars = () => [full, $0];
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "busy"))) {
		rt.setSv(f, "icon_state", fmt("wm_running_＀", [rt.sv(f, "bloody_mess")]));
	} else {
		if (truthy(rt.sv(f, "bloody_mess"))) {
			rt.setSv(f, "icon_state", fmt("wm_＀_blood", [rt.sv(f, "state_open")]));
		} else {
			if (truthy(rt.len(f, rt.sv(f, "contents")))) {
				$0 = 1;
			} else {
				$0 = 0;
			}
			full = $0;
			rt.setSv(f, "icon_state", fmt("wm_＀_＀", [rt.sv(f, "state_open"), live(full)]));
		}
	}
	if (!truthy(rt.sv(f, "panel_open"))) return f.dot;
	rt.callSrc(f, "add_overlay", ["wm_panel"]);
	return f.dot;
});

// /obj/machinery/washing_machine/proc/attackby  (code/game/machinery/washing_machine.dm:192)  may sleep
rt.def("/obj/machinery/washing_machine/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), null, null, live(f.args[0]))))) {
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	} else {
		if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
			if (!truthy(rt.sv(f, "state_open"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Open the door first!</span>"]);
				return 1;
			}
			if (truthy(rt.sv(f, "bloody_mess"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ must be cleaned up first.</span>", [live(f.src)])]);
				return 1;
			}
			if (rt.ge(rt.len(f, rt.sv(f, "contents")), rt.sv(f, "max_wash_capacity"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The washing machine is full!</span>"]);
				return 1;
			}
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ is stuck to your hand, you cannot put it in the washing machine!</span>", [live(f.args[0])])]);
				return 1;
			}
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/crayon")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stamp")) ? 1 : 0)))) {
				rt.setSv(f, "color_source", live(f.args[0]));
			}
			yield* g.srcCall(f, "update_icon");
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/washing_machine/proc/attack_hand  (code/game/machinery/washing_machine.dm:223)  may sleep
rt.def("/obj/machinery/washing_machine/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let L: Value = null;
	f.vars = () => [user, L];
	if (truthy(rt.sv(f, "busy"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is busy.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (((truthy(rt.fv(f, "pulling", live(user))) && isEqual(rt.fv(f, "a_intent", live(user)), "grab")) && truthy((rt.istype(rt.fv(f, "pulling", live(user)), T("/mob/living")) ? 1 : 0)))) {
		if ((truthy(rt.gv(f, "buckled", (L = rt.fv(f, "pulling", live(user))))) || truthy((yield* g.callName(f, live(L), "has_buckled_mobs", []))))) {
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "state_open"))) {
			if (truthy((rt.istype(live(L), T("/mob/living/simple_animal/pet/dog/corgi")) ? 1 : 0))) {
				rt.setSv(f, "has_corgi", 1);
				yield* g.callName(f, live(L), "forceMove", [live(f.src)]);
				yield* g.srcCall(f, "update_icon");
			}
		}
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "state_open"))) {
		yield* g.srcCall(f, "open_machine");
	} else {
		rt.setSv(f, "state_open", 0);
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true);

// /obj/machinery/washing_machine/proc/deconstruct  (code/game/machinery/washing_machine.dm:244)  may sleep
rt.def("/obj/machinery/washing_machine/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/washing_machine/proc/open_machine  (code/game/machinery/washing_machine.dm:248)  may sleep
rt.def("/obj/machinery/washing_machine/proc/open_machine", function* open_machine(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "density", 1);
	rt.setSv(f, "color_source", null);
	rt.setSv(f, "has_corgi", 0);
	return f.dot;
}, true, { args: ["drop"] });
