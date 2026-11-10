// Based on /tg/station's code/game/machinery/doors/door.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10209, "/obj/machinery/door", "/obj/machinery", {
	secondsElectrified: 0,
	shockedby: null,
	visible: 1,
	operating: 0,
	glass: 0,
	welded: 0,
	normalspeed: 1,
	heat_proof: 0,
	emergency: 0,
	sub_door: 0,
	closingLayer: 3.1,
	autoclose: 0,
	safe: 1,
	locked: 0,
	assemblytype: null,
	auto_close: null,
	spark_system: null,
	damage_deflection: 10,
	real_explosion_block: null,
	anchored: 1,
	CanAtmosPass: -2,
	flags: 32768,
	name: "door",
	desc: "It opens and closes.",
	icon: rt.rsc("icons/obj/doors/doorint.dmi"),
	icon_state: "door1",
	opacity: 1,
	density: 1,
	layer: 2.7,
	power_channel: 3,
	obj_integrity: 350,
	max_integrity: 350,
	armor: null,
});

// door.dm:18
rt.def("/obj/machinery/door/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.shockedby = list();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 30, "laser", 20, "energy", 20, "bomb", 10, "bio", 100, "rad", 100, "fire", 80, "acid", 70]);
	return f.dot;
});

// door.dm:38
rt.def("/obj/machinery/door/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.density) {
		this.layer = CLOSED_DOOR_LAYER;
	} else {
		this.layer = OPEN_DOOR_LAYER;
	}
	this.update_freelook_sight();
	this.air_update_turf(1);
	GLOB.airlocks += this;
	this.spark_system = (yield* new_(T("/datum/effect_system/spark_spread")));
	yield* this.spark_system.set_up(2, 1, this);
	this.real_explosion_block = this.explosion_block;
	this.explosion_block = EXPLOSION_BLOCK_PROC;
	return f.dot;
}, true);

// door.dm:55
rt.def("/obj/machinery/door/proc/Destroy", function* Destroy(f: Frame) {
	this.density = 0;
	this.air_update_turf(1);
	this.update_freelook_sight();
	GLOB.airlocks -= this;
	if (this.spark_system) {
		yield* qdel(this.spark_system);
		this.spark_system = null;
	}
	return (yield* parent_proc());
}, true);

// door.dm:67
rt.def("/obj/machinery/door/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let B: Value = null, M: Value = null, mecha: Value = null;
	if (this.operating || this.emagged) {
		return f.dot;
	}
	if (ismob(AM)) {
		if ((rt.istype((B = AM), T("/mob/living/simple_animal/drone")) || rt.istype(B, T("/mob/living/silicon/robot"))) && B.stat) {
			return f.dot;
		}
		if (rt.istype(AM, T("/mob/living"))) {
			M = AM;
			if (rt.worldTime(f) - M.last_bumped <= 10) {
				return f.dot;
			}
			M.last_bumped = rt.worldTime(f);
			if (M.restrained() && !this.check_access(null)) {
				return f.dot;
			}
			yield* this.bumpopen(M);
			return f.dot;
		}
	}
	if (rt.istype(AM, T("/obj/mecha"))) {
		mecha = AM;
		if (this.density) {
			if (mecha.occupant) {
				if (rt.worldTime(f) - mecha.occupant.last_bumped <= 10) {
					return f.dot;
				}
				mecha.occupant.last_bumped = rt.worldTime(f);
			}
			if (mecha.occupant && ((yield* this.allowed(mecha.occupant)) || this.check_access_list(mecha.operation_req_access))) {
				yield* this.open();
			} else {
				yield* this.do_animate("deny");
			}
		}
		return f.dot;
	}
	return f.dot;
}, true);

// door.dm:98
rt.def("/obj/machinery/door/proc/Move", function* Move(f: Frame) {
	let _T: Value = this.loc;
	yield* parent_proc();
	this.move_update_air(_T);
	return f.dot;
}, true);

// door.dm:103
rt.def("/obj/machinery/door/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(2)) {
		return (!this.opacity ? 1 : 0);
	}
	return (!this.density ? 1 : 0);
});

// door.dm:110
rt.def("/obj/machinery/door/proc/bumpopen", function* bumpopen(f: Frame, user: Value) {
	if (this.operating) {
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	if (!this.requiresID()) {
		user = null;
	}
	if (this.density && !this.emagged) {
		if (yield* this.allowed(user)) {
			yield* this.open();
		} else {
			yield* this.do_animate("deny");
		}
	}
	return f.dot;
}, true);

// door.dm:123
rt.def("/obj/machinery/door/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// door.dm:126
rt.def("/obj/machinery/door/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	return (yield* this.try_to_activate_door(user));
}, true);

// door.dm:130
rt.def("/obj/machinery/door/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	if (this.requiresID() && !(yield* this.allowed(null))) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// door.dm:135
rt.def("/obj/machinery/door/proc/try_to_activate_door", function* try_to_activate_door(f: Frame, user: Value) {
	let deny_reason: Value = null;
	yield* this.add_fingerprint(user);
	if (this.operating || this.emagged) {
		return f.dot;
	}
	let alert_user: Value = user;
	if (!this.requiresID()) {
		user = null;
	}
	if (yield* this.allowed(user)) {
		if (this.density) {
			if (deny_reason = this.open_failure_reason()) {
				yield* this.balloon_alert(alert_user, deny_reason);
			}
			yield* this.open();
		} else {
			yield* this.close();
		}
		return f.dot;
	}
	if (!this.density) return f.dot;
	yield* this.do_animate("deny");
	return f.dot;
}, true);

// door.dm:154
rt.def("/obj/machinery/door/proc/open_failure_reason", function open_failure_reason(f: Frame) {
	return null;
});

// door.dm:159
rt.def("/obj/machinery/door/proc/allowed", function allowed(f: Frame, M: Value) {
	if (this.emergency) {
		return 1;
	}
	return parent_proc();
}, false);

// door.dm:168
rt.def("/obj/machinery/door/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (user.a_intent != "harm" && (rt.istype(I, T("/obj/item/weapon/crowbar")) || rt.istype(I, T("/obj/item/weapon/twohanded/fireaxe")))) {
		yield* this.try_to_crowbar(I, user);
		return 1;
	} else if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
		yield* this.try_to_weld(I, user);
		return 1;
	} else if (!rt.bitAnd(I.flags, NOBLUDGEON) && user.a_intent != "harm") {
		yield* this.try_to_activate_door(user);
		return 1;
	}
	return (yield* parent_proc());
}, true);

// door.dm:180
rt.def("/obj/machinery/door/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[2] == "melee" && f.args[0] < this.damage_deflection) {
		return 0;
	}
	f.dot = parent_proc();
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// door.dm:185
rt.def("/obj/machinery/door/proc/take_damage", function* take_damage(f: Frame) {
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
	if (!(f.dot && this.obj_integrity > 0)) return f.dot;
	if (!(f.args[0] >= 10 && prob(30))) return f.dot;
	if (!this.spark_system) return f.dot; // tg bug: a door hit while being deleted has no spark system left (Destroy nulls it)
	yield* this.spark_system.start();
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// door.dm:191
rt.def("/obj/machinery/door/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (this.glass) {
			playsound(this.loc, rt.rsc("sound/effects/glasshit.ogg"), 90, 1);
		} else if (damage_amount) {
			playsound(this.loc, rt.rsc("sound/weapons/smash.ogg"), 50, 1);
		} else {
			playsound(this, rt.rsc("sound/weapons/tap.ogg"), 50, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// door.dm:203
rt.def("/obj/machinery/door/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (prob(20 / severity) && (rt.istype(this, T("/obj/machinery/door/airlock")) || rt.istype(this, T("/obj/machinery/door/window")))) {
		yield* ImmediateInvokeAsync(this, P("/obj/machinery/door/proc/open"));
	}
	if (prob(40 / severity)) {
		if (this.secondsElectrified == 0) {
			this.secondsElectrified = -1;
			this.shockedby += `[${time_stamp()}]EM Pulse`;
			yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/door/proc/unelectrify"))), 300);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// door.dm:217
rt.def("/obj/machinery/door/proc/update_icon", function update_icon(f: Frame) {
	if (this.density) {
		this.icon_state = "door1";
	} else {
		this.icon_state = "door0";
	}
	return f.dot;
});

// door.dm:222
rt.def("/obj/machinery/door/proc/do_animate", function do_animate(f: Frame, animation: Value) {
	if (animation === "opening") {
		if (this.panel_open) {
			flick("o_doorc0", this);
		} else {
			flick("doorc0", this);
		}
	} else if (animation === "closing") {
		if (this.panel_open) {
			flick("o_doorc1", this);
		} else {
			flick("doorc1", this);
		}
	} else if (animation === "deny") {
		if (this.stat) return f.dot;
		flick("door_deny", this);
	}
	return f.dot;
});

// door.dm:239
rt.def("/obj/machinery/door/proc/open", function* open(f: Frame) {
	if (!this.density) {
		return 1;
	}
	if (this.operating) {
		return f.dot;
	}
	this.operating = 1;
	yield* this.do_animate("opening");
	this.set_opacity(0);
	yield* sleep(5);
	this.density = 0;
	yield* sleep(5);
	this.layer = OPEN_DOOR_LAYER;
	yield* this.update_icon();
	this.set_opacity(0);
	this.operating = 0;
	this.air_update_turf(1);
	this.update_freelook_sight();
	if (this.autoclose) {
		rt.spawnTail(f, this.autoclose, "/obj/machinery/door/proc/open: spawn at game/machinery/doors/door.dm:256");
	}
	return 1;
}, true);

// a spawn(rt.srcVarI(f, $ic[68])) body of /obj/machinery/door/proc/open, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/door/proc/open: spawn at game/machinery/doors/door.dm:256", function* (f: Frame) {
	yield* this.close();
	return null;
});

// door.dm:266
rt.def("/obj/machinery/door/proc/close", function* close(f: Frame) {
	let M: Value = null;
	if (this.density) {
		return 1;
	}
	if (this.operating) {
		return f.dot;
	}
	if (this.safe) {
		for (M of each(rt.getStep(f, this, 0), T("/atom/movable"))) {
			if (M.density && M != this) {
				if (this.autoclose) {
					yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/door/proc/autoclose"))), 60);
				}
				return f.dot;
			}
		}
	}
	this.operating = 1;
	yield* this.do_animate("closing");
	this.layer = this.closingLayer;
	yield* sleep(5);
	this.density = 1;
	yield* sleep(5);
	yield* this.update_icon();
	if (this.visible && !this.glass) {
		this.set_opacity(1);
	}
	this.operating = 0;
	this.air_update_turf(1);
	this.update_freelook_sight();
	if (this.safe) {
		yield* this.CheckForMobs();
	} else {
		yield* this.crush();
	}
	return 1;
}, true);

// door.dm:291
rt.def("/obj/machinery/door/proc/CheckForMobs", function* CheckForMobs(f: Frame) {
	if (!rt.locateIn(f, T("/mob/living"), rt.getStep(f, this, 0))) return f.dot;
	yield* sleep(1);
	yield* this.open();
	return f.dot;
}, true);

// door.dm:296
rt.def("/obj/machinery/door/proc/crush", function* crush(f: Frame) {
	let L: Value = null, location: Value = null, M: Value = null;
	for (L of each(rt.getStep(f, this, 0), T("/mob/living"))) {
		L.visible_message(`<span class='warning'>${this} closes on ${L}, crushing them!</span>`, `<span class='userdanger'>${this} closes on you and crushes you!</span>`);
		if (rt.istype(L, T("/mob/living/carbon/alien"))) {
			yield* L.adjustBruteLoss(22.5);
			yield* L.emote("roar");
		} else if (rt.istype(L, T("/mob/living/carbon/human"))) {
			yield* L.adjustBruteLoss(DOOR_CRUSH_DAMAGE);
			yield* L.emote("scream");
			yield* L.Knockdown(100);
		} else if (rt.istype(L, T("/mob/living/carbon/monkey"))) {
			yield* L.adjustBruteLoss(DOOR_CRUSH_DAMAGE);
			yield* L.Knockdown(100);
		} else {
			yield* L.adjustBruteLoss(DOOR_CRUSH_DAMAGE);
		}
		location = rt.getStep(f, this, 0);
		yield* L.add_splatter_floor(location);
	}
	for (M of each(rt.getStep(f, this, 0), T("/obj/mecha"))) {
		yield* M.take_damage(DOOR_CRUSH_DAMAGE);
	}
	return f.dot;
}, true);

// door.dm:317
rt.def("/obj/machinery/door/proc/autoclose", function* autoclose(f: Frame) {
	if (!(!(!this || this.gc_destroyed) && !this.density && !this.operating && !this.locked && !this.welded && this.autoclose)) return f.dot;
	yield* this.close();
	return f.dot;
}, true);

// door.dm:324
rt.def("/obj/machinery/door/proc/hasPower", function hasPower(f: Frame) {
	return (!rt.bitAnd(this.stat, 2) ? 1 : 0);
});

// door.dm:327
rt.def("/obj/machinery/door/proc/update_freelook_sight", function update_freelook_sight(f: Frame) {
	if (!(!this.glass && GLOB.cameranet)) return f.dot;
	GLOB.cameranet.updateVisibility(this, 0);
	return f.dot;
});

// door.dm:331
rt.def("/obj/machinery/door/proc/BlockSuperconductivity", function BlockSuperconductivity(f: Frame) {
	if (this.opacity || this.heat_proof) {
		return 1;
	}
	return 0;
});

// door.dm:348
rt.def("/obj/machinery/door/proc/hostile_lockdown", function* hostile_lockdown(f: Frame, origin: Value) {
	if (this.stat) return f.dot;
	yield* this.close();
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// door.dm:352
rt.def("/obj/machinery/door/proc/disable_lockdown", function* disable_lockdown(f: Frame) {
	if (this.stat) return f.dot;
	yield* this.open();
	return f.dot;
}, true);

// door.dm:357
rt.def("/obj/machinery/door/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	parent_proc(severity ? max(1, severity - 1) : 0, target);
	return f.dot;
}, false, { waitfor: false });

// door.dm:360
rt.def("/obj/machinery/door/proc/GetExplosionBlock", function GetExplosionBlock(f: Frame) {
	return this.density ? this.real_explosion_block : 0;
});
