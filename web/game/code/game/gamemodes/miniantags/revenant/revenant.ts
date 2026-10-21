// From code/game/gamemodes/miniantags/revenant/revenant.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5031, "/mob/living/simple_animal/revenant", "/mob/living/simple_animal", {
	icon_idle: "revenant_idle",
	icon_reveal: "revenant_revealed",
	icon_stun: "revenant_stun",
	icon_drain: "revenant_draining",
	stasis: 0,
	essence: 75,
	essence_regen_cap: 75,
	essence_regenerating: 1,
	essence_regen_amount: 5,
	essence_accumulated: 0,
	revealed: 0,
	unreveal_time: 0,
	unstun_time: 0,
	inhibited: 0,
	essence_drained: 0,
	draining: 0,
	drained_mobs: null,
	perfectsouls: 0,
	generated_objectives_and_spells: 0,
	anchored: 1,
	pass_flags: 21,
	hud_possible: null,
	name: "revenant",
	desc: "A malevolent spirit.",
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "revenant_idle",
	incorporeal_move: 3,
	invisibility: 50,
	health: 1e+31,
	maxHealth: 1e+31,
	layer: 6,
	healable: 0,
	sight: 32,
	see_in_dark: 8,
	lighting_alpha: 128,
	response_help: "passes through",
	response_disarm: "swings through",
	response_harm: "punches through",
	unsuitable_atmos_damage: 0,
	damage_coeff: null,
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1e+31,
	harm_intent_damage: 0,
	friendly: "touches",
	status_flags: 0,
	wander: 0,
	density: 0,
	movement_type: 2,
	mob_size: 0,
	speed: 1,
	unique_name: 1,
});

// /mob/living/simple_animal/revenant/proc/<init>  (code/game/gamemodes/miniantags/revenant/revenant.dm:47)
rt.def("/mob/living/simple_animal/revenant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hud_possible", rt.list("15"));
	$0 = $0;
	rt.setSv(f, "drained_mobs", rt.list());
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});

