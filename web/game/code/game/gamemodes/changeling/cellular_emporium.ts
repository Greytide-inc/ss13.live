// Based on /tg/station's code/game/gamemodes/changeling/cellular_emporium.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1194, "/datum/cellular_emporium", "/datum", {
	name: "cellular emporium",
	changeling: null,
});

// cellular_emporium.dm:9
rt.def("/datum/cellular_emporium/proc/New", function New(f: Frame, my_changeling: Value) {
	f.dot = parent_proc();
	this.changeling = my_changeling;
	return f.dot;
}, false);

// cellular_emporium.dm:14
rt.def("/datum/cellular_emporium/proc/Destroy", function* Destroy(f: Frame) {
	this.changeling = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// cellular_emporium.dm:17
rt.def("/datum/cellular_emporium/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.always_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "cellular_emporium", this.name, 900, 480, master_ui, state))).open();
	return f.dot;
}, true);

// cellular_emporium.dm:23
rt.def("/datum/cellular_emporium/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let path: Value = null, ability: Value = null, dna_cost: Value = null, AL: Value = null, req_dna: Value = null;
	let data: Value = list();
	let can_readapt: Value = this.changeling.canrespec;
	let genetic_points_remaining: Value = this.changeling.geneticpoints;
	let absorbed_dna_count: Value = this.changeling.absorbedcount;
	rt.setAt(data, "can_readapt", can_readapt);
	rt.setAt(data, "genetic_points_remaining", genetic_points_remaining);
	rt.setAt(data, "absorbed_dna_count", absorbed_dna_count);
	let abilities: Value = list();
	for (path of each(typesof(T("/obj/effect/proc_holder/changeling")) - T("/obj/effect/proc_holder/changeling"))) {
		ability = path;
		if ((dna_cost = rt.initial(f, ability, "dna_cost")) <= 0) {
			continue;
		}
		rt.setAt((AL = list()), "name", rt.initial(f, ability, "name"));
		rt.setAt(AL, "desc", rt.initial(f, ability, "desc"));
		rt.setAt(AL, "helptext", rt.initial(f, ability, "helptext"));
		rt.setAt(AL, "owned", this.changeling.has_sting(ability));
		req_dna = rt.initial(f, ability, "req_dna");
		rt.setAt(AL, "dna_cost", dna_cost);
		rt.setAt(AL, "can_purchase", ((req_dna <= absorbed_dna_count ? 1 : 0) && (dna_cost <= genetic_points_remaining ? 1 : 0)));
		abilities += list(AL);
	}
	rt.setAt(data, "abilities", abilities);
	return data;
});

// cellular_emporium.dm:58
rt.def("/datum/cellular_emporium/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let sting_name: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "readapt") {
		if (this.changeling.canrespec) {
			yield* this.changeling.lingRespec(f.usr);
		}
	} else if (action === "evolve") {
		sting_name = rt.at(params, "name");
		yield* this.changeling.purchasePower(f.usr, sting_name);
	}
	return f.dot;
}, true);

rt.type(86, "/datum/action/innate/cellular_emporium", "/datum/action/innate", {
	cellular_emporium: null,
	name: "Cellular Emporium",
	button_icon_state: "cellular_emporium",
	background_icon_state: "bg_alien",
});

// cellular_emporium.dm:76
rt.def("/datum/action/innate/cellular_emporium/proc/New", function* New(f: Frame, our_target: Value) {
	f.dot = (yield* parent_proc());
	this.button.name = this.name;
	if (rt.istype(our_target, T("/datum/cellular_emporium"))) {
		this.cellular_emporium = our_target;
	} else {
		rt.throw_(f, (yield* new_(T("/exception"), "cellular_emporium action created with non emporium", "code/game/gamemodes/changeling/cellular_emporium.dm", 81)));
	}
	return f.dot;
}, true);

// cellular_emporium.dm:84
rt.def("/datum/action/innate/cellular_emporium/proc/Activate", function* Activate(f: Frame) {
	yield* this.cellular_emporium.ui_interact(this.owner);
	return f.dot;
}, true);
