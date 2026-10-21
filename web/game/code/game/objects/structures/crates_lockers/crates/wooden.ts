// From code/game/objects/structures/crates_lockers/crates/wooden.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12278, "/obj/structure/closet/crate/wooden/toy", "/obj/structure/closet/crate/wooden", {
	name: "toy box",
	desc: "It has the words \"Clown + Mime\" written underneath of it with marker.",
});

// /obj/structure/closet/crate/wooden/toy/proc/PopulateContents  (code/game/objects/structures/crates_lockers/crates/wooden.dm:13)  may sleep
rt.def("/obj/structure/closet/crate/wooden/toy/proc/PopulateContents", function* PopulateContents(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.new_(f, T("/obj/item/device/megaphone/clown"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/canned_laughter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/pneumatic_cannon/pie"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/pie/cream"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/crayons"), [live(f.src)]);
	return f.dot;
}, true);
