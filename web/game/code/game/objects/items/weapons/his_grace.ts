// Based on /tg/station's code/game/objects/items/weapons/his_grace.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(7233, "/obj/item/weapon/his_grace", "/obj/item/weapon", {
	awakened: 0,
	bloodthirst: 0,
	prev_bloodthirst: 0,
	force_bonus: 0,
	name: "artistic toolbox",
	desc: "A toolbox painted bright green. Looking at it makes you feel uneasy.",
	icon_state: "his_grace",
	item_state: "artistic_toolbox",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	w_class: 6,
	origin_tech: "combat=4;engineering=4;syndicate=2",
	force: 12,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/smash.ogg"),
});

// his_grace.dm:16
rt.def("/obj/item/weapon/his_grace/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("robusted");
	return f.dot;
});

// his_grace.dm:24
rt.def("/obj/item/weapon/his_grace/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSprocessing.processing += this;
	return f.dot;
}, true);

// his_grace.dm:28
rt.def("/obj/item/weapon/his_grace/proc/Destroy", function* Destroy(f: Frame) {
	let L: Value = null;
	this.isprocessing = 0;
	GLOB.SSprocessing.processing -= this;
	for (L of each(this, T("/mob/living"))) {
		yield* L.forceMove(rt.getStep(f, this, 0));
	}
	return (yield* parent_proc());
}, true);

// his_grace.dm:34
rt.def("/obj/item/weapon/his_grace/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (this.awakened) return f.dot;
	ImmediateInvokeAsync(this, P("/obj/item/weapon/his_grace/proc/awaken"), user);
	return f.dot;
});

// his_grace.dm:38
rt.def("/obj/item/weapon/his_grace/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (this.awakened && M.stat) {
		yield* this.consume(M);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// his_grace.dm:47
rt.def("/obj/item/weapon/his_grace/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.awakened) {
		if (rt.inRange(this.bloodthirst, HIS_GRACE_SATIATED, HIS_GRACE_PECKISH)) {
			to_chat(user, `<span class='his_grace'>${this} isn't very hungry. Not yet.</span>`);
		} else if (rt.inRange(this.bloodthirst, HIS_GRACE_PECKISH, HIS_GRACE_HUNGRY)) {
			to_chat(user, `<span class='his_grace'>${this} would like a snack.</span>`);
		} else if (rt.inRange(this.bloodthirst, HIS_GRACE_HUNGRY, HIS_GRACE_FAMISHED)) {
			to_chat(user, `<span class='his_grace'>${this} is quite hungry now.</span>`);
		} else if (rt.inRange(this.bloodthirst, HIS_GRACE_FAMISHED, HIS_GRACE_STARVING)) {
			to_chat(user, `<span class='his_grace'>${this} is openly salivating at the sight of you. Be careful.</span>`);
		} else if (rt.inRange(this.bloodthirst, HIS_GRACE_STARVING, HIS_GRACE_CONSUME_OWNER)) {
			to_chat(user, `<span class='his_grace bold'>You walk a fine line. ${this} is very close to devouring you.</span>`);
		} else if (rt.inRange(this.bloodthirst, HIS_GRACE_CONSUME_OWNER, HIS_GRACE_FALL_ASLEEP)) {
			to_chat(user, `<span class='his_grace bold'>${this} is shaking violently and staring directly at you.</span>`);
		}
	} else {
		to_chat(user, `<span class='his_grace'>${this} is latched closed.</span>`);
	}
	return f.dot;
}, false);

// his_grace.dm:66
rt.def("/obj/item/weapon/his_grace/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	if (this.awakened) return f.dot;
	yield* user.forceMove(rt.getStep(f, this, 0));
	user.visible_message(`<span class='warning'>${user} scrambles out of ${this}!</span>`, `<span class='notice'>You climb out of ${this}!</span>`);
	return f.dot;
}, true);

