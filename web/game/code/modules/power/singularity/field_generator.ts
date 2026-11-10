// Based on /tg/station's code/modules/power/singularity/field_generator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10632, "/obj/machinery/field/generator", "/obj/machinery/field", {
	num_power_levels: 6,
	power_level: 0,
	active: 0,
	power: 20,
	state: 0,
	warming_up: 0,
	fields: null,
	connected_gens: null,
	clean_up: 0,
	anchored: 0,
	name: "field generator",
	desc: "A large thermal battery that projects a high amount of energy when powered.",
	icon: rt.rsc("icons/obj/machines/field_generator.dmi"),
	icon_state: "Field_Gen",
	density: 1,
	use_power: 0,
	obj_integrity: 500,
	max_integrity: 500,
	armor: null,
}, { const: ["num_power_levels"] });

// field_generator.dm:32
rt.def("/obj/machinery/field/generator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 25, "bullet", 10, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 70]);
	return f.dot;
});

// field_generator.dm:44
rt.def("/obj/machinery/field/generator/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (this.warming_up) {
		this.add_overlay(`+a${this.warming_up}`);
	}
	if (rt.len(f, this.fields)) {
		this.add_overlay("+on");
	}
	if (!this.power_level) return f.dot;
	this.add_overlay(`+p${this.power_level}`);
	return f.dot;
});

// field_generator.dm:54
rt.def("/obj/machinery/field/generator/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.fields = list();
	this.connected_gens = list();
	return f.dot;
}, true);

// field_generator.dm:60
rt.def("/obj/machinery/field/generator/proc/process", function process(f: Frame) {
	if (this.active != 2) return f.dot;
	this.calc_power();
	return f.dot;
}, false, { waitfor: false });

// field_generator.dm:64
rt.def("/obj/machinery/field/generator/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.state == FG_WELDED) {
		if (get_dist(this, user) <= 1) {
			if (this.active >= 1) {
				to_chat(user, `<span class='warning'>You are unable to turn off the ${this.name} once it is online!</span>`);
				return 1;
			} else {
				user.visible_message(`${user.name} turns on the ${this.name}.`, `<span class='notice'>You turn on the ${this.name}.</span>`, "<span class='italics'>You hear heavy droning.</span>");
				yield* this.turn_on();
				this.investigate_log(`<font color='green'>activated</font> by ${user.key}.`, "singulo");
				yield* this.add_fingerprint(user);
			}
		}
	} else {
		to_chat(user, `<span class='warning'>The ${this} needs to be firmly secured to the floor first!</span>`);
	}
	return f.dot;
}, true);

// field_generator.dm:81
rt.def("/obj/machinery/field/generator/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame, user: Value, silent: Value) {
	if (this.state == FG_WELDED) {
		if (!silent) {
			to_chat(user, `<span class='warning'>${this} is welded to the floor!</span>`);
		}
		return FAILED_UNFASTEN;
	}
	return parent_proc();
}, false);

// field_generator.dm:88
rt.def("/obj/machinery/field/generator/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* parent_proc());
	if (f.dot != SUCCESSFUL_UNFASTEN) return f.dot;
	if (this.anchored) {
		this.state = FG_SECURED;
	} else {
		this.state = FG_UNSECURED;
	}
	return f.dot;
}, true, { args: ["user", "W", "time"] });

// field_generator.dm:97
rt.def("/obj/machinery/field/generator/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null;
	if (this.active) {
		to_chat(user, `<span class='warning'>${this} needs to be off!</span>`);
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		yield* this.default_unfasten_wrench(user, W, 0);
	} else if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		WT = W;
		if (this.state === 0) {
			to_chat(user, `<span class='warning'>The ${this.name} needs to be wrenched to the floor!</span>`);
		} else if (this.state === 1) {
			if (yield* WT.remove_fuel(0, user)) {
				playsound(this.loc, WT.usesound, 50, 1);
				user.visible_message(`${user.name} starts to weld the ${this.name} to the floor.`, fmt("<span class='notice'>You start to weld ％！ to the floor...</span>", [this]), "<span class='italics'>You hear welding.</span>");
				if ((yield* do_after(user, 20 * W.toolspeed, { target: this })) && this.state == 1 && WT.isOn()) {
					this.state = 2;
					to_chat(user, "<span class='notice'>You weld the field generator to the floor.</span>");
				}
			}
		} else if (this.state === 2) {
			if (yield* WT.remove_fuel(0, user)) {
				playsound(this.loc, WT.usesound, 50, 1);
				user.visible_message(`${user.name} starts to cut the ${this.name} free from the floor.`, fmt("<span class='notice'>You start to cut ％！ free from the floor...</span>", [this]), "<span class='italics'>You hear welding.</span>");
				if ((yield* do_after(user, 20 * W.toolspeed, { target: this })) && this.state == 2 && WT.isOn()) {
					this.state = 1;
					to_chat(user, fmt("<span class='notice'>You cut ％！ free from the floor.</span>", [this]));
				}
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// field_generator.dm:132
rt.def("/obj/machinery/field/generator/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	if (M.environment_smash >= 3 && this.active == 0 && this.state != 0) {
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

// field_generator.dm:147
rt.def("/obj/machinery/field/generator/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (this.active) {
		return 0;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// field_generator.dm:152
rt.def("/obj/machinery/field/generator/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	if (Proj.flag != "bullet") {
		this.power = min(this.power + Proj.damage, 250);
		this.check_power_level();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// field_generator.dm:159
rt.def("/obj/machinery/field/generator/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.cleanup();
	return (yield* parent_proc());
}, true);

// field_generator.dm:164
rt.def("/obj/machinery/field/generator/proc/check_power_level", function check_power_level(f: Frame) {
	let new_level: Value = null;
	if ((new_level = round(6 * this.power / 250)) == this.power_level) return f.dot;
	this.power_level = new_level;
	this.update_icon();
	return f.dot;
});

// field_generator.dm:171
rt.def("/obj/machinery/field/generator/proc/turn_off", function turn_off(f: Frame) {
	this.active = 0;
	rt.spawnTail(f, 1, "/obj/machinery/field/generator/proc/turn_off: spawn at modules/power/singularity/field_generator.dm:171");
	return f.dot;
});

// a spawn(1) body of /obj/machinery/field/generator/proc/turn_off, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/turn_off: spawn at modules/power/singularity/field_generator.dm:171", function* (f: Frame) {
	yield* this.cleanup();
	while (this.warming_up > 0 && !this.active) {
		yield* sleep(50);
		this.warming_up--;
		yield* this.update_icon();
	}
	return null;
});

// field_generator.dm:180
rt.def("/obj/machinery/field/generator/proc/turn_on", function turn_on(f: Frame) {
	this.active = 1;
	rt.spawnTail(f, 1, "/obj/machinery/field/generator/proc/turn_on: spawn at modules/power/singularity/field_generator.dm:180");
	return f.dot;
});

// a spawn(1) body of /obj/machinery/field/generator/proc/turn_on, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/turn_on: spawn at modules/power/singularity/field_generator.dm:180", function* (f: Frame) {
	while (this.warming_up < 3 && this.active) {
		yield* sleep(50);
		this.warming_up++;
		yield* this.update_icon();
		if (this.warming_up >= 3) {
			this.start_fields();
		}
	}
	return null;
});

// field_generator.dm:190
rt.def("/obj/machinery/field/generator/proc/calc_power", function calc_power(f: Frame, set_power_draw: Value) {
	let power_draw: Value = 2 + rt.len(f, this.fields);
	if (set_power_draw) {
		power_draw = set_power_draw;
	}
	if (this.draw_power(round(power_draw / 2, 1))) {
		this.check_power_level();
		return 1;
	} else {
		this.visible_message(`<span class='danger'>The ${this.name} shuts down!</span>`, "<span class='italics'>You hear something shutting down.</span>");
		this.turn_off();
		this.investigate_log("ran out of power and <font color='red'>deactivated</font>", "singulo");
		this.power = 0;
		this.check_power_level();
		return 0;
	}
});

// field_generator.dm:207
rt.def("/obj/machinery/field/generator/proc/draw_power", function draw_power(f: Frame, draw: Value, failsafe: Value, G: Value, last: Value) {
	let CG: Value = null, FG: Value = null;
	draw ??= 0;
	failsafe ??= 0;
	if (G && G == this || failsafe >= 8) {
		return 0;
	} else {
		failsafe++;
	}
	if (this.power >= draw) {
		this.power -= draw;
		return 1;
	} else {
		draw -= this.power;
		this.power = 0;
		for (CG of each(this.connected_gens)) {
			if ((FG = CG) == last) {
				continue;
			}
			if (G) {
				if (FG.draw_power(draw, failsafe, G, this)) {
					return 1;
				} else {
					return 0;
				}
			} else if (FG.draw_power(draw, failsafe, this, this)) {
				return 1;
			} else {
				return 0;
			}
		}
	}
	return f.dot;
});

// field_generator.dm:236
rt.def("/obj/machinery/field/generator/proc/start_fields", function start_fields(f: Frame) {
	if (this.state != FG_WELDED || !this.anchored) {
		this.turn_off();
		return f.dot;
	}
	rt.spawnTail(f, 1, "/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:239");
	rt.spawnTail(f, 2, "/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:241");
	rt.spawnTail(f, 3, "/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:243");
	rt.spawnTail(f, 4, "/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:245");
	rt.spawnTail(f, 5, "/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:247");
	return f.dot;
});

// a spawn(5) body of /obj/machinery/field/generator/proc/start_fields, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:247", function* (f: Frame) {
	this.active = 2;
	return null;
});

// a spawn(4) body of /obj/machinery/field/generator/proc/start_fields, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:245", function* (f: Frame) {
	yield* this.setup_field(8);
	return null;
});

// a spawn(3) body of /obj/machinery/field/generator/proc/start_fields, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:243", function* (f: Frame) {
	yield* this.setup_field(4);
	return null;
});

// a spawn(2) body of /obj/machinery/field/generator/proc/start_fields, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:241", function* (f: Frame) {
	yield* this.setup_field(2);
	return null;
});

// a spawn(1) body of /obj/machinery/field/generator/proc/start_fields, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:239", function* (f: Frame) {
	yield* this.setup_field(1);
	return null;
});

// field_generator.dm:252
rt.def("/obj/machinery/field/generator/proc/setup_field", function* setup_field(f: Frame, NSEW: Value) {
	let _T: Value = null, G: Value = null, dist: Value = null, TC: Value = null, A: Value = null, field_dir: Value = null, CF: Value = null, L: Value = null;
	let $e: any;
	if (!rt.istype((_T = this.loc), T("/turf"))) {
		return 0;
	}
	let steps: Value = 0;
	if (!NSEW) {
		return 0;
	}
	rt.forRange(f, 0, 0, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		dist = $e;
		if ((_T = rt.getStep(f, _T, NSEW)).density) {
			return 0;
		}
		if (G = rt.locateIn(f, T("/obj/machinery/field/generator"), _T)) {
			steps -= 1;
			if (!G.active) {
				return 0;
			}
			break;
		}
		TC = null;
		for (TC of each(_T.contents)) {
			if (ismob((A = TC))) {
				continue;
			}
			if (A.density) {
				return 0;
			}
		}
		steps++;
	}
	rt.endFor(f, 0);
	if (!G) {
		return 0;
	}
	_T = this.loc;
	dist = null;
	rt.forRange(f, 0, 0, steps, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		dist = $e;
		field_dir = rt.getDir(f, _T, rt.getStep(f, G.loc, NSEW));
		_T = rt.getStep(f, _T, NSEW);
		if (!rt.locateIn(f, T("/obj/machinery/field/containment"), _T)) {
			(CF = (yield* new_(T("/obj/machinery/field/containment")))).set_master(this, G);
			CF.loc = _T;
			yield* CF.setDir(field_dir);
			this.fields += CF;
			G.fields += CF;
			L = null;
			for (L of each(_T, T("/mob/living"))) {
				yield* CF.Crossed(L);
			}
		}
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "connected_gens", G, rt.bitOr));
	(rt.modField(f, G, "connected_gens", this, rt.bitOr));
	yield* this.update_icon();
	return f.dot;
}, true);

// field_generator.dm:305
rt.def("/obj/machinery/field/generator/proc/cleanup", function* cleanup(f: Frame) {
	let F: Value = null, CG: Value = null, FG: Value = null, temp: Value = null, O: Value = null;
	this.clean_up = 1;
	for (F of each(this.fields)) {
		yield* qdel(F);
	}
	for (CG of each(this.connected_gens)) {
		(FG = CG).connected_gens -= this;
		if (!FG.clean_up) {
			yield* FG.cleanup();
		}
		this.connected_gens -= FG;
	}
	this.clean_up = 0;
	yield* this.update_icon();
	rt.spawnTail(f, 1, "/obj/machinery/field/generator/proc/cleanup: spawn at modules/power/singularity/field_generator.dm:320", F, CG, FG, temp, O);
	return f.dot;
}, true);

// a spawn(1) body of /obj/machinery/field/generator/proc/cleanup, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/cleanup: spawn at modules/power/singularity/field_generator.dm:320", function* (f: Frame, F: Value, CG: Value, FG: Value, temp: Value, O: Value) {
	temp = 1;
	O = null;
	for (O of each(GLOB.singularities, T("/obj/singularity"))) {
		if (O.last_warning && temp) {
			if (rt.worldTime(f) - O.last_warning > 50) {
				temp = 0;
				message_admins("A singulo exists and a containment field has failed.", 1);
				this.investigate_log("has <font color='red'>failed</font> whilst a singulo exists.", "singulo");
			}
		}
		O.last_warning = rt.worldTime(f);
	}
	return null;
});

// field_generator.dm:331
rt.def("/obj/machinery/field/generator/proc/shock", function* shock(f: Frame, user: Value) {
	if (!rt.len(f, this.fields)) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// field_generator.dm:335
rt.def("/obj/machinery/field/generator/proc/bump_field", function* bump_field(f: Frame, AM: Value) {
	if (!rt.len(f, this.fields)) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);
