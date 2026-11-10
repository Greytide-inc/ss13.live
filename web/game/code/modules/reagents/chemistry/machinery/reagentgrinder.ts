// Based on /tg/station's code/modules/reagents/chemistry/machinery/reagentgrinder.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(10981, "/obj/machinery/reagentgrinder", "/obj/machinery", {
	operating: 0,
	beaker: null,
	limit: 10,
	holdingitems: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 100,
	pass_flags: 1,
	name: "All-In-One Grinder",
	desc: "From BlenderTech. Will It Blend? Let's test it out!",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "juicer1",
	layer: 2.9,
	resistance_flags: 32,
}, { global: { blend_items: 767, juice_items: 768, dried_items: 769 } });

// reagentgrinder.dm:83
rt.def("/obj/machinery/reagentgrinder/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.holdingitems = list();
	return f.dot;
});

// reagentgrinder.dm:86
rt.def("/obj/machinery/reagentgrinder/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.beaker = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/large"), this));
	this.beaker.desc += " May contain blended dust. Don't breathe this in!";
	return f.dot;
}, true);

// reagentgrinder.dm:91
rt.def("/obj/machinery/reagentgrinder/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.beaker);
	this.beaker = null;
	return (yield* parent_proc());
}, true);

// reagentgrinder.dm:96
rt.def("/obj/machinery/reagentgrinder/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	if (!this.beaker) return f.dot;
	this.beaker.ex_act(severity, target);
	return f.dot;
});

// reagentgrinder.dm:99
rt.def("/obj/machinery/reagentgrinder/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	yield* parent_proc();
	if (A != this.beaker) return f.dot;
	this.beaker = null;
	yield* this.update_icon();
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// reagentgrinder.dm:106
rt.def("/obj/machinery/reagentgrinder/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 3);
	yield* qdel(this);
	return f.dot;
}, true);

// reagentgrinder.dm:111
rt.def("/obj/machinery/reagentgrinder/proc/update_icon", function update_icon(f: Frame) {
	if (this.beaker) {
		this.icon_state = "juicer1";
	} else {
		this.icon_state = "juicer0";
	}
	return f.dot;
});

// reagentgrinder.dm:116
rt.def("/obj/machinery/reagentgrinder/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let G: Value = null, B: Value = null, G_1: Value = null;
	if (yield* this.default_unfasten_wrench(user, I)) {
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers")) && rt.bitAnd(I.container_type, OPENCONTAINER)) {
		if (!this.beaker) {
			if (!(yield* user.drop_item())) {
				return 1;
			}
			this.beaker = I;
			this.beaker.loc = this;
			yield* this.update_icon();
			yield* this.updateUsrDialog();
		} else {
			to_chat(user, "<span class='warning'>There's already a container inside.</span>");
		}
		return 1;
	}
	if (is_type_in_list(I, GLOB.dried_items)) {
		if (rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks/grown"))) {
			if (!(G = I).dry) {
				to_chat(user, "<span class='warning'>You must dry that first!</span>");
				return 1;
			}
		}
	}
	if (this.holdingitems && rt.len(f, this.holdingitems) >= this.limit) {
		to_chat(f.usr, "The machine cannot hold anymore items.");
		return 1;
	}
	if (rt.istype(I, T("/obj/item/weapon/storage/bag"))) {
		B = I;
		for (G_1 of each(B.contents, T("/obj/item/weapon/reagent_containers/food/snacks/grown"))) {
			yield* B.remove_from_storage(G_1, this);
			if ((this.holdingitems += G_1) && rt.len(f, this.holdingitems) >= this.limit) {
				to_chat(user, "<span class='notice'>You fill the All-In-One grinder to the brim.</span>");
				break;
			}
		}
		if (!rt.len(f, I.contents)) {
			to_chat(user, "<span class='notice'>You empty the plant bag into the All-In-One grinder.</span>");
		}
		yield* this.updateUsrDialog();
		return 1;
	}
	if (!is_type_in_list(I, GLOB.blend_items) && !is_type_in_list(I, GLOB.juice_items)) {
		if (user.a_intent == "harm") {
			return (yield* parent_proc());
		}
		to_chat(user, "<span class='warning'>Cannot refine into a reagent!</span>");
		return 1;
	}
	if (!(yield* user.drop_item())) return f.dot;
	I.loc = this;
	this.holdingitems += I;
	yield* this.updateUsrDialog();
	return 0;
}, true);

// reagentgrinder.dm:172
rt.def("/obj/machinery/reagentgrinder/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// reagentgrinder.dm:178
rt.def("/obj/machinery/reagentgrinder/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* user.set_machine(this);
	yield* this.interact(user);
	return f.dot;
}, true);

// reagentgrinder.dm:184
rt.def("/obj/machinery/reagentgrinder/proc/interact", function* interact(f: Frame, user: Value) {
	let O: Value = null, anything: Value = null, R: Value = null, popup: Value = null;
	let is_chamber_empty: Value = 0;
	let is_beaker_ready: Value = 0;
	let processing_chamber: Value = "";
	let beaker_contents: Value = "";
	let dat: Value = "";
	if (!this.operating) {
		for (O of each(this.holdingitems, T("/obj/item"))) {
			processing_chamber += fmt("＆！<BR>", [O.name]);
		}
		if (!processing_chamber) {
			is_chamber_empty = 1;
			processing_chamber = "Nothing.";
		}
		if (!this.beaker) {
			beaker_contents = "<B>No beaker attached.</B><br>";
		} else {
			is_beaker_ready = 1;
			beaker_contents = "<B>The beaker contains:</B><br>";
			anything = 0;
			for (R of each(this.beaker.reagents.reagent_list, T("/datum/reagent"))) {
				anything = 1;
				beaker_contents += `${R.volume} - ${R.name}<br>`;
			}
			if (!anything) {
				beaker_contents += "Nothing<br>";
			}
		}
		dat = `\n\t\t<b>Processing chamber contains:</b><br>\n\t\t${processing_chamber}<br>\n\t\t${beaker_contents}<hr>\n\t\t`;
		if (is_beaker_ready) {
			if (!is_chamber_empty && !rt.bitAnd(this.stat, 3)) {
				dat += fmt("<A href='?src=＃;action=grind'>Grind the reagents</a><BR>", [this]);
				dat += fmt("<A href='?src=＃;action=juice'>Juice the reagents</a><BR><BR>", [this]);
			} else if (this.beaker.reagents.total_volume) {
				dat += fmt("<A href='?src=＃;action=mix'>Mix the reagents</a><BR><BR>", [this]);
			}
		}
		if (this.holdingitems && rt.len(f, this.holdingitems) > 0) {
			dat += fmt("<A href='?src=＃;action=eject'>Eject the reagents</a><BR>", [this]);
		}
		if (this.beaker) {
			dat += fmt("<A href='?src=＃;action=detach'>Detach the beaker</a><BR>", [this]);
		}
	} else {
		dat += "Please wait...";
	}
	(popup = (yield* new_(T("/datum/browser"), user, "reagentgrinder", "All-In-One Grinder"))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open(1);
	return f.dot;
}, true);

// reagentgrinder.dm:233
rt.def("/obj/machinery/reagentgrinder/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	if (this.operating) {
		yield* this.updateUsrDialog();
		return f.dot;
	}
	const item = rt.at(href_list, "action");
	if (item === "grind") {
		yield* this.grind();
	} else if (item === "juice") {
		yield* this.juice();
	} else if (item === "mix") {
		yield* this.mix();
	} else if (item === "eject") {
		yield* this.eject();
	} else if (item === "detach") {
		yield* this.detach();
	}
	return f.dot;
}, true);

// reagentgrinder.dm:253
rt.def("/obj/machinery/reagentgrinder/proc/detach", function* detach(f: Frame) {
	if (f.usr.stat != 0) {
		return f.dot;
	}
	if (!this.beaker) {
		return f.dot;
	}
	this.beaker.loc = this.loc;
	this.beaker = null;
	yield* this.update_icon();
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// reagentgrinder.dm:264
rt.def("/obj/machinery/reagentgrinder/proc/eject", function* eject(f: Frame) {
	let O: Value = null;
	if (f.usr.stat != 0) {
		return f.dot;
	}
	if (this.holdingitems && rt.len(f, this.holdingitems) == 0) {
		return f.dot;
	}
	for (O of each(this.holdingitems, T("/obj/item"))) {
		O.loc = this.loc;
		this.holdingitems -= O;
	}
	this.holdingitems = list();
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// reagentgrinder.dm:282
rt.def("/obj/machinery/reagentgrinder/proc/get_allowed_by_id", function get_allowed_by_id(f: Frame, O: Value) {
	let i: Value = null;
	for (i of each(GLOB.blend_items)) {
		if (rt.op(f, "IsType", [], [O, i])) {
			return rt.index(GLOB.blend_items, i);
		}
	}
	return f.dot;
});

// reagentgrinder.dm:287
rt.def("/obj/machinery/reagentgrinder/proc/get_allowed_snack_by_id", function get_allowed_snack_by_id(f: Frame, O: Value) {
	let i: Value = null;
	for (i of each(GLOB.blend_items)) {
		if (rt.op(f, "IsType", [], [O, i])) {
			return rt.index(GLOB.blend_items, i);
		}
	}
	return f.dot;
});

// reagentgrinder.dm:292
rt.def("/obj/machinery/reagentgrinder/proc/get_allowed_juice_by_id", function get_allowed_juice_by_id(f: Frame, O: Value) {
	let i: Value = null;
	for (i of each(GLOB.juice_items)) {
		if (rt.op(f, "IsType", [], [O, i])) {
			return rt.index(GLOB.juice_items, i);
		}
	}
	return f.dot;
});

// reagentgrinder.dm:305
rt.def("/obj/machinery/reagentgrinder/proc/get_juice_amount", function get_juice_amount(f: Frame, O: Value) {
	if (!rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks/grown")) || !O.seed) {
		return 5;
	} else if (O.seed.potency == -1) {
		return 5;
	} else {
		return round(5 * rt.op(f, "Sqrt", [], [O.seed.potency]));
	}
});

// reagentgrinder.dm:313
rt.def("/obj/machinery/reagentgrinder/proc/remove_object", function* remove_object(f: Frame, O: Value) {
	this.holdingitems -= O;
	yield* qdel(O);
	return f.dot;
}, true);

// reagentgrinder.dm:317
rt.def("/obj/machinery/reagentgrinder/proc/juice", function* juice(f: Frame) {
	let O: Value = null, allowed: Value = null, r_id: Value = null, space: Value = null, amount: Value = null;
	let $e: any;
	yield* this.power_change();
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!this.beaker || this.beaker && this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
		return f.dot;
	}
	playsound(this.loc, rt.rsc("sound/machines/juicer.ogg"), 20, 1);
	let offset: Value = prob(50) ? -2 : 2;
	rt.op(f, "Animate", [2, 8], [null, this, "pixel_x", this.pixel_x + offset, "time", 0.2, "loop", 250]);
	this.operating = 1;
	yield* this.updateUsrDialog();
	rt.spawnTail(f, 50, "/obj/machinery/reagentgrinder/proc/juice: spawn at modules/reagents/chemistry/machinery/reagentgrinder.dm:327", offset, O, allowed, r_id, space, amount);
	for (O of each(this.holdingitems, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		if (this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
			break;
		}
		if ((allowed = this.get_allowed_juice_by_id(O)) === null) {
			break;
		}
		r_id = null;
		for (r_id of each(allowed)) {
			space = this.beaker.reagents.maximum_volume - this.beaker.reagents.total_volume;
			amount = this.get_juice_amount(O);
			yield* this.beaker.reagents.add_reagent(r_id, min(amount, space));
			if (this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
				break;
			}
		}
		yield* this.remove_object(O);
	}
	return f.dot;
}, true);

// a spawn(50) body of /obj/machinery/reagentgrinder/proc/juice, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/reagentgrinder/proc/juice: spawn at modules/reagents/chemistry/machinery/reagentgrinder.dm:327", function* (f: Frame, offset: Value, O: Value, allowed: Value, r_id: Value, space: Value, amount: Value) {
	this.pixel_x = rt.initial(f, this, "pixel_x");
	this.operating = 0;
	yield* this.updateUsrDialog();
	return null;
});

// reagentgrinder.dm:355
rt.def("/obj/machinery/reagentgrinder/proc/grind", function* grind(f: Frame) {
	let O: Value = null, allowed: Value = null, r_id: Value = null, space: Value = null, amount: Value = null, i: Value = null, r_id_4: Value = null, space_5: Value = null, amount_6: Value = null, space_2: Value = null, amount_3: Value = null, amount_2: Value = null, r_id_2: Value = null, space_3: Value = null;
	let $e: any;
	yield* this.power_change();
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!this.beaker || this.beaker && this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
		return f.dot;
	}
	playsound(this.loc, rt.rsc("sound/machines/blender.ogg"), 50, 1);
	let offset: Value = prob(50) ? -2 : 2;
	rt.op(f, "Animate", [2, 8], [null, this, "pixel_x", this.pixel_x + offset, "time", 0.2, "loop", 250]);
	this.operating = 1;
	yield* this.updateUsrDialog();
	rt.spawnTail(f, 60, "/obj/machinery/reagentgrinder/proc/grind: spawn at modules/reagents/chemistry/machinery/reagentgrinder.dm:365", offset, O, allowed, r_id, space, amount, i, r_id_4, space_5, amount_6, space_2, amount_3, amount_2, r_id_2, space_3);
	for (O of each(this.holdingitems, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		if (this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
			break;
		}
		if ((allowed = this.get_allowed_snack_by_id(O)) === null) {
			break;
		}
		r_id = null;
		for (r_id of each(allowed)) {
			space = this.beaker.reagents.maximum_volume - this.beaker.reagents.total_volume;
			if ((amount = rt.index(allowed, r_id)) <= 0) {
				if (amount == 0) {
					if (O.reagents !== null && O.reagents.has_reagent("nutriment")) {
						yield* this.beaker.reagents.add_reagent(r_id, min(O.reagents.get_reagent_amount("nutriment"), space));
						yield* O.reagents.remove_reagent("nutriment", min(O.reagents.get_reagent_amount("nutriment"), space));
					}
				} else if (O.reagents !== null && O.reagents.has_reagent("nutriment")) {
					yield* this.beaker.reagents.add_reagent(r_id, min(round(O.reagents.get_reagent_amount("nutriment") * rt.op(f, "Abs", [], [amount])), space));
					yield* O.reagents.remove_reagent("nutriment", min(O.reagents.get_reagent_amount("nutriment"), space));
				}
			} else {
				yield* O.reagents.trans_id_to(this.beaker, r_id, min(amount, space));
			}
			if (this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
				break;
			}
		}
		if (rt.len(f, O.reagents.reagent_list) == 0) {
			yield* this.remove_object(O);
		}
	}
	O = null;
	for (O of each(this.holdingitems, T("/obj/item/stack/sheet"))) {
		allowed = this.get_allowed_by_id(O);
		if (this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
			break;
		}
		i = 1;
		while (i <= round(O.amount, 1)) {
			r_id_4 = null;
			for (r_id_4 of each(allowed)) {
				space_5 = this.beaker.reagents.maximum_volume - this.beaker.reagents.total_volume;
				amount_6 = rt.index(allowed, r_id_4);
				yield* this.beaker.reagents.add_reagent(r_id_4, min(amount_6, space_5));
				if (space_5 < amount_6) {
					break;
				}
			}
			if (i == round(O.amount, 1)) {
				yield* this.remove_object(O);
				break;
			}
			i++;
		}
	}
	O = null;
	for (O of each(this.holdingitems, T("/obj/item/weapon/grown"))) {
		if (this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
			break;
		}
		allowed = this.get_allowed_by_id(O);
		r_id = null;
		for (r_id of each(allowed)) {
			space = this.beaker.reagents.maximum_volume - this.beaker.reagents.total_volume;
			if ((amount = rt.index(allowed, r_id)) == 0) {
				if (O.reagents !== null && O.reagents.has_reagent(r_id)) {
					yield* this.beaker.reagents.add_reagent(r_id, min(O.reagents.get_reagent_amount(r_id), space));
				}
			} else {
				yield* this.beaker.reagents.add_reagent(r_id, min(amount, space));
			}
			if (this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
				break;
			}
		}
		yield* this.remove_object(O);
	}
	O = null;
	for (O of each(this.holdingitems, T("/obj/item/slime_extract"))) {
		if (this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
			break;
		}
		space_2 = this.beaker.reagents.maximum_volume - this.beaker.reagents.total_volume;
		if (O.reagents !== null) {
			amount_3 = O.reagents.total_volume;
			yield* O.reagents.trans_to(this.beaker, min(amount_3, space_2));
		}
		if (O.Uses > 0) {
			yield* this.beaker.reagents.add_reagent("slimejelly", min(20, space_2));
		}
		yield* this.remove_object(O);
	}
	O = null;
	for (O of each(this.holdingitems, T("/obj/item/weapon/reagent_containers"))) {
		if (this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
			break;
		}
		amount_2 = O.reagents.total_volume;
		yield* O.reagents.trans_to(this.beaker, amount_2);
		if (!O.reagents.total_volume) {
			yield* this.remove_object(O);
		}
	}
	O = null;
	for (O of each(this.holdingitems, T("/obj/item/toy/crayon"))) {
		if (this.beaker.reagents.total_volume >= this.beaker.reagents.maximum_volume) {
			break;
		}
		r_id_2 = null;
		for (r_id_2 of each(O.reagent_contents)) {
			if ((space_3 = this.beaker.reagents.maximum_volume - this.beaker.reagents.total_volume) == 0) {
				break;
			}
			yield* this.beaker.reagents.add_reagent(r_id_2, min(rt.index(O.reagent_contents, r_id_2), space_3));
			yield* this.remove_object(O);
		}
	}
	return f.dot;
}, true);

// a spawn(60) body of /obj/machinery/reagentgrinder/proc/grind, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/reagentgrinder/proc/grind: spawn at modules/reagents/chemistry/machinery/reagentgrinder.dm:365", function* (f: Frame, offset: Value, O: Value, allowed: Value, r_id: Value, space: Value, amount: Value, i: Value, r_id_4: Value, space_5: Value, amount_6: Value, space_2: Value, amount_3: Value, amount_2: Value, r_id_2: Value, space_3: Value) {
	this.pixel_x = rt.initial(f, this, "pixel_x");
	this.operating = 0;
	yield* this.updateUsrDialog();
	return null;
});

