// Types declared in code/modules/mob/living/simple_animal/friendly/drone that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";

rt.type(4843, "/mob/living/simple_animal/drone/cogscarab/ratvar", "/mob/living/simple_animal/drone/cogscarab", {
	default_storage: rt.typePath("/obj/item/weapon/storage/toolbox/brass/prefilled/ratvar"),
});
rt.type(4844, "/mob/living/simple_animal/drone/cogscarab/admin", "/mob/living/simple_animal/drone/cogscarab", {
	default_storage: rt.typePath("/obj/item/weapon/storage/toolbox/brass/prefilled/ratvar/admin"),
});
rt.type(4850, "/mob/living/simple_animal/drone/derelict", "/mob/living/simple_animal/drone", {
	name: "derelict drone",
	default_hatmask: rt.typePath("/obj/item/clothing/head/ushanka"),
});
rt.type(10124, "/obj/item/drone_shell/syndrone", "/obj/item/drone_shell", {
	drone_type: rt.typePath("/mob/living/simple_animal/drone/syndrone"),
	name: "syndrone shell",
	desc: "A shell of a syndrone, a modified maintenance drone designed to infiltrate and annihilate.",
	icon_state: "syndrone_item",
});
rt.type(10125, "/obj/item/drone_shell/syndrone/badass", "/obj/item/drone_shell/syndrone", {
	drone_type: rt.typePath("/mob/living/simple_animal/drone/syndrone/badass"),
	name: "badass syndrone shell",
});
rt.type(10126, "/obj/item/drone_shell/snowflake", "/obj/item/drone_shell", {
	drone_type: rt.typePath("/mob/living/simple_animal/drone/snowflake"),
	name: "snowflake drone shell",
	desc: "A shell of a snowflake drone, a maintenance drone with a built in holographic projector to display hats and masks.",
});
rt.type(10127, "/obj/item/drone_shell/dusty", "/obj/item/drone_shell", {
	drone_type: rt.typePath("/mob/living/simple_animal/drone/derelict"),
	name: "derelict drone shell",
	desc: "A long-forgotten drone shell. It seems kind of... Space Russian.",
});
