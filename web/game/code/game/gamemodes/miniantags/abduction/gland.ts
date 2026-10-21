// From code/game/gamemodes/miniantags/abduction/gland.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9441, "/obj/item/organ/heart/gland", "/obj/item/organ/heart", {
	cooldown_low: 300,
	cooldown_high: 300,
	next_activation: 0,
	uses: null,
	human_only: 0,
	active: 0,
	name: "fleshy mass",
	desc: "A nausea-inducing hunk of twisting flesh and metal.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "gland",
	status: 2,
	origin_tech: "materials=4;biotech=7;abductor=3",
	beating: 1,
});

// /obj/item/organ/heart/gland/proc/ownerCheck  (code/game/gamemodes/miniantags/abduction/gland.dm:17)
rt.def("/obj/item/organ/heart/gland/proc/ownerCheck", function ownerCheck(f: Frame) {
	if (truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 1;
	}
	if ((!truthy(rt.sv(f, "human_only")) && truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon")) ? 1 : 0)))) {
		return 1;
	}
	return 0;
});

// /obj/item/organ/heart/gland/proc/Start  (code/game/gamemodes/miniantags/abduction/gland.dm:25)
rt.def("/obj/item/organ/heart/gland/proc/Start", function Start(f: Frame) {
	rt.setSv(f, "active", 1);
	rt.setSv(f, "next_activation", add(rt.worldTime(f), rt.call(f, P("/proc/rand"), null, [rt.sv(f, "cooldown_low"), rt.sv(f, "cooldown_high")])));
	return f.dot;
});

// /obj/item/organ/heart/gland/proc/Remove  (code/game/gamemodes/miniantags/abduction/gland.dm:30)  may sleep
rt.def("/obj/item/organ/heart/gland/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	rt.setSv(f, "active", 0);
	if (isEqual(rt.initial(f, live(f.src), "uses"), 1)) {
		rt.setSv(f, "uses", rt.initial(f, live(f.src), "uses"));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/heart/gland/proc/Insert  (code/game/gamemodes/miniantags/abduction/gland.dm:35)  may sleep
rt.def("/obj/item/organ/heart/gland/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(!isEqual(live(f.args[1]), 2) && truthy(rt.sv(f, "uses")))) return f.dot;
	yield* g.srcCall(f, "Start");
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/heart/gland/proc/on_life  (code/game/gamemodes/miniantags/abduction/gland.dm:40)  may sleep
rt.def("/obj/item/organ/heart/gland/proc/on_life", function* on_life(f: Frame) {
	if (!truthy(rt.sv(f, "beating"))) {
		rt.setSv(f, "beating", 1);
	}
	if (!truthy(rt.sv(f, "active"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "ownerCheck")))) {
		rt.setSv(f, "active", 0);
		return live(f.dot);
	}
	if (rt.le(rt.sv(f, "next_activation"), rt.worldTime(f))) {
		yield* g.srcCall(f, "activate");
		rt.incSrcVar(f, "uses", -1, true);
		rt.setSv(f, "next_activation", add(rt.worldTime(f), (yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "cooldown_low"), rt.sv(f, "cooldown_high")]))));
	}
	if (truthy(rt.sv(f, "uses"))) return f.dot;
	rt.setSv(f, "active", 0);
	return f.dot;
}, true);

rt.type(9442, "/obj/item/organ/heart/gland/heals", "/obj/item/organ/heart/gland", {
	cooldown_low: 200,
	cooldown_high: 400,
	uses: -1,
	icon_state: "health",
});

// /obj/item/organ/heart/gland/heals/proc/activate  (code/game/gamemodes/miniantags/abduction/gland.dm:65)  may sleep
rt.def("/obj/item/organ/heart/gland/heals/proc/activate", function* activate(f: Frame) {
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>You feel curiously revitalized.</span>"]);
	yield* g.callName(f, rt.sv(f, "owner"), "adjustBruteLoss", [-20]);
	yield* g.callName(f, rt.sv(f, "owner"), "adjustOxyLoss", [-20]);
	yield* g.callName(f, rt.sv(f, "owner"), "adjustFireLoss", [-20]);
	return f.dot;
}, true);

rt.type(9443, "/obj/item/organ/heart/gland/slime", "/obj/item/organ/heart/gland", {
	cooldown_low: 600,
	cooldown_high: 1200,
	uses: -1,
	icon_state: "slime",
});

// /obj/item/organ/heart/gland/slime/proc/activate  (code/game/gamemodes/miniantags/abduction/gland.dm:77)  may sleep
rt.def("/obj/item/organ/heart/gland/slime/proc/activate", function* activate(f: Frame) {
	let Slime: Value = null;
	f.vars = () => [Slime];
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You feel nauseous!</span>"]);
	yield* g.callName(f, rt.sv(f, "owner"), "vomit", [20]);
	Slime = null;
	rt.setFv(f, "Friends", (Slime = (yield* g.new_(f, T("/mob/living/simple_animal/slime"), [rt.getStep(f, rt.sv(f, "owner"), 0), "grey"]))), rt.list(rt.sv(f, "owner")));
	rt.setFv(f, "Leader", live(Slime), rt.sv(f, "owner"));
	return f.dot;
}, true);

rt.type(9444, "/obj/item/organ/heart/gland/mindshock", "/obj/item/organ/heart/gland", {
	cooldown_low: 300,
	cooldown_high: 300,
	uses: -1,
	origin_tech: "materials=4;biotech=4;magnets=6;abductor=3",
	icon_state: "mindshock",
});

// /obj/item/organ/heart/gland/mindshock/proc/activate  (code/game/gamemodes/miniantags/abduction/gland.dm:93)
rt.def("/obj/item/organ/heart/gland/mindshock/proc/activate", function activate(f: Frame) {
	let _T: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [_T, H, $e];
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>You get a headache.</span>"]);
	_T = rt.getStep(f, rt.sv(f, "owner"), 0);
	H = null;
	rt.forList(f, 0, rt.call(f, P("/proc/orange"), null, [4, live(_T)]), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (isEqual(live(H), rt.sv(f, "owner"))) {
			continue;
		}
		rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='alien'>You hear a buzz in your head.</span>"]);
		rt.modField(f, live(H), "confused", 20, add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(9445, "/obj/item/organ/heart/gland/pop", "/obj/item/organ/heart/gland", {
	cooldown_low: 900,
	cooldown_high: 1800,
	uses: -1,
	human_only: 1,
	icon_state: "species",
});

// /obj/item/organ/heart/gland/pop/proc/activate  (code/game/gamemodes/miniantags/abduction/gland.dm:110)  may sleep
rt.def("/obj/item/organ/heart/gland/pop/proc/activate", function* activate(f: Frame) {
	let species: Value = null;
	f.vars = () => [species];
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>You feel unlike yourself.</span>"]);
	species = rt.op(f, "PickUnweighted", [1], [rt.list(T("/datum/species/lizard"), T("/datum/species/jelly/slime"), T("/datum/species/pod"), T("/datum/species/fly"), T("/datum/species/jelly"))]);
	yield* g.callName(f, rt.sv(f, "owner"), "set_species", [live(species)]);
	return f.dot;
}, true);

rt.type(9446, "/obj/item/organ/heart/gland/ventcrawling", "/obj/item/organ/heart/gland", {
	cooldown_low: 1800,
	cooldown_high: 2400,
	uses: 1,
	origin_tech: "materials=4;biotech=5;bluespace=4;abductor=3",
	icon_state: "vent",
});

// /obj/item/organ/heart/gland/ventcrawling/proc/activate  (code/game/gamemodes/miniantags/abduction/gland.dm:122)
rt.def("/obj/item/organ/heart/gland/ventcrawling/proc/activate", function activate(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>You feel very stretchy.</span>"]);
	rt.setFv(f, "ventcrawler", rt.sv(f, "owner"), 2);
	return f.dot;
});

rt.type(9447, "/obj/item/organ/heart/gland/viral", "/obj/item/organ/heart/gland", {
	cooldown_low: 1800,
	cooldown_high: 2400,
	uses: 1,
	icon_state: "viral",
});

// /obj/item/organ/heart/gland/viral/proc/activate  (code/game/gamemodes/miniantags/abduction/gland.dm:133)  may sleep
rt.def("/obj/item/organ/heart/gland/viral/proc/activate", function* activate(f: Frame) {
	let virus_type: Value = null, D: Value = null;
	f.vars = () => [virus_type, D];
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You feel sick.</span>"]);
	virus_type = rt.op(f, "PickUnweighted", [3], [T("/datum/disease/beesease"), T("/datum/disease/brainrot"), T("/datum/disease/magnitis")]);
	rt.setFv(f, "carrier", (D = (yield* g.new_(f, live(virus_type), []))), 1);
	rt.modField(f, rt.sv(f, "owner"), "viruses", live(D), add);
	rt.setFv(f, "affected_mob", live(D), rt.sv(f, "owner"));
	rt.setFv(f, "holder", live(D), rt.sv(f, "owner"));
	yield* g.callName(f, rt.sv(f, "owner"), "med_hud_set_status", []);
	return f.dot;
}, true);

rt.type(9448, "/obj/item/organ/heart/gland/emp", "/obj/item/organ/heart/gland", {
	cooldown_low: 900,
	cooldown_high: 1600,
	uses: 10,
	origin_tech: "materials=4;biotech=4;magnets=6;abductor=3",
	icon_state: "emp",
});

// /obj/item/organ/heart/gland/emp/proc/activate  (code/game/gamemodes/miniantags/abduction/gland.dm:151)  may sleep
rt.def("/obj/item/organ/heart/gland/emp/proc/activate", function* activate(f: Frame) {
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You feel a spike of pain in your head.</span>"]);
	yield* g.call(f, P("/proc/empulse"), null, [rt.getStep(f, rt.sv(f, "owner"), 0), 2, 5, 1]);
	return f.dot;
}, true);

rt.type(9449, "/obj/item/organ/heart/gland/spiderman", "/obj/item/organ/heart/gland", {
	cooldown_low: 450,
	cooldown_high: 900,
	uses: 10,
	icon_state: "spider",
});

// /obj/item/organ/heart/gland/spiderman/proc/activate  (code/game/gamemodes/miniantags/abduction/gland.dm:161)  may sleep
rt.def("/obj/item/organ/heart/gland/spiderman/proc/activate", function* activate(f: Frame) {
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You feel something crawling in your skin.</span>"]);
	(rt.modField(f, rt.sv(f, "owner"), "faction", "spiders", rt.bitOr));
	yield* g.new_(f, T("/obj/structure/spider/spiderling"), [rt.fv(f, "loc", rt.sv(f, "owner"))]);
	return f.dot;
}, true);

rt.type(9450, "/obj/item/organ/heart/gland/egg", "/obj/item/organ/heart/gland", {
	cooldown_low: 300,
	cooldown_high: 400,
	uses: -1,
	icon_state: "egg",
});

// /obj/item/organ/heart/gland/egg/proc/activate  (code/game/gamemodes/miniantags/abduction/gland.dm:172)  may sleep
rt.def("/obj/item/organ/heart/gland/egg/proc/activate", function* activate(f: Frame) {
	let egg: Value = null;
	f.vars = () => [egg];
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='boldannounce'>You lay an egg!</span>"]);
	yield* g.callName(f, rt.gv(f, "reagents", (egg = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/egg"), [rt.fv(f, "loc", rt.sv(f, "owner"))])))), "add_reagent", ["sacid", 20]);
	rt.modField(f, live(egg), "desc", " It smells bad.", add);
	return f.dot;
}, true);

rt.type(9451, "/obj/item/organ/heart/gland/bloody", "/obj/item/organ/heart/gland", {
	cooldown_low: 200,
	cooldown_high: 400,
	uses: -1,
});

// /obj/item/organ/heart/gland/bloody/proc/activate  (code/game/gamemodes/miniantags/abduction/gland.dm:183)  may sleep
rt.def("/obj/item/organ/heart/gland/bloody/proc/activate", function* activate(f: Frame) {
	let _T: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [_T, H, $e];
	(rt.modField(f, rt.sv(f, "owner"), "blood_volume", 20, subtract));
	yield* g.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='danger'>＀'s skin erupts with blood!</span>", [rt.sv(f, "owner")]), "<span class='userdanger'>Blood pours from your skin!</span>"]);
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [3, rt.sv(f, "owner")])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.callName(f, rt.sv(f, "owner"), "add_splatter_floor", [live(_T)]);
	}
	rt.endFor(f, 0);
	H = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [3, rt.sv(f, "owner")])), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.callName(f, live(H), "add_mob_blood", [rt.sv(f, "owner")]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(9452, "/obj/item/organ/heart/gland/bodysnatch", "/obj/item/organ/heart/gland", {
	cooldown_low: 600,
	cooldown_high: 600,
	human_only: 1,
	uses: 1,
});

// /obj/item/organ/heart/gland/bodysnatch/proc/activate  (code/game/gamemodes/miniantags/abduction/gland.dm:200)  may sleep
rt.def("/obj/item/organ/heart/gland/bodysnatch/proc/activate", function* activate(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You feel something moving around inside you...</span>"]);
	if (truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (C = (yield* g.new_(f, T("/obj/structure/spider/cocoon/abductor"), [rt.getStep(f, rt.sv(f, "owner"), 0)]))), "Copy", [rt.sv(f, "owner")]);
		yield* g.callName(f, live(C), "Start", []);
	}
	yield* g.callName(f, rt.sv(f, "owner"), "adjustBruteLoss", [40]);
	yield* g.callName(f, rt.sv(f, "owner"), "add_splatter_floor", []);
	return f.dot;
}, true);

rt.type(12461, "/obj/structure/spider/cocoon/abductor", "/obj/structure/spider/cocoon", {
	hatch_time: 0,
	name: "slimy cocoon",
	desc: "Something is moving inside.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "cocoon_large3",
	color: "#0a780a",
	density: 1,
});

// /obj/structure/spider/cocoon/abductor/proc/Copy  (code/game/gamemodes/miniantags/abduction/gland.dm:219)  may sleep
rt.def("/obj/structure/spider/cocoon/abductor/proc/Copy", function* Copy(f: Frame, H: Value) {
	let clone: Value = null;
	f.vars = () => [H, clone];
	yield* g.callName(f, (clone = (yield* g.new_(f, T("/mob/living/carbon/human/interactive/greytide"), [live(f.src)]))), "hardset_dna", [rt.gv(f, "uni_identity", rt.fv(f, "dna", live(H))), rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(H))), rt.fv(f, "real_name", live(H)), rt.gv(f, "blood_type", rt.fv(f, "dna", live(H))), rt.gv(f, "type", rt.gv(f, "species", rt.fv(f, "dna", live(H)))), rt.gv(f, "features", rt.fv(f, "dna", live(H)))]);
	return f.dot;
}, true);

// /obj/structure/spider/cocoon/abductor/proc/Start  (code/game/gamemodes/miniantags/abduction/gland.dm:223)
rt.def("/obj/structure/spider/cocoon/abductor/proc/Start", function Start(f: Frame) {
	rt.setSv(f, "hatch_time", add(rt.worldTime(f), 600));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
});

// /obj/structure/spider/cocoon/abductor/proc/process  (code/game/gamemodes/miniantags/abduction/gland.dm:227)  may sleep
rt.def("/obj/structure/spider/cocoon/abductor/proc/process", function* process(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if (!rt.gt(rt.worldTime(f), rt.sv(f, "hatch_time"))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	M = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='warning'>＀ hatches!</span>", [live(f.src)])]);
		rt.setFv(f, "loc", live(M), rt.fv(f, "loc", live(f.src)));
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

rt.type(9453, "/obj/item/organ/heart/gland/plasma", "/obj/item/organ/heart/gland", {
	cooldown_low: 1200,
	cooldown_high: 1800,
	uses: -1,
	origin_tech: "materials=4;biotech=4;plasmatech=6;abductor=3",
});

// /obj/item/organ/heart/gland/plasma/proc/activate  (code/game/gamemodes/miniantags/abduction/gland.dm:242)  may sleep
rt.def("/obj/item/organ/heart/gland/plasma/proc/activate", function* activate(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You feel bloated.</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [150]);
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='userdanger'>A massive stomachache overcomes you.</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='danger'>＀ vomits a cloud of plasma!</span>", [rt.sv(f, "owner")])]);
	if (truthy((rt.istype((_T = rt.getStep(f, rt.sv(f, "owner"), 0)), T("/turf/open")) ? 1 : 0))) {
		yield* g.callName(f, live(_T), "atmos_spawn_air", [fmt("plasma=50;TEMP=＀", [293.1499938964844])]);
	}
	yield* g.callName(f, rt.sv(f, "owner"), "vomit", []);
	return f.dot;
}, true);
