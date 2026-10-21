// From code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8207, "/obj/item/clothing/glasses/wraith_spectacles", "/obj/item/clothing/glasses", {
	name: "antique spectacles",
	desc: "Unnerving glasses with opaque yellow lenses.",
	icon: rt.rsc("icons/obj/clothing/clockwork_garb.dmi"),
	icon_state: "wraith_specs",
	item_state: "glasses",
	actions_types: null,
	resistance_flags: 34,
	flags_cover: 1,
	visor_flags_inv: 64,
	visor_vars_to_toggle: 0,
	tint: 3,
});

// /obj/item/clothing/glasses/wraith_spectacles/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm:8)
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle")));
	return f.dot;
});

// /obj/item/clothing/glasses/wraith_spectacles/proc/Initialize  (code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm:16)  may sleep
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modGl("all_clockwork_objects", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/clothing/glasses/wraith_spectacles/proc/Destroy  (code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm:20)  may sleep
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("all_clockwork_objects", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/glasses/wraith_spectacles/proc/attack_self  (code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm:24)  may sleep
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "weldingvisortoggle", live(user));
	return f.dot;
}, true);

// /obj/item/clothing/glasses/wraith_spectacles/proc/visor_toggling  (code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm:27)  may sleep
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/visor_toggling", function* visor_toggling(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_vision_vars", 0);
	return f.dot;
}, true);

// /obj/item/clothing/glasses/wraith_spectacles/proc/weldingvisortoggle  (code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm:31)  may sleep
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/weldingvisortoggle", function* weldingvisortoggle(f: Frame) {
	let H: Value = null, WS: Value = null;
	let $0: any, $1: any;
	f.vars = () => [H, WS, $0, $1];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	H = rt.sv(f, "loc");
	if (!(isEqual(live(f.src), rt.fv(f, "glasses", live(H))) && !truthy(rt.sv(f, "up")))) return f.dot;
	if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(H)), 1))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='heavy_brass'>\"You're blind, idiot. Stop embarrassing yourself.\"</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "blind_cultist", live(H))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(H)])))) {
		$0 = live(H);
		if (truthy(rt.gl("ratvar_awakens"))) {
			$1 = "";
		} else {
			$1 = " Your eyes begin to itch - you cannot do this for long.";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='heavy_brass'>You push the spectacles down, and all is revealed to you.＀</span>", [$1])]);
		if (truthy((WS = (yield* g.callName(f, live(H), "has_status_effect", [T("/datum/status_effect/wraith_spectacles")]))))) {
			yield* g.callName(f, live(WS), "apply_eye_damage", [live(H)]);
		}
		yield* g.callName(f, live(H), "apply_status_effect", [T("/datum/status_effect/wraith_spectacles")]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='heavy_brass'>You push the spectacles down, but you can't see through the glass.</span>"]);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/glasses/wraith_spectacles/proc/blind_cultist  (code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm:50)  may sleep
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/blind_cultist", function* blind_cultist(f: Frame, victim: Value) {
	f.vars = () => [victim];
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(victim)])))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(victim), "<span class='heavy_brass'>\"It looks like Nar-Sie's dogs really don't value their eyes.\"</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(victim), "<span class='userdanger'>Your eyes explode with horrific pain!</span>"]);
	yield* g.callName(f, live(victim), "emote", ["scream"]);
	yield* g.callName(f, live(victim), "become_blind", []);
	yield* g.callName(f, live(victim), "adjust_blurriness", [30]);
	yield* g.callName(f, live(victim), "adjust_blindness", [30]);
	return 1;
}, true);

// /obj/item/clothing/glasses/wraith_spectacles/proc/set_vision_vars  (code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm:64)  may sleep
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/set_vision_vars", function* set_vision_vars(f: Frame, update_vision: Value) {
	let C: Value = null;
	f.vars = () => [update_vision, C];
	rt.setSv(f, "lighting_alpha", null);
	rt.setSv(f, "tint", 0);
	rt.setSv(f, "vision_flags", 0);
	rt.setSv(f, "darkness_view", 2);
	if (!truthy(rt.sv(f, "up"))) {
		if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "loc")])))) {
			rt.setSv(f, "lighting_alpha", 128);
			rt.setSv(f, "vision_flags", 28);
			rt.setSv(f, "darkness_view", 3);
		} else {
			rt.setSv(f, "tint", 3);
		}
	}
	if (!(truthy(live(update_vision)) && truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (C = rt.sv(f, "loc")), "head_update", [null, live(f.src), "forced", 1], rt.Args.Named);
	return f.dot;
}, true);

// /obj/item/clothing/glasses/wraith_spectacles/proc/equipped  (code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm:76)  may sleep
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/equipped", function* equipped(f: Frame) {
	let WS: Value = null;
	let $0: any, $1: any;
	f.vars = () => [WS, $0, $1];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((!isEqual(live(f.args[1]), 8) || truthy(rt.sv(f, "up")))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[0])), 1))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>\"You're blind, idiot. Stop embarrassing yourself.\"</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "blind_cultist", live(f.args[0]))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "set_vision_vars", 1);
	if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])))) {
		$0 = live(f.args[0]);
		if (truthy(rt.gl("ratvar_awakens"))) {
			$1 = "";
		} else {
			$1 = " Your eyes begin to itch - you cannot do this for long.";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='heavy_brass'>As you put on the spectacles, all is revealed to you.＀</span>", [$1])]);
		if (truthy((WS = (yield* g.callName(f, live(f.args[0]), "has_status_effect", [T("/datum/status_effect/wraith_spectacles")]))))) {
			yield* g.callName(f, live(WS), "apply_eye_damage", [live(f.args[0])]);
		}
		yield* g.callName(f, live(f.args[0]), "apply_status_effect", [T("/datum/status_effect/wraith_spectacles")]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>You put on the spectacles, but you can't see through the glass.</span>"]);
	}
	return f.dot;
}, true, { args: ["user", "slot"] });

rt.type(11080, "/obj/screen/alert/status_effect/wraith_spectacles", "/obj/screen/alert/status_effect", {
	alerttooltipstyle: "clockcult",
	name: "Wraith Spectacles",
	desc: "You shouldn't actually see this, as it should be procedurally generated.",
	icon_state: "wraithspecs",
});

// /obj/screen/alert/status_effect/wraith_spectacles/proc/MouseEntered  (code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm:111)
rt.def("/obj/screen/alert/status_effect/wraith_spectacles/proc/MouseEntered", function MouseEntered(f: Frame) {
	let L: Value = null, W: Value = null, glasses_right: Value = null, WS: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [L, W, glasses_right, WS, $0, $1, $2];
	if (truthy((rt.istype((L = live(f.usr)), T("/mob/living/carbon/human")) ? 1 : 0))) {
		W = rt.sv(f, "attached_effect");
		glasses_right = (rt.istype(rt.fv(f, "glasses", live(L)), T("/obj/item/clothing/glasses/wraith_spectacles")) ? 1 : 0);
		WS = rt.fv(f, "glasses", live(L));
		if ((truthy(live(glasses_right)) && !truthy(rt.fv(f, "up", live(WS))))) {
			$0 = "<font color=#DAAA18><b>";
		} else {
			$0 = "";
		}
		if (truthy(live(glasses_right))) {
			$1 = "";
		} else {
			$1 = "not ";
		}
		if ((truthy(live(glasses_right)) && !truthy(rt.fv(f, "up", live(WS))))) {
			$2 = "!</b></font>";
		} else {
			$2 = ".";
		}
		rt.setSv(f, "desc", fmt("＀You are ＀wearing wraith spectacles＀<br>You have taken <font color=#DAAA18><b>＀</b></font> eye damage from them.<br>", [$0, $1, $2, rt.fv(f, "eye_damage_done", live(W))]));
		if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(L)), 8))) {
			rt.modSrcVar(f, "desc", "<font color=#DAAA18><b>You are nearsighted!</b></font><br>", add);
		} else {
			if ((truthy(live(glasses_right)) && !truthy(rt.fv(f, "up", live(WS))))) {
				rt.modSrcVar(f, "desc", fmt("You will become nearsighted at <font color=#DAAA18><b>＀</b></font> eye damage.<br>", [rt.fv(f, "nearsight_breakpoint", live(W))]), add);
			}
		}
		if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(L)), 1))) {
			rt.modSrcVar(f, "desc", "<font color=#DAAA18><b>You are blind!</b></font>", add);
		} else {
			if ((truthy(live(glasses_right)) && !truthy(rt.fv(f, "up", live(WS))))) {
				rt.modSrcVar(f, "desc", fmt("You will become blind at <font color=#DAAA18><b>＀</b></font> eye damage.", [rt.fv(f, "blind_breakpoint", live(W))]), add);
			}
		}
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["location", "control", "params"] });

