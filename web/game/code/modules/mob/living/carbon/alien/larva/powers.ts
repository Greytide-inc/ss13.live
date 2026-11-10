// Based on /tg/station's code/modules/mob/living/carbon/alien/larva/powers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11403, "/obj/effect/proc_holder/alien/hide", "/obj/effect/proc_holder/alien", {
	plasma_cost: 0,
	action_icon_state: "alien_hide",
	name: "Hide",
	desc: "Allows aliens to hide beneath tables or certain items. Toggled on or off.",
});

// powers.dm:9
rt.def("/obj/effect/proc_holder/alien/hide/proc/fire", function fire(f: Frame, user: Value) {
	if (user.stat != 0) {
		return f.dot;
	}
	if (user.layer != ABOVE_NORMAL_TURF_LAYER) {
		user.layer = ABOVE_NORMAL_TURF_LAYER;
		user.visible_message(`<span class='name'>${user} scurries to the ground!</span>`, "<span class='noticealien'>You are now hiding.</span>");
	} else {
		user.layer = 4;
		user.visible_message(`${user} slowly peeks up from the ground...`, "<span class='noticealien'>You stop hiding.</span>");
	}
	return 1;
});

rt.type(11404, "/obj/effect/proc_holder/alien/larva_evolve", "/obj/effect/proc_holder/alien", {
	plasma_cost: 0,
	action_icon_state: "alien_evolve_larva",
	name: "Evolve",
	desc: "Evolve into a higher alien caste.",
});

// powers.dm:31
rt.def("/obj/effect/proc_holder/alien/larva_evolve/proc/fire", function* fire(f: Frame, user: Value) {
	let L: Value = null, alien_caste: Value = null, new_xeno: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/alien/larva"))) {
		return f.dot;
	}
	if ((L = user).handcuffed || L.legcuffed) {
		to_chat(user, "<span class='danger'>You cannot evolve when you are cuffed.</span>");
	}
	if (L.amount_grown >= L.max_grown) {
		to_chat(L, "<span class='name'>You are growing into a beautiful alien! It is time to choose a caste.</span>");
		to_chat(L, "<span class='info'>There are three to choose from:");
		to_chat(L, "<span class='name'>Hunters</span> <span class='info'>are the most agile caste, tasked with hunting for hosts. They are faster than a human and can even pounce, but are not much tougher than a drone.</span>");
		to_chat(L, "<span class='name'>Sentinels</span> <span class='info'>are tasked with protecting the hive. With their ranged spit, invisibility, and high health, they make formidable guardians and acceptable secondhand hunters.</span>");
		to_chat(L, "<span class='name'>Drones</span> <span class='info'>are the weakest and slowest of the castes, but can grow into a praetorian and then queen if no queen exists, and are vital to maintaining a hive with their resin secretion abilities.</span>");
		alien_caste = (yield* alert(L, "Please choose which alien caste you shall belong to.", null, "Hunter", "Sentinel", "Drone"));
		if (user.incapacitated()) {
			return f.dot;
		}
		if (alien_caste === "Hunter") {
			new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/hunter"), L.loc));
		} else if (alien_caste === "Sentinel") {
			new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/sentinel"), L.loc));
		} else if (alien_caste === "Drone") {
			new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/drone"), L.loc));
		}
		yield* L.alien_evolve(new_xeno);
		return 0;
	} else {
		to_chat(user, "<span class='danger'>You are not fully grown.</span>");
		return 0;
	}
}, true);
