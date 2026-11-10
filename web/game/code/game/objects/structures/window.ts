// Based on /tg/station's code/game/objects/structures/window.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(12207, "/obj/structure/window", "/obj/structure", {
	ini_dir: null,
	state: 0,
	reinf: 0,
	heat_resistance: 800,
	decon_speed: 30,
	wtype: "glass",
	fulltile: 0,
	glass_type: rt.typePath("/obj/item/stack/sheet/glass"),
	glass_amount: 1,
	crack_overlay: null,
	debris: null,
	real_explosion_block: null,
	breaksound: "shatter",
	hitsound: rt.rsc("sound/effects/glasshit.ogg"),
	pressure_resistance: 405.3,
	anchored: 1,
	flags: 512,
	can_be_unanchored: 1,
	CanAtmosPass: -1,
	name: "window",
	desc: "A window.",
	icon_state: "window",
	density: 1,
	layer: 3.2,
	max_integrity: 25,
	obj_integrity: 25,
	resistance_flags: 32,
	armor: null,
});

// window.dm:22
rt.def("/obj/structure/window/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.debris = list();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 100]);
	return f.dot;
});

// window.dm:32
rt.def("/obj/structure/window/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.reinf) {
		if (this.anchored && this.state == WINDOW_SCREWED_TO_FRAME) {
			to_chat(user, "<span class='notice'>The window is <b>screwed</b> to the frame.</span>");
		} else if (this.anchored && this.state == WINDOW_IN_FRAME) {
			to_chat(user, "<span class='notice'>The window is <i>unscrewed</i> but <b>pried</b> into the frame.</span>");
		} else if (this.anchored && this.state == WINDOW_OUT_OF_FRAME) {
			to_chat(user, "<span class='notice'>The window is out of the frame, but could be <i>pried</i> in. It is <b>screwed</b> to the floor.</span>");
		} else if (!this.anchored) {
			to_chat(user, "<span class='notice'>The window is <i>unscrewed</i> from the floor, and could be deconstructed by <b>wrenching</b>.</span>");
		}
	} else if (this.anchored) {
		to_chat(user, "<span class='notice'>The window is <b>screwed</b> to the floor.</span>");
	} else {
		to_chat(user, "<span class='notice'>The window is <i>unscrewed</i> from the floor, and could be deconstructed by <b>wrenching</b>.</span>");
	}
	if (this.anchored) return f.dot;
	to_chat(user, "<span class='notice'>Alt-click to rotate it clockwise.</span>");
	return f.dot;
}, false);

// window.dm:52
rt.def("/obj/structure/window/proc/Initialize", function* Initialize(f: Frame, mapload: Value, direct: Value) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	this.obj_integrity = this.max_integrity;
	if (direct) {
		yield* this.setDir(direct);
	}
	if (this.reinf && this.anchored) {
		this.state = WINDOW_SCREWED_TO_FRAME;
	}
	this.ini_dir = this.dir;
	this.air_update_turf(1);
	let shards: Value = 1;
	if (this.fulltile) {
		shards++;
		yield* this.setDir();
	}
	let rods: Value = 0;
	if (this.reinf) {
		rods++;
		if (this.fulltile) {
			rods++;
		}
	}
	rt.forRange(f, 0, 1, shards, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		this.debris += (yield* new_(T("/obj/item/weapon/shard"), this));
	}
	rt.endFor(f, 0);
	if (rods) {
		this.debris += (yield* new_(T("/obj/item/stack/rods"), this, rods));
	}
	this.real_explosion_block = this.explosion_block;
	this.explosion_block = -1;
	return f.dot;
}, true);

// window.dm:84
rt.def("/obj/structure/window/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	if (the_rcd.mode === RCD_DECONSTRUCT) {
		return rt.alist(f, ["mode", RCD_DECONSTRUCT, "delay", 20, "cost", 5]);
	}
	return 0;
});

// window.dm:90
rt.def("/obj/structure/window/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value) {
	if (the_rcd.mode === RCD_DECONSTRUCT) {
		to_chat(user, "<span class='notice'>You deconstruct the window.</span>");
		yield* qdel(this);
		return 1;
	}
	return 0;
}, true);

// window.dm:98
rt.def("/obj/structure/window/proc/narsie_act", function narsie_act(f: Frame) {
	let shard: Value = null;
	this.add_atom_colour("#7D1919", FIXED_COLOUR_PRIORITY);
	for (shard of each(this.debris, T("/obj/item/weapon/shard"))) {
		shard.add_atom_colour("#7D1919", FIXED_COLOUR_PRIORITY);
	}
	return f.dot;
});

// window.dm:103
rt.def("/obj/structure/window/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (!this.fulltile) {
		yield* new_(T("/obj/structure/window/reinforced/clockwork"), rt.getStep(f, this, 0), this.dir);
	} else {
		yield* new_(T("/obj/structure/window/reinforced/clockwork/fulltile"), rt.getStep(f, this, 0));
	}
	yield* qdel(this);
	return f.dot;
}, true);

// window.dm:110
rt.def("/obj/structure/window/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (!(current_size >= STAGE_FIVE)) return f.dot;
	yield* this.deconstruct(0);
	return f.dot;
}, true);

// window.dm:114
rt.def("/obj/structure/window/proc/setDir", function setDir(f: Frame, direct: Value) {
	if (!this.fulltile) {
		parent_proc();
	} else {
		parent_proc(5);
	}
	return f.dot;
}, false);

// window.dm:120
rt.def("/obj/structure/window/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let W: Value = null;
	height ??= 0;
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(2)) {
		return 1;
	}
	if (this.dir == 5) {
		return 0;
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
	}
	return 1;
});

// window.dm:139
rt.def("/obj/structure/window/proc/CheckExit", function CheckExit(f: Frame, O: Value, target: Value) {
	if (rt.istype(O, T("/atom/movable")) && O.checkpass(2)) {
		return 1;
	}
	if (rt.getDir(f, O.loc, target) == this.dir) {
		return 0;
	}
	return 1;
});

// window.dm:146
rt.def("/obj/structure/window/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	user.changeNext_move(8);
	user.visible_message(`<span class='notice'>Something knocks on ${this}.</span>`);
	yield* this.add_fingerprint(user);
	playsound(this, rt.rsc("sound/effects/glassknock.ogg"), 50, 1);
	return f.dot;
}, true);

// window.dm:152
rt.def("/obj/structure/window/proc/attack_hulk", function* attack_hulk(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!(yield* this.can_be_reached(f.args[0]))) {
		return 1;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["user", "does_attack_animation"] });

// window.dm:157
rt.def("/obj/structure/window/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!(yield* this.can_be_reached(user))) {
		return f.dot;
	}
	user.changeNext_move(8);
	user.visible_message(`${user} knocks on ${this}.`);
	yield* this.add_fingerprint(user);
	playsound(this, rt.rsc("sound/effects/glassknock.ogg"), 50, 1);
	return f.dot;
}, true);

