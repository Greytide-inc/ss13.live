// From code/modules/reagents/chemistry/reagents/blob_reagents.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3522, "/datum/reagent/blob", "/datum/reagent", {
	complementary_color: "#000000",
	shortdesc: null,
	effectdesc: null,
	analyzerdescdamage: "Unknown. Report this bug to a coder, or just adminhelp.",
	analyzerdesceffect: "N/A",
	blobbernaut_message: "slams",
	message: "The blob strikes you",
	message_living: null,
	name: "Unknown",
	description: "shouldn't exist and you should adminhelp immediately.",
	color: "#FFFFFF",
	taste_description: "slime and errors",
	can_synth: 0,
});

// /datum/reagent/blob/proc/send_message  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:18)
rt.def("/datum/reagent/blob/proc/send_message", function send_message(f: Frame, M: Value) {
	let totalmessage: Value = null;
	f.vars = () => [totalmessage];
	totalmessage = rt.sv(f, "message");
	if ((truthy(rt.sv(f, "message_living")) && !truthy((rt.istype(live(M), T("/mob/living/silicon")) ? 1 : 0)))) {
		totalmessage = rt.modify(live(totalmessage), rt.sv(f, "message_living"), add);
	}
	totalmessage = rt.modify(live(totalmessage), "!", add);
	rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>＀</span>", [live(totalmessage)])]);
	return f.dot;
});

// /datum/reagent/blob/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:25)
rt.def("/datum/reagent/blob/proc/reaction_mob", function reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value, show_message: Value, touch_protection: Value, O: Value) {
	f.vars = () => [method];
	if (live(method) === null) {
		method = 1;
	}
	if ((isEqual(rt.fv(f, "stat", live(M)), 2) || truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile/blob")) ? 1 : 0)))) {
		return 0;
	}
	return rt.call(f, P("/proc/round"), null, [multiply(live(reac_volume), rt.call(f, P("/proc/min"), null, [subtract(1.5, live(touch_protection)), 1])), 0.10000000149011612]);
});

rt.type(3523, "/datum/reagent/blob/replicating_foam", "/datum/reagent/blob", {
	name: "Replicating Foam",
	id: "replicating_foam",
	description: "will do medium brute damage and occasionally expand again when expanding.",
	shortdesc: "will do medium brute damage.",
	effectdesc: "will also expand when attacked with burn damage, but takes more brute damage.",
	analyzerdescdamage: "Does medium brute damage.",
	analyzerdesceffect: "Expands when attacked with burn damage, will occasionally expand again when expanding, and is fragile to brute damage.",
	color: "#7B5A57",
	complementary_color: "#57787B",
});

