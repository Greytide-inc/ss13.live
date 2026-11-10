// Based on /tg/station's code/modules/spells/spell_types/lightning.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// lightning.dm:20
rt.def("/obj/effect/proc_holder/spell/targeted/tesla/proc/Click", function* Click(f: Frame) {
	if (!this.ready && (yield* this.cast_check())) {
		yield* this.StartChargeup();
	}
	return 1;
}, true);

// lightning.dm:26
rt.def("/obj/effect/proc_holder/spell/targeted/tesla/proc/StartChargeup", function* StartChargeup(f: Frame, user: Value) {
	user ??= f.usr;
	this.ready = 1;
	to_chat(user, "<span class='notice'>You start gathering the power.</span>");
	this.Snd = (yield* new_(T("/sound"), rt.rsc("sound/magic/lightning_chargeup.ogg"), { channel: 7 }));
	GLOB.halo = (GLOB.halo || mutable_appearance(rt.rsc("icons/effects/effects.dmi"), "electricity", 5000));
	user.add_overlay(GLOB.halo);
	playsound(rt.getStep(f, user, 0), this.Snd, 50, 0);
	if (yield* do_mob(user, user, 100, 1)) {
		if (this.ready && (yield* this.cast_check({ skipcharge: 1 }))) {
			yield* this.choose_targets();
		} else {
			yield* this.revert_cast(user, 0);
		}
	} else {
		yield* this.revert_cast(user, 0);
	}
	return f.dot;
}, true);

// lightning.dm:41
rt.def("/obj/effect/proc_holder/spell/targeted/tesla/proc/Reset", function Reset(f: Frame, user: Value) {
	user ??= f.usr;
	this.ready = 0;
	user.cut_overlay(GLOB.halo);
	return f.dot;
});

// lightning.dm:45
rt.def("/obj/effect/proc_holder/spell/targeted/tesla/proc/revert_cast", function* revert_cast(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = f.usr;
	}
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[1]) {
		to_chat(f.args[0], "<span class='notice'>No target found in range.</span>");
	}
	yield* this.Reset(f.args[0]);
	yield* parent_proc();
	return f.dot;
}, true, { args: ["user", "message"] });

// lightning.dm:51
rt.def("/obj/effect/proc_holder/spell/targeted/tesla/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	user ??= f.usr;
	this.ready = 0;
	let target: Value = rt.index(targets, 1);
	this.Snd = (yield* sound(null, { repeat: 0, wait: 1, channel: this.Snd.channel }));
	playsound(rt.getStep(f, user, 0), this.Snd, 50, 0);
	if (get_dist(user, target) > this.range) {
		to_chat(user, "<span class='notice'>They are too far away!</span>");
		yield* this.Reset(user);
		return f.dot;
	}
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/magic/lightningbolt.ogg"), 50, 1);
	yield* user.Beam(target, { icon_state: `lightning${rand(1, 12)}`, time: 5 });
	yield* this.Bolt(user, target, 30, 5, user);
	yield* this.Reset(user);
	return f.dot;
}, true);

// lightning.dm:66
rt.def("/obj/effect/proc_holder/spell/targeted/tesla/proc/Bolt", function* Bolt(f: Frame, origin: Value, target: Value, bolt_energy: Value, bounces: Value, user: Value) {
	let possible_targets: Value = null, M: Value = null, next: Value = null;
	user ??= f.usr;
	yield* origin.Beam(target, { icon_state: `lightning${rand(1, 12)}`, time: 5 });
	let current: Value = target;
	if (bounces < 1) {
		yield* current.electrocute_act(bolt_energy, "Lightning Bolt", { safety: 1 });
		playsound(rt.getStep(f, current, 0), rt.rsc("sound/magic/lightningshock.ogg"), 50, 1, -1);
	} else {
		yield* current.electrocute_act(bolt_energy, "Lightning Bolt", { safety: 1 });
		playsound(rt.getStep(f, current, 0), rt.rsc("sound/magic/lightningshock.ogg"), 50, 1, -1);
		possible_targets = (yield* new_(T("/list")));
		for (M of each(view_or_range(this.range, target, "view"), T("/mob/living"))) {
			if (user == M || target == M && (yield* this.los_check(current, M))) {
				continue;
			}
			possible_targets += M;
		}
		if (!rt.len(f, possible_targets)) {
			return f.dot;
		}
		if (!(next = pick(possible_targets))) return f.dot;
		yield* this.Bolt(current, next, max(bolt_energy - 5, 5), bounces - 1, user);
	}
	return f.dot;
}, true);
