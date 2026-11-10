// Based on /tg/station's code/game/objects/items/weapons/RSF.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7339, "/obj/item/weapon/rsf", "/obj/item/weapon", {
	matter: 0,
	mode: 1,
	anchored: 0,
	flags: 4,
	name: "１Rapid-Service-Fabricator",
	desc: "A device used to rapidly deploy service items.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "rcd",
	opacity: 0,
	density: 0,
	armor: null,
	w_class: 3,
});

// RSF.dm:15
rt.def("/obj/item/weapon/rsf/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]);
	return f.dot;
});

// RSF.dm:21
rt.def("/obj/item/weapon/rsf/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>It currently holds ${this.matter}/30 fabrication-units.</span>`);
	return f.dot;
}, false);

// RSF.dm:28
rt.def("/obj/item/weapon/rsf/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/rcd_ammo"))) {
		if (this.matter + 10 > 30) {
			to_chat(user, "The RSF can't hold any more matter.");
			return f.dot;
		}
		yield* qdel(W);
		this.matter += 10;
		playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 10, 1);
		to_chat(user, `The RSF now holds ${this.matter}/30 fabrication-units.`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// RSF.dm:40
rt.def("/obj/item/weapon/rsf/proc/attack_self", function attack_self(f: Frame, user: Value) {
	playsound(this.loc, rt.rsc("sound/effects/pop.ogg"), 50, 0);
	if (this.mode === 1) {
		this.mode = 2;
		to_chat(user, "Changed dispensing mode to 'Drinking Glass'");
	} else if (this.mode === 2) {
		this.mode = 3;
		to_chat(user, "Changed dispensing mode to 'Paper'");
	} else if (this.mode === 3) {
		this.mode = 4;
		to_chat(user, "Changed dispensing mode to 'Pen'");
	} else if (this.mode === 4) {
		this.mode = 5;
		to_chat(user, "Changed dispensing mode to 'Dice Pack'");
	} else if (this.mode === 5) {
		this.mode = 6;
		to_chat(user, "Changed dispensing mode to 'Cigarette'");
	} else if (this.mode === 6) {
		this.mode = 1;
		to_chat(user, "Changed dispensing mode to 'Dosh'");
	}
	return f.dot;
});

// RSF.dm:63
rt.def("/obj/item/weapon/rsf/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let R: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (!(rt.istype(A, T("/obj/structure/table")) || rt.istype(A, T("/turf/open/floor")))) {
		return f.dot;
	}
	if (this.matter < 1) {
		to_chat(user, fmt("<span class='warning'>＄！ doesn't have enough matter left.</span>", [this]));
		return f.dot;
	}
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		if (!(R = user).cell || R.cell.charge < 200) {
			to_chat(user, `<span class='warning'>You do not have enough power to use ${this}.</span>`);
			return f.dot;
		}
	}
	let _T: Value = rt.getStep(f, A, 0);
	playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 10, 1);
	if (this.mode === 1) {
		to_chat(user, "Dispensing Dosh...");
		yield* new_(T("/obj/item/stack/spacecash/c10"), _T);
		this.use_matter(200, user);
	} else if (this.mode === 2) {
		to_chat(user, "Dispensing Drinking Glass...");
		yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"), _T);
		this.use_matter(20, user);
	} else if (this.mode === 3) {
		to_chat(user, "Dispensing Paper Sheet...");
		yield* new_(T("/obj/item/weapon/paper"), _T);
		this.use_matter(10, user);
	} else if (this.mode === 4) {
		to_chat(user, "Dispensing Pen...");
		yield* new_(T("/obj/item/weapon/pen"), _T);
		this.use_matter(50, user);
	} else if (this.mode === 5) {
		to_chat(user, "Dispensing Dice Pack...");
		yield* new_(T("/obj/item/weapon/storage/pill_bottle/dice"), _T);
		this.use_matter(200, user);
	} else if (this.mode === 6) {
		to_chat(user, "Dispensing Cigarette...");
		yield* new_(T("/obj/item/clothing/mask/cigarette"), _T);
		this.use_matter(10, user);
	}
	return f.dot;
}, true);

// RSF.dm:106
rt.def("/obj/item/weapon/rsf/proc/use_matter", function use_matter(f: Frame, charge: Value, user: Value) {
	let R: Value = null;
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		(R = user).cell.charge -= charge;
	} else {
		this.matter--;
		to_chat(user, `The RSF now holds ${this.matter}/30 fabrication-units.`);
	}
	return f.dot;
});

rt.type(7341, "/obj/item/weapon/cookiesynth", "/obj/item/weapon", {
	matter: 10,
	toxin: 0,
	cooldown: 0,
	cooldowndelay: 10,
	emagged: 0,
	name: "Cookie Synthesizer",
	desc: "A self-recharging device used to rapidly deploy cookies.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "rcd",
	w_class: 3,
});

// RSF.dm:126
rt.def("/obj/item/weapon/cookiesynth/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>It currently holds ${this.matter}/10 cookie-units.</span>`);
	return f.dot;
}, false);

// RSF.dm:133
rt.def("/obj/item/weapon/cookiesynth/proc/emag_act", function emag_act(f: Frame, user: Value) {
	this.emagged = (!this.emagged ? 1 : 0);
	if (this.emagged) {
		to_chat(user, `<span class='warning'>You short out the ${this}'s reagent safety checker!</span>`);
	} else {
		to_chat(user, `<span class='warning'>You reset the ${this}'s reagent safety checker!</span>`);
		this.toxin = 0;
	}
	return f.dot;
});

// RSF.dm:142
rt.def("/obj/item/weapon/cookiesynth/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let _P: Value = null;
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		_P = user;
	}
	if (this.emagged && !this.toxin) {
		this.toxin = 1;
		to_chat(user, "Cookie Synthesizer Hacked");
	} else if (_P.emagged && !this.toxin) {
		this.toxin = 1;
		to_chat(user, "Cookie Synthesizer Hacked");
	} else {
		this.toxin = 0;
		to_chat(user, "Cookie Synthesizer Reset");
	}
	return f.dot;
});

// RSF.dm:155
rt.def("/obj/item/weapon/cookiesynth/proc/process", function process(f: Frame) {
	if (!(this.matter < 10)) return f.dot;
	this.matter++;
	return f.dot;
}, false, { waitfor: false });

// RSF.dm:159
rt.def("/obj/item/weapon/cookiesynth/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let R: Value = null, R_2: Value = null;
	if (this.cooldown > rt.worldTime(f)) {
		return f.dot;
	}
	if (!proximity) {
		return f.dot;
	}
	if (!(rt.istype(A, T("/obj/structure/table")) || rt.istype(A, T("/turf/open/floor")))) {
		return f.dot;
	}
	if (this.matter < 1) {
		to_chat(user, `<span class='warning'>The ${this} doesn't have enough matter left. Wait for it to recharge!</span>`);
		return f.dot;
	}
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		if (!(R = user).cell || R.cell.charge < 400) {
			to_chat(user, `<span class='warning'>You do not have enough power to use ${this}.</span>`);
			return f.dot;
		}
	}
	let _T: Value = rt.getStep(f, A, 0);
	playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 10, 1);
	to_chat(user, "Fabricating Cookie..");
	let S: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/cookie"), _T));
	if (this.toxin) {
		yield* S.reagents.add_reagent("chloralhydrate2", 10);
	}
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		(R_2 = user).cell.charge -= 100;
	} else {
		this.matter--;
	}
	this.cooldown = rt.worldTime(f) + this.cooldowndelay;
	return f.dot;
}, true);
