// From code/modules/mob/living/simple_animal/friendly/cockroach.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5079, "/mob/living/simple_animal/cockroach", "/mob/living/simple_animal", {
	squish_chance: 50,
	icon_dead: "cockroach",
	turns_per_move: 5,
	atmos_requirements: null,
	minbodytemp: 270,
	maxbodytemp: 1e+31,
	pass_flags: 21,
	response_help: "pokes",
	response_disarm: "shoos",
	response_harm: "splats",
	speak_emote: null,
	gold_core_spawnable: 2,
	verb_say: "chitters",
	verb_ask: "chitters inquisitively",
	verb_exclaim: "chitters loudly",
	verb_yell: "chitters loudly",
	del_on_death: 1,
	name: "cockroach",
	desc: "This station is just crawling with bugs.",
	icon_state: "cockroach",
	health: 1,
	maxHealth: 1,
	loot: null,
	mob_size: 0,
	density: 0,
	ventcrawler: 2,
});

// /mob/living/simple_animal/cockroach/proc/<init>  (code/modules/mob/living/simple_animal/friendly/cockroach.dm:10)
rt.def("/mob/living/simple_animal/cockroach/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("chitters"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/decal/cleanable/deadcockroach")));
	return f.dot;
});

// /mob/living/simple_animal/cockroach/proc/death  (code/modules/mob/living/simple_animal/friendly/cockroach.dm:30)  may sleep
rt.def("/mob/living/simple_animal/cockroach/proc/death", function* death(f: Frame) {
	if (truthy(rt.fv(f, "cinematic", rt.gl("SSticker")))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/simple_animal/cockroach/proc/Crossed  (code/modules/mob/living/simple_animal/friendly/cockroach.dm:35)  may sleep
rt.def("/mob/living/simple_animal/cockroach/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let A: Value = null;
	f.vars = () => [AM, A];
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
		if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
			if ((rt.gt(rt.gv(f, "mob_size", (A = live(AM))), 1) && !truthy(rt.bitAnd(rt.fv(f, "movement_type", live(A)), 2)))) {
				if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "squish_chance")]))) {
					yield* g.callName(f, live(A), "visible_message", [fmt("<span class='notice'>＀ squashed ＀.</span>", [live(A), live(f.src)]), fmt("<span class='notice'>You squashed ＀.</span>", [live(f.src)])]);
					yield* g.srcCall(f, "adjustBruteLoss", 1);
				} else {
					yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ avoids getting crushed.</span>", [live(f.src)]));
				}
			}
		}
	} else {
		if (!truthy((rt.istype(live(AM), T("/obj/structure")) ? 1 : 0))) return f.dot;
		if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "squish_chance")]))) {
			yield* g.callName(f, live(AM), "visible_message", [fmt("<span class='notice'>＀ was crushed under ＀.</span>", [live(f.src), live(AM)])]);
			yield* g.srcCall(f, "adjustBruteLoss", 1);
		} else {
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ avoids getting crushed.</span>", [live(f.src)]));
		}
	}
	return f.dot;
}, true);
