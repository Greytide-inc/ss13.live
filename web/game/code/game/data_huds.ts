// From code/game/data_huds.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/proc/add_to_all_human_data_huds  (code/game/data_huds.dm:11)
rt.def("/atom/proc/add_to_all_human_data_huds", function add_to_all_human_data_huds(f: Frame) {
	let hud: Value = null;
	let $e: any;
	f.vars = () => [hud, $e];
	hud = null;
	rt.forList(f, 0, rt.gl("huds"), T("/datum/atom_hud/data/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		hud = $e;
		rt.callName(f, live(hud), "add_to_hud", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /atom/proc/remove_from_all_data_huds  (code/game/data_huds.dm:14)
rt.def("/atom/proc/remove_from_all_data_huds", function remove_from_all_data_huds(f: Frame) {
	let hud: Value = null;
	let $e: any;
	f.vars = () => [hud, $e];
	hud = null;
	rt.forList(f, 0, rt.gl("huds"), T("/datum/atom_hud/data"));
	while (($e = rt.next(f, 0)) !== undefined) {
		hud = $e;
		rt.callName(f, live(hud), "remove_from_hud", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(557, "/datum/atom_hud/data/human/medical/basic", "/datum/atom_hud/data/human/medical", {});

// /datum/atom_hud/data/human/medical/basic/proc/check_sensors  (code/game/data_huds.dm:24)
rt.def("/datum/atom_hud/data/human/medical/basic/proc/check_sensors", function check_sensors(f: Frame, H: Value) {
	let U: Value = null;
	f.vars = () => [U];
	if (!truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy((rt.istype((U = rt.fv(f, "w_uniform", live(H))), T("/obj/item/clothing/under")) ? 1 : 0))) {
		return 0;
	}
	if (rt.le(rt.fv(f, "sensor_mode", live(U)), 2)) {
		return 0;
	}
	return 1;
});

// /datum/atom_hud/data/human/medical/basic/proc/add_to_single_hud  (code/game/data_huds.dm:31)
rt.def("/datum/atom_hud/data/human/medical/basic/proc/add_to_single_hud", function add_to_single_hud(f: Frame) {
	if (!truthy(rt.callSrc(f, "check_sensors", [live(f.args[1])]))) return f.dot;
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["M", "H"] });

// /datum/atom_hud/data/human/medical/basic/proc/update_suit_sensors  (code/game/data_huds.dm:35)
rt.def("/datum/atom_hud/data/human/medical/basic/proc/update_suit_sensors", function update_suit_sensors(f: Frame, H: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.callSrc(f, "check_sensors", [live(H)]))) {
		$0 = rt.callSrc(f, "add_to_hud", [live(H)]);
	} else {
		$0 = rt.callSrc(f, "remove_from_hud", [live(H)]);
	}
	return f.dot;
});

rt.type(560, "/datum/atom_hud/data/human/security/basic", "/datum/atom_hud/data/human/security", {
	hud_icons: null,
});

// /datum/atom_hud/data/human/security/basic/proc/<init>  (code/game/data_huds.dm:42)
rt.def("/datum/atom_hud/data/human/security/basic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hud_icons", rt.list("3"));
	return f.dot;
});

// /mob/living/carbon/proc/check_virus  (code/game/data_huds.dm:65)
rt.def("/mob/living/carbon/proc/check_virus", function check_virus(f: Frame) {
	let threat: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [threat, D, $e];
	threat = 0;
	D = null;
	rt.forList(f, 0, rt.sv(f, "viruses"), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (!truthy(rt.bitAnd(rt.fv(f, "visibility_flags", live(D)), 1))) {
			if (!isEqual(rt.fv(f, "severity", live(D)), "No threat")) {
				return (threat = 2);
			}
			threat = 1;
		}
	}
	rt.endFor(f, 0);
	return live(threat);
});

// /proc/RoundHealth  (code/game/data_huds.dm:77)
rt.def("/proc/RoundHealth", function RoundHealth(f: Frame, M: Value) {
	let maxi_health: Value = null, resulthealth: Value = null;
	let $0: any;
	f.vars = () => [maxi_health, resulthealth, $0];
	if ((isEqual(rt.fv(f, "stat", live(M)), 2) || truthy(rt.bitAnd(rt.fv(f, "status_flags", live(M)), 8192)))) {
		return "health-100";
	}
	maxi_health = rt.fv(f, "maxHealth", live(M));
	if ((truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0)) && rt.lt(rt.fv(f, "health", live(M)), 0))) {
		maxi_health = 100;
	}
	$0 = (resulthealth = multiply(divide(rt.fv(f, "health", live(M)), live(maxi_health)), 100));
	if (rt.inRange($0, 100, 9.999999848243207e+30)) {
		return "health100";
	} else if (rt.inRange($0, 90.625, 100)) {
		return "health93.75";
	} else if (rt.inRange($0, 84.375, 90.625)) {
		return "health87.5";
	} else if (rt.inRange($0, 78.125, 84.375)) {
		return "health81.25";
	} else if (rt.inRange($0, 71.875, 78.125)) {
		return "health75";
	} else if (rt.inRange($0, 65.625, 71.875)) {
		return "health68.75";
	} else if (rt.inRange($0, 59.375, 65.625)) {
		return "health62.5";
	} else if (rt.inRange($0, 53.125, 59.375)) {
		return "health56.25";
	} else if (rt.inRange($0, 46.875, 53.125)) {
		return "health50";
	} else if (rt.inRange($0, 40.625, 46.875)) {
		return "health43.75";
	} else if (rt.inRange($0, 34.375, 40.625)) {
		return "health37.5";
	} else if (rt.inRange($0, 28.125, 34.375)) {
		return "health31.25";
	} else if (rt.inRange($0, 21.875, 28.125)) {
		return "health25";
	} else if (rt.inRange($0, 15.625, 21.875)) {
		return "health18.75";
	} else if (rt.inRange($0, 9.375, 15.625)) {
		return "health12.5";
	} else if (rt.inRange($0, 1, 9.375)) {
		return "health6.25";
	} else if (rt.inRange($0, -50, 1)) {
		return "health0";
	} else if (rt.inRange($0, -85, -50)) {
		return "health-50";
	} else if (rt.inRange($0, -99, -85)) {
		return "health-85";
	} else {
		return "health-100";
	}
	return f.dot;
});

// /mob/living/carbon/proc/update_suit_sensors  (code/game/data_huds.dm:130)  may sleep
rt.def("/mob/living/carbon/proc/update_suit_sensors", function* update_suit_sensors(f: Frame) {
	let B: Value = null, _T: Value = null;
	f.vars = () => [B, _T];
	yield* g.callName(f, (B = rt.index(rt.gl("huds"), 3)), "update_suit_sensors", [live(f.src)]);
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) return f.dot;
	yield* g.callName(f, rt.gl("crewmonitor"), "queueUpdate", [rt.fv(f, "z", live(_T))]);
	return f.dot;
}, true);

// /mob/living/proc/med_hud_set_health  (code/game/data_huds.dm:139)
rt.def("/mob/living/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	rt.setFv(f, "icon_state", (holder = rt.at(rt.sv(f, "hud_list"), "1")), fmt("hud＀", [rt.call(f, P("/proc/RoundHealth"), null, [live(f.src)])]));
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	return f.dot;
});

// /mob/living/carbon/proc/med_hud_set_health  (code/game/data_huds.dm:145)  may sleep
rt.def("/mob/living/carbon/proc/med_hud_set_health", function* med_hud_set_health(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) return f.dot;
	yield* g.callName(f, rt.gl("crewmonitor"), "queueUpdate", [rt.fv(f, "z", live(_T))]);
	return f.dot;
}, true);

