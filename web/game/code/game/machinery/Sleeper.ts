// From code/game/machinery/Sleeper.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10824, "/obj/machinery/sleeper", "/obj/machinery", {
	efficiency: 1,
	min_health: -25,
	available_chems: null,
	controls_inside: 0,
	possible_chems: null,
	chem_buttons: null,
	scrambled_chems: 0,
	anchored: 1,
	state_open: 1,
	name: "sleeper",
	desc: "An enclosed machine used to stabilize and heal patients.",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	density: 0,
});

// /obj/machinery/sleeper/proc/<init>  (code/game/machinery/Sleeper.dm:20)
rt.def("/obj/machinery/sleeper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_chems", rt.list(rt.list("epinephrine", "morphine", "salbutamol", "bicaridine", "kelotane"), rt.list("oculine", "inacusiate"), rt.list("antitoxin", "mutadone", "mannitol", "pen_acid"), rt.list("omnizine")));
	return f.dot;
});

// /obj/machinery/sleeper/proc/New  (code/game/machinery/Sleeper.dm:30)  may sleep
rt.def("/obj/machinery/sleeper/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/sleeper"), [null]))), "apply_default_parts", [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "reset_chem_buttons");
	return f.dot;
}, true);

rt.type(6729, "/obj/item/weapon/circuitboard/machine/sleeper", "/obj/item/weapon/circuitboard/machine", {
	name: "Sleeper (Machine Board)",
	build_path: rt.typePath("/obj/machinery/sleeper"),
	origin_tech: "programming=3;biotech=2;engineering=3",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/sleeper/proc/<init>  (code/game/machinery/Sleeper.dm:40)
rt.def("/obj/item/weapon/circuitboard/machine/sleeper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/stack/sheet/glass"), 1]));
	return f.dot;
});

// /obj/machinery/sleeper/proc/RefreshParts  (code/game/machinery/Sleeper.dm:49)
rt.def("/obj/machinery/sleeper/proc/RefreshParts", function RefreshParts(f: Frame) {
	let E: Value = null, B: Value = null, I: Value = null, M: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [E, B, I, M, i, $e];
	E = null;
	B = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		E = rt.modify(live(E), rt.fv(f, "rating", live(B)), add);
	}
	rt.endFor(f, 0);
	I = null;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		I = rt.modify(live(I), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "efficiency", multiply(rt.initial(f, live(f.src), "efficiency"), live(E)));
	rt.setSv(f, "min_health", multiply(rt.initial(f, live(f.src), "min_health"), live(E)));
	rt.setSv(f, "available_chems", rt.list());
	i = null;
	rt.forRange(f, 0, 1, live(I), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		(rt.modSrcVar(f, "available_chems", rt.index(rt.sv(f, "possible_chems"), live(i)), rt.bitOr));
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "reset_chem_buttons", []);
	return f.dot;
});

// /obj/machinery/sleeper/proc/update_icon  (code/game/machinery/Sleeper.dm:63)
rt.def("/obj/machinery/sleeper/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	if (!truthy(rt.sv(f, "state_open"))) return f.dot;
	rt.modSrcVar(f, "icon_state", "-open", add);
	return f.dot;
});

// /obj/machinery/sleeper/proc/container_resist  (code/game/machinery/Sleeper.dm:68)  may sleep
rt.def("/obj/machinery/sleeper/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ emerges from ＀!</span>", [rt.sv(f, "occupant"), live(f.src)]), fmt("<span class='notice'>You climb out of ＀!</span>", [live(f.src)]));
	yield* g.srcCall(f, "open_machine");
	return f.dot;
}, true);

// /obj/machinery/sleeper/proc/relaymove  (code/game/machinery/Sleeper.dm:73)  may sleep
rt.def("/obj/machinery/sleeper/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "container_resist", live(user));
	return f.dot;
}, true);

