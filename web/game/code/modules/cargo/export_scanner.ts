// From code/modules/cargo/export_scanner.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/device/export_scanner/proc/examine  (code/modules/cargo/export_scanner.dm:12)
rt.def("/obj/item/device/export_scanner/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "cargo_console"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>The ＀ is currently not linked to a cargo console.</span>", [live(f.src)])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/export_scanner/proc/afterattack  (code/modules/cargo/export_scanner.dm:17)  may sleep
rt.def("/obj/item/device/export_scanner/proc/afterattack", function* afterattack(f: Frame, O: Value, user: Value, proximity: Value) {
	let C: Value = null, price: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [O, user, proximity, C, price, $0, $1, $2, $3];
	if ((!truthy((rt.istype(live(O), T("/obj")) ? 1 : 0)) || !truthy(live(proximity)))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(O), T("/obj/machinery/computer/cargo")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "requestonly", (C = live(O))))) {
			rt.setSv(f, "cargo_console", live(C));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Scanner linked to ＀.</span>", [live(C)])]);
		}
	} else {
		if (!truthy((rt.istype(rt.sv(f, "cargo_console"), T("/obj/machinery/computer/cargo")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You must link ＀ to a cargo console first!</span>", [live(f.src)])]);
		} else {
			if (truthy((price = (yield* g.call(f, P("/proc/export_item_and_contents"), null, [null, live(O), null, rt.fv(f, "contraband", rt.sv(f, "cargo_console")), null, rt.fv(f, "emagged", rt.sv(f, "cargo_console")), "dry_run", 1], rt.Args.Named))))) {
				$0 = live(user);
				$1 = live(O);
				$2 = live(price);
				if (truthy(rt.getLen(f, rt.fv(f, "contents", live(O))))) {
					$3 = " (contents included)";
				} else {
					$3 = "";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Scanned ＀, value: <b>＀</b> credits＀.</span>", [$1, $2, $3])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Scanned ＀, no export value.</span>", [live(O)])]);
			}
		}
	}
	return f.dot;
}, true);
