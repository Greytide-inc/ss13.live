// From code/modules/reagents/chemistry/recipes/others.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2478, "/datum/chemical_reaction/sterilizine", "/datum/chemical_reaction", {
	name: "Sterilizine",
	id: "sterilizine",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/sterilizine/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:5)
rt.def("/datum/chemical_reaction/sterilizine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["sterilizine", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["ethanol", 1, "charcoal", 1, "chlorine", 1]));
	return f.dot;
});

rt.type(2479, "/datum/chemical_reaction/lube", "/datum/chemical_reaction", {
	name: "Space Lube",
	id: "lube",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/lube/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:11)
rt.def("/datum/chemical_reaction/lube/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["lube", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 1, "silicon", 1, "oxygen", 1]));
	return f.dot;
});

rt.type(2480, "/datum/chemical_reaction/spraytan", "/datum/chemical_reaction", {
	name: "Spray Tan",
	id: "spraytan",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/spraytan/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:17)
rt.def("/datum/chemical_reaction/spraytan/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["spraytan", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["orangejuice", 1, "oil", 1]));
	return f.dot;
});

rt.type(2481, "/datum/chemical_reaction/spraytan2", "/datum/chemical_reaction", {
	name: "Spray Tan",
	id: "spraytan",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/spraytan2/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:23)
rt.def("/datum/chemical_reaction/spraytan2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["spraytan", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["orangejuice", 1, "cornoil", 1]));
	return f.dot;
});

rt.type(2482, "/datum/chemical_reaction/impedrezene", "/datum/chemical_reaction", {
	name: "Impedrezene",
	id: "impedrezene",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/impedrezene/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:29)
rt.def("/datum/chemical_reaction/impedrezene/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["impedrezene", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["mercury", 1, "oxygen", 1, "sugar", 1]));
	return f.dot;
});

rt.type(2483, "/datum/chemical_reaction/cryptobiolin", "/datum/chemical_reaction", {
	name: "Cryptobiolin",
	id: "cryptobiolin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/cryptobiolin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:35)
rt.def("/datum/chemical_reaction/cryptobiolin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["cryptobiolin", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["potassium", 1, "oxygen", 1, "sugar", 1]));
	return f.dot;
});

rt.type(2484, "/datum/chemical_reaction/glycerol", "/datum/chemical_reaction", {
	name: "Glycerol",
	id: "glycerol",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/glycerol/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:41)
rt.def("/datum/chemical_reaction/glycerol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["glycerol", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["cornoil", 3, "sacid", 1]));
	return f.dot;
});

rt.type(2485, "/datum/chemical_reaction/sodiumchloride", "/datum/chemical_reaction", {
	name: "Sodium Chloride",
	id: "sodiumchloride",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/sodiumchloride/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:47)
rt.def("/datum/chemical_reaction/sodiumchloride/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["sodiumchloride", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 1, "sodium", 1, "chlorine", 1]));
	return f.dot;
});

rt.type(2486, "/datum/chemical_reaction/plasmasolidification", "/datum/chemical_reaction", {
	name: "Solid Plasma",
	id: "solidplasma",
	mob_react: 1,
	required_reagents: null,
});

// /datum/chemical_reaction/plasmasolidification/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:53)
rt.def("/datum/chemical_reaction/plasmasolidification/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["iron", 5, "frostoil", 5, "plasma", 20]));
	return f.dot;
});

// /datum/chemical_reaction/plasmasolidification/proc/on_reaction  (code/modules/reagents/chemistry/recipes/others.dm:57)  may sleep
rt.def("/datum/chemical_reaction/plasmasolidification/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, i: Value = null;
	f.vars = () => [holder, created_volume, location, i];
	location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	i = null;
	i = 1;
	while (rt.le(live(i), live(created_volume))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/mineral/plasma"), [live(location)]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(2487, "/datum/chemical_reaction/goldsolidification", "/datum/chemical_reaction", {
	name: "Solid Gold",
	id: "solidgold",
	mob_react: 1,
	required_reagents: null,
});

// /datum/chemical_reaction/goldsolidification/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:64)
rt.def("/datum/chemical_reaction/goldsolidification/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["frostoil", 5, "gold", 20, "iron", 1]));
	return f.dot;
});

// /datum/chemical_reaction/goldsolidification/proc/on_reaction  (code/modules/reagents/chemistry/recipes/others.dm:68)  may sleep
rt.def("/datum/chemical_reaction/goldsolidification/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, i: Value = null;
	f.vars = () => [holder, created_volume, location, i];
	location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	i = null;
	i = 1;
	while (rt.le(live(i), live(created_volume))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/mineral/gold"), [live(location)]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(2488, "/datum/chemical_reaction/capsaicincondensation", "/datum/chemical_reaction", {
	name: "Capsaicincondensation",
	id: "capsaicincondensation",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/capsaicincondensation/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:75)
rt.def("/datum/chemical_reaction/capsaicincondensation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["condensedcapsaicin", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["capsaicin", 1, "ethanol", 5]));
	return f.dot;
});

rt.type(2489, "/datum/chemical_reaction/soapification", "/datum/chemical_reaction", {
	name: "Soapification",
	id: "soapification",
	required_temp: 374,
	mob_react: 1,
	required_reagents: null,
});

