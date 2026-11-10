// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5024, "/mob/living/simple_animal/hostile/megafauna/colossus", "/mob/living/simple_animal/hostile/megafauna", {
	move_to_delay: 10,
	ranged: 1,
	name: "colossus",
	desc: "A monstrous creature protected by heavy shielding.",
	health: 2500,
	maxHealth: 2500,
	attacktext: "judges",
	attack_sound: rt.rsc("sound/magic/clockwork/ratvar_attack.ogg"),
	icon_state: "eva",
	icon_living: "eva",
	icon_dead: "dragon_dead",
	friendly: "stares down",
	icon: rt.rsc("icons/mob/lavaland/96x96megafauna.dmi"),
	speak_emote: null,
	armour_penetration: 40,
	melee_damage_lower: 40,
	melee_damage_upper: 40,
	speed: 1,
	pixel_x: -32,
	del_on_death: 1,
	medal_type: "Colossus",
	score_type: "Colossus Killed",
	crusher_loot: null,
	loot: null,
	butcher_results: null,
	deathmessage: "disintegrates, leaving a glowing core in its wake.",
	death_sound: rt.rsc("sound/magic/demon_dies.ogg"),
});

// colossus.dm:38
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("roars");

	this.crusher_loot = list(T("/obj/structure/closet/crate/necropolis/colossus/crusher"));

	this.loot = list(T("/obj/structure/closet/crate/necropolis/colossus"));

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/ore/diamond"), 5, T("/obj/item/stack/sheet/sinew"), 5, T("/obj/item/stack/sheet/animalhide/ashdrake"), 10, T("/obj/item/stack/sheet/bone"), 30]);
	return f.dot;
});

// colossus.dm:56
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/devour", function* devour(f: Frame, L: Value) {
	this.visible_message(`<span class='colossus'>${this} disintegrates ${L}!</span>`);
	yield* L.dust();
	return f.dot;
}, true);

// colossus.dm:60
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/OpenFire", function* OpenFire(f: Frame) {
	this.anger_modifier = max(0, min((this.maxHealth - this.health) / 50, 20));
	this.ranged_cooldown = rt.worldTime(f) + 120;
	if (this.enrage(this.target)) {
		if (this.move_to_delay == rt.initial(f, this, "move_to_delay")) {
			this.visible_message("<span class='colossus'>\"<b>You can't dodge.</b>\"</span>");
		}
		this.ranged_cooldown = rt.worldTime(f) + 30;
		yield* this.telegraph();
		yield* this.dir_shots(GLOB.alldirs);
		this.move_to_delay = 3;
		return f.dot;
	} else {
		this.move_to_delay = rt.initial(f, this, "move_to_delay");
	}
	if (prob(20 + this.anger_modifier)) {
		yield* this.telegraph();
		if (this.health < this.maxHealth / 3) {
			yield* this.double_spiral();
		} else {
			this.visible_message("<span class='colossus'>\"<b>Judgement.</b>\"</span>");
			yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/colossus/proc/spiral_shoot"), rand(0, 1));
		}
	} else if (prob(20)) {
		this.ranged_cooldown = rt.worldTime(f) + 30;
		yield* this.random_shots();
	} else if (prob(70)) {
		this.ranged_cooldown = rt.worldTime(f) + 20;
		yield* this.blast();
	} else {
		this.ranged_cooldown = rt.worldTime(f) + 40;
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/colossus/proc/alternating_dir_shots"));
	}
	return f.dot;
}, true);

// colossus.dm:96
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.internal = (yield* new_(T("/obj/item/device/gps/internal/colossus"), this));
	return f.dot;
}, true);

rt.type(11686, "/obj/effect/temp_visual/at_shield", "/obj/effect/temp_visual", {
	target: null,
	light_range: 2,
	duration: 8,
	name: "anti-toolbox field",
	desc: "A shimmering forcefield protecting the colossus.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "at_shield2",
	layer: 5,
});

// colossus.dm:110
rt.def("/obj/effect/temp_visual/at_shield/proc/Initialize", function* Initialize(f: Frame, mapload: Value, new_target: Value) {
	f.dot = (yield* parent_proc());
	this.target = new_target;
	yield* ImmediateInvokeAsync(this, P("/atom/movable/proc/orbit"), this.target, 0, 0, 0, 0, 0, 1);
	return f.dot;
}, true);

// colossus.dm:115
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/bullet_act", function* bullet_act(f: Frame) {
	let AT: Value = null, random_x: Value = null, random_y: Value = null;
	if (!this.stat) {
		AT = (yield* new_(T("/obj/effect/temp_visual/at_shield"), this.loc, this));
		random_x = rand(-32, 32);
		AT.pixel_x += random_x;
		random_y = rand(0, 72);
		AT.pixel_y += random_y;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["P"] });

