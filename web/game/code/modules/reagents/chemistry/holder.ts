// Based on /tg/station's code/modules/reagents/chemistry/holder.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(4178, "/datum/reagents", "/datum", {
	total_volume: 0,
	maximum_volume: 100,
	my_atom: null,
	chem_temp: 150,
	last_tick: 1,
	addiction_tick: 1,
	flags: null,
	reagent_list: null,
	addiction_list: null,
});

// holder.dm:6
rt.def("/datum/reagents/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_list = new_(T("/list"));

	this.addiction_list = new_(T("/list"));
	return f.dot;
});

// holder.dm:17
rt.def("/datum/reagents/proc/New", function* New(f: Frame, maximum: Value) {
	let paths: Value = null, path: Value = null, D: Value = null, reaction_ids: Value = null, reaction: Value = null, id: Value = null;
	let $e: any;
	maximum ??= 100;
	this.maximum_volume = maximum;
	if (!rt.bitAnd(this.flags, 1)) {
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	}
	if (!GLOB.chemical_reagents_list) {
		paths = typesof(T("/datum/reagent")) - T("/datum/reagent");
		GLOB.chemical_reagents_list = list();
		for (path of each(paths)) {
			D = (yield* new_(path));
			rt.setAt(GLOB.chemical_reagents_list, D.id, D);
		}
	}
	if (GLOB.chemical_reactions_list) return f.dot;
	paths = typesof(T("/datum/chemical_reaction")) - T("/datum/chemical_reaction");
	GLOB.chemical_reactions_list = list();
	path = null;
	for (path of each(paths)) {
		D = (yield* new_(path));
		reaction_ids = list();
		if (D.required_reagents && rt.len(f, D.required_reagents)) {
			reaction = null;
			for (reaction of each(D.required_reagents)) {
				reaction_ids += reaction;
			}
		}
		id = null;
		rt.forList(f, 1, reaction_ids);
		if (($e = rt.next(f, 1)) !== undefined) {
			id = $e;
			if (!rt.index(GLOB.chemical_reactions_list, id)) {
				rt.setAt(GLOB.chemical_reactions_list, id, list());
			}
			rt.modAt(GLOB.chemical_reactions_list, id, D, add);
		}
		rt.endFor(f, 1);
	}
	return f.dot;
}, true);

// holder.dm:56
rt.def("/datum/reagents/proc/Destroy", function* Destroy(f: Frame) {
	let reagent: Value = null, R: Value = null;
	f.dot = (yield* parent_proc());
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	let cached_reagents: Value = this.reagent_list;
	for (reagent of each(cached_reagents)) {
		yield* qdel((R = reagent));
	}
	cached_reagents.Cut();
	cached_reagents = null;
	if (!(this.my_atom && this.my_atom.reagents == this)) return f.dot;
	this.my_atom.reagents = null;
	return f.dot;
}, true);

// holder.dm:68
rt.def("/datum/reagents/proc/remove_any", function* remove_any(f: Frame, amount: Value) {
	let R: Value = null;
	amount ??= 1;
	let cached_reagents: Value = this.reagent_list;
	let total_transfered: Value = 0;
	let current_list_element: Value = rand(1, rt.len(f, cached_reagents));
	while (total_transfered != amount) {
		if (total_transfered >= amount) {
			break;
		}
		if (this.total_volume <= 0 || !rt.len(f, cached_reagents)) {
			break;
		}
		if (current_list_element > rt.len(f, cached_reagents)) {
			current_list_element = 1;
		}
		yield* this.remove_reagent((R = rt.index(cached_reagents, current_list_element)).id, 1);
		current_list_element++;
		total_transfered++;
		yield* this.update_total();
	}
	yield* this.handle_reactions();
	return total_transfered;
}, true);

// holder.dm:94
rt.def("/datum/reagents/proc/remove_all", function* remove_all(f: Frame, amount: Value) {
	let reagent: Value = null, R: Value = null;
	amount ??= 1;
	let cached_reagents: Value = this.reagent_list;
	if (!(this.total_volume > 0)) return f.dot;
	let part: Value = amount / this.total_volume;
	for (reagent of each(cached_reagents)) {
		yield* this.remove_reagent((R = reagent).id, R.volume * part);
	}
	yield* this.update_total();
	yield* this.handle_reactions();
	return amount;
}, true);

