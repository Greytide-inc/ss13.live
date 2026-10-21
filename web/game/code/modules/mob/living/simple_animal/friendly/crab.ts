// From code/modules/mob/living/simple_animal/friendly/crab.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5080, "/mob/living/simple_animal/crab", "/mob/living/simple_animal", {
	inventory_head: null,
	inventory_mask: null,
	icon_living: "crab",
	icon_dead: "crab_dead",
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "stomps",
	stop_automated_movement: 1,
	friendly: "pinches",
	gold_core_spawnable: 2,
	name: "crab",
	desc: "Free crabs!",
	icon_state: "crab",
	butcher_results: null,
	ventcrawler: 2,
});

// /mob/living/simple_animal/crab/proc/<init>  (code/modules/mob/living/simple_animal/friendly/crab.dm:8)
rt.def("/mob/living/simple_animal/crab/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("clicks"));
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list("clicks."));
	$0 = $0;
	rt.setSv(f, "emote_see", rt.list("clacks."));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 1]));
	return f.dot;
});

// /mob/living/simple_animal/crab/proc/Life  (code/modules/mob/living/simple_animal/friendly/crab.dm:25)  may sleep
rt.def("/mob/living/simple_animal/crab/proc/Life", function* Life(f: Frame) {
	let east_vs_west: Value = null;
	f.vars = () => [east_vs_west];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((!truthy(rt.sv(f, "ckey")) && !truthy(rt.sv(f, "stat")))) {
		if (((truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))]))) && !truthy(rt.sv(f, "resting"))) && !truthy(rt.sv(f, "buckled")))) {
			rt.incSrcVar(f, "turns_since_move", 1, true);
			if (rt.ge(rt.sv(f, "turns_since_move"), rt.sv(f, "turns_per_move"))) {
				if (truthy((yield* g.srcCall(f, "Process_Spacemove", (east_vs_west = rt.op(f, "PickUnweighted", [2], [4, 8])))))) {
					yield* g.srcCall(f, "Move", rt.getStep(f, live(f.src), live(east_vs_west)), live(east_vs_west));
					rt.setSv(f, "turns_since_move", 0);
				}
			}
		}
	}
	yield* g.srcCall(f, "regenerate_icons");
	return f.dot;
}, true, { waitfor: false });
