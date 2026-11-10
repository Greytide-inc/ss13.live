// Based on /tg/station's code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// fabrication_helpers.dm:12
rt.def("/atom/proc/consume_visual", function* consume_visual(f: Frame, fabricator: Value, power_amount: Value) {
	let B: Value = null;
	if (!fabricator.can_use_power(power_amount)) return f.dot;
	(B = (yield* new_(T("/obj/effect/temp_visual/ratvar/beam/itemconsume"), rt.getStep(f, this, 0)))).pixel_x = this.pixel_x;
	B.pixel_y = this.pixel_y;
	return f.dot;
}, true);

// fabrication_helpers.dm:19
rt.def("/turf/closed/wall/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 50, "new_obj_type", T("/turf/closed/wall/clockwork"), "power_cost", 1050, "spawn_dir", 2]);
});

// fabrication_helpers.dm:22
rt.def("/turf/closed/wall/mineral/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 50, "new_obj_type", T("/turf/closed/wall/clockwork"), "power_cost", 1150, "spawn_dir", 2]);
});

// fabrication_helpers.dm:25
rt.def("/turf/closed/wall/mineral/iron/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 50, "new_obj_type", T("/turf/closed/wall/clockwork"), "power_cost", 1025, "spawn_dir", 2]);
});

// fabrication_helpers.dm:28
rt.def("/turf/closed/wall/mineral/cult/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 80, "new_obj_type", T("/turf/closed/wall/clockwork"), "power_cost", POWER_WALL_TOTAL, "spawn_dir", 2]);
});

rt.type(4440, "/turf/closed/wall/shuttle", "/turf/closed/wall", {});

// fabrication_helpers.dm:31
rt.def("/turf/closed/wall/shuttle/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 50, "new_obj_type", T("/turf/closed/wall/clockwork"), "power_cost", 1150, "spawn_dir", 2]);
});

// fabrication_helpers.dm:37
rt.def("/turf/closed/wall/clockwork/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 50, "new_obj_type", T("/turf/open/floor/clockwork"), "power_cost", -1000, "spawn_dir", 2]);
});

// fabrication_helpers.dm:40
rt.def("/turf/open/floor/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	if (this.floor_tile == T("/obj/item/stack/tile/plasteel")) {
		yield* new_(this.floor_tile, this);
		yield* this.make_plating();
		playsound(this, rt.rsc("sound/items/crowbar.ogg"), 10, 1);
	}
	return rt.alist(f, ["operation_time", 30, "new_obj_type", T("/turf/open/floor/clockwork"), "power_cost", POWER_FLOOR, "spawn_dir", 2]);
}, true);

// fabrication_helpers.dm:56
rt.def("/turf/open/floor/clockwork/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	if (rt.locateIn(f, T("/obj/structure/table"), this)) {
		return 0;
	}
	if (rt.locateIn(f, T("/obj/structure/falsewall"), this.contents)) {
		to_chat(user, `<span class='warning'>There is a false wall in the way, preventing you from fabricating a clockwork wall on ${this}.</span>`);
		return f.dot;
	}
	if (is_blocked_turf(this, 1)) {
		to_chat(user, `<span class='warning'>Something is in the way, preventing you from fabricating a clockwork wall on ${this}.</span>`);
		return 1;
	}
	let operation_time: Value = 100;
	if (!GLOB.ratvar_awakens && fabricator.speed_multiplier > 0) {
		operation_time /= fabricator.speed_multiplier;
	}
	return rt.alist(f, ["operation_time", operation_time, "new_obj_type", T("/turf/closed/wall/clockwork"), "power_cost", POWER_WALL_MINUS_FLOOR, "spawn_dir", 2]);
});

// fabrication_helpers.dm:72
rt.def("/obj/structure/falsewall/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let cost: Value = POWER_WALL_MINUS_FLOOR;
	if (ispath(this.mineral, T("/obj/item/stack/sheet/metal"))) {
		cost -= POWER_METAL * (2 + this.mineral_amount);
	} else {
		cost -= 100;
	}
	return rt.alist(f, ["operation_time", POWER_METAL, "new_obj_type", T("/obj/structure/falsewall/brass"), "power_cost", cost, "spawn_dir", 2]);
});