// holder.dm:106
rt.def("/datum/reagents/proc/get_master_reagent_name", function get_master_reagent_name(f: Frame) {
	let name: Value = null, reagent: Value = null, R: Value = null;
	let cached_reagents: Value = this.reagent_list;
	let max_volume: Value = 0;
	for (reagent of each(cached_reagents)) {
		if ((R = reagent).volume > max_volume) {
			max_volume = R.volume;
			name = R.name;
		}
	}
	return name;
});

// holder.dm:118
rt.def("/datum/reagents/proc/get_master_reagent_id", function get_master_reagent_id(f: Frame) {
	let id: Value = null, reagent: Value = null, R: Value = null;
	let cached_reagents: Value = this.reagent_list;
	let max_volume: Value = 0;
	for (reagent of each(cached_reagents)) {
		if ((R = reagent).volume > max_volume) {
			max_volume = R.volume;
			id = R.id;
		}
	}
	return id;
});

// holder.dm:130
rt.def("/datum/reagents/proc/get_master_reagent", function get_master_reagent(f: Frame) {
	let master: Value = null, reagent: Value = null, R: Value = null;
	let cached_reagents: Value = this.reagent_list;
	let max_volume: Value = 0;
	for (reagent of each(cached_reagents)) {
		if ((R = reagent).volume > max_volume) {
			max_volume = R.volume;
			master = R;
		}
	}
	return master;
});

// holder.dm:142
rt.def("/datum/reagents/proc/trans_to", function* trans_to(f: Frame, target: Value, amount: Value, multiplier: Value, preserve_data: Value, no_react: Value) {
	let R: Value = null, trans_data: Value = null, reagent: Value = null, _T: Value = null, transfer_amount: Value = null;
	amount ??= 1;
	multiplier ??= 1;
	preserve_data ??= 1;
	no_react ??= 0;
	let cached_reagents: Value = this.reagent_list;
	if (!target || !this.total_volume) {
		return f.dot;
	}
	if (amount < 0) {
		return f.dot;
	}
	if (rt.istype(target, T("/datum/reagents"))) {
		R = target;
	} else {
		if (!target.reagents || this.total_volume <= 0) {
			return f.dot;
		}
		R = target.reagents;
	}
	amount = min(min(amount, this.total_volume), R.maximum_volume - R.total_volume);
	let part: Value = amount / this.total_volume;
	for (reagent of each(cached_reagents)) {
		_T = reagent;
		transfer_amount = _T.volume * part;
		if (preserve_data) {
			trans_data = this.copy_data(_T);
		}
		yield* R.add_reagent(_T.id, transfer_amount * multiplier, trans_data, this.chem_temp, { no_react: 1 });
		yield* this.remove_reagent(_T.id, transfer_amount);
	}
	yield* this.update_total();
	yield* R.update_total();
	if (!no_react) {
		yield* R.handle_reactions();
		yield* this.handle_reactions();
	}
	return amount;
}, true);

// holder.dm:174
rt.def("/datum/reagents/proc/copy_to", function* copy_to(f: Frame, target: Value, amount: Value, multiplier: Value, preserve_data: Value) {
	let R: Value = null, trans_data: Value = null, reagent: Value = null, _T: Value = null, copy_amount: Value = null;
	amount ??= 1;
	multiplier ??= 1;
	preserve_data ??= 1;
	let cached_reagents: Value = this.reagent_list;
	if (!target) {
		return f.dot;
	}
	if (rt.istype(target, T("/datum/reagents"))) {
		R = target;
	} else {
		if (!target.reagents || this.total_volume <= 0) {
			return f.dot;
		}
		R = target.reagents;
	}
	if (amount < 0) {
		return f.dot;
	}
	amount = min(min(amount, this.total_volume), R.maximum_volume - R.total_volume);
	let part: Value = amount / this.total_volume;
	for (reagent of each(cached_reagents)) {
		_T = reagent;
		copy_amount = _T.volume * part;
		if (preserve_data) {
			trans_data = _T.data;
		}
		yield* R.add_reagent(_T.id, copy_amount * multiplier, trans_data);
	}
	yield* this.update_total();
	yield* R.update_total();
	yield* R.handle_reactions();
	yield* this.handle_reactions();
	return amount;
}, true);

