// Based on /tg/station's code/game/objects/structures/beds_chairs/bed.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12244, "/obj/structure/bed", "/obj/structure", {
	buildstacktype: rt.typePath("/obj/item/stack/sheet/metal"),
	buildstackamount: 2,
	anchored: 1,
	can_buckle: 1,
	buckle_lying: 1,
	name: "bed",
	desc: "This is used to lie in, sleep in or strap on.",
	icon_state: "bed",
	icon: rt.rsc("icons/obj/objects.dmi"),
	resistance_flags: 4,
	obj_integrity: 100,
	max_integrity: 100,
	integrity_failure: 30,
});

// bed.dm:26
rt.def("/obj/structure/bed/proc/deconstruct", function* deconstruct(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (this.buildstacktype) {
			yield* new_(this.buildstacktype, this.loc, this.buildstackamount);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["disassembled"] });

// bed.dm:32
rt.def("/obj/structure/bed/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// bed.dm:35
rt.def("/obj/structure/bed/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/wrench")) && !rt.bitAnd(this.flags, NODECONSTRUCT)) {
		playsound(this.loc, W.usesound, 50, 1);
		yield* this.deconstruct(1);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(12247, "/obj/structure/bed/roller", "/obj/structure/bed", {
	foldabletype: rt.typePath("/obj/item/roller"),
	anchored: 0,
	name: "roller bed",
	icon: rt.rsc("icons/obj/rollerbed.dmi"),
	icon_state: "down",
	resistance_flags: 0,
});

// bed.dm:53
rt.def("/obj/structure/bed/roller/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let R: Value = null;
	if (rt.istype(W, T("/obj/item/roller/robo"))) {
		if ((R = W).loaded) {
			to_chat(user, "<span class='warning'>You already have a roller bed docked!</span>");
			return f.dot;
		}
		if (this.has_buckled_mobs()) {
			if (rt.len(f, this.buckled_mobs) > 1) {
				yield* this.unbuckle_all_mobs();
				user.visible_message(`<span class='notice'>${user} unbuckles all creatures from ${this}.</span>`);
			} else {
				yield* this.user_unbuckle_mob(rt.index(this.buckled_mobs, 1), user);
			}
		} else {
			R.loaded = this;
			yield* this.forceMove(R);
			user.visible_message(`${user} collects ${this}.`, `<span class='notice'>You collect ${this}.</span>`);
		}
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// bed.dm:74
rt.def("/obj/structure/bed/roller/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	f.dot = (yield* parent_proc());
	if (!(over_object == f.usr && this.Adjacent(f.usr))) return f.dot;
	if (!rt.istype(f.usr, T("/mob/living/carbon/human"))) {
		return 0;
	}
	if (this.has_buckled_mobs()) {
		return 0;
	}
	if (f.usr.incapacitated()) {
		to_chat(f.usr, "<span class='warning'>You can't do that right now!</span>");
		return 0;
	}
	f.usr.visible_message(fmt("＀ collapses ％！.", [f.usr, this.name]), fmt("<span class='notice'>You collapse ％！.</span>", [this.name]));
	let B: Value = (yield* new_(this.foldabletype, rt.getStep(f, this, 0)));
	yield* f.usr.put_in_hands(B);
	yield* qdel(this);
	return f.dot;
}, true);

// bed.dm:89
rt.def("/obj/structure/bed/roller/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	if (rt.isIn(f, M, this.buckled_mobs)) {
		this.density = 1;
		this.icon_state = "up";
		M.pixel_y = rt.initial(f, M, "pixel_y");
	} else {
		this.density = 0;
		this.icon_state = "down";
		M.pixel_x = M.get_standard_pixel_x_offset(M.lying);
		M.pixel_y = M.get_standard_pixel_y_offset(M.lying);
	}
	return f.dot;
});

rt.type(9875, "/obj/item/roller", "/obj/item", {
	w_class: 4,
	name: "roller bed",
	desc: "A collapsed roller bed that can be carried around.",
	icon: rt.rsc("icons/obj/rollerbed.dmi"),
	icon_state: "folded",
});

// bed.dm:108
rt.def("/obj/item/roller/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let R: Value = null;
	if (rt.istype(I, T("/obj/item/roller/robo"))) {
		if ((R = I).loaded) {
			to_chat(user, `<span class='warning'>${R} already has a roller bed loaded!</span>`);
			return f.dot;
		}
		user.visible_message(`<span class='notice'>${user} loads ${this}.</span>`, `<span class='notice'>You load ${this} into ${R}.</span>`);
		R.loaded = (yield* new_(T("/obj/structure/bed/roller"), R));
		yield* qdel(this);
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
}, true);

// bed.dm:120
rt.def("/obj/item/roller/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.deploy_roller(user, user.loc);
	return f.dot;
}, true);

// bed.dm:123
rt.def("/obj/item/roller/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	if (!proximity) {
		return f.dot;
	}
	if (!rt.istype(target, T("/turf/open"))) return f.dot;
	yield* this.deploy_roller(user, target);
	return f.dot;
}, true);

// bed.dm:129
rt.def("/obj/item/roller/proc/deploy_roller", function* deploy_roller(f: Frame, user: Value, location: Value) {
	let R: Value = null;
	yield* (R = (yield* new_(T("/obj/structure/bed/roller"), location))).add_fingerprint(user);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(9876, "/obj/item/roller/robo", "/obj/item/roller", {
	loaded: null,
	name: "roller bed dock",
});

// bed.dm:138
rt.def("/obj/item/roller/robo/proc/New", function* New(f: Frame) {
	this.loaded = (yield* new_(T("/obj/structure/bed/roller"), this));
	this.desc = "A collapsed roller bed that can be ejected for emergency use. Must be collected or replaced after use.";
	yield* parent_proc();
	return f.dot;
}, true);

// bed.dm:143
rt.def("/obj/item/roller/robo/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `The dock is ${this.loaded ? "loaded" : "empty"}`);
	return f.dot;
}, false);

// bed.dm:148
rt.def("/obj/item/roller/robo/proc/deploy_roller", function deploy_roller(f: Frame, user: Value, location: Value) {
	let R: Value = null;
	if (this.loaded) {
		(R = this.loaded).loc = location;
		user.visible_message(`${user} deploys ${this.loaded}.`, `<span class='notice'>You deploy ${this.loaded}.</span>`);
		this.loaded = null;
	} else {
		to_chat(user, "<span class='warning'>The dock is empty!</span>");
	}
	return f.dot;
});

rt.type(12248, "/obj/structure/bed/dogbed", "/obj/structure/bed", {
	owner: null,
	anchored: 0,
	buildstacktype: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	buildstackamount: 10,
	name: "dog bed",
	icon_state: "dogbed",
	desc: "A comfy-looking dog bed. You can even strap your pet in, in case the gravity turns off.",
});

// bed.dm:167
rt.def("/obj/structure/bed/dogbed/proc/update_owner", function update_owner(f: Frame, M: Value) {
	this.owner = M;
	this.name = `${M}'s bed`;
	this.desc = `${M}'s bed! Looks comfy.`;
	return f.dot;
});

// bed.dm:172
rt.def("/obj/structure/bed/dogbed/proc/buckle_mob", function* buckle_mob(f: Frame, M: Value, force: Value, check_loc: Value) {
	f.dot = (yield* parent_proc());
	this.update_owner(M);
	return f.dot;
}, true);
