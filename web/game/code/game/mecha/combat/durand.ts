// Based on /tg/station's code/game/mecha/combat/durand.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(12104, "/obj/mecha/combat/durand", "/obj/mecha/combat", {
	step_in: 4,
	dir_in: 1,
	deflect_chance: 20,
	max_temperature: 30000,
	desc: "An aging combat exosuit utilized by the Nanotrasen corporation. Originally developed to combat hostile alien lifeforms.",
	name: "１Durand",
	icon_state: "durand",
	obj_integrity: 400,
	max_integrity: 400,
	armor: null,
	infra_luminosity: 8,
	force: 40,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/durand"),
});

// durand.dm:10
rt.def("/obj/mecha/combat/durand/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 35, "laser", 15, "energy", 10, "bomb", 20, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
	return f.dot;
}, true);

// durand.dm:17
rt.def("/obj/mecha/combat/durand/proc/GrantActions", function* GrantActions(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* this.defense_action.Grant(f.args[0], this);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

// durand.dm:21
rt.def("/obj/mecha/combat/durand/proc/RemoveActions", function* RemoveActions(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* this.defense_action.Remove(f.args[0]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });
