// Based on /tg/station's code/game/gamemodes/devil/true_devil/_true_devil.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(4831, "/mob/living/carbon/true_devil", "/mob/living/carbon", {
	ascended: 0,
	oldform: null,
	devil_overlays: null,
	pass_flags: 0,
	name: "True Devil",
	desc: "A pile of infernal energy, taking a vaguely humanoid form.",
	icon: rt.rsc("icons/mob/32x64.dmi"),
	icon_state: "true_devil",
	gender: "neuter",
	health: 350,
	maxHealth: 350,
	ventcrawler: 0,
	density: 1,
	sight: 24,
	status_flags: 8,
	mob_size: 3,
	bodyparts: null,
});

// _true_devil.dm:22
rt.def("/mob/living/carbon/true_devil/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.devil_overlays = rt.op(f, "CreateMultidimensionalList", [1], [2]);

	this.bodyparts = list(T("/obj/item/bodypart/chest/devil"), T("/obj/item/bodypart/head/devil"), T("/obj/item/bodypart/l_arm/devil"), T("/obj/item/bodypart/r_arm/devil"), T("/obj/item/bodypart/r_leg/devil"), T("/obj/item/bodypart/l_leg/devil"));
	return f.dot;
});

// _true_devil.dm:27
rt.def("/mob/living/carbon/true_devil/proc/Initialize", function* Initialize(f: Frame) {
	yield* this.create_bodyparts();
	yield* this.create_internal_organs();
	yield* this.grant_all_languages({ omnitongue: 1 });
	yield* parent_proc();
	return f.dot;
}, true);

// _true_devil.dm:33
rt.def("/mob/living/carbon/true_devil/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	this.internal_organs += (yield* new_(T("/obj/item/organ/brain")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/tongue")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/eyes")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/ears/invincible")));
	yield* parent_proc();
	return f.dot;
}, true);

// _true_devil.dm:42
rt.def("/mob/living/carbon/true_devil/proc/convert_to_archdevil", function convert_to_archdevil(f: Frame) {
	this.maxHealth = 500;
	this.ascended = 1;
	this.health = this.maxHealth;
	this.icon_state = "arch_devil";
	return f.dot;
});

// _true_devil.dm:46
rt.def("/mob/living/carbon/true_devil/proc/set_name", function set_name(f: Frame) {
	let devilinfo: Value = null;
	this.name = (devilinfo = this.mind.has_antag_datum(T("/datum/antagonist/devil"))).truename;
	this.real_name = this.name;
	return f.dot;
});

// _true_devil.dm:51
rt.def("/mob/living/carbon/true_devil/proc/Login", function* Login(f: Frame) {
	let devilinfo: Value = null;
	yield* parent_proc();
	(devilinfo = this.mind.has_antag_datum(T("/datum/antagonist/devil"))).greet();
	this.mind.announce_objectives();
	return f.dot;
}, true);

// _true_devil.dm:58
rt.def("/mob/living/carbon/true_devil/proc/death", function* death(f: Frame, gibbed: Value) {
	this.stat = 2;
	yield* parent_proc(gibbed);
	yield* this.drop_all_held_items();
	yield* ImmediateInvokeAsync(this.mind.has_antag_datum(T("/datum/antagonist/devil")), P("/datum/antagonist/devil/proc/beginResurrectionCheck"), this);
	return f.dot;
}, true);

// _true_devil.dm:64
rt.def("/mob/living/carbon/true_devil/proc/examine", function examine(f: Frame, user: Value) {
	let I: Value = null;
	let $0: any, $1: any, $e: any;
	let msg: Value = `<span class='info'>*---------*\nThis is ${bicon(this)} <b>${this}</b>!\n`;
	for (I of each(this.held_items, T("/obj/item"))) {
		if (!rt.bitAnd(I.flags, ABSTRACT)) {
			if (I.blood_DNA) {
				$0 = bicon(I);
				if (I.gender == "plural") {
					$1 = "some";
				} else {
					$1 = "a";
				}
				msg += `<span class='warning'>It is holding ${$0} ${$1} blood-stained ${I.name} in its ${this.get_held_index_name(this.get_held_index_of_item(I))}!</span>\n`;
			} else {
				msg += fmt("It is holding ＀ ＇！ in its ＀.\n", [bicon(I), I, this.get_held_index_name(this.get_held_index_of_item(I))]);
			}
		}
	}
	if (!this.client && this.stat != 2) {
		msg += "The devil seems to be in deep contemplation.\n";
	}
	if (this.stat == 2) {
		msg += "<span class='deadsay'>The hellfire seems to have been extinguished, for now at least.</span>\n";
	} else if (this.health < this.maxHealth / 10) {
		msg += "<span class='warning'>You can see hellfire inside its gaping wounds.</span>\n";
	} else if (this.health < this.maxHealth / 2) {
		msg += "<span class='warning'>You can see hellfire inside its wounds.</span>\n";
	}
	msg += "*---------*</span>";
	to_chat(user, msg);
	return f.dot;
});

// _true_devil.dm:93
rt.def("/mob/living/carbon/true_devil/proc/resist_buckle", function* resist_buckle(f: Frame) {
	if (!this.buckled) return f.dot;
	yield* this.buckled.user_unbuckle_mob(this, this);
	this.visible_message(`<span class='warning'>${this} easily breaks out of their handcuffs!</span>`, "<span class='notice'>With just a thought your handcuffs fall off.</span>");
	return f.dot;
}, true);

// _true_devil.dm:98
rt.def("/mob/living/carbon/true_devil/proc/canUseTopic", function canUseTopic(f: Frame, M: Value, be_close: Value) {
	be_close ??= 0;
	if (this.incapacitated()) {
		return 0;
	}
	if (be_close && !(get_dist(M, this) <= 1)) {
		return 0;
	}
	return 1;
});

// _true_devil.dm:108
rt.def("/mob/living/carbon/true_devil/proc/flash_act", function* flash_act(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!(this.mind && this.has_bane("light"))) return f.dot;
	yield* this.mind.disrupt_spells(-500);
	return (yield* parent_proc());
}, true, { args: ["intensity", "override_blindness_check", "affect_silicon"] });

// _true_devil.dm:120
rt.def("/mob/living/carbon/true_devil/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value, def_zone: Value) {
	let weakness: Value = (yield* this.check_weakness(I, user));
	yield* this.apply_damage(I.force * weakness, I.damtype, def_zone);
	let message_verb: Value = "";
	if (I.attack_verb && rt.len(f, I.attack_verb)) {
		message_verb = `${pick(I.attack_verb)}`;
	} else if (I.force) {
		message_verb = "attacked";
	}
	let attack_message: Value = `${this} has been ${message_verb} with ${I}.`;
	if (user) {
		yield* user.do_attack_animation(this);
		if (rt.isIn(f, user, viewers(this, null))) {
			attack_message = `${user} has ${message_verb} ${this} with ${I}!`;
		}
	}
	if (message_verb) {
		this.visible_message(`<span class='danger'>${attack_message}</span>`, `<span class='userdanger'>${attack_message}</span>`, null, 3);
	}
	return 1;
}, true);

// _true_devil.dm:144
rt.def("/mob/living/carbon/true_devil/proc/singularity_act", function* singularity_act(f: Frame) {
	if (this.ascended) {
		return 0;
	}
	return (yield* parent_proc());
}, true);

// _true_devil.dm:147
rt.def("/mob/living/carbon/true_devil/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let S: Value = null, newobjective: Value = null;
	if (this.ascended || user.mind.soulOwner == this.mind) {
		(S = (yield* new_(T("/mob/living/simple_animal/imp"), rt.getStep(f, this.loc, 0)))).key = user.key;
		S.mind.assigned_role = "Imp";
		S.mind.special_role = "Imp";
		(newobjective = (yield* new_(T("/datum/objective")))).explanation_text = "Try to get a promotion to a higher devilic rank.";
		S.mind.objectives += newobjective;
		to_chat(S, S.playstyle_string);
		to_chat(S, `<B>Objective #${1}</B>: ${newobjective.explanation_text}`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// _true_devil.dm:167
rt.def("/mob/living/carbon/true_devil/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	let damage: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	if (M.a_intent === "harm") {
		damage = rand(1, 5);
		playsound(this.loc, "punch", 25, 1, -1);
		this.visible_message(`<span class='danger'>${M} has punched ${this}!</span>`, `<span class='userdanger'>${M} has punched ${this}!</span>`);
		yield* this.adjustBruteLoss(damage);
		add_logs(M, this, "attacked");
		yield* this.updatehealth();
	} else if (M.a_intent === "disarm") {
		if (!(!this.lying && !this.ascended)) return f.dot;
		if (prob(5)) {
			yield* this.Unconscious(40);
			playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
			add_logs(M, this, "pushed");
			this.visible_message(`<span class='danger'>${M} has pushed down ${this}!</span>`, `<span class='userdanger'>${M} has pushed down ${this}!</span>`);
		} else if (prob(25)) {
			yield* this.drop_item();
			playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
			this.visible_message(`<span class='danger'>${M} has disarmed ${this}!</span>`, `<span class='userdanger'>${M} has disarmed ${this}!</span>`);
		} else {
			playsound(this.loc, rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1);
			this.visible_message(`<span class='danger'>${M} has attempted to disarm ${this}!</span>`);
		}
	}
	return f.dot;
}, true);

// _true_devil.dm:202
rt.def("/mob/living/carbon/true_devil/proc/ex_act", function* ex_act(f: Frame, severity: Value, ex_target: Value) {
	let b_loss: Value = null;
	if (!this.ascended) {
		if (severity === 1) {
			b_loss = 500;
		} else if (severity === 2) {
			b_loss = 150;
		} else if (severity === 3) {
			b_loss = 30;
		}
		if (this.has_bane("light")) {
			b_loss *= 2;
		}
		yield* this.adjustBruteLoss(b_loss);
	}
	return (yield* parent_proc());
}, true, { waitfor: false });
