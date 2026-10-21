// From code/game/machinery/doors/airlock.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10210, "/obj/machinery/door/airlock", "/obj/machinery/door", {
	id_tag: null,
	frequency: null,
	radio_connection: null,
	normal_integrity: 300,
	security_level: 0,
	aiControlDisabled: 0,
	hackProof: 0,
	secondsMainPowerLost: 0,
	secondsBackupPowerLost: 0,
	spawnPowerRestoreRunning: 0,
	lights: 1,
	aiDisabledIdScanner: 0,
	aiHacking: 0,
	closeOther: null,
	closeOtherId: null,
	lockdownbyai: 0,
	justzap: 0,
	electronics: null,
	hasShocked: 0,
	charge: null,
	note: null,
	detonated: 0,
	doorOpen: rt.rsc("sound/machines/airlock.ogg"),
	doorClose: rt.rsc("sound/machines/airlockclose.ogg"),
	doorDeni: rt.rsc("sound/machines/deniedbeep.ogg"),
	boltUp: rt.rsc("sound/machines/boltsup.ogg"),
	boltDown: rt.rsc("sound/machines/boltsdown.ogg"),
	noPower: rt.rsc("sound/machines/doorclick.ogg"),
	airlock_material: null,
	overlays_file: rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"),
	note_overlay_file: rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"),
	cyclelinkeddir: 0,
	cyclelinkedairlock: null,
	shuttledocked: 0,
	delayed_close_requested: 0,
	air_tight: 0,
	prying_so_hard: 0,
	explosion_block: 1,
	hud_possible: null,
	name: "airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station/public.dmi"),
	icon_state: "closed",
	obj_integrity: 300,
	max_integrity: 300,
	integrity_failure: 70,
	damage_deflection: 20,
	secondsElectrified: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_0"),
	normalspeed: 1,
	autoclose: 1,
}, { global: { airlock_overlays: 745 } });

// /obj/machinery/door/airlock/proc/<init>  (code/game/machinery/doors/airlock.dm:94)
rt.def("/obj/machinery/door/airlock/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hud_possible", rt.list("14"));
	return f.dot;
});

// /obj/machinery/door/airlock/proc/Initialize  (code/game/machinery/doors/airlock.dm:102)  may sleep
rt.def("/obj/machinery/door/airlock/proc/Initialize", function* Initialize(f: Frame) {
	let diag_hud: Value = null;
	f.vars = () => [diag_hud];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/airlock"), [live(f.src)])));
	if (truthy(rt.sv(f, "cyclelinkeddir"))) {
		yield* g.srcCall(f, "cyclelinkairlock");
	}
	if (truthy(rt.sv(f, "frequency"))) {
		yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	}
	if (rt.sv(f, "closeOtherId") !== null) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [P("/obj/machinery/door/airlock/proc/update_other_id")])), 5]);
	}
	if (truthy(rt.sv(f, "glass"))) {
		rt.setSv(f, "airlock_material", "glass");
	}
	if (rt.gt(rt.sv(f, "security_level"), 1)) {
		rt.setSv(f, "obj_integrity", multiply(rt.sv(f, "normal_integrity"), 1.5));
		rt.setSv(f, "max_integrity", multiply(rt.sv(f, "normal_integrity"), 1.5));
	} else {
		rt.setSv(f, "obj_integrity", rt.sv(f, "normal_integrity"));
		rt.setSv(f, "max_integrity", rt.sv(f, "normal_integrity"));
	}
	if ((isEqual(rt.sv(f, "damage_deflection"), 20) && rt.gt(rt.sv(f, "security_level"), 1))) {
		rt.setSv(f, "damage_deflection", 30);
	}
	yield* g.srcCall(f, "prepare_huds");
	yield* g.callName(f, (diag_hud = rt.index(rt.gl("huds"), 5)), "add_to_hud", [live(f.src)]);
	yield* g.srcCall(f, "diag_hud_set_electrified");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/update_other_id  (code/game/machinery/doors/airlock.dm:130)
rt.def("/obj/machinery/door/airlock/proc/update_other_id", function update_other_id(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, rt.gl("airlocks"), T("/obj/machinery/door/airlock"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((isEqual(rt.fv(f, "closeOtherId", live(A)), rt.sv(f, "closeOtherId")) && !isEqual(live(A), live(f.src)))) {
			rt.setSv(f, "closeOther", live(A));
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/door/airlock/proc/cyclelinkairlock  (code/game/machinery/doors/airlock.dm:137)
rt.def("/obj/machinery/door/airlock/proc/cyclelinkairlock", function cyclelinkairlock(f: Frame) {
	let limit: Value = null, _T: Value = null, FoundDoor: Value = null;
	f.vars = () => [limit, _T, FoundDoor];
	if (truthy(rt.sv(f, "cyclelinkedairlock"))) {
		rt.setFv(f, "cyclelinkedairlock", rt.sv(f, "cyclelinkedairlock"), null);
		rt.setSv(f, "cyclelinkedairlock", null);
	}
	if (!truthy(rt.sv(f, "cyclelinkeddir"))) {
		return live(f.dot);
	}
	limit = rt.fv(f, "view", rt.world());
	_T = rt.getStep(f, live(f.src), 0);
	FoundDoor = null;
	while (true) {
		_T = rt.getStep(f, live(_T), rt.sv(f, "cyclelinkeddir"));
		if ((truthy((FoundDoor = rt.locateIn(f, T("/obj/machinery/door/airlock"), live(_T)))) && !isEqual(rt.fv(f, "cyclelinkeddir", live(FoundDoor)), rt.getDir(f, live(FoundDoor), live(f.src))))) {
			FoundDoor = null;
		}
		limit = rt.inc(live(limit), -1);
		if (!(!truthy(live(FoundDoor)) && truthy(live(limit)))) break;
	}
	if (!truthy(live(FoundDoor))) {
		return live(f.dot);
	}
	rt.setFv(f, "cyclelinkedairlock", live(FoundDoor), live(f.src));
	rt.setSv(f, "cyclelinkedairlock", live(FoundDoor));
	return f.dot;
});

// /obj/machinery/door/airlock/proc/vv_edit_var  (code/game/machinery/doors/airlock.dm:157)  may sleep
rt.def("/obj/machinery/door/airlock/proc/vv_edit_var", function* vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	$0 = live(f.args[0]);
	if ($0 === "cyclelinkeddir") {
		yield* g.srcCall(f, "cyclelinkairlock");
	}
	return f.dot;
}, true, { args: ["var_name"] });

// /obj/machinery/door/airlock/proc/lock  (code/game/machinery/doors/airlock.dm:164)
rt.def("/obj/machinery/door/airlock/proc/lock", function lock(f: Frame) {
	rt.callSrc(f, "bolt", []);
	return f.dot;
});

// /obj/machinery/door/airlock/proc/bolt  (code/game/machinery/doors/airlock.dm:170)
rt.def("/obj/machinery/door/airlock/proc/bolt", function bolt(f: Frame) {
	if (truthy(rt.sv(f, "locked"))) {
		return live(f.dot);
	}
	rt.setSv(f, "locked", 1);
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "boltDown"), 30, 0, 3]);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/door/airlock/proc/unlock  (code/game/machinery/doors/airlock.dm:174)
rt.def("/obj/machinery/door/airlock/proc/unlock", function unlock(f: Frame) {
	rt.callSrc(f, "unbolt", []);
	return f.dot;
});

// /obj/machinery/door/airlock/proc/unbolt  (code/game/machinery/doors/airlock.dm:177)
rt.def("/obj/machinery/door/airlock/proc/unbolt", function unbolt(f: Frame) {
	if (!truthy(rt.sv(f, "locked"))) {
		return live(f.dot);
	}
	rt.setSv(f, "locked", 0);
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "boltUp"), 30, 0, 3]);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/door/airlock/proc/narsie_act  (code/game/machinery/doors/airlock.dm:184)  may sleep
rt.def("/obj/machinery/door/airlock/proc/narsie_act", function* narsie_act(f: Frame) {
	let _T: Value = null, runed: Value = null;
	f.vars = () => [_T, runed];
	_T = rt.getStep(f, live(f.src), 0);
	runed = rt.op(f, "Prob", [], [20]);
	if (truthy(rt.sv(f, "glass"))) {
		if (truthy(live(runed))) {
			yield* g.new_(f, T("/obj/machinery/door/airlock/cult/glass"), [live(_T)]);
		} else {
			yield* g.new_(f, T("/obj/machinery/door/airlock/cult/unruned/glass"), [live(_T)]);
		}
	} else {
		if (truthy(live(runed))) {
			yield* g.new_(f, T("/obj/machinery/door/airlock/cult"), [live(_T)]);
		} else {
			yield* g.new_(f, T("/obj/machinery/door/airlock/cult/unruned"), [live(_T)]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/ratvar_act  (code/game/machinery/doors/airlock.dm:200)  may sleep
rt.def("/obj/machinery/door/airlock/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (truthy(rt.sv(f, "glass"))) {
		yield* g.new_(f, T("/obj/machinery/door/airlock/clockwork/brass"), [rt.getStep(f, live(f.src), 0)]);
	} else {
		yield* g.new_(f, T("/obj/machinery/door/airlock/clockwork"), [rt.getStep(f, live(f.src), 0)]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/Destroy  (code/game/machinery/doors/airlock.dm:206)  may sleep
rt.def("/obj/machinery/door/airlock/proc/Destroy", function* Destroy(f: Frame) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	if (truthy(rt.sv(f, "charge"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "charge")]);
		rt.setSv(f, "charge", null);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "electronics")]);
	rt.setSv(f, "electronics", null);
	if (truthy(rt.sv(f, "cyclelinkedairlock"))) {
		if (isEqual(rt.fv(f, "cyclelinkedairlock", rt.sv(f, "cyclelinkedairlock")), live(f.src))) {
			rt.setFv(f, "cyclelinkedairlock", rt.sv(f, "cyclelinkedairlock"), null);
		}
		rt.setSv(f, "cyclelinkedairlock", null);
	}
	if (truthy(rt.sv(f, "id_tag"))) {
		D = null;
		rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/doorButtons"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			yield* g.callName(f, live(D), "removeMe", [live(f.src)]);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "note")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/door/airlock/proc/handle_atom_del  (code/game/machinery/doors/airlock.dm:222)
rt.def("/obj/machinery/door/airlock/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	if (!isEqual(live(A), rt.sv(f, "note"))) return f.dot;
	rt.setSv(f, "note", null);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/door/airlock/proc/bumpopen  (code/game/machinery/doors/airlock.dm:227)  may sleep
rt.def("/obj/machinery/door/airlock/proc/bumpopen", function* bumpopen(f: Frame) {
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, live(f.src), "isElectrified", [])))) {
			if (!truthy(rt.fv(f, "justzap", live(f.src)))) {
				if (truthy((yield* g.callName(f, live(f.src), "shock", [live(f.args[0]), 100])))) {
					rt.setFv(f, "justzap", live(f.src), 1);
					rt.spawnTail(f, 10, "/obj/machinery/door/airlock/proc/bumpopen: spawn at game/machinery/doors/airlock.dm:232");
					return live(f.dot);
				}
			} else {
				return live(f.dot);
			}
		} else {
			if ((((rt.gt(rt.fv(f, "hallucination", live(f.args[0])), 50) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) && truthy(rt.op(f, "Prob", [], [10]))) && isEqual(rt.fv(f, "operating", live(f.src)), 0))) {
				yield* g.srcCall(f, "hallucinate_shock", live(f.args[0]));
				return live(f.dot);
			}
		}
	}
	if (truthy(rt.sv(f, "cyclelinkedairlock"))) {
		if (((((!truthy(rt.sv(f, "shuttledocked")) && !truthy(rt.sv(f, "emergency"))) && !truthy(rt.fv(f, "shuttledocked", rt.sv(f, "cyclelinkedairlock")))) && !truthy(rt.fv(f, "emergency", rt.sv(f, "cyclelinkedairlock")))) && truthy((yield* g.srcCall(f, "allowed", live(f.args[0])))))) {
			if (truthy(rt.fv(f, "operating", rt.sv(f, "cyclelinkedairlock")))) {
				rt.setFv(f, "delayed_close_requested", rt.sv(f, "cyclelinkedairlock"), 1);
			} else {
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "cyclelinkedairlock"), P("/obj/machinery/door/airlock/proc/close")])), 2]);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// a spawn(10) body of /obj/machinery/door/airlock/proc/bumpopen, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/door/airlock/proc/bumpopen: spawn at game/machinery/doors/airlock.dm:232", function* (f: Frame) {
	rt.setFv(f, "justzap", live(f.src), 0);
	return null;
});

// /obj/machinery/door/airlock/proc/hallucinate_shock  (code/game/machinery/doors/airlock.dm:249)  may sleep
rt.def("/obj/machinery/door/airlock/proc/hallucinate_shock", function* hallucinate_shock(f: Frame, user: Value) {
	let shock_image: Value = null, electrocution_skeleton_anim: Value = null;
	f.vars = () => [user, shock_image, electrocution_skeleton_anim];
	shock_image = (yield* g.call(f, P("/proc/image"), null, [null, live(user), null, live(user), "dir", rt.fv(f, "dir", live(user))], rt.Args.Named));
	electrocution_skeleton_anim = (yield* g.call(f, P("/proc/image"), null, [null, rt.rsc("icons/mob/human.dmi"), null, live(user), "icon_state", "electrocuted_base", "layer", 4.099999904632568], rt.Args.Named));
	rt.setFv(f, "color", live(shock_image), "#000000");
	rt.setFv(f, "override", live(shock_image), 1);
	rt.setFv(f, "appearance_flags", live(electrocution_skeleton_anim), 2);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='userdanger'>You feel a powerful shock course through your body!</span>"]);
	if (truthy(rt.fv(f, "client", live(user)))) {
		(rt.modField(f, rt.fv(f, "client", live(user)), "images", live(shock_image), rt.bitOr));
		(rt.modField(f, rt.fv(f, "client", live(user)), "images", live(electrocution_skeleton_anim), rt.bitOr));
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/door/airlock/proc/reset_hallucinate_shock_animation"), live(user), live(shock_image), live(electrocution_skeleton_anim)])), 40]);
	yield* g.callName(f, live(user), "playsound_local", [rt.getStep(f, live(f.src), 0), "sparks", 100, 1]);
	rt.modField(f, live(user), "staminaloss", 50, add);
	yield* g.callName(f, live(user), "Stun", [40]);
	rt.modField(f, live(user), "jitteriness", 1000, add);
	yield* g.callName(f, live(user), "do_jitter_animation", [rt.fv(f, "jitteriness", live(user))]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/door/airlock/proc/hallucinate_shock_drop"), live(user)])), 20]);
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/reset_hallucinate_shock_animation  (code/game/machinery/doors/airlock.dm:268)
rt.def("/obj/machinery/door/airlock/proc/reset_hallucinate_shock_animation", function reset_hallucinate_shock_animation(f: Frame, user: Value, shock_image: Value, electrocution_skeleton_anim: Value) {
	if (!truthy(rt.fv(f, "client", live(user)))) return f.dot;
	rt.callName(f, rt.gv(f, "images", rt.fv(f, "client", live(user))), "Remove", [live(shock_image)]);
	rt.callName(f, rt.gv(f, "images", rt.fv(f, "client", live(user))), "Remove", [live(electrocution_skeleton_anim)]);
	return f.dot;
}, false, { argTypes: [{ type: 8, path: "/mob/living" }, {  }, {  }] });

// /obj/machinery/door/airlock/proc/hallucinate_shock_drop  (code/game/machinery/doors/airlock.dm:273)  may sleep
rt.def("/obj/machinery/door/airlock/proc/hallucinate_shock_drop", function* hallucinate_shock_drop(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setFv(f, "jitteriness", live(user), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "jitteriness", live(user)), 990), 10])));
	yield* g.callName(f, live(user), "Knockdown", [60]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// /obj/machinery/door/airlock/proc/isElectrified  (code/game/machinery/doors/airlock.dm:277)
rt.def("/obj/machinery/door/airlock/proc/isElectrified", function isElectrified(f: Frame) {
	if (!isEqual(rt.fv(f, "secondsElectrified", live(f.src)), 0)) {
		return 1;
	}
	return 0;
});

// /obj/machinery/door/airlock/proc/canAIControl  (code/game/machinery/doors/airlock.dm:282)
rt.def("/obj/machinery/door/airlock/proc/canAIControl", function canAIControl(f: Frame, user: Value) {
	return ((!isEqual(rt.sv(f, "aiControlDisabled"), 1) ? 1 : 0) && (!truthy(rt.callSrc(f, "isAllPowerCut", [])) ? 1 : 0));
});

// /obj/machinery/door/airlock/proc/canAIHack  (code/game/machinery/doors/airlock.dm:285)
rt.def("/obj/machinery/door/airlock/proc/canAIHack", function canAIHack(f: Frame) {
	return (((isEqual(rt.sv(f, "aiControlDisabled"), 1) ? 1 : 0) && (!truthy(rt.sv(f, "hackProof")) ? 1 : 0)) && (!truthy(rt.callSrc(f, "isAllPowerCut", [])) ? 1 : 0));
});

// /obj/machinery/door/airlock/proc/hasPower  (code/game/machinery/doors/airlock.dm:288)
rt.def("/obj/machinery/door/airlock/proc/hasPower", function hasPower(f: Frame) {
	return (((isEqual(rt.sv(f, "secondsMainPowerLost"), 0) ? 1 : 0) || (isEqual(rt.sv(f, "secondsBackupPowerLost"), 0) ? 1 : 0)) && (!truthy(rt.bitAnd(rt.sv(f, "stat"), 2)) ? 1 : 0));
});

// /obj/machinery/door/airlock/proc/requiresID  (code/game/machinery/doors/airlock.dm:291)
rt.def("/obj/machinery/door/airlock/proc/requiresID", function requiresID(f: Frame) {
	return (!(truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", ["ID Scan"])) || truthy(rt.sv(f, "aiDisabledIdScanner"))) ? 1 : 0);
});

// /obj/machinery/door/airlock/proc/isAllPowerCut  (code/game/machinery/doors/airlock.dm:294)
rt.def("/obj/machinery/door/airlock/proc/isAllPowerCut", function isAllPowerCut(f: Frame) {
	if (!((truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", ["Main Power 1"])) || truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", ["Main Power 2"]))) && (truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", ["Auxiliary Power 1"])) || truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", ["Auxiliary Power 2"]))))) return f.dot;
	return 1;
});

// /obj/machinery/door/airlock/proc/regainMainPower  (code/game/machinery/doors/airlock.dm:298)
rt.def("/obj/machinery/door/airlock/proc/regainMainPower", function regainMainPower(f: Frame) {
	if (!rt.gt(rt.fv(f, "secondsMainPowerLost", live(f.src)), 0)) return f.dot;
	rt.setFv(f, "secondsMainPowerLost", live(f.src), 0);
	return f.dot;
});

// /obj/machinery/door/airlock/proc/loseMainPower  (code/game/machinery/doors/airlock.dm:302)
rt.def("/obj/machinery/door/airlock/proc/loseMainPower", function loseMainPower(f: Frame) {
	let cont: Value = null;
	f.vars = () => [cont];
	if (rt.le(rt.fv(f, "secondsMainPowerLost", live(f.src)), 0)) {
		rt.setFv(f, "secondsMainPowerLost", live(f.src), 60);
		if (rt.lt(rt.fv(f, "secondsBackupPowerLost", live(f.src)), 10)) {
			rt.setFv(f, "secondsBackupPowerLost", live(f.src), 10);
		}
	}
	if (truthy(rt.fv(f, "spawnPowerRestoreRunning", live(f.src)))) return f.dot;
	rt.setFv(f, "spawnPowerRestoreRunning", live(f.src), 1);
	rt.spawnTail(f, 0, "/obj/machinery/door/airlock/proc/loseMainPower: spawn at game/machinery/doors/airlock.dm:308", cont);
	return f.dot;
});

// a spawn(0) body of /obj/machinery/door/airlock/proc/loseMainPower, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/door/airlock/proc/loseMainPower: spawn at game/machinery/doors/airlock.dm:308", function* (f: Frame, cont: Value) {
	f.vars = () => [cont];
	cont = 1;
	while (truthy(live(cont))) {
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
			return live(f.dot);
		}
		cont = 0;
		if (rt.gt(rt.sv(f, "secondsMainPowerLost"), 0)) {
			if ((!truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Main Power 1"]))) && !truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Main Power 2"]))))) {
				(rt.modSrcVar(f, "secondsMainPowerLost", 1, subtract));
				yield* g.srcCall(f, "updateDialog");
			}
			cont = 1;
		}
		if (rt.gt(rt.sv(f, "secondsBackupPowerLost"), 0)) {
			if ((!truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Auxiliary Power 1"]))) && !truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Auxiliary Power 2"]))))) {
				(rt.modSrcVar(f, "secondsBackupPowerLost", 1, subtract));
				yield* g.srcCall(f, "updateDialog");
			}
			cont = 1;
		}
	}
	rt.setSv(f, "spawnPowerRestoreRunning", 0);
	yield* g.srcCall(f, "updateDialog");
	return null;
});

// /obj/machinery/door/airlock/proc/loseBackupPower  (code/game/machinery/doors/airlock.dm:330)
rt.def("/obj/machinery/door/airlock/proc/loseBackupPower", function loseBackupPower(f: Frame) {
	if (!rt.lt(rt.fv(f, "secondsBackupPowerLost", live(f.src)), 60)) return f.dot;
	rt.setFv(f, "secondsBackupPowerLost", live(f.src), 60);
	return f.dot;
});

// /obj/machinery/door/airlock/proc/regainBackupPower  (code/game/machinery/doors/airlock.dm:334)
rt.def("/obj/machinery/door/airlock/proc/regainBackupPower", function regainBackupPower(f: Frame) {
	if (!rt.gt(rt.fv(f, "secondsBackupPowerLost", live(f.src)), 0)) return f.dot;
	rt.setFv(f, "secondsBackupPowerLost", live(f.src), 0);
	return f.dot;
});

// /obj/machinery/door/airlock/proc/shock  (code/game/machinery/doors/airlock.dm:341)  may sleep
rt.def("/obj/machinery/door/airlock/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	let check_range: Value = null;
	f.vars = () => [user, prb, check_range];
	if (!truthy((yield* g.srcCall(f, "hasPower")))) {
		return 0;
	}
	if (rt.gt(rt.sv(f, "hasShocked"), rt.worldTime(f))) {
		return 0;
	}
	if (!truthy(rt.op(f, "Prob", [], [live(prb)]))) {
		return 0;
	}
	yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, live(f.src)]);
	check_range = 1;
	if (truthy((yield* g.call(f, P("/proc/electrocute_mob"), null, [live(user), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), live(f.src), 1, live(check_range)])))) {
		rt.setSv(f, "hasShocked", add(rt.worldTime(f), 10));
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/update_icon  (code/game/machinery/doors/airlock.dm:356)
rt.def("/obj/machinery/door/airlock/proc/update_icon", function update_icon(f: Frame, state: Value, override: Value) {
	let $0: any;
	f.vars = () => [state, override, $0];
	if (live(state) === null) {
		state = 0;
	}
	if (live(override) === null) {
		override = 0;
	}
	if ((truthy(rt.sv(f, "operating")) && !truthy(live(override)))) {
		return live(f.dot);
	}
	$0 = live(state);
	if ($0 === 0) {
		if (truthy(rt.sv(f, "density"))) {
			state = 1;
		} else {
			state = 3;
		}
		rt.setSv(f, "icon_state", "");
	} else if ($0 === 3 || $0 === 1) {
		rt.setSv(f, "icon_state", "");
	} else if ($0 === 5 || $0 === 4 || $0 === 2 || $0 === 6) {
		rt.setSv(f, "icon_state", "nonexistenticonstate");
	}
	rt.callSrc(f, "set_airlock_overlays", [live(state)]);
	return f.dot;
});

// /obj/machinery/door/airlock/proc/set_airlock_overlays  (code/game/machinery/doors/airlock.dm:380)
rt.def("/obj/machinery/door/airlock/proc/set_airlock_overlays", function set_airlock_overlays(f: Frame, state: Value) {
	let frame_overlay: Value = null, filling_overlay: Value = null, lights_overlay: Value = null, panel_overlay: Value = null, weld_overlay: Value = null, damag_overlay: Value = null, sparks_overlay: Value = null, note_overlay: Value = null, notetype: Value = null;
	let $0: any;
	f.vars = () => [frame_overlay, filling_overlay, lights_overlay, panel_overlay, weld_overlay, damag_overlay, sparks_overlay, note_overlay, notetype, $0];
	frame_overlay = null;
	filling_overlay = null;
	lights_overlay = null;
	panel_overlay = null;
	weld_overlay = null;
	damag_overlay = null;
	sparks_overlay = null;
	note_overlay = null;
	notetype = rt.callSrc(f, "note_type", []);
	$0 = live(state);
	if ($0 === 1) {
		frame_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["closed", rt.sv(f, "icon")]);
		if (truthy(rt.sv(f, "airlock_material"))) {
			filling_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, [fmt("＀_closed", [rt.sv(f, "airlock_material")]), rt.sv(f, "overlays_file")]);
		} else {
			filling_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["fill_closed", rt.sv(f, "icon")]);
		}
		if (truthy(rt.sv(f, "panel_open"))) {
			if (truthy(rt.sv(f, "security_level"))) {
				panel_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["panel_closed_protected", rt.sv(f, "overlays_file")]);
			} else {
				panel_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["panel_closed", rt.sv(f, "overlays_file")]);
			}
		}
		if (truthy(rt.sv(f, "welded"))) {
			weld_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["welded", rt.sv(f, "overlays_file")]);
		}
		if (rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "integrity_failure"))) {
			damag_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["sparks_broken", rt.sv(f, "overlays_file")]);
		} else {
			if (rt.lt(rt.sv(f, "obj_integrity"), multiply(0.75, rt.sv(f, "max_integrity")))) {
				damag_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["sparks_damaged", rt.sv(f, "overlays_file")]);
			}
		}
		if ((truthy(rt.sv(f, "lights")) && truthy(rt.callSrc(f, "hasPower", [])))) {
			if (truthy(rt.sv(f, "locked"))) {
				lights_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["lights_bolts", rt.sv(f, "overlays_file")]);
			} else {
				if (truthy(rt.sv(f, "emergency"))) {
					lights_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["lights_emergency", rt.sv(f, "overlays_file")]);
				}
			}
		}
		if (truthy(rt.sv(f, "note"))) {
			note_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, [live(notetype), rt.sv(f, "note_overlay_file")]);
		}
	} else if ($0 === 5) {
		if (!truthy(rt.callSrc(f, "hasPower", []))) {
			return live(f.dot);
		}
		frame_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["closed", rt.sv(f, "icon")]);
		if (truthy(rt.sv(f, "airlock_material"))) {
			filling_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, [fmt("＀_closed", [rt.sv(f, "airlock_material")]), rt.sv(f, "overlays_file")]);
		} else {
			filling_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["fill_closed", rt.sv(f, "icon")]);
		}
		if (truthy(rt.sv(f, "panel_open"))) {
			if (truthy(rt.sv(f, "security_level"))) {
				panel_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["panel_closed_protected", rt.sv(f, "overlays_file")]);
			} else {
				panel_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["panel_closed", rt.sv(f, "overlays_file")]);
			}
		}
		if (rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "integrity_failure"))) {
			damag_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["sparks_broken", rt.sv(f, "overlays_file")]);
		} else {
			if (rt.lt(rt.sv(f, "obj_integrity"), multiply(0.75, rt.sv(f, "max_integrity")))) {
				damag_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["sparks_damaged", rt.sv(f, "overlays_file")]);
			}
		}
		if (truthy(rt.sv(f, "welded"))) {
			weld_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["welded", rt.sv(f, "overlays_file")]);
		}
		lights_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["lights_denied", rt.sv(f, "overlays_file")]);
		if (truthy(rt.sv(f, "note"))) {
			note_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, [live(notetype), rt.sv(f, "note_overlay_file")]);
		}
	} else if ($0 === 6) {
		frame_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["closed", rt.sv(f, "icon")]);
		sparks_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["sparks", rt.sv(f, "overlays_file")]);
		if (truthy(rt.sv(f, "airlock_material"))) {
			filling_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, [fmt("＀_closed", [rt.sv(f, "airlock_material")]), rt.sv(f, "overlays_file")]);
		} else {
			filling_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["fill_closed", rt.sv(f, "icon")]);
		}
		if (truthy(rt.sv(f, "panel_open"))) {
			if (truthy(rt.sv(f, "security_level"))) {
				panel_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["panel_closed_protected", rt.sv(f, "overlays_file")]);
			} else {
				panel_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["panel_closed", rt.sv(f, "overlays_file")]);
			}
		}
		if (rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "integrity_failure"))) {
			damag_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["sparks_broken", rt.sv(f, "overlays_file")]);
		} else {
			if (rt.lt(rt.sv(f, "obj_integrity"), multiply(0.75, rt.sv(f, "max_integrity")))) {
				damag_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["sparks_damaged", rt.sv(f, "overlays_file")]);
			}
		}
		if (truthy(rt.sv(f, "welded"))) {
			weld_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["welded", rt.sv(f, "overlays_file")]);
		}
		if (truthy(rt.sv(f, "note"))) {
			note_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, [live(notetype), rt.sv(f, "note_overlay_file")]);
		}
	} else if ($0 === 2) {
		frame_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["closing", rt.sv(f, "icon")]);
		if (truthy(rt.sv(f, "airlock_material"))) {
			filling_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, [fmt("＀_closing", [rt.sv(f, "airlock_material")]), rt.sv(f, "overlays_file")]);
		} else {
			filling_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["fill_closing", rt.sv(f, "icon")]);
		}
		if ((truthy(rt.sv(f, "lights")) && truthy(rt.callSrc(f, "hasPower", [])))) {
			lights_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["lights_closing", rt.sv(f, "overlays_file")]);
		}
		if (truthy(rt.sv(f, "panel_open"))) {
			if (truthy(rt.sv(f, "security_level"))) {
				panel_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["panel_closing_protected", rt.sv(f, "overlays_file")]);
			} else {
				panel_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["panel_closing", rt.sv(f, "overlays_file")]);
			}
		}
		if (truthy(rt.sv(f, "note"))) {
			note_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, [fmt("＀_closing", [live(notetype)]), rt.sv(f, "note_overlay_file")]);
		}
	} else if ($0 === 3) {
		frame_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["open", rt.sv(f, "icon")]);
		if (truthy(rt.sv(f, "airlock_material"))) {
			filling_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, [fmt("＀_open", [rt.sv(f, "airlock_material")]), rt.sv(f, "overlays_file")]);
		} else {
			filling_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["fill_open", rt.sv(f, "icon")]);
		}
		if (truthy(rt.sv(f, "panel_open"))) {
			if (truthy(rt.sv(f, "security_level"))) {
				panel_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["panel_open_protected", rt.sv(f, "overlays_file")]);
			} else {
				panel_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["panel_open", rt.sv(f, "overlays_file")]);
			}
		}
		if (rt.lt(rt.sv(f, "obj_integrity"), multiply(0.75, rt.sv(f, "max_integrity")))) {
			damag_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["sparks_open", rt.sv(f, "overlays_file")]);
		}
		if (truthy(rt.sv(f, "note"))) {
			note_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, [fmt("＀_open", [live(notetype)]), rt.sv(f, "note_overlay_file")]);
		}
	} else if ($0 === 4) {
		frame_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["opening", rt.sv(f, "icon")]);
		if (truthy(rt.sv(f, "airlock_material"))) {
			filling_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, [fmt("＀_opening", [rt.sv(f, "airlock_material")]), rt.sv(f, "overlays_file")]);
		} else {
			filling_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["fill_opening", rt.sv(f, "icon")]);
		}
		if ((truthy(rt.sv(f, "lights")) && truthy(rt.callSrc(f, "hasPower", [])))) {
			lights_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["lights_opening", rt.sv(f, "overlays_file")]);
		}
		if (truthy(rt.sv(f, "panel_open"))) {
			if (truthy(rt.sv(f, "security_level"))) {
				panel_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["panel_opening_protected", rt.sv(f, "overlays_file")]);
			} else {
				panel_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, ["panel_opening", rt.sv(f, "overlays_file")]);
			}
		}
		if (truthy(rt.sv(f, "note"))) {
			note_overlay = rt.call(f, P("/proc/get_airlock_overlay"), null, [fmt("＀_opening", [live(notetype)]), rt.sv(f, "note_overlay_file")]);
		}
	}
	rt.callSrc(f, "cut_overlays", []);
	rt.callSrc(f, "add_overlay", [live(frame_overlay)]);
	rt.callSrc(f, "add_overlay", [live(filling_overlay)]);
	rt.callSrc(f, "add_overlay", [live(lights_overlay)]);
	rt.callSrc(f, "add_overlay", [live(panel_overlay)]);
	rt.callSrc(f, "add_overlay", [live(weld_overlay)]);
	rt.callSrc(f, "add_overlay", [live(sparks_overlay)]);
	rt.callSrc(f, "add_overlay", [live(damag_overlay)]);
	rt.callSrc(f, "add_overlay", [live(note_overlay)]);
	return f.dot;
});

// /proc/get_airlock_overlay  (code/game/machinery/doors/airlock.dm:512)
rt.def("/proc/get_airlock_overlay", function get_airlock_overlay(f: Frame, icon_state: Value, icon_file: Value) {
	let A: Value = null, airlock_overlays: Value = null, iconkey: Value = null;
	f.vars = () => [A, airlock_overlays, iconkey];
	A = null;
	rt.call(f, P("/proc/pass"), null, [live(A)]);
	airlock_overlays = rt.gl("airlock_overlays");
	iconkey = fmt("＀＀", [live(icon_state), live(icon_file)]);
	if (truthy((f.dot = rt.index(live(airlock_overlays), live(iconkey))))) return f.dot;
	f.dot = (rt.setAt(live(airlock_overlays), live(iconkey), rt.call(f, P("/proc/mutable_appearance"), null, [live(icon_file), live(icon_state)])));
	return f.dot;
});

// /obj/machinery/door/airlock/proc/do_animate  (code/game/machinery/doors/airlock.dm:519)  may sleep
rt.def("/obj/machinery/door/airlock/proc/do_animate", function* do_animate(f: Frame, animation: Value) {
	let $0: any;
	f.vars = () => [animation, $0];
	$0 = live(animation);
	if ($0 === "opening") {
		yield* g.srcCall(f, "update_icon", 4);
	} else if ($0 === "closing") {
		yield* g.srcCall(f, "update_icon", 2);
	} else if ($0 === "deny") {
		if (truthy(rt.sv(f, "stat"))) return f.dot;
		yield* g.srcCall(f, "update_icon", 5);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "doorDeni"), 50, 0, 3]);
		yield* g.call(f, P("/proc/sleep"), null, [6]);
		yield* g.srcCall(f, "update_icon", 1);
	}
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/examine  (code/game/machinery/doors/airlock.dm:532)  may sleep
rt.def("/obj/machinery/door/airlock/proc/examine", function* examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (((truthy(rt.sv(f, "charge")) && !truthy(rt.sv(f, "panel_open"))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.args[0]), live(f.src)])), 1))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The maintenance panel seems haphazardly fastened.</span>"]);
	}
	if ((truthy(rt.sv(f, "charge")) && truthy(rt.sv(f, "panel_open")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Something is wired up to the airlock's electronics!</span>"]);
	}
	if (truthy(rt.sv(f, "note"))) {
		if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.args[0]), live(f.src)])), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There's a ＀ pinned to the front. You can't read it from here.", [rt.fv(f, "name", rt.sv(f, "note"))])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There's a ＀ pinned to the front...", [rt.fv(f, "name", rt.sv(f, "note"))])]);
			yield* g.callName(f, rt.sv(f, "note"), "examine", [live(f.args[0])]);
		}
	}
	if (truthy(rt.sv(f, "panel_open"))) {
		$0 = rt.sv(f, "security_level");
		if ($0 === 0) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "Wires are exposed!"]);
		} else if ($0 === 1) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "Wires are hidden behind welded metal cover"]);
		} else if ($0 === 2) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "There is some shredded plasteel inside"]);
		} else if ($0 === 3) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "Wires are behind inner layer of plasteel"]);
		} else if ($0 === 4) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "There is some shredded plasteel inside"]);
		} else if ($0 === 5) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "There is welded plasteel cover hiding wires"]);
		} else if ($0 === 6) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "There is protective grille over panel"]);
		}
	} else {
		if (!truthy(rt.sv(f, "security_level"))) return f.dot;
		if (isEqual(rt.sv(f, "security_level"), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It looks a bit stronger"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It looks very robust"]);
		}
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/door/airlock/proc/attack_ai  (code/game/machinery/doors/airlock.dm:567)  may sleep
rt.def("/obj/machinery/door/airlock/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	let t1: Value = null;
	f.vars = () => [user, t1];
	if (!truthy((yield* g.callName(f, live(f.src), "canAIControl", [live(user)])))) {
		if (truthy((yield* g.callName(f, live(f.src), "canAIHack", [])))) {
			yield* g.callName(f, live(f.src), "hack", [live(user)]);
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Airlock AI control has been blocked with a firewall. Unable to hack.</span>"]);
		}
	}
	if (truthy(rt.sv(f, "emagged"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Unable to interface: Airlock is unresponsive.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "detonated"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Unable to interface. Airlock control panel damaged.</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	t1 = "<B>Airlock Control</B><br>\n";
	if (rt.gt(rt.fv(f, "secondsMainPowerLost", live(f.src)), 0)) {
		if ((!truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Main Power 1"]))) && !truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Main Power 2"]))))) {
			t1 = rt.modify(live(t1), fmt("Main power is offline for ＀ seconds.<br>\n", [rt.fv(f, "secondsMainPowerLost", live(f.src))]), add);
		} else {
			t1 = rt.modify(live(t1), "Main power is offline indefinitely.<br>\n", add);
		}
	} else {
		t1 = rt.modify(live(t1), "Main power is online.", add);
	}
	if (rt.gt(rt.fv(f, "secondsBackupPowerLost", live(f.src)), 0)) {
		if ((!truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Auxiliary Power 1"]))) && !truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Auxiliary Power 2"]))))) {
			t1 = rt.modify(live(t1), fmt("Backup power is offline for ＀ seconds.<br>\n", [rt.fv(f, "secondsBackupPowerLost", live(f.src))]), add);
		} else {
			t1 = rt.modify(live(t1), "Backup power is offline indefinitely.<br>\n", add);
		}
	} else {
		if (rt.gt(rt.fv(f, "secondsMainPowerLost", live(f.src)), 0)) {
			t1 = rt.modify(live(t1), "Backup power is online.", add);
		} else {
			t1 = rt.modify(live(t1), "Backup power is offline, but will turn on if main power fails.", add);
		}
	}
	t1 = rt.modify(live(t1), "<br>\n", add);
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["ID Scan"])))) {
		t1 = rt.modify(live(t1), "IdScan wire is cut.<br>\n", add);
	} else {
		if (truthy(rt.fv(f, "aiDisabledIdScanner", live(f.src)))) {
			t1 = rt.modify(live(t1), fmt("IdScan disabled. <A href='?src=＃;aiEnable=1'>Enable?</a><br>\n", [live(f.src)]), add);
		} else {
			t1 = rt.modify(live(t1), fmt("IdScan enabled. <A href='?src=＃;aiDisable=1'>Disable?</a><br>\n", [live(f.src)]), add);
		}
	}
	if (truthy(rt.fv(f, "emergency", live(f.src)))) {
		t1 = rt.modify(live(t1), fmt("Emergency Access Override is enabled. <A href='?src=＃;aiDisable=11'>Disable?</a><br>\n", [live(f.src)]), add);
	} else {
		t1 = rt.modify(live(t1), fmt("Emergency Access Override is disabled. <A href='?src=＃;aiEnable=11'>Enable?</a><br>\n", [live(f.src)]), add);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Main Power 1"])))) {
		t1 = rt.modify(live(t1), "Main Power Input wire is cut.<br>\n", add);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Main Power 2"])))) {
		t1 = rt.modify(live(t1), "Main Power Output wire is cut.<br>\n", add);
	}
	if (isEqual(rt.fv(f, "secondsMainPowerLost", live(f.src)), 0)) {
		t1 = rt.modify(live(t1), fmt("<A href='?src=＃;aiDisable=2'>Temporarily disrupt main power?</a>.<br>\n", [live(f.src)]), add);
	}
	if (isEqual(rt.fv(f, "secondsBackupPowerLost", live(f.src)), 0)) {
		t1 = rt.modify(live(t1), fmt("<A href='?src=＃;aiDisable=3'>Temporarily disrupt backup power?</a>.<br>\n", [live(f.src)]), add);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Auxiliary Power 1"])))) {
		t1 = rt.modify(live(t1), "Backup Power Input wire is cut.<br>\n", add);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Auxiliary Power 2"])))) {
		t1 = rt.modify(live(t1), "Backup Power Output wire is cut.<br>\n", add);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Bolts"])))) {
		t1 = rt.modify(live(t1), "Door bolt drop wire is cut.<br>\n", add);
	} else {
		if (!truthy(rt.fv(f, "locked", live(f.src)))) {
			t1 = rt.modify(live(t1), fmt("Door bolts are up. <A href='?src=＃;aiDisable=4'>Drop them?</a><br>\n", [live(f.src)]), add);
		} else {
			t1 = rt.modify(live(t1), "Door bolts are down.", add);
			if (truthy((yield* g.callName(f, live(f.src), "hasPower", [])))) {
				t1 = rt.modify(live(t1), fmt(" <A href='?src=＃;aiEnable=4'>Raise?</a><br>\n", [live(f.src)]), add);
			} else {
				t1 = rt.modify(live(t1), " Cannot raise door bolts due to power failure.<br>\n", add);
			}
		}
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Bolt Lights"])))) {
		t1 = rt.modify(live(t1), "Door bolt lights wire is cut.<br>\n", add);
	} else {
		if (!truthy(rt.fv(f, "lights", live(f.src)))) {
			t1 = rt.modify(live(t1), fmt("Door bolt lights are off. <A href='?src=＃;aiEnable=10'>Enable?</a><br>\n", [live(f.src)]), add);
		} else {
			t1 = rt.modify(live(t1), fmt("Door bolt lights are on. <A href='?src=＃;aiDisable=10'>Disable?</a><br>\n", [live(f.src)]), add);
		}
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["High Voltage Ground"])))) {
		t1 = rt.modify(live(t1), "Electrification wire is cut.<br>\n", add);
	}
	if (isEqual(rt.sv(f, "secondsElectrified"), -1)) {
		t1 = rt.modify(live(t1), fmt("Door is electrified indefinitely. <A href='?src=＃;aiDisable=5'>Un-electrify it?</a><br>\n", [live(f.src)]), add);
	} else {
		if (rt.gt(rt.sv(f, "secondsElectrified"), 0)) {
			t1 = rt.modify(live(t1), fmt("Door is electrified temporarily (＀ seconds). <A href='?src=＃;aiDisable=5'>Un-electrify it?</a><br>\n", [rt.sv(f, "secondsElectrified"), live(f.src)]), add);
		} else {
			t1 = rt.modify(live(t1), fmt("Door is not electrified. <A href='?src=＃;aiEnable=5'>Electrify it for 30 seconds?</a> Or, <A href='?src=＃;aiEnable=6'>Electrify it indefinitely until someone cancels the electrification?</a><br>\n", [live(f.src), live(f.src)]), add);
		}
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Safety"])))) {
		t1 = rt.modify(live(t1), "Door force sensors not responding.</a><br>\n", add);
	} else {
		if (truthy(rt.fv(f, "safe", live(f.src)))) {
			t1 = rt.modify(live(t1), fmt("Door safeties operating normally.  <A href='?src=＃;aiDisable=8'>Override?</a><br>\n", [live(f.src)]), add);
		} else {
			t1 = rt.modify(live(t1), fmt("Danger.  Door safeties disabled.  <A href='?src=＃;aiEnable=8'>Restore?</a><br>\n", [live(f.src)]), add);
		}
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Timing"])))) {
		t1 = rt.modify(live(t1), "Door timing circuitry not responding.</a><br>\n", add);
	} else {
		if (truthy(rt.fv(f, "normalspeed", live(f.src)))) {
			t1 = rt.modify(live(t1), fmt("Door timing circuitry operating normally.  <A href='?src=＃;aiDisable=9'>Override?</a><br>\n", [live(f.src)]), add);
		} else {
			t1 = rt.modify(live(t1), fmt("Warning.  Door timing circuitry operating abnormally.  <A href='?src=＃;aiEnable=9'>Restore?</a><br>\n", [live(f.src)]), add);
		}
	}
	if (truthy(rt.fv(f, "welded", live(f.src)))) {
		t1 = rt.modify(live(t1), "Door appears to have been welded shut.<br>\n", add);
	} else {
		if (!truthy(rt.fv(f, "locked", live(f.src)))) {
			if (truthy(rt.fv(f, "density", live(f.src)))) {
				t1 = rt.modify(live(t1), fmt("<A href='?src=＃;aiEnable=7'>Open door</a><br>\n", [live(f.src)]), add);
			} else {
				t1 = rt.modify(live(t1), fmt("<A href='?src=＃;aiDisable=7'>Close door</a><br>\n", [live(f.src)]), add);
			}
		}
	}
	t1 = rt.modify(live(t1), fmt("<p><a href='?src=＃;close=1'>Close</a></p>\n", [live(f.src)]), add);
	rt.op(f, "Browse", [], [live(user), live(t1), "window=airlock"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "airlock"]);
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/hack  (code/game/machinery/doors/airlock.dm:687)  may sleep
rt.def("/obj/machinery/door/airlock/proc/hack", function* hack(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!isEqual(rt.fv(f, "aiHacking", live(f.src)), 0)) return f.dot;
	rt.setFv(f, "aiHacking", live(f.src), 1);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Airlock AI control has been blocked. Beginning fault-detection."]);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	if (truthy((yield* g.callName(f, live(f.src), "canAIControl", [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Alert cancelled. Airlock control has been restored without our assistance."]);
		rt.setFv(f, "aiHacking", live(f.src), 0);
		return live(f.dot);
	} else {
		if (!truthy((yield* g.callName(f, live(f.src), "canAIHack", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Connection lost! Unable to hack airlock."]);
			rt.setFv(f, "aiHacking", live(f.src), 0);
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Fault confirmed: airlock control wire disabled or cut."]);
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Attempting to hack into airlock. This may take some time."]);
	yield* g.call(f, P("/proc/sleep"), null, [200]);
	if (truthy((yield* g.callName(f, live(f.src), "canAIControl", [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Alert cancelled. Airlock control has been restored without our assistance."]);
		rt.setFv(f, "aiHacking", live(f.src), 0);
		return live(f.dot);
	} else {
		if (!truthy((yield* g.callName(f, live(f.src), "canAIHack", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Connection lost! Unable to hack airlock."]);
			rt.setFv(f, "aiHacking", live(f.src), 0);
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Upload access confirmed. Loading control program into airlock software."]);
	yield* g.call(f, P("/proc/sleep"), null, [170]);
	if (truthy((yield* g.callName(f, live(f.src), "canAIControl", [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Alert cancelled. Airlock control has been restored without our assistance."]);
		rt.setFv(f, "aiHacking", live(f.src), 0);
		return live(f.dot);
	} else {
		if (!truthy((yield* g.callName(f, live(f.src), "canAIHack", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Connection lost! Unable to hack airlock."]);
			rt.setFv(f, "aiHacking", live(f.src), 0);
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Transfer complete. Forcing airlock to execute program."]);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	rt.setFv(f, "aiControlDisabled", live(f.src), 2);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Receiving control information from airlock."]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	rt.setFv(f, "aiHacking", live(f.src), 0);
	if (!truthy(live(user))) return f.dot;
	yield* g.callName(f, live(f.src), "attack_ai", [live(user)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/door/airlock/proc/attack_paw  (code/game/machinery/doors/airlock.dm:733)  may sleep
rt.def("/obj/machinery/door/airlock/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/door/airlock/proc/attack_hand  (code/game/machinery/doors/airlock.dm:736)  may sleep
rt.def("/obj/machinery/door/airlock/proc/attack_hand", function* attack_hand(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!(truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.args[0])]))))) {
		if (truthy((yield* g.callName(f, live(f.src), "isElectrified", [])))) {
			if (truthy((yield* g.callName(f, live(f.src), "shock", [live(f.args[0]), 100])))) {
				return live(f.dot);
			}
		}
	}
	if (((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy(rt.op(f, "Prob", [], [40]))) && truthy(rt.fv(f, "density", live(f.src))))) {
		if ((rt.ge((yield* g.callName(f, (H = live(f.args[0])), "getBrainLoss", [])), 60) && truthy((yield* g.srcCall(f, "Adjacent", live(f.args[0])))))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/bang.ogg"), 25, 1]);
			if (!truthy((rt.istype(rt.fv(f, "head", live(H)), T("/obj/item/clothing/head/helmet")) ? 1 : 0))) {
				yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀ headbutts the airlock.</span>", [live(f.args[0])]), "<span class='userdanger'>You headbutt the airlock!</span>"]);
				yield* g.callName(f, live(H), "Knockdown", [100]);
				yield* g.callName(f, live(H), "apply_damage", [10, "brute", "head"]);
			} else {
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ headbutts the airlock. Good thing ＀ wearing a helmet.</span>", [live(f.args[0]), (yield* g.callName(f, live(f.args[0]), "p_theyre", []))]));
			}
			return live(f.dot);
		}
	}
	if (truthy(rt.sv(f, "panel_open"))) {
		if (truthy(rt.sv(f, "security_level"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Wires are protected!</span>"]);
			return live(f.dot);
		}
		yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[0])]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/door/airlock/proc/Topic  (code/game/machinery/doors/airlock.dm:767)  may sleep
rt.def("/obj/machinery/door/airlock/proc/Topic", function* Topic(f: Frame) {
	let code: Value = null;
	let $0: any;
	f.vars = () => [code, $0];
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy(live(f.args[2]))) {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	if ((truthy((yield* g.callName(f, live(f.usr), "incapacitated", []))) && !truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)]))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=airlock"], false);
		if (isEqual(rt.fv(f, "machine", live(f.usr)), live(f.src))) {
			yield* g.callName(f, live(f.usr), "unset_machine", []);
			return live(f.dot);
		}
	}
	if (((rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) && truthy(rt.sv(f, "panel_open")))) {
		yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	}
	if (((truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)) && truthy((yield* g.callName(f, live(f.src), "canAIControl", [live(f.usr)])))) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)]))))) {
		if (truthy(rt.at(live(f.args[1]), "aiDisable"))) {
			$0 = (code = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "aiDisable")])));
			if ($0 === 1) {
				if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["ID Scan"])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The IdScan wire has been cut - So, you can't disable it, but it is already disabled anyways."]);
				} else {
					if (truthy(rt.fv(f, "aiDisabledIdScanner", live(f.src)))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "You've already disabled the IdScan feature."]);
					} else {
						rt.setFv(f, "aiDisabledIdScanner", live(f.src), 1);
					}
				}
			} else if ($0 === 2) {
				if (isEqual(rt.fv(f, "secondsMainPowerLost", live(f.src)), 0)) {
					yield* g.callName(f, live(f.src), "loseMainPower", []);
					yield* g.srcCall(f, "update_icon");
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Main power is already offline."]);
				}
			} else if ($0 === 3) {
				if (isEqual(rt.fv(f, "secondsBackupPowerLost", live(f.src)), 0)) {
					yield* g.callName(f, live(f.src), "loseBackupPower", []);
					yield* g.srcCall(f, "update_icon");
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Backup power is already offline."]);
				}
			} else if ($0 === 4) {
				if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Bolts"])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "You can't drop the door bolts - The door bolt dropping wire has been cut."]);
				} else {
					yield* g.srcCall(f, "bolt");
				}
			} else if ($0 === 5) {
				if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["High Voltage Ground"])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Can't un-electrify the airlock - The electrification wire is cut."]);
				} else {
					if (truthy((yield* g.srcCall(f, "isElectrified")))) {
						yield* g.srcCall(f, "set_electrified", 0);
					}
				}
			} else if ($0 === 8) {
				if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Safety"])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Control to door sensors is disabled."]);
				} else {
					if (truthy(rt.fv(f, "safe", live(f.src)))) {
						rt.setSv(f, "safe", 0);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Firmware reports safeties already overriden."]);
					}
				}
			} else if ($0 === 9) {
				if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Timing"])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Control to door timing circuitry has been severed."]);
				} else {
					if (truthy(rt.fv(f, "normalspeed", live(f.src)))) {
						rt.setSv(f, "normalspeed", 0);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Door timing circuitry already accelerated."]);
					}
				}
			} else if ($0 === 7) {
				if (truthy(rt.fv(f, "welded", live(f.src)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The airlock has been welded shut!"]);
				} else {
					if (truthy(rt.fv(f, "locked", live(f.src)))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The door bolts are down!"]);
					} else {
						if (!truthy(rt.fv(f, "density", live(f.src)))) {
							yield* g.srcCall(f, "close");
						} else {
							yield* g.srcCall(f, "open");
						}
					}
				}
			} else if ($0 === 10) {
				if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Bolt Lights"])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Control to door bolt lights has been severed.</a>"]);
				} else {
					if (truthy(rt.fv(f, "lights", live(f.src)))) {
						rt.setSv(f, "lights", 0);
						yield* g.srcCall(f, "update_icon");
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Door bolt lights are already disabled!"]);
					}
				}
			} else if ($0 === 11) {
				if (truthy(rt.fv(f, "emergency", live(f.src)))) {
					rt.setSv(f, "emergency", 0);
					yield* g.srcCall(f, "update_icon");
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Emergency access is already disabled!"]);
				}
			}
		} else {
			if (truthy(rt.at(live(f.args[1]), "aiEnable"))) {
				$0 = (code = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "aiEnable")])));
				if ($0 === 1) {
					if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["ID Scan"])))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "You can't enable IdScan - The IdScan wire has been cut."]);
					} else {
						if (truthy(rt.fv(f, "aiDisabledIdScanner", live(f.src)))) {
							rt.setFv(f, "aiDisabledIdScanner", live(f.src), 0);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The IdScan feature is not disabled."]);
						}
					}
				} else if ($0 === 4) {
					if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Bolts"])))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The door bolt drop wire is cut - you can't raise the door bolts.<br>\n"]);
					} else {
						if (!truthy(rt.fv(f, "locked", live(f.src)))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The door bolts are already up.<br>\n"]);
						} else {
							if (truthy((yield* g.callName(f, live(f.src), "hasPower", [])))) {
								yield* g.srcCall(f, "unbolt");
							} else {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Cannot raise door bolts due to power failure.<br>\n"]);
							}
						}
					}
				} else if ($0 === 5) {
					if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["High Voltage Ground"])))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The electrification wire has been cut.<br>\n"]);
					} else {
						if (isEqual(rt.sv(f, "secondsElectrified"), -1)) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The door is already indefinitely electrified. You'd have to un-electrify it before you can re-electrify it with a non-forever duration.<br>\n"]);
						} else {
							if (truthy((yield* g.srcCall(f, "isElectrified")))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The door is already electrified. You can't re-electrify it while it's already electrified.<br>\n"]);
							} else {
								rt.modSrcVar(f, "shockedby", fmt("[＀]＀(ckey:＀)", [(yield* g.call(f, P("/proc/time_stamp"), null, [])), live(f.usr), rt.fv(f, "ckey", live(f.usr))]), add);
								yield* g.call(f, P("/proc/add_logs"), null, [live(f.usr), live(f.src), "electrified"]);
								yield* g.srcCall(f, "set_electrified", 30);
								rt.spawnTail(f, 10, "/obj/machinery/door/airlock/proc/Topic: spawn at game/machinery/doors/airlock.dm:907", code);
							}
						}
					}
				} else if ($0 === 6) {
					if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["High Voltage Ground"])))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The electrification wire has been cut.<br>\n"]);
					} else {
						if (isEqual(rt.sv(f, "secondsElectrified"), -1)) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The door is already indefinitely electrified.<br>\n"]);
						} else {
							if (truthy((yield* g.srcCall(f, "isElectrified")))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The door is already electrified. You can't re-electrify it while it's already electrified.<br>\n"]);
							} else {
								rt.modSrcVar(f, "shockedby", fmt("[＀]＀(ckey:＀)", [(yield* g.call(f, P("/proc/time_stamp"), null, [])), live(f.usr), rt.fv(f, "ckey", live(f.usr))]), add);
								yield* g.call(f, P("/proc/add_logs"), null, [live(f.usr), live(f.src), "electrified"]);
								yield* g.srcCall(f, "set_electrified", -1);
							}
						}
					}
				} else if ($0 === 8) {
					if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Safety"])))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Control to door sensors is disabled."]);
					} else {
						if (!truthy(rt.fv(f, "safe", live(f.src)))) {
							rt.setSv(f, "safe", 1);
							yield* g.callName(f, live(f.src), "updateUsrDialog", []);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Firmware reports safeties already in place."]);
						}
					}
				} else if ($0 === 9) {
					if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Timing"])))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Control to door timing circuitry has been severed."]);
					} else {
						if (!truthy(rt.fv(f, "normalspeed", live(f.src)))) {
							rt.setSv(f, "normalspeed", 1);
							yield* g.callName(f, live(f.src), "updateUsrDialog", []);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Door timing circuitry currently operating normally."]);
						}
					}
				} else if ($0 === 7) {
					if (truthy(rt.fv(f, "welded", live(f.src)))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The airlock has been welded shut!"]);
					} else {
						if (truthy(rt.fv(f, "locked", live(f.src)))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The door bolts are down!"]);
						} else {
							if (truthy(rt.fv(f, "density", live(f.src)))) {
								yield* g.srcCall(f, "open");
							} else {
								yield* g.srcCall(f, "close");
							}
						}
					}
				} else if ($0 === 10) {
					if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Bolt Lights"])))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Control to door bolt lights has been severed.</a>"]);
					} else {
						if (!truthy(rt.fv(f, "lights", live(f.src)))) {
							rt.setSv(f, "lights", 1);
							yield* g.srcCall(f, "update_icon");
							yield* g.callName(f, live(f.src), "updateUsrDialog", []);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Door bolt lights are already enabled!"]);
						}
					}
				} else if ($0 === 11) {
					if (!truthy(rt.fv(f, "emergency", live(f.src)))) {
						rt.setSv(f, "emergency", 1);
						yield* g.srcCall(f, "update_icon");
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Emergency access is already enabled!"]);
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	if (truthy(live(f.args[2]))) return f.dot;
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list", "nowindow"] });

// a spawn(10) body of /obj/machinery/door/airlock/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/door/airlock/proc/Topic: spawn at game/machinery/doors/airlock.dm:907", function* (f: Frame, code: Value) {
	f.vars = () => [code];
	while (rt.gt(rt.sv(f, "secondsElectrified"), 0)) {
		rt.incSrcVar(f, "secondsElectrified", -1, true);
		if (rt.le(rt.sv(f, "secondsElectrified"), 0)) {
			yield* g.srcCall(f, "set_electrified", 0);
		}
		yield* g.srcCall(f, "updateUsrDialog");
		yield* g.call(f, P("/proc/sleep"), null, [10]);
	}
	return null;
});

