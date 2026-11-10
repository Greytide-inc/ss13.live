// Based on /tg/station's code/modules/mob/living/silicon/robot/emote.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(531, "/datum/emote/silicon", "/datum/emote", {
	emote_type: 2,
	mob_type_allowed_typecache: null,
});

// emote.dm:2
rt.def("/datum/emote/silicon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living/silicon"));
	return f.dot;
});

rt.type(428, "/datum/emote/sound/silicon", "/datum/emote/sound", {
	emote_type: 2,
	mob_type_allowed_typecache: null,
});

// emote.dm:6
rt.def("/datum/emote/sound/silicon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living/silicon"));
	return f.dot;
});

// emote.dm:66
rt.def("/mob/living/silicon/robot/verb/powerwarn", function powerwarn(f: Frame) {
	if (this.stat != 0) return f.dot;
	if (!this.cell || !this.cell.charge) {
		this.visible_message(`The power warning light on <span class='name'>${this}</span> flashes urgently.`, "You announce you are operating in low power mode.");
		playsound(this.loc, rt.rsc("sound/machines/buzz-two.ogg"), 50, 0);
	} else {
		to_chat(this, "<span class='warning'>You can only use this emote when you're out of charge.</span>");
	}
	return f.dot;
}, false, { verb: { name: "Power Warning", category: "Robot Commands" } });
