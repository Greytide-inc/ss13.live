// Based on /tg/station's code/game/objects/structures/beds_chairs/chair.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(12731, "/obj/structure/chair", "/obj/structure", {
	buildstacktype: rt.typePath("/obj/item/stack/sheet/metal"),
	buildstackamount: 1,
	item_chair: rt.typePath("/obj/item/chair"),
	anchored: 1,
	can_buckle: 1,
	buckle_lying: 0,
	name: "chair",
	desc: "You sit in this. Either by will or force.\n<span class='notice'>Drag your sprite to sit in the chair. Alt-click to rotate it clockwise.</span>",
	icon: rt.rsc("icons/obj/chairs.dmi"),
	icon_state: "chair",
	resistance_flags: 0,
	obj_integrity: 250,
	max_integrity: 250,
	integrity_failure: 25,
	layer: 3,
});

// chair.dm:19
rt.def("/obj/structure/chair/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (this.anchored) return f.dot;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/chair/proc/RemoveFromLatejoin"))), 0);
	return f.dot;
}, true);

// chair.dm:24
rt.def("/obj/structure/chair/proc/Destroy", function* Destroy(f: Frame) {
	this.RemoveFromLatejoin();
	return (yield* parent_proc());
}, true);

// chair.dm:28
rt.def("/obj/structure/chair/proc/RemoveFromLatejoin", function RemoveFromLatejoin(f: Frame) {
	GLOB.SSjob.latejoin_trackers -= this;
	return f.dot;
});

// chair.dm:32
rt.def("/obj/structure/chair/proc/deconstruct", function* deconstruct(f: Frame) {
	if (this.buildstacktype && !rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(this.buildstacktype, this.loc, this.buildstackamount);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// chair.dm:37
rt.def("/obj/structure/chair/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// chair.dm:40
rt.def("/obj/structure/chair/proc/narsie_act", function* narsie_act(f: Frame) {
	let W: Value = null;
	yield* (W = (yield* new_(T("/obj/structure/chair/wood"), rt.getStep(f, this, 0)))).setDir(this.dir);
	yield* qdel(this);
	return f.dot;
}, true);

// chair.dm:45
rt.def("/obj/structure/chair/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let SK: Value = null, E: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/wrench")) && !rt.bitAnd(this.flags, NODECONSTRUCT)) {
		playsound(this.loc, W.usesound, 50, 1);
		yield* this.deconstruct();
	} else if (rt.istype(W, T("/obj/item/assembly/shock_kit"))) {
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		SK = W;
		E = (yield* new_(T("/obj/structure/chair/e_chair"), this.loc));
		playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
		yield* E.setDir(this.dir);
		E.part = SK;
		SK.loc = E;
		SK.master = E;
		yield* qdel(this);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// chair.dm:63
rt.def("/obj/structure/chair/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	if (!this.anchored || this.has_buckled_mobs()) {
		yield* parent_proc();
	} else {
		yield* this.rotate();
	}
	return f.dot;
}, true);

// chair.dm:69
rt.def("/obj/structure/chair/proc/handle_rotation", function* handle_rotation(f: Frame, direction: Value) {
	let m: Value = null, buckled_mob: Value = null;
	this.handle_layer();
	if (!this.has_buckled_mobs()) return f.dot;
	for (m of each(this.buckled_mobs)) {
		yield* (buckled_mob = m).setDir(direction);
	}
	return f.dot;
}, true);

// chair.dm:76
rt.def("/obj/structure/chair/proc/handle_layer", function handle_layer(f: Frame) {
	if (this.has_buckled_mobs() && this.dir == 1) {
		this.layer = ABOVE_MOB_LAYER;
	} else {
		this.layer = 3;
	}
	return f.dot;
});

// chair.dm:82
rt.def("/obj/structure/chair/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	parent_proc();
	this.handle_layer();
	return f.dot;
}, false);

// chair.dm:86
rt.def("/obj/structure/chair/proc/spin", function* spin(f: Frame) {
	yield* this.setDir(turn(this.dir, 90));
	return f.dot;
}, true);

// chair.dm:89
rt.def("/obj/structure/chair/proc/setDir", function* setDir(f: Frame, newdir: Value) {
	yield* parent_proc();
	yield* this.handle_rotation(newdir);
	return f.dot;
}, true);

// chair.dm:97
rt.def("/obj/structure/chair/verb/rotate", function* rotate(f: Frame) {
	if (GLOB.config.ghost_interaction) {
		yield* this.spin();
	} else {
		if (!f.usr || !isturf(f.usr.loc)) {
			return f.dot;
		}
		if (f.usr.stat || f.usr.restrained()) {
			return f.dot;
		}
		yield* this.spin();
	}
	return f.dot;
}, true, { verb: { name: "Rotate Chair", category: "Object", src: 3, range: 1 } });

// chair.dm:107
rt.def("/obj/structure/chair/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	yield* parent_proc();
	if (user.incapacitated()) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	if (!(get_dist(this, user) <= 1)) {
		return f.dot;
	} else {
		yield* this.rotate();
	}
	return f.dot;
}, true);

rt.type(12736, "/obj/structure/chair/comfy", "/obj/structure/chair", {
	armrest: null,
	buildstackamount: 2,
	item_chair: null,
	name: "comfy chair",
	desc: "It looks comfy.\n<span class='notice'>Alt-click to rotate it clockwise.</span>",
	icon_state: "comfychair",
	color: "#ffffff",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
});

