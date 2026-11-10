// Based on /tg/station's code/modules/power/tracker.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10324, "/obj/machinery/power/tracker", "/obj/machinery/power", {
	id: 0,
	sun_angle: 0,
	control: null,
	anchored: 1,
	name: "solar tracker",
	desc: "A solar directional tracker.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "tracker",
	density: 1,
	use_power: 0,
	obj_integrity: 250,
	max_integrity: 250,
	integrity_failure: 50,
});

// tracker.dm:23
rt.def("/obj/machinery/power/tracker/proc/New", function* New(f: Frame, loc: Value, S: Value) {
	yield* parent_proc(loc);
	yield* this.Make(S);
	yield* this.connect_to_network();
	return f.dot;
}, true);

// tracker.dm:28
rt.def("/obj/machinery/power/tracker/proc/Destroy", function* Destroy(f: Frame) {
	this.unset_control();
	return (yield* parent_proc());
}, true);

// tracker.dm:33
rt.def("/obj/machinery/power/tracker/proc/set_control", function set_control(f: Frame, SC: Value) {
	if (!SC || get_dist(this, SC) > SOLAR_MAX_DIST) {
		return 0;
	}
	this.control = SC;
	SC.connected_tracker = this;
	return 1;
});

// tracker.dm:42
rt.def("/obj/machinery/power/tracker/proc/unset_control", function unset_control(f: Frame) {
	if (this.control) {
		this.control.connected_tracker = null;
	}
	this.control = null;
	return f.dot;
});

// tracker.dm:46
rt.def("/obj/machinery/power/tracker/proc/Make", function* Make(f: Frame, S: Value) {
	if (!S) {
		(S = (yield* new_(T("/obj/item/solar_assembly"), this))).glass_type = T("/obj/item/stack/sheet/glass");
		S.tracker = 1;
		S.anchored = 1;
	}
	S.loc = this;
	yield* this.update_icon();
	return f.dot;
}, true);

// tracker.dm:56
rt.def("/obj/machinery/power/tracker/proc/set_angle", function set_angle(f: Frame, angle: Value) {
	this.sun_angle = angle;
	this.setDir(turn(1, -angle - 22.5));
	if (!(this.powernet && this.powernet == this.control.powernet)) return f.dot;
	this.control.currentdir = angle;
	return f.dot;
});

// tracker.dm:66
rt.def("/obj/machinery/power/tracker/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
		playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
		user.visible_message(`${user} begins to take the glass off the solar tracker.`, "<span class='notice'>You begin to take the glass off the solar tracker...</span>");
		if (yield* do_after(user, 50 * W.toolspeed, { target: this })) {
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			user.visible_message(`${user} takes the glass off the tracker.`, "<span class='notice'>You take the glass off the tracker.</span>");
			yield* this.deconstruct(1);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// tracker.dm:77
rt.def("/obj/machinery/power/tracker/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(!rt.bitAnd(this.stat, 1) && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	playsound(this.loc, rt.rsc("sound/effects/glassbr3.ogg"), 100, 1);
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.unset_control();
	return f.dot;
});

// tracker.dm:83
rt.def("/obj/machinery/power/solar/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let S: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (disassembled) {
			if (S = rt.locateIn(f, T("/obj/item/solar_assembly"), this)) {
				yield* S.forceMove(this.loc);
				yield* S.give_glass(rt.bitAnd(this.stat, 1));
			}
		} else {
			playsound(this, "shatter", 70, 1);
			yield* new_(T("/obj/item/weapon/shard"), this.loc);
			yield* new_(T("/obj/item/weapon/shard"), this.loc);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);
