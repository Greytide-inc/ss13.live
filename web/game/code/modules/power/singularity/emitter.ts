// From code/modules/power/singularity/emitter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10307, "/obj/machinery/power/emitter", "/obj/machinery/power", {
	icon_state_on: "emitter_+a",
	manual: 0,
	charge: 0,
	target: null,
	active: 0,
	powered: 0,
	fire_delay: 100,
	maximum_fire_delay: 100,
	minimum_fire_delay: 20,
	last_shot: 0,
	shot_number: 0,
	state: 0,
	locked: 0,
	projectile_type: rt.typePath("/obj/item/projectile/beam/emitter"),
	projectile_sound: rt.rsc("sound/weapons/emitter.ogg"),
	sparks: null,
	anchored: 0,
	name: "emitter",
	desc: "A heavy-duty industrial laser, often used in containment fields and power generation.\n<span class='notice'>Alt-click to rotate it clockwise.</span>",
	icon: rt.rsc("icons/obj/singularity.dmi"),
	icon_state: "emitter",
	density: 1,
	req_access: null,
	use_power: 0,
	idle_power_usage: 10,
	active_power_usage: 300,
});

// /obj/machinery/power/emitter/proc/<init>  (code/modules/power/singularity/emitter.dm:9)
rt.def("/obj/machinery/power/emitter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(11));
	return f.dot;
});

// /obj/machinery/power/emitter/proc/New  (code/modules/power/singularity/emitter.dm:37)  may sleep
rt.def("/obj/machinery/power/emitter/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/emitter"), [null]))), "apply_default_parts", [live(f.src)]);
	yield* g.srcCall(f, "RefreshParts");
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/emitter"), [live(f.src)])));
	return f.dot;
}, true);

rt.type(6772, "/obj/item/weapon/circuitboard/machine/emitter", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Emitter (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/emitter"),
	origin_tech: "programming=3;powerstorage=4;engineering=4",
});

// /obj/item/weapon/circuitboard/machine/emitter/proc/<init>  (code/modules/power/singularity/emitter.dm:47)
rt.def("/obj/item/weapon/circuitboard/machine/emitter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]));
	return f.dot;
});

// /obj/machinery/power/emitter/proc/RefreshParts  (code/modules/power/singularity/emitter.dm:56)
rt.def("/obj/machinery/power/emitter/proc/RefreshParts", function RefreshParts(f: Frame) {
	let max_firedelay: Value = null, firedelay: Value = null, min_firedelay: Value = null, power_usage: Value = null, L: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [max_firedelay, firedelay, min_firedelay, power_usage, L, M, $e];
	max_firedelay = 120;
	firedelay = 120;
	min_firedelay = 24;
	power_usage = 350;
	L = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/micro_laser"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		(max_firedelay = rt.modify(live(max_firedelay), multiply(20, rt.fv(f, "rating", live(L))), subtract));
		(min_firedelay = rt.modify(live(min_firedelay), multiply(4, rt.fv(f, "rating", live(L))), subtract));
		(firedelay = rt.modify(live(firedelay), multiply(20, rt.fv(f, "rating", live(L))), subtract));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "maximum_fire_delay", live(max_firedelay));
	rt.setSv(f, "minimum_fire_delay", live(min_firedelay));
	rt.setSv(f, "fire_delay", live(firedelay));
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		(power_usage = rt.modify(live(power_usage), multiply(50, rt.fv(f, "rating", live(M))), subtract));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "active_power_usage", live(power_usage));
	return f.dot;
});

// /obj/machinery/power/emitter/verb/rotate  (code/modules/power/singularity/emitter.dm:72)
rt.def("/obj/machinery/power/emitter/verb/rotate", function rotate(f: Frame) {
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "anchored", live(f.src)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>It is fastened to the floor!</span>"]);
		return 0;
	}
	rt.callName(f, live(f.src), "setDir", [rt.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(f.src)), 270])]);
	return 1;
}, false, { verb: { name: "Rotate", category: "Object", src: 3, range: 1 } });

// /obj/machinery/power/emitter/proc/AltClick  (code/modules/power/singularity/emitter.dm:81)  may sleep
rt.def("/obj/machinery/power/emitter/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 1)) {
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "rotate");
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/power/emitter/proc/Initialize  (code/modules/power/singularity/emitter.dm:91)  may sleep
rt.def("/obj/machinery/power/emitter/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	// ss13.live: the CTF arena's energy cannons wait for a CTF game (start_ctf turns them on, stop_ctf off). tg fired them all
	// round: their beams and sparks were 16% of the long-lived garbage behind solo play's GC freezes (plans/less-garbage.md).
	if (rt.istype(live(f.src), T("/obj/machinery/power/emitter/energycannon")) && rt.istype((yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), T("/area/ctf"))) rt.setSv(f, "active", 0);
	if ((isEqual(rt.sv(f, "state"), 2) && truthy(rt.sv(f, "anchored")))) {
		yield* g.srcCall(f, "connect_to_network");
	}
	rt.setSv(f, "sparks", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	yield* g.callName(f, rt.sv(f, "sparks"), "attach", [live(f.src)]);
	yield* g.callName(f, rt.sv(f, "sparks"), "set_up", [5, 1, live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/power/emitter/proc/Destroy  (code/modules/power/singularity/emitter.dm:100)  may sleep
rt.def("/obj/machinery/power/emitter/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	let $0: any;
	f.vars = () => [_T, $0];
	if ((truthy(rt.gl("SSticker")) && truthy((yield* g.callName(f, rt.gl("SSticker"), "IsRoundInProgress", []))))) {
		if (truthy((_T = rt.getStep(f, live(f.src), 0)))) {
			$0 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		} else {
			$0 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Emitter deleted at ＀", [fmt("＀", [$0])]), 0, 1]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("Emitter deleted at ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
		yield* g.srcCall(f, "investigate_log", fmt("<font color='red'>deleted</font> at ＀ ＀", [(yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]), "singulo");
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "sparks")]);
	rt.setSv(f, "sparks", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/power/emitter/proc/update_icon  (code/modules/power/singularity/emitter.dm:109)
rt.def("/obj/machinery/power/emitter/proc/update_icon", function update_icon(f: Frame) {
	if (((truthy(rt.sv(f, "active")) && truthy(rt.sv(f, "powernet"))) && truthy(rt.callSrc(f, "avail", [rt.sv(f, "active_power_usage")])))) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_state_on"));
	} else {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	}
	return f.dot;
});

// /obj/machinery/power/emitter/proc/attack_hand  (code/modules/power/singularity/emitter.dm:116)  may sleep
rt.def("/obj/machinery/power/emitter/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [user, $0, $1];
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	if (isEqual(rt.sv(f, "state"), 2)) {
		if (!truthy(rt.sv(f, "powernet"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The emitter isn't connected to a wire!</span>"]);
			return 1;
		}
		if (!truthy(rt.fv(f, "locked", live(f.src)))) {
			if (isEqual(rt.fv(f, "active", live(f.src)), 1)) {
				rt.setFv(f, "active", live(f.src), 0);
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You turn off ％！.</span>", [live(f.src)])]);
				$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
				if (truthy(live(f.src))) {
					$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])]);
				} else {
					$1 = "nonexistent location";
				}
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("Emitter turned off by ＀ in ＀", [$0, fmt("＀", [$1])]), 0, 1]);
				yield* g.call(f, P("/proc/log_game"), null, [fmt("Emitter turned off by ＀ in ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
				yield* g.srcCall(f, "investigate_log", fmt("turned <font color='red'>off</font> by ＀ at ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))]), "singulo");
			} else {
				rt.setFv(f, "active", live(f.src), 1);
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You turn on ％！.</span>", [live(f.src)])]);
				rt.setFv(f, "shot_number", live(f.src), 0);
				rt.setFv(f, "fire_delay", live(f.src), rt.sv(f, "maximum_fire_delay"));
				yield* g.srcCall(f, "investigate_log", fmt("turned <font color='green'>on</font> by ＀ at ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))]), "singulo");
			}
			yield* g.srcCall(f, "update_icon");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The controls are locked!</span>"]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ needs to be firmly secured to the floor first!</span>", [live(f.src)])]);
		return 1;
	}
	return f.dot;
}, true);

// /obj/machinery/power/emitter/proc/attack_animal  (code/modules/power/singularity/emitter.dm:142)  may sleep
rt.def("/obj/machinery/power/emitter/proc/attack_animal", function* attack_animal(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0)) && truthy(rt.sv(f, "anchored")))) {
		rt.setSv(f, "state", 0);
		rt.setSv(f, "anchored", 0);
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ rips ＀ free from its moorings!</span>", [live(f.args[0]), live(f.src)])]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	if (truthy(rt.sv(f, "anchored"))) return f.dot;
	yield* g.call(f, P("/proc/step"), null, [live(f.src), rt.getDir(f, live(f.args[0]), live(f.src))]);
	return f.dot;
}, true, { args: ["M"] });

// /obj/machinery/power/emitter/proc/process  (code/modules/power/singularity/emitter.dm:162)  may sleep
rt.def("/obj/machinery/power/emitter/proc/process", function* process(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	if ((!isEqual(rt.fv(f, "state", live(f.src)), 2) || (!truthy(rt.sv(f, "powernet")) && truthy(rt.sv(f, "active_power_usage"))))) {
		rt.setFv(f, "active", live(f.src), 0);
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "active", live(f.src)), 1)) return f.dot;
	if ((!truthy(rt.sv(f, "active_power_usage")) || truthy((yield* g.srcCall(f, "avail", rt.sv(f, "active_power_usage")))))) {
		yield* g.srcCall(f, "add_load", rt.sv(f, "active_power_usage"));
		if (!truthy(rt.sv(f, "powered"))) {
			rt.setSv(f, "powered", 1);
			yield* g.srcCall(f, "update_icon");
			yield* g.srcCall(f, "investigate_log", fmt("regained power and turned <font color='green'>on</font> at ＀", [(yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))]), "singulo");
		}
	} else {
		if (truthy(rt.sv(f, "powered"))) {
			rt.setSv(f, "powered", 0);
			yield* g.srcCall(f, "update_icon");
			yield* g.srcCall(f, "investigate_log", fmt("lost power and turned <font color='red'>off</font> at ＀", [(yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))]), "singulo");
			yield* g.call(f, P("/proc/log_game"), null, [fmt("Emitter lost power in (＀,＀,＀)", [rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z")])]);
		}
		return live(f.dot);
	}
	if (rt.le(rt.sv(f, "charge"), 80)) {
		rt.modSrcVar(f, "charge", 5, add);
	}
	if ((!truthy((yield* g.srcCall(f, "check_delay"))) || isEqual(rt.sv(f, "manual"), 1))) {
		return 0;
	}
	yield* g.srcCall(f, "fire_beam", rt.sv(f, "target"));
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/power/emitter/proc/check_delay  (code/modules/power/singularity/emitter.dm:189)
rt.def("/obj/machinery/power/emitter/proc/check_delay", function check_delay(f: Frame) {
	if (rt.le(add(rt.fv(f, "last_shot", live(f.src)), rt.fv(f, "fire_delay", live(f.src))), rt.worldTime(f))) {
		return 1;
	}
	return 0;
});

// /obj/machinery/power/emitter/proc/fire_beam_pulse  (code/modules/power/singularity/emitter.dm:194)  may sleep
rt.def("/obj/machinery/power/emitter/proc/fire_beam_pulse", function* fire_beam_pulse(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "check_delay")))) {
		return 0;
	}
	if (!isEqual(rt.sv(f, "state"), 2)) {
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "avail", rt.sv(f, "active_power_usage"))))) return f.dot;
	yield* g.srcCall(f, "add_load", rt.sv(f, "active_power_usage"));
	yield* g.srcCall(f, "fire_beam");
	return f.dot;
}, true);

