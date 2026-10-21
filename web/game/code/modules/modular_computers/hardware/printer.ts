// From code/modules/modular_computers/hardware/printer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7598, "/obj/item/weapon/computer_hardware/printer", "/obj/item/weapon/computer_hardware", {
	stored_paper: 20,
	max_paper: 30,
	power_usage: 100,
	device_type: "PRINT",
	name: "printer",
	desc: "Computer-integrated printer with paper recycling module.",
	origin_tech: "programming=2;engineering=2",
	icon_state: "printer",
	w_class: 3,
});

// /obj/item/weapon/computer_hardware/printer/proc/diagnostics  (code/modules/modular_computers/hardware/printer.dm:13)
rt.def("/obj/item/weapon/computer_hardware/printer/proc/diagnostics", function diagnostics(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Paper level: ＀/＀", [rt.sv(f, "stored_paper"), rt.sv(f, "max_paper")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/computer_hardware/printer/proc/examine  (code/modules/modular_computers/hardware/printer.dm:17)
rt.def("/obj/item/weapon/computer_hardware/printer/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>Paper level: ＀/＀</span>", [rt.sv(f, "stored_paper"), rt.sv(f, "max_paper")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/computer_hardware/printer/proc/print_text  (code/modules/modular_computers/hardware/printer.dm:22)  may sleep
rt.def("/obj/item/weapon/computer_hardware/printer/proc/print_text", function* print_text(f: Frame, text_to_print: Value, paper_title: Value) {
	let _P: Value = null;
	f.vars = () => [text_to_print, paper_title, _P];
	if (live(paper_title) === null) {
		paper_title = "";
	}
	if (!truthy(rt.sv(f, "stored_paper"))) {
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "check_functionality")))) {
		return 0;
	}
	_P = (yield* g.new_(f, T("/obj/item/weapon/paper"), [rt.getStep(f, rt.sv(f, "holder"), 0)]));
	if (rt.gt(rt.sv(f, "damage"), rt.sv(f, "damage_malfunction"))) {
		rt.setFv(f, "info", live(_P), (yield* g.call(f, P("/proc/stars"), null, [live(text_to_print), subtract(100, rt.sv(f, "malfunction_probability"))])));
	} else {
		rt.setFv(f, "info", live(_P), live(text_to_print));
	}
	if (truthy(live(paper_title))) {
		rt.setFv(f, "name", live(_P), live(paper_title));
	}
	yield* g.callName(f, live(_P), "update_icon", []);
	yield* g.callName(f, live(_P), "reload_fields", []);
	rt.incSrcVar(f, "stored_paper", -1, true);
	_P = null;
	return 1;
}, true);

// /obj/item/weapon/computer_hardware/printer/proc/try_insert  (code/modules/modular_computers/hardware/printer.dm:43)  may sleep
rt.def("/obj/item/weapon/computer_hardware/printer/proc/try_insert", function* try_insert(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	if (live(user) === null) {
		user = null;
	}
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/paper")) ? 1 : 0))) {
		if (rt.ge(rt.sv(f, "stored_paper"), rt.sv(f, "max_paper"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You try to add ％！ into ＀, but its paper bin is full!</span>", [live(I), live(f.src)])]);
			return 0;
		}
		if ((truthy(live(user)) && !truthy((yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(I)]))))) {
			return 0;
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You insert ％！ into ＀'s paper recycler.</span>", [live(I), live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		rt.incSrcVar(f, "stored_paper", 1, true);
		return 1;
	}
	return 0;
}, true);
