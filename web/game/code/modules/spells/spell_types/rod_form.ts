// Based on /tg/station's code/modules/spells/spell_types/rod_form.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11330, "/obj/effect/proc_holder/spell/targeted/rod_form", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 1,
	name: "Rod Form",
	desc: "Take on the form of an immovable rod, destroying all in your path.",
	clothes_req: 1,
	human_req: 0,
	charge_max: 250,
	cooldown_min: 100,
	range: -1,
	invocation: "CLANG!",
	invocation_type: "shout",
	action_icon_state: "immrod",
});

// rod_form.dm:15
rt.def("/obj/effect/proc_holder/spell/targeted/rod_form/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let M: Value = null, start: Value = null, W: Value = null;
	user ??= f.usr;
	for (M of each(targets, T("/mob/living"))) {
		start = rt.getStep(f, M, 0);
		(W = (yield* new_(T("/obj/effect/immovablerod/wizard"), start, get_ranged_target_turf(M, M.dir, 15 + this.spell_level * 3)))).wizard = M;
		W.max_distance += this.spell_level * 3;
		W.damage_bonus += this.spell_level * 20;
		W.start_turf = start;
		yield* M.forceMove(W);
		M.notransform = 1;
		(rt.modField(f, M, "status_flags", 4096, rt.bitOr));
	}
	return f.dot;
}, true);

rt.type(12049, "/obj/effect/immovablerod/wizard", "/obj/effect/immovablerod", {
	max_distance: 13,
	damage_bonus: 0,
	wizard: null,
	start_turf: null,
	notify: 0,
});

// rod_form.dm:36
rt.def("/obj/effect/immovablerod/wizard/proc/Move", function* Move(f: Frame) {
	if (get_dist(this.start_turf, rt.getStep(f, this, 0)) >= this.max_distance) {
		yield* qdel(this);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// rod_form.dm:42
rt.def("/obj/effect/immovablerod/wizard/proc/Destroy", function* Destroy(f: Frame) {
	if (this.wizard) {
		(rt.modField(f, this.wizard, "status_flags", 16773119, rt.bitAnd));
		this.wizard.notransform = 0;
		yield* this.wizard.forceMove(rt.getStep(f, this, 0));
	}
	return (yield* parent_proc());
}, true);

// rod_form.dm:48
rt.def("/obj/effect/immovablerod/wizard/proc/penetrate", function* penetrate(f: Frame, L: Value) {
	L.visible_message(`<span class='danger'>${L} is penetrated by an immovable rod!</span>`, "<span class='userdanger'>The rod penetrates you!</span>", "<span class ='danger'>You hear a CLANG!</span>");
	yield* L.adjustBruteLoss(70 + this.damage_bonus);
	return f.dot;
}, true);