// /datum/chemical_reaction/soapification/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:81)
rt.def("/datum/chemical_reaction/soapification/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["liquidgibs", 10, "lye", 10]));
	return f.dot;
});

// /datum/chemical_reaction/soapification/proc/on_reaction  (code/modules/reagents/chemistry/recipes/others.dm:86)  may sleep
rt.def("/datum/chemical_reaction/soapification/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, i: Value = null;
	f.vars = () => [holder, created_volume, location, i];
	location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	i = null;
	i = 1;
	while (rt.le(live(i), live(created_volume))) {
		yield* g.new_(f, T("/obj/item/weapon/soap/homemade"), [live(location)]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(2490, "/datum/chemical_reaction/candlefication", "/datum/chemical_reaction", {
	name: "Candlefication",
	id: "candlefication",
	required_temp: 374,
	mob_react: 1,
	required_reagents: null,
});

// /datum/chemical_reaction/candlefication/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:93)
rt.def("/datum/chemical_reaction/candlefication/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["liquidgibs", 5, "oxygen", 5]));
	return f.dot;
});

// /datum/chemical_reaction/candlefication/proc/on_reaction  (code/modules/reagents/chemistry/recipes/others.dm:98)  may sleep
rt.def("/datum/chemical_reaction/candlefication/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, i: Value = null;
	f.vars = () => [holder, created_volume, location, i];
	location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	i = null;
	i = 1;
	while (rt.le(live(i), live(created_volume))) {
		yield* g.new_(f, T("/obj/item/candle"), [live(location)]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(2491, "/datum/chemical_reaction/meatification", "/datum/chemical_reaction", {
	name: "Meatification",
	id: "meatification",
	mob_react: 1,
	required_reagents: null,
});

// /datum/chemical_reaction/meatification/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:105)
rt.def("/datum/chemical_reaction/meatification/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["liquidgibs", 10, "nutriment", 10, "carbon", 10]));
	return f.dot;
});

// /datum/chemical_reaction/meatification/proc/on_reaction  (code/modules/reagents/chemistry/recipes/others.dm:109)  may sleep
rt.def("/datum/chemical_reaction/meatification/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, i: Value = null;
	f.vars = () => [holder, created_volume, location, i];
	location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	i = null;
	i = 1;
	while (rt.le(live(i), live(created_volume))) {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/meatproduct"), [live(location)]);
		i = rt.inc(live(i), 1);
	}
	return live(f.dot);
}, true);

rt.type(2492, "/datum/chemical_reaction/carbondioxide", "/datum/chemical_reaction", {
	name: "Direct Carbon Oxidation",
	id: "burningcarbon",
	required_temp: 777,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/carbondioxide/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:117)
rt.def("/datum/chemical_reaction/carbondioxide/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["co2", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["carbon", 1, "oxygen", 2]));
	return f.dot;
});

rt.type(2493, "/datum/chemical_reaction/nitrous_oxide", "/datum/chemical_reaction", {
	name: "Nitrous Oxide",
	id: "nitrous_oxide",
	required_temp: 525,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/nitrous_oxide/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:124)
rt.def("/datum/chemical_reaction/nitrous_oxide/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["nitrous_oxide", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["ammonia", 2, "nitrogen", 1, "oxygen", 2]));
	return f.dot;
});

rt.type(2494, "/datum/chemical_reaction/stable_mutation_toxin", "/datum/chemical_reaction", {
	name: "Stable Mutation Toxin",
	id: "stablemutationtoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/stable_mutation_toxin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:133)
rt.def("/datum/chemical_reaction/stable_mutation_toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["stablemutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["unstablemutationtoxin", 1, "blood", 1]));
	return f.dot;
});

rt.type(2495, "/datum/chemical_reaction/lizard_mutation_toxin", "/datum/chemical_reaction", {
	name: "Lizard Mutation Toxin",
	id: "lizardmutationtoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/lizard_mutation_toxin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:139)
rt.def("/datum/chemical_reaction/lizard_mutation_toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["lizardmutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["unstablemutationtoxin", 1, "radium", 1]));
	return f.dot;
});

rt.type(2496, "/datum/chemical_reaction/fly_mutation_toxin", "/datum/chemical_reaction", {
	name: "Fly Mutation Toxin",
	id: "flymutationtoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/fly_mutation_toxin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:145)
rt.def("/datum/chemical_reaction/fly_mutation_toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["flymutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["unstablemutationtoxin", 1, "mutagen", 1]));
	return f.dot;
});

rt.type(2497, "/datum/chemical_reaction/jelly_mutation_toxin", "/datum/chemical_reaction", {
	name: "Imperfect Mutation Toxin",
	id: "jellymutationtoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/jelly_mutation_toxin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:151)
rt.def("/datum/chemical_reaction/jelly_mutation_toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["jellymutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["unstablemutationtoxin", 1, "slimejelly", 1]));
	return f.dot;
});

