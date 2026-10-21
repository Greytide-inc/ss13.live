// From code/modules/power/supermatter/supermatter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10329, "/obj/machinery/power/supermatter_shard", "/obj/machinery/power", {
	gasefficency: 0.125,
	base_icon_state: "darkmatter_shard",
	damage: 0,
	damage_archived: 0,
	safe_alert: "Crystalline hyperstructure returning to safe operating levels.",
	warning_point: 50,
	warning_alert: "Danger! Crystal hyperstructure instability!",
	damage_penalty_point: 550,
	emergency_point: 700,
	emergency_alert: "CRYSTAL DELAMINATION IMMINENT.",
	explosion_point: 900,
	emergency_issued: 0,
	explosion_power: 12,
	temp_factor: 30,
	lastwarning: 0,
	power: 0,
	n2comp: 0,
	freoncomp: 0,
	plasmacomp: 0,
	o2comp: 0,
	co2comp: 0,
	n2ocomp: 0,
	combined_gas: 0,
	gasmix_power_ratio: 0,
	dynamic_heat_modifier: 1,
	dynamic_heat_resistance: 1,
	powerloss_inhibitor: 1,
	powerloss_dynamic_scaling: 0,
	power_transmission_bonus: 0,
	mole_heat_penalty: 0,
	freon_transmit_modifier: 1,
	matter_power: 0,
	config_bullet_energy: 2,
	config_hallucination_power: 0.1,
	radio: null,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_eng"),
	engineering_channel: "Engineering",
	common_channel: null,
	has_been_powered: 0,
	has_reached_emergency: 0,
	takes_damage: 1,
	produces_gas: 1,
	countdown: null,
	anchored: 0,
	light_range: 4,
	name: "supermatter shard",
	desc: "A strangely translucent and iridescent crystal that looks like it used to be part of a larger structure.",
	icon: rt.rsc("icons/obj/supermatter.dmi"),
	icon_state: "darkmatter_shard",
	density: 1,
	resistance_flags: 115,
	critical_machine: 1,
});

// /obj/machinery/power/supermatter_shard/proc/Initialize  (code/modules/power/supermatter/supermatter.dm:138)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), add);
	rt.setSv(f, "countdown", (yield* g.new_(f, T("/obj/effect/countdown/supermatter"), [live(f.src)])));
	yield* g.callName(f, rt.sv(f, "countdown"), "start", []);
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/device/radio"), [live(f.src)])));
	rt.setFv(f, "keyslot", rt.sv(f, "radio"), (yield* g.new_(f, rt.sv(f, "radio_key"), [])));
	rt.setFv(f, "listening", rt.sv(f, "radio"), 0);
	yield* g.callName(f, rt.sv(f, "radio"), "recalculateChannels", []);
	yield* g.srcCall(f, "investigate_log", "has been created.", "supermatter");
	return f.dot;
}, true);

