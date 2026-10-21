// Types declared in code/modules/food_and_drinks/food that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(5872, "/obj/item/weapon/reagent_containers/food/snacks/sugarcookie/spookyskull", "/obj/item/weapon/reagent_containers/food/snacks/sugarcookie", {
	name: "skull cookie",
	desc: "Spooky! It's got delicious calcium flavouring!",
	icon: rt.rsc("icons/obj/halloween_items.dmi"),
	icon_state: "skeletoncookie",
});
rt.type(5873, "/obj/item/weapon/reagent_containers/food/snacks/sugarcookie/spookycoffin", "/obj/item/weapon/reagent_containers/food/snacks/sugarcookie", {
	name: "coffin cookie",
	desc: "Spooky! It's got delicious coffee flavouring!",
	icon: rt.rsc("icons/obj/halloween_items.dmi"),
	icon_state: "coffincookie",
});
rt.type(5876, "/obj/item/weapon/reagent_containers/food/snacks/customizable/burger", "/obj/item/weapon/reagent_containers/food/snacks/customizable", {
	ingredients_placement: 4,
	name: "burger",
	desc: "A timeless classic.",
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "bun",
});
rt.type(5877, "/obj/item/weapon/reagent_containers/food/snacks/customizable/bread", "/obj/item/weapon/reagent_containers/food/snacks/customizable", {
	ingMax: 6,
	name: "bread",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/breadslice/custom"),
	slices_num: 5,
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "tofubread",
});
rt.type(5878, "/obj/item/weapon/reagent_containers/food/snacks/customizable/cake", "/obj/item/weapon/reagent_containers/food/snacks/customizable", {
	ingMax: 6,
	name: "cake",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/custom"),
	slices_num: 5,
	icon: rt.rsc("icons/obj/food/piecake.dmi"),
	icon_state: "plaincake",
});
rt.type(5880, "/obj/item/weapon/reagent_containers/food/snacks/customizable/pasta", "/obj/item/weapon/reagent_containers/food/snacks/customizable", {
	ingredients_placement: 2,
	ingMax: 6,
	name: "spaghetti",
	desc: "Noodles. With stuff. Delicious.",
	icon: rt.rsc("icons/obj/food/pizzaspaghetti.dmi"),
	icon_state: "spaghettiboiled",
});
rt.type(5881, "/obj/item/weapon/reagent_containers/food/snacks/customizable/pie", "/obj/item/weapon/reagent_containers/food/snacks/customizable", {
	ingMax: 6,
	name: "pie",
	icon: rt.rsc("icons/obj/food/piecake.dmi"),
	icon_state: "pie",
});
rt.type(5882, "/obj/item/weapon/reagent_containers/food/snacks/customizable/pizza", "/obj/item/weapon/reagent_containers/food/snacks/customizable", {
	ingredients_placement: 2,
	ingMax: 8,
	name: "pizza",
	desc: "A personalized pan pizza meant for only one person.",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/custom"),
	slices_num: 6,
	icon: rt.rsc("icons/obj/food/pizzaspaghetti.dmi"),
	icon_state: "pizzamargherita",
});
rt.type(5883, "/obj/item/weapon/reagent_containers/food/snacks/customizable/salad", "/obj/item/weapon/reagent_containers/food/snacks/customizable", {
	ingMax: 6,
	name: "salad",
	desc: "Very tasty.",
	trash: rt.typePath("/obj/item/weapon/reagent_containers/glass/bowl"),
	icon: rt.rsc("icons/obj/food/soupsalad.dmi"),
	icon_state: "bowl",
});
rt.type(5912, "/obj/item/weapon/reagent_containers/food/snacks/breadslice/plain", "/obj/item/weapon/reagent_containers/food/snacks/breadslice", {
	customfoodfilling: 1,
	name: "bread slice",
	desc: "A slice of home.",
	icon_state: "breadslice",
});
rt.type(5913, "/obj/item/weapon/reagent_containers/food/snacks/breadslice/meat", "/obj/item/weapon/reagent_containers/food/snacks/breadslice", {
	name: "meatbread slice",
	desc: "A slice of delicious meatbread.",
	icon_state: "meatbreadslice",
});
rt.type(5920, "/obj/item/weapon/reagent_containers/food/snacks/breadslice/custom", "/obj/item/weapon/reagent_containers/food/snacks/breadslice", {
	filling_color: "#FFFFFF",
	name: "bread slice",
	icon_state: "tofubreadslice",
});
rt.type(5922, "/obj/item/weapon/reagent_containers/food/snacks/deepfryholder", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 2,
	name: "Deep Fried Foods Holder Obj",
	desc: "If you can see this description the code for the deep fryer fucked up.",
	icon: rt.rsc("icons/obj/food/food.dmi"),
	icon_state: "",
});
rt.type(5967, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/custom", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#FFFFFF",
	name: "cake slice",
	icon_state: "plaincake_slice",
});
rt.type(5970, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/brioche", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#FFD700",
	name: "brioche cake slice",
	desc: "Delicious sweet-bread. Who needs anything else?",
	icon_state: "briochecake_slice",
});
rt.type(5988, "/obj/item/weapon/reagent_containers/food/snacks/carpmeat/imitation", "/obj/item/weapon/reagent_containers/food/snacks/carpmeat", {
	name: "imitation carp fillet",
	desc: "Almost just like the real thing, kinda.",
});
rt.type(6064, "/obj/item/weapon/reagent_containers/food/snacks/donut/jelly/slimejelly", "/obj/item/weapon/reagent_containers/food/snacks/donut/jelly", {
	extra_reagent: "slimejelly",
	name: "jelly donut",
	desc: "You jelly?",
	icon_state: "jdonut1",
});
rt.type(6065, "/obj/item/weapon/reagent_containers/food/snacks/donut/jelly/cherryjelly", "/obj/item/weapon/reagent_containers/food/snacks/donut/jelly", {
	extra_reagent: "cherryjelly",
	name: "jelly donut",
	desc: "You jelly?",
	icon_state: "jdonut1",
});
rt.type(6128, "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/custom", "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice", {
	filling_color: "#FFFFFF",
	name: "pizza slice",
	icon_state: "pizzamargheritaslice",
});
rt.type(6205, "/obj/item/weapon/reagent_containers/food/snacks/meat", "/obj/item/weapon/reagent_containers/food/snacks", {
	subjectname: "",
	subjectjob: null,
});
rt.type(6254, "/obj/item/weapon/reagent_containers/food/snacks/hotcrossbun", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 2,
	name: "hot-cross bun",
	desc: "The Cross represents the Assistants that died for your sins.",
	icon_state: "hotcrossbun",
});
