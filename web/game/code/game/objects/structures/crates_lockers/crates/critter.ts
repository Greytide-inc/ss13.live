// From code/game/objects/structures/crates_lockers/crates/critter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12267, "/obj/structure/closet/crate/critter", "/obj/structure/closet/crate", {
	tank: null,
	horizontal: 0,
	allow_objects: 0,
	breakout_time: 1,
	material_drop: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	material_drop_amount: 4,
	delivery_icon: "deliverybox",
	name: "critter crate",
	desc: "A crate designed for safe transport of animals. It has an oxygen tank for safe transport in space.",
	icon_state: "crittercrate",
});

// /obj/structure/closet/crate/critter/proc/New  (code/game/objects/structures/crates_lockers/crates/critter.dm:14)  may sleep
rt.def("/obj/structure/closet/crate/critter/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "tank", (yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen"), [])));
	return f.dot;
}, true);

// /obj/structure/closet/crate/critter/proc/Destroy  (code/game/objects/structures/crates_lockers/crates/critter.dm:18)  may sleep
rt.def("/obj/structure/closet/crate/critter/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.getStep(f, live(f.src), 0);
	if (truthy(rt.sv(f, "tank"))) {
		yield* g.callName(f, rt.sv(f, "tank"), "forceMove", [live(_T)]);
		rt.setSv(f, "tank", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/closet/crate/critter/proc/update_icon  (code/game/objects/structures/crates_lockers/crates/critter.dm:26)
rt.def("/obj/structure/closet/crate/critter/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "opened"))) {
		rt.callSrc(f, "add_overlay", ["crittercrate_door_open"]);
	} else {
		rt.callSrc(f, "add_overlay", ["crittercrate_door"]);
		if (!truthy(rt.sv(f, "manifest"))) return f.dot;
		rt.callSrc(f, "add_overlay", ["manifest"]);
	}
	return f.dot;
});

// /obj/structure/closet/crate/critter/proc/return_air  (code/game/objects/structures/crates_lockers/crates/critter.dm:36)
rt.def("/obj/structure/closet/crate/critter/proc/return_air", function return_air(f: Frame) {
	if (truthy(rt.sv(f, "tank"))) {
		return rt.fv(f, "air_contents", rt.sv(f, "tank"));
	}
	return rt.callName(f, rt.sv(f, "loc"), "return_air", []);
});
