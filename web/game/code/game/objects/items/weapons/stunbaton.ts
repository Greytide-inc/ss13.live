// Based on /tg/station's code/game/objects/items/weapons/stunbaton.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5661, "/obj/item/weapon/melee/baton", "/obj/item/weapon/melee", {
	stunforce: 140,
	status: 0,
	cell: null,
	hitcost: 1000,
	throw_hit_chance: 35,
	name: "stunbaton",
	desc: "A stun baton for incapacitating people with.",
	icon_state: "stunbaton",
	item_state: "baton",
	slot_flags: 512,
	force: 10,
	throwforce: 7,
	w_class: 3,
	origin_tech: "combat=2",
	attack_verb: null,
	armor: null,
});

// stunbaton.dm:11
rt.def("/obj/item/weapon/melee/baton/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("beaten");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 50, "bio", 0, "rad", 0, "fire", 80, "acid", 80]);
	return f.dot;
});

// stunbaton.dm:24
rt.def("/obj/item/weapon/melee/baton/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is putting the live ${this.name} in ${user.p_their()} mouth! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 2;
});

// stunbaton.dm:28
rt.def("/obj/item/weapon/melee/baton/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.update_icon();
	return f.dot;
}, true);

// stunbaton.dm:32
rt.def("/obj/item/weapon/melee/baton/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	yield* parent_proc();
	if (!(this.status && prob(this.throw_hit_chance) && rt.istype(hit_atom, T("/mob/living/carbon")))) return f.dot;
	yield* this.baton_stun(hit_atom);
	return f.dot;
}, true, { waitfor: false });

rt.type(5662, "/obj/item/weapon/melee/baton/loaded", "/obj/item/weapon/melee/baton", {});

// stunbaton.dm:38
rt.def("/obj/item/weapon/melee/baton/loaded/proc/Initialize", function* Initialize(f: Frame) {
	this.cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell/high"), this));
	yield* this.update_icon();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// stunbaton.dm:46
rt.def("/obj/item/weapon/melee/baton/proc/deductcharge", function* deductcharge(f: Frame, chrgdeductamt: Value) {
	if (!this.cell) return f.dot;
	f.dot = (yield* this.cell.use(chrgdeductamt));
	if (!(this.status && this.cell.charge < this.hitcost)) return f.dot;
	this.status = 0;
	yield* this.update_icon();
	playsound(this.loc, "sparks", 75, 1, -1);
	return f.dot;
}, true);

// stunbaton.dm:56
rt.def("/obj/item/weapon/melee/baton/proc/update_icon", function update_icon(f: Frame) {
	if (this.status) {
		this.icon_state = `${rt.initial(f, this, "name")}_active`;
	} else if (!this.cell) {
		this.icon_state = `${rt.initial(f, this, "name")}_nocell`;
	} else {
		this.icon_state = `${rt.initial(f, this, "name")}`;
	}
	return f.dot;
});

// stunbaton.dm:63
rt.def("/obj/item/weapon/melee/baton/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.cell) {
		to_chat(user, `<span class='notice'>The baton is ${round(this.cell.percent())}% charged.</span>`);
	} else {
		to_chat(user, "<span class='warning'>The baton does not have a power source installed.</span>");
	}
	return f.dot;
}, false);

