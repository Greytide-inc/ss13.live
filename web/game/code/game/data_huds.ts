// Based on /tg/station's code/game/data_huds.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// data_huds.dm:11
rt.def("/atom/proc/add_to_all_human_data_huds", function add_to_all_human_data_huds(f: Frame) {
	let hud: Value = null;
	for (hud of each(GLOB.huds, T("/datum/atom_hud/data/human"))) {
		hud.add_to_hud(this);
	}
	return f.dot;
});

// data_huds.dm:14
rt.def("/atom/proc/remove_from_all_data_huds", function remove_from_all_data_huds(f: Frame) {
	let hud: Value = null;
	for (hud of each(GLOB.huds, T("/datum/atom_hud/data"))) {
		hud.remove_from_hud(this);
	}
	return f.dot;
});

rt.type(557, "/datum/atom_hud/data/human/medical/basic", "/datum/atom_hud/data/human/medical", {});

// data_huds.dm:24
rt.def("/datum/atom_hud/data/human/medical/basic/proc/check_sensors", function check_sensors(f: Frame, H: Value) {
	let U: Value = null;
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return 0;
	}
	if (!rt.istype((U = H.w_uniform), T("/obj/item/clothing/under"))) {
		return 0;
	}
	if (U.sensor_mode <= SENSOR_VITALS) {
		return 0;
	}
	return 1;
});

// data_huds.dm:31
rt.def("/datum/atom_hud/data/human/medical/basic/proc/add_to_single_hud", function add_to_single_hud(f: Frame, M: Value, H: Value) {
	if (!this.check_sensors(H)) return f.dot;
	parent_proc();
	return f.dot;
}, false);

// data_huds.dm:35
rt.def("/datum/atom_hud/data/human/medical/basic/proc/update_suit_sensors", function update_suit_sensors(f: Frame, H: Value) {
	if (this.check_sensors(H)) {
		this.add_to_hud(H);
	} else {
		this.remove_from_hud(H);
	}
	return f.dot;
});

rt.type(560, "/datum/atom_hud/data/human/security/basic", "/datum/atom_hud/data/human/security", {
	hud_icons: null,
});

// data_huds.dm:42
rt.def("/datum/atom_hud/data/human/security/basic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.hud_icons = list("3");
	return f.dot;
});

// data_huds.dm:65
rt.def("/mob/living/carbon/proc/check_virus", function check_virus(f: Frame) {
	let D: Value = null;
	let threat: Value = 0;
	for (D of each(this.viruses, T("/datum/disease"))) {
		if (!rt.bitAnd(D.visibility_flags, HIDDEN_SCANNER)) {
			if (D.severity != "No threat") {
				return (threat = 2);
			}
			threat = 1;
		}
	}
	return threat;
});

// data_huds.dm:77
rt.def("/proc/RoundHealth", function RoundHealth(f: Frame, M: Value) {
	let resulthealth: Value = null;
	if (M.stat == 2 || rt.bitAnd(M.status_flags, FAKEDEATH)) {
		return "health-100";
	}
	let maxi_health: Value = M.maxHealth;
	if (rt.istype(M, T("/mob/living/carbon")) && M.health < 0) {
		maxi_health = 100;
	}
	const subject = (resulthealth = M.health / maxi_health * 100);
	if (rt.inRange(subject, 100, 1e+31)) {
		return "health100";
	} else if (rt.inRange(subject, 90.625, 100)) {
		return "health93.75";
	} else if (rt.inRange(subject, 84.375, 90.625)) {
		return "health87.5";
	} else if (rt.inRange(subject, 78.125, 84.375)) {
		return "health81.25";
	} else if (rt.inRange(subject, 71.875, 78.125)) {
		return "health75";
	} else if (rt.inRange(subject, 65.625, 71.875)) {
		return "health68.75";
	} else if (rt.inRange(subject, 59.375, 65.625)) {
		return "health62.5";
	} else if (rt.inRange(subject, 53.125, 59.375)) {
		return "health56.25";
	} else if (rt.inRange(subject, 46.875, 53.125)) {
		return "health50";
	} else if (rt.inRange(subject, 40.625, 46.875)) {
		return "health43.75";
	} else if (rt.inRange(subject, 34.375, 40.625)) {
		return "health37.5";
	} else if (rt.inRange(subject, 28.125, 34.375)) {
		return "health31.25";
	} else if (rt.inRange(subject, 21.875, 28.125)) {
		return "health25";
	} else if (rt.inRange(subject, 15.625, 21.875)) {
		return "health18.75";
	} else if (rt.inRange(subject, 9.375, 15.625)) {
		return "health12.5";
	} else if (rt.inRange(subject, 1, 9.375)) {
		return "health6.25";
	} else if (rt.inRange(subject, -50, 1)) {
		return "health0";
	} else if (rt.inRange(subject, -85, -50)) {
		return "health-50";
	} else if (rt.inRange(subject, -99, -85)) {
		return "health-85";
	} else {
		return "health-100";
	}
});

