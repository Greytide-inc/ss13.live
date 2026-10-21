// From code/datums/diseases/wizarditis.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(971, "/datum/disease/wizarditis", "/datum/disease", {
	name: "Wizarditis",
	max_stages: 4,
	spread_text: "Airborne",
	cure_text: "The Manly Dorf",
	cures: null,
	cure_chance: 100,
	agent: "Rincewindus Vulgaris",
	disease_flags: 7,
	permeability_mod: 0.75,
	desc: "Some speculate that this virus is the cause of the Space Wizard Federation's existence. Subjects affected show the signs of mental retardation, yelling obscure sentences or total gibberish. On late stages subjects sometime express the feelings of inner power, and, cite, 'the ability to control the forces of cosmos themselves!' A gulp of strong, manly spirits usually reverts them to normal, humanlike, condition.",
	severity: "Harmful",
	viable_mobtypes: null,
	required_organs: null,
});

// /datum/disease/wizarditis/proc/<init>  (code/datums/diseases/wizarditis.dm:6)
rt.def("/datum/disease/wizarditis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("manlydorf"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	$0 = $0;
	rt.setSv(f, "required_organs", rt.list(T("/obj/item/bodypart/head")));
	return f.dot;
});

// /datum/disease/wizarditis/proc/stage_act  (code/datums/diseases/wizarditis.dm:27)  may sleep
rt.def("/datum/disease/wizarditis/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		if ((truthy(rt.op(f, "Prob", [], [1])) && truthy(rt.op(f, "Prob", [], [50])))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "say", [rt.op(f, "PickUnweighted", [4], ["You shall not pass!", "Expeliarmus!", "By Merlins beard!", "Feel the power of the Dark Side!"])]);
		}
		if ((truthy(rt.op(f, "Prob", [], [1])) && truthy(rt.op(f, "Prob", [], [50])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), fmt("<span class='danger'>You feel ＀.</span>", [rt.op(f, "PickUnweighted", [3], ["that you don't have enough mana", "that the winds of magic are gone", "an urge to summon familiar"])])]);
		}
	} else if ($0 === 3) {
		if ((truthy(rt.op(f, "Prob", [], [1])) && truthy(rt.op(f, "Prob", [], [50])))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "say", [rt.op(f, "PickUnweighted", [4], ["NEC CANTIO!", "AULIE OXIN FIERA!", "STI KALY!", "TARCOL MINTI ZHERI!"])]);
		}
		if ((truthy(rt.op(f, "Prob", [], [1])) && truthy(rt.op(f, "Prob", [], [50])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), fmt("<span class='danger'>You feel ＀.</span>", [rt.op(f, "PickUnweighted", [3], ["the magic bubbling in your veins", "that this location gives you a +1 to INT", "an urge to summon familiar"])])]);
		}
	} else if ($0 === 4) {
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "say", [rt.op(f, "PickUnweighted", [4], ["NEC CANTIO!", "AULIE OXIN FIERA!", "STI KALY!", "EI NATH!"])]);
			return live(f.dot);
		}
		if ((truthy(rt.op(f, "Prob", [], [1])) && truthy(rt.op(f, "Prob", [], [50])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), fmt("<span class='danger'>You feel ＀.</span>", [rt.op(f, "PickUnweighted", [3], ["the tidal wave of raw power building inside", "that this location gives you a +2 to INT and +1 to WIS", "an urge to teleport"])])]);
			yield* g.srcCall(f, "spawn_wizard_clothes", 50);
		}
		if ((truthy(rt.op(f, "Prob", [], [1])) && truthy(rt.op(f, "Prob", [], [1])))) {
			yield* g.srcCall(f, "teleport");
		}
	}
	return live(f.dot);
}, true);

