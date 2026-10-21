// From code/modules/mob/living/simple_animal/bot/mulebot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5041, "/mob/living/simple_animal/bot/mulebot", "/mob/living/simple_animal/bot", {
	load: null,
	passenger: null,
	target: null,
	loaddir: 0,
	home_destination: "",
	reached_target: 1,
	auto_return: 1,
	auto_pickup: 1,
	report_delivery: 1,
	cell: null,
	bloodiness: 0,
	anchored: 1,
	buckle_lying: 0,
	radio_channel: "Supply",
	bot_type: 2,
	model: "MULE",
	name: "１MULEbot",
	desc: "A Multiple Utility Load Effector bot.",
	icon_state: "mulebot0",
	density: 1,
	animate_movement: 1,
	health: 50,
	maxHealth: 50,
	damage_coeff: null,
	a_intent: "harm",
	mob_size: 3,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_cargo"),
	bot_core_type: rt.typePath("/obj/machinery/bot_core/mulebot"),
	suffix: "",
});

// /mob/living/simple_animal/bot/mulebot/proc/<init>  (code/modules/mob/living/simple_animal/bot/mulebot.dm:20)
rt.def("/mob/living/simple_animal/bot/mulebot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.5, "fire", 0.699999988079071, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]));
	return f.dot;
});

// /mob/living/simple_animal/bot/mulebot/proc/Initialize  (code/modules/mob/living/simple_animal/bot/mulebot.dm:50)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/Initialize", function* Initialize(f: Frame) {
	let J: Value = null;
	f.vars = () => [J];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/mulebot"), [live(f.src)])));
	J = (yield* g.new_(f, T("/datum/job/cargo_tech"), []));
	rt.setFv(f, "access", rt.sv(f, "access_card"), (yield* g.callName(f, live(J), "get_access", [])));
	rt.setSv(f, "prev_access", rt.fv(f, "access", rt.sv(f, "access_card")));
	rt.setSv(f, "cell", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell"), [live(f.src)])));
	rt.setFv(f, "charge", rt.sv(f, "cell"), 2000);
	rt.setFv(f, "maxcharge", rt.sv(f, "cell"), 2000);
	rt.modGl("mulebot_count", 1, add);
	if (truthy(rt.sv(f, "suffix"))) return f.dot;
	yield* g.srcCall(f, "set_suffix", fmt("#＀", [rt.gl("mulebot_count")]));
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/Destroy  (code/modules/mob/living/simple_animal/bot/mulebot.dm:65)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "unload", 0);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/set_suffix  (code/modules/mob/living/simple_animal/bot/mulebot.dm:73)
rt.def("/mob/living/simple_animal/bot/mulebot/proc/set_suffix", function set_suffix(f: Frame, suffix: Value) {
	rt.setFv(f, "suffix", live(f.src), live(suffix));
	if (truthy(rt.sv(f, "paicard"))) {
		rt.setSv(f, "bot_name", fmt("ÿ\u0016MULEbot (＀)", [live(suffix)]));
	} else {
		rt.setSv(f, "name", fmt("ÿ\u0016MULEbot (＀)", [live(suffix)]));
	}
	return f.dot;
});

// /mob/living/simple_animal/bot/mulebot/proc/bot_reset  (code/modules/mob/living/simple_animal/bot/mulebot.dm:78)
rt.def("/mob/living/simple_animal/bot/mulebot/proc/bot_reset", function bot_reset(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "reached_target", 0);
	return f.dot;
});

// /mob/living/simple_animal/bot/mulebot/proc/attackby  (code/modules/mob/living/simple_animal/bot/mulebot.dm:82)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		if (truthy(rt.sv(f, "open"))) {
			rt.setSv(f, "on", 0);
		}
	} else {
		if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0)) && truthy(rt.sv(f, "open"))) && !truthy(rt.sv(f, "cell")))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			rt.setFv(f, "loc", (C = live(f.args[0])), live(f.src));
			rt.setSv(f, "cell", live(C));
			yield* g.srcCall(f, "visible_message", fmt("＀ inserts a cell into ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You insert the new cell into ＀.</span>", [live(f.src)]));
		} else {
			if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0)) && truthy(rt.sv(f, "open"))) && truthy(rt.sv(f, "cell")))) {
				yield* g.callName(f, rt.sv(f, "cell"), "add_fingerprint", [live(f.usr)]);
				rt.setFv(f, "loc", rt.sv(f, "cell"), rt.sv(f, "loc"));
				rt.setSv(f, "cell", null);
				yield* g.srcCall(f, "visible_message", fmt("＀ crowbars out the power cell from ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You pry the powercell out of ＀.</span>", [live(f.src)]));
			} else {
				if ((truthy((yield* g.call(f, P("/proc/is_wire_tool"), null, [live(f.args[0])]))) && truthy(rt.sv(f, "open")))) {
					return (yield* g.srcCall(f, "attack_hand", live(f.args[1])));
				}
				if ((truthy(rt.sv(f, "load")) && truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "load")]))))) {
					if (truthy(rt.op(f, "Prob", [], [add(1, multiply(rt.fv(f, "force", live(f.args[0])), 2))]))) {
						yield* g.srcCall(f, "unload", 0);
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ knocks ＀ off ＀ with ％！!</span>", [live(f.args[1]), rt.sv(f, "load"), live(f.src), live(f.args[0])]), fmt("<span class='danger'>You knock ＀ off ＀ with ％！!</span>", [rt.sv(f, "load"), live(f.src), live(f.args[0])])]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You hit ＀ with ％！ but to no effect!</span>", [live(f.src), live(f.args[0])])]);
						yield* g.callSuper(f, [], rt.Args.Same);
					}
				} else {
					yield* g.callSuper(f, [], rt.Args.Same);
				}
			}
		}
	}
	yield* g.srcCall(f, "update_icon");
	return live(f.dot);
}, true, { args: ["I", "user", "params"] });

