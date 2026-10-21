// Types declared in code/game/objects/effects/spawners that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(11837, "/obj/effect/spawner/newbomb/timer", "/obj/effect/spawner/newbomb", {
	assembly_type: rt.typePath("/obj/item/device/assembly/timer"),
});
rt.type(11838, "/obj/effect/spawner/newbomb/timer/syndicate", "/obj/effect/spawner/newbomb/timer", {
	btemp1: 150,
	btemp2: 20,
});
rt.type(11839, "/obj/effect/spawner/newbomb/proximity", "/obj/effect/spawner/newbomb", {
	assembly_type: rt.typePath("/obj/item/device/assembly/prox_sensor"),
});
rt.type(11840, "/obj/effect/spawner/newbomb/radio", "/obj/effect/spawner/newbomb", {
	assembly_type: rt.typePath("/obj/item/device/assembly/signaler"),
});
rt.type(11842, "/obj/effect/spawner/bundle/costume", "/obj/effect/spawner/bundle", {});
rt.type(11875, "/obj/effect/spawner/lootdrop/minor", "/obj/effect/spawner/lootdrop", {});