// /mob/living/proc/med_hud_set_status  (code/game/data_huds.dm:154)
rt.def("/mob/living/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	holder = rt.at(rt.sv(f, "hud_list"), "2");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	if ((isEqual(rt.sv(f, "stat"), 2) || truthy(rt.bitAnd(rt.sv(f, "status_flags"), 8192)))) {
		rt.setFv(f, "icon_state", live(holder), "huddead");
	} else {
		rt.setFv(f, "icon_state", live(holder), "hudhealthy");
	}
	return f.dot;
});

// /mob/living/carbon/proc/med_hud_set_status  (code/game/data_huds.dm:163)
rt.def("/mob/living/carbon/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	let holder: Value = null, I: Value = null, virus_state: Value = null;
	f.vars = () => [holder, I, virus_state];
	holder = rt.at(rt.sv(f, "hud_list"), "2");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	virus_state = rt.callSrc(f, "check_virus", []);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 32768))) {
		rt.setFv(f, "icon_state", live(holder), "hudxeno");
	} else {
		if ((isEqual(rt.sv(f, "stat"), 2) || truthy(rt.bitAnd(rt.sv(f, "status_flags"), 8192)))) {
			rt.setFv(f, "icon_state", live(holder), "huddead");
		} else {
			if (isEqual(live(virus_state), 2)) {
				rt.setFv(f, "icon_state", live(holder), "hudill");
			} else {
				if (isEqual(live(virus_state), 1)) {
					rt.setFv(f, "icon_state", live(holder), "hudbuff");
				} else {
					rt.setFv(f, "icon_state", live(holder), "hudhealthy");
				}
			}
		}
	}
	return f.dot;
});

