// Types declared in code/game/gamemodes that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(564, "/datum/atom_hud/antag/hidden", "/datum/atom_hud/antag", {
	self_visible: 0,
});
rt.type(1127, "/datum/objective/destroy/internal", "/datum/objective/destroy", {
	stolen: 0,
});
rt.type(1131, "/datum/objective/changeling_team_objective", "/datum/objective", {
	min_lings: 3,
	escape_objective_compatible: 0,
	martyr_compatible: 0,
	explanation_text: "Changeling Friendship!",
});
rt.type(1133, "/datum/objective/changeling_team_objective/impersonate_department/impersonate_heads", "/datum/objective/changeling_team_objective/impersonate_department", {
	explanation_text: "Have X or more heads of staff escape on the shuttle disguised as heads, while the real heads are dead",
	command_staff_only: 1,
});
rt.type(1134, "/datum/objective/devil", "/datum/objective", {
	dangerrating: 5,
});
rt.type(1140, "/datum/objective/abductee", "/datum/objective", {
	dangerrating: 5,
	completed: 1,
});
rt.type(1151, "/datum/objective/sintouched", "/datum/objective", {
	dangerrating: 5,
	completed: 1,
});
rt.type(1152, "/datum/objective/sintouched/gluttony", "/datum/objective/sintouched", {
	explanation_text: "Everything is so delicious. Go eat everything.",
});
rt.type(1153, "/datum/objective/sintouched/greed", "/datum/objective/sintouched", {
	explanation_text: "You want MORE, more money, more wealth, more riches.  Go get it, but don't hurt people for it.",
});
rt.type(1154, "/datum/objective/sintouched/sloth", "/datum/objective/sintouched", {
	explanation_text: "You just get tired randomly.  Go take a nap at a time that would inconvenience other people.",
});
rt.type(1155, "/datum/objective/sintouched/wrath", "/datum/objective/sintouched", {
	explanation_text: "What have your coworkers ever done for you? Don't offer to help them in any matter, and refuse if asked.",
});
rt.type(1156, "/datum/objective/sintouched/envy", "/datum/objective/sintouched", {
	explanation_text: "Why should you be stuck with your rank? Show everyone you can do other jobs too, and don't let anyone stop you, least of all because you have no training",
});
rt.type(1157, "/datum/objective/sintouched/pride", "/datum/objective/sintouched", {
	explanation_text: "You are the BEST thing on the station.  Make sure everyone knows it.",
});
rt.type(1158, "/datum/objective/sintouched/acedia", "/datum/objective/sintouched", {
	explanation_text: "Angels, devils, good, evil... who cares?  Just ignore any hellish threats and do your job.",
});
rt.type(1160, "/datum/objective_item/steal", "/datum/objective_item", {});
rt.type(1169, "/datum/objective_item/steal/reflector", "/datum/objective_item/steal", {
	name: "a reflector vest",
	difficulty: 3,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/clothing/suit/armor/laserproof"),
});
rt.type(1171, "/datum/objective_item/steal/documents", "/datum/objective_item/steal", {
	name: "any set of secret documents of any organization",
	difficulty: 5,
	targetitem: rt.typePath("/obj/item/documents"),
});
rt.type(1178, "/datum/objective_item/unique", "/datum/objective_item", {});
rt.type(1179, "/datum/objective_item/unique/docs_red", "/datum/objective_item/unique", {
	name: "the \"Red\" secret documents",
	difficulty: 10,
	targetitem: rt.typePath("/obj/item/documents/syndicate/red"),
});
rt.type(1180, "/datum/objective_item/unique/docs_blue", "/datum/objective_item/unique", {
	name: "the \"Blue\" secret documents",
	difficulty: 10,
	targetitem: rt.typePath("/obj/item/documents/syndicate/blue"),
});
rt.type(1181, "/datum/objective_item/special", "/datum/objective_item", {});
rt.type(1182, "/datum/objective_item/special/pinpointer", "/datum/objective_item/special", {
	name: "the captain's pinpointer",
	difficulty: 10,
	targetitem: rt.typePath("/obj/item/weapon/pinpointer"),
});
rt.type(1183, "/datum/objective_item/special/aegun", "/datum/objective_item/special", {
	name: "an advanced energy gun",
	difficulty: 10,
	targetitem: rt.typePath("/obj/item/weapon/gun/energy/e_gun/nuclear"),
});
rt.type(1184, "/datum/objective_item/special/ddrill", "/datum/objective_item/special", {
	name: "a diamond drill",
	difficulty: 10,
	targetitem: rt.typePath("/obj/item/weapon/pickaxe/drill/diamonddrill"),
});
rt.type(1185, "/datum/objective_item/special/boh", "/datum/objective_item/special", {
	name: "a bag of holding",
	difficulty: 10,
	targetitem: rt.typePath("/obj/item/weapon/storage/backpack/holding"),
});
rt.type(1186, "/datum/objective_item/special/hypercell", "/datum/objective_item/special", {
	name: "a hyper-capacity cell",
	difficulty: 5,
	targetitem: rt.typePath("/obj/item/weapon/stock_parts/cell/hyper"),
});
rt.type(1187, "/datum/objective_item/special/laserpointer", "/datum/objective_item/special", {
	name: "a laser pointer",
	difficulty: 5,
	targetitem: rt.typePath("/obj/item/device/laser_pointer"),
});
rt.type(1188, "/datum/objective_item/special/corgimeat", "/datum/objective_item/special", {
	name: "a piece of corgi meat",
	difficulty: 5,
	targetitem: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi"),
});
rt.type(1190, "/datum/objective_item/stack/diamond", "/datum/objective_item/stack", {
	name: "10 diamonds",
	difficulty: 10,
	targetitem: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
});
rt.type(1191, "/datum/objective_item/stack/gold", "/datum/objective_item/stack", {
	name: "50 gold bars",
	difficulty: 15,
	targetitem: rt.typePath("/obj/item/stack/sheet/mineral/gold"),
});
rt.type(1192, "/datum/objective_item/stack/uranium", "/datum/objective_item/stack", {
	name: "25 refined uranium bars",
	difficulty: 10,
	targetitem: rt.typePath("/obj/item/stack/sheet/mineral/uranium"),
});
rt.type(5650, "/obj/item/weapon/antag_spawner/nuke_ops/borg_tele/assault", "/obj/item/weapon/antag_spawner/nuke_ops/borg_tele", {
	borg_to_spawn: "Assault",
	name: "syndicate assault cyborg teleporter",
});
rt.type(5651, "/obj/item/weapon/antag_spawner/nuke_ops/borg_tele/medical", "/obj/item/weapon/antag_spawner/nuke_ops/borg_tele", {
	borg_to_spawn: "Medical",
	name: "syndicate medical teleporter",
});
rt.type(5653, "/obj/item/weapon/antag_spawner/slaughter_demon/laughter", "/obj/item/weapon/antag_spawner/slaughter_demon", {
	veil_msg: "<span class='warning'>You sense an adorable presence lurking just beyond the veil...</span>",
	objective_verb: "Hug and Tickle",
	demon_type: rt.typePath("/mob/living/simple_animal/slaughter/laughter"),
	name: "vial of tickles",
	desc: "A magically infused bottle of clown love, distilled from countless hugging attacks. Used in funny rituals to attract adorable creatures.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "vial",
	color: "#FF69B4",
});
