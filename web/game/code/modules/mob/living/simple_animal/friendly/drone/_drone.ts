// From code/modules/mob/living/simple_animal/friendly/drone/_drone.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4841, "/mob/living/simple_animal/drone", "/mob/living/simple_animal", {
	staticChoice: "static",
	staticChoices: null,
	picked: 0,
	colour: "grey",
	drone_overlays: null,
	laws: "1. You may not involve yourself in the matters of another being, even if such matters conflict with Law Two or Law Three, unless the other being is another Drone.\n2. You may not harm any being, regardless of intent or circumstance.\n3. Your goals are to build, maintain, repair, improve, and provide power to the best of your abilities, You must never actively work against these goals.",
	light_on: 0,
	heavy_emp_damage: 25,
	alarms: null,
	internal_storage: null,
	head: null,
	default_hatmask: null,
	seeStatic: 1,
	visualAppearence: "drone_maint",
	hacked: 0,
	can_be_held: 1,
	flavortext: "\n<big><span class='warning'>DO NOT INTERFERE WITH THE ROUND AS A DRONE OR YOU WILL BE DRONE BANNED</span></big>\n<span class='notify'>Drones are a ghost role that are allowed to fix the station and build things. Interfering with the round as a drone is against the rules.</span>\n<span class='notify'>Actions that constitute interference include, but are not limited to:</span>\n<span class='notify'>     - Interacting with round critical objects (IDs, weapons, contraband, powersinks, bombs, etc.)</span>\n<span class='notify'>     - Interacting with living beings (communication, attacking, healing, etc.)</span>\n<span class='notify'>     - Interacting with non-living beings (dragging bodies, looting bodies, etc.)</span>\n<span class='warning'>These rules are at admin discretion and will be heavily enforced.</span>\n<span class='warning'><u>If you do not have the regular drone laws, follow your laws to the best of your ability.</u></span>",
	default_storage: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/drone"),
	pass_flags: 17,
	initial_language_holder: rt.typePath("/datum/language_holder/drone"),
	hud_possible: null,
	name: "Drone",
	desc: "A maintenance drone, an expendable robot built to perform station repairs.",
	icon: rt.rsc("icons/mob/drone.dmi"),
	icon_state: "drone_maint_grey",
	icon_living: "drone_maint_grey",
	icon_dead: "drone_maint_dead",
	health: 30,
	maxHealth: 30,
	unsuitable_atmos_damage: 0,
	wander: 0,
	speed: 0,
	ventcrawler: 2,
	healable: 0,
	density: 0,
	sight: 24,
	status_flags: 11,
	gender: "neuter",
	voice_name: "synthesized chirp",
	speak_emote: null,
	bubble_icon: "machine",
	mob_size: 1,
	has_unlimited_silicon_privilege: 1,
	damage_coeff: null,
	staticOverlays: null,
	unique_name: 1,
	faction: null,
	dextrous: 1,
	dextrous_hud_type: rt.typePath("/datum/hud/dextrous/drone"),
});

// /mob/living/simple_animal/drone/proc/<init>  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:54)
rt.def("/mob/living/simple_animal/drone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hud_possible", rt.list("8", "9", "15"));
	rt.setSv(f, "staticChoices", rt.list("static", "blank", "letter", "animal"));
	$0 = $0;
	rt.setSv(f, "drone_overlays", rt.op(f, "CreateMultidimensionalList", [1], [2]));
	$0 = $0;
	rt.setSv(f, "alarms", rt.alist(f, ["Atmosphere", rt.list(), "Fire", rt.list(), "Power", rt.list()]));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("chirps"));
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]));
	$0 = $0;
	rt.setSv(f, "staticOverlays", rt.list());
	rt.setSv(f, "faction", rt.list("neutral", "silicon", "turret"));
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:81)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/Initialize", function* Initialize(f: Frame) {
	let C: Value = null, I: Value = null, SF: Value = null, diag_hud: Value = null;
	f.vars = () => [C, I, SF, diag_hud];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "access_card", (yield* g.new_(f, T("/obj/item/weapon/card/id"), [live(f.src)])));
	C = (yield* g.new_(f, T("/datum/job/captain"), []));
	rt.setFv(f, "access", rt.sv(f, "access_card"), (yield* g.callName(f, live(C), "get_access", [])));
	if (truthy(rt.sv(f, "default_storage"))) {
		yield* g.srcCall(f, "equip_to_slot_or_del", (I = (yield* g.new_(f, rt.sv(f, "default_storage"), [live(f.src)]))), 20);
	}
	if (truthy(rt.sv(f, "default_hatmask"))) {
		yield* g.srcCall(f, "equip_to_slot_or_del", (I = (yield* g.new_(f, rt.sv(f, "default_hatmask"), [live(f.src)]))), 11);
	}
	(rt.modField(f, rt.sv(f, "access_card"), "flags", 2, rt.bitOr));
	yield* g.srcCall(f, "alert_drones", fmt("<span class='notice'>DRONE NETWORK: ＀ connected.</span>", [rt.sv(f, "name")]));
	if (truthy(rt.sv(f, "seeStatic"))) {
		yield* g.callName(f, (SF = (yield* g.new_(f, T("/datum/action/generic/drone/select_filter"), [live(f.src)]))), "Grant", [live(f.src)]);
	} else {
		(rt.modSrcVar(f, "verbs", P("/mob/living/simple_animal/drone/verb/toggle_statics"), subtract));
	}
	yield* g.callName(f, (diag_hud = rt.index(rt.gl("huds"), 5)), "add_to_hud", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/proc/med_hud_set_health  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:110)
