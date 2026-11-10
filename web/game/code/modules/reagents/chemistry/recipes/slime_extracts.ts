// Based on /tg/station's code/modules/reagents/chemistry/recipes/slime_extracts.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(2592, "/datum/chemical_reaction/slime", "/datum/chemical_reaction", {
	deletes_extract: 1,
});

// slime_extracts.dm:6
rt.def("/datum/chemical_reaction/slime/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	if (!this.deletes_extract) return f.dot;
	yield* this.delete_extract(holder);
	return f.dot;
}, true);

// slime_extracts.dm:12
rt.def("/datum/chemical_reaction/slime/proc/delete_extract", function* delete_extract(f: Frame, holder: Value) {
	let M: Value = null;
	if (!((M = holder.my_atom).Uses <= 0 && !rt.len(f, this.results))) return f.dot;
	yield* qdel(M);
	return f.dot;
}, true, { argTypes: [{ path: "/datum/reagents" }] });

rt.type(2593, "/datum/chemical_reaction/slime/slimespawn", "/datum/chemical_reaction/slime", {
	name: "Slime Spawn",
	id: "m_spawn",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/grey"),
});

// slime_extracts.dm:19
rt.def("/datum/chemical_reaction/slime/slimespawn/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:24
rt.def("/datum/chemical_reaction/slime/slimespawn/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let S: Value = null;
	(S = (yield* new_(T("/mob/living/simple_animal/slime"), rt.getStep(f, holder.my_atom, 0), "grey"))).visible_message("<span class='danger'>Infused with plasma, the core begins to quiver and grow, and a new baby slime emerges from it!</span>");
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2594, "/datum/chemical_reaction/slime/slimeinaprov", "/datum/chemical_reaction/slime", {
	name: "Slime epinephrine",
	id: "m_inaprov",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/grey"),
});

// slime_extracts.dm:31
rt.def("/datum/chemical_reaction/slime/slimeinaprov/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["epinephrine", 3]);
	this.required_reagents = rt.alist(f, ["water", 5]);
	return f.dot;
});

rt.type(2595, "/datum/chemical_reaction/slime/slimemonkey", "/datum/chemical_reaction/slime", {
	name: "Slime Monkey",
	id: "m_monkey",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/grey"),
});

// slime_extracts.dm:39
rt.def("/datum/chemical_reaction/slime/slimemonkey/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["blood", 1]);
	return f.dot;
});

// slime_extracts.dm:44
rt.def("/datum/chemical_reaction/slime/slimemonkey/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"), rt.getStep(f, holder.my_atom, 0));
	}
	rt.endFor(f, 0);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2596, "/datum/chemical_reaction/slime/slimemutate", "/datum/chemical_reaction/slime", {
	name: "Mutation Toxin",
	id: "mutationtoxin",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/green"),
});

// slime_extracts.dm:52
rt.def("/datum/chemical_reaction/slime/slimemutate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["mutationtoxin", 1]);
	this.required_reagents = rt.alist(f, ["plasma", 1]);
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

// slime_extracts.dm:61
rt.def("/datum/chemical_reaction/slime/slimemutate_unstable/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["unstablemutationtoxin", 1]);
	this.required_reagents = rt.alist(f, ["radium", 1]);
	return f.dot;
});

rt.type(2598, "/datum/chemical_reaction/slime/slimemetal", "/datum/chemical_reaction/slime", {
	name: "Slime Metal",
	id: "m_metal",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/metal"),
});

// slime_extracts.dm:71
rt.def("/datum/chemical_reaction/slime/slimemetal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:76
rt.def("/datum/chemical_reaction/slime/slimemetal/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let location: Value = null;
	yield* new_(T("/obj/item/stack/sheet/plasteel"), (location = rt.getStep(f, holder.my_atom, 0)), 5);
	yield* new_(T("/obj/item/stack/sheet/metal"), location, 15);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2599, "/datum/chemical_reaction/slime/slimeglass", "/datum/chemical_reaction/slime", {
	name: "Slime Glass",
	id: "m_glass",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/metal"),
});

// slime_extracts.dm:84
rt.def("/datum/chemical_reaction/slime/slimeglass/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["water", 1]);
	return f.dot;
});

