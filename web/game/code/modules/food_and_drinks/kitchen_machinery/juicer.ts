// Based on /tg/station's code/modules/food_and_drinks/kitchen_machinery/juicer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add, subtract, fmt } = rt;


rt.type(10896, "/obj/machinery/juicer", "/obj/machinery", {
	beaker: null,
	anchored: 0,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 100,
	pass_flags: 1,
	name: "juicer",
	desc: "a centrifugal juicer with two speeds: Juice and Separate.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "juicer1",
	layer: 2.9,
	density: 1,
}, { global: { allowed_items: 764 } });

// juicer.dm:33
rt.def("/obj/machinery/juicer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.beaker = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/large"), this));
	return f.dot;
}, true);

// juicer.dm:37
rt.def("/obj/machinery/juicer/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = "juicer" + num2text((this.beaker !== null ? 1 : 0));
	return f.dot;
});

// juicer.dm:42
rt.def("/obj/machinery/juicer/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (yield* this.default_unfasten_wrench(user, O)) {
		return f.dot;
	}
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers/glass")) || rt.istype(O, T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"))) {
		if (this.beaker) {
			return 1;
		} else {
			if (!(yield* user.transferItemToLoc(O, this))) {
				to_chat(user, fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [O, this]));
				return 0;
			}
			this.beaker = O;
			rt.modField(f, this, "verbs", P("/obj/machinery/juicer/verb/detach"), add);
			yield* this.update_icon();
			yield* this.updateUsrDialog();
			return 0;
		}
	}
	if (!is_type_in_list(O, GLOB.allowed_items)) {
		to_chat(user, "This object contains no fluid or extractable reagents.");
		return 1;
	}
	if (!(yield* user.transferItemToLoc(O, this))) {
		to_chat(user, fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [O, this]));
		return 0;
	}
	yield* this.updateUsrDialog();
	return 0;
}, true);

// juicer.dm:67
rt.def("/obj/machinery/juicer/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// juicer.dm:73
rt.def("/obj/machinery/juicer/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* user.set_machine(this);
	yield* this.interact(user);
	return f.dot;
}, true);

// juicer.dm:79
rt.def("/obj/machinery/juicer/proc/interact", function interact(f: Frame, user: Value) {
	let i: Value = null, O: Value = null;
	let is_chamber_empty: Value = 0;
	let is_beaker_ready: Value = 0;
	let processing_chamber: Value = "";
	let beaker_contents: Value = "";
	for (i of each(GLOB.allowed_items)) {
		O = null;
		for (O of each(this.contents, T("/obj/item"))) {
			if (!rt.op(f, "IsType", [], [O, i])) {
				continue;
			}
			processing_chamber += `some <B>${O}</B><BR>`;
			break;
		}
	}
	if (!processing_chamber) {
		is_chamber_empty = 1;
		processing_chamber = "Nothing.";
	}
	if (!this.beaker) {
		beaker_contents = fmt("＄！ has no container attached.", [this]);
	} else if (!this.beaker.reagents.total_volume) {
		beaker_contents = fmt("＄！ has an empty ＀ attached.", [this, this.beaker]);
		is_beaker_ready = 1;
	} else if (this.beaker.reagents.total_volume < this.beaker.reagents.maximum_volume) {
		beaker_contents = fmt("＄！ has a partially filled ＀ attached.", [this, this.beaker]);
		is_beaker_ready = 1;
	} else {
		beaker_contents = fmt("＄！ has a completly filled ＀ attached!", [this, this.beaker]);
	}
	let dat: Value = `\n<b>Processing chamber contains:</b><br>\n${processing_chamber}<br>\n${beaker_contents}<hr>\n`;
	if (is_beaker_ready && !is_chamber_empty && !rt.bitAnd(this.stat, 3)) {
		dat += fmt("<A href='?src=＃;action=juice'>Turn on!<BR>", [this]);
	}
	if (this.beaker) {
		dat += fmt("<A href='?src=＃;action=detach'>Detach the container!<BR>", [this]);
	}
	rt.op(f, "Browse", [], [user, `<HEAD><TITLE>Juicer</TITLE></HEAD><TT>${dat}</TT>`, "window=juicer"], false);
	onclose(user, "juicer");
	return f.dot;
});

// juicer.dm:117
rt.def("/obj/machinery/juicer/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	const item = rt.at(href_list, "action");
	if (item === "juice") {
		yield* this.juice();
	} else if (item === "detach") {
		yield* this.detach();
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// juicer.dm:133
rt.def("/obj/machinery/juicer/verb/detach", function detach(f: Frame) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	if (!this.beaker) {
		return f.dot;
	}
	(rt.modField(f, this, "verbs", P("/obj/machinery/juicer/verb/detach"), subtract));
	this.beaker.loc = this.loc;
	this.beaker = null;
	this.update_icon();
	return f.dot;
}, false, { verb: { name: "Detach container from the juicer", category: "Object", src: 3, range: 1 } });

// juicer.dm:143
rt.def("/obj/machinery/juicer/proc/get_juice_id", function get_juice_id(f: Frame, O: Value) {
	let i: Value = null;
	for (i of each(GLOB.allowed_items)) {
		if (rt.op(f, "IsType", [], [O, i])) {
			return rt.index(GLOB.allowed_items, i);
		}
	}
	return f.dot;
});

// juicer.dm:148
rt.def("/obj/machinery/juicer/proc/get_juice_amount", function get_juice_amount(f: Frame, O: Value) {
	if (!rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks/grown")) || !O.seed) {
		return 5;
	} else if (O.seed.potency == -1) {
		return 5;
	} else {
		return round(5 * rt.op(f, "Sqrt", [], [O.seed.potency]));
	}
});

// juicer.dm:156
rt.def("/obj/machinery/juicer/proc/juice", function* juice(f: Frame) {
	let O: Value = null, r_id: Value = null;
	yield* this.power_change();
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!this.beaker || this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
		return f.dot;
	}
	playsound(this.loc, rt.rsc("sound/machines/juicer.ogg"), 50, 1);
	for (O of each(this.contents, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		r_id = this.get_juice_id(O);
		yield* this.beaker.reagents.add_reagent(r_id, this.get_juice_amount(O));
		yield* qdel(O);
		if (this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
			break;
		}
	}
	return f.dot;
}, true);

rt.type(12279, "/obj/structure/closet/crate/juice", "/obj/structure/closet/crate", {});

// juicer.dm:170
rt.def("/obj/structure/closet/crate/juice/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/machinery/juicer"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/grapes"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/grapes"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/grapes"), this);
	return f.dot;
}, true);
