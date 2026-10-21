// From code/game/machinery/doors/windowdoor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10267, "/obj/machinery/door/window", "/obj/machinery/door", {
	base_state: "left",
	electronics: null,
	reinf: 0,
	shards: 2,
	rods: 2,
	cable: 2,
	debris: null,
	flags: 512,
	CanAtmosPass: -1,
	name: "interior door",
	desc: "A strong door.",
	icon: rt.rsc("icons/obj/doors/windoor.dmi"),
	icon_state: "left",
	layer: 3.3,
	closingLayer: 3.3,
	resistance_flags: 32,
	obj_integrity: 150,
	max_integrity: 150,
	integrity_failure: 0,
	armor: null,
	visible: 0,
	opacity: 0,
});

// /obj/machinery/door/window/proc/<init>  (code/game/machinery/doors/windowdoor.dm:23)
rt.def("/obj/machinery/door/window/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "debris", rt.list());
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 50, "laser", 50, "energy", 50, "bomb", 10, "bio", 100, "rad", 100, "fire", 70, "acid", 100]));
	return f.dot;
});

// /obj/machinery/door/window/proc/New  (code/game/machinery/doors/windowdoor.dm:26)  may sleep
rt.def("/obj/machinery/door/window/proc/New", function* New(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		yield* g.srcCall(f, "setDir", live(f.args[1]));
	}
	if ((truthy(rt.fv(f, "req_access", live(f.src))) && truthy(rt.getLen(f, rt.fv(f, "req_access", live(f.src)))))) {
		rt.setFv(f, "icon_state", live(f.src), fmt("＀", [rt.fv(f, "icon_state", live(f.src))]));
		rt.setFv(f, "base_state", live(f.src), rt.fv(f, "icon_state", live(f.src)));
	}
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "shards"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "debris", (yield* g.new_(f, T("/obj/item/weapon/shard"), [live(f.src)])), add);
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "rods"))) {
		rt.modSrcVar(f, "debris", (yield* g.new_(f, T("/obj/item/stack/rods"), [live(f.src), rt.sv(f, "rods")])), add);
	}
	if (!truthy(rt.sv(f, "cable"))) return f.dot;
	rt.modSrcVar(f, "debris", (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(f.src), rt.sv(f, "cable")])), add);
	return f.dot;
}, true, { args: ["loc", "set_dir"] });

// /obj/machinery/door/window/proc/Destroy  (code/game/machinery/doors/windowdoor.dm:41)  may sleep
rt.def("/obj/machinery/door/window/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	rt.setSv(f, "density", 0);
	I = null;
	rt.forList(f, 0, rt.sv(f, "debris"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	}
	rt.endFor(f, 0);
	if (isEqual(rt.sv(f, "obj_integrity"), 0)) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "shatter", 70, 1]);
	}
	rt.setSv(f, "electronics", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/door/window/proc/update_icon  (code/game/machinery/doors/windowdoor.dm:50)
rt.def("/obj/machinery/door/window/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "density"))) {
		rt.setSv(f, "icon_state", rt.sv(f, "base_state"));
	} else {
		rt.setSv(f, "icon_state", fmt("＀open", [rt.fv(f, "base_state", live(f.src))]));
	}
	return f.dot;
});

// /obj/machinery/door/window/proc/open_and_close  (code/game/machinery/doors/windowdoor.dm:55)  may sleep
rt.def("/obj/machinery/door/window/proc/open_and_close", function* open_and_close(f: Frame) {
	yield* g.srcCall(f, "open");
	if (truthy((yield* g.callName(f, live(f.src), "check_access", [null])))) {
		yield* g.call(f, P("/proc/sleep"), null, [50]);
	} else {
		yield* g.call(f, P("/proc/sleep"), null, [20]);
	}
	yield* g.srcCall(f, "close");
	return f.dot;
}, true);

