// Based on /tg/station's code/modules/vehicles/speedbike.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(13069, "/obj/vehicle/space/speedbike", "/obj/vehicle/space", {
	overlay_state: "cover_blue",
	name: "Speedbike",
	icon: rt.rsc("icons/obj/bike.dmi"),
	icon_state: "speedbike_blue",
	layer: 3.8,
}, { global: { overlay: 811 } });

// speedbike.dm:10
rt.def("/obj/vehicle/space/speedbike/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* parent_proc());
	this.riding_datum = (yield* new_(T("/datum/riding/space/speedbike")));
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// speedbike.dm:14
rt.def("/obj/vehicle/space/speedbike/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.overlay = (GLOB.overlay || mutable_appearance(this.icon, this.overlay_state, ABOVE_MOB_LAYER));
	this.add_overlay(GLOB.overlay);
	return f.dot;
}, true);

// speedbike.dm:19
rt.def("/obj/vehicle/space/speedbike/proc/Move", function* Move(f: Frame, newloc: Value, move_dir: Value) {
	if (this.has_buckled_mobs()) {
		yield* new_(T("/obj/effect/temp_visual/dir_setting/speedbike_trail"), this.loc, move_dir);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(13071, "/obj/vehicle/space/speedbike/speedwagon", "/obj/vehicle/space/speedbike", {
	crash_all: 0,
	overlay_state: "speedwagon_cover",
	max_buckled_mobs: 4,
	name: "BM Speedwagon",
	desc: "Push it to the limit, walk along the razor's edge.",
	icon: rt.rsc("icons/obj/car.dmi"),
	icon_state: "speedwagon",
	layer: 3.8,
	pixel_y: -48,
	pixel_x: -48,
});

// speedbike.dm:42
rt.def("/obj/vehicle/space/speedbike/speedwagon/proc/Bump", function* Bump(f: Frame, A: Value) {
	let H: Value = null;
	f.dot = (yield* parent_proc());
	if (!(A.density && this.has_buckled_mobs())) return f.dot;
	let throw_target: Value = get_edge_target_turf(A, this.dir);
	if (this.crash_all) {
		yield* A.throw_at(throw_target, 4, 3);
		this.visible_message(`<span class='danger'>${this} crashes into ${A}!</span>`);
		playsound(this, rt.rsc("sound/effects/bang.ogg"), 50, 1);
	}
	if (!rt.istype(A, T("/mob/living/carbon/human"))) return f.dot;
	yield* (H = A).Knockdown(100);
	yield* H.adjustStaminaLoss(30);
	yield* H.apply_damage(rand(20, 35), "brute");
	if (this.crash_all) return f.dot;
	yield* H.throw_at(throw_target, 4, 3);
	this.visible_message(`<span class='danger'>${this} crashes into ${H}!</span>`);
	playsound(this, rt.rsc("sound/effects/bang.ogg"), 50, 1);
	return f.dot;
}, true);

// speedbike.dm:60
rt.def("/obj/vehicle/space/speedbike/speedwagon/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* parent_proc());
	this.riding_datum = (yield* new_(T("/datum/riding/space/speedwagon")));
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// speedbike.dm:64
rt.def("/obj/vehicle/space/speedbike/speedwagon/proc/Moved", function* Moved(f: Frame) {
	let A: Value = null;
	f.dot = (yield* parent_proc());
	if (!this.has_buckled_mobs()) return f.dot;
	for (A of each(range(2, this), T("/atom"))) {
		if (!rt.isIn(f, A, this.buckled_mobs)) {
			yield* this.Bump(A);
		}
	}
	return f.dot;
}, true);
