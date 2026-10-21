// From code/modules/spells/spell_types/mind_transfer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11329, "/obj/effect/proc_holder/spell/targeted/mind_transfer", "/obj/effect/proc_holder/spell/targeted", {
	protected_roles: null,
	unconscious_amount_caster: 400,
	unconscious_amount_victim: 400,
	name: "Mind Transfer",
	desc: "This spell allows the user to switch bodies with a target.",
	school: "transmutation",
	charge_max: 600,
	clothes_req: 0,
	invocation: "GIN'YU CAPAN",
	invocation_type: "whisper",
	range: 1,
	cooldown_min: 200,
	action_icon_state: "mindswap",
});

// /obj/effect/proc_holder/spell/targeted/mind_transfer/proc/cast  (code/modules/spells/spell_types/mind_transfer.dm:24)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/mind_transfer/proc/cast", function* cast(f: Frame, targets: Value, user: Value, distanceoverride: Value) {
	let target: Value = null, t_He: Value = null, t_is: Value = null, victim: Value = null, caster: Value = null, ghost: Value = null;
	f.vars = () => [targets, user, distanceoverride, target, t_He, t_is, victim, caster, ghost];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy(rt.len(f, live(targets)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>No mind found!</span>"]);
		return live(f.dot);
	}
	if (rt.gt(rt.len(f, live(targets)), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Too many minds! You're not a hive damnit!</span>"]);
		return live(f.dot);
	}
	target = rt.index(live(targets), 1);
	t_He = (yield* g.callName(f, live(target), "p_they", [1]));
	t_is = (yield* g.callName(f, live(target), "p_are", []));
	if ((!truthy((rt.isIn(f, live(target), (yield* g.call(f, P("/proc/oview"), null, [rt.sv(f, "range")]))) ? 1 : 0)) && !truthy(live(distanceoverride)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ ＀ too far away!</span>", [live(t_He), live(t_is)])]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This creature is too powerful to control!</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "stat", live(target)), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You don't particularly want to be dead!</span>"]);
		return live(f.dot);
	}
	if ((!truthy(rt.fv(f, "key", live(target))) || !truthy(rt.fv(f, "mind", live(target))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ appear＀ to be catatonic! Not even magic can affect ＀ vacant mind.</span>", [live(t_He), (yield* g.callName(f, live(target), "p_s", [])), (yield* g.callName(f, live(target), "p_their", []))])]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "suiciding", live(user)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You're killing yourself! You can't concentrate enough to do this!</span>"]);
		return live(f.dot);
	}
	if ((truthy((rt.isIn(f, rt.gv(f, "special_role", rt.fv(f, "mind", live(target))), rt.sv(f, "protected_roles")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/cmptext"), null, [(yield* g.call(f, P("/proc/copytext"), null, [rt.fv(f, "key", live(target)), 1, 2])), "@"]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ mind is resisting your spell!</span>", [(yield* g.callName(f, live(target), "p_their", [1]))])]);
		return live(f.dot);
	}
	victim = live(target);
	caster = live(user);
	ghost = (yield* g.callName(f, live(victim), "ghostize", [0]));
	yield* g.callName(f, rt.fv(f, "mind", live(caster)), "transfer_to", [live(victim)]);
	yield* g.callName(f, rt.fv(f, "mind", live(ghost)), "transfer_to", [live(caster)]);
	if (truthy(rt.fv(f, "key", live(ghost)))) {
		rt.setFv(f, "key", live(caster), rt.fv(f, "key", live(ghost)));
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(ghost)]);
	yield* g.callName(f, live(caster), "Unconscious", [rt.sv(f, "unconscious_amount_caster")]);
	yield* g.callName(f, live(victim), "Unconscious", [rt.sv(f, "unconscious_amount_victim")]);
	rt.op(f, "Output", [], [live(caster), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/magic/mandswap.ogg")]))], false);
	rt.op(f, "Output", [], [live(victim), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/magic/mandswap.ogg")]))], false);
	return f.dot;
}, true);