// /obj/machinery/door/window/proc/Bumped  (code/game/machinery/doors/windowdoor.dm:63)  may sleep
rt.def("/obj/machinery/door/window/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let mecha: Value = null, M: Value = null;
	f.vars = () => [AM, mecha, M];
	if ((truthy(rt.sv(f, "operating")) || !truthy(rt.fv(f, "density", live(f.src))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
		if (truthy((rt.istype(live(AM), T("/obj/mecha")) ? 1 : 0))) {
			if ((truthy(rt.gv(f, "occupant", (mecha = live(AM)))) && truthy((yield* g.callName(f, live(f.src), "allowed", [rt.fv(f, "occupant", live(mecha))]))))) {
				yield* g.srcCall(f, "open_and_close");
			} else {
				yield* g.srcCall(f, "do_animate", "deny");
			}
		}
		return live(f.dot);
	}
	if (!truthy(rt.gl("SSticker"))) {
		return live(f.dot);
	}
	if ((truthy((yield* g.callName(f, (M = live(AM)), "restrained", []))) || ((truthy((rt.istype(live(M), T("/mob/living/simple_animal/drone")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/silicon/robot")) ? 1 : 0))) && truthy(rt.fv(f, "stat", live(M)))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "bumpopen", live(M));
	return f.dot;
}, true);

// /obj/machinery/door/window/proc/bumpopen  (code/game/machinery/doors/windowdoor.dm:81)  may sleep
rt.def("/obj/machinery/door/window/proc/bumpopen", function* bumpopen(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(rt.sv(f, "operating")) || !truthy(rt.fv(f, "density", live(f.src))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	if (!truthy((yield* g.callName(f, live(f.src), "requiresID", [])))) {
		user = null;
	}
	if (truthy((yield* g.srcCall(f, "allowed", live(user))))) {
		yield* g.srcCall(f, "open_and_close");
	} else {
		yield* g.srcCall(f, "do_animate", "deny");
	}
	return live(f.dot);
}, true);

// /obj/machinery/door/window/proc/CanPass  (code/game/machinery/doors/windowdoor.dm:94)
rt.def("/obj/machinery/door/window/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let W: Value = null;
	f.vars = () => [height, W];
	if (live(height) === null) {
		height = 0;
	}
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [2])))) {
		return 1;
	}
	if (isEqual(rt.getDir(f, rt.sv(f, "loc"), live(target)), rt.sv(f, "dir"))) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	if (truthy((rt.istype(live(mover), T("/obj/structure/window")) ? 1 : 0))) {
		W = live(mover);
		if (!truthy(rt.call(f, P("/proc/valid_window_location"), null, [rt.sv(f, "loc"), rt.fv(f, "ini_dir", live(W))]))) {
			return 0;
		}
	} else {
		if (truthy((rt.istype(live(mover), T("/obj/structure/windoor_assembly")) ? 1 : 0))) {
			W = live(mover);
			if (!truthy(rt.call(f, P("/proc/valid_window_location"), null, [rt.sv(f, "loc"), rt.fv(f, "ini_dir", live(W))]))) {
				return 0;
			}
		} else {
			if ((truthy((rt.istype(live(mover), T("/obj/machinery/door/window")) ? 1 : 0)) && !truthy(rt.call(f, P("/proc/valid_window_location"), null, [rt.sv(f, "loc"), rt.fv(f, "dir", live(mover))])))) {
				return 0;
			} else {
				return 1;
			}
		}
	}
	return f.dot;
});

// /obj/machinery/door/window/proc/CanAtmosPass  (code/game/machinery/doors/windowdoor.dm:112)
rt.def("/obj/machinery/door/window/proc/CanAtmosPass", function CanAtmosPass(f: Frame, _T: Value) {
	if (isEqual(rt.getDir(f, rt.sv(f, "loc"), live(_T)), rt.sv(f, "dir"))) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	return 1;
});

// /obj/machinery/door/window/proc/CanAStarPass  (code/game/machinery/doors/windowdoor.dm:119)
rt.def("/obj/machinery/door/window/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, to_dir: Value) {
	return (((!truthy(rt.sv(f, "density")) ? 1 : 0) || (!isEqual(rt.sv(f, "dir"), live(to_dir)) ? 1 : 0)) || (rt.callSrc(f, "check_access", [live(ID)]) && rt.callSrc(f, "hasPower", [])));
});

// /obj/machinery/door/window/proc/CheckExit  (code/game/machinery/doors/windowdoor.dm:122)
rt.def("/obj/machinery/door/window/proc/CheckExit", function CheckExit(f: Frame, mover: Value, target: Value) {
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [2])))) {
		return 1;
	}
	if (isEqual(rt.getDir(f, rt.sv(f, "loc"), live(target)), rt.sv(f, "dir"))) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	return 1;
});

