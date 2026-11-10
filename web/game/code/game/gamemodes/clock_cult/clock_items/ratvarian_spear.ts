// Based on /tg/station's code/game/gamemodes/clock_cult/clock_items/ratvarian_spear.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(8961, "/obj/item/clockwork/ratvarian_spear", "/obj/item/clockwork", {
	impale_cooldown: 50,
	attack_cooldown: 10,
	timerid: null,
	clockwork_desc: "A powerful spear of Ratvarian making. It's more effective against enemy cultists and silicons.",
	name: "ratvarian spear",
	desc: "A razor-sharp spear made of brass. It thrums with barely-contained energy.",
	icon: rt.rsc("icons/obj/clockwork_objects.dmi"),
	icon_state: "ratvarian_spear",
	item_state: "ratvarian_spear",
	force: 15,
	throwforce: 40,
	sharpness: 2,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	w_class: 4,
});

// ratvarian_spear.dm:20
rt.def("/obj/item/clockwork/ratvarian_spear/proc/Destroy", function* Destroy(f: Frame) {
	yield* deltimer(this.timerid);
	return (yield* parent_proc());
}, true);

// ratvarian_spear.dm:28
rt.def("/obj/item/clockwork/ratvarian_spear/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (GLOB.ratvar_awakens) {
		this.force = 25;
		this.throwforce = 50;
		this.armour_penetration = 10;
		this.clockwork_desc = rt.initial(f, this, "clockwork_desc");
		yield* deltimer(this.timerid);
	} else {
		this.force = rt.initial(f, this, "force");
		this.throwforce = rt.initial(f, this, "throwforce");
		this.armour_penetration = 0;
		this.clockwork_desc = "A powerful spear of Ratvarian making. It's more effective against enemy cultists and silicons, though it won't last for long.";
		yield* deltimer(this.timerid);
		this.timerid = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clockwork/ratvarian_spear/proc/break_spear"))), 1800, 8));
	}
	return f.dot;
}, true);

rt.type(8962, "/obj/item/clockwork/ratvarian_spear/cyborg", "/obj/item/clockwork/ratvarian_spear", {});

// ratvarian_spear.dm:42
rt.def("/obj/item/clockwork/ratvarian_spear/cyborg/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (GLOB.ratvar_awakens) {
		this.force = 25;
		this.throwforce = 50;
		this.armour_penetration = 10;
	} else {
		this.force = rt.initial(f, this, "force");
		this.throwforce = rt.initial(f, this, "throwforce");
		this.armour_penetration = 0;
	}
	return f.dot;
});

// ratvarian_spear.dm:49
rt.def("/obj/item/clockwork/ratvarian_spear/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!(is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	to_chat(user, "<span class='brass'>Stabbing a human you are pulling or have grabbed with the spear will impale them, doing massive damage and stunning.</span>");
	if (rt.istype(user, T("/mob/living/silicon/robot"))) return f.dot;
	to_chat(user, "<span class='brass'>Throwing the spear will do massive damage, break the spear, and knock down the target.</span>");
	return f.dot;
}, false);

