// Based on /tg/station's code/modules/events/holiday/halloween.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(326, "/datum/round_event/spooky", "/datum/round_event", {});

// halloween.dm:10
rt.def("/datum/round_event/spooky/proc/start", function* start(f: Frame) {
	let H: Value = null, b: Value = null, Ian: Value = null, Poly: Value = null;
	yield* parent_proc();
	for (H of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
		yield* new_(T("/obj/item/weapon/storage/spooky"), (b = rt.locateIn(f, T("/obj/item/weapon/storage/backpack"), H.contents)));
		if (rt.istype(H, T("/mob/living/carbon/human")) || is_species(H, T("/datum/species/lizard"))) {
			if (prob(50)) {
				yield* H.set_species(T("/datum/species/skeleton"));
			} else {
				yield* H.set_species(T("/datum/species/zombie"));
			}
		}
	}
	for (Ian of each(GLOB.mob_list, T("/mob/living/simple_animal/pet/dog/corgi/Ian"))) {
		yield* Ian.place_on_head((yield* new_(T("/obj/item/weapon/bedsheet"), Ian)));
	}
	for (Poly of each(GLOB.mob_list, T("/mob/living/simple_animal/parrot/Poly"))) {
		yield* new_(T("/mob/living/simple_animal/parrot/Poly/ghost"), Poly.loc);
		yield* qdel(Poly);
	}
	return f.dot;
}, true);

// halloween.dm:27
rt.def("/datum/round_event/spooky/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(pick("RATTLE ME BONES!", "THE RIDE NEVER ENDS!", "A SKELETON POPS OUT!", "SPOOKY SCARY SKELETONS!", "CREWMEMBERS BEWARE, YOU'RE IN FOR A SCARE!"), "THE CALL IS COMING FROM INSIDE THE HOUSE");
	return f.dot;
}, true);

rt.type(295, "/datum/round_event/carp_migration/eyeballs", "/datum/round_event/carp_migration", {});

// halloween.dm:38
rt.def("/datum/round_event/carp_migration/eyeballs/proc/start", function* start(f: Frame) {
	let C: Value = null;
	for (C of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
		if (C.name == "carpspawn") {
			yield* new_(T("/mob/living/simple_animal/hostile/carp/eyeball"), C.loc);
		}
	}
	return f.dot;
}, true);

rt.type(311, "/datum/round_event/meteor_wave/spooky", "/datum/round_event/meteor_wave", {
	endWhen: 40,
});

// halloween.dm:54
rt.def("/datum/round_event/meteor_wave/spooky/proc/tick", function* tick(f: Frame) {
	if (!IsMultiple(this.activeFor, 4)) return f.dot;
	yield* spawn_meteors(3, GLOB.meteorsSPOOKY);
	return f.dot;
}, true);

rt.type(327, "/datum/round_event/creepy_clowns", "/datum/round_event", {
	endWhen: 40,
});

// halloween.dm:69
rt.def("/datum/round_event/creepy_clowns/proc/start", function* start(f: Frame) {
	let H: Value = null, _T: Value = null;
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		if (!H.client || !rt.istype(H, T("/mob/living/carbon/human"))) {
			return f.dot;
		}
		to_chat(H, "<span class='danger'>Honk...</span>");
		rt.op(f, "Output", [], [H, rt.rsc("sound/spookoween/scary_clown_appear.ogg")], false);
		if (_T = rt.getStep(f, H, 0)) {
			yield* new_(T("/obj/effect/hallucination/simple/clown"), _T, H, 50);
		}
	}
	return f.dot;
}, true);

// halloween.dm:79
rt.def("/datum/round_event/creepy_clowns/proc/tick", function* tick(f: Frame) {
	let H: Value = null, _T: Value = null;
	if (!IsMultiple(this.activeFor, 4)) return f.dot;
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		if (prob(66)) {
			playsound(H.loc, pick(rt.rsc("sound/spookoween/scary_horn.ogg"), rt.rsc("sound/spookoween/scary_horn2.ogg"), rt.rsc("sound/spookoween/scary_horn3.ogg")), 100, 1);
		}
		if (prob(33)) {
			if (_T = rt.getStep(f, H, 0)) {
				yield* new_(T("/obj/effect/hallucination/simple/clown"), _T, H, 25);
			}
		} else if (prob(25)) {
			if (_T = rt.getStep(f, H, 0)) {
				yield* new_(T("/obj/effect/hallucination/simple/clown/scary"), _T, H, 25);
			}
		} else if (prob(5)) {
			if (_T = rt.getStep(f, H, 0)) {
				yield* spawn_atom_to_turf(T("/obj/effect/mob_spawn/human/clown/corpse"), H, 1);
			}
		} else if (prob(1)) {
			yield* spawn_atom_to_turf(T("/mob/living/simple_animal/hostile/retaliate/clown"), H, 1);
		}
	}
	return f.dot;
}, true);

// halloween.dm:99
rt.def("/datum/round_event/creepy_clowns/proc/announce", function* announce(f: Frame) {
	yield* priority_announce("Honk... Honk... honk... HONK! HONK! HONKHONKHONKHONKHONK", "HONK!", rt.rsc("sound/spookoween/scary_horn.ogg"));
	return f.dot;
}, true);

rt.type(5603, "/obj/item/weapon/storage/spooky", "/obj/item/weapon/storage", {
	name: "trick-o-treat bag",
	desc: "A pumpkin-shaped bag that holds all sorts of goodies!",
	icon: rt.rsc("icons/obj/halloween_items.dmi"),
	icon_state: "treatbag",
});

// halloween.dm:124
rt.def("/obj/item/weapon/storage/spooky/proc/New", function* New(f: Frame) {
	let distrobuteinbag: Value = null, type: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 0, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		distrobuteinbag = $e;
		type = pick(T("/obj/item/weapon/reagent_containers/food/snacks/sugarcookie/spookyskull"), T("/obj/item/weapon/reagent_containers/food/snacks/sugarcookie/spookycoffin"), T("/obj/item/weapon/reagent_containers/food/snacks/candy_corn"), T("/obj/item/weapon/reagent_containers/food/snacks/candy"), T("/obj/item/weapon/reagent_containers/food/snacks/candiedapple"), T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), T("/obj/item/organ/brain"));
		yield* new_(type, this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
