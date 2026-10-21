// From code/modules/spells/spell_types/lightning.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11326, "/obj/effect/proc_holder/spell/targeted/tesla", "/obj/effect/proc_holder/spell/targeted", {
	ready: 0,
	Snd: null,
	random_target: 1,
	name: "Tesla Blast",
	desc: "Blast lightning at your foes!",
	charge_type: "recharge",
	charge_max: 300,
	clothes_req: 1,
	invocation: "UN'LTD P'WAH!",
	invocation_type: "shout",
	range: 7,
	cooldown_min: 30,
	selection_type: "view",
	action_icon_state: "lightning",
}, { global: { halo: 775 } });

// /obj/effect/proc_holder/spell/targeted/tesla/proc/Click  (code/modules/spells/spell_types/lightning.dm:20)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/tesla/proc/Click", function* Click(f: Frame) {
	if ((!truthy(rt.sv(f, "ready")) && truthy((yield* g.srcCall(f, "cast_check"))))) {
		yield* g.srcCall(f, "StartChargeup");
	}
	return 1;
}, true);

// /obj/effect/proc_holder/spell/targeted/tesla/proc/StartChargeup  (code/modules/spells/spell_types/lightning.dm:26)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/tesla/proc/StartChargeup", function* StartChargeup(f: Frame, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = live(f.usr);
	}
	rt.setSv(f, "ready", 1);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start gathering the power.</span>"]);
	rt.setSv(f, "Snd", (yield* g.new_(f, T("/sound"), [null, rt.rsc("sound/magic/lightning_chargeup.ogg"), "channel", 7], rt.Args.Named)));
	rt.setGl("halo", (rt.gl("halo") || (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/effects.dmi"), "electricity", 5000]))));
	yield* g.callName(f, live(user), "add_overlay", [rt.gl("halo")]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.sv(f, "Snd"), 50, 0]);
	if (truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(user), 100, 1])))) {
		if ((truthy(rt.sv(f, "ready")) && truthy((yield* g.callSrc(f, "cast_check", ["skipcharge", 1], rt.Args.Named))))) {
			yield* g.srcCall(f, "choose_targets");
		} else {
			yield* g.srcCall(f, "revert_cast", live(user), 0);
		}
	} else {
		yield* g.srcCall(f, "revert_cast", live(user), 0);
	}
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/targeted/tesla/proc/Reset  (code/modules/spells/spell_types/lightning.dm:41)
rt.def("/obj/effect/proc_holder/spell/targeted/tesla/proc/Reset", function Reset(f: Frame, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = live(f.usr);
	}
	rt.setSv(f, "ready", 0);
	rt.callName(f, live(user), "cut_overlay", [rt.gl("halo")]);
	return f.dot;
});

// /obj/effect/proc_holder/spell/targeted/tesla/proc/revert_cast  (code/modules/spells/spell_types/lightning.dm:45)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/tesla/proc/revert_cast", function* revert_cast(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = live(f.usr);
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (truthy(live(f.args[1]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>No target found in range.</span>"]);
	}
	yield* g.srcCall(f, "Reset", live(f.args[0]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user", "message"] });

// /obj/effect/proc_holder/spell/targeted/tesla/proc/cast  (code/modules/spells/spell_types/lightning.dm:51)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/tesla/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null;
	f.vars = () => [targets, user, target];
	if (live(user) === null) {
		user = live(f.usr);
	}
	rt.setSv(f, "ready", 0);
	target = rt.index(live(targets), 1);
	rt.setSv(f, "Snd", (yield* g.call(f, P("/proc/sound"), null, [null, null, "repeat", 0, "wait", 1, "channel", rt.fv(f, "channel", rt.sv(f, "Snd"))], rt.Args.Named)));
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.sv(f, "Snd"), 50, 0]);
	if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(target)])), rt.sv(f, "range"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>They are too far away!</span>"]);
		yield* g.srcCall(f, "Reset", live(user));
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/magic/lightningbolt.ogg"), 50, 1]);
	yield* g.callName(f, live(user), "Beam", [null, live(target), "icon_state", fmt("lightning＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 12]))]), "time", 5], rt.Args.Named);
	yield* g.srcCall(f, "Bolt", live(user), live(target), 30, 5, live(user));
	yield* g.srcCall(f, "Reset", live(user));
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/targeted/tesla/proc/Bolt  (code/modules/spells/spell_types/lightning.dm:66)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/tesla/proc/Bolt", function* Bolt(f: Frame, origin: Value, target: Value, bolt_energy: Value, bounces: Value, user: Value) {
	let current: Value = null, possible_targets: Value = null, M: Value = null, next: Value = null;
	let $e: any;
	f.vars = () => [origin, target, bolt_energy, bounces, user, current, possible_targets, M, next, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	yield* g.callName(f, live(origin), "Beam", [null, live(target), "icon_state", fmt("lightning＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 12]))]), "time", 5], rt.Args.Named);
	current = live(target);
	if (rt.lt(live(bounces), 1)) {
		yield* g.callName(f, live(current), "electrocute_act", [null, live(bolt_energy), null, "Lightning Bolt", "safety", 1], rt.Args.Named);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(current), 0), rt.rsc("sound/magic/lightningshock.ogg"), 50, 1, -1]);
	} else {
		yield* g.callName(f, live(current), "electrocute_act", [null, live(bolt_energy), null, "Lightning Bolt", "safety", 1], rt.Args.Named);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(current), 0), rt.rsc("sound/magic/lightningshock.ogg"), 50, 1, -1]);
		possible_targets = (yield* g.new_(f, T("/list"), []));
		M = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view_or_range"), null, [rt.sv(f, "range"), live(target), "view"])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if ((isEqual(live(user), live(M)) || (isEqual(live(target), live(M)) && truthy((yield* g.srcCall(f, "los_check", live(current), live(M))))))) {
				continue;
			}
			possible_targets = rt.modify(live(possible_targets), live(M), add);
		}
		rt.endFor(f, 0);
		if (!truthy(rt.len(f, live(possible_targets)))) {
			return live(f.dot);
		}
		if (!truthy((next = rt.op(f, "PickUnweighted", [1], [live(possible_targets)])))) return f.dot;
		yield* g.srcCall(f, "Bolt", live(current), live(next), (yield* g.call(f, P("/proc/max"), null, [subtract(live(bolt_energy), 5), 5])), subtract(live(bounces), 1), live(user));
	}
	return f.dot;
}, true);
