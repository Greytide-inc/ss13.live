// From code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11387, "/obj/effect/proc_holder/alien", "/obj/effect/proc_holder", {
	plasma_cost: 0,
	check_turf: 0,
	has_action: 1,
	action: null,
	action_icon: rt.rsc("icons/mob/actions.dmi"),
	action_icon_state: "spell_default",
	action_background_icon_state: "bg_alien",
	name: "Alien Power",
	panel: "Alien",
});

// /obj/effect/proc_holder/alien/proc/New  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:21)  may sleep
rt.def("/obj/effect/proc_holder/alien/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "action", (yield* g.new_(f, T("/datum/action/spell_action/alien"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/effect/proc_holder/alien/proc/Click  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:25)  may sleep
rt.def("/obj/effect/proc_holder/alien/proc/Click", function* Click(f: Frame) {
	let user: Value = null;
	f.vars = () => [user];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon")) ? 1 : 0))) {
		return 1;
	}
	user = live(f.usr);
	if (truthy((yield* g.srcCall(f, "cost_check", rt.sv(f, "check_turf"), live(user))))) {
		if ((truthy((yield* g.srcCall(f, "fire", live(user)))) && truthy(live(user)))) {
			yield* g.callName(f, live(user), "adjustPlasma", [rt.neg(rt.sv(f, "plasma_cost"))]);
		}
	}
	return 1;
}, true);

// /obj/effect/proc_holder/alien/proc/cost_check  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:43)
rt.def("/obj/effect/proc_holder/alien/proc/cost_check", function cost_check(f: Frame, check_turf: Value, user: Value, silent: Value) {
	f.vars = () => [check_turf, silent];
	if (live(check_turf) === null) {
		check_turf = 0;
	}
	if (live(silent) === null) {
		silent = 0;
	}
	if (truthy(rt.fv(f, "stat", live(user)))) {
		if (!truthy(live(silent))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='noticealien'>You must be conscious to do this.</span>"]);
		}
		return 0;
	}
	if (rt.lt(rt.callName(f, live(user), "getPlasma", []), rt.sv(f, "plasma_cost"))) {
		if (!truthy(live(silent))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='noticealien'>Not enough plasma stored.</span>"]);
		}
		return 0;
	}
	if ((truthy(live(check_turf)) && (!truthy(rt.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))])) || truthy((rt.istype(rt.fv(f, "loc", live(user)), T("/turf/open/space")) ? 1 : 0))))) {
		if (!truthy(live(silent))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='noticealien'>Bad place for a garden!</span>"]);
		}
		return 0;
	}
	return 1;
});

rt.type(11388, "/obj/effect/proc_holder/alien/plant", "/obj/effect/proc_holder/alien", {
	plasma_cost: 50,
	check_turf: 1,
	action_icon_state: "alien_plant",
	name: "Plant Weeds",
	desc: "Plants some alien weeds",
});

// /obj/effect/proc_holder/alien/plant/proc/fire  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:65)  may sleep
rt.def("/obj/effect/proc_holder/alien/plant/proc/fire", function* fire(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.locateIn(f, T("/obj/structure/alien/weeds/node"), rt.getStep(f, live(user), 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "There's already a weed node here."]);
		return 0;
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='alertalien'>＀ has planted some alien weeds!</span>", [live(user)])]);
	yield* g.new_(f, T("/obj/structure/alien/weeds/node"), [rt.fv(f, "loc", live(user))]);
	return 1;
}, true);

rt.type(11389, "/obj/effect/proc_holder/alien/whisper", "/obj/effect/proc_holder/alien", {
	plasma_cost: 10,
	action_icon_state: "alien_whisper",
	name: "Whisper",
	desc: "Whisper to someone",
});

