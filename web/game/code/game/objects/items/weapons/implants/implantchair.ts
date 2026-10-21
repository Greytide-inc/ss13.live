// From code/game/objects/items/weapons/implants/implantchair.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10874, "/obj/machinery/implantchair", "/obj/machinery", {
	ready: 1,
	replenishing: 0,
	ready_implants: 5,
	max_implants: 5,
	injection_cooldown: 600,
	replenish_cooldown: 6000,
	implant_type: rt.typePath("/obj/item/weapon/implant/mindshield"),
	auto_inject: 0,
	auto_replenish: 1,
	special: 0,
	special_name: "special function",
	anchored: 1,
	name: "mindshield implanter",
	desc: "Used to implant occupants with mindshield implants.",
	icon: rt.rsc("icons/obj/machines/implantchair.dmi"),
	icon_state: "implantchair",
	density: 1,
	opacity: 0,
});

// /obj/machinery/implantchair/proc/New  (code/game/objects/items/weapons/implants/implantchair.dm:24)  may sleep
rt.def("/obj/machinery/implantchair/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "open_machine");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/implantchair/proc/ui_interact  (code/game/objects/items/weapons/implants/implantchair.dm:32)  may sleep
rt.def("/obj/machinery/implantchair/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "implantchair", rt.sv(f, "name"), 375, 280, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/implantchair/proc/ui_data  (code/game/objects/items/weapons/implants/implantchair.dm:39)
rt.def("/obj/machinery/implantchair/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, mob_occupant: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [data, mob_occupant, $0, $1, $2];
	$0 = (data = rt.list());
	$1 = "occupied";
	if (truthy(rt.sv(f, "occupant"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	rt.setAt(live(data), "open", rt.sv(f, "state_open"));
	rt.setAt(live(data), "occupant", rt.list());
	if (truthy(rt.sv(f, "occupant"))) {
		mob_occupant = rt.sv(f, "occupant");
		rt.setAt(rt.at(live(data), "occupant"), "name", rt.fv(f, "name", live(mob_occupant)));
		rt.setAt(rt.at(live(data), "occupant"), "stat", rt.fv(f, "stat", live(mob_occupant)));
	}
	$0 = live(data);
	$1 = "special_name";
	if (truthy(rt.sv(f, "special"))) {
		$2 = rt.sv(f, "special_name");
	} else {
		$2 = null;
	}
	rt.setAt($0, $1, $2);
	rt.setAt(live(data), "ready_implants", rt.sv(f, "ready_implants"));
	rt.setAt(live(data), "ready", rt.sv(f, "ready"));
	rt.setAt(live(data), "replenishing", rt.sv(f, "replenishing"));
	return live(data);
});

// /obj/machinery/implantchair/proc/ui_act  (code/game/objects/items/weapons/implants/implantchair.dm:57)  may sleep
rt.def("/obj/machinery/implantchair/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "door") {
		if (truthy(rt.sv(f, "state_open"))) {
			yield* g.srcCall(f, "close_machine");
		} else {
			yield* g.srcCall(f, "open_machine");
		}
		f.dot = 1;
	} else if ($0 === "implant") {
		yield* g.srcCall(f, "implant", rt.sv(f, "occupant"), live(f.usr));
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/implantchair/proc/implant  (code/game/objects/items/weapons/implants/implantchair.dm:71)  may sleep
rt.def("/obj/machinery/implantchair/proc/implant", function* implant(f: Frame, M: Value, user: Value) {
	f.vars = () => [M, user];
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "ready_implants")) || !truthy(rt.sv(f, "ready")))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "implant_action", live(M), live(user))))) {
		rt.incSrcVar(f, "ready_implants", -1, true);
		if ((!truthy(rt.sv(f, "replenishing")) && truthy(rt.sv(f, "auto_replenish")))) {
			rt.setSv(f, "replenishing", 1);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), "replenish"])), rt.sv(f, "replenish_cooldown")]);
		}
		if (rt.gt(rt.sv(f, "injection_cooldown"), 0)) {
			rt.setSv(f, "ready", 0);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), "set_ready"])), rt.sv(f, "injection_cooldown")]);
		}
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/buzz-sigh.ogg"), 25, 1]);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/implantchair/proc/implant_action  (code/game/objects/items/weapons/implants/implantchair.dm:88)  may sleep
rt.def("/obj/machinery/implantchair/proc/implant_action", function* implant_action(f: Frame, M: Value) {
	let I: Value = null;
	f.vars = () => [M, I];
	if (!truthy((yield* g.callName(f, (I = (yield* g.new_(f, rt.sv(f, "implant_type"), []))), "implant", [live(M)])))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ has been implanted by the ＀.</span>", [live(M), rt.sv(f, "name")]));
	return 1;
}, true);

// /obj/machinery/implantchair/proc/update_icon  (code/game/objects/items/weapons/implants/implantchair.dm:94)
rt.def("/obj/machinery/implantchair/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	if (truthy(rt.sv(f, "state_open"))) {
		rt.modSrcVar(f, "icon_state", "_open", add);
	}
	if (truthy(rt.sv(f, "occupant"))) {
		rt.modSrcVar(f, "icon_state", "_occupied", add);
	}
	if (truthy(rt.sv(f, "ready"))) {
		rt.callSrc(f, "add_overlay", ["ready"]);
	} else {
		rt.callSrc(f, "cut_overlays", []);
	}
	return f.dot;
});

