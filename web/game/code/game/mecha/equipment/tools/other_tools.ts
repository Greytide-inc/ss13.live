// Based on /tg/station's code/game/mecha/equipment/tools/other_tools.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, add, fmt } = rt;


rt.type(9614, "/obj/item/mecha_parts/mecha_equipment/teleporter", "/obj/item/mecha_parts/mecha_equipment", {
	equip_cooldown: 150,
	energy_drain: 1000,
	range: 2,
	name: "mounted teleporter",
	desc: "An exosuit module that allows exosuits to teleport to any position in view.",
	icon_state: "mecha_teleport",
	origin_tech: "bluespace=7",
});

// other_tools.dm:17
rt.def("/obj/item/mecha_parts/mecha_equipment/teleporter/proc/action", function* action(f: Frame, target: Value) {
	let _T: Value = null;
	if (!(yield* this.action_checks(target)) || f.src.loc.z == ZLEVEL_CENTCOM) {
		return f.dot;
	}
	if (!(_T = rt.getStep(f, target, 0))) return f.dot;
	yield* do_teleport(this.chassis, _T, 4);
	return 1;
}, true);

rt.type(9615, "/obj/item/mecha_parts/mecha_equipment/wormhole_generator", "/obj/item/mecha_parts/mecha_equipment", {
	equip_cooldown: 50,
	energy_drain: 300,
	range: 2,
	name: "mounted wormhole generator",
	desc: "An exosuit module that allows generating of small quasi-stable wormholes.",
	icon_state: "mecha_wholegen",
	origin_tech: "bluespace=4;magnets=4;plasmatech=2",
});

