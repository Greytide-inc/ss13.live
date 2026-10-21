// Types declared in code/game/objects/items/weapons/tanks that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(6375, "/obj/item/weapon/reagent_containers/spray/mister/operator", "/obj/item/weapon/reagent_containers/spray/mister", {
	name: "janitor spray nozzle",
	desc: "A mister nozzle attached to several extended water tanks. It suspiciously has a compressor in the system and is labelled entirely in New Cyrillic.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "misterjani",
	item_state: "misterjani",
	w_class: 4,
	amount_per_transfer_from_this: 100,
	possible_transfer_amounts: null,
});
rt.type(7448, "/obj/item/weapon/tank/jetpack/void", "/obj/item/weapon/tank/jetpack", {
	name: "void jetpack (oxygen)",
	desc: "It works well in a void.",
	icon_state: "jetpack-void",
	item_state: "jetpack-void",
});
rt.type(7449, "/obj/item/weapon/tank/jetpack/oxygen", "/obj/item/weapon/tank/jetpack", {
	name: "jetpack (oxygen)",
	desc: "A tank of compressed oxygen for use as propulsion in zero-gravity areas. Use with caution.",
	icon_state: "jetpack",
	item_state: "jetpack",
});
rt.type(7450, "/obj/item/weapon/tank/jetpack/oxygen/harness", "/obj/item/weapon/tank/jetpack/oxygen", {
	throw_range: 7,
	name: "jet harness (oxygen)",
	desc: "A lightweight tactical harness, used by those who don't want to be weighed down by traditional jetpacks.",
	icon_state: "jetpack-mini",
	item_state: "jetpack-mini",
	volume: 40,
	w_class: 3,
});
rt.type(7451, "/obj/item/weapon/tank/jetpack/oxygen/captain", "/obj/item/weapon/tank/jetpack/oxygen", {
	name: "１Captain's jetpack",
	desc: "A compact, lightweight jetpack containing a high amount of compressed oxygen.",
	icon_state: "jetpack-captain",
	item_state: "jetpack-captain",
	w_class: 3,
	volume: 90,
	resistance_flags: 99,
});
rt.type(7452, "/obj/item/weapon/tank/jetpack/oxygen/security", "/obj/item/weapon/tank/jetpack/oxygen", {
	name: "security jetpack (oxygen)",
	desc: "A tank of compressed oxygen for use as propulsion in zero-gravity areas by security forces.",
	icon_state: "jetpack-sec",
	item_state: "jetpack-sec",
});
rt.type(7453, "/obj/item/weapon/tank/jetpack/carbondioxide", "/obj/item/weapon/tank/jetpack", {
	gas_type: "co2",
	name: "jetpack (carbon dioxide)",
	desc: "A tank of compressed carbon dioxide for use as propulsion in zero-gravity areas. Painted black to indicate that it should not be used as a source for internals.",
	icon_state: "jetpack-black",
	item_state: "jetpack-black",
	distribute_pressure: 0,
});
rt.type(7455, "/obj/item/weapon/tank/internals", "/obj/item/weapon/tank", {});
rt.type(7457, "/obj/item/weapon/tank/internals/oxygen/yellow", "/obj/item/weapon/tank/internals/oxygen", {
	desc: "A tank of oxygen, this one is yellow.",
	icon_state: "oxygen_f",
	dog_fashion: null,
});
rt.type(7458, "/obj/item/weapon/tank/internals/oxygen/red", "/obj/item/weapon/tank/internals/oxygen", {
	desc: "A tank of oxygen, this one is red.",
	icon_state: "oxygen_fr",
	dog_fashion: null,
});
rt.type(7465, "/obj/item/weapon/tank/internals/plasmaman/belt", "/obj/item/weapon/tank/internals/plasmaman", {
	icon_state: "plasmaman_tank_belt",
	item_state: "plasmaman_tank_belt",
	slot_flags: 512,
	force: 5,
	volume: 6,
	w_class: 2,
});
rt.type(7468, "/obj/item/weapon/tank/internals/emergency_oxygen/engi", "/obj/item/weapon/tank/internals/emergency_oxygen", {
	name: "extended-capacity emergency oxygen tank",
	icon_state: "emergency_engi",
	volume: 6,
});
rt.type(7469, "/obj/item/weapon/tank/internals/emergency_oxygen/double", "/obj/item/weapon/tank/internals/emergency_oxygen", {
	name: "double emergency oxygen tank",
	icon_state: "emergency_engi",
	volume: 10,
});
