// Types declared in code/modules/mob/living/simple_animal/friendly that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(5054, "/mob/living/simple_animal/pet/dog/corgi/puppy/void", "/mob/living/simple_animal/pet/dog/corgi/puppy", {
	nofur: 1,
	name: "１void puppy",
	real_name: "voidy",
	desc: "A corgi puppy that has been infused with deep space energy. It's staring back..",
	icon_state: "void_puppy",
	icon_living: "void_puppy",
	icon_dead: "void_puppy_dead",
	unsuitable_atmos_damage: 0,
	minbodytemp: 2.7,
	maxbodytemp: 313.15,
});
rt.type(5058, "/mob/living/simple_animal/pet/cat/space", "/mob/living/simple_animal/pet/cat", {
	name: "space cat",
	desc: "It's a cat... in space!",
	icon_state: "spacecat",
	icon_living: "spacecat",
	icon_dead: "spacecat_dead",
	unsuitable_atmos_damage: 0,
	minbodytemp: 2.7,
	maxbodytemp: 313.15,
});
rt.type(5059, "/mob/living/simple_animal/pet/cat/original", "/mob/living/simple_animal/pet/cat", {
	name: "Batsy",
	desc: "The product of alien DNA and bored geneticists.",
	gender: "female",
	icon_state: "original",
	icon_living: "original",
	icon_dead: "original_dead",
});
rt.type(5060, "/mob/living/simple_animal/pet/cat/kitten", "/mob/living/simple_animal/pet/cat", {
	pass_flags: 16,
	name: "kitten",
	desc: "D'aaawwww.",
	icon_state: "kitten",
	icon_living: "kitten",
	icon_dead: "kitten_dead",
	density: 0,
	mob_size: 1,
});
rt.type(5062, "/mob/living/simple_animal/pet/cat/Proc", "/mob/living/simple_animal/pet/cat", {
	name: "Proc",
	gender: "male",
	gold_core_spawnable: 0,
});
rt.type(5065, "/mob/living/simple_animal/pet/fox/Renault", "/mob/living/simple_animal/pet/fox", {
	name: "Renault",
	desc: "Renault, the Captain's trustworthy fox.",
	gender: "female",
	gold_core_spawnable: 0,
});
rt.type(5068, "/mob/living/simple_animal/pet/penguin/baby", "/mob/living/simple_animal/pet/penguin", {
	pass_flags: 16,
	speak: null,
	name: "Penguin chick",
	real_name: "penguin",
	desc: "Can't fly and can barely waddles, but the prince of all chicks.",
	icon_state: "penguin_baby",
	icon_living: "penguin_baby",
	icon_dead: "penguin_baby_dead",
	density: 0,
	mob_size: 1,
});
rt.type(5081, "/mob/living/simple_animal/crab/Coffee", "/mob/living/simple_animal/crab", {
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "stomps",
	gold_core_spawnable: 0,
	name: "Coffee",
	real_name: "Coffee",
	desc: "It's Coffee, the other pet!",
	gender: "female",
});
rt.type(5086, "/mob/living/simple_animal/mouse/white", "/mob/living/simple_animal/mouse", {
	body_color: "white",
	icon_state: "mouse_white",
});
rt.type(5087, "/mob/living/simple_animal/mouse/gray", "/mob/living/simple_animal/mouse", {
	body_color: "gray",
	icon_state: "mouse_gray",
});
rt.type(5088, "/mob/living/simple_animal/mouse/brown", "/mob/living/simple_animal/mouse", {
	body_color: "brown",
	icon_state: "mouse_brown",
});
rt.type(5089, "/mob/living/simple_animal/mouse/brown/Tom", "/mob/living/simple_animal/mouse/brown", {
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "splats",
	gold_core_spawnable: 0,
	name: "Tom",
	desc: "Jerry the cat is not amused.",
});
rt.type(5091, "/mob/living/simple_animal/sloth/paperwork", "/mob/living/simple_animal/sloth", {
	gold_core_spawnable: 0,
	name: "Paperwork",
	desc: "Cargo's pet sloth. About as useful as the rest of the techs.",
});
