// From code/modules/mob/living/silicon/pai/pai.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4839, "/mob/living/silicon/pai", "/mob/living/silicon", {
	network: "SS13",
	current: null,
	ram: 100,
	software: null,
	userDNA: null,
	card: null,
	speakStatement: "states",
	speakExclamation: "declares",
	speakDoubleExclamation: "alarms",
	speakQuery: "queries",
	cable: null,
	master: null,
	master_dna: null,
	temp: null,
	screen: null,
	subscreen: null,
	pda: null,
	secHUD: 0,
	medHUD: 0,
	medicalActive1: null,
	medicalActive2: null,
	securityActive1: null,
	securityActive2: null,
	hackdoor: null,
	hackprogress: 0,
	sradio: null,
	holoform: 0,
	canholo: 1,
	access_card: null,
	chassis: "repairbot",
	possible_chassis: null,
	emitterhealth: 20,
	emittermaxhealth: 20,
	emitterregen: 0.25,
	emittercd: 50,
	emitteroverloadcd: 100,
	emittersemicd: 0,
	overload_ventcrawl: 0,
	overload_bulletblock: 0,
	overload_maxhealth: 0,
	silent: 0,
	hit_slowdown: 0,
	brightness_power: 5,
	slowdown: 0,
	available_software: null,
	pass_flags: 17,
	name: "pAI",
	icon: rt.rsc("icons/mob/pai.dmi"),
	icon_state: "repairbot",
	mouse_opacity: 2,
	density: 0,
	luminosity: 0,
	mob_size: 0,
	desc: "A generic pAI mobile hard-light holographics emitter. It seems to be deactivated.",
	weather_immunities: null,
	health: 500,
	maxHealth: 500,
	canmove: 0,
});

// /mob/living/silicon/pai/proc/<init>  (code/modules/mob/living/silicon/pai/pai.dm:18)
rt.def("/mob/living/silicon/pai/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "software", rt.list());
	rt.setSv(f, "possible_chassis", rt.list("cat", "mouse", "monkey", "corgi", "fox", "repairbot", "rabbit"));
	rt.setSv(f, "available_software", rt.alist(f, ["crew manifest", 5, "digital messenger", 5, "medical records", 15, "security records", 15, "door jack", 30, "atmosphere sensor", 5, "security HUD", 20, "medical HUD", 20, "universal translator", 35, "remote signaller", 5]));
	$0 = $0;
	rt.setSv(f, "weather_immunities", rt.list("ash"));
	return f.dot;
});

// /mob/living/silicon/pai/proc/movement_delay  (code/modules/mob/living/silicon/pai/pai.dm:77)
rt.def("/mob/living/silicon/pai/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	f.dot = rt.modify(live(f.dot), rt.sv(f, "slowdown"), add);
	return f.dot;
});

// /mob/living/silicon/pai/proc/Destroy  (code/modules/mob/living/silicon/pai/pai.dm:81)  may sleep
rt.def("/mob/living/silicon/pai/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("pai_list", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/silicon/pai/proc/Initialize  (code/modules/mob/living/silicon/pai/pai.dm:85)  may sleep
rt.def("/mob/living/silicon/pai/proc/Initialize", function* Initialize(f: Frame) {
	let _P: Value = null, newcardloc: Value = null, AS: Value = null, AC: Value = null, AR: Value = null, AL: Value = null, ALM: Value = null;
	f.vars = () => [_P, newcardloc, AS, AC, AR, AL, ALM];
	_P = rt.sv(f, "loc");
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	}
	rt.modGl("pai_list", live(f.src), add);
	yield* g.srcCall(f, "make_laws");
	rt.setSv(f, "canmove", 0);
	if (!truthy((rt.istype(live(_P), T("/obj/item/device/paicard")) ? 1 : 0))) {
		yield* g.callName(f, (_P = (yield* g.new_(f, T("/obj/item/device/paicard"), [(newcardloc = live(_P))]))), "setPersonality", [live(f.src)]);
	}
	rt.setSv(f, "loc", live(_P));
	rt.setSv(f, "card", live(_P));
	rt.setSv(f, "sradio", (yield* g.new_(f, T("/obj/item/radio/integrated/signal"), [live(f.src)])));
	if (!truthy(rt.sv(f, "radio"))) {
		rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/device/radio"), [live(f.src)])));
	}
	rt.setSv(f, "pda", (yield* g.new_(f, T("/obj/item/device/pda/ai/pai"), [live(f.src)])));
	rt.spawnTail(f, 5, "/mob/living/silicon/pai/proc/Initialize: spawn at modules/mob/living/silicon/pai/pai.dm:102", _P, newcardloc, AS, AC, AR, AL, ALM);
	yield* g.callSuper(f, [], rt.Args.Same);
	AS = (yield* g.new_(f, T("/datum/action/innate/pai/shell"), []));
	AC = (yield* g.new_(f, T("/datum/action/innate/pai/chassis"), []));
	AR = (yield* g.new_(f, T("/datum/action/innate/pai/rest"), []));
	AL = (yield* g.new_(f, T("/datum/action/innate/pai/light"), []));
	ALM = (yield* g.new_(f, T("/datum/action/language_menu"), []));
	yield* g.callName(f, live(AS), "Grant", [live(f.src)]);
	yield* g.callName(f, live(AC), "Grant", [live(f.src)]);
	yield* g.callName(f, live(AR), "Grant", [live(f.src)]);
	yield* g.callName(f, live(AL), "Grant", [live(f.src)]);
	yield* g.callName(f, live(ALM), "Grant", [live(f.src)]);
	rt.setSv(f, "emittersemicd", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/silicon/pai/proc/emittercool")])), 600]);
	return f.dot;
}, true);

// a spawn(5) body of /mob/living/silicon/pai/proc/Initialize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/pai/proc/Initialize: spawn at modules/mob/living/silicon/pai/pai.dm:102", function* (f: Frame, _P: Value, newcardloc: Value, AS: Value, AC: Value, AR: Value, AL: Value, ALM: Value) {
	f.vars = () => [_P, newcardloc, AS, AC, AR, AL, ALM];
	rt.setFv(f, "ownjob", rt.sv(f, "pda"), "pAI Messenger");
	rt.setFv(f, "owner", rt.sv(f, "pda"), fmt("＀", [live(f.src)]));
	rt.setFv(f, "name", rt.sv(f, "pda"), add(add(add(rt.fv(f, "owner", rt.sv(f, "pda")), " ("), rt.fv(f, "ownjob", rt.sv(f, "pda"))), ")"));
	return null;
});

// /mob/living/silicon/pai/proc/make_laws  (code/modules/mob/living/silicon/pai/pai.dm:124)
rt.def("/mob/living/silicon/pai/proc/make_laws", function make_laws(f: Frame) {
	rt.setSv(f, "laws", rt.new_(f, T("/datum/ai_laws/pai"), []));
	return 1;
});

// /mob/living/silicon/pai/proc/Login  (code/modules/mob/living/silicon/pai/pai.dm:128)  may sleep
rt.def("/mob/living/silicon/pai/proc/Login", function* Login(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.op(f, "BrowseResource", [], [live(f.usr), rt.rsc("html/paigrid.png"), null], false);
	if (!truthy(rt.sv(f, "client"))) return f.dot;
	rt.setFv(f, "perspective", rt.sv(f, "client"), 1);
	if (truthy(rt.sv(f, "holoform"))) {
		rt.setFv(f, "eye", rt.sv(f, "client"), live(f.src));
	} else {
		rt.setFv(f, "eye", rt.sv(f, "client"), rt.sv(f, "card"));
	}
	return f.dot;
}, true);

// /mob/living/silicon/pai/proc/Stat  (code/modules/mob/living/silicon/pai/pai.dm:138)  may sleep
rt.def("/mob/living/silicon/pai/proc/Stat", function* Stat(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	if (!truthy(rt.sv(f, "stat"))) {
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Emitter Integrity: ＀", [multiply(rt.sv(f, "emitterhealth"), divide(100, rt.sv(f, "emittermaxhealth")))])]);
	} else {
		yield* g.call(f, P("/proc/stat"), null, [null, "Systems nonfunctional"]);
	}
	return f.dot;
}, true);

rt.type(157, "/datum/action/innate/pai", "/datum/action/innate", {
	P: null,
	name: "PAI Action",
});

// /datum/action/innate/pai/proc/Trigger  (code/modules/mob/living/silicon/pai/pai.dm:167)
rt.def("/datum/action/innate/pai/proc/Trigger", function Trigger(f: Frame) {
	if (!truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/silicon/pai")) ? 1 : 0))) {
		return 0;
	}
	rt.setSv(f, "P", rt.sv(f, "owner"));
	return f.dot;
});

rt.type(158, "/datum/action/innate/pai/shell", "/datum/action/innate/pai", {
	name: "Toggle Holoform",
	button_icon_state: "pai_holoform",
	background_icon_state: "bg_tech",
});

// /datum/action/innate/pai/shell/proc/Trigger  (code/modules/mob/living/silicon/pai/pai.dm:177)  may sleep
rt.def("/datum/action/innate/pai/shell/proc/Trigger", function* Trigger(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "holoform", rt.sv(f, "P")))) {
		yield* g.callName(f, rt.sv(f, "P"), "fold_in", [0]);
	} else {
		yield* g.callName(f, rt.sv(f, "P"), "fold_out", []);
	}
	return f.dot;
}, true);

rt.type(159, "/datum/action/innate/pai/chassis", "/datum/action/innate/pai", {
	name: "Holochassis Appearence Composite",
	button_icon_state: "pai_chassis",
	background_icon_state: "bg_tech",
});

// /datum/action/innate/pai/chassis/proc/Trigger  (code/modules/mob/living/silicon/pai/pai.dm:189)  may sleep
rt.def("/datum/action/innate/pai/chassis/proc/Trigger", function* Trigger(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "P"), "choose_chassis", []);
	return f.dot;
}, true);

rt.type(160, "/datum/action/innate/pai/rest", "/datum/action/innate/pai", {
	name: "Rest",
	button_icon_state: "pai_rest",
	background_icon_state: "bg_tech",
});

// /datum/action/innate/pai/rest/proc/Trigger  (code/modules/mob/living/silicon/pai/pai.dm:198)  may sleep
rt.def("/datum/action/innate/pai/rest/proc/Trigger", function* Trigger(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "P"), "lay_down", []);
	return f.dot;
}, true);

rt.type(161, "/datum/action/innate/pai/light", "/datum/action/innate/pai", {
	name: "Toggle Integrated Lights",
	button_icon_state: "emp",
	background_icon_state: "bg_tech",
});

// /datum/action/innate/pai/light/proc/Trigger  (code/modules/mob/living/silicon/pai/pai.dm:206)
rt.def("/datum/action/innate/pai/light/proc/Trigger", function Trigger(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callName(f, rt.sv(f, "P"), "toggle_integrated_light", []);
	return f.dot;
});

// /mob/living/silicon/pai/proc/Process_Spacemove  (code/modules/mob/living/silicon/pai/pai.dm:210)  may sleep
rt.def("/mob/living/silicon/pai/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) {
		rt.setSv(f, "slowdown", 2);
		return 1;
	}
	rt.setSv(f, "slowdown", rt.initial(f, live(f.src), "slowdown"));
	return 1;
}, true, { args: ["movement_dir"] });

// /mob/living/silicon/pai/proc/examine  (code/modules/mob/living/silicon/pai/pai.dm:218)
rt.def("/mob/living/silicon/pai/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("A personal AI in holochassis mode. Its master ID string seems to be ＀.", [rt.sv(f, "master")])]);
	return f.dot;
}, false, { args: ["user"] });

// /mob/living/silicon/pai/proc/Life  (code/modules/mob/living/silicon/pai/pai.dm:222)  may sleep
rt.def("/mob/living/silicon/pai/proc/Life", function* Life(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "cable"))) {
		if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "cable")])), 1)) {
			yield* g.callName(f, (_T = rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0)), "visible_message", [fmt("<span class='warning'>＀ rapidly retracts back into its spool.</span>", [rt.fv(f, "cable", live(f.src))]), "<span class='italics'>You hear a click and the sound of wire spooling rapidly.</span>"]);
			yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "cable", live(f.src))]);
			rt.setSv(f, "cable", null);
		}
	}
	rt.setSv(f, "silent", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "silent"), 1), 0])));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { waitfor: false });

// /mob/living/silicon/pai/proc/updatehealth  (code/modules/mob/living/silicon/pai/pai.dm:234)
rt.def("/mob/living/silicon/pai/proc/updatehealth", function updatehealth(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	rt.setSv(f, "health", subtract(subtract(rt.sv(f, "maxHealth"), rt.callSrc(f, "getBruteLoss", [])), rt.callSrc(f, "getFireLoss", [])));
	rt.callSrc(f, "update_stat", []);
	return f.dot;
});

// /mob/living/silicon/pai/proc/process  (code/modules/mob/living/silicon/pai/pai.dm:241)
rt.def("/mob/living/silicon/pai/proc/process", function process(f: Frame) {
	rt.setSv(f, "emitterhealth", rt.call(f, P("/proc/max"), null, [-50, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "emitterhealth"), rt.sv(f, "emitterregen")), rt.sv(f, "emittermaxhealth")])]));
	rt.setSv(f, "hit_slowdown", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "hit_slowdown"), 1), 100])]));
	return f.dot;
}, false, { waitfor: false });
