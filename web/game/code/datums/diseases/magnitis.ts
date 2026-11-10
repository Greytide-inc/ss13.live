// Based on /tg/station's code/datums/diseases/magnitis.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(957, "/datum/disease/magnitis", "/datum/disease", {
	name: "Magnitis",
	max_stages: 4,
	spread_text: "Airborne",
	cure_text: "Iron",
	cures: null,
	agent: "Fukkos Miracos",
	disease_flags: 7,
	permeability_mod: 0.75,
	desc: "This disease disrupts the magnetic field of your body, making it act as if a powerful magnet. Injections of iron help stabilize the field.",
	severity: "Medium",
	viable_mobtypes: null,
});

// magnitis.dm:6
rt.def("/datum/disease/magnitis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("iron");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// magnitis.dm:15
rt.def("/datum/disease/magnitis/proc/stage_act", function* stage_act(f: Frame) {
	let M: Value = null, S: Value = null, i: Value = null, iter: Value = null;
	let $e: any;
	yield* parent_proc();
	if (this.stage === 2) {
		if (prob(2)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel a slight shock course through your body.</span>");
		}
		if (prob(2)) {
			for (M of each(orange(2, this.affected_mob), T("/obj"))) {
				if (!M.anchored && rt.bitAnd(M.flags, CONDUCT)) {
					yield* step_towards(M, this.affected_mob);
				}
			}
			for (S of each(orange(2, this.affected_mob), T("/mob/living/silicon"))) {
				if (rt.istype(S, T("/mob/living/silicon/ai"))) {
					continue;
				}
				yield* step_towards(S, this.affected_mob);
			}
		}
	} else if (this.stage === 3) {
		if (prob(2)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel a strong shock course through your body.</span>");
		}
		if (prob(2)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel like clowning around.</span>");
		}
		if (prob(4)) {
			M = null;
			for (M of each(orange(4, this.affected_mob), T("/obj"))) {
				if (!M.anchored && rt.bitAnd(M.flags, CONDUCT)) {
					i = null;
					iter = rand(1, 2);
					i = 0;
					while (i < iter) {
						yield* step_towards(M, this.affected_mob);
						i++;
					}
				}
			}
			S = null;
			for (S of each(orange(4, this.affected_mob), T("/mob/living/silicon"))) {
				if (rt.istype(S, T("/mob/living/silicon/ai"))) {
					continue;
				}
				i = null;
				iter = rand(1, 2);
				i = 0;
				while (i < iter) {
					yield* step_towards(S, this.affected_mob);
					i++;
				}
			}
		}
	} else if (this.stage === 4) {
		if (prob(2)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel a powerful shock course through your body.</span>");
		}
		if (prob(2)) {
			to_chat(this.affected_mob, "<span class='danger'>You query upon the nature of miracles.</span>");
		}
		if (prob(8)) {
			M = null;
			for (M of each(orange(6, this.affected_mob), T("/obj"))) {
				if (!M.anchored && rt.bitAnd(M.flags, CONDUCT)) {
					i = null;
					iter = rand(1, 3);
					i = 0;
					while (i < iter) {
						yield* step_towards(M, this.affected_mob);
						i++;
					}
				}
			}
			S = null;
			for (S of each(orange(6, this.affected_mob), T("/mob/living/silicon"))) {
				if (rt.istype(S, T("/mob/living/silicon/ai"))) {
					continue;
				}
				i = null;
				iter = rand(1, 3);
				i = 0;
				while (i < iter) {
					yield* step_towards(S, this.affected_mob);
					i++;
				}
			}
		}
	}
	return f.dot;
}, true);
