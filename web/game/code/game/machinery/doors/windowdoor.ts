// Based on /tg/station's code/game/machinery/doors/windowdoor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10267, "/obj/machinery/door/window", "/obj/machinery/door", {
	base_state: "left",
	electronics: null,
	reinf: 0,
	shards: 2,
	rods: 2,
	cable: 2,
	debris: null,
	flags: 512,
	CanAtmosPass: -1,
	name: "interior door",
	desc: "A strong door.",
	icon: rt.rsc("icons/obj/doors/windoor.dmi"),
	icon_state: "left",
	layer: 3.3,
	closingLayer: 3.3,
	resistance_flags: 32,
	obj_integrity: 150,
	max_integrity: 150,
	integrity_failure: 0,
	armor: null,
	visible: 0,
	opacity: 0,
});

// windowdoor.dm:23
rt.def("/obj/machinery/door/window/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.debris = list();
	this.armor = rt.alist(f, ["melee", 20, "bullet", 50, "laser", 50, "energy", 50, "bomb", 10, "bio", 100, "rad", 100, "fire", 70, "acid", 100]);
	return f.dot;
});

// windowdoor.dm:26
rt.def("/obj/machinery/door/window/proc/New", function* New(f: Frame, loc: Value, set_dir: Value) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	if (set_dir) {
		yield* this.setDir(set_dir);
	}
	if (this.req_access && rt.len(f, this.req_access)) {
		this.icon_state = `${this.icon_state}`;
		this.base_state = this.icon_state;
	}
	rt.forRange(f, 0, 1, this.shards, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		this.debris += (yield* new_(T("/obj/item/weapon/shard"), this));
	}
	rt.endFor(f, 0);
	if (this.rods) {
		this.debris += (yield* new_(T("/obj/item/stack/rods"), this, this.rods));
	}
	if (!this.cable) return f.dot;
	this.debris += (yield* new_(T("/obj/item/stack/cable_coil"), this, this.cable));
	return f.dot;
}, true);

// windowdoor.dm:41
rt.def("/obj/machinery/door/window/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	this.density = 0;
	for (I of each(this.debris)) {
		yield* qdel(I);
	}
	if (this.obj_integrity == 0) {
		playsound(this, "shatter", 70, 1);
	}
	this.electronics = null;
	return (yield* parent_proc());
}, true);

// windowdoor.dm:50
rt.def("/obj/machinery/door/window/proc/update_icon", function update_icon(f: Frame) {
	if (this.density) {
		this.icon_state = this.base_state;
	} else {
		this.icon_state = `${this.base_state}open`;
	}
	return f.dot;
});

// windowdoor.dm:55
rt.def("/obj/machinery/door/window/proc/open_and_close", function* open_and_close(f: Frame) {
	yield* this.open();
	if (this.check_access(null)) {
		yield* sleep(50);
	} else {
		yield* sleep(20);
	}
	yield* this.close();
	return f.dot;
}, true);

// windowdoor.dm:63
rt.def("/obj/machinery/door/window/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let mecha: Value = null, M: Value = null;
	if (this.operating || !this.density) {
		return f.dot;
	}
	if (!ismob(AM)) {
		if (rt.istype(AM, T("/obj/mecha"))) {
			if ((mecha = AM).occupant && (yield* this.allowed(mecha.occupant))) {
				yield* this.open_and_close();
			} else {
				yield* this.do_animate("deny");
			}
		}
		return f.dot;
	}
	if (!GLOB.SSticker) {
		return f.dot;
	}
	if ((M = AM).restrained() || (rt.istype(M, T("/mob/living/simple_animal/drone")) || rt.istype(M, T("/mob/living/silicon/robot"))) && M.stat) {
		return f.dot;
	}
	yield* this.bumpopen(M);
	return f.dot;
}, true);

// windowdoor.dm:81
rt.def("/obj/machinery/door/window/proc/bumpopen", function* bumpopen(f: Frame, user: Value) {
	if (this.operating || !this.density) {
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	if (!this.requiresID()) {
		user = null;
	}
	if (yield* this.allowed(user)) {
		yield* this.open_and_close();
	} else {
		yield* this.do_animate("deny");
	}
	return f.dot;
}, true);

// windowdoor.dm:94
rt.def("/obj/machinery/door/window/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let W: Value = null;
	height ??= 0;
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(2)) {
		return 1;
	}
	if (rt.getDir(f, this.loc, target) == this.dir) {
		return (!this.density ? 1 : 0);
	}
	if (rt.istype(mover, T("/obj/structure/window"))) {
		W = mover;
		if (!valid_window_location(this.loc, W.ini_dir)) {
			return 0;
		}
	} else if (rt.istype(mover, T("/obj/structure/windoor_assembly"))) {
		W = mover;
		if (!valid_window_location(this.loc, W.ini_dir)) {
			return 0;
		}
	} else if (rt.istype(mover, T("/obj/machinery/door/window")) && !valid_window_location(this.loc, mover.dir)) {
		return 0;
	} else {
		return 1;
	}
	return f.dot;
});

