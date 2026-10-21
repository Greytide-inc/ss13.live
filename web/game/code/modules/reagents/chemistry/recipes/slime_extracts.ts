// From code/modules/reagents/chemistry/recipes/slime_extracts.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2592, "/datum/chemical_reaction/slime", "/datum/chemical_reaction", {
	deletes_extract: 1,
});

// /datum/chemical_reaction/slime/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:6)  may sleep
rt.def("/datum/chemical_reaction/slime/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	f.vars = () => [holder];
	if (!truthy(rt.sv(f, "deletes_extract"))) return f.dot;
	yield* g.srcCall(f, "delete_extract", live(holder));
	return f.dot;
}, true);

// /datum/chemical_reaction/slime/proc/delete_extract  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:12)  may sleep
rt.def("/datum/chemical_reaction/slime/proc/delete_extract", function* delete_extract(f: Frame, holder: Value) {
	let M: Value = null;
	f.vars = () => [holder, M];
	if (!(rt.le(rt.gv(f, "Uses", (M = rt.fv(f, "my_atom", live(holder)))), 0) && !truthy(rt.len(f, rt.sv(f, "results"))))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
	return f.dot;
}, true, { argTypes: [{ path: "/datum/reagents" }] });

rt.type(2593, "/datum/chemical_reaction/slime/slimespawn", "/datum/chemical_reaction/slime", {
	name: "Slime Spawn",
	id: "m_spawn",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/grey"),
});

// /datum/chemical_reaction/slime/slimespawn/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:19)
rt.def("/datum/chemical_reaction/slime/slimespawn/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimespawn/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:24)  may sleep
rt.def("/datum/chemical_reaction/slime/slimespawn/proc/on_reaction", function* on_reaction(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callName(f, (S = (yield* g.new_(f, T("/mob/living/simple_animal/slime"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0), "grey"]))), "visible_message", ["<span class='danger'>Infused with plasma, the core begins to quiver and grow, and a new baby slime emerges from it!</span>"]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2594, "/datum/chemical_reaction/slime/slimeinaprov", "/datum/chemical_reaction/slime", {
	name: "Slime epinephrine",
	id: "m_inaprov",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/grey"),
});

// /datum/chemical_reaction/slime/slimeinaprov/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:31)
rt.def("/datum/chemical_reaction/slime/slimeinaprov/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["epinephrine", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 5]));
	return f.dot;
});

rt.type(2595, "/datum/chemical_reaction/slime/slimemonkey", "/datum/chemical_reaction/slime", {
	name: "Slime Monkey",
	id: "m_monkey",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/grey"),
});

// /datum/chemical_reaction/slime/slimemonkey/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:39)
rt.def("/datum/chemical_reaction/slime/slimemonkey/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimemonkey/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:44)  may sleep
rt.def("/datum/chemical_reaction/slime/slimemonkey/proc/on_reaction", function* on_reaction(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2596, "/datum/chemical_reaction/slime/slimemutate", "/datum/chemical_reaction/slime", {
	name: "Mutation Toxin",
	id: "mutationtoxin",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/green"),
});

// /datum/chemical_reaction/slime/slimemutate/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:52)
rt.def("/datum/chemical_reaction/slime/slimemutate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["mutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

rt.type(2597, "/datum/chemical_reaction/slime/slimemutate_unstable", "/datum/chemical_reaction/slime", {
	name: "Unstable Mutation Toxin",
	id: "unstablemutationtoxin",
	required_other: 1,
	mix_message: "<span class='info'>The mixture rapidly expands and contracts, its appearance shifting into a sickening green.</span>",
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/green"),
});

// /datum/chemical_reaction/slime/slimemutate_unstable/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:61)
rt.def("/datum/chemical_reaction/slime/slimemutate_unstable/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["unstablemutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["radium", 1]));
	return f.dot;
});

rt.type(2598, "/datum/chemical_reaction/slime/slimemetal", "/datum/chemical_reaction/slime", {
	name: "Slime Metal",
	id: "m_metal",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/metal"),
});

// /datum/chemical_reaction/slime/slimemetal/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:71)
rt.def("/datum/chemical_reaction/slime/slimemetal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimemetal/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:76)  may sleep
rt.def("/datum/chemical_reaction/slime/slimemetal/proc/on_reaction", function* on_reaction(f: Frame) {
	let location: Value = null;
	f.vars = () => [location];
	yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [(location = rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)), 5]);
	yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [live(location), 15]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2599, "/datum/chemical_reaction/slime/slimeglass", "/datum/chemical_reaction/slime", {
	name: "Slime Glass",
	id: "m_glass",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/metal"),
});

// /datum/chemical_reaction/slime/slimeglass/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:84)
rt.def("/datum/chemical_reaction/slime/slimeglass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimeglass/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:89)  may sleep
rt.def("/datum/chemical_reaction/slime/slimeglass/proc/on_reaction", function* on_reaction(f: Frame) {
	let location: Value = null;
	f.vars = () => [location];
	yield* g.new_(f, T("/obj/item/stack/sheet/rglass"), [(location = rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)), 5]);
	yield* g.new_(f, T("/obj/item/stack/sheet/glass"), [live(location), 15]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2600, "/datum/chemical_reaction/slime/slimemobspawn", "/datum/chemical_reaction/slime", {
	name: "Slime Crit",
	id: "m_tele",
	required_other: 1,
	deletes_extract: 0,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/gold"),
});

// /datum/chemical_reaction/slime/slimemobspawn/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:98)
rt.def("/datum/chemical_reaction/slime/slimemobspawn/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimemobspawn/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:104)  may sleep
rt.def("/datum/chemical_reaction/slime/slimemobspawn/proc/on_reaction", function* on_reaction(f: Frame) {
	let _T: Value = null, M: Value = null;
	f.vars = () => [_T, M];
	_T = rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0);
	yield* g.srcCall(f, "summon_mobs", live(f.args[0]), live(_T));
	yield* g.call(f, P("/proc/deltimer"), null, [rt.gv(f, "qdel_timer", (M = rt.fv(f, "my_atom", live(f.args[0]))))]);
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "qdel_timer", live(M), (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/chemical_reaction/slime/proc/delete_extract"), live(f.args[0])])), 55, 8])));
	return f.dot;
}, true, { args: ["holder"] });

// /datum/chemical_reaction/slime/slimemobspawn/proc/summon_mobs  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:112)  may sleep
rt.def("/datum/chemical_reaction/slime/slimemobspawn/proc/summon_mobs", function* summon_mobs(f: Frame, holder: Value, _T: Value) {
	f.vars = () => [holder, _T];
	yield* g.callName(f, live(_T), "visible_message", ["<span class='danger'>The slime extract begins to vibrate violently!</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/chemical_reaction/proc/chemical_mob_spawn"), live(holder), 5, "Gold Slime"])), 50]);
	return f.dot;
}, true);

rt.type(2601, "/datum/chemical_reaction/slime/slimemobspawn/lesser", "/datum/chemical_reaction/slime/slimemobspawn", {
	name: "Slime Crit Lesser",
	id: "m_tele3",
	required_reagents: null,
});

// /datum/chemical_reaction/slime/slimemobspawn/lesser/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:118)
rt.def("/datum/chemical_reaction/slime/slimemobspawn/lesser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimemobspawn/lesser/proc/summon_mobs  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:121)  may sleep
rt.def("/datum/chemical_reaction/slime/slimemobspawn/lesser/proc/summon_mobs", function* summon_mobs(f: Frame, holder: Value, _T: Value) {
	f.vars = () => [holder, _T];
	yield* g.callName(f, live(_T), "visible_message", ["<span class='danger'>The slime extract begins to vibrate violently!</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/chemical_reaction/proc/chemical_mob_spawn"), live(holder), 3, "Lesser Gold Slime", "neutral"])), 50]);
	return f.dot;
}, true);

rt.type(2602, "/datum/chemical_reaction/slime/slimemobspawn/friendly", "/datum/chemical_reaction/slime/slimemobspawn", {
	name: "Slime Crit Friendly",
	id: "m_tele5",
	required_reagents: null,
});

// /datum/chemical_reaction/slime/slimemobspawn/friendly/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:127)
rt.def("/datum/chemical_reaction/slime/slimemobspawn/friendly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimemobspawn/friendly/proc/summon_mobs  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:130)  may sleep
rt.def("/datum/chemical_reaction/slime/slimemobspawn/friendly/proc/summon_mobs", function* summon_mobs(f: Frame, holder: Value, _T: Value) {
	f.vars = () => [holder, _T];
	yield* g.callName(f, live(_T), "visible_message", ["<span class='danger'>The slime extract begins to vibrate adorably!</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/chemical_reaction/proc/chemical_mob_spawn"), live(holder), 1, "Friendly Gold Slime", "neutral"])), 50]);
	return f.dot;
}, true);

rt.type(2603, "/datum/chemical_reaction/slime/slimebork", "/datum/chemical_reaction/slime", {
	name: "Slime Bork",
	id: "m_tele2",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/silver"),
});

// /datum/chemical_reaction/slime/slimebork/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:137)
rt.def("/datum/chemical_reaction/slime/slimebork/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimebork/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:143)  may sleep
rt.def("/datum/chemical_reaction/slime/slimebork/proc/on_reaction", function* on_reaction(f: Frame) {
	let borks: Value = null, _T: Value = null, C: Value = null, i: Value = null, chosen: Value = null, B: Value = null, j: Value = null;
	let $e: any;
	f.vars = () => [borks, _T, C, i, chosen, B, j, $e];
	borks = (yield* g.srcCall(f, "getborks"));
	yield* g.call(f, P("/proc/playsound"), null, [(_T = rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)), rt.rsc("sound/effects/phasein.ogg"), 100, 1]);
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [live(_T), null])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.callName(f, live(C), "flash_act", []);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, add(4, (yield* g.call(f, P("/proc/rand"), null, [1, 2]))), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		chosen = rt.op(f, "PickUnweighted", [1], [live(borks)]);
		B = (yield* g.new_(f, live(chosen), [live(_T)]));
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			j = null;
			rt.forRange(f, 1, 1, (yield* g.call(f, P("/proc/rand"), null, [1, 3])), 1);
			while (($e = rt.next(f, 1)) !== undefined) {
				j = $e;
				yield* g.call(f, P("/proc/step"), null, [live(B), rt.op(f, "PickUnweighted", [4], [1, 2, 4, 8])]);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

// /datum/chemical_reaction/slime/slimebork/proc/getborks  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:160)
rt.def("/datum/chemical_reaction/slime/slimebork/proc/getborks", function getborks(f: Frame) {
	let blocked: Value = null;
	f.vars = () => [blocked];
	blocked = rt.list(T("/obj/item/weapon/reagent_containers/food/snacks"), T("/obj/item/weapon/reagent_containers/food/snacks/store/bread"), T("/obj/item/weapon/reagent_containers/food/snacks/breadslice"), T("/obj/item/weapon/reagent_containers/food/snacks/store/cake"), T("/obj/item/weapon/reagent_containers/food/snacks/cakeslice"), T("/obj/item/weapon/reagent_containers/food/snacks/store"), T("/obj/item/weapon/reagent_containers/food/snacks/pie"), T("/obj/item/weapon/reagent_containers/food/snacks/kebab"), T("/obj/item/weapon/reagent_containers/food/snacks/pizza"), T("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice"), T("/obj/item/weapon/reagent_containers/food/snacks/salad"), T("/obj/item/weapon/reagent_containers/food/snacks/meat"), T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), T("/obj/item/weapon/reagent_containers/food/snacks/soup"), T("/obj/item/weapon/reagent_containers/food/snacks/grown"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom"));
	(blocked = rt.modify(live(blocked), rt.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/reagent_containers/food/snacks/customizable")]), rt.bitOr));
	return subtract(rt.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/reagent_containers/food/snacks")]), live(blocked));
});

rt.type(2604, "/datum/chemical_reaction/slime/slimebork/drinks", "/datum/chemical_reaction/slime/slimebork", {
	name: "Slime Bork 2",
	id: "m_tele4",
	required_reagents: null,
});

// /datum/chemical_reaction/slime/slimebork/drinks/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:184)
rt.def("/datum/chemical_reaction/slime/slimebork/drinks/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimebork/drinks/proc/getborks  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:187)
rt.def("/datum/chemical_reaction/slime/slimebork/drinks/proc/getborks", function getborks(f: Frame) {
	return subtract(rt.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/reagent_containers/food/drinks")]), T("/obj/item/weapon/reagent_containers/food/drinks"));
});

rt.type(2605, "/datum/chemical_reaction/slime/slimefrost", "/datum/chemical_reaction/slime", {
	name: "Slime Frost Oil",
	id: "m_frostoil",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/blue"),
});

// /datum/chemical_reaction/slime/slimefrost/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:193)
rt.def("/datum/chemical_reaction/slime/slimefrost/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["frostoil", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

rt.type(2606, "/datum/chemical_reaction/slime/slimestabilizer", "/datum/chemical_reaction/slime", {
	name: "Slime Stabilizer",
	id: "m_slimestabilizer",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/blue"),
});

// /datum/chemical_reaction/slime/slimestabilizer/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:201)
rt.def("/datum/chemical_reaction/slime/slimestabilizer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimestabilizer/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:206)  may sleep
rt.def("/datum/chemical_reaction/slime/slimestabilizer/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/slimepotion/stabilizer"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2607, "/datum/chemical_reaction/slime/slimefoam", "/datum/chemical_reaction/slime", {
	name: "Slime Foam",
	id: "m_foam",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/blue"),
});

// /datum/chemical_reaction/slime/slimefoam/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:212)
rt.def("/datum/chemical_reaction/slime/slimefoam/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["fluorosurfactant", 20, "water", 20]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 5]));
	return f.dot;
});

rt.type(2608, "/datum/chemical_reaction/slime/slimefreeze", "/datum/chemical_reaction/slime", {
	name: "Slime Freeze",
	id: "m_freeze",
	required_other: 1,
	deletes_extract: 0,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/darkblue"),
});

// /datum/chemical_reaction/slime/slimefreeze/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:221)
rt.def("/datum/chemical_reaction/slime/slimefreeze/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimefreeze/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:227)  may sleep
rt.def("/datum/chemical_reaction/slime/slimefreeze/proc/on_reaction", function* on_reaction(f: Frame) {
	let _T: Value = null, M: Value = null;
	f.vars = () => [_T, M];
	yield* g.callName(f, (_T = rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)), "visible_message", ["<span class='danger'>The slime extract begins to vibrate adorably!</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/chemical_reaction/slime/slimefreeze/proc/freeze"), live(f.args[0])])), 50]);
	yield* g.call(f, P("/proc/deltimer"), null, [rt.gv(f, "qdel_timer", (M = rt.fv(f, "my_atom", live(f.args[0]))))]);
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "qdel_timer", live(M), (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/chemical_reaction/slime/proc/delete_extract"), live(f.args[0])])), 55, 8])));
	return f.dot;
}, true, { args: ["holder"] });

// /datum/chemical_reaction/slime/slimefreeze/proc/freeze  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:236)
rt.def("/datum/chemical_reaction/slime/slimefreeze/proc/freeze", function freeze(f: Frame, holder: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!(truthy(live(holder)) && truthy(rt.fv(f, "my_atom", live(holder))))) return f.dot;
	if (!truthy((rt.istype((_T = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0)), T("/turf/open")) ? 1 : 0))) return f.dot;
	rt.callName(f, live(_T), "atmos_spawn_air", ["freon=50;TEMP=120"]);
	return f.dot;
}, false, { argTypes: [{ path: "/datum/reagents" }] });

rt.type(2609, "/datum/chemical_reaction/slime/slimefireproof", "/datum/chemical_reaction/slime", {
	name: "Slime Fireproof",
	id: "m_fireproof",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/darkblue"),
});

// /datum/chemical_reaction/slime/slimefireproof/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:244)
rt.def("/datum/chemical_reaction/slime/slimefireproof/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimefireproof/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:249)  may sleep
rt.def("/datum/chemical_reaction/slime/slimefireproof/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/slimepotion/fireproof"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2610, "/datum/chemical_reaction/slime/slimecasp", "/datum/chemical_reaction/slime", {
	name: "Slime Capsaicin Oil",
	id: "m_capsaicinoil",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/orange"),
});

// /datum/chemical_reaction/slime/slimecasp/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:256)
rt.def("/datum/chemical_reaction/slime/slimecasp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["capsaicin", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1]));
	return f.dot;
});

rt.type(2611, "/datum/chemical_reaction/slime/slimefire", "/datum/chemical_reaction/slime", {
	name: "Slime fire",
	id: "m_fire",
	required_other: 1,
	deletes_extract: 0,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/orange"),
});

// /datum/chemical_reaction/slime/slimefire/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:264)
rt.def("/datum/chemical_reaction/slime/slimefire/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimefire/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:270)  may sleep
rt.def("/datum/chemical_reaction/slime/slimefire/proc/on_reaction", function* on_reaction(f: Frame) {
	let _T: Value = null, M: Value = null;
	f.vars = () => [_T, M];
	yield* g.callName(f, (_T = rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)), "visible_message", ["<span class='danger'>The slime extract begins to vibrate adorably!</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/chemical_reaction/slime/slimefire/proc/slime_burn"), live(f.args[0])])), 50]);
	yield* g.call(f, P("/proc/deltimer"), null, [rt.gv(f, "qdel_timer", (M = rt.fv(f, "my_atom", live(f.args[0]))))]);
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "qdel_timer", live(M), (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/chemical_reaction/slime/proc/delete_extract"), live(f.args[0])])), 55, 8])));
	return f.dot;
}, true, { args: ["holder"] });

// /datum/chemical_reaction/slime/slimefire/proc/slime_burn  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:279)
rt.def("/datum/chemical_reaction/slime/slimefire/proc/slime_burn", function slime_burn(f: Frame, holder: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!(truthy(live(holder)) && truthy(rt.fv(f, "my_atom", live(holder))))) return f.dot;
	if (!truthy((rt.istype((_T = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0)), T("/turf/open")) ? 1 : 0))) return f.dot;
	rt.callName(f, live(_T), "atmos_spawn_air", ["plasma=50;TEMP=1000"]);
	return f.dot;
}, false, { argTypes: [{ path: "/datum/reagents" }] });

