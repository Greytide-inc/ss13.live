// Based on /tg/station's code/game/objects/items/blueprints.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(9651, "/obj/item/areaeditor", "/obj/item", {
	fluffnotice: "Nobody's gonna read this stuff!",
	attack_verb: null,
	name: "area modification item",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "blueprints",
});

// blueprints.dm:24
rt.def("/obj/item/areaeditor/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	let text: Value = `<BODY><HTML><head><title>${this}</title></head> <h2>${station_name()} ${this.name}</h2> <small>${this.fluffnotice}</small><hr>`;
	const area_type = this.get_area_type();
	if (area_type === AREA_SPACE) {
		text += fmt("<p>According to the ＀, you are now in an unclaimed territory.</p> <p><a href='?src=＃;create_area=1'>Mark this place as new area.</a></p>", [this.name, this]);
	} else if (area_type === AREA_SPECIAL) {
		text += `<p>This place is not noted on the ${this.name}.</p>`;
	}
	return text;
}, true);

// blueprints.dm:38
rt.def("/obj/item/areaeditor/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!f.usr.canUseTopic(this)) {
		rt.op(f, "Browse", [], [f.usr, null, "window=blueprints"], false);
		return f.dot;
	}
	if (rt.at(href_list, "create_area")) {
		if (this.get_area_type() == AREA_SPACE) {
			yield* create_area(f.usr);
		}
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

rt.type(9652, "/obj/item/areaeditor/blueprints", "/obj/item/areaeditor", {
	showing: null,
	viewing: null,
	legend: 0,
	fluffnotice: "Property of Nanotrasen. For heads of staff only. Store in high-secure storage.",
	name: "station blueprints",
	desc: "Blueprints of the station. There is a \"Classified\" stamp and several coffee stains on it.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "blueprints",
	resistance_flags: 99,
});

// blueprints.dm:56
rt.def("/obj/item/areaeditor/blueprints/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.showing = list();
	return f.dot;
});

// blueprints.dm:62
rt.def("/obj/item/areaeditor/blueprints/proc/Destroy", function* Destroy(f: Frame) {
	this.clear_viewer();
	return (yield* parent_proc());
}, true);

// blueprints.dm:67
rt.def("/obj/item/areaeditor/blueprints/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let A: Value = null, popup: Value = null;
	f.dot = (yield* parent_proc());
	if (!this.legend) {
		A = this.get_area();
		if (this.get_area_type() == 1) {
			f.dot += fmt("<p>According to ％！, you are now in <b>\"＀\"</b>.</p>", [this, html_encode(A.name)]);
			f.dot += fmt("<p>You may <a href='?src=＃;edit_area=1'>make an amendment</a> to the drawing.</p>", [this]);
		}
		f.dot += fmt("<p><a href='?src=＃;view_legend=1'>View wire colour legend</a></p>", [this]);
		if (!this.viewing) {
			f.dot += fmt("<p><a href='?src=＃;view_blueprints=1'>View structural data</a></p>", [this]);
		} else {
			f.dot += fmt("<p><a href='?src=＃;refresh=1'>Refresh structural data</a></p>", [this]);
			f.dot += fmt("<p><a href='?src=＃;hide_blueprints=1'>Hide structural data</a></p>", [this]);
		}
	} else if (this.legend == 1) {
		f.dot += fmt("<a href='?src=＃;exit_legend=1'><< Back</a>", [this]);
		f.dot += this.view_wire_devices(user);
	} else {
		f.dot += fmt("<a href='?src=＃;view_legend=1'><< Back</a>", [this]);
		f.dot += this.view_wire_set(user, this.legend);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "blueprints", `${this}`, 700, 500))).set_content(f.dot);
	yield* popup.open();
	onclose(user, "blueprints");
	return f.dot;
}, true);

// blueprints.dm:94
rt.def("/obj/item/areaeditor/blueprints/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (rt.at(href_list, "edit_area")) {
		if (this.get_area_type() != 1) {
			return f.dot;
		}
		yield* this.edit_area();
	}
	if (rt.at(href_list, "exit_legend")) {
		this.legend = 0;
	}
	if (rt.at(href_list, "view_legend")) {
		this.legend = 1;
	}
	if (rt.at(href_list, "view_wireset")) {
		this.legend = rt.at(href_list, "view_wireset");
	}
	if (rt.at(href_list, "view_blueprints")) {
		this.set_viewer(f.usr, "<span class='notice'>You flip the blueprints over to view the complex information diagram.</span>");
	}
	if (rt.at(href_list, "hide_blueprints")) {
		this.clear_viewer(f.usr, "<span class='notice'>You flip the blueprints over to view the simple information diagram.</span>");
	}
	if (rt.at(href_list, "refresh")) {
		this.clear_viewer(f.usr);
		this.set_viewer(f.usr);
	}
	yield* this.attack_self(f.usr);
	return f.dot;
}, true);

