// Based on /tg/station's code/game/objects/items/devices/megaphone.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { fmt } = rt;


rt.type(9263, "/obj/item/device/megaphone", "/obj/item/device", {
	spamcheck: 0,
	emagged: 0,
	voicespan: null,
	name: "megaphone",
	desc: "A device used to project your voice. Loudly.",
	icon_state: "megaphone",
	item_state: "radio",
	w_class: 2,
	siemens_coefficient: 1,
});

// megaphone.dm:10
rt.def("/obj/item/device/megaphone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.voicespan = list("command_headset");
	return f.dot;
});

// megaphone.dm:13
rt.def("/obj/item/device/megaphone/proc/get_held_item_speechspans", function get_held_item_speechspans(f: Frame, user: Value) {
	if (this.spamcheck > rt.worldTime(f)) {
		to_chat(user, fmt("<span class='warning'>＄！ needs to recharge!</span>", [this]));
	} else {
		playsound(this.loc, rt.rsc("sound/items/megaphone.ogg"), 100, 0, 1);
		this.spamcheck = rt.worldTime(f) + 50;
		return this.voicespan;
	}
	return f.dot;
});

// megaphone.dm:21
rt.def("/obj/item/device/megaphone/proc/emag_act", function emag_act(f: Frame, user: Value) {
	to_chat(user, fmt("<span class='warning'>You overload ％！'s voice synthesizer.</span>", [this]));
	this.emagged = 1;
	this.voicespan = list("reallybig", "userdanger");
	return f.dot;
});

rt.type(9267, "/obj/item/device/megaphone/clown", "/obj/item/device/megaphone", {
	voicespan: null,
	name: "clown's megaphone",
	desc: "Something that should not exist.",
	icon_state: "megaphone-clown",
});

// megaphone.dm:41
rt.def("/obj/item/device/megaphone/clown/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.voicespan = list("clown");
	return f.dot;
});