// holder.dm:205
rt.def("/datum/reagents/proc/trans_id_to", function* trans_id_to(f: Frame, target: Value, reagent: Value, amount: Value, preserve_data: Value) {
	let trans_data: Value = null, CR: Value = null, current_reagent: Value = null;
	amount ??= 1;
	preserve_data ??= 1;
	let cached_reagents: Value = this.reagent_list;
	if (!target) {
		return f.dot;
	}
	if (!target.reagents || this.total_volume <= 0 || !this.get_reagent_amount(reagent)) {
		return f.dot;
	}
	if (amount < 0) {
		return f.dot;
	}
	let R: Value = target.reagents;
	if (this.get_reagent_amount(reagent) < amount) {
		amount = this.get_reagent_amount(reagent);
	}
	amount = min(amount, R.maximum_volume - R.total_volume);
	for (CR of each(cached_reagents)) {
		if ((current_reagent = CR).id == reagent) {
			if (preserve_data) {
				trans_data = current_reagent.data;
			}
			yield* R.add_reagent(current_reagent.id, amount, trans_data, this.chem_temp);
			yield* this.remove_reagent(current_reagent.id, amount, 1);
			break;
		}
	}
	yield* this.update_total();
	yield* R.update_total();
	yield* R.handle_reactions();
	return amount;
}, true);

// holder.dm:233
rt.def("/datum/reagents/proc/metabolize", function* metabolize(f: Frame, C: Value, can_overdose: Value) {
	let reagent: Value = null, R: Value = null, new_reagent: Value = null, addiction: Value = null, A: Value = null, addiction_3: Value = null;
	let $e: any;
	can_overdose ??= 0;
	let cached_reagents: Value = this.reagent_list;
	let cached_addictions: Value = this.addiction_list;
	if (C) {
		this.chem_temp = C.bodytemperature;
		yield* this.handle_reactions();
	}
	let need_mob_update: Value = 0;
	for (reagent of each(cached_reagents)) {
		if (!(R = reagent).holder || R.holder.gc_destroyed) {
			continue;
		}
		if (!C) {
			C = R.holder.my_atom;
		}
		if (C && R) {
			if ((yield* C.reagent_check(R)) != 1) {
				if (can_overdose) {
					if (R.overdose_threshold) {
						if (R.volume >= R.overdose_threshold && !R.overdosed) {
							R.overdosed = 1;
							need_mob_update += (yield* R.overdose_start(C));
						}
					}
					if (R.addiction_threshold) {
						if (R.volume >= R.addiction_threshold && !is_type_in_list(R, cached_addictions)) {
							new_reagent = (yield* new_(R.type));
							cached_addictions.Add(new_reagent);
						}
					}
					if (R.overdosed) {
						need_mob_update += (yield* R.overdose_process(C));
					}
					if (is_type_in_list(R, cached_addictions)) {
						addiction = null;
						for (addiction of each(cached_addictions)) {
							A = addiction;
							if (rt.op(f, "IsType", [], [R, A])) {
								A.addiction_stage = -15;
							}
						}
					}
				}
				need_mob_update += (yield* R.on_mob_life(C));
			}
		}
	}
	if (can_overdose) {
		if (this.addiction_tick == 6) {
			this.addiction_tick = 1;
			for (addiction_3 of each(cached_addictions)) {
				R = addiction_3;
				if (C && R) {
					R.addiction_stage++;
					if (rt.inRange(R.addiction_stage, 1, 10)) {
						need_mob_update += (yield* R.addiction_act_stage1(C));
					} else if (rt.inRange(R.addiction_stage, 10, 20)) {
						need_mob_update += (yield* R.addiction_act_stage2(C));
					} else if (rt.inRange(R.addiction_stage, 20, 30)) {
						need_mob_update += (yield* R.addiction_act_stage3(C));
					} else if (rt.inRange(R.addiction_stage, 30, 40)) {
						need_mob_update += (yield* R.addiction_act_stage4(C));
					} else if (rt.inRange(R.addiction_stage, 40, 1e+31)) {
						to_chat(C, `<span class='notice'>You feel like you've gotten over your need for ${R.name}.</span>`);
						yield* cached_addictions.Remove(R);
					}
				}
			}
		}
		this.addiction_tick++;
	}
	if (C && need_mob_update) {
		yield* C.updatehealth();
		yield* C.update_canmove();
		yield* C.update_stamina();
	}
	yield* this.update_total();
	return f.dot;
}, true);