// /datum/reagent/blob/replicating_foam/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:60)  may sleep
rt.def("/datum/reagent/blob/replicating_foam/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.args[2] = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.699999988079071, live(f.args[2])), "brute"]);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// /datum/reagent/blob/replicating_foam/proc/damage_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:64)  may sleep
rt.def("/datum/reagent/blob/replicating_foam/proc/damage_reaction", function* damage_reaction(f: Frame) {
	let newB: Value = null;
	f.vars = () => [newB];
	if (isEqual(live(f.args[2]), "brute")) {
		f.args[1] = multiply(live(f.args[1]), 2);
	} else {
		if ((((isEqual(live(f.args[2]), "fire") && rt.gt(live(f.args[1]), 0)) && rt.gt(subtract(rt.fv(f, "obj_integrity", live(f.args[0])), live(f.args[1])), 0)) && truthy(rt.op(f, "Prob", [], [60])))) {
			if (truthy((newB = (yield* g.callName(f, live(f.args[0]), "expand", [null, null, 0]))))) {
				rt.setFv(f, "obj_integrity", live(newB), subtract(rt.fv(f, "obj_integrity", live(f.args[0])), live(f.args[1])));
				yield* g.callName(f, live(newB), "update_icon", []);
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["B", "damage", "damage_type", "damage_flag"] });

// /datum/reagent/blob/replicating_foam/proc/expand_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:74)  may sleep
rt.def("/datum/reagent/blob/replicating_foam/proc/expand_reaction", function* expand_reaction(f: Frame, B: Value, newB: Value, _T: Value, O: Value) {
	f.vars = () => [B, newB, _T, O];
	if (!truthy(rt.op(f, "Prob", [], [30]))) return f.dot;
	yield* g.callName(f, live(newB), "expand", [null, null, 0]);
	return f.dot;
}, true);

rt.type(3524, "/datum/reagent/blob/networked_fibers", "/datum/reagent/blob", {
	name: "Networked Fibers",
	id: "networked_fibers",
	description: "will do high brute and burn damage but non-manual expansion will only generate resources.",
	shortdesc: "will do high brute and burn damage.",
	effectdesc: "will move your core when manually expanding near it.",
	analyzerdescdamage: "Does high brute and burn damage.",
	analyzerdesceffect: "Is highly mobile and generates resources rapidly.",
	color: "#CDC0B0",
	complementary_color: "#FFF68F",
});

// /datum/reagent/blob/networked_fibers/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:90)  may sleep
rt.def("/datum/reagent/blob/networked_fibers/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.args[2] = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.6000000238418579, live(f.args[2])), "brute"]);
	if (!truthy(live(f.args[0]))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.6000000238418579, live(f.args[2])), "fire"]);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// /datum/reagent/blob/networked_fibers/proc/expand_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:96)  may sleep
rt.def("/datum/reagent/blob/networked_fibers/proc/expand_reaction", function* expand_reaction(f: Frame, B: Value, newB: Value, _T: Value, O: Value) {
	let A: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [B, newB, _T, O, A, C, $e];
	if ((!truthy(live(O)) && truthy(rt.fv(f, "overmind", live(newB))))) {
		if (!truthy((rt.istype(live(B), T("/obj/structure/blob/node")) ? 1 : 0))) {
			yield* g.callName(f, rt.fv(f, "overmind", live(newB)), "add_points", [1]);
			yield* g.call(f, P("/proc/qdel"), null, [live(newB)]);
		}
	} else {
		A = (yield* g.call(f, P("/proc/get_area"), null, [live(_T)]));
		if (!(!truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)) && !truthy((rt.istype(live(A), T("/area/shuttle")) ? 1 : 0)))) return f.dot;
		C = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(newB)])), T("/obj/structure/blob/core"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (isEqual(rt.fv(f, "overmind", live(C)), live(O))) {
				yield* g.callName(f, live(newB), "forceMove", [rt.getStep(f, live(C), 0)]);
				yield* g.callName(f, live(C), "forceMove", [live(_T)]);
				yield* g.callName(f, live(C), "setDir", [rt.getDir(f, live(newB), live(C))]);
				yield* g.callName(f, live(O), "add_points", [1]);
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

rt.type(3525, "/datum/reagent/blob/shifting_fragments", "/datum/reagent/blob", {
	name: "Shifting Fragments",
	id: "shifting_fragments",
	description: "will do medium brute damage.",
	effectdesc: "will also cause blob parts to shift away when attacked.",
	analyzerdescdamage: "Does medium brute damage.",
	analyzerdesceffect: "When attacked, may shift away from the attacker.",
	color: "#C8963C",
	complementary_color: "#3C6EC8",
});

// /datum/reagent/blob/shifting_fragments/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:122)  may sleep
rt.def("/datum/reagent/blob/shifting_fragments/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.args[2] = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.699999988079071, live(f.args[2])), "brute"]);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// /datum/reagent/blob/shifting_fragments/proc/expand_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:126)  may sleep
rt.def("/datum/reagent/blob/shifting_fragments/proc/expand_reaction", function* expand_reaction(f: Frame, B: Value, newB: Value, _T: Value, O: Value) {
	f.vars = () => [B, newB, _T, O];
	if (!(truthy((rt.istype(live(B), T("/obj/structure/blob/normal")) ? 1 : 0)) || (truthy((rt.istype(live(B), T("/obj/structure/blob/shield")) ? 1 : 0)) && truthy(rt.op(f, "Prob", [], [25]))))) return f.dot;
	yield* g.callName(f, live(newB), "forceMove", [rt.getStep(f, live(B), 0)]);
	yield* g.callName(f, live(B), "forceMove", [live(_T)]);
	return f.dot;
}, true);

// /datum/reagent/blob/shifting_fragments/proc/damage_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:131)  may sleep
rt.def("/datum/reagent/blob/shifting_fragments/proc/damage_reaction", function* damage_reaction(f: Frame) {
	let blobstopick: Value = null, OB: Value = null, targeted: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [blobstopick, OB, targeted, _T, $e];
	if ((((((isEqual(live(f.args[3]), "melee") || isEqual(live(f.args[3]), "bullet")) || isEqual(live(f.args[3]), "laser")) && rt.gt(live(f.args[1]), 0)) && rt.gt(subtract(rt.fv(f, "obj_integrity", live(f.args[0])), live(f.args[1])), 0)) && truthy(rt.op(f, "Prob", [], [subtract(60, live(f.args[1]))])))) {
		blobstopick = rt.list();
		OB = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, live(f.args[0])])), T("/obj/structure/blob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			OB = $e;
			if ((((truthy((rt.istype(live(OB), T("/obj/structure/blob/normal")) ? 1 : 0)) || (truthy((rt.istype(live(OB), T("/obj/structure/blob/shield")) ? 1 : 0)) && truthy(rt.op(f, "Prob", [], [25])))) && truthy(rt.fv(f, "overmind", live(OB)))) && isEqual(rt.gv(f, "id", rt.gv(f, "blob_reagent_datum", rt.fv(f, "overmind", live(OB)))), rt.gv(f, "id", rt.gv(f, "blob_reagent_datum", rt.fv(f, "overmind", live(f.args[0]))))))) {
				blobstopick = rt.modify(live(blobstopick), live(OB), add);
			}
		}
		rt.endFor(f, 0);
		if (truthy(rt.len(f, live(blobstopick)))) {
			targeted = rt.op(f, "PickUnweighted", [1], [live(blobstopick)]);
			_T = rt.getStep(f, live(targeted), 0);
			yield* g.callName(f, live(targeted), "forceMove", [rt.getStep(f, live(f.args[0]), 0)]);
			yield* g.callName(f, live(f.args[0]), "forceMove", [live(_T)]);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["B", "damage", "damage_type", "damage_flag"] });

rt.type(3526, "/datum/reagent/blob/blazing_oil", "/datum/reagent/blob", {
	name: "Blazing Oil",
	id: "blazing_oil",
	description: "will do medium burn damage and set targets on fire.",
	effectdesc: "will also release bursts of flame when burnt, but takes damage from water.",
	analyzerdescdamage: "Does medium burn damage and sets targets on fire.",
	analyzerdesceffect: "Releases fire when burnt, but takes damage from water and other extinguishing liquids.",
	color: "#B68D00",
	complementary_color: "#BE5532",
	blobbernaut_message: "splashes",
	message: "The blob splashes you with burning oil",
	message_living: ", and you feel your skin char and melt",
});

// /datum/reagent/blob/blazing_oil/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:158)  may sleep
rt.def("/datum/reagent/blob/blazing_oil/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.args[2] = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [(yield* g.call(f, P("/proc/round"), null, [divide(live(f.args[2]), 10)]))]);
	yield* g.callName(f, live(f.args[0]), "IgniteMob", []);
	if (truthy(live(f.args[0]))) {
		yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.800000011920929, live(f.args[2])), "fire"]);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "emote", ["scream"]);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// /datum/reagent/blob/blazing_oil/proc/extinguish_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:167)  may sleep
rt.def("/datum/reagent/blob/blazing_oil/proc/extinguish_reaction", function* extinguish_reaction(f: Frame, B: Value) {
	f.vars = () => [B];
	yield* g.callName(f, live(B), "take_damage", [1.5, "fire", "energy"]);
	return f.dot;
}, true);

// /datum/reagent/blob/blazing_oil/proc/damage_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:170)  may sleep
rt.def("/datum/reagent/blob/blazing_oil/proc/damage_reaction", function* damage_reaction(f: Frame) {
	let _T: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [_T, C, $e];
	if ((isEqual(live(f.args[2]), "fire") && !isEqual(live(f.args[3]), "energy"))) {
		_T = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.args[0])])), T("/turf/open"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if ((!((truthy((C = rt.locateIn(f, T("/obj/structure/blob"), live(_T)))) && truthy(rt.fv(f, "overmind", live(C)))) && isEqual(rt.gv(f, "id", rt.gv(f, "blob_reagent_datum", rt.fv(f, "overmind", live(C)))), rt.gv(f, "id", rt.gv(f, "blob_reagent_datum", rt.fv(f, "overmind", live(f.args[0])))))) && truthy(rt.op(f, "Prob", [], [80])))) {
				yield* g.new_(f, T("/obj/effect/hotspot"), [live(_T)]);
			}
		}
		rt.endFor(f, 0);
	}
	if (isEqual(live(f.args[3]), "fire")) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["B", "damage", "damage_type", "damage_flag"] });

