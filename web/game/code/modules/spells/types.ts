// Types declared in code/modules/spells that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(11298, "/obj/effect/proc_holder/spell/targeted/smoke", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 1,
	name: "Smoke",
	desc: "This spell spawns a cloud of choking smoke at your location and does not require wizard garb.",
	school: "conjuration",
	charge_max: 120,
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	range: -1,
	cooldown_min: 20,
	smoke_spread: 2,
	smoke_amt: 4,
	action_icon_state: "smoke",
});
rt.type(11299, "/obj/effect/proc_holder/spell/targeted/smoke/disable", "/obj/effect/proc_holder/spell/targeted/smoke", {
	include_user: 1,
	name: "Paralysing Smoke",
	desc: "This spell spawns a cloud of paralysing smoke.",
	school: "conjuration",
	charge_max: 200,
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	range: -1,
	cooldown_min: 20,
	smoke_spread: 3,
	smoke_amt: 4,
	action_icon_state: "parasmoke",
	action_background_icon_state: "bg_cult",
});
rt.type(11300, "/obj/effect/proc_holder/spell/targeted/smoke/lesser", "/obj/effect/proc_holder/spell/targeted/smoke", {
	include_user: 1,
	name: "Smoke",
	desc: "This spell spawns a small cloud of choking smoke at your location.",
	school: "conjuration",
	charge_max: 360,
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	range: -1,
	smoke_spread: 1,
	smoke_amt: 2,
	action_icon_state: "smoke",
});
rt.type(11327, "/obj/effect/proc_holder/spell/targeted/mime", "/obj/effect/proc_holder/spell/targeted", {});