rt.type(2498, "/datum/chemical_reaction/abductor_mutation_toxin", "/datum/chemical_reaction", {
	name: "Abductor Mutation Toxin",
	id: "abductormutationtoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/abductor_mutation_toxin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:157)
rt.def("/datum/chemical_reaction/abductor_mutation_toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["abductormutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["unstablemutationtoxin", 1, "morphine", 1]));
	return f.dot;
});

rt.type(2499, "/datum/chemical_reaction/android_mutation_toxin", "/datum/chemical_reaction", {
	name: "Android Mutation Toxin",
	id: "androidmutationtoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/android_mutation_toxin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:163)
rt.def("/datum/chemical_reaction/android_mutation_toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["androidmutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["unstablemutationtoxin", 1, "teslium", 1]));
	return f.dot;
});

rt.type(2500, "/datum/chemical_reaction/pod_mutation_toxin", "/datum/chemical_reaction", {
	name: "Podperson Mutation Toxin",
	id: "podmutationtoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/pod_mutation_toxin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:169)
rt.def("/datum/chemical_reaction/pod_mutation_toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["podmutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["unstablemutationtoxin", 1, "eznutriment", 1]));
	return f.dot;
});

rt.type(2501, "/datum/chemical_reaction/golem_mutation_toxin", "/datum/chemical_reaction", {
	name: "Golem Mutation Toxin",
	id: "golemmutationtoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/golem_mutation_toxin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:175)
rt.def("/datum/chemical_reaction/golem_mutation_toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["golemmutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["unstablemutationtoxin", 1, "silver", 1]));
	return f.dot;
});

rt.type(2502, "/datum/chemical_reaction/skeleton_mutation_toxin", "/datum/chemical_reaction", {
	name: "Skeleton Mutation Toxin",
	id: "skeletonmutationtoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/skeleton_mutation_toxin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:183)
rt.def("/datum/chemical_reaction/skeleton_mutation_toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["skeletonmutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["amutationtoxin", 1, "milk", 1]));
	return f.dot;
});

rt.type(2503, "/datum/chemical_reaction/zombie_mutation_toxin", "/datum/chemical_reaction", {
	name: "Zombie Mutation Toxin",
	id: "zombiemutationtoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/zombie_mutation_toxin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:189)
rt.def("/datum/chemical_reaction/zombie_mutation_toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["zombiemutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["amutationtoxin", 1, "toxin", 1]));
	return f.dot;
});

rt.type(2504, "/datum/chemical_reaction/ash_mutation_toxin", "/datum/chemical_reaction", {
	name: "Ash Mutation Toxin",
	id: "ashmutationtoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/ash_mutation_toxin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:195)
rt.def("/datum/chemical_reaction/ash_mutation_toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["ashmutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["amutationtoxin", 1, "lizardmutationtoxin", 1, "ash", 1]));
	return f.dot;
});

rt.type(2505, "/datum/chemical_reaction/plasma_mutation_toxin", "/datum/chemical_reaction", {
	name: "Plasma Mutation Toxin",
	id: "plasmamutationtoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/plasma_mutation_toxin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:203)
rt.def("/datum/chemical_reaction/plasma_mutation_toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["plasmamutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["skeletonmutationtoxin", 1, "plasma", 1, "uranium", 1]));
	return f.dot;
});

rt.type(2506, "/datum/chemical_reaction/shadow_mutation_toxin", "/datum/chemical_reaction", {
	name: "Shadow Mutation Toxin",
	id: "shadowmutationtoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/shadow_mutation_toxin/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:209)
rt.def("/datum/chemical_reaction/shadow_mutation_toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["shadowmutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["amutationtoxin", 1, "liquid_dark_matter", 1, "holywater", 1]));
	return f.dot;
});

rt.type(2507, "/datum/chemical_reaction/mulligan", "/datum/chemical_reaction", {
	name: "Mulligan",
	id: "mulligan",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/mulligan/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:216)
rt.def("/datum/chemical_reaction/mulligan/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["mulligan", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["stablemutationtoxin", 1, "mutagen", 1]));
	return f.dot;
});

rt.type(2508, "/datum/chemical_reaction/virus_food", "/datum/chemical_reaction", {
	name: "Virus Food",
	id: "virusfood",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/virus_food/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:225)
rt.def("/datum/chemical_reaction/virus_food/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["virusfood", 15]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 5, "milk", 5]));
	return f.dot;
});

rt.type(2509, "/datum/chemical_reaction/virus_food_mutagen", "/datum/chemical_reaction", {
	name: "mutagenic agar",
	id: "mutagenvirusfood",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/virus_food_mutagen/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:231)
rt.def("/datum/chemical_reaction/virus_food_mutagen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["mutagenvirusfood", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["mutagen", 1, "virusfood", 1]));
	return f.dot;
});

rt.type(2510, "/datum/chemical_reaction/virus_food_synaptizine", "/datum/chemical_reaction", {
	name: "virus rations",
	id: "synaptizinevirusfood",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/virus_food_synaptizine/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:237)
rt.def("/datum/chemical_reaction/virus_food_synaptizine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["synaptizinevirusfood", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["synaptizine", 1, "virusfood", 1]));
	return f.dot;
});