// /obj/machinery/implantchair/proc/replenish  (code/game/objects/items/weapons/implants/implantchair.dm:105)  may sleep
rt.def("/obj/machinery/implantchair/proc/replenish", function* replenish(f: Frame) {
	if (rt.lt(rt.sv(f, "ready_implants"), rt.sv(f, "max_implants"))) {
		rt.incSrcVar(f, "ready_implants", 1, true);
	}
	if (rt.lt(rt.sv(f, "ready_implants"), rt.sv(f, "max_implants"))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), "replenish"])), rt.sv(f, "replenish_cooldown")]);
	} else {
		rt.setSv(f, "replenishing", 0);
	}
	return f.dot;
}, true);

// /obj/machinery/implantchair/proc/set_ready  (code/game/objects/items/weapons/implants/implantchair.dm:114)
rt.def("/obj/machinery/implantchair/proc/set_ready", function set_ready(f: Frame) {
	rt.setSv(f, "ready", 1);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/implantchair/proc/container_resist  (code/game/objects/items/weapons/implants/implantchair.dm:119)  may sleep
rt.def("/obj/machinery/implantchair/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "state_open"))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "changeNext_move", [100]);
	rt.setFv(f, "last_special", live(user), add(rt.worldTime(f), 100));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You lean on the back of ＀ and start pushing the door open... (this will take about about a minute.)</span>", [live(f.src)])]);
	yield* g.callSrc(f, "audible_message", [null, fmt("<span class='italics'>You hear a metallic creaking from ＀!</span>", [live(f.src)]), "hearing_distance", 2], rt.Args.Named);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 600, "target", live(f.src)], rt.Args.Named)))) return f.dot;
	if ((((!truthy(live(user)) || !isEqual(rt.fv(f, "stat", live(user)), 0)) || !isEqual(rt.fv(f, "loc", live(user)), live(f.src))) || truthy(rt.sv(f, "state_open")))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ successfully broke out of ＀!</span>", [live(user), live(f.src)]));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You successfully break out of ＀!</span>", [live(f.src)])]);
	yield* g.srcCall(f, "open_machine");
	return f.dot;
}, true);

// /obj/machinery/implantchair/proc/relaymove  (code/game/objects/items/weapons/implants/implantchair.dm:132)  may sleep
rt.def("/obj/machinery/implantchair/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "container_resist", live(user));
	return f.dot;
}, true);

// /obj/machinery/implantchair/proc/MouseDrop_T  (code/game/objects/items/weapons/implants/implantchair.dm:135)  may sleep
rt.def("/obj/machinery/implantchair/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	if ((((((truthy(rt.fv(f, "stat", live(user))) || truthy(rt.fv(f, "lying", live(user)))) || !truthy((yield* g.srcCall(f, "Adjacent", live(user))))) || !truthy((yield* g.callName(f, live(user), "Adjacent", [live(target)])))) || !truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) || !truthy((yield* g.callName(f, live(user), "IsAdvancedToolUser", []))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "close_machine", live(target));
	return f.dot;
}, true);

