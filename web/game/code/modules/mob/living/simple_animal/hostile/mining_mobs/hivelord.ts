// From code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5014, "/mob/living/simple_animal/hostile/asteroid/hivelord", "/mob/living/simple_animal/hostile/asteroid", {
	brood_type: rt.typePath("/mob/living/simple_animal/hostile/asteroid/hivelordbrood"),
	move_to_delay: 14,
	ranged: 1,
	vision_range: 5,
	aggro_vision_range: 9,
	idle_vision_range: 5,
	ranged_cooldown: 0,
	ranged_cooldown_time: 20,
	retreat_distance: 3,
	minimum_distance: 3,
	pass_flags: 1,
	name: "hivelord",
	desc: "A truly alien creature, it is a mass of unknown organic material, constantly fluctuating. When attacking, pieces of it split off and attack in tandem with the original.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "Hivelord",
	icon_living: "Hivelord",
	icon_aggro: "Hivelord_alert",
	icon_dead: "Hivelord_dead",
	icon_gib: "syndicate_gib",
	mouse_opacity: 2,
	speed: 3,
	maxHealth: 75,
	health: 75,
	harm_intent_damage: 5,
	melee_damage_lower: 0,
	melee_damage_upper: 0,
	attacktext: "lashes out at",
	speak_emote: null,
	attack_sound: rt.rsc("sound/weapons/pierce.ogg"),
	throw_message: "falls right through the strange body of the",
	obj_damage: 0,
	environment_smash: 0,
	loot: null,
});

// /mob/living/simple_animal/hostile/asteroid/hivelord/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:23)
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelord/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("telepathically cries"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/item/organ/regenerative_core")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/hivelord/proc/OpenFire  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:37)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelord/proc/OpenFire", function* OpenFire(f: Frame, the_target: Value) {
	let A: Value = null;
	f.vars = () => [the_target, A];
	if (!rt.ge(rt.worldTime(f), rt.sv(f, "ranged_cooldown"))) return f.dot;
	rt.setFv(f, "admin_spawned", (A = (yield* g.new_(f, rt.sv(f, "brood_type"), [rt.fv(f, "loc", live(f.src))]))), rt.sv(f, "admin_spawned"));
	yield* g.callName(f, live(A), "GiveTarget", [rt.sv(f, "target")]);
	rt.setFv(f, "friends", live(A), rt.sv(f, "friends"));
	rt.setFv(f, "faction", live(A), (yield* g.callName(f, rt.sv(f, "faction"), "Copy", [])));
	rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), rt.sv(f, "ranged_cooldown_time")));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/asteroid/hivelord/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:46)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelord/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	yield* g.srcCall(f, "OpenFire");
	return 1;
}, true);

// /mob/living/simple_animal/hostile/asteroid/hivelord/proc/spawn_crusher_loot  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:50)
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelord/proc/spawn_crusher_loot", function spawn_crusher_loot(f: Frame) {
	rt.modSrcVar(f, "loot", rt.sv(f, "crusher_loot"), add);
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/hivelord/proc/death  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:54)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelord/proc/death", function* death(f: Frame, gibbed: Value) {
	f.vars = () => [gibbed];
	rt.setSv(f, "mouse_opacity", 1);
	yield* g.callSuper(f, [live(gibbed)]);
	return f.dot;
}, true);

rt.type(5000, "/mob/living/simple_animal/hostile/asteroid/hivelordbrood", "/mob/living/simple_animal/hostile/asteroid", {
	move_to_delay: 1,
	vision_range: 10,
	pass_flags: 1,
	name: "hivelord brood",
	desc: "A fragment of the original Hivelord, rallying behind its original. One isn't much of a threat, but...",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "Hivelordbrood",
	icon_living: "Hivelordbrood",
	icon_aggro: "Hivelordbrood",
	icon_dead: "Hivelordbrood",
	icon_gib: "syndicate_gib",
	mouse_opacity: 2,
	friendly: "buzzes near",
	speed: 3,
	maxHealth: 1,
	health: 1,
	movement_type: 2,
	harm_intent_damage: 5,
	melee_damage_lower: 2,
	melee_damage_upper: 2,
	attacktext: "slashes",
	speak_emote: null,
	attack_sound: rt.rsc("sound/weapons/pierce.ogg"),
	throw_message: "falls right through the strange body of the",
	obj_damage: 0,
	environment_smash: 0,
	del_on_death: 1,
});

// /mob/living/simple_animal/hostile/asteroid/hivelordbrood/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:78)
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("telepathically cries"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/hivelordbrood/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:87)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/asteroid/proc/death")])), 100]);
	return f.dot;
}, true);

rt.type(5015, "/mob/living/simple_animal/hostile/asteroid/hivelord/legion", "/mob/living/simple_animal/hostile/asteroid/hivelord", {
	stored_mob: null,
	brood_type: rt.typePath("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion"),
	stat_attack: 1,
	robust_searching: 1,
	name: "legion",
	desc: "You can still see what was once a human under the shifting mass of corruption.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "legion",
	icon_living: "legion",
	icon_aggro: "legion",
	icon_dead: "legion",
	icon_gib: "syndicate_gib",
	obj_damage: 60,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	attacktext: "lashes out at",
	speak_emote: null,
	attack_sound: rt.rsc("sound/weapons/pierce.ogg"),
	throw_message: "bounces harmlessly off of",
	crusher_loot: rt.typePath("/obj/item/crusher_trophy/legion_skull"),
	loot: null,
	del_on_death: 1,
});

// /mob/living/simple_animal/hostile/asteroid/hivelord/legion/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:104)
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelord/legion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("echoes"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/item/organ/regenerative_core/legion")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/hivelord/legion/proc/death  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:116)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelord/legion/proc/death", function* death(f: Frame, gibbed: Value) {
	let _T: Value = null;
	f.vars = () => [gibbed, _T];
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>The skulls on ＀ wail in anger as they flee from their dying host!</span>", [live(f.src)]));
	if (truthy((_T = rt.getStep(f, live(f.src), 0)))) {
		if (truthy(rt.sv(f, "stored_mob"))) {
			yield* g.callName(f, rt.sv(f, "stored_mob"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
			rt.setSv(f, "stored_mob", null);
		} else {
			if (truthy(rt.sv(f, "fromtendril"))) {
				yield* g.new_(f, T("/obj/effect/mob_spawn/human/corpse/charredskeleton"), [live(_T)]);
			} else {
				yield* g.new_(f, T("/obj/effect/mob_spawn/human/corpse/damaged/legioninfested"), [live(_T)]);
			}
		}
	}
	yield* g.callSuper(f, [live(gibbed)]);
	return f.dot;
}, true);

rt.type(5002, "/mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion", "/mob/living/simple_animal/hostile/asteroid/hivelordbrood", {
	can_infest_dead: 0,
	vision_range: 10,
	pass_flags: 1,
	stat_attack: 1,
	robust_searching: 1,
	name: "legion",
	desc: "One of many.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "legion_head",
	icon_living: "legion_head",
	icon_aggro: "legion_head",
	icon_dead: "legion_head",
	icon_gib: "syndicate_gib",
	friendly: "buzzes near",
	maxHealth: 1,
	health: 5,
	harm_intent_damage: 5,
	melee_damage_lower: 12,
	melee_damage_upper: 12,
	attacktext: "bites",
	speak_emote: null,
	attack_sound: rt.rsc("sound/weapons/pierce.ogg"),
	throw_message: "is shrugged off by",
	del_on_death: 1,
});

// /mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:149)
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("echoes"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion/proc/Life  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:159)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion/proc/Life", function* Life(f: Frame) {
	let H: Value = null;
	let $e: any;
	f.vars = () => [H, $e];
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		H = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [live(f.src), 1])), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			if ((isEqual(rt.fv(f, "stat", live(H)), 1) || (truthy(rt.sv(f, "can_infest_dead")) && isEqual(rt.fv(f, "stat", live(H)), 2)))) {
				yield* g.srcCall(f, "infest", live(H));
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion/proc/infest  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:166)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion/proc/infest", function* infest(f: Frame, H: Value) {
	let L: Value = null;
	f.vars = () => [H, L];
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ burrows into the flesh of ＀!</span>", [rt.sv(f, "name"), live(H)]));
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ staggers to their feet!</span>", [(L = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/asteroid/hivelord/legion"), [rt.fv(f, "loc", live(H))])))]));
	yield* g.callName(f, live(H), "death", []);
	yield* g.callName(f, live(H), "adjustBruteLoss", [1000]);
	rt.setFv(f, "stored_mob", live(L), live(H));
	yield* g.callName(f, live(H), "forceMove", [live(L)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(4928, "/mob/living/simple_animal/hostile/spawner/legion", "/mob/living/simple_animal/hostile/spawner", {
	max_mobs: 3,
	spawn_time: 200,
	spawn_text: "peels itself off from",
	anchored: 0,
	name: "legion",
	desc: "One of many.",
	icon: rt.rsc("icons/mob/lavaland/64x64megafauna.dmi"),
	icon_state: "legion",
	icon_living: "legion",
	icon_dead: "legion",
	health: 450,
	maxHealth: 450,
	mob_type: rt.typePath("/mob/living/simple_animal/hostile/asteroid/hivelord/legion"),
	melee_damage_lower: 20,
	melee_damage_upper: 20,
	AIStatus: 1,
	stop_automated_movement: 0,
	wander: 1,
	maxbodytemp: 1e+31,
	layer: 4,
	del_on_death: 1,
	sentience_type: 5,
	loot: null,
	move_to_delay: 14,
	vision_range: 5,
	aggro_vision_range: 9,
	idle_vision_range: 5,
	speed: 3,
	faction: null,
	weather_immunities: null,
	obj_damage: 30,
	environment_smash: 1,
	see_in_dark: 8,
	lighting_alpha: 128,
});

// /mob/living/simple_animal/hostile/spawner/legion/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:214)
rt.def("/mob/living/simple_animal/hostile/spawner/legion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/organ/regenerative_core/legion"), 3, T("/obj/effect/mob_spawn/human/corpse/damaged/legioninfested"), 5]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("mining"));
	rt.setSv(f, "weather_immunities", rt.list("lava", "ash"));
	return f.dot;
});

