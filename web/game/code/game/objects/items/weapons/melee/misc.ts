// Based on /tg/station's code/game/objects/items/weapons/melee/misc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5654, "/obj/item/weapon/melee", "/obj/item/weapon", {
	needs_permit: 1,
});

// misc.dm:5
rt.def("/obj/item/weapon/melee/proc/check_martial_counter", function* check_martial_counter(f: Frame, target: Value, user: Value) {
	if (!(yield* target.check_block())) return f.dot;
	target.visible_message(`<span class='danger'>${target.name} blocks ${this} and twists ${user}'s arm behind their back!</span>`, "<span class='userdanger'>You block the attack!</span>");
	yield* user.Stun(40);
	return 1;
}, true);

rt.type(5665, "/obj/item/weapon/melee/chainofcommand", "/obj/item/weapon/melee", {
	flags: 64,
	name: "chain of command",
	desc: "A tool used by great men to placate the frothing masses.",
	icon_state: "chain",
	item_state: "chain",
	slot_flags: 512,
	force: 10,
	throwforce: 7,
	w_class: 3,
	origin_tech: "combat=5",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/chainhit.ogg"),
	materials: null,
});

// misc.dm:25
rt.def("/obj/item/weapon/melee/chainofcommand/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("flogged", "whipped", "lashed", "disciplined");
	this.materials = rt.alist(f, ["$metal", 1000]);
	return f.dot;
});

// misc.dm:28
rt.def("/obj/item/weapon/melee/chainofcommand/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is strangling ${user.p_them()}self with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 8;
});

rt.type(5687, "/obj/item/weapon/melee/sabre", "/obj/item/weapon/melee", {
	flags: 64,
	name: "officer's sabre",
	desc: "An elegant weapon, its monomolecular edge is capable of cutting through flesh and bone with ease.",
	icon_state: "sabre",
	item_state: "sabre",
	unique_rename: 1,
	force: 15,
	throwforce: 10,
	w_class: 4,
	block_chance: 50,
	armour_penetration: 75,
	sharpness: 1,
	origin_tech: "combat=5",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/rapierhit.ogg"),
	materials: null,
});

// misc.dm:61
rt.def("/obj/item/weapon/melee/sabre/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("slashed", "cut");
	this.materials = rt.alist(f, ["$metal", 1000]);
	return f.dot;
});

// misc.dm:64
rt.def("/obj/item/weapon/melee/sabre/proc/hit_reaction", function hit_reaction(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = "the attack";
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = 0;
	}
	if (f.args[5] === null) {
		f.args[5] = 1;
	}
	if (f.args[5] == 3) {
		f.args[3] = 0;
	}
	return parent_proc();
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

rt.type(5688, "/obj/item/weapon/melee/classic_baton", "/obj/item/weapon/melee", {
	cooldown: 0,
	on: 1,
	name: "police baton",
	desc: "A wooden truncheon for beating criminal scum.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "baton",
	item_state: "classic_baton",
	slot_flags: 512,
	force: 12,
	w_class: 3,
});

// misc.dm:81
rt.def("/obj/item/weapon/melee/classic_baton/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let H: Value = null;
	if (!this.on) {
		return (yield* parent_proc());
	}
	yield* this.add_fingerprint(user);
	if (rt.isIn(f, 256, user.disabilities) && prob(50)) {
		to_chat(user, "<span class ='danger'>You club yourself over the head.</span>");
		yield* user.Knockdown(60 * this.force);
		if (rt.istype(user, T("/mob/living/carbon/human"))) {
			yield* (H = user).apply_damage(2 * this.force, "brute", "head");
		} else {
			yield* user.take_bodypart_damage(2 * this.force);
		}
		return f.dot;
	}
	if (rt.istype(target, T("/mob/living/silicon/robot"))) {
		yield* parent_proc();
		return f.dot;
	}
	if (!rt.istype(target, T("/mob/living"))) {
		return f.dot;
	}
	if (user.a_intent == "harm") {
		if (!(yield* parent_proc())) {
			return f.dot;
		}
		if (!rt.istype(target, T("/mob/living/silicon/robot"))) {
			return f.dot;
		}
	} else {
		if (!(this.cooldown <= rt.worldTime(f))) return f.dot;
		if (rt.istype(target, T("/mob/living/carbon/human"))) {
			if (yield* (H = target).check_shields(this, 0, `${user}'s ${this.name}`, 1)) {
				return f.dot;
			}
			if (yield* this.check_martial_counter(H, user)) {
				return f.dot;
			}
		}
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/woodhit.ogg"), 75, 1, -1);
		yield* target.Knockdown(60);
		add_logs(user, target, "stunned", this);
		yield* this.add_fingerprint(user);
		target.visible_message(`<span class ='danger'>${user} has knocked down ${target} with ${this}!</span>`, `<span class ='userdanger'>${user} has knocked down ${target} with ${this}!</span>`);
		if (!rt.istype(user, T("/mob/living/carbon"))) {
			target.LAssailant = null;
		} else {
			target.LAssailant = user;
		}
		this.cooldown = rt.worldTime(f) + 40;
	}
	return f.dot;
}, true);

