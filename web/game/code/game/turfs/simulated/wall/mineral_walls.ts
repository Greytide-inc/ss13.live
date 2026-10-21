// From code/game/turfs/simulated/wall/mineral_walls.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4416, "/turf/closed/wall/mineral", "/turf/closed/wall", {
	last_event: 0,
	active: null,
	name: "mineral wall",
	desc: "This shouldn't exist",
	icon_state: "",
	canSmoothWith: null,
	smooth: 1,
});

// /turf/closed/wall/mineral/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:7)
rt.def("/turf/closed/wall/mineral/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", null);
	return f.dot;
});

rt.type(4420, "/turf/closed/wall/mineral/gold", "/turf/closed/wall/mineral", {
	name: "gold wall",
	desc: "A wall with gold plating. Swag!",
	icon: rt.rsc("icons/turf/walls/gold_wall.dmi"),
	icon_state: "gold",
	explosion_block: 0,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/gold"),
});

// /turf/closed/wall/mineral/gold/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:19)
rt.def("/turf/closed/wall/mineral/gold/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/gold"), T("/obj/structure/falsewall/gold")));
	return f.dot;
});

rt.type(4421, "/turf/closed/wall/mineral/silver", "/turf/closed/wall/mineral", {
	name: "silver wall",
	desc: "A wall with silver plating. Shiny!",
	icon: rt.rsc("icons/turf/walls/silver_wall.dmi"),
	icon_state: "silver",
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/silver"),
});

// /turf/closed/wall/mineral/silver/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:29)
rt.def("/turf/closed/wall/mineral/silver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/silver"), T("/obj/structure/falsewall/silver")));
	return f.dot;
});

rt.type(4422, "/turf/closed/wall/mineral/diamond", "/turf/closed/wall/mineral", {
	name: "diamond wall",
	desc: "A wall with diamond plating. You monster.",
	icon: rt.rsc("icons/turf/walls/diamond_wall.dmi"),
	icon_state: "diamond",
	slicing_duration: 200,
	explosion_block: 3,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
});

// /turf/closed/wall/mineral/diamond/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:39)
rt.def("/turf/closed/wall/mineral/diamond/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/diamond"), T("/obj/structure/falsewall/diamond")));
	return f.dot;
});

rt.type(4423, "/turf/closed/wall/mineral/clown", "/turf/closed/wall/mineral", {
	name: "bananium wall",
	desc: "A wall with bananium plating. Honk!",
	icon: rt.rsc("icons/turf/walls/bananium_wall.dmi"),
	icon_state: "bananium",
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/bananium"),
});

// /turf/closed/wall/mineral/clown/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:50)
rt.def("/turf/closed/wall/mineral/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/clown"), T("/obj/structure/falsewall/clown")));
	return f.dot;
});

rt.type(4424, "/turf/closed/wall/mineral/sandstone", "/turf/closed/wall/mineral", {
	name: "sandstone wall",
	desc: "A wall with sandstone plating. Rough.",
	icon: rt.rsc("icons/turf/walls/sandstone_wall.dmi"),
	icon_state: "sandstone",
	explosion_block: 0,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/sandstone"),
});

// /turf/closed/wall/mineral/sandstone/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:59)
rt.def("/turf/closed/wall/mineral/sandstone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/sandstone"), T("/obj/structure/falsewall/sandstone")));
	return f.dot;
});

rt.type(4425, "/turf/closed/wall/mineral/uranium", "/turf/closed/wall/mineral", {
	name: "uranium wall",
	desc: "A wall with uranium plating. This is probably a bad idea.",
	icon: rt.rsc("icons/turf/walls/uranium_wall.dmi"),
	icon_state: "uranium",
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/uranium"),
});

// /turf/closed/wall/mineral/uranium/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:67)
rt.def("/turf/closed/wall/mineral/uranium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/uranium"), T("/obj/structure/falsewall/uranium")));
	return f.dot;
});

// /turf/closed/wall/mineral/uranium/proc/radiate  (code/game/turfs/simulated/wall/mineral_walls.dm:70)  may sleep
rt.def("/turf/closed/wall/mineral/uranium/proc/radiate", function* radiate(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	if (!truthy(rt.sv(f, "active"))) {
		if (rt.gt(rt.worldTime(f), add(rt.sv(f, "last_event"), 15))) {
			rt.setSv(f, "active", 1);
			yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.src), 0), 3, 3, 4, 0]);
			_T = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, live(f.src)])), T("/turf/closed/wall/mineral/uranium"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				yield* g.callName(f, live(_T), "radiate", []);
			}
			rt.endFor(f, 0);
			rt.setSv(f, "last_event", rt.worldTime(f));
			rt.setSv(f, "active", null);
			return live(f.dot);
		}
	}
	return live(f.dot);
}, true);

// /turf/closed/wall/mineral/uranium/proc/attack_hand  (code/game/turfs/simulated/wall/mineral_walls.dm:82)  may sleep
rt.def("/turf/closed/wall/mineral/uranium/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.srcCall(f, "radiate");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /turf/closed/wall/mineral/uranium/proc/attackby  (code/game/turfs/simulated/wall/mineral_walls.dm:86)  may sleep
rt.def("/turf/closed/wall/mineral/uranium/proc/attackby", function* attackby(f: Frame) {
	yield* g.srcCall(f, "radiate");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /turf/closed/wall/mineral/uranium/proc/Bumped  (code/game/turfs/simulated/wall/mineral_walls.dm:90)  may sleep
rt.def("/turf/closed/wall/mineral/uranium/proc/Bumped", function* Bumped(f: Frame) {
	yield* g.srcCall(f, "radiate");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM"] });

rt.type(4426, "/turf/closed/wall/mineral/plasma", "/turf/closed/wall/mineral", {
	name: "plasma wall",
	desc: "A wall with plasma plating. This is definitely a bad idea.",
	icon: rt.rsc("icons/turf/walls/plasma_wall.dmi"),
	icon_state: "plasma",
	thermal_conductivity: 0.04,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
});

// /turf/closed/wall/mineral/plasma/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:100)
rt.def("/turf/closed/wall/mineral/plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/plasma"), T("/obj/structure/falsewall/plasma")));
	return f.dot;
});

// /turf/closed/wall/mineral/plasma/proc/attackby  (code/game/turfs/simulated/wall/mineral_walls.dm:103)  may sleep
rt.def("/turf/closed/wall/mineral/plasma/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (rt.gt((yield* g.callName(f, live(f.args[0]), "is_hot", [])), 300)) {
		$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.args[1])]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.args[1])])]);
		if (truthy(live(f.src))) {
			$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])]);
		} else {
			$1 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Plasma wall ignited by ＀ in ＀", [$0, fmt("＀", [$1])]), 0, 1]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("Plasma wall ignited by ＀ in ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
		yield* g.srcCall(f, "ignite", (yield* g.callName(f, live(f.args[0]), "is_hot", [])));
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /turf/closed/wall/mineral/plasma/proc/PlasmaBurn  (code/game/turfs/simulated/wall/mineral_walls.dm:111)  may sleep
rt.def("/turf/closed/wall/mineral/plasma/proc/PlasmaBurn", function* PlasmaBurn(f: Frame, temperature: Value) {
	let _T: Value = null;
	f.vars = () => [temperature, _T];
	yield* g.new_(f, rt.sv(f, "girder_type"), [live(f.src)]);
	yield* g.callName(f, live(f.src), "ChangeTurf", [T("/turf/open/floor/plasteel")]);
	yield* g.callName(f, (_T = live(f.src)), "atmos_spawn_air", [fmt("plasma=400;TEMP=＀", [live(temperature)])]);
	return f.dot;
}, true);

// /turf/closed/wall/mineral/plasma/proc/temperature_expose  (code/game/turfs/simulated/wall/mineral_walls.dm:117)  may sleep
rt.def("/turf/closed/wall/mineral/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "PlasmaBurn", live(exposed_temperature));
	return f.dot;
}, true);

// /turf/closed/wall/mineral/plasma/proc/ignite  (code/game/turfs/simulated/wall/mineral_walls.dm:121)  may sleep
rt.def("/turf/closed/wall/mineral/plasma/proc/ignite", function* ignite(f: Frame, exposed_temperature: Value) {
	f.vars = () => [exposed_temperature];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "PlasmaBurn", live(exposed_temperature));
	return f.dot;
}, true);

// /turf/closed/wall/mineral/plasma/proc/bullet_act  (code/game/turfs/simulated/wall/mineral_walls.dm:125)  may sleep
rt.def("/turf/closed/wall/mineral/plasma/proc/bullet_act", function* bullet_act(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/beam")) ? 1 : 0))) {
		yield* g.srcCall(f, "PlasmaBurn", 2500);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/ion")) ? 1 : 0))) {
			yield* g.srcCall(f, "PlasmaBurn", 500);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["Proj"] });

rt.type(4427, "/turf/closed/wall/mineral/wood", "/turf/closed/wall/mineral", {
	name: "wooden wall",
	desc: "A wall with wooden plating. Stiff.",
	icon: rt.rsc("icons/turf/walls/wood_wall.dmi"),
	icon_state: "wood",
	hardness: 70,
	explosion_block: 0,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
});

// /turf/closed/wall/mineral/wood/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:140)
rt.def("/turf/closed/wall/mineral/wood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/wood"), T("/obj/structure/falsewall/wood")));
	return f.dot;
});

rt.type(4417, "/turf/closed/wall/mineral/iron", "/turf/closed/wall/mineral", {
	name: "rough metal wall",
	desc: "A wall with rough metal plating.",
	icon: rt.rsc("icons/turf/walls/iron_wall.dmi"),
	icon_state: "iron",
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/rods"),
});

// /turf/closed/wall/mineral/iron/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:148)
rt.def("/turf/closed/wall/mineral/iron/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/iron"), T("/obj/structure/falsewall/iron")));
	return f.dot;
});

rt.type(4428, "/turf/closed/wall/mineral/snow", "/turf/closed/wall/mineral", {
	name: "packed snow wall",
	desc: "A wall made of densely packed snow blocks.",
	icon: rt.rsc("icons/turf/walls/snow_wall.dmi"),
	icon_state: "snow",
	hardness: 80,
	explosion_block: 0,
	slicing_duration: 30,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/snow"),
	girder_type: null,
});

// /turf/closed/wall/mineral/snow/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:159)
rt.def("/turf/closed/wall/mineral/snow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", null);
	return f.dot;
});

rt.type(4429, "/turf/closed/wall/mineral/abductor", "/turf/closed/wall/mineral", {
	name: "alien wall",
	desc: "A wall with alien alloy plating.",
	icon: rt.rsc("icons/turf/walls/abductor_wall.dmi"),
	icon_state: "abductor",
	smooth: 5,
	slicing_duration: 200,
	explosion_block: 3,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
});

// /turf/closed/wall/mineral/abductor/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:171)
rt.def("/turf/closed/wall/mineral/abductor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/abductor"), T("/obj/structure/falsewall/abductor")));
	return f.dot;
});

rt.type(4430, "/turf/closed/wall/mineral/titanium", "/turf/closed/wall/mineral", {
	name: "wall",
	desc: "A light-weight titanium wall used in shuttles.",
	icon: rt.rsc("icons/turf/walls/shuttle_wall.dmi"),
	icon_state: "map-shuttle",
	flags: 36,
	smooth: 6,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/titanium"),
});

// /turf/closed/wall/mineral/titanium/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:181)
rt.def("/turf/closed/wall/mineral/titanium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/titanium"), T("/obj/machinery/door/airlock/shuttle"), T("/obj/machinery/door/airlock"), T("/turf/closed/wall/shuttle"), T("/obj/structure/window/shuttle"), T("/obj/structure/shuttle/engine/heater"), T("/obj/structure/falsewall/titanium")));
	return f.dot;
});

rt.type(4433, "/turf/closed/wall/mineral/titanium/overspace", "/turf/closed/wall/mineral/titanium", {
	icon_state: "map-overspace",
	fixed_underlay: null,
});

// /turf/closed/wall/mineral/titanium/overspace/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:194)
rt.def("/turf/closed/wall/mineral/titanium/overspace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "fixed_underlay", rt.alist(f, ["space", 1]));
	return f.dot;
});

rt.type(4434, "/turf/closed/wall/mineral/titanium/interior", "/turf/closed/wall/mineral/titanium", {});

// /turf/closed/wall/mineral/titanium/interior/proc/copyTurf  (code/game/turfs/simulated/wall/mineral_walls.dm:199)  may sleep
rt.def("/turf/closed/wall/mineral/titanium/interior/proc/copyTurf", function* copyTurf(f: Frame, _T: Value) {
	f.vars = () => [_T];
	if (!isEqual(rt.fv(f, "type", live(_T)), rt.sv(f, "type"))) {
		yield* g.callName(f, live(_T), "ChangeTurf", [rt.sv(f, "type")]);
		if (truthy(rt.len(f, rt.sv(f, "underlays")))) {
			rt.setFv(f, "underlays", live(_T), rt.sv(f, "underlays"));
		}
	}
	if (!isEqual(rt.fv(f, "icon_state", live(_T)), rt.sv(f, "icon_state"))) {
		rt.setFv(f, "icon_state", live(_T), rt.sv(f, "icon_state"));
	}
	if (!isEqual(rt.fv(f, "icon", live(_T)), rt.sv(f, "icon"))) {
		rt.setFv(f, "icon", live(_T), rt.sv(f, "icon"));
	}
	if (truthy(rt.sv(f, "color"))) {
		rt.setFv(f, "atom_colours", live(_T), (yield* g.callName(f, rt.sv(f, "atom_colours"), "Copy", [])));
		yield* g.callName(f, live(_T), "update_atom_colour", []);
	}
	if (!isEqual(rt.fv(f, "dir", live(_T)), rt.sv(f, "dir"))) {
		rt.setFv(f, "dir", live(_T), rt.sv(f, "dir"));
	}
	rt.setFv(f, "transform", live(_T), rt.sv(f, "transform"));
	return live(_T);
}, true);

// /turf/closed/wall/mineral/titanium/proc/copyTurf  (code/game/turfs/simulated/wall/mineral_walls.dm:216)  may sleep
rt.def("/turf/closed/wall/mineral/titanium/proc/copyTurf", function* copyTurf(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "transform", live(f.args[0]), rt.sv(f, "transform"));
	return f.dot;
}, true, { args: ["T"] });

rt.type(4435, "/turf/closed/wall/mineral/titanium/survival", "/turf/closed/wall/mineral/titanium", {
	name: "pod wall",
	desc: "An easily-compressable wall used for temporary shelter.",
	icon: rt.rsc("icons/turf/walls/survival_pod_walls.dmi"),
	icon_state: "smooth",
	smooth: 6,
	canSmoothWith: null,
});

// /turf/closed/wall/mineral/titanium/survival/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:225)
rt.def("/turf/closed/wall/mineral/titanium/survival/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/titanium/survival"), T("/obj/machinery/door/airlock/survival_pod"), T("/obj/structure/window/shuttle/survival_pod"), T("/obj/structure/shuttle/engine")));
	return f.dot;
});

rt.type(4437, "/turf/closed/wall/mineral/titanium/survival/pod", "/turf/closed/wall/mineral/titanium/survival", {
	canSmoothWith: null,
});

// /turf/closed/wall/mineral/titanium/survival/pod/proc/<init>  (code/game/turfs/simulated/wall/mineral_walls.dm:231)
rt.def("/turf/closed/wall/mineral/titanium/survival/pod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/titanium/survival"), T("/obj/machinery/door/airlock"), T("/obj/structure/window/fulltile"), T("/obj/structure/window/reinforced/fulltile"), T("/obj/structure/window/reinforced/tinted/fulltile"), T("/obj/structure/window/shuttle"), T("/obj/structure/shuttle/engine")));
	return f.dot;
});

rt.type(4439, "/turf/closed/wall/mineral/plastitanium/interior", "/turf/closed/wall/mineral/plastitanium", {});

// /turf/closed/wall/mineral/plastitanium/interior/proc/copyTurf  (code/game/turfs/simulated/wall/mineral_walls.dm:243)  may sleep
rt.def("/turf/closed/wall/mineral/plastitanium/interior/proc/copyTurf", function* copyTurf(f: Frame, _T: Value) {
	f.vars = () => [_T];
	if (!isEqual(rt.fv(f, "type", live(_T)), rt.sv(f, "type"))) {
		yield* g.callName(f, live(_T), "ChangeTurf", [rt.sv(f, "type")]);
		if (truthy(rt.len(f, rt.sv(f, "underlays")))) {
			rt.setFv(f, "underlays", live(_T), rt.sv(f, "underlays"));
		}
	}
	if (!isEqual(rt.fv(f, "icon_state", live(_T)), rt.sv(f, "icon_state"))) {
		rt.setFv(f, "icon_state", live(_T), rt.sv(f, "icon_state"));
	}
	if (!isEqual(rt.fv(f, "icon", live(_T)), rt.sv(f, "icon"))) {
		rt.setFv(f, "icon", live(_T), rt.sv(f, "icon"));
	}
	if (truthy(rt.sv(f, "color"))) {
		rt.setFv(f, "atom_colours", live(_T), (yield* g.callName(f, rt.sv(f, "atom_colours"), "Copy", [])));
		yield* g.callName(f, live(_T), "update_atom_colour", []);
	}
	if (!isEqual(rt.fv(f, "dir", live(_T)), rt.sv(f, "dir"))) {
		rt.setFv(f, "dir", live(_T), rt.sv(f, "dir"));
	}
	rt.setFv(f, "transform", live(_T), rt.sv(f, "transform"));
	return live(_T);
}, true);

rt.type(4438, "/turf/closed/wall/mineral/plastitanium", "/turf/closed/wall/mineral", {
	name: "wall",
	desc: "An evil wall of plasma and titanium.",
	icon: rt.rsc("icons/turf/shuttle.dmi"),
	icon_state: "wall3",
	smooth: 0,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/plastitanium"),
});

// /turf/closed/wall/mineral/plastitanium/proc/copyTurf  (code/game/turfs/simulated/wall/mineral_walls.dm:260)  may sleep
rt.def("/turf/closed/wall/mineral/plastitanium/proc/copyTurf", function* copyTurf(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "transform", live(f.args[0]), rt.sv(f, "transform"));
	return f.dot;
}, true, { args: ["T"] });
