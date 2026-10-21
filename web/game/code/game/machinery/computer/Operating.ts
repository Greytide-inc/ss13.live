// From code/game/machinery/computer/Operating.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10401, "/obj/machinery/computer/operating", "/obj/machinery/computer", {
	patient: null,
	table: null,
	icon_screen: "crew",
	icon_keyboard: "med_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/operating"),
	light_color: "#6496FA",
	name: "operating computer",
	desc: "Used to monitor the vitals of a patient during surgery.",
});

// /obj/machinery/computer/operating/proc/Initialize  (code/game/machinery/computer/Operating.dm:13)  may sleep
rt.def("/obj/machinery/computer/operating/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "find_table");
	return f.dot;
}, true);

// /obj/machinery/computer/operating/proc/find_table  (code/game/machinery/computer/Operating.dm:17)
rt.def("/obj/machinery/computer/operating/proc/find_table", function find_table(f: Frame) {
	let dir: Value = null;
	let $e: any;
	f.vars = () => [dir, $e];
	dir = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		dir = $e;
		rt.setSv(f, "table", rt.locateIn(f, T("/obj/structure/table/optable"), rt.getStep(f, live(f.src), live(dir))));
		if (truthy(rt.sv(f, "table"))) {
			rt.setFv(f, "computer", rt.sv(f, "table"), live(f.src));
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/computer/operating/proc/attack_hand  (code/game/machinery/computer/Operating.dm:25)  may sleep
rt.def("/obj/machinery/computer/operating/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/operating/proc/interact  (code/game/machinery/computer/Operating.dm:30)  may sleep
rt.def("/obj/machinery/computer/operating/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	f.vars = () => [user, dat, popup];
	dat = "";
	if (truthy(rt.sv(f, "table"))) {
		dat = rt.modify(live(dat), "<B>Patient information:</B><BR>", add);
		if (truthy((yield* g.callName(f, rt.sv(f, "table"), "check_patient", [])))) {
			rt.setSv(f, "patient", rt.fv(f, "patient", rt.sv(f, "table")));
			dat = rt.modify(live(dat), (yield* g.srcCall(f, "get_patient_info")), add);
		} else {
			rt.setSv(f, "patient", null);
			dat = rt.modify(live(dat), "<B>No patient detected</B>", add);
		}
	} else {
		dat = rt.modify(live(dat), "<B>Operating table not found.</B>", add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "op", "Operating Computer", 400, 500]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/operating/proc/get_patient_info  (code/game/machinery/computer/Operating.dm:47)  may sleep
rt.def("/obj/machinery/computer/operating/proc/get_patient_info", function* get_patient_info(f: Frame) {
	let dat: Value = null, procedure: Value = null, surgery_step: Value = null;
	let $0: any, $e: any;
	f.vars = () => [dat, procedure, surgery_step, $0, $e];
	if (truthy(rt.fv(f, "stat", rt.sv(f, "patient")))) {
		$0 = "<span class='bad'>Non-Responsive</span>";
	} else {
		$0 = "<span class='good'>Stable</span>";
	}
	dat = fmt("\n\t\t\t\t<div class='statusLabel'>Patient:</div> ＀<BR>\n\t\t\t\t<div class='statusLabel'>Blood Type:</div> ＀\n\n\t\t\t\t<BR>\n\t\t\t\t<div class='line'><div class='statusLabel'>Health:</div><div class='progressBar'><div style='width: ＀%;' class='progressFill good'></div></div><div class='statusValue'>＀%</div></div>\n\t\t\t\t<div class='line'><div class='statusLabel'>> Brute Damage:</div><div class='progressBar'><div style='width: ＀%;' class='progressFill bad'></div></div><div class='statusValue'>＀%</div></div>\n\t\t\t\t<div class='line'><div class='statusLabel'>> Resp. Damage:</div><div class='progressBar'><div style='width: ＀%;' class='progressFill bad'></div></div><div class='statusValue'>＀%</div></div>\n\t\t\t\t<div class='line'><div class='statusLabel'>> Toxin Content:</div><div class='progressBar'><div style='width: ＀%;' class='progressFill bad'></div></div><div class='statusValue'>＀%</div></div>\n\t\t\t\t<div class='line'><div class='statusLabel'>> Burn Severity:</div><div class='progressBar'><div style='width: ＀%;' class='progressFill bad'></div></div><div class='statusValue'>＀%</div></div>\n\n\t\t\t\t", [$0, rt.gv(f, "blood_type", rt.fv(f, "dna", rt.sv(f, "patient"))), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "health", rt.sv(f, "patient")), 0])), rt.fv(f, "health", rt.sv(f, "patient")), (yield* g.call(f, P("/proc/max"), null, [(yield* g.callName(f, rt.sv(f, "patient"), "getBruteLoss", [])), 0])), (yield* g.callName(f, rt.sv(f, "patient"), "getBruteLoss", [])), (yield* g.call(f, P("/proc/max"), null, [(yield* g.callName(f, rt.sv(f, "patient"), "getOxyLoss", [])), 0])), (yield* g.callName(f, rt.sv(f, "patient"), "getOxyLoss", [])), (yield* g.call(f, P("/proc/max"), null, [(yield* g.callName(f, rt.sv(f, "patient"), "getToxLoss", [])), 0])), (yield* g.callName(f, rt.sv(f, "patient"), "getToxLoss", [])), (yield* g.call(f, P("/proc/max"), null, [(yield* g.callName(f, rt.sv(f, "patient"), "getFireLoss", [])), 0])), (yield* g.callName(f, rt.sv(f, "patient"), "getFireLoss", []))]);
	if (truthy(rt.getLen(f, rt.fv(f, "surgeries", rt.sv(f, "patient"))))) {
		dat = rt.modify(live(dat), "<BR><BR><B>Initiated Procedures</B><div class='statusDisplay'>", add);
		procedure = null;
		rt.forList(f, 0, rt.fv(f, "surgeries", rt.sv(f, "patient")), T("/datum/surgery"));
		while (($e = rt.next(f, 0)) !== undefined) {
			procedure = $e;
			dat = rt.modify(live(dat), fmt("＀<BR>", [(yield* g.call(f, P("/proc/capitalize"), null, [rt.fv(f, "name", live(procedure))]))]), add);
			dat = rt.modify(live(dat), fmt("Next step: ＀<BR>", [(yield* g.call(f, P("/proc/capitalize"), null, [rt.gv(f, "name", (surgery_step = (yield* g.callName(f, live(procedure), "get_surgery_step", []))))]))]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</div>", add);
	}
	return live(dat);
}, true);
