// Based on /tg/station's code/modules/spells/spell_types/mind_transfer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// mind_transfer.dm:24
rt.def("/obj/effect/proc_holder/spell/targeted/mind_transfer/proc/cast", function* cast(f: Frame, targets: Value, user: Value, distanceoverride: Value) {
	user ??= f.usr;
	if (!rt.len(f, targets)) {
		to_chat(user, "<span class='warning'>No mind found!</span>");
		return f.dot;
	}
	if (rt.len(f, targets) > 1) {
		to_chat(user, "<span class='warning'>Too many minds! You're not a hive damnit!</span>");
		return f.dot;
	}
	let target: Value = rt.index(targets, 1);
	let t_He: Value = target.p_they(1);
	let t_is: Value = target.p_are();
	if (!rt.isIn(f, target, oview(this.range)) && !distanceoverride) {
		to_chat(user, `<span class='warning'>${t_He} ${t_is} too far away!</span>`);
		return f.dot;
	}
	if (rt.istype(target, T("/mob/living/simple_animal/hostile/megafauna"))) {
		to_chat(user, "<span class='warning'>This creature is too powerful to control!</span>");
		return f.dot;
	}
	if (target.stat == 2) {
		to_chat(user, "<span class='warning'>You don't particularly want to be dead!</span>");
		return f.dot;
	}
	if (!target.key || !target.mind) {
		to_chat(user, `<span class='warning'>${t_He} appear${target.p_s()} to be catatonic! Not even magic can affect ${target.p_their()} vacant mind.</span>`);
		return f.dot;
	}
	if (user.suiciding) {
		to_chat(user, "<span class='warning'>You're killing yourself! You can't concentrate enough to do this!</span>");
		return f.dot;
	}
	if (rt.isIn(f, target.mind.special_role, this.protected_roles) || cmptext(copytext(target.key, 1, 2), "@")) {
		to_chat(user, `<span class='warning'>${target.p_their(1)} mind is resisting your spell!</span>`);
		return f.dot;
	}
	let victim: Value = target;
	let caster: Value = user;
	let ghost: Value = (yield* victim.ghostize(0));
	yield* caster.mind.transfer_to(victim);
	yield* ghost.mind.transfer_to(caster);
	if (ghost.key) {
		caster.key = ghost.key;
	}
	yield* qdel(ghost);
	yield* caster.Unconscious(this.unconscious_amount_caster);
	yield* victim.Unconscious(this.unconscious_amount_victim);
	rt.op(f, "Output", [], [caster, sound(rt.rsc("sound/magic/mandswap.ogg"))], false);
	rt.op(f, "Output", [], [victim, sound(rt.rsc("sound/magic/mandswap.ogg"))], false);
	return f.dot;
}, true);
