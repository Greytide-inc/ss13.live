// Based on /tg/station's code/game/objects/items/devices/scanners.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


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

// scanners.dm:19
rt.def("/obj/item/device/t_scanner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 150]);
	return f.dot;
});

// scanners.dm:24
rt.def("/obj/item/device/t_scanner/proc/attack_self", function attack_self(f: Frame, user: Value) {
	this.on = (!this.on ? 1 : 0);
	this.icon_state = copytext(this.icon_state, 1, rt.length(this.icon_state)) + `${this.on}`;
	if (!this.on) return f.dot;
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
});

// scanners.dm:31
rt.def("/obj/item/device/t_scanner/proc/flick_sonar", function* flick_sonar(f: Frame, pipe: Value) {
	let MA: Value = null;
	if (!ismob(this.loc)) return f.dot;
	let M: Value = this.loc;
	let I: Value = (yield* new_(T("/image"), { loc: rt.getStep(f, pipe, 0) }));
	(MA = (yield* new_(T("/mutable_appearance"), pipe))).alpha = 128;
	I.appearance = MA;
	if (!M.client) return f.dot;
	yield* flick_overlay(I, list(M.client), 8);
	return f.dot;
}, true);

// scanners.dm:41
rt.def("/obj/item/device/t_scanner/proc/process", function* process(f: Frame) {
	if (!this.on) {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
		return null;
	}
	yield* this.scan();
	return f.dot;
}, true, { waitfor: false });

// scanners.dm:48
rt.def("/obj/item/device/t_scanner/proc/scan", function* scan(f: Frame) {
	let _T: Value = null, O: Value = null;
	for (_T of each(range(2, this.loc), T("/turf"))) {
		O = null;
		for (O of each(_T.contents, T("/obj"))) {
			if (O.level != 1) {
				continue;
			}
			if (O.invisibility == INVISIBILITY_MAXIMUM) {
				yield* this.flick_sonar(O);
			}
		}
	}
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

// scanners.dm:68
rt.def("/obj/item/device/healthanalyzer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 200]);
	return f.dot;
});

// scanners.dm:74
rt.def("/obj/item/device/healthanalyzer/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!this.scanmode) {
		to_chat(user, "<span class='notice'>You switch the health analyzer to scan chemical contents.</span>");
		this.scanmode = 1;
	} else {
		to_chat(user, "<span class='notice'>You switch the health analyzer to check physical health.</span>");
		this.scanmode = 0;
	}
	return f.dot;
});

