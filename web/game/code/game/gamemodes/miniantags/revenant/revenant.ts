// Based on /tg/station's code/game/gamemodes/miniantags/revenant/revenant.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


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

// revenant.dm:47
rt.def("/mob/living/simple_animal/revenant/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.hud_possible = list("15");

	this.drained_mobs = list();
	this.damage_coeff = rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]);
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	return f.dot;
});

// revenant.dm:65
rt.def("/mob/living/simple_animal/revenant/proc/Login", function* Login(f: Frame) {
	let objective: Value = null, objective2: Value = null;
	yield* parent_proc();
	to_chat(this, "<span class='deadsay'><font size=3><b>You are a revenant.</b></font></span>");
	to_chat(this, "<b>Your formerly mundane spirit has been infused with alien energies and empowered into a revenant.</b>");
	to_chat(this, "<b>You are not dead, not alive, but somewhere in between. You are capable of limited interaction with both worlds.</b>");
	to_chat(this, "<b>You are invincible and invisible to everyone but other ghosts. Most abilities will reveal you, rendering you vulnerable.</b>");
	to_chat(this, "<b>To function, you are to drain the life essence from humans. This essence is a resource, as well as your health, and will power all of your abilities.</b>");
	to_chat(this, "<b><i>You do not remember anything of your past lives, nor will you remember anything about this one after your death.</i></b>");
	to_chat(this, "<b>Be sure to read the wiki page at https://tgstation13.org/wiki/Revenant to learn more.</b>");
	if (this.generated_objectives_and_spells) return f.dot;
	this.generated_objectives_and_spells = 1;
	yield* this.mind.remove_all_antag();
	this.mind.wipe_memory();
	rt.op(f, "Output", [], [this, rt.rsc("sound/effects/ghost.ogg")], false);
	(objective = (yield* new_(T("/datum/objective/revenant")))).owner = this.mind;
	this.mind.objectives += objective;
	to_chat(this, `<b>Objective #1</b>: ${objective.explanation_text}`);
	(objective2 = (yield* new_(T("/datum/objective/revenantFluff")))).owner = this.mind;
	this.mind.objectives += objective2;
	to_chat(this, `<b>Objective #2</b>: ${objective2.explanation_text}`);
	this.mind.assigned_role = "revenant";
	this.mind.special_role = "Revenant";
	(rt.modField(f, GLOB.SSticker.mode, "traitors", this.mind, rt.bitOr));
	yield* this.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/night_vision/revenant"), null)));
	yield* this.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/revenant_transmit"), null)));
	yield* this.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/revenant/defile"), null)));
	yield* this.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/revenant/overload"), null)));
	yield* this.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/revenant/blight"), null)));
	yield* this.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/revenant/malfunction"), null)));
	return f.dot;
}, true);

// revenant.dm:100
rt.def("/mob/living/simple_animal/revenant/proc/Life", function* Life(f: Frame) {
	if (this.stasis) {
		return f.dot;
	}
	if (this.revealed && this.essence <= 0) {
		yield* this.death();
	}
	if (this.unreveal_time && rt.worldTime(f) >= this.unreveal_time) {
		this.unreveal_time = 0;
		this.revealed = 0;
		this.incorporeal_move = INCORPOREAL_MOVE_JAUNT;
		this.invisibility = INVISIBILITY_REVENANT;
		to_chat(this, "<span class='revenboldnotice'>You are once more concealed.</span>");
	}
	if (this.unstun_time && rt.worldTime(f) >= this.unstun_time) {
		this.unstun_time = 0;
		this.notransform = 0;
		to_chat(this, "<span class='revenboldnotice'>You can move again!</span>");
	}
	if (this.essence_regenerating && !this.inhibited && this.essence < this.essence_regen_cap) {
		this.essence = min(this.essence_regen_cap, this.essence + this.essence_regen_amount);
		yield* this.update_action_buttons_icon();
	}
	this.update_spooky_icon();
	this.update_health_hud();
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// revenant.dm:120
rt.def("/mob/living/simple_animal/revenant/proc/Stat", function* Stat(f: Frame) {
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	stat(null, `Current essence: ${this.essence}/${this.essence_regen_cap}E`);
	stat(null, `Stolen essence: ${this.essence_accumulated}E`);
	stat(null, `Stolen perfect souls: ${this.perfectsouls}`);
	return f.dot;
}, true);

// revenant.dm:128
rt.def("/mob/living/simple_animal/revenant/proc/update_health_hud", function update_health_hud(f: Frame) {
	if (!this.hud_used) return f.dot;
	let essencecolor: Value = "#8F48C6";
	if (this.essence > this.essence_regen_cap) {
		essencecolor = "#9A5ACB";
	} else if (!this.essence) {
		essencecolor = "#1D2953";
	}
	this.hud_used.healths.maptext = `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='${essencecolor}'>${this.essence}E</font></div>`;
	return f.dot;
});

// revenant.dm:142
rt.def("/mob/living/simple_animal/revenant/proc/say", function say(f: Frame, message: Value) {
	let M: Value = null, link: Value = null;
	if (!message) {
		return f.dot;
	}
	log_say(`${key_name(this)} : ${message}`);
	let rendered: Value = `<span class='revennotice'><b>${this}</b> says, "${message}"</span>`;
	for (M of each(GLOB.mob_list, T("/mob"))) {
		if (rt.istype(M, T("/mob/living/simple_animal/revenant"))) {
			to_chat(M, rendered);
		} else if (rt.istype(M, T("/mob/dead/observer"))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, this]);
			to_chat(M, `${link} ${rendered}`);
		}
	}
	return f.dot;
});

// revenant.dm:176
rt.def("/mob/living/simple_animal/revenant/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.dot = (yield* parent_proc());
	if (!rt.istype(W, T("/obj/item/weapon/nullrod"))) return f.dot;
	this.visible_message(`<span class='warning'>${this} violently flinches!</span>`, fmt("<span class='revendanger'>As ％！ passes through you, you feel your essence draining away!</span>", [W]));
	yield* this.adjustBruteLoss(25);
	this.inhibited = 1;
	yield* this.update_action_buttons_icon();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/revenant/proc/reset_inhibit"))), 30);
	return f.dot;
}, true);

// revenant.dm:187
rt.def("/mob/living/simple_animal/revenant/proc/reset_inhibit", function* reset_inhibit(f: Frame) {
	this.inhibited = 0;
	yield* this.update_action_buttons_icon();
	return f.dot;
}, true);

// revenant.dm:190
rt.def("/mob/living/simple_animal/revenant/proc/adjustHealth", function* adjustHealth(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (!forced && !this.revealed) {
		return 0;
	}
	f.dot = amount;
	this.essence = max(0, this.essence - amount);
	if (updating_health) {
		this.update_health_hud();
	}
	if (this.essence) return f.dot;
	yield* this.death();
	return f.dot;
}, true);

// revenant.dm:200
rt.def("/mob/living/simple_animal/revenant/proc/dust", function* dust(f: Frame) {
	yield* this.death();
	return f.dot;
}, true);

// revenant.dm:203
rt.def("/mob/living/simple_animal/revenant/proc/gib", function* gib(f: Frame) {
	yield* this.death();
	return f.dot;
}, true);

// revenant.dm:206
rt.def("/mob/living/simple_animal/revenant/proc/death", function* death(f: Frame) {
	let R: Value = null;
	if (!this.revealed || this.stasis) {
		return 0;
	}
	this.stasis = 1;
	to_chat(this, `<span class='revendanger'>NO! No... it's too late, you can feel your essence ${pick("breaking apart", "drifting away")}...</span>`);
	this.notransform = 1;
	this.revealed = 1;
	this.invisibility = 0;
	playsound(this, rt.rsc("sound/effects/screech.ogg"), 100, 1);
	this.visible_message(`<span class='warning'>${this} lets out a waning screech as violet mist swirls around its dissolving body!</span>`);
	this.icon_state = "revenant_draining";
	let i: Value = this.alpha;
	while (i > 0) {
		yield* stoplag();
		this.alpha = i;
		i -= 10;
	}
	this.visible_message(`<span class='danger'>${this}'s body breaks apart into a fine pile of blue dust.</span>`);
	let reforming_essence: Value = this.essence_regen_cap;
	(R = (yield* new_(T("/obj/item/weapon/ectoplasm/revenant"), rt.getStep(f, this, 0)))).essence = max(reforming_essence - 15 * this.perfectsouls, 75);
	R.client_to_revive = this.client;
	R.revenant = this;
	this.invisibility = INVISIBILITY_ABSTRACT;
	this.revealed = 0;
	yield* this.ghostize(0);
	return f.dot;
}, true);

// revenant.dm:233
rt.def("/mob/living/simple_animal/revenant/proc/reveal", function reveal(f: Frame, time: Value) {
	if (!this) {
		return f.dot;
	}
	if (time <= 0) {
		return f.dot;
	}
	this.revealed = 1;
	this.invisibility = 0;
	this.incorporeal_move = 0;
	if (!this.unreveal_time) {
		to_chat(this, "<span class='revendanger'>You have been revealed!</span>");
		this.unreveal_time = rt.worldTime(f) + time;
	} else {
		to_chat(this, "<span class='revenwarning'>You have been revealed!</span>");
		this.unreveal_time = this.unreveal_time + time;
	}
	this.update_spooky_icon();
	return f.dot;
});

// revenant.dm:249
rt.def("/mob/living/simple_animal/revenant/proc/stun", function stun(f: Frame, time: Value) {
	if (!this) {
		return f.dot;
	}
	if (time <= 0) {
		return f.dot;
	}
	this.notransform = 1;
	if (!this.unstun_time) {
		to_chat(this, "<span class='revendanger'>You cannot move!</span>");
		this.unstun_time = rt.worldTime(f) + time;
	} else {
		to_chat(this, "<span class='revenwarning'>You cannot move!</span>");
		this.unstun_time = this.unstun_time + time;
	}
	this.update_spooky_icon();
	return f.dot;
});

// revenant.dm:266
rt.def("/mob/living/simple_animal/revenant/proc/update_spooky_icon", function update_spooky_icon(f: Frame) {
	if (this.revealed) {
		if (this.notransform) {
			if (this.draining) {
				this.icon_state = this.icon_drain;
			} else {
				this.icon_state = this.icon_stun;
			}
		} else {
			this.icon_state = this.icon_reveal;
		}
	} else {
		this.icon_state = this.icon_idle;
	}
	return f.dot;
});

// revenant.dm:275
rt.def("/mob/living/simple_animal/revenant/proc/castcheck", function* castcheck(f: Frame, essence_cost: Value) {
	let _T: Value = null, O: Value = null;
	if (!this) {
		return f.dot;
	}
	if (rt.istype((_T = rt.getStep(f, this, 0)), T("/turf/closed"))) {
		to_chat(this, "<span class='revenwarning'>You cannot use abilities from inside of a wall.</span>");
		return 0;
	}
	for (O of each(_T, T("/obj"))) {
		if (O.density && !(yield* O.CanPass(this, _T, 5))) {
			to_chat(this, "<span class='revenwarning'>You cannot use abilities inside of a dense object.</span>");
			return 0;
		}
	}
	if (this.inhibited) {
		to_chat(this, "<span class='revenwarning'>Your powers have been suppressed by nulling energy!</span>");
		return 0;
	}
	if (!(yield* this.change_essence_amount(essence_cost, 1))) {
		to_chat(this, "<span class='revenwarning'>You lack the essence to use that ability.</span>");
		return 0;
	}
	return 1;
}, true);

// revenant.dm:294
rt.def("/mob/living/simple_animal/revenant/proc/change_essence_amount", function* change_essence_amount(f: Frame, essence_amt: Value, silent: Value, source: Value) {
	let $0: any, $1: any, $2: any;
	silent ??= 0;
	if (!this) {
		return f.dot;
	}
	if (this.essence + essence_amt <= 0) {
		return f.dot;
	}
	this.essence = max(0, this.essence + essence_amt);
	yield* this.update_action_buttons_icon();
	this.update_health_hud();
	if (essence_amt > 0) {
		this.essence_accumulated = max(0, this.essence_accumulated + essence_amt);
	}
	if (!silent) {
		if (essence_amt > 0) {
			$0 = this;
			$1 = essence_amt;
			if (source) {

				$2 = ` from ${source}`;
			} else {
				$2 = "";
			}
			to_chat($0, `<span class='revennotice'>Gained ${$1}E${$2}.</span>`);
		} else {
			$0 = this;
			$1 = essence_amt;
			if (source) {

				$2 = ` from ${source}`;
			} else {
				$2 = "";
			}
			to_chat($0, `<span class='revenminor'>Lost ${$1}E${$2}.</span>`);
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

// revenant.dm:337
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/ectoplasm/revenant/proc/try_reform"))), 600);
	return f.dot;
}, true);

// revenant.dm:341
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/scatter", function* scatter(f: Frame) {
	yield* qdel(this);
	return f.dot;
}, true);

// revenant.dm:346
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/try_reform", function* try_reform(f: Frame) {
	if (this.reforming) {
		this.reforming = 0;
		yield* this.reform();
	} else {
		this.inert = 1;
		this.visible_message(`<span class='warning'>${this} settles down and seems lifeless.</span>`);
	}
	return f.dot;
}, true);

// revenant.dm:352
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.reforming || this.inert) {
		return (yield* parent_proc());
	}
	user.visible_message(`<span class='notice'>${user} scatters ${this} in all directions.</span>`, `<span class='notice'>You scatter ${this} across the area. The particles slowly fade away.</span>`);
	yield* user.drop_item();
	yield* this.scatter();
	return f.dot;
}, true);

// revenant.dm:360
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	yield* parent_proc();
	if (this.inert) {
		return f.dot;
	}
	this.visible_message(`<span class='notice'>${this} breaks into particles upon impact, which fade away to nothingness.</span>`);
	yield* this.scatter();
	return f.dot;
}, true, { waitfor: false });

// revenant.dm:367
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.inert) {
		to_chat(user, "<span class='revennotice'>It seems inert.</span>");
	} else {
		if (!this.reforming) return f.dot;
		to_chat(user, "<span class='revenwarning'>It is shifting and distorted. It would be wise to destroy this.</span>");
	}
	return f.dot;
}, false);

// revenant.dm:374
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/reform", function* reform(f: Frame) {
	let key_of_revenant: Value = null, M: Value = null, candidates: Value = null, C: Value = null;
	let $e: any;
	if (!this || this.gc_destroyed || !this.revenant || this.revenant.gc_destroyed || this.inert) {
		return f.dot;
	}
	message_admins("Revenant ectoplasm was left undestroyed for 1 minute and is reforming into a new revenant.");
	this.loc = rt.getStep(f, this, 0);
	yield* this.revenant.forceMove(this.loc);
	if (this.client_to_revive) {
		for (M of each(GLOB.dead_mob_list, T("/mob"))) {
			if (M.client == this.client_to_revive) {
				this.revenant.client = this.client_to_revive;
				key_of_revenant = this.client_to_revive.key;
			}
		}
	}
	if (!key_of_revenant) {
		message_admins("The new revenant's old client either could not be found or is in a new, living mob - grabbing a random candidate instead...");
		if (!rt.len(f, (candidates = (yield* pollCandidatesForMob(`Do you want to be ${this.revenant.name} (reforming)?`, "revenant", null, "revenant", 50, this.revenant))))) {
			yield* qdel(this.revenant);
			message_admins("No candidates were found for the new revenant. Oh well!");
			this.inert = 1;
			this.visible_message(`<span class='revenwarning'>${this} settles down and seems lifeless.</span>`);
			return f.dot;
		}
		C = pick(candidates);
		this.revenant.client = C;
		if (!(key_of_revenant = C.key)) {
			yield* qdel(this.revenant);
			message_admins("No ckey was found for the new revenant. Oh well!");
			this.inert = 1;
			this.visible_message(`<span class='revenwarning'>${this} settles down and seems lifeless.</span>`);
			return f.dot;
		}
	}
	let $0: any = key_of_revenant;
	message_admins(`${$0} has been ${this.client_to_revive ? "re" : ""}made into a revenant by reforming ectoplasm.`);
	log_game(`${key_of_revenant} was ${this.client_to_revive ? "re" : ""}made as a revenant by reforming ectoplasm.`);
	this.visible_message(`<span class='revenboldnotice'>${this} suddenly rises into the air before fading away.</span>`);
	this.revenant.essence = this.essence;
	this.revenant.essence_regen_cap = this.essence;
	this.revenant.death_reset();
	this.revenant.key = key_of_revenant;
	this.revenant = null;
	yield* qdel(this);
	return f.dot;
}, true);

// revenant.dm:416
rt.def("/obj/item/weapon/ectoplasm/revenant/proc/Destroy", function* Destroy(f: Frame) {
	if (!(!this.revenant || this.revenant.gc_destroyed)) {
		yield* qdel(this.revenant);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(1149, "/datum/objective/revenant", "/datum/objective", {
	targetAmount: 100,
	dangerrating: 10,
});

// revenant.dm:426
rt.def("/datum/objective/revenant/proc/New", function New(f: Frame) {
	this.targetAmount = rand(350, 600);
	this.explanation_text = `Absorb ${this.targetAmount} points of essence from humans.`;
	parent_proc();
	return f.dot;
});

// revenant.dm:431
rt.def("/datum/objective/revenant/proc/check_completion", function check_completion(f: Frame) {
	let R: Value = null, essence_stolen: Value = null;
	if (!rt.istype(this.owner.current, T("/mob/living/simple_animal/revenant"))) {
		return 0;
	}
	if (!(R = this.owner.current) || R.stat == 2) {
		return 0;
	}
	if ((essence_stolen = R.essence_accumulated) < this.targetAmount) {
		return 0;
	}
	return 1;
});

rt.type(1150, "/datum/objective/revenantFluff", "/datum/objective", {
	dangerrating: 0,
});

// revenant.dm:456
rt.def("/datum/objective/revenantFluff/proc/New", function New(f: Frame) {
	let explanationTexts: Value = null;
	this.explanation_text = pick((explanationTexts = list("Assist and exacerbate existing threats at critical moments.", "Avoid killing in plain sight.", "Cause as much chaos and anger as you can without being killed.", "Damage and render as much of the station rusted and unusable as possible.", "Disable and cause malfunctions in as many machines as possible.", "Ensure that any holy weapons are rendered unusable.", "Hinder the crew while attempting to avoid being noticed.", "Make the crew as miserable as possible.", "Make the clown as miserable as possible.", "Make the captain as miserable as possible.", "Prevent the use of energy weapons where possible.")));
	parent_proc();
	return f.dot;
});