// /mob/living/simple_animal/bot/mulebot/proc/emag_act  (code/modules/mob/living/simple_animal/bot/mulebot.dm:116)
rt.def("/mob/living/simple_animal/bot/mulebot/proc/emag_act", function emag_act(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (rt.lt(rt.sv(f, "emagged"), 1)) {
		rt.setSv(f, "emagged", 1);
	}
	if (!truthy(rt.sv(f, "open"))) {
		rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
		$0 = live(user);
		if (truthy(rt.sv(f, "locked"))) {
			$1 = "lock";
		} else {
			$1 = "unlock";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the ＀'s controls!</span>", [$1, live(f.src)])]);
	}
	rt.call(f, P("/proc/flick"), null, ["mulebot-emagged", live(f.src)]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/sparks1.ogg"), 100, 0]);
	return f.dot;
});

// /mob/living/simple_animal/bot/mulebot/proc/update_icon  (code/modules/mob/living/simple_animal/bot/mulebot.dm:126)
rt.def("/mob/living/simple_animal/bot/mulebot/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "open"))) {
		rt.setSv(f, "icon_state", "mulebot-hatch");
	} else {
		rt.setSv(f, "icon_state", fmt("mulebot＀", [rt.callName(f, rt.sv(f, "wires"), "is_cut", ["Avoidance"])]));
	}
	rt.callSrc(f, "cut_overlays", []);
	if ((truthy(rt.sv(f, "load")) && !truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "load")])))) {
		rt.setFv(f, "pixel_y", rt.sv(f, "load"), add(rt.initial(f, rt.sv(f, "load"), "pixel_y"), 9));
		if (rt.lt(rt.fv(f, "layer", rt.sv(f, "load")), rt.sv(f, "layer"))) {
			rt.setFv(f, "layer", rt.sv(f, "load"), add(rt.sv(f, "layer"), 0.009999999776482582));
		}
		rt.callSrc(f, "add_overlay", [rt.sv(f, "load")]);
	}
	return live(f.dot);
});

// /mob/living/simple_animal/bot/mulebot/proc/ex_act  (code/modules/mob/living/simple_animal/bot/mulebot.dm:138)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	let i: Value = null;
	let $0: any;
	f.vars = () => [severity, i, $0];
	yield* g.srcCall(f, "unload", 0);
	$0 = live(severity);
	if ($0 === 1) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else if ($0 === 2) {
		i = null;
		i = 1;
		while (rt.lt(live(i), 3)) {
			yield* g.callName(f, rt.sv(f, "wires"), "cut_random", []);
			i = rt.inc(live(i), 1);
		}
	} else if ($0 === 3) {
		yield* g.callName(f, rt.sv(f, "wires"), "cut_random", []);
	}
	return live(f.dot);
}, true, { waitfor: false });

// /mob/living/simple_animal/bot/mulebot/proc/bullet_act  (code/modules/mob/living/simple_animal/bot/mulebot.dm:150)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/bullet_act", function* bullet_act(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if ((truthy(rt.op(f, "Prob", [], [50])) && rt.sv(f, "load") !== null)) {
		yield* g.srcCall(f, "unload", 0);
	}
	if (!truthy(rt.op(f, "Prob", [], [25]))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>Something shorts out inside ＀!</span>", [live(f.src)]));
	yield* g.callName(f, rt.sv(f, "wires"), "cut_random", []);
	return f.dot;
}, true, { args: ["Proj"] });

// /mob/living/simple_animal/bot/mulebot/proc/interact  (code/modules/mob/living/simple_animal/bot/mulebot.dm:158)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/interact", function* interact(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(rt.sv(f, "open")) && !truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
		yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(user)]);
	} else {
		if ((truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Recieve"]))) && truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "ui_interact", live(user));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/ui_interact  (code/modules/mob/living/simple_animal/bot/mulebot.dm:167)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "mulebot", rt.sv(f, "name"), 600, 375, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/ui_data  (code/modules/mob/living/simple_animal/bot/mulebot.dm:173)
rt.def("/mob/living/simple_animal/bot/mulebot/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [data, $0, $1, $2];
	rt.setAt((data = rt.list()), "on", rt.sv(f, "on"));
	rt.setAt(live(data), "locked", rt.sv(f, "locked"));
	rt.setAt(live(data), "siliconUser", rt.fv(f, "has_unlimited_silicon_privilege", live(user)));
	$0 = live(data);
	$1 = "mode";
	if (truthy(rt.sv(f, "mode"))) {
		$2 = rt.index(rt.sv(f, "mode_name"), rt.sv(f, "mode"));
	} else {
		$2 = "Ready";
	}
	rt.setAt($0, $1, $2);
	rt.setAt(live(data), "modeStatus", "");
	$0 = rt.sv(f, "mode");
	if ($0 === 0 || $0 === 12 || $0 === 13) {
		rt.setAt(live(data), "modeStatus", "good");
	} else if ($0 === 14 || $0 === 15 || $0 === 16) {
		rt.setAt(live(data), "modeStatus", "average");
	} else if ($0 === 17) {
		rt.setAt(live(data), "modeStatus", "bad");
	}
	$0 = live(data);
	$1 = "load";
	if (truthy(rt.sv(f, "load"))) {
		$2 = rt.fv(f, "name", rt.sv(f, "load"));
	} else {
		$2 = null;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "destination";
	if (truthy(rt.sv(f, "destination"))) {
		$2 = rt.sv(f, "destination");
	} else {
		$2 = null;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "cell";
	if (truthy(rt.sv(f, "cell"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "cellPercent";
	if (truthy(rt.sv(f, "cell"))) {
		$2 = rt.callName(f, rt.sv(f, "cell"), "percent", []);
	} else {
		$2 = null;
	}
	rt.setAt($0, $1, $2);
	rt.setAt(live(data), "autoReturn", rt.sv(f, "auto_return"));
	rt.setAt(live(data), "autoPickup", rt.sv(f, "auto_pickup"));
	rt.setAt(live(data), "reportDelivery", rt.sv(f, "report_delivery"));
	$0 = live(data);
	$1 = "haspai";
	if (truthy(rt.sv(f, "paicard"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	return live(data);
});

// /mob/living/simple_animal/bot/mulebot/proc/ui_act  (code/modules/mob/living/simple_animal/bot/mulebot.dm:198)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || (truthy(rt.sv(f, "locked")) && !truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(f.usr)))))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "lock") {
		if (truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(f.usr)))) {
			rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
			f.dot = 1;
		}
	} else if ($0 === "power") {
		if (truthy(rt.sv(f, "on"))) {
			yield* g.srcCall(f, "turn_off");
		} else {
			if ((truthy(rt.sv(f, "cell")) && !truthy(rt.sv(f, "open")))) {
				if (!truthy((yield* g.srcCall(f, "turn_on")))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>You can't switch on ＀!</span>", [live(f.src)])]);
					return live(f.dot);
				}
			}
		}
		f.dot = 1;
	} else {
		yield* g.srcCall(f, "bot_control", live(f.args[0]), live(f.usr));
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /mob/living/simple_animal/bot/mulebot/proc/bot_control  (code/modules/mob/living/simple_animal/bot/mulebot.dm:218)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/bot_control", function* bot_control(f: Frame, command: Value, user: Value, pda: Value) {
	let new_dest: Value = null, new_id: Value = null, new_home: Value = null;
	let $0: any;
	f.vars = () => [command, user, pda, new_dest, new_id, new_home, $0];
	if (live(pda) === null) {
		pda = 0;
	}
	if ((truthy(live(pda)) && truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Recieve"]))))) {
		return live(f.dot);
	}
	$0 = live(command);
	if ($0 === "stop") {
		if (rt.ge(rt.sv(f, "mode"), 12)) {
			yield* g.srcCall(f, "bot_reset");
		}
	} else if ($0 === "go") {
		if (isEqual(rt.sv(f, "mode"), 0)) {
			yield* g.srcCall(f, "start");
		}
	} else if ($0 === "home") {
		if ((isEqual(rt.sv(f, "mode"), 0) || isEqual(rt.sv(f, "mode"), 12))) {
			yield* g.srcCall(f, "start_home");
		}
	} else if ($0 === "destination") {
		if (truthy((new_dest = (yield* g.op(f, "Prompt", [1], [rt.sv(f, "destination"), rt.sv(f, "name"), "Enter Destination:", live(user), rt.gl("deliverybeacontags")]))))) {
			yield* g.srcCall(f, "set_destination", live(new_dest));
		}
	} else if ($0 === "setid") {
		if (truthy((new_id = (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), "Enter ID:", rt.sv(f, "name"), rt.sv(f, "suffix"), 42]))))) {
			yield* g.srcCall(f, "set_suffix", live(new_id));
		}
	} else if ($0 === "sethome") {
		if (truthy((new_home = (yield* g.op(f, "Prompt", [1], [rt.sv(f, "home_destination"), rt.sv(f, "name"), "Enter Home:", live(user), rt.gl("deliverybeacontags")]))))) {
			rt.setSv(f, "home_destination", live(new_home));
		}
	} else if ($0 === "unload") {
		if ((truthy(rt.sv(f, "load")) && !isEqual(rt.sv(f, "mode"), 1))) {
			if (isEqual(rt.sv(f, "loc"), rt.sv(f, "target"))) {
				yield* g.srcCall(f, "unload", rt.sv(f, "loaddir"));
			} else {
				yield* g.srcCall(f, "unload", 0);
			}
		}
	} else if ($0 === "autoret") {
		rt.setSv(f, "auto_return", (!truthy(rt.sv(f, "auto_return")) ? 1 : 0));
	} else if ($0 === "autopick") {
		rt.setSv(f, "auto_pickup", (!truthy(rt.sv(f, "auto_pickup")) ? 1 : 0));
	} else if ($0 === "report") {
		rt.setSv(f, "report_delivery", (!truthy(rt.sv(f, "report_delivery")) ? 1 : 0));
	} else if ($0 === "ejectpai") {
		yield* g.srcCall(f, "ejectpairemote", live(user));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/get_controls  (code/modules/mob/living/simple_animal/bot/mulebot.dm:260)
rt.def("/mob/living/simple_animal/bot/mulebot/proc/get_controls", function get_controls(f: Frame, user: Value) {
	let ai: Value = null, dat: Value = null;
	let $0: any, $1: any;
	f.vars = () => [ai, dat, $0, $1];
	ai = (rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0);
	dat = null;
	dat = rt.modify(live(dat), "<h3>Multiple Utility Load Effector Mk. V</h3>", add);
	dat = rt.modify(live(dat), fmt("<b>ID:</b> ＀<BR>", [rt.sv(f, "suffix")]), add);
	if (truthy(rt.sv(f, "on"))) {
		$0 = "On";
	} else {
		$0 = "Off";
	}
	dat = rt.modify(live(dat), fmt("<b>Power:</b> ＀<BR>", [$0]), add);
	dat = rt.modify(live(dat), "<h3>Status</h3>", add);
	dat = rt.modify(live(dat), "<div class='statusDisplay'>", add);
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		dat = rt.modify(live(dat), "<span class='good'>Ready</span>", add);
	} else if ($0 === 12) {
		dat = rt.modify(live(dat), fmt("<span class='good'>＀</span>", [rt.index(rt.sv(f, "mode_name"), 12)]), add);
	} else if ($0 === 13) {
		dat = rt.modify(live(dat), fmt("<span class='good'>＀</span>", [rt.index(rt.sv(f, "mode_name"), 13)]), add);
	} else if ($0 === 14) {
		dat = rt.modify(live(dat), fmt("<span class='average'>＀</span>", [rt.index(rt.sv(f, "mode_name"), 14)]), add);
	} else if ($0 === 15 || $0 === 16) {
		dat = rt.modify(live(dat), fmt("<span class='average'>＀</span>", [rt.index(rt.sv(f, "mode_name"), 15)]), add);
	} else if ($0 === 17) {
		dat = rt.modify(live(dat), fmt("<span class='bad'>＀</span>", [rt.index(rt.sv(f, "mode_name"), 17)]), add);
	}
	dat = rt.modify(live(dat), "</div>", add);
	if (truthy(rt.sv(f, "load"))) {
		$0 = rt.fv(f, "name", rt.sv(f, "load"));
	} else {
		$0 = "<i>none</i>";
	}
	dat = rt.modify(live(dat), fmt("<b>Current Load:</b> ＀<BR>", [$0]), add);
	if (!truthy(rt.sv(f, "destination"))) {
		$0 = "<i>none</i>";
	} else {
		$0 = rt.sv(f, "destination");
	}
	dat = rt.modify(live(dat), fmt("<b>Destination:</b> ＀<BR>", [$0]), add);
	if (truthy(rt.sv(f, "cell"))) {
		$0 = rt.callName(f, rt.sv(f, "cell"), "percent", []);
	} else {
		$0 = 0;
	}
	dat = rt.modify(live(dat), fmt("<b>Power level:</b> ＀%", [$0]), add);
	if (((truthy(rt.sv(f, "locked")) && !truthy(live(ai))) && !truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))) {
		dat = rt.modify(live(dat), fmt("&nbsp;<br /><div class='notice'>Controls are locked</div><A href='byond://?src=＃;op=unlock'>Unlock Controls</A>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), fmt("&nbsp;<br /><div class='notice'>Controls are unlocked</div><A href='byond://?src=＃;op=lock'>Lock Controls</A><BR><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;op=power'>Toggle Power</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;op=stop'>Stop</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;op=go'>Proceed</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;op=home'>Return to Home</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;op=destination'>Set Destination</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;op=setid'>Set Bot ID</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;op=sethome'>Set Home</A><BR>", [live(f.src)]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "auto_return"))) {
			$1 = "On";
		} else {
			$1 = "Off";
		}
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;op=autoret'>Toggle Auto Return Home</A> (＀)<BR>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "auto_pickup"))) {
			$1 = "On";
		} else {
			$1 = "Off";
		}
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;op=autopick'>Toggle Auto Pickup Crate</A> (＀)<BR>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "report_delivery"))) {
			$1 = "On";
		} else {
			$1 = "Off";
		}
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;op=report'>Toggle Delivery Reporting</A> (＀)<BR>", [$0, $1]), add);
		if (truthy(rt.sv(f, "load"))) {
			dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;op=unload'>Unload Now</A><BR>", [live(f.src)]), add);
		}
		dat = rt.modify(live(dat), "<div class='notice'>The maintenance hatch is closed.</div>", add);
	}
	return live(dat);
});

// /mob/living/simple_animal/bot/mulebot/proc/has_power  (code/modules/mob/living/simple_animal/bot/mulebot.dm:310)
rt.def("/mob/living/simple_animal/bot/mulebot/proc/has_power", function has_power(f: Frame) {
	return ((((!truthy(rt.sv(f, "open")) ? 1 : 0) && rt.sv(f, "cell")) && (rt.gt(rt.fv(f, "charge", rt.sv(f, "cell")), 0) ? 1 : 0)) && ((!truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", ["Main Power 1"])) ? 1 : 0) && (!truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", ["Main Power 2"])) ? 1 : 0)));
});

// /mob/living/simple_animal/bot/mulebot/proc/buzz  (code/modules/mob/living/simple_animal/bot/mulebot.dm:313)
rt.def("/mob/living/simple_animal/bot/mulebot/proc/buzz", function buzz(f: Frame, type: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(type);
	if ($0 === 0) {
		rt.callSrc(f, "audible_message", [fmt("＀ makes a sighing buzz.", [live(f.src)]), "<span class='italics'>You hear an electronic buzzing sound.</span>"]);
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 0]);
	} else if ($0 === 1) {
		rt.callSrc(f, "audible_message", [fmt("＀ makes an annoyed buzzing sound.", [live(f.src)]), "<span class='italics'>You hear an electronic buzzing sound.</span>"]);
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/buzz-two.ogg"), 50, 0]);
	} else if ($0 === 2) {
		rt.callSrc(f, "audible_message", [fmt("＀ makes a delighted ping!", [live(f.src)]), "<span class='italics'>You hear a ping.</span>"]);
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/ping.ogg"), 50, 0]);
	}
	return f.dot;
});

// /mob/living/simple_animal/bot/mulebot/proc/MouseDrop_T  (code/modules/mob/living/simple_animal/bot/mulebot.dm:329)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, AM: Value, user: Value) {
	f.vars = () => [AM, user];
	if ((truthy((yield* g.callName(f, live(user), "incapacitated", []))) || truthy(rt.fv(f, "lying", live(user))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(AM), T("/atom/movable")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "load", live(AM));
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/load  (code/modules/mob/living/simple_animal/bot/mulebot.dm:339)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/load", function* load(f: Frame, AM: Value) {
	let CRATE: Value = null, O: Value = null;
	f.vars = () => [AM, CRATE, O];
	if ((truthy(rt.sv(f, "load")) || truthy(rt.fv(f, "anchored", live(AM))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(AM))])))) {
		return live(f.dot);
	}
	CRATE = null;
	if (truthy((rt.istype(live(AM), T("/obj/structure/closet/crate")) ? 1 : 0))) {
		CRATE = live(AM);
	} else {
		if (!truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Load Check"])))) {
			yield* g.srcCall(f, "buzz", 0);
			return live(f.dot);
		}
	}
	if (truthy(live(CRATE))) {
		yield* g.callName(f, live(CRATE), "close", []);
	}
	if (truthy((rt.istype(live(AM), T("/obj")) ? 1 : 0))) {
		if ((truthy((yield* g.callName(f, (O = live(AM)), "has_buckled_mobs", []))) || truthy(rt.locateIn(f, T("/mob"), live(AM))))) {
			yield* g.srcCall(f, "buzz", 0);
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
		if (!truthy((yield* g.srcCall(f, "load_mob", live(AM))))) {
			return live(f.dot);
		}
	} else {
		rt.setFv(f, "loc", live(AM), live(f.src));
	}
	rt.setSv(f, "load", live(AM));
	rt.setSv(f, "mode", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/load_mob  (code/modules/mob/living/simple_animal/bot/mulebot.dm:374)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/load_mob", function* load_mob(f: Frame, M: Value) {
	f.vars = () => [M];
	rt.setSv(f, "can_buckle", 1);
	if (truthy((yield* g.srcCall(f, "buckle_mob", live(M))))) {
		rt.setSv(f, "passenger", live(M));
		rt.setSv(f, "load", live(M));
		rt.setSv(f, "can_buckle", 0);
		return 1;
	}
	return 0;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/post_buckle_mob  (code/modules/mob/living/simple_animal/bot/mulebot.dm:382)
rt.def("/mob/living/simple_animal/bot/mulebot/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	if (truthy((rt.isIn(f, live(M), rt.sv(f, "buckled_mobs")) ? 1 : 0))) {
		rt.setFv(f, "pixel_y", live(M), add(rt.initial(f, live(M), "pixel_y"), 9));
		if (rt.lt(rt.fv(f, "layer", live(M)), rt.sv(f, "layer"))) {
			rt.setFv(f, "layer", live(M), add(rt.sv(f, "layer"), 0.009999999776482582));
		}
	} else {
		rt.setSv(f, "load", null);
		rt.setFv(f, "layer", live(M), rt.initial(f, live(M), "layer"));
		rt.setFv(f, "pixel_y", live(M), rt.initial(f, live(M), "pixel_y"));
	}
	return f.dot;
});

