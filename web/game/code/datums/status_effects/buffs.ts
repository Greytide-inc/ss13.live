// Based on /tg/station's code/datums/status_effects/buffs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(919, "/datum/status_effect/shadow_mend", "/datum/status_effect", {
	id: "shadow_mend",
	duration: 30,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/shadow_mend"),
});

// buffs.dm:14
rt.def("/datum/status_effect/shadow_mend/proc/on_apply", function on_apply(f: Frame) {
	this.owner.visible_message(`<span class='notice'>Violet light wraps around ${this.owner}'s body!</span>`, "<span class='notice'>Violet light wraps around your body!</span>");
	playsound(this.owner, rt.rsc("sound/magic/teleport_app.ogg"), 50, 1);
	return parent_proc();
});

// buffs.dm:19
rt.def("/datum/status_effect/shadow_mend/proc/tick", function* tick(f: Frame) {
	yield* this.owner.adjustBruteLoss(-15);
	yield* this.owner.adjustFireLoss(-15);
	return f.dot;
}, true);

// buffs.dm:23
rt.def("/datum/status_effect/shadow_mend/proc/on_remove", function* on_remove(f: Frame) {
	this.owner.visible_message(`<span class='warning'>The violet light around ${this.owner} glows black!</span>`, "<span class='warning'>The tendrils around you cinch tightly and reap their toll...</span>");
	playsound(this.owner, rt.rsc("sound/magic/teleport_diss.ogg"), 50, 1);
	yield* this.owner.apply_status_effect(T("/datum/status_effect/void_price"));
	return f.dot;
}, true);

rt.type(920, "/datum/status_effect/void_price", "/datum/status_effect", {
	id: "void_price",
	duration: 300,
	tick_interval: 30,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/void_price"),
});

// buffs.dm:40
rt.def("/datum/status_effect/void_price/proc/tick", function* tick(f: Frame) {
	rt.op(f, "OutputReference", [rt.R.srcVar("owner")], [(yield* sound(rt.rsc("sound/magic/summon_karp.ogg"), { volume: 25 }))], false);
	yield* this.owner.adjustBruteLoss(3);
	return f.dot;
}, true);

rt.type(11070, "/obj/screen/alert/status_effect/vanguard", "/obj/screen/alert/status_effect", {
	alerttooltipstyle: "clockcult",
	name: "Vanguard",
	desc: "You're absorbing stuns! 25% of all stuns taken will affect you after this effect ends.",
	icon_state: "vanguard",
});

