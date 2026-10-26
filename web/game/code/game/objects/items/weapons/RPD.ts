// From code/game/objects/items/weapons/RPD.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1532, "/datum/pipe_info", "/datum", {
	id: -1,
	categoryId: 0,
	dir: 2,
	dirtype: 1,
	icon: rt.rsc("icons/obj/atmospherics/pipes/pipe_item.dmi"),
	icon_state: "",
	selected: 0,
});

// /datum/pipe_info/proc/New  (code/game/objects/items/weapons/RPD.dm:34)
rt.def("/datum/pipe_info/proc/New", function New(f: Frame, pid: Value, direction: Value, dt: Value) {
	rt.setFv(f, "id", live(f.src), live(pid));
	rt.setFv(f, "icon_state", live(f.src), rt.index(rt.gl("pipeID2State"), fmt("＀", [live(pid)])));
	rt.setFv(f, "dir", live(f.src), live(direction));
	rt.setFv(f, "dirtype", live(f.src), live(dt));
	return f.dot;
});

// /datum/pipe_info/proc/Render  (code/game/objects/items/weapons/RPD.dm:39)
rt.def("/datum/pipe_info/proc/Render", function Render(f: Frame, dispenser: Value, label: Value) {
	return fmt("<li><a href='?src=＃;makepipe=＀;dir=＀;type=＀'>＀</a></li>", [live(dispenser), rt.sv(f, "id"), rt.sv(f, "dir"), rt.sv(f, "dirtype"), live(label)]);
});

rt.type(1533, "/datum/pipe_info/meter", "/datum/pipe_info", {
	icon: rt.rsc("icons/obj/atmospherics/pipes/simple.dmi"),
	icon_state: "meterX",
});

// /datum/pipe_info/meter/proc/Render  (code/game/objects/items/weapons/RPD.dm:49)
rt.def("/datum/pipe_info/meter/proc/Render", function Render(f: Frame, dispenser: Value, label: Value) {
	return fmt("<li><a href='?src=＃;makemeter=1;type=＀'>＀</a></li>", [live(dispenser), rt.sv(f, "dirtype"), live(label)]);
});

// /datum/controller/global_vars/proc/InitGlobaldisposalpipeID2State  (code/game/objects/items/weapons/RPD.dm:51)
rt.def("/datum/controller/global_vars/proc/InitGlobaldisposalpipeID2State", function InitGlobaldisposalpipeID2State(f: Frame) {
	rt.setGl("disposalpipeID2State", rt.list("pipe-s", "pipe-c", "pipe-j1", "pipe-j2", "pipe-y", "pipe-t", "disposal", "outlet", "intake", "pipe-j1s", "pipe-j2s"));
	rt.modSrcVar(f, "gvars_datum_init_order", "disposalpipeID2State", add);
	return f.dot;
});

rt.type(1534, "/datum/pipe_info/disposal", "/datum/pipe_info", {
	categoryId: 1,
	icon: rt.rsc("icons/obj/atmospherics/pipes/disposal.dmi"),
	icon_state: "meterX",
});

// /datum/pipe_info/disposal/proc/New  (code/game/objects/items/weapons/RPD.dm:71)
rt.def("/datum/pipe_info/disposal/proc/New", function New(f: Frame, pid: Value, dt: Value) {
	rt.setFv(f, "id", live(f.src), live(pid));
	rt.setFv(f, "icon_state", live(f.src), rt.index(rt.gl("disposalpipeID2State"), add(live(pid), 1)));
	rt.setFv(f, "dir", live(f.src), 2);
	rt.setFv(f, "dirtype", live(f.src), live(dt));
	if (!(rt.lt(live(pid), 6) || rt.gt(live(pid), 8))) return f.dot;
	rt.setSv(f, "icon_state", fmt("con＀", [rt.sv(f, "icon_state")]));
	return f.dot;
});

// /datum/pipe_info/disposal/proc/Render  (code/game/objects/items/weapons/RPD.dm:78)
rt.def("/datum/pipe_info/disposal/proc/Render", function Render(f: Frame, dispenser: Value, label: Value) {
	return fmt("<li><a href='?src=＃;dmake=＀;type=＀'>＀</a></li>", [live(dispenser), rt.sv(f, "id"), rt.sv(f, "dirtype"), live(label)]);
});

