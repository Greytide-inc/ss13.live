// Based on /tg/station's code/game/mecha/equipment/tools/work_tools.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(9623, "/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp", "/obj/item/mecha_parts/mecha_equipment", {
	dam_force: 20,
	cargo_holder: null,
	equip_cooldown: 15,
	energy_drain: 10,
	name: "hydraulic clamp",
	desc: "Equipment for engineering exosuits. Lifts objects and loads them into cargo.",
	icon_state: "mecha_clamp",
});

// work_tools.dm:15
rt.def("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (parent_proc()) {
		if (rt.istype(M, T("/obj/mecha/working/ripley"))) {
			return 1;
		}
	}
	return 0;
}, false);

// work_tools.dm:21
rt.def("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/proc/attach", function attach(f: Frame, M: Value) {
	parent_proc();
	this.cargo_holder = M;
	return f.dot;
}, false);

// work_tools.dm:26
rt.def("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/proc/detach", function* detach(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = null;
	}
	yield* parent_proc();
	this.cargo_holder = null;
	return f.dot;
}, true, { args: ["moveto"] });

// work_tools.dm:30
rt.def("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/proc/action", function* action(f: Frame, target: Value) {
	let O: Value = null, M: Value = null;
	if (!this.action_checks(target)) {
		return f.dot;
	}
	if (!this.cargo_holder) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj"))) {
		if (!(O = target).anchored) {
			if (rt.len(f, this.cargo_holder.cargo) < this.cargo_holder.cargo_capacity) {
				this.chassis.visible_message(`${this.chassis} lifts ${target} and starts to load it into cargo compartment.`);
				O.anchored = 1;
				if (yield* this.do_after_cooldown(target)) {
					this.cargo_holder.cargo += O;
					O.loc = this.chassis;
					O.anchored = 0;
					this.occupant_message(`<span class='notice'>${target} successfully loaded.</span>`);
					this.log_message(`Loaded ${O}. Cargo compartment capacity: ${this.cargo_holder.cargo_capacity - rt.len(f, this.cargo_holder.cargo)}`);
				} else {
					O.anchored = rt.initial(f, O, "anchored");
				}
			} else {
				this.occupant_message("<span class='warning'>Not enough room in cargo compartment!</span>");
			}
		} else {
			this.occupant_message(`<span class='warning'>${target} is firmly secured!</span>`);
		}
	} else {
		if (!rt.istype(target, T("/mob/living"))) return f.dot;
		if ((M = target).stat == 2) {
			return f.dot;
		}
		if (this.chassis.occupant.a_intent == "harm") {
			yield* M.take_overall_damage(this.dam_force);
			if (!M) {
				return f.dot;
			}
			yield* M.adjustOxyLoss(round(this.dam_force / 2));
			yield* M.updatehealth();
			target.visible_message(`<span class='danger'>${this.chassis} squeezes ${target}.</span>`, `<span class='userdanger'>${this.chassis} squeezes ${target}.</span>`, "<span class='italics'>You hear something crack.</span>");
			add_logs(this.chassis.occupant, M, "attacked", `${this.name}`, `(INTENT: ${uppertext(this.chassis.occupant.a_intent)}) (DAMTYE: ${uppertext(this.damtype)})`);
		} else {
			yield* step_away(M, this.chassis);
			this.occupant_message(`You push ${target} out of the way.`);
			this.chassis.visible_message(`${this.chassis} pushes ${target} out of the way.`);
		}
		return 1;
	}
	return f.dot;
}, true);

rt.type(9624, "/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/kill", "/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp", {
	energy_drain: 0,
	name: "１KILL CLAMP",
	desc: "They won't know what clamped them!",
});

