// From code/game/mecha/equipment/tools/medical_tools.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9607, "/obj/item/mecha_parts/mecha_equipment/medical", "/obj/item/mecha_parts/mecha_equipment", {});

// /obj/item/mecha_parts/mecha_equipment/medical/proc/New  (code/game/mecha/equipment/tools/medical_tools.dm:6)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/proc/can_attach  (code/game/mecha/equipment/tools/medical_tools.dm:11)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/proc/can_attach", function can_attach(f: Frame) {
	if (!(truthy(rt.callSuper(f, [], rt.Args.Same)) && truthy((rt.istype(live(f.args[0]), T("/obj/mecha/medical")) ? 1 : 0)))) return f.dot;
	return 1;
}, false, { args: ["M"] });

// /obj/item/mecha_parts/mecha_equipment/medical/proc/attach  (code/game/mecha/equipment/tools/medical_tools.dm:16)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/proc/attach", function attach(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, false, { args: ["M"] });

// /obj/item/mecha_parts/mecha_equipment/medical/proc/Destroy  (code/game/mecha/equipment/tools/medical_tools.dm:20)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/proc/process  (code/game/mecha/equipment/tools/medical_tools.dm:24)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/proc/process", function process(f: Frame) {
	if (truthy(rt.sv(f, "chassis"))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return 1;
}, false, { waitfor: false });

rt.type(9608, "/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam", "/obj/item/mecha_parts/mecha_equipment/medical", {
	medigun: null,
	energy_drain: 10,
	range: 3,
	equip_cooldown: 0,
	name: "exosuit medical beamgun",
	desc: "Equipment for medical exosuits. Generates a focused beam of medical nanites.",
	icon_state: "mecha_medigun",
	origin_tech: "combat=5;materials=6;powerstorage=7;biotech=6",
	materials: null,
});

