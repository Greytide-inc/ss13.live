// Types declared in code/modules/mob/living/simple_animal/hostile that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(4905, "/mob/living/simple_animal/hostile/carp/holocarp", "/mob/living/simple_animal/hostile/carp", {
	icon_state: "holocarp",
	icon_living: "holocarp",
	maxbodytemp: 1e+31,
	gold_core_spawnable: 0,
	del_on_death: 1,
});
rt.type(4906, "/mob/living/simple_animal/hostile/carp/megacarp", "/mob/living/simple_animal/hostile/carp", {
	icon: rt.rsc("icons/mob/broadMobs.dmi"),
	name: "Mega Space Carp",
	desc: "A ferocious, fang bearing creature that resembles a shark. This one seems especially ticked off.",
	icon_state: "megacarp",
	icon_living: "megacarp",
	icon_dead: "megacarp_dead",
	icon_gib: "megacarp_gib",
	maxHealth: 65,
	health: 65,
	pixel_x: -16,
	mob_size: 3,
	obj_damage: 80,
	melee_damage_lower: 20,
	melee_damage_upper: 20,
});
rt.type(4916, "/mob/living/simple_animal/hostile/poison/giant_spider/hunter", "/mob/living/simple_animal/hostile/poison/giant_spider", {
	poison_per_bite: 5,
	desc: "Furry and black, it makes you shudder to look at it. This one has sparkling purple eyes.",
	icon_state: "hunter",
	icon_living: "hunter",
	icon_dead: "hunter_dead",
	maxHealth: 120,
	health: 120,
	melee_damage_lower: 10,
	melee_damage_upper: 20,
	move_to_delay: 5,
});
rt.type(4945, "/mob/living/simple_animal/hostile/alien/sentinel", "/mob/living/simple_animal/hostile/alien", {
	name: "alien sentinel",
	icon_state: "aliens",
	icon_living: "aliens",
	icon_dead: "aliens_dead",
	health: 150,
	maxHealth: 150,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	ranged: 1,
	retreat_distance: 5,
	minimum_distance: 5,
	projectiletype: rt.typePath("/obj/item/projectile/neurotox"),
	projectilesound: rt.rsc("sound/weapons/pierce.ogg"),
});
rt.type(4951, "/mob/living/simple_animal/hostile/bear/Hudson", "/mob/living/simple_animal/hostile/bear", {
	name: "Hudson",
	gender: "male",
	desc: "Feared outlaw, this guy is one bad news bear.",
});
rt.type(4952, "/mob/living/simple_animal/hostile/bear/snow", "/mob/living/simple_animal/hostile/bear", {
	name: "space polar bear",
	icon_state: "snowbear",
	icon_living: "snowbear",
	icon_dead: "snowbear_dead",
	desc: "It's a polar bear, in space, but not actually in space.",
});
rt.type(4954, "/mob/living/simple_animal/hostile/bear/fightpit", "/mob/living/simple_animal/hostile/bear", {
	name: "fight pit bear",
	desc: "This bear's trained through ancient Russian secrets to fear the walls of its glass prison.",
	environment_smash: 0,
});
rt.type(4959, "/mob/living/simple_animal/hostile/hivebot/range", "/mob/living/simple_animal/hostile/hivebot", {
	name: "hivebot",
	desc: "A smallish robot, this one is armed!",
	icon_state: "ranged",
	icon_living: "ranged",
	icon_dead: "ranged",
	ranged: 1,
	retreat_distance: 5,
	minimum_distance: 5,
});
rt.type(4960, "/mob/living/simple_animal/hostile/hivebot/rapid", "/mob/living/simple_animal/hostile/hivebot", {
	icon_state: "ranged",
	icon_living: "ranged",
	icon_dead: "ranged",
	ranged: 1,
	rapid: 1,
	retreat_distance: 5,
	minimum_distance: 5,
});
rt.type(4961, "/mob/living/simple_animal/hostile/hivebot/strong", "/mob/living/simple_animal/hostile/hivebot", {
	name: "strong hivebot",
	icon_state: "strong",
	icon_living: "strong",
	icon_dead: "strong",
	desc: "A robot, this one is armed and looks tough!",
	health: 80,
	maxHealth: 80,
	ranged: 1,
});
rt.type(4963, "/mob/living/simple_animal/hostile/illusion/escape", "/mob/living/simple_animal/hostile/illusion", {
	retreat_distance: 10,
	minimum_distance: 10,
	melee_damage_lower: 0,
	melee_damage_upper: 0,
	speed: -1,
	obj_damage: 0,
	environment_smash: 0,
});
rt.type(4992, "/mob/living/simple_animal/hostile/stickman/dog", "/mob/living/simple_animal/hostile/stickman", {
	name: "Angry Stick Dog",
	desc: "Stickman's best friend, if he could see him at least.",
	icon_state: "stickdog",
	icon_living: "stickdog",
	icon_dead: "stickdog_dead",
});
rt.type(11277, "/obj/effect/proc_holder/spell/targeted/night_vision/revenant", "/obj/effect/proc_holder/spell/targeted/night_vision", {
	charge_max: 0,
	panel: "Revenant Abilities",
	message: "<span class='revennotice'>You toggle your night vision.</span>",
	action_icon_state: "r_nightvision",
	action_background_icon_state: "bg_revenant",
});
