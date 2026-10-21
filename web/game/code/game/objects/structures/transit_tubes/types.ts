// Types declared in code/game/objects/structures/transit_tubes that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(12903, "/obj/structure/transit_tube/horizontal", "/obj/structure/transit_tube", {
	dir: 8,
});
rt.type(12905, "/obj/structure/transit_tube/diagonal/topleft", "/obj/structure/transit_tube/diagonal", {
	dir: 8,
});
rt.type(12906, "/obj/structure/transit_tube/diagonal/crossing", "/obj/structure/transit_tube/diagonal", {
	density: 0,
	icon_state: "diagonal_crossing",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/diagonal/crossing"),
});
rt.type(12907, "/obj/structure/transit_tube/diagonal/crossing/topleft", "/obj/structure/transit_tube/diagonal/crossing", {
	dir: 8,
});
rt.type(12912, "/obj/structure/transit_tube/crossing", "/obj/structure/transit_tube", {
	icon_state: "crossing",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/crossing"),
	density: 0,
});
rt.type(12913, "/obj/structure/transit_tube/crossing/horizontal", "/obj/structure/transit_tube/crossing", {
	dir: 8,
});
rt.type(12915, "/obj/structure/c_transit_tube/station", "/obj/structure/c_transit_tube", {
	build_type: rt.typePath("/obj/structure/transit_tube/station"),
	flipped_build_type: rt.typePath("/obj/structure/transit_tube/station/flipped"),
	base_icon: "closed_station",
	name: "unattached through station",
	icon_state: "closed_station0",
});
rt.type(12916, "/obj/structure/c_transit_tube/station/flipped", "/obj/structure/c_transit_tube/station", {
	flipped: 1,
	build_type: rt.typePath("/obj/structure/transit_tube/station/flipped"),
	flipped_build_type: rt.typePath("/obj/structure/transit_tube/station"),
	icon_state: "closed_station1",
});
rt.type(12917, "/obj/structure/c_transit_tube/station/reverse", "/obj/structure/c_transit_tube/station", {
	build_type: rt.typePath("/obj/structure/transit_tube/station/reverse"),
	flipped_build_type: rt.typePath("/obj/structure/transit_tube/station/reverse/flipped"),
	base_icon: "closed_terminus",
	name: "unattached terminus station",
	icon_state: "closed_terminus0",
});
rt.type(12918, "/obj/structure/c_transit_tube/station/reverse/flipped", "/obj/structure/c_transit_tube/station/reverse", {
	flipped: 1,
	build_type: rt.typePath("/obj/structure/transit_tube/station/reverse/flipped"),
	flipped_build_type: rt.typePath("/obj/structure/transit_tube/station/reverse"),
	icon_state: "closed_terminus1",
});
rt.type(12919, "/obj/structure/c_transit_tube/crossing", "/obj/structure/c_transit_tube", {
	build_type: rt.typePath("/obj/structure/transit_tube/crossing"),
	icon_state: "crossing",
});
rt.type(12920, "/obj/structure/c_transit_tube/diagonal", "/obj/structure/c_transit_tube", {
	build_type: rt.typePath("/obj/structure/transit_tube/diagonal"),
	icon_state: "diagonal",
});
rt.type(12921, "/obj/structure/c_transit_tube/diagonal/crossing", "/obj/structure/c_transit_tube/diagonal", {
	build_type: rt.typePath("/obj/structure/transit_tube/diagonal/crossing"),
	icon_state: "diagonal_crossing",
});
rt.type(12922, "/obj/structure/c_transit_tube/curved", "/obj/structure/c_transit_tube", {
	build_type: rt.typePath("/obj/structure/transit_tube/curved"),
	flipped_build_type: rt.typePath("/obj/structure/transit_tube/curved/flipped"),
	base_icon: "curved",
	icon_state: "curved0",
});
rt.type(12923, "/obj/structure/c_transit_tube/curved/flipped", "/obj/structure/c_transit_tube/curved", {
	build_type: rt.typePath("/obj/structure/transit_tube/curved/flipped"),
	flipped_build_type: rt.typePath("/obj/structure/transit_tube/curved"),
	flipped: 1,
	icon_state: "curved1",
});
rt.type(12924, "/obj/structure/c_transit_tube/junction", "/obj/structure/c_transit_tube", {
	build_type: rt.typePath("/obj/structure/transit_tube/junction"),
	flipped_build_type: rt.typePath("/obj/structure/transit_tube/junction/flipped"),
	base_icon: "junction",
	icon_state: "junction0",
});
rt.type(12925, "/obj/structure/c_transit_tube/junction/flipped", "/obj/structure/c_transit_tube/junction", {
	flipped: 1,
	build_type: rt.typePath("/obj/structure/transit_tube/junction/flipped"),
	flipped_build_type: rt.typePath("/obj/structure/transit_tube/junction"),
	icon_state: "junction1",
});