// /obj/effect/proc_holder/alien/whisper/proc/fire  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:79)  may sleep
rt.def("/obj/effect/proc_holder/alien/whisper/proc/fire", function* fire(f: Frame, user: Value) {
	let options: Value = null, Ms: Value = null, M: Value = null, msg: Value = null, ded: Value = null, follow_link_user: Value = null, follow_link_whispee: Value = null;
	let $e: any;
	f.vars = () => [user, options, Ms, M, msg, ded, follow_link_user, follow_link_whispee, $e];
	options = rt.list();
	Ms = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [live(user)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Ms = $e;
		options = rt.modify(live(options), live(Ms), add);
	}
	rt.endFor(f, 0);
	if (!truthy((M = (yield* g.op(f, "Prompt", [9], [null, null, "Whisper to?", "Select who to whisper to:", live(options)]))))) {
		return 0;
	}
	if (truthy((msg = (yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], [null, null, "Alien Whisper", "Message:", null]))]))))) {
		yield* g.call(f, P("/proc/log_say"), null, [fmt("AlienWhisper: ＀->＀ : ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.fv(f, "key", live(M)), live(msg)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='noticealien'>You hear a strange, alien voice in your head...</span>＀", [live(msg)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='noticealien'>You said: \"＀\" to ＀</span>", [live(msg), live(M)])]);
		ded = null;
		rt.forList(f, 0, rt.gl("dead_mob_list"));
		while (($e = rt.next(f, 0)) !== undefined) {
			ded = $e;
			if (!truthy((rt.istype(live(ded), T("/mob/dead/observer")) ? 1 : 0))) {
				continue;
			}
			follow_link_user = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(ded), live(user)]);
			follow_link_whispee = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(ded), live(M)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(ded), fmt("＀ <span class='name'>＀</span> <span class='alertalien'>Alien Whisper --> </span> ＀ <span class='name'>＀</span> <span class='noticealien'>＀</span>", [live(follow_link_user), live(user), live(follow_link_whispee), live(M), live(msg)])]);
		}
		rt.endFor(f, 0);
	} else {
		return 0;
	}
	return 1;
}, true);

rt.type(11390, "/obj/effect/proc_holder/alien/transfer", "/obj/effect/proc_holder/alien", {
	plasma_cost: 0,
	action_icon_state: "alien_transfer",
	name: "Transfer Plasma",
	desc: "Transfer Plasma to another alien",
});

// /obj/effect/proc_holder/alien/transfer/proc/fire  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:107)  may sleep
rt.def("/obj/effect/proc_holder/alien/transfer/proc/fire", function* fire(f: Frame, user: Value) {
	let aliens_around: Value = null, A: Value = null, M: Value = null, amount: Value = null;
	let $e: any;
	f.vars = () => [user, aliens_around, A, M, amount, $e];
	aliens_around = rt.list();
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [live(user)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((yield* g.callName(f, live(A), "getorgan", [T("/obj/item/organ/alien/plasmavessel")])))) {
			yield* g.callName(f, live(aliens_around), "Add", [live(A)]);
		}
	}
	rt.endFor(f, 0);
	if (!truthy((M = (yield* g.op(f, "Prompt", [8], [null, null, "Transfer plasma to?", "Select who to transfer to:", live(aliens_around)]))))) {
		return 0;
	}
	if (truthy((amount = (yield* g.op(f, "Prompt", [32], [null, null, fmt("Transfer Plasma to ＀", [live(M)]), "Amount:", null]))))) {
		amount = (yield* g.call(f, P("/proc/min"), null, [rt.op(f, "Abs", [], [(yield* g.call(f, P("/proc/round"), null, [live(amount)]))]), (yield* g.callName(f, live(user), "getPlasma", []))]));
		if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(M)])), 1)) {
			yield* g.callName(f, live(M), "adjustPlasma", [live(amount)]);
			yield* g.callName(f, live(user), "adjustPlasma", [rt.neg(live(amount))]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='noticealien'>＀ has transferred ＀ plasma to you.</span>", [live(user), live(amount)])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='noticealien'>You transfer ＀ plasma to ＀</span>", [live(amount), live(M)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='noticealien'>You need to be closer!</span>"]);
		}
	}
	return live(f.dot);
}, true);

