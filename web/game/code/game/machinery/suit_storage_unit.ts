// From code/game/machinery/suit_storage_unit.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10831, "/obj/machinery/suit_storage_unit", "/obj/machinery", {
	suit: null,
	helmet: null,
	mask: null,
	storage: null,
	suit_type: null,
	helmet_type: null,
	mask_type: null,
	storage_type: null,
	locked: 0,
	safeties: 1,
	uv: 0,
	uv_super: 0,
	uv_cycles: 6,
	anchored: 1,
	state_open: 0,
	panel_open: 0,
	name: "suit storage unit",
	desc: "An industrial unit made to hold space suits. It comes with a built-in UV cauterization mechanism. A small warning label advises that organic matter should not be placed into the unit.",
	icon: rt.rsc("icons/obj/suitstorage.dmi"),
	icon_state: "close",
	density: 1,
	obj_integrity: 250,
	max_integrity: 250,
});

// /obj/machinery/suit_storage_unit/proc/New  (code/game/machinery/suit_storage_unit.dm:106)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/suit_storage_unit"), [live(f.src)])));
	if (truthy(rt.sv(f, "suit_type"))) {
		rt.setSv(f, "suit", (yield* g.new_(f, rt.sv(f, "suit_type"), [live(f.src)])));
	}
	if (truthy(rt.sv(f, "helmet_type"))) {
		rt.setSv(f, "helmet", (yield* g.new_(f, rt.sv(f, "helmet_type"), [live(f.src)])));
	}
	if (truthy(rt.sv(f, "mask_type"))) {
		rt.setSv(f, "mask", (yield* g.new_(f, rt.sv(f, "mask_type"), [live(f.src)])));
	}
	if (truthy(rt.sv(f, "storage_type"))) {
		rt.setSv(f, "storage", (yield* g.new_(f, rt.sv(f, "storage_type"), [live(f.src)])));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/suit_storage_unit/proc/Destroy  (code/game/machinery/suit_storage_unit.dm:120)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "suit"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "suit")]);
		rt.setSv(f, "suit", null);
	}
	if (truthy(rt.sv(f, "helmet"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "helmet")]);
		rt.setSv(f, "helmet", null);
	}
	if (truthy(rt.sv(f, "mask"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "mask")]);
		rt.setSv(f, "mask", null);
	}
	if (truthy(rt.sv(f, "storage"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "storage")]);
		rt.setSv(f, "storage", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/suit_storage_unit/proc/update_icon  (code/game/machinery/suit_storage_unit.dm:134)
rt.def("/obj/machinery/suit_storage_unit/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "uv"))) {
		if (truthy(rt.sv(f, "uv_super"))) {
			rt.callSrc(f, "add_overlay", ["super"]);
		} else {
			if (truthy(rt.sv(f, "occupant"))) {
				rt.callSrc(f, "add_overlay", ["uvhuman"]);
			} else {
				rt.callSrc(f, "add_overlay", ["uv"]);
			}
		}
	} else {
		if (truthy(rt.sv(f, "state_open"))) {
			if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
				rt.callSrc(f, "add_overlay", ["broken"]);
			} else {
				rt.callSrc(f, "add_overlay", ["open"]);
				if (truthy(rt.sv(f, "suit"))) {
					rt.callSrc(f, "add_overlay", ["suit"]);
				}
				if (truthy(rt.sv(f, "helmet"))) {
					rt.callSrc(f, "add_overlay", ["helm"]);
				}
				if (truthy(rt.sv(f, "storage"))) {
					rt.callSrc(f, "add_overlay", ["storage"]);
				}
			}
		} else {
			if (!truthy(rt.sv(f, "occupant"))) return f.dot;
			rt.callSrc(f, "add_overlay", ["human"]);
		}
	}
	return f.dot;
});

// /obj/machinery/suit_storage_unit/proc/power_change  (code/game/machinery/suit_storage_unit.dm:158)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/power_change", function* power_change(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((!truthy((yield* g.srcCall(f, "is_operational"))) && truthy(rt.sv(f, "state_open")))) {
		yield* g.srcCall(f, "open_machine");
		yield* g.srcCall(f, "dump_contents");
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/suit_storage_unit/proc/dump_contents  (code/game/machinery/suit_storage_unit.dm:165)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/dump_contents", function* dump_contents(f: Frame) {
	yield* g.srcCall(f, "dropContents");
	rt.setSv(f, "helmet", null);
	rt.setSv(f, "suit", null);
	rt.setSv(f, "mask", null);
	rt.setSv(f, "storage", null);
	rt.setSv(f, "occupant", null);
	return f.dot;
}, true);

// /obj/machinery/suit_storage_unit/proc/deconstruct  (code/game/machinery/suit_storage_unit.dm:173)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.srcCall(f, "open_machine");
		yield* g.srcCall(f, "dump_contents");
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/suit_storage_unit/proc/MouseDrop_T  (code/game/machinery/suit_storage_unit.dm:180)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, A: Value, user: Value) {
	let target: Value = null;
	f.vars = () => [A, user, target];
	if (((((truthy(rt.fv(f, "stat", live(user))) || truthy(rt.fv(f, "lying", live(user)))) || !truthy((yield* g.srcCall(f, "Adjacent", live(user))))) || !truthy((yield* g.srcCall(f, "Adjacent", live(A))))) || !truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	target = live(A);
	if (!truthy(rt.sv(f, "state_open"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The unit's doors are shut!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "is_operational")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The unit is not operational!</span>"]);
		return live(f.dot);
	}
	if ((((truthy(rt.sv(f, "occupant")) || truthy(rt.sv(f, "helmet"))) || truthy(rt.sv(f, "suit"))) || truthy(rt.sv(f, "storage")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>It's too cluttered inside to fit in!</span>"]);
		return live(f.dot);
	}
	if (isEqual(live(target), live(user))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ starts squeezing into ＀!</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You start working your way into ＀...</span>", [live(f.src)])]);
	} else {
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>＀ starts shoving ＀ into ＀!</span>", [live(user), live(target), live(f.src)]), fmt("<span class='userdanger'>＀ starts shoving you into ＀!</span>", [live(user), live(f.src)])]);
	}
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(target), 30])))) return f.dot;
	if ((((truthy(rt.sv(f, "occupant")) || truthy(rt.sv(f, "helmet"))) || truthy(rt.sv(f, "suit"))) || truthy(rt.sv(f, "storage")))) {
		return live(f.dot);
	}
	if (isEqual(live(target), live(user))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ slips into ＀ and closes the door behind them!</span>", [live(user), live(f.src)]), fmt("<span class=notice'>You slip into ＀'s cramped space and shut its door.</span>", [live(f.src)])]);
	} else {
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>＀ pushes ＀ into ＀ and shuts its door!<span>", [live(user), live(target), live(f.src)]), fmt("<span class='userdanger'>＀ shoves you into ＀ and shuts the door!</span>", [live(user), live(f.src)])]);
	}
	yield* g.srcCall(f, "close_machine", live(target));
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/machinery/suit_storage_unit/proc/cook  (code/game/machinery/suit_storage_unit.dm:210)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/cook", function* cook(f: Frame) {
	let mob_occupant: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [mob_occupant, I, $e];
	if (truthy(rt.sv(f, "uv_cycles"))) {
		rt.incSrcVar(f, "uv_cycles", -1, true);
		rt.setSv(f, "uv", 1);
		rt.setSv(f, "locked", 1);
		yield* g.srcCall(f, "update_icon");
		if (truthy(rt.sv(f, "occupant"))) {
			mob_occupant = rt.sv(f, "occupant");
			if (truthy(rt.sv(f, "uv_super"))) {
				yield* g.callName(f, live(mob_occupant), "adjustFireLoss", [(yield* g.call(f, P("/proc/rand"), null, [20, 36]))]);
			} else {
				yield* g.callName(f, live(mob_occupant), "adjustFireLoss", [(yield* g.call(f, P("/proc/rand"), null, [10, 16]))]);
			}
			yield* g.callName(f, live(mob_occupant), "emote", ["scream"]);
		}
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/suit_storage_unit/proc/cook")])), 50]);
	} else {
		rt.setSv(f, "uv_cycles", rt.initial(f, live(f.src), "uv_cycles"));
		rt.setSv(f, "uv", 0);
		rt.setSv(f, "locked", 0);
		if (truthy(rt.sv(f, "uv_super"))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀'s door creaks open with a loud whining noise. A cloud of foul black smoke escapes from its chamber.</span>", [live(f.src)]));
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/airlock_alien_prying.ogg"), 50, 1]);
			rt.setSv(f, "helmet", null);
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "helmet")]);
			rt.setSv(f, "suit", null);
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "suit")]);
			rt.setSv(f, "mask", null);
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "mask")]);
			rt.setSv(f, "storage", null);
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "storage")]);
			yield* g.callName(f, rt.sv(f, "wires"), "cut_all", []);
		} else {
			if (!truthy(rt.sv(f, "occupant"))) {
				yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀'s door slides open. The glowing yellow lights dim to a gentle green.</span>", [live(f.src)]));
			} else {
				yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀'s door slides open, barraging you with the nauseating smell of charred flesh.</span>", [live(f.src)]));
			}
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/airlockclose.ogg"), 25, 1]);
			I = null;
			rt.forList(f, 0, live(f.src), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				I = $e;
				yield* g.callName(f, live(I), "clean_blood", []);
				rt.setFv(f, "fingerprints", live(I), rt.list());
			}
			rt.endFor(f, 0);
		}
		yield* g.srcCall(f, "open_machine", 0);
		if (!truthy(rt.sv(f, "occupant"))) return f.dot;
		yield* g.srcCall(f, "dump_contents");
	}
	return f.dot;
}, true);