rt.type(943, "/datum/status_effect/wraith_spectacles", "/datum/status_effect", {
	eye_damage_done: 0,
	nearsight_breakpoint: 30,
	blind_breakpoint: 45,
	id: "wraith_spectacles",
	duration: -1,
	tick_interval: 20,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/wraith_spectacles"),
});

// /datum/status_effect/wraith_spectacles/proc/on_apply  (code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm:129)  may sleep
rt.def("/datum/status_effect/wraith_spectacles/proc/on_apply", function* on_apply(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "apply_eye_damage", (H = rt.sv(f, "owner")));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/status_effect/wraith_spectacles/proc/tick  (code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm:135)  may sleep
rt.def("/datum/status_effect/wraith_spectacles/proc/tick", function* tick(f: Frame) {
	let H: Value = null, glasses_right: Value = null, WS: Value = null;
	f.vars = () => [H, glasses_right, WS];
	if (!truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	H = rt.sv(f, "owner");
	glasses_right = (rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/wraith_spectacles")) ? 1 : 0);
	WS = rt.fv(f, "glasses", live(H));
	if (((truthy(live(glasses_right)) && !truthy(rt.fv(f, "up", live(WS)))) && !truthy(rt.gl("ratvar_awakens")))) {
		yield* g.srcCall(f, "apply_eye_damage", live(H));
	} else {
		if (truthy(rt.gl("ratvar_awakens"))) {
			yield* g.callName(f, live(H), "cure_nearsighted", []);
			yield* g.callName(f, live(H), "cure_blind", []);
			yield* g.callName(f, live(H), "adjust_eye_damage", [rt.neg(rt.sv(f, "eye_damage_done"))]);
			rt.setSv(f, "eye_damage_done", 0);
		} else {
			if ((truthy(rt.op(f, "Prob", [], [50])) && truthy(rt.sv(f, "eye_damage_done")))) {
				yield* g.callName(f, live(H), "adjust_eye_damage", [-1]);
				rt.incSrcVar(f, "eye_damage_done", -1, true);
			}
		}
		if (truthy(rt.sv(f, "eye_damage_done"))) return f.dot;
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /datum/status_effect/wraith_spectacles/proc/apply_eye_damage  (code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm:156)  may sleep
rt.def("/datum/status_effect/wraith_spectacles/proc/apply_eye_damage", function* apply_eye_damage(f: Frame, H: Value) {
	f.vars = () => [H];
	if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(H)), 1))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(H), "adjust_eye_damage", [1]);
	rt.incSrcVar(f, "eye_damage_done", 1, true);
	if (rt.ge(rt.sv(f, "eye_damage_done"), 20)) {
		yield* g.callName(f, live(H), "adjust_blurriness", [2]);
	}
	if (rt.ge(rt.sv(f, "eye_damage_done"), rt.sv(f, "nearsight_breakpoint"))) {
		if (truthy((yield* g.callName(f, live(H), "become_nearsighted", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='nzcrentr'>Your vision doubles, then trebles. Darkness begins to close in. You can't keep this up!</span>"]);
		}
	}
	if (rt.ge(rt.sv(f, "eye_damage_done"), rt.sv(f, "blind_breakpoint"))) {
		if (truthy((yield* g.callName(f, live(H), "become_blind", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='nzcrentr_large'>A piercing white light floods your vision. Suddenly, all goes dark!</span>"]);
		}
	}
	if (!truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/min"), null, [20, add(5, rt.sv(f, "eye_damage_done"))]))]))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='nzcrentr_small'><i>Your eyes continue to burn.</i></span>"]);
	return f.dot;
}, true);
