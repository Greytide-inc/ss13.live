// Types declared in code/modules/cargo that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(1945, "/datum/export/gear", "/datum/export", {});
rt.type(1953, "/datum/export/gear/mask", "/datum/export/gear", {});
rt.type(1956, "/datum/export/gear/space", "/datum/export/gear", {
	include_subtypes: 0,
});
rt.type(1974, "/datum/export/large", "/datum/export", {});
rt.type(2020, "/datum/export/organ", "/datum/export", {});
rt.type(2033, "/datum/export/organ/cat", "/datum/export/organ", {});
rt.type(2036, "/datum/export/organ/human", "/datum/export/organ", {
	contraband: 1,
	include_subtypes: 0,
});
rt.type(2040, "/datum/export/solar", "/datum/export", {});
rt.type(2086, "/datum/export/weapon", "/datum/export", {
	include_subtypes: 0,
});
rt.type(2101, "/datum/supply_pack/emergency", "/datum/supply_pack", {
	group: "Emergency",
});
rt.type(2114, "/datum/supply_pack/security", "/datum/supply_pack", {
	group: "Security",
	access: 1,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/gear"),
});
rt.type(2124, "/datum/supply_pack/security/armory", "/datum/supply_pack/security", {
	access: 3,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/weapon"),
});
rt.type(2145, "/datum/supply_pack/engineering", "/datum/supply_pack", {
	group: "Engineering",
	crate_type: rt.typePath("/obj/structure/closet/crate/engineering"),
});
rt.type(2170, "/datum/supply_pack/science", "/datum/supply_pack", {
	group: "Science",
	crate_type: rt.typePath("/obj/structure/closet/crate/science"),
});
rt.type(2182, "/datum/supply_pack/medical", "/datum/supply_pack", {
	group: "Medical",
	crate_type: rt.typePath("/obj/structure/closet/crate/medical"),
});
rt.type(2194, "/datum/supply_pack/organic", "/datum/supply_pack", {
	group: "Food & Livestock",
	crate_type: rt.typePath("/obj/structure/closet/crate/freezer"),
});
rt.type(2200, "/datum/supply_pack/organic/critter", "/datum/supply_pack/organic", {
	crate_type: rt.typePath("/obj/structure/closet/crate/critter"),
});
rt.type(2220, "/datum/supply_pack/materials", "/datum/supply_pack", {
	group: "Raw Materials",
});
rt.type(2229, "/datum/supply_pack/misc", "/datum/supply_pack", {
	group: "Miscellaneous Supplies",
});
rt.type(10420, "/obj/machinery/computer/cargo/request", "/obj/machinery/computer/cargo", {
	icon_screen: "request",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/cargo/request"),
	requestonly: 1,
	name: "supply request console",
	desc: "Used to request supplies from cargo.",
});
