// Types declared in code/datums/antagonists that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(897, "/datum/antagonist/clockcult/silent", "/datum/antagonist/clockcult", {
	silent: 1,
});
rt.type(901, "/datum/antagonist/traitor/internal_affairs", "/datum/antagonist/traitor", {
	human_datum: rt.typePath("/datum/antagonist/traitor/human/internal_affairs"),
	ai_datum: rt.typePath("/datum/antagonist/traitor/AI/internal_affairs"),
	base_datum_custom: rt.typePath("/datum/antagonist/traitor/internal_affairs/custom"),
});
rt.type(902, "/datum/antagonist/traitor/internal_affairs/custom", "/datum/antagonist/traitor/internal_affairs", {
	ai_datum: rt.typePath("/datum/antagonist/traitor/AI/internal_affairs/custom"),
	human_datum: rt.typePath("/datum/antagonist/traitor/human/internal_affairs/custom"),
});
rt.type(905, "/datum/antagonist/traitor/AI/internal_affairs/custom", "/datum/antagonist/traitor/AI/internal_affairs", {
	silent: 1,
	should_give_codewords: 0,
	give_objectives: 0,
});
rt.type(906, "/datum/antagonist/traitor/AI/custom", "/datum/antagonist/traitor/AI", {
	silent: 1,
	should_give_codewords: 0,
	give_objectives: 0,
});
rt.type(909, "/datum/antagonist/traitor/human/internal_affairs/custom", "/datum/antagonist/traitor/human/internal_affairs", {
	silent: 1,
	should_give_codewords: 0,
	give_objectives: 0,
	should_equip: 0,
});
rt.type(910, "/datum/antagonist/traitor/human/custom", "/datum/antagonist/traitor/human", {
	silent: 1,
	should_equip: 0,
	should_give_codewords: 0,
	give_objectives: 0,
});
rt.type(911, "/datum/antagonist/traitor/custom", "/datum/antagonist/traitor", {
	ai_datum: rt.typePath("/datum/antagonist/traitor/AI/custom"),
	human_datum: rt.typePath("/datum/antagonist/traitor/human/custom"),
});
rt.type(914, "/datum/antagonist/ninja/friendly", "/datum/antagonist/ninja", {
	helping_station: 1,
});
rt.type(915, "/datum/antagonist/ninja/friendly/noobjective", "/datum/antagonist/ninja/friendly", {
	give_objectives: 0,
});