// /obj/machinery/implantchair/proc/close_machine  (code/game/objects/items/weapons/implants/implantchair.dm:140)  may sleep
rt.def("/obj/machinery/implantchair/proc/close_machine", function* close_machine(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!((live(user) === null || truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) && truthy(rt.sv(f, "state_open")))) return f.dot;
	yield* g.callSuper(f, [live(user)]);
	if (!((truthy(rt.sv(f, "auto_inject")) && truthy(rt.sv(f, "ready"))) && rt.gt(rt.sv(f, "ready_implants"), 0))) return f.dot;
	yield* g.srcCall(f, "implant", live(user), null);
	return f.dot;
}, true);

rt.type(10875, "/obj/machinery/implantchair/genepurge", "/obj/machinery/implantchair", {
	special: 1,
	special_name: "Purge genome",
	injection_cooldown: 0,
	replenish_cooldown: 300,
	name: "Genetic purifier",
	desc: "Used to purge human genome of foreign influences",
});

// /obj/machinery/implantchair/genepurge/proc/implant_action  (code/game/objects/items/weapons/implants/implantchair.dm:154)  may sleep
rt.def("/obj/machinery/implantchair/genepurge/proc/implant_action", function* implant_action(f: Frame, H: Value, user: Value) {
	f.vars = () => [H, user];
	if (!truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 0;
	}
	yield* g.callName(f, live(H), "set_species", [T("/datum/species/human"), 1]);
	yield* g.call(f, P("/proc/purrbation_remove"), null, [live(H)]);
	yield* g.callName(f, rt.fv(f, "dna", live(H)), "remove_all_mutations", []);
	return 1;
}, true);

rt.type(10876, "/obj/machinery/implantchair/brainwash", "/obj/machinery/implantchair", {
	objective: "Obey the law. Praise Nanotrasen.",
	custom: 0,
	special_name: "Imprint",
	injection_cooldown: 3000,
	auto_inject: 0,
	auto_replenish: 0,
	special: 1,
	name: "Neural Imprinter",
	desc: "Used to <s>indoctrinate</s> rehabilitate hardened recidivists.",
});

// /obj/machinery/implantchair/brainwash/proc/implant_action  (code/game/objects/items/weapons/implants/implantchair.dm:174)  may sleep
rt.def("/obj/machinery/implantchair/brainwash/proc/implant_action", function* implant_action(f: Frame, C: Value, user: Value) {
	let custom_objective: Value = null;
	f.vars = () => [C, user, custom_objective];
	if ((!truthy((rt.istype(live(C), T("/mob/living")) ? 1 : 0)) || !truthy(rt.fv(f, "mind", live(C))))) {
		return 0;
	}
	if (truthy(rt.sv(f, "custom"))) {
		if ((!truthy(live(user)) || !truthy((yield* g.callName(f, live(user), "Adjacent", [live(f.src)]))))) {
			return 0;
		}
		rt.setSv(f, "objective", (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), fmt("What order do you want to imprint on ＀?", [live(C)]), "Enter the order", "", 120])));
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ set brainwash machine objective to '＀'.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), rt.sv(f, "objective")])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ set brainwash machine objective to '＀'.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), rt.sv(f, "objective")])]);
	}
	rt.setFv(f, "owner", (custom_objective = (yield* g.new_(f, T("/datum/objective"), [rt.sv(f, "objective")]))), rt.fv(f, "mind", live(C)));
	rt.modField(f, rt.fv(f, "mind", live(C)), "objectives", live(custom_objective), add);
	yield* g.callName(f, rt.fv(f, "mind", live(C)), "announce_objectives", []);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ brainwashed ＀ with objective '＀'.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(C)])), rt.sv(f, "objective")])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ brainwashed ＀ with objective '＀'.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(C)])), rt.sv(f, "objective")])]);
	return 1;
}, true);
