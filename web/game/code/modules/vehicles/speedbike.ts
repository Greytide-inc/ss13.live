// From code/modules/vehicles/speedbike.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13069, "/obj/vehicle/space/speedbike", "/obj/vehicle/space", {
	overlay_state: "cover_blue",
	name: "Speedbike",
	icon: rt.rsc("icons/obj/bike.dmi"),
	icon_state: "speedbike_blue",
	layer: 3.8,
}, { global: { overlay: 811 } });

// /obj/vehicle/space/speedbike/proc/buckle_mob  (code/modules/vehicles/speedbike.dm:10)  may sleep
rt.def("/obj/vehicle/space/speedbike/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "riding_datum", (yield* g.new_(f, T("/datum/riding/space/speedbike"), [])));
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// /obj/vehicle/space/speedbike/proc/New  (code/modules/vehicles/speedbike.dm:14)  may sleep
rt.def("/obj/vehicle/space/speedbike/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setGl("overlay", (rt.gl("overlay") || (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), rt.sv(f, "overlay_state"), 4.099999904632568]))));
	yield* g.srcCall(f, "add_overlay", rt.gl("overlay"));
	return f.dot;
}, true);

// /obj/vehicle/space/speedbike/proc/Move  (code/modules/vehicles/speedbike.dm:19)  may sleep
rt.def("/obj/vehicle/space/speedbike/proc/Move", function* Move(f: Frame) {
	if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/speedbike_trail"), [rt.sv(f, "loc"), live(f.args[1])]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["newloc", "move_dir"] });

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

// /obj/vehicle/space/speedbike/speedwagon/proc/Bump  (code/modules/vehicles/speedbike.dm:42)  may sleep
rt.def("/obj/vehicle/space/speedbike/speedwagon/proc/Bump", function* Bump(f: Frame) {
	let throw_target: Value = null, H: Value = null;
	f.vars = () => [throw_target, H];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(rt.fv(f, "density", live(f.args[0]))) && truthy((yield* g.srcCall(f, "has_buckled_mobs"))))) return f.dot;
	throw_target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.args[0]), rt.fv(f, "dir", live(f.src))]));
	if (truthy(rt.sv(f, "crash_all"))) {
		yield* g.callName(f, live(f.args[0]), "throw_at", [live(throw_target), 4, 3]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ crashes into ＀!</span>", [live(f.src), live(f.args[0])]));
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/bang.ogg"), 50, 1]);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (H = live(f.args[0])), "Knockdown", [100]);
	yield* g.callName(f, live(H), "adjustStaminaLoss", [30]);
	yield* g.callName(f, live(H), "apply_damage", [(yield* g.call(f, P("/proc/rand"), null, [20, 35])), "brute"]);
	if (truthy(rt.sv(f, "crash_all"))) return f.dot;
	yield* g.callName(f, live(H), "throw_at", [live(throw_target), 4, 3]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ crashes into ＀!</span>", [live(f.src), live(H)]));
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/bang.ogg"), 50, 1]);
	return f.dot;
}, true, { args: ["A"] });

// /obj/vehicle/space/speedbike/speedwagon/proc/buckle_mob  (code/modules/vehicles/speedbike.dm:60)  may sleep
rt.def("/obj/vehicle/space/speedbike/speedwagon/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "riding_datum", (yield* g.new_(f, T("/datum/riding/space/speedwagon"), [])));
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// /obj/vehicle/space/speedbike/speedwagon/proc/Moved  (code/modules/vehicles/speedbike.dm:64)  may sleep
rt.def("/obj/vehicle/space/speedbike/speedwagon/proc/Moved", function* Moved(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((yield* g.callName(f, live(f.src), "has_buckled_mobs", [])))) return f.dot;
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [2, live(f.src)])), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (!truthy((rt.isIn(f, live(A), rt.fv(f, "buckled_mobs", live(f.src))) ? 1 : 0))) {
			yield* g.srcCall(f, "Bump", live(A));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