// /obj/machinery/power/supermatter_shard/proc/Destroy  (code/modules/power/supermatter/supermatter.dm:151)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "investigate_log", "has been destroyed.", "supermatter");
	(rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "radio")]);
	rt.setSv(f, "radio", null);
	(rt.modGl("poi_list", live(f.src), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "countdown")]);
	rt.setSv(f, "countdown", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/power/supermatter_shard/proc/examine  (code/modules/power/supermatter/supermatter.dm:159)
rt.def("/obj/machinery/power/supermatter_shard/proc/examine", function examine(f: Frame) {
	let range: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [range, H, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	range = rt.call(f, P("/proc/min"), null, [7, rt.call(f, P("/proc/round"), null, [rt.power(rt.sv(f, "power"), 0.25)])]);
	H = null;
	rt.forList(f, 0, rt.call(f, P("/proc/viewers"), null, [live(range), live(f.src)]), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (!isEqual(live(H), live(f.args[0]))) {
			continue;
		}
		if (!truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/meson")) ? 1 : 0))) {
			rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>You get headaches just from looking at it.</span>"]);
		}
		return live(f.dot);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/power/supermatter_shard/proc/get_spans  (code/modules/power/supermatter/supermatter.dm:172)
rt.def("/obj/machinery/power/supermatter_shard/proc/get_spans", function get_spans(f: Frame) {
	return rt.list("robot");
});

// /obj/machinery/power/supermatter_shard/proc/get_status  (code/modules/power/supermatter/supermatter.dm:177)
rt.def("/obj/machinery/power/supermatter_shard/proc/get_status", function get_status(f: Frame) {
	let _T: Value = null, air: Value = null;
	f.vars = () => [_T, air];
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) {
		return -1;
	}
	if (!truthy((air = rt.callName(f, live(_T), "return_air", [])))) {
		return -1;
	}
	if (rt.lt(rt.callSrc(f, "get_integrity", []), 5)) {
		return 6;
	}
	if (rt.lt(rt.callSrc(f, "get_integrity", []), 25)) {
		return 5;
	}
	if (rt.lt(rt.callSrc(f, "get_integrity", []), 50)) {
		return 4;
	}
	if ((rt.lt(rt.callSrc(f, "get_integrity", []), 100) || rt.gt(rt.fv(f, "temperature", live(air)), 10000))) {
		return 3;
	}
	if (rt.gt(rt.fv(f, "temperature", live(air)), 8000)) {
		return 2;
	}
	if (rt.gt(rt.sv(f, "power"), 5)) {
		return 1;
	}
	return 0;
});

// /obj/machinery/power/supermatter_shard/proc/get_integrity  (code/modules/power/supermatter/supermatter.dm:204)
rt.def("/obj/machinery/power/supermatter_shard/proc/get_integrity", function get_integrity(f: Frame) {
	let integrity: Value = null;
	let $0: any;
	f.vars = () => [integrity, $0];
	integrity = divide(rt.sv(f, "damage"), rt.sv(f, "explosion_point"));
	if (rt.lt((integrity = rt.call(f, P("/proc/round"), null, [subtract(100, multiply(live(integrity), 100))])), 0)) {
		$0 = 0;
	} else {
		$0 = live(integrity);
	}
	return (integrity = $0);
});

// /obj/machinery/power/supermatter_shard/proc/explode  (code/modules/power/supermatter/supermatter.dm:210)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/explode", function* explode(f: Frame) {
	let _T: Value = null, M: Value = null, S: Value = null, E: Value = null;
	let $e: any;
	f.vars = () => [_T, M, S, E, $e];
	_T = rt.getStep(f, live(f.src), 0);
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "z", live(M)), rt.sv(f, "z"))) {
			rt.op(f, "Output", [], [live(M), rt.rsc("sound/magic/charge.ogg")], false);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='boldannounce'>You feel reality distort for a moment...</span>"]);
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.sv(f, "combined_gas"), 1800)) {
		yield* g.srcCall(f, "investigate_log", "has collapsed into a singularity.", "supermatter");
		if (truthy(live(_T))) {
			rt.setFv(f, "energy", (S = (yield* g.new_(f, T("/obj/singularity"), [live(_T)]))), 800);
			yield* g.callName(f, live(S), "consume", [live(f.src)]);
		}
	} else {
		yield* g.srcCall(f, "investigate_log", "has exploded.", "supermatter");
		yield* g.call(f, P("/proc/explosion"), null, [rt.getStep(f, live(_T), 0), multiply(multiply(rt.sv(f, "explosion_power"), (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "gasmix_power_ratio"), 0.20499999821186066]))), 0.5), add(multiply(rt.sv(f, "explosion_power"), (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "gasmix_power_ratio"), 0.20499999821186066]))), 2), add(multiply(rt.sv(f, "explosion_power"), (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "gasmix_power_ratio"), 0.20499999821186066]))), 4), add(multiply(rt.sv(f, "explosion_power"), (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "gasmix_power_ratio"), 0.20499999821186066]))), 6), 1, 1]);
		if (rt.gt(rt.sv(f, "power"), 5000)) {
			yield* g.srcCall(f, "investigate_log", "has spawned additional energy balls.", "supermatter");
			rt.setFv(f, "energy", (E = (yield* g.new_(f, T("/obj/singularity/energy_ball"), [live(_T)]))), rt.sv(f, "power"));
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/machinery/power/supermatter_shard/proc/process_atmos  (code/modules/power/supermatter/supermatter.dm:231)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/process_atmos", function* process_atmos(f: Frame) {
	let _T: Value = null, env: Value = null, removed: Value = null, removed_matter: Value = null, temp_factor: Value = null, device_energy: Value = null, l: Value = null, D: Value = null, rads: Value = null, stability: Value = null, mob: Value = null, L: Value = null, H: Value = null, rads_7: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [_T, env, removed, removed_matter, temp_factor, device_energy, l, D, rads, stability, mob, L, H, rads_7, $0, $1, $2, $e];
	if ((_T = rt.sv(f, "loc")) === null) {
		return 26;
	}
	if (!truthy((rt.istype(live(_T), T("/turf")) ? 1 : 0))) {
		return live(f.dot);
	}
	env = (yield* g.callName(f, live(_T), "return_air", []));
	removed = null;
	if (truthy(rt.sv(f, "produces_gas"))) {
		removed = (yield* g.callName(f, live(env), "remove", [multiply(rt.sv(f, "gasefficency"), (yield* g.callName(f, live(env), "total_moles", [])))]));
	} else {
		removed = (yield* g.new_(f, T("/datum/gas_mixture"), []));
	}
	if (((!truthy(live(removed)) || !truthy((yield* g.callName(f, live(removed), "total_moles", [])))) || truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)))) {
		if (truthy(rt.sv(f, "takes_damage"))) {
			rt.modSrcVar(f, "damage", (yield* g.call(f, P("/proc/max"), null, [divide(subtract(rt.sv(f, "power"), 1600), 10), 0])), add);
		}
		return 1;
	}
	rt.setSv(f, "damage_archived", rt.sv(f, "damage"));
	if (truthy(rt.sv(f, "takes_damage"))) {
		rt.setSv(f, "damage", (yield* g.call(f, P("/proc/max"), null, [add(rt.sv(f, "damage"), multiply(divide(multiply((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "temperature", live(removed)), multiply(313.1499938964844, rt.sv(f, "dynamic_heat_resistance"))), 0])), rt.sv(f, "mole_heat_penalty")), 150), 0.25)), 0])));
		rt.setSv(f, "damage", (yield* g.call(f, P("/proc/max"), null, [add(rt.sv(f, "damage"), multiply(divide((yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "power"), 5000), 0])), 500), 0.25)), 0])));
		rt.setSv(f, "damage", (yield* g.call(f, P("/proc/max"), null, [add(rt.sv(f, "damage"), multiply(divide((yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "combined_gas"), 1800), 0])), 80), 0.25)), 0])));
		if (rt.lt(rt.sv(f, "combined_gas"), 1800)) {
			rt.setSv(f, "damage", (yield* g.call(f, P("/proc/max"), null, [add(rt.sv(f, "damage"), divide((yield* g.call(f, P("/proc/min"), null, [subtract(rt.fv(f, "temperature", live(removed)), 313.1499938964844), 0])), 150)), 0])));
		}
		rt.setSv(f, "damage", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "damage_archived"), multiply(0.0024999999441206455, rt.sv(f, "explosion_point"))), rt.sv(f, "damage")])));
		if ((rt.gt(rt.sv(f, "damage"), rt.sv(f, "damage_archived")) && truthy(rt.op(f, "Prob", [], [10])))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/empulse.ogg"), 50, 1]);
		}
	}
	yield* g.callName(f, live(removed), "assert_gases", ["o2", "plasma", "co2", "n2o", "n2", "freon"]);
	rt.setSv(f, "combined_gas", (yield* g.call(f, P("/proc/max"), null, [(yield* g.callName(f, live(removed), "total_moles", [])), 0])));
	rt.setSv(f, "plasmacomp", (yield* g.call(f, P("/proc/max"), null, [divide(rt.index(rt.index(rt.fv(f, "gases", live(removed)), "plasma"), 1), rt.sv(f, "combined_gas")), 0])));
	rt.setSv(f, "o2comp", (yield* g.call(f, P("/proc/max"), null, [divide(rt.index(rt.index(rt.fv(f, "gases", live(removed)), "o2"), 1), rt.sv(f, "combined_gas")), 0])));
	rt.setSv(f, "co2comp", (yield* g.call(f, P("/proc/max"), null, [divide(rt.index(rt.index(rt.fv(f, "gases", live(removed)), "co2"), 1), rt.sv(f, "combined_gas")), 0])));
	rt.setSv(f, "n2ocomp", (yield* g.call(f, P("/proc/max"), null, [divide(rt.index(rt.index(rt.fv(f, "gases", live(removed)), "n2o"), 1), rt.sv(f, "combined_gas")), 0])));
	rt.setSv(f, "n2comp", (yield* g.call(f, P("/proc/max"), null, [divide(rt.index(rt.index(rt.fv(f, "gases", live(removed)), "n2"), 1), rt.sv(f, "combined_gas")), 0])));
	rt.setSv(f, "freoncomp", (yield* g.call(f, P("/proc/max"), null, [divide(rt.index(rt.index(rt.fv(f, "gases", live(removed)), "freon"), 1), rt.sv(f, "combined_gas")), 0])));
	rt.setSv(f, "gasmix_power_ratio", (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [subtract(subtract(add(add(rt.sv(f, "plasmacomp"), rt.sv(f, "o2comp")), rt.sv(f, "co2comp")), rt.sv(f, "n2comp")), rt.sv(f, "freoncomp")), 0])), 1])));
	rt.setSv(f, "dynamic_heat_modifier", (yield* g.call(f, P("/proc/max"), null, [add(add(add(multiply(rt.sv(f, "plasmacomp"), 15), multiply(rt.sv(f, "o2comp"), 1)), multiply(rt.sv(f, "co2comp"), 0.10000000149011612)), multiply(rt.sv(f, "n2comp"), -1.5)), 0.5])));
	rt.setSv(f, "dynamic_heat_resistance", (yield* g.call(f, P("/proc/max"), null, [multiply(rt.sv(f, "n2ocomp"), 6), 1])));
	rt.setSv(f, "power_transmission_bonus", (yield* g.call(f, P("/proc/max"), null, [add(multiply(rt.sv(f, "plasmacomp"), 4), multiply(rt.sv(f, "o2comp"), 1.5)), 0])));
	rt.setSv(f, "freon_transmit_modifier", (yield* g.call(f, P("/proc/max"), null, [subtract(1, multiply(rt.sv(f, "freoncomp"), 0.75)), 0])));
	rt.setSv(f, "mole_heat_penalty", (yield* g.call(f, P("/proc/max"), null, [divide(rt.sv(f, "combined_gas"), 350), 0.25])));
	if ((rt.gt(rt.sv(f, "combined_gas"), 20) && rt.gt(rt.sv(f, "co2comp"), 0.20000000298023224))) {
		rt.setSv(f, "powerloss_dynamic_scaling", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "powerloss_dynamic_scaling"), (yield* g.call(f, P("/proc/max"), null, [-0.019999999552965164, (yield* g.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "co2comp"), rt.sv(f, "powerloss_dynamic_scaling")), 0.019999999552965164]))]))), 1]))])));
	} else {
		rt.setSv(f, "powerloss_dynamic_scaling", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "powerloss_dynamic_scaling"), 0.05000000074505806), 1]))])));
	}
	rt.setSv(f, "powerloss_inhibitor", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [subtract(1, multiply(rt.sv(f, "powerloss_dynamic_scaling"), (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [divide(rt.sv(f, "combined_gas"), 500), 1.5]))])))), 1]))])));
	if (truthy(rt.sv(f, "matter_power"))) {
		removed_matter = (yield* g.call(f, P("/proc/max"), null, [divide(rt.sv(f, "matter_power"), 10), 40]));
		rt.setSv(f, "power", (yield* g.call(f, P("/proc/max"), null, [add(rt.sv(f, "power"), live(removed_matter)), 0])));
		rt.setSv(f, "matter_power", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "matter_power"), live(removed_matter)), 0])));
	}
	temp_factor = 50;
	if (rt.gt(rt.sv(f, "gasmix_power_ratio"), 0.800000011920929)) {
		rt.setSv(f, "icon_state", fmt("＀_glow", [rt.sv(f, "base_icon_state")]));
	} else {
		temp_factor = 30;
		rt.setSv(f, "icon_state", rt.sv(f, "base_icon_state"));
	}
	rt.setSv(f, "power", (yield* g.call(f, P("/proc/max"), null, [add(multiply(divide(multiply(rt.fv(f, "temperature", live(removed)), live(temp_factor)), 273.1499938964844), rt.sv(f, "gasmix_power_ratio")), rt.sv(f, "power")), 0])));
	yield* g.srcCall(f, "transfer_energy");
	device_energy = multiply(rt.sv(f, "power"), 0.550000011920929);
	rt.modField(f, live(removed), "temperature", divide(multiply(live(device_energy), rt.sv(f, "dynamic_heat_modifier")), 5), add);
	rt.setFv(f, "temperature", live(removed), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "temperature", live(removed)), multiply(2500, rt.sv(f, "dynamic_heat_modifier"))]))])));
	rt.modAt(rt.index(rt.fv(f, "gases", live(removed)), "plasma"), 1, (yield* g.call(f, P("/proc/max"), null, [divide(multiply(live(device_energy), rt.sv(f, "dynamic_heat_modifier")), 750), 0])), add);
	rt.modAt(rt.index(rt.fv(f, "gases", live(removed)), "o2"), 1, (yield* g.call(f, P("/proc/max"), null, [divide(subtract(add(live(device_energy), multiply(rt.fv(f, "temperature", live(removed)), rt.sv(f, "dynamic_heat_modifier"))), 273.1499938964844), 325), 0])), add);
	if (rt.lt(rt.sv(f, "combined_gas"), 50)) {
		rt.setAt(rt.index(rt.fv(f, "gases", live(removed)), "freon"), 1, (yield* g.call(f, P("/proc/max"), null, [divide(multiply(add(rt.index(rt.index(rt.fv(f, "gases", live(removed)), "freon"), 1), live(device_energy)), rt.sv(f, "freoncomp")), 100), 0])));
	}
	if (truthy(rt.sv(f, "produces_gas"))) {
		yield* g.callName(f, live(env), "merge", [live(removed)]);
		yield* g.srcCall(f, "air_update_turf");
	}
	l = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [live(f.src), (yield* g.call(f, P("/proc/min"), null, [7, (yield* g.call(f, P("/proc/round"), null, [rt.power(rt.sv(f, "power"), 0.25)]))]))])), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		l = $e;
		if (!truthy((rt.istype(rt.fv(f, "glasses", live(l)), T("/obj/item/clothing/glasses/meson")) ? 1 : 0))) {
			D = rt.op(f, "Sqrt", [], [divide(1, (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/get_dist"), null, [live(l), live(f.src)]))])))]);
			rt.modField(f, live(l), "hallucination", multiply(multiply(rt.sv(f, "power"), rt.sv(f, "config_hallucination_power")), live(D)), add);
			rt.setFv(f, "hallucination", live(l), (yield* g.call(f, P("/proc/max"), null, [200, (yield* g.call(f, P("/proc/min"), null, [0, rt.fv(f, "hallucination", live(l))]))])));
		}
	}
	rt.endFor(f, 0);
	l = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [live(f.src), (yield* g.call(f, P("/proc/round"), null, [rt.power(divide(rt.sv(f, "power"), 100), 0.25)]))])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		l = $e;
		rads = multiply(divide(rt.sv(f, "power"), 10), rt.op(f, "Sqrt", [], [divide(1, (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/get_dist"), null, [live(l), live(f.src)])), 1])))]));
		yield* g.callName(f, live(l), "rad_act", [live(rads)]);
	}
	rt.endFor(f, 0);
	if ((rt.gt(rt.sv(f, "power"), 5000) || rt.gt(rt.sv(f, "damage"), rt.sv(f, "damage_penalty_point")))) {
		if (rt.gt(rt.sv(f, "power"), 5000)) {
			yield* g.call(f, P("/proc/playsound"), null, [null, rt.fv(f, "loc", live(f.src)), null, rt.rsc("sound/weapons/emitter2.ogg"), null, 100, null, 1, "extrarange", 10], rt.Args.Named);
			yield* g.srcCall(f, "supermatter_zap", live(f.src), 5, (yield* g.call(f, P("/proc/min"), null, [multiply(rt.sv(f, "power"), 2), 20000])));
			yield* g.srcCall(f, "supermatter_zap", live(f.src), 5, (yield* g.call(f, P("/proc/min"), null, [multiply(rt.sv(f, "power"), 2), 20000])));
			if (rt.gt(rt.sv(f, "power"), 7000)) {
				yield* g.srcCall(f, "supermatter_zap", live(f.src), 5, (yield* g.call(f, P("/proc/min"), null, [multiply(rt.sv(f, "power"), 2), 20000])));
				if (rt.gt(rt.sv(f, "power"), 9000)) {
					yield* g.srcCall(f, "supermatter_zap", live(f.src), 5, (yield* g.call(f, P("/proc/min"), null, [multiply(rt.sv(f, "power"), 2), 20000])));
				}
			}
		} else {
			if ((rt.gt(rt.sv(f, "damage"), rt.sv(f, "damage_penalty_point")) && truthy(rt.op(f, "Prob", [], [20])))) {
				yield* g.call(f, P("/proc/playsound"), null, [null, rt.fv(f, "loc", live(f.src)), null, rt.rsc("sound/weapons/emitter2.ogg"), null, 100, null, 1, "extrarange", 10], rt.Args.Named);
				yield* g.srcCall(f, "supermatter_zap", live(f.src), 5, (yield* g.call(f, P("/proc/max"), null, [4000, (yield* g.call(f, P("/proc/min"), null, [multiply(rt.sv(f, "power"), 2), 20000]))])));
			}
		}
		if ((truthy(rt.op(f, "Prob", [], [15])) && rt.gt(rt.sv(f, "power"), 5000))) {
			yield* g.srcCall(f, "supermatter_pull", live(f.src), divide(rt.sv(f, "power"), 750));
		}
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.srcCall(f, "supermatter_anomaly_gen", live(f.src), "flux_anomaly", (yield* g.call(f, P("/proc/rand"), null, [5, 10])));
		}
		if (((rt.gt(rt.sv(f, "power"), 7000) && truthy(rt.op(f, "Prob", [], [5]))) || truthy(rt.op(f, "Prob", [], [1])))) {
			yield* g.srcCall(f, "supermatter_anomaly_gen", live(f.src), "gravitational_anomaly", (yield* g.call(f, P("/proc/rand"), null, [5, 10])));
		}
		if (((rt.gt(rt.sv(f, "power"), 7000) && truthy(rt.op(f, "Prob", [], [2]))) || (truthy(rt.op(f, "Prob", [], [0.30000001192092896])) && rt.gt(rt.sv(f, "power"), 5000)))) {
			yield* g.srcCall(f, "supermatter_anomaly_gen", live(f.src), "pyro_anomaly", (yield* g.call(f, P("/proc/rand"), null, [5, 10])));
		}
	}
	if (rt.gt(rt.sv(f, "damage"), rt.sv(f, "warning_point"))) {
		$0 = rt.fv(f, "timeofday", rt.world());
		$1 = 864000;
		if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
			$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
		} else {
			$2 = rt.gl("midnight_rollovers");
		}
		if (rt.ge(divide(subtract(add($0, multiply($1, $2)), rt.sv(f, "lastwarning")), 10), 60)) {
			stability = (yield* g.call(f, P("/proc/num2text"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.sv(f, "damage"), rt.sv(f, "explosion_point")), 100)]))]));
			if (rt.gt(rt.sv(f, "damage"), rt.sv(f, "emergency_point"))) {
				yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), fmt("＀ Instability: ＀%", [rt.sv(f, "emergency_alert"), live(stability)]), rt.sv(f, "common_channel"), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
				$0 = rt.fv(f, "timeofday", rt.world());
				$1 = 864000;
				if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
					$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
				} else {
					$2 = rt.gl("midnight_rollovers");
				}
				rt.setSv(f, "lastwarning", add($0, multiply($1, $2)));
				if (!truthy(rt.sv(f, "has_reached_emergency"))) {
					yield* g.srcCall(f, "investigate_log", "has reached the emergency point for the first time.", "supermatter");
					yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has reached the emergency point ＀.", [live(f.src), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
					rt.setSv(f, "has_reached_emergency", 1);
				}
			} else {
				if (rt.ge(rt.sv(f, "damage"), rt.sv(f, "damage_archived"))) {
					yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), fmt("＀ Instability: ＀%", [rt.sv(f, "warning_alert"), live(stability)]), rt.sv(f, "engineering_channel"), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
					$0 = rt.fv(f, "timeofday", rt.world());
					$1 = 864000;
					if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
						$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
					} else {
						$2 = rt.gl("midnight_rollovers");
					}
					rt.setSv(f, "lastwarning", subtract(add($0, multiply($1, $2)), 300));
				} else {
					yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), fmt("＀ Instability: ＀%", [rt.sv(f, "safe_alert"), live(stability)]), rt.sv(f, "engineering_channel"), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
					$0 = rt.fv(f, "timeofday", rt.world());
					$1 = 864000;
					if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
						$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
					} else {
						$2 = rt.gl("midnight_rollovers");
					}
					rt.setSv(f, "lastwarning", add($0, multiply($1, $2)));
				}
			}
			if (rt.gt(rt.sv(f, "power"), 5000)) {
				yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), "Warning: Hyperstructure has reached dangerous power level.", rt.sv(f, "engineering_channel"), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
				if (rt.lt(rt.sv(f, "powerloss_inhibitor"), 0.5)) {
					yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), "DANGER: CHARGE INERTIA CHAIN REACTION IN PROGRESS.", rt.sv(f, "engineering_channel"), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
				}
			}
			if (rt.gt(rt.sv(f, "combined_gas"), 1800)) {
				yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), "Warning: Critical coolant mass reached.", rt.sv(f, "engineering_channel"), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
			}
		}
		if (rt.gt(rt.sv(f, "damage"), rt.sv(f, "explosion_point"))) {
			mob = null;
			rt.forList(f, 0, rt.gl("living_mob_list"));
			while (($e = rt.next(f, 0)) !== undefined) {
				mob = $e;
				if ((truthy((rt.istype((L = live(mob)), T("/mob/living")) ? 1 : 0)) && isEqual(rt.fv(f, "z", live(L)), rt.sv(f, "z")))) {
					if (truthy((rt.istype(live(mob), T("/mob/living/carbon/human")) ? 1 : 0))) {
						rt.modField(f, (H = live(mob)), "hallucination", (yield* g.call(f, P("/proc/max"), null, [50, (yield* g.call(f, P("/proc/min"), null, [300, multiply(600, rt.op(f, "Sqrt", [], [divide(1, add((yield* g.call(f, P("/proc/get_dist"), null, [live(mob), live(f.src)])), 1))]))]))])), add);
					}
					rads_7 = multiply(200, rt.op(f, "Sqrt", [], [divide(1, add((yield* g.call(f, P("/proc/get_dist"), null, [live(L), live(f.src)])), 1))]));
					yield* g.callName(f, live(L), "rad_act", [live(rads_7)]);
				}
			}
			rt.endFor(f, 0);
			yield* g.srcCall(f, "explode");
		}
	}
	(rt.modSrcVar(f, "power", multiply(rt.power(divide(rt.sv(f, "power"), 500), 3), rt.sv(f, "powerloss_inhibitor")), subtract));
	return 1;
}, true);