// slime_extracts.dm:89
rt.def("/datum/chemical_reaction/slime/slimeglass/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let location: Value = null;
	yield* new_(T("/obj/item/stack/sheet/rglass"), (location = rt.getStep(f, holder.my_atom, 0)), 5);
	yield* new_(T("/obj/item/stack/sheet/glass"), location, 15);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2600, "/datum/chemical_reaction/slime/slimemobspawn", "/datum/chemical_reaction/slime", {
	name: "Slime Crit",
	id: "m_tele",
	required_other: 1,
	deletes_extract: 0,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/gold"),
});

// slime_extracts.dm:98
rt.def("/datum/chemical_reaction/slime/slimemobspawn/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:104
rt.def("/datum/chemical_reaction/slime/slimemobspawn/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let M: Value = null;
	let _T: Value = rt.getStep(f, holder.my_atom, 0);
	yield* this.summon_mobs(holder, _T);
	yield* deltimer((M = holder.my_atom).qdel_timer);
	yield* parent_proc();
	M.qdel_timer = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/chemical_reaction/slime/proc/delete_extract"), holder)), 55, 8));
	return f.dot;
}, true);

// slime_extracts.dm:112
rt.def("/datum/chemical_reaction/slime/slimemobspawn/proc/summon_mobs", function* summon_mobs(f: Frame, holder: Value, _T: Value) {
	_T.visible_message("<span class='danger'>The slime extract begins to vibrate violently!</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/chemical_reaction/proc/chemical_mob_spawn"), holder, 5, "Gold Slime")), 50);
	return f.dot;
}, true);

rt.type(2601, "/datum/chemical_reaction/slime/slimemobspawn/lesser", "/datum/chemical_reaction/slime/slimemobspawn", {
	name: "Slime Crit Lesser",
	id: "m_tele3",
	required_reagents: null,
});

// slime_extracts.dm:118
rt.def("/datum/chemical_reaction/slime/slimemobspawn/lesser/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["blood", 1]);
	return f.dot;
});

// slime_extracts.dm:121
rt.def("/datum/chemical_reaction/slime/slimemobspawn/lesser/proc/summon_mobs", function* summon_mobs(f: Frame, holder: Value, _T: Value) {
	_T.visible_message("<span class='danger'>The slime extract begins to vibrate violently!</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/chemical_reaction/proc/chemical_mob_spawn"), holder, 3, "Lesser Gold Slime", "neutral")), 50);
	return f.dot;
}, true);

rt.type(2602, "/datum/chemical_reaction/slime/slimemobspawn/friendly", "/datum/chemical_reaction/slime/slimemobspawn", {
	name: "Slime Crit Friendly",
	id: "m_tele5",
	required_reagents: null,
});

// slime_extracts.dm:127
rt.def("/datum/chemical_reaction/slime/slimemobspawn/friendly/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["water", 1]);
	return f.dot;
});

// slime_extracts.dm:130
rt.def("/datum/chemical_reaction/slime/slimemobspawn/friendly/proc/summon_mobs", function* summon_mobs(f: Frame, holder: Value, _T: Value) {
	_T.visible_message("<span class='danger'>The slime extract begins to vibrate adorably!</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/chemical_reaction/proc/chemical_mob_spawn"), holder, 1, "Friendly Gold Slime", "neutral")), 50);
	return f.dot;
}, true);

rt.type(2603, "/datum/chemical_reaction/slime/slimebork", "/datum/chemical_reaction/slime", {
	name: "Slime Bork",
	id: "m_tele2",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/silver"),
});

