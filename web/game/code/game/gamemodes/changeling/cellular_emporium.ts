// From code/game/gamemodes/changeling/cellular_emporium.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1194, "/datum/cellular_emporium", "/datum", {
	name: "cellular emporium",
	changeling: null,
});

// /datum/cellular_emporium/proc/New  (code/game/gamemodes/changeling/cellular_emporium.dm:9)
rt.def("/datum/cellular_emporium/proc/New", function New(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "changeling", live(f.args[0]));
	return f.dot;
}, false, { args: ["my_changeling"] });

// /datum/cellular_emporium/proc/Destroy  (code/game/gamemodes/changeling/cellular_emporium.dm:14)  may sleep
rt.def("/datum/cellular_emporium/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "changeling", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /datum/cellular_emporium/proc/ui_interact  (code/game/gamemodes/changeling/cellular_emporium.dm:17)  may sleep
rt.def("/datum/cellular_emporium/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("always_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "cellular_emporium", rt.sv(f, "name"), 900, 480, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /datum/cellular_emporium/proc/ui_data  (code/game/gamemodes/changeling/cellular_emporium.dm:23)
rt.def("/datum/cellular_emporium/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, can_readapt: Value = null, genetic_points_remaining: Value = null, absorbed_dna_count: Value = null, abilities: Value = null, path: Value = null, ability: Value = null, dna_cost: Value = null, AL: Value = null, req_dna: Value = null;
	let $e: any;
	f.vars = () => [data, can_readapt, genetic_points_remaining, absorbed_dna_count, abilities, path, ability, dna_cost, AL, req_dna, $e];
	data = rt.list();
	can_readapt = rt.fv(f, "canrespec", rt.sv(f, "changeling"));
	genetic_points_remaining = rt.fv(f, "geneticpoints", rt.sv(f, "changeling"));
	absorbed_dna_count = rt.fv(f, "absorbedcount", rt.sv(f, "changeling"));
	rt.setAt(live(data), "can_readapt", live(can_readapt));
	rt.setAt(live(data), "genetic_points_remaining", live(genetic_points_remaining));
	rt.setAt(live(data), "absorbed_dna_count", live(absorbed_dna_count));
	abilities = rt.list();
	path = null;
	rt.forList(f, 0, subtract(rt.call(f, P("/proc/typesof"), null, [T("/obj/effect/proc_holder/changeling")]), T("/obj/effect/proc_holder/changeling")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		ability = live(path);
		if (rt.le((dna_cost = rt.initial(f, live(ability), "dna_cost")), 0)) {
			continue;
		}
		rt.setAt((AL = rt.list()), "name", rt.initial(f, live(ability), "name"));
		rt.setAt(live(AL), "desc", rt.initial(f, live(ability), "desc"));
		rt.setAt(live(AL), "helptext", rt.initial(f, live(ability), "helptext"));
		rt.setAt(live(AL), "owned", rt.callName(f, rt.sv(f, "changeling"), "has_sting", [live(ability)]));
		req_dna = rt.initial(f, live(ability), "req_dna");
		rt.setAt(live(AL), "dna_cost", live(dna_cost));
		rt.setAt(live(AL), "can_purchase", ((rt.le(live(req_dna), live(absorbed_dna_count)) ? 1 : 0) && (rt.le(live(dna_cost), live(genetic_points_remaining)) ? 1 : 0)));
		abilities = rt.modify(live(abilities), rt.list(live(AL)), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "abilities", live(abilities));
	return live(data);
});

// /datum/cellular_emporium/proc/ui_act  (code/game/gamemodes/changeling/cellular_emporium.dm:58)  may sleep
rt.def("/datum/cellular_emporium/proc/ui_act", function* ui_act(f: Frame) {
	let sting_name: Value = null;
	let $0: any;
	f.vars = () => [sting_name, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "readapt") {
		if (truthy(rt.fv(f, "canrespec", rt.sv(f, "changeling")))) {
			yield* g.callName(f, rt.sv(f, "changeling"), "lingRespec", [live(f.usr)]);
		}
	} else if ($0 === "evolve") {
		sting_name = rt.at(live(f.args[1]), "name");
		yield* g.callName(f, rt.sv(f, "changeling"), "purchasePower", [live(f.usr), live(sting_name)]);
	}
	return f.dot;
}, true, { args: ["action", "params"] });

rt.type(86, "/datum/action/innate/cellular_emporium", "/datum/action/innate", {
	cellular_emporium: null,
	name: "Cellular Emporium",
	button_icon_state: "cellular_emporium",
	background_icon_state: "bg_alien",
});

// /datum/action/innate/cellular_emporium/proc/New  (code/game/gamemodes/changeling/cellular_emporium.dm:76)  may sleep
rt.def("/datum/action/innate/cellular_emporium/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "name", rt.sv(f, "button"), rt.sv(f, "name"));
	if (truthy((rt.istype(live(f.args[0]), T("/datum/cellular_emporium")) ? 1 : 0))) {
		rt.setSv(f, "cellular_emporium", live(f.args[0]));
	} else {
		rt.throw_(f, (yield* g.new_(f, T("/exception"), ["cellular_emporium action created with non emporium", "code/game/gamemodes/changeling/cellular_emporium.dm", 81])));
	}
	return f.dot;
}, true, { args: ["our_target"] });

// /datum/action/innate/cellular_emporium/proc/Activate  (code/game/gamemodes/changeling/cellular_emporium.dm:84)  may sleep
rt.def("/datum/action/innate/cellular_emporium/proc/Activate", function* Activate(f: Frame) {
	yield* g.callName(f, rt.sv(f, "cellular_emporium"), "ui_interact", [rt.sv(f, "owner")]);
	return f.dot;
}, true);
