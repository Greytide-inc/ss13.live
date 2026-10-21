// Types declared in code/modules/mob/living/simple_animal/hostile/mining_mobs that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";

rt.type(4930, "/mob/living/simple_animal/hostile/spawner/lavaland/goliath", "/mob/living/simple_animal/hostile/spawner/lavaland", {
	mob_type: rt.typePath("/mob/living/simple_animal/hostile/asteroid/goliath/beast/tendril"),
});
rt.type(4931, "/mob/living/simple_animal/hostile/spawner/lavaland/legion", "/mob/living/simple_animal/hostile/spawner/lavaland", {
	mob_type: rt.typePath("/mob/living/simple_animal/hostile/asteroid/hivelord/legion/tendril"),
});
rt.type(5003, "/mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion/advanced", "/mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion", {
	stat_attack: 2,
	can_infest_dead: 1,
});
rt.type(5006, "/mob/living/simple_animal/hostile/asteroid/basilisk/watcher/tendril", "/mob/living/simple_animal/hostile/asteroid/basilisk/watcher", {
	fromtendril: 1,
});
rt.type(5010, "/mob/living/simple_animal/hostile/asteroid/goliath/beast/tendril", "/mob/living/simple_animal/hostile/asteroid/goliath/beast", {
	fromtendril: 1,
});
rt.type(5016, "/mob/living/simple_animal/hostile/asteroid/hivelord/legion/tendril", "/mob/living/simple_animal/hostile/asteroid/hivelord/legion", {
	fromtendril: 1,
});
rt.type(5017, "/mob/living/simple_animal/hostile/asteroid/hivelord/legion/advanced", "/mob/living/simple_animal/hostile/asteroid/hivelord/legion", {
	stat_attack: 2,
	brood_type: rt.typePath("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion/advanced"),
	maxHealth: 120,
	health: 120,
	icon_state: "dwarf_legion",
	icon_living: "dwarf_legion",
	icon_aggro: "dwarf_legion",
	icon_dead: "dwarf_legion",
});