rt.type(2511, "/datum/chemical_reaction/virus_food_plasma", "/datum/chemical_reaction", {
	name: "virus plasma",
	id: "plasmavirusfood",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/virus_food_plasma/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:243)
rt.def("/datum/chemical_reaction/virus_food_plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["plasmavirusfood", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1, "virusfood", 1]));
	return f.dot;
});

rt.type(2512, "/datum/chemical_reaction/virus_food_plasma_synaptizine", "/datum/chemical_reaction", {
	name: "weakened virus plasma",
	id: "weakplasmavirusfood",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/virus_food_plasma_synaptizine/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:249)
rt.def("/datum/chemical_reaction/virus_food_plasma_synaptizine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["weakplasmavirusfood", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["synaptizine", 1, "plasmavirusfood", 1]));
	return f.dot;
});

rt.type(2513, "/datum/chemical_reaction/virus_food_mutagen_sugar", "/datum/chemical_reaction", {
	name: "sucrose agar",
	id: "sugarvirusfood",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/virus_food_mutagen_sugar/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:255)
rt.def("/datum/chemical_reaction/virus_food_mutagen_sugar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["sugarvirusfood", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["sugar", 1, "mutagenvirusfood", 1]));
	return f.dot;
});

rt.type(2514, "/datum/chemical_reaction/virus_food_mutagen_salineglucose", "/datum/chemical_reaction", {
	name: "sucrose agar",
	id: "salineglucosevirusfood",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/virus_food_mutagen_salineglucose/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:261)
rt.def("/datum/chemical_reaction/virus_food_mutagen_salineglucose/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["sugarvirusfood", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["salglu_solution", 1, "mutagenvirusfood", 1]));
	return f.dot;
});

rt.type(2515, "/datum/chemical_reaction/virus_food_uranium", "/datum/chemical_reaction", {
	name: "Decaying uranium gel",
	id: "uraniumvirusfood",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/virus_food_uranium/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:267)
rt.def("/datum/chemical_reaction/virus_food_uranium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["uraniumvirusfood", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["uranium", 1, "virusfood", 1]));
	return f.dot;
});

rt.type(2516, "/datum/chemical_reaction/virus_food_uranium_plasma", "/datum/chemical_reaction", {
	name: "Unstable uranium gel",
	id: "uraniumvirusfood_plasma",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/virus_food_uranium_plasma/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:273)
rt.def("/datum/chemical_reaction/virus_food_uranium_plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["uraniumplasmavirusfood_unstable", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["uranium", 5, "plasmavirusfood", 1]));
	return f.dot;
});

rt.type(2517, "/datum/chemical_reaction/virus_food_uranium_plasma_gold", "/datum/chemical_reaction", {
	name: "Stable uranium gel",
	id: "uraniumvirusfood_gold",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/virus_food_uranium_plasma_gold/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:279)
rt.def("/datum/chemical_reaction/virus_food_uranium_plasma_gold/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["uraniumplasmavirusfood_stable", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["uranium", 10, "gold", 10, "plasma", 1]));
	return f.dot;
});

rt.type(2518, "/datum/chemical_reaction/virus_food_uranium_plasma_silver", "/datum/chemical_reaction", {
	name: "Stable uranium gel",
	id: "uraniumvirusfood_silver",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/virus_food_uranium_plasma_silver/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:285)
rt.def("/datum/chemical_reaction/virus_food_uranium_plasma_silver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["uraniumplasmavirusfood_stable", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["uranium", 10, "silver", 10, "plasma", 1]));
	return f.dot;
});

rt.type(2519, "/datum/chemical_reaction/mix_virus", "/datum/chemical_reaction", {
	level_min: 0,
	level_max: 2,
	name: "Mix Virus",
	id: "mixvirus",
	results: null,
	required_reagents: null,
	required_catalysts: null,
});