// /obj/machinery/suit_storage_unit/proc/shock  (code/game/machinery/suit_storage_unit.dm:253)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	let s: Value = null;
	f.vars = () => [user, prb, s];
	if (truthy(rt.op(f, "Prob", [], [live(prb)]))) return f.dot;
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [5, 1, live(f.src)]);
	yield* g.callName(f, live(s), "start", []);
	if (!truthy((yield* g.call(f, P("/proc/electrocute_mob"), null, [live(user), live(f.src), live(f.src), 1, 1])))) return f.dot;
	return 1;
}, true);

// /obj/machinery/suit_storage_unit/proc/relaymove  (code/game/machinery/suit_storage_unit.dm:261)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "container_resist", live(user));
	return f.dot;
}, true);

// /obj/machinery/suit_storage_unit/proc/container_resist  (code/game/machinery/suit_storage_unit.dm:264)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>You see ＀ kicking against the doors of ＀!</span>", [live(user), live(f.src)]), "<span class='notice'>You start kicking against the doors...</span>");
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/suit_storage_unit/proc/resist_open"), live(user)])), 300]);
	} else {
		yield* g.srcCall(f, "open_machine");
		yield* g.srcCall(f, "dump_contents");
	}
	return f.dot;
}, true);

// /obj/machinery/suit_storage_unit/proc/resist_open  (code/game/machinery/suit_storage_unit.dm:273)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/resist_open", function* resist_open(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(((!truthy(rt.sv(f, "state_open")) && truthy(rt.sv(f, "occupant"))) && truthy((rt.isIn(f, live(user), live(f.src)) ? 1 : 0))) && isEqual(rt.fv(f, "stat", live(user)), 0))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>You see ＀ bursts out of ＀!</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You escape the cramped confines of ＀!</span>", [live(f.src)]));
	yield* g.srcCall(f, "open_machine");
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// /obj/machinery/suit_storage_unit/proc/attackby  (code/game/machinery/suit_storage_unit.dm:278)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/attackby", function* attackby(f: Frame) {
	if ((truthy(rt.sv(f, "state_open")) && truthy((yield* g.srcCall(f, "is_operational"))))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/suit/space")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "suit"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The unit already contains a suit!.</span>"]);
				return live(f.dot);
			}
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			rt.setSv(f, "suit", live(f.args[0]));
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/head/helmet")) ? 1 : 0))) {
				if (truthy(rt.sv(f, "helmet"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The unit already contains a helmet!</span>"]);
					return live(f.dot);
				}
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				rt.setSv(f, "helmet", live(f.args[0]));
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/mask")) ? 1 : 0))) {
					if (truthy(rt.sv(f, "mask"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The unit already contains a mask!</span>"]);
						return live(f.dot);
					}
					if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
						return live(f.dot);
					}
					rt.setSv(f, "mask", live(f.args[0]));
				} else {
					if (truthy(rt.sv(f, "storage"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The auxiliary storage compartment is full!</span>"]);
						return live(f.dot);
					}
					if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
						return live(f.dot);
					}
					rt.setSv(f, "storage", live(f.args[0]));
				}
			}
		}
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ inserts ＀ into ＀</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You load ＀ into ＀.</span>", [live(f.args[0]), live(f.src)]));
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "panel_open")) && truthy((yield* g.call(f, P("/proc/is_wire_tool"), null, [live(f.args[0])]))))) {
		yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[1])]);
	}
	if (!truthy(rt.sv(f, "state_open"))) {
		if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "panel", "close", live(f.args[0]))))) {
			return live(f.dot);
		}
	}
	if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
		yield* g.srcCall(f, "dump_contents");
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/suit_storage_unit/proc/ui_interact  (code/game/machinery/suit_storage_unit.dm:326)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "suit_storage_unit", rt.sv(f, "name"), 400, 305, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/suit_storage_unit/proc/ui_data  (code/game/machinery/suit_storage_unit.dm:332)
rt.def("/obj/machinery/suit_storage_unit/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	f.vars = () => [data];
	rt.setAt((data = rt.list()), "locked", rt.sv(f, "locked"));
	rt.setAt(live(data), "open", rt.sv(f, "state_open"));
	rt.setAt(live(data), "safeties", rt.sv(f, "safeties"));
	rt.setAt(live(data), "uv_active", rt.sv(f, "uv"));
	rt.setAt(live(data), "uv_super", rt.sv(f, "uv_super"));
	if (truthy(rt.sv(f, "helmet"))) {
		rt.setAt(live(data), "helmet", rt.fv(f, "name", rt.sv(f, "helmet")));
	}
	if (truthy(rt.sv(f, "suit"))) {
		rt.setAt(live(data), "suit", rt.fv(f, "name", rt.sv(f, "suit")));
	}
	if (truthy(rt.sv(f, "mask"))) {
		rt.setAt(live(data), "mask", rt.fv(f, "name", rt.sv(f, "mask")));
	}
	if (truthy(rt.sv(f, "storage"))) {
		rt.setAt(live(data), "storage", rt.fv(f, "name", rt.sv(f, "storage")));
	}
	if (truthy(rt.sv(f, "occupant"))) {
		rt.setAt(live(data), "occupied", 1);
	}
	return live(data);
});

