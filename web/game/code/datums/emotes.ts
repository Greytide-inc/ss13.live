// From code/datums/emotes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(425, "/datum/emote", "/datum", {
	key: "",
	key_third_person: "",
	message: "",
	message_mime: "",
	message_alien: "",
	message_larva: "",
	message_robot: "",
	message_AI: "",
	message_monkey: "",
	message_simple: "",
	message_param: "",
	emote_type: 1,
	restraint_check: 0,
	muzzle_ignore: 0,
	mob_type_allowed_typecache: null,
	mob_type_blacklist_typecache: null,
	stat_allowed: 0,
}, { global: { emote_list: 634 } });

// /datum/emote/proc/New  (code/datums/emotes.dm:27)
rt.def("/datum/emote/proc/New", function New(f: Frame) {
	if (truthy(rt.sv(f, "key_third_person"))) {
		rt.setAt(rt.gl("emote_list"), rt.sv(f, "key_third_person"), live(f.src));
	}
	rt.setSv(f, "mob_type_allowed_typecache", rt.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "mob_type_allowed_typecache")]));
	rt.setSv(f, "mob_type_blacklist_typecache", rt.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "mob_type_blacklist_typecache")]));
	return f.dot;
});

// /datum/emote/proc/run_emote  (code/datums/emotes.dm:32)  may sleep
rt.def("/datum/emote/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value, type_override: Value) {
	let msg: Value = null, L: Value = null, I: Value = null, M: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [user, params, type_override, msg, L, I, M, _T, $e];
	f.dot = 1;
	if (!truthy((yield* g.srcCall(f, "can_run_emote", live(user))))) {
		return 0;
	}
	msg = (yield* g.srcCall(f, "select_message_type", live(user)));
	if ((truthy(live(params)) && truthy(rt.sv(f, "message_param")))) {
		msg = (yield* g.srcCall(f, "select_param", live(user), live(params)));
	}
	msg = (yield* g.srcCall(f, "replace_pronoun", live(user), live(msg)));
	L = live(user);
	I = null;
	rt.forList(f, 0, rt.fv(f, "implants", live(L)), T("/obj/item/weapon/implant"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(I), "trigger", [rt.sv(f, "key"), live(L)]);
	}
	rt.endFor(f, 0);
	if (!truthy(live(msg))) {
		return 0;
	}
	yield* g.callName(f, live(user), "log_message", [live(msg), "Emote log"]);
	msg = add(fmt("<b>＀</b> ", [live(user)]), live(msg));
	M = null;
	rt.forList(f, 0, rt.gl("dead_mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((!truthy(rt.fv(f, "client", live(M))) || truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0)))) {
			continue;
		}
		_T = rt.getStep(f, live(f.src), 0);
		if ((((isEqual(rt.fv(f, "stat", live(M)), 2) && truthy(rt.fv(f, "client", live(M)))) && truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), 8))) && !truthy((rt.isIn(f, live(M), (yield* g.call(f, P("/proc/viewers"), null, [live(_T), null]))) ? 1 : 0)))) {
			yield* g.callName(f, live(M), "show_message", [live(msg)]);
		}
	}
	rt.endFor(f, 0);
	if (isEqual(rt.sv(f, "emote_type"), 2)) {
		yield* g.callName(f, live(user), "audible_message", [live(msg)]);
	} else {
		yield* g.callName(f, live(user), "visible_message", [live(msg)]);
	}
	yield* g.call(f, P("/proc/log_emote"), null, [fmt("＀ : ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(msg)])]);
	return f.dot;
}, true);

// /datum/emote/proc/replace_pronoun  (code/datums/emotes.dm:64)
rt.def("/datum/emote/proc/replace_pronoun", function replace_pronoun(f: Frame, user: Value, message: Value) {
	f.vars = () => [message];
	if (truthy(rt.call(f, P("/proc/findtext"), null, [live(message), "their"]))) {
		message = rt.call(f, P("/proc/replacetext"), null, [live(message), "their", rt.callName(f, live(user), "p_their", [])]);
	}
	if (truthy(rt.call(f, P("/proc/findtext"), null, [live(message), "them"]))) {
		message = rt.call(f, P("/proc/replacetext"), null, [live(message), "them", rt.callName(f, live(user), "p_them", [])]);
	}
	if (truthy(rt.call(f, P("/proc/findtext"), null, [live(message), "%s"]))) {
		message = rt.call(f, P("/proc/replacetext"), null, [live(message), "%s", rt.callName(f, live(user), "p_s", [])]);
	}
	return live(message);
});

// /datum/emote/proc/select_message_type  (code/datums/emotes.dm:73)
rt.def("/datum/emote/proc/select_message_type", function select_message_type(f: Frame, user: Value) {
	f.dot = rt.sv(f, "message");
	if (((!truthy(rt.sv(f, "muzzle_ignore")) && truthy(rt.callName(f, live(user), "is_muzzled", []))) && isEqual(rt.sv(f, "emote_type"), 2))) {
		return fmt("makes a ＀noise.", [rt.op(f, "PickUnweighted", [3], ["strong ", "weak ", ""])]);
	}
	if (((truthy(rt.fv(f, "mind", live(user))) && truthy(rt.gv(f, "miming", rt.fv(f, "mind", live(user))))) && truthy(rt.sv(f, "message_mime")))) {
		f.dot = rt.sv(f, "message_mime");
	}
	if ((truthy((rt.istype(live(user), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0)) && truthy(rt.sv(f, "message_alien")))) {
		f.dot = rt.sv(f, "message_alien");
	} else {
		if ((truthy((rt.istype(live(user), T("/mob/living/carbon/alien/larva")) ? 1 : 0)) && truthy(rt.sv(f, "message_larva")))) {
			f.dot = rt.sv(f, "message_larva");
		} else {
			if ((truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0)) && truthy(rt.sv(f, "message_robot")))) {
				f.dot = rt.sv(f, "message_robot");
			} else {
				if ((truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0)) && truthy(rt.sv(f, "message_AI")))) {
					f.dot = rt.sv(f, "message_AI");
				} else {
					if ((truthy((rt.istype(live(user), T("/mob/living/carbon/monkey")) ? 1 : 0)) && truthy(rt.sv(f, "message_monkey")))) {
						f.dot = rt.sv(f, "message_monkey");
					} else {
						if (!(truthy((rt.istype(live(user), T("/mob/living/simple_animal")) ? 1 : 0)) && truthy(rt.sv(f, "message_simple")))) return f.dot;
						f.dot = rt.sv(f, "message_simple");
					}
				}
			}
		}
	}
	return f.dot;
});

