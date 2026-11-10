// Based on /tg/station's code/game/machinery/computer/medical.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10386, "/obj/machinery/computer/med_data", "/obj/machinery/computer", {
	scan: null,
	authenticated: null,
	rank: null,
	screen: null,
	active1: null,
	active2: null,
	a_id: null,
	temp: null,
	printing: null,
	sortBy: "name",
	order: 1,
	icon_screen: "medcomp",
	icon_keyboard: "med_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/med_data"),
	light_color: "#6496FA",
	name: "medical records console",
	desc: "This can be used to check medical records.",
	req_one_access: null,
});

// medical.dm:26
rt.def("/obj/machinery/computer/med_data/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/card/id")) && !this.scan) {
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		O.loc = this;
		this.scan = O;
		to_chat(user, `<span class='notice'>You insert ${O}.</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// medical.dm:36
rt.def("/obj/machinery/computer/med_data/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null, R: Value = null, blood_type: Value = null, b_dna: Value = null, E: Value = null, background: Value = null, P1: Value = null, P2: Value = null, counter: Value = null, Dt: Value = null, Dis: Value = null, bdat: Value = null, M: Value = null, bl: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.temp) {
		dat = fmt("<TT>＀</TT><BR><BR><A href='?src=＃;temp=1'>Clear Screen</A>", [this.temp, this]);
	} else {
		$0 = this;
		if (this.scan) {
			$1 = `${this.scan.name}`;
		} else {
			$1 = "----------";
		}
		dat = fmt("Confirm Identity: <A href='?src=＃;scan=1'>＀</A><HR>", [$0, $1]);
		if (this.authenticated) {
			if (this.screen === 1) {
				dat += fmt("\n<A href='?src=＃;search=1'>Search Records</A>\n<BR><A href='?src=＃;screen=2'>List Records</A>\n<BR>\n<BR><A href='?src=＃;screen=5'>Virus Database</A>\n<BR><A href='?src=＃;screen=6'>Medbot Tracking</A>\n<BR>\n<BR><A href='?src=＃;screen=3'>Record Maintenance</A>\n<BR><A href='?src=＃;logout=1'>{Log Out}</A><BR>\n", [this, this, this, this, this, this]);
			} else if (this.screen === 2) {
				dat += fmt("\n</p>\n<table style=\"text-align:center;\" cellspacing=\"0\" width=\"100%\">\n<tr>\n<th>Records:</th>\n</tr>\n</table>\n<table style=\"text-align:center;\" border=\"1\" cellspacing=\"0\" width=\"100%\">\n<tr>\n<th><A href='?src=＃;choice=Sorting;sort=name'>Name</A></th>\n<th><A href='?src=＃;choice=Sorting;sort=id'>ID</A></th>\n<th>Fingerprints (F) | DNA (D)</th>\n<th><A href='?src=＃;choice=Sorting;sort=bloodtype'>Blood Type</A></th>\n<th>Physical Status</th>\n<th>Mental Status</th>\n</tr>", [this, this, this]);
				if (GLOB.data_core.general !== null) {
					for (R of each((yield* sortRecord(GLOB.data_core.general, this.sortBy, this.order)), T("/datum/data/record"))) {
						blood_type = "";
						b_dna = "";
						E = null;
						for (E of each(GLOB.data_core.medical, T("/datum/data/record"))) {
							if (rt.index(E.fields, "name") == rt.index(R.fields, "name") && rt.index(E.fields, "id") == rt.index(R.fields, "id")) {
								blood_type = rt.index(E.fields, "blood_type");
								b_dna = rt.index(E.fields, "b_dna");
							}
						}
						background = null;
						if (rt.index(R.fields, "m_stat") == "*Insane*" || rt.index(R.fields, "p_stat") == "*Deceased*") {
							background = "'background-color:#990000;'";
						} else if (rt.index(R.fields, "p_stat") == "*Unconscious*" || rt.index(R.fields, "m_stat") == "*Unstable*") {
							background = "'background-color:#CD6500;'";
						} else if (rt.index(R.fields, "p_stat") == "Physically Unfit" || rt.index(R.fields, "m_stat") == "*Watch*") {
							background = "'background-color:#3BB9FF;'";
						} else {
							background = "'background-color:#4F7529;'";
						}
						dat += fmt("<tr style=＀><td><A href='?src=＃;d_rec=＀'>＀</a></td>", [background, this, rt.index(R.fields, "id"), rt.index(R.fields, "name")]);
						dat += `<td>${rt.index(R.fields, "id")}</td>`;
						dat += `<td><b>F:</b> ${rt.index(R.fields, "fingerprint")}<BR><b>D:</b> ${b_dna}</td>`;
						dat += `<td>${blood_type}</td>`;
						dat += `<td>${rt.index(R.fields, "p_stat")}</td>`;
						dat += `<td>${rt.index(R.fields, "m_stat")}</td></tr>`;
					}
				}
				dat += "</table><hr width='75%' />";
				dat += fmt("<HR><A href='?src=＃;screen=1'>Back</A>", [this]);
			} else if (this.screen === 3) {
				dat += fmt("<B>Records Maintenance</B><HR>\n<A href='?src=＃;back=1'>Backup To Disk</A><BR>\n<A href='?src=＃;u_load=1'>Upload From Disk</A><BR>\n<A href='?src=＃;del_all=1'>Delete All Records</A><BR>\n<BR>\n<A href='?src=＃;screen=1'>Back</A>", [this, this, this, this]);
			} else if (this.screen === 4) {
				dat += "<table><tr><td><b><font size='4'>Medical Record</font></b></td></tr>";
				if (rt.isIn(f, this.active1, GLOB.data_core.general)) {
					if (rt.istype(rt.index(this.active1.fields, "photo_front"), T("/obj/item/weapon/photo"))) {
						P1 = rt.index(this.active1.fields, "photo_front");
						rt.op(f, "BrowseResource", [], [user, P1.img, "photo_front"], false);
					}
					if (rt.istype(rt.index(this.active1.fields, "photo_side"), T("/obj/item/weapon/photo"))) {
						P2 = rt.index(this.active1.fields, "photo_side");
						rt.op(f, "BrowseResource", [], [user, P2.img, "photo_side"], false);
					}
					dat += `<tr><td>Name:</td><td>${rt.index(this.active1.fields, "name")}</td>`;
					dat += fmt("<td><a href='?src=＃;field=show_photo_front'><img src=photo_front height=80 width=80 border=4></a></td>", [this]);
					dat += fmt("<td><a href='?src=＃;field=show_photo_side'><img src=photo_side height=80 width=80 border=4></a></td></tr>", [this]);
					dat += `<tr><td>ID:</td><td>${rt.index(this.active1.fields, "id")}</td></tr>`;
					dat += fmt("<tr><td>Sex:</td><td><A href='?src=＃;field=sex'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active1.fields, "sex")]);
					dat += fmt("<tr><td>Age:</td><td><A href='?src=＃;field=age'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active1.fields, "age")]);
					if (GLOB.config.mutant_races) {
						dat += fmt("<tr><td>Species:</td><td><A href='?src=＃;field=species'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active1.fields, "species")]);
					}
					dat += fmt("<tr><td>Fingerprint:</td><td><A href='?src=＃;field=fingerprint'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active1.fields, "fingerprint")]);
					dat += fmt("<tr><td>Physical Status:</td><td><A href='?src=＃;field=p_stat'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active1.fields, "p_stat")]);
					dat += fmt("<tr><td>Mental Status:</td><td><A href='?src=＃;field=m_stat'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active1.fields, "m_stat")]);
				} else {
					dat += "<tr><td>General Record Lost!</td></tr>";
				}
				dat += "<tr><td><br><b><font size='4'>Medical Data</font></b></td></tr>";
				if (rt.isIn(f, this.active2, GLOB.data_core.medical)) {
					dat += fmt("<tr><td>Blood Type:</td><td><A href='?src=＃;field=blood_type'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active2.fields, "blood_type")]);
					dat += fmt("<tr><td>DNA:</td><td><A href='?src=＃;field=b_dna'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active2.fields, "b_dna")]);
					dat += fmt("<tr><td><br>Minor Disabilities:</td><td><br><A href='?src=＃;field=mi_dis'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active2.fields, "mi_dis")]);
					dat += fmt("<tr><td>Details:</td><td><A href='?src=＃;field=mi_dis_d'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active2.fields, "mi_dis_d")]);
					dat += fmt("<tr><td><br>Major Disabilities:</td><td><br><A href='?src=＃;field=ma_dis'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active2.fields, "ma_dis")]);
					dat += fmt("<tr><td>Details:</td><td><A href='?src=＃;field=ma_dis_d'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active2.fields, "ma_dis_d")]);
					dat += fmt("<tr><td><br>Allergies:</td><td><br><A href='?src=＃;field=alg'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active2.fields, "alg")]);
					dat += fmt("<tr><td>Details:</td><td><A href='?src=＃;field=alg_d'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active2.fields, "alg_d")]);
					dat += fmt("<tr><td><br>Current Diseases:</td><td><br><A href='?src=＃;field=cdi'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active2.fields, "cdi")]);
					dat += fmt("<tr><td>Details:</td><td><A href='?src=＃;field=cdi_d'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active2.fields, "cdi_d")]);
					dat += fmt("<tr><td><br>Important Notes:</td><td><br><A href='?src=＃;field=notes'>&nbsp;＀&nbsp;</A></td></tr>", [this, rt.index(this.active2.fields, "notes")]);
					dat += "<tr><td><br><b><font size='4'>Comments/Log</font></b></td></tr>";
					counter = 1;
					while (rt.index(this.active2.fields, `com_${counter}`)) {
						dat += fmt("<tr><td>＀</td></tr><tr><td><A href='?src=＃;del_c=＀'>Delete Entry</A></td></tr>", [rt.index(this.active2.fields, `com_${counter}`), this, counter]);
						counter++;
					}
					dat += fmt("<tr><td><A href='?src=＃;add_c=1'>Add Entry</A></td></tr>", [this]);
					dat += fmt("<tr><td><br><A href='?src=＃;del_r=1'>Delete Record (Medical Only)</A></td></tr>", [this]);
				} else {
					dat += "<tr><td>Medical Record Lost!</tr>";
					dat += fmt("<tr><td><br><A href='?src=＃;new=1'>New Record</A></td></tr>", [this]);
				}
				dat += fmt("<tr><td><A href='?src=＃;print_p=1'>Print Record</A></td></tr>", [this]);
				dat += fmt("<tr><td><A href='?src=＃;screen=2'>Back</A></td></tr>", [this]);
				dat += "</table>";
			} else if (this.screen === 5) {
				dat += "<CENTER><B>Virus Database</B></CENTER>";
				for (Dt of each(typesof(T("/datum/disease")))) {
					if (rt.istype((Dis = (yield* new_(Dt, 0))), T("/datum/disease/advance"))) {
						continue;
					}
					if (!Dis.desc) {
						continue;
					}
					dat += fmt("<br><a href='?src=＃;vir=＀'>＀</a>", [this, Dt, Dis.name]);
				}
				dat += fmt("<br><a href='?src=＃;screen=1'>Back</a>", [this]);
			} else if (this.screen === 6) {
				dat += "<center><b>Medical Robot Monitor</b></center>";
				dat += fmt("<a href='?src=＃;screen=1'>Back</a>", [this]);
				dat += "<br><b>Medical Robots:</b>";
				for (M of each(GLOB.living_mob_list, T("/mob/living/simple_animal/bot/medbot"))) {
					if (M.z != this.z) {
						continue;
					}
					if (bl = rt.getStep(f, M, 0)) {
						bdat += `${M.name} - <b>[${bl.x},${bl.y}]</b> - ${M.on ? "Online" : "Offline"}<br>`;
						if (M.reagent_glass !== null && M.use_beaker) {
							bdat += `Reservoir: [${M.reagent_glass.reagents.total_volume}/${M.reagent_glass.reagents.maximum_volume}]<br>`;
						} else {
							bdat += "Using Internal Synthesizer.<br>";
						}
					}
				}
				if (!bdat) {
					dat += "<br><center>None detected</center>";
				} else {
					dat += `<br>${bdat}`;
				}
			}
		} else {
			dat += fmt("<A href='?src=＃;login=1'>{Log In}</A>", [this]);
		}
	}
	(popup = (yield* new_(T("/datum/browser"), user, "med_rec", "Medical Records Console", 600, 400))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// medical.dm:201
rt.def("/obj/machinery/computer/med_data/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let I: Value = null, type: Value = null, Dis: Value = null, AfS: Value = null, M: Value = null, a1: Value = null, a2: Value = null, t1: Value = null, _P: Value = null, R: Value = null, a2_0: Value = null, t1_1: Value = null, counter: Value = null, t1_0: Value = null, R_1: Value = null, E: Value = null, _P_0: Value = null, counter_1: Value = null;
	let $e: any;
	f.dot = (yield* parent_proc());
	if (f.dot) {
		return f.dot;
	}
	if (!rt.isIn(f, this.active1, GLOB.data_core.general)) {
		this.active1 = null;
	}
	if (!rt.isIn(f, this.active2, GLOB.data_core.medical)) {
		this.active2 = null;
	}
	if (f.usr.contents.Find(this) || get_dist(this, f.usr) <= 1 && isturf(this.loc) || rt.istype(f.usr, T("/mob/living/silicon")) || IsAdminGhost(f.usr)) {
		yield* f.usr.set_machine(this);
		if (rt.at(href_list, "temp")) {
			this.temp = null;
		}
		if (rt.at(href_list, "scan")) {
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
		} else if (rt.at(href_list, "logout")) {
			this.authenticated = null;
			this.screen = null;
			this.active1 = null;
			this.active2 = null;
		} else if (rt.at(href_list, "choice")) {
			if (rt.at(href_list, "choice") == "Sorting") {
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
			}
		} else if (rt.at(href_list, "login")) {
			if (rt.istype(f.usr, T("/mob/living/silicon"))) {
				this.active1 = null;
				this.active2 = null;
				this.authenticated = 1;
				this.rank = "AI";
				this.screen = 1;
			} else if (IsAdminGhost(f.usr)) {
				this.active1 = null;
				this.active2 = null;
				this.authenticated = 1;
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
		}
		if (this.authenticated) {
			if (rt.at(href_list, "screen")) {
				this.screen = text2num(rt.at(href_list, "screen"));
				if (this.screen < 1) {
					this.screen = 1;
				}
				this.active1 = null;
				this.active2 = null;
			} else if (rt.at(href_list, "vir")) {
				type = text2path(rt.at(href_list, "vir")); if (!ispath(type, T("/datum/disease"))) return f.dot; // tg's own hole: vir= went straight into new(), any type
				Dis = (yield* new_(type, 0));
				AfS = "";
				for (M of each(Dis.viable_mobtypes, T("/mob"))) {
					AfS += ` ${rt.initial(f, M, "name")};`;
				}
				this.temp = `<b>Name:</b> ${Dis.name}\n<BR><b>Number of stages:</b> ${Dis.max_stages}\n<BR><b>Spread:</b> ${Dis.spread_text} Transmission\n<BR><b>Possible Cure:</b> ${(Dis.cure_text || "none")}\n<BR><b>Affected Lifeforms:</b>${AfS}\n<BR>\n<BR><b>Notes:</b> ${Dis.desc}\n<BR>\n<BR><b>Severity:</b> ${Dis.severity}`;
			} else if (rt.at(href_list, "del_all")) {
				this.temp = fmt("Are you sure you wish to delete all records?<br>\n\t<A href='?src=＃;temp=1;del_all2=1'>Yes</A><br>\n\t<A href='?src=＃;temp=1'>No</A><br>", [this, this]);
			} else if (rt.at(href_list, "del_all2")) {
				this.investigate_log(`${f.usr.name} (${f.usr.key}) has deleted all medical records.`, "records");
				GLOB.data_core.medical.Cut();
				this.temp = "All records deleted.";
			} else if (rt.at(href_list, "field")) {
				a1 = this.active1;
				a2 = this.active2;
				const item = rt.at(href_list, "field");
				if (item === "fingerprint") {
					if (this.active1) {
						t1 = (yield* stripped_input("Please input fingerprint hash:", "Med. records", rt.index(this.active1.fields, "fingerprint"), null));
						if (!this.canUseMedicalRecordsConsole(f.usr, t1, a1)) {
							return f.dot;
						}
						rt.setAt(this.active1.fields, "fingerprint", t1);
					}
				} else if (item === "sex") {
					if (this.active1) {
						if (rt.index(this.active1.fields, "sex") == "Male") {
							rt.setAt(this.active1.fields, "sex", "Female");
						} else {
							rt.setAt(this.active1.fields, "sex", "Male");
						}
					}
				} else if (item === "age") {
					if (this.active1) {
						t1 = (yield* g.op(f, "Prompt", [32], [null, rt.index(this.active1.fields, "age"), "Med. records", "Please input age:", null]));
						if (!this.canUseMedicalRecordsConsole(f.usr, t1, a1)) {
							return f.dot;
						}
						rt.setAt(this.active1.fields, "age", t1);
					}
				} else if (item === "species") {
					if (this.active1) {
						t1 = (yield* stripped_input("Please input species name", "Med. records", rt.index(this.active1.fields, "species"), null));
						if (!this.canUseMedicalRecordsConsole(f.usr, t1, a1)) {
							return f.dot;
						}
						rt.setAt(this.active1.fields, "species", t1);
					}
				} else if (item === "mi_dis") {
					if (this.active2) {
						t1 = (yield* stripped_input("Please input minor disabilities list:", "Med. records", rt.index(this.active2.fields, "mi_dis"), null));
						if (!this.canUseMedicalRecordsConsole(f.usr, t1, null, a2)) {
							return f.dot;
						}
						rt.setAt(this.active2.fields, "mi_dis", t1);
					}
				} else if (item === "mi_dis_d") {
					if (this.active2) {
						t1 = (yield* stripped_input("Please summarize minor dis.:", "Med. records", rt.index(this.active2.fields, "mi_dis_d"), null));
						if (!this.canUseMedicalRecordsConsole(f.usr, t1, null, a2)) {
							return f.dot;
						}
						rt.setAt(this.active2.fields, "mi_dis_d", t1);
					}
				} else if (item === "ma_dis") {
					if (this.active2) {
						t1 = (yield* stripped_input("Please input major diabilities list:", "Med. records", rt.index(this.active2.fields, "ma_dis"), null));
						if (!this.canUseMedicalRecordsConsole(f.usr, t1, null, a2)) {
							return f.dot;
						}
						rt.setAt(this.active2.fields, "ma_dis", t1);
					}
				} else if (item === "ma_dis_d") {
					if (this.active2) {
						t1 = (yield* stripped_input("Please summarize major dis.:", "Med. records", rt.index(this.active2.fields, "ma_dis_d"), null));
						if (!this.canUseMedicalRecordsConsole(f.usr, t1, null, a2)) {
							return f.dot;
						}
						rt.setAt(this.active2.fields, "ma_dis_d", t1);
					}
				} else if (item === "alg") {
					if (this.active2) {
						t1 = (yield* stripped_input("Please state allergies:", "Med. records", rt.index(this.active2.fields, "alg"), null));
						if (!this.canUseMedicalRecordsConsole(f.usr, t1, null, a2)) {
							return f.dot;
						}
						rt.setAt(this.active2.fields, "alg", t1);
					}
				} else if (item === "alg_d") {
					if (this.active2) {
						t1 = (yield* stripped_input("Please summarize allergies:", "Med. records", rt.index(this.active2.fields, "alg_d"), null));
						if (!this.canUseMedicalRecordsConsole(f.usr, t1, null, a2)) {
							return f.dot;
						}
						rt.setAt(this.active2.fields, "alg_d", t1);
					}
				} else if (item === "cdi") {
					if (this.active2) {
						t1 = (yield* stripped_input("Please state diseases:", "Med. records", rt.index(this.active2.fields, "cdi"), null));
						if (!this.canUseMedicalRecordsConsole(f.usr, t1, null, a2)) {
							return f.dot;
						}
						rt.setAt(this.active2.fields, "cdi", t1);
					}
				} else if (item === "cdi_d") {
					if (this.active2) {
						t1 = (yield* stripped_input("Please summarize diseases:", "Med. records", rt.index(this.active2.fields, "cdi_d"), null));
						if (!this.canUseMedicalRecordsConsole(f.usr, t1, null, a2)) {
							return f.dot;
						}
						rt.setAt(this.active2.fields, "cdi_d", t1);
					}
				} else if (item === "notes") {
					if (this.active2) {
						t1 = (yield* stripped_input("Please summarize notes:", "Med. records", rt.index(this.active2.fields, "notes"), null));
						if (!this.canUseMedicalRecordsConsole(f.usr, t1, null, a2)) {
							return f.dot;
						}
						rt.setAt(this.active2.fields, "notes", t1);
					}
				} else if (item === "p_stat") {
					if (this.active1) {
						this.temp = fmt("<B>Physical Condition:</B><BR>\n\t<A href='?src=＃;temp=1;p_stat=deceased'>*Deceased*</A><BR>\n\t<A href='?src=＃;temp=1;p_stat=unconscious'>*Unconscious*</A><BR>\n\t<A href='?src=＃;temp=1;p_stat=active'>Active</A><BR>\n\t<A href='?src=＃;temp=1;p_stat=unfit'>Physically Unfit</A><BR>", [this, this, this, this]);
					}
				} else if (item === "m_stat") {
					if (this.active1) {
						this.temp = fmt("<B>Mental Condition:</B><BR>\n\t<A href='?src=＃;temp=1;m_stat=insane'>*Insane*</A><BR>\n\t<A href='?src=＃;temp=1;m_stat=unstable'>*Unstable*</A><BR>\n\t<A href='?src=＃;temp=1;m_stat=watch'>*Watch*</A><BR>\n\t<A href='?src=＃;temp=1;m_stat=stable'>Stable</A><BR>", [this, this, this, this]);
					}
				} else if (item === "blood_type") {
					if (this.active2) {
						this.temp = fmt("<B>Blood Type:</B><BR>\n\t<A href='?src=＃;temp=1;blood_type=an'>A-</A> <A href='?src=＃;temp=1;blood_type=ap'>A+</A><BR>\n\t<A href='?src=＃;temp=1;blood_type=bn'>B-</A> <A href='?src=＃;temp=1;blood_type=bp'>B+</A><BR>\n\t<A href='?src=＃;temp=1;blood_type=abn'>AB-</A> <A href='?src=＃;temp=1;blood_type=abp'>AB+</A><BR>\n\t<A href='?src=＃;temp=1;blood_type=on'>O-</A> <A href='?src=＃;temp=1;blood_type=op'>O+</A><BR>", [this, this, this, this, this, this, this, this]);
					}
				} else if (item === "b_dna") {
					if (this.active2) {
						t1 = (yield* stripped_input("Please input DNA hash:", "Med. records", rt.index(this.active2.fields, "b_dna"), null));
						if (!this.canUseMedicalRecordsConsole(f.usr, t1, null, a2)) {
							return f.dot;
						}
						rt.setAt(this.active2.fields, "b_dna", t1);
					}
				} else if (item === "show_photo_front") {
					if (this.active1) {
						if (rt.index(this.active1.fields, "photo_front")) {
							if (rt.istype(rt.index(this.active1.fields, "photo_front"), T("/obj/item/weapon/photo"))) {
								yield* (_P = rt.index(this.active1.fields, "photo_front")).show(f.usr);
							}
						}
					}
				} else if (item === "show_photo_side") {
					if (this.active1) {
						if (rt.index(this.active1.fields, "photo_side")) {
							if (rt.istype(rt.index(this.active1.fields, "photo_side"), T("/obj/item/weapon/photo"))) {
								yield* (_P = rt.index(this.active1.fields, "photo_side")).show(f.usr);
							}
						}
					}
				}
			} else if (rt.at(href_list, "p_stat")) {
				if (this.active1) {
					const item = rt.at(href_list, "p_stat");
					if (item === "deceased") {
						rt.setAt(this.active1.fields, "p_stat", "*Deceased*");
					} else if (item === "unconscious") {
						rt.setAt(this.active1.fields, "p_stat", "*Unconscious*");
					} else if (item === "active") {
						rt.setAt(this.active1.fields, "p_stat", "Active");
					} else if (item === "unfit") {
						rt.setAt(this.active1.fields, "p_stat", "Physically Unfit");
					}
				}
			} else if (rt.at(href_list, "m_stat")) {
				if (this.active1) {
					const item = rt.at(href_list, "m_stat");
					if (item === "insane") {
						rt.setAt(this.active1.fields, "m_stat", "*Insane*");
					} else if (item === "unstable") {
						rt.setAt(this.active1.fields, "m_stat", "*Unstable*");
					} else if (item === "watch") {
						rt.setAt(this.active1.fields, "m_stat", "*Watch*");
					} else if (item === "stable") {
						rt.setAt(this.active1.fields, "m_stat", "Stable");
					}
				}
			} else if (rt.at(href_list, "blood_type")) {
				if (this.active2) {
					const item = rt.at(href_list, "blood_type");
					if (item === "an") {
						rt.setAt(this.active2.fields, "blood_type", "A-");
					} else if (item === "bn") {
						rt.setAt(this.active2.fields, "blood_type", "B-");
					} else if (item === "abn") {
						rt.setAt(this.active2.fields, "blood_type", "AB-");
					} else if (item === "on") {
						rt.setAt(this.active2.fields, "blood_type", "O-");
					} else if (item === "ap") {
						rt.setAt(this.active2.fields, "blood_type", "A+");
					} else if (item === "bp") {
						rt.setAt(this.active2.fields, "blood_type", "B+");
					} else if (item === "abp") {
						rt.setAt(this.active2.fields, "blood_type", "AB+");
					} else if (item === "op") {
						rt.setAt(this.active2.fields, "blood_type", "O+");
					}
				}
			} else if (rt.at(href_list, "del_r")) {
				if (this.active2) {
					this.temp = fmt("Are you sure you wish to delete the record (Medical Portion Only)?<br>\n\t<A href='?src=＃;temp=1;del_r2=1'>Yes</A><br>\n\t<A href='?src=＃;temp=1'>No</A><br>", [this, this]);
				}
			} else if (rt.at(href_list, "del_r2")) {
				this.investigate_log(`${f.usr.name} (${f.usr.key}) has deleted the medical records for ${rt.index(this.active1.fields, "name")}.`, "records");
				if (this.active2) {
					yield* qdel(this.active2);
					this.active2 = null;
				}
			} else if (rt.at(href_list, "d_rec")) {
				this.active1 = find_record("id", rt.at(href_list, "d_rec"), GLOB.data_core.general);
				if (this.active1) {
					this.active2 = find_record("id", rt.at(href_list, "d_rec"), GLOB.data_core.medical);
				}
				if (!this.active2) {
					this.active1 = null;
				}
				this.screen = 4;
			} else if (rt.at(href_list, "new")) {
				if (rt.istype(this.active1, T("/datum/data/record")) && !rt.istype(this.active2, T("/datum/data/record"))) {
					rt.setAt((R = (yield* new_(T("/datum/data/record")))).fields, "name", rt.index(this.active1.fields, "name"));
					rt.setAt(R.fields, "id", rt.index(this.active1.fields, "id"));
					R.name = `Medical Record #${rt.index(R.fields, "id")}`;
					rt.setAt(R.fields, "blood_type", "Unknown");
					rt.setAt(R.fields, "b_dna", "Unknown");
					rt.setAt(R.fields, "mi_dis", "None");
					rt.setAt(R.fields, "mi_dis_d", "No minor disabilities have been diagnosed.");
					rt.setAt(R.fields, "ma_dis", "None");
					rt.setAt(R.fields, "ma_dis_d", "No major disabilities have been diagnosed.");
					rt.setAt(R.fields, "alg", "None");
					rt.setAt(R.fields, "alg_d", "No allergies have been detected in this patient.");
					rt.setAt(R.fields, "cdi", "None");
					rt.setAt(R.fields, "cdi_d", "No diseases have been diagnosed at the moment.");
					rt.setAt(R.fields, "notes", "No notes.");
					GLOB.data_core.medical += R;
					this.active2 = R;
					this.screen = 4;
				}
			} else if (rt.at(href_list, "add_c")) {
				if (!rt.isIn(f, this.active2, GLOB.data_core.medical)) {
					return f.dot;
				}
				a2_0 = this.active2;
				t1_1 = (yield* stripped_multiline_input("Add Comment:", "Med. records", null, null));
				if (!this.canUseMedicalRecordsConsole(f.usr, t1_1, null, a2_0)) {
					return f.dot;
				}
				counter = 1;
				while (rt.index(this.active2.fields, `com_${counter}`)) {
					counter++;
				}
				rt.setAt(this.active2.fields, `com_${counter}`, `Made by ${this.authenticated} (${this.rank}) on ${worldtime2text()} ${time2text(rt.world().realtime, "MMM DD")}, ${GLOB.year_integer + 540}<BR>${t1_1}`);
			} else if (rt.at(href_list, "del_c")) {
				if (rt.istype(this.active2, T("/datum/data/record")) && rt.index(this.active2.fields, `com_${rt.at(href_list, "del_c")}`)) {
					rt.setAt(this.active2.fields, `com_${rt.at(href_list, "del_c")}`, "<B>Deleted</B>");
				}
			} else if (rt.at(href_list, "search")) {
				t1_0 = (yield* stripped_input(f.usr, "Search String: (Name, DNA, or ID)", "Med. records"));
				if (!this.canUseMedicalRecordsConsole(f.usr, t1_0)) {
					return f.dot;
				}
				this.active1 = null;
				this.active2 = null;
				t1_0 = lowertext(t1_0);
				for (R_1 of each(GLOB.data_core.medical, T("/datum/data/record"))) {
					if (lowertext(rt.index(R_1.fields, "name")) == t1_0 || t1_0 == lowertext(rt.index(R_1.fields, "id")) || t1_0 == lowertext(rt.index(R_1.fields, "b_dna"))) {
						this.active2 = R_1;
					}
				}
				if (!this.active2) {
					this.temp = `Could not locate record ${sanitize(t1_0)}.`;
				} else {
					for (E of each(GLOB.data_core.general, T("/datum/data/record"))) {
						if (rt.index(E.fields, "name") == rt.index(this.active2.fields, "name") || rt.index(E.fields, "id") == rt.index(this.active2.fields, "id")) {
							this.active1 = E;
						}
					}
					this.screen = 4;
				}
			} else if (rt.at(href_list, "print_p")) {
				if (!this.printing) {
					this.printing = 1;
					GLOB.data_core.medicalPrintCount++;
					playsound(this.loc, rt.rsc("sound/items/poster_being_created.ogg"), 100, 1);
					yield* sleep(30);
					(_P_0 = (yield* new_(T("/obj/item/weapon/paper"), this.loc))).info = `<CENTER><B>Medical Record - (MR-${GLOB.data_core.medicalPrintCount})</B></CENTER><BR>`;
					if (rt.isIn(f, this.active1, GLOB.data_core.general)) {
						_P_0.info += `Name: ${rt.index(this.active1.fields, "name")} ID: ${rt.index(this.active1.fields, "id")}<BR>\nSex: ${rt.index(this.active1.fields, "sex")}<BR>\nAge: ${rt.index(this.active1.fields, "age")}<BR>`;
						if (GLOB.config.mutant_races) {
							_P_0.info += `\nSpecies: ${rt.index(this.active1.fields, "species")}<BR>`;
						}
						_P_0.info += `\nFingerprint: ${rt.index(this.active1.fields, "fingerprint")}<BR>\nPhysical Status: ${rt.index(this.active1.fields, "p_stat")}<BR>\nMental Status: ${rt.index(this.active1.fields, "m_stat")}<BR>`;
					} else {
						_P_0.info += "<B>General Record Lost!</B><BR>";
					}
					if (rt.isIn(f, this.active2, GLOB.data_core.medical)) {
						_P_0.info += `<BR>\n<CENTER><B>Medical Data</B></CENTER><BR>\nBlood Type: ${rt.index(this.active2.fields, "blood_type")}<BR>\nDNA: ${rt.index(this.active2.fields, "b_dna")}<BR>\n<BR>\nMinor Disabilities: ${rt.index(this.active2.fields, "mi_dis")}<BR>\nDetails: ${rt.index(this.active2.fields, "mi_dis_d")}<BR>\n<BR>\nMajor Disabilities: ${rt.index(this.active2.fields, "ma_dis")}<BR>\nDetails: ${rt.index(this.active2.fields, "ma_dis_d")}<BR>\n<BR>\nAllergies: ${rt.index(this.active2.fields, "alg")}<BR>\nDetails: ${rt.index(this.active2.fields, "alg_d")}<BR>\n<BR>\nCurrent Diseases: ${rt.index(this.active2.fields, "cdi")} (per disease info placed in log/comment section)<BR>\nDetails: ${rt.index(this.active2.fields, "cdi_d")}<BR>\n<BR>\nImportant Notes:<BR>\n\t${rt.index(this.active2.fields, "notes")}<BR>\n<BR>\n<CENTER><B>Comments/Log</B></CENTER><BR>`;
						counter_1 = 1;
						while (rt.index(this.active2.fields, `com_${counter_1}`)) {
							_P_0.info += `${rt.index(this.active2.fields, `com_${counter_1}`)}<BR>`;
							counter_1++;
						}
						_P_0.name = `MR-${GLOB.data_core.medicalPrintCount} '${rt.index(this.active1.fields, "name")}'`;
					} else {
						_P_0.info += "<B>Medical Record Lost!</B><BR>";
						_P_0.name = `MR-${GLOB.data_core.medicalPrintCount} '${"Record Lost"}'`;
					}
					_P_0.info += "</TT>";
					this.printing = null;
				}
			}
		}
	}
	yield* this.add_fingerprint(f.usr);
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// medical.dm:566
rt.def("/obj/machinery/computer/med_data/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let R: Value = null;
	let $e: any;
	if (!rt.bitAnd(this.stat, 3)) {
		for (R of each(GLOB.data_core.medical, T("/datum/data/record"))) {
			if (prob(10 / severity)) {
				const die = rand(1, 6);
				if (die === 1) {
					if (prob(10)) {
						rt.setAt(R.fields, "name", random_unique_lizard_name(rt.index(R.fields, "sex"), 1));
					} else {
						rt.setAt(R.fields, "name", random_unique_name(rt.index(R.fields, "sex"), 1));
					}
				} else if (die === 2) {
					rt.setAt(R.fields, "sex", pick("Male", "Female"));
				} else if (die === 3) {
					rt.setAt(R.fields, "age", rand(AGE_MIN, AGE_MAX));
				} else if (die === 4) {
					rt.setAt(R.fields, "blood_type", random_blood_type());
				} else if (die === 5) {
					rt.setAt(R.fields, "p_stat", pick("*Unconcious*", "Active", "Physically Unfit"));
				} else if (die === 6) {
					rt.setAt(R.fields, "m_stat", pick("*Insane*", "*Unstable*", "*Watch*", "Stable"));
				}
				continue;
			}
			if (prob(1)) {
				yield* qdel(R);
				continue;
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medical.dm:596
rt.def("/obj/machinery/computer/med_data/proc/canUseMedicalRecordsConsole", function canUseMedicalRecordsConsole(f: Frame, user: Value, message: Value, record1: Value, record2: Value) {
	message ??= 1;
	if (user) {
		if (message) {
			if (this.authenticated) {
				if (user.canUseTopic(this)) {
					if (!record1 || record1 == this.active1) {
						if (!record2 || record2 == this.active2) {
							return 1;
						}
					}
				}
			}
		}
	}
	return 0;
});