// holder.dm:292
rt.def("/datum/reagents/proc/process", function* process(f: Frame) {
	let reagent: Value = null, R: Value = null;
	let cached_reagents: Value = this.reagent_list;
	if (rt.bitAnd(this.flags, 1)) {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
		return f.dot;
	}
	for (reagent of each(cached_reagents)) {
		yield* (R = reagent).on_tick();
	}
	return f.dot;
}, true, { waitfor: false });

// holder.dm:305
rt.def("/datum/reagents/proc/set_reacting", function set_reacting(f: Frame, react: Value) {
	react ??= 1;
	if (react) {
		(rt.modSrcVar(f, "flags", 16777214, rt.bitAnd));
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	} else {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
		(rt.modSrcVar(f, "flags", 1, rt.bitOr));
	}
	return f.dot;
});

// holder.dm:319
rt.def("/datum/reagents/proc/conditional_update", function* conditional_update(f: Frame, A: Value) {
	let reagent: Value = null, R: Value = null;
	let cached_reagents: Value = this.reagent_list;
	for (reagent of each(cached_reagents)) {
		(R = reagent).on_update(A);
	}
	yield* this.update_total();
	return f.dot;
}, true);

// holder.dm:326
rt.def("/datum/reagents/proc/handle_reactions", function* handle_reactions(f: Frame) {
	let reagent: Value = null, R: Value = null, reaction: Value = null, C: Value = null, cached_required_reagents: Value = null, total_required_reagents: Value = null, total_matching_reagents: Value = null, cached_required_catalysts: Value = null, total_required_catalysts: Value = null, total_matching_catalysts: Value = null, matching_container: Value = null, matching_other: Value = null, multipliers: Value = null, required_temp: Value = null, is_cold_recipe: Value = null, meets_temp_requirement: Value = null, cached_results: Value = null, B: Value = null, M: Value = null, multiplier: Value = null, B_22: Value = null, _P: Value = null, seen: Value = null, M_23: Value = null, ME2: Value = null, M_24: Value = null;
	let cached_reagents: Value = this.reagent_list;
	let cached_reactions: Value = GLOB.chemical_reactions_list;
	let cached_my_atom: Value = this.my_atom;
	if (rt.bitAnd(this.flags, 1)) {
		return f.dot;
	}
	let reaction_occurred: Value = 0;
	while (true) {
		reaction_occurred = 0;
		reagent = null;
		for (reagent of each(cached_reagents)) {
			R = reagent;
			reaction = null;
			for (reaction of each(rt.index(cached_reactions, R.id))) {
				if (!reaction) {
					continue;
				}
				C = reaction;
				cached_required_reagents = C.required_reagents;
				total_required_reagents = rt.len(f, cached_required_reagents);
				total_matching_reagents = 0;
				cached_required_catalysts = C.required_catalysts;
				total_required_catalysts = rt.len(f, cached_required_catalysts);
				total_matching_catalysts = 0;
				matching_container = 0;
				matching_other = 0;
				multipliers = (yield* new_(T("/list")));
				required_temp = C.required_temp;
				is_cold_recipe = C.is_cold_recipe;
				meets_temp_requirement = 0;
				cached_results = C.results;
				B = null;
				for (B of each(cached_required_reagents)) {
					if (!this.has_reagent(B, rt.index(cached_required_reagents, B))) {
						break;
					}
					total_matching_reagents++;
					multipliers += round(this.get_reagent_amount(B) / rt.index(cached_required_reagents, B));
				}
				B = null;
				for (B of each(cached_required_catalysts)) {
					if (!this.has_reagent(B, rt.index(cached_required_catalysts, B))) {
						break;
					}
					total_matching_catalysts++;
				}
				if (cached_my_atom) {
					if (!C.required_container) {
						matching_container = 1;
					} else if (cached_my_atom.type == C.required_container) {
						matching_container = 1;
					}
					if (rt.istype(cached_my_atom, T("/mob/living"))) {
						if (C.mob_react) {
							return f.dot;
						}
					}
					if (!C.required_other) {
						matching_other = 1;
					} else if (rt.istype(cached_my_atom, T("/obj/item/slime_extract"))) {
						if ((M = cached_my_atom).Uses > 0) {
							matching_other = 1;
						}
					}
				} else {
					if (!C.required_container) {
						matching_container = 1;
					}
					if (!C.required_other) {
						matching_other = 1;
					}
				}
				if (required_temp == 0 || is_cold_recipe && this.chem_temp <= required_temp || !is_cold_recipe && this.chem_temp >= required_temp) {
					meets_temp_requirement = 1;
				}
				if (total_matching_reagents == total_required_reagents && total_matching_catalysts == total_required_catalysts && matching_container && matching_other && meets_temp_requirement) {
					multiplier = min(multipliers);
					B_22 = null;
					for (B_22 of each(cached_required_reagents)) {
						yield* this.remove_reagent(B_22, multiplier * rt.index(cached_required_reagents, B_22), { safety: 1 });
					}
					_P = null;
					for (_P of each(C.results)) {
						multiplier = max(multiplier, 1);
						yield* this.add_reagent(_P, rt.index(cached_results, _P) * multiplier, null, this.chem_temp);
					}
					seen = viewers(4, rt.getStep(f, this.my_atom, 0));
					if (cached_my_atom) {
						if (!ismob(cached_my_atom)) {
							if (C.mix_sound) {
								playsound(rt.getStep(f, cached_my_atom, 0), C.mix_sound, 80, 1);
							}
							M_23 = null;
							for (M_23 of each(seen, T("/mob"))) {
								to_chat(M_23, `<span class='notice'>${bicon(this.my_atom)} ${C.mix_message}</span>`);
							}
						}
						if (rt.istype(cached_my_atom, T("/obj/item/slime_extract"))) {
							(ME2 = this.my_atom).Uses--;
							if (ME2.Uses <= 0) {
								M_24 = null;
								for (M_24 of each(seen, T("/mob"))) {
									to_chat(M_24, fmt("<span class='notice'>＀ ＄！'s power is consumed in the reaction.</span>", [bicon(this.my_atom), this.my_atom]));
									ME2.name = "used slime extract";
									ME2.desc = "This extract has been used up.";
								}
							}
						}
					}
					yield* C.on_reaction(this, multiplier);
					reaction_occurred = 1;
					break;
				}
			}
		}
		if (!reaction_occurred) break;
	}
	yield* this.update_total();
	return 0;
}, true);