// /obj/machinery/suit_storage_unit/proc/ui_act  (code/game/machinery/suit_storage_unit.dm:351)  may sleep
rt.def("/obj/machinery/suit_storage_unit/proc/ui_act", function* ui_act(f: Frame) {
	let mob_occupant: Value = null, item_name: Value = null, I: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [mob_occupant, item_name, I, $0, $1, $2];
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || truthy(rt.sv(f, "uv")))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "door") {
		if (truthy(rt.sv(f, "state_open"))) {
			yield* g.srcCall(f, "close_machine");
		} else {
			yield* g.srcCall(f, "open_machine", 0);
			if (truthy(rt.sv(f, "occupant"))) {
				yield* g.srcCall(f, "dump_contents");
			}
		}
		f.dot = 1;
	} else if ($0 === "lock") {
		rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
		f.dot = 1;
	} else if ($0 === "uv") {
		if ((truthy(rt.sv(f, "occupant")) && truthy(rt.sv(f, "safeties")))) {
			return live(f.dot);
		} else {
			if (((((!truthy(rt.sv(f, "helmet")) && !truthy(rt.sv(f, "mask"))) && !truthy(rt.sv(f, "suit"))) && !truthy(rt.sv(f, "storage"))) && !truthy(rt.sv(f, "occupant")))) {
				return live(f.dot);
			} else {
				if (truthy(rt.sv(f, "occupant"))) {
					$0 = (mob_occupant = rt.sv(f, "occupant"));
					$1 = live(f.src);
					if (!truthy(rt.fv(f, "stat", live(mob_occupant)))) {
						$2 = "alive";
					} else {
						$2 = "away";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='userdanger'>＀'s confines grow warm, then hot, then scorching. You're being burned ＀!</span>", [$1, $2])]);
				}
				yield* g.srcCall(f, "cook");
				f.dot = 1;
			}
		}
	} else if ($0 === "dispense") {
		if (!truthy(rt.sv(f, "state_open"))) {
			return live(f.dot);
		}
		if (truthy((rt.isIn(f, (item_name = rt.at(live(f.args[1]), "item")), rt.gl("valid_items")) ? 1 : 0))) {
			I = rt.index(rt.sv(f, "vars"), live(item_name));
			rt.setAt(rt.sv(f, "vars"), live(item_name), null);
			if (truthy(live(I))) {
				yield* g.callName(f, live(I), "forceMove", [rt.sv(f, "loc")]);
			}
		}
		f.dot = 1;
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });
