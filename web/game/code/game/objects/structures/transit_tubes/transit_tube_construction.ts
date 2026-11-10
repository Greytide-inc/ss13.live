// Based on /tg/station's code/game/objects/structures/transit_tubes/transit_tube_construction.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12914, "/obj/structure/c_transit_tube", "/obj/structure", {
	flipped: 0,
	build_type: rt.typePath("/obj/structure/transit_tube"),
	flipped_build_type: null,
	base_icon: null,
	anchored: 0,
	name: "unattached transit tube",
	icon: rt.rsc("icons/obj/atmospherics/pipes/transit_tube.dmi"),
	icon_state: "straight",
	density: 0,
	layer: 2.95,
});

// transit_tube_construction.dm:17
rt.def("/obj/structure/c_transit_tube/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, "<span class='notice'>Alt-click to rotate it clockwise.</span>");
	return f.dot;
}, false);

// transit_tube_construction.dm:21
rt.def("/obj/structure/c_transit_tube/proc/tube_rotate", function tube_rotate(f: Frame) {
	this.setDir(turn(this.dir, -90));
	return f.dot;
});

// transit_tube_construction.dm:25
rt.def("/obj/structure/c_transit_tube/proc/tube_flip", function tube_flip(f: Frame) {
	let cur_flip: Value = null;
	let $0: any;
	if (this.flipped_build_type) {
		this.flipped = (!this.flipped ? 1 : 0);
		if (rt.initial(f, this, "flipped")) {
			$0 = (!this.flipped ? 1 : 0);
		} else {
			$0 = this.flipped;
		}
		if (cur_flip = $0) {
			this.build_type = this.flipped_build_type;
		} else {
			this.build_type = rt.initial(f, this, "build_type");
		}
		this.icon_state = `${this.base_icon}${this.flipped}`;
	} else {
		this.setDir(turn(this.dir, 180));
	}
	return f.dot;
});

// transit_tube_construction.dm:41
rt.def("/obj/structure/c_transit_tube/verb/rotate", function rotate(f: Frame) {
	if (f.usr.incapacitated()) {
		return f.dot;
	}
	this.tube_rotate();
	return f.dot;
}, false, { verb: { name: "Rotate Tube", category: "Object", src: 1, range: 1 } });

// transit_tube_construction.dm:47
rt.def("/obj/structure/c_transit_tube/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	yield* parent_proc();
	if (user.incapacitated()) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	if (!(get_dist(this, user) <= 1)) {
		return f.dot;
	}
	this.tube_rotate();
	return f.dot;
}, true);

// transit_tube_construction.dm:60
rt.def("/obj/structure/c_transit_tube/verb/flip", function flip(f: Frame) {
	if (f.usr.incapacitated()) {
		return f.dot;
	}
	this.tube_flip();
	return f.dot;
}, false, { verb: { name: "Flip", category: "Object", src: 1, range: 1 } });

// transit_tube_construction.dm:66
rt.def("/obj/structure/c_transit_tube/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let R: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
		to_chat(user, `<span class='notice'>You start attaching the ${this.name}...</span>`);
		yield* this.add_fingerprint(user);
		playsound(this.loc, I.usesound, 50, 1);
		if (yield* do_after(user, 40 * I.toolspeed, { target: this })) {
			if (!this || this.gc_destroyed) {
				return f.dot;
			}
			to_chat(user, `<span class='notice'>You attach the ${this.name}.</span>`);
			this.transfer_fingerprints_to((R = (yield* new_(this.build_type, this.loc, this.dir))));
			yield* qdel(this);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
