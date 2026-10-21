// Types declared in code/game/machinery/doors that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(10212, "/obj/machinery/door/airlock/clockwork/brass", "/obj/machinery/door/airlock/clockwork", {
	glass: 1,
	opacity: 0,
});
rt.type(10214, "/obj/machinery/door/airlock/command", "/obj/machinery/door/airlock", {
	normal_integrity: 450,
	icon: rt.rsc("icons/obj/doors/airlocks/station/command.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_com"),
});
rt.type(10215, "/obj/machinery/door/airlock/security", "/obj/machinery/door/airlock", {
	normal_integrity: 450,
	icon: rt.rsc("icons/obj/doors/airlocks/station/security.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_sec"),
});
rt.type(10216, "/obj/machinery/door/airlock/engineering", "/obj/machinery/door/airlock", {
	icon: rt.rsc("icons/obj/doors/airlocks/station/engineering.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_eng"),
});
rt.type(10217, "/obj/machinery/door/airlock/medical", "/obj/machinery/door/airlock", {
	icon: rt.rsc("icons/obj/doors/airlocks/station/medical.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_med"),
});
rt.type(10218, "/obj/machinery/door/airlock/maintenance", "/obj/machinery/door/airlock", {
	normal_integrity: 250,
	name: "maintenance access",
	icon: rt.rsc("icons/obj/doors/airlocks/station/maintenance.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_mai"),
});
rt.type(10219, "/obj/machinery/door/airlock/maintenance/external", "/obj/machinery/door/airlock/maintenance", {
	normal_integrity: 250,
	name: "external airlock access",
	icon: rt.rsc("icons/obj/doors/airlocks/station/maintenanceexternal.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_mai"),
});
rt.type(10220, "/obj/machinery/door/airlock/mining", "/obj/machinery/door/airlock", {
	name: "mining airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station/mining.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_min"),
});
rt.type(10221, "/obj/machinery/door/airlock/atmos", "/obj/machinery/door/airlock", {
	name: "atmospherics airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station/atmos.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_atmo"),
});
rt.type(10222, "/obj/machinery/door/airlock/research", "/obj/machinery/door/airlock", {
	icon: rt.rsc("icons/obj/doors/airlocks/station/research.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_research"),
});
rt.type(10223, "/obj/machinery/door/airlock/freezer", "/obj/machinery/door/airlock", {
	name: "freezer airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station/freezer.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_fre"),
});
rt.type(10224, "/obj/machinery/door/airlock/science", "/obj/machinery/door/airlock", {
	icon: rt.rsc("icons/obj/doors/airlocks/station/science.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_science"),
});
rt.type(10225, "/obj/machinery/door/airlock/virology", "/obj/machinery/door/airlock", {
	icon: rt.rsc("icons/obj/doors/airlocks/station/virology.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_viro"),
});
rt.type(10226, "/obj/machinery/door/airlock/glass_command", "/obj/machinery/door/airlock", {
	normal_integrity: 400,
	icon: rt.rsc("icons/obj/doors/airlocks/station/command.dmi"),
	opacity: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_com/glass"),
	glass: 1,
});
rt.type(10227, "/obj/machinery/door/airlock/glass_engineering", "/obj/machinery/door/airlock", {
	icon: rt.rsc("icons/obj/doors/airlocks/station/engineering.dmi"),
	opacity: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_eng/glass"),
	glass: 1,
});
rt.type(10228, "/obj/machinery/door/airlock/glass_security", "/obj/machinery/door/airlock", {
	normal_integrity: 400,
	icon: rt.rsc("icons/obj/doors/airlocks/station/security.dmi"),
	opacity: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_sec/glass"),
	glass: 1,
});
rt.type(10229, "/obj/machinery/door/airlock/glass_medical", "/obj/machinery/door/airlock", {
	icon: rt.rsc("icons/obj/doors/airlocks/station/medical.dmi"),
	opacity: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_med/glass"),
	glass: 1,
});
rt.type(10230, "/obj/machinery/door/airlock/glass_research", "/obj/machinery/door/airlock", {
	icon: rt.rsc("icons/obj/doors/airlocks/station/research.dmi"),
	opacity: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_research/glass"),
	glass: 1,
});
rt.type(10231, "/obj/machinery/door/airlock/glass_mining", "/obj/machinery/door/airlock", {
	icon: rt.rsc("icons/obj/doors/airlocks/station/mining.dmi"),
	opacity: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_min/glass"),
	glass: 1,
});
rt.type(10232, "/obj/machinery/door/airlock/glass_atmos", "/obj/machinery/door/airlock", {
	icon: rt.rsc("icons/obj/doors/airlocks/station/atmos.dmi"),
	opacity: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_atmo/glass"),
	glass: 1,
});
rt.type(10233, "/obj/machinery/door/airlock/glass_science", "/obj/machinery/door/airlock", {
	icon: rt.rsc("icons/obj/doors/airlocks/station/science.dmi"),
	opacity: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_science/glass"),
	glass: 1,
});
rt.type(10234, "/obj/machinery/door/airlock/glass_virology", "/obj/machinery/door/airlock", {
	icon: rt.rsc("icons/obj/doors/airlocks/station/virology.dmi"),
	opacity: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_viro/glass"),
	glass: 1,
});
rt.type(10235, "/obj/machinery/door/airlock/glass_maintenance", "/obj/machinery/door/airlock", {
	icon: rt.rsc("icons/obj/doors/airlocks/station/maintenance.dmi"),
	opacity: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_mai/glass"),
	glass: 1,
});
rt.type(10236, "/obj/machinery/door/airlock/gold", "/obj/machinery/door/airlock", {
	mineral: "gold",
	name: "gold airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station/gold.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_gold"),
});
rt.type(10237, "/obj/machinery/door/airlock/silver", "/obj/machinery/door/airlock", {
	mineral: "silver",
	name: "silver airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station/silver.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_silver"),
});
rt.type(10238, "/obj/machinery/door/airlock/diamond", "/obj/machinery/door/airlock", {
	mineral: "diamond",
	normal_integrity: 1000,
	explosion_block: 2,
	name: "diamond airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station/diamond.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_diamond"),
});
rt.type(10240, "/obj/machinery/door/airlock/clown", "/obj/machinery/door/airlock", {
	mineral: "bananium",
	doorOpen: rt.rsc("sound/items/bikehorn.ogg"),
	name: "bananium airlock",
	desc: "Honkhonkhonk",
	icon: rt.rsc("icons/obj/doors/airlocks/station/bananium.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_clown"),
});
rt.type(10241, "/obj/machinery/door/airlock/sandstone", "/obj/machinery/door/airlock", {
	mineral: "sandstone",
	name: "sandstone airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station/sandstone.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_sandstone"),
});
rt.type(10242, "/obj/machinery/door/airlock/wood", "/obj/machinery/door/airlock", {
	mineral: "wood",
	name: "wooden airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station/wood.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_wood"),
});
rt.type(10243, "/obj/machinery/door/airlock/titanium", "/obj/machinery/door/airlock", {
	mineral: "titanium",
	overlays_file: rt.rsc("icons/obj/doors/airlocks/shuttle/overlays.dmi"),
	normal_integrity: 400,
	name: "shuttle airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/shuttle/shuttle.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_titanium"),
});
rt.type(10244, "/obj/machinery/door/airlock/glass_titanium", "/obj/machinery/door/airlock", {
	mineral: "titanium",
	overlays_file: rt.rsc("icons/obj/doors/airlocks/shuttle/overlays.dmi"),
	normal_integrity: 350,
	name: "shuttle airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/shuttle/shuttle.dmi"),
	opacity: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_titanium/glass"),
	glass: 1,
});
rt.type(10245, "/obj/machinery/door/airlock/glass", "/obj/machinery/door/airlock", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/station2/overlays.dmi"),
	name: "glass airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station2/glass.dmi"),
	opacity: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_glass"),
	glass: 1,
});
rt.type(10246, "/obj/machinery/door/airlock/external", "/obj/machinery/door/airlock", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/external/overlays.dmi"),
	note_overlay_file: rt.rsc("icons/obj/doors/airlocks/external/overlays.dmi"),
	explosion_block: 1,
	name: "external airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/external/external.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_ext"),
});
rt.type(10247, "/obj/machinery/door/airlock/glass_external", "/obj/machinery/door/airlock", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/external/overlays.dmi"),
	name: "external airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/external/external.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_ext/glass"),
	opacity: 0,
	glass: 1,
});
rt.type(10248, "/obj/machinery/door/airlock/centcom", "/obj/machinery/door/airlock", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/centcom/overlays.dmi"),
	note_overlay_file: rt.rsc("icons/obj/doors/airlocks/centcom/overlays.dmi"),
	normal_integrity: 1000,
	security_level: 6,
	explosion_block: 2,
	icon: rt.rsc("icons/obj/doors/airlocks/centcom/centcom.dmi"),
	opacity: 1,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_centcom"),
});
rt.type(10249, "/obj/machinery/door/airlock/vault", "/obj/machinery/door/airlock", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/vault/overlays.dmi"),
	note_overlay_file: rt.rsc("icons/obj/doors/airlocks/vault/overlays.dmi"),
	explosion_block: 2,
	normal_integrity: 400,
	security_level: 6,
	name: "vault door",
	icon: rt.rsc("icons/obj/doors/airlocks/vault/vault.dmi"),
	opacity: 1,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_vault"),
});
rt.type(10250, "/obj/machinery/door/airlock/hatch", "/obj/machinery/door/airlock", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/hatch/overlays.dmi"),
	note_overlay_file: rt.rsc("icons/obj/doors/airlocks/hatch/overlays.dmi"),
	name: "airtight hatch",
	icon: rt.rsc("icons/obj/doors/airlocks/hatch/centcom.dmi"),
	opacity: 1,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_hatch"),
});
rt.type(10251, "/obj/machinery/door/airlock/maintenance_hatch", "/obj/machinery/door/airlock", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/hatch/overlays.dmi"),
	note_overlay_file: rt.rsc("icons/obj/doors/airlocks/hatch/overlays.dmi"),
	name: "maintenance hatch",
	icon: rt.rsc("icons/obj/doors/airlocks/hatch/maintenance.dmi"),
	opacity: 1,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_mhatch"),
});
rt.type(10252, "/obj/machinery/door/airlock/highsecurity", "/obj/machinery/door/airlock", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/highsec/overlays.dmi"),
	explosion_block: 2,
	normal_integrity: 500,
	security_level: 1,
	name: "high tech security airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/highsec/highsec.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_highsecurity"),
	damage_deflection: 30,
});
rt.type(10253, "/obj/machinery/door/airlock/shuttle", "/obj/machinery/door/airlock", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/shuttle/overlays.dmi"),
	name: "shuttle airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/shuttle/shuttle.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_shuttle"),
});
rt.type(10254, "/obj/machinery/door/airlock/abductor", "/obj/machinery/door/airlock", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/abductor/overlays.dmi"),
	note_overlay_file: rt.rsc("icons/obj/doors/airlocks/abductor/overlays.dmi"),
	explosion_block: 3,
	hackProof: 1,
	aiControlDisabled: 1,
	normal_integrity: 700,
	security_level: 1,
	name: "alien airlock",
	desc: "With humanity's current technological level, it could take years to hack this advanced airlock... or maybe we should give a screwdriver a try?",
	icon: rt.rsc("icons/obj/doors/airlocks/abductor/abductor_airlock.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_abductor"),
	damage_deflection: 30,
	opacity: 1,
});
rt.type(10256, "/obj/machinery/door/airlock/cult/friendly", "/obj/machinery/door/airlock/cult", {
	friendly: 1,
});
rt.type(10257, "/obj/machinery/door/airlock/cult/glass", "/obj/machinery/door/airlock/cult", {
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_cult/glass"),
	glass: 1,
	opacity: 0,
});
rt.type(10258, "/obj/machinery/door/airlock/cult/glass/friendly", "/obj/machinery/door/airlock/cult/glass", {
	friendly: 1,
});
rt.type(10259, "/obj/machinery/door/airlock/cult/unruned", "/obj/machinery/door/airlock/cult", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/cult/unruned/overlays.dmi"),
	icon: rt.rsc("icons/obj/doors/airlocks/cult/unruned/cult.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_cult/unruned"),
	openingoverlaytype: rt.typePath("/obj/effect/temp_visual/cult/door/unruned"),
});
rt.type(10260, "/obj/machinery/door/airlock/cult/unruned/friendly", "/obj/machinery/door/airlock/cult/unruned", {
	friendly: 1,
});
rt.type(10261, "/obj/machinery/door/airlock/cult/unruned/glass", "/obj/machinery/door/airlock/cult/unruned", {
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_cult/unruned/glass"),
	glass: 1,
	opacity: 0,
});
rt.type(10262, "/obj/machinery/door/airlock/cult/unruned/glass/friendly", "/obj/machinery/door/airlock/cult/unruned/glass", {
	friendly: 1,
});
rt.type(10263, "/obj/machinery/door/airlock/glass_large", "/obj/machinery/door/airlock", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/glass_large/overlays.dmi"),
	note_overlay_file: rt.rsc("icons/obj/doors/airlocks/glass_large/overlays.dmi"),
	name: "large glass airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/glass_large/glass_large.dmi"),
	opacity: 0,
	assemblytype: null,
	glass: 1,
	bound_width: 64,
});
rt.type(10269, "/obj/machinery/door/window/brigdoor", "/obj/machinery/door/window", {
	id: null,
	base_state: "leftsecure",
	reinf: 1,
	explosion_block: 1,
	name: "secure door",
	icon_state: "leftsecure",
	obj_integrity: 300,
	max_integrity: 300,
});
rt.type(10270, "/obj/machinery/door/window/brigdoor/northleft", "/obj/machinery/door/window/brigdoor", {
	dir: 1,
});
rt.type(10271, "/obj/machinery/door/window/brigdoor/eastleft", "/obj/machinery/door/window/brigdoor", {
	dir: 4,
});
rt.type(10272, "/obj/machinery/door/window/brigdoor/westleft", "/obj/machinery/door/window/brigdoor", {
	dir: 8,
});
rt.type(10273, "/obj/machinery/door/window/brigdoor/southleft", "/obj/machinery/door/window/brigdoor", {
	dir: 2,
});
rt.type(10274, "/obj/machinery/door/window/brigdoor/northright", "/obj/machinery/door/window/brigdoor", {
	base_state: "rightsecure",
	dir: 1,
	icon_state: "rightsecure",
});
rt.type(10275, "/obj/machinery/door/window/brigdoor/eastright", "/obj/machinery/door/window/brigdoor", {
	base_state: "rightsecure",
	dir: 4,
	icon_state: "rightsecure",
});
rt.type(10276, "/obj/machinery/door/window/brigdoor/westright", "/obj/machinery/door/window/brigdoor", {
	base_state: "rightsecure",
	dir: 8,
	icon_state: "rightsecure",
});
rt.type(10277, "/obj/machinery/door/window/brigdoor/southright", "/obj/machinery/door/window/brigdoor", {
	base_state: "rightsecure",
	dir: 2,
	icon_state: "rightsecure",
});
rt.type(10278, "/obj/machinery/door/window/northleft", "/obj/machinery/door/window", {
	dir: 1,
});
rt.type(10279, "/obj/machinery/door/window/eastleft", "/obj/machinery/door/window", {
	dir: 4,
});
rt.type(10280, "/obj/machinery/door/window/westleft", "/obj/machinery/door/window", {
	dir: 8,
});
rt.type(10281, "/obj/machinery/door/window/southleft", "/obj/machinery/door/window", {
	dir: 2,
});
rt.type(10282, "/obj/machinery/door/window/northright", "/obj/machinery/door/window", {
	base_state: "right",
	dir: 1,
	icon_state: "right",
});
rt.type(10283, "/obj/machinery/door/window/eastright", "/obj/machinery/door/window", {
	base_state: "right",
	dir: 4,
	icon_state: "right",
});
rt.type(10284, "/obj/machinery/door/window/westright", "/obj/machinery/door/window", {
	base_state: "right",
	dir: 8,
	icon_state: "right",
});
rt.type(10285, "/obj/machinery/door/window/southright", "/obj/machinery/door/window", {
	base_state: "right",
	dir: 2,
	icon_state: "right",
});
rt.type(10286, "/obj/machinery/door/window/survival_pod", "/obj/machinery/door/window", {
	base_state: "windoor",
	icon: rt.rsc("icons/obj/lavaland/survival_pod.dmi"),
	icon_state: "windoor",
});
rt.type(10287, "/obj/machinery/door/morgue", "/obj/machinery/door", {
	icon: rt.rsc("icons/obj/doors/doormorgue.dmi"),
});
rt.type(10289, "/obj/machinery/door/firedoor/closed", "/obj/machinery/door/firedoor", {
	icon_state: "door_closed",
	opacity: 1,
	density: 1,
});
rt.type(10291, "/obj/machinery/door/firedoor/heavy", "/obj/machinery/door/firedoor", {
	glass: 0,
	explosion_block: 2,
	name: "heavy firelock",
	icon: rt.rsc("icons/obj/doors/doorfire.dmi"),
	assemblytype: rt.typePath("/obj/structure/firelock_frame/heavy"),
	obj_integrity: 550,
	max_integrity: 550,
});
rt.type(10293, "/obj/machinery/door/poddoor/preopen", "/obj/machinery/door/poddoor", {
	icon_state: "open",
	density: 0,
	opacity: 0,
});
rt.type(10294, "/obj/machinery/door/poddoor/ert", "/obj/machinery/door/poddoor", {
	desc: "A heavy duty blast door that only opens for dire emergencies.",
});
rt.type(10297, "/obj/machinery/door/poddoor/shutters/preopen", "/obj/machinery/door/poddoor/shutters", {
	icon_state: "open",
	density: 0,
	opacity: 0,
});
rt.type(10299, "/obj/machinery/door/unpowered/shuttle", "/obj/machinery/door/unpowered", {
	explosion_block: 1,
	icon: rt.rsc("icons/turf/shuttle.dmi"),
	name: "door",
	icon_state: "door1",
	opacity: 1,
	density: 1,
});
rt.type(12555, "/obj/structure/firelock_frame/heavy", "/obj/structure/firelock_frame", {
	reinforced: 1,
	name: "heavy firelock frame",
});