// /obj/machinery/door/window/proc/open  (code/game/machinery/doors/windowdoor.dm:130)  may sleep
rt.def("/obj/machinery/door/window/proc/open", function* open(f: Frame, forced: Value) {
	f.vars = () => [forced];
	if (live(forced) === null) {
		forced = 0;
	}
	if (isEqual(rt.fv(f, "operating", live(f.src)), 1)) {
		return 0;
	}
	if (!truthy(live(forced))) {
		if (!truthy((yield* g.srcCall(f, "hasPower")))) {
			return 0;
		}
	}
	if (rt.lt(live(forced), 2)) {
		if (truthy(rt.sv(f, "emagged"))) {
			return 0;
		}
	}
	if (!truthy(rt.fv(f, "operating", live(f.src)))) {
		rt.setFv(f, "operating", live(f.src), 1);
	}
	yield* g.srcCall(f, "do_animate", "opening");
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/windowdoor.ogg"), 100, 1]);
	rt.setFv(f, "icon_state", live(f.src), fmt("＀open", [rt.fv(f, "base_state", live(f.src))]));
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	rt.setFv(f, "density", live(f.src), 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	yield* g.srcCall(f, "update_freelook_sight");
	if (isEqual(rt.sv(f, "operating"), 1)) {
		rt.setFv(f, "operating", live(f.src), 0);
	}
	return 1;
}, true);

// /obj/machinery/door/window/proc/close  (code/game/machinery/doors/windowdoor.dm:155)  may sleep
rt.def("/obj/machinery/door/window/proc/close", function* close(f: Frame, forced: Value) {
	f.vars = () => [forced];
	if (live(forced) === null) {
		forced = 0;
	}
	if (truthy(rt.fv(f, "operating", live(f.src)))) {
		return 0;
	}
	if (!truthy(live(forced))) {
		if (!truthy((yield* g.srcCall(f, "hasPower")))) {
			return 0;
		}
	}
	if (rt.lt(live(forced), 2)) {
		if (truthy(rt.sv(f, "emagged"))) {
			return 0;
		}
	}
	rt.setFv(f, "operating", live(f.src), 1);
	yield* g.srcCall(f, "do_animate", "closing");
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/windowdoor.ogg"), 100, 1]);
	rt.setFv(f, "icon_state", live(f.src), rt.fv(f, "base_state", live(f.src)));
	rt.setFv(f, "density", live(f.src), 1);
	yield* g.srcCall(f, "air_update_turf", 1);
	yield* g.srcCall(f, "update_freelook_sight");
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	rt.setFv(f, "operating", live(f.src), 0);
	return 1;
}, true);

// /obj/machinery/door/window/proc/play_attack_sound  (code/game/machinery/doors/windowdoor.dm:177)
rt.def("/obj/machinery/door/window/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/glasshit.ogg"), 90, 1]);
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/machinery/door/window/proc/deconstruct  (code/game/machinery/doors/windowdoor.dm:185)  may sleep
rt.def("/obj/machinery/door/window/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let fragment: Value = null;
	let $e: any;
	f.vars = () => [disassembled, fragment, $e];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if ((!truthy(rt.bitAnd(rt.sv(f, "flags"), 128)) && !truthy(live(disassembled)))) {
		fragment = null;
		rt.forList(f, 0, rt.sv(f, "debris"), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			fragment = $e;
			yield* g.callName(f, live(fragment), "forceMove", [rt.getStep(f, live(f.src), 0)]);
			yield* g.srcCall(f, "transfer_fingerprints_to", live(fragment));
			(rt.modSrcVar(f, "debris", live(fragment), subtract));
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/door/window/proc/narsie_act  (code/game/machinery/doors/windowdoor.dm:193)
rt.def("/obj/machinery/door/window/proc/narsie_act", function narsie_act(f: Frame) {
	rt.callSrc(f, "add_atom_colour", ["#7D1919", 4]);
	return f.dot;
});

// /obj/machinery/door/window/proc/ratvar_act  (code/game/machinery/doors/windowdoor.dm:196)  may sleep
rt.def("/obj/machinery/door/window/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* g.new_(f, T("/obj/machinery/door/window/clockwork"), [rt.fv(f, "loc", live(f.src)), rt.sv(f, "dir")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/door/window/proc/temperature_expose  (code/game/machinery/doors/windowdoor.dm:200)  may sleep
rt.def("/obj/machinery/door/window/proc/temperature_expose", function* temperature_expose(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	$0 = live(f.args[1]);
	$1 = 273.1499938964844;
	if (truthy(rt.sv(f, "reinf"))) {
		$2 = 1600;
	} else {
		$2 = 800;
	}
	if (rt.gt($0, add($1, $2))) {
		yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/round"), null, [divide(live(f.args[2]), 200)])), "fire", 0, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["air", "exposed_temperature", "exposed_volume"] });

// /obj/machinery/door/window/proc/attack_ai  (code/game/machinery/doors/windowdoor.dm:206)  may sleep
rt.def("/obj/machinery/door/window/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/door/window/proc/emag_act  (code/game/machinery/doors/windowdoor.dm:209)  may sleep
rt.def("/obj/machinery/door/window/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!((!truthy(rt.sv(f, "operating")) && truthy(rt.sv(f, "density"))) && !truthy(rt.sv(f, "emagged")))) return f.dot;
	rt.setSv(f, "operating", 1);
	yield* g.call(f, P("/proc/flick"), null, [fmt("＀spark", [rt.fv(f, "base_state", live(f.src))]), live(f.src)]);
	yield* g.call(f, P("/proc/sleep"), null, [6]);
	rt.setSv(f, "operating", 0);
	rt.modSrcVar(f, "desc", "<BR><span class='warning'>Its access panel is smoking slightly.</span>", add);
	yield* g.srcCall(f, "open");
	rt.setSv(f, "emagged", 1);
	return f.dot;
}, true);

// /obj/machinery/door/window/proc/attackby  (code/game/machinery/doors/windowdoor.dm:223)  may sleep
rt.def("/obj/machinery/door/window/proc/attackby", function* attackby(f: Frame) {
	let WA: Value = null, ae: Value = null;
	let $0: any, $1: any;
	f.vars = () => [WA, ae, $0, $1];
	if (truthy(rt.sv(f, "operating"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			if ((truthy(rt.sv(f, "density")) || truthy(rt.sv(f, "operating")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need to open the door to access the maintenance panel!</span>"]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			rt.setSv(f, "panel_open", (!truthy(rt.sv(f, "panel_open")) ? 1 : 0));
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "panel_open"))) {
				$1 = "open";
			} else {
				$1 = "close";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the maintenance panel of the ＀.</span>", [$1, rt.fv(f, "name", live(f.src))])]);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			if (((truthy(rt.sv(f, "panel_open")) && !truthy(rt.sv(f, "density"))) && !truthy(rt.sv(f, "operating")))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ removes the electronics from the ＀.", [live(f.args[1]), rt.fv(f, "name", live(f.src))]), fmt("<span class='notice'>You start to remove electronics from the ＀...</span>", [rt.fv(f, "name", live(f.src))])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if ((((truthy(rt.sv(f, "panel_open")) && !truthy(rt.sv(f, "density"))) && !truthy(rt.sv(f, "operating"))) && truthy(rt.fv(f, "loc", live(f.src))))) {
						WA = (yield* g.new_(f, T("/obj/structure/windoor_assembly"), [rt.fv(f, "loc", live(f.src))]));
						$0 = rt.sv(f, "base_state");
						if ($0 === "left") {
							rt.setFv(f, "facing", live(WA), "l");
						} else if ($0 === "right") {
							rt.setFv(f, "facing", live(WA), "r");
						} else if ($0 === "leftsecure") {
							rt.setFv(f, "facing", live(WA), "l");
							rt.setFv(f, "secure", live(WA), 1);
						} else if ($0 === "rightsecure") {
							rt.setFv(f, "facing", live(WA), "r");
							rt.setFv(f, "secure", live(WA), 1);
						}
						rt.setFv(f, "anchored", live(WA), 1);
						rt.setFv(f, "state", live(WA), "02");
						yield* g.callName(f, live(WA), "setDir", [rt.fv(f, "dir", live(f.src))]);
						rt.setFv(f, "ini_dir", live(WA), rt.fv(f, "dir", live(f.src)));
						yield* g.callName(f, live(WA), "update_icon", []);
						rt.setFv(f, "created_name", live(WA), rt.fv(f, "name", live(f.src)));
						if (truthy(rt.sv(f, "emagged"))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You discard the damaged electronics.</span>"]);
							yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the airlock electronics.</span>"]);
						ae = null;
						if (!truthy(rt.sv(f, "electronics"))) {
							ae = (yield* g.new_(f, T("/obj/item/weapon/electronics/airlock"), [rt.fv(f, "loc", live(f.src))]));
							if (truthy(rt.sv(f, "req_one_access"))) {
								rt.setFv(f, "one_access", live(ae), 1);
								rt.setFv(f, "accesses", live(ae), rt.fv(f, "req_one_access", live(f.src)));
							} else {
								rt.setFv(f, "accesses", live(ae), rt.fv(f, "req_access", live(f.src)));
							}
						} else {
							ae = rt.sv(f, "electronics");
							rt.setSv(f, "electronics", null);
							rt.setFv(f, "loc", live(ae), rt.fv(f, "loc", live(f.src)));
						}
						yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					}
				}
				return live(f.dot);
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/door/window/proc/try_to_crowbar  (code/game/machinery/doors/windowdoor.dm:285)  may sleep
rt.def("/obj/machinery/door/window/proc/try_to_crowbar", function* try_to_crowbar(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	if (!truthy((yield* g.srcCall(f, "hasPower")))) {
		if (truthy(rt.sv(f, "density"))) {
			yield* g.srcCall(f, "open", 2);
		} else {
			yield* g.srcCall(f, "close", 2);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The door's motors resist your efforts to force it!</span>"]);
	}
	return f.dot;
}, true);

// /obj/machinery/door/window/proc/do_animate  (code/game/machinery/doors/windowdoor.dm:294)
rt.def("/obj/machinery/door/window/proc/do_animate", function do_animate(f: Frame, animation: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(animation);
	if ($0 === "opening") {
		rt.call(f, P("/proc/flick"), null, [fmt("＀opening", [rt.fv(f, "base_state", live(f.src))]), live(f.src)]);
	} else if ($0 === "closing") {
		rt.call(f, P("/proc/flick"), null, [fmt("＀closing", [rt.fv(f, "base_state", live(f.src))]), live(f.src)]);
	} else if ($0 === "deny") {
		rt.call(f, P("/proc/flick"), null, [fmt("＀deny", [rt.fv(f, "base_state", live(f.src))]), live(f.src)]);
	}
	return f.dot;
});

rt.type(10268, "/obj/machinery/door/window/clockwork", "/obj/machinery/door/window", {
	made_glow: 0,
	name: "brass windoor",
	desc: "A thin door with translucent brass paneling.",
	icon_state: "clockwork",
	base_state: "clockwork",
	shards: 0,
	rods: 0,
	resistance_flags: 34,
});

// /obj/machinery/door/window/clockwork/proc/New  (code/game/machinery/doors/windowdoor.dm:324)  may sleep
rt.def("/obj/machinery/door/window/clockwork/proc/New", function* New(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "debris", (yield* g.new_(f, T("/obj/item/clockwork/alloy_shards/medium/gear_bit/large"), [live(f.src)])), add);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/change_construction_value"), null, [2]);
	return f.dot;
}, true, { args: ["loc", "set_dir"] });

// /obj/machinery/door/window/clockwork/proc/setDir  (code/game/machinery/doors/windowdoor.dm:330)  may sleep
rt.def("/obj/machinery/door/window/clockwork/proc/setDir", function* setDir(f: Frame) {
	let E: Value = null;
	f.vars = () => [E];
	if (!truthy(rt.sv(f, "made_glow"))) {
		yield* g.callName(f, (E = (yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/door/window"), [rt.getStep(f, live(f.src), 0)]))), "setDir", [live(f.args[0])]);
		rt.setSv(f, "made_glow", 1);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["direct"] });

// /obj/machinery/door/window/clockwork/proc/Destroy  (code/game/machinery/doors/windowdoor.dm:337)  may sleep
rt.def("/obj/machinery/door/window/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/change_construction_value"), null, [-2]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/door/window/clockwork/proc/emp_act  (code/game/machinery/doors/windowdoor.dm:341)  may sleep
rt.def("/obj/machinery/door/window/clockwork/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (!truthy(rt.op(f, "Prob", [], [divide(80, live(severity))]))) return f.dot;
	yield* g.srcCall(f, "open");
	return f.dot;
}, true);

// /obj/machinery/door/window/clockwork/proc/ratvar_act  (code/game/machinery/doors/windowdoor.dm:346)
rt.def("/obj/machinery/door/window/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (!truthy(rt.gl("ratvar_awakens"))) return f.dot;
	rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
	return f.dot;
});

// /obj/machinery/door/window/clockwork/proc/narsie_act  (code/game/machinery/doors/windowdoor.dm:352)  may sleep
rt.def("/obj/machinery/door/window/clockwork/proc/narsie_act", function* narsie_act(f: Frame) {
	let previouscolor: Value = null;
	f.vars = () => [previouscolor];
	yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/rand"), null, [30, 60])), "brute");
	if (!truthy(live(f.src))) return f.dot;
	previouscolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#960000");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(previouscolor), "time", 8]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
	return f.dot;
}, true);

// /obj/machinery/door/window/clockwork/proc/allowed  (code/game/machinery/doors/windowdoor.dm:360)
rt.def("/obj/machinery/door/window/clockwork/proc/allowed", function allowed(f: Frame, M: Value) {
	if (truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(M)]))) {
		return 1;
	}
	return 0;
});