// stunbaton.dm:70
rt.def("/obj/item/weapon/melee/baton/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let C: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/stock_parts/cell"))) {
		C = W;
		if (this.cell) {
			to_chat(user, `<span class='notice'>${this} already has a cell.</span>`);
		} else {
			if (C.maxcharge < this.hitcost) {
				to_chat(user, `<span class='notice'>${this} requires a higher capacity cell.</span>`);
				return f.dot;
			}
			if (!(yield* user.transferItemToLoc(W, this))) {
				return f.dot;
			}
			this.cell = W;
			to_chat(user, `<span class='notice'>You install a cell in ${this}.</span>`);
			yield* this.update_icon();
		}
	} else if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.cell) {
			yield* this.cell.update_icon();
			yield* this.cell.forceMove(rt.getStep(f, this, 0));
			this.cell = null;
			to_chat(user, `<span class='notice'>You remove the cell from ${this}.</span>`);
			this.status = 0;
			yield* this.update_icon();
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// stunbaton.dm:96
rt.def("/obj/item/weapon/melee/baton/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any;
	if (this.cell && this.cell.charge > this.hitcost) {
		this.status = (!this.status ? 1 : 0);
		$0 = user;
		$1 = this;
		if (this.status) {

			$2 = "on";
		} else {
			$2 = "off";
		}
		to_chat($0, `<span class='notice'>${$1} is now ${$2}.</span>`);
		playsound(this.loc, "sparks", 75, 1, -1);
	} else {
		this.status = 0;
		if (!this.cell) {
			to_chat(user, `<span class='warning'>${this} does not have a power source!</span>`);
		} else {
			to_chat(user, `<span class='warning'>${this} is out of charge.</span>`);
		}
	}
	yield* this.update_icon();
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// stunbaton.dm:110
rt.def("/obj/item/weapon/melee/baton/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let L: Value = null;
	if (this.status && rt.bitAnd(user.disabilities, 256) && prob(50)) {
		user.visible_message(`<span class='danger'>${user} accidentally hits themself with ${this}!</span>`, `<span class='userdanger'>You accidentally hit yourself with ${this}!</span>`);
		yield* user.Knockdown(this.stunforce * 3);
		yield* this.deductcharge(this.hitcost);
		return f.dot;
	}
	if (rt.istype(M, T("/mob/living/silicon/robot"))) {
		yield* parent_proc();
		return f.dot;
	}
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if (yield* this.check_martial_counter((L = M), user)) {
			return f.dot;
		}
	}
	if (user.a_intent != "harm") {
		if (this.status) {
			if (yield* this.baton_stun(M, user)) {
				yield* user.do_attack_animation(M);
				return f.dot;
			}
		} else {
			M.visible_message(`<span class='warning'>${user} has prodded ${M} with ${this}. Luckily it was off.</span>`, `<span class='warning'>${user} has prodded you with ${this}. Luckily it was off</span>`);
		}
	} else {
		if (this.status) {
			yield* this.baton_stun(M, user);
		}
		yield* parent_proc();
	}
	return f.dot;
}, true);

// stunbaton.dm:142
rt.def("/obj/item/weapon/melee/baton/proc/baton_stun", function* baton_stun(f: Frame, L: Value, user: Value) {
	let H: Value = null, R: Value = null;
	if (rt.istype(L, T("/mob/living/carbon/human"))) {
		if (yield* (H = L).check_shields(this, 0, `${user}'s ${this.name}`, 1)) {
			playsound(L, rt.rsc("sound/weapons/genhit.ogg"), 50, 1);
			return 0;
		}
	}
	if (rt.istype(this.loc, T("/mob/living/silicon/robot"))) {
		if (!(R = this.loc) || !R.cell || !(yield* R.cell.use(this.hitcost))) {
			return 0;
		}
	} else if (!(yield* this.deductcharge(this.hitcost))) {
		return 0;
	}
	yield* L.Knockdown(this.stunforce);
	yield* L.apply_effect("stutter", this.stunforce);
	if (user) {
		user.lastattacked = L;
		L.lastattacker = user;
		L.visible_message(`<span class='danger'>${user} has stunned ${L} with ${this}!</span>`, `<span class='userdanger'>${user} has stunned you with ${this}!</span>`);
		add_logs(user, L, "stunned");
	}
	playsound(this.loc, rt.rsc("sound/weapons/egloves.ogg"), 50, 1, -1);
	if (rt.istype(L, T("/mob/living/carbon/human"))) {
		yield* (H = L).forcesay(GLOB.hit_appends);
	}
	return 1;
}, true);

// stunbaton.dm:174
rt.def("/obj/item/weapon/melee/baton/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.deductcharge(1000 / severity);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(5663, "/obj/item/weapon/melee/baton/cattleprod", "/obj/item/weapon/melee/baton", {
	sparkler: 0,
	stunforce: 100,
	hitcost: 2000,
	throw_hit_chance: 10,
	name: "stunprod",
	desc: "An improvised stun baton.",
	icon_state: "stunprod_nocell",
	item_state: "prod",
	w_class: 4,
	force: 3,
	throwforce: 5,
	slot_flags: 1024,
});

// stunbaton.dm:193
rt.def("/obj/item/weapon/melee/baton/cattleprod/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.sparkler = (yield* new_(T("/obj/item/device/assembly/igniter"), this));
	return f.dot;
}, true);

// stunbaton.dm:197
rt.def("/obj/item/weapon/melee/baton/cattleprod/proc/baton_stun", function* baton_stun(f: Frame) {
	if (!(yield* this.sparkler.activate())) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);