// fabrication_helpers.dm:79
rt.def("/obj/structure/falsewall/iron/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 50, "new_obj_type", T("/obj/structure/falsewall/brass"), "power_cost", 850, "spawn_dir", 2]);
});

// fabrication_helpers.dm:91
rt.def("/obj/item/stack/tile/plasteel/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	if (this.source) {
		return 0;
	}
	let amount_temp: Value = this.get_amount();
	let no_delete: Value = 0;
	if (amount_temp < 2) {
		to_chat(user, "<span class='warning'>You need at least <b>2</b> floor tiles to convert into power.</span>");
		return 1;
	}
	if (IsOdd(amount_temp)) {
		amount_temp--;
		no_delete = 1;
		yield* this.use(amount_temp);
	}
	amount_temp *= 12.5;
	yield* this.consume_visual(fabricator, amount_temp);
	return rt.alist(f, ["operation_time", 0, "new_obj_type", null, "power_cost", -amount_temp, "spawn_dir", 2, "no_target_deletion", no_delete]);
}, true);

// fabrication_helpers.dm:107
rt.def("/obj/item/stack/rods/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	if (this.source) {
		return 0;
	}
	let power_amount: Value = -(this.amount * POWER_ROD);
	yield* this.consume_visual(fabricator, power_amount);
	return rt.alist(f, ["operation_time", 0, "new_obj_type", null, "power_cost", power_amount, "spawn_dir", 2]);
}, true);

// fabrication_helpers.dm:114
rt.def("/obj/item/stack/sheet/metal/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	if (this.source) {
		return 0;
	}
	let power_amount: Value = -(this.amount * POWER_METAL);
	yield* this.consume_visual(fabricator, power_amount);
	return rt.alist(f, ["operation_time", 0, "new_obj_type", null, "power_cost", power_amount, "spawn_dir", 2]);
}, true);

// fabrication_helpers.dm:121
rt.def("/obj/item/stack/sheet/plasteel/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	if (this.source) {
		return 0;
	}
	let power_amount: Value = -(this.amount * POWER_PLASTEEL);
	yield* this.consume_visual(fabricator, power_amount);
	return rt.alist(f, ["operation_time", 0, "new_obj_type", null, "power_cost", power_amount, "spawn_dir", 2]);
}, true);

// fabrication_helpers.dm:129
rt.def("/obj/item/stack/tile/brass/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	if (this.source) {
		return 0;
	}
	let power_amount: Value = -(this.amount * POWER_FLOOR);
	yield* this.consume_visual(fabricator, power_amount);
	return rt.alist(f, ["operation_time", 0, "new_obj_type", null, "power_cost", power_amount, "spawn_dir", 2]);
}, true);

// fabrication_helpers.dm:135
rt.def("/obj/machinery/door/airlock/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let doortype: Value = T("/obj/machinery/door/airlock/clockwork");
	if (this.glass) {
		doortype = T("/obj/machinery/door/airlock/clockwork/brass");
	}
	return rt.alist(f, ["operation_time", 60, "new_obj_type", doortype, "power_cost", POWER_WALL_TOTAL, "spawn_dir", this.dir]);
});

// fabrication_helpers.dm:146
rt.def("/obj/structure/table/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let fabrication_cost: Value = POWER_STANDARD;
	if (this.framestack == T("/obj/item/stack/rods")) {
		fabrication_cost -= POWER_ROD * this.framestackamount;
	} else if (this.framestack == T("/obj/item/stack/tile/brass")) {
		fabrication_cost -= POWER_FLOOR * this.framestackamount;
	}
	if (this.buildstack == T("/obj/item/stack/sheet/metal")) {
		fabrication_cost -= POWER_METAL * this.buildstackamount;
	} else if (this.buildstack == T("/obj/item/stack/sheet/plasteel")) {
		fabrication_cost -= POWER_PLASTEEL * this.buildstackamount;
	}
	return rt.alist(f, ["operation_time", 20, "new_obj_type", T("/obj/structure/table/reinforced/brass"), "power_cost", fabrication_cost, "spawn_dir", 2]);
});

