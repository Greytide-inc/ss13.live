// From code/modules/food_and_drinks/food/snacks/dough.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6196, "/obj/item/weapon/reagent_containers/food/snacks/dough", "/obj/item/weapon/reagent_containers/food/snacks", {
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"),
	tastes: null,
	name: "dough",
	desc: "A piece of dough.",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "dough",
	list_reagents: null,
	w_class: 3,
});

// /obj/item/weapon/reagent_containers/food/snacks/dough/proc/<init>  (code/modules/food_and_drinks/food/snacks/dough.dm:13)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/dough/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["dough", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/dough/proc/attackby  (code/modules/food_and_drinks/food/snacks/dough.dm:18)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/dough/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/kitchen/rollingpin")) ? 1 : 0))) {
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
			yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/flatdough"), [rt.sv(f, "loc")]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You flatten ＀.</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need to put ＀ on a surface to roll it out!</span>", [live(f.src)])]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(6197, "/obj/item/weapon/reagent_containers/food/snacks/flatdough", "/obj/item/weapon/reagent_containers/food/snacks", {
	slices_num: 3,
	tastes: null,
	name: "flat dough",
	desc: "A flattened dough.",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "flat dough",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/doughslice"),
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizzabread"),
	list_reagents: null,
	w_class: 3,
});

// /obj/item/weapon/reagent_containers/food/snacks/flatdough/proc/<init>  (code/modules/food_and_drinks/food/snacks/dough.dm:40)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/flatdough/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["dough", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6]));
	return f.dot;
});

rt.type(6198, "/obj/item/weapon/reagent_containers/food/snacks/pizzabread", "/obj/item/weapon/reagent_containers/food/snacks", {
	custom_food_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/customizable/pizza"),
	tastes: null,
	name: "pizza bread",
	desc: "Add ingredients to make a pizza",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "pizzabread",
	list_reagents: null,
	w_class: 3,
});

// /obj/item/weapon/reagent_containers/food/snacks/pizzabread/proc/<init>  (code/modules/food_and_drinks/food/snacks/dough.dm:50)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizzabread/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["bread", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 7]));
	return f.dot;
});

rt.type(6199, "/obj/item/weapon/reagent_containers/food/snacks/doughslice", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#CD853F",
	tastes: null,
	name: "dough slice",
	desc: "A slice of dough. Can be cooked into a bun.",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "doughslice",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/bun"),
});

// /obj/item/weapon/reagent_containers/food/snacks/doughslice/proc/<init>  (code/modules/food_and_drinks/food/snacks/dough.dm:60)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/doughslice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["dough", 1]));
	return f.dot;
});

rt.type(6200, "/obj/item/weapon/reagent_containers/food/snacks/bun", "/obj/item/weapon/reagent_containers/food/snacks", {
	custom_food_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/customizable/burger"),
	filling_color: "#CD853F",
	tastes: null,
	name: "bun",
	desc: "A base for any self-respecting burger.",
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "bun",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/bun/proc/<init>  (code/modules/food_and_drinks/food/snacks/dough.dm:71)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/bun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1]));
	return f.dot;
});

rt.type(6201, "/obj/item/weapon/reagent_containers/food/snacks/cakebatter", "/obj/item/weapon/reagent_containers/food/snacks", {
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"),
	tastes: null,
	name: "cake batter",
	desc: "Cook it to get a cake.",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "cakebatter",
	list_reagents: null,
	w_class: 3,
});

// /obj/item/weapon/reagent_containers/food/snacks/cakebatter/proc/<init>  (code/modules/food_and_drinks/food/snacks/dough.dm:81)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakebatter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["batter", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 9]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/cakebatter/proc/attackby  (code/modules/food_and_drinks/food/snacks/dough.dm:85)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakebatter/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/kitchen/rollingpin")) ? 1 : 0))) {
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
			yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/piedough"), [rt.sv(f, "loc")]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You flatten ＀.</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need to put ＀ on a surface to roll it out!</span>", [live(f.src)])]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(6202, "/obj/item/weapon/reagent_containers/food/snacks/piedough", "/obj/item/weapon/reagent_containers/food/snacks", {
	slices_num: 3,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"),
	tastes: null,
	name: "pie dough",
	desc: "Cook it to get a pie.",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "piedough",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/rawpastrybase"),
	list_reagents: null,
	w_class: 3,
});

// /obj/item/weapon/reagent_containers/food/snacks/piedough/proc/<init>  (code/modules/food_and_drinks/food/snacks/dough.dm:105)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/piedough/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["dough", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 9]));
	return f.dot;
});

rt.type(6203, "/obj/item/weapon/reagent_containers/food/snacks/rawpastrybase", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#CD853F",
	tastes: null,
	name: "raw pastry base",
	desc: "Must be cooked before use.",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "rawpastrybase",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/rawpastrybase/proc/<init>  (code/modules/food_and_drinks/food/snacks/dough.dm:115)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/rawpastrybase/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["raw pastry", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1]));
	return f.dot;
});

rt.type(6204, "/obj/item/weapon/reagent_containers/food/snacks/pastrybase", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#CD853F",
	tastes: null,
	name: "pastry base",
	desc: "A base for any self-respecting pastry",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "pastrybase",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/pastrybase/proc/<init>  (code/modules/food_and_drinks/food/snacks/dough.dm:124)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pastrybase/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["pastry", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1]));
	return f.dot;
});
