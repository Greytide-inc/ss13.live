// From code/game/objects/structures/displaycase.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12723, "/obj/structure/displaycase", "/obj/structure", {
	showpiece: null,
	alert: 1,
	open: 0,
	openable: 1,
	electronics: null,
	start_showpiece_type: null,
	anchored: 1,
	name: "display case",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "glassbox0",
	desc: "A display case for prized possessions.",
	density: 1,
	resistance_flags: 32,
	armor: null,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 50,
});

// /obj/structure/displaycase/proc/<init>  (code/game/objects/structures/displaycase.dm:9)
rt.def("/obj/structure/displaycase/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 0, "laser", 0, "energy", 0, "bomb", 10, "bio", 0, "rad", 0, "fire", 70, "acid", 100]));
	return f.dot;
});

// /obj/structure/displaycase/proc/Initialize  (code/game/objects/structures/displaycase.dm:21)  may sleep
rt.def("/obj/structure/displaycase/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "start_showpiece_type"))) {
		rt.setSv(f, "showpiece", (yield* g.new_(f, rt.sv(f, "start_showpiece_type"), [live(f.src)])));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/displaycase/proc/Destroy  (code/game/objects/structures/displaycase.dm:28)  may sleep
rt.def("/obj/structure/displaycase/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "electronics"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "electronics")]);
		rt.setSv(f, "electronics", null);
	}
	if (truthy(rt.sv(f, "showpiece"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "showpiece")]);
		rt.setSv(f, "showpiece", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/displaycase/proc/examine  (code/game/objects/structures/displaycase.dm:34)
rt.def("/obj/structure/displaycase/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "alert"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Hooked up with an anti-theft system.</span>"]);
	}
	if (!truthy(rt.sv(f, "showpiece"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>There's ＀ inside.</span>", [rt.sv(f, "showpiece")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/displaycase/proc/dump  (code/game/objects/structures/displaycase.dm:43)  may sleep
rt.def("/obj/structure/displaycase/proc/dump", function* dump(f: Frame) {
	if (!truthy(rt.sv(f, "showpiece"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "showpiece"), "forceMove", [rt.sv(f, "loc")]);
	rt.setSv(f, "showpiece", null);
	return f.dot;
}, true);

// /obj/structure/displaycase/proc/play_attack_sound  (code/game/objects/structures/displaycase.dm:47)
rt.def("/obj/structure/displaycase/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
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
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/glasshit.ogg"), 75, 1]);
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/structure/displaycase/proc/deconstruct  (code/game/objects/structures/displaycase.dm:54)  may sleep
rt.def("/obj/structure/displaycase/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.srcCall(f, "dump");
		if (!truthy(live(disassembled))) {
			yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.fv(f, "loc", live(f.src))]);
			yield* g.srcCall(f, "trigger_alarm");
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/displaycase/proc/obj_break  (code/game/objects/structures/displaycase.dm:62)  may sleep
rt.def("/obj/structure/displaycase/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if (!(!truthy(rt.sv(f, "broken")) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	rt.setSv(f, "density", 0);
	rt.setSv(f, "broken", 1);
	yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.fv(f, "loc", live(f.src))]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "shatter", 70, 1]);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "trigger_alarm");
	return f.dot;
}, true);

// /obj/structure/displaycase/proc/trigger_alarm  (code/game/objects/structures/displaycase.dm:73)  may sleep
rt.def("/obj/structure/displaycase/proc/trigger_alarm", function* trigger_alarm(f: Frame) {
	let alarmed: Value = null;
	f.vars = () => [alarmed];
	if (!truthy(rt.sv(f, "alert"))) return f.dot;
	yield* g.callName(f, (alarmed = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))), "burglaralert", [live(f.src)]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/alert.ogg"), 50, 1]);
	return f.dot;
}, true);

// /obj/structure/displaycase/proc/is_directional  (code/game/objects/structures/displaycase.dm:82)
rt.def("/obj/structure/displaycase/proc/is_directional", function is_directional(f: Frame, A: Value) {
	rt.tryOpen(f);
	try {
		rt.call(f, P("/proc/getFlatIcon"), null, [null, live(A), "defdir", 4], rt.Args.Named);
		rt.tryClose(f);
	} catch ($err) {
		rt.catchValue(f, $err);
		return 0;
	}
	return 1;
});

