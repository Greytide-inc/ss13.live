// From code/modules/mob/living/emote.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/proc/emote  (code/modules/mob/living/emote.dm:3)  may sleep
rt.def("/mob/living/proc/emote", function* emote(f: Frame, act: Value, m_type: Value, message: Value) {
	let param: Value = null, custom_param: Value = null, E: Value = null;
	f.vars = () => [act, m_type, message, param, custom_param, E];
	if (live(m_type) === null) {
		m_type = null;
	}
	if (live(message) === null) {
		message = null;
	}
	act = (yield* g.call(f, P("/proc/lowertext"), null, [live(act)]));
	param = live(message);
	if (truthy((custom_param = (yield* g.call(f, P("/proc/findchar"), null, [live(act), " "]))))) {
		param = (yield* g.call(f, P("/proc/copytext"), null, [live(act), add(live(custom_param), 1), add(rt.length(live(act)), 1)]));
		act = (yield* g.call(f, P("/proc/copytext"), null, [live(act), 1, live(custom_param)]));
	}
	E = null;
	if (!truthy((E = rt.index(rt.gl("emote_list"), live(act))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>Unusable emote '＀'. Say *help for a list.</span>", [live(act)])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(E), "run_emote", [live(f.src), live(param), live(m_type)]);
	return f.dot;
}, true);

rt.type(436, "/datum/emote/living", "/datum/emote", {
	mob_type_allowed_typecache: null,
	mob_type_blacklist_typecache: null,
});

// /datum/emote/living/proc/<init>  (code/modules/mob/living/emote.dm:19)
rt.def("/datum/emote/living/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mob_type_allowed_typecache", rt.list(T("/mob/living")));
	$0 = $0;
	rt.setSv(f, "mob_type_blacklist_typecache", rt.list(T("/mob/living/simple_animal/slime"), T("/mob/living/brain")));
	return f.dot;
});

rt.type(443, "/datum/emote/living/collapse", "/datum/emote/living", {
	key: "collapse",
	key_third_person: "collapses",
	message: "collapses!",
	emote_type: 2,
});

// /datum/emote/living/collapse/proc/run_emote  (code/modules/mob/living/emote.dm:64)  may sleep
rt.def("/datum/emote/living/collapse/proc/run_emote", function* run_emote(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (L = live(f.args[0])), "Unconscious", [40]);
	return f.dot;
}, true, { args: ["user", "params"] });

rt.type(446, "/datum/emote/living/deathgasp", "/datum/emote/living", {
	key: "deathgasp",
	key_third_person: "deathgasps",
	message: "seizes up and falls limp, their eyes dead and lifeless...",
	message_robot: "shudders violently for a moment before falling still, its eyes slowly darkening.",
	message_AI: "lets out a flurry of sparks, its screen flickering as its systems slowly halt.",
	message_alien: "lets out a waning guttural screech, green blood bubbling from its maw...",
	message_larva: "lets out a sickly hiss of air and falls limply to the floor...",
	message_monkey: "lets out a faint chimper as it collapses and stops moving...",
	message_simple: "stops moving...",
	stat_allowed: 1,
});

// /datum/emote/living/deathgasp/proc/run_emote  (code/modules/mob/living/emote.dm:94)  may sleep
rt.def("/datum/emote/living/deathgasp/proc/run_emote", function* run_emote(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if ((truthy((rt.istype((S = live(f.args[0])), T("/mob/living/simple_animal")) ? 1 : 0)) && truthy(rt.fv(f, "deathmessage", live(S))))) {
		rt.setSv(f, "message_simple", rt.fv(f, "deathmessage", live(S)));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "message_simple", rt.initial(f, live(f.src), "message_simple"));
	if (!(truthy(live(f.dot)) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0)))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[0])), rt.rsc("sound/voice/hiss6.ogg"), 80, 1, 1]);
	return f.dot;
}, true, { args: ["user", "params"] });

rt.type(448, "/datum/emote/living/faint", "/datum/emote/living", {
	key: "faint",
	key_third_person: "faints",
	message: "faints.",
});