rt.type(11979, "/obj/effect/mob_spawn/human/corpse/damaged/legioninfested", "/obj/effect/mob_spawn/human/corpse/damaged", {});

// /obj/effect/mob_spawn/human/corpse/damaged/legioninfested/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mining_mobs/hivelord.dm:240)  may sleep
rt.def("/obj/effect/mob_spawn/human/corpse/damaged/legioninfested/proc/Initialize", function* Initialize(f: Frame) {
	let type: Value = null;
	let $0: any;
	f.vars = () => [type, $0];
	$0 = (type = (yield* g.call(f, P("/proc/pickweight"), null, [rt.alist(f, ["Miner", 66, "Ashwalker", 10, "Golem", 10, "Clown", 10, rt.op(f, "PickUnweighted", [1], [rt.list("Shadow", "YeOlde", "Operative", "Cultist")]), 4])])));
	if ($0 === "Miner") {
		rt.setSv(f, "mob_species", (yield* g.call(f, P("/proc/pickweight"), null, [rt.alist(f, [T("/datum/species/human"), 70, T("/datum/species/lizard"), 26, T("/datum/species/fly"), 2, T("/datum/species/plasmaman"), 2])])));
		if (isEqual(rt.sv(f, "mob_species"), T("/datum/species/plasmaman"))) {
			rt.setSv(f, "uniform", T("/obj/item/clothing/under/plasmaman"));
			rt.setSv(f, "head", T("/obj/item/clothing/head/helmet/space/plasmaman"));
			rt.setSv(f, "belt", T("/obj/item/weapon/tank/internals/plasmaman/belt"));
		} else {
			rt.setSv(f, "uniform", T("/obj/item/clothing/under/rank/miner/lavaland"));
			if (truthy(rt.op(f, "Prob", [], [4]))) {
				rt.setSv(f, "belt", (yield* g.call(f, P("/proc/pickweight"), null, [rt.alist(f, [T("/obj/item/weapon/storage/belt/mining"), 2, T("/obj/item/weapon/storage/belt/mining/alt"), 2])])));
			} else {
				if (truthy(rt.op(f, "Prob", [], [10]))) {
					rt.setSv(f, "belt", (yield* g.call(f, P("/proc/pickweight"), null, [rt.alist(f, [T("/obj/item/weapon/pickaxe"), 8, T("/obj/item/weapon/pickaxe/mini"), 4, T("/obj/item/weapon/pickaxe/silver"), 2, T("/obj/item/weapon/pickaxe/diamond"), 1])])));
				} else {
					rt.setSv(f, "belt", T("/obj/item/weapon/tank/internals/emergency_oxygen/engi"));
				}
			}
		}
		if (!isEqual(rt.sv(f, "mob_species"), T("/datum/species/lizard"))) {
			rt.setSv(f, "shoes", T("/obj/item/clothing/shoes/workboots/mining"));
		}
		rt.setSv(f, "gloves", T("/obj/item/clothing/gloves/color/black"));
		rt.setSv(f, "mask", T("/obj/item/clothing/mask/gas/explorer"));
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			rt.setSv(f, "suit", (yield* g.call(f, P("/proc/pickweight"), null, [rt.alist(f, [T("/obj/item/clothing/suit/hooded/explorer"), 18, T("/obj/item/clothing/suit/hooded/cloak/goliath"), 2])])));
		}
		if (truthy(rt.op(f, "Prob", [], [30]))) {
			rt.setSv(f, "r_pocket", (yield* g.call(f, P("/proc/pickweight"), null, [rt.alist(f, [T("/obj/item/stack/marker_beacon"), 20, T("/obj/item/stack/spacecash/c1000"), 7, T("/obj/item/weapon/reagent_containers/hypospray/medipen/survival"), 2, T("/obj/item/borg/upgrade/modkit/damage"), 1])])));
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			rt.setSv(f, "l_pocket", (yield* g.call(f, P("/proc/pickweight"), null, [rt.alist(f, [T("/obj/item/stack/spacecash/c1000"), 7, T("/obj/item/weapon/reagent_containers/hypospray/medipen/survival"), 2, T("/obj/item/borg/upgrade/modkit/cooldown"), 1])])));
		}
	} else if ($0 === "Ashwalker") {
		rt.setSv(f, "mob_species", T("/datum/species/lizard/ashwalker"));
		rt.setSv(f, "uniform", T("/obj/item/clothing/under/gladiator/ash_walker"));
		if (truthy(rt.op(f, "Prob", [], [95]))) {
			rt.setSv(f, "head", T("/obj/item/clothing/head/helmet/gladiator"));
		} else {
			rt.setSv(f, "head", T("/obj/item/clothing/head/helmet/skull"));
			rt.setSv(f, "suit", T("/obj/item/clothing/suit/armor/bone"));
			rt.setSv(f, "gloves", T("/obj/item/clothing/gloves/bracer"));
		}
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			rt.setSv(f, "back", (yield* g.call(f, P("/proc/pickweight"), null, [rt.alist(f, [T("/obj/item/weapon/twohanded/bonespear"), 3, T("/obj/item/weapon/twohanded/fireaxe/boneaxe"), 2])])));
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			rt.setSv(f, "belt", T("/obj/item/weapon/storage/belt/mining/primitive"));
		}
		if (truthy(rt.op(f, "Prob", [], [30]))) {
			rt.setSv(f, "r_pocket", T("/obj/item/weapon/kitchen/knife/combat/bone"));
		}
		if (truthy(rt.op(f, "Prob", [], [30]))) {
			rt.setSv(f, "l_pocket", T("/obj/item/weapon/kitchen/knife/combat/bone"));
		}
	} else if ($0 === "Clown") {
		rt.setSv(f, "name", rt.op(f, "PickUnweighted", [1], [rt.gl("clown_names")]));
		rt.setSv(f, "outfit", T("/datum/outfit/job/clown"));
		rt.setSv(f, "belt", null);
		rt.setSv(f, "backpack_contents", rt.list());
		if (truthy(rt.op(f, "Prob", [], [70]))) {
			rt.modSrcVar(f, "backpack_contents", rt.op(f, "PickUnweighted", [1], [rt.alist(f, [T("/obj/item/weapon/stamp/clown"), 1, T("/obj/item/weapon/reagent_containers/spray/waterflower"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), 1, T("/obj/item/device/megaphone/clown"), 1, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/canned_laughter"), 1, T("/obj/item/weapon/pneumatic_cannon/pie"), 1])]), add);
		}
		if (truthy(rt.op(f, "Prob", [], [30]))) {
			rt.modSrcVar(f, "backpack_contents", rt.alist(f, [T("/obj/item/stack/sheet/mineral/bananium"), (yield* g.call(f, P("/proc/pickweight"), null, [rt.alist(f, [1, 3, 2, 2, 3, 1])]))]), add);
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			rt.setSv(f, "l_pocket", (yield* g.call(f, P("/proc/pickweight"), null, [rt.alist(f, [T("/obj/item/weapon/bikehorn/golden"), 3, T("/obj/item/weapon/bikehorn/airhorn"), 1])])));
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			rt.setSv(f, "r_pocket", T("/obj/item/weapon/implanter/sad_trombone"));
		}
	} else if ($0 === "Golem") {
		rt.setSv(f, "mob_species", rt.op(f, "PickUnweighted", [1], [rt.list(T("/datum/species/golem/adamantine"), T("/datum/species/golem/plasma"), T("/datum/species/golem/diamond"), T("/datum/species/golem/gold"), T("/datum/species/golem/silver"), T("/datum/species/golem/plasteel"), T("/datum/species/golem/titanium"), T("/datum/species/golem/plastitanium"))]));
		if (truthy(rt.op(f, "Prob", [], [30]))) {
			rt.setSv(f, "glasses", (yield* g.call(f, P("/proc/pickweight"), null, [rt.alist(f, [T("/obj/item/clothing/glasses/meson"), 2, T("/obj/item/clothing/glasses/hud/health"), 2, T("/obj/item/clothing/glasses/hud/diagnostic"), 2, T("/obj/item/clothing/glasses/science"), 2, T("/obj/item/clothing/glasses/welding"), 2, T("/obj/item/clothing/glasses/night"), 1])])));
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			rt.setSv(f, "belt", rt.op(f, "PickUnweighted", [1], [rt.list(T("/obj/item/weapon/storage/belt/mining/vendor"), T("/obj/item/weapon/storage/belt/utility/full"))]));
		}
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			rt.setSv(f, "neck", T("/obj/item/weapon/bedsheet/rd/royal_cape"));
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			rt.setSv(f, "l_pocket", rt.op(f, "PickUnweighted", [1], [rt.list(T("/obj/item/weapon/crowbar/power"), T("/obj/item/weapon/wrench/power"), T("/obj/item/weapon/weldingtool/experimental"))]));
		}
	} else if ($0 === "YeOlde") {
		rt.setSv(f, "mob_gender", "female");
		rt.setSv(f, "uniform", T("/obj/item/clothing/under/maid"));
		rt.setSv(f, "gloves", T("/obj/item/clothing/gloves/color/white"));
		rt.setSv(f, "shoes", T("/obj/item/clothing/shoes/laceup"));
		rt.setSv(f, "head", T("/obj/item/clothing/head/helmet/knight"));
		rt.setSv(f, "suit", T("/obj/item/clothing/suit/armor/riot/knight"));
		rt.setSv(f, "back", T("/obj/item/weapon/shield/riot/buckler"));
		rt.setSv(f, "belt", T("/obj/item/weapon/nullrod/claymore"));
		rt.setSv(f, "r_pocket", T("/obj/item/weapon/tank/internals/emergency_oxygen"));
		rt.setSv(f, "mask", T("/obj/item/clothing/mask/breath"));
	} else if ($0 === "Operative") {
		rt.setSv(f, "id_job", "Operative");
		rt.setSv(f, "id_access_list", rt.list(150));
		rt.setSv(f, "outfit", T("/datum/outfit/syndicatecommandocorpse"));
	} else if ($0 === "Shadow") {
		rt.setSv(f, "mob_species", T("/datum/species/shadow"));
		rt.setSv(f, "r_pocket", T("/obj/item/weapon/reagent_containers/pill/shadowtoxin"));
		rt.setSv(f, "neck", T("/obj/item/clothing/accessory/medal/plasma/nobel_science"));
		rt.setSv(f, "uniform", T("/obj/item/clothing/under/color/black"));
		rt.setSv(f, "shoes", T("/obj/item/clothing/shoes/sneakers/black"));
		rt.setSv(f, "suit", T("/obj/item/clothing/suit/toggle/labcoat"));
		rt.setSv(f, "glasses", T("/obj/item/clothing/glasses/sunglasses/blindfold"));
		rt.setSv(f, "back", T("/obj/item/weapon/tank/internals/oxygen"));
		rt.setSv(f, "mask", T("/obj/item/clothing/mask/breath"));
	} else if ($0 === "Cultist") {
		rt.setSv(f, "uniform", T("/obj/item/clothing/under/roman"));
		rt.setSv(f, "suit", T("/obj/item/clothing/suit/cultrobes"));
		rt.setSv(f, "head", T("/obj/item/clothing/head/culthood"));
		rt.setSv(f, "suit_store", T("/obj/item/weapon/tome"));
		rt.setSv(f, "r_pocket", T("/obj/item/weapon/restraints/legcuffs/bola/cult"));
		rt.setSv(f, "l_pocket", T("/obj/item/weapon/melee/cultblade/dagger"));
		rt.setSv(f, "glasses", T("/obj/item/clothing/glasses/night/cultblind"));
		rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/bottle/unholywater"), 1, T("/obj/item/device/cult_shift"), 1, T("/obj/item/device/flashlight/flare/culttorch"), 1, T("/obj/item/stack/sheet/runed_metal"), 15]));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);
