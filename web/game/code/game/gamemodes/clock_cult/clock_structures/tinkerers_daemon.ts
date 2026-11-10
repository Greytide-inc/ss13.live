// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structures/tinkerers_daemon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(12157, "/obj/structure/destructible/clockwork/powered/tinkerers_daemon", "/obj/structure/destructible/clockwork/powered", {
	component_id_to_produce: null,
	production_time: 0,
	production_cooldown: 70,
	clockwork_desc: "An efficient machine that can rapidly produce components at a small power cost. It will only function if active daemons are outnumbered by servants at a rate to 5:1.",
	active_icon: "tinkerers_daemon",
	inactive_icon: "tinkerers_daemon",
	unanchored_icon: "tinkerers_daemon_unwrenched",
	construction_value: 20,
	name: "tinkerer's daemon",
	desc: "A strange machine with three small brass obelisks attached to it.",
	icon_state: "tinkerers_daemon",
	max_integrity: 100,
	obj_integrity: 100,
	break_message: "<span class='warning'>The daemon shatters into millions of pieces, leaving only a disc of metal!</span>",
	debris: null,
}, { global: { daemon_glow: 790, component_glow: 791 } });

// tinkerers_daemon.dm:14
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.debris = rt.alist(f, [T("/obj/item/clockwork/alloy_shards/medium"), 1, T("/obj/item/clockwork/alloy_shards/small"), 6, T("/obj/item/clockwork/component/replicant_alloy/replication_plate"), 1]);
	return f.dot;
});

// tinkerers_daemon.dm:24
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.active_daemons -= this;
	return (yield* parent_proc());
}, true);

// tinkerers_daemon.dm:28
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/examine", function examine(f: Frame, user: Value) {
	let i: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	parent_proc();
	if (!(is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	if (this.active) {
		if (this.component_id_to_produce) {
			$0 = user;
			$1 = get_component_span(this.component_id_to_produce);
			$2 = get_component_name(this.component_id_to_produce);
			if (this.component_id_to_produce != "replicant_alloy") {
				$3 = "s";
			} else {
				$3 = "";
			}
			to_chat($0, `<span class='${$1}_small'>It is currently producing ${$2}${$3}.</span>`);
		} else {
			to_chat(user, "<span class='brass'>It is currently producing random components.</span>");
		}
	}
	to_chat(user, `<span class='nezbere_small'>It will produce a component every <b>${round(this.production_cooldown * 0.1 * this.get_efficiency_mod(1), 0.1)}</b> seconds and requires at least the following power for each component type:</span>`);
	for (i of each(GLOB.clockwork_component_cache)) {
		$0 = user;
		$1 = get_component_span(i);
		$2 = get_component_name(i);
		$3 = this.get_component_cost(i);
		$4 = rt.index(GLOB.clockwork_component_cache, i);
		if (rt.index(GLOB.clockwork_component_cache, i) == 1) {
			$5 = "s";
		} else {
			$5 = "";
		}
		to_chat($0, `<span class='${$1}_small'><i>${$2}:</i> <b>${$3}W</b> <i>(${$4} exist${$5})</i></span>`);
	}
	return f.dot;
}, false);

// tinkerers_daemon.dm:42
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/forced_disable", function* forced_disable(f: Frame, bad_effects: Value) {
	if (!this.active) return f.dot;
	if (bad_effects) {
		yield* this.try_use_power(100);
		this.visible_message(`<span class='warning'>${this} shuts down with a horrible grinding noise!</span>`);
		playsound(this, rt.rsc("sound/magic/clockwork/anima_fragment_attack.ogg"), 50, 1);
	} else {
		this.visible_message(`<span class='warning'>${this} shuts down!</span>`);
	}
	yield* this.toggle();
	return 1;
}, true);

// tinkerers_daemon.dm:51
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let min_power_usable: Value = null, i: Value = null, servants: Value = null, L: Value = null, choice: Value = null, components: Value = null, i_4: Value = null, input_component: Value = null, L_5: Value = null, L_3: Value = null;
	let $e: any;
	if (!is_servant_of_ratvar(user)) {
		to_chat(user, "<span class='warning'>You place your hand on the daemon, but nothing happens.</span>");
		return f.dot;
	}
	if (this.active) {
		yield* this.toggle(0, user);
	} else {
		if (!this.anchored) {
			to_chat(user, `<span class='warning'>${this} needs to be secured to the floor before it can be activated!</span>`);
			return 0;
		}
		if (!GLOB.clockwork_caches) {
			to_chat(user, "<span class='nezbere'>\"You require a cache for this daemon to operate. Get to it.\"</span>");
			return f.dot;
		}
		min_power_usable = 0;
		for (i of each(GLOB.clockwork_component_cache)) {
			if (!min_power_usable) {
				min_power_usable = this.get_component_cost(i);
			} else {
				min_power_usable = min(min_power_usable, this.get_component_cost(i));
			}
		}
		if (this.total_accessable_power() < min_power_usable) {
			to_chat(user, "<span class='nezbere'>\"You need more power to activate this daemon, friend.\"</span>");
			return f.dot;
		}
		servants = 0;
		for (L of each(GLOB.living_mob_list, T("/mob/living"))) {
			if (is_servant_of_ratvar(L)) {
				servants++;
			}
		}
		if (servants * 0.2 < 1) {
			to_chat(user, "<span class='nezbere'>\"There are too few servants for daemons to work.\"</span>");
			return f.dot;
		}
		const subject = (choice = (yield* alert(user, "Activate Daemon...", null, "Specific Component", "Random Component", "Cancel")));
		if (subject === "Specific Component") {
			components = list();
			for (i_4 of each(GLOB.clockwork_component_cache)) {
				rt.setAt(components, `${get_component_name(i_4)} (${this.get_component_cost(i_4)}W)`, i_4);
			}
			input_component = (yield* g.op(f, "Prompt", [1], [null, this.name, "Choose a component type.", user, components]));
			this.component_id_to_produce = rt.index(components, input_component);
			servants = 0;
			for (L_5 of each(GLOB.living_mob_list, T("/mob/living"))) {
				if (is_servant_of_ratvar(L_5)) {
					servants++;
				}
			}
			if (!is_servant_of_ratvar(user) || !user.canUseTopic(this, (!rt.istype(user, T("/mob/living/silicon")) ? 1 : 0), 1) || this.active || !GLOB.clockwork_caches || servants * 0.2 < 1) {
				return f.dot;
			}
			if (!this.component_id_to_produce) {
				to_chat(user, "<span class='warning'>You decide not to select a component and activate the daemon.</span>");
				return f.dot;
			}
			if (this.total_accessable_power() < this.get_component_cost(this.component_id_to_produce)) {
				to_chat(user, "<span class='warning'>There is too little power to produce this type of component!</span>");
				return f.dot;
			}
			yield* this.toggle(0, user);
		} else if (subject === "Random Component") {
			this.component_id_to_produce = null;
			servants = 0;
			for (L_3 of each(GLOB.living_mob_list, T("/mob/living"))) {
				if (is_servant_of_ratvar(L_3)) {
					servants++;
				}
			}
			if (!is_servant_of_ratvar(user) || !user.canUseTopic(this, (!rt.istype(user, T("/mob/living/silicon")) ? 1 : 0), 1) || this.active || !GLOB.clockwork_caches || servants * 0.2 < 1) {
				return f.dot;
			}
			yield* this.toggle(0, user);
		}
	}
	return f.dot;
}, true);

// tinkerers_daemon.dm:111
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/toggle", function toggle(f: Frame, fast_process: Value, user: Value) {
	let component_color: Value = null;
	f.dot = parent_proc();
	if (this.active) {
		GLOB.active_daemons += this;
		component_color = get_component_color(this.component_id_to_produce);
		GLOB.daemon_glow.color = component_color;
		this.add_overlay(GLOB.daemon_glow);
		GLOB.component_glow.icon_state = `t_${this.component_id_to_produce ? this.component_id_to_produce : "random_component"}`;
		GLOB.component_glow.color = component_color;
		this.add_overlay(GLOB.component_glow);
		this.production_time = rt.worldTime(f) + this.production_cooldown;
		this.set_light(2, 0.9, get_component_color_bright(this.component_id_to_produce));
	} else {
		GLOB.active_daemons -= this;
		this.cut_overlays();
		this.set_light(0);
	}
	return f.dot;
}, false);

// tinkerers_daemon.dm:128
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/get_component_cost", function get_component_cost(f: Frame, id: Value) {
	return max(50, 50 * (1 + round(rt.index(GLOB.clockwork_component_cache, id) * 0.2)));
});

// tinkerers_daemon.dm:132
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/process", function* process(f: Frame) {
	let L: Value = null, D: Value = null, i: Value = null, component_to_generate: Value = null, i_3: Value = null;
	let servants: Value = 0;
	for (L of each(GLOB.living_mob_list, T("/mob/living"))) {
		if (is_servant_of_ratvar(L)) {
			servants++;
		}
	}
	while (servants * 0.2 < rt.length(GLOB.active_daemons)) {
		if (!rt.istype((D = rt.index(GLOB.active_daemons, 1)), T("/obj/structure/destructible/clockwork/powered/tinkerers_daemon"))) {
			break;
		}
		if (D.active) {
			yield* D.forced_disable(0);
			if (D == this) {
				return f.dot;
			}
		}
	}
	f.dot = (yield* parent_proc());
	let min_power_usable: Value = 0;
	if (!this.component_id_to_produce) {
		for (i of each(GLOB.clockwork_component_cache)) {
			if (!min_power_usable) {
				min_power_usable = this.get_component_cost(i);
			} else {
				min_power_usable = min(min_power_usable, this.get_component_cost(i));
			}
		}
	} else {
		min_power_usable = this.get_component_cost(this.component_id_to_produce);
	}
	if (!GLOB.clockwork_caches || f.dot < min_power_usable) {
		yield* this.forced_disable(0);
		return f.dot;
	}
	if (!(this.production_time <= rt.worldTime(f))) return f.dot;
	if (!(component_to_generate = this.component_id_to_produce)) {
		component_to_generate = get_weighted_component_id();
	}
	if (!(yield* this.try_use_power(this.get_component_cost(component_to_generate)))) {
		component_to_generate = null;
		if (!this.component_id_to_produce) {
			for (i_3 of each(GLOB.clockwork_component_cache)) {
				if (yield* this.try_use_power(this.get_component_cost(i_3))) {
					component_to_generate = i_3;
					break;
				}
			}
		}
	}
	if (component_to_generate) {
		yield* generate_cache_component(component_to_generate, this);
		this.production_time = rt.worldTime(f) + this.production_cooldown * this.get_efficiency_mod(1);
		this.visible_message(`<span class='warning'>${this} hums as it produces a </span><span class='${get_component_span(component_to_generate)}'>component</span><span class='warning'>.</span>`);
	} else {
		yield* this.forced_disable(0);
	}
	return f.dot;
}, true, { waitfor: false });