// /datum/disease/wizarditis/proc/spawn_wizard_clothes  (code/datums/diseases/wizarditis.dm:58)  may sleep
rt.def("/datum/disease/wizarditis/proc/spawn_wizard_clothes", function* spawn_wizard_clothes(f: Frame, chance: Value) {
	let H: Value = null, S: Value = null;
	f.vars = () => [chance, H, S];
	if (live(chance) === null) {
		chance = 0;
	}
	if (truthy((rt.istype(rt.sv(f, "affected_mob"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = rt.sv(f, "affected_mob");
		if (truthy(rt.op(f, "Prob", [], [live(chance)]))) {
			if (!truthy((rt.istype(rt.fv(f, "head", live(H)), T("/obj/item/clothing/head/wizard")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, live(H), "dropItemToGround", [rt.fv(f, "head", live(H))])))) {
					yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "head", live(H))]);
				}
				yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/wizard"), [live(H)])), 11]);
			}
			return live(f.dot);
		}
		if (truthy(rt.op(f, "Prob", [], [live(chance)]))) {
			if (!truthy((rt.istype(rt.fv(f, "wear_suit", live(H)), T("/obj/item/clothing/suit/wizrobe")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, live(H), "dropItemToGround", [rt.fv(f, "wear_suit", live(H))])))) {
					yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "wear_suit", live(H))]);
				}
				yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/wizrobe"), [live(H)])), 13]);
			}
			return live(f.dot);
		}
		if (truthy(rt.op(f, "Prob", [], [live(chance)]))) {
			if (!truthy((rt.istype(rt.fv(f, "shoes", live(H)), T("/obj/item/clothing/shoes/sandal/magic")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, live(H), "dropItemToGround", [rt.fv(f, "shoes", live(H))])))) {
					yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "shoes", live(H))]);
				}
			}
			yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/sandal/magic"), [live(H)])), 12]);
			return live(f.dot);
		}
	} else {
		H = rt.sv(f, "affected_mob");
		if (!truthy(rt.op(f, "Prob", [], [live(chance)]))) return f.dot;
		S = (yield* g.new_(f, T("/obj/item/weapon/staff"), [live(H)]));
		if (truthy((yield* g.callName(f, live(H), "put_in_hands", [live(S)])))) return f.dot;
		yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
	}
	return f.dot;
}, true);

// /datum/disease/wizarditis/proc/teleport  (code/datums/diseases/wizarditis.dm:87)  may sleep
rt.def("/datum/disease/wizarditis/proc/teleport", function* teleport(f: Frame) {
	let theareas: Value = null, S: Value = null, thearea: Value = null, L: Value = null, _T: Value = null, clear: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [theareas, S, thearea, L, _T, clear, O, $e];
	theareas = (yield* g.call(f, P("/proc/get_areas_in_range"), null, [80, rt.sv(f, "affected_mob")]));
	S = null;
	rt.forList(f, 0, live(theareas), T("/area/space"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		(theareas = rt.modify(live(theareas), live(S), subtract));
	}
	rt.endFor(f, 0);
	if ((!truthy(live(theareas)) || !truthy(rt.len(f, live(theareas))))) {
		return live(f.dot);
	}
	thearea = rt.op(f, "PickUnweighted", [1], [live(theareas)]);
	L = rt.list();
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_area_turfs"), null, [rt.fv(f, "type", live(thearea))])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (!isEqual(rt.fv(f, "z", live(_T)), rt.fv(f, "z", rt.sv(f, "affected_mob")))) {
			continue;
		}
		if (isEqual(rt.fv(f, "name", live(_T)), "space")) {
			continue;
		}
		if (!truthy(rt.fv(f, "density", live(_T)))) {
			clear = 1;
			O = null;
			rt.forList(f, 1, live(_T), T("/obj"));
			while (($e = rt.next(f, 1)) !== undefined) {
				O = $e;
				if (truthy(rt.fv(f, "density", live(O)))) {
					clear = 0;
					break;
				}
			}
			rt.endFor(f, 1);
			if (truthy(live(clear))) {
				L = rt.modify(live(L), live(_T), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(L))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "affected_mob"), "say", [fmt("SCYAR NILA ＀!", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "name", live(thearea))]))])]);
	rt.setFv(f, "loc", rt.sv(f, "affected_mob"), rt.op(f, "PickUnweighted", [1], [live(L)]));
	return live(f.dot);
}, true);
