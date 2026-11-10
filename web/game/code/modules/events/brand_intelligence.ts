// Based on /tg/station's code/modules/events/brand_intelligence.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(292, "/datum/round_event/brand_intelligence", "/datum/round_event", {
	vendingMachines: null,
	infectedMachines: null,
	originMachine: null,
	rampant_speeches: null,
	announceWhen: 21,
	endWhen: 1000,
});

// brand_intelligence.dm:12
rt.def("/datum/round_event/brand_intelligence/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.vendingMachines = list();

	this.infectedMachines = list();
	this.rampant_speeches = list("Try our aggressive new marketing strategies!", "You should buy products to feed your lifestyle obession!", "Consume!", "Your money can buy happiness!", "Engage direct marketing!", "Advertising is legalized lying! But don't let that put you off our great deals!", "You don't want to buy anything? Yeah, well I didn't want to buy your mom either.");
	return f.dot;
});

// brand_intelligence.dm:25
rt.def("/datum/round_event/brand_intelligence/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(fmt("Rampant brand intelligence has been detected aboard ＀, please stand-by. The origin is believed to be ＇！.", [station_name(), this.originMachine.name]), "Machine Learning Alert");
	return f.dot;
}, true);

// brand_intelligence.dm:29
rt.def("/datum/round_event/brand_intelligence/proc/start", function start(f: Frame) {
	let V: Value = null;
	for (V of each(GLOB.machines, T("/obj/machinery/vending"))) {
		if (V.z != ZLEVEL_STATION) {
			continue;
		}
		this.vendingMachines.Add(V);
	}
	if (!rt.len(f, this.vendingMachines)) {
		this.kill();
		return f.dot;
	}
	this.originMachine = pick(this.vendingMachines);
	this.vendingMachines.Remove(this.originMachine);
	this.originMachine.shut_up = 0;
	this.originMachine.shoot_inventory = 1;
	return f.dot;
});

// brand_intelligence.dm:43
rt.def("/datum/round_event/brand_intelligence/proc/tick", function* tick(f: Frame) {
	let saved: Value = null, upriser: Value = null, M: Value = null;
	if (!this.originMachine || !this.originMachine || this.originMachine.gc_destroyed || this.originMachine.shut_up || this.originMachine.wires.is_all_cut()) {
		for (saved of each(this.infectedMachines, T("/obj/machinery/vending"))) {
			saved.shoot_inventory = 0;
		}
		if (this.originMachine) {
			yield* this.originMachine.speak("I am... vanquished. My people will remem...ber...meeee.");
			this.originMachine.visible_message(`${this.originMachine} beeps and seems lifeless.`);
		}
		this.kill();
		return f.dot;
	}
	this.vendingMachines = removeNullsFromList(this.vendingMachines);
	if (!rt.len(f, this.vendingMachines)) {
		for (upriser of each(this.infectedMachines, T("/obj/machinery/vending"))) {
			if (prob(70) && !(!upriser || upriser.gc_destroyed)) {
				(M = (yield* new_(T("/mob/living/simple_animal/hostile/mimic/copy"), upriser.loc, upriser, null, 1))).faction = list("profit");
				M.speak = (yield* this.rampant_speeches.Copy());
				M.speak_chance = 7;
			} else {
				yield* explosion(upriser.loc, -1, 1, 2, 4, 0);
				yield* qdel(upriser);
			}
		}
		this.kill();
		return f.dot;
	}
	if (!IsMultiple(this.activeFor, 4)) return f.dot;
	let rebel: Value = pick(this.vendingMachines);
	yield* this.vendingMachines.Remove(rebel);
	this.infectedMachines.Add(rebel);
	rebel.shut_up = 0;
	rebel.shoot_inventory = 1;
	if (!IsMultiple(this.activeFor, 8)) return f.dot;
	yield* this.originMachine.speak(pick(this.rampant_speeches));
	return f.dot;
}, true);