// /mob/living/simple_animal/bot/mulebot/proc/unload  (code/modules/mob/living/simple_animal/bot/mulebot.dm:396)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/unload", function* unload(f: Frame, dirn: Value) {
	let _T: Value = null, newT: Value = null;
	f.vars = () => [dirn, _T, newT];
	if (!truthy(rt.sv(f, "load"))) {
		return live(f.dot);
	}
	rt.setSv(f, "mode", 0);
	yield* g.srcCall(f, "cut_overlays");
	yield* g.srcCall(f, "unbuckle_all_mobs");
	if (!truthy(rt.sv(f, "load"))) return f.dot;
	rt.setFv(f, "loc", rt.sv(f, "load"), rt.sv(f, "loc"));
	rt.setFv(f, "pixel_y", rt.sv(f, "load"), rt.initial(f, rt.sv(f, "load"), "pixel_y"));
	rt.setFv(f, "layer", rt.sv(f, "load"), rt.initial(f, rt.sv(f, "load"), "layer"));
	rt.setFv(f, "plane", rt.sv(f, "load"), rt.initial(f, rt.sv(f, "load"), "plane"));
	if (truthy(live(dirn))) {
		_T = rt.sv(f, "loc");
		newT = rt.getStep(f, live(_T), live(dirn));
		if (truthy((yield* g.callName(f, rt.sv(f, "load"), "CanPass", [rt.sv(f, "load"), live(newT)])))) {
			yield* g.call(f, P("/proc/step"), null, [rt.sv(f, "load"), live(dirn)]);
		}
	}
	rt.setSv(f, "load", null);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/call_bot  (code/modules/mob/living/simple_animal/bot/mulebot.dm:420)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/call_bot", function* call_bot(f: Frame) {
	let dest_area: Value = null;
	f.vars = () => [dest_area];
	yield* g.callSuper(f, [], rt.Args.Same);
	dest_area = null;
	if (!(truthy(rt.sv(f, "path")) && truthy(rt.len(f, rt.sv(f, "path"))))) return f.dot;
	rt.setSv(f, "target", rt.sv(f, "ai_waypoint"));
	rt.setSv(f, "destination", (yield* g.call(f, P("/proc/format_text"), null, [rt.gv(f, "name", (dest_area = (yield* g.call(f, P("/proc/get_area"), null, [rt.sv(f, "target")]))))])));
	rt.setSv(f, "pathset", 1);
	yield* g.srcCall(f, "start");
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/handle_automated_action  (code/modules/mob/living/simple_animal/bot/mulebot.dm:430)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let speed: Value = null, num_steps: Value = null, i: Value = null;
	let $0: any, $1: any;
	f.vars = () => [speed, num_steps, i, $0, $1];
	if (!truthy((yield* g.srcCall(f, "has_power")))) {
		rt.setSv(f, "on", 0);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "on"))) return f.dot;
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Motor 1"])))) {
		$0 = 0;
	} else {
		$0 = 1;
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Motor 2"])))) {
		$1 = 0;
	} else {
		$1 = 2;
	}
	speed = add($0, $1);
	num_steps = 0;
	$0 = live(speed);
	if ($0 === 0) {
	} else if ($0 === 1) {
		num_steps = 10;
	} else if ($0 === 2) {
		num_steps = 5;
	} else if ($0 === 3) {
		num_steps = 3;
	}
	if (!truthy(live(num_steps))) return f.dot;
	yield* g.srcCall(f, "process_bot");
	num_steps = rt.inc(live(num_steps), -1);
	if (isEqual(rt.sv(f, "mode"), 0)) return f.dot;
	rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/mulebot/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:451", speed, num_steps, i);
	return f.dot;
}, true, { waitfor: false });

// a spawn(0) body of /mob/living/simple_animal/bot/mulebot/proc/handle_automated_action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/mulebot/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:451", function* (f: Frame, speed: Value, num_steps: Value, i: Value) {
	f.vars = () => [speed, num_steps, i];
	i = null;
	i = live(num_steps);
	while (rt.gt(live(i), 0)) {
		yield* g.call(f, P("/proc/sleep"), null, [2]);
		yield* g.srcCall(f, "process_bot");
		i = rt.inc(live(i), -1);
	}
	return null;
});

