// From code/datums/status_effects/buffs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(919, "/datum/status_effect/shadow_mend", "/datum/status_effect", {
	id: "shadow_mend",
	duration: 30,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/shadow_mend"),
});

// /datum/status_effect/shadow_mend/proc/on_apply  (code/datums/status_effects/buffs.dm:14)
rt.def("/datum/status_effect/shadow_mend/proc/on_apply", function on_apply(f: Frame) {
	rt.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='notice'>Violet light wraps around ＀'s body!</span>", [rt.sv(f, "owner")]), "<span class='notice'>Violet light wraps around your body!</span>"]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "owner"), rt.rsc("sound/magic/teleport_app.ogg"), 50, 1]);
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/status_effect/shadow_mend/proc/tick  (code/datums/status_effects/buffs.dm:19)  may sleep
rt.def("/datum/status_effect/shadow_mend/proc/tick", function* tick(f: Frame) {
	yield* g.callName(f, rt.sv(f, "owner"), "adjustBruteLoss", [-15]);
	yield* g.callName(f, rt.sv(f, "owner"), "adjustFireLoss", [-15]);
	return f.dot;
}, true);

// /datum/status_effect/shadow_mend/proc/on_remove  (code/datums/status_effects/buffs.dm:23)  may sleep
rt.def("/datum/status_effect/shadow_mend/proc/on_remove", function* on_remove(f: Frame) {
	yield* g.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='warning'>The violet light around ＀ glows black!</span>", [rt.sv(f, "owner")]), "<span class='warning'>The tendrils around you cinch tightly and reap their toll...</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "owner"), rt.rsc("sound/magic/teleport_diss.ogg"), 50, 1]);
	yield* g.callName(f, rt.sv(f, "owner"), "apply_status_effect", [T("/datum/status_effect/void_price")]);
	return f.dot;
}, true);

rt.type(920, "/datum/status_effect/void_price", "/datum/status_effect", {
	id: "void_price",
	duration: 300,
	tick_interval: 30,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/void_price"),
});

// /datum/status_effect/void_price/proc/tick  (code/datums/status_effects/buffs.dm:40)  may sleep
rt.def("/datum/status_effect/void_price/proc/tick", function* tick(f: Frame) {
	rt.op(f, "OutputReference", [rt.R.srcVar("owner")], [(yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/magic/summon_karp.ogg"), "volume", 25], rt.Args.Named))], false);
	yield* g.callName(f, rt.sv(f, "owner"), "adjustBruteLoss", [3]);
	return f.dot;
}, true);

rt.type(11070, "/obj/screen/alert/status_effect/vanguard", "/obj/screen/alert/status_effect", {
	alerttooltipstyle: "clockcult",
	name: "Vanguard",
	desc: "You're absorbing stuns! 25% of all stuns taken will affect you after this effect ends.",
	icon_state: "vanguard",
});

// /obj/screen/alert/status_effect/vanguard/proc/MouseEntered  (code/datums/status_effects/buffs.dm:59)
rt.def("/obj/screen/alert/status_effect/vanguard/proc/MouseEntered", function MouseEntered(f: Frame) {
	let L: Value = null, vanguard: Value = null;
	let $0: any, $1: any;
	f.vars = () => [L, vanguard, $0, $1];
	if (truthy((rt.istype((L = live(f.usr)), T("/mob/living")) ? 1 : 0))) {
		vanguard = rt.index(rt.fv(f, "stun_absorption", live(L)), "vanguard");
		rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
		$0 = rt.call(f, P("/proc/Floor"), null, [multiply(rt.at(live(vanguard), "stuns_absorbed"), 0.10000000149011612)]);
		if (truthy(rt.gl("ratvar_awakens"))) {
			$1 = "";
		} else {
			$1 = fmt("<br><b>＀</b> seconds of stun will affect you.", [rt.call(f, P("/proc/Floor"), null, [rt.call(f, P("/proc/min"), null, [multiply(rt.at(live(vanguard), "stuns_absorbed"), 0.02500000037252903), 20])])]);
		}
		rt.modSrcVar(f, "desc", fmt("<br><b>＀</b> seconds of stuns held back.＀", [$0, $1]), add);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["location", "control", "params"] });

rt.type(921, "/datum/status_effect/vanguard_shield", "/datum/status_effect", {
	progbar: null,
	id: "vanguard",
	duration: 200,
	tick_interval: 0,
	status_type: 2,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/vanguard"),
});

// /datum/status_effect/vanguard_shield/proc/Destroy  (code/datums/status_effects/buffs.dm:68)  may sleep
rt.def("/datum/status_effect/vanguard_shield/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "progbar")]);
	rt.setSv(f, "progbar", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/status_effect/vanguard_shield/proc/on_apply  (code/datums/status_effects/buffs.dm:73)  may sleep
rt.def("/datum/status_effect/vanguard_shield/proc/on_apply", function* on_apply(f: Frame) {
	yield* g.callName(f, rt.sv(f, "owner"), "log_message", ["gained Vanguard stun immunity", "Attack log"]);
	yield* g.callName(f, rt.sv(f, "owner"), "add_stun_absorption", ["vanguard", 200, 1, "'s yellow aura momentarily intensifies!", "Your ward absorbs the stun!", " radiating with a soft yellow light!"]);
	yield* g.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='warning'>＀ begins to faintly glow!</span>", [rt.sv(f, "owner")]), "<span class='brass'>You will absorb all stuns for the next twenty seconds.</span>"]);
	yield* g.callName(f, rt.sv(f, "owner"), "SetStun", [0, 0]);
	yield* g.callName(f, rt.sv(f, "owner"), "SetKnockdown", [0]);
	rt.setSv(f, "progbar", (yield* g.new_(f, T("/datum/progressbar"), [rt.sv(f, "owner"), rt.sv(f, "duration"), rt.sv(f, "owner")])));
	rt.setFv(f, "color", rt.fv(f, "bar", rt.sv(f, "progbar")), rt.list("#FAE48C", "#FAE48C", "#FAE48C", "#000000"));
	yield* g.callName(f, rt.sv(f, "progbar"), "update", [subtract(rt.sv(f, "duration"), rt.worldTime(f))]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/status_effect/vanguard_shield/proc/tick  (code/datums/status_effects/buffs.dm:84)
rt.def("/datum/status_effect/vanguard_shield/proc/tick", function tick(f: Frame) {
	rt.callName(f, rt.sv(f, "progbar"), "update", [subtract(rt.sv(f, "duration"), rt.worldTime(f))]);
	return f.dot;
});

// /datum/status_effect/vanguard_shield/proc/on_remove  (code/datums/status_effects/buffs.dm:87)  may sleep
rt.def("/datum/status_effect/vanguard_shield/proc/on_remove", function* on_remove(f: Frame) {
	let vanguard: Value = null, stuns_blocked: Value = null, message_to_owner: Value = null, otheractiveabsorptions: Value = null, i: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [vanguard, stuns_blocked, message_to_owner, otheractiveabsorptions, i, $0, $1, $e];
	vanguard = rt.index(rt.fv(f, "stun_absorption", rt.sv(f, "owner")), "vanguard");
	stuns_blocked = 0;
	if (truthy(live(vanguard))) {
		stuns_blocked = (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/min"), null, [multiply(rt.at(live(vanguard), "stuns_absorbed"), 0.25), 20]))]));
	}
	if (isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 2)) return f.dot;
	message_to_owner = "<span class='warning'>You feel your Vanguard quietly fade...</span>";
	otheractiveabsorptions = 0;
	i = null;
	rt.forList(f, 0, rt.fv(f, "stun_absorption", rt.sv(f, "owner")));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((rt.gt(rt.index(rt.index(rt.fv(f, "stun_absorption", rt.sv(f, "owner")), live(i)), "end_time"), rt.worldTime(f)) && rt.gt(rt.index(rt.index(rt.fv(f, "stun_absorption", rt.sv(f, "owner")), live(i)), "priority"), rt.at(live(vanguard), "priority")))) {
			otheractiveabsorptions = 1;
		}
	}
	rt.endFor(f, 0);
	if (((!truthy(rt.gl("ratvar_awakens")) && truthy(live(stuns_blocked))) && !truthy(live(otheractiveabsorptions)))) {
		rt.setAt(live(vanguard), "end_time", 0);
		yield* g.callName(f, rt.sv(f, "owner"), "Knockdown", [live(stuns_blocked)]);
		message_to_owner = "<span class='boldwarning'>The weight of the Vanguard's protection crashes down upon you!</span>";
		if (rt.ge(live(stuns_blocked), 300)) {
			message_to_owner = rt.modify(live(message_to_owner), "\n<span class='userdanger'>You faint from the exertion!</span>", add);
			(stuns_blocked = rt.modify(live(stuns_blocked), 2, multiply));
			yield* g.callName(f, rt.sv(f, "owner"), "Unconscious", [live(stuns_blocked)]);
		}
	} else {
		stuns_blocked = 0;
	}
	yield* g.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='warning'>＀'s glowing aura fades!</span>", [rt.sv(f, "owner")]), live(message_to_owner)]);
	$0 = rt.sv(f, "owner");
	if (truthy(live(stuns_blocked))) {
		$1 = fmt("and was stunned for ＀", [live(stuns_blocked)]);
	} else {
		$1 = "";
	}
	yield* g.callName(f, $0, "log_message", [fmt("lost Vanguard stun immunity＀", [$1]), "Attack log"]);
	return f.dot;
}, true);

rt.type(922, "/datum/status_effect/inathneqs_endowment", "/datum/status_effect", {
	id: "inathneqs_endowment",
	duration: 150,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/inathneqs_endowment"),
});

// /datum/status_effect/inathneqs_endowment/proc/on_apply  (code/datums/status_effects/buffs.dm:123)  may sleep
rt.def("/datum/status_effect/inathneqs_endowment/proc/on_apply", function* on_apply(f: Frame) {
	let oldcolor: Value = null;
	f.vars = () => [oldcolor];
	yield* g.callName(f, rt.sv(f, "owner"), "log_message", ["gained Inath-neq's invulnerability", "Attack log"]);
	yield* g.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='warning'>＀ shines with azure light!</span>", [rt.sv(f, "owner")]), "<span class='notice'>You feel Inath-neq's power flow through you! You're invincible!</span>"]);
	oldcolor = rt.fv(f, "color", rt.sv(f, "owner"));
	rt.setFv(f, "color", rt.sv(f, "owner"), "#1E8CE1");
	yield* g.callName(f, rt.sv(f, "owner"), "fully_heal", []);
	yield* g.callName(f, rt.sv(f, "owner"), "add_stun_absorption", ["inathneq", 150, 2, "'s flickering blue aura momentarily intensifies!", "Inath-neq's power absorbs the stun!", " glowing with a flickering blue light!"]);
	(rt.modField(f, rt.sv(f, "owner"), "status_flags", 4096, rt.bitOr));
	rt.op(f, "Animate", [2, 8], [null, rt.sv(f, "owner"), "color", live(oldcolor), "time", 150, "easing", 64]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "owner"), P("/atom/proc/update_atom_colour")])), 150]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "owner"), rt.rsc("sound/magic/ethereal_enter.ogg"), 50, 1]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/status_effect/inathneqs_endowment/proc/on_remove  (code/datums/status_effects/buffs.dm:136)
rt.def("/datum/status_effect/inathneqs_endowment/proc/on_remove", function on_remove(f: Frame) {
	rt.callName(f, rt.sv(f, "owner"), "log_message", ["lost Inath-neq's invulnerability", "Attack log"]);
	rt.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='warning'>The light around ＀ flickers and dissipates!</span>", [rt.sv(f, "owner")]), "<span class='boldwarning'>You feel Inath-neq's power fade from your body!</span>"]);
	(rt.modField(f, rt.sv(f, "owner"), "status_flags", 16773119, rt.bitAnd));
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "owner"), rt.rsc("sound/magic/ethereal_exit.ogg"), 50, 1]);
	return f.dot;
});

rt.type(923, "/datum/status_effect/cyborg_power_regen", "/datum/status_effect", {
	power_to_give: 0,
	id: "power_regen",
	duration: 100,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/power_regen"),
});

// /datum/status_effect/cyborg_power_regen/proc/on_creation  (code/datums/status_effects/buffs.dm:149)  may sleep
rt.def("/datum/status_effect/cyborg_power_regen/proc/on_creation", function* on_creation(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((yield* g.call(f, P("/proc/isnum"), null, [live(f.args[1])]))))) return f.dot;
	rt.setSv(f, "power_to_give", live(f.args[1]));
	return f.dot;
}, true, { args: ["new_owner", "new_power_per_tick"] });