// /obj/machinery/power/emitter/proc/fire_beam  (code/modules/power/singularity/emitter.dm:203)  may sleep
rt.def("/obj/machinery/power/emitter/proc/fire_beam", function* fire_beam(f: Frame, targeted_atom: Value, user: Value) {
	let targets_from: Value = null, _P: Value = null;
	let $0: any;
	f.vars = () => [targeted_atom, user, targets_from, _P, $0];
	targets_from = rt.getStep(f, live(f.src), 0);
	if ((truthy(live(targeted_atom)) && ((isEqual(live(targeted_atom), live(user)) || isEqual(live(targeted_atom), live(targets_from))) || isEqual(live(targeted_atom), live(f.src))))) {
		return live(f.dot);
	}
	_P = (yield* g.new_(f, rt.sv(f, "projectile_type"), [live(targets_from)]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.sv(f, "projectile_sound"), 50, 1]);
	if (truthy(rt.op(f, "Prob", [], [35]))) {
		yield* g.callName(f, rt.sv(f, "sparks"), "start", []);
	}
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setFv(f, "yo", live(_P), 20);
		rt.setFv(f, "xo", live(_P), 0);
	} else if ($0 === 5) {
		rt.setFv(f, "yo", live(_P), 20);
		rt.setFv(f, "xo", live(_P), 20);
	} else if ($0 === 4) {
		rt.setFv(f, "yo", live(_P), 0);
		rt.setFv(f, "xo", live(_P), 20);
	} else if ($0 === 6) {
		rt.setFv(f, "yo", live(_P), -20);
		rt.setFv(f, "xo", live(_P), 20);
	} else if ($0 === 8) {
		rt.setFv(f, "yo", live(_P), 0);
		rt.setFv(f, "xo", live(_P), -20);
	} else if ($0 === 10) {
		rt.setFv(f, "yo", live(_P), -20);
		rt.setFv(f, "xo", live(_P), -20);
	} else if ($0 === 9) {
		rt.setFv(f, "yo", live(_P), 20);
		rt.setFv(f, "xo", live(_P), -20);
	} else {
		rt.setFv(f, "yo", live(_P), -20);
		rt.setFv(f, "xo", live(_P), 0);
	}
	if (truthy(rt.sv(f, "target"))) {
		rt.setFv(f, "yo", live(_P), subtract(rt.fv(f, "y", live(targeted_atom)), rt.fv(f, "y", live(targets_from))));
		rt.setFv(f, "xo", live(_P), subtract(rt.fv(f, "x", live(targeted_atom)), rt.fv(f, "x", live(targets_from))));
		rt.setFv(f, "current", live(_P), live(targets_from));
		rt.setFv(f, "starting", live(_P), live(targets_from));
		rt.setFv(f, "firer", live(_P), live(f.src));
		rt.setFv(f, "original", live(_P), live(targeted_atom));
	}
	if (!truthy(rt.sv(f, "manual"))) {
		rt.setSv(f, "last_shot", rt.worldTime(f));
		if (rt.lt(rt.sv(f, "shot_number"), 3)) {
			rt.setSv(f, "fire_delay", 20);
			rt.incSrcVar(f, "shot_number", 1, true);
		} else {
			rt.setSv(f, "fire_delay", (yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "minimum_fire_delay"), rt.sv(f, "maximum_fire_delay")])));
			rt.setSv(f, "shot_number", 0);
		}
		if (!truthy(rt.sv(f, "target"))) {
			yield* g.callName(f, live(_P), "setDir", [rt.fv(f, "dir", live(f.src))]);
			rt.setFv(f, "starting", live(_P), rt.sv(f, "loc"));
		} else {
			if ((!truthy(rt.sv(f, "target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "target"))))) {
				rt.setSv(f, "target", null);
			}
		}
	}
	yield* g.callName(f, live(_P), "fire", []);
	return live(_P);
}, true);

// /obj/machinery/power/emitter/proc/can_be_unfasten_wrench  (code/modules/power/singularity/emitter.dm:260)
rt.def("/obj/machinery/power/emitter/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame) {
	if (isEqual(rt.sv(f, "state"), 2)) {
		if (!truthy(live(f.args[1]))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ is welded to the floor!</span>", [live(f.src)])]);
		}
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user", "silent"] });

// /obj/machinery/power/emitter/proc/default_unfasten_wrench  (code/modules/power/singularity/emitter.dm:267)  may sleep
rt.def("/obj/machinery/power/emitter/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!isEqual(live(f.dot), 2)) return f.dot;
	if (truthy(rt.sv(f, "anchored"))) {
		rt.setSv(f, "state", 1);
	} else {
		rt.setSv(f, "state", 0);
	}
	return f.dot;
}, true, { args: ["user", "W", "time"] });

// /obj/machinery/power/emitter/proc/attackby  (code/modules/power/singularity/emitter.dm:275)  may sleep
rt.def("/obj/machinery/power/emitter/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	let $0: any, $1: any;
	f.vars = () => [WT, $0, $1];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "active"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Turn ％！ off first!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]), 0);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		WT = live(f.args[0]);
		if (truthy(rt.sv(f, "active"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("Turn ％！ off first.", [live(f.src)])]);
			return live(f.dot);
		}
		$0 = rt.sv(f, "state");
		if ($0 === 0) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ needs to be wrenched to the floor!</span>", [rt.fv(f, "name", live(f.src))])]);
		} else if ($0 === 1) {
			if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to weld the ＀ to the floor.", [rt.fv(f, "name", live(f.args[1])), rt.sv(f, "name")]), fmt("<span class='notice'>You start to weld ％！ to the floor...</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
				if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
					rt.setSv(f, "state", 2);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You weld ％！ to the floor.</span>", [live(f.src)])]);
					yield* g.srcCall(f, "connect_to_network");
				}
			}
		} else if ($0 === 2) {
			if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to cut the ＀ free from the floor.", [rt.fv(f, "name", live(f.args[1])), rt.sv(f, "name")]), fmt("<span class='notice'>You start to cut ％！ free from the floor...</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
				if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
					rt.setSv(f, "state", 1);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You cut ％！ free from the floor.</span>", [live(f.src)])]);
					yield* g.srcCall(f, "disconnect_from_network");
				}
			}
		}
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(f.args[0]), "GetID", [])))) {
		if (truthy(rt.sv(f, "emagged"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The lock seems to be broken!</span>"]);
			return live(f.dot);
		}
		if (truthy((yield* g.srcCall(f, "allowed", live(f.args[1]))))) {
			if (truthy(rt.sv(f, "active"))) {
				rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
				$0 = live(f.args[1]);
				if (truthy(rt.fv(f, "locked", live(f.src)))) {
					$1 = "lock";
				} else {
					$1 = "unlock";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the controls.</span>", [$1])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The controls can only be locked when ％！ is online!</span>", [live(f.src)])]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Access denied.</span>"]);
		}
		return live(f.dot);
	}
	if ((truthy((yield* g.call(f, P("/proc/is_wire_tool"), null, [live(f.args[0])]))) && truthy(rt.sv(f, "panel_open")))) {
		yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[1])]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "emitter_open", "emitter", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/power/emitter/proc/emag_act  (code/modules/power/singularity/emitter.dm:345)
rt.def("/obj/machinery/power/emitter/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "locked", 0);
	rt.setSv(f, "emagged", 1);
	if (!truthy(live(user))) return f.dot;
	rt.callName(f, live(user), "visible_message", [fmt("＀ emags the ＀.", [rt.fv(f, "name", live(user)), rt.fv(f, "name", live(f.src))]), "<span class='notice'>You short out the lock.</span>"]);
	return f.dot;
});

rt.type(10310, "/obj/machinery/power/emitter/prototype", "/obj/machinery/power/emitter", {
	view_range: 12,
	auto: null,
	icon_state_on: "protoemitter_+a",
	can_buckle: 1,
	buckle_lying: 0,
	name: "Prototype Emitter",
	icon: rt.rsc("icons/obj/turrets.dmi"),
	icon_state: "protoemitter",
});

// /obj/machinery/power/emitter/prototype/proc/unbuckle_mob  (code/modules/power/singularity/emitter.dm:365)  may sleep
rt.def("/obj/machinery/power/emitter/prototype/proc/unbuckle_mob", function* unbuckle_mob(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1]);
	rt.setSv(f, "manual", 0);
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(f.args[0])), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/turret_control")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
	}
	rt.endFor(f, 0);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		rt.setFv(f, "pixel_x", live(f.args[0]), 0);
		rt.setFv(f, "pixel_y", live(f.args[0]), 0);
		if (truthy(rt.fv(f, "client", live(f.args[0])))) {
			yield* g.callName(f, rt.fv(f, "client", live(f.args[0])), "change_view", [(yield* g.callName(f, rt.fv(f, "client", live(f.args[0])), "default_view", []))]);
		}
	}
	yield* g.callName(f, rt.sv(f, "auto"), "Remove", [live(f.args[0])]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["buckled_mob", "force"] });

