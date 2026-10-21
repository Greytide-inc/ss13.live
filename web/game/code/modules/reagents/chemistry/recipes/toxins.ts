// From code/modules/reagents/chemistry/recipes/toxins.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2641, "/datum/chemical_reaction/formaldehyde", "/datum/chemical_reaction", {
	name: "formaldehyde",
	id: "Formaldehyde",
	required_temp: 420,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/formaldehyde/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:5)
rt.def("/datum/chemical_reaction/formaldehyde/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["formaldehyde", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["ethanol", 1, "oxygen", 1, "silver", 1]));
	return f.dot;
});

rt.type(2642, "/datum/chemical_reaction/neurotoxin2", "/datum/chemical_reaction", {
	name: "neurotoxin2",
	id: "neurotoxin2",
	required_temp: 674,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/neurotoxin2/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:12)
rt.def("/datum/chemical_reaction/neurotoxin2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["neurotoxin2", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["space_drugs", 1]));
	return f.dot;
});

rt.type(2643, "/datum/chemical_reaction/cyanide", "/datum/chemical_reaction", {
	name: "Cyanide",
	id: "cyanide",
	required_temp: 380,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/cyanide/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:19)
rt.def("/datum/chemical_reaction/cyanide/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["cyanide", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["oil", 1, "ammonia", 1, "oxygen", 1]));
	return f.dot;
});

rt.type(2644, "/datum/chemical_reaction/itching_powder", "/datum/chemical_reaction", {
	name: "Itching Powder",
	id: "itching_powder",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/itching_powder/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:26)
rt.def("/datum/chemical_reaction/itching_powder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["itching_powder", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["welding_fuel", 1, "ammonia", 1, "charcoal", 1]));
	return f.dot;
});

rt.type(2645, "/datum/chemical_reaction/facid", "/datum/chemical_reaction", {
	name: "Fluorosulfuric acid",
	id: "facid",
	required_temp: 380,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/facid/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:32)
rt.def("/datum/chemical_reaction/facid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["facid", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["sacid", 1, "fluorine", 1, "hydrogen", 1, "potassium", 1]));
	return f.dot;
});

rt.type(2646, "/datum/chemical_reaction/sulfonal", "/datum/chemical_reaction", {
	name: "sulfonal",
	id: "sulfonal",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/sulfonal/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:39)
rt.def("/datum/chemical_reaction/sulfonal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["sulfonal", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["acetone", 1, "diethylamine", 1, "sulfur", 1]));
	return f.dot;
});

rt.type(2647, "/datum/chemical_reaction/lipolicide", "/datum/chemical_reaction", {
	name: "lipolicide",
	id: "lipolicide",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/lipolicide/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:45)
rt.def("/datum/chemical_reaction/lipolicide/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["lipolicide", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["mercury", 1, "diethylamine", 1, "ephedrine", 1]));
	return f.dot;
});

rt.type(2648, "/datum/chemical_reaction/mutagen", "/datum/chemical_reaction", {
	name: "Unstable mutagen",
	id: "mutagen",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/mutagen/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:51)
rt.def("/datum/chemical_reaction/mutagen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["mutagen", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["radium", 1, "phosphorus", 1, "chlorine", 1]));
	return f.dot;
});

rt.type(2649, "/datum/chemical_reaction/lexorin", "/datum/chemical_reaction", {
	name: "Lexorin",
	id: "lexorin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/lexorin/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:57)
rt.def("/datum/chemical_reaction/lexorin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["lexorin", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1, "hydrogen", 1, "nitrogen", 1]));
	return f.dot;
});

rt.type(2650, "/datum/chemical_reaction/chloralhydrate", "/datum/chemical_reaction", {
	name: "Chloral Hydrate",
	id: "chloralhydrate",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/chloralhydrate/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:63)
rt.def("/datum/chemical_reaction/chloralhydrate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["chloralhydrate", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["ethanol", 1, "chlorine", 3, "water", 1]));
	return f.dot;
});

rt.type(2651, "/datum/chemical_reaction/mutetoxin", "/datum/chemical_reaction", {
	name: "Mute toxin",
	id: "mutetoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/mutetoxin/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:69)
rt.def("/datum/chemical_reaction/mutetoxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["mutetoxin", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["uranium", 2, "water", 1, "carbon", 1]));
	return f.dot;
});

rt.type(2652, "/datum/chemical_reaction/zombiepowder", "/datum/chemical_reaction", {
	name: "Zombie Powder",
	id: "zombiepowder",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/zombiepowder/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:75)
rt.def("/datum/chemical_reaction/zombiepowder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["zombiepowder", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["carpotoxin", 5, "morphine", 5, "copper", 5]));
	return f.dot;
});

rt.type(2653, "/datum/chemical_reaction/mindbreaker", "/datum/chemical_reaction", {
	name: "Mindbreaker Toxin",
	id: "mindbreaker",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/mindbreaker/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:81)
rt.def("/datum/chemical_reaction/mindbreaker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["mindbreaker", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["silicon", 1, "hydrogen", 1, "charcoal", 1]));
	return f.dot;
});

rt.type(2654, "/datum/chemical_reaction/heparin", "/datum/chemical_reaction", {
	name: "Heparin",
	id: "Heparin",
	mix_message: "<span class='danger'>The mixture thins and loses all color.</span>",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/heparin/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:87)
rt.def("/datum/chemical_reaction/heparin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["heparin", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["formaldehyde", 1, "sodium", 1, "chlorine", 1, "lithium", 1]));
	return f.dot;
});

rt.type(2655, "/datum/chemical_reaction/rotatium", "/datum/chemical_reaction", {
	name: "Rotatium",
	id: "Rotatium",
	mix_message: "<span class='danger'>After sparks, fire, and the smell of mindbreaker, the mix is constantly spinning with no stop in sight.</span>",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/rotatium/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:94)
rt.def("/datum/chemical_reaction/rotatium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["rotatium", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["mindbreaker", 1, "teslium", 1, "neurotoxin2", 1]));
	return f.dot;
});

rt.type(2656, "/datum/chemical_reaction/skewium", "/datum/chemical_reaction", {
	name: "Skewium",
	id: "Skewium",
	mix_message: "<span class='danger'>Wow! it turns out if you mix rotatium with some plasma and sulphuric acid, it gets even worse!</span>",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/skewium/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:101)
rt.def("/datum/chemical_reaction/skewium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["skewium", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["rotatium", 2, "plasma", 2, "sacid", 1]));
	return f.dot;
});

rt.type(2657, "/datum/chemical_reaction/anacea", "/datum/chemical_reaction", {
	name: "Anacea",
	id: "anacea",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/anacea/proc/<init>  (code/modules/reagents/chemistry/recipes/toxins.dm:108)
rt.def("/datum/chemical_reaction/anacea/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["anacea", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["haloperidol", 1, "impedrezene", 1, "radium", 1]));
	return f.dot;
});
