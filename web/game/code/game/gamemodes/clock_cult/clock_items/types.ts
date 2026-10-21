// Types declared in code/game/gamemodes/clock_cult/clock_items that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(8934, "/obj/item/clockwork/alloy_shards/pinion_lock", "/obj/item/clockwork/alloy_shards", {
	clockwork_desc: "A broken gear lock for pinion airlocks.",
	name: "pinion lock",
	desc: "A dented and scratched gear. It's very heavy.",
	icon_state: "pinion_lock",
});
rt.type(8964, "/obj/item/clockwork/replica_fabricator/preloaded", "/obj/item/clockwork/replica_fabricator", {
	stored_power: 2250,
});
rt.type(8966, "/obj/item/clockwork/replica_fabricator/scarab/debug", "/obj/item/clockwork/replica_fabricator/scarab", {
	clockwork_desc: "A cogscarab's internal fabricator. It can convert nearly any object into a Ratvarian variant.",
	uses_power: 0,
	debug: 1,
});