// his_grace.dm:71
rt.def("/obj/item/weapon/his_grace/proc/process", function* process(f: Frame) {
	let master: Value = null, L: Value = null;
	let $e: any;
	if (!this.bloodthirst) {
		this.drowse();
		return f.dot;
	}
	if (this.bloodthirst < HIS_GRACE_CONSUME_OWNER) {
		this.adjust_bloodthirst(1 + Floor(rt.length(this.contents) * 0.5));
	} else {
		this.adjust_bloodthirst(1);
	}
	if (rt.istype((master = get_atom_on_turf(this, T("/mob/living"))), T("/mob/living")) && rt.isIn(f, this, master.held_items)) {
		if (rt.inRange(this.bloodthirst, HIS_GRACE_CONSUME_OWNER, HIS_GRACE_FALL_ASLEEP)) {
			master.visible_message(`<span class='boldwarning'>${this} turns on ${master}!</span>`, `<span class='his_grace big bold'>${this} turns on you!</span>`);
			yield* this.do_attack_animation(master, null, this);
			yield* master.emote("scream");
			yield* master.remove_status_effect(T("/datum/status_effect/his_grace"));
			(rt.modSrcVar(f, "flags", 16777213, rt.bitAnd));
			yield* master.Knockdown(60);
			yield* master.adjustBruteLoss(master.maxHealth);
			playsound(master, rt.rsc("sound/effects/splat.ogg"), 100, 0);
		} else {
			yield* master.apply_status_effect(T("/datum/status_effect/his_grace"));
		}
		return f.dot;
	}
	yield* this.forceMove(rt.getStep(f, this, 0));
	if (this.bloodthirst < HIS_GRACE_CONSUME_OWNER) {
		return f.dot;
	}
	if (this.bloodthirst >= HIS_GRACE_FALL_ASLEEP) {
		this.drowse();
		return f.dot;
	}
	let targets: Value = list();
	for (L of each(oview(2, this), T("/mob/living"))) {
		targets += L;
	}
	if (!rt.length(targets)) {
		return f.dot;
	}
	L = pick(targets);
	yield* step_to(this, L);
	if (!this.Adjacent(L)) return f.dot;
	if (!L.stat) {
		L.visible_message(`<span class='warning'>${this} lunges at ${L}!</span>`, `<span class='his_grace big bold'>${this} lunges at you!</span>`);
		yield* this.do_attack_animation(L, null, this);
		playsound(L, rt.rsc("sound/weapons/smash.ogg"), 50, 1);
		playsound(L, rt.rsc("sound/misc/desceration-01.ogg"), 50, 1);
		yield* L.adjustBruteLoss(this.force);
		this.adjust_bloodthirst(-5);
	} else {
		yield* this.consume(L);
	}
	return f.dot;
}, true, { waitfor: false });

// his_grace.dm:121
rt.def("/obj/item/weapon/his_grace/proc/awaken", function awaken(f: Frame, user: Value) {
	if (this.awakened) {
		return f.dot;
	}
	this.awakened = 1;
	user.visible_message(`<span class='boldwarning'>${this} begins to rattle. He thirsts.</span>`, `<span class='his_grace'>You flick ${this}'s latch up. You hope this is a good idea.</span>`);
	this.name = "His Grace";
	this.desc = "A bloodthirsty artifact created by a profane rite.";
	this.gender = "male";
	this.adjust_bloodthirst(1);
	this.force_bonus = HIS_GRACE_FORCE_BONUS * rt.length(this.contents);
	playsound(user, rt.rsc("sound/effects/pope_entry.ogg"), 100);
	this.icon_state = "his_grace_awakened";
	return f.dot;
}, false, { argTypes: [{ type: 8, path: "/mob" }] });

// his_grace.dm:131
rt.def("/obj/item/weapon/his_grace/proc/drowse", function drowse(f: Frame) {
	let _T: Value = null;
	if (!this.awakened) {
		return f.dot;
	}
	(_T = rt.getStep(f, this, 0)).visible_message(`<span class='boldwarning'>${this} slowly stops rattling and falls still, His latch snapping closed.</span>`);
	playsound(this.loc, rt.rsc("sound/weapons/batonextend.ogg"), 100, 1);
	this.name = rt.initial(f, this, "name");
	this.desc = rt.initial(f, this, "desc");
	this.icon_state = rt.initial(f, this, "icon_state");
	this.gender = rt.initial(f, this, "gender");
	this.force = rt.initial(f, this, "force");
	this.force_bonus = rt.initial(f, this, "force_bonus");
	this.awakened = 0;
	this.bloodthirst = 0;
	return f.dot;
});

// his_grace.dm:146
rt.def("/obj/item/weapon/his_grace/proc/consume", function* consume(f: Frame, meal: Value) {
	if (!meal) {
		return f.dot;
	}
	meal.visible_message(`<span class='warning'>${this} swings open and devours ${meal}!</span>`, `<span class='his_grace big bold'>${this} consumes you!</span>`);
	yield* meal.adjustBruteLoss(200);
	playsound(meal, rt.rsc("sound/misc/desceration-02.ogg"), 75, 1);
	playsound(this, rt.rsc("sound/items/eatfood.ogg"), 100, 1);
	yield* meal.forceMove(this);
	this.force_bonus += HIS_GRACE_FORCE_BONUS;
	this.prev_bloodthirst = this.bloodthirst;
	if (this.prev_bloodthirst < HIS_GRACE_CONSUME_OWNER) {
		this.bloodthirst = max(rt.length(this.contents), 1);
	} else {
		this.bloodthirst = HIS_GRACE_CONSUME_OWNER;
	}
	this.update_stats();
	return f.dot;
}, true);

