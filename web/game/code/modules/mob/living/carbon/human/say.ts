// Based on /tg/station's code/modules/mob/living/carbon/human/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// say.dm:2
rt.def("/mob/living/carbon/human/proc/say_mod", function say_mod(f: Frame, input: Value, message_mode: Value) {
	this.verb_say = this.dna.species.say_mod;
	if (this.slurring) {
		return "slurs";
	}
	f.dot = parent_proc();
	return f.dot;
}, false);

// say.dm:9
rt.def("/mob/living/carbon/human/proc/treat_message", function treat_message(f: Frame, message: Value) {
	let D: Value = null, temp_message: Value = null, pick_list: Value = null, i: Value = null, H: Value = null;
	message = this.dna.species.handle_speech(message, this);
	if (rt.len(f, this.viruses)) {
		for (D of each(this.viruses, T("/datum/disease/pierrot_throat"))) {
			temp_message = splittext(message, " ");
			pick_list = list();
			i = 1;
			while (i <= rt.len(f, temp_message)) {
				pick_list += i;
				i++;
			}
			i = 1;
			while (i <= D.stage && i <= rt.len(f, temp_message)) {
				blk71: {
					if (prob(3 * D.stage)) {
						H = pick(pick_list);
						if (findtext(rt.index(temp_message, H), "*") || findtext(rt.index(temp_message, H), ";") || findtext(rt.index(temp_message, H), ":")) {
							break blk71;
						}
						rt.setAt(temp_message, H, "HONK");
						pick_list -= H;
					}
					message = jointext(temp_message, " ");
				}
				i++;
			}
		}
	}
	message = parent_proc(message);
	return (message = this.dna.mutations_say_mods(message));
});

// say.dm:28
rt.def("/mob/living/carbon/human/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(rt.bitOr(parent_proc(), this.dna.mutations_get_spans()), this.dna.species_get_spans());
});

// say.dm:31
rt.def("/mob/living/carbon/human/proc/GetVoice", function GetVoice(f: Frame) {
	let V: Value = null, idcard: Value = null;
	if (rt.istype(this.wear_mask, T("/obj/item/clothing/mask/chameleon"))) {
		if ((V = this.wear_mask).vchange && this.wear_id) {
			if (rt.istype((idcard = this.wear_id.GetID()), T("/obj/item/weapon/card/id"))) {
				return idcard.registered_name;
			}
			return this.real_name;
		} else {
			return this.real_name;
		}
	}
	if (this.mind && this.mind.changeling && this.mind.changeling.mimicing) {
		return this.mind.changeling.mimicing;
	}
	if (this.GetSpecialVoice()) {
		return this.GetSpecialVoice();
	}
	return this.real_name;
});

// say.dm:48
rt.def("/mob/living/carbon/human/proc/IsVocal", function IsVocal(f: Frame) {
	if (!this.dna || !this.dna.species) {
		return f.dot;
	}
	if (!rt.isIn(f, NOBREATH, this.dna.species.species_traits) && !this.getorganslot("lungs")) {
		return 0;
	}
	if (this.mind) {
		return (!this.mind.miming ? 1 : 0);
	}
	return 1;
});

// say.dm:59
rt.def("/mob/living/carbon/human/proc/SetSpecialVoice", function SetSpecialVoice(f: Frame, new_voice: Value) {
	if (new_voice) {
		this.special_voice = new_voice;
	}
	return f.dot;
});

// say.dm:63
rt.def("/mob/living/carbon/human/proc/UnsetSpecialVoice", function UnsetSpecialVoice(f: Frame) {
	this.special_voice = "";
	return f.dot;
});

// say.dm:71
rt.def("/mob/living/carbon/human/proc/binarycheck", function binarycheck(f: Frame) {
	let dongle: Value = null;
	if (!this.ears) return f.dot;
	if (!rt.istype((dongle = this.ears), T("/obj/item/device/radio/headset"))) {
		return 0;
	}
	if (!dongle.translate_binary) return f.dot;
	return 1;
});

// say.dm:76
rt.def("/mob/living/carbon/human/proc/radio", function* radio(f: Frame, message: Value, message_mode: Value, spans: Value, language: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot != 0) {
		return f.dot;
	}
	if (message_mode === "headset") {
		if (this.ears) {
			yield* this.ears.talk_into(this, message, null, spans, language);
		}
		return 3;
	} else if (message_mode === "department") {
		if (this.ears) {
			yield* this.ears.talk_into(this, message, message_mode, spans, language);
		}
		return 3;
	}
	if (rt.isIn(f, message_mode, GLOB.radiochannels)) {
		if (this.ears) {
			yield* this.ears.talk_into(this, message, message_mode, spans, language);
			return 3;
		}
	}
	return 0;
}, true);

// say.dm:99
rt.def("/mob/living/carbon/human/proc/get_alt_name", function get_alt_name(f: Frame) {
	if (this.name == this.GetVoice()) return f.dot;
	return ` (as ${this.get_id_name("Unknown")})`;
});

// say.dm:103
rt.def("/mob/living/carbon/human/proc/forcesay", function* forcesay(f: Frame, append: Value) {
	let temp: Value = null, trimmed: Value = null;
	if (this.stat != 0) return f.dot;
	if (!this.client) return f.dot;
	let virgin: Value = 1;
	if (!(findtextEx((temp = (yield* winget(this.client, "input", "text"))), "Say \"", 1, 7) && rt.length(temp) > 5)) return f.dot;
	if (findtext(trim_left((temp = replacetext(temp, ";", ""))), ":", 6, 7)) {
		temp = copytext(trim_left(temp), 8);
		virgin = 0;
	}
	if (virgin) {
		temp = copytext(trim_left(temp), 6);
		virgin = 0;
	}
	while (findtext(trim_left(temp), ":", 1, 2)) {
		temp = copytext(trim_left(temp), 3);
	}
	if (findtext(temp, "*", 1, 2)) {
		return f.dot;
	}
	if (rt.length((trimmed = trim_left(temp)))) {
		if (append) {
			temp += pick(append);
		}
		yield* this.say(temp);
	}
	winset(this.client, "input", `text=${null}`);
	return f.dot;
}, true);
