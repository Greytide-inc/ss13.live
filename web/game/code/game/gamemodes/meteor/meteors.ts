// From code/game/gamemodes/meteor/meteors.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalmeteor_wave_delay  (code/game/gamemodes/meteor/meteors.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteor_wave_delay", function InitGlobalmeteor_wave_delay(f: Frame) {
	rt.setGl("meteor_wave_delay", 625);
	rt.modSrcVar(f, "gvars_datum_init_order", "meteor_wave_delay", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmeteors_normal  (code/game/gamemodes/meteor/meteors.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteors_normal", function InitGlobalmeteors_normal(f: Frame) {
	rt.setGl("meteors_normal", rt.alist(f, [T("/obj/effect/meteor/dust"), 3, T("/obj/effect/meteor/medium"), 8, T("/obj/effect/meteor/big"), 3, T("/obj/effect/meteor/flaming"), 1, T("/obj/effect/meteor/irradiated"), 3]));
	rt.modSrcVar(f, "gvars_datum_init_order", "meteors_normal", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmeteors_threatening  (code/game/gamemodes/meteor/meteors.dm:9)
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteors_threatening", function InitGlobalmeteors_threatening(f: Frame) {
	rt.setGl("meteors_threatening", rt.alist(f, [T("/obj/effect/meteor/medium"), 4, T("/obj/effect/meteor/big"), 8, T("/obj/effect/meteor/flaming"), 3, T("/obj/effect/meteor/irradiated"), 3]));
	rt.modSrcVar(f, "gvars_datum_init_order", "meteors_threatening", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmeteors_catastrophic  (code/game/gamemodes/meteor/meteors.dm:12)
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteors_catastrophic", function InitGlobalmeteors_catastrophic(f: Frame) {
	rt.setGl("meteors_catastrophic", rt.alist(f, [T("/obj/effect/meteor/medium"), 5, T("/obj/effect/meteor/big"), 75, T("/obj/effect/meteor/flaming"), 10, T("/obj/effect/meteor/irradiated"), 10, T("/obj/effect/meteor/tunguska"), 1]));
	rt.modSrcVar(f, "gvars_datum_init_order", "meteors_catastrophic", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmeteorsB  (code/game/gamemodes/meteor/meteors.dm:15)
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteorsB", function InitGlobalmeteorsB(f: Frame) {
	rt.setGl("meteorsB", rt.alist(f, [T("/obj/effect/meteor/meaty"), 5, T("/obj/effect/meteor/meaty/xeno"), 1]));
	rt.modSrcVar(f, "gvars_datum_init_order", "meteorsB", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmeteorsC  (code/game/gamemodes/meteor/meteors.dm:17)
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteorsC", function InitGlobalmeteorsC(f: Frame) {
	rt.setGl("meteorsC", rt.list(T("/obj/effect/meteor/dust")));
	rt.modSrcVar(f, "gvars_datum_init_order", "meteorsC", add);
	return f.dot;
});

// /proc/spawn_meteors  (code/game/gamemodes/meteor/meteors.dm:25)  may sleep
rt.def("/proc/spawn_meteors", function* spawn_meteors(f: Frame, number: Value, meteortypes: Value) {
	let i: Value = null;
	f.vars = () => [number, meteortypes, i];
	if (live(number) === null) {
		number = 10;
	}
	i = null;
	i = 0;
	while (rt.lt(live(i), live(number))) {
		yield* g.call(f, P("/proc/spawn_meteor"), null, [live(meteortypes)]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

// /proc/spawn_meteor  (code/game/gamemodes/meteor/meteors.dm:32)  may sleep
rt.def("/proc/spawn_meteor", function* spawn_meteor(f: Frame, meteortypes: Value) {
	let pickedstart: Value = null, pickedgoal: Value = null, max_i: Value = null, startSide: Value = null, Me: Value = null, M: Value = null;
	f.vars = () => [meteortypes, pickedstart, pickedgoal, max_i, startSide, Me, M];
	pickedstart = null;
	pickedgoal = null;
	max_i = 10;
	while (!truthy((rt.istype(live(pickedstart), T("/turf/open/space")) ? 1 : 0))) {
		pickedstart = (yield* g.call(f, P("/proc/spaceDebrisStartLoc"), null, [(startSide = rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])), 2]));
		pickedgoal = (yield* g.call(f, P("/proc/spaceDebrisFinishLoc"), null, [live(startSide), 2]));
		max_i = rt.inc(live(max_i), -1);
		if (rt.le(live(max_i), 0)) {
			return live(f.dot);
		}
	}
	Me = (yield* g.call(f, P("/proc/pickweight"), null, [live(meteortypes)]));
	rt.setFv(f, "dest", (M = (yield* g.new_(f, live(Me), [live(pickedstart)]))), live(pickedgoal));
	rt.setFv(f, "z_original", live(M), 2);
	rt.spawnTail(f, 0, "/proc/spawn_meteor: spawn at game/gamemodes/meteor/meteors.dm:43", meteortypes, pickedstart, pickedgoal, max_i, startSide, Me, M);
	return f.dot;
}, true);

// a spawn(0) body of /proc/spawn_meteor, a named tail so a world snapshot can hold it while it waits.
rt.tail("/proc/spawn_meteor: spawn at game/gamemodes/meteor/meteors.dm:43", function* (f: Frame, meteortypes: Value, pickedstart: Value, pickedgoal: Value, max_i: Value, startSide: Value, Me: Value, M: Value) {
	f.vars = () => [meteortypes, pickedstart, pickedgoal, max_i, startSide, Me, M];
	yield* g.call(f, P("/proc/walk_towards"), null, [live(M), rt.fv(f, "dest", live(M)), 1]);
	return null;
});

// /proc/spaceDebrisStartLoc  (code/game/gamemodes/meteor/meteors.dm:49)
rt.def("/proc/spaceDebrisStartLoc", function spaceDebrisStartLoc(f: Frame, startSide: Value, Z: Value) {
	let starty: Value = null, startx: Value = null;
	let $0: any;
	f.vars = () => [starty, startx, $0];
	starty = null;
	startx = null;
	$0 = live(startSide);
	if ($0 === 1) {
		starty = subtract(rt.fv(f, "maxy", rt.world()), 8);
		startx = rt.call(f, P("/proc/rand"), null, [8, subtract(rt.fv(f, "maxx", rt.world()), 8)]);
	} else if ($0 === 4) {
		starty = rt.call(f, P("/proc/rand"), null, [8, subtract(rt.fv(f, "maxy", rt.world()), 8)]);
		startx = subtract(rt.fv(f, "maxx", rt.world()), 8);
	} else if ($0 === 2) {
		starty = 8;
		startx = rt.call(f, P("/proc/rand"), null, [8, subtract(rt.fv(f, "maxx", rt.world()), 8)]);
	} else if ($0 === 8) {
		starty = rt.call(f, P("/proc/rand"), null, [8, subtract(rt.fv(f, "maxy", rt.world()), 8)]);
		startx = 8;
	}
	f.dot = rt.locate(live(startx), live(starty), live(Z));
	return f.dot;
});

// /proc/spaceDebrisFinishLoc  (code/game/gamemodes/meteor/meteors.dm:67)
rt.def("/proc/spaceDebrisFinishLoc", function spaceDebrisFinishLoc(f: Frame, startSide: Value, Z: Value) {
	let endy: Value = null, endx: Value = null;
	let $0: any;
	f.vars = () => [endy, endx, $0];
	endy = null;
	endx = null;
	$0 = live(startSide);
	if ($0 === 1) {
		endy = 8;
		endx = rt.call(f, P("/proc/rand"), null, [8, subtract(rt.fv(f, "maxx", rt.world()), 8)]);
	} else if ($0 === 4) {
		endy = rt.call(f, P("/proc/rand"), null, [8, subtract(rt.fv(f, "maxy", rt.world()), 8)]);
		endx = 8;
	} else if ($0 === 2) {
		endy = subtract(rt.fv(f, "maxy", rt.world()), 8);
		endx = rt.call(f, P("/proc/rand"), null, [8, subtract(rt.fv(f, "maxx", rt.world()), 8)]);
	} else if ($0 === 8) {
		endy = rt.call(f, P("/proc/rand"), null, [8, subtract(rt.fv(f, "maxy", rt.world()), 8)]);
		endx = subtract(rt.fv(f, "maxx", rt.world()), 8);
	}
	f.dot = rt.locate(live(endx), live(endy), live(Z));
	return f.dot;
});

rt.type(11438, "/obj/effect/meteor", "/obj/effect", {
	hits: 4,
	hitpwr: 2,
	dest: null,
	heavy: 0,
	meteorsound: rt.rsc("sound/effects/meteorimpact.ogg"),
	z_original: 2,
	threat: 0,
	lifetime: 1800,
	meteordrop: null,
	dropamt: 2,
	anchored: 1,
	pass_flags: 1,
	name: "the concept of meteor",
	desc: "You should probably run instead of gawking at this.",
	icon: rt.rsc("icons/obj/meteor.dmi"),
	icon_state: "small",
	density: 1,
});

// /obj/effect/meteor/proc/<init>  (code/game/gamemodes/meteor/meteors.dm:103)
rt.def("/obj/effect/meteor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "meteordrop", rt.list(T("/obj/item/weapon/ore/iron")));
	return f.dot;
});

// /obj/effect/meteor/proc/Move  (code/game/gamemodes/meteor/meteors.dm:107)  may sleep
rt.def("/obj/effect/meteor/proc/Move", function* Move(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if ((!isEqual(rt.sv(f, "z"), rt.sv(f, "z_original")) || isEqual(rt.sv(f, "loc"), rt.sv(f, "dest")))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "ram_turf", (_T = rt.getStep(f, rt.sv(f, "loc"), 0)));
	if (!(truthy(rt.op(f, "Prob", [], [10])) && !truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)))) return f.dot;
	yield* g.srcCall(f, "get_hit");
	return f.dot;
}, true);

// /obj/effect/meteor/proc/Destroy  (code/game/gamemodes/meteor/meteors.dm:121)  may sleep
rt.def("/obj/effect/meteor/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("meteor_list", live(f.src), subtract));
	yield* g.call(f, P("/proc/walk"), null, [live(f.src), 0]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/effect/meteor/proc/New  (code/game/gamemodes/meteor/meteors.dm:126)  may sleep
rt.def("/obj/effect/meteor/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("meteor_list", live(f.src), add);
	if (truthy(rt.gl("SSaugury"))) {
		yield* g.callName(f, rt.gl("SSaugury"), "register_doom", [live(f.src), rt.sv(f, "threat")]);
	}
	yield* g.srcCall(f, "SpinAnimation");
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), rt.sv(f, "lifetime"), 8]);
	return f.dot;
}, true);

// /obj/effect/meteor/proc/Bump  (code/game/gamemodes/meteor/meteors.dm:135)  may sleep
rt.def("/obj/effect/meteor/proc/Bump", function* Bump(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy(live(A))) return f.dot;
	yield* g.srcCall(f, "ram_turf", rt.getStep(f, live(A), 0));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.sv(f, "meteorsound"), 40, 1]);
	yield* g.srcCall(f, "get_hit");
	return f.dot;
}, true);

// /obj/effect/meteor/proc/ram_turf  (code/game/gamemodes/meteor/meteors.dm:141)
rt.def("/obj/effect/meteor/proc/ram_turf", function ram_turf(f: Frame, _T: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, live(_T), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (!isEqual(live(A), live(f.src))) {
			if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
				rt.callName(f, live(A), "visible_message", [fmt("<span class='warning'>＀ slams into ＀.</span>", [live(f.src), live(A)]), fmt("<span class='userdanger'>＀ slams into you!.</span>", [live(f.src)])]);
			}
			rt.callName(f, live(A), "ex_act", [rt.sv(f, "hitpwr")]);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(_T))) return f.dot;
	rt.callName(f, live(_T), "ex_act", [rt.sv(f, "hitpwr")]);
	return f.dot;
});

// /obj/effect/meteor/proc/get_hit  (code/game/gamemodes/meteor/meteors.dm:156)  may sleep
rt.def("/obj/effect/meteor/proc/get_hit", function* get_hit(f: Frame) {
	rt.incSrcVar(f, "hits", -1, true);
	if (!rt.le(rt.sv(f, "hits"), 0)) return f.dot;
	yield* g.srcCall(f, "make_debris");
	yield* g.srcCall(f, "meteor_effect");
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/effect/meteor/proc/examine  (code/game/gamemodes/meteor/meteors.dm:168)
rt.def("/obj/effect/meteor/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["user"] });

// /obj/effect/meteor/proc/attackby  (code/game/gamemodes/meteor/meteors.dm:175)  may sleep
rt.def("/obj/effect/meteor/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pickaxe")) ? 1 : 0))) {
		yield* g.srcCall(f, "make_debris");
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/effect/meteor/proc/make_debris  (code/game/gamemodes/meteor/meteors.dm:182)  may sleep
rt.def("/obj/effect/meteor/proc/make_debris", function* make_debris(f: Frame) {
	let throws: Value = null, thing_to_spawn: Value = null;
	f.vars = () => [throws, thing_to_spawn];
	throws = null;
	throws = rt.sv(f, "dropamt");
	while (rt.gt(live(throws), 0)) {
		thing_to_spawn = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "meteordrop")]);
		yield* g.new_(f, live(thing_to_spawn), [rt.getStep(f, live(f.src), 0)]);
		throws = rt.inc(live(throws), -1);
	}
	return f.dot;
}, true);