// his_grace.dm:162
rt.def("/obj/item/weapon/his_grace/proc/adjust_bloodthirst", function adjust_bloodthirst(f: Frame, amt: Value) {
	this.prev_bloodthirst = this.bloodthirst;
	if (this.prev_bloodthirst < HIS_GRACE_CONSUME_OWNER) {
		this.bloodthirst = max(HIS_GRACE_SATIATED, min(this.bloodthirst + amt, HIS_GRACE_CONSUME_OWNER));
	} else {
		this.bloodthirst = max(HIS_GRACE_CONSUME_OWNER, min(this.bloodthirst + amt, HIS_GRACE_FALL_ASLEEP));
	}
	this.update_stats();
	return f.dot;
});

// his_grace.dm:170
rt.def("/obj/item/weapon/his_grace/proc/update_stats", function update_stats(f: Frame) {
	let $0: any, $1: any, $2: any, $3: any, $4: any;
	(rt.modSrcVar(f, "flags", 16777213, rt.bitAnd));
	let master: Value = get_atom_on_turf(this, T("/mob/living"));
	if (rt.inRange(this.bloodthirst, HIS_GRACE_CONSUME_OWNER, HIS_GRACE_FALL_ASLEEP)) {
		if (HIS_GRACE_CONSUME_OWNER > this.prev_bloodthirst) {
			master.visible_message(`<span class='userdanger'>${this} enters a frenzy!</span>`);
		}
	} else if (rt.inRange(this.bloodthirst, HIS_GRACE_STARVING, HIS_GRACE_CONSUME_OWNER)) {
		(rt.modSrcVar(f, "flags", NODROP, rt.bitOr));
		if (HIS_GRACE_STARVING > this.prev_bloodthirst) {
			$0 = master;
			$1 = `<span class='boldwarning'>${this} is starving!</span>`;
			$2 = this;
			$3 = this;
			if (this.force_bonus < 15) {
				$4 = " And still, His power grows.";
			} else {
				$4 = "";
			}
			$0.visible_message($1, `<span class='his_grace big'>${$2}'s bloodlust overcomes you. ${$3} must be fed, or you will become His meal.${$4}</span>`);
			this.force_bonus = max(this.force_bonus, 15);
		}
	} else if (rt.inRange(this.bloodthirst, HIS_GRACE_FAMISHED, HIS_GRACE_STARVING)) {
		(rt.modSrcVar(f, "flags", NODROP, rt.bitOr));
		if (HIS_GRACE_FAMISHED > this.prev_bloodthirst) {
			$0 = master;
			$1 = `<span class='warning'>${this} is very hungry!</span>`;
			$2 = this;
			if (this.force_bonus < 10) {
				$3 = " His power grows.";
			} else {
				$3 = "";
			}
			$0.visible_message($1, `<span class='his_grace big'>Spines sink into your hand. ${$2} must feed immediately.${$3}</span>`);
			this.force_bonus = max(this.force_bonus, 10);
		}
		if (this.prev_bloodthirst >= HIS_GRACE_STARVING) {
			master.visible_message(`<span class='warning'>${this} is now only very hungry!</span>`, "<span class='his_grace big'>Your bloodlust recedes.</span>");
		}
	} else if (rt.inRange(this.bloodthirst, HIS_GRACE_HUNGRY, HIS_GRACE_FAMISHED)) {
		if (HIS_GRACE_HUNGRY > this.prev_bloodthirst) {
			$0 = master;
			$1 = `<span class='warning'>${this} is getting hungry.</span>`;
			$2 = this;
			if (this.force_bonus < 5) {
				$3 = " His power grows.";
			} else {
				$3 = "";
			}
			$0.visible_message($1, `<span class='his_grace big'>You feel ${$2}'s hunger within you.${$3}</span>`);
			this.force_bonus = max(this.force_bonus, 5);
		}
		if (this.prev_bloodthirst >= HIS_GRACE_FAMISHED) {
			master.visible_message(`<span class='warning'>${this} is now only somewhat hungry.</span>`, `<span class='his_grace'>${this}'s hunger recedes a little...</span>`);
		}
	} else if (rt.inRange(this.bloodthirst, HIS_GRACE_PECKISH, HIS_GRACE_HUNGRY)) {
		if (HIS_GRACE_PECKISH > this.prev_bloodthirst) {
			master.visible_message(`<span class='warning'>${this} is feeling snackish.</span>`, `<span class='his_grace'>${this} begins to hunger.</span>`);
		}
		if (this.prev_bloodthirst >= HIS_GRACE_HUNGRY) {
			master.visible_message(`<span class='warning'>${this} is now only a little peckish.</span>`, `<span class='his_grace big'>${this}'s hunger recedes somewhat...</span>`);
		}
	} else if (rt.inRange(this.bloodthirst, HIS_GRACE_SATIATED, HIS_GRACE_PECKISH)) {
		if (this.prev_bloodthirst >= HIS_GRACE_PECKISH) {
			master.visible_message(`<span class='warning'>${this} is satiated.</span>`, `<span class='his_grace big'>${this}'s hunger recedes...</span>`);
		}
	}
	this.force = rt.initial(f, this, "force") + this.force_bonus;
	return f.dot;
});
