// From code/modules/awaymissions/mission_code/Cabin.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12935, "/obj/structure/firepit", "/obj/structure", {
	active: 1,
	name: "firepit",
	desc: "warm and toasty",
	icon: rt.rsc("icons/obj/fireplace.dmi"),
	icon_state: "firepit-active",
	density: 0,
});

// /obj/structure/firepit/proc/Initialize  (code/modules/awaymissions/mission_code/Cabin.dm:11)
rt.def("/obj/structure/firepit/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "toggleFirepit", []);
	return f.dot;
});

// /obj/structure/firepit/proc/attack_hand  (code/modules/awaymissions/mission_code/Cabin.dm:17)  may sleep
rt.def("/obj/structure/firepit/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "active", 0);
		yield* g.srcCall(f, "toggleFirepit");
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/firepit/proc/attackby  (code/modules/awaymissions/mission_code/Cabin.dm:22)  may sleep
rt.def("/obj/structure/firepit/proc/attackby", function* attackby(f: Frame) {
	let msg: Value = null;
	f.vars = () => [msg];
	if (!truthy(rt.sv(f, "active"))) {
		if (truthy((msg = (yield* g.callName(f, live(f.args[0]), "ignition_effect", [live(f.src), live(f.args[1])]))))) {
			rt.setSv(f, "active", 1);
			yield* g.srcCall(f, "visible_message", live(msg));
			yield* g.srcCall(f, "toggleFirepit");
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	} else {
		yield* g.callName(f, live(f.args[0]), "fire_act", []);
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/firepit/proc/toggleFirepit  (code/modules/awaymissions/mission_code/Cabin.dm:35)
rt.def("/obj/structure/firepit/proc/toggleFirepit", function toggleFirepit(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		rt.callSrc(f, "set_light", [8]);
		rt.setSv(f, "icon_state", "firepit-active");
	} else {
		rt.callSrc(f, "set_light", [0]);
		rt.setSv(f, "icon_state", "firepit");
	}
	return f.dot;
});

// /obj/structure/firepit/proc/extinguish  (code/modules/awaymissions/mission_code/Cabin.dm:44)
rt.def("/obj/structure/firepit/proc/extinguish", function extinguish(f: Frame) {
	if (!truthy(rt.sv(f, "active"))) return f.dot;
	rt.setSv(f, "active", 0);
	rt.callSrc(f, "toggleFirepit", []);
	return f.dot;
});

// /obj/structure/firepit/proc/fire_act  (code/modules/awaymissions/mission_code/Cabin.dm:47)
rt.def("/obj/structure/firepit/proc/fire_act", function fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	if (truthy(rt.sv(f, "active"))) return f.dot;
	rt.setSv(f, "active", 1);
	rt.callSrc(f, "toggleFirepit", []);
	return f.dot;
});

rt.type(10816, "/obj/machinery/recycler/lumbermill", "/obj/machinery/recycler", {
	emagged: 2,
	item_recycle_sound: rt.rsc("sound/weapons/chainsawhit.ogg"),
	name: "lumbermill saw",
	desc: "Faster then the cartoons!",
});

// /obj/machinery/recycler/lumbermill/proc/recycle_item  (code/modules/awaymissions/mission_code/Cabin.dm:62)  may sleep
rt.def("/obj/machinery/recycler/lumbermill/proc/recycle_item", function* recycle_item(f: Frame) {
	let potency: Value = null;
	f.vars = () => [potency];
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/grown/log")) ? 1 : 0))) {
		return live(f.dot);
	} else {
		potency = rt.gv(f, "potency", rt.fv(f, "seed", live(f.args[0])));
		yield* g.callSuper(f, [], rt.Args.Same);
		yield* g.new_(f, rt.fv(f, "plank_type", live(f.args[0])), [rt.fv(f, "loc", live(f.src)), add(1, (yield* g.call(f, P("/proc/round"), null, [divide(live(potency), 25)])))]);
	}
	return f.dot;
}, true, { args: ["L"] });

rt.type(5071, "/mob/living/simple_animal/chicken/rabbit/normal", "/mob/living/simple_animal/chicken/rabbit", {
	icon_state: "b_rabbit",
	icon_living: "b_rabbit",
	icon_dead: "b_rabbit_dead",
	icon_prefix: "b_rabbit",
	minbodytemp: 0,
	eggsleft: 0,
	speak: null,
	egg_type: null,
});

// /mob/living/simple_animal/chicken/rabbit/normal/proc/<init>  (code/modules/awaymissions/mission_code/Cabin.dm:77)
rt.def("/mob/living/simple_animal/chicken/rabbit/normal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list());
	return f.dot;
});

rt.type(1868, "/datum/mapGenerator/snowy", "/datum/mapGenerator", {
	modules: null,
});

// /datum/mapGenerator/snowy/proc/<init>  (code/modules/awaymissions/mission_code/Cabin.dm:81)
rt.def("/datum/mapGenerator/snowy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomlayer/snow"), T("/datum/mapGeneratorModule/snow/pineTrees"), T("/datum/mapGeneratorModule/snow/deadTrees"), T("/datum/mapGeneratorModule/snow/randBushes"), T("/datum/mapGeneratorModule/snow/randIceRocks"), T("/datum/mapGeneratorModule/snow/bunnies")));
	return f.dot;
});

rt.type(1900, "/datum/mapGeneratorModule/snow", "/datum/mapGeneratorModule", {});

// /datum/mapGeneratorModule/snow/proc/checkPlaceAtom  (code/modules/awaymissions/mission_code/Cabin.dm:89)
rt.def("/datum/mapGeneratorModule/snow/proc/checkPlaceAtom", function checkPlaceAtom(f: Frame, _T: Value) {
	if (truthy((rt.istype(live(_T), T("/turf/open/floor/plating/asteroid/snow")) ? 1 : 0))) {
		return rt.callSuper(f, [live(_T)]);
	}
	return 0;
});

rt.type(1907, "/datum/mapGeneratorModule/bottomlayer/snow", "/datum/mapGeneratorModule/bottomlayer", {
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/bottomlayer/snow/proc/<init>  (code/modules/awaymissions/mission_code/Cabin.dm:94)
rt.def("/datum/mapGeneratorModule/bottomlayer/snow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf/open/floor/plating/asteroid/snow/atmosphere"), 100]));
	return f.dot;
});

rt.type(1901, "/datum/mapGeneratorModule/snow/pineTrees", "/datum/mapGeneratorModule/snow", {
	spawnableAtoms: null,
});

// /datum/mapGeneratorModule/snow/pineTrees/proc/<init>  (code/modules/awaymissions/mission_code/Cabin.dm:97)
rt.def("/datum/mapGeneratorModule/snow/pineTrees/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.alist(f, [T("/obj/structure/flora/tree/pine"), 30]));
	return f.dot;
});

rt.type(1902, "/datum/mapGeneratorModule/snow/deadTrees", "/datum/mapGeneratorModule/snow", {
	spawnableAtoms: null,
});

// /datum/mapGeneratorModule/snow/deadTrees/proc/<init>  (code/modules/awaymissions/mission_code/Cabin.dm:100)
rt.def("/datum/mapGeneratorModule/snow/deadTrees/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.alist(f, [T("/obj/structure/flora/tree/dead"), 10]));
	return f.dot;
});

rt.type(1903, "/datum/mapGeneratorModule/snow/randBushes", "/datum/mapGeneratorModule/snow", {
	spawnableAtoms: null,
});

// /datum/mapGeneratorModule/snow/randBushes/proc/<init>  (code/modules/awaymissions/mission_code/Cabin.dm:103)
rt.def("/datum/mapGeneratorModule/snow/randBushes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.list());
	return f.dot;
});

// /datum/mapGeneratorModule/snow/randBushes/proc/New  (code/modules/awaymissions/mission_code/Cabin.dm:106)
rt.def("/datum/mapGeneratorModule/snow/randBushes/proc/New", function New(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "spawnableAtoms", rt.call(f, P("/proc/typesof"), null, [T("/obj/structure/flora/ausbushes")]));
	i = null;
	rt.forList(f, 0, rt.sv(f, "spawnableAtoms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.setAt(rt.sv(f, "spawnableAtoms"), live(i), 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(1904, "/datum/mapGeneratorModule/snow/bunnies", "/datum/mapGeneratorModule/snow", {
	spawnableAtoms: null,
});

// /datum/mapGeneratorModule/snow/bunnies/proc/<init>  (code/modules/awaymissions/mission_code/Cabin.dm:113)
rt.def("/datum/mapGeneratorModule/snow/bunnies/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.alist(f, [T("/mob/living/simple_animal/chicken/rabbit"), 0.5]));
	return f.dot;
});

rt.type(1905, "/datum/mapGeneratorModule/snow/randIceRocks", "/datum/mapGeneratorModule/snow", {
	spawnableAtoms: null,
});

// /datum/mapGeneratorModule/snow/randIceRocks/proc/<init>  (code/modules/awaymissions/mission_code/Cabin.dm:116)
rt.def("/datum/mapGeneratorModule/snow/randIceRocks/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.alist(f, [T("/obj/structure/flora/rock/icy"), 5, T("/obj/structure/flora/rock/pile/icy"), 5]));
	return f.dot;
});