// /datum/chemical_reaction/mix_virus/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:291)
rt.def("/datum/chemical_reaction/mix_virus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["blood", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["virusfood", 1]));
	rt.setSv(f, "required_catalysts", rt.alist(f, ["blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/mix_virus/proc/on_reaction  (code/modules/reagents/chemistry/recipes/others.dm:299)  may sleep
rt.def("/datum/chemical_reaction/mix_virus/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let B: Value = null, D: Value = null;
	f.vars = () => [holder, created_volume, B, D];
	if (!(truthy((B = rt.locateIn(f, T("/datum/reagent/blood"), rt.fv(f, "reagent_list", live(holder))))) && truthy(rt.fv(f, "data", live(B))))) return f.dot;
	if (!truthy((D = rt.locateIn(f, T("/datum/disease/advance"), rt.index(rt.fv(f, "data", live(B)), "viruses"))))) return f.dot;
	yield* g.callName(f, live(D), "Evolve", [rt.sv(f, "level_min"), rt.sv(f, "level_max")]);
	return f.dot;
}, true);

rt.type(2520, "/datum/chemical_reaction/mix_virus/mix_virus_2", "/datum/chemical_reaction/mix_virus", {
	name: "Mix Virus 2",
	id: "mixvirus2",
	level_min: 2,
	level_max: 4,
	required_reagents: null,
});

// /datum/chemical_reaction/mix_virus/mix_virus_2/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:310)
rt.def("/datum/chemical_reaction/mix_virus/mix_virus_2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["mutagen", 1]));
	return f.dot;
});

rt.type(2521, "/datum/chemical_reaction/mix_virus/mix_virus_3", "/datum/chemical_reaction/mix_virus", {
	name: "Mix Virus 3",
	id: "mixvirus3",
	level_min: 4,
	level_max: 6,
	required_reagents: null,
});

// /datum/chemical_reaction/mix_virus/mix_virus_3/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:318)
rt.def("/datum/chemical_reaction/mix_virus/mix_virus_3/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

rt.type(2522, "/datum/chemical_reaction/mix_virus/mix_virus_4", "/datum/chemical_reaction/mix_virus", {
	name: "Mix Virus 4",
	id: "mixvirus4",
	level_min: 5,
	level_max: 6,
	required_reagents: null,
});

// /datum/chemical_reaction/mix_virus/mix_virus_4/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:326)
rt.def("/datum/chemical_reaction/mix_virus/mix_virus_4/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["uranium", 1]));
	return f.dot;
});

rt.type(2523, "/datum/chemical_reaction/mix_virus/mix_virus_5", "/datum/chemical_reaction/mix_virus", {
	name: "Mix Virus 5",
	id: "mixvirus5",
	level_min: 3,
	level_max: 3,
	required_reagents: null,
});

// /datum/chemical_reaction/mix_virus/mix_virus_5/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:334)
rt.def("/datum/chemical_reaction/mix_virus/mix_virus_5/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["mutagenvirusfood", 1]));
	return f.dot;
});

rt.type(2524, "/datum/chemical_reaction/mix_virus/mix_virus_6", "/datum/chemical_reaction/mix_virus", {
	name: "Mix Virus 6",
	id: "mixvirus6",
	level_min: 4,
	level_max: 4,
	required_reagents: null,
});

// /datum/chemical_reaction/mix_virus/mix_virus_6/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:342)
rt.def("/datum/chemical_reaction/mix_virus/mix_virus_6/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["sugarvirusfood", 1]));
	return f.dot;
});

rt.type(2525, "/datum/chemical_reaction/mix_virus/mix_virus_7", "/datum/chemical_reaction/mix_virus", {
	name: "Mix Virus 7",
	id: "mixvirus7",
	level_min: 5,
	level_max: 5,
	required_reagents: null,
});

// /datum/chemical_reaction/mix_virus/mix_virus_7/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:350)
rt.def("/datum/chemical_reaction/mix_virus/mix_virus_7/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["weakplasmavirusfood", 1]));
	return f.dot;
});

rt.type(2526, "/datum/chemical_reaction/mix_virus/mix_virus_8", "/datum/chemical_reaction/mix_virus", {
	name: "Mix Virus 8",
	id: "mixvirus8",
	level_min: 6,
	level_max: 6,
	required_reagents: null,
});

// /datum/chemical_reaction/mix_virus/mix_virus_8/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:358)
rt.def("/datum/chemical_reaction/mix_virus/mix_virus_8/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasmavirusfood", 1]));
	return f.dot;
});

rt.type(2527, "/datum/chemical_reaction/mix_virus/mix_virus_9", "/datum/chemical_reaction/mix_virus", {
	name: "Mix Virus 9",
	id: "mixvirus9",
	level_min: 1,
	level_max: 1,
	required_reagents: null,
});

// /datum/chemical_reaction/mix_virus/mix_virus_9/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:366)
rt.def("/datum/chemical_reaction/mix_virus/mix_virus_9/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["synaptizinevirusfood", 1]));
	return f.dot;
});

rt.type(2528, "/datum/chemical_reaction/mix_virus/mix_virus_10", "/datum/chemical_reaction/mix_virus", {
	name: "Mix Virus 10",
	id: "mixvirus10",
	level_min: 6,
	level_max: 7,
	required_reagents: null,
});

// /datum/chemical_reaction/mix_virus/mix_virus_10/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:374)
rt.def("/datum/chemical_reaction/mix_virus/mix_virus_10/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["uraniumvirusfood", 1]));
	return f.dot;
});

rt.type(2529, "/datum/chemical_reaction/mix_virus/mix_virus_11", "/datum/chemical_reaction/mix_virus", {
	name: "Mix Virus 11",
	id: "mixvirus11",
	level_min: 7,
	level_max: 7,
	required_reagents: null,
});

// /datum/chemical_reaction/mix_virus/mix_virus_11/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:382)
rt.def("/datum/chemical_reaction/mix_virus/mix_virus_11/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["uraniumplasmavirusfood_unstable", 1]));
	return f.dot;
});

rt.type(2530, "/datum/chemical_reaction/mix_virus/mix_virus_12", "/datum/chemical_reaction/mix_virus", {
	name: "Mix Virus 12",
	id: "mixvirus12",
	level_min: 8,
	level_max: 8,
	required_reagents: null,
});

// /datum/chemical_reaction/mix_virus/mix_virus_12/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:390)
rt.def("/datum/chemical_reaction/mix_virus/mix_virus_12/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["uraniumplasmavirusfood_stable", 1]));
	return f.dot;
});

