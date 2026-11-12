// Based on /tg/station's code/modules/holodeck/computer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10421, "/obj/machinery/computer/holodeck", "/obj/machinery/computer", {
	linked: null,
	program: null,
	last_program: null,
	program_cache: null,
	emag_programs: null,
	init_program: null,
	random_program: 0,
	active: 0,
	starting_program: null,
	damaged: 0,
	spawned: null,
	effects: null,
	last_change: 0,
	offline_program: rt.typePath("/area/holodeck/rec_center/offline"),
	holodeck_type: rt.typePath("/area/holodeck/rec_center"),
	program_type: rt.typePath("/area/holodeck/rec_center"),
	icon_screen: "holocontrol",
	name: "holodeck control console",
	desc: "A computer used to control a nearby holodeck.",
	idle_power_usage: 10,
	active_power_usage: 50,
});

// computer.dm:29
rt.def("/obj/machinery/computer/holodeck/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.program_cache = list();

	this.emag_programs = list();

	this.spawned = list();

	this.effects = list();
	return f.dot;
});

// computer.dm:51
rt.def("/obj/machinery/computer/holodeck/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	return INITIALIZE_HINT_LATELOAD;
}, true);

// computer.dm:55
rt.def("/obj/machinery/computer/holodeck/proc/LateInitialize", function* LateInitialize(f: Frame) {
	let possible: Value = null, AS: Value = null, typekey: Value = null, A: Value = null;
	if (ispath(this.holodeck_type, T("/area"))) {
		this.linked = pop((possible = (yield* get_areas(this.holodeck_type, { subtypes: 0 }))));
	}
	if (ispath(this.offline_program, T("/area"))) {
		this.offline_program = pop((possible = (yield* get_areas(this.offline_program, { subtypes: 0 }))));
	}
	if (!this.linked || !this.offline_program) {
		log_world("No matching holodeck area found");
		yield* qdel(this);
		return f.dot;
	}
	if (rt.istype((AS = get_area(this)), T("/area/holodeck"))) {
		log_world("### MAPPING ERROR");
		log_world("Holodeck computer cannot be in a holodeck.");
		log_world("This would cause circular power dependency.");
		yield* qdel(this);
		return f.dot;
	} else {
		this.linked.linked = this;
	}
	this.program_cache = list();
	this.emag_programs = list();
	for (typekey of each(typesof(this.program_type) - this.program_type)) {
		if (!(A = rt.locateIn(f, typekey, rt.world())) || A == this.offline_program) {
			continue;
		}
		if (rt.len(f, A.contents) == 0) {
			continue;
		}
		if (A.restricted) {
			this.emag_programs += A;
		} else {
			this.program_cache += A;
		}
		if (typekey == this.init_program) {
			yield* this.load_program(A, { force: 1 });
		}
	}
	if (this.random_program && rt.len(f, this.program_cache) && this.init_program === null) {
		yield* this.load_program(pick(this.program_cache), { force: 1 });
	} else {
		if (this.program) return f.dot;
		yield* this.load_program(this.offline_program);
	}
	return f.dot;
}, true);

// computer.dm:96
rt.def("/obj/machinery/computer/holodeck/proc/power_change", function* power_change(f: Frame) {
	yield* parent_proc();
	yield* this.toggle_power((!this.stat ? 1 : 0));
	return f.dot;
}, true);

// computer.dm:100
rt.def("/obj/machinery/computer/holodeck/proc/toggle_power", function* toggle_power(f: Frame, toggleOn: Value) {
	toggleOn ??= 0;
	// tg_js: the holodeck is off, starting (`starting_program` set: a power-on waiting out the 2.5 s recalibration before it
	// shows that program) or on. Switching off or picking a program while starting cancels the start (tg checked only
	// `active`, set after the wait, so a switch-off then was dropped and the wait's end overwrote a program picked meanwhile).
	if (toggleOn ? this.active || this.starting_program : !this.active && !this.starting_program) {
		return f.dot;
	}
	if (toggleOn) {
		if (this.last_program && this.last_program != this.offline_program) {
			this.starting_program = this.last_program;
			yield* this.load_program(this.last_program, { delay: 1 });
			this.starting_program = null;
		} else {
			this.active = 1;
		}
	} else {
		if (this.active) {
			this.last_program = this.program;
		}
		this.starting_program = null;
		yield* this.load_program(this.offline_program, { force: 1 });
		this.active = 0;
	}
	return f.dot;
}, true);

// computer.dm:112
rt.def("/obj/machinery/computer/holodeck/proc/emergency_shutdown", function* emergency_shutdown(f: Frame) {
	this.last_program = this.program;
	this.starting_program = null;
	yield* this.load_program(this.offline_program, 1);
	this.active = 0;
	return f.dot;
}, true);

// computer.dm:118
rt.def("/obj/machinery/computer/holodeck/proc/process", function* process(f: Frame) {
	let _T: Value = null, s: Value = null, M: Value = null, item: Value = null, HE: Value = null;
	if (this.damaged) {
		if (prob(10)) {
			for (_T of each(this.linked, T("/turf"))) {
				if (prob(5)) {
					yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(2, 1, _T);
					yield* s.start();
					return f.dot;
				}
			}
		}
	}
	if (!(yield* parent_proc()) || !this.active) {
		return f.dot;
	}
	if (!this.floorcheck()) {
		yield* this.emergency_shutdown();
		this.damaged = 1;
		for (M of each(urange(10, this), T("/mob"))) {
			M.show_message("The holodeck overloads!");
		}
		_T = null;
		for (_T of each(this.linked, T("/turf"))) {
			if (prob(30)) {
				yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(2, 1, _T);
				yield* s.start();
			}
			yield* _T.ex_act(3);
			yield* _T.hotspot_expose(1000, 500, 1);
		}
	}
	if (!this.emagged) {
		for (item of each(this.spawned)) {
			if (!rt.isIn(f, rt.getStep(f, item, 0), this.linked)) {
				yield* this.derez(item, 0);
			}
		}
	}
	for (HE of each(this.effects, T("/obj/effect/holodeck_effect"))) {
		yield* HE.tick();
	}
	this.active_power_usage = 50 + rt.len(f, this.spawned) * 3 + rt.len(f, this.effects) * 5;
	return f.dot;
}, true, { waitfor: false });

// computer.dm:153
rt.def("/obj/machinery/computer/holodeck/proc/floorcheck", function floorcheck(f: Frame) {
	let _T: Value = null;
	for (_T of each(this.linked, T("/turf"))) {
		if (!_T.intact || rt.istype(_T, T("/turf/open/space"))) {
			return 0;
		}
	}
	return 1;
});

// computer.dm:159
rt.def("/obj/machinery/computer/holodeck/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let areapath: Value = null, area: Value = null, safe: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (rt.at(href_list, "loadarea")) {
		if (!ispath((areapath = text2path(rt.at(href_list, "loadarea"))), T("/area/holodeck"))) {
			return f.dot;
		}
		if (!rt.istype((area = rt.locateIn(f, areapath, rt.world())), T("/area/holodeck"))) {
			return f.dot;
		}
		if (area == this.offline_program || rt.isIn(f, area, this.program_cache) || this.emagged && rt.isIn(f, area, this.emag_programs)) {
			yield* this.load_program(area);
		}
	} else if (rt.isIn(f, "safety", href_list)) {
		safe = text2num(rt.at(href_list, "safety"));
		if (!rt.istype(f.usr, T("/mob/living/silicon"))) {
			return f.dot;
		}
		this.emagged = (!safe ? 1 : 0);
		if (!this.program) {
			return f.dot;
		}
		if (safe && rt.isIn(f, this.program, this.emag_programs)) {
			yield* this.emergency_shutdown();
		}
		this.nerf(safe);
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// computer.dm:185
rt.def("/obj/machinery/computer/holodeck/proc/nerf", function nerf(f: Frame, active: Value) {
	let I: Value = null, HE: Value = null;
	let $e: any;
	for (I of each(this.spawned, T("/obj/item"))) {
		I.damtype = active ? "stamina" : rt.initial(f, I, "damtype");
	}
	for (HE of each(this.effects, T("/obj/effect/holodeck_effect"))) {
		HE.safety(active);
	}
	return f.dot;
});

// computer.dm:191
rt.def("/obj/machinery/computer/holodeck/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	if (!rt.len(f, this.emag_programs)) {
		to_chat(user, `${this} does not seem to have a card swipe port.  It must be an inferior model.`);
		return f.dot;
	}
	playsound(this.loc, rt.rsc("sound/effects/sparks4.ogg"), 75, 1);
	this.emagged = 1;
	to_chat(user, "<span class='warning'>You vastly increase projector power and override the safety and security protocols.</span>");
	to_chat(user, "Warning.  Automatic shutoff and derezing protocols have been corrupted.  Please call Nanotrasen maintenance and do not use the simulator.");
	log_game(`${key_name(user)} emagged the Holodeck Control Console`);
	yield* this.updateUsrDialog();
	this.nerf((!this.emagged ? 1 : 0));
	return f.dot;
}, true);

// computer.dm:205
rt.def("/obj/machinery/computer/holodeck/proc/Destroy", function* Destroy(f: Frame) {
	if (this.linked) {
		yield* this.emergency_shutdown();
		this.linked.linked = null;
	}
	return (yield* parent_proc());
}, true);

// computer.dm:210
rt.def("/obj/machinery/computer/holodeck/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.emergency_shutdown();
	return (yield* parent_proc());
}, true);

// computer.dm:214
rt.def("/obj/machinery/computer/holodeck/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* this.emergency_shutdown();
	return (yield* parent_proc());
}, true, { waitfor: false });

// computer.dm:218
rt.def("/obj/machinery/computer/holodeck/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	yield* this.emergency_shutdown();
	return (yield* parent_proc());
}, true);
