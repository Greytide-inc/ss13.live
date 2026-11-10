// Based on /tg/station's code/modules/modular_computers/laptop_vendor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10955, "/obj/machinery/lapvend", "/obj/machinery", {
	fabricated_laptop: null,
	fabricated_tablet: null,
	state: 0,
	devtype: 0,
	total_price: 0,
	credits: 0,
	dev_cpu: 1,
	dev_battery: 1,
	dev_disk: 1,
	dev_netcard: 0,
	dev_apc_recharger: 0,
	dev_printer: 0,
	dev_card: 0,
	anchored: 1,
	name: "computer vendor",
	desc: "A vending machine with microfabricator capable of dispensing various NT-branded computers.",
	icon: rt.rsc("icons/obj/vending.dmi"),
	icon_state: "robotics",
	layer: 2.9,
	density: 1,
});

// laptop_vendor.dm:36
rt.def("/obj/machinery/lapvend/proc/reset_order", function* reset_order(f: Frame) {
	this.state = 0;
	this.devtype = 0;
	if (this.fabricated_laptop) {
		yield* qdel(this.fabricated_laptop);
		this.fabricated_laptop = null;
	}
	if (this.fabricated_tablet) {
		yield* qdel(this.fabricated_tablet);
		this.fabricated_tablet = null;
	}
	this.dev_cpu = 1;
	this.dev_battery = 1;
	this.dev_disk = 1;
	this.dev_netcard = 0;
	this.dev_apc_recharger = 0;
	this.dev_printer = 0;
	this.dev_card = 0;
	return f.dot;
}, true);