// /obj/machinery/door/airlock/proc/attackby  (code/game/machinery/doors/airlock.dm:980)  may sleep
rt.def("/obj/machinery/door/airlock/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null, WT: Value = null, W: Value = null, cable: Value = null;
	let $0: any, $1: any;
	f.vars = () => [S, WT, W, cable, $0, $1];
	if ((!truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.args[1])]))))) {
		if (truthy((yield* g.callName(f, live(f.src), "isElectrified", [])))) {
			if (truthy((yield* g.callName(f, live(f.src), "shock", [live(f.args[1]), 75])))) {
				return live(f.dot);
			}
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy(rt.sv(f, "panel_open"))) {
		$0 = rt.sv(f, "security_level");
		if ($0 === 0) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/metal")) ? 1 : 0))) {
				if (rt.lt(rt.gv(f, "amount", (S = live(f.args[0]))), 2)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need at least 2 metal sheets to reinforce ＀.</span>", [live(f.src)])]);
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start reinforcing ＀</span>", [live(f.src)])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, null, 1, "target", live(f.src)], rt.Args.Named)))) {
					if ((!truthy(rt.sv(f, "panel_open")) || !truthy((yield* g.callName(f, live(S), "use", [2]))))) {
						return live(f.dot);
					}
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ reinforce ％！ with metal.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You reinforce ％！ with metal.</span>", [live(f.src)])]);
					rt.setSv(f, "security_level", 1);
					yield* g.srcCall(f, "update_icon");
				}
				return live(f.dot);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/plasteel")) ? 1 : 0))) {
					if (rt.lt(rt.gv(f, "amount", (S = live(f.args[0]))), 2)) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need at least 2 plasteel sheets to reinforce ＀.</span>", [live(f.src)])]);
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start reinforcing ＀.</span>", [live(f.src)])]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, null, 1, "target", live(f.src)], rt.Args.Named)))) {
						if ((!truthy(rt.sv(f, "panel_open")) || !truthy((yield* g.callName(f, live(S), "use", [2]))))) {
							return live(f.dot);
						}
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ reinforce ％！ with plasteel.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You reinforce ％！ with plasteel.</span>", [live(f.src)])]);
						rt.setSv(f, "security_level", 6);
						yield* g.srcCall(f, "modify_max_integrity", multiply(rt.sv(f, "normal_integrity"), 1.5));
						rt.setSv(f, "damage_deflection", 30);
						yield* g.srcCall(f, "update_icon");
					}
					return live(f.dot);
				}
			}
		} else if ($0 === 1) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [2, live(f.args[1])])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You begin cutting the panel's shielding...</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 40, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(WT))), null, 1, "target", live(f.src)], rt.Args.Named)))) {
					if ((!truthy(rt.sv(f, "panel_open")) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ cuts through ％！'s shielding.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You cut through ％！'s shielding.</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
					rt.setSv(f, "security_level", 0);
					yield* g.call(f, P("/proc/spawn_atom_to_turf"), null, [T("/obj/item/stack/sheet/metal"), rt.fv(f, "loc", live(f.args[1])), 2]);
					yield* g.srcCall(f, "update_icon");
				}
				return live(f.dot);
			}
		} else if ($0 === 2) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
				W = live(f.args[0]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start removing the inner layer of shielding...</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(W))), null, 1, "target", live(f.src)], rt.Args.Named)))) {
					if (!truthy(rt.sv(f, "panel_open"))) {
						return live(f.dot);
					}
					if (!isEqual(rt.sv(f, "security_level"), 2)) {
						return live(f.dot);
					}
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ remove ％！'s shielding.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You remove ％！'s inner shielding.</span>", [live(f.src)])]);
					rt.setSv(f, "security_level", 0);
					yield* g.srcCall(f, "modify_max_integrity", rt.sv(f, "normal_integrity"));
					rt.setSv(f, "damage_deflection", 20);
					yield* g.call(f, P("/proc/spawn_atom_to_turf"), null, [T("/obj/item/stack/sheet/plasteel"), rt.fv(f, "loc", live(f.args[1])), 1]);
					yield* g.srcCall(f, "update_icon");
				}
				return live(f.dot);
			}
		} else if ($0 === 3) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [2, live(f.args[1])])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You begin cutting the inner layer of shielding...</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 40, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(WT))), null, 1, "target", live(f.src)], rt.Args.Named)))) {
					if ((!truthy(rt.sv(f, "panel_open")) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ cuts through ％！'s shielding.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You cut through ％！'s shielding.</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
					rt.setSv(f, "security_level", 2);
				}
				return live(f.dot);
			}
		} else if ($0 === 4) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
				W = live(f.args[0]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start removing outer layer of shielding...</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(W))), null, 1, "target", live(f.src)], rt.Args.Named)))) {
					if (!truthy(rt.sv(f, "panel_open"))) {
						return live(f.dot);
					}
					if (!isEqual(rt.sv(f, "security_level"), 4)) {
						return live(f.dot);
					}
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ remove ％！'s shielding.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You remove ％！'s shielding.</span>", [live(f.src)])]);
					rt.setSv(f, "security_level", 3);
					yield* g.call(f, P("/proc/spawn_atom_to_turf"), null, [T("/obj/item/stack/sheet/plasteel"), rt.fv(f, "loc", live(f.args[1])), 1]);
				}
				return live(f.dot);
			}
		} else if ($0 === 5) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [2, live(f.args[1])])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You begin cutting the outer layer of shielding...</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 40, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(WT))), null, 1, "target", live(f.src)], rt.Args.Named)))) {
					if ((!truthy(rt.sv(f, "panel_open")) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ cuts through ％！'s shielding.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You cut through ％！'s shielding.</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
					rt.setSv(f, "security_level", 4);
				}
				return live(f.dot);
			}
		} else if ($0 === 6) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
				W = live(f.args[0]);
				if ((truthy((yield* g.callName(f, live(f.src), "hasPower", []))) && truthy((yield* g.callName(f, live(f.src), "shock", [live(f.args[1]), 60]))))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start cutting through the outer grille.</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(10, rt.fv(f, "toolspeed", live(W))), null, 1, "target", live(f.src)], rt.Args.Named)))) {
					if (!truthy(rt.sv(f, "panel_open"))) {
						return live(f.dot);
					}
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ cut through ％！'s outer grille.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You cut through ％！'s outer grille.</span>", [live(f.src)])]);
					rt.setSv(f, "security_level", 5);
				}
				return live(f.dot);
			}
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if ((truthy(rt.sv(f, "panel_open")) && truthy(rt.sv(f, "detonated")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ has no maintenance panel!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		rt.setSv(f, "panel_open", (!truthy(rt.sv(f, "panel_open")) ? 1 : 0));
		$0 = live(f.args[1]);
		if (truthy(rt.sv(f, "panel_open"))) {
			$1 = "open";
		} else {
			$1 = "close";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the maintenance panel of the airlock.</span>", [$1])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		yield* g.callName(f, live(f.src), "update_icon", []);
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0)) && truthy(rt.sv(f, "note")))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ cuts down ＀ from ＀.</span>", [live(f.args[1]), rt.sv(f, "note"), live(f.src)]), fmt("<span class='notice'>You remove ＀ from ＀.</span>", [rt.sv(f, "note"), live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/wirecutter.ogg"), 50, 1]);
			yield* g.callName(f, rt.sv(f, "note"), "forceMove", [rt.getStep(f, live(f.args[1]), 0)]);
			rt.setSv(f, "note", null);
			yield* g.srcCall(f, "update_icon");
		} else {
			if (truthy((yield* g.call(f, P("/proc/is_wire_tool"), null, [live(f.args[0])])))) {
				return (yield* g.srcCall(f, "attack_hand", live(f.args[1])));
			}
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pai_cable")) ? 1 : 0))) {
				yield* g.callName(f, (cable = live(f.args[0])), "plugin", [live(f.src), live(f.args[1])]);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/airlock_painter")) ? 1 : 0))) {
					yield* g.srcCall(f, "change_paintjob", live(f.args[0]), live(f.args[1]));
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/doorCharge")) ? 1 : 0))) {
						if ((!truthy(rt.sv(f, "panel_open")) || truthy(rt.sv(f, "security_level")))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The maintenance panel must be open to apply ＀!</span>", [live(f.args[0])])]);
							return live(f.dot);
						}
						if (truthy(rt.sv(f, "emagged"))) {
							return live(f.dot);
						}
						if ((truthy(rt.sv(f, "charge")) && !truthy(rt.sv(f, "detonated")))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There's already a charge hooked up to this door!</span>"]);
							return live(f.dot);
						}
						if (truthy(rt.sv(f, "detonated"))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The maintenance panel is destroyed!</span>"]);
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You apply ＀. Next time someone opens the door, it will explode.</span>", [live(f.args[0])])]);
						yield* g.callName(f, live(f.args[1]), "drop_item", []);
						rt.setSv(f, "panel_open", 0);
						yield* g.srcCall(f, "update_icon");
						yield* g.callName(f, live(f.args[0]), "forceMove", [live(f.src)]);
						rt.setSv(f, "charge", live(f.args[0]));
					} else {
						if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/paper")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/photo")) ? 1 : 0)))) {
							if (truthy(rt.sv(f, "note"))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There's already something pinned to this airlock! Use wirecutters to remove it.<spa>"]);
								return live(f.dot);
							}
							if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>For some reason, you can't attach ＀!</span>", [live(f.args[0])])]);
								return live(f.dot);
							}
							yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ pins ＀ to ＀.</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You pin ＀ to ＀.</span>", [live(f.args[0]), live(f.src)])]);
							rt.setSv(f, "note", live(f.args[0]));
							yield* g.srcCall(f, "update_icon");
						} else {
							return (yield* g.callSuper(f, [], rt.Args.Same));
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["C", "user", "params"] });

