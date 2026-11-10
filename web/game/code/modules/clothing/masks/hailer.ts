// Based on /tg/station's code/modules/clothing/masks/hailer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(8558, "/obj/item/clothing/mask/gas/sechailer", "/obj/item/clothing/mask/gas", {
	aggressiveness: 2,
	cooldown_special: null,
	recent_uses: 0,
	broken_hailer: 0,
	safety: 1,
	flags: 4104,
	name: "security gas mask",
	desc: "A standard issue Security gas mask with integrated 'Compli-o-nator 3000' device. Plays over a dozen pre-recorded compliance phrases designed to get scumbags to stand still whilst you taze them. Do not tamper with the device.",
	actions_types: null,
	icon_state: "sechailer",
	item_state: "sechailer",
	flags_inv: 640,
	w_class: 2,
	visor_flags: 4104,
	visor_flags_inv: 128,
	flags_cover: 8,
	visor_flags_cover: 8,
});

// hailer.dm:7
rt.def("/obj/item/clothing/mask/gas/sechailer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/halt"), T("/datum/action/item_action/adjust"));
	return f.dot;
});

rt.type(8559, "/obj/item/clothing/mask/gas/sechailer/swat", "/obj/item/clothing/mask/gas/sechailer", {
	aggressiveness: 3,
	name: "１SWAT mask",
	desc: "A close-fitting tactical mask with an especially aggressive Compli-o-nator 3000.",
	actions_types: null,
	icon_state: "swat",
	item_state: "swat",
	flags_inv: 992,
	visor_flags_inv: 0,
});

// hailer.dm:26
rt.def("/obj/item/clothing/mask/gas/sechailer/swat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/halt"));
	return f.dot;
});

rt.type(8560, "/obj/item/clothing/mask/gas/sechailer/cyborg", "/obj/item/clothing/mask/gas/sechailer", {
	aggressiveness: 1,
	name: "security hailer",
	desc: "A set of recognizable pre-recorded messages for cyborgs to use when apprehending criminals.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "taperecorder_idle",
	actions_types: null,
});

// hailer.dm:39
rt.def("/obj/item/clothing/mask/gas/sechailer/cyborg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/halt"));
	return f.dot;
});

// hailer.dm:42
rt.def("/obj/item/clothing/mask/gas/sechailer/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.aggressiveness === 1) {
			to_chat(user, "<span class='notice'>You set the restrictor to the middle position.</span>");
			this.aggressiveness = 2;
		} else if (this.aggressiveness === 2) {
			to_chat(user, "<span class='notice'>You set the restrictor to the last position.</span>");
			this.aggressiveness = 3;
		} else if (this.aggressiveness === 3) {
			to_chat(user, "<span class='notice'>You set the restrictor to the first position.</span>");
			this.aggressiveness = 1;
		} else if (this.aggressiveness === 4) {
			to_chat(user, "<span class='danger'>You adjust the restrictor but nothing happens, probably because it's broken.</span>");
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
		if (this.aggressiveness != 4) {
			to_chat(user, "<span class='danger'>You broke the restrictor!</span>");
			this.aggressiveness = 4;
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// hailer.dm:63
rt.def("/obj/item/clothing/mask/gas/sechailer/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	if (rt.istype(action, T("/datum/action/item_action/halt"))) {
		this.halt();
	} else {
		yield* this.adjustmask(user);
	}
	return f.dot;
}, true);

// hailer.dm:69
rt.def("/obj/item/clothing/mask/gas/sechailer/proc/attack_self", function attack_self(f: Frame) {
	this.halt();
	return f.dot;
});

// hailer.dm:73
rt.def("/obj/item/clothing/mask/gas/sechailer/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.safety) {
		this.safety = 0;
		to_chat(user, `<span class='warning'>You silently fry ${this}'s vocal circuit with the cryptographic sequencer.`);
	} else {
		return f.dot;
	}
	return f.dot;
});

