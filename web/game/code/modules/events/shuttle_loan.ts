// From code/modules/events/shuttle_loan.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(320, "/datum/round_event/shuttle_loan", "/datum/round_event", {
	dispatched: 0,
	dispatch_type: 0,
	bonus_points: 10000,
	thanks_msg: "The cargo shuttle should return in five minutes. Have some supply points for your trouble.",
	announceWhen: 1,
	endWhen: 500,
});

// /datum/round_event/shuttle_loan/proc/start  (code/modules/events/shuttle_loan.dm:24)
rt.def("/datum/round_event/shuttle_loan/proc/start", function start(f: Frame) {
	rt.setSv(f, "dispatch_type", rt.op(f, "PickUnweighted", [6], [1, 2, 3, 4, 5, 6]));
	return f.dot;
});

// /datum/round_event/shuttle_loan/proc/announce  (code/modules/events/shuttle_loan.dm:28)  may sleep
rt.def("/datum/round_event/shuttle_loan/proc/announce", function* announce(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setFv(f, "shuttle_loan", rt.gl("SSshuttle"), live(f.src));
	$0 = rt.sv(f, "dispatch_type");
	if ($0 === 1) {
		yield* g.call(f, P("/proc/priority_announce"), null, ["Cargo: The syndicate are trying to infiltrate your station. If you let them hijack your cargo shuttle, you'll save us a headache.", "Centcom Counter Intelligence"]);
	} else if ($0 === 2) {
		yield* g.call(f, P("/proc/priority_announce"), null, ["Cargo: A group of angry russians want to have a party, can you send them your cargo shuttle then make them disappear?", "Centcom Russian Outreach Program"]);
	} else if ($0 === 3) {
		yield* g.call(f, P("/proc/priority_announce"), null, ["Cargo: The Spider Clan has sent us a mysterious gift, can we ship it to you to see what's inside?", "Centcom Diplomatic Corps"]);
	} else if ($0 === 4) {
		yield* g.call(f, P("/proc/priority_announce"), null, ["Cargo: Seems we've ordered doubles of our department resupply packages this month. Can we send them to you?", "Centcom Supply Department"]);
		rt.setSv(f, "thanks_msg", "The cargo shuttle should return in 5 minutes.");
		rt.setSv(f, "bonus_points", 0);
	} else if ($0 === 5) {
		yield* g.call(f, P("/proc/priority_announce"), null, ["Cargo: Your station has been chosen for an epidemiological research project. Send us your cargo shuttle to receive your research samples.", "Centcom Research Initiatives"]);
	} else if ($0 === 6) {
		yield* g.call(f, P("/proc/priority_announce"), null, ["Cargo: It looks like a neighbouring station accidentally delivered their pizza to you instead", "Centcom Spacepizza Division"]);
	}
	return f.dot;
}, true);

// /datum/round_event/shuttle_loan/proc/loan_shuttle  (code/modules/events/shuttle_loan.dm:45)  may sleep
rt.def("/datum/round_event/shuttle_loan/proc/loan_shuttle", function* loan_shuttle(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.call(f, P("/proc/priority_announce"), null, [rt.sv(f, "thanks_msg"), "Cargo shuttle commandeered by Centcom."]);
	rt.setSv(f, "dispatched", 1);
	rt.modField(f, rt.gl("SSshuttle"), "points", rt.sv(f, "bonus_points"), add);
	rt.setSv(f, "endWhen", add(rt.sv(f, "activeFor"), 1));
	rt.setFv(f, "mode", rt.fv(f, "supply", rt.gl("SSshuttle")), "call");
	rt.setFv(f, "destination", rt.fv(f, "supply", rt.gl("SSshuttle")), (yield* g.callName(f, rt.gl("SSshuttle"), "getDock", ["supply_home"])));
	yield* g.callName(f, rt.fv(f, "supply", rt.gl("SSshuttle")), "setTimer", [3000]);
	$0 = rt.sv(f, "dispatch_type");
	if ($0 === 1) {
		rt.modField(f, rt.gl("SSshuttle"), "centcom_message", "Syndicate hijack team incoming.", add);
	} else if ($0 === 2) {
		rt.modField(f, rt.gl("SSshuttle"), "centcom_message", "Partying Russians incoming.", add);
	} else if ($0 === 3) {
		rt.modField(f, rt.gl("SSshuttle"), "centcom_message", "Spider Clan gift incoming.", add);
	} else if ($0 === 4) {
		rt.modField(f, rt.gl("SSshuttle"), "centcom_message", "Department resupply incoming.", add);
	} else if ($0 === 5) {
		rt.modField(f, rt.gl("SSshuttle"), "centcom_message", "Virus samples incoming.", add);
	} else if ($0 === 6) {
		rt.modField(f, rt.gl("SSshuttle"), "centcom_message", fmt("Pizza delivery for ＀", [(yield* g.call(f, P("/proc/station_name"), null, []))]), add);
	}
	return f.dot;
}, true);