rt.type(2531, "/datum/chemical_reaction/mix_virus/rem_virus", "/datum/chemical_reaction/mix_virus", {
	name: "Devolve Virus",
	id: "remvirus",
	required_reagents: null,
	required_catalysts: null,
});

// /datum/chemical_reaction/mix_virus/rem_virus/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:398)
rt.def("/datum/chemical_reaction/mix_virus/rem_virus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["synaptizine", 1]));
	rt.setSv(f, "required_catalysts", rt.alist(f, ["blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/mix_virus/rem_virus/proc/on_reaction  (code/modules/reagents/chemistry/recipes/others.dm:403)  may sleep
rt.def("/datum/chemical_reaction/mix_virus/rem_virus/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let B: Value = null, D: Value = null;
	f.vars = () => [holder, created_volume, B, D];
	if (!(truthy((B = rt.locateIn(f, T("/datum/reagent/blood"), rt.fv(f, "reagent_list", live(holder))))) && truthy(rt.fv(f, "data", live(B))))) return f.dot;
	if (!truthy((D = rt.locateIn(f, T("/datum/disease/advance"), rt.index(rt.fv(f, "data", live(B)), "viruses"))))) return f.dot;
	yield* g.callName(f, live(D), "Devolve", []);
	return f.dot;
}, true);

rt.type(2532, "/datum/chemical_reaction/surfactant", "/datum/chemical_reaction", {
	name: "Foam surfactant",
	id: "foam surfactant",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/surfactant/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:417)
rt.def("/datum/chemical_reaction/surfactant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["fluorosurfactant", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["fluorine", 2, "carbon", 2, "sacid", 1]));
	return f.dot;
});

rt.type(2533, "/datum/chemical_reaction/foam", "/datum/chemical_reaction", {
	name: "Foam",
	id: "foam",
	mob_react: 1,
	required_reagents: null,
});

// /datum/chemical_reaction/foam/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:423)
rt.def("/datum/chemical_reaction/foam/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["fluorosurfactant", 1, "water", 1]));
	return f.dot;
});

// /datum/chemical_reaction/foam/proc/on_reaction  (code/modules/reagents/chemistry/recipes/others.dm:427)  may sleep
rt.def("/datum/chemical_reaction/foam/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, M: Value = null, s: Value = null;
	let $e: any;
	f.vars = () => [holder, created_volume, location, M, s, $e];
	location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [5, live(location)])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>The solution spews out foam!</span>"]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/foam_spread"), []))), "set_up", [multiply(live(created_volume), 2), live(location), live(holder)]);
	yield* g.callName(f, live(s), "start", []);
	yield* g.callName(f, live(holder), "clear_reagents", []);
	return live(f.dot);
}, true);

rt.type(2534, "/datum/chemical_reaction/metalfoam", "/datum/chemical_reaction", {
	name: "Metal Foam",
	id: "metalfoam",
	mob_react: 1,
	required_reagents: null,
});

// /datum/chemical_reaction/metalfoam/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:440)
rt.def("/datum/chemical_reaction/metalfoam/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["aluminium", 3, "foaming_agent", 1, "facid", 1]));
	return f.dot;
});

// /datum/chemical_reaction/metalfoam/proc/on_reaction  (code/modules/reagents/chemistry/recipes/others.dm:444)  may sleep
rt.def("/datum/chemical_reaction/metalfoam/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, M: Value = null, s: Value = null;
	let $e: any;
	f.vars = () => [holder, created_volume, location, M, s, $e];
	location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [5, live(location)])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>The solution spews out a metallic foam!</span>"]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/foam_spread/metal"), []))), "set_up", [multiply(live(created_volume), 5), live(location), live(holder), 1]);
	yield* g.callName(f, live(s), "start", []);
	yield* g.callName(f, live(holder), "clear_reagents", []);
	return f.dot;
}, true);

rt.type(2535, "/datum/chemical_reaction/ironfoam", "/datum/chemical_reaction", {
	name: "Iron Foam",
	id: "ironlfoam",
	mob_react: 1,
	required_reagents: null,
});

// /datum/chemical_reaction/ironfoam/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:457)
rt.def("/datum/chemical_reaction/ironfoam/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["iron", 3, "foaming_agent", 1, "facid", 1]));
	return f.dot;
});

// /datum/chemical_reaction/ironfoam/proc/on_reaction  (code/modules/reagents/chemistry/recipes/others.dm:461)  may sleep
rt.def("/datum/chemical_reaction/ironfoam/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, M: Value = null, s: Value = null;
	let $e: any;
	f.vars = () => [holder, created_volume, location, M, s, $e];
	location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [5, live(location)])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>The solution spews out a metallic foam!</span>"]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/foam_spread/metal"), []))), "set_up", [multiply(live(created_volume), 5), live(location), live(holder), 2]);
	yield* g.callName(f, live(s), "start", []);
	yield* g.callName(f, live(holder), "clear_reagents", []);
	return f.dot;
}, true);

rt.type(2536, "/datum/chemical_reaction/foaming_agent", "/datum/chemical_reaction", {
	name: "Foaming Agent",
	id: "foaming_agent",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/foaming_agent/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:472)
rt.def("/datum/chemical_reaction/foaming_agent/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["foaming_agent", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["lithium", 1, "hydrogen", 1]));
	return f.dot;
});

rt.type(2537, "/datum/chemical_reaction/ammonia", "/datum/chemical_reaction", {
	name: "Ammonia",
	id: "ammonia",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/ammonia/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:481)
rt.def("/datum/chemical_reaction/ammonia/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["ammonia", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["hydrogen", 3, "nitrogen", 1]));
	return f.dot;
});

rt.type(2538, "/datum/chemical_reaction/diethylamine", "/datum/chemical_reaction", {
	name: "Diethylamine",
	id: "diethylamine",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/diethylamine/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:487)
rt.def("/datum/chemical_reaction/diethylamine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["diethylamine", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["ammonia", 1, "ethanol", 1]));
	return f.dot;
});

rt.type(2539, "/datum/chemical_reaction/space_cleaner", "/datum/chemical_reaction", {
	name: "Space cleaner",
	id: "cleaner",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/space_cleaner/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:493)
rt.def("/datum/chemical_reaction/space_cleaner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["cleaner", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["ammonia", 1, "water", 1]));
	return f.dot;
});

rt.type(2540, "/datum/chemical_reaction/plantbgone", "/datum/chemical_reaction", {
	name: "Plant-B-Gone",
	id: "plantbgone",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/plantbgone/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:499)
rt.def("/datum/chemical_reaction/plantbgone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["plantbgone", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["toxin", 1, "water", 4]));
	return f.dot;
});

rt.type(2541, "/datum/chemical_reaction/weedkiller", "/datum/chemical_reaction", {
	name: "Weed Killer",
	id: "weedkiller",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/weedkiller/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:505)
rt.def("/datum/chemical_reaction/weedkiller/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["weedkiller", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["toxin", 1, "ammonia", 4]));
	return f.dot;
});

rt.type(2542, "/datum/chemical_reaction/pestkiller", "/datum/chemical_reaction", {
	name: "Pest Killer",
	id: "pestkiller",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/pestkiller/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:511)
rt.def("/datum/chemical_reaction/pestkiller/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["pestkiller", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["toxin", 1, "ethanol", 4]));
	return f.dot;
});

rt.type(2543, "/datum/chemical_reaction/drying_agent", "/datum/chemical_reaction", {
	name: "Drying agent",
	id: "drying_agent",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/drying_agent/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:517)
rt.def("/datum/chemical_reaction/drying_agent/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["drying_agent", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["stable_plasma", 2, "ethanol", 1, "sodium", 1]));
	return f.dot;
});

rt.type(2544, "/datum/chemical_reaction/acetone", "/datum/chemical_reaction", {
	name: "acetone",
	id: "acetone",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/acetone/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:525)
rt.def("/datum/chemical_reaction/acetone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["acetone", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["oil", 1, "welding_fuel", 1, "oxygen", 1]));
	return f.dot;
});

rt.type(2545, "/datum/chemical_reaction/carpet", "/datum/chemical_reaction", {
	name: "carpet",
	id: "carpet",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/carpet/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:531)
rt.def("/datum/chemical_reaction/carpet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["carpet", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["space_drugs", 1, "blood", 1]));
	return f.dot;
});

rt.type(2546, "/datum/chemical_reaction/oil", "/datum/chemical_reaction", {
	name: "Oil",
	id: "oil",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/oil/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:537)
rt.def("/datum/chemical_reaction/oil/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["oil", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["welding_fuel", 1, "carbon", 1, "hydrogen", 1]));
	return f.dot;
});

rt.type(2547, "/datum/chemical_reaction/phenol", "/datum/chemical_reaction", {
	name: "phenol",
	id: "phenol",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/phenol/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:543)
rt.def("/datum/chemical_reaction/phenol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["phenol", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 1, "chlorine", 1, "oil", 1]));
	return f.dot;
});

rt.type(2548, "/datum/chemical_reaction/ash", "/datum/chemical_reaction", {
	name: "Ash",
	id: "ash",
	required_temp: 480,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/ash/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:549)
rt.def("/datum/chemical_reaction/ash/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["ash", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["oil", 1]));
	return f.dot;
});

rt.type(2549, "/datum/chemical_reaction/colorful_reagent", "/datum/chemical_reaction", {
	name: "colorful_reagent",
	id: "colorful_reagent",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/colorful_reagent/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:556)
rt.def("/datum/chemical_reaction/colorful_reagent/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["colorful_reagent", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["stable_plasma", 1, "radium", 1, "space_drugs", 1, "cryoxadone", 1, "triple_citrus", 1]));
	return f.dot;
});

rt.type(2550, "/datum/chemical_reaction/life", "/datum/chemical_reaction", {
	name: "Life",
	id: "life",
	required_temp: 374,
	required_reagents: null,
});

