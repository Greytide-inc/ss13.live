// From code/modules/reagents/chemistry/recipes/drugs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2436, "/datum/chemical_reaction/space_drugs", "/datum/chemical_reaction", {
	name: "Space Drugs",
	id: "space_drugs",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/space_drugs/proc/<init>  (code/modules/reagents/chemistry/recipes/drugs.dm:4)
rt.def("/datum/chemical_reaction/space_drugs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["space_drugs", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["mercury", 1, "sugar", 1, "lithium", 1]));
	return f.dot;
});

rt.type(2437, "/datum/chemical_reaction/crank", "/datum/chemical_reaction", {
	name: "Crank",
	id: "crank",
	mix_message: "The mixture violently reacts, leaving behind a few crystalline shards.",
	required_temp: 390,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/crank/proc/<init>  (code/modules/reagents/chemistry/recipes/drugs.dm:10)
rt.def("/datum/chemical_reaction/crank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["crank", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["diphenhydramine", 1, "ammonia", 1, "lithium", 1, "sacid", 1, "welding_fuel", 1]));
	return f.dot;
});

rt.type(2438, "/datum/chemical_reaction/krokodil", "/datum/chemical_reaction", {
	name: "Krokodil",
	id: "krokodil",
	mix_message: "The mixture dries into a pale blue powder.",
	required_temp: 380,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/krokodil/proc/<init>  (code/modules/reagents/chemistry/recipes/drugs.dm:19)
rt.def("/datum/chemical_reaction/krokodil/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["krokodil", 6]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["diphenhydramine", 1, "morphine", 1, "cleaner", 1, "potassium", 1, "phosphorus", 1, "welding_fuel", 1]));
	return f.dot;
});

rt.type(2439, "/datum/chemical_reaction/methamphetamine", "/datum/chemical_reaction", {
	name: "methamphetamine",
	id: "methamphetamine",
	required_temp: 374,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/methamphetamine/proc/<init>  (code/modules/reagents/chemistry/recipes/drugs.dm:27)
rt.def("/datum/chemical_reaction/methamphetamine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["methamphetamine", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["ephedrine", 1, "iodine", 1, "phosphorus", 1, "hydrogen", 1]));
	return f.dot;
});

rt.type(2440, "/datum/chemical_reaction/bath_salts", "/datum/chemical_reaction", {
	name: "bath_salts",
	id: "bath_salts",
	required_temp: 374,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/bath_salts/proc/<init>  (code/modules/reagents/chemistry/recipes/drugs.dm:34)
rt.def("/datum/chemical_reaction/bath_salts/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["bath_salts", 7]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["bad_food", 1, "saltpetre", 1, "nutriment", 1, "cleaner", 1, "enzyme", 1, "tea", 1, "mercury", 1]));
	return f.dot;
});

rt.type(2441, "/datum/chemical_reaction/aranesp", "/datum/chemical_reaction", {
	name: "aranesp",
	id: "aranesp",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/aranesp/proc/<init>  (code/modules/reagents/chemistry/recipes/drugs.dm:41)
rt.def("/datum/chemical_reaction/aranesp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["aranesp", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["epinephrine", 1, "atropine", 1, "morphine", 1]));
	return f.dot;
});
