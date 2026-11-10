// Based on /tg/station's code/modules/mob/living/carbon/alien/emote.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(521, "/datum/emote/living/alien", "/datum/emote/living", {
	mob_type_allowed_typecache: null,
});

// emote.dm:2
rt.def("/datum/emote/living/alien/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living/carbon/alien"));
	return f.dot;
});

rt.type(523, "/datum/emote/living/alien/hiss", "/datum/emote/living/alien", {
	key: "hiss",
	key_third_person: "hisses",
	message_alien: "hisses.",
	message_larva: "hisses softly.",
});

// emote.dm:16
rt.def("/datum/emote/living/alien/hiss/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(user, T("/mob/living/carbon/alien/humanoid")))) return f.dot;
	playsound(user.loc, "hiss", 40, 1, 1);
	return f.dot;
}, true);

rt.type(524, "/datum/emote/living/alien/roar", "/datum/emote/living/alien", {
	key: "roar",
	key_third_person: "roars",
	message_alien: "roars",
	message_larva: "softly roars",
	emote_type: 2,
});

// emote.dm:28
rt.def("/datum/emote/living/alien/roar/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(user, T("/mob/living/carbon/alien/humanoid")))) return f.dot;
	playsound(user.loc, rt.rsc("sound/voice/hiss5.ogg"), 40, 1, 1);
	return f.dot;
}, true);
