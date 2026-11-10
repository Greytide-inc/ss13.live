// Based on /tg/station's code/game/objects/structures/fireaxe.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12749, "/obj/structure/fireaxecabinet", "/obj/structure", {
	fireaxe: null,
	locked: 1,
	open: 0,
	anchored: 1,
	name: "fire axe cabinet",
	desc: "There is a small label that reads \"For Emergency use only\" along with details for safe use of the axe. As if.",
	icon: rt.rsc("icons/obj/wallmounts.dmi"),
	icon_state: "fireaxe",
	density: 0,
	armor: null,
	obj_integrity: 150,
	max_integrity: 150,
	integrity_failure: 50,
});

// fireaxe.dm:4
rt.def("/obj/structure/fireaxecabinet/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.fireaxe = (yield* new_(T("/obj/item/weapon/twohanded/fireaxe")));
	this.armor = rt.alist(f, ["melee", 50, "bullet", 20, "laser", 0, "energy", 100, "bomb", 10, "bio", 100, "rad", 100, "fire", 90, "acid", 50]);
	return f.dot;
}, true);

// fireaxe.dm:17
rt.def("/obj/structure/fireaxecabinet/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// fireaxe.dm:22
rt.def("/obj/structure/fireaxecabinet/proc/Destroy", function* Destroy(f: Frame) {
	if (this.fireaxe) {
		yield* qdel(this.fireaxe);
		this.fireaxe = null;
	}
	return (yield* parent_proc());
}, true);

// fireaxe.dm:26
rt.def("/obj/structure/fireaxecabinet/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let WT: Value = null, G: Value = null, F: Value = null;
	if (rt.istype(user, T("/mob/living/silicon/robot")) || rt.istype(I, T("/obj/item/device/multitool"))) {
		yield* this.toggle_lock(user);
	} else if (rt.istype(I, T("/obj/item/weapon/weldingtool")) && user.a_intent == "help" && !this.broken) {
		WT = I;
		if (this.obj_integrity < this.max_integrity && (yield* WT.remove_fuel(2, user))) {
			to_chat(user, `<span class='notice'>You begin repairing ${this}.</span>`);
			playsound(this.loc, WT.usesound, 40, 1);
			if (yield* do_after(user, 40 * I.toolspeed, { target: this })) {
				this.obj_integrity = this.max_integrity;
				playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
				yield* this.update_icon();
				to_chat(user, `<span class='notice'>You repair ${this}.</span>`);
			}
		} else {
			to_chat(user, `<span class='warning'>${this} is already in good condition!</span>`);
		}
		return f.dot;
	} else if (rt.istype(I, T("/obj/item/stack/sheet/glass")) && this.broken) {
		if ((G = I).get_amount() < 2) {
			to_chat(user, `<span class='warning'>You need two glass sheets to fix ${this}!</span>`);
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start fixing ${this}...</span>`);
		if ((yield* do_after(user, 20, { target: this })) && (yield* G.use(2))) {
			this.broken = 0;
			this.obj_integrity = this.max_integrity;
			yield* this.update_icon();
		}
	} else if (this.open || this.broken) {
		if (rt.istype(I, T("/obj/item/weapon/twohanded/fireaxe")) && !this.fireaxe) {
			if ((F = I).wielded) {
				to_chat(user, `<span class='warning'>Unwield the ${F.name} first.</span>`);
				return f.dot;
			}
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.fireaxe = F;
			yield* F.forceMove(this);
			to_chat(user, `<span class='caution'>You place the ${F.name} back in the ${this.name}.</span>`);
			yield* this.update_icon();
			return f.dot;
		} else if (!this.broken) {
			yield* this.toggle_open();
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// fireaxe.dm:70
rt.def("/obj/structure/fireaxecabinet/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (this.broken) {
			playsound(this.loc, rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 90, 1);
		} else {
			playsound(this.loc, rt.rsc("sound/effects/glasshit.ogg"), 90, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// fireaxe.dm:82
rt.def("/obj/structure/fireaxecabinet/proc/take_damage", function* take_damage(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	if (this.open) {
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.update_icon();
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// fireaxe.dm:87
rt.def("/obj/structure/fireaxecabinet/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	if (!(!this.broken && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	yield* this.update_icon();
	this.broken = 1;
	playsound(this, rt.rsc("sound/effects/glassbr3.ogg"), 100, 1);
	yield* new_(T("/obj/item/weapon/shard"), this.loc);
	yield* new_(T("/obj/item/weapon/shard"), this.loc);
	return f.dot;
}, true);

// fireaxe.dm:95
rt.def("/obj/structure/fireaxecabinet/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (this.fireaxe && this.loc) {
			yield* this.fireaxe.forceMove(this.loc);
			this.fireaxe = null;
		}
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// fireaxe.dm:104
rt.def("/obj/structure/fireaxecabinet/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (this.fireaxe) {
		yield* this.fireaxe.forceMove(this.loc);
		this.fireaxe = null;
	}
	yield* qdel(this);
	return f.dot;
}, true);

// fireaxe.dm:109
rt.def("/obj/structure/fireaxecabinet/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.open || this.broken) {
		if (this.fireaxe) {
			yield* user.put_in_hands(this.fireaxe);
			this.fireaxe = null;
			to_chat(user, `<span class='caution'>You take the fire axe from the ${this.name}.</span>`);
			yield* this.add_fingerprint(user);
			yield* this.update_icon();
			return f.dot;
		}
	}
	if (this.locked) {
		to_chat(user, `<span class='warning'>The ${this.name} won't budge!</span>`);
		return f.dot;
	} else {
		this.open = (!this.open ? 1 : 0);
		yield* this.update_icon();
		return f.dot;
	}
}, true);

// fireaxe.dm:126
rt.def("/obj/structure/fireaxecabinet/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// fireaxe.dm:129
rt.def("/obj/structure/fireaxecabinet/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	yield* this.toggle_lock(user);
	return f.dot;
}, true);

// fireaxe.dm:134
rt.def("/obj/structure/fireaxecabinet/proc/attack_tk", function attack_tk(f: Frame, user: Value) {
	if (this.locked) {
		to_chat(user, `<span class='warning'>The ${this.name} won't budge!</span>`);
		return f.dot;
	} else {
		this.open = (!this.open ? 1 : 0);
		this.update_icon();
		return f.dot;
	}
});

// fireaxe.dm:142
rt.def("/obj/structure/fireaxecabinet/proc/update_icon", function update_icon(f: Frame) {
	let hp_percent: Value = null;
	this.cut_overlays();
	if (this.fireaxe) {
		this.add_overlay("axe");
	}
	if (!this.open) {
		hp_percent = this.obj_integrity / this.max_integrity * 100;
		if (this.broken) {
			this.add_overlay("glass4");
		} else if (rt.inRange(hp_percent, -1e+31, 40)) {
			this.add_overlay("glass3");
		} else if (rt.inRange(hp_percent, 40, 60)) {
			this.add_overlay("glass2");
		} else if (rt.inRange(hp_percent, 60, 80)) {
			this.add_overlay("glass1");
		} else if (rt.inRange(hp_percent, 80, 1e+31)) {
			this.add_overlay("glass");
		}
		if (this.locked) {
			this.add_overlay("locked");
		} else {
			this.add_overlay("unlocked");
		}
	} else {
		this.add_overlay("glass_raised");
	}
	return f.dot;
});

// fireaxe.dm:167
rt.def("/obj/structure/fireaxecabinet/proc/toggle_lock", function* toggle_lock(f: Frame, user: Value) {
	to_chat(user, "<span class = 'caution'> Resetting circuitry...</span>");
	playsound(this, rt.rsc("sound/machines/locktoggle.ogg"), 50, 1);
	if (!(yield* do_after(user, 20, { target: this }))) return f.dot;
	let $0: any = user;
	to_chat($0, `<span class='caution'>You ${this.locked ? "disable" : "re-enable"} the locking modules.</span>`);
	this.locked = (!this.locked ? 1 : 0);
	yield* this.update_icon();
	return f.dot;
}, true);

// fireaxe.dm:180
rt.def("/obj/structure/fireaxecabinet/verb/toggle_open", function toggle_open(f: Frame) {
	if (this.locked) {
		to_chat(f.usr, `<span class='warning'>The ${this.name} won't budge!</span>`);
		return f.dot;
	} else {
		this.open = (!this.open ? 1 : 0);
		this.update_icon();
		return f.dot;
	}
}, false, { verb: { name: "Open/Close", category: "Object", src: 3, range: 1 } });
