// Based on /tg/station's code/game/objects/structures/transit_tubes/station.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12899, "/obj/structure/transit_tube/station", "/obj/structure/transit_tube", {
	open_status: 2,
	pod_moving: 0,
	cooldown_delay: 50,
	launch_cooldown: 0,
	reverse_launch: 0,
	base_icon: "station0",
	boarding_dir: null,
	OPEN_DURATION: 6,
	CLOSE_DURATION: 6,
	name: "station tube station",
	icon_state: "closed_station0",
	exit_delay: 1,
	enter_delay: 2,
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/station"),
}, { const: ["OPEN_DURATION","CLOSE_DURATION"] });

// station.dm:25
rt.def("/obj/structure/transit_tube/station/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// station.dm:29
rt.def("/obj/structure/transit_tube/station/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// station.dm:36
rt.def("/obj/structure/transit_tube/station/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let pod: Value = null;
	if (!(!this.pod_moving && this.open_status == STATION_TUBE_OPEN && ismob(AM) && AM.dir == this.boarding_dir)) return f.dot;
	for (pod of each(this.loc, T("/obj/structure/transit_tube_pod"))) {
		if (!pod.moving) {
			yield* AM.forceMove(pod);
			yield* pod.update_icon();
			return f.dot;
		}
	}
	return f.dot;
}, true);

// station.dm:46
rt.def("/obj/structure/transit_tube/station/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, R: Value, user: Value) {
	let pod: Value = null;
	if (!user.canmove || user.stat || user.restrained()) {
		return f.dot;
	}
	if (!rt.istype(R, T("/obj/structure/c_transit_tube_pod")) || get_dist(user, this) > 1 || get_dist(this, R) > 1) {
		return f.dot;
	}
	for (pod of each(this.loc, T("/obj/structure/transit_tube_pod"))) {
		return f.dot;
	}
	let TP: Value = (yield* new_(T("/obj/structure/transit_tube_pod"), this.loc));
	R.transfer_fingerprints_to(TP);
	yield* TP.add_fingerprint(user);
	yield* TP.setDir(turn(this.dir, -90));
	user.visible_message(`${user} inserts ${R}.`, `<span class='notice'>You insert ${R}.</span>`);
	yield* qdel(R);
	return f.dot;
}, true);

