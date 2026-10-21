// Types declared in code/game/objects/structures/crates_lockers/closets that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(12292, "/obj/structure/closet/cardboard/metal", "/obj/structure/closet/cardboard", {
	mob_storage_capacity: 5,
	move_speed_multiplier: 2,
	cutting_tool: rt.typePath("/obj/item/weapon/weldingtool"),
	open_sound: rt.rsc("sound/machines/click.ogg"),
	cutting_sound: rt.rsc("sound/items/welder.ogg"),
	material_drop: rt.typePath("/obj/item/stack/sheet/plasteel"),
	name: "large metal box",
	desc: "THE COWARDS! THE FOOLS!",
	icon_state: "metalbox",
	obj_integrity: 500,
	resistance_flags: 0,
});