// /obj/machinery/door/airlock/proc/try_to_weld  (code/game/machinery/doors/airlock.dm:1170)  may sleep
rt.def("/obj/machinery/door/airlock/proc/try_to_weld", function* try_to_weld(f: Frame, W: Value, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [W, user, $0, $1, $2];
	if (!(!truthy(rt.sv(f, "operating")) && truthy(rt.sv(f, "density")))) return f.dot;
	if (!isEqual(rt.fv(f, "a_intent", live(user)), "help")) {
		if (truthy((yield* g.callName(f, live(W), "remove_fuel", [0, live(user)])))) {
			$0 = live(user);
			$1 = live(user);
			if (truthy(rt.sv(f, "welded"))) {
				$1 = $1;
				$2 = "unwelding";
			} else {
				$2 = "welding";
			}
			$1 = fmt("＀ is ＀ the airlock.", [$1, $2]);
			if (truthy(rt.sv(f, "welded"))) {
				$2 = "unwelding";
			} else {
				$2 = "welding";
			}
			yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You begin ＀ the airlock...</span>", [$2]), "<span class='italics'>You hear welding.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(W)), 40, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(40, rt.fv(f, "toolspeed", live(W))), null, 1, "target", live(f.src), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/door/airlock/proc/weld_checks"), live(W), live(user)]))], rt.Args.Named)))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
				rt.setSv(f, "welded", (!truthy(rt.sv(f, "welded")) ? 1 : 0));
				$0 = live(user);
				$1 = rt.fv(f, "name", live(user));
				if (truthy(rt.sv(f, "welded"))) {
					$2 = "welded shut";
				} else {
					$2 = "unwelded";
				}
				$1 = fmt("＀ has ＀ ＀.", [$1, $2, live(f.src)]);
				if (truthy(rt.sv(f, "welded"))) {
					$2 = "weld the airlock shut";
				} else {
					$2 = "unweld the airlock";
				}
				yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You ＀.</span>", [$2])]);
				yield* g.srcCall(f, "update_icon");
			}
		}
	} else {
		if (rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity"))) {
			if (truthy((yield* g.callName(f, live(W), "remove_fuel", [0, live(user)])))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("＀ is welding the airlock.", [live(user)]), "<span class='notice'>You begin repairing the airlock...</span>", "<span class='italics'>You hear welding.</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(W)), 40, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(40, rt.fv(f, "toolspeed", live(W))), null, 1, "target", live(f.src), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/door/airlock/proc/weld_checks"), live(W), live(user)]))], rt.Args.Named)))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
					rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
					(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
					yield* g.callName(f, live(user), "visible_message", [fmt("＀ has repaired ＀.", [rt.fv(f, "name", live(user)), live(f.src)]), "<span class='notice'>You finish repairing the airlock.</span>"]);
					yield* g.srcCall(f, "update_icon");
				}
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The airlock doesn't need repairing.</span>"]);
		}
	}
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/weld_checks  (code/game/machinery/doors/airlock.dm:1201)
rt.def("/obj/machinery/door/airlock/proc/weld_checks", function weld_checks(f: Frame, W: Value, user: Value) {
	return ((((((!truthy(rt.sv(f, "operating")) ? 1 : 0) && rt.sv(f, "density")) && live(user)) && live(W)) && rt.callName(f, live(W), "isOn", [])) && rt.fv(f, "loc", live(user)));
}, false, { argTypes: [{ type: 4, path: "/obj/item/weapon/weldingtool" }, { type: 8, path: "/mob" }] });

// /obj/machinery/door/airlock/proc/try_to_crowbar  (code/game/machinery/doors/airlock.dm:1205)  may sleep
rt.def("/obj/machinery/door/airlock/proc/try_to_crowbar", function* try_to_crowbar(f: Frame, I: Value, user: Value) {
	let beingcrowbarred: Value = null, F: Value = null, time_to_open: Value = null, result: Value = null;
	f.vars = () => [I, user, beingcrowbarred, F, time_to_open, result];
	beingcrowbarred = null;
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		beingcrowbarred = 1;
	} else {
		beingcrowbarred = 0;
	}
	if ((truthy(rt.sv(f, "panel_open")) && truthy(rt.sv(f, "charge")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You carefully start removing ＀ from ＀...</span>", [rt.sv(f, "charge"), live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "usesound", live(I)), 50, 1]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(150, rt.fv(f, "toolspeed", live(I))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You slip and ＀ detonates!</span>", [rt.sv(f, "charge")])]);
			yield* g.callName(f, rt.sv(f, "charge"), "ex_act", [1]);
			yield* g.callName(f, live(user), "Knockdown", [60]);
			return live(f.dot);
		}
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ removes ＀ from ＀.</span>", [live(user), rt.sv(f, "charge"), live(f.src)]), fmt("<span class='notice'>You gently pry out ＀ from ＀ and unhook its wires.</span>", [rt.sv(f, "charge"), live(f.src)])]);
		yield* g.callName(f, rt.sv(f, "charge"), "forceMove", [rt.getStep(f, live(user), 0)]);
		rt.setSv(f, "charge", null);
		return live(f.dot);
	}
	if ((truthy(live(beingcrowbarred)) && (((((truthy(rt.sv(f, "density")) && truthy(rt.sv(f, "welded"))) && !truthy(rt.sv(f, "operating"))) && truthy(rt.fv(f, "panel_open", live(f.src)))) && !truthy((yield* g.srcCall(f, "hasPower")))) && !truthy(rt.fv(f, "locked", live(f.src)))))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(I)), 100, 1]);
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ removes the electronics from the airlock assembly.", [live(user)]), "<span class='notice'>You start to remove electronics from the airlock assembly...</span>"]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(40, rt.fv(f, "toolspeed", live(I))), "target", live(f.src)], rt.Args.Named)))) {
			if (truthy(rt.fv(f, "loc", live(f.src)))) {
				yield* g.srcCall(f, "deconstruct", 1, live(user));
				return live(f.dot);
			}
		}
	} else {
		if (truthy((yield* g.srcCall(f, "hasPower")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The airlock's motors resist your efforts to force it!</span>"]);
		} else {
			if (truthy(rt.sv(f, "locked"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The airlock's bolts prevent it from being forced!</span>"]);
			} else {
				if ((!truthy(rt.sv(f, "welded")) && !truthy(rt.sv(f, "operating")))) {
					if (isEqual(live(beingcrowbarred), 0)) {
						if (truthy(rt.gv(f, "wielded", (F = live(I))))) {
							rt.spawnTail(f, 0, "/obj/machinery/door/airlock/proc/try_to_crowbar: spawn at game/machinery/doors/airlock.dm:1238", I, user, beingcrowbarred, F, time_to_open, result);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to be wielding the fire axe to do that!</span>"]);
						}
					} else {
						rt.spawnTail(f, 0, "/obj/machinery/door/airlock/proc/try_to_crowbar: spawn at game/machinery/doors/airlock.dm:1246", I, user, beingcrowbarred, F, time_to_open, result);
					}
				}
			}
		}
	}
	if (!truthy((rt.istype(live(I), T("/obj/item/weapon/crowbar/power")) ? 1 : 0))) return f.dot;
	if (truthy((yield* g.srcCall(f, "isElectrified")))) {
		yield* g.srcCall(f, "shock", live(user), 100);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "density"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The bolts are down, it won't budge!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "welded"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>It's welded, it won't budge!</span>"]);
		return live(f.dot);
	}
	time_to_open = 5;
	if (!(truthy((yield* g.srcCall(f, "hasPower"))) && !truthy(rt.sv(f, "prying_so_hard")))) return f.dot;
	time_to_open = 50;
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/airlock_alien_prying.ogg"), 100, 1]);
	rt.setSv(f, "prying_so_hard", 1);
	result = (yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, live(time_to_open), "target", live(f.src)], rt.Args.Named));
	rt.setSv(f, "prying_so_hard", 0);
	if (!truthy(live(result))) return f.dot;
	yield* g.srcCall(f, "open", 2);
	if (!(truthy(rt.sv(f, "density")) && !truthy((yield* g.srcCall(f, "open", 2))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Despite your attempts, the ＀ refuses to open.</span>", [live(f.src)])]);
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/door/airlock/proc/try_to_crowbar, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/door/airlock/proc/try_to_crowbar: spawn at game/machinery/doors/airlock.dm:1246", function* (f: Frame, I: Value, user: Value, beingcrowbarred: Value, F: Value, time_to_open: Value, result: Value) {
	f.vars = () => [I, user, beingcrowbarred, F, time_to_open, result];
	if (truthy(rt.sv(f, "density"))) {
		yield* g.srcCall(f, "open", 2);
	} else {
		yield* g.srcCall(f, "close", 2);
	}
	return null;
});

// a spawn(0) body of /obj/machinery/door/airlock/proc/try_to_crowbar, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/door/airlock/proc/try_to_crowbar: spawn at game/machinery/doors/airlock.dm:1238", function* (f: Frame, I: Value, user: Value, beingcrowbarred: Value, F: Value, time_to_open: Value, result: Value) {
	f.vars = () => [I, user, beingcrowbarred, F, time_to_open, result];
	if (truthy(rt.sv(f, "density"))) {
		yield* g.srcCall(f, "open", 2);
	} else {
		yield* g.srcCall(f, "close", 2);
	}
	return null;
});

// /obj/machinery/door/airlock/plasma/proc/attackby  (code/game/machinery/doors/airlock.dm:1281)  may sleep
rt.def("/obj/machinery/door/airlock/plasma/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (rt.gt((yield* g.callName(f, live(f.args[0]), "is_hot", [])), 300)) {
		$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.args[1])]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.args[1])])]);
		if (truthy(live(f.src))) {
			$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])]);
		} else {
			$1 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Plasma airlock ignited by ＀ in ＀", [$0, fmt("＀", [$1])])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("Plasma wall ignited by ＀ in ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
		yield* g.srcCall(f, "ignite", (yield* g.callName(f, live(f.args[0]), "is_hot", [])));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["C", "user", "params"] });

// /obj/machinery/door/airlock/proc/open_failure_reason  (code/game/machinery/doors/airlock.dm:1290)
rt.def("/obj/machinery/door/airlock/proc/open_failure_reason", function open_failure_reason(f: Frame) {
	if (truthy(rt.sv(f, "operating"))) {
		return null;
	}
	if (truthy(rt.sv(f, "locked"))) {
		return "it's bolted!";
	}
	if (truthy(rt.sv(f, "welded"))) {
		return "it's welded!";
	}
	if ((!truthy(rt.callSrc(f, "hasPower", [])) || truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", ["Open"])))) {
		return "no power!";
	}
	return null;
});

// /obj/machinery/door/airlock/proc/open  (code/game/machinery/doors/airlock.dm:1300)  may sleep
rt.def("/obj/machinery/door/airlock/proc/open", function* open(f: Frame, forced: Value) {
	let H: Value = null;
	let $e: any;
	f.vars = () => [forced, H, $e];
	if (live(forced) === null) {
		forced = 0;
	}
	if (((truthy(rt.sv(f, "operating")) || truthy(rt.sv(f, "welded"))) || truthy(rt.sv(f, "locked")))) {
		return 0;
	}
	if (!truthy(live(forced))) {
		if ((!truthy((yield* g.srcCall(f, "hasPower"))) || truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Open"]))))) {
			return 0;
		}
	}
	if ((truthy(rt.sv(f, "charge")) && !truthy(rt.sv(f, "detonated")))) {
		rt.setSv(f, "panel_open", 1);
		yield* g.srcCall(f, "update_icon", 4);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀'s panel is blown off in a spray of deadly shrapnel!</span>", [live(f.src)]));
		rt.setFv(f, "loc", rt.sv(f, "charge"), rt.getStep(f, live(f.src), 0));
		yield* g.callName(f, rt.sv(f, "charge"), "ex_act", [1]);
		rt.setSv(f, "detonated", 1);
		rt.setSv(f, "charge", null);
		H = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [2, live(f.src)])), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			yield* g.callName(f, live(H), "Unconscious", [160]);
			yield* g.callName(f, live(H), "adjust_fire_stacks", [20]);
			yield* g.callName(f, live(H), "IgniteMob", []);
			yield* g.callName(f, live(H), "apply_damage", [40, "brute", "chest"]);
		}
		rt.endFor(f, 0);
		return live(f.dot);
	}
	if (rt.lt(live(forced), 2)) {
		if (truthy(rt.sv(f, "emagged"))) {
			return 0;
		}
		yield* g.srcCall(f, "use_power", 50);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.sv(f, "doorOpen"), 30, 1]);
		if (((rt.fv(f, "closeOther", live(f.src)) !== null && truthy((rt.istype(rt.fv(f, "closeOther", live(f.src)), T("/obj/machinery/door/airlock")) ? 1 : 0))) && !truthy(rt.gv(f, "density", rt.fv(f, "closeOther", live(f.src)))))) {
			yield* g.callName(f, rt.fv(f, "closeOther", live(f.src)), "close", []);
		}
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/airlockforced.ogg"), 30, 1]);
	}
	if ((truthy(rt.sv(f, "autoclose")) && truthy(rt.sv(f, "normalspeed")))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/door/proc/autoclose")])), 150]);
	} else {
		if ((truthy(rt.sv(f, "autoclose")) && !truthy(rt.sv(f, "normalspeed")))) {
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/door/proc/autoclose")])), 15]);
		}
	}
	if (!truthy(rt.sv(f, "density"))) {
		return 1;
	}
	rt.setSv(f, "operating", 1);
	yield* g.srcCall(f, "update_icon", 4, 1);
	yield* g.callName(f, live(f.src), "set_opacity", [0]);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	rt.setFv(f, "density", live(f.src), 0);
	yield* g.call(f, P("/proc/sleep"), null, [9]);
	rt.setFv(f, "layer", live(f.src), 2.700000047683716);
	yield* g.srcCall(f, "update_icon", 3, 1);
	yield* g.srcCall(f, "set_opacity", 0);
	rt.setSv(f, "operating", 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	yield* g.srcCall(f, "update_freelook_sight");
	if (truthy(rt.sv(f, "delayed_close_requested"))) {
		rt.setSv(f, "delayed_close_requested", 0);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/door/airlock/proc/close")])), 2]);
	}
	return 1;
}, true);

