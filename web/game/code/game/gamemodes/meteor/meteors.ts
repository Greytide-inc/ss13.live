// Based on /tg/station's code/game/gamemodes/meteor/meteors.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// meteors.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteor_wave_delay", function InitGlobalmeteor_wave_delay(f: Frame) {
	GLOB.meteor_wave_delay = 625;
	this.gvars_datum_init_order += "meteor_wave_delay";
	return f.dot;
});

// meteors.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteors_normal", function InitGlobalmeteors_normal(f: Frame) {
	GLOB.meteors_normal = rt.alist(f, [T("/obj/effect/meteor/dust"), 3, T("/obj/effect/meteor/medium"), 8, T("/obj/effect/meteor/big"), 3, T("/obj/effect/meteor/flaming"), 1, T("/obj/effect/meteor/irradiated"), 3]);
	this.gvars_datum_init_order += "meteors_normal";
	return f.dot;
});

// meteors.dm:9
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteors_threatening", function InitGlobalmeteors_threatening(f: Frame) {
	GLOB.meteors_threatening = rt.alist(f, [T("/obj/effect/meteor/medium"), 4, T("/obj/effect/meteor/big"), 8, T("/obj/effect/meteor/flaming"), 3, T("/obj/effect/meteor/irradiated"), 3]);
	this.gvars_datum_init_order += "meteors_threatening";
	return f.dot;
});

// meteors.dm:12
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteors_catastrophic", function InitGlobalmeteors_catastrophic(f: Frame) {
	GLOB.meteors_catastrophic = rt.alist(f, [T("/obj/effect/meteor/medium"), 5, T("/obj/effect/meteor/big"), 75, T("/obj/effect/meteor/flaming"), 10, T("/obj/effect/meteor/irradiated"), 10, T("/obj/effect/meteor/tunguska"), 1]);
	this.gvars_datum_init_order += "meteors_catastrophic";
	return f.dot;
});

// meteors.dm:15
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteorsB", function InitGlobalmeteorsB(f: Frame) {
	GLOB.meteorsB = rt.alist(f, [T("/obj/effect/meteor/meaty"), 5, T("/obj/effect/meteor/meaty/xeno"), 1]);
	this.gvars_datum_init_order += "meteorsB";
	return f.dot;
});

// meteors.dm:17
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteorsC", function InitGlobalmeteorsC(f: Frame) {
	GLOB.meteorsC = list(T("/obj/effect/meteor/dust"));
	this.gvars_datum_init_order += "meteorsC";
	return f.dot;
});

// meteors.dm:25
rt.def("/proc/spawn_meteors", function* spawn_meteors(f: Frame, number: Value, meteortypes: Value) {
	number ??= 10;
	let i: Value = 0;
	while (i < number) {
		yield* spawn_meteor(meteortypes);
		i++;
	}
	return f.dot;
}, true);

// meteors.dm:32
rt.def("/proc/spawn_meteor", function* spawn_meteor(f: Frame, meteortypes: Value) {
	let pickedstart: Value = null, pickedgoal: Value = null, startSide: Value = null, M: Value = null;
	let max_i: Value = 10;
	while (!rt.istype(pickedstart, T("/turf/open/space"))) {
		pickedstart = spaceDebrisStartLoc((startSide = pick(GLOB.cardinal)), ZLEVEL_STATION);
		pickedgoal = spaceDebrisFinishLoc(startSide, ZLEVEL_STATION);
		max_i--;
		if (max_i <= 0) {
			return f.dot;
		}
	}
	let Me: Value = pickweight(meteortypes);
	(M = (yield* new_(Me, pickedstart))).dest = pickedgoal;
	M.z_original = ZLEVEL_STATION;
	rt.spawnTail(f, 0, "/proc/spawn_meteor: spawn at game/gamemodes/meteor/meteors.dm:43", meteortypes, pickedstart, pickedgoal, max_i, startSide, Me, M);
	return f.dot;
}, true);

