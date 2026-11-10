// Based on /tg/station's code/game/objects/structures/barsigns.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(12658, "/obj/structure/sign/barsign", "/obj/structure/sign", {
	barsigns: null,
	hiddensigns: null,
	emagged: 0,
	state: 0,
	prev_sign: "",
	panel_open: 0,
	name: "Bar Sign",
	desc: "A bar sign with no writing on it",
	icon: rt.rsc("icons/obj/barsigns.dmi"),
	icon_state: "empty",
	req_access: null,
	obj_integrity: 500,
	max_integrity: 500,
	integrity_failure: 250,
	armor: null,
	buildable_sign: 0,
});

// barsigns.dm:12
rt.def("/obj/structure/sign/barsign/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.barsigns = list();

	this.req_access = list(25);
	this.armor = rt.alist(f, ["melee", 20, "bullet", 20, "laser", 20, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

// barsigns.dm:23
rt.def("/obj/structure/sign/barsign/proc/New", function* New(f: Frame) {
	let bartype: Value = null, signinfo: Value = null;
	yield* parent_proc();
	for (bartype of each(typesof(T("/datum/barsign")) - T("/datum/barsign"))) {
		if (!(signinfo = (yield* new_(bartype))).hidden) {
			this.barsigns += signinfo;
		}
	}
	this.set_sign(pick(this.barsigns));
	return f.dot;
}, true);

// barsigns.dm:39
rt.def("/obj/structure/sign/barsign/proc/set_sign", function set_sign(f: Frame, sign: Value) {
	if (!rt.istype(sign, T("/datum/barsign"))) {
		return f.dot;
	}
	this.icon_state = sign.icon;
	this.name = sign.name;
	if (sign.desc) {
		this.desc = sign.desc;
	} else {
		this.desc = `It displays "${this.name}".`;
	}
	return f.dot;
});

// barsigns.dm:51
rt.def("/obj/structure/sign/barsign/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(!this.broken && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	this.broken = 1;
	return f.dot;
});

// barsigns.dm:55
rt.def("/obj/structure/sign/barsign/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2);
	yield* new_(T("/obj/item/stack/cable_coil"), this.loc, 2);
	yield* qdel(this);
	return f.dot;
}, true);

// barsigns.dm:60
rt.def("/obj/structure/sign/barsign/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		playsound(this.loc, rt.rsc("sound/effects/glasshit.ogg"), 75, 1);
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// barsigns.dm:67
rt.def("/obj/structure/sign/barsign/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// barsigns.dm:72
rt.def("/obj/structure/sign/barsign/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!(yield* this.allowed(user))) {
		to_chat(user, "<span class='info'>Access denied.</span>");
		return f.dot;
	}
	if (this.broken) {
		to_chat(user, "<span class ='danger'>The controls seem unresponsive.</span>");
		return f.dot;
	}
	yield* this.pick_sign();
	return f.dot;
}, true);

// barsigns.dm:84
rt.def("/obj/structure/sign/barsign/proc/attackby", function* attackby(f: Frame, I: Value, user: Value) {
	let C: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if (!(yield* this.allowed(user))) {
			to_chat(user, "<span class='info'>Access denied.</span>");
			return f.dot;
		}
		if (!this.panel_open) {
			to_chat(user, "<span class='notice'>You open the maintenance panel.</span>");
			this.set_sign((yield* new_(T("/datum/barsign/hiddensigns/signoff"))));
			this.panel_open = 1;
		} else {
			to_chat(user, "<span class='notice'>You close the maintenance panel.</span>");
			if (!this.broken && !this.emagged) {
				this.set_sign(pick(this.barsigns));
			} else if (this.emagged) {
				this.set_sign((yield* new_(T("/datum/barsign/hiddensigns/syndibarsign"))));
			} else {
				this.set_sign((yield* new_(T("/datum/barsign/hiddensigns/empbarsign"))));
			}
			this.panel_open = 0;
		}
	} else if (rt.istype(I, T("/obj/item/stack/cable_coil")) && this.panel_open) {
		C = I;
		if (this.emagged) {
			to_chat(user, "<span class='warning'>Sign has been damaged beyond repair!</span>");
			return f.dot;
		} else if (!this.broken) {
			to_chat(user, "<span class='warning'>This sign is functioning properly!</span>");
			return f.dot;
		}
		if (yield* C.use(2)) {
			to_chat(user, "<span class='notice'>You replace the burnt wiring.</span>");
			this.broken = 0;
		} else {
			to_chat(user, "<span class='warning'>You need at least two lengths of cable!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// barsigns.dm:121
rt.def("/obj/structure/sign/barsign/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	this.set_sign(new_(T("/datum/barsign/hiddensigns/empbarsign")));
	this.broken = 1;
	return f.dot;
});

// barsigns.dm:128
rt.def("/obj/structure/sign/barsign/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	if (this.broken || this.emagged) {
		to_chat(user, "<span class='warning'>Nothing interesting happens!</span>");
		return f.dot;
	}
	to_chat(user, "<span class='notice'>You emag the barsign. Takeover in progress...</span>");
	yield* sleep(100);
	this.set_sign((yield* new_(T("/datum/barsign/hiddensigns/syndibarsign"))));
	this.emagged = 1;
	this.req_access = list(150);
	return f.dot;
}, true);

// barsigns.dm:141
rt.def("/obj/structure/sign/barsign/proc/pick_sign", function* pick_sign(f: Frame) {
	let picked_name: Value = null;
	if (!(picked_name = (yield* g.op(f, "Prompt", [1], [null, null, "Bar Sign", "Available Signage", this.barsigns])))) {
		return f.dot;
	}
	this.set_sign(picked_name);
	return f.dot;
}, true);
