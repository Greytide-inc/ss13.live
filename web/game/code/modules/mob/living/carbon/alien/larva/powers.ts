// From code/modules/mob/living/carbon/alien/larva/powers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11403, "/obj/effect/proc_holder/alien/hide", "/obj/effect/proc_holder/alien", {
	plasma_cost: 0,
	action_icon_state: "alien_hide",
	name: "Hide",
	desc: "Allows aliens to hide beneath tables or certain items. Toggled on or off.",
});

// /obj/effect/proc_holder/alien/hide/proc/fire  (code/modules/mob/living/carbon/alien/larva/powers.dm:9)
rt.def("/obj/effect/proc_holder/alien/hide/proc/fire", function fire(f: Frame, user: Value) {
	if (!isEqual(rt.fv(f, "stat", live(user)), 0)) {
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "layer", live(user)), 2.0799999237060547)) {
		rt.setFv(f, "layer", live(user), 2.0799999237060547);
		rt.callName(f, live(user), "visible_message", [fmt("<span class='name'>＀ scurries to the ground!</span>", [live(user)]), "<span class='noticealien'>You are now hiding.</span>"]);
	} else {
		rt.setFv(f, "layer", live(user), 4);
		rt.callName(f, live(user), "visible_message", [fmt("＀ slowly peeks up from the ground...", [live(user)]), "<span class='noticealien'>You stop hiding.</span>"]);
	}
	return 1;
});

rt.type(11404, "/obj/effect/proc_holder/alien/larva_evolve", "/obj/effect/proc_holder/alien", {
	plasma_cost: 0,
	action_icon_state: "alien_evolve_larva",
	name: "Evolve",
	desc: "Evolve into a higher alien caste.",
});

// /obj/effect/proc_holder/alien/larva_evolve/proc/fire  (code/modules/mob/living/carbon/alien/larva/powers.dm:31)  may sleep
rt.def("/obj/effect/proc_holder/alien/larva_evolve/proc/fire", function* fire(f: Frame, user: Value) {
	let L: Value = null, alien_caste: Value = null, new_xeno: Value = null;
	let $0: any;
	f.vars = () => [user, L, alien_caste, new_xeno, $0];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/alien/larva")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((truthy(rt.gv(f, "handcuffed", (L = live(user)))) || truthy(rt.fv(f, "legcuffed", live(L))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You cannot evolve when you are cuffed.</span>"]);
	}
	if (rt.ge(rt.fv(f, "amount_grown", live(L)), rt.fv(f, "max_grown", live(L)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='name'>You are growing into a beautiful alien! It is time to choose a caste.</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='info'>There are three to choose from:"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='name'>Hunters</span> <span class='info'>are the most agile caste, tasked with hunting for hosts. They are faster than a human and can even pounce, but are not much tougher than a drone.</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='name'>Sentinels</span> <span class='info'>are tasked with protecting the hive. With their ranged spit, invisibility, and high health, they make formidable guardians and acceptable secondhand hunters.</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='name'>Drones</span> <span class='info'>are the weakest and slowest of the castes, but can grow into a praetorian and then queen if no queen exists, and are vital to maintaining a hive with their resin secretion abilities.</span>"]);
		alien_caste = (yield* g.call(f, P("/proc/alert"), null, [live(L), "Please choose which alien caste you shall belong to.", null, "Hunter", "Sentinel", "Drone"]));
		if (truthy((yield* g.callName(f, live(user), "incapacitated", [])))) {
			return live(f.dot);
		}
		new_xeno = null;
		$0 = live(alien_caste);
		if ($0 === "Hunter") {
			new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/hunter"), [rt.fv(f, "loc", live(L))]));
		} else if ($0 === "Sentinel") {
			new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/sentinel"), [rt.fv(f, "loc", live(L))]));
		} else if ($0 === "Drone") {
			new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/drone"), [rt.fv(f, "loc", live(L))]));
		}
		yield* g.callName(f, live(L), "alien_evolve", [live(new_xeno)]);
		return 0;
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You are not fully grown.</span>"]);
		return 0;
	}
	return f.dot;
}, true);
