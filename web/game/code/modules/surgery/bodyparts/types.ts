// Types declared in code/modules/surgery/bodyparts that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(10167, "/obj/item/bodypart/chest/monkey", "/obj/item/bodypart/chest", {
	animal_origin: "monkey",
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "default_monkey_chest",
});
rt.type(10168, "/obj/item/bodypart/chest/alien", "/obj/item/bodypart/chest", {
	dismemberable: 0,
	max_damage: 500,
	animal_origin: "alien",
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "alien_chest",
});
rt.type(10169, "/obj/item/bodypart/chest/devil", "/obj/item/bodypart/chest", {
	dismemberable: 0,
	max_damage: 5000,
	animal_origin: "devil",
});
rt.type(10170, "/obj/item/bodypart/chest/larva", "/obj/item/bodypart/chest", {
	dismemberable: 0,
	max_damage: 50,
	animal_origin: "larva",
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "larva_chest",
});
rt.type(10173, "/obj/item/bodypart/l_arm/monkey", "/obj/item/bodypart/l_arm", {
	animal_origin: "monkey",
	px_x: -5,
	px_y: -3,
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "default_monkey_l_arm",
});
rt.type(10174, "/obj/item/bodypart/l_arm/alien", "/obj/item/bodypart/l_arm", {
	px_x: 0,
	px_y: 0,
	dismemberable: 0,
	max_damage: 100,
	animal_origin: "alien",
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "alien_l_arm",
});
rt.type(10175, "/obj/item/bodypart/l_arm/devil", "/obj/item/bodypart/l_arm", {
	dismemberable: 0,
	max_damage: 5000,
	animal_origin: "devil",
});
rt.type(10176, "/obj/item/bodypart/l_arm/robot", "/obj/item/bodypart/l_arm", {
	attack_verb: null,
	item_state: "buildpipe",
	flags: 64,
	status: 2,
	name: "cyborg left arm",
	desc: "A skeletal limb wrapped in pseudomuscles, with a low-conductivity case.",
	icon: rt.rsc("icons/obj/robot_parts.dmi"),
	icon_state: "borg_l_arm",
});
rt.type(10177, "/obj/item/bodypart/l_arm/robot/surplus", "/obj/item/bodypart/l_arm/robot", {
	max_damage: 20,
	name: "surplus prosthetic left arm",
	desc: "A skeletal, robotic limb. Outdated and fragile, but it's still better than nothing.",
	icon: rt.rsc("icons/mob/surplus_augments.dmi"),
	icon_state: "l_arm",
});
rt.type(10179, "/obj/item/bodypart/r_arm/monkey", "/obj/item/bodypart/r_arm", {
	animal_origin: "monkey",
	px_x: 5,
	px_y: -3,
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "default_monkey_r_arm",
});
rt.type(10180, "/obj/item/bodypart/r_arm/alien", "/obj/item/bodypart/r_arm", {
	px_x: 0,
	px_y: 0,
	dismemberable: 0,
	max_damage: 100,
	animal_origin: "alien",
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "alien_r_arm",
});
rt.type(10181, "/obj/item/bodypart/r_arm/devil", "/obj/item/bodypart/r_arm", {
	dismemberable: 0,
	max_damage: 5000,
	animal_origin: "devil",
});
rt.type(10182, "/obj/item/bodypart/r_arm/robot", "/obj/item/bodypart/r_arm", {
	attack_verb: null,
	item_state: "buildpipe",
	flags: 64,
	status: 2,
	name: "cyborg right arm",
	desc: "A skeletal limb wrapped in pseudomuscles, with a low-conductivity case.",
	icon: rt.rsc("icons/obj/robot_parts.dmi"),
	icon_state: "borg_r_arm",
});
rt.type(10183, "/obj/item/bodypart/r_arm/robot/surplus", "/obj/item/bodypart/r_arm/robot", {
	max_damage: 20,
	name: "surplus prosthetic right arm",
	desc: "A skeletal, robotic limb. Outdated and fragile, but it's still better than nothing.",
	icon: rt.rsc("icons/mob/surplus_augments.dmi"),
	icon_state: "r_arm",
});
rt.type(10185, "/obj/item/bodypart/l_leg/digitigrade", "/obj/item/bodypart/l_leg", {
	use_digitigrade: 1,
	name: "left digitigrade leg",
});
rt.type(10186, "/obj/item/bodypart/l_leg/monkey", "/obj/item/bodypart/l_leg", {
	animal_origin: "monkey",
	px_y: 4,
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "default_monkey_l_leg",
});
rt.type(10187, "/obj/item/bodypart/l_leg/alien", "/obj/item/bodypart/l_leg", {
	px_x: 0,
	px_y: 0,
	dismemberable: 0,
	max_damage: 100,
	animal_origin: "alien",
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "alien_l_leg",
});
rt.type(10188, "/obj/item/bodypart/l_leg/devil", "/obj/item/bodypart/l_leg", {
	dismemberable: 0,
	max_damage: 5000,
	animal_origin: "devil",
});
rt.type(10189, "/obj/item/bodypart/l_leg/robot", "/obj/item/bodypart/l_leg", {
	attack_verb: null,
	item_state: "buildpipe",
	flags: 64,
	status: 2,
	name: "cyborg left leg",
	desc: "A skeletal limb wrapped in pseudomuscles, with a low-conductivity case.",
	icon: rt.rsc("icons/obj/robot_parts.dmi"),
	icon_state: "borg_l_leg",
});
rt.type(10190, "/obj/item/bodypart/l_leg/robot/surplus", "/obj/item/bodypart/l_leg/robot", {
	max_damage: 20,
	name: "surplus prosthetic left leg",
	desc: "A skeletal, robotic limb. Outdated and fragile, but it's still better than nothing.",
	icon: rt.rsc("icons/mob/surplus_augments.dmi"),
	icon_state: "l_leg",
});
rt.type(10192, "/obj/item/bodypart/r_leg/digitigrade", "/obj/item/bodypart/r_leg", {
	use_digitigrade: 1,
	name: "right digitigrade leg",
});
rt.type(10193, "/obj/item/bodypart/r_leg/monkey", "/obj/item/bodypart/r_leg", {
	animal_origin: "monkey",
	px_y: 4,
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "default_monkey_r_leg",
});
rt.type(10194, "/obj/item/bodypart/r_leg/alien", "/obj/item/bodypart/r_leg", {
	px_x: 0,
	px_y: 0,
	dismemberable: 0,
	max_damage: 100,
	animal_origin: "alien",
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "alien_r_leg",
});
rt.type(10195, "/obj/item/bodypart/r_leg/devil", "/obj/item/bodypart/r_leg", {
	dismemberable: 0,
	max_damage: 5000,
	animal_origin: "devil",
});
rt.type(10196, "/obj/item/bodypart/r_leg/robot", "/obj/item/bodypart/r_leg", {
	attack_verb: null,
	item_state: "buildpipe",
	flags: 64,
	status: 2,
	name: "cyborg right leg",
	desc: "A skeletal limb wrapped in pseudomuscles, with a low-conductivity case.",
	icon: rt.rsc("icons/obj/robot_parts.dmi"),
	icon_state: "borg_r_leg",
});
rt.type(10197, "/obj/item/bodypart/r_leg/robot/surplus", "/obj/item/bodypart/r_leg/robot", {
	max_damage: 20,
	name: "surplus prosthetic right leg",
	desc: "A skeletal, robotic limb. Outdated and fragile, but it's still better than nothing.",
	icon: rt.rsc("icons/mob/surplus_augments.dmi"),
	icon_state: "r_leg",
});
rt.type(10199, "/obj/item/bodypart/head/monkey", "/obj/item/bodypart/head", {
	animal_origin: "monkey",
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "default_monkey_head",
});
rt.type(10200, "/obj/item/bodypart/head/alien", "/obj/item/bodypart/head", {
	px_x: 0,
	px_y: 0,
	dismemberable: 0,
	max_damage: 500,
	animal_origin: "alien",
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "alien_head",
});
rt.type(10201, "/obj/item/bodypart/head/devil", "/obj/item/bodypart/head", {
	dismemberable: 0,
	max_damage: 5000,
	animal_origin: "devil",
});
rt.type(10202, "/obj/item/bodypart/head/larva", "/obj/item/bodypart/head", {
	px_x: 0,
	px_y: 0,
	dismemberable: 0,
	max_damage: 50,
	animal_origin: "larva",
	icon: rt.rsc("icons/mob/animal_parts.dmi"),
	icon_state: "larva_head",
});
