// Based on /tg/station's code/modules/hydroponics/biogenerator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(10920, "/obj/machinery/biogenerator", "/obj/machinery", {
	processing: 0,
	beaker: null,
	points: 0,
	menustat: "menu",
	efficiency: 0,
	productivity: 0,
	max_items: 40,
	files: null,
	show_categories: null,
	timesFiveCategories: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 40,
	name: "biogenerator",
	desc: "Converts plants into biomass, which can be used to construct useful items.",
	icon: rt.rsc("icons/obj/biogenerator.dmi"),
	icon_state: "biogen-empty",
	density: 1,
});

// biogenerator.dm:22
rt.def("/obj/machinery/biogenerator/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	this.files = (yield* new_(T("/datum/research/biogenerator"), this));
	yield* this.create_reagents(1000);
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/biogenerator"), null))).apply_default_parts(this);
	return f.dot;
}, true);

// biogenerator.dm:30
rt.def("/obj/machinery/biogenerator/proc/Destroy", function* Destroy(f: Frame) {
	if (this.beaker) {
		yield* qdel(this.beaker);
		this.beaker = null;
	}
	return (yield* parent_proc());
}, true);

// biogenerator.dm:35
rt.def("/obj/machinery/biogenerator/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	parent_proc();
	if (!this.beaker) return f.dot;
	this.beaker.ex_act(severity, target);
	return f.dot;
}, false);

// biogenerator.dm:40
rt.def("/obj/machinery/biogenerator/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	yield* parent_proc();
	if (A != this.beaker) return f.dot;
	this.beaker = null;
	yield* this.update_icon();
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

rt.type(6755, "/obj/item/weapon/circuitboard/machine/biogenerator", "/obj/item/weapon/circuitboard/machine", {
	name: "Biogenerator (Machine Board)",
	build_path: rt.typePath("/obj/machinery/biogenerator"),
	origin_tech: "programming=2;biotech=3;materials=3",
	req_components: null,
});

// biogenerator.dm:50
rt.def("/obj/item/weapon/circuitboard/machine/biogenerator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]);
	return f.dot;
});

// biogenerator.dm:60
rt.def("/obj/machinery/biogenerator/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null, M: Value = null;
	let E: Value = 0;
	let _P: Value = 0;
	let max_storage: Value = 40;
	for (B of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		_P += B.rating;
		max_storage = 40 * B.rating;
	}
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		E += M.rating;
	}
	this.efficiency = E;
	this.productivity = _P;
	this.max_items = max_storage;
	return f.dot;
});

// biogenerator.dm:70
rt.def("/obj/machinery/biogenerator/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	this.update_icon();
	return f.dot;
});

// biogenerator.dm:74
rt.def("/obj/machinery/biogenerator/proc/update_icon", function update_icon(f: Frame) {
	if (this.panel_open) {
		this.icon_state = "biogen-empty-o";
	} else if (!this.beaker) {
		this.icon_state = "biogen-empty";
	} else if (!this.processing) {
		this.icon_state = "biogen-stand";
	} else {
		this.icon_state = "biogen-work";
	}
	return f.dot;
});

// biogenerator.dm:84
rt.def("/obj/machinery/biogenerator/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let B: Value = null, PB: Value = null, i: Value = null, G: Value = null, i_0: Value = null, G_1: Value = null, D: Value = null, B_1: Value = null;
	if (user.a_intent == "harm") {
		return (yield* parent_proc());
	}
	if (this.processing) {
		to_chat(user, "<span class='warning'>The biogenerator is currently processing.</span>");
		return f.dot;
	}
	if (this.default_deconstruction_screwdriver(user, "biogen-empty-o", "biogen-empty", O)) {
		if (this.beaker) {
			(B = this.beaker).loc = this.loc;
			this.beaker = null;
		}
		yield* this.update_icon();
		return f.dot;
	}
	if (yield* this.exchange_parts(user, O)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(O)) {
		return f.dot;
	}
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers/glass"))) {
		f.dot = 1;
		if (!this.panel_open) {
			if (this.beaker) {
				to_chat(user, "<span class='warning'>A container is already loaded into the machine.</span>");
			} else {
				if (!(yield* user.drop_item())) {
					return f.dot;
				}
				O.loc = this;
				this.beaker = O;
				to_chat(user, "<span class='notice'>You add the container to the machine.</span>");
				yield* this.update_icon();
				yield* this.updateUsrDialog();
			}
		} else {
			to_chat(user, "<span class='warning'>Close the maintenance panel first.</span>");
		}
		return f.dot;
	} else if (rt.istype(O, T("/obj/item/weapon/storage/bag/plants"))) {
		PB = O;
		i = 0;
		for (G of each(this.contents, T("/obj/item/weapon/reagent_containers/food/snacks/grown"))) {
			i++;
		}
		if (i >= this.max_items) {
			to_chat(user, "<span class='warning'>The biogenerator is already full! Activate it.</span>");
		} else {
			G = null;
			for (G of each(PB.contents, T("/obj/item/weapon/reagent_containers/food/snacks/grown"))) {
				if (i >= this.max_items) {
					break;
				}
				yield* PB.remove_from_storage(G, this);
				i++;
			}
			if (i < this.max_items) {
				to_chat(user, "<span class='info'>You empty the plant bag into the biogenerator.</span>");
			} else if (rt.len(f, PB.contents) == 0) {
				to_chat(user, "<span class='info'>You empty the plant bag into the biogenerator, filling it to its capacity.</span>");
			} else {
				to_chat(user, "<span class='info'>You fill the biogenerator to its capacity.</span>");
			}
		}
		return 1;
	} else if (rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks/grown"))) {
		i_0 = 0;
		for (G_1 of each(this.contents, T("/obj/item/weapon/reagent_containers/food/snacks/grown"))) {
			i_0++;
		}
		if (i_0 >= this.max_items) {
			to_chat(user, "<span class='warning'>The biogenerator is full! Activate it.</span>");
		} else if (yield* user.transferItemToLoc(O, this)) {
			to_chat(user, `<span class='info'>You put ${O.name} in ${this.name}</span>`);
		}
		return 1;
	} else if (rt.istype(O, T("/obj/item/weapon/disk/design_disk"))) {
		user.visible_message(fmt("＀ begins to load ％！ in ％！...", [user, O, this]), fmt("You begin to load a design from ％！...", [O]), "You hear the chatter of a floppy drive.");
		this.processing = 1;
		D = O;
		if (yield* do_after(user, 10, { target: this })) {
			for (B_1 of each(D.blueprints)) {
				if (B_1) {
					this.files.AddDesign2Known(B_1);
				}
			}
		}
		this.processing = 0;
		return 1;
	} else {
		to_chat(user, `<span class='warning'>You cannot put this in ${this.name}!</span>`);
	}
	return f.dot;
}, true);

