// Types declared in code/game/objects/structures/crates_lockers that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(12252, "/obj/structure/closet/abductor", "/obj/structure/closet", {
	name: "alien locker",
	desc: "Contains secrets of the universe.",
	icon_state: "abductor",
	icon_door: "abductor",
	can_weld_shut: 0,
	material_drop: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
});
rt.type(12254, "/obj/structure/closet/crate/internals", "/obj/structure/closet/crate", {
	desc: "A internals crate.",
	name: "internals crate",
	icon_state: "o2crate",
});
rt.type(12255, "/obj/structure/closet/crate/trashcart", "/obj/structure/closet/crate", {
	desc: "A heavy, metal trashcart with wheels.",
	name: "trash cart",
	icon_state: "trashcart",
});
rt.type(12256, "/obj/structure/closet/crate/medical", "/obj/structure/closet/crate", {
	desc: "A medical crate.",
	name: "medical crate",
	icon_state: "medicalcrate",
});
rt.type(12257, "/obj/structure/closet/crate/freezer", "/obj/structure/closet/crate", {
	desc: "A freezer.",
	name: "freezer",
	icon_state: "freezer",
});
rt.type(12260, "/obj/structure/closet/crate/radiation", "/obj/structure/closet/crate", {
	desc: "A crate with a radiation sign on it.",
	name: "radiation crate",
	icon_state: "radiation",
});
rt.type(12261, "/obj/structure/closet/crate/hydroponics", "/obj/structure/closet/crate", {
	name: "hydroponics crate",
	desc: "All you need to destroy those pesky weeds and pests.",
	icon_state: "hydrocrate",
});
rt.type(12262, "/obj/structure/closet/crate/engineering", "/obj/structure/closet/crate", {
	name: "engineering crate",
	icon_state: "engi_crate",
});
rt.type(12263, "/obj/structure/closet/crate/engineering/electrical", "/obj/structure/closet/crate/engineering", {
	icon_state: "engi_e_crate",
});
rt.type(12265, "/obj/structure/closet/crate/science", "/obj/structure/closet/crate", {
	name: "science crate",
	desc: "A science crate.",
	icon_state: "scicrate",
});
rt.type(12277, "/obj/structure/closet/crate/wooden", "/obj/structure/closet/crate", {
	material_drop: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	material_drop_amount: 6,
	name: "wooden crate",
	desc: "Works just as well as a metal one.",
	icon_state: "wooden",
});
rt.type(12280, "/obj/structure/closet/crate/miningcar", "/obj/structure/closet/crate", {
	desc: "A mining car. This one doesn't work on rails, but has to be dragged.",
	name: "Mining car (not for rails)",
	icon_state: "miningcar",
});
rt.type(12281, "/obj/structure/closet/crate/necropolis", "/obj/structure/closet/crate", {
	name: "necropolis chest",
	desc: "It's watching you closely.",
	icon_state: "necrocrate",
	resistance_flags: 35,
});
rt.type(12296, "/obj/structure/closet/lasertag", "/obj/structure/closet", {});
rt.type(12299, "/obj/structure/closet/cabinet", "/obj/structure/closet", {
	name: "cabinet",
	desc: "Old will forever be in fashion.",
	icon_state: "cabinet",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
});
rt.type(12300, "/obj/structure/closet/acloset", "/obj/structure/closet", {
	name: "strange closet",
	desc: "It looks alien!",
	icon_state: "alien",
});
rt.type(12301, "/obj/structure/closet/gimmick", "/obj/structure/closet", {
	name: "administrative supply closet",
	desc: "It's a storage unit for things that have no right being here.",
	icon_state: "syndicate",
});
rt.type(12304, "/obj/structure/closet/thunderdome", "/obj/structure/closet", {
	anchored: 1,
	name: "１Thunderdome closet",
	desc: "Everything you need!",
});
rt.type(12307, "/obj/structure/closet/malf", "/obj/structure/closet", {});
rt.type(12337, "/obj/structure/closet/coffin", "/obj/structure/closet", {
	horizontal: 1,
	delivery_icon: "deliverycrate",
	material_drop: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	material_drop_amount: 5,
	name: "coffin",
	desc: "It's a burial receptacle for the dearly departed.",
	icon_state: "coffin",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
});
rt.type(12343, "/obj/structure/closet/syndicate", "/obj/structure/closet", {
	name: "armory closet",
	desc: "Why is this here?",
	icon_state: "syndicate",
});