// windowdoor.dm:112
rt.def("/obj/machinery/door/window/proc/CanAtmosPass", function CanAtmosPass(f: Frame, _T: Value) {
	if (rt.getDir(f, this.loc, _T) == this.dir) {
		return (!this.density ? 1 : 0);
	}
	return 1;
});

// windowdoor.dm:119
rt.def("/obj/machinery/door/window/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, to_dir: Value) {
	return (((!this.density ? 1 : 0) || (this.dir != to_dir ? 1 : 0)) || (this.check_access(ID) && this.hasPower()));
});

// windowdoor.dm:122
rt.def("/obj/machinery/door/window/proc/CheckExit", function CheckExit(f: Frame, mover: Value, target: Value) {
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(2)) {
		return 1;
	}
	if (rt.getDir(f, this.loc, target) == this.dir) {
		return (!this.density ? 1 : 0);
	}
	return 1;
});

// windowdoor.dm:130
rt.def("/obj/machinery/door/window/proc/open", function* open(f: Frame, forced: Value) {
	forced ??= 0;
	if (this.operating == 1) {
		return 0;
	}
	if (!forced) {
		if (!this.hasPower()) {
			return 0;
		}
	}
	if (forced < 2) {
		if (this.emagged) {
			return 0;
		}
	}
	if (!this.operating) {
		this.operating = 1;
	}
	yield* this.do_animate("opening");
	playsound(this.loc, rt.rsc("sound/machines/windowdoor.ogg"), 100, 1);
	this.icon_state = `${this.base_state}open`;
	yield* sleep(10);
	this.density = 0;
	this.air_update_turf(1);
	this.update_freelook_sight();
	if (this.operating == 1) {
		this.operating = 0;
	}
	return 1;
}, true);

// windowdoor.dm:155
rt.def("/obj/machinery/door/window/proc/close", function* close(f: Frame, forced: Value) {
	forced ??= 0;
	if (this.operating) {
		return 0;
	}
	if (!forced) {
		if (!this.hasPower()) {
			return 0;
		}
	}
	if (forced < 2) {
		if (this.emagged) {
			return 0;
		}
	}
	this.operating = 1;
	yield* this.do_animate("closing");
	playsound(this.loc, rt.rsc("sound/machines/windowdoor.ogg"), 100, 1);
	this.icon_state = this.base_state;
	this.density = 1;
	this.air_update_turf(1);
	this.update_freelook_sight();
	yield* sleep(10);
	this.operating = 0;
	return 1;
}, true);

// windowdoor.dm:177
rt.def("/obj/machinery/door/window/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		playsound(this.loc, rt.rsc("sound/effects/glasshit.ogg"), 90, 1);
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// windowdoor.dm:185
rt.def("/obj/machinery/door/window/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let fragment: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT) && !disassembled) {
		for (fragment of each(this.debris, T("/obj"))) {
			yield* fragment.forceMove(rt.getStep(f, this, 0));
			this.transfer_fingerprints_to(fragment);
			this.debris -= fragment;
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// windowdoor.dm:193
rt.def("/obj/machinery/door/window/proc/narsie_act", function narsie_act(f: Frame) {
	this.add_atom_colour("#7D1919", FIXED_COLOUR_PRIORITY);
	return f.dot;
});

// windowdoor.dm:196
rt.def("/obj/machinery/door/window/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* new_(T("/obj/machinery/door/window/clockwork"), this.loc, this.dir);
	yield* qdel(this);
	return f.dot;
}, true);

// windowdoor.dm:200
rt.def("/obj/machinery/door/window/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	let $0: any = exposed_temperature;
	let $1: any = T0C;
	if ($0 > $1 + (this.reinf ? 1600 : 800)) {
		yield* this.take_damage(round(exposed_volume / 200), "fire", 0, 0);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// windowdoor.dm:206
rt.def("/obj/machinery/door/window/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// windowdoor.dm:209
rt.def("/obj/machinery/door/window/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	if (!(!this.operating && this.density && !this.emagged)) return f.dot;
	this.operating = 1;
	flick(`${this.base_state}spark`, this);
	yield* sleep(6);
	this.operating = 0;
	this.desc += "<BR><span class='warning'>Its access panel is smoking slightly.</span>";
	yield* this.open();
	this.emagged = 1;
	return f.dot;
}, true);

// windowdoor.dm:223
rt.def("/obj/machinery/door/window/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let WA: Value = null, ae: Value = null;
	let $0: any, $1: any;
	if (this.operating) {
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
			if (this.density || this.operating) {
				to_chat(user, "<span class='warning'>You need to open the door to access the maintenance panel!</span>");
				return f.dot;
			}
			playsound(this.loc, I.usesound, 50, 1);
			this.panel_open = (!this.panel_open ? 1 : 0);
			$0 = user;
			if (this.panel_open) {
				$1 = "open";
			} else {
				$1 = "close";
			}
			to_chat($0, `<span class='notice'>You ${$1} the maintenance panel of the ${this.name}.</span>`);
			return f.dot;
		}
		if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
			if (this.panel_open && !this.density && !this.operating) {
				playsound(this.loc, I.usesound, 100, 1);
				user.visible_message(`${user} removes the electronics from the ${this.name}.`, `<span class='notice'>You start to remove electronics from the ${this.name}...</span>`);
				if (yield* do_after(user, 40 * I.toolspeed, { target: this })) {
					if (this.panel_open && !this.density && !this.operating && this.loc) {
						WA = (yield* new_(T("/obj/structure/windoor_assembly"), this.loc));
						if (this.base_state === "left") {
							WA.facing = "l";
						} else if (this.base_state === "right") {
							WA.facing = "r";
						} else if (this.base_state === "leftsecure") {
							WA.facing = "l";
							WA.secure = 1;
						} else if (this.base_state === "rightsecure") {
							WA.facing = "r";
							WA.secure = 1;
						}
						WA.anchored = 1;
						WA.state = "02";
						yield* WA.setDir(this.dir);
						WA.ini_dir = this.dir;
						yield* WA.update_icon();
						WA.created_name = this.name;
						if (this.emagged) {
							to_chat(user, "<span class='warning'>You discard the damaged electronics.</span>");
							yield* qdel(this);
							return f.dot;
						}
						to_chat(user, "<span class='notice'>You remove the airlock electronics.</span>");
						if (!this.electronics) {
							ae = (yield* new_(T("/obj/item/weapon/electronics/airlock"), this.loc));
							if (this.req_one_access) {
								ae.one_access = 1;
								ae.accesses = this.req_one_access;
							} else {
								ae.accesses = this.req_access;
							}
						} else {
							ae = this.electronics;
							this.electronics = null;
							ae.loc = this.loc;
						}
						yield* qdel(this);
					}
				}
				return f.dot;
			}
		}
	}
	return (yield* parent_proc());
}, true);

// windowdoor.dm:285
rt.def("/obj/machinery/door/window/proc/try_to_crowbar", function* try_to_crowbar(f: Frame, I: Value, user: Value) {
	if (!this.hasPower()) {
		if (this.density) {
			yield* this.open(2);
		} else {
			yield* this.close(2);
		}
	} else {
		to_chat(user, "<span class='warning'>The door's motors resist your efforts to force it!</span>");
	}
	return f.dot;
}, true);

// windowdoor.dm:294
rt.def("/obj/machinery/door/window/proc/do_animate", function do_animate(f: Frame, animation: Value) {
	if (animation === "opening") {
		flick(`${this.base_state}opening`, this);
	} else if (animation === "closing") {
		flick(`${this.base_state}closing`, this);
	} else if (animation === "deny") {
		flick(`${this.base_state}deny`, this);
	}
	return f.dot;
});

rt.type(10268, "/obj/machinery/door/window/clockwork", "/obj/machinery/door/window", {
	made_glow: 0,
	name: "brass windoor",
	desc: "A thin door with translucent brass paneling.",
	icon_state: "clockwork",
	base_state: "clockwork",
	shards: 0,
	rods: 0,
	resistance_flags: 34,
});

// windowdoor.dm:324
rt.def("/obj/machinery/door/window/clockwork/proc/New", function* New(f: Frame, loc: Value, set_dir: Value) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		this.debris += (yield* new_(T("/obj/item/clockwork/alloy_shards/medium/gear_bit/large"), this));
	}
	rt.endFor(f, 0);
	change_construction_value(2);
	return f.dot;
}, true);

// windowdoor.dm:330
rt.def("/obj/machinery/door/window/clockwork/proc/setDir", function* setDir(f: Frame, direct: Value) {
	let E: Value = null;
	if (!this.made_glow) {
		yield* (E = (yield* new_(T("/obj/effect/temp_visual/ratvar/door/window"), rt.getStep(f, this, 0)))).setDir(direct);
		this.made_glow = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// windowdoor.dm:337
rt.def("/obj/machinery/door/window/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	change_construction_value(-2);
	return (yield* parent_proc());
}, true);

// windowdoor.dm:341
rt.def("/obj/machinery/door/window/clockwork/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!prob(80 / severity)) return f.dot;
	yield* this.open();
	return f.dot;
}, true);

// windowdoor.dm:346
rt.def("/obj/machinery/door/window/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (!GLOB.ratvar_awakens) return f.dot;
	this.obj_integrity = this.max_integrity;
	return f.dot;
});

// windowdoor.dm:352
rt.def("/obj/machinery/door/window/clockwork/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* this.take_damage(rand(30, 60), "brute");
	if (!this) return f.dot;
	let previouscolor: Value = this.color;
	this.color = "#960000";
	rt.op(f, "Animate", [2, 6], [null, this, "color", previouscolor, "time", 8]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
	return f.dot;
}, true);

// windowdoor.dm:360
rt.def("/obj/machinery/door/window/clockwork/proc/allowed", function allowed(f: Frame, M: Value) {
	if (is_servant_of_ratvar(M)) {
		return 1;
	}
	return 0;
});
