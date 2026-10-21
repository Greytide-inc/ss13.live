// Types declared in code/game/turfs/simulated/wall that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(4431, "/turf/closed/wall/mineral/titanium/nodiagonal", "/turf/closed/wall/mineral/titanium", {
	smooth: 2,
	icon_state: "map-shuttle_nd",
});
rt.type(4432, "/turf/closed/wall/mineral/titanium/nosmooth", "/turf/closed/wall/mineral/titanium", {
	icon: rt.rsc("icons/turf/shuttle.dmi"),
	icon_state: "wall",
	smooth: 0,
});
rt.type(4436, "/turf/closed/wall/mineral/titanium/survival/nodiagonal", "/turf/closed/wall/mineral/titanium/survival", {
	smooth: 2,
});
rt.type(4442, "/turf/closed/wall/r_wall/rust", "/turf/closed/wall/r_wall", {
	name: "rusted reinforced wall",
	desc: "A huge chunk of rusted reinforced metal.",
	icon: rt.rsc("icons/turf/walls/rusty_reinforced_wall.dmi"),
	hardness: 15,
});
