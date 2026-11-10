// Based on /tg/station's code/game/objects/structures/windoor_assembly.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12897, "/obj/structure/windoor_assembly", "/obj/structure", {
	ini_dir: null,
	electronics: null,
	created_name: null,
	facing: "l",
	secure: 0,
	state: "01",
	anchored: 0,
	CanAtmosPass: -1,
	icon: rt.rsc("icons/obj/doors/windoor.dmi"),
	name: "windoor Assembly",
	icon_state: "l_windoor_assembly01",
	density: 0,
	dir: 1,
});

// windoor_assembly.dm:32
rt.def("/obj/structure/windoor_assembly/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, "<span class='notice'>Alt-click to rotate it clockwise.</span>");
	return f.dot;
}, false);

// windoor_assembly.dm:36
rt.def("/obj/structure/windoor_assembly/proc/New", function* New(f: Frame, loc: Value, set_dir: Value) {
	yield* parent_proc();
	if (set_dir) {
		this.dir = set_dir;
	}
	this.ini_dir = this.dir;
	this.air_update_turf(1);
	return f.dot;
}, true);

// windoor_assembly.dm:44
rt.def("/obj/structure/windoor_assembly/proc/Destroy", function* Destroy(f: Frame) {
	this.density = 0;
	this.air_update_turf(1);
	return (yield* parent_proc());
}, true);

// windoor_assembly.dm:48
rt.def("/obj/structure/windoor_assembly/proc/Move", function* Move(f: Frame) {
	let _T: Value = this.loc;
	yield* parent_proc();
	yield* this.setDir(this.ini_dir);
	this.move_update_air(_T);
	return f.dot;
}, true);

// windoor_assembly.dm:54
rt.def("/obj/structure/windoor_assembly/proc/update_icon", function update_icon(f: Frame) {
	let $0: any = this.facing;
	this.icon_state = `${$0}_${this.secure ? "secure_" : ""}windoor_assembly${this.state}`;
	return f.dot;
});

// windoor_assembly.dm:57
rt.def("/obj/structure/windoor_assembly/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
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
	}
	return 1;
});

// windoor_assembly.dm:74
rt.def("/obj/structure/windoor_assembly/proc/CanAtmosPass", function CanAtmosPass(f: Frame, _T: Value) {
	if (rt.getDir(f, this.loc, _T) == this.dir) {
		return (!this.density ? 1 : 0);
	}
	return 1;
});

// windoor_assembly.dm:80
rt.def("/obj/structure/windoor_assembly/proc/CheckExit", function CheckExit(f: Frame, mover: Value, target: Value) {
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(2)) {
		return 1;
	}
	if (rt.getDir(f, this.loc, target) == this.dir) {
		return (!this.density ? 1 : 0);
	}
	return 1;
});

