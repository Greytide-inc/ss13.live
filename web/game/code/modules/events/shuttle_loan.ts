// Based on /tg/station's code/modules/events/shuttle_loan.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(320, "/datum/round_event/shuttle_loan", "/datum/round_event", {
	dispatched: 0,
	dispatch_type: 0,
	bonus_points: 10000,
	thanks_msg: "The cargo shuttle should return in five minutes. Have some supply points for your trouble.",
	announceWhen: 1,
	endWhen: 500,
});

// shuttle_loan.dm:24
rt.def("/datum/round_event/shuttle_loan/proc/start", function start(f: Frame) {
	this.dispatch_type = pick(HIJACK_SYNDIE, RUSKY_PARTY, SPIDER_GIFT, DEPARTMENT_RESUPPLY, ANTIDOTE_NEEDED, PIZZA_DELIVERY);
	return f.dot;
});

// shuttle_loan.dm:28
rt.def("/datum/round_event/shuttle_loan/proc/announce", function* announce(f: Frame) {
	GLOB.SSshuttle.shuttle_loan = this;
	if (this.dispatch_type === HIJACK_SYNDIE) {
		yield* priority_announce("Cargo: The syndicate are trying to infiltrate your station. If you let them hijack your cargo shuttle, you'll save us a headache.", "Centcom Counter Intelligence");
	} else if (this.dispatch_type === RUSKY_PARTY) {
		yield* priority_announce("Cargo: A group of angry russians want to have a party, can you send them your cargo shuttle then make them disappear?", "Centcom Russian Outreach Program");
	} else if (this.dispatch_type === SPIDER_GIFT) {
		yield* priority_announce("Cargo: The Spider Clan has sent us a mysterious gift, can we ship it to you to see what's inside?", "Centcom Diplomatic Corps");
	} else if (this.dispatch_type === DEPARTMENT_RESUPPLY) {
		yield* priority_announce("Cargo: Seems we've ordered doubles of our department resupply packages this month. Can we send them to you?", "Centcom Supply Department");
		this.thanks_msg = "The cargo shuttle should return in 5 minutes.";
		this.bonus_points = 0;
	} else if (this.dispatch_type === ANTIDOTE_NEEDED) {
		yield* priority_announce("Cargo: Your station has been chosen for an epidemiological research project. Send us your cargo shuttle to receive your research samples.", "Centcom Research Initiatives");
	} else if (this.dispatch_type === PIZZA_DELIVERY) {
		yield* priority_announce("Cargo: It looks like a neighbouring station accidentally delivered their pizza to you instead", "Centcom Spacepizza Division");
	}
	return f.dot;
}, true);

// shuttle_loan.dm:45
rt.def("/datum/round_event/shuttle_loan/proc/loan_shuttle", function* loan_shuttle(f: Frame) {
	yield* priority_announce(this.thanks_msg, "Cargo shuttle commandeered by Centcom.");
	this.dispatched = 1;
	GLOB.SSshuttle.points += this.bonus_points;
	this.endWhen = this.activeFor + 1;
	GLOB.SSshuttle.supply.mode = "call";
	GLOB.SSshuttle.supply.destination = GLOB.SSshuttle.getDock("supply_home");
	GLOB.SSshuttle.supply.setTimer(3000);
	if (this.dispatch_type === HIJACK_SYNDIE) {
		GLOB.SSshuttle.centcom_message += "Syndicate hijack team incoming.";
	} else if (this.dispatch_type === RUSKY_PARTY) {
		GLOB.SSshuttle.centcom_message += "Partying Russians incoming.";
	} else if (this.dispatch_type === SPIDER_GIFT) {
		GLOB.SSshuttle.centcom_message += "Spider Clan gift incoming.";
	} else if (this.dispatch_type === DEPARTMENT_RESUPPLY) {
		GLOB.SSshuttle.centcom_message += "Department resupply incoming.";
	} else if (this.dispatch_type === ANTIDOTE_NEEDED) {
		GLOB.SSshuttle.centcom_message += "Virus samples incoming.";
	} else if (this.dispatch_type === PIZZA_DELIVERY) {
		GLOB.SSshuttle.centcom_message += `Pizza delivery for ${station_name()}`;
	}
	return f.dot;
}, true);

// shuttle_loan.dm:71
rt.def("/datum/round_event/shuttle_loan/proc/tick", function tick(f: Frame) {
	if (!this.dispatched) return f.dot;
	if (GLOB.SSshuttle.supply.mode != "idle") {
		this.endWhen = this.activeFor;
	} else {
		this.endWhen = this.activeFor + 1;
	}
	return f.dot;
});

// shuttle_loan.dm:77
rt.def("/datum/round_event/shuttle_loan/proc/end", function* end(f: Frame) {
	let _T: Value = null, pack: Value = null, _T_3: Value = null, i: Value = null, virus_type: Value = null, b: Value = null, D: Value = null, crate_types: Value = null, crate: Value = null, pack_4: Value = null, i_3: Value = null, decal: Value = null, spawn_type: Value = null;
	let $e: any;
	if (!(GLOB.SSshuttle.shuttle_loan && GLOB.SSshuttle.shuttle_loan.dispatched)) return f.dot;
	GLOB.SSshuttle.shuttle_loan = null;
	let empty_shuttle_turfs: Value = list();
	for (_T of each(GLOB.SSshuttle.supply.areaInstance, T("/turf/open/floor"))) {
		if (is_blocked_turf(_T)) {
			continue;
		}
		empty_shuttle_turfs += _T;
	}
	if (!rt.len(f, empty_shuttle_turfs)) {
		return f.dot;
	}
	let shuttle_spawns: Value = list();
	if (this.dispatch_type === HIJACK_SYNDIE) {
		yield* (pack = rt.index(GLOB.SSshuttle.supply_packs, T("/datum/supply_pack/emergency/specialops"))).generate(pick_n_take(empty_shuttle_turfs));
		shuttle_spawns.Add(T("/mob/living/simple_animal/hostile/syndicate"));
		shuttle_spawns.Add(T("/mob/living/simple_animal/hostile/syndicate"));
		if (prob(75)) {
			shuttle_spawns.Add(T("/mob/living/simple_animal/hostile/syndicate"));
		}
		if (prob(50)) {
			shuttle_spawns.Add(T("/mob/living/simple_animal/hostile/syndicate"));
		}
	} else if (this.dispatch_type === RUSKY_PARTY) {
		yield* (pack = rt.index(GLOB.SSshuttle.supply_packs, T("/datum/supply_pack/organic/party"))).generate(pick_n_take(empty_shuttle_turfs));
		shuttle_spawns.Add(T("/mob/living/simple_animal/hostile/russian"));
		shuttle_spawns.Add(T("/mob/living/simple_animal/hostile/russian/ranged"));
		shuttle_spawns.Add(T("/mob/living/simple_animal/hostile/bear/russian"));
		if (prob(75)) {
			shuttle_spawns.Add(T("/mob/living/simple_animal/hostile/russian"));
		}
		if (prob(50)) {
			shuttle_spawns.Add(T("/mob/living/simple_animal/hostile/bear/russian"));
		}
	} else if (this.dispatch_type === SPIDER_GIFT) {
		yield* (pack = rt.index(GLOB.SSshuttle.supply_packs, T("/datum/supply_pack/emergency/specialops"))).generate(pick_n_take(empty_shuttle_turfs));
		shuttle_spawns.Add(T("/mob/living/simple_animal/hostile/poison/giant_spider"));
		shuttle_spawns.Add(T("/mob/living/simple_animal/hostile/poison/giant_spider"));
		shuttle_spawns.Add(T("/mob/living/simple_animal/hostile/poison/giant_spider/nurse"));
		if (prob(50)) {
			shuttle_spawns.Add(T("/mob/living/simple_animal/hostile/poison/giant_spider/hunter"));
		}
		yield* new_(T("/obj/effect/decal/remains/human"), (_T_3 = pick_n_take(empty_shuttle_turfs)));
		yield* new_(T("/obj/item/clothing/shoes/space_ninja"), _T_3);
		yield* new_(T("/obj/item/clothing/mask/balaclava"), _T_3);
		rt.forRange(f, 0, 1, 5, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* new_(T("/obj/structure/spider/stickyweb"), (_T_3 = pick_n_take(empty_shuttle_turfs)));
		}
		rt.endFor(f, 0);
	} else if (this.dispatch_type === ANTIDOTE_NEEDED) {
		virus_type = pick(T("/datum/disease/beesease"), T("/datum/disease/brainrot"), T("/datum/disease/fluspanish"));
		_T_3 = null;
		i = 0;
		while (i < 10) {
			if (prob(15)) {
				shuttle_spawns.Add(T("/obj/item/weapon/reagent_containers/glass/bottle"));
			} else if (prob(15)) {
				shuttle_spawns.Add(T("/obj/item/weapon/reagent_containers/syringe"));
			} else if (prob(25)) {
				shuttle_spawns.Add(T("/obj/item/weapon/shard"));
			}
			_T_3 = pick_n_take(empty_shuttle_turfs);
			b = (yield* new_(T("/obj/effect/decal/cleanable/blood"), _T_3));
			(D = (yield* new_(virus_type))).longevity = 1000;
			b.viruses += D;
			D.holder = b;
			i++;
		}
		shuttle_spawns.Add(T("/obj/structure/closet/crate"));
		shuttle_spawns.Add(T("/obj/item/weapon/reagent_containers/glass/bottle/pierrot_throat"));
		shuttle_spawns.Add(T("/obj/item/weapon/reagent_containers/glass/bottle/magnitis"));
	} else if (this.dispatch_type === DEPARTMENT_RESUPPLY) {
		crate_types = list(T("/datum/supply_pack/emergency/equipment"), T("/datum/supply_pack/security/supplies"), T("/datum/supply_pack/organic/food"), T("/datum/supply_pack/emergency/weedcontrol"), T("/datum/supply_pack/engineering/tools"), T("/datum/supply_pack/engineering/engiequipment"), T("/datum/supply_pack/science/robotics"), T("/datum/supply_pack/science/plasma"), T("/datum/supply_pack/medical/supplies"));
		for (crate of each(crate_types)) {
			yield* (pack_4 = rt.index(GLOB.SSshuttle.supply_packs, crate)).generate(pick_n_take(empty_shuttle_turfs));
		}
		rt.forRange(f, 0, 1, 5, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_3 = $e;
			decal = pick(T("/obj/effect/decal/cleanable/flour"), T("/obj/effect/decal/cleanable/robot_debris"), T("/obj/effect/decal/cleanable/oil"));
			yield* new_(decal, pick_n_take(empty_shuttle_turfs));
		}
		rt.endFor(f, 0);
	} else if (this.dispatch_type === PIZZA_DELIVERY) {
		shuttle_spawns.Add(T("/obj/item/pizzabox/margherita"));
		shuttle_spawns.Add(T("/obj/item/pizzabox/margherita"));
		shuttle_spawns.Add(T("/obj/item/pizzabox/meat"));
		shuttle_spawns.Add(T("/obj/item/pizzabox/meat"));
		shuttle_spawns.Add(T("/obj/item/pizzabox/vegetable"));
		if (prob(10)) {
			shuttle_spawns.Add(T("/obj/item/pizzabox/bomb"));
		} else {
			shuttle_spawns.Add(T("/obj/item/pizzabox/margherita"));
		}
	}
	let false_positive: Value = 0;
	while (rt.len(f, shuttle_spawns) && rt.len(f, empty_shuttle_turfs)) {
		if (rt.len(f, (_T_3 = pick_n_take(empty_shuttle_turfs)).contents) && false_positive < 5) {
			false_positive++;
			continue;
		}
		spawn_type = pick_n_take(shuttle_spawns);
		yield* new_(spawn_type, _T_3);
	}
	return f.dot;
}, true);