// colossus.dm:125
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/enrage", function enrage(f: Frame, L: Value) {
	let H: Value = null;
	if (!rt.istype(L, T("/mob/living/carbon/human"))) return f.dot;
	if (!(H = L).mind) return f.dot;
	if (!(H.mind.martial_art && prob(H.mind.martial_art.deflection_chance))) return f.dot;
	f.dot = 1;
	return f.dot;
});

// colossus.dm:132
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/alternating_dir_shots", function* alternating_dir_shots(f: Frame) {
	yield* this.dir_shots(GLOB.diagonals);
	yield* sleep(10);
	yield* this.dir_shots(GLOB.cardinal);
	yield* sleep(10);
	yield* this.dir_shots(GLOB.diagonals);
	yield* sleep(10);
	yield* this.dir_shots(GLOB.cardinal);
	return f.dot;
}, true);

// colossus.dm:141
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/double_spiral", function* double_spiral(f: Frame) {
	this.visible_message("<span class='colossus'>\"<b>Die.</b>\"</span>");
	yield* sleep(10);
	yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/colossus/proc/spiral_shoot"));
	yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/colossus/proc/spiral_shoot"), 1);
	return f.dot;
}, true);

// colossus.dm:148
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/spiral_shoot", function* spiral_shoot(f: Frame, negative: Value, counter_start: Value) {
	let marker: Value = null, i: Value = null;
	let $e: any;
	negative ??= 0;
	counter_start ??= 1;
	let counter: Value = counter_start;
	rt.forRange(f, 0, 1, 80, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (counter === 1) {
			marker = rt.locate(this.x, this.y - 2, this.z);
		} else if (counter === 2) {
			marker = rt.locate(this.x - 1, this.y - 2, this.z);
		} else if (counter === 3) {
			marker = rt.locate(this.x - 2, this.y - 2, this.z);
		} else if (counter === 4) {
			marker = rt.locate(this.x - 2, this.y - 1, this.z);
		} else if (counter === 5) {
			marker = rt.locate(this.x - 2, this.y, this.z);
		} else if (counter === 6) {
			marker = rt.locate(this.x - 2, this.y + 1, this.z);
		} else if (counter === 7) {
			marker = rt.locate(this.x - 2, this.y + 2, this.z);
		} else if (counter === 8) {
			marker = rt.locate(this.x - 1, this.y + 2, this.z);
		} else if (counter === 9) {
			marker = rt.locate(this.x, this.y + 2, this.z);
		} else if (counter === 10) {
			marker = rt.locate(this.x + 1, this.y + 2, this.z);
		} else if (counter === 11) {
			marker = rt.locate(this.x + 2, this.y + 2, this.z);
		} else if (counter === 12) {
			marker = rt.locate(this.x + 2, this.y + 1, this.z);
		} else if (counter === 13) {
			marker = rt.locate(this.x + 2, this.y, this.z);
		} else if (counter === 14) {
			marker = rt.locate(this.x + 2, this.y - 1, this.z);
		} else if (counter === 15) {
			marker = rt.locate(this.x + 2, this.y - 2, this.z);
		} else if (counter === 16) {
			marker = rt.locate(this.x + 1, this.y - 2, this.z);
		}
		if (negative) {
			counter--;
		} else {
			counter++;
		}
		if (counter > 16) {
			counter = 1;
		}
		if (counter < 1) {
			counter = 16;
		}
		yield* this.shoot_projectile(marker);
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 20, 1);
		yield* sleep(1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// colossus.dm:198
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/shoot_projectile", function* shoot_projectile(f: Frame, marker: Value) {
	let _P: Value = null;
	if (!marker || marker == this.loc) {
		return f.dot;
	}
	let startloc: Value = rt.getStep(f, this, 0);
	(_P = (yield* new_(T("/obj/item/projectile/colossus"), startloc))).current = startloc;
	_P.starting = startloc;
	_P.firer = this;
	_P.yo = marker.y - startloc.y;
	_P.xo = marker.x - startloc.x;
	if (this.target) {
		_P.original = this.target;
	} else {
		_P.original = marker;
	}
	yield* _P.fire();
	return f.dot;
}, true);

// colossus.dm:214
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/random_shots", function* random_shots(f: Frame) {
	let U: Value = null, _T: Value = null;
	playsound((U = rt.getStep(f, this, 0)), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 300, 1, 5);
	for (_T of each(block(rt.locate(max(U.x - 12, 1), max(U.y - 12, 1), U.z), rt.locate(min(U.x + 12, rt.world().maxx), min(U.y + 12, rt.world().maxy), U.z)) - U)) {
		if (prob(5)) {
			yield* this.shoot_projectile(_T);
		}
	}
	return f.dot;
}, true);

// colossus.dm:221
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/blast", function* blast(f: Frame) {
	let _T: Value = null, turf: Value = null;
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 200, 1, 2);
	yield* this.newtonian_move(rt.getDir(f, (_T = rt.getStep(f, this.target, 0)), this.targets_from));
	for (turf of each(range(1, _T), T("/turf"))) {
		yield* this.shoot_projectile(turf);
	}
	return f.dot;
}, true);