// /obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/detach  (code/game/mecha/equipment/tools/medical_tools.dm:29)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/detach", function* detach(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(9609, "/obj/item/mecha_parts/mecha_equipment/medical/sleeper", "/obj/item/mecha_parts/mecha_equipment/medical", {
	patient: null,
	inject_amount: 10,
	energy_drain: 20,
	range: 1,
	equip_cooldown: 20,
	salvageable: 0,
	name: "mounted sleeper",
	desc: "Equipment for medical exosuits. A mounted sleeper that stabilizes patients and can inject reagents in the exosuit's reserves.",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	origin_tech: "engineering=3;biotech=3;plasmatech=2",
});

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/Destroy  (code/game/mecha/equipment/tools/medical_tools.dm:49)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/Destroy", function* Destroy(f: Frame) {
	let AM: Value = null;
	let $e: any;
	f.vars = () => [AM, $e];
	AM = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.callName(f, live(AM), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/action  (code/game/mecha/equipment/tools/medical_tools.dm:57)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/action", function* action(f: Frame, target: Value) {
	f.vars = () => [target];
	if (!truthy((yield* g.srcCall(f, "action_checks", live(target))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(target), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "patient_insertion_check", live(target))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "occupant_message", fmt("<span class='notice'>You start putting ＀ into ＀...</span>", [live(target), live(f.src)]));
	yield* g.callName(f, rt.sv(f, "chassis"), "visible_message", [fmt("<span class='warning'>＀ starts putting ＀ into ％！.</span>", [rt.sv(f, "chassis"), live(target), live(f.src)])]);
	if (!truthy((yield* g.srcCall(f, "do_after_cooldown", live(target))))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "patient_insertion_check", live(target))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(target), "forceMove", [live(f.src)]);
	rt.setSv(f, "patient", live(target));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	yield* g.srcCall(f, "update_equip_info");
	yield* g.srcCall(f, "occupant_message", fmt("<span class='notice'>＀ successfully loaded into ＀. Life support functions engaged.</span>", [live(target), live(f.src)]));
	yield* g.callName(f, rt.sv(f, "chassis"), "visible_message", [fmt("<span class='warning'>＀ loads ＀ into ＀.</span>", [rt.sv(f, "chassis"), live(target), live(f.src)])]);
	yield* g.srcCall(f, "log_message", fmt("＀ loaded. Life support functions engaged.", [live(target)]));
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/patient_insertion_check  (code/game/mecha/equipment/tools/medical_tools.dm:77)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/patient_insertion_check", function patient_insertion_check(f: Frame, target: Value) {
	if (truthy(rt.fv(f, "buckled", live(target)))) {
		rt.callSrc(f, "occupant_message", [fmt("<span class='warning'>＀ will not fit into the sleeper because ＀ ＀ buckled to ＀!</span>", [live(target), rt.callName(f, live(target), "p_they", []), rt.callName(f, live(target), "p_are", []), rt.fv(f, "buckled", live(target))])]);
		return live(f.dot);
	}
	if (truthy(rt.callName(f, live(target), "has_buckled_mobs", []))) {
		rt.callSrc(f, "occupant_message", [fmt("<span class='warning'>＀ will not fit into the sleeper because of the creatures attached to it!</span>", [live(target)])]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "patient"))) {
		rt.callSrc(f, "occupant_message", ["<span class='warning'>The sleeper is already occupied!</span>"]);
		return live(f.dot);
	}
	return 1;
});

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/go_out  (code/game/mecha/equipment/tools/medical_tools.dm:89)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/go_out", function* go_out(f: Frame) {
	if (!truthy(rt.sv(f, "patient"))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "patient"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	yield* g.srcCall(f, "occupant_message", fmt("＀ ejected. Life support functions disabled.", [rt.sv(f, "patient")]));
	yield* g.srcCall(f, "log_message", fmt("＀ ejected. Life support functions disabled.", [rt.sv(f, "patient")]));
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	rt.setSv(f, "patient", null);
	yield* g.srcCall(f, "update_equip_info");
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/detach  (code/game/mecha/equipment/tools/medical_tools.dm:100)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/detach", function* detach(f: Frame) {
	if (truthy(rt.sv(f, "patient"))) {
		yield* g.srcCall(f, "occupant_message", fmt("<span class='warning'>Unable to detach ＀ - equipment occupied!</span>", [live(f.src)]));
		return live(f.dot);
	}
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_equip_info  (code/game/mecha/equipment/tools/medical_tools.dm:106)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_equip_info", function get_equip_info(f: Frame) {
	let output: Value = null, temp: Value = null;
	let $0: any, $1: any;
	f.vars = () => [output, temp, $0, $1];
	if (truthy((output = rt.callSuper(f, [], rt.Args.Same)))) {
		temp = "";
		if (truthy(rt.sv(f, "patient"))) {
			$0 = rt.sv(f, "patient");
			if (rt.gt(rt.fv(f, "stat", rt.sv(f, "patient")), 1)) {
				$1 = "*DECEASED*";
			} else {
				$1 = fmt("Health: ＀%", [rt.fv(f, "health", rt.sv(f, "patient"))]);
			}
			temp = fmt("<br />[Occupant: ＀ (＀)]<br /><a href='?src=＃;view_stats=1'>View stats</a>|<a href='?src=＃;eject=1'>Eject</a>", [$0, $1, live(f.src), live(f.src)]);
		}
		return fmt("＀ ＀", [live(output), live(temp)]);
	}
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/Topic  (code/game/mecha/equipment/tools/medical_tools.dm:115)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/Topic", function* Topic(f: Frame) {
	let filter: Value = null;
	f.vars = () => [filter];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.callName(f, (filter = (yield* g.new_(f, T("/datum/topic_input"), [live(f.args[0]), live(f.args[1])]))), "get", ["eject"])))) {
		yield* g.srcCall(f, "go_out");
	}
	if (truthy((yield* g.callName(f, live(filter), "get", ["view_stats"])))) {
		rt.op(f, "Browse", [], [rt.fv(f, "occupant", rt.sv(f, "chassis")), (yield* g.srcCall(f, "get_patient_stats")), "window=msleeper"], false);
		yield* g.call(f, P("/proc/onclose"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "msleeper"]);
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(filter), "get", ["inject"])))) {
		yield* g.srcCall(f, "inject_reagent", (yield* g.callName(f, live(filter), "getType", ["inject", T("/datum/reagent")])), (yield* g.callName(f, live(filter), "getObj", ["source"])));
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_patient_stats  (code/game/mecha/equipment/tools/medical_tools.dm:128)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_patient_stats", function get_patient_stats(f: Frame) {
	if (!truthy(rt.sv(f, "patient"))) {
		return live(f.dot);
	}
	return fmt("<html>\n\t\t\t\t<head>\n\t\t\t\t<title>＀ statistics</title>\n\t\t\t\t<script language='javascript' type='text/javascript'>\n\t\t\t\t＀\n\t\t\t\t</script>\n\t\t\t\t<style>\n\t\t\t\th3 {margin-bottom:2px;font-size:14px;}\n\t\t\t\t#lossinfo, #reagents, #injectwith {padding-left:15px;}\n\t\t\t\t</style>\n\t\t\t\t</head>\n\t\t\t\t<body>\n\t\t\t\t<h3>Health statistics</h3>\n\t\t\t\t<div id=\"lossinfo\">\n\t\t\t\t＀\n\t\t\t\t</div>\n\t\t\t\t<h3>Reagents in bloodstream</h3>\n\t\t\t\t<div id=\"reagents\">\n\t\t\t\t＀\n\t\t\t\t</div>\n\t\t\t\t<div id=\"injectwith\">\n\t\t\t\t＀\n\t\t\t\t</div>\n\t\t\t\t</body>\n\t\t\t\t</html>", [rt.sv(f, "patient"), "\n\nfunction replaceContent() {\n\tvar args = Array.prototype.slice.call(arguments);\n\tvar id = args[0];\n\tvar content = args[1];\n\tvar callback  = null;\n\tif(args[2]){\n\t\tcallback = args[2];\n\t\tif(args[3]){\n\t\t\targs = args.slice(3);\n\t\t}\n\t}\n\tvar parent = document.getElementById(id);\n\tif(typeof(parent)!=='undefined' && parent!=null){\n\t\tparent.innerHTML = content?content:'';\n\t}\n\tif(callback && window[callback]){\n\t\twindow[callback].apply(null,args);\n\t}\n}\n", rt.callSrc(f, "get_patient_dam", []), rt.callSrc(f, "get_patient_reagents", []), rt.callSrc(f, "get_available_reagents", [])]);
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_patient_dam  (code/game/mecha/equipment/tools/medical_tools.dm:158)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_patient_dam", function get_patient_dam(f: Frame) {
	let t1: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $9: any, $10: any, $11: any, $12: any, $13: any, $14: any;
	f.vars = () => [t1, $0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14];
	t1 = null;
	$0 = rt.fv(f, "stat", rt.sv(f, "patient"));
	if ($0 === 0) {
		t1 = "Conscious";
	} else if ($0 === 1) {
		t1 = "Unconscious";
	} else if ($0 === 2) {
		t1 = "*dead*";
	} else {
		t1 = "Unknown";
	}
	if (rt.gt(rt.fv(f, "health", rt.sv(f, "patient")), 50)) {
		$0 = "blue";
	} else {
		$0 = "red";
	}
	if (rt.gt(rt.fv(f, "stat", rt.sv(f, "patient")), 1)) {
		$1 = fmt("＀", [live(t1)]);
	} else {
		$1 = fmt("＀% (＀)", [rt.fv(f, "health", rt.sv(f, "patient")), live(t1)]);
	}
	if (rt.gt(rt.fv(f, "bodytemperature", rt.sv(f, "patient")), 50)) {
		$2 = "blue";
	} else {
		$2 = "red";
	}
	$3 = subtract(rt.fv(f, "bodytemperature", rt.sv(f, "patient")), 273.1499938964844);
	$4 = subtract(multiply(rt.fv(f, "bodytemperature", rt.sv(f, "patient")), 1.7999999523162842), 459.6700134277344);
	if (rt.lt(rt.callName(f, rt.sv(f, "patient"), "getBruteLoss", []), 60)) {
		$5 = "blue";
	} else {
		$5 = "red";
	}
	$6 = rt.callName(f, rt.sv(f, "patient"), "getBruteLoss", []);
	if (rt.lt(rt.callName(f, rt.sv(f, "patient"), "getOxyLoss", []), 60)) {
		$7 = "blue";
	} else {
		$7 = "red";
	}
	$8 = rt.callName(f, rt.sv(f, "patient"), "getOxyLoss", []);
	if (rt.lt(rt.callName(f, rt.sv(f, "patient"), "getToxLoss", []), 60)) {
		$9 = "blue";
	} else {
		$9 = "red";
	}
	$10 = rt.callName(f, rt.sv(f, "patient"), "getToxLoss", []);
	if (rt.lt(rt.callName(f, rt.sv(f, "patient"), "getFireLoss", []), 60)) {
		$11 = "blue";
	} else {
		$11 = "red";
	}
	$12 = rt.callName(f, rt.sv(f, "patient"), "getFireLoss", []);
	if (truthy(rt.callName(f, rt.sv(f, "patient"), "getCloneLoss", []))) {
		$13 = "Subject appears to have cellular damage.";
	} else {
		$13 = "";
	}
	if (truthy(rt.callName(f, rt.sv(f, "patient"), "getBrainLoss", []))) {
		$14 = "Significant brain damage detected.";
	} else {
		$14 = "";
	}
	return fmt("<font color=\"＀\"><b>Health:</b> ＀</font><br />\n\t\t\t\t<font color=\"＀\"><b>Core Temperature:</b> ＀&deg;C (＀&deg;F)</font><br />\n\t\t\t\t<font color=\"＀\"><b>Brute Damage:</b> ＀%</font><br />\n\t\t\t\t<font color=\"＀\"><b>Respiratory Damage:</b> ＀%</font><br />\n\t\t\t\t<font color=\"＀\"><b>Toxin Content:</b> ＀%</font><br />\n\t\t\t\t<font color=\"＀\"><b>Burn Severity:</b> ＀%</font><br />\n\t\t\t\t<font color=\"red\">＀</font><br />\n\t\t\t\t<font color=\"red\">＀</font><br />\n\t\t\t\t", [$0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14]);
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_patient_reagents  (code/game/mecha/equipment/tools/medical_tools.dm:178)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_patient_reagents", function get_patient_reagents(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	if (truthy(rt.fv(f, "reagents", rt.sv(f, "patient")))) {
		R = null;
		rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "patient"))), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			if (rt.gt(rt.fv(f, "volume", live(R)), 0)) {
				f.dot = rt.modify(live(f.dot), fmt("＀: ＀<br />", [live(R), rt.call(f, P("/proc/round"), null, [rt.fv(f, "volume", live(R)), 0.009999999776482582])]), add);
			}
		}
		rt.endFor(f, 0);
	}
	return (live(f.dot) || "None");
});

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_available_reagents  (code/game/mecha/equipment/tools/medical_tools.dm:186)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_available_reagents", function get_available_reagents(f: Frame) {
	let output: Value = null, SG: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [output, SG, R, $e];
	output = null;
	if (((truthy((SG = rt.locateIn(f, T("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun"), rt.sv(f, "chassis")))) && truthy(rt.fv(f, "reagents", live(SG)))) && truthy((rt.istype(rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(SG))), T("/list")) ? 1 : 0)))) {
		R = null;
		rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(SG))), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			if (rt.gt(rt.fv(f, "volume", live(R)), 0)) {
				output = rt.modify(live(output), fmt("<a href=\"?src=＃;inject=＃;source=＃\">Inject ＀</a><br />", [live(f.src), live(R), live(SG), rt.fv(f, "name", live(R))]), add);
			}
		}
		rt.endFor(f, 0);
	}
	return live(output);
});

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/inject_reagent  (code/game/mecha/equipment/tools/medical_tools.dm:195)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/inject_reagent", function* inject_reagent(f: Frame, R: Value, SG: Value) {
	let to_inject: Value = null;
	f.vars = () => [R, SG, to_inject];
	if ((((!truthy(live(R)) || !truthy(rt.sv(f, "patient"))) || !truthy(live(SG))) || !truthy((rt.isIn(f, live(SG), rt.fv(f, "equipment", rt.sv(f, "chassis"))) ? 1 : 0)))) {
		return 0;
	}
	if ((truthy((to_inject = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "volume", live(R)), rt.sv(f, "inject_amount")])))) && rt.le(add((yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "patient")), "get_reagent_amount", [rt.fv(f, "id", live(R))])), live(to_inject)), multiply(rt.sv(f, "inject_amount"), 2)))) {
		yield* g.srcCall(f, "occupant_message", fmt("Injecting ＀ with ＀ units of ＀.", [rt.sv(f, "patient"), live(to_inject), rt.fv(f, "name", live(R))]));
		yield* g.srcCall(f, "log_message", fmt("Injecting ＀ with ＀ units of ＀.", [rt.sv(f, "patient"), live(to_inject), rt.fv(f, "name", live(R))]));
		yield* g.call(f, P("/proc/add_logs"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "patient"), "injected", fmt("＀ (＀ - ＀ units)", [rt.sv(f, "name"), live(R), live(to_inject)])]);
		yield* g.callName(f, rt.fv(f, "reagents", live(SG)), "trans_id_to", [rt.sv(f, "patient"), rt.fv(f, "id", live(R)), live(to_inject)]);
		yield* g.srcCall(f, "update_equip_info");
	}
	return live(f.dot);
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/update_equip_info  (code/game/mecha/equipment/tools/medical_tools.dm:207)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/update_equip_info", function update_equip_info(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		if (truthy(rt.sv(f, "patient"))) {
			rt.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "msleeper.browser", "lossinfo", rt.callSrc(f, "get_patient_dam", [])]);
			rt.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "msleeper.browser", "reagents", rt.callSrc(f, "get_patient_reagents", [])]);
			rt.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "msleeper.browser", "injectwith", rt.callSrc(f, "get_available_reagents", [])]);
		}
		return 1;
	}
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/container_resist  (code/game/mecha/equipment/tools/medical_tools.dm:216)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "go_out");
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/process  (code/game/mecha/equipment/tools/medical_tools.dm:219)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/process", function* process(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, rt.sv(f, "chassis"), "has_charge", [rt.sv(f, "energy_drain")])))) {
		yield* g.srcCall(f, "set_ready_state", 1);
		yield* g.srcCall(f, "log_message", "Deactivated.");
		yield* g.srcCall(f, "occupant_message", fmt("＀ deactivated - no power.", [live(f.src)]));
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		return live(f.dot);
	}
	if (!truthy((M = rt.sv(f, "patient")))) {
		return live(f.dot);
	}
	if (rt.gt(rt.fv(f, "health", live(M)), 0)) {
		yield* g.callName(f, live(M), "adjustOxyLoss", [-1]);
	}
	yield* g.callName(f, live(M), "AdjustStun", [-80]);
	yield* g.callName(f, live(M), "AdjustKnockdown", [-80]);
	yield* g.callName(f, live(M), "AdjustUnconscious", [-80]);
	if (rt.lt((yield* g.callName(f, rt.fv(f, "reagents", live(M)), "get_reagent_amount", ["epinephrine"])), 5)) {
		yield* g.callName(f, rt.fv(f, "reagents", live(M)), "add_reagent", ["epinephrine", 5]);
	}
	yield* g.callName(f, rt.sv(f, "chassis"), "use_power", [rt.sv(f, "energy_drain")]);
	yield* g.srcCall(f, "update_equip_info");
	return f.dot;
}, true, { waitfor: false });