rt.type(3527, "/datum/reagent/blob/regenerative_materia", "/datum/reagent/blob", {
	name: "Regenerative Materia",
	id: "regenerative_materia",
	description: "will do toxin damage and cause targets to believe they are fully healed.",
	analyzerdescdamage: "Does toxin damage and injects a toxin that causes the target to believe they are fully healed.",
	color: "#C8A5DC",
	complementary_color: "#CD7794",
	message_living: ", and you feel <i>alive</i>",
});

// /datum/reagent/blob/regenerative_materia/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:190)  may sleep
rt.def("/datum/reagent/blob/regenerative_materia/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.args[2] = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(f.args[0]), "adjust_drugginess", [live(f.args[2])]);
	if (truthy(rt.fv(f, "reagents", live(f.args[0])))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["regenerative_materia", multiply(0.20000000298023224, live(f.args[2]))]);
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["spore", multiply(0.20000000298023224, live(f.args[2]))]);
	}
	yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.699999988079071, live(f.args[2])), "tox"]);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// /datum/reagent/blob/regenerative_materia/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:198)  may sleep
rt.def("/datum/reagent/blob/regenerative_materia/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let N: Value = null;
	f.vars = () => [N];
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1]);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		rt.setFv(f, "hal_screwyhud", (N = live(f.args[0])), 3);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/blob/regenerative_materia/proc/on_mob_delete  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:205)
rt.def("/datum/reagent/blob/regenerative_materia/proc/on_mob_delete", function on_mob_delete(f: Frame) {
	let N: Value = null;
	f.vars = () => [N];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		rt.setFv(f, "hal_screwyhud", (N = live(f.args[0])), 0);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["M"] });

