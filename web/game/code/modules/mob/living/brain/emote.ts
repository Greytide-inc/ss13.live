// Based on /tg/station's code/modules/mob/living/brain/emote.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(525, "/datum/emote/brain", "/datum/emote", {
	mob_type_blacklist_typecache: null,
	mob_type_allowed_typecache: null,
});

// emote.dm:3
rt.def("/datum/emote/brain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_blacklist_typecache = list();

	this.mob_type_allowed_typecache = list(T("/mob/living/brain"));
	return f.dot;
});

// emote.dm:6
rt.def("/datum/emote/brain/proc/can_run_emote", function can_run_emote(f: Frame, user: Value) {
	let B: Value = null;
	f.dot = parent_proc();
	if (!(!rt.istype((B = user), T("/mob/living/brain")) || !(B.container && rt.istype(B.container, T("/obj/item/device/mmi"))))) return f.dot;
	return 0;
}, false);
