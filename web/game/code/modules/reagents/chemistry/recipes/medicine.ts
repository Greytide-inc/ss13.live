// Based on /tg/station's code/modules/reagents/chemistry/recipes/medicine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(2442, "/datum/chemical_reaction/leporazine", "/datum/chemical_reaction", {
	name: "Leporazine",
	id: "leporazine",
	results: null,
	required_reagents: null,
	required_catalysts: null,
});

// medicine.dm:5
rt.def("/datum/chemical_reaction/leporazine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["leporazine", 2]);
	this.required_reagents = rt.alist(f, ["silicon", 1, "copper", 1]);
	this.required_catalysts = rt.alist(f, ["plasma", 5]);
	return f.dot;
});

rt.type(2443, "/datum/chemical_reaction/rezadone", "/datum/chemical_reaction", {
	name: "Rezadone",
	id: "rezadone",
	results: null,
	required_reagents: null,
});

// medicine.dm:12
rt.def("/datum/chemical_reaction/rezadone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["rezadone", 3]);
	this.required_reagents = rt.alist(f, ["carpotoxin", 1, "cryptobiolin", 1, "copper", 1]);
	return f.dot;
});

rt.type(2444, "/datum/chemical_reaction/spaceacillin", "/datum/chemical_reaction", {
	name: "Spaceacillin",
	id: "spaceacillin",
	results: null,
	required_reagents: null,
});

// medicine.dm:18
rt.def("/datum/chemical_reaction/spaceacillin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["spaceacillin", 2]);
	this.required_reagents = rt.alist(f, ["cryptobiolin", 1, "epinephrine", 1]);
	return f.dot;
});

rt.type(2445, "/datum/chemical_reaction/inacusiate", "/datum/chemical_reaction", {
	name: "inacusiate",
	id: "inacusiate",
	results: null,
	required_reagents: null,
});

// medicine.dm:24
rt.def("/datum/chemical_reaction/inacusiate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["inacusiate", 2]);
	this.required_reagents = rt.alist(f, ["water", 1, "carbon", 1, "charcoal", 1]);
	return f.dot;
});

rt.type(2446, "/datum/chemical_reaction/synaptizine", "/datum/chemical_reaction", {
	name: "Synaptizine",
	id: "synaptizine",
	results: null,
	required_reagents: null,
});

// medicine.dm:30
rt.def("/datum/chemical_reaction/synaptizine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["synaptizine", 3]);
	this.required_reagents = rt.alist(f, ["sugar", 1, "lithium", 1, "water", 1]);
	return f.dot;
});

rt.type(2447, "/datum/chemical_reaction/charcoal", "/datum/chemical_reaction", {
	name: "Charcoal",
	id: "charcoal",
	mix_message: "The mixture yields a fine black powder.",
	required_temp: 380,
	results: null,
	required_reagents: null,
});

// medicine.dm:36
rt.def("/datum/chemical_reaction/charcoal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["charcoal", 2]);
	this.required_reagents = rt.alist(f, ["ash", 1, "sodiumchloride", 1]);
	return f.dot;
});

rt.type(2448, "/datum/chemical_reaction/silver_sulfadiazine", "/datum/chemical_reaction", {
	name: "Silver Sulfadiazine",
	id: "silver_sulfadiazine",
	results: null,
	required_reagents: null,
});

// medicine.dm:44
rt.def("/datum/chemical_reaction/silver_sulfadiazine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["silver_sulfadiazine", 5]);
	this.required_reagents = rt.alist(f, ["ammonia", 1, "silver", 1, "sulfur", 1, "oxygen", 1, "chlorine", 1]);
	return f.dot;
});

rt.type(2449, "/datum/chemical_reaction/salglu_solution", "/datum/chemical_reaction", {
	name: "Saline-Glucose Solution",
	id: "salglu_solution",
	results: null,
	required_reagents: null,
});

// medicine.dm:50
rt.def("/datum/chemical_reaction/salglu_solution/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["salglu_solution", 3]);
	this.required_reagents = rt.alist(f, ["sodiumchloride", 1, "water", 1, "sugar", 1]);
	return f.dot;
});

rt.type(2450, "/datum/chemical_reaction/mine_salve", "/datum/chemical_reaction", {
	name: "Miner's Salve",
	id: "mine_salve",
	results: null,
	required_reagents: null,
});

// medicine.dm:56
rt.def("/datum/chemical_reaction/mine_salve/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["mine_salve", 3]);
	this.required_reagents = rt.alist(f, ["oil", 1, "water", 1, "iron", 1]);
	return f.dot;
});