rt.type(3528, "/datum/reagent/blob/zombifying_pods", "/datum/reagent/blob", {
	name: "Zombifying Pods",
	id: "zombifying_pods",
	description: "will do very low toxin damage and harvest sleeping targets for additional resources and a blob zombie.",
	effectdesc: "will also produce fragile spores when killed and on expanding.",
	shortdesc: "will do very low toxin damage and harvest sleeping targets for additional resources(for your overmind) and a blob zombie.",
	analyzerdescdamage: "Does very low toxin damage and kills unconscious humans, turning them into blob zombies.",
	analyzerdesceffect: "Produces spores when expanding and when killed.",
	color: "#E88D5D",
	complementary_color: "#823ABB",
	message_living: ", and you feel tired",
});

// /datum/reagent/blob/zombifying_pods/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:224)  may sleep
rt.def("/datum/reagent/blob/zombifying_pods/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let points: Value = null, BS: Value = null;
	f.vars = () => [points, BS];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.args[2] = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.6000000238418579, live(f.args[2])), "tox"]);
	if (!((truthy(live(f.args[5])) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) && isEqual(rt.fv(f, "stat", live(f.args[0])), 1))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "death", []);
	points = (yield* g.call(f, P("/proc/rand"), null, [5, 10]));
	rt.setFv(f, "overmind", (BS = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/blob/blobspore/weak"), [rt.getStep(f, live(f.args[0]), 0)]))), live(f.args[5]));
	yield* g.callName(f, live(BS), "update_icons", []);
	yield* g.callName(f, rt.fv(f, "blob_mobs", live(f.args[5])), "Add", [live(BS)]);
	yield* g.callName(f, live(BS), "Zombify", [live(f.args[0])]);
	yield* g.callName(f, live(f.args[5]), "add_points", [live(points)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[5]), fmt("<span class='notice'>Gained ＀ resources from the zombification of ＀.</span>", [live(points), live(f.args[0])])]);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// /datum/reagent/blob/zombifying_pods/proc/damage_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:238)  may sleep
rt.def("/datum/reagent/blob/zombifying_pods/proc/damage_reaction", function* damage_reaction(f: Frame) {
	let BS: Value = null;
	f.vars = () => [BS];
	if ((((((isEqual(live(f.args[3]), "melee") || isEqual(live(f.args[3]), "bullet")) || isEqual(live(f.args[3]), "laser")) && rt.le(live(f.args[1]), 20)) && rt.le(subtract(rt.fv(f, "obj_integrity", live(f.args[0])), live(f.args[1])), 0)) && truthy(rt.op(f, "Prob", [], [30])))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", ["<span class='warning'><b>A spore floats free of the blob!</b></span>"]);
		rt.setFv(f, "overmind", (BS = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/blob/blobspore/weak"), [rt.fv(f, "loc", live(f.args[0]))]))), rt.fv(f, "overmind", live(f.args[0])));
		yield* g.callName(f, live(BS), "update_icons", []);
		yield* g.callName(f, rt.gv(f, "blob_mobs", rt.fv(f, "overmind", live(f.args[0]))), "Add", [live(BS)]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["B", "damage", "damage_type", "damage_flag"] });

// /datum/reagent/blob/zombifying_pods/proc/expand_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:247)  may sleep
rt.def("/datum/reagent/blob/zombifying_pods/proc/expand_reaction", function* expand_reaction(f: Frame, B: Value, newB: Value, _T: Value, O: Value) {
	let BS: Value = null;
	f.vars = () => [B, newB, _T, O, BS];
	if (!truthy(rt.op(f, "Prob", [], [10]))) return f.dot;
	rt.setFv(f, "overmind", (BS = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/blob/blobspore/weak"), [live(_T)]))), rt.fv(f, "overmind", live(B)));
	yield* g.callName(f, live(BS), "update_icons", []);
	yield* g.callName(f, rt.gv(f, "blob_mobs", rt.fv(f, "overmind", live(newB))), "Add", [live(BS)]);
	return f.dot;
}, true);

rt.type(3529, "/datum/reagent/blob/energized_jelly", "/datum/reagent/blob", {
	name: "Energized Jelly",
	id: "energized_jelly",
	description: "will cause low stamina and high oxygen damage, and cause targets to be unable to breathe.",
	effectdesc: "will also conduct electricity, but takes damage from EMPs.",
	analyzerdescdamage: "Does low stamina damage, high oxygen damage, and prevents targets from breathing.",
	analyzerdesceffect: "Is immune to electricity and will easily conduct it, but is weak to EMPs.",
	color: "#EFD65A",
	complementary_color: "#00E5B1",
	message_living: ", and you feel a horrible tingling sensation",
});

// /datum/reagent/blob/energized_jelly/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:266)  may sleep
rt.def("/datum/reagent/blob/energized_jelly/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.args[2] = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modField(f, live(f.args[0]), "losebreath", (yield* g.call(f, P("/proc/round"), null, [multiply(0.20000000298023224, live(f.args[2]))])), add);
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [multiply(0.4000000059604645, live(f.args[2]))]);
	if (!truthy(live(f.args[0]))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.6000000238418579, live(f.args[2])), "oxy"]);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// /datum/reagent/blob/energized_jelly/proc/damage_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:273)  may sleep
rt.def("/datum/reagent/blob/energized_jelly/proc/damage_reaction", function* damage_reaction(f: Frame) {
	if (((((isEqual(live(f.args[3]), "melee") || isEqual(live(f.args[3]), "bullet")) || isEqual(live(f.args[3]), "laser")) && rt.le(subtract(rt.fv(f, "obj_integrity", live(f.args[0])), live(f.args[1])), 0)) && truthy(rt.op(f, "Prob", [], [10])))) {
		yield* g.call(f, P("/proc/do_sparks"), null, [(yield* g.call(f, P("/proc/rand"), null, [2, 4])), 0, live(f.args[0])]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["B", "damage", "damage_type", "damage_flag"] });

// /datum/reagent/blob/energized_jelly/proc/emp_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:281)  may sleep
rt.def("/datum/reagent/blob/energized_jelly/proc/emp_reaction", function* emp_reaction(f: Frame, B: Value, severity: Value) {
	let damage: Value = null;
	f.vars = () => [B, severity, damage];
	damage = subtract((yield* g.call(f, P("/proc/rand"), null, [30, 50])), multiply(live(severity), (yield* g.call(f, P("/proc/rand"), null, [10, 15]))));
	yield* g.callName(f, live(B), "take_damage", [live(damage), "fire", "energy"]);
	return f.dot;
}, true);

rt.type(3530, "/datum/reagent/blob/explosive_lattice", "/datum/reagent/blob", {
	name: "Explosive Lattice",
	id: "explosive_lattice",
	description: "will do brute damage in an area around targets.",
	effectdesc: "will also resist explosions, but takes increased damage from fire and other energy sources.",
	analyzerdescdamage: "Does medium brute damage and causes damage to everyone near its targets.",
	analyzerdesceffect: "Is highly resistant to explosions, but takes increased damage from fire and other energy sources.",
	color: "#8B2500",
	complementary_color: "#00668B",
	blobbernaut_message: "blasts",
	message: "The blob blasts you",
});

// /datum/reagent/blob/explosive_lattice/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:298)  may sleep
rt.def("/datum/reagent/blob/explosive_lattice/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let initial_volume: Value = null, E: Value = null, L: Value = null, aoe_volume: Value = null;
	let $e: any;
	f.vars = () => [initial_volume, E, L, aoe_volume, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	initial_volume = live(f.args[2]);
	if (rt.ge((f.args[2] = (yield* g.callSuper(f, [], rt.Args.Same))), 10)) {
		rt.setFv(f, "alpha", (E = (yield* g.new_(f, T("/obj/effect/temp_visual/explosion/fast"), [rt.getStep(f, live(f.args[0]), 0)]))), 150);
		L = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [rt.getStep(f, live(f.args[0]), 0), 1])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (truthy((rt.isIn(f, "blob", rt.fv(f, "faction", live(L))) ? 1 : 0))) {
				continue;
			}
			aoe_volume = (yield* g.callSuper(f, [live(L), 1, live(initial_volume), 0, (yield* g.callName(f, live(L), "get_permeability_protection", [])), live(f.args[5])]));
			yield* g.callName(f, live(L), "apply_damage", [multiply(0.4000000059604645, live(aoe_volume)), "brute"]);
		}
		rt.endFor(f, 0);
		if (truthy(live(f.args[0]))) {
			yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.6000000238418579, live(f.args[2])), "brute"]);
		}
	} else {
		yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.6000000238418579, live(f.args[2])), "brute"]);
	}
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// /datum/reagent/blob/explosive_lattice/proc/damage_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:314)
rt.def("/datum/reagent/blob/explosive_lattice/proc/damage_reaction", function damage_reaction(f: Frame) {
	if (isEqual(live(f.args[3]), "bomb")) {
		return 0;
	} else {
		if (((!isEqual(live(f.args[3]), "melee") || !isEqual(live(f.args[3]), "bullet")) || !isEqual(live(f.args[3]), "laser"))) {
			return multiply(live(f.args[1]), 1.5);
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["B", "damage", "damage_type", "damage_flag"] });

rt.type(3531, "/datum/reagent/blob/cryogenic_poison", "/datum/reagent/blob", {
	name: "Cryogenic Poison",
	id: "cryogenic_poison",
	description: "will inject targets with a freezing poison that does high damage over time.",
	analyzerdescdamage: "Injects targets with a freezing poison that will gradually solidify the target's internal organs.",
	color: "#8BA6E9",
	complementary_color: "#7D6EB4",
	blobbernaut_message: "injects",
	message: "The blob stabs you",
	message_living: ", and you feel like your insides are solidifying",
});

// /datum/reagent/blob/cryogenic_poison/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:333)  may sleep
rt.def("/datum/reagent/blob/cryogenic_poison/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.args[2] = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.fv(f, "reagents", live(f.args[0])))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["frostoil", multiply(0.30000001192092896, live(f.args[2]))]);
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["ice", multiply(0.30000001192092896, live(f.args[2]))]);
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["cryogenic_poison", multiply(0.30000001192092896, live(f.args[2]))]);
	}
	yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.20000000298023224, live(f.args[2])), "brute"]);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// /datum/reagent/blob/cryogenic_poison/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:341)  may sleep
rt.def("/datum/reagent/blob/cryogenic_poison/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [0.30000001192092896, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [0.30000001192092896, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [0.30000001192092896, 0]);
	f.dot = 1;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3532, "/datum/reagent/blob/electromagnetic_web", "/datum/reagent/blob", {
	name: "Electromagnetic Web",
	id: "electromagnetic_web",
	description: "will do high burn damage and EMP targets.",
	effectdesc: "will also take massively increased damage and release an EMP when killed.",
	analyzerdescdamage: "Does low burn damage and EMPs targets.",
	analyzerdesceffect: "Is fragile to all types of damage, but takes massive damage from brute. In addition, releases a small EMP when killed.",
	color: "#83ECEC",
	complementary_color: "#EC8383",
	blobbernaut_message: "lashes",
	message: "The blob lashes you",
	message_living: ", and you hear a faint buzzing",
});

// /datum/reagent/blob/electromagnetic_web/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:362)  may sleep
rt.def("/datum/reagent/blob/electromagnetic_web/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (truthy(rt.op(f, "Prob", [], [multiply((f.args[2] = (yield* g.callSuper(f, [], rt.Args.Same))), 2)]))) {
		yield* g.callName(f, live(f.args[0]), "emp_act", [2]);
	}
	if (!truthy(live(f.args[0]))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "apply_damage", [live(f.args[2]), "fire"]);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// /datum/reagent/blob/electromagnetic_web/proc/damage_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:369)
rt.def("/datum/reagent/blob/electromagnetic_web/proc/damage_reaction", function damage_reaction(f: Frame, B: Value, damage: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (isEqual(live(damage_type), "brute")) {
		$0 = rt.fv(f, "brute_resist", live(B));
		if ($0 === 0.5) {
			return multiply(live(damage), 2);
		} else if ($0 === 0.25) {
			return multiply(live(damage), 4);
		} else if ($0 === 0.10000000149011612) {
			return multiply(live(damage), 10);
		}
	}
	return multiply(live(damage), 1.25);
});

// /datum/reagent/blob/electromagnetic_web/proc/death_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:380)  may sleep
rt.def("/datum/reagent/blob/electromagnetic_web/proc/death_reaction", function* death_reaction(f: Frame, B: Value, damage_flag: Value) {
	f.vars = () => [B, damage_flag];
	if (!((isEqual(live(damage_flag), "melee") || isEqual(live(damage_flag), "bullet")) || isEqual(live(damage_flag), "laser"))) return f.dot;
	yield* g.call(f, P("/proc/empulse"), null, [rt.fv(f, "loc", live(B)), 1, 3]);
	return f.dot;
}, true);

rt.type(3533, "/datum/reagent/blob/synchronous_mesh", "/datum/reagent/blob", {
	name: "Synchronous Mesh",
	id: "synchronous_mesh",
	description: "will do massively increased brute damage for each blob near the target.",
	effectdesc: "will also spread damage between each blob near the attacked blob.",
	analyzerdescdamage: "Does brute damage, increasing for each blob near the target.",
	analyzerdesceffect: "When attacked, spreads damage between all blobs near the attacked blob.",
	color: "#65ADA2",
	complementary_color: "#AD6570",
	blobbernaut_message: "synchronously strikes",
	message: "The blobs strike you",
});

// /datum/reagent/blob/synchronous_mesh/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:397)  may sleep
rt.def("/datum/reagent/blob/synchronous_mesh/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let B: Value = null;
	let $e: any;
	f.vars = () => [B, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.args[2] = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.20000000298023224, live(f.args[2])), "brute"]);
	if (!(truthy(live(f.args[0])) && truthy(live(f.args[2])))) return f.dot;
	B = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.args[0])])), T("/obj/structure/blob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		if (truthy(live(f.args[0]))) {
			yield* g.callName(f, live(B), "blob_attack_animation", [live(f.args[0])]);
			yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.30000001192092896, live(f.args[2])), "brute"]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// /datum/reagent/blob/synchronous_mesh/proc/damage_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:406)  may sleep
rt.def("/datum/reagent/blob/synchronous_mesh/proc/damage_reaction", function* damage_reaction(f: Frame, B: Value, damage: Value, damage_type: Value, damage_flag: Value) {
	let damagesplit: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [B, damage, damage_type, damage_flag, damagesplit, C, $e];
	if (((isEqual(live(damage_flag), "melee") || isEqual(live(damage_flag), "bullet")) || isEqual(live(damage_flag), "laser"))) {
		damagesplit = 1;
		C = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, live(B)])), T("/obj/structure/blob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if ((((!truthy((rt.istype(live(C), T("/obj/structure/blob/core")) ? 1 : 0)) && !truthy((rt.istype(live(C), T("/obj/structure/blob/node")) ? 1 : 0))) && truthy(rt.fv(f, "overmind", live(C)))) && isEqual(rt.gv(f, "id", rt.gv(f, "blob_reagent_datum", rt.fv(f, "overmind", live(C)))), rt.gv(f, "id", rt.gv(f, "blob_reagent_datum", rt.fv(f, "overmind", live(B))))))) {
				damagesplit = rt.modify(live(damagesplit), 1, add);
			}
		}
		rt.endFor(f, 0);
		C = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, live(B)])), T("/obj/structure/blob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if ((((!truthy((rt.istype(live(C), T("/obj/structure/blob/core")) ? 1 : 0)) && !truthy((rt.istype(live(C), T("/obj/structure/blob/node")) ? 1 : 0))) && truthy(rt.fv(f, "overmind", live(C)))) && isEqual(rt.gv(f, "id", rt.gv(f, "blob_reagent_datum", rt.fv(f, "overmind", live(C)))), rt.gv(f, "id", rt.gv(f, "blob_reagent_datum", rt.fv(f, "overmind", live(B))))))) {
				yield* g.callName(f, live(C), "take_damage", [divide(live(damage), live(damagesplit)), "clone", 0, 0]);
			}
		}
		rt.endFor(f, 0);
		return divide(live(damage), live(damagesplit));
	} else {
		return multiply(live(damage), 1.25);
	}
	return f.dot;
}, true);

rt.type(3534, "/datum/reagent/blob/reactive_spines", "/datum/reagent/blob", {
	name: "Reactive Spines",
	id: "reactive_spines",
	description: "will do medium brute damage through armor and bio resistance.",
	effectdesc: "will also react when attacked with brute damage, attacking all near the attacked blob.",
	analyzerdescdamage: "Does medium brute damage, ignoring armor and bio resistance.",
	analyzerdesceffect: "When attacked with brute damage, will lash out, attacking everything near it.",
	color: "#9ACD32",
	complementary_color: "#FFA500",
	blobbernaut_message: "stabs",
	message: "The blob stabs you",
});

// /datum/reagent/blob/reactive_spines/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:432)  may sleep
rt.def("/datum/reagent/blob/reactive_spines/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value, show_message: Value, touch_protection: Value, O: Value) {
	f.vars = () => [M, method, reac_volume, show_message, touch_protection, O];
	if (live(method) === null) {
		method = 1;
	}
	if ((isEqual(rt.fv(f, "stat", live(M)), 2) || truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile/blob")) ? 1 : 0)))) {
		return 0;
	}
	yield* g.callName(f, live(M), "adjustBruteLoss", [multiply(0.800000011920929, live(reac_volume))]);
	return f.dot;
}, true);

// /datum/reagent/blob/reactive_spines/proc/damage_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:437)  may sleep
rt.def("/datum/reagent/blob/reactive_spines/proc/damage_reaction", function* damage_reaction(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	if (((truthy(live(f.args[1])) && isEqual(live(f.args[2]), "brute")) && rt.gt(subtract(rt.fv(f, "obj_integrity", live(f.args[0])), live(f.args[1])), 0))) {
		if (isEqual(live(f.args[3]), "melee")) {
			yield* g.callName(f, live(f.args[0]), "visible_message", ["<span class='boldwarning'>The blob retaliates, lashing out!</span>"]);
		}
		A = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.args[0])])), T("/atom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			yield* g.callName(f, live(A), "blob_act", [live(f.args[0])]);
		}
		rt.endFor(f, 0);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["B", "damage", "damage_type", "damage_flag"] });

rt.type(3535, "/datum/reagent/blob/pressurized_slime", "/datum/reagent/blob", {
	name: "Pressurized Slime",
	id: "pressurized_slime",
	description: "will do low brute, oxygen, and stamina damage, and wet tiles under targets.",
	effectdesc: "will also wet tiles near blobs that are attacked or killed.",
	analyzerdescdamage: "Does low brute damage, low oxygen damage, drains stamina, and wets tiles under targets, extinguishing them.",
	analyzerdesceffect: "When attacked or killed, wets nearby tiles, extinguishing anything on them.",
	color: "#AAAABB",
	complementary_color: "#BBBBAA",
	blobbernaut_message: "emits slime at",
	message: "The blob splashes into you",
	message_living: ", and you gasp for breath",
});

// /datum/reagent/blob/pressurized_slime/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:459)  may sleep
rt.def("/datum/reagent/blob/pressurized_slime/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.args[2] = (yield* g.callSuper(f, [], rt.Args.Same));
	if ((truthy((rt.istype((_T = rt.getStep(f, live(f.args[0]), 0)), T("/turf/open")) ? 1 : 0)) && truthy(rt.op(f, "Prob", [], [live(f.args[2])])))) {
		yield* g.callName(f, live(_T), "MakeSlippery", ["min_wet_time", 10, "wet_time_to_add", 5], rt.Args.Named);
		yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [rt.neg(divide(live(f.args[2]), 10))]);
		yield* g.callName(f, live(f.args[0]), "ExtinguishMob", []);
	}
	yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.4000000059604645, live(f.args[2])), "brute"]);
	if (truthy(live(f.args[0]))) {
		yield* g.callName(f, live(f.args[0]), "apply_damage", [multiply(0.4000000059604645, live(f.args[2])), "oxy"]);
	}
	if (!truthy(live(f.args[0]))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [multiply(0.20000000298023224, live(f.args[2]))]);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// /datum/reagent/blob/pressurized_slime/proc/damage_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:472)  may sleep
rt.def("/datum/reagent/blob/pressurized_slime/proc/damage_reaction", function* damage_reaction(f: Frame) {
	if ((((isEqual(live(f.args[3]), "melee") || isEqual(live(f.args[3]), "bullet")) || isEqual(live(f.args[3]), "laser")) || !isEqual(live(f.args[2]), "fire"))) {
		yield* g.srcCall(f, "extinguisharea", live(f.args[0]), live(f.args[1]));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["B", "damage", "damage_type", "damage_flag"] });

// /datum/reagent/blob/pressurized_slime/proc/death_reaction  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:477)  may sleep
rt.def("/datum/reagent/blob/pressurized_slime/proc/death_reaction", function* death_reaction(f: Frame, B: Value, damage_flag: Value) {
	f.vars = () => [B, damage_flag];
	if (!((isEqual(live(damage_flag), "melee") || isEqual(live(damage_flag), "bullet")) || isEqual(live(damage_flag), "laser"))) return f.dot;
	yield* g.callName(f, live(B), "visible_message", ["<span class='boldwarning'>The blob ruptures, spraying the area with liquid!</span>"]);
	yield* g.srcCall(f, "extinguisharea", live(B), 50);
	return f.dot;
}, true);

// /datum/reagent/blob/pressurized_slime/proc/extinguisharea  (code/modules/reagents/chemistry/reagents/blob_reagents.dm:482)  may sleep
rt.def("/datum/reagent/blob/pressurized_slime/proc/extinguisharea", function* extinguisharea(f: Frame, B: Value, probchance: Value) {
	let _T: Value = null, O: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [B, probchance, _T, O, L, $e];
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(B)])), T("/turf/open"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.op(f, "Prob", [], [live(probchance)]))) {
			yield* g.callName(f, live(_T), "MakeSlippery", ["min_wet_time", 10, "wet_time_to_add", 5], rt.Args.Named);
			O = null;
			rt.forList(f, 1, live(_T), T("/obj"));
			while (($e = rt.next(f, 1)) !== undefined) {
				O = $e;
				yield* g.callName(f, live(O), "extinguish", []);
			}
			rt.endFor(f, 1);
			L = null;
			rt.forList(f, 1, live(_T), T("/mob/living"));
			while (($e = rt.next(f, 1)) !== undefined) {
				L = $e;
				yield* g.callName(f, live(L), "adjust_fire_stacks", [-2.5]);
				yield* g.callName(f, live(L), "ExtinguishMob", []);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
