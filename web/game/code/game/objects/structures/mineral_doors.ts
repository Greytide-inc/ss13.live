// From code/game/objects/structures/mineral_doors.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12795, "/obj/structure/mineral_door", "/obj/structure", {
	initial_state: null,
	state: 0,
	isSwitchingStates: 0,
	close_delay: -1,
	sheetType: rt.typePath("/obj/item/stack/sheet/metal"),
	sheetAmount: 7,
	openSound: rt.rsc("sound/effects/stonedoor_openclose.ogg"),
	closeSound: rt.rsc("sound/effects/stonedoor_openclose.ogg"),
	anchored: 1,
	CanAtmosPass: -2,
	name: "metal door",
	density: 1,
	opacity: 1,
	icon: rt.rsc("icons/obj/doors/mineral_doors.dmi"),
	icon_state: "metal",
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
});

// /obj/structure/mineral_door/proc/<init>  (code/game/objects/structures/mineral_doors.dm:19)
rt.def("/obj/structure/mineral_door/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 100, "bomb", 10, "bio", 100, "rad", 100, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/structure/mineral_door/proc/New  (code/game/objects/structures/mineral_doors.dm:27)  may sleep
rt.def("/obj/structure/mineral_door/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "initial_state", rt.sv(f, "icon_state"));
	yield* g.srcCall(f, "air_update_turf", 1);
	return f.dot;
}, true, { args: ["location"] });

// /obj/structure/mineral_door/proc/Destroy  (code/game/objects/structures/mineral_doors.dm:33)  may sleep
rt.def("/obj/structure/mineral_door/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "density", 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/mineral_door/proc/Move  (code/game/objects/structures/mineral_doors.dm:37)  may sleep
rt.def("/obj/structure/mineral_door/proc/Move", function* Move(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.sv(f, "loc");
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "move_update_air", live(_T));
	return f.dot;
}, true);

// /obj/structure/mineral_door/proc/Bumped  (code/game/objects/structures/mineral_doors.dm:42)  may sleep
rt.def("/obj/structure/mineral_door/proc/Bumped", function* Bumped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "state"))) return f.dot;
	return (yield* g.srcCall(f, "TryToSwitchState", live(f.args[0])));
}, true, { args: ["user"] });

// /obj/structure/mineral_door/proc/attack_ai  (code/game/objects/structures/mineral_doors.dm:47)  may sleep
rt.def("/obj/structure/mineral_door/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		return live(f.dot);
	} else {
		if (!truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) return f.dot;
		if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(f.src)])), 1)) return f.dot;
		return (yield* g.srcCall(f, "TryToSwitchState", live(user)));
	}
	return f.dot;
}, true);

// /obj/structure/mineral_door/proc/attack_paw  (code/game/objects/structures/mineral_doors.dm:54)  may sleep
rt.def("/obj/structure/mineral_door/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "TryToSwitchState", live(user)));
}, true);

// /obj/structure/mineral_door/proc/attack_hand  (code/game/objects/structures/mineral_doors.dm:57)  may sleep
rt.def("/obj/structure/mineral_door/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "TryToSwitchState", live(user)));
}, true);

// /obj/structure/mineral_door/proc/CanPass  (code/game/objects/structures/mineral_doors.dm:60)
rt.def("/obj/structure/mineral_door/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if (truthy((rt.istype(live(mover), T("/obj/effect/beam")) ? 1 : 0))) {
		return (!truthy(rt.sv(f, "opacity")) ? 1 : 0);
	}
	return (!truthy(rt.sv(f, "density")) ? 1 : 0);
});

// /obj/structure/mineral_door/proc/TryToSwitchState  (code/game/objects/structures/mineral_doors.dm:67)  may sleep
rt.def("/obj/structure/mineral_door/proc/TryToSwitchState", function* TryToSwitchState(f: Frame, user: Value) {
	let M: Value = null, C: Value = null;
	f.vars = () => [user, M, C];
	if (truthy(rt.sv(f, "isSwitchingStates"))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
		M = live(user);
		if (rt.le(subtract(rt.worldTime(f), rt.fv(f, "last_bumped", live(M))), 60)) {
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "client", live(M)))) {
			if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
				if (!truthy(rt.gv(f, "handcuffed", (C = live(M))))) {
					yield* g.srcCall(f, "SwitchState");
				}
			} else {
				yield* g.srcCall(f, "SwitchState");
			}
		}
	} else {
		if (!truthy((rt.istype(live(user), T("/obj/mecha")) ? 1 : 0))) return f.dot;
		yield* g.srcCall(f, "SwitchState");
	}
	return f.dot;
}, true);

// /obj/structure/mineral_door/proc/SwitchState  (code/game/objects/structures/mineral_doors.dm:83)  may sleep
rt.def("/obj/structure/mineral_door/proc/SwitchState", function* SwitchState(f: Frame) {
	if (truthy(rt.sv(f, "state"))) {
		yield* g.srcCall(f, "Close");
	} else {
		yield* g.srcCall(f, "Open");
	}
	return f.dot;
}, true);

// /obj/structure/mineral_door/proc/Open  (code/game/objects/structures/mineral_doors.dm:89)  may sleep
rt.def("/obj/structure/mineral_door/proc/Open", function* Open(f: Frame) {
	rt.setSv(f, "isSwitchingStates", 1);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "openSound"), 100, 1]);
	yield* g.srcCall(f, "set_opacity", 0);
	yield* g.call(f, P("/proc/flick"), null, [fmt("＀opening", [rt.sv(f, "initial_state")]), live(f.src)]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	rt.setSv(f, "density", 0);
	rt.setSv(f, "state", 1);
	yield* g.srcCall(f, "air_update_turf", 1);
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "isSwitchingStates", 0);
	if (isEqual(rt.sv(f, "close_delay"), -1)) return f.dot;
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/mineral_door/proc/Close")])), rt.sv(f, "close_delay")]);
	return f.dot;
}, true);

// /obj/structure/mineral_door/proc/Close  (code/game/objects/structures/mineral_doors.dm:103)  may sleep
rt.def("/obj/structure/mineral_door/proc/Close", function* Close(f: Frame) {
	let _T: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [_T, L, $e];
	if ((truthy(rt.sv(f, "isSwitchingStates")) || !isEqual(rt.sv(f, "state"), 1))) {
		return live(f.dot);
	}
	_T = rt.getStep(f, live(f.src), 0);
	L = null;
	rt.forList(f, 0, live(_T), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		return live(f.dot);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "isSwitchingStates", 1);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "closeSound"), 100, 1]);
	yield* g.call(f, P("/proc/flick"), null, [fmt("＀closing", [rt.sv(f, "initial_state")]), live(f.src)]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	rt.setSv(f, "density", 1);
	yield* g.srcCall(f, "set_opacity", 1);
	rt.setSv(f, "state", 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "isSwitchingStates", 0);
	return f.dot;
}, true);

// /obj/structure/mineral_door/proc/update_icon  (code/game/objects/structures/mineral_doors.dm:121)
rt.def("/obj/structure/mineral_door/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "state"))) {
		rt.setSv(f, "icon_state", fmt("＀open", [rt.sv(f, "initial_state")]));
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "initial_state"));
	}
	return f.dot;
});

// /obj/structure/mineral_door/proc/attackby  (code/game/objects/structures/mineral_doors.dm:126)  may sleep
rt.def("/obj/structure/mineral_door/proc/attackby", function* attackby(f: Frame) {
	let digTool: Value = null;
	f.vars = () => [digTool];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pickaxe")) ? 1 : 0))) {
		digTool = live(f.args[0]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start digging the ＀...</span>", [rt.sv(f, "name")])]);
		if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(rt.fv(f, "digspeed", live(digTool)), add(1, (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "max_integrity"), 0.009999999776482582)])))), "target", live(f.src)], rt.Args.Named))) && truthy(live(f.src)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You finish digging.</span>"]);
			yield* g.srcCall(f, "deconstruct", 1);
		}
	} else {
		if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
			yield* g.srcCall(f, "attack_hand", live(f.args[1]));
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/mineral_door/proc/deconstruct  (code/game/objects/structures/mineral_doors.dm:138)  may sleep
rt.def("/obj/structure/mineral_door/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let _T: Value = null;
	f.vars = () => [disassembled, _T];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	_T = rt.getStep(f, live(f.src), 0);
	if (truthy(live(disassembled))) {
		yield* g.new_(f, rt.sv(f, "sheetType"), [live(_T), rt.sv(f, "sheetAmount")]);
	} else {
		yield* g.new_(f, rt.sv(f, "sheetType"), [live(_T), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "sheetAmount"), 2), 1]))]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12801, "/obj/structure/mineral_door/transparent", "/obj/structure/mineral_door", {
	opacity: 0,
});

// /obj/structure/mineral_door/transparent/proc/Close  (code/game/objects/structures/mineral_doors.dm:181)  may sleep
rt.def("/obj/structure/mineral_door/transparent/proc/Close", function* Close(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_opacity", 0);
	return f.dot;
}, true);

rt.type(12802, "/obj/structure/mineral_door/transparent/plasma", "/obj/structure/mineral_door/transparent", {
	sheetType: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
	name: "plasma door",
	icon_state: "plasma",
});

// /obj/structure/mineral_door/transparent/plasma/proc/attackby  (code/game/objects/structures/mineral_doors.dm:190)  may sleep
rt.def("/obj/structure/mineral_door/transparent/plasma/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null;
	let $0: any, $1: any;
	f.vars = () => [_T, $0, $1];
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_hot", [])))) {
		_T = rt.getStep(f, live(f.src), 0);
		$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.args[1])]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.args[1])])]);
		if (truthy(live(_T))) {
			$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		} else {
			$1 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Plasma mineral door ignited by ＀ in ＀", [$0, fmt("＀", [$1])]), 0, 1]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("Plasma mineral door ignited by ＀ in ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
		yield* g.srcCall(f, "TemperatureAct");
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/mineral_door/transparent/plasma/proc/temperature_expose  (code/game/objects/structures/mineral_doors.dm:199)  may sleep
rt.def("/obj/structure/mineral_door/transparent/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "TemperatureAct");
	return f.dot;
}, true);

// /obj/structure/mineral_door/transparent/plasma/proc/TemperatureAct  (code/game/objects/structures/mineral_doors.dm:203)  may sleep
rt.def("/obj/structure/mineral_door/transparent/plasma/proc/TemperatureAct", function* TemperatureAct(f: Frame) {
	yield* g.srcCall(f, "atmos_spawn_air", "plasma=500;TEMP=1000");
	yield* g.srcCall(f, "deconstruct", 0);
	return f.dot;
}, true);

rt.type(12805, "/obj/structure/mineral_door/paperframe", "/obj/structure/mineral_door", {
	openSound: rt.rsc("sound/effects/doorcreaky.ogg"),
	closeSound: rt.rsc("sound/effects/doorcreaky.ogg"),
	sheetType: rt.typePath("/obj/item/stack/sheet/paperframes"),
	sheetAmount: 3,
	name: "paper frame door",
	icon_state: "paperframe",
	resistance_flags: 4,
	obj_integrity: 20,
	max_integrity: 20,
});

// /obj/structure/mineral_door/paperframe/proc/Initialize  (code/game/objects/structures/mineral_doors.dm:235)
rt.def("/obj/structure/mineral_door/paperframe/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/queue_smooth_neighbors"), null, [live(f.src)]);
	return f.dot;
});

// /obj/structure/mineral_door/paperframe/proc/Destroy  (code/game/objects/structures/mineral_doors.dm:239)  may sleep
rt.def("/obj/structure/mineral_door/paperframe/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/queue_smooth_neighbors"), null, [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
