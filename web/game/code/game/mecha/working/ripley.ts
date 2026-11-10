// Based on /tg/station's code/game/mecha/working/ripley.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, subtract, fmt } = rt;


rt.type(12120, "/obj/mecha/working/ripley", "/obj/mecha/working", {
	hi_pres_step_in: 4,
	lo_pres_step_in: 2,
	cargo_capacity: 15,
	hides: 0,
	cargo: null,
	step_in: 4,
	max_temperature: 20000,
	lights_power: 7,
	deflect_chance: 15,
	max_equip: 6,
	desc: "Autonomous Power Loader Unit. This newer model is refitted with powerful armour against the dangers of the EVA mining process.",
	name: "１APLU \"Ripley\"",
	icon_state: "ripley",
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/ripley"),
});

// ripley.dm:13
rt.def("/obj/mecha/working/ripley/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 20, "laser", 10, "energy", 20, "bomb", 40, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);

	this.cargo = (yield* new_(T("/list")));
	return f.dot;
}, true);

// ripley.dm:21
rt.def("/obj/mecha/working/ripley/proc/Move", function* Move(f: Frame) {
	f.dot = (yield* parent_proc());
	if (f.dot) {
		yield* this.collect_ore();
	}
	this.update_pressure();
	return f.dot;
}, true);

// ripley.dm:27
rt.def("/obj/mecha/working/ripley/proc/collect_ore", function* collect_ore(f: Frame) {
	let ore_box: Value = null, ore: Value = null;
	if (!rt.locateIn(f, T("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp"), this.equipment)) return f.dot;
	if (!(ore_box = rt.locateIn(f, T("/obj/structure/ore_box"), this.cargo))) return f.dot;
	for (ore of each(range(1, this), T("/obj/item/weapon/ore"))) {
		if (ore.Adjacent(this) && (rt.bitAnd(rt.getDir(f, this, ore), this.dir) || ore.loc == this.loc)) {
			yield* ore.forceMove(ore_box);
		}
	}
	return f.dot;
}, true);

// ripley.dm:35
rt.def("/obj/mecha/working/ripley/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	let i: Value = 1;
	while (i <= this.hides) {
		yield* new_(T("/obj/item/stack/sheet/animalhide/goliath_hide"), this.loc);
		i++;
	}
	for (A of each(this.cargo, T("/atom/movable"))) {
		yield* A.forceMove(this.loc);
		yield* step_rand(A);
	}
	this.cargo.Cut();
	return (yield* parent_proc());
}, true);

// ripley.dm:44
rt.def("/obj/mecha/working/ripley/proc/go_out", function* go_out(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// ripley.dm:48
rt.def("/obj/mecha/working/ripley/proc/moved_inside", function* moved_inside(f: Frame, H: Value) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// ripley.dm:52
rt.def("/obj/mecha/working/ripley/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (!this.hides) return f.dot;
	this.cut_overlays();
	if (this.hides < 3) {
		this.add_overlay(this.occupant ? "ripley-g" : "ripley-g-open");
	} else {
		this.add_overlay(this.occupant ? "ripley-g-full" : "ripley-g-full-open");
	}
	return f.dot;
});

rt.type(12121, "/obj/mecha/working/ripley/firefighter", "/obj/mecha/working/ripley", {
	max_temperature: 65000,
	lights_power: 7,
	max_equip: 5,
	desc: "Autonomous Power Loader Unit. This model is refitted with additional thermal protection.",
	name: "１APLU \"Firefighter\"",
	icon_state: "firefighter",
	obj_integrity: 250,
	max_integrity: 250,
	resistance_flags: 35,
	armor: null,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/ripley/firefighter"),
});

// ripley.dm:70
rt.def("/obj/mecha/working/ripley/firefighter/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 30, "laser", 30, "energy", 30, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
	return f.dot;
}, true);

rt.type(12122, "/obj/mecha/working/ripley/deathripley", "/obj/mecha/working/ripley", {
	hi_pres_step_in: 3,
	lights_power: 7,
	step_energy_drain: 0,
	desc: "OH SHIT IT'S THE DEATHSQUAD WE'RE ALL GONNA DIE",
	name: "１DEATH-RIPLEY",
	icon_state: "deathripley",
	opacity: 0,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/ripley/deathripley"),
});

// ripley.dm:86
rt.def("/obj/mecha/working/ripley/deathripley/proc/New", function* New(f: Frame) {
	let ME: Value = null;
	yield* parent_proc();
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/kill")))).attach(this);
	return f.dot;
}, true);

rt.type(12123, "/obj/mecha/working/ripley/mining", "/obj/mecha/working/ripley", {
	desc: "An old, dusty mining Ripley.",
	name: "１APLU \"Miner\"",
	obj_integrity: 75,
});

// ripley.dm:97
rt.def("/obj/mecha/working/ripley/mining/proc/Initialize", function* Initialize(f: Frame) {
	let D: Value = null, M: Value = null, HC: Value = null, B: Value = null, scanner: Value = null;
	f.dot = (yield* parent_proc());
	if (this.cell) {
		this.cell.charge = Floor(this.cell.charge * 0.25);
	}
	if (prob(70)) {
		if (prob(15)) {
			yield* (D = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/drill/diamonddrill")))).attach(this);
		} else {
			yield* (D = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/drill")))).attach(this);
		}
	} else {
		yield* (M = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment")))).attach(this);
	}
	this.cargo.Add((yield* new_(T("/obj/structure/ore_box"), this)));
	yield* (HC = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp")))).attach(this);
	for (B of each(this.trackers, T("/obj/item/mecha_parts/mecha_tracking"))) {
		yield* qdel(B);
	}
	yield* (scanner = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/mining_scanner")))).attach(this);
	return f.dot;
}, true);

// ripley.dm:125
rt.def("/obj/mecha/working/ripley/proc/Exit", function Exit(f: Frame, O: Value) {
	if (rt.isIn(f, O, this.cargo)) {
		return 0;
	}
	return parent_proc();
}, false);

// ripley.dm:130
rt.def("/obj/mecha/working/ripley/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let O: Value = null;
	yield* parent_proc();
	if (rt.at(href_list, "drop_from_cargo")) {
		if (rt.isIn(f, ((O = rt.locateIn(f, rt.at(href_list, "drop_from_cargo"), rt.world())) && O), this.cargo)) {
			this.occupant_message(`<span class='notice'>You unload ${O}.</span>`);
			yield* O.forceMove(this.loc);
			(rt.modField(f, this, "cargo", O, subtract));
			this.log_message(`Unloaded ${O}. Cargo compartment capacity: ${this.cargo_capacity - rt.len(f, this.cargo)}`);
		}
	}
	return f.dot;
}, true);

// ripley.dm:142
rt.def("/obj/mecha/working/ripley/proc/contents_explosion", function* contents_explosion(f: Frame, severity: Value, target: Value) {
	let X: Value = null, O: Value = null;
	for (X of each(this.cargo)) {
		O = X;
		if (prob(30 / severity)) {
			this.cargo -= O;
			yield* O.forceMove(this.loc);
		}
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// ripley.dm:150
rt.def("/obj/mecha/working/ripley/proc/get_stats_part", function get_stats_part(f: Frame) {
	let O: Value = null;
	let output: Value = parent_proc();
	output += "<b>Cargo Compartment Contents:</b><div style=\"margin-left: 15px;\">";
	if (rt.len(f, this.cargo)) {
		for (O of each(this.cargo, T("/obj"))) {
			output += fmt("<a href='?src=＃;drop_from_cargo=＃'>Unload</a> : ＀<br>", [this, O, O]);
		}
	} else {
		output += "Nothing";
	}
	return (output += "</div>");
});

// ripley.dm:161
rt.def("/obj/mecha/working/ripley/proc/update_pressure", function update_pressure(f: Frame) {
	let pressure: Value = null, drill: Value = null;
	let _T: Value = rt.getStep(f, this.loc, 0);
	let environment: Value = _T.return_air();
	if ((pressure = environment.return_pressure()) < 40) {
		this.step_in = this.lo_pres_step_in;
		for (drill of each(this.equipment, T("/obj/item/mecha_parts/mecha_equipment/drill"))) {
			drill.equip_cooldown = rt.initial(f, drill, "equip_cooldown") / 2;
		}
	} else {
		this.step_in = this.hi_pres_step_in;
		drill = null;
		for (drill of each(this.equipment, T("/obj/item/mecha_parts/mecha_equipment/drill"))) {
			drill.equip_cooldown = rt.initial(f, drill, "equip_cooldown");
		}
	}
	return f.dot;
});

// ripley.dm:175
rt.def("/obj/mecha/working/ripley/proc/relay_container_resist", function* relay_container_resist(f: Frame, user: Value, O: Value) {
	to_chat(user, `<span class='notice'>You lean on the back of ${O} and start pushing so it falls out of ${this}.</span>`);
	if (yield* do_after(user, 300, { target: O })) {
		if (!user || user.stat != 0 || user.loc != this || O.loc != this) {
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You successfully pushed ${O} out of ${this}!</span>`);
		O.loc = this.loc;
		this.cargo -= O;
	} else {
		if (user.loc != this) return f.dot;
		to_chat(user, `<span class='warning'>You fail to push ${O} out of ${this}!</span>`);
	}
	return f.dot;
}, true);