// /obj/machinery/power/supermatter_shard/proc/bullet_act  (code/modules/power/supermatter/supermatter.dm:428)
rt.def("/obj/machinery/power/supermatter_shard/proc/bullet_act", function bullet_act(f: Frame, Proj: Value) {
	let L: Value = null;
	f.vars = () => [L];
	if ((!truthy((rt.istype((L = rt.sv(f, "loc")), T("/turf")) ? 1 : 0)) || truthy((rt.istype(live(L), T("/turf/open/space")) ? 1 : 0)))) {
		return 0;
	}
	if (!truthy((rt.istype(rt.fv(f, "firer", live(Proj)), T("/obj/machinery/power/emitter")) ? 1 : 0))) {
		rt.callSrc(f, "investigate_log", [fmt("has been hit by ＀ fired by ＀", [live(Proj), rt.fv(f, "firer", live(Proj))]), "supermatter"]);
	}
	if (!isEqual(rt.fv(f, "flag", live(Proj)), "bullet")) {
		rt.modSrcVar(f, "power", multiply(rt.fv(f, "damage", live(Proj)), rt.sv(f, "config_bullet_energy")), add);
		if (!truthy(rt.sv(f, "has_been_powered"))) {
			rt.callSrc(f, "investigate_log", ["has been powered for the first time.", "supermatter"]);
			rt.call(f, P("/proc/message_admins"), null, [fmt("＀ has been powered for the first time ＀.", [live(f.src), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
			rt.setSv(f, "has_been_powered", 1);
		}
	} else {
		if (truthy(rt.sv(f, "takes_damage"))) {
			rt.modSrcVar(f, "damage", multiply(rt.fv(f, "damage", live(Proj)), rt.sv(f, "config_bullet_energy")), add);
		}
	}
	return 0;
});

// /obj/machinery/power/supermatter_shard/proc/singularity_act  (code/modules/power/supermatter/supermatter.dm:446)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/singularity_act", function* singularity_act(f: Frame) {
	let gain: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [gain, M, $e];
	gain = 100;
	yield* g.srcCall(f, "investigate_log", "Supermatter shard consumed by singularity.", "singulo");
	yield* g.call(f, P("/proc/message_admins"), null, ["Singularity has consumed a supermatter shard and can now become stage six."]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='userdanger'>＀ is consumed by the singularity!</span>", [live(f.src)]));
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "z", live(M)), rt.sv(f, "z"))) {
			rt.op(f, "Output", [], [live(M), rt.rsc("sound/effects/supermatter.ogg")], false);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='boldannounce'>A horrible screeching fills your ears, and a wave of dread washes over you...</span>"]);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(gain);
}, true);

// /obj/machinery/power/supermatter_shard/proc/blob_act  (code/modules/power/supermatter/supermatter.dm:457)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	if (!(truthy(live(B)) && !truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open/space")) ? 1 : 0)))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/supermatter.ogg"), 50, 1]);
	rt.modSrcVar(f, "damage", multiply(rt.fv(f, "obj_integrity", live(B)), 0.5), add);
	if (rt.gt(rt.fv(f, "obj_integrity", live(B)), 100)) {
		yield* g.callName(f, live(B), "visible_message", [fmt("<span class='danger'>＄！ strikes at ％！ and flinches away!</span>", [live(B), live(f.src)]), "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>"]);
		yield* g.callName(f, live(B), "take_damage", [100, "fire"]);
	} else {
		yield* g.callName(f, live(B), "visible_message", [fmt("<span class='danger'>＄！ strikes at ％！ and rapidly flashes to ash.</span>", [live(B), live(f.src)]), "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>"]);
		yield* g.srcCall(f, "Consume", live(B));
	}
	return f.dot;
}, true);

// /obj/machinery/power/supermatter_shard/proc/attack_tk  (code/modules/power/supermatter/supermatter.dm:470)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	let C: Value = null, rip_u: Value = null;
	f.vars = () => [user, C, rip_u];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [(C = live(user)), "<span class='userdanger'>That was a really dumb idea.</span>"]);
	yield* g.callName(f, (rip_u = (yield* g.callName(f, live(C), "get_bodypart", ["head"]))), "dismember", ["fire"]);
	return f.dot;
}, true);

// /obj/machinery/power/supermatter_shard/proc/attack_paw  (code/modules/power/supermatter/supermatter.dm:477)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/power/supermatter_shard/proc/attack_robot  (code/modules/power/supermatter/supermatter.dm:481)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy((yield* g.srcCall(f, "Adjacent", live(user))))) {
		return (yield* g.srcCall(f, "attack_hand", live(user)));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You attempt to interface with the control circuits but find they are not connected to your network. Maybe in a future firmware update.</span>"]);
	return f.dot;
}, true);

// /obj/machinery/power/supermatter_shard/proc/attack_ai  (code/modules/power/supermatter/supermatter.dm:487)
rt.def("/obj/machinery/power/supermatter_shard/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You attempt to interface with the control circuits but find they are not connected to your network. Maybe in a future firmware update.</span>"]);
	return f.dot;
});

