// Types declared in code/datums/status_effects that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(929, "/datum/status_effect/incapacitating/stun", "/datum/status_effect/incapacitating", {
	id: "stun",
});
rt.type(930, "/datum/status_effect/incapacitating/knockdown", "/datum/status_effect/incapacitating", {
	id: "knockdown",
});
rt.type(931, "/datum/status_effect/incapacitating/unconscious", "/datum/status_effect/incapacitating", {
	needs_update_stat: 1,
	id: "unconscious",
});
rt.type(936, "/datum/status_effect/cultghost", "/datum/status_effect", {
	id: "cult_ghost",
	duration: -1,
	alert_type: null,
});
rt.type(941, "/datum/status_effect/crusher_damage", "/datum/status_effect", {
	total_damage: 0,
	id: "crusher_damage",
	duration: -1,
	status_type: 1,
	alert_type: null,
});