// /mob/living/carbon/human/proc/sec_hud_set_ID  (code/game/data_huds.dm:186)  may sleep
rt.def("/mob/living/carbon/human/proc/sec_hud_set_ID", function* sec_hud_set_ID(f: Frame) {
	let holder: Value = null, I: Value = null, _T: Value = null;
	f.vars = () => [holder, I, _T];
	holder = rt.at(rt.sv(f, "hud_list"), "3");
	I = (yield* g.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]));
	rt.setFv(f, "pixel_y", live(holder), subtract((yield* g.callName(f, live(I), "Height", [])), rt.fv(f, "icon_size", rt.world())));
	rt.setFv(f, "icon_state", live(holder), "hudno_id");
	if (truthy(rt.sv(f, "wear_id"))) {
		rt.setFv(f, "icon_state", live(holder), fmt("hud＀", [(yield* g.call(f, P("/proc/ckey"), null, [(yield* g.callName(f, rt.sv(f, "wear_id"), "GetJobName", []))]))]));
	}
	yield* g.srcCall(f, "sec_hud_set_security_status");
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) return f.dot;
	yield* g.callName(f, rt.gl("crewmonitor"), "queueUpdate", [rt.fv(f, "z", live(_T))]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/sec_hud_set_implants  (code/game/data_huds.dm:198)
rt.def("/mob/living/carbon/human/proc/sec_hud_set_implants", function sec_hud_set_implants(f: Frame) {
	let holder: Value = null, i: Value = null, I: Value = null, IC: Value = null;
	let $e: any;
	f.vars = () => [holder, i, I, IC, $e];
	holder = null;
	i = null;
	rt.forList(f, 0, rt.list("7", "5", "6"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.setFv(f, "icon_state", (holder = rt.index(rt.sv(f, "hud_list"), live(i))), null);
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, rt.sv(f, "implants"), T("/obj/item/weapon/implant"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/implant/tracking")) ? 1 : 0))) {
			holder = rt.at(rt.sv(f, "hud_list"), "7");
			IC = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
			rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(IC), "Height", []), rt.fv(f, "icon_size", rt.world())));
			rt.setFv(f, "icon_state", live(holder), "hud_imp_tracking");
		} else {
			if (truthy((rt.istype(live(I), T("/obj/item/weapon/implant/mindshield")) ? 1 : 0))) {
				holder = rt.at(rt.sv(f, "hud_list"), "5");
				IC = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
				rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(IC), "Height", []), rt.fv(f, "icon_size", rt.world())));
				rt.setFv(f, "icon_state", live(holder), "hud_imp_loyal");
			} else {
				if (truthy((rt.istype(live(I), T("/obj/item/weapon/implant/chem")) ? 1 : 0))) {
					holder = rt.at(rt.sv(f, "hud_list"), "6");
					IC = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
					rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(IC), "Height", []), rt.fv(f, "icon_size", rt.world())));
					rt.setFv(f, "icon_state", live(holder), "hud_imp_chem");
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/carbon/human/proc/sec_hud_set_security_status  (code/game/data_huds.dm:220)
rt.def("/mob/living/carbon/human/proc/sec_hud_set_security_status", function sec_hud_set_security_status(f: Frame) {
	let holder: Value = null, I: Value = null, perpname: Value = null, R: Value = null;
	let $0: any;
	f.vars = () => [holder, I, perpname, R, $0];
	holder = rt.at(rt.sv(f, "hud_list"), "4");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	if ((truthy((perpname = rt.callSrc(f, "get_face_name", [rt.callSrc(f, "get_id_name", [""])]))) && truthy(rt.gl("data_core")))) {
		if (truthy((R = rt.call(f, P("/proc/find_record"), null, ["name", live(perpname), rt.fv(f, "security", rt.gl("data_core"))])))) {
			$0 = rt.index(rt.fv(f, "fields", live(R)), "criminal");
			if ($0 === "*Arrest*") {
				rt.setFv(f, "icon_state", live(holder), "hudwanted");
				return live(f.dot);
			} else if ($0 === "Incarcerated") {
				rt.setFv(f, "icon_state", live(holder), "hudincarcerated");
				return live(f.dot);
			} else if ($0 === "Parolled") {
				rt.setFv(f, "icon_state", live(holder), "hudparolled");
				return live(f.dot);
			} else if ($0 === "Discharged") {
				rt.setFv(f, "icon_state", live(holder), "huddischarged");
				return live(f.dot);
			}
		}
	}
	rt.setFv(f, "icon_state", live(holder), null);
	return f.dot;
});