// /obj/machinery/power/supermatter_shard/proc/attack_hand  (code/modules/power/supermatter/supermatter.dm:490)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＄！ reaches out and touches ％！, inducing a resonance... ＀ body starts to glow and bursts into flames before flashing into ash.</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_their", []))]), fmt("<span class='userdanger'>You reach out and touch ％！. Everything starts burning and all you can hear is ringing. Your last thought is \"That was not a wise decision.\"</span>", [live(f.src)]), "<span class='italics'>You hear an unearthly noise as a wave of heat washes over you.</span>"]);
	yield* g.srcCall(f, "investigate_log", fmt("has been attacked (hand) by ＀", [live(user)]), "supermatter");
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/supermatter.ogg"), 50, 1]);
	yield* g.srcCall(f, "Consume", live(user));
	return f.dot;
}, true);

// /obj/machinery/power/supermatter_shard/proc/transfer_energy  (code/modules/power/supermatter/supermatter.dm:501)
rt.def("/obj/machinery/power/supermatter_shard/proc/transfer_energy", function transfer_energy(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	R = null;
	rt.forList(f, 0, rt.gl("rad_collectors"), T("/obj/machinery/power/rad_collector"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if ((isEqual(rt.fv(f, "z", live(R)), rt.sv(f, "z")) && rt.le(rt.call(f, P("/proc/get_dist"), null, [live(R), live(f.src)]), 15))) {
			rt.callName(f, live(R), "receive_pulse", [multiply(divide(multiply(rt.sv(f, "power"), add(1, rt.sv(f, "power_transmission_bonus"))), 10), rt.sv(f, "freon_transmit_modifier"))]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/power/supermatter_shard/proc/attackby  (code/modules/power/supermatter/supermatter.dm:506)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.vars = () => [W, user, params];
	if (((!truthy((rt.istype(live(W), T("/obj/item")) ? 1 : 0)) || truthy(rt.bitAnd(rt.fv(f, "flags", live(W)), 128))) || !truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/scalpel/supermatter")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You carefully begin to scrape ％！ with ％！...</span>", [live(f.src), live(W)])]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(user), multiply(60, rt.fv(f, "toolspeed", live(W))), 1, live(f.src)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You extract a sliver from ％！. ＄！ begins to react violently!</span>", [live(f.src), live(f.src)])]);
			yield* g.new_(f, T("/obj/item/nuke_core/supermatter_sliver"), [rt.fv(f, "loc", live(user))]);
			rt.modSrcVar(f, "matter_power", 200, add);
		}
	} else {
		if (!truthy((yield* g.callName(f, live(user), "dropItemToGround", [live(W)])))) return f.dot;
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>As ＀ touches ％！ with ＇！, silence fills the room...</span>", [live(user), live(f.src), live(W)]), fmt("<span class='userdanger'>You touch ％！ with ％！, and everything suddenly goes silent.</span>\n<span class='notice'>＄！ flashes into dust as you flinch away from ％！.</span>", [live(f.src), live(W), live(W), live(f.src)]), "<span class='italics'>Everything suddenly goes silent.</span>"]);
		yield* g.srcCall(f, "investigate_log", fmt("has been attacked (＀) by ＀", [live(W), live(user)]), "supermatter");
		yield* g.srcCall(f, "Consume", live(W));
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/supermatter.ogg"), 50, 1]);
		yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.src), 0), 1, 1, 150, 1]);
	}
	return f.dot;
}, true);

// /obj/machinery/power/supermatter_shard/proc/Bumped  (code/modules/power/supermatter/supermatter.dm:527)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
		yield* g.callName(f, live(AM), "visible_message", [fmt("<span class='danger'>＄！ slams into ％！ inducing a resonance... ＀ body starts to glow and catch flame before flashing into ash.</span>", [live(AM), live(f.src), (yield* g.callName(f, live(AM), "p_their", []))]), fmt("<span class='userdanger'>You slam into ％！ as your ears are filled with unearthly ringing. Your last thought is \"Oh, fuck.\"</span>", [live(f.src)]), "<span class='italics'>You hear an unearthly noise as a wave of heat washes over you.</span>"]);
	} else {
		if ((truthy((rt.istype(live(AM), T("/obj")) ? 1 : 0)) && !truthy((rt.istype(live(AM), T("/obj/effect")) ? 1 : 0)))) {
			yield* g.callName(f, live(AM), "visible_message", [fmt("<span class='danger'>＄！ smacks into ％！ and rapidly flashes to ash.</span>", [live(AM), live(f.src)]), null, "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>"]);
		} else {
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/supermatter.ogg"), 50, 1]);
	yield* g.srcCall(f, "Consume", live(AM));
	return f.dot;
}, true);

// /obj/machinery/power/supermatter_shard/proc/Consume  (code/modules/power/supermatter/supermatter.dm:542)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/Consume", function* Consume(f: Frame, AM: Value) {
	let user: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [AM, user, L, $e];
	if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
		user = live(AM);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has consumed ＀ ＀.", [live(f.src), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
		yield* g.srcCall(f, "investigate_log", fmt("has consumed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)]))]), "supermatter");
		yield* g.callName(f, live(user), "dust", []);
		rt.modSrcVar(f, "matter_power", 200, add);
	} else {
		if (truthy((rt.istype(live(AM), T("/obj/singularity")) ? 1 : 0))) {
			return live(f.dot);
		} else {
			if ((truthy((rt.istype(live(AM), T("/obj")) ? 1 : 0)) && !truthy((rt.istype(live(AM), T("/obj/effect")) ? 1 : 0)))) {
				yield* g.srcCall(f, "investigate_log", fmt("has consumed ＀.", [live(AM)]), "supermatter");
				yield* g.call(f, P("/proc/qdel"), null, [live(AM)]);
			}
		}
	}
	rt.modSrcVar(f, "matter_power", 200, add);
	yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.src), 0), 4, 10, 500, 1]);
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [10])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		yield* g.srcCall(f, "investigate_log", fmt("has irradiated ＀ after consuming ＀.", [live(L), live(AM)]), "supermatter");
		if (truthy((rt.isIn(f, live(L), (yield* g.call(f, P("/proc/view"), null, []))) ? 1 : 0))) {
			yield* g.callName(f, live(L), "show_message", [fmt("<span class='danger'>As ％！ slowly stops resonating, you find your skin covered in new radiation burns.</span>", [live(f.src)]), 1, "<span class='danger'>The unearthly ringing subsides and you notice you have new radiation burns.</span>", 2]);
		} else {
			yield* g.callName(f, live(L), "show_message", ["<span class='italics'>You hear an uneartly ringing and notice your skin is covered in fresh radiation burns.</span>", 2]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/power/supermatter_shard/proc/supermatter_pull  (code/modules/power/supermatter/supermatter.dm:582)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/supermatter_pull", function* supermatter_pull(f: Frame, center: Value, pull_range: Value) {
	let _P: Value = null, pulled_object: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [center, pull_range, _P, pulled_object, H, $e];
	if (live(pull_range) === null) {
		pull_range = 10;
	}
	yield* g.call(f, P("/proc/playsound"), null, [null, rt.fv(f, "loc", live(f.src)), null, rt.rsc("sound/weapons/marauder.ogg"), null, 100, null, 1, "extrarange", 7], rt.Args.Named);
	_P = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [live(pull_range), live(center)])), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if (truthy((rt.istype(live(_P), T("/atom/movable")) ? 1 : 0))) {
			pulled_object = live(_P);
			if (truthy((rt.istype(live(_P), T("/mob/living/carbon/human")) ? 1 : 0))) {
				yield* g.callName(f, (H = live(_P)), "apply_effect", [40, "knockdown", 0]);
			}
			if (((truthy(live(pulled_object)) && !truthy(rt.fv(f, "anchored", live(pulled_object)))) && !truthy((rt.istype(live(_P), T("/mob/living/carbon/human")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/step_towards"), null, [live(pulled_object), live(center)]);
				yield* g.call(f, P("/proc/step_towards"), null, [live(pulled_object), live(center)]);
				yield* g.call(f, P("/proc/step_towards"), null, [live(pulled_object), live(center)]);
				yield* g.call(f, P("/proc/step_towards"), null, [live(pulled_object), live(center)]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/power/supermatter_shard/proc/supermatter_anomaly_gen  (code/modules/power/supermatter/supermatter.dm:596)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/supermatter_anomaly_gen", function* supermatter_anomaly_gen(f: Frame, anomalycenter: Value, type: Value, anomalyrange: Value) {
	let L: Value = null, A: Value = null;
	let $0: any;
	f.vars = () => [anomalycenter, type, anomalyrange, L, A, $0];
	if (live(type) === null) {
		type = "flux_anomaly";
	}
	if (live(anomalyrange) === null) {
		anomalyrange = 5;
	}
	if (!truthy((L = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/orange"), null, [live(anomalyrange), live(anomalycenter)]))])))) return f.dot;
	$0 = live(type);
	if ($0 === "flux_anomaly") {
		rt.setFv(f, "explosive", (A = (yield* g.new_(f, T("/obj/effect/anomaly/flux"), [live(L), 300]))), 0);
	} else if ($0 === "gravitational_anomaly") {
		yield* g.new_(f, T("/obj/effect/anomaly/grav"), [live(L), 250]);
	} else if ($0 === "pyro_anomaly") {
		yield* g.new_(f, T("/obj/effect/anomaly/pyro"), [live(L), 200]);
	}
	return f.dot;
}, true);

// /obj/machinery/power/supermatter_shard/proc/supermatter_zap  (code/modules/power/supermatter/supermatter.dm:609)  may sleep
rt.def("/obj/machinery/power/supermatter_shard/proc/supermatter_zap", function* supermatter_zap(f: Frame, zapstart: Value, range: Value, power: Value) {
	let target_atom: Value = null, target_mob: Value = null, target_machine: Value = null, target_structure: Value = null, arctargetsmob: Value = null, arctargetsmachine: Value = null, arctargetsstructure: Value = null, Z: Value = null, H: Value = null, A: Value = null, X: Value = null, M: Value = null, Y: Value = null, O: Value = null, zapdir: Value = null;
	let $e: any;
	f.vars = () => [zapstart, range, power, target_atom, target_mob, target_machine, target_structure, arctargetsmob, arctargetsmachine, arctargetsstructure, Z, H, A, X, M, Y, O, zapdir, $e];
	if (live(range) === null) {
		range = 3;
	}
	f.dot = rt.fv(f, "dir", live(zapstart));
	if (rt.lt(live(power), 1000)) {
		return live(f.dot);
	}
	target_atom = null;
	target_mob = null;
	target_machine = null;
	target_structure = null;
	arctargetsmob = rt.list();
	arctargetsmachine = rt.list();
	arctargetsstructure = rt.list();
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		Z = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [live(zapstart), add(live(range), 2)])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			Z = $e;
			arctargetsmob = rt.modify(live(arctargetsmob), live(Z), add);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.len(f, live(arctargetsmob)))) {
		H = rt.op(f, "PickUnweighted", [1], [live(arctargetsmob)]);
		A = live(H);
		target_mob = live(H);
		target_atom = live(A);
	} else {
		X = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [live(zapstart), add(live(range), 2)])), T("/obj/machinery"));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			arctargetsmachine = rt.modify(live(arctargetsmachine), live(X), add);
		}
		rt.endFor(f, 0);
		if (truthy(rt.len(f, live(arctargetsmachine)))) {
			M = rt.op(f, "PickUnweighted", [1], [live(arctargetsmachine)]);
			A = live(M);
			target_machine = live(M);
			target_atom = live(A);
		} else {
			Y = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [live(zapstart), add(live(range), 2)])), T("/obj/structure"));
			while (($e = rt.next(f, 0)) !== undefined) {
				Y = $e;
				arctargetsstructure = rt.modify(live(arctargetsstructure), live(Y), add);
			}
			rt.endFor(f, 0);
			if (truthy(rt.len(f, live(arctargetsstructure)))) {
				O = rt.op(f, "PickUnweighted", [1], [live(arctargetsstructure)]);
				A = live(O);
				target_structure = live(O);
				target_atom = live(A);
			}
		}
	}
	if (truthy(live(target_atom))) {
		yield* g.callName(f, live(zapstart), "Beam", [null, live(target_atom), "icon_state", "nzcrentrs_power", "time", 5], rt.Args.Named);
		if (truthy((zapdir = rt.getDir(f, live(zapstart), live(target_atom))))) {
			f.dot = live(zapdir);
		}
	}
	if (truthy(live(target_mob))) {
		yield* g.callName(f, live(target_mob), "electrocute_act", [null, (yield* g.call(f, P("/proc/rand"), null, [5, 10])), null, "Supermatter Discharge Bolt", null, 1, "stun", 0], rt.Args.Named);
		if (truthy(rt.op(f, "Prob", [], [15]))) {
			yield* g.srcCall(f, "supermatter_zap", live(target_mob), 5, divide(live(power), 2));
			yield* g.srcCall(f, "supermatter_zap", live(target_mob), 5, divide(live(power), 2));
		} else {
			yield* g.srcCall(f, "supermatter_zap", live(target_mob), 5, divide(live(power), 1.5));
		}
	} else {
		if (truthy(live(target_machine))) {
			if (truthy(rt.op(f, "Prob", [], [15]))) {
				yield* g.srcCall(f, "supermatter_zap", live(target_machine), 5, divide(live(power), 2));
				yield* g.srcCall(f, "supermatter_zap", live(target_machine), 5, divide(live(power), 2));
			} else {
				yield* g.srcCall(f, "supermatter_zap", live(target_machine), 5, divide(live(power), 1.5));
			}
		} else {
			if (!truthy(live(target_structure))) return f.dot;
			if (truthy(rt.op(f, "Prob", [], [15]))) {
				yield* g.srcCall(f, "supermatter_zap", live(target_structure), 5, divide(live(power), 2));
				yield* g.srcCall(f, "supermatter_zap", live(target_structure), 5, divide(live(power), 2));
			} else {
				yield* g.srcCall(f, "supermatter_zap", live(target_structure), 5, divide(live(power), 1.5));
			}
		}
	}
	return f.dot;
}, true);
