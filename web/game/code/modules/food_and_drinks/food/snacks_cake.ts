// From code/modules/food_and_drinks/food/snacks_cake.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5896, "/obj/item/weapon/reagent_containers/food/snacks/store/cake", "/obj/item/weapon/reagent_containers/food/snacks/store", {
	slices_num: 5,
	bitesize: 3,
	tastes: null,
	icon: rt.rsc("icons/obj/food/piecake.dmi"),
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/plain"),
	volume: 80,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:8)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 20, "vitamin", 5]));
	return f.dot;
});

rt.type(5956, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", "/obj/item/weapon/reagent_containers/food/snacks", {
	customfoodfilling: 0,
	tastes: null,
	icon: rt.rsc("icons/obj/food/piecake.dmi"),
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cakeslice/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:15)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 1]));
	return f.dot;
});

rt.type(5897, "/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain", "/obj/item/weapon/reagent_containers/food/snacks/store/cake", {
	custom_food_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/customizable/cake"),
	bonus_reagents: null,
	tastes: null,
	name: "vanilla cake",
	desc: "A plain cake, not a lie.",
	icon_state: "plaincake",
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/plain/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:22)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 10, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["vanilla", 1, "sweetness", 2, "cake", 5]));
	return f.dot;
});

rt.type(5957, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/plain", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#FFD700",
	customfoodfilling: 1,
	tastes: null,
	name: "vanilla cake slice",
	desc: "Just a slice of cake, it is enough for everyone.",
	icon_state: "plaincake_slice",
});

// /obj/item/weapon/reagent_containers/food/snacks/cakeslice/plain/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:31)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/plain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["vanilla", 1, "sweetness", 2, "cake", 5]));
	return f.dot;
});

rt.type(5898, "/obj/item/weapon/reagent_containers/food/snacks/store/cake/carrot", "/obj/item/weapon/reagent_containers/food/snacks/store/cake", {
	slices_num: 5,
	bonus_reagents: null,
	tastes: null,
	name: "carrot cake",
	desc: "A favorite desert of a certain wascally wabbit. Not a lie.",
	icon_state: "carrotcake",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/carrot"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/carrot/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:39)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/carrot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 3, "oculine", 5, "vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 2, "carrot", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 20, "oculine", 10, "vitamin", 5]));
	return f.dot;
});

rt.type(5958, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/carrot", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#FFA500",
	tastes: null,
	name: "carrot cake slice",
	desc: "Carrotty slice of Carrot Cake, carrots are good for your eyes! Also not a lie.",
	icon_state: "carrotcake_slice",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cakeslice/carrot/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:49)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/carrot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 2, "carrot", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "oculine", 2, "vitamin", 1]));
	return f.dot;
});

rt.type(5899, "/obj/item/weapon/reagent_containers/food/snacks/store/cake/brain", "/obj/item/weapon/reagent_containers/food/snacks/store/cake", {
	slices_num: 5,
	bonus_reagents: null,
	tastes: null,
	name: "brain cake",
	desc: "A squishy cake-thing.",
	icon_state: "braincake",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/brain"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/brain/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:58)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/brain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "mannitol", 10, "vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 2, "brains", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 20, "mannitol", 10, "vitamin", 5]));
	return f.dot;
});

rt.type(5959, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/brain", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#FF69B4",
	tastes: null,
	name: "brain cake slice",
	desc: "Lemme tell you something about prions. THEY'RE DELICIOUS.",
	icon_state: "braincakeslice",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cakeslice/brain/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:69)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/brain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 2, "brains", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "mannitol", 2, "vitamin", 1]));
	return f.dot;
});

rt.type(5900, "/obj/item/weapon/reagent_containers/food/snacks/store/cake/cheese", "/obj/item/weapon/reagent_containers/food/snacks/store/cake", {
	slices_num: 5,
	bonus_reagents: null,
	tastes: null,
	name: "cheese cake",
	desc: "DANGEROUSLY cheesy.",
	icon_state: "cheesecake",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/cheese"),
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/cheese/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:77)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/cheese/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 4, "cream cheese", 3]));
	return f.dot;
});