// /mob/living/simple_animal/revenant/proc/Login  (code/game/gamemodes/miniantags/revenant/revenant.dm:65)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/Login", function* Login(f: Frame) {
	let objective: Value = null, objective2: Value = null;
	f.vars = () => [objective, objective2];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='deadsay'><font size=3><b>You are a revenant.</b></font></span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>Your formerly mundane spirit has been infused with alien energies and empowered into a revenant.</b>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>You are not dead, not alive, but somewhere in between. You are capable of limited interaction with both worlds.</b>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>You are invincible and invisible to everyone but other ghosts. Most abilities will reveal you, rendering you vulnerable.</b>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>To function, you are to drain the life essence from humans. This essence is a resource, as well as your health, and will power all of your abilities.</b>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b><i>You do not remember anything of your past lives, nor will you remember anything about this one after your death.</i></b>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>Be sure to read the wiki page at https://tgstation13.org/wiki/Revenant to learn more.</b>"]);
	if (truthy(rt.sv(f, "generated_objectives_and_spells"))) return f.dot;
	rt.setSv(f, "generated_objectives_and_spells", 1);
	yield* g.callName(f, rt.sv(f, "mind"), "remove_all_antag", []);
	yield* g.callName(f, rt.sv(f, "mind"), "wipe_memory", []);
	rt.op(f, "Output", [], [live(f.src), rt.rsc("sound/effects/ghost.ogg")], false);
	rt.setFv(f, "owner", (objective = (yield* g.new_(f, T("/datum/objective/revenant"), []))), rt.sv(f, "mind"));
	rt.modField(f, rt.sv(f, "mind"), "objectives", live(objective), add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<b>Objective #1</b>: ＀", [rt.fv(f, "explanation_text", live(objective))])]);
	rt.setFv(f, "owner", (objective2 = (yield* g.new_(f, T("/datum/objective/revenantFluff"), []))), rt.sv(f, "mind"));
	rt.modField(f, rt.sv(f, "mind"), "objectives", live(objective2), add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<b>Objective #2</b>: ＀", [rt.fv(f, "explanation_text", live(objective2))])]);
	rt.setFv(f, "assigned_role", rt.sv(f, "mind"), "revenant");
	rt.setFv(f, "special_role", rt.sv(f, "mind"), "Revenant");
	(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.sv(f, "mind"), rt.bitOr));
	yield* g.srcCall(f, "AddSpell", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/night_vision/revenant"), [null])));
	yield* g.srcCall(f, "AddSpell", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/revenant_transmit"), [null])));
	yield* g.srcCall(f, "AddSpell", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/revenant/defile"), [null])));
	yield* g.srcCall(f, "AddSpell", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/revenant/overload"), [null])));
	yield* g.srcCall(f, "AddSpell", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/revenant/blight"), [null])));
	yield* g.srcCall(f, "AddSpell", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/revenant/malfunction"), [null])));
	return f.dot;
}, true);

// /mob/living/simple_animal/revenant/proc/Life  (code/game/gamemodes/miniantags/revenant/revenant.dm:100)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/Life", function* Life(f: Frame) {
	if (truthy(rt.sv(f, "stasis"))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "revealed")) && rt.le(rt.sv(f, "essence"), 0))) {
		yield* g.srcCall(f, "death");
	}
	if ((truthy(rt.sv(f, "unreveal_time")) && rt.ge(rt.worldTime(f), rt.sv(f, "unreveal_time")))) {
		rt.setSv(f, "unreveal_time", 0);
		rt.setSv(f, "revealed", 0);
		rt.setSv(f, "incorporeal_move", 3);
		rt.setSv(f, "invisibility", 50);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='revenboldnotice'>You are once more concealed.</span>"]);
	}
	if ((truthy(rt.sv(f, "unstun_time")) && rt.ge(rt.worldTime(f), rt.sv(f, "unstun_time")))) {
		rt.setSv(f, "unstun_time", 0);
		rt.setSv(f, "notransform", 0);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='revenboldnotice'>You can move again!</span>"]);
	}
	if (((truthy(rt.sv(f, "essence_regenerating")) && !truthy(rt.sv(f, "inhibited"))) && rt.lt(rt.sv(f, "essence"), rt.sv(f, "essence_regen_cap")))) {
		rt.setSv(f, "essence", (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "essence_regen_cap"), add(rt.sv(f, "essence"), rt.sv(f, "essence_regen_amount"))])));
		yield* g.srcCall(f, "update_action_buttons_icon");
	}
	yield* g.srcCall(f, "update_spooky_icon");
	yield* g.srcCall(f, "update_health_hud");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/revenant/proc/Stat  (code/game/gamemodes/miniantags/revenant/revenant.dm:120)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/Stat", function* Stat(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Current essence: ＀/＀E", [rt.sv(f, "essence"), rt.sv(f, "essence_regen_cap")])]);
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Stolen essence: ＀E", [rt.sv(f, "essence_accumulated")])]);
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Stolen perfect souls: ＀", [rt.sv(f, "perfectsouls")])]);
	return f.dot;
}, true);

// /mob/living/simple_animal/revenant/proc/update_health_hud  (code/game/gamemodes/miniantags/revenant/revenant.dm:128)
rt.def("/mob/living/simple_animal/revenant/proc/update_health_hud", function update_health_hud(f: Frame) {
	let essencecolor: Value = null;
	f.vars = () => [essencecolor];
	if (!truthy(rt.sv(f, "hud_used"))) return f.dot;
	essencecolor = "#8F48C6";
	if (rt.gt(rt.sv(f, "essence"), rt.sv(f, "essence_regen_cap"))) {
		essencecolor = "#9A5ACB";
	} else {
		if (!truthy(rt.sv(f, "essence"))) {
			essencecolor = "#1D2953";
		}
	}
	rt.setFv(f, "maptext", rt.fv(f, "healths", rt.sv(f, "hud_used")), fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='＀'>＀E</font></div>", [live(essencecolor), rt.sv(f, "essence")]));
	return f.dot;
});

// /mob/living/simple_animal/revenant/proc/say  (code/game/gamemodes/miniantags/revenant/revenant.dm:142)
rt.def("/mob/living/simple_animal/revenant/proc/say", function say(f: Frame, message: Value) {
	let rendered: Value = null, M: Value = null, link: Value = null;
	let $e: any;
	f.vars = () => [rendered, M, link, $e];
	if (!truthy(live(message))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/log_say"), null, [fmt("＀ : ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.src)]), live(message)])]);
	rendered = fmt("<span class='revennotice'><b>＀</b> says, \"＀\"</span>", [live(f.src), live(message)]);
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/mob/living/simple_animal/revenant")) ? 1 : 0))) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), live(rendered)]);
		} else {
			if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
				link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(f.src)]);
				rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(rendered)])]);
			}
		}
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /mob/living/simple_animal/revenant/proc/attackby  (code/game/gamemodes/miniantags/revenant/revenant.dm:176)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/attackby", function* attackby(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/nullrod")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ violently flinches!</span>", [live(f.src)]), fmt("<span class='revendanger'>As ％！ passes through you, you feel your essence draining away!</span>", [live(f.args[0])]));
	yield* g.srcCall(f, "adjustBruteLoss", 25);
	rt.setSv(f, "inhibited", 1);
	yield* g.srcCall(f, "update_action_buttons_icon");
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/revenant/proc/reset_inhibit")])), 30]);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /mob/living/simple_animal/revenant/proc/reset_inhibit  (code/game/gamemodes/miniantags/revenant/revenant.dm:187)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/reset_inhibit", function* reset_inhibit(f: Frame) {
	rt.setSv(f, "inhibited", 0);
	yield* g.srcCall(f, "update_action_buttons_icon");
	return f.dot;
}, true);

// /mob/living/simple_animal/revenant/proc/adjustHealth  (code/game/gamemodes/miniantags/revenant/revenant.dm:190)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/adjustHealth", function* adjustHealth(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [amount, updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if ((!truthy(live(forced)) && !truthy(rt.sv(f, "revealed")))) {
		return 0;
	}
	f.dot = live(amount);
	rt.setSv(f, "essence", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "essence"), live(amount))])));
	if (truthy(live(updating_health))) {
		yield* g.srcCall(f, "update_health_hud");
	}
	if (truthy(rt.sv(f, "essence"))) return f.dot;
	yield* g.srcCall(f, "death");
	return f.dot;
}, true);

// /mob/living/simple_animal/revenant/proc/dust  (code/game/gamemodes/miniantags/revenant/revenant.dm:200)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/dust", function* dust(f: Frame) {
	yield* g.srcCall(f, "death");
	return f.dot;
}, true);

// /mob/living/simple_animal/revenant/proc/gib  (code/game/gamemodes/miniantags/revenant/revenant.dm:203)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/gib", function* gib(f: Frame) {
	yield* g.srcCall(f, "death");
	return f.dot;
}, true);

// /mob/living/simple_animal/revenant/proc/death  (code/game/gamemodes/miniantags/revenant/revenant.dm:206)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/death", function* death(f: Frame) {
	let i: Value = null, reforming_essence: Value = null, R: Value = null;
	f.vars = () => [i, reforming_essence, R];
	if ((!truthy(rt.sv(f, "revealed")) || truthy(rt.sv(f, "stasis")))) {
		return 0;
	}
	rt.setSv(f, "stasis", 1);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revendanger'>NO! No... it's too late, you can feel your essence ＀...</span>", [rt.op(f, "PickUnweighted", [2], ["breaking apart", "drifting away"])])]);
	rt.setSv(f, "notransform", 1);
	rt.setSv(f, "revealed", 1);
	rt.setSv(f, "invisibility", 0);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/screech.ogg"), 100, 1]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ lets out a waning screech as violet mist swirls around its dissolving body!</span>", [live(f.src)]));
	rt.setSv(f, "icon_state", "revenant_draining");
	i = null;
	i = rt.sv(f, "alpha");
	while (rt.gt(live(i), 0)) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
		rt.setSv(f, "alpha", live(i));
		(i = rt.modify(live(i), 10, subtract));
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀'s body breaks apart into a fine pile of blue dust.</span>", [live(f.src)]));
	reforming_essence = rt.sv(f, "essence_regen_cap");
	rt.setFv(f, "essence", (R = (yield* g.new_(f, T("/obj/item/weapon/ectoplasm/revenant"), [rt.getStep(f, live(f.src), 0)]))), (yield* g.call(f, P("/proc/max"), null, [subtract(live(reforming_essence), multiply(15, rt.sv(f, "perfectsouls"))), 75])));
	rt.setFv(f, "client_to_revive", live(R), rt.sv(f, "client"));
	rt.setFv(f, "revenant", live(R), live(f.src));
	rt.setSv(f, "invisibility", 101);
	rt.setSv(f, "revealed", 0);
	yield* g.srcCall(f, "ghostize", 0);
	return live(f.dot);
}, true);

// /mob/living/simple_animal/revenant/proc/reveal  (code/game/gamemodes/miniantags/revenant/revenant.dm:233)
rt.def("/mob/living/simple_animal/revenant/proc/reveal", function reveal(f: Frame, time: Value) {
	if (!truthy(live(f.src))) {
		return live(f.dot);
	}
	if (rt.le(live(time), 0)) {
		return live(f.dot);
	}
	rt.setSv(f, "revealed", 1);
	rt.setSv(f, "invisibility", 0);
	rt.setSv(f, "incorporeal_move", 0);
	if (!truthy(rt.sv(f, "unreveal_time"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='revendanger'>You have been revealed!</span>"]);
		rt.setSv(f, "unreveal_time", add(rt.worldTime(f), live(time)));
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='revenwarning'>You have been revealed!</span>"]);
		rt.setSv(f, "unreveal_time", add(rt.sv(f, "unreveal_time"), live(time)));
	}
	rt.callSrc(f, "update_spooky_icon", []);
	return f.dot;
});

// /mob/living/simple_animal/revenant/proc/stun  (code/game/gamemodes/miniantags/revenant/revenant.dm:249)
rt.def("/mob/living/simple_animal/revenant/proc/stun", function stun(f: Frame, time: Value) {
	if (!truthy(live(f.src))) {
		return live(f.dot);
	}
	if (rt.le(live(time), 0)) {
		return live(f.dot);
	}
	rt.setSv(f, "notransform", 1);
	if (!truthy(rt.sv(f, "unstun_time"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='revendanger'>You cannot move!</span>"]);
		rt.setSv(f, "unstun_time", add(rt.worldTime(f), live(time)));
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='revenwarning'>You cannot move!</span>"]);
		rt.setSv(f, "unstun_time", add(rt.sv(f, "unstun_time"), live(time)));
	}
	rt.callSrc(f, "update_spooky_icon", []);
	return f.dot;
});

// /mob/living/simple_animal/revenant/proc/update_spooky_icon  (code/game/gamemodes/miniantags/revenant/revenant.dm:266)
rt.def("/mob/living/simple_animal/revenant/proc/update_spooky_icon", function update_spooky_icon(f: Frame) {
	if (truthy(rt.sv(f, "revealed"))) {
		if (truthy(rt.sv(f, "notransform"))) {
			if (truthy(rt.sv(f, "draining"))) {
				rt.setSv(f, "icon_state", rt.sv(f, "icon_drain"));
			} else {
				rt.setSv(f, "icon_state", rt.sv(f, "icon_stun"));
			}
		} else {
			rt.setSv(f, "icon_state", rt.sv(f, "icon_reveal"));
		}
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_idle"));
	}
	return f.dot;
});

// /mob/living/simple_animal/revenant/proc/castcheck  (code/game/gamemodes/miniantags/revenant/revenant.dm:275)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/castcheck", function* castcheck(f: Frame, essence_cost: Value) {
	let _T: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [essence_cost, _T, O, $e];
	if (!truthy(live(f.src))) {
		return live(f.dot);
	}
	if (truthy((rt.istype((_T = rt.getStep(f, live(f.src), 0)), T("/turf/closed")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='revenwarning'>You cannot use abilities from inside of a wall.</span>"]);
		return 0;
	}
	O = null;
	rt.forList(f, 0, live(_T), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((truthy(rt.fv(f, "density", live(O))) && !truthy((yield* g.callName(f, live(O), "CanPass", [live(f.src), live(_T), 5]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='revenwarning'>You cannot use abilities inside of a dense object.</span>"]);
			return 0;
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "inhibited"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='revenwarning'>Your powers have been suppressed by nulling energy!</span>"]);
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "change_essence_amount", live(essence_cost), 1)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='revenwarning'>You lack the essence to use that ability.</span>"]);
		return 0;
	}
	return 1;
}, true);

// /mob/living/simple_animal/revenant/proc/change_essence_amount  (code/game/gamemodes/miniantags/revenant/revenant.dm:294)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/change_essence_amount", function* change_essence_amount(f: Frame, essence_amt: Value, silent: Value, source: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [essence_amt, silent, source, $0, $1, $2];
	if (live(silent) === null) {
		silent = 0;
	}
	if (live(source) === null) {
		source = null;
	}
	if (!truthy(live(f.src))) {
		return live(f.dot);
	}
	if (rt.le(add(rt.sv(f, "essence"), live(essence_amt)), 0)) {
		return live(f.dot);
	}
	rt.setSv(f, "essence", (yield* g.call(f, P("/proc/max"), null, [0, add(rt.sv(f, "essence"), live(essence_amt))])));
	yield* g.srcCall(f, "update_action_buttons_icon");
	yield* g.srcCall(f, "update_health_hud");
	if (rt.gt(live(essence_amt), 0)) {
		rt.setSv(f, "essence_accumulated", (yield* g.call(f, P("/proc/max"), null, [0, add(rt.sv(f, "essence_accumulated"), live(essence_amt))])));
	}
	if (!truthy(live(silent))) {
		if (rt.gt(live(essence_amt), 0)) {
			$0 = live(f.src);
			$1 = live(essence_amt);
			if (truthy(live(source))) {
				$1 = $1;
				$2 = fmt(" from ＀", [live(source)]);
			} else {
				$2 = "";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='revennotice'>Gained ＀E＀.</span>", [$1, $2])]);
		} else {
			$0 = live(f.src);
			$1 = live(essence_amt);
			if (truthy(live(source))) {
				$1 = $1;
				$2 = fmt(" from ＀", [live(source)]);
			} else {
				$2 = "";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='revenminor'>Lost ＀E＀.</span>", [$1, $2])]);
		}
	}
	return 1;
}, true);

rt.type(6670, "/obj/item/weapon/ectoplasm/revenant", "/obj/item/weapon/ectoplasm", {
	essence: 75,
	reforming: 1,
	inert: 0,
	client_to_revive: null,
	revenant: null,
	name: "glimmering residue",
	desc: "A pile of fine blue dust. Small tendrils of violet mist swirl around it.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "revenantEctoplasm",
	w_class: 2,
});

// /obj/item/weapon/ectoplasm/revenant/proc/New  (code/game/gamemodes/miniantags/revenant/revenant.dm:337)  may sleep
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/ectoplasm/revenant/proc/try_reform")])), 600]);
	return f.dot;
}, true);

// /obj/item/weapon/ectoplasm/revenant/proc/scatter  (code/game/gamemodes/miniantags/revenant/revenant.dm:341)  may sleep
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/scatter", function* scatter(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/ectoplasm/revenant/proc/try_reform  (code/game/gamemodes/miniantags/revenant/revenant.dm:346)  may sleep
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/try_reform", function* try_reform(f: Frame) {
	if (truthy(rt.sv(f, "reforming"))) {
		rt.setSv(f, "reforming", 0);
		yield* g.srcCall(f, "reform");
	} else {
		rt.setSv(f, "inert", 1);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ settles down and seems lifeless.</span>", [live(f.src)]));
	}
	return f.dot;
}, true);

// /obj/item/weapon/ectoplasm/revenant/proc/attack_self  (code/game/gamemodes/miniantags/revenant/revenant.dm:352)  may sleep
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/attack_self", function* attack_self(f: Frame) {
	if ((!truthy(rt.sv(f, "reforming")) || truthy(rt.sv(f, "inert")))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='notice'>＀ scatters ＀ in all directions.</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You scatter ＀ across the area. The particles slowly fade away.</span>", [live(f.src)])]);
	yield* g.callName(f, live(f.args[0]), "drop_item", []);
	yield* g.srcCall(f, "scatter");
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/ectoplasm/revenant/proc/throw_impact  (code/game/gamemodes/miniantags/revenant/revenant.dm:360)  may sleep
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/throw_impact", function* throw_impact(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "inert"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ breaks into particles upon impact, which fade away to nothingness.</span>", [live(f.src)]));
	yield* g.srcCall(f, "scatter");
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

// /obj/item/weapon/ectoplasm/revenant/proc/examine  (code/game/gamemodes/miniantags/revenant/revenant.dm:367)
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "inert"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='revennotice'>It seems inert.</span>"]);
	} else {
		if (!truthy(rt.sv(f, "reforming"))) return f.dot;
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='revenwarning'>It is shifting and distorted. It would be wise to destroy this.</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/ectoplasm/revenant/proc/reform  (code/game/gamemodes/miniantags/revenant/revenant.dm:374)  may sleep
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/reform", function* reform(f: Frame) {
	let key_of_revenant: Value = null, M: Value = null, candidates: Value = null, C: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [key_of_revenant, M, candidates, C, $0, $1, $e];
	if ((((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || (!truthy(rt.sv(f, "revenant")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "revenant"))))) || truthy(rt.sv(f, "inert")))) {
		return live(f.dot);
	}
	key_of_revenant = null;
	yield* g.call(f, P("/proc/message_admins"), null, ["Revenant ectoplasm was left undestroyed for 1 minute and is reforming into a new revenant."]);
	rt.setSv(f, "loc", rt.getStep(f, live(f.src), 0));
	yield* g.callName(f, rt.sv(f, "revenant"), "forceMove", [rt.sv(f, "loc")]);
	if (truthy(rt.sv(f, "client_to_revive"))) {
		M = null;
		rt.forList(f, 0, rt.gl("dead_mob_list"), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (isEqual(rt.fv(f, "client", live(M)), rt.sv(f, "client_to_revive"))) {
				rt.setFv(f, "client", rt.sv(f, "revenant"), rt.sv(f, "client_to_revive"));
				key_of_revenant = rt.fv(f, "key", rt.sv(f, "client_to_revive"));
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(live(key_of_revenant))) {
		yield* g.call(f, P("/proc/message_admins"), null, ["The new revenant's old client either could not be found or is in a new, living mob - grabbing a random candidate instead..."]);
		if (!truthy(rt.getLen(f, (candidates = (yield* g.call(f, P("/proc/pollCandidatesForMob"), null, [fmt("Do you want to be ＀ (reforming)?", [rt.fv(f, "name", rt.sv(f, "revenant"))]), "revenant", null, "revenant", 50, rt.sv(f, "revenant")])))))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "revenant")]);
			yield* g.call(f, P("/proc/message_admins"), null, ["No candidates were found for the new revenant. Oh well!"]);
			rt.setSv(f, "inert", 1);
			yield* g.srcCall(f, "visible_message", fmt("<span class='revenwarning'>＀ settles down and seems lifeless.</span>", [live(f.src)]));
			return live(f.dot);
		}
		C = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
		rt.setFv(f, "client", rt.sv(f, "revenant"), live(C));
		if (!truthy((key_of_revenant = rt.fv(f, "key", live(C))))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "revenant")]);
			yield* g.call(f, P("/proc/message_admins"), null, ["No ckey was found for the new revenant. Oh well!"]);
			rt.setSv(f, "inert", 1);
			yield* g.srcCall(f, "visible_message", fmt("<span class='revenwarning'>＀ settles down and seems lifeless.</span>", [live(f.src)]));
			return live(f.dot);
		}
	}
	$0 = live(key_of_revenant);
	if (truthy(rt.sv(f, "client_to_revive"))) {
		$1 = "re";
	} else {
		$1 = "";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been ＀made into a revenant by reforming ectoplasm.", [$0, $1])]);
	$0 = live(key_of_revenant);
	if (truthy(rt.sv(f, "client_to_revive"))) {
		$1 = "re";
	} else {
		$1 = "";
	}
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ was ＀made as a revenant by reforming ectoplasm.", [$0, $1])]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='revenboldnotice'>＀ suddenly rises into the air before fading away.</span>", [live(f.src)]));
	rt.setFv(f, "essence", rt.sv(f, "revenant"), rt.sv(f, "essence"));
	rt.setFv(f, "essence_regen_cap", rt.sv(f, "revenant"), rt.sv(f, "essence"));
	yield* g.callName(f, rt.sv(f, "revenant"), "death_reset", []);
	rt.setFv(f, "key", rt.sv(f, "revenant"), live(key_of_revenant));
	rt.setSv(f, "revenant", null);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/ectoplasm/revenant/proc/Destroy  (code/game/gamemodes/miniantags/revenant/revenant.dm:416)  may sleep
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/Destroy", function* Destroy(f: Frame) {
	if (!(!truthy(rt.sv(f, "revenant")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "revenant"))))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "revenant")]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(1149, "/datum/objective/revenant", "/datum/objective", {
	targetAmount: 100,
	dangerrating: 10,
});

// /datum/objective/revenant/proc/New  (code/game/gamemodes/miniantags/revenant/revenant.dm:426)
rt.def("/datum/objective/revenant/proc/New", function New(f: Frame) {
	rt.setSv(f, "targetAmount", rt.call(f, P("/proc/rand"), null, [350, 600]));
	rt.setSv(f, "explanation_text", fmt("Absorb ＀ points of essence from humans.", [rt.sv(f, "targetAmount")]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /datum/objective/revenant/proc/check_completion  (code/game/gamemodes/miniantags/revenant/revenant.dm:431)
rt.def("/datum/objective/revenant/proc/check_completion", function check_completion(f: Frame) {
	let R: Value = null, essence_stolen: Value = null;
	f.vars = () => [R, essence_stolen];
	if (!truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/simple_animal/revenant")) ? 1 : 0))) {
		return 0;
	}
	if ((!truthy((R = rt.fv(f, "current", rt.sv(f, "owner")))) || isEqual(rt.fv(f, "stat", live(R)), 2))) {
		return 0;
	}
	if (rt.lt((essence_stolen = rt.fv(f, "essence_accumulated", live(R))), rt.sv(f, "targetAmount"))) {
		return 0;
	}
	return 1;
});

rt.type(1150, "/datum/objective/revenantFluff", "/datum/objective", {
	dangerrating: 0,
});

// /datum/objective/revenantFluff/proc/New  (code/game/gamemodes/miniantags/revenant/revenant.dm:456)
rt.def("/datum/objective/revenantFluff/proc/New", function New(f: Frame) {
	let explanationTexts: Value = null;
	f.vars = () => [explanationTexts];
	rt.setSv(f, "explanation_text", rt.op(f, "PickUnweighted", [1], [(explanationTexts = rt.list("Assist and exacerbate existing threats at critical moments.", "Avoid killing in plain sight.", "Cause as much chaos and anger as you can without being killed.", "Damage and render as much of the station rusted and unusable as possible.", "Disable and cause malfunctions in as many machines as possible.", "Ensure that any holy weapons are rendered unusable.", "Hinder the crew while attempting to avoid being noticed.", "Make the crew as miserable as possible.", "Make the clown as miserable as possible.", "Make the captain as miserable as possible.", "Prevent the use of energy weapons where possible."))]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});
