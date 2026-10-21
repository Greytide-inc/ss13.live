// From code/game/objects/items/devices/scanners.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9279, "/obj/item/device/t_scanner", "/obj/item/device", {
	on: 0,
	name: "１T-ray scanner",
	desc: "A terahertz-ray emitter and scanner used to detect underfloor objects such as cables and pipes.",
	icon_state: "t-ray0",
	slot_flags: 512,
	w_class: 2,
	item_state: "electronic",
	materials: null,
	origin_tech: "magnets=1;engineering=1",
});

// /obj/item/device/t_scanner/proc/<init>  (code/game/objects/items/devices/scanners.dm:19)
rt.def("/obj/item/device/t_scanner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150]));
	return f.dot;
});

// /obj/item/device/t_scanner/proc/attack_self  (code/game/objects/items/devices/scanners.dm:24)
rt.def("/obj/item/device/t_scanner/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	rt.setSv(f, "icon_state", add(rt.call(f, P("/proc/copytext"), null, [rt.sv(f, "icon_state"), 1, rt.length(rt.sv(f, "icon_state"))]), fmt("＀", [rt.sv(f, "on")])));
	if (!truthy(rt.sv(f, "on"))) return f.dot;
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
});

// /obj/item/device/t_scanner/proc/flick_sonar  (code/game/objects/items/devices/scanners.dm:31)  may sleep
rt.def("/obj/item/device/t_scanner/proc/flick_sonar", function* flick_sonar(f: Frame, pipe: Value) {
	let M: Value = null, I: Value = null, MA: Value = null;
	f.vars = () => [pipe, M, I, MA];
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	M = rt.sv(f, "loc");
	I = (yield* g.new_(f, T("/image"), ["loc", rt.getStep(f, live(pipe), 0)], rt.Args.Named));
	rt.setFv(f, "alpha", (MA = (yield* g.new_(f, T("/mutable_appearance"), [live(pipe)]))), 128);
	rt.setFv(f, "appearance", live(I), live(MA));
	if (!truthy(rt.fv(f, "client", live(M)))) return f.dot;
	yield* g.call(f, P("/proc/flick_overlay"), null, [live(I), rt.list(rt.fv(f, "client", live(M))), 8]);
	return f.dot;
}, true);

// /obj/item/device/t_scanner/proc/process  (code/game/objects/items/devices/scanners.dm:41)  may sleep
rt.def("/obj/item/device/t_scanner/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "on"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		return null;
	}
	yield* g.srcCall(f, "scan");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/device/t_scanner/proc/scan  (code/game/objects/items/devices/scanners.dm:48)  may sleep
rt.def("/obj/item/device/t_scanner/proc/scan", function* scan(f: Frame) {
	let _T: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [_T, O, $e];
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [2, rt.fv(f, "loc", live(f.src))])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		O = null;
		rt.forList(f, 1, rt.fv(f, "contents", live(_T)), T("/obj"));
		while (($e = rt.next(f, 1)) !== undefined) {
			O = $e;
			if (!isEqual(rt.fv(f, "level", live(O)), 1)) {
				continue;
			}
			if (isEqual(rt.fv(f, "invisibility", live(O)), 100)) {
				yield* g.srcCall(f, "flick_sonar", live(O));
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(9282, "/obj/item/device/healthanalyzer", "/obj/item/device", {
	mode: 1,
	scanmode: 0,
	flags: 68,
	throw_speed: 3,
	throw_range: 7,
	name: "health analyzer",
	icon_state: "health",
	item_state: "analyzer",
	desc: "A hand-held body scanner able to distinguish vital signs of the subject.",
	slot_flags: 512,
	throwforce: 3,
	w_class: 1,
	materials: null,
	origin_tech: "magnets=1;biotech=1",
});

// /obj/item/device/healthanalyzer/proc/<init>  (code/game/objects/items/devices/scanners.dm:68)
rt.def("/obj/item/device/healthanalyzer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200]));
	return f.dot;
});

// /obj/item/device/healthanalyzer/proc/attack_self  (code/game/objects/items/devices/scanners.dm:74)
rt.def("/obj/item/device/healthanalyzer/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!truthy(rt.sv(f, "scanmode"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You switch the health analyzer to scan chemical contents.</span>"]);
		rt.setSv(f, "scanmode", 1);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You switch the health analyzer to check physical health.</span>"]);
		rt.setSv(f, "scanmode", 0);
	}
	return f.dot;
});

// /obj/item/device/healthanalyzer/proc/attack  (code/game/objects/items/devices/scanners.dm:84)  may sleep
rt.def("/obj/item/device/healthanalyzer/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	f.vars = () => [M, user];
	if (((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(user)), 256)) || rt.ge((yield* g.callName(f, live(user), "getBrainLoss", [])), 60)) && truthy(rt.op(f, "Prob", [], [50])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You stupidly try to analyze the floor's vitals!</span>"]);
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ has analyzed the floor's vitals!</span>", [live(user)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='info'>Analyzing results for The floor:\n\tOverall status: <b>Healthy</b>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='info'>Key: <font color='blue'>Suffocation</font>/<font color='green'>Toxin</font>/<font color='#FF8000'>Burn</font>/<font color='red'>Brute</font></span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='info'>\tDamage specifics: <font color='blue'>0</font>-<font color='green'>0</font>-<font color='#FF8000'>0</font>-<font color='red'>0</font></span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='info'>Body temperature: ???</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ has analyzed ＀'s vitals.</span>", [live(user), live(M)])]);
	if (isEqual(rt.sv(f, "scanmode"), 0)) {
		yield* g.call(f, P("/proc/healthscan"), null, [live(user), live(M), rt.sv(f, "mode")]);
	} else {
		if (isEqual(rt.sv(f, "scanmode"), 1)) {
			yield* g.call(f, P("/proc/chemscan"), null, [live(user), live(M)]);
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /proc/healthscan  (code/game/objects/items/devices/scanners.dm:105)
rt.def("/proc/healthscan", function healthscan(f: Frame, user: Value, M: Value, mode: Value) {
	let oxy_loss: Value = null, tox_loss: Value = null, fire_loss: Value = null, brute_loss: Value = null, mob_status: Value = null, H: Value = null, C: Value = null, damaged: Value = null, org: Value = null, tdelta: Value = null, D: Value = null, blood_id: Value = null, H_7: Value = null, blood_percent: Value = null, blood_type: Value = null, R: Value = null, cyberimp_detect: Value = null, CI: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [mode, oxy_loss, tox_loss, fire_loss, brute_loss, mob_status, H, C, damaged, org, tdelta, D, blood_id, H_7, blood_percent, blood_type, R, cyberimp_detect, CI, $0, $1, $2, $3, $e];
	if (live(mode) === null) {
		mode = 1;
	}
	if ((truthy(rt.callName(f, live(user), "incapacitated", [])) || truthy(rt.fv(f, "eye_blind", live(user))))) {
		return live(f.dot);
	}
	oxy_loss = rt.callName(f, live(M), "getOxyLoss", []);
	tox_loss = rt.callName(f, live(M), "getToxLoss", []);
	fire_loss = rt.callName(f, live(M), "getFireLoss", []);
	brute_loss = rt.callName(f, live(M), "getBruteLoss", []);
	if (rt.gt(rt.fv(f, "stat", live(M)), 1)) {
		$0 = "<span class='alert'><b>Deceased</b></span>";
	} else {
		$0 = fmt("<b>＀ % healthy</b>", [multiply(rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "health", live(M)), rt.fv(f, "maxHealth", live(M))), 0.009999999776482582]), 100)]);
	}
	mob_status = $0;
	if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(M)), 8192))) {
		mob_status = "<span class='alert'>Deceased</span>";
		oxy_loss = rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/rand"), null, [1, 40]), live(oxy_loss), subtract(300, add(add(live(tox_loss), live(fire_loss)), live(brute_loss)))]);
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((truthy(rt.callName(f, (H = live(M)), "undergoing_cardiac_arrest", [])) && !isEqual(rt.fv(f, "stat", live(H)), 2))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Subject suffering from heart attack: Apply defibrillator immediately!</span>"]);
		}
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>Analyzing results for ＀:\n\tOverall status: ＀</span>", [live(M), live(mob_status)])]);
	if (rt.gt(live(brute_loss), 10)) {
		$0 = live(user);
		if (rt.gt(live(brute_loss), 50)) {
			$1 = "Severe";
		} else {
			$1 = "Minor";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("\t<span class='alert'>＀ tissue damage detected.</span>", [$1])]);
	}
	if (rt.gt(live(fire_loss), 10)) {
		$0 = live(user);
		if (rt.gt(live(fire_loss), 50)) {
			$1 = "Severe";
		} else {
			$1 = "Minor";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("\t<span class='alert'>＀ burn damage detected.</span>", [$1])]);
	}
	if (rt.gt(live(oxy_loss), 10)) {
		$0 = live(user);
		if (rt.gt(live(oxy_loss), 50)) {
			$1 = "Severe";
		} else {
			$1 = "Minor";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("\t<span class='info'><span class='alert'>＀ oxygen deprivation detected.</span>", [$1])]);
	}
	if (rt.gt(live(tox_loss), 10)) {
		$0 = live(user);
		if (rt.gt(live(tox_loss), 50)) {
			$1 = "Critical";
		} else {
			$1 = "Dangerous";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("\t<span class='alert'>＀ amount of toxins detected.</span>", [$1])]);
	}
	if (truthy(rt.callName(f, live(M), "getStaminaLoss", []))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "\t<span class='alert'>Subject appears to be suffering from fatigue.</span>"]);
	}
	if (truthy(rt.callName(f, live(M), "getCloneLoss", []))) {
		$0 = live(user);
		if (rt.gt(rt.callName(f, live(M), "getCloneLoss", []), 30)) {
			$1 = "severe";
		} else {
			$1 = "minor";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("\t<span class='alert'>Subject appears to have ＀ cellular damage.</span>", [$1])]);
	}
	if ((truthy(rt.fv(f, "reagents", live(M))) && truthy(rt.callName(f, rt.fv(f, "reagents", live(M)), "get_reagent_amount", ["epinephrine"])))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("\t<span class='info'>Bloodstream analysis located ＀ units of rejuvenation chemicals.</span>", [rt.callName(f, rt.fv(f, "reagents", live(M)), "get_reagent_amount", ["epinephrine"])])]);
	}
	if ((rt.ge(rt.callName(f, live(M), "getBrainLoss", []), 100) || !truthy(rt.callName(f, live(M), "getorgan", [T("/obj/item/organ/brain")])))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "\t<span class='alert'>Subject brain function is non-existent.</span>"]);
	} else {
		if (rt.ge(rt.callName(f, live(M), "getBrainLoss", []), 60)) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "\t<span class='alert'>Severe brain damage detected. Subject likely to have mental retardation.</span>"]);
		} else {
			if (rt.ge(rt.callName(f, live(M), "getBrainLoss", []), 10)) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), "\t<span class='alert'>Brain damage detected. Subject may have had a concussion.</span>"]);
			}
		}
	}
	if ((truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0)) && isEqual(live(mode), 1))) {
		C = live(M);
		if ((((rt.gt(rt.length((damaged = rt.callName(f, live(C), "get_damaged_bodyparts", [1, 1]))), 0) || rt.gt(live(oxy_loss), 0)) || rt.gt(live(tox_loss), 0)) || rt.gt(live(fire_loss), 0))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>\tDamage: <span class='info'><font color='red'>Brute</font></span>-<font color='#FF8000'>Burn</font>-<font color='green'>Toxin</font>-<font color='blue'>Suffocation</font>\n\t\tSpecifics: <font color='red'>＀</font>-<font color='#FF8000'>＀</font>-<font color='green'>＀</font>-<font color='blue'>＀</font></span>", [live(brute_loss), live(fire_loss), live(tox_loss), live(oxy_loss)])]);
			org = null;
			rt.forList(f, 0, live(damaged), T("/obj/item/bodypart"));
			while (($e = rt.next(f, 0)) !== undefined) {
				org = $e;
				$0 = live(user);
				$1 = rt.call(f, P("/proc/capitalize"), null, [rt.fv(f, "name", live(org))]);
				if (rt.gt(rt.fv(f, "brute_dam", live(org)), 0)) {
					$2 = fmt("<font color='red'>＀</font></span>", [rt.fv(f, "brute_dam", live(org))]);
				} else {
					$2 = "<font color='red'>0</font>";
				}
				if (rt.gt(rt.fv(f, "burn_dam", live(org)), 0)) {
					$3 = fmt("<font color='#FF8000'>＀</font>", [rt.fv(f, "burn_dam", live(org))]);
				} else {
					$3 = "<font color='#FF8000'>0</font>";
				}
				rt.call(f, P("/proc/to_chat"), null, [$0, fmt("\t\t<span class='info'>＀: ＀-＀", [$1, $2, $3])]);
			}
			rt.endFor(f, 0);
		}
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(M);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>Species: ＀</span>", [rt.gv(f, "name", rt.gv(f, "species", rt.fv(f, "dna", live(H))))])]);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>Body temperature: ＀ &deg;C (＀ &deg;F)</span>", [rt.call(f, P("/proc/round"), null, [subtract(rt.fv(f, "bodytemperature", live(M)), 273.1499938964844), 0.10000000149011612]), rt.call(f, P("/proc/round"), null, [subtract(multiply(rt.fv(f, "bodytemperature", live(M)), 1.7999999523162842), 459.6700134277344), 0.10000000149011612])])]);
	if ((truthy(rt.fv(f, "tod", live(M))) && (isEqual(rt.fv(f, "stat", live(M)), 2) || truthy(rt.bitAnd(rt.fv(f, "status_flags", live(M)), 8192))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>Time of Death:</span> ＀", [rt.fv(f, "tod", live(M))])]);
		if (rt.lt((tdelta = rt.call(f, P("/proc/round"), null, [subtract(rt.worldTime(f), rt.fv(f, "timeofdeath", live(M)))])), 1200)) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>Subject died ＀ seconds ago, defibrillation may be possible!</span>", [divide(live(tdelta), 10)])]);
		}
	}
	D = null;
	rt.forList(f, 0, rt.fv(f, "viruses", live(M)), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (!truthy(rt.bitAnd(rt.fv(f, "visibility_flags", live(D)), 1))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='alert'><b>Warning: ＀ detected</b>\nName: ＀.\nType: ＀.\nStage: ＀/＀.\nPossible Cure: ＀</span>", [rt.fv(f, "form", live(D)), rt.fv(f, "name", live(D)), rt.fv(f, "spread_text", live(D)), rt.fv(f, "stage", live(D)), rt.fv(f, "max_stages", live(D)), rt.fv(f, "cure_text", live(D))])]);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.callName(f, live(M), "has_dna", []))) return f.dot;
	C = live(M);
	if (truthy((blood_id = rt.callName(f, live(C), "get_blood_id", [])))) {
		if (truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "bleed_rate", (H_7 = live(C))))) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Subject is bleeding!</span>"]);
			}
		}
		blood_percent = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "blood_volume", live(C)), 560), 100)]);
		blood_type = rt.gv(f, "blood_type", rt.fv(f, "dna", live(C)));
		if (!isEqual(live(blood_id), "blood")) {
			if (truthy((R = rt.index(rt.gl("chemical_reagents_list"), live(blood_id))))) {
				blood_type = rt.fv(f, "name", live(R));
			} else {
				blood_type = live(blood_id);
			}
		}
		if ((rt.le(rt.fv(f, "blood_volume", live(C)), 475) && rt.gt(rt.fv(f, "blood_volume", live(C)), 336))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>LOW blood level ＀ %, ＀ cl,</span> <span class='info'>type: ＀</span>", [live(blood_percent), rt.fv(f, "blood_volume", live(C)), live(blood_type)])]);
		} else {
			if (rt.le(rt.fv(f, "blood_volume", live(C)), 336)) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>CRITICAL blood level ＀ %, ＀ cl,</span> <span class='info'>type: ＀</span>", [live(blood_percent), rt.fv(f, "blood_volume", live(C)), live(blood_type)])]);
			} else {
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>Blood level ＀ %, ＀ cl, type: ＀</span>", [live(blood_percent), rt.fv(f, "blood_volume", live(C)), live(blood_type)])]);
			}
		}
	}
	cyberimp_detect = null;
	CI = null;
	rt.forList(f, 0, rt.fv(f, "internal_organs", live(C)), T("/obj/item/organ/cyberimp"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CI = $e;
		if (isEqual(rt.fv(f, "status", live(CI)), 2)) {
			cyberimp_detect = rt.modify(live(cyberimp_detect), fmt("＀ is modified with a ＀.<br>", [rt.fv(f, "name", live(C)), rt.fv(f, "name", live(CI))]), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(cyberimp_detect))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Detected cybernetic modifications:</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀</span>", [live(cyberimp_detect)])]);
	return f.dot;
});

// /proc/chemscan  (code/game/objects/items/devices/scanners.dm:206)
rt.def("/proc/chemscan", function chemscan(f: Frame, user: Value, M: Value) {
	let H: Value = null, R: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [H, R, $0, $1, $2, $3, $e];
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.gv(f, "reagents", (H = live(M))))) return f.dot;
	if (truthy(rt.getLen(f, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(H)))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Subject contains the following reagents:</span>"]);
		R = null;
		rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(H))), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			$0 = live(user);
			$1 = rt.fv(f, "volume", live(R));
			$2 = rt.fv(f, "name", live(R));
			if (isEqual(rt.fv(f, "overdosed", live(R)), 1)) {
				$3 = "</span> - <span class='boldannounce'>OVERDOSING</span>";
			} else {
				$3 = ".</span>";
			}
			rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ units of ＀＀", [$1, $2, $3])]);
		}
		rt.endFor(f, 0);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Subject contains no reagents.</span>"]);
	}
	if (truthy(rt.getLen(f, rt.gv(f, "addiction_list", rt.fv(f, "reagents", live(H)))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldannounce'>Subject is addicted to the following reagents:</span>"]);
		R = null;
		rt.forList(f, 0, rt.gv(f, "addiction_list", rt.fv(f, "reagents", live(H))), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀</span>", [rt.fv(f, "name", live(R))])]);
		}
		rt.endFor(f, 0);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Subject is not addicted to any reagents.</span>"]);
	}
	return f.dot;
});

