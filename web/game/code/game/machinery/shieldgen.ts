// From code/game/machinery/shieldgen.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12550, "/obj/structure/emergency_shield", "/obj/structure", {
	anchored: 1,
	CanAtmosPass: -2,
	name: "emergency energy shield",
	desc: "An energy shield used to contain hull breaches.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "shield-old",
	density: 1,
	opacity: 0,
	resistance_flags: 51,
	max_integrity: 200,
	obj_integrity: 200,
});

// /obj/structure/emergency_shield/proc/New  (code/game/machinery/shieldgen.dm:15)  may sleep
rt.def("/obj/structure/emergency_shield/proc/New", function* New(f: Frame) {
	yield* g.callName(f, live(f.src), "setDir", [rt.op(f, "PickUnweighted", [4], [1, 2, 3, 4])]);
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "air_update_turf", 1);
	return f.dot;
}, true);

// /obj/structure/emergency_shield/proc/Destroy  (code/game/machinery/shieldgen.dm:21)  may sleep
rt.def("/obj/structure/emergency_shield/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "density", 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/emergency_shield/proc/Move  (code/game/machinery/shieldgen.dm:25)  may sleep
rt.def("/obj/structure/emergency_shield/proc/Move", function* Move(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.sv(f, "loc");
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "move_update_air", live(_T));
	return f.dot;
}, true);

// /obj/structure/emergency_shield/proc/CanPass  (code/game/machinery/shieldgen.dm:30)
rt.def("/obj/structure/emergency_shield/proc/CanPass", function CanPass(f: Frame) {
	if (!truthy(live(f.args[2]))) {
		return 0;
	} else {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["mover", "target", "height"] });

// /obj/structure/emergency_shield/proc/emp_act  (code/game/machinery/shieldgen.dm:36)  may sleep
rt.def("/obj/structure/emergency_shield/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let $0: any;
	f.vars = () => [severity, $0];
	$0 = live(severity);
	if ($0 === 1) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else if ($0 === 2) {
		yield* g.srcCall(f, "take_damage", 50, "brute", "energy", 0);
	}
	return f.dot;
}, true);

// /obj/structure/emergency_shield/proc/play_attack_sound  (code/game/machinery/shieldgen.dm:43)
rt.def("/obj/structure/emergency_shield/proc/play_attack_sound", function play_attack_sound(f: Frame, damage: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/empulse.ogg"), 75, 1]);
	} else if ($0 === "brute") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/empulse.ogg"), 75, 1]);
	}
	return f.dot;
});