// /datum/emote/living/faint/proc/run_emote  (code/modules/mob/living/emote.dm:113)  may sleep
rt.def("/datum/emote/living/faint/proc/run_emote", function* run_emote(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (L = live(f.args[0])), "SetSleeping", [200]);
	return f.dot;
}, true, { args: ["user", "params"] });

rt.type(449, "/datum/emote/living/flap", "/datum/emote/living", {
	wing_time: 20,
	key: "flap",
	key_third_person: "flaps",
	message: "flaps their wings.",
});

// /datum/emote/living/flap/proc/run_emote  (code/modules/mob/living/emote.dm:125)  may sleep
rt.def("/datum/emote/living/flap/proc/run_emote", function* run_emote(f: Frame) {
	let H: Value = null, open: Value = null;
	let $0: any, $1: any;
	f.vars = () => [H, open, $0, $1];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	H = live(f.args[0]);
	open = 0;
	if (isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "wings"), "None")) return f.dot;
	if (truthy((rt.isIn(f, "wingsopen", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
		open = 1;
		yield* g.callName(f, live(H), "CloseWings", []);
	} else {
		yield* g.callName(f, live(H), "OpenWings", []);
	}
	$0 = live(H);
	if (truthy(live(open))) {
		$1 = P("/mob/living/carbon/human/proc/OpenWings");
	} else {
		$1 = P("/mob/living/carbon/human/proc/CloseWings");
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [$0, $1])), rt.sv(f, "wing_time")]);
	return f.dot;
}, true, { args: ["user", "params"] });

rt.type(451, "/datum/emote/living/flip", "/datum/emote/living", {
	key: "flip",
	key_third_person: "flips",
	restraint_check: 1,
});

// /datum/emote/living/flip/proc/run_emote  (code/modules/mob/living/emote.dm:149)  may sleep
rt.def("/datum/emote/living/flip/proc/run_emote", function* run_emote(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "SpinAnimation", [7, 1]);
	return f.dot;
}, true, { args: ["user", "params"] });

rt.type(481, "/datum/emote/living/surrender", "/datum/emote/living", {
	key: "surrender",
	key_third_person: "surrenders",
	message: "puts their hands on their head and falls to the ground, they surrender%s!",
	emote_type: 2,
});

// /datum/emote/living/surrender/proc/run_emote  (code/modules/mob/living/emote.dm:333)  may sleep
rt.def("/datum/emote/living/surrender/proc/run_emote", function* run_emote(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (L = live(f.args[0])), "Knockdown", [200]);
	return f.dot;
}, true, { args: ["user", "params"] });

rt.type(490, "/datum/emote/living/custom", "/datum/emote/living", {
	key: "me",
	key_third_person: "custom",
	message: null,
});

// /datum/emote/living/custom/proc/check_invalid  (code/modules/mob/living/emote.dm:386)
rt.def("/datum/emote/living/custom/proc/check_invalid", function check_invalid(f: Frame, user: Value, input: Value) {
	f.dot = 1;
	if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(input), 1, 5]), "says")) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Invalid emote.</span>"]);
	} else {
		if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(input), 1, 9]), "exclaims")) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Invalid emote.</span>"]);
		} else {
			if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(input), 1, 6]), "yells")) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Invalid emote.</span>"]);
			} else {
				if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(input), 1, 5]), "asks")) {
					rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Invalid emote.</span>"]);
				} else {
					f.dot = 0;
				}
			}
		}
	}
	return f.dot;
});