// window.dm:165
rt.def("/obj/structure/window/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// window.dm:169
rt.def("/obj/structure/window/proc/attack_generic", function* attack_generic(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = "brute";
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = 1;
	}
	if (!(yield* this.can_be_reached(f.args[0]))) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["user", "damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// window.dm:174
rt.def("/obj/structure/window/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let WT: Value = null, G: Value = null;
	let $0: any, $1: any;
	if (!(yield* this.can_be_reached(user))) {
		return 1;
	}
	yield* this.add_fingerprint(user);
	if (rt.istype(I, T("/obj/item/weapon/weldingtool")) && user.a_intent == "help") {
		WT = I;
		if (this.obj_integrity < this.max_integrity) {
			if (yield* WT.remove_fuel(0, user)) {
				to_chat(user, `<span class='notice'>You begin repairing ${this}...</span>`);
				playsound(this, WT.usesound, 40, 1);
				if (yield* do_after(user, 40 * I.toolspeed, { target: this })) {
					this.obj_integrity = this.max_integrity;
					playsound(this, rt.rsc("sound/items/welder2.ogg"), 50, 1);
					this.update_nearby_icons();
					to_chat(user, `<span class='notice'>You repair ${this}.</span>`);
				}
			}
		} else {
			to_chat(user, `<span class='warning'>${this} is already in good condition!</span>`);
		}
		return f.dot;
	}
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
			playsound(this, I.usesound, 75, 1);
			if (this.reinf) {
				if (this.state == WINDOW_SCREWED_TO_FRAME || this.state == WINDOW_IN_FRAME) {
					$0 = user;
					if (this.state == WINDOW_SCREWED_TO_FRAME) {
						$1 = "unscrew the window from";
					} else {
						$1 = "screw the window to";
					}
					to_chat($0, `<span class='notice'>You begin to ${$1} the frame...</span>`);
					if (yield* do_after(user, this.decon_speed * I.toolspeed, { target: this, extra_checks: (yield* new_(T("/datum/callback"), this, P("/obj/structure/window/proc/check_state_and_anchored"), this.state, this.anchored)) })) {
						this.state = this.state == WINDOW_IN_FRAME ? WINDOW_SCREWED_TO_FRAME : 1;
						$0 = user;
						if (this.state == 1) {
							$1 = "unfasten the window from";
						} else {
							$1 = "fasten the window to";
						}
						to_chat($0, `<span class='notice'>You ${$1} the frame.</span>`);
					}
				} else if (this.state == 0) {
					$0 = user;
					if (this.anchored) {
						$1 = "unscrew the frame from";
					} else {
						$1 = "screw the frame to";
					}
					to_chat($0, `<span class='notice'>You begin to ${$1} the floor...</span>`);
					if (yield* do_after(user, this.decon_speed * I.toolspeed, { target: this, extra_checks: (yield* new_(T("/datum/callback"), this, P("/obj/structure/window/proc/check_state_and_anchored"), this.state, this.anchored)) })) {
						this.anchored = (!this.anchored ? WINDOW_IN_FRAME : WINDOW_OUT_OF_FRAME);
						this.update_nearby_icons();
						$0 = user;
						if (this.anchored) {
							$1 = "fasten the frame to";
						} else {
							$1 = "unfasten the frame from";
						}
						to_chat($0, `<span class='notice'>You ${$1} the floor.</span>`);
					}
				}
			} else {
				$0 = user;
				if (this.anchored) {
					$1 = "unscrew the window from";
				} else {
					$1 = "screw the window to";
				}
				to_chat($0, `<span class='notice'>You begin to ${$1} the floor...</span>`);
				if (yield* do_after(user, this.decon_speed * I.toolspeed, { target: this, extra_checks: (yield* new_(T("/datum/callback"), this, P("/obj/structure/window/proc/check_anchored"), this.anchored)) })) {
					this.anchored = (!this.anchored ? 1 : 0);
					this.update_nearby_icons();
					$0 = user;
					if (this.anchored) {
						$1 = "fasten the window to";
					} else {
						$1 = "unfasten the window from";
					}
					to_chat($0, `<span class='notice'>You ${$1} the floor.</span>`);
				}
			}
			return f.dot;
		} else if (rt.istype(I, T("/obj/item/weapon/crowbar")) && this.reinf && (this.state == 0 || this.state == WINDOW_IN_FRAME)) {
			$0 = user;
			if (this.state == WINDOW_OUT_OF_FRAME) {
				$1 = "into";
			} else {
				$1 = "out of";
			}
			to_chat($0, `<span class='notice'>You begin to lever the window ${$1} the frame...</span>`);
			playsound(this, I.usesound, 75, WINDOW_IN_FRAME);
			if (yield* do_after(user, this.decon_speed * I.toolspeed, { target: this, extra_checks: (yield* new_(T("/datum/callback"), this, P("/obj/structure/window/proc/check_state_and_anchored"), this.state, this.anchored)) })) {
				this.state = this.state == WINDOW_OUT_OF_FRAME ? WINDOW_IN_FRAME : WINDOW_OUT_OF_FRAME;
				$0 = user;
				if (this.state == WINDOW_IN_FRAME) {
					$1 = "into";
				} else {
					$1 = "out of";
				}
				to_chat($0, `<span class='notice'>You pry the window ${$1} the frame.</span>`);
			}
			return f.dot;
		} else if (rt.istype(I, T("/obj/item/weapon/wrench")) && !this.anchored) {
			playsound(this, I.usesound, 75, 1);
			to_chat(user, `<span class='notice'> You begin to disassemble ${this}...</span>`);
			if (yield* do_after(user, this.decon_speed * I.toolspeed, { target: this, extra_checks: (yield* new_(T("/datum/callback"), this, P("/obj/structure/window/proc/check_state_and_anchored"), this.state, this.anchored)) })) {
				yield* (G = (yield* new_(this.glass_type, user.loc, this.glass_amount))).add_fingerprint(user);
				playsound(this, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
				to_chat(user, `<span class='notice'>You successfully disassemble ${this}.</span>`);
				yield* qdel(this);
			}
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

// window.dm:238
rt.def("/obj/structure/window/proc/check_state", function check_state(f: Frame, checked_state: Value) {
	if (this.state != checked_state) return f.dot;
	return 1;
});

// window.dm:242
rt.def("/obj/structure/window/proc/check_anchored", function check_anchored(f: Frame, checked_anchored: Value) {
	if (this.anchored != checked_anchored) return f.dot;
	return 1;
});

// window.dm:246
rt.def("/obj/structure/window/proc/check_state_and_anchored", function check_state_and_anchored(f: Frame, checked_state: Value, checked_anchored: Value) {
	return (this.check_state(checked_state) && this.check_anchored(checked_anchored));
});

// window.dm:249
rt.def("/obj/structure/window/proc/mech_melee_attack", function* mech_melee_attack(f: Frame, M: Value) {
	if (!(yield* this.can_be_reached())) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// window.dm:254
rt.def("/obj/structure/window/proc/can_be_reached", function* can_be_reached(f: Frame, user: Value) {
	let O: Value = null;
	if (!this.fulltile) {
		if (rt.bitAnd(rt.getDir(f, user, this), this.dir)) {
			for (O of each(this.loc, T("/obj"))) {
				if (!(yield* O.CanPass(user, user.loc, 1))) {
					return 0;
				}
			}
		}
	}
	return 1;
}, true);

// window.dm:262
rt.def("/obj/structure/window/proc/take_damage", function* take_damage(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	this.update_nearby_icons();
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// window.dm:267
rt.def("/obj/structure/window/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (damage_amount) {
			playsound(this, this.hitsound, 75, 1);
		} else {
			playsound(this, rt.rsc("sound/weapons/tap.ogg"), 50, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// window.dm:278
rt.def("/obj/structure/window/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let _T: Value = null, i: Value = null, I: Value = null;
	disassembled ??= 1;
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	if (!disassembled) {
		playsound(this, this.breaksound, 70, 1);
		_T = this.loc;
		if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
			for (i of each(this.debris)) {
				(I = i).loc = _T;
				this.transfer_fingerprints_to(I);
			}
		}
	}
	yield* qdel(this);
	this.update_nearby_icons();
	return f.dot;
}, true);

// window.dm:296
rt.def("/obj/structure/window/verb/rotate", function* rotate(f: Frame) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	if (this.anchored) {
		to_chat(f.usr, `<span class='warning'>${this} cannot be rotated while it is fastened to the floor!</span>`);
		return 0;
	}
	let target_dir: Value = turn(this.dir, 90);
	if (!valid_window_location(this.loc, target_dir)) {
		to_chat(f.usr, `<span class='warning'>${this} cannot be rotated in that direction!</span>`);
		return 0;
	}
	yield* this.setDir(target_dir);
	this.air_update_turf(1);
	this.ini_dir = this.dir;
	yield* this.add_fingerprint(f.usr);
	return 1;
}, true, { verb: { name: "Rotate Window Counter-Clockwise", category: "Object", src: 3, range: 1 } });

// window.dm:320
rt.def("/obj/structure/window/verb/revrotate", function* revrotate(f: Frame) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	if (this.anchored) {
		to_chat(f.usr, `<span class='warning'>${this} cannot be rotated while it is fastened to the floor!</span>`);
		return 0;
	}
	let target_dir: Value = turn(this.dir, 270);
	if (!valid_window_location(this.loc, target_dir)) {
		to_chat(f.usr, `<span class='warning'>${this} cannot be rotated in that direction!</span>`);
		return 0;
	}
	yield* this.setDir(target_dir);
	this.air_update_turf(1);
	this.ini_dir = this.dir;
	yield* this.add_fingerprint(f.usr);
	return 1;
}, true, { verb: { name: "Rotate Window Clockwise", category: "Object", src: 3, range: 1 } });

// window.dm:340
rt.def("/obj/structure/window/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	yield* parent_proc();
	if (user.incapacitated()) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	if (!(get_dist(this, user) <= 1)) {
		return f.dot;
	} else {
		yield* this.revrotate();
	}
	return f.dot;
}, true);

// window.dm:351
rt.def("/obj/structure/window/proc/Destroy", function* Destroy(f: Frame) {
	this.density = 0;
	this.air_update_turf(1);
	this.update_nearby_icons();
	return (yield* parent_proc());
}, true);

// window.dm:357
rt.def("/obj/structure/window/proc/Move", function* Move(f: Frame) {
	let _T: Value = this.loc;
	yield* parent_proc();
	yield* this.setDir(this.ini_dir);
	this.move_update_air(_T);
	return f.dot;
}, true);

// window.dm:363
rt.def("/obj/structure/window/proc/CanAtmosPass", function CanAtmosPass(f: Frame, _T: Value) {
	if (rt.getDir(f, this.loc, _T) == this.dir) {
		return (!this.density ? 1 : 0);
	}
	if (this.dir == 5) {
		return (!this.density ? 1 : 0);
	}
	return 1;
});

// window.dm:371
rt.def("/obj/structure/window/proc/update_nearby_icons", function update_nearby_icons(f: Frame) {
	this.update_icon();
	if (!this.smooth) return f.dot;
	queue_smooth_neighbors(this);
	return f.dot;
});

// window.dm:377
rt.def("/obj/structure/window/proc/update_icon", function update_icon(f: Frame) {
	let ratio: Value = null;
	if (!this || this.gc_destroyed) return f.dot;
	if (!this.fulltile) {
		return f.dot;
	}
	ratio = Ceiling((ratio = this.obj_integrity / this.max_integrity) * 4) * 25;
	if (this.smooth) {
		queue_smooth(this);
	}
	this.cut_overlay(this.crack_overlay);
	if (ratio > 75) {
		return f.dot;
	}
	this.crack_overlay = mutable_appearance(rt.rsc("icons/obj/structures.dmi"), `damage${ratio}`, -(this.layer + 0.1));
	this.add_overlay(this.crack_overlay);
	return f.dot;
});

// window.dm:395
rt.def("/obj/structure/window/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (exposed_temperature > T0C + this.heat_resistance) {
		yield* this.take_damage(round(exposed_volume / 100), "fire", 0, 0);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// window.dm:403
rt.def("/obj/structure/window/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, to_dir: Value) {
	if (!this.density) {
		return 1;
	}
	if (this.dir == 5 || this.dir == to_dir) {
		return 0;
	}
	return 1;
});

// window.dm:411
rt.def("/obj/structure/window/proc/GetExplosionBlock", function GetExplosionBlock(f: Frame) {
	return this.reinf && this.fulltile ? this.real_explosion_block : 0;
});

rt.type(12208, "/obj/structure/window/reinforced", "/obj/structure/window", {
	explosion_block: 1,
	name: "reinforced window",
	desc: "A window that is reinforced with metal rods.",
	icon_state: "rwindow",
	reinf: 1,
	heat_resistance: 1600,
	armor: null,
	max_integrity: 50,
	glass_type: rt.typePath("/obj/item/stack/sheet/rglass"),
});

// window.dm:422
rt.def("/obj/structure/window/reinforced/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 0, "laser", 0, "energy", 0, "bomb", 25, "bio", 100, "rad", 100, "fire", 80, "acid", 100]);
	return f.dot;
});

rt.type(12224, "/obj/structure/window/fulltile", "/obj/structure/window", {
	fulltile: 1,
	flags: 32768,
	smooth: 1,
	canSmoothWith: null,
	glass_amount: 2,
	icon: rt.rsc("icons/obj/smooth_structures/window.dmi"),
	icon_state: "window",
	dir: 5,
	max_integrity: 50,
});

// window.dm:454
rt.def("/obj/structure/window/fulltile/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/window/fulltile"), T("/obj/structure/window/reinforced/fulltile"), T("/obj/structure/window/reinforced/highpressure/fulltile"), T("/obj/structure/window/reinforced/tinted/fulltile"));
	return f.dot;
});

rt.type(12219, "/obj/structure/window/reinforced/fulltile", "/obj/structure/window/reinforced", {
	flags: 32768,
	smooth: 1,
	level: 3,
	icon: rt.rsc("icons/obj/smooth_structures/reinforced_window.dmi"),
	icon_state: "r_window",
	dir: 5,
	max_integrity: 100,
	fulltile: 1,
	canSmoothWith: null,
	glass_amount: 2,
});

// window.dm:469
rt.def("/obj/structure/window/reinforced/fulltile/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/window/fulltile"), T("/obj/structure/window/reinforced/fulltile"), T("/obj/structure/window/reinforced/highpressure/fulltile"), T("/obj/structure/window/reinforced/tinted/fulltile"));
	return f.dot;
});