// work_tools.dm:81
rt.def("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/kill/proc/action", function* action(f: Frame, target: Value) {
	let O: Value = null, M: Value = null;
	if (!this.action_checks(target)) {
		return f.dot;
	}
	if (!this.cargo_holder) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj"))) {
		if (!(O = target).anchored) {
			if (rt.len(f, this.cargo_holder.cargo) < this.cargo_holder.cargo_capacity) {
				this.chassis.visible_message(`${this.chassis} lifts ${target} and starts to load it into cargo compartment.`);
				O.anchored = 1;
				if (yield* this.do_after_cooldown(target)) {
					this.cargo_holder.cargo += O;
					O.loc = this.chassis;
					O.anchored = 0;
					this.occupant_message(`<span class='notice'>${target} successfully loaded.</span>`);
					this.log_message(`Loaded ${O}. Cargo compartment capacity: ${this.cargo_holder.cargo_capacity - rt.len(f, this.cargo_holder.cargo)}`);
				} else {
					O.anchored = rt.initial(f, O, "anchored");
				}
			} else {
				this.occupant_message("<span class='warning'>Not enough room in cargo compartment!</span>");
			}
		} else {
			this.occupant_message(`<span class='warning'>${target} is firmly secured!</span>`);
		}
	} else {
		if (!rt.istype(target, T("/mob/living"))) return f.dot;
		if ((M = target).stat == 2) {
			return f.dot;
		}
		if (this.chassis.occupant.a_intent == "harm") {
			target.visible_message(`<span class='danger'>${this.chassis} destroys ${target} in an unholy fury.</span>`, `<span class='userdanger'>${this.chassis} destroys ${target} in an unholy fury.</span>`);
		}
		if (this.chassis.occupant.a_intent == "disarm") {
			target.visible_message(`<span class='danger'>${this.chassis} rips ${target}'s arms off.</span>`, `<span class='userdanger'>${this.chassis} rips ${target}'s arms off.</span>`);
		} else {
			yield* step_away(M, this.chassis);
			target.visible_message(`${this.chassis} tosses ${target} like a piece of paper.`);
		}
		return 1;
	}
	return f.dot;
}, true);

rt.type(9625, "/obj/item/mecha_parts/mecha_equipment/extinguisher", "/obj/item/mecha_parts/mecha_equipment", {
	equip_cooldown: 5,
	energy_drain: 0,
	range: 3,
	name: "exosuit extinguisher",
	desc: "Equipment for engineering exosuits. A rapid-firing high capacity fire extinguisher.",
	icon_state: "mecha_exting",
});

// work_tools.dm:129
rt.def("/obj/item/mecha_parts/mecha_equipment/extinguisher/proc/New", function* New(f: Frame) {
	yield* this.create_reagents(1000);
	yield* this.reagents.add_reagent("water", 1000);
	yield* parent_proc();
	return f.dot;
}, true);

// work_tools.dm:135
rt.def("/obj/item/mecha_parts/mecha_equipment/extinguisher/proc/action", function* action(f: Frame, target: Value) {
	let WT: Value = null, direction: Value = null, _T: Value = null, T1: Value = null, T2: Value = null, the_targets: Value = null, a: Value = null, W: Value = null, my_target: Value = null, R: Value = null, b: Value = null, W_turf: Value = null, atm: Value = null;
	if (!this.action_checks(target) || get_dist(this.chassis, target) > 3) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj/structure/reagent_dispensers/watertank")) && get_dist(this.chassis, target) <= 1) {
		yield* (WT = target).reagents.trans_to(this, 1000);
		this.occupant_message("<span class='notice'>Extinguisher refilled.</span>");
		playsound(this.chassis, rt.rsc("sound/effects/refill.ogg"), 50, 1, -6);
	} else {
		if (this.reagents.total_volume > 0) {
			playsound(this.chassis, rt.rsc("sound/effects/extinguish.ogg"), 75, 1, -3);
			direction = rt.getDir(f, this.chassis, target);
			_T = rt.getStep(f, target, 0);
			T1 = rt.getStep(f, _T, turn(direction, 90));
			T2 = rt.getStep(f, _T, turn(direction, -90));
			the_targets = list(_T, T1, T2);
			rt.spawnTail(f, 0, "/obj/item/mecha_parts/mecha_equipment/extinguisher/proc/action: spawn at game/mecha/equipment/tools/work_tools.dm:152", target, WT, direction, _T, T1, T2, the_targets, a, W, my_target, R, b, W_turf, atm);
		}
		return 1;
	}
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/mecha_parts/mecha_equipment/extinguisher/proc/action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/mecha_parts/mecha_equipment/extinguisher/proc/action: spawn at game/mecha/equipment/tools/work_tools.dm:152", function* (f: Frame, target: Value, WT: Value, direction: Value, _T: Value, T1: Value, T2: Value, the_targets: Value, a: Value, W: Value, my_target: Value, R: Value, b: Value, W_turf: Value, atm: Value) {
	a = null;
	a = 0;
	while (a < 5) {
		if (!(W = (yield* new_(T("/obj/effect/particle_effect/water"), rt.getStep(f, this.chassis, 0))))) {
			return f.dot;
		}
		my_target = pick(the_targets);
		R = (yield* new_(T("/datum/reagents"), 5));
		W.reagents = R;
		R.my_atom = W;
		yield* this.reagents.trans_to(W, 1);
		b = null;
		b = 0;
		while (b < 4) {
			if (!W) {
				return f.dot;
			}
			yield* step_towards(W, my_target);
			if (!W) {
				return f.dot;
			}
			W_turf = rt.getStep(f, W, 0);
			yield* W.reagents.reaction(W_turf);
			atm = null;
			for (atm of each(W_turf, T("/atom"))) {
				yield* W.reagents.reaction(atm);
			}
			if (W.loc == my_target) {
				break;
			}
			yield* sleep(2);
			b++;
		}
		a++;
	}
	return null;
});