// colossus.dm:228
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/dir_shots", function* dir_shots(f: Frame, dirs: Value) {
	let d: Value = null, E: Value = null;
	if (!rt.istype(dirs, T("/list"))) {
		dirs = (yield* GLOB.alldirs.Copy());
	}
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 200, 1, 2);
	for (d of each(dirs)) {
		yield* this.shoot_projectile((E = rt.getStep(f, this, d)));
	}
	return f.dot;
}, true);

// colossus.dm:236
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/telegraph", function telegraph(f: Frame) {
	let M: Value = null;
	for (M of each(range(10, this), T("/mob"))) {
		if (M.client) {
			flash_color(M.client, "#c80000", 1);
			shake_camera(M, 4, 3);
		}
	}
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/clockwork/narsie_attack.ogg"), 200, 1);
	return f.dot;
});

rt.type(8898, "/obj/item/projectile/colossus", "/obj/item/projectile", {
	pass_flags: 1,
	name: "death bolt",
	icon_state: "chronobolt",
	damage: 25,
	armour_penetration: 100,
	speed: 2,
	eyeblur: 0,
	damage_type: "brute",
});

// colossus.dm:255
rt.def("/obj/item/projectile/colossus/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!(isturf(f.args[0]) || rt.istype(f.args[0], T("/obj")))) return f.dot;
	yield* f.args[0].ex_act(2);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(10914, "/obj/machinery/smartfridge/black_box", "/obj/machinery/smartfridge", {
	memory_saved: 0,
	stored_items: null,
	icon_on: "blackbox",
	icon_off: "blackbox",
	light_range: 8,
	max_n_of_items: 1e+31,
	use_power: 0,
	name: "black box",
	desc: "A completely indestructible chunk of crystal, rumoured to predate the start of this universe. It looks like you could store things inside it.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "blackbox",
	resistance_flags: 35,
	pixel_y: -4,
}, { global: { blacklist: 765 } });

// colossus.dm:283
rt.def("/obj/machinery/smartfridge/black_box/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stored_items = list();
	return f.dot;
});

// colossus.dm:290
rt.def("/obj/machinery/smartfridge/black_box/proc/accept_check", function accept_check(f: Frame, O: Value) {
	if (!rt.istype(O, T("/obj/item"))) {
		return 0;
	}
	if (is_type_in_typecache(O, GLOB.blacklist)) {
		return 0;
	}
	return 1;
});

// colossus.dm:298
rt.def("/obj/machinery/smartfridge/black_box/proc/New", function* New(f: Frame) {
	if (GLOB.current && GLOB.current != this) {
		yield* qdel(this, { force: 1 });
		return f.dot;
	}
	GLOB.current = this;
	yield* this.ReadMemory();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// colossus.dm:306
rt.def("/obj/machinery/smartfridge/black_box/proc/process", function process(f: Frame) {
	parent_proc();
	if (!(!this.memory_saved && GLOB.SSticker.current_state == GAME_STATE_FINISHED)) return f.dot;
	this.WriteMemory();
	return f.dot;
}, false, { waitfor: false });

// colossus.dm:311
rt.def("/obj/machinery/smartfridge/black_box/proc/WriteMemory", function WriteMemory(f: Frame) {
	let O: Value = null;
	let S: Value = new_(T("/savefile"), "data/npc_saves/Blackbox.sav");
	this.stored_items = list();
	for (O of each(this.contents - this.component_parts, T("/obj"))) {
		this.stored_items += O.type;
	}
	rt.op(f, "OutputReference", [rt.R.index], [S, "stored_items", this.stored_items], false);
	this.memory_saved = 1;
	return f.dot;
});

// colossus.dm:321
rt.def("/obj/machinery/smartfridge/black_box/proc/ReadMemory", function* ReadMemory(f: Frame) {
	let S: Value = null, item: Value = null;
	this.stored_items = rt.input(f, rt.R.index, null, [(S = (yield* new_(T("/savefile"), "data/npc_saves/Blackbox.sav"))), "stored_items"]);
	if (this.stored_items === null) {
		this.stored_items = list();
	}
	for (item of each(this.stored_items)) {
		yield* this.create_item(item);
	}
	return f.dot;
}, true);

// colossus.dm:333
rt.def("/obj/machinery/smartfridge/black_box/proc/create_item", function* create_item(f: Frame, item_type: Value) {
	yield* new_(item_type, this);
	return f.dot;
}, true);

// colossus.dm:337
rt.def("/obj/machinery/smartfridge/black_box/proc/Destroy", function* Destroy(f: Frame) {
	let thing: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[0]) {
		for (thing of each(this)) {
			yield* qdel(thing);
		}
		return (yield* parent_proc());
	}
	return 1;
}, true, { args: ["force"] });

rt.type(10947, "/obj/machinery/anomalous_crystal", "/obj/machinery", {
	observer_desc: "Anomalous crystals have descriptions that only observers can see. But this one hasn't been changed from the default.",
	activation_method: null,
	possible_methods: null,
	activation_damage_type: null,
	last_use_timer: 0,
	cooldown_add: 30,
	affected_targets: null,
	activation_sound: rt.rsc("sound/effects/break_stone.ogg"),
	light_range: 8,
	use_power: 0,
	flags: 16,
	name: "anomalous crystal",
	desc: "A strange chunk of crystal, being in the presence of it fills you with equal parts excitement and dread.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "anomaly_crystal",
	resistance_flags: 99,
	density: 1,
});

// colossus.dm:392
rt.def("/obj/machinery/anomalous_crystal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_methods = list("touch", "speech", "heat", "bullet", "energy", "bomb", "bumping", "weapon", "magic");

	this.affected_targets = list();
	return f.dot;
});

// colossus.dm:396
rt.def("/obj/machinery/anomalous_crystal/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	if (this.activation_method) return f.dot;
	this.activation_method = pick(this.possible_methods);
	return f.dot;
}, true);

// colossus.dm:401
rt.def("/obj/machinery/anomalous_crystal/proc/examine", function examine(f: Frame, user: Value) {
	f.dot = parent_proc();
	if (!rt.istype(user, T("/mob/dead/observer"))) return f.dot;
	to_chat(user, this.observer_desc);
	to_chat(user, `It is activated by ${this.activation_method}.`);
	return f.dot;
}, false);

// colossus.dm:407
rt.def("/obj/machinery/anomalous_crystal/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	yield* parent_proc();
	if (!rt.istype(speaker, T("/mob/living"))) return f.dot;
	yield* this.ActivationReaction(speaker, "speech");
	return f.dot;
}, true);

// colossus.dm:412
rt.def("/obj/machinery/anomalous_crystal/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* parent_proc();
	yield* this.ActivationReaction(user, "touch");
	return f.dot;
}, true);

// colossus.dm:416
rt.def("/obj/machinery/anomalous_crystal/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (I.is_hot()) {
		yield* this.ActivationReaction(user, "heat");
	} else {
		yield* this.ActivationReaction(user, "weapon");
	}
	yield* parent_proc();
	return f.dot;
}, true);

// colossus.dm:423
rt.def("/obj/machinery/anomalous_crystal/proc/bullet_act", function* bullet_act(f: Frame, P: Value, def_zone: Value) {
	yield* parent_proc();
	if (rt.istype(P, T("/obj/item/projectile/magic"))) {
		yield* this.ActivationReaction(P.firer, "magic", P.damage_type);
		return f.dot;
	}
	yield* this.ActivationReaction(P.firer, P.flag, P.damage_type);
	return f.dot;
}, true);

// colossus.dm:430
rt.def("/obj/machinery/anomalous_crystal/proc/ActivationReaction", function ActivationReaction(f: Frame, user: Value, method: Value, damtype: Value) {
	if (rt.worldTime(f) < this.last_use_timer) {
		return 0;
	}
	if (this.activation_damage_type && this.activation_damage_type != damtype) {
		return 0;
	}
	if (method != this.activation_method) {
		return 0;
	}
	this.last_use_timer = rt.worldTime(f) + this.cooldown_add;
	playsound(user, this.activation_sound, 100, 1);
	return 1;
});

// colossus.dm:441
rt.def("/obj/machinery/anomalous_crystal/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	yield* parent_proc();
	if (!ismob(AM)) return f.dot;
	yield* this.ActivationReaction(AM, "bumping");
	return f.dot;
}, true);

// colossus.dm:446
rt.def("/obj/machinery/anomalous_crystal/proc/ex_act", function* ex_act(f: Frame) {
	yield* this.ActivationReaction(null, "bomb");
	return f.dot;
}, true, { waitfor: false });

rt.type(10948, "/obj/machinery/anomalous_crystal/honk", "/obj/machinery/anomalous_crystal", {
	observer_desc: "This crystal strips and equips its targets as clowns.",
	possible_methods: null,
	activation_sound: rt.rsc("sound/items/bikehorn.ogg"),
});

// colossus.dm:454
rt.def("/obj/machinery/anomalous_crystal/honk/proc/ActivationReaction", function* ActivationReaction(f: Frame, user: Value) {
	let W: Value = null, C: Value = null;
	if (!((yield* parent_proc()) && rt.istype(user, T("/mob/living/carbon/human")) && !rt.isIn(f, user, this.affected_targets))) return f.dot;
	let H: Value = user;
	for (W of each(H, T("/obj/item"))) {
		yield* H.dropItemToGround(W);
	}
	yield* (C = (yield* new_(T("/datum/job/clown")))).equip(H);
	yield* qdel(C);
	this.affected_targets.Add(H);
	return f.dot;
}, true);