rt.type(12218, "/obj/structure/window/reinforced/highpressure/fulltile", "/obj/structure/window/reinforced/highpressure", {
	flags: 32768,
	smooth: 1,
	level: 3,
	icon: rt.rsc("icons/obj/smooth_structures/reinforced_window.dmi"),
	icon_state: "r_window",
	dir: 5,
	max_integrity: 1000,
	fulltile: 1,
	canSmoothWith: null,
	glass_amount: 2,
});

// window.dm:481
rt.def("/obj/structure/window/reinforced/highpressure/fulltile/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/window/fulltile"), T("/obj/structure/window/reinforced/fulltile"), T("/obj/structure/window/reinforced/highpressure/fulltile"), T("/obj/structure/window/reinforced/tinted/fulltile"));
	return f.dot;
});

rt.type(12216, "/obj/structure/window/reinforced/tinted/fulltile", "/obj/structure/window/reinforced/tinted", {
	flags: 32768,
	smooth: 1,
	level: 3,
	icon: rt.rsc("icons/obj/smooth_structures/tinted_window.dmi"),
	icon_state: "tinted_window",
	dir: 5,
	fulltile: 1,
	canSmoothWith: null,
	glass_amount: 2,
});

// window.dm:495
rt.def("/obj/structure/window/reinforced/tinted/fulltile/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/window/fulltile"), T("/obj/structure/window/reinforced/fulltile"), T("/obj/structure/window/reinforced/highpressure/fulltile"), T("/obj/structure/window/reinforced/tinted/fulltile"));
	return f.dot;
});

