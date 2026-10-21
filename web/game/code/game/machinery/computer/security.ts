// From code/game/machinery/computer/security.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10408, "/obj/machinery/computer/secure_data", "/obj/machinery/computer", {
	scan: null,
	authenticated: null,
	rank: null,
	screen: null,
	active1: null,
	active2: null,
	a_id: null,
	temp: null,
	printing: null,
	can_change_id: 0,
	Perp: null,
	tempname: null,
	sortBy: "name",
	order: 1,
	icon_screen: "security",
	icon_keyboard: "security_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/secure_data"),
	light_color: "#FA8282",
	name: "security records console",
	desc: "Used to view and edit personnel's security records.",
	req_one_access: null,
});

// /obj/machinery/computer/secure_data/proc/attackby  (code/game/machinery/computer/security.dm:35)  may sleep
rt.def("/obj/machinery/computer/secure_data/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "scan"))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			rt.setFv(f, "loc", live(f.args[0]), live(f.src));
			rt.setSv(f, "scan", live(f.args[0]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀.</span>", [live(f.args[0])])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There's already an ID card in the console.</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/computer/secure_data/proc/attack_hand  (code/game/machinery/computer/security.dm:49)  may sleep
rt.def("/obj/machinery/computer/secure_data/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, R: Value = null, crimstat: Value = null, E: Value = null, background: Value = null, P1: Value = null, P2: Value = null, c: Value = null, counter: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [dat, R, crimstat, E, background, P1, P2, c, counter, popup, $0, $1, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (rt.gt(rt.fv(f, "z", live(f.src)), 6)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='boldannounce'>Unable to establish a connection</span>:  You're too far away from the station!"]);
		return live(f.dot);
	}
	dat = null;
	if (truthy(rt.sv(f, "temp"))) {
		dat = fmt("<TT>＀</TT><BR><BR><A href='?src=＃;choice=Clear Screen'>Clear Screen</A>", [rt.sv(f, "temp"), live(f.src)]);
	} else {
		$0 = live(f.src);
		if (truthy(rt.sv(f, "scan"))) {
			$1 = fmt("＀", [rt.fv(f, "name", rt.sv(f, "scan"))]);
		} else {
			$1 = "----------";
		}
		dat = fmt("Confirm Identity: <A href='?src=＃;choice=Confirm Identity'>＀</A><HR>", [$0, $1]);
		if (truthy(rt.sv(f, "authenticated"))) {
			$0 = rt.sv(f, "screen");
			if ($0 === 1) {
				dat = rt.modify(live(dat), "<body onload='selectTextField(); updateSearch();' onkeyup='updateSearch();'>", add);
				dat = rt.modify(live(dat), "\n\n\t\t<head>\n\t\t\t<script src=\"jquery.min.js\"></script>\n\t\t\t<script type='text/javascript'>\n\n\t\t\t\tfunction updateSearch(){\n\t\t\t\t\tvar filter_text = document.getElementById('filter');\n\t\t\t\t\tvar filter = filter_text.value.toLowerCase();\n\n\t\t\t\t\tif(complete_list != null && complete_list != \"\"){\n\t\t\t\t\t\tvar mtbl = document.getElementById(\"maintable_data_archive\");\n\t\t\t\t\t\tmtbl.innerHTML = complete_list;\n\t\t\t\t\t}\n\n\t\t\t\t\tif(filter.value == \"\"){\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}else{\n\t\t\t\t\t\t$(\"#maintable_data\").children(\"tbody\").children(\"tr\").children(\"td\").children(\"input\").filter(function(index)\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\treturn $(this)[0].value.toLowerCase().indexOf(filter) == -1\n\t\t\t\t\t\t}).parent(\"td\").parent(\"tr\").hide()\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tfunction selectTextField(){\n\t\t\t\t\tvar filter_text = document.getElementById('filter');\n\t\t\t\t\tfilter_text.focus();\n\t\t\t\t\tfilter_text.select();\n\t\t\t\t}\n\n\t\t\t</script>\n\t\t</head>\n\n\n\t", add);
				dat = rt.modify(live(dat), "\n<p style='text-align:center;'>", add);
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;choice=New Record (General)'>New Record</A><BR>", [live(f.src)]), add);
				dat = rt.modify(live(dat), "\n\t\t\t\t\t\t<table width='560' align='center' cellspacing='0' cellpadding='5' id='maintable'>\n\t\t\t\t\t\t\t<tr id='search_tr'>\n\t\t\t\t\t\t\t\t<td align='center'>\n\t\t\t\t\t\t\t\t\t<b>Search:</b> <input type='text' id='filter' value='' style='width:300px;'>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t", add);
				dat = rt.modify(live(dat), fmt("\n</p>\n<table style=\"text-align:center;\" cellspacing=\"0\" width=\"100%\">\n<tr>\n<th>Records:</th>\n</tr>\n</table>\n\n<span id='maintable_data_archive'>\n<table id='maintable_data' style=\"text-align:center;\" border=\"1\" cellspacing=\"0\" width=\"100%\">\n<tr>\n<th><A href='?src=＃;choice=Sorting;sort=name'>Name</A></th>\n<th><A href='?src=＃;choice=Sorting;sort=id'>ID</A></th>\n<th><A href='?src=＃;choice=Sorting;sort=rank'>Rank</A></th>\n<th><A href='?src=＃;choice=Sorting;sort=fingerprint'>Fingerprints</A></th>\n<th>Criminal Status</th>\n</tr>", [live(f.src), live(f.src), live(f.src), live(f.src)]), add);
				if (rt.fv(f, "general", rt.gl("data_core")) !== null) {
					R = null;
					rt.forList(f, 0, (yield* g.call(f, P("/proc/sortRecord"), null, [rt.fv(f, "general", rt.gl("data_core")), rt.sv(f, "sortBy"), rt.sv(f, "order")])), T("/datum/data/record"));
					while (($e = rt.next(f, 0)) !== undefined) {
						R = $e;
						crimstat = "";
						E = null;
						rt.forList(f, 1, rt.fv(f, "security", rt.gl("data_core")), T("/datum/data/record"));
						while (($e = rt.next(f, 1)) !== undefined) {
							E = $e;
							if ((isEqual(rt.index(rt.fv(f, "fields", live(E)), "name"), rt.index(rt.fv(f, "fields", live(R)), "name")) && isEqual(rt.index(rt.fv(f, "fields", live(E)), "id"), rt.index(rt.fv(f, "fields", live(R)), "id")))) {
								crimstat = rt.index(rt.fv(f, "fields", live(E)), "criminal");
							}
						}
						rt.endFor(f, 1);
						background = null;
						$0 = live(crimstat);
						if ($0 === "*Arrest*") {
							background = "'background-color:#990000;'";
						} else if ($0 === "Incarcerated") {
							background = "'background-color:#CD6500;'";
						} else if ($0 === "Parolled") {
							background = "'background-color:#CD6500;'";
						} else if ($0 === "Discharged") {
							background = "'background-color:#006699;'";
						} else if ($0 === "None") {
							background = "'background-color:#4F7529;'";
						} else if ($0 === "") {
							background = "''";
							crimstat = "No Record.";
						}
						dat = rt.modify(live(dat), fmt("<tr style=＀>", [live(background)]), add);
						dat = rt.modify(live(dat), fmt("<td><input type='hidden' value='＀ ＀ ＀ ＀'></input><A href='?src=＃;choice=Browse Record;d_rec=＃'>＀</a></td>", [rt.index(rt.fv(f, "fields", live(R)), "name"), rt.index(rt.fv(f, "fields", live(R)), "id"), rt.index(rt.fv(f, "fields", live(R)), "rank"), rt.index(rt.fv(f, "fields", live(R)), "fingerprint"), live(f.src), live(R), rt.index(rt.fv(f, "fields", live(R)), "name")]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.index(rt.fv(f, "fields", live(R)), "id")]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.index(rt.fv(f, "fields", live(R)), "rank")]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.index(rt.fv(f, "fields", live(R)), "fingerprint")]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td></tr>", [live(crimstat)]), add);
					}
					rt.endFor(f, 0);
					dat = rt.modify(live(dat), "\n\t\t\t\t\t\t</table></span>\n\t\t\t\t\t\t<script type='text/javascript'>\n\t\t\t\t\t\t\tvar maintable = document.getElementById(\"maintable_data_archive\");\n\t\t\t\t\t\t\tvar complete_list = maintable.innerHTML;\n\t\t\t\t\t\t</script>\n\t\t\t\t\t\t<hr width='75%' />", add);
				}
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;choice=Record Maintenance'>Record Maintenance</A><br><br>", [live(f.src)]), add);
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;choice=Log Out'>{Log Out}</A>", [live(f.src)]), add);
			} else if ($0 === 2) {
				dat = rt.modify(live(dat), "<B>Records Maintenance</B><HR>", add);
				dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;choice=Delete All Records'>Delete All Records</A><BR><BR><A href='?src=＃;choice=Return'>Back</A>", [live(f.src), live(f.src)]), add);
			} else if ($0 === 3) {
				dat = rt.modify(live(dat), "<font size='4'><b>Security Record</b></font><br>", add);
				if ((truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0)) && truthy((yield* g.callName(f, rt.fv(f, "general", rt.gl("data_core")), "Find", [rt.sv(f, "active1")]))))) {
					if (truthy((rt.istype(rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_front"), T("/obj/item/weapon/photo")) ? 1 : 0))) {
						P1 = rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_front");
						rt.op(f, "BrowseResource", [], [live(f.args[0]), rt.fv(f, "img", live(P1)), "photo_front"], false);
					}
					if (truthy((rt.istype(rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_side"), T("/obj/item/weapon/photo")) ? 1 : 0))) {
						P2 = rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_side");
						rt.op(f, "BrowseResource", [], [live(f.args[0]), rt.fv(f, "img", live(P2)), "photo_side"], false);
					}
					dat = rt.modify(live(dat), fmt("<table><tr><td><table>\n\t\t\t\t\t\t<tr><td>Name:</td><td><A href='?src=＃;choice=Edit Field;field=name'>&nbsp;＀&nbsp;</A></td></tr>\n\t\t\t\t\t\t<tr><td>ID:</td><td><A href='?src=＃;choice=Edit Field;field=id'>&nbsp;＀&nbsp;</A></td></tr>\n\t\t\t\t\t\t<tr><td>Sex:</td><td><A href='?src=＃;choice=Edit Field;field=sex'>&nbsp;＀&nbsp;</A></td></tr>\n\t\t\t\t\t\t<tr><td>Age:</td><td><A href='?src=＃;choice=Edit Field;field=age'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "id"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "sex"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "age")]), add);
					if (truthy(rt.fv(f, "mutant_races", rt.gl("config")))) {
						dat = rt.modify(live(dat), fmt("<tr><td>Species:</td><td><A href ='?src=＃;choice=Edit Field;field=species'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "species")]), add);
					}
					dat = rt.modify(live(dat), fmt("<tr><td>Rank:</td><td><A href='?src=＃;choice=Edit Field;field=rank'>&nbsp;＀&nbsp;</A></td></tr>\n\t\t\t\t\t\t<tr><td>Fingerprint:</td><td><A href='?src=＃;choice=Edit Field;field=fingerprint'>&nbsp;＀&nbsp;</A></td></tr>\n\t\t\t\t\t\t<tr><td>Physical Status:</td><td>&nbsp;＀&nbsp;</td></tr>\n\t\t\t\t\t\t<tr><td>Mental Status:</td><td>&nbsp;＀&nbsp;</td></tr>\n\t\t\t\t\t\t</table></td>\n\t\t\t\t\t\t<td><table><td align = center><a href='?src=＃;choice=Edit Field;field=show_photo_front'><img src=photo_front height=80 width=80 border=4></a><br>\n\t\t\t\t\t\t<a href='?src=＃;choice=Edit Field;field=upd_photo_front'>Update front photo</a></td>\n\t\t\t\t\t\t<td align = center><a href='?src=＃;choice=Edit Field;field=show_photo_side'><img src=photo_side height=80 width=80 border=4></a><br>\n\t\t\t\t\t\t<a href='?src=＃;choice=Edit Field;field=upd_photo_side'>Update side photo</a></td></table>\n\t\t\t\t\t\t</td></tr></table></td></tr></table>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "rank"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "fingerprint"), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "p_stat"), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "m_stat"), live(f.src), live(f.src), live(f.src), live(f.src)]), add);
				} else {
					dat = rt.modify(live(dat), "<br>General Record Lost!<br>", add);
				}
				if ((truthy((rt.istype(rt.sv(f, "active2"), T("/datum/data/record")) ? 1 : 0)) && truthy((yield* g.callName(f, rt.fv(f, "security", rt.gl("data_core")), "Find", [rt.sv(f, "active2")]))))) {
					dat = rt.modify(live(dat), "<font size='4'><b>Security Data</b></font>", add);
					dat = rt.modify(live(dat), fmt("<br>Criminal Status: <A href='?src=＃;choice=Edit Field;field=criminal'>＀</A>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "criminal")]), add);
					dat = rt.modify(live(dat), fmt("<br><br>Minor Crimes: <A href='?src=＃;choice=Edit Field;field=mi_crim_add'>Add New</A>", [live(f.src)]), add);
					dat = rt.modify(live(dat), "<table style=\"text-align:center;\" border=\"1\" cellspacing=\"0\" width=\"100%\">\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th>Crime</th>\n\t\t\t\t\t\t<th>Details</th>\n\t\t\t\t\t\t<th>Author</th>\n\t\t\t\t\t\t<th>Time Added</th>\n\t\t\t\t\t\t<th>Del</th>\n\t\t\t\t\t\t</tr>", add);
					c = null;
					rt.forList(f, 0, rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "mi_crim"), T("/datum/data/crime"));
					while (($e = rt.next(f, 0)) !== undefined) {
						c = $e;
						dat = rt.modify(live(dat), fmt("<tr><td>＀</td>", [rt.fv(f, "crimeName", live(c))]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.fv(f, "crimeDetails", live(c))]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.fv(f, "author", live(c))]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.fv(f, "time", live(c))]), add);
						dat = rt.modify(live(dat), fmt("<td><A href='?src=＃;choice=Edit Field;field=mi_crim_delete;cdataid=＀'>[X]</A></td>", [live(f.src), rt.fv(f, "dataId", live(c))]), add);
						dat = rt.modify(live(dat), "</tr>", add);
					}
					rt.endFor(f, 0);
					dat = rt.modify(live(dat), "</table>", add);
					dat = rt.modify(live(dat), fmt("<br>Major Crimes: <A href='?src=＃;choice=Edit Field;field=ma_crim_add'>Add New</A>", [live(f.src)]), add);
					dat = rt.modify(live(dat), "<table style=\"text-align:center;\" border=\"1\" cellspacing=\"0\" width=\"100%\">\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th>Crime</th>\n\t\t\t\t\t\t<th>Details</th>\n\t\t\t\t\t\t<th>Author</th>\n\t\t\t\t\t\t<th>Time Added</th>\n\t\t\t\t\t\t<th>Del</th>\n\t\t\t\t\t\t</tr>", add);
					c = null;
					rt.forList(f, 0, rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "ma_crim"), T("/datum/data/crime"));
					while (($e = rt.next(f, 0)) !== undefined) {
						c = $e;
						dat = rt.modify(live(dat), fmt("<tr><td>＀</td>", [rt.fv(f, "crimeName", live(c))]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.fv(f, "crimeDetails", live(c))]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.fv(f, "author", live(c))]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.fv(f, "time", live(c))]), add);
						dat = rt.modify(live(dat), fmt("<td><A href='?src=＃;choice=Edit Field;field=ma_crim_delete;cdataid=＀'>[X]</A></td>", [live(f.src), rt.fv(f, "dataId", live(c))]), add);
						dat = rt.modify(live(dat), "</tr>", add);
					}
					rt.endFor(f, 0);
					dat = rt.modify(live(dat), "</table>", add);
					dat = rt.modify(live(dat), fmt("<br>\nImportant Notes:<br>\n\t<A href='?src=＃;choice=Edit Field;field=notes'>&nbsp;＀&nbsp;</A>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "notes")]), add);
					dat = rt.modify(live(dat), "<br><br><font size='4'><b>Comments/Log</b></font><br>", add);
					counter = 1;
					while (truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), fmt("com_＀", [live(counter)])))) {
						dat = rt.modify(live(dat), add(rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), fmt("com_＀", [live(counter)])), "<BR>"), add);
						if (!isEqual(rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), fmt("com_＀", [live(counter)])), "<B>Deleted</B>")) {
							dat = rt.modify(live(dat), fmt("<A href='?src=＃;choice=Delete Entry;del_c=＀'>Delete Entry</A><BR><BR>", [live(f.src), live(counter)]), add);
						}
						counter = rt.inc(live(counter), 1);
					}
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;choice=Add Entry'>Add Entry</A><br><br>", [live(f.src)]), add);
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;choice=Delete Record (Security)'>Delete Record (Security Only)</A><br>", [live(f.src)]), add);
				} else {
					dat = rt.modify(live(dat), "Security Record Lost!<br>", add);
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;choice=New Record (Security)'>New Security Record</A><br><br>", [live(f.src)]), add);
				}
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;choice=Delete Record (ALL)'>Delete Record (ALL)</A><br><A href='?src=＃;choice=Print Record'>Print Record</A><BR><A href='?src=＃;choice=Print Poster'>Print Wanted Poster</A><BR><A href='?src=＃;choice=Return'>Back</A><BR>", [live(f.src), live(f.src), live(f.src), live(f.src)]), add);
			}
		} else {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;choice=Log In'>{Log In}</A>", [live(f.src)]), add);
		}
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "secure_rec", "Security Records Console", 600, 400]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/computer/secure_data/proc/Topic  (code/game/machinery/computer/security.dm:270)  may sleep
rt.def("/obj/machinery/computer/secure_data/proc/Topic", function* Topic(f: Frame) {
	let old_field: Value = null, H: Value = null, R: Value = null, I: Value = null, borg: Value = null, S: Value = null, E: Value = null, _P: Value = null, c: Value = null, counter: Value = null, wanted_name: Value = null, default_description: Value = null, major_crimes: Value = null, minor_crimes: Value = null, c_4: Value = null, info: Value = null, photo: Value = null, a2: Value = null, t1: Value = null, counter_2: Value = null, G: Value = null, R_1: Value = null, M: Value = null, a1: Value = null, a2_1: Value = null, t1_2: Value = null, _P_2: Value = null, photo_2: Value = null, t2: Value = null, crime: Value = null, L: Value = null, rank: Value = null;
	let $0: any, $e: any;
	f.vars = () => [old_field, H, R, I, borg, S, E, _P, c, counter, wanted_name, default_description, major_crimes, minor_crimes, c_4, info, photo, a2, t1, counter_2, G, R_1, M, a1, a2_1, t1_2, _P_2, photo_2, t2, crime, L, rank, $0, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, rt.fv(f, "general", rt.gl("data_core")), "Find", [rt.sv(f, "active1")])))) {
		rt.setSv(f, "active1", null);
	}
	if (!truthy((yield* g.callName(f, rt.fv(f, "security", rt.gl("data_core")), "Find", [rt.sv(f, "active2")])))) {
		rt.setSv(f, "active2", null);
	}
	if ((((truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)]))) || (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)]))))) {
		yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
		$0 = rt.at(live(f.args[1]), "choice");
		if ($0 === "Sorting") {
			if (isEqual(rt.sv(f, "sortBy"), rt.at(live(f.args[1]), "sort"))) {
				if (isEqual(rt.sv(f, "order"), 1)) {
					rt.setSv(f, "order", -1);
				} else {
					rt.setSv(f, "order", 1);
				}
			} else {
				rt.setSv(f, "sortBy", rt.at(live(f.args[1]), "sort"));
				rt.setSv(f, "order", rt.initial(f, live(f.src), "order"));
			}
		} else if ($0 === "Clear Screen") {
			rt.setSv(f, "temp", null);
		} else if ($0 === "Return") {
			rt.setSv(f, "screen", 1);
			rt.setSv(f, "active1", null);
			rt.setSv(f, "active2", null);
		} else if ($0 === "Confirm Identity") {
			if (truthy(rt.sv(f, "scan"))) {
				if ((truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy((yield* g.callName(f, live(f.usr), "get_active_held_item", []))))) {
					yield* g.callName(f, live(f.usr), "put_in_hands", [rt.sv(f, "scan")]);
				} else {
					rt.setFv(f, "loc", rt.sv(f, "scan"), rt.getStep(f, live(f.src), 0));
				}
				rt.setSv(f, "scan", null);
			} else {
				if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
					if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
						return live(f.dot);
					}
					rt.setFv(f, "loc", live(I), live(f.src));
					rt.setSv(f, "scan", live(I));
				}
			}
		} else if ($0 === "Log Out") {
			rt.setSv(f, "authenticated", null);
			rt.setSv(f, "screen", null);
			rt.setSv(f, "active1", null);
			rt.setSv(f, "active2", null);
		} else if ($0 === "Log In") {
			if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) {
				borg = live(f.usr);
				rt.setSv(f, "active1", null);
				rt.setSv(f, "active2", null);
				rt.setSv(f, "authenticated", rt.fv(f, "name", live(borg)));
				rt.setSv(f, "rank", "AI");
				rt.setSv(f, "screen", 1);
			} else {
				if (truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)])))) {
					rt.setSv(f, "active1", null);
					rt.setSv(f, "active2", null);
					rt.setSv(f, "authenticated", rt.gv(f, "admin_signature", rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))));
					rt.setSv(f, "rank", "Central Command");
					rt.setSv(f, "screen", 1);
				} else {
					if (truthy((rt.istype(rt.sv(f, "scan"), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
						rt.setSv(f, "active1", null);
						rt.setSv(f, "active2", null);
						if (truthy((yield* g.srcCall(f, "check_access", rt.sv(f, "scan"))))) {
							rt.setSv(f, "authenticated", rt.fv(f, "registered_name", rt.sv(f, "scan")));
							rt.setSv(f, "rank", rt.fv(f, "assignment", rt.sv(f, "scan")));
							rt.setSv(f, "screen", 1);
						}
					}
				}
			}
		} else if ($0 === "Record Maintenance") {
			rt.setSv(f, "screen", 2);
			rt.setSv(f, "active1", null);
			rt.setSv(f, "active2", null);
		} else if ($0 === "Browse Record") {
			R = rt.locateIn(f, rt.at(live(f.args[1]), "d_rec"), rt.world());
			S = rt.locateIn(f, rt.at(live(f.args[1]), "d_rec"), rt.world());
			if (!truthy((yield* g.callName(f, rt.fv(f, "general", rt.gl("data_core")), "Find", [live(R)])))) {
				rt.setSv(f, "temp", "Record Not Found!");
			} else {
				E = null;
				rt.forList(f, 0, rt.fv(f, "security", rt.gl("data_core")), T("/datum/data/record"));
				while (($e = rt.next(f, 0)) !== undefined) {
					E = $e;
					if ((isEqual(rt.index(rt.fv(f, "fields", live(E)), "name"), rt.index(rt.fv(f, "fields", live(R)), "name")) || isEqual(rt.index(rt.fv(f, "fields", live(E)), "id"), rt.index(rt.fv(f, "fields", live(R)), "id")))) {
						S = live(E);
					}
				}
				rt.endFor(f, 0);
				rt.setSv(f, "active1", live(R));
				rt.setSv(f, "active2", live(S));
				rt.setSv(f, "screen", 3);
			}
		} else if ($0 === "Print Record") {
			if (!truthy(rt.sv(f, "printing"))) {
				rt.setSv(f, "printing", 1);
				rt.incField(f, rt.gl("data_core"), "securityPrintCount", 1, true);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/poster_being_created.ogg"), 100, 1]);
				yield* g.call(f, P("/proc/sleep"), null, [30]);
				rt.setFv(f, "info", (_P = (yield* g.new_(f, T("/obj/item/weapon/paper"), [rt.sv(f, "loc")]))), fmt("<CENTER><B>Security Record - (SR-＀)</B></CENTER><BR>", [rt.fv(f, "securityPrintCount", rt.gl("data_core"))]));
				if ((truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0)) && truthy((yield* g.callName(f, rt.fv(f, "general", rt.gl("data_core")), "Find", [rt.sv(f, "active1")]))))) {
					rt.modField(f, live(_P), "info", fmt("Name: ＀ ID: ＀<BR>\nSex: ＀<BR>\nAge: ＀<BR>", [rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name"), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "id"), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "sex"), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "age")]), add);
					if (truthy(rt.fv(f, "mutant_races", rt.gl("config")))) {
						rt.modField(f, live(_P), "info", fmt("\nSpecies: ＀<BR>", [rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "species")]), add);
					}
					rt.modField(f, live(_P), "info", fmt("\nFingerprint: ＀<BR>\nPhysical Status: ＀<BR>\nMental Status: ＀<BR>", [rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "fingerprint"), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "p_stat"), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "m_stat")]), add);
				} else {
					rt.modField(f, live(_P), "info", "<B>General Record Lost!</B><BR>", add);
				}
				if ((truthy((rt.istype(rt.sv(f, "active2"), T("/datum/data/record")) ? 1 : 0)) && truthy((yield* g.callName(f, rt.fv(f, "security", rt.gl("data_core")), "Find", [rt.sv(f, "active2")]))))) {
					rt.modField(f, live(_P), "info", fmt("<BR>\n<CENTER><B>Security Data</B></CENTER><BR>\nCriminal Status: ＀", [rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "criminal")]), add);
					rt.modField(f, live(_P), "info", "<BR>\n<BR>\nMinor Crimes:<BR>\n", add);
					rt.modField(f, live(_P), "info", "<table style=\"text-align:center;\" border=\"1\" cellspacing=\"0\" width=\"100%\">\n<tr>\n<th>Crime</th>\n<th>Details</th>\n<th>Author</th>\n<th>Time Added</th>\n</tr>", add);
					c = null;
					rt.forList(f, 0, rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "mi_crim"), T("/datum/data/crime"));
					while (($e = rt.next(f, 0)) !== undefined) {
						c = $e;
						rt.modField(f, live(_P), "info", fmt("<tr><td>＀</td>", [rt.fv(f, "crimeName", live(c))]), add);
						rt.modField(f, live(_P), "info", fmt("<td>＀</td>", [rt.fv(f, "crimeDetails", live(c))]), add);
						rt.modField(f, live(_P), "info", fmt("<td>＀</td>", [rt.fv(f, "author", live(c))]), add);
						rt.modField(f, live(_P), "info", fmt("<td>＀</td>", [rt.fv(f, "time", live(c))]), add);
						rt.modField(f, live(_P), "info", "</tr>", add);
					}
					rt.endFor(f, 0);
					rt.modField(f, live(_P), "info", "</table>", add);
					rt.modField(f, live(_P), "info", "<BR>\nMajor Crimes: <BR>\n", add);
					rt.modField(f, live(_P), "info", "<table style=\"text-align:center;\" border=\"1\" cellspacing=\"0\" width=\"100%\">\n<tr>\n<th>Crime</th>\n<th>Details</th>\n<th>Author</th>\n<th>Time Added</th>\n</tr>", add);
					c = null;
					rt.forList(f, 0, rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "ma_crim"), T("/datum/data/crime"));
					while (($e = rt.next(f, 0)) !== undefined) {
						c = $e;
						rt.modField(f, live(_P), "info", fmt("<tr><td>＀</td>", [rt.fv(f, "crimeName", live(c))]), add);
						rt.modField(f, live(_P), "info", fmt("<td>＀</td>", [rt.fv(f, "crimeDetails", live(c))]), add);
						rt.modField(f, live(_P), "info", fmt("<td>＀</td>", [rt.fv(f, "author", live(c))]), add);
						rt.modField(f, live(_P), "info", fmt("<td>＀</td>", [rt.fv(f, "time", live(c))]), add);
						rt.modField(f, live(_P), "info", "</tr>", add);
					}
					rt.endFor(f, 0);
					rt.modField(f, live(_P), "info", "</table>", add);
					rt.modField(f, live(_P), "info", fmt("<BR>\nImportant Notes:<BR>\n\t＀<BR>\n<BR>\n<CENTER><B>Comments/Log</B></CENTER><BR>", [rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "notes")]), add);
					counter = 1;
					while (truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), fmt("com_＀", [live(counter)])))) {
						rt.modField(f, live(_P), "info", fmt("＀<BR>", [rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), fmt("com_＀", [live(counter)]))]), add);
						counter = rt.inc(live(counter), 1);
					}
					rt.setFv(f, "name", live(_P), fmt("SR-＀ '＀'", [rt.fv(f, "securityPrintCount", rt.gl("data_core")), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name")]));
				} else {
					rt.modField(f, live(_P), "info", "<B>Security Record Lost!</B><BR>", add);
					rt.setFv(f, "name", live(_P), fmt("SR-＀ '＀'", [rt.fv(f, "securityPrintCount", rt.gl("data_core")), "Record Lost"]));
				}
				rt.modField(f, live(_P), "info", "</TT>", add);
				rt.setSv(f, "printing", null);
			}
		} else if ($0 === "Print Poster") {
			if (!truthy(rt.sv(f, "printing"))) {
				if (truthy((wanted_name = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please enter an alias for the criminal:", "Print Wanted Poster", rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name")]))))) {
					default_description = fmt("A poster declaring ＀ to be a dangerous individual, wanted by Nanotrasen. Report any sightings to security immediately.", [live(wanted_name)]);
					major_crimes = rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "ma_crim");
					minor_crimes = rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "mi_crim");
					if (truthy(add(rt.len(f, live(major_crimes)), rt.len(f, live(minor_crimes))))) {
						default_description = rt.modify(live(default_description), fmt("\n＀ is wanted for the following crimes:\n", [live(wanted_name)]), add);
					}
					if (truthy(rt.len(f, live(minor_crimes)))) {
						default_description = rt.modify(live(default_description), "\nMinor Crimes:", add);
						c_4 = null;
						rt.forList(f, 0, rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "mi_crim"), T("/datum/data/crime"));
						while (($e = rt.next(f, 0)) !== undefined) {
							c_4 = $e;
							default_description = rt.modify(live(default_description), fmt("\n＀\n", [rt.fv(f, "crimeName", live(c_4))]), add);
							default_description = rt.modify(live(default_description), fmt("＀\n", [rt.fv(f, "crimeDetails", live(c_4))]), add);
						}
						rt.endFor(f, 0);
					}
					if (truthy(rt.len(f, live(major_crimes)))) {
						default_description = rt.modify(live(default_description), "\nMajor Crimes:", add);
						c_4 = null;
						rt.forList(f, 0, rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "ma_crim"), T("/datum/data/crime"));
						while (($e = rt.next(f, 0)) !== undefined) {
							c_4 = $e;
							default_description = rt.modify(live(default_description), fmt("\n＀\n", [rt.fv(f, "crimeName", live(c_4))]), add);
							default_description = rt.modify(live(default_description), fmt("＀\n", [rt.fv(f, "crimeDetails", live(c_4))]), add);
						}
						rt.endFor(f, 0);
					}
					if (truthy((info = (yield* g.call(f, P("/proc/stripped_multiline_input"), null, [live(f.usr), "Please input a description for the poster:", "Print Wanted Poster", live(default_description), null]))))) {
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/poster_being_created.ogg"), 100, 1]);
						rt.setSv(f, "printing", 1);
						yield* g.call(f, P("/proc/sleep"), null, [30]);
						if ((truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0)) && truthy((yield* g.callName(f, rt.fv(f, "general", rt.gl("data_core")), "Find", [rt.sv(f, "active1")]))))) {
							photo = rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_front");
							yield* g.new_(f, T("/obj/item/weapon/poster/wanted"), [rt.fv(f, "loc", live(f.src)), rt.fv(f, "img", live(photo)), live(wanted_name), live(info)]);
						}
						rt.setSv(f, "printing", 0);
					}
				}
			}
		} else if ($0 === "Delete All Records") {
			rt.setSv(f, "temp", "");
			rt.modSrcVar(f, "temp", "Are you sure you wish to delete all Security records?<br>", add);
			rt.modSrcVar(f, "temp", fmt("<a href='?src=＃;choice=Purge All Records'>Yes</a><br>", [live(f.src)]), add);
			rt.modSrcVar(f, "temp", fmt("<a href='?src=＃;choice=Clear Screen'>No</a>", [live(f.src)]), add);
		} else if ($0 === "Purge All Records") {
			yield* g.srcCall(f, "investigate_log", fmt("＀ (＀) has purged all the security records.", [rt.fv(f, "name", live(f.usr)), rt.fv(f, "key", live(f.usr))]), "records");
			R = null;
			rt.forList(f, 0, rt.fv(f, "security", rt.gl("data_core")), T("/datum/data/record"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
			}
			rt.endFor(f, 0);
			yield* g.callName(f, rt.fv(f, "security", rt.gl("data_core")), "Cut", []);
			rt.setSv(f, "temp", "All Security records deleted.");
		} else if ($0 === "Add Entry") {
			if (!truthy((rt.istype(rt.sv(f, "active2"), T("/datum/data/record")) ? 1 : 0))) {
				return live(f.dot);
			}
			a2 = rt.sv(f, "active2");
			t1 = (yield* g.call(f, P("/proc/stripped_multiline_input"), null, ["Add Comment:", "Secure. records", null, null]));
			if (!truthy((yield* g.srcCall(f, "canUseSecurityRecordsConsole", live(f.usr), live(t1), null, live(a2))))) {
				return live(f.dot);
			}
			counter_2 = 1;
			while (truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), fmt("com_＀", [live(counter_2)])))) {
				counter_2 = rt.inc(live(counter_2), 1);
			}
			rt.setAt(rt.fv(f, "fields", rt.sv(f, "active2")), fmt("com_＀", [live(counter_2)]), fmt("Made by ＀ (＀) on ＀ ＀, ＀<BR>＀", [rt.fv(f, "authenticated", live(f.src)), rt.fv(f, "rank", live(f.src)), (yield* g.call(f, P("/proc/worldtime2text"), null, [])), (yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "realtime", rt.world()), "MMM DD"])), add(rt.gl("year_integer"), 540), live(t1)]));
		} else if ($0 === "Delete Record (ALL)") {
			if (truthy(rt.sv(f, "active1"))) {
				rt.setSv(f, "temp", "<h5>Are you sure you wish to delete the record (ALL)?</h5>");
				rt.modSrcVar(f, "temp", fmt("<a href='?src=＃;choice=Delete Record (ALL) Execute'>Yes</a><br>", [live(f.src)]), add);
				rt.modSrcVar(f, "temp", fmt("<a href='?src=＃;choice=Clear Screen'>No</a>", [live(f.src)]), add);
			}
		} else if ($0 === "Delete Record (Security)") {
			if (truthy(rt.sv(f, "active2"))) {
				rt.setSv(f, "temp", "<h5>Are you sure you wish to delete the record (Security Portion Only)?</h5>");
				rt.modSrcVar(f, "temp", fmt("<a href='?src=＃;choice=Delete Record (Security) Execute'>Yes</a><br>", [live(f.src)]), add);
				rt.modSrcVar(f, "temp", fmt("<a href='?src=＃;choice=Clear Screen'>No</a>", [live(f.src)]), add);
			}
		} else if ($0 === "Delete Entry") {
			if ((truthy((rt.istype(rt.sv(f, "active2"), T("/datum/data/record")) ? 1 : 0)) && truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), fmt("com_＀", [rt.at(live(f.args[1]), "del_c")]))))) {
				rt.setAt(rt.fv(f, "fields", rt.sv(f, "active2")), fmt("com_＀", [rt.at(live(f.args[1]), "del_c")]), "<B>Deleted</B>");
			}
		} else if ($0 === "New Record (Security)") {
			if ((truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0)) && !truthy((rt.istype(rt.sv(f, "active2"), T("/datum/data/record")) ? 1 : 0)))) {
				rt.setAt(rt.gv(f, "fields", (R = (yield* g.new_(f, T("/datum/data/record"), [])))), "name", rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name"));
				rt.setAt(rt.fv(f, "fields", live(R)), "id", rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "id"));
				rt.setFv(f, "name", live(R), fmt("Security Record #＀", [rt.index(rt.fv(f, "fields", live(R)), "id")]));
				rt.setAt(rt.fv(f, "fields", live(R)), "criminal", "None");
				rt.setAt(rt.fv(f, "fields", live(R)), "mi_crim", rt.list());
				rt.setAt(rt.fv(f, "fields", live(R)), "ma_crim", rt.list());
				rt.setAt(rt.fv(f, "fields", live(R)), "notes", "No notes.");
				rt.modField(f, rt.gl("data_core"), "security", live(R), add);
				rt.setSv(f, "active2", live(R));
				rt.setSv(f, "screen", 3);
			}
		} else if ($0 === "New Record (General)") {
			rt.setAt(rt.gv(f, "fields", (G = (yield* g.new_(f, T("/datum/data/record"), [])))), "name", "New Record");
			rt.setAt(rt.fv(f, "fields", live(G)), "id", fmt("＀", [(yield* g.call(f, P("/proc/num2hex"), null, [(yield* g.call(f, P("/proc/rand"), null, [1, 16777215])), 6]))]));
			rt.setAt(rt.fv(f, "fields", live(G)), "rank", "Unassigned");
			rt.setAt(rt.fv(f, "fields", live(G)), "sex", "Male");
			rt.setAt(rt.fv(f, "fields", live(G)), "age", "Unknown");
			if (truthy(rt.fv(f, "mutant_races", rt.gl("config")))) {
				rt.setAt(rt.fv(f, "fields", live(G)), "species", "Human");
			}
			rt.setAt(rt.fv(f, "fields", live(G)), "photo_front", (yield* g.new_(f, T("/icon"), [])));
			rt.setAt(rt.fv(f, "fields", live(G)), "photo_side", (yield* g.new_(f, T("/icon"), [])));
			rt.setAt(rt.fv(f, "fields", live(G)), "fingerprint", "?????");
			rt.setAt(rt.fv(f, "fields", live(G)), "p_stat", "Active");
			rt.setAt(rt.fv(f, "fields", live(G)), "m_stat", "Stable");
			rt.modField(f, rt.gl("data_core"), "general", live(G), add);
			rt.setSv(f, "active1", live(G));
			rt.setAt(rt.gv(f, "fields", (R_1 = (yield* g.new_(f, T("/datum/data/record"), [])))), "name", rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name"));
			rt.setAt(rt.fv(f, "fields", live(R_1)), "id", rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "id"));
			rt.setFv(f, "name", live(R_1), fmt("Security Record #＀", [rt.index(rt.fv(f, "fields", live(R_1)), "id")]));
			rt.setAt(rt.fv(f, "fields", live(R_1)), "criminal", "None");
			rt.setAt(rt.fv(f, "fields", live(R_1)), "mi_crim", rt.list());
			rt.setAt(rt.fv(f, "fields", live(R_1)), "ma_crim", rt.list());
			rt.setAt(rt.fv(f, "fields", live(R_1)), "notes", "No notes.");
			rt.modField(f, rt.gl("data_core"), "security", live(R_1), add);
			rt.setSv(f, "active2", live(R_1));
			rt.setAt(rt.gv(f, "fields", (M = (yield* g.new_(f, T("/datum/data/record"), [])))), "id", rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "id"));
			rt.setAt(rt.fv(f, "fields", live(M)), "name", rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name"));
			rt.setAt(rt.fv(f, "fields", live(M)), "blood_type", "?");
			rt.setAt(rt.fv(f, "fields", live(M)), "b_dna", "?????");
			rt.setAt(rt.fv(f, "fields", live(M)), "mi_dis", "None");
			rt.setAt(rt.fv(f, "fields", live(M)), "mi_dis_d", "No minor disabilities have been declared.");
			rt.setAt(rt.fv(f, "fields", live(M)), "ma_dis", "None");
			rt.setAt(rt.fv(f, "fields", live(M)), "ma_dis_d", "No major disabilities have been diagnosed.");
			rt.setAt(rt.fv(f, "fields", live(M)), "alg", "None");
			rt.setAt(rt.fv(f, "fields", live(M)), "alg_d", "No allergies have been detected in this patient.");
			rt.setAt(rt.fv(f, "fields", live(M)), "cdi", "None");
			rt.setAt(rt.fv(f, "fields", live(M)), "cdi_d", "No diseases have been diagnosed at the moment.");
			rt.setAt(rt.fv(f, "fields", live(M)), "notes", "No notes.");
			rt.modField(f, rt.gl("data_core"), "medical", live(M), add);
		} else if ($0 === "Edit Field") {
			a1 = rt.sv(f, "active1");
			a2_1 = rt.sv(f, "active2");
			$0 = rt.at(live(f.args[1]), "field");
			if ($0 === "name") {
				if ((truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0)) || truthy((rt.istype(rt.sv(f, "active2"), T("/datum/data/record")) ? 1 : 0)))) {
					t1_2 = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [2], [null, rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name"), "Secure. records", "Please input name:", null]))])), 1, 1024]));
					if (!truthy((yield* g.srcCall(f, "canUseSecurityRecordsConsole", live(f.usr), live(t1_2), live(a1))))) {
						return live(f.dot);
					}
					if (truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0))) {
						rt.setAt(rt.fv(f, "fields", rt.sv(f, "active1")), "name", live(t1_2));
					}
					if (truthy((rt.istype(rt.sv(f, "active2"), T("/datum/data/record")) ? 1 : 0))) {
						rt.setAt(rt.fv(f, "fields", rt.sv(f, "active2")), "name", live(t1_2));
					}
				}
			} else if ($0 === "id") {
				if ((truthy((rt.istype(rt.sv(f, "active2"), T("/datum/data/record")) ? 1 : 0)) || truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0)))) {
					t1_2 = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please input id:", "Secure. records", rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "id"), null]));
					if (!truthy((yield* g.srcCall(f, "canUseSecurityRecordsConsole", live(f.usr), live(t1_2), live(a1))))) {
						return live(f.dot);
					}
					if (truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0))) {
						rt.setAt(rt.fv(f, "fields", rt.sv(f, "active1")), "id", live(t1_2));
					}
					if (truthy((rt.istype(rt.sv(f, "active2"), T("/datum/data/record")) ? 1 : 0))) {
						rt.setAt(rt.fv(f, "fields", rt.sv(f, "active2")), "id", live(t1_2));
					}
				}
			} else if ($0 === "fingerprint") {
				if (truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0))) {
					t1_2 = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please input fingerprint hash:", "Secure. records", rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "fingerprint"), null]));
					if (!truthy((yield* g.srcCall(f, "canUseSecurityRecordsConsole", live(f.usr), live(t1_2), live(a1))))) {
						return live(f.dot);
					}
					rt.setAt(rt.fv(f, "fields", rt.sv(f, "active1")), "fingerprint", live(t1_2));
				}
			} else if ($0 === "sex") {
				if (truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0))) {
					if (isEqual(rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "sex"), "Male")) {
						rt.setAt(rt.fv(f, "fields", rt.sv(f, "active1")), "sex", "Female");
					} else {
						rt.setAt(rt.fv(f, "fields", rt.sv(f, "active1")), "sex", "Male");
					}
				}
			} else if ($0 === "age") {
				if (truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0))) {
					t1_2 = (yield* g.op(f, "Prompt", [32], [null, rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "age"), "Secure. records", "Please input age:", null]));
					if (!truthy((yield* g.srcCall(f, "canUseSecurityRecordsConsole", live(f.usr), "age", live(a1))))) {
						return live(f.dot);
					}
					rt.setAt(rt.fv(f, "fields", rt.sv(f, "active1")), "age", live(t1_2));
				}
			} else if ($0 === "species") {
				if (truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0))) {
					t1_2 = (yield* g.op(f, "Prompt", [1], [null, null, "Species Selection", "Select a species", rt.gl("roundstart_species")]));
					if (!truthy((yield* g.srcCall(f, "canUseSecurityRecordsConsole", live(f.usr), live(t1_2), live(a1))))) {
						return live(f.dot);
					}
					rt.setAt(rt.fv(f, "fields", rt.sv(f, "active1")), "species", live(t1_2));
				}
			} else if ($0 === "show_photo_front") {
				if (truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_front"))) {
					if (truthy((rt.istype(rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_front"), T("/obj/item/weapon/photo")) ? 1 : 0))) {
						yield* g.callName(f, (_P_2 = rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_front")), "show", [live(f.usr)]);
					}
				}
			} else if ($0 === "upd_photo_front") {
				if (truthy((photo_2 = (yield* g.srcCall(f, "get_photo", live(f.usr)))))) {
					yield* g.call(f, P("/proc/qdel"), null, [rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_front")]);
					rt.setAt(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_front", live(photo_2));
				}
			} else if ($0 === "show_photo_side") {
				if (truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_side"))) {
					if (truthy((rt.istype(rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_side"), T("/obj/item/weapon/photo")) ? 1 : 0))) {
						yield* g.callName(f, (_P_2 = rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_side")), "show", [live(f.usr)]);
					}
				}
			} else if ($0 === "upd_photo_side") {
				if (truthy((photo_2 = (yield* g.srcCall(f, "get_photo", live(f.usr)))))) {
					yield* g.call(f, P("/proc/qdel"), null, [rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_side")]);
					rt.setAt(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_side", live(photo_2));
				}
			} else if ($0 === "mi_crim_add") {
				if (truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0))) {
					t1_2 = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please input minor crime names:", "Secure. records", "", null]));
					t2 = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please input minor crime details:", "Secure. records", "", null]));
					if (!truthy((yield* g.srcCall(f, "canUseSecurityRecordsConsole", live(f.usr), live(t1_2), null, live(a2_1))))) {
						return live(f.dot);
					}
					crime = (yield* g.callName(f, rt.gl("data_core"), "createCrimeEntry", [live(t1_2), live(t2), rt.sv(f, "authenticated"), (yield* g.call(f, P("/proc/worldtime2text"), null, []))]));
					yield* g.callName(f, rt.gl("data_core"), "addMinorCrime", [rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "id"), live(crime)]);
				}
			} else if ($0 === "mi_crim_delete") {
				if (truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0))) {
					if (truthy(rt.at(live(f.args[1]), "cdataid"))) {
						if (!truthy((yield* g.srcCall(f, "canUseSecurityRecordsConsole", live(f.usr), "delete", null, live(a2_1))))) {
							return live(f.dot);
						}
						yield* g.callName(f, rt.gl("data_core"), "removeMinorCrime", [rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "id"), rt.at(live(f.args[1]), "cdataid")]);
					}
				}
			} else if ($0 === "ma_crim_add") {
				if (truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0))) {
					t1_2 = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please input major crime names:", "Secure. records", "", null]));
					t2 = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please input major crime details:", "Secure. records", "", null]));
					if (!truthy((yield* g.srcCall(f, "canUseSecurityRecordsConsole", live(f.usr), live(t1_2), null, live(a2_1))))) {
						return live(f.dot);
					}
					crime = (yield* g.callName(f, rt.gl("data_core"), "createCrimeEntry", [live(t1_2), live(t2), rt.sv(f, "authenticated"), (yield* g.call(f, P("/proc/worldtime2text"), null, []))]));
					yield* g.callName(f, rt.gl("data_core"), "addMajorCrime", [rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "id"), live(crime)]);
				}
			} else if ($0 === "ma_crim_delete") {
				if (truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0))) {
					if (truthy(rt.at(live(f.args[1]), "cdataid"))) {
						if (!truthy((yield* g.srcCall(f, "canUseSecurityRecordsConsole", live(f.usr), "delete", null, live(a2_1))))) {
							return live(f.dot);
						}
						yield* g.callName(f, rt.gl("data_core"), "removeMajorCrime", [rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "id"), rt.at(live(f.args[1]), "cdataid")]);
					}
				}
			} else if ($0 === "notes") {
				if (truthy((rt.istype(rt.sv(f, "active2"), T("/datum/data/record")) ? 1 : 0))) {
					t1_2 = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please summarize notes:", "Secure. records", rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "notes"), null]));
					if (!truthy((yield* g.srcCall(f, "canUseSecurityRecordsConsole", live(f.usr), live(t1_2), null, live(a2_1))))) {
						return live(f.dot);
					}
					rt.setAt(rt.fv(f, "fields", rt.sv(f, "active2")), "notes", live(t1_2));
				}
			} else if ($0 === "criminal") {
				if (truthy((rt.istype(rt.sv(f, "active2"), T("/datum/data/record")) ? 1 : 0))) {
					rt.setSv(f, "temp", "<h5>Criminal Status:</h5>");
					rt.modSrcVar(f, "temp", "<ul>", add);
					rt.modSrcVar(f, "temp", fmt("<li><a href='?src=＃;choice=Change Criminal Status;criminal2=none'>None</a></li>", [live(f.src)]), add);
					rt.modSrcVar(f, "temp", fmt("<li><a href='?src=＃;choice=Change Criminal Status;criminal2=arrest'>*Arrest*</a></li>", [live(f.src)]), add);
					rt.modSrcVar(f, "temp", fmt("<li><a href='?src=＃;choice=Change Criminal Status;criminal2=incarcerated'>Incarcerated</a></li>", [live(f.src)]), add);
					rt.modSrcVar(f, "temp", fmt("<li><a href='?src=＃;choice=Change Criminal Status;criminal2=parolled'>Parolled</a></li>", [live(f.src)]), add);
					rt.modSrcVar(f, "temp", fmt("<li><a href='?src=＃;choice=Change Criminal Status;criminal2=released'>Discharged</a></li>", [live(f.src)]), add);
					rt.modSrcVar(f, "temp", "</ul>", add);
				}
			} else if ($0 === "rank") {
				L = rt.list("Head of Personnel", "Captain", "AI", "Central Command");
				if ((truthy((rt.istype(rt.sv(f, "active1"), T("/datum/data/record")) ? 1 : 0)) && truthy((yield* g.callName(f, live(L), "Find", [rt.sv(f, "rank")]))))) {
					rt.setSv(f, "temp", "<h5>Rank:</h5>");
					rt.modSrcVar(f, "temp", "<ul>", add);
					rank = null;
					rt.forList(f, 0, (yield* g.call(f, P("/proc/get_all_jobs"), null, [])));
					while (($e = rt.next(f, 0)) !== undefined) {
						rank = $e;
						rt.modSrcVar(f, "temp", fmt("<li><a href='?src=＃;choice=Change Rank;rank=＀'>＀</a></li>", [live(f.src), live(rank), live(rank)]), add);
					}
					rt.endFor(f, 0);
					rt.modSrcVar(f, "temp", "</ul>", add);
				} else {
					yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "You do not have the required rank to do this!"]);
				}
			}
		} else {
			rt.setSv(f, "temp", null);
			$0 = rt.at(live(f.args[1]), "choice");
			if ($0 === "Change Rank") {
				if (truthy(rt.sv(f, "active1"))) {
					rt.setAt(rt.fv(f, "fields", rt.sv(f, "active1")), "rank", (yield* g.call(f, P("/proc/strip_html"), null, [rt.at(live(f.args[1]), "rank")]))); // tg 2cd1bb7cb8: the rank is shown raw in the record
					if (truthy((rt.isIn(f, rt.at(live(f.args[1]), "rank"), (yield* g.call(f, P("/proc/get_all_jobs"), null, []))) ? 1 : 0))) {
						rt.setAt(rt.fv(f, "fields", rt.sv(f, "active1")), "real_rank", rt.at(live(f.args[1]), "real_rank"));
					}
				}
			} else if ($0 === "Change Criminal Status") {
				if (truthy(rt.sv(f, "active2"))) {
					old_field = rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "criminal");
					$0 = rt.at(live(f.args[1]), "criminal2");
					if ($0 === "none") {
						rt.setAt(rt.fv(f, "fields", rt.sv(f, "active2")), "criminal", "None");
					} else if ($0 === "arrest") {
						rt.setAt(rt.fv(f, "fields", rt.sv(f, "active2")), "criminal", "*Arrest*");
					} else if ($0 === "incarcerated") {
						rt.setAt(rt.fv(f, "fields", rt.sv(f, "active2")), "criminal", "Incarcerated");
					} else if ($0 === "parolled") {
						rt.setAt(rt.fv(f, "fields", rt.sv(f, "active2")), "criminal", "Parolled");
					} else if ($0 === "released") {
						rt.setAt(rt.fv(f, "fields", rt.sv(f, "active2")), "criminal", "Discharged");
					}
					yield* g.srcCall(f, "investigate_log", fmt("＀ has been set from ＀ to ＀ by ＀ (＀).", [rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name"), live(old_field), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "criminal"), rt.fv(f, "name", live(f.usr)), rt.fv(f, "key", live(f.usr))]), "records");
					H = null;
					rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
					while (($e = rt.next(f, 0)) !== undefined) {
						H = $e;
						yield* g.callName(f, live(H), "sec_hud_set_security_status", []);
					}
					rt.endFor(f, 0);
				}
			} else if ($0 === "Delete Record (Security) Execute") {
				yield* g.srcCall(f, "investigate_log", fmt("＀ (＀) has deleted the security records for ＀.", [rt.fv(f, "name", live(f.usr)), rt.fv(f, "key", live(f.usr)), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name")]), "records");
				if (truthy(rt.sv(f, "active2"))) {
					yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "active2")]);
					rt.setSv(f, "active2", null);
				}
			} else if ($0 === "Delete Record (ALL) Execute") {
				if (truthy(rt.sv(f, "active1"))) {
					yield* g.srcCall(f, "investigate_log", fmt("＀ (＀) has deleted all records for ＀.", [rt.fv(f, "name", live(f.usr)), rt.fv(f, "key", live(f.usr)), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name")]), "records");
					R = null;
					rt.forList(f, 0, rt.fv(f, "medical", rt.gl("data_core")), T("/datum/data/record"));
					while (($e = rt.next(f, 0)) !== undefined) {
						R = $e;
						if ((isEqual(rt.index(rt.fv(f, "fields", live(R)), "name"), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name")) || isEqual(rt.index(rt.fv(f, "fields", live(R)), "id"), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "id")))) {
							yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
							break;
						}
					}
					rt.endFor(f, 0);
					yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "active1")]);
					rt.setSv(f, "active1", null);
				}
				if (truthy(rt.sv(f, "active2"))) {
					yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "active2")]);
					rt.setSv(f, "active2", null);
				}
			} else {
				rt.setSv(f, "temp", "This function does not appear to be working at the moment. Our apologies.");
			}
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/secure_data/proc/get_photo  (code/game/machinery/computer/security.dm:738)  may sleep
rt.def("/obj/machinery/computer/secure_data/proc/get_photo", function* get_photo(f: Frame, user: Value) {
	let _P: Value = null, tempAI: Value = null, selection: Value = null;
	f.vars = () => [user, _P, tempAI, selection];
	_P = null;
	if (truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
		tempAI = live(user);
		if (truthy((selection = (yield* g.callName(f, live(tempAI), "GetPhoto", []))))) {
			yield* g.callName(f, (_P = (yield* g.new_(f, T("/obj/item/weapon/photo"), []))), "photocreate", [rt.index(rt.fv(f, "fields", live(selection)), "icon"), rt.index(rt.fv(f, "fields", live(selection)), "img"), rt.index(rt.fv(f, "fields", live(selection)), "desc")]);
		}
	} else {
		if (truthy((rt.istype((yield* g.callName(f, live(user), "get_active_held_item", [])), T("/obj/item/weapon/photo")) ? 1 : 0))) {
			_P = (yield* g.callName(f, live(user), "get_active_held_item", []));
		}
	}
	return live(_P);
}, true);

// /obj/machinery/computer/secure_data/proc/emp_act  (code/game/machinery/computer/security.dm:749)  may sleep
rt.def("/obj/machinery/computer/secure_data/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let R: Value = null, G: Value = null;
	let $0: any, $e: any;
	f.vars = () => [severity, R, G, $0, $e];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		yield* g.callSuper(f, [live(severity)]);
		return live(f.dot);
	}
	R = null;
	rt.forList(f, 0, rt.fv(f, "security", rt.gl("data_core")), T("/datum/data/record"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (truthy(rt.op(f, "Prob", [], [divide(10, live(severity))]))) {
			$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 8]));
			if ($0 === 1) {
				if (truthy(rt.op(f, "Prob", [], [10]))) {
					rt.setAt(rt.fv(f, "fields", live(R)), "name", fmt("＀", [rt.op(f, "PickUnweighted", [2], [(yield* g.call(f, P("/proc/lizard_name"), null, ["male"])), (yield* g.call(f, P("/proc/lizard_name"), null, ["female"]))])]));
				} else {
					rt.setAt(rt.fv(f, "fields", live(R)), "name", fmt("＀ ＀", [rt.op(f, "PickUnweighted", [2], [rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_male")]), rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_female")])]), rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]));
				}
			} else if ($0 === 2) {
				rt.setAt(rt.fv(f, "fields", live(R)), "sex", rt.op(f, "PickUnweighted", [2], ["Male", "Female"]));
			} else if ($0 === 3) {
				rt.setAt(rt.fv(f, "fields", live(R)), "age", (yield* g.call(f, P("/proc/rand"), null, [5, 85])));
			} else if ($0 === 4) {
				rt.setAt(rt.fv(f, "fields", live(R)), "criminal", rt.op(f, "PickUnweighted", [5], ["None", "*Arrest*", "Incarcerated", "Parolled", "Discharged"]));
			} else if ($0 === 5) {
				rt.setAt(rt.fv(f, "fields", live(R)), "p_stat", rt.op(f, "PickUnweighted", [3], ["*Unconscious*", "Active", "Physically Unfit"]));
			} else if ($0 === 6) {
				rt.setAt(rt.fv(f, "fields", live(R)), "m_stat", rt.op(f, "PickUnweighted", [4], ["*Insane*", "*Unstable*", "*Watch*", "Stable"]));
			} else if ($0 === 7) {
				rt.setAt(rt.fv(f, "fields", live(R)), "species", rt.op(f, "PickUnweighted", [1], [rt.gl("roundstart_species")]));
			} else if ($0 === 8) {
				G = rt.op(f, "PickUnweighted", [1], [rt.fv(f, "general", rt.gl("data_core"))]);
				rt.setAt(rt.fv(f, "fields", live(R)), "photo_front", rt.index(rt.fv(f, "fields", live(G)), "photo_front"));
				rt.setAt(rt.fv(f, "fields", live(R)), "photo_side", rt.index(rt.fv(f, "fields", live(G)), "photo_side"));
			}
			continue;
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
			continue;
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [live(severity)]);
	return f.dot;
}, true);

// /obj/machinery/computer/secure_data/proc/canUseSecurityRecordsConsole  (code/game/machinery/computer/security.dm:788)
rt.def("/obj/machinery/computer/secure_data/proc/canUseSecurityRecordsConsole", function canUseSecurityRecordsConsole(f: Frame, user: Value, message1: Value, record1: Value, record2: Value) {
	f.vars = () => [message1];
	if (live(message1) === null) {
		message1 = 0;
	}
	if (truthy(live(user))) {
		if (truthy(rt.sv(f, "authenticated"))) {
			if (truthy(rt.callName(f, live(user), "canUseTopic", [live(f.src)]))) {
				if (!truthy(rt.call(f, P("/proc/trim"), null, [live(message1)]))) {
					return 0;
				}
				if ((!truthy(live(record1)) || isEqual(live(record1), rt.sv(f, "active1")))) {
					if ((!truthy(live(record2)) || isEqual(live(record2), rt.sv(f, "active2")))) {
						return 1;
					}
				}
			}
		}
	}
	return 0;
});