// /obj/machinery/power/emitter/prototype/proc/user_buckle_mob  (code/modules/power/singularity/emitter.dm:379)  may sleep
rt.def("/obj/machinery/power/emitter/prototype/proc/user_buckle_mob", function* user_buckle_mob(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	if ((truthy((yield* g.callName(f, live(f.args[1]), "incapacitated", []))) || !truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon")) ? 1 : 0)))) {
		return live(f.dot);
	}
	A = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((truthy(rt.fv(f, "density", live(A))) && (!isEqual(live(A), live(f.src)) && !isEqual(live(A), live(f.args[0]))))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(f.args[0]), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1]);
	rt.setFv(f, "pixel_y", live(f.args[0]), 14);
	rt.setSv(f, "layer", 4.099999904632568);
	if (truthy(rt.fv(f, "client", live(f.args[0])))) {
		yield* g.callName(f, rt.fv(f, "client", live(f.args[0])), "change_view", [rt.sv(f, "view_range")]);
	}
	if (!truthy(rt.sv(f, "auto"))) {
		rt.setSv(f, "auto", (yield* g.new_(f, T("/datum/action/innate/protoemitter/firing"), [])));
	}
	yield* g.callName(f, rt.sv(f, "auto"), "Grant", [live(f.args[0]), live(f.src)]);
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(169, "/datum/action/innate/protoemitter", "/datum/action/innate", {
	PE: null,
	U: null,
	check_flags: 11,
});

// /datum/action/innate/protoemitter/proc/Grant  (code/modules/power/singularity/emitter.dm:402)  may sleep
rt.def("/datum/action/innate/protoemitter/proc/Grant", function* Grant(f: Frame) {
	rt.setSv(f, "PE", live(f.args[1]));
	rt.setSv(f, "U", live(f.args[0]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["L", "proto"] });

rt.type(170, "/datum/action/innate/protoemitter/firing", "/datum/action/innate/protoemitter", {
	name: "Switch to Manual Firing",
	desc: "The emitter will only fire on your command and at your designated target",
	button_icon_state: "mech_zoom_on",
});

// /datum/action/innate/protoemitter/firing/proc/Activate  (code/modules/power/singularity/emitter.dm:412)  may sleep
rt.def("/datum/action/innate/protoemitter/firing/proc/Activate", function* Activate(f: Frame) {
	let I: Value = null, V: Value = null, I_1: Value = null, TC: Value = null;
	let $e: any;
	f.vars = () => [I, V, I_1, TC, $e];
	if (truthy(rt.fv(f, "manual", rt.sv(f, "PE")))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "PE"), rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1]);
		rt.setFv(f, "manual", rt.sv(f, "PE"), 0);
		rt.setSv(f, "name", "Switch to Manual Firing");
		rt.setSv(f, "desc", "The emitter will only fire on your command and at your designated target");
		rt.setSv(f, "button_icon_state", "mech_zoom_on");
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", rt.sv(f, "U")), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (truthy((rt.istype(live(I), T("/obj/item/weapon/turret_control")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
			}
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "UpdateButtonIcon");
		return live(f.dot);
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "PE"), rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1]);
		rt.setSv(f, "name", "Switch to Automatic Firing");
		rt.setSv(f, "desc", "Emitters will switch to periodic firing at your last target");
		rt.setSv(f, "button_icon_state", "mech_zoom_off");
		rt.setFv(f, "manual", rt.sv(f, "PE"), 1);
		V = null;
		rt.forList(f, 0, rt.fv(f, "held_items", rt.sv(f, "U")));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			if (truthy((rt.istype((I_1 = live(V)), T("/obj/item")) ? 1 : 0))) {
				if (truthy((yield* g.callName(f, rt.sv(f, "U"), "dropItemToGround", [live(I_1)])))) {
					TC = (yield* g.new_(f, T("/obj/item/weapon/turret_control"), []));
					yield* g.callName(f, rt.sv(f, "U"), "put_in_hands", [live(TC)]);
				}
			} else {
				TC = (yield* g.new_(f, T("/obj/item/weapon/turret_control"), []));
				yield* g.callName(f, rt.sv(f, "U"), "put_in_hands", [live(TC)]);
			}
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "UpdateButtonIcon");
	}
	return f.dot;
}, true);