// /datum/emote/proc/select_param  (code/datums/emotes.dm:92)
rt.def("/datum/emote/proc/select_param", function select_param(f: Frame, user: Value, params: Value) {
	return rt.call(f, P("/proc/replacetext"), null, [rt.sv(f, "message_param"), "%t", live(params)]);
});

// /datum/emote/proc/can_run_emote  (code/datums/emotes.dm:96)
rt.def("/datum/emote/proc/can_run_emote", function can_run_emote(f: Frame, user: Value, help_check: Value) {
	f.dot = 1;
	if (!truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(user), rt.sv(f, "mob_type_allowed_typecache")]))) {
		return 0;
	}
	if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(user), rt.sv(f, "mob_type_blacklist_typecache")]))) {
		return 0;
	}
	if (truthy(live(help_check))) return f.dot;
	if ((rt.gt(rt.fv(f, "stat", live(user)), rt.sv(f, "stat_allowed")) || truthy(rt.bitAnd(rt.fv(f, "status_flags", live(user)), 8192)))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "restraint_check")) && truthy(rt.callName(f, live(user), "restrained", [])))) {
		return 0;
	}
	if (!(truthy(rt.fv(f, "reagents", live(user))) && truthy(rt.callName(f, rt.fv(f, "reagents", live(user)), "has_reagent", ["mimesbane"])))) return f.dot;
	return 0;
});

rt.type(426, "/datum/emote/sound", "/datum/emote", {
	sound: null,
	vary: 0,
	mob_type_allowed_typecache: null,
});

// /datum/emote/sound/proc/<init>  (code/datums/emotes.dm:112)
rt.def("/datum/emote/sound/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mob_type_allowed_typecache", rt.list(T("/mob/living/brain"), T("/mob/living/silicon")));
	return f.dot;
});

// /datum/emote/sound/proc/run_emote  (code/datums/emotes.dm:115)  may sleep
rt.def("/datum/emote/sound/proc/run_emote", function* run_emote(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[0])), rt.sv(f, "sound"), 50, rt.sv(f, "vary")]);
	return f.dot;
}, true, { args: ["user", "params"] });
