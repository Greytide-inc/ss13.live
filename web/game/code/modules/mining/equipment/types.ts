// Types declared in code/modules/mining/equipment that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(7531, "/obj/item/weapon/pickaxe/silver", "/obj/item/weapon/pickaxe", {
	digspeed: 20,
	name: "silver-plated pickaxe",
	icon_state: "spickaxe",
	item_state: "spickaxe",
	origin_tech: "materials=3;engineering=4",
	desc: "A silver-plated pickaxe that mines slightly faster than standard-issue.",
	force: 17,
});
rt.type(7532, "/obj/item/weapon/pickaxe/diamond", "/obj/item/weapon/pickaxe", {
	digspeed: 14,
	name: "diamond-tipped pickaxe",
	icon_state: "dpickaxe",
	item_state: "dpickaxe",
	origin_tech: "materials=5;engineering=4",
	desc: "A pickaxe with a diamond pick head. Extremely robust at cracking rock walls and digging up dirt.",
	force: 19,
});
rt.type(7534, "/obj/item/weapon/pickaxe/drill/cyborg", "/obj/item/weapon/pickaxe/drill", {
	flags: 2,
	name: "cyborg mining drill",
	desc: "An integrated electric mining drill.",
});
rt.type(7535, "/obj/item/weapon/pickaxe/drill/cyborg/diamond", "/obj/item/weapon/pickaxe/drill/cyborg", {
	digspeed: 7,
	name: "diamond-tipped cyborg mining drill",
	icon_state: "diamonddrill",
});
rt.type(7536, "/obj/item/weapon/pickaxe/drill/diamonddrill", "/obj/item/weapon/pickaxe/drill", {
	digspeed: 7,
	name: "diamond-tipped mining drill",
	icon_state: "diamonddrill",
	origin_tech: "materials=6;powerstorage=4;engineering=4",
	desc: "Yours is the drill that will pierce the heavens!",
});
rt.type(7538, "/obj/item/weapon/pickaxe/emergency", "/obj/item/weapon/pickaxe", {
	name: "emergency disembarkation tool",
	desc: "For extracting yourself from rough landings.",
});
rt.type(7540, "/obj/item/weapon/shovel/spade", "/obj/item/weapon/shovel", {
	name: "spade",
	desc: "A small tool for digging and moving dirt.",
	icon_state: "spade",
	item_state: "spade",
	force: 5,
	throwforce: 7,
	w_class: 2,
});
rt.type(7543, "/obj/item/weapon/resonator/upgraded", "/obj/item/weapon/resonator", {
	fieldlimit: 6,
	quick_burst_mod: 1,
	name: "upgraded resonator",
	desc: "An upgraded version of the resonator that can produce more fields at once, as well as having no damage penalty for bursting a resonance field early.",
	icon_state: "resonator_u",
	item_state: "resonator_u",
	origin_tech: "materials=4;powerstorage=3;engineering=3;magnets=3",
});
rt.type(7545, "/obj/item/weapon/survivalcapsule/luxury", "/obj/item/weapon/survivalcapsule", {
	template_id: "shelter_beta",
	name: "luxury bluespace shelter capsule",
	desc: "An exorbitantly expensive luxury suite stored within a pocket of bluespace.",
	origin_tech: "engineering=3;bluespace=4",
});
rt.type(9112, "/obj/item/stack/marker_beacon/ten", "/obj/item/stack/marker_beacon", {
	amount: 10,
});
rt.type(9113, "/obj/item/stack/marker_beacon/thirty", "/obj/item/stack/marker_beacon", {
	amount: 30,
});
rt.type(9281, "/obj/item/device/t_scanner/adv_mining_scanner/lesser", "/obj/item/device/t_scanner/adv_mining_scanner", {
	range: 4,
	cooldown: 50,
	name: "automatic mining scanner",
	desc: "A scanner that automatically checks surrounding rock for useful minerals; it can also be used to stop gibtonite detonations.",
});
rt.type(10266, "/obj/machinery/door/airlock/survival_pod/vertical", "/obj/machinery/door/airlock/survival_pod", {
	expected_dir: 4,
	dir: 4,
});
rt.type(12458, "/obj/structure/door_assembly/door_assembly_pod/vertical", "/obj/structure/door_assembly/door_assembly_pod", {
	expected_dir: 4,
	dir: 4,
});
rt.type(12959, "/obj/structure/fans/tiny", "/obj/structure/fans", {
	buildstackamount: 2,
	name: "tiny fan",
	desc: "A tiny fan, releasing a thin gust of air.",
	layer: 2.08,
	density: 0,
	icon_state: "fan_tiny",
});
rt.type(12960, "/obj/structure/fans/tiny/invisible", "/obj/structure/fans/tiny", {
	name: "air flow blocker",
	resistance_flags: 115,
	invisibility: 101,
});