// blueprints.dm:116
rt.def("/obj/item/areaeditor/blueprints/proc/get_images", function get_images(f: Frame, _T: Value, viewsize: Value) {
	let tt: Value = null, TT: Value = null;
	f.dot = list();
	for (tt of each(block(rt.locate(max(_T.x - viewsize, 1), max(_T.y - viewsize, 1), _T.z), rt.locate(min(_T.x + viewsize, rt.world().maxx), min(_T.y + viewsize, rt.world().maxy), _T.z)))) {
		if ((TT = tt).blueprint_data) {
			f.dot += TT.blueprint_data;
		}
	}
	return f.dot;
});

// blueprints.dm:123
rt.def("/obj/item/areaeditor/blueprints/proc/set_viewer", function set_viewer(f: Frame, user: Value, message: Value) {
	message ??= "";
	if (!(user && user.client)) return f.dot;
	if (this.viewing) {
		this.clear_viewer();
	}
	this.viewing = user.client;
	let viewscale: Value = getviewsize(this.viewing.view);
	this.showing = this.get_images(rt.getStep(f, user, 0), round(max(rt.index(viewscale, 1), rt.index(viewscale, 2)) / 2));
	(rt.modField(f, this.viewing, "images", this.showing, rt.bitOr));
	if (!message) return f.dot;
	to_chat(user, message);
	return f.dot;
});

// blueprints.dm:135
rt.def("/obj/item/areaeditor/blueprints/proc/clear_viewer", function clear_viewer(f: Frame, user: Value, message: Value) {
	message ??= "";
	if (this.viewing) {
		this.viewing.images -= this.showing;
		this.viewing = null;
	}
	this.showing.Cut();
	if (!message) return f.dot;
	to_chat(user, message);
	return f.dot;
});

// blueprints.dm:142
rt.def("/obj/item/areaeditor/blueprints/proc/dropped", function* dropped(f: Frame, user: Value) {
	yield* parent_proc();
	this.clear_viewer();
	this.legend = 0;
	return f.dot;
}, true);

// blueprints.dm:148
rt.def("/obj/item/areaeditor/proc/get_area", function get_area(f: Frame) {
	let A: Value = null;
	let _T: Value = rt.getStep(f, f.usr, 0);
	return (A = _T.loc);
});

// blueprints.dm:153
rt.def("/obj/item/areaeditor/proc/get_area_type", function get_area_type(f: Frame, A: Value) {
	let type: Value = null;
	A ??= this.get_area();
	if (A.outdoors) {
		return AREA_SPACE;
	}
	let SPECIALS: Value = list(T("/area/shuttle"), T("/area/admin"), T("/area/arrival"), T("/area/centcom"), T("/area/asteroid"), T("/area/tdome"), T("/area/wizard_station"), T("/area/prison"));
	for (type of each(SPECIALS)) {
		if (rt.op(f, "IsType", [], [A, type])) {
			return AREA_SPECIAL;
		}
	}
	return AREA_STATION;
});

// blueprints.dm:171
rt.def("/obj/item/areaeditor/blueprints/proc/view_wire_devices", function view_wire_devices(f: Frame, user: Value) {
	let wireset: Value = null;
	let message: Value = "<br>You examine the wire legend.<br>";
	for (wireset of each(GLOB.wire_color_directory)) {
		message += fmt("<br><a href='?src=＃;view_wireset=＀'>＀</a>", [this, wireset, rt.index(GLOB.wire_name_directory, wireset)]);
	}
	return (message += "</p>");
});

// blueprints.dm:179
rt.def("/obj/item/areaeditor/blueprints/proc/view_wire_set", function view_wire_set(f: Frame, user: Value, wireset: Value) {
	let device: Value = null, message: Value = null, Col: Value = null, wire_name: Value = null;
	for (device of each(GLOB.wire_color_directory)) {
		if (`${device}` == wireset) {
			message = `<p><b>${rt.index(GLOB.wire_name_directory, device)}:</b>`;
			Col = null;
			for (Col of each(rt.index(GLOB.wire_color_directory, device))) {
				if (!findtext((wire_name = rt.index(rt.index(GLOB.wire_color_directory, device), Col)), "__dud")) {
					message += `<p><span style='color: ${Col}'>${Col}</span>: ${wire_name}</p>`;
				}
			}
			return (message += "</p>");
		}
	}
	return "";
});

// blueprints.dm:191
rt.def("/proc/create_area", function* create_area(f: Frame, creator: Value) {
	let res: Value = null, str: Value = null, A: Value = null, key: Value = null, _T: Value = null, old_area: Value = null, RA: Value = null, D: Value = null, FD: Value = null;
	let $e: any;
	if (!rt.istype((res = detect_room(rt.getStep(f, creator, 0))), T("/list"))) {
		if (res === ROOM_ERR_SPACE) {
			to_chat(creator, "<span class='warning'>The new area must be completely airtight.</span>");
			return f.dot;
		} else if (res === ROOM_ERR_TOOLARGE) {
			to_chat(creator, "<span class='warning'>The new area is too large.</span>");
			return f.dot;
		} else {
			to_chat(creator, "<span class='warning'>Error! Please notify administration.</span>");
			return f.dot;
		}
	}
	let turfs: Value = res;
	if (!(str = trim((yield* stripped_input(creator, "New area name:", "Blueprint Editing", "", 42)))) || !rt.length(str)) {
		return f.dot;
	}
	if (rt.length(str) > 50) {
		to_chat(creator, "<span class='warning'>The given name is too long.  The area remains undefined.</span>");
		return f.dot;
	}
	let old: Value = get_area(rt.getStep(f, creator, 0));
	let old_gravity: Value = old.has_gravity;
	for (key of each(turfs)) {
		if (key == str) {
			A = rt.index(turfs, key);
		}
		if (rt.index(turfs, key)) {
			turfs -= rt.index(turfs, key);
			turfs -= key;
		}
	}
	if (A) {
		yield* A.set_dynamic_lighting();
		for (_T of each(turfs, T("/turf"))) {
			old_area = _T.loc;
			A.contents += _T;
			yield* _T.change_area(old_area, _T);
		}
	} else {
		yield* (A = (yield* new_(T("/area")))).setup(str);
		yield* A.set_dynamic_lighting();
		_T = null;
		for (_T of each(turfs, T("/turf"))) {
			old_area = _T.loc;
			A.contents += _T;
			yield* _T.change_area(old_area, _T);
		}
	}
	A.has_gravity = old_gravity;
	for (RA of each(old.related, T("/area"))) {
		if (RA.firedoors) {
			D = null;
			for (D of each(RA.firedoors)) {
				(FD = D).CalculateAffectingAreas();
			}
		}
	}
	to_chat(creator, `<span class='notice'>You have created a new area, named ${str}. It is now weather proof, and constructing an APC will allow it to be powered.</span>`);
	return 1;
}, true);

// blueprints.dm:248
rt.def("/obj/item/areaeditor/proc/edit_area", function* edit_area(f: Frame) {
	let str: Value = null, RA: Value = null, D: Value = null, FD: Value = null;
	let A: Value = this.get_area();
	let prevname: Value = `${A.name}`;
	if (!(str = trim((yield* stripped_input(f.usr, "New area name:", "Area Creation", "", 42)))) || !rt.length(str) || str == prevname) {
		return f.dot;
	}
	if (rt.length(str) > 50) {
		to_chat(f.usr, "<span class='warning'>The given name is too long.  The area's name is unchanged.</span>");
		return f.dot;
	}
	this.set_area_machinery_title(A, str, prevname);
	for (RA of each(A.related, T("/area"))) {
		RA.name = str;
		if (RA.firedoors) {
			D = null;
			for (D of each(RA.firedoors)) {
				(FD = D).CalculateAffectingAreas();
			}
		}
	}
	to_chat(f.usr, `<span class='notice'>You rename the '${prevname}' to '${str}'.</span>`);
	yield* this.interact();
	return 1;
}, true);

