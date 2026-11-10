// Based on /tg/station's code/modules/power/gravitygenerator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, subtract, fmt } = rt;


// gravitygenerator.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalgravity_generators", function InitGlobalgravity_generators(f: Frame) {
	GLOB.gravity_generators = list();
	this.gvars_datum_init_order += "gravity_generators";
	return f.dot;
});

rt.type(10634, "/obj/machinery/gravity_generator", "/obj/machinery", {
	sprite_number: 0,
	anchored: 1,
	name: "gravitational generator",
	desc: "A device which produces a graviton field when set up.",
	icon: rt.rsc("icons/obj/machines/gravity_generator.dmi"),
	density: 1,
	use_power: 0,
	resistance_flags: 115,
});

// gravitygenerator.dm:35
rt.def("/obj/machinery/gravity_generator/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (severity != 1) return f.dot;
	yield* this.set_broken();
	return f.dot;
}, true, { waitfor: false });

// gravitygenerator.dm:39
rt.def("/obj/machinery/gravity_generator/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (!prob(20)) return f.dot;
	yield* this.set_broken();
	return f.dot;
}, true);

// gravitygenerator.dm:43
rt.def("/obj/machinery/gravity_generator/proc/tesla_act", function* tesla_act(f: Frame, power: Value, explosive: Value) {
	yield* parent_proc();
	if (!explosive) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// gravitygenerator.dm:48
rt.def("/obj/machinery/gravity_generator/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `${this.get_status()}_${this.sprite_number}`;
	return f.dot;
});

// gravitygenerator.dm:56
rt.def("/obj/machinery/gravity_generator/proc/get_status", function get_status(f: Frame) {
	return "off";
});

// gravitygenerator.dm:60
rt.def("/obj/machinery/gravity_generator/proc/Move", function* Move(f: Frame) {
	yield* parent_proc();
	yield* qdel(this);
	return f.dot;
}, true);

// gravitygenerator.dm:64
rt.def("/obj/machinery/gravity_generator/proc/set_broken", function set_broken(f: Frame) {
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	return f.dot;
});

// gravitygenerator.dm:67
rt.def("/obj/machinery/gravity_generator/proc/set_fix", function set_fix(f: Frame) {
	(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
	return f.dot;
});

rt.type(10635, "/obj/machinery/gravity_generator/part", "/obj/machinery/gravity_generator", {
	main_part: null,
});

// gravitygenerator.dm:71
rt.def("/obj/machinery/gravity_generator/part/proc/Destroy", function* Destroy(f: Frame) {
	if (this.main_part) {
		yield* qdel(this.main_part);
	}
	yield* this.set_broken();
	return (yield* parent_proc());
}, true);

// gravitygenerator.dm:83
rt.def("/obj/machinery/gravity_generator/part/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	return (yield* this.main_part.attackby(I, user));
}, true);

// gravitygenerator.dm:86
rt.def("/obj/machinery/gravity_generator/part/proc/get_status", function get_status(f: Frame) {
	return this.main_part.get_status();
});

// gravitygenerator.dm:89
rt.def("/obj/machinery/gravity_generator/part/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	return (yield* this.main_part.attack_hand(user));
}, true);

// gravitygenerator.dm:92
rt.def("/obj/machinery/gravity_generator/part/proc/set_broken", function* set_broken(f: Frame) {
	yield* parent_proc();
	if (!(this.main_part && !rt.bitAnd(this.main_part.stat, 1))) return f.dot;
	yield* this.main_part.set_broken();
	return f.dot;
}, true);

rt.type(10637, "/obj/machinery/gravity_generator/main/station", "/obj/machinery/gravity_generator/main", {});

// gravitygenerator.dm:101
rt.def("/obj/machinery/gravity_generator/main/station/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.setup_parts();
	this.middle.add_overlay("activated");
	this.update_list();
	return f.dot;
}, true);

rt.type(10636, "/obj/machinery/gravity_generator/main", "/obj/machinery/gravity_generator", {
	on: 1,
	breaker: 1,
	parts: null,
	middle: null,
	charging_state: 0,
	charge_count: 100,
	current_overlay: null,
	broken_state: 0,
	sprite_number: 8,
	icon_state: "on_8",
	idle_power_usage: 0,
	active_power_usage: 3000,
	power_channel: 3,
	use_power: 1,
	interact_offline: 1,
});