// slime_extracts.dm:137
rt.def("/datum/chemical_reaction/slime/slimebork/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:143
rt.def("/datum/chemical_reaction/slime/slimebork/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let _T: Value = null, C: Value = null, i: Value = null, chosen: Value = null, B: Value = null, j: Value = null;
	let $e: any;
	let borks: Value = this.getborks();
	playsound((_T = rt.getStep(f, holder.my_atom, 0)), rt.rsc("sound/effects/phasein.ogg"), 100, 1);
	for (C of each(viewers(_T, null), T("/mob/living/carbon"))) {
		yield* C.flash_act();
	}
	rt.forRange(f, 0, 1, 4 + rand(1, 2), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		chosen = pick(borks);
		B = (yield* new_(chosen, _T));
		if (prob(50)) {
			j = null;
			rt.forRange(f, 1, 1, rand(1, 3), 1);
			while (($e = rt.next(f, 1)) !== undefined) {
				j = $e;
				yield* step(B, pick(1, 2, 4, 8));
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	yield* parent_proc();
	return f.dot;
}, true);

// slime_extracts.dm:160
rt.def("/datum/chemical_reaction/slime/slimebork/proc/getborks", function getborks(f: Frame) {
	let blocked: Value = list(T("/obj/item/weapon/reagent_containers/food/snacks"), T("/obj/item/weapon/reagent_containers/food/snacks/store/bread"), T("/obj/item/weapon/reagent_containers/food/snacks/breadslice"), T("/obj/item/weapon/reagent_containers/food/snacks/store/cake"), T("/obj/item/weapon/reagent_containers/food/snacks/cakeslice"), T("/obj/item/weapon/reagent_containers/food/snacks/store"), T("/obj/item/weapon/reagent_containers/food/snacks/pie"), T("/obj/item/weapon/reagent_containers/food/snacks/kebab"), T("/obj/item/weapon/reagent_containers/food/snacks/pizza"), T("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice"), T("/obj/item/weapon/reagent_containers/food/snacks/salad"), T("/obj/item/weapon/reagent_containers/food/snacks/meat"), T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), T("/obj/item/weapon/reagent_containers/food/snacks/soup"), T("/obj/item/weapon/reagent_containers/food/snacks/grown"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom"));
	(blocked = rt.modify(blocked, typesof(T("/obj/item/weapon/reagent_containers/food/snacks/customizable")), rt.bitOr));
	return typesof(T("/obj/item/weapon/reagent_containers/food/snacks")) - blocked;
});

rt.type(2604, "/datum/chemical_reaction/slime/slimebork/drinks", "/datum/chemical_reaction/slime/slimebork", {
	name: "Slime Bork 2",
	id: "m_tele4",
	required_reagents: null,
});

// slime_extracts.dm:184
rt.def("/datum/chemical_reaction/slime/slimebork/drinks/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["water", 1]);
	return f.dot;
});

// slime_extracts.dm:187
rt.def("/datum/chemical_reaction/slime/slimebork/drinks/proc/getborks", function getborks(f: Frame) {
	return typesof(T("/obj/item/weapon/reagent_containers/food/drinks")) - T("/obj/item/weapon/reagent_containers/food/drinks");
});

rt.type(2605, "/datum/chemical_reaction/slime/slimefrost", "/datum/chemical_reaction/slime", {
	name: "Slime Frost Oil",
	id: "m_frostoil",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/blue"),
});

// slime_extracts.dm:193
rt.def("/datum/chemical_reaction/slime/slimefrost/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["frostoil", 10]);
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

rt.type(2606, "/datum/chemical_reaction/slime/slimestabilizer", "/datum/chemical_reaction/slime", {
	name: "Slime Stabilizer",
	id: "m_slimestabilizer",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/blue"),
});

// slime_extracts.dm:201
rt.def("/datum/chemical_reaction/slime/slimestabilizer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["blood", 1]);
	return f.dot;
});

// slime_extracts.dm:206
rt.def("/datum/chemical_reaction/slime/slimestabilizer/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/slimepotion/stabilizer"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2607, "/datum/chemical_reaction/slime/slimefoam", "/datum/chemical_reaction/slime", {
	name: "Slime Foam",
	id: "m_foam",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/blue"),
});

// slime_extracts.dm:212
rt.def("/datum/chemical_reaction/slime/slimefoam/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["fluorosurfactant", 20, "water", 20]);
	this.required_reagents = rt.alist(f, ["water", 5]);
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

// slime_extracts.dm:221
rt.def("/datum/chemical_reaction/slime/slimefreeze/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:227
rt.def("/datum/chemical_reaction/slime/slimefreeze/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let _T: Value = null, M: Value = null;
	(_T = rt.getStep(f, holder.my_atom, 0)).visible_message("<span class='danger'>The slime extract begins to vibrate adorably!</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/chemical_reaction/slime/slimefreeze/proc/freeze"), holder)), 50);
	yield* deltimer((M = holder.my_atom).qdel_timer);
	yield* parent_proc();
	M.qdel_timer = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/chemical_reaction/slime/proc/delete_extract"), holder)), 55, 8));
	return f.dot;
}, true);

// slime_extracts.dm:236
rt.def("/datum/chemical_reaction/slime/slimefreeze/proc/freeze", function freeze(f: Frame, holder: Value) {
	let _T: Value = null;
	if (!(holder && holder.my_atom)) return f.dot;
	if (!rt.istype((_T = rt.getStep(f, holder.my_atom, 0)), T("/turf/open"))) return f.dot;
	_T.atmos_spawn_air("freon=50;TEMP=120");
	return f.dot;
}, false, { argTypes: [{ path: "/datum/reagents" }] });

rt.type(2609, "/datum/chemical_reaction/slime/slimefireproof", "/datum/chemical_reaction/slime", {
	name: "Slime Fireproof",
	id: "m_fireproof",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/darkblue"),
});

// slime_extracts.dm:244
rt.def("/datum/chemical_reaction/slime/slimefireproof/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["water", 1]);
	return f.dot;
});

