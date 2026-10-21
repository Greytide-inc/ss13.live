// Types declared in code/game/gamemodes/blob/blobs that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(4857, "/mob/living/simple_animal/hostile/blob/blobbernaut/independent", "/mob/living/simple_animal/hostile/blob/blobbernaut", {
	independent: 1,
	gold_core_spawnable: 1,
});
rt.type(4859, "/mob/living/simple_animal/hostile/blob/blobspore/weak", "/mob/living/simple_animal/hostile/blob/blobspore", {
	death_cloud_size: 0,
	name: "fragile blob spore",
	health: 15,
	maxHealth: 15,
	melee_damage_lower: 1,
	melee_damage_upper: 2,
});
rt.type(12146, "/obj/structure/blob/shield/core", "/obj/structure/blob/shield", {
	point_return: 0,
});
