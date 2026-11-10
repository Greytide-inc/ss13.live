// Based on /tg/station's code/game/gamemodes/miniantags/abduction/machinery/dispenser.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// dispenser.dm:14
rt.def("/obj/machinery/abductor/gland_dispenser/proc/random_color", function random_color(f: Frame) {
	return rt.op(f, "Rgb", [1, 3], [rand(0, 255), rand(0, 255), rand(0, 255)]);
});

// dispenser.dm:17
rt.def("/obj/machinery/abductor/gland_dispenser/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.gland_types = typesof(T("/obj/item/organ/heart/gland")) - T("/obj/item/organ/heart/gland");
	this.gland_types = shuffle(this.gland_types);
	this.gland_colors = (yield* new_(T("/list"), rt.len(f, this.gland_types)));
	this.amounts = (yield* new_(T("/list"), rt.len(f, this.gland_types)));
	let i: Value = 1;
	while (i <= rt.len(f, this.gland_types)) {
		rt.setAt(this.gland_colors, i, this.random_color());
		rt.setAt(this.amounts, i, rand(1, 5));
		i++;
	}
	return f.dot;
}, true);

// dispenser.dm:27
rt.def("/obj/machinery/abductor/gland_dispenser/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let g_color: Value = null, amount: Value = null, popup: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!is_species(user, T("/datum/species/abductor"))) {
		return f.dot;
	}
	yield* user.set_machine(this);
	let box_css: Value = "\n\t<style>\n\ta.box.gland {\n\t\tfloat: left;\n\t\twidth: 20px;\n\t\theight: 20px;\n\t\tmargin: 5px;\n\t\tborder-width: 1px;\n\t\tborder-style: solid;\n\t\tborder-color: rgba(0,0,0,.2);\n\t\ttext-align: center;\n\t\t}\n\t</style>";
	let dat: Value = "";
	let item_count: Value = 0;
	let i: Value = 1;
	while (i <= rt.len(f, this.gland_colors)) {
		item_count++;
		g_color = rt.index(this.gland_colors, i);
		amount = rt.index(this.amounts, i);
		dat += fmt("<a class='box gland' style='background-color:＀' href='?src=＃;dispense=＀'>＀</a>", [g_color, this, i, amount]);
		if (item_count == 4) {
			dat += "</br></br>";
			item_count = 0;
		}
		i++;
	}
	(popup = (yield* new_(T("/datum/browser"), user, "glands", "Gland Dispenser", 200, 200))).add_head_content(box_css);
	popup.set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// dispenser.dm:62
rt.def("/obj/machinery/abductor/gland_dispenser/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let i: Value = null;
	if (rt.istype(W, T("/obj/item/organ/heart/gland"))) {
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		W.loc = this;
		i = 1;
		while (i <= rt.len(f, this.gland_colors)) {
			if (rt.index(this.gland_types, i) == W.type) {
				rt.incAt(this.amounts, i, 1, true);
			}
			i++;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// dispenser.dm:73
rt.def("/obj/machinery/abductor/gland_dispenser/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "dispense")) {
		yield* this.Dispense(text2num(rt.at(href_list, "dispense")));
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// dispenser.dm:82
rt.def("/obj/machinery/abductor/gland_dispenser/proc/Dispense", function* Dispense(f: Frame, count: Value) {
	if (!(rt.index(this.amounts, count) > 0)) return f.dot;
	rt.incAt(this.amounts, count, -1, true);
	let _T: Value = rt.index(this.gland_types, count);
	yield* new_(_T, rt.getStep(f, this, 0));
	return f.dot;
}, true);