// /proc/RoundDiagBar  (code/game/data_huds.dm:247)
rt.def("/proc/RoundDiagBar", function RoundDiagBar(f: Frame, value: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = multiply(live(value), 100);
	if (rt.inRange($0, 95, 9.999999848243207e+30)) {
		return "max";
	} else if (rt.inRange($0, 80, 100)) {
		return "good";
	} else if (rt.inRange($0, 60, 80)) {
		return "high";
	} else if (rt.inRange($0, 40, 60)) {
		return "med";
	} else if (rt.inRange($0, 20, 40)) {
		return "low";
	} else if (rt.inRange($0, 1, 20)) {
		return "crit";
	} else {
		return "dead";
	}
	return f.dot;
});

// /mob/living/silicon/proc/diag_hud_set_health  (code/game/data_huds.dm:267)
rt.def("/mob/living/silicon/proc/diag_hud_set_health", function diag_hud_set_health(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	holder = rt.at(rt.sv(f, "hud_list"), "9");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	if (isEqual(rt.sv(f, "stat"), 2)) {
		rt.setFv(f, "icon_state", live(holder), "huddiagdead");
	} else {
		rt.setFv(f, "icon_state", live(holder), fmt("huddiag＀", [rt.call(f, P("/proc/RoundDiagBar"), null, [divide(rt.sv(f, "health"), rt.sv(f, "maxHealth"))])]));
	}
	return f.dot;
});

// /mob/living/silicon/proc/diag_hud_set_status  (code/game/data_huds.dm:276)
rt.def("/mob/living/silicon/proc/diag_hud_set_status", function diag_hud_set_status(f: Frame) {
	let holder: Value = null, I: Value = null;
	let $0: any;
	f.vars = () => [holder, I, $0];
	holder = rt.at(rt.sv(f, "hud_list"), "8");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	$0 = rt.sv(f, "stat");
	if ($0 === 0) {
		rt.setFv(f, "icon_state", live(holder), "hudstat");
	} else if ($0 === 1) {
		rt.setFv(f, "icon_state", live(holder), "hudoffline");
	} else {
		rt.setFv(f, "icon_state", live(holder), "huddead2");
	}
	return f.dot;
});

// /mob/living/silicon/robot/proc/diag_hud_set_borgcell  (code/game/data_huds.dm:289)
rt.def("/mob/living/silicon/robot/proc/diag_hud_set_borgcell", function diag_hud_set_borgcell(f: Frame) {
	let holder: Value = null, I: Value = null, chargelvl: Value = null;
	f.vars = () => [holder, I, chargelvl];
	holder = rt.at(rt.sv(f, "hud_list"), "10");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	if (truthy(rt.sv(f, "cell"))) {
		chargelvl = divide(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "maxcharge", rt.sv(f, "cell")));
		rt.setFv(f, "icon_state", live(holder), fmt("hudbatt＀", [rt.call(f, P("/proc/RoundDiagBar"), null, [live(chargelvl)])]));
	} else {
		rt.setFv(f, "icon_state", live(holder), "hudnobatt");
	}
	return f.dot;
});

// /mob/living/silicon/robot/proc/diag_hud_set_aishell  (code/game/data_huds.dm:300)
rt.def("/mob/living/silicon/robot/proc/diag_hud_set_aishell", function diag_hud_set_aishell(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	holder = rt.at(rt.sv(f, "hud_list"), "13");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	if (!truthy(rt.sv(f, "shell"))) {
		rt.setFv(f, "icon_state", live(holder), null);
	} else {
		if (truthy(rt.sv(f, "deployed"))) {
			rt.setFv(f, "icon_state", live(holder), "hudtrackingai");
		} else {
			rt.setFv(f, "icon_state", live(holder), "hudtracking");
		}
	}
	return f.dot;
});

// /mob/living/silicon/ai/proc/diag_hud_set_deployed  (code/game/data_huds.dm:312)
rt.def("/mob/living/silicon/ai/proc/diag_hud_set_deployed", function diag_hud_set_deployed(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	holder = rt.at(rt.sv(f, "hud_list"), "13");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	if (!truthy(rt.sv(f, "deployed_shell"))) {
		rt.setFv(f, "icon_state", live(holder), null);
	} else {
		rt.setFv(f, "icon_state", live(holder), "hudtrackingai");
	}
	return f.dot;
});

