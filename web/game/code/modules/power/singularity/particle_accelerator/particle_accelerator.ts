// Based on /tg/station's code/modules/power/singularity/particle_accelerator/particle_accelerator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12978, "/obj/structure/particle_accelerator", "/obj/structure", {
	master: null,
	construction_state: 0,
	reference: null,
	powered: 0,
	strength: null,
	anchored: 0,
	name: "Particle Accelerator",
	desc: "Part of a Particle Accelerator.",
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	icon_state: "none",
	density: 1,
	obj_integrity: 500,
	max_integrity: 500,
	armor: null,
});

// particle_accelerator.dm:31
rt.def("/obj/structure/particle_accelerator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 20, "laser", 20, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 90, "acid", 80]);
	return f.dot;
});

// particle_accelerator.dm:40
rt.def("/obj/structure/particle_accelerator/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.construction_state === 0) {
		to_chat(user, "Looks like it's not attached to the flooring");
	} else if (this.construction_state === 1) {
		to_chat(user, "It is missing some cables");
	} else if (this.construction_state === 2) {
		to_chat(user, "The panel is open");
	}
	to_chat(user, "<span class='notice'>Alt-click to rotate it clockwise.</span>");
	return f.dot;
}, false);

// particle_accelerator.dm:55
rt.def("/obj/structure/particle_accelerator/proc/Destroy", function* Destroy(f: Frame) {
	this.construction_state = 0;
	if (this.master) {
		this.master.connected_parts -= this;
		this.master.assembled = 0;
		this.master = null;
	}
	return (yield* parent_proc());
}, true);

// particle_accelerator.dm:65
rt.def("/obj/structure/particle_accelerator/verb/rotate", function rotate(f: Frame) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	if (this.anchored) {
		to_chat(f.usr, "It is fastened to the floor!");
		return 0;
	}
	this.setDir(turn(this.dir, -90));
	return 1;
}, false, { verb: { name: "Rotate Clockwise", category: "Object", src: 3, range: 1 } });

// particle_accelerator.dm:74
rt.def("/obj/structure/particle_accelerator/proc/AltClick", function* AltClick(f: Frame, user: Value) {
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

// particle_accelerator.dm:88
rt.def("/obj/structure/particle_accelerator/verb/rotateccw", function rotateccw(f: Frame) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	if (this.anchored) {
		to_chat(f.usr, "It is fastened to the floor!");
		return 0;
	}
	this.setDir(turn(this.dir, 90));
	return 1;
}, false, { verb: { name: "Rotate Counter Clockwise", category: "Object", src: 3, range: 1 } });

// particle_accelerator.dm:99
rt.def("/obj/structure/particle_accelerator/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let CC: Value = null;
	let did_something: Value = 0;
	if (this.construction_state === 0) {
		if (rt.istype(W, T("/obj/item/weapon/wrench")) && !this.isinspace()) {
			playsound(this.loc, W.usesound, 75, 1);
			this.anchored = 1;
			user.visible_message(`${user.name} secures the ${this.name} to the floor.`, "You secure the external bolts.");
			this.construction_state = 1;
			did_something = 1;
		}
	} else if (this.construction_state === 1) {
		if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
			playsound(this.loc, W.usesound, 75, 1);
			this.anchored = 0;
			user.visible_message(`${user.name} detaches the ${this.name} from the floor.`, "You remove the external bolts.");
			this.construction_state = 0;
			did_something = 1;
		} else if (rt.istype(W, T("/obj/item/stack/cable_coil"))) {
			if (yield* (CC = W).use(1)) {
				user.visible_message(`${user.name} adds wires to the ${this.name}.`, "You add some wires.");
				this.construction_state = 2;
				did_something = 1;
			}
		}
	} else if (this.construction_state === 2) {
		if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
			user.visible_message(`${user.name} removes some wires from the ${this.name}.`, "You remove some wires.");
			this.construction_state = 1;
			did_something = 1;
		} else if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
			user.visible_message(`${user.name} closes the ${this.name}'s access panel.`, "You close the access panel.");
			this.construction_state = 3;
			did_something = 1;
		}
	} else if (this.construction_state === 3) {
		if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
			user.visible_message(`${user.name} opens the ${this.name}'s access panel.`, "You open the access panel.");
			this.construction_state = 2;
			did_something = 1;
		}
	}
	if (did_something) {
		user.changeNext_move(8);
		yield* this.update_state();
		yield* this.update_icon();
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// particle_accelerator.dm:151
rt.def("/obj/structure/particle_accelerator/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 5);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// particle_accelerator.dm:156
rt.def("/obj/structure/particle_accelerator/proc/Move", function* Move(f: Frame) {
	yield* parent_proc();
	if (!(this.master && this.master.active)) return f.dot;
	yield* this.master.toggle_power();
	this.investigate_log("was moved whilst active; it <font color='red'>powered down</font>.", "singulo");
	return f.dot;
}, true);

// particle_accelerator.dm:163
rt.def("/obj/structure/particle_accelerator/proc/update_icon", function update_icon(f: Frame) {
	if (this.construction_state === 0 || this.construction_state === 1) {
		this.icon_state = `${this.reference}`;
	} else if (this.construction_state === 2) {
		this.icon_state = `${this.reference}w`;
	} else if (this.construction_state === 3) {
		if (this.powered) {
			this.icon_state = `${this.reference}p${this.strength}`;
		} else {
			this.icon_state = `${this.reference}c`;
		}
	}
	return f.dot;
});

// particle_accelerator.dm:176
rt.def("/obj/structure/particle_accelerator/proc/update_state", function update_state(f: Frame) {
	if (!this.master) return f.dot;
	this.master.update_state();
	return f.dot;
});

// particle_accelerator.dm:179
rt.def("/obj/structure/particle_accelerator/proc/connect_master", function connect_master(f: Frame, O: Value) {
	if (O.dir == this.dir) {
		this.master = O;
		return 1;
	}
	return 0;
});