// chair.dm:151
rt.def("/obj/structure/chair/comfy/proc/Initialize", function* Initialize(f: Frame) {
	this.armrest = mutable_appearance(rt.rsc("icons/obj/chairs.dmi"), "comfychair_armrest");
	this.armrest.layer = ABOVE_MOB_LAYER;
	return (yield* parent_proc());
}, true);

// chair.dm:156
rt.def("/obj/structure/chair/comfy/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.armrest);
	this.armrest = null;
	return (yield* parent_proc());
}, true);

// chair.dm:160
rt.def("/obj/structure/chair/comfy/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	parent_proc();
	if (this.has_buckled_mobs()) {
		this.add_overlay(this.armrest);
	} else {
		this.cut_overlay(this.armrest);
	}
	return f.dot;
}, false);

// chair.dm:207
rt.def("/obj/structure/chair/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	f.dot = (yield* parent_proc());
	if (!(over_object == f.usr && this.Adjacent(f.usr))) return f.dot;
	if (!this.item_chair || !f.usr.can_hold_items() || this.has_buckled_mobs() || rt.bitAnd(this.flags, NODECONSTRUCT)) {
		return f.dot;
	}
	if (f.usr.incapacitated()) {
		to_chat(f.usr, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	f.usr.visible_message(fmt("<span class='notice'>＀ grabs ％！.</span>", [f.usr, this.name]), fmt("<span class='notice'>You grab ％！.</span>", [this.name]));
	let C: Value = (yield* new_(this.item_chair, this.loc));
	yield* f.usr.put_in_hands(C);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(9877, "/obj/item/chair", "/obj/item", {
	break_chance: 5,
	origin_type: rt.typePath("/obj/structure/chair"),
	item_state: "chair",
	w_class: 5,
	throw_range: 3,
	hitsound: rt.rsc("sound/items/trayhit1.ogg"),
	hit_reaction_chance: 50,
	materials: null,
	name: "chair",
	desc: "Bar brawl essential.",
	icon: rt.rsc("icons/obj/chairs.dmi"),
	icon_state: "chair_toppled",
	force: 8,
	throwforce: 10,
});

// chair.dm:237
rt.def("/obj/item/chair/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 2000]);
	return f.dot;
});

// chair.dm:242
rt.def("/obj/item/chair/proc/narsie_act", function* narsie_act(f: Frame) {
	let W: Value = null;
	yield* (W = (yield* new_(T("/obj/item/chair/wood"), rt.getStep(f, this, 0)))).setDir(this.dir);
	yield* qdel(this);
	return f.dot;
}, true);

// chair.dm:247
rt.def("/obj/item/chair/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.plant(user);
	return f.dot;
}, true);

// chair.dm:250
rt.def("/obj/item/chair/proc/plant", function* plant(f: Frame, user: Value) {
	let A: Value = null, C: Value = null;
	for (A of each(rt.getStep(f, this.loc, 0), T("/obj"))) {
		if (rt.istype(A, T("/obj/structure/chair"))) {
			to_chat(user, "<span class='danger'>There is already a chair here.</span>");
			return f.dot;
		}
		if (A.density && !rt.bitAnd(A.flags, ON_BORDER)) {
			to_chat(user, "<span class='danger'>There is already something here.</span>");
			return f.dot;
		}
	}
	user.visible_message(fmt("<span class='notice'>＀ rights ％！.</span>", [user, this.name]), fmt("<span class='notice'>You right ％！.</span>", [this.name]));
	yield* (C = (yield* new_(this.origin_type, rt.getStep(f, this.loc, 0)))).setDir(this.dir);
	yield* qdel(this);
	return f.dot;
}, true);

// chair.dm:264
rt.def("/obj/item/chair/proc/smash", function* smash(f: Frame, user: Value) {
	let stack_type: Value = null, M: Value = null;
	let $e: any;
	if (!(stack_type = rt.initial(f, this.origin_type, "buildstacktype"))) {
		return f.dot;
	}
	let remaining_mats: Value = rt.initial(f, this.origin_type, "buildstackamount");
	remaining_mats--;
	if (remaining_mats) {
		rt.forRange(f, 0, 1, remaining_mats, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* new_(stack_type, rt.getStep(f, this.loc, 0));
		}
		rt.endFor(f, 0);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// chair.dm:278
rt.def("/obj/item/chair/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	if (attack_type == 2 && prob(this.hit_reaction_chance)) {
		owner.visible_message(`<span class='danger'>${owner} fends off ${attack_text} with ${this}!</span>`);
		return 1;
	}
	return 0;
});

// chair.dm:284
rt.def("/obj/item/chair/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let C: Value = null;
	yield* parent_proc();
	if (!proximity) {
		return f.dot;
	}
	if (!prob(this.break_chance)) return f.dot;
	user.visible_message(fmt("<span class='danger'>＀ smashes ％！ to pieces against ％！</span>", [user, this, target]));
	if (rt.istype(target, T("/mob/living/carbon"))) {
		if ((C = target).health < C.maxHealth * 0.5) {
			yield* C.Knockdown(20);
		}
	}
	yield* this.smash(user);
	return f.dot;
}, true);

rt.type(9880, "/obj/item/chair/wood", "/obj/item/chair", {
	item_state: "woodenchair",
	hitsound: rt.rsc("sound/weapons/genhit1.ogg"),
	materials: null,
	break_chance: 50,
	name: "wooden chair",
	icon_state: "wooden_chair_toppled",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
	origin_type: rt.typePath("/obj/structure/chair/wood"),
});

// chair.dm:321
rt.def("/obj/item/chair/wood/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = null;
	return f.dot;
});
