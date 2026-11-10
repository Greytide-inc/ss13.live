// Based on /tg/station's code/game/shuttle_engines.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12125, "/obj/structure/shuttle", "/obj/structure", {
	name: "shuttle",
	icon: rt.rsc("icons/turf/shuttle.dmi"),
	resistance_flags: 35,
	obj_integrity: 500,
	max_integrity: 500,
	armor: null,
});

// shuttle_engines.dm:12
rt.def("/obj/structure/shuttle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 100, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 70]);
	return f.dot;
});

rt.type(12126, "/obj/structure/shuttle/engine", "/obj/structure/shuttle", {
	engine_power: 1,
	state: 2,
	anchored: 1,
	name: "engine",
	density: 1,
});

// shuttle_engines.dm:23
rt.def("/obj/structure/shuttle/engine/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame, user: Value, silent: Value) {
	if (this.state == 2) {
		if (!silent) {
			to_chat(user, `<span class='warning'>${this} is welded to the floor!</span>`);
		}
		return FAILED_UNFASTEN;
	}
	return parent_proc();
}, false);

// shuttle_engines.dm:30
rt.def("/obj/structure/shuttle/engine/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* parent_proc());
	if (f.dot != SUCCESSFUL_UNFASTEN) return f.dot;
	if (this.anchored) {
		this.state = 1;
	} else {
		this.state = 0;
	}
	return f.dot;
}, true, { args: ["user", "W", "time"] });

// shuttle_engines.dm:38
rt.def("/obj/structure/shuttle/engine/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let WT: Value = null;
	yield* this.add_fingerprint(user);
	if (yield* this.default_unfasten_wrench(user, I)) {
		return f.dot;
	} else if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
		WT = I;
		if (this.state === 0) {
			to_chat(user, `<span class='warning'>The ${this.name} needs to be wrenched to the floor!</span>`);
		} else if (this.state === EM_SECURED) {
			if (yield* WT.remove_fuel(0, user)) {
				playsound(this.loc, WT.usesound, 50, 1);
				user.visible_message(`${user.name} starts to weld the ${this.name} to the floor.`, fmt("<span class='notice'>You start to weld ％！ to the floor...</span>", [this]), "<span class='italics'>You hear welding.</span>");
				if ((yield* do_after(user, 200 * WT.toolspeed, { target: this })) && WT.isOn()) {
					this.state = 2;
					to_chat(user, fmt("<span class='notice'>You weld ％！ to the floor.</span>", [this]));
					this.alter_engine_power(this.engine_power);
				}
			}
		} else if (this.state === 2) {
			if (yield* WT.remove_fuel(0, user)) {
				playsound(this.loc, WT.usesound, 50, 1);
				user.visible_message(`${user.name} starts to cut the ${this.name} free from the floor.`, fmt("<span class='notice'>You start to cut ％！ free from the floor...</span>", [this]), "<span class='italics'>You hear welding.</span>");
				if ((yield* do_after(user, 200 * WT.toolspeed, { target: this })) && WT.isOn()) {
					this.state = 1;
					to_chat(user, fmt("<span class='notice'>You cut ％！ free from the floor.</span>", [this]));
					this.alter_engine_power(-this.engine_power);
				}
			}
		}
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
}, true);

// shuttle_engines.dm:71
rt.def("/obj/structure/shuttle/engine/proc/Destroy", function* Destroy(f: Frame) {
	if (this.state == 2) {
		this.alter_engine_power(-this.engine_power);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// shuttle_engines.dm:77
rt.def("/obj/structure/shuttle/engine/proc/alter_engine_power", function alter_engine_power(f: Frame, mod: Value) {
	let M: Value = null;
	if (mod == 0) {
		return f.dot;
	}
	if (!GLOB.SSshuttle.is_in_shuttle_bounds(this)) return f.dot;
	if (!(M = GLOB.SSshuttle.get_containing_shuttle(this))) return f.dot;
	M.alter_engines(mod);
	return f.dot;
});