// biogenerator.dm:169
rt.def("/obj/machinery/biogenerator/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, categories: Value = null, V: Value = null, D: Value = null, C: Value = null, cat: Value = null, V_3: Value = null, D_4: Value = null, popup: Value = null;
	let $e: any;
	if (rt.bitAnd(this.stat, 1) || this.panel_open) {
		return f.dot;
	}
	yield* user.set_machine(this);
	if (this.processing) {
		dat += "<div class='statusDisplay'>Biogenerator is processing! Please wait...</div><BR>";
	} else {
		if (this.menustat === "nopoints") {
			dat += "<div class='statusDisplay'>You do not have enough biomass to create products.<BR>Please, put growns into reactor and activate it.</div>";
			this.menustat = "menu";
		} else if (this.menustat === "complete") {
			dat += "<div class='statusDisplay'>Operation complete.</div>";
			this.menustat = "menu";
		} else if (this.menustat === "void") {
			dat += "<div class='statusDisplay'>Error: No growns inside.<BR>Please, put growns into reactor.</div>";
			this.menustat = "menu";
		} else if (this.menustat === "nobeakerspace") {
			dat += "<div class='statusDisplay'>Not enough space left in container. Unable to create product.</div>";
			this.menustat = "menu";
		}
		if (this.beaker) {
			categories = (yield* this.show_categories.Copy());
			for (V of each(categories)) {
				rt.setAt(categories, V, list());
			}
			V = null;
			for (V of each(this.files.known_designs)) {
				D = rt.index(this.files.known_designs, V);
				C = null;
				for (C of each(categories)) {
					if (rt.isIn(f, C, D.category)) {
						rt.modAt(categories, C, D, add);
					}
				}
			}
			dat += `<div class='statusDisplay'>Biomass: ${this.points} units.</div><BR>`;
			dat += fmt("<A href='?src=＃;activate=1'>Activate</A><A href='?src=＃;detach=1'>Detach Container</A>", [this, this]);
			for (cat of each(categories)) {
				dat += `<h3>${cat}:</h3>`;
				dat += "<div class='statusDisplay'>";
				V_3 = null;
				for (V_3 of each(rt.index(categories, cat))) {
					dat += fmt("＀: <A href='?src=＃;create=＃;amount=1'>Make</A>", [(D_4 = V_3).name, this, D_4]);
					if (rt.isIn(f, cat, this.timesFiveCategories)) {
						dat += fmt("<A href='?src=＃;create=＃;amount=5'>x5</A>", [this, D_4]);
					}
					if (ispath(D_4.build_path, T("/obj/item/stack"))) {
						dat += fmt("<A href='?src=＃;create=＃;amount=10'>x10</A>", [this, D_4]);
					}
					dat += `(${rt.index(D_4.materials, "$biomass") / this.efficiency})<br>`;
				}
				dat += "</div>";
			}
		} else {
			dat += "<div class='statusDisplay'>No container inside, please insert container.</div>";
		}
	}
	(popup = (yield* new_(T("/datum/browser"), user, "biogen", this.name, 350, 520))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// biogenerator.dm:222
rt.def("/obj/machinery/biogenerator/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.interact(user);
	return f.dot;
}, true);

// biogenerator.dm:225
rt.def("/obj/machinery/biogenerator/proc/activate", function* activate(f: Frame) {
	let I: Value = null;
	if (f.usr.stat != 0) {
		return f.dot;
	}
	if (this.stat != 0) {
		return f.dot;
	}
	if (this.processing) {
		to_chat(f.usr, "<span class='warning'>The biogenerator is in the process of working.</span>");
		return f.dot;
	}
	let S: Value = 0;
	for (I of each(this.contents, T("/obj/item/weapon/reagent_containers/food/snacks/grown"))) {
		S += 5;
		if (I.reagents.get_reagent_amount("nutriment") < 0.1) {
			this.points += 1 * this.productivity;
		} else {
			this.points += I.reagents.get_reagent_amount("nutriment") * 10 * this.productivity;
		}
		yield* qdel(I);
	}
	if (S) {
		this.processing = 1;
		yield* this.update_icon();
		yield* this.updateUsrDialog();
		playsound(this.loc, rt.rsc("sound/machines/blender.ogg"), 50, 1);
		yield* this.use_power(S * 30);
		yield* sleep(S + 15 / this.productivity);
		this.processing = 0;
		yield* this.update_icon();
	} else {
		this.menustat = "void";
	}
	return f.dot;
}, true);

// biogenerator.dm:253
rt.def("/obj/machinery/biogenerator/proc/check_cost", function* check_cost(f: Frame, materials: Value, multiplier: Value, remove_points: Value) {
	multiplier ??= 1;
	remove_points ??= 1;
	if (rt.len(f, materials) != 1 || rt.index(materials, 1) != "$biomass") {
		return 0;
	}
	if (rt.at(materials, "$biomass") * multiplier / this.efficiency > this.points) {
		this.menustat = "nopoints";
		return 0;
	} else {
		if (remove_points) {
			this.points -= rt.at(materials, "$biomass") * multiplier / this.efficiency;
		}
		yield* this.update_icon();
		yield* this.updateUsrDialog();
		return 1;
	}
}, true);

// biogenerator.dm:267
rt.def("/obj/machinery/biogenerator/proc/check_container_volume", function check_container_volume(f: Frame, reagents: Value, multiplier: Value) {
	let R: Value = null;
	multiplier ??= 1;
	let sum_reagents: Value = 0;
	for (R of each(reagents)) {
		sum_reagents += rt.index(reagents, R);
	}
	sum_reagents *= multiplier;
	if (this.beaker.reagents.total_volume + sum_reagents > this.beaker.reagents.maximum_volume) {
		this.menustat = "nobeakerspace";
		return 0;
	}
	return 1;
});

// biogenerator.dm:278
rt.def("/obj/machinery/biogenerator/proc/create_product", function* create_product(f: Frame, D: Value, amount: Value) {
	let product: Value = null, R: Value = null, i: Value = null;
	if (!this.beaker || !this.loc) {
		return 0;
	}
	if (ispath(D.build_path, T("/obj/item/stack"))) {
		if (!this.check_container_volume(D.make_reagents, amount)) {
			return 0;
		}
		if (!(yield* this.check_cost(D.materials, amount))) {
			return 0;
		}
		(product = (yield* new_(D.build_path, this.loc))).amount = amount;
		for (R of each(D.make_reagents)) {
			yield* this.beaker.reagents.add_reagent(R, rt.index(D.make_reagents, R) * amount);
		}
	} else {
		i = amount;
		while (i > 0) {
			if (!this.check_container_volume(D.make_reagents)) {
				return f.dot;
			}
			if (!(yield* this.check_cost(D.materials))) {
				return f.dot;
			}
			if (D.build_path) {
				yield* new_(D.build_path, this.loc);
			}
			R = null;
			for (R of each(D.make_reagents)) {
				yield* this.beaker.reagents.add_reagent(R, rt.index(D.make_reagents, R));
			}
			f.dot = 1;
			i--;
		}
	}
	this.menustat = "complete";
	yield* this.update_icon();
	return f.dot;
}, true);

// biogenerator.dm:311
rt.def("/obj/machinery/biogenerator/proc/detach", function detach(f: Frame) {
	if (!this.beaker) return f.dot;
	this.beaker.loc = this.loc;
	this.beaker = null;
	this.update_icon();
	return f.dot;
});

// biogenerator.dm:316
rt.def("/obj/machinery/biogenerator/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let amount: Value = null, D: Value = null;
	if ((yield* parent_proc()) || this.panel_open) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "activate")) {
		yield* this.activate();
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "detach")) {
		yield* this.detach();
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "create")) {
		amount = text2num(rt.at(href_list, "amount"));
		yield* this.create_product((D = rt.locateIn(f, rt.at(href_list, "create"), rt.world())), amount);
		yield* this.updateUsrDialog();
	} else {
		if (!rt.at(href_list, "menu")) return f.dot;
		this.menustat = "menu";
		yield* this.updateUsrDialog();
	}
	return f.dot;
}, true);
