// Based on /tg/station's code/game/machinery/porta_turret/portable_turret.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, truthy, fmt } = rt;


rt.type(10750, "/obj/machinery/porta_turret", "/obj/machinery", {
	base_icon_state: "standard",
	emp_vunerable: 1,
	scan_range: 7,
	base: null,
	raised: 0,
	raising: 0,
	locked: 1,
	controllock: 0,
	installation: rt.typePath("/obj/item/weapon/gun/energy/e_gun/turret"),
	stored_gun: null,
	gun_charge: 0,
	mode: 0,
	stun_projectile: null,
	stun_projectile_sound: null,
	lethal_projectile: null,
	lethal_projectile_sound: null,
	reqpower: 500,
	always_up: 0,
	has_cover: 1,
	cover: null,
	last_fired: 0,
	shot_delay: 15,
	check_records: 1,
	criminals: 1,
	auth_weapons: 0,
	stun_all: 0,
	check_anomalies: 1,
	attacked: 0,
	on: 1,
	faction: "turret",
	spark_system: null,
	cp: null,
	anchored: 1,
	name: "turret",
	icon: rt.rsc("icons/obj/turrets.dmi"),
	icon_state: "turretCover",
	layer: 3,
	invisibility: 60,
	density: 1,
	use_power: 1,
	idle_power_usage: 50,
	active_power_usage: 300,
	req_access: null,
	power_channel: 1,
	obj_integrity: 160,
	max_integrity: 160,
	integrity_failure: 80,
	armor: null,
});

// portable_turret.dm:18
rt.def("/obj/machinery/porta_turret/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(1);
	this.armor = rt.alist(f, ["melee", 50, "bullet", 30, "laser", 30, "energy", 30, "bomb", 30, "bio", 0, "rad", 0, "fire", 90, "acid", 90]);
	return f.dot;
});

// portable_turret.dm:77
rt.def("/obj/machinery/porta_turret/proc/New", function* New(f: Frame, loc: Value) {
	let base: Value = null;
	yield* parent_proc();
	if (!this.base) {
		this.base = f.src;
	}
	yield* this.update_icon();
	this.spark_system = (yield* new_(T("/datum/effect_system/spark_spread")));
	yield* this.spark_system.set_up(5, 0, this);
	yield* this.spark_system.attach(this);
	yield* this.setup();
	if (this.has_cover) {
		this.cover = (yield* new_(T("/obj/machinery/porta_turret_cover"), loc));
		this.cover.parent_turret = this;
		(base = mutable_appearance(rt.rsc("icons/obj/turrets.dmi"), "basedark")).layer = NOT_HIGH_OBJ_LAYER;
		this.underlays += base;
	}
	if (this.has_cover) return f.dot;
	yield* ImmediateInvokeAsync(this, P("/obj/machinery/porta_turret/proc/popUp"));
	return f.dot;
}, true);

// portable_turret.dm:97
rt.def("/obj/machinery/porta_turret/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (!this.anchored) {
		this.icon_state = "turretCover";
		return f.dot;
	}
	if (rt.bitAnd(this.stat, 1)) {
		this.icon_state = `${this.base_icon_state}_broken`;
	} else if (this.powered()) {
		if (this.on && this.raised) {
			if (this.mode === 0) {
				this.icon_state = `${this.base_icon_state}_stun`;
			} else if (this.mode === 1) {
				this.icon_state = `${this.base_icon_state}_lethal`;
			}
		} else {
			this.icon_state = `${this.base_icon_state}_off`;
		}
	} else {
		this.icon_state = `${this.base_icon_state}_unpowered`;
	}
	return f.dot;
});

// portable_turret.dm:119
rt.def("/obj/machinery/porta_turret/proc/setup", function* setup(f: Frame, turret_gun: Value) {
	let gun_properties: Value = null;
	if (this.stored_gun) {
		yield* qdel(this.stored_gun);
		this.stored_gun = null;
	}
	if (this.installation && !turret_gun) {
		this.stored_gun = (yield* new_(this.installation, this));
	} else if (turret_gun) {
		this.stored_gun = turret_gun;
	}
	this.stun_projectile = rt.index((gun_properties = this.stored_gun.get_turret_properties()), "stun_projectile");
	this.stun_projectile_sound = rt.at(gun_properties, "stun_projectile_sound");
	this.lethal_projectile = rt.at(gun_properties, "lethal_projectile");
	this.lethal_projectile_sound = rt.at(gun_properties, "lethal_projectile_sound");
	this.base_icon_state = rt.at(gun_properties, "base_icon_state");
	if (rt.at(gun_properties, "shot_delay")) {
		this.shot_delay = rt.at(gun_properties, "shot_delay");
	}
	if (rt.at(gun_properties, "reqpower")) {
		this.reqpower = rt.at(gun_properties, "reqpower");
	}
	yield* this.update_icon();
	return gun_properties;
}, true);

// portable_turret.dm:148
rt.def("/obj/machinery/porta_turret/proc/Destroy", function* Destroy(f: Frame) {
	if (this.cover) {
		yield* qdel(this.cover);
		this.cover = null;
	}
	this.base = null;
	if (this.cp) {
		this.cp.turrets -= this;
		this.cp = null;
	}
	if (this.stored_gun) {
		yield* qdel(this.stored_gun);
		this.stored_gun = null;
	}
	yield* qdel(this.spark_system);
	this.spark_system = null;
	return (yield* parent_proc());
}, true);

// portable_turret.dm:163
rt.def("/obj/machinery/porta_turret/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// portable_turret.dm:166
rt.def("/obj/machinery/porta_turret/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// portable_turret.dm:174
rt.def("/obj/machinery/porta_turret/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	let $1: any;
	let $0: any = this;
	if (this.on) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	dat += fmt("Status: <a href='?src=＃;power=1'>＀</a><br>", [$0, $1]);
	dat += `Behaviour controls are ${this.locked ? "locked" : "unlocked"}<br>`;
	if (!this.locked) {
		$0 = this;
		if (this.auth_weapons) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat += fmt("Check for Weapon Authorization: <A href='?src=＃;operation=authweapon'>＀</A><BR>", [$0, $1]);
		$0 = this;
		if (this.check_records) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat += fmt("Check Security Records: <A href='?src=＃;operation=checkrecords'>＀</A><BR>", [$0, $1]);
		$0 = this;
		if (this.criminals) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat += fmt("Neutralize Identified Criminals: <A href='?src=＃;operation=shootcrooks'>＀</A><BR>", [$0, $1]);
		$0 = this;
		if (this.stun_all) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat += fmt("Neutralize All Non-Security and Non-Command Personnel: <A href='?src=＃;operation=shootall'>＀</A><BR>", [$0, $1]);
		$0 = this;
		if (this.check_anomalies) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat += fmt("Neutralize All Unidentified Life Signs: <A href='?src=＃;operation=checkxenos'>＀</A><BR>", [$0, $1]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "autosec", "Automatic Portable Turret Installation", 300, 300))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// portable_turret.dm:189
rt.def("/obj/machinery/porta_turret/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (rt.at(href_list, "power") && !this.locked) {
		if (this.anchored) {
			this.on = (!this.on ? 1 : 0);
		} else {
			to_chat(f.usr, "<span class='notice'>It has to be secured first!</span>");
		}
		yield* this.interact(f.usr);
		return f.dot;
	}
	if (!rt.at(href_list, "operation")) return f.dot;
	const item = rt.at(href_list, "operation");
	if (item === "authweapon") {
		this.auth_weapons = (!this.auth_weapons ? 1 : 0);
	} else if (item === "checkrecords") {
		this.check_records = (!this.check_records ? 1 : 0);
	} else if (item === "shootcrooks") {
		this.criminals = (!this.criminals ? 1 : 0);
	} else if (item === "shootall") {
		this.stun_all = (!this.stun_all ? 1 : 0);
	} else if (item === "checkxenos") {
		this.check_anomalies = (!this.check_anomalies ? 1 : 0);
	}
	yield* this.interact(f.usr);
	return f.dot;
}, true);

// portable_turret.dm:217
rt.def("/obj/machinery/porta_turret/proc/power_change", function power_change(f: Frame) {
	if (!this.anchored) {
		this.update_icon();
		return f.dot;
	}
	if (rt.bitAnd(this.stat, 1)) {
		this.update_icon();
	} else if (this.powered()) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		this.update_icon();
	} else {
		rt.spawnTail(f, rand(0, 15), "/obj/machinery/porta_turret/proc/power_change: spawn at game/machinery/porta_turret/portable_turret.dm:225");
	}
	return f.dot;
});

// a spawn(rt.call(f, P("/proc/rand"), null, [0, 15])) body of /obj/machinery/porta_turret/proc/power_change, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret/proc/power_change: spawn at game/machinery/porta_turret/portable_turret.dm:225", function* (f: Frame) {
	(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	yield* this.update_icon();
	return null;
});

// portable_turret.dm:233
rt.def("/obj/machinery/porta_turret/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let M: Value = null;
	if (rt.bitAnd(this.stat, 1)) {
		if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
			to_chat(user, "<span class='notice'>You begin prying the metal coverings off...</span>");
			if (yield* do_after(user, 20 * I.toolspeed, { target: this })) {
				if (prob(70)) {
					if (this.stored_gun) {
						yield* this.stored_gun.forceMove(this.loc);
					}
					to_chat(user, "<span class='notice'>You remove the turret and salvage some components.</span>");
					if (prob(50)) {
						yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, rand(1, 4));
					}
					if (prob(50)) {
						yield* new_(T("/obj/item/device/assembly/prox_sensor"), this.loc);
					}
				} else {
					to_chat(user, "<span class='notice'>You remove the turret but did not manage to salvage anything.</span>");
				}
				yield* qdel(this);
			}
		}
	} else if (rt.istype(I, T("/obj/item/weapon/wrench")) && !this.on) {
		if (this.raised) {
			return f.dot;
		}
		if (!this.anchored && !this.isinspace()) {
			this.anchored = 1;
			this.invisibility = INVISIBILITY_MAXIMUM;
			yield* this.update_icon();
			to_chat(user, "<span class='notice'>You secure the exterior bolts on the turret.</span>");
			if (this.has_cover) {
				this.cover = (yield* new_(T("/obj/machinery/porta_turret_cover"), this.loc));
				this.cover.parent_turret = this;
			}
		} else if (this.anchored) {
			this.anchored = 0;
			to_chat(user, "<span class='notice'>You unsecure the exterior bolts on the turret.</span>");
			yield* this.update_icon();
			this.invisibility = 0;
			yield* qdel(this.cover);
		}
	} else if (I.GetID()) {
		if (yield* this.allowed(user)) {
			this.locked = (!this.locked ? 1 : 0);
			to_chat(user, `<span class='notice'>Controls are now ${this.locked ? "locked" : "unlocked"}.</span>`);
		} else {
			to_chat(user, "<span class='notice'>Access denied.</span>");
		}
	} else if (rt.istype(I, T("/obj/item/device/multitool")) && !this.locked) {
		(M = I).buffer = this;
		to_chat(user, `<span class='notice'>You add ${this} to multitool buffer.</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// portable_turret.dm:286
rt.def("/obj/machinery/porta_turret/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	to_chat(user, `<span class='warning'>You short out ${this}'s threat assessment circuits.</span>`);
	this.visible_message(`${this} hums oddly...`);
	this.emagged = 1;
	this.controllock = 1;
	this.on = 0;
	yield* this.update_icon();
	yield* sleep(60);
	this.on = 1;
	return f.dot;
}, true);

// portable_turret.dm:298
rt.def("/obj/machinery/porta_turret/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (this.on && this.emp_vunerable) {
		this.check_records = pick(0, 1);
		this.criminals = pick(0, 1);
		this.auth_weapons = pick(0, 1);
		this.stun_all = pick(0, 0, 0, 0, 1);
		this.on = 0;
		rt.spawnTail(f, rand(60, 600), "/obj/machinery/porta_turret/proc/emp_act: spawn at game/machinery/porta_turret/portable_turret.dm:304");
	}
	yield* parent_proc();
	return f.dot;
}, true);

// a spawn((yield* g.call(f, P("/proc/rand"), null, [60, 600]))) body of /obj/machinery/porta_turret/proc/emp_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret/proc/emp_act: spawn at game/machinery/porta_turret/portable_turret.dm:304", function* (f: Frame) {
	if (!this.on) {
		this.on = 1;
	}
	return null;
});

// portable_turret.dm:314
rt.def("/obj/machinery/porta_turret/proc/take_damage", function* take_damage(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* parent_proc());
	// tg bug fix: a lethal hit deletes the turret inside ..() (spark_system nulled): stop here (null.start() runtime).
	if (!f.dot || this.gc_destroyed) return f.dot;
	if (prob(30)) {
		yield* this.spark_system.start();
	}
	if (!(this.on && !this.attacked && !this.emagged)) return f.dot;
	this.attacked = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/porta_turret/proc/reset_attacked"))), 60);
	return f.dot;
}, true, { args: ["damage", "damage_type", "damage_flag", "sound_effect"] });

// portable_turret.dm:326
rt.def("/obj/machinery/porta_turret/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* qdel(this);
	return f.dot;
}, true);

// portable_turret.dm:329
rt.def("/obj/machinery/porta_turret/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	if (!(!rt.bitAnd(this.flags, NODECONSTRUCT) && !rt.bitAnd(this.stat, 1))) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	yield* this.update_icon();
	this.invisibility = 0;
	yield* this.spark_system.start();
	yield* qdel(this.cover);
	return f.dot;
}, true);

// portable_turret.dm:342
rt.def("/obj/machinery/porta_turret/proc/process", function* process(f: Frame) {
	let targets: Value = null;
	if (this.cover === null && this.anchored) {
		if (rt.bitAnd(this.stat, 1)) {
			yield* qdel(this.cover);
		} else if (this.has_cover) {
			this.cover = (yield* new_(T("/obj/machinery/porta_turret_cover"), this.loc));
			this.cover.parent_turret = this;
		}
	}
	if (rt.bitAnd(this.stat, 3)) {
		if (!this.always_up) {
			yield* this.popDown();
		}
		return f.dot;
	}
	if (!this.on) {
		if (!this.always_up) {
			yield* this.popDown();
		}
		return f.dot;
	}
	if (this.tryToShootAt((targets = this.calculate_targets()))) return f.dot;
	if (this.always_up) return f.dot;
	yield* this.popDown();
	return f.dot;
}, true, { waitfor: false });

// Speed: true if some candidate (carbon, simple_animal when check_anomalies, mecha) might be inside view(scan_range, base): same z and
// within scan_range of base's turf (view is a square box). Conservative: any doubt (base not on a turf) says true.
// Reads the atoms' loc/x/y/z/type directly (a turf has x > 0; the loc chain leads from a mob in a locker to its turf), which
// is much cheaper than rt.fv per field over the whole mob list.
const turretTypeOk = new Map();
function turretTypeCand(t: any, T0: any, T1: any, anom: any) {
	let r = turretTypeOk.get(t);
	if (r === undefined) { r = t.isSubtypeOf(T0) ? 1 : (t.isSubtypeOf(T1) ? 2 : 0); turretTypeOk.set(t, r); }
	return r === 1 || (r === 2 && anom);
}
function turretTurf(o: any) {
	let t = o;
	for (let i = 0; i < 20 && t !== null && t !== undefined && t.x === 0; i++) t = t.loc;
	return t === undefined ? null : t;
}
function turretHasCandidate(f: Frame) {
	const bt = turretTurf(rt.sv(f, "base"));
	if (bt === null || !(bt.x > 0)) return true;
	const r = rt.sv(f, "scan_range");
	if (typeof r !== "number") return true;
	const bx = bt.x, by = bt.y, bz = bt.z;
	const anom = truthy(rt.sv(f, "check_anomalies"));
	const carbonT = T("/mob/living/carbon"), saT = T("/mob/living/simple_animal");
	const ml: any = rt.gl("mob_list");
	const items = ml.items;
	for (let i = 0; i < items.length; i++) {
		const m = items[i];
		if (m === null || typeof m !== "object" || m.deleted || !turretTypeCand(m.type, carbonT, saT, anom)) continue;
		const t = turretTurf(m);
		if (t !== null && t.z === bz && Math.abs(t.x - bx) <= r && Math.abs(t.y - by) <= r) return true;
	}
	const mechs: any = rt.gl("mechas_list");
	const mi = mechs.items;
	for (let i = 0; i < mi.length; i++) {
		const m = mi[i];
		if (m === null || typeof m !== "object" || m.deleted) continue;
		const t = turretTurf(m);
		if (t !== null && t.z === bz && Math.abs(t.x - bx) <= r && Math.abs(t.y - by) <= r) return true;
	}
	return false;
}

// portable_turret.dm:369
rt.def("/obj/machinery/porta_turret/proc/calculate_targets", function calculate_targets(f: Frame) {
	let A: Value = null, AA: Value = null, SA: Value = null, C: Value = null, M: Value = null;
	let targets: Value = list();
	if (!turretHasCandidate(f)) return targets;
	let turretview: Value = view(this.scan_range, this.base);
	for (A of each(turretview)) {
		if ((AA = A).invisibility > 25) {
			continue;
		}
		if (this.check_anomalies) {
			if (rt.istype(A, T("/mob/living/simple_animal"))) {
				if ((SA = A).stat || this.in_faction(SA)) {
					continue;
				}
				targets += SA;
			}
		}
		if (rt.istype(A, T("/mob/living/carbon"))) {
			C = A;
			if (this.mode != 1 && (C.stat || C.handcuffed || C.lying)) {
				continue;
			}
			if (this.mode == 1 && C.stat == 2) {
				continue;
			}
			if (rt.istype(C, T("/mob/living/carbon/human")) && !this.in_faction(C)) {
				if (this.assess_perp(C) >= 4) {
					targets += C;
				}
			} else if (this.check_anomalies) {
				if (!this.in_faction(C)) {
					targets += C;
				}
			}
		}
		if (rt.istype(A, T("/obj/mecha"))) {
			if ((M = A).occupant && !this.in_faction(M.occupant)) {
				if (this.assess_perp(M.occupant) >= 4) {
					targets += M;
				}
			}
		}
	}
	return targets;
});

// portable_turret.dm:412
rt.def("/obj/machinery/porta_turret/proc/tryToShootAt", function tryToShootAt(f: Frame, targets: Value) {
	let M: Value = null;
	while (rt.len(f, targets) > 0) {
		targets -= (M = pick(targets));
		if (this.target(M)) {
			return 1;
		}
	}
	return f.dot;
});

// portable_turret.dm:420
rt.def("/obj/machinery/porta_turret/proc/popUp", function* popUp(f: Frame) {
	if (!this.anchored) {
		return f.dot;
	}
	if (this.raising || this.raised) {
		return f.dot;
	}
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	this.invisibility = 0;
	this.raising = 1;
	if (this.cover) {
		flick("popup", this.cover);
	}
	yield* sleep(5);
	this.raising = 0;
	if (this.cover) {
		this.cover.icon_state = "openTurretCover";
	}
	this.raised = 1;
	this.layer = 4;
	return f.dot;
}, true);

// portable_turret.dm:438
rt.def("/obj/machinery/porta_turret/proc/popDown", function* popDown(f: Frame) {
	if (this.raising || !this.raised) {
		return f.dot;
	}
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	this.layer = 3;
	this.raising = 1;
	if (this.cover) {
		flick("popdown", this.cover);
	}
	yield* sleep(POPDOWN_ANIM_TIME);
	this.raising = 0;
	if (this.cover) {
		this.cover.icon_state = "turretCover";
	}
	this.raised = 0;
	this.invisibility = 2;
	yield* this.update_icon();
	return f.dot;
}, true);

// portable_turret.dm:460
rt.def("/obj/machinery/porta_turret/proc/assess_perp", function assess_perp(f: Frame, perp: Value) {
	let perpname: Value = null, R: Value = null;
	let threatcount: Value = 0;
	if (this.emagged) {
		return 10;
	}
	if ((this.stun_all || this.attacked) && !this.allowed(perp)) {
		if (!this.allowed(perp)) {
			return 10;
		}
	}
	if (this.auth_weapons) {
		if (perp.wear_id === null || rt.istype(perp.wear_id.GetID(), T("/obj/item/weapon/card/id/syndicate"))) {
			if (this.allowed(perp)) {
				return 0;
			}
			if (perp.is_holding_item_of_type(T("/obj/item/weapon/gun")) || perp.is_holding_item_of_type(T("/obj/item/weapon/melee/baton"))) {
				threatcount += 4;
			}
			if (rt.istype(perp.belt, T("/obj/item/weapon/gun")) || rt.istype(perp.belt, T("/obj/item/weapon/melee/baton"))) {
				threatcount += 2;
			}
		}
	}
	if (this.check_records) {
		perpname = perp.get_face_name(perp.get_id_name());
		if (!(R = find_record("name", perpname, GLOB.data_core.security)) || rt.index(R.fields, "criminal") == "*Arrest*") {
			threatcount += 4;
		}
	}
	return threatcount;
});

// portable_turret.dm:487
rt.def("/obj/machinery/porta_turret/proc/in_faction", function in_faction(f: Frame, target: Value) {
	if (!rt.isIn(f, this.faction, target.faction)) {
		return 0;
	}
	return 1;
});

// portable_turret.dm:493
rt.def("/obj/machinery/porta_turret/proc/target", function target(f: Frame, target: Value) {
	if (target) {
		rt.spawnTail(f, 0, "/obj/machinery/porta_turret/proc/target: spawn at game/machinery/porta_turret/portable_turret.dm:493", target);
		this.setDir(rt.getDir(f, this.base, target));
		rt.spawnTail(f, 0, "/obj/machinery/porta_turret/proc/target: spawn at game/machinery/porta_turret/portable_turret.dm:496", target);
		return 1;
	}
	return f.dot;
});

// a spawn(0) body of /obj/machinery/porta_turret/proc/target, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret/proc/target: spawn at game/machinery/porta_turret/portable_turret.dm:496", function* (f: Frame, target: Value) {
	yield* this.shootAt(target);
	return null;
});

// a spawn(0) body of /obj/machinery/porta_turret/proc/target, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret/proc/target: spawn at game/machinery/porta_turret/portable_turret.dm:493", function* (f: Frame, target: Value) {
	yield* this.popUp();
	return null;
});

// portable_turret.dm:502
rt.def("/obj/machinery/porta_turret/proc/shootAt", function* shootAt(f: Frame, target: Value) {
	let A: Value = null;
	if (!this.raised) {
		return f.dot;
	}
	if (!this.emagged) {
		if (this.last_fired + this.shot_delay > rt.worldTime(f)) {
			return f.dot;
		}
		this.last_fired = rt.worldTime(f);
	}
	let _T: Value = rt.getStep(f, this, 0);
	let U: Value = rt.getStep(f, target, 0);
	if (!rt.istype(_T, T("/turf")) || !rt.istype(U, T("/turf"))) {
		return f.dot;
	}
	yield* this.update_icon();
	if (this.mode == 0) {
		yield* this.use_power(this.reqpower);
		A = (yield* new_(this.stun_projectile, _T));
		playsound(this.loc, this.stun_projectile_sound, 75, 1);
	} else {
		yield* this.use_power(this.reqpower * 2);
		A = (yield* new_(this.lethal_projectile, _T));
		playsound(this.loc, this.lethal_projectile_sound, 75, 1);
	}
	A.original = target;
	A.starting = _T;
	A.current = _T;
	A.yo = U.y - _T.y;
	A.xo = U.x - _T.x;
	yield* A.fire();
	return A;
}, true);

// portable_turret.dm:543
rt.def("/obj/machinery/porta_turret/proc/setState", function setState(f: Frame, on: Value, mode: Value) {
	if (this.controllock) {
		return f.dot;
	}
	this.on = on;
	this.mode = mode;
	this.power_change();
	return f.dot;
});

rt.type(10752, "/obj/machinery/porta_turret/syndicate", "/obj/machinery/porta_turret", {
	installation: null,
	always_up: 1,
	has_cover: 0,
	scan_range: 9,
	stun_projectile: rt.typePath("/obj/item/projectile/bullet"),
	lethal_projectile: rt.typePath("/obj/item/projectile/bullet"),
	lethal_projectile_sound: rt.rsc("sound/weapons/gunshot.ogg"),
	stun_projectile_sound: rt.rsc("sound/weapons/gunshot.ogg"),
	base_icon_state: "syndie",
	faction: "syndicate",
	emp_vunerable: 0,
	use_power: 0,
	req_access: null,
	icon_state: "syndie_off",
});

// portable_turret.dm:556
rt.def("/obj/machinery/porta_turret/syndicate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(150);
	return f.dot;
});

rt.type(10757, "/obj/machinery/porta_turret/aux_base", "/obj/machinery/porta_turret", {
	installation: null,
	lethal_projectile: rt.typePath("/obj/item/projectile/plasma/turret"),
	lethal_projectile_sound: rt.rsc("sound/weapons/plasma_cutter.ogg"),
	mode: 1,
	faction: "neutral",
	name: "perimeter defense turret",
	desc: "A plasma beam turret calibrated to defend outposts against non-humanoid fauna. It is more effective when exposed to the environment.",
});

// portable_turret.dm:612
rt.def("/obj/machinery/porta_turret/aux_base/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.cover.name = this.name;
	this.cover.desc = this.desc;
	return f.dot;
}, true);

rt.type(10334, "/obj/machinery/turretid", "/obj/machinery", {
	enabled: 1,
	lethal: 0,
	locked: 1,
	control_area: null,
	ailock: 0,
	turrets: null,
	anchored: 1,
	name: "turret control panel",
	desc: "Used to control a room's automated defenses.",
	icon: rt.rsc("icons/obj/machines/turret_control.dmi"),
	icon_state: "control_standby",
	density: 0,
	req_access: null,
	resistance_flags: 115,
});

// portable_turret.dm:657
rt.def("/obj/machinery/turretid/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.turrets = list();

	this.req_access = list(16);
	return f.dot;
});

// portable_turret.dm:661
rt.def("/obj/machinery/turretid/proc/New", function* New(f: Frame) {
	let $0: any;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	yield* parent_proc();
	if (f.args[2]) {
		yield* this.setDir(f.args[1]);
		this.locked = 0;
		if (rt.bitAnd(this.dir, 3)) {
			$0 = 0;
		} else if (this.dir == 4) {
			$0 = -24;
		} else {
			$0 = 24;
		}
		this.pixel_x = $0;
		if (rt.bitAnd(this.dir, 3)) {
			if (this.dir == 1) {
				$0 = -24;
			} else {
				$0 = 24;
			}
		} else {
			$0 = 0;
		}
		this.pixel_y = $0;
	}
	yield* this.power_change();
	return f.dot;
}, true, { args: ["loc", "ndir", "built"] });

// portable_turret.dm:670
rt.def("/obj/machinery/turretid/proc/Destroy", function* Destroy(f: Frame) {
	this.turrets.Cut();
	return (yield* parent_proc());
}, true);

// portable_turret.dm:674
rt.def("/obj/machinery/turretid/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let V: Value = null, A: Value = null, _T: Value = null;
	yield* parent_proc();
	if (!mapload) {
		return f.dot;
	}
	if (this.control_area && istext(this.control_area)) {
		for (V of each(GLOB.sortedAreas)) {
			if ((A = V).name == this.control_area) {
				this.control_area = A;
				break;
			}
		}
	}
	if (!this.control_area) {
		this.control_area = get_area(this);
	}
	for (_T of each(this.control_area, T("/obj/machinery/porta_turret"))) {
		(rt.modSrcVar(f, "turrets", _T, rt.bitOr));
		_T.cp = this;
	}
	return f.dot;
}, true);

// portable_turret.dm:692
rt.def("/obj/machinery/turretid/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let M: Value = null;
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/device/multitool"))) {
		if ((M = I).buffer && rt.istype(M.buffer, T("/obj/machinery/porta_turret"))) {
			(rt.modSrcVar(f, "turrets", M.buffer, rt.bitOr));
			to_chat(user, fmt("You link ％！ with ％！", [M.buffer, this]));
			return f.dot;
		}
	}
	if (rt.istype(user, T("/mob/living/silicon"))) {
		return (yield* this.attack_hand(user));
	}
	if (get_dist(this, user) != 0) return f.dot;
	if (yield* this.allowed(f.usr)) {
		if (this.emagged) {
			to_chat(user, "<span class='notice'>The turret control is unresponsive.</span>");
			return f.dot;
		}
		this.locked = (!this.locked ? 1 : 0);
		to_chat(user, `<span class='notice'>You ${this.locked ? "lock" : "unlock"} the panel.</span>`);
		if (this.locked) {
			if (user.machine == this) {
				yield* user.unset_machine();
				rt.op(f, "Browse", [], [user, null, "window=turretid"], false);
			}
		} else if (user.machine == this) {
			yield* this.attack_hand(user);
		}
	} else {
		to_chat(user, "<span class='warning'>Access denied.</span>");
	}
	return f.dot;
}, true);

// portable_turret.dm:723
rt.def("/obj/machinery/turretid/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	to_chat(user, "<span class='danger'>You short out the turret controls' access analysis module.</span>");
	this.emagged = 1;
	this.locked = 0;
	if (!(user && user.machine == this)) return f.dot;
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// portable_turret.dm:731
rt.def("/obj/machinery/turretid/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	if (!this.ailock || IsAdminGhost(user)) {
		return (yield* this.attack_hand(user));
	}
	to_chat(user, "<span class='notice'>There seems to be a firewall preventing you from accessing this device.</span>");
	return f.dot;
}, true);

// portable_turret.dm:737
rt.def("/obj/machinery/turretid/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let popup: Value = null;
	let $0: any, $1: any, $2: any;
	if (get_dist(this, user) > 0) {
		if (!(rt.istype(user, T("/mob/living/silicon")) || IsAdminGhost(user))) {
			to_chat(user, "<span class='notice'>You are too far away.</span>");
			yield* user.unset_machine();
			rt.op(f, "Browse", [], [user, null, "window=turretid"], false);
			return f.dot;
		}
	}
	yield* user.set_machine(this);
	let area: Value = get_area(this);
	let t: Value = "";
	if (this.locked && !(rt.istype(user, T("/mob/living/silicon")) || IsAdminGhost(user))) {
		t += "<div class='notice icon'>Swipe ID card to unlock interface</div>";
	} else {
		if (!rt.istype(user, T("/mob/living/silicon")) && !IsAdminGhost(user)) {
			t += "<div class='notice icon'>Swipe ID card to lock interface</div>";
		}
		if (this.enabled) {
			$0 = "activated";
		} else {
			$0 = "deactivated";
		}
		$1 = this;
		if (this.enabled) {
			$2 = "Disable";
		} else {
			$2 = "Enable";
		}
		t += fmt("Turrets ＀ - <A href='?src=＃;toggleOn=1'>＀?</a><br>", [$0, $1, $2]);
		if (this.lethal) {
			$0 = "lethal";
		} else {
			$0 = "stun repeatedly";
		}
		$1 = this;
		if (this.lethal) {
			$2 = "Stun repeatedly";
		} else {
			$2 = "Lethal";
		}
		t += fmt("Currently set for ＀ - <A href='?src=＃;toggleLethal=1'>Change to ＀?</a><br>", [$0, $1, $2]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "turretid", `Turret Control Panel (${area.name})`))).set_content(t);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// portable_turret.dm:762
rt.def("/obj/machinery/turretid/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.locked) {
		if (!(rt.istype(f.usr, T("/mob/living/silicon")) || IsAdminGhost(f.usr))) {
			to_chat(f.usr, "Control panel is locked!");
			return f.dot;
		}
	}
	if (rt.at(href_list, "toggleOn")) {
		this.toggle_on();
	} else if (rt.at(href_list, "toggleLethal")) {
		this.toggle_lethal();
	}
	yield* this.attack_hand(f.usr);
	return f.dot;
}, true);

// portable_turret.dm:775
rt.def("/obj/machinery/turretid/proc/toggle_lethal", function toggle_lethal(f: Frame) {
	this.lethal = (!this.lethal ? 1 : 0);
	this.updateTurrets();
	return f.dot;
});

// portable_turret.dm:779
rt.def("/obj/machinery/turretid/proc/toggle_on", function toggle_on(f: Frame) {
	this.enabled = (!this.enabled ? 1 : 0);
	this.updateTurrets();
	return f.dot;
});

// portable_turret.dm:783
rt.def("/obj/machinery/turretid/proc/updateTurrets", function updateTurrets(f: Frame) {
	let aTurret: Value = null;
	for (aTurret of each(this.turrets, T("/obj/machinery/porta_turret"))) {
		aTurret.setState(this.enabled, this.lethal);
	}
	this.update_icon();
	return f.dot;
});

// portable_turret.dm:788
rt.def("/obj/machinery/turretid/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// portable_turret.dm:792
rt.def("/obj/machinery/turretid/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (rt.bitAnd(this.stat, 2)) {
		this.icon_state = "control_off";
	} else if (this.enabled) {
		if (this.lethal) {
			this.icon_state = "control_kill";
		} else {
			this.icon_state = "control_stun";
		}
	} else {
		this.icon_state = "control_standby";
	}
	return f.dot;
});

rt.type(9545, "/obj/item/wallframe/turret_control", "/obj/item/wallframe", {
	name: "turret control frame",
	desc: "Used for building turret control panels",
	icon_state: "apc",
	result_path: rt.typePath("/obj/machinery/turretid"),
	materials: null,
});

// portable_turret.dm:808
rt.def("/obj/item/wallframe/turret_control/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 2000]);
	return f.dot;
});

// portable_turret.dm:811
rt.def("/obj/item/weapon/gun/proc/get_turret_properties", function get_turret_properties(f: Frame) {
	f.dot = list();
	rt.setAt(f.dot, "lethal_projectile", null);
	rt.setAt(f.dot, "lethal_projectile_sound", null);
	rt.setAt(f.dot, "stun_projectile", null);
	rt.setAt(f.dot, "stun_projectile_sound", null);
	rt.setAt(f.dot, "base_icon_state", "standard");
	return f.dot;
});

// portable_turret.dm:819
rt.def("/obj/item/weapon/gun/energy/proc/get_turret_properties", function get_turret_properties(f: Frame) {
	let secondary_ammo: Value = null;
	f.dot = parent_proc();
	let primary_ammo: Value = rt.index(this.ammo_type, 1);
	rt.setAt(f.dot, "stun_projectile", rt.initial(f, primary_ammo, "projectile_type"));
	rt.setAt(f.dot, "stun_projectile_sound", rt.initial(f, primary_ammo, "fire_sound"));
	if (rt.len(f, this.ammo_type) > 1) {
		secondary_ammo = rt.index(this.ammo_type, 2);
		rt.setAt(f.dot, "lethal_projectile", rt.initial(f, secondary_ammo, "projectile_type"));
		rt.setAt(f.dot, "lethal_projectile_sound", rt.initial(f, secondary_ammo, "fire_sound"));
	} else {
		rt.setAt(f.dot, "lethal_projectile", rt.at(f.dot, "stun_projectile"));
		rt.setAt(f.dot, "lethal_projectile_sound", rt.at(f.dot, "stun_projectile_sound"));
	}
	return f.dot;
});

// portable_turret.dm:835
rt.def("/obj/item/weapon/gun/ballistic/proc/get_turret_properties", function get_turret_properties(f: Frame) {
	f.dot = parent_proc();
	let mag: Value = this.mag_type;
	let primary_ammo: Value = rt.initial(f, mag, "ammo_type");
	rt.setAt(f.dot, "base_icon_state", "syndie");
	rt.setAt(f.dot, "stun_projectile", rt.initial(f, primary_ammo, "projectile_type"));
	rt.setAt(f.dot, "stun_projectile_sound", rt.initial(f, primary_ammo, "fire_sound"));
	rt.setAt(f.dot, "lethal_projectile", rt.at(f.dot, "stun_projectile"));
	rt.setAt(f.dot, "lethal_projectile_sound", rt.at(f.dot, "stun_projectile_sound"));
	return f.dot;
});

// portable_turret.dm:847
rt.def("/obj/item/weapon/gun/energy/laser/bluetag/proc/get_turret_properties", function get_turret_properties(f: Frame) {
	f.dot = parent_proc();
	rt.setAt(f.dot, "stun_projectile", T("/obj/item/projectile/beam/lasertag/bluetag"));
	rt.setAt(f.dot, "lethal_projectile", T("/obj/item/projectile/beam/lasertag/bluetag"));
	rt.setAt(f.dot, "base_icon_state", "blue");
	rt.setAt(f.dot, "shot_delay", 30);
	rt.setAt(f.dot, "team_color", "blue");
	return f.dot;
});

// portable_turret.dm:855
rt.def("/obj/item/weapon/gun/energy/laser/redtag/proc/get_turret_properties", function get_turret_properties(f: Frame) {
	f.dot = parent_proc();
	rt.setAt(f.dot, "stun_projectile", T("/obj/item/projectile/beam/lasertag/redtag"));
	rt.setAt(f.dot, "lethal_projectile", T("/obj/item/projectile/beam/lasertag/redtag"));
	rt.setAt(f.dot, "base_icon_state", "red");
	rt.setAt(f.dot, "shot_delay", 30);
	rt.setAt(f.dot, "team_color", "red");
	return f.dot;
});

// portable_turret.dm:863
rt.def("/obj/item/weapon/gun/energy/e_gun/turret/proc/get_turret_properties", function get_turret_properties(f: Frame) {
	f.dot = parent_proc();
	return f.dot;
});

rt.type(10759, "/obj/machinery/porta_turret/lasertag", "/obj/machinery/porta_turret", {
	team_color: null,
	check_records: 0,
	criminals: 0,
	auth_weapons: 1,
	stun_all: 0,
	check_anomalies: 0,
	req_access: null,
});

// portable_turret.dm:876
rt.def("/obj/machinery/porta_turret/lasertag/proc/assess_perp", function assess_perp(f: Frame, perp: Value) {
	f.dot = 0;
	if (this.team_color == "blue") {
		f.dot = 0;
		if (rt.istype(perp.wear_suit, T("/obj/item/clothing/suit/redtag"))) {
			f.dot += 4;
		}
		if (perp.is_holding_item_of_type(T("/obj/item/weapon/gun/energy/laser/redtag"))) {
			f.dot += 4;
		}
		if (rt.istype(perp.belt, T("/obj/item/weapon/gun/energy/laser/redtag"))) {
			f.dot += 2;
		}
	}
	if (this.team_color != "red") return f.dot;
	f.dot = 0;
	if (rt.istype(perp.wear_suit, T("/obj/item/clothing/suit/bluetag"))) {
		f.dot += 4;
	}
	if (perp.is_holding_item_of_type(T("/obj/item/weapon/gun/energy/laser/bluetag"))) {
		f.dot += 4;
	}
	if (!rt.istype(perp.belt, T("/obj/item/weapon/gun/energy/laser/bluetag"))) return f.dot;
	f.dot += 2;
	return f.dot;
});

// portable_turret.dm:895
rt.def("/obj/machinery/porta_turret/lasertag/proc/setup", function* setup(f: Frame, gun: Value) {
	let properties: Value = null;
	if (!rt.index((properties = (yield* parent_proc())), "team_color")) return f.dot;
	this.team_color = rt.at(properties, "team_color");
	return f.dot;
}, true);

// portable_turret.dm:900
rt.def("/obj/machinery/porta_turret/lasertag/proc/interact", function* interact(f: Frame, user: Value) {
	let H: Value = null, popup: Value = null;
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		H = user;
		if (this.team_color == "blue" && rt.istype(H.wear_suit, T("/obj/item/clothing/suit/redtag"))) {
			return f.dot;
		}
		if (this.team_color == "red" && rt.istype(H.wear_suit, T("/obj/item/clothing/suit/bluetag"))) {
			return f.dot;
		}
	}
	let $0: any = this;
	let dat: Value = fmt("Status: <a href='?src=＃;power=1'>＀</a>", [$0, this.on ? "On" : "Off"]);
	(popup = (yield* new_(T("/datum/browser"), user, "autosec", "Automatic Portable Turret Installation", 300, 300))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// portable_turret.dm:923
rt.def("/obj/machinery/porta_turret/lasertag/proc/bullet_act", function* bullet_act(f: Frame, P: Value) {
	f.dot = (yield* parent_proc());
	if (!this.on) return f.dot;
	if (this.team_color == "blue") {
		if (rt.istype(P, T("/obj/item/projectile/beam/lasertag/redtag"))) {
			this.on = 0;
			rt.spawnTail(f, 100, "/obj/machinery/porta_turret/lasertag/proc/bullet_act: spawn at game/machinery/porta_turret/portable_turret.dm:928");
		}
	} else {
		if (this.team_color != "red") return f.dot;
		if (!rt.istype(P, T("/obj/item/projectile/beam/lasertag/bluetag"))) return f.dot;
		this.on = 0;
		rt.spawnTail(f, 100, "/obj/machinery/porta_turret/lasertag/proc/bullet_act: spawn at game/machinery/porta_turret/portable_turret.dm:933");
	}
	return f.dot;
}, true);

// a spawn(100) body of /obj/machinery/porta_turret/lasertag/proc/bullet_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret/lasertag/proc/bullet_act: spawn at game/machinery/porta_turret/portable_turret.dm:933", function* (f: Frame) {
	this.on = 1;
	return null;
});

// a spawn(100) body of /obj/machinery/porta_turret/lasertag/proc/bullet_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret/lasertag/proc/bullet_act: spawn at game/machinery/porta_turret/portable_turret.dm:928", function* (f: Frame) {
	this.on = 1;
	return null;
});