// buffs.dm:59
rt.def("/obj/screen/alert/status_effect/vanguard/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	let L: Value = null, vanguard: Value = null;
	let $0: any, $1: any;
	if (rt.istype((L = f.usr), T("/mob/living"))) {
		vanguard = rt.index(L.stun_absorption, "vanguard");
		this.desc = rt.initial(f, this, "desc");
		$0 = Floor(rt.at(vanguard, "stuns_absorbed") * 0.1);
		if (GLOB.ratvar_awakens) {
			$1 = "";
		} else {
			$1 = `<br><b>${Floor(min(rt.at(vanguard, "stuns_absorbed") * 0.025, 20))}</b> seconds of stun will affect you.`;
		}
		this.desc += `<br><b>${$0}</b> seconds of stuns held back.${$1}`;
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(921, "/datum/status_effect/vanguard_shield", "/datum/status_effect", {
	progbar: null,
	id: "vanguard",
	duration: 200,
	tick_interval: 0,
	status_type: 2,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/vanguard"),
});

// buffs.dm:68
rt.def("/datum/status_effect/vanguard_shield/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.progbar);
	this.progbar = null;
	return (yield* parent_proc());
}, true);

// buffs.dm:73
rt.def("/datum/status_effect/vanguard_shield/proc/on_apply", function* on_apply(f: Frame) {
	this.owner.log_message("gained Vanguard stun immunity", "Attack log");
	this.owner.add_stun_absorption("vanguard", 200, 1, "'s yellow aura momentarily intensifies!", "Your ward absorbs the stun!", " radiating with a soft yellow light!");
	this.owner.visible_message(`<span class='warning'>${this.owner} begins to faintly glow!</span>`, "<span class='brass'>You will absorb all stuns for the next twenty seconds.</span>");
	yield* this.owner.SetStun(0, 0);
	yield* this.owner.SetKnockdown(0);
	this.progbar = (yield* new_(T("/datum/progressbar"), this.owner, this.duration, this.owner));
	this.progbar.bar.color = list("#FAE48C", "#FAE48C", "#FAE48C", "#000000");
	yield* this.progbar.update(this.duration - rt.worldTime(f));
	return (yield* parent_proc());
}, true);

// buffs.dm:84
rt.def("/datum/status_effect/vanguard_shield/proc/tick", function tick(f: Frame) {
	this.progbar.update(this.duration - rt.worldTime(f));
	return f.dot;
});

// buffs.dm:87
rt.def("/datum/status_effect/vanguard_shield/proc/on_remove", function* on_remove(f: Frame) {
	let i: Value = null;
	let $1: any, $e: any;
	let vanguard: Value = rt.index(this.owner.stun_absorption, "vanguard");
	let stuns_blocked: Value = 0;
	if (vanguard) {
		stuns_blocked = round(min(rt.at(vanguard, "stuns_absorbed") * 0.25, 20));
	}
	if (this.owner.stat == 2) return f.dot;
	let message_to_owner: Value = "<span class='warning'>You feel your Vanguard quietly fade...</span>";
	let otheractiveabsorptions: Value = 0;
	for (i of each(this.owner.stun_absorption)) {
		if (rt.index(rt.index(this.owner.stun_absorption, i), "end_time") > rt.worldTime(f) && rt.index(rt.index(this.owner.stun_absorption, i), "priority") > rt.at(vanguard, "priority")) {
			otheractiveabsorptions = 1;
		}
	}
	if (!GLOB.ratvar_awakens && stuns_blocked && !otheractiveabsorptions) {
		rt.setAt(vanguard, "end_time", 0);
		yield* this.owner.Knockdown(stuns_blocked);
		message_to_owner = "<span class='boldwarning'>The weight of the Vanguard's protection crashes down upon you!</span>";
		if (stuns_blocked >= 300) {
			message_to_owner += "\n<span class='userdanger'>You faint from the exertion!</span>";
			stuns_blocked *= 2;
			yield* this.owner.Unconscious(stuns_blocked);
		}
	} else {
		stuns_blocked = 0;
	}
	this.owner.visible_message(`<span class='warning'>${this.owner}'s glowing aura fades!</span>`, message_to_owner);
	let $0: any = this.owner;
	if (stuns_blocked) {
		$1 = `and was stunned for ${stuns_blocked}`;
	} else {
		$1 = "";
	}
	$0.log_message(`lost Vanguard stun immunity${$1}`, "Attack log");
	return f.dot;
}, true);

rt.type(922, "/datum/status_effect/inathneqs_endowment", "/datum/status_effect", {
	id: "inathneqs_endowment",
	duration: 150,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/inathneqs_endowment"),
});

// buffs.dm:123
rt.def("/datum/status_effect/inathneqs_endowment/proc/on_apply", function* on_apply(f: Frame) {
	this.owner.log_message("gained Inath-neq's invulnerability", "Attack log");
	this.owner.visible_message(`<span class='warning'>${this.owner} shines with azure light!</span>`, "<span class='notice'>You feel Inath-neq's power flow through you! You're invincible!</span>");
	let oldcolor: Value = this.owner.color;
	this.owner.color = "#1E8CE1";
	yield* this.owner.fully_heal();
	this.owner.add_stun_absorption("inathneq", 150, 2, "'s flickering blue aura momentarily intensifies!", "Inath-neq's power absorbs the stun!", " glowing with a flickering blue light!");
	(rt.modField(f, this.owner, "status_flags", 4096, rt.bitOr));
	rt.op(f, "Animate", [2, 8], [null, this.owner, "color", oldcolor, "time", 150, "easing", 64]);
	yield* addtimer((yield* new_(T("/datum/callback"), this.owner, P("/atom/proc/update_atom_colour"))), 150);
	playsound(this.owner, rt.rsc("sound/magic/ethereal_enter.ogg"), 50, 1);
	return (yield* parent_proc());
}, true);

// buffs.dm:136
rt.def("/datum/status_effect/inathneqs_endowment/proc/on_remove", function on_remove(f: Frame) {
	this.owner.log_message("lost Inath-neq's invulnerability", "Attack log");
	this.owner.visible_message(`<span class='warning'>The light around ${this.owner} flickers and dissipates!</span>`, "<span class='boldwarning'>You feel Inath-neq's power fade from your body!</span>");
	(rt.modField(f, this.owner, "status_flags", 16773119, rt.bitAnd));
	playsound(this.owner, rt.rsc("sound/magic/ethereal_exit.ogg"), 50, 1);
	return f.dot;
});

rt.type(923, "/datum/status_effect/cyborg_power_regen", "/datum/status_effect", {
	power_to_give: 0,
	id: "power_regen",
	duration: 100,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/power_regen"),
});

// buffs.dm:149
rt.def("/datum/status_effect/cyborg_power_regen/proc/on_creation", function* on_creation(f: Frame, new_owner: Value, new_power_per_tick: Value) {
	f.dot = (yield* parent_proc());
	if (!(f.dot && isnum(new_power_per_tick))) return f.dot;
	this.power_to_give = new_power_per_tick;
	return f.dot;
}, true);

// buffs.dm:159
rt.def("/datum/status_effect/cyborg_power_regen/proc/tick", function* tick(f: Frame) {
	let cyborg: Value = null;
	if (!rt.istype((cyborg = this.owner), T("/mob/living/silicon/robot")) || !cyborg.cell) {
		yield* qdel(this);
		return f.dot;
	}
	playsound(cyborg, rt.rsc("sound/effects/light_flicker.ogg"), 50, 1);
	yield* cyborg.cell.give(this.power_to_give);
	return f.dot;
}, true);

rt.type(11073, "/obj/screen/alert/status_effect/his_grace", "/obj/screen/alert/status_effect", {
	alerttooltipstyle: "hisgrace",
	name: "His Grace",
	desc: "His Grace hungers, and you must feed Him.",
	icon_state: "his_grace",
});

// buffs.dm:180
rt.def("/obj/screen/alert/status_effect/his_grace/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	let HG: Value = null;
	this.desc = rt.initial(f, this, "desc");
	this.desc += `<br><font size=3><b>Current Bloodthirst: ${(HG = this.attached_effect).bloodlust}</b></font><br>Becomes undroppable at <b>${HIS_GRACE_FAMISHED}</b><br>Will consume you at <b>${HIS_GRACE_CONSUME_OWNER}</b>`;
	parent_proc();
	return f.dot;
}, false);

rt.type(924, "/datum/status_effect/his_grace", "/datum/status_effect", {
	bloodlust: 0,
	id: "his_grace",
	duration: -1,
	tick_interval: 4,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/his_grace"),
});

// buffs.dm:188
rt.def("/datum/status_effect/his_grace/proc/on_apply", function on_apply(f: Frame) {
	this.owner.log_message("gained His Grace's stun immunity", "Attack log");
	this.owner.add_stun_absorption("hisgrace", 1e+31, 3, null, "His Grace protects you from the stun!");
	return parent_proc();
});

// buffs.dm:195
rt.def("/datum/status_effect/his_grace/proc/tick", function* tick(f: Frame) {
	let HG: Value = null;
	this.bloodlust = 0;
	let graces: Value = 0;
	for (HG of each(this.owner.held_items, T("/obj/item/weapon/his_grace"))) {
		if (HG.bloodthirst > this.bloodlust) {
			this.bloodlust = HG.bloodthirst;
		}
		if (HG.awakened) {
			graces++;
		}
	}
	if (!graces) {
		yield* this.owner.apply_status_effect(T("/datum/status_effect/his_wrath"));
		yield* qdel(this);
		return f.dot;
	}
	let grace_heal: Value = this.bloodlust * 0.05;
	yield* this.owner.adjustBruteLoss(-grace_heal);
	yield* this.owner.adjustFireLoss(-grace_heal);
	yield* this.owner.adjustToxLoss(-grace_heal, 1, 1);
	yield* this.owner.adjustOxyLoss(-(grace_heal * 2));
	yield* this.owner.adjustCloneLoss(-grace_heal);
	return f.dot;
}, true);

// buffs.dm:212
rt.def("/datum/status_effect/his_grace/proc/on_remove", function on_remove(f: Frame) {
	this.owner.log_message("lost His Grace's stun immunity", "Attack log");
	if (!(rt.istype(this.owner.stun_absorption, T("/list")) && rt.index(this.owner.stun_absorption, "hisgrace"))) return f.dot;
	this.owner.stun_absorption -= "hisgrace";
	return f.dot;
});

rt.type(925, "/datum/status_effect/wish_granters_gift", "/datum/status_effect", {
	id: "wish_granters_gift",
	duration: 50,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/wish_granters_gift"),
});

// buffs.dm:223
rt.def("/datum/status_effect/wish_granters_gift/proc/on_apply", function on_apply(f: Frame) {
	to_chat(this.owner, "<span class='notice'>Death is not your end! The Wish Granter's energy suffuses you, and you begin to rise...</span>");
	return parent_proc();
});

// buffs.dm:227
rt.def("/datum/status_effect/wish_granters_gift/proc/on_remove", function* on_remove(f: Frame) {
	yield* this.owner.revive({ full_heal: 1, admin_revive: 1 });
	this.owner.visible_message(`<span class='warning'>${this.owner} appears to wake from the dead, having healed all wounds!</span>`, "<span class='notice'>You have regenerated.</span>");
	yield* this.owner.update_canmove();
	return f.dot;
}, true);

rt.type(926, "/datum/status_effect/cult_master", "/datum/status_effect", {
	alive: 1,
	id: "The Cult Master",
	duration: -1,
	on_remove_on_mob_delete: 1,
	alert_type: null,
});

// buffs.dm:244
rt.def("/datum/status_effect/cult_master/proc/deathrattle", function deathrattle(f: Frame) {
	let B: Value = null, M: Value = null;
	if (!(!GLOB.cult_narsie || GLOB.cult_narsie.gc_destroyed)) {
		return f.dot;
	}
	let A: Value = get_area(this.owner);
	for (B of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
		if (rt.istype(B.current, T("/mob/living"))) {
			M = B.current;
			rt.op(f, "Output", [], [M, rt.rsc("sound/hallucinations/veryfar_noise.ogg")], false);
			to_chat(M, fmt("<span class='cultlarge'>The Cult's Master, ＀, has fallen in ％！!</span>", [this.owner, A]));
		}
	}
	return f.dot;
});

// buffs.dm:254
rt.def("/datum/status_effect/cult_master/proc/tick", function tick(f: Frame) {
	if (this.owner.stat != 2 && !this.alive) {
		this.alive = 1;
		return f.dot;
	}
	if (!(this.owner.stat == 2 && this.alive)) return f.dot;
	this.alive = 0;
	this.deathrattle();
	return f.dot;
});