// /obj/machinery/door/airlock/proc/close  (code/game/machinery/doors/airlock.dm:1355)  may sleep
rt.def("/obj/machinery/door/airlock/proc/close", function* close(f: Frame, forced: Value) {
	let M: Value = null, killthis: Value = null;
	let $e: any;
	f.vars = () => [forced, M, killthis, $e];
	if (live(forced) === null) {
		forced = 0;
	}
	if (((truthy(rt.sv(f, "operating")) || truthy(rt.sv(f, "welded"))) || truthy(rt.sv(f, "locked")))) {
		return live(f.dot);
	}
	if (!truthy(live(forced))) {
		if ((!truthy((yield* g.srcCall(f, "hasPower"))) || truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Bolts"]))))) {
			return live(f.dot);
		}
	}
	if (truthy(rt.sv(f, "safe"))) {
		M = null;
		rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if ((truthy(rt.fv(f, "density", live(M))) && !isEqual(live(M), live(f.src)))) {
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/door/proc/autoclose")])), 60]);
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
	}
	if (rt.lt(live(forced), 2)) {
		if (truthy(rt.sv(f, "emagged"))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "use_power", 50);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.sv(f, "doorClose"), 30, 1]);
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/airlockforced.ogg"), 30, 1]);
	}
	if (truthy((killthis = rt.locateIn(f, T("/obj/structure/window"), rt.getStep(f, live(f.src), 0))))) {
		yield* g.callName(f, live(killthis), "ex_act", [2]);
	}
	if (truthy(rt.sv(f, "density"))) {
		return 1;
	}
	rt.setSv(f, "operating", 1);
	yield* g.srcCall(f, "update_icon", 2, 1);
	rt.setFv(f, "layer", live(f.src), 3.0999999046325684);
	if (truthy(rt.sv(f, "air_tight"))) {
		rt.setSv(f, "density", 1);
	}
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	rt.setSv(f, "density", 1);
	if (!truthy(rt.sv(f, "safe"))) {
		yield* g.srcCall(f, "crush");
	}
	yield* g.call(f, P("/proc/sleep"), null, [9]);
	yield* g.srcCall(f, "update_icon", 1, 1);
	if ((truthy(rt.sv(f, "visible")) && !truthy(rt.sv(f, "glass")))) {
		yield* g.srcCall(f, "set_opacity", 1);
	}
	rt.setSv(f, "operating", 0);
	rt.setSv(f, "delayed_close_requested", 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	yield* g.srcCall(f, "update_freelook_sight");
	if (truthy(rt.sv(f, "safe"))) {
		yield* g.srcCall(f, "CheckForMobs");
	}
	return 1;
}, true);

// /obj/machinery/door/airlock/proc/prison_open  (code/game/machinery/doors/airlock.dm:1404)  may sleep
rt.def("/obj/machinery/door/airlock/proc/prison_open", function* prison_open(f: Frame) {
	if (truthy(rt.sv(f, "emagged"))) {
		return live(f.dot);
	}
	rt.setFv(f, "locked", live(f.src), 0);
	yield* g.callName(f, live(f.src), "open", []);
	rt.setFv(f, "locked", live(f.src), 1);
	return live(f.dot);
}, true);

// /obj/machinery/door/airlock/proc/change_paintjob  (code/game/machinery/doors/airlock.dm:1411)  may sleep
rt.def("/obj/machinery/door/airlock/proc/change_paintjob", function* change_paintjob(f: Frame, W: Value, user: Value) {
	let optionlist: Value = null, paintjob: Value = null;
	let $0: any;
	f.vars = () => [W, user, optionlist, paintjob, $0];
	if (!truthy((yield* g.callName(f, live(W), "can_use", [live(user)])))) {
		return live(f.dot);
	}
	optionlist = null;
	if (isEqual(rt.sv(f, "airlock_material"), "glass")) {
		optionlist = rt.list("Public", "Public2", "Engineering", "Atmospherics", "Security", "Command", "Medical", "Research", "Mining", "Maintenance");
	} else {
		optionlist = rt.list("Public", "Engineering", "Atmospherics", "Security", "Command", "Medical", "Research", "Mining", "Maintenance", "External", "High Security");
	}
	paintjob = (yield* g.op(f, "Prompt", [0], [null, null, "Please select a paintjob for this airlock.", live(user), live(optionlist)]));
	if (((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.fv(f, "loc", live(f.src)), live(f.usr))) || !truthy((yield* g.callName(f, live(W), "use", [live(user)]))))) {
		return live(f.dot);
	}
	$0 = live(paintjob);
	if ($0 === "Public") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/public.dmi"));
		rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
		rt.setSv(f, "assemblytype", T("/obj/structure/door_assembly/door_assembly_0"));
	} else if ($0 === "Public2") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station2/glass.dmi"));
		rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station2/overlays.dmi"));
		rt.setSv(f, "assemblytype", T("/obj/structure/door_assembly/door_assembly_glass"));
	} else if ($0 === "Engineering") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/engineering.dmi"));
		rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
		rt.setSv(f, "assemblytype", T("/obj/structure/door_assembly/door_assembly_eng"));
	} else if ($0 === "Atmospherics") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/atmos.dmi"));
		rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
		rt.setSv(f, "assemblytype", T("/obj/structure/door_assembly/door_assembly_atmo"));
	} else if ($0 === "Security") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/security.dmi"));
		rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
		rt.setSv(f, "assemblytype", T("/obj/structure/door_assembly/door_assembly_sec"));
	} else if ($0 === "Command") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/command.dmi"));
		rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
		rt.setSv(f, "assemblytype", T("/obj/structure/door_assembly/door_assembly_com"));
	} else if ($0 === "Medical") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/medical.dmi"));
		rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
		rt.setSv(f, "assemblytype", T("/obj/structure/door_assembly/door_assembly_med"));
	} else if ($0 === "Research") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/research.dmi"));
		rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
		rt.setSv(f, "assemblytype", T("/obj/structure/door_assembly/door_assembly_research"));
	} else if ($0 === "Mining") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/mining.dmi"));
		rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
		rt.setSv(f, "assemblytype", T("/obj/structure/door_assembly/door_assembly_min"));
	} else if ($0 === "Maintenance") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/maintenance.dmi"));
		rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
		rt.setSv(f, "assemblytype", T("/obj/structure/door_assembly/door_assembly_mai"));
	} else if ($0 === "External") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/external/external.dmi"));
		rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/external/overlays.dmi"));
		rt.setSv(f, "assemblytype", T("/obj/structure/door_assembly/door_assembly_ext"));
	} else if ($0 === "High Security") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/highsec/highsec.dmi"));
		rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/highsec/overlays.dmi"));
		rt.setSv(f, "assemblytype", T("/obj/structure/door_assembly/door_assembly_highsecurity"));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/CanAStarPass  (code/game/machinery/doors/airlock.dm:1476)
rt.def("/obj/machinery/door/airlock/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value) {
	return ((!truthy(rt.sv(f, "density")) ? 1 : 0) || ((rt.callSrc(f, "check_access", [live(ID)]) && (!truthy(rt.sv(f, "locked")) ? 1 : 0)) && rt.callSrc(f, "hasPower", [])));
});

// /obj/machinery/door/airlock/proc/emag_act  (code/game/machinery/doors/airlock.dm:1479)  may sleep
rt.def("/obj/machinery/door/airlock/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(((!truthy(rt.sv(f, "operating")) && truthy(rt.sv(f, "density"))) && truthy((yield* g.srcCall(f, "hasPower")))) && !truthy(rt.sv(f, "emagged")))) return f.dot;
	rt.setSv(f, "operating", 1);
	yield* g.srcCall(f, "update_icon", 6, 1);
	yield* g.call(f, P("/proc/sleep"), null, [6]);
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	rt.setSv(f, "operating", 0);
	if (!truthy((yield* g.srcCall(f, "open")))) {
		yield* g.srcCall(f, "update_icon", 1, 1);
	}
	rt.setSv(f, "emagged", 1);
	rt.setSv(f, "desc", "<span class='warning'>Its access panel is smoking slightly.</span>");
	rt.setSv(f, "lights", 0);
	rt.setSv(f, "locked", 1);
	yield* g.srcCall(f, "loseMainPower");
	yield* g.srcCall(f, "loseBackupPower");
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/attack_alien  (code/game/machinery/doors/airlock.dm:1496)  may sleep
rt.def("/obj/machinery/door/airlock/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	let time_to_open: Value = null;
	f.vars = () => [user, time_to_open];
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (truthy((yield* g.srcCall(f, "isElectrified")))) {
		yield* g.srcCall(f, "shock", live(user), 100);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "density"))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "locked")) || truthy(rt.sv(f, "welded")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ refuses to budge!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ begins prying open ＀.</span>", [live(user), live(f.src)]), fmt("<span class='noticealien'>You begin digging your claws into ＀ with all your might!</span>", [live(f.src)]), "<span class='warning'>You hear groaning metal...</span>"]);
	time_to_open = 5;
	if (truthy((yield* g.srcCall(f, "hasPower")))) {
		time_to_open = 50;
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/airlock_alien_prying.ogg"), 100, 1]);
	}
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, live(time_to_open), "target", live(f.src)], rt.Args.Named)))) return f.dot;
	if (!(truthy(rt.sv(f, "density")) && !truthy((yield* g.srcCall(f, "open", 2))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Despite your efforts, ＀ managed to resist your attempts to open it!</span>", [live(f.src)])]);
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/hostile_lockdown  (code/game/machinery/doors/airlock.dm:1520)  may sleep
rt.def("/obj/machinery/door/airlock/proc/hostile_lockdown", function* hostile_lockdown(f: Frame, origin: Value) {
	f.vars = () => [origin];
	if (!(truthy((yield* g.srcCall(f, "canAIControl", live(f.src)))) && !truthy(rt.sv(f, "stat")))) return f.dot;
	rt.setSv(f, "locked", 0);
	rt.setSv(f, "safe", 0);
	yield* g.srcCall(f, "close");
	yield* g.srcCall(f, "bolt");
	yield* g.srcCall(f, "set_electrified", -1);
	if (!truthy(live(origin))) return f.dot;
	rt.modSrcVar(f, "shockedby", fmt("[＀]＀(ckey:＀)", [(yield* g.call(f, P("/proc/time_stamp"), null, [])), live(origin), rt.fv(f, "ckey", live(origin))]), add);
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/disable_lockdown  (code/game/machinery/doors/airlock.dm:1532)  may sleep
rt.def("/obj/machinery/door/airlock/proc/disable_lockdown", function* disable_lockdown(f: Frame) {
	if (!(truthy((yield* g.srcCall(f, "canAIControl", live(f.src)))) && !truthy(rt.sv(f, "stat")))) return f.dot;
	yield* g.srcCall(f, "unbolt");
	yield* g.srcCall(f, "set_electrified", 0);
	yield* g.srcCall(f, "open");
	rt.setSv(f, "safe", 1);
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/obj_break  (code/game/machinery/doors/airlock.dm:1540)  may sleep
rt.def("/obj/machinery/door/airlock/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if (!(!truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	if (!truthy(rt.sv(f, "panel_open"))) {
		rt.setSv(f, "panel_open", 1);
	}
	yield* g.callName(f, rt.sv(f, "wires"), "cut_all", []);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/set_electrified  (code/game/machinery/doors/airlock.dm:1548)
rt.def("/obj/machinery/door/airlock/proc/set_electrified", function set_electrified(f: Frame, seconds: Value) {
	rt.setSv(f, "secondsElectrified", live(seconds));
	rt.callSrc(f, "diag_hud_set_electrified", []);
	return f.dot;
});

// /obj/machinery/door/airlock/proc/take_damage  (code/game/machinery/doors/airlock.dm:1552)  may sleep
rt.def("/obj/machinery/door/airlock/proc/take_damage", function* take_damage(f: Frame) {
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
	if (!rt.lt(rt.sv(f, "obj_integrity"), multiply(0.75, rt.sv(f, "max_integrity")))) return f.dot;
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// /obj/machinery/door/airlock/proc/deconstruct  (code/game/machinery/doors/airlock.dm:1558)  may sleep
rt.def("/obj/machinery/door/airlock/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value, user: Value) {
	let A: Value = null, ae: Value = null;
	f.vars = () => [disassembled, user, A, ae];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		A = null;
		if (truthy(rt.sv(f, "assemblytype"))) {
			rt.setFv(f, "heat_proof_finished", (A = (yield* g.new_(f, rt.sv(f, "assemblytype"), [rt.fv(f, "loc", live(f.src))]))), rt.fv(f, "heat_proof", live(f.src)));
		} else {
			A = (yield* g.new_(f, T("/obj/structure/door_assembly/door_assembly_0"), [rt.fv(f, "loc", live(f.src))]));
		}
		rt.setFv(f, "created_name", live(A), rt.sv(f, "name"));
		if (!truthy(live(disassembled))) {
			if (truthy(live(A))) {
				rt.setFv(f, "obj_integrity", live(A), multiply(rt.fv(f, "max_integrity", live(A)), 0.5));
			}
		} else {
			if (truthy(rt.sv(f, "emagged"))) {
				if (truthy(live(user))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You discard the damaged electronics.</span>"]);
				}
			} else {
				if (truthy(live(user))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You remove the airlock electronics.</span>"]);
				}
				ae = null;
				if (!truthy(rt.sv(f, "electronics"))) {
					ae = (yield* g.new_(f, T("/obj/item/weapon/electronics/airlock"), [rt.fv(f, "loc", live(f.src))]));
					yield* g.srcCall(f, "gen_access");
					if (truthy(rt.len(f, rt.sv(f, "req_one_access")))) {
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
			}
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/rcd_vals  (code/game/machinery/doors/airlock.dm:1594)
rt.def("/obj/machinery/door/airlock/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.fv(f, "mode", live(the_rcd));
	if ($0 === 3) {
		return rt.alist(f, ["mode", 3, "delay", 50, "cost", 32]);
	}
	return 0;
});

// /obj/machinery/door/airlock/proc/rcd_act  (code/game/machinery/doors/airlock.dm:1600)  may sleep
rt.def("/obj/machinery/door/airlock/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	let $0: any;
	f.vars = () => [user, the_rcd, passed_mode, $0];
	$0 = live(passed_mode);
	if ($0 === 3) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You deconstruct the airlock.</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 1;
	}
	return 0;
}, true);

// /obj/machinery/door/airlock/proc/note_type  (code/game/machinery/doors/airlock.dm:1608)
rt.def("/obj/machinery/door/airlock/proc/note_type", function note_type(f: Frame) {
	if (!truthy(rt.sv(f, "note"))) {
		return live(f.dot);
	} else {
		if (truthy((rt.istype(rt.sv(f, "note"), T("/obj/item/weapon/paper")) ? 1 : 0))) {
			return "note";
		}
		if (!truthy((rt.istype(rt.sv(f, "note"), T("/obj/item/weapon/photo")) ? 1 : 0))) return f.dot;
		return "photo";
	}
	return f.dot;
});