// /datum/controller/global_vars/proc/InitGlobalRPD_recipes  (code/game/objects/items/weapons/RPD.dm:81)
rt.def("/datum/controller/global_vars/proc/InitGlobalRPD_recipes", function InitGlobalRPD_recipes(f: Frame) {
	rt.setGl("RPD_recipes", rt.alist(f, ["Regular Pipes", rt.alist(f, ["Pipe", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/pipe/simple"), 1, 1]), "Manifold", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/pipe/manifold"), 1, 2]), "Manual Valve", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/components/binary/valve"), 1, 0]), "Digital Valve", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/components/binary/valve/digital"), 1, 0]), "4-Way Manifold", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/pipe/manifold4w"), 1, 5])]), "Devices", rt.alist(f, ["Connector", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/components/unary/portables_connector"), 1, 4]), "Unary Vent", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/components/unary/vent_pump"), 1, 4]), "Gas Pump", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/components/binary/pump"), 1, 4]), "Passive Gate", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/components/binary/passive_gate"), 1, 4]), "Volume Pump", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/components/binary/volume_pump"), 1, 4]), "Scrubber", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/components/unary/vent_scrubber"), 1, 4]), "Injector", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/components/unary/outlet_injector"), 1, 4]), "Meter", rt.new_(f, T("/datum/pipe_info/meter"), []), "Gas Filter", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/components/trinary/filter"), 1, 3]), "Gas Mixer", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/components/trinary/mixer"), 1, 3])]), "Heat Exchange", rt.alist(f, ["Pipe", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple"), 1, 1]), "Manifold", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold"), 1, 2]), "4-Way Manifold", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w"), 1, 5]), "Junction", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/pipe/heat_exchanging/junction"), 1, 4]), "Heat Exchanger", rt.new_(f, T("/datum/pipe_info"), [T("/obj/machinery/atmospherics/components/unary/heat_exchanger"), 1, 4])]), "Disposal Pipes", rt.alist(f, ["Pipe", rt.new_(f, T("/datum/pipe_info/disposal"), [0, 0]), "Bent Pipe", rt.new_(f, T("/datum/pipe_info/disposal"), [1, 2]), "Junction", rt.new_(f, T("/datum/pipe_info/disposal"), [2, 2]), "Y-Junction", rt.new_(f, T("/datum/pipe_info/disposal"), [4, 2]), "Trunk", rt.new_(f, T("/datum/pipe_info/disposal"), [5, 2]), "Bin", rt.new_(f, T("/datum/pipe_info/disposal"), [6, 5]), "Outlet", rt.new_(f, T("/datum/pipe_info/disposal"), [7, 4]), "Chute", rt.new_(f, T("/datum/pipe_info/disposal"), [8, 4]), "Sort Junction", rt.new_(f, T("/datum/pipe_info/disposal"), [9, 2])])]));
	rt.modSrcVar(f, "gvars_datum_init_order", "RPD_recipes", add);
	return f.dot;
});

rt.type(7338, "/obj/item/weapon/pipe_dispenser", "/obj/item/weapon", {
	spark_system: null,
	working: 0,
	p_conntype: 1,
	p_dir: 1,
	p_flipped: 0,
	p_class: 0,
	paint_colors: null,
	paint_color: "grey",
	screen: 0,
	p_type: rt.typePath("/obj/machinery/atmospherics/pipe/simple"),
	flags: 64,
	throw_speed: 1,
	throw_range: 5,
	name: "Rapid Piping Device (RPD)",
	desc: "A device used to rapidly pipe things.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "rpd",
	force: 10,
	throwforce: 10,
	w_class: 3,
	materials: null,
	origin_tech: "engineering=4;materials=2",
	armor: null,
	resistance_flags: 2,
});

// /obj/item/weapon/pipe_dispenser/proc/<init>  (code/game/objects/items/weapons/RPD.dm:144)
rt.def("/obj/item/weapon/pipe_dispenser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "paint_colors", rt.alist(f, ["grey", rt.op(f, "Rgb", [1, 3], [255, 255, 255]), "red", rt.op(f, "Rgb", [1, 3], [255, 0, 0]), "blue", rt.op(f, "Rgb", [1, 3], [0, 0, 255]), "cyan", rt.op(f, "Rgb", [1, 3], [0, 256, 249]), "green", rt.op(f, "Rgb", [1, 3], [30, 255, 0]), "yellow", rt.op(f, "Rgb", [1, 3], [255, 198, 0]), "purple", rt.op(f, "Rgb", [1, 3], [130, 43, 255])]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 75000, "$glass", 37500]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

// /obj/item/weapon/pipe_dispenser/proc/New  (code/game/objects/items/weapons/RPD.dm:157)  may sleep
rt.def("/obj/item/weapon/pipe_dispenser/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "spark_system", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	yield* g.callName(f, rt.sv(f, "spark_system"), "set_up", [5, 0, live(f.src)]);
	yield* g.callName(f, rt.sv(f, "spark_system"), "attach", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/pipe_dispenser/proc/Destroy  (code/game/objects/items/weapons/RPD.dm:163)  may sleep
rt.def("/obj/item/weapon/pipe_dispenser/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "spark_system")]);
	rt.setSv(f, "spark_system", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/pipe_dispenser/proc/attack_self  (code/game/objects/items/weapons/RPD.dm:168)  may sleep
rt.def("/obj/item/weapon/pipe_dispenser/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "show_menu", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/pipe_dispenser/proc/suicide_act  (code/game/objects/items/weapons/RPD.dm:171)
rt.def("/obj/item/weapon/pipe_dispenser/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ points the end of the RPD down ＀ throat and presses a button! It looks like ＀ trying to commit suicide...</span>", [live(user), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_theyre", [])])]);
	rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
	return 1;
});

// /obj/item/weapon/pipe_dispenser/proc/render_dir_img  (code/game/objects/items/weapons/RPD.dm:177)
rt.def("/obj/item/weapon/pipe_dispenser/proc/render_dir_img", function render_dir_img(f: Frame, _dir: Value, pic: Value, title: Value, flipped: Value) {
	let selected: Value = null;
	f.vars = () => [flipped, selected];
	if (live(flipped) === null) {
		flipped = 0;
	}
	selected = " class=\"imglink\"";
	if (isEqual(live(_dir), rt.sv(f, "p_dir"))) {
		selected = " class=\"imglink selected\"";
	}
	return fmt("<a href=\"?src=＃;setdir=＀;flipped=＀\" title=\"＀\"＀\"><img src=\"＀\" /></a>", [live(f.src), live(_dir), live(flipped), live(title), live(selected), live(pic)]);
});

// /obj/item/weapon/pipe_dispenser/proc/show_menu  (code/game/objects/items/weapons/RPD.dm:183)  may sleep
rt.def("/obj/item/weapon/pipe_dispenser/proc/show_menu", function* show_menu(f: Frame, user: Value) {
	let dat: Value = null, preview: Value = null, datbuild: Value = null, category: Value = null, cat: Value = null, label: Value = null, I: Value = null, found: Value = null, color_css: Value = null, color_picker: Value = null, color_name: Value = null, color: Value = null, selected: Value = null, dirsel: Value = null, datsytle: Value = null, popup: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, dat, preview, datbuild, category, cat, label, I, found, color_css, color_picker, color_name, color, selected, dirsel, datsytle, popup, $0, $e];
	if ((!truthy(live(user)) || !truthy(live(f.src)))) {
		return 0;
	}
	dat = "<h2>Type</h2>\n<b>Utilities:</b>\n<ul>";
	if (!isEqual(rt.sv(f, "p_class"), -1)) {
		dat = rt.modify(live(dat), fmt("<li><a href='?src=＃;eatpipes=1;type=-1'>Eat Pipes</a></li>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), "<li><span class='linkOn'>Eat Pipes</span></li>", add);
	}
	if (!isEqual(rt.sv(f, "p_class"), -2)) {
		dat = rt.modify(live(dat), fmt("<li><a href='?src=＃;paintpipes=1;type=-1'>Paint Pipes</a></li>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), "<li><span class='linkOn'>Paint Pipes</span></li>", add);
	}
	dat = rt.modify(live(dat), "</ul>", add);
	dat = rt.modify(live(dat), "<b>Category:</b><ul>", add);
	if (isEqual(rt.sv(f, "screen"), 0)) {
		dat = rt.modify(live(dat), fmt("<span class='linkOn'>Atmospherics</span> <A href='?src=＃;screen=＀;dmake=0;type=0'>Disposals</A><BR>", [live(f.src), 1]), add);
	} else {
		if (isEqual(rt.sv(f, "screen"), 1)) {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;screen=＀;makepipe=0;dir=1;type=0'>Atmospherics</A> <span class='linkOn'>Disposals</span><BR>", [live(f.src), 0]), add);
		}
	}
	dat = rt.modify(live(dat), "</ul>", add);
	preview = null;
	datbuild = "";
	category = null;
	rt.forList(f, 0, rt.gl("RPD_recipes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		category = $e;
		cat = rt.index(rt.gl("RPD_recipes"), live(category));
		label = null;
		rt.forList(f, 1, live(cat));
		while (($e = rt.next(f, 1)) !== undefined) {
			label = $e;
			I = rt.index(live(cat), live(label));
			found = 0;
			if (isEqual(rt.fv(f, "id", live(I)), rt.sv(f, "p_type"))) {
				if (((isEqual(rt.sv(f, "p_class"), 0) || isEqual(rt.sv(f, "p_class"), 1)) && (isEqual(rt.fv(f, "type", live(I)), T("/datum/pipe_info")) || isEqual(rt.fv(f, "type", live(I)), T("/datum/pipe_info/meter"))))) {
					found = 1;
				} else {
					if ((isEqual(rt.sv(f, "p_class"), 2) && isEqual(rt.fv(f, "type", live(I)), T("/datum/pipe_info/disposal")))) {
						found = 1;
					}
				}
			}
			if (truthy(live(found))) {
				preview = (yield* g.new_(f, T("/icon"), [rt.fv(f, "icon", live(I)), rt.fv(f, "icon_state", live(I))]));
			}
			if (isEqual(rt.sv(f, "screen"), rt.fv(f, "categoryId", live(I)))) {
				if ((isEqual(rt.fv(f, "id", live(I)), rt.sv(f, "p_type")) && rt.ge(rt.sv(f, "p_class"), 0))) {
					datbuild = rt.modify(live(datbuild), fmt("<span class='linkOn'>＀</span>", [live(label)]), add);
				} else {
					datbuild = rt.modify(live(datbuild), (yield* g.callName(f, live(I), "Render", [live(f.src), live(label)])), add);
				}
			}
		}
		rt.endFor(f, 1);
		if (rt.gt(rt.length(live(datbuild)), 0)) {
			dat = rt.modify(live(dat), fmt("<b>＀:</b><ul>", [live(category)]), add);
			dat = rt.modify(live(dat), live(datbuild), add);
			datbuild = "";
		}
		dat = rt.modify(live(dat), "</ul>", add);
	}
	rt.endFor(f, 0);
	color_css = "";
	color_picker = "";
	color_name = null;
	rt.forList(f, 0, rt.sv(f, "paint_colors"));
	while (($e = rt.next(f, 0)) !== undefined) {
		color_name = $e;
		color = rt.index(rt.sv(f, "paint_colors"), live(color_name));
		color_css = rt.modify(live(color_css), fmt("\n\t\t\ta.color.＀ {\n\t\t\t\tcolor: ＀;\n\t\t\t}\n\t\t\ta.color.＀:hover {\n\t\t\t\tborder:1px solid ＀;\n\t\t\t}\n\t\t\ta.color.＀.selected {\n\t\t\t\tbackground-color: ＀;\n\t\t\t}\n\t\t", [live(color_name), live(color), live(color_name), live(color), live(color_name), live(color)]), add);
		selected = "";
		if (isEqual(live(color_name), rt.sv(f, "paint_color"))) {
			selected = " selected";
		}
		color_picker = rt.modify(live(color_picker), fmt("<a class=\"color ＀＀\" href=\"?src=＃;set_color=＀\">&bull;</a>", [live(color_name), live(selected), live(f.src), live(color_name)]), add);
	}
	rt.endFor(f, 0);
	dirsel = "<h2>Direction</h2>";
	$0 = rt.sv(f, "p_conntype");
	if ($0 === -1) {
		if (isEqual(rt.sv(f, "p_class"), -2)) {
			dirsel = fmt("<h2>Color</h2>＀", [live(color_picker)]);
		} else {
			dirsel = "";
		}
	} else if ($0 === 0) {
		if (truthy(live(preview))) {
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 1], rt.Args.Named)), "vertical.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 4], rt.Args.Named)), "horizontal.png"], false);
			dirsel = rt.modify(live(dirsel), "<p>", add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 1, "vertical.png", "Vertical")), add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 4, "horizontal.png", "Horizontal")), add);
			dirsel = rt.modify(live(dirsel), "</p>", add);
		} else {
			dirsel = rt.modify(live(dirsel), fmt("\n\t\t<p>\n\t\t\t<a href=\"?src=＃;setdir=1; flipped=0\" title=\"vertical\">&#8597;</a>\n\t\t\t<a href=\"?src=＃;setdir=4; flipped=0\" title=\"horizontal\">&harr;</a>\n\t\t</p>\n\t\t\t\t", [live(f.src), live(f.src)]), add);
		}
	} else if ($0 === 1) {
		if (truthy(live(preview))) {
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 1], rt.Args.Named)), "vertical.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 4], rt.Args.Named)), "horizontal.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 9], rt.Args.Named)), "nw.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 5], rt.Args.Named)), "ne.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 10], rt.Args.Named)), "sw.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 6], rt.Args.Named)), "se.png"], false);
			dirsel = rt.modify(live(dirsel), "<p>", add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 1, "vertical.png", "Vertical")), add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 4, "horizontal.png", "Horizontal")), add);
			dirsel = rt.modify(live(dirsel), "<br />", add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 9, "nw.png", "West to North")), add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 5, "ne.png", "North to East")), add);
			dirsel = rt.modify(live(dirsel), "<br />", add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 10, "sw.png", "South to West")), add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 6, "se.png", "East to South")), add);
			dirsel = rt.modify(live(dirsel), "</p>", add);
		} else {
			dirsel = rt.modify(live(dirsel), fmt("\n\t\t<p>\n\t\t\t<a href=\"?src=＃;setdir=1; flipped=0\" title=\"vertical\">&#8597;</a>\n\t\t\t<a href=\"?src=＃;setdir=4; flipped=0\" title=\"horizontal\">&harr;</a>\n\t\t\t<br />\n\t\t\t<a href=\"?src=＃;setdir=9; flipped=0\" title=\"West to North\">&#9565;</a>\n\t\t\t<a href=\"?src=＃;setdir=5; flipped=0\" title=\"North to East\">&#9562;</a>\n\t\t\t<br />\n\t\t\t<a href=\"?src=＃;setdir=10; flipped=0\" title=\"South to West\">&#9559;</a>\n\t\t\t<a href=\"?src=＃;setdir=6; flipped=0\" title=\"East to South\">&#9556;</a>\n\t\t</p>\n\t\t\t\t", [live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src)]), add);
		}
	} else if ($0 === 2) {
		if (truthy(live(preview))) {
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 1], rt.Args.Named)), "s.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 4], rt.Args.Named)), "w.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 2], rt.Args.Named)), "n.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 8], rt.Args.Named)), "e.png"], false);
			dirsel = rt.modify(live(dirsel), "<p>", add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 1, "s.png", "West South East")), add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 4, "w.png", "North West South")), add);
			dirsel = rt.modify(live(dirsel), "<br />", add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 2, "n.png", "East North West")), add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 8, "e.png", "South East North")), add);
			dirsel = rt.modify(live(dirsel), "</p>", add);
		} else {
			dirsel = rt.modify(live(dirsel), fmt("\n\t\t<p>\n\t\t\t<a href=\"?src=＃;setdir=1; flipped=0\" title=\"West, South, East\">&#9574;</a>\n\t\t\t<a href=\"?src=＃;setdir=4; flipped=0\" title=\"North, West, South\">&#9571;</a>\n\t\t\t<br />\n\t\t\t<a href=\"?src=＃;setdir=2; flipped=0\" title=\"East, North, West\">&#9577;</a>\n\t\t\t<a href=\"?src=＃;setdir=8; flipped=0\" title=\"South, East, North\">&#9568;</a>\n\t\t</p>\n\t\t\t\t", [live(f.src), live(f.src), live(f.src), live(f.src)]), add);
		}
	} else if ($0 === 3) {
		if (truthy(live(preview))) {
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 1], rt.Args.Named)), "s.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 4], rt.Args.Named)), "w.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 2], rt.Args.Named)), "n.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 8], rt.Args.Named)), "e.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 6], rt.Args.Named)), "sm.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 5], rt.Args.Named)), "wm.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 9], rt.Args.Named)), "nm.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 10], rt.Args.Named)), "em.png"], false);
			dirsel = rt.modify(live(dirsel), "<p>", add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 1, "s.png", "West South East")), add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 4, "w.png", "North West South")), add);
			dirsel = rt.modify(live(dirsel), "<br />", add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 2, "n.png", "East North West")), add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 8, "e.png", "South East North")), add);
			dirsel = rt.modify(live(dirsel), "<br />", add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 6, "sm.png", "West South East", 1)), add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 5, "wm.png", "North West South", 1)), add);
			dirsel = rt.modify(live(dirsel), "<br />", add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 9, "nm.png", "East North West", 1)), add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 10, "em.png", "South East North", 1)), add);
			dirsel = rt.modify(live(dirsel), "</p>", add);
		} else {
			dirsel = rt.modify(live(dirsel), fmt("\n\t\t<p>\n\t\t\t<a href=\"?src=＃;setdir=1; flipped=0\" title=\"West, South, East\">&#9574;</a>\n\t\t\t<a href=\"?src=＃;setdir=4; flipped=0\" title=\"North, West, South\">&#9571;</a>\n\t\t\t<br />\n\t\t\t<a href=\"?src=＃;setdir=2; flipped=0\" title=\"East, North, West\">&#9577;</a>\n\t\t\t<a href=\"?src=＃;setdir=8; flipped=0\" title=\"South, East, North\">&#9568;</a>\n\t\t\t<br />\n\t\t\t<a href=\"?src=＃;setdir=6; flipped=1\" title=\"West, South, East\">&#9574;</a>\n\t\t\t<a href=\"?src=＃;setdir=5; flipped=1\" title=\"North, West, South\">&#9571;</a>\n\t\t\t<br />\n\t\t\t<a href=\"?src=＃;setdir=9; flipped=1\" title=\"East, North, West\">&#9577;</a>\n\t\t\t<a href=\"?src=＃;setdir=10; flipped=1\" title=\"South, East, North\">&#9568;</a>\n\t\t</p>\n\t\t\t\t", [live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src)]), add);
		}
	} else if ($0 === 4) {
		if (truthy(live(preview))) {
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 1], rt.Args.Named)), "n.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 4], rt.Args.Named)), "e.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 2], rt.Args.Named)), "s.png"], false);
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [null, live(preview), "dir", 8], rt.Args.Named)), "w.png"], false);
			dirsel = rt.modify(live(dirsel), "<p>", add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 1, "n.png", "North")), add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 4, "e.png", "East")), add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 2, "s.png", "South")), add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 8, "w.png", "West")), add);
			dirsel = rt.modify(live(dirsel), "</p>", add);
		} else {
			dirsel = rt.modify(live(dirsel), fmt("\n\t\t<p>\n\t\t\t<a href=\"?src=＃;setdir=＀; flipped=0\" title=\"North\">&uarr;</a>\n\t\t\t<a href=\"?src=＃;setdir=＀; flipped=0\" title=\"East\">&rarr;</a>\n\t\t\t<a href=\"?src=＃;setdir=＀; flipped=0\" title=\"South\">&darr;</a>\n\t\t\t<a href=\"?src=＃;setdir=＀; flipped=0\" title=\"West\">&larr;</a>\n\t\t</p>\n\t\t\t\t\t", [live(f.src), 1, live(f.src), 4, live(f.src), 2, live(f.src), 8]), add);
		}
	} else if ($0 === 5) {
		if (truthy(live(preview))) {
			rt.op(f, "BrowseResource", [], [live(user), (yield* g.new_(f, T("/icon"), [live(preview)])), "pipe.png"], false);
			dirsel = rt.modify(live(dirsel), "<p>", add);
			dirsel = rt.modify(live(dirsel), (yield* g.srcCall(f, "render_dir_img", 1, "pipe.png", "Pipe")), add);
			dirsel = rt.modify(live(dirsel), "</p>", add);
		} else {
			dirsel = rt.modify(live(dirsel), fmt("\n\t\t<p>\n\t\t\t<a href=\"?src=＃;setdir=1; flipped=0\" title=\"Pipe\">&#8597;</a>\n\t\t</p>\n\t\t\t\t", [live(f.src)]), add);
		}
	}
	dat = add(add((datsytle = fmt("\n<style type=\"text/css\">\n\ta.imglink {\n\t\tpadding: none;\n\t\ttext-decoration:none;\n\t\tborder-style:none;\n\t\tbackground:none;\n\t\tmargin: 1px;\n\t}\n\n\ta.imglink:hover {\n\t\tbackground:none;\n\t\tcolor:none;\n\t}\n\n\ta.imglink.selected img {\n\t\tborder: 1px solid #24722e;\n\t\tbackground: #2f943c;\n\t}\n\n\ta img {\n\t\tborder: 1px solid #161616;\n\t\tbackground: #40628a;\n\t}\n\n\ta.color {\n\t\tpadding: 5px 10px;\n\t\tfont-size: large;\n\t\tfont-weight: bold;\n\t\tborder: 1px solid #161616;\n\t}\n\n\ta.selected img,\n\t\ta:hover {\n\t\t\tbackground: #0066cc;\n\t\t\tcolor: #ffffff;\n\t\t}\n\t\t＀\n</style>", [live(color_css)])), live(dirsel)), live(dat));
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "pipedispenser", rt.sv(f, "name"), 300, 550]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/item/weapon/pipe_dispenser/proc/Topic  (code/game/objects/items/weapons/RPD.dm:457)  may sleep
rt.def("/obj/item/weapon/pipe_dispenser/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let new_type: Value = null; f.vars = () => [href, href_list, new_type];
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=pipedispenser"], false);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	if (truthy(rt.at(live(href_list), "screen"))) {
		rt.setSv(f, "screen", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "screen")])));
		yield* g.srcCall(f, "show_menu", live(f.usr));
	}
	if (truthy(rt.at(live(href_list), "setdir"))) {
		rt.setSv(f, "p_dir", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "setdir")])));
		rt.setSv(f, "p_flipped", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "flipped")])));
		yield* g.srcCall(f, "show_menu", live(f.usr));
	}
	if (truthy(rt.at(live(href_list), "eatpipes"))) {
		rt.setSv(f, "p_class", -1);
		rt.setSv(f, "p_conntype", -1);
		rt.setSv(f, "p_dir", 1);
		yield* g.callName(f, rt.fv(f, "spark_system", live(f.src)), "start", []);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/pop.ogg"), 50, 0]);
		yield* g.srcCall(f, "show_menu", live(f.usr));
	}
	if (truthy(rt.at(live(href_list), "paintpipes"))) {
		rt.setSv(f, "p_class", -2);
		rt.setSv(f, "p_conntype", -1);
		rt.setSv(f, "p_dir", 1);
		yield* g.callName(f, rt.fv(f, "spark_system", live(f.src)), "start", []);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/pop.ogg"), 50, 0]);
		yield* g.srcCall(f, "show_menu", live(f.usr));
	}
	if (truthy(rt.at(live(href_list), "set_color"))) {
		rt.setSv(f, "paint_color", rt.at(live(href_list), "set_color"));
		yield* g.callName(f, rt.fv(f, "spark_system", live(f.src)), "start", []);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/pop.ogg"), 50, 0]);
		yield* g.srcCall(f, "show_menu", live(f.usr));
	}
	if (truthy(rt.at(live(href_list), "makepipe"))) {
		new_type = (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(href_list), "makepipe")])); if (rt.isIn(f, live(new_type), rt.gl("pipe_types"))) rt.setSv(f, "p_type", live(new_type)); // tg's own hole: makepipe= took any type path (makepipe=0, the Atmospherics tab, now keeps the last pipe)
		rt.setSv(f, "p_dir", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "dir")])));
		rt.setSv(f, "p_conntype", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "type")])));
		rt.setSv(f, "p_class", 0);
		yield* g.callName(f, rt.fv(f, "spark_system", live(f.src)), "start", []);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/pop.ogg"), 50, 0]);
		yield* g.srcCall(f, "show_menu", live(f.usr));
	}
	if (truthy(rt.at(live(href_list), "makemeter"))) {
		rt.setSv(f, "p_class", 1);
		rt.setSv(f, "p_conntype", -1);
		rt.setSv(f, "p_dir", 1);
		yield* g.callName(f, rt.fv(f, "spark_system", live(f.src)), "start", []);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/pop.ogg"), 50, 0]);
		yield* g.srcCall(f, "show_menu", live(f.usr));
	}
	if (!truthy(rt.at(live(href_list), "dmake"))) return f.dot;
	rt.setSv(f, "p_type", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "dmake")])));
	rt.setSv(f, "p_conntype", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "type")])));
	rt.setSv(f, "p_dir", 1);
	rt.setSv(f, "p_class", 2);
	yield* g.callName(f, rt.fv(f, "spark_system", live(f.src)), "start", []);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/pop.ogg"), 50, 0]);
	yield* g.srcCall(f, "show_menu", live(f.usr));
	return f.dot;
}, true);

// /obj/item/weapon/pipe_dispenser/proc/pre_attackby  (code/game/objects/items/weapons/RPD.dm:521)  may sleep
rt.def("/obj/item/weapon/pipe_dispenser/proc/pre_attackby", function* pre_attackby(f: Frame) {
	let is_paintable: Value = null, is_consumable: Value = null, can_make_pipe: Value = null, queued_p_type: Value = null, queued_p_dir: Value = null, queued_p_flipped: Value = null, _P: Value = null, C: Value = null;
	let $0: any;
	f.vars = () => [is_paintable, is_consumable, can_make_pipe, queued_p_type, queued_p_dir, queued_p_flipped, _P, C, $0];
	if ((!truthy((yield* g.callName(f, live(f.args[1]), "IsAdvancedToolUser", []))) || truthy((rt.istype(live(f.args[0]), T("/turf/open/space/transit")) ? 1 : 0)))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	is_paintable = ((isEqual(rt.sv(f, "p_class"), -2) ? 1 : 0) && (rt.istype(live(f.args[0]), T("/obj/machinery/atmospherics/pipe")) ? 1 : 0));
	is_consumable = ((isEqual(rt.sv(f, "p_class"), -1) ? 1 : 0) && (((rt.istype(live(f.args[0]), T("/obj/item/pipe")) ? 1 : 0) || (rt.istype(live(f.args[0]), T("/obj/item/pipe_meter")) ? 1 : 0)) || (rt.istype(live(f.args[0]), T("/obj/structure/disposalconstruct")) ? 1 : 0)));
	can_make_pipe = ((((isEqual(rt.sv(f, "p_class"), 0) ? 1 : 0) || (isEqual(rt.sv(f, "p_class"), 1) ? 1 : 0)) || (isEqual(rt.sv(f, "p_class"), 2) ? 1 : 0)) && (yield* g.call(f, P("/proc/isturf"), null, [live(f.args[0])])));
	if (((!truthy(live(is_paintable)) && !truthy(live(is_consumable))) && !truthy(live(can_make_pipe)))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	queued_p_type = rt.sv(f, "p_type");
	queued_p_dir = rt.sv(f, "p_dir");
	queued_p_flipped = rt.sv(f, "p_flipped");
	f.dot = 0;
	$0 = rt.sv(f, "p_class");
	if ($0 === -2) {
		_P = live(f.args[0]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/click.ogg"), 50, 1]);
		yield* g.callName(f, live(_P), "add_atom_colour", [rt.index(rt.sv(f, "paint_colors"), rt.sv(f, "paint_color")), 4]);
		rt.setFv(f, "pipe_color", live(_P), rt.index(rt.sv(f, "paint_colors"), rt.sv(f, "paint_color")));
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ paints ％！ ＀.</span>", [live(f.args[1]), live(_P), rt.sv(f, "paint_color")]), fmt("<span class='notice'>You paint ％！ ＀.</span>", [live(_P), rt.sv(f, "paint_color")])]);
		yield* g.callName(f, live(_P), "update_node_icon", []);
		return live(f.dot);
	} else if ($0 === -1) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start destroying a pipe...</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/click.ogg"), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 2, "target", live(f.args[0])], rt.Args.Named)))) {
			yield* g.srcCall(f, "activate");
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		}
	} else if ($0 === 0) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start building a pipe...</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/click.ogg"), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 2, "target", live(f.args[0])], rt.Args.Named)))) {
			yield* g.srcCall(f, "activate");
			rt.setFv(f, "flipped", (_P = (yield* g.new_(f, T("/obj/item/pipe"), [null, live(f.args[0]), "pipe_type", live(queued_p_type), "dir", live(queued_p_dir)], rt.Args.Named))), live(queued_p_flipped));
			yield* g.callName(f, live(_P), "update", []);
			yield* g.callName(f, live(_P), "add_fingerprint", [live(f.usr)]);
		}
	} else if ($0 === 1) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start building a meter...</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/click.ogg"), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 2, "target", live(f.args[0])], rt.Args.Named)))) {
			yield* g.srcCall(f, "activate");
			yield* g.new_(f, T("/obj/item/pipe_meter"), [live(f.args[0])]);
		}
	} else if ($0 === 2) {
		if (truthy((yield* g.call(f, P("/proc/is_anchored_dense_turf"), null, [live(f.args[0])])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀'s error light flickers; there's something in the way!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start building a disposals pipe...</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/click.ogg"), 50, 1]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 4, "target", live(f.args[0])], rt.Args.Named)))) return f.dot;
		if (!truthy((yield* g.callName(f, (C = (yield* g.new_(f, T("/obj/structure/disposalconstruct"), [live(f.args[0]), live(queued_p_type), live(queued_p_dir)]))), "can_place", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There's not enough room to build that here!</span>"]);
			yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
			return live(f.dot);
		}
		yield* g.srcCall(f, "activate");
		yield* g.callName(f, live(C), "add_fingerprint", [live(f.usr)]);
		yield* g.callName(f, live(C), "update_icon", []);
		return live(f.dot);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["A", "user"] });

// /obj/item/weapon/pipe_dispenser/proc/activate  (code/game/objects/items/weapons/RPD.dm:597)
rt.def("/obj/item/weapon/pipe_dispenser/proc/activate", function activate(f: Frame) {
	rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
	return f.dot;
});