rt.type(12221, "/obj/structure/window/reinforced/fulltile/ice", "/obj/structure/window/reinforced/fulltile", {
	level: 3,
	icon: rt.rsc("icons/obj/smooth_structures/rice_window.dmi"),
	icon_state: "ice_window",
	max_integrity: 150,
	canSmoothWith: null,
	glass_amount: 2,
});

// window.dm:503
rt.def("/obj/structure/window/reinforced/fulltile/ice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/window/fulltile"), T("/obj/structure/window/reinforced/fulltile"), T("/obj/structure/window/reinforced/tinted/fulltile"), T("/obj/structure/window/reinforced/fulltile/ice"));
	return f.dot;
});

rt.type(12226, "/obj/structure/window/shuttle", "/obj/structure/window", {
	wtype: "shuttle",
	fulltile: 1,
	flags: 32768,
	reinf: 1,
	heat_resistance: 1600,
	smooth: 1,
	canSmoothWith: null,
	explosion_block: 1,
	level: 3,
	glass_type: rt.typePath("/obj/item/stack/sheet/rglass"),
	glass_amount: 2,
	name: "shuttle window",
	desc: "A reinforced, air-locked pod window.",
	icon: rt.rsc("icons/obj/smooth_structures/shuttle_window.dmi"),
	icon_state: "shuttle_window",
	dir: 5,
	max_integrity: 100,
	armor: null,
});