// laptop_vendor.dm:52
rt.def("/obj/machinery/lapvend/proc/fabricate_and_recalc_price", function* fabricate_and_recalc_price(f: Frame, fabricate: Value) {
	let battery_module: Value = null;
	fabricate ??= 0;
	this.total_price = 0;
	if (this.devtype == 1) {
		if (fabricate) {
			this.fabricated_laptop = (yield* new_(T("/obj/item/device/modular_computer/laptop/buildable"), this));
			yield* this.fabricated_laptop.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/battery"))));
			battery_module = rt.index(this.fabricated_laptop.all_components, "CELL");
		}
		this.total_price = 99;
		if (this.dev_cpu === 1) {
			if (fabricate) {
				yield* this.fabricated_laptop.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/processor_unit/small"))));
			}
		} else if (this.dev_cpu === 2) {
			if (fabricate) {
				yield* this.fabricated_laptop.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/processor_unit"))));
			}
			this.total_price += 299;
		}
		if (this.dev_battery === 1) {
			if (fabricate) {
				yield* battery_module.try_insert((yield* new_(T("/obj/item/weapon/stock_parts/cell/computer"))));
			}
		} else if (this.dev_battery === 2) {
			if (fabricate) {
				yield* battery_module.try_insert((yield* new_(T("/obj/item/weapon/stock_parts/cell/computer/advanced"))));
			}
			this.total_price += 199;
		} else if (this.dev_battery === 3) {
			if (fabricate) {
				yield* battery_module.try_insert((yield* new_(T("/obj/item/weapon/stock_parts/cell/computer/super"))));
			}
			this.total_price += 499;
		}
		if (this.dev_disk === 1) {
			if (fabricate) {
				yield* this.fabricated_laptop.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/hard_drive"))));
			}
		} else if (this.dev_disk === 2) {
			if (fabricate) {
				yield* this.fabricated_laptop.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/hard_drive/advanced"))));
			}
			this.total_price += 99;
		} else if (this.dev_disk === 3) {
			if (fabricate) {
				yield* this.fabricated_laptop.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/hard_drive/super"))));
			}
			this.total_price += 299;
		}
		if (this.dev_netcard === 1) {
			if (fabricate) {
				yield* this.fabricated_laptop.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/network_card"))));
			}
			this.total_price += 99;
		} else if (this.dev_netcard === 2) {
			if (fabricate) {
				yield* this.fabricated_laptop.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/network_card/advanced"))));
			}
			this.total_price += 299;
		}
		if (this.dev_apc_recharger) {
			this.total_price += 399;
			if (fabricate) {
				yield* this.fabricated_laptop.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/recharger/APC"))));
			}
		}
		if (this.dev_printer) {
			this.total_price += 99;
			if (fabricate) {
				yield* this.fabricated_laptop.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/printer/mini"))));
			}
		}
		if (this.dev_card) {
			this.total_price += 199;
			if (fabricate) {
				yield* this.fabricated_laptop.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/card_slot"))));
			}
		}
		return this.total_price;
	} else if (this.devtype == 2) {
		battery_module = null;
		if (fabricate) {
			this.fabricated_tablet = (yield* new_(T("/obj/item/device/modular_computer/tablet"), this));
			yield* this.fabricated_tablet.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/battery"))));
			yield* this.fabricated_tablet.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/processor_unit/small"))));
			battery_module = rt.index(this.fabricated_tablet.all_components, "CELL");
		}
		this.total_price = 199;
		if (this.dev_battery === 1) {
			if (fabricate) {
				yield* battery_module.try_insert((yield* new_(T("/obj/item/weapon/stock_parts/cell/computer/nano"))));
			}
		} else if (this.dev_battery === 2) {
			if (fabricate) {
				yield* battery_module.try_insert((yield* new_(T("/obj/item/weapon/stock_parts/cell/computer/micro"))));
			}
			this.total_price += 199;
		} else if (this.dev_battery === 3) {
			if (fabricate) {
				yield* battery_module.try_insert((yield* new_(T("/obj/item/weapon/stock_parts/cell/computer"))));
			}
			this.total_price += 499;
		}
		if (this.dev_disk === 1) {
			if (fabricate) {
				yield* this.fabricated_tablet.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/hard_drive/micro"))));
			}
		} else if (this.dev_disk === 2) {
			if (fabricate) {
				yield* this.fabricated_tablet.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/hard_drive/small"))));
			}
			this.total_price += 99;
		} else if (this.dev_disk === 3) {
			if (fabricate) {
				yield* this.fabricated_tablet.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/hard_drive"))));
			}
			this.total_price += 299;
		}
		if (this.dev_netcard === 1) {
			if (fabricate) {
				yield* this.fabricated_tablet.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/network_card"))));
			}
			this.total_price += 99;
		} else if (this.dev_netcard === 2) {
			if (fabricate) {
				yield* this.fabricated_tablet.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/network_card/advanced"))));
			}
			this.total_price += 299;
		}
		if (this.dev_printer) {
			this.total_price += 99;
			if (fabricate) {
				yield* this.fabricated_tablet.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/printer"))));
			}
		}
		if (this.dev_card) {
			this.total_price += 199;
			if (fabricate) {
				yield* this.fabricated_tablet.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/card_slot"))));
			}
		}
		return this.total_price;
	}
	return 0;
}, true);

// laptop_vendor.dm:171
rt.def("/obj/machinery/lapvend/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if (yield* parent_proc()) {
		return 1;
	}
	if (action === "pick_device") {
		if (this.state) {
			return 0;
		}
		this.devtype = text2num(rt.at(params, "pick"));
		this.state = 1;
		yield* this.fabricate_and_recalc_price(0);
		return 1;
	} else if (action === "clean_order") {
		yield* this.reset_order();
		return 1;
	} else if (action === "purchase") {
		yield* this.try_purchase();
		return 1;
	}
	if (this.state != 1 && this.devtype) {
		return 0;
	}
	if (action === "confirm_order") {
		this.state = 2;
		yield* this.fabricate_and_recalc_price(0);
		return 1;
	} else if (action === "hw_cpu") {
		this.dev_cpu = text2num(rt.at(params, "cpu"));
		yield* this.fabricate_and_recalc_price(0);
		return 1;
	} else if (action === "hw_battery") {
		this.dev_battery = text2num(rt.at(params, "battery"));
		yield* this.fabricate_and_recalc_price(0);
		return 1;
	} else if (action === "hw_disk") {
		this.dev_disk = text2num(rt.at(params, "disk"));
		yield* this.fabricate_and_recalc_price(0);
		return 1;
	} else if (action === "hw_netcard") {
		this.dev_netcard = text2num(rt.at(params, "netcard"));
		yield* this.fabricate_and_recalc_price(0);
		return 1;
	} else if (action === "hw_tesla") {
		this.dev_apc_recharger = text2num(rt.at(params, "tesla"));
		yield* this.fabricate_and_recalc_price(0);
		return 1;
	} else if (action === "hw_nanoprint") {
		this.dev_printer = text2num(rt.at(params, "print"));
		yield* this.fabricate_and_recalc_price(0);
		return 1;
	} else if (action === "hw_card") {
		this.dev_card = text2num(rt.at(params, "card"));
		yield* this.fabricate_and_recalc_price(0);
		return 1;
	}
	return 0;
}, true);

// laptop_vendor.dm:226
rt.def("/obj/machinery/lapvend/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// laptop_vendor.dm:229
rt.def("/obj/machinery/lapvend/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (rt.bitAnd(this.stat, 11)) {
		if (ui) {
			yield* ui.close();
		}
		return 0;
	}
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "computer_fabricator", "Personal Computer Vendor", 500, 400, { state: state }))).open();
	yield* ui.set_autoupdate({ state: 1 });
	return f.dot;
}, true);

// laptop_vendor.dm:244
rt.def("/obj/machinery/lapvend/proc/attackby", function* attackby(f: Frame, I: Value, user: Value) {
	let c: Value = null;
	if (rt.istype(I, T("/obj/item/stack/spacecash"))) {
		c = I;
		if (!(yield* user.drop_item(c))) {
			return f.dot;
		}
		this.credits += rt.fv(f, "value", c);
		this.visible_message(`<span class='info'><span class='name'>${f.usr}</span> inserts ${rt.fv(f, "value", c)} credits into the ${this}.</span>`);
		yield* qdel(c);
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// laptop_vendor.dm:259
rt.def("/obj/machinery/lapvend/proc/process_payment", function* process_payment(f: Frame) {
	if (this.total_price > this.credits) {
		yield* this.say("Insufficient credits.");
		return 0;
	} else {
		return 1;
	}
}, true);

// laptop_vendor.dm:267
rt.def("/obj/machinery/lapvend/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	rt.setAt((data = list()), "state", this.state);
	if (this.state == 1) {
		rt.setAt(data, "devtype", this.devtype);
		rt.setAt(data, "hw_battery", this.dev_battery);
		rt.setAt(data, "hw_disk", this.dev_disk);
		rt.setAt(data, "hw_netcard", this.dev_netcard);
		rt.setAt(data, "hw_tesla", this.dev_apc_recharger);
		rt.setAt(data, "hw_nanoprint", this.dev_printer);
		rt.setAt(data, "hw_card", this.dev_card);
		rt.setAt(data, "hw_cpu", this.dev_cpu);
	}
	if (this.state == 1 || this.state == 2) {
		rt.setAt(data, "totalprice", this.total_price);
		rt.setAt(data, "credits", this.credits);
	}
	return data;
});

// laptop_vendor.dm:287
rt.def("/obj/machinery/lapvend/proc/try_purchase", function* try_purchase(f: Frame) {
	if (this.state != 2) return f.dot;
	if (yield* this.process_payment()) {
		yield* this.fabricate_and_recalc_price(1);
		if (this.devtype == 1 && this.fabricated_laptop) {
			yield* this.fabricated_laptop.forceMove(this.loc);
			this.fabricated_laptop = null;
		} else if (this.devtype == 2 && this.fabricated_tablet) {
			yield* this.fabricated_tablet.forceMove(this.loc);
			this.fabricated_tablet = null;
		}
		this.credits -= this.total_price;
		yield* this.say("Enjoy your new product!");
		this.state = 3;
		return 1;
	}
	return 0;
}, true);