rt.type(5960, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/cheese", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#FFFACD",
	tastes: null,
	name: "cheese cake slice",
	desc: "Slice of pure cheestisfaction.",
	icon_state: "cheesecake_slice",
});

// /obj/item/weapon/reagent_containers/food/snacks/cakeslice/cheese/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:86)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/cheese/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 4, "cream cheese", 3]));
	return f.dot;
});

rt.type(5901, "/obj/item/weapon/reagent_containers/food/snacks/store/cake/orange", "/obj/item/weapon/reagent_containers/food/snacks/store/cake", {
	slices_num: 5,
	bonus_reagents: null,
	tastes: null,
	name: "orange cake",
	desc: "A cake with added orange.",
	icon_state: "orangecake",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/orange"),
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/orange/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:95)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/orange/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 2, "oranges", 2]));
	return f.dot;
});

rt.type(5961, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/orange", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#FFA500",
	tastes: null,
	name: "orange cake slice",
	desc: "Just a slice of cake, it is enough for everyone.",
	icon_state: "orangecake_slice",
});

// /obj/item/weapon/reagent_containers/food/snacks/cakeslice/orange/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:103)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/orange/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 2, "oranges", 2]));
	return f.dot;
});

rt.type(5902, "/obj/item/weapon/reagent_containers/food/snacks/store/cake/lime", "/obj/item/weapon/reagent_containers/food/snacks/store/cake", {
	slices_num: 5,
	bonus_reagents: null,
	tastes: null,
	name: "lime cake",
	desc: "A cake with added lime.",
	icon_state: "limecake",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/lime"),
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/lime/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:111)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/lime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 2, "unbearable sourness", 2]));
	return f.dot;
});

rt.type(5962, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/lime", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#00FF00",
	tastes: null,
	name: "lime cake slice",
	desc: "Just a slice of cake, it is enough for everyone.",
	icon_state: "limecake_slice",
});

// /obj/item/weapon/reagent_containers/food/snacks/cakeslice/lime/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:119)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/lime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 2, "unbearable sourness", 2]));
	return f.dot;
});

rt.type(5903, "/obj/item/weapon/reagent_containers/food/snacks/store/cake/lemon", "/obj/item/weapon/reagent_containers/food/snacks/store/cake", {
	slices_num: 5,
	bonus_reagents: null,
	tastes: null,
	name: "lemon cake",
	desc: "A cake with added lemon.",
	icon_state: "lemoncake",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/lemon"),
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/lemon/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:128)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/lemon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 2, "sourness", 2]));
	return f.dot;
});

rt.type(5963, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/lemon", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#FFEE00",
	tastes: null,
	name: "lemon cake slice",
	desc: "Just a slice of cake, it is enough for everyone.",
	icon_state: "lemoncake_slice",
});

// /obj/item/weapon/reagent_containers/food/snacks/cakeslice/lemon/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:137)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/lemon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 2, "sourness", 2]));
	return f.dot;
});

rt.type(5904, "/obj/item/weapon/reagent_containers/food/snacks/store/cake/chocolate", "/obj/item/weapon/reagent_containers/food/snacks/store/cake", {
	slices_num: 5,
	bonus_reagents: null,
	tastes: null,
	name: "chocolate cake",
	desc: "A cake with added chocolate.",
	icon_state: "chocolatecake",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/chocolate"),
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/chocolate/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:146)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/chocolate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 1, "chocolate", 4]));
	return f.dot;
});

rt.type(5964, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/chocolate", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#A0522D",
	tastes: null,
	name: "chocolate cake slice",
	desc: "Just a slice of cake, it is enough for everyone.",
	icon_state: "chocolatecake_slice",
});

