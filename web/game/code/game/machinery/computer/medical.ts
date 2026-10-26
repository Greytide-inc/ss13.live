// From code/game/machinery/computer/medical.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/computer/med_data/proc/attackby  (code/game/machinery/computer/medical.dm:26)  may sleep
rt.def("/obj/machinery/computer/med_data/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0)) && !truthy(rt.sv(f, "scan")))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		rt.setSv(f, "scan", live(f.args[0]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀.</span>", [live(f.args[0])])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/computer/med_data/proc/attack_hand  (code/game/machinery/computer/medical.dm:36)  may sleep
rt.def("/obj/machinery/computer/med_data/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, R: Value = null, blood_type: Value = null, b_dna: Value = null, E: Value = null, background: Value = null, P1: Value = null, P2: Value = null, counter: Value = null, Dt: Value = null, Dis: Value = null, bdat: Value = null, M: Value = null, bl: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [dat, R, blood_type, b_dna, E, background, P1, P2, counter, Dt, Dis, bdat, M, bl, popup, $0, $1, $2, $3, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	dat = null;
	if (truthy(rt.fv(f, "temp", live(f.src)))) {
		dat = fmt("<TT>＀</TT><BR><BR><A href='?src=＃;temp=1'>Clear Screen</A>", [rt.fv(f, "temp", live(f.src)), live(f.src)]);
	} else {
		$0 = live(f.src);
		if (truthy(rt.fv(f, "scan", live(f.src)))) {
			$1 = fmt("＀", [rt.gv(f, "name", rt.fv(f, "scan", live(f.src)))]);
		} else {
			$1 = "----------";
		}
		dat = fmt("Confirm Identity: <A href='?src=＃;scan=1'>＀</A><HR>", [$0, $1]);
		if (truthy(rt.fv(f, "authenticated", live(f.src)))) {
			$0 = rt.fv(f, "screen", live(f.src));
			if ($0 === 1) {
				dat = rt.modify(live(dat), fmt("\n<A href='?src=＃;search=1'>Search Records</A>\n<BR><A href='?src=＃;screen=2'>List Records</A>\n<BR>\n<BR><A href='?src=＃;screen=5'>Virus Database</A>\n<BR><A href='?src=＃;screen=6'>Medbot Tracking</A>\n<BR>\n<BR><A href='?src=＃;screen=3'>Record Maintenance</A>\n<BR><A href='?src=＃;logout=1'>{Log Out}</A><BR>\n", [live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src)]), add);
			} else if ($0 === 2) {
				dat = rt.modify(live(dat), fmt("\n</p>\n<table style=\"text-align:center;\" cellspacing=\"0\" width=\"100%\">\n<tr>\n<th>Records:</th>\n</tr>\n</table>\n<table style=\"text-align:center;\" border=\"1\" cellspacing=\"0\" width=\"100%\">\n<tr>\n<th><A href='?src=＃;choice=Sorting;sort=name'>Name</A></th>\n<th><A href='?src=＃;choice=Sorting;sort=id'>ID</A></th>\n<th>Fingerprints (F) | DNA (D)</th>\n<th><A href='?src=＃;choice=Sorting;sort=bloodtype'>Blood Type</A></th>\n<th>Physical Status</th>\n<th>Mental Status</th>\n</tr>", [live(f.src), live(f.src), live(f.src)]), add);
				if (rt.fv(f, "general", rt.gl("data_core")) !== null) {
					R = null;
					rt.forList(f, 0, (yield* g.call(f, P("/proc/sortRecord"), null, [rt.fv(f, "general", rt.gl("data_core")), rt.sv(f, "sortBy"), rt.sv(f, "order")])), T("/datum/data/record"));
					while (($e = rt.next(f, 0)) !== undefined) {
						R = $e;
						blood_type = "";
						b_dna = "";
						E = null;
						rt.forList(f, 1, rt.fv(f, "medical", rt.gl("data_core")), T("/datum/data/record"));
						while (($e = rt.next(f, 1)) !== undefined) {
							E = $e;
							if ((isEqual(rt.index(rt.fv(f, "fields", live(E)), "name"), rt.index(rt.fv(f, "fields", live(R)), "name")) && isEqual(rt.index(rt.fv(f, "fields", live(E)), "id"), rt.index(rt.fv(f, "fields", live(R)), "id")))) {
								blood_type = rt.index(rt.fv(f, "fields", live(E)), "blood_type");
								b_dna = rt.index(rt.fv(f, "fields", live(E)), "b_dna");
							}
						}
						rt.endFor(f, 1);
						background = null;
						if ((isEqual(rt.index(rt.fv(f, "fields", live(R)), "m_stat"), "*Insane*") || isEqual(rt.index(rt.fv(f, "fields", live(R)), "p_stat"), "*Deceased*"))) {
							background = "'background-color:#990000;'";
						} else {
							if ((isEqual(rt.index(rt.fv(f, "fields", live(R)), "p_stat"), "*Unconscious*") || isEqual(rt.index(rt.fv(f, "fields", live(R)), "m_stat"), "*Unstable*"))) {
								background = "'background-color:#CD6500;'";
							} else {
								if ((isEqual(rt.index(rt.fv(f, "fields", live(R)), "p_stat"), "Physically Unfit") || isEqual(rt.index(rt.fv(f, "fields", live(R)), "m_stat"), "*Watch*"))) {
									background = "'background-color:#3BB9FF;'";
								} else {
									background = "'background-color:#4F7529;'";
								}
							}
						}
						dat = rt.modify(live(dat), fmt("<tr style=＀><td><A href='?src=＃;d_rec=＀'>＀</a></td>", [live(background), live(f.src), rt.index(rt.fv(f, "fields", live(R)), "id"), rt.index(rt.fv(f, "fields", live(R)), "name")]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.index(rt.fv(f, "fields", live(R)), "id")]), add);
						dat = rt.modify(live(dat), fmt("<td><b>F:</b> ＀<BR><b>D:</b> ＀</td>", [rt.index(rt.fv(f, "fields", live(R)), "fingerprint"), live(b_dna)]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td>", [live(blood_type)]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.index(rt.fv(f, "fields", live(R)), "p_stat")]), add);
						dat = rt.modify(live(dat), fmt("<td>＀</td></tr>", [rt.index(rt.fv(f, "fields", live(R)), "m_stat")]), add);
					}
					rt.endFor(f, 0);
				}
				dat = rt.modify(live(dat), "</table><hr width='75%' />", add);
				dat = rt.modify(live(dat), fmt("<HR><A href='?src=＃;screen=1'>Back</A>", [live(f.src)]), add);
			} else if ($0 === 3) {
				dat = rt.modify(live(dat), fmt("<B>Records Maintenance</B><HR>\n<A href='?src=＃;back=1'>Backup To Disk</A><BR>\n<A href='?src=＃;u_load=1'>Upload From Disk</A><BR>\n<A href='?src=＃;del_all=1'>Delete All Records</A><BR>\n<BR>\n<A href='?src=＃;screen=1'>Back</A>", [live(f.src), live(f.src), live(f.src), live(f.src)]), add);
			} else if ($0 === 4) {
				dat = rt.modify(live(dat), "<table><tr><td><b><font size='4'>Medical Record</font></b></td></tr>", add);
				if (truthy((rt.isIn(f, rt.sv(f, "active1"), rt.fv(f, "general", rt.gl("data_core"))) ? 1 : 0))) {
					if (truthy((rt.istype(rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_front"), T("/obj/item/weapon/photo")) ? 1 : 0))) {
						P1 = rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_front");
						rt.op(f, "BrowseResource", [], [live(f.args[0]), rt.fv(f, "img", live(P1)), "photo_front"], false);
					}
					if (truthy((rt.istype(rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_side"), T("/obj/item/weapon/photo")) ? 1 : 0))) {
						P2 = rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_side");
						rt.op(f, "BrowseResource", [], [live(f.args[0]), rt.fv(f, "img", live(P2)), "photo_side"], false);
					}
					dat = rt.modify(live(dat), fmt("<tr><td>Name:</td><td>＀</td>", [rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name")]), add);
					dat = rt.modify(live(dat), fmt("<td><a href='?src=＃;field=show_photo_front'><img src=photo_front height=80 width=80 border=4></a></td>", [live(f.src)]), add);
					dat = rt.modify(live(dat), fmt("<td><a href='?src=＃;field=show_photo_side'><img src=photo_side height=80 width=80 border=4></a></td></tr>", [live(f.src)]), add);
					dat = rt.modify(live(dat), fmt("<tr><td>ID:</td><td>＀</td></tr>", [rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "id")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td>Sex:</td><td><A href='?src=＃;field=sex'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "sex")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td>Age:</td><td><A href='?src=＃;field=age'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "age")]), add);
					if (truthy(rt.fv(f, "mutant_races", rt.gl("config")))) {
						dat = rt.modify(live(dat), fmt("<tr><td>Species:</td><td><A href='?src=＃;field=species'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "species")]), add);
					}
					dat = rt.modify(live(dat), fmt("<tr><td>Fingerprint:</td><td><A href='?src=＃;field=fingerprint'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "fingerprint")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td>Physical Status:</td><td><A href='?src=＃;field=p_stat'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "p_stat")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td>Mental Status:</td><td><A href='?src=＃;field=m_stat'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "m_stat")]), add);
				} else {
					dat = rt.modify(live(dat), "<tr><td>General Record Lost!</td></tr>", add);
				}
				dat = rt.modify(live(dat), "<tr><td><br><b><font size='4'>Medical Data</font></b></td></tr>", add);
				if (truthy((rt.isIn(f, rt.sv(f, "active2"), rt.fv(f, "medical", rt.gl("data_core"))) ? 1 : 0))) {
					dat = rt.modify(live(dat), fmt("<tr><td>Blood Type:</td><td><A href='?src=＃;field=blood_type'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "blood_type")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td>DNA:</td><td><A href='?src=＃;field=b_dna'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "b_dna")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td><br>Minor Disabilities:</td><td><br><A href='?src=＃;field=mi_dis'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "mi_dis")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td>Details:</td><td><A href='?src=＃;field=mi_dis_d'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "mi_dis_d")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td><br>Major Disabilities:</td><td><br><A href='?src=＃;field=ma_dis'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "ma_dis")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td>Details:</td><td><A href='?src=＃;field=ma_dis_d'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "ma_dis_d")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td><br>Allergies:</td><td><br><A href='?src=＃;field=alg'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "alg")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td>Details:</td><td><A href='?src=＃;field=alg_d'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "alg_d")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td><br>Current Diseases:</td><td><br><A href='?src=＃;field=cdi'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "cdi")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td>Details:</td><td><A href='?src=＃;field=cdi_d'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "cdi_d")]), add);
					dat = rt.modify(live(dat), fmt("<tr><td><br>Important Notes:</td><td><br><A href='?src=＃;field=notes'>&nbsp;＀&nbsp;</A></td></tr>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), "notes")]), add);
					dat = rt.modify(live(dat), "<tr><td><br><b><font size='4'>Comments/Log</font></b></td></tr>", add);
					counter = 1;
					while (truthy(rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), fmt("com_＀", [live(counter)])))) {
						dat = rt.modify(live(dat), fmt("<tr><td>＀</td></tr><tr><td><A href='?src=＃;del_c=＀'>Delete Entry</A></td></tr>", [rt.index(rt.fv(f, "fields", rt.sv(f, "active2")), fmt("com_＀", [live(counter)])), live(f.src), live(counter)]), add);
						counter = rt.inc(live(counter), 1);
					}
					dat = rt.modify(live(dat), fmt("<tr><td><A href='?src=＃;add_c=1'>Add Entry</A></td></tr>", [live(f.src)]), add);
					dat = rt.modify(live(dat), fmt("<tr><td><br><A href='?src=＃;del_r=1'>Delete Record (Medical Only)</A></td></tr>", [live(f.src)]), add);
				} else {
					dat = rt.modify(live(dat), "<tr><td>Medical Record Lost!</tr>", add);
					dat = rt.modify(live(dat), fmt("<tr><td><br><A href='?src=＃;new=1'>New Record</A></td></tr>", [live(f.src)]), add);
				}
				dat = rt.modify(live(dat), fmt("<tr><td><A href='?src=＃;print_p=1'>Print Record</A></td></tr>", [live(f.src)]), add);
				dat = rt.modify(live(dat), fmt("<tr><td><A href='?src=＃;screen=2'>Back</A></td></tr>", [live(f.src)]), add);
				dat = rt.modify(live(dat), "</table>", add);
			} else if ($0 === 5) {
				dat = rt.modify(live(dat), "<CENTER><B>Virus Database</B></CENTER>", add);
				Dt = null;
				rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, [T("/datum/disease")])));
				while (($e = rt.next(f, 0)) !== undefined) {
					Dt = $e;
					if (truthy((rt.istype((Dis = (yield* g.new_(f, live(Dt), [0]))), T("/datum/disease/advance")) ? 1 : 0))) {
						continue;
					}
					if (!truthy(rt.fv(f, "desc", live(Dis)))) {
						continue;
					}
					dat = rt.modify(live(dat), fmt("<br><a href='?src=＃;vir=＀'>＀</a>", [live(f.src), live(Dt), rt.fv(f, "name", live(Dis))]), add);
				}
				rt.endFor(f, 0);
				dat = rt.modify(live(dat), fmt("<br><a href='?src=＃;screen=1'>Back</a>", [live(f.src)]), add);
			} else if ($0 === 6) {
				dat = rt.modify(live(dat), "<center><b>Medical Robot Monitor</b></center>", add);
				dat = rt.modify(live(dat), fmt("<a href='?src=＃;screen=1'>Back</a>", [live(f.src)]), add);
				dat = rt.modify(live(dat), "<br><b>Medical Robots:</b>", add);
				bdat = null;
				M = null;
				rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/simple_animal/bot/medbot"));
				while (($e = rt.next(f, 0)) !== undefined) {
					M = $e;
					if (!isEqual(rt.fv(f, "z", live(M)), rt.fv(f, "z", live(f.src)))) {
						continue;
					}
					if (truthy((bl = rt.getStep(f, live(M), 0)))) {
						$0 = rt.fv(f, "name", live(M));
						$1 = rt.fv(f, "x", live(bl));
						$2 = rt.fv(f, "y", live(bl));
						if (truthy(rt.fv(f, "on", live(M)))) {
							$3 = "Online";
						} else {
							$3 = "Offline";
						}
						bdat = rt.modify(live(bdat), fmt("＀ - <b>[＀,＀]</b> - ＀<br>", [$0, $1, $2, $3]), add);
						if ((rt.fv(f, "reagent_glass", live(M)) !== null && truthy(rt.fv(f, "use_beaker", live(M))))) {
							bdat = rt.modify(live(bdat), fmt("Reservoir: [＀/＀]<br>", [rt.gv(f, "total_volume", rt.gv(f, "reagents", rt.fv(f, "reagent_glass", live(M)))), rt.gv(f, "maximum_volume", rt.gv(f, "reagents", rt.fv(f, "reagent_glass", live(M))))]), add);
						} else {
							bdat = rt.modify(live(bdat), "Using Internal Synthesizer.<br>", add);
						}
					}
				}
				rt.endFor(f, 0);
				if (!truthy(live(bdat))) {
					dat = rt.modify(live(dat), "<br><center>None detected</center>", add);
				} else {
					dat = rt.modify(live(dat), fmt("<br>＀", [live(bdat)]), add);
				}
			}
		} else {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;login=1'>{Log In}</A>", [live(f.src)]), add);
		}
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "med_rec", "Medical Records Console", 600, 400]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/computer/med_data/proc/Topic  (code/game/machinery/computer/medical.dm:201)  may sleep
rt.def("/obj/machinery/computer/med_data/proc/Topic", function* Topic(f: Frame) {
	let I: Value = null, type: Value = null, Dis: Value = null, AfS: Value = null, M: Value = null, a1: Value = null, a2: Value = null, t1: Value = null, _P: Value = null, R: Value = null, a2_0: Value = null, t1_1: Value = null, counter: Value = null, t1_0: Value = null, R_1: Value = null, E: Value = null, _P_0: Value = null, counter_1: Value = null;
	let $0: any, $e: any;
	f.vars = () => [I, type, Dis, AfS, M, a1, a2, t1, _P, R, a2_0, t1_1, counter, t1_0, R_1, E, _P_0, counter_1, $0, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, rt.sv(f, "active1"), rt.fv(f, "general", rt.gl("data_core"))) ? 1 : 0))) {
		rt.setFv(f, "active1", live(f.src), null);
	}
	if (!truthy((rt.isIn(f, rt.sv(f, "active2"), rt.fv(f, "medical", rt.gl("data_core"))) ? 1 : 0))) {
		rt.setFv(f, "active2", live(f.src), null);
	}
	if ((((truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)]))) || (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)]))))) {
		yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
		if (truthy(rt.at(live(f.args[1]), "temp"))) {
			rt.setFv(f, "temp", live(f.src), null);
		}
		if (truthy(rt.at(live(f.args[1]), "scan"))) {
			if (truthy(rt.fv(f, "scan", live(f.src)))) {
				if ((truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy((yield* g.callName(f, live(f.usr), "get_active_held_item", []))))) {
					yield* g.callName(f, live(f.usr), "put_in_hands", [rt.sv(f, "scan")]);
				} else {
					rt.setFv(f, "loc", rt.sv(f, "scan"), rt.getStep(f, live(f.src), 0));
				}
				rt.setFv(f, "scan", live(f.src), null);
			} else {
				if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
					if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
						return live(f.dot);
					}
					rt.setFv(f, "loc", live(I), live(f.src));
					rt.setFv(f, "scan", live(f.src), live(I));
				}
			}
		} else {
			if (truthy(rt.at(live(f.args[1]), "logout"))) {
				rt.setFv(f, "authenticated", live(f.src), null);
				rt.setFv(f, "screen", live(f.src), null);
				rt.setFv(f, "active1", live(f.src), null);
				rt.setFv(f, "active2", live(f.src), null);
			} else {
				if (truthy(rt.at(live(f.args[1]), "choice"))) {
					if (isEqual(rt.at(live(f.args[1]), "choice"), "Sorting")) {
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
					}
				} else {
					if (truthy(rt.at(live(f.args[1]), "login"))) {
						if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) {
							rt.setFv(f, "active1", live(f.src), null);
							rt.setFv(f, "active2", live(f.src), null);
							rt.setFv(f, "authenticated", live(f.src), 1);
							rt.setFv(f, "rank", live(f.src), "AI");
							rt.setFv(f, "screen", live(f.src), 1);
						} else {
							if (truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)])))) {
								rt.setFv(f, "active1", live(f.src), null);
								rt.setFv(f, "active2", live(f.src), null);
								rt.setFv(f, "authenticated", live(f.src), 1);
								rt.setFv(f, "rank", live(f.src), "Central Command");
								rt.setFv(f, "screen", live(f.src), 1);
							} else {
								if (truthy((rt.istype(rt.fv(f, "scan", live(f.src)), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
									rt.setFv(f, "active1", live(f.src), null);
									rt.setFv(f, "active2", live(f.src), null);
									if (truthy((yield* g.callName(f, live(f.src), "check_access", [rt.fv(f, "scan", live(f.src))])))) {
										rt.setFv(f, "authenticated", live(f.src), rt.gv(f, "registered_name", rt.fv(f, "scan", live(f.src))));
										rt.setFv(f, "rank", live(f.src), rt.gv(f, "assignment", rt.fv(f, "scan", live(f.src))));
										rt.setFv(f, "screen", live(f.src), 1);
									}
								}
							}
						}
					}
				}
			}
		}
		if (truthy(rt.fv(f, "authenticated", live(f.src)))) {
			if (truthy(rt.at(live(f.args[1]), "screen"))) {
				rt.setFv(f, "screen", live(f.src), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "screen")])));
				if (rt.lt(rt.fv(f, "screen", live(f.src)), 1)) {
					rt.setFv(f, "screen", live(f.src), 1);
				}
				rt.setFv(f, "active1", live(f.src), null);
				rt.setFv(f, "active2", live(f.src), null);
			} else {
				if (truthy(rt.at(live(f.args[1]), "vir"))) {
					type = (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "vir")])); if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [live(type), T("/datum/disease")])))) return f.dot; // tg's own hole: vir= went straight into new(), any type
					Dis = (yield* g.new_(f, live(type), [0]));
					AfS = "";
					M = null;
					rt.forList(f, 0, rt.fv(f, "viable_mobtypes", live(Dis)), T("/mob"));
					while (($e = rt.next(f, 0)) !== undefined) {
						M = $e;
						AfS = rt.modify(live(AfS), fmt(" ＀;", [rt.initial(f, live(M), "name")]), add);
					}
					rt.endFor(f, 0);
					rt.setFv(f, "temp", live(f.src), fmt("<b>Name:</b> ＀\n<BR><b>Number of stages:</b> ＀\n<BR><b>Spread:</b> ＀ Transmission\n<BR><b>Possible Cure:</b> ＀\n<BR><b>Affected Lifeforms:</b>＀\n<BR>\n<BR><b>Notes:</b> ＀\n<BR>\n<BR><b>Severity:</b> ＀", [rt.fv(f, "name", live(Dis)), rt.fv(f, "max_stages", live(Dis)), rt.fv(f, "spread_text", live(Dis)), (rt.fv(f, "cure_text", live(Dis)) || "none"), live(AfS), rt.fv(f, "desc", live(Dis)), rt.fv(f, "severity", live(Dis))]));
				} else {
					if (truthy(rt.at(live(f.args[1]), "del_all"))) {
						rt.setFv(f, "temp", live(f.src), fmt("Are you sure you wish to delete all records?<br>\n\t<A href='?src=＃;temp=1;del_all2=1'>Yes</A><br>\n\t<A href='?src=＃;temp=1'>No</A><br>", [live(f.src), live(f.src)]));
					} else {
						if (truthy(rt.at(live(f.args[1]), "del_all2"))) {
							yield* g.srcCall(f, "investigate_log", fmt("＀ (＀) has deleted all medical records.", [rt.fv(f, "name", live(f.usr)), rt.fv(f, "key", live(f.usr))]), "records");
							yield* g.callName(f, rt.fv(f, "medical", rt.gl("data_core")), "Cut", []);
							rt.setFv(f, "temp", live(f.src), "All records deleted.");
						} else {
							if (truthy(rt.at(live(f.args[1]), "field"))) {
								a1 = rt.fv(f, "active1", live(f.src));
								a2 = rt.fv(f, "active2", live(f.src));
								$0 = rt.at(live(f.args[1]), "field");
								if ($0 === "fingerprint") {
									if (truthy(rt.sv(f, "active1"))) {
										t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please input fingerprint hash:", "Med. records", rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "fingerprint"), null]));
										if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1), live(a1))))) {
											return live(f.dot);
										}
										rt.setAt(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "fingerprint", live(t1));
									}
								} else if ($0 === "sex") {
									if (truthy(rt.sv(f, "active1"))) {
										if (isEqual(rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "sex"), "Male")) {
											rt.setAt(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "sex", "Female");
										} else {
											rt.setAt(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "sex", "Male");
										}
									}
								} else if ($0 === "age") {
									if (truthy(rt.sv(f, "active1"))) {
										t1 = (yield* g.op(f, "Prompt", [32], [null, rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "age"), "Med. records", "Please input age:", null]));
										if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1), live(a1))))) {
											return live(f.dot);
										}
										rt.setAt(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "age", live(t1));
									}
								} else if ($0 === "species") {
									if (truthy(rt.sv(f, "active1"))) {
										t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please input species name", "Med. records", rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "species"), null]));
										if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1), live(a1))))) {
											return live(f.dot);
										}
										rt.setAt(rt.fv(f, "fields", rt.sv(f, "active1")), "species", live(t1));
									}
								} else if ($0 === "mi_dis") {
									if (truthy(rt.sv(f, "active2"))) {
										t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please input minor disabilities list:", "Med. records", rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "mi_dis"), null]));
										if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1), null, live(a2))))) {
											return live(f.dot);
										}
										rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "mi_dis", live(t1));
									}
								} else if ($0 === "mi_dis_d") {
									if (truthy(rt.sv(f, "active2"))) {
										t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please summarize minor dis.:", "Med. records", rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "mi_dis_d"), null]));
										if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1), null, live(a2))))) {
											return live(f.dot);
										}
										rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "mi_dis_d", live(t1));
									}
								} else if ($0 === "ma_dis") {
									if (truthy(rt.sv(f, "active2"))) {
										t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please input major diabilities list:", "Med. records", rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "ma_dis"), null]));
										if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1), null, live(a2))))) {
											return live(f.dot);
										}
										rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "ma_dis", live(t1));
									}
								} else if ($0 === "ma_dis_d") {
									if (truthy(rt.sv(f, "active2"))) {
										t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please summarize major dis.:", "Med. records", rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "ma_dis_d"), null]));
										if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1), null, live(a2))))) {
											return live(f.dot);
										}
										rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "ma_dis_d", live(t1));
									}
								} else if ($0 === "alg") {
									if (truthy(rt.sv(f, "active2"))) {
										t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please state allergies:", "Med. records", rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "alg"), null]));
										if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1), null, live(a2))))) {
											return live(f.dot);
										}
										rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "alg", live(t1));
									}
								} else if ($0 === "alg_d") {
									if (truthy(rt.sv(f, "active2"))) {
										t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please summarize allergies:", "Med. records", rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "alg_d"), null]));
										if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1), null, live(a2))))) {
											return live(f.dot);
										}
										rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "alg_d", live(t1));
									}
								} else if ($0 === "cdi") {
									if (truthy(rt.sv(f, "active2"))) {
										t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please state diseases:", "Med. records", rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "cdi"), null]));
										if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1), null, live(a2))))) {
											return live(f.dot);
										}
										rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "cdi", live(t1));
									}
								} else if ($0 === "cdi_d") {
									if (truthy(rt.sv(f, "active2"))) {
										t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please summarize diseases:", "Med. records", rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "cdi_d"), null]));
										if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1), null, live(a2))))) {
											return live(f.dot);
										}
										rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "cdi_d", live(t1));
									}
								} else if ($0 === "notes") {
									if (truthy(rt.sv(f, "active2"))) {
										t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please summarize notes:", "Med. records", rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "notes"), null]));
										if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1), null, live(a2))))) {
											return live(f.dot);
										}
										rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "notes", live(t1));
									}
								} else if ($0 === "p_stat") {
									if (truthy(rt.sv(f, "active1"))) {
										rt.setFv(f, "temp", live(f.src), fmt("<B>Physical Condition:</B><BR>\n\t<A href='?src=＃;temp=1;p_stat=deceased'>*Deceased*</A><BR>\n\t<A href='?src=＃;temp=1;p_stat=unconscious'>*Unconscious*</A><BR>\n\t<A href='?src=＃;temp=1;p_stat=active'>Active</A><BR>\n\t<A href='?src=＃;temp=1;p_stat=unfit'>Physically Unfit</A><BR>", [live(f.src), live(f.src), live(f.src), live(f.src)]));
									}
								} else if ($0 === "m_stat") {
									if (truthy(rt.sv(f, "active1"))) {
										rt.setFv(f, "temp", live(f.src), fmt("<B>Mental Condition:</B><BR>\n\t<A href='?src=＃;temp=1;m_stat=insane'>*Insane*</A><BR>\n\t<A href='?src=＃;temp=1;m_stat=unstable'>*Unstable*</A><BR>\n\t<A href='?src=＃;temp=1;m_stat=watch'>*Watch*</A><BR>\n\t<A href='?src=＃;temp=1;m_stat=stable'>Stable</A><BR>", [live(f.src), live(f.src), live(f.src), live(f.src)]));
									}
								} else if ($0 === "blood_type") {
									if (truthy(rt.sv(f, "active2"))) {
										rt.setFv(f, "temp", live(f.src), fmt("<B>Blood Type:</B><BR>\n\t<A href='?src=＃;temp=1;blood_type=an'>A-</A> <A href='?src=＃;temp=1;blood_type=ap'>A+</A><BR>\n\t<A href='?src=＃;temp=1;blood_type=bn'>B-</A> <A href='?src=＃;temp=1;blood_type=bp'>B+</A><BR>\n\t<A href='?src=＃;temp=1;blood_type=abn'>AB-</A> <A href='?src=＃;temp=1;blood_type=abp'>AB+</A><BR>\n\t<A href='?src=＃;temp=1;blood_type=on'>O-</A> <A href='?src=＃;temp=1;blood_type=op'>O+</A><BR>", [live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src)]));
									}
								} else if ($0 === "b_dna") {
									if (truthy(rt.sv(f, "active2"))) {
										t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please input DNA hash:", "Med. records", rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "b_dna"), null]));
										if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1), null, live(a2))))) {
											return live(f.dot);
										}
										rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "b_dna", live(t1));
									}
								} else if ($0 === "show_photo_front") {
									if (truthy(rt.sv(f, "active1"))) {
										if (truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_front"))) {
											if (truthy((rt.istype(rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_front"), T("/obj/item/weapon/photo")) ? 1 : 0))) {
												yield* g.callName(f, (_P = rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_front")), "show", [live(f.usr)]);
											}
										}
									}
								} else if ($0 === "show_photo_side") {
									if (truthy(rt.sv(f, "active1"))) {
										if (truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_side"))) {
											if (truthy((rt.istype(rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_side"), T("/obj/item/weapon/photo")) ? 1 : 0))) {
												yield* g.callName(f, (_P = rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "photo_side")), "show", [live(f.usr)]);
											}
										}
									}
								}
							} else {
								if (truthy(rt.at(live(f.args[1]), "p_stat"))) {
									if (truthy(rt.sv(f, "active1"))) {
										$0 = rt.at(live(f.args[1]), "p_stat");
										if ($0 === "deceased") {
											rt.setAt(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "p_stat", "*Deceased*");
										} else if ($0 === "unconscious") {
											rt.setAt(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "p_stat", "*Unconscious*");
										} else if ($0 === "active") {
											rt.setAt(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "p_stat", "Active");
										} else if ($0 === "unfit") {
											rt.setAt(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "p_stat", "Physically Unfit");
										}
									}
								} else {
									if (truthy(rt.at(live(f.args[1]), "m_stat"))) {
										if (truthy(rt.sv(f, "active1"))) {
											$0 = rt.at(live(f.args[1]), "m_stat");
											if ($0 === "insane") {
												rt.setAt(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "m_stat", "*Insane*");
											} else if ($0 === "unstable") {
												rt.setAt(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "m_stat", "*Unstable*");
											} else if ($0 === "watch") {
												rt.setAt(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "m_stat", "*Watch*");
											} else if ($0 === "stable") {
												rt.setAt(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "m_stat", "Stable");
											}
										}
									} else {
										if (truthy(rt.at(live(f.args[1]), "blood_type"))) {
											if (truthy(rt.sv(f, "active2"))) {
												$0 = rt.at(live(f.args[1]), "blood_type");
												if ($0 === "an") {
													rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "blood_type", "A-");
												} else if ($0 === "bn") {
													rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "blood_type", "B-");
												} else if ($0 === "abn") {
													rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "blood_type", "AB-");
												} else if ($0 === "on") {
													rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "blood_type", "O-");
												} else if ($0 === "ap") {
													rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "blood_type", "A+");
												} else if ($0 === "bp") {
													rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "blood_type", "B+");
												} else if ($0 === "abp") {
													rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "blood_type", "AB+");
												} else if ($0 === "op") {
													rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "blood_type", "O+");
												}
											}
										} else {
											if (truthy(rt.at(live(f.args[1]), "del_r"))) {
												if (truthy(rt.sv(f, "active2"))) {
													rt.setFv(f, "temp", live(f.src), fmt("Are you sure you wish to delete the record (Medical Portion Only)?<br>\n\t<A href='?src=＃;temp=1;del_r2=1'>Yes</A><br>\n\t<A href='?src=＃;temp=1'>No</A><br>", [live(f.src), live(f.src)]));
												}
											} else {
												if (truthy(rt.at(live(f.args[1]), "del_r2"))) {
													yield* g.srcCall(f, "investigate_log", fmt("＀ (＀) has deleted the medical records for ＀.", [rt.fv(f, "name", live(f.usr)), rt.fv(f, "key", live(f.usr)), rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "name")]), "records");
													if (truthy(rt.sv(f, "active2"))) {
														yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "active2")]);
														rt.setSv(f, "active2", null);
													}
												} else {
													if (truthy(rt.at(live(f.args[1]), "d_rec"))) {
														rt.setSv(f, "active1", (yield* g.call(f, P("/proc/find_record"), null, ["id", rt.at(live(f.args[1]), "d_rec"), rt.fv(f, "general", rt.gl("data_core"))])));
														if (truthy(rt.sv(f, "active1"))) {
															rt.setSv(f, "active2", (yield* g.call(f, P("/proc/find_record"), null, ["id", rt.at(live(f.args[1]), "d_rec"), rt.fv(f, "medical", rt.gl("data_core"))])));
														}
														if (!truthy(rt.sv(f, "active2"))) {
															rt.setSv(f, "active1", null);
														}
														rt.setSv(f, "screen", 4);
													} else {
														if (truthy(rt.at(live(f.args[1]), "new"))) {
															if ((truthy((rt.istype(rt.fv(f, "active1", live(f.src)), T("/datum/data/record")) ? 1 : 0)) && !truthy((rt.istype(rt.fv(f, "active2", live(f.src)), T("/datum/data/record")) ? 1 : 0)))) {
																rt.setAt(rt.gv(f, "fields", (R = (yield* g.new_(f, T("/datum/data/record"), [])))), "name", rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "name"));
																rt.setAt(rt.fv(f, "fields", live(R)), "id", rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "id"));
																rt.setFv(f, "name", live(R), fmt("Medical Record #＀", [rt.index(rt.fv(f, "fields", live(R)), "id")]));
																rt.setAt(rt.fv(f, "fields", live(R)), "blood_type", "Unknown");
																rt.setAt(rt.fv(f, "fields", live(R)), "b_dna", "Unknown");
																rt.setAt(rt.fv(f, "fields", live(R)), "mi_dis", "None");
																rt.setAt(rt.fv(f, "fields", live(R)), "mi_dis_d", "No minor disabilities have been diagnosed.");
																rt.setAt(rt.fv(f, "fields", live(R)), "ma_dis", "None");
																rt.setAt(rt.fv(f, "fields", live(R)), "ma_dis_d", "No major disabilities have been diagnosed.");
																rt.setAt(rt.fv(f, "fields", live(R)), "alg", "None");
																rt.setAt(rt.fv(f, "fields", live(R)), "alg_d", "No allergies have been detected in this patient.");
																rt.setAt(rt.fv(f, "fields", live(R)), "cdi", "None");
																rt.setAt(rt.fv(f, "fields", live(R)), "cdi_d", "No diseases have been diagnosed at the moment.");
																rt.setAt(rt.fv(f, "fields", live(R)), "notes", "No notes.");
																rt.modField(f, rt.gl("data_core"), "medical", live(R), add);
																rt.setFv(f, "active2", live(f.src), live(R));
																rt.setFv(f, "screen", live(f.src), 4);
															}
														} else {
															if (truthy(rt.at(live(f.args[1]), "add_c"))) {
																if (!truthy((rt.isIn(f, rt.sv(f, "active2"), rt.fv(f, "medical", rt.gl("data_core"))) ? 1 : 0))) {
																	return live(f.dot);
																}
																a2_0 = rt.fv(f, "active2", live(f.src));
																t1_1 = (yield* g.call(f, P("/proc/stripped_multiline_input"), null, ["Add Comment:", "Med. records", null, null]));
																if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1_1), null, live(a2_0))))) {
																	return live(f.dot);
																}
																counter = 1;
																while (truthy(rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), fmt("com_＀", [live(counter)])))) {
																	counter = rt.inc(live(counter), 1);
																}
																rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), fmt("com_＀", [live(counter)]), fmt("Made by ＀ (＀) on ＀ ＀, ＀<BR>＀", [rt.fv(f, "authenticated", live(f.src)), rt.fv(f, "rank", live(f.src)), (yield* g.call(f, P("/proc/worldtime2text"), null, [])), (yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "realtime", rt.world()), "MMM DD"])), add(rt.gl("year_integer"), 540), live(t1_1)]));
															} else {
																if (truthy(rt.at(live(f.args[1]), "del_c"))) {
																	if ((truthy((rt.istype(rt.fv(f, "active2", live(f.src)), T("/datum/data/record")) ? 1 : 0)) && truthy(rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), fmt("com_＀", [rt.at(live(f.args[1]), "del_c")]))))) {
																		rt.setAt(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), fmt("com_＀", [rt.at(live(f.args[1]), "del_c")]), "<B>Deleted</B>");
																	}
																} else {
																	if (truthy(rt.at(live(f.args[1]), "search"))) {
																		t1_0 = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Search String: (Name, DNA, or ID)", "Med. records"]));
																		if (!truthy((yield* g.srcCall(f, "canUseMedicalRecordsConsole", live(f.usr), live(t1_0))))) {
																			return live(f.dot);
																		}
																		rt.setFv(f, "active1", live(f.src), null);
																		rt.setFv(f, "active2", live(f.src), null);
																		t1_0 = (yield* g.call(f, P("/proc/lowertext"), null, [live(t1_0)]));
																		R_1 = null;
																		rt.forList(f, 0, rt.fv(f, "medical", rt.gl("data_core")), T("/datum/data/record"));
																		while (($e = rt.next(f, 0)) !== undefined) {
																			R_1 = $e;
																			if (((isEqual((yield* g.call(f, P("/proc/lowertext"), null, [rt.index(rt.fv(f, "fields", live(R_1)), "name")])), live(t1_0)) || isEqual(live(t1_0), (yield* g.call(f, P("/proc/lowertext"), null, [rt.index(rt.fv(f, "fields", live(R_1)), "id")])))) || isEqual(live(t1_0), (yield* g.call(f, P("/proc/lowertext"), null, [rt.index(rt.fv(f, "fields", live(R_1)), "b_dna")]))))) {
																				rt.setFv(f, "active2", live(f.src), live(R_1));
																			}
																		}
																		rt.endFor(f, 0);
																		if (!truthy(rt.fv(f, "active2", live(f.src)))) {
																			rt.setFv(f, "temp", live(f.src), fmt("Could not locate record ＀.", [(yield* g.call(f, P("/proc/sanitize"), null, [live(t1_0)]))]));
																		} else {
																			E = null;
																			rt.forList(f, 0, rt.fv(f, "general", rt.gl("data_core")), T("/datum/data/record"));
																			while (($e = rt.next(f, 0)) !== undefined) {
																				E = $e;
																				if ((isEqual(rt.index(rt.fv(f, "fields", live(E)), "name"), rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "name")) || isEqual(rt.index(rt.fv(f, "fields", live(E)), "id"), rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "id")))) {
																					rt.setFv(f, "active1", live(f.src), live(E));
																				}
																			}
																			rt.endFor(f, 0);
																			rt.setFv(f, "screen", live(f.src), 4);
																		}
																	} else {
																		if (truthy(rt.at(live(f.args[1]), "print_p"))) {
																			if (!truthy(rt.fv(f, "printing", live(f.src)))) {
																				rt.setFv(f, "printing", live(f.src), 1);
																				rt.incField(f, rt.gl("data_core"), "medicalPrintCount", 1, true);
																				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/poster_being_created.ogg"), 100, 1]);
																				yield* g.call(f, P("/proc/sleep"), null, [30]);
																				rt.setFv(f, "info", (_P_0 = (yield* g.new_(f, T("/obj/item/weapon/paper"), [rt.fv(f, "loc", live(f.src))]))), fmt("<CENTER><B>Medical Record - (MR-＀)</B></CENTER><BR>", [rt.fv(f, "medicalPrintCount", rt.gl("data_core"))]));
																				if (truthy((rt.isIn(f, rt.sv(f, "active1"), rt.fv(f, "general", rt.gl("data_core"))) ? 1 : 0))) {
																					rt.modField(f, live(_P_0), "info", fmt("Name: ＀ ID: ＀<BR>\nSex: ＀<BR>\nAge: ＀<BR>", [rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "name"), rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "id"), rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "sex"), rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "age")]), add);
																					if (truthy(rt.fv(f, "mutant_races", rt.gl("config")))) {
																						rt.modField(f, live(_P_0), "info", fmt("\nSpecies: ＀<BR>", [rt.index(rt.fv(f, "fields", rt.sv(f, "active1")), "species")]), add);
																					}
																					rt.modField(f, live(_P_0), "info", fmt("\nFingerprint: ＀<BR>\nPhysical Status: ＀<BR>\nMental Status: ＀<BR>", [rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "fingerprint"), rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "p_stat"), rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "m_stat")]), add);
																				} else {
																					rt.modField(f, live(_P_0), "info", "<B>General Record Lost!</B><BR>", add);
																				}
																				if (truthy((rt.isIn(f, rt.sv(f, "active2"), rt.fv(f, "medical", rt.gl("data_core"))) ? 1 : 0))) {
																					rt.modField(f, live(_P_0), "info", fmt("<BR>\n<CENTER><B>Medical Data</B></CENTER><BR>\nBlood Type: ＀<BR>\nDNA: ＀<BR>\n<BR>\nMinor Disabilities: ＀<BR>\nDetails: ＀<BR>\n<BR>\nMajor Disabilities: ＀<BR>\nDetails: ＀<BR>\n<BR>\nAllergies: ＀<BR>\nDetails: ＀<BR>\n<BR>\nCurrent Diseases: ＀ (per disease info placed in log/comment section)<BR>\nDetails: ＀<BR>\n<BR>\nImportant Notes:<BR>\n\t＀<BR>\n<BR>\n<CENTER><B>Comments/Log</B></CENTER><BR>", [rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "blood_type"), rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "b_dna"), rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "mi_dis"), rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "mi_dis_d"), rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "ma_dis"), rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "ma_dis_d"), rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "alg"), rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "alg_d"), rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "cdi"), rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "cdi_d"), rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), "notes")]), add);
																					counter_1 = 1;
																					while (truthy(rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), fmt("com_＀", [live(counter_1)])))) {
																						rt.modField(f, live(_P_0), "info", fmt("＀<BR>", [rt.index(rt.gv(f, "fields", rt.fv(f, "active2", live(f.src))), fmt("com_＀", [live(counter_1)]))]), add);
																						counter_1 = rt.inc(live(counter_1), 1);
																					}
																					rt.setFv(f, "name", live(_P_0), fmt("MR-＀ '＀'", [rt.fv(f, "medicalPrintCount", rt.gl("data_core")), rt.index(rt.gv(f, "fields", rt.fv(f, "active1", live(f.src))), "name")]));
																				} else {
																					rt.modField(f, live(_P_0), "info", "<B>Medical Record Lost!</B><BR>", add);
																					rt.setFv(f, "name", live(_P_0), fmt("MR-＀ '＀'", [rt.fv(f, "medicalPrintCount", rt.gl("data_core")), "Record Lost"]));
																				}
																				rt.modField(f, live(_P_0), "info", "</TT>", add);
																				rt.setFv(f, "printing", live(f.src), null);
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/med_data/proc/emp_act  (code/game/machinery/computer/medical.dm:566)  may sleep
rt.def("/obj/machinery/computer/med_data/proc/emp_act", function* emp_act(f: Frame) {
	let R: Value = null;
	let $0: any, $e: any;
	f.vars = () => [R, $0, $e];
	if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		R = null;
		rt.forList(f, 0, rt.fv(f, "medical", rt.gl("data_core")), T("/datum/data/record"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			if (truthy(rt.op(f, "Prob", [], [divide(10, live(f.args[0]))]))) {
				$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 6]));
				if ($0 === 1) {
					if (truthy(rt.op(f, "Prob", [], [10]))) {
						rt.setAt(rt.fv(f, "fields", live(R)), "name", (yield* g.call(f, P("/proc/random_unique_lizard_name"), null, [rt.index(rt.fv(f, "fields", live(R)), "sex"), 1])));
					} else {
						rt.setAt(rt.fv(f, "fields", live(R)), "name", (yield* g.call(f, P("/proc/random_unique_name"), null, [rt.index(rt.fv(f, "fields", live(R)), "sex"), 1])));
					}
				} else if ($0 === 2) {
					rt.setAt(rt.fv(f, "fields", live(R)), "sex", rt.op(f, "PickUnweighted", [2], ["Male", "Female"]));
				} else if ($0 === 3) {
					rt.setAt(rt.fv(f, "fields", live(R)), "age", (yield* g.call(f, P("/proc/rand"), null, [17, 85])));
				} else if ($0 === 4) {
					rt.setAt(rt.fv(f, "fields", live(R)), "blood_type", (yield* g.call(f, P("/proc/random_blood_type"), null, [])));
				} else if ($0 === 5) {
					rt.setAt(rt.fv(f, "fields", live(R)), "p_stat", rt.op(f, "PickUnweighted", [3], ["*Unconcious*", "Active", "Physically Unfit"]));
				} else if ($0 === 6) {
					rt.setAt(rt.fv(f, "fields", live(R)), "m_stat", rt.op(f, "PickUnweighted", [4], ["*Insane*", "*Unstable*", "*Watch*", "Stable"]));
				}
				continue;
			}
			if (truthy(rt.op(f, "Prob", [], [1]))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
				continue;
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/computer/med_data/proc/canUseMedicalRecordsConsole  (code/game/machinery/computer/medical.dm:596)
rt.def("/obj/machinery/computer/med_data/proc/canUseMedicalRecordsConsole", function canUseMedicalRecordsConsole(f: Frame, user: Value, message: Value, record1: Value, record2: Value) {
	f.vars = () => [message];
	if (live(message) === null) {
		message = 1;
	}
	if (truthy(live(user))) {
		if (truthy(live(message))) {
			if (truthy(rt.sv(f, "authenticated"))) {
				if (truthy(rt.callName(f, live(user), "canUseTopic", [live(f.src)]))) {
					if ((!truthy(live(record1)) || isEqual(live(record1), rt.sv(f, "active1")))) {
						if ((!truthy(live(record2)) || isEqual(live(record2), rt.sv(f, "active2")))) {
							return 1;
						}
					}
				}
			}
		}
	}
	return 0;
});
