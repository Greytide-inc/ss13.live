// From code/modules/mob/living/carbon/human/species_types/shadowpeople.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4107, "/datum/species/shadow", "/datum/species", {
	name: "???",
	id: "shadow",
	sexes: 0,
	blacklisted: 1,
	species_traits: null,
	dangerous_existence: 1,
	ignored_by: null,
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/shadow"),
	mutanteyes: rt.typePath("/obj/item/organ/eyes/night_vision"),
});

// /datum/species/shadow/proc/<init>  (code/modules/mob/living/carbon/human/species_types/shadowpeople.dm:7)
rt.def("/datum/species/shadow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(10, 12, 9, 14));
	$0 = $0;
	rt.setSv(f, "ignored_by", rt.list(T("/mob/living/simple_animal/hostile/faithless")));
	return f.dot;
});

// /datum/species/shadow/proc/spec_life  (code/modules/mob/living/carbon/human/species_types/shadowpeople.dm:16)  may sleep
rt.def("/datum/species/shadow/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	let light_amount: Value = null, _T: Value = null;
	f.vars = () => [H, light_amount, _T];
	light_amount = 0;
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(H))])))) return f.dot;
	if (rt.gt((light_amount = (yield* g.callName(f, (_T = rt.fv(f, "loc", live(H))), "get_lumcount", []))), 0.20000000298023224)) {
		yield* g.callName(f, live(H), "take_overall_damage", [1, 1]);
	} else {
		if (!rt.lt(live(light_amount), 0.20000000298023224)) return f.dot;
		yield* g.callName(f, live(H), "heal_overall_damage", [1, 1]);
	}
	return f.dot;
}, true);
