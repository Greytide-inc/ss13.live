// Based on /tg/station's code/modules/jobs/jobs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// jobs.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalcommand_positions", function InitGlobalcommand_positions(f: Frame) {
	GLOB.command_positions = list("Captain", "Head of Personnel", "Head of Security", "Chief Engineer", "Research Director", "Chief Medical Officer");
	this.gvars_datum_init_order += "command_positions";
	return f.dot;
});

// jobs.dm:10
rt.def("/datum/controller/global_vars/proc/InitGlobalengineering_positions", function InitGlobalengineering_positions(f: Frame) {
	GLOB.engineering_positions = list("Chief Engineer", "Station Engineer", "Atmospheric Technician");
	this.gvars_datum_init_order += "engineering_positions";
	return f.dot;
});

// jobs.dm:16
rt.def("/datum/controller/global_vars/proc/InitGlobalmedical_positions", function InitGlobalmedical_positions(f: Frame) {
	GLOB.medical_positions = list("Chief Medical Officer", "Medical Doctor", "Geneticist", "Virologist", "Chemist");
	this.gvars_datum_init_order += "medical_positions";
	return f.dot;
});

// jobs.dm:24
rt.def("/datum/controller/global_vars/proc/InitGlobalscience_positions", function InitGlobalscience_positions(f: Frame) {
	GLOB.science_positions = list("Research Director", "Scientist", "Roboticist");
	this.gvars_datum_init_order += "science_positions";
	return f.dot;
});

// jobs.dm:30
rt.def("/datum/controller/global_vars/proc/InitGlobalsupply_positions", function InitGlobalsupply_positions(f: Frame) {
	GLOB.supply_positions = list("Head of Personnel", "Quartermaster", "Cargo Technician", "Shaft Miner");
	this.gvars_datum_init_order += "supply_positions";
	return f.dot;
});

// jobs.dm:37
rt.def("/datum/controller/global_vars/proc/InitGlobalcivilian_positions", function InitGlobalcivilian_positions(f: Frame) {
	GLOB.civilian_positions = list("Bartender", "Botanist", "Cook", "Janitor", "Curator", "Lawyer", "Chaplain", "Clown", "Mime", "Assistant");
	this.gvars_datum_init_order += "civilian_positions";
	return f.dot;
});

// jobs.dm:50
rt.def("/datum/controller/global_vars/proc/InitGlobalsecurity_positions", function InitGlobalsecurity_positions(f: Frame) {
	GLOB.security_positions = list("Head of Security", "Warden", "Detective", "Security Officer");
	this.gvars_datum_init_order += "security_positions";
	return f.dot;
});

// jobs.dm:57
rt.def("/datum/controller/global_vars/proc/InitGlobalnonhuman_positions", function InitGlobalnonhuman_positions(f: Frame) {
	GLOB.nonhuman_positions = list("AI", "Cyborg", "pAI");
	this.gvars_datum_init_order += "nonhuman_positions";
	return f.dot;
});

// jobs.dm:71
rt.def("/proc/get_department_heads", function get_department_heads(f: Frame, job_title: Value) {
	let J: Value = null;
	if (!job_title) {
		return list();
	}
	for (J of each(GLOB.SSjob.occupations, T("/datum/job"))) {
		if (J.title == job_title) {
			return J.department_head;
		}
	}
	return f.dot;
});

// jobs.dm:94
rt.def("/proc/get_full_job_name", function get_full_job_name(f: Frame, job: Value) {
	job = lowertext(job);
	job = GLOB.cap_expand.Replace(job, "captain");
	job = GLOB.cmo_expand.Replace(job, "chief medical officer");
	job = GLOB.hos_expand.Replace(job, "head of security");
	job = GLOB.hop_expand.Replace(job, "head of personnel");
	job = GLOB.rd_expand.Replace(job, "research director");
	job = GLOB.ce_expand.Replace(job, "chief engineer");
	job = GLOB.qm_expand.Replace(job, "quartermaster");
	job = GLOB.sec_expand.Replace(job, "security officer");
	job = GLOB.engi_expand.Replace(job, "station engineer");
	job = GLOB.atmos_expand.Replace(job, "atmospheric technician");
	job = GLOB.doc_expand.Replace(job, "medical doctor");
	job = GLOB.mine_expand.Replace(job, "shaft miner");
	job = GLOB.chef_expand.Replace(job, "cook");
	return (job = GLOB.borg_expand.Replace(job, "cyborg"));
});