// slime_extracts.dm:249
rt.def("/datum/chemical_reaction/slime/slimefireproof/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/slimepotion/fireproof"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2610, "/datum/chemical_reaction/slime/slimecasp", "/datum/chemical_reaction/slime", {
	name: "Slime Capsaicin Oil",
	id: "m_capsaicinoil",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/orange"),
});

// slime_extracts.dm:256
rt.def("/datum/chemical_reaction/slime/slimecasp/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["capsaicin", 10]);
	this.required_reagents = rt.alist(f, ["blood", 1]);
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

// slime_extracts.dm:264
rt.def("/datum/chemical_reaction/slime/slimefire/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:270
rt.def("/datum/chemical_reaction/slime/slimefire/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let _T: Value = null, M: Value = null;
	(_T = rt.getStep(f, holder.my_atom, 0)).visible_message("<span class='danger'>The slime extract begins to vibrate adorably!</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/chemical_reaction/slime/slimefire/proc/slime_burn"), holder)), 50);
	yield* deltimer((M = holder.my_atom).qdel_timer);
	yield* parent_proc();
	M.qdel_timer = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/chemical_reaction/slime/proc/delete_extract"), holder)), 55, 8));
	return f.dot;
}, true);

// slime_extracts.dm:279
rt.def("/datum/chemical_reaction/slime/slimefire/proc/slime_burn", function slime_burn(f: Frame, holder: Value) {
	let _T: Value = null;
	if (!(holder && holder.my_atom)) return f.dot;
	if (!rt.istype((_T = rt.getStep(f, holder.my_atom, 0)), T("/turf/open"))) return f.dot;
	_T.atmos_spawn_air("plasma=50;TEMP=1000");
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

// slime_extracts.dm:288
rt.def("/datum/chemical_reaction/slime/slimesmoke/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["phosphorus", 10, "potassium", 10, "sugar", 10]);
	this.required_reagents = rt.alist(f, ["water", 5]);
	return f.dot;
});

rt.type(2613, "/datum/chemical_reaction/slime/slimeoverload", "/datum/chemical_reaction/slime", {
	name: "Slime EMP",
	id: "m_emp",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/yellow"),
});

// slime_extracts.dm:297
rt.def("/datum/chemical_reaction/slime/slimeoverload/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["blood", 1]);
	return f.dot;
});