// /obj/machinery/sleeper/proc/open_machine  (code/game/machinery/Sleeper.dm:76)  may sleep
rt.def("/obj/machinery/sleeper/proc/open_machine", function* open_machine(f: Frame) {
	if (!(!truthy(rt.sv(f, "state_open")) && !truthy(rt.sv(f, "panel_open")))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/sleeper/proc/close_machine  (code/game/machinery/Sleeper.dm:80)  may sleep
rt.def("/obj/machinery/sleeper/proc/close_machine", function* close_machine(f: Frame, user: Value) {
	let mob_occupant: Value = null;
	f.vars = () => [user, mob_occupant];
	if (!(((live(user) === null || truthy((rt.istype(live(user), T("/mob")) ? 1 : 0))) && truthy(rt.sv(f, "state_open"))) && !truthy(rt.sv(f, "panel_open")))) return f.dot;
	yield* g.callSuper(f, [live(user)]);
	if (!(truthy((mob_occupant = rt.sv(f, "occupant"))) && !isEqual(rt.fv(f, "stat", live(mob_occupant)), 2))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupant"), "<span class='notice'><b>You feel cool air surround you. You go numb as your senses turn inward.</b></span>"]);
	return f.dot;
}, true);

// /obj/machinery/sleeper/proc/emp_act  (code/game/machinery/Sleeper.dm:87)  may sleep
rt.def("/obj/machinery/sleeper/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if ((truthy((yield* g.srcCall(f, "is_operational"))) && truthy(rt.sv(f, "occupant")))) {
		yield* g.srcCall(f, "open_machine");
	}
	yield* g.callSuper(f, [live(severity)]);
	return f.dot;
}, true);

// /obj/machinery/sleeper/proc/MouseDrop_T  (code/game/machinery/Sleeper.dm:92)  may sleep
rt.def("/obj/machinery/sleeper/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	if ((((((truthy(rt.fv(f, "stat", live(user))) || truthy(rt.fv(f, "lying", live(user)))) || !truthy((yield* g.srcCall(f, "Adjacent", live(user))))) || !truthy((yield* g.callName(f, live(user), "Adjacent", [live(target)])))) || !truthy((rt.istype(live(target), T("/mob/living/carbon")) ? 1 : 0))) || !truthy((yield* g.callName(f, live(user), "IsAdvancedToolUser", []))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "close_machine", live(target));
	return f.dot;
}, true);

// /obj/machinery/sleeper/proc/attackby  (code/game/machinery/Sleeper.dm:97)  may sleep
rt.def("/obj/machinery/sleeper/proc/attackby", function* attackby(f: Frame) {
	if ((!truthy(rt.sv(f, "state_open")) && !truthy(rt.sv(f, "occupant")))) {
		if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), fmt("＀-o", [rt.initial(f, live(f.src), "icon_state")]), rt.initial(f, live(f.src), "icon_state"), live(f.args[0]))))) {
			return live(f.dot);
		}
	}
	if (truthy((yield* g.srcCall(f, "default_change_direction_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/sleeper/proc/ui_interact  (code/game/machinery/Sleeper.dm:113)  may sleep
rt.def("/obj/machinery/sleeper/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("notcontained_state");
	}
	if ((truthy(rt.sv(f, "controls_inside")) && isEqual(live(state), rt.gl("notcontained_state")))) {
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "sleeper", rt.sv(f, "name"), 375, 550, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/sleeper/proc/ui_data  (code/game/machinery/Sleeper.dm:122)
rt.def("/obj/machinery/sleeper/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, chem: Value = null, R: Value = null, mob_occupant: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [data, chem, R, mob_occupant, $0, $1, $2, $e];
	$0 = (data = rt.list());
	$1 = "occupied";
	if (truthy(rt.sv(f, "occupant"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	rt.setAt(live(data), "open", rt.sv(f, "state_open"));
	rt.setAt(live(data), "chems", rt.list());
	chem = null;
	rt.forList(f, 0, rt.sv(f, "available_chems"));
	while (($e = rt.next(f, 0)) !== undefined) {
		chem = $e;
		R = rt.index(rt.gl("chemical_reagents_list"), live(chem));
		rt.modAt(live(data), "chems", rt.list(rt.alist(f, ["name", rt.fv(f, "name", live(R)), "id", rt.fv(f, "id", live(R)), "allowed", rt.callSrc(f, "chem_allowed", [live(chem)])])), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "occupant", rt.list());
	if (truthy((mob_occupant = rt.sv(f, "occupant")))) {
		rt.setAt(rt.at(live(data), "occupant"), "name", rt.fv(f, "name", live(mob_occupant)));
		rt.setAt(rt.at(live(data), "occupant"), "stat", rt.fv(f, "stat", live(mob_occupant)));
		rt.setAt(rt.at(live(data), "occupant"), "health", rt.fv(f, "health", live(mob_occupant)));
		rt.setAt(rt.at(live(data), "occupant"), "maxHealth", rt.fv(f, "maxHealth", live(mob_occupant)));
		rt.setAt(rt.at(live(data), "occupant"), "minHealth", -100);
		rt.setAt(rt.at(live(data), "occupant"), "bruteLoss", rt.callName(f, live(mob_occupant), "getBruteLoss", []));
		rt.setAt(rt.at(live(data), "occupant"), "oxyLoss", rt.callName(f, live(mob_occupant), "getOxyLoss", []));
		rt.setAt(rt.at(live(data), "occupant"), "toxLoss", rt.callName(f, live(mob_occupant), "getToxLoss", []));
		rt.setAt(rt.at(live(data), "occupant"), "fireLoss", rt.callName(f, live(mob_occupant), "getFireLoss", []));
		rt.setAt(rt.at(live(data), "occupant"), "cloneLoss", rt.callName(f, live(mob_occupant), "getCloneLoss", []));
		rt.setAt(rt.at(live(data), "occupant"), "brainLoss", rt.callName(f, live(mob_occupant), "getBrainLoss", []));
		rt.setAt(rt.at(live(data), "occupant"), "reagents", rt.list());
		if (truthy(rt.getLen(f, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "occupant")))))) {
			R = null;
			rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(mob_occupant))), T("/datum/reagent"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				rt.modAt(rt.at(live(data), "occupant"), "reagents", rt.list(rt.alist(f, ["name", rt.fv(f, "name", live(R)), "volume", rt.fv(f, "volume", live(R))])), add);
			}
			rt.endFor(f, 0);
		}
	}
	return live(data);
});

// /obj/machinery/sleeper/proc/ui_act  (code/game/machinery/Sleeper.dm:152)  may sleep
rt.def("/obj/machinery/sleeper/proc/ui_act", function* ui_act(f: Frame) {
	let mob_occupant: Value = null, chem: Value = null;
	let $0: any;
	f.vars = () => [mob_occupant, chem, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	mob_occupant = rt.sv(f, "occupant");
	$0 = live(f.args[0]);
	if ($0 === "door") {
		if (truthy(rt.sv(f, "state_open"))) {
			yield* g.srcCall(f, "close_machine");
		} else {
			yield* g.srcCall(f, "open_machine");
		}
		f.dot = 1;
	} else if ($0 === "inject") {
		chem = rt.at(live(f.args[1]), "chem");
		if ((!truthy((yield* g.srcCall(f, "is_operational"))) || !truthy(live(mob_occupant)))) {
			return live(f.dot);
		}
		if ((rt.lt(rt.fv(f, "health", live(mob_occupant)), rt.sv(f, "min_health")) && !isEqual(live(chem), "epinephrine"))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.srcCall(f, "inject_chem", live(chem))))) return f.dot;
		f.dot = 1;
		if (!(truthy(rt.sv(f, "scrambled_chems")) && truthy(rt.op(f, "Prob", [], [5])))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Chem System Re-route detected, results may not be as expected!</span>"]);
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/sleeper/proc/emag_act  (code/game/machinery/Sleeper.dm:175)
rt.def("/obj/machinery/sleeper/proc/emag_act", function emag_act(f: Frame, user: Value) {
	rt.callSrc(f, "scramble_chem_buttons", []);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You scramble the sleepers user interface!</span>"]);
	return f.dot;
});

// /obj/machinery/sleeper/proc/inject_chem  (code/game/machinery/Sleeper.dm:179)  may sleep
rt.def("/obj/machinery/sleeper/proc/inject_chem", function* inject_chem(f: Frame, chem: Value) {
	f.vars = () => [chem];
	if (!(truthy((rt.isIn(f, live(chem), rt.sv(f, "available_chems")) ? 1 : 0)) && truthy((yield* g.srcCall(f, "chem_allowed", live(chem)))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "occupant")), "add_reagent", [rt.index(rt.sv(f, "chem_buttons"), live(chem)), 10]);
	return 1;
}, true);

// /obj/machinery/sleeper/proc/chem_allowed  (code/game/machinery/Sleeper.dm:184)
rt.def("/obj/machinery/sleeper/proc/chem_allowed", function chem_allowed(f: Frame, chem: Value) {
	let mob_occupant: Value = null, amount: Value = null, occ_health: Value = null;
	f.vars = () => [mob_occupant, amount, occ_health];
	if (!truthy((mob_occupant = rt.sv(f, "occupant")))) {
		return live(f.dot);
	}
	amount = (rt.le(add(rt.callName(f, rt.fv(f, "reagents", live(mob_occupant)), "get_reagent_amount", [live(chem)]), 10), multiply(20, rt.sv(f, "efficiency"))) ? 1 : 0);
	occ_health = ((rt.gt(rt.fv(f, "health", live(mob_occupant)), rt.sv(f, "min_health")) ? 1 : 0) || (isEqual(live(chem), "epinephrine") ? 1 : 0));
	return (live(amount) && live(occ_health));
});

// /obj/machinery/sleeper/proc/reset_chem_buttons  (code/game/machinery/Sleeper.dm:193)
rt.def("/obj/machinery/sleeper/proc/reset_chem_buttons", function reset_chem_buttons(f: Frame) {
	let chem: Value = null;
	let $e: any;
	f.vars = () => [chem, $e];
	rt.setSv(f, "scrambled_chems", 0);
	if (!truthy(rt.sv(f, "chem_buttons"))) {
		rt.setSv(f, "chem_buttons", rt.list());
	}
	chem = null;
	rt.forList(f, 0, rt.sv(f, "available_chems"));
	while (($e = rt.next(f, 0)) !== undefined) {
		chem = $e;
		rt.setAt(rt.sv(f, "chem_buttons"), live(chem), live(chem));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/sleeper/proc/scramble_chem_buttons  (code/game/machinery/Sleeper.dm:199)
rt.def("/obj/machinery/sleeper/proc/scramble_chem_buttons", function scramble_chem_buttons(f: Frame) {
	let av_chem: Value = null, chem: Value = null;
	let $e: any;
	f.vars = () => [av_chem, chem, $e];
	rt.setSv(f, "scrambled_chems", 1);
	av_chem = rt.callName(f, rt.sv(f, "available_chems"), "Copy", []);
	chem = null;
	rt.forList(f, 0, live(av_chem));
	while (($e = rt.next(f, 0)) !== undefined) {
		chem = $e;
		rt.setAt(rt.sv(f, "chem_buttons"), live(chem), rt.call(f, P("/proc/pick_n_take"), null, [live(av_chem)]));
	}
	rt.endFor(f, 0);
	return f.dot;
});