rt.type(11391, "/obj/effect/proc_holder/alien/acid", "/obj/effect/proc_holder/alien", {
	plasma_cost: 200,
	action_icon_state: "alien_acid",
	name: "Corrosive Acid",
	desc: "Drench an object in acid, destroying it over time.",
});

// /obj/effect/proc_holder/alien/acid/proc/on_gain  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:133)
rt.def("/obj/effect/proc_holder/alien/acid/proc/on_gain", function on_gain(f: Frame, user: Value) {
	rt.callName(f, rt.fv(f, "verbs", live(user)), "Add", [P("/mob/living/carbon/proc/corrosive_acid")]);
	return f.dot;
});

// /obj/effect/proc_holder/alien/acid/proc/on_lose  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:136)
rt.def("/obj/effect/proc_holder/alien/acid/proc/on_lose", function on_lose(f: Frame, user: Value) {
	rt.callName(f, rt.fv(f, "verbs", live(user)), "Remove", [P("/mob/living/carbon/proc/corrosive_acid")]);
	return f.dot;
});

// /obj/effect/proc_holder/alien/acid/proc/corrode  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:139)  may sleep
rt.def("/obj/effect/proc_holder/alien/acid/proc/corrode", function* corrode(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (truthy((rt.isIn(f, live(target), (yield* g.call(f, P("/proc/oview"), null, [1, live(user)]))) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, live(target), "acid_act", [200, 100])))) {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='alertalien'>＀ vomits globs of vile stuff all over ＀. It begins to sizzle and melt under the bubbling mess of acid!</span>", [live(user), live(target)])]);
			return 1;
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='noticealien'>You cannot dissolve this object.</span>"]);
			return 0;
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='noticealien'>Target is too far away.</span>"]);
		return 0;
	}
	return f.dot;
}, true);

// /obj/effect/proc_holder/alien/acid/proc/fire  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:154)  may sleep
rt.def("/obj/effect/proc_holder/alien/acid/proc/fire", function* fire(f: Frame, user: Value) {
	let O: Value = null;
	f.vars = () => [user, O];
	if ((!truthy((O = (yield* g.op(f, "Prompt", [20], [null, null, "Dissolve", "Select what to dissolve:", (yield* g.call(f, P("/proc/oview"), null, [1, live(user)]))])))) || truthy((yield* g.callName(f, live(user), "incapacitated", []))))) {
		return 0;
	} else {
		return (yield* g.srcCall(f, "corrode", live(O), live(user)));
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/corrosive_acid  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:163)  may sleep
rt.def("/mob/living/carbon/proc/corrosive_acid", function* corrosive_acid(f: Frame, O: Value) {
	let user: Value = null, A: Value = null;
	f.vars = () => [O, user, A];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	user = live(f.usr);
	if (!truthy((A = rt.locateIn(f, T("/obj/effect/proc_holder/alien/acid"), rt.fv(f, "abilities", live(user)))))) {
		return live(f.dot);
	}
	if (!(rt.gt((yield* g.callName(f, live(user), "getPlasma", [])), rt.fv(f, "plasma_cost", live(A))) && truthy((yield* g.callName(f, live(A), "corrode", [live(O)]))))) return f.dot;
	yield* g.callName(f, live(user), "adjustPlasma", [rt.neg(rt.fv(f, "plasma_cost", live(A)))]);
	return f.dot;
}, true, { verb: { name: "Corrossive Acid" }, argTypes: [{ type: 20, source: "oview:1" }] });

rt.type(11392, "/obj/effect/proc_holder/alien/neurotoxin", "/obj/effect/proc_holder/alien", {
	action_icon_state: "alien_neurotoxin_0",
	name: "Spit Neurotoxin",
	desc: "Spits neurotoxin at someone, paralyzing them for a short time.",
	active: 0,
});

// /obj/effect/proc_holder/alien/neurotoxin/proc/fire  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:181)  may sleep
rt.def("/obj/effect/proc_holder/alien/neurotoxin/proc/fire", function* fire(f: Frame, user: Value) {
	let message: Value = null;
	f.vars = () => [user, message];
	message = null;
	if (truthy(rt.sv(f, "active"))) {
		message = "<span class='notice'>You empty your neurotoxin gland.</span>";
		yield* g.srcCall(f, "remove_ranged_ability", live(user), live(message));
	} else {
		message = "<span class='notice'>You prepare your neurotoxin gland. <B>Left-click to fire at a target!</B></span>";
		yield* g.srcCall(f, "add_ranged_ability", live(user), live(message), 1);
	}
	return f.dot;
}, true);

// /obj/effect/proc_holder/alien/neurotoxin/proc/update_icon  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:188)  may sleep
rt.def("/obj/effect/proc_holder/alien/neurotoxin/proc/update_icon", function* update_icon(f: Frame) {
	rt.setFv(f, "button_icon_state", rt.sv(f, "action"), fmt("alien_neurotoxin_＀", [rt.sv(f, "active")]));
	yield* g.callName(f, rt.sv(f, "action"), "UpdateButtonIcon", []);
	return f.dot;
}, true);

// /obj/effect/proc_holder/alien/neurotoxin/proc/InterceptClickOn  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:192)  may sleep
rt.def("/obj/effect/proc_holder/alien/neurotoxin/proc/InterceptClickOn", function* InterceptClickOn(f: Frame) {
	let p_cost: Value = null, user: Value = null, _T: Value = null, U: Value = null, A: Value = null;
	f.vars = () => [p_cost, user, _T, U, A];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	p_cost = 50;
	if (((!truthy((rt.istype(rt.sv(f, "ranged_ability_user"), T("/mob/living/carbon")) ? 1 : 0)) || truthy(rt.fv(f, "lying", rt.sv(f, "ranged_ability_user")))) || truthy(rt.fv(f, "stat", rt.sv(f, "ranged_ability_user"))))) {
		yield* g.srcCall(f, "remove_ranged_ability", rt.sv(f, "ranged_ability_user"));
		return live(f.dot);
	}
	if (rt.lt((yield* g.callName(f, (user = rt.sv(f, "ranged_ability_user")), "getPlasma", [])), live(p_cost))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You need at least ＀ plasma to spit.</span>", [live(p_cost)])]);
		yield* g.srcCall(f, "remove_ranged_ability");
		return live(f.dot);
	}
	_T = rt.fv(f, "loc", live(user));
	if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [(U = rt.getStep(f, live(user), rt.fv(f, "dir", live(user))))]))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)]))))) {
		return 0;
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ spits neurotoxin!", [live(user)]), "<span class='alertalien'>You spit neurotoxin.</span>"]);
	rt.setFv(f, "current", (A = (yield* g.new_(f, T("/obj/item/projectile/bullet/neurotoxin"), [rt.fv(f, "loc", live(user))]))), live(U));
	yield* g.callName(f, live(A), "preparePixelProjectile", [live(f.args[2]), rt.getStep(f, live(f.args[2]), 0), live(user), live(f.args[1])]);
	yield* g.callName(f, live(A), "fire", []);
	yield* g.callName(f, live(user), "newtonian_move", [rt.getDir(f, live(U), live(_T))]);
	yield* g.callName(f, live(user), "adjustPlasma", [rt.neg(live(p_cost))]);
	return 1;
}, true, { args: ["caller", "params", "target"] });

// /obj/effect/proc_holder/alien/neurotoxin/proc/on_lose  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:222)
rt.def("/obj/effect/proc_holder/alien/neurotoxin/proc/on_lose", function on_lose(f: Frame, user: Value) {
	if (!isEqual(rt.fv(f, "ranged_ability", live(user)), live(f.src))) return f.dot;
	rt.setFv(f, "ranged_ability", live(user), null);
	return f.dot;
});

// /obj/effect/proc_holder/alien/neurotoxin/proc/add_ranged_ability  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:226)  may sleep
rt.def("/obj/effect/proc_holder/alien/neurotoxin/proc/add_ranged_ability", function* add_ranged_ability(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "drooling", (A = live(f.args[0])), 1);
	yield* g.callName(f, live(A), "update_icons", []);
	return f.dot;
}, true, { args: ["user", "msg"] });

// /obj/effect/proc_holder/alien/neurotoxin/proc/remove_ranged_ability  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:233)  may sleep
rt.def("/obj/effect/proc_holder/alien/neurotoxin/proc/remove_ranged_ability", function* remove_ranged_ability(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "drooling", (A = live(f.args[0])), 0);
	yield* g.callName(f, live(A), "update_icons", []);
	return f.dot;
}, true, { args: ["user", "msg"] });

rt.type(11393, "/obj/effect/proc_holder/alien/resin", "/obj/effect/proc_holder/alien", {
	structures: null,
	plasma_cost: 55,
	check_turf: 1,
	action_icon_state: "alien_resin",
	name: "Secrete Resin",
	desc: "Secrete tough malleable resin.",
});

// /obj/effect/proc_holder/alien/resin/proc/<init>  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:244)
rt.def("/obj/effect/proc_holder/alien/resin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "structures", rt.alist(f, ["resin wall", T("/obj/structure/alien/resin/wall"), "resin membrane", T("/obj/structure/alien/resin/membrane"), "resin nest", T("/obj/structure/bed/nest")]));
	return f.dot;
});

// /obj/effect/proc_holder/alien/resin/proc/fire  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:252)  may sleep
rt.def("/obj/effect/proc_holder/alien/resin/proc/fire", function* fire(f: Frame, user: Value) {
	let choice: Value = null;
	f.vars = () => [user, choice];
	if (truthy(rt.locateIn(f, T("/obj/structure/alien/resin"), rt.fv(f, "loc", live(user))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>There is already a resin structure there.</span>"]);
		return 0;
	}
	if (!truthy((choice = (yield* g.op(f, "Prompt", [1], [null, null, "Resin building", "Choose what you wish to shape.", rt.sv(f, "structures")]))))) {
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "cost_check", rt.sv(f, "check_turf"), live(user))))) {
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You shape a ＀.</span>", [live(choice)])]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ vomits up a thick purple substance and begins to shape it.</span>", [live(user)])]);
	choice = rt.index(rt.sv(f, "structures"), live(choice));
	yield* g.new_(f, live(choice), [rt.fv(f, "loc", live(user))]);
	return 1;
}, true);

rt.type(11394, "/obj/effect/proc_holder/alien/regurgitate", "/obj/effect/proc_holder/alien", {
	plasma_cost: 0,
	action_icon_state: "alien_barf",
	name: "Regurgitate",
	desc: "Empties the contents of your stomach",
});

// /obj/effect/proc_holder/alien/regurgitate/proc/fire  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:274)  may sleep
rt.def("/obj/effect/proc_holder/alien/regurgitate/proc/fire", function* fire(f: Frame, user: Value) {
	let A: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [user, A, M, $e];
	if (truthy(rt.getLen(f, rt.fv(f, "stomach_contents", live(user))))) {
		A = null;
		rt.forList(f, 0, rt.fv(f, "stomach_contents", live(user)), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			yield* g.callName(f, rt.fv(f, "stomach_contents", live(user)), "Remove", [live(A)]);
			rt.setFv(f, "loc", live(A), rt.fv(f, "loc", live(user)));
			if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
				yield* g.callName(f, (M = live(A)), "reset_perspective", []);
			}
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='alertealien'>＀ hurls out the contents of their stomach!</span>", [live(user)])]);
	}
	return live(f.dot);
}, true);