// scanners.dm:84
rt.def("/obj/item/device/healthanalyzer/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if ((rt.bitAnd(user.disabilities, 256) || user.getBrainLoss() >= 60) && prob(50)) {
		to_chat(user, "<span class='notice'>You stupidly try to analyze the floor's vitals!</span>");
		user.visible_message(`<span class='warning'>${user} has analyzed the floor's vitals!</span>`);
		to_chat(user, "<span class='info'>Analyzing results for The floor:\n\tOverall status: <b>Healthy</b>");
		to_chat(user, "<span class='info'>Key: <font color='blue'>Suffocation</font>/<font color='green'>Toxin</font>/<font color='#FF8000'>Burn</font>/<font color='red'>Brute</font></span>");
		to_chat(user, "<span class='info'>\tDamage specifics: <font color='blue'>0</font>-<font color='green'>0</font>-<font color='#FF8000'>0</font>-<font color='red'>0</font></span>");
		to_chat(user, "<span class='info'>Body temperature: ???</span>");
		return f.dot;
	}
	user.visible_message(`<span class='notice'>${user} has analyzed ${M}'s vitals.</span>`);
	if (this.scanmode == 0) {
		healthscan(user, M, this.mode);
	} else if (this.scanmode == 1) {
		chemscan(user, M);
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// scanners.dm:105
rt.def("/proc/healthscan", function healthscan(f: Frame, user: Value, M: Value, mode: Value) {
	let H: Value = null, C: Value = null, damaged: Value = null, org: Value = null, tdelta: Value = null, D: Value = null, blood_id: Value = null, H_7: Value = null, blood_percent: Value = null, blood_type: Value = null, R: Value = null, cyberimp_detect: Value = null, CI: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	mode ??= 1;
	if (user.incapacitated() || user.eye_blind) {
		return f.dot;
	}
	let oxy_loss: Value = M.getOxyLoss();
	let tox_loss: Value = M.getToxLoss();
	let fire_loss: Value = M.getFireLoss();
	let brute_loss: Value = M.getBruteLoss();
	if (M.stat > 1) {
		$0 = "<span class='alert'><b>Deceased</b></span>";
	} else {
		$0 = `<b>${round(M.health / M.maxHealth, 0.01) * 100} % healthy</b>`;
	}
	let mob_status: Value = $0;
	if (rt.bitAnd(M.status_flags, FAKEDEATH)) {
		mob_status = "<span class='alert'>Deceased</span>";
		oxy_loss = max(rand(1, 40), oxy_loss, 300 - (tox_loss + fire_loss + brute_loss));
	}
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if ((H = M).undergoing_cardiac_arrest() && H.stat != 2) {
			to_chat(user, "<span class='danger'>Subject suffering from heart attack: Apply defibrillator immediately!</span>");
		}
	}
	to_chat(user, `<span class='info'>Analyzing results for ${M}:\n\tOverall status: ${mob_status}</span>`);
	if (brute_loss > 10) {
		$0 = user;
		if (brute_loss > 50) {
			$1 = "Severe";
		} else {
			$1 = "Minor";
		}
		to_chat($0, `\t<span class='alert'>${$1} tissue damage detected.</span>`);
	}
	if (fire_loss > 10) {
		$0 = user;
		if (fire_loss > 50) {
			$1 = "Severe";
		} else {
			$1 = "Minor";
		}
		to_chat($0, `\t<span class='alert'>${$1} burn damage detected.</span>`);
	}
	if (oxy_loss > 10) {
		$0 = user;
		if (oxy_loss > 50) {
			$1 = "Severe";
		} else {
			$1 = "Minor";
		}
		to_chat($0, `\t<span class='info'><span class='alert'>${$1} oxygen deprivation detected.</span>`);
	}
	if (tox_loss > 10) {
		$0 = user;
		if (tox_loss > 50) {
			$1 = "Critical";
		} else {
			$1 = "Dangerous";
		}
		to_chat($0, `\t<span class='alert'>${$1} amount of toxins detected.</span>`);
	}
	if (M.getStaminaLoss()) {
		to_chat(user, "\t<span class='alert'>Subject appears to be suffering from fatigue.</span>");
	}
	if (M.getCloneLoss()) {
		$0 = user;
		if (M.getCloneLoss() > 30) {
			$1 = "severe";
		} else {
			$1 = "minor";
		}
		to_chat($0, `\t<span class='alert'>Subject appears to have ${$1} cellular damage.</span>`);
	}
	if (M.reagents && M.reagents.get_reagent_amount("epinephrine")) {
		to_chat(user, `\t<span class='info'>Bloodstream analysis located ${M.reagents.get_reagent_amount("epinephrine")} units of rejuvenation chemicals.</span>`);
	}
	if (M.getBrainLoss() >= 100 || !M.getorgan(T("/obj/item/organ/brain"))) {
		to_chat(user, "\t<span class='alert'>Subject brain function is non-existent.</span>");
	} else if (M.getBrainLoss() >= 60) {
		to_chat(user, "\t<span class='alert'>Severe brain damage detected. Subject likely to have mental retardation.</span>");
	} else if (M.getBrainLoss() >= 10) {
		to_chat(user, "\t<span class='alert'>Brain damage detected. Subject may have had a concussion.</span>");
	}
	if (rt.istype(M, T("/mob/living/carbon")) && mode == 1) {
		C = M;
		if (rt.length((damaged = C.get_damaged_bodyparts(1, 1))) > 0 || oxy_loss > 0 || tox_loss > 0 || fire_loss > 0) {
			to_chat(user, `<span class='info'>\tDamage: <span class='info'><font color='red'>Brute</font></span>-<font color='#FF8000'>Burn</font>-<font color='green'>Toxin</font>-<font color='blue'>Suffocation</font>\n\t\tSpecifics: <font color='red'>${brute_loss}</font>-<font color='#FF8000'>${fire_loss}</font>-<font color='green'>${tox_loss}</font>-<font color='blue'>${oxy_loss}</font></span>`);
			for (org of each(damaged, T("/obj/item/bodypart"))) {
				$0 = user;
				$1 = capitalize(org.name);
				if (org.brute_dam > 0) {
					$2 = `<font color='red'>${org.brute_dam}</font></span>`;
				} else {
					$2 = "<font color='red'>0</font>";
				}
				if (org.burn_dam > 0) {
					$3 = `<font color='#FF8000'>${org.burn_dam}</font>`;
				} else {
					$3 = "<font color='#FF8000'>0</font>";
				}
				to_chat($0, `\t\t<span class='info'>${$1}: ${$2}-${$3}`);
			}
		}
	}
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		H = M;
		to_chat(user, `<span class='info'>Species: ${H.dna.species.name}</span>`);
	}
	to_chat(user, `<span class='info'>Body temperature: ${round(M.bodytemperature - T0C, 0.1)} &deg;C (${round(M.bodytemperature * 1.8 - 459.67, 0.1)} &deg;F)</span>`);
	if (M.tod && (M.stat == 2 || rt.bitAnd(M.status_flags, FAKEDEATH))) {
		to_chat(user, `<span class='info'>Time of Death:</span> ${M.tod}`);
		if ((tdelta = round(rt.worldTime(f) - M.timeofdeath)) < 1200) {
			to_chat(user, `<span class='danger'>Subject died ${tdelta / 10} seconds ago, defibrillation may be possible!</span>`);
		}
	}
	for (D of each(M.viruses, T("/datum/disease"))) {
		if (!rt.bitAnd(D.visibility_flags, HIDDEN_SCANNER)) {
			to_chat(user, `<span class='alert'><b>Warning: ${D.form} detected</b>\nName: ${D.name}.\nType: ${D.spread_text}.\nStage: ${D.stage}/${D.max_stages}.\nPossible Cure: ${D.cure_text}</span>`);
		}
	}
	if (!M.has_dna()) return f.dot;
	C = M;
	if (blood_id = C.get_blood_id()) {
		if (rt.istype(C, T("/mob/living/carbon/human"))) {
			if ((H_7 = C).bleed_rate) {
				to_chat(user, "<span class='danger'>Subject is bleeding!</span>");
			}
		}
		blood_percent = round(C.blood_volume / BLOOD_VOLUME_NORMAL * 100);
		blood_type = C.dna.blood_type;
		if (blood_id != "blood") {
			if (R = rt.index(GLOB.chemical_reagents_list, blood_id)) {
				blood_type = R.name;
			} else {
				blood_type = blood_id;
			}
		}
		if (C.blood_volume <= BLOOD_VOLUME_SAFE && C.blood_volume > BLOOD_VOLUME_OKAY) {
			to_chat(user, `<span class='danger'>LOW blood level ${blood_percent} %, ${C.blood_volume} cl,</span> <span class='info'>type: ${blood_type}</span>`);
		} else if (C.blood_volume <= BLOOD_VOLUME_OKAY) {
			to_chat(user, `<span class='danger'>CRITICAL blood level ${blood_percent} %, ${C.blood_volume} cl,</span> <span class='info'>type: ${blood_type}</span>`);
		} else {
			to_chat(user, `<span class='info'>Blood level ${blood_percent} %, ${C.blood_volume} cl, type: ${blood_type}</span>`);
		}
	}
	for (CI of each(C.internal_organs, T("/obj/item/organ/cyberimp"))) {
		if (CI.status == ORGAN_ROBOTIC) {
			cyberimp_detect += `${C.name} is modified with a ${CI.name}.<br>`;
		}
	}
	if (!cyberimp_detect) return f.dot;
	to_chat(user, "<span class='notice'>Detected cybernetic modifications:</span>");
	to_chat(user, `<span class='notice'>${cyberimp_detect}</span>`);
	return f.dot;
});

