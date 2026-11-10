// Based on /tg/station's code/game/objects/structures/transit_tubes/transit_tube.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12898, "/obj/structure/transit_tube", "/obj/structure", {
	tube_dirs: null,
	exit_delay: 1,
	enter_delay: 0,
	tube_construction: rt.typePath("/obj/structure/c_transit_tube"),
	anchored: 1,
	climbable: 1,
	name: "transit tube",
	icon: rt.rsc("icons/obj/atmospherics/pipes/transit_tube.dmi"),
	icon_state: "straight",
	density: 1,
	layer: 2.95,
});

// transit_tube.dm:16
rt.def("/obj/structure/transit_tube/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value) {
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(2)) {
		return 1;
	}
	return (!this.density ? 1 : 0);
});

// transit_tube.dm:21
rt.def("/obj/structure/transit_tube/proc/New", function* New(f: Frame, loc: Value, newdirection: Value) {
	yield* parent_proc(loc);
	if (newdirection) {
		yield* this.setDir(newdirection);
	}
	this.init_tube_dirs();
	this.generate_tube_overlays();
	return f.dot;
}, true);

// transit_tube.dm:28
rt.def("/obj/structure/transit_tube/proc/Destroy", function* Destroy(f: Frame) {
	let _P: Value = null;
	for (_P of each(this.loc, T("/obj/structure/transit_tube_pod"))) {
		yield* _P.deconstruct(0);
	}
	return (yield* parent_proc());
}, true);

// transit_tube.dm:33
rt.def("/obj/structure/transit_tube/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (!(current_size >= STAGE_FIVE)) return f.dot;
	yield* this.deconstruct(0);
	return f.dot;
}, true);

// transit_tube.dm:37
rt.def("/obj/structure/transit_tube/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let pod: Value = null, R: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (this.tube_construction) {
			for (pod of each(this.loc, T("/obj/structure/transit_tube_pod"))) {
				to_chat(user, "<span class='warning'>Remove the pod first!</span>");
				return f.dot;
			}
			user.visible_message(fmt("＀ starts to deattach ％！.", [user, this]), `<span class='notice'>You start to deattach the ${this.name}...</span>`);
			playsound(this.loc, W.usesound, 50, 1);
			if (yield* do_after(user, 35 * W.toolspeed, { target: this })) {
				to_chat(user, `<span class='notice'>You deattach the ${this.name}.</span>`);
				yield* (R = (yield* new_(this.tube_construction, this.loc))).setDir(this.dir);
				this.transfer_fingerprints_to(R);
				yield* R.add_fingerprint(user);
				yield* qdel(this);
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
		pod = null;
		for (pod of each(this.loc, T("/obj/structure/transit_tube_pod"))) {
			yield* pod.attackby(W, user);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// transit_tube.dm:67
rt.def("/obj/structure/transit_tube/proc/has_entrance", function has_entrance(f: Frame, from_dir: Value) {
	let direction: Value = null;
	from_dir = turn(from_dir, 180);
	for (direction of each(this.tube_dirs)) {
		if (direction == from_dir) {
			return 1;
		}
	}
	return 0;
});

// transit_tube.dm:78
rt.def("/obj/structure/transit_tube/proc/has_exit", function has_exit(f: Frame, in_dir: Value) {
	let direction: Value = null;
	for (direction of each(this.tube_dirs)) {
		if (direction == in_dir) {
			return 1;
		}
	}
	return 0;
});

// transit_tube.dm:90
rt.def("/obj/structure/transit_tube/proc/get_exit", function get_exit(f: Frame, in_dir: Value) {
	let direction: Value = null;
	let near_dir: Value = 0;
	let in_dir_cw: Value = turn(in_dir, -45);
	let in_dir_ccw: Value = turn(in_dir, 45);
	for (direction of each(this.tube_dirs)) {
		if (direction == in_dir) {
			return direction;
		} else if (direction == in_dir_cw) {
			near_dir = direction;
		} else if (direction == in_dir_ccw) {
			near_dir = direction;
		}
	}
	return near_dir;
});

// transit_tube.dm:119
rt.def("/obj/structure/transit_tube/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	if (this.dir === 1) {
		this.tube_dirs = list(1, 2);
	} else if (this.dir === 2) {
		this.tube_dirs = list(1, 2);
	} else if (this.dir === 4) {
		this.tube_dirs = list(4, 8);
	} else if (this.dir === 8) {
		this.tube_dirs = list(4, 8);
	}
	return f.dot;
});

// transit_tube.dm:131
rt.def("/obj/structure/transit_tube/proc/generate_tube_overlays", function generate_tube_overlays(f: Frame) {
	let direction: Value = null;
	for (direction of each(this.tube_dirs)) {
		if (rt.isIn(f, direction, GLOB.diagonals)) {
			if (rt.bitAnd(direction, 1)) {
				this.create_tube_overlay(rt.bitXor(direction, 3), 1);
				if (rt.bitAnd(direction, 4)) {
					this.create_tube_overlay(rt.bitXor(direction, 12), 4);
				} else {
					this.create_tube_overlay(rt.bitXor(direction, 12), 8);
				}
			}
		} else {
			this.create_tube_overlay(direction);
		}
	}
	return f.dot;
});

// transit_tube.dm:146
rt.def("/obj/structure/transit_tube/proc/create_tube_overlay", function create_tube_overlay(f: Frame, direction: Value, shift_dir: Value) {
	let tube_overlay: Value = new_(T("/image"), { dir: direction });
	if (shift_dir) {
		tube_overlay.icon_state = "decorative_diag";
		if (shift_dir === 1) {
			tube_overlay.pixel_y = 32;
		} else if (shift_dir === 2) {
			tube_overlay.pixel_y = -32;
		} else if (shift_dir === 4) {
			tube_overlay.pixel_x = 32;
		} else if (shift_dir === 8) {
			tube_overlay.pixel_x = -32;
		}
	} else {
		tube_overlay.icon_state = "decorative";
	}
	this.add_overlay(tube_overlay);
	return f.dot;
});

rt.type(12904, "/obj/structure/transit_tube/diagonal", "/obj/structure/transit_tube", {
	icon_state: "diagonal",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/diagonal"),
});

// transit_tube.dm:175
rt.def("/obj/structure/transit_tube/diagonal/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	if (this.dir === 1) {
		this.tube_dirs = list(5, 10);
	} else if (this.dir === 2) {
		this.tube_dirs = list(5, 10);
	} else if (this.dir === 4) {
		this.tube_dirs = list(9, 6);
	} else if (this.dir === 8) {
		this.tube_dirs = list(9, 6);
	}
	return f.dot;
});