// hailer.dm:81
rt.def("/obj/item/clothing/mask/gas/sechailer/verb/halt", function halt(f: Frame) {
	let phrase_text: Value = null, phrase_sound: Value = null;
	if (!rt.istype(f.usr, T("/mob/living"))) {
		return f.dot;
	}
	if (!this.can_use(f.usr)) {
		return f.dot;
	}
	if (this.broken_hailer) {
		to_chat(f.usr, fmt("<span class='warning'>＄！'s hailing system is broken.</span>", [this]));
		return f.dot;
	}
	let phrase: Value = 0;
	if (!(this.cooldown < rt.worldTime(f) - 30)) return f.dot;
	this.recent_uses++;
	if (this.cooldown_special < rt.worldTime(f) - 180) {
		this.recent_uses = rt.initial(f, this, "recent_uses");
	}
	if (this.recent_uses === 3) {
		to_chat(f.usr, fmt("<span class='warning'>＄！ is starting to heat up.</span>", [this]));
	} else if (this.recent_uses === 4) {
		to_chat(f.usr, fmt("<span class='userdanger'>＄！ is heating up dangerously from overuse!</span>", [this]));
	} else if (this.recent_uses === 5) {
		this.broken_hailer = 1;
		to_chat(f.usr, fmt("<span class='userdanger'>＄！'s power modulator overloads and breaks.</span>", [this]));
		return f.dot;
	}
	if (this.aggressiveness === 1) {
		phrase = rand(1, 5);
	} else if (this.aggressiveness === 2) {
		phrase = rand(1, 11);
	} else if (this.aggressiveness === 3) {
		phrase = rand(1, 18);
	} else if (this.aggressiveness === 4) {
		phrase = rand(12, 18);
	}
	if (!this.safety) {
		phrase_text = "FUCK YOUR CUNT YOU SHIT EATING COCKSTORM AND EAT A DONG FUCKING ASS RAMMING SHIT FUCK EAT PENISES IN YOUR FUCK FACE AND SHIT OUT ABORTIONS OF FUCK AND POO AND SHIT IN YOUR ASS YOU COCK FUCK SHIT MONKEY FUCK ASS WANKER FROM THE DEPTHS OF SHIT.";
		phrase_sound = "emag";
	} else if (phrase === 1) {
		phrase_text = "HALT! HALT! HALT!";
		phrase_sound = "halt";
	} else if (phrase === 2) {
		phrase_text = "Stop in the name of the Law.";
		phrase_sound = "bobby";
	} else if (phrase === 3) {
		phrase_text = "Compliance is in your best interest.";
		phrase_sound = "compliance";
	} else if (phrase === 4) {
		phrase_text = "Prepare for justice!";
		phrase_sound = "justice";
	} else if (phrase === 5) {
		phrase_text = "Running will only increase your sentence.";
		phrase_sound = "running";
	} else if (phrase === 6) {
		phrase_text = "Don't move, Creep!";
		phrase_sound = "dontmove";
	} else if (phrase === 7) {
		phrase_text = "Down on the floor, Creep!";
		phrase_sound = "floor";
	} else if (phrase === 8) {
		phrase_text = "Dead or alive you're coming with me.";
		phrase_sound = "robocop";
	} else if (phrase === 9) {
		phrase_text = "God made today for the crooks we could not catch yesterday.";
		phrase_sound = "god";
	} else if (phrase === 10) {
		phrase_text = "Freeze, Scum Bag!";
		phrase_sound = "freeze";
	} else if (phrase === 11) {
		phrase_text = "Stop right there, criminal scum!";
		phrase_sound = "imperial";
	} else if (phrase === 12) {
		phrase_text = "Stop or I'll bash you.";
		phrase_sound = "bash";
	} else if (phrase === 13) {
		phrase_text = "Go ahead, make my day.";
		phrase_sound = "harry";
	} else if (phrase === 14) {
		phrase_text = "Stop breaking the law, ass hole.";
		phrase_sound = "asshole";
	} else if (phrase === 15) {
		phrase_text = "You have the right to shut the fuck up.";
		phrase_sound = "stfu";
	} else if (phrase === 16) {
		phrase_text = "Shut up crime!";
		phrase_sound = "shutup";
	} else if (phrase === 17) {
		phrase_text = "Face the wrath of the golden bolt.";
		phrase_sound = "super";
	} else if (phrase === 18) {
		phrase_text = "I am, the LAW!";
		phrase_sound = "dredd";
	}
	f.usr.audible_message(`${f.usr}'s Compli-o-Nator: <font color='red' size='4'><b>${phrase_text}</b></font>`);
	playsound(this.loc, `sound/voice/complionator/${phrase_sound}.ogg`, 100, 0, 4);
	this.cooldown = rt.worldTime(f);
	this.cooldown_special = rt.worldTime(f);
	return f.dot;
}, false, { verb: { name: "HALT", category: "Object", src: 11 } });
