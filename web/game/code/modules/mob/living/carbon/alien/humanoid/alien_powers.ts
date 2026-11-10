// Based on /tg/station's code/modules/mob/living/carbon/alien/humanoid/alien_powers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


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

// alien_powers.dm:21
rt.def("/obj/effect/proc_holder/alien/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.action = (yield* new_(T("/datum/action/spell_action/alien"), this));
	return f.dot;
}, true);

// alien_powers.dm:25
rt.def("/obj/effect/proc_holder/alien/proc/Click", function* Click(f: Frame) {
	if (!rt.istype(f.usr, T("/mob/living/carbon"))) {
		return 1;
	}
	let user: Value = f.usr;
	if (this.cost_check(this.check_turf, user)) {
		if ((yield* this.fire(user)) && user) {
			yield* user.adjustPlasma(-this.plasma_cost);
		}
	}
	return 1;
}, true);

// alien_powers.dm:43
rt.def("/obj/effect/proc_holder/alien/proc/cost_check", function cost_check(f: Frame, check_turf: Value, user: Value, silent: Value) {
	check_turf ??= 0;
	silent ??= 0;
	if (user.stat) {
		if (!silent) {
			to_chat(user, "<span class='noticealien'>You must be conscious to do this.</span>");
		}
		return 0;
	}
	if (user.getPlasma() < this.plasma_cost) {
		if (!silent) {
			to_chat(user, "<span class='noticealien'>Not enough plasma stored.</span>");
		}
		return 0;
	}
	if (check_turf && (!isturf(user.loc) || rt.istype(user.loc, T("/turf/open/space")))) {
		if (!silent) {
			to_chat(user, "<span class='noticealien'>Bad place for a garden!</span>");
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

// alien_powers.dm:65
rt.def("/obj/effect/proc_holder/alien/plant/proc/fire", function* fire(f: Frame, user: Value) {
	if (rt.locateIn(f, T("/obj/structure/alien/weeds/node"), rt.getStep(f, user, 0))) {
		to_chat(user, "There's already a weed node here.");
		return 0;
	}
	user.visible_message(`<span class='alertalien'>${user} has planted some alien weeds!</span>`);
	yield* new_(T("/obj/structure/alien/weeds/node"), user.loc);
	return 1;
}, true);

rt.type(11389, "/obj/effect/proc_holder/alien/whisper", "/obj/effect/proc_holder/alien", {
	plasma_cost: 10,
	action_icon_state: "alien_whisper",
	name: "Whisper",
	desc: "Whisper to someone",
});

// alien_powers.dm:79
rt.def("/obj/effect/proc_holder/alien/whisper/proc/fire", function* fire(f: Frame, user: Value) {
	let Ms: Value = null, M: Value = null, msg: Value = null, ded: Value = null, follow_link_user: Value = null, follow_link_whispee: Value = null;
	let options: Value = list();
	for (Ms of each(oview(user), T("/mob/living"))) {
		options += Ms;
	}
	if (!(M = (yield* g.op(f, "Prompt", [9], [null, null, "Whisper to?", "Select who to whisper to:", options])))) {
		return 0;
	}
	if (msg = sanitize((yield* g.op(f, "Prompt", [3], [null, null, "Alien Whisper", "Message:", null])))) {
		log_say(`AlienWhisper: ${key_name(user)}->${M.key} : ${msg}`);
		to_chat(M, `<span class='noticealien'>You hear a strange, alien voice in your head...</span>${msg}`);
		to_chat(user, `<span class='noticealien'>You said: "${msg}" to ${M}</span>`);
		for (ded of each(GLOB.dead_mob_list)) {
			if (!rt.istype(ded, T("/mob/dead/observer"))) {
				continue;
			}
			follow_link_user = fmt("<a href=?src=＃;follow=＃>(F)</a>", [ded, user]);
			follow_link_whispee = fmt("<a href=?src=＃;follow=＃>(F)</a>", [ded, M]);
			to_chat(ded, `${follow_link_user} <span class='name'>${user}</span> <span class='alertalien'>Alien Whisper --> </span> ${follow_link_whispee} <span class='name'>${M}</span> <span class='noticealien'>${msg}</span>`);
		}
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

// alien_powers.dm:107
rt.def("/obj/effect/proc_holder/alien/transfer/proc/fire", function* fire(f: Frame, user: Value) {
	let A: Value = null, M: Value = null, amount: Value = null;
	let aliens_around: Value = list();
	for (A of each(oview(user), T("/mob/living/carbon"))) {
		if (A.getorgan(T("/obj/item/organ/alien/plasmavessel"))) {
			aliens_around.Add(A);
		}
	}
	if (!(M = (yield* g.op(f, "Prompt", [8], [null, null, "Transfer plasma to?", "Select who to transfer to:", aliens_around])))) {
		return 0;
	}
	if (amount = (yield* g.op(f, "Prompt", [32], [null, null, `Transfer Plasma to ${M}`, "Amount:", null]))) {
		amount = min(rt.op(f, "Abs", [], [round(amount)]), user.getPlasma());
		if (get_dist(user, M) <= 1) {
			yield* M.adjustPlasma(amount);
			yield* user.adjustPlasma(-amount);
			to_chat(M, `<span class='noticealien'>${user} has transferred ${amount} plasma to you.</span>`);
			to_chat(user, `<span class='noticealien'>You transfer ${amount} plasma to ${M}</span>`);
		} else {
			to_chat(user, "<span class='noticealien'>You need to be closer!</span>");
		}
	}
	return f.dot;
}, true);

rt.type(11391, "/obj/effect/proc_holder/alien/acid", "/obj/effect/proc_holder/alien", {
	plasma_cost: 200,
	action_icon_state: "alien_acid",
	name: "Corrosive Acid",
	desc: "Drench an object in acid, destroying it over time.",
});

// alien_powers.dm:133
rt.def("/obj/effect/proc_holder/alien/acid/proc/on_gain", function on_gain(f: Frame, user: Value) {
	user.verbs.Add(P("/mob/living/carbon/proc/corrosive_acid"));
	return f.dot;
});

// alien_powers.dm:136
rt.def("/obj/effect/proc_holder/alien/acid/proc/on_lose", function on_lose(f: Frame, user: Value) {
	user.verbs.Remove(P("/mob/living/carbon/proc/corrosive_acid"));
	return f.dot;
});

// alien_powers.dm:139
rt.def("/obj/effect/proc_holder/alien/acid/proc/corrode", function* corrode(f: Frame, target: Value, user: Value) {
	user ??= f.usr;
	if (rt.isIn(f, target, oview(1, user))) {
		if (yield* target.acid_act(200, 100)) {
			user.visible_message(`<span class='alertalien'>${user} vomits globs of vile stuff all over ${target}. It begins to sizzle and melt under the bubbling mess of acid!</span>`);
			return 1;
		} else {
			to_chat(user, "<span class='noticealien'>You cannot dissolve this object.</span>");
			return 0;
		}
	} else {
		to_chat(this, "<span class='noticealien'>Target is too far away.</span>");
		return 0;
	}
}, true);

// alien_powers.dm:154
rt.def("/obj/effect/proc_holder/alien/acid/proc/fire", function* fire(f: Frame, user: Value) {
	let O: Value = null;
	if (!(O = (yield* g.op(f, "Prompt", [20], [null, null, "Dissolve", "Select what to dissolve:", oview(1, user)]))) || user.incapacitated()) {
		return 0;
	} else {
		return (yield* this.corrode(O, user));
	}
}, true);

// alien_powers.dm:163
rt.def("/mob/living/carbon/proc/corrosive_acid", function* corrosive_acid(f: Frame, O: Value) {
	let A: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/carbon"))) {
		return f.dot;
	}
	let user: Value = f.usr;
	if (!(A = rt.locateIn(f, T("/obj/effect/proc_holder/alien/acid"), user.abilities))) {
		return f.dot;
	}
	if (!(user.getPlasma() > A.plasma_cost && (yield* A.corrode(O)))) return f.dot;
	yield* user.adjustPlasma(-A.plasma_cost);
	return f.dot;
}, true, { verb: { name: "Corrossive Acid" }, argTypes: [{ type: 20, source: "oview:1" }] });

rt.type(11392, "/obj/effect/proc_holder/alien/neurotoxin", "/obj/effect/proc_holder/alien", {
	action_icon_state: "alien_neurotoxin_0",
	name: "Spit Neurotoxin",
	desc: "Spits neurotoxin at someone, paralyzing them for a short time.",
	active: 0,
});

// alien_powers.dm:181
rt.def("/obj/effect/proc_holder/alien/neurotoxin/proc/fire", function* fire(f: Frame, user: Value) {
	let message: Value = null;
	if (this.active) {
		message = "<span class='notice'>You empty your neurotoxin gland.</span>";
		yield* this.remove_ranged_ability(user, message);
	} else {
		message = "<span class='notice'>You prepare your neurotoxin gland. <B>Left-click to fire at a target!</B></span>";
		yield* this.add_ranged_ability(user, message, 1);
	}
	return f.dot;
}, true);

// alien_powers.dm:188
rt.def("/obj/effect/proc_holder/alien/neurotoxin/proc/update_icon", function* update_icon(f: Frame) {
	this.action.button_icon_state = `alien_neurotoxin_${this.active}`;
	yield* this.action.UpdateButtonIcon();
	return f.dot;
}, true);

// alien_powers.dm:192
rt.def("/obj/effect/proc_holder/alien/neurotoxin/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, target: Value) {
	let user: Value = null, U: Value = null, A: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let p_cost: Value = 50;
	if (!rt.istype(this.ranged_ability_user, T("/mob/living/carbon")) || this.ranged_ability_user.lying || this.ranged_ability_user.stat) {
		yield* this.remove_ranged_ability(this.ranged_ability_user);
		return f.dot;
	}
	if ((user = this.ranged_ability_user).getPlasma() < p_cost) {
		to_chat(user, `<span class='warning'>You need at least ${p_cost} plasma to spit.</span>`);
		yield* this.remove_ranged_ability();
		return f.dot;
	}
	let _T: Value = user.loc;
	if (!isturf((U = rt.getStep(f, user, user.dir))) || !isturf(_T)) {
		return 0;
	}
	user.visible_message(`<span class='danger'>${user} spits neurotoxin!`, "<span class='alertalien'>You spit neurotoxin.</span>");
	(A = (yield* new_(T("/obj/item/projectile/bullet/neurotoxin"), user.loc))).current = U;
	yield* A.preparePixelProjectile(target, rt.getStep(f, target, 0), user, params);
	yield* A.fire();
	yield* user.newtonian_move(rt.getDir(f, U, _T));
	yield* user.adjustPlasma(-p_cost);
	return 1;
}, true);

// alien_powers.dm:222
rt.def("/obj/effect/proc_holder/alien/neurotoxin/proc/on_lose", function on_lose(f: Frame, user: Value) {
	if (user.ranged_ability != this) return f.dot;
	user.ranged_ability = null;
	return f.dot;
});

// alien_powers.dm:226
rt.def("/obj/effect/proc_holder/alien/neurotoxin/proc/add_ranged_ability", function* add_ranged_ability(f: Frame, user: Value, msg: Value) {
	let A: Value = null;
	yield* parent_proc();
	if (!rt.istype(user, T("/mob/living/carbon/alien/humanoid"))) return f.dot;
	(A = user).drooling = 1;
	yield* A.update_icons();
	return f.dot;
}, true);

// alien_powers.dm:233
rt.def("/obj/effect/proc_holder/alien/neurotoxin/proc/remove_ranged_ability", function* remove_ranged_ability(f: Frame, user: Value, msg: Value) {
	let A: Value = null;
	yield* parent_proc();
	if (!rt.istype(user, T("/mob/living/carbon/alien/humanoid"))) return f.dot;
	(A = user).drooling = 0;
	yield* A.update_icons();
	return f.dot;
}, true);

rt.type(11393, "/obj/effect/proc_holder/alien/resin", "/obj/effect/proc_holder/alien", {
	structures: null,
	plasma_cost: 55,
	check_turf: 1,
	action_icon_state: "alien_resin",
	name: "Secrete Resin",
	desc: "Secrete tough malleable resin.",
});

// alien_powers.dm:244
rt.def("/obj/effect/proc_holder/alien/resin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.structures = rt.alist(f, ["resin wall", T("/obj/structure/alien/resin/wall"), "resin membrane", T("/obj/structure/alien/resin/membrane"), "resin nest", T("/obj/structure/bed/nest")]);
	return f.dot;
});

// alien_powers.dm:252
rt.def("/obj/effect/proc_holder/alien/resin/proc/fire", function* fire(f: Frame, user: Value) {
	let choice: Value = null;
	if (rt.locateIn(f, T("/obj/structure/alien/resin"), user.loc)) {
		to_chat(user, "<span class='danger'>There is already a resin structure there.</span>");
		return 0;
	}
	if (!(choice = (yield* g.op(f, "Prompt", [1], [null, null, "Resin building", "Choose what you wish to shape.", this.structures])))) {
		return 0;
	}
	if (!this.cost_check(this.check_turf, user)) {
		return 0;
	}
	to_chat(user, `<span class='notice'>You shape a ${choice}.</span>`);
	user.visible_message(`<span class='notice'>${user} vomits up a thick purple substance and begins to shape it.</span>`);
	choice = rt.index(this.structures, choice);
	yield* new_(choice, user.loc);
	return 1;
}, true);

rt.type(11394, "/obj/effect/proc_holder/alien/regurgitate", "/obj/effect/proc_holder/alien", {
	plasma_cost: 0,
	action_icon_state: "alien_barf",
	name: "Regurgitate",
	desc: "Empties the contents of your stomach",
});

// alien_powers.dm:274
rt.def("/obj/effect/proc_holder/alien/regurgitate/proc/fire", function* fire(f: Frame, user: Value) {
	let A: Value = null, M: Value = null;
	if (rt.len(f, user.stomach_contents)) {
		for (A of each(user.stomach_contents, T("/atom/movable"))) {
			yield* user.stomach_contents.Remove(A);
			A.loc = user.loc;
			if (rt.istype(A, T("/mob/living"))) {
				yield* (M = A).reset_perspective();
			}
		}
		user.visible_message(`<span class='alertealien'>${user} hurls out the contents of their stomach!</span>`);
	}
	return f.dot;
}, true);

rt.type(11395, "/obj/effect/proc_holder/alien/sneak", "/obj/effect/proc_holder/alien", {
	action_icon_state: "alien_sneak",
	name: "Sneak",
	desc: "Blend into the shadows to stalk your prey.",
	active: 0,
});

// alien_powers.dm:292
rt.def("/obj/effect/proc_holder/alien/sneak/proc/fire", function fire(f: Frame, user: Value) {
	if (!this.active) {
		user.alpha = 75;
		user.sneaking = 1;
		this.active = 1;
		to_chat(user, "<span class='noticealien'>You blend into the shadows...</span>");
	} else {
		user.alpha = rt.initial(f, user, "alpha");
		user.sneaking = 0;
		this.active = 0;
		to_chat(user, "<span class='noticealien'>You reveal yourself!</span>");
	}
	return f.dot;
});

// alien_powers.dm:305
rt.def("/mob/living/carbon/proc/getPlasma", function getPlasma(f: Frame) {
	let vessel: Value = null;
	if (!(vessel = this.getorgan(T("/obj/item/organ/alien/plasmavessel")))) {
		return 0;
	}
	return vessel.storedPlasma;
});

// alien_powers.dm:311
rt.def("/mob/living/carbon/proc/adjustPlasma", function* adjustPlasma(f: Frame, amount: Value) {
	let vessel: Value = null, X: Value = null, APH: Value = null;
	if (!(vessel = this.getorgan(T("/obj/item/organ/alien/plasmavessel")))) {
		return 0;
	}
	vessel.storedPlasma = max(vessel.storedPlasma + amount, 0);
	vessel.storedPlasma = min(vessel.storedPlasma, vessel.max_plasma);
	for (X of each(this.abilities)) {
		if ((APH = X).has_action) {
			yield* APH.action.UpdateButtonIcon();
		}
	}
	return 1;
}, true);

// alien_powers.dm:322
rt.def("/mob/living/carbon/alien/proc/adjustPlasma", function* adjustPlasma(f: Frame, amount: Value) {
	f.dot = (yield* parent_proc());
	this.updatePlasmaDisplay();
	return f.dot;
}, true);

// alien_powers.dm:326
rt.def("/mob/living/carbon/proc/usePlasma", function* usePlasma(f: Frame, amount: Value) {
	if (this.getPlasma() >= amount) {
		yield* this.adjustPlasma(-amount);
		return 1;
	}
	return 0;
}, true);

// alien_powers.dm:334
rt.def("/proc/cmp_abilities_cost", function cmp_abilities_cost(f: Frame, a: Value, b: Value) {
	return b.plasma_cost - a.plasma_cost;
}, false, { argTypes: [{ type: 4, path: "/obj/effect/proc_holder/alien" }, { type: 4, path: "/obj/effect/proc_holder/alien" }] });
