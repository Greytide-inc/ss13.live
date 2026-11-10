// Based on /tg/station's code/modules/mob/living/taste.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// taste.dm:11
rt.def("/mob/living/carbon/proc/get_taste_sensitivity", function get_taste_sensitivity(f: Frame) {
	let tongue: Value = null;
	if (rt.istype((tongue = this.getorganslot("tongue")), T("/obj/item/organ/tongue"))) {
		f.dot = tongue.taste_sensitivity;
	} else {
		f.dot = 101;
	}
	return f.dot;
});

// taste.dm:19
rt.def("/mob/living/proc/taste", function taste(f: Frame, from: Value) {
	if (!(this.last_taste_time + 50 < rt.worldTime(f))) return f.dot;
	let taste_sensitivity: Value = this.get_taste_sensitivity();
	let text_output: Value = from.generate_taste_message(taste_sensitivity);
	if (this.hallucination > 50 && prob(25)) {
		text_output = pick("spiders", "dreams", "nightmares", "the future", "the past", "victory", "defeat", "pain", "bliss", "revenge", "poison", "time", "space", "death", "life", "truth", "lies", "justice", "memory", "regrets", "your soul", "suffering", "music", "noise", "blood", "hunger", "the american way");
	}
	if (!(text_output != this.last_taste_text || this.last_taste_time + 100 < rt.worldTime(f))) return f.dot;
	to_chat(this, `<span class='notice'>You can taste ${text_output}.</span>`);
	this.last_taste_time = rt.worldTime(f);
	this.last_taste_text = text_output;
	return f.dot;
});