rt.def("/mob/living/simple_animal/drone/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	holder = rt.at(rt.sv(f, "hud_list"), "9");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	rt.setFv(f, "icon_state", live(holder), fmt("huddiag＀", [rt.call(f, P("/proc/RoundDiagBar"), null, [divide(rt.sv(f, "health"), rt.sv(f, "maxHealth"))])]));
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/med_hud_set_status  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:116)
rt.def("/mob/living/simple_animal/drone/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	holder = rt.at(rt.sv(f, "hud_list"), "8");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	if (isEqual(rt.sv(f, "stat"), 2)) {
		rt.setFv(f, "icon_state", live(holder), "huddead2");
	} else {
		if (truthy(rt.callSrc(f, "incapacitated", []))) {
			rt.setFv(f, "icon_state", live(holder), "hudoffline");
		} else {
			rt.setFv(f, "icon_state", live(holder), "hudstat");
		}
	}
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/Destroy  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:126)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "access_card")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/drone/proc/Login  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:130)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/Login", function* Login(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "check_laws");
	if (truthy(rt.sv(f, "flavortext"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("＀", [rt.sv(f, "flavortext")])]);
	}
	yield* g.srcCall(f, "updateSeeStaticMobs");
	if (truthy(rt.sv(f, "picked"))) return f.dot;
	yield* g.srcCall(f, "pickVisualAppearence");
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/proc/death  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:143)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/death", function* death(f: Frame, gibbed: Value) {
	f.vars = () => [gibbed];
	yield* g.callSuper(f, [live(gibbed)]);
	if (truthy(rt.sv(f, "internal_storage"))) {
		yield* g.srcCall(f, "dropItemToGround", rt.sv(f, "internal_storage"));
	}
	if (truthy(rt.sv(f, "head"))) {
		yield* g.srcCall(f, "dropItemToGround", rt.sv(f, "head"));
	}
	yield* g.srcCall(f, "alert_drones", fmt("<span class='danger'>DRONE NETWORK: ＀ is not responding.</span>", [rt.sv(f, "name")]));
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/proc/gib  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:153)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/gib", function* gib(f: Frame) {
	yield* g.srcCall(f, "dust");
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/proc/ratvar_act  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:156)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/ratvar_act", function* ratvar_act(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "internal_storage"))) {
		yield* g.srcCall(f, "dropItemToGround", rt.sv(f, "internal_storage"));
	}
	if (truthy(rt.sv(f, "head"))) {
		yield* g.srcCall(f, "dropItemToGround", rt.sv(f, "head"));
	}
	yield* g.callName(f, (R = (yield* g.new_(f, T("/mob/living/simple_animal/drone/cogscarab/ratvar"), [rt.sv(f, "loc")]))), "setDir", [rt.sv(f, "dir")]);
	if (truthy(rt.sv(f, "mind"))) {
		yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(R), 1]);
	} else {
		rt.setFv(f, "key", live(R), rt.sv(f, "key"));
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/proc/examine  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:173)
rt.def("/mob/living/simple_animal/drone/proc/examine", function examine(f: Frame, user: Value) {
	let msg: Value = null, I: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [msg, I, $0, $1, $e];
	msg = fmt("<span class='info'>*---------*\nThis is ＀ ＇<b>！</b>!\n", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(f.src)]);
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 128))) {
			if (truthy(rt.fv(f, "blood_DNA", live(I)))) {
				$0 = rt.call(f, P("/proc/bicon"), null, [live(I)]);
				if (isEqual(rt.fv(f, "gender", live(I)), "plural")) {
					$1 = "some";
				} else {
					$1 = "a";
				}
				msg = rt.modify(live(msg), fmt("<span class='warning'>It has ＀ ＀ blood-stained ＀ in its ＀!</span>\n", [$0, $1, rt.fv(f, "name", live(I)), rt.callSrc(f, "get_held_index_name", [rt.callSrc(f, "get_held_index_of_item", [live(I)])])]), add);
			} else {
				msg = rt.modify(live(msg), fmt("It has ＀ ＇！ in its ＀.\n", [rt.call(f, P("/proc/bicon"), null, [live(I)]), live(I), rt.callSrc(f, "get_held_index_name", [rt.callSrc(f, "get_held_index_of_item", [live(I)])])]), add);
			}
		}
	}
	rt.endFor(f, 0);
	if ((truthy(rt.sv(f, "internal_storage")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "internal_storage")), 128)))) {
		if (truthy(rt.fv(f, "blood_DNA", rt.sv(f, "internal_storage")))) {
			$0 = rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "internal_storage")]);
			if (isEqual(rt.fv(f, "gender", rt.sv(f, "internal_storage")), "plural")) {
				$1 = "some";
			} else {
				$1 = "a";
			}
			msg = rt.modify(live(msg), fmt("<span class='warning'>It is holding ＀ ＀ blood-stained ＀ in its internal storage!</span>\n", [$0, $1, rt.fv(f, "name", rt.sv(f, "internal_storage"))]), add);
		} else {
			msg = rt.modify(live(msg), fmt("It is holding ＀ ＇！ in its internal storage.\n", [rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "internal_storage")]), rt.sv(f, "internal_storage")]), add);
		}
	}
	if ((truthy(rt.sv(f, "head")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "head")), 128)))) {
		if (truthy(rt.fv(f, "blood_DNA", rt.sv(f, "head")))) {
			$0 = rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "head")]);
			if (isEqual(rt.fv(f, "gender", rt.sv(f, "head")), "plural")) {
				$1 = "some";
			} else {
				$1 = "a";
			}
			msg = rt.modify(live(msg), fmt("<span class='warning'>It is wearing ＀ ＀ blood-stained ＀ on its head!</span>\n", [$0, $1, rt.fv(f, "name", rt.sv(f, "head"))]), add);
		} else {
			msg = rt.modify(live(msg), fmt("It is wearing ＀ ＇！ on its head.\n", [rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "head")]), rt.sv(f, "head")]), add);
		}
	}
	if ((!truthy(rt.sv(f, "client")) && !isEqual(rt.sv(f, "stat"), 2))) {
		msg = rt.modify(live(msg), "Its status LED is blinking at a steady rate.\n", add);
	}
	if (truthy(rt.sv(f, "hacked"))) {
		msg = rt.modify(live(msg), "<span class='warning'>Its display is glowing red!</span>\n", add);
	}
	if (!isEqual(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
		if (rt.gt(rt.sv(f, "health"), multiply(rt.sv(f, "maxHealth"), 0.33000001311302185))) {
			msg = rt.modify(live(msg), "<span class='warning'>Its screws are slightly loose.</span>\n", add);
		} else {
			msg = rt.modify(live(msg), "<span class='boldwarning'>Its screws are very loose!</span>\n", add);
		}
	}
	if (isEqual(rt.sv(f, "stat"), 2)) {
		if (truthy(rt.sv(f, "client"))) {
			msg = rt.modify(live(msg), "<span class='deadsay'>A message repeatedly flashes on its display: \"REBOOT -- REQUIRED\".</span>\n", add);
		} else {
			msg = rt.modify(live(msg), "<span class='deadsay'>A message repeatedly flashes on its display: \"ERROR -- OFFLINE\".</span>\n", add);
		}
	}
	msg = rt.modify(live(msg), "*---------*</span>", add);
	rt.call(f, P("/proc/to_chat"), null, [live(user), live(msg)]);
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/emp_act  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:227)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.srcCall(f, "Stun", 100);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><b>ER@%R: MME^RY CO#RU9T!</b> R&$b@0tin)...</span>"]);
	if (!isEqual(live(severity), 1)) return f.dot;
	yield* g.srcCall(f, "adjustBruteLoss", rt.sv(f, "heavy_emp_damage"));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>HeAV% DA%^MMA+G TO I/O CIR!%UUT!</span>"]);
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/proc/triggerAlarm  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:235)
rt.def("/mob/living/simple_animal/drone/proc/triggerAlarm", function triggerAlarm(f: Frame, _class: Value, A: Value, O: Value, alarmsource: Value) {
	let L: Value = null, I: Value = null, alarm: Value = null, sources: Value = null;
	let $e: any;
	f.vars = () => [L, I, alarm, sources, $e];
	if (!isEqual(rt.fv(f, "z", live(alarmsource)), rt.sv(f, "z"))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "stat"), 2)) return f.dot;
	L = rt.index(rt.fv(f, "alarms", live(f.src)), live(_class));
	I = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual(live(I), rt.fv(f, "name", live(A)))) {
			alarm = rt.index(live(L), live(I));
			sources = rt.index(live(alarm), 2);
			if (!truthy((rt.isIn(f, live(alarmsource), live(sources)) ? 1 : 0))) {
				sources = rt.modify(live(sources), live(alarmsource), add);
			}
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	rt.setAt(live(L), rt.fv(f, "name", live(A)), rt.list(live(A), rt.list(live(alarmsource))));
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("--- ＀ alarm detected in ＀!", [live(_class), rt.fv(f, "name", live(A))])]);
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/cancelAlarm  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:251)
rt.def("/mob/living/simple_animal/drone/proc/cancelAlarm", function cancelAlarm(f: Frame, _class: Value, A: Value, origin: Value) {
	let L: Value = null, cleared: Value = null, I: Value = null, alarm: Value = null, srcs: Value = null;
	let $e: any;
	f.vars = () => [L, cleared, I, alarm, srcs, $e];
	if (isEqual(rt.sv(f, "stat"), 2)) return f.dot;
	L = rt.index(rt.sv(f, "alarms"), live(_class));
	cleared = 0;
	I = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual(live(I), rt.fv(f, "name", live(A)))) {
			alarm = rt.index(live(L), live(I));
			srcs = rt.index(live(alarm), 2);
			if (truthy((rt.isIn(f, live(origin), live(srcs)) ? 1 : 0))) {
				(srcs = rt.modify(live(srcs), live(origin), subtract));
			}
			if (isEqual(rt.len(f, live(srcs)), 0)) {
				cleared = 1;
				(L = rt.modify(live(L), live(I), subtract));
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(cleared))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("--- ＀ alarm in ＀ has been cleared.", [live(_class), rt.fv(f, "name", live(A))])]);
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/flash_act  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:271)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/flash_act", function* flash_act(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy(live(f.args[2]))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["intensity", "override_blindness_check", "affect_silicon"] });

// /mob/living/simple_animal/drone/proc/mob_has_gravity  (code/modules/mob/living/simple_animal/friendly/drone/_drone.dm:277)
rt.def("/mob/living/simple_animal/drone/proc/mob_has_gravity", function mob_has_gravity(f: Frame) {
	return (rt.callSuper(f, [], rt.Args.Same) || rt.callSrc(f, "mob_negates_gravity", []));
});