// other_tools.dm:38
rt.def("/obj/item/mecha_parts/mecha_equipment/wormhole_generator/proc/action", function* action(f: Frame, target: Value) {
	let theareas: Value = null, _T: Value = null, clear: Value = null, O: Value = null, target_turf: Value = null;
	let $1: any, $e: any;
	if (!(yield* g.srcCall(f, "action_checks", target)) || f.src.loc.z == ZLEVEL_CENTCOM) {
		return f.dot;
	}
	if (!rt.len(f, (theareas = get_areas_in_range(100, rt.sv(f, "chassis"))))) {
		return f.dot;
	}
	let thearea: Value = pick(theareas);
	let L: Value = list();
	let pos: Value = rt.getStep(f, f.src, 0);
	for (_T of each(get_area_turfs(thearea.type), T("/turf"))) {
		if (!_T.density && pos.z == _T.z) {
			clear = 1;
			O = null;
			for (O of each(_T, T("/obj"))) {
				if (O.density) {
					clear = 0;
					break;
				}
			}
			if (clear) {
				L += _T;
			}
		}
	}
	if (!rt.len(f, L)) {
		return f.dot;
	}
	if (!(target_turf = pick(L))) {
		return f.dot;
	}
	let created: Value = (yield* create_portal_pair(rt.getStep(f, f.src, 0), target_turf, f.src, 300, 1, T("/obj/effect/portal/anom")));
	let _T_6: Value = rt.getStep(f, target, 0);
	let $0: any = `${key_name_admin(rt.sv(f, "chassis").occupant)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.sv(f, "chassis").occupant])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.sv(f, "chassis").occupant])}`;
	if (_T_6) {
		$1 = `${`(${_T_6.x},${_T_6.y},${_T_6.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T_6.x};Y=${_T_6.y};Z=${_T_6.z}'>JMP</a>)`}`;
	} else {
		$1 = "nonexistent location";
	}
	message_admins(`${$0} used a Wormhole Generator in ${`${$1}`}`, 0, 1);
	log_game(`${key_name(rt.sv(f, "chassis").occupant)} used a Wormhole Generator in ${`(${_T_6.x},${_T_6.y},${_T_6.z})`}`);
	f.src = null;
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/______qdel_list_wrapper"), created)), rand(150, 300), 8);
	return 1;
}, true);

rt.type(9616, "/obj/item/mecha_parts/mecha_equipment/gravcatapult", "/obj/item/mecha_parts/mecha_equipment", {
	locked: null,
	mode: 1,
	equip_cooldown: 10,
	energy_drain: 100,
	range: 3,
	name: "mounted gravitational catapult",
	desc: "An exosuit mounted Gravitational Catapult.",
	icon_state: "mecha_teleport",
	origin_tech: "bluespace=3;magnets=3;engineering=4",
});

// other_tools.dm:84
rt.def("/obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/action", function* action(f: Frame, target: Value) {
	let atoms: Value = null, A: Value = null, iter: Value = null, i: Value = null, _T: Value = null;
	let $e: any;
	if (!(yield* this.action_checks(target))) {
		return f.dot;
	}
	if (this.mode === 1) {
		if (!this.locked) {
			if (!rt.istype(target, T("/atom/movable")) || target.anchored) {
				yield* this.occupant_message(`Unable to lock on ${target}`);
				return f.dot;
			}
			this.locked = target;
			yield* this.occupant_message(`Locked on ${target}`);
			send_byjax(this.chassis.occupant, "exosuit.browser", fmt("＃", [f.src]), f.src.get_equip_info());
		} else if (target != this.locked) {
			if (rt.isIn(f, this.locked, view(this.chassis))) {
				yield* this.locked.throw_at(target, 14, 1.5);
				this.locked = null;
				send_byjax(this.chassis.occupant, "exosuit.browser", fmt("＃", [f.src]), f.src.get_equip_info());
				return 1;
			} else {
				this.locked = null;
				yield* this.occupant_message(`Lock on ${this.locked} disengaged.`);
				send_byjax(this.chassis.occupant, "exosuit.browser", fmt("＃", [f.src]), f.src.get_equip_info());
			}
		}
	} else if (this.mode === 2) {
		atoms = list();
		if (isturf(target)) {
			atoms = range(3, target);
		} else {
			atoms = orange(3, target);
		}
		for (A of each(atoms, T("/atom/movable"))) {
			if (A.anchored) {
				continue;
			}
			rt.spawnTail(f, 0, "/obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/action: spawn at game/mecha/equipment/tools/other_tools.dm:113", target, atoms, A, iter, i, _T);
		}
		_T = rt.getStep(f, target, 0);
		log_game(`${this.chassis.occupant.ckey}(${this.chassis.occupant}) used a Gravitational Catapult in (${_T.x},${_T.y},${_T.z})`);
		return 1;
	}
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/action: spawn at game/mecha/equipment/tools/other_tools.dm:113", function* (f: Frame, target: Value, atoms: Value, A: Value, iter: Value, i: Value, _T: Value) {
	let $e: any;
	iter = 5 - get_dist(A, target);
	i = null;
	rt.forRange(f, 1, 0, iter, 1);
	while (($e = rt.next(f, 1)) !== undefined) {
		i = $e;
		yield* step_away(A, target);
		yield* sleep(2);
	}
	rt.endFor(f, 1);
	return null;
});

// other_tools.dm:124
rt.def("/obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/get_equip_info", function get_equip_info(f: Frame) {
	let $1: any;
	let $0: any = parent_proc();
	if (this.mode == 1) {
		$1 = `(${(this.locked || "Nothing")})`;
	} else {
		$1 = null;
	}
	return fmt("＀ ＀ [<a href='?src=＃;mode=1'>S</a>|<a href='?src=＃;mode=2'>P</a>]", [$0, $1, f.src, f.src]);
});

// other_tools.dm:127
rt.def("/obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (rt.at(href_list, "mode")) {
		this.mode = text2num(rt.at(href_list, "mode"));
		send_byjax(this.chassis.occupant, "exosuit.browser", fmt("＃", [f.src]), f.src.get_equip_info());
	}
	return f.dot;
}, true);

rt.type(9617, "/obj/item/mecha_parts/mecha_equipment/anticcw_armor_booster", "/obj/item/mecha_parts/mecha_equipment", {
	deflect_coeff: 1.15,
	damage_coeff: 0.8,
	equip_cooldown: 10,
	energy_drain: 50,
	range: 0,
	selectable: 0,
	name: "armor booster module (Close Combat Weaponry)",
	desc: "Boosts exosuit armor against armed melee attacks. Requires energy to operate.",
	icon_state: "mecha_abooster_ccw",
	origin_tech: "materials=4;combat=4",
});

// other_tools.dm:152
rt.def("/obj/item/mecha_parts/mecha_equipment/anticcw_armor_booster/proc/attack_react", function* attack_react(f: Frame) {
	if (!(yield* this.action_checks(f.src))) return f.dot;
	yield* this.start_cooldown();
	return 1;
}, true);

rt.type(9618, "/obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster", "/obj/item/mecha_parts/mecha_equipment", {
	deflect_coeff: 1.15,
	damage_coeff: 0.8,
	equip_cooldown: 10,
	energy_drain: 50,
	range: 0,
	selectable: 0,
	name: "armor booster module (Ranged Weaponry)",
	desc: "Boosts exosuit armor against ranged attacks. Completely blocks taser shots. Requires energy to operate.",
	icon_state: "mecha_abooster_proj",
	origin_tech: "materials=4;combat=3;engineering=3",
});

// other_tools.dm:171
rt.def("/obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster/proc/projectile_react", function* projectile_react(f: Frame) {
	if (!(yield* this.action_checks(f.src))) return f.dot;
	yield* this.start_cooldown();
	return 1;
}, true);

rt.type(9619, "/obj/item/mecha_parts/mecha_equipment/repair_droid", "/obj/item/mecha_parts/mecha_equipment", {
	health_boost: 1,
	droid_overlay: null,
	repairable_damage: null,
	energy_drain: 50,
	range: 0,
	selectable: 0,
	name: "exosuit repair droid",
	desc: "An automated repair droid for exosuits. Scans for damage and repairs it. Can fix almost all types of external or internal damage.",
	icon_state: "repair_droid",
	origin_tech: "magnets=3;programming=3;engineering=4",
});

// other_tools.dm:192
rt.def("/obj/item/mecha_parts/mecha_equipment/repair_droid/proc/Destroy", function* Destroy(f: Frame) {
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	if (this.chassis) {
		this.chassis.cut_overlay(this.droid_overlay);
	}
	return (yield* parent_proc());
}, true);

// other_tools.dm:198
rt.def("/obj/item/mecha_parts/mecha_equipment/repair_droid/proc/attach", function attach(f: Frame, M: Value) {
	parent_proc();
	this.droid_overlay = new_(T("/icon"), f.src.icon, { icon_state: "repair_droid" });
	M.add_overlay(this.droid_overlay);
	return f.dot;
}, false);

// other_tools.dm:203
rt.def("/obj/item/mecha_parts/mecha_equipment/repair_droid/proc/detach", function* detach(f: Frame) {
	this.chassis.cut_overlay(this.droid_overlay);
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	yield* parent_proc();
	return f.dot;
}, true);

// other_tools.dm:208
rt.def("/obj/item/mecha_parts/mecha_equipment/repair_droid/proc/get_equip_info", function get_equip_info(f: Frame) {
	let $0: any, $3: any;
	if (!this.chassis) {
		return f.dot;
	}
	if (this.equip_ready) {
		$0 = "#0f0";
	} else {
		$0 = "#f00";
	}
	let $1: any = f.src.name;
	let $2: any = f.src;
	if (this.equip_ready) {
		$3 = "A";
	} else {
		$3 = "Dea";
	}
	return fmt("<span style=\"color:＀;\">*</span>&nbsp; ＀ - <a href='?src=＃;toggle_repairs=1'>＀ctivate</a>", [$0, $1, $2, $3]);
});

// other_tools.dm:213
rt.def("/obj/item/mecha_parts/mecha_equipment/repair_droid/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (!rt.at(href_list, "toggle_repairs")) return f.dot;
	this.chassis.cut_overlay(this.droid_overlay);
	if (this.equip_ready) {
		if (!f.src.isprocessing) {
			f.src.isprocessing = 1;
			GLOB.SSobj.processing += f.src;
		}
		this.droid_overlay = (yield* new_(T("/icon"), f.src.icon, { icon_state: "repair_droid_a" }));
		yield* this.log_message("Activated.");
		yield* this.set_ready_state(0);
	} else {
		f.src.isprocessing = 0;
		GLOB.SSobj.processing -= f.src;
		this.droid_overlay = (yield* new_(T("/icon"), f.src.icon, { icon_state: "repair_droid" }));
		yield* this.log_message("Deactivated.");
		yield* this.set_ready_state(1);
	}
	this.chassis.add_overlay(this.droid_overlay);
	send_byjax(this.chassis.occupant, "exosuit.browser", fmt("＃", [f.src]), f.src.get_equip_info());
	return f.dot;
}, true);

// other_tools.dm:231
rt.def("/obj/item/mecha_parts/mecha_equipment/repair_droid/proc/process", function* process(f: Frame) {
	let int_dam_flag: Value = null;
	if (!this.chassis) {
		f.src.isprocessing = 0;
		GLOB.SSobj.processing -= f.src;
		yield* this.set_ready_state(1);
		return f.dot;
	}
	let h_boost: Value = this.health_boost;
	let repaired: Value = 0;
	if (rt.bitAnd(this.chassis.internal_damage, 4)) {
		h_boost *= -2;
	} else if (this.chassis.internal_damage && prob(15)) {
		for (int_dam_flag of each(this.repairable_damage)) {
			if (rt.bitAnd(this.chassis.internal_damage, int_dam_flag)) {
				this.chassis.clearInternalDamage(int_dam_flag);
				repaired = 1;
				break;
			}
		}
	}
	if (this.health_boost < 0 || this.chassis.obj_integrity < this.chassis.max_integrity) {
		this.chassis.obj_integrity += min(this.health_boost, this.chassis.max_integrity - this.chassis.obj_integrity);
		repaired = 1;
	}
	if (repaired) {
		if (!(yield* this.chassis.use_power(this.energy_drain))) {
			f.src.isprocessing = 0;
			GLOB.SSobj.processing -= f.src;
			yield* this.set_ready_state(1);
		}
	} else {
		f.src.isprocessing = 0;
		GLOB.SSobj.processing -= f.src;
		yield* this.set_ready_state(1);
		this.chassis.cut_overlay(this.droid_overlay);
		this.droid_overlay = (yield* new_(T("/icon"), f.src.icon, { icon_state: "repair_droid" }));
		this.chassis.add_overlay(this.droid_overlay);
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(9620, "/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay", "/obj/item/mecha_parts/mecha_equipment", {
	coeff: 100,
	use_channels: null,
	energy_drain: 0,
	range: 0,
	selectable: 0,
	name: "exosuit energy relay",
	desc: "An exosuit module that wirelessly drains energy from any available power channel in area. The performance index is quite low.",
	icon_state: "tesla",
	origin_tech: "magnets=4;powerstorage=4;engineering=4",
});

// other_tools.dm:276
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/Destroy", function* Destroy(f: Frame) {
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	return (yield* parent_proc());
}, true);

// other_tools.dm:280
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/detach", function* detach(f: Frame) {
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	yield* parent_proc();
	return f.dot;
}, true);

// other_tools.dm:287
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/get_charge", function get_charge(f: Frame) {
	let pow_chan: Value = null;
	if (this.equip_ready) {
		return f.dot;
	}
	let A: Value = get_area(this.chassis);
	if (!(pow_chan = this.get_power_channel(A))) return f.dot;
	return 1000;
});

// other_tools.dm:296
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/get_power_channel", function get_power_channel(f: Frame, A: Value) {
	let pow_chan: Value = null, c: Value = null;
	if (A) {
		for (c of each(this.use_channels)) {
			if (A.powered(c)) {
				pow_chan = c;
				break;
			}
		}
	}
	return pow_chan;
});

// other_tools.dm:303
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (!rt.at(href_list, "toggle_relay")) return f.dot;
	if (this.equip_ready) {
		if (!f.src.isprocessing) {
			f.src.isprocessing = 1;
			GLOB.SSobj.processing += f.src;
		}
		yield* this.set_ready_state(0);
		yield* this.log_message("Activated.");
	} else {
		f.src.isprocessing = 0;
		GLOB.SSobj.processing -= f.src;
		yield* this.set_ready_state(1);
		yield* this.log_message("Deactivated.");
	}
	return f.dot;
}, true);

// other_tools.dm:315
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/get_equip_info", function get_equip_info(f: Frame) {
	let $0: any, $3: any;
	if (!this.chassis) {
		return f.dot;
	}
	if (this.equip_ready) {
		$0 = "#0f0";
	} else {
		$0 = "#f00";
	}
	let $1: any = f.src.name;
	let $2: any = f.src;
	if (this.equip_ready) {
		$3 = "A";
	} else {
		$3 = "Dea";
	}
	return fmt("<span style=\"color:＀;\">*</span>&nbsp; ＀ - <a href='?src=＃;toggle_relay=1'>＀ctivate</a>", [$0, $1, $2, $3]);
});

// other_tools.dm:320
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/process", function* process(f: Frame) {
	let cur_charge: Value = null, A: Value = null, pow_chan: Value = null, c: Value = null;
	if (!this.chassis || rt.bitAnd(this.chassis.internal_damage, 4)) {
		f.src.isprocessing = 0;
		GLOB.SSobj.processing -= f.src;
		yield* this.set_ready_state(1);
		return f.dot;
	}
	if ((cur_charge = this.chassis.get_charge()) === null || !this.chassis.cell) {
		f.src.isprocessing = 0;
		GLOB.SSobj.processing -= f.src;
		yield* this.set_ready_state(1);
		yield* this.occupant_message("No powercell detected.");
		return f.dot;
	}
	if (!(cur_charge < this.chassis.cell.maxcharge)) return f.dot;
	if (!(A = get_area(this.chassis))) return f.dot;
	for (c of each(list(1, 3, 2))) {
		if (A.powered(c)) {
			pow_chan = c;
			break;
		}
	}
	if (!pow_chan) return f.dot;
	let delta: Value = min(20, this.chassis.cell.maxcharge - cur_charge);
	yield* this.chassis.give_power(delta);
	yield* A.use_power(delta * this.coeff, pow_chan);
	return f.dot;
}, true, { waitfor: false });

rt.type(9621, "/obj/item/mecha_parts/mecha_equipment/generator", "/obj/item/mecha_parts/mecha_equipment", {
	coeff: 100,
	fuel: null,
	max_fuel: 150000,
	fuel_per_cycle_idle: 25,
	fuel_per_cycle_active: 200,
	power_per_cycle: 20,
	range: 1,
	name: "exosuit plasma converter",
	desc: "An exosuit module that generates power using solid plasma as fuel. Pollutes the environment.",
	icon_state: "tesla",
	origin_tech: "plasmatech=2;powerstorage=2;engineering=2",
});

// other_tools.dm:363
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.generator_init();
	return f.dot;
}, true);

// other_tools.dm:367
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/Destroy", function* Destroy(f: Frame) {
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	return (yield* parent_proc());
}, true);

// other_tools.dm:371
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/generator_init", function* generator_init(f: Frame) {
	this.fuel = (yield* new_(T("/obj/item/stack/sheet/mineral/plasma"), f.src));
	this.fuel.amount = 0;
	return f.dot;
}, true);

// other_tools.dm:375
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/detach", function* detach(f: Frame) {
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	yield* parent_proc();
	return f.dot;
}, true);

// other_tools.dm:379
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (!rt.at(href_list, "toggle")) return f.dot;
	if (this.equip_ready) {
		yield* this.set_ready_state(0);
		if (!f.src.isprocessing) {
			f.src.isprocessing = 1;
			GLOB.SSobj.processing += f.src;
		}
		yield* this.log_message("Activated.");
	} else {
		yield* this.set_ready_state(1);
		f.src.isprocessing = 0;
		GLOB.SSobj.processing -= f.src;
		yield* this.log_message("Deactivated.");
	}
	return f.dot;
}, true);

// other_tools.dm:391
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/get_equip_info", function get_equip_info(f: Frame) {
	let output: Value = null;
	let $4: any;
	if (!(output = parent_proc())) return f.dot;
	let $0: any = output;
	let $1: any = this.fuel;
	let $2: any = round(this.fuel.amount * this.fuel.perunit, 0.1);
	let $3: any = f.src;
	if (this.equip_ready) {
		$4 = "A";
	} else {
		$4 = "Dea";
	}
	return fmt("＀ [＀: ＀ cm<sup>3</sup>] - <a href='?src=＃;toggle=1'>＀ctivate</a>", [$0, $1, $2, $3, $4]);
});

// other_tools.dm:397
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/action", function* action(f: Frame, target: Value) {
	let result: Value = null;
	if (!this.chassis) return f.dot;
	if (!(result = (yield* this.load_fuel(target)))) return f.dot;
	send_byjax(this.chassis.occupant, "exosuit.browser", fmt("＃", [f.src]), f.src.get_equip_info());
	return f.dot;
}, true);

// other_tools.dm:402
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/load_fuel", function* load_fuel(f: Frame, _P: Value) {
	let to_load: Value = null, units: Value = null;
	if (_P.type == this.fuel.type && _P.amount > 0) {
		if (to_load = max(this.max_fuel - this.fuel.amount * this.fuel.perunit, 0)) {
			units = min(max(round(to_load / _P.perunit), 1), _P.amount);
			this.fuel.amount += units;
			yield* _P.use(units);
			yield* this.occupant_message(fmt("＀ unit５ of ＀ successfully loaded.", [units, this.fuel]));
			return units;
		} else {
			yield* this.occupant_message("Unit is full.");
			return 0;
		}
	} else {
		yield* this.occupant_message(`<span class='warning'>${this.fuel} traces in target minimal! ${_P} cannot be used as fuel.</span>`);
		return f.dot;
	}
}, true);

// other_tools.dm:418
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/attackby", function* attackby(f: Frame, weapon: Value, user: Value, params: Value) {
	yield* this.load_fuel(weapon);
	return f.dot;
}, true);

// other_tools.dm:421
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/critfail", function* critfail(f: Frame) {
	let _T: Value = null, GM: Value = null;
	yield* parent_proc();
	if (!rt.istype((_T = rt.getStep(f, f.src, 0)), T("/turf/open"))) {
		return f.dot;
	}
	(GM = (yield* new_(T("/datum/gas_mixture")))).assert_gas("plasma");
	if (prob(10)) {
		rt.modAt(rt.index(GM.gases, "plasma"), 1, 100, add);
		GM.temperature = 1773.15;
		_T.visible_message(`The ${f.src} suddenly disgorges a cloud of heated plasma.`);
		yield* qdel(f.src);
	} else {
		rt.modAt(rt.index(GM.gases, "plasma"), 1, 5, add);
		GM.temperature = rt.istype(_T, T("/turf/open")) ? _T.air.return_temperature() : T20C;
		_T.visible_message(`The ${f.src} suddenly disgorges a cloud of plasma.`);
	}
	yield* _T.assume_air(GM);
	return f.dot;
}, true);

// other_tools.dm:440
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/process", function* process(f: Frame) {
	let cur_charge: Value = null;
	if (!this.chassis) {
		f.src.isprocessing = 0;
		GLOB.SSobj.processing -= f.src;
		yield* this.set_ready_state(1);
		return f.dot;
	}
	if (this.fuel.amount <= 0) {
		f.src.isprocessing = 0;
		GLOB.SSobj.processing -= f.src;
		yield* this.log_message("Deactivated - no fuel.");
		yield* this.set_ready_state(1);
		return f.dot;
	}
	if ((cur_charge = this.chassis.get_charge()) === null) {
		yield* this.set_ready_state(1);
		yield* this.occupant_message("No powercell detected.");
		yield* this.log_message("Deactivated.");
		f.src.isprocessing = 0;
		GLOB.SSobj.processing -= f.src;
		return f.dot;
	}
	let use_fuel: Value = this.fuel_per_cycle_idle;
	if (cur_charge < this.chassis.cell.maxcharge) {
		use_fuel = this.fuel_per_cycle_active;
		yield* this.chassis.give_power(this.power_per_cycle);
	}
	this.fuel.amount -= min(use_fuel / this.fuel.perunit, this.fuel.amount);
	yield* this.update_equip_info();
	return 1;
}, true, { waitfor: false });

rt.type(9622, "/obj/item/mecha_parts/mecha_equipment/generator/nuclear", "/obj/item/mecha_parts/mecha_equipment/generator", {
	rad_per_cycle: 0.3,
	max_fuel: 50000,
	fuel_per_cycle_idle: 10,
	fuel_per_cycle_active: 30,
	power_per_cycle: 50,
	name: "exonuclear reactor",
	desc: "An exosuit module that generates power using uranium as fuel. Pollutes the environment.",
	icon_state: "tesla",
	origin_tech: "powerstorage=4;engineering=4",
});

// other_tools.dm:477
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/nuclear/proc/generator_init", function* generator_init(f: Frame) {
	this.fuel = (yield* new_(T("/obj/item/stack/sheet/mineral/uranium"), f.src));
	this.fuel.amount = 0;
	return f.dot;
}, true);

// other_tools.dm:484
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/nuclear/proc/process", function* process(f: Frame) {
	if (!(yield* parent_proc())) return f.dot;
	yield* radiation_pulse(rt.getStep(f, f.src, 0), 2, 7, this.rad_per_cycle, 1);
	return f.dot;
}, true, { waitfor: false });
