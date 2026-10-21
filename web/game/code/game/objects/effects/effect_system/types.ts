// Types declared in code/game/objects/effects/effect_system that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(1522, "/datum/effect_system/smoke_spread/bad", "/datum/effect_system/smoke_spread", {
	effect_type: rt.typePath("/obj/effect/particle_effect/smoke/bad"),
});
rt.type(1524, "/datum/effect_system/smoke_spread/sleeping", "/datum/effect_system/smoke_spread", {
	effect_type: rt.typePath("/obj/effect/particle_effect/smoke/sleeping"),
});
rt.type(1526, "/datum/effect_system/smoke_spread/transparent", "/datum/effect_system/smoke_spread", {
	effect_type: rt.typePath("/obj/effect/particle_effect/smoke/transparent"),
});
rt.type(1527, "/datum/effect_system/smoke_spread/transparent/dancefloor_devil", "/datum/effect_system/smoke_spread/transparent", {
	effect_type: rt.typePath("/obj/effect/particle_effect/smoke/transparent/dancefloor_devil"),
});
rt.type(1528, "/datum/effect_system/spark_spread", "/datum/effect_system", {
	effect_type: rt.typePath("/obj/effect/particle_effect/sparks"),
});
rt.type(1529, "/datum/effect_system/lightning_spread", "/datum/effect_system", {
	effect_type: rt.typePath("/obj/effect/particle_effect/sparks/electricity"),
});
rt.type(1530, "/datum/effect_system/steam_spread", "/datum/effect_system", {
	effect_type: rt.typePath("/obj/effect/particle_effect/steam"),
});
rt.type(11920, "/obj/effect/particle_effect/foam/metal", "/obj/effect/particle_effect/foam", {
	metal: 1,
	name: "aluminium foam",
	icon_state: "mfoam",
});
rt.type(11921, "/obj/effect/particle_effect/foam/metal/iron", "/obj/effect/particle_effect/foam/metal", {
	metal: 2,
	name: "iron foam",
});
rt.type(11922, "/obj/effect/particle_effect/foam/metal/resin", "/obj/effect/particle_effect/foam/metal", {
	metal: 3,
	name: "resin foam",
});
rt.type(11923, "/obj/effect/particle_effect/ion_trails", "/obj/effect/particle_effect", {
	anchored: 1,
	name: "ion trails",
	icon_state: "ion_trails",
});
rt.type(11924, "/obj/effect/particle_effect/ion_trails/flight", "/obj/effect/particle_effect/ion_trails", {
	icon_state: "ion_trails_flight",
});
rt.type(11927, "/obj/effect/particle_effect/smoke/freezing", "/obj/effect/particle_effect/smoke", {
	opaque: 0,
	name: "nanofrost smoke",
	color: "#B2FFFF",
});
rt.type(11930, "/obj/effect/particle_effect/smoke/transparent", "/obj/effect/particle_effect/smoke", {
	opaque: 0,
});
rt.type(11931, "/obj/effect/particle_effect/smoke/transparent/dancefloor_devil", "/obj/effect/particle_effect/smoke/transparent", {
	lifetime: 2,
});
rt.type(11933, "/obj/effect/particle_effect/sparks/electricity", "/obj/effect/particle_effect/sparks", {
	name: "lightning",
	icon_state: "electricity",
});
rt.type(12705, "/obj/structure/foamedmetal/iron", "/obj/structure/foamedmetal", {
	obj_integrity: 50,
	max_integrity: 50,
	icon_state: "ironfoam",
});