rt.type(10949, "/obj/machinery/anomalous_crystal/theme_warp", "/obj/machinery/anomalous_crystal", {
	terrain_theme: "winter",
	NewTerrainFloors: null,
	NewTerrainWalls: null,
	NewTerrainChairs: null,
	NewTerrainTables: null,
	NewFlora: null,
	florachance: 8,
	observer_desc: "This crystal warps the area around it to a theme.",
	activation_method: "touch",
	cooldown_add: 200,
});

// colossus.dm:472
rt.def("/obj/machinery/anomalous_crystal/theme_warp/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.NewFlora = list();
	return f.dot;
});

// colossus.dm:476
rt.def("/obj/machinery/anomalous_crystal/theme_warp/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.terrain_theme = pick("lavaland", "winter", "jungle", "ayy lmao");
	this.observer_desc = `This crystal changes the area around it to match the theme of "${this.terrain_theme}".`;
	if (this.terrain_theme === "lavaland") {
		this.NewTerrainFloors = T("/turf/open/floor/grass/snow/basalt");
		this.NewTerrainWalls = T("/turf/closed/wall/mineral/cult");
		this.NewFlora = list(T("/mob/living/simple_animal/hostile/asteroid/goldgrub"));
		this.florachance = 1;
	} else if (this.terrain_theme === "winter") {
		this.NewTerrainFloors = T("/turf/open/floor/grass/snow");
		this.NewTerrainWalls = T("/turf/closed/wall/mineral/wood");
		this.NewTerrainChairs = T("/obj/structure/chair/wood/normal");
		this.NewTerrainTables = T("/obj/structure/table/glass");
		this.NewFlora = list(T("/obj/structure/flora/grass/green"), T("/obj/structure/flora/grass/brown"), T("/obj/structure/flora/grass/both"));
	} else if (this.terrain_theme === "jungle") {
		this.NewTerrainFloors = T("/turf/open/floor/grass");
		this.NewTerrainWalls = T("/turf/closed/wall/mineral/sandstone");
		this.NewTerrainChairs = T("/obj/structure/chair/wood");
		this.NewTerrainTables = T("/obj/structure/table/wood");
		this.NewFlora = list(T("/obj/structure/flora/ausbushes/sparsegrass"), T("/obj/structure/flora/ausbushes/fernybush"), T("/obj/structure/flora/ausbushes/leafybush"), T("/obj/structure/flora/ausbushes/grassybush"), T("/obj/structure/flora/ausbushes/sunnybush"), T("/obj/structure/flora/tree/palm"), T("/mob/living/carbon/monkey"), T("/obj/item/weapon/gun/ballistic/bow"), T("/obj/item/weapon/storage/backpack/quiver/full"));
		this.florachance = 20;
	} else if (this.terrain_theme === "ayy lmao") {
		this.NewTerrainFloors = T("/turf/open/floor/plating/abductor");
		this.NewTerrainWalls = T("/turf/closed/wall/mineral/abductor");
		this.NewTerrainChairs = T("/obj/structure/bed/abductor");
		this.NewTerrainTables = T("/obj/structure/table/abductor");
	}
	return f.dot;
}, true);

// colossus.dm:508
rt.def("/obj/machinery/anomalous_crystal/theme_warp/proc/ActivationReaction", function* ActivationReaction(f: Frame, user: Value, method: Value) {
	let A: Value = null, Stuff: Value = null, _T: Value = null, O: Value = null, G: Value = null, Picked: Value = null, Original: Value = null, C: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	if (!(!(A = get_area(this)).outdoors && !rt.isIn(f, A, this.affected_targets))) return f.dot;
	for (Stuff of each(A, T("/atom"))) {
		if (isturf(Stuff)) {
			if ((rt.istype((_T = Stuff), T("/turf/open/space")) || rt.istype(_T, T("/turf/open/floor"))) && this.NewTerrainFloors) {
				if ((O = (yield* _T.ChangeTurf(this.NewTerrainFloors))).air) {
					(G = O.air).copy_from_turf(O);
				}
				if (prob(this.florachance) && rt.len(f, this.NewFlora) && !is_blocked_turf(O, 1)) {
					Picked = pick(this.NewFlora);
					yield* new_(Picked, O);
				}
				continue;
			}
			if (rt.istype(_T, T("/turf/closed/wall")) && this.NewTerrainWalls) {
				yield* _T.ChangeTurf(this.NewTerrainWalls);
				continue;
			}
		}
		if (rt.istype(Stuff, T("/obj/structure/chair")) && this.NewTerrainChairs) {
			Original = Stuff;
			yield* (C = (yield* new_(this.NewTerrainChairs, Original.loc))).setDir(Original.dir);
			yield* qdel(Stuff);
			continue;
		}
		if (rt.istype(Stuff, T("/obj/structure/table")) && this.NewTerrainTables) {
			yield* new_(this.NewTerrainTables, Stuff.loc);
			continue;
		}
	}
	this.affected_targets += A;
	return f.dot;
}, true);

rt.type(10950, "/obj/machinery/anomalous_crystal/emitter", "/obj/machinery/anomalous_crystal", {
	generated_projectile: rt.typePath("/obj/item/projectile/beam/emitter"),
	observer_desc: "This crystal generates a projectile when activated.",
	activation_method: "touch",
	cooldown_add: 50,
});

// colossus.dm:544
rt.def("/obj/machinery/anomalous_crystal/emitter/proc/Initialize", function* Initialize(f: Frame) {
	let proj_name: Value = null;
	f.dot = (yield* parent_proc());
	this.generated_projectile = pick(T("/obj/item/projectile/colossus"));
	this.observer_desc = fmt("This crystal generates ＇！ when activated.", [(proj_name = rt.initial(f, this.generated_projectile, "name"))]);
	return f.dot;
}, true);

// colossus.dm:551
rt.def("/obj/machinery/anomalous_crystal/emitter/proc/ActivationReaction", function* ActivationReaction(f: Frame, user: Value, method: Value) {
	let _P: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	yield* (_P = (yield* new_(this.generated_projectile, rt.getStep(f, this, 0)))).setDir(this.dir);
	if (this.dir === 1) {
		_P.yo = 20;
		_P.xo = 0;
	} else if (this.dir === 4) {
		_P.yo = 0;
		_P.xo = 20;
	} else if (this.dir === 8) {
		_P.yo = 0;
		_P.xo = -20;
	} else {
		_P.yo = -20;
		_P.xo = 0;
	}
	yield* _P.fire();
	return f.dot;
}, true);

rt.type(10951, "/obj/machinery/anomalous_crystal/dark_reprise", "/obj/machinery/anomalous_crystal", {
	observer_desc: "When activated, this crystal revives anyone nearby, but turns them into Shadowpeople and makes them unclonable, making the crystal their only hope of getting up again.",
	activation_method: "touch",
	activation_sound: rt.rsc("sound/hallucinations/growl1.ogg"),
});

// colossus.dm:575
rt.def("/obj/machinery/anomalous_crystal/dark_reprise/proc/ActivationReaction", function* ActivationReaction(f: Frame, user: Value, method: Value) {
	let i: Value = null, H: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	for (i of each(range(1, this))) {
		if (isturf(i)) {
			yield* new_(T("/obj/effect/temp_visual/cult/sparks"), i);
			continue;
		}
		if (rt.istype(i, T("/mob/living/carbon/human"))) {
			if ((H = i).stat == 2) {
				yield* H.set_species(T("/datum/species/shadow"), 1);
				yield* H.regenerate_limbs();
				yield* H.regenerate_organs();
				yield* H.revive(1, 0);
				(rt.modField(f, H, "disabilities", 128, rt.bitOr));
				yield* H.grab_ghost({ force: 1 });
			}
		}
	}
	return f.dot;
}, true);

rt.type(10952, "/obj/machinery/anomalous_crystal/helpers", "/obj/machinery/anomalous_crystal", {
	ready_to_deploy: 0,
	observer_desc: "This crystal allows ghosts to turn into a fragile creature that can heal people.",
	activation_method: "touch",
	activation_sound: rt.rsc("sound/effects/ghost2.ogg"),
});

// colossus.dm:597
rt.def("/obj/machinery/anomalous_crystal/helpers/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.poi_list -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// colossus.dm:601
rt.def("/obj/machinery/anomalous_crystal/helpers/proc/ActivationReaction", function* ActivationReaction(f: Frame, user: Value, method: Value) {
	if (!((yield* parent_proc()) && !this.ready_to_deploy)) return f.dot;
	(rt.modGl("poi_list", this, rt.bitOr));
	this.ready_to_deploy = 1;
	yield* notify_ghosts(`An anomalous crystal has been activated in ${get_area(this)}! This crystal can always be used by ghosts hereafter.`, { enter_link: fmt("<a href=?src=＃;ghostjoin=1>(Click to enter)</a>", [this]), ghost_sound: rt.rsc("sound/effects/ghost2.ogg"), source: this, action: "attack" });
	return f.dot;
}, true);

// colossus.dm:607
rt.def("/obj/machinery/anomalous_crystal/helpers/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let be_helper: Value = null, W: Value = null;
	yield* parent_proc();
	if (!this.ready_to_deploy) return f.dot;
	if (!((be_helper = (yield* alert("Become a Lightgeist? (Warning, You can no longer be cloned!)", null, "Yes", "No"))) == "Yes" && !(!this || this.gc_destroyed) && rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	(W = (yield* new_(T("/mob/living/simple_animal/hostile/lightgeist"), rt.getStep(f, this.loc, 0)))).key = user.key;
	return f.dot;
}, true);

// colossus.dm:616
rt.def("/obj/machinery/anomalous_crystal/helpers/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	if (!rt.at(href_list, "ghostjoin")) return f.dot;
	if (!rt.istype((ghost = f.usr), T("/mob/dead/observer"))) return f.dot;
	yield* this.attack_ghost(ghost);
	return f.dot;
}, true);

rt.type(5030, "/mob/living/simple_animal/hostile/lightgeist", "/mob/living/simple_animal/hostile", {
	heal_power: 5,
	pass_flags: 21,
	verb_say: "warps",
	verb_ask: "floats inquisitively",
	verb_exclaim: "zaps",
	verb_yell: "bangs",
	initial_language_holder: rt.typePath("/datum/language_holder/lightbringer"),
	light_range: 4,
	AIStatus: 3,
	name: "lightgeist",
	desc: "This small floating creature is a completely unknown form of life... being near it fills you with a sense of tranquility.",
	icon_state: "lightgeist",
	icon_living: "lightgeist",
	icon_dead: "butterfly_dead",
	turns_per_move: 1,
	response_help: "waves away",
	response_disarm: "brushes aside",
	response_harm: "disrupts",
	speak_emote: null,
	maxHealth: 2,
	health: 2,
	harm_intent_damage: 1,
	friendly: "mends",
	density: 0,
	movement_type: 2,
	ventcrawler: 2,
	mob_size: 0,
	gold_core_spawnable: 0,
	damage_coeff: null,
	faction: null,
	del_on_death: 1,
	unsuitable_atmos_damage: 0,
	minbodytemp: 0,
	maxbodytemp: 1500,
	obj_damage: 0,
	environment_smash: 0,
	stop_automated_movement: 1,
});

// colossus.dm:631
rt.def("/mob/living/simple_animal/hostile/lightgeist/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("oscillates");
	this.damage_coeff = rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]);

	this.faction = list("neutral");
	return f.dot;
});

// colossus.dm:662
rt.def("/mob/living/simple_animal/hostile/lightgeist/proc/Initialize", function* Initialize(f: Frame) {
	let medsensor: Value = null;
	f.dot = (yield* parent_proc());
	this.verbs -= P("/mob/living/verb/pulled");
	this.verbs -= P("/mob/verb/me_verb");
	(medsensor = rt.index(GLOB.huds, DATA_HUD_MEDICAL_ADVANCED)).add_hud_to(this);
	return f.dot;
}, true);

// colossus.dm:669
rt.def("/mob/living/simple_animal/hostile/lightgeist/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null;
	f.dot = (yield* parent_proc());
	if (!(rt.istype(this.target, T("/mob/living")) && this.target != this)) return f.dot;
	if ((L = this.target).stat == 2) return f.dot;
	yield* L.heal_overall_damage(this.heal_power, this.heal_power);
	yield* new_(T("/obj/effect/temp_visual/heal"), rt.getStep(f, this.target, 0), "#80F5FF");
	return f.dot;
}, true);

// colossus.dm:677
rt.def("/mob/living/simple_animal/hostile/lightgeist/proc/ghostize", function* ghostize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.death();
	return f.dot;
}, true);

rt.type(10953, "/obj/machinery/anomalous_crystal/refresher", "/obj/machinery/anomalous_crystal", {
	banned_items_typecache: null,
	observer_desc: "This crystal \"refreshes\" items that it affects, rendering them as new.",
	activation_method: "touch",
	cooldown_add: 50,
	activation_sound: rt.rsc("sound/magic/timeparadox2.ogg"),
});

// colossus.dm:687
rt.def("/obj/machinery/anomalous_crystal/refresher/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.banned_items_typecache = list(T("/obj/item/weapon/storage"), T("/obj/item/weapon/implant"), T("/obj/item/weapon/implanter"), T("/obj/item/weapon/disk/nuclear"), T("/obj/item/projectile"), T("/obj/item/weapon/spellbook"));
	return f.dot;
});

// colossus.dm:690
rt.def("/obj/machinery/anomalous_crystal/refresher/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.banned_items_typecache = typecacheof(this.banned_items_typecache);
	return f.dot;
}, true);

// colossus.dm:695
rt.def("/obj/machinery/anomalous_crystal/refresher/proc/ActivationReaction", function* ActivationReaction(f: Frame, user: Value, method: Value) {
	let _T: Value = null, i: Value = null, W: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	let L: Value = list();
	yield* new_(T("/obj/effect/temp_visual/emp/pulse"), (_T = rt.getStep(f, this, this.dir)));
	for (i of each(_T)) {
		if (rt.istype(i, T("/obj/item")) && !is_type_in_typecache(i, this.banned_items_typecache)) {
			if (!(W = i).admin_spawned) {
				L += W;
			}
		}
	}
	if (!rt.len(f, L)) return f.dot;
	let CHOSEN: Value = pick(L);
	yield* new_(CHOSEN.type, _T);
	yield* qdel(CHOSEN);
	return f.dot;
}, true);