// buffs.dm:262
rt.def("/datum/status_effect/cult_master/proc/on_remove", function on_remove(f: Frame) {
	this.deathrattle();
	f.dot = parent_proc();
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

// buffs.dm:284
rt.def("/datum/status_effect/blooddrunk/proc/on_apply", function* on_apply(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	this.owner.maxHealth *= 10;
	this.owner.bruteloss *= 10;
	this.owner.fireloss *= 10;
	this.owner.toxloss *= 10;
	this.owner.oxyloss *= 10;
	this.owner.cloneloss *= 10;
	this.owner.staminaloss *= 10;
	yield* this.owner.updatehealth();
	this.last_health = this.owner.health;
	this.last_bruteloss = this.owner.getBruteLoss();
	this.last_fireloss = this.owner.getFireLoss();
	this.last_toxloss = this.owner.getToxLoss();
	this.last_oxyloss = this.owner.getOxyLoss();
	this.last_cloneloss = this.owner.getCloneLoss();
	this.last_staminaloss = this.owner.getStaminaLoss();
	this.owner.log_message("gained blood-drunk stun immunity", "Attack log");
	this.owner.add_stun_absorption("blooddrunk", 1e+31, 4);
	this.owner.playsound_local(rt.getStep(f, this.owner, 0), rt.rsc("sound/effects/singlebeat.ogg"), 40, 1);
	return f.dot;
}, true);

// buffs.dm:306
rt.def("/datum/status_effect/blooddrunk/proc/tick", function* tick(f: Frame) {
	let needs_health_update: Value = null, new_bruteloss: Value = null, heal_amount: Value = null, new_fireloss: Value = null, heal_amount_3: Value = null, new_toxloss: Value = null, heal_amount_4: Value = null, new_oxyloss: Value = null, heal_amount_5: Value = null, new_cloneloss: Value = null, heal_amount_6: Value = null, new_staminaloss: Value = null, heal_amount_7: Value = null;
	if (this.owner.health > this.last_health) {
		needs_health_update = 0;
		if ((new_bruteloss = this.owner.getBruteLoss()) < this.last_bruteloss) {
			heal_amount = (new_bruteloss - this.last_bruteloss) * 10;
			yield* this.owner.adjustBruteLoss(heal_amount, { updating_health: 0 });
			new_bruteloss = this.owner.getBruteLoss();
			needs_health_update = 1;
		}
		this.last_bruteloss = new_bruteloss;
		if ((new_fireloss = this.owner.getFireLoss()) < this.last_fireloss) {
			heal_amount_3 = (new_fireloss - this.last_fireloss) * 10;
			yield* this.owner.adjustFireLoss(heal_amount_3, { updating_health: 0 });
			new_fireloss = this.owner.getFireLoss();
			needs_health_update = 1;
		}
		this.last_fireloss = new_fireloss;
		if ((new_toxloss = this.owner.getToxLoss()) < this.last_toxloss) {
			heal_amount_4 = (new_toxloss - this.last_toxloss) * 10;
			yield* this.owner.adjustToxLoss(heal_amount_4, { updating_health: 0 });
			new_toxloss = this.owner.getToxLoss();
			needs_health_update = 1;
		}
		this.last_toxloss = new_toxloss;
		if ((new_oxyloss = this.owner.getOxyLoss()) < this.last_oxyloss) {
			heal_amount_5 = (new_oxyloss - this.last_oxyloss) * 10;
			yield* this.owner.adjustOxyLoss(heal_amount_5, { updating_health: 0 });
			new_oxyloss = this.owner.getOxyLoss();
			needs_health_update = 1;
		}
		this.last_oxyloss = new_oxyloss;
		if ((new_cloneloss = this.owner.getCloneLoss()) < this.last_cloneloss) {
			heal_amount_6 = (new_cloneloss - this.last_cloneloss) * 10;
			yield* this.owner.adjustCloneLoss(heal_amount_6, { updating_health: 0 });
			new_cloneloss = this.owner.getCloneLoss();
			needs_health_update = 1;
		}
		this.last_cloneloss = new_cloneloss;
		if ((new_staminaloss = this.owner.getStaminaLoss()) < this.last_staminaloss) {
			heal_amount_7 = (new_staminaloss - this.last_staminaloss) * 10;
			yield* this.owner.adjustStaminaLoss(heal_amount_7, { updating_health: 0 });
			new_staminaloss = this.owner.getStaminaLoss();
			needs_health_update = 1;
		}
		this.last_staminaloss = new_staminaloss;
		if (needs_health_update) {
			yield* this.owner.updatehealth();
			this.owner.playsound_local(rt.getStep(f, this.owner, 0), rt.rsc("sound/effects/singlebeat.ogg"), 40, 1);
		}
	}
	this.last_health = this.owner.health;
	return f.dot;
}, true);

// buffs.dm:362
rt.def("/datum/status_effect/blooddrunk/proc/on_remove", function* on_remove(f: Frame) {
	yield* this.tick();
	this.owner.maxHealth *= 0.1;
	this.owner.bruteloss *= 0.1;
	this.owner.fireloss *= 0.1;
	this.owner.toxloss *= 0.1;
	this.owner.oxyloss *= 0.1;
	this.owner.cloneloss *= 0.1;
	this.owner.staminaloss *= 0.1;
	yield* this.owner.updatehealth();
	this.owner.log_message("lost blood-drunk stun immunity", "Attack log");
	if (!(rt.istype(this.owner.stun_absorption, T("/list")) && rt.index(this.owner.stun_absorption, "blooddrunk"))) return f.dot;
	this.owner.stun_absorption -= "blooddrunk";
	return f.dot;
}, true);
