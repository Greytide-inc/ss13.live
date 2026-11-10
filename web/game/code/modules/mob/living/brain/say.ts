// Based on /tg/station's code/modules/mob/living/brain/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// say.dm:2
rt.def("/mob/living/brain/proc/say", function* say(f: Frame) {
	if (!(this.container && rt.istype(this.container, T("/obj/item/device/mmi")))) {
		return f.dot;
	} else {
		if (prob(this.emp_damage * 4)) {
			if (prob(10)) {
				return f.dot;
			} else {
				f.args[0] = Gibberish(f.args[0], this.emp_damage * 6);
			}
		}
		yield* parent_proc();
	}
	return f.dot;
}, true, { args: ["message", "language"] });

// say.dm:14
rt.def("/mob/living/brain/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(parent_proc(), "robot");
});

// say.dm:17
rt.def("/mob/living/brain/proc/radio", function* radio(f: Frame, message: Value, message_mode: Value, spans: Value, language: Value) {
	let R: Value = null;
	if (!(message_mode && rt.istype(this.container, T("/obj/item/device/mmi")))) return f.dot;
	if (!(R = this.container).radio) return f.dot;
	yield* R.radio.talk_into(this, message, null, this.get_spans(), language);
	return 3;
}, true);

// say.dm:27
rt.def("/mob/living/brain/proc/treat_message", function treat_message(f: Frame, message: Value) {
	return (message = capitalize(message));
});

// say.dm:31
rt.def("/mob/living/brain/proc/could_speak_in_language", function could_speak_in_language(f: Frame, dt: Value) {
	if (rt.istype(this.container, T("/obj/item/device/mmi/posibrain/soul_vessel"))) {
		f.dot = ispath(dt, T("/datum/language/ratvar"));
	} else {
		f.dot = parent_proc();
	}
	return f.dot;
}, false);