rt.type(5689, "/obj/item/weapon/melee/classic_baton/telescopic", "/obj/item/weapon/melee/classic_baton", {
	on: 0,
	name: "telescopic baton",
	desc: "A compact yet robust personal defense weapon. Can be concealed when folded.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "telebaton_0",
	item_state: null,
	slot_flags: 512,
	w_class: 2,
	needs_permit: 0,
	force: 0,
});

// misc.dm:137
rt.def("/obj/item/weapon/melee/classic_baton/telescopic/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let H: Value = user;
	let B: Value = H.getorgan(T("/obj/item/organ/brain"));
	user.visible_message(`<span class='suicide'>${user} stuffs ${this} up ${user.p_their()} nose and presses the 'extend' button! It looks like ${user.p_theyre()} trying to clear their mind.</span>`);
	if (!this.on) {
		yield* this.attack_self(user);
	} else {
		playsound(this.loc, rt.rsc("sound/weapons/batonextend.ogg"), 50, 1);
		yield* this.add_fingerprint(user);
	}
	yield* sleep(3);
	if (!(H && !(!H || H.gc_destroyed))) return f.dot;
	if (B && !(!B || B.gc_destroyed)) {
		H.internal_organs -= B;
		yield* qdel(B);
	}
	yield* new_(T("/obj/effect/gibspawner/generic"), H.loc, H.viruses, H.dna);
	return 1;
}, true);

// misc.dm:155
rt.def("/obj/item/weapon/melee/classic_baton/telescopic/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	this.on = (!this.on ? 1 : 0);
	if (this.on) {
		to_chat(user, "<span class ='warning'>You extend the baton.</span>");
		this.icon_state = "telebaton_1";
		this.item_state = "nullrod";
		this.w_class = WEIGHT_CLASS_BULKY;
		this.force = 10;
		this.attack_verb = list("smacked", "struck", "cracked", "beaten");
	} else {
		to_chat(user, "<span class ='notice'>You collapse the baton.</span>");
		this.icon_state = "telebaton_0";
		this.item_state = null;
		this.slot_flags = SLOT_BELT;
		this.w_class = WEIGHT_CLASS_SMALL;
		this.force = 0;
		this.attack_verb = list("hit", "poked");
	}
	playsound(this.loc, rt.rsc("sound/weapons/batonextend.ogg"), 50, 1);
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

rt.type(5690, "/obj/item/weapon/melee/supermatter_sword", "/obj/item/weapon/melee", {
	shard: null,
	balanced: 1,
	name: "supermatter sword",
	desc: "In a station full of bad ideas, this might just be the worst.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "supermatter_sword",
	item_state: "supermatter_sword",
	slot_flags: null,
	w_class: 4,
	force: 0.001,
	armour_penetration: 1000,
	origin_tech: "combat=7;materials=6",
	force_string: "INFINITE",
});

// misc.dm:191
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.shard = (yield* new_(T("/obj/machinery/power/supermatter_shard"), this));
	yield* qdel(this.shard.countdown);
	this.shard.countdown = null;
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	this.visible_message(`<span class='warning'>${this} appears, balanced ever so perfectly on its hilt. This isn't ominous at all.</span>`);
	return f.dot;
}, true);

