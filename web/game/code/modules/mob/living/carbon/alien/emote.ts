// From code/modules/mob/living/carbon/alien/emote.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(521, "/datum/emote/living/alien", "/datum/emote/living", {
	mob_type_allowed_typecache: null,
});

// /datum/emote/living/alien/proc/<init>  (code/modules/mob/living/carbon/alien/emote.dm:2)
rt.def("/datum/emote/living/alien/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mob_type_allowed_typecache", rt.list(T("/mob/living/carbon/alien")));
	return f.dot;
});

rt.type(523, "/datum/emote/living/alien/hiss", "/datum/emote/living/alien", {
	key: "hiss",
	key_third_person: "hisses",
	message_alien: "hisses.",
	message_larva: "hisses softly.",
});

// /datum/emote/living/alien/hiss/proc/run_emote  (code/modules/mob/living/carbon/alien/emote.dm:16)  may sleep
rt.def("/datum/emote/living/alien/hiss/proc/run_emote", function* run_emote(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0)))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[0])), "hiss", 40, 1, 1]);
	return f.dot;
}, true, { args: ["user", "params"] });

rt.type(524, "/datum/emote/living/alien/roar", "/datum/emote/living/alien", {
	key: "roar",
	key_third_person: "roars",
	message_alien: "roars",
	message_larva: "softly roars",
	emote_type: 2,
});

// /datum/emote/living/alien/roar/proc/run_emote  (code/modules/mob/living/carbon/alien/emote.dm:28)  may sleep
rt.def("/datum/emote/living/alien/roar/proc/run_emote", function* run_emote(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0)))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[0])), rt.rsc("sound/voice/hiss5.ogg"), 40, 1, 1]);
	return f.dot;
}, true, { args: ["user", "params"] });