// /obj/mecha/proc/diag_hud_set_mechhealth  (code/game/data_huds.dm:324)
rt.def("/obj/mecha/proc/diag_hud_set_mechhealth", function diag_hud_set_mechhealth(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	holder = rt.at(rt.sv(f, "hud_list"), "11");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	rt.setFv(f, "icon_state", live(holder), fmt("huddiag＀", [rt.call(f, P("/proc/RoundDiagBar"), null, [divide(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity"))])]));
	return f.dot;
});

// /obj/mecha/proc/diag_hud_set_mechcell  (code/game/data_huds.dm:331)
rt.def("/obj/mecha/proc/diag_hud_set_mechcell", function diag_hud_set_mechcell(f: Frame) {
	let holder: Value = null, I: Value = null, chargelvl: Value = null;
	f.vars = () => [holder, I, chargelvl];
	holder = rt.at(rt.sv(f, "hud_list"), "10");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	if (truthy(rt.sv(f, "cell"))) {
		chargelvl = divide(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "maxcharge", rt.sv(f, "cell")));
		rt.setFv(f, "icon_state", live(holder), fmt("hudbatt＀", [rt.call(f, P("/proc/RoundDiagBar"), null, [live(chargelvl)])]));
	} else {
		rt.setFv(f, "icon_state", live(holder), "hudnobatt");
	}
	return f.dot;
});

// /obj/mecha/proc/diag_hud_set_mechstat  (code/game/data_huds.dm:342)
rt.def("/obj/mecha/proc/diag_hud_set_mechstat", function diag_hud_set_mechstat(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	holder = rt.at(rt.sv(f, "hud_list"), "8");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	rt.setFv(f, "icon_state", live(holder), null);
	if (!truthy(rt.sv(f, "internal_damage"))) return f.dot;
	rt.setFv(f, "icon_state", live(holder), "hudwarn");
	return f.dot;
});

// /obj/mecha/proc/diag_hud_set_mechtracking  (code/game/data_huds.dm:350)
rt.def("/obj/mecha/proc/diag_hud_set_mechtracking", function diag_hud_set_mechtracking(f: Frame) {
	let holder: Value = null, I: Value = null, new_icon_state: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [holder, I, new_icon_state, _T, $e];
	holder = rt.at(rt.sv(f, "hud_list"), "13");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	new_icon_state = null;
	_T = null;
	rt.forList(f, 0, rt.sv(f, "trackers"), T("/obj/item/mecha_parts/mecha_tracking"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.fv(f, "ai_beacon", live(_T)))) {
			new_icon_state = "hudtrackingai";
			break;
		}
		new_icon_state = "hudtracking";
	}
	rt.endFor(f, 0);
	rt.setFv(f, "icon_state", live(holder), live(new_icon_state));
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/diag_hud_set_bothealth  (code/game/data_huds.dm:366)
rt.def("/mob/living/simple_animal/bot/proc/diag_hud_set_bothealth", function diag_hud_set_bothealth(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	holder = rt.at(rt.sv(f, "hud_list"), "9");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	rt.setFv(f, "icon_state", live(holder), fmt("huddiag＀", [rt.call(f, P("/proc/RoundDiagBar"), null, [divide(rt.sv(f, "health"), rt.sv(f, "maxHealth"))])]));
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/diag_hud_set_botstat  (code/game/data_huds.dm:372)
rt.def("/mob/living/simple_animal/bot/proc/diag_hud_set_botstat", function diag_hud_set_botstat(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	holder = rt.at(rt.sv(f, "hud_list"), "8");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	if (truthy(rt.sv(f, "on"))) {
		rt.setFv(f, "icon_state", live(holder), "hudstat");
	} else {
		if (truthy(rt.sv(f, "stat"))) {
			rt.setFv(f, "icon_state", live(holder), "hudoffline");
		} else {
			rt.setFv(f, "icon_state", live(holder), "huddead2");
		}
	}
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/diag_hud_set_botmode  (code/game/data_huds.dm:383)
rt.def("/mob/living/simple_animal/bot/proc/diag_hud_set_botmode", function diag_hud_set_botmode(f: Frame) {
	let holder: Value = null, I: Value = null;
	let $0: any;
	f.vars = () => [holder, I, $0];
	holder = rt.at(rt.sv(f, "hud_list"), "12");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	if (truthy(rt.sv(f, "client"))) {
		rt.setFv(f, "icon_state", live(holder), "hudsentient");
		return live(f.dot);
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 6 || $0 === 11) {
		rt.setFv(f, "icon_state", live(holder), "hudcalled");
	} else if ($0 === 7 || $0 === 8 || $0 === 10) {
		rt.setFv(f, "icon_state", live(holder), "hudworking");
	} else if ($0 === 5 || $0 === 4) {
		rt.setFv(f, "icon_state", live(holder), "hudpatrol");
	} else if ($0 === 2 || $0 === 3 || $0 === 1) {
		rt.setFv(f, "icon_state", live(holder), "hudalert");
	} else if ($0 === 9 || $0 === 12 || $0 === 13 || $0 === 15) {
		rt.setFv(f, "icon_state", live(holder), "hudmove");
	} else {
		rt.setFv(f, "icon_state", live(holder), "");
	}
	return f.dot;
});

// /obj/machinery/door/airlock/proc/diag_hud_set_electrified  (code/game/data_huds.dm:408)
rt.def("/obj/machinery/door/airlock/proc/diag_hud_set_electrified", function diag_hud_set_electrified(f: Frame) {
	let holder: Value = null;
	f.vars = () => [holder];
	holder = rt.at(rt.sv(f, "hud_list"), "14");
	if (!isEqual(rt.sv(f, "secondsElectrified"), 0)) {
		rt.setFv(f, "icon_state", live(holder), "electrified");
	} else {
		rt.setFv(f, "icon_state", live(holder), "");
	}
	return f.dot;
});
