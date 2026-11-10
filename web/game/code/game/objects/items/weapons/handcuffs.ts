// Based on /tg/station's code/game/objects/items/weapons/handcuffs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5775, "/obj/item/weapon/restraints/handcuffs", "/obj/item/weapon/restraints", {
	cuffsound: rt.rsc("sound/weapons/handcuffs.ogg"),
	trashtype: null,
	flags: 64,
	throw_speed: 3,
	throw_range: 5,
	name: "handcuffs",
	desc: "Use this to keep prisoners in line.",
	gender: "plural",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "handcuff",
	slot_flags: 512,
	throwforce: 0,
	w_class: 2,
	materials: null,
	origin_tech: "engineering=3;combat=3",
	breakouttime: 600,
	armor: null,
});

// handcuffs.dm:18
rt.def("/obj/item/weapon/restraints/handcuffs/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 500]);
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

// handcuffs.dm:26
rt.def("/obj/item/weapon/restraints/handcuffs/proc/attack", function* attack(f: Frame, C: Value, user: Value) {
	let M: Value = null;
	if (!rt.istype(C, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (rt.bitAnd(user.disabilities, 256) && prob(50)) {
		to_chat(user, "<span class='warning'>Uh... how do those things work?!</span>");
		yield* this.apply_cuffs(user, user);
		return f.dot;
	}
	if (rt.istype(C, T("/mob/living/carbon/monkey")) && prob(MONKEY_CUFF_RETALIATION_PROB)) {
		yield* (M = C).retaliate(user);
	}
	if (C.handcuffed) return f.dot;
	if (C.get_num_arms() >= 2 || C.get_arm_ignore()) {
		C.visible_message(`<span class='danger'>${user} is trying to put ${this.name} on ${C}!</span>`, `<span class='userdanger'>${user} is trying to put ${this.name} on ${C}!</span>`);
		playsound(this.loc, this.cuffsound, 30, 1, -2);
		if ((yield* do_mob(user, C, 30)) && (C.get_num_arms() >= 2 || C.get_arm_ignore())) {
			yield* this.apply_cuffs(C, user);
			to_chat(user, `<span class='notice'>You handcuff ${C}.</span>`);
			add_logs(user, C, "handcuffed");
		} else {
			to_chat(user, `<span class='warning'>You fail to handcuff ${C}!</span>`);
		}
	} else {
		to_chat(user, `<span class='warning'>${C} doesn't have two hands...</span>`);
	}
	return f.dot;
}, true);

// handcuffs.dm:57
rt.def("/obj/item/weapon/restraints/handcuffs/proc/apply_cuffs", function* apply_cuffs(f: Frame, target: Value, user: Value, dispense: Value) {
	dispense ??= 0;
	if (target.handcuffed) {
		return f.dot;
	}
	if (!(yield* user.drop_item()) && !dispense) {
		return f.dot;
	}
	let cuffs: Value = this;
	if (this.trashtype) {
		cuffs = (yield* new_(this.trashtype));
	} else if (dispense) {
		cuffs = (yield* new_(this.type));
	}
	cuffs.loc = target;
	target.handcuffed = cuffs;
	yield* target.update_handcuffed();
	if (this.trashtype && !dispense) {
		yield* qdel(this);
	}
	return f.dot;
}, true);

rt.type(5781, "/obj/item/weapon/restraints/handcuffs/cable", "/obj/item/weapon/restraints/handcuffs", {
	wirestorage: null,
	cuffsound: rt.rsc("sound/weapons/cablecuff.ogg"),
	name: "cable restraints",
	desc: "Looks like some cables tied together. Could be used to tie something up.",
	icon_state: "cuff_red",
	item_state: "coil_red",
	materials: null,
	origin_tech: "engineering=2",
	breakouttime: 300,
});

// handcuffs.dm:91
rt.def("/obj/item/weapon/restraints/handcuffs/cable/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 150, "$glass", 75]);
	return f.dot;
});

// handcuffs.dm:98
rt.def("/obj/item/weapon/restraints/handcuffs/cable/proc/attack", function* attack(f: Frame, C: Value, user: Value) {
	if (!rt.istype(C, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (this.wirestorage && this.wirestorage.energy < 15) {
		to_chat(user, `<span class='warning'>You need at least 15 wire to restrain ${C}!</span>`);
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// handcuffs.dm:107
rt.def("/obj/item/weapon/restraints/handcuffs/cable/proc/apply_cuffs", function* apply_cuffs(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (this.wirestorage) {
		if (!(yield* this.wirestorage.use_charge(15))) {
			to_chat(f.args[1], `<span class='warning'>You need at least 15 wire to restrain ${f.args[0]}!</span>`);
			return f.dot;
		}
		return (yield* parent_proc(f.args[0], f.args[1], 1));
	}
	return (yield* parent_proc());
}, true, { args: ["target", "user", "dispense"] });

// handcuffs.dm:160
rt.def("/obj/item/weapon/restraints/handcuffs/cable/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let R: Value = null, W: Value = null, M: Value = null, S: Value = null;
	yield* parent_proc();
	if (rt.istype(I, T("/obj/item/stack/rods"))) {
		if (yield* (R = I).use(1)) {
			W = (yield* new_(T("/obj/item/weapon/wirerod")));
			yield* this.remove_item_from_storage(user);
			yield* user.put_in_hands(W);
			to_chat(user, "<span class='notice'>You wrap the cable restraint around the top of the rod.</span>");
			yield* qdel(this);
		} else {
			to_chat(user, "<span class='warning'>You need one rod to make a wired rod!</span>");
			return f.dot;
		}
	} else if (rt.istype(I, T("/obj/item/stack/sheet/metal"))) {
		if ((M = I).get_amount() < 6) {
			to_chat(user, "<span class='warning'>You need at least six metal sheets to make good enough weights!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You begin to apply ${I} to ${this}...</span>`);
		if (yield* do_after(user, 35, { target: this })) {
			if (M.get_amount() < 6 || !M) {
				return f.dot;
			}
			S = (yield* new_(T("/obj/item/weapon/restraints/legcuffs/bola")));
			yield* M.use(6);
			yield* user.put_in_hands(S);
			to_chat(user, `<span class='notice'>You make some weights out of ${I} and tie them to ${this}.</span>`);
			yield* this.remove_item_from_storage(user);
			yield* qdel(this);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(5791, "/obj/item/weapon/restraints/handcuffs/cable/zipties/cyborg", "/obj/item/weapon/restraints/handcuffs/cable/zipties", {});

// handcuffs.dm:191
rt.def("/obj/item/weapon/restraints/handcuffs/cable/zipties/cyborg/proc/attack", function* attack(f: Frame, C: Value, user: Value) {
	if (!rt.istype(user, T("/mob/living/silicon/robot"))) return f.dot;
	if (C.handcuffed) return f.dot;
	playsound(this.loc, rt.rsc("sound/weapons/cablecuff.ogg"), 30, 1, -2);
	C.visible_message(`<span class='danger'>${user} is trying to put zipties on ${C}!</span>`, `<span class='userdanger'>${user} is trying to put zipties on ${C}!</span>`);
	if (yield* do_mob(user, C, 30)) {
		if (!C.handcuffed) {
			C.handcuffed = (yield* new_(T("/obj/item/weapon/restraints/handcuffs/cable/zipties/used"), C));
			yield* C.update_handcuffed();
			to_chat(user, `<span class='notice'>You handcuff ${C}.</span>`);
			add_logs(user, C, "handcuffed");
		}
	} else {
		to_chat(user, `<span class='warning'>You fail to handcuff ${C}!</span>`);
	}
	return f.dot;
}, true);

rt.type(5790, "/obj/item/weapon/restraints/handcuffs/cable/zipties", "/obj/item/weapon/restraints/handcuffs/cable", {
	name: "zipties",
	desc: "Plastic, disposable zipties that can be used to restrain temporarily but are destroyed after use.",
	icon_state: "cuff_white",
	item_state: "coil_white",
	materials: null,
	breakouttime: 450,
	trashtype: rt.typePath("/obj/item/weapon/restraints/handcuffs/cable/zipties/used"),
});

// handcuffs.dm:210
rt.def("/obj/item/weapon/restraints/handcuffs/cable/zipties/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

rt.type(5771, "/obj/item/weapon/restraints/legcuffs/beartrap", "/obj/item/weapon/restraints/legcuffs", {
	armed: 0,
	trap_damage: 20,
	throw_speed: 1,
	throw_range: 1,
	name: "bear trap",
	icon_state: "beartrap",
	desc: "A trap used to catch bears and other legged creatures.",
	origin_tech: "engineering=4",
});

// handcuffs.dm:248
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.icon_state = `${rt.initial(f, this, "icon_state")}${this.armed}`;
	return f.dot;
}, true);

// handcuffs.dm:252
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is sticking ${user.p_their()} head in the ${this.name}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	playsound(this.loc, rt.rsc("sound/weapons/bladeslice.ogg"), 50, 1, -1);
	return 1;
});

// handcuffs.dm:257
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let $2: any;
	yield* parent_proc();
	if (!(rt.istype(user, T("/mob/living/carbon/human")) && !user.stat && !user.restrained())) return f.dot;
	this.armed = (!this.armed ? 1 : 0);
	this.icon_state = `${rt.initial(f, this, "icon_state")}${this.armed}`;
	let $0: any = user;
	let $1: any = this;
	if (this.armed) {

		$2 = "armed";
	} else {
		$2 = "disarmed";
	}
	to_chat($0, `<span class='notice'>${$1} is now ${$2}</span>`);
	return f.dot;
}, true);

// handcuffs.dm:264
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let L: Value = null, snap: Value = null, def_zone: Value = null, C: Value = null, SA: Value = null;
	if (this.armed && isturf(this.loc)) {
		if (rt.istype(AM, T("/mob/living"))) {
			L = AM;
			snap = 0;
			def_zone = "chest";
			if (rt.istype(L, T("/mob/living/carbon"))) {
				C = L;
				snap = 1;
				if (!C.lying) {
					def_zone = pick("l_leg", "r_leg");
					if (!C.legcuffed && C.get_num_legs() >= 2) {
						C.legcuffed = this;
						this.loc = C;
						yield* C.update_inv_legcuffed();
					}
				}
			} else if (rt.istype(L, T("/mob/living/simple_animal"))) {
				if ((SA = L).mob_size > MOB_SIZE_TINY) {
					snap = 1;
				}
			}
			if (rt.bitAnd(L.movement_type, 2)) {
				snap = 0;
			}
			if (snap) {
				this.armed = 0;
				this.icon_state = `${rt.initial(f, this, "icon_state")}${this.armed}`;
				playsound(this.loc, rt.rsc("sound/effects/snap.ogg"), 50, 1);
				L.visible_message(fmt("<span class='danger'>＀ triggers ％！.</span>", [L, this]), fmt("<span class='userdanger'>You trigger ％！!</span>", [this]));
				yield* L.apply_damage(this.trap_damage, "brute", def_zone);
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(5772, "/obj/item/weapon/restraints/legcuffs/beartrap/energy", "/obj/item/weapon/restraints/legcuffs/beartrap", {
	armed: 1,
	trap_damage: 0,
	flags: 16384,
	name: "energy snare",
	icon_state: "e_snare",
});

// handcuffs.dm:302
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/energy/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/restraints/legcuffs/beartrap/energy/proc/dissipate"))), 100);
	return f.dot;
}, true);

// handcuffs.dm:306
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/energy/proc/dissipate", function* dissipate(f: Frame) {
	if (ismob(this.loc)) return f.dot;
	yield* do_sparks(1, 1, this);
	yield* qdel(this);
	return f.dot;
}, true);

// handcuffs.dm:311
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/energy/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.Crossed(user);
	return f.dot;
}, true);

rt.type(5767, "/obj/item/weapon/restraints/legcuffs/bola", "/obj/item/weapon/restraints/legcuffs", {
	knockdown: 0,
	name: "bola",
	desc: "A restraining device designed to be thrown at the target. Upon connecting with said target, it will wrap around their legs, making it difficult for them to move quickly.",
	icon_state: "bola",
	breakouttime: 35,
	gender: "neuter",
	origin_tech: "engineering=3;combat=1",
});

// handcuffs.dm:326
rt.def("/obj/item/weapon/restraints/legcuffs/bola/proc/throw_at", function* throw_at(f: Frame) {
	if (f.args[4] === null) {
		f.args[4] = 1;
	}
	if (f.args[5] === null) {
		f.args[5] = 0;
	}
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	playsound(this.loc, rt.rsc("sound/weapons/bolathrow.ogg"), 75, 1);
	return f.dot;
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// handcuffs.dm:331
rt.def("/obj/item/weapon/restraints/legcuffs/bola/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	let C: Value = null;
	if ((yield* parent_proc()) || !rt.istype(hit_atom, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (!(!(C = hit_atom).legcuffed && C.get_num_legs() >= 2)) return f.dot;
	this.visible_message(fmt("<span class='danger'>＄！ ensnares ＀!</span>", [this, C]));
	C.legcuffed = this;
	this.loc = C;
	yield* C.update_inv_legcuffed();
	to_chat(C, fmt("<span class='userdanger'>＄！ ensnares you!</span>", [this]));
	yield* C.Knockdown(this.knockdown);
	return f.dot;
}, true, { waitfor: false });

rt.type(5770, "/obj/item/weapon/restraints/legcuffs/bola/energy", "/obj/item/weapon/restraints/legcuffs/bola", {
	name: "energy bola",
	desc: "A specialized hard-light bola designed to ensnare fleeing criminals and aid in arrests.",
	icon_state: "ebola",
	hitsound: rt.rsc("sound/weapons/taserhit.ogg"),
	w_class: 2,
	breakouttime: 60,
});

// handcuffs.dm:360
rt.def("/obj/item/weapon/restraints/legcuffs/bola/energy/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	let B: Value = null;
	if (rt.istype(hit_atom, T("/mob/living/carbon"))) {
		yield* (B = (yield* new_(T("/obj/item/weapon/restraints/legcuffs/beartrap/energy/cyborg"), rt.getStep(f, hit_atom, 0)))).Crossed(hit_atom);
		yield* qdel(this);
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });
