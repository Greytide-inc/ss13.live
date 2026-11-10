// Based on /tg/station's code/game/turfs/closed.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4450, "/turf/closed/indestructible/splashscreen", "/turf/closed/indestructible", {
	name: "Space Station 13",
	icon: rt.rsc("config/title_screens/images/blank.png"),
	icon_state: "",
	layer: 5,
});

// closed.dm:38
rt.def("/turf/closed/indestructible/splashscreen/proc/New", function* New(f: Frame) {
	GLOB.SStitle.splash_turf = this;
	if (GLOB.SStitle.icon) {
		this.icon = GLOB.SStitle.icon;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// closed.dm:43
rt.def("/turf/closed/indestructible/splashscreen/proc/vv_edit_var", function vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	f.dot = parent_proc();
	if (!f.dot) return f.dot;
	if (var_name === "icon") {
		GLOB.SStitle.icon = this.icon;
	}
	return f.dot;
}, false);

rt.type(4459, "/turf/closed/indestructible/fakeglass", "/turf/closed/indestructible", {
	name: "window",
	icon_state: "fake_window",
	opacity: 0,
	smooth: 1,
	icon: rt.rsc("icons/obj/smooth_structures/reinforced_window.dmi"),
});

// closed.dm:72
rt.def("/turf/closed/indestructible/fakeglass/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.icon_state = null;
	this.underlays += mutable_appearance(rt.rsc("icons/obj/structures.dmi"), "grille");
	this.underlays += mutable_appearance(rt.rsc("icons/turf/floors.dmi"), "plating");
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

// closed.dm:115
rt.def("/turf/closed/indestructible/necropolis/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	underlay_appearance.icon = rt.rsc("icons/turf/floors.dmi");
	underlay_appearance.icon_state = "necro1";
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

// closed.dm:124
rt.def("/turf/closed/indestructible/riveted/boss/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/indestructible/riveted/boss"), T("/turf/closed/indestructible/riveted/boss/see_through"));
	return f.dot;
});

rt.type(4455, "/turf/closed/indestructible/riveted/boss/hot", "/turf/closed/indestructible/riveted/boss", {
	icon: rt.rsc("icons/turf/walls/boss_wall_hot.dmi"),
	canSmoothWith: null,
	baseturf: rt.typePath("/turf/closed/indestructible/riveted/boss/hot"),
});

// closed.dm:133
rt.def("/turf/closed/indestructible/riveted/boss/hot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/indestructible/riveted/boss/hot"));
	return f.dot;
});

// closed.dm:137
rt.def("/turf/closed/indestructible/riveted/boss/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	underlay_appearance.icon = rt.rsc("icons/turf/floors.dmi");
	underlay_appearance.icon_state = "basalt";
	return 1;
});
