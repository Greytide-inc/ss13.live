// From code/modules/food_and_drinks/food/snacks_vend.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6187, "/obj/item/weapon/reagent_containers/food/snacks/candy", "/obj/item/weapon/reagent_containers/food/snacks", {
	junkiness: 25,
	filling_color: "#D2691E",
	tastes: null,
	name: "candy",
	desc: "Nougat love it or hate it.",
	icon_state: "candy",
	trash: rt.typePath("/obj/item/trash/candy"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/candy/proc/<init>  (code/modules/food_and_drinks/food/snacks_vend.dm:13)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/candy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["candy", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1, "sugar", 3]));
	return f.dot;
});

rt.type(6188, "/obj/item/weapon/reagent_containers/food/snacks/sosjerky", "/obj/item/weapon/reagent_containers/food/snacks", {
	junkiness: 25,
	filling_color: "#8B0000",
	tastes: null,
	name: "１Scaredy's Private Reserve Beef Jerky",
	icon_state: "sosjerky",
	desc: "Beef jerky made from the finest space cows.",
	trash: rt.typePath("/obj/item/trash/sosjerky"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/sosjerky/proc/<init>  (code/modules/food_and_drinks/food/snacks_vend.dm:23)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/sosjerky/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["dried meat", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1, "sugar", 3]));
	return f.dot;
});

rt.type(6189, "/obj/item/weapon/reagent_containers/food/snacks/sosjerky/healthy", "/obj/item/weapon/reagent_containers/food/snacks/sosjerky", {
	junkiness: 0,
	name: "homemade beef jerky",
	desc: "Homemade beef jerky made from the finest space cows.",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/sosjerky/healthy/proc/<init>  (code/modules/food_and_drinks/food/snacks_vend.dm:28)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/sosjerky/healthy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 1]));
	return f.dot;
});

rt.type(6190, "/obj/item/weapon/reagent_containers/food/snacks/chips", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 1,
	junkiness: 20,
	filling_color: "#FFD700",
	tastes: null,
	name: "chips",
	desc: "Commander Riker's What-The-Crisps",
	icon_state: "chips",
	trash: rt.typePath("/obj/item/trash/chips"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/chips/proc/<init>  (code/modules/food_and_drinks/food/snacks_vend.dm:40)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/chips/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["salt", 1, "crisps", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1, "sugar", 3]));
	return f.dot;
});

rt.type(6191, "/obj/item/weapon/reagent_containers/food/snacks/no_raisin", "/obj/item/weapon/reagent_containers/food/snacks", {
	junkiness: 25,
	filling_color: "#8B0000",
	tastes: null,
	name: "4no raisins",
	icon_state: "4no_raisins",
	desc: "Best raisins in the universe. Not sure why.",
	trash: rt.typePath("/obj/item/trash/raisins"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/no_raisin/proc/<init>  (code/modules/food_and_drinks/food/snacks_vend.dm:50)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/no_raisin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["dried raisins", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2, "sugar", 4]));
	return f.dot;
});

rt.type(6192, "/obj/item/weapon/reagent_containers/food/snacks/no_raisin/healthy", "/obj/item/weapon/reagent_containers/food/snacks/no_raisin", {
	junkiness: 0,
	name: "homemade raisins",
	desc: "homemade raisins, the best in all of spess.",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/no_raisin/healthy/proc/<init>  (code/modules/food_and_drinks/food/snacks_vend.dm:55)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/no_raisin/healthy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 2]));
	return f.dot;
});

rt.type(6193, "/obj/item/weapon/reagent_containers/food/snacks/spacetwinkie", "/obj/item/weapon/reagent_containers/food/snacks", {
	junkiness: 25,
	filling_color: "#FFD700",
	name: "space twinkie",
	icon_state: "space_twinkie",
	desc: "Guaranteed to survive longer than you will.",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/spacetwinkie/proc/<init>  (code/modules/food_and_drinks/food/snacks_vend.dm:62)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/spacetwinkie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sugar", 4]));
	return f.dot;
});

rt.type(6194, "/obj/item/weapon/reagent_containers/food/snacks/cheesiehonkers", "/obj/item/weapon/reagent_containers/food/snacks", {
	junkiness: 25,
	filling_color: "#FFD700",
	tastes: null,
	name: "cheesie honkers",
	desc: "Bite sized cheesie snacks that will honk all over your mouth.",
	icon_state: "cheesie_honkers",
	trash: rt.typePath("/obj/item/trash/cheesie"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cheesiehonkers/proc/<init>  (code/modules/food_and_drinks/food/snacks_vend.dm:74)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cheesiehonkers/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cheese", 5, "crisps", 2]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1, "sugar", 3]));
	return f.dot;
});

rt.type(6195, "/obj/item/weapon/reagent_containers/food/snacks/syndicake", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#F5F5DC",
	tastes: null,
	name: "syndi-cakes",
	icon_state: "syndi_cakes",
	desc: "An extremely moist snack cake that tastes just as good after being nuked.",
	trash: rt.typePath("/obj/item/trash/syndi_cakes"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/syndicake/proc/<init>  (code/modules/food_and_drinks/food/snacks_vend.dm:83)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/syndicake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["sweetness", 3, "cake", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "doctorsdelight", 5]));
	return f.dot;
});
