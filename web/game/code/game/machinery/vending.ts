// Based on /tg/station's code/game/machinery/vending.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, truthy, add, subtract, fmt } = rt;


rt.type(10639, "/obj/machinery/vending", "/obj/machinery", {
	active: 1,
	vend_ready: 1,
	products: null,
	contraband: null,
	premium: null,
	product_slogans: "",
	product_ads: "",
	product_records: null,
	hidden_records: null,
	coin_records: null,
	slogan_list: null,
	small_ads: null,
	vend_reply: null,
	last_reply: 0,
	last_slogan: 0,
	slogan_delay: 6000,
	icon_vend: null,
	icon_deny: null,
	seconds_electrified: 0,
	shoot_inventory: 0,
	shoot_inventory_chance: 2,
	shut_up: 0,
	extended_inventory: 0,
	scan_id: 1,
	coin: null,
	bill: null,
	dish_quants: null,
	refill_canister: null,
	refill_count: 3,
	anchored: 1,
	verb_say: "beeps",
	verb_ask: "beeps",
	verb_exclaim: "beeps",
	name: "１Vendomat",
	desc: "A generic vending machine.",
	icon: rt.rsc("icons/obj/vending.dmi"),
	icon_state: "generic",
	layer: 2.9,
	density: 1,
	obj_integrity: 300,
	max_integrity: 300,
	integrity_failure: 100,
	armor: null,
});

// vending.dm:32
rt.def("/obj/machinery/vending/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = list();

	this.contraband = list();

	this.premium = list();

	this.product_records = list();

	this.hidden_records = list();

	this.coin_records = list();

	this.slogan_list = list();

	this.small_ads = list();

	this.dish_quants = list();
	this.armor = rt.alist(f, ["melee", 20, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 70]);
	return f.dot;
});

// vending.dm:64
rt.def("/obj/machinery/vending/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	this.wires = (yield* new_(T("/datum/wires/vending"), this));
	if (this.refill_canister) {
		yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/vendor"), null))).apply_default_parts(this);
	} else {
		yield* this.build_inventory(this.products);
		yield* this.build_inventory(this.contraband, 1);
		yield* this.build_inventory(this.premium, 0, 1);
	}
	this.slogan_list = splittext(this.product_slogans, ";");
	this.last_slogan = rt.worldTime(f) + rand(0, this.slogan_delay);
	yield* this.power_change();
	return f.dot;
}, true);

rt.type(6733, "/obj/item/weapon/circuitboard/machine/vendor", "/obj/item/weapon/circuitboard/machine", {
	names_paths: null,
	name: "Booze-O-Mat Vendor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/vending/boozeomat"),
	origin_tech: "programming=1",
	req_components: null,
});

// vending.dm:85
rt.def("/obj/item/weapon/circuitboard/machine/vendor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/vending_refill/boozeomat"), 3]);

	this.names_paths = rt.alist(f, [T("/obj/machinery/vending/boozeomat"), "Booze-O-Mat", T("/obj/machinery/vending/coffee"), "Solar's Best Hot Drinks", T("/obj/machinery/vending/snack"), "Getmore Chocolate Corp", T("/obj/machinery/vending/cola"), "Robust Softdrinks", T("/obj/machinery/vending/cigarette"), "ShadyCigs Deluxe", T("/obj/machinery/vending/autodrobe"), "AutoDrobe", T("/obj/machinery/vending/clothing"), "ClothesMate", T("/obj/machinery/vending/medical"), "NanoMed Plus", T("/obj/machinery/vending/wallmed"), "NanoMed"]);
	return f.dot;
});