// a spawn(0) body of /proc/spawn_meteor, a named tail so a world snapshot can hold it while it waits.
rt.tail("/proc/spawn_meteor: spawn at game/gamemodes/meteor/meteors.dm:43", function* (f: Frame, meteortypes: Value, pickedstart: Value, pickedgoal: Value, max_i: Value, startSide: Value, Me: Value, M: Value) {
	walk_towards(M, M.dest, 1);
	return null;
});

// meteors.dm:49
rt.def("/proc/spaceDebrisStartLoc", function spaceDebrisStartLoc(f: Frame, startSide: Value, Z: Value) {
	let starty: Value = null, startx: Value = null;
	if (startSide === 1) {
		starty = rt.world().maxy - 8;
		startx = rand(8, rt.world().maxx - 8);
	} else if (startSide === 4) {
		starty = rand(8, rt.world().maxy - 8);
		startx = rt.world().maxx - 8;
	} else if (startSide === 2) {
		starty = 8;
		startx = rand(8, rt.world().maxx - 8);
	} else if (startSide === 8) {
		starty = rand(8, rt.world().maxy - 8);
		startx = 8;
	}
	f.dot = rt.locate(startx, starty, Z);
	return f.dot;
});

// meteors.dm:67
rt.def("/proc/spaceDebrisFinishLoc", function spaceDebrisFinishLoc(f: Frame, startSide: Value, Z: Value) {
	let endy: Value = null, endx: Value = null;
	if (startSide === 1) {
		endy = 8;
		endx = rand(8, rt.world().maxx - 8);
	} else if (startSide === 4) {
		endy = rand(8, rt.world().maxy - 8);
		endx = 8;
	} else if (startSide === 2) {
		endy = rt.world().maxy - 8;
		endx = rand(8, rt.world().maxx - 8);
	} else if (startSide === 8) {
		endy = rand(8, rt.world().maxy - 8);
		endx = rt.world().maxx - 8;
	}
	f.dot = rt.locate(endx, endy, Z);
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

// meteors.dm:103
rt.def("/obj/effect/meteor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.meteordrop = list(T("/obj/item/weapon/ore/iron"));
	return f.dot;
});

// meteors.dm:107
rt.def("/obj/effect/meteor/proc/Move", function* Move(f: Frame) {
	let _T: Value = null;
	if (this.z != this.z_original || this.loc == this.dest) {
		yield* qdel(this);
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.ram_turf((_T = rt.getStep(f, this.loc, 0)));
	if (!(prob(10) && !rt.istype(_T, T("/turf/open/space")))) return f.dot;
	yield* this.get_hit();
	return f.dot;
}, true);

// meteors.dm:121
rt.def("/obj/effect/meteor/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.meteor_list -= this;
	walk(this, 0);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// meteors.dm:126
rt.def("/obj/effect/meteor/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	GLOB.meteor_list += this;
	if (GLOB.SSaugury) {
		GLOB.SSaugury.register_doom(this, this.threat);
	}
	this.SpinAnimation();
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), this.lifetime, 8);
	return f.dot;
}, true);

// meteors.dm:135
rt.def("/obj/effect/meteor/proc/Bump", function* Bump(f: Frame, A: Value) {
	if (!A) return f.dot;
	yield* this.ram_turf(rt.getStep(f, A, 0));
	playsound(this.loc, this.meteorsound, 40, 1);
	yield* this.get_hit();
	return f.dot;
}, true);

// meteors.dm:141
rt.def("/obj/effect/meteor/proc/ram_turf", function ram_turf(f: Frame, _T: Value) {
	let A: Value = null;
	for (A of each(_T, T("/atom"))) {
		if (A != this) {
			if (rt.istype(A, T("/mob/living"))) {
				A.visible_message(`<span class='warning'>${this} slams into ${A}.</span>`, `<span class='userdanger'>${this} slams into you!.</span>`);
			}
			A.ex_act(this.hitpwr);
		}
	}
	if (!_T) return f.dot;
	_T.ex_act(this.hitpwr);
	return f.dot;
});

// meteors.dm:156
rt.def("/obj/effect/meteor/proc/get_hit", function* get_hit(f: Frame) {
	this.hits--;
	if (!(this.hits <= 0)) return f.dot;
	yield* this.make_debris();
	yield* this.meteor_effect();
	yield* qdel(this);
	return f.dot;
}, true);

// meteors.dm:168
rt.def("/obj/effect/meteor/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	return f.dot;
}, false);

// meteors.dm:175
rt.def("/obj/effect/meteor/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/pickaxe"))) {
		yield* this.make_debris();
		yield* qdel(this);
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// meteors.dm:182
rt.def("/obj/effect/meteor/proc/make_debris", function* make_debris(f: Frame) {
	let thing_to_spawn: Value = null;
	let throws: Value = this.dropamt;
	while (throws > 0) {
		thing_to_spawn = pick(this.meteordrop);
		yield* new_(thing_to_spawn, rt.getStep(f, this, 0));
		throws--;
	}
	return f.dot;
}, true);

// meteors.dm:188
rt.def("/obj/effect/meteor/proc/meteor_effect", function meteor_effect(f: Frame) {
	let M: Value = null, _T: Value = null, dist: Value = null;
	let $e: any;
	if (!this.heavy) return f.dot;
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (M.orbiting && rt.index(GLOB.SSaugury.watchers, M)) {
			continue;
		}
		if (!(_T = rt.getStep(f, M, 0)) || _T.z != this.z) {
			continue;
		}
		dist = get_dist(M.loc, this.loc);
		shake_camera(M, dist > 20 ? 2 : 4, dist > 20 ? 1 : 3);
		M.playsound_local(this.loc, this.meteorsound, 50, 1, get_rand_frequency(), 10);
	}
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

// meteors.dm:210
rt.def("/obj/effect/meteor/dust/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.meteordrop = list(T("/obj/item/weapon/ore/glass"));
	return f.dot;
});

rt.type(11440, "/obj/effect/meteor/medium", "/obj/effect/meteor", {
	dropamt: 3,
	threat: 5,
	name: "meteor",
});

// meteors.dm:220
rt.def("/obj/effect/meteor/medium/proc/meteor_effect", function meteor_effect(f: Frame) {
	parent_proc();
	explosion(this.loc, 0, 1, 2, 3, 0);
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

// meteors.dm:233
rt.def("/obj/effect/meteor/big/proc/meteor_effect", function meteor_effect(f: Frame) {
	parent_proc();
	explosion(this.loc, 1, 2, 3, 4, 0);
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

// meteors.dm:243
rt.def("/obj/effect/meteor/flaming/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.meteordrop = list(T("/obj/item/weapon/ore/plasma"));
	return f.dot;
});

// meteors.dm:247
rt.def("/obj/effect/meteor/flaming/proc/meteor_effect", function meteor_effect(f: Frame) {
	parent_proc();
	explosion(this.loc, 1, 2, 3, 4, 0, 0, 5);
	return f.dot;
});

rt.type(11443, "/obj/effect/meteor/irradiated", "/obj/effect/meteor", {
	heavy: 1,
	meteordrop: null,
	threat: 15,
	name: "glowing meteor",
	icon_state: "glowing",
});

// meteors.dm:255
rt.def("/obj/effect/meteor/irradiated/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.meteordrop = list(T("/obj/item/weapon/ore/uranium"));
	return f.dot;
});

// meteors.dm:260
rt.def("/obj/effect/meteor/irradiated/proc/meteor_effect", function* meteor_effect(f: Frame) {
	yield* parent_proc();
	yield* explosion(this.loc, 0, 0, 4, 3, 0);
	yield* new_(T("/obj/effect/decal/cleanable/greenglow"), rt.getStep(f, this, 0));
	yield* radiation_pulse(rt.getStep(f, this, 0), 2, 5, 50, 1);
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

// meteors.dm:273
rt.def("/obj/effect/meteor/meaty/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.meteordrop = list(T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human"), T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant"), T("/obj/item/organ/heart"), T("/obj/item/organ/lungs"), T("/obj/item/organ/tongue"), T("/obj/item/organ/appendix"));
	return f.dot;
});

// meteors.dm:278
rt.def("/obj/effect/meteor/meaty/proc/New", function* New(f: Frame) {
	let path: Value = null;
	for (path of each(this.meteordrop)) {
		if (path == T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant")) {
			this.meteordrop -= path;
			this.meteordrop += pick(typesof(path) - path);
		}
	}
	path = null;
	for (path of each(this.meteordrop)) {
		if (path == T("/obj/item/organ/tongue")) {
			this.meteordrop -= path;
			this.meteordrop += pick(typesof(path));
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// meteors.dm:290
rt.def("/obj/effect/meteor/meaty/proc/make_debris", function* make_debris(f: Frame) {
	yield* parent_proc();
	yield* new_(this.meteorgibs, rt.getStep(f, this, 0));
	return f.dot;
}, true);

// meteors.dm:295
rt.def("/obj/effect/meteor/meaty/proc/ram_turf", function* ram_turf(f: Frame, _T: Value) {
	if (rt.istype(_T, T("/turf/open/space"))) return f.dot;
	yield* new_(T("/obj/effect/decal/cleanable/blood"), _T);
	return f.dot;
}, true);

// meteors.dm:299
rt.def("/obj/effect/meteor/meaty/proc/Bump", function* Bump(f: Frame, A: Value) {
	yield* A.ex_act(this.hitpwr);
	yield* this.get_hit();
	return f.dot;
}, true);

rt.type(11445, "/obj/effect/meteor/meaty/xeno", "/obj/effect/meteor/meaty", {
	meteordrop: null,
	color: "#5EFF00",
	meteorgibs: rt.typePath("/obj/effect/gibspawner/xeno"),
});

// meteors.dm:305
rt.def("/obj/effect/meteor/meaty/xeno/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.meteordrop = list(T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), T("/obj/item/organ/tongue/alien"));
	return f.dot;
});

// meteors.dm:309
rt.def("/obj/effect/meteor/meaty/xeno/proc/New", function* New(f: Frame) {
	this.meteordrop += typesof(T("/obj/item/organ/alien")) - T("/obj/item/organ/alien");
	yield* parent_proc();
	return f.dot;
}, true);

// meteors.dm:313
rt.def("/obj/effect/meteor/meaty/xeno/proc/ram_turf", function* ram_turf(f: Frame, _T: Value) {
	if (rt.istype(_T, T("/turf/open/space"))) return f.dot;
	yield* new_(T("/obj/effect/decal/cleanable/xenoblood"), _T);
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

// meteors.dm:325
rt.def("/obj/effect/meteor/tunguska/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.meteordrop = list(T("/obj/item/weapon/ore/plasma"));
	return f.dot;
});

// meteors.dm:329
rt.def("/obj/effect/meteor/tunguska/proc/Move", function* Move(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* new_(T("/obj/effect/temp_visual/revenant"), rt.getStep(f, this, 0));
	return f.dot;
}, true);

// meteors.dm:334
rt.def("/obj/effect/meteor/tunguska/proc/meteor_effect", function meteor_effect(f: Frame) {
	parent_proc();
	explosion(this.loc, 5, 10, 15, 20, 0);
	return f.dot;
});

// meteors.dm:338
rt.def("/obj/effect/meteor/tunguska/proc/Bump", function* Bump(f: Frame) {
	yield* parent_proc();
	if (!prob(20)) return f.dot;
	yield* explosion(this.loc, 2, 4, 6, 8);
	return f.dot;
}, true);

// meteors.dm:346
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteorsSPOOKY", function InitGlobalmeteorsSPOOKY(f: Frame) {
	GLOB.meteorsSPOOKY = list(T("/obj/effect/meteor/pumpkin"));
	this.gvars_datum_init_order += "meteorsSPOOKY";
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

// meteors.dm:356
rt.def("/obj/effect/meteor/pumpkin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.meteordrop = list(T("/obj/item/clothing/head/hardhat/pumpkinhead"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/pumpkin"));
	return f.dot;
});

// meteors.dm:360
rt.def("/obj/effect/meteor/pumpkin/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.meteorsound = pick(rt.rsc("sound/hallucinations/im_here1.ogg"), rt.rsc("sound/hallucinations/im_here2.ogg"));
	return f.dot;
}, true);