rt.type(2451, "/datum/chemical_reaction/mine_salve2", "/datum/chemical_reaction", {
	name: "Miner's Salve",
	id: "mine_salve",
	results: null,
	required_reagents: null,
});

// medicine.dm:62
rt.def("/datum/chemical_reaction/mine_salve2/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["mine_salve", 15]);
	this.required_reagents = rt.alist(f, ["plasma", 5, "iron", 5, "sugar", 1]);
	return f.dot;
});

rt.type(2452, "/datum/chemical_reaction/synthflesh", "/datum/chemical_reaction", {
	name: "Synthflesh",
	id: "synthflesh",
	results: null,
	required_reagents: null,
});

// medicine.dm:68
rt.def("/datum/chemical_reaction/synthflesh/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["synthflesh", 3]);
	this.required_reagents = rt.alist(f, ["blood", 1, "carbon", 1, "styptic_powder", 1]);
	return f.dot;
});

rt.type(2453, "/datum/chemical_reaction/styptic_powder", "/datum/chemical_reaction", {
	name: "Styptic Powder",
	id: "styptic_powder",
	mix_message: "The solution yields an astringent powder.",
	results: null,
	required_reagents: null,
});

// medicine.dm:74
rt.def("/datum/chemical_reaction/styptic_powder/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["styptic_powder", 4]);
	this.required_reagents = rt.alist(f, ["aluminium", 1, "hydrogen", 1, "oxygen", 1, "sacid", 1]);
	return f.dot;
});

rt.type(2454, "/datum/chemical_reaction/calomel", "/datum/chemical_reaction", {
	name: "Calomel",
	id: "calomel",
	required_temp: 374,
	results: null,
	required_reagents: null,
});

// medicine.dm:81
rt.def("/datum/chemical_reaction/calomel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["calomel", 2]);
	this.required_reagents = rt.alist(f, ["mercury", 1, "chlorine", 1]);
	return f.dot;
});

rt.type(2455, "/datum/chemical_reaction/potass_iodide", "/datum/chemical_reaction", {
	name: "Potassium Iodide",
	id: "potass_iodide",
	results: null,
	required_reagents: null,
});

// medicine.dm:88
rt.def("/datum/chemical_reaction/potass_iodide/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["potass_iodide", 2]);
	this.required_reagents = rt.alist(f, ["potassium", 1, "iodine", 1]);
	return f.dot;
});

rt.type(2456, "/datum/chemical_reaction/pen_acid", "/datum/chemical_reaction", {
	name: "Pentetic Acid",
	id: "pen_acid",
	results: null,
	required_reagents: null,
});

// medicine.dm:94
rt.def("/datum/chemical_reaction/pen_acid/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["pen_acid", 6]);
	this.required_reagents = rt.alist(f, ["welding_fuel", 1, "chlorine", 1, "ammonia", 1, "formaldehyde", 1, "sodium", 1, "cyanide", 1]);
	return f.dot;
});

rt.type(2457, "/datum/chemical_reaction/sal_acid", "/datum/chemical_reaction", {
	name: "Salicyclic Acid",
	id: "sal_acid",
	results: null,
	required_reagents: null,
});

// medicine.dm:100
rt.def("/datum/chemical_reaction/sal_acid/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["sal_acid", 5]);
	this.required_reagents = rt.alist(f, ["sodium", 1, "phenol", 1, "carbon", 1, "oxygen", 1, "sacid", 1]);
	return f.dot;
});

rt.type(2458, "/datum/chemical_reaction/oxandrolone", "/datum/chemical_reaction", {
	name: "Oxandrolone",
	id: "oxandrolone",
	results: null,
	required_reagents: null,
});

// medicine.dm:106
rt.def("/datum/chemical_reaction/oxandrolone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["oxandrolone", 6]);
	this.required_reagents = rt.alist(f, ["carbon", 3, "phenol", 1, "hydrogen", 1, "oxygen", 1]);
	return f.dot;
});

rt.type(2459, "/datum/chemical_reaction/salbutamol", "/datum/chemical_reaction", {
	name: "Salbutamol",
	id: "salbutamol",
	results: null,
	required_reagents: null,
});

// medicine.dm:112
rt.def("/datum/chemical_reaction/salbutamol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["salbutamol", 5]);
	this.required_reagents = rt.alist(f, ["sal_acid", 1, "lithium", 1, "aluminium", 1, "bromine", 1, "ammonia", 1]);
	return f.dot;
});

