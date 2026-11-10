// Based on /tg/station's code/game/objects/items/weapons/RPD.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(1532, "/datum/pipe_info", "/datum", {
	id: -1,
	categoryId: 0,
	dir: 2,
	dirtype: 1,
	icon: rt.rsc("icons/obj/atmospherics/pipes/pipe_item.dmi"),
	icon_state: "",
	selected: 0,
});

// RPD.dm:34
rt.def("/datum/pipe_info/proc/New", function New(f: Frame, pid: Value, direction: Value, dt: Value) {
	this.id = pid;
	this.icon_state = rt.index(GLOB.pipeID2State, `${pid}`);
	this.dir = direction;
	this.dirtype = dt;
	return f.dot;
});

// RPD.dm:39
rt.def("/datum/pipe_info/proc/Render", function Render(f: Frame, dispenser: Value, label: Value) {
	return fmt("<li><a href='?src=＃;makepipe=＀;dir=＀;type=＀'>＀</a></li>", [dispenser, this.id, this.dir, this.dirtype, label]);
});

rt.type(1533, "/datum/pipe_info/meter", "/datum/pipe_info", {
	icon: rt.rsc("icons/obj/atmospherics/pipes/simple.dmi"),
	icon_state: "meterX",
});

// RPD.dm:49
rt.def("/datum/pipe_info/meter/proc/Render", function Render(f: Frame, dispenser: Value, label: Value) {
	return fmt("<li><a href='?src=＃;makemeter=1;type=＀'>＀</a></li>", [dispenser, this.dirtype, label]);
});

// RPD.dm:51
rt.def("/datum/controller/global_vars/proc/InitGlobaldisposalpipeID2State", function InitGlobaldisposalpipeID2State(f: Frame) {
	GLOB.disposalpipeID2State = list("pipe-s", "pipe-c", "pipe-j1", "pipe-j2", "pipe-y", "pipe-t", "disposal", "outlet", "intake", "pipe-j1s", "pipe-j2s");
	this.gvars_datum_init_order += "disposalpipeID2State";
	return f.dot;
});

rt.type(1534, "/datum/pipe_info/disposal", "/datum/pipe_info", {
	categoryId: 1,
	icon: rt.rsc("icons/obj/atmospherics/pipes/disposal.dmi"),
	icon_state: "meterX",
});

// RPD.dm:71
rt.def("/datum/pipe_info/disposal/proc/New", function New(f: Frame, pid: Value, dt: Value) {
	this.id = pid;
	this.icon_state = rt.index(GLOB.disposalpipeID2State, pid + 1);
	this.dir = 2;
	this.dirtype = dt;
	if (!(pid < DISP_END_BIN || pid > DISP_END_CHUTE)) return f.dot;
	this.icon_state = `con${this.icon_state}`;
	return f.dot;
});

// RPD.dm:78
rt.def("/datum/pipe_info/disposal/proc/Render", function Render(f: Frame, dispenser: Value, label: Value) {
	return fmt("<li><a href='?src=＃;dmake=＀;type=＀'>＀</a></li>", [dispenser, this.id, this.dirtype, label]);
});

