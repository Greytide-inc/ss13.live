// From code/modules/ruins/objects_and_mobs/necropolis_gate.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12990, "/obj/structure/necropolis_gate", "/obj/structure", {
	open: 0,
	changing_openness: 0,
	locked: 0,
	sight_blocker: null,
	sight_blocker_distance: 1,
	anchored: 1,
	light_range: 8,
	light_color: "#C48A18",
	name: "necropolis gate",
	desc: "A massive stone gateway.",
	icon: rt.rsc("icons/effects/96x96.dmi"),
	icon_state: "gate_full",
	appearance_flags: 0,
	layer: 2.8,
	density: 1,
	pixel_x: -32,
	pixel_y: -32,
	resistance_flags: 115,
}, { global: { top_overlay: 805, door_overlay: 806, dais_overlay: 807 } });

// /obj/structure/necropolis_gate/proc/Initialize  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:26)  may sleep
rt.def("/obj/structure/necropolis_gate/proc/Initialize", function* Initialize(f: Frame) {
	let sight_blocker_turf: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [sight_blocker_turf, i, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	sight_blocker_turf = rt.getStep(f, live(f.src), 0);
	if (truthy(rt.sv(f, "sight_blocker_distance"))) {
		i = null;
		rt.forRange(f, 0, 1, rt.sv(f, "sight_blocker_distance"), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (!truthy(live(sight_blocker_turf))) {
				break;
			}
			sight_blocker_turf = rt.getStep(f, live(sight_blocker_turf), 1);
		}
		rt.endFor(f, 0);
	}
	if (truthy(live(sight_blocker_turf))) {
		rt.setSv(f, "sight_blocker", (yield* g.new_(f, T("/obj/structure/opacity_blocker"), [live(sight_blocker_turf)])));
	}
	rt.setSv(f, "icon_state", "gate_bottom");
	rt.setGl("top_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/96x96.dmi"), "gate_top"])));
	rt.setFv(f, "layer", rt.gl("top_overlay"), 4.300000190734863);
	yield* g.srcCall(f, "add_overlay", rt.gl("top_overlay"));
	rt.setGl("door_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/96x96.dmi"), "door"])));
	rt.setFv(f, "layer", rt.gl("door_overlay"), 4.300000190734863);
	yield* g.srcCall(f, "add_overlay", rt.gl("door_overlay"));
	rt.setGl("dais_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/96x96.dmi"), "gate_dais"])));
	rt.setFv(f, "layer", rt.gl("dais_overlay"), 2.049999952316284);
	yield* g.srcCall(f, "add_overlay", rt.gl("dais_overlay"));
	return f.dot;
}, true);

// /obj/structure/necropolis_gate/proc/Destroy  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:48)  may sleep
rt.def("/obj/structure/necropolis_gate/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(live(f.args[0]))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "sight_blocker"), 1]);
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	} else {
		return 1;
	}
	return f.dot;
}, true, { args: ["force"] });

rt.type(12993, "/obj/structure/opacity_blocker", "/obj/structure", {
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "nothing",
	mouse_opacity: 0,
	opacity: 1,
});

// /obj/structure/opacity_blocker/proc/Destroy  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:67)  may sleep
rt.def("/obj/structure/opacity_blocker/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(live(f.args[0]))) {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	} else {
		return 1;
	}
	return f.dot;
}, true, { args: ["force"] });

// /obj/structure/necropolis_gate/proc/attack_hand  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:73)  may sleep
rt.def("/obj/structure/necropolis_gate/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [user, $0, $1];
	if (truthy(rt.sv(f, "locked"))) {
		$0 = live(user);
		if (truthy(rt.sv(f, "open"))) {
			$1 = "stuck open";
		} else {
			$1 = "locked";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='boldannounce'>It's ＀.</span>", [$1])]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "toggle_the_gate", live(user));
	return f.dot;
}, true);

// /obj/structure/necropolis_gate/proc/toggle_the_gate  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:81)  may sleep
rt.def("/obj/structure/necropolis_gate/proc/toggle_the_gate", function* toggle_the_gate(f: Frame, user: Value, legion_damaged: Value) {
	let _T: Value = null, sight_blocker_turf: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [user, legion_damaged, _T, sight_blocker_turf, i, $e];
	if (truthy(rt.sv(f, "changing_openness"))) {
		return live(f.dot);
	}
	rt.setSv(f, "changing_openness", 1);
	_T = rt.getStep(f, live(f.src), 0);
	if (truthy(rt.sv(f, "open"))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/necropolis"), [live(_T)]);
		yield* g.srcCall(f, "visible_message", "<span class='boldwarning'>The door slams closed!</span>");
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		yield* g.call(f, P("/proc/playsound"), null, [null, live(_T), null, rt.rsc("sound/effects/stonedoor_openclose.ogg"), null, 300, null, 1, "frequency", 80000], rt.Args.Named);
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		rt.setSv(f, "density", 1);
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		sight_blocker_turf = rt.getStep(f, live(f.src), 0);
		if (truthy(rt.sv(f, "sight_blocker_distance"))) {
			i = null;
			rt.forRange(f, 0, 1, rt.sv(f, "sight_blocker_distance"), 1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				if (!truthy(live(sight_blocker_turf))) {
					break;
				}
				sight_blocker_turf = rt.getStep(f, live(sight_blocker_turf), 1);
			}
			rt.endFor(f, 0);
		}
		if (truthy(live(sight_blocker_turf))) {
			yield* g.callName(f, rt.sv(f, "sight_blocker"), "forceMove", [live(sight_blocker_turf)]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [2.5]);
		yield* g.call(f, P("/proc/playsound"), null, [null, live(_T), null, rt.rsc("sound/magic/clockwork/invoke_general.ogg"), null, 30, null, 1, "frequency", 15000], rt.Args.Named);
		yield* g.srcCall(f, "add_overlay", rt.gl("door_overlay"));
		rt.setSv(f, "open", 0);
	} else {
		yield* g.srcCall(f, "cut_overlay", rt.gl("door_overlay"));
		yield* g.new_(f, T("/obj/effect/temp_visual/necropolis/open"), [live(_T)]);
		yield* g.call(f, P("/proc/sleep"), null, [2]);
		yield* g.srcCall(f, "visible_message", "<span class='warning'>The door starts to grind open...</span>");
		yield* g.call(f, P("/proc/playsound"), null, [null, live(_T), null, rt.rsc("sound/effects/stonedoor_openclose.ogg"), null, 300, null, 1, "frequency", 20000], rt.Args.Named);
		yield* g.call(f, P("/proc/sleep"), null, [22]);
		yield* g.callName(f, rt.sv(f, "sight_blocker"), "forceMove", [live(f.src)]);
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		rt.setSv(f, "density", 0);
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		rt.setSv(f, "open", 1);
	}
	rt.setSv(f, "changing_openness", 0);
	return 1;
}, true);

// /datum/controller/global_vars/proc/InitGlobalnecropolis_gate  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:120)
rt.def("/datum/controller/global_vars/proc/InitGlobalnecropolis_gate", function InitGlobalnecropolis_gate(f: Frame) {
	rt.setGl("necropolis_gate", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "necropolis_gate", add);
	return f.dot;
});

rt.type(12992, "/obj/structure/necropolis_gate/legion_gate", "/obj/structure/necropolis_gate", {
	sight_blocker_distance: 2,
	desc: "A tremendous, impossibly large gateway, set into a massive tower of stone.",
});

// /obj/structure/necropolis_gate/legion_gate/proc/Initialize  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:126)  may sleep
rt.def("/obj/structure/necropolis_gate/legion_gate/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setGl("necropolis_gate", live(f.src));
	return f.dot;
}, true);

// /obj/structure/necropolis_gate/legion_gate/proc/Destroy  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:131)  may sleep
rt.def("/obj/structure/necropolis_gate/legion_gate/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(live(f.args[0]))) {
		if (isEqual(rt.gl("necropolis_gate"), live(f.src))) {
			rt.setGl("necropolis_gate", null);
		}
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	} else {
		return 1;
	}
	return f.dot;
}, true, { args: ["force"] });

// /obj/structure/necropolis_gate/legion_gate/proc/attack_hand  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:138)  may sleep
rt.def("/obj/structure/necropolis_gate/legion_gate/proc/attack_hand", function* attack_hand(f: Frame) {
	let safety: Value = null;
	f.vars = () => [safety];
	if ((!truthy(rt.sv(f, "open")) && !truthy(rt.sv(f, "changing_openness")))) {
		if ((((((isEqual((safety = (yield* g.call(f, P("/proc/alert"), null, [live(f.args[0]), "You think this might be a bad idea...", "Knock on the door?", "Proceed", "Abort"]))), "Abort") || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 1)) || !truthy(live(f.src))) || truthy(rt.sv(f, "open"))) || truthy(rt.sv(f, "changing_openness"))) || truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", []))))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ knocks on ＀...</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='boldannounce'>You tentatively knock on ＀...</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[0])), rt.rsc("sound/effects/shieldbash.ogg"), 100, 1]);
		yield* g.call(f, P("/proc/sleep"), null, [50]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/necropolis_gate/legion_gate/proc/toggle_the_gate  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:150)  may sleep
rt.def("/obj/structure/necropolis_gate/legion_gate/proc/toggle_the_gate", function* toggle_the_gate(f: Frame) {
	let _T: Value = null, M: Value = null, release_overlay: Value = null;
	let $0: any, $e: any;
	f.vars = () => [_T, M, release_overlay, $0, $e];
	if (truthy(rt.sv(f, "open"))) {
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	rt.setSv(f, "locked", 1);
	_T = rt.getStep(f, live(f.src), 0);
	yield* g.srcCall(f, "visible_message", "<span class='userdanger'>Something horrible emerges from the Necropolis!</span>");
	if (truthy(live(f.args[1]))) {
		yield* g.call(f, P("/proc/message_admins"), null, ["Legion took damage while the necropolis gate was closed, and has released itself!"]);
		yield* g.call(f, P("/proc/log_game"), null, ["Legion took damage while the necropolis gate was closed and released itself."]);
	} else {
		if (truthy(live(f.args[0]))) {
			$0 = "key_name_admin(user)";
		} else {
			$0 = "Unknown";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has released Legion!", [$0])]);
		if (truthy(live(f.args[0]))) {
			$0 = "key_name(user)";
		} else {
			$0 = "Unknown";
		}
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ released Legion.", [$0])]);
	}
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "z", live(M)), rt.sv(f, "z"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>Discordant whispers flood your mind in a thousand voices. Each one speaks your name, over and over. Something horrible has been released.</span>"]);
			yield* g.callName(f, live(M), "playsound_local", [null, live(_T), null, rt.rsc("sound/creatures/legion_spawn.ogg"), null, 100, null, 0, null, 0, null, 0, "pressure_affected", 0], rt.Args.Named);
			yield* g.call(f, P("/proc/flash_color"), null, [null, live(M), "flash_color", "#FF0000", "flash_time", 50], rt.Args.Named);
		}
	}
	rt.endFor(f, 0);
	release_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/effects.dmi"), "legiondoor"]));
	yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("Legion has been released in the ＀!", [(yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))]), "source", live(f.src), "alert_overlay", live(release_overlay), "action", "jump"], rt.Args.Named);
	return f.dot;
}, true, { args: ["user", "legion_damaged"] });

rt.type(12994, "/obj/structure/necropolis_arch", "/obj/structure", {
	open: 0,
	anchored: 1,
	name: "necropolis arch",
	desc: "A massive arch over the necropolis gate, set into a massive tower of stone.",
	icon: rt.rsc("icons/effects/160x160.dmi"),
	icon_state: "arch_full",
	appearance_flags: 0,
	layer: 2.8,
	pixel_x: -64,
	pixel_y: -40,
	resistance_flags: 115,
}, { global: { top_overlay: 808 } });

// /obj/structure/necropolis_arch/proc/Initialize  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:197)
rt.def("/obj/structure/necropolis_arch/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", "arch_bottom");
	rt.setGl("top_overlay#2", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/160x160.dmi"), "arch_top"]));
	rt.setFv(f, "layer", rt.gl("top_overlay#2"), 4.300000190734863);
	rt.callSrc(f, "add_overlay", [rt.gl("top_overlay#2")]);
	return f.dot;
});

// /obj/structure/necropolis_arch/proc/Destroy  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:208)  may sleep
rt.def("/obj/structure/necropolis_arch/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(live(f.args[0]))) {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	} else {
		return 1;
	}
	return f.dot;
}, true, { args: ["force"] });

rt.type(12995, "/obj/structure/stone_tile", "/obj/structure", {
	tile_key: "pristine_tile",
	tile_random_sprite_max: 24,
	anchored: 1,
	name: "stone tile",
	icon: rt.rsc("icons/turf/boss_floors.dmi"),
	icon_state: "pristine_tile1",
	layer: 2.04,
	resistance_flags: 115,
});

// /obj/structure/stone_tile/proc/Initialize  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:224)
rt.def("/obj/structure/stone_tile/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "tile_key"), rt.call(f, P("/proc/rand"), null, [1, rt.sv(f, "tile_random_sprite_max")])]));
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/structure/stone_tile/proc/Destroy  (code/modules/ruins/objects_and_mobs/necropolis_gate.dm:229)  may sleep
rt.def("/obj/structure/stone_tile/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(live(f.args[0]))) {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	} else {
		return 1;
	}
	return f.dot;
}, true, { args: ["force"] });