// vending.dm:99
rt.def("/obj/item/weapon/circuitboard/machine/vendor/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let position: Value = null, typepath: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		position = (position = this.names_paths.Find(this.build_path)) == rt.len(f, this.names_paths) ? 1 : position + 1;
		typepath = rt.index(this.names_paths, position);
		to_chat(user, `<span class='notice'>You set the board to "${rt.index(this.names_paths, typepath)}".</span>`);
		this.set_type(typepath);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// vending.dm:110
rt.def("/obj/item/weapon/circuitboard/machine/vendor/proc/set_type", function set_type(f: Frame, typepath: Value) {
	this.build_path = typepath;
	this.name = `${rt.index(this.names_paths, this.build_path)} Vendor (Machine Board)`;
	this.req_components = rt.alist(f, [rt.initial(f, typepath, "refill_canister"), rt.initial(f, typepath, "refill_count")]);
	return f.dot;
});

// vending.dm:115
rt.def("/obj/item/weapon/circuitboard/machine/vendor/proc/apply_default_parts", function* apply_default_parts(f: Frame, M: Value) {
	let typepath: Value = null;
	for (typepath of each(this.names_paths)) {
		if (rt.op(f, "IsType", [], [M, typepath])) {
			this.set_type(typepath);
			break;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// vending.dm:122
rt.def("/obj/machinery/vending/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.wires);
	this.wires = null;
	yield* qdel(this.coin);
	this.coin = null;
	yield* qdel(this.bill);
	this.bill = null;
	return (yield* parent_proc());
}, true);

rt.type(10640, "/obj/machinery/vending/snack", "/obj/machinery/vending", {
	chef_compartment_access: "28",
	product_slogans: "Try our new nougat bar!;Twice the calories for half the price!",
	product_ads: "The healthiest!;Award-winning chocolate bars!;Mmm! So good!;Oh my god it's so juicy!;Have a snack.;Snacks are good for you!;Have some more Getmore!;Best quality snacks straight from mars.;We love chocolate!;Try our new jerky!",
	products: null,
	contraband: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/snack"),
	name: "１Getmore Chocolate Corp",
	desc: "A snack machine courtesy of the Getmore Chocolate Corporation, based out of Mars.",
	icon_state: "snack",
});

// vending.dm:128
rt.def("/obj/machinery/vending/snack/proc/Destroy", function* Destroy(f: Frame) {
	let S: Value = null;
	for (S of each(this.contents, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		S.loc = rt.getStep(f, this, 0);
	}
	yield* qdel(this.wires);
	this.wires = null;
	return (yield* parent_proc());
}, true);

// vending.dm:136
rt.def("/obj/machinery/vending/proc/RefreshParts", function* RefreshParts(f: Frame) {
	let VR: Value = null;
	if (!this.component_parts) return f.dot;
	this.product_records = list();
	this.hidden_records = list();
	this.coin_records = list();
	yield* this.build_inventory(this.products, { start_empty: 1 });
	yield* this.build_inventory(this.contraband, 1, { start_empty: 1 });
	yield* this.build_inventory(this.premium, 0, 1, { start_empty: 1 });
	for (VR of each(this.component_parts, T("/obj/item/weapon/vending_refill"))) {
		this.refill_inventory(VR, this.product_records, 1);
		this.refill_inventory(VR, this.coin_records, 3);
		this.refill_inventory(VR, this.hidden_records, 2);
	}
	return f.dot;
}, true);

// vending.dm:149
rt.def("/obj/machinery/vending/proc/deconstruct", function* deconstruct(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (!this.refill_canister) {
		if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
			yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 3);
		}
		yield* qdel(this);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true, { args: ["disassembled"] });

// vending.dm:157
rt.def("/obj/machinery/vending/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	let R: Value = null, dump_path: Value = null, O: Value = null;
	if (!(!rt.bitAnd(this.stat, 1) && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	let dump_amount: Value = 0;
	for (R of each(this.product_records, T("/datum/data/vending_product"))) {
		if (R.amount <= 0) {
			continue;
		}
		if (!(dump_path = R.product_path)) {
			continue;
		}
		while (R.amount > 0) {
			yield* step((O = (yield* new_(dump_path, this.loc))), pick(GLOB.alldirs));
			R.amount -= 5;
			dump_amount++;
		}
		if (dump_amount > 15) {
			break;
		}
	}
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.icon_state = `${rt.initial(f, this, "icon_state")}-broken`;
	return f.dot;
}, true);

// vending.dm:177
rt.def("/obj/machinery/vending/proc/build_inventory", function* build_inventory(f: Frame, productlist: Value, hidden: Value, req_coin: Value, start_empty: Value) {
	let typepath: Value = null, amount: Value = null, temp: Value = null, R: Value = null;
	hidden ??= 0;
	req_coin ??= 0;
	for (typepath of each(productlist)) {
		if ((amount = rt.index(productlist, typepath)) === null) {
			amount = 0;
		}
		temp = (yield* new_(typepath, null));
		(R = (yield* new_(T("/datum/data/vending_product")))).product_name = rt.initial(f, temp, "name");
		R.product_path = typepath;
		if (!start_empty) {
			R.amount = amount;
		}
		R.max_amount = amount;
		R.display_color = pick("red", "blue", "green");
		if (hidden) {
			this.hidden_records += R;
		} else if (req_coin) {
			this.coin_records += R;
		} else {
			this.product_records += R;
		}
	}
	return f.dot;
}, true);

// vending.dm:202
rt.def("/obj/machinery/vending/proc/refill_inventory", function refill_inventory(f: Frame, refill: Value, machine: Value, charge_type: Value) {
	let machine_content: Value = null, tmp_charges: Value = null, machine_content_3: Value = null, restock: Value = null;
	charge_type ??= 1;
	let total: Value = 0;
	let to_restock: Value = 0;
	for (machine_content of each(machine, T("/datum/data/vending_product"))) {
		if (machine_content.amount == 0 && rt.index(refill.charges, charge_type) > 0) {
			machine_content.amount++;
			rt.incAt(refill.charges, charge_type, -1, true);
			total++;
		}
		to_restock += machine_content.max_amount - machine_content.amount;
	}
	if (to_restock <= rt.index(refill.charges, charge_type)) {
		machine_content = null;
		for (machine_content of each(machine, T("/datum/data/vending_product"))) {
			machine_content.amount = machine_content.max_amount;
		}
		(rt.modAt(refill.charges, charge_type, to_restock, subtract));
		total += to_restock;
	} else {
		tmp_charges = rt.index(refill.charges, charge_type);
		for (machine_content_3 of each(machine, T("/datum/data/vending_product"))) {
			if (rt.index(refill.charges, charge_type) == 0) {
				break;
			}
			if ((restock = Ceiling((machine_content_3.max_amount - machine_content_3.amount) / to_restock * tmp_charges)) > rt.index(refill.charges, charge_type)) {
				restock = rt.index(refill.charges, charge_type);
			}
			machine_content_3.amount += restock;
			(rt.modAt(refill.charges, charge_type, restock, subtract));
			total += restock;
		}
	}
	return total;
});

// vending.dm:227
rt.def("/obj/machinery/vending/snack/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let S: Value = null, _T: Value = null, loaded: Value = null, denied_items: Value = null, S_3: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		if (!this.compartment_access_check(user)) {
			return f.dot;
		}
		if (!(S = W).junkiness) {
			if (!this.iscompartmentfull(user)) {
				if (!(yield* user.drop_item())) {
					return f.dot;
				}
				W.loc = this;
				yield* this.food_load(W);
				to_chat(user, `<span class='notice'>You insert ${W} into ${this}'s chef compartment.</span>`);
			}
		} else {
			to_chat(user, `<span class='notice'>${this}'s chef compartment does not accept junk food.</span>`);
		}
	} else if (rt.istype(W, T("/obj/item/weapon/storage/bag/tray"))) {
		if (!this.compartment_access_check(user)) {
			return f.dot;
		}
		_T = W;
		loaded = 0;
		denied_items = 0;
		for (S_3 of each(_T.contents, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
			if (this.iscompartmentfull(user)) {
				break;
			}
			if (!S_3.junkiness) {
				yield* _T.remove_from_storage(S_3, this);
				yield* this.food_load(S_3);
				loaded++;
			} else {
				denied_items++;
			}
		}
		if (denied_items) {
			to_chat(user, `<span class='notice'>${this} refuses some items.</span>`);
		}
		if (loaded) {
			to_chat(user, `<span class='notice'>You insert ${loaded} dishes into ${this}'s chef compartment.</span>`);
		}
		yield* this.updateUsrDialog();
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// vending.dm:267
rt.def("/obj/machinery/vending/snack/proc/compartment_access_check", function compartment_access_check(f: Frame, user: Value) {
	this.req_access_txt = this.chef_compartment_access;
	if (!this.allowed(user) && !this.emagged && this.scan_id) {
		to_chat(user, `<span class='warning'>${this}'s chef compartment blinks red: Access denied.</span>`);
		this.req_access_txt = "0";
		return 0;
	}
	this.req_access_txt = "0";
	return 1;
});

// vending.dm:276
rt.def("/obj/machinery/vending/snack/proc/iscompartmentfull", function iscompartmentfull(f: Frame, user: Value) {
	if (rt.len(f, this.contents) >= 30) {
		to_chat(user, `<span class='warning'>${this}'s chef compartment is full.</span>`);
		return 1;
	}
	return 0;
});

// vending.dm:282
rt.def("/obj/machinery/vending/snack/proc/food_load", function* food_load(f: Frame, S: Value) {
	if (rt.index(this.dish_quants, S.name)) {
		rt.incAt(this.dish_quants, S.name, 1, true);
	} else {
		rt.setAt(this.dish_quants, S.name, 1);
	}
	yield* sortList(this.dish_quants);
	return f.dot;
}, true);

// vending.dm:290
rt.def("/obj/machinery/vending/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let S: Value = null, canister: Value = null, transfered: Value = null;
	if (this.panel_open) {
		if (yield* this.default_unfasten_wrench(user, W, { time: 60 })) {
			return f.dot;
		}
	}
	if (this.component_parts) {
		if (yield* this.default_deconstruction_crowbar(W)) {
			return f.dot;
		}
	}
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.anchored) {
			this.panel_open = (!this.panel_open ? 1 : 0);
			to_chat(user, `<span class='notice'>You ${this.panel_open ? "open" : "close"} the maintenance panel.</span>`);
			this.cut_overlays();
			if (this.panel_open) {
				this.add_overlay(`${rt.initial(f, this, "icon_state")}-panel`);
			}
			playsound(this.loc, W.usesound, 50, 1);
			yield* this.updateUsrDialog();
		} else {
			to_chat(user, `<span class='warning'>You must first secure ${this}.</span>`);
		}
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/device/multitool")) || rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
		if (this.panel_open) {
			yield* this.attack_hand(user);
		}
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/weapon/coin"))) {
		if (this.coin) {
			to_chat(user, `<span class='warning'>${this} already has ${this.coin} inserted</span>`);
			return f.dot;
		}
		if (this.bill) {
			to_chat(user, `<span class='warning'>${this} already has ${this.bill} inserted</span>`);
			return f.dot;
		}
		if (!rt.len(f, this.premium)) {
			to_chat(user, `<span class='warning'>${this} doesn't have a coin slot.</span>`);
			return f.dot;
		}
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		W.loc = this;
		this.coin = W;
		to_chat(user, `<span class='notice'>You insert ${W} into ${this}.</span>`);
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/stack/spacecash"))) {
		if (this.coin) {
			to_chat(user, `<span class='warning'>${this} already has ${this.coin} inserted</span>`);
			return f.dot;
		}
		if (this.bill) {
			to_chat(user, `<span class='warning'>${this} already has ${this.bill} inserted</span>`);
			return f.dot;
		}
		S = W;
		if (!rt.len(f, this.premium)) {
			to_chat(user, `<span class='warning'>${this} doesn't have a bill slot.</span>`);
			return f.dot;
		}
		yield* S.use(1);
		this.bill = (yield* new_(S.type, this, 1));
		to_chat(user, `<span class='notice'>You insert ${W} into ${this}.</span>`);
		return f.dot;
	} else if (rt.op(f, "IsType", [], [W, this.refill_canister]) && this.refill_canister !== null) {
		if (rt.bitAnd(this.stat, 3)) {
			to_chat(user, "<span class='notice'>It does nothing.</span>");
		} else if (this.panel_open) {
			if (rt.index((canister = W).charges, 1) == 0) {
				to_chat(user, `<span class='notice'>This ${canister.name} is empty!</span>`);
			} else {
				transfered = this.refill_inventory(canister, this.product_records, 1);
				transfered += this.refill_inventory(canister, this.coin_records, 3);
				if (transfered += this.refill_inventory(canister, this.hidden_records, 2)) {
					to_chat(user, fmt("<span class='notice'>You loaded ＀ items in ％！.</span>", [transfered, this.name]));
				} else {
					to_chat(user, `<span class='notice'>The ${this.name} is fully stocked.</span>`);
				}
			}
			return f.dot;
		} else {
			to_chat(user, "<span class='notice'>You should probably unscrew the service panel first.</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// vending.dm:369
rt.def("/obj/machinery/vending/proc/on_deconstruction", function on_deconstruction(f: Frame) {
	let machine_content: Value = null, safety: Value = null, VR: Value = null;
	let product_list: Value = list(this.product_records, this.hidden_records, this.coin_records);
	let i: Value = 1;
	while (i <= 3) {
		machine_content = null;
		for (machine_content of each(rt.index(product_list, i), T("/datum/data/vending_product"))) {
			while (machine_content.amount != 0) {
				safety = 0;
				VR = null;
				for (VR of each(this.component_parts, T("/obj/item/weapon/vending_refill"))) {
					safety++;
					if (rt.index(VR.charges, i) < rt.index(VR.init_charges, i)) {
						rt.incAt(VR.charges, i, 1, true);
						machine_content.amount--;
						if (!machine_content.amount) {
							break;
						}
					} else {
						safety--;
					}
				}
				if (safety <= 0) {
					break;
				}
			}
		}
		i++;
	}
	parent_proc();
	return f.dot;
});

// vending.dm:387
rt.def("/obj/machinery/vending/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	this.emagged = 1;
	to_chat(user, `<span class='notice'>You short out the product lock on ${this}.</span>`);
	return f.dot;
});

// vending.dm:392
rt.def("/obj/machinery/vending/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// vending.dm:395
// tg_js: opens the `vending` tgui window instead of a /datum/browser popup (the HTML builder is gone).
rt.def("/obj/machinery/vending/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.panel_open && !rt.istype(user, T("/mob/living/silicon/ai"))) {
		return (yield* this.wires.interact(user));
	}
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	yield* user.set_machine(this);
	if (this.seconds_electrified && !rt.bitAnd(this.stat, 2)) {
		if (yield* this.shock(user, 100)) {
			return f.dot;
		}
	}
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// /obj/machinery/vending/proc/ui_interact  (tg_js, after modern tg's vending.dm)  may sleep
rt.def("/obj/machinery/vending/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "vending", this.name, 450, 500, master_ui, state))).open();
	return f.dot;
}, true);

// /obj/machinery/vending/proc/ui_data  (tg_js)  may sleep
// products / hidden / premium are lists of {name, amount, color, ref}; hidden only with extended_inventory,
// premium only with a coin or bill inside. dishes are the snack machine's chef food compartment.
rt.def("/obj/machinery/vending/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let R: Value = null, O: Value = null, E: Value = null;
	let $e: any;
	let data: Value = list();
	let products: Value = list();
	let hidden: Value = list();
	let premium: Value = list();
	let dishes: Value = list();
	const has_money = truthy(this.coin) || truthy(this.bill);
	for (const [recs, out, show] of [["product_records", products, true], ["hidden_records", hidden, truthy(this.extended_inventory)], ["coin_records", premium, has_money]]) {
		if (!show) continue;
		R = null;
		for (R of each(rt.sv(f, recs), T("/datum/data/vending_product"))) {
			E = list();
			rt.setAt(E, "name", sanitize(R.product_name));
			rt.setAt(E, "amount", R.amount);
			rt.setAt(E, "color", R.display_color);
			rt.setAt(E, "id", fmt("＃", [R]));
			rt.modify(out, list(E), add);
		}
	}
	rt.setAt(data, "products", products);
	rt.setAt(data, "hidden", hidden);
	rt.setAt(data, "premium", premium);
	rt.setAt(data, "has_premium", (rt.len(f, this.premium) > 0 ? 1 : 0));
	rt.setAt(data, "coin", this.coin ? `${this.coin}` : null);
	rt.setAt(data, "bill", this.bill ? `${this.bill}` : null);
	rt.setAt(data, "has_money", has_money ? 1 : 0);
	rt.setAt(data, "is_snack", rt.istype(this, T("/obj/machinery/vending/snack")) ? 1 : 0);
	if (rt.at(data, "is_snack")) {
		for (O of each(this.dish_quants)) {
			if (rt.index(this.dish_quants, O) > 0) {
				E = list();
				rt.setAt(E, "name", capitalize(O));
				rt.setAt(E, "key", O);
				rt.setAt(E, "amount", rt.index(this.dish_quants, O));
				rt.modify(dishes, list(E), add);
			}
		}
	}
	rt.setAt(data, "dishes", dishes);
	return data;
}, true);

// /obj/machinery/vending/proc/ui_act  (tg_js)  may sleep
// The window's buttons go through the old Topic, so every vend check stays in one place.
rt.def("/obj/machinery/vending/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "vend") {
		yield* this.Topic("", rt.alist(f, ["vend", rt.at(params, "id")]));
	} else if (action === "remove_coin") {
		yield* this.Topic("", rt.alist(f, ["remove_coin", 1]));
	} else if (action === "dispense") {
		yield* this.Topic("", rt.alist(f, ["dispense", rt.at(params, "key")]));
	} else {
		return 0;
	}
	GLOB.SStgui.update_uis(this);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// vending.dm:453
rt.def("/obj/machinery/vending/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let R: Value = null, N: Value = null, O: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.istype(f.usr, T("/mob/living/silicon"))) {
		if (rt.istype(f.usr, T("/mob/living/silicon/robot"))) {
			if (!((R = f.usr).module && rt.istype(R.module, T("/obj/item/weapon/robot_module/butler")))) {
				to_chat(f.usr, "<span class='notice'>The vending machine refuses to interface with you, as you are not in its target demographic!</span>");
				return f.dot;
			}
		} else {
			to_chat(f.usr, "<span class='notice'>The vending machine refuses to interface with you, as you are not in its target demographic!</span>");
			return f.dot;
		}
	}
	if (rt.at(href_list, "remove_coin")) {
		if (!(this.coin || this.bill)) {
			to_chat(f.usr, "<span class='notice'>There is no money in this machine.</span>");
			return f.dot;
		}
		if (this.coin) {
			if (!f.usr.get_active_held_item()) {
				yield* f.usr.put_in_hands(this.coin);
			} else {
				yield* this.coin.forceMove(rt.getStep(f, this, 0));
			}
			to_chat(f.usr, `<span class='notice'>You remove ${this.coin} from ${this}.</span>`);
			this.coin = null;
		}
		if (this.bill) {
			if (!f.usr.get_active_held_item()) {
				yield* f.usr.put_in_hands(this.bill);
			} else {
				yield* this.bill.forceMove(rt.getStep(f, this, 0));
			}
			to_chat(f.usr, `<span class='notice'>You remove ${this.bill} from ${this}.</span>`);
			this.bill = null;
		}
	}
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "dispense") && this.vend_ready) {
		N = rt.at(href_list, "dispense");
		if (rt.index(this.dish_quants, N) <= 0) {
			return f.dot;
		}
		this.vend_ready = 0;
		yield* this.use_power(5);
		rt.setAt(this.dish_quants, N, max(rt.index(this.dish_quants, N) - 1, 0));
		for (O of each(this.contents, T("/obj"))) {
			if (O.name == N) {
				O.loc = this.loc;
				break;
			}
		}
		this.vend_ready = 1;
		yield* this.updateUsrDialog();
		return f.dot;
	}
	if (rt.at(href_list, "vend") && this.vend_ready) {
		if (this.panel_open) {
			to_chat(f.usr, "<span class='notice'>The vending machine cannot dispense products while its service panel is open!</span>");
			return f.dot;
		}
		if (!(yield* this.allowed(f.usr)) && !this.emagged && this.scan_id) {
			to_chat(f.usr, "<span class='warning'>Access denied.</span>");
			flick(this.icon_deny, this);
			return f.dot;
		}
		this.vend_ready = 0;
		if (!(R = rt.locateIn(f, rt.at(href_list, "vend"), rt.world())) || !rt.istype(R, T("/datum/data/vending_product")) || !R.product_path) {
			this.vend_ready = 1;
			return f.dot;
		}
		if (rt.isIn(f, R, this.hidden_records)) {
			if (!this.extended_inventory) {
				this.vend_ready = 1;
				return f.dot;
			}
		} else if (rt.isIn(f, R, this.coin_records)) {
			if (!(this.coin || this.bill)) {
				to_chat(f.usr, "<span class='warning'>You need to insert money to get this item!</span>");
				this.vend_ready = 1;
				return f.dot;
			}
			if (this.coin && this.coin.string_attached) {
				if (prob(50)) {
					if (yield* f.usr.put_in_hands(this.coin)) {
						to_chat(f.usr, `<span class='notice'>You successfully pull ${this.coin} out before ${this} could swallow it.</span>`);
						this.coin = null;
					} else {
						to_chat(f.usr, `<span class='warning'>You couldn't pull ${this.coin} out because your hands are full!</span>`);
						yield* qdel(this.coin);
						this.coin = null;
					}
				} else {
					to_chat(f.usr, `<span class='warning'>You weren't able to pull ${this.coin} out fast enough, the machine ate it, string and all!</span>`);
					yield* qdel(this.coin);
					this.coin = null;
				}
			} else {
				yield* qdel(this.coin);
				this.coin = null;
				yield* qdel(this.bill);
				this.bill = null;
			}
		} else if (!rt.isIn(f, R, this.product_records)) {
			this.vend_ready = 1;
			message_admins(`Vending machine exploit attempted by ${key_name(f.usr, f.usr.client)}!`);
			return f.dot;
		}
		if (R.amount <= 0) {
			to_chat(f.usr, "<span class='warning'>Sold out.</span>");
			this.vend_ready = 1;
			return f.dot;
		} else {
			R.amount--;
		}
		if (this.last_reply + 200 <= rt.worldTime(f) && this.vend_reply) {
			yield* this.speak(this.vend_reply);
			this.last_reply = rt.worldTime(f);
		}
		yield* this.use_power(5);
		if (this.icon_vend) {
			flick(this.icon_vend, this);
		}
		yield* new_(R.product_path, rt.getStep(f, this, 0));
		this.vend_ready = 1;
		// tg bug: a `return` here skipped the refresh below, so the window kept the old stock after a vend
		yield* this.updateUsrDialog();
		return f.dot;
	} else if (rt.at(href_list, "togglevoice") && this.panel_open) {
		this.shut_up = (!this.shut_up ? 1 : 0);
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// vending.dm:579
rt.def("/obj/machinery/vending/proc/process", function* process(f: Frame) {
	let slogan: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!this.active) {
		return f.dot;
	}
	if (this.seconds_electrified > 0) {
		this.seconds_electrified--;
	}
	if (this.last_slogan + this.slogan_delay <= rt.worldTime(f) && rt.len(f, this.slogan_list) > 0 && !this.shut_up && prob(5)) {
		yield* this.speak((slogan = pick(this.slogan_list)));
		this.last_slogan = rt.worldTime(f);
	}
	if (!(this.shoot_inventory && prob(this.shoot_inventory_chance))) return f.dot;
	yield* this.throw_item();
	return f.dot;
}, true, { waitfor: false });

// vending.dm:598
rt.def("/obj/machinery/vending/proc/speak", function* speak(f: Frame, message: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!message) {
		return f.dot;
	}
	yield* this.say(message);
	return f.dot;
}, true);

// vending.dm:606
rt.def("/obj/machinery/vending/proc/power_change", function power_change(f: Frame) {
	if (rt.bitAnd(this.stat, 1)) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-broken`;
	} else if (this.powered()) {
		this.icon_state = rt.initial(f, this, "icon_state");
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-off`;
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	}
	return f.dot;
});

// vending.dm:620
rt.def("/obj/machinery/vending/proc/throw_item", function* throw_item(f: Frame) {
	let throw_item: Value = null, target: Value = null, R: Value = null, dump_path: Value = null;
	if (!(target = rt.locateIn(f, T("/mob/living"), view(7, this)))) {
		return 0;
	}
	for (R of each(shuffle(this.product_records), T("/datum/data/vending_product"))) {
		if (R.amount <= 0) {
			continue;
		}
		if (!(dump_path = R.product_path)) {
			continue;
		}
		R.amount--;
		throw_item = (yield* new_(dump_path, this.loc));
		break;
	}
	if (!throw_item) {
		return 0;
	}
	yield* this.pre_throw(throw_item);
	yield* throw_item.throw_at(target, 16, 3);
	this.visible_message(`<span class='danger'>${this} launches ${throw_item} at ${target}!</span>`);
	return 1;
}, true);

// vending.dm:648
rt.def("/obj/machinery/vending/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		return 0;
	}
	if (!prob(prb)) {
		return 0;
	}
	yield* do_sparks(5, 1, this);
	let check_range: Value = 1;
	if (yield* electrocute_mob(user, get_area(this), this, 0.7, check_range)) {
		return 1;
	} else {
		return 0;
	}
}, true);

rt.type(10646, "/obj/machinery/vending/boozeomat", "/obj/machinery/vending", {
	icon_deny: "boozeomat-deny",
	products: null,
	contraband: null,
	product_slogans: "I hope nobody asks me for a bloody cup o' tea...;Alcohol is humanity's friend. Would you abandon a friend?;Quite delighted to serve you!;Is nobody thirsty on this station?",
	product_ads: "Drink up!;Booze is good for you!;Alcohol is humanity's best friend.;Quite delighted to serve you!;Care for a nice, cold beer?;Nothing cures you like booze!;Have a sip!;Have a drink!;Have a beer!;Beer is good for you!;Only the finest alcohol!;Best quality booze since 2053!;Award-winning wine!;Maximum alcohol!;Man loves beer.;A toast for progress!",
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/boozeomat"),
	name: "１Booze-O-Mat",
	desc: "A technological marvel, supposedly able to mix just the mixture you'd like to drink the moment you ask for one.",
	icon_state: "boozeomat",
	req_access_txt: "25",
});

// vending.dm:692
rt.def("/obj/machinery/vending/boozeomat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/bottle/gin"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/tequila"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/vermouth"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/rum"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/wine"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/cognac"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/kahlua"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/hcider"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/grappa"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/ale"), 6, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/orangejuice"), 4, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/tomatojuice"), 4, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/limejuice"), 4, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/cream"), 4, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/tonic"), 8, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/cola"), 8, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/sodawater"), 15, T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"), 30, T("/obj/item/weapon/reagent_containers/food/drinks/ice"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass"), 12, T("/obj/item/weapon/reagent_containers/food/drinks/flask"), 3]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/mug/tea"), 12]);
	return f.dot;
});