// holder.dm:437
rt.def("/datum/reagents/proc/del_reagent", function* del_reagent(f: Frame, reagent: Value) {
	let _reagent: Value = null, R: Value = null, M: Value = null;
	let cached_reagents: Value = this.reagent_list;
	for (_reagent of each(cached_reagents)) {
		if ((R = _reagent).id == reagent) {
			if (this.my_atom && rt.istype(this.my_atom, T("/mob/living"))) {
				M = this.my_atom;
				yield* R.on_mob_delete(M);
			}
			yield* qdel(R);
			this.reagent_list -= R;
			yield* this.update_total();
			if (this.my_atom) {
				this.my_atom.on_reagent_change();
				this.check_ignoreslow(this.my_atom);
				this.check_gofast(this.my_atom);
				this.check_goreallyfast(this.my_atom);
			}
		}
	}
	return 1;
}, true);

// holder.dm:455
rt.def("/datum/reagents/proc/check_ignoreslow", function check_ignoreslow(f: Frame, M: Value) {
	if (!ismob(M)) return f.dot;
	if (M.reagents.has_reagent("morphine")) {
		return 1;
	} else {
		(rt.modField(f, M, "status_flags", 16777199, rt.bitAnd));
	}
	return f.dot;
});

// holder.dm:462
rt.def("/datum/reagents/proc/check_gofast", function check_gofast(f: Frame, M: Value) {
	if (!ismob(M)) return f.dot;
	if (M.reagents.has_reagent("unholywater") || M.reagents.has_reagent("nuka_cola") || M.reagents.has_reagent("stimulants") || M.reagents.has_reagent("ephedrine")) {
		return 1;
	} else {
		(rt.modField(f, M, "status_flags", 16777183, rt.bitAnd));
	}
	return f.dot;
});

