// Based on /tg/station's code/game/objects/effects/contraband.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6982, "/obj/item/weapon/poster", "/obj/item/weapon", {
	poster_type: null,
	poster_structure: null,
	name: "poorly coded poster",
	desc: "You probably shouldn't be holding this.",
	icon: rt.rsc("icons/obj/contraband.dmi"),
	force: 0,
	resistance_flags: 4,
});

// contraband.dm:16
rt.def("/obj/item/weapon/poster/proc/Initialize", function* Initialize(f: Frame, mapload: Value, new_poster_structure: Value) {
	f.dot = (yield* parent_proc());
	this.poster_structure = new_poster_structure;
	if (!new_poster_structure && this.poster_type) {
		this.poster_structure = (yield* new_(this.poster_type, this));
	}
	if (!this.poster_structure) return f.dot;
	this.name = this.poster_structure.poster_item_name;
	this.desc = this.poster_structure.poster_item_desc;
	this.icon_state = this.poster_structure.poster_item_icon_state;
	this.name = `${this.name} - ${this.poster_structure.original_name}`;
	return f.dot;
}, true);

// contraband.dm:32
rt.def("/obj/item/weapon/poster/proc/Destroy", function* Destroy(f: Frame) {
	this.poster_structure = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(12571, "/obj/structure/sign/poster", "/obj/structure/sign", {
	original_name: null,
	ruined: 0,
	random_basetype: null,
	never_random: 0,
	poster_item_name: "hypothetical poster",
	poster_item_desc: "This hypothetical poster item should not exist, let's be honest here.",
	poster_item_icon_state: "rolled_poster",
	anchored: 1,
	name: "poster",
	desc: "A large piece of space-resistant printed paper.",
	icon: rt.rsc("icons/obj/contraband.dmi"),
});

// contraband.dm:62
rt.def("/obj/structure/sign/poster/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	if (this.random_basetype) {
		this.randomise(this.random_basetype);
	}
	if (this.ruined) return f.dot;
	this.original_name = this.name;
	this.name = `poster - ${this.name}`;
	this.desc = `A large piece of space-resistant printed paper. ${this.desc}`;
	return f.dot;
});

// contraband.dm:71
rt.def("/obj/structure/sign/poster/proc/randomise", function randomise(f: Frame, base_type: Value) {
	let t: Value = null, _T: Value = null, selected: Value = null;
	let poster_types: Value = typesof(base_type) - base_type;
	let approved_types: Value = list();
	for (t of each(poster_types)) {
		if (rt.initial(f, (_T = t), "icon_state") && !rt.initial(f, _T, "never_random")) {
			(approved_types = rt.modify(approved_types, _T, rt.bitOr));
		}
	}
	this.name = rt.initial(f, (selected = pick(approved_types)), "name");
	this.desc = rt.initial(f, selected, "desc");
	this.icon_state = rt.initial(f, selected, "icon_state");
	this.poster_item_name = rt.initial(f, selected, "poster_item_name");
	this.poster_item_desc = rt.initial(f, selected, "poster_item_desc");
	this.poster_item_icon_state = rt.initial(f, selected, "poster_item_icon_state");
	this.ruined = rt.initial(f, selected, "ruined");
	return f.dot;
});

// contraband.dm:90
rt.def("/obj/structure/sign/poster/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (!rt.istype(I, T("/obj/item/weapon/wirecutters"))) return f.dot;
	playsound(this.loc, I.usesound, 100, 1);
	if (this.ruined) {
		to_chat(user, "<span class='notice'>You remove the remnants of the poster.</span>");
		yield* qdel(this);
	} else {
		to_chat(user, "<span class='notice'>You carefully remove the poster from the wall.</span>");
		yield* this.roll_and_drop(user.loc);
	}
	return f.dot;
}, true);

// contraband.dm:102
rt.def("/obj/structure/sign/poster/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let R: Value = null;
	if (this.ruined) {
		return f.dot;
	}
	this.visible_message(`${user} rips ${this} in a single, decisive motion!`);
	playsound(this.loc, rt.rsc("sound/items/poster_ripped.ogg"), 100, 1);
	(R = (yield* new_(T("/obj/structure/sign/poster/ripped"), this.loc))).pixel_y = this.pixel_y;
	R.pixel_x = this.pixel_x;
	yield* R.add_fingerprint(user);
	yield* qdel(this);
	return f.dot;
}, true);

// contraband.dm:114
rt.def("/obj/structure/sign/poster/proc/roll_and_drop", function* roll_and_drop(f: Frame, loc: Value) {
	let _P: Value = null;
	this.pixel_x = 0;
	this.pixel_y = 0;
	yield* this.forceMove((_P = (yield* new_(T("/obj/item/weapon/poster"), loc, this))));
	return _P;
}, true);

// contraband.dm:120
rt.def("/turf/closed/wall/proc/place_poster", function* place_poster(f: Frame, _P: Value, user: Value) {
	let O: Value = null;
	if (!_P.poster_structure) {
		to_chat(user, `<span class='warning'>${_P} has no poster... inside it? Inform a coder!</span>`);
		return f.dot;
	}
	let stuff_on_wall: Value = 0;
	for (O of each(this.contents, T("/obj"))) {
		if (rt.istype(O, T("/obj/structure/sign/poster"))) {
			to_chat(user, "<span class='warning'>The wall is far too cluttered to place a poster!</span>");
			return f.dot;
		}
		stuff_on_wall++;
		if (stuff_on_wall == 3) {
			to_chat(user, "<span class='warning'>The wall is far too cluttered to place a poster!</span>");
			return f.dot;
		}
	}
	to_chat(user, "<span class='notice'>You start placing the poster on the wall...</span>");
	let D: Value = _P.poster_structure;
	let temp_loc: Value = rt.getStep(f, user, 0);
	flick("poster_being_set", D);
	yield* D.forceMove(this);
	yield* qdel(_P);
	playsound(D.loc, rt.rsc("sound/items/poster_being_created.ogg"), 100, 1);
	if (yield* do_after(user, PLACE_SPEED, { target: this })) {
		if (!D || !D || D.gc_destroyed) {
			return f.dot;
		}
		if (rt.istype(this, T("/turf/closed/wall")) && user && user.loc == temp_loc) {
			to_chat(user, "<span class='notice'>You place the poster!</span>");
			return f.dot;
		}
	}
	to_chat(user, "<span class='notice'>The poster falls down!</span>");
	yield* D.roll_and_drop(temp_loc);
	return f.dot;
}, true);
