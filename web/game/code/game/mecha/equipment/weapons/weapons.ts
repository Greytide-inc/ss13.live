// Based on /tg/station's code/game/mecha/equipment/weapons/weapons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(9628, "/obj/item/mecha_parts/mecha_equipment/weapon", "/obj/item/mecha_parts/mecha_equipment", {
	projectile: null,
	fire_sound: null,
	projectiles_per_shot: 1,
	variance: 0,
	randomspread: 0,
	projectile_delay: 0,
	firing_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/firing_effect"),
	range: 2,
	name: "mecha weapon",
	origin_tech: "materials=3;combat=3",
});

// weapons.dm:14
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (parent_proc()) {
		if (rt.istype(M, T("/obj/mecha/combat"))) {
			return 1;
		}
	}
	return 0;
}, false);

// weapons.dm:23
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/proc/action", function* action(f: Frame, target: Value, params: Value) {
	let targloc: Value = null, i: Value = null, A: Value = null, spread: Value = null;
	let $e: any;
	if (!this.action_checks(target)) {
		return 0;
	}
	let curloc: Value = rt.getStep(f, this.chassis, 0);
	if (!(targloc = rt.getStep(f, target, 0)) || !rt.istype(targloc, T("/turf")) || !curloc) {
		return 0;
	}
	if (targloc == curloc) {
		return 0;
	}
	this.set_ready_state(0);
	rt.forRange(f, 0, 1, this.get_shot_amount(), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		(A = (yield* new_(this.projectile, curloc))).firer = this.chassis.occupant;
		A.original = target;
		A.current = curloc;
		if (!A.suppressed && this.firing_effect_type) {
			yield* new_(this.firing_effect_type, rt.getStep(f, this, 0), this.chassis.dir);
		}
		spread = 0;
		if (this.variance) {
			if (this.randomspread) {
				spread = round((rand() - 0.5) * this.variance);
			} else {
				spread = round((i / this.projectiles_per_shot - 0.5) * this.variance);
			}
		}
		yield* A.preparePixelProjectile(target, targloc, this.chassis.occupant, params, spread);
		yield* A.fire();
		playsound(this.chassis, this.fire_sound, 50, 1);
		yield* sleep(max(0, this.projectile_delay));
	}
	rt.endFor(f, 0);
	this.chassis.log_message(`Fired from ${this.name}, targeting ${target}.`);
	return 1;
}, true);

rt.type(9629, "/obj/item/mecha_parts/mecha_equipment/weapon/energy", "/obj/item/mecha_parts/mecha_equipment/weapon", {
	name: "general energy weapon",
	firing_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/firing_effect/energy"),
});

// weapons.dm:66
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/energy/proc/get_shot_amount", function get_shot_amount(f: Frame) {
	return min(round(this.chassis.cell.charge / this.energy_drain), this.projectiles_per_shot);
});

// weapons.dm:69
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/energy/proc/start_cooldown", function* start_cooldown(f: Frame) {
	this.set_ready_state(0);
	yield* this.chassis.use_power(this.energy_drain * this.get_shot_amount());
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/mecha_parts/mecha_equipment/proc/set_ready_state"), 1)), this.equip_cooldown);
	return f.dot;
}, true);

rt.type(9635, "/obj/item/mecha_parts/mecha_equipment/weapon/energy/plasma", "/obj/item/mecha_parts/mecha_equipment/weapon/energy", {
	equip_cooldown: 10,
	energy_drain: 30,
	projectile: rt.typePath("/obj/item/projectile/plasma/adv/mech"),
	fire_sound: rt.rsc("sound/weapons/plasma_cutter.ogg"),
	name: "217-D Heavy Plasma Cutter",
	desc: "A device that shoots resonant plasma bursts at extreme velocity. The blasts are capable of crushing rock and demolishing solid obstacles.",
	icon_state: "mecha_plasmacutter",
	item_state: "plasmacutter",
	origin_tech: "materials=3;plasmatech=4;engineering=3",
});

// weapons.dm:136
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/energy/plasma/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (parent_proc()) {
		return 1;
	} else if (rt.len(f, M.equipment) < M.max_equip && rt.istype(M, T("/obj/mecha/working"))) {
		return 1;
	}
	return 0;
}, false);

rt.type(9637, "/obj/item/mecha_parts/mecha_equipment/weapon/honker", "/obj/item/mecha_parts/mecha_equipment/weapon", {
	energy_drain: 200,
	equip_cooldown: 150,
	range: 3,
	name: "１HoNkER BlAsT 5000",
	desc: "Equipment for clown exosuits. Spreads fun and joy to everyone around. Honk!",
	icon_state: "mecha_honker",
});

// weapons.dm:162
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/honker/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (parent_proc()) {
		if (rt.istype(M, T("/obj/mecha/combat/honker"))) {
			return 1;
		}
	}
	return 0;
}, false);

// weapons.dm:168
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/honker/proc/action", function* action(f: Frame, target: Value, params: Value) {
	let M: Value = null, H: Value = null;
	let $1: any, $e: any;
	if (!this.action_checks(target)) {
		return f.dot;
	}
	playsound(this.chassis, rt.rsc("sound/items/airhorn.ogg"), 100, 1);
	this.chassis.occupant_message("<font color='red' size='5'>HONK</font>");
	for (M of each(ohearers(6, this.chassis), T("/mob/living/carbon"))) {
		if (rt.istype(M, T("/mob/living/carbon/human"))) {
			if (rt.istype((H = M).ears, T("/obj/item/clothing/ears/earmuffs"))) {
				continue;
			}
		}
		to_chat(M, "<font color='red' size='7'>HONK</font>");
		yield* M.SetSleeping(0);
		M.stuttering += 20;
		M.adjustEarDamage(0, 30);
		yield* M.Knockdown(60);
		if (prob(30)) {
			yield* M.Stun(200);
			yield* M.Unconscious(80);
		} else {
			M.Jitter(500);
		}
	}
	this.log_message(`Honked from ${this.name}. HONK!`);
	let _T: Value = rt.getStep(f, this, 0);
	let $0: any = `${key_name_admin(this.chassis.occupant)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [this.chassis.occupant])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [this.chassis.occupant])}`;
	if (_T) {
		$1 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
	} else {
		$1 = "nonexistent location";
	}
	message_admins(`${$0} used a Mecha Honker in ${`${$1}`}`, 0, 1);
	log_game(`${this.chassis.occupant.ckey}(${this.chassis.occupant}) used a Mecha Honker in ${`(${_T.x},${_T.y},${_T.z})`}`);
	return 1;
}, true);

rt.type(9638, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic", "/obj/item/mecha_parts/mecha_equipment/weapon", {
	projectiles: null,
	projectile_energy_cost: null,
	fire_sound: rt.rsc("sound/weapons/gunshot.ogg"),
	name: "general ballisic weapon",
});

// weapons.dm:203
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/get_shot_amount", function get_shot_amount(f: Frame) {
	return min(this.projectiles, this.projectiles_per_shot);
});

// weapons.dm:206
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/action_checks", function action_checks(f: Frame, target: Value) {
	if (!parent_proc()) {
		return 0;
	}
	if (this.projectiles <= 0) {
		return 0;
	}
	return 1;
}, false);

// weapons.dm:213
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/get_equip_info", function get_equip_info(f: Frame) {
	let $2: any;
	let $0: any = parent_proc();
	let $1: any = this.projectiles;
	if (this.projectiles < rt.initial(f, this, "projectiles")) {
		$2 = fmt(" - <a href='?src=＃;rearm=1'>Rearm</a>", [this]);
	} else {
		$2 = null;
	}
	return `${$0} [${$1}]${$2}`;
});

// weapons.dm:217
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/rearm", function* rearm(f: Frame) {
	let projectiles_to_add: Value = null;
	if (this.projectiles < rt.initial(f, this, "projectiles")) {
		projectiles_to_add = rt.initial(f, this, "projectiles") - this.projectiles;
		while (this.chassis.get_charge() >= this.projectile_energy_cost && projectiles_to_add) {
			this.projectiles++;
			projectiles_to_add--;
			yield* this.chassis.use_power(this.projectile_energy_cost);
		}
	}
	send_byjax(this.chassis.occupant, "exosuit.browser", fmt("＃", [this]), this.get_equip_info());
	this.log_message(`Rearmed ${this.name}.`);
	return 1;
}, true);

// weapons.dm:229
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/needs_rearm", function needs_rearm(f: Frame) {
	f.dot = (!(this.projectiles > 0) ? 1 : 0);
	return f.dot;
});

// weapons.dm:234
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (rt.at(href_list, "rearm")) {
		yield* this.rearm();
	}
	return f.dot;
}, true);

// weapons.dm:240
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/action", function* action(f: Frame, target: Value) {
	if (!(yield* parent_proc())) return f.dot;
	this.projectiles -= this.get_shot_amount();
	send_byjax(this.chassis.occupant, "exosuit.browser", fmt("＃", [this]), this.get_equip_info());
	return 1;
}, true);

rt.type(9644, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic", {
	missile_speed: 2,
	missile_range: 30,
	diags_first: 0,
});

// weapons.dm:310
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/proc/action", function* action(f: Frame, target: Value) {
	if (!this.action_checks(target)) {
		return f.dot;
	}
	let O: Value = (yield* new_(this.projectile, this.chassis.loc));
	playsound(this.chassis, this.fire_sound, 50, 1);
	this.log_message(`Launched a ${O.name} from ${this.name}, targeting ${target}.`);
	this.projectiles--;
	yield* this.proj_init(O);
	yield* O.throw_at(target, this.missile_range, this.missile_speed, { spin: 0, diagonals_first: this.diags_first });
	return 1;
}, true);

rt.type(9645, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/flashbang", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher", {
	det_time: 20,
	projectile: rt.typePath("/obj/item/weapon/grenade/flashbang"),
	fire_sound: rt.rsc("sound/weapons/grenadelaunch.ogg"),
	projectiles: 6,
	missile_speed: 1.5,
	projectile_energy_cost: 800,
	equip_cooldown: 60,
	name: "１SGL-6 grenade launcher",
	desc: "A weapon for combat exosuits. Launches primed flashbangs.",
	icon_state: "mecha_grenadelnchr",
	origin_tech: "combat=4;engineering=4",
});

// weapons.dm:339
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/flashbang/proc/proj_init", function* proj_init(f: Frame, F: Value) {
	let $2: any;
	let _T: Value = rt.getStep(f, this, 0);
	let $0: any = `${key_name_admin(this.chassis.occupant)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [this.chassis.occupant])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [this.chassis.occupant])}`;
	let $1: any = this;
	if (_T) {
		$2 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	message_admins(`${$0} fired a ${$1} in ${`${$2}`}`, 0, 1);
	log_game(`${key_name(this.chassis.occupant)} fired a ${this} ${`(${_T.x},${_T.y},${_T.z})`}`);
	yield* addtimer((yield* new_(T("/datum/callback"), F, P("/obj/item/weapon/grenade/flashbang/proc/prime"))), this.det_time);
	return f.dot;
}, true);

rt.type(9647, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/banana_mortar", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher", {
	projectile: rt.typePath("/obj/item/weapon/grown/bananapeel"),
	fire_sound: rt.rsc("sound/items/bikehorn.ogg"),
	projectiles: 15,
	missile_speed: 1.5,
	projectile_energy_cost: 100,
	equip_cooldown: 20,
	name: "banana mortar",
	desc: "Equipment for clown exosuits. Launches banana peels.",
	icon_state: "mecha_bananamrtr",
});

// weapons.dm:365
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/banana_mortar/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (parent_proc()) {
		if (rt.istype(M, T("/obj/mecha/combat/honker"))) {
			return 1;
		}
	}
	return 0;
}, false);

rt.type(9648, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/mousetrap_mortar", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher", {
	projectile: rt.typePath("/obj/item/device/assembly/mousetrap/armed"),
	fire_sound: rt.rsc("sound/items/bikehorn.ogg"),
	projectiles: 15,
	missile_speed: 1.5,
	projectile_energy_cost: 100,
	equip_cooldown: 10,
	name: "mousetrap mortar",
	desc: "Equipment for clown exosuits. Launches armed mousetraps.",
	icon_state: "mecha_mousetrapmrtr",
});

// weapons.dm:382
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/mousetrap_mortar/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (parent_proc()) {
		if (rt.istype(M, T("/obj/mecha/combat/honker"))) {
			return 1;
		}
	}
	return 0;
}, false);

// weapons.dm:388
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/mousetrap_mortar/proc/proj_init", function proj_init(f: Frame, M: Value) {
	M.secured = 1;
	return f.dot;
});

rt.type(9649, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/punching_glove", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher", {
	energy_drain: 250,
	equip_cooldown: 20,
	range: 3,
	missile_range: 5,
	fire_sound: rt.rsc("sound/items/bikehorn.ogg"),
	projectiles: 10,
	projectile_energy_cost: 500,
	diags_first: 1,
	name: "１Oingo Boingo Punch-face",
	desc: "Equipment for clown exosuits. Delivers fun right to your face!",
	icon_state: "mecha_punching_glove",
	projectile: rt.typePath("/obj/item/punching_glove"),
});

// weapons.dm:407
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/punching_glove/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (parent_proc()) {
		if (rt.istype(M, T("/obj/mecha/combat/honker"))) {
			return 1;
		}
	}
	return 0;
}, false);

// weapons.dm:413
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/punching_glove/proc/action", function* action(f: Frame, target: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	this.chassis.occupant_message("<font color='red' size='5'>HONK</font>");
	return f.dot;
}, true);

// weapons.dm:418
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/punching_glove/proc/proj_init", function* proj_init(f: Frame, PG: Value) {
	if (!rt.istype(PG, T("/obj/item/punching_glove"))) {
		return f.dot;
	}
	yield* this.chassis.Beam(PG, { icon_state: "chain", time: this.missile_range * 20, maxdistance: this.missile_range + 2, beam_sleep_time: 1 });
	return f.dot;
}, true);

rt.type(9650, "/obj/item/punching_glove", "/obj/item", {
	name: "punching glove",
	desc: "INCOMING HONKS",
	throwforce: 35,
	icon_state: "punching_glove",
});

// weapons.dm:430
rt.def("/obj/item/punching_glove/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	let AM: Value = null;
	if (yield* parent_proc()) return f.dot;
	if (rt.istype(hit_atom, T("/atom/movable"))) {
		yield* (AM = hit_atom).throw_at(get_edge_target_turf(AM, rt.getDir(f, this, AM)), 7, 2);
	}
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });
