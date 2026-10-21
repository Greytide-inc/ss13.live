// From code/modules/mob/living/carbon/human/species_types/podpeople.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4106, "/datum/species/pod", "/datum/species", {
	name: "Podperson",
	id: "pod",
	default_color: "59CE00",
	species_traits: null,
	attack_verb: "slash",
	attack_sound: rt.rsc("sound/weapons/slice.ogg"),
	miss_sound: rt.rsc("sound/weapons/slashmiss.ogg"),
	burnmod: 1.25,
	heatmod: 1.5,
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/plant"),
});

// /datum/species/pod/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/podpeople.dm:15)  may sleep
rt.def("/datum/species/pod/proc/on_species_gain", function* on_species_gain(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modField(f, live(f.args[0]), "faction", "plants", rt.bitOr));
	(rt.modField(f, live(f.args[0]), "faction", "vines", rt.bitOr));
	return f.dot;
}, true, { args: ["C", "old_species"] });

// /datum/species/pod/proc/on_species_loss  (code/modules/mob/living/carbon/human/species_types/podpeople.dm:20)  may sleep
rt.def("/datum/species/pod/proc/on_species_loss", function* on_species_loss(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modField(f, live(f.args[0]), "faction", "plants", subtract));
	(rt.modField(f, live(f.args[0]), "faction", "vines", subtract));
	return f.dot;
}, true, { args: ["C"] });

// /datum/species/pod/proc/spec_life  (code/modules/mob/living/carbon/human/species_types/podpeople.dm:25)  may sleep
rt.def("/datum/species/pod/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	let light_amount: Value = null, _T: Value = null;
	f.vars = () => [H, light_amount, _T];
	if (isEqual(rt.fv(f, "stat", live(H)), 2)) {
		return live(f.dot);
	}
	light_amount = 0;
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(H))])))) {
		_T = rt.fv(f, "loc", live(H));
		light_amount = subtract((yield* g.call(f, P("/proc/min"), null, [1, (yield* g.callName(f, live(_T), "get_lumcount", []))])), 0.5);
		rt.modField(f, live(H), "nutrition", multiply(live(light_amount), 10), add);
		if (rt.gt(rt.fv(f, "nutrition", live(H)), 550)) {
			rt.setFv(f, "nutrition", live(H), 550);
		}
		if (rt.gt(live(light_amount), 0.20000000298023224)) {
			yield* g.callName(f, live(H), "heal_overall_damage", [1, 1]);
			yield* g.callName(f, live(H), "adjustToxLoss", [-1]);
			yield* g.callName(f, live(H), "adjustOxyLoss", [-1]);
		}
	}
	if (!rt.lt(rt.fv(f, "nutrition", live(H)), 200)) return f.dot;
	yield* g.callName(f, live(H), "take_overall_damage", [2, 0]);
	return f.dot;
}, true);

// /datum/species/pod/proc/handle_chemicals  (code/modules/mob/living/carbon/human/species_types/podpeople.dm:43)  may sleep
rt.def("/datum/species/pod/proc/handle_chemicals", function* handle_chemicals(f: Frame, chem: Value, H: Value) {
	f.vars = () => [chem, H];
	if (!isEqual(rt.fv(f, "id", live(chem)), "plantbgone")) return f.dot;
	yield* g.callName(f, live(H), "adjustToxLoss", [3]);
	yield* g.callName(f, rt.fv(f, "reagents", live(H)), "remove_reagent", [rt.fv(f, "id", live(chem)), 0.4000000059604645]);
	return 1;
}, true);

// /datum/species/pod/proc/on_hit  (code/modules/mob/living/carbon/human/species_types/podpeople.dm:49)  may sleep
rt.def("/datum/species/pod/proc/on_hit", function* on_hit(f: Frame, _P: Value, H: Value) {
	let $0: any;
	f.vars = () => [_P, H, $0];
	$0 = rt.fv(f, "type", live(_P));
	if (isEqual($0, T("/obj/item/projectile/energy/floramut"))) {
		if (truthy(rt.op(f, "Prob", [], [15]))) {
			yield* g.callName(f, live(H), "rad_act", [(yield* g.call(f, P("/proc/rand"), null, [30, 80]))]);
			yield* g.callName(f, live(H), "Knockdown", [100]);
			yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀ writhes in pain as ＀ vacuoles boil.</span>", [live(H), (yield* g.callName(f, live(H), "p_their", []))]), "<span class='userdanger'>You writhe in pain as your vacuoles boil!</span>", "<span class='italics'>You hear the crunching of leaves.</span>"]);
			if (truthy(rt.op(f, "Prob", [], [80]))) {
				yield* g.callName(f, live(H), "randmutb", []);
			} else {
				yield* g.callName(f, live(H), "randmutg", []);
			}
			yield* g.callName(f, live(H), "domutcheck", []);
		} else {
			yield* g.callName(f, live(H), "adjustFireLoss", [(yield* g.call(f, P("/proc/rand"), null, [5, 15]))]);
			yield* g.callName(f, live(H), "show_message", ["<span class='userdanger'>The radiation beam singes you!</span>"]);
		}
	} else if (isEqual($0, T("/obj/item/projectile/energy/florayield"))) {
		rt.setFv(f, "nutrition", live(H), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "nutrition", live(H)), 30), 550])));
	}
	return f.dot;
}, true);
