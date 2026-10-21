// From code/game/objects/structures/crates_lockers/closets/secure/hydroponics.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12373, "/obj/structure/closet/secure_closet/hydroponics", "/obj/structure/closet/secure_closet", {
	name: "botanist's locker",
	req_access: null,
	icon_state: "hydro",
});

// /obj/structure/closet/secure_closet/hydroponics/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/hydroponics.dm:3)
rt.def("/obj/structure/closet/secure_closet/hydroponics/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(35));
	return f.dot;
});

// /obj/structure/closet/secure_closet/hydroponics/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/hydroponics.dm:7)  may sleep
rt.def("/obj/structure/closet/secure_closet/hydroponics/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/storage/bag/plants/portaseeder"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/plant_analyzer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_srv"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/cultivator"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/hatchet"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/disks_plantgene"), [live(f.src)]);
	return f.dot;
}, true);