// window.dm:519
rt.def("/obj/structure/window/shuttle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 0, "laser", 0, "energy", 0, "bomb", 25, "bio", 100, "rad", 100, "fire", 80, "acid", 100]);
	return f.dot;
});

// window.dm:528
rt.def("/obj/structure/window/shuttle/proc/narsie_act", function narsie_act(f: Frame) {
	this.add_atom_colour("#3C3434", FIXED_COLOUR_PRIORITY);
	return f.dot;
});

rt.type(12209, "/obj/structure/window/reinforced/clockwork", "/obj/structure/window/reinforced", {
	made_glow: 0,
	explosion_block: 2,
	name: "brass window",
	desc: "A paper-thin pane of translucent yet reinforced brass.",
	icon: rt.rsc("icons/obj/smooth_structures/clockwork_window.dmi"),
	icon_state: "clockwork_window_single",
	resistance_flags: 34,
	max_integrity: 80,
	armor: null,
	decon_speed: 40,
	glass_type: rt.typePath("/obj/item/stack/tile/brass"),
	glass_amount: 1,
	reinf: 0,
});

// window.dm:540
rt.def("/obj/structure/window/reinforced/clockwork/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 60, "bullet", 25, "laser", 0, "energy", 0, "bomb", 25, "bio", 100, "rad", 100, "fire", 80, "acid", 100]);
	return f.dot;
});