// RPD.dm:81
rt.def("/datum/controller/global_vars/proc/InitGlobalRPD_recipes", function InitGlobalRPD_recipes(f: Frame) {
	GLOB.RPD_recipes = rt.alist(f, ["Regular Pipes", rt.alist(f, ["Pipe", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/pipe/simple"), 1, 1), "Manifold", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/pipe/manifold"), 1, 2), "Manual Valve", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/components/binary/valve"), 1, 0), "Digital Valve", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/components/binary/valve/digital"), 1, 0), "4-Way Manifold", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/pipe/manifold4w"), 1, 5)]), "Devices", rt.alist(f, ["Connector", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/components/unary/portables_connector"), 1, 4), "Unary Vent", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/components/unary/vent_pump"), 1, 4), "Gas Pump", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/components/binary/pump"), 1, 4), "Passive Gate", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/components/binary/passive_gate"), 1, 4), "Volume Pump", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/components/binary/volume_pump"), 1, 4), "Scrubber", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/components/unary/vent_scrubber"), 1, 4), "Injector", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/components/unary/outlet_injector"), 1, 4), "Meter", new_(T("/datum/pipe_info/meter")), "Gas Filter", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/components/trinary/filter"), 1, 3), "Gas Mixer", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/components/trinary/mixer"), 1, 3)]), "Heat Exchange", rt.alist(f, ["Pipe", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple"), 1, 1), "Manifold", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold"), 1, 2), "4-Way Manifold", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w"), 1, 5), "Junction", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/pipe/heat_exchanging/junction"), 1, 4), "Heat Exchanger", new_(T("/datum/pipe_info"), T("/obj/machinery/atmospherics/components/unary/heat_exchanger"), 1, 4)]), "Disposal Pipes", rt.alist(f, ["Pipe", new_(T("/datum/pipe_info/disposal"), 0, 0), "Bent Pipe", new_(T("/datum/pipe_info/disposal"), 1, 2), "Junction", new_(T("/datum/pipe_info/disposal"), 2, 2), "Y-Junction", new_(T("/datum/pipe_info/disposal"), 4, 2), "Trunk", new_(T("/datum/pipe_info/disposal"), 5, 2), "Bin", new_(T("/datum/pipe_info/disposal"), 6, 5), "Outlet", new_(T("/datum/pipe_info/disposal"), 7, 4), "Chute", new_(T("/datum/pipe_info/disposal"), 8, 4), "Sort Junction", new_(T("/datum/pipe_info/disposal"), 9, 2)])]);
	this.gvars_datum_init_order += "RPD_recipes";
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

// RPD.dm:144
rt.def("/obj/item/weapon/pipe_dispenser/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.paint_colors = rt.alist(f, ["grey", rt.op(f, "Rgb", [1, 3], [255, 255, 255]), "red", rt.op(f, "Rgb", [1, 3], [255, 0, 0]), "blue", rt.op(f, "Rgb", [1, 3], [0, 0, 255]), "cyan", rt.op(f, "Rgb", [1, 3], [0, 256, 249]), "green", rt.op(f, "Rgb", [1, 3], [30, 255, 0]), "yellow", rt.op(f, "Rgb", [1, 3], [255, 198, 0]), "purple", rt.op(f, "Rgb", [1, 3], [130, 43, 255])]);
	this.materials = rt.alist(f, ["$metal", 75000, "$glass", 37500]);
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

// RPD.dm:157
rt.def("/obj/item/weapon/pipe_dispenser/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	this.spark_system = (yield* new_(T("/datum/effect_system/spark_spread")));
	yield* this.spark_system.set_up(5, 0, this);
	yield* this.spark_system.attach(this);
	return f.dot;
}, true);

// RPD.dm:163
rt.def("/obj/item/weapon/pipe_dispenser/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.spark_system);
	this.spark_system = null;
	return (yield* parent_proc());
}, true);

// RPD.dm:168
rt.def("/obj/item/weapon/pipe_dispenser/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.show_menu(user);
	return f.dot;
}, true);

// RPD.dm:171
rt.def("/obj/item/weapon/pipe_dispenser/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} points the end of the RPD down ${user.p_their()} throat and presses a button! It looks like ${user.p_theyre()} trying to commit suicide...</span>`);
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/machines/click.ogg"), 50, 1);
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
	return 1;
});

// RPD.dm:177
rt.def("/obj/item/weapon/pipe_dispenser/proc/render_dir_img", function render_dir_img(f: Frame, _dir: Value, pic: Value, title: Value, flipped: Value) {
	flipped ??= 0;
	let selected: Value = " class=\"imglink\"";
	if (_dir == this.p_dir) {
		selected = " class=\"imglink selected\"";
	}
	return fmt("<a href=\"?src=＃;setdir=＀;flipped=＀\" title=\"＀\"＀\"><img src=\"＀\" /></a>", [this, _dir, flipped, title, selected, pic]);
});

