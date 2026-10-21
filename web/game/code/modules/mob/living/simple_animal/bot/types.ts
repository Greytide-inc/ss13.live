// Types declared in code/modules/mob/living/simple_animal/bot that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(5035, "/mob/living/simple_animal/bot/ed209/bluetag", "/mob/living/simple_animal/bot/ed209", {
	lasercolor: "b",
});
rt.type(5036, "/mob/living/simple_animal/bot/ed209/redtag", "/mob/living/simple_animal/bot/ed209", {
	lasercolor: "r",
});
rt.type(5039, "/mob/living/simple_animal/bot/medbot/mysterious", "/mob/living/simple_animal/bot/medbot", {
	skin: "bezerk",
	treatment_brute: "tricordrazine",
	treatment_fire: "tricordrazine",
	treatment_tox: "tricordrazine",
	name: "１Mysterious Medibot",
	desc: "International Medibot of mystery.",
});
rt.type(5040, "/mob/living/simple_animal/bot/medbot/derelict", "/mob/living/simple_animal/bot/medbot", {
	skin: "bezerk",
	heal_threshold: 0,
	declare_crit: 0,
	treatment_oxy: "pancuronium",
	treatment_brute_avoid: null,
	treatment_brute: "pancuronium",
	treatment_fire_avoid: null,
	treatment_fire: "sodium_thiopental",
	treatment_tox_avoid: null,
	treatment_tox: "sodium_thiopental",
	name: "１Old Medibot",
	desc: "Looks like it hasn't been modified since the late 2080s.",
});
rt.type(5045, "/mob/living/simple_animal/bot/secbot/pingsky", "/mob/living/simple_animal/bot/secbot", {
	radio_channel: "AI Private",
	name: "Officer Pingsky",
	desc: "It's Officer Pingsky! Delegated to satellite guard duty for harbouring anti-human sentiment.",
});
rt.type(10942, "/obj/machinery/bot_core/cleanbot", "/obj/machinery/bot_core", {
	req_one_access: null,
});
rt.type(10943, "/obj/machinery/bot_core/floorbot", "/obj/machinery/bot_core", {
	req_one_access: null,
});
rt.type(10944, "/obj/machinery/bot_core/medbot", "/obj/machinery/bot_core", {
	req_one_access: null,
});