// /obj/item/device/healthanalyzer/verb/toggle_mode  (code/game/objects/items/devices/scanners.dm:226)
rt.def("/obj/item/device/healthanalyzer/verb/toggle_mode", function toggle_mode(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	rt.setSv(f, "mode", (!truthy(rt.sv(f, "mode")) ? 1 : 0));
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "The scanner now shows specific limb damage."]);
	} else if ($0 === 0) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "The scanner no longer shows limb damage."]);
	}
	return f.dot;
}, false, { verb: { name: "Switch Verbosity", category: "Object" } });

rt.type(9284, "/obj/item/device/analyzer", "/obj/item/device", {
	flags: 68,
	throw_speed: 3,
	throw_range: 7,
	desc: "A hand-held environmental scanner which reports current gas levels.",
	name: "analyzer",
	icon_state: "atmos",
	item_state: "analyzer",
	w_class: 2,
	slot_flags: 512,
	throwforce: 0,
	materials: null,
	origin_tech: "magnets=1;engineering=1",
});

// /obj/item/device/analyzer/proc/<init>  (code/game/objects/items/devices/scanners.dm:248)
rt.def("/obj/item/device/analyzer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30, "$glass", 20]));
	return f.dot;
});

// /obj/item/device/analyzer/proc/attack_self  (code/game/objects/items/devices/scanners.dm:253)  may sleep
rt.def("/obj/item/device/analyzer/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let location: Value = null, environment: Value = null, pressure: Value = null, total_moles: Value = null, env_gases: Value = null, o2_concentration: Value = null, n2_concentration: Value = null, co2_concentration: Value = null, plasma_concentration: Value = null, id: Value = null, gas_concentration: Value = null;
	let $e: any;
	f.vars = () => [user, location, environment, pressure, total_moles, env_gases, o2_concentration, n2_concentration, co2_concentration, plasma_concentration, id, gas_concentration, $e];
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if ((truthy(rt.fv(f, "stat", live(user))) || truthy(rt.fv(f, "eye_blind", live(user))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((location = rt.fv(f, "loc", live(user))), T("/turf")) ? 1 : 0))) {
		return live(f.dot);
	}
	environment = (yield* g.callName(f, live(location), "return_air", []));
	pressure = (yield* g.callName(f, live(environment), "return_pressure", []));
	total_moles = (yield* g.callName(f, live(environment), "total_moles", []));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='info'><B>Results:</B></span>"]);
	if (rt.lt(rt.op(f, "Abs", [], [subtract(live(pressure), 101.32499694824219)]), 10)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>Pressure: ＀ kPa</span>", [(yield* g.call(f, P("/proc/round"), null, [live(pressure), 0.10000000149011612]))])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='alert'>Pressure: ＀ kPa</span>", [(yield* g.call(f, P("/proc/round"), null, [live(pressure), 0.10000000149011612]))])]);
	}
	if (!truthy(live(total_moles))) return f.dot;
	env_gases = rt.fv(f, "gases", live(environment));
	yield* g.callName(f, live(environment), "assert_gases", [rt.gl("hardcoded_gases")], rt.Args.List);
	o2_concentration = divide(rt.index(rt.at(live(env_gases), "o2"), 1), live(total_moles));
	n2_concentration = divide(rt.index(rt.at(live(env_gases), "n2"), 1), live(total_moles));
	co2_concentration = divide(rt.index(rt.at(live(env_gases), "co2"), 1), live(total_moles));
	plasma_concentration = divide(rt.index(rt.at(live(env_gases), "plasma"), 1), live(total_moles));
	yield* g.callName(f, live(environment), "garbage_collect", []);
	if (rt.lt(rt.op(f, "Abs", [], [subtract(live(n2_concentration), 0.7900000214576721)]), 20)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>Nitrogen: ＀ %</span>", [(yield* g.call(f, P("/proc/round"), null, [multiply(live(n2_concentration), 100), 0.009999999776482582]))])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='alert'>Nitrogen: ＀ %</span>", [(yield* g.call(f, P("/proc/round"), null, [multiply(live(n2_concentration), 100), 0.009999999776482582]))])]);
	}
	if (rt.lt(rt.op(f, "Abs", [], [subtract(live(o2_concentration), 0.20999999344348907)]), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>Oxygen: ＀ %</span>", [(yield* g.call(f, P("/proc/round"), null, [multiply(live(o2_concentration), 100), 0.009999999776482582]))])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='alert'>Oxygen: ＀ %</span>", [(yield* g.call(f, P("/proc/round"), null, [multiply(live(o2_concentration), 100), 0.009999999776482582]))])]);
	}
	if (rt.gt(live(co2_concentration), 0.009999999776482582)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='alert'>CO2: ＀ %</span>", [(yield* g.call(f, P("/proc/round"), null, [multiply(live(co2_concentration), 100), 0.009999999776482582]))])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>CO2: ＀ %</span>", [(yield* g.call(f, P("/proc/round"), null, [multiply(live(co2_concentration), 100), 0.009999999776482582]))])]);
	}
	if (rt.gt(live(plasma_concentration), 0.004999999888241291)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='alert'>Plasma: ＀ %</span>", [(yield* g.call(f, P("/proc/round"), null, [multiply(live(plasma_concentration), 100), 0.009999999776482582]))])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>Plasma: ＀ %</span>", [(yield* g.call(f, P("/proc/round"), null, [multiply(live(plasma_concentration), 100), 0.009999999776482582]))])]);
	}
	id = null;
	rt.forList(f, 0, live(env_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		if (truthy((rt.isIn(f, live(id), rt.gl("hardcoded_gases")) ? 1 : 0))) {
			continue;
		}
		gas_concentration = divide(rt.index(rt.index(live(env_gases), live(id)), 1), live(total_moles));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='alert'>＀: ＀ %</span>", [rt.index(rt.index(rt.index(live(env_gases), live(id)), 3), 2), (yield* g.call(f, P("/proc/round"), null, [multiply(live(gas_concentration), 100), 0.009999999776482582]))])]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>Temperature: ＀ &deg;C</span>", [(yield* g.call(f, P("/proc/round"), null, [subtract(rt.fv(f, "temperature", live(environment)), 273.1499938964844)]))])]);
	return f.dot;
}, true);