// /obj/structure/emergency_shield/proc/take_damage  (code/game/machinery/shieldgen.dm:50)  may sleep
rt.def("/obj/structure/emergency_shield/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.new_(f, T("/obj/effect/temp_visual/impact_effect/ion"), [rt.sv(f, "loc")]);
	return f.dot;
}, true, { args: ["damage", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

rt.type(10819, "/obj/machinery/shieldgen", "/obj/machinery", {
	active: 0,
	deployed_shields: null,
	locked: 0,
	shield_range: 4,
	anchored: 0,
	pressure_resistance: 202.65,
	name: "anti-breach shielding projector",
	desc: "Used to seal minor hull breaches.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "shieldoff",
	density: 1,
	opacity: 0,
	req_access: null,
	max_integrity: 100,
	obj_integrity: 100,
});

// /obj/machinery/shieldgen/proc/<init>  (code/game/machinery/shieldgen.dm:84)
rt.def("/obj/machinery/shieldgen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(10));
	return f.dot;
});

// /obj/machinery/shieldgen/proc/Initialize  (code/game/machinery/shieldgen.dm:93)  may sleep
rt.def("/obj/machinery/shieldgen/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "deployed_shields", rt.list());
	if (!((truthy(live(f.args[0])) && truthy(rt.sv(f, "active"))) && truthy(rt.sv(f, "anchored")))) return f.dot;
	yield* g.srcCall(f, "shields_up");
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/shieldgen/proc/Destroy  (code/game/machinery/shieldgen.dm:99)  may sleep
rt.def("/obj/machinery/shieldgen/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if (truthy(rt.sv(f, "deployed_shields"))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "deployed_shields"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "deployed_shields"), "Cut", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/shieldgen/proc/shields_up  (code/game/machinery/shieldgen.dm:105)  may sleep
rt.def("/obj/machinery/shieldgen/proc/shields_up", function* shields_up(f: Frame) {
	let target_tile: Value = null;
	let $e: any;
	f.vars = () => [target_tile, $e];
	rt.setSv(f, "active", 1);
	yield* g.srcCall(f, "update_icon");
	target_tile = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "shield_range"), live(f.src)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target_tile = $e;
		if ((truthy((rt.istype(live(target_tile), T("/turf/open/space")) ? 1 : 0)) && !truthy(rt.locateIn(f, T("/obj/structure/emergency_shield"), live(target_tile))))) {
			if ((!truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) || truthy(rt.op(f, "Prob", [], [33])))) {
				rt.modSrcVar(f, "deployed_shields", (yield* g.new_(f, T("/obj/structure/emergency_shield"), [live(target_tile)])), add);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/shieldgen/proc/shields_down  (code/game/machinery/shieldgen.dm:114)  may sleep
rt.def("/obj/machinery/shieldgen/proc/shields_down", function* shields_down(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	rt.setSv(f, "active", 0);
	yield* g.srcCall(f, "update_icon");
	if (!truthy(rt.sv(f, "deployed_shields"))) return f.dot;
	I = null;
	rt.forList(f, 0, rt.sv(f, "deployed_shields"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "deployed_shields"), "Cut", []);
	return f.dot;
}, true);

// /obj/machinery/shieldgen/proc/process  (code/game/machinery/shieldgen.dm:118)  may sleep
rt.def("/obj/machinery/shieldgen/proc/process", function* process(f: Frame) {
	if (!(truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) && truthy(rt.sv(f, "active")))) return f.dot;
	if (!(truthy(rt.len(f, rt.sv(f, "deployed_shields"))) && truthy(rt.op(f, "Prob", [], [5])))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "deployed_shields")])]);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/shieldgen/proc/deconstruct  (code/game/machinery/shieldgen.dm:124)
rt.def("/obj/machinery/shieldgen/proc/deconstruct", function deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) return f.dot;
	if (!truthy(0)) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.setSv(f, "locked", rt.op(f, "PickUnweighted", [2], [0, 1]));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/shieldgen/proc/attack_hand  (code/game/machinery/shieldgen.dm:132)  may sleep
rt.def("/obj/machinery/shieldgen/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The machine is locked, you are unable to use it!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "panel_open"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The panel must be closed before operating this machine!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "active"))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ deactivated ％！.", [live(user), live(f.src)]), fmt("<span class='notice'>You deactivate ％！.</span>", [live(f.src)]), "<span class='italics'>You hear heavy droning fade out.</span>"]);
		yield* g.srcCall(f, "shields_down");
	} else {
		if (truthy(rt.sv(f, "anchored"))) {
			yield* g.callName(f, live(user), "visible_message", [fmt("＀ activated ％！.", [live(user), live(f.src)]), fmt("<span class='notice'>You activate ％！.</span>", [live(f.src)]), "<span class='italics'>You hear heavy droning.</span>"]);
			yield* g.srcCall(f, "shields_up");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The device must first be secured to the floor!</span>"]);
		}
	}
	return live(f.dot);
}, true);

// /obj/machinery/shieldgen/proc/attackby  (code/game/machinery/shieldgen.dm:154)  may sleep
rt.def("/obj/machinery/shieldgen/proc/attackby", function* attackby(f: Frame) {
	let coil: Value = null;
	let $0: any, $1: any;
	f.vars = () => [coil, $0, $1];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
		rt.setSv(f, "panel_open", (!truthy(rt.sv(f, "panel_open")) ? 1 : 0));
		if (truthy(rt.sv(f, "panel_open"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You open the panel and expose the wiring.</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You close the panel.</span>"]);
		}
	} else {
		if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0)) && truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) && truthy(rt.sv(f, "panel_open")))) {
			if (rt.lt((yield* g.callName(f, (coil = live(f.args[0])), "get_amount", [])), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need one length of cable to repair ＀!</span>", [live(f.src)])]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You begin to replace the wires...</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 30, "target", live(f.src)], rt.Args.Named)))) {
				if (rt.lt((yield* g.callName(f, live(coil), "get_amount", [])), 1)) {
					return live(f.dot);
				}
				yield* g.callName(f, live(coil), "use", [1]);
				rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
				(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You repair ％！.</span>", [live(f.src)])]);
				yield* g.srcCall(f, "update_icon");
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
				if (truthy(rt.sv(f, "locked"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The bolts are covered! Unlocking this would retract the covers.</span>"]);
					return live(f.dot);
				}
				if ((!truthy(rt.sv(f, "anchored")) && !truthy((yield* g.srcCall(f, "isinspace"))))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You secure ％！ to the floor!</span>", [live(f.src)])]);
					rt.setSv(f, "anchored", 1);
				} else {
					if (truthy(rt.sv(f, "anchored"))) {
						yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You unsecure ％！ from the floor!</span>", [live(f.src)])]);
						if (truthy(rt.sv(f, "active"))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＄！ shuts off!</span>", [live(f.src)])]);
							yield* g.srcCall(f, "shields_down");
						}
						rt.setSv(f, "anchored", 0);
					}
				}
			} else {
				if (truthy((yield* g.callName(f, live(f.args[0]), "GetID", [])))) {
					if (truthy((yield* g.srcCall(f, "allowed", live(f.args[1]))))) {
						rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
						$0 = live(f.args[1]);
						if (truthy(rt.sv(f, "locked"))) {
							$1 = "lock";
						} else {
							$1 = "unlock";
						}
						yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the controls.</span>", [$1])]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Access denied.</span>"]);
					}
				} else {
					return (yield* g.callSuper(f, [], rt.Args.Same));
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/shieldgen/proc/emag_act  (code/game/machinery/shieldgen.dm:203)
rt.def("/obj/machinery/shieldgen/proc/emag_act", function emag_act(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.setSv(f, "obj_integrity", 0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/shieldgen/proc/update_icon  (code/game/machinery/shieldgen.dm:210)
rt.def("/obj/machinery/shieldgen/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "active"))) {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			$0 = "shieldonbr";
		} else {
			$0 = "shieldon";
		}
		rt.setSv(f, "icon_state", $0);
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			$0 = "shieldoffbr";
		} else {
			$0 = "shieldoff";
		}
		rt.setSv(f, "icon_state", $0);
	}
	return f.dot;
});

rt.type(10820, "/obj/machinery/shieldwallgen", "/obj/machinery", {
	active: 0,
	power: 0,
	maximum_stored_power: 500,
	locked: 1,
	shield_range: 8,
	attached: null,
	anchored: 0,
	flags: 64,
	use_power: 0,
	name: "shield wall generator",
	desc: "A shield generator.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "Shield_Gen",
	density: 1,
	req_access: null,
	obj_integrity: 300,
	max_integrity: 300,
});

// /obj/machinery/shieldwallgen/proc/<init>  (code/game/machinery/shieldgen.dm:223)
rt.def("/obj/machinery/shieldwallgen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(17));
	return f.dot;
});

rt.type(10821, "/obj/machinery/shieldwallgen/xenobiologyaccess", "/obj/machinery/shieldwallgen", {
	name: "xenobiology shield wall generator",
	desc: "A shield generator meant for use in xenobiology.",
	icon_state: "Shield_Gen",
	req_access: null,
});

// /obj/machinery/shieldwallgen/xenobiologyaccess/proc/<init>  (code/game/machinery/shieldgen.dm:239)
rt.def("/obj/machinery/shieldwallgen/xenobiologyaccess/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(55));
	return f.dot;
});

// /obj/machinery/shieldwallgen/proc/Destroy  (code/game/machinery/shieldgen.dm:242)  may sleep
rt.def("/obj/machinery/shieldwallgen/proc/Destroy", function* Destroy(f: Frame) {
	let d: Value = null;
	let $e: any;
	f.vars = () => [d, $e];
	d = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		yield* g.srcCall(f, "cleanup_field", live(d));
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/shieldwallgen/proc/power  (code/game/machinery/shieldgen.dm:247)
rt.def("/obj/machinery/shieldwallgen/proc/power", function power(f: Frame) {
	let _T: Value = null, C: Value = null, PN: Value = null, surplus: Value = null, avail_power: Value = null;
	f.vars = () => [_T, C, PN, surplus, avail_power];
	if (!truthy(rt.sv(f, "anchored"))) {
		rt.setSv(f, "power", 0);
		return live(f.dot);
	}
	_T = rt.getStep(f, live(f.src), 0);
	C = rt.callName(f, live(_T), "get_cable_node", []);
	PN = null;
	if (truthy(live(C))) {
		PN = rt.fv(f, "powernet", live(C));
	}
	if (!truthy(live(PN))) {
		return live(f.dot);
	}
	surplus = rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "avail", live(PN)), rt.fv(f, "load", live(PN))), 0]);
	if (!truthy((avail_power = rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/rand"), null, [50, 200]), live(surplus)])))) return f.dot;
	rt.modSrcVar(f, "power", live(avail_power), add);
	rt.modField(f, live(PN), "load", live(avail_power), add);
	return f.dot;
});

// /obj/machinery/shieldwallgen/proc/process  (code/game/machinery/shieldgen.dm:267)  may sleep
rt.def("/obj/machinery/shieldwallgen/proc/process", function* process(f: Frame) {
	yield* g.srcCall(f, "power");
	yield* g.srcCall(f, "use_stored_power", 50);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/shieldwallgen/proc/use_stored_power  (code/game/machinery/shieldgen.dm:271)  may sleep
rt.def("/obj/machinery/shieldwallgen/proc/use_stored_power", function* use_stored_power(f: Frame, amount: Value) {
	f.vars = () => [amount];
	rt.setSv(f, "power", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "power"), live(amount)), rt.sv(f, "maximum_stored_power")]))])));
	yield* g.srcCall(f, "update_activity");
	return f.dot;
}, true);

// /obj/machinery/shieldwallgen/proc/update_activity  (code/game/machinery/shieldgen.dm:276)  may sleep
rt.def("/obj/machinery/shieldwallgen/proc/update_activity", function* update_activity(f: Frame) {
	let fields: Value = null, d: Value = null, d_0: Value = null;
	let $e: any;
	f.vars = () => [fields, d, d_0, $e];
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "icon_state", "Shield_Gen +a");
		if (isEqual(rt.sv(f, "active"), 1)) {
			fields = 0;
			d = null;
			rt.forList(f, 0, rt.gl("cardinal"));
			while (($e = rt.next(f, 0)) !== undefined) {
				d = $e;
				if (truthy((yield* g.srcCall(f, "setup_field", live(d))))) {
					fields = rt.inc(live(fields), 1);
				}
			}
			rt.endFor(f, 0);
			if (truthy(live(fields))) {
				rt.setSv(f, "active", 2);
			}
		}
		if (!truthy(rt.sv(f, "power"))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The ＀ shuts down due to lack of power!</span>", [rt.fv(f, "name", live(f.src))]), "<span class='italics'>You hear heavy droning fade out.</span>");
			rt.setSv(f, "icon_state", "Shield_Gen");
			rt.setSv(f, "active", 0);
			d_0 = null;
			rt.forList(f, 0, rt.gl("cardinal"));
			while (($e = rt.next(f, 0)) !== undefined) {
				d_0 = $e;
				yield* g.srcCall(f, "cleanup_field", live(d_0));
			}
			rt.endFor(f, 0);
		}
	} else {
		rt.setSv(f, "icon_state", "Shield_Gen");
		d_0 = null;
		rt.forList(f, 0, rt.gl("cardinal"));
		while (($e = rt.next(f, 0)) !== undefined) {
			d_0 = $e;
			yield* g.srcCall(f, "cleanup_field", live(d_0));
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /obj/machinery/shieldwallgen/proc/setup_field  (code/game/machinery/shieldgen.dm:297)  may sleep
rt.def("/obj/machinery/shieldwallgen/proc/setup_field", function* setup_field(f: Frame, direction: Value) {
	let _T: Value = null, G: Value = null, steps: Value = null, opposite_direction: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [direction, _T, G, steps, opposite_direction, i, $e];
	if (!truthy(live(direction))) {
		return live(f.dot);
	}
	_T = rt.sv(f, "loc");
	G = null;
	steps = 0;
	opposite_direction = (yield* g.call(f, P("/proc/turn"), null, [live(direction), 180]));
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "shield_range"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		_T = rt.getStep(f, live(_T), live(direction));
		if (truthy((G = rt.locateIn(f, T("/obj/machinery/shieldwallgen"), live(_T))))) {
			if (!truthy(rt.fv(f, "active", live(G)))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(G), "cleanup_field", [live(opposite_direction)]);
			break;
		}
		steps = rt.inc(live(steps), 1);
	}
	rt.endFor(f, 0);
	if ((!truthy(live(G)) || !truthy(live(steps)))) {
		return live(f.dot);
	}
	i = null;
	rt.forRange(f, 0, 1, live(steps), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/machinery/shieldwall"), [(_T = rt.getStep(f, live(_T), live(opposite_direction))), live(f.src), live(G)]);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /obj/machinery/shieldwallgen/proc/cleanup_field  (code/game/machinery/shieldgen.dm:327)  may sleep
rt.def("/obj/machinery/shieldwallgen/proc/cleanup_field", function* cleanup_field(f: Frame, direction: Value) {
	let F: Value = null, G: Value = null, _T: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [direction, F, G, _T, i, $e];
	F = null;
	G = null;
	_T = rt.sv(f, "loc");
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "shield_range"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		_T = rt.getStep(f, live(_T), live(direction));
		if ((truthy((G = rt.locateIn(f, T("/obj/machinery/shieldwallgen"), live(_T)))) && !truthy(rt.fv(f, "active", live(G))))) {
			break;
		}
		if ((truthy((F = rt.locateIn(f, T("/obj/machinery/shieldwall"), live(_T)))) && (isEqual(rt.fv(f, "gen_primary", live(F)), live(f.src)) || isEqual(rt.fv(f, "gen_secondary", live(F)), live(f.src))))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(F)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/shieldwallgen/proc/can_be_unfasten_wrench  (code/game/machinery/shieldgen.dm:342)
rt.def("/obj/machinery/shieldwallgen/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		if (!truthy(live(f.args[1]))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Turn off the shield generator first!</span>"]);
		}
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user", "silent"] });

// /obj/machinery/shieldwallgen/proc/attackby  (code/game/machinery/shieldgen.dm:348)  may sleep
rt.def("/obj/machinery/shieldwallgen/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]), 0);
	} else {
		if (truthy((yield* g.callName(f, live(f.args[0]), "GetID", [])))) {
			if (truthy((yield* g.srcCall(f, "allowed", live(f.args[1]))))) {
				rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
				$0 = live(f.args[1]);
				if (truthy(rt.fv(f, "locked", live(f.src)))) {
					$1 = "lock";
				} else {
					$1 = "unlock";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the controls.</span>", [$1])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Access denied.</span>"]);
			}
		} else {
			yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/shieldwallgen/proc/attack_hand  (code/game/machinery/shieldgen.dm:363)  may sleep
rt.def("/obj/machinery/shieldwallgen/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "anchored"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ needs to be firmly secured to the floor first!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "locked")) && !truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The controls are locked!</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "power"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ needs to be powered by a wire!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "active"))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ turned ％！ off.", [live(user), live(f.src)]), fmt("<span class='notice'>You turn off ％！.</span>", [live(f.src)]), "<span class='italics'>You hear heavy droning fade out.</span>"]);
		rt.setSv(f, "active", 0);
		yield* g.srcCall(f, "update_activity");
	} else {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ turned ％！ on.", [live(user), live(f.src)]), fmt("<span class='notice'>You turn on ％！.</span>", [live(f.src)]), "<span class='italics'>You hear heavy droning.</span>"]);
		rt.setSv(f, "active", 1);
		yield* g.srcCall(f, "update_activity");
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

rt.type(10822, "/obj/machinery/shieldwall", "/obj/machinery", {
	needs_power: 0,
	gen_primary: null,
	gen_secondary: null,
	anchored: 1,
	light_range: 3,
	name: "shield wall",
	desc: "An energy shield.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "shieldwall",
	density: 1,
	resistance_flags: 115,
});

// /obj/machinery/shieldwall/proc/Initialize  (code/game/machinery/shieldgen.dm:403)  may sleep
rt.def("/obj/machinery/shieldwall/proc/Initialize", function* Initialize(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "gen_primary", live(f.args[1]));
	rt.setSv(f, "gen_secondary", live(f.args[2]));
	if ((truthy(rt.sv(f, "gen_primary")) && truthy(rt.sv(f, "gen_secondary")))) {
		rt.setSv(f, "needs_power", 1);
		yield* g.srcCall(f, "setDir", rt.getDir(f, rt.sv(f, "gen_primary"), rt.sv(f, "gen_secondary")));
	}
	L = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＄！ is suddenly occupying the same space as ％！!</span>", [live(f.src), live(L)]));
		yield* g.callName(f, live(L), "gib", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["mapload", "first_gen", "second_gen"] });

// /obj/machinery/shieldwall/proc/Destroy  (code/game/machinery/shieldgen.dm:416)  may sleep
rt.def("/obj/machinery/shieldwall/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "gen_primary", null);
	rt.setSv(f, "gen_secondary", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/shieldwall/proc/process  (code/game/machinery/shieldgen.dm:423)  may sleep
rt.def("/obj/machinery/shieldwall/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "needs_power"))) return f.dot;
	if ((((!truthy(rt.sv(f, "gen_primary")) || !truthy(rt.fv(f, "active", rt.sv(f, "gen_primary")))) || !truthy(rt.sv(f, "gen_secondary"))) || !truthy(rt.fv(f, "active", rt.sv(f, "gen_secondary"))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "drain_power", 10);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/shieldwall/proc/play_attack_sound  (code/game/machinery/shieldgen.dm:430)
rt.def("/obj/machinery/shieldwall/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/empulse.ogg"), 75, 1]);
	} else if ($0 === "brute") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/empulse.ogg"), 75, 1]);
	}
	return f.dot;
});

// /obj/machinery/shieldwall/proc/take_damage  (code/game/machinery/shieldgen.dm:438)  may sleep
rt.def("/obj/machinery/shieldwall/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(isEqual(live(f.args[1]), "brute") || isEqual(live(f.args[1]), "fire"))) return f.dot;
	yield* g.srcCall(f, "drain_power", live(f.args[0]));
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// /obj/machinery/shieldwall/proc/drain_power  (code/game/machinery/shieldgen.dm:443)  may sleep
rt.def("/obj/machinery/shieldwall/proc/drain_power", function* drain_power(f: Frame, drain_amount: Value) {
	f.vars = () => [drain_amount];
	if (!(truthy(rt.sv(f, "needs_power")) && truthy(rt.sv(f, "gen_primary")))) return f.dot;
	yield* g.callName(f, rt.sv(f, "gen_primary"), "use_stored_power", [multiply(live(drain_amount), 0.5)]);
	if (!truthy(rt.sv(f, "gen_secondary"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "gen_secondary"), "use_stored_power", [multiply(live(drain_amount), 0.5)]);
	return f.dot;
}, true);

// /obj/machinery/shieldwall/proc/CanPass  (code/game/machinery/shieldgen.dm:449)
rt.def("/obj/machinery/shieldwall/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(height), 0)) {
		return 0;
	}
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [2])))) {
		return rt.op(f, "Prob", [], [20]);
	}
	if (truthy((rt.istype(live(mover), T("/obj/item/projectile")) ? 1 : 0))) {
		return rt.op(f, "Prob", [], [10]);
	}
	return (!truthy(rt.sv(f, "density")) ? 1 : 0);
});
