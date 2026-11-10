// Based on /tg/station's code/modules/spells/spell_types/voice_of_god.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { g } = rt;


rt.type(11385, "/obj/effect/proc_holder/spell/voice_of_god", "/obj/effect/proc_holder/spell", {
	command: null,
	cooldown_mod: 1,
	power_mod: 1,
	spans: null,
	speech_sound: rt.rsc("sound/magic/clockwork/invoke_general.ogg"),
	charge_max: 1200,
	cooldown_min: 0,
	level_max: 1,
	clothes_req: 0,
	action_icon_state: "voice_of_god",
	name: "Voice of God",
	desc: "Speak with an incredibly compelling voice, forcing listeners to obey your commands.",
});

// voice_of_god.dm:16
rt.def("/obj/effect/proc_holder/spell/voice_of_god/proc/can_cast", function can_cast(f: Frame, user: Value) {
	user ??= f.usr;
	if (!user.can_speak()) {
		to_chat(user, "<span class='warning'>You are unable to speak!</span>");
		return 0;
	}
	return 1;
});

// voice_of_god.dm:22
rt.def("/obj/effect/proc_holder/spell/voice_of_god/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	user ??= f.usr;
	yield* this.perform({ user: user });
	return f.dot;
}, true);

// voice_of_god.dm:24
rt.def("/obj/effect/proc_holder/spell/voice_of_god/proc/perform", function* perform(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = f.usr;
	}
	this.command = (yield* g.op(f, "Prompt", [2], [null, "Command", "Speak with the Voice of God", f.args[2], null]));
	if (!this || this.gc_destroyed || !f.args[2] || f.args[2].gc_destroyed) {
		return f.dot;
	}
	if (!this.command) {
		yield* this.revert_cast(f.args[2]);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["targets", "recharge", "user"] });

// voice_of_god.dm:33
rt.def("/obj/effect/proc_holder/spell/voice_of_god/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let cooldown: Value = null;
	user ??= f.usr;
	yield* user.say(uppertext(this.command), { spans: this.spans, sanitize: 0 });
	playsound(rt.getStep(f, user, 0), this.speech_sound, 300, 1, 5);
	this.charge_max = (cooldown = (yield* voice_of_god(this.command, user, this.spans, { base_multiplier: this.power_mod }))) * this.cooldown_mod;
	return f.dot;
}, true);

rt.type(11386, "/obj/effect/proc_holder/spell/voice_of_god/clown", "/obj/effect/proc_holder/spell/voice_of_god", {
	power_mod: 0.1,
	cooldown_mod: 0.5,
	spans: null,
	speech_sound: rt.rsc("sound/spookoween/scary_horn2.ogg"),
	name: "Voice of Clown",
	desc: "Speak with an incredibly funny voice, startling people into obeying you for a brief moment.",
});

// voice_of_god.dm:43
rt.def("/obj/effect/proc_holder/spell/voice_of_god/clown/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spans = list("clown");
	return f.dot;
});