// blueprints.dm:269
rt.def("/obj/item/areaeditor/proc/set_area_machinery_title", function set_area_machinery_title(f: Frame, A: Value, title: Value, oldtitle: Value) {
	let RA: Value = null, M: Value = null;
	if (!oldtitle) {
		return f.dot;
	}
	for (RA of each(A.related, T("/area"))) {
		M = null;
		for (M of each(RA, T("/obj/machinery/airalarm"))) {
			M.name = replacetext(M.name, oldtitle, title);
		}
		M = null;
		for (M of each(RA, T("/obj/machinery/power/apc"))) {
			M.name = replacetext(M.name, oldtitle, title);
		}
		M = null;
		for (M of each(RA, T("/obj/machinery/atmospherics/components/unary/vent_scrubber"))) {
			M.name = replacetext(M.name, oldtitle, title);
		}
		M = null;
		for (M of each(RA, T("/obj/machinery/atmospherics/components/unary/vent_pump"))) {
			M.name = replacetext(M.name, oldtitle, title);
		}
		M = null;
		for (M of each(RA, T("/obj/machinery/door"))) {
			M.name = replacetext(M.name, oldtitle, title);
		}
	}
	return f.dot;
});

// blueprints.dm:295
rt.def("/turf/open/proc/check_tile_is_border", function check_tile_is_border(f: Frame) {
	let AM: Value = null;
	let $0: any, $e: any;
	for (AM of each(this, T("/atom/movable"))) {
		if (AM.CanAtmosPass == -1) {
			$0 = AM.CanAtmosPass(this);
		} else if (AM.CanAtmosPass == -2) {
			$0 = (!AM.density ? 1 : 0);
		} else {
			$0 = AM.CanAtmosPass;
		}
		if (!$0) {
			return BORDER_2NDTILE;
		}
	}
	return BORDER_NONE;
});

// blueprints.dm:305
rt.def("/proc/detect_room", function detect_room(f: Frame, first: Value) {
	let _T: Value = null, dir: Value = null, skip: Value = null, W: Value = null, D: Value = null, NT: Value = null, A: Value = null, V: Value = null, F: Value = null, direction: Value = null, U: Value = null;
	let $e: any;
	let found: Value = new_(T("/list"));
	let pending: Value = list(first);
	let border: Value = list();
	while (rt.len(f, pending)) {
		if (rt.len(f, found) + rt.len(f, pending) > 300) {
			return ROOM_ERR_TOOLARGE;
		}
		pending -= (_T = rt.index(pending, 1));
		dir = null;
		for (dir of each(GLOB.cardinal)) {
			skip = 0;
			W = null;
			for (W of each(_T, T("/obj/structure/window"))) {
				if (dir == W.dir || rt.isIn(f, W.dir, list(5, 6, 9, 10))) {
					skip = BORDER_NONE;
					break;
				}
			}
			if (skip) {
				continue;
			}
			D = null;
			for (D of each(_T, T("/obj/machinery/door/window"))) {
				if (dir == D.dir) {
					skip = ROOM_ERR_SPACE;
					break;
				}
			}
			if (skip) {
				continue;
			}
			if (!isturf((NT = rt.getStep(f, _T, dir))) || rt.isIn(f, NT, found) || rt.isIn(f, NT, pending)) {
				continue;
			}
			const check_tile_is_border = NT.check_tile_is_border();
			if (check_tile_is_border === BORDER_NONE) {
				pending += NT;
			} else if (check_tile_is_border === BORDER_BETWEEN) {
				A = NT.loc;
				if (!rt.index(found, A.name)) {
					rt.setAt(found, A.name, NT.loc);
				}
			} else if (check_tile_is_border === BORDER_2NDTILE) {
				rt.modAt(border, NT, dir, add);
			} else if (check_tile_is_border === BORDER_SPACE) {
				return ROOM_ERR_SPACE;
			}
		}
		found += _T;
	}
	for (V of each(border)) {
		F = V;
		direction = null;
		for (direction of each(GLOB.cardinal)) {
			if (direction == rt.index(border, F)) {
				continue;
			}
			if (rt.isIn(f, (U = rt.getStep(f, F, direction)), border) || rt.isIn(f, U, found)) {
				continue;
			}
			if (U.check_tile_is_border() == BORDER_2NDTILE) {
				found += U;
			}
		}
		(found = rt.modify(found, F, rt.bitOr));
	}
	return found;
});