// scanners.dm:206
rt.def("/proc/chemscan", function chemscan(f: Frame, user: Value, M: Value) {
	let H: Value = null, R: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	if (!rt.istype(M, T("/mob/living/carbon/human"))) return f.dot;
	if (!(H = M).reagents) return f.dot;
	if (rt.len(f, H.reagents.reagent_list)) {
		to_chat(user, "<span class='notice'>Subject contains the following reagents:</span>");
		for (R of each(H.reagents.reagent_list, T("/datum/reagent"))) {
			$0 = user;
			$1 = R.volume;
			$2 = R.name;
			if (R.overdosed == 1) {
				$3 = "</span> - <span class='boldannounce'>OVERDOSING</span>";
			} else {
				$3 = ".</span>";
			}
			to_chat($0, `<span class='notice'>${$1} units of ${$2}${$3}`);
		}
	} else {
		to_chat(user, "<span class='notice'>Subject contains no reagents.</span>");
	}
	if (rt.len(f, H.reagents.addiction_list)) {
		to_chat(user, "<span class='boldannounce'>Subject is addicted to the following reagents:</span>");
		R = null;
		for (R of each(H.reagents.addiction_list, T("/datum/reagent"))) {
			to_chat(user, `<span class='danger'>${R.name}</span>`);
		}
	} else {
		to_chat(user, "<span class='notice'>Subject is not addicted to any reagents.</span>");
	}
	return f.dot;
});

