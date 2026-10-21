// From code/modules/assembly/voice.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/device/assembly/voice/proc/<init>  (code/modules/assembly/voice.dm:5)
rt.def("/obj/item/device/assembly/voice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 50]));
	return f.dot;
});

// /obj/item/device/assembly/voice/proc/examine  (code/modules/assembly/voice.dm:21)
rt.def("/obj/item/device/assembly/voice/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Use a multitool to swap between \"inclusive\", \"exclusive\", \"recognizer\", and \"voice sensor\" mode.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/assembly/voice/proc/Hear  (code/modules/assembly/voice.dm:25)  may sleep
rt.def("/obj/item/device/assembly/voice/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	f.vars = () => [message, speaker, message_language, raw_message, radio_freq, spans, message_mode];
	if (isEqual(live(speaker), live(f.src))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "listening")) && !truthy(live(radio_freq)))) {
		yield* g.srcCall(f, "record_speech", live(speaker), live(raw_message), live(message_language));
	} else {
		if (!truthy((yield* g.srcCall(f, "check_activation", live(speaker), live(raw_message))))) return f.dot;
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/device/assembly/proc/pulse"), 0])), 10]);
	}
	return f.dot;
}, true);

// /obj/item/device/assembly/voice/proc/record_speech  (code/modules/assembly/voice.dm:35)  may sleep
rt.def("/obj/item/device/assembly/voice/proc/record_speech", function* record_speech(f: Frame, speaker: Value, raw_message: Value, message_language: Value) {
	let $0: any;
	f.vars = () => [speaker, raw_message, message_language, $0];
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		rt.setSv(f, "recorded", live(raw_message));
		rt.setSv(f, "listening", 0);
		yield* g.srcCall(f, "say", fmt("Activation message is '＀'.", [rt.sv(f, "recorded")]), live(message_language));
	} else if ($0 === 2) {
		rt.setSv(f, "recorded", live(raw_message));
		rt.setSv(f, "listening", 0);
		yield* g.srcCall(f, "say", fmt("Activation message is '＀'.", [rt.sv(f, "recorded")]), live(message_language));
	} else if ($0 === 3) {
		rt.setSv(f, "recorded", (yield* g.callName(f, live(speaker), "GetVoice", [])));
		rt.setSv(f, "listening", 0);
		yield* g.srcCall(f, "say", "Your voice pattern is saved.", live(message_language));
	} else if ($0 === 4) {
		if (!truthy(rt.length(live(raw_message)))) return f.dot;
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/device/assembly/proc/pulse"), 0])), 10]);
	}
	return f.dot;
}, true);

// /obj/item/device/assembly/voice/proc/check_activation  (code/modules/assembly/voice.dm:54)
rt.def("/obj/item/device/assembly/voice/proc/check_activation", function check_activation(f: Frame, speaker: Value, raw_message: Value) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = 0;
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		if (truthy(rt.call(f, P("/proc/findtext"), null, [live(raw_message), rt.sv(f, "recorded")]))) {
			f.dot = 1;
		}
	} else if ($0 === 2) {
		if (isEqual(live(raw_message), rt.sv(f, "recorded"))) {
			f.dot = 1;
		}
	} else if ($0 === 3) {
		if (isEqual(rt.callName(f, live(speaker), "GetVoice", []), rt.sv(f, "recorded"))) {
			f.dot = 1;
		}
	} else if ($0 === 4) {
		if (!truthy(rt.length(live(raw_message)))) return f.dot;
		f.dot = 1;
	}
	return f.dot;
});

// /obj/item/device/assembly/voice/proc/attackby  (code/modules/assembly/voice.dm:69)  may sleep
rt.def("/obj/item/device/assembly/voice/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		(rt.modSrcVar(f, "mode", rt.len(f, rt.gl("modes")), rt.modulus));
		rt.incSrcVar(f, "mode", 1, true);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("You set ＀ into a ＀ mode.", [live(f.src), rt.index(rt.gl("modes"), rt.sv(f, "mode"))])]);
		rt.setSv(f, "listening", 0);
		rt.setSv(f, "recorded", "");
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/device/assembly/voice/proc/activate  (code/modules/assembly/voice.dm:80)  may sleep
rt.def("/obj/item/device/assembly/voice/proc/activate", function* activate(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "secured"))) return f.dot;
	if (truthy(rt.sv(f, "holder"))) return f.dot;
	rt.setSv(f, "listening", (!truthy(rt.sv(f, "listening")) ? 1 : 0));
	if (truthy(rt.sv(f, "listening"))) {
		$0 = "Now";
	} else {
		$0 = "No longer";
	}
	yield* g.srcCall(f, "say", fmt("＀ recording input.", [$0]));
	return f.dot;
}, true);

// /obj/item/device/assembly/voice/proc/attack_self  (code/modules/assembly/voice.dm:85)  may sleep
rt.def("/obj/item/device/assembly/voice/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(live(user))) {
		return 0;
	}
	yield* g.srcCall(f, "activate");
	return 1;
}, true);

// /obj/item/device/assembly/voice/proc/toggle_secure  (code/modules/assembly/voice.dm:91)  may sleep
rt.def("/obj/item/device/assembly/voice/proc/toggle_secure", function* toggle_secure(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "listening", 0);
	return f.dot;
}, true);
