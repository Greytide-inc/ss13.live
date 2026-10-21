// From code/game/turfs/closed.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4450, "/turf/closed/indestructible/splashscreen", "/turf/closed/indestructible", {
	name: "Space Station 13",
	icon: rt.rsc("config/title_screens/images/blank.png"),
	icon_state: "",
	layer: 5,
});

// /turf/closed/indestructible/splashscreen/proc/New  (code/game/turfs/closed.dm:38)  may sleep
rt.def("/turf/closed/indestructible/splashscreen/proc/New", function* New(f: Frame) {
	rt.setFv(f, "splash_turf", rt.gl("SStitle"), live(f.src));
	if (truthy(rt.fv(f, "icon", rt.gl("SStitle")))) {
		rt.setSv(f, "icon", rt.fv(f, "icon", rt.gl("SStitle")));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /turf/closed/indestructible/splashscreen/proc/vv_edit_var  (code/game/turfs/closed.dm:43)
rt.def("/turf/closed/indestructible/splashscreen/proc/vv_edit_var", function vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) return f.dot;
	$0 = live(f.args[0]);
	if ($0 === "icon") {
		rt.setFv(f, "icon", rt.gl("SStitle"), rt.sv(f, "icon"));
	}
	return f.dot;
}, false, { args: ["var_name", "var_value"] });

rt.type(4459, "/turf/closed/indestructible/fakeglass", "/turf/closed/indestructible", {
	name: "window",
	icon_state: "fake_window",
	opacity: 0,
	smooth: 1,
	icon: rt.rsc("icons/obj/smooth_structures/reinforced_window.dmi"),
});

// /turf/closed/indestructible/fakeglass/proc/Initialize  (code/game/turfs/closed.dm:72)  may sleep
rt.def("/turf/closed/indestructible/fakeglass/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", null);
	rt.modSrcVar(f, "underlays", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/structures.dmi"), "grille"])), add);
	rt.modSrcVar(f, "underlays", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/turf/floors.dmi"), "plating"])), add);
	return f.dot;
}, true);

rt.type(4465, "/turf/closed/indestructible/necropolis", "/turf/closed/indestructible", {
	name: "necropolis wall",
	desc: "A seemingly impenetrable wall.",
	icon: rt.rsc("icons/turf/walls.dmi"),
	icon_state: "necro",
	explosion_block: 50,
	baseturf: rt.typePath("/turf/closed/indestructible/necropolis"),
});

// /turf/closed/indestructible/necropolis/proc/get_smooth_underlay_icon  (code/game/turfs/closed.dm:115)
rt.def("/turf/closed/indestructible/necropolis/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	rt.setFv(f, "icon", live(underlay_appearance), rt.rsc("icons/turf/floors.dmi"));
	rt.setFv(f, "icon_state", live(underlay_appearance), "necro1");
	return 1;
});

rt.type(4453, "/turf/closed/indestructible/riveted/boss", "/turf/closed/indestructible/riveted", {
	name: "necropolis wall",
	desc: "A thick, seemingly indestructible stone wall.",
	icon: rt.rsc("icons/turf/walls/boss_wall.dmi"),
	icon_state: "wall",
	canSmoothWith: null,
	explosion_block: 50,
	baseturf: rt.typePath("/turf/closed/indestructible/riveted/boss"),
});

// /turf/closed/indestructible/riveted/boss/proc/<init>  (code/game/turfs/closed.dm:124)
rt.def("/turf/closed/indestructible/riveted/boss/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/indestructible/riveted/boss"), T("/turf/closed/indestructible/riveted/boss/see_through")));
	return f.dot;
});

rt.type(4455, "/turf/closed/indestructible/riveted/boss/hot", "/turf/closed/indestructible/riveted/boss", {
	icon: rt.rsc("icons/turf/walls/boss_wall_hot.dmi"),
	canSmoothWith: null,
	baseturf: rt.typePath("/turf/closed/indestructible/riveted/boss/hot"),
});

// /turf/closed/indestructible/riveted/boss/hot/proc/<init>  (code/game/turfs/closed.dm:133)
rt.def("/turf/closed/indestructible/riveted/boss/hot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/indestructible/riveted/boss/hot")));
	return f.dot;
});

// /turf/closed/indestructible/riveted/boss/proc/get_smooth_underlay_icon  (code/game/turfs/closed.dm:137)
rt.def("/turf/closed/indestructible/riveted/boss/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	rt.setFv(f, "icon", live(underlay_appearance), rt.rsc("icons/turf/floors.dmi"));
	rt.setFv(f, "icon_state", live(underlay_appearance), "basalt");
	return 1;
});
