// Types declared in code/modules/atmospherics/environmental that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(4447, "/turf/closed/indestructible", "/turf/closed", {
	name: "wall",
	icon: rt.rsc("icons/turf/walls.dmi"),
	explosion_block: 50,
});
rt.type(4448, "/turf/closed/indestructible/oldshuttle", "/turf/closed/indestructible", {
	name: "strange shuttle wall",
	icon: rt.rsc("icons/turf/shuttleold.dmi"),
	icon_state: "block",
});
rt.type(4449, "/turf/closed/indestructible/oldshuttle/corner", "/turf/closed/indestructible/oldshuttle", {
	icon_state: "corner",
});
rt.type(4451, "/turf/closed/indestructible/riveted", "/turf/closed/indestructible", {
	icon: rt.rsc("icons/turf/walls/riveted.dmi"),
	icon_state: "riveted",
	smooth: 1,
});
rt.type(4452, "/turf/closed/indestructible/riveted/uranium", "/turf/closed/indestructible/riveted", {
	icon: rt.rsc("icons/turf/walls/uranium_wall.dmi"),
	icon_state: "uranium",
});
rt.type(4456, "/turf/closed/indestructible/riveted/hierophant", "/turf/closed/indestructible/riveted", {
	name: "wall",
	desc: "A wall made out of a strange metal. The squares on it pulse in a predictable pattern.",
	icon: rt.rsc("icons/turf/walls/hierophant_wall.dmi"),
	icon_state: "wall",
});
rt.type(4457, "/turf/closed/indestructible/abductor", "/turf/closed/indestructible", {
	icon_state: "alien1",
});
rt.type(4458, "/turf/closed/indestructible/opshuttle", "/turf/closed/indestructible", {
	icon_state: "wall3",
});
rt.type(4460, "/turf/closed/indestructible/fakedoor", "/turf/closed/indestructible", {
	name: "Centcom Access",
	icon: rt.rsc("icons/obj/doors/airlocks/centcom/centcom.dmi"),
	icon_state: "fake_door",
});
rt.type(4461, "/turf/closed/indestructible/rock", "/turf/closed/indestructible", {
	name: "dense rock",
	desc: "An extremely densely-packed rock, most mining tools or explosives would never get through this.",
	icon: rt.rsc("icons/turf/mining.dmi"),
	icon_state: "rock",
});
rt.type(4462, "/turf/closed/indestructible/rock/snow", "/turf/closed/indestructible/rock", {
	name: "mountainside",
	desc: "An extremely densely-packed rock, sheeted over with centuries worth of ice and snow.",
	icon: rt.rsc("icons/turf/walls.dmi"),
	icon_state: "snowrock",
});
rt.type(4463, "/turf/closed/indestructible/rock/snow/ice", "/turf/closed/indestructible/rock/snow", {
	name: "iced rock",
	desc: "Extremely densely-packed sheets of ice and rock, forged over the years of the harsh cold.",
	icon: rt.rsc("icons/turf/walls.dmi"),
	icon_state: "icerock",
});
rt.type(4464, "/turf/closed/indestructible/paper", "/turf/closed/indestructible", {
	name: "thick paper wall",
	desc: "A wall layered with impenetrable sheets of paper.",
	icon: rt.rsc("icons/turf/walls.dmi"),
	icon_state: "paperwall",
});
rt.type(4784, "/turf/open/indestructible", "/turf/open", {
	name: "floor",
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "floor",
});
rt.type(4788, "/turf/open/indestructible/boss", "/turf/open/indestructible", {
	name: "necropolis floor",
	icon: rt.rsc("icons/turf/boss_floors.dmi"),
	icon_state: "boss",
	baseturf: rt.typePath("/turf/open/indestructible/boss"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});
rt.type(4789, "/turf/open/indestructible/boss/hot", "/turf/open/indestructible/boss", {
	icon: rt.rsc("icons/turf/boss_floors_hot.dmi"),
	baseturf: rt.typePath("/turf/open/indestructible/boss/hot"),
});
rt.type(4790, "/turf/open/indestructible/hierophant", "/turf/open/indestructible", {
	icon: rt.rsc("icons/turf/floors/hierophant_floor.dmi"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	baseturf: rt.typePath("/turf/open/indestructible/hierophant"),
	smooth: 1,
});
rt.type(4791, "/turf/open/indestructible/hierophant/two", "/turf/open/indestructible/hierophant", {});
rt.type(4792, "/turf/open/indestructible/paper", "/turf/open/indestructible", {
	name: "notebook floor",
	desc: "A floor made of invulnerable notebook paper.",
	icon_state: "paperfloor",
});
