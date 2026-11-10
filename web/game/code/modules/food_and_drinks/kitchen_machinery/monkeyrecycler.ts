// Based on /tg/station's code/modules/food_and_drinks/kitchen_machinery/monkeyrecycler.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10898, "/obj/machinery/monkey_recycler", "/obj/machinery", {
	grinded: 0,
	required_grind: 5,
	cube_production: 1,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 50,
	name: "monkey recycler",
	desc: "A machine used for recycling dead monkeys into monkey cubes. It currently produces 1 cube for every 5 monkeys inserted.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "grinder",
	layer: 2.9,
	density: 1,
});

// monkeyrecycler.dm:18
rt.def("/obj/machinery/monkey_recycler/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/monkey_recycler"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6751, "/obj/item/weapon/circuitboard/machine/monkey_recycler", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Monkey Recycler (Machine Board)",
	build_path: rt.typePath("/obj/machinery/monkey_recycler"),
	origin_tech: "programming=1;biotech=2",
});

// monkeyrecycler.dm:26
rt.def("/obj/item/weapon/circuitboard/machine/monkey_recycler/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]);
	return f.dot;
});

// monkeyrecycler.dm:33
rt.def("/obj/machinery/monkey_recycler/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null, M: Value = null;
	let req_grind: Value = 5;
	let cubes_made: Value = 1;
	for (B of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		req_grind -= B.rating;
	}
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		cubes_made = M.rating;
	}
	this.cube_production = cubes_made;
	this.required_grind = req_grind;
	this.desc = `A machine used for recycling dead monkeys into monkey cubes. It currently produces ${cubes_made} cube(s) for every ${this.required_grind} monkey(s) inserted.`;
	return f.dot;
});

// monkeyrecycler.dm:42
rt.def("/obj/machinery/monkey_recycler/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, "grinder_open", "grinder", O)) {
		return f.dot;
	}
	if (yield* this.exchange_parts(user, O)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(O)) {
		return f.dot;
	}
	if (yield* this.default_unfasten_wrench(user, O)) {
		yield* this.power_change();
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(O)) {
		return f.dot;
	}
	if (this.stat) {
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
}, true);

// monkeyrecycler.dm:64
rt.def("/obj/machinery/monkey_recycler/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	if (!rt.istype(target, T("/mob/living"))) {
		return f.dot;
	}
	if (!rt.istype(target, T("/mob/living/carbon/monkey"))) return f.dot;
	yield* this.stuff_monkey_in(target, user);
	return f.dot;
}, true);

// monkeyrecycler.dm:70
rt.def("/obj/machinery/monkey_recycler/proc/stuff_monkey_in", function* stuff_monkey_in(f: Frame, target: Value, user: Value) {
	if (!rt.istype(target, T("/mob/living/carbon/monkey"))) {
		return f.dot;
	}
	if (target.stat == 0) {
		to_chat(user, "<span class='warning'>The monkey is struggling far too much to put it in the recycler.</span>");
		return f.dot;
	}
	if (target.buckled || target.has_buckled_mobs()) {
		to_chat(user, "<span class='warning'>The monkey is attached to something.</span>");
		return f.dot;
	}
	yield* qdel(target);
	to_chat(user, "<span class='notice'>You stuff the monkey into the machine.</span>");
	playsound(this.loc, rt.rsc("sound/machines/juicer.ogg"), 50, 1);
	let offset: Value = prob(50) ? -2 : 2;
	rt.op(f, "Animate", [2, 8], [null, this, "pixel_x", this.pixel_x + offset, "time", 0.2, "loop", 200]);
	yield* this.use_power(500);
	this.grinded++;
	yield* sleep(50);
	this.pixel_x = rt.initial(f, this, "pixel_x");
	to_chat(user, fmt("<span class='notice'>The machine now has ＀ monkey５ worth of material stored.</span>", [this.grinded]));
	return f.dot;
}, true);

// monkeyrecycler.dm:91
rt.def("/obj/machinery/monkey_recycler/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let i: Value = null;
	if (this.stat != 0) {
		return f.dot;
	}
	if (this.grinded >= this.required_grind) {
		to_chat(user, "<span class='notice'>The machine hisses loudly as it condenses the grinded monkey meat. After a moment, it dispenses a brand new monkey cube.</span>");
		playsound(this.loc, rt.rsc("sound/machines/hiss.ogg"), 50, 1);
		this.grinded -= this.required_grind;
		i = 0;
		while (i < this.cube_production) {
			yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"), this.loc);
			i++;
		}
		to_chat(user, `<span class='notice'>The machine's display flashes that it has ${this.grinded} monkeys worth of material left.</span>`);
	} else {
		to_chat(user, `<span class='danger'>The machine needs at least ${this.required_grind} monkey(s) worth of material to produce a monkey cube. It only has ${this.grinded}.</span>`);
	}
	return f.dot;
}, true);
