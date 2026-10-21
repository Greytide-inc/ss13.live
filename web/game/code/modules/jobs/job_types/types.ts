// Types declared in code/modules/jobs/job_types that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(686, "/datum/outfit/job/quartermaster", "/datum/outfit/job", {
	name: "Quartermaster",
	jobtype: rt.typePath("/datum/job/qm"),
	belt: rt.typePath("/obj/item/device/pda/quartermaster"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_cargo"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/cargo"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/brown"),
	glasses: rt.typePath("/obj/item/clothing/glasses/sunglasses"),
	l_hand: rt.typePath("/obj/item/weapon/clipboard"),
});
rt.type(687, "/datum/outfit/job/cargo_tech", "/datum/outfit/job", {
	name: "Cargo Technician",
	jobtype: rt.typePath("/datum/job/cargo_tech"),
	belt: rt.typePath("/obj/item/device/pda/cargo"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_cargo"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/cargotech"),
});
rt.type(689, "/datum/outfit/job/miner/asteroid", "/datum/outfit/job/miner", {
	name: "Shaft Miner (Asteroid)",
	uniform: rt.typePath("/obj/item/clothing/under/rank/miner"),
	shoes: rt.typePath("/obj/item/clothing/shoes/workboots"),
});
rt.type(691, "/datum/outfit/job/miner/equipped/asteroid", "/datum/outfit/job/miner/equipped", {
	name: "Shaft Miner (Asteroid + Equipment)",
	uniform: rt.typePath("/obj/item/clothing/under/rank/miner"),
	shoes: rt.typePath("/obj/item/clothing/shoes/workboots"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/mining"),
	mask: rt.typePath("/obj/item/clothing/mask/breath"),
});
rt.type(694, "/datum/outfit/job/botanist", "/datum/outfit/job", {
	name: "Botanist",
	jobtype: rt.typePath("/datum/job/hydro"),
	belt: rt.typePath("/obj/item/device/pda/botanist"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_srv"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/hydroponics"),
	suit: rt.typePath("/obj/item/clothing/suit/apron"),
	gloves: rt.typePath("/obj/item/clothing/gloves/botanic_leather"),
	suit_store: rt.typePath("/obj/item/device/plant_analyzer"),
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/botany"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/hyd"),
});
rt.type(702, "/datum/outfit/job/ce/rig", "/datum/outfit/job/ce", {
	name: "Chief Engineer (Hardsuit)",
	head: null,
	internals_slot: 17,
	mask: rt.typePath("/obj/item/clothing/mask/breath"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/engine/elite"),
	shoes: rt.typePath("/obj/item/clothing/shoes/magboots/advance"),
	suit_store: rt.typePath("/obj/item/weapon/tank/internals/oxygen"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/yellow"),
});
rt.type(704, "/datum/outfit/job/engineer/gloved", "/datum/outfit/job/engineer", {
	name: "Station Engineer (Gloves)",
	gloves: rt.typePath("/obj/item/clothing/gloves/color/yellow"),
});
rt.type(705, "/datum/outfit/job/engineer/gloved/rig", "/datum/outfit/job/engineer/gloved", {
	name: "Station Engineer (Hardsuit)",
	head: null,
	internals_slot: 17,
	mask: rt.typePath("/obj/item/clothing/mask/breath"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/engine"),
	suit_store: rt.typePath("/obj/item/weapon/tank/internals/oxygen"),
});
rt.type(707, "/datum/outfit/job/atmos/rig", "/datum/outfit/job/atmos", {
	name: "Atmospheric Technician (Hardsuit)",
	internals_slot: 17,
	mask: rt.typePath("/obj/item/clothing/mask/gas"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/engine/atmos"),
	suit_store: rt.typePath("/obj/item/weapon/tank/internals/oxygen"),
});
rt.type(709, "/datum/outfit/job/doctor", "/datum/outfit/job", {
	name: "Medical Doctor",
	jobtype: rt.typePath("/datum/job/doctor"),
	belt: rt.typePath("/obj/item/device/pda/medical"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_med"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/medical"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/white"),
	suit: rt.typePath("/obj/item/clothing/suit/toggle/labcoat"),
	l_hand: rt.typePath("/obj/item/weapon/storage/firstaid/regular"),
	suit_store: rt.typePath("/obj/item/device/flashlight/pen"),
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/medic"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/med"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/med"),
});
rt.type(710, "/datum/outfit/job/chemist", "/datum/outfit/job", {
	name: "Chemist",
	jobtype: rt.typePath("/datum/job/chemist"),
	glasses: rt.typePath("/obj/item/clothing/glasses/science"),
	belt: rt.typePath("/obj/item/device/pda/chemist"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_med"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/chemist"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/white"),
	suit: rt.typePath("/obj/item/clothing/suit/toggle/labcoat/chemist"),
	accessory: rt.typePath("/obj/item/clothing/accessory/pocketprotector/full"),
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/chemistry"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/chem"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/med"),
});
rt.type(711, "/datum/outfit/job/geneticist", "/datum/outfit/job", {
	name: "Geneticist",
	jobtype: rt.typePath("/datum/job/geneticist"),
	belt: rt.typePath("/obj/item/device/pda/geneticist"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_medsci"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/geneticist"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/white"),
	suit: rt.typePath("/obj/item/clothing/suit/toggle/labcoat/genetics"),
	suit_store: rt.typePath("/obj/item/device/flashlight/pen"),
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/genetics"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/gen"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/med"),
});
rt.type(712, "/datum/outfit/job/virologist", "/datum/outfit/job", {
	name: "Virologist",
	jobtype: rt.typePath("/datum/job/virologist"),
	belt: rt.typePath("/obj/item/device/pda/viro"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_med"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/virologist"),
	mask: rt.typePath("/obj/item/clothing/mask/surgical"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/white"),
	suit: rt.typePath("/obj/item/clothing/suit/toggle/labcoat/virologist"),
	suit_store: rt.typePath("/obj/item/device/flashlight/pen"),
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/virology"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/vir"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/med"),
});
rt.type(714, "/datum/outfit/job/rd/rig", "/datum/outfit/job/rd", {
	name: "Research Director (Hardsuit)",
	l_hand: null,
	internals_slot: 17,
	mask: rt.typePath("/obj/item/clothing/mask/breath"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/rd"),
	suit_store: rt.typePath("/obj/item/weapon/tank/internals/oxygen"),
});
rt.type(715, "/datum/outfit/job/scientist", "/datum/outfit/job", {
	name: "Scientist",
	jobtype: rt.typePath("/datum/job/scientist"),
	belt: rt.typePath("/obj/item/device/pda/toxins"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_sci"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/scientist"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/white"),
	suit: rt.typePath("/obj/item/clothing/suit/toggle/labcoat/science"),
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/science"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/tox"),
	accessory: rt.typePath("/obj/item/clothing/accessory/pocketprotector/full"),
});
rt.type(716, "/datum/outfit/job/roboticist", "/datum/outfit/job", {
	name: "Roboticist",
	pda_slot: 15,
	jobtype: rt.typePath("/datum/job/roboticist"),
	belt: rt.typePath("/obj/item/weapon/storage/belt/utility/full"),
	l_pocket: rt.typePath("/obj/item/device/pda/roboticist"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_sci"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/roboticist"),
	suit: rt.typePath("/obj/item/clothing/suit/toggle/labcoat"),
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/science"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/tox"),
});