rt.type(10647, "/obj/machinery/vending/assist", "/obj/machinery/vending", {
	products: null,
	contraband: null,
	product_ads: "Only the finest!;Have some tools.;The most robust equipment.;The finest gear in space!",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:712
rt.def("/obj/machinery/vending/assist/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/device/assembly/prox_sensor"), 5, T("/obj/item/device/assembly/igniter"), 3, T("/obj/item/device/assembly/signaler"), 4, T("/obj/item/weapon/wirecutters"), 1, T("/obj/item/weapon/cartridge/signal"), 4]);

	this.contraband = rt.alist(f, [T("/obj/item/device/assembly/timer"), 2, T("/obj/item/device/assembly/voice"), 2, T("/obj/item/device/assembly/health"), 2]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10648, "/obj/machinery/vending/coffee", "/obj/machinery/vending", {
	product_ads: "Have a drink!;Drink up!;It's good for you!;Would you like a hot joe?;I'd kill for some coffee!;The best beans in the galaxy.;Only the finest brew for you.;Mmmm. Nothing like a coffee.;I like coffee, don't you?;Coffee helps you work!;Try some tea.;We hope you like the best!;Try our new chocolate!;Admin conspiracies",
	icon_vend: "coffee-vend",
	products: null,
	contraband: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/coffee"),
	name: "１Solar's Best Hot Drinks",
	desc: "A vending machine which dispenses hot drinks.",
	icon_state: "coffee",
});

// vending.dm:725
rt.def("/obj/machinery/vending/coffee/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/coffee"), 25, T("/obj/item/weapon/reagent_containers/food/drinks/mug/tea"), 25, T("/obj/item/weapon/reagent_containers/food/drinks/mug/coco"), 25]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/ice"), 12]);
	return f.dot;
});

// vending.dm:735
rt.def("/obj/machinery/vending/snack/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/candy"), 6, T("/obj/item/weapon/reagent_containers/food/drinks/dry_ramen"), 6, T("/obj/item/weapon/reagent_containers/food/snacks/chips"), 6, T("/obj/item/weapon/reagent_containers/food/snacks/sosjerky"), 6, T("/obj/item/weapon/reagent_containers/food/snacks/no_raisin"), 6, T("/obj/item/weapon/reagent_containers/food/snacks/spacetwinkie"), 6, T("/obj/item/weapon/reagent_containers/food/snacks/cheesiehonkers"), 6]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/syndicake"), 6]);
	return f.dot;
});

rt.type(10641, "/obj/machinery/vending/snack/random", "/obj/machinery/vending/snack", {
	name: "１Random Snackies",
	desc: "Uh oh!",
});

// vending.dm:747
rt.def("/obj/machinery/vending/snack/random/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	let _T: Value = pick(typesof(T("/obj/machinery/vending/snack")) - T("/obj/machinery/vending/snack") - T("/obj/machinery/vending/snack/random"));
	yield* new_(_T, rt.getStep(f, this, 0));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10649, "/obj/machinery/vending/sustenance", "/obj/machinery/vending", {
	product_slogans: "Enjoy your meal.;Enough calories to support strenuous labor.",
	product_ads: "Sufficiently healthy.;Efficiently produced tofu!;Mmm! So good!;Have a meal.;You need food to live!;Have some more candy corn!;Try our new ice cups!",
	products: null,
	contraband: null,
	name: "１Sustenance Vendor",
	desc: "A vending machine which vends food, as required by section 47-C of the NT's Prisoner Ethical Treatment Agreement.",
	icon_state: "sustenance",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:770
rt.def("/obj/machinery/vending/sustenance/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/tofu"), 24, T("/obj/item/weapon/reagent_containers/food/drinks/ice"), 12, T("/obj/item/weapon/reagent_containers/food/snacks/candy_corn"), 6, T("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle"), 10]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/kitchen/knife"), 6, T("/obj/item/weapon/reagent_containers/food/drinks/coffee"), 12, T("/obj/item/weapon/tank/internals/emergency_oxygen"), 6, T("/obj/item/clothing/mask/breath"), 6]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10650, "/obj/machinery/vending/cola", "/obj/machinery/vending", {
	product_slogans: "Robust Softdrinks: More robust than a toolbox to the head!",
	product_ads: "Refreshing!;Hope you're thirsty!;Over 1 million drinks sold!;Thirsty? Why not cola?;Please, have a drink!;Drink up!;The best drinks in space.",
	products: null,
	contraband: null,
	premium: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/cola"),
	name: "１Robust Softdrinks",
	desc: "A softdrink vendor provided by Robust Industries, LLC.",
	icon_state: "Cola_Machine",
});

// vending.dm:787
rt.def("/obj/machinery/vending/cola/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/cola"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_mountain_wind"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/dr_gibb"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/starkist"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_up"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/pwr_game"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/lemon_lime"), 10, T("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle"), 10]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/thirteenloko"), 6, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/shamblers"), 6]);

	this.premium = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/nuka_cola"), 1, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/air"), 1]);
	return f.dot;
});

rt.type(10651, "/obj/machinery/vending/cola/random", "/obj/machinery/vending/cola", {
	name: "１Random Drinkies",
	desc: "Uh oh!",
});

// vending.dm:800
rt.def("/obj/machinery/vending/cola/random/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	let _T: Value = pick(typesof(T("/obj/machinery/vending/cola")) - T("/obj/machinery/vending/cola") - T("/obj/machinery/vending/cola/random"));
	yield* new_(_T, rt.getStep(f, this, 0));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10659, "/obj/machinery/vending/cola/shamblers", "/obj/machinery/vending/cola", {
	products: null,
	product_slogans: "~Shake me up some of that Shambler's Juice!~",
	product_ads: "Refreshing!;Jyrbv dv lg jfdv fw kyrk Jyrdscvi'j Alztv!;Over 1 trillion souls drank!;Thirsty? Nyp efk uizeb kyv uribevjj?;Kyv Jyrdscvi uizebj kyv ezxyk!;Drink up!;Krjkp.",
	name: "１Shambler's Vendor",
	desc: "~Shake me up some of that Shambler's Juice!~",
	icon_state: "shamblers_juice",
});

// vending.dm:842
rt.def("/obj/machinery/vending/cola/shamblers/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/cola"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_mountain_wind"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/dr_gibb"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/starkist"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_up"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/pwr_game"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/lemon_lime"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/shamblers"), 10]);
	return f.dot;
});

