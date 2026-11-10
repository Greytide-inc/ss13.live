// Based on /tg/station's code/game/objects/structures/displaycase.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12723, "/obj/structure/displaycase", "/obj/structure", {
	showpiece: null,
	alert: 1,
	open: 0,
	openable: 1,
	electronics: null,
	start_showpiece_type: null,
	anchored: 1,
	name: "display case",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "glassbox0",
	desc: "A display case for prized possessions.",
	density: 1,
	resistance_flags: 32,
	armor: null,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 50,
});

// displaycase.dm:9
rt.def("/obj/structure/displaycase/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 0, "laser", 0, "energy", 0, "bomb", 10, "bio", 0, "rad", 0, "fire", 70, "acid", 100]);
	return f.dot;
});

// displaycase.dm:21
rt.def("/obj/structure/displaycase/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.start_showpiece_type) {
		this.showpiece = (yield* new_(this.start_showpiece_type, this));
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// displaycase.dm:28
rt.def("/obj/structure/displaycase/proc/Destroy", function* Destroy(f: Frame) {
	if (this.electronics) {
		yield* qdel(this.electronics);
		this.electronics = null;
	}
	if (this.showpiece) {
		yield* qdel(this.showpiece);
		this.showpiece = null;
	}
	return (yield* parent_proc());
}, true);

// displaycase.dm:34
rt.def("/obj/structure/displaycase/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.alert) {
		to_chat(user, "<span class='notice'>Hooked up with an anti-theft system.</span>");
	}
	if (!this.showpiece) return f.dot;
	to_chat(user, `<span class='notice'>There's ${this.showpiece} inside.</span>`);
	return f.dot;
}, false);

// displaycase.dm:43
rt.def("/obj/structure/displaycase/proc/dump", function* dump(f: Frame) {
	if (!this.showpiece) return f.dot;
	yield* this.showpiece.forceMove(this.loc);
	this.showpiece = null;
	return f.dot;
}, true);

