// From code/modules/jobs/jobs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalcommand_positions  (code/modules/jobs/jobs.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalcommand_positions", function InitGlobalcommand_positions(f: Frame) {
	rt.setGl("command_positions", rt.list("Captain", "Head of Personnel", "Head of Security", "Chief Engineer", "Research Director", "Chief Medical Officer"));
	rt.modSrcVar(f, "gvars_datum_init_order", "command_positions", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalengineering_positions  (code/modules/jobs/jobs.dm:10)
rt.def("/datum/controller/global_vars/proc/InitGlobalengineering_positions", function InitGlobalengineering_positions(f: Frame) {
	rt.setGl("engineering_positions", rt.list("Chief Engineer", "Station Engineer", "Atmospheric Technician"));
	rt.modSrcVar(f, "gvars_datum_init_order", "engineering_positions", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmedical_positions  (code/modules/jobs/jobs.dm:16)
rt.def("/datum/controller/global_vars/proc/InitGlobalmedical_positions", function InitGlobalmedical_positions(f: Frame) {
	rt.setGl("medical_positions", rt.list("Chief Medical Officer", "Medical Doctor", "Geneticist", "Virologist", "Chemist"));
	rt.modSrcVar(f, "gvars_datum_init_order", "medical_positions", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalscience_positions  (code/modules/jobs/jobs.dm:24)
rt.def("/datum/controller/global_vars/proc/InitGlobalscience_positions", function InitGlobalscience_positions(f: Frame) {
	rt.setGl("science_positions", rt.list("Research Director", "Scientist", "Roboticist"));
	rt.modSrcVar(f, "gvars_datum_init_order", "science_positions", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsupply_positions  (code/modules/jobs/jobs.dm:30)
rt.def("/datum/controller/global_vars/proc/InitGlobalsupply_positions", function InitGlobalsupply_positions(f: Frame) {
	rt.setGl("supply_positions", rt.list("Head of Personnel", "Quartermaster", "Cargo Technician", "Shaft Miner"));
	rt.modSrcVar(f, "gvars_datum_init_order", "supply_positions", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalcivilian_positions  (code/modules/jobs/jobs.dm:37)
rt.def("/datum/controller/global_vars/proc/InitGlobalcivilian_positions", function InitGlobalcivilian_positions(f: Frame) {
	rt.setGl("civilian_positions", rt.list("Bartender", "Botanist", "Cook", "Janitor", "Curator", "Lawyer", "Chaplain", "Clown", "Mime", "Assistant"));
	rt.modSrcVar(f, "gvars_datum_init_order", "civilian_positions", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsecurity_positions  (code/modules/jobs/jobs.dm:50)
rt.def("/datum/controller/global_vars/proc/InitGlobalsecurity_positions", function InitGlobalsecurity_positions(f: Frame) {
	rt.setGl("security_positions", rt.list("Head of Security", "Warden", "Detective", "Security Officer"));
	rt.modSrcVar(f, "gvars_datum_init_order", "security_positions", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalnonhuman_positions  (code/modules/jobs/jobs.dm:57)
rt.def("/datum/controller/global_vars/proc/InitGlobalnonhuman_positions", function InitGlobalnonhuman_positions(f: Frame) {
	rt.setGl("nonhuman_positions", rt.list("AI", "Cyborg", "pAI"));
	rt.modSrcVar(f, "gvars_datum_init_order", "nonhuman_positions", add);
	return f.dot;
});

// /proc/get_department_heads  (code/modules/jobs/jobs.dm:71)
rt.def("/proc/get_department_heads", function get_department_heads(f: Frame, job_title: Value) {
	let J: Value = null;
	let $e: any;
	f.vars = () => [J, $e];
	if (!truthy(live(job_title))) {
		return rt.list();
	}
	J = null;
	rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
	while (($e = rt.next(f, 0)) !== undefined) {
		J = $e;
		if (isEqual(rt.fv(f, "title", live(J)), live(job_title))) {
			return rt.fv(f, "department_head", live(J));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/get_full_job_name  (code/modules/jobs/jobs.dm:94)
rt.def("/proc/get_full_job_name", function get_full_job_name(f: Frame, job: Value) {
	f.vars = () => [job];
	job = rt.call(f, P("/proc/lowertext"), null, [live(job)]);
	job = rt.callName(f, rt.gl("cap_expand"), "Replace", [live(job), "captain"]);
	job = rt.callName(f, rt.gl("cmo_expand"), "Replace", [live(job), "chief medical officer"]);
	job = rt.callName(f, rt.gl("hos_expand"), "Replace", [live(job), "head of security"]);
	job = rt.callName(f, rt.gl("hop_expand"), "Replace", [live(job), "head of personnel"]);
	job = rt.callName(f, rt.gl("rd_expand"), "Replace", [live(job), "research director"]);
	job = rt.callName(f, rt.gl("ce_expand"), "Replace", [live(job), "chief engineer"]);
	job = rt.callName(f, rt.gl("qm_expand"), "Replace", [live(job), "quartermaster"]);
	job = rt.callName(f, rt.gl("sec_expand"), "Replace", [live(job), "security officer"]);
	job = rt.callName(f, rt.gl("engi_expand"), "Replace", [live(job), "station engineer"]);
	job = rt.callName(f, rt.gl("atmos_expand"), "Replace", [live(job), "atmospheric technician"]);
	job = rt.callName(f, rt.gl("doc_expand"), "Replace", [live(job), "medical doctor"]);
	job = rt.callName(f, rt.gl("mine_expand"), "Replace", [live(job), "shaft miner"]);
	job = rt.callName(f, rt.gl("chef_expand"), "Replace", [live(job), "cook"]);
	return (job = rt.callName(f, rt.gl("borg_expand"), "Replace", [live(job), "cyborg"]));
});