// misc.dm:199
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/process", function* process(f: Frame) {
	let target: Value = null, _T: Value = null;
	if (this.balanced || this.throwing || ismob(this.loc) || this.loc === null) {
		return f.dot;
	}
	if (!isturf(this.loc)) {
		this.loc = (target = this.loc).loc;
		yield* this.consume_everything(target);
	} else {
		if (rt.istype((_T = rt.getStep(f, this, 0)), T("/turf/open/space"))) return f.dot;
		yield* this.consume_turf(_T);
	}
	return f.dot;
}, true, { waitfor: false });

// misc.dm:211
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	if (user && target == user) {
		yield* user.drop_item();
	}
	if (proximity_flag) {
		yield* this.consume_everything(target);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// misc.dm:218
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/throw_impact", function* throw_impact(f: Frame, target: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (ismob(target)) {
		if (this.loc == M) {
			yield* M.drop_item();
		}
	}
	yield* this.consume_everything(target);
	return f.dot;
}, true, { waitfor: false });

// misc.dm:226
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/pickup", function pickup(f: Frame, user: Value) {
	parent_proc();
	this.balanced = 0;
	return f.dot;
}, false);

// misc.dm:230
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	this.visible_message(`<span class='danger'>The blast wave smacks into ${this} and rapidly flashes to ash.</span>`, "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>");
	yield* this.consume_everything();
	return f.dot;
}, true, { waitfor: false });

// misc.dm:235
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/acid_act", function* acid_act(f: Frame) {
	this.visible_message(`<span class='danger'>The acid smacks into ${this} and rapidly flashes to ash.</span>`, "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>");
	yield* this.consume_everything();
	return f.dot;
}, true);

// misc.dm:240
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/bullet_act", function* bullet_act(f: Frame, _P: Value) {
	this.visible_message(`<span class='danger'>${_P} smacks into ${this} and rapidly flashes to ash.</span>`, "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>");
	yield* this.consume_everything();
	return f.dot;
}, true);

// misc.dm:245
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} touches ${this}'s blade. It looks like ${user.p_theyre()} tired of waiting for the radiation to kill ${user.p_them()}!</span>`);
	yield* user.drop_item();
	yield* this.shard.Bumped(user);
	return f.dot;
}, true);

// misc.dm:250
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/consume_everything", function* consume_everything(f: Frame, target: Value) {
	if (target === null) {
		yield* this.shard.Consume();
	} else if (!isturf(target)) {
		yield* this.shard.Bumped(target);
	} else {
		yield* this.consume_turf(target);
	}
	return f.dot;
}, true);

// misc.dm:258
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/consume_turf", function* consume_turf(f: Frame, _T: Value) {
	if (rt.op(f, "IsType", [], [_T, _T.baseturf])) {
		return f.dot;
	}
	playsound(_T, rt.rsc("sound/effects/supermatter.ogg"), 50, 1);
	_T.visible_message(`<span class='danger'>${_T} smacks into ${this} and rapidly flashes to ash.</span>`, "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>");
	yield* this.shard.Consume();
	yield* _T.ChangeTurf(_T.baseturf);
	_T.CalculateAdjacentTurfs();
	return f.dot;
}, true);

rt.type(5691, "/obj/item/weapon/melee/curator_whip", "/obj/item/weapon/melee", {
	name: "curator's whip",
	desc: "Somewhat eccentric and outdated, it still stings like hell to be hit by.",
	icon_state: "whip",
	item_state: "chain",
	slot_flags: 512,
	force: 15,
	w_class: 3,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/chainhit.ogg"),
});

// misc.dm:282
rt.def("/obj/item/weapon/melee/curator_whip/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let H: Value = null;
	if (rt.istype(target, T("/mob/living/carbon/human")) && proximity_flag) {
		yield* (H = target).drop_all_held_items();
		H.visible_message(`<span class='danger'>${user} disarms ${H}!</span>`, `<span class='userdanger'>${user} disarmed you!</span>`);
	}
	yield* parent_proc();
	return f.dot;
}, true);
