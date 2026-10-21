// From code/modules/atmospherics/machinery/datum_pipeline.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1866, "/datum/pipeline", "/datum", {
	air: null,
	other_airs: null,
	members: null,
	other_atmosmch: null,
	update: 1,
});

// /datum/pipeline/proc/New  (code/modules/atmospherics/machinery/datum_pipeline.dm:11)
rt.def("/datum/pipeline/proc/New", function New(f: Frame) {
	rt.setSv(f, "other_airs", rt.list());
	rt.setSv(f, "members", rt.list());
	rt.setSv(f, "other_atmosmch", rt.list());
	rt.modField(f, rt.gl("SSair"), "networks", live(f.src), add);
	return f.dot;
});

// /datum/pipeline/proc/Destroy  (code/modules/atmospherics/machinery/datum_pipeline.dm:17)  may sleep
rt.def("/datum/pipeline/proc/Destroy", function* Destroy(f: Frame) {
	let _P: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [_P, C, $e];
	(rt.modField(f, rt.gl("SSair"), "networks", live(f.src), subtract));
	if ((truthy(rt.sv(f, "air")) && truthy(rt.fv(f, "volume", rt.sv(f, "air"))))) {
		yield* g.srcCall(f, "temporarily_store_air");
	}
	_P = null;
	rt.forList(f, 0, rt.sv(f, "members"), T("/obj/machinery/atmospherics/pipe"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		rt.setFv(f, "parent", live(_P), null);
	}
	rt.endFor(f, 0);
	C = null;
	rt.forList(f, 0, rt.sv(f, "other_atmosmch"), T("/obj/machinery/atmospherics/components"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.callName(f, live(C), "nullifyPipenet", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/pipeline/proc/process  (code/modules/atmospherics/machinery/datum_pipeline.dm:29)  may sleep
rt.def("/datum/pipeline/proc/process", function* process(f: Frame) {
	if (truthy(rt.sv(f, "update"))) {
		rt.setSv(f, "update", 0);
		yield* g.srcCall(f, "reconcile_air");
	}
	rt.setSv(f, "update", (yield* g.callName(f, rt.sv(f, "air"), "react", [])));
	return f.dot;
}, true, { waitfor: false });

// /datum/pipeline/proc/build_pipeline  (code/modules/atmospherics/machinery/datum_pipeline.dm:34)
rt.def("/datum/pipeline/proc/build_pipeline", function build_pipeline(f: Frame, base: Value) {
	let volume: Value = null, E: Value = null, possible_expansions: Value = null, borderline: Value = null, result: Value = null, _P: Value = null, item: Value = null;
	let $e: any;
	f.vars = () => [volume, E, possible_expansions, borderline, result, _P, item, $e];
	volume = 0;
	if (truthy((rt.istype(live(base), T("/obj/machinery/atmospherics/pipe")) ? 1 : 0))) {
		volume = rt.gv(f, "volume", (E = live(base)));
		rt.modSrcVar(f, "members", live(E), add);
		if (truthy(rt.fv(f, "air_temporary", live(E)))) {
			rt.setSv(f, "air", rt.fv(f, "air_temporary", live(E)));
			rt.setFv(f, "air_temporary", live(E), null);
		}
	} else {
		rt.callSrc(f, "addMachineryMember", [live(base)]);
	}
	if (!truthy(rt.sv(f, "air"))) {
		rt.setSv(f, "air", rt.new_(f, T("/datum/gas_mixture"), []));
	}
	possible_expansions = rt.list(live(base));
	while (rt.gt(rt.len(f, live(possible_expansions)), 0)) {
		borderline = null;
		rt.forList(f, 0, live(possible_expansions), T("/obj/machinery/atmospherics"));
		while (($e = rt.next(f, 0)) !== undefined) {
			borderline = $e;
			if (rt.gt(rt.getLen(f, (result = rt.callName(f, live(borderline), "pipeline_expansion", [live(f.src)]))), 0)) {
				_P = null;
				rt.forList(f, 1, live(result), T("/obj/machinery/atmospherics"));
				while (($e = rt.next(f, 1)) !== undefined) {
					_P = $e;
					if (truthy((rt.istype(live(_P), T("/obj/machinery/atmospherics/pipe")) ? 1 : 0))) {
						item = live(_P);
						if (!truthy(rt.callName(f, rt.sv(f, "members"), "Find", [live(item)]))) {
							if (truthy(rt.fv(f, "parent", live(item)))) {
								if (rt.gt(rt.gl("pipenetwarnings"), 0)) {
									rt.call(f, P("/proc/warning"), null, [fmt("build_pipeline(): ＀ added to a pipenet while still having one. (pipes leading to the same spot stacking in one turf) Nearby: (＀, ＀, ＀)", [rt.fv(f, "type", live(item)), rt.fv(f, "x", live(item)), rt.fv(f, "y", live(item)), rt.fv(f, "z", live(item))])]);
									(rt.modGl("pipenetwarnings", 1, subtract));
									if (isEqual(rt.gl("pipenetwarnings"), 0)) {
										rt.call(f, P("/proc/warning"), null, ["build_pipeline(): further messages about pipenets will be supressed"]);
									}
								}
							}
							rt.modSrcVar(f, "members", live(item), add);
							possible_expansions = rt.modify(live(possible_expansions), live(item), add);
							volume = rt.modify(live(volume), rt.fv(f, "volume", live(item)), add);
							rt.setFv(f, "parent", live(item), live(f.src));
							if (truthy(rt.fv(f, "air_temporary", live(item)))) {
								rt.callName(f, rt.sv(f, "air"), "merge", [rt.fv(f, "air_temporary", live(item))]);
								rt.setFv(f, "air_temporary", live(item), null);
							}
						}
					} else {
						rt.callName(f, live(_P), "setPipenet", [live(f.src), live(borderline)]);
						rt.callSrc(f, "addMachineryMember", [live(_P)]);
					}
				}
				rt.endFor(f, 1);
			}
			(possible_expansions = rt.modify(live(possible_expansions), live(borderline), subtract));
		}
		rt.endFor(f, 0);
	}
	rt.setFv(f, "volume", rt.sv(f, "air"), live(volume));
	return f.dot;
});

// /datum/pipeline/proc/addMachineryMember  (code/modules/atmospherics/machinery/datum_pipeline.dm:82)
rt.def("/datum/pipeline/proc/addMachineryMember", function addMachineryMember(f: Frame, C: Value) {
	let G: Value = null;
	f.vars = () => [G];
	(rt.modSrcVar(f, "other_atmosmch", live(C), rt.bitOr));
	if (!truthy((G = rt.callName(f, live(C), "returnPipenetAir", [live(f.src)])))) {
		rt.call(f, P("/proc/stack_trace"), null, [fmt("addMachineryMember: Null gasmix added to pipeline datum from ＀ which is of type ＀. Nearby: (＀, ＀, ＀)", [live(C), rt.fv(f, "type", live(C)), rt.fv(f, "x", live(C)), rt.fv(f, "y", live(C)), rt.fv(f, "z", live(C))])]);
	}
	(rt.modSrcVar(f, "other_airs", live(G), rt.bitOr));
	return f.dot;
});

// /datum/pipeline/proc/addMember  (code/modules/atmospherics/machinery/datum_pipeline.dm:89)  may sleep
rt.def("/datum/pipeline/proc/addMember", function* addMember(f: Frame, A: Value, N: Value) {
	let _P: Value = null, adjacent: Value = null, I: Value = null, E: Value = null;
	let $e: any;
	f.vars = () => [A, N, _P, adjacent, I, E, $e];
	if (truthy((rt.istype(live(A), T("/obj/machinery/atmospherics/pipe")) ? 1 : 0))) {
		rt.setFv(f, "parent", (_P = live(A)), live(f.src));
		adjacent = (yield* g.callName(f, live(_P), "pipeline_expansion", []));
		I = null;
		rt.forList(f, 0, live(adjacent), T("/obj/machinery/atmospherics/pipe"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (isEqual(rt.fv(f, "parent", live(I)), live(f.src))) {
				continue;
			}
			yield* g.srcCall(f, "merge", (E = rt.fv(f, "parent", live(I))));
		}
		rt.endFor(f, 0);
		if (!truthy((yield* g.callName(f, rt.sv(f, "members"), "Find", [live(_P)])))) {
			rt.modSrcVar(f, "members", live(_P), add);
			rt.modField(f, rt.sv(f, "air"), "volume", rt.fv(f, "volume", live(_P)), add);
		}
	} else {
		yield* g.callName(f, live(A), "setPipenet", [live(f.src), live(N)]);
		yield* g.srcCall(f, "addMachineryMember", live(A));
	}
	return f.dot;
}, true);

// /datum/pipeline/proc/merge  (code/modules/atmospherics/machinery/datum_pipeline.dm:106)  may sleep
rt.def("/datum/pipeline/proc/merge", function* merge(f: Frame, E: Value) {
	let S: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [E, S, C, $e];
	rt.modField(f, rt.sv(f, "air"), "volume", rt.gv(f, "volume", rt.fv(f, "air", live(E))), add);
	yield* g.callName(f, rt.sv(f, "members"), "Add", [rt.fv(f, "members", live(E))]);
	S = null;
	rt.forList(f, 0, rt.fv(f, "members", live(E)), T("/obj/machinery/atmospherics/pipe"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		rt.setFv(f, "parent", live(S), live(f.src));
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "air"), "merge", [rt.fv(f, "air", live(E))]);
	C = null;
	rt.forList(f, 0, rt.fv(f, "other_atmosmch", live(E)), T("/obj/machinery/atmospherics/components"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.callName(f, live(C), "replacePipenet", [live(E), live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "other_atmosmch"), "Add", [rt.fv(f, "other_atmosmch", live(E))]);
	yield* g.callName(f, rt.sv(f, "other_airs"), "Add", [rt.fv(f, "other_airs", live(E))]);
	yield* g.callName(f, rt.fv(f, "members", live(E)), "Cut", []);
	yield* g.callName(f, rt.fv(f, "other_atmosmch", live(E)), "Cut", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(E)]);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/pipe/proc/addMember  (code/modules/atmospherics/machinery/datum_pipeline.dm:123)  may sleep
rt.def("/obj/machinery/atmospherics/pipe/proc/addMember", function* addMember(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, rt.sv(f, "parent"), "addMember", [live(A), live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/proc/addMember  (code/modules/atmospherics/machinery/datum_pipeline.dm:126)  may sleep
rt.def("/obj/machinery/atmospherics/components/proc/addMember", function* addMember(f: Frame, A: Value) {
	let _P: Value = null;
	f.vars = () => [A, _P];
	yield* g.callName(f, (_P = (yield* g.srcCall(f, "returnPipenet", live(A)))), "addMember", [live(A), live(f.src)]);
	return f.dot;
}, true);

// /datum/pipeline/proc/temporarily_store_air  (code/modules/atmospherics/machinery/datum_pipeline.dm:133)
rt.def("/datum/pipeline/proc/temporarily_store_air", function temporarily_store_air(f: Frame) {
	let member: Value = null, member_gases: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [member, member_gases, id, $e];
	member = null;
	rt.forList(f, 0, rt.sv(f, "members"), T("/obj/machinery/atmospherics/pipe"));
	while (($e = rt.next(f, 0)) !== undefined) {
		member = $e;
		rt.setFv(f, "air_temporary", live(member), rt.new_(f, T("/datum/gas_mixture"), []));
		rt.setFv(f, "volume", rt.fv(f, "air_temporary", live(member)), rt.fv(f, "volume", live(member)));
		// stress2b: copy_from then every gas's moles *= member.volume / air.volume is copy_from_scaled (it has a fast path in fast-air.ts)
		rt.callName(f, rt.fv(f, "air_temporary", live(member)), "copy_from_scaled", [rt.sv(f, "air")]);
		rt.setFv(f, "temperature", rt.fv(f, "air_temporary", live(member)), rt.fv(f, "temperature", rt.sv(f, "air")));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/pipeline/proc/temperature_interact  (code/modules/atmospherics/machinery/datum_pipeline.dm:145)
rt.def("/datum/pipeline/proc/temperature_interact", function temperature_interact(f: Frame, target: Value, share_volume: Value, thermal_conductivity: Value) {
	let total_heat_capacity: Value = null, partial_heat_capacity: Value = null, target_temperature: Value = null, target_heat_capacity: Value = null, modeled_location: Value = null, delta_temperature: Value = null, heat: Value = null, sharer_heat_capacity: Value = null, self_temperature_delta: Value = null, sharer_temperature_delta: Value = null, heat_9: Value = null, delta_temperature_4: Value = null, heat_5: Value = null;
	f.vars = () => [total_heat_capacity, partial_heat_capacity, target_temperature, target_heat_capacity, modeled_location, delta_temperature, heat, sharer_heat_capacity, self_temperature_delta, sharer_temperature_delta, heat_9, delta_temperature_4, heat_5];
	total_heat_capacity = rt.callName(f, rt.sv(f, "air"), "heat_capacity", []);
	partial_heat_capacity = multiply(live(total_heat_capacity), divide(live(share_volume), rt.fv(f, "volume", rt.sv(f, "air"))));
	target_temperature = null;
	target_heat_capacity = null;
	if (truthy((rt.istype(live(target), T("/turf/open")) ? 1 : 0))) {
		target_temperature = rt.callName(f, (modeled_location = live(target)), "GetTemperature", []);
		target_heat_capacity = rt.callName(f, live(modeled_location), "GetHeatCapacity", []);
		if (truthy(rt.fv(f, "blocks_air", live(modeled_location)))) {
			if ((rt.gt(rt.fv(f, "heat_capacity", live(modeled_location)), 0) && rt.gt(live(partial_heat_capacity), 0))) {
				delta_temperature = subtract(rt.fv(f, "temperature", rt.sv(f, "air")), live(target_temperature));
				heat = multiply(multiply(live(thermal_conductivity), live(delta_temperature)), divide(multiply(live(partial_heat_capacity), live(target_heat_capacity)), add(live(partial_heat_capacity), live(target_heat_capacity))));
				(rt.modField(f, rt.sv(f, "air"), "temperature", divide(live(heat), live(total_heat_capacity)), subtract));
				rt.callName(f, live(modeled_location), "TakeTemperature", [divide(live(heat), live(target_heat_capacity))]);
			}
		} else {
			delta_temperature = 0;
			sharer_heat_capacity = 0;
			delta_temperature = subtract(rt.fv(f, "temperature", rt.sv(f, "air")), live(target_temperature));
			sharer_heat_capacity = live(target_heat_capacity);
			self_temperature_delta = 0;
			sharer_temperature_delta = 0;
			if ((rt.gt(live(sharer_heat_capacity), 0) && rt.gt(live(partial_heat_capacity), 0))) {
				self_temperature_delta = divide(rt.neg((heat_9 = multiply(multiply(live(thermal_conductivity), live(delta_temperature)), divide(multiply(live(partial_heat_capacity), live(sharer_heat_capacity)), add(live(partial_heat_capacity), live(sharer_heat_capacity)))))), live(total_heat_capacity));
				sharer_temperature_delta = divide(live(heat_9), live(sharer_heat_capacity));
			} else {
				return 1;
			}
			rt.modField(f, rt.sv(f, "air"), "temperature", live(self_temperature_delta), add);
			rt.callName(f, live(modeled_location), "TakeTemperature", [live(sharer_temperature_delta)]);
		}
	} else {
		if ((rt.gt(rt.fv(f, "heat_capacity", live(target)), 0) && rt.gt(live(partial_heat_capacity), 0))) {
			delta_temperature_4 = subtract(rt.fv(f, "temperature", rt.sv(f, "air")), rt.fv(f, "temperature", live(target)));
			heat_5 = multiply(multiply(live(thermal_conductivity), live(delta_temperature_4)), divide(multiply(live(partial_heat_capacity), rt.fv(f, "heat_capacity", live(target))), add(live(partial_heat_capacity), rt.fv(f, "heat_capacity", live(target)))));
			(rt.modField(f, rt.sv(f, "air"), "temperature", divide(live(heat_5), live(total_heat_capacity)), subtract));
		}
	}
	rt.setSv(f, "update", 1);
	return f.dot;
});

// /datum/pipeline/proc/return_air  (code/modules/atmospherics/machinery/datum_pipeline.dm:201)
rt.def("/datum/pipeline/proc/return_air", function return_air(f: Frame) {
	f.dot = add(rt.sv(f, "other_airs"), rt.sv(f, "air"));
	if (!truthy((rt.isIn(f, null, live(f.dot)) ? 1 : 0))) return f.dot;
	rt.call(f, P("/proc/stack_trace"), null, [fmt("＀ has one or more null gas mixtures, which may cause bugs. Null mixtures will not be considered in reconcile_air().", [live(f.src)])]);
	return rt.call(f, P("/proc/removeNullsFromList"), null, [live(f.dot)]);
});

// /datum/pipeline/proc/reconcile_air  (code/modules/atmospherics/machinery/datum_pipeline.dm:207)
rt.def("/datum/pipeline/proc/reconcile_air", function reconcile_air(f: Frame) {
	let GL: Value = null, PL: Value = null, i: Value = null, _P: Value = null, V: Value = null, C: Value = null, total_thermal_energy: Value = null, total_heat_capacity: Value = null, total_gas_mixture: Value = null, i_5: Value = null, G: Value = null, G_gases: Value = null, id: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [GL, PL, i, _P, V, C, total_thermal_energy, total_heat_capacity, total_gas_mixture, i_5, G, G_gases, id, $0, $1, $e];
	GL = rt.list();
	PL = rt.list();
	PL = rt.modify(live(PL), live(f.src), add);
	i = null;
	i = 1;
	while (rt.le(live(i), rt.len(f, live(PL)))) {
		if (truthy((_P = rt.index(live(PL), live(i))))) {
			GL = rt.modify(live(GL), rt.callName(f, live(_P), "return_air", []), add);
			V = null;
			rt.forList(f, 0, rt.fv(f, "other_atmosmch", live(_P)), T("/obj/machinery/atmospherics/components/binary/valve"));
			while (($e = rt.next(f, 0)) !== undefined) {
				V = $e;
				if (truthy(rt.fv(f, "open", live(V)))) {
					(PL = rt.modify(live(PL), rt.index(rt.fv(f, "parents", live(V)), 1), rt.bitOr));
					(PL = rt.modify(live(PL), rt.index(rt.fv(f, "parents", live(V)), 2), rt.bitOr));
				}
			}
			rt.endFor(f, 0);
			C = null;
			rt.forList(f, 0, rt.fv(f, "other_atmosmch", live(_P)), T("/obj/machinery/atmospherics/components/unary/portables_connector"));
			while (($e = rt.next(f, 0)) !== undefined) {
				C = $e;
				if (truthy(rt.fv(f, "connected_device", live(C)))) {
					GL = rt.modify(live(GL), rt.callName(f, live(C), "portableConnectorReturnAir", []), add);
				}
			}
			rt.endFor(f, 0);
		}
		i = rt.inc(live(i), 1);
	}
	total_gas_mixture = rt.new_(f, T("/datum/gas_mixture"), [0]);
	rt.callName(f, live(total_gas_mixture), "reconcile_from", [live(GL)]);
	return f.dot;
});
