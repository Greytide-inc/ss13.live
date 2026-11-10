// Based on /tg/station's code/modules/events/wizard/departmentrevolt.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(338, "/datum/round_event/wizard/deprevolt", "/datum/round_event/wizard", {});

// departmentrevolt.dm:11
rt.def("/datum/round_event/wizard/deprevolt/proc/start", function start(f: Frame) {
	let tidecolor: Value = null, nation: Value = null, H: Value = null, M: Value = null, job: Value = null, message: Value = null, job_5: Value = null;
	let $e: any;
	let jobs_to_revolt: Value = list();
	let citizens: Value = list();
	const subject = (tidecolor = pick("grey", "white", "yellow", "purple", "brown", "whatevercolorrepresentstheservicepeople"));
	if (subject === "grey") {
		jobs_to_revolt = list("Assistant");
		nation = pick("Assa", "Mainte", "Tunnel", "Gris", "Grey", "Liath", "Grigio", "Ass", "Assi");
	} else if (subject === "white") {
		jobs_to_revolt = list("Chief Medical Officer", "Medical Doctor", "Chemist", "Geneticist", "Virologist");
		nation = pick("Mede", "Healtha", "Recova", "Chemi", "Geneti", "Viro", "Psych");
	} else if (subject === "yellow") {
		jobs_to_revolt = list("Chief Engineer", "Station Engineer", "Atmospheric Technician");
		nation = pick("Atomo", "Engino", "Power", "Teleco");
	} else if (subject === "purple") {
		jobs_to_revolt = list("Research Director", "Scientist", "Roboticist");
		nation = pick("Sci", "Griffa", "Explosi", "Mecha", "Xeno");
	} else if (subject === "brown") {
		jobs_to_revolt = list("Quartermaster", "Cargo Technician", "Shaft Miner");
		nation = pick("Cargo", "Guna", "Suppli", "Mule", "Crate", "Ore", "Mini", "Shaf");
	} else if (subject === "whatevercolorrepresentstheservicepeople") {
		jobs_to_revolt = list("Bartender", "Cook", "Botanist", "Clown", "Mime", "Janitor", "Chaplain");
		nation = pick("Honka", "Boozo", "Fatu", "Danka", "Mimi", "Libra", "Jani", "Religi");
	}
	nation += pick("stan", "topia", "land", "nia", "ca", "tova", "dor", "ador", "tia", "sia", "ano", "tica", "tide", "cis", "marea", "co", "taoide", "slavia", "stotzka");
	for (H of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
		if (H.mind) {
			if ((M = H.mind).assigned_role && !rt.isIn(f, M, GLOB.SSticker.mode.traitors)) {
				job = null;
				for (job of each(jobs_to_revolt)) {
					if (M.assigned_role == job) {
						citizens += H;
						GLOB.SSticker.mode.traitors += M;
						M.special_role = "separatist";
						H.log_message(`<font color='red'>Was made into a separatist, long live ${nation}!</font>`, "Attack log");
						to_chat(H, `<B>You are a separatist! ${nation} forever! Protect the soverignty of your newfound land with your comrades in arms!</B>`);
					}
				}
			}
		}
	}
	if (!rt.len(f, citizens)) return f.dot;
	for (job_5 of each(jobs_to_revolt)) {
		message += `${job_5},`;
	}
	message_admins(`The nation of ${nation} has been formed. Affected jobs are ${message}`);
	return f.dot;
});