rt.type(9285, "/obj/item/device/mass_spectrometer", "/obj/item/device", {
	details: 0,
	flags: 64,
	container_type: 4096,
	throw_speed: 3,
	throw_range: 7,
	desc: "A hand-held mass spectrometer which identifies trace chemicals in a blood sample.",
	name: "mass-spectrometer",
	icon_state: "spectrometer",
	item_state: "analyzer",
	w_class: 2,
	slot_flags: 512,
	throwforce: 0,
	materials: null,
	origin_tech: "magnets=2;biotech=1;plasmatech=2",
});

// /obj/item/device/mass_spectrometer/proc/<init>  (code/game/objects/items/devices/scanners.dm:323)
rt.def("/obj/item/device/mass_spectrometer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150, "$glass", 100]));
	return f.dot;
});

// /obj/item/device/mass_spectrometer/proc/New  (code/game/objects/items/devices/scanners.dm:328)  may sleep
rt.def("/obj/item/device/mass_spectrometer/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", 5);
	return f.dot;
}, true);

// /obj/item/device/mass_spectrometer/proc/on_reagent_change  (code/game/objects/items/devices/scanners.dm:332)
rt.def("/obj/item/device/mass_spectrometer/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		rt.setSv(f, "icon_state", add(rt.initial(f, live(f.src), "icon_state"), "_s"));
	} else {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	}
	return f.dot;
});