// /obj/effect/meteor/proc/meteor_effect  (code/game/gamemodes/meteor/meteors.dm:188)
rt.def("/obj/effect/meteor/proc/meteor_effect", function meteor_effect(f: Frame) {
	let M: Value = null, _T: Value = null, dist: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [M, _T, dist, $0, $1, $2, $e];
	if (!truthy(rt.sv(f, "heavy"))) return f.dot;
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy(rt.fv(f, "orbiting", live(M))) && truthy(rt.index(rt.fv(f, "watchers", rt.gl("SSaugury")), live(M))))) {
			continue;
		}
		if ((!truthy((_T = rt.getStep(f, live(M), 0))) || !isEqual(rt.fv(f, "z", live(_T)), rt.fv(f, "z", live(f.src))))) {
			continue;
		}
		dist = rt.call(f, P("/proc/get_dist"), null, [rt.fv(f, "loc", live(M)), rt.fv(f, "loc", live(f.src))]);
		$0 = live(M);
		if (rt.gt(live(dist), 20)) {
			$1 = 2;
		} else {
			$1 = 4;
		}
		if (rt.gt(live(dist), 20)) {
			$2 = 1;
		} else {
			$2 = 3;
		}
		rt.call(f, P("/proc/shake_camera"), null, [$0, $1, $2]);
		rt.callName(f, live(M), "playsound_local", [rt.fv(f, "loc", live(f.src)), rt.sv(f, "meteorsound"), 50, 1, rt.call(f, P("/proc/get_rand_frequency"), null, []), 10]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(11439, "/obj/effect/meteor/dust", "/obj/effect/meteor", {
	pass_flags: 5,
	hits: 1,
	hitpwr: 3,
	meteorsound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	meteordrop: null,
	threat: 1,
	name: "space dust",
	icon_state: "dust",
});

// /obj/effect/meteor/dust/proc/<init>  (code/game/gamemodes/meteor/meteors.dm:210)
rt.def("/obj/effect/meteor/dust/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "meteordrop", rt.list(T("/obj/item/weapon/ore/glass")));
	return f.dot;
});

