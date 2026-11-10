// Based on /tg/station's code/modules/power/singularity/emitter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10307, "/obj/machinery/power/emitter", "/obj/machinery/power", {
	icon_state_on: "emitter_+a",
	manual: 0,
	charge: 0,
	target: null,
	active: 0,
	powered: 0,
	fire_delay: 100,
	maximum_fire_delay: 100,
	minimum_fire_delay: 20,
	last_shot: 0,
	shot_number: 0,
	state: 0,
	locked: 0,
	projectile_type: rt.typePath("/obj/item/projectile/beam/emitter"),
	projectile_sound: rt.rsc("sound/weapons/emitter.ogg"),
	sparks: null,
	anchored: 0,
	name: "emitter",
	desc: "A heavy-duty industrial laser, often used in containment fields and power generation.\n<span class='notice'>Alt-click to rotate it clockwise.</span>",
	icon: rt.rsc("icons/obj/singularity.dmi"),
	icon_state: "emitter",
	density: 1,
	req_access: null,
	use_power: 0,
	idle_power_usage: 10,
	active_power_usage: 300,
});

// emitter.dm:9
rt.def("/obj/machinery/power/emitter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(11);
	return f.dot;
});

// emitter.dm:37
rt.def("/obj/machinery/power/emitter/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/emitter"), null))).apply_default_parts(this);
	yield* this.RefreshParts();
	this.wires = (yield* new_(T("/datum/wires/emitter"), this));
	return f.dot;
}, true);

rt.type(6772, "/obj/item/weapon/circuitboard/machine/emitter", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Emitter (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/emitter"),
	origin_tech: "programming=3;powerstorage=4;engineering=4",
});

// emitter.dm:47
rt.def("/obj/item/weapon/circuitboard/machine/emitter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]);
	return f.dot;
});

// emitter.dm:56
rt.def("/obj/machinery/power/emitter/proc/RefreshParts", function RefreshParts(f: Frame) {
	let L: Value = null, M: Value = null;
	let max_firedelay: Value = 120;
	let firedelay: Value = 120;
	let min_firedelay: Value = 24;
	let power_usage: Value = 350;
	for (L of each(this.component_parts, T("/obj/item/weapon/stock_parts/micro_laser"))) {
		max_firedelay -= 20 * L.rating;
		min_firedelay -= 4 * L.rating;
		firedelay -= 20 * L.rating;
	}
	this.maximum_fire_delay = max_firedelay;
	this.minimum_fire_delay = min_firedelay;
	this.fire_delay = firedelay;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		power_usage -= 50 * M.rating;
	}
	this.active_power_usage = power_usage;
	return f.dot;
});

// emitter.dm:72
rt.def("/obj/machinery/power/emitter/verb/rotate", function rotate(f: Frame) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	if (this.anchored) {
		to_chat(f.usr, "<span class='warning'>It is fastened to the floor!</span>");
		return 0;
	}
	this.setDir(turn(this.dir, 270));
	return 1;
}, false, { verb: { name: "Rotate", category: "Object", src: 3, range: 1 } });

// emitter.dm:81
rt.def("/obj/machinery/power/emitter/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	yield* parent_proc();
	if (user.incapacitated()) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	if (!(get_dist(this, user) <= 1)) {
		return f.dot;
	} else {
		yield* this.rotate();
	}
	return f.dot;
}, true);

// emitter.dm:91
rt.def("/obj/machinery/power/emitter/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	// ss13.live: the CTF arena's energy cannons wait for a CTF game (start_ctf turns them on, stop_ctf off). tg fired them all
	// round: their beams and sparks were 16% of the long-lived garbage behind solo play's GC freezes (plans/less-garbage.md).
	if (rt.istype(this, T("/obj/machinery/power/emitter/energycannon")) && rt.istype(get_area(this), T("/area/ctf"))) this.active = 0;
	if (this.state == 2 && this.anchored) {
		yield* this.connect_to_network();
	}
	this.sparks = (yield* new_(T("/datum/effect_system/spark_spread")));
	yield* this.sparks.attach(this);
	yield* this.sparks.set_up(5, 1, this);
	return f.dot;
}, true);

// emitter.dm:100
rt.def("/obj/machinery/power/emitter/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	let $0: any;
	if (GLOB.SSticker && GLOB.SSticker.IsRoundInProgress()) {
		if (_T = rt.getStep(f, this, 0)) {
			$0 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
		} else {
			$0 = "nonexistent location";
		}
		message_admins(`Emitter deleted at ${`${$0}`}`, 0, 1);
		log_game(`Emitter deleted at ${`(${_T.x},${_T.y},${_T.z})`}`);
		this.investigate_log(`<font color='red'>deleted</font> at ${get_area(this)} ${`(${_T.x},${_T.y},${_T.z})`}`, "singulo");
	}
	yield* qdel(this.sparks);
	this.sparks = null;
	return (yield* parent_proc());
}, true);

// emitter.dm:109
rt.def("/obj/machinery/power/emitter/proc/update_icon", function update_icon(f: Frame) {
	if (this.active && this.powernet && this.avail(this.active_power_usage)) {
		this.icon_state = this.icon_state_on;
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
	}
	return f.dot;
});

// emitter.dm:116
rt.def("/obj/machinery/power/emitter/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let $0: any, $1: any;
	yield* this.add_fingerprint(user);
	if (this.state == 2) {
		if (!this.powernet) {
			to_chat(user, "<span class='warning'>The emitter isn't connected to a wire!</span>");
			return 1;
		}
		if (!this.locked) {
			if (this.active == 1) {
				this.active = 0;
				to_chat(user, fmt("<span class='notice'>You turn off ％！.</span>", [this]));
				$0 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
				if (this) {
					$1 = `${`(${this.x},${this.y},${this.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`;
				} else {
					$1 = "nonexistent location";
				}
				message_admins(`Emitter turned off by ${$0} in ${`${$1}`}`, 0, 1);
				log_game(`Emitter turned off by ${key_name(user)} in ${`(${this.x},${this.y},${this.z})`}`);
				this.investigate_log(`turned <font color='red'>off</font> by ${key_name(user)} at ${get_area(this)}`, "singulo");
			} else {
				this.active = 1;
				to_chat(user, fmt("<span class='notice'>You turn on ％！.</span>", [this]));
				this.shot_number = 0;
				this.fire_delay = this.maximum_fire_delay;
				this.investigate_log(`turned <font color='green'>on</font> by ${key_name(user)} at ${get_area(this)}`, "singulo");
			}
			yield* this.update_icon();
		} else {
			to_chat(user, "<span class='warning'>The controls are locked!</span>");
		}
	} else {
		to_chat(user, `<span class='warning'>The ${this} needs to be firmly secured to the floor first!</span>`);
		return 1;
	}
	return f.dot;
}, true);

// emitter.dm:142
rt.def("/obj/machinery/power/emitter/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	if (rt.istype(M, T("/mob/living/simple_animal/hostile/megafauna")) && this.anchored) {
		this.state = 0;
		this.anchored = 0;
		M.visible_message(`<span class='warning'>${M} rips ${this} free from its moorings!</span>`);
	} else {
		yield* parent_proc();
	}
	if (this.anchored) return f.dot;
	yield* step(this, rt.getDir(f, M, this));
	return f.dot;
}, true);

// emitter.dm:162
rt.def("/obj/machinery/power/emitter/proc/process", function* process(f: Frame) {
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	if (this.state != 2 || !this.powernet && this.active_power_usage) {
		this.active = 0;
		yield* this.update_icon();
		return f.dot;
	}
	if (this.active != 1) return f.dot;
	if (!this.active_power_usage || this.avail(this.active_power_usage)) {
		this.add_load(this.active_power_usage);
		if (!this.powered) {
			this.powered = 1;
			yield* this.update_icon();
			this.investigate_log(`regained power and turned <font color='green'>on</font> at ${get_area(this)}`, "singulo");
		}
	} else {
		if (this.powered) {
			this.powered = 0;
			yield* this.update_icon();
			this.investigate_log(`lost power and turned <font color='red'>off</font> at ${get_area(this)}`, "singulo");
			log_game(`Emitter lost power in (${this.x},${this.y},${this.z})`);
		}
		return f.dot;
	}
	if (this.charge <= 80) {
		this.charge += 5;
	}
	if (!this.check_delay() || this.manual == 1) {
		return 0;
	}
	yield* this.fire_beam(this.target);
	return f.dot;
}, true, { waitfor: false });

// emitter.dm:189
rt.def("/obj/machinery/power/emitter/proc/check_delay", function check_delay(f: Frame) {
	if (this.last_shot + this.fire_delay <= rt.worldTime(f)) {
		return 1;
	}
	return 0;
});

// emitter.dm:194
rt.def("/obj/machinery/power/emitter/proc/fire_beam_pulse", function* fire_beam_pulse(f: Frame) {
	if (!this.check_delay()) {
		return 0;
	}
	if (this.state != 2) {
		return 0;
	}
	if (!this.avail(this.active_power_usage)) return f.dot;
	this.add_load(this.active_power_usage);
	yield* this.fire_beam();
	return f.dot;
}, true);

// emitter.dm:203
rt.def("/obj/machinery/power/emitter/proc/fire_beam", function* fire_beam(f: Frame, targeted_atom: Value, user: Value) {
	let targets_from: Value = rt.getStep(f, this, 0);
	if (targeted_atom && (targeted_atom == user || targeted_atom == targets_from || targeted_atom == this)) {
		return f.dot;
	}
	let _P: Value = (yield* new_(this.projectile_type, targets_from));
	playsound(this.loc, this.projectile_sound, 50, 1);
	if (prob(35)) {
		yield* this.sparks.start();
	}
	if (this.dir === 1) {
		_P.yo = 20;
		_P.xo = 0;
	} else if (this.dir === 5) {
		_P.yo = 20;
		_P.xo = 20;
	} else if (this.dir === 4) {
		_P.yo = 0;
		_P.xo = 20;
	} else if (this.dir === 6) {
		_P.yo = -20;
		_P.xo = 20;
	} else if (this.dir === 8) {
		_P.yo = 0;
		_P.xo = -20;
	} else if (this.dir === 10) {
		_P.yo = -20;
		_P.xo = -20;
	} else if (this.dir === 9) {
		_P.yo = 20;
		_P.xo = -20;
	} else {
		_P.yo = -20;
		_P.xo = 0;
	}
	if (this.target) {
		_P.yo = targeted_atom.y - targets_from.y;
		_P.xo = targeted_atom.x - targets_from.x;
		_P.current = targets_from;
		_P.starting = targets_from;
		_P.firer = this;
		_P.original = targeted_atom;
	}
	if (!this.manual) {
		this.last_shot = rt.worldTime(f);
		if (this.shot_number < 3) {
			this.fire_delay = 20;
			this.shot_number++;
		} else {
			this.fire_delay = rand(this.minimum_fire_delay, this.maximum_fire_delay);
			this.shot_number = 0;
		}
		if (!this.target) {
			yield* _P.setDir(this.dir);
			_P.starting = this.loc;
		} else if (!this.target || this.target.gc_destroyed) {
			this.target = null;
		}
	}
	yield* _P.fire();
	return _P;
}, true);

// emitter.dm:260
rt.def("/obj/machinery/power/emitter/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame, user: Value, silent: Value) {
	if (this.state == EM_WELDED) {
		if (!silent) {
			to_chat(user, `<span class='warning'>${this} is welded to the floor!</span>`);
		}
		return FAILED_UNFASTEN;
	}
	return parent_proc();
}, false);

// emitter.dm:267
rt.def("/obj/machinery/power/emitter/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* parent_proc());
	if (f.dot != SUCCESSFUL_UNFASTEN) return f.dot;
	if (this.anchored) {
		this.state = EM_SECURED;
	} else {
		this.state = EM_UNSECURED;
	}
	return f.dot;
}, true, { args: ["user", "W", "time"] });

// emitter.dm:275
rt.def("/obj/machinery/power/emitter/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (this.active) {
			to_chat(user, fmt("<span class='warning'>Turn ％！ off first!</span>", [this]));
			return f.dot;
		}
		yield* this.default_unfasten_wrench(user, W, 0);
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		WT = W;
		if (this.active) {
			to_chat(user, fmt("Turn ％！ off first.", [this]));
			return f.dot;
		}
		if (this.state === EM_UNSECURED) {
			to_chat(user, `<span class='warning'>The ${this.name} needs to be wrenched to the floor!</span>`);
		} else if (this.state === EM_SECURED) {
			if (yield* WT.remove_fuel(0, user)) {
				playsound(this.loc, WT.usesound, 50, 1);
				user.visible_message(`${user.name} starts to weld the ${this.name} to the floor.`, fmt("<span class='notice'>You start to weld ％！ to the floor...</span>", [this]), "<span class='italics'>You hear welding.</span>");
				if ((yield* do_after(user, 20 * W.toolspeed, { target: this })) && WT.isOn()) {
					this.state = EM_WELDED;
					to_chat(user, fmt("<span class='notice'>You weld ％！ to the floor.</span>", [this]));
					yield* this.connect_to_network();
				}
			}
		} else if (this.state === EM_WELDED) {
			if (yield* WT.remove_fuel(0, user)) {
				playsound(this.loc, WT.usesound, 50, 1);
				user.visible_message(`${user.name} starts to cut the ${this.name} free from the floor.`, fmt("<span class='notice'>You start to cut ％！ free from the floor...</span>", [this]), "<span class='italics'>You hear welding.</span>");
				if ((yield* do_after(user, 20 * W.toolspeed, { target: this })) && WT.isOn()) {
					this.state = 1;
					to_chat(user, fmt("<span class='notice'>You cut ％！ free from the floor.</span>", [this]));
					yield* this.disconnect_from_network();
				}
			}
		}
		return f.dot;
	}
	if (W.GetID()) {
		if (this.emagged) {
			to_chat(user, "<span class='warning'>The lock seems to be broken!</span>");
			return f.dot;
		}
		if (yield* this.allowed(user)) {
			if (this.active) {
				this.locked = (!this.locked ? 1 : 0);
				to_chat(user, `<span class='notice'>You ${this.locked ? "lock" : "unlock"} the controls.</span>`);
			} else {
				to_chat(user, fmt("<span class='warning'>The controls can only be locked when ％！ is online!</span>", [this]));
			}
		} else {
			to_chat(user, "<span class='danger'>Access denied.</span>");
		}
		return f.dot;
	}
	if (is_wire_tool(W) && this.panel_open) {
		yield* this.wires.interact(user);
		return f.dot;
	}
	if (this.default_deconstruction_screwdriver(user, "emitter_open", "emitter", W)) {
		return f.dot;
	}
	if (yield* this.exchange_parts(user, W)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(W)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(W)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// emitter.dm:345
rt.def("/obj/machinery/power/emitter/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	this.locked = 0;
	this.emagged = 1;
	if (!user) return f.dot;
	user.visible_message(`${user.name} emags the ${this.name}.`, "<span class='notice'>You short out the lock.</span>");
	return f.dot;
});

rt.type(10310, "/obj/machinery/power/emitter/prototype", "/obj/machinery/power/emitter", {
	view_range: 12,
	auto: null,
	icon_state_on: "protoemitter_+a",
	can_buckle: 1,
	buckle_lying: 0,
	name: "Prototype Emitter",
	icon: rt.rsc("icons/obj/turrets.dmi"),
	icon_state: "protoemitter",
});

// emitter.dm:365
rt.def("/obj/machinery/power/emitter/prototype/proc/unbuckle_mob", function* unbuckle_mob(f: Frame) {
	let I: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	playsound(this, rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1);
	this.manual = 0;
	for (I of each(f.args[0].held_items, T("/obj/item"))) {
		if (rt.istype(I, T("/obj/item/weapon/turret_control"))) {
			yield* qdel(I);
		}
	}
	if (rt.istype(f.args[0], T("/mob/living"))) {
		f.args[0].pixel_x = 0;
		f.args[0].pixel_y = 0;
		if (f.args[0].client) {
			yield* f.args[0].client.change_view(f.args[0].client.default_view());
		}
	}
	yield* this.auto.Remove(f.args[0]);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["buckled_mob", "force"] });

// emitter.dm:379
rt.def("/obj/machinery/power/emitter/prototype/proc/user_buckle_mob", function* user_buckle_mob(f: Frame, M: Value, user: Value) {
	let A: Value = null;
	if (user.incapacitated() || !rt.istype(user, T("/mob/living/carbon"))) {
		return f.dot;
	}
	for (A of each(rt.getStep(f, this, 0), T("/atom/movable"))) {
		if (A.density && A != this && A != M) {
			return f.dot;
		}
	}
	yield* M.forceMove(rt.getStep(f, this, 0));
	yield* parent_proc();
	playsound(this, rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1);
	M.pixel_y = 14;
	this.layer = 4.1;
	if (M.client) {
		yield* M.client.change_view(this.view_range);
	}
	if (!this.auto) {
		this.auto = (yield* new_(T("/datum/action/innate/protoemitter/firing")));
	}
	yield* this.auto.Grant(M, this);
	return f.dot;
}, true);

rt.type(169, "/datum/action/innate/protoemitter", "/datum/action/innate", {
	PE: null,
	U: null,
	check_flags: 11,
});

// emitter.dm:402
rt.def("/datum/action/innate/protoemitter/proc/Grant", function* Grant(f: Frame, L: Value, proto: Value) {
	this.PE = proto;
	this.U = L;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(170, "/datum/action/innate/protoemitter/firing", "/datum/action/innate/protoemitter", {
	name: "Switch to Manual Firing",
	desc: "The emitter will only fire on your command and at your designated target",
	button_icon_state: "mech_zoom_on",
});

// emitter.dm:412
rt.def("/datum/action/innate/protoemitter/firing/proc/Activate", function* Activate(f: Frame) {
	let I: Value = null, V: Value = null, I_1: Value = null, TC: Value = null;
	if (this.PE.manual) {
		playsound(this.PE, rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1);
		this.PE.manual = 0;
		this.name = "Switch to Manual Firing";
		this.desc = "The emitter will only fire on your command and at your designated target";
		this.button_icon_state = "mech_zoom_on";
		for (I of each(this.U.held_items, T("/obj/item"))) {
			if (rt.istype(I, T("/obj/item/weapon/turret_control"))) {
				yield* qdel(I);
			}
		}
		yield* this.UpdateButtonIcon();
		return f.dot;
	} else {
		playsound(this.PE, rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1);
		this.name = "Switch to Automatic Firing";
		this.desc = "Emitters will switch to periodic firing at your last target";
		this.button_icon_state = "mech_zoom_off";
		this.PE.manual = 1;
		for (V of each(this.U.held_items)) {
			if (rt.istype((I_1 = V), T("/obj/item"))) {
				if (yield* this.U.dropItemToGround(I_1)) {
					TC = (yield* new_(T("/obj/item/weapon/turret_control")));
					yield* this.U.put_in_hands(TC);
				}
			} else {
				TC = (yield* new_(T("/obj/item/weapon/turret_control")));
				yield* this.U.put_in_hands(TC);
			}
		}
		yield* this.UpdateButtonIcon();
	}
	return f.dot;
}, true);

rt.type(7642, "/obj/item/weapon/turret_control", "/obj/item/weapon", {
	delay: 0,
	flags: 130,
	name: "turret controls",
	icon_state: "offhand",
	w_class: 5,
	resistance_flags: 54,
});

// emitter.dm:450
rt.def("/obj/item/weapon/turret_control/proc/afterattack", function* afterattack(f: Frame, targeted_atom: Value, user: Value) {
	let E: Value = null;
	yield* parent_proc();
	yield* (E = user.buckled).setDir(rt.getDir(f, E, targeted_atom));
	yield* user.setDir(E.dir);
	if (E.dir === 1) {
		E.layer = 3.9;
		user.pixel_x = 0;
		user.pixel_y = -14;
	} else if (E.dir === 5) {
		E.layer = 3.9;
		user.pixel_x = -8;
		user.pixel_y = -12;
	} else if (E.dir === 4) {
		E.layer = 4.1;
		user.pixel_x = -14;
		user.pixel_y = 0;
	} else if (E.dir === 6) {
		E.layer = 3.9;
		user.pixel_x = -8;
		user.pixel_y = 12;
	} else if (E.dir === 2) {
		E.layer = 4.1;
		user.pixel_x = 0;
		user.pixel_y = 14;
	} else if (E.dir === 10) {
		E.layer = 3.9;
		user.pixel_x = 8;
		user.pixel_y = 12;
	} else if (E.dir === 8) {
		E.layer = 4.1;
		user.pixel_x = 14;
		user.pixel_y = 0;
	} else if (E.dir === 9) {
		E.layer = 3.9;
		user.pixel_x = 8;
		user.pixel_y = -12;
	}
	if (E.charge >= 10 && rt.worldTime(f) > this.delay) {
		E.charge -= 10;
		E.target = targeted_atom;
		yield* E.fire_beam(targeted_atom, user);
		this.delay = rt.worldTime(f) + 10;
	} else {
		if (!(E.charge < 10)) return f.dot;
		playsound(rt.getStep(f, user, 0), rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 1);
	}
	return f.dot;
}, true);