rt.type(7642, "/obj/item/weapon/turret_control", "/obj/item/weapon", {
	delay: 0,
	flags: 130,
	name: "turret controls",
	icon_state: "offhand",
	w_class: 5,
	resistance_flags: 54,
});

// /obj/item/weapon/turret_control/proc/afterattack  (code/modules/power/singularity/emitter.dm:450)  may sleep
rt.def("/obj/item/weapon/turret_control/proc/afterattack", function* afterattack(f: Frame) {
	let E: Value = null;
	let $0: any;
	f.vars = () => [E, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (E = rt.fv(f, "buckled", live(f.args[1]))), "setDir", [rt.getDir(f, live(E), live(f.args[0]))]);
	yield* g.callName(f, live(f.args[1]), "setDir", [rt.fv(f, "dir", live(E))]);
	$0 = rt.fv(f, "dir", live(E));
	if ($0 === 1) {
		rt.setFv(f, "layer", live(E), 3.9000000953674316);
		rt.setFv(f, "pixel_x", live(f.args[1]), 0);
		rt.setFv(f, "pixel_y", live(f.args[1]), -14);
	} else if ($0 === 5) {
		rt.setFv(f, "layer", live(E), 3.9000000953674316);
		rt.setFv(f, "pixel_x", live(f.args[1]), -8);
		rt.setFv(f, "pixel_y", live(f.args[1]), -12);
	} else if ($0 === 4) {
		rt.setFv(f, "layer", live(E), 4.099999904632568);
		rt.setFv(f, "pixel_x", live(f.args[1]), -14);
		rt.setFv(f, "pixel_y", live(f.args[1]), 0);
	} else if ($0 === 6) {
		rt.setFv(f, "layer", live(E), 3.9000000953674316);
		rt.setFv(f, "pixel_x", live(f.args[1]), -8);
		rt.setFv(f, "pixel_y", live(f.args[1]), 12);
	} else if ($0 === 2) {
		rt.setFv(f, "layer", live(E), 4.099999904632568);
		rt.setFv(f, "pixel_x", live(f.args[1]), 0);
		rt.setFv(f, "pixel_y", live(f.args[1]), 14);
	} else if ($0 === 10) {
		rt.setFv(f, "layer", live(E), 3.9000000953674316);
		rt.setFv(f, "pixel_x", live(f.args[1]), 8);
		rt.setFv(f, "pixel_y", live(f.args[1]), 12);
	} else if ($0 === 8) {
		rt.setFv(f, "layer", live(E), 4.099999904632568);
		rt.setFv(f, "pixel_x", live(f.args[1]), 14);
		rt.setFv(f, "pixel_y", live(f.args[1]), 0);
	} else if ($0 === 9) {
		rt.setFv(f, "layer", live(E), 3.9000000953674316);
		rt.setFv(f, "pixel_x", live(f.args[1]), 8);
		rt.setFv(f, "pixel_y", live(f.args[1]), -12);
	}
	if ((rt.ge(rt.fv(f, "charge", live(E)), 10) && rt.gt(rt.worldTime(f), rt.sv(f, "delay")))) {
		(rt.modField(f, live(E), "charge", 10, subtract));
		rt.setFv(f, "target", live(E), live(f.args[0]));
		yield* g.callName(f, live(E), "fire_beam", [live(f.args[0]), live(f.args[1])]);
		rt.setSv(f, "delay", add(rt.worldTime(f), 10));
	} else {
		if (!rt.lt(rt.fv(f, "charge", live(E)), 10)) return f.dot;
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.args[1]), 0), rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 1]);
	}
	return f.dot;
}, true, { args: ["targeted_atom", "user"] });
