// Based on /tg/station's code/modules/mob/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// say.dm:13
rt.def("/client/verb/typing_indicator", function* typing_indicator(f: Frame, on: Value) {
	if (!this.mob) return f.dot;
	yield* this.mob.set_typing_indicator(on);
	return f.dot;
}, true, { hidden: true, verb: { name: "typing-indicator", category: "OOC" }, argTypes: [{ type: 32 }] });

// say.dm:17
rt.def("/mob/proc/set_typing_indicator", function* set_typing_indicator(f: Frame, on: Value) {
	if (this.typing_timer) {
		yield* deltimer(this.typing_timer);
		this.typing_timer = null;
	}
	if (!on) {
		if (this.typing_overlay) {
			this.cut_overlay(this.typing_overlay);
			this.typing_overlay = null;
		}
		return f.dot;
	}
	if (this.stat == 2 && !rt.istype(this, T("/mob/dead/observer"))) {
		return f.dot;
	}
	if (!this.typing_overlay) {
		this.typing_overlay = mutable_appearance(rt.rsc("icons/mob/talk.dmi"), "default0", 4.1);
		this.add_overlay(this.typing_overlay);
	}
	this.typing_timer = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/proc/set_typing_indicator"), 0)), 300, 8));
	return f.dot;
}, true);

// say.dm:34
rt.def("/mob/verb/say_verb", function* say_verb(f: Frame, message: Value) {
	yield* this.set_typing_indicator(0);
	if (GLOB.say_disabled) {
		to_chat(f.usr, "<span class='danger'>Speech is currently admin-disabled.</span>");
		return f.dot;
	}
	yield* f.usr.say(message);
	return f.dot;
}, true, { verb: { name: "Say", category: "IC" }, argTypes: [{ type: 2 }] });

// say.dm:44
rt.def("/mob/verb/whisper_verb", function* whisper_verb(f: Frame, message: Value) {
	yield* this.set_typing_indicator(0);
	if (GLOB.say_disabled) {
		to_chat(f.usr, "<span class='danger'>Speech is currently admin-disabled.</span>");
		return f.dot;
	}
	yield* this.whisper(message);
	return f.dot;
}, true, { verb: { name: "Whisper", category: "IC" }, argTypes: [{ type: 2 }] });

// say.dm:51
rt.def("/mob/proc/whisper", function* whisper(f: Frame, message: Value, language: Value) {
	yield* this.say(message, language);
	return f.dot;
}, true);

// say.dm:56
rt.def("/mob/verb/me_verb", function* me_verb(f: Frame, message: Value) {
	yield* this.set_typing_indicator(0);
	if (GLOB.say_disabled) {
		to_chat(f.usr, "<span class='danger'>Speech is currently admin-disabled.</span>");
		return f.dot;
	}
	message = trim(copytext(sanitize(message), 1, 1024));
	yield* f.usr.emote("me", 1, message);
	return f.dot;
}, true, { verb: { name: "Me", category: "IC" }, argTypes: [{ type: 2 }] });

// say.dm:67
rt.def("/mob/proc/say_dead", function* say_dead(f: Frame, message: Value) {
	let K: Value = null;
	let name: Value = this.real_name;
	let alt_name: Value = "";
	if (GLOB.say_disabled) {
		to_chat(f.usr, "<span class='danger'>Speech is currently admin-disabled.</span>");
		return f.dot;
	}
	if (jobban_isbanned(this, "OOC")) {
		to_chat(this, "<span class='danger'>You have been banned from deadchat.</span>");
		return f.dot;
	}
	if (this.client) {
		if (rt.bitAnd(this.client.prefs.muted, 16)) {
			to_chat(this, "<span class='danger'>You cannot talk in deadchat (muted).</span>");
			return f.dot;
		}
		if (this.client.handle_spam_prevention(message, 16)) {
			return f.dot;
		}
	}
	let O: Value = this;
	if (rt.istype(this, T("/mob/dead/observer")) && O.deadchat_name) {
		name = `${O.deadchat_name}`;
	} else {
		if (this.mind && this.mind.name) {
			name = `${this.mind.name}`;
		} else {
			name = this.real_name;
		}
		if (name != this.real_name) {
			alt_name = ` (died as ${this.real_name})`;
		}
	}
	if (this.key) {
		K = this.key;
	}
	message = this.say_quote(message, this.get_spans());
	let rendered: Value = `<span class='game deadsay'><span class='prefix'>DEAD:</span> <span class='name'>${name}</span>${alt_name} <span class='message'>${message}</span></span>`;
	yield* deadchat_broadcast(rendered, { follow_target: this, speaker_key: K });
	return f.dot;
}, true);