// scanners.dm:226
rt.def("/obj/item/device/healthanalyzer/verb/toggle_mode", function toggle_mode(f: Frame) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	this.mode = (!this.mode ? 1 : 0);
	if (this.mode === 1) {
		to_chat(f.usr, "The scanner now shows specific limb damage.");
	} else if (this.mode === 0) {
		to_chat(f.usr, "The scanner no longer shows limb damage.");
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

// scanners.dm:248
rt.def("/obj/item/device/analyzer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 30, "$glass", 20]);
	return f.dot;
});

// scanners.dm:253
rt.def("/obj/item/device/analyzer/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let location: Value = null, id: Value = null, gas_concentration: Value = null;
	yield* this.add_fingerprint(user);
	if (user.stat || user.eye_blind) {
		return f.dot;
	}
	if (!rt.istype((location = user.loc), T("/turf"))) {
		return f.dot;
	}
	let environment: Value = location.return_air();
	let pressure: Value = environment.return_pressure();
	let total_moles: Value = environment.total_moles();
	to_chat(user, "<span class='info'><B>Results:</B></span>");
	if (rt.op(f, "Abs", [], [pressure - ONE_ATMOSPHERE]) < 10) {
		to_chat(user, `<span class='info'>Pressure: ${round(pressure, 0.1)} kPa</span>`);
	} else {
		to_chat(user, `<span class='alert'>Pressure: ${round(pressure, 0.1)} kPa</span>`);
	}
	if (!total_moles) return f.dot;
	let env_gases: Value = environment.gases;
	yield* g.callName(f, environment, "assert_gases", [GLOB.hardcoded_gases], rt.Args.List);
	let o2_concentration: Value = rt.index(rt.at(env_gases, "o2"), 1) / total_moles;
	let n2_concentration: Value = rt.index(rt.at(env_gases, "n2"), 1) / total_moles;
	let co2_concentration: Value = rt.index(rt.at(env_gases, "co2"), 1) / total_moles;
	let plasma_concentration: Value = rt.index(rt.at(env_gases, "plasma"), 1) / total_moles;
	environment.garbage_collect();
	if (rt.op(f, "Abs", [], [n2_concentration - 0.79]) < 20) {
		to_chat(user, `<span class='info'>Nitrogen: ${round(n2_concentration * 100, 0.01)} %</span>`);
	} else {
		to_chat(user, `<span class='alert'>Nitrogen: ${round(n2_concentration * 100, 0.01)} %</span>`);
	}
	if (rt.op(f, "Abs", [], [o2_concentration - 0.21]) < 2) {
		to_chat(user, `<span class='info'>Oxygen: ${round(o2_concentration * 100, 0.01)} %</span>`);
	} else {
		to_chat(user, `<span class='alert'>Oxygen: ${round(o2_concentration * 100, 0.01)} %</span>`);
	}
	if (co2_concentration > 0.01) {
		to_chat(user, `<span class='alert'>CO2: ${round(co2_concentration * 100, 0.01)} %</span>`);
	} else {
		to_chat(user, `<span class='info'>CO2: ${round(co2_concentration * 100, 0.01)} %</span>`);
	}
	if (plasma_concentration > 0.005) {
		to_chat(user, `<span class='alert'>Plasma: ${round(plasma_concentration * 100, 0.01)} %</span>`);
	} else {
		to_chat(user, `<span class='info'>Plasma: ${round(plasma_concentration * 100, 0.01)} %</span>`);
	}
	for (id of each(env_gases)) {
		if (rt.isIn(f, id, GLOB.hardcoded_gases)) {
			continue;
		}
		gas_concentration = rt.index(rt.index(env_gases, id), 1) / total_moles;
		to_chat(user, `<span class='alert'>${rt.index(rt.index(rt.index(env_gases, id), 3), 2)}: ${round(gas_concentration * 100, 0.01)} %</span>`);
	}
	to_chat(user, `<span class='info'>Temperature: ${round(environment.temperature - T0C)} &deg;C</span>`);
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

// scanners.dm:323
rt.def("/obj/item/device/mass_spectrometer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 150, "$glass", 100]);
	return f.dot;
});

// scanners.dm:328
rt.def("/obj/item/device/mass_spectrometer/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.create_reagents(5);
	return f.dot;
}, true);

// scanners.dm:332
rt.def("/obj/item/device/mass_spectrometer/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	if (this.reagents.total_volume) {
		this.icon_state = rt.initial(f, this, "icon_state") + "_s";
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
	}
	return f.dot;
});

// scanners.dm:338
rt.def("/obj/item/device/mass_spectrometer/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let R: Value = null, R_2: Value = null;
	if (user.stat || user.eye_blind) {
		return f.dot;
	}
	if (!user.IsAdvancedToolUser()) {
		to_chat(user, "<span class='warning'>You don't have the dexterity to do this!</span>");
		return f.dot;
	}
	if (!this.reagents.total_volume) return f.dot;
	let blood_traces: Value = list();
	for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
		if (R.id != "blood") {
			yield* this.reagents.clear_reagents();
			to_chat(user, "<span class='warning'>The sample was contaminated! Please insert another sample.</span>");
			return f.dot;
		} else {
			blood_traces = params2list(rt.index(R.data, "trace_chem"));
			break;
		}
	}
	let dat: Value = "<i><b>Trace Chemicals Found:</b>";
	if (!rt.len(f, blood_traces)) {
		dat += "<br>None";
	} else {
		for (R_2 of each(blood_traces)) {
			dat += `<br>${rt.index(GLOB.chemical_reagents_list, R_2)}`;
			if (this.details) {
				dat += ` (${rt.index(blood_traces, R_2)} units)`;
			}
		}
	}
	dat += "</i>";
	to_chat(user, dat);
	yield* this.reagents.clear_reagents();
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

// scanners.dm:383
rt.def("/obj/item/device/slime_scanner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 30, "$glass", 20]);
	return f.dot;
});

// scanners.dm:386
rt.def("/obj/item/device/slime_scanner/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	if (user.stat || user.eye_blind) {
		return f.dot;
	}
	if (!rt.istype(M, T("/mob/living/simple_animal/slime"))) {
		to_chat(user, "<span class='warning'>This device can only scan slimes!</span>");
		return f.dot;
	}
	let _T: Value = M;
	to_chat(user, "Slime scan results:");
	let $0: any = user;
	let $1: any = _T.colour;
	to_chat($0, `${$1} ${_T.is_adult ? "adult" : "baby"} slime`);
	to_chat(user, `Nutrition: ${_T.nutrition}/${_T.get_max_nutrition()}`);
	if (_T.nutrition < _T.get_starve_nutrition()) {
		to_chat(user, "<span class='warning'>Warning: slime is starving!</span>");
	} else if (_T.nutrition < _T.get_hunger_nutrition()) {
		to_chat(user, "<span class='warning'>Warning: slime is hungry</span>");
	}
	to_chat(user, `Electric change strength: ${_T.powerlevel}`);
	to_chat(user, `Health: ${round(_T.health / _T.maxHealth, 0.01) * 100}`);
	if (rt.index(_T.slime_mutation, 4) == _T.colour) {
		to_chat(user, "This slime does not evolve any further.");
	} else if (rt.index(_T.slime_mutation, 3) == rt.index(_T.slime_mutation, 4)) {
		if (rt.index(_T.slime_mutation, 2) == rt.index(_T.slime_mutation, 1)) {
			to_chat(user, `Possible mutation: ${rt.index(_T.slime_mutation, 3)}`);
			to_chat(user, `Genetic destability: ${_T.mutation_chance / 2} % chance of mutation on splitting`);
		} else {
			to_chat(user, `Possible mutations: ${rt.index(_T.slime_mutation, 1)}, ${rt.index(_T.slime_mutation, 2)}, ${rt.index(_T.slime_mutation, 3)} (x2)`);
			to_chat(user, `Genetic destability: ${_T.mutation_chance} % chance of mutation on splitting`);
		}
	} else {
		to_chat(user, `Possible mutations: ${rt.index(_T.slime_mutation, 1)}, ${rt.index(_T.slime_mutation, 2)}, ${rt.index(_T.slime_mutation, 3)}, ${rt.index(_T.slime_mutation, 4)}`);
		to_chat(user, `Genetic destability: ${_T.mutation_chance} % chance of mutation on splitting`);
	}
	if (_T.cores > 1) {
		to_chat(user, "Anomalious slime core amount detected");
	}
	to_chat(user, `Growth progress: ${_T.amount_grown}/${SLIME_EVOLUTION_THRESHOLD}`);
	return f.dot;
});