// slime_extracts.dm:302
rt.def("/datum/chemical_reaction/slime/slimeoverload/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	yield* empulse(rt.getStep(f, holder.my_atom, 0), 3, 7);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2614, "/datum/chemical_reaction/slime/slimecell", "/datum/chemical_reaction/slime", {
	name: "Slime Powercell",
	id: "m_cell",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/yellow"),
});

// slime_extracts.dm:308
rt.def("/datum/chemical_reaction/slime/slimecell/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:313
rt.def("/datum/chemical_reaction/slime/slimecell/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	yield* new_(T("/obj/item/weapon/stock_parts/cell/high/slime"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2615, "/datum/chemical_reaction/slime/slimeglow", "/datum/chemical_reaction/slime", {
	name: "Slime Glow",
	id: "m_glow",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/yellow"),
});

// slime_extracts.dm:319
rt.def("/datum/chemical_reaction/slime/slimeglow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["water", 1]);
	return f.dot;
});

// slime_extracts.dm:324
rt.def("/datum/chemical_reaction/slime/slimeglow/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let _T: Value = null;
	(_T = rt.getStep(f, holder.my_atom, 0)).visible_message("<span class='danger'>The slime begins to emit a soft light. Squeezing it will cause it to grow brightly.</span>");
	yield* new_(T("/obj/item/device/flashlight/slime"), _T);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2616, "/datum/chemical_reaction/slime/slimepsteroid", "/datum/chemical_reaction/slime", {
	name: "Slime Steroid",
	id: "m_steroid",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/purple"),
});

// slime_extracts.dm:333
rt.def("/datum/chemical_reaction/slime/slimepsteroid/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:338
rt.def("/datum/chemical_reaction/slime/slimepsteroid/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/slimepotion/steroid"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2617, "/datum/chemical_reaction/slime/slimejam", "/datum/chemical_reaction/slime", {
	name: "Slime Jam",
	id: "m_jam",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/purple"),
});

// slime_extracts.dm:344
rt.def("/datum/chemical_reaction/slime/slimejam/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["slimejelly", 10]);
	this.required_reagents = rt.alist(f, ["sugar", 1]);
	return f.dot;
});

rt.type(2618, "/datum/chemical_reaction/slime/slimeplasma", "/datum/chemical_reaction/slime", {
	name: "Slime Plasma",
	id: "m_plasma",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/darkpurple"),
});

// slime_extracts.dm:353
rt.def("/datum/chemical_reaction/slime/slimeplasma/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:358
rt.def("/datum/chemical_reaction/slime/slimeplasma/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/stack/sheet/mineral/plasma"), rt.getStep(f, holder.my_atom, 0), 3);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2619, "/datum/chemical_reaction/slime/slimemutator", "/datum/chemical_reaction/slime", {
	name: "Slime Mutator",
	id: "m_slimemutator",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/red"),
});

// slime_extracts.dm:365
rt.def("/datum/chemical_reaction/slime/slimemutator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:370
rt.def("/datum/chemical_reaction/slime/slimemutator/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/slimepotion/mutator"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2620, "/datum/chemical_reaction/slime/slimebloodlust", "/datum/chemical_reaction/slime", {
	name: "Bloodlust",
	id: "m_bloodlust",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/red"),
});

// slime_extracts.dm:376
rt.def("/datum/chemical_reaction/slime/slimebloodlust/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["blood", 1]);
	return f.dot;
});

