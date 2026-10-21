// From code/modules/events/holiday/halloween.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(326, "/datum/round_event/spooky", "/datum/round_event", {});

// /datum/round_event/spooky/proc/start  (code/modules/events/holiday/halloween.dm:10)  may sleep
rt.def("/datum/round_event/spooky/proc/start", function* start(f: Frame) {
	let H: Value = null, b: Value = null, Ian: Value = null, Poly: Value = null;
	let $e: any;
	f.vars = () => [H, b, Ian, Poly, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	H = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.new_(f, T("/obj/item/weapon/storage/spooky"), [(b = rt.locateIn(f, T("/obj/item/weapon/storage/backpack"), rt.fv(f, "contents", live(H))))]);
		if ((truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/is_species"), null, [live(H), T("/datum/species/lizard")]))))) {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.callName(f, live(H), "set_species", [T("/datum/species/skeleton")]);
			} else {
				yield* g.callName(f, live(H), "set_species", [T("/datum/species/zombie")]);
			}
		}
	}
	rt.endFor(f, 0);
	Ian = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/simple_animal/pet/dog/corgi/Ian"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Ian = $e;
		yield* g.callName(f, live(Ian), "place_on_head", [(yield* g.new_(f, T("/obj/item/weapon/bedsheet"), [live(Ian)]))]);
	}
	rt.endFor(f, 0);
	Poly = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/simple_animal/parrot/Poly"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Poly = $e;
		yield* g.new_(f, T("/mob/living/simple_animal/parrot/Poly/ghost"), [rt.fv(f, "loc", live(Poly))]);
		yield* g.call(f, P("/proc/qdel"), null, [live(Poly)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/round_event/spooky/proc/announce  (code/modules/events/holiday/halloween.dm:27)  may sleep
rt.def("/datum/round_event/spooky/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, [rt.op(f, "PickUnweighted", [5], ["RATTLE ME BONES!", "THE RIDE NEVER ENDS!", "A SKELETON POPS OUT!", "SPOOKY SCARY SKELETONS!", "CREWMEMBERS BEWARE, YOU'RE IN FOR A SCARE!"]), "THE CALL IS COMING FROM INSIDE THE HOUSE"]);
	return f.dot;
}, true);

rt.type(295, "/datum/round_event/carp_migration/eyeballs", "/datum/round_event/carp_migration", {});

// /datum/round_event/carp_migration/eyeballs/proc/start  (code/modules/events/holiday/halloween.dm:38)  may sleep
rt.def("/datum/round_event/carp_migration/eyeballs/proc/start", function* start(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	C = null;
	rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(rt.fv(f, "name", live(C)), "carpspawn")) {
			yield* g.new_(f, T("/mob/living/simple_animal/hostile/carp/eyeball"), [rt.fv(f, "loc", live(C))]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(311, "/datum/round_event/meteor_wave/spooky", "/datum/round_event/meteor_wave", {
	endWhen: 40,
});

// /datum/round_event/meteor_wave/spooky/proc/tick  (code/modules/events/holiday/halloween.dm:54)  may sleep
rt.def("/datum/round_event/meteor_wave/spooky/proc/tick", function* tick(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/IsMultiple"), null, [rt.sv(f, "activeFor"), 4])))) return f.dot;
	yield* g.call(f, P("/proc/spawn_meteors"), null, [3, rt.gl("meteorsSPOOKY")]);
	return f.dot;
}, true);

rt.type(327, "/datum/round_event/creepy_clowns", "/datum/round_event", {
	endWhen: 40,
});

// /datum/round_event/creepy_clowns/proc/start  (code/modules/events/holiday/halloween.dm:69)  may sleep
rt.def("/datum/round_event/creepy_clowns/proc/start", function* start(f: Frame) {
	let H: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [H, _T, $e];
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if ((!truthy(rt.fv(f, "client", live(H))) || !truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0)))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>Honk...</span>"]);
		rt.op(f, "Output", [], [live(H), rt.rsc("sound/spookoween/scary_clown_appear.ogg")], false);
		if (truthy((_T = rt.getStep(f, live(H), 0)))) {
			yield* g.new_(f, T("/obj/effect/hallucination/simple/clown"), [live(_T), live(H), 50]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/round_event/creepy_clowns/proc/tick  (code/modules/events/holiday/halloween.dm:79)  may sleep
rt.def("/datum/round_event/creepy_clowns/proc/tick", function* tick(f: Frame) {
	let H: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [H, _T, $e];
	if (!truthy((yield* g.call(f, P("/proc/IsMultiple"), null, [rt.sv(f, "activeFor"), 4])))) return f.dot;
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (truthy(rt.op(f, "Prob", [], [66]))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(H)), rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/spookoween/scary_horn.ogg"), rt.rsc("sound/spookoween/scary_horn2.ogg"), rt.rsc("sound/spookoween/scary_horn3.ogg")]), 100, 1]);
		}
		if (truthy(rt.op(f, "Prob", [], [33]))) {
			if (truthy((_T = rt.getStep(f, live(H), 0)))) {
				yield* g.new_(f, T("/obj/effect/hallucination/simple/clown"), [live(_T), live(H), 25]);
			}
		} else {
			if (truthy(rt.op(f, "Prob", [], [25]))) {
				if (truthy((_T = rt.getStep(f, live(H), 0)))) {
					yield* g.new_(f, T("/obj/effect/hallucination/simple/clown/scary"), [live(_T), live(H), 25]);
				}
			} else {
				if (truthy(rt.op(f, "Prob", [], [5]))) {
					if (truthy((_T = rt.getStep(f, live(H), 0)))) {
						yield* g.call(f, P("/proc/spawn_atom_to_turf"), null, [T("/obj/effect/mob_spawn/human/clown/corpse"), live(H), 1]);
					}
				} else {
					if (truthy(rt.op(f, "Prob", [], [1]))) {
						yield* g.call(f, P("/proc/spawn_atom_to_turf"), null, [T("/mob/living/simple_animal/hostile/retaliate/clown"), live(H), 1]);
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/round_event/creepy_clowns/proc/announce  (code/modules/events/holiday/halloween.dm:99)  may sleep
rt.def("/datum/round_event/creepy_clowns/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, ["Honk... Honk... honk... HONK! HONK! HONKHONKHONKHONKHONK", "HONK!", rt.rsc("sound/spookoween/scary_horn.ogg")]);
	return f.dot;
}, true);

rt.type(5603, "/obj/item/weapon/storage/spooky", "/obj/item/weapon/storage", {
	name: "trick-o-treat bag",
	desc: "A pumpkin-shaped bag that holds all sorts of goodies!",
	icon: rt.rsc("icons/obj/halloween_items.dmi"),
	icon_state: "treatbag",
});

// /obj/item/weapon/storage/spooky/proc/New  (code/modules/events/holiday/halloween.dm:124)  may sleep
rt.def("/obj/item/weapon/storage/spooky/proc/New", function* New(f: Frame) {
	let distrobuteinbag: Value = null, type: Value = null;
	let $e: any;
	f.vars = () => [distrobuteinbag, type, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	distrobuteinbag = null;
	rt.forRange(f, 0, 0, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		distrobuteinbag = $e;
		type = rt.op(f, "PickUnweighted", [7], [T("/obj/item/weapon/reagent_containers/food/snacks/sugarcookie/spookyskull"), T("/obj/item/weapon/reagent_containers/food/snacks/sugarcookie/spookycoffin"), T("/obj/item/weapon/reagent_containers/food/snacks/candy_corn"), T("/obj/item/weapon/reagent_containers/food/snacks/candy"), T("/obj/item/weapon/reagent_containers/food/snacks/candiedapple"), T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), T("/obj/item/organ/brain")]);
		yield* g.new_(f, live(type), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
