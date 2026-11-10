// Based on /tg/station's code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(11411, "/obj/effect/clockwork/sigil", "/obj/effect/clockwork", {
	affects_servants: 0,
	stat_affected: 0,
	sigil_name: "Sigil",
	resist_string: "glows blinding white",
	clockwork_desc: "A sigil of some purpose.",
	name: "sigil",
	desc: "A strange set of markings drawn on the ground.",
	icon_state: "sigil",
	layer: 2.5,
	alpha: 50,
	resistance_flags: 0,
});

// Empty in tg.
rt.def("/obj/effect/clockwork/sigil/proc/sigil_effects", undefined, false, { args: ["L"] });

// clock_sigils.dm:16
rt.def("/obj/effect/clockwork/sigil/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (I.force && !is_servant_of_ratvar(user)) {
		user.visible_message(`<span class='warning'>${user} scatters ${this} with ${I}!</span>`, `<span class='danger'>You scatter ${this} with ${I}!</span>`);
		yield* qdel(this);
		return 1;
	}
	return (yield* parent_proc());
}, true);

// clock_sigils.dm:23
rt.def("/obj/effect/clockwork/sigil/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (rt.istype(user, T("/mob/living/carbon")) && !user.stat && (!is_servant_of_ratvar(user) || is_servant_of_ratvar(user) && user.a_intent == "harm")) {
		user.visible_message(`<span class='warning'>${user} stamps out ${this}!</span>`, `<span class='danger'>You stomp on ${this}, scattering it into thousands of particles.</span>`);
		yield* qdel(this);
		return 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// clock_sigils.dm:30
rt.def("/obj/effect/clockwork/sigil/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	this.visible_message(`<span class='warning'>${this} scatters into thousands of particles.</span>`);
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// clock_sigils.dm:34
rt.def("/obj/effect/clockwork/sigil/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let L: Value = null, I: Value = null;
	yield* parent_proc();
	if (!rt.istype(AM, T("/mob/living"))) return f.dot;
	if (!((L = AM).stat <= this.stat_affected)) return f.dot;
	if (!((!is_servant_of_ratvar(L) || this.affects_servants && is_servant_of_ratvar(L)) && (L.mind || L.has_status_effect(T("/datum/status_effect/sigil_mark"))) && !rt.istype(L, T("/mob/living/simple_animal/drone")))) return f.dot;
	if (I = L.null_rod_check()) {
		L.visible_message(`<span class='warning'>${L}'s ${I.name} ${this.resist_string}, protecting them from ${this}'s effects!</span>`, `<span class='userdanger'>Your ${I.name} ${this.resist_string}, protecting you!</span>`);
		return f.dot;
	}
	yield* this.sigil_effects(L);
	return f.dot;
}, true);

rt.type(11412, "/obj/effect/clockwork/sigil/transgression", "/obj/effect/clockwork/sigil", {
	clockwork_desc: "A sigil that will stun the next non-Servant to cross it.",
	light_range: 1.4,
	light_power: 1,
	light_color: "#FAE48C",
	sigil_name: "Sigil of Transgression",
	name: "dull sigil",
	desc: "A dull, barely-visible golden sigil. It's as though light was carved into the ground.",
	icon: rt.rsc("icons/effects/clockwork_effects.dmi"),
	icon_state: "sigildull",
	layer: 2.56,
	alpha: 75,
	color: "#FAE48C",
});

// clock_sigils.dm:65
rt.def("/obj/effect/clockwork/sigil/transgression/proc/sigil_effects", function* sigil_effects(f: Frame, L: Value) {
	let M: Value = null;
	let $2: any, $e: any;
	let target_flashed: Value = (yield* L.flash_act());
	for (M of each(viewers(5, this), T("/mob/living"))) {
		if (!is_servant_of_ratvar(M) && M != L) {
			yield* M.flash_act();
		}
	}
	if (iscultist(L)) {
		to_chat(L, "<span class='heavy_brass'>\"Watch your step, wretch.\"</span>");
		yield* L.adjustBruteLoss(10);
		yield* L.Knockdown(140, 0);
	}
	let $0: any = L;
	let $1: any = `<span class='warning'>${this} appears around ${L} in a burst of light!</span>`;
	if (target_flashed) {
		$2 = "An unseen force";
	} else {
		$2 = "The glowing sigil around you";
	}
	$0.visible_message($1, `<span class='userdanger'>${$2} holds you in place!</span>`);
	yield* L.Stun(100);
	yield* new_(T("/obj/effect/temp_visual/ratvar/sigil/transgression"), rt.getStep(f, this, 0));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11413, "/obj/effect/clockwork/sigil/submission", "/obj/effect/clockwork/sigil", {
	convert_time: 70,
	delete_on_finish: 1,
	glow_type: null,
	clockwork_desc: "A sigil that will enslave the first person to cross it, provided they remain on it for seven seconds.",
	light_range: 2,
	light_power: 0.9,
	light_color: "#FAE48C",
	stat_affected: 1,
	resist_string: "glows faintly yellow",
	sigil_name: "Sigil of Submission",
	name: "ominous sigil",
	desc: "A luminous golden sigil. Something about it really bothers you.",
	icon_state: "sigilsubmission",
	layer: 2.52,
	alpha: 125,
	color: "#FAE48C",
});

// Empty in tg.
rt.def("/obj/effect/clockwork/sigil/submission/proc/post_channel", undefined, false, { args: ["L"] });

// clock_sigils.dm:102
rt.def("/obj/effect/clockwork/sigil/submission/proc/sigil_effects", function* sigil_effects(f: Frame, L: Value) {
	let glow: Value = null, C: Value = null, M: Value = null, link: Value = null;
	let $2: any, $e: any;
	L.visible_message(`<span class='warning'>${this} begins to glow a piercing magenta!</span>`, "<span class='sevtug'>You feel something start to invade your mind...</span>");
	let oldcolor: Value = this.color;
	rt.op(f, "Animate", [2, 6], [null, this, "color", "#AF0AAF", "time", this.convert_time]);
	if (this.glow_type) {
		glow = (yield* new_(this.glow_type, rt.getStep(f, this, 0)));
		rt.op(f, "Animate", [2, 6], [null, glow, "alpha", 255, "time", this.convert_time]);
	}
	let I: Value = 0;
	while (I < this.convert_time && rt.getStep(f, L, 0) == rt.getStep(f, this, 0)) {
		I++;
		yield* sleep(1);
	}
	if (rt.getStep(f, L, 0) != rt.getStep(f, this, 0)) {
		if (glow) {
			yield* qdel(glow);
		}
		rt.op(f, "Animate", [2, 6], [null, this, "color", oldcolor, "time", 20]);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 20);
		this.visible_message(`<span class='warning'>${this} slowly stops glowing!</span>`);
		return f.dot;
	}
	yield* this.post_channel(L);
	if (is_eligible_servant(L)) {
		to_chat(L, "<span class='heavy_brass'>\"You belong to me now.\"</span>");
	}
	yield* add_servant_of_ratvar(L);
	yield* L.Knockdown(60);
	if (rt.istype(L, T("/mob/living/carbon"))) {
		(C = L).silent += 5;
	}
	let $0: any = this.sigil_name;
	let $1: any = get_area(this);
	if (is_servant_of_ratvar(L)) {
		$2 = "successfully converted";
	} else {
		$2 = "failed to convert";
	}
	let message: Value = `${$0} in ${$1} <span class='sevtug'>${$2}</span>`;
	for (M of each(GLOB.mob_list)) {
		if (rt.istype(M, T("/mob/dead/observer"))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, L]);
			to_chat(M, `${link} <span class='heavy_brass'>${message} ${L.real_name}!</span>`);
		} else if (is_servant_of_ratvar(M)) {
			if (M == L) {
				to_chat(M, `<span class='heavy_brass'>${message} you!</span>`);
			} else {
				to_chat(M, `<span class='heavy_brass'>${message} ${L.real_name}!</span>`);
			}
		}
	}
	if (this.delete_on_finish) {
		yield* qdel(this);
	} else {
		rt.op(f, "Animate", [2, 6], [null, this, "color", oldcolor, "time", 20]);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 20);
		this.visible_message(`<span class='warning'>${this} slowly stops glowing!</span>`);
	}
	return f.dot;
}, true);

rt.type(11414, "/obj/effect/clockwork/sigil/submission/accession", "/obj/effect/clockwork/sigil/submission", {
	clockwork_desc: "A sigil that will enslave any person who crosses it, provided they remain on it for seven seconds. \nIt can convert a mindshielded target once before disppearing, but can convert any number of non-implanted targets.",
	light_range: 3,
	light_power: 1,
	light_color: "#A97F1B",
	delete_on_finish: 0,
	sigil_name: "Sigil of Accession",
	resist_string: "glows bright orange",
	name: "terrifying sigil",
	desc: "A luminous brassy sigil. Something about it makes you want to flee.",
	icon_state: "sigiltransgression",
	alpha: 200,
	color: "#A97F1B",
	glow_type: rt.typePath("/obj/effect/temp_visual/ratvar/sigil/accession"),
});

// clock_sigils.dm:164
rt.def("/obj/effect/clockwork/sigil/submission/accession/proc/post_channel", function* post_channel(f: Frame, L: Value) {
	let M: Value = null;
	if (!L.isloyal()) return f.dot;
	this.delete_on_finish = 1;
	L.visible_message(`<span class='warning'>${L} visibly trembles!</span>`, `<span class='sevtug'>${text2ratvar("You will be mine and his. This puny trinket will not stop me.")}</span>`);
	for (M of each(L.implants, T("/obj/item/weapon/implant/mindshield"))) {
		yield* qdel(M);
	}
	return f.dot;
}, true);

rt.type(11415, "/obj/effect/clockwork/sigil/transmission", "/obj/effect/clockwork/sigil", {
	power_charge: 2500,
	clockwork_desc: "A sigil that will serve as a battery for clockwork structures.",
	light_color: "#EC8A2D",
	resist_string: "glows faintly",
	sigil_name: "Sigil of Transmission",
	affects_servants: 1,
	name: "suspicious sigil",
	desc: "A glowing orange sigil. The air around it feels staticky.",
	icon_state: "sigiltransmission",
	alpha: 50,
	color: "#EC8A2D",
});

// clock_sigils.dm:187
rt.def("/obj/effect/clockwork/sigil/transmission/proc/ex_act", function ex_act(f: Frame, severity: Value) {
	if (severity == 3) {
		this.modify_charge(-500);
		this.visible_message(`<span class='warning'>${this} flares a brilliant orange!</span>`);
	} else {
		parent_proc();
	}
	return f.dot;
}, false, { waitfor: false });

// clock_sigils.dm:194
rt.def("/obj/effect/clockwork/sigil/transmission/proc/examine", function examine(f: Frame, user: Value) {
	let _P: Value = null;
	let $1: any, $2: any, $4: any, $5: any, $e: any;
	parent_proc();
	if (!(is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	let structure_number: Value = 0;
	for (_P of each(range(SIGIL_ACCESS_RANGE, this), T("/obj/structure/destructible/clockwork/powered"))) {
		structure_number++;
	}
	let $0: any = user;
	if (this.power_charge) {
		$1 = "brass";
	} else {
		$1 = "alloy";
	}
	if (GLOB.ratvar_awakens) {
		$2 = "INFINITY";
	} else {
		$2 = `${this.power_charge}`;
	}
	let $3: any = structure_number;
	if (structure_number == 1) {
		$4 = "";
	} else {
		$4 = "s";
	}
	if (structure_number == 1) {
		$5 = "is";
	} else {
		$5 = "are";
	}
	to_chat($0, `<span class='${$1}'>It is storing <b>${$2}W</b> of power, and <b>${$3}</b> Clockwork Structure${$4} ${$5} in range.</span>`);
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		to_chat(user, `<span class='brass'>You can recharge from the ${this.sigil_name} by crossing it.</span>`);
	} else if (!GLOB.ratvar_awakens) {
		to_chat(user, `<span class='brass'>Hitting the ${this.sigil_name} with brass sheets will convert them to power at a rate of <b>1</b> brass sheet to <b>${POWER_FLOOR}W</b> power.</span>`);
	}
	if (GLOB.ratvar_awakens) return f.dot;
	to_chat(user, `<span class='brass'>You can recharge Replica Fabricators from the ${this.sigil_name}.</span>`);
	return f.dot;
}, false);

// clock_sigils.dm:209
rt.def("/obj/effect/clockwork/sigil/transmission/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let B: Value = null;
	if (is_servant_of_ratvar(user) && rt.istype(I, T("/obj/item/stack/tile/brass")) && !GLOB.ratvar_awakens) {
		B = I;
		user.visible_message(`<span class='warning'>${user} places ${B} on ${this}, causing it to disintegrate into glowing orange energy!</span>`, `<span class='brass'>You charge the ${this.sigil_name} with ${B}, providing it with <b>${B.amount * POWER_FLOOR}W</b> of power.</span>`);
		this.modify_charge(-(B.amount * POWER_FLOOR));
		playsound(this, rt.rsc("sound/effects/light_flicker.ogg"), B.amount * POWER_FLOOR * 0.01, 1);
		yield* qdel(B);
		return 1;
	}
	return (yield* parent_proc());
}, true);

// clock_sigils.dm:220
rt.def("/obj/effect/clockwork/sigil/transmission/proc/sigil_effects", function* sigil_effects(f: Frame, L: Value) {
	if (is_servant_of_ratvar(L)) {
		if (rt.istype(L, T("/mob/living/silicon/robot"))) {
			yield* this.charge_cyborg(L);
		}
	} else {
		if (!this.power_charge) return f.dot;
		to_chat(L, "<span class='brass'>You feel a slight, static shock.</span>");
	}
	return f.dot;
}, true);

// clock_sigils.dm:227
rt.def("/obj/effect/clockwork/sigil/transmission/proc/charge_cyborg", function* charge_cyborg(f: Frame, cyborg: Value) {
	let giving_power: Value = null;
	if (!this.cyborg_checks(cyborg)) {
		return f.dot;
	}
	to_chat(cyborg, `<span class='brass'>You start to charge from the ${this.sigil_name}...</span>`);
	if (!(yield* do_after(cyborg, 50, { target: this, extra_checks: (yield* new_(T("/datum/callback"), this, P("/obj/effect/clockwork/sigil/transmission/proc/cyborg_checks"), cyborg, 1)) }))) {
		return f.dot;
	}
	if (!this.modify_charge((giving_power = min(Floor(cyborg.cell.maxcharge - cyborg.cell.charge, MIN_CLOCKCULT_POWER), this.power_charge)))) return f.dot;
	cyborg.visible_message(`<span class='warning'>${cyborg} glows a brilliant orange!</span>`);
	let previous_color: Value = cyborg.color;
	cyborg.color = list("#EC8A2D", "#EC8A2D", "#EC8A2D", "#000000");
	yield* cyborg.apply_status_effect(T("/datum/status_effect/cyborg_power_regen"), giving_power * 0.1);
	rt.op(f, "Animate", [2, 6], [null, cyborg, "color", previous_color, "time", 100]);
	yield* addtimer((yield* new_(T("/datum/callback"), cyborg, P("/atom/proc/update_atom_colour"))), 100);
	return f.dot;
}, true);

// clock_sigils.dm:242
rt.def("/obj/effect/clockwork/sigil/transmission/proc/cyborg_checks", function cyborg_checks(f: Frame, cyborg: Value, silent: Value) {
	if (!cyborg.cell) {
		if (!silent) {
			to_chat(cyborg, "<span class='warning'>You have no cell!</span>");
		}
		return 0;
	}
	if (!this.power_charge) {
		if (!silent) {
			to_chat(cyborg, `<span class='warning'>The ${this.sigil_name} has no stored power!</span>`);
		}
		return 0;
	}
	if (cyborg.cell.charge > cyborg.cell.maxcharge - MIN_CLOCKCULT_POWER) {
		if (!silent) {
			to_chat(cyborg, "<span class='warning'>You are already at maximum charge!</span>");
		}
		return 0;
	}
	if (cyborg.has_status_effect(T("/datum/status_effect/cyborg_power_regen"))) {
		if (!silent) {
			to_chat(cyborg, "<span class='warning'>You are already regenerating power!</span>");
		}
		return 0;
	}
	return 1;
}, false, { argTypes: [{ type: 8, path: "/mob/living/silicon/robot" }, {  }] });

// clock_sigils.dm:261
rt.def("/obj/effect/clockwork/sigil/transmission/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	this.update_glow();
	return f.dot;
});

// clock_sigils.dm:266
rt.def("/obj/effect/clockwork/sigil/transmission/proc/modify_charge", function modify_charge(f: Frame, amount: Value) {
	if (GLOB.ratvar_awakens) {
		this.update_glow();
		return 1;
	}
	if (this.power_charge - amount < 0) {
		return 0;
	}
	this.power_charge -= amount;
	this.update_glow();
	return 1;
});

// clock_sigils.dm:276
rt.def("/obj/effect/clockwork/sigil/transmission/proc/update_glow", function update_glow(f: Frame) {
	if (GLOB.ratvar_awakens) {
		this.alpha = 255;
	} else {
		this.alpha = min(rt.initial(f, this, "alpha") + this.power_charge * 0.02, 255);
	}
	if (!this.power_charge) {
		this.set_light(0);
	} else {
		this.set_light(max(this.alpha * 0.02, 1.4), max(this.alpha * 0.01, 0.1));
	}
	return f.dot;
});

rt.type(11416, "/obj/effect/clockwork/sigil/vitality", "/obj/effect/clockwork/sigil", {
	base_revive_cost: 20,
	sigil_active: 0,
	animation_number: 3,
	clockwork_desc: "A sigil that will drain non-Servants that remain on it. Servants that remain on it will be healed if it has any vitality drained.",
	affects_servants: 1,
	stat_affected: 2,
	resist_string: "glows shimmering yellow",
	sigil_name: "Vitality Matrix",
	name: "comforting sigil",
	desc: "A faint blue sigil. Looking at it makes you feel protected.",
	icon_state: "sigilvitality",
	layer: 2.54,
	alpha: 75,
	color: "#123456",
}, { global: { vitality: 776, damage_heal_order: 777 } });

// clock_sigils.dm:304
rt.def("/obj/effect/clockwork/sigil/vitality/proc/examine", function examine(f: Frame, user: Value) {
	let $1: any, $2: any;
	parent_proc();
	if (!(is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	let $0: any = user;
	if (GLOB.vitality) {
		$1 = "inathneq_small";
	} else {
		$1 = "alloy";
	}
	if (GLOB.ratvar_awakens) {
		$2 = "INFINITE";
	} else {
		$2 = `${GLOB.vitality}`;
	}
	to_chat($0, `<span class='${$1}'>It has access to <b>${$2}</b> units of vitality.</span>`);
	if (GLOB.ratvar_awakens) {
		to_chat(user, "<span class='inathneq_small'>It can revive Servants at no cost!</span>");
	} else {
		to_chat(user, `<span class='inathneq_small'>It can revive Servants at a cost of <b>${this.base_revive_cost}</b> vitality plus vitality equal to the non-oxygen damage they have, in addition to being destroyed in the process.</span>`);
	}
	return f.dot;
}, false);

// clock_sigils.dm:313
rt.def("/obj/effect/clockwork/sigil/vitality/proc/sigil_effects", function* sigil_effects(f: Frame, L: Value) {
	let vitality_drained: Value = null, V: Value = null, W: Value = null, revival_cost: Value = null, ghost: Value = null, V_2: Value = null, vitality_for_cycle: Value = null, vitality_used: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (is_servant_of_ratvar(L) && L.suiciding || this.sigil_active) {
		return f.dot;
	}
	this.visible_message(`<span class='warning'>${this} begins to glow bright blue!</span>`);
	rt.op(f, "Animate", [2, 8], [null, this, "alpha", 255, "time", 10, "flags", 1]);
	yield* sleep(10);
	while (L && (!is_servant_of_ratvar(L) || is_servant_of_ratvar(L) && (GLOB.ratvar_awakens || GLOB.vitality)) && rt.getStep(f, L, 0) == rt.getStep(f, this, 0)) {
		this.sigil_active = 1;
		if (this.animation_number >= 4) {
			yield* new_(T("/obj/effect/temp_visual/ratvar/sigil/vitality"), rt.getStep(f, this, 0));
			this.animation_number = 0;
		}
		this.animation_number++;
		if (!is_servant_of_ratvar(L)) {
			vitality_drained = 0;
			if (L.stat == 2) {
				vitality_drained = L.maxHealth;
				V = (yield* new_(T("/obj/effect/temp_visual/ratvar/sigil/vitality"), rt.getStep(f, this, 0)));
				rt.op(f, "Animate", [2, 8], [null, V, "alpha", 0, "transform", matrix() * 2, "time", 8]);
				playsound(L, rt.rsc("sound/magic/wandodeath.ogg"), 50, 1);
				L.visible_message(`<span class='warning'>${L} collapses in on ${L.p_them()}self as ${this} flares bright blue!</span>`);
				to_chat(L, `<span class='inathneq_large'>"${text2ratvar("Your life will not be wasted.")}"</span>`);
				W = null;
				for (W of each(L, T("/obj/item"))) {
					if (!(yield* L.dropItemToGround(W))) {
						yield* qdel(W);
					}
				}
				yield* L.dust();
			} else if (!GLOB.ratvar_awakens && L.stat == 0) {
				vitality_drained = (yield* L.adjustToxLoss(1));
			} else {
				vitality_drained = (yield* L.adjustToxLoss(1.5));
			}
			if (vitality_drained) {
				GLOB.vitality += vitality_drained;
			} else {
				break;
			}
		} else {
			if (L.stat == 2) {
				revival_cost = this.base_revive_cost + L.getCloneLoss() + L.getToxLoss() + L.getFireLoss() + L.getBruteLoss();
				if (GLOB.ratvar_awakens) {
					revival_cost = 0;
				}
				ghost = L.get_ghost(1);
				if (GLOB.vitality >= revival_cost && (ghost || L.mind && L.mind.active)) {
					if (ghost) {
						yield* ghost.reenter_corpse();
					}
					yield* L.revive(1, 1);
					V_2 = (yield* new_(T("/obj/effect/temp_visual/ratvar/sigil/vitality"), rt.getStep(f, this, 0)));
					rt.op(f, "Animate", [2, 8], [null, V_2, "alpha", 0, "transform", matrix() * 2, "time", 8]);
					playsound(L, rt.rsc("sound/magic/staff_healing.ogg"), 50, 1);
					$0 = L;
					$1 = L;
					if (GLOB.ratvar_awakens) {

						$2 = `${L.p_their()} body dripping blue ichor`;
					} else {
						$2 = `even as ${this} scatters into blue sparks around ${L.p_them()}`;
					}
					$0.visible_message(`<span class='warning'>${$1} suddenly gets back up, ${$2}!</span>`, `<span class='inathneq'>"${text2ratvar("You will be okay, child.")}"</span>`);
					GLOB.vitality -= revival_cost;
					if (!GLOB.ratvar_awakens) {
						yield* qdel(this);
					}
				}
				break;
			}
			vitality_for_cycle = 3;
			if (!GLOB.ratvar_awakens) {
				if (L.stat == 0) {
					vitality_for_cycle = 2;
				}
				vitality_for_cycle = min(GLOB.vitality, vitality_for_cycle);
			}
			if (!(vitality_used = (yield* L.heal_ordered_damage(vitality_for_cycle, rt.gl("damage_heal_order#6"))))) {
				break;
			}
			if (!GLOB.ratvar_awakens) {
				GLOB.vitality -= vitality_used;
			}
		}
		yield* sleep(2);
	}
	if (this.sigil_active) {
		this.animation_number = rt.initial(f, this, "animation_number");
		this.sigil_active = 0;
		this.visible_message(`<span class='warning'>${this} slowly stops glowing!</span>`);
	}
	rt.op(f, "Animate", [2, 8], [null, this, "alpha", rt.initial(f, this, "alpha"), "time", 10, "flags", 1]);
	return f.dot;
}, true);