rt.type(10660, "/obj/machinery/vending/cart", "/obj/machinery/vending", {
	product_slogans: "Carts to go!",
	icon_deny: "cart-deny",
	products: null,
	name: "１PTech",
	desc: "Cartridges for PDAs",
	icon_state: "cart",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:857
rt.def("/obj/machinery/vending/cart/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/cartridge/medical"), 10, T("/obj/item/weapon/cartridge/engineering"), 10, T("/obj/item/weapon/cartridge/security"), 10, T("/obj/item/weapon/cartridge/janitor"), 10, T("/obj/item/weapon/cartridge/signal/toxins"), 10, T("/obj/item/device/pda/heads"), 10, T("/obj/item/weapon/cartridge/captain"), 3, T("/obj/item/weapon/cartridge/quartermaster"), 10]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10661, "/obj/machinery/vending/liberationstation", "/obj/machinery/vending", {
	product_slogans: "Liberation Station: Your one-stop shop for all things second ammendment!;Be a patriot today, pick up a gun!;Quality weapons for cheap prices!;Better dead than red!",
	product_ads: "Float like an astronaut, sting like a bullet!;Express your second ammendment today!;Guns don't kill people, but you can!;Who needs responsibilities when you have guns?",
	vend_reply: "Remember the name: Liberation Station!",
	products: null,
	premium: null,
	contraband: null,
	name: "１Liberation Station",
	desc: "An overwhelming amount of <b>ancient patriotism</b> washes over you just by looking at the machine.",
	icon_state: "liberationstation",
	req_access_txt: "1",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:871
rt.def("/obj/machinery/vending/liberationstation/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/gold"), 2, T("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/camo"), 2, T("/obj/item/weapon/gun/ballistic/automatic/pistol/m1911"), 2, T("/obj/item/weapon/gun/ballistic/automatic/proto/unrestricted"), 2, T("/obj/item/weapon/gun/ballistic/shotgun/automatic/combat"), 2, T("/obj/item/weapon/gun/ballistic/automatic/gyropistol"), 1, T("/obj/item/weapon/gun/ballistic/shotgun"), 2, T("/obj/item/weapon/gun/ballistic/automatic/ar"), 2]);

	this.premium = rt.alist(f, [T("/obj/item/ammo_box/magazine/smgm9mm"), 2, T("/obj/item/ammo_box/magazine/m50"), 4, T("/obj/item/ammo_box/magazine/m45"), 2, T("/obj/item/ammo_box/magazine/m75"), 2]);

	this.contraband = rt.alist(f, [T("/obj/item/clothing/under/patriotsuit"), 1, T("/obj/item/weapon/bedsheet/patriot"), 3]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10662, "/obj/machinery/vending/cigarette", "/obj/machinery/vending", {
	product_slogans: "Space cigs taste good like a cigarette should.;I'd rather toolbox than switch.;Smoke!;Don't believe the reports - smoke today!",
	product_ads: "Probably not bad for you!;Don't believe the scientists!;It's good for you!;Don't quit, buy more!;Smoke!;Nicotine heaven.;Best cigarettes since 2150.;Award-winning cigs.",
	products: null,
	contraband: null,
	premium: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/cigarette"),
	name: "１ShadyCigs Deluxe",
	desc: "If you want to get cancer, might as well do it in style.",
	icon_state: "cigs",
});

// vending.dm:886
rt.def("/obj/machinery/vending/cigarette/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/storage/fancy/cigarettes"), 5, T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_uplift"), 3, T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_robust"), 3, T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_carp"), 3, T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_midori"), 3, T("/obj/item/weapon/storage/box/matches"), 10, T("/obj/item/weapon/lighter/greyscale"), 4, T("/obj/item/weapon/storage/fancy/rollingpapers"), 5]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/lighter"), 3, T("/obj/item/clothing/mask/vape"), 5]);

	this.premium = rt.alist(f, [T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_robustgold"), 3, T("/obj/item/weapon/storage/fancy/cigarettes/cigars"), 1, T("/obj/item/weapon/storage/fancy/cigarettes/cigars/havana"), 1, T("/obj/item/weapon/storage/fancy/cigarettes/cigars/cohiba"), 1]);
	return f.dot;
});

// vending.dm:900
rt.def("/obj/machinery/vending/cigarette/proc/pre_throw", function pre_throw(f: Frame, I: Value) {
	let L: Value = null;
	if (!rt.istype(I, T("/obj/item/weapon/lighter"))) return f.dot;
	(L = I).set_lit(1);
	return f.dot;
});

rt.type(10663, "/obj/machinery/vending/medical", "/obj/machinery/vending", {
	icon_deny: "med-deny",
	product_ads: "Go save some lives!;The best stuff for your medbay.;Only the finest tools.;Natural chemicals!;This stuff saves lives.;Don't you want some?;Ping!",
	products: null,
	contraband: null,
	premium: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/medical"),
	name: "１NanoMed Plus",
	desc: "Medical drug dispenser.",
	icon_state: "med",
	req_access_txt: "5",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:911
rt.def("/obj/machinery/vending/medical/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/reagent_containers/syringe"), 12, T("/obj/item/weapon/reagent_containers/dropper"), 3, T("/obj/item/stack/medical/gauze"), 8, T("/obj/item/weapon/reagent_containers/pill/patch/styptic"), 5, T("/obj/item/weapon/reagent_containers/pill/insulin"), 10, T("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf"), 5, T("/obj/item/weapon/reagent_containers/glass/bottle/charcoal"), 4, T("/obj/item/weapon/reagent_containers/spray/medical/sterilizer"), 1, T("/obj/item/weapon/reagent_containers/glass/bottle/epinephrine"), 4, T("/obj/item/weapon/reagent_containers/glass/bottle/morphine"), 4, T("/obj/item/weapon/reagent_containers/glass/bottle/salglu_solution"), 3, T("/obj/item/weapon/reagent_containers/glass/bottle/toxin"), 3, T("/obj/item/weapon/reagent_containers/syringe/antiviral"), 6, T("/obj/item/weapon/reagent_containers/pill/salbutamol"), 2, T("/obj/item/device/healthanalyzer"), 4, T("/obj/item/device/sensor_device"), 2]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/reagent_containers/pill/tox"), 3, T("/obj/item/weapon/reagent_containers/pill/morphine"), 4, T("/obj/item/weapon/reagent_containers/pill/charcoal"), 6]);

	this.premium = rt.alist(f, [T("/obj/item/weapon/storage/box/hug/medical"), 1, T("/obj/item/weapon/reagent_containers/hypospray/medipen"), 3, T("/obj/item/weapon/storage/belt/medical"), 3, T("/obj/item/weapon/wrench/medical"), 1]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10664, "/obj/machinery/vending/plasmaresearch", "/obj/machinery/vending", {
	products: null,
	contraband: null,
	name: "１Toximate 3000",
	desc: "All the fine parts you need in one vending machine!",
});

// vending.dm:925
rt.def("/obj/machinery/vending/plasmaresearch/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/clothing/under/rank/scientist"), 6, T("/obj/item/clothing/suit/bio_suit"), 6, T("/obj/item/clothing/head/bio_hood"), 6, T("/obj/item/device/transfer_valve"), 6, T("/obj/item/device/assembly/timer"), 6, T("/obj/item/device/assembly/signaler"), 6, T("/obj/item/device/assembly/prox_sensor"), 6, T("/obj/item/device/assembly/igniter"), 6]);

	this.contraband = rt.alist(f, [T("/obj/item/device/assembly/health"), 3]);
	return f.dot;
});

rt.type(10665, "/obj/machinery/vending/wallmed", "/obj/machinery/vending", {
	icon_deny: "wallmed-deny",
	products: null,
	contraband: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/medical"),
	refill_count: 1,
	name: "１NanoMed",
	desc: "Wall-mounted Medical Equipment dispenser.",
	icon_state: "wallmed",
	density: 0,
	armor: null,
	resistance_flags: 2,
});

// vending.dm:936
rt.def("/obj/machinery/vending/wallmed/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/reagent_containers/syringe"), 3, T("/obj/item/weapon/reagent_containers/pill/patch/styptic"), 5, T("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf"), 5, T("/obj/item/weapon/reagent_containers/pill/charcoal"), 2, T("/obj/item/weapon/reagent_containers/spray/medical/sterilizer"), 1]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/reagent_containers/pill/tox"), 2, T("/obj/item/weapon/reagent_containers/pill/morphine"), 2]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10666, "/obj/machinery/vending/security", "/obj/machinery/vending", {
	product_ads: "Crack capitalist skulls!;Beat some heads in!;Don't forget - harm is good!;Your weapons are right here.;Handcuffs!;Freeze, scumbag!;Don't tase me bro!;Tase them, bro.;Why not have a donut?",
	icon_deny: "sec-deny",
	products: null,
	contraband: null,
	premium: null,
	name: "１SecTech",
	desc: "A security equipment vendor",
	icon_state: "sec",
	req_access_txt: "1",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:952