rt.type(9610, "/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun", "/obj/item/mecha_parts/mecha_equipment/medical", {
	syringes: null,
	known_reagents: null,
	processed_reagents: null,
	max_syringes: 10,
	max_volume: 75,
	synth_speed: 5,
	mode: 0,
	energy_drain: 10,
	range: 3,
	equip_cooldown: 10,
	name: "exosuit syringe gun",
	desc: "Equipment for medical exosuits. A chem synthesizer with syringe gun. Reagents inside are held in stasis, so no reactions will occur.",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	icon_state: "syringegun",
	origin_tech: "materials=3;biotech=4;magnets=4",
});

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/New  (code/game/mecha/equipment/tools/medical_tools.dm:264)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", rt.sv(f, "max_volume"));
	yield* g.callName(f, rt.sv(f, "reagents"), "set_reacting", [0]);
	rt.setSv(f, "syringes", (yield* g.new_(f, T("/list"), [])));
	rt.setSv(f, "known_reagents", rt.alist(f, ["epinephrine", "Epinephrine", "charcoal", "Charcoal"]));
	rt.setSv(f, "processed_reagents", (yield* g.new_(f, T("/list"), [])));
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/detach  (code/game/mecha/equipment/tools/medical_tools.dm:272)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/detach", function* detach(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/Destroy  (code/game/mecha/equipment/tools/medical_tools.dm:276)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/critfail  (code/game/mecha/equipment/tools/medical_tools.dm:280)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/critfail", function critfail(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "reagents"))) return f.dot;
	rt.callName(f, rt.sv(f, "reagents"), "set_reacting", [1]);
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/can_attach  (code/game/mecha/equipment/tools/medical_tools.dm:285)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/can_attach", function can_attach(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/mecha/medical")) ? 1 : 0))) {
			return 1;
		}
	}
	return 0;
}, false, { args: ["M"] });

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_equip_info  (code/game/mecha/equipment/tools/medical_tools.dm:291)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_equip_info", function get_equip_info(f: Frame) {
	let output: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [output, $0, $1, $2];
	if (truthy((output = rt.callSuper(f, [], rt.Args.Same)))) {
		$0 = live(output);
		$1 = live(f.src);
		if (truthy(rt.sv(f, "mode"))) {
			$1 = $1;
			$2 = "Analyze";
		} else {
			$2 = "Launch";
		}
		return fmt("＀ [<a href=\"?src=＃;toggle_mode=1\">＀</a>]<br />[Syringes: ＀/＀ | Reagents: ＀/＀]<br /><a href='?src=＃;show_reagents=1'>Reagents list</a>", [$0, $1, $2, rt.len(f, rt.sv(f, "syringes")), rt.sv(f, "max_syringes"), rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")), live(f.src)]);
	}
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/action  (code/game/mecha/equipment/tools/medical_tools.dm:297)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/action", function* action(f: Frame, target: Value) {
	let S: Value = null, trg: Value = null, mechsyringe: Value = null, originaloccupant: Value = null, i: Value = null, mobs: Value = null, M: Value = null, R: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [target, S, trg, mechsyringe, originaloccupant, i, mobs, M, R, A, $e];
	if (!truthy((yield* g.srcCall(f, "action_checks", live(target))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/obj/item/weapon/reagent_containers/syringe")) ? 1 : 0))) {
		return (yield* g.srcCall(f, "load_syringe", live(target)));
	}
	if (truthy((rt.istype(live(target), T("/obj/item/weapon/storage")) ? 1 : 0))) {
		S = null;
		rt.forList(f, 0, rt.fv(f, "contents", live(target)), T("/obj/item/weapon/reagent_containers/syringe"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			yield* g.srcCall(f, "load_syringe", live(S));
		}
		rt.endFor(f, 0);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "mode"))) {
		return (yield* g.srcCall(f, "analyze_reagents", live(target)));
	}
	if (!truthy(rt.len(f, rt.sv(f, "syringes")))) {
		yield* g.srcCall(f, "occupant_message", "<span class=\"alert\">No syringes loaded.</span>");
		return live(f.dot);
	}
	if (rt.le(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 0)) {
		yield* g.srcCall(f, "occupant_message", "<span class=\"alert\">No available reagents to load syringe with.</span>");
		return live(f.dot);
	}
	trg = rt.getStep(f, live(target), 0);
	yield* g.callName(f, (mechsyringe = rt.index(rt.sv(f, "syringes"), 1)), "forceMove", [rt.getStep(f, rt.sv(f, "chassis"), 0)]);
	yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(mechsyringe), (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "volume", live(mechsyringe)), rt.fv(f, "total_volume", rt.sv(f, "reagents"))]))]);
	(rt.modSrcVar(f, "syringes", live(mechsyringe), subtract));
	rt.setFv(f, "icon", live(mechsyringe), rt.rsc("icons/obj/chemical.dmi"));
	rt.setFv(f, "icon_state", live(mechsyringe), "syringeproj");
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "chassis"), rt.rsc("sound/items/syringeproj.ogg"), 50, 1]);
	yield* g.srcCall(f, "log_message", fmt("Launched ＀ from ＀, targeting ＀.", [live(mechsyringe), live(f.src), live(target)]));
	originaloccupant = rt.fv(f, "occupant", rt.sv(f, "chassis"));
	rt.spawnTail(f, 0, "/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/action: spawn at game/mecha/equipment/tools/medical_tools.dm:323", target, S, trg, mechsyringe, originaloccupant, i, mobs, M, R, A);
	return 1;
}, true);

// a spawn(0) body of /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/action: spawn at game/mecha/equipment/tools/medical_tools.dm:323", function* (f: Frame, target: Value, S: Value, trg: Value, mechsyringe: Value, originaloccupant: Value, i: Value, mobs: Value, M: Value, R: Value, A: Value) {
	let $e: any;
	f.vars = () => [target, S, trg, mechsyringe, originaloccupant, i, mobs, M, R, A, $e];
	f.src = null;
	i = null;
	i = 0;
	while (rt.lt(live(i), 6)) {
		if (!truthy(live(mechsyringe))) {
			break;
		}
		if (truthy((yield* g.call(f, P("/proc/step_towards"), null, [live(mechsyringe), live(trg)])))) {
			mobs = (yield* g.new_(f, T("/list"), []));
			M = null;
			rt.forList(f, 0, rt.fv(f, "loc", live(mechsyringe)), T("/mob/living/carbon"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				mobs = rt.modify(live(mobs), live(M), add);
			}
			rt.endFor(f, 0);
			if (truthy((M = (yield* g.call(f, P("/proc/safepick"), null, [live(mobs)]))))) {
				R = null;
				yield* g.callName(f, live(mechsyringe), "visible_message", [fmt("<span class=\"attack\"> ＀ was hit by the syringe!</span>", [live(M)])]);
				if (truthy((yield* g.callName(f, live(M), "can_inject", [null, 1])))) {
					if (truthy(rt.fv(f, "reagents", live(mechsyringe)))) {
						A = null;
						rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(mechsyringe))), T("/datum/reagent"));
						while (($e = rt.next(f, 0)) !== undefined) {
							A = $e;
							R = rt.modify(live(R), add(rt.fv(f, "id", live(A)), " ("), add);
							R = rt.modify(live(R), add((yield* g.call(f, P("/proc/num2text"), null, [rt.fv(f, "volume", live(A))])), "),"), add);
						}
						rt.endFor(f, 0);
					}
					rt.setFv(f, "icon_state", live(mechsyringe), rt.initial(f, live(mechsyringe), "icon_state"));
					rt.setFv(f, "icon", live(mechsyringe), rt.initial(f, live(mechsyringe), "icon"));
					yield* g.callName(f, rt.fv(f, "reagents", live(mechsyringe)), "reaction", [live(M), 5]);
					yield* g.callName(f, rt.fv(f, "reagents", live(mechsyringe)), "trans_to", [live(M), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(mechsyringe)))]);
					yield* g.callName(f, live(M), "take_bodypart_damage", [2]);
					yield* g.call(f, P("/proc/add_logs"), null, [live(originaloccupant), live(M), "shot", "syringegun"]);
				}
				break;
			} else {
				if (isEqual(rt.fv(f, "loc", live(mechsyringe)), live(trg))) {
					rt.setFv(f, "icon_state", live(mechsyringe), rt.initial(f, live(mechsyringe), "icon_state"));
					rt.setFv(f, "icon", live(mechsyringe), rt.initial(f, live(mechsyringe), "icon"));
					yield* g.callName(f, live(mechsyringe), "update_icon", []);
					break;
				}
			}
		} else {
			rt.setFv(f, "icon_state", live(mechsyringe), rt.initial(f, live(mechsyringe), "icon_state"));
			rt.setFv(f, "icon", live(mechsyringe), rt.initial(f, live(mechsyringe), "icon"));
			yield* g.callName(f, live(mechsyringe), "update_icon", []);
			break;
		}
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		i = rt.inc(live(i), 1);
	}
	return null;
});

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/Topic  (code/game/mecha/equipment/tools/medical_tools.dm:363)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/Topic", function* Topic(f: Frame) {
	let filter: Value = null, m: Value = null, message: Value = null, i: Value = null, reagent: Value = null, reagent_1: Value = null;
	let $0: any, $e: any;
	f.vars = () => [filter, m, message, i, reagent, reagent_1, $0, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.callName(f, (filter = (yield* g.new_(f, T("/datum/topic_input"), [live(f.args[0]), live(f.args[1])]))), "get", ["toggle_mode"])))) {
		rt.setSv(f, "mode", (!truthy(rt.sv(f, "mode")) ? 1 : 0));
		yield* g.srcCall(f, "update_equip_info");
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(filter), "get", ["select_reagents"])))) {
		rt.setFv(f, "len", rt.sv(f, "processed_reagents"), 0);
		m = 0;
		message = null;
		i = null;
		rt.forRange(f, 0, 1, rt.len(f, rt.sv(f, "known_reagents")), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (rt.ge(live(m), rt.sv(f, "synth_speed"))) {
				break;
			}
			if ((truthy((reagent = (yield* g.callName(f, live(filter), "get", [fmt("reagent_＀", [live(i)])])))) && truthy((rt.isIn(f, live(reagent), rt.sv(f, "known_reagents")) ? 1 : 0)))) {
				if (truthy(live(m))) {
					$0 = ", ";
				} else {
					$0 = null;
				}
				message = fmt("＀＀", [$0, rt.index(rt.sv(f, "known_reagents"), live(reagent))]);
				rt.modSrcVar(f, "processed_reagents", live(reagent), add);
				m = rt.inc(live(m), 1);
			}
		}
		rt.endFor(f, 0);
		if (truthy(rt.len(f, rt.sv(f, "processed_reagents")))) {
			message = rt.modify(live(message), " added to production", add);
			if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
				rt.setFv(f, "isprocessing", live(f.src), 1);
				rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
			}
			yield* g.srcCall(f, "occupant_message", live(message));
			yield* g.srcCall(f, "occupant_message", "Reagent processing started.");
			yield* g.srcCall(f, "log_message", "Reagent processing started.");
		}
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(filter), "get", ["show_reagents"])))) {
		rt.op(f, "Browse", [], [rt.fv(f, "occupant", rt.sv(f, "chassis")), (yield* g.srcCall(f, "get_reagents_page")), "window=msyringegun"], false);
	}
	if (truthy((yield* g.callName(f, live(filter), "get", ["purge_reagent"])))) {
		if (truthy((reagent_1 = (yield* g.callName(f, live(filter), "get", ["purge_reagent"]))))) {
			yield* g.callName(f, rt.sv(f, "reagents"), "del_reagent", [live(reagent_1)]);
		}
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(filter), "get", ["purge_all"])))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
		return live(f.dot);
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_reagents_page  (code/game/mecha/equipment/tools/medical_tools.dm:401)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_reagents_page", function get_reagents_page(f: Frame) {
	let output: Value = null;
	f.vars = () => [output];
	return (output = fmt("<html>\n\t\t\t\t\t\t<head>\n\t\t\t\t\t\t<title>Reagent Synthesizer</title>\n\t\t\t\t\t\t<script language='javascript' type='text/javascript'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</script>\n\t\t\t\t\t\t<style>\n\t\t\t\t\t\th3 {margin-bottom:2px;font-size:14px;}\n\t\t\t\t\t\t#reagents, #reagents_form {}\n\t\t\t\t\t\tform {width: 90%; margin:10px auto; border:1px dotted #999; padding:6px;}\n\t\t\t\t\t\t#submit {margin-top:5px;}\n\t\t\t\t\t\t</style>\n\t\t\t\t\t\t</head>\n\t\t\t\t\t\t<body>\n\t\t\t\t\t\t<h3>Current reagents:</h3>\n\t\t\t\t\t\t<div id=\"reagents\">\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<h3>Reagents production:</h3>\n\t\t\t\t\t\t<div id=\"reagents_form\">\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</body>\n\t\t\t\t\t\t</html>\n\t\t\t\t\t\t", ["\n\nfunction replaceContent() {\n\tvar args = Array.prototype.slice.call(arguments);\n\tvar id = args[0];\n\tvar content = args[1];\n\tvar callback  = null;\n\tif(args[2]){\n\t\tcallback = args[2];\n\t\tif(args[3]){\n\t\t\targs = args.slice(3);\n\t\t}\n\t}\n\tvar parent = document.getElementById(id);\n\tif(typeof(parent)!=='undefined' && parent!=null){\n\t\tparent.innerHTML = content?content:'';\n\t}\n\tif(callback && window[callback]){\n\t\twindow[callback].apply(null,args);\n\t}\n}\n", rt.callSrc(f, "get_current_reagents", []), rt.callSrc(f, "get_reagents_form", [])]));
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_reagents_form  (code/game/mecha/equipment/tools/medical_tools.dm:429)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_reagents_form", function get_reagents_form(f: Frame) {
	let r_list: Value = null, inputs: Value = null, output: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [r_list, inputs, output, $0, $1, $2];
	r_list = rt.callSrc(f, "get_reagents_list", []);
	inputs = null;
	if (truthy(live(r_list))) {
		inputs = rt.modify(live(inputs), fmt("<input type=\"hidden\" name=\"src\" value=\"＃\">", [live(f.src)]), add);
		inputs = rt.modify(live(inputs), "<input type=\"hidden\" name=\"select_reagents\" value=\"1\">", add);
		inputs = rt.modify(live(inputs), "<input id=\"submit\" type=\"submit\" value=\"Apply settings\">", add);
	}
	$0 = (live(r_list) || "No known reagents");
	$1 = live(inputs);
	if (truthy(live(r_list))) {
		$2 = fmt("<span style=\"font-size:80%;\">Only the first ＀ selected reagent５ will be added to production</span>", [rt.sv(f, "synth_speed")]);
	} else {
		$2 = null;
	}
	return (output = fmt("<form action=\"byond://\" method=\"get\">\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</form>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t", [$0, $1, $2]));
});

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_reagents_list  (code/game/mecha/equipment/tools/medical_tools.dm:445)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_reagents_list", function get_reagents_list(f: Frame) {
	let output: Value = null, i: Value = null, reagent_id: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [output, i, reagent_id, $0, $1, $2, $e];
	output = null;
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, rt.sv(f, "known_reagents")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		$0 = (reagent_id = rt.index(rt.sv(f, "known_reagents"), live(i)));
		$1 = live(i);
		if (truthy((rt.isIn(f, live(reagent_id), rt.sv(f, "processed_reagents")) ? 1 : 0))) {
			$2 = "checked=\"1\"";
		} else {
			$2 = null;
		}
		output = rt.modify(live(output), fmt("<input type=\"checkbox\" value=\"＀\" name=\"reagent_＀\" ＀> ＀<br />", [$0, $1, $2, rt.index(rt.sv(f, "known_reagents"), live(reagent_id))]), add);
	}
	rt.endFor(f, 0);
	return live(output);
});

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_current_reagents  (code/game/mecha/equipment/tools/medical_tools.dm:452)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_current_reagents", function get_current_reagents(f: Frame) {
	let output: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [output, R, $e];
	output = null;
	R = null;
	rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (rt.gt(rt.fv(f, "volume", live(R)), 0)) {
			output = rt.modify(live(output), fmt("＀: ＀ - <a href=\"?src=＃;purge_reagent=＀\">Purge Reagent</a><br />", [live(R), rt.call(f, P("/proc/round"), null, [rt.fv(f, "volume", live(R)), 0.0010000000474974513]), live(f.src), rt.fv(f, "id", live(R))]), add);
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(output))) {
		output = rt.modify(live(output), fmt("Total: ＀/＀ - <a href=\"?src=＃;purge_all=1\">Purge All</a>", [rt.call(f, P("/proc/round"), null, [rt.fv(f, "total_volume", rt.sv(f, "reagents")), 0.0010000000474974513]), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")), live(f.src)]), add);
	}
	return (live(output) || "None");
});

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/load_syringe  (code/game/mecha/equipment/tools/medical_tools.dm:460)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/load_syringe", function* load_syringe(f: Frame, S: Value) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [S, D, $e];
	if (rt.lt(rt.len(f, rt.sv(f, "syringes")), rt.sv(f, "max_syringes"))) {
		if (rt.ge((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(S)])), 2)) {
			yield* g.srcCall(f, "occupant_message", "The syringe is too far away.");
			return 0;
		}
		D = null;
		rt.forList(f, 0, rt.fv(f, "loc", live(S)), T("/obj/structure"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			if (!truthy((yield* g.callName(f, live(D), "CanPass", [live(S), rt.fv(f, "loc", live(f.src))])))) {
				yield* g.srcCall(f, "occupant_message", "Unable to load syringe.");
				return 0;
			}
		}
		rt.endFor(f, 0);
		D = null;
		rt.forList(f, 0, rt.fv(f, "loc", live(S)), T("/obj/machinery/door"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			if (!truthy((yield* g.callName(f, live(D), "CanPass", [live(S), rt.fv(f, "loc", live(f.src))])))) {
				yield* g.srcCall(f, "occupant_message", "Unable to load syringe.");
				return 0;
			}
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.fv(f, "reagents", live(S)), "trans_to", [live(f.src), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(S)))]);
		yield* g.callName(f, live(S), "forceMove", [live(f.src)]);
		rt.modSrcVar(f, "syringes", live(S), add);
		yield* g.srcCall(f, "occupant_message", "Syringe loaded.");
		yield* g.srcCall(f, "update_equip_info");
		return 1;
	}
	yield* g.srcCall(f, "occupant_message", fmt("The ＀ syringe chamber is full.", [live(f.src)]));
	return 0;
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/analyze_reagents  (code/game/mecha/equipment/tools/medical_tools.dm:482)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/analyze_reagents", function analyze_reagents(f: Frame, A: Value) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	if (rt.ge(rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(A)]), 4)) {
		rt.callSrc(f, "occupant_message", ["The object is too far away."]);
		return 0;
	}
	if ((!truthy(rt.fv(f, "reagents", live(A))) || truthy(rt.call(f, P("/proc/ismob"), null, [live(A)])))) {
		rt.callSrc(f, "occupant_message", [fmt("<span class=\"alert\">No reagent info gained from ＀.</span>", [live(A)])]);
		return 0;
	}
	rt.callSrc(f, "occupant_message", ["Analyzing reagents..."]);
	R = null;
	rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(A))), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if ((truthy(rt.fv(f, "can_synth", live(R))) && truthy(rt.callSrc(f, "add_known_reagent", [rt.fv(f, "id", live(R)), rt.fv(f, "name", live(R))])))) {
			rt.callSrc(f, "occupant_message", [fmt("Reagent analyzed, identified as ＀ and added to database.", [rt.fv(f, "name", live(R))])]);
			rt.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "msyringegun.browser", "reagents_form", rt.callSrc(f, "get_reagents_form", [])]);
		}
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "occupant_message", ["Analyzis complete."]);
	return 1;
});

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/add_known_reagent  (code/game/mecha/equipment/tools/medical_tools.dm:497)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/add_known_reagent", function add_known_reagent(f: Frame, r_id: Value, r_name: Value) {
	if (!truthy((rt.isIn(f, live(r_id), rt.sv(f, "known_reagents")) ? 1 : 0))) {
		rt.setAt((rt.modSrcVar(f, "known_reagents", live(r_id), add)), live(r_id), live(r_name));
		return 1;
	}
	return 0;
});

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/update_equip_info  (code/game/mecha/equipment/tools/medical_tools.dm:504)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/update_equip_info", function update_equip_info(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		rt.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "msyringegun.browser", "reagents", rt.callSrc(f, "get_current_reagents", [])]);
		rt.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "msyringegun.browser", "reagents_form", rt.callSrc(f, "get_reagents_form", [])]);
		return 1;
	}
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/on_reagent_change  (code/game/mecha/equipment/tools/medical_tools.dm:511)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_equip_info", []);
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/process  (code/game/mecha/equipment/tools/medical_tools.dm:517)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/process", function* process(f: Frame) {
	let amount: Value = null, reagent: Value = null;
	let $e: any;
	f.vars = () => [amount, reagent, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (((!truthy(rt.len(f, rt.sv(f, "processed_reagents"))) || rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))) || !truthy((yield* g.callName(f, rt.sv(f, "chassis"), "has_charge", [rt.sv(f, "energy_drain")]))))) {
		yield* g.srcCall(f, "occupant_message", "<span class=\"alert\">Reagent processing stopped.</a>");
		yield* g.srcCall(f, "log_message", "Reagent processing stopped.");
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		return live(f.dot);
	}
	amount = divide(rt.sv(f, "synth_speed"), rt.len(f, rt.sv(f, "processed_reagents")));
	reagent = null;
	rt.forList(f, 0, rt.sv(f, "processed_reagents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [live(reagent), live(amount)]);
		yield* g.callName(f, rt.sv(f, "chassis"), "use_power", [rt.sv(f, "energy_drain")]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/<init>  (code/game/mecha/equipment/tools/medical_tools.dm:540)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$glass", 8000, "$plasma", 3000, "$gold", 8000, "$diamond", 2000]));
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/New  (code/game/mecha/equipment/tools/medical_tools.dm:543)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "medigun", (yield* g.new_(f, T("/obj/item/weapon/gun/medbeam/mech"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/Destroy  (code/game/mecha/equipment/tools/medical_tools.dm:548)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "medigun")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/process  (code/game/mecha/equipment/tools/medical_tools.dm:552)
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/process", function process(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.callName(f, rt.sv(f, "medigun"), "process", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/action  (code/game/mecha/equipment/tools/medical_tools.dm:557)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/action", function* action(f: Frame, target: Value) {
	f.vars = () => [target];
	yield* g.callName(f, rt.sv(f, "medigun"), "process_fire", [live(target), rt.sv(f, "loc")]);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/detach  (code/game/mecha/equipment/tools/medical_tools.dm:561)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/detach", function* detach(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.callName(f, rt.sv(f, "medigun"), "LoseTarget", []);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