// /mob/living/simple_animal/bot/mulebot/proc/process_bot  (code/modules/mob/living/simple_animal/bot/mulebot.dm:457)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/process_bot", function* process_bot(f: Frame) {
	let next: Value = null, B: Value = null, newdir: Value = null, oldloc: Value = null, moved: Value = null;
	let $0: any;
	f.vars = () => [next, B, newdir, oldloc, moved, $0];
	if ((!truthy(rt.sv(f, "on")) || truthy(rt.sv(f, "client")))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "update_icon");
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		return live(f.dot);
	} else if ($0 === 12 || $0 === 13 || $0 === 14) {
		if (isEqual(rt.sv(f, "loc"), rt.sv(f, "target"))) {
			yield* g.srcCall(f, "at_target");
			return live(f.dot);
		} else {
			if ((rt.gt(rt.len(f, rt.sv(f, "path")), 0) && truthy(rt.sv(f, "target")))) {
				next = rt.index(rt.sv(f, "path"), 1);
				rt.setSv(f, "reached_target", 0);
				if (isEqual(live(next), rt.sv(f, "loc"))) {
					(rt.modSrcVar(f, "path", live(next), subtract));
					return live(f.dot);
				}
				if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(next)])))) {
					if (truthy(rt.sv(f, "bloodiness"))) {
						B = (yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/tracks"), [rt.sv(f, "loc")]));
						if ((truthy(rt.sv(f, "blood_DNA")) && truthy(rt.len(f, rt.sv(f, "blood_DNA"))))) {
							(rt.modField(f, live(B), "blood_DNA", (yield* g.callName(f, rt.sv(f, "blood_DNA"), "Copy", [])), rt.bitOr));
						}
						if (isEqual((newdir = rt.getDir(f, live(next), rt.sv(f, "loc"))), rt.sv(f, "dir"))) {
							yield* g.callName(f, live(B), "setDir", [live(newdir)]);
						} else {
							if (isEqual((newdir = rt.bitOr(live(newdir), rt.sv(f, "dir"))), 3)) {
								newdir = 1;
							} else {
								if (isEqual(live(newdir), 12)) {
									newdir = 4;
								}
							}
							yield* g.callName(f, live(B), "setDir", [live(newdir)]);
						}
						rt.incSrcVar(f, "bloodiness", -1, true);
					}
					oldloc = rt.sv(f, "loc");
					moved = (yield* g.call(f, P("/proc/step_towards"), null, [live(f.src), live(next)]));
					if (truthy(rt.sv(f, "cell"))) {
						yield* g.callName(f, rt.sv(f, "cell"), "use", [1]);
					}
					if ((truthy(live(moved)) && !isEqual(live(oldloc), rt.sv(f, "loc")))) {
						rt.setSv(f, "blockcount", 0);
						(rt.modSrcVar(f, "path", rt.sv(f, "loc"), subtract));
						if (isEqual(rt.sv(f, "destination"), rt.sv(f, "home_destination"))) {
							rt.setSv(f, "mode", 13);
						} else {
							rt.setSv(f, "mode", 12);
						}
					} else {
						rt.incSrcVar(f, "blockcount", 1, true);
						rt.setSv(f, "mode", 14);
						if (isEqual(rt.sv(f, "blockcount"), 3)) {
							yield* g.srcCall(f, "buzz", 1);
						}
						if (rt.gt(rt.sv(f, "blockcount"), 10)) {
							yield* g.srcCall(f, "buzz", 0);
							rt.setSv(f, "mode", 16);
							rt.setSv(f, "blockcount", 0);
							rt.spawnTail(f, 20, "/mob/living/simple_animal/bot/mulebot/proc/process_bot: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:522", next, B, newdir, oldloc, moved);
							return live(f.dot);
						}
						return live(f.dot);
					}
				} else {
					yield* g.srcCall(f, "buzz", 1);
					rt.setSv(f, "mode", 15);
					return live(f.dot);
				}
			} else {
				rt.setSv(f, "mode", 15);
				return live(f.dot);
			}
		}
	} else if ($0 === 15) {
		rt.setSv(f, "mode", 16);
		rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/mulebot/proc/process_bot: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:542", next, B, newdir, oldloc, moved);
	}
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/simple_animal/bot/mulebot/proc/process_bot, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/mulebot/proc/process_bot: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:542", function* (f: Frame, next: Value, B: Value, newdir: Value, oldloc: Value, moved: Value) {
	f.vars = () => [next, B, newdir, oldloc, moved];
	yield* g.srcCall(f, "calc_path");
	if (rt.gt(rt.len(f, rt.sv(f, "path")), 0)) {
		rt.setSv(f, "blockcount", 0);
		rt.setSv(f, "mode", 14);
		yield* g.srcCall(f, "buzz", 2);
	} else {
		yield* g.srcCall(f, "buzz", 0);
		rt.setSv(f, "mode", 17);
	}
	return null;
});

// a spawn(20) body of /mob/living/simple_animal/bot/mulebot/proc/process_bot, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/mulebot/proc/process_bot: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:522", function* (f: Frame, next: Value, B: Value, newdir: Value, oldloc: Value, moved: Value) {
	f.vars = () => [next, B, newdir, oldloc, moved];
	yield* g.callSrc(f, "calc_path", ["avoid", live(next)], rt.Args.Named);
	if (rt.gt(rt.len(f, rt.sv(f, "path")), 0)) {
		yield* g.srcCall(f, "buzz", 2);
	}
	rt.setSv(f, "mode", 14);
	return null;
});

// /mob/living/simple_animal/bot/mulebot/proc/calc_path  (code/modules/mob/living/simple_animal/bot/mulebot.dm:558)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/calc_path", function* calc_path(f: Frame, avoid: Value) {
	f.vars = () => [avoid];
	if (live(avoid) === null) {
		avoid = null;
	}
	rt.setSv(f, "path", (yield* g.call(f, P("/proc/get_path_to"), null, [null, live(f.src), null, rt.sv(f, "target"), null, P("/turf/proc/Distance_cardinal"), null, 0, null, 250, "id", rt.sv(f, "access_card"), "exclude", live(avoid)], rt.Args.Named)));
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/set_destination  (code/modules/mob/living/simple_animal/bot/mulebot.dm:564)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/set_destination", function* set_destination(f: Frame, new_dest: Value) {
	f.vars = () => [new_dest];
	rt.setSv(f, "new_destination", live(new_dest));
	yield* g.srcCall(f, "get_nav");
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/start  (code/modules/mob/living/simple_animal/bot/mulebot.dm:569)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/start", function* start(f: Frame) {
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "destination"), rt.sv(f, "home_destination"))) {
		rt.setSv(f, "mode", 13);
	} else {
		rt.setSv(f, "mode", 12);
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "get_nav");
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/start_home  (code/modules/mob/living/simple_animal/bot/mulebot.dm:581)
rt.def("/mob/living/simple_animal/bot/mulebot/proc/start_home", function start_home(f: Frame) {
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/mulebot/proc/start_home: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:583");
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// a spawn(0) body of /mob/living/simple_animal/bot/mulebot/proc/start_home, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/mulebot/proc/start_home: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:583", function* (f: Frame) {
	yield* g.srcCall(f, "set_destination", rt.sv(f, "home_destination"));
	rt.setSv(f, "mode", 14);
	return null;
});

// /mob/living/simple_animal/bot/mulebot/proc/at_target  (code/modules/mob/living/simple_animal/bot/mulebot.dm:590)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/at_target", function* at_target(f: Frame) {
	let AM: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [AM, A, $e];
	if (!truthy(rt.sv(f, "reached_target"))) {
		rt.setSv(f, "radio_channel", "Supply");
		yield* g.srcCall(f, "audible_message", fmt("＀ makes a chiming sound!", [live(f.src)]), "<span class='italics'>You hear a chime.</span>");
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/chime.ogg"), 50, 0]);
		rt.setSv(f, "reached_target", 1);
		if (truthy(rt.sv(f, "pathset"))) {
			rt.setSv(f, "loaddir", rt.sv(f, "dir"));
			if (truthy(rt.sv(f, "calling_ai"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "calling_ai"), fmt("<span class='notice'>＀ ＀ wirelessly plays a chiming sound!</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)])), live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "calling_ai"), rt.rsc("sound/machines/chime.ogg"), 40, 0]);
				rt.setSv(f, "calling_ai", null);
				rt.setSv(f, "radio_channel", "AI Private");
			}
		}
		if (truthy(rt.sv(f, "load"))) {
			if (truthy(rt.sv(f, "report_delivery"))) {
				yield* g.srcCall(f, "speak", fmt("Destination <b>＀</b> reached. Unloading ＀.", [rt.sv(f, "destination"), rt.sv(f, "load")]), rt.sv(f, "radio_channel"));
			}
			yield* g.srcCall(f, "unload", rt.sv(f, "loaddir"));
		} else {
			if (truthy(rt.sv(f, "auto_pickup"))) {
				AM = null;
				if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Load Check"])))) {
					A = null;
					rt.forList(f, 0, rt.getStep(f, rt.sv(f, "loc"), rt.sv(f, "loaddir")), T("/atom/movable"));
					while (($e = rt.next(f, 0)) !== undefined) {
						A = $e;
						if (!truthy(rt.fv(f, "anchored", live(A)))) {
							AM = live(A);
							break;
						}
					}
					rt.endFor(f, 0);
				} else {
					AM = rt.locateIn(f, T("/obj/structure/closet/crate"), rt.getStep(f, rt.sv(f, "loc"), rt.sv(f, "loaddir")));
				}
				if ((truthy(live(AM)) && truthy((yield* g.callName(f, live(AM), "Adjacent", [live(f.src)]))))) {
					yield* g.srcCall(f, "load", live(AM));
					if (truthy(rt.sv(f, "report_delivery"))) {
						yield* g.srcCall(f, "speak", fmt("Now loading ＀ at <b>＀</b>.", [rt.sv(f, "load"), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))]), rt.sv(f, "radio_channel"));
					}
				}
			}
		}
		if (((truthy(rt.sv(f, "auto_return")) && truthy(rt.sv(f, "home_destination"))) && !isEqual(rt.sv(f, "destination"), rt.sv(f, "home_destination")))) {
			yield* g.srcCall(f, "start_home");
			rt.setSv(f, "mode", 14);
		} else {
			yield* g.srcCall(f, "bot_reset");
		}
	}
	return live(f.dot);
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/Bump  (code/modules/mob/living/simple_animal/bot/mulebot.dm:636)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/Bump", function* Bump(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Avoidance"])))) {
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
			if (truthy((rt.istype((L = live(f.args[0])), T("/mob/living/silicon/robot")) ? 1 : 0))) {
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ bumps into ＀!</span>", [live(f.src), live(L)]));
			} else {
				if (!truthy(rt.sv(f, "paicard"))) {
					yield* g.call(f, P("/proc/add_logs"), null, [live(f.src), live(L), "knocked down"]);
					yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ knocks over ＀!</span>", [live(f.src), live(L)]));
					yield* g.callName(f, live(L), "Knockdown", [160]);
				}
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["obs"] });

// /mob/living/simple_animal/bot/mulebot/proc/RunOver  (code/modules/mob/living/simple_animal/bot/mulebot.dm:651)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/RunOver", function* RunOver(f: Frame, H: Value) {
	let damage: Value = null, _T: Value = null, blood_dna: Value = null;
	f.vars = () => [H, damage, _T, blood_dna];
	yield* g.call(f, P("/proc/add_logs"), null, [live(f.src), live(H), "run over", null, fmt("(DAMTYPE: ＀)", [(yield* g.call(f, P("/proc/uppertext"), null, ["brute"]))])]);
	yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀ drives over ＀!</span>", [live(f.src), live(H)]), fmt("<span class='userdanger'>＀ drives over you!<span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/splat.ogg"), 50, 1]);
	damage = (yield* g.call(f, P("/proc/rand"), null, [5, 15]));
	yield* g.callName(f, live(H), "apply_damage", [multiply(2, live(damage)), "brute", "head", (yield* g.srcCall(f, "run_armor_check", "head", "melee"))]);
	yield* g.callName(f, live(H), "apply_damage", [multiply(2, live(damage)), "brute", "chest", (yield* g.srcCall(f, "run_armor_check", "chest", "melee"))]);
	yield* g.callName(f, live(H), "apply_damage", [multiply(0.5, live(damage)), "brute", "l_leg", (yield* g.srcCall(f, "run_armor_check", "l_leg", "melee"))]);
	yield* g.callName(f, live(H), "apply_damage", [multiply(0.5, live(damage)), "brute", "r_leg", (yield* g.srcCall(f, "run_armor_check", "r_leg", "melee"))]);
	yield* g.callName(f, live(H), "apply_damage", [multiply(0.5, live(damage)), "brute", "l_arm", (yield* g.srcCall(f, "run_armor_check", "l_arm", "melee"))]);
	yield* g.callName(f, live(H), "apply_damage", [multiply(0.5, live(damage)), "brute", "r_arm", (yield* g.srcCall(f, "run_armor_check", "r_arm", "melee"))]);
	yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "add_mob_blood", [live(H)]);
	if (truthy((blood_dna = (yield* g.callName(f, live(H), "get_blood_dna_list", []))))) {
		yield* g.srcCall(f, "transfer_blood_dna", live(blood_dna));
	}
	rt.modSrcVar(f, "bloodiness", 4, add);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/relaymove  (code/modules/mob/living/simple_animal/bot/mulebot.dm:674)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy((yield* g.callName(f, live(user), "incapacitated", [])))) {
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "load"), live(user))) return f.dot;
	yield* g.srcCall(f, "unload", 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/get_nav  (code/modules/mob/living/simple_animal/bot/mulebot.dm:682)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/get_nav", function* get_nav(f: Frame) {
	let NB: Value = null, direction: Value = null;
	let $e: any;
	f.vars = () => [NB, direction, $e];
	if ((!truthy(rt.sv(f, "on")) || truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Beacon"]))))) {
		return live(f.dot);
	}
	NB = null;
	rt.forList(f, 0, rt.gl("deliverybeacons"), T("/obj/machinery/navbeacon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		NB = $e;
		if (isEqual(rt.fv(f, "location", live(NB)), rt.sv(f, "new_destination"))) {
			rt.setSv(f, "destination", rt.sv(f, "new_destination"));
			rt.setSv(f, "target", rt.fv(f, "loc", live(NB)));
			if (truthy((direction = rt.fv(f, "dir", live(NB))))) {
				rt.setSv(f, "loaddir", (yield* g.call(f, P("/proc/text2num"), null, [live(direction)])));
			} else {
				rt.setSv(f, "loaddir", 0);
			}
			yield* g.srcCall(f, "update_icon");
			if (truthy(rt.sv(f, "destination"))) {
				yield* g.srcCall(f, "calc_path");
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/emp_act  (code/modules/mob/living/simple_animal/bot/mulebot.dm:701)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/emp_act", function* emp_act(f: Frame) {
	if (truthy(rt.sv(f, "cell"))) {
		yield* g.callName(f, rt.sv(f, "cell"), "emp_act", [live(f.args[0])]);
	}
	if (truthy(rt.sv(f, "load"))) {
		yield* g.callName(f, rt.sv(f, "load"), "emp_act", [live(f.args[0])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /mob/living/simple_animal/bot/mulebot/proc/explode  (code/modules/mob/living/simple_animal/bot/mulebot.dm:708)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/explode", function* explode(f: Frame) {
	let Tsec: Value = null;
	f.vars = () => [Tsec];
	yield* g.srcCall(f, "visible_message", fmt("<span class='boldannounce'>＀ blows apart!</span>", [live(f.src)]));
	yield* g.new_(f, T("/obj/item/device/assembly/prox_sensor"), [(Tsec = rt.getStep(f, live(f.src), 0))]);
	yield* g.new_(f, T("/obj/item/stack/rods"), [live(Tsec)]);
	yield* g.new_(f, T("/obj/item/stack/rods"), [live(Tsec)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil/cut"), [live(Tsec)]);
	if (truthy(rt.sv(f, "cell"))) {
		rt.setFv(f, "loc", rt.sv(f, "cell"), live(Tsec));
		yield* g.callName(f, rt.sv(f, "cell"), "update_icon", []);
		rt.setSv(f, "cell", null);
	}
	yield* g.call(f, P("/proc/do_sparks"), null, [3, 1, live(f.src)]);
	yield* g.new_(f, T("/obj/effect/decal/cleanable/oil"), [rt.sv(f, "loc")]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/mulebot/proc/remove_air  (code/modules/mob/living/simple_animal/bot/mulebot.dm:727)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/remove_air", function* remove_air(f: Frame, amount: Value) {
	f.vars = () => [amount];
	if (truthy(rt.sv(f, "loc"))) {
		return (yield* g.callName(f, rt.sv(f, "loc"), "remove_air", [live(amount)]));
	}
	return null;
}, true);

// /mob/living/simple_animal/bot/mulebot/resist  (code/modules/mob/living/simple_animal/bot/mulebot.dm:732)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/resist", function* resist(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "load"))) return f.dot;
	yield* g.srcCall(f, "unload");
	return f.dot;
}, true, { verb: { name: "Resist", category: "IC" } });

// /mob/living/simple_animal/bot/mulebot/proc/UnarmedAttack  (code/modules/mob/living/simple_animal/bot/mulebot.dm:737)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/UnarmedAttack", function* UnarmedAttack(f: Frame) {
	if ((((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.args[0])]))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) && truthy((yield* g.callName(f, rt.sv(f, "loc"), "Adjacent", [live(f.args[0])])))) && truthy(rt.sv(f, "load")))) {
		yield* g.srcCall(f, "unload", rt.getDir(f, rt.sv(f, "loc"), live(f.args[0])));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["A"] });

// /mob/living/simple_animal/bot/mulebot/proc/insertpai  (code/modules/mob/living/simple_animal/bot/mulebot.dm:743)  may sleep
rt.def("/mob/living/simple_animal/bot/mulebot/proc/insertpai", function* insertpai(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("＀ safeties are locked on.", [live(f.src)]));
	return f.dot;
}, true, { args: ["user", "card"] });

rt.type(10945, "/obj/machinery/bot_core/mulebot", "/obj/machinery/bot_core", {
	req_access: null,
});

// /obj/machinery/bot_core/mulebot/proc/<init>  (code/modules/mob/living/simple_animal/bot/mulebot.dm:751)
rt.def("/obj/machinery/bot_core/mulebot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(31));
	return f.dot;
});
