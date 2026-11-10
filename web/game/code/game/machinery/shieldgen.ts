// Based on /tg/station's code/game/machinery/shieldgen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12550, "/obj/structure/emergency_shield", "/obj/structure", {
	anchored: 1,
	CanAtmosPass: -2,
	name: "emergency energy shield",
	desc: "An energy shield used to contain hull breaches.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "shield-old",
	density: 1,
	opacity: 0,
	resistance_flags: 51,
	max_integrity: 200,
	obj_integrity: 200,
});

// shieldgen.dm:15
rt.def("/obj/structure/emergency_shield/proc/New", function* New(f: Frame) {
	yield* this.setDir(pick(1, 2, 3, 4));
	yield* parent_proc();
	this.air_update_turf(1);
	return f.dot;
}, true);

// shieldgen.dm:21
rt.def("/obj/structure/emergency_shield/proc/Destroy", function* Destroy(f: Frame) {
	this.density = 0;
	this.air_update_turf(1);
	return (yield* parent_proc());
}, true);

// shieldgen.dm:25
rt.def("/obj/structure/emergency_shield/proc/Move", function* Move(f: Frame) {
	let _T: Value = this.loc;
	yield* parent_proc();
	this.move_update_air(_T);
	return f.dot;
}, true);

// shieldgen.dm:30
rt.def("/obj/structure/emergency_shield/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	if (!height) {
		return 0;
	} else {
		return parent_proc();
	}
}, false);

// shieldgen.dm:36
rt.def("/obj/structure/emergency_shield/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (severity === 1) {
		yield* qdel(this);
	} else if (severity === 2) {
		yield* this.take_damage(50, "brute", "energy", 0);
	}
	return f.dot;
}, true);

// shieldgen.dm:43
rt.def("/obj/structure/emergency_shield/proc/play_attack_sound", function play_attack_sound(f: Frame, damage: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/effects/empulse.ogg"), 75, 1);
	} else if (damage_type === "brute") {
		playsound(this.loc, rt.rsc("sound/effects/empulse.ogg"), 75, 1);
	}
	return f.dot;
});

// shieldgen.dm:50
rt.def("/obj/structure/emergency_shield/proc/take_damage", function* take_damage(f: Frame) {
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
	if (!f.dot) return f.dot;
	yield* new_(T("/obj/effect/temp_visual/impact_effect/ion"), this.loc);
	return f.dot;
}, true, { args: ["damage", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

rt.type(10819, "/obj/machinery/shieldgen", "/obj/machinery", {
	active: 0,
	deployed_shields: null,
	locked: 0,
	shield_range: 4,
	anchored: 0,
	pressure_resistance: 202.65,
	name: "anti-breach shielding projector",
	desc: "Used to seal minor hull breaches.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "shieldoff",
	density: 1,
	opacity: 0,
	req_access: null,
	max_integrity: 100,
	obj_integrity: 100,
});

// shieldgen.dm:84
rt.def("/obj/machinery/shieldgen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(10);
	return f.dot;
});

// shieldgen.dm:93
rt.def("/obj/machinery/shieldgen/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	this.deployed_shields = list();
	if (!(mapload && this.active && this.anchored)) return f.dot;
	yield* this.shields_up();
	return f.dot;
}, true);

// shieldgen.dm:99
rt.def("/obj/machinery/shieldgen/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	if (this.deployed_shields) {
		for (I of each(this.deployed_shields)) {
			yield* qdel(I);
		}
		this.deployed_shields.Cut();
	}
	return (yield* parent_proc());
}, true);

// shieldgen.dm:105
rt.def("/obj/machinery/shieldgen/proc/shields_up", function* shields_up(f: Frame) {
	let target_tile: Value = null;
	this.active = 1;
	yield* this.update_icon();
	for (target_tile of each(range(this.shield_range, this), T("/turf"))) {
		if (rt.istype(target_tile, T("/turf/open/space")) && !rt.locateIn(f, T("/obj/structure/emergency_shield"), target_tile)) {
			if (!rt.bitAnd(this.stat, 1) || prob(33)) {
				this.deployed_shields += (yield* new_(T("/obj/structure/emergency_shield"), target_tile));
			}
		}
	}
	return f.dot;
}, true);

// shieldgen.dm:114
rt.def("/obj/machinery/shieldgen/proc/shields_down", function* shields_down(f: Frame) {
	let I: Value = null;
	this.active = 0;
	yield* this.update_icon();
	if (!this.deployed_shields) return f.dot;
	for (I of each(this.deployed_shields)) {
		yield* qdel(I);
	}
	this.deployed_shields.Cut();
	return f.dot;
}, true);

// shieldgen.dm:118
rt.def("/obj/machinery/shieldgen/proc/process", function* process(f: Frame) {
	if (!(rt.bitAnd(this.stat, 1) && this.active)) return f.dot;
	if (!(rt.len(f, this.deployed_shields) && prob(5))) return f.dot;
	yield* qdel(pick(this.deployed_shields));
	return f.dot;
}, true, { waitfor: false });

// shieldgen.dm:124
rt.def("/obj/machinery/shieldgen/proc/deconstruct", function deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (rt.bitAnd(this.flags, NODECONSTRUCT)) return f.dot;
	if (!0) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.locked = pick(0, 1);
	this.update_icon();
	return f.dot;
});

// shieldgen.dm:132
rt.def("/obj/machinery/shieldgen/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.locked) {
		to_chat(user, "<span class='warning'>The machine is locked, you are unable to use it!</span>");
		return f.dot;
	}
	if (this.panel_open) {
		to_chat(user, "<span class='warning'>The panel must be closed before operating this machine!</span>");
		return f.dot;
	}
	if (this.active) {
		user.visible_message(fmt("＀ deactivated ％！.", [user, this]), fmt("<span class='notice'>You deactivate ％！.</span>", [this]), "<span class='italics'>You hear heavy droning fade out.</span>");
		yield* this.shields_down();
	} else if (this.anchored) {
		user.visible_message(fmt("＀ activated ％！.", [user, this]), fmt("<span class='notice'>You activate ％！.</span>", [this]), "<span class='italics'>You hear heavy droning.</span>");
		yield* this.shields_up();
	} else {
		to_chat(user, "<span class='warning'>The device must first be secured to the floor!</span>");
	}
	return f.dot;
}, true);

// shieldgen.dm:154
rt.def("/obj/machinery/shieldgen/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let coil: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		playsound(this.loc, W.usesound, 100, 1);
		this.panel_open = (!this.panel_open ? 1 : 0);
		if (this.panel_open) {
			to_chat(user, "<span class='notice'>You open the panel and expose the wiring.</span>");
		} else {
			to_chat(user, "<span class='notice'>You close the panel.</span>");
		}
	} else if (rt.istype(W, T("/obj/item/stack/cable_coil")) && rt.bitAnd(this.stat, 1) && this.panel_open) {
		if ((coil = W).get_amount() < 1) {
			to_chat(user, `<span class='warning'>You need one length of cable to repair ${this}!</span>`);
			return f.dot;
		}
		to_chat(user, "<span class='notice'>You begin to replace the wires...</span>");
		if (yield* do_after(user, 30, { target: this })) {
			if (coil.get_amount() < 1) {
				return f.dot;
			}
			yield* coil.use(1);
			this.obj_integrity = this.max_integrity;
			(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
			to_chat(user, fmt("<span class='notice'>You repair ％！.</span>", [this]));
			yield* this.update_icon();
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (this.locked) {
			to_chat(user, "<span class='warning'>The bolts are covered! Unlocking this would retract the covers.</span>");
			return f.dot;
		}
		if (!this.anchored && !this.isinspace()) {
			playsound(this.loc, W.usesound, 100, 1);
			to_chat(user, fmt("<span class='notice'>You secure ％！ to the floor!</span>", [this]));
			this.anchored = 1;
		} else if (this.anchored) {
			playsound(this.loc, W.usesound, 100, 1);
			to_chat(user, fmt("<span class='notice'>You unsecure ％！ from the floor!</span>", [this]));
			if (this.active) {
				to_chat(user, fmt("<span class='notice'>＄！ shuts off!</span>", [this]));
				yield* this.shields_down();
			}
			this.anchored = 0;
		}
	} else if (W.GetID()) {
		if (yield* this.allowed(user)) {
			this.locked = (!this.locked ? 1 : 0);
			to_chat(user, `<span class='notice'>You ${this.locked ? "lock" : "unlock"} the controls.</span>`);
		} else {
			to_chat(user, "<span class='danger'>Access denied.</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// shieldgen.dm:203
rt.def("/obj/machinery/shieldgen/proc/emag_act", function emag_act(f: Frame) {
	if (rt.bitAnd(this.stat, 1)) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.obj_integrity = 0;
	this.update_icon();
	return f.dot;
});

// shieldgen.dm:210
rt.def("/obj/machinery/shieldgen/proc/update_icon", function update_icon(f: Frame) {
	if (this.active) {
		this.icon_state = rt.bitAnd(this.stat, 1) ? "shieldonbr" : "shieldon";
	} else {
		this.icon_state = rt.bitAnd(this.stat, 1) ? "shieldoffbr" : "shieldoff";
	}
	return f.dot;
});

rt.type(10820, "/obj/machinery/shieldwallgen", "/obj/machinery", {
	active: 0,
	power: 0,
	maximum_stored_power: 500,
	locked: 1,
	shield_range: 8,
	attached: null,
	anchored: 0,
	flags: 64,
	use_power: 0,
	name: "shield wall generator",
	desc: "A shield generator.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "Shield_Gen",
	density: 1,
	req_access: null,
	obj_integrity: 300,
	max_integrity: 300,
});

// shieldgen.dm:223
rt.def("/obj/machinery/shieldwallgen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(17);
	return f.dot;
});

rt.type(10821, "/obj/machinery/shieldwallgen/xenobiologyaccess", "/obj/machinery/shieldwallgen", {
	name: "xenobiology shield wall generator",
	desc: "A shield generator meant for use in xenobiology.",
	icon_state: "Shield_Gen",
	req_access: null,
});

// shieldgen.dm:239
rt.def("/obj/machinery/shieldwallgen/xenobiologyaccess/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(55);
	return f.dot;
});

// shieldgen.dm:242
rt.def("/obj/machinery/shieldwallgen/proc/Destroy", function* Destroy(f: Frame) {
	let d: Value = null;
	for (d of each(GLOB.cardinal)) {
		yield* this.cleanup_field(d);
	}
	return (yield* parent_proc());
}, true);

// shieldgen.dm:247
rt.def("/obj/machinery/shieldwallgen/proc/power", function power(f: Frame) {
	let PN: Value = null, avail_power: Value = null;
	if (!this.anchored) {
		this.power = 0;
		return f.dot;
	}
	let _T: Value = rt.getStep(f, this, 0);
	let C: Value = _T.get_cable_node();
	if (C) {
		PN = C.powernet;
	}
	if (!PN) {
		return f.dot;
	}
	let surplus: Value = max(PN.avail - PN.load, 0);
	if (!(avail_power = min(rand(50, 200), surplus))) return f.dot;
	this.power += avail_power;
	PN.load += avail_power;
	return f.dot;
});

// shieldgen.dm:267
rt.def("/obj/machinery/shieldwallgen/proc/process", function* process(f: Frame) {
	this.power();
	yield* this.use_stored_power(50);
	return f.dot;
}, true, { waitfor: false });

// shieldgen.dm:271
rt.def("/obj/machinery/shieldwallgen/proc/use_stored_power", function* use_stored_power(f: Frame, amount: Value) {
	this.power = max(0, min(this.power - amount, this.maximum_stored_power));
	yield* this.update_activity();
	return f.dot;
}, true);

// shieldgen.dm:276
rt.def("/obj/machinery/shieldwallgen/proc/update_activity", function* update_activity(f: Frame) {
	let fields: Value = null, d: Value = null, d_0: Value = null;
	if (this.active) {
		this.icon_state = "Shield_Gen +a";
		if (this.active == ACTIVE_SETUPFIELDS) {
			fields = 0;
			for (d of each(GLOB.cardinal)) {
				if (yield* this.setup_field(d)) {
					fields++;
				}
			}
			if (fields) {
				this.active = ACTIVE_HASFIELDS;
			}
		}
		if (!this.power) {
			this.visible_message(`<span class='danger'>The ${this.name} shuts down due to lack of power!</span>`, "<span class='italics'>You hear heavy droning fade out.</span>");
			this.icon_state = "Shield_Gen";
			this.active = 0;
			for (d_0 of each(GLOB.cardinal)) {
				yield* this.cleanup_field(d_0);
			}
		}
	} else {
		this.icon_state = "Shield_Gen";
		d_0 = null;
		for (d_0 of each(GLOB.cardinal)) {
			yield* this.cleanup_field(d_0);
		}
	}
	return f.dot;
}, true);

// shieldgen.dm:297
rt.def("/obj/machinery/shieldwallgen/proc/setup_field", function* setup_field(f: Frame, direction: Value) {
	let G: Value = null, i: Value = null;
	let $e: any;
	if (!direction) {
		return f.dot;
	}
	let _T: Value = this.loc;
	let steps: Value = 0;
	let opposite_direction: Value = turn(direction, 180);
	rt.forRange(f, 0, 1, this.shield_range, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		_T = rt.getStep(f, _T, direction);
		if (G = rt.locateIn(f, T("/obj/machinery/shieldwallgen"), _T)) {
			if (!G.active) {
				return f.dot;
			}
			yield* G.cleanup_field(opposite_direction);
			break;
		}
		steps++;
	}
	rt.endFor(f, 0);
	if (!G || !steps) {
		return f.dot;
	}
	i = null;
	rt.forRange(f, 0, 1, steps, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/machinery/shieldwall"), (_T = rt.getStep(f, _T, opposite_direction)), this, G);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// shieldgen.dm:327
rt.def("/obj/machinery/shieldwallgen/proc/cleanup_field", function* cleanup_field(f: Frame, direction: Value) {
	let F: Value = null, G: Value = null, i: Value = null;
	let $e: any;
	let _T: Value = this.loc;
	rt.forRange(f, 0, 1, this.shield_range, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		_T = rt.getStep(f, _T, direction);
		if ((G = rt.locateIn(f, T("/obj/machinery/shieldwallgen"), _T)) && !G.active) {
			break;
		}
		if ((F = rt.locateIn(f, T("/obj/machinery/shieldwall"), _T)) && (F.gen_primary == this || F.gen_secondary == this)) {
			yield* qdel(F);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// shieldgen.dm:342
rt.def("/obj/machinery/shieldwallgen/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame, user: Value, silent: Value) {
	if (this.active) {
		if (!silent) {
			to_chat(user, "<span class='warning'>Turn off the shield generator first!</span>");
		}
		return FAILED_UNFASTEN;
	}
	return parent_proc();
}, false);

// shieldgen.dm:348
rt.def("/obj/machinery/shieldwallgen/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		yield* this.default_unfasten_wrench(user, W, 0);
	} else if (W.GetID()) {
		if (yield* this.allowed(user)) {
			this.locked = (!this.locked ? 1 : 0);
			to_chat(user, `<span class='notice'>You ${this.locked ? "lock" : "unlock"} the controls.</span>`);
		} else {
			to_chat(user, "<span class='danger'>Access denied.</span>");
		}
	} else {
		yield* this.add_fingerprint(user);
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// shieldgen.dm:363
rt.def("/obj/machinery/shieldwallgen/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!this.anchored) {
		to_chat(user, fmt("<span class='warning'>＄！ needs to be firmly secured to the floor first!</span>", [this]));
		return f.dot;
	}
	if (this.locked && !rt.istype(user, T("/mob/living/silicon"))) {
		to_chat(user, "<span class='warning'>The controls are locked!</span>");
		return f.dot;
	}
	if (!this.power) {
		to_chat(user, fmt("<span class='warning'>＄！ needs to be powered by a wire!</span>", [this]));
		return f.dot;
	}
	if (this.active) {
		user.visible_message(fmt("＀ turned ％！ off.", [user, this]), fmt("<span class='notice'>You turn off ％！.</span>", [this]), "<span class='italics'>You hear heavy droning fade out.</span>");
		this.active = 0;
		yield* this.update_activity();
	} else {
		user.visible_message(fmt("＀ turned ％！ on.", [user, this]), fmt("<span class='notice'>You turn on ％！.</span>", [this]), "<span class='italics'>You hear heavy droning.</span>");
		this.active = ACTIVE_SETUPFIELDS;
		yield* this.update_activity();
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

rt.type(10822, "/obj/machinery/shieldwall", "/obj/machinery", {
	needs_power: 0,
	gen_primary: null,
	gen_secondary: null,
	anchored: 1,
	light_range: 3,
	name: "shield wall",
	desc: "An energy shield.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "shieldwall",
	density: 1,
	resistance_flags: 115,
});

// shieldgen.dm:403
rt.def("/obj/machinery/shieldwall/proc/Initialize", function* Initialize(f: Frame, mapload: Value, first_gen: Value, second_gen: Value) {
	let L: Value = null;
	f.dot = (yield* parent_proc());
	this.gen_primary = first_gen;
	this.gen_secondary = second_gen;
	if (this.gen_primary && this.gen_secondary) {
		this.needs_power = 1;
		yield* this.setDir(rt.getDir(f, this.gen_primary, this.gen_secondary));
	}
	for (L of each(rt.getStep(f, this, 0), T("/mob/living"))) {
		this.visible_message(fmt("<span class='danger'>＄！ is suddenly occupying the same space as ％！!</span>", [this, L]));
		yield* L.gib();
	}
	return f.dot;
}, true);

// shieldgen.dm:416
rt.def("/obj/machinery/shieldwall/proc/Destroy", function* Destroy(f: Frame) {
	this.gen_primary = null;
	this.gen_secondary = null;
	return (yield* parent_proc());
}, true);

// shieldgen.dm:423
rt.def("/obj/machinery/shieldwall/proc/process", function* process(f: Frame) {
	if (!this.needs_power) return f.dot;
	if (!this.gen_primary || !this.gen_primary.active || !this.gen_secondary || !this.gen_secondary.active) {
		yield* qdel(this);
		return f.dot;
	}
	yield* this.drain_power(10);
	return f.dot;
}, true, { waitfor: false });

// shieldgen.dm:430
rt.def("/obj/machinery/shieldwall/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/effects/empulse.ogg"), 75, 1);
	} else if (damage_type === "brute") {
		playsound(this.loc, rt.rsc("sound/effects/empulse.ogg"), 75, 1);
	}
	return f.dot;
});

// shieldgen.dm:438
rt.def("/obj/machinery/shieldwall/proc/take_damage", function* take_damage(f: Frame) {
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
	if (!(f.args[1] == "brute" || f.args[1] == "fire")) return f.dot;
	yield* this.drain_power(f.args[0]);
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// shieldgen.dm:443
rt.def("/obj/machinery/shieldwall/proc/drain_power", function* drain_power(f: Frame, drain_amount: Value) {
	if (!(this.needs_power && this.gen_primary)) return f.dot;
	yield* this.gen_primary.use_stored_power(drain_amount * 0.5);
	if (!this.gen_secondary) return f.dot;
	yield* this.gen_secondary.use_stored_power(drain_amount * 0.5);
	return f.dot;
}, true);

// shieldgen.dm:449
rt.def("/obj/machinery/shieldwall/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (height == 0) {
		return 0;
	}
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(2)) {
		return prob(20);
	}
	if (rt.istype(mover, T("/obj/item/projectile"))) {
		return prob(10);
	}
	return (!this.density ? 1 : 0);
});