// slime_extracts.dm:381
rt.def("/datum/chemical_reaction/slime/slimebloodlust/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let slime: Value = null;
	for (slime of each(viewers(rt.getStep(f, holder.my_atom, 0), null), T("/mob/living/simple_animal/slime"))) {
		slime.rabid = 1;
		slime.visible_message(`<span class='danger'>The ${slime} is driven into a frenzy!</span>`);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2621, "/datum/chemical_reaction/slime/slimespeed", "/datum/chemical_reaction/slime", {
	name: "Slime Speed",
	id: "m_speed",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/red"),
});

// slime_extracts.dm:389
rt.def("/datum/chemical_reaction/slime/slimespeed/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["water", 1]);
	return f.dot;
});

// slime_extracts.dm:394
rt.def("/datum/chemical_reaction/slime/slimespeed/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/slimepotion/speed"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2622, "/datum/chemical_reaction/slime/docility", "/datum/chemical_reaction/slime", {
	name: "Docility Potion",
	id: "m_potion",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/pink"),
});

// slime_extracts.dm:401
rt.def("/datum/chemical_reaction/slime/docility/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:406
rt.def("/datum/chemical_reaction/slime/docility/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/slimepotion/docility"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2623, "/datum/chemical_reaction/slime/gender", "/datum/chemical_reaction/slime", {
	name: "Gender Potion",
	id: "m_gender",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/pink"),
});

// slime_extracts.dm:412
rt.def("/datum/chemical_reaction/slime/gender/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["blood", 1]);
	return f.dot;
});

// slime_extracts.dm:417
rt.def("/datum/chemical_reaction/slime/gender/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/slimepotion/genderchange"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2624, "/datum/chemical_reaction/slime/slimemutate2", "/datum/chemical_reaction/slime", {
	name: "Advanced Mutation Toxin",
	id: "mutationtoxin2",
	required_other: 1,
	results: null,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/black"),
});

// slime_extracts.dm:424
rt.def("/datum/chemical_reaction/slime/slimemutate2/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["amutationtoxin", 1]);
	this.required_reagents = rt.alist(f, ["plasma", 1]);
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

// slime_extracts.dm:433
rt.def("/datum/chemical_reaction/slime/slimeexplosion/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:439
rt.def("/datum/chemical_reaction/slime/slimeexplosion/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let toucher: Value = null, M: Value = null;
	let $1: any;
	let _T: Value = rt.getStep(f, holder.my_atom, 0);
	let A: Value = get_area(_T);
	let lastkey: Value = holder.my_atom.fingerprintslast;
	let touch_msg: Value = "N/A";
	if (lastkey) {
		touch_msg = `${`${key_name_admin((toucher = get_mob_by_key(lastkey)))}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [toucher])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [toucher])}`}.`;
	}
	let $0: any = A;
	if (_T) {
		$1 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
	} else {
		$1 = "nonexistent location";
	}
	message_admins(`Slime Explosion reaction started at ${$0} ${`${$1}`}. Last Fingerprint: ${touch_msg}`);
	log_game(`Slime Explosion reaction started at ${A} ${`(${_T.x},${_T.y},${_T.z})`}. Last Fingerprint: ${lastkey ? lastkey : "N/A"}.`);
	_T.visible_message("<span class='danger'>The slime extract begins to vibrate violently !</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/chemical_reaction/slime/slimeexplosion/proc/boom"), holder)), 50);
	yield* deltimer((M = holder.my_atom).qdel_timer);
	yield* parent_proc();
	M.qdel_timer = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/chemical_reaction/slime/proc/delete_extract"), holder)), 55, 8));
	return f.dot;
}, true);