// /datum/emote/living/custom/proc/run_emote  (code/modules/mob/living/emote.dm:398)  may sleep
rt.def("/datum/emote/living/custom/proc/run_emote", function* run_emote(f: Frame) {
	let custom_emote: Value = null, type: Value = null;
	let $0: any;
	f.vars = () => [custom_emote, type, $0];
	if (live(f.args[2]) === null) {
		f.args[2] = null;
	}
	if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(f.args[0]), "emote"])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "You cannot send custom emotes (banned)."]);
		return 0;
	} else {
		if ((truthy(rt.fv(f, "client", live(f.args[0]))) && truthy(rt.bitAnd(rt.gv(f, "muted", rt.gv(f, "prefs", rt.fv(f, "client", live(f.args[0])))), 1)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "You cannot send IC messages (muted)."]);
			return 0;
		} else {
			if (!truthy(live(f.args[1]))) {
				if ((truthy((custom_emote = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], [null, null, null, "Choose an emote to display.", null]))])), 1, 1024])))) && !truthy((yield* g.srcCall(f, "check_invalid", live(f.args[0]), live(custom_emote)))))) {
					$0 = (type = (yield* g.op(f, "Prompt", [1], [null, null, null, "Is this a visible or hearable emote?", rt.list("Visible", "Hearable")])));
					if ($0 === "Visible") {
						rt.setSv(f, "emote_type", 1);
					} else if ($0 === "Hearable") {
						rt.setSv(f, "emote_type", 2);
					} else {
						yield* g.call(f, P("/proc/alert"), null, ["Unable to use this emote, must be either hearable or visible."]);
						return live(f.dot);
					}
					rt.setSv(f, "message", live(custom_emote));
				}
			} else {
				rt.setSv(f, "message", live(f.args[1]));
				if (truthy(live(f.args[2]))) {
					rt.setSv(f, "emote_type", live(f.args[2]));
				}
			}
		}
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "message", null);
	rt.setSv(f, "emote_type", 1);
	return f.dot;
}, true, { args: ["user", "params", "type_override"] });

rt.type(491, "/datum/emote/living/help", "/datum/emote/living", {
	key: "help",
});

// /datum/emote/living/help/proc/run_emote  (code/modules/mob/living/emote.dm:432)  may sleep
rt.def("/datum/emote/living/help/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	let keys: Value = null, message: Value = null, E: Value = null, emote_list: Value = null, e: Value = null, emote: Value = null;
	let $e: any;
	f.vars = () => [user, params, keys, message, E, emote_list, e, emote, $e];
	keys = rt.list();
	message = rt.list("Available emotes, you can use them with say \"*emote\": ");
	E = null;
	emote_list = rt.gl("emote_list");
	e = null;
	rt.forList(f, 0, live(emote_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		e = $e;
		if (truthy((rt.isIn(f, live(e), live(keys)) ? 1 : 0))) {
			continue;
		}
		if (truthy((yield* g.callName(f, (E = rt.index(live(emote_list), live(e))), "can_run_emote", [live(user), 1])))) {
			keys = rt.modify(live(keys), rt.fv(f, "key", live(E)), add);
		}
	}
	rt.endFor(f, 0);
	keys = (yield* g.call(f, P("/proc/sortList"), null, [live(keys)]));
	emote = null;
	rt.forList(f, 0, live(keys));
	while (($e = rt.next(f, 0)) !== undefined) {
		emote = $e;
		if (rt.gt(rt.length(live(message)), 1)) {
			message = rt.modify(live(message), fmt(", ＀", [live(emote)]), add);
		} else {
			message = rt.modify(live(message), fmt("＀", [live(emote)]), add);
		}
	}
	rt.endFor(f, 0);
	message = (yield* g.call(f, P("/proc/jointext"), null, [(message = rt.modify(live(message), ".", add)), ""]));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), live(message)]);
	return f.dot;
}, true);

rt.type(492, "/datum/emote/living/spin", "/datum/emote/living", {
	key: "spin",
	key_third_person: "spins",
	message: "spins around dizzily!",
});

// /datum/emote/living/spin/proc/run_emote  (code/modules/mob/living/emote.dm:471)  may sleep
rt.def("/datum/emote/living/spin/proc/run_emote", function* run_emote(f: Frame) {
	let R: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [R, M, $e];
	yield* g.callName(f, live(f.args[0]), "spin", [20, 1]);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "buckled_mobs", (R = live(f.args[0]))))) {
			M = null;
			rt.forList(f, 0, rt.fv(f, "buckled_mobs", live(R)), T("/mob"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if (truthy(rt.fv(f, "riding_datum", live(R)))) {
					yield* g.callName(f, rt.fv(f, "riding_datum", live(R)), "force_dismount", [live(M)]);
				} else {
					yield* g.callName(f, live(R), "unbuckle_all_mobs", []);
				}
			}
			rt.endFor(f, 0);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });
