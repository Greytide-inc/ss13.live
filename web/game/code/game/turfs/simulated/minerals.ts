// Based on /tg/station's code/game/turfs/simulated/minerals.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(4466, "/turf/closed/mineral", "/turf/closed", {
	smooth_icon: rt.rsc("icons/turf/smoothrocks.dmi"),
	environment_type: "asteroid",
	mineralType: null,
	mineralAmt: 3,
	spread: 0,
	spreadChance: 0,
	last_act: 0,
	scan_state: "",
	defer_change: 0,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/airless"),
	name: "rock",
	icon: rt.rsc("icons/turf/mining.dmi"),
	icon_state: "rock",
	smooth: 10,
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/airless"),
	initial_gas_mix: "TEMP=2.7",
	opacity: 1,
	density: 1,
	blocks_air: 1,
	layer: 4.3,
	temperature: 2.7,
});

// minerals.dm:28
rt.def("/turf/closed/mineral/proc/Initialize", function* Initialize(f: Frame) {
	let dir: Value = null, _T: Value = null;
	if (!this.canSmoothWith) {
		this.canSmoothWith = list(T("/turf/closed/mineral"), T("/turf/closed/indestructible"));
	}
	this.pixel_y = -4;
	this.pixel_x = -4;
	this.icon = rt.sv(f, "smooth_icon");
	yield* parent_proc();
	if (!(this.mineralType && this.mineralAmt && this.spread && this.spreadChance)) return f.dot;
	for (dir of each(GLOB.cardinal)) {
		if (prob(this.spreadChance)) {
			if (rt.istype((_T = rt.getStep(f, f.src, dir)), T("/turf/closed/mineral/random"))) {
				yield* this.Spread(_T);
			}
		}
	}
	return f.dot;
}, true);

// minerals.dm:42
rt.def("/turf/closed/mineral/proc/shuttleRotate", function shuttleRotate(f: Frame, rotation: Value) {
	this.setDir(angle2dir(rotation + dir2angle(this.dir)));
	queue_smooth(f.src);
	return f.dot;
});

// minerals.dm:47
rt.def("/turf/closed/mineral/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	if (this.turf_type) {
		underlay_appearance.icon = rt.initial(f, this.turf_type, "icon");
		underlay_appearance.icon_state = rt.initial(f, this.turf_type, "icon_state");
		return 1;
	}
	return parent_proc();
}, false);

// minerals.dm:54
rt.def("/turf/closed/mineral/proc/attackby", function* attackby(f: Frame, _P: Value, user: Value, params: Value) {
	let _T: Value = null;
	if (!user.IsAdvancedToolUser()) {
		to_chat(f.usr, "<span class='warning'>You don't have the dexterity to do this!</span>");
		return f.dot;
	}
	if (rt.istype(_P, T("/obj/item/weapon/pickaxe"))) {
		if (!isturf((_T = user.loc))) {
			return f.dot;
		}
		if (this.last_act + _P.digspeed > rt.worldTime(f)) {
			return f.dot;
		}
		this.last_act = rt.worldTime(f);
		to_chat(user, "<span class='notice'>You start picking...</span>");
		_P.playDigSound();
		if (yield* do_after(user, _P.digspeed, { target: f.src })) {
			if (rt.istype(f.src, T("/turf/closed/mineral"))) {
				to_chat(user, "<span class='notice'>You finish cutting into the rock.</span>");
				yield* this.gets_drilled(user);
			}
		}
	} else {
		return (yield* this.attack_hand(user));
	}
	return f.dot;
}, true);

// minerals.dm:78
rt.def("/turf/closed/mineral/proc/gets_drilled", function* gets_drilled(f: Frame) {
	let i: Value = null, M: Value = null;
	let $e: any;
	if (this.mineralType && f.src.mineralAmt > 0 && f.src.mineralAmt < 11) {
		rt.forRange(f, 0, 1, this.mineralAmt, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* new_(this.mineralType, f.src);
		}
		rt.endFor(f, 0);
	}
	for (M of each(f.src, T("/obj/effect/temp_visual/mining_overlay"))) {
		yield* qdel(M);
	}
	yield* this.ChangeTurf(this.turf_type, this.defer_change);
	yield* addtimer((yield* new_(T("/datum/callback"), f.src, P("/turf/proc/AfterChange"))), 1, 1);
	playsound(f.src, rt.rsc("sound/effects/break_stone.ogg"), 50, 1);
	return f.dot;
}, true);

// minerals.dm:90
rt.def("/turf/closed/mineral/proc/attack_animal", function* attack_animal(f: Frame, user: Value) {
	if (user.environment_smash >= 2) {
		yield* this.gets_drilled();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// minerals.dm:95
rt.def("/turf/closed/mineral/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	to_chat(M, "<span class='notice'>You start digging into the rock...</span>");
	playsound(f.src, rt.rsc("sound/effects/break_stone.ogg"), 50, 1);
	if (!(yield* do_after(M, 40, { target: f.src }))) return f.dot;
	to_chat(M, "<span class='notice'>You tunnel into the rock.</span>");
	yield* this.gets_drilled(M);
	return f.dot;
}, true);

// minerals.dm:102
rt.def("/turf/closed/mineral/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let H: Value = null, I: Value = null, R: Value = null;
	yield* parent_proc();
	if (rt.istype(AM, T("/mob/living/carbon/human"))) {
		H = AM;
		if (I = H.is_holding_item_of_type(T("/obj/item/weapon/pickaxe"))) {
			yield* this.attackby(I, H);
		}
		return f.dot;
	} else if (rt.istype(AM, T("/mob/living/silicon/robot"))) {
		if (rt.istype((R = AM).module_active, T("/obj/item/weapon/pickaxe"))) {
			yield* f.src.attackby(R.module_active, R);
			return f.dot;
		}
	} else {
		return f.dot;
	}
	return f.dot;
}, true);

// minerals.dm:124
rt.def("/turf/closed/mineral/proc/acid_melt", function* acid_melt(f: Frame) {
	yield* this.ChangeTurf(this.baseturf);
	return f.dot;
}, true);

// minerals.dm:127
rt.def("/turf/closed/mineral/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* parent_proc();
	if (severity === 3) {
		if (prob(75)) {
			yield* f.src.gets_drilled(null, 1);
		}
	} else if (severity === 2) {
		if (prob(90)) {
			yield* f.src.gets_drilled(null, 1);
		}
	} else if (severity === 1) {
		yield* f.src.gets_drilled(null, 1);
	}
	return f.dot;
}, true, { waitfor: false });

// minerals.dm:140
rt.def("/turf/closed/mineral/proc/Spread", function* Spread(f: Frame, _T: Value) {
	yield* _T.ChangeTurf(this.type);
	return f.dot;
}, true);

rt.type(4468, "/turf/closed/mineral/random", "/turf/closed/mineral", {
	mineralSpawnChanceList: null,
	mineralChance: 13,
	display_icon_state: "rock",
});

// minerals.dm:149
rt.def("/turf/closed/mineral/random/proc/Initialize", function* Initialize(f: Frame) {
	let _T: Value = null, M: Value = null;
	if (!rt.sv(f, "mineralSpawnChanceList")) {
		rt.setSv(f, "mineralSpawnChanceList", rt.alist(f, [T("/turf/closed/mineral/uranium"), 5, T("/turf/closed/mineral/diamond"), 1, T("/turf/closed/mineral/gold"), 10, T("/turf/closed/mineral/silver"), 12, T("/turf/closed/mineral/plasma"), 20, T("/turf/closed/mineral/iron"), 40, T("/turf/closed/mineral/titanium"), 11, T("/turf/closed/mineral/gibtonite"), 4, T("/turf/open/floor/plating/asteroid/airless/cave"), 2, T("/turf/closed/mineral/bscrystal"), 1]));
	}
	if (rt.sv(f, "display_icon_state")) {
		rt.setSv(f, "icon_state", rt.sv(f, "display_icon_state"));
	}
	yield* parent_proc();
	if (!prob(rt.sv(f, "mineralChance"))) return f.dot;
	let path: Value = pickweight(rt.sv(f, "mineralSpawnChanceList"));
	if (!((_T = (yield* g.srcCall(f, "ChangeTurf", path, 0, 1))) && rt.istype(_T, T("/turf/closed/mineral")))) return f.dot;
	(M = _T).mineralAmt = rand(1, 5);
	M.environment_type = f.src.environment_type;
	M.turf_type = f.src.turf_type;
	M.baseturf = f.src.baseturf;
	f.src = M;
	yield* M.levelupdate();
	return f.dot;
}, true);

rt.type(4469, "/turf/closed/mineral/random/high_chance", "/turf/closed/mineral/random", {
	mineralChance: 25,
	icon_state: "rock_highchance",
	mineralSpawnChanceList: null,
});

// minerals.dm:174
rt.def("/turf/closed/mineral/random/high_chance/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mineralSpawnChanceList = rt.alist(f, [T("/turf/closed/mineral/uranium"), 35, T("/turf/closed/mineral/diamond"), 30, T("/turf/closed/mineral/gold"), 45, T("/turf/closed/mineral/titanium"), 45, T("/turf/closed/mineral/silver"), 50, T("/turf/closed/mineral/plasma"), 50, T("/turf/closed/mineral/bscrystal"), 20]);
	return f.dot;
});

rt.type(4470, "/turf/closed/mineral/random/high_chance/volcanic", "/turf/closed/mineral/random/high_chance", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/lava/smooth/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	mineralSpawnChanceList: null,
});

// minerals.dm:184
rt.def("/turf/closed/mineral/random/high_chance/volcanic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mineralSpawnChanceList = rt.alist(f, [T("/turf/closed/mineral/uranium/volcanic"), 35, T("/turf/closed/mineral/diamond/volcanic"), 30, T("/turf/closed/mineral/gold/volcanic"), 45, T("/turf/closed/mineral/titanium/volcanic"), 45, T("/turf/closed/mineral/silver/volcanic"), 50, T("/turf/closed/mineral/plasma/volcanic"), 50, T("/turf/closed/mineral/bscrystal/volcanic"), 20]);
	return f.dot;
});

rt.type(4471, "/turf/closed/mineral/random/low_chance", "/turf/closed/mineral/random", {
	mineralChance: 6,
	icon_state: "rock_lowchance",
	mineralSpawnChanceList: null,
});

// minerals.dm:193
rt.def("/turf/closed/mineral/random/low_chance/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mineralSpawnChanceList = rt.alist(f, [T("/turf/closed/mineral/uranium"), 2, T("/turf/closed/mineral/diamond"), 1, T("/turf/closed/mineral/gold"), 4, T("/turf/closed/mineral/titanium"), 4, T("/turf/closed/mineral/silver"), 6, T("/turf/closed/mineral/plasma"), 15, T("/turf/closed/mineral/iron"), 40, T("/turf/closed/mineral/gibtonite"), 2, T("/turf/closed/mineral/bscrystal"), 1]);
	return f.dot;
});

rt.type(4472, "/turf/closed/mineral/random/volcanic", "/turf/closed/mineral/random", {
	environment_type: "basalt",
	defer_change: 1,
	mineralChance: 10,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/lava/smooth/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	mineralSpawnChanceList: null,
});

// minerals.dm:207
rt.def("/turf/closed/mineral/random/volcanic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mineralSpawnChanceList = rt.alist(f, [T("/turf/closed/mineral/uranium/volcanic"), 5, T("/turf/closed/mineral/diamond/volcanic"), 1, T("/turf/closed/mineral/gold/volcanic"), 10, T("/turf/closed/mineral/titanium/volcanic"), 11, T("/turf/closed/mineral/silver/volcanic"), 12, T("/turf/closed/mineral/plasma/volcanic"), 20, T("/turf/closed/mineral/iron/volcanic"), 40, T("/turf/closed/mineral/gibtonite/volcanic"), 4, T("/turf/open/floor/plating/asteroid/airless/cave/volcanic"), 1, T("/turf/closed/mineral/bscrystal/volcanic"), 1]);
	return f.dot;
});

rt.type(4473, "/turf/closed/mineral/random/labormineral", "/turf/closed/mineral/random", {
	mineralSpawnChanceList: null,
	icon_state: "rock_labor",
});

// minerals.dm:214
rt.def("/turf/closed/mineral/random/labormineral/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mineralSpawnChanceList = rt.alist(f, [T("/turf/closed/mineral/uranium"), 3, T("/turf/closed/mineral/diamond"), 1, T("/turf/closed/mineral/gold"), 8, T("/turf/closed/mineral/titanium"), 8, T("/turf/closed/mineral/silver"), 20, T("/turf/closed/mineral/plasma"), 30, T("/turf/closed/mineral/iron"), 95, T("/turf/closed/mineral/gibtonite"), 2]);
	return f.dot;
});

rt.type(4474, "/turf/closed/mineral/random/labormineral/volcanic", "/turf/closed/mineral/random/labormineral", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/lava/smooth/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	mineralSpawnChanceList: null,
});

// minerals.dm:227
rt.def("/turf/closed/mineral/random/labormineral/volcanic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mineralSpawnChanceList = rt.alist(f, [T("/turf/closed/mineral/uranium/volcanic"), 3, T("/turf/closed/mineral/diamond/volcanic"), 1, T("/turf/closed/mineral/gold/volcanic"), 8, T("/turf/closed/mineral/titanium/volcanic"), 8, T("/turf/closed/mineral/silver/volcanic"), 20, T("/turf/closed/mineral/plasma/volcanic"), 30, T("/turf/closed/mineral/bscrystal/volcanic"), 1, T("/turf/closed/mineral/gibtonite/volcanic"), 2, T("/turf/closed/mineral/iron/volcanic"), 95]);
	return f.dot;
});

rt.type(4494, "/turf/closed/mineral/ash_rock", "/turf/closed/mineral", {
	smooth_icon: rt.rsc("icons/turf/walls/rock_wall.dmi"),
	environment_type: "waste",
	defer_change: 1,
	name: "rock",
	icon: rt.rsc("icons/turf/mining.dmi"),
	icon_state: "rock2",
	smooth: 10,
	canSmoothWith: null,
	baseturf: rt.typePath("/turf/open/floor/plating/ashplanet/wateryrock"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	turf_type: rt.typePath("/turf/open/floor/plating/ashplanet/rocky"),
});

// minerals.dm:373
rt.def("/turf/closed/mineral/ash_rock/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed"));
	return f.dot;
});

rt.type(4495, "/turf/closed/mineral/gibtonite", "/turf/closed/mineral", {
	det_time: 8,
	stage: 0,
	activated_ckey: null,
	activated_name: null,
	activated_overlay: null,
	mineralAmt: 1,
	spreadChance: 0,
	spread: 0,
	scan_state: "rock_Gibtonite",
});

// minerals.dm:395
rt.def("/turf/closed/mineral/gibtonite/proc/Initialize", function* Initialize(f: Frame) {
	this.det_time = rand(8, 10);
	yield* parent_proc();
	return f.dot;
}, true);

// minerals.dm:399
rt.def("/turf/closed/mineral/gibtonite/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/device/mining_scanner")) || rt.istype(I, T("/obj/item/device/t_scanner/adv_mining_scanner")) && this.stage == 1) {
		user.visible_message(`<span class='notice'>${user} holds ${I} to ${f.src}...</span>`, `<span class='notice'>You use ${I} to locate where to cut off the chain reaction and attempt to stop it...</span>`);
		yield* this.defuse();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// minerals.dm:405
rt.def("/turf/closed/mineral/gibtonite/proc/explosive_reaction", function explosive_reaction(f: Frame, user: Value, triggered_by_explosion: Value) {
	triggered_by_explosion ??= 0;
	if (this.stage != GIBTONITE_UNSTRUCK) return f.dot;
	this.activated_overlay = mutable_appearance(rt.rsc("icons/turf/smoothrocks.dmi"), "rock_Gibtonite_active", ON_EDGED_TURF_LAYER);
	this.add_overlay(this.activated_overlay);
	this.name = "gibtonite deposit";
	this.desc = "An active gibtonite reserve. Run!";
	this.stage = GIBTONITE_ACTIVE;
	this.visible_message("<span class='danger'>There was gibtonite inside! It's going to explode!</span>");
	let bombturf: Value = rt.getStep(f, f.src, 0);
	let A: Value = get_area(bombturf);
	let notify_admins: Value = 0;
	if (this.z != 5) {
		notify_admins = 1;
		if (!triggered_by_explosion) {
			message_admins(`${`${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`} has triggered a gibtonite deposit reaction at ${A.name} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${bombturf.x};Y=${bombturf.y};Z=${bombturf.z}'>JMP</a>)`}.`);
		} else {
			message_admins(`An explosion has triggered a gibtonite deposit reaction at ${A.name} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${bombturf.x};Y=${bombturf.y};Z=${bombturf.z}'>JMP</a>)`}.`);
		}
	}
	if (!triggered_by_explosion) {
		log_game(`${key_name(user)} has triggered a gibtonite deposit reaction at ${A.name} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${bombturf.x};Y=${bombturf.y};Z=${bombturf.z}'>JMP</a>)`}.`);
	} else {
		log_game(`An explosion has triggered a gibtonite deposit reaction at ${A.name} ${`(${bombturf.x},${bombturf.y},${bombturf.z})`}`);
	}
	this.countdown(notify_admins);
	return f.dot;
});

// minerals.dm:432
rt.def("/turf/closed/mineral/gibtonite/proc/countdown", function* countdown(f: Frame, notify_admins: Value) {
	notify_admins ??= 0;
	while (rt.istype(f.src, T("/turf/closed/mineral/gibtonite")) && this.stage == GIBTONITE_ACTIVE && this.det_time > 0 && this.mineralAmt >= GIBTONITE_ACTIVE) {
		rt.incSrcVar(f, "det_time", -1, true);
		yield* sleep(5);
	}
	if (!rt.istype(f.src, T("/turf/closed/mineral/gibtonite"))) return f.dot;
	if (!(this.stage == GIBTONITE_ACTIVE && this.det_time <= 0 && this.mineralAmt >= 1)) return f.dot;
	let bombturf: Value = rt.getStep(f, f.src, 0);
	this.mineralAmt = 0;
	this.stage = GIBTONITE_DETONATE;
	yield* explosion(bombturf, 1, 3, 5, { adminlog: notify_admins });
	return f.dot;
}, true, { waitfor: false });

// minerals.dm:443
rt.def("/turf/closed/mineral/gibtonite/proc/defuse", function defuse(f: Frame) {
	if (this.stage != GIBTONITE_ACTIVE) return f.dot;
	this.cut_overlay(this.activated_overlay);
	this.activated_overlay.icon_state = "rock_Gibtonite_inactive";
	this.add_overlay(this.activated_overlay);
	this.desc = "An inactive gibtonite reserve. The ore can be extracted.";
	this.stage = GIBTONITE_STABLE;
	if (this.det_time < 0) {
		this.det_time = 0;
	}
	this.visible_message(`<span class='notice'>The chain reaction was stopped! The gibtonite had ${f.src.det_time} reactions left till the explosion!</span>`);
	return f.dot;
});

// minerals.dm:454
rt.def("/turf/closed/mineral/gibtonite/proc/gets_drilled", function* gets_drilled(f: Frame, user: Value, triggered_by_explosion: Value) {
	let bombturf: Value = null, G: Value = null;
	triggered_by_explosion ??= 0;
	if (this.stage == GIBTONITE_UNSTRUCK && this.mineralAmt >= 1) {
		playsound(f.src, rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 50, 1);
		yield* this.explosive_reaction(user, triggered_by_explosion);
		return f.dot;
	}
	if (this.stage == GIBTONITE_ACTIVE && this.mineralAmt >= 1) {
		bombturf = rt.getStep(f, f.src, 0);
		this.mineralAmt = 0;
		this.stage = GIBTONITE_DETONATE;
		yield* explosion(bombturf, 1, 2, 5, { adminlog: 0 });
	}
	if (this.stage == GIBTONITE_STABLE) {
		G = (yield* new_(T("/obj/item/weapon/twohanded/required/gibtonite"), f.src));
		if (this.det_time <= 0) {
			G.quality = 3;
			G.icon_state = "Gibtonite ore 3";
		}
		if (this.det_time >= 1 && this.det_time <= 2) {
			G.quality = 2;
			G.icon_state = "Gibtonite ore 2";
		}
	}
	yield* this.ChangeTurf(this.turf_type, this.defer_change);
	yield* addtimer((yield* new_(T("/datum/callback"), f.src, P("/turf/proc/AfterChange"))), 1, 1);
	return f.dot;
}, true);
