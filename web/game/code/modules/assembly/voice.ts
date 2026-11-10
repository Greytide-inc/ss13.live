// Based on /tg/station's code/modules/assembly/voice.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9385, "/obj/item/device/assembly/voice", "/obj/item/device/assembly", {
	listening: 0,
	recorded: "",
	mode: 1,
	flags: 16,
	attachable: 1,
	verb_say: "beeps",
	verb_ask: "beeps",
	verb_exclaim: "beeps",
	name: "voice analyzer",
	desc: "A small electronic device able to record a voice sample, and send a signal when that sample is repeated.",
	icon_state: "voice",
	materials: null,
	origin_tech: "magnets=1;engineering=1",
}, { global: { modes: 738 } });

// voice.dm:5
rt.def("/obj/item/device/assembly/voice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 500, "$glass", 50]);
	return f.dot;
});

// voice.dm:21
rt.def("/obj/item/device/assembly/voice/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, "<span class='notice'>Use a multitool to swap between \"inclusive\", \"exclusive\", \"recognizer\", and \"voice sensor\" mode.</span>");
	return f.dot;
}, false);

// voice.dm:25
rt.def("/obj/item/device/assembly/voice/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	if (speaker == this) {
		return f.dot;
	}
	if (this.listening && !radio_freq) {
		yield* this.record_speech(speaker, raw_message, message_language);
	} else {
		if (!this.check_activation(speaker, raw_message)) return f.dot;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/device/assembly/proc/pulse"), 0)), 10);
	}
	return f.dot;
}, true);

// voice.dm:35
rt.def("/obj/item/device/assembly/voice/proc/record_speech", function* record_speech(f: Frame, speaker: Value, raw_message: Value, message_language: Value) {
	if (this.mode === 1) {
		this.recorded = raw_message;
		this.listening = 0;
		yield* this.say(`Activation message is '${this.recorded}'.`, message_language);
	} else if (this.mode === 2) {
		this.recorded = raw_message;
		this.listening = 0;
		yield* this.say(`Activation message is '${this.recorded}'.`, message_language);
	} else if (this.mode === 3) {
		this.recorded = speaker.GetVoice();
		this.listening = 0;
		yield* this.say("Your voice pattern is saved.", message_language);
	} else if (this.mode === 4) {
		if (!rt.length(raw_message)) return f.dot;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/device/assembly/proc/pulse"), 0)), 10);
	}
	return f.dot;
}, true);

// voice.dm:54
rt.def("/obj/item/device/assembly/voice/proc/check_activation", function check_activation(f: Frame, speaker: Value, raw_message: Value) {
	f.dot = 0;
	if (this.mode === 1) {
		if (findtext(raw_message, this.recorded)) {
			f.dot = 1;
		}
	} else if (this.mode === 2) {
		if (raw_message == this.recorded) {
			f.dot = 1;
		}
	} else if (this.mode === 3) {
		if (speaker.GetVoice() == this.recorded) {
			f.dot = 1;
		}
	} else if (this.mode === 4) {
		if (!rt.length(raw_message)) return f.dot;
		f.dot = 1;
	}
	return f.dot;
});

// voice.dm:69
rt.def("/obj/item/device/assembly/voice/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/device/multitool"))) {
		this.mode %= rt.len(f, GLOB.modes);
		this.mode++;
		to_chat(user, `You set ${this} into a ${rt.index(GLOB.modes, this.mode)} mode.`);
		this.listening = 0;
		this.recorded = "";
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// voice.dm:80
rt.def("/obj/item/device/assembly/voice/proc/activate", function* activate(f: Frame) {
	let $0: any;
	if (!this.secured) return f.dot;
	if (this.holder) return f.dot;
	this.listening = (!this.listening ? 1 : 0);
	if (this.listening) {
		$0 = "Now";
	} else {
		$0 = "No longer";
	}
	yield* this.say(`${$0} recording input.`);
	return f.dot;
}, true);

// voice.dm:85
rt.def("/obj/item/device/assembly/voice/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!user) {
		return 0;
	}
	yield* this.activate();
	return 1;
}, true);

// voice.dm:91
rt.def("/obj/item/device/assembly/voice/proc/toggle_secure", function* toggle_secure(f: Frame) {
	f.dot = (yield* parent_proc());
	this.listening = 0;
	return f.dot;
}, true);