// /obj/item/weapon/reagent_containers/food/snacks/cakeslice/chocolate/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:155)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/chocolate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 1, "chocolate", 4]));
	return f.dot;
});

rt.type(5905, "/obj/item/weapon/reagent_containers/food/snacks/store/cake/birthday", "/obj/item/weapon/reagent_containers/food/snacks/store/cake", {
	slices_num: 5,
	bonus_reagents: null,
	tastes: null,
	name: "birthday cake",
	desc: "Happy Birthday little clown...",
	icon_state: "birthdaycake",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/birthday"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/birthday/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:164)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/birthday/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 7, "sprinkles", 10, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 20, "sprinkles", 10, "vitamin", 5]));
	return f.dot;
});

rt.type(5965, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/birthday", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#DC143C",
	tastes: null,
	name: "birthday cake slice",
	desc: "A slice of your birthday.",
	icon_state: "birthdaycakeslice",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cakeslice/birthday/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:174)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/birthday/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "sprinkles", 2, "vitamin", 1]));
	return f.dot;
});

rt.type(5906, "/obj/item/weapon/reagent_containers/food/snacks/store/cake/apple", "/obj/item/weapon/reagent_containers/food/snacks/store/cake", {
	slices_num: 5,
	bonus_reagents: null,
	tastes: null,
	name: "apple cake",
	desc: "A cake centred with Apple.",
	icon_state: "applecake",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/apple"),
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/apple/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:183)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/apple/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 1, "apple", 1]));
	return f.dot;
});

rt.type(5966, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/apple", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#FF4500",
	tastes: null,
	name: "apple cake slice",
	desc: "A slice of heavenly cake.",
	icon_state: "applecakeslice",
});

// /obj/item/weapon/reagent_containers/food/snacks/cakeslice/apple/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:191)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/apple/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 1, "apple", 1]));
	return f.dot;
});

rt.type(5907, "/obj/item/weapon/reagent_containers/food/snacks/store/cake/slimecake", "/obj/item/weapon/reagent_containers/food/snacks/store/cake", {
	bonus_reagents: null,
	tastes: null,
	name: "Slime cake",
	desc: "A cake made of slimes. Probably not electrified.",
	icon_state: "slimecake",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/slimecake"),
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/slimecake/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:203)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/slimecake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 1, "slime", 1]));
	return f.dot;
});

rt.type(5968, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/slimecake", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#00FFFF",
	tastes: null,
	name: "slime cake slice",
	desc: "A slice of slime cake.",
	icon_state: "slimecake_slice",
});

// /obj/item/weapon/reagent_containers/food/snacks/cakeslice/slimecake/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:211)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/slimecake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 1, "slime", 1]));
	return f.dot;
});

rt.type(5908, "/obj/item/weapon/reagent_containers/food/snacks/store/cake/pumpkinspice", "/obj/item/weapon/reagent_containers/food/snacks/store/cake", {
	bonus_reagents: null,
	tastes: null,
	name: "pumpkin spice cake",
	desc: "A hollow cake with real pumpkin.",
	icon_state: "pumpkinspicecake",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/pumpkinspice"),
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/pumpkinspice/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:218)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/pumpkinspice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 1, "pumpkin", 1]));
	return f.dot;
});

rt.type(5969, "/obj/item/weapon/reagent_containers/food/snacks/cakeslice/pumpkinspice", "/obj/item/weapon/reagent_containers/food/snacks/cakeslice", {
	filling_color: "#FFD700",
	tastes: null,
	name: "pumpkin spice cake slice",
	desc: "A spicy slice of pumpkin goodness.",
	icon_state: "pumpkinspicecakeslice",
});

// /obj/item/weapon/reagent_containers/food/snacks/cakeslice/pumpkinspice/proc/<init>  (code/modules/food_and_drinks/food/snacks_cake.dm:226)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/pumpkinspice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 5, "sweetness", 1, "pumpkin", 1]));
	return f.dot;
});