// station.dm:61
rt.def("/obj/structure/transit_tube/station/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let GM: Value = null, pod: Value = null, pod_0: Value = null, AM: Value = null;
	let $e: any;
	if (this.pod_moving) return f.dot;
	if (user.pulling && user.a_intent == "grab" && rt.istype(user.pulling, T("/mob/living"))) {
		if (this.open_status == 0) {
			GM = user.pulling;
			if (user.grab_state >= 1) {
				if (GM.buckled || GM.has_buckled_mobs()) {
					to_chat(user, `<span class='warning'>${GM} is attached to something!</span>`);
					return f.dot;
				}
				rt.forList(f, 0, this.loc, T("/obj/structure/transit_tube_pod"));
				if (($e = rt.next(f, 0)) !== undefined) {
					pod = $e;
					pod.visible_message(`<span class='warning'>${user} starts putting ${GM} into the ${pod}!</span>`);
					if (yield* do_after(user, 15, { target: this })) {
						if (this.open_status == STATION_TUBE_OPEN && GM && user.grab_state >= 1 && user.pulling == GM && !GM.buckled && !GM.has_buckled_mobs()) {
							yield* GM.Knockdown(100);
							yield* this.Bumped(GM);
						}
					}
				}
				rt.endFor(f, 0);
			}
		}
	} else {
		rt.forList(f, 0, this.loc, T("/obj/structure/transit_tube_pod"));
		if (($e = rt.next(f, 0)) !== undefined) {
			pod_0 = $e;
			if (!pod_0.moving && rt.isIn(f, pod_0.dir, this.tube_dirs)) {
				if (this.open_status == STATION_TUBE_CLOSED) {
					this.open_animation();
				} else if (this.open_status == STATION_TUBE_OPEN) {
					if (rt.len(f, pod_0.contents) && user.loc != pod_0) {
						user.visible_message(`${user} starts emptying ${pod_0}'s contents onto the floor.`, `<span class='notice'>You start emptying ${pod_0}'s contents onto the floor...</span>`);
						if (yield* do_after(user, 10, { target: this })) {
							if (pod_0 && pod_0.loc == this.loc) {
								for (AM of each(pod_0, T("/atom/movable"))) {
									yield* AM.forceMove(rt.getStep(f, user, 0));
								}
							}
						}
					} else {
						this.close_animation();
					}
				}
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// station.dm:96
rt.def("/obj/structure/transit_tube/station/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _P: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
		for (_P of each(this.loc, T("/obj/structure/transit_tube_pod"))) {
			yield* _P.deconstruct(0, user);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// station.dm:103
rt.def("/obj/structure/transit_tube/station/proc/open_animation", function open_animation(f: Frame) {
	if (this.open_status != STATION_TUBE_CLOSED) return f.dot;
	this.icon_state = `opening_${this.base_icon}`;
	this.open_status = 1;
	rt.spawnTail(f, 6, "/obj/structure/transit_tube/station/proc/open_animation: spawn at game/objects/structures/transit_tubes/station.dm:106");
	return f.dot;
});

// a spawn(6) body of /obj/structure/transit_tube/station/proc/open_animation, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/transit_tube/station/proc/open_animation: spawn at game/objects/structures/transit_tubes/station.dm:106", function* (f: Frame) {
	if (this.open_status == 1) {
		this.icon_state = `open_${this.base_icon}`;
		this.open_status = 0;
	}
	return null;
});

// station.dm:113
rt.def("/obj/structure/transit_tube/station/proc/close_animation", function close_animation(f: Frame) {
	if (this.open_status != STATION_TUBE_OPEN) return f.dot;
	this.icon_state = `closing_${this.base_icon}`;
	this.open_status = 3;
	rt.spawnTail(f, 6, "/obj/structure/transit_tube/station/proc/close_animation: spawn at game/objects/structures/transit_tubes/station.dm:116");
	return f.dot;
});

// a spawn(6) body of /obj/structure/transit_tube/station/proc/close_animation, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/transit_tube/station/proc/close_animation: spawn at game/objects/structures/transit_tubes/station.dm:116", function* (f: Frame) {
	if (this.open_status == 3) {
		this.icon_state = `closed_${this.base_icon}`;
		this.open_status = 2;
	}
	return null;
});

// station.dm:123
rt.def("/obj/structure/transit_tube/station/proc/launch_pod", function* launch_pod(f: Frame) {
	let pod: Value = null;
	if (this.launch_cooldown >= rt.worldTime(f)) {
		return f.dot;
	}
	for (pod of each(this.loc, T("/obj/structure/transit_tube_pod"))) {
		if (!pod.moving) {
			this.pod_moving = 1;
			this.close_animation();
			yield* sleep(8);
			if (this.open_status == STATION_TUBE_CLOSED && pod && pod.loc == this.loc) {
				yield* pod.follow_tube();
			}
			this.pod_moving = 0;
			return 1;
		}
	}
	return 0;
}, true);

// station.dm:137
rt.def("/obj/structure/transit_tube/station/proc/process", function* process(f: Frame) {
	if (this.pod_moving) return f.dot;
	yield* this.launch_pod();
	return f.dot;
}, true, { waitfor: false });

// station.dm:142
rt.def("/obj/structure/transit_tube/station/proc/pod_stopped", function pod_stopped(f: Frame, pod: Value, from_dir: Value) {
	this.pod_moving = 1;
	rt.spawnTail(f, 5, "/obj/structure/transit_tube/station/proc/pod_stopped: spawn at game/objects/structures/transit_tubes/station.dm:142", pod, from_dir);
	return f.dot;
});

// a spawn(5) body of /obj/structure/transit_tube/station/proc/pod_stopped, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/transit_tube/station/proc/pod_stopped: spawn at game/objects/structures/transit_tubes/station.dm:142", function* (f: Frame, pod: Value, from_dir: Value) {
	if (this.reverse_launch) {
		yield* pod.setDir(rt.index(this.tube_dirs, 1));
	}
	this.launch_cooldown = rt.worldTime(f) + this.cooldown_delay;
	this.open_animation();
	yield* sleep(8);
	this.pod_moving = 0;
	if (!(!pod || pod.gc_destroyed)) {
		pod.air_contents.share(this.loc.return_air());
	}
	return null;
});

// station.dm:153
rt.def("/obj/structure/transit_tube/station/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	if (this.dir === 1) {
		this.tube_dirs = list(4, 8);
	} else if (this.dir === 2) {
		this.tube_dirs = list(4, 8);
	} else if (this.dir === 4) {
		this.tube_dirs = list(1, 2);
	} else if (this.dir === 8) {
		this.tube_dirs = list(1, 2);
	}
	this.boarding_dir = turn(this.dir, 180);
	return f.dot;
});

rt.type(12900, "/obj/structure/transit_tube/station/flipped", "/obj/structure/transit_tube/station", {
	base_icon: "station1",
	icon_state: "closed_station1",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/station/flipped"),
});

// station.dm:171
rt.def("/obj/structure/transit_tube/station/flipped/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	parent_proc();
	this.boarding_dir = this.dir;
	return f.dot;
});

rt.type(12901, "/obj/structure/transit_tube/station/reverse", "/obj/structure/transit_tube/station", {
	reverse_launch: 1,
	base_icon: "terminus0",
	icon_state: "closed_terminus0",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/station/reverse"),
});

// station.dm:183
rt.def("/obj/structure/transit_tube/station/reverse/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	if (this.dir === 1) {
		this.tube_dirs = list(4);
	} else if (this.dir === 2) {
		this.tube_dirs = list(8);
	} else if (this.dir === 4) {
		this.tube_dirs = list(2);
	} else if (this.dir === 8) {
		this.tube_dirs = list(1);
	}
	this.boarding_dir = turn(this.dir, 180);
	return f.dot;
});

rt.type(12902, "/obj/structure/transit_tube/station/reverse/flipped", "/obj/structure/transit_tube/station/reverse", {
	base_icon: "terminus1",
	icon_state: "closed_terminus1",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/station/reverse/flipped"),
});

// station.dm:200
rt.def("/obj/structure/transit_tube/station/reverse/flipped/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	parent_proc();
	this.boarding_dir = this.dir;
	return f.dot;
});
