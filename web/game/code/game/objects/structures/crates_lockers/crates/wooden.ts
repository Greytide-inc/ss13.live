// Based on /tg/station's code/game/objects/structures/crates_lockers/crates/wooden.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12278, "/obj/structure/closet/crate/wooden/toy", "/obj/structure/closet/crate/wooden", {
	name: "toy box",
	desc: "It has the words \"Clown + Mime\" written underneath of it with marker.",
});

// wooden.dm:13
rt.def("/obj/structure/closet/crate/wooden/toy/proc/PopulateContents", function* PopulateContents(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* new_(T("/obj/item/device/megaphone/clown"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/canned_laughter"), this);
	yield* new_(T("/obj/item/weapon/pneumatic_cannon/pie"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/pie/cream"), this);
	yield* new_(T("/obj/item/weapon/storage/crayons"), this);
	return f.dot;
}, true);
