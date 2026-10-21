// From code/modules/mob/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/verb/typing_indicator  (code/modules/mob/say.dm:13)  may sleep
rt.def("/client/verb/typing_indicator", function* typing_indicator(f: Frame, on: Value) {
	f.vars = () => [on];
	if (!truthy(rt.sv(f, "mob"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "mob"), "set_typing_indicator", [live(on)]);
	return f.dot;
}, true, { hidden: true, verb: { name: "typing-indicator", category: "OOC" }, argTypes: [{ type: 32 }] });

// /mob/proc/set_typing_indicator  (code/modules/mob/say.dm:17)  may sleep
rt.def("/mob/proc/set_typing_indicator", function* set_typing_indicator(f: Frame, on: Value) {
	f.vars = () => [on];
	if (truthy(rt.sv(f, "typing_timer"))) {
		yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "typing_timer")]);
		rt.setSv(f, "typing_timer", null);
	}
	if (!truthy(live(on))) {
		if (truthy(rt.sv(f, "typing_overlay"))) {
			yield* g.srcCall(f, "cut_overlay", rt.sv(f, "typing_overlay"));
			rt.setSv(f, "typing_overlay", null);
		}
		return live(f.dot);
	}
	if ((isEqual(rt.sv(f, "stat"), 2) && !truthy((rt.istype(live(f.src), T("/mob/dead/observer")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "typing_overlay"))) {
		rt.setSv(f, "typing_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/talk.dmi"), "default0", 4.099999904632568])));
		yield* g.srcCall(f, "add_overlay", rt.sv(f, "typing_overlay"));
	}
	rt.setSv(f, "typing_timer", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/proc/set_typing_indicator"), 0])), 300, 8])));
	return f.dot;
}, true);

// /mob/verb/say_verb  (code/modules/mob/say.dm:34)  may sleep
rt.def("/mob/verb/say_verb", function* say_verb(f: Frame, message: Value) {
	f.vars = () => [message];
	yield* g.srcCall(f, "set_typing_indicator", 0);
	if (truthy(rt.gl("say_disabled"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Speech is currently admin-disabled.</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "say", [live(message)]);
	return f.dot;
}, true, { verb: { name: "Say", category: "IC" }, argTypes: [{ type: 2 }] });

// /mob/verb/whisper_verb  (code/modules/mob/say.dm:44)  may sleep
rt.def("/mob/verb/whisper_verb", function* whisper_verb(f: Frame, message: Value) {
	f.vars = () => [message];
	yield* g.srcCall(f, "set_typing_indicator", 0);
	if (truthy(rt.gl("say_disabled"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Speech is currently admin-disabled.</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "whisper", live(message));
	return f.dot;
}, true, { verb: { name: "Whisper", category: "IC" }, argTypes: [{ type: 2 }] });

// /mob/proc/whisper  (code/modules/mob/say.dm:51)  may sleep
rt.def("/mob/proc/whisper", function* whisper(f: Frame, message: Value, language: Value) {
	f.vars = () => [message, language];
	if (live(language) === null) {
		language = null;
	}
	yield* g.srcCall(f, "say", live(message), live(language));
	return f.dot;
}, true);

// /mob/verb/me_verb  (code/modules/mob/say.dm:56)  may sleep
rt.def("/mob/verb/me_verb", function* me_verb(f: Frame, message: Value) {
	f.vars = () => [message];
	yield* g.srcCall(f, "set_typing_indicator", 0);
	if (truthy(rt.gl("say_disabled"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Speech is currently admin-disabled.</span>"]);
		return live(f.dot);
	}
	message = (yield* g.call(f, P("/proc/trim"), null, [(yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [live(message)])), 1, 1024]))]));
	yield* g.callName(f, live(f.usr), "emote", ["me", 1, live(message)]);
	return f.dot;
}, true, { verb: { name: "Me", category: "IC" }, argTypes: [{ type: 2 }] });

// /mob/proc/say_dead  (code/modules/mob/say.dm:67)  may sleep
rt.def("/mob/proc/say_dead", function* say_dead(f: Frame, message: Value) {
	let name: Value = null, alt_name: Value = null, O: Value = null, K: Value = null, rendered: Value = null;
	f.vars = () => [message, name, alt_name, O, K, rendered];
	name = rt.sv(f, "real_name");
	alt_name = "";
	if (truthy(rt.gl("say_disabled"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Speech is currently admin-disabled.</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(f.src), "OOC"])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You have been banned from deadchat.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "client", live(f.src)))) {
		if (truthy(rt.bitAnd(rt.gv(f, "muted", rt.gv(f, "prefs", rt.fv(f, "client", live(f.src)))), 16))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You cannot talk in deadchat (muted).</span>"]);
			return live(f.dot);
		}
		if (truthy((yield* g.callName(f, rt.fv(f, "client", live(f.src)), "handle_spam_prevention", [live(message), 16])))) {
			return live(f.dot);
		}
	}
	O = live(f.src);
	if ((truthy((rt.istype(live(f.src), T("/mob/dead/observer")) ? 1 : 0)) && truthy(rt.fv(f, "deadchat_name", live(O))))) {
		name = fmt("＀", [rt.fv(f, "deadchat_name", live(O))]);
	} else {
		if ((truthy(rt.sv(f, "mind")) && truthy(rt.fv(f, "name", rt.sv(f, "mind"))))) {
			name = fmt("＀", [rt.fv(f, "name", rt.sv(f, "mind"))]);
		} else {
			name = rt.sv(f, "real_name");
		}
		if (!isEqual(live(name), rt.sv(f, "real_name"))) {
			alt_name = fmt(" (died as ＀)", [rt.sv(f, "real_name")]);
		}
	}
	K = null;
	if (truthy(rt.sv(f, "key"))) {
		K = rt.fv(f, "key", live(f.src));
	}
	message = (yield* g.callName(f, live(f.src), "say_quote", [live(message), (yield* g.srcCall(f, "get_spans"))]));
	rendered = fmt("<span class='game deadsay'><span class='prefix'>DEAD:</span> <span class='name'>＀</span>＀ <span class='message'>＀</span></span>", [live(name), live(alt_name), live(message)]);
	yield* g.call(f, P("/proc/deadchat_broadcast"), null, [null, live(rendered), "follow_target", live(f.src), "speaker_key", live(K)], rt.Args.Named);
	return f.dot;
}, true);