// /obj/structure/displaycase/proc/get_flat_icon_directional  (code/game/objects/structures/displaycase.dm:92)  may sleep
rt.def("/obj/structure/displaycase/proc/get_flat_icon_directional", function* get_flat_icon_directional(f: Frame, A: Value) {
	let I: Value = null, old_dir: Value = null;
	f.vars = () => [A, I, old_dir];
	I = null;
	if (truthy((yield* g.srcCall(f, "is_directional", live(A))))) {
		I = (yield* g.call(f, P("/proc/getFlatIcon"), null, [live(A)]));
	} else {
		old_dir = rt.fv(f, "dir", live(A));
		yield* g.callName(f, live(A), "setDir", [2]);
		I = (yield* g.call(f, P("/proc/getFlatIcon"), null, [live(A)]));
		yield* g.callName(f, live(A), "setDir", [live(old_dir)]);
	}
	return live(I);
}, true);

// /obj/structure/displaycase/proc/update_icon  (code/game/objects/structures/displaycase.dm:104)  may sleep
rt.def("/obj/structure/displaycase/proc/update_icon", function* update_icon(f: Frame) {
	let I: Value = null, S: Value = null;
	f.vars = () => [I, S];
	I = null;
	if (truthy(rt.sv(f, "open"))) {
		I = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/obj/stationobjs.dmi"), "glassbox_open"]));
	} else {
		I = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/obj/stationobjs.dmi"), "glassbox0"]));
	}
	if (truthy(rt.sv(f, "broken"))) {
		I = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/obj/stationobjs.dmi"), "glassboxb0"]));
	}
	if (truthy(rt.sv(f, "showpiece"))) {
		yield* g.callName(f, (S = (yield* g.srcCall(f, "get_flat_icon_directional", rt.sv(f, "showpiece")))), "Scale", [17, 17]);
		yield* g.callName(f, live(I), "Blend", [live(S), 6, 8, 8]);
	}
	rt.setFv(f, "icon", live(f.src), live(I));
	return live(f.dot);
}, true);

