// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structures/mania_motor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12155, "/obj/structure/destructible/clockwork/powered/mania_motor", "/obj/structure/destructible/clockwork/powered", {
	mania_cost: 150,
	clockwork_desc: "A transmitter that allows Sevtug to whisper into the minds of nearby non-servants, causing a variety of negative mental effects, up to and including conversion.",
	active_icon: "mania_motor",
	inactive_icon: "mania_motor_inactive",
	unanchored_icon: "mania_motor_unwrenched",
	construction_value: 20,
	light_color: "#AF0AAF",
	name: "mania motor",
	desc: "A pair of antenna with what appear to be sockets around the base. It reminds you of an antlion.",
	icon_state: "mania_motor_inactive",
	break_message: "<span class='warning'>The antenna break off, leaving a pile of shards!</span>",
	max_integrity: 100,
	obj_integrity: 100,
	debris: null,
});

// mania_motor.dm:15
rt.def("/obj/structure/destructible/clockwork/powered/mania_motor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.debris = rt.alist(f, [T("/obj/item/clockwork/alloy_shards/large"), 2, T("/obj/item/clockwork/alloy_shards/small"), 2, T("/obj/item/clockwork/component/geis_capacitor/antennae"), 1]);
	return f.dot;
});

// mania_motor.dm:21
rt.def("/obj/structure/destructible/clockwork/powered/mania_motor/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!(is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	to_chat(user, `<span class='sevtug_small'>It requires <b>${this.mania_cost}W</b> to run.</span>`);
	return f.dot;
}, false);

// mania_motor.dm:28
rt.def("/obj/structure/destructible/clockwork/powered/mania_motor/proc/forced_disable", function* forced_disable(f: Frame, bad_effects: Value) {
	if (!this.active) return f.dot;
	if (bad_effects) {
		yield* this.try_use_power(100);
	}
	this.visible_message(`<span class='warning'>${this} hums loudly, then the sockets at its base fall dark!</span>`);
	playsound(this, rt.rsc("sound/effects/screech.ogg"), 40, 1);
	yield* this.toggle();
	return 1;
}, true);

// mania_motor.dm:35
rt.def("/obj/structure/destructible/clockwork/powered/mania_motor/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (!(user.canUseTopic(this, (!rt.istype(user, T("/mob/living/silicon")) ? 1 : 0), 1) && is_servant_of_ratvar(user))) return f.dot;
	if ((!this.total_accessable_power() ? 1 : 0) >= this.mania_cost) {
		to_chat(user, `<span class='warning'>${this} needs more power to function!</span>`);
		return 0;
	}
	this.toggle(0, user);
	return f.dot;
});

// mania_motor.dm:42
rt.def("/obj/structure/destructible/clockwork/powered/mania_motor/proc/toggle", function toggle(f: Frame, fast_process: Value, user: Value) {
	f.dot = parent_proc();
	if (this.active) {
		this.set_light(2, 0.9);
	} else {
		this.set_light(0);
	}
	return f.dot;
}, false);

// mania_motor.dm:49
rt.def("/obj/structure/destructible/clockwork/powered/mania_motor/proc/process", function* process(f: Frame) {
	let H: Value = null, effects: Value = null, M: Value = null, MM: Value = null;
	if (!(yield* this.try_use_power(this.mania_cost))) {
		yield* this.forced_disable(0);
		return f.dot;
	}
	let efficiency: Value = this.get_efficiency_mod();
	for (H of each(viewers(7, this), T("/mob/living/carbon/human"))) {
		if (is_servant_of_ratvar(H)) {
			continue;
		}
		effects = H.has_status_effect_list(T("/datum/status_effect/maniamotor"));
		M = null;
		MM = null;
		for (MM of each(effects, T("/datum/status_effect/maniamotor"))) {
			if (MM.motor == this) {
				M = MM;
				break;
			}
		}
		if (!M) {
			M = (yield* H.apply_status_effect(T("/datum/status_effect/maniamotor"), this));
		}
		M.severity = max(0, min(M.severity + (11 - get_dist(this, H)) * efficiency * efficiency, MAX_MANIA_SEVERITY));
	}
	return f.dot;
}, true, { waitfor: false });