// windoor_assembly.dm:90
rt.def("/obj/structure/windoor_assembly/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null, RG: Value = null, R: Value = null, WD: Value = null, _P: Value = null, CC: Value = null, ae: Value = null, t: Value = null, windoor: Value = null;
	let $e: any;
	yield* this.add_fingerprint(user);
	if (this.state === "01") {
		if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && !this.anchored) {
			if (yield* (WT = W).remove_fuel(0, user)) {
				user.visible_message(`${user} disassembles the windoor assembly.`, "<span class='notice'>You start to disassemble the windoor assembly...</span>");
				playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
				if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
					if (!this || !WT.isOn()) {
						return f.dot;
					}
					to_chat(user, "<span class='notice'>You disassemble the windoor assembly.</span>");
					yield* (RG = (yield* new_(T("/obj/item/stack/sheet/rglass"), rt.getStep(f, this, 0), 5))).add_fingerprint(user);
					if (this.secure) {
						yield* (R = (yield* new_(T("/obj/item/stack/rods"), rt.getStep(f, this, 0), 4))).add_fingerprint(user);
					}
					yield* qdel(this);
				}
			} else {
				return f.dot;
			}
		}
		if (rt.istype(W, T("/obj/item/weapon/wrench")) && !this.anchored) {
			for (WD of each(this.loc, T("/obj/machinery/door/window"))) {
				if (WD.dir == this.dir) {
					to_chat(user, "<span class='warning'>There is already a windoor in that location!</span>");
					return f.dot;
				}
			}
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`${user} secures the windoor assembly to the floor.`, "<span class='notice'>You start to secure the windoor assembly to the floor...</span>");
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!this || this.anchored) {
					return f.dot;
				}
				WD = null;
				for (WD of each(this.loc, T("/obj/machinery/door/window"))) {
					if (WD.dir == this.dir) {
						to_chat(user, "<span class='warning'>There is already a windoor in that location!</span>");
						return f.dot;
					}
				}
				to_chat(user, "<span class='notice'>You secure the windoor assembly.</span>");
				this.anchored = 1;
				if (this.secure) {
					this.name = "secure anchored windoor assembly";
				} else {
					this.name = "anchored windoor assembly";
				}
			}
		} else if (rt.istype(W, T("/obj/item/weapon/wrench")) && this.anchored) {
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`${user} unsecures the windoor assembly to the floor.`, "<span class='notice'>You start to unsecure the windoor assembly to the floor...</span>");
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!this || !this.anchored) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You unsecure the windoor assembly.</span>");
				this.anchored = 0;
				if (this.secure) {
					this.name = "secure windoor assembly";
				} else {
					this.name = "windoor assembly";
				}
			}
		} else if (rt.istype(W, T("/obj/item/stack/sheet/plasteel")) && !this.secure) {
			if ((_P = W).get_amount() < 2) {
				to_chat(user, "<span class='warning'>You need more plasteel to do this!</span>");
				return f.dot;
			}
			to_chat(user, "<span class='notice'>You start to reinforce the windoor with plasteel...</span>");
			if (yield* do_after(user, 40, { target: this })) {
				if (!this || this.secure || _P.get_amount() < 2) {
					return f.dot;
				}
				yield* _P.use(2);
				to_chat(user, "<span class='notice'>You reinforce the windoor.</span>");
				this.secure = 1;
				if (this.anchored) {
					this.name = "secure anchored windoor assembly";
				} else {
					this.name = "secure windoor assembly";
				}
			}
		} else if (rt.istype(W, T("/obj/item/stack/cable_coil")) && this.anchored) {
			user.visible_message(`${user} wires the windoor assembly.`, "<span class='notice'>You start to wire the windoor assembly...</span>");
			if (yield* do_after(user, 40, { target: this })) {
				if (!this || !this.anchored || this.state != "01") {
					return f.dot;
				}
				if (!(yield* (CC = W).use(1))) {
					to_chat(user, "<span class='warning'>You need more cable to do this!</span>");
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You wire the windoor.</span>");
				this.state = "02";
				if (this.secure) {
					this.name = "secure wired windoor assembly";
				} else {
					this.name = "wired windoor assembly";
				}
			}
		} else {
			return (yield* parent_proc());
		}
	} else if (this.state === "02") {
		if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`${user} cuts the wires from the airlock assembly.`, "<span class='notice'>You start to cut the wires from airlock assembly...</span>");
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!this || this.state != "02") {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You cut the windoor wires.</span>");
				yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, user, 0), 1);
				this.state = "01";
				if (this.secure) {
					this.name = "secure anchored windoor assembly";
				} else {
					this.name = "anchored windoor assembly";
				}
			}
		} else if (rt.istype(W, T("/obj/item/weapon/electronics/airlock"))) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`${user} installs the electronics into the airlock assembly.`, "<span class='notice'>You start to install electronics into the airlock assembly...</span>");
			W.loc = this;
			if (yield* do_after(user, 40, { target: this })) {
				if (!this || this.electronics) {
					W.loc = this.loc;
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You install the airlock electronics.</span>");
				this.name = "near finished windoor assembly";
				this.electronics = W;
			} else {
				W.loc = this.loc;
			}
		} else if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
			if (!this.electronics) {
				return f.dot;
			}
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`${user} removes the electronics from the airlock assembly.`, "<span class='notice'>You start to uninstall electronics from the airlock assembly...</span>");
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!this || !this.electronics) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You remove the airlock electronics.</span>");
				this.name = "wired windoor assembly";
				ae = this.electronics;
				this.electronics = null;
				ae.loc = this.loc;
			}
		} else if (rt.istype(W, T("/obj/item/weapon/pen"))) {
			if (!(t = (yield* stripped_input(user, "Enter the name for the door.", this.name, this.created_name, 42)))) {
				return f.dot;
			}
			if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr) {
				return f.dot;
			}
			this.created_name = t;
			return f.dot;
		} else if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
			if (!this.electronics) {
				to_chat(f.usr, "<span class='warning'>The assembly is missing electronics!</span>");
				return f.dot;
			}
			rt.op(f, "Browse", [], [f.usr, null, "window=windoor_access"], false);
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`${user} pries the windoor into the frame.`, "<span class='notice'>You start prying the windoor into the frame...</span>");
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (this.loc && this.electronics) {
					this.density = 1;
					to_chat(user, "<span class='notice'>You finish the windoor.</span>");
					if (this.secure) {
						windoor = (yield* new_(T("/obj/machinery/door/window/brigdoor"), this.loc));
						if (this.facing == "l") {
							windoor.icon_state = "leftsecureopen";
							windoor.base_state = "leftsecure";
						} else {
							windoor.icon_state = "rightsecureopen";
							windoor.base_state = "rightsecure";
						}
						yield* windoor.setDir(this.dir);
						windoor.density = 0;
						if (this.electronics.one_access) {
							windoor.req_one_access = this.electronics.accesses;
						} else {
							windoor.req_access = this.electronics.accesses;
						}
						windoor.electronics = this.electronics;
						this.electronics.loc = windoor;
						if (this.created_name) {
							windoor.name = this.created_name;
						}
						yield* qdel(this);
						yield* windoor.close();
					} else {
						windoor = (yield* new_(T("/obj/machinery/door/window"), this.loc));
						if (this.facing == "l") {
							windoor.icon_state = "leftopen";
							windoor.base_state = "left";
						} else {
							windoor.icon_state = "rightopen";
							windoor.base_state = "right";
						}
						yield* windoor.setDir(this.dir);
						windoor.density = 0;
						windoor.req_access = this.electronics.accesses;
						windoor.electronics = this.electronics;
						this.electronics.loc = windoor;
						if (this.created_name) {
							windoor.name = this.created_name;
						}
						yield* qdel(this);
						yield* windoor.close();
					}
				}
			}
		} else {
			return (yield* parent_proc());
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// windoor_assembly.dm:326
rt.def("/obj/structure/windoor_assembly/verb/revrotate", function revrotate(f: Frame) {
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
	this.setDir(target_dir);
	this.ini_dir = this.dir;
	this.update_icon();
	return 1;
}, false, { verb: { name: "Rotate Windoor Assembly", category: "Object", src: 3, range: 1 } });

// windoor_assembly.dm:345
rt.def("/obj/structure/windoor_assembly/proc/AltClick", function* AltClick(f: Frame, user: Value) {
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

// windoor_assembly.dm:359
rt.def("/obj/structure/windoor_assembly/verb/flip", function flip(f: Frame) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	if (this.facing == "l") {
		to_chat(f.usr, "<span class='notice'>The windoor will now slide to the right.</span>");
		this.facing = "r";
	} else {
		this.facing = "l";
		to_chat(f.usr, "<span class='notice'>The windoor will now slide to the left.</span>");
	}
	this.update_icon();
	return f.dot;
}, false, { verb: { name: "Flip Windoor Assembly", category: "Object", src: 3, range: 1 } });