// /obj/structure/displaycase/proc/attackby  (code/game/objects/structures/displaycase.dm:117)  may sleep
rt.def("/obj/structure/displaycase/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, G: Value = null;
	let $0: any, $1: any;
	f.vars = () => [WT, G, $0, $1];
	if (((truthy((yield* g.callName(f, live(f.args[0]), "GetID", []))) && !truthy(rt.sv(f, "broken"))) && truthy(rt.sv(f, "openable")))) {
		if (truthy((yield* g.srcCall(f, "allowed", live(f.args[1]))))) {
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "open"))) {
				$1 = "close";
			} else {
				$1 = "open";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the ＀</span>", [$1, live(f.src)])]);
			yield* g.srcCall(f, "toggle_lock", live(f.args[1]));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Access denied.</span>"]);
		}
	} else {
		if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help")) && !truthy(rt.sv(f, "broken")))) {
			WT = live(f.args[0]);
			if ((rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")) && truthy((yield* g.callName(f, live(WT), "remove_fuel", [5, live(f.args[1])]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin repairing ＀.</span>", [live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 40, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
					yield* g.srcCall(f, "update_icon");
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You repair ＀.</span>", [live(f.src)])]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is already in good condition!</span>", [live(f.src)])]);
			}
			return live(f.dot);
		} else {
			if (((!truthy(rt.sv(f, "alert")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) && truthy(rt.sv(f, "openable")))) {
				if (truthy(rt.sv(f, "broken"))) {
					if (truthy(rt.sv(f, "showpiece"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Remove the displayed object first.</span>"]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the destroyed case</span>"]);
						yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					}
				} else {
					$0 = live(f.args[1]);
					if (truthy(rt.sv(f, "open"))) {
						$1 = "close";
					} else {
						$1 = "open";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You start to ＀ the ＀</span>", [$1, live(f.src)])]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
						$0 = live(f.args[1]);
						if (truthy(rt.sv(f, "open"))) {
							$1 = "close";
						} else {
							$1 = "open";
						}
						yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the ＀</span>", [$1, live(f.src)])]);
						yield* g.srcCall(f, "toggle_lock", live(f.args[1]));
					}
				}
			} else {
				if ((truthy(rt.sv(f, "open")) && !truthy(rt.sv(f, "showpiece")))) {
					if (truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
						rt.setSv(f, "showpiece", live(f.args[0]));
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put ＀ on display</span>", [live(f.args[0])])]);
						yield* g.srcCall(f, "update_icon");
					}
				} else {
					if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/glass")) ? 1 : 0)) && truthy(rt.sv(f, "broken")))) {
						if (rt.lt((yield* g.callName(f, (G = live(f.args[0])), "get_amount", [])), 2)) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need two glass sheets to fix the case!</span>"]);
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start fixing ＀...</span>", [live(f.src)])]);
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
							yield* g.callName(f, live(G), "use", [2]);
							rt.setSv(f, "broken", 0);
							rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
							yield* g.srcCall(f, "update_icon");
						}
					} else {
						return (yield* g.callSuper(f, [], rt.Args.Same));
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/displaycase/proc/toggle_lock  (code/game/objects/structures/displaycase.dm:168)  may sleep
rt.def("/obj/structure/displaycase/proc/toggle_lock", function* toggle_lock(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "open", (!truthy(rt.sv(f, "open")) ? 1 : 0));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/displaycase/proc/attack_paw  (code/game/objects/structures/displaycase.dm:172)  may sleep
rt.def("/obj/structure/displaycase/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/structure/displaycase/proc/attack_hand  (code/game/objects/structures/displaycase.dm:175)  may sleep
rt.def("/obj/structure/displaycase/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	if ((truthy(rt.sv(f, "showpiece")) && (truthy(rt.sv(f, "broken")) || truthy(rt.sv(f, "open"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You deactivate the hover field built into the case.</span>"]);
		yield* g.srcCall(f, "dump");
		yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	} else {
		if (!truthy((yield* g.srcCall(f, "Adjacent", live(user))))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ kicks the display case.</span>", [live(user)]), null, null, 3]);
		yield* g.callName(f, live(user), "do_attack_animation", [live(f.src), "kick"]);
		yield* g.srcCall(f, "take_damage", 2);
	}
	return f.dot;
}, true);

rt.type(12727, "/obj/structure/displaycase_chassis", "/obj/structure", {
	electronics: null,
	anchored: 1,
	density: 0,
	name: "display case chassis",
	desc: "wooden base of display case",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "glassbox_chassis",
});

// /obj/structure/displaycase_chassis/proc/attackby  (code/game/objects/structures/displaycase.dm:203)  may sleep
rt.def("/obj/structure/displaycase_chassis/proc/attackby", function* attackby(f: Frame) {
	let G: Value = null, display: Value = null;
	f.vars = () => [G, display];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start disassembling ＀...</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.new_(f, T("/obj/item/stack/sheet/mineral/wood"), [rt.getStep(f, live(f.src), 0), 5]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/electronics/airlock")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start installing the electronics into ＀...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 30, "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)]))))) {
				rt.setSv(f, "electronics", live(f.args[0]));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You install the airlock electronics.</span>"]);
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/glass")) ? 1 : 0))) {
				if (rt.lt((yield* g.callName(f, (G = live(f.args[0])), "get_amount", [])), 10)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need ten glass sheets to do this!</span>"]);
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start adding ＀ to ＀...</span>", [live(G), live(f.src)])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
					yield* g.callName(f, live(G), "use", [10]);
					display = (yield* g.new_(f, T("/obj/structure/displaycase"), [rt.fv(f, "loc", live(f.src))]));
					if (truthy(rt.sv(f, "electronics"))) {
						rt.setFv(f, "loc", rt.sv(f, "electronics"), live(display));
						rt.setFv(f, "electronics", live(display), rt.sv(f, "electronics"));
						if (truthy(rt.fv(f, "one_access", rt.sv(f, "electronics")))) {
							rt.setFv(f, "req_one_access", live(display), rt.fv(f, "accesses", rt.sv(f, "electronics")));
						} else {
							rt.setFv(f, "req_access", live(display), rt.fv(f, "accesses", rt.sv(f, "electronics")));
						}
					}
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				}
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(12724, "/obj/structure/displaycase/captain", "/obj/structure/displaycase", {
	alert: 1,
	start_showpiece_type: rt.typePath("/obj/item/weapon/gun/energy/laser/captain"),
	req_access: null,
});

// /obj/structure/displaycase/captain/proc/<init>  (code/game/objects/structures/displaycase.dm:243)
rt.def("/obj/structure/displaycase/captain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(103));
	return f.dot;
});

rt.type(12725, "/obj/structure/displaycase/labcage", "/obj/structure/displaycase", {
	start_showpiece_type: rt.typePath("/obj/item/clothing/mask/facehugger/lamarr"),
	name: "lab cage",
	desc: "A glass lab container for storing interesting creatures.",
	req_access: null,
});

// /obj/structure/displaycase/labcage/proc/<init>  (code/game/objects/structures/displaycase.dm:249)
rt.def("/obj/structure/displaycase/labcage/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(30));
	return f.dot;
});

rt.type(12726, "/obj/structure/displaycase/trophy", "/obj/structure/displaycase", {
	trophy_message: "",
	placer_key: "",
	added_roundstart: 1,
	is_locked: 1,
	alert: 1,
	openable: 0,
	name: "trophy display case",
	desc: "Store your trophies of accomplishment in here, and they will stay forever.",
	integrity_failure: 0,
});

// /obj/structure/displaycase/trophy/proc/Initialize  (code/game/objects/structures/displaycase.dm:266)  may sleep
rt.def("/obj/structure/displaycase/trophy/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modGl("trophy_cases", live(f.src), add);
	return f.dot;
}, true);

// /obj/structure/displaycase/trophy/proc/Destroy  (code/game/objects/structures/displaycase.dm:270)  may sleep
rt.def("/obj/structure/displaycase/trophy/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("trophy_cases", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/displaycase/trophy/proc/examine  (code/game/objects/structures/displaycase.dm:274)
rt.def("/obj/structure/displaycase/trophy/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "trophy_message"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "The plaque reads:"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), rt.sv(f, "trophy_message")]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/displaycase/trophy/proc/attackby  (code/game/objects/structures/displaycase.dm:281)  may sleep
rt.def("/obj/structure/displaycase/trophy/proc/attackby", function* attackby(f: Frame) {
	let a: Value = null, chosen_plaque: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [a, chosen_plaque, $0, $1, $e];
	if (!truthy((yield* g.callName(f, live(f.args[1]), "Adjacent", [live(f.src)])))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((yield* g.callName(f, live(f.args[1]), "is_holding_item_of_type", [T("/obj/item/key/displaycase")])))) {
		if (truthy(rt.sv(f, "added_roundstart"))) {
			rt.setSv(f, "is_locked", (!truthy(rt.sv(f, "is_locked")) ? 1 : 0));
			$0 = live(f.args[1]);
			if (!truthy(rt.sv(f, "is_locked"))) {
				$1 = "un";
			} else {
				$1 = "";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("You ＀lock the case.", [$1])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>The lock is stuck shut!</span>"]);
		}
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "is_locked"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>The case is shut tight with an old fashioned physical lock. Maybe you should ask the curator for the key?</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "added_roundstart"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "You've already put something new in this case."]);
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[0]), rt.gl("blacklisted_cargo_types")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='danger'>The case rejects the ＀.</span>", [live(f.args[0])])]);
		return live(f.dot);
	}
	a = null;
	rt.forList(f, 0, (yield* g.callName(f, live(f.args[0]), "GetAllContents", [])));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(a), rt.gl("blacklisted_cargo_types")])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='danger'>The case rejects the ＀.</span>", [live(f.args[0])])]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	if (truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
		if (truthy(rt.sv(f, "showpiece"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("You press a button, and ＀ descends into the floor of the case.", [rt.sv(f, "showpiece")])]);
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "showpiece")]);
			rt.setSv(f, "showpiece", null);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("You insert ＀ into the case.", [live(f.args[0])])]);
		rt.setSv(f, "showpiece", live(f.args[0]));
		rt.setSv(f, "added_roundstart", 0);
		yield* g.srcCall(f, "update_icon");
		rt.setSv(f, "placer_key", rt.fv(f, "ckey", live(f.args[1])));
		rt.setSv(f, "trophy_message", rt.fv(f, "desc", live(f.args[0])));
		if (truthy((chosen_plaque = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "What would you like the plaque to say? Default value is item's description.", "Trophy Plaque"]))))) {
			if (truthy((yield* g.callName(f, live(f.args[1]), "Adjacent", [live(f.src)])))) {
				rt.setSv(f, "trophy_message", live(chosen_plaque));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "You set the plaque's text."]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "You are too far to set the plaque's text."]);
			}
		}
		yield* g.callName(f, rt.gl("SSpersistence"), "SaveTrophy", [live(f.src)]);
		return 1;
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ is stuck to your hand, you can't put it in the ＀!</span>", [live(f.args[0]), rt.fv(f, "name", live(f.src))])]);
	}
	return live(f.dot);
}, true, { args: ["W", "user", "params"] });

// /obj/structure/displaycase/trophy/proc/dump  (code/game/objects/structures/displaycase.dm:345)  may sleep
rt.def("/obj/structure/displaycase/trophy/proc/dump", function* dump(f: Frame) {
	if (!truthy(rt.sv(f, "showpiece"))) return f.dot;
	if (truthy(rt.sv(f, "added_roundstart"))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The ＀ crumbles to dust!</span>", [rt.sv(f, "showpiece")]));
		yield* g.new_(f, T("/obj/effect/decal/cleanable/ash"), [rt.sv(f, "loc")]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "showpiece")]);
		rt.setSv(f, "showpiece", null);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true);

rt.type(9872, "/obj/item/showpiece_dummy", "/obj/item", {
	name: "Cheap replica",
});

// /obj/item/showpiece_dummy/proc/Initialize  (code/game/objects/structures/displaycase.dm:359)  may sleep
rt.def("/obj/item/showpiece_dummy/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "name", rt.initial(f, (I = live(f.args[1])), "name"));
	rt.setSv(f, "icon", rt.initial(f, live(I), "icon"));
	rt.setSv(f, "icon_state", rt.initial(f, live(I), "icon_state"));
	return f.dot;
}, true, { args: ["mapload", "path"] });