// slime_extracts.dm:456
rt.def("/datum/chemical_reaction/slime/slimeexplosion/proc/boom", function boom(f: Frame, holder: Value) {
	if (!(holder && holder.my_atom)) return f.dot;
	explosion(rt.getStep(f, holder.my_atom, 0), 1, 3, 6);
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

// slime_extracts.dm:463
rt.def("/datum/chemical_reaction/slime/slimecornoil/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["cornoil", 10]);
	this.required_reagents = rt.alist(f, ["blood", 1]);
	return f.dot;
});

rt.type(2627, "/datum/chemical_reaction/slime/slimepotion2", "/datum/chemical_reaction/slime", {
	name: "Slime Potion 2",
	id: "m_potion2",
	required_other: 1,
	required_container: rt.typePath("/obj/item/slime_extract/lightpink"),
	required_reagents: null,
});

// slime_extracts.dm:473
rt.def("/datum/chemical_reaction/slime/slimepotion2/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:477
rt.def("/datum/chemical_reaction/slime/slimepotion2/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/slimepotion/sentience"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2628, "/datum/chemical_reaction/slime/adamantine", "/datum/chemical_reaction/slime", {
	name: "Adamantine",
	id: "adamantine",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/adamantine"),
});

// slime_extracts.dm:484
rt.def("/datum/chemical_reaction/slime/adamantine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:489
rt.def("/datum/chemical_reaction/slime/adamantine/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/stack/sheet/mineral/adamantine"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2629, "/datum/chemical_reaction/slime/slimefloor2", "/datum/chemical_reaction/slime", {
	name: "Bluespace Floor",
	id: "m_floor2",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/bluespace"),
});

// slime_extracts.dm:496
rt.def("/datum/chemical_reaction/slime/slimefloor2/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["blood", 1]);
	return f.dot;
});

// slime_extracts.dm:501
rt.def("/datum/chemical_reaction/slime/slimefloor2/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	yield* new_(T("/obj/item/stack/tile/bluespace"), rt.getStep(f, holder.my_atom, 0), 25);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2630, "/datum/chemical_reaction/slime/slimecrystal", "/datum/chemical_reaction/slime", {
	name: "Slime Crystal",
	id: "m_crystal",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/bluespace"),
});

// slime_extracts.dm:508
rt.def("/datum/chemical_reaction/slime/slimecrystal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:513
rt.def("/datum/chemical_reaction/slime/slimecrystal/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let BC: Value = null;
	(BC = (yield* new_(T("/obj/item/weapon/ore/bluespace_crystal"), rt.getStep(f, holder.my_atom, 0)))).visible_message(`<span class='notice'>The ${BC.name} appears out of thin air!</span>`);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2631, "/datum/chemical_reaction/slime/slimepsteroid2", "/datum/chemical_reaction/slime", {
	name: "Slime Steroid 2",
	id: "m_steroid2",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/cerulean"),
});

// slime_extracts.dm:521
rt.def("/datum/chemical_reaction/slime/slimepsteroid2/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:526
rt.def("/datum/chemical_reaction/slime/slimepsteroid2/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/slimepotion/enhancer"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2632, "/datum/chemical_reaction/slime/slime_territory", "/datum/chemical_reaction/slime", {
	name: "Slime Territory",
	id: "s_territory",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/cerulean"),
});

// slime_extracts.dm:532
rt.def("/datum/chemical_reaction/slime/slime_territory/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["blood", 1]);
	return f.dot;
});

// slime_extracts.dm:537
rt.def("/datum/chemical_reaction/slime/slime_territory/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/areaeditor/blueprints/slime"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2633, "/datum/chemical_reaction/slime/slimestop", "/datum/chemical_reaction/slime", {
	name: "Slime Stop",
	id: "m_stop",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/sepia"),
});

// slime_extracts.dm:544
rt.def("/datum/chemical_reaction/slime/slimestop/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:549
rt.def("/datum/chemical_reaction/slime/slimestop/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let _T: Value = null;
	yield* (_T = (yield* new_(T("/obj/effect/timestop")))).forceMove(rt.getStep(f, holder.my_atom, 0));
	_T.immune += get_mob_by_key(holder.my_atom.fingerprintslast);
	yield* _T.timestop();
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2634, "/datum/chemical_reaction/slime/slimecamera", "/datum/chemical_reaction/slime", {
	name: "Slime Camera",
	id: "m_camera",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/sepia"),
});

// slime_extracts.dm:558
rt.def("/datum/chemical_reaction/slime/slimecamera/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["water", 1]);
	return f.dot;
});

// slime_extracts.dm:563
rt.def("/datum/chemical_reaction/slime/slimecamera/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/device/camera"), rt.getStep(f, holder.my_atom, 0));
	yield* new_(T("/obj/item/device/camera_film"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2635, "/datum/chemical_reaction/slime/slimefloor", "/datum/chemical_reaction/slime", {
	name: "Sepia Floor",
	id: "m_floor",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/sepia"),
});

// slime_extracts.dm:570
rt.def("/datum/chemical_reaction/slime/slimefloor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["blood", 1]);
	return f.dot;
});

// slime_extracts.dm:575
rt.def("/datum/chemical_reaction/slime/slimefloor/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/stack/tile/sepia"), rt.getStep(f, holder.my_atom, 0), 25);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2636, "/datum/chemical_reaction/slime/slimepaint", "/datum/chemical_reaction/slime", {
	name: "Slime Paint",
	id: "s_paint",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/pyrite"),
});