// /datum/chemical_reaction/life/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:562)
rt.def("/datum/chemical_reaction/life/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["strange_reagent", 1, "synthflesh", 1, "blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/life/proc/on_reaction  (code/modules/reagents/chemistry/recipes/others.dm:566)  may sleep
rt.def("/datum/chemical_reaction/life/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	f.vars = () => [holder, created_volume];
	yield* g.srcCall(f, "chemical_mob_spawn", live(holder), (yield* g.call(f, P("/proc/rand"), null, [1, (yield* g.call(f, P("/proc/round"), null, [live(created_volume), 1]))])), "Life");
	return f.dot;
}, true);

rt.type(2551, "/datum/chemical_reaction/corgium", "/datum/chemical_reaction", {
	name: "corgium",
	id: "corgium",
	required_temp: 374,
	required_reagents: null,
});

// /datum/chemical_reaction/corgium/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:571)
rt.def("/datum/chemical_reaction/corgium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["nutriment", 1, "colorful_reagent", 1, "strange_reagent", 1, "blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/corgium/proc/on_reaction  (code/modules/reagents/chemistry/recipes/others.dm:575)  may sleep
rt.def("/datum/chemical_reaction/corgium/proc/on_reaction", function* on_reaction(f: Frame) {
	let location: Value = null, i: Value = null;
	f.vars = () => [location, i];
	location = rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0);
	i = null;
	i = (yield* g.call(f, P("/proc/rand"), null, [1, live(f.args[1])]));
	while (rt.le(live(i), live(f.args[1]))) {
		yield* g.new_(f, T("/mob/living/simple_animal/pet/dog/corgi"), [live(location)]);
		i = rt.inc(live(i), 1);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder", "created_volume"] });

rt.type(2552, "/datum/chemical_reaction/hair_dye", "/datum/chemical_reaction", {
	name: "hair_dye",
	id: "hair_dye",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/hair_dye/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:583)
rt.def("/datum/chemical_reaction/hair_dye/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["hair_dye", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["colorful_reagent", 1, "radium", 1, "space_drugs", 1]));
	return f.dot;
});

rt.type(2553, "/datum/chemical_reaction/barbers_aid", "/datum/chemical_reaction", {
	name: "barbers_aid",
	id: "barbers_aid",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/barbers_aid/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:589)
rt.def("/datum/chemical_reaction/barbers_aid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["barbers_aid", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["carpet", 1, "radium", 1, "space_drugs", 1]));
	return f.dot;
});

rt.type(2554, "/datum/chemical_reaction/concentrated_barbers_aid", "/datum/chemical_reaction", {
	name: "concentrated_barbers_aid",
	id: "concentrated_barbers_aid",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/concentrated_barbers_aid/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:595)
rt.def("/datum/chemical_reaction/concentrated_barbers_aid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["concentrated_barbers_aid", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["barbers_aid", 1, "mutagen", 1]));
	return f.dot;
});

rt.type(2555, "/datum/chemical_reaction/saltpetre", "/datum/chemical_reaction", {
	name: "saltpetre",
	id: "saltpetre",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/saltpetre/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:601)
rt.def("/datum/chemical_reaction/saltpetre/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["saltpetre", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["potassium", 1, "nitrogen", 1, "oxygen", 3]));
	return f.dot;
});

rt.type(2556, "/datum/chemical_reaction/lye", "/datum/chemical_reaction", {
	name: "lye",
	id: "lye",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/lye/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:607)
rt.def("/datum/chemical_reaction/lye/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["lye", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["sodium", 1, "hydrogen", 1, "oxygen", 1]));
	return f.dot;
});

rt.type(2557, "/datum/chemical_reaction/lye2", "/datum/chemical_reaction", {
	name: "lye",
	id: "lye",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/lye2/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:613)
rt.def("/datum/chemical_reaction/lye2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["lye", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["ash", 1, "water", 1]));
	return f.dot;
});

rt.type(2558, "/datum/chemical_reaction/royal_bee_jelly", "/datum/chemical_reaction", {
	name: "royal bee jelly",
	id: "royal_bee_jelly",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/royal_bee_jelly/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:619)
rt.def("/datum/chemical_reaction/royal_bee_jelly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["royal_bee_jelly", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["mutagen", 10, "honey", 40]));
	return f.dot;
});

rt.type(2559, "/datum/chemical_reaction/laughter", "/datum/chemical_reaction", {
	name: "laughter",
	id: "laughter",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/laughter/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:625)
rt.def("/datum/chemical_reaction/laughter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["laughter", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["sugar", 1, "banana", 1]));
	return f.dot;
});

rt.type(2560, "/datum/chemical_reaction/plastic_polymers", "/datum/chemical_reaction", {
	name: "plastic polymers",
	id: "plastic_polymers",
	required_temp: 374,
	required_reagents: null,
});

// /datum/chemical_reaction/plastic_polymers/proc/<init>  (code/modules/reagents/chemistry/recipes/others.dm:631)
rt.def("/datum/chemical_reaction/plastic_polymers/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["oil", 5, "sodiumchloride", 2, "ash", 3]));
	return f.dot;
});

// /datum/chemical_reaction/plastic_polymers/proc/on_reaction  (code/modules/reagents/chemistry/recipes/others.dm:635)  may sleep
rt.def("/datum/chemical_reaction/plastic_polymers/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [holder, created_volume, location, i, $e];
	location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	i = null;
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/stack/sheet/plastic"), [live(location)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