rt.type(11440, "/obj/effect/meteor/medium", "/obj/effect/meteor", {
	dropamt: 3,
	threat: 5,
	name: "meteor",
});

// /obj/effect/meteor/medium/proc/meteor_effect  (code/game/gamemodes/meteor/meteors.dm:220)
rt.def("/obj/effect/meteor/medium/proc/meteor_effect", function meteor_effect(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), 0, 1, 2, 3, 0]);
	return f.dot;
});

rt.type(11441, "/obj/effect/meteor/big", "/obj/effect/meteor", {
	hits: 6,
	heavy: 1,
	dropamt: 4,
	threat: 10,
	name: "big meteor",
	icon_state: "large",
});

// /obj/effect/meteor/big/proc/meteor_effect  (code/game/gamemodes/meteor/meteors.dm:233)
rt.def("/obj/effect/meteor/big/proc/meteor_effect", function meteor_effect(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), 1, 2, 3, 4, 0]);
	return f.dot;
});

rt.type(11442, "/obj/effect/meteor/flaming", "/obj/effect/meteor", {
	hits: 5,
	heavy: 1,
	meteorsound: rt.rsc("sound/effects/bamf.ogg"),
	meteordrop: null,
	threat: 20,
	name: "flaming meteor",
	icon_state: "flaming",
});

// /obj/effect/meteor/flaming/proc/<init>  (code/game/gamemodes/meteor/meteors.dm:243)
rt.def("/obj/effect/meteor/flaming/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "meteordrop", rt.list(T("/obj/item/weapon/ore/plasma")));
	return f.dot;
});

// /obj/effect/meteor/flaming/proc/meteor_effect  (code/game/gamemodes/meteor/meteors.dm:247)
rt.def("/obj/effect/meteor/flaming/proc/meteor_effect", function meteor_effect(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), 1, 2, 3, 4, 0, 0, 5]);
	return f.dot;
});

