// Types declared in code/game/mecha that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(4552, "/turf/open/floor/mech_bay_recharge_floor/airless", "/turf/open/floor/mech_bay_recharge_floor", {
	icon_state: "recharge_floor_asteroid",
	initial_gas_mix: "TEMP=2.7",
});
rt.type(9558, "/obj/item/mecha_parts/mecha_tracking/ai_control", "/obj/item/mecha_parts/mecha_tracking", {
	ai_beacon: 1,
	name: "exosuit AI control beacon",
	desc: "A device used to transmit exosuit data. Also allows active AI units to take control of said exosuit.",
	origin_tech: "programming=3;magnets=2;engineering=2",
});
rt.type(12558, "/obj/structure/mecha_wreckage/gygax/dark", "/obj/structure/mecha_wreckage/gygax", {
	name: "１Dark Gygax wreckage",
	icon_state: "darkgygax-broken",
});
rt.type(12559, "/obj/structure/mecha_wreckage/marauder", "/obj/structure/mecha_wreckage", {
	name: "１Marauder wreckage",
	icon_state: "marauder-broken",
});
rt.type(12560, "/obj/structure/mecha_wreckage/mauler", "/obj/structure/mecha_wreckage", {
	name: "１Mauler wreckage",
	icon_state: "mauler-broken",
	desc: "The syndicate won't be very happy about this...",
});
rt.type(12561, "/obj/structure/mecha_wreckage/seraph", "/obj/structure/mecha_wreckage", {
	name: "１Seraph wreckage",
	icon_state: "seraph-broken",
});
rt.type(12562, "/obj/structure/mecha_wreckage/reticence", "/obj/structure/mecha_wreckage", {
	name: "１Reticence wreckage",
	icon_state: "reticence-broken",
	color: "#87878715",
	desc: "...",
});
rt.type(12565, "/obj/structure/mecha_wreckage/ripley/deathripley", "/obj/structure/mecha_wreckage/ripley", {
	name: "１Death-Ripley wreckage",
	icon_state: "deathripley-broken",
});
rt.type(12568, "/obj/structure/mecha_wreckage/phazon", "/obj/structure/mecha_wreckage", {
	name: "１Phazon wreckage",
	icon_state: "phazon-broken",
});
