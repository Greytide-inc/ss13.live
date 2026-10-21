// Types declared in code/game/gamemodes/clock_cult that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(1226, "/datum/clockwork_scripture/ranged_ability/judicial_marker", "/datum/clockwork_scripture/ranged_ability", {
	name: "Judicial Marker",
	invocations: null,
	channel_time: 30,
	primary_component: "belligerent_eye",
	quickbind_desc: "Allows you to place a Judicial Marker to knock down and damage non-Servants in an area.<br><b>Click your slab to disable.</b>",
	slab_icon: "judicial",
	ranged_message: "<span class='neovgre_small'><i>You charge the clockwork slab with judicial force.</i>\n<b>Left-click a target to place a Judicial Marker!\nClick your slab to cancel.</b></span>",
	timeout_time: 50,
	ranged_type: rt.typePath("/obj/effect/proc_holder/slab/judicial"),
});
rt.type(1229, "/datum/clockwork_scripture/ranged_ability/volt_ray", "/datum/clockwork_scripture/ranged_ability", {
	name: "Volt Ray",
	slab_icon: "volt",
	allow_mobility: 0,
	ranged_message: "<span class='nzcrentr_small'><i>You charge the clockwork slab with shocking might.</i>\n<b>Left-click a target to fire, quickly!</b></span>",
	timeout_time: 20,
	ranged_type: rt.typePath("/obj/effect/proc_holder/slab/volt"),
});