// /datum/round_event/shuttle_loan/proc/tick  (code/modules/events/shuttle_loan.dm:71)
rt.def("/datum/round_event/shuttle_loan/proc/tick", function tick(f: Frame) {
	if (!truthy(rt.sv(f, "dispatched"))) return f.dot;
	if (!isEqual(rt.gv(f, "mode", rt.fv(f, "supply", rt.gl("SSshuttle"))), "idle")) {
		rt.setSv(f, "endWhen", rt.sv(f, "activeFor"));
	} else {
		rt.setSv(f, "endWhen", add(rt.sv(f, "activeFor"), 1));
	}
	return f.dot;
});

// /datum/round_event/shuttle_loan/proc/end  (code/modules/events/shuttle_loan.dm:77)  may sleep
rt.def("/datum/round_event/shuttle_loan/proc/end", function* end(f: Frame) {
	let empty_shuttle_turfs: Value = null, _T: Value = null, shuttle_spawns: Value = null, pack: Value = null, _T_3: Value = null, i: Value = null, virus_type: Value = null, b: Value = null, D: Value = null, crate_types: Value = null, crate: Value = null, pack_4: Value = null, i_3: Value = null, decal: Value = null, false_positive: Value = null, spawn_type: Value = null;
	let $0: any, $e: any;
	f.vars = () => [empty_shuttle_turfs, _T, shuttle_spawns, pack, _T_3, i, virus_type, b, D, crate_types, crate, pack_4, i_3, decal, false_positive, spawn_type, $0, $e];
	if (!(truthy(rt.fv(f, "shuttle_loan", rt.gl("SSshuttle"))) && truthy(rt.gv(f, "dispatched", rt.fv(f, "shuttle_loan", rt.gl("SSshuttle")))))) return f.dot;
	rt.setFv(f, "shuttle_loan", rt.gl("SSshuttle"), null);
	empty_shuttle_turfs = rt.list();
	_T = null;
	rt.forList(f, 0, rt.gv(f, "areaInstance", rt.fv(f, "supply", rt.gl("SSshuttle"))), T("/turf/open/floor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(_T)])))) {
			continue;
		}
		empty_shuttle_turfs = rt.modify(live(empty_shuttle_turfs), live(_T), add);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(empty_shuttle_turfs)))) {
		return live(f.dot);
	}
	shuttle_spawns = rt.list();
	$0 = rt.sv(f, "dispatch_type");
	if ($0 === 1) {
		yield* g.callName(f, (pack = rt.index(rt.fv(f, "supply_packs", rt.gl("SSshuttle")), T("/datum/supply_pack/emergency/specialops"))), "generate", [(yield* g.call(f, P("/proc/pick_n_take"), null, [live(empty_shuttle_turfs)]))]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/mob/living/simple_animal/hostile/syndicate")]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/mob/living/simple_animal/hostile/syndicate")]);
		if (truthy(rt.op(f, "Prob", [], [75]))) {
			yield* g.callName(f, live(shuttle_spawns), "Add", [T("/mob/living/simple_animal/hostile/syndicate")]);
		}
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.callName(f, live(shuttle_spawns), "Add", [T("/mob/living/simple_animal/hostile/syndicate")]);
		}
	} else if ($0 === 2) {
		yield* g.callName(f, (pack = rt.index(rt.fv(f, "supply_packs", rt.gl("SSshuttle")), T("/datum/supply_pack/organic/party"))), "generate", [(yield* g.call(f, P("/proc/pick_n_take"), null, [live(empty_shuttle_turfs)]))]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/mob/living/simple_animal/hostile/russian")]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/mob/living/simple_animal/hostile/russian/ranged")]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/mob/living/simple_animal/hostile/bear/russian")]);
		if (truthy(rt.op(f, "Prob", [], [75]))) {
			yield* g.callName(f, live(shuttle_spawns), "Add", [T("/mob/living/simple_animal/hostile/russian")]);
		}
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.callName(f, live(shuttle_spawns), "Add", [T("/mob/living/simple_animal/hostile/bear/russian")]);
		}
	} else if ($0 === 3) {
		yield* g.callName(f, (pack = rt.index(rt.fv(f, "supply_packs", rt.gl("SSshuttle")), T("/datum/supply_pack/emergency/specialops"))), "generate", [(yield* g.call(f, P("/proc/pick_n_take"), null, [live(empty_shuttle_turfs)]))]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/mob/living/simple_animal/hostile/poison/giant_spider")]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/mob/living/simple_animal/hostile/poison/giant_spider")]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/mob/living/simple_animal/hostile/poison/giant_spider/nurse")]);
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.callName(f, live(shuttle_spawns), "Add", [T("/mob/living/simple_animal/hostile/poison/giant_spider/hunter")]);
		}
		yield* g.new_(f, T("/obj/effect/decal/remains/human"), [(_T_3 = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(empty_shuttle_turfs)])))]);
		yield* g.new_(f, T("/obj/item/clothing/shoes/space_ninja"), [live(_T_3)]);
		yield* g.new_(f, T("/obj/item/clothing/mask/balaclava"), [live(_T_3)]);
		i = null;
		rt.forRange(f, 0, 1, 5, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.new_(f, T("/obj/structure/spider/stickyweb"), [(_T_3 = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(empty_shuttle_turfs)])))]);
		}
		rt.endFor(f, 0);
	} else if ($0 === 5) {
		virus_type = rt.op(f, "PickUnweighted", [3], [T("/datum/disease/beesease"), T("/datum/disease/brainrot"), T("/datum/disease/fluspanish")]);
		_T_3 = null;
		i = null;
		i = 0;
		while (rt.lt(live(i), 10)) {
			if (truthy(rt.op(f, "Prob", [], [15]))) {
				yield* g.callName(f, live(shuttle_spawns), "Add", [T("/obj/item/weapon/reagent_containers/glass/bottle")]);
			} else {
				if (truthy(rt.op(f, "Prob", [], [15]))) {
					yield* g.callName(f, live(shuttle_spawns), "Add", [T("/obj/item/weapon/reagent_containers/syringe")]);
				} else {
					if (truthy(rt.op(f, "Prob", [], [25]))) {
						yield* g.callName(f, live(shuttle_spawns), "Add", [T("/obj/item/weapon/shard")]);
					}
				}
			}
			_T_3 = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(empty_shuttle_turfs)]));
			b = (yield* g.new_(f, T("/obj/effect/decal/cleanable/blood"), [live(_T_3)]));
			rt.setFv(f, "longevity", (D = (yield* g.new_(f, live(virus_type), []))), 1000);
			rt.modField(f, live(b), "viruses", live(D), add);
			rt.setFv(f, "holder", live(D), live(b));
			i = rt.inc(live(i), 1);
		}
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/obj/structure/closet/crate")]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/obj/item/weapon/reagent_containers/glass/bottle/pierrot_throat")]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/obj/item/weapon/reagent_containers/glass/bottle/magnitis")]);
	} else if ($0 === 4) {
		crate_types = rt.list(T("/datum/supply_pack/emergency/equipment"), T("/datum/supply_pack/security/supplies"), T("/datum/supply_pack/organic/food"), T("/datum/supply_pack/emergency/weedcontrol"), T("/datum/supply_pack/engineering/tools"), T("/datum/supply_pack/engineering/engiequipment"), T("/datum/supply_pack/science/robotics"), T("/datum/supply_pack/science/plasma"), T("/datum/supply_pack/medical/supplies"));
		crate = null;
		rt.forList(f, 0, live(crate_types));
		while (($e = rt.next(f, 0)) !== undefined) {
			crate = $e;
			yield* g.callName(f, (pack_4 = rt.index(rt.fv(f, "supply_packs", rt.gl("SSshuttle")), live(crate))), "generate", [(yield* g.call(f, P("/proc/pick_n_take"), null, [live(empty_shuttle_turfs)]))]);
		}
		rt.endFor(f, 0);
		i_3 = null;
		rt.forRange(f, 0, 1, 5, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_3 = $e;
			decal = rt.op(f, "PickUnweighted", [3], [T("/obj/effect/decal/cleanable/flour"), T("/obj/effect/decal/cleanable/robot_debris"), T("/obj/effect/decal/cleanable/oil")]);
			yield* g.new_(f, live(decal), [(yield* g.call(f, P("/proc/pick_n_take"), null, [live(empty_shuttle_turfs)]))]);
		}
		rt.endFor(f, 0);
	} else if ($0 === 6) {
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/obj/item/pizzabox/margherita")]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/obj/item/pizzabox/margherita")]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/obj/item/pizzabox/meat")]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/obj/item/pizzabox/meat")]);
		yield* g.callName(f, live(shuttle_spawns), "Add", [T("/obj/item/pizzabox/vegetable")]);
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.callName(f, live(shuttle_spawns), "Add", [T("/obj/item/pizzabox/bomb")]);
		} else {
			yield* g.callName(f, live(shuttle_spawns), "Add", [T("/obj/item/pizzabox/margherita")]);
		}
	}
	false_positive = 0;
	while (truthy(rt.len(f, live(shuttle_spawns))) && truthy(rt.len(f, live(empty_shuttle_turfs)))) {
		if ((truthy(rt.getLen(f, rt.gv(f, "contents", (_T_3 = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(empty_shuttle_turfs)])))))) && rt.lt(live(false_positive), 5))) {
			false_positive = rt.inc(live(false_positive), 1);
			continue;
		}
		spawn_type = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(shuttle_spawns)]));
		yield* g.new_(f, live(spawn_type), [live(_T_3)]);
	}
	return f.dot;
}, true);