rt.def("/obj/machinery/vending/security/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/restraints/handcuffs"), 8, T("/obj/item/weapon/restraints/handcuffs/cable/zipties"), 10, T("/obj/item/weapon/grenade/flashbang"), 4, T("/obj/item/device/assembly/flash/handheld"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/donut"), 12, T("/obj/item/weapon/storage/box/evidence"), 6, T("/obj/item/device/flashlight/seclite"), 4, T("/obj/item/weapon/restraints/legcuffs/bola/energy"), 7]);

	this.contraband = rt.alist(f, [T("/obj/item/clothing/glasses/sunglasses"), 2, T("/obj/item/weapon/storage/fancy/donut_box"), 2]);

	this.premium = rt.alist(f, [T("/obj/item/weapon/coin/antagtoken"), 1]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

// vending.dm:960
rt.def("/obj/machinery/vending/security/proc/pre_throw", function* pre_throw(f: Frame, I: Value) {
	let G: Value = null, F: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/grenade"))) {
		yield* (G = I).preprime();
	} else {
		if (!rt.istype(I, T("/obj/item/device/flashlight"))) return f.dot;
		(F = I).on = 1;
		F.update_brightness();
	}
	return f.dot;
}, true);

rt.type(10667, "/obj/machinery/vending/hydronutrients", "/obj/machinery/vending", {
	product_slogans: "Aren't you glad you don't have to fertilize the natural way?;Now with 50% less stink!;Plants are people too!",
	product_ads: "We like plants!;Don't you want some?;The greenest thumbs ever.;We like big plants.;Soft soil...",
	icon_deny: "nutri-deny",
	products: null,
	contraband: null,
	name: "１NutriMax",
	desc: "A plant nutrients vendor.",
	icon_state: "nutri",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:975
rt.def("/obj/machinery/vending/hydronutrients/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/ez"), 30, T("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/l4z"), 20, T("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/rh"), 10, T("/obj/item/weapon/reagent_containers/spray/pestspray"), 20, T("/obj/item/weapon/reagent_containers/syringe"), 5, T("/obj/item/weapon/storage/bag/plants"), 5, T("/obj/item/weapon/cultivator"), 3, T("/obj/item/weapon/shovel/spade"), 3, T("/obj/item/device/plant_analyzer"), 4]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bottle/ammonia"), 10, T("/obj/item/weapon/reagent_containers/glass/bottle/diethylamine"), 5]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10668, "/obj/machinery/vending/hydroseeds", "/obj/machinery/vending", {
	product_slogans: "THIS'S WHERE TH' SEEDS LIVE! GIT YOU SOME!;Hands down the best seed selection on the station!;Also certain mushroom varieties available, more for experts! Get certified today!",
	product_ads: "We like plants!;Grow some crops!;Grow, baby, growww!;Aw h'yeah son!",
	products: null,
	contraband: null,
	premium: null,
	name: "１MegaSeed Servitor",
	desc: "When you need seeds fast!",
	icon_state: "seeds",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:987
rt.def("/obj/machinery/vending/hydroseeds/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/seeds/ambrosia"), 3, T("/obj/item/seeds/apple"), 3, T("/obj/item/seeds/banana"), 3, T("/obj/item/seeds/berry"), 3, T("/obj/item/seeds/cabbage"), 3, T("/obj/item/seeds/carrot"), 3, T("/obj/item/seeds/cherry"), 3, T("/obj/item/seeds/chanter"), 3, T("/obj/item/seeds/chili"), 3, T("/obj/item/seeds/cocoapod"), 3, T("/obj/item/seeds/coffee"), 3, T("/obj/item/seeds/corn"), 3, T("/obj/item/seeds/eggplant"), 3, T("/obj/item/seeds/grape"), 3, T("/obj/item/seeds/grass"), 3, T("/obj/item/seeds/lemon"), 3, T("/obj/item/seeds/lime"), 3, T("/obj/item/seeds/onion"), 3, T("/obj/item/seeds/orange"), 3, T("/obj/item/seeds/potato"), 3, T("/obj/item/seeds/poppy"), 3, T("/obj/item/seeds/pumpkin"), 3, T("/obj/item/seeds/replicapod"), 3, T("/obj/item/seeds/wheat/rice"), 3, T("/obj/item/seeds/soya"), 3, T("/obj/item/seeds/sunflower"), 3, T("/obj/item/seeds/tea"), 3, T("/obj/item/seeds/tobacco"), 3, T("/obj/item/seeds/tomato"), 3, T("/obj/item/seeds/tower"), 3, T("/obj/item/seeds/watermelon"), 3, T("/obj/item/seeds/wheat"), 3, T("/obj/item/seeds/whitebeet"), 3]);

	this.contraband = rt.alist(f, [T("/obj/item/seeds/amanita"), 2, T("/obj/item/seeds/glowshroom"), 2, T("/obj/item/seeds/liberty"), 2, T("/obj/item/seeds/nettle"), 2, T("/obj/item/seeds/plump"), 2, T("/obj/item/seeds/reishi"), 2, T("/obj/item/seeds/cannabis"), 3, T("/obj/item/seeds/starthistle"), 2, T("/obj/item/seeds/random"), 2]);

	this.premium = rt.alist(f, [T("/obj/item/weapon/reagent_containers/spray/waterflower"), 1]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10669, "/obj/machinery/vending/magivend", "/obj/machinery/vending", {
	product_slogans: "Sling spells the proper way with MagiVend!;Be your own Houdini! Use MagiVend!",
	vend_reply: "Have an enchanted evening!",
	product_ads: "FJKLFJSD;AJKFLBJAKL;1234 LOONIES LOL!;>MFW;Kill them fuckers!;GET DAT FUKKEN DISK;HONK!;EI NATH;Destroy the station!;Admin conspiracies since forever!;Space-time bending hardware!",
	products: null,
	contraband: null,
	name: "１MagiVend",
	desc: "A magic vending machine.",
	icon_state: "MagiVend",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:1009
rt.def("/obj/machinery/vending/magivend/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/clothing/head/wizard"), 1, T("/obj/item/clothing/suit/wizrobe"), 1, T("/obj/item/clothing/head/wizard/red"), 1, T("/obj/item/clothing/suit/wizrobe/red"), 1, T("/obj/item/clothing/head/wizard/yellow"), 1, T("/obj/item/clothing/suit/wizrobe/yellow"), 1, T("/obj/item/clothing/shoes/sandal/magic"), 1, T("/obj/item/weapon/staff"), 2]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bottle/wizarditis"), 1]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10670, "/obj/machinery/vending/autodrobe", "/obj/machinery/vending", {
	icon_deny: "theater-deny",
	product_slogans: "Dress for success!;Suited and booted!;It's show time!;Why leave style up to fate? Use AutoDrobe!",
	vend_reply: "Thank you for using AutoDrobe!",
	products: null,
	contraband: null,
	premium: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/autodrobe"),
	name: "１AutoDrobe",
	desc: "A vending machine for costumes.",
	icon_state: "theater",
	req_access_txt: "46",
});

// vending.dm:1022
rt.def("/obj/machinery/vending/autodrobe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/clothing/suit/chickensuit"), 1, T("/obj/item/clothing/head/chicken"), 1, T("/obj/item/clothing/under/gladiator"), 1, T("/obj/item/clothing/head/helmet/gladiator"), 1, T("/obj/item/clothing/under/gimmick/rank/captain/suit"), 1, T("/obj/item/clothing/head/flatcap"), 1, T("/obj/item/clothing/suit/toggle/labcoat/mad"), 1, T("/obj/item/clothing/shoes/jackboots"), 1, T("/obj/item/clothing/under/schoolgirl"), 1, T("/obj/item/clothing/under/schoolgirl/red"), 1, T("/obj/item/clothing/under/schoolgirl/green"), 1, T("/obj/item/clothing/under/schoolgirl/orange"), 1, T("/obj/item/clothing/head/kitty"), 1, T("/obj/item/clothing/under/skirt/black"), 1, T("/obj/item/clothing/head/beret"), 1, T("/obj/item/clothing/accessory/waistcoat"), 1, T("/obj/item/clothing/under/suit_jacket"), 1, T("/obj/item/clothing/head/that"), 1, T("/obj/item/clothing/under/kilt"), 1, T("/obj/item/clothing/head/beret"), 1, T("/obj/item/clothing/accessory/waistcoat"), 1, T("/obj/item/clothing/glasses/monocle"), 1, T("/obj/item/clothing/head/bowler"), 1, T("/obj/item/weapon/cane"), 1, T("/obj/item/clothing/under/sl_suit"), 1, T("/obj/item/clothing/mask/fakemoustache"), 1, T("/obj/item/clothing/suit/bio_suit/plaguedoctorsuit"), 1, T("/obj/item/clothing/head/plaguedoctorhat"), 1, T("/obj/item/clothing/mask/gas/plaguedoctor"), 1, T("/obj/item/clothing/suit/toggle/owlwings"), 1, T("/obj/item/clothing/under/owl"), 1, T("/obj/item/clothing/mask/gas/owl_mask"), 1, T("/obj/item/clothing/suit/toggle/owlwings/griffinwings"), 1, T("/obj/item/clothing/under/griffin"), 1, T("/obj/item/clothing/shoes/griffin"), 1, T("/obj/item/clothing/head/griffin"), 1, T("/obj/item/clothing/suit/apron"), 1, T("/obj/item/clothing/under/waiter"), 1, T("/obj/item/clothing/suit/jacket/miljacket"), 1, T("/obj/item/clothing/under/pirate"), 1, T("/obj/item/clothing/suit/pirate"), 1, T("/obj/item/clothing/head/pirate"), 1, T("/obj/item/clothing/head/bandana"), 1, T("/obj/item/clothing/head/bandana"), 1, T("/obj/item/clothing/under/soviet"), 1, T("/obj/item/clothing/head/ushanka"), 1, T("/obj/item/clothing/suit/imperium_monk"), 1, T("/obj/item/clothing/mask/gas/cyborg"), 1, T("/obj/item/clothing/suit/holidaypriest"), 1, T("/obj/item/clothing/head/wizard/marisa/fake"), 1, T("/obj/item/clothing/suit/wizrobe/marisa/fake"), 1, T("/obj/item/clothing/under/sundress"), 1, T("/obj/item/clothing/head/witchwig"), 1, T("/obj/item/weapon/staff/broom"), 1, T("/obj/item/clothing/suit/wizrobe/fake"), 1, T("/obj/item/clothing/head/wizard/fake"), 1, T("/obj/item/weapon/staff"), 3, T("/obj/item/clothing/mask/gas/sexyclown"), 1, T("/obj/item/clothing/under/rank/clown/sexy"), 1, T("/obj/item/clothing/mask/gas/sexymime"), 1, T("/obj/item/clothing/under/sexymime"), 1, T("/obj/item/clothing/mask/rat/bat"), 1, T("/obj/item/clothing/mask/rat/bee"), 1, T("/obj/item/clothing/mask/rat/bear"), 1, T("/obj/item/clothing/mask/rat/raven"), 1, T("/obj/item/clothing/mask/rat/jackal"), 1, T("/obj/item/clothing/mask/rat/fox"), 1, T("/obj/item/clothing/mask/rat/tribal"), 1, T("/obj/item/clothing/mask/rat"), 1, T("/obj/item/clothing/suit/apron/overalls"), 1, T("/obj/item/clothing/head/rabbitears"), 1, T("/obj/item/clothing/head/sombrero"), 1, T("/obj/item/clothing/head/sombrero/green"), 1, T("/obj/item/clothing/suit/poncho"), 1, T("/obj/item/clothing/suit/poncho/green"), 1, T("/obj/item/clothing/suit/poncho/red"), 1, T("/obj/item/clothing/under/maid"), 1, T("/obj/item/clothing/under/janimaid"), 1, T("/obj/item/clothing/glasses/cold"), 1, T("/obj/item/clothing/glasses/heat"), 1, T("/obj/item/clothing/suit/whitedress"), 1, T("/obj/item/clothing/under/jester"), 1, T("/obj/item/clothing/head/jester"), 1, T("/obj/item/clothing/under/villain"), 1, T("/obj/item/clothing/shoes/singery"), 1, T("/obj/item/clothing/under/singery"), 1, T("/obj/item/clothing/shoes/singerb"), 1, T("/obj/item/clothing/under/singerb"), 1, T("/obj/item/clothing/suit/hooded/carp_costume"), 1, T("/obj/item/clothing/suit/hooded/ian_costume"), 1, T("/obj/item/clothing/suit/hooded/bee_costume"), 1, T("/obj/item/clothing/suit/snowman"), 1, T("/obj/item/clothing/head/snowman"), 1, T("/obj/item/clothing/mask/joy"), 1, T("/obj/item/clothing/head/cueball"), 1, T("/obj/item/clothing/under/scratch"), 1, T("/obj/item/clothing/under/sailor"), 1]);

	this.contraband = rt.alist(f, [T("/obj/item/clothing/suit/judgerobe"), 1, T("/obj/item/clothing/head/powdered_wig"), 1, T("/obj/item/weapon/gun/magic/wand"), 2, T("/obj/item/clothing/glasses/sunglasses/garb"), 2, T("/obj/item/clothing/glasses/sunglasses/blindfold"), 1, T("/obj/item/clothing/mask/muzzle"), 2]);

	this.premium = rt.alist(f, [T("/obj/item/clothing/suit/pirate/captain"), 2, T("/obj/item/clothing/head/pirate/captain"), 2, T("/obj/item/clothing/head/helmet/roman"), 1, T("/obj/item/clothing/head/helmet/roman/legionaire"), 1, T("/obj/item/clothing/under/roman"), 1, T("/obj/item/clothing/shoes/roman"), 1, T("/obj/item/weapon/shield/riot/roman"), 1, T("/obj/item/weapon/skub"), 1]);
	return f.dot;
});

rt.type(10671, "/obj/machinery/vending/dinnerware", "/obj/machinery/vending", {
	product_ads: "Mm, food stuffs!;Food and food accessories.;Get your plates!;You like forks?;I like forks.;Woo, utensils.;You don't really need these...",
	products: null,
	contraband: null,
	name: "１Plasteel Chef's Dinnerware Vendor",
	desc: "A kitchen and restaurant equipment vendor",
	icon_state: "dinnerware",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:1064
rt.def("/obj/machinery/vending/dinnerware/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/storage/bag/tray"), 8, T("/obj/item/weapon/kitchen/fork"), 6, T("/obj/item/weapon/kitchen/knife"), 6, T("/obj/item/weapon/kitchen/rollingpin"), 2, T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"), 8, T("/obj/item/clothing/suit/apron/chef"), 2, T("/obj/item/weapon/reagent_containers/food/condiment/pack/ketchup"), 5, T("/obj/item/weapon/reagent_containers/food/condiment/pack/hotsauce"), 5, T("/obj/item/weapon/reagent_containers/food/condiment/saltshaker"), 5, T("/obj/item/weapon/reagent_containers/food/condiment/peppermill"), 5, T("/obj/item/weapon/reagent_containers/glass/bowl"), 20]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/kitchen/rollingpin"), 2, T("/obj/item/weapon/kitchen/knife/butcher"), 2]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10672, "/obj/machinery/vending/sovietsoda", "/obj/machinery/vending", {
	product_ads: "For Tsar and Country.;Have you fulfilled your nutrition quota today?;Very nice!;We are simple people, for this is all we eat.;If there is a person, there is a problem. If there is no person, then there is no problem.",
	products: null,
	contraband: null,
	name: "１BODA",
	desc: "Old sweet water vending machine",
	icon_state: "sovietsoda",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:1074
rt.def("/obj/machinery/vending/sovietsoda/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/soda"), 30]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/cola"), 20]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10673, "/obj/machinery/vending/tool", "/obj/machinery/vending", {
	icon_deny: "tool-deny",
	products: null,
	contraband: null,
	premium: null,
	name: "１YouTool",
	desc: "Tools for tools.",
	icon_state: "tool",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:1085
rt.def("/obj/machinery/vending/tool/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/stack/cable_coil/random"), 10, T("/obj/item/weapon/crowbar"), 5, T("/obj/item/weapon/weldingtool"), 3, T("/obj/item/weapon/wirecutters"), 5, T("/obj/item/weapon/wrench"), 5, T("/obj/item/device/analyzer"), 5, T("/obj/item/device/t_scanner"), 5, T("/obj/item/weapon/screwdriver"), 5, T("/obj/item/device/flashlight/glowstick"), 3, T("/obj/item/device/flashlight/glowstick/red"), 3, T("/obj/item/device/flashlight"), 5]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/weldingtool/hugetank"), 2, T("/obj/item/clothing/gloves/color/fyellow"), 2]);

	this.premium = rt.alist(f, [T("/obj/item/clothing/gloves/color/yellow"), 1]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 70]);
	return f.dot;
});

rt.type(10674, "/obj/machinery/vending/engivend", "/obj/machinery/vending", {
	icon_deny: "engivend-deny",
	products: null,
	contraband: null,
	premium: null,
	name: "１Engi-Vend",
	desc: "Spare tool vending. What? Did you expect some witty description?",
	icon_state: "engivend",
	req_access_txt: "11",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:1111
rt.def("/obj/machinery/vending/engivend/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/clothing/glasses/meson/engine"), 2, T("/obj/item/device/multitool"), 4, T("/obj/item/weapon/electronics/airlock"), 10, T("/obj/item/weapon/electronics/apc"), 10, T("/obj/item/weapon/electronics/airalarm"), 10, T("/obj/item/weapon/stock_parts/cell/high"), 10, T("/obj/item/weapon/construction/rcd/loaded"), 3, T("/obj/item/device/geiger_counter"), 5]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/stock_parts/cell/potato"), 3]);

	this.premium = rt.alist(f, [T("/obj/item/weapon/storage/belt/utility"), 3]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10675, "/obj/machinery/vending/engineering", "/obj/machinery/vending", {
	icon_deny: "engi-deny",
	products: null,
	name: "１Robco Tool Maker",
	desc: "Everything you need for do-it-yourself station repair.",
	icon_state: "engi",
	req_access_txt: "11",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:1124
rt.def("/obj/machinery/vending/engineering/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/clothing/under/rank/chief_engineer"), 4, T("/obj/item/clothing/under/rank/engineer"), 4, T("/obj/item/clothing/shoes/sneakers/orange"), 4, T("/obj/item/clothing/head/hardhat"), 4, T("/obj/item/weapon/storage/belt/utility"), 4, T("/obj/item/clothing/glasses/meson/engine"), 4, T("/obj/item/clothing/gloves/color/yellow"), 4, T("/obj/item/weapon/screwdriver"), 12, T("/obj/item/weapon/crowbar"), 12, T("/obj/item/weapon/wirecutters"), 12, T("/obj/item/device/multitool"), 12, T("/obj/item/weapon/wrench"), 12, T("/obj/item/device/t_scanner"), 12, T("/obj/item/weapon/stock_parts/cell"), 8, T("/obj/item/weapon/weldingtool"), 8, T("/obj/item/clothing/head/welding"), 8, T("/obj/item/weapon/light/tube"), 10, T("/obj/item/clothing/suit/fire"), 4, T("/obj/item/weapon/stock_parts/scanning_module"), 5, T("/obj/item/weapon/stock_parts/micro_laser"), 5, T("/obj/item/weapon/stock_parts/matter_bin"), 5, T("/obj/item/weapon/stock_parts/manipulator"), 5, T("/obj/item/weapon/stock_parts/console_screen"), 5]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10676, "/obj/machinery/vending/robotics", "/obj/machinery/vending", {
	icon_deny: "robotics-deny",
	products: null,
	name: "１Robotech Deluxe",
	desc: "All the tools you need to create your own robot army.",
	icon_state: "robotics",
	req_access_txt: "29",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:1140
rt.def("/obj/machinery/vending/robotics/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/clothing/suit/toggle/labcoat"), 4, T("/obj/item/clothing/under/rank/roboticist"), 4, T("/obj/item/stack/cable_coil"), 4, T("/obj/item/device/assembly/flash/handheld"), 4, T("/obj/item/weapon/stock_parts/cell/high"), 12, T("/obj/item/device/assembly/prox_sensor"), 3, T("/obj/item/device/assembly/signaler"), 3, T("/obj/item/device/healthanalyzer"), 3, T("/obj/item/weapon/scalpel"), 2, T("/obj/item/weapon/circular_saw"), 2, T("/obj/item/weapon/tank/internals/anesthetic"), 2, T("/obj/item/clothing/mask/breath/medical"), 5, T("/obj/item/weapon/screwdriver"), 5, T("/obj/item/weapon/crowbar"), 5]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(10677, "/obj/machinery/vending/clothing", "/obj/machinery/vending", {
	product_slogans: "Dress for success!;Prepare to look swagalicious!;Look at all this free swag!;Why leave style up to fate? Use the ClothesMate!",
	vend_reply: "Thank you for using the ClothesMate!",
	products: null,
	contraband: null,
	premium: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/clothing"),
	name: "ClothesMate",
	desc: "A vending machine for clothing.",
	icon_state: "clothes",
});

// vending.dm:1154
rt.def("/obj/machinery/vending/clothing/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/clothing/head/that"), 2, T("/obj/item/clothing/head/fedora"), 1, T("/obj/item/clothing/glasses/monocle"), 1, T("/obj/item/clothing/suit/jacket"), 2, T("/obj/item/clothing/suit/jacket/puffer/vest"), 2, T("/obj/item/clothing/suit/jacket/puffer"), 2, T("/obj/item/clothing/under/suit_jacket/navy"), 1, T("/obj/item/clothing/under/suit_jacket/really_black"), 1, T("/obj/item/clothing/under/suit_jacket/burgundy"), 1, T("/obj/item/clothing/under/suit_jacket/charcoal"), 1, T("/obj/item/clothing/under/suit_jacket/white"), 1, T("/obj/item/clothing/under/kilt"), 1, T("/obj/item/clothing/under/overalls"), 1, T("/obj/item/clothing/under/sl_suit"), 1, T("/obj/item/clothing/under/pants/jeans"), 3, T("/obj/item/clothing/under/pants/classicjeans"), 2, T("/obj/item/clothing/under/pants/camo"), 1, T("/obj/item/clothing/under/pants/blackjeans"), 2, T("/obj/item/clothing/under/pants/khaki"), 2, T("/obj/item/clothing/under/pants/white"), 2, T("/obj/item/clothing/under/pants/red"), 1, T("/obj/item/clothing/under/pants/black"), 2, T("/obj/item/clothing/under/pants/tan"), 2, T("/obj/item/clothing/under/pants/track"), 1, T("/obj/item/clothing/suit/jacket/miljacket"), 1, T("/obj/item/clothing/neck/tie/blue"), 1, T("/obj/item/clothing/neck/tie/red"), 1, T("/obj/item/clothing/neck/tie/black"), 1, T("/obj/item/clothing/neck/tie/horrible"), 1, T("/obj/item/clothing/neck/scarf/red"), 1, T("/obj/item/clothing/neck/scarf/green"), 1, T("/obj/item/clothing/neck/scarf/darkblue"), 1, T("/obj/item/clothing/neck/scarf/purple"), 1, T("/obj/item/clothing/neck/scarf/yellow"), 1, T("/obj/item/clothing/neck/scarf/orange"), 1, T("/obj/item/clothing/neck/scarf/cyan"), 1, T("/obj/item/clothing/neck/scarf"), 1, T("/obj/item/clothing/neck/scarf/black"), 1, T("/obj/item/clothing/neck/scarf/zebra"), 1, T("/obj/item/clothing/neck/scarf/christmas"), 1, T("/obj/item/clothing/neck/stripedredscarf"), 1, T("/obj/item/clothing/neck/stripedbluescarf"), 1, T("/obj/item/clothing/neck/stripedgreenscarf"), 1, T("/obj/item/clothing/accessory/waistcoat"), 1, T("/obj/item/clothing/under/skirt/black"), 1, T("/obj/item/clothing/under/skirt/blue"), 1, T("/obj/item/clothing/under/skirt/red"), 1, T("/obj/item/clothing/under/skirt/purple"), 1, T("/obj/item/clothing/under/sundress"), 2, T("/obj/item/clothing/under/stripeddress"), 1, T("/obj/item/clothing/under/sailordress"), 1, T("/obj/item/clothing/under/redeveninggown"), 1, T("/obj/item/clothing/under/blacktango"), 1, T("/obj/item/clothing/under/plaid_skirt"), 1, T("/obj/item/clothing/under/plaid_skirt/blue"), 1, T("/obj/item/clothing/under/plaid_skirt/purple"), 1, T("/obj/item/clothing/under/plaid_skirt/green"), 1, T("/obj/item/clothing/glasses/regular"), 1, T("/obj/item/clothing/glasses/regular/jamjar"), 1, T("/obj/item/clothing/head/sombrero"), 1, T("/obj/item/clothing/suit/poncho"), 1, T("/obj/item/clothing/suit/ianshirt"), 1, T("/obj/item/clothing/shoes/laceup"), 2, T("/obj/item/clothing/shoes/sneakers/black"), 4, T("/obj/item/clothing/shoes/sandal"), 1, T("/obj/item/clothing/gloves/fingerless"), 2, T("/obj/item/clothing/glasses/orange"), 1, T("/obj/item/clothing/glasses/red"), 1, T("/obj/item/weapon/storage/belt/fannypack"), 1, T("/obj/item/weapon/storage/belt/fannypack/blue"), 1, T("/obj/item/weapon/storage/belt/fannypack/red"), 1, T("/obj/item/clothing/suit/jacket/letterman"), 2, T("/obj/item/clothing/head/beanie"), 1, T("/obj/item/clothing/head/beanie/black"), 1, T("/obj/item/clothing/head/beanie/red"), 1, T("/obj/item/clothing/head/beanie/green"), 1, T("/obj/item/clothing/head/beanie/darkblue"), 1, T("/obj/item/clothing/head/beanie/purple"), 1, T("/obj/item/clothing/head/beanie/yellow"), 1, T("/obj/item/clothing/head/beanie/orange"), 1, T("/obj/item/clothing/head/beanie/cyan"), 1, T("/obj/item/clothing/head/beanie/christmas"), 1, T("/obj/item/clothing/head/beanie/striped"), 1, T("/obj/item/clothing/head/beanie/stripedred"), 1, T("/obj/item/clothing/head/beanie/stripedblue"), 1, T("/obj/item/clothing/head/beanie/stripedgreen"), 1, T("/obj/item/clothing/suit/jacket/letterman_red"), 1]);

	this.contraband = rt.alist(f, [T("/obj/item/clothing/under/syndicate/tacticool"), 1, T("/obj/item/clothing/mask/balaclava"), 1, T("/obj/item/clothing/head/ushanka"), 1, T("/obj/item/clothing/under/soviet"), 1, T("/obj/item/weapon/storage/belt/fannypack/black"), 2, T("/obj/item/clothing/suit/jacket/letterman_syndie"), 1, T("/obj/item/clothing/under/jabroni"), 1, T("/obj/item/clothing/suit/vapeshirt"), 1, T("/obj/item/clothing/under/geisha"), 1]);

	this.premium = rt.alist(f, [T("/obj/item/clothing/under/suit_jacket/checkered"), 1, T("/obj/item/clothing/head/mailman"), 1, T("/obj/item/clothing/under/rank/mailman"), 1, T("/obj/item/clothing/suit/jacket/leather"), 1, T("/obj/item/clothing/suit/jacket/leather/overcoat"), 1, T("/obj/item/clothing/under/pants/mustangjeans"), 1, T("/obj/item/clothing/neck/necklace/dope"), 3, T("/obj/item/clothing/suit/jacket/letterman_nanotrasen"), 1]);
	return f.dot;
});

rt.type(10678, "/obj/machinery/vending/toyliberationstation", "/obj/machinery/vending", {
	product_slogans: "Get your cool toys today!;Trigger a valid hunter today!;Quality toy weapons for cheap prices!;Give them to HoPs for all access!;Give them to HoS to get perma briged!",
	product_ads: "Feel robust with your toys!;Express your inner child today!;Toy weapons don't kill people, but valid hunters do!;Who needs responsibilities when you have toy weapons?;Make your next murder FUN!",
	vend_reply: "Come back for more!",
	products: null,
	contraband: null,
	name: "１Syndicate Donksoft Toy Vendor",
	desc: "A ages 8 and up approved vendor that dispenses toys. If you were to find the right wires, you can unlock the adult mode setting!",
	icon_state: "syndi",
	req_access_txt: "1",
	armor: null,
	resistance_flags: 2,
});

// vending.dm:1191
rt.def("/obj/machinery/vending/toyliberationstation/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.products = rt.alist(f, [T("/obj/item/weapon/gun/ballistic/automatic/toy/unrestricted"), 10, T("/obj/item/weapon/gun/ballistic/automatic/toy/pistol/unrestricted"), 10, T("/obj/item/weapon/gun/ballistic/shotgun/toy/unrestricted"), 10, T("/obj/item/toy/sword"), 10, T("/obj/item/ammo_box/foambox"), 20, T("/obj/item/toy/foamblade"), 10, T("/obj/item/toy/syndicateballoon"), 10, T("/obj/item/clothing/suit/syndicatefake"), 5, T("/obj/item/clothing/head/syndicatefake"), 5]);

	this.contraband = rt.alist(f, [T("/obj/item/weapon/gun/ballistic/shotgun/toy/crossbow"), 10, T("/obj/item/weapon/gun/ballistic/automatic/c20r/toy/unrestricted"), 10, T("/obj/item/weapon/gun/ballistic/automatic/l6_saw/toy/unrestricted"), 10, T("/obj/item/ammo_box/foambox/riot"), 20, T("/obj/item/toy/katana"), 10, T("/obj/item/weapon/twohanded/dualsaber/toy"), 5, T("/obj/item/toy/cards/deck/syndicate"), 10]);
	this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});
