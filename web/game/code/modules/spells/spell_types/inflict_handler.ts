// From code/modules/spells/spell_types/inflict_handler.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11322, "/obj/effect/proc_holder/spell/targeted/inflict_handler", "/obj/effect/proc_holder/spell/targeted", {
	amt_knockdown: 0,
	amt_unconscious: 0,
	amt_stun: 0,
	amt_dam_fire: 0,
	amt_dam_brute: 0,
	amt_dam_oxy: 0,
	amt_dam_tox: 0,
	amt_eye_blind: 0,
	amt_eye_blurry: 0,
	destroys: "none",
	summon_type: null,
	name: "Inflict Handler",
	desc: "This spell blinds and/or destroys/damages/heals and/or knockdowns/stuns the target.",
});

// /obj/effect/proc_holder/spell/targeted/inflict_handler/proc/cast  (code/modules/spells/spell_types/inflict_handler.dm:24)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/inflict_handler/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null;
	let $0: any, $e: any;
	f.vars = () => [targets, user, target, $0, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	target = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		yield* g.call(f, P("/proc/playsound"), null, [live(target), rt.sv(f, "sound"), 50, 1]);
		$0 = rt.sv(f, "destroys");
		if ($0 === "gib") {
			yield* g.callName(f, live(target), "gib", []);
		} else if ($0 === "disintegrate") {
			yield* g.callName(f, live(target), "dust", []);
		}
		if (!truthy(live(target))) {
			continue;
		}
		yield* g.callName(f, live(target), "adjustBruteLoss", [rt.sv(f, "amt_dam_brute")]);
		yield* g.callName(f, live(target), "adjustFireLoss", [rt.sv(f, "amt_dam_fire")]);
		yield* g.callName(f, live(target), "adjustToxLoss", [rt.sv(f, "amt_dam_tox")]);
		yield* g.callName(f, live(target), "adjustOxyLoss", [rt.sv(f, "amt_dam_oxy")]);
		yield* g.callName(f, live(target), "Knockdown", [rt.sv(f, "amt_knockdown")]);
		yield* g.callName(f, live(target), "Unconscious", [rt.sv(f, "amt_unconscious")]);
		yield* g.callName(f, live(target), "Stun", [rt.sv(f, "amt_stun")]);
		yield* g.callName(f, live(target), "blind_eyes", [rt.sv(f, "amt_eye_blind")]);
		yield* g.callName(f, live(target), "blur_eyes", [rt.sv(f, "amt_eye_blurry")]);
		if (truthy(rt.sv(f, "summon_type"))) {
			yield* g.new_(f, rt.sv(f, "summon_type"), [rt.fv(f, "loc", live(target)), live(target)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