rt.type(10954, "/obj/machinery/anomalous_crystal/possessor", "/obj/machinery/anomalous_crystal", {
	observer_desc: "When activated, this crystal allows you to take over small animals, and then exit them at the possessors leisure. Exiting the animal kills it, and if you die while possessing the animal, you die as well.",
	activation_method: "touch",
});

// colossus.dm:714
rt.def("/obj/machinery/anomalous_crystal/possessor/proc/ActivationReaction", function* ActivationReaction(f: Frame, user: Value, method: Value) {
	let A: Value = null, S: Value = null;
	let $e: any;
	if (!(yield* parent_proc())) return f.dot;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) return f.dot;
	let mobcheck: Value = 0;
	rt.forList(f, 0, range(1, this), T("/mob/living/simple_animal"));
	if (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (!(A.melee_damage_upper > 5 || A.mob_size >= MOB_SIZE_LARGE || A.ckey || A.stat)) {
			S = (yield* new_(T("/obj/structure/closet/stasis"), A));
			yield* user.forceMove(S);
			mobcheck = 1;
		}
	}
	rt.endFor(f, 0);
	if (mobcheck) return f.dot;
	yield* new_(T("/mob/living/simple_animal/cockroach"), rt.getStep(f, this, this.dir));
	return f.dot;
}, true);

rt.type(12409, "/obj/structure/closet/stasis", "/obj/structure/closet", {
	holder_animal: null,
	anchored: 1,
	name: "quantum entanglement stasis warp field",
	desc: "You can hardly comprehend this thing... which is why you can't see it.",
	icon_state: null,
	density: 1,
	obj_integrity: 999,
});

// colossus.dm:738
rt.def("/obj/structure/closet/stasis/proc/process", function* process(f: Frame) {
	if (!this.holder_animal) return f.dot;
	if (this.holder_animal.stat != 2) return f.dot;
	yield* this.dump_contents();
	yield* this.holder_animal.gib();
	return f.dot;
}, true, { waitfor: false });

// colossus.dm:744
rt.def("/obj/structure/closet/stasis/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (rt.istype(this.loc, T("/mob/living/simple_animal"))) {
		this.holder_animal = this.loc;
	}
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// colossus.dm:750
rt.def("/obj/structure/closet/stasis/proc/Entered", function* Entered(f: Frame, A: Value) {
	let L: Value = null;
	if (!(rt.istype(A, T("/mob/living")) && this.holder_animal)) return f.dot;
	(L = A).notransform = 1;
	(rt.modField(f, L, "disabilities", 2, rt.bitOr));
	(rt.modField(f, L, "status_flags", 4096, rt.bitOr));
	yield* L.mind.transfer_to(this.holder_animal);
	let _P: Value = (yield* new_(T("/obj/effect/proc_holder/spell/targeted/exit_possession")));
	yield* this.holder_animal.mind.AddSpell(_P);
	this.holder_animal.verbs -= P("/mob/living/verb/pulled");
	return f.dot;
}, true);

// colossus.dm:761
rt.def("/obj/structure/closet/stasis/proc/dump_contents", function* dump_contents(f: Frame) {
	let L: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	for (L of each(this, T("/mob/living"))) {
		(rt.modField(f, L, "disabilities", 16777213, rt.bitAnd));
		(rt.modField(f, L, "status_flags", 16773119, rt.bitAnd));
		L.notransform = 0;
		if (this.holder_animal) {
			yield* this.holder_animal.mind.transfer_to(L);
			yield* L.mind.RemoveSpell(T("/obj/effect/proc_holder/spell/targeted/exit_possession"));
		}
		if (f.args[0] || !rt.istype(this.loc, T("/mob/living/simple_animal"))) {
			yield* L.death(0);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["kill"] });

rt.type(11280, "/obj/effect/proc_holder/spell/targeted/exit_possession", "/obj/effect/proc_holder/spell/targeted", {
	name: "Exit Possession",
	desc: "Exits the body you are possessing",
	charge_max: 60,
	clothes_req: 0,
	invocation_type: "none",
	max_targets: 1,
	range: -1,
	include_user: 1,
	selection_type: "view",
	action_icon_state: "exit_possession",
	sound: null,
});

// colossus.dm:793
rt.def("/obj/effect/proc_holder/spell/targeted/exit_possession/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let i: Value = null, S: Value = null;
	user ??= f.usr;
	if (!rt.istype(user.loc, T("/turf/open/floor"))) {
		return f.dot;
	}
	let target_mind: Value = user.mind;
	for (i of each(user)) {
		if (rt.istype(i, T("/obj/structure/closet/stasis"))) {
			yield* (S = i).dump_contents(0);
			yield* qdel(S);
			break;
		}
	}
	yield* user.gib();
	yield* target_mind.RemoveSpell(T("/obj/effect/proc_holder/spell/targeted/exit_possession"));
	return f.dot;
}, true);