rt.type(11443, "/obj/effect/meteor/irradiated", "/obj/effect/meteor", {
	heavy: 1,
	meteordrop: null,
	threat: 15,
	name: "glowing meteor",
	icon_state: "glowing",
});

// /obj/effect/meteor/irradiated/proc/<init>  (code/game/gamemodes/meteor/meteors.dm:255)
rt.def("/obj/effect/meteor/irradiated/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "meteordrop", rt.list(T("/obj/item/weapon/ore/uranium")));
	return f.dot;
});

// /obj/effect/meteor/irradiated/proc/meteor_effect  (code/game/gamemodes/meteor/meteors.dm:260)  may sleep
rt.def("/obj/effect/meteor/irradiated/proc/meteor_effect", function* meteor_effect(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), 0, 0, 4, 3, 0]);
	yield* g.new_(f, T("/obj/effect/decal/cleanable/greenglow"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.src), 0), 2, 5, 50, 1]);
	return f.dot;
}, true);

rt.type(11444, "/obj/effect/meteor/meaty", "/obj/effect/meteor", {
	meteorgibs: rt.typePath("/obj/effect/gibspawner/generic"),
	hits: 2,
	heavy: 1,
	meteorsound: rt.rsc("sound/effects/blobattack.ogg"),
	meteordrop: null,
	threat: 2,
	name: "meaty ore",
	icon_state: "meateor",
	desc: "Just... don't think too hard about where this thing came from.",
});

// /obj/effect/meteor/meaty/proc/<init>  (code/game/gamemodes/meteor/meteors.dm:273)
rt.def("/obj/effect/meteor/meaty/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "meteordrop", rt.list(T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human"), T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant"), T("/obj/item/organ/heart"), T("/obj/item/organ/lungs"), T("/obj/item/organ/tongue"), T("/obj/item/organ/appendix")));
	return f.dot;
});

// /obj/effect/meteor/meaty/proc/New  (code/game/gamemodes/meteor/meteors.dm:278)  may sleep
rt.def("/obj/effect/meteor/meaty/proc/New", function* New(f: Frame) {
	let path: Value = null;
	let $e: any;
	f.vars = () => [path, $e];
	path = null;
	rt.forList(f, 0, rt.sv(f, "meteordrop"));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		if (isEqual(live(path), T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant"))) {
			(rt.modSrcVar(f, "meteordrop", live(path), subtract));
			rt.modSrcVar(f, "meteordrop", rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [live(path)])), live(path))]), add);
		}
	}
	rt.endFor(f, 0);
	path = null;
	rt.forList(f, 0, rt.sv(f, "meteordrop"));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		if (isEqual(live(path), T("/obj/item/organ/tongue"))) {
			(rt.modSrcVar(f, "meteordrop", live(path), subtract));
			rt.modSrcVar(f, "meteordrop", rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/typesof"), null, [live(path)]))]), add);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/effect/meteor/meaty/proc/make_debris  (code/game/gamemodes/meteor/meteors.dm:290)  may sleep
rt.def("/obj/effect/meteor/meaty/proc/make_debris", function* make_debris(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, rt.sv(f, "meteorgibs"), [rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true);

// /obj/effect/meteor/meaty/proc/ram_turf  (code/game/gamemodes/meteor/meteors.dm:295)  may sleep
rt.def("/obj/effect/meteor/meaty/proc/ram_turf", function* ram_turf(f: Frame, _T: Value) {
	f.vars = () => [_T];
	if (truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) return f.dot;
	yield* g.new_(f, T("/obj/effect/decal/cleanable/blood"), [live(_T)]);
	return f.dot;
}, true);

// /obj/effect/meteor/meaty/proc/Bump  (code/game/gamemodes/meteor/meteors.dm:299)  may sleep
rt.def("/obj/effect/meteor/meaty/proc/Bump", function* Bump(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "ex_act", [rt.sv(f, "hitpwr")]);
	yield* g.srcCall(f, "get_hit");
	return f.dot;
}, true);

rt.type(11445, "/obj/effect/meteor/meaty/xeno", "/obj/effect/meteor/meaty", {
	meteordrop: null,
	color: "#5EFF00",
	meteorgibs: rt.typePath("/obj/effect/gibspawner/xeno"),
});

// /obj/effect/meteor/meaty/xeno/proc/<init>  (code/game/gamemodes/meteor/meteors.dm:305)
rt.def("/obj/effect/meteor/meaty/xeno/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "meteordrop", rt.list(T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), T("/obj/item/organ/tongue/alien")));
	return f.dot;
});

// /obj/effect/meteor/meaty/xeno/proc/New  (code/game/gamemodes/meteor/meteors.dm:309)  may sleep
rt.def("/obj/effect/meteor/meaty/xeno/proc/New", function* New(f: Frame) {
	rt.modSrcVar(f, "meteordrop", subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/organ/alien")])), T("/obj/item/organ/alien")), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/effect/meteor/meaty/xeno/proc/ram_turf  (code/game/gamemodes/meteor/meteors.dm:313)  may sleep
rt.def("/obj/effect/meteor/meaty/xeno/proc/ram_turf", function* ram_turf(f: Frame, _T: Value) {
	f.vars = () => [_T];
	if (truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) return f.dot;
	yield* g.new_(f, T("/obj/effect/decal/cleanable/xenoblood"), [live(_T)]);
	return f.dot;
}, true);

rt.type(11446, "/obj/effect/meteor/tunguska", "/obj/effect/meteor", {
	hits: 30,
	hitpwr: 1,
	heavy: 1,
	meteorsound: rt.rsc("sound/effects/bamf.ogg"),
	meteordrop: null,
	threat: 50,
	name: "tunguska meteor",
	icon_state: "flaming",
	desc: "Your life briefly passes before your eyes the moment you lay them on this monstrosity.",
});

// /obj/effect/meteor/tunguska/proc/<init>  (code/game/gamemodes/meteor/meteors.dm:325)
rt.def("/obj/effect/meteor/tunguska/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "meteordrop", rt.list(T("/obj/item/weapon/ore/plasma")));
	return f.dot;
});

// /obj/effect/meteor/tunguska/proc/Move  (code/game/gamemodes/meteor/meteors.dm:329)  may sleep
rt.def("/obj/effect/meteor/tunguska/proc/Move", function* Move(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true);

// /obj/effect/meteor/tunguska/proc/meteor_effect  (code/game/gamemodes/meteor/meteors.dm:334)
rt.def("/obj/effect/meteor/tunguska/proc/meteor_effect", function meteor_effect(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), 5, 10, 15, 20, 0]);
	return f.dot;
});

// /obj/effect/meteor/tunguska/proc/Bump  (code/game/gamemodes/meteor/meteors.dm:338)  may sleep
rt.def("/obj/effect/meteor/tunguska/proc/Bump", function* Bump(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.op(f, "Prob", [], [20]))) return f.dot;
	yield* g.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), 2, 4, 6, 8]);
	return f.dot;
}, true);

// /datum/controller/global_vars/proc/InitGlobalmeteorsSPOOKY  (code/game/gamemodes/meteor/meteors.dm:346)
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteorsSPOOKY", function InitGlobalmeteorsSPOOKY(f: Frame) {
	rt.setGl("meteorsSPOOKY", rt.list(T("/obj/effect/meteor/pumpkin")));
	rt.modSrcVar(f, "gvars_datum_init_order", "meteorsSPOOKY", add);
	return f.dot;
});

rt.type(11447, "/obj/effect/meteor/pumpkin", "/obj/effect/meteor", {
	hits: 10,
	heavy: 1,
	dropamt: 1,
	meteordrop: null,
	threat: 100,
	name: "PUMPKING",
	desc: "THE PUMPKING'S COMING!",
	icon: rt.rsc("icons/obj/meteor_spooky.dmi"),
	icon_state: "pumpkin",
});

// /obj/effect/meteor/pumpkin/proc/<init>  (code/game/gamemodes/meteor/meteors.dm:356)
rt.def("/obj/effect/meteor/pumpkin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "meteordrop", rt.list(T("/obj/item/clothing/head/hardhat/pumpkinhead"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/pumpkin")));
	return f.dot;
});

// /obj/effect/meteor/pumpkin/proc/New  (code/game/gamemodes/meteor/meteors.dm:360)  may sleep
rt.def("/obj/effect/meteor/pumpkin/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "meteorsound", rt.op(f, "PickUnweighted", [2], [rt.rsc("sound/hallucinations/im_here1.ogg"), rt.rsc("sound/hallucinations/im_here2.ogg")]));
	return f.dot;
}, true);
