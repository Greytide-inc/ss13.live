// Based on /tg/station's code/modules/cargo/export_scanner.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9388, "/obj/item/device/export_scanner", "/obj/item/device", {
	cargo_console: null,
	flags: 4,
	name: "export scanner",
	desc: "A device used to check objects against Nanotrasen exports database.",
	icon_state: "export_scanner",
	item_state: "radio",
	w_class: 2,
	siemens_coefficient: 1,
});

// export_scanner.dm:12
rt.def("/obj/item/device/export_scanner/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.cargo_console) return f.dot;
	to_chat(user, `<span class='notice'>The ${this} is currently not linked to a cargo console.</span>`);
	return f.dot;
}, false);

// export_scanner.dm:17
rt.def("/obj/item/device/export_scanner/proc/afterattack", function* afterattack(f: Frame, O: Value, user: Value, proximity: Value) {
	let C: Value = null, price: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	if (!rt.istype(O, T("/obj")) || !proximity) {
		return f.dot;
	}
	if (rt.istype(O, T("/obj/machinery/computer/cargo"))) {
		if (!(C = O).requestonly) {
			this.cargo_console = C;
			to_chat(user, `<span class='notice'>Scanner linked to ${C}.</span>`);
		}
	} else if (!rt.istype(this.cargo_console, T("/obj/machinery/computer/cargo"))) {
		to_chat(user, `<span class='warning'>You must link ${this} to a cargo console first!</span>`);
	} else if (price = (yield* export_item_and_contents(O, this.cargo_console.contraband, this.cargo_console.emagged, { dry_run: 1 }))) {
		$0 = user;
		$1 = O;
		$2 = price;
		if (rt.len(f, O.contents)) {
			$3 = " (contents included)";
		} else {
			$3 = "";
		}
		to_chat($0, `<span class='notice'>Scanned ${$1}, value: <b>${$2}</b> credits${$3}.</span>`);
	} else {
		to_chat(user, `<span class='warning'>Scanned ${O}, no export value.</span>`);
	}
	return f.dot;
}, true);