// /obj/item/device/mass_spectrometer/proc/attack_self  (code/game/objects/items/devices/scanners.dm:338)  may sleep
rt.def("/obj/item/device/mass_spectrometer/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let blood_traces: Value = null, R: Value = null, dat: Value = null, R_2: Value = null;
	let $e: any;
	f.vars = () => [user, blood_traces, R, dat, R_2, $e];
	if ((truthy(rt.fv(f, "stat", live(user))) || truthy(rt.fv(f, "eye_blind", live(user))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(user), "IsAdvancedToolUser", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) return f.dot;
	blood_traces = rt.list();
	R = null;
	rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (!isEqual(rt.fv(f, "id", live(R)), "blood")) {
			yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The sample was contaminated! Please insert another sample.</span>"]);
			return live(f.dot);
		} else {
			blood_traces = (yield* g.call(f, P("/proc/params2list"), null, [rt.index(rt.fv(f, "data", live(R)), "trace_chem")]));
			break;
		}
	}
	rt.endFor(f, 0);
	dat = "<i><b>Trace Chemicals Found:</b>";
	if (!truthy(rt.len(f, live(blood_traces)))) {
		dat = rt.modify(live(dat), "<br>None", add);
	} else {
		R_2 = null;
		rt.forList(f, 0, live(blood_traces));
		while (($e = rt.next(f, 0)) !== undefined) {
			R_2 = $e;
			dat = rt.modify(live(dat), fmt("<br>＀", [rt.index(rt.gl("chemical_reagents_list"), live(R_2))]), add);
			if (truthy(rt.sv(f, "details"))) {
				dat = rt.modify(live(dat), fmt(" (＀ units)", [rt.index(live(blood_traces), live(R_2))]), add);
			}
		}
		rt.endFor(f, 0);
	}
	dat = rt.modify(live(dat), "</i>", add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), live(dat)]);
	yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
	return f.dot;
}, true);

