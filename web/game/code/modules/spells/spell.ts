// From code/modules/spells/spell.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalspells  (code/modules/spells/spell.dm:12)
rt.def("/datum/controller/global_vars/proc/InitGlobalspells", function InitGlobalspells(f: Frame) {
	rt.setGl("spells", rt.call(f, P("/proc/typesof"), null, [T("/obj/effect/proc_holder/spell")]));
	rt.modSrcVar(f, "gvars_datum_init_order", "spells", add);
	return f.dot;
});

rt.type(11221, "/obj/effect/proc_holder", "/obj/effect", {
	panel: "Debug",
	active: 0,
	ranged_mousepointer: null,
	ranged_ability_user: null,
	ranged_clickcd_override: -1,
});

// /obj/effect/proc_holder/proc/Destroy  (code/modules/spells/spell.dm:16)  may sleep
rt.def("/obj/effect/proc_holder/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "ranged_ability_user"))) {
		yield* g.srcCall(f, "remove_ranged_ability");
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/proc_holder/proc/InterceptClickOn  (code/modules/spells/spell.dm:20)  may sleep
rt.def("/obj/effect/proc_holder/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, A: Value) {
	f.vars = () => [caller, params, A];
	if ((!isEqual(rt.fv(f, "ranged_ability", live(caller)), live(f.src)) || !isEqual(rt.sv(f, "ranged_ability_user"), live(caller)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(caller), fmt("<span class='warning'><b>＀</b> has been disabled.", [rt.gv(f, "name", rt.fv(f, "ranged_ability", live(caller)))])]);
		yield* g.callName(f, rt.fv(f, "ranged_ability", live(caller)), "remove_ranged_ability", []);
		return 1;
	}
	if (rt.ge(rt.sv(f, "ranged_clickcd_override"), 0)) {
		rt.setFv(f, "next_click", rt.sv(f, "ranged_ability_user"), add(rt.worldTime(f), rt.sv(f, "ranged_clickcd_override")));
	} else {
		rt.setFv(f, "next_click", rt.sv(f, "ranged_ability_user"), add(rt.worldTime(f), 6));
	}
	yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "face_atom", [live(A)]);
	return 0;
}, true);

// /obj/effect/proc_holder/proc/add_ranged_ability  (code/modules/spells/spell.dm:32)  may sleep
rt.def("/obj/effect/proc_holder/proc/add_ranged_ability", function* add_ranged_ability(f: Frame, user: Value, msg: Value, forced: Value) {
	f.vars = () => [user, msg, forced];
	if ((!truthy(live(user)) || !truthy(rt.fv(f, "client", live(user))))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "ranged_ability", live(user))) && !isEqual(rt.fv(f, "ranged_ability", live(user)), live(f.src)))) {
		if (truthy(live(forced))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'><b>＀</b> has been replaced by <b>＀</b>.", [rt.gv(f, "name", rt.fv(f, "ranged_ability", live(user))), rt.sv(f, "name")])]);
			yield* g.callName(f, rt.fv(f, "ranged_ability", live(user)), "remove_ranged_ability", []);
		} else {
			return live(f.dot);
		}
	}
	rt.setFv(f, "ranged_ability", live(user), live(f.src));
	rt.setFv(f, "click_intercept", rt.fv(f, "client", live(user)), rt.fv(f, "ranged_ability", live(user)));
	yield* g.srcCall(f, "add_mousepointer", rt.fv(f, "client", live(user)));
	rt.setSv(f, "ranged_ability_user", live(user));
	if (truthy(live(msg))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), live(msg)]);
	}
	rt.setSv(f, "active", 1);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/effect/proc_holder/proc/add_mousepointer  (code/modules/spells/spell.dm:50)
rt.def("/obj/effect/proc_holder/proc/add_mousepointer", function add_mousepointer(f: Frame, C: Value) {
	if (!((truthy(live(C)) && truthy(rt.sv(f, "ranged_mousepointer"))) && isEqual(rt.fv(f, "mouse_pointer_icon", live(C)), rt.initial(f, live(C), "mouse_pointer_icon")))) return f.dot;
	rt.setFv(f, "mouse_pointer_icon", live(C), rt.sv(f, "ranged_mousepointer"));
	return f.dot;
});

// /obj/effect/proc_holder/proc/remove_mousepointer  (code/modules/spells/spell.dm:54)
rt.def("/obj/effect/proc_holder/proc/remove_mousepointer", function remove_mousepointer(f: Frame, C: Value) {
	if (!((truthy(live(C)) && truthy(rt.sv(f, "ranged_mousepointer"))) && isEqual(rt.fv(f, "mouse_pointer_icon", live(C)), rt.sv(f, "ranged_mousepointer")))) return f.dot;
	rt.setFv(f, "mouse_pointer_icon", live(C), rt.initial(f, live(C), "mouse_pointer_icon"));
	return f.dot;
});

// /obj/effect/proc_holder/proc/remove_ranged_ability  (code/modules/spells/spell.dm:58)  may sleep
rt.def("/obj/effect/proc_holder/proc/remove_ranged_ability", function* remove_ranged_ability(f: Frame, msg: Value) {
	f.vars = () => [msg];
	if (((!truthy(rt.sv(f, "ranged_ability_user")) || !truthy(rt.fv(f, "client", rt.sv(f, "ranged_ability_user")))) || (truthy(rt.fv(f, "ranged_ability", rt.sv(f, "ranged_ability_user"))) && !isEqual(rt.fv(f, "ranged_ability", rt.sv(f, "ranged_ability_user")), live(f.src))))) {
		return live(f.dot);
	}
	rt.setFv(f, "ranged_ability", rt.sv(f, "ranged_ability_user"), null);
	rt.setFv(f, "click_intercept", rt.fv(f, "client", rt.sv(f, "ranged_ability_user")), null);
	yield* g.srcCall(f, "remove_mousepointer", rt.fv(f, "client", rt.sv(f, "ranged_ability_user")));
	if (truthy(live(msg))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), live(msg)]);
	}
	rt.setSv(f, "ranged_ability_user", null);
	rt.setSv(f, "active", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(11274, "/obj/effect/proc_holder/spell", "/obj/effect/proc_holder", {
	sound: null,
	school: "evocation",
	charge_type: "recharge",
	charge_max: 100,
	charge_counter: 0,
	still_recharging_msg: "<span class='notice'>The spell is still recharging.</span>",
	recharging: 1,
	holder_var_type: "bruteloss",
	holder_var_amount: 20,
	clothes_req: 1,
	cult_req: 0,
	human_req: 0,
	nonabstract_req: 0,
	stat_allowed: 0,
	phase_allowed: 0,
	invocation: "HURP DURP",
	invocation_emote_self: null,
	invocation_type: "none",
	range: 7,
	message: "",
	selection_type: "view",
	spell_level: 0,
	level_max: 4,
	cooldown_min: 0,
	player_lock: 1,
	overlay: 0,
	overlay_icon: rt.rsc("icons/obj/wizard.dmi"),
	overlay_icon_state: "spell",
	overlay_lifespan: 0,
	sparks_spread: 0,
	sparks_amt: 0,
	smoke_spread: 0,
	smoke_amt: 0,
	critfailchance: 0,
	centcom_cancast: 1,
	action_icon: rt.rsc("icons/mob/actions.dmi"),
	action_icon_state: "spell_default",
	action_background_icon_state: "bg_spell",
	action: null,
	anchored: 1,
	pass_flags: 1,
	name: "Spell",
	desc: "A wizard spell",
	panel: "Spells",
	density: 0,
	opacity: 0,
});

// /obj/effect/proc_holder/spell/proc/cast_check  (code/modules/spells/spell.dm:129)  may sleep
rt.def("/obj/effect/proc_holder/spell/proc/cast_check", function* cast_check(f: Frame, skipcharge: Value, user: Value) {
	let _T: Value = null, H: Value = null, casting_clothes: Value = null;
	let $0: any;
	f.vars = () => [skipcharge, user, _T, H, casting_clothes, $0];
	if (live(skipcharge) === null) {
		skipcharge = 0;
	}
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (truthy(rt.sv(f, "player_lock"))) {
		if ((!truthy(rt.fv(f, "mind", live(user))) || (!truthy((rt.isIn(f, live(f.src), rt.gv(f, "spell_list", rt.fv(f, "mind", live(user)))) ? 1 : 0)) && !truthy((rt.isIn(f, live(f.src), rt.fv(f, "mob_spell_list", live(user))) ? 1 : 0))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You shouldn't have this spell! Something's wrong.</span>"]);
			return 0;
		}
	} else {
		if (!truthy((rt.isIn(f, live(f.src), rt.fv(f, "mob_spell_list", live(user))) ? 1 : 0))) {
			return 0;
		}
	}
	if ((isEqual(rt.gv(f, "z", (_T = rt.getStep(f, live(user), 0))), 1) && !truthy(rt.sv(f, "centcom_cancast")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You can't cast this spell here.</span>"]);
		return 0;
	}
	if (!truthy(live(skipcharge))) {
		$0 = rt.sv(f, "charge_type");
		if ($0 === "recharge") {
			if (rt.lt(rt.sv(f, "charge_counter"), rt.sv(f, "charge_max"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), rt.sv(f, "still_recharging_msg")]);
				return 0;
			}
		} else if ($0 === "charges") {
			if (!truthy(rt.sv(f, "charge_counter"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ has no charges left.</span>", [rt.sv(f, "name")])]);
				return 0;
			}
		}
	}
	if ((truthy(rt.fv(f, "stat", live(user))) && !truthy(rt.sv(f, "stat_allowed")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Not when you're incapacitated.</span>"]);
		return 0;
	}
	if ((!truthy(rt.sv(f, "phase_allowed")) && truthy((rt.istype(rt.fv(f, "loc", live(user)), T("/obj/effect/dummy")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ cannot be cast unless you are completely manifested in the material plane.</span>", [rt.sv(f, "name")])]);
		return 0;
	}
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(user);
		if (((isEqual(rt.sv(f, "invocation_type"), "whisper") || isEqual(rt.sv(f, "invocation_type"), "shout")) && truthy((yield* g.callName(f, live(H), "is_muzzled", []))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You can't get the words out!</span>"]);
			return 0;
		}
		casting_clothes = (yield* g.call(f, P("/proc/typecacheof"), null, [rt.list(T("/obj/item/clothing/suit/wizrobe"), T("/obj/item/clothing/suit/space/hardsuit/wizard"), T("/obj/item/clothing/head/wizard"), T("/obj/item/clothing/head/helmet/space/hardsuit/wizard"), T("/obj/item/clothing/suit/space/hardsuit/shielded/wizard"), T("/obj/item/clothing/head/helmet/space/hardsuit/shielded/wizard"))]));
		if (truthy(rt.sv(f, "clothes_req"))) {
			if (!truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [rt.fv(f, "wear_suit", live(H)), live(casting_clothes)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>I don't feel strong enough without my robe.</span>"]);
				return 0;
			}
			if (!truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [rt.fv(f, "head", live(H)), live(casting_clothes)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>I don't feel strong enough without my hat.</span>"]);
				return 0;
			}
		}
		if (truthy(rt.sv(f, "cult_req"))) {
			if ((!truthy((rt.istype(rt.fv(f, "wear_suit", live(H)), T("/obj/item/clothing/suit/magusred")) ? 1 : 0)) && !truthy((rt.istype(rt.fv(f, "wear_suit", live(H)), T("/obj/item/clothing/suit/space/hardsuit/cult")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>I don't feel strong enough without my armor.</span>"]);
				return 0;
			}
			if ((!truthy((rt.istype(rt.fv(f, "head", live(H)), T("/obj/item/clothing/head/magus")) ? 1 : 0)) && !truthy((rt.istype(rt.fv(f, "head", live(H)), T("/obj/item/clothing/head/helmet/space/hardsuit/cult")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>I don't feel strong enough without my helmet.</span>"]);
				return 0;
			}
		}
	} else {
		if ((truthy(rt.sv(f, "clothes_req")) || truthy(rt.sv(f, "human_req")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>This spell can only be cast by humans!</span>"]);
			return 0;
		}
		if ((truthy(rt.sv(f, "nonabstract_req")) && (truthy((rt.istype(live(user), T("/mob/living/brain")) ? 1 : 0)) || truthy((rt.istype(live(user), T("/mob/living/silicon/pai")) ? 1 : 0))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>This spell can only be cast by physical beings!</span>"]);
			return 0;
		}
	}
	if (!truthy(live(skipcharge))) {
		$0 = rt.sv(f, "charge_type");
		if ($0 === "recharge") {
			rt.setSv(f, "charge_counter", 0);
		} else if ($0 === "charges") {
			rt.incSrcVar(f, "charge_counter", -1, true);
		} else if ($0 === "holdervar") {
			yield* g.srcCall(f, "adjust_var", live(user), rt.sv(f, "holder_var_type"), rt.sv(f, "holder_var_amount"));
		}
	}
	if (truthy(rt.sv(f, "action"))) {
		yield* g.callName(f, rt.sv(f, "action"), "UpdateButtonIcon", []);
	}
	return 1;
}, true);

// /obj/effect/proc_holder/spell/proc/invocation  (code/modules/spells/spell.dm:211)  may sleep
rt.def("/obj/effect/proc_holder/spell/proc/invocation", function* invocation(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [user, $0];
	if (live(user) === null) {
		user = live(f.usr);
	}
	$0 = rt.sv(f, "invocation_type");
	if ($0 === "shout") {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.callName(f, live(user), "say", [rt.sv(f, "invocation")]);
		} else {
			yield* g.callName(f, live(user), "say", [(yield* g.call(f, P("/proc/replacetext"), null, [rt.sv(f, "invocation"), " ", "`"]))]);
		}
	} else if ($0 === "whisper") {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.callName(f, live(user), "whisper", [rt.sv(f, "invocation")]);
		} else {
			yield* g.callName(f, live(user), "whisper", [(yield* g.call(f, P("/proc/replacetext"), null, [rt.sv(f, "invocation"), " ", "`"]))]);
		}
	} else if ($0 === "emote") {
		yield* g.callName(f, live(user), "visible_message", [rt.sv(f, "invocation"), rt.sv(f, "invocation_emote_self")]);
	}
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/proc/playMagSound  (code/modules/spells/spell.dm:226)
rt.def("/obj/effect/proc_holder/spell/proc/playMagSound", function playMagSound(f: Frame) {
	rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.usr), 0), rt.sv(f, "sound"), 50, 1]);
	return f.dot;
});

// /obj/effect/proc_holder/spell/proc/Initialize  (code/modules/spells/spell.dm:229)  may sleep
rt.def("/obj/effect/proc_holder/spell/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "action", (yield* g.new_(f, T("/datum/action/spell_action"), [live(f.src)])));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	}
	rt.setSv(f, "still_recharging_msg", fmt("<span class='notice'>＀ is still recharging.</span>", [rt.sv(f, "name")]));
	rt.setSv(f, "charge_counter", rt.sv(f, "charge_max"));
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/proc/Destroy  (code/modules/spells/spell.dm:237)  may sleep
rt.def("/obj/effect/proc_holder/spell/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "action")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/proc_holder/spell/proc/Click  (code/modules/spells/spell.dm:242)  may sleep
rt.def("/obj/effect/proc_holder/spell/proc/Click", function* Click(f: Frame) {
	if (truthy((yield* g.srcCall(f, "cast_check")))) {
		yield* g.srcCall(f, "choose_targets");
	}
	return 1;
}, true);

// /obj/effect/proc_holder/spell/proc/process  (code/modules/spells/spell.dm:256)  may sleep
rt.def("/obj/effect/proc_holder/spell/proc/process", function* process(f: Frame) {
	if (!((truthy(rt.sv(f, "recharging")) && isEqual(rt.sv(f, "charge_type"), "recharge")) && rt.lt(rt.sv(f, "charge_counter"), rt.sv(f, "charge_max")))) return f.dot;
	if (!rt.ge((rt.modSrcVar(f, "charge_counter", 2, add)), rt.sv(f, "charge_max"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "action"), "UpdateButtonIcon", []);
	rt.setSv(f, "charge_counter", rt.sv(f, "charge_max"));
	rt.setSv(f, "recharging", 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/proc_holder/spell/proc/perform  (code/modules/spells/spell.dm:264)  may sleep
rt.def("/obj/effect/proc_holder/spell/proc/perform", function* perform(f: Frame, targets: Value, recharge: Value, user: Value) {
	f.vars = () => [targets, recharge, user];
	if (live(recharge) === null) {
		recharge = 1;
	}
	if (live(user) === null) {
		user = live(f.usr);
	}
	yield* g.srcCall(f, "before_cast", live(targets));
	yield* g.srcCall(f, "invocation", live(user));
	if ((truthy(live(user)) && truthy(rt.fv(f, "ckey", live(user))))) {
		yield* g.callName(f, live(user), "log_message", [fmt("<span class='danger'>cast the spell ＀.</span>", [rt.sv(f, "name")]), "Attack log"]);
	}
	if (truthy(live(recharge))) {
		rt.setSv(f, "recharging", 1);
	}
	if (truthy(rt.sv(f, "sound"))) {
		yield* g.srcCall(f, "playMagSound");
	}
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "critfailchance")]))) {
		yield* g.srcCall(f, "critfail", live(targets));
	} else {
		yield* g.callSrc(f, "cast", [null, live(targets), "user", live(user)], rt.Args.Named);
	}
	yield* g.srcCall(f, "after_cast", live(targets));
	if (!truthy(rt.sv(f, "action"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "action"), "UpdateButtonIcon", []);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/proc/before_cast  (code/modules/spells/spell.dm:282)  may sleep
rt.def("/obj/effect/proc_holder/spell/proc/before_cast", function* before_cast(f: Frame, targets: Value) {
	let target: Value = null, location: Value = null, spell: Value = null;
	let $e: any;
	f.vars = () => [targets, target, location, spell, $e];
	if (!truthy(rt.sv(f, "overlay"))) return f.dot;
	target = null;
	rt.forList(f, 0, live(targets), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		location = null;
		if (truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) {
			location = rt.fv(f, "loc", live(target));
		} else {
			if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(target)])))) {
				location = live(target);
			}
		}
		rt.setFv(f, "icon", (spell = (yield* g.new_(f, T("/obj/effect/overlay"), [live(location)]))), rt.sv(f, "overlay_icon"));
		rt.setFv(f, "icon_state", live(spell), rt.sv(f, "overlay_icon_state"));
		rt.setFv(f, "anchored", live(spell), 1);
		rt.setFv(f, "density", live(spell), 0);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(spell)])), rt.sv(f, "overlay_lifespan"), 8]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/proc/after_cast  (code/modules/spells/spell.dm:296)  may sleep
rt.def("/obj/effect/proc_holder/spell/proc/after_cast", function* after_cast(f: Frame, targets: Value) {
	let target: Value = null, location: Value = null, smoke: Value = null;
	let $e: any;
	f.vars = () => [targets, target, location, smoke, $e];
	target = null;
	rt.forList(f, 0, live(targets), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		location = null;
		if (truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) {
			location = rt.fv(f, "loc", live(target));
		} else {
			if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(target)])))) {
				location = live(target);
			}
		}
		if ((truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0)) && truthy(rt.sv(f, "message")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(target), fmt("＀", [rt.sv(f, "message")])]);
		}
		if (truthy(rt.sv(f, "sparks_spread"))) {
			yield* g.call(f, P("/proc/do_sparks"), null, [rt.sv(f, "sparks_amt"), 0, live(location)]);
		}
		if (truthy(rt.sv(f, "smoke_spread"))) {
			if (isEqual(rt.sv(f, "smoke_spread"), 1)) {
				yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [rt.sv(f, "smoke_amt"), live(location)]);
				yield* g.callName(f, live(smoke), "start", []);
			} else {
				if (isEqual(rt.sv(f, "smoke_spread"), 2)) {
					yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/bad"), []))), "set_up", [rt.sv(f, "smoke_amt"), live(location)]);
					yield* g.callName(f, live(smoke), "start", []);
				} else {
					if (isEqual(rt.sv(f, "smoke_spread"), 3)) {
						yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/sleeping"), []))), "set_up", [rt.sv(f, "smoke_amt"), live(location)]);
						yield* g.callName(f, live(smoke), "start", []);
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/proc/revert_cast  (code/modules/spells/spell.dm:328)  may sleep
rt.def("/obj/effect/proc_holder/spell/proc/revert_cast", function* revert_cast(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [user, $0];
	if (live(user) === null) {
		user = live(f.usr);
	}
	$0 = rt.sv(f, "charge_type");
	if ($0 === "recharge") {
		rt.setSv(f, "charge_counter", rt.sv(f, "charge_max"));
	} else if ($0 === "charges") {
		rt.incSrcVar(f, "charge_counter", 1, true);
	} else if ($0 === "holdervar") {
		yield* g.srcCall(f, "adjust_var", live(user), rt.sv(f, "holder_var_type"), rt.neg(rt.sv(f, "holder_var_amount")));
	}
	if (!truthy(rt.sv(f, "action"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "action"), "UpdateButtonIcon", []);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/proc/adjust_var  (code/modules/spells/spell.dm:339)  may sleep
rt.def("/obj/effect/proc_holder/spell/proc/adjust_var", function* adjust_var(f: Frame, target: Value, type: Value, amount: Value) {
	let $0: any;
	f.vars = () => [target, type, amount, $0];
	if (live(target) === null) {
		target = live(f.usr);
	}
	if (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	$0 = live(type);
	if ($0 === "bruteloss") {
		yield* g.callName(f, live(target), "adjustBruteLoss", [live(amount)]);
	} else if ($0 === "fireloss") {
		yield* g.callName(f, live(target), "adjustFireLoss", [live(amount)]);
	} else if ($0 === "toxloss") {
		yield* g.callName(f, live(target), "adjustToxLoss", [live(amount)]);
	} else if ($0 === "oxyloss") {
		yield* g.callName(f, live(target), "adjustOxyLoss", [live(amount)]);
	} else if ($0 === "stun") {
		yield* g.callName(f, live(target), "AdjustStun", [live(amount)]);
	} else if ($0 === "knockdown") {
		yield* g.callName(f, live(target), "AdjustKnockdown", [live(amount)]);
	} else if ($0 === "unconscious") {
		yield* g.callName(f, live(target), "AdjustUnconscious", [live(amount)]);
	} else {
		rt.modAt(rt.fv(f, "vars", live(target)), live(type), live(amount), add);
	}
	return f.dot;
}, true);

rt.type(11275, "/obj/effect/proc_holder/spell/targeted", "/obj/effect/proc_holder/spell", {
	max_targets: 1,
	target_ignore_prev: 1,
	include_user: 0,
	random_target: 0,
	random_target_priority: 1,
});

// /obj/effect/proc_holder/spell/targeted/proc/choose_targets  (code/modules/spells/spell.dm:371)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	let targets: Value = null, possible_targets: Value = null, target: Value = null, i: Value = null, target_3: Value = null, target_1: Value = null, M: Value = null, L: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, targets, possible_targets, target, i, target_3, target_1, M, L, $0, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	targets = rt.list();
	$0 = rt.sv(f, "max_targets");
	if ($0 === 0) {
		target_1 = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view_or_range"), null, [rt.sv(f, "range"), live(user), rt.sv(f, "selection_type")])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			target_1 = $e;
			if (!truthy((yield* g.srcCall(f, "can_target", live(target_1))))) {
				continue;
			}
			targets = rt.modify(live(targets), live(target_1), add);
		}
		rt.endFor(f, 0);
	} else if ($0 === 1) {
		if (rt.lt(rt.sv(f, "range"), 0)) {
			targets = rt.modify(live(targets), live(user), add);
		} else {
			possible_targets = rt.list();
			M = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/view_or_range"), null, [rt.sv(f, "range"), live(user), rt.sv(f, "selection_type")])), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if ((!truthy(rt.sv(f, "include_user")) && isEqual(live(user), live(M)))) {
					continue;
				}
				if (!truthy((yield* g.srcCall(f, "can_target", live(M))))) {
					continue;
				}
				possible_targets = rt.modify(live(possible_targets), live(M), add);
			}
			rt.endFor(f, 0);
			M = null;
			if (!truthy(rt.sv(f, "random_target"))) {
				M = (yield* g.op(f, "Prompt", [9], [null, null, "Targeting", "Choose the target for the spell.", live(possible_targets)]));
			} else {
				$0 = rt.sv(f, "random_target_priority");
				if ($0 === 2) {
					M = rt.op(f, "PickUnweighted", [1], [live(possible_targets)]);
				} else if ($0 === 1) {
					L = null;
					rt.forList(f, 0, live(possible_targets), T("/mob/living"));
					while (($e = rt.next(f, 0)) !== undefined) {
						L = $e;
						if (truthy(live(M))) {
							if (rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(L)])), (yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(M)])))) {
								if (truthy((yield* g.srcCall(f, "los_check", live(user), live(L))))) {
									M = live(L);
								}
							}
						} else {
							if (truthy((yield* g.srcCall(f, "los_check", live(user), live(L))))) {
								M = live(L);
							}
						}
					}
					rt.endFor(f, 0);
				}
			}
			if (truthy((rt.isIn(f, live(M), (yield* g.call(f, P("/proc/view_or_range"), null, [rt.sv(f, "range"), live(user), rt.sv(f, "selection_type")]))) ? 1 : 0))) {
				targets = rt.modify(live(targets), live(M), add);
			}
		}
	} else {
		possible_targets = rt.list();
		target = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view_or_range"), null, [rt.sv(f, "range"), live(user), rt.sv(f, "selection_type")])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			target = $e;
			if (!truthy((yield* g.srcCall(f, "can_target", live(target))))) {
				continue;
			}
			possible_targets = rt.modify(live(possible_targets), live(target), add);
		}
		rt.endFor(f, 0);
		i = null;
		i = 1;
		while (rt.le(live(i), rt.sv(f, "max_targets"))) {
			if (!truthy(rt.len(f, live(possible_targets)))) {
				break;
			}
			if (truthy(rt.sv(f, "target_ignore_prev"))) {
				(possible_targets = rt.modify(live(possible_targets), (target_3 = rt.op(f, "PickUnweighted", [1], [live(possible_targets)])), subtract));
				targets = rt.modify(live(targets), live(target_3), add);
			} else {
				targets = rt.modify(live(targets), rt.op(f, "PickUnweighted", [1], [live(possible_targets)]), add);
			}
			i = rt.inc(live(i), 1);
		}
	}
	if ((!truthy(rt.sv(f, "include_user")) && truthy((rt.isIn(f, live(user), live(targets)) ? 1 : 0)))) {
		(targets = rt.modify(live(targets), live(user), subtract));
	}
	if (!truthy(rt.len(f, live(targets)))) {
		yield* g.srcCall(f, "revert_cast", live(user));
		return live(f.dot);
	}
	yield* g.callSrc(f, "perform", [null, live(targets), "user", live(user)], rt.Args.Named);
	return f.dot;
}, true);

rt.type(11344, "/obj/effect/proc_holder/spell/aoe_turf", "/obj/effect/proc_holder/spell", {
	inner_radius: -1,
});

// /obj/effect/proc_holder/spell/aoe_turf/proc/choose_targets  (code/modules/spells/spell.dm:438)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	let targets: Value = null, target: Value = null;
	let $e: any;
	f.vars = () => [user, targets, target, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	targets = rt.list();
	target = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view_or_range"), null, [rt.sv(f, "range"), live(user), rt.sv(f, "selection_type")])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		if (!truthy((yield* g.srcCall(f, "can_target", live(target))))) {
			continue;
		}
		if (!truthy((rt.isIn(f, live(target), (yield* g.call(f, P("/proc/view_or_range"), null, [rt.sv(f, "inner_radius"), live(user), rt.sv(f, "selection_type")]))) ? 1 : 0))) {
			targets = rt.modify(live(targets), live(target), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(targets)))) {
		yield* g.srcCall(f, "revert_cast");
		return live(f.dot);
	}
	yield* g.callSrc(f, "perform", [null, live(targets), "user", live(user)], rt.Args.Named);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/proc/updateButtonIcon  (code/modules/spells/spell.dm:453)  may sleep
rt.def("/obj/effect/proc_holder/spell/proc/updateButtonIcon", function* updateButtonIcon(f: Frame) {
	yield* g.callName(f, rt.sv(f, "action"), "UpdateButtonIcon", []);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/proc/can_be_cast_by  (code/modules/spells/spell.dm:456)
rt.def("/obj/effect/proc_holder/spell/proc/can_be_cast_by", function can_be_cast_by(f: Frame, caster: Value) {
	if (((truthy(rt.sv(f, "human_req")) || truthy(rt.sv(f, "clothes_req"))) && !truthy((rt.istype(live(caster), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		return 0;
	}
	return 1;
});

// /obj/effect/proc_holder/spell/targeted/proc/los_check  (code/modules/spells/spell.dm:462)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/proc/los_check", function* los_check(f: Frame, A: Value, B: Value) {
	let dummy: Value = null, turf: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [A, B, dummy, turf, AM, $e];
	(rt.modField(f, (dummy = (yield* g.new_(f, T("/obj"), [rt.fv(f, "loc", live(A))]))), "pass_flags", 1, rt.bitOr));
	turf = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/getline"), null, [live(A), live(B)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		turf = $e;
		AM = null;
		rt.forList(f, 1, live(turf), T("/atom/movable"));
		while (($e = rt.next(f, 1)) !== undefined) {
			AM = $e;
			if (!truthy((yield* g.callName(f, live(AM), "CanPass", [live(dummy), live(turf), 1])))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(dummy)]);
				return 0;
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(dummy)]);
	return 1;
}, true);

// /obj/effect/proc_holder/spell/proc/can_cast  (code/modules/spells/spell.dm:473)
rt.def("/obj/effect/proc_holder/spell/proc/can_cast", function can_cast(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [user, $0];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (((!truthy(rt.fv(f, "mind", live(user))) || !truthy((rt.isIn(f, live(f.src), rt.gv(f, "spell_list", rt.fv(f, "mind", live(user)))) ? 1 : 0))) && !truthy((rt.isIn(f, live(f.src), rt.fv(f, "mob_spell_list", live(user))) ? 1 : 0)))) {
		return 0;
	}
	$0 = rt.sv(f, "charge_type");
	if ($0 === "recharge") {
		if (rt.lt(rt.sv(f, "charge_counter"), rt.sv(f, "charge_max"))) {
			return 0;
		}
	} else if ($0 === "charges") {
		if (!truthy(rt.sv(f, "charge_counter"))) {
			return 0;
		}
	}
	if ((truthy(rt.fv(f, "stat", live(user))) && !truthy(rt.sv(f, "stat_allowed")))) {
		return 0;
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((truthy(rt.sv(f, "clothes_req")) || truthy(rt.sv(f, "human_req")))) {
			return 0;
		}
		if ((truthy(rt.sv(f, "nonabstract_req")) && (truthy((rt.istype(live(user), T("/mob/living/brain")) ? 1 : 0)) || truthy((rt.istype(live(user), T("/mob/living/silicon/pai")) ? 1 : 0))))) {
			return 0;
		}
	}
	return 1;
});

rt.type(11375, "/obj/effect/proc_holder/spell/self", "/obj/effect/proc_holder/spell", {
	range: -1,
});

// /obj/effect/proc_holder/spell/self/proc/choose_targets  (code/modules/spells/spell.dm:498)  may sleep
rt.def("/obj/effect/proc_holder/spell/self/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy(live(user))) {
		yield* g.srcCall(f, "revert_cast");
		return live(f.dot);
	}
	yield* g.callSrc(f, "perform", [null, null, "user", live(user)], rt.Args.Named);
	return f.dot;
}, true);

rt.type(11376, "/obj/effect/proc_holder/spell/self/basic_heal", "/obj/effect/proc_holder/spell/self", {
	human_req: 1,
	clothes_req: 0,
	charge_max: 100,
	cooldown_min: 50,
	invocation: "Victus sano!",
	invocation_type: "whisper",
	school: "restoration",
	sound: rt.rsc("sound/magic/staff_healing.ogg"),
	name: "Lesser Heal",
	desc: "Heals a small amount of brute and burn damage.",
});

// /obj/effect/proc_holder/spell/self/basic_heal/proc/cast  (code/modules/spells/spell.dm:517)  may sleep
rt.def("/obj/effect/proc_holder/spell/self/basic_heal/proc/cast", function* cast(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>A wreath of gentle light passes over ＀!</span>", [live(user)]), "<span class='notice'>You wreath yourself in healing light!</span>"]);
	yield* g.callName(f, live(user), "adjustBruteLoss", [-10]);
	yield* g.callName(f, live(user), "adjustFireLoss", [-10]);
	return f.dot;
}, true);