// gravitygenerator.dm:126
rt.def("/obj/machinery/gravity_generator/main/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.parts = list();
	return f.dot;
});

// gravitygenerator.dm:134
rt.def("/obj/machinery/gravity_generator/main/proc/Destroy", function* Destroy(f: Frame) {
	let O: Value = null;
	this.investigate_log("was destroyed!", "gravity");
	this.on = 0;
	this.update_list();
	for (O of each(this.parts, T("/obj/machinery/gravity_generator/part"))) {
		O.main_part = null;
		if (!(!O || O.gc_destroyed == -3)) {
			yield* qdel(O);
		}
	}
	return (yield* parent_proc());
}, true);

// gravitygenerator.dm:144
rt.def("/obj/machinery/gravity_generator/main/proc/setup_parts", function* setup_parts(f: Frame) {
	let _T: Value = null, part: Value = null;
	let our_turf: Value = rt.getStep(f, this, 0);
	let spawn_turfs: Value = block(rt.locate(our_turf.x - 1, our_turf.y + 2, our_turf.z), rt.locate(our_turf.x + 1, our_turf.y, our_turf.z));
	let count: Value = 10;
	for (_T of each(spawn_turfs, T("/turf"))) {
		count--;
		if (_T == our_turf) {
			continue;
		}
		part = (yield* new_(T("/obj/machinery/gravity_generator/part"), _T));
		if (count == 5) {
			this.middle = part;
		}
		if (count <= 3) {
			part.density = 0;
			part.layer = WALL_OBJ_LAYER;
		}
		part.sprite_number = count;
		part.main_part = this;
		this.parts += part;
		yield* part.update_icon();
	}
	return f.dot;
}, true);

// gravitygenerator.dm:164
rt.def("/obj/machinery/gravity_generator/main/proc/connected_parts", function connected_parts(f: Frame) {
	return (rt.len(f, this.parts) == 8 ? 1 : 0);
});

// gravitygenerator.dm:167
rt.def("/obj/machinery/gravity_generator/main/proc/set_broken", function* set_broken(f: Frame) {
	let M: Value = null;
	yield* parent_proc();
	for (M of each(this.parts, T("/obj/machinery/gravity_generator"))) {
		if (!rt.bitAnd(M.stat, 1)) {
			yield* M.set_broken();
		}
	}
	this.middle.cut_overlays();
	this.charge_count = 0;
	this.breaker = 0;
	yield* this.set_power();
	yield* this.set_state(0);
	this.investigate_log("has broken down.", "gravity");
	return f.dot;
}, true);

// gravitygenerator.dm:179
rt.def("/obj/machinery/gravity_generator/main/proc/set_fix", function* set_fix(f: Frame) {
	let M: Value = null;
	yield* parent_proc();
	for (M of each(this.parts, T("/obj/machinery/gravity_generator"))) {
		if (rt.bitAnd(M.stat, 1)) {
			yield* M.set_fix();
		}
	}
	this.broken_state = 0;
	yield* this.update_icon();
	yield* this.set_power();
	return f.dot;
}, true);

// gravitygenerator.dm:191
rt.def("/obj/machinery/gravity_generator/main/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let WT: Value = null, PS: Value = null;
	if (this.broken_state === 0) {
		if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
			to_chat(user, "<span class='notice'>You secure the screws of the framework.</span>");
			playsound(this.loc, I.usesound, 50, 1);
			this.broken_state++;
			yield* this.update_icon();
			return f.dot;
		}
	} else if (this.broken_state === 1) {
		if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
			if (yield* (WT = I).remove_fuel(1, user)) {
				to_chat(user, "<span class='notice'>You mend the damaged framework.</span>");
				playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
				this.broken_state++;
				yield* this.update_icon();
			} else if (WT.isOn()) {
				to_chat(user, "<span class='warning'>You don't have enough fuel to mend the damaged framework!</span>");
			}
			return f.dot;
		}
	} else if (this.broken_state === 2) {
		if (rt.istype(I, T("/obj/item/stack/sheet/plasteel"))) {
			if ((PS = I).get_amount() >= 10) {
				yield* PS.use(10);
				to_chat(user, "<span class='notice'>You add the plating to the framework.</span>");
				playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 75, 1);
				this.broken_state++;
				yield* this.update_icon();
			} else {
				to_chat(user, "<span class='warning'>You need 10 sheets of plasteel!</span>");
			}
			return f.dot;
		}
	} else if (this.broken_state === 3) {
		if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
			to_chat(user, "<span class='notice'>You secure the plating to the framework.</span>");
			playsound(this.loc, I.usesound, 75, 1);
			yield* this.set_fix();
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

// gravitygenerator.dm:232
rt.def("/obj/machinery/gravity_generator/main/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) return f.dot;
	return (yield* this.interact(user));
}, true);

// gravitygenerator.dm:236
rt.def("/obj/machinery/gravity_generator/main/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	let $0: any;
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	let dat: Value = "Gravity Generator Breaker: ";
	if (this.breaker) {
		dat += fmt("<span class='linkOn'>ON</span> <A href='?src=＃;gentoggle=1'>OFF</A>", [this]);
	} else {
		dat += fmt("<A href='?src=＃;gentoggle=1'>ON</A> <span class='linkOn'>OFF</span> ", [this]);
	}
	dat += "<br>Generator Status:<br><div class='statusDisplay'>";
	if (this.charging_state != 0) {
		if (this.charging_state == 1) {
			$0 = "Charging...";
		} else {
			$0 = "Discharging...";
		}
		dat += `<font class='bad'>WARNING</font> Radiation Detected. <br>${$0}`;
	} else if (this.on) {
		dat += "Powered.";
	} else {
		dat += "Unpowered.";
	}
	dat += `<br>Gravity Charge: ${this.charge_count}%</div>`;
	(popup = (yield* new_(T("/datum/browser"), user, "gravgen", this.name))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// gravitygenerator.dm:261
rt.def("/obj/machinery/gravity_generator/main/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let $0: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!rt.at(href_list, "gentoggle")) return f.dot;
	this.breaker = (!this.breaker ? 1 : 0);
	if (this.breaker) {
		$0 = "<font color='green'>ON</font>";
	} else {
		$0 = "<font color='red'>OFF</font>";
	}
	this.investigate_log(`was toggled ${$0} by ${f.usr.key}.`, "gravity");
	yield* this.set_power();
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// gravitygenerator.dm:273
rt.def("/obj/machinery/gravity_generator/main/proc/power_change", function* power_change(f: Frame) {
	yield* parent_proc();
	this.investigate_log(`has ${rt.bitAnd(this.stat, 2) ? "lost" : "regained"} power.`, "gravity");
	yield* this.set_power();
	return f.dot;
}, true);

// gravitygenerator.dm:278
rt.def("/obj/machinery/gravity_generator/main/proc/get_status", function get_status(f: Frame) {
	if (rt.bitAnd(this.stat, 1)) {
		return `fix${min(this.broken_state, 3)}`;
	}
	return this.on || this.charging_state != 0 ? "on" : "off";
});

// gravitygenerator.dm:283
rt.def("/obj/machinery/gravity_generator/main/proc/update_icon", function* update_icon(f: Frame) {
	let O: Value = null;
	yield* parent_proc();
	for (O of each(this.parts, T("/obj"))) {
		yield* O.update_icon();
	}
	return f.dot;
}, true);

// gravitygenerator.dm:290
rt.def("/obj/machinery/gravity_generator/main/proc/set_power", function* set_power(f: Frame) {
	let new_state: Value = 0;
	if (rt.bitAnd(this.stat, 3) || !this.breaker) {
		new_state = 0;
	} else if (this.breaker) {
		new_state = 1;
	}
	this.charging_state = new_state ? 1 : 2;
	this.investigate_log(`is now ${this.charging_state == 1 ? "charging" : "discharging"}.`, "gravity");
	yield* this.update_icon();
	return f.dot;
}, true);

// gravitygenerator.dm:302
rt.def("/obj/machinery/gravity_generator/main/proc/set_state", function* set_state(f: Frame, new_state: Value) {
	let $0: any, $1: any;
	this.charging_state = 0;
	this.on = new_state;
	this.use_power = this.on ? 2 : 1;
	let alert: Value = 0;
	let A: Value = get_area(this);
	if (GLOB.SSticker.IsRoundInProgress()) {
		if (this.on) {
			if (this.gravity_in_level() == 0) {
				alert = 1;
				this.investigate_log("was brought online and is now producing gravity for this level.", "gravity");
				$0 = A;
				if (this) {
					$1 = `${`(${this.x},${this.y},${this.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`;
				} else {
					$1 = "nonexistent location";
				}
				message_admins(`The gravity generator was brought online ${$0}${`${$1}`}`);
			}
		} else if (this.gravity_in_level() == 1) {
			alert = 1;
			this.investigate_log("was brought offline and there is now no gravity for this level.", "gravity");
			$0 = A;
			if (this) {
				$1 = `${`(${this.x},${this.y},${this.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`;
			} else {
				$1 = "nonexistent location";
			}
			message_admins(`The gravity generator was brought offline with no backup generator. ${$0}${`${$1}`}`);
		}
	}
	yield* this.update_icon();
	this.update_list();
	yield* this.updateUsrDialog();
	if (!alert) return f.dot;
	yield* this.shake_everyone();
	return f.dot;
}, true);

// gravitygenerator.dm:328
rt.def("/obj/machinery/gravity_generator/main/proc/process", function* process(f: Frame) {
	let overlay_state: Value = null;
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	if (this.charging_state == 0) return f.dot;
	if (this.charging_state == 1 && this.charge_count >= 100) {
		yield* this.set_state(1);
	} else if (this.charging_state == 2 && this.charge_count <= 0) {
		yield* this.set_state(0);
	} else {
		if (this.charging_state == 1) {
			this.charge_count += 2;
		} else if (this.charging_state == 2) {
			this.charge_count -= 2;
		}
		if (this.charge_count % 4 == 0 && prob(75)) {
			playsound(this.loc, rt.rsc("sound/effects/empulse.ogg"), 100, 1);
		}
		yield* this.updateDialog();
		if (prob(25)) {
			yield* this.pulse_radiation();
		}
		if (rt.inRange(this.charge_count, 0, 20)) {
		} else if (rt.inRange(this.charge_count, 21, 40)) {
			overlay_state = "startup";
		} else if (rt.inRange(this.charge_count, 41, 60)) {
			overlay_state = "idle";
		} else if (rt.inRange(this.charge_count, 61, 80)) {
			overlay_state = "activating";
		} else if (rt.inRange(this.charge_count, 81, 100)) {
			overlay_state = "activated";
		}
		if (overlay_state == this.current_overlay) return f.dot;
		if (!this.middle) return f.dot;
		this.middle.cut_overlays();
		if (overlay_state) {
			this.middle.add_overlay(overlay_state);
		}
		this.current_overlay = overlay_state;
	}
	return f.dot;
}, true, { waitfor: false });

// gravitygenerator.dm:370
rt.def("/obj/machinery/gravity_generator/main/proc/pulse_radiation", function* pulse_radiation(f: Frame) {
	yield* radiation_pulse(rt.getStep(f, this, 0), 3, 7, 20);
	return f.dot;
}, true);

// gravitygenerator.dm:374
rt.def("/obj/machinery/gravity_generator/main/proc/shake_everyone", function* shake_everyone(f: Frame) {
	let M: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	for (M of each(GLOB.mob_list, T("/mob"))) {
		if (M.z != this.z) {
			continue;
		}
		yield* M.update_gravity(M.mob_has_gravity());
		if (M.client) {
			shake_camera(M, 15, 1);
			M.playsound_local(_T, rt.rsc("sound/effects/alert.ogg"), 100, 1, 0.5);
		}
	}
	return f.dot;
}, true);

// gravitygenerator.dm:384
rt.def("/obj/machinery/gravity_generator/main/proc/gravity_in_level", function gravity_in_level(f: Frame) {
	let _T: Value = null;
	if (!(_T = rt.getStep(f, this, 0))) {
		return 0;
	}
	if (rt.index(GLOB.gravity_generators, `${_T.z}`)) {
		return rt.length(rt.index(GLOB.gravity_generators, `${_T.z}`));
	}
	return 0;
});

// gravitygenerator.dm:392
rt.def("/obj/machinery/gravity_generator/main/proc/update_list", function update_list(f: Frame) {
	let _T: Value = null;
	if (!(_T = rt.getStep(f, this.loc, 0))) return f.dot;
	if (!rt.index(GLOB.gravity_generators, `${_T.z}`)) {
		rt.setAt(GLOB.gravity_generators, `${_T.z}`, list());
	}
	if (this.on) {
		(rt.modAt(GLOB.gravity_generators, `${_T.z}`, this, rt.bitOr));
	} else {
		(rt.modAt(GLOB.gravity_generators, `${_T.z}`, this, subtract));
	}
	return f.dot;
});
