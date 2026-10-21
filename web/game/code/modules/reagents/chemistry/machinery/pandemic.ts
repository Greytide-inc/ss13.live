// From code/modules/reagents/chemistry/machinery/pandemic.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/computer/pandemic/proc/Initialize  (code/modules/reagents/chemistry/machinery/pandemic.dm:16)  may sleep
rt.def("/obj/machinery/computer/pandemic/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/computer/pandemic/proc/Destroy  (code/modules/reagents/chemistry/machinery/pandemic.dm:20)  may sleep
rt.def("/obj/machinery/computer/pandemic/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "beaker")]);
	rt.setSv(f, "beaker", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/pandemic/proc/get_by_index  (code/modules/reagents/chemistry/machinery/pandemic.dm:24)
rt.def("/obj/machinery/computer/pandemic/proc/get_by_index", function get_by_index(f: Frame, thing: Value, index: Value) {
	let B: Value = null;
	f.vars = () => [B];
	if ((!truthy(rt.sv(f, "beaker")) || !truthy(rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
		return live(f.dot);
	}
	if (!(truthy((B = rt.locateIn(f, T("/datum/reagent/blood"), rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "beaker")))))) && truthy(rt.index(rt.fv(f, "data", live(B)), live(thing))))) return f.dot;
	return rt.index(rt.index(rt.fv(f, "data", live(B)), live(thing)), live(index));
});

// /obj/machinery/computer/pandemic/proc/get_virus_id_by_index  (code/modules/reagents/chemistry/machinery/pandemic.dm:31)  may sleep
rt.def("/obj/machinery/computer/pandemic/proc/get_virus_id_by_index", function* get_virus_id_by_index(f: Frame, index: Value) {
	let D: Value = null;
	f.vars = () => [index, D];
	if (!truthy((D = (yield* g.srcCall(f, "get_by_index", "viruses", live(index)))))) return f.dot;
	return (yield* g.callName(f, live(D), "GetDiseaseID", []));
}, true);

// /obj/machinery/computer/pandemic/proc/get_viruses_data  (code/modules/reagents/chemistry/machinery/pandemic.dm:36)  may sleep
rt.def("/obj/machinery/computer/pandemic/proc/get_viruses_data", function* get_viruses_data(f: Frame, B: Value) {
	let V: Value = null, index: Value = null, virus: Value = null, D: Value = null, _this: Value = null, A: Value = null, symptom: Value = null, S: Value = null, this_symptom: Value = null;
	let $e: any, $t: any;
	f.vars = () => [B, V, index, virus, D, _this, A, symptom, S, this_symptom, $e, $t];
	f.dot = rt.list();
	if (!truthy((rt.istype(rt.index(rt.fv(f, "data", live(B)), "viruses"), T("/list")) ? 1 : 0))) {
		return live(f.dot);
	}
	V = rt.index(rt.fv(f, "data", live(B)), "viruses");
	index = 1;
	virus = null;
	rt.forList(f, 0, live(V));
	while (($e = rt.next(f, 0)) !== undefined) {
		virus = $e;
		if ((!truthy((rt.istype((D = live(virus)), T("/datum/disease")) ? 1 : 0)) || truthy(rt.bitAnd(rt.fv(f, "visibility_flags", live(D)), 2)))) {
			continue;
		}
		rt.setAt((_this = rt.list()), "name", rt.fv(f, "name", live(D)));
		if (truthy((rt.istype(live(D), T("/datum/disease/advance")) ? 1 : 0))) {
			if (isEqual(rt.gv(f, "name", (A = rt.index(rt.fv(f, "archive_diseases", rt.gl("SSdisease")), (yield* g.callName(f, live(D), "GetDiseaseID", []))))), "Unknown")) {
				rt.setAt(live(_this), "can_rename", 1);
			}
			rt.setAt(live(_this), "name", rt.fv(f, "name", live(A)));
			rt.setAt(live(_this), "is_adv", 1);
			rt.setAt(live(_this), "resistance", (yield* g.callName(f, live(A), "totalResistance", [])));
			rt.setAt(live(_this), "stealth", (yield* g.callName(f, live(A), "totalStealth", [])));
			rt.setAt(live(_this), "stage_speed", (yield* g.callName(f, live(A), "totalStageSpeed", [])));
			rt.setAt(live(_this), "transmission", (yield* g.callName(f, live(A), "totalTransmittable", [])));
			rt.setAt(live(_this), "symptoms", rt.list());
			symptom = null;
			rt.forList(f, 1, rt.fv(f, "symptoms", live(A)));
			while (($e = rt.next(f, 1)) !== undefined) {
				symptom = $e;
				S = live(symptom);
				rt.setAt((this_symptom = rt.list()), "name", rt.fv(f, "name", live(S)));
				rt.modAt(live(_this), "symptoms", rt.list(live(this_symptom)), add);
			}
			rt.endFor(f, 1);
		}
		rt.setAt(live(_this), "index", ($t = live(index), index = rt.inc($t, 1), $t));
		rt.setAt(live(_this), "agent", rt.fv(f, "agent", live(D)));
		rt.setAt(live(_this), "description", (rt.fv(f, "desc", live(D)) || "none"));
		rt.setAt(live(_this), "spread", (rt.fv(f, "spread_text", live(D)) || "none"));
		rt.setAt(live(_this), "cure", (rt.fv(f, "cure_text", live(D)) || "none"));
		f.dot = rt.modify(live(f.dot), rt.list(live(_this)), add);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/computer/pandemic/proc/get_resistance_data  (code/modules/reagents/chemistry/machinery/pandemic.dm:73)
rt.def("/obj/machinery/computer/pandemic/proc/get_resistance_data", function get_resistance_data(f: Frame, B: Value) {
	let resistances: Value = null, id: Value = null, _this: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [resistances, id, _this, D, $e];
	f.dot = rt.list();
	if (!truthy((rt.istype(rt.index(rt.fv(f, "data", live(B)), "resistances"), T("/list")) ? 1 : 0))) {
		return live(f.dot);
	}
	resistances = rt.index(rt.fv(f, "data", live(B)), "resistances");
	id = null;
	rt.forList(f, 0, live(resistances));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		_this = rt.list();
		if (truthy((D = rt.index(rt.fv(f, "archive_diseases", rt.gl("SSdisease")), live(id))))) {
			rt.setAt(live(_this), "id", live(id));
			rt.setAt(live(_this), "name", rt.fv(f, "name", live(D)));
		}
		f.dot = rt.modify(live(f.dot), rt.list(live(_this)), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/computer/pandemic/proc/reset_replicator_cooldown  (code/modules/reagents/chemistry/machinery/pandemic.dm:87)
rt.def("/obj/machinery/computer/pandemic/proc/reset_replicator_cooldown", function reset_replicator_cooldown(f: Frame) {
	rt.setSv(f, "wait", 0);
	rt.callSrc(f, "update_icon", []);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/ping.ogg"), 30, 1]);
	return f.dot;
});

// /obj/machinery/computer/pandemic/proc/update_icon  (code/modules/reagents/chemistry/machinery/pandemic.dm:91)
rt.def("/obj/machinery/computer/pandemic/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		if (truthy(rt.sv(f, "beaker"))) {
			$0 = "mixer1_b";
		} else {
			$0 = "mixer0_b";
		}
		rt.setSv(f, "icon_state", $0);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "beaker"))) {
		$0 = "1";
	} else {
		$0 = "0";
	}
	if (truthy(rt.callSrc(f, "powered", []))) {
		$1 = "";
	} else {
		$1 = "_nopower";
	}
	rt.setSv(f, "icon_state", fmt("mixer＀＀", [$0, $1]));
	if (truthy(rt.sv(f, "wait"))) {
		rt.callSrc(f, "cut_overlays", []);
	} else {
		rt.callSrc(f, "add_overlay", ["waitlight"]);
	}
	return f.dot;
});

// /obj/machinery/computer/pandemic/proc/eject_beaker  (code/modules/reagents/chemistry/machinery/pandemic.dm:102)  may sleep
rt.def("/obj/machinery/computer/pandemic/proc/eject_beaker", function* eject_beaker(f: Frame) {
	yield* g.callName(f, rt.sv(f, "beaker"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	rt.setSv(f, "beaker", null);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/computer/pandemic/proc/ui_interact  (code/modules/reagents/chemistry/machinery/pandemic.dm:107)  may sleep
rt.def("/obj/machinery/computer/pandemic/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "pandemic", rt.sv(f, "name"), 700, 500, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/pandemic/proc/ui_data  (code/modules/reagents/chemistry/machinery/pandemic.dm:113)  may sleep
rt.def("/obj/machinery/computer/pandemic/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, B: Value = null;
	f.vars = () => [user, data, B];
	rt.setAt((data = rt.list()), "is_ready", (!truthy(rt.sv(f, "wait")) ? 1 : 0));
	if (truthy(rt.sv(f, "beaker"))) {
		rt.setAt(live(data), "has_beaker", 1);
		if ((!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker")))) || !truthy(rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "beaker")))))) {
			rt.setAt(live(data), "beaker_empty", 1);
		}
		if (truthy((B = rt.locateIn(f, T("/datum/reagent/blood"), rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "beaker"))))))) {
			rt.setAt(live(data), "has_blood", 1);
			rt.setAt(live(data), "blood", rt.list());
			rt.setAt(rt.at(live(data), "blood"), "dna", (rt.index(rt.fv(f, "data", live(B)), "blood_DNA") || "none"));
			rt.setAt(rt.at(live(data), "blood"), "type", (rt.index(rt.fv(f, "data", live(B)), "blood_type") || "none"));
			rt.setAt(live(data), "viruses", (yield* g.srcCall(f, "get_viruses_data", live(B))));
			rt.setAt(live(data), "resistances", (yield* g.srcCall(f, "get_resistance_data", live(B))));
		}
	}
	return live(data);
}, true);

// /obj/machinery/computer/pandemic/proc/ui_act  (code/modules/reagents/chemistry/machinery/pandemic.dm:131)  may sleep
rt.def("/obj/machinery/computer/pandemic/proc/ui_act", function* ui_act(f: Frame) {
	let id: Value = null, A: Value = null, new_name: Value = null, AD: Value = null, data: Value = null, B: Value = null, index: Value = null, D: Value = null, B_2: Value = null;
	let $0: any, $e: any;
	f.vars = () => [id, A, new_name, AD, data, B, index, D, B_2, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "eject_beaker") {
		yield* g.srcCall(f, "eject_beaker");
		f.dot = 1;
	} else if ($0 === "empty_beaker") {
		yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "clear_reagents", []);
		f.dot = 1;
	} else if ($0 === "empty_eject_beaker") {
		yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "clear_reagents", []);
		yield* g.srcCall(f, "eject_beaker");
		f.dot = 1;
	} else if ($0 === "rename_disease") {
		id = (yield* g.srcCall(f, "get_virus_id_by_index", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "index")]))));
		if (truthy((A = rt.index(rt.fv(f, "archive_diseases", rt.gl("SSdisease")), live(id))))) {
			if ((!truthy((new_name = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Name the disease", "New name", "", 42])))) || truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(A), "AssignName", [live(new_name)]);
			AD = null;
			rt.forList(f, 0, rt.fv(f, "processing", rt.gl("SSdisease")), T("/datum/disease/advance"));
			while (($e = rt.next(f, 0)) !== undefined) {
				AD = $e;
				yield* g.callName(f, live(AD), "Refresh", []);
			}
			rt.endFor(f, 0);
			f.dot = 1;
		}
	} else if ($0 === "create_culture_bottle") {
		id = (yield* g.srcCall(f, "get_virus_id_by_index", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "index")]))));
		A = (yield* g.new_(f, T("/datum/disease/advance"), [0, rt.index(rt.fv(f, "archive_diseases", rt.gl("SSdisease")), live(id))]));
		data = rt.alist(f, ["viruses", rt.list(live(A))]);
		rt.setFv(f, "name", (B = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle"), [rt.getStep(f, live(f.src), 0)]))), fmt("＀ culture bottle", [rt.fv(f, "name", live(A))]));
		rt.setFv(f, "desc", live(B), fmt("A small bottle. Contains ＀ culture in synthblood medium.", [rt.fv(f, "agent", live(A))]));
		yield* g.callName(f, rt.fv(f, "reagents", live(B)), "add_reagent", ["blood", 20, live(data)]);
		rt.setSv(f, "wait", 1);
		yield* g.srcCall(f, "update_icon");
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/computer/pandemic/proc/reset_replicator_cooldown")])), 50]);
		f.dot = 1;
	} else if ($0 === "create_vaccine_bottle") {
		index = rt.at(live(f.args[1]), "index");
		D = rt.index(rt.fv(f, "archive_diseases", rt.gl("SSdisease")), live(index));
		rt.setFv(f, "name", (B_2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle"), [rt.getStep(f, live(f.src), 0)]))), fmt("＀ vaccine bottle", [rt.fv(f, "name", live(D))]));
		yield* g.callName(f, rt.fv(f, "reagents", live(B_2)), "add_reagent", ["vaccine", 15, rt.list(live(index))]);
		rt.setSv(f, "wait", 1);
		yield* g.srcCall(f, "update_icon");
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/computer/pandemic/proc/reset_replicator_cooldown")])), 200]);
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/computer/pandemic/proc/attackby  (code/modules/reagents/chemistry/machinery/pandemic.dm:179)  may sleep
rt.def("/obj/machinery/computer/pandemic/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers")) ? 1 : 0)) && truthy(rt.bitAnd(rt.fv(f, "container_type", live(f.args[0])), 4096)))) {
		f.dot = 1;
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "beaker"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>A beaker is already loaded into the machine!</span>"]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setSv(f, "beaker", live(f.args[0]));
		yield* g.callName(f, rt.sv(f, "beaker"), "forceMove", [live(f.src)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the beaker to the machine.</span>"]);
		yield* g.srcCall(f, "update_icon");
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/computer/pandemic/proc/on_deconstruction  (code/modules/reagents/chemistry/machinery/pandemic.dm:198)  may sleep
rt.def("/obj/machinery/computer/pandemic/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	if (truthy(rt.sv(f, "beaker"))) {
		yield* g.callName(f, rt.sv(f, "beaker"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		rt.setSv(f, "beaker", null);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);
