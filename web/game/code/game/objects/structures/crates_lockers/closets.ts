// From code/game/objects/structures/crates_lockers/closets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12251, "/obj/structure/closet", "/obj/structure", {
	icon_door: null,
	icon_door_override: 0,
	secure: 0,
	opened: 0,
	welded: 0,
	locked: 0,
	large: 1,
	wall_mounted: 0,
	breakout_time: 2,
	lastbang: null,
	can_weld_shut: 1,
	horizontal: 0,
	allow_objects: 0,
	allow_dense: 0,
	dense_when_open: 0,
	max_mob_size: 2,
	mob_storage_capacity: 3,
	storage_capacity: 30,
	cutting_tool: rt.typePath("/obj/item/weapon/weldingtool"),
	open_sound: rt.rsc("sound/machines/click.ogg"),
	close_sound: rt.rsc("sound/machines/click.ogg"),
	cutting_sound: rt.rsc("sound/items/welder.ogg"),
	material_drop: rt.typePath("/obj/item/stack/sheet/metal"),
	material_drop_amount: 2,
	delivery_icon: "deliverycloset",
	anchorable: 1,
	name: "closet",
	desc: "It's a basic storage unit.",
	icon: rt.rsc("icons/obj/closet.dmi"),
	icon_state: "generic",
	density: 1,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 50,
	armor: null,
});

// /obj/structure/closet/proc/<init>  (code/game/objects/structures/crates_lockers/closets.dm:18)
rt.def("/obj/structure/closet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 10, "laser", 10, "energy", 0, "bomb", 10, "bio", 0, "rad", 0, "fire", 70, "acid", 60]));
	return f.dot;
});

// /obj/structure/closet/proc/Initialize  (code/game/objects/structures/crates_lockers/closets.dm:40)  may sleep
rt.def("/obj/structure/closet/proc/Initialize", function* Initialize(f: Frame) {
	if ((truthy(live(f.args[0])) && !truthy(rt.sv(f, "opened")))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/closet/proc/take_contents")])), 0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "PopulateContents");
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/structure/closet/proc/Destroy  (code/game/objects/structures/crates_lockers/closets.dm:51)  may sleep
rt.def("/obj/structure/closet/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "dump_contents");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/closet/proc/update_icon  (code/game/objects/structures/crates_lockers/closets.dm:55)
rt.def("/obj/structure/closet/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "opened"))) {
		if (truthy(rt.sv(f, "icon_door"))) {
			rt.callSrc(f, "add_overlay", [fmt("＀_door", [rt.sv(f, "icon_door")])]);
		} else {
			rt.callSrc(f, "add_overlay", [fmt("＀_door", [rt.sv(f, "icon_state")])]);
		}
		if (truthy(rt.sv(f, "welded"))) {
			rt.callSrc(f, "add_overlay", ["welded"]);
		}
		if (truthy(rt.sv(f, "secure"))) {
			if (!truthy(rt.sv(f, "broken"))) {
				if (truthy(rt.sv(f, "locked"))) {
					rt.callSrc(f, "add_overlay", ["locked"]);
				} else {
					rt.callSrc(f, "add_overlay", ["unlocked"]);
				}
			} else {
				rt.callSrc(f, "add_overlay", ["off"]);
			}
		}
	} else {
		if (truthy(rt.sv(f, "icon_door_override"))) {
			rt.callSrc(f, "add_overlay", [fmt("＀_open", [rt.sv(f, "icon_door")])]);
		} else {
			rt.callSrc(f, "add_overlay", [fmt("＀_open", [rt.sv(f, "icon_state")])]);
		}
	}
	return f.dot;
});

// /obj/structure/closet/proc/examine  (code/game/objects/structures/crates_lockers/closets.dm:79)
rt.def("/obj/structure/closet/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "anchored"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It is anchored to the ground."]);
	} else {
		if (!(truthy(rt.sv(f, "secure")) && !truthy(rt.sv(f, "opened")))) return f.dot;
		$0 = live(f.args[0]);
		if (truthy(rt.sv(f, "locked"))) {
			$1 = "unlock";
		} else {
			$1 = "lock";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Alt-click to ＀.</span>", [$1])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/closet/proc/CanPass  (code/game/objects/structures/crates_lockers/closets.dm:86)
rt.def("/obj/structure/closet/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if ((isEqual(live(height), 0) || truthy(rt.sv(f, "wall_mounted")))) {
		return 1;
	}
	return (!truthy(rt.sv(f, "density")) ? 1 : 0);
});

// /obj/structure/closet/proc/can_open  (code/game/objects/structures/crates_lockers/closets.dm:91)
rt.def("/obj/structure/closet/proc/can_open", function can_open(f: Frame, user: Value) {
	let _T: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [_T, L, $e];
	if ((truthy(rt.sv(f, "welded")) || truthy(rt.sv(f, "locked")))) {
		return 0;
	}
	_T = rt.getStep(f, live(f.src), 0);
	L = null;
	rt.forList(f, 0, live(_T), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((truthy(rt.fv(f, "anchored", live(L))) || ((truthy(rt.sv(f, "horizontal")) && rt.gt(rt.fv(f, "mob_size", live(L)), 0)) && truthy(rt.fv(f, "density", live(L)))))) {
			if (truthy(live(user))) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>There's something large on top of ＀, preventing it from opening.</span>", [live(f.src)])]);
			}
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /obj/structure/closet/proc/can_close  (code/game/objects/structures/crates_lockers/closets.dm:102)
rt.def("/obj/structure/closet/proc/can_close", function can_close(f: Frame, user: Value) {
	let _T: Value = null, closet: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [_T, closet, L, $e];
	_T = rt.getStep(f, live(f.src), 0);
	closet = null;
	rt.forList(f, 0, live(_T), T("/obj/structure/closet"));
	while (($e = rt.next(f, 0)) !== undefined) {
		closet = $e;
		if ((!isEqual(live(closet), live(f.src)) && !truthy(rt.fv(f, "wall_mounted", live(closet))))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	L = null;
	rt.forList(f, 0, live(_T), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((truthy(rt.fv(f, "anchored", live(L))) || ((truthy(rt.sv(f, "horizontal")) && rt.gt(rt.fv(f, "mob_size", live(L)), 0)) && truthy(rt.fv(f, "density", live(L)))))) {
			if (truthy(live(user))) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>There's something too large in ＀, preventing it from closing.</span>", [live(f.src)])]);
			}
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /obj/structure/closet/proc/dump_contents  (code/game/objects/structures/crates_lockers/closets.dm:114)  may sleep
rt.def("/obj/structure/closet/proc/dump_contents", function* dump_contents(f: Frame) {
	let _T: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [_T, AM, $e];
	_T = rt.getStep(f, live(f.src), 0);
	AM = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.callName(f, live(AM), "forceMove", [live(_T)]);
		if (truthy(rt.sv(f, "throwing"))) {
			yield* g.call(f, P("/proc/step"), null, [live(AM), rt.sv(f, "dir")]);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "throwing"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "throwing"), "finalize", [0]);
	return f.dot;
}, true);

// /obj/structure/closet/proc/take_contents  (code/game/objects/structures/crates_lockers/closets.dm:123)  may sleep
rt.def("/obj/structure/closet/proc/take_contents", function* take_contents(f: Frame) {
	let _T: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [_T, AM, $e];
	_T = rt.getStep(f, live(f.src), 0);
	AM = null;
	rt.forList(f, 0, live(_T), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if ((!isEqual(live(AM), live(f.src)) && isEqual((yield* g.srcCall(f, "insert", live(AM))), -1))) {
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/closet/proc/open  (code/game/objects/structures/crates_lockers/closets.dm:129)  may sleep
rt.def("/obj/structure/closet/proc/open", function* open(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(rt.sv(f, "opened")) || !truthy((yield* g.srcCall(f, "can_open", live(user)))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "open_sound"), 15, 1, -3]);
	rt.setSv(f, "opened", 1);
	if (!truthy(rt.sv(f, "dense_when_open"))) {
		rt.setSv(f, "density", 0);
	}
	(rt.modSrcVar(f, "climb_time", 0.5, multiply));
	yield* g.srcCall(f, "dump_contents");
	yield* g.srcCall(f, "update_icon");
	return 1;
}, true);

// /obj/structure/closet/proc/insert  (code/game/objects/structures/crates_lockers/closets.dm:141)  may sleep
rt.def("/obj/structure/closet/proc/insert", function* insert(f: Frame, AM: Value) {
	let L: Value = null, mobs_stored: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [AM, L, mobs_stored, M, $e];
	if (rt.ge(rt.len(f, rt.sv(f, "contents")), rt.sv(f, "storage_capacity"))) {
		return -1;
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
		if (!truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
			return live(f.dot);
		}
		if ((((truthy(rt.gv(f, "anchored", (L = live(AM)))) || truthy(rt.fv(f, "buckled", live(L)))) || truthy(rt.fv(f, "incorporeal_move", live(L)))) || truthy((yield* g.callName(f, live(L), "has_buckled_mobs", []))))) {
			return live(f.dot);
		}
		if (rt.gt(rt.fv(f, "mob_size", live(L)), 0)) {
			if ((truthy(rt.sv(f, "horizontal")) && truthy(rt.fv(f, "density", live(L))))) {
				return live(f.dot);
			}
			if (rt.gt(rt.fv(f, "mob_size", live(L)), rt.sv(f, "max_mob_size"))) {
				return live(f.dot);
			}
			mobs_stored = 0;
			M = null;
			rt.forList(f, 0, rt.sv(f, "contents"), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if (rt.ge((mobs_stored = rt.inc(live(mobs_stored), 1)), rt.sv(f, "mob_storage_capacity"))) {
					return live(f.dot);
				}
			}
			rt.endFor(f, 0);
		}
		yield* g.callName(f, live(L), "stop_pulling", []);
	} else {
		if (truthy((rt.istype(live(AM), T("/obj/structure/closet")) ? 1 : 0))) {
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(AM), T("/obj")) ? 1 : 0))) {
				if (((!truthy(rt.sv(f, "allow_objects")) && !truthy((rt.istype(live(AM), T("/obj/item")) ? 1 : 0))) && !truthy((rt.istype(live(AM), T("/obj/effect/dummy/chameleon")) ? 1 : 0)))) {
					return live(f.dot);
				}
				if ((!truthy(rt.sv(f, "allow_dense")) && truthy(rt.fv(f, "density", live(AM))))) {
					return live(f.dot);
				}
				if (((truthy(rt.fv(f, "anchored", live(AM))) || truthy((yield* g.callName(f, live(AM), "has_buckled_mobs", [])))) || truthy(rt.bitAnd(rt.fv(f, "flags", live(AM)), 2)))) {
					return live(f.dot);
				}
			} else {
				return live(f.dot);
			}
		}
	}
	yield* g.callName(f, live(AM), "forceMove", [live(f.src)]);
	if (truthy(rt.fv(f, "pulledby", live(AM)))) {
		yield* g.callName(f, rt.fv(f, "pulledby", live(AM)), "stop_pulling", []);
	}
	return 1;
}, true);

// /obj/structure/closet/proc/close  (code/game/objects/structures/crates_lockers/closets.dm:180)  may sleep
rt.def("/obj/structure/closet/proc/close", function* close(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((!truthy(rt.sv(f, "opened")) || !truthy((yield* g.srcCall(f, "can_close", live(user)))))) {
		return 0;
	}
	yield* g.srcCall(f, "take_contents");
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "close_sound"), 15, 1, -3]);
	rt.setSv(f, "climb_time", rt.initial(f, live(f.src), "climb_time"));
	rt.setSv(f, "opened", 0);
	rt.setSv(f, "density", 1);
	yield* g.srcCall(f, "update_icon");
	return 1;
}, true);

// /obj/structure/closet/proc/toggle  (code/game/objects/structures/crates_lockers/closets.dm:192)  may sleep
rt.def("/obj/structure/closet/proc/toggle", function* toggle(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "opened"))) {
		return (yield* g.srcCall(f, "close", live(user)));
	}
	return (yield* g.srcCall(f, "open", live(user)));
}, true);

// /obj/structure/closet/proc/deconstruct  (code/game/objects/structures/crates_lockers/closets.dm:197)  may sleep
rt.def("/obj/structure/closet/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (((truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "material_drop")]))) && truthy(rt.sv(f, "material_drop_amount"))) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) {
		yield* g.new_(f, rt.sv(f, "material_drop"), [rt.sv(f, "loc"), rt.sv(f, "material_drop_amount")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/closet/proc/obj_break  (code/game/objects/structures/crates_lockers/closets.dm:202)  may sleep
rt.def("/obj/structure/closet/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if (!(!truthy(rt.sv(f, "broken")) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	yield* g.srcCall(f, "bust_open");
	return f.dot;
}, true);

// /obj/structure/closet/proc/attackby  (code/game/objects/structures/crates_lockers/closets.dm:206)  may sleep
rt.def("/obj/structure/closet/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any;
	f.vars = () => [WT, $0, $1, $2, $3, $4];
	if (truthy((rt.isIn(f, live(f.args[1]), live(f.src)) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "opened"))) {
		if (truthy(rt.op(f, "IsType", [], [live(f.args[0]), rt.sv(f, "cutting_tool")]))) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
				if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin cutting ％！ apart...</span>", [live(f.src)])]);
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "cutting_sound"), 40, 1]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(WT))), null, 1, "target", live(f.src)], rt.Args.Named)))) {
						if ((!truthy(rt.sv(f, "opened")) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "cutting_sound"), 50, 1]);
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ slices apart ％！.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You cut ％！ apart with ％！.</span>", [live(f.src), live(WT)]), "<span class='italics'>You hear welding.</span>"]);
						yield* g.srcCall(f, "deconstruct", 1);
					}
					return 0;
				}
			} else {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ cut apart ％！.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You cut ％！ apart with ％！.</span>", [live(f.src), live(f.args[0])])]);
				yield* g.srcCall(f, "deconstruct", 1);
				return 0;
			}
		}
		if (truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			yield* g.callName(f, live(f.args[0]), "forceMove", [rt.sv(f, "loc")]);
			return 1;
		}
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && truthy(rt.sv(f, "can_weld_shut")))) {
			if (!truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
				return live(f.dot);
			}
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "welded"))) {
				$1 = "unwelding";
			} else {
				$1 = "welding";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You begin ＀ ％！...</span>", [$1, live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 40, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(WT))), null, 1, "target", live(f.src)], rt.Args.Named)))) {
				if ((truthy(rt.sv(f, "opened")) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
				rt.setSv(f, "welded", (!truthy(rt.sv(f, "welded")) ? 1 : 0));
				$0 = live(f.args[1]);
				$1 = live(f.args[1]);
				if (truthy(rt.sv(f, "welded"))) {
					$1 = $1;
					$2 = "welds shut";
				} else {
					$2 = "unweldeds";
				}
				$1 = fmt("<span class='notice'>＀ ＀ ％！.</span>", [$1, $2, live(f.src)]);
				if (truthy(rt.sv(f, "welded"))) {
					$2 = "weld";
				} else {
					$2 = "unwelded";
				}
				yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You ＀ ％！ with ％！.</span>", [$2, live(f.src), live(WT)]), "<span class='italics'>You hear welding.</span>"]);
				yield* g.srcCall(f, "update_icon");
			}
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && truthy(rt.sv(f, "anchorable")))) {
				if ((truthy((yield* g.srcCall(f, "isinspace"))) && !truthy(rt.sv(f, "anchored")))) {
					return live(f.dot);
				}
				rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
				$0 = live(f.args[1]);
				$1 = live(f.args[1]);
				if (truthy(rt.sv(f, "anchored"))) {
					$1 = $1;
					$2 = "anchored";
				} else {
					$2 = "unanchored";
				}
				$3 = live(f.src);
				if (truthy(rt.sv(f, "anchored"))) {
					$4 = "to";
				} else {
					$4 = "from";
				}
				$1 = fmt("<span class='notice'>＀ ＀ ％！ ＀ the ground.</span>", [$1, $2, $3, $4]);
				if (truthy(rt.sv(f, "anchored"))) {
					$2 = "anchored";
				} else {
					$2 = "unanchored";
				}
				$3 = live(f.src);
				if (truthy(rt.sv(f, "anchored"))) {
					$4 = "to";
				} else {
					$4 = "from";
				}
				yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You ＀ ％！ ＀ the ground.</span>", [$2, $3, $4]), "<span class='italics'>You hear a ratchet.</span>"]);
			} else {
				if ((!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm") && !truthy(rt.bitAnd(rt.fv(f, "flags", live(f.args[0])), 4)))) {
					if ((truthy((yield* g.callName(f, live(f.args[0]), "GetID", []))) || !truthy((yield* g.srcCall(f, "toggle", live(f.args[1])))))) {
						yield* g.srcCall(f, "togglelock", live(f.args[1]));
					}
					return 1;
				} else {
					return (yield* g.callSuper(f, [], rt.Args.Same));
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/closet/proc/MouseDrop_T  (code/game/objects/structures/crates_lockers/closets.dm:263)  may sleep
rt.def("/obj/structure/closet/proc/MouseDrop_T", function* MouseDrop_T(f: Frame) {
	let actuallyismob: Value = null, _T: Value = null, targets: Value = null, L: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [actuallyismob, _T, targets, L, $0, $1, $2];
	if (((!truthy((rt.istype(live(f.args[0]), T("/atom/movable")) ? 1 : 0)) || truthy(rt.fv(f, "anchored", live(f.args[0])))) || truthy((rt.istype(live(f.args[0]), T("/obj/screen")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (((!truthy((rt.istype(live(f.args[1]), T("/mob/living")) ? 1 : 0)) || truthy((yield* g.callName(f, live(f.args[1]), "incapacitated", [])))) || truthy(rt.fv(f, "lying", live(f.args[1]))))) {
		return live(f.dot);
	}
	if ((!truthy((yield* g.srcCall(f, "Adjacent", live(f.args[1])))) || !truthy((yield* g.callName(f, live(f.args[1]), "Adjacent", [live(f.args[0])]))))) {
		return live(f.dot);
	}
	if (isEqual(live(f.args[1]), live(f.args[0]))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!truthy(rt.sv(f, "opened"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.args[0]))])))) {
		return live(f.dot);
	}
	actuallyismob = 0;
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		actuallyismob = 1;
	} else {
		if (!truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) {
			return live(f.dot);
		}
	}
	_T = rt.getStep(f, live(f.src), 0);
	targets = rt.list(live(f.args[0]), live(f.src));
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	$0 = live(f.args[1]);
	$1 = live(f.args[1]);
	if (truthy(live(actuallyismob))) {
		$1 = $1;
		$2 = "tries to ";
	} else {
		$2 = "";
	}
	$1 = fmt("<span class='warning'>＀ ＀stuff ＀ into ＀.</span>", [$1, $2, live(f.args[0]), live(f.src)]);
	if (truthy(live(actuallyismob))) {
		$2 = "try to ";
	} else {
		$2 = "";
	}
	yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='warning'>You ＀stuff ＀ into ＀.</span>", [$2, live(f.args[0]), live(f.src)]), "<span class='italics'>You hear clanging.</span>"]);
	if (truthy(live(actuallyismob))) {
		if (truthy((yield* g.call(f, P("/proc/do_after_mob"), null, [live(f.args[1]), live(targets), 40])))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ stuffs ＀ into ＀.</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You stuff ＀ into ＀.</span>", [live(f.args[0]), live(f.src)]), "<span class='italics'>You hear a loud metal bang.</span>"]);
			if (!truthy((rt.istype((L = live(f.args[0])), T("/mob/living/silicon")) ? 1 : 0))) {
				yield* g.callName(f, live(L), "Knockdown", [40]);
			}
			yield* g.callName(f, live(f.args[0]), "forceMove", [live(_T)]);
			yield* g.srcCall(f, "close");
		}
	} else {
		yield* g.callName(f, live(f.args[0]), "forceMove", [live(_T)]);
	}
	return 1;
}, true, { args: ["O", "user"] });

// /obj/structure/closet/proc/relaymove  (code/game/objects/structures/crates_lockers/closets.dm:302)  may sleep
rt.def("/obj/structure/closet/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	let L: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [user, L, M, $e];
	if (((truthy(rt.fv(f, "stat", live(user))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) || !truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	L = live(user);
	if (truthy((yield* g.srcCall(f, "open")))) return f.dot;
	if (rt.le(rt.fv(f, "last_special", live(L)), rt.worldTime(f))) {
		yield* g.srcCall(f, "container_resist", live(L));
	}
	if (!rt.gt(rt.worldTime(f), add(rt.sv(f, "lastbang"), 5))) return f.dot;
	rt.setSv(f, "lastbang", rt.worldTime(f));
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [live(f.src), null])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "show_message", [fmt("<FONT size=＀>BANG, bang!</FONT>", [(yield* g.call(f, P("/proc/max"), null, [0, subtract(5, (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(M)])))]))]), 2]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/closet/proc/attack_hand  (code/game/objects/structures/crates_lockers/closets.dm:314)  may sleep
rt.def("/obj/structure/closet/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.fv(f, "lying", live(f.args[0]))) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 0))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "toggle", live(f.args[0]))))) return f.dot;
	yield* g.srcCall(f, "togglelock", live(f.args[0]));
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/structure/closet/proc/attack_paw  (code/game/objects/structures/crates_lockers/closets.dm:323)  may sleep
rt.def("/obj/structure/closet/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/structure/closet/proc/attack_robot  (code/game/objects/structures/crates_lockers/closets.dm:326)  may sleep
rt.def("/obj/structure/closet/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.callName(f, live(user), "Adjacent", [live(f.src)])))) return f.dot;
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/structure/closet/proc/attack_self_tk  (code/game/objects/structures/crates_lockers/closets.dm:331)  may sleep
rt.def("/obj/structure/closet/proc/attack_self_tk", function* attack_self_tk(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/structure/closet/verb/verb_toggleopen  (code/game/objects/structures/crates_lockers/closets.dm:338)  may sleep
rt.def("/obj/structure/closet/verb/verb_toggleopen", function* verb_toggleopen(f: Frame) {
	if (((!truthy(rt.fv(f, "canmove", live(f.usr))) || truthy(rt.fv(f, "stat", live(f.usr)))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		return live(f.dot);
	}
	if (((truthy((rt.istype(live(f.usr), T("/mob/living/carbon")) ? 1 : 0)) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) || truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/drone")) ? 1 : 0)))) {
		yield* g.srcCall(f, "attack_hand", live(f.usr));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>This mob type can't use this verb.</span>"]);
	}
	return f.dot;
}, true, { verb: { name: "Toggle Open", category: "Object", src: 3, range: 1 } });

// /obj/structure/closet/proc/Exit  (code/game/objects/structures/crates_lockers/closets.dm:350)  may sleep
rt.def("/obj/structure/closet/proc/Exit", function* Exit(f: Frame, AM: Value) {
	f.vars = () => [AM];
	yield* g.srcCall(f, "open");
	if (isEqual(rt.fv(f, "loc", live(AM)), live(f.src))) {
		return 0;
	}
	return 1;
}, true);

// /obj/structure/closet/proc/container_resist  (code/game/objects/structures/crates_lockers/closets.dm:358)  may sleep
rt.def("/obj/structure/closet/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	let AM: Value = null;
	f.vars = () => [user, AM];
	if (truthy(rt.sv(f, "opened"))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/atom/movable")) ? 1 : 0))) {
		yield* g.callName(f, live(user), "changeNext_move", [100]);
		rt.setFv(f, "last_special", live(user), add(rt.worldTime(f), 100));
		yield* g.callName(f, (AM = rt.sv(f, "loc")), "relay_container_resist", [live(user), live(f.src)]);
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "welded")) && !truthy(rt.sv(f, "locked")))) {
		yield* g.srcCall(f, "open");
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "changeNext_move", [100]);
	rt.setFv(f, "last_special", live(user), add(rt.worldTime(f), 100));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You lean on the back of ＀ and start pushing the door open.</span>", [live(f.src)])]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ begins to shake violently!</span>", [live(f.src)]));
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(multiply(rt.sv(f, "breakout_time"), 60), 10), "target", live(f.src)], rt.Args.Named)))) {
		if (((((!truthy(live(user)) || !isEqual(rt.fv(f, "stat", live(user)), 0)) || !isEqual(rt.fv(f, "loc", live(user)), live(f.src))) || truthy(rt.sv(f, "opened"))) || (!truthy(rt.sv(f, "locked")) && !truthy(rt.sv(f, "welded"))))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ successfully broke out of ＀!</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You successfully break out of ＀!</span>", [live(f.src)])]);
		yield* g.srcCall(f, "bust_open");
	} else {
		if (!isEqual(rt.fv(f, "loc", live(user)), live(f.src))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You fail to break out of ＀!</span>", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/structure/closet/proc/bust_open  (code/game/objects/structures/crates_lockers/closets.dm:388)  may sleep
rt.def("/obj/structure/closet/proc/bust_open", function* bust_open(f: Frame) {
	rt.setSv(f, "welded", 0);
	rt.setSv(f, "locked", 0);
	rt.setSv(f, "broken", 1);
	yield* g.srcCall(f, "open");
	return f.dot;
}, true);

// /obj/structure/closet/proc/AltClick  (code/game/objects/structures/crates_lockers/closets.dm:391)  may sleep
rt.def("/obj/structure/closet/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.callName(f, live(f.args[0]), "canUseTopic", [null, live(f.src), "be_close", 1], rt.Args.Named)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "opened")) || !truthy(rt.sv(f, "secure")))) {
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "togglelock", live(f.args[0]));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/closet/proc/togglelock  (code/game/objects/structures/crates_lockers/closets.dm:401)  may sleep
rt.def("/obj/structure/closet/proc/togglelock", function* togglelock(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, $0, $1, $2];
	if ((truthy(rt.sv(f, "secure")) && !truthy(rt.sv(f, "broken")))) {
		if (truthy((yield* g.srcCall(f, "allowed", live(user))))) {
			if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
				yield* g.srcCall(f, "add_fingerprint", live(user));
			}
			rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
			$0 = live(user);
			$1 = live(user);
			if (truthy(rt.sv(f, "locked"))) {
				$1 = $1;
				$2 = null;
			} else {
				$2 = "un";
			}
			$1 = fmt("<span class='notice'>＀ ＀locks ＀.</span>", [$1, $2, live(f.src)]);
			if (truthy(rt.sv(f, "locked"))) {
				$2 = null;
			} else {
				$2 = "un";
			}
			yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You ＀lock ＀.</span>", [$2, live(f.src)])]);
			yield* g.srcCall(f, "update_icon");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Access Denied</span>"]);
		}
	} else {
		if (!(truthy(rt.sv(f, "secure")) && truthy(rt.sv(f, "broken")))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is broken!</span>", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/structure/closet/proc/emag_act  (code/game/objects/structures/crates_lockers/closets.dm:415)
rt.def("/obj/structure/closet/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (!(truthy(rt.sv(f, "secure")) && !truthy(rt.sv(f, "broken")))) return f.dot;
	rt.callName(f, live(user), "visible_message", [fmt("<span class='warning'>Sparks fly from ＀!</span>", [live(f.src)]), fmt("<span class='warning'>You scramble ＀'s lock, breaking it open!</span>", [live(f.src)]), "<span class='italics'>You hear a faint electrical spark.</span>"]);
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/sparks4.ogg"), 50, 1]);
	rt.setSv(f, "broken", 1);
	rt.setSv(f, "locked", 0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/structure/closet/proc/get_remote_view_fullscreens  (code/game/objects/structures/crates_lockers/closets.dm:425)  may sleep
rt.def("/obj/structure/closet/proc/get_remote_view_fullscreens", function* get_remote_view_fullscreens(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(isEqual(rt.fv(f, "stat", live(user)), 2) || !truthy(rt.bitAnd(rt.fv(f, "sight", live(user)), 12)))) return f.dot;
	yield* g.callName(f, live(user), "overlay_fullscreen", ["remote_view", T("/obj/screen/fullscreen/impaired"), 1]);
	return f.dot;
}, true);

// /obj/structure/closet/proc/emp_act  (code/game/objects/structures/crates_lockers/closets.dm:429)  may sleep
rt.def("/obj/structure/closet/proc/emp_act", function* emp_act(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	O = null;
	rt.forList(f, 0, live(f.src), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "emp_act", [live(f.args[0])]);
	}
	rt.endFor(f, 0);
	if ((truthy(rt.sv(f, "secure")) && !truthy(rt.sv(f, "broken")))) {
		if (truthy(rt.op(f, "Prob", [], [divide(50, live(f.args[0]))]))) {
			rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
			yield* g.srcCall(f, "update_icon");
		}
		if ((truthy(rt.op(f, "Prob", [], [divide(20, live(f.args[0]))])) && !truthy(rt.sv(f, "opened")))) {
			if (!truthy(rt.sv(f, "locked"))) {
				yield* g.srcCall(f, "open");
			} else {
				rt.setSv(f, "req_access", rt.list());
				rt.modSrcVar(f, "req_access", rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/get_all_accesses"), null, []))]), add);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/structure/closet/proc/contents_explosion  (code/game/objects/structures/crates_lockers/closets.dm:445)  may sleep
rt.def("/obj/structure/closet/proc/contents_explosion", function* contents_explosion(f: Frame, severity: Value, target: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [severity, target, A, $e];
	A = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "ex_act", [live(severity), live(target)]);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/closet/proc/singularity_act  (code/game/objects/structures/crates_lockers/closets.dm:450)  may sleep
rt.def("/obj/structure/closet/proc/singularity_act", function* singularity_act(f: Frame) {
	yield* g.srcCall(f, "dump_contents");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
