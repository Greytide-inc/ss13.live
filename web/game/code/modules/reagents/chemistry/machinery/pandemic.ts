// Based on /tg/station's code/modules/reagents/chemistry/machinery/pandemic.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add } = rt;


rt.type(10431, "/obj/machinery/computer/pandemic", "/obj/machinery/computer", {
	wait: null,
	beaker: null,
	anchored: 1,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/pandemic"),
	name: "PanD.E.M.I.C 2200",
	desc: "Used to work with viruses.",
	density: 1,
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "mixer0",
	use_power: 1,
	idle_power_usage: 20,
	resistance_flags: 32,
});

// pandemic.dm:16
rt.def("/obj/machinery/computer/pandemic/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.update_icon();
	return f.dot;
}, true);

// pandemic.dm:20
rt.def("/obj/machinery/computer/pandemic/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.beaker);
	this.beaker = null;
	return (yield* parent_proc());
}, true);

// pandemic.dm:24
rt.def("/obj/machinery/computer/pandemic/proc/get_by_index", function get_by_index(f: Frame, thing: Value, index: Value) {
	let B: Value = null;
	if (!this.beaker || !this.beaker.reagents) {
		return f.dot;
	}
	if (!((B = rt.locateIn(f, T("/datum/reagent/blood"), this.beaker.reagents.reagent_list)) && rt.index(B.data, thing))) return f.dot;
	return rt.index(rt.index(B.data, thing), index);
});

// pandemic.dm:31
rt.def("/obj/machinery/computer/pandemic/proc/get_virus_id_by_index", function* get_virus_id_by_index(f: Frame, index: Value) {
	let D: Value = null;
	if (!(D = this.get_by_index("viruses", index))) return f.dot;
	return (yield* D.GetDiseaseID());
}, true);

// pandemic.dm:36
rt.def("/obj/machinery/computer/pandemic/proc/get_viruses_data", function* get_viruses_data(f: Frame, B: Value) {
	let virus: Value = null, D: Value = null, _this: Value = null, A: Value = null, symptom: Value = null, S: Value = null, this_symptom: Value = null;
	let $e: any, $t: any;
	f.dot = list();
	if (!rt.istype(rt.index(B.data, "viruses"), T("/list"))) {
		return f.dot;
	}
	let V: Value = rt.index(B.data, "viruses");
	let index: Value = 1;
	for (virus of each(V)) {
		if (!rt.istype((D = virus), T("/datum/disease")) || rt.bitAnd(D.visibility_flags, HIDDEN_PANDEMIC)) {
			continue;
		}
		rt.setAt((_this = list()), "name", D.name);
		if (rt.istype(D, T("/datum/disease/advance"))) {
			if ((A = rt.index(GLOB.SSdisease.archive_diseases, (yield* D.GetDiseaseID()))).name == "Unknown") {
				rt.setAt(_this, "can_rename", 1);
			}
			rt.setAt(_this, "name", A.name);
			rt.setAt(_this, "is_adv", 1);
			rt.setAt(_this, "resistance", A.totalResistance());
			rt.setAt(_this, "stealth", A.totalStealth());
			rt.setAt(_this, "stage_speed", A.totalStageSpeed());
			rt.setAt(_this, "transmission", A.totalTransmittable());
			rt.setAt(_this, "symptoms", list());
			symptom = null;
			for (symptom of each(A.symptoms)) {
				S = symptom;
				rt.setAt((this_symptom = list()), "name", S.name);
				rt.modAt(_this, "symptoms", list(this_symptom), add);
			}
		}
		rt.setAt(_this, "index", ($t = index, index = rt.inc($t, 1), $t));
		rt.setAt(_this, "agent", D.agent);
		rt.setAt(_this, "description", (D.desc || "none"));
		rt.setAt(_this, "spread", (D.spread_text || "none"));
		rt.setAt(_this, "cure", (D.cure_text || "none"));
		f.dot += list(_this);
	}
	return f.dot;
}, true);

// pandemic.dm:73
rt.def("/obj/machinery/computer/pandemic/proc/get_resistance_data", function get_resistance_data(f: Frame, B: Value) {
	let id: Value = null, _this: Value = null, D: Value = null;
	f.dot = list();
	if (!rt.istype(rt.index(B.data, "resistances"), T("/list"))) {
		return f.dot;
	}
	let resistances: Value = rt.index(B.data, "resistances");
	for (id of each(resistances)) {
		_this = list();
		if (D = rt.index(GLOB.SSdisease.archive_diseases, id)) {
			rt.setAt(_this, "id", id);
			rt.setAt(_this, "name", D.name);
		}
		f.dot += list(_this);
	}
	return f.dot;
});

// pandemic.dm:87
rt.def("/obj/machinery/computer/pandemic/proc/reset_replicator_cooldown", function reset_replicator_cooldown(f: Frame) {
	this.wait = 0;
	this.update_icon();
	playsound(this.loc, rt.rsc("sound/machines/ping.ogg"), 30, 1);
	return f.dot;
});

// pandemic.dm:91
rt.def("/obj/machinery/computer/pandemic/proc/update_icon", function update_icon(f: Frame) {
	if (rt.bitAnd(this.stat, 1)) {
		this.icon_state = this.beaker ? "mixer1_b" : "mixer0_b";
		return f.dot;
	}
	this.icon_state = `mixer${this.beaker ? "1" : "0"}${this.powered() ? "" : "_nopower"}`;
	if (this.wait) {
		this.cut_overlays();
	} else {
		this.add_overlay("waitlight");
	}
	return f.dot;
});

// pandemic.dm:102
rt.def("/obj/machinery/computer/pandemic/proc/eject_beaker", function* eject_beaker(f: Frame) {
	yield* this.beaker.forceMove(rt.getStep(f, this, 0));
	this.beaker = null;
	yield* this.update_icon();
	return f.dot;
}, true);

// pandemic.dm:107
rt.def("/obj/machinery/computer/pandemic/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "pandemic", this.name, 700, 500, master_ui, state))).open();
	return f.dot;
}, true);

// pandemic.dm:113
rt.def("/obj/machinery/computer/pandemic/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, B: Value = null;
	rt.setAt((data = list()), "is_ready", (!this.wait ? 1 : 0));
	if (this.beaker) {
		rt.setAt(data, "has_beaker", 1);
		if (!this.beaker.reagents.total_volume || !this.beaker.reagents.reagent_list) {
			rt.setAt(data, "beaker_empty", 1);
		}
		if (B = rt.locateIn(f, T("/datum/reagent/blood"), this.beaker.reagents.reagent_list)) {
			rt.setAt(data, "has_blood", 1);
			rt.setAt(data, "blood", list());
			rt.setAt(rt.at(data, "blood"), "dna", (rt.index(B.data, "blood_DNA") || "none"));
			rt.setAt(rt.at(data, "blood"), "type", (rt.index(B.data, "blood_type") || "none"));
			rt.setAt(data, "viruses", (yield* this.get_viruses_data(B)));
			rt.setAt(data, "resistances", this.get_resistance_data(B));
		}
	}
	return data;
}, true);

// pandemic.dm:131
rt.def("/obj/machinery/computer/pandemic/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let id: Value = null, A: Value = null, new_name: Value = null, AD: Value = null, data: Value = null, B: Value = null, index: Value = null, D: Value = null, B_2: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "eject_beaker") {
		yield* this.eject_beaker();
		f.dot = 1;
	} else if (action === "empty_beaker") {
		yield* this.beaker.reagents.clear_reagents();
		f.dot = 1;
	} else if (action === "empty_eject_beaker") {
		yield* this.beaker.reagents.clear_reagents();
		yield* this.eject_beaker();
		f.dot = 1;
	} else if (action === "rename_disease") {
		id = (yield* this.get_virus_id_by_index(text2num(rt.at(params, "index"))));
		if (A = rt.index(GLOB.SSdisease.archive_diseases, id)) {
			if (!(new_name = (yield* stripped_input(f.usr, "Name the disease", "New name", "", 42))) || (yield* parent_proc())) {
				return f.dot;
			}
			A.AssignName(new_name);
			for (AD of each(GLOB.SSdisease.processing, T("/datum/disease/advance"))) {
				yield* AD.Refresh();
			}
			f.dot = 1;
		}
	} else if (action === "create_culture_bottle") {
		id = (yield* this.get_virus_id_by_index(text2num(rt.at(params, "index"))));
		A = (yield* new_(T("/datum/disease/advance"), 0, rt.index(GLOB.SSdisease.archive_diseases, id)));
		data = rt.alist(f, ["viruses", list(A)]);
		(B = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle"), rt.getStep(f, this, 0)))).name = `${A.name} culture bottle`;
		B.desc = `A small bottle. Contains ${A.agent} culture in synthblood medium.`;
		yield* B.reagents.add_reagent("blood", 20, data);
		this.wait = 1;
		yield* this.update_icon();
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/computer/pandemic/proc/reset_replicator_cooldown"))), 50);
		f.dot = 1;
	} else if (action === "create_vaccine_bottle") {
		index = rt.at(params, "index");
		D = rt.index(GLOB.SSdisease.archive_diseases, index);
		(B_2 = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle"), rt.getStep(f, this, 0)))).name = `${D.name} vaccine bottle`;
		yield* B_2.reagents.add_reagent("vaccine", 15, list(index));
		this.wait = 1;
		yield* this.update_icon();
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/computer/pandemic/proc/reset_replicator_cooldown"))), 200);
		f.dot = 1;
	}
	return f.dot;
}, true);

// pandemic.dm:179
rt.def("/obj/machinery/computer/pandemic/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers")) && rt.bitAnd(I.container_type, OPENCONTAINER)) {
		f.dot = 1;
		if (rt.bitAnd(this.stat, 3)) {
			return f.dot;
		}
		if (this.beaker) {
			to_chat(user, "<span class='warning'>A beaker is already loaded into the machine!</span>");
			return f.dot;
		}
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		this.beaker = I;
		yield* this.beaker.forceMove(this);
		to_chat(user, "<span class='notice'>You add the beaker to the machine.</span>");
		yield* this.update_icon();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// pandemic.dm:198
rt.def("/obj/machinery/computer/pandemic/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	if (this.beaker) {
		yield* this.beaker.forceMove(rt.getStep(f, this, 0));
		this.beaker = null;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);
