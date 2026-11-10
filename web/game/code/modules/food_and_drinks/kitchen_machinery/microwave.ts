// Based on /tg/station's code/modules/food_and_drinks/kitchen_machinery/microwave.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(10897, "/obj/machinery/microwave", "/obj/machinery", {
	operating: 0,
	dirty: 0,
	broken: 0,
	max_n_of_items: 10,
	efficiency: 0,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 100,
	name: "microwave oven",
	desc: "Cooks and boils stuff.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "mw",
	layer: 2.9,
	density: 1,
});

// microwave.dm:25
rt.def("/obj/machinery/microwave/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* this.create_reagents(100);
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/microwave"), null))).apply_default_parts(this);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(6750, "/obj/item/weapon/circuitboard/machine/microwave", "/obj/item/weapon/circuitboard/machine", {
	name: "Microwave (Machine Board)",
	build_path: rt.typePath("/obj/machinery/microwave"),
	origin_tech: "programming=2;magnets=2",
	req_components: null,
});

// microwave.dm:34
rt.def("/obj/item/weapon/circuitboard/machine/microwave/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/stack/sheet/glass"), 1]);
	return f.dot;
});

// microwave.dm:44
rt.def("/obj/machinery/microwave/proc/RefreshParts", function RefreshParts(f: Frame) {
	let E: Value = null, M: Value = null;
	let max_items: Value = 10;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/micro_laser"))) {
		E += M.rating;
	}
	M = null;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		max_items = 10 * M.rating;
	}
	this.efficiency = E;
	this.max_n_of_items = max_items;
	return f.dot;
});

// microwave.dm:58
rt.def("/obj/machinery/microwave/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let clean_spray: Value = null, _P: Value = null, _T: Value = null, loaded: Value = null, S: Value = null;
	if (this.operating) {
		return f.dot;
	}
	if (!this.broken && this.dirty < 100) {
		if (this.default_deconstruction_screwdriver(user, "mw-o", "mw", O)) {
			return f.dot;
		}
		if (yield* this.default_unfasten_wrench(user, O)) {
			return f.dot;
		}
		if (yield* this.exchange_parts(user, O)) {
			return f.dot;
		}
	}
	if (yield* this.default_deconstruction_crowbar(O)) {
		return f.dot;
	}
	if (this.broken > 0) {
		if (this.broken == 2 && rt.istype(O, T("/obj/item/weapon/wirecutters"))) {
			user.visible_message(`${user} starts to fix part of the microwave.`, "<span class='notice'>You start to fix part of the microwave...</span>");
			if (yield* do_after(user, 20 * O.toolspeed, { target: this })) {
				user.visible_message(`${user} fixes part of the microwave.`, "<span class='notice'>You fix part of the microwave.</span>");
				this.broken = 1;
			}
		} else if (this.broken == 1 && rt.istype(O, T("/obj/item/weapon/weldingtool"))) {
			user.visible_message(`${user} starts to fix part of the microwave.`, "<span class='notice'>You start to fix part of the microwave...</span>");
			if (yield* do_after(user, 20 * O.toolspeed, { target: this })) {
				user.visible_message(`${user} fixes the microwave.`, "<span class='notice'>You fix the microwave.</span>");
				this.icon_state = "mw";
				this.broken = 0;
				this.dirty = 0;
				this.container_type = OPENCONTAINER;
				return 0;
			}
		} else {
			to_chat(user, "<span class='warning'>It's broken!</span>");
			return 1;
		}
	} else if (rt.istype(O, T("/obj/item/weapon/reagent_containers/spray"))) {
		if ((clean_spray = O).reagents.has_reagent("cleaner", clean_spray.amount_per_transfer_from_this)) {
			yield* clean_spray.reagents.remove_reagent("cleaner", clean_spray.amount_per_transfer_from_this, 1);
			playsound(this.loc, rt.rsc("sound/effects/spray3.ogg"), 50, 1, -6);
			user.visible_message(`${user} has cleaned the microwave.`, "<span class='notice'>You clean the microwave.</span>");
			this.dirty = 0;
			this.broken = 0;
			this.icon_state = "mw";
			this.container_type = OPENCONTAINER;
			yield* this.updateUsrDialog();
			return 1;
		} else {
			to_chat(user, "<span class='warning'>You need more space cleaner!<span>");
			return 1;
		}
	} else if (rt.istype(O, T("/obj/item/weapon/soap"))) {
		_P = O;
		user.visible_message(`${user} starts to clean the microwave.`, "<span class='notice'>You start to clean the microwave...</span>");
		if (yield* do_after(user, _P.cleanspeed, { target: this })) {
			user.visible_message(`${user} has cleaned the microwave.`, "<span class='notice'>You clean the microwave.</span>");
			this.dirty = 0;
			this.broken = 0;
			this.icon_state = "mw";
			this.container_type = OPENCONTAINER;
		}
	} else if (this.dirty == 100) {
		to_chat(user, "<span class='warning'>It's dirty!</span>");
		return 1;
	} else if (rt.istype(O, T("/obj/item/weapon/storage/bag/tray"))) {
		_T = O;
		loaded = 0;
		for (S of each(_T.contents, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
			if (rt.len(f, this.contents) >= this.max_n_of_items) {
				to_chat(user, `<span class='warning'>${this} is full, you can't put anything in!</span>`);
				return 1;
			}
			yield* _T.remove_from_storage(S, this);
			loaded++;
		}
		if (loaded) {
			to_chat(user, `<span class='notice'>You insert ${loaded} items into ${this}.</span>`);
		}
	} else if (O.w_class <= WEIGHT_CLASS_NORMAL && !rt.istype(O, T("/obj/item/weapon/storage")) && user.a_intent == "help") {
		if (rt.len(f, this.contents) >= this.max_n_of_items) {
			to_chat(user, `<span class='warning'>${this} is full, you can't put anything in!</span>`);
			return 1;
		} else {
			if (!(yield* user.drop_item())) {
				to_chat(user, fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [O, this]));
				return 0;
			}
			O.loc = this;
			user.visible_message(fmt("＀ has added ％！ to ％！.", [user, O, this]), fmt("<span class='notice'>You add ％！ to ％！.</span>", [O, this]));
		}
	} else {
		yield* parent_proc();
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// microwave.dm:171
rt.def("/obj/machinery/microwave/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// microwave.dm:177
rt.def("/obj/machinery/microwave/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* user.set_machine(this);
	yield* this.interact(user);
	return f.dot;
}, true);

// microwave.dm:187
rt.def("/obj/machinery/microwave/proc/interact", function* interact(f: Frame, user: Value) {
	let items_counts: Value = null, O: Value = null, S: Value = null, N: Value = null, popup: Value = null;
	if (this.panel_open || !this.anchored) {
		return f.dot;
	}
	let dat: Value = "<div class='statusDisplay'>";
	if (this.broken > 0) {
		dat += "ERROR: 09734014-A2379-D18746 --Bad memory<BR>Contact your operator or use command line to rebase memory ///git checkout {HEAD} -a commit pull --rebase push {*NEW HEAD*}</div>";
	} else if (this.operating) {
		dat += "Microwaving in progress!<BR>Please wait...!</div>";
	} else if (this.dirty == 100) {
		dat += "ERROR: >> 0 --Response input zero<BR>Contact your operator of the device manifactor support.</div>";
	} else {
		items_counts = (yield* new_(T("/list")));
		for (O of each(this.contents, T("/obj"))) {
			if (rt.istype(O, T("/obj/item/stack"))) {
				S = O;
				rt.modAt(items_counts, O.name, S.amount, add);
			} else {
				rt.incAt(items_counts, O.name, 1, true);
			}
		}
		O = null;
		for (O of each(items_counts)) {
			N = rt.index(items_counts, O);
			dat += `${capitalize(O)}: ${N}<BR>`;
		}
		if (rt.len(f, items_counts) == 0) {
			dat += "The microwave is empty.</div>";
		} else {
			dat = `<h3>Ingredients:</h3>${dat}</div>`;
		}
		dat += fmt("<A href='?src=＃;action=cook'>Turn on</A>", [this]);
		dat += fmt("<A href='?src=＃;action=dispose'>Eject ingredients</A><BR>", [this]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "microwave", this.name, 300, 300))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// microwave.dm:225
rt.def("/obj/machinery/microwave/proc/cook", function* cook(f: Frame) {
	let metal: Value = null, O: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	yield* this.start();
	if (prob(max(5 / this.efficiency - 5, this.dirty * 5))) {
		this.muck_start();
		if (!(yield* this.microwaving(4))) {
			yield* this.muck_finish();
			return f.dot;
		}
		yield* this.muck_finish();
		return f.dot;
	} else {
		if (this.has_extra_item() && prob(min(this.dirty * 5, 100)) && !(yield* this.microwaving(4))) {
			yield* this.broke();
			return f.dot;
		}
		if (!(yield* this.microwaving(10))) {
			yield* this.abort();
			return f.dot;
		}
		yield* this.stop();
		metal = 0;
		for (O of each(this.contents, T("/obj/item"))) {
			yield* O.microwave_act(this);
			if (rt.index(O.materials, "$metal")) {
				metal += rt.index(O.materials, "$metal");
			}
		}
		if (metal) {
			this.visible_message(`<span class='warning'>Sparks fly around ${this}!`);
			if (prob(max(metal / 2, 33))) {
				yield* explosion(this.loc, 0, 1, 2);
			}
			yield* this.broke();
			return f.dot;
		}
		yield* this.dropContents();
		return f.dot;
	}
}, true);

// microwave.dm:264
rt.def("/obj/machinery/microwave/proc/microwaving", function* microwaving(f: Frame, seconds: Value) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, seconds, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (rt.bitAnd(this.stat, 3)) {
			return 0;
		}
		yield* this.use_power(500);
		yield* sleep(max(12 - 2 * this.efficiency, 2));
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// microwave.dm:272
rt.def("/obj/machinery/microwave/proc/has_extra_item", function has_extra_item(f: Frame) {
	let O: Value = null;
	for (O of each(this.contents, T("/obj"))) {
		if (!rt.istype(O, T("/obj/item/weapon/reagent_containers/food")) && !rt.istype(O, T("/obj/item/weapon/grown"))) {
			return 1;
		}
	}
	return 0;
});

// microwave.dm:281
rt.def("/obj/machinery/microwave/proc/start", function* start(f: Frame) {
	this.visible_message("The microwave turns on.", "<span class='italics'>You hear a microwave humming.</span>");
	this.operating = 1;
	this.icon_state = "mw1";
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// microwave.dm:288
rt.def("/obj/machinery/microwave/proc/abort", function* abort(f: Frame) {
	this.operating = 0;
	this.icon_state = "mw";
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// microwave.dm:292
rt.def("/obj/machinery/microwave/proc/stop", function* stop(f: Frame) {
	playsound(this.loc, rt.rsc("sound/machines/ding.ogg"), 50, 1);
	yield* this.abort();
	return f.dot;
}, true);

// microwave.dm:296
rt.def("/obj/machinery/microwave/proc/dispose", function* dispose(f: Frame) {
	let O: Value = null;
	for (O of each(this.contents, T("/obj"))) {
		O.loc = this.loc;
	}
	to_chat(f.usr, "<span class='notice'>You dispose of the microwave contents.</span>");
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// microwave.dm:302
rt.def("/obj/machinery/microwave/proc/muck_start", function muck_start(f: Frame) {
	playsound(this.loc, rt.rsc("sound/effects/splat.ogg"), 50, 1);
	this.icon_state = "mwbloody1";
	return f.dot;
});

// microwave.dm:306
rt.def("/obj/machinery/microwave/proc/muck_finish", function* muck_finish(f: Frame) {
	let S: Value = null;
	playsound(this.loc, rt.rsc("sound/machines/ding.ogg"), 50, 1);
	this.visible_message("<span class='warning'>The microwave gets covered in muck!</span>");
	this.dirty = 100;
	this.icon_state = "mwbloody";
	this.operating = 0;
	yield* this.updateUsrDialog();
	for (S of each(this, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		if (prob(50)) {
			yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/badrecipe"), this);
			yield* qdel(S);
		}
	}
	return f.dot;
}, true);

// microwave.dm:318
rt.def("/obj/machinery/microwave/proc/broke", function* broke(f: Frame) {
	let s: Value = null;
	yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(2, 1, this);
	yield* s.start();
	this.icon_state = "mwb";
	this.visible_message("<span class='warning'>The microwave breaks!</span>");
	this.broken = 2;
	this.flags = null;
	this.operating = 0;
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// microwave.dm:329
rt.def("/obj/machinery/microwave/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if ((yield* parent_proc()) || this.panel_open) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	if (this.operating) {
		yield* this.updateUsrDialog();
		return f.dot;
	}
	const item = rt.at(href_list, "action");
	if (item === "cook") {
		yield* this.cook();
	} else if (item === "dispose") {
		yield* this.dispose();
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);