// window.dm:551
rt.def("/obj/structure/window/reinforced/clockwork/proc/Initialize", function* Initialize(f: Frame, mapload: Value, direct: Value) {
	let I: Value = null, i: Value = null;
	let $e: any;
	if (this.fulltile) {
		this.made_glow = 1;
	}
	yield* parent_proc();
	if (this.debris) {
		for (I of each(this.debris)) {
			yield* qdel(I);
		}
		this.debris.Cut();
	}
	let amount_of_gears: Value = 2;
	if (this.fulltile) {
		yield* new_(T("/obj/effect/temp_visual/ratvar/window"), rt.getStep(f, this, 0));
		amount_of_gears = 4;
	}
	rt.forRange(f, 0, 1, amount_of_gears, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		this.debris += (yield* new_(T("/obj/item/clockwork/alloy_shards/medium/gear_bit")));
	}
	rt.endFor(f, 0);
	change_construction_value(this.fulltile ? 2 : 1);
	return f.dot;
}, true);

// window.dm:562
rt.def("/obj/structure/window/reinforced/clockwork/proc/setDir", function* setDir(f: Frame, direct: Value) {
	let E: Value = null;
	if (!this.made_glow) {
		yield* (E = (yield* new_(T("/obj/effect/temp_visual/ratvar/window/single"), rt.getStep(f, this, 0)))).setDir(direct);
		this.made_glow = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// window.dm:569
rt.def("/obj/structure/window/reinforced/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	change_construction_value(this.fulltile ? -2 : -1);
	return (yield* parent_proc());
}, true);

// window.dm:574
rt.def("/obj/structure/window/reinforced/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (!GLOB.ratvar_awakens) return f.dot;
	this.obj_integrity = this.max_integrity;
	this.update_icon();
	return f.dot;
});

// window.dm:578
rt.def("/obj/structure/window/reinforced/clockwork/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* this.take_damage(rand(25, 75), "brute");
	if (!this) return f.dot;
	let previouscolor: Value = this.color;
	this.color = "#960000";
	rt.op(f, "Animate", [2, 6], [null, this, "color", previouscolor, "time", 8]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
	return f.dot;
}, true);

rt.type(12229, "/obj/structure/window/paperframe", "/obj/structure/window", {
	fulltile: 1,
	flags: 32768,
	smooth: 1,
	glass_amount: 2,
	glass_type: rt.typePath("/obj/item/stack/sheet/paperframes"),
	heat_resistance: 233,
	decon_speed: 10,
	CanAtmosPass: 1,
	breaksound: rt.rsc("sound/items/poster_ripped.ogg"),
	hitsound: rt.rsc("sound/weapons/slashmiss.ogg"),
	name: "paper frame",
	desc: "A fragile separator made of thin wood and paper.",
	icon: rt.rsc("icons/obj/smooth_structures/paperframes.dmi"),
	icon_state: "frame",
	dir: 5,
	opacity: 1,
	max_integrity: 15,
	obj_integrity: 15,
	canSmoothWith: null,
	resistance_flags: 4,
	armor: null,
}, { global: { torn: 795, paper: 796 } });

// window.dm:614
rt.def("/obj/structure/window/paperframe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/window/paperframe"), T("/obj/structure/mineral_door/paperframe"));
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]);
	return f.dot;
});

// window.dm:628
rt.def("/obj/structure/window/paperframe/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null, i: Value = null;
	let $e: any;
	f.dot = (yield* parent_proc());
	if (this.debris) {
		for (I of each(this.debris)) {
			yield* qdel(I);
		}
		this.debris.Cut();
	}
	let papers: Value = rand(1, 4);
	this.debris += (yield* new_(T("/obj/item/stack/sheet/mineral/wood")));
	rt.forRange(f, 0, 1, papers, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		this.debris += (yield* new_(T("/obj/item/weapon/paper/natural")));
	}
	rt.endFor(f, 0);
	yield* this.update_icon();
	return f.dot;
}, true);

// window.dm:637
rt.def("/obj/structure/window/paperframe/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	if (user.a_intent != "harm") {
		user.changeNext_move(8);
		user.visible_message(`${user} knocks on ${this}.`);
		playsound(this, "pageturn", 50, 1);
	} else {
		yield* this.take_damage(4, "brute", "melee", 0);
		playsound(this, this.hitsound, 50, 1);
		if (!this || this.gc_destroyed) return f.dot;
		user.visible_message(`<span class='danger'>${user} tears a hole in ${this}.</span>`);
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// window.dm:650
rt.def("/obj/structure/window/paperframe/proc/update_icon", function update_icon(f: Frame) {
	if (this.obj_integrity < this.max_integrity) {
		this.cut_overlay(GLOB.paper);
		this.add_overlay(GLOB.torn);
		this.set_opacity(0);
	} else {
		this.cut_overlay(GLOB.torn);
		this.add_overlay(GLOB.paper);
		this.set_opacity(1);
	}
	queue_smooth(this);
	return f.dot;
});

// window.dm:662
rt.def("/obj/structure/window/paperframe/proc/attackby", function* attackby(f: Frame, W: Value, user: Value) {
	if (W.is_hot()) {
		yield* this.fire_act(W.is_hot());
		return f.dot;
	}
	if (user.a_intent == "harm") {
		return (yield* parent_proc());
	}
	if (rt.istype(W, T("/obj/item/weapon/paper")) && this.obj_integrity < this.max_integrity) {
		user.visible_message(fmt("＀ starts to patch the holes in ％！.", [user, this]));
		if (yield* do_after(user, 20, { target: this })) {
			this.obj_integrity = min(this.obj_integrity + 4, this.max_integrity);
			yield* qdel(W);
			user.visible_message(fmt("＀ patches some of the holes in ％！.", [user, this]));
			if (this.obj_integrity == this.max_integrity) {
				yield* this.update_icon();
			}
			return f.dot;
		}
	}
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);