// data_huds.dm:130
rt.def("/mob/living/carbon/proc/update_suit_sensors", function* update_suit_sensors(f: Frame) {
	let B: Value = null, _T: Value = null;
	yield* (B = rt.index(GLOB.huds, DATA_HUD_MEDICAL_BASIC)).update_suit_sensors(this);
	if (!(_T = rt.getStep(f, this, 0))) return f.dot;
	yield* GLOB.crewmonitor.queueUpdate(_T.z);
	return f.dot;
}, true);

// data_huds.dm:139
rt.def("/mob/living/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	let holder: Value = null;
	(holder = rt.at(this.hud_list, "1")).icon_state = `hud${RoundHealth(this)}`;
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	return f.dot;
});

// data_huds.dm:145
rt.def("/mob/living/carbon/proc/med_hud_set_health", function* med_hud_set_health(f: Frame) {
	let _T: Value = null;
	yield* parent_proc();
	if (!(_T = rt.getStep(f, this, 0))) return f.dot;
	yield* GLOB.crewmonitor.queueUpdate(_T.z);
	return f.dot;
}, true);

// data_huds.dm:154
rt.def("/mob/living/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "2");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	if (this.stat == 2 || rt.bitAnd(this.status_flags, FAKEDEATH)) {
		holder.icon_state = "huddead";
	} else {
		holder.icon_state = "hudhealthy";
	}
	return f.dot;
});

// data_huds.dm:163
rt.def("/mob/living/carbon/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "2");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	let virus_state: Value = this.check_virus();
	holder.pixel_y = I.Height() - rt.world().icon_size;
	if (rt.bitAnd(this.status_flags, XENO_HOST)) {
		holder.icon_state = "hudxeno";
	} else if (this.stat == 2 || rt.bitAnd(this.status_flags, FAKEDEATH)) {
		holder.icon_state = "huddead";
	} else if (virus_state == 2) {
		holder.icon_state = "hudill";
	} else if (virus_state == 1) {
		holder.icon_state = "hudbuff";
	} else {
		holder.icon_state = "hudhealthy";
	}
	return f.dot;
});

// data_huds.dm:186
rt.def("/mob/living/carbon/human/proc/sec_hud_set_ID", function* sec_hud_set_ID(f: Frame) {
	let _T: Value = null;
	let holder: Value = rt.at(this.hud_list, "3");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	holder.icon_state = "hudno_id";
	if (this.wear_id) {
		holder.icon_state = `hud${ckey(this.wear_id.GetJobName())}`;
	}
	this.sec_hud_set_security_status();
	if (!(_T = rt.getStep(f, this, 0))) return f.dot;
	yield* GLOB.crewmonitor.queueUpdate(_T.z);
	return f.dot;
}, true);

