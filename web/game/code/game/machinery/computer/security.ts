// Based on /tg/station's code/game/machinery/computer/security.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


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

// security.dm:35
rt.def("/obj/machinery/computer/secure_data/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/card/id"))) {
		if (!this.scan) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			O.loc = this;
			this.scan = O;
			to_chat(user, `<span class='notice'>You insert ${O}.</span>`);
		} else {
			to_chat(user, "<span class='warning'>There's already an ID card in the console.</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// security.dm:49
rt.def("/obj/machinery/computer/secure_data/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null, R: Value = null, crimstat: Value = null, E: Value = null, background: Value = null, P1: Value = null, P2: Value = null, c: Value = null, counter: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.z > 6) {
		to_chat(user, "<span class='boldannounce'>Unable to establish a connection</span>:  You're too far away from the station!");
		return f.dot;
	}
	if (this.temp) {
		dat = fmt("<TT>＀</TT><BR><BR><A href='?src=＃;choice=Clear Screen'>Clear Screen</A>", [this.temp, this]);
	} else {
		$0 = this;
		if (this.scan) {
			$1 = `${this.scan.name}`;
		} else {
			$1 = "----------";
		}
		dat = fmt("Confirm Identity: <A href='?src=＃;choice=Confirm Identity'>＀</A><HR>", [$0, $1]);
		if (this.authenticated) {
			if (this.screen === 1) {
				dat += "<body onload='selectTextField(); updateSearch();' onkeyup='updateSearch();'>";
				dat += "\n\n\t\t<head>\n\t\t\t<script src=\"jquery.min.js\"></script>\n\t\t\t<script type='text/javascript'>\n\n\t\t\t\tfunction updateSearch(){\n\t\t\t\t\tvar filter_text = document.getElementById('filter');\n\t\t\t\t\tvar filter = filter_text.value.toLowerCase();\n\n\t\t\t\t\tif(complete_list != null && complete_list != \"\"){\n\t\t\t\t\t\tvar mtbl = document.getElementById(\"maintable_data_archive\");\n\t\t\t\t\t\tmtbl.innerHTML = complete_list;\n\t\t\t\t\t}\n\n\t\t\t\t\tif(filter.value == \"\"){\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}else{\n\t\t\t\t\t\t$(\"#maintable_data\").children(\"tbody\").children(\"tr\").children(\"td\").children(\"input\").filter(function(index)\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\treturn $(this)[0].value.toLowerCase().indexOf(filter) == -1\n\t\t\t\t\t\t}).parent(\"td\").parent(\"tr\").hide()\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tfunction selectTextField(){\n\t\t\t\t\tvar filter_text = document.getElementById('filter');\n\t\t\t\t\tfilter_text.focus();\n\t\t\t\t\tfilter_text.select();\n\t\t\t\t}\n\n\t\t\t</script>\n\t\t</head>\n\n\n\t";
				dat += "\n<p style='text-align:center;'>";
				dat += fmt("<A href='?src=＃;choice=New Record (General)'>New Record</A><BR>", [this]);
				dat += "\n\t\t\t\t\t\t<table width='560' align='center' cellspacing='0' cellpadding='5' id='maintable'>\n\t\t\t\t\t\t\t<tr id='search_tr'>\n\t\t\t\t\t\t\t\t<td align='center'>\n\t\t\t\t\t\t\t\t\t<b>Search:</b> <input type='text' id='filter' value='' style='width:300px;'>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t";
				dat += fmt("\n</p>\n<table style=\"text-align:center;\" cellspacing=\"0\" width=\"100%\">\n<tr>\n<th>Records:</th>\n</tr>\n</table>\n\n<span id='maintable_data_archive'>\n<table id='maintable_data' style=\"text-align:center;\" border=\"1\" cellspacing=\"0\" width=\"100%\">\n<tr>\n<th><A href='?src=＃;choice=Sorting;sort=name'>Name</A></th>\n<th><A href='?src=＃;choice=Sorting;sort=id'>ID</A></th>\n<th><A href='?src=＃;choice=Sorting;sort=rank'>Rank</A></th>\n<th><A href='?src=＃;choice=Sorting;sort=fingerprint'>Fingerprints</A></th>\n<th>Criminal Status</th>\n</tr>", [this, this, this, this]);
				if (GLOB.data_core.general !== null) {
					for (R of each((yield* sortRecord(GLOB.data_core.general, this.sortBy, this.order)), T("/datum/data/record"))) {
						crimstat = "";
						E = null;
						for (E of each(GLOB.data_core.security, T("/datum/data/record"))) {
							if (rt.index(E.fields, "name") == rt.index(R.fields, "name") && rt.index(E.fields, "id") == rt.index(R.fields, "id")) {
								crimstat = rt.index(E.fields, "criminal");
							}
						}
						background = null;
						if (crimstat === "*Arrest*") {
							background = "'background-color:#990000;'";
						} else if (crimstat === "Incarcerated") {
							background = "'background-color:#CD6500;'";
						} else if (crimstat === "Parolled") {
							background = "'background-color:#CD6500;'";
						} else if (crimstat === "Discharged") {
							background = "'background-color:#006699;'";
						} else if (crimstat === "None") {
							background = "'background-color:#4F7529;'";
						} else if (crimstat === "") {
							background = "''";
							crimstat = "No Record.";
						}
						dat += `<tr style=${background}>`;
						dat += fmt("<td><input type='hidden' value='＀ ＀ ＀ ＀'></input><A href='?src=＃;choice=Browse Record;d_rec=＃'>＀</a></td>", [rt.index(R.fields, "name"), rt.index(R.fields, "id"), rt.index(R.fields, "rank"), rt.index(R.fields, "fingerprint"), this, R, rt.index(R.fields, "name")]);
						dat += `<td>${rt.index(R.fields, "id")}</td>`;
						dat += `<td>${rt.index(R.fields, "rank")}</td>`;
						dat += `<td>${rt.index(R.fields, "fingerprint")}</td>`;
						dat += `<td>${crimstat}</td></tr>`;
					}
					dat += "\n\t\t\t\t\t\t</table></span>\n\t\t\t\t\t\t<script type='text/javascript'>\n\t\t\t\t\t\t\tvar maintable = document.getElementById(\"maintable_data_archive\");\n\t\t\t\t\t\t\tvar complete_list = maintable.innerHTML;\n\t\t\t\t\t\t</script>\n\t\t\t\t\t\t<hr width='75%' />";
				}
				dat += fmt("<A href='?src=＃;choice=Record Maintenance'>Record Maintenance</A><br><br>", [this]);
				dat += fmt("<A href='?src=＃;choice=Log Out'>{Log Out}</A>", [this]);
			} else if (this.screen === 2) {
				dat += "<B>Records Maintenance</B><HR>";
				dat += fmt("<BR><A href='?src=＃;choice=Delete All Records'>Delete All Records</A><BR><BR><A href='?src=＃;choice=Return'>Back</A>", [this, this]);
			} else if (this.screen === 3) {
				dat += "<font size='4'><b>Security Record</b></font><br>";
				if (rt.istype(this.active1, T("/datum/data/record")) && GLOB.data_core.general.Find(this.active1)) {
					if (rt.istype(rt.index(this.active1.fields, "photo_front"), T("/obj/item/weapon/photo"))) {
						P1 = rt.index(this.active1.fields, "photo_front");
						rt.op(f, "BrowseResource", [], [user, P1.img, "photo_front"], false);
					}
					if (rt.istype(rt.index(this.active1.fields, "photo_side"), T("/obj/item/weapon/photo"))) {
						P2 = rt.index(this.active1.fields, "photo_side");
						rt.op(f, "BrowseResource", [], [user, P2.img, "photo_side"], false);
					}
					dat += fmt("<table><tr><td><table>\n\t\t\t\t\t\t<tr><td>Name:</td><td><A href='?src=＃;choice=Edit Field;field=name'>&nbsp;＀&nbsp;</A></td></tr>\n\t\t\t\t\t\t<tr><td>ID:</td><td><A href='?src=＃;choice=Edit Field;field=id'>&nbsp;＀&nbsp;</A></td></tr>\n\t\t\t\t\t\t<tr><td>Sex:</td><td><A href='?src=＃;choice=Edit Field;field=sex'>&nbsp;＀&nbsp;</A></td></tr>\n\t\t\t\t\t\t<tr><td>Age:</td><td><A href='?src=＃;choice=Edit Field;field=age'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active1.fields, "name"), this, rt.index(this.active1.fields, "id"), this, rt.index(this.active1.fields, "sex"), this, rt.index(this.active1.fields, "age")]);
					if (GLOB.config.mutant_races) {
						dat += fmt("<tr><td>Species:</td><td><A href ='?src=＃;choice=Edit Field;field=species'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active1.fields, "species")]);
					}
					dat += fmt("<tr><td>Rank:</td><td><A href='?src=＃;choice=Edit Field;field=rank'>&nbsp;＀&nbsp;</A></td></tr>\n\t\t\t\t\t\t<tr><td>Fingerprint:</td><td><A href='?src=＃;choice=Edit Field;field=fingerprint'>&nbsp;＀&nbsp;</A></td></tr>\n\t\t\t\t\t\t<tr><td>Physical Status:</td><td>&nbsp;＀&nbsp;</td></tr>\n\t\t\t\t\t\t<tr><td>Mental Status:</td><td>&nbsp;＀&nbsp;</td></tr>\n\t\t\t\t\t\t</table></td>\n\t\t\t\t\t\t<td><table><td align = center><a href='?src=＃;choice=Edit Field;field=show_photo_front'><img src=photo_front height=80 width=80 border=4></a><br>\n\t\t\t\t\t\t<a href='?src=＃;choice=Edit Field;field=upd_photo_front'>Update front photo</a></td>\n\t\t\t\t\t\t<td align = center><a href='?src=＃;choice=Edit Field;field=show_photo_side'><img src=photo_side height=80 width=80 border=4></a><br>\n\t\t\t\t\t\t<a href='?src=＃;choice=Edit Field;field=upd_photo_side'>Update side photo</a></td></table>\n\t\t\t\t\t\t</td></tr></table></td></tr></table>", [this, rt.index(this.active1.fields, "rank"), this, rt.index(this.active1.fields, "fingerprint"), rt.index(this.active1.fields, "p_stat"), rt.index(this.active1.fields, "m_stat"), this, this, this, this]);
				} else {
					dat += "<br>General Record Lost!<br>";
				}
				if (rt.istype(this.active2, T("/datum/data/record")) && GLOB.data_core.security.Find(this.active2)) {
					dat += "<font size='4'><b>Security Data</b></font>";
					dat += fmt("<br>Criminal Status: <A href='?src=＃;choice=Edit Field;field=criminal'>＀</A>", [this, rt.index(this.active2.fields, "criminal")]);
					dat += fmt("<br><br>Minor Crimes: <A href='?src=＃;choice=Edit Field;field=mi_crim_add'>Add New</A>", [this]);
					dat += "<table style=\"text-align:center;\" border=\"1\" cellspacing=\"0\" width=\"100%\">\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th>Crime</th>\n\t\t\t\t\t\t<th>Details</th>\n\t\t\t\t\t\t<th>Author</th>\n\t\t\t\t\t\t<th>Time Added</th>\n\t\t\t\t\t\t<th>Del</th>\n\t\t\t\t\t\t</tr>";
					for (c of each(rt.index(this.active2.fields, "mi_crim"), T("/datum/data/crime"))) {
						dat += `<tr><td>${c.crimeName}</td>`;
						dat += `<td>${c.crimeDetails}</td>`;
						dat += `<td>${c.author}</td>`;
						dat += `<td>${c.time}</td>`;
						dat += fmt("<td><A href='?src=＃;choice=Edit Field;field=mi_crim_delete;cdataid=＀'>[X]</A></td>", [this, c.dataId]);
						dat += "</tr>";
					}
					dat += "</table>";
					dat += fmt("<br>Major Crimes: <A href='?src=＃;choice=Edit Field;field=ma_crim_add'>Add New</A>", [this]);
					dat += "<table style=\"text-align:center;\" border=\"1\" cellspacing=\"0\" width=\"100%\">\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th>Crime</th>\n\t\t\t\t\t\t<th>Details</th>\n\t\t\t\t\t\t<th>Author</th>\n\t\t\t\t\t\t<th>Time Added</th>\n\t\t\t\t\t\t<th>Del</th>\n\t\t\t\t\t\t</tr>";
					c = null;
					for (c of each(rt.index(this.active2.fields, "ma_crim"), T("/datum/data/crime"))) {
						dat += `<tr><td>${c.crimeName}</td>`;
						dat += `<td>${c.crimeDetails}</td>`;
						dat += `<td>${c.author}</td>`;
						dat += `<td>${c.time}</td>`;
						dat += fmt("<td><A href='?src=＃;choice=Edit Field;field=ma_crim_delete;cdataid=＀'>[X]</A></td>", [this, c.dataId]);
						dat += "</tr>";
					}
					dat += "</table>";
					dat += fmt("<br>\nImportant Notes:<br>\n\t<A href='?src=＃;choice=Edit Field;field=notes'>&nbsp;＀&nbsp;</A>", [this, rt.index(this.active2.fields, "notes")]);
					dat += "<br><br><font size='4'><b>Comments/Log</b></font><br>";
					counter = 1;
					while (rt.index(this.active2.fields, `com_${counter}`)) {
						dat += rt.index(this.active2.fields, `com_${counter}`) + "<BR>";
						if (rt.index(this.active2.fields, `com_${counter}`) != "<B>Deleted</B>") {
							dat += fmt("<A href='?src=＃;choice=Delete Entry;del_c=＀'>Delete Entry</A><BR><BR>", [this, counter]);
						}
						counter++;
					}
					dat += fmt("<A href='?src=＃;choice=Add Entry'>Add Entry</A><br><br>", [this]);
					dat += fmt("<A href='?src=＃;choice=Delete Record (Security)'>Delete Record (Security Only)</A><br>", [this]);
				} else {
					dat += "Security Record Lost!<br>";
					dat += fmt("<A href='?src=＃;choice=New Record (Security)'>New Security Record</A><br><br>", [this]);
				}
				dat += fmt("<A href='?src=＃;choice=Delete Record (ALL)'>Delete Record (ALL)</A><br><A href='?src=＃;choice=Print Record'>Print Record</A><BR><A href='?src=＃;choice=Print Poster'>Print Wanted Poster</A><BR><A href='?src=＃;choice=Return'>Back</A><BR>", [this, this, this, this]);
			}
		} else {
			dat += fmt("<A href='?src=＃;choice=Log In'>{Log In}</A>", [this]);
		}
	}
	(popup = (yield* new_(T("/datum/browser"), user, "secure_rec", "Security Records Console", 600, 400))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// security.dm:270
rt.def("/obj/machinery/computer/secure_data/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let old_field: Value = null, H: Value = null, R: Value = null, I: Value = null, borg: Value = null, S: Value = null, E: Value = null, _P: Value = null, c: Value = null, counter: Value = null, wanted_name: Value = null, default_description: Value = null, major_crimes: Value = null, minor_crimes: Value = null, c_4: Value = null, info: Value = null, photo: Value = null, a2: Value = null, t1: Value = null, counter_2: Value = null, G: Value = null, R_1: Value = null, M: Value = null, a1: Value = null, a2_1: Value = null, t1_2: Value = null, _P_2: Value = null, photo_2: Value = null, t2: Value = null, crime: Value = null, L: Value = null, rank: Value = null;
	let $e: any;
	f.dot = (yield* parent_proc());
	if (f.dot) {
		return f.dot;
	}
	if (!GLOB.data_core.general.Find(this.active1)) {
		this.active1 = null;
	}
	if (!GLOB.data_core.security.Find(this.active2)) {
		this.active2 = null;
	}
	if (f.usr.contents.Find(this) || get_dist(this, f.usr) <= 1 && isturf(this.loc) || rt.istype(f.usr, T("/mob/living/silicon")) || IsAdminGhost(f.usr)) {
		yield* f.usr.set_machine(this);
		const item = rt.at(href_list, "choice");
		if (item === "Sorting") {
			if (this.sortBy == rt.at(href_list, "sort")) {
				if (this.order == 1) {
					this.order = -1;
				} else {
					this.order = 1;
				}
			} else {
				this.sortBy = rt.at(href_list, "sort");
				this.order = rt.initial(f, this, "order");
			}
		} else if (item === "Clear Screen") {
			this.temp = null;
		} else if (item === "Return") {
			this.screen = 1;
			this.active1 = null;
			this.active2 = null;
		} else if (item === "Confirm Identity") {
			if (this.scan) {
				if (rt.istype(f.usr, T("/mob/living/carbon/human")) && !f.usr.get_active_held_item()) {
					yield* f.usr.put_in_hands(this.scan);
				} else {
					this.scan.loc = rt.getStep(f, this, 0);
				}
				this.scan = null;
			} else if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id"))) {
				if (!(yield* f.usr.drop_item())) {
					return f.dot;
				}
				I.loc = this;
				this.scan = I;
			}
		} else if (item === "Log Out") {
			this.authenticated = null;
			this.screen = null;
			this.active1 = null;
			this.active2 = null;
		} else if (item === "Log In") {
			if (rt.istype(f.usr, T("/mob/living/silicon"))) {
				borg = f.usr;
				this.active1 = null;
				this.active2 = null;
				this.authenticated = borg.name;
				this.rank = "AI";
				this.screen = 1;
			} else if (IsAdminGhost(f.usr)) {
				this.active1 = null;
				this.active2 = null;
				this.authenticated = f.usr.client.holder.admin_signature;
				this.rank = "Central Command";
				this.screen = 1;
			} else if (rt.istype(this.scan, T("/obj/item/weapon/card/id"))) {
				this.active1 = null;
				this.active2 = null;
				if (this.check_access(this.scan)) {
					this.authenticated = this.scan.registered_name;
					this.rank = this.scan.assignment;
					this.screen = 1;
				}
			}
		} else if (item === "Record Maintenance") {
			this.screen = 2;
			this.active1 = null;
			this.active2 = null;
		} else if (item === "Browse Record") {
			R = rt.locateIn(f, rt.at(href_list, "d_rec"), rt.world());
			S = rt.locateIn(f, rt.at(href_list, "d_rec"), rt.world());
			if (!GLOB.data_core.general.Find(R)) {
				this.temp = "Record Not Found!";
			} else {
				for (E of each(GLOB.data_core.security, T("/datum/data/record"))) {
					if (rt.index(E.fields, "name") == rt.index(R.fields, "name") || rt.index(E.fields, "id") == rt.index(R.fields, "id")) {
						S = E;
					}
				}
				this.active1 = R;
				this.active2 = S;
				this.screen = 3;
			}
		} else if (item === "Print Record") {
			if (!this.printing) {
				this.printing = 1;
				GLOB.data_core.securityPrintCount++;
				playsound(this.loc, rt.rsc("sound/items/poster_being_created.ogg"), 100, 1);
				yield* sleep(30);
				(_P = (yield* new_(T("/obj/item/weapon/paper"), this.loc))).info = `<CENTER><B>Security Record - (SR-${GLOB.data_core.securityPrintCount})</B></CENTER><BR>`;
				if (rt.istype(this.active1, T("/datum/data/record")) && GLOB.data_core.general.Find(this.active1)) {
					_P.info += `Name: ${rt.index(this.active1.fields, "name")} ID: ${rt.index(this.active1.fields, "id")}<BR>\nSex: ${rt.index(this.active1.fields, "sex")}<BR>\nAge: ${rt.index(this.active1.fields, "age")}<BR>`;
					if (GLOB.config.mutant_races) {
						_P.info += `\nSpecies: ${rt.index(this.active1.fields, "species")}<BR>`;
					}
					_P.info += `\nFingerprint: ${rt.index(this.active1.fields, "fingerprint")}<BR>\nPhysical Status: ${rt.index(this.active1.fields, "p_stat")}<BR>\nMental Status: ${rt.index(this.active1.fields, "m_stat")}<BR>`;
				} else {
					_P.info += "<B>General Record Lost!</B><BR>";
				}
				if (rt.istype(this.active2, T("/datum/data/record")) && GLOB.data_core.security.Find(this.active2)) {
					_P.info += `<BR>\n<CENTER><B>Security Data</B></CENTER><BR>\nCriminal Status: ${rt.index(this.active2.fields, "criminal")}`;
					_P.info += "<BR>\n<BR>\nMinor Crimes:<BR>\n";
					_P.info += "<table style=\"text-align:center;\" border=\"1\" cellspacing=\"0\" width=\"100%\">\n<tr>\n<th>Crime</th>\n<th>Details</th>\n<th>Author</th>\n<th>Time Added</th>\n</tr>";
					for (c of each(rt.index(this.active2.fields, "mi_crim"), T("/datum/data/crime"))) {
						_P.info += `<tr><td>${c.crimeName}</td>`;
						_P.info += `<td>${c.crimeDetails}</td>`;
						_P.info += `<td>${c.author}</td>`;
						_P.info += `<td>${c.time}</td>`;
						_P.info += "</tr>";
					}
					_P.info += "</table>";
					_P.info += "<BR>\nMajor Crimes: <BR>\n";
					_P.info += "<table style=\"text-align:center;\" border=\"1\" cellspacing=\"0\" width=\"100%\">\n<tr>\n<th>Crime</th>\n<th>Details</th>\n<th>Author</th>\n<th>Time Added</th>\n</tr>";
					c = null;
					for (c of each(rt.index(this.active2.fields, "ma_crim"), T("/datum/data/crime"))) {
						_P.info += `<tr><td>${c.crimeName}</td>`;
						_P.info += `<td>${c.crimeDetails}</td>`;
						_P.info += `<td>${c.author}</td>`;
						_P.info += `<td>${c.time}</td>`;
						_P.info += "</tr>";
					}
					_P.info += "</table>";
					_P.info += `<BR>\nImportant Notes:<BR>\n\t${rt.index(this.active2.fields, "notes")}<BR>\n<BR>\n<CENTER><B>Comments/Log</B></CENTER><BR>`;
					counter = 1;
					while (rt.index(this.active2.fields, `com_${counter}`)) {
						_P.info += `${rt.index(this.active2.fields, `com_${counter}`)}<BR>`;
						counter++;
					}
					_P.name = `SR-${GLOB.data_core.securityPrintCount} '${rt.index(this.active1.fields, "name")}'`;
				} else {
					_P.info += "<B>Security Record Lost!</B><BR>";
					_P.name = `SR-${GLOB.data_core.securityPrintCount} '${"Record Lost"}'`;
				}
				_P.info += "</TT>";
				this.printing = null;
			}
		} else if (item === "Print Poster") {
			if (!this.printing) {
				if (wanted_name = (yield* stripped_input(f.usr, "Please enter an alias for the criminal:", "Print Wanted Poster", rt.index(this.active1.fields, "name")))) {
					default_description = `A poster declaring ${wanted_name} to be a dangerous individual, wanted by Nanotrasen. Report any sightings to security immediately.`;
					major_crimes = rt.index(this.active2.fields, "ma_crim");
					minor_crimes = rt.index(this.active2.fields, "mi_crim");
					if (rt.len(f, major_crimes) + rt.len(f, minor_crimes)) {
						default_description += `\n${wanted_name} is wanted for the following crimes:\n`;
					}
					if (rt.len(f, minor_crimes)) {
						default_description += "\nMinor Crimes:";
						for (c_4 of each(rt.index(this.active2.fields, "mi_crim"), T("/datum/data/crime"))) {
							default_description += `\n${c_4.crimeName}\n`;
							default_description += `${c_4.crimeDetails}\n`;
						}
					}
					if (rt.len(f, major_crimes)) {
						default_description += "\nMajor Crimes:";
						c_4 = null;
						for (c_4 of each(rt.index(this.active2.fields, "ma_crim"), T("/datum/data/crime"))) {
							default_description += `\n${c_4.crimeName}\n`;
							default_description += `${c_4.crimeDetails}\n`;
						}
					}
					if (info = (yield* stripped_multiline_input(f.usr, "Please input a description for the poster:", "Print Wanted Poster", default_description, null))) {
						playsound(this.loc, rt.rsc("sound/items/poster_being_created.ogg"), 100, 1);
						this.printing = 1;
						yield* sleep(30);
						if (rt.istype(this.active1, T("/datum/data/record")) && GLOB.data_core.general.Find(this.active1)) {
							photo = rt.index(this.active1.fields, "photo_front");
							yield* new_(T("/obj/item/weapon/poster/wanted"), this.loc, photo.img, wanted_name, info);
						}
						this.printing = 0;
					}
				}
			}
		} else if (item === "Delete All Records") {
			this.temp = "";
			this.temp += "Are you sure you wish to delete all Security records?<br>";
			this.temp += fmt("<a href='?src=＃;choice=Purge All Records'>Yes</a><br>", [this]);
			this.temp += fmt("<a href='?src=＃;choice=Clear Screen'>No</a>", [this]);
		} else if (item === "Purge All Records") {
			this.investigate_log(`${f.usr.name} (${f.usr.key}) has purged all the security records.`, "records");
			R = null;
			for (R of each(GLOB.data_core.security, T("/datum/data/record"))) {
				yield* qdel(R);
			}
			GLOB.data_core.security.Cut();
			this.temp = "All Security records deleted.";
		} else if (item === "Add Entry") {
			if (!rt.istype(this.active2, T("/datum/data/record"))) {
				return f.dot;
			}
			a2 = this.active2;
			t1 = (yield* stripped_multiline_input("Add Comment:", "Secure. records", null, null));
			if (!this.canUseSecurityRecordsConsole(f.usr, t1, null, a2)) {
				return f.dot;
			}
			counter_2 = 1;
			while (rt.index(this.active2.fields, `com_${counter_2}`)) {
				counter_2++;
			}
			rt.setAt(this.active2.fields, `com_${counter_2}`, `Made by ${this.authenticated} (${this.rank}) on ${worldtime2text()} ${time2text(rt.world().realtime, "MMM DD")}, ${GLOB.year_integer + 540}<BR>${t1}`);
		} else if (item === "Delete Record (ALL)") {
			if (this.active1) {
				this.temp = "<h5>Are you sure you wish to delete the record (ALL)?</h5>";
				this.temp += fmt("<a href='?src=＃;choice=Delete Record (ALL) Execute'>Yes</a><br>", [this]);
				this.temp += fmt("<a href='?src=＃;choice=Clear Screen'>No</a>", [this]);
			}
		} else if (item === "Delete Record (Security)") {
			if (this.active2) {
				this.temp = "<h5>Are you sure you wish to delete the record (Security Portion Only)?</h5>";
				this.temp += fmt("<a href='?src=＃;choice=Delete Record (Security) Execute'>Yes</a><br>", [this]);
				this.temp += fmt("<a href='?src=＃;choice=Clear Screen'>No</a>", [this]);
			}
		} else if (item === "Delete Entry") {
			if (rt.istype(this.active2, T("/datum/data/record")) && rt.index(this.active2.fields, `com_${rt.at(href_list, "del_c")}`)) {
				rt.setAt(this.active2.fields, `com_${rt.at(href_list, "del_c")}`, "<B>Deleted</B>");
			}
		} else if (item === "New Record (Security)") {
			if (rt.istype(this.active1, T("/datum/data/record")) && !rt.istype(this.active2, T("/datum/data/record"))) {
				rt.setAt((R = (yield* new_(T("/datum/data/record")))).fields, "name", rt.index(this.active1.fields, "name"));
				rt.setAt(R.fields, "id", rt.index(this.active1.fields, "id"));
				R.name = `Security Record #${rt.index(R.fields, "id")}`;
				rt.setAt(R.fields, "criminal", "None");
				rt.setAt(R.fields, "mi_crim", list());
				rt.setAt(R.fields, "ma_crim", list());
				rt.setAt(R.fields, "notes", "No notes.");
				GLOB.data_core.security += R;
				this.active2 = R;
				this.screen = 3;
			}
		} else if (item === "New Record (General)") {
			rt.setAt((G = (yield* new_(T("/datum/data/record")))).fields, "name", "New Record");
			rt.setAt(G.fields, "id", `${num2hex(rand(1, 16777215), 6)}`);
			rt.setAt(G.fields, "rank", "Unassigned");
			rt.setAt(G.fields, "sex", "Male");
			rt.setAt(G.fields, "age", "Unknown");
			if (GLOB.config.mutant_races) {
				rt.setAt(G.fields, "species", "Human");
			}
			rt.setAt(G.fields, "photo_front", (yield* new_(T("/icon"))));
			rt.setAt(G.fields, "photo_side", (yield* new_(T("/icon"))));
			rt.setAt(G.fields, "fingerprint", "?????");
			rt.setAt(G.fields, "p_stat", "Active");
			rt.setAt(G.fields, "m_stat", "Stable");
			GLOB.data_core.general += G;
			this.active1 = G;
			rt.setAt((R_1 = (yield* new_(T("/datum/data/record")))).fields, "name", rt.index(this.active1.fields, "name"));
			rt.setAt(R_1.fields, "id", rt.index(this.active1.fields, "id"));
			R_1.name = `Security Record #${rt.index(R_1.fields, "id")}`;
			rt.setAt(R_1.fields, "criminal", "None");
			rt.setAt(R_1.fields, "mi_crim", list());
			rt.setAt(R_1.fields, "ma_crim", list());
			rt.setAt(R_1.fields, "notes", "No notes.");
			GLOB.data_core.security += R_1;
			this.active2 = R_1;
			rt.setAt((M = (yield* new_(T("/datum/data/record")))).fields, "id", rt.index(this.active1.fields, "id"));
			rt.setAt(M.fields, "name", rt.index(this.active1.fields, "name"));
			rt.setAt(M.fields, "blood_type", "?");
			rt.setAt(M.fields, "b_dna", "?????");
			rt.setAt(M.fields, "mi_dis", "None");
			rt.setAt(M.fields, "mi_dis_d", "No minor disabilities have been declared.");
			rt.setAt(M.fields, "ma_dis", "None");
			rt.setAt(M.fields, "ma_dis_d", "No major disabilities have been diagnosed.");
			rt.setAt(M.fields, "alg", "None");
			rt.setAt(M.fields, "alg_d", "No allergies have been detected in this patient.");
			rt.setAt(M.fields, "cdi", "None");
			rt.setAt(M.fields, "cdi_d", "No diseases have been diagnosed at the moment.");
			rt.setAt(M.fields, "notes", "No notes.");
			GLOB.data_core.medical += M;
		} else if (item === "Edit Field") {
			a1 = this.active1;
			a2_1 = this.active2;
			const item_2 = rt.at(href_list, "field");
			if (item_2 === "name") {
				if (rt.istype(this.active1, T("/datum/data/record")) || rt.istype(this.active2, T("/datum/data/record"))) {
					t1_2 = copytext(sanitize((yield* g.op(f, "Prompt", [2], [null, rt.index(this.active1.fields, "name"), "Secure. records", "Please input name:", null]))), 1, 1024);
					if (!this.canUseSecurityRecordsConsole(f.usr, t1_2, a1)) {
						return f.dot;
					}
					if (rt.istype(this.active1, T("/datum/data/record"))) {
						rt.setAt(this.active1.fields, "name", t1_2);
					}
					if (rt.istype(this.active2, T("/datum/data/record"))) {
						rt.setAt(this.active2.fields, "name", t1_2);
					}
				}
			} else if (item_2 === "id") {
				if (rt.istype(this.active2, T("/datum/data/record")) || rt.istype(this.active1, T("/datum/data/record"))) {
					t1_2 = (yield* stripped_input(f.usr, "Please input id:", "Secure. records", rt.index(this.active1.fields, "id"), null));
					if (!this.canUseSecurityRecordsConsole(f.usr, t1_2, a1)) {
						return f.dot;
					}
					if (rt.istype(this.active1, T("/datum/data/record"))) {
						rt.setAt(this.active1.fields, "id", t1_2);
					}
					if (rt.istype(this.active2, T("/datum/data/record"))) {
						rt.setAt(this.active2.fields, "id", t1_2);
					}
				}
			} else if (item_2 === "fingerprint") {
				if (rt.istype(this.active1, T("/datum/data/record"))) {
					t1_2 = (yield* stripped_input(f.usr, "Please input fingerprint hash:", "Secure. records", rt.index(this.active1.fields, "fingerprint"), null));
					if (!this.canUseSecurityRecordsConsole(f.usr, t1_2, a1)) {
						return f.dot;
					}
					rt.setAt(this.active1.fields, "fingerprint", t1_2);
				}
			} else if (item_2 === "sex") {
				if (rt.istype(this.active1, T("/datum/data/record"))) {
					if (rt.index(this.active1.fields, "sex") == "Male") {
						rt.setAt(this.active1.fields, "sex", "Female");
					} else {
						rt.setAt(this.active1.fields, "sex", "Male");
					}
				}
			} else if (item_2 === "age") {
				if (rt.istype(this.active1, T("/datum/data/record"))) {
					t1_2 = (yield* g.op(f, "Prompt", [32], [null, rt.index(this.active1.fields, "age"), "Secure. records", "Please input age:", null]));
					if (!this.canUseSecurityRecordsConsole(f.usr, "age", a1)) {
						return f.dot;
					}
					rt.setAt(this.active1.fields, "age", t1_2);
				}
			} else if (item_2 === "species") {
				if (rt.istype(this.active1, T("/datum/data/record"))) {
					t1_2 = (yield* g.op(f, "Prompt", [1], [null, null, "Species Selection", "Select a species", GLOB.roundstart_species]));
					if (!this.canUseSecurityRecordsConsole(f.usr, t1_2, a1)) {
						return f.dot;
					}
					rt.setAt(this.active1.fields, "species", t1_2);
				}
			} else if (item_2 === "show_photo_front") {
				if (rt.index(this.active1.fields, "photo_front")) {
					if (rt.istype(rt.index(this.active1.fields, "photo_front"), T("/obj/item/weapon/photo"))) {
						yield* (_P_2 = rt.index(this.active1.fields, "photo_front")).show(f.usr);
					}
				}
			} else if (item_2 === "upd_photo_front") {
				if (photo_2 = (yield* this.get_photo(f.usr))) {
					yield* qdel(rt.index(this.active1.fields, "photo_front"));
					rt.setAt(this.active1.fields, "photo_front", photo_2);
				}
			} else if (item_2 === "show_photo_side") {
				if (rt.index(this.active1.fields, "photo_side")) {
					if (rt.istype(rt.index(this.active1.fields, "photo_side"), T("/obj/item/weapon/photo"))) {
						yield* (_P_2 = rt.index(this.active1.fields, "photo_side")).show(f.usr);
					}
				}
			} else if (item_2 === "upd_photo_side") {
				if (photo_2 = (yield* this.get_photo(f.usr))) {
					yield* qdel(rt.index(this.active1.fields, "photo_side"));
					rt.setAt(this.active1.fields, "photo_side", photo_2);
				}
			} else if (item_2 === "mi_crim_add") {
				if (rt.istype(this.active1, T("/datum/data/record"))) {
					t1_2 = (yield* stripped_input(f.usr, "Please input minor crime names:", "Secure. records", "", null));
					t2 = (yield* stripped_input(f.usr, "Please input minor crime details:", "Secure. records", "", null));
					if (!this.canUseSecurityRecordsConsole(f.usr, t1_2, null, a2_1)) {
						return f.dot;
					}
					crime = GLOB.data_core.createCrimeEntry(t1_2, t2, this.authenticated, worldtime2text());
					GLOB.data_core.addMinorCrime(rt.index(this.active1.fields, "id"), crime);
				}
			} else if (item_2 === "mi_crim_delete") {
				if (rt.istype(this.active1, T("/datum/data/record"))) {
					if (rt.at(href_list, "cdataid")) {
						if (!this.canUseSecurityRecordsConsole(f.usr, "delete", null, a2_1)) {
							return f.dot;
						}
						GLOB.data_core.removeMinorCrime(rt.index(this.active1.fields, "id"), rt.at(href_list, "cdataid"));
					}
				}
			} else if (item_2 === "ma_crim_add") {
				if (rt.istype(this.active1, T("/datum/data/record"))) {
					t1_2 = (yield* stripped_input(f.usr, "Please input major crime names:", "Secure. records", "", null));
					t2 = (yield* stripped_input(f.usr, "Please input major crime details:", "Secure. records", "", null));
					if (!this.canUseSecurityRecordsConsole(f.usr, t1_2, null, a2_1)) {
						return f.dot;
					}
					crime = GLOB.data_core.createCrimeEntry(t1_2, t2, this.authenticated, worldtime2text());
					GLOB.data_core.addMajorCrime(rt.index(this.active1.fields, "id"), crime);
				}
			} else if (item_2 === "ma_crim_delete") {
				if (rt.istype(this.active1, T("/datum/data/record"))) {
					if (rt.at(href_list, "cdataid")) {
						if (!this.canUseSecurityRecordsConsole(f.usr, "delete", null, a2_1)) {
							return f.dot;
						}
						GLOB.data_core.removeMajorCrime(rt.index(this.active1.fields, "id"), rt.at(href_list, "cdataid"));
					}
				}
			} else if (item_2 === "notes") {
				if (rt.istype(this.active2, T("/datum/data/record"))) {
					t1_2 = (yield* stripped_input(f.usr, "Please summarize notes:", "Secure. records", rt.index(this.active2.fields, "notes"), null));
					if (!this.canUseSecurityRecordsConsole(f.usr, t1_2, null, a2_1)) {
						return f.dot;
					}
					rt.setAt(this.active2.fields, "notes", t1_2);
				}
			} else if (item_2 === "criminal") {
				if (rt.istype(this.active2, T("/datum/data/record"))) {
					this.temp = "<h5>Criminal Status:</h5>";
					this.temp += "<ul>";
					this.temp += fmt("<li><a href='?src=＃;choice=Change Criminal Status;criminal2=none'>None</a></li>", [this]);
					this.temp += fmt("<li><a href='?src=＃;choice=Change Criminal Status;criminal2=arrest'>*Arrest*</a></li>", [this]);
					this.temp += fmt("<li><a href='?src=＃;choice=Change Criminal Status;criminal2=incarcerated'>Incarcerated</a></li>", [this]);
					this.temp += fmt("<li><a href='?src=＃;choice=Change Criminal Status;criminal2=parolled'>Parolled</a></li>", [this]);
					this.temp += fmt("<li><a href='?src=＃;choice=Change Criminal Status;criminal2=released'>Discharged</a></li>", [this]);
					this.temp += "</ul>";
				}
			} else if (item_2 === "rank") {
				L = list("Head of Personnel", "Captain", "AI", "Central Command");
				if (rt.istype(this.active1, T("/datum/data/record")) && L.Find(this.rank)) {
					this.temp = "<h5>Rank:</h5>";
					this.temp += "<ul>";
					for (rank of each(get_all_jobs())) {
						this.temp += fmt("<li><a href='?src=＃;choice=Change Rank;rank=＀'>＀</a></li>", [this, rank, rank]);
					}
					this.temp += "</ul>";
				} else {
					yield* alert(f.usr, "You do not have the required rank to do this!");
				}
			}
		} else {
			this.temp = null;
			const item_2 = rt.at(href_list, "choice");
			if (item_2 === "Change Rank") {
				if (this.active1) {
					rt.setAt(this.active1.fields, "rank", strip_html(rt.at(href_list, "rank"))); // tg 2cd1bb7cb8: the rank is shown raw in the record
					if (rt.isIn(f, rt.at(href_list, "rank"), get_all_jobs())) {
						rt.setAt(this.active1.fields, "real_rank", rt.at(href_list, "real_rank"));
					}
				}
			} else if (item_2 === "Change Criminal Status") {
				if (this.active2) {
					old_field = rt.index(this.active2.fields, "criminal");
					const item_3 = rt.at(href_list, "criminal2");
					if (item_3 === "none") {
						rt.setAt(this.active2.fields, "criminal", "None");
					} else if (item_3 === "arrest") {
						rt.setAt(this.active2.fields, "criminal", "*Arrest*");
					} else if (item_3 === "incarcerated") {
						rt.setAt(this.active2.fields, "criminal", "Incarcerated");
					} else if (item_3 === "parolled") {
						rt.setAt(this.active2.fields, "criminal", "Parolled");
					} else if (item_3 === "released") {
						rt.setAt(this.active2.fields, "criminal", "Discharged");
					}
					this.investigate_log(`${rt.index(this.active1.fields, "name")} has been set from ${old_field} to ${rt.index(this.active2.fields, "criminal")} by ${f.usr.name} (${f.usr.key}).`, "records");
					for (H of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
						H.sec_hud_set_security_status();
					}
				}
			} else if (item_2 === "Delete Record (Security) Execute") {
				this.investigate_log(`${f.usr.name} (${f.usr.key}) has deleted the security records for ${rt.index(this.active1.fields, "name")}.`, "records");
				if (this.active2) {
					yield* qdel(this.active2);
					this.active2 = null;
				}
			} else if (item_2 === "Delete Record (ALL) Execute") {
				if (this.active1) {
					this.investigate_log(`${f.usr.name} (${f.usr.key}) has deleted all records for ${rt.index(this.active1.fields, "name")}.`, "records");
					R = null;
					for (R of each(GLOB.data_core.medical, T("/datum/data/record"))) {
						if (rt.index(R.fields, "name") == rt.index(this.active1.fields, "name") || rt.index(R.fields, "id") == rt.index(this.active1.fields, "id")) {
							yield* qdel(R);
							break;
						}
					}
					yield* qdel(this.active1);
					this.active1 = null;
				}
				if (this.active2) {
					yield* qdel(this.active2);
					this.active2 = null;
				}
			} else {
				this.temp = "This function does not appear to be working at the moment. Our apologies.";
			}
		}
	}
	yield* this.add_fingerprint(f.usr);
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// security.dm:738
rt.def("/obj/machinery/computer/secure_data/proc/get_photo", function* get_photo(f: Frame, user: Value) {
	let _P: Value = null, tempAI: Value = null, selection: Value = null;
	if (rt.istype(user, T("/mob/living/silicon"))) {
		tempAI = user;
		if (selection = (yield* tempAI.GetPhoto())) {
			(_P = (yield* new_(T("/obj/item/weapon/photo")))).photocreate(rt.index(selection.fields, "icon"), rt.index(selection.fields, "img"), rt.index(selection.fields, "desc"));
		}
	} else if (rt.istype(user.get_active_held_item(), T("/obj/item/weapon/photo"))) {
		_P = user.get_active_held_item();
	}
	return _P;
}, true);

// security.dm:749
rt.def("/obj/machinery/computer/secure_data/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let R: Value = null, G: Value = null;
	let $e: any;
	if (rt.bitAnd(this.stat, 3)) {
		yield* parent_proc(severity);
		return f.dot;
	}
	for (R of each(GLOB.data_core.security, T("/datum/data/record"))) {
		if (prob(10 / severity)) {
			const die = rand(1, 8);
			if (die === 1) {
				if (prob(10)) {
					rt.setAt(R.fields, "name", `${pick(lizard_name("male"), lizard_name("female"))}`);
				} else {
					rt.setAt(R.fields, "name", `${pick(pick(GLOB.first_names_male), pick(GLOB.first_names_female))} ${pick(GLOB.last_names)}`);
				}
			} else if (die === 2) {
				rt.setAt(R.fields, "sex", pick("Male", "Female"));
			} else if (die === 3) {
				rt.setAt(R.fields, "age", rand(5, 85));
			} else if (die === 4) {
				rt.setAt(R.fields, "criminal", pick("None", "*Arrest*", "Incarcerated", "Parolled", "Discharged"));
			} else if (die === 5) {
				rt.setAt(R.fields, "p_stat", pick("*Unconscious*", "Active", "Physically Unfit"));
			} else if (die === 6) {
				rt.setAt(R.fields, "m_stat", pick("*Insane*", "*Unstable*", "*Watch*", "Stable"));
			} else if (die === 7) {
				rt.setAt(R.fields, "species", pick(GLOB.roundstart_species));
			} else if (die === 8) {
				G = pick(GLOB.data_core.general);
				rt.setAt(R.fields, "photo_front", rt.index(G.fields, "photo_front"));
				rt.setAt(R.fields, "photo_side", rt.index(G.fields, "photo_side"));
			}
			continue;
		}
		if (prob(1)) {
			yield* qdel(R);
			continue;
		}
	}
	yield* parent_proc(severity);
	return f.dot;
}, true);

// security.dm:788
rt.def("/obj/machinery/computer/secure_data/proc/canUseSecurityRecordsConsole", function canUseSecurityRecordsConsole(f: Frame, user: Value, message1: Value, record1: Value, record2: Value) {
	message1 ??= 0;
	if (user) {
		if (this.authenticated) {
			if (user.canUseTopic(this)) {
				if (!trim(message1)) {
					return 0;
				}
				if (!record1 || record1 == this.active1) {
					if (!record2 || record2 == this.active2) {
						return 1;
					}
				}
			}
		}
	}
	return 0;
});