// holder.dm:469
rt.def("/datum/reagents/proc/check_goreallyfast", function check_goreallyfast(f: Frame, M: Value) {
	if (!ismob(M)) return f.dot;
	if (M.reagents.has_reagent("methamphetamine")) {
		return 1;
	} else {
		(rt.modField(f, M, "status_flags", 16777151, rt.bitAnd));
	}
	return f.dot;
});

// holder.dm:476
rt.def("/datum/reagents/proc/update_total", function* update_total(f: Frame) {
	let reagent: Value = null, R: Value = null;
	let cached_reagents: Value = this.reagent_list;
	this.total_volume = 0;
	for (reagent of each(cached_reagents)) {
		if ((R = reagent).volume < 0.1) {
			yield* this.del_reagent(R.id);
		} else {
			this.total_volume += R.volume;
		}
	}
	return 0;
}, true);

// holder.dm:488
rt.def("/datum/reagents/proc/clear_reagents", function* clear_reagents(f: Frame) {
	let reagent: Value = null, R: Value = null;
	let cached_reagents: Value = this.reagent_list;
	for (reagent of each(cached_reagents)) {
		yield* this.del_reagent((R = reagent).id);
	}
	return 0;
}, true);

// holder.dm:496
rt.def("/datum/reagents/proc/reaction", function* reaction(f: Frame, A: Value, method: Value, volume_modifier: Value, show_message: Value) {
	let react_type: Value = null, L: Value = null, reagent: Value = null, R: Value = null, touch_protection: Value = null, L_5: Value = null;
	let $e: any;
	method ??= TOUCH;
	volume_modifier ??= 1;
	show_message ??= 1;
	if (rt.istype(A, T("/mob/living"))) {
		react_type = "LIVING";
		if (method == INGEST) {
			(L = A).taste(this);
		}
	} else if (isturf(A)) {
		react_type = "TURF";
	} else if (rt.istype(A, T("/obj"))) {
		react_type = "OBJ";
	} else {
		return f.dot;
	}
	let cached_reagents: Value = this.reagent_list;
	for (reagent of each(cached_reagents)) {
		R = reagent;
		if (react_type === "LIVING") {
			touch_protection = 0;
			if (method == VAPOR) {
				touch_protection = (L_5 = A).get_permeability_protection();
			}
			yield* R.reaction_mob(A, method, R.volume * volume_modifier, show_message, touch_protection);
		} else if (react_type === "TURF") {
			yield* R.reaction_turf(A, R.volume * volume_modifier, show_message);
		} else if (react_type === "OBJ") {
			yield* R.reaction_obj(A, R.volume * volume_modifier, show_message);
		}
	}
	return f.dot;
}, true);

// holder.dm:523
rt.def("/datum/reagents/proc/holder_full", function holder_full(f: Frame) {
	if (this.total_volume >= this.maximum_volume) {
		return 1;
	}
	return 0;
});

