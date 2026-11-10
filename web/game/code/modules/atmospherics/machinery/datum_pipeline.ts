// Based on /tg/station's code/modules/atmospherics/machinery/datum_pipeline.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1866, "/datum/pipeline", "/datum", {
	air: null,
	other_airs: null,
	members: null,
	other_atmosmch: null,
	update: 1,
});

// datum_pipeline.dm:11
rt.def("/datum/pipeline/proc/New", function New(f: Frame) {
	this.other_airs = list();
	this.members = list();
	this.other_atmosmch = list();
	GLOB.SSair.networks += this;
	return f.dot;
});

// datum_pipeline.dm:17
rt.def("/datum/pipeline/proc/Destroy", function* Destroy(f: Frame) {
	let _P: Value = null, C: Value = null;
	GLOB.SSair.networks -= this;
	if (this.air && this.air.volume) {
		this.temporarily_store_air();
	}
	for (_P of each(this.members, T("/obj/machinery/atmospherics/pipe"))) {
		_P.parent = null;
	}
	for (C of each(this.other_atmosmch, T("/obj/machinery/atmospherics/components"))) {
		C.nullifyPipenet(this);
	}
	return (yield* parent_proc());
}, true);

// datum_pipeline.dm:29
rt.def("/datum/pipeline/proc/process", function* process(f: Frame) {
	if (this.update) {
		this.update = 0;
		this.reconcile_air();
	}
	this.update = (yield* this.air.react());
	return f.dot;
}, true, { waitfor: false });

// datum_pipeline.dm:34
rt.def("/datum/pipeline/proc/build_pipeline", function build_pipeline(f: Frame, base: Value) {
	let E: Value = null, borderline: Value = null, result: Value = null, _P: Value = null, item: Value = null;
	let volume: Value = 0;
	if (rt.istype(base, T("/obj/machinery/atmospherics/pipe"))) {
		volume = (E = base).volume;
		this.members += E;
		if (E.air_temporary) {
			this.air = E.air_temporary;
			E.air_temporary = null;
		}
	} else {
		this.addMachineryMember(base);
	}
	if (!this.air) {
		this.air = new_(T("/datum/gas_mixture"));
	}
	let possible_expansions: Value = list(base);
	while (rt.len(f, possible_expansions) > 0) {
		borderline = null;
		for (borderline of each(possible_expansions, T("/obj/machinery/atmospherics"))) {
			if (rt.len(f, (result = borderline.pipeline_expansion(this))) > 0) {
				_P = null;
				for (_P of each(result, T("/obj/machinery/atmospherics"))) {
					if (rt.istype(_P, T("/obj/machinery/atmospherics/pipe"))) {
						item = _P;
						if (!this.members.Find(item)) {
							if (item.parent) {
								if (GLOB.pipenetwarnings > 0) {
									warning(`build_pipeline(): ${item.type} added to a pipenet while still having one. (pipes leading to the same spot stacking in one turf) Nearby: (${item.x}, ${item.y}, ${item.z})`);
									GLOB.pipenetwarnings -= 1;
									if (GLOB.pipenetwarnings == 0) {
										warning("build_pipeline(): further messages about pipenets will be supressed");
									}
								}
							}
							this.members += item;
							possible_expansions += item;
							volume += item.volume;
							item.parent = this;
							if (item.air_temporary) {
								this.air.merge(item.air_temporary);
								item.air_temporary = null;
							}
						}
					} else {
						_P.setPipenet(this, borderline);
						this.addMachineryMember(_P);
					}
				}
			}
			possible_expansions -= borderline;
		}
	}
	this.air.volume = volume;
	return f.dot;
});

// datum_pipeline.dm:82
rt.def("/datum/pipeline/proc/addMachineryMember", function addMachineryMember(f: Frame, C: Value) {
	let G: Value = null;
	(rt.modSrcVar(f, "other_atmosmch", C, rt.bitOr));
	if (!(G = C.returnPipenetAir(this))) {
		stack_trace(`addMachineryMember: Null gasmix added to pipeline datum from ${C} which is of type ${C.type}. Nearby: (${C.x}, ${C.y}, ${C.z})`);
	}
	(rt.modSrcVar(f, "other_airs", G, rt.bitOr));
	return f.dot;
});

// datum_pipeline.dm:89
rt.def("/datum/pipeline/proc/addMember", function* addMember(f: Frame, A: Value, N: Value) {
	let _P: Value = null, adjacent: Value = null, I: Value = null, E: Value = null;
	if (rt.istype(A, T("/obj/machinery/atmospherics/pipe"))) {
		(_P = A).parent = this;
		adjacent = _P.pipeline_expansion();
		for (I of each(adjacent, T("/obj/machinery/atmospherics/pipe"))) {
			if (I.parent == this) {
				continue;
			}
			yield* this.merge((E = I.parent));
		}
		if (!this.members.Find(_P)) {
			this.members += _P;
			this.air.volume += _P.volume;
		}
	} else {
		A.setPipenet(this, N);
		this.addMachineryMember(A);
	}
	return f.dot;
}, true);

// datum_pipeline.dm:106
rt.def("/datum/pipeline/proc/merge", function* merge(f: Frame, E: Value) {
	let S: Value = null, C: Value = null;
	this.air.volume += E.air.volume;
	this.members.Add(E.members);
	for (S of each(E.members, T("/obj/machinery/atmospherics/pipe"))) {
		S.parent = this;
	}
	yield* this.air.merge(E.air);
	for (C of each(E.other_atmosmch, T("/obj/machinery/atmospherics/components"))) {
		C.replacePipenet(E, this);
	}
	this.other_atmosmch.Add(E.other_atmosmch);
	this.other_airs.Add(E.other_airs);
	E.members.Cut();
	E.other_atmosmch.Cut();
	yield* qdel(E);
	return f.dot;
}, true);

// datum_pipeline.dm:123
rt.def("/obj/machinery/atmospherics/pipe/proc/addMember", function* addMember(f: Frame, A: Value) {
	yield* this.parent.addMember(A, this);
	return f.dot;
}, true);

// datum_pipeline.dm:126
rt.def("/obj/machinery/atmospherics/components/proc/addMember", function* addMember(f: Frame, A: Value) {
	let _P: Value = null;
	yield* (_P = this.returnPipenet(A)).addMember(A, this);
	return f.dot;
}, true);

// datum_pipeline.dm:133
rt.def("/datum/pipeline/proc/temporarily_store_air", function temporarily_store_air(f: Frame) {
	let member: Value = null;
	for (member of each(this.members, T("/obj/machinery/atmospherics/pipe"))) {
		member.air_temporary = new_(T("/datum/gas_mixture"));
		member.air_temporary.volume = member.volume;
		// stress2b: copy_from then every gas's moles *= member.volume / air.volume is copy_from_scaled (it has a fast path in fast-air.ts)
		member.air_temporary.copy_from_scaled(this.air);
		member.air_temporary.temperature = this.air.temperature;
	}
	return f.dot;
});

// datum_pipeline.dm:145
rt.def("/datum/pipeline/proc/temperature_interact", function temperature_interact(f: Frame, target: Value, share_volume: Value, thermal_conductivity: Value) {
	let target_temperature: Value = null, target_heat_capacity: Value = null, modeled_location: Value = null, delta_temperature: Value = null, heat: Value = null, sharer_heat_capacity: Value = null, self_temperature_delta: Value = null, sharer_temperature_delta: Value = null, heat_9: Value = null, delta_temperature_4: Value = null, heat_5: Value = null;
	let total_heat_capacity: Value = this.air.heat_capacity();
	let partial_heat_capacity: Value = total_heat_capacity * (share_volume / this.air.volume);
	if (rt.istype(target, T("/turf/open"))) {
		target_temperature = (modeled_location = target).GetTemperature();
		target_heat_capacity = modeled_location.GetHeatCapacity();
		if (modeled_location.blocks_air) {
			if (modeled_location.heat_capacity > 0 && partial_heat_capacity > 0) {
				delta_temperature = this.air.temperature - target_temperature;
				heat = thermal_conductivity * delta_temperature * (partial_heat_capacity * target_heat_capacity / (partial_heat_capacity + target_heat_capacity));
				this.air.temperature -= heat / total_heat_capacity;
				modeled_location.TakeTemperature(heat / target_heat_capacity);
			}
		} else {
			delta_temperature = 0;
			sharer_heat_capacity = 0;
			delta_temperature = this.air.temperature - target_temperature;
			sharer_heat_capacity = target_heat_capacity;
			self_temperature_delta = 0;
			sharer_temperature_delta = 0;
			if (sharer_heat_capacity > 0 && partial_heat_capacity > 0) {
				self_temperature_delta = -(heat_9 = thermal_conductivity * delta_temperature * (partial_heat_capacity * sharer_heat_capacity / (partial_heat_capacity + sharer_heat_capacity))) / total_heat_capacity;
				sharer_temperature_delta = heat_9 / sharer_heat_capacity;
			} else {
				return 1;
			}
			this.air.temperature += self_temperature_delta;
			modeled_location.TakeTemperature(sharer_temperature_delta);
		}
	} else if (target.heat_capacity > 0 && partial_heat_capacity > 0) {
		delta_temperature_4 = this.air.temperature - target.temperature;
		heat_5 = thermal_conductivity * delta_temperature_4 * (partial_heat_capacity * target.heat_capacity / (partial_heat_capacity + target.heat_capacity));
		this.air.temperature -= heat_5 / total_heat_capacity;
	}
	this.update = 1;
	return f.dot;
});

// datum_pipeline.dm:201
rt.def("/datum/pipeline/proc/return_air", function return_air(f: Frame) {
	f.dot = this.other_airs + this.air;
	if (!rt.isIn(f, null, f.dot)) return f.dot;
	stack_trace(`${this} has one or more null gas mixtures, which may cause bugs. Null mixtures will not be considered in reconcile_air().`);
	return removeNullsFromList(f.dot);
});

// datum_pipeline.dm:207
rt.def("/datum/pipeline/proc/reconcile_air", function reconcile_air(f: Frame) {
	let _P: Value = null, V: Value = null, C: Value = null;
	let $e: any;
	let GL: Value = list();
	let PL: Value = list();
	PL += this;
	let i: Value = 1;
	while (i <= rt.len(f, PL)) {
		if (_P = rt.index(PL, i)) {
			GL += _P.return_air();
			V = null;
			for (V of each(_P.other_atmosmch, T("/obj/machinery/atmospherics/components/binary/valve"))) {
				if (V.open) {
					(PL = rt.modify(PL, rt.index(V.parents, 1), rt.bitOr));
					(PL = rt.modify(PL, rt.index(V.parents, 2), rt.bitOr));
				}
			}
			C = null;
			for (C of each(_P.other_atmosmch, T("/obj/machinery/atmospherics/components/unary/portables_connector"))) {
				if (C.connected_device) {
					GL += C.portableConnectorReturnAir();
				}
			}
		}
		i++;
	}
	let total_gas_mixture: Value = new_(T("/datum/gas_mixture"), 0);
	total_gas_mixture.reconcile_from(GL);
	return f.dot;
});
