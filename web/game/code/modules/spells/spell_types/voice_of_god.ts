// From code/modules/spells/spell_types/voice_of_god.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/effect/proc_holder/spell/voice_of_god/proc/can_cast  (code/modules/spells/spell_types/voice_of_god.dm:16)
rt.def("/obj/effect/proc_holder/spell/voice_of_god/proc/can_cast", function can_cast(f: Frame, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy(rt.callName(f, live(user), "can_speak", []))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You are unable to speak!</span>"]);
		return 0;
	}
	return 1;
});

// /obj/effect/proc_holder/spell/voice_of_god/proc/choose_targets  (code/modules/spells/spell_types/voice_of_god.dm:22)  may sleep
rt.def("/obj/effect/proc_holder/spell/voice_of_god/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = live(f.usr);
	}
	yield* g.callSrc(f, "perform", ["user", live(user)], rt.Args.Named);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/voice_of_god/proc/perform  (code/modules/spells/spell_types/voice_of_god.dm:24)  may sleep
rt.def("/obj/effect/proc_holder/spell/voice_of_god/proc/perform", function* perform(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = live(f.usr);
	}
	rt.setSv(f, "command", (yield* g.op(f, "Prompt", [2], [null, "Command", "Speak with the Voice of God", live(f.args[2]), null])));
	if (((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || (!truthy(live(f.args[2])) || truthy(rt.fv(f, "gc_destroyed", live(f.args[2])))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "command"))) {
		yield* g.srcCall(f, "revert_cast", live(f.args[2]));
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["targets", "recharge", "user"] });

// /obj/effect/proc_holder/spell/voice_of_god/proc/cast  (code/modules/spells/spell_types/voice_of_god.dm:33)  may sleep
rt.def("/obj/effect/proc_holder/spell/voice_of_god/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let cooldown: Value = null;
	f.vars = () => [targets, user, cooldown];
	if (live(user) === null) {
		user = live(f.usr);
	}
	yield* g.callName(f, live(user), "say", [null, (yield* g.call(f, P("/proc/uppertext"), null, [rt.sv(f, "command")])), "spans", rt.sv(f, "spans"), "sanitize", 0], rt.Args.Named);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.sv(f, "speech_sound"), 300, 1, 5]);
	rt.setSv(f, "charge_max", multiply((cooldown = (yield* g.call(f, P("/proc/voice_of_god"), null, [null, rt.sv(f, "command"), null, live(user), null, rt.sv(f, "spans"), "base_multiplier", rt.sv(f, "power_mod")], rt.Args.Named))), rt.sv(f, "cooldown_mod")));
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

// /obj/effect/proc_holder/spell/voice_of_god/clown/proc/<init>  (code/modules/spells/spell_types/voice_of_god.dm:43)
rt.def("/obj/effect/proc_holder/spell/voice_of_god/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spans", rt.list("clown"));
	return f.dot;
});