rt.type(12908, "/obj/structure/transit_tube/curved", "/obj/structure/transit_tube", {
	icon_state: "curved0",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/curved"),
});

// transit_tube.dm:204
rt.def("/obj/structure/transit_tube/curved/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	if (this.dir === 1) {
		this.tube_dirs = list(1, 10);
	} else if (this.dir === 2) {
		this.tube_dirs = list(2, 5);
	} else if (this.dir === 4) {
		this.tube_dirs = list(4, 9);
	} else if (this.dir === 8) {
		this.tube_dirs = list(6, 8);
	}
	return f.dot;
});

rt.type(12909, "/obj/structure/transit_tube/curved/flipped", "/obj/structure/transit_tube/curved", {
	icon_state: "curved1",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/curved/flipped"),
});

// transit_tube.dm:219
rt.def("/obj/structure/transit_tube/curved/flipped/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	if (this.dir === 1) {
		this.tube_dirs = list(1, 6);
	} else if (this.dir === 2) {
		this.tube_dirs = list(2, 9);
	} else if (this.dir === 4) {
		this.tube_dirs = list(4, 10);
	} else if (this.dir === 8) {
		this.tube_dirs = list(5, 8);
	}
	return f.dot;
});

rt.type(12910, "/obj/structure/transit_tube/junction", "/obj/structure/transit_tube", {
	icon_state: "junction0",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/junction"),
});

// transit_tube.dm:235
rt.def("/obj/structure/transit_tube/junction/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	if (this.dir === 1) {
		this.tube_dirs = list(1, 6, 10);
	} else if (this.dir === 2) {
		this.tube_dirs = list(2, 9, 5);
	} else if (this.dir === 4) {
		this.tube_dirs = list(4, 10, 9);
	} else if (this.dir === 8) {
		this.tube_dirs = list(8, 5, 6);
	}
	return f.dot;
});

rt.type(12911, "/obj/structure/transit_tube/junction/flipped", "/obj/structure/transit_tube/junction", {
	icon_state: "junction1",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/junction/flipped"),
});

// transit_tube.dm:250
rt.def("/obj/structure/transit_tube/junction/flipped/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	if (this.dir === 1) {
		this.tube_dirs = list(1, 10, 6);
	} else if (this.dir === 2) {
		this.tube_dirs = list(2, 5, 9);
	} else if (this.dir === 4) {
		this.tube_dirs = list(4, 9, 10);
	} else if (this.dir === 8) {
		this.tube_dirs = list(8, 6, 5);
	}
	return f.dot;
});