// /datum/status_effect/cyborg_power_regen/proc/tick  (code/datums/status_effects/buffs.dm:159)  may sleep
rt.def("/datum/status_effect/cyborg_power_regen/proc/tick", function* tick(f: Frame) {
	let cyborg: Value = null;
	f.vars = () => [cyborg];
	if ((!truthy((rt.istype((cyborg = rt.sv(f, "owner")), T("/mob/living/silicon/robot")) ? 1 : 0)) || !truthy(rt.fv(f, "cell", live(cyborg))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(cyborg), rt.rsc("sound/effects/light_flicker.ogg"), 50, 1]);
	yield* g.callName(f, rt.fv(f, "cell", live(cyborg)), "give", [rt.sv(f, "power_to_give")]);
	return f.dot;
}, true);

rt.type(11073, "/obj/screen/alert/status_effect/his_grace", "/obj/screen/alert/status_effect", {
	alerttooltipstyle: "hisgrace",
	name: "His Grace",
	desc: "His Grace hungers, and you must feed Him.",
	icon_state: "his_grace",
});

// /obj/screen/alert/status_effect/his_grace/proc/MouseEntered  (code/datums/status_effects/buffs.dm:180)
rt.def("/obj/screen/alert/status_effect/his_grace/proc/MouseEntered", function MouseEntered(f: Frame) {
	let HG: Value = null;
	f.vars = () => [HG];
	rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	rt.modSrcVar(f, "desc", fmt("<br><font size=3><b>Current Bloodthirst: ＀</b></font><br>Becomes undroppable at <b>＀</b><br>Will consume you at <b>＀</b>", [rt.gv(f, "bloodlust", (HG = rt.sv(f, "attached_effect"))), 100, 140]), add);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["location", "control", "params"] });

rt.type(924, "/datum/status_effect/his_grace", "/datum/status_effect", {
	bloodlust: 0,
	id: "his_grace",
	duration: -1,
	tick_interval: 4,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/his_grace"),
});

// /datum/status_effect/his_grace/proc/on_apply  (code/datums/status_effects/buffs.dm:188)
rt.def("/datum/status_effect/his_grace/proc/on_apply", function on_apply(f: Frame) {
	rt.callName(f, rt.sv(f, "owner"), "log_message", ["gained His Grace's stun immunity", "Attack log"]);
	rt.callName(f, rt.sv(f, "owner"), "add_stun_absorption", ["hisgrace", 9.999999848243207e+30, 3, null, "His Grace protects you from the stun!"]);
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/status_effect/his_grace/proc/tick  (code/datums/status_effects/buffs.dm:195)  may sleep
rt.def("/datum/status_effect/his_grace/proc/tick", function* tick(f: Frame) {
	let graces: Value = null, HG: Value = null, grace_heal: Value = null;
	let $e: any;
	f.vars = () => [graces, HG, grace_heal, $e];
	rt.setSv(f, "bloodlust", 0);
	graces = 0;
	HG = null;
	rt.forList(f, 0, rt.fv(f, "held_items", rt.sv(f, "owner")), T("/obj/item/weapon/his_grace"));
	while (($e = rt.next(f, 0)) !== undefined) {
		HG = $e;
		if (rt.gt(rt.fv(f, "bloodthirst", live(HG)), rt.sv(f, "bloodlust"))) {
			rt.setSv(f, "bloodlust", rt.fv(f, "bloodthirst", live(HG)));
		}
		if (truthy(rt.fv(f, "awakened", live(HG)))) {
			graces = rt.inc(live(graces), 1);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(graces))) {
		yield* g.callName(f, rt.sv(f, "owner"), "apply_status_effect", [T("/datum/status_effect/his_wrath")]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	grace_heal = multiply(rt.sv(f, "bloodlust"), 0.05000000074505806);
	yield* g.callName(f, rt.sv(f, "owner"), "adjustBruteLoss", [rt.neg(live(grace_heal))]);
	yield* g.callName(f, rt.sv(f, "owner"), "adjustFireLoss", [rt.neg(live(grace_heal))]);
	yield* g.callName(f, rt.sv(f, "owner"), "adjustToxLoss", [rt.neg(live(grace_heal)), 1, 1]);
	yield* g.callName(f, rt.sv(f, "owner"), "adjustOxyLoss", [rt.neg(multiply(live(grace_heal), 2))]);
	yield* g.callName(f, rt.sv(f, "owner"), "adjustCloneLoss", [rt.neg(live(grace_heal))]);
	return f.dot;
}, true);

// /datum/status_effect/his_grace/proc/on_remove  (code/datums/status_effects/buffs.dm:212)
rt.def("/datum/status_effect/his_grace/proc/on_remove", function on_remove(f: Frame) {
	rt.callName(f, rt.sv(f, "owner"), "log_message", ["lost His Grace's stun immunity", "Attack log"]);
	if (!(truthy((rt.istype(rt.fv(f, "stun_absorption", rt.sv(f, "owner")), T("/list")) ? 1 : 0)) && truthy(rt.index(rt.fv(f, "stun_absorption", rt.sv(f, "owner")), "hisgrace")))) return f.dot;
	(rt.modField(f, rt.sv(f, "owner"), "stun_absorption", "hisgrace", subtract));
	return f.dot;
});

rt.type(925, "/datum/status_effect/wish_granters_gift", "/datum/status_effect", {
	id: "wish_granters_gift",
	duration: 50,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/wish_granters_gift"),
});

// /datum/status_effect/wish_granters_gift/proc/on_apply  (code/datums/status_effects/buffs.dm:223)
rt.def("/datum/status_effect/wish_granters_gift/proc/on_apply", function on_apply(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>Death is not your end! The Wish Granter's energy suffuses you, and you begin to rise...</span>"]);
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/status_effect/wish_granters_gift/proc/on_remove  (code/datums/status_effects/buffs.dm:227)  may sleep
rt.def("/datum/status_effect/wish_granters_gift/proc/on_remove", function* on_remove(f: Frame) {
	yield* g.callName(f, rt.sv(f, "owner"), "revive", ["full_heal", 1, "admin_revive", 1], rt.Args.Named);
	yield* g.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='warning'>＀ appears to wake from the dead, having healed all wounds!</span>", [rt.sv(f, "owner")]), "<span class='notice'>You have regenerated.</span>"]);
	yield* g.callName(f, rt.sv(f, "owner"), "update_canmove", []);
	return f.dot;
}, true);

rt.type(926, "/datum/status_effect/cult_master", "/datum/status_effect", {
	alive: 1,
	id: "The Cult Master",
	duration: -1,
	on_remove_on_mob_delete: 1,
	alert_type: null,
});

// /datum/status_effect/cult_master/proc/deathrattle  (code/datums/status_effects/buffs.dm:244)
rt.def("/datum/status_effect/cult_master/proc/deathrattle", function deathrattle(f: Frame) {
	let A: Value = null, B: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [A, B, M, $e];
	if (!(!truthy(rt.gl("cult_narsie")) || truthy(rt.fv(f, "gc_destroyed", rt.gl("cult_narsie"))))) {
		return live(f.dot);
	}
	A = rt.call(f, P("/proc/get_area"), null, [rt.sv(f, "owner")]);
	B = null;
	rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		if (truthy((rt.istype(rt.fv(f, "current", live(B)), T("/mob/living")) ? 1 : 0))) {
			M = rt.fv(f, "current", live(B));
			rt.op(f, "Output", [], [live(M), rt.rsc("sound/hallucinations/veryfar_noise.ogg")], false);
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='cultlarge'>The Cult's Master, ＀, has fallen in ％！!</span>", [rt.sv(f, "owner"), live(A)])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/status_effect/cult_master/proc/tick  (code/datums/status_effects/buffs.dm:254)
rt.def("/datum/status_effect/cult_master/proc/tick", function tick(f: Frame) {
	if ((!isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 2) && !truthy(rt.sv(f, "alive")))) {
		rt.setSv(f, "alive", 1);
		return live(f.dot);
	}
	if (!(isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 2) && truthy(rt.sv(f, "alive")))) return f.dot;
	rt.setSv(f, "alive", 0);
	rt.callSrc(f, "deathrattle", []);
	return f.dot;
});

// /datum/status_effect/cult_master/proc/on_remove  (code/datums/status_effects/buffs.dm:262)
rt.def("/datum/status_effect/cult_master/proc/on_remove", function on_remove(f: Frame) {
	rt.callSrc(f, "deathrattle", []);
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(927, "/datum/status_effect/blooddrunk", "/datum/status_effect", {
	last_health: 0,
	last_bruteloss: 0,
	last_fireloss: 0,
	last_toxloss: 0,
	last_oxyloss: 0,
	last_cloneloss: 0,
	last_staminaloss: 0,
	id: "blooddrunk",
	duration: 10,
	tick_interval: 0,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/blooddrunk"),
});

// /datum/status_effect/blooddrunk/proc/on_apply  (code/datums/status_effects/buffs.dm:284)  may sleep
rt.def("/datum/status_effect/blooddrunk/proc/on_apply", function* on_apply(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	(rt.modField(f, rt.sv(f, "owner"), "maxHealth", 10, multiply));
	(rt.modField(f, rt.sv(f, "owner"), "bruteloss", 10, multiply));
	(rt.modField(f, rt.sv(f, "owner"), "fireloss", 10, multiply));
	(rt.modField(f, rt.sv(f, "owner"), "toxloss", 10, multiply));
	(rt.modField(f, rt.sv(f, "owner"), "oxyloss", 10, multiply));
	(rt.modField(f, rt.sv(f, "owner"), "cloneloss", 10, multiply));
	(rt.modField(f, rt.sv(f, "owner"), "staminaloss", 10, multiply));
	yield* g.callName(f, rt.sv(f, "owner"), "updatehealth", []);
	rt.setSv(f, "last_health", rt.fv(f, "health", rt.sv(f, "owner")));
	rt.setSv(f, "last_bruteloss", (yield* g.callName(f, rt.sv(f, "owner"), "getBruteLoss", [])));
	rt.setSv(f, "last_fireloss", (yield* g.callName(f, rt.sv(f, "owner"), "getFireLoss", [])));
	rt.setSv(f, "last_toxloss", (yield* g.callName(f, rt.sv(f, "owner"), "getToxLoss", [])));
	rt.setSv(f, "last_oxyloss", (yield* g.callName(f, rt.sv(f, "owner"), "getOxyLoss", [])));
	rt.setSv(f, "last_cloneloss", (yield* g.callName(f, rt.sv(f, "owner"), "getCloneLoss", [])));
	rt.setSv(f, "last_staminaloss", (yield* g.callName(f, rt.sv(f, "owner"), "getStaminaLoss", [])));
	yield* g.callName(f, rt.sv(f, "owner"), "log_message", ["gained blood-drunk stun immunity", "Attack log"]);
	yield* g.callName(f, rt.sv(f, "owner"), "add_stun_absorption", ["blooddrunk", 9.999999848243207e+30, 4]);
	yield* g.callName(f, rt.sv(f, "owner"), "playsound_local", [rt.getStep(f, rt.sv(f, "owner"), 0), rt.rsc("sound/effects/singlebeat.ogg"), 40, 1]);
	return f.dot;
}, true);

// /datum/status_effect/blooddrunk/proc/tick  (code/datums/status_effects/buffs.dm:306)  may sleep
rt.def("/datum/status_effect/blooddrunk/proc/tick", function* tick(f: Frame) {
	let needs_health_update: Value = null, new_bruteloss: Value = null, heal_amount: Value = null, new_fireloss: Value = null, heal_amount_3: Value = null, new_toxloss: Value = null, heal_amount_4: Value = null, new_oxyloss: Value = null, heal_amount_5: Value = null, new_cloneloss: Value = null, heal_amount_6: Value = null, new_staminaloss: Value = null, heal_amount_7: Value = null;
	f.vars = () => [needs_health_update, new_bruteloss, heal_amount, new_fireloss, heal_amount_3, new_toxloss, heal_amount_4, new_oxyloss, heal_amount_5, new_cloneloss, heal_amount_6, new_staminaloss, heal_amount_7];
	if (rt.gt(rt.fv(f, "health", rt.sv(f, "owner")), rt.sv(f, "last_health"))) {
		needs_health_update = 0;
		if (rt.lt((new_bruteloss = (yield* g.callName(f, rt.sv(f, "owner"), "getBruteLoss", []))), rt.sv(f, "last_bruteloss"))) {
			heal_amount = multiply(subtract(live(new_bruteloss), rt.sv(f, "last_bruteloss")), 10);
			yield* g.callName(f, rt.sv(f, "owner"), "adjustBruteLoss", [null, live(heal_amount), "updating_health", 0], rt.Args.Named);
			new_bruteloss = (yield* g.callName(f, rt.sv(f, "owner"), "getBruteLoss", []));
			needs_health_update = 1;
		}
		rt.setSv(f, "last_bruteloss", live(new_bruteloss));
		if (rt.lt((new_fireloss = (yield* g.callName(f, rt.sv(f, "owner"), "getFireLoss", []))), rt.sv(f, "last_fireloss"))) {
			heal_amount_3 = multiply(subtract(live(new_fireloss), rt.sv(f, "last_fireloss")), 10);
			yield* g.callName(f, rt.sv(f, "owner"), "adjustFireLoss", [null, live(heal_amount_3), "updating_health", 0], rt.Args.Named);
			new_fireloss = (yield* g.callName(f, rt.sv(f, "owner"), "getFireLoss", []));
			needs_health_update = 1;
		}
		rt.setSv(f, "last_fireloss", live(new_fireloss));
		if (rt.lt((new_toxloss = (yield* g.callName(f, rt.sv(f, "owner"), "getToxLoss", []))), rt.sv(f, "last_toxloss"))) {
			heal_amount_4 = multiply(subtract(live(new_toxloss), rt.sv(f, "last_toxloss")), 10);
			yield* g.callName(f, rt.sv(f, "owner"), "adjustToxLoss", [null, live(heal_amount_4), "updating_health", 0], rt.Args.Named);
			new_toxloss = (yield* g.callName(f, rt.sv(f, "owner"), "getToxLoss", []));
			needs_health_update = 1;
		}
		rt.setSv(f, "last_toxloss", live(new_toxloss));
		if (rt.lt((new_oxyloss = (yield* g.callName(f, rt.sv(f, "owner"), "getOxyLoss", []))), rt.sv(f, "last_oxyloss"))) {
			heal_amount_5 = multiply(subtract(live(new_oxyloss), rt.sv(f, "last_oxyloss")), 10);
			yield* g.callName(f, rt.sv(f, "owner"), "adjustOxyLoss", [null, live(heal_amount_5), "updating_health", 0], rt.Args.Named);
			new_oxyloss = (yield* g.callName(f, rt.sv(f, "owner"), "getOxyLoss", []));
			needs_health_update = 1;
		}
		rt.setSv(f, "last_oxyloss", live(new_oxyloss));
		if (rt.lt((new_cloneloss = (yield* g.callName(f, rt.sv(f, "owner"), "getCloneLoss", []))), rt.sv(f, "last_cloneloss"))) {
			heal_amount_6 = multiply(subtract(live(new_cloneloss), rt.sv(f, "last_cloneloss")), 10);
			yield* g.callName(f, rt.sv(f, "owner"), "adjustCloneLoss", [null, live(heal_amount_6), "updating_health", 0], rt.Args.Named);
			new_cloneloss = (yield* g.callName(f, rt.sv(f, "owner"), "getCloneLoss", []));
			needs_health_update = 1;
		}
		rt.setSv(f, "last_cloneloss", live(new_cloneloss));
		if (rt.lt((new_staminaloss = (yield* g.callName(f, rt.sv(f, "owner"), "getStaminaLoss", []))), rt.sv(f, "last_staminaloss"))) {
			heal_amount_7 = multiply(subtract(live(new_staminaloss), rt.sv(f, "last_staminaloss")), 10);
			yield* g.callName(f, rt.sv(f, "owner"), "adjustStaminaLoss", [null, live(heal_amount_7), "updating_health", 0], rt.Args.Named);
			new_staminaloss = (yield* g.callName(f, rt.sv(f, "owner"), "getStaminaLoss", []));
			needs_health_update = 1;
		}
		rt.setSv(f, "last_staminaloss", live(new_staminaloss));
		if (truthy(live(needs_health_update))) {
			yield* g.callName(f, rt.sv(f, "owner"), "updatehealth", []);
			yield* g.callName(f, rt.sv(f, "owner"), "playsound_local", [rt.getStep(f, rt.sv(f, "owner"), 0), rt.rsc("sound/effects/singlebeat.ogg"), 40, 1]);
		}
	}
	rt.setSv(f, "last_health", rt.fv(f, "health", rt.sv(f, "owner")));
	return f.dot;
}, true);

// /datum/status_effect/blooddrunk/proc/on_remove  (code/datums/status_effects/buffs.dm:362)  may sleep
rt.def("/datum/status_effect/blooddrunk/proc/on_remove", function* on_remove(f: Frame) {
	yield* g.srcCall(f, "tick");
	(rt.modField(f, rt.sv(f, "owner"), "maxHealth", 0.10000000149011612, multiply));
	(rt.modField(f, rt.sv(f, "owner"), "bruteloss", 0.10000000149011612, multiply));
	(rt.modField(f, rt.sv(f, "owner"), "fireloss", 0.10000000149011612, multiply));
	(rt.modField(f, rt.sv(f, "owner"), "toxloss", 0.10000000149011612, multiply));
	(rt.modField(f, rt.sv(f, "owner"), "oxyloss", 0.10000000149011612, multiply));
	(rt.modField(f, rt.sv(f, "owner"), "cloneloss", 0.10000000149011612, multiply));
	(rt.modField(f, rt.sv(f, "owner"), "staminaloss", 0.10000000149011612, multiply));
	yield* g.callName(f, rt.sv(f, "owner"), "updatehealth", []);
	yield* g.callName(f, rt.sv(f, "owner"), "log_message", ["lost blood-drunk stun immunity", "Attack log"]);
	if (!(truthy((rt.istype(rt.fv(f, "stun_absorption", rt.sv(f, "owner")), T("/list")) ? 1 : 0)) && truthy(rt.index(rt.fv(f, "stun_absorption", rt.sv(f, "owner")), "blooddrunk")))) return f.dot;
	(rt.modField(f, rt.sv(f, "owner"), "stun_absorption", "blooddrunk", subtract));
	return f.dot;
}, true);
