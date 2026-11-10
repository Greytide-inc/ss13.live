// Based on /tg/station's code/modules/mob/living/carbon/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// say.dm:2
rt.def("/mob/living/carbon/proc/treat_message", function treat_message(f: Frame, message: Value) {
	let _T: Value = null, tongueless_lower: Value = null, tongueless_upper: Value = null;
	message = parent_proc(message);
	if (!(_T = this.getorganslot("tongue"))) {
		tongueless_lower = new_(T("/regex"), "[gdntke]+", "g");
		tongueless_upper = new_(T("/regex"), "[GDNTKE]+", "g");
		if (copytext(message, 1, 2) != "*") {
			message = tongueless_lower.Replace(message, pick("aa", "oo", "'"));
			message = tongueless_upper.Replace(message, pick("AA", "OO", "'"));
		}
	} else {
		message = _T.TongueSpeech(message);
	}
	if (this.wear_mask) {
		message = this.wear_mask.speechModification(message);
	}
	return message;
});

// say.dm:20
rt.def("/mob/living/carbon/proc/can_speak_vocal", function can_speak_vocal(f: Frame, message: Value) {
	if (this.silent) {
		return 0;
	}
	return parent_proc();
}, false);

// say.dm:23
rt.def("/mob/living/carbon/proc/get_spans", function get_spans(f: Frame) {
	let _T: Value = null, I: Value = null;
	f.dot = parent_proc();
	if (_T = this.getorganslot("tongue")) {
		(f.dot = rt.modify(f.dot, _T.get_spans(), rt.bitOr));
	}
	if (!(I = this.get_active_held_item())) return f.dot;
	(f.dot = rt.modify(f.dot, I.get_held_item_speechspans(this), rt.bitOr));
	return f.dot;
});

// say.dm:33
rt.def("/mob/living/carbon/proc/could_speak_in_language", function could_speak_in_language(f: Frame, dt: Value) {
	let _T: Value = null;
	if (_T = this.getorganslot("tongue")) {
		f.dot = _T.could_speak_in_language(dt);
	} else {
		f.dot = rt.bitAnd(rt.initial(f, dt, "flags"), TONGUELESS_SPEECH);
	}
	return f.dot;
});