rt.type(9287, "/obj/item/device/slime_scanner", "/obj/item/device", {
	flags: 64,
	throw_speed: 3,
	throw_range: 7,
	name: "slime scanner",
	desc: "A device that analyzes a slime's internal composition and measures its stats.",
	icon_state: "adv_spectrometer",
	item_state: "analyzer",
	origin_tech: "biotech=2",
	w_class: 2,
	throwforce: 0,
	materials: null,
});

// /obj/item/device/slime_scanner/proc/<init>  (code/game/objects/items/devices/scanners.dm:383)
rt.def("/obj/item/device/slime_scanner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30, "$glass", 20]));
	return f.dot;
});

// /obj/item/device/slime_scanner/proc/attack  (code/game/objects/items/devices/scanners.dm:386)
rt.def("/obj/item/device/slime_scanner/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	let _T: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [_T, $0, $1, $2];
	if ((truthy(rt.fv(f, "stat", live(user))) || truthy(rt.fv(f, "eye_blind", live(user))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(M), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This device can only scan slimes!</span>"]);
		return live(f.dot);
	}
	_T = live(M);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "Slime scan results:"]);
	$0 = live(user);
	$1 = rt.fv(f, "colour", live(_T));
	if (truthy(rt.fv(f, "is_adult", live(_T)))) {
		$2 = "adult";
	} else {
		$2 = "baby";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("＀ ＀ slime", [$1, $2])]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("Nutrition: ＀/＀", [rt.fv(f, "nutrition", live(_T)), rt.callName(f, live(_T), "get_max_nutrition", [])])]);
	if (rt.lt(rt.fv(f, "nutrition", live(_T)), rt.callName(f, live(_T), "get_starve_nutrition", []))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Warning: slime is starving!</span>"]);
	} else {
		if (rt.lt(rt.fv(f, "nutrition", live(_T)), rt.callName(f, live(_T), "get_hunger_nutrition", []))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Warning: slime is hungry</span>"]);
		}
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("Electric change strength: ＀", [rt.fv(f, "powerlevel", live(_T))])]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("Health: ＀", [multiply(rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "health", live(_T)), rt.fv(f, "maxHealth", live(_T))), 0.009999999776482582]), 100)])]);
	if (isEqual(rt.index(rt.fv(f, "slime_mutation", live(_T)), 4), rt.fv(f, "colour", live(_T)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "This slime does not evolve any further."]);
	} else {
		if (isEqual(rt.index(rt.fv(f, "slime_mutation", live(_T)), 3), rt.index(rt.fv(f, "slime_mutation", live(_T)), 4))) {
			if (isEqual(rt.index(rt.fv(f, "slime_mutation", live(_T)), 2), rt.index(rt.fv(f, "slime_mutation", live(_T)), 1))) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("Possible mutation: ＀", [rt.index(rt.fv(f, "slime_mutation", live(_T)), 3)])]);
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("Genetic destability: ＀ % chance of mutation on splitting", [divide(rt.fv(f, "mutation_chance", live(_T)), 2)])]);
			} else {
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("Possible mutations: ＀, ＀, ＀ (x2)", [rt.index(rt.fv(f, "slime_mutation", live(_T)), 1), rt.index(rt.fv(f, "slime_mutation", live(_T)), 2), rt.index(rt.fv(f, "slime_mutation", live(_T)), 3)])]);
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("Genetic destability: ＀ % chance of mutation on splitting", [rt.fv(f, "mutation_chance", live(_T))])]);
			}
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("Possible mutations: ＀, ＀, ＀, ＀", [rt.index(rt.fv(f, "slime_mutation", live(_T)), 1), rt.index(rt.fv(f, "slime_mutation", live(_T)), 2), rt.index(rt.fv(f, "slime_mutation", live(_T)), 3), rt.index(rt.fv(f, "slime_mutation", live(_T)), 4)])]);
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("Genetic destability: ＀ % chance of mutation on splitting", [rt.fv(f, "mutation_chance", live(_T))])]);
		}
	}
	if (rt.gt(rt.fv(f, "cores", live(_T)), 1)) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Anomalious slime core amount detected"]);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("Growth progress: ＀/＀", [rt.fv(f, "amount_grown", live(_T)), 10])]);
	return f.dot;
});
