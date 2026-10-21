// From code/game/gamemodes/miniantags/abduction/machinery/dispenser.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10439, "/obj/machinery/abductor/gland_dispenser", "/obj/machinery/abductor", {
	gland_types: null,
	gland_colors: null,
	amounts: null,
	anchored: 1,
	name: "replacement organ storage",
	desc: "A tank filled with replacement organs.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "dispenser",
	density: 1,
});

// /obj/machinery/abductor/gland_dispenser/proc/random_color  (code/game/gamemodes/miniantags/abduction/machinery/dispenser.dm:14)
rt.def("/obj/machinery/abductor/gland_dispenser/proc/random_color", function random_color(f: Frame) {
	return rt.op(f, "Rgb", [1, 3], [rt.call(f, P("/proc/rand"), null, [0, 255]), rt.call(f, P("/proc/rand"), null, [0, 255]), rt.call(f, P("/proc/rand"), null, [0, 255])]);
});

// /obj/machinery/abductor/gland_dispenser/proc/New  (code/game/gamemodes/miniantags/abduction/machinery/dispenser.dm:17)  may sleep
rt.def("/obj/machinery/abductor/gland_dispenser/proc/New", function* New(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "gland_types", subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/organ/heart/gland")])), T("/obj/item/organ/heart/gland")));
	rt.setSv(f, "gland_types", (yield* g.call(f, P("/proc/shuffle"), null, [rt.sv(f, "gland_types")])));
	rt.setSv(f, "gland_colors", (yield* g.new_(f, T("/list"), [rt.len(f, rt.sv(f, "gland_types"))])));
	rt.setSv(f, "amounts", (yield* g.new_(f, T("/list"), [rt.len(f, rt.sv(f, "gland_types"))])));
	i = null;
	i = 1;
	while (rt.le(live(i), rt.len(f, rt.sv(f, "gland_types")))) {
		rt.setAt(rt.sv(f, "gland_colors"), live(i), (yield* g.srcCall(f, "random_color")));
		rt.setAt(rt.sv(f, "amounts"), live(i), (yield* g.call(f, P("/proc/rand"), null, [1, 5])));
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

// /obj/machinery/abductor/gland_dispenser/proc/attack_hand  (code/game/gamemodes/miniantags/abduction/machinery/dispenser.dm:27)  may sleep
rt.def("/obj/machinery/abductor/gland_dispenser/proc/attack_hand", function* attack_hand(f: Frame) {
	let box_css: Value = null, dat: Value = null, item_count: Value = null, i: Value = null, g_color: Value = null, amount: Value = null, popup: Value = null;
	f.vars = () => [box_css, dat, item_count, i, g_color, amount, popup];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/is_species"), null, [live(f.args[0]), T("/datum/species/abductor")])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	box_css = "\n\t<style>\n\ta.box.gland {\n\t\tfloat: left;\n\t\twidth: 20px;\n\t\theight: 20px;\n\t\tmargin: 5px;\n\t\tborder-width: 1px;\n\t\tborder-style: solid;\n\t\tborder-color: rgba(0,0,0,.2);\n\t\ttext-align: center;\n\t\t}\n\t</style>";
	dat = "";
	item_count = 0;
	i = null;
	i = 1;
	while (rt.le(live(i), rt.len(f, rt.sv(f, "gland_colors")))) {
		item_count = rt.inc(live(item_count), 1);
		g_color = rt.index(rt.sv(f, "gland_colors"), live(i));
		amount = rt.index(rt.sv(f, "amounts"), live(i));
		dat = rt.modify(live(dat), fmt("<a class='box gland' style='background-color:＀' href='?src=＃;dispense=＀'>＀</a>", [live(g_color), live(f.src), live(i), live(amount)]), add);
		if (isEqual(live(item_count), 4)) {
			dat = rt.modify(live(dat), "</br></br>", add);
			item_count = 0;
		}
		i = rt.inc(live(i), 1);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "glands", "Gland Dispenser", 200, 200]))), "add_head_content", [live(box_css)]);
	yield* g.callName(f, live(popup), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/abductor/gland_dispenser/proc/attackby  (code/game/gamemodes/miniantags/abduction/machinery/dispenser.dm:62)  may sleep
rt.def("/obj/machinery/abductor/gland_dispenser/proc/attackby", function* attackby(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/organ/heart/gland")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		i = null;
		i = 1;
		while (rt.le(live(i), rt.len(f, rt.sv(f, "gland_colors")))) {
			if (isEqual(rt.index(rt.sv(f, "gland_types"), live(i)), rt.fv(f, "type", live(f.args[0])))) {
				rt.incAt(rt.sv(f, "amounts"), live(i), 1, true);
			}
			i = rt.inc(live(i), 1);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/abductor/gland_dispenser/proc/Topic  (code/game/gamemodes/miniantags/abduction/machinery/dispenser.dm:73)  may sleep
rt.def("/obj/machinery/abductor/gland_dispenser/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.at(live(f.args[1]), "dispense"))) {
		yield* g.srcCall(f, "Dispense", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "dispense")])));
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/abductor/gland_dispenser/proc/Dispense  (code/game/gamemodes/miniantags/abduction/machinery/dispenser.dm:82)  may sleep
rt.def("/obj/machinery/abductor/gland_dispenser/proc/Dispense", function* Dispense(f: Frame, count: Value) {
	let _T: Value = null;
	f.vars = () => [count, _T];
	if (!rt.gt(rt.index(rt.sv(f, "amounts"), live(count)), 0)) return f.dot;
	rt.incAt(rt.sv(f, "amounts"), live(count), -1, true);
	_T = rt.index(rt.sv(f, "gland_types"), live(count));
	yield* g.new_(f, live(_T), [rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true);