// holder.dm:528
rt.def("/datum/reagents/proc/add_reagent", function* add_reagent(f: Frame, reagent: Value, amount: Value, data: Value, reagtemp: Value, no_react: Value) {
	let A: Value = null, R: Value = null, D: Value = null;
	reagtemp ??= 300;
	no_react ??= 0;
	if (!isnum(amount) || !amount) {
		return 0;
	}
	if (amount < 0) {
		return 0;
	}
	let cached_reagents: Value = this.reagent_list;
	yield* this.update_total();
	if (this.total_volume + amount > this.maximum_volume) {
		amount = this.maximum_volume - this.total_volume;
	}
	this.chem_temp = round((amount * reagtemp + this.total_volume * this.chem_temp) / (this.total_volume + amount));
	for (A of each(cached_reagents)) {
		if ((R = A).id == reagent) {
			R.volume += amount;
			yield* this.update_total();
			if (this.my_atom) {
				this.my_atom.on_reagent_change();
			}
			yield* R.on_merge(data, amount);
			if (!no_react) {
				yield* this.handle_reactions();
			}
			return 1;
		}
	}
	if (D = rt.index(GLOB.chemical_reagents_list, reagent)) {
		cached_reagents += (R = (yield* new_(D.type, data)));
		R.holder = this;
		R.volume = amount;
		if (data) {
			R.data = data;
			yield* R.on_new(data);
		}
		yield* this.update_total();
		if (this.my_atom) {
			this.my_atom.on_reagent_change();
		}
		if (!no_react) {
			yield* this.handle_reactions();
		}
		return 1;
	} else {
		warning(`${`${this.my_atom} attempted to add a reagent called '${reagent}' which doesn't exist. (${f.usr})`} in ${"code/modules/reagents/chemistry/holder.dm"} at line ${571} src: ${this} usr: ${f.usr}.`);
	}
	return 0;
}, true, { argTypes: [{  }, {  }, { path: "/list" }, {  }, {  }] });

// holder.dm:575
rt.def("/datum/reagents/proc/add_reagent_list", function* add_reagent_list(f: Frame, list_reagents: Value, data: Value) {
	let r_id: Value = null, amt: Value = null;
	for (r_id of each(list_reagents)) {
		amt = rt.index(list_reagents, r_id);
		yield* this.add_reagent(r_id, amt, data);
	}
	return f.dot;
}, true);

// holder.dm:581
rt.def("/datum/reagents/proc/remove_reagent", function* remove_reagent(f: Frame, reagent: Value, amount: Value, safety: Value) {
	let A: Value = null, R: Value = null;
	if (amount === null) {
		amount = 0;
		CRASH("null amount passed to reagent code");
		return 0;
	}
	if (!isnum(amount)) {
		return 0;
	}
	if (amount < 0) {
		return 0;
	}
	let cached_reagents: Value = this.reagent_list;
	for (A of each(cached_reagents)) {
		if ((R = A).id == reagent) {
			amount = max(0, min(amount, R.volume));
			R.volume -= amount;
			yield* this.update_total();
			if (!safety) {
				yield* this.handle_reactions();
			}
			if (this.my_atom) {
				this.my_atom.on_reagent_change();
			}
			return 1;
		}
	}
	return 0;
}, true);

// holder.dm:611
rt.def("/datum/reagents/proc/has_reagent", function has_reagent(f: Frame, reagent: Value, amount: Value) {
	let _reagent: Value = null, R: Value = null;
	amount ??= -1;
	let cached_reagents: Value = this.reagent_list;
	for (_reagent of each(cached_reagents)) {
		if ((R = _reagent).id == reagent) {
			if (!amount) {
				return R;
			} else if (R.volume >= amount) {
				return R;
			} else {
				return 0;
			}
		}
	}
	return 0;
});

// holder.dm:626
rt.def("/datum/reagents/proc/get_reagent_amount", function get_reagent_amount(f: Frame, reagent: Value) {
	let _reagent: Value = null, R: Value = null;
	let cached_reagents: Value = this.reagent_list;
	for (_reagent of each(cached_reagents)) {
		if ((R = _reagent).id == reagent) {
			return R.volume;
		}
	}
	return 0;
});

// holder.dm:644
rt.def("/datum/reagents/proc/remove_all_type", function* remove_all_type(f: Frame, reagent_type: Value, amount: Value, strict: Value, safety: Value) {
	let reagent: Value = null, R: Value = null, matches: Value = null;
	strict ??= 0;
	safety ??= 1;
	if (!isnum(amount)) {
		return 1;
	}
	let cached_reagents: Value = this.reagent_list;
	let has_removed_reagent: Value = 0;
	for (reagent of each(cached_reagents)) {
		R = reagent;
		matches = 0;
		if (strict) {
			if (R.type == reagent_type) {
				matches = 1;
			}
		} else if (rt.op(f, "IsType", [], [R, reagent_type])) {
			matches = 1;
		}
		if (matches) {
			has_removed_reagent = (yield* this.remove_reagent(R.id, amount, safety));
		}
	}
	return has_removed_reagent;
}, true);

// holder.dm:667
rt.def("/datum/reagents/proc/get_data", function get_data(f: Frame, reagent_id: Value) {
	let reagent: Value = null, R: Value = null;
	let cached_reagents: Value = this.reagent_list;
	for (reagent of each(cached_reagents)) {
		if ((R = reagent).id == reagent_id) {
			return R.data;
		}
	}
	return f.dot;
});

// holder.dm:683
rt.def("/datum/reagents/proc/copy_data", function copy_data(f: Frame, current_reagent: Value) {
	let trans_data: Value = null, v: Value = null;
	if (!current_reagent || !current_reagent.data) {
		return null;
	}
	if (!rt.istype(current_reagent.data, T("/list"))) {
		return current_reagent.data;
	}
	if (rt.index((trans_data = current_reagent.data.Copy()), "viruses")) {
		v = rt.at(trans_data, "viruses");
		rt.setAt(trans_data, "viruses", v.Copy());
	}
	return trans_data;
});

// holder.dm:704
rt.def("/datum/reagents/proc/get_reagent", function get_reagent(f: Frame, type: Value) {
	let cached_reagents: Value = this.reagent_list;
	f.dot = rt.locateIn(f, type, cached_reagents);
	return f.dot;
});

// holder.dm:709
rt.def("/datum/reagents/proc/generate_taste_message", function generate_taste_message(f: Frame, minimum_percent: Value) {
	let R: Value = null, taste_data: Value = null, taste: Value = null, ratio: Value = null, amount: Value = null, taste_desc: Value = null, taste_amount: Value = null, total_taste: Value = null, percent: Value = null, intensity_desc: Value = null;
	minimum_percent ??= 15;
	let out: Value = list();
	let tastes: Value = list();
	if (minimum_percent <= 100) {
		for (R of each(this.reagent_list, T("/datum/reagent"))) {
			if (!R.taste_mult) {
				continue;
			}
			if (rt.istype(R, T("/datum/reagent/consumable/nutriment"))) {
				taste_data = R.data;
				taste = null;
				for (taste of each(taste_data)) {
					ratio = rt.index(taste_data, taste);
					amount = ratio * R.taste_mult * R.volume;
					if (rt.isIn(f, taste, tastes)) {
						rt.modAt(tastes, taste, amount, add);
					} else {
						rt.setAt(tastes, taste, amount);
					}
				}
			} else {
				taste_desc = R.taste_description;
				taste_amount = R.volume * R.taste_mult;
				if (rt.isIn(f, taste_desc, tastes)) {
					rt.modAt(tastes, taste_desc, taste_amount, add);
				} else {
					rt.setAt(tastes, taste_desc, taste_amount);
				}
			}
		}
		if ((total_taste = counterlist_sum(tastes)) > 0) {
			taste_desc = null;
			for (taste_desc of each(tastes)) {
				if ((percent = rt.index(tastes, taste_desc) / total_taste * 100) < minimum_percent) {
					continue;
				}
				intensity_desc = "a hint of";
				if (percent > minimum_percent * 2 || percent == 100) {
					intensity_desc = "";
				} else if (percent > minimum_percent * 3) {
					intensity_desc = "the strong flavor of";
				}
				if (intensity_desc != "") {
					out += `${intensity_desc} ${taste_desc}`;
				} else {
					out += `${taste_desc}`;
				}
			}
		}
	}
	return english_list(out, "something indescribable");
});

// holder.dm:759
rt.def("/atom/proc/create_reagents", function* create_reagents(f: Frame, max_vol: Value) {
	if (this.reagents) {
		yield* qdel(this.reagents);
	}
	this.reagents = (yield* new_(T("/datum/reagents"), max_vol));
	this.reagents.my_atom = this;
	return f.dot;
}, true);

// holder.dm:765
rt.def("/proc/get_random_reagent_id", function get_random_reagent_id(f: Frame) {
	let thing: Value = null, R: Value = null, picked_reagent: Value = null;
	if (!rt.len(f, GLOB.random_reagents)) {
		for (thing of each(typesof(T("/datum/reagent")) - T("/datum/reagent"))) {
			if (rt.initial(f, (R = thing), "can_synth")) {
				GLOB.random_reagents += rt.initial(f, R, "id");
			}
		}
	}
	return (picked_reagent = pick(GLOB.random_reagents));
});