// fabrication_helpers.dm:161
rt.def("/obj/structure/table_frame/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let fabrication_cost: Value = POWER_FLOOR;
	if (this.framestack == T("/obj/item/stack/rods")) {
		fabrication_cost -= POWER_ROD * this.framestackamount;
	} else if (this.framestack == T("/obj/item/stack/tile/brass")) {
		fabrication_cost -= POWER_FLOOR * this.framestackamount;
	}
	return rt.alist(f, ["operation_time", 10, "new_obj_type", T("/obj/structure/table_frame/brass"), "power_cost", fabrication_cost, "spawn_dir", 2]);
});

// fabrication_helpers.dm:172
rt.def("/obj/structure/window/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let G: Value = null;
	let windowtype: Value = T("/obj/structure/window/reinforced/clockwork");
	let new_dir: Value = 1;
	let fabrication_time: Value = 15;
	let fabrication_cost: Value = POWER_FLOOR;
	if (this.fulltile) {
		windowtype = T("/obj/structure/window/reinforced/clockwork/fulltile");
		new_dir = 0;
		fabrication_time = 30;
		fabrication_cost = POWER_STANDARD;
		if (this.reinf) {
			fabrication_cost -= POWER_ROD;
		}
	}
	if (this.reinf) {
		fabrication_cost -= POWER_ROD;
	}
	for (G of each(rt.getStep(f, this, 0), T("/obj/structure/grille"))) {
		ImmediateInvokeAsync(fabricator, P("/obj/item/clockwork/replica_fabricator/proc/fabricate"), G, user);
	}
	return rt.alist(f, ["operation_time", fabrication_time, "new_obj_type", windowtype, "power_cost", fabrication_cost, "spawn_dir", this.dir, "dir_in_new", new_dir]);
});

// fabrication_helpers.dm:194
rt.def("/obj/machinery/door/window/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 30, "new_obj_type", T("/obj/machinery/door/window/clockwork"), "power_cost", POWER_STANDARD, "spawn_dir", this.dir, "dir_in_new", 1]);
});

// fabrication_helpers.dm:201
rt.def("/obj/structure/grille/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let grilletype: Value = T("/obj/structure/grille/ratvar");
	let fabrication_time: Value = 15;
	if (this.broken) {
		grilletype = T("/obj/structure/grille/ratvar/broken");
		fabrication_time = 5;
	}
	return rt.alist(f, ["operation_time", fabrication_time, "new_obj_type", grilletype, "power_cost", 0, "spawn_dir", this.dir]);
});

// fabrication_helpers.dm:213
rt.def("/obj/structure/lattice/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 0, "new_obj_type", T("/obj/structure/lattice/clockwork"), "power_cost", 0, "spawn_dir", 2, "no_target_deletion", 1]);
});

// fabrication_helpers.dm:216
rt.def("/obj/structure/lattice/clockwork/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	yield* this.ratvar_act();
	return 0;
}, true);

// fabrication_helpers.dm:220
rt.def("/obj/structure/lattice/catwalk/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 0, "new_obj_type", T("/obj/structure/lattice/catwalk/clockwork"), "power_cost", 0, "spawn_dir", 2, "no_target_deletion", 1]);
});

// fabrication_helpers.dm:228
rt.def("/obj/structure/girder/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let fabrication_cost: Value = 650;
	if (this.state == GIRDER_REINF_STRUTS || this.state == GIRDER_REINF) {
		fabrication_cost -= POWER_PLASTEEL;
	}
	return rt.alist(f, ["operation_time", 20, "new_obj_type", T("/obj/structure/destructible/clockwork/wall_gear"), "power_cost", fabrication_cost, "spawn_dir", 2]);
});

// fabrication_helpers.dm:235
rt.def("/obj/structure/destructible/clockwork/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	f.dot = 1;
	let repair_values: Value = list();
	if (!fabricator.fabricator_repair_checks(repair_values, this, user)) {
		return f.dot;
	}
	user.visible_message(`<span class='notice'>${user}'s ${fabricator.name} starts covering ${this} in glowing orange energy...</span>`, `<span class='alloy'>You start repairing ${this}...</span>`);
	fabricator.repairing = this;
	while (fabricator && user && this) {
		if (!(yield* do_after(user, rt.at(repair_values, "healing_for_cycle") * fabricator.speed_multiplier, { target: this, extra_checks: (yield* new_(T("/datum/callback"), fabricator, P("/obj/item/clockwork/replica_fabricator/proc/fabricator_repair_checks"), repair_values, this, user, 1)) }))) {
			break;
		}
		this.obj_integrity = max(0, min(this.obj_integrity + rt.at(repair_values, "healing_for_cycle"), this.max_integrity));
		yield* fabricator.modify_stored_power(-rt.at(repair_values, "power_required"));
		playsound(this, rt.rsc("sound/machines/click.ogg"), 50, 1);
	}
	if (!fabricator) return f.dot;
	fabricator.repairing = null;
	if (!user) return f.dot;
	user.visible_message(`<span class='notice'>${user}'s ${fabricator.name} stops covering ${this} with glowing orange energy.</span>`, `<span class='alloy'>You finish repairing ${this}. It is now at <b>${this.obj_integrity}/${this.max_integrity}</b> integrity.</span>`);
	return f.dot;
}, true);

// fabrication_helpers.dm:258
rt.def("/obj/effect/clockwork/sigil/transmission/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	f.dot = 1;
	let charge_values: Value = list();
	if (!fabricator.sigil_charge_checks(charge_values, this, user)) {
		return f.dot;
	}
	user.visible_message(`<span class='notice'>${user}'s ${fabricator.name} starts draining glowing orange energy from ${this}...</span>`, `<span class='alloy'>You start recharging your ${fabricator.name}...</span>`);
	fabricator.recharging = this;
	while (fabricator && user && this) {
		if (!(yield* do_after(user, 10, { target: this, extra_checks: (yield* new_(T("/datum/callback"), fabricator, P("/obj/item/clockwork/replica_fabricator/proc/sigil_charge_checks"), charge_values, this, user, 1)) }))) {
			break;
		}
		this.modify_charge(rt.at(charge_values, "power_gain"));
		yield* fabricator.modify_stored_power(rt.at(charge_values, "power_gain"));
		playsound(this, rt.rsc("sound/effects/light_flicker.ogg"), rt.at(charge_values, "power_gain") * 0.1, 1);
	}
	if (!fabricator) return f.dot;
	fabricator.recharging = null;
	if (!user) return f.dot;
	user.visible_message(`<span class='notice'>${user}'s ${fabricator.name} stops draining glowing orange energy from ${this}.</span>`, `<span class='alloy'>You finish recharging your ${fabricator.name}. It now contains <b>${fabricator.get_power()}W/${fabricator.get_max_power()}W</b> power.</span>`);
	return f.dot;
}, true);

// fabrication_helpers.dm:279
rt.def("/mob/living/proc/fabricator_heal", function* fabricator_heal(f: Frame, user: Value, fabricator: Value) {
	let $3: any;
	let repair_values: Value = list();
	if (!fabricator.fabricator_repair_checks(repair_values, this, user)) {
		return f.dot;
	}
	let $0: any = user;
	let $1: any = user;
	let $2: any = fabricator.name;
	if (this == user) {
		$3 = `g ${user.p_them()}`;
	} else {
		$3 = `g ${this}`;
	}
	$1 = `<span class='notice'>${$1}'s ${$2} starts coverin${$3} in glowing orange energy...</span>`;
	$0.visible_message($1, `<span class='alloy'>You start repairin${this == user ? "g yourself" : `g ${this}`}...</span>`);
	fabricator.repairing = this;
	while (fabricator && user && this) {
		if (!(yield* do_after(user, rt.at(repair_values, "healing_for_cycle") * fabricator.speed_multiplier, { target: this, extra_checks: (yield* new_(T("/datum/callback"), fabricator, P("/obj/item/clockwork/replica_fabricator/proc/fabricator_repair_checks"), repair_values, this, user, 1)) }))) {
			break;
		}
		yield* this.fabricator_heal_tick(rt.at(repair_values, "healing_for_cycle"));
		yield* fabricator.modify_stored_power(-rt.at(repair_values, "power_required"));
		playsound(this, rt.rsc("sound/machines/click.ogg"), 50, 1);
	}
	if (fabricator) {
		fabricator.repairing = null;
	}
	return 1;
}, true);

// fabrication_helpers.dm:300
rt.def("/mob/living/proc/fabricator_heal_tick", function* fabricator_heal_tick(f: Frame, amount: Value) {
	yield* this.heal_ordered_damage(amount, rt.gl("damage_heal_order#2"));
	return f.dot;
}, true);

// fabrication_helpers.dm:303
rt.def("/mob/living/simple_animal/proc/fabricator_heal_tick", function* fabricator_heal_tick(f: Frame, amount: Value) {
	yield* this.adjustHealth(-amount);
	return f.dot;
}, true);

// fabrication_helpers.dm:308
rt.def("/mob/living/silicon/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let $0: any, $1: any, $2: any, $3: any;
	f.dot = 1;
	if (this.health == this.maxHealth) {
		return 0;
	} else {
		if (!((yield* this.fabricator_heal(user, fabricator)) && user)) return f.dot;
		$0 = user;
		$1 = user;
		$2 = fabricator.name;
		if (this == user) {
			$3 = `g ${user.p_them()}`;
		} else {
			$3 = `g ${this}`;
		}
		$1 = `<span class='notice'>${$1}'s ${$2} stops coverin${$3} with glowing orange energy.</span>`;
		if (this == user) {
			$2 = "g yourself. You are";
		} else {
			$2 = `g ${this}. ${this.p_they(1)} ${this.p_are()}`;
		}
		$0.visible_message($1, `<span class='alloy'>You finish repairin${$2} now at <b>${rt.op(f, "Abs", [], [-100 - this.health])}/${rt.op(f, "Abs", [], [-100 - this.maxHealth])}</b> health.</span>`);
	}
	return f.dot;
}, true);

// fabrication_helpers.dm:317
rt.def("/mob/living/simple_animal/hostile/clockwork/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let $0: any, $1: any, $2: any, $3: any;
	f.dot = 1;
	if (this.health == this.maxHealth) {
		return 0;
	} else {
		if (!((yield* this.fabricator_heal(user, fabricator)) && user)) return f.dot;
		$0 = user;
		$1 = user;
		$2 = fabricator.name;
		if (this == user) {
			$3 = `g ${user.p_them()}`;
		} else {
			$3 = `g ${this}`;
		}
		$1 = `<span class='notice'>${$1}'s ${$2} stops coverin${$3} with glowing orange energy.</span>`;
		if (this == user) {
			$2 = "g yourself. You are";
		} else {
			$2 = `g ${this}. ${this.p_they(1)} ${this.p_are()}`;
		}
		$0.visible_message($1, `<span class='alloy'>You finish repairin${$2} now at <b>${this.health}/${this.maxHealth}</b> health.</span>`);
	}
	return f.dot;
}, true);

