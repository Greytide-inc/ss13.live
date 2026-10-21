// Types declared in code/game that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../build/dist/src/translate/runtime.js";

rt.type(4804, "/atom/movable/virtualspeaker", "/atom/movable", {
	job: null,
	source: null,
	radio: null,
});
rt.type(4806, "/atom/movable/light", "/atom/movable", {});
rt.type(12127, "/obj/structure/shuttle/engine/heater", "/obj/structure/shuttle/engine", {
	engine_power: 0,
	name: "heater",
	icon_state: "heater",
});
rt.type(12128, "/obj/structure/shuttle/engine/platform", "/obj/structure/shuttle/engine", {
	engine_power: 0,
	name: "platform",
	icon_state: "platform",
});
rt.type(12129, "/obj/structure/shuttle/engine/propulsion", "/obj/structure/shuttle/engine", {
	name: "propulsion engine",
	icon_state: "propulsion",
	opacity: 1,
});
rt.type(12130, "/obj/structure/shuttle/engine/propulsion/left", "/obj/structure/shuttle/engine/propulsion", {
	name: "left propulsion engine",
	icon_state: "propulsion_l",
});
rt.type(12131, "/obj/structure/shuttle/engine/propulsion/right", "/obj/structure/shuttle/engine/propulsion", {
	name: "right propulsion engine",
	icon_state: "propulsion_r",
});
rt.type(12132, "/obj/structure/shuttle/engine/propulsion/burst", "/obj/structure/shuttle/engine/propulsion", {
	name: "burst engine",
});
rt.type(12133, "/obj/structure/shuttle/engine/propulsion/burst/cargo", "/obj/structure/shuttle/engine/propulsion/burst", {
	state: 0,
	anchored: 0,
});
rt.type(12134, "/obj/structure/shuttle/engine/propulsion/burst/left", "/obj/structure/shuttle/engine/propulsion/burst", {
	name: "left burst engine",
	icon_state: "burst_l",
});
rt.type(12135, "/obj/structure/shuttle/engine/propulsion/burst/right", "/obj/structure/shuttle/engine/propulsion/burst", {
	name: "right burst engine",
	icon_state: "burst_r",
});
rt.type(12136, "/obj/structure/shuttle/engine/router", "/obj/structure/shuttle/engine", {
	name: "router",
	icon_state: "router",
});
rt.type(12137, "/obj/structure/shuttle/engine/large", "/obj/structure/shuttle/engine", {
	name: "engine",
	opacity: 1,
	icon: rt.rsc("icons/obj/2x2.dmi"),
	icon_state: "large_engine",
	bound_width: 64,
	bound_height: 64,
	appearance_flags: 0,
});
rt.type(12138, "/obj/structure/shuttle/engine/huge", "/obj/structure/shuttle/engine", {
	name: "engine",
	opacity: 1,
	icon: rt.rsc("icons/obj/3x3.dmi"),
	icon_state: "huge_engine",
	bound_width: 96,
	bound_height: 96,
	appearance_flags: 0,
});
