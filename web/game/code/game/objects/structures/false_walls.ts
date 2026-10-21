// From code/game/objects/structures/false_walls.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12172, "/obj/structure/falsewall", "/obj/structure", {
	mineral: rt.typePath("/obj/item/stack/sheet/metal"),
	mineral_amount: 2,
	walltype: rt.typePath("/turf/closed/wall"),
	opening: 0,
	girder_type: rt.typePath("/obj/structure/girder/displaced"),
	anchored: 1,
	canSmoothWith: null,
	smooth: 1,
	can_be_unanchored: 0,
	CanAtmosPass: -2,
	name: "wall",
	desc: "A huge chunk of metal used to separate rooms.",
	icon: rt.rsc("icons/turf/walls/wall.dmi"),
	icon_state: "wall",
	density: 1,
	opacity: 1,
	obj_integrity: 100,
	max_integrity: 100,
});

// /obj/structure/falsewall/proc/<init>  (code/game/objects/structures/false_walls.dm:20)
rt.def("/obj/structure/falsewall/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall"), T("/turf/closed/wall/r_wall"), T("/obj/structure/falsewall"), T("/obj/structure/falsewall/brass"), T("/obj/structure/falsewall/reinforced"), T("/turf/closed/wall/rust"), T("/turf/closed/wall/r_wall/rust"), T("/turf/closed/wall/clockwork")));
	return f.dot;
});

// /obj/structure/falsewall/proc/New  (code/game/objects/structures/false_walls.dm:34)  may sleep
rt.def("/obj/structure/falsewall/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "air_update_turf", 1);
	return f.dot;
}, true, { args: ["loc"] });

// /obj/structure/falsewall/proc/Destroy  (code/game/objects/structures/false_walls.dm:39)  may sleep
rt.def("/obj/structure/falsewall/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "density", 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/falsewall/proc/ratvar_act  (code/game/objects/structures/false_walls.dm:43)  may sleep
rt.def("/obj/structure/falsewall/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* g.new_(f, T("/obj/structure/falsewall/brass"), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/falsewall/proc/attack_hand  (code/game/objects/structures/false_walls.dm:52)  may sleep
rt.def("/obj/structure/falsewall/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let srcturf: Value = null, obstacle: Value = null;
	let $e: any;
	f.vars = () => [user, srcturf, obstacle, $e];
	if (truthy(rt.sv(f, "opening"))) {
		return live(f.dot);
	}
	rt.setSv(f, "opening", 1);
	if (truthy(rt.sv(f, "density"))) {
		yield* g.srcCall(f, "do_the_flick");
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		if (!(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
			rt.setSv(f, "density", 0);
			yield* g.srcCall(f, "set_opacity", 0);
			yield* g.srcCall(f, "update_icon");
		}
	} else {
		srcturf = rt.getStep(f, live(f.src), 0);
		obstacle = null;
		rt.forList(f, 0, live(srcturf), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			obstacle = $e;
			rt.setSv(f, "opening", 0);
			return live(f.dot);
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "do_the_flick");
		rt.setSv(f, "density", 1);
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		if (!(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
			yield* g.srcCall(f, "set_opacity", 1);
			yield* g.srcCall(f, "update_icon");
		}
	}
	yield* g.srcCall(f, "air_update_turf", 1);
	rt.setSv(f, "opening", 0);
	return f.dot;
}, true);

// /obj/structure/falsewall/proc/do_the_flick  (code/game/objects/structures/false_walls.dm:75)
rt.def("/obj/structure/falsewall/proc/do_the_flick", function do_the_flick(f: Frame) {
	if (truthy(rt.sv(f, "density"))) {
		rt.setSv(f, "smooth", 0);
		rt.callSrc(f, "clear_smooth_overlays", []);
		rt.setSv(f, "icon_state", "fwall_opening");
	} else {
		rt.setSv(f, "icon_state", "fwall_closing");
	}
	return f.dot;
});

// /obj/structure/falsewall/proc/update_icon  (code/game/objects/structures/false_walls.dm:83)
rt.def("/obj/structure/falsewall/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "density"))) {
		rt.setSv(f, "smooth", 1);
		rt.call(f, P("/proc/queue_smooth"), null, [live(f.src)]);
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	} else {
		rt.setSv(f, "icon_state", "fwall_open");
	}
	return f.dot;
});

// /obj/structure/falsewall/proc/ChangeToWall  (code/game/objects/structures/false_walls.dm:89)  may sleep
rt.def("/obj/structure/falsewall/proc/ChangeToWall", function* ChangeToWall(f: Frame, _delete: Value) {
	let _T: Value = null;
	f.vars = () => [_delete, _T];
	if (live(_delete) === null) {
		_delete = 1;
	}
	yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "ChangeTurf", [rt.sv(f, "walltype")]);
	if (truthy(live(_delete))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return live(_T);
}, true);

// /obj/structure/falsewall/proc/attackby  (code/game/objects/structures/false_walls.dm:97)  may sleep
rt.def("/obj/structure/falsewall/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, WT: Value = null, D: Value = null;
	f.vars = () => [_T, WT, D];
	if (truthy(rt.sv(f, "opening"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must wait until the door has stopped moving!</span>"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "density"))) {
			if (truthy(rt.gv(f, "density", (_T = rt.getStep(f, live(f.src), 0))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is blocked!</span>", [live(f.src)])]);
				return live(f.dot);
			}
			if (!truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ bolts must be tightened on the floor!</span>", [live(f.src)])]);
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ tightens some bolts on the wall.</span>", [live(f.args[1])]), "<span class='notice'>You tighten the bolts on the wall.</span>"]);
			yield* g.srcCall(f, "ChangeToWall");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't reach, close it first!</span>"]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
				yield* g.srcCall(f, "dismantle", live(f.args[1]), 1);
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gun/energy/plasmacutter")) ? 1 : 0))) {
				yield* g.srcCall(f, "dismantle", live(f.args[1]), 1);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pickaxe/drill/jackhammer")) ? 1 : 0))) {
					yield* g.callName(f, (D = live(f.args[0])), "playDigSound", []);
					yield* g.srcCall(f, "dismantle", live(f.args[1]), 1);
				} else {
					return (yield* g.callSuper(f, [], rt.Args.Same));
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/falsewall/proc/dismantle  (code/game/objects/structures/false_walls.dm:128)  may sleep
rt.def("/obj/structure/falsewall/proc/dismantle", function* dismantle(f: Frame, user: Value, disassembled: Value) {
	f.vars = () => [user, disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ dismantles the false wall.</span>", [live(user)]), "<span class='notice'>You dismantle the false wall.</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	yield* g.srcCall(f, "deconstruct", live(disassembled));
	return f.dot;
}, true);

// /obj/structure/falsewall/proc/deconstruct  (code/game/objects/structures/false_walls.dm:133)  may sleep
rt.def("/obj/structure/falsewall/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [disassembled, i, $e];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(live(disassembled))) {
			yield* g.new_(f, rt.sv(f, "girder_type"), [rt.sv(f, "loc")]);
		}
		if (truthy(rt.sv(f, "mineral_amount"))) {
			i = null;
			rt.forRange(f, 0, 1, rt.sv(f, "mineral_amount"), 1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				yield* g.new_(f, rt.sv(f, "mineral"), [rt.sv(f, "loc")]);
			}
			rt.endFor(f, 0);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/falsewall/proc/examine_status  (code/game/objects/structures/false_walls.dm:145)
rt.def("/obj/structure/falsewall/proc/examine_status", function examine_status(f: Frame, user: Value) {
	return null;
});

rt.type(12176, "/obj/structure/falsewall/uranium", "/obj/structure/falsewall", {
	active: null,
	last_event: 0,
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/uranium"),
	walltype: rt.typePath("/turf/closed/wall/mineral/uranium"),
	canSmoothWith: null,
	name: "uranium wall",
	desc: "A wall with uranium plating. This is probably a bad idea.",
	icon: rt.rsc("icons/turf/walls/uranium_wall.dmi"),
	icon_state: "uranium",
});

// /obj/structure/falsewall/uranium/proc/<init>  (code/game/objects/structures/false_walls.dm:172)
rt.def("/obj/structure/falsewall/uranium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/falsewall/uranium"), T("/turf/closed/wall/mineral/uranium")));
	return f.dot;
});

// /obj/structure/falsewall/uranium/proc/attackby  (code/game/objects/structures/false_walls.dm:175)  may sleep
rt.def("/obj/structure/falsewall/uranium/proc/attackby", function* attackby(f: Frame) {
	yield* g.srcCall(f, "radiate");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/structure/falsewall/uranium/proc/attack_hand  (code/game/objects/structures/false_walls.dm:179)  may sleep
rt.def("/obj/structure/falsewall/uranium/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.srcCall(f, "radiate");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/falsewall/uranium/proc/radiate  (code/game/objects/structures/false_walls.dm:183)  may sleep
rt.def("/obj/structure/falsewall/uranium/proc/radiate", function* radiate(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	if (!truthy(rt.sv(f, "active"))) {
		if (rt.gt(rt.worldTime(f), add(rt.sv(f, "last_event"), 15))) {
			rt.setSv(f, "active", 1);
			yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.src), 0), 0, 3, 15, 1]);
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

rt.type(12177, "/obj/structure/falsewall/gold", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/gold"),
	walltype: rt.typePath("/turf/closed/wall/mineral/gold"),
	canSmoothWith: null,
	name: "gold wall",
	desc: "A wall with gold plating. Swag!",
	icon: rt.rsc("icons/turf/walls/gold_wall.dmi"),
	icon_state: "gold",
});

// /obj/structure/falsewall/gold/proc/<init>  (code/game/objects/structures/false_walls.dm:204)
rt.def("/obj/structure/falsewall/gold/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/falsewall/gold"), T("/turf/closed/wall/mineral/gold")));
	return f.dot;
});

rt.type(12178, "/obj/structure/falsewall/silver", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/silver"),
	walltype: rt.typePath("/turf/closed/wall/mineral/silver"),
	canSmoothWith: null,
	name: "silver wall",
	desc: "A wall with silver plating. Shiny.",
	icon: rt.rsc("icons/turf/walls/silver_wall.dmi"),
	icon_state: "silver",
});

// /obj/structure/falsewall/silver/proc/<init>  (code/game/objects/structures/false_walls.dm:213)
rt.def("/obj/structure/falsewall/silver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/falsewall/silver"), T("/turf/closed/wall/mineral/silver")));
	return f.dot;
});

rt.type(12179, "/obj/structure/falsewall/diamond", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
	walltype: rt.typePath("/turf/closed/wall/mineral/diamond"),
	canSmoothWith: null,
	name: "diamond wall",
	desc: "A wall with diamond plating. You monster.",
	icon: rt.rsc("icons/turf/walls/diamond_wall.dmi"),
	icon_state: "diamond",
	obj_integrity: 800,
	max_integrity: 800,
});

// /obj/structure/falsewall/diamond/proc/<init>  (code/game/objects/structures/false_walls.dm:222)
rt.def("/obj/structure/falsewall/diamond/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/falsewall/diamond"), T("/turf/closed/wall/mineral/diamond")));
	return f.dot;
});

rt.type(12180, "/obj/structure/falsewall/plasma", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
	walltype: rt.typePath("/turf/closed/wall/mineral/plasma"),
	canSmoothWith: null,
	name: "plasma wall",
	desc: "A wall with plasma plating. This is definitely a bad idea.",
	icon: rt.rsc("icons/turf/walls/plasma_wall.dmi"),
	icon_state: "plasma",
});

// /obj/structure/falsewall/plasma/proc/<init>  (code/game/objects/structures/false_walls.dm:233)
rt.def("/obj/structure/falsewall/plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/falsewall/plasma"), T("/turf/closed/wall/mineral/plasma")));
	return f.dot;
});

// /obj/structure/falsewall/plasma/proc/attackby  (code/game/objects/structures/false_walls.dm:236)  may sleep
rt.def("/obj/structure/falsewall/plasma/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null;
	let $0: any, $1: any;
	f.vars = () => [_T, $0, $1];
	if (rt.gt((yield* g.callName(f, live(f.args[0]), "is_hot", [])), 300)) {
		_T = rt.getStep(f, live(f.src), 0);
		$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.args[1])]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.args[1])])]);
		if (truthy(live(_T))) {
			$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		} else {
			$1 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Plasma falsewall ignited by ＀ in ＀", [$0, fmt("＀", [$1])]), 0, 1]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("Plasma falsewall ignited by ＀ in ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
		yield* g.srcCall(f, "burnbabyburn");
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/falsewall/plasma/proc/burnbabyburn  (code/game/objects/structures/false_walls.dm:245)  may sleep
rt.def("/obj/structure/falsewall/plasma/proc/burnbabyburn", function* burnbabyburn(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	yield* g.srcCall(f, "atmos_spawn_air", "plasma=400;TEMP=1000");
	yield* g.new_(f, T("/obj/structure/girder/displaced"), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/falsewall/plasma/proc/temperature_expose  (code/game/objects/structures/false_walls.dm:251)  may sleep
rt.def("/obj/structure/falsewall/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "burnbabyburn");
	return f.dot;
}, true);

rt.type(12181, "/obj/structure/falsewall/clown", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/bananium"),
	walltype: rt.typePath("/turf/closed/wall/mineral/clown"),
	canSmoothWith: null,
	name: "bananium wall",
	desc: "A wall with bananium plating. Honk!",
	icon: rt.rsc("icons/turf/walls/bananium_wall.dmi"),
	icon_state: "bananium",
});

// /obj/structure/falsewall/clown/proc/<init>  (code/game/objects/structures/false_walls.dm:261)
rt.def("/obj/structure/falsewall/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/falsewall/clown"), T("/turf/closed/wall/mineral/clown")));
	return f.dot;
});

rt.type(12182, "/obj/structure/falsewall/sandstone", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/sandstone"),
	walltype: rt.typePath("/turf/closed/wall/mineral/sandstone"),
	canSmoothWith: null,
	name: "sandstone wall",
	desc: "A wall with sandstone plating. Rough.",
	icon: rt.rsc("icons/turf/walls/sandstone_wall.dmi"),
	icon_state: "sandstone",
});

// /obj/structure/falsewall/sandstone/proc/<init>  (code/game/objects/structures/false_walls.dm:271)
rt.def("/obj/structure/falsewall/sandstone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/falsewall/sandstone"), T("/turf/closed/wall/mineral/sandstone")));
	return f.dot;
});

rt.type(12183, "/obj/structure/falsewall/wood", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	walltype: rt.typePath("/turf/closed/wall/mineral/wood"),
	canSmoothWith: null,
	name: "wooden wall",
	desc: "A wall with wooden plating. Stiff.",
	icon: rt.rsc("icons/turf/walls/wood_wall.dmi"),
	icon_state: "wood",
});

// /obj/structure/falsewall/wood/proc/<init>  (code/game/objects/structures/false_walls.dm:280)
rt.def("/obj/structure/falsewall/wood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/falsewall/wood"), T("/turf/closed/wall/mineral/wood")));
	return f.dot;
});

rt.type(12173, "/obj/structure/falsewall/iron", "/obj/structure/falsewall", {
	canSmoothWith: null,
	name: "rough metal wall",
	desc: "A wall with rough metal plating.",
	icon: rt.rsc("icons/turf/walls/iron_wall.dmi"),
	icon_state: "iron",
	mineral: rt.typePath("/obj/item/stack/rods"),
	walltype: rt.typePath("/turf/closed/wall/mineral/iron"),
});

