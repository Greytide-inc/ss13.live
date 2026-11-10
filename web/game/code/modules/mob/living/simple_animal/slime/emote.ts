// Based on /tg/station's code/modules/mob/living/simple_animal/slime/emote.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(533, "/datum/emote/slime", "/datum/emote", {
	mob_type_blacklist_typecache: null,
	mob_type_allowed_typecache: rt.typePath("/mob/living/simple_animal/slime"),
});

// emote.dm:3
rt.def("/datum/emote/slime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_blacklist_typecache = list();
	return f.dot;
});

rt.type(538, "/datum/emote/slime/mood", "/datum/emote/slime", {
	mood: null,
	key: "moodnone",
});

// emote.dm:30
rt.def("/datum/emote/slime/mood/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	let S: Value = null;
	f.dot = (yield* parent_proc());
	(S = user).mood = this.mood;
	yield* S.regenerate_icons();
	return f.dot;
}, true);
