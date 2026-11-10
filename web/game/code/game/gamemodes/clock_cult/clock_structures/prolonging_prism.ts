// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structures/prolonging_prism.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12156, "/obj/structure/destructible/clockwork/powered/prolonging_prism", "/obj/structure/destructible/clockwork/powered", {
	clockwork_desc: "A powerful prism that will delay the arrival of an emergency shuttle.",
	active_icon: "prolonging_prism",
	inactive_icon: "prolonging_prism_inactive",
	unanchored_icon: "prolonging_prism_unwrenched",
	construction_value: 20,
	name: "prolonging prism",
	desc: "A dark onyx prism, held in midair by spiraling tendrils of stone.",
	icon_state: "prolonging_prism_inactive",
	max_integrity: 125,
	obj_integrity: 125,
	break_message: "<span class='warning'>The prism falls to the ground with a heavy thud!</span>",
	debris: null,
}, { global: { component_refund: 785, delay_cost: 786, delay_cost_increase: 787, delay_remaining: 788 } });

// prolonging_prism.dm:14
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.debris = rt.alist(f, [T("/obj/item/clockwork/alloy_shards/small"), 3, T("/obj/item/clockwork/alloy_shards/medium"), 1, T("/obj/item/clockwork/alloy_shards/large"), 1, T("/obj/item/clockwork/component/vanguard_cogwheel/onyx_prism"), 1]);
	return f.dot;
});

// prolonging_prism.dm:24
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/examine", function examine(f: Frame, user: Value) {
	let efficiency: Value = null;
	parent_proc();
	if (!(is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	if (GLOB.SSshuttle.emergency.mode == "docked" || GLOB.SSshuttle.emergency.mode == "igniting" || GLOB.SSshuttle.emergency.mode == "stranded" || GLOB.SSshuttle.emergency.mode == "escape") {
		to_chat(user, "<span class='inathneq'>An emergency shuttle has arrived and this prism is no longer useful; attempt to activate it to gain a partial refund of components used.</span>");
	} else {
		efficiency = this.get_efficiency_mod(1);
		to_chat(user, `<span class='inathneq_small'>It requires at least <b>${this.get_delay_cost()}W</b> of power to attempt to delay the arrival of an emergency shuttle by <b>${2 * efficiency}</b> minutes.</span>`);
		to_chat(user, `<span class='inathneq_small'>This cost increases by <b>${GLOB.delay_cost_increase * 0.1}W</b> for every <b>10 CV</b> and <b>${GLOB.delay_cost_increase}W</b> for every previous activation.</span>`);
	}
	return f.dot;
}, false);

// prolonging_prism.dm:36
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/forced_disable", function* forced_disable(f: Frame, bad_effects: Value) {
	if (!this.active) return f.dot;
	if (bad_effects) {
		yield* this.try_use_power(100);
	}
	this.visible_message(`<span class='warning'>${this} emits an airy chuckling sound and falls dark!</span>`);
	yield* this.toggle();
	return 1;
}, true);

// prolonging_prism.dm:42
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let i: Value = null, _T: Value = null;
	if (!(user.canUseTopic(this, (!rt.istype(user, T("/mob/living/silicon")) ? 1 : 0), 1) && is_servant_of_ratvar(user))) return f.dot;
	if (GLOB.SSshuttle.emergency.mode == "docked" || GLOB.SSshuttle.emergency.mode == "igniting" || GLOB.SSshuttle.emergency.mode == "stranded" || GLOB.SSshuttle.emergency.mode == "escape") {
		to_chat(user, `<span class='brass'>You break ${this} apart, refunding some of the components used.</span>`);
		for (i of each(GLOB.component_refund)) {
			yield* generate_cache_component(i, this);
		}
		yield* this.take_damage(this.max_integrity);
		return 0;
	}
	if (this.active) {
		return 0;
	}
	if (!(_T = rt.getStep(f, this, 0)) || _T.z != ZLEVEL_STATION) {
		to_chat(user, `<span class='warning'>${this} must be on the station to function!</span>`);
		return 0;
	}
	if (GLOB.SSshuttle.emergency.mode != "call") {
		to_chat(user, "<span class='warning'>No emergency shuttles are attempting to arrive at the station!</span>");
		return 0;
	}
	if (!(yield* this.try_use_power(this.get_delay_cost()))) {
		to_chat(user, `<span class='warning'>${this} needs more power to function!</span>`);
		return 0;
	}
	GLOB.delay_cost += GLOB.delay_cost_increase;
	GLOB.delay_remaining += PRISM_DELAY_DURATION;
	yield* this.toggle(0, user);
	return f.dot;
}, true);

// prolonging_prism.dm:66
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/process", function* process(f: Frame) {
	let delay_amount: Value = null, highest_y: Value = null, highest_x: Value = null, lowest_y: Value = null, lowest_x: Value = null, t: Value = null, _T: Value = null, t_11: Value = null, t_12: Value = null, _T_13: Value = null;
	let own_turf: Value = rt.getStep(f, this, 0);
	if (GLOB.SSshuttle.emergency.mode != "call" || GLOB.delay_remaining <= 0 || !own_turf || own_turf.z != ZLEVEL_STATION) {
		yield* this.forced_disable(0);
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	GLOB.delay_remaining -= (delay_amount = 40);
	let efficiency: Value = this.get_efficiency_mod();
	GLOB.SSshuttle.emergency.setTimer(GLOB.SSshuttle.emergency.timeLeft(1) + delay_amount * efficiency);
	let prism_turfs: Value = list();
	for (t of each(GLOB.SSshuttle.emergency.ripple_area(GLOB.SSshuttle.getDock("emergency_home")))) {
		rt.setAt(prism_turfs, t, 1);
		_T = t;
		if (!highest_y || _T.y > highest_y) {
			highest_y = _T.y;
		}
		if (!highest_x || _T.x > highest_x) {
			highest_x = _T.x;
		}
		if (!lowest_y || _T.y < lowest_y) {
			lowest_y = _T.y;
		}
		if (!lowest_x || _T.x < lowest_x) {
			lowest_x = _T.x;
		}
	}
	let mean_y: Value = Lerp(lowest_y, highest_y);
	let mean_x: Value = Lerp(lowest_x, highest_x);
	if (prob(50)) {
		mean_y = Ceiling(mean_y);
	} else {
		mean_y = Floor(mean_y);
	}
	if (prob(50)) {
		mean_x = Ceiling(mean_x);
	} else {
		mean_x = Floor(mean_x);
	}
	let semi_random_center_turf: Value = rt.locate(mean_x, mean_y, ZLEVEL_STATION);
	for (t_11 of each(getline(this, semi_random_center_turf))) {
		rt.setAt(prism_turfs, t_11, 1);
	}
	let placement_style: Value = prob(50);
	for (t_12 of each(prism_turfs)) {
		_T_13 = t_12;
		if (placement_style) {
			if (IsOdd(_T_13.x + _T_13.y)) {
				yield* this.seven_random_hexes(_T_13, efficiency);
			} else if (prob(50 * efficiency)) {
				yield* new_(T("/obj/effect/temp_visual/ratvar/prolonging_prism"), _T_13);
			}
		} else if (IsEven(_T_13.x + _T_13.y)) {
			yield* this.seven_random_hexes(_T_13, efficiency);
		} else if (prob(50 * efficiency)) {
			yield* new_(T("/obj/effect/temp_visual/ratvar/prolonging_prism"), _T_13);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true, { waitfor: false });

// prolonging_prism.dm:120
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/get_delay_cost", function get_delay_cost(f: Frame) {
	return Floor(GLOB.clockwork_construction_value * GLOB.delay_cost_increase * 0.01 + GLOB.delay_cost, MIN_CLOCKCULT_POWER);
});

// prolonging_prism.dm:125
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/seven_random_hexes", function* seven_random_hexes(f: Frame, _T: Value, efficiency: Value) {
	let hex_combo: Value = null, n: Value = null;
	for (n of each(GLOB.hex_states)) {
		if (prob(50 * efficiency)) {
			if (!hex_combo) {
				hex_combo = mutable_appearance(rt.rsc("icons/effects/64x64.dmi"), n, RIPPLE_LAYER);
			} else {
				hex_combo.overlays += mutable_appearance(rt.rsc("icons/effects/64x64.dmi"), n, RIPPLE_LAYER);
			}
		}
	}
	if (!hex_combo) return f.dot;
	hex_combo.pixel_x = -16;
	hex_combo.pixel_y = -16;
	hex_combo.mouse_opacity = 0;
	hex_combo.plane = GAME_PLANE;
	yield* new_(T("/obj/effect/temp_visual/ratvar/prolonging_prism"), _T, hex_combo);
	return f.dot;
}, true);