rt.type(2612, "/datum/chemical_reaction/slime/slimesmoke", "/datum/chemical_reaction/slime", {
	name: "Slime Smoke",
	id: "m_smoke",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/orange"),
});

// /datum/chemical_reaction/slime/slimesmoke/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:288)
rt.def("/datum/chemical_reaction/slime/slimesmoke/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["phosphorus", 10, "potassium", 10, "sugar", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 5]));
	return f.dot;
});

rt.type(2613, "/datum/chemical_reaction/slime/slimeoverload", "/datum/chemical_reaction/slime", {
	name: "Slime EMP",
	id: "m_emp",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/yellow"),
});

// /datum/chemical_reaction/slime/slimeoverload/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:297)
rt.def("/datum/chemical_reaction/slime/slimeoverload/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimeoverload/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:302)  may sleep
rt.def("/datum/chemical_reaction/slime/slimeoverload/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.call(f, P("/proc/empulse"), null, [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0), 3, 7]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder", "created_volume"] });

rt.type(2614, "/datum/chemical_reaction/slime/slimecell", "/datum/chemical_reaction/slime", {
	name: "Slime Powercell",
	id: "m_cell",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/yellow"),
});

// /datum/chemical_reaction/slime/slimecell/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:308)
rt.def("/datum/chemical_reaction/slime/slimecell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimecell/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:313)  may sleep
rt.def("/datum/chemical_reaction/slime/slimecell/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/high/slime"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder", "created_volume"] });

rt.type(2615, "/datum/chemical_reaction/slime/slimeglow", "/datum/chemical_reaction/slime", {
	name: "Slime Glow",
	id: "m_glow",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/yellow"),
});

// /datum/chemical_reaction/slime/slimeglow/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:319)
rt.def("/datum/chemical_reaction/slime/slimeglow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimeglow/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:324)  may sleep
rt.def("/datum/chemical_reaction/slime/slimeglow/proc/on_reaction", function* on_reaction(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callName(f, (_T = rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)), "visible_message", ["<span class='danger'>The slime begins to emit a soft light. Squeezing it will cause it to grow brightly.</span>"]);
	yield* g.new_(f, T("/obj/item/device/flashlight/slime"), [live(_T)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2616, "/datum/chemical_reaction/slime/slimepsteroid", "/datum/chemical_reaction/slime", {
	name: "Slime Steroid",
	id: "m_steroid",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/purple"),
});

// /datum/chemical_reaction/slime/slimepsteroid/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:333)
rt.def("/datum/chemical_reaction/slime/slimepsteroid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimepsteroid/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:338)  may sleep
rt.def("/datum/chemical_reaction/slime/slimepsteroid/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/slimepotion/steroid"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2617, "/datum/chemical_reaction/slime/slimejam", "/datum/chemical_reaction/slime", {
	name: "Slime Jam",
	id: "m_jam",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/purple"),
});

// /datum/chemical_reaction/slime/slimejam/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:344)
rt.def("/datum/chemical_reaction/slime/slimejam/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["slimejelly", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["sugar", 1]));
	return f.dot;
});

rt.type(2618, "/datum/chemical_reaction/slime/slimeplasma", "/datum/chemical_reaction/slime", {
	name: "Slime Plasma",
	id: "m_plasma",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/darkpurple"),
});

// /datum/chemical_reaction/slime/slimeplasma/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:353)
rt.def("/datum/chemical_reaction/slime/slimeplasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimeplasma/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:358)  may sleep
rt.def("/datum/chemical_reaction/slime/slimeplasma/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/stack/sheet/mineral/plasma"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0), 3]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2619, "/datum/chemical_reaction/slime/slimemutator", "/datum/chemical_reaction/slime", {
	name: "Slime Mutator",
	id: "m_slimemutator",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/red"),
});

// /datum/chemical_reaction/slime/slimemutator/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:365)
rt.def("/datum/chemical_reaction/slime/slimemutator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimemutator/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:370)  may sleep
rt.def("/datum/chemical_reaction/slime/slimemutator/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/slimepotion/mutator"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2620, "/datum/chemical_reaction/slime/slimebloodlust", "/datum/chemical_reaction/slime", {
	name: "Bloodlust",
	id: "m_bloodlust",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/red"),
});

// /datum/chemical_reaction/slime/slimebloodlust/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:376)
rt.def("/datum/chemical_reaction/slime/slimebloodlust/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimebloodlust/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:381)  may sleep
rt.def("/datum/chemical_reaction/slime/slimebloodlust/proc/on_reaction", function* on_reaction(f: Frame) {
	let slime: Value = null;
	let $e: any;
	f.vars = () => [slime, $e];
	slime = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0), null])), T("/mob/living/simple_animal/slime"));
	while (($e = rt.next(f, 0)) !== undefined) {
		slime = $e;
		rt.setFv(f, "rabid", live(slime), 1);
		yield* g.callName(f, live(slime), "visible_message", [fmt("<span class='danger'>The ＀ is driven into a frenzy!</span>", [live(slime)])]);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2621, "/datum/chemical_reaction/slime/slimespeed", "/datum/chemical_reaction/slime", {
	name: "Slime Speed",
	id: "m_speed",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/red"),
});

// /datum/chemical_reaction/slime/slimespeed/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:389)
rt.def("/datum/chemical_reaction/slime/slimespeed/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimespeed/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:394)  may sleep
rt.def("/datum/chemical_reaction/slime/slimespeed/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/slimepotion/speed"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2622, "/datum/chemical_reaction/slime/docility", "/datum/chemical_reaction/slime", {
	name: "Docility Potion",
	id: "m_potion",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/pink"),
});

// /datum/chemical_reaction/slime/docility/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:401)
rt.def("/datum/chemical_reaction/slime/docility/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/docility/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:406)  may sleep
rt.def("/datum/chemical_reaction/slime/docility/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/slimepotion/docility"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2623, "/datum/chemical_reaction/slime/gender", "/datum/chemical_reaction/slime", {
	name: "Gender Potion",
	id: "m_gender",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/pink"),
});

// /datum/chemical_reaction/slime/gender/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:412)
rt.def("/datum/chemical_reaction/slime/gender/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/gender/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:417)  may sleep
rt.def("/datum/chemical_reaction/slime/gender/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/slimepotion/genderchange"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2624, "/datum/chemical_reaction/slime/slimemutate2", "/datum/chemical_reaction/slime", {
	name: "Advanced Mutation Toxin",
	id: "mutationtoxin2",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/black"),
});

// /datum/chemical_reaction/slime/slimemutate2/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:424)
rt.def("/datum/chemical_reaction/slime/slimemutate2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["amutationtoxin", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

rt.type(2625, "/datum/chemical_reaction/slime/slimeexplosion", "/datum/chemical_reaction/slime", {
	name: "Slime Explosion",
	id: "m_explosion",
	required_other: 1,
	deletes_extract: 0,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/oil"),
});

// /datum/chemical_reaction/slime/slimeexplosion/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:433)
rt.def("/datum/chemical_reaction/slime/slimeexplosion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimeexplosion/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:439)  may sleep
rt.def("/datum/chemical_reaction/slime/slimeexplosion/proc/on_reaction", function* on_reaction(f: Frame) {
	let _T: Value = null, A: Value = null, lastkey: Value = null, touch_msg: Value = null, toucher: Value = null, M: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [_T, A, lastkey, touch_msg, toucher, M, $0, $1, $2];
	_T = rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0);
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(_T)]));
	lastkey = rt.gv(f, "fingerprintslast", rt.fv(f, "my_atom", live(f.args[0])));
	touch_msg = "N/A";
	if (truthy(live(lastkey))) {
		touch_msg = fmt("＀.", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [(toucher = (yield* g.call(f, P("/proc/get_mob_by_key"), null, [live(lastkey)])))])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(toucher)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(toucher)])])]);
	}
	$0 = live(A);
	if (truthy(live(_T))) {
		$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
	} else {
		$1 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("Slime Explosion reaction started at ＀ ＀. Last Fingerprint: ＀", [$0, fmt("＀", [$1]), live(touch_msg)])]);
	$0 = live(A);
	$1 = fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]);
	if (truthy(live(lastkey))) {
		$2 = live(lastkey);
	} else {
		$2 = "N/A";
	}
	yield* g.call(f, P("/proc/log_game"), null, [fmt("Slime Explosion reaction started at ＀ ＀. Last Fingerprint: ＀.", [$0, $1, $2])]);
	yield* g.callName(f, live(_T), "visible_message", ["<span class='danger'>The slime extract begins to vibrate violently !</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/chemical_reaction/slime/slimeexplosion/proc/boom"), live(f.args[0])])), 50]);
	yield* g.call(f, P("/proc/deltimer"), null, [rt.gv(f, "qdel_timer", (M = rt.fv(f, "my_atom", live(f.args[0]))))]);
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "qdel_timer", live(M), (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/chemical_reaction/slime/proc/delete_extract"), live(f.args[0])])), 55, 8])));
	return f.dot;
}, true, { args: ["holder"] });

// /datum/chemical_reaction/slime/slimeexplosion/proc/boom  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:456)
rt.def("/datum/chemical_reaction/slime/slimeexplosion/proc/boom", function boom(f: Frame, holder: Value) {
	if (!(truthy(live(holder)) && truthy(rt.fv(f, "my_atom", live(holder))))) return f.dot;
	rt.call(f, P("/proc/explosion"), null, [rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0), 1, 3, 6]);
	return f.dot;
}, false, { argTypes: [{ path: "/datum/reagents" }] });

rt.type(2626, "/datum/chemical_reaction/slime/slimecornoil", "/datum/chemical_reaction/slime", {
	name: "Slime Corn Oil",
	id: "m_cornoil",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/oil"),
});

// /datum/chemical_reaction/slime/slimecornoil/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:463)
rt.def("/datum/chemical_reaction/slime/slimecornoil/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["cornoil", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1]));
	return f.dot;
});

rt.type(2627, "/datum/chemical_reaction/slime/slimepotion2", "/datum/chemical_reaction/slime", {
	name: "Slime Potion 2",
	id: "m_potion2",
	required_other: 1,
	required_container: rt.typePath("/obj/item/slime_extract/lightpink"),
	required_reagents: null,
});

// /datum/chemical_reaction/slime/slimepotion2/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:473)
rt.def("/datum/chemical_reaction/slime/slimepotion2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimepotion2/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:477)  may sleep
rt.def("/datum/chemical_reaction/slime/slimepotion2/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/slimepotion/sentience"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2628, "/datum/chemical_reaction/slime/adamantine", "/datum/chemical_reaction/slime", {
	name: "Adamantine",
	id: "adamantine",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/adamantine"),
});

// /datum/chemical_reaction/slime/adamantine/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:484)
rt.def("/datum/chemical_reaction/slime/adamantine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/adamantine/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:489)  may sleep
rt.def("/datum/chemical_reaction/slime/adamantine/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/stack/sheet/mineral/adamantine"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2629, "/datum/chemical_reaction/slime/slimefloor2", "/datum/chemical_reaction/slime", {
	name: "Bluespace Floor",
	id: "m_floor2",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/bluespace"),
});

// /datum/chemical_reaction/slime/slimefloor2/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:496)
rt.def("/datum/chemical_reaction/slime/slimefloor2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimefloor2/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:501)  may sleep
rt.def("/datum/chemical_reaction/slime/slimefloor2/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/stack/tile/bluespace"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0), 25]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder", "created_volume"] });

rt.type(2630, "/datum/chemical_reaction/slime/slimecrystal", "/datum/chemical_reaction/slime", {
	name: "Slime Crystal",
	id: "m_crystal",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/bluespace"),
});

// /datum/chemical_reaction/slime/slimecrystal/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:508)
rt.def("/datum/chemical_reaction/slime/slimecrystal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimecrystal/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:513)  may sleep
rt.def("/datum/chemical_reaction/slime/slimecrystal/proc/on_reaction", function* on_reaction(f: Frame) {
	let BC: Value = null;
	f.vars = () => [BC];
	yield* g.callName(f, (BC = (yield* g.new_(f, T("/obj/item/weapon/ore/bluespace_crystal"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]))), "visible_message", [fmt("<span class='notice'>The ＀ appears out of thin air!</span>", [rt.fv(f, "name", live(BC))])]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder", "created_volume"] });

rt.type(2631, "/datum/chemical_reaction/slime/slimepsteroid2", "/datum/chemical_reaction/slime", {
	name: "Slime Steroid 2",
	id: "m_steroid2",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/cerulean"),
});

// /datum/chemical_reaction/slime/slimepsteroid2/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:521)
rt.def("/datum/chemical_reaction/slime/slimepsteroid2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimepsteroid2/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:526)  may sleep
rt.def("/datum/chemical_reaction/slime/slimepsteroid2/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/slimepotion/enhancer"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2632, "/datum/chemical_reaction/slime/slime_territory", "/datum/chemical_reaction/slime", {
	name: "Slime Territory",
	id: "s_territory",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/cerulean"),
});

// /datum/chemical_reaction/slime/slime_territory/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:532)
rt.def("/datum/chemical_reaction/slime/slime_territory/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slime_territory/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:537)  may sleep
rt.def("/datum/chemical_reaction/slime/slime_territory/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/areaeditor/blueprints/slime"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2633, "/datum/chemical_reaction/slime/slimestop", "/datum/chemical_reaction/slime", {
	name: "Slime Stop",
	id: "m_stop",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/sepia"),
});

// /datum/chemical_reaction/slime/slimestop/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:544)
rt.def("/datum/chemical_reaction/slime/slimestop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimestop/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:549)  may sleep
rt.def("/datum/chemical_reaction/slime/slimestop/proc/on_reaction", function* on_reaction(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callName(f, (_T = (yield* g.new_(f, T("/obj/effect/timestop"), []))), "forceMove", [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	rt.modField(f, live(_T), "immune", (yield* g.call(f, P("/proc/get_mob_by_key"), null, [rt.gv(f, "fingerprintslast", rt.fv(f, "my_atom", live(f.args[0])))])), add);
	yield* g.callName(f, live(_T), "timestop", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2634, "/datum/chemical_reaction/slime/slimecamera", "/datum/chemical_reaction/slime", {
	name: "Slime Camera",
	id: "m_camera",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/sepia"),
});

// /datum/chemical_reaction/slime/slimecamera/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:558)
rt.def("/datum/chemical_reaction/slime/slimecamera/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimecamera/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:563)  may sleep
rt.def("/datum/chemical_reaction/slime/slimecamera/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/device/camera"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.new_(f, T("/obj/item/device/camera_film"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2635, "/datum/chemical_reaction/slime/slimefloor", "/datum/chemical_reaction/slime", {
	name: "Sepia Floor",
	id: "m_floor",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/sepia"),
});

// /datum/chemical_reaction/slime/slimefloor/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:570)
rt.def("/datum/chemical_reaction/slime/slimefloor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimefloor/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:575)  may sleep
rt.def("/datum/chemical_reaction/slime/slimefloor/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/stack/tile/sepia"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0), 25]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2636, "/datum/chemical_reaction/slime/slimepaint", "/datum/chemical_reaction/slime", {
	name: "Slime Paint",
	id: "s_paint",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/pyrite"),
});

// /datum/chemical_reaction/slime/slimepaint/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:582)
rt.def("/datum/chemical_reaction/slime/slimepaint/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimepaint/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:587)  may sleep
rt.def("/datum/chemical_reaction/slime/slimepaint/proc/on_reaction", function* on_reaction(f: Frame) {
	let chosen: Value = null;
	f.vars = () => [chosen];
	chosen = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/paint")])), T("/obj/item/weapon/paint"))]);
	yield* g.new_(f, live(chosen), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2637, "/datum/chemical_reaction/slime/slimecrayon", "/datum/chemical_reaction/slime", {
	name: "Slime Crayon",
	id: "s_crayon",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/pyrite"),
});

// /datum/chemical_reaction/slime/slimecrayon/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:594)
rt.def("/datum/chemical_reaction/slime/slimecrayon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimecrayon/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:599)  may sleep
rt.def("/datum/chemical_reaction/slime/slimecrayon/proc/on_reaction", function* on_reaction(f: Frame) {
	let chosen: Value = null;
	f.vars = () => [chosen];
	chosen = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/difflist"), null, [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/toy/crayon")])), T("/obj/item/toy/crayon")), (yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/toy/crayon/spraycan")]))]))]);
	yield* g.new_(f, live(chosen), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2638, "/datum/chemical_reaction/slime/slimeRNG", "/datum/chemical_reaction/slime", {
	name: "Random Core",
	id: "slimerng",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/rainbow"),
});

// /datum/chemical_reaction/slime/slimeRNG/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:607)
rt.def("/datum/chemical_reaction/slime/slimeRNG/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slimeRNG/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:612)  may sleep
rt.def("/datum/chemical_reaction/slime/slimeRNG/proc/on_reaction", function* on_reaction(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callName(f, (S = (yield* g.new_(f, T("/mob/living/simple_animal/slime/random"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]))), "visible_message", ["<span class='danger'>Infused with plasma, the core begins to quiver and grow, and a new baby slime emerges from it!</span>"]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2639, "/datum/chemical_reaction/slime/slime_transfer", "/datum/chemical_reaction/slime", {
	name: "Transfer Potion",
	id: "slimetransfer",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/rainbow"),
});

// /datum/chemical_reaction/slime/slime_transfer/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:619)
rt.def("/datum/chemical_reaction/slime/slime_transfer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1]));
	return f.dot;
});

// /datum/chemical_reaction/slime/slime_transfer/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:624)  may sleep
rt.def("/datum/chemical_reaction/slime/slime_transfer/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/slimepotion/transference"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });

rt.type(2640, "/datum/chemical_reaction/slime/flight_potion", "/datum/chemical_reaction/slime", {
	name: "Flight Potion",
	id: "flightpotion",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/rainbow"),
});

// /datum/chemical_reaction/slime/flight_potion/proc/<init>  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:630)
rt.def("/datum/chemical_reaction/slime/flight_potion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["holywater", 5, "uranium", 5]));
	return f.dot;
});

// /datum/chemical_reaction/slime/flight_potion/proc/on_reaction  (code/modules/reagents/chemistry/recipes/slime_extracts.dm:635)  may sleep
rt.def("/datum/chemical_reaction/slime/flight_potion/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/potion/flight"), [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder"] });
