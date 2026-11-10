// Based on /tg/station's code/game/mecha/combat/phazon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(12114, "/obj/mecha/combat/phazon", "/obj/mecha/combat", {
	step_in: 2,
	dir_in: 2,
	step_energy_drain: 3,
	deflect_chance: 30,
	max_temperature: 25000,
	add_req_access: 1,
	internal_damage_threshold: 25,
	max_equip: 3,
	phase_state: "phazon-phase",
	desc: "This is a Phazon exosuit. The pinnacle of scientific research and pride of Nanotrasen, it uses cutting edge bluespace technology and expensive materials.",
	name: "１Phazon",
	icon_state: "phazon",
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	infra_luminosity: 3,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/phazon"),
	force: 15,
});

// phazon.dm:11
rt.def("/obj/mecha/combat/phazon/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 30, "laser", 30, "energy", 30, "bomb", 30, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
	return f.dot;
}, true);

// phazon.dm:22
rt.def("/obj/mecha/combat/phazon/proc/GrantActions", function* GrantActions(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* this.switch_damtype_action.Grant(f.args[0], this);
	yield* this.phasing_action.Grant(f.args[0], this);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

// phazon.dm:28
rt.def("/obj/mecha/combat/phazon/proc/RemoveActions", function* RemoveActions(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* this.switch_damtype_action.Remove(f.args[0]);
	yield* this.phasing_action.Remove(f.args[0]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });
