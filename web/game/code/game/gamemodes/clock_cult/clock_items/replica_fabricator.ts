// Based on /tg/station's code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, multiply, fmt } = rt;


rt.type(8965, "/obj/item/clockwork/replica_fabricator/scarab", "/obj/item/clockwork/replica_fabricator", {
	debug: 0,
	clockwork_desc: "A cogscarab's internal fabricator. It can only be successfully used by a cogscarab and requires power to function.",
	speed_multiplier: 0.5,
	charge_rate: 50,
	name: "scarab fabricator",
	item_state: "nothing",
	w_class: 1,
});

// replica_fabricator.dm:32
rt.def("/obj/item/clockwork/replica_fabricator/scarab/proc/fabricate", function* fabricate(f: Frame, target: Value, user: Value) {
	if (!this.debug && !rt.istype(user, T("/mob/living/simple_animal/drone"))) {
		return 0;
	}
	return (yield* parent_proc());
}, true);

rt.type(8967, "/obj/item/clockwork/replica_fabricator/cyborg", "/obj/item/clockwork/replica_fabricator", {
	clockwork_desc: "A cyborg's internal fabricator. It is capable of using the cyborg's power in addition to stored power.",
	name: "cyborg fabricator",
});

// replica_fabricator.dm:46
rt.def("/obj/item/clockwork/replica_fabricator/cyborg/proc/get_power", function get_power(f: Frame) {
	let R: Value = get_atom_on_turf(this, T("/mob/living"));
	let borg_power: Value = 0;
	let current_charge: Value = 0;
	if (rt.istype(R, T("/mob/living/silicon/robot")) && R.cell) {
		current_charge = R.cell.charge;
		while (current_charge > MIN_CLOCKCULT_POWER) {
			current_charge -= MIN_CLOCKCULT_POWER;
			borg_power += MIN_CLOCKCULT_POWER;
		}
	}
	return parent_proc() + borg_power;
});

// replica_fabricator.dm:57
rt.def("/obj/item/clockwork/replica_fabricator/cyborg/proc/get_max_power", function get_max_power(f: Frame) {
	let R: Value = get_atom_on_turf(this, T("/mob/living"));
	let cell_maxcharge: Value = 0;
	if (rt.istype(R, T("/mob/living/silicon/robot")) && R.cell) {
		cell_maxcharge = R.cell.maxcharge;
	}
	return parent_proc() + cell_maxcharge;
});

// replica_fabricator.dm:64
rt.def("/obj/item/clockwork/replica_fabricator/cyborg/proc/can_use_power", function can_use_power(f: Frame) {
	let R: Value = null, current_charge: Value = null;
	if (f.args[0] != "ratvar?") {
		R = get_atom_on_turf(this, T("/mob/living"));
		current_charge = 0;
		if (rt.istype(R, T("/mob/living/silicon/robot")) && R.cell) {
			current_charge = R.cell.charge;
			while (f.args[0] > 0 && this.stored_power - f.args[0] < 0) {
				current_charge -= MIN_CLOCKCULT_POWER;
				f.args[0] -= MIN_CLOCKCULT_POWER;
			}
		}
		if (current_charge < 0) {
			return 0;
		}
	}
	f.dot = parent_proc();
	return f.dot;
}, false, { args: ["amount"] });

// replica_fabricator.dm:77
rt.def("/obj/item/clockwork/replica_fabricator/cyborg/proc/modify_stored_power", function* modify_stored_power(f: Frame) {
	let R: Value = null;
	if (rt.istype((R = get_atom_on_turf(this, T("/mob/living"))), T("/mob/living/silicon/robot")) && R.cell && f.args[0]) {
		if (f.args[0] < 0) {
			while (f.args[0] < 0 && this.stored_power + f.args[0] < 0) {
				yield* R.cell.use(MIN_CLOCKCULT_POWER);
				f.args[0] += MIN_CLOCKCULT_POWER;
			}
		} else {
			while (f.args[0] > 0 && R.cell.charge + MIN_CLOCKCULT_POWER < R.cell.maxcharge) {
				yield* R.cell.give(MIN_CLOCKCULT_POWER);
				f.args[0] -= MIN_CLOCKCULT_POWER;
			}
		}
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["amount"] });

rt.type(8963, "/obj/item/clockwork/replica_fabricator", "/obj/item/clockwork", {
	stored_power: 0,
	max_power: 25000,
	uses_power: 1,
	repairing: null,
	recharging: null,
	speed_multiplier: 1,
	charge_rate: 25,
	charge_delay: 2,
	clockwork_desc: "A device that allows the replacing of mundane objects with Ratvarian variants. It requires power to function.",
	flags: 4,
	name: "replica fabricator",
	desc: "An odd, L-shaped device that hums with energy.",
	icon_state: "replica_fabricator",
	w_class: 3,
	force: 5,
});

// replica_fabricator.dm:90
rt.def("/obj/item/clockwork/replica_fabricator/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// replica_fabricator.dm:94
rt.def("/obj/item/clockwork/replica_fabricator/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// replica_fabricator.dm:98
rt.def("/obj/item/clockwork/replica_fabricator/proc/process", function* process(f: Frame) {
	let L: Value = null, S: Value = null;
	if (!this.charge_rate) {
		return f.dot;
	}
	if (rt.istype((L = get_atom_on_turf(this, T("/mob/living"))), T("/mob/living")) && is_servant_of_ratvar(L)) {
		if (this.charge_delay) {
			this.charge_delay--;
			return f.dot;
		}
		yield* this.modify_stored_power(this.charge_rate);
		for (S of each(L.GetAllContents(), T("/obj/item/clockwork/replica_fabricator"))) {
			if (S == this) {
				continue;
			}
			S.charge_delay = 2;
		}
	} else {
		this.charge_delay = 2;
	}
	return f.dot;
}, true, { waitfor: false });

// replica_fabricator.dm:116
rt.def("/obj/item/clockwork/replica_fabricator/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (GLOB.ratvar_awakens) {
		this.uses_power = 0;
		this.speed_multiplier = rt.initial(f, this, "speed_multiplier") * 0.25;
	} else {
		this.uses_power = rt.initial(f, this, "uses_power");
		this.speed_multiplier = rt.initial(f, this, "speed_multiplier");
	}
	return f.dot;
});

// replica_fabricator.dm:122
rt.def("/obj/item/clockwork/replica_fabricator/proc/examine", function examine(f: Frame, user: Value) {
	let $3: any;
	parent_proc();
	if (!(is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	to_chat(user, "<span class='brass'>Can be used to replace walls, floors, tables, windows, windoors, and airlocks with Clockwork variants.</span>");
	to_chat(user, "<span class='brass'>Can construct Clockwork Walls on Clockwork Floors and deconstruct Clockwork Walls to Clockwork Floors.</span>");
	if (!this.uses_power) return f.dot;
	to_chat(user, `<span class='alloy'>It can consume floor tiles, rods, metal, and plasteel for power at rates of <b>2:${POWER_ROD}W</b>, <b>1:${POWER_ROD}W</b>, <b>1:${POWER_METAL}W</b>, and <b>1:${POWER_PLASTEEL}W</b>, respectively.</span>`);
	to_chat(user, `<span class='alloy'>It can also consume brass sheets for power at a rate of <b>1:${POWER_FLOOR}W</b>.</span>`);
	let $0: any = user;
	let $1: any = this.get_power();
	let $2: any = this.get_max_power();
	if (this.charge_rate) {
		$3 = `, and is gaining <b>${this.charge_rate * 0.5}W</b> of power per second`;
	} else {
		$3 = "";
	}
	to_chat($0, `<span class='alloy'>It is storing <b>${$1}W/${$2}W</b> of power${$3}.</span>`);
	to_chat(user, `<span class='alloy'>Use it in-hand to produce <b>5</b> brass sheets at a cost of <b>${POWER_WALL_TOTAL}W</b> power.</span>`);
	return f.dot;
}, false);

// replica_fabricator.dm:134
rt.def("/obj/item/clockwork/replica_fabricator/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let $1: any;
	if (!is_servant_of_ratvar(user)) return f.dot;
	if (this.uses_power) {
		if (!this.can_use_power(POWER_WALL_TOTAL)) {
			to_chat(user, `<span class='warning'>${this} requires <b>${POWER_WALL_TOTAL}W</b> of power to produce brass sheets!</span>`);
			return f.dot;
		}
		yield* this.modify_stored_power(-1250);
	}
	playsound(this, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
	yield* new_(T("/obj/item/stack/tile/brass"), user.loc, 5);
	let $0: any = user;
	if (this.stored_power) {
		$1 = "some";
	} else {
		$1 = "all";
	}
	to_chat($0, `<span class='brass'>You use ${$1} of ${this}'s power to produce <b>5</b> brass sheets. It now stores <b>${this.get_power()}W/${this.get_max_power()}W</b> of power.</span>`);
	return f.dot;
}, true);

// replica_fabricator.dm:145
rt.def("/obj/item/clockwork/replica_fabricator/proc/pre_attackby", function* pre_attackby(f: Frame, target: Value, user: Value, params: Value) {
	if (!target || !user || !is_servant_of_ratvar(user) || rt.istype(target, T("/obj/item/weapon/storage"))) {
		return 1;
	}
	return (yield* this.fabricate(target, user));
}, true);

// replica_fabricator.dm:156
rt.def("/obj/item/clockwork/replica_fabricator/proc/modify_stored_power", function modify_stored_power(f: Frame, amount: Value) {
	this.stored_power = max(0, min(this.stored_power + amount, this.max_power));
	return 1;
});

// replica_fabricator.dm:160
rt.def("/obj/item/clockwork/replica_fabricator/proc/can_use_power", function can_use_power(f: Frame, amount: Value) {
	if (amount == "ratvar?") {
		if (GLOB.ratvar_awakens || !this.uses_power) {
			return 1;
		} else {
			return 0;
		}
	}
	if (this.stored_power - amount < 0) {
		return 0;
	}
	if (this.stored_power - amount > this.max_power) {
		return 0;
	}
	return 1;
});

// replica_fabricator.dm:173
rt.def("/obj/item/clockwork/replica_fabricator/proc/fabricate", function* fabricate(f: Frame, target: Value, user: Value, silent: Value, no_table_check: Value) {
	let fabrication_values: Value = null, Y: Value = null, A: Value = null, _T: Value = null, A_4: Value = null;
	if (!target || !user) {
		return 0;
	}
	if (this.repairing) {
		if (!silent) {
			to_chat(user, `<span class='warning'>You are currently repairing ${this.repairing} with ${this}!</span>`);
		}
		return 0;
	}
	if (this.recharging) {
		if (!silent) {
			to_chat(user, `<span class='warning'>You are currently recharging ${this} from the ${this.recharging.sigil_name}!</span>`);
		}
		return 0;
	}
	if (!rt.istype((fabrication_values = (yield* target.fabrication_vals(user, this, silent))), T("/list"))) {
		if (fabrication_values != 1) {
			if (!isturf(target)) {
				return (yield* this.fabricate(rt.getStep(f, target, 0), user, no_table_check));
			}
			if (!silent) {
				to_chat(user, `<span class='warning'>${target} cannot be fabricated!</span>`);
			}
			if (!no_table_check) {
				return 1;
			}
		}
		return 0;
	}
	if (this.can_use_power("ratvar?")) {
		rt.setAt(fabrication_values, "power_cost", 0);
	}
	if (!(Y = rt.getStep(f, user, 0)) || Y.z != ZLEVEL_STATION && Y.z != ZLEVEL_CENTCOM && Y.z != ZLEVEL_MINING && Y.z != ZLEVEL_LAVALAND) {
		(rt.modAt(fabrication_values, "operation_time", 2, multiply));
		if (rt.at(fabrication_values, "power_cost") > 0) {
			(rt.modAt(fabrication_values, "power_cost", 2, multiply));
		}
	}
	let target_type: Value = target.type;
	if (!this.fabricate_checks(fabrication_values, target, target_type, user, silent)) {
		return 0;
	}
	(rt.modAt(fabrication_values, "operation_time", this.speed_multiplier, multiply));
	playsound(target, rt.rsc("sound/machines/click.ogg"), 50, 1);
	if (rt.at(fabrication_values, "operation_time")) {
		if (!silent) {
			if (A = rt.at(fabrication_values, "new_obj_type")) {
				user.visible_message(`<span class='warning'>${user}'s ${this.name} starts ripping ${target} apart!</span>`, fmt("<span class='brass'>You start fabricating ＇！ from ＀...</span>", [rt.initial(f, A, "name"), target]));
			} else {
				user.visible_message(`<span class='warning'>${user}'s ${this.name} starts consuming ${target}!</span>`, `<span class='brass'>Your ${this.name} starts consuming ${target}...</span>`);
			}
		}
		if (!(yield* do_after(user, rt.at(fabrication_values, "operation_time"), { target: target, extra_checks: (yield* new_(T("/datum/callback"), this, P("/obj/item/clockwork/replica_fabricator/proc/fabricate_checks"), fabrication_values, target, target_type, user, 1)) }))) {
			return 0;
		}
		if (!silent) {
			if (A = rt.at(fabrication_values, "new_obj_type")) {
				user.visible_message(fmt("<span class='warning'>＀'s ＀ replaces ＀ with ＇！!</span>", [user, this.name, target, rt.initial(f, A, "name")]), fmt("<span class='brass'>You fabricate ＇！ from ＀.</span>", [rt.initial(f, A, "name"), target]));
			} else {
				user.visible_message(`<span class='warning'>${user}'s ${this.name} consumes ${target}!</span>`, `<span class='brass'>Your ${this.name} consumes ${target}.</span>`);
			}
		}
	} else if (!silent) {
		if (A = rt.at(fabrication_values, "new_obj_type")) {
			user.visible_message(fmt("<span class='warning'>＀'s ＀ rips apart ＀, replacing it with ＇！!</span>", [user, this.name, target, rt.initial(f, A, "name")]), fmt("<span class='brass'>You fabricate ＇！ from ＀.</span>", [rt.initial(f, A, "name"), target]));
		} else {
			user.visible_message(`<span class='warning'>${user}'s ${this.name} rapidly consumes ${target}!</span>`, `<span class='brass'>Your ${this.name} consumes ${target}.</span>`);
		}
	}
	playsound(target, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
	let new_thing_type: Value = rt.at(fabrication_values, "new_obj_type");
	if (isturf(target)) {
		yield* (_T = target).ChangeTurf(new_thing_type);
	} else {
		if (new_thing_type) {
			if (rt.at(fabrication_values, "dir_in_new")) {
				yield* new_(new_thing_type, rt.getStep(f, target, 0), rt.at(fabrication_values, "spawn_dir"));
			} else {
				yield* (A_4 = (yield* new_(new_thing_type, rt.getStep(f, target, 0)))).setDir(rt.at(fabrication_values, "spawn_dir"));
			}
		}
		if (!rt.at(fabrication_values, "no_target_deletion")) {
			yield* qdel(target);
		}
	}
	yield* this.modify_stored_power(-rt.at(fabrication_values, "power_cost"));
	if (no_table_check) {
		return 1;
	}
	return 0;
}, true, { argTypes: [{ path: "/atom" }, { type: 8, path: "/mob/living" }, {  }, {  }] });

// replica_fabricator.dm:264
rt.def("/obj/item/clockwork/replica_fabricator/proc/fabricate_checks", function fabricate_checks(f: Frame, fabrication_values: Value, target: Value, expected_type: Value, user: Value, silent: Value) {
	let A: Value = null;
	if (!rt.istype(fabrication_values, T("/list")) || !target || target.gc_destroyed || !user || user.gc_destroyed) {
		return 0;
	}
	if (this.repairing || this.recharging) {
		return 0;
	}
	if (target.type != expected_type) {
		return 0;
	}
	if (this.can_use_power("ratvar?")) {
		rt.setAt(fabrication_values, "power_cost", 0);
	}
	if (!this.can_use_power(rt.at(fabrication_values, "power_cost"))) {
		if (this.stored_power - rt.at(fabrication_values, "power_cost") < 0) {
			if (!silent) {
				if (A = rt.at(fabrication_values, "new_obj_type")) {
					to_chat(user, fmt("<span class='warning'>You need <b>＀W</b> power to fabricate ＇！ from ＀!</span>", [rt.at(fabrication_values, "power_cost"), rt.initial(f, A, "name"), target]));
				}
			}
		} else if (this.stored_power - rt.at(fabrication_values, "power_cost") > this.max_power) {
			if (!silent) {
				if (A = rt.at(fabrication_values, "new_obj_type")) {
					to_chat(user, fmt("<span class='warning'>Your ＀ contains too much power to fabricate ＇！ from ＀!</span>", [this.name, rt.initial(f, A, "name"), target]));
				} else {
					to_chat(user, `<span class='warning'>Your ${this.name} contains too much power to consume ${target}!</span>`);
				}
			}
		}
		return 0;
	}
	return 1;
}, false, { argTypes: [{ path: "/list" }, { path: "/atom" }, {  }, { type: 8, path: "/mob" }, {  }] });

// replica_fabricator.dm:290
rt.def("/obj/item/clockwork/replica_fabricator/proc/fabricator_repair_checks", function fabricator_repair_checks(f: Frame, repair_values: Value, target: Value, user: Value, silent: Value) {
	let L: Value = null, C: Value = null, O: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any;
	if (!rt.istype(repair_values, T("/list")) || !target || target.gc_destroyed || !user || user.gc_destroyed) {
		return 0;
	}
	if (rt.istype(target, T("/mob/living"))) {
		if (!is_servant_of_ratvar((L = target))) {
			if (!silent) {
				to_chat(user, `<span class='warning'>${L} does not serve Ratvar!</span>`);
			}
			return 0;
		}
		if (L.health >= L.maxHealth || rt.bitAnd(L.flags, 4096)) {
			if (!silent) {
				to_chat(user, `<span class='warning'>${L == user ? "You are" : `${L} is`} at maximum health!</span>`);
			}
			return 0;
		}
		rt.setAt(repair_values, "amount_to_heal", L.maxHealth - L.health);
	} else if (rt.istype(target, T("/obj"))) {
		if (rt.istype(target, T("/obj/structure/destructible/clockwork"))) {
			if (!(C = target).can_be_repaired) {
				if (!silent) {
					to_chat(user, `<span class='warning'>${C} cannot be repaired!</span>`);
				}
				return 0;
			}
		}
		if ((O = target).obj_integrity >= O.max_integrity) {
			if (!silent) {
				to_chat(user, `<span class='warning'>${O} is at maximum integrity!</span>`);
			}
			return 0;
		}
		rt.setAt(repair_values, "amount_to_heal", O.max_integrity - O.obj_integrity);
	} else {
		return 0;
	}
	if (rt.at(repair_values, "amount_to_heal") <= 0) {
		return 0;
	}
	rt.setAt(repair_values, "healing_for_cycle", min(rt.at(repair_values, "amount_to_heal"), FABRICATOR_REPAIR_PER_TICK));
	rt.setAt(repair_values, "power_required", round(rt.at(repair_values, "healing_for_cycle") * MIN_CLOCKCULT_POWER, MIN_CLOCKCULT_POWER));
	if (!this.can_use_power("ratvar?") && !this.can_use_power(rt.at(repair_values, "power_required"))) {
		if (!silent) {
			$0 = user;
			$1 = rt.at(repair_values, "power_required");
			if (target == user) {
				$2 = "g yourself";
			} else {
				$2 = `g ${target}`;
			}
			$3 = round(rt.at(repair_values, "amount_to_heal") * MIN_CLOCKCULT_POWER, MIN_CLOCKCULT_POWER);
			if (target == user) {
				$4 = "yourself";
			} else {
				$4 = `${target.p_them()}`;
			}
			to_chat($0, `<span class='warning'>You need at least <b>${$1}W</b> power to start repairin${$2}, and at least <b>${$3}W</b> to fully repair ${$4}!</span>`);
		}
		return 0;
	}
	return 1;
}, false, { argTypes: [{ path: "/list" }, { path: "/atom" }, { type: 8, path: "/mob" }, {  }] });

// replica_fabricator.dm:331
rt.def("/obj/item/clockwork/replica_fabricator/proc/sigil_charge_checks", function sigil_charge_checks(f: Frame, charge_values: Value, sigil: Value, user: Value, silent: Value) {
	if (!rt.istype(charge_values, T("/list")) || !sigil || sigil.gc_destroyed || !user || user.gc_destroyed) {
		return 0;
	}
	if (this.can_use_power("ratvar?")) {
		return 0;
	}
	rt.setAt(charge_values, "power_gain", max(0, min(sigil.power_charge, POWER_WALL_MINUS_FLOOR)));
	if (!rt.at(charge_values, "power_gain")) {
		if (!silent) {
			to_chat(user, `<span class='warning'>The ${sigil.sigil_name} contains no power!</span>`);
		}
		return 0;
	}
	if (this.stored_power + rt.at(charge_values, "power_gain") > this.max_power) {
		if (!silent) {
			to_chat(user, `<span class='warning'>Your ${this.name} contains too much power to charge from the ${sigil.sigil_name}!</span>`);
		}
		return 0;
	}
	return 1;
}, false, { argTypes: [{ path: "/list" }, { type: 4, path: "/obj/effect/clockwork/sigil/transmission" }, { type: 8, path: "/mob" }, {  }] });
