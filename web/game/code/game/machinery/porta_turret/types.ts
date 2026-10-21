// Types declared in code/game/machinery/porta_turret that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(10751, "/obj/machinery/porta_turret/stationary", "/obj/machinery/porta_turret", {
	mode: 1,
	installation: rt.typePath("/obj/item/weapon/gun/energy/laser"),
	emagged: 1,
});
rt.type(10753, "/obj/machinery/porta_turret/syndicate/energy", "/obj/machinery/porta_turret/syndicate", {
	base_icon_state: "standard",
	stun_projectile: rt.typePath("/obj/item/projectile/energy/electrode"),
	stun_projectile_sound: rt.rsc("sound/weapons/taser.ogg"),
	lethal_projectile: rt.typePath("/obj/item/projectile/beam/laser/heavylaser"),
	lethal_projectile_sound: rt.rsc("sound/weapons/lasercannonfire.ogg"),
	icon_state: "standard_stun",
});
rt.type(10754, "/obj/machinery/porta_turret/syndicate/pod", "/obj/machinery/porta_turret/syndicate", {
	stun_projectile: rt.typePath("/obj/item/projectile/bullet/weakbullet3"),
	lethal_projectile: rt.typePath("/obj/item/projectile/bullet/weakbullet3"),
	max_integrity: 40,
	integrity_failure: 20,
	obj_integrity: 40,
});
rt.type(10755, "/obj/machinery/porta_turret/syndicate/vehicle_turret", "/obj/machinery/porta_turret/syndicate", {
	scan_range: 7,
	emp_vunerable: 1,
	name: "mounted turret",
	density: 0,
});
rt.type(10756, "/obj/machinery/porta_turret/ai", "/obj/machinery/porta_turret", {
	faction: "silicon",
});
rt.type(10758, "/obj/machinery/porta_turret/centcomm_shuttle", "/obj/machinery/porta_turret", {
	installation: null,
	always_up: 1,
	has_cover: 0,
	scan_range: 9,
	stun_projectile: rt.typePath("/obj/item/projectile/beam/laser"),
	lethal_projectile: rt.typePath("/obj/item/projectile/beam/laser"),
	lethal_projectile_sound: rt.rsc("sound/weapons/plasma_cutter.ogg"),
	stun_projectile_sound: rt.rsc("sound/weapons/plasma_cutter.ogg"),
	base_icon_state: "syndie",
	faction: "turret",
	emp_vunerable: 0,
	mode: 1,
	obj_integrity: 260,
	max_integrity: 260,
	use_power: 0,
	icon_state: "syndie_off",
});
rt.type(10760, "/obj/machinery/porta_turret/lasertag/red", "/obj/machinery/porta_turret/lasertag", {
	installation: rt.typePath("/obj/item/weapon/gun/energy/laser/redtag"),
	team_color: "red",
});
rt.type(10761, "/obj/machinery/porta_turret/lasertag/blue", "/obj/machinery/porta_turret/lasertag", {
	installation: rt.typePath("/obj/item/weapon/gun/energy/laser/bluetag"),
	team_color: "blue",
});