// data_huds.dm:198
rt.def("/mob/living/carbon/human/proc/sec_hud_set_implants", function sec_hud_set_implants(f: Frame) {
	let holder: Value = null, i: Value = null, I: Value = null, IC: Value = null;
	for (i of each(list("7", "5", "6"))) {
		(holder = rt.index(this.hud_list, i)).icon_state = null;
	}
	for (I of each(this.implants, T("/obj/item/weapon/implant"))) {
		if (rt.istype(I, T("/obj/item/weapon/implant/tracking"))) {
			holder = rt.at(this.hud_list, "7");
			IC = icon(this.icon, this.icon_state, this.dir);
			holder.pixel_y = IC.Height() - rt.world().icon_size;
			holder.icon_state = "hud_imp_tracking";
		} else if (rt.istype(I, T("/obj/item/weapon/implant/mindshield"))) {
			holder = rt.at(this.hud_list, "5");
			IC = icon(this.icon, this.icon_state, this.dir);
			holder.pixel_y = IC.Height() - rt.world().icon_size;
			holder.icon_state = "hud_imp_loyal";
		} else if (rt.istype(I, T("/obj/item/weapon/implant/chem"))) {
			holder = rt.at(this.hud_list, "6");
			IC = icon(this.icon, this.icon_state, this.dir);
			holder.pixel_y = IC.Height() - rt.world().icon_size;
			holder.icon_state = "hud_imp_chem";
		}
	}
	return f.dot;
});

// data_huds.dm:220
rt.def("/mob/living/carbon/human/proc/sec_hud_set_security_status", function sec_hud_set_security_status(f: Frame) {
	let perpname: Value = null, R: Value = null;
	let holder: Value = rt.at(this.hud_list, "4");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	if ((perpname = this.get_face_name(this.get_id_name(""))) && GLOB.data_core) {
		if (R = find_record("name", perpname, GLOB.data_core.security)) {
			const criminal = rt.index(R.fields, "criminal");
			if (criminal === "*Arrest*") {
				holder.icon_state = "hudwanted";
				return f.dot;
			} else if (criminal === "Incarcerated") {
				holder.icon_state = "hudincarcerated";
				return f.dot;
			} else if (criminal === "Parolled") {
				holder.icon_state = "hudparolled";
				return f.dot;
			} else if (criminal === "Discharged") {
				holder.icon_state = "huddischarged";
				return f.dot;
			}
		}
	}
	holder.icon_state = null;
	return f.dot;
});

// data_huds.dm:247
rt.def("/proc/RoundDiagBar", function RoundDiagBar(f: Frame, value: Value) {
	const subject = value * 100;
	if (rt.inRange(subject, 95, 1e+31)) {
		return "max";
	} else if (rt.inRange(subject, 80, 100)) {
		return "good";
	} else if (rt.inRange(subject, 60, 80)) {
		return "high";
	} else if (rt.inRange(subject, 40, 60)) {
		return "med";
	} else if (rt.inRange(subject, 20, 40)) {
		return "low";
	} else if (rt.inRange(subject, 1, 20)) {
		return "crit";
	} else {
		return "dead";
	}
});

// data_huds.dm:267
rt.def("/mob/living/silicon/proc/diag_hud_set_health", function diag_hud_set_health(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "9");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	if (this.stat == 2) {
		holder.icon_state = "huddiagdead";
	} else {
		holder.icon_state = `huddiag${RoundDiagBar(this.health / this.maxHealth)}`;
	}
	return f.dot;
});

// data_huds.dm:276
rt.def("/mob/living/silicon/proc/diag_hud_set_status", function diag_hud_set_status(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "8");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	if (this.stat === 0) {
		holder.icon_state = "hudstat";
	} else if (this.stat === 1) {
		holder.icon_state = "hudoffline";
	} else {
		holder.icon_state = "huddead2";
	}
	return f.dot;
});

// data_huds.dm:289
rt.def("/mob/living/silicon/robot/proc/diag_hud_set_borgcell", function diag_hud_set_borgcell(f: Frame) {
	let chargelvl: Value = null;
	let holder: Value = rt.at(this.hud_list, "10");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	if (this.cell) {
		chargelvl = this.cell.charge / this.cell.maxcharge;
		holder.icon_state = `hudbatt${RoundDiagBar(chargelvl)}`;
	} else {
		holder.icon_state = "hudnobatt";
	}
	return f.dot;
});

// data_huds.dm:300
rt.def("/mob/living/silicon/robot/proc/diag_hud_set_aishell", function diag_hud_set_aishell(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "13");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	if (!this.shell) {
		holder.icon_state = null;
	} else if (this.deployed) {
		holder.icon_state = "hudtrackingai";
	} else {
		holder.icon_state = "hudtracking";
	}
	return f.dot;
});

// data_huds.dm:312
rt.def("/mob/living/silicon/ai/proc/diag_hud_set_deployed", function diag_hud_set_deployed(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "13");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	if (!this.deployed_shell) {
		holder.icon_state = null;
	} else {
		holder.icon_state = "hudtrackingai";
	}
	return f.dot;
});

// data_huds.dm:324
rt.def("/obj/mecha/proc/diag_hud_set_mechhealth", function diag_hud_set_mechhealth(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "11");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	holder.icon_state = `huddiag${RoundDiagBar(this.obj_integrity / this.max_integrity)}`;
	return f.dot;
});

// data_huds.dm:331
rt.def("/obj/mecha/proc/diag_hud_set_mechcell", function diag_hud_set_mechcell(f: Frame) {
	let chargelvl: Value = null;
	let holder: Value = rt.at(this.hud_list, "10");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	if (this.cell) {
		chargelvl = this.cell.charge / this.cell.maxcharge;
		holder.icon_state = `hudbatt${RoundDiagBar(chargelvl)}`;
	} else {
		holder.icon_state = "hudnobatt";
	}
	return f.dot;
});

// data_huds.dm:342
rt.def("/obj/mecha/proc/diag_hud_set_mechstat", function diag_hud_set_mechstat(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "8");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	holder.icon_state = null;
	if (!this.internal_damage) return f.dot;
	holder.icon_state = "hudwarn";
	return f.dot;
});

// data_huds.dm:350
rt.def("/obj/mecha/proc/diag_hud_set_mechtracking", function diag_hud_set_mechtracking(f: Frame) {
	let new_icon_state: Value = null, _T: Value = null;
	let holder: Value = rt.at(this.hud_list, "13");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	for (_T of each(this.trackers, T("/obj/item/mecha_parts/mecha_tracking"))) {
		if (_T.ai_beacon) {
			new_icon_state = "hudtrackingai";
			break;
		}
		new_icon_state = "hudtracking";
	}
	holder.icon_state = new_icon_state;
	return f.dot;
});

// data_huds.dm:366
rt.def("/mob/living/simple_animal/bot/proc/diag_hud_set_bothealth", function diag_hud_set_bothealth(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "9");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	holder.icon_state = `huddiag${RoundDiagBar(this.health / this.maxHealth)}`;
	return f.dot;
});

// data_huds.dm:372
rt.def("/mob/living/simple_animal/bot/proc/diag_hud_set_botstat", function diag_hud_set_botstat(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "8");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	if (this.on) {
		holder.icon_state = "hudstat";
	} else if (this.stat) {
		holder.icon_state = "hudoffline";
	} else {
		holder.icon_state = "huddead2";
	}
	return f.dot;
});

// data_huds.dm:383
rt.def("/mob/living/simple_animal/bot/proc/diag_hud_set_botmode", function diag_hud_set_botmode(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "12");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	if (this.client) {
		holder.icon_state = "hudsentient";
		return f.dot;
	}
	if (this.mode === BOT_SUMMON || this.mode === BOT_RESPONDING) {
		holder.icon_state = "hudcalled";
	} else if (this.mode === BOT_CLEANING || this.mode === BOT_REPAIRING || this.mode === BOT_HEALING) {
		holder.icon_state = "hudworking";
	} else if (this.mode === BOT_PATROL || this.mode === BOT_START_PATROL) {
		holder.icon_state = "hudpatrol";
	} else if (this.mode === BOT_PREP_ARREST || this.mode === BOT_ARREST || this.mode === BOT_HUNT) {
		holder.icon_state = "hudalert";
	} else if (this.mode === BOT_MOVING || this.mode === BOT_DELIVER || this.mode === BOT_GO_HOME || this.mode === BOT_NAV) {
		holder.icon_state = "hudmove";
	} else {
		holder.icon_state = "";
	}
	return f.dot;
});

// data_huds.dm:408
rt.def("/obj/machinery/door/airlock/proc/diag_hud_set_electrified", function diag_hud_set_electrified(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "14");
	if (this.secondsElectrified != 0) {
		holder.icon_state = "electrified";
	} else {
		holder.icon_state = "";
	}
	return f.dot;
});