// displaycase.dm:47
rt.def("/obj/structure/displaycase/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		playsound(this.loc, rt.rsc("sound/effects/glasshit.ogg"), 75, 1);
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// displaycase.dm:54
rt.def("/obj/structure/displaycase/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* this.dump();
		if (!disassembled) {
			yield* new_(T("/obj/item/weapon/shard"), this.loc);
			yield* this.trigger_alarm();
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// displaycase.dm:62
rt.def("/obj/structure/displaycase/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	if (!(!this.broken && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	this.density = 0;
	this.broken = 1;
	yield* new_(T("/obj/item/weapon/shard"), this.loc);
	playsound(this, "shatter", 70, 1);
	yield* this.update_icon();
	yield* this.trigger_alarm();
	return f.dot;
}, true);

// displaycase.dm:73
rt.def("/obj/structure/displaycase/proc/trigger_alarm", function* trigger_alarm(f: Frame) {
	let alarmed: Value = null;
	if (!this.alert) return f.dot;
	yield* (alarmed = get_area(this)).burglaralert(this);
	playsound(this, rt.rsc("sound/effects/alert.ogg"), 50, 1);
	return f.dot;
}, true);

// displaycase.dm:82
rt.def("/obj/structure/displaycase/proc/is_directional", function is_directional(f: Frame, A: Value) {
	rt.tryOpen(f);
	try {
		getFlatIcon(A, { defdir: 4 });
		rt.tryClose(f);
	} catch ($err) {
		rt.catchValue(f, $err);
		return 0;
	}
	return 1;
});

// displaycase.dm:92
rt.def("/obj/structure/displaycase/proc/get_flat_icon_directional", function* get_flat_icon_directional(f: Frame, A: Value) {
	let I: Value = null, old_dir: Value = null;
	if (this.is_directional(A)) {
		I = getFlatIcon(A);
	} else {
		old_dir = A.dir;
		yield* A.setDir(2);
		I = getFlatIcon(A);
		yield* A.setDir(old_dir);
	}
	return I;
}, true);

// displaycase.dm:104
rt.def("/obj/structure/displaycase/proc/update_icon", function* update_icon(f: Frame) {
	let I: Value = null, S: Value = null;
	if (this.open) {
		I = icon(rt.rsc("icons/obj/stationobjs.dmi"), "glassbox_open");
	} else {
		I = icon(rt.rsc("icons/obj/stationobjs.dmi"), "glassbox0");
	}
	if (this.broken) {
		I = icon(rt.rsc("icons/obj/stationobjs.dmi"), "glassboxb0");
	}
	if (this.showpiece) {
		(S = (yield* this.get_flat_icon_directional(this.showpiece))).Scale(17, 17);
		I.Blend(S, 6, 8, 8);
	}
	this.icon = I;
	return f.dot;
}, true);

// displaycase.dm:117
rt.def("/obj/structure/displaycase/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null, G: Value = null;
	if (W.GetID() && !this.broken && this.openable) {
		if (yield* this.allowed(user)) {
			to_chat(user, `<span class='notice'>You ${this.open ? "close" : "open"} the ${this}</span>`);
			yield* this.toggle_lock(user);
		} else {
			to_chat(user, "<span class='warning'>Access denied.</span>");
		}
	} else if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && user.a_intent == "help" && !this.broken) {
		WT = W;
		if (this.obj_integrity < this.max_integrity && (yield* WT.remove_fuel(5, user))) {
			to_chat(user, `<span class='notice'>You begin repairing ${this}.</span>`);
			playsound(this.loc, WT.usesound, 40, 1);
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				this.obj_integrity = this.max_integrity;
				playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
				yield* this.update_icon();
				to_chat(user, `<span class='notice'>You repair ${this}.</span>`);
			}
		} else {
			to_chat(user, `<span class='warning'>${this} is already in good condition!</span>`);
		}
		return f.dot;
	} else if (!this.alert && rt.istype(W, T("/obj/item/weapon/crowbar")) && this.openable) {
		if (this.broken) {
			if (this.showpiece) {
				to_chat(user, "<span class='notice'>Remove the displayed object first.</span>");
			} else {
				to_chat(user, "<span class='notice'>You remove the destroyed case</span>");
				yield* qdel(this);
			}
		} else {
			to_chat(user, `<span class='notice'>You start to ${this.open ? "close" : "open"} the ${this}</span>`);
			if (yield* do_after(user, 20 * W.toolspeed, { target: this })) {
				to_chat(user, `<span class='notice'>You ${this.open ? "close" : "open"} the ${this}</span>`);
				yield* this.toggle_lock(user);
			}
		}
	} else if (this.open && !this.showpiece) {
		if (yield* user.transferItemToLoc(W, this)) {
			this.showpiece = W;
			to_chat(user, `<span class='notice'>You put ${W} on display</span>`);
			yield* this.update_icon();
		}
	} else if (rt.istype(W, T("/obj/item/stack/sheet/glass")) && this.broken) {
		if ((G = W).get_amount() < 2) {
			to_chat(user, "<span class='warning'>You need two glass sheets to fix the case!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start fixing ${this}...</span>`);
		if (yield* do_after(user, 20, { target: this })) {
			yield* G.use(2);
			this.broken = 0;
			this.obj_integrity = this.max_integrity;
			yield* this.update_icon();
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// displaycase.dm:168
rt.def("/obj/structure/displaycase/proc/toggle_lock", function* toggle_lock(f: Frame, user: Value) {
	this.open = (!this.open ? 1 : 0);
	yield* this.update_icon();
	return f.dot;
}, true);

// displaycase.dm:172
rt.def("/obj/structure/displaycase/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// displaycase.dm:175
rt.def("/obj/structure/displaycase/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	user.changeNext_move(8);
	if (this.showpiece && (this.broken || this.open)) {
		to_chat(user, "<span class='notice'>You deactivate the hover field built into the case.</span>");
		yield* this.dump();
		yield* this.add_fingerprint(user);
		yield* this.update_icon();
		return f.dot;
	} else {
		if (!this.Adjacent(user)) {
			return f.dot;
		}
		user.visible_message(`<span class='danger'>${user} kicks the display case.</span>`, null, null, 3);
		yield* user.do_attack_animation(this, "kick");
		yield* this.take_damage(2);
	}
	return f.dot;
}, true);

rt.type(12727, "/obj/structure/displaycase_chassis", "/obj/structure", {
	electronics: null,
	anchored: 1,
	density: 0,
	name: "display case chassis",
	desc: "wooden base of display case",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "glassbox_chassis",
});

// displaycase.dm:203
rt.def("/obj/structure/displaycase_chassis/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let G: Value = null, display: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
		to_chat(user, `<span class='notice'>You start disassembling ${this}...</span>`);
		playsound(this.loc, I.usesound, 50, 1);
		if (yield* do_after(user, 30 * I.toolspeed, { target: this })) {
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			yield* new_(T("/obj/item/stack/sheet/mineral/wood"), rt.getStep(f, this, 0), 5);
			yield* qdel(this);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/electronics/airlock"))) {
		to_chat(user, `<span class='notice'>You start installing the electronics into ${this}...</span>`);
		playsound(this.loc, I.usesound, 50, 1);
		if ((yield* do_after(user, 30, { target: this })) && (yield* user.transferItemToLoc(I, this))) {
			this.electronics = I;
			to_chat(user, "<span class='notice'>You install the airlock electronics.</span>");
		}
	} else if (rt.istype(I, T("/obj/item/stack/sheet/glass"))) {
		if ((G = I).get_amount() < 10) {
			to_chat(user, "<span class='warning'>You need ten glass sheets to do this!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start adding ${G} to ${this}...</span>`);
		if (yield* do_after(user, 20, { target: this })) {
			yield* G.use(10);
			display = (yield* new_(T("/obj/structure/displaycase"), this.loc));
			if (this.electronics) {
				this.electronics.loc = display;
				display.electronics = this.electronics;
				if (this.electronics.one_access) {
					display.req_one_access = this.electronics.accesses;
				} else {
					display.req_access = this.electronics.accesses;
				}
			}
			yield* qdel(this);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(12724, "/obj/structure/displaycase/captain", "/obj/structure/displaycase", {
	alert: 1,
	start_showpiece_type: rt.typePath("/obj/item/weapon/gun/energy/laser/captain"),
	req_access: null,
});

// displaycase.dm:243
rt.def("/obj/structure/displaycase/captain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(103);
	return f.dot;
});

rt.type(12725, "/obj/structure/displaycase/labcage", "/obj/structure/displaycase", {
	start_showpiece_type: rt.typePath("/obj/item/clothing/mask/facehugger/lamarr"),
	name: "lab cage",
	desc: "A glass lab container for storing interesting creatures.",
	req_access: null,
});

// displaycase.dm:249
rt.def("/obj/structure/displaycase/labcage/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(30);
	return f.dot;
});

rt.type(12726, "/obj/structure/displaycase/trophy", "/obj/structure/displaycase", {
	trophy_message: "",
	placer_key: "",
	added_roundstart: 1,
	is_locked: 1,
	alert: 1,
	openable: 0,
	name: "trophy display case",
	desc: "Store your trophies of accomplishment in here, and they will stay forever.",
	integrity_failure: 0,
});

// displaycase.dm:266
rt.def("/obj/structure/displaycase/trophy/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.trophy_cases += this;
	return f.dot;
}, true);

// displaycase.dm:270
rt.def("/obj/structure/displaycase/trophy/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.trophy_cases -= this;
	return (yield* parent_proc());
}, true);

// displaycase.dm:274
rt.def("/obj/structure/displaycase/trophy/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.trophy_message) return f.dot;
	to_chat(user, "The plaque reads:");
	to_chat(user, this.trophy_message);
	return f.dot;
}, false);

// displaycase.dm:281
rt.def("/obj/structure/displaycase/trophy/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let a: Value = null, chosen_plaque: Value = null;
	let $e: any;
	if (!user.Adjacent(this)) {
		return f.dot;
	}
	if (user.a_intent == "harm") {
		return (yield* parent_proc());
	}
	if (user.is_holding_item_of_type(T("/obj/item/key/displaycase"))) {
		if (this.added_roundstart) {
			this.is_locked = (!this.is_locked ? 1 : 0);
			to_chat(user, `You ${!this.is_locked ? "un" : ""}lock the case.`);
		} else {
			to_chat(user, "<span class='danger'>The lock is stuck shut!</span>");
		}
		return f.dot;
	}
	if (this.is_locked) {
		to_chat(user, "<span class='danger'>The case is shut tight with an old fashioned physical lock. Maybe you should ask the curator for the key?</span>");
		return f.dot;
	}
	if (!this.added_roundstart) {
		to_chat(user, "You've already put something new in this case.");
		return f.dot;
	}
	if (is_type_in_typecache(W, GLOB.blacklisted_cargo_types)) {
		to_chat(user, `<span class='danger'>The case rejects the ${W}.</span>`);
		return f.dot;
	}
	for (a of each(W.GetAllContents())) {
		if (is_type_in_typecache(a, GLOB.blacklisted_cargo_types)) {
			to_chat(user, `<span class='danger'>The case rejects the ${W}.</span>`);
			return f.dot;
		}
	}
	if (yield* user.transferItemToLoc(W, this)) {
		if (this.showpiece) {
			to_chat(user, `You press a button, and ${this.showpiece} descends into the floor of the case.`);
			yield* qdel(this.showpiece);
			this.showpiece = null;
		}
		to_chat(user, `You insert ${W} into the case.`);
		this.showpiece = W;
		this.added_roundstart = 0;
		yield* this.update_icon();
		this.placer_key = user.ckey;
		this.trophy_message = W.desc;
		if (chosen_plaque = (yield* stripped_input(user, "What would you like the plaque to say? Default value is item's description.", "Trophy Plaque"))) {
			if (user.Adjacent(this)) {
				this.trophy_message = chosen_plaque;
				to_chat(user, "You set the plaque's text.");
			} else {
				to_chat(user, "You are too far to set the plaque's text.");
			}
		}
		GLOB.SSpersistence.SaveTrophy(this);
		return 1;
	} else {
		to_chat(user, fmt("<span class='warning'>＄！ is stuck to your hand, you can't put it in the ＀!</span>", [W, this.name]));
	}
	return f.dot;
}, true);

// displaycase.dm:345
rt.def("/obj/structure/displaycase/trophy/proc/dump", function* dump(f: Frame) {
	if (!this.showpiece) return f.dot;
	if (this.added_roundstart) {
		this.visible_message(`<span class='danger'>The ${this.showpiece} crumbles to dust!</span>`);
		yield* new_(T("/obj/effect/decal/cleanable/ash"), this.loc);
		yield* qdel(this.showpiece);
		this.showpiece = null;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(9872, "/obj/item/showpiece_dummy", "/obj/item", {
	name: "Cheap replica",
});

// displaycase.dm:359
rt.def("/obj/item/showpiece_dummy/proc/Initialize", function* Initialize(f: Frame, mapload: Value, path: Value) {
	let I: Value = null;
	f.dot = (yield* parent_proc());
	this.name = rt.initial(f, (I = path), "name");
	this.icon = rt.initial(f, I, "icon");
	this.icon_state = rt.initial(f, I, "icon_state");
	return f.dot;
}, true);
