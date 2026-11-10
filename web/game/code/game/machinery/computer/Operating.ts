// Based on /tg/station's code/game/machinery/computer/Operating.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// Operating.dm:13
rt.def("/obj/machinery/computer/operating/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.find_table();
	return f.dot;
}, true);

// Operating.dm:17
rt.def("/obj/machinery/computer/operating/proc/find_table", function find_table(f: Frame) {
	let dir: Value = null;
	for (dir of each(GLOB.cardinal)) {
		this.table = rt.locateIn(f, T("/obj/structure/table/optable"), rt.getStep(f, this, dir));
		if (this.table) {
			this.table.computer = this;
			break;
		}
	}
	return f.dot;
});

// Operating.dm:25
rt.def("/obj/machinery/computer/operating/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// Operating.dm:30
rt.def("/obj/machinery/computer/operating/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	let dat: Value = "";
	if (this.table) {
		dat += "<B>Patient information:</B><BR>";
		if (this.table.check_patient()) {
			this.patient = this.table.patient;
			dat += (yield* this.get_patient_info());
		} else {
			this.patient = null;
			dat += "<B>No patient detected</B>";
		}
	} else {
		dat += "<B>Operating table not found.</B>";
	}
	(popup = (yield* new_(T("/datum/browser"), user, "op", "Operating Computer", 400, 500))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// Operating.dm:47
rt.def("/obj/machinery/computer/operating/proc/get_patient_info", function* get_patient_info(f: Frame) {
	let procedure: Value = null, surgery_step: Value = null;
	let $0: any, $e: any;
	if (this.patient.stat) {
		$0 = "<span class='bad'>Non-Responsive</span>";
	} else {
		$0 = "<span class='good'>Stable</span>";
	}
	let dat: Value = `\n\t\t\t\t<div class='statusLabel'>Patient:</div> ${$0}<BR>\n\t\t\t\t<div class='statusLabel'>Blood Type:</div> ${this.patient.dna.blood_type}\n\n\t\t\t\t<BR>\n\t\t\t\t<div class='line'><div class='statusLabel'>Health:</div><div class='progressBar'><div style='width: ${max(this.patient.health, 0)}%;' class='progressFill good'></div></div><div class='statusValue'>${this.patient.health}%</div></div>\n\t\t\t\t<div class='line'><div class='statusLabel'>> Brute Damage:</div><div class='progressBar'><div style='width: ${max(this.patient.getBruteLoss(), 0)}%;' class='progressFill bad'></div></div><div class='statusValue'>${this.patient.getBruteLoss()}%</div></div>\n\t\t\t\t<div class='line'><div class='statusLabel'>> Resp. Damage:</div><div class='progressBar'><div style='width: ${max(this.patient.getOxyLoss(), 0)}%;' class='progressFill bad'></div></div><div class='statusValue'>${this.patient.getOxyLoss()}%</div></div>\n\t\t\t\t<div class='line'><div class='statusLabel'>> Toxin Content:</div><div class='progressBar'><div style='width: ${max(this.patient.getToxLoss(), 0)}%;' class='progressFill bad'></div></div><div class='statusValue'>${this.patient.getToxLoss()}%</div></div>\n\t\t\t\t<div class='line'><div class='statusLabel'>> Burn Severity:</div><div class='progressBar'><div style='width: ${max(this.patient.getFireLoss(), 0)}%;' class='progressFill bad'></div></div><div class='statusValue'>${this.patient.getFireLoss()}%</div></div>\n\n\t\t\t\t`;
	if (rt.len(f, this.patient.surgeries)) {
		dat += "<BR><BR><B>Initiated Procedures</B><div class='statusDisplay'>";
		for (procedure of each(this.patient.surgeries, T("/datum/surgery"))) {
			dat += `${capitalize(procedure.name)}<BR>`;
			dat += `Next step: ${capitalize((surgery_step = (yield* procedure.get_surgery_step())).name)}<BR>`;
		}
		dat += "</div>";
	}
	return dat;
}, true);
