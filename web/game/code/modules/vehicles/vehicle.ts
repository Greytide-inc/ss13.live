// Based on /tg/station's code/modules/vehicles/vehicle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(13057, "/obj/vehicle", "/obj", {
	auto_door_open: 1,
	view_range: 7,
	riding_datum: null,
	anchored: 0,
	can_buckle: 1,
	buckle_lying: 0,
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
	name: "vehicle",
	desc: "A basic vehicle, vroom",
	icon: rt.rsc("icons/obj/vehicles.dmi"),
	icon_state: "fuckyou",
	density: 1,
});

// vehicle.dm:13
rt.def("/obj/vehicle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 30, "laser", 30, "energy", 0, "bomb", 30, "bio", 0, "rad", 0, "fire", 60, "acid", 60]);
	return f.dot;
});

// vehicle.dm:19
rt.def("/obj/vehicle/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.riding_datum);
	this.riding_datum = null;
	return (yield* parent_proc());
}, true);

// vehicle.dm:35
rt.def("/obj/vehicle/proc/unbuckle_mob", function* unbuckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!this.riding_datum) return f.dot;
	yield* this.riding_datum.restore_position(f.args[0]);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["buckled_mob", "force"] });

// vehicle.dm:40
rt.def("/obj/vehicle/proc/user_buckle_mob", function* user_buckle_mob(f: Frame, M: Value, user: Value) {
	let A: Value = null;
	if (user.incapacitated()) {
		return f.dot;
	}
	for (A of each(rt.getStep(f, this, 0), T("/atom/movable"))) {
		if (A.density) {
			if (A != this && A != M) {
				return f.dot;
			}
		}
	}
	M.loc = rt.getStep(f, this, 0);
	yield* parent_proc();
	if (user.client) {
		yield* user.client.change_view(user.client.default_view());
	}
	if (!this.riding_datum) return f.dot;
	this.riding_datum.ridden = this;
	yield* this.riding_datum.handle_vehicle_offsets();
	return f.dot;
}, true);

// vehicle.dm:57
rt.def("/obj/vehicle/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	if (!this.riding_datum) return f.dot;
	yield* this.riding_datum.handle_ride(user, direction);
	return f.dot;
}, true);

// vehicle.dm:61
rt.def("/obj/vehicle/proc/Moved", function* Moved(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.riding_datum) return f.dot;
	this.riding_datum.handle_vehicle_layer();
	yield* this.riding_datum.handle_vehicle_offsets();
	return f.dot;
}, true);

// vehicle.dm:68
rt.def("/obj/vehicle/proc/Bump", function* Bump(f: Frame, M: Value) {
	let m: Value = null;
	f.dot = (yield* parent_proc());
	if (!this.auto_door_open) return f.dot;
	if (!(rt.istype(M, T("/obj/machinery/door")) && this.has_buckled_mobs())) return f.dot;
	for (m of each(this.buckled_mobs)) {
		yield* M.Bumped(m);
	}
	return f.dot;
}, true);

// vehicle.dm:76
rt.def("/obj/vehicle/proc/Process_Spacemove", function Process_Spacemove(f: Frame, direction: Value) {
	if (this.has_gravity()) {
		return 1;
	}
	if (this.pulledby && this.pulledby.loc != this.loc) {
		return 1;
	}
	return 0;
});

// vehicle.dm:89
rt.def("/obj/vehicle/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[2] == "melee" && f.args[0] < 20) {
		return 0;
	}
	f.dot = parent_proc();
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// vehicle.dm:94
rt.def("/obj/vehicle/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 5);
	yield* qdel(this);
	return f.dot;
}, true);

// vehicle.dm:98
rt.def("/obj/vehicle/proc/examine", function examine(f: Frame, user: Value) {
	let healthpercent: Value = null;
	parent_proc();
	if (rt.bitAnd(this.resistance_flags, INDESTRUCTIBLE)) return f.dot;
	if (rt.bitAnd(this.resistance_flags, 8)) {
		to_chat(user, "<span class='warning'>It's on fire!</span>");
	}
	const subject = (healthpercent = this.obj_integrity / this.max_integrity * 100);
	if (rt.inRange(subject, 50, 99)) {
		to_chat(user, "It looks slightly damaged.");
	} else if (rt.inRange(subject, 25, 50)) {
		to_chat(user, "It appears heavily damaged.");
	} else if (rt.inRange(subject, 0, 25)) {
		to_chat(user, "<span class='warning'>It's falling apart!</span>");
	}
	return f.dot;
}, false);
