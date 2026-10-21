// From code/game/objects/items/stacks/tiles/tile_mineral.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8975, "/obj/item/stack/tile/mineral/plasma", "/obj/item/stack/tile/mineral", {
	name: "plasma tile",
	singular_name: "plasma floor tile",
	desc: "A tile made out of highly flammable plasma. This can only end well.",
	icon_state: "tile_plasma",
	origin_tech: "plasmatech=1",
	turf_type: rt.typePath("/turf/open/floor/mineral/plasma"),
	mineralType: "plasma",
	materials: null,
});

// /obj/item/stack/tile/mineral/plasma/proc/<init>  (code/game/objects/items/stacks/tiles/tile_mineral.dm:9)
rt.def("/obj/item/stack/tile/mineral/plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$plasma", 500]));
	return f.dot;
});

rt.type(8976, "/obj/item/stack/tile/mineral/uranium", "/obj/item/stack/tile/mineral", {
	name: "uranium tile",
	singular_name: "uranium floor tile",
	desc: "A tile made out of uranium. You feel a bit woozy.",
	icon_state: "tile_uranium",
	turf_type: rt.typePath("/turf/open/floor/mineral/uranium"),
	mineralType: "uranium",
	materials: null,
});

// /obj/item/stack/tile/mineral/uranium/proc/<init>  (code/game/objects/items/stacks/tiles/tile_mineral.dm:18)
rt.def("/obj/item/stack/tile/mineral/uranium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$uranium", 500]));
	return f.dot;
});

rt.type(8977, "/obj/item/stack/tile/mineral/gold", "/obj/item/stack/tile/mineral", {
	name: "gold tile",
	singular_name: "gold floor tile",
	desc: "A tile made out of gold, the swag seems strong here.",
	icon_state: "tile_gold",
	turf_type: rt.typePath("/turf/open/floor/mineral/gold"),
	mineralType: "gold",
	materials: null,
});

// /obj/item/stack/tile/mineral/gold/proc/<init>  (code/game/objects/items/stacks/tiles/tile_mineral.dm:27)
rt.def("/obj/item/stack/tile/mineral/gold/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$gold", 500]));
	return f.dot;
});

rt.type(8978, "/obj/item/stack/tile/mineral/silver", "/obj/item/stack/tile/mineral", {
	name: "silver tile",
	singular_name: "silver floor tile",
	desc: "A tile made out of silver, the light shining from it is blinding.",
	icon_state: "tile_silver",
	turf_type: rt.typePath("/turf/open/floor/mineral/silver"),
	mineralType: "silver",
	materials: null,
});

// /obj/item/stack/tile/mineral/silver/proc/<init>  (code/game/objects/items/stacks/tiles/tile_mineral.dm:36)
rt.def("/obj/item/stack/tile/mineral/silver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$silver", 500]));
	return f.dot;
});

rt.type(8979, "/obj/item/stack/tile/mineral/diamond", "/obj/item/stack/tile/mineral", {
	name: "diamond tile",
	singular_name: "diamond floor tile",
	desc: "A tile made out of diamond. Wow, just, wow.",
	icon_state: "tile_diamond",
	origin_tech: "materials=2",
	turf_type: rt.typePath("/turf/open/floor/mineral/diamond"),
	mineralType: "diamond",
	materials: null,
});

// /obj/item/stack/tile/mineral/diamond/proc/<init>  (code/game/objects/items/stacks/tiles/tile_mineral.dm:46)
rt.def("/obj/item/stack/tile/mineral/diamond/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$diamond", 500]));
	return f.dot;
});

rt.type(8980, "/obj/item/stack/tile/mineral/bananium", "/obj/item/stack/tile/mineral", {
	name: "bananium tile",
	singular_name: "bananium floor tile",
	desc: "A tile made out of bananium, HOOOOOOOOONK!",
	icon_state: "tile_bananium",
	turf_type: rt.typePath("/turf/open/floor/mineral/bananium"),
	mineralType: "bananium",
	materials: null,
});

// /obj/item/stack/tile/mineral/bananium/proc/<init>  (code/game/objects/items/stacks/tiles/tile_mineral.dm:55)
rt.def("/obj/item/stack/tile/mineral/bananium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$bananium", 500]));
	return f.dot;
});

rt.type(8982, "/obj/item/stack/tile/mineral/titanium", "/obj/item/stack/tile/mineral", {
	name: "titanium tile",
	singular_name: "titanium floor tile",
	desc: "A tile made of titanium, used for shuttles.",
	icon_state: "tile_shuttle",
	origin_tech: "materials=2",
	turf_type: rt.typePath("/turf/open/floor/mineral/titanium"),
	mineralType: "titanium",
	materials: null,
});

// /obj/item/stack/tile/mineral/titanium/proc/<init>  (code/game/objects/items/stacks/tiles/tile_mineral.dm:75)
rt.def("/obj/item/stack/tile/mineral/titanium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$titanium", 500]));
	return f.dot;
});

rt.type(8983, "/obj/item/stack/tile/mineral/plastitanium", "/obj/item/stack/tile/mineral", {
	name: "plas-titanium tile",
	singular_name: "plas-titanium floor tile",
	desc: "A tile made of plas-titanium, used for very evil shuttles.",
	icon_state: "tile_darkshuttle",
	origin_tech: "materials=2",
	turf_type: rt.typePath("/turf/open/floor/mineral/plastitanium"),
	mineralType: "plastitanium",
	materials: null,
});

// /obj/item/stack/tile/mineral/plastitanium/proc/<init>  (code/game/objects/items/stacks/tiles/tile_mineral.dm:85)
rt.def("/obj/item/stack/tile/mineral/plastitanium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$titanium", 250, "$plasma", 250]));
	return f.dot;
});