// ratvarian_spear.dm:57
rt.def("/obj/item/clockwork/ratvarian_spear/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let S: Value = null, M: Value = null, _T: Value = null, B: Value = null;
	let impaling: Value = 0;
	if (this.attack_cooldown > rt.worldTime(f)) {
		to_chat(user, `<span class='warning'>You can't attack right now, wait ${max(round((this.attack_cooldown - rt.worldTime(f)) * 0.1, 0.1), 0)} seconds!</span>`);
		return f.dot;
	}
	if (user.pulling && rt.istype(user.pulling, T("/mob/living/carbon/human")) && user.pulling == target) {
		if (this.impale_cooldown > rt.worldTime(f)) {
			to_chat(user, `<span class='warning'>You can't impale ${target} yet, wait ${max(round((this.impale_cooldown - rt.worldTime(f)) * 0.1, 0.1), 0)} seconds!</span>`);
		} else {
			impaling = 1;
			this.attack_verb = list("impaled");
			this.force += 22;
			this.armour_penetration += 10;
			yield* user.stop_pulling();
		}
	}
	if (this.hitsound) {
		playsound(this.loc, this.hitsound, this.get_clamped_volume(), 1, -1);
	}
	user.lastattacked = target;
	target.lastattacker = user;
	yield* user.do_attack_animation(target);
	if (!(yield* target.attacked_by(this, user))) {
		impaling = 0;
	} else if (!target.null_rod_check()) {
		if (rt.istype(target, T("/mob/living/silicon"))) {
			if ((S = target).stat != 2) {
				S.visible_message(`<span class='warning'>${S} shudders violently at ${this}'s touch!</span>`, "<span class='userdanger'>ERROR: Temperature rising!</span>");
				yield* S.adjustFireLoss(22);
			}
		} else if (iscultist(target) || rt.istype(target, T("/mob/living/simple_animal/hostile/construct"))) {
			if ((M = target).stat != 2) {
				to_chat(M, `<span class='userdanger'>Your body flares with agony at ${this}'s presence!</span>`);
				yield* M.adjustFireLoss(15);
			}
		} else {
			yield* target.adjustFireLoss(3);
		}
	}
	add_logs(user, target, "attacked", this.name, `(INTENT: ${uppertext(user.a_intent)}) (DAMTYPE: ${uppertext(this.damtype)})`);
	yield* this.add_fingerprint(user);
	this.attack_verb = list("stabbed", "poked", "slashed");
	yield* this.ratvar_act();
	if (!impaling) return f.dot;
	this.impale_cooldown = rt.worldTime(f) + rt.initial(f, this, "impale_cooldown");
	this.attack_cooldown = rt.worldTime(f) + rt.initial(f, this, "attack_cooldown");
	if (!target) return f.dot;
	yield* new_(T("/obj/effect/temp_visual/dir_setting/bloodsplatter"), rt.getStep(f, target, 0), rt.getDir(f, user, target));
	yield* target.Stun(80);
	to_chat(user, `<span class='brass'>You prepare to remove your ratvarian spear from ${target}...</span>`);
	let remove_verb: Value = pick("pull", "yank", "drag");
	if (yield* do_after(user, 10, 1, target)) {
		_T = rt.getStep(f, target, 0);
		B = (yield* new_(T("/obj/effect/temp_visual/dir_setting/bloodsplatter"), _T, rt.getDir(f, target, user)));
		playsound(_T, rt.rsc("sound/misc/splort.ogg"), 200, 1);
		playsound(_T, rt.rsc("sound/weapons/pierce.ogg"), 200, 1);
		if (target.stat != 0) {
			user.visible_message(`<span class='warning'>${user} ${remove_verb}s ${this} out of ${target}!</span>`, `<span class='warning'>You ${remove_verb} your spear from ${target}!</span>`);
		} else {
			user.visible_message(`<span class='warning'>${user} kicks ${target} off of ${this}!</span>`, `<span class='warning'>You kick ${target} off of ${this}!</span>`);
			to_chat(target, `<span class='userdanger'>You scream in pain as you're kicked off of ${this}!</span>`);
			yield* target.emote("scream");
			yield* step(target, rt.getDir(f, user, target));
			_T = rt.getStep(f, target, 0);
			yield* B.forceMove(_T);
			yield* target.Knockdown(40);
			playsound(_T, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1);
		}
		yield* flash_color(target, { flash_color: "#911414", flash_time: 8 });
	} else {
		if (!target) return f.dot;
		user.visible_message(`<span class='warning'>${user} ${remove_verb}s ${this} out of ${target}!</span>`, `<span class='warning'>You ${remove_verb} your spear from ${target}!</span>`);
		if (target.stat == 0) {
			to_chat(target, `<span class='userdanger'>You scream in pain as ${this} is suddenly ${remove_verb}ed out of you!</span>`);
			yield* target.emote("scream");
		}
		yield* flash_color(target, { flash_color: "#911414", flash_time: 4 });
	}
	return f.dot;
}, true);

// ratvarian_spear.dm:128
rt.def("/obj/item/clockwork/ratvarian_spear/proc/throw_impact", function* throw_impact(f: Frame, target: Value) {
	let L: Value = null;
	let _T: Value = rt.getStep(f, target, 0);
	if (rt.istype(target, T("/mob/living"))) {
		if (is_servant_of_ratvar((L = target))) {
			if (yield* L.put_in_active_hand(this)) {
				L.visible_message(`<span class='warning'>${L} catches ${this} out of the air!</span>`);
			} else {
				L.visible_message(`<span class='warning'>${this} bounces off of ${L}, as if repelled by an unseen force!</span>`);
			}
		} else if (!(yield* parent_proc())) {
			if (!L.null_rod_check()) {
				if (rt.istype(L, T("/mob/living/silicon")) || iscultist(L)) {
					yield* L.Knockdown(100);
				} else {
					yield* L.Knockdown(40);
				}
			}
			yield* this.break_spear(_T);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true, { waitfor: false });

// ratvarian_spear.dm:148
rt.def("/obj/item/clockwork/ratvarian_spear/proc/break_spear", function* break_spear(f: Frame, _T: Value) {
	if (!this) return f.dot;
	if (!_T) {
		_T = rt.getStep(f, this, 0);
	}
	if (_T) {
		_T.visible_message(`<span class='warning'>${this} ${pick("cracks in two and fades away", "snaps in two and dematerializes")}!</span>`);
		yield* new_(T("/obj/effect/temp_visual/ratvar/spearbreak"), _T);
	}
	yield* qdel(this);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });
