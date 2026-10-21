// From code/modules/food_and_drinks/food/snacks_bread.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5887, "/obj/item/weapon/reagent_containers/food/snacks/store/bread", "/obj/item/weapon/reagent_containers/food/snacks/store", {
	slices_num: 5,
	tastes: null,
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	volume: 80,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/bread/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:6)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/bread/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["bread", 10]));
	return f.dot;
});

rt.type(5911, "/obj/item/weapon/reagent_containers/food/snacks/breadslice", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 2,
	custom_food_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/customizable/sandwich"),
	filling_color: "#FFA500",
	customfoodfilling: 0,
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	list_reagents: null,
	slot_flags: 64,
});

// /obj/item/weapon/reagent_containers/food/snacks/breadslice/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:14)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/breadslice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2]));
	return f.dot;
});

rt.type(5888, "/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain", "/obj/item/weapon/reagent_containers/food/snacks/store/bread", {
	bonus_reagents: null,
	custom_food_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/customizable/bread"),
	tastes: null,
	name: "bread",
	desc: "Some plain old Earthen bread.",
	icon_state: "bread",
	list_reagents: null,
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/breadslice/plain"),
});

// /obj/item/weapon/reagent_containers/food/snacks/store/bread/plain/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:22)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 7]));
	rt.setSv(f, "tastes", rt.alist(f, ["bread", 10]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 10]));
	return f.dot;
});

rt.type(5889, "/obj/item/weapon/reagent_containers/food/snacks/store/bread/meat", "/obj/item/weapon/reagent_containers/food/snacks/store/bread", {
	bonus_reagents: null,
	tastes: null,
	name: "meatbread loaf",
	desc: "The culinary base of every self-respecting eloquen/tg/entleman.",
	icon_state: "meatbread",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/breadslice/meat"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/bread/meat/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:39)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/bread/meat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["bread", 10, "meat", 10]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 30, "vitamin", 5]));
	return f.dot;
});

rt.type(5890, "/obj/item/weapon/reagent_containers/food/snacks/store/bread/xenomeat", "/obj/item/weapon/reagent_containers/food/snacks/store/bread", {
	bonus_reagents: null,
	tastes: null,
	name: "xenomeatbread loaf",
	desc: "The culinary base of every self-respecting eloquen/tg/entleman. Extra Heretical.",
	icon_state: "xenomeatbread",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/breadslice/xenomeat"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/bread/xenomeat/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:53)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/bread/xenomeat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["bread", 10, "acid", 10]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 30, "vitamin", 5]));
	return f.dot;
});

rt.type(5914, "/obj/item/weapon/reagent_containers/food/snacks/breadslice/xenomeat", "/obj/item/weapon/reagent_containers/food/snacks/breadslice", {
	filling_color: "#32CD32",
	name: "xenomeatbread slice",
	desc: "A slice of delicious meatbread. Extra Heretical.",
	icon_state: "xenobreadslice",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/breadslice/xenomeat/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:62)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/breadslice/xenomeat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 1]));
	return f.dot;
});

rt.type(5891, "/obj/item/weapon/reagent_containers/food/snacks/store/bread/spidermeat", "/obj/item/weapon/reagent_containers/food/snacks/store/bread", {
	bonus_reagents: null,
	tastes: null,
	name: "spider meat loaf",
	desc: "Reassuringly green meatloaf made from spider meat.",
	icon_state: "spidermeatbread",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/breadslice/spidermeat"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/bread/spidermeat/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:69)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/bread/spidermeat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["bread", 10, "cobwebs", 5]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 30, "toxin", 15, "vitamin", 5]));
	return f.dot;
});

rt.type(5915, "/obj/item/weapon/reagent_containers/food/snacks/breadslice/spidermeat", "/obj/item/weapon/reagent_containers/food/snacks/breadslice", {
	filling_color: "#7CFC00",
	name: "spider meat bread slice",
	desc: "A slice of meatloaf made from an animal that most likely still wants you dead.",
	icon_state: "xenobreadslice",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/breadslice/spidermeat/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:78)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/breadslice/spidermeat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "toxin", 3, "vitamin", 1]));
	return f.dot;
});

rt.type(5892, "/obj/item/weapon/reagent_containers/food/snacks/store/bread/banana", "/obj/item/weapon/reagent_containers/food/snacks/store/bread", {
	bonus_reagents: null,
	tastes: null,
	name: "banana-nut bread",
	desc: "A heavenly and filling treat.",
	icon_state: "bananabread",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/breadslice/banana"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/bread/banana/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:85)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/bread/banana/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "banana", 20]));
	rt.setSv(f, "tastes", rt.alist(f, ["bread", 10]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 20, "banana", 20]));
	return f.dot;
});

rt.type(5916, "/obj/item/weapon/reagent_containers/food/snacks/breadslice/banana", "/obj/item/weapon/reagent_containers/food/snacks/breadslice", {
	filling_color: "#FFD700",
	name: "banana-nut bread slice",
	desc: "A slice of delicious banana bread.",
	icon_state: "bananabreadslice",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/breadslice/banana/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:95)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/breadslice/banana/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "banana", 4]));
	return f.dot;
});

rt.type(5893, "/obj/item/weapon/reagent_containers/food/snacks/store/bread/tofu", "/obj/item/weapon/reagent_containers/food/snacks/store/bread", {
	bonus_reagents: null,
	tastes: null,
	name: "Tofubread",
	desc: "Like meatbread but for vegetarians. Not guaranteed to give superpowers.",
	icon_state: "tofubread",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/breadslice/tofu"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/bread/tofu/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:102)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/bread/tofu/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["bread", 10, "tofu", 10]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 20, "vitamin", 5]));
	return f.dot;
});

rt.type(5917, "/obj/item/weapon/reagent_containers/food/snacks/breadslice/tofu", "/obj/item/weapon/reagent_containers/food/snacks/breadslice", {
	filling_color: "#FF8C00",
	name: "tofubread slice",
	desc: "A slice of delicious tofubread.",
	icon_state: "tofubreadslice",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/breadslice/tofu/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:111)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/breadslice/tofu/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 1]));
	return f.dot;
});

rt.type(5894, "/obj/item/weapon/reagent_containers/food/snacks/store/bread/creamcheese", "/obj/item/weapon/reagent_containers/food/snacks/store/bread", {
	bonus_reagents: null,
	tastes: null,
	name: "cream cheese bread",
	desc: "Yum yum yum!",
	icon_state: "creamcheesebread",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/breadslice/creamcheese"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/bread/creamcheese/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:118)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/bread/creamcheese/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["bread", 10, "cheese", 10]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 20, "vitamin", 5]));
	return f.dot;
});

rt.type(5918, "/obj/item/weapon/reagent_containers/food/snacks/breadslice/creamcheese", "/obj/item/weapon/reagent_containers/food/snacks/breadslice", {
	filling_color: "#FF8C00",
	name: "cream cheese bread slice",
	desc: "A slice of yum!",
	icon_state: "creamcheesebreadslice",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/breadslice/creamcheese/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:127)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/breadslice/creamcheese/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 1]));
	return f.dot;
});

rt.type(5895, "/obj/item/weapon/reagent_containers/food/snacks/store/bread/mimana", "/obj/item/weapon/reagent_containers/food/snacks/store/bread", {
	bonus_reagents: null,
	tastes: null,
	name: "mimana bread",
	desc: "Best eaten in silence.",
	icon_state: "mimanabread",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/breadslice/mimana"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/bread/mimana/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:134)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/bread/mimana/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["bread", 10, "silence", 10]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 20, "mutetoxin", 5, "nothing", 5, "vitamin", 5]));
	return f.dot;
});

rt.type(5919, "/obj/item/weapon/reagent_containers/food/snacks/breadslice/mimana", "/obj/item/weapon/reagent_containers/food/snacks/breadslice", {
	filling_color: "#C0C0C0",
	name: "mimana bread slice",
	desc: "A slice of silence!",
	icon_state: "mimanabreadslice",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/breadslice/mimana/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:143)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/breadslice/mimana/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2, "mutetoxin", 1, "nothing", 1, "vitamin", 1]));
	return f.dot;
});

rt.type(5921, "/obj/item/weapon/reagent_containers/food/snacks/baguette", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	bitesize: 3,
	tastes: null,
	name: "baguette",
	desc: "Bon appetit!",
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "baguette",
	list_reagents: null,
	w_class: 3,
});

// /obj/item/weapon/reagent_containers/food/snacks/baguette/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:155)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/baguette/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["bread", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 1]));
	return f.dot;
});

rt.type(5923, "/obj/item/weapon/reagent_containers/food/snacks/butteredtoast", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 3,
	filling_color: "#FFA500",
	bonus_reagents: null,
	tastes: null,
	name: "buttered toast",
	desc: "Butter lightly spread over a piece of toast.",
	icon: rt.rsc("icons/obj/food/food.dmi"),
	icon_state: "butteredtoast",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/butteredtoast/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:176)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/butteredtoast/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["butter", 1, "toast", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4]));
	return f.dot;
});

rt.type(5924, "/obj/item/weapon/reagent_containers/food/snacks/butterbiscuit", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#F0E68C",
	bonus_reagents: null,
	tastes: null,
	name: "butter biscuit",
	desc: "Well butter my biscuit!",
	icon: rt.rsc("icons/obj/food/food.dmi"),
	icon_state: "butterbiscuit",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/butterbiscuit/proc/<init>  (code/modules/food_and_drinks/food/snacks_bread.dm:186)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/butterbiscuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["butter", 1, "biscuit", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5]));
	return f.dot;
});
