// Based on /tg/station's code/datums/dog_fashion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(399, "/datum/dog_fashion", "/datum", {
	name: null,
	desc: null,
	emote_see: null,
	emote_hear: null,
	speak: null,
	speak_emote: null,
	icon_file: null,
	obj_icon_state: null,
	obj_alpha: null,
	obj_color: null,
});

// dog_fashion.dm:17
rt.def("/datum/dog_fashion/proc/New", function New(f: Frame, M: Value) {
	this.name = replacetext(this.name, "REAL_NAME", M.real_name);
	this.desc = replacetext(this.desc, "NAME", this.name);
	return f.dot;
});

// dog_fashion.dm:35
rt.def("/datum/dog_fashion/proc/get_overlay", function get_overlay(f: Frame, dir: Value) {
	let corgI: Value = null;
	if (!(this.icon_file && this.obj_icon_state)) return f.dot;
	(corgI = image(this.icon_file, this.obj_icon_state, { dir: dir })).alpha = this.obj_alpha;
	corgI.color = this.obj_color;
	return corgI;
});

rt.type(404, "/datum/dog_fashion/head/kitty", "/datum/dog_fashion/head", {
	name: "Runtime",
	emote_see: null,
	emote_hear: null,
	speak: null,
	desc: "It's a cute little kitty-cat! ... wait ... what the hell?",
});

// dog_fashion.dm:64
rt.def("/datum/dog_fashion/head/kitty/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.emote_see = list("coughs up a furball", "stretches");

	this.emote_hear = list("purrs");
	this.speak = list("Purrr", "Meow!", "MAOOOOOW!", "HISSSSS", "MEEEEEEW");
	return f.dot;
});

rt.type(409, "/datum/dog_fashion/head/pirate", "/datum/dog_fashion/head", {
	name: "Pirate-title Pirate-name",
	desc: "Yaarghh!! Thar' be a scurvy dog!",
	emote_see: null,
	emote_hear: null,
	speak: null,
});

// dog_fashion.dm:98
rt.def("/datum/dog_fashion/head/pirate/proc/New", function New(f: Frame, M: Value) {
	parent_proc();
	this.name = `${pick("Ol'", "Scurvy", "Black", "Rum", "Gammy", "Bloody", "Gangrene", "Death", "Long-John")} ${pick("kibble", "leg", "beard", "tooth", "poop-deck", "Threepwood", "Le Chuck", "corsair", "Silver", "Crusoe")}`;
	return f.dot;
}, false);

rt.type(410, "/datum/dog_fashion/head/ushanka", "/datum/dog_fashion/head", {
	name: "Communist-title Realname",
	desc: "A follower of Karl Barx.",
	emote_see: null,
});

// dog_fashion.dm:107
rt.def("/datum/dog_fashion/head/ushanka/proc/New", function New(f: Frame, M: Value) {
	parent_proc();
	this.name = `${pick("Comrade", "Commissar", "Glorious Leader")} ${M.real_name}`;
	return f.dot;
}, false);

rt.type(419, "/datum/dog_fashion/head/sombrero", "/datum/dog_fashion/head", {
	name: "Segnor REAL_NAME",
	desc: "You must respect Elder Dogname",
});

// dog_fashion.dm:157
rt.def("/datum/dog_fashion/head/sombrero/proc/New", function New(f: Frame, M: Value) {
	parent_proc();
	this.desc = `You must respect Elder ${M.real_name}.`;
	return f.dot;
}, false);
