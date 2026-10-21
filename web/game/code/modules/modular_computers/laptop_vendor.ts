// From code/modules/modular_computers/laptop_vendor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/lapvend/proc/reset_order  (code/modules/modular_computers/laptop_vendor.dm:36)  may sleep
rt.def("/obj/machinery/lapvend/proc/reset_order", function* reset_order(f: Frame) {
	rt.setSv(f, "state", 0);
	rt.setSv(f, "devtype", 0);
	if (truthy(rt.sv(f, "fabricated_laptop"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "fabricated_laptop")]);
		rt.setSv(f, "fabricated_laptop", null);
	}
	if (truthy(rt.sv(f, "fabricated_tablet"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "fabricated_tablet")]);
		rt.setSv(f, "fabricated_tablet", null);
	}
	rt.setSv(f, "dev_cpu", 1);
	rt.setSv(f, "dev_battery", 1);
	rt.setSv(f, "dev_disk", 1);
	rt.setSv(f, "dev_netcard", 0);
	rt.setSv(f, "dev_apc_recharger", 0);
	rt.setSv(f, "dev_printer", 0);
	rt.setSv(f, "dev_card", 0);
	return f.dot;
}, true);

// /obj/machinery/lapvend/proc/fabricate_and_recalc_price  (code/modules/modular_computers/laptop_vendor.dm:52)  may sleep
rt.def("/obj/machinery/lapvend/proc/fabricate_and_recalc_price", function* fabricate_and_recalc_price(f: Frame, fabricate: Value) {
	let battery_module: Value = null;
	let $0: any;
	f.vars = () => [fabricate, battery_module, $0];
	if (live(fabricate) === null) {
		fabricate = 0;
	}
	rt.setSv(f, "total_price", 0);
	if (isEqual(rt.sv(f, "devtype"), 1)) {
		battery_module = null;
		if (truthy(live(fabricate))) {
			rt.setSv(f, "fabricated_laptop", (yield* g.new_(f, T("/obj/item/device/modular_computer/laptop/buildable"), [live(f.src)])));
			yield* g.callName(f, rt.sv(f, "fabricated_laptop"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/battery"), []))]);
			battery_module = rt.index(rt.fv(f, "all_components", rt.sv(f, "fabricated_laptop")), "CELL");
		}
		rt.setSv(f, "total_price", 99);
		$0 = rt.sv(f, "dev_cpu");
		if ($0 === 1) {
			if (truthy(live(fabricate))) {
				yield* g.callName(f, rt.sv(f, "fabricated_laptop"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/processor_unit/small"), []))]);
			}
		} else if ($0 === 2) {
			if (truthy(live(fabricate))) {
				yield* g.callName(f, rt.sv(f, "fabricated_laptop"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/processor_unit"), []))]);
			}
			rt.modSrcVar(f, "total_price", 299, add);
		}
		$0 = rt.sv(f, "dev_battery");
		if ($0 === 1) {
			if (truthy(live(fabricate))) {
				yield* g.callName(f, live(battery_module), "try_insert", [(yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/computer"), []))]);
			}
		} else if ($0 === 2) {
			if (truthy(live(fabricate))) {
				yield* g.callName(f, live(battery_module), "try_insert", [(yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/computer/advanced"), []))]);
			}
			rt.modSrcVar(f, "total_price", 199, add);
		} else if ($0 === 3) {
			if (truthy(live(fabricate))) {
				yield* g.callName(f, live(battery_module), "try_insert", [(yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/computer/super"), []))]);
			}
			rt.modSrcVar(f, "total_price", 499, add);
		}
		$0 = rt.sv(f, "dev_disk");
		if ($0 === 1) {
			if (truthy(live(fabricate))) {
				yield* g.callName(f, rt.sv(f, "fabricated_laptop"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/hard_drive"), []))]);
			}
		} else if ($0 === 2) {
			if (truthy(live(fabricate))) {
				yield* g.callName(f, rt.sv(f, "fabricated_laptop"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/hard_drive/advanced"), []))]);
			}
			rt.modSrcVar(f, "total_price", 99, add);
		} else if ($0 === 3) {
			if (truthy(live(fabricate))) {
				yield* g.callName(f, rt.sv(f, "fabricated_laptop"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/hard_drive/super"), []))]);
			}
			rt.modSrcVar(f, "total_price", 299, add);
		}
		$0 = rt.sv(f, "dev_netcard");
		if ($0 === 1) {
			if (truthy(live(fabricate))) {
				yield* g.callName(f, rt.sv(f, "fabricated_laptop"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/network_card"), []))]);
			}
			rt.modSrcVar(f, "total_price", 99, add);
		} else if ($0 === 2) {
			if (truthy(live(fabricate))) {
				yield* g.callName(f, rt.sv(f, "fabricated_laptop"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/network_card/advanced"), []))]);
			}
			rt.modSrcVar(f, "total_price", 299, add);
		}
		if (truthy(rt.sv(f, "dev_apc_recharger"))) {
			rt.modSrcVar(f, "total_price", 399, add);
			if (truthy(live(fabricate))) {
				yield* g.callName(f, rt.sv(f, "fabricated_laptop"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/recharger/APC"), []))]);
			}
		}
		if (truthy(rt.sv(f, "dev_printer"))) {
			rt.modSrcVar(f, "total_price", 99, add);
			if (truthy(live(fabricate))) {
				yield* g.callName(f, rt.sv(f, "fabricated_laptop"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/printer/mini"), []))]);
			}
		}
		if (truthy(rt.sv(f, "dev_card"))) {
			rt.modSrcVar(f, "total_price", 199, add);
			if (truthy(live(fabricate))) {
				yield* g.callName(f, rt.sv(f, "fabricated_laptop"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/card_slot"), []))]);
			}
		}
		return rt.sv(f, "total_price");
	} else {
		if (isEqual(rt.sv(f, "devtype"), 2)) {
			battery_module = null;
			if (truthy(live(fabricate))) {
				rt.setSv(f, "fabricated_tablet", (yield* g.new_(f, T("/obj/item/device/modular_computer/tablet"), [live(f.src)])));
				yield* g.callName(f, rt.sv(f, "fabricated_tablet"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/battery"), []))]);
				yield* g.callName(f, rt.sv(f, "fabricated_tablet"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/processor_unit/small"), []))]);
				battery_module = rt.index(rt.fv(f, "all_components", rt.sv(f, "fabricated_tablet")), "CELL");
			}
			rt.setSv(f, "total_price", 199);
			$0 = rt.sv(f, "dev_battery");
			if ($0 === 1) {
				if (truthy(live(fabricate))) {
					yield* g.callName(f, live(battery_module), "try_insert", [(yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/computer/nano"), []))]);
				}
			} else if ($0 === 2) {
				if (truthy(live(fabricate))) {
					yield* g.callName(f, live(battery_module), "try_insert", [(yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/computer/micro"), []))]);
				}
				rt.modSrcVar(f, "total_price", 199, add);
			} else if ($0 === 3) {
				if (truthy(live(fabricate))) {
					yield* g.callName(f, live(battery_module), "try_insert", [(yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/computer"), []))]);
				}
				rt.modSrcVar(f, "total_price", 499, add);
			}
			$0 = rt.sv(f, "dev_disk");
			if ($0 === 1) {
				if (truthy(live(fabricate))) {
					yield* g.callName(f, rt.sv(f, "fabricated_tablet"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/hard_drive/micro"), []))]);
				}
			} else if ($0 === 2) {
				if (truthy(live(fabricate))) {
					yield* g.callName(f, rt.sv(f, "fabricated_tablet"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/hard_drive/small"), []))]);
				}
				rt.modSrcVar(f, "total_price", 99, add);
			} else if ($0 === 3) {
				if (truthy(live(fabricate))) {
					yield* g.callName(f, rt.sv(f, "fabricated_tablet"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/hard_drive"), []))]);
				}
				rt.modSrcVar(f, "total_price", 299, add);
			}
			$0 = rt.sv(f, "dev_netcard");
			if ($0 === 1) {
				if (truthy(live(fabricate))) {
					yield* g.callName(f, rt.sv(f, "fabricated_tablet"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/network_card"), []))]);
				}
				rt.modSrcVar(f, "total_price", 99, add);
			} else if ($0 === 2) {
				if (truthy(live(fabricate))) {
					yield* g.callName(f, rt.sv(f, "fabricated_tablet"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/network_card/advanced"), []))]);
				}
				rt.modSrcVar(f, "total_price", 299, add);
			}
			if (truthy(rt.sv(f, "dev_printer"))) {
				rt.modSrcVar(f, "total_price", 99, add);
				if (truthy(live(fabricate))) {
					yield* g.callName(f, rt.sv(f, "fabricated_tablet"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/printer"), []))]);
				}
			}
			if (truthy(rt.sv(f, "dev_card"))) {
				rt.modSrcVar(f, "total_price", 199, add);
				if (truthy(live(fabricate))) {
					yield* g.callName(f, rt.sv(f, "fabricated_tablet"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/card_slot"), []))]);
				}
			}
			return rt.sv(f, "total_price");
		}
	}
	return 0;
}, true);

// /obj/machinery/lapvend/proc/ui_act  (code/modules/modular_computers/laptop_vendor.dm:171)  may sleep
rt.def("/obj/machinery/lapvend/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	$0 = live(f.args[0]);
	if ($0 === "pick_device") {
		if (truthy(rt.sv(f, "state"))) {
			return 0;
		}
		rt.setSv(f, "devtype", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "pick")])));
		rt.setSv(f, "state", 1);
		yield* g.srcCall(f, "fabricate_and_recalc_price", 0);
		return 1;
	} else if ($0 === "clean_order") {
		yield* g.srcCall(f, "reset_order");
		return 1;
	} else if ($0 === "purchase") {
		yield* g.srcCall(f, "try_purchase");
		return 1;
	}
	if ((!isEqual(rt.sv(f, "state"), 1) && truthy(rt.sv(f, "devtype")))) {
		return 0;
	}
	$0 = live(f.args[0]);
	if ($0 === "confirm_order") {
		rt.setSv(f, "state", 2);
		yield* g.srcCall(f, "fabricate_and_recalc_price", 0);
		return 1;
	} else if ($0 === "hw_cpu") {
		rt.setSv(f, "dev_cpu", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "cpu")])));
		yield* g.srcCall(f, "fabricate_and_recalc_price", 0);
		return 1;
	} else if ($0 === "hw_battery") {
		rt.setSv(f, "dev_battery", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "battery")])));
		yield* g.srcCall(f, "fabricate_and_recalc_price", 0);
		return 1;
	} else if ($0 === "hw_disk") {
		rt.setSv(f, "dev_disk", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "disk")])));
		yield* g.srcCall(f, "fabricate_and_recalc_price", 0);
		return 1;
	} else if ($0 === "hw_netcard") {
		rt.setSv(f, "dev_netcard", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "netcard")])));
		yield* g.srcCall(f, "fabricate_and_recalc_price", 0);
		return 1;
	} else if ($0 === "hw_tesla") {
		rt.setSv(f, "dev_apc_recharger", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "tesla")])));
		yield* g.srcCall(f, "fabricate_and_recalc_price", 0);
		return 1;
	} else if ($0 === "hw_nanoprint") {
		rt.setSv(f, "dev_printer", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "print")])));
		yield* g.srcCall(f, "fabricate_and_recalc_price", 0);
		return 1;
	} else if ($0 === "hw_card") {
		rt.setSv(f, "dev_card", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "card")])));
		yield* g.srcCall(f, "fabricate_and_recalc_price", 0);
		return 1;
	}
	return 0;
}, true, { args: ["action", "params"] });

// /obj/machinery/lapvend/proc/attack_hand  (code/modules/modular_computers/laptop_vendor.dm:226)  may sleep
rt.def("/obj/machinery/lapvend/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/lapvend/proc/ui_interact  (code/modules/modular_computers/laptop_vendor.dm:229)  may sleep
rt.def("/obj/machinery/lapvend/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 11))) {
		if (truthy(live(ui))) {
			yield* g.callName(f, live(ui), "close", []);
		}
		return 0;
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [null, live(user), null, live(f.src), null, live(ui_key), null, "computer_fabricator", null, "Personal Computer Vendor", null, 500, null, 400, "state", live(state)], rt.Args.Named))), "open", []);
	yield* g.callName(f, live(ui), "set_autoupdate", ["state", 1], rt.Args.Named);
	return f.dot;
}, true);

// /obj/machinery/lapvend/proc/attackby  (code/modules/modular_computers/laptop_vendor.dm:244)  may sleep
rt.def("/obj/machinery/lapvend/proc/attackby", function* attackby(f: Frame) {
	let c: Value = null;
	f.vars = () => [c];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/spacecash")) ? 1 : 0))) {
		c = live(f.args[0]);
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [live(c)])))) {
			return live(f.dot);
		}
		rt.modSrcVar(f, "credits", rt.fv(f, "value", live(c)), add);
		yield* g.srcCall(f, "visible_message", fmt("<span class='info'><span class='name'>＀</span> inserts ＀ credits into the ＀.</span>", [live(f.usr), rt.fv(f, "value", live(c)), live(f.src)]));
		yield* g.call(f, P("/proc/qdel"), null, [live(c)]);
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user"] });

// /obj/machinery/lapvend/proc/process_payment  (code/modules/modular_computers/laptop_vendor.dm:259)  may sleep
rt.def("/obj/machinery/lapvend/proc/process_payment", function* process_payment(f: Frame) {
	if (rt.gt(rt.sv(f, "total_price"), rt.sv(f, "credits"))) {
		yield* g.srcCall(f, "say", "Insufficient credits.");
		return 0;
	} else {
		return 1;
	}
	return f.dot;
}, true);

// /obj/machinery/lapvend/proc/ui_data  (code/modules/modular_computers/laptop_vendor.dm:267)
rt.def("/obj/machinery/lapvend/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	f.vars = () => [data];
	rt.setAt((data = rt.list()), "state", rt.sv(f, "state"));
	if (isEqual(rt.sv(f, "state"), 1)) {
		rt.setAt(live(data), "devtype", rt.sv(f, "devtype"));
		rt.setAt(live(data), "hw_battery", rt.sv(f, "dev_battery"));
		rt.setAt(live(data), "hw_disk", rt.sv(f, "dev_disk"));
		rt.setAt(live(data), "hw_netcard", rt.sv(f, "dev_netcard"));
		rt.setAt(live(data), "hw_tesla", rt.sv(f, "dev_apc_recharger"));
		rt.setAt(live(data), "hw_nanoprint", rt.sv(f, "dev_printer"));
		rt.setAt(live(data), "hw_card", rt.sv(f, "dev_card"));
		rt.setAt(live(data), "hw_cpu", rt.sv(f, "dev_cpu"));
	}
	if ((isEqual(rt.sv(f, "state"), 1) || isEqual(rt.sv(f, "state"), 2))) {
		rt.setAt(live(data), "totalprice", rt.sv(f, "total_price"));
		rt.setAt(live(data), "credits", rt.sv(f, "credits"));
	}
	return live(data);
});

// /obj/machinery/lapvend/proc/try_purchase  (code/modules/modular_computers/laptop_vendor.dm:287)  may sleep
rt.def("/obj/machinery/lapvend/proc/try_purchase", function* try_purchase(f: Frame) {
	if (!isEqual(rt.sv(f, "state"), 2)) return f.dot;
	if (truthy((yield* g.srcCall(f, "process_payment")))) {
		yield* g.srcCall(f, "fabricate_and_recalc_price", 1);
		if ((isEqual(rt.sv(f, "devtype"), 1) && truthy(rt.sv(f, "fabricated_laptop")))) {
			yield* g.callName(f, rt.sv(f, "fabricated_laptop"), "forceMove", [rt.fv(f, "loc", live(f.src))]);
			rt.setSv(f, "fabricated_laptop", null);
		} else {
			if ((isEqual(rt.sv(f, "devtype"), 2) && truthy(rt.sv(f, "fabricated_tablet")))) {
				yield* g.callName(f, rt.sv(f, "fabricated_tablet"), "forceMove", [rt.fv(f, "loc", live(f.src))]);
				rt.setSv(f, "fabricated_tablet", null);
			}
		}
		(rt.modSrcVar(f, "credits", rt.sv(f, "total_price"), subtract));
		yield* g.srcCall(f, "say", "Enjoy your new product!");
		rt.setSv(f, "state", 3);
		return 1;
	}
	return 0;
}, true);
