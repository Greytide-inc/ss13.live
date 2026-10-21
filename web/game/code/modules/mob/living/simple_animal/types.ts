// Types declared in code/modules/mob/living/simple_animal that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(4865, "/mob/living/simple_animal/hostile/construct/armored/hostile", "/mob/living/simple_animal/hostile/construct/armored", {
	AIStatus: 1,
	environment_smash: 1,
});
rt.type(4867, "/mob/living/simple_animal/hostile/construct/wraith/hostile", "/mob/living/simple_animal/hostile/construct/wraith", {
	AIStatus: 1,
});
rt.type(4869, "/mob/living/simple_animal/hostile/construct/builder/hostile", "/mob/living/simple_animal/hostile/construct/builder", {
	AIStatus: 1,
	environment_smash: 1,
});
rt.type(4924, "/mob/living/simple_animal/hostile/spawner/mining/goliath", "/mob/living/simple_animal/hostile/spawner/mining", {
	name: "goliath den",
	desc: "A den housing a nest of goliaths, oh god why?",
	mob_type: rt.typePath("/mob/living/simple_animal/hostile/asteroid/goliath"),
});
rt.type(4925, "/mob/living/simple_animal/hostile/spawner/mining/hivelord", "/mob/living/simple_animal/hostile/spawner/mining", {
	name: "hivelord den",
	desc: "A den housing a nest of hivelords.",
	mob_type: rt.typePath("/mob/living/simple_animal/hostile/asteroid/hivelord"),
});
rt.type(4926, "/mob/living/simple_animal/hostile/spawner/mining/basilisk", "/mob/living/simple_animal/hostile/spawner/mining", {
	name: "basilisk den",
	desc: "A den housing a nest of basilisks, bring a coat.",
	mob_type: rt.typePath("/mob/living/simple_animal/hostile/asteroid/basilisk"),
});
rt.type(4927, "/mob/living/simple_animal/hostile/spawner/mining/wumborian", "/mob/living/simple_animal/hostile/spawner/mining", {
	name: "wumborian fugu den",
	desc: "A den housing a nest of wumborian fugus, how do they all even fit in there?",
	mob_type: rt.typePath("/mob/living/simple_animal/hostile/asteroid/fugu"),
});
