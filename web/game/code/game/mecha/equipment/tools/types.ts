// Types declared in code/game/mecha/equipment/tools that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(9612, "/obj/item/mecha_parts/mecha_equipment/drill/diamonddrill", "/obj/item/mecha_parts/mecha_equipment/drill", {
	equip_cooldown: 20,
	name: "diamond-tipped exosuit drill",
	desc: "Equipment for engineering and combat exosuits. This is an upgraded version of the drill that'll pierce the heavens!",
	icon_state: "mecha_diamond_drill",
	origin_tech: "materials=4;engineering=4",
	force: 15,
});