// RPD.dm:183
rt.def("/obj/item/weapon/pipe_dispenser/proc/show_menu", function* show_menu(f: Frame, user: Value) {
	let preview: Value = null, category: Value = null, cat: Value = null, label: Value = null, I: Value = null, found: Value = null, color_name: Value = null, color: Value = null, selected: Value = null, datsytle: Value = null, popup: Value = null;
	let $e: any;
	if (!user || !this) {
		return 0;
	}
	let dat: Value = "<h2>Type</h2>\n<b>Utilities:</b>\n<ul>";
	if (this.p_class != -1) {
		dat += fmt("<li><a href='?src=＃;eatpipes=1;type=-1'>Eat Pipes</a></li>", [this]);
	} else {
		dat += "<li><span class='linkOn'>Eat Pipes</span></li>";
	}
	if (this.p_class != -2) {
		dat += fmt("<li><a href='?src=＃;paintpipes=1;type=-1'>Paint Pipes</a></li>", [this]);
	} else {
		dat += "<li><span class='linkOn'>Paint Pipes</span></li>";
	}
	dat += "</ul>";
	dat += "<b>Category:</b><ul>";
	if (this.screen == 0) {
		dat += fmt("<span class='linkOn'>Atmospherics</span> <A href='?src=＃;screen=＀;dmake=0;type=0'>Disposals</A><BR>", [this, 1]);
	} else if (this.screen == 1) {
		dat += fmt("<A href='?src=＃;screen=＀;makepipe=0;dir=1;type=0'>Atmospherics</A> <span class='linkOn'>Disposals</span><BR>", [this, 0]);
	}
	dat += "</ul>";
	let datbuild: Value = "";
	for (category of each(GLOB.RPD_recipes)) {
		cat = rt.index(GLOB.RPD_recipes, category);
		label = null;
		for (label of each(cat)) {
			I = rt.index(cat, label);
			found = 0;
			if (I.id == this.p_type) {
				if ((this.p_class == 0 || this.p_class == 1) && (I.type == T("/datum/pipe_info") || I.type == T("/datum/pipe_info/meter"))) {
					found = 1;
				} else if (this.p_class == 2 && I.type == T("/datum/pipe_info/disposal")) {
					found = 1;
				}
			}
			if (found) {
				preview = (yield* new_(T("/icon"), I.icon, I.icon_state));
			}
			if (this.screen == I.categoryId) {
				if (I.id == this.p_type && this.p_class >= 0) {
					datbuild += `<span class='linkOn'>${label}</span>`;
				} else {
					datbuild += I.Render(this, label);
				}
			}
		}
		if (rt.length(datbuild) > 0) {
			dat += `<b>${category}:</b><ul>`;
			dat += datbuild;
			datbuild = "";
		}
		dat += "</ul>";
	}
	let color_css: Value = "";
	let color_picker: Value = "";
	for (color_name of each(this.paint_colors)) {
		color = rt.index(this.paint_colors, color_name);
		color_css += `\n\t\t\ta.color.${color_name} {\n\t\t\t\tcolor: ${color};\n\t\t\t}\n\t\t\ta.color.${color_name}:hover {\n\t\t\t\tborder:1px solid ${color};\n\t\t\t}\n\t\t\ta.color.${color_name}.selected {\n\t\t\t\tbackground-color: ${color};\n\t\t\t}\n\t\t`;
		selected = "";
		if (color_name == this.paint_color) {
			selected = " selected";
		}
		color_picker += fmt("<a class=\"color ＀＀\" href=\"?src=＃;set_color=＀\">&bull;</a>", [color_name, selected, this, color_name]);
	}
	let dirsel: Value = "<h2>Direction</h2>";
	if (this.p_conntype === -1) {
		if (this.p_class == -2) {
			dirsel = `<h2>Color</h2>${color_picker}`;
		} else {
			dirsel = "";
		}
	} else if (this.p_conntype === 0) {
		if (preview) {
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 1 })), "vertical.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 4 })), "horizontal.png"], false);
			dirsel += "<p>";
			dirsel += this.render_dir_img(1, "vertical.png", "Vertical");
			dirsel += this.render_dir_img(4, "horizontal.png", "Horizontal");
			dirsel += "</p>";
		} else {
			dirsel += fmt("\n\t\t<p>\n\t\t\t<a href=\"?src=＃;setdir=1; flipped=0\" title=\"vertical\">&#8597;</a>\n\t\t\t<a href=\"?src=＃;setdir=4; flipped=0\" title=\"horizontal\">&harr;</a>\n\t\t</p>\n\t\t\t\t", [this, this]);
		}
	} else if (this.p_conntype === 1) {
		if (preview) {
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 1 })), "vertical.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 4 })), "horizontal.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 9 })), "nw.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 5 })), "ne.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 10 })), "sw.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 6 })), "se.png"], false);
			dirsel += "<p>";
			dirsel += this.render_dir_img(1, "vertical.png", "Vertical");
			dirsel += this.render_dir_img(4, "horizontal.png", "Horizontal");
			dirsel += "<br />";
			dirsel += this.render_dir_img(9, "nw.png", "West to North");
			dirsel += this.render_dir_img(5, "ne.png", "North to East");
			dirsel += "<br />";
			dirsel += this.render_dir_img(10, "sw.png", "South to West");
			dirsel += this.render_dir_img(6, "se.png", "East to South");
			dirsel += "</p>";
		} else {
			dirsel += fmt("\n\t\t<p>\n\t\t\t<a href=\"?src=＃;setdir=1; flipped=0\" title=\"vertical\">&#8597;</a>\n\t\t\t<a href=\"?src=＃;setdir=4; flipped=0\" title=\"horizontal\">&harr;</a>\n\t\t\t<br />\n\t\t\t<a href=\"?src=＃;setdir=9; flipped=0\" title=\"West to North\">&#9565;</a>\n\t\t\t<a href=\"?src=＃;setdir=5; flipped=0\" title=\"North to East\">&#9562;</a>\n\t\t\t<br />\n\t\t\t<a href=\"?src=＃;setdir=10; flipped=0\" title=\"South to West\">&#9559;</a>\n\t\t\t<a href=\"?src=＃;setdir=6; flipped=0\" title=\"East to South\">&#9556;</a>\n\t\t</p>\n\t\t\t\t", [this, this, this, this, this, this]);
		}
	} else if (this.p_conntype === 2) {
		if (preview) {
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 1 })), "s.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 4 })), "w.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 2 })), "n.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 8 })), "e.png"], false);
			dirsel += "<p>";
			dirsel += this.render_dir_img(1, "s.png", "West South East");
			dirsel += this.render_dir_img(4, "w.png", "North West South");
			dirsel += "<br />";
			dirsel += this.render_dir_img(2, "n.png", "East North West");
			dirsel += this.render_dir_img(8, "e.png", "South East North");
			dirsel += "</p>";
		} else {
			dirsel += fmt("\n\t\t<p>\n\t\t\t<a href=\"?src=＃;setdir=1; flipped=0\" title=\"West, South, East\">&#9574;</a>\n\t\t\t<a href=\"?src=＃;setdir=4; flipped=0\" title=\"North, West, South\">&#9571;</a>\n\t\t\t<br />\n\t\t\t<a href=\"?src=＃;setdir=2; flipped=0\" title=\"East, North, West\">&#9577;</a>\n\t\t\t<a href=\"?src=＃;setdir=8; flipped=0\" title=\"South, East, North\">&#9568;</a>\n\t\t</p>\n\t\t\t\t", [this, this, this, this]);
		}
	} else if (this.p_conntype === 3) {
		if (preview) {
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 1 })), "s.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 4 })), "w.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 2 })), "n.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 8 })), "e.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 6 })), "sm.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 5 })), "wm.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 9 })), "nm.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 10 })), "em.png"], false);
			dirsel += "<p>";
			dirsel += this.render_dir_img(1, "s.png", "West South East");
			dirsel += this.render_dir_img(4, "w.png", "North West South");
			dirsel += "<br />";
			dirsel += this.render_dir_img(2, "n.png", "East North West");
			dirsel += this.render_dir_img(8, "e.png", "South East North");
			dirsel += "<br />";
			dirsel += this.render_dir_img(6, "sm.png", "West South East", 1);
			dirsel += this.render_dir_img(5, "wm.png", "North West South", 1);
			dirsel += "<br />";
			dirsel += this.render_dir_img(9, "nm.png", "East North West", 1);
			dirsel += this.render_dir_img(10, "em.png", "South East North", 1);
			dirsel += "</p>";
		} else {
			dirsel += fmt("\n\t\t<p>\n\t\t\t<a href=\"?src=＃;setdir=1; flipped=0\" title=\"West, South, East\">&#9574;</a>\n\t\t\t<a href=\"?src=＃;setdir=4; flipped=0\" title=\"North, West, South\">&#9571;</a>\n\t\t\t<br />\n\t\t\t<a href=\"?src=＃;setdir=2; flipped=0\" title=\"East, North, West\">&#9577;</a>\n\t\t\t<a href=\"?src=＃;setdir=8; flipped=0\" title=\"South, East, North\">&#9568;</a>\n\t\t\t<br />\n\t\t\t<a href=\"?src=＃;setdir=6; flipped=1\" title=\"West, South, East\">&#9574;</a>\n\t\t\t<a href=\"?src=＃;setdir=5; flipped=1\" title=\"North, West, South\">&#9571;</a>\n\t\t\t<br />\n\t\t\t<a href=\"?src=＃;setdir=9; flipped=1\" title=\"East, North, West\">&#9577;</a>\n\t\t\t<a href=\"?src=＃;setdir=10; flipped=1\" title=\"South, East, North\">&#9568;</a>\n\t\t</p>\n\t\t\t\t", [this, this, this, this, this, this, this, this]);
		}
	} else if (this.p_conntype === 4) {
		if (preview) {
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 1 })), "n.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 4 })), "e.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 2 })), "s.png"], false);
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview, { dir: 8 })), "w.png"], false);
			dirsel += "<p>";
			dirsel += this.render_dir_img(1, "n.png", "North");
			dirsel += this.render_dir_img(4, "e.png", "East");
			dirsel += this.render_dir_img(2, "s.png", "South");
			dirsel += this.render_dir_img(8, "w.png", "West");
			dirsel += "</p>";
		} else {
			dirsel += fmt("\n\t\t<p>\n\t\t\t<a href=\"?src=＃;setdir=＀; flipped=0\" title=\"North\">&uarr;</a>\n\t\t\t<a href=\"?src=＃;setdir=＀; flipped=0\" title=\"East\">&rarr;</a>\n\t\t\t<a href=\"?src=＃;setdir=＀; flipped=0\" title=\"South\">&darr;</a>\n\t\t\t<a href=\"?src=＃;setdir=＀; flipped=0\" title=\"West\">&larr;</a>\n\t\t</p>\n\t\t\t\t\t", [this, 1, this, 4, this, 2, this, 8]);
		}
	} else if (this.p_conntype === 5) {
		if (preview) {
			rt.op(f, "BrowseResource", [], [user, (yield* new_(T("/icon"), preview)), "pipe.png"], false);
			dirsel += "<p>";
			dirsel += this.render_dir_img(1, "pipe.png", "Pipe");
			dirsel += "</p>";
		} else {
			dirsel += fmt("\n\t\t<p>\n\t\t\t<a href=\"?src=＃;setdir=1; flipped=0\" title=\"Pipe\">&#8597;</a>\n\t\t</p>\n\t\t\t\t", [this]);
		}
	}
	dat = (datsytle = `\n<style type="text/css">\n\ta.imglink {\n\t\tpadding: none;\n\t\ttext-decoration:none;\n\t\tborder-style:none;\n\t\tbackground:none;\n\t\tmargin: 1px;\n\t}\n\n\ta.imglink:hover {\n\t\tbackground:none;\n\t\tcolor:none;\n\t}\n\n\ta.imglink.selected img {\n\t\tborder: 1px solid #24722e;\n\t\tbackground: #2f943c;\n\t}\n\n\ta img {\n\t\tborder: 1px solid #161616;\n\t\tbackground: #40628a;\n\t}\n\n\ta.color {\n\t\tpadding: 5px 10px;\n\t\tfont-size: large;\n\t\tfont-weight: bold;\n\t\tborder: 1px solid #161616;\n\t}\n\n\ta.selected img,\n\t\ta:hover {\n\t\t\tbackground: #0066cc;\n\t\t\tcolor: #ffffff;\n\t\t}\n\t\t${color_css}\n</style>`) + dirsel + dat;
	(popup = (yield* new_(T("/datum/browser"), user, "pipedispenser", this.name, 300, 550))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// RPD.dm:457
rt.def("/obj/item/weapon/pipe_dispenser/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let new_type: Value = null;
	if (!f.usr.canUseTopic(this)) {
		rt.op(f, "Browse", [], [f.usr, null, "window=pipedispenser"], false);
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (rt.at(href_list, "screen")) {
		this.screen = text2num(rt.at(href_list, "screen"));
		yield* this.show_menu(f.usr);
	}
	if (rt.at(href_list, "setdir")) {
		this.p_dir = text2num(rt.at(href_list, "setdir"));
		this.p_flipped = text2num(rt.at(href_list, "flipped"));
		yield* this.show_menu(f.usr);
	}
	if (rt.at(href_list, "eatpipes")) {
		this.p_class = EATING_MODE;
		this.p_conntype = -1;
		this.p_dir = 1;
		yield* this.spark_system.start();
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/pop.ogg"), 50, 0);
		yield* this.show_menu(f.usr);
	}
	if (rt.at(href_list, "paintpipes")) {
		this.p_class = PAINT_MODE;
		this.p_conntype = -1;
		this.p_dir = 1;
		yield* this.spark_system.start();
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/pop.ogg"), 50, 0);
		yield* this.show_menu(f.usr);
	}
	if (rt.at(href_list, "set_color")) {
		this.paint_color = rt.at(href_list, "set_color");
		yield* this.spark_system.start();
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/pop.ogg"), 50, 0);
		yield* this.show_menu(f.usr);
	}
	if (rt.at(href_list, "makepipe")) {
		new_type = text2path(rt.at(href_list, "makepipe")); if (rt.isIn(f, new_type, GLOB.pipe_types)) this.p_type = new_type; // tg's own hole: makepipe= took any type path (makepipe=0, the Atmospherics tab, now keeps the last pipe)
		this.p_dir = text2num(rt.at(href_list, "dir"));
		this.p_conntype = text2num(rt.at(href_list, "type"));
		this.p_class = ATMOS_MODE;
		yield* this.spark_system.start();
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/pop.ogg"), 50, 0);
		yield* this.show_menu(f.usr);
	}
	if (rt.at(href_list, "makemeter")) {
		this.p_class = METER_MODE;
		this.p_conntype = -1;
		this.p_dir = 1;
		yield* this.spark_system.start();
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/pop.ogg"), 50, 0);
		yield* this.show_menu(f.usr);
	}
	if (!rt.at(href_list, "dmake")) return f.dot;
	this.p_type = text2num(rt.at(href_list, "dmake"));
	this.p_conntype = text2num(rt.at(href_list, "type"));
	this.p_dir = 1;
	this.p_class = DISPOSALS_MODE;
	yield* this.spark_system.start();
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/pop.ogg"), 50, 0);
	yield* this.show_menu(f.usr);
	return f.dot;
}, true);

// RPD.dm:521
rt.def("/obj/item/weapon/pipe_dispenser/proc/pre_attackby", function* pre_attackby(f: Frame, A: Value, user: Value) {
	let _P: Value = null, C: Value = null;
	if (!user.IsAdvancedToolUser() || rt.istype(A, T("/turf/open/space/transit"))) {
		return (yield* parent_proc());
	}
	let is_paintable: Value = ((this.p_class == PAINT_MODE ? 1 : 0) && (rt.istype(A, T("/obj/machinery/atmospherics/pipe")) ? 1 : 0));
	let is_consumable: Value = ((this.p_class == -1 ? 1 : 0) && (((rt.istype(A, T("/obj/item/pipe")) ? 1 : 0) || (rt.istype(A, T("/obj/item/pipe_meter")) ? 1 : 0)) || (rt.istype(A, T("/obj/structure/disposalconstruct")) ? 1 : 0)));
	let can_make_pipe: Value = ((((this.p_class == 0 ? 1 : 0) || (this.p_class == 1 ? 1 : 0)) || (this.p_class == DISPOSALS_MODE ? 1 : 0)) && isturf(A));
	if (!is_paintable && !is_consumable && !can_make_pipe) {
		return (yield* parent_proc());
	}
	let queued_p_type: Value = this.p_type;
	let queued_p_dir: Value = this.p_dir;
	let queued_p_flipped: Value = this.p_flipped;
	f.dot = 0;
	if (this.p_class === PAINT_MODE) {
		_P = A;
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/click.ogg"), 50, 1);
		_P.add_atom_colour(rt.index(this.paint_colors, this.paint_color), FIXED_COLOUR_PRIORITY);
		_P.pipe_color = rt.index(this.paint_colors, this.paint_color);
		user.visible_message(fmt("<span class='notice'>＀ paints ％！ ＀.</span>", [user, _P, this.paint_color]), fmt("<span class='notice'>You paint ％！ ＀.</span>", [_P, this.paint_color]));
		yield* _P.update_node_icon();
		return f.dot;
	} else if (this.p_class === EATING_MODE) {
		to_chat(user, "<span class='notice'>You start destroying a pipe...</span>");
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/click.ogg"), 50, 1);
		if (yield* do_after(user, 2, { target: A })) {
			yield* this.activate();
			yield* qdel(A);
		}
	} else if (this.p_class === ATMOS_MODE) {
		to_chat(user, "<span class='notice'>You start building a pipe...</span>");
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/click.ogg"), 50, 1);
		if (yield* do_after(user, 2, { target: A })) {
			yield* this.activate();
			(_P = (yield* new_(T("/obj/item/pipe"), A, { pipe_type: queued_p_type, dir: queued_p_dir }))).flipped = queued_p_flipped;
			yield* _P.update();
			yield* _P.add_fingerprint(f.usr);
		}
	} else if (this.p_class === METER_MODE) {
		to_chat(user, "<span class='notice'>You start building a meter...</span>");
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/click.ogg"), 50, 1);
		if (yield* do_after(user, DISPOSALS_MODE, { target: A })) {
			yield* this.activate();
			yield* new_(T("/obj/item/pipe_meter"), A);
		}
	} else if (this.p_class === DISPOSALS_MODE) {
		if (is_anchored_dense_turf(A)) {
			to_chat(user, `<span class='warning'>The ${this}'s error light flickers; there's something in the way!</span>`);
			return f.dot;
		}
		to_chat(user, "<span class='notice'>You start building a disposals pipe...</span>");
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/click.ogg"), 50, 1);
		if (!(yield* do_after(user, 4, { target: A }))) return f.dot;
		if (!(C = (yield* new_(T("/obj/structure/disposalconstruct"), A, queued_p_type, queued_p_dir))).can_place()) {
			to_chat(user, "<span class='warning'>There's not enough room to build that here!</span>");
			yield* qdel(C);
			return f.dot;
		}
		yield* this.activate();
		yield* C.add_fingerprint(f.usr);
		yield* C.update_icon();
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// RPD.dm:597
rt.def("/obj/item/weapon/pipe_dispenser/proc/activate", function activate(f: Frame) {
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
	return f.dot;
});
