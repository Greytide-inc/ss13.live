// Based on /tg/station's code/game/objects/structures/transit_tubes/transit_tube_pod.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12927, "/obj/structure/transit_tube_pod", "/obj/structure", {
	moving: 0,
	air_contents: null,
	anchored: 1,
	icon: rt.rsc("icons/obj/atmospherics/pipes/transit_tube.dmi"),
	icon_state: "pod",
	animate_movement: 1,
	density: 1,
	layer: 2.9,
});

// transit_tube_pod.dm:9
rt.def("/obj/structure/transit_tube_pod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.air_contents = new_(T("/datum/gas_mixture"));
	return f.dot;
});

// transit_tube_pod.dm:13
rt.def("/obj/structure/transit_tube_pod/proc/New", function* New(f: Frame, loc: Value) {
	yield* parent_proc();
	this.air_contents.assert_gases("o2", "n2");
	rt.setAt(rt.index(this.air_contents.gases, "o2"), 1, 43.67319);
	rt.setAt(rt.index(this.air_contents.gases, "n2"), 1, 82.1472);
	this.air_contents.temperature = T20C;
	return f.dot;
}, true);

// transit_tube_pod.dm:21
rt.def("/obj/structure/transit_tube_pod/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.empty_pod();
	return (yield* parent_proc());
}, true);

// transit_tube_pod.dm:25
rt.def("/obj/structure/transit_tube_pod/proc/update_icon", function update_icon(f: Frame) {
	if (rt.len(f, this.contents)) {
		this.icon_state = "pod_occupied";
	} else {
		this.icon_state = "pod";
	}
	return f.dot;
});

// transit_tube_pod.dm:31
rt.def("/obj/structure/transit_tube_pod/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
		if (!this.moving) {
			playsound(this.loc, I.usesound, 50, 1);
			if (rt.len(f, this.contents)) {
				user.visible_message(fmt("＀ empties ％！.", [user, this]), fmt("<span class='notice'>You empty ％！.</span>", [this]));
				yield* this.empty_pod();
			} else {
				yield* this.deconstruct(1, user);
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// transit_tube_pod.dm:43
rt.def("/obj/structure/transit_tube_pod/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value, user: Value) {
	let location: Value = null, R: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		location = rt.getStep(f, this, 0);
		if (user) {
			location = user.loc;
			yield* this.add_fingerprint(user);
			user.visible_message(`${user} removes ${this}.`, `<span class='notice'>You remove ${this}.</span>`);
		}
		this.transfer_fingerprints_to((R = (yield* new_(T("/obj/structure/c_transit_tube_pod"), location))));
		yield* R.setDir(this.dir);
		yield* this.empty_pod(location);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// transit_tube_pod.dm:56
rt.def("/obj/structure/transit_tube_pod/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* parent_proc();
	if (!this || this.gc_destroyed) return f.dot;
	yield* this.empty_pod();
	return f.dot;
}, true, { waitfor: false });

// transit_tube_pod.dm:61
rt.def("/obj/structure/transit_tube_pod/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	let AM: Value = null;
	for (AM of each(this.contents, T("/atom/movable"))) {
		AM.ex_act(severity, target);
	}
	return f.dot;
});

// transit_tube_pod.dm:65
rt.def("/obj/structure/transit_tube_pod/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (!(current_size >= STAGE_FIVE)) return f.dot;
	yield* this.deconstruct(0);
	return f.dot;
}, true);

// transit_tube_pod.dm:69
rt.def("/obj/structure/transit_tube_pod/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	if (this.moving) return f.dot;
	user.changeNext_move(100);
	user.last_special = rt.worldTime(f) + 100;
	to_chat(user, "<span class='notice'>You start trying to escape from the pod...</span>");
	if (!(yield* do_after(user, 600, { target: this }))) return f.dot;
	to_chat(user, "<span class='notice'>You manage to open the pod.</span>");
	yield* this.empty_pod();
	return f.dot;
}, true);

// transit_tube_pod.dm:78
rt.def("/obj/structure/transit_tube_pod/proc/empty_pod", function* empty_pod(f: Frame, location: Value) {
	let M: Value = null;
	if (!location) {
		location = rt.getStep(f, this, 0);
	}
	for (M of each(this.contents, T("/atom/movable"))) {
		yield* M.forceMove(location);
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// transit_tube_pod.dm:86
rt.def("/obj/structure/transit_tube_pod/proc/Process_Spacemove", function Process_Spacemove(f: Frame) {
	if (this.moving) {
		return 1;
	} else {
		return parent_proc();
	}
});

// transit_tube_pod.dm:102
rt.def("/obj/structure/transit_tube_pod/proc/follow_tube", function* follow_tube(f: Frame) {
	let current_tube: Value = null, next_dir: Value = null, next_loc: Value = null, exit_delay: Value = null, tube: Value = null, TT: Value = null;
	if (this.moving) {
		return f.dot;
	}
	this.moving = 1;
	let last_delay: Value = 0;
	for (tube of each(this.loc, T("/obj/structure/transit_tube"))) {
		if (tube.has_exit(this.dir)) {
			current_tube = tube;
			break;
		}
	}
	while (current_tube) {
		if (!(next_dir = current_tube.get_exit(this.dir))) {
			break;
		}
		last_delay += (exit_delay = current_tube.exit_delay(this, this.dir));
		yield* sleep(exit_delay);
		next_loc = rt.getStep(f, this.loc, next_dir);
		current_tube = null;
		tube = null;
		for (tube of each(next_loc, T("/obj/structure/transit_tube"))) {
			if (tube.has_entrance(next_dir)) {
				current_tube = tube;
				break;
			}
		}
		if (current_tube === null) {
			yield* this.setDir(next_dir);
			yield* this.Move(rt.getStep(f, this.loc, this.dir), this.dir);
			break;
		}
		yield* sleep((last_delay = current_tube.enter_delay(this, next_dir)));
		yield* this.setDir(next_dir);
		this.loc = next_loc;
		this.density = current_tube.density;
		if (current_tube && current_tube.should_stop_pod(this, next_dir)) {
			current_tube.pod_stopped(this, this.dir);
			break;
		}
	}
	this.density = 1;
	this.moving = 0;
	if (!(!(TT = rt.locateIn(f, T("/obj/structure/transit_tube"), this.loc)) || !rt.isIn(f, this.dir, TT.tube_dirs) && !rt.isIn(f, turn(this.dir, 180), TT.tube_dirs))) return f.dot;
	yield* this.deconstruct(0);
	return f.dot;
}, true, { waitfor: false });

// transit_tube_pod.dm:152
rt.def("/obj/structure/transit_tube_pod/proc/assume_air", function assume_air(f: Frame, giver: Value) {
	return this.air_contents.merge(giver);
});

// transit_tube_pod.dm:155
rt.def("/obj/structure/transit_tube_pod/proc/remove_air", function* remove_air(f: Frame, amount: Value) {
	return (yield* this.air_contents.remove(amount));
}, true);

// transit_tube_pod.dm:158
rt.def("/obj/structure/transit_tube_pod/proc/relaymove", function* relaymove(f: Frame, mob: Value, direction: Value) {
	let station: Value = null, TT: Value = null;
	if (!(rt.istype(mob, T("/mob")) && mob.client)) return f.dot;
	if (this.moving) return f.dot;
	for (station of each(this.loc, T("/obj/structure/transit_tube/station"))) {
		if (!station.pod_moving) {
			if (direction == turn(station.boarding_dir, 180)) {
				if (station.open_status == STATION_TUBE_OPEN) {
					yield* mob.forceMove(this.loc);
					yield* this.update_icon();
				} else {
					station.open_animation();
				}
			} else if (rt.isIn(f, direction, station.tube_dirs)) {
				yield* this.setDir(direction);
				yield* station.launch_pod();
			}
		}
		return f.dot;
	}
	for (TT of each(this.loc, T("/obj/structure/transit_tube"))) {
		if (rt.isIn(f, this.dir, TT.tube_dirs)) {
			if (TT.has_exit(direction)) {
				yield* this.setDir(direction);
				return f.dot;
			}
		}
	}
	return f.dot;
}, true);
