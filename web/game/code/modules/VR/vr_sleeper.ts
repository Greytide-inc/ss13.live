// From code/modules/VR/vr_sleeper.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10998, "/obj/machinery/vr_sleeper", "/obj/machinery", {
	you_die_in_the_game_you_die_for_real: 0,
	sparks: null,
	vr_human: null,
	vr_category: "default",
	allow_creating_vr_humans: 1,
	outfit: rt.typePath("/datum/outfit/vr_basic"),
	state_open: 1,
	anchored: 1,
	occupant_typecache: null,
	name: "virtual reality sleeper",
	desc: "a sleeper modified to alter the subconscious state of the user, allowing them to visit virtual worlds",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
}, { global: { available_vr_spawnpoints: 772 } });

// /obj/machinery/vr_sleeper/proc/<init>  (code/modules/VR/vr_sleeper.dm:12)
rt.def("/obj/machinery/vr_sleeper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "occupant_typecache", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /obj/machinery/vr_sleeper/proc/Initialize  (code/modules/VR/vr_sleeper.dm:22)  may sleep
rt.def("/obj/machinery/vr_sleeper/proc/Initialize", function* Initialize(f: Frame) {
	let V: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [V, _T, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "sparks", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	yield* g.callName(f, rt.sv(f, "sparks"), "set_up", [2, 0]);
	yield* g.callName(f, rt.sv(f, "sparks"), "attach", [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	if (!(!truthy(rt.gl("available_vr_spawnpoints")) || !truthy(rt.len(f, rt.gl("available_vr_spawnpoints"))))) return f.dot;
	rt.setGl("available_vr_spawnpoints", rt.list());
	V = null;
	rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark/vr_spawn"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		rt.setAt(rt.gl("available_vr_spawnpoints"), rt.fv(f, "vr_category", live(V)), rt.list());
		if (truthy((_T = rt.getStep(f, live(V), 0)))) {
			(rt.modAt(rt.gl("available_vr_spawnpoints"), rt.fv(f, "vr_category", live(V)), live(_T), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/vr_sleeper/proc/attack_hand  (code/modules/VR/vr_sleeper.dm:40)  may sleep
rt.def("/obj/machinery/vr_sleeper/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "occupant"))) {
		yield* g.srcCall(f, "ui_interact", live(user));
	} else {
		if (truthy(rt.sv(f, "state_open"))) {
			yield* g.srcCall(f, "close_machine");
		} else {
			yield* g.srcCall(f, "open_machine");
		}
	}
	return f.dot;
}, true);

// /obj/machinery/vr_sleeper/proc/relaymove  (code/modules/VR/vr_sleeper.dm:49)  may sleep
rt.def("/obj/machinery/vr_sleeper/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "open_machine");
	return f.dot;
}, true);

// /obj/machinery/vr_sleeper/proc/Destroy  (code/modules/VR/vr_sleeper.dm:53)  may sleep
rt.def("/obj/machinery/vr_sleeper/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "open_machine");
	yield* g.srcCall(f, "cleanup_vr_human");
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "sparks")]);
	rt.setSv(f, "sparks", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/vr_sleeper/proc/emag_act  (code/modules/VR/vr_sleeper.dm:62)
rt.def("/obj/machinery/vr_sleeper/proc/emag_act", function emag_act(f: Frame, user: Value) {
	rt.setSv(f, "you_die_in_the_game_you_die_for_real", 1);
	rt.callName(f, rt.sv(f, "sparks"), "start", []);
	return f.dot;
});

// /obj/machinery/vr_sleeper/proc/update_icon  (code/modules/VR/vr_sleeper.dm:66)
rt.def("/obj/machinery/vr_sleeper/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "state_open"))) {
		$1 = "-open";
	} else {
		$1 = "";
	}
	rt.setSv(f, "icon_state", fmt("＀＀", [$0, $1]));
	return f.dot;
});

// /obj/machinery/vr_sleeper/proc/open_machine  (code/modules/VR/vr_sleeper.dm:70)  may sleep
rt.def("/obj/machinery/vr_sleeper/proc/open_machine", function* open_machine(f: Frame) {
	if (truthy(rt.sv(f, "state_open"))) return f.dot;
	if (truthy(rt.sv(f, "vr_human"))) {
		yield* g.callName(f, rt.sv(f, "vr_human"), "revert_to_reality", [0, 0]);
	}
	if (truthy(rt.sv(f, "occupant"))) {
		yield* g.callName(f, rt.gl("SStgui"), "close_user_uis", [rt.sv(f, "occupant"), live(f.src)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/vr_sleeper/proc/close_machine  (code/modules/VR/vr_sleeper.dm:79)  may sleep
rt.def("/obj/machinery/vr_sleeper/proc/close_machine", function* close_machine(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "occupant"))) return f.dot;
	yield* g.srcCall(f, "ui_interact", rt.sv(f, "occupant"));
	return f.dot;
}, true);

// /obj/machinery/vr_sleeper/proc/ui_interact  (code/modules/VR/vr_sleeper.dm:85)  may sleep
rt.def("/obj/machinery/vr_sleeper/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "vr_sleeper", "VR Sleeper", 475, 340, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/vr_sleeper/proc/ui_act  (code/modules/VR/vr_sleeper.dm:92)  may sleep
rt.def("/obj/machinery/vr_sleeper/proc/ui_act", function* ui_act(f: Frame) {
	let human_occupant: Value = null, _T: Value = null;
	let $0: any;
	f.vars = () => [human_occupant, _T, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "vr_connect") {
		if ((truthy((human_occupant = rt.sv(f, "occupant"))) && truthy(rt.fv(f, "mind", live(human_occupant))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupant"), "<span class='warning'>Transfering to virtual reality...</span>"]);
			if (truthy(rt.sv(f, "vr_human"))) {
				yield* g.callName(f, rt.sv(f, "vr_human"), "revert_to_reality", [0, 0]);
				yield* g.callName(f, rt.fv(f, "mind", live(human_occupant)), "transfer_to", [rt.sv(f, "vr_human")]);
				rt.setFv(f, "real_me", rt.sv(f, "vr_human"), rt.sv(f, "occupant"));
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "vr_human"), fmt("<span class='notice'>Transfer successful! you are now playing as ＀ in VR!</span>", [rt.sv(f, "vr_human")])]);
				yield* g.callName(f, rt.gl("SStgui"), "close_user_uis", [rt.sv(f, "vr_human"), live(f.src)]);
			} else {
				if (truthy(rt.sv(f, "allow_creating_vr_humans"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupant"), "<span class='warning'>Virtual avatar not found, attempting to create one...</span>"]);
					if (truthy((_T = (yield* g.srcCall(f, "get_vr_spawnpoint"))))) {
						yield* g.srcCall(f, "build_virtual_human", rt.sv(f, "occupant"), live(_T));
						yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "vr_human"), fmt("<span class='notice'>Transfer successful! you are now playing as ＀ in VR!</span>", [rt.sv(f, "vr_human")])]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupant"), "<span class='warning'>Virtual world misconfigured, aborting transfer</span>"]);
					}
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupant"), "<span class='warning'>The virtual world does not support the creation of new virtual avatars, aborting transfer</span>"]);
				}
			}
		}
		f.dot = 1;
	} else if ($0 === "delete_avatar") {
		if ((!truthy(rt.sv(f, "occupant")) || isEqual(live(f.usr), rt.sv(f, "occupant")))) {
			if (truthy(rt.sv(f, "vr_human"))) {
				yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "vr_human")]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>The VR Sleeper's safeties prevent you from doing that."]);
		}
		f.dot = 1;
	} else if ($0 === "toggle_open") {
		if (truthy(rt.sv(f, "state_open"))) {
			yield* g.srcCall(f, "close_machine");
		} else {
			yield* g.srcCall(f, "open_machine");
		}
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/vr_sleeper/proc/ui_data  (code/modules/VR/vr_sleeper.dm:133)
rt.def("/obj/machinery/vr_sleeper/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, status: Value = null;
	let $0: any;
	f.vars = () => [data, status, $0];
	data = rt.list();
	if ((truthy(rt.sv(f, "vr_human")) && !(!truthy(rt.sv(f, "vr_human")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "vr_human")))))) {
		rt.setAt(live(data), "can_delete_avatar", 1);
		status = null;
		$0 = rt.fv(f, "stat", live(user));
		if ($0 === 0) {
			status = "Conscious";
		} else if ($0 === 2) {
			status = "Dead";
		} else if ($0 === 1) {
			status = "Unconscious";
		}
		rt.setAt(live(data), "vr_avatar", rt.alist(f, ["name", rt.fv(f, "name", rt.sv(f, "vr_human")), "status", live(status), "health", rt.fv(f, "health", rt.sv(f, "vr_human")), "maxhealth", rt.fv(f, "maxHealth", rt.sv(f, "vr_human"))]));
	}
	rt.setAt(live(data), "toggle_open", rt.sv(f, "state_open"));
	rt.setAt(live(data), "isoccupant", (isEqual(live(user), rt.sv(f, "occupant")) ? 1 : 0));
	return live(data);
});

// /obj/machinery/vr_sleeper/proc/get_vr_spawnpoint  (code/modules/VR/vr_sleeper.dm:151)
rt.def("/obj/machinery/vr_sleeper/proc/get_vr_spawnpoint", function get_vr_spawnpoint(f: Frame) {
	return rt.call(f, P("/proc/safepick"), null, [rt.index(rt.gl("available_vr_spawnpoints"), rt.sv(f, "vr_category"))]);
});

// /obj/machinery/vr_sleeper/proc/build_virtual_human  (code/modules/VR/vr_sleeper.dm:156)  may sleep
rt.def("/obj/machinery/vr_sleeper/proc/build_virtual_human", function* build_virtual_human(f: Frame, H: Value, location: Value, transfer: Value) {
	let O: Value = null;
	f.vars = () => [H, location, transfer, O];
	if (live(transfer) === null) {
		transfer = 1;
	}
	if (!truthy(live(H))) return f.dot;
	yield* g.srcCall(f, "cleanup_vr_human");
	rt.setSv(f, "vr_human", (yield* g.new_(f, T("/mob/living/carbon/human/virtual_reality"), [live(location)])));
	rt.setFv(f, "vr_sleeper", rt.sv(f, "vr_human"), live(f.src));
	rt.setFv(f, "real_me", rt.sv(f, "vr_human"), live(H));
	yield* g.callName(f, rt.fv(f, "dna", live(H)), "transfer_identity", [rt.sv(f, "vr_human")]);
	rt.setFv(f, "name", rt.sv(f, "vr_human"), rt.fv(f, "name", live(H)));
	rt.setFv(f, "real_name", rt.sv(f, "vr_human"), rt.fv(f, "real_name", live(H)));
	rt.setFv(f, "socks", rt.sv(f, "vr_human"), rt.fv(f, "socks", live(H)));
	rt.setFv(f, "undershirt", rt.sv(f, "vr_human"), rt.fv(f, "undershirt", live(H)));
	rt.setFv(f, "underwear", rt.sv(f, "vr_human"), rt.fv(f, "underwear", live(H)));
	yield* g.callName(f, rt.sv(f, "vr_human"), "updateappearance", [1, 1, 1]);
	if (truthy(rt.sv(f, "outfit"))) {
		yield* g.callName(f, (O = (yield* g.new_(f, rt.sv(f, "outfit"), []))), "equip", [rt.sv(f, "vr_human")]);
	}
	if (!(truthy(live(transfer)) && truthy(rt.fv(f, "mind", live(H))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "mind", live(H)), "transfer_to", [rt.sv(f, "vr_human")]);
	return f.dot;
}, true);

// /obj/machinery/vr_sleeper/proc/cleanup_vr_human  (code/modules/VR/vr_sleeper.dm:176)  may sleep
rt.def("/obj/machinery/vr_sleeper/proc/cleanup_vr_human", function* cleanup_vr_human(f: Frame) {
	if (!truthy(rt.sv(f, "vr_human"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "vr_human"), "death", [0]);
	return f.dot;
}, true);