rt.type(2460, "/datum/chemical_reaction/perfluorodecalin", "/datum/chemical_reaction", {
	name: "Perfluorodecalin",
	id: "perfluorodecalin",
	required_temp: 370,
	mix_message: "The mixture rapidly turns into a dense pink liquid.",
	results: null,
	required_reagents: null,
});

// medicine.dm:118
rt.def("/datum/chemical_reaction/perfluorodecalin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["perfluorodecalin", 3]);
	this.required_reagents = rt.alist(f, ["hydrogen", 1, "fluorine", 1, "oil", 1]);
	return f.dot;
});

rt.type(2461, "/datum/chemical_reaction/ephedrine", "/datum/chemical_reaction", {
	name: "Ephedrine",
	id: "ephedrine",
	mix_message: "The solution fizzes and gives off toxic fumes.",
	results: null,
	required_reagents: null,
});

// medicine.dm:126
rt.def("/datum/chemical_reaction/ephedrine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["ephedrine", 4]);
	this.required_reagents = rt.alist(f, ["sugar", 1, "oil", 1, "hydrogen", 1, "diethylamine", 1]);
	return f.dot;
});

rt.type(2462, "/datum/chemical_reaction/diphenhydramine", "/datum/chemical_reaction", {
	name: "Diphenhydramine",
	id: "diphenhydramine",
	mix_message: "The mixture dries into a pale blue powder.",
	results: null,
	required_reagents: null,
});

// medicine.dm:133
rt.def("/datum/chemical_reaction/diphenhydramine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["diphenhydramine", 4]);
	this.required_reagents = rt.alist(f, ["oil", 1, "carbon", 1, "bromine", 1, "diethylamine", 1, "ethanol", 1]);
	return f.dot;
});

rt.type(2463, "/datum/chemical_reaction/oculine", "/datum/chemical_reaction", {
	name: "Oculine",
	id: "oculine",
	mix_message: "The mixture sputters loudly and becomes a pale pink color.",
	results: null,
	required_reagents: null,
});

// medicine.dm:140
rt.def("/datum/chemical_reaction/oculine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["oculine", 3]);
	this.required_reagents = rt.alist(f, ["charcoal", 1, "carbon", 1, "hydrogen", 1]);
	return f.dot;
});

rt.type(2464, "/datum/chemical_reaction/atropine", "/datum/chemical_reaction", {
	name: "Atropine",
	id: "atropine",
	results: null,
	required_reagents: null,
});

// medicine.dm:147
rt.def("/datum/chemical_reaction/atropine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["atropine", 5]);
	this.required_reagents = rt.alist(f, ["ethanol", 1, "acetone", 1, "diethylamine", 1, "phenol", 1, "sacid", 1]);
	return f.dot;
});

rt.type(2465, "/datum/chemical_reaction/epinephrine", "/datum/chemical_reaction", {
	name: "Epinephrine",
	id: "epinephrine",
	results: null,
	required_reagents: null,
});

// medicine.dm:153
rt.def("/datum/chemical_reaction/epinephrine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["epinephrine", 6]);
	this.required_reagents = rt.alist(f, ["phenol", 1, "acetone", 1, "diethylamine", 1, "oxygen", 1, "chlorine", 1, "hydrogen", 1]);
	return f.dot;
});

rt.type(2466, "/datum/chemical_reaction/strange_reagent", "/datum/chemical_reaction", {
	name: "Strange Reagent",
	id: "strange_reagent",
	results: null,
	required_reagents: null,
});

// medicine.dm:159
rt.def("/datum/chemical_reaction/strange_reagent/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["strange_reagent", 3]);
	this.required_reagents = rt.alist(f, ["omnizine", 1, "holywater", 1, "mutagen", 1]);
	return f.dot;
});

rt.type(2467, "/datum/chemical_reaction/mannitol", "/datum/chemical_reaction", {
	name: "Mannitol",
	id: "mannitol",
	mix_message: "The solution slightly bubbles, becoming thicker.",
	results: null,
	required_reagents: null,
});

// medicine.dm:165
rt.def("/datum/chemical_reaction/mannitol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["mannitol", 3]);
	this.required_reagents = rt.alist(f, ["sugar", 1, "hydrogen", 1, "water", 1]);
	return f.dot;
});

rt.type(2468, "/datum/chemical_reaction/mutadone", "/datum/chemical_reaction", {
	name: "Mutadone",
	id: "mutadone",
	results: null,
	required_reagents: null,
});

// medicine.dm:172
rt.def("/datum/chemical_reaction/mutadone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["mutadone", 3]);
	this.required_reagents = rt.alist(f, ["mutagen", 1, "acetone", 1, "bromine", 1]);
	return f.dot;
});

rt.type(2469, "/datum/chemical_reaction/antihol", "/datum/chemical_reaction", {
	name: "antihol",
	id: "antihol",
	results: null,
	required_reagents: null,
});

// medicine.dm:178
rt.def("/datum/chemical_reaction/antihol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["antihol", 3]);
	this.required_reagents = rt.alist(f, ["ethanol", 1, "charcoal", 1, "copper", 1]);
	return f.dot;
});

rt.type(2470, "/datum/chemical_reaction/cryoxadone", "/datum/chemical_reaction", {
	name: "Cryoxadone",
	id: "cryoxadone",
	results: null,
	required_reagents: null,
});

// medicine.dm:184
rt.def("/datum/chemical_reaction/cryoxadone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["cryoxadone", 3]);
	this.required_reagents = rt.alist(f, ["stable_plasma", 1, "acetone", 1, "mutagen", 1]);
	return f.dot;
});

rt.type(2471, "/datum/chemical_reaction/clonexadone", "/datum/chemical_reaction", {
	name: "Clonexadone",
	id: "clonexadone",
	results: null,
	required_reagents: null,
	required_catalysts: null,
});

// medicine.dm:190
rt.def("/datum/chemical_reaction/clonexadone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["clonexadone", 2]);
	this.required_reagents = rt.alist(f, ["cryoxadone", 1, "sodium", 1]);
	this.required_catalysts = rt.alist(f, ["plasma", 5]);
	return f.dot;
});

rt.type(2472, "/datum/chemical_reaction/haloperidol", "/datum/chemical_reaction", {
	name: "Haloperidol",
	id: "haloperidol",
	results: null,
	required_reagents: null,
});

// medicine.dm:197
rt.def("/datum/chemical_reaction/haloperidol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["haloperidol", 5]);
	this.required_reagents = rt.alist(f, ["chlorine", 1, "fluorine", 1, "aluminium", 1, "potass_iodide", 1, "oil", 1]);
	return f.dot;
});

rt.type(2473, "/datum/chemical_reaction/bicaridine", "/datum/chemical_reaction", {
	name: "Bicaridine",
	id: "bicaridine",
	results: null,
	required_reagents: null,
});

// medicine.dm:203
rt.def("/datum/chemical_reaction/bicaridine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["bicaridine", 3]);
	this.required_reagents = rt.alist(f, ["carbon", 1, "oxygen", 1, "sugar", 1]);
	return f.dot;
});

rt.type(2474, "/datum/chemical_reaction/kelotane", "/datum/chemical_reaction", {
	name: "Kelotane",
	id: "kelotane",
	results: null,
	required_reagents: null,
});

// medicine.dm:209
rt.def("/datum/chemical_reaction/kelotane/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["kelotane", 2]);
	this.required_reagents = rt.alist(f, ["carbon", 1, "silicon", 1]);
	return f.dot;
});

rt.type(2475, "/datum/chemical_reaction/antitoxin", "/datum/chemical_reaction", {
	name: "Antitoxin",
	id: "antitoxin",
	results: null,
	required_reagents: null,
});

// medicine.dm:215
rt.def("/datum/chemical_reaction/antitoxin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["antitoxin", 3]);
	this.required_reagents = rt.alist(f, ["nitrogen", 1, "silicon", 1, "potassium", 1]);
	return f.dot;
});

rt.type(2476, "/datum/chemical_reaction/tricordrazine", "/datum/chemical_reaction", {
	name: "Tricordrazine",
	id: "tricordrazine",
	results: null,
	required_reagents: null,
});

// medicine.dm:221
rt.def("/datum/chemical_reaction/tricordrazine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["tricordrazine", 3]);
	this.required_reagents = rt.alist(f, ["bicaridine", 1, "kelotane", 1, "antitoxin", 1]);
	return f.dot;
});

rt.type(2477, "/datum/chemical_reaction/corazone", "/datum/chemical_reaction", {
	name: "Corazone",
	id: "corazone",
	results: null,
	required_reagents: null,
});

// medicine.dm:227
rt.def("/datum/chemical_reaction/corazone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["corazone", 3]);
	this.required_reagents = rt.alist(f, ["phenol", 2, "lithium", 1]);
	return f.dot;
});