// work_tools.dm:178
rt.def("/obj/item/mecha_parts/mecha_equipment/extinguisher/proc/get_equip_info", function get_equip_info(f: Frame) {
	return `${parent_proc()} [${this.reagents.total_volume}]`;
});

// work_tools.dm:184
rt.def("/obj/item/mecha_parts/mecha_equipment/extinguisher/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (parent_proc()) {
		if (rt.istype(M, T("/obj/mecha/working"))) {
			return 1;
		}
	}
	return 0;
}, false);

rt.type(9626, "/obj/item/mecha_parts/mecha_equipment/rcd", "/obj/item/mecha_parts/mecha_equipment", {
	mode: 0,
	equip_cooldown: 10,
	energy_drain: 250,
	range: 3,
	name: "mounted RCD",
	desc: "An exosuit-mounted Rapid Construction Device.",
	icon_state: "mecha_rcd",
	origin_tech: "materials=4;bluespace=3;magnets=4;powerstorage=4;engineering=4",
});

// work_tools.dm:202
rt.def("/obj/item/mecha_parts/mecha_equipment/rcd/proc/New", function* New(f: Frame) {
	GLOB.rcd_list += this;
	yield* parent_proc();
	return f.dot;
}, true);

// work_tools.dm:206
rt.def("/obj/item/mecha_parts/mecha_equipment/rcd/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.rcd_list -= this;
	return (yield* parent_proc());
}, true);

// work_tools.dm:210
rt.def("/obj/item/mecha_parts/mecha_equipment/rcd/proc/action", function* action(f: Frame, target: Value) {
	let W: Value = null, F: Value = null, S: Value = null, _T: Value = null;
	if (rt.istype(target, T("/turf/open/space/transit"))) {
		return f.dot;
	}
	if (!isturf(target) && !rt.istype(target, T("/obj/machinery/door/airlock"))) {
		target = rt.getStep(f, target, 0);
	}
	if (!this.action_checks(target) || get_dist(this.chassis, target) > 3) {
		return f.dot;
	}
	playsound(this.chassis, rt.rsc("sound/machines/click.ogg"), 50, 1);
	if (this.mode === 0) {
		if (rt.istype(target, T("/turf/closed/wall"))) {
			this.occupant_message(`Deconstructing ${(W = target)}...`);
			if (yield* this.do_after_cooldown(W)) {
				yield* this.chassis.spark_system.start();
				yield* W.ChangeTurf(T("/turf/open/floor/plating"));
				playsound(W, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			}
		} else if (rt.istype(target, T("/turf/open/floor"))) {
			this.occupant_message(`Deconstructing ${(F = target)}...`);
			if (yield* this.do_after_cooldown(target)) {
				yield* this.chassis.spark_system.start();
				yield* F.ChangeTurf(F.baseturf);
				playsound(F, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			}
		} else if (rt.istype(target, T("/obj/machinery/door/airlock"))) {
			this.occupant_message(`Deconstructing ${target}...`);
			if (yield* this.do_after_cooldown(target)) {
				yield* this.chassis.spark_system.start();
				yield* qdel(target);
				playsound(target, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			}
		}
	} else if (this.mode === 1) {
		if (rt.istype(target, T("/turf/open/space"))) {
			S = target;
			this.occupant_message("Building Floor...");
			if (yield* this.do_after_cooldown(S)) {
				yield* S.ChangeTurf(T("/turf/open/floor/plating"));
				playsound(S, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
				yield* this.chassis.spark_system.start();
			}
		} else if (rt.istype(target, T("/turf/open/floor"))) {
			F = target;
			this.occupant_message("Building Wall...");
			if (yield* this.do_after_cooldown(F)) {
				yield* F.ChangeTurf(T("/turf/closed/wall"));
				playsound(F, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
				yield* this.chassis.spark_system.start();
			}
		}
	} else if (this.mode === 2) {
		if (!rt.istype(target, T("/turf/open/floor"))) return f.dot;
		this.occupant_message("Building Airlock...");
		if (!(yield* this.do_after_cooldown(target))) return f.dot;
		yield* this.chassis.spark_system.start();
		(_T = (yield* new_(T("/obj/machinery/door/airlock"), target))).autoclose = 1;
		playsound(target, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
		playsound(target, rt.rsc("sound/effects/sparks2.ogg"), 50, 1);
	}
	return f.dot;
}, true);

// work_tools.dm:269
rt.def("/obj/item/mecha_parts/mecha_equipment/rcd/proc/do_after_cooldown", function* do_after_cooldown(f: Frame, target: Value) {
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// work_tools.dm:272
rt.def("/obj/item/mecha_parts/mecha_equipment/rcd/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (rt.at(href_list, "mode")) {
		this.mode = text2num(rt.at(href_list, "mode"));
		if (this.mode === 0) {
			this.occupant_message("Switched RCD to Deconstruct.");
			this.energy_drain = rt.initial(f, this, "energy_drain");
		} else if (this.mode === 1) {
			this.occupant_message("Switched RCD to Construct.");
			this.energy_drain = 2 * rt.initial(f, this, "energy_drain");
		} else if (this.mode === 2) {
			this.occupant_message("Switched RCD to Construct Airlock.");
			this.energy_drain = 2 * rt.initial(f, this, "energy_drain");
		}
	}
	return f.dot;
}, true);

// work_tools.dm:288
rt.def("/obj/item/mecha_parts/mecha_equipment/rcd/proc/get_equip_info", function get_equip_info(f: Frame) {
	return fmt("＀ [<a href='?src=＃;mode=0'>D</a>|<a href='?src=＃;mode=1'>C</a>|<a href='?src=＃;mode=2'>A</a>]", [parent_proc(), this, this, this]);
});

rt.type(9627, "/obj/item/mecha_parts/mecha_equipment/cable_layer", "/obj/item/mecha_parts/mecha_equipment", {
	event: null,
	old_turf: null,
	last_piece: null,
	cable: null,
	max_cable: 1000,
	name: "cable layer",
	desc: "Equipment for engineering exosuits. Lays cable along the exosuit's path.",
	icon_state: "mecha_wire",
});

// work_tools.dm:304
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/New", function* New(f: Frame) {
	this.cable = (yield* new_(T("/obj/item/stack/cable_coil"), this));
	this.cable.amount = 0;
	yield* parent_proc();
	return f.dot;
}, true);

// work_tools.dm:309
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (parent_proc()) {
		if (rt.istype(M, T("/obj/mecha/working"))) {
			return 1;
		}
	}
	return 0;
}, false);

// work_tools.dm:315
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/attach", function attach(f: Frame) {
	parent_proc();
	this.event = this.chassis.events.addEvent("onMove", new_(T("/datum/callback"), this, P("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/layCable")));
	return f.dot;
});

// work_tools.dm:320
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/detach", function* detach(f: Frame) {
	yield* this.chassis.events.clearEvent("onMove", this.event);
	return (yield* parent_proc());
}, true);

// work_tools.dm:325
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/Destroy", function* Destroy(f: Frame) {
	if (this.chassis) {
		yield* this.chassis.events.clearEvent("onMove", this.event);
	}
	return (yield* parent_proc());
}, true);

// work_tools.dm:329
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/action", function* action(f: Frame, target: Value) {
	let cur_amount: Value = null, to_load: Value = null;
	if (!this.action_checks(target)) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj/item/stack/cable_coil")) && target.amount) {
		cur_amount = this.cable ? this.cable.amount : 0;
		if (to_load = max(this.max_cable - cur_amount, 0)) {
			to_load = min(target.amount, to_load);
			if (!this.cable) {
				this.cable = (yield* new_(T("/obj/item/stack/cable_coil"), this));
				this.cable.amount = 0;
			}
			this.cable.amount += to_load;
			yield* target.use(to_load);
			this.occupant_message(`<span class='notice'>${to_load} meters of cable successfully loaded.</span>`);
			send_byjax(this.chassis.occupant, "exosuit.browser", fmt("＃", [this]), this.get_equip_info());
		} else {
			this.occupant_message("<span class='warning'>Reel is full.</span>");
		}
	} else {
		this.occupant_message(`<span class='warning'>Unable to load ${target} - no cable found.</span>`);
	}
	return f.dot;
}, true);

// work_tools.dm:350
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let m: Value = null, CC: Value = null;
	yield* parent_proc();
	if (rt.at(href_list, "toggle")) {
		this.set_ready_state((!this.equip_ready ? 1 : 0));
		this.occupant_message(`${this} ${this.equip_ready ? "dea" : "a"}ctivated.`);
		this.log_message(`${this.equip_ready ? "Dea" : "A"}ctivated.`);
		return f.dot;
	}
	if (rt.at(href_list, "cut")) {
		if (this.cable && this.cable.amount) {
			if (m = min((m = round((yield* g.op(f, "Prompt", [32], [min(this.cable.amount, 30), "Cut cable", "Please specify the length of cable to cut", this.chassis.occupant, null])), 1)), this.cable.amount)) {
				yield* this.use_cable(m);
				(CC = (yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, this.chassis, 0)))).amount = m;
			}
		} else {
			this.occupant_message("There's no more cable on the reel.");
		}
	}
	return f.dot;
}, true);

// work_tools.dm:369
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/get_equip_info", function get_equip_info(f: Frame) {
	let output: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	if (output = parent_proc()) {
		$0 = output;
		if (this.cable) {
			$1 = this.cable.amount;
		} else {
			$1 = 0;
		}
		if (this.cable && this.cable.amount) {
			$2 = this;
			if (!this.equip_ready) {
				$3 = "Dea";
			} else {
				$3 = "A";
			}
			$2 = fmt("- <a href='?src=＃;toggle=1'>＀ctivate</a>|<a href='?src=＃;cut=1'>Cut</a>", [$2, $3, this]);
		} else {
			$2 = null;
		}
		return `${$0} [Cable: ${$1} m]${$2}`;
	}
	return f.dot;
});

// work_tools.dm:375
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/use_cable", function* use_cable(f: Frame, amount: Value) {
	if (!this.cable || this.cable.amount < 1) {
		this.set_ready_state(1);
		this.occupant_message(`Cable depleted, ${this} deactivated.`);
		this.log_message(`Cable depleted, ${this} deactivated.`);
		return f.dot;
	}
	if (this.cable.amount < amount) {
		this.occupant_message("No enough cable to finish the task.");
		return f.dot;
	}
	yield* this.cable.use(amount);
	this.update_equip_info();
	return 1;
}, true);

// work_tools.dm:388
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/reset", function reset(f: Frame) {
	this.last_piece = null;
	return f.dot;
});

// work_tools.dm:391
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/dismantleFloor", function* dismantleFloor(f: Frame, new_turf: Value) {
	let _T: Value = null;
	if (rt.istype(new_turf, T("/turf/open/floor"))) {
		if (!rt.istype((_T = new_turf), T("/turf/open/floor/plating"))) {
			if (!_T.broken && !_T.burnt) {
				yield* new_(_T.floor_tile, _T);
			}
			yield* _T.make_plating();
		}
	}
	return (!new_turf.intact ? 1 : 0);
}, true);

// work_tools.dm:400
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/layCable", function* layCable(f: Frame, new_turf: Value) {
	let LC: Value = null, NC: Value = null, PN: Value = null;
	if (this.equip_ready || !rt.istype(new_turf, T("/turf")) || !(yield* this.dismantleFloor(new_turf))) {
		return (yield* this.reset());
	}
	let fdirn: Value = turn(this.chassis.dir, 180);
	for (LC of each(new_turf, T("/obj/structure/cable"))) {
		if (LC.d1 == fdirn || LC.d2 == fdirn) {
			return (yield* this.reset());
		}
	}
	if (!(yield* this.use_cable(1))) {
		return (yield* this.reset());
	}
	(NC = (yield* new_(T("/obj/structure/cable"), new_turf))).cableColor("red");
	NC.d1 = 0;
	NC.d2 = fdirn;
	yield* NC.update_icon();
	if (this.last_piece && this.last_piece.d2 != this.chassis.dir) {
		this.last_piece.d1 = min(this.last_piece.d2, this.chassis.dir);
		this.last_piece.d2 = max(this.last_piece.d2, this.chassis.dir);
		yield* this.last_piece.update_icon();
		PN = this.last_piece.powernet;
	}
	if (!PN) {
		GLOB.powernets += (PN = (yield* new_(T("/datum/powernet"))));
	}
	NC.powernet = PN;
	PN.cables += NC;
	yield* NC.mergeConnectedNetworks(NC.d2);
	this.last_piece = NC;
	return 1;
}, true, { argTypes: [{ path: "/turf" }] });