// fabrication_helpers.dm:326
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let $0: any, $1: any, $2: any, $3: any;
	f.dot = 1;
	if (this.stat == 2) {
		yield* this.try_reactivate(user);
		return f.dot;
	}
	if (this.health == this.maxHealth) {
		return 0;
	} else {
		if (rt.bitAnd(this.flags, 4096)) return f.dot;
		$0 = user;
		$1 = user;
		$2 = fabricator.name;
		if (this == user) {
			$3 = `g ${user.p_them()}`;
		} else {
			$3 = `g ${this}`;
		}
		$1 = `<span class='notice'>${$1}'s ${$2} starts coverin${$3} in glowing orange energy...</span>`;
		if (this == user) {
			$2 = "g yourself";
		} else {
			$2 = `g ${this}`;
		}
		$0.visible_message($1, `<span class='alloy'>You start repairin${$2}...</span>`);
		fabricator.repairing = this;
		if (yield* do_after(user, (this.maxHealth - this.health) * 2, { target: this })) {
			yield* this.adjustHealth(-this.maxHealth);
			$0 = user;
			$1 = user;
			$2 = fabricator.name;
			if (this == user) {
				$3 = `g ${user.p_them()}`;
			} else {
				$3 = `g ${this}`;
			}
			$1 = `<span class='notice'>${$1}'s ${$2} stops coverin${$3} with glowing orange energy.</span>`;
			if (this == user) {
				$2 = "g yourself";
			} else {
				$2 = `g ${this}`;
			}
			$0.visible_message($1, `<span class='alloy'>You finish repairin${$2}.</span>`);
		}
		if (!fabricator) return f.dot;
		fabricator.repairing = null;
	}
	return f.dot;
}, true);

// fabrication_helpers.dm:344
rt.def("/obj/item/clockwork/alloy_shards/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value, power_amount: Value) {
	let S: Value = null;
	if (!power_amount) {
		power_amount = -500;
	}
	yield* this.consume_visual(fabricator, power_amount);
	if (!silent) {
		for (S of each(rt.getStep(f, this, 0), T("/obj/item/clockwork/alloy_shards"))) {
			if (S == this) {
				continue;
			}
			yield* addtimer((yield* new_(T("/datum/callback"), fabricator, P("/obj/item/clockwork/replica_fabricator/proc/fabricate"), S, user, 1)), 0);
		}
	}
	return rt.alist(f, ["operation_time", 0, "new_obj_type", null, "power_cost", power_amount, "spawn_dir", 2]);
}, true);

rt.type(8931, "/obj/item/clockwork/alloy_shards/medium/gear_bit/large", "/obj/item/clockwork/alloy_shards/medium/gear_bit", {});

// fabrication_helpers.dm:355
rt.def("/obj/item/clockwork/alloy_shards/medium/gear_bit/large/proc/fabrication_vals", function* fabrication_vals(f: Frame) {
	if (!f.args[3]) {
		f.args[3] = -200;
	}
	return (yield* parent_proc());
}, true, { args: ["user", "fabricator", "silent", "power_amount"] });

rt.type(8932, "/obj/item/clockwork/alloy_shards/large", "/obj/item/clockwork/alloy_shards", {
	w_class: 1,
	randomsinglesprite: 1,
	icon_state: "shard_large",
	sprite_shift: 9,
});

// fabrication_helpers.dm:360
rt.def("/obj/item/clockwork/alloy_shards/large/proc/fabrication_vals", function* fabrication_vals(f: Frame) {
	if (!f.args[3]) {
		f.args[3] = -150;
	}
	return (yield* parent_proc());
}, true, { args: ["user", "fabricator", "silent", "power_amount"] });

rt.type(8929, "/obj/item/clockwork/alloy_shards/medium", "/obj/item/clockwork/alloy_shards", {
	w_class: 1,
	randomsinglesprite: 1,
	icon_state: "shard_medium",
	sprite_shift: 10,
});

// fabrication_helpers.dm:365
rt.def("/obj/item/clockwork/alloy_shards/medium/proc/fabrication_vals", function* fabrication_vals(f: Frame) {
	if (!f.args[3]) {
		f.args[3] = -100;
	}
	return (yield* parent_proc());
}, true, { args: ["user", "fabricator", "silent", "power_amount"] });

rt.type(8933, "/obj/item/clockwork/alloy_shards/small", "/obj/item/clockwork/alloy_shards", {
	w_class: 1,
	randomsinglesprite: 1,
	randomspritemax: 3,
	icon_state: "shard_small",
	sprite_shift: 12,
});

// fabrication_helpers.dm:370
rt.def("/obj/item/clockwork/alloy_shards/small/proc/fabrication_vals", function* fabrication_vals(f: Frame) {
	if (!f.args[3]) {
		f.args[3] = -50;
	}
	return (yield* parent_proc());
}, true, { args: ["user", "fabricator", "silent", "power_amount"] });