// /obj/structure/falsewall/iron/proc/<init>  (code/game/objects/structures/false_walls.dm:289)
rt.def("/obj/structure/falsewall/iron/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/falsewall/iron"), T("/turf/closed/wall/mineral/iron")));
	return f.dot;
});

rt.type(12184, "/obj/structure/falsewall/abductor", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
	walltype: rt.typePath("/turf/closed/wall/mineral/abductor"),
	canSmoothWith: null,
	name: "alien wall",
	desc: "A wall with alien alloy plating.",
	icon: rt.rsc("icons/turf/walls/abductor_wall.dmi"),
	icon_state: "abductor",
});

// /obj/structure/falsewall/abductor/proc/<init>  (code/game/objects/structures/false_walls.dm:298)
rt.def("/obj/structure/falsewall/abductor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/falsewall/abductor"), T("/turf/closed/wall/mineral/abductor")));
	return f.dot;
});

rt.type(12185, "/obj/structure/falsewall/titanium", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/titanium"),
	walltype: rt.typePath("/turf/closed/wall/mineral/titanium"),
	smooth: 2,
	name: "wall",
	desc: "A light-weight titanium wall used in shuttles.",
	icon: rt.rsc("icons/turf/walls/shuttle_wall.dmi"),
	icon_state: "shuttle",
	canSmoothWith: null,
});

// /obj/structure/falsewall/titanium/proc/<init>  (code/game/objects/structures/false_walls.dm:308)
rt.def("/obj/structure/falsewall/titanium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/titanium"), T("/obj/machinery/door/airlock/shuttle"), T("/obj/machinery/door/airlock"), T("/turf/closed/wall/shuttle"), T("/obj/structure/window/shuttle"), T("/obj/structure/shuttle/engine"), T("/obj/structure/shuttle/engine/heater")));
	return f.dot;
});

rt.type(12175, "/obj/structure/falsewall/brass", "/obj/structure/falsewall", {
	canSmoothWith: null,
	name: "clockwork wall",
	desc: "A huge chunk of warm metal. The clanging of machinery emanates from within.",
	icon: rt.rsc("icons/turf/walls/clockwork_wall.dmi"),
	icon_state: "clockwork_wall",
	resistance_flags: 34,
	mineral_amount: 1,
	walltype: rt.typePath("/turf/closed/wall/clockwork"),
	mineral: rt.typePath("/obj/item/stack/tile/brass"),
	girder_type: rt.typePath("/obj/structure/destructible/clockwork/wall_gear/displaced"),
});

// /obj/structure/falsewall/brass/proc/<init>  (code/game/objects/structures/false_walls.dm:326)
rt.def("/obj/structure/falsewall/brass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/effect/clockwork/overlay/wall"), T("/obj/structure/falsewall/brass")));
	return f.dot;
});

// /obj/structure/falsewall/brass/proc/New  (code/game/objects/structures/false_walls.dm:332)  may sleep
rt.def("/obj/structure/falsewall/brass/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/wall/false"), [(_T = rt.getStep(f, live(f.src), 0))]);
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/beam/falsewall"), [live(_T)]);
	yield* g.call(f, P("/proc/change_construction_value"), null, [4]);
	return f.dot;
}, true, { args: ["loc"] });

// /obj/structure/falsewall/brass/proc/Destroy  (code/game/objects/structures/false_walls.dm:339)  may sleep
rt.def("/obj/structure/falsewall/brass/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/change_construction_value"), null, [-4]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/falsewall/brass/proc/ratvar_act  (code/game/objects/structures/false_walls.dm:344)
rt.def("/obj/structure/falsewall/brass/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (!truthy(rt.gl("ratvar_awakens"))) return f.dot;
	rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
	return f.dot;
});
