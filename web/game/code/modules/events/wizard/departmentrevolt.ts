// From code/modules/events/wizard/departmentrevolt.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(338, "/datum/round_event/wizard/deprevolt", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/deprevolt/proc/start  (code/modules/events/wizard/departmentrevolt.dm:11)
rt.def("/datum/round_event/wizard/deprevolt/proc/start", function start(f: Frame) {
	let tidecolor: Value = null, jobs_to_revolt: Value = null, nation: Value = null, citizens: Value = null, H: Value = null, M: Value = null, job: Value = null, message: Value = null, job_5: Value = null;
	let $0: any, $e: any;
	f.vars = () => [tidecolor, jobs_to_revolt, nation, citizens, H, M, job, message, job_5, $0, $e];
	tidecolor = null;
	jobs_to_revolt = rt.list();
	nation = null;
	citizens = rt.list();
	$0 = (tidecolor = rt.op(f, "PickUnweighted", [6], ["grey", "white", "yellow", "purple", "brown", "whatevercolorrepresentstheservicepeople"]));
	if ($0 === "grey") {
		jobs_to_revolt = rt.list("Assistant");
		nation = rt.op(f, "PickUnweighted", [9], ["Assa", "Mainte", "Tunnel", "Gris", "Grey", "Liath", "Grigio", "Ass", "Assi"]);
	} else if ($0 === "white") {
		jobs_to_revolt = rt.list("Chief Medical Officer", "Medical Doctor", "Chemist", "Geneticist", "Virologist");
		nation = rt.op(f, "PickUnweighted", [7], ["Mede", "Healtha", "Recova", "Chemi", "Geneti", "Viro", "Psych"]);
	} else if ($0 === "yellow") {
		jobs_to_revolt = rt.list("Chief Engineer", "Station Engineer", "Atmospheric Technician");
		nation = rt.op(f, "PickUnweighted", [4], ["Atomo", "Engino", "Power", "Teleco"]);
	} else if ($0 === "purple") {
		jobs_to_revolt = rt.list("Research Director", "Scientist", "Roboticist");
		nation = rt.op(f, "PickUnweighted", [5], ["Sci", "Griffa", "Explosi", "Mecha", "Xeno"]);
	} else if ($0 === "brown") {
		jobs_to_revolt = rt.list("Quartermaster", "Cargo Technician", "Shaft Miner");
		nation = rt.op(f, "PickUnweighted", [8], ["Cargo", "Guna", "Suppli", "Mule", "Crate", "Ore", "Mini", "Shaf"]);
	} else if ($0 === "whatevercolorrepresentstheservicepeople") {
		jobs_to_revolt = rt.list("Bartender", "Cook", "Botanist", "Clown", "Mime", "Janitor", "Chaplain");
		nation = rt.op(f, "PickUnweighted", [8], ["Honka", "Boozo", "Fatu", "Danka", "Mimi", "Libra", "Jani", "Religi"]);
	}
	nation = rt.modify(live(nation), rt.op(f, "PickUnweighted", [19], ["stan", "topia", "land", "nia", "ca", "tova", "dor", "ador", "tia", "sia", "ano", "tica", "tide", "cis", "marea", "co", "taoide", "slavia", "stotzka"]), add);
	H = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (truthy(rt.fv(f, "mind", live(H)))) {
			if ((truthy(rt.gv(f, "assigned_role", (M = rt.fv(f, "mind", live(H))))) && !truthy((rt.isIn(f, live(M), rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)))) {
				job = null;
				rt.forList(f, 1, live(jobs_to_revolt));
				while (($e = rt.next(f, 1)) !== undefined) {
					job = $e;
					if (isEqual(rt.fv(f, "assigned_role", live(M)), live(job))) {
						citizens = rt.modify(live(citizens), live(H), add);
						rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", live(M), add);
						rt.setFv(f, "special_role", live(M), "separatist");
						rt.callName(f, live(H), "log_message", [fmt("<font color='red'>Was made into a separatist, long live ＀!</font>", [live(nation)]), "Attack log"]);
						rt.call(f, P("/proc/to_chat"), null, [live(H), fmt("<B>You are a separatist! ＀ forever! Protect the soverignty of your newfound land with your comrades in arms!</B>", [live(nation)])]);
					}
				}
				rt.endFor(f, 1);
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(citizens)))) return f.dot;
	message = null;
	job_5 = null;
	rt.forList(f, 0, live(jobs_to_revolt));
	while (($e = rt.next(f, 0)) !== undefined) {
		job_5 = $e;
		message = rt.modify(live(message), fmt("＀,", [live(job_5)]), add);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/message_admins"), null, [fmt("The nation of ＀ has been formed. Affected jobs are ＀", [live(nation), live(message)])]);
	return f.dot;
});
