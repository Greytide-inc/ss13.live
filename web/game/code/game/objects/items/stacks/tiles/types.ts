// Types declared in code/game/objects/items/stacks/tiles that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(8974, "/obj/item/stack/tile/mineral", "/obj/item/stack/tile", {});
rt.type(8981, "/obj/item/stack/tile/mineral/abductor", "/obj/item/stack/tile/mineral", {
	name: "alien floor tile",
	singular_name: "alien floor tile",
	desc: "A tile made out of alien alloy.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "tile_abductor",
	origin_tech: "materials=6;abductor=1",
	turf_type: rt.typePath("/turf/open/floor/mineral/abductor"),
	mineralType: "abductor",
});
rt.type(8984, "/obj/item/stack/tile/grass", "/obj/item/stack/tile", {
	turf_type: rt.typePath("/turf/open/floor/grass"),
	name: "grass tile",
	singular_name: "grass floor tile",
	desc: "A patch of grass like they use on space golf courses.",
	icon_state: "tile_grass",
	origin_tech: "biotech=1",
	resistance_flags: 4,
});
rt.type(8985, "/obj/item/stack/tile/wood", "/obj/item/stack/tile", {
	turf_type: rt.typePath("/turf/open/floor/wood"),
	name: "wood floor tile",
	singular_name: "wood floor tile",
	desc: "An easy to fit wood floor tile.",
	icon_state: "tile-wood",
	origin_tech: "biotech=1",
	resistance_flags: 4,
});
rt.type(8986, "/obj/item/stack/tile/basalt", "/obj/item/stack/tile", {
	turf_type: rt.typePath("/turf/open/floor/grass/fakebasalt"),
	name: "basalt tile",
	singular_name: "basalt floor tile",
	desc: "Artificially made ashy soil themed on a hostile enviroment.",
	icon_state: "tile_basalt",
	origin_tech: "materials=1",
});
rt.type(8987, "/obj/item/stack/tile/carpet", "/obj/item/stack/tile", {
	turf_type: rt.typePath("/turf/open/floor/carpet"),
	name: "carpet",
	singular_name: "carpet",
	desc: "A piece of carpet. It is the same size as a floor tile.",
	icon_state: "tile-carpet",
	resistance_flags: 4,
});
rt.type(8988, "/obj/item/stack/tile/carpet/black", "/obj/item/stack/tile/carpet", {
	turf_type: rt.typePath("/turf/open/floor/carpet/black"),
	name: "black carpet",
	icon_state: "tile-carpet-black",
});
rt.type(8989, "/obj/item/stack/tile/carpet/black/fifty", "/obj/item/stack/tile/carpet/black", {
	amount: 50,
});
rt.type(8990, "/obj/item/stack/tile/fakespace", "/obj/item/stack/tile", {
	turf_type: rt.typePath("/turf/open/floor/fakespace"),
	name: "astral carpet",
	singular_name: "astral carpet",
	desc: "A piece of carpet with a convincing star pattern.",
	icon_state: "tile_space",
	resistance_flags: 4,
	merge_type: rt.typePath("/obj/item/stack/tile/fakespace"),
});
rt.type(8991, "/obj/item/stack/tile/fakespace/loaded", "/obj/item/stack/tile/fakespace", {
	amount: 30,
});
rt.type(8992, "/obj/item/stack/tile/fakepit", "/obj/item/stack/tile", {
	turf_type: rt.typePath("/turf/open/floor/fakepit"),
	name: "fake pits",
	singular_name: "fake pit",
	desc: "A piece of carpet with a forced perspective illusion of a pit. No way this could fool anyone!",
	icon_state: "tile_pit",
	resistance_flags: 4,
	merge_type: rt.typePath("/obj/item/stack/tile/fakepit"),
});
rt.type(8993, "/obj/item/stack/tile/fakepit/loaded", "/obj/item/stack/tile/fakepit", {
	amount: 30,
});
rt.type(8994, "/obj/item/stack/tile/noslip", "/obj/item/stack/tile", {
	turf_type: rt.typePath("/turf/open/floor/noslip"),
	name: "high-traction floor tile",
	singular_name: "high-traction floor tile",
	desc: "A high-traction floor tile. It feels rubbery in your hand.",
	icon_state: "tile_noslip",
	origin_tech: "materials=3",
	merge_type: rt.typePath("/obj/item/stack/tile/noslip"),
});
rt.type(8995, "/obj/item/stack/tile/noslip/thirty", "/obj/item/stack/tile/noslip", {
	amount: 30,
});
rt.type(8996, "/obj/item/stack/tile/circuit", "/obj/item/stack/tile", {
	turf_type: rt.typePath("/turf/open/floor/circuit"),
	name: "blue circuit tile",
	singular_name: "blue circuit tile",
	desc: "A blue circuit tile.",
	icon_state: "tile_bcircuit",
});
rt.type(8997, "/obj/item/stack/tile/circuit/green", "/obj/item/stack/tile/circuit", {
	turf_type: rt.typePath("/turf/open/floor/circuit/green"),
	name: "green circuit tile",
	singular_name: "green circuit tile",
	desc: "A green circuit tile.",
	icon_state: "tile_gcircuit",
});
rt.type(8998, "/obj/item/stack/tile/circuit/green/anim", "/obj/item/stack/tile/circuit/green", {
	turf_type: rt.typePath("/turf/open/floor/circuit/green/anim"),
});
rt.type(8999, "/obj/item/stack/tile/circuit/red", "/obj/item/stack/tile/circuit", {
	turf_type: rt.typePath("/turf/open/floor/circuit/red"),
	name: "red circuit tile",
	singular_name: "red circuit tile",
	desc: "A red circuit tile.",
	icon_state: "tile_rcircuit",
});
rt.type(9000, "/obj/item/stack/tile/circuit/red/anim", "/obj/item/stack/tile/circuit/red", {
	turf_type: rt.typePath("/turf/open/floor/circuit/red/anim"),
});
rt.type(9001, "/obj/item/stack/tile/pod", "/obj/item/stack/tile", {
	turf_type: rt.typePath("/turf/open/floor/pod"),
	name: "pod floor tile",
	singular_name: "pod floor tile",
	desc: "A grooved floor tile.",
	icon_state: "tile_pod",
});
rt.type(9002, "/obj/item/stack/tile/pod/light", "/obj/item/stack/tile/pod", {
	turf_type: rt.typePath("/turf/open/floor/pod/light"),
	name: "light pod floor tile",
	singular_name: "light pod floor tile",
	desc: "A lightly colored grooved floor tile.",
	icon_state: "tile_podlight",
});
rt.type(9003, "/obj/item/stack/tile/pod/dark", "/obj/item/stack/tile/pod", {
	turf_type: rt.typePath("/turf/open/floor/pod/dark"),
	name: "dark pod floor tile",
	singular_name: "dark pod floor tile",
	desc: "A darkly colored grooved floor tile.",
	icon_state: "tile_poddark",
});