// slime_extracts.dm:582
rt.def("/datum/chemical_reaction/slime/slimepaint/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:587
rt.def("/datum/chemical_reaction/slime/slimepaint/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let chosen: Value = pick(typesof(T("/obj/item/weapon/paint")) - T("/obj/item/weapon/paint"));
	yield* new_(chosen, rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2637, "/datum/chemical_reaction/slime/slimecrayon", "/datum/chemical_reaction/slime", {
	name: "Slime Crayon",
	id: "s_crayon",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/pyrite"),
});

// slime_extracts.dm:594
rt.def("/datum/chemical_reaction/slime/slimecrayon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["blood", 1]);
	return f.dot;
});

// slime_extracts.dm:599
rt.def("/datum/chemical_reaction/slime/slimecrayon/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let chosen: Value = pick(difflist(typesof(T("/obj/item/toy/crayon")) - T("/obj/item/toy/crayon"), typesof(T("/obj/item/toy/crayon/spraycan"))));
	yield* new_(chosen, rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2638, "/datum/chemical_reaction/slime/slimeRNG", "/datum/chemical_reaction/slime", {
	name: "Random Core",
	id: "slimerng",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/rainbow"),
});

// slime_extracts.dm:607
rt.def("/datum/chemical_reaction/slime/slimeRNG/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["plasma", 1]);
	return f.dot;
});

// slime_extracts.dm:612
rt.def("/datum/chemical_reaction/slime/slimeRNG/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let S: Value = null;
	(S = (yield* new_(T("/mob/living/simple_animal/slime/random"), rt.getStep(f, holder.my_atom, 0)))).visible_message("<span class='danger'>Infused with plasma, the core begins to quiver and grow, and a new baby slime emerges from it!</span>");
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2639, "/datum/chemical_reaction/slime/slime_transfer", "/datum/chemical_reaction/slime", {
	name: "Transfer Potion",
	id: "slimetransfer",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/rainbow"),
});

// slime_extracts.dm:619
rt.def("/datum/chemical_reaction/slime/slime_transfer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["blood", 1]);
	return f.dot;
});

// slime_extracts.dm:624
rt.def("/datum/chemical_reaction/slime/slime_transfer/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/slimepotion/transference"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2640, "/datum/chemical_reaction/slime/flight_potion", "/datum/chemical_reaction/slime", {
	name: "Flight Potion",
	id: "flightpotion",
	required_other: 1,
	required_reagents: null,
	required_container: rt.typePath("/obj/item/slime_extract/rainbow"),
});

// slime_extracts.dm:630
rt.def("/datum/chemical_reaction/slime/flight_potion/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["holywater", 5, "uranium", 5]);
	return f.dot;
});

// slime_extracts.dm:635
rt.def("/datum/chemical_reaction/slime/flight_potion/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/potion/flight"), rt.getStep(f, holder.my_atom, 0));
	yield* parent_proc();
	return f.dot;
}, true);