// reagentgrinder.dm:469
rt.def("/obj/machinery/reagentgrinder/proc/mix", function* mix(f: Frame) {
	yield* this.power_change();
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!this.beaker) {
		return f.dot;
	}
	playsound(this.loc, rt.rsc("sound/machines/juicer.ogg"), 20, 1);
	let offset: Value = prob(50) ? -2 : 2;
	rt.op(f, "Animate", [2, 8], [null, this, "pixel_x", this.pixel_x + offset, "time", 0.2, "loop", 250]);
	this.operating = 1;
	yield* this.updateUsrDialog();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/reagentgrinder/proc/mix_complete"))), 50);
	return f.dot;
}, true);

// reagentgrinder.dm:482
rt.def("/obj/machinery/reagentgrinder/proc/mix_complete", function* mix_complete(f: Frame) {
	this.pixel_x = rt.initial(f, this, "pixel_x");
	this.operating = 0;
	yield* this.updateUsrDialog();
	if (!this.beaker.reagents.total_volume) return f.dot;
	while (this.beaker.reagents.get_reagent_amount("milk") >= 15) {
		yield* this.beaker.reagents.remove_reagent("milk", 15);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/butter"), this.loc);
	}
	if (!this.beaker.reagents.has_reagent("eggyolk")) return f.dot;
	let amount: Value = this.beaker.reagents.get_reagent_amount("eggyolk");
	yield* this.beaker.reagents.remove_reagent("eggyolk", amount);
	yield* this.beaker.reagents.add_reagent("mayonnaise", amount);
	return f.dot;
}, true);