rt.type(11395, "/obj/effect/proc_holder/alien/sneak", "/obj/effect/proc_holder/alien", {
	action_icon_state: "alien_sneak",
	name: "Sneak",
	desc: "Blend into the shadows to stalk your prey.",
	active: 0,
});

// /obj/effect/proc_holder/alien/sneak/proc/fire  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:292)
rt.def("/obj/effect/proc_holder/alien/sneak/proc/fire", function fire(f: Frame, user: Value) {
	if (!truthy(rt.sv(f, "active"))) {
		rt.setFv(f, "alpha", live(user), 75);
		rt.setFv(f, "sneaking", live(user), 1);
		rt.setSv(f, "active", 1);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='noticealien'>You blend into the shadows...</span>"]);
	} else {
		rt.setFv(f, "alpha", live(user), rt.initial(f, live(user), "alpha"));
		rt.setFv(f, "sneaking", live(user), 0);
		rt.setSv(f, "active", 0);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='noticealien'>You reveal yourself!</span>"]);
	}
	return f.dot;
});

// /mob/living/carbon/proc/getPlasma  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:305)
rt.def("/mob/living/carbon/proc/getPlasma", function getPlasma(f: Frame) {
	let vessel: Value = null;
	f.vars = () => [vessel];
	if (!truthy((vessel = rt.callSrc(f, "getorgan", [T("/obj/item/organ/alien/plasmavessel")])))) {
		return 0;
	}
	return rt.fv(f, "storedPlasma", live(vessel));
});

// /mob/living/carbon/proc/adjustPlasma  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:311)  may sleep
rt.def("/mob/living/carbon/proc/adjustPlasma", function* adjustPlasma(f: Frame, amount: Value) {
	let vessel: Value = null, X: Value = null, APH: Value = null;
	let $e: any;
	f.vars = () => [amount, vessel, X, APH, $e];
	if (!truthy((vessel = (yield* g.srcCall(f, "getorgan", T("/obj/item/organ/alien/plasmavessel")))))) {
		return 0;
	}
	rt.setFv(f, "storedPlasma", live(vessel), (yield* g.call(f, P("/proc/max"), null, [add(rt.fv(f, "storedPlasma", live(vessel)), live(amount)), 0])));
	rt.setFv(f, "storedPlasma", live(vessel), (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "storedPlasma", live(vessel)), rt.fv(f, "max_plasma", live(vessel))])));
	X = null;
	rt.forList(f, 0, rt.sv(f, "abilities"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy(rt.gv(f, "has_action", (APH = live(X))))) {
			yield* g.callName(f, rt.fv(f, "action", live(APH)), "UpdateButtonIcon", []);
		}
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /mob/living/carbon/alien/proc/adjustPlasma  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:322)  may sleep
rt.def("/mob/living/carbon/alien/proc/adjustPlasma", function* adjustPlasma(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "updatePlasmaDisplay");
	return f.dot;
}, true, { args: ["amount"] });

// /mob/living/carbon/proc/usePlasma  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:326)  may sleep
rt.def("/mob/living/carbon/proc/usePlasma", function* usePlasma(f: Frame, amount: Value) {
	f.vars = () => [amount];
	if (rt.ge((yield* g.srcCall(f, "getPlasma")), live(amount))) {
		yield* g.srcCall(f, "adjustPlasma", rt.neg(live(amount)));
		return 1;
	}
	return 0;
}, true);

// /proc/cmp_abilities_cost  (code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm:334)
rt.def("/proc/cmp_abilities_cost", function cmp_abilities_cost(f: Frame, a: Value, b: Value) {
	return subtract(rt.fv(f, "plasma_cost", live(b)), rt.fv(f, "plasma_cost", live(a)));
}, false, { argTypes: [{ type: 4, path: "/obj/effect/proc_holder/alien" }, { type: 4, path: "/obj/effect/proc_holder/alien" }] });
