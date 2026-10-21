// From code/modules/food_and_drinks/food/snacks_egg.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5971, "/obj/item/weapon/reagent_containers/food/snacks/chocolateegg", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#A0522D",
	tastes: null,
	name: "chocolate egg",
	desc: "Such, sweet, fattening food.",
	icon_state: "chocolateegg",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/chocolateegg/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:8)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/chocolateegg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["chocolate", 4, "sweetness", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "sugar", 2, "cocoa", 2]));
	return f.dot;
});

rt.type(5972, "/obj/item/weapon/reagent_containers/food/snacks/egg", "/obj/item/weapon/reagent_containers/food/snacks", {
	containsPrize: 0,
	amount_grown: 0,
	filling_color: "#F0E68C",
	tastes: null,
	name: "egg",
	desc: "An egg!",
	icon_state: "egg",
	list_reagents: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"),
});

// /obj/item/weapon/reagent_containers/food/snacks/egg/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:20)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/egg/proc/throw_impact  (code/modules/food_and_drinks/food/snacks_egg.dm:23)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/proc/throw_impact", function* throw_impact(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.new_(f, T("/obj/effect/decal/cleanable/egg_smudge"), [(_T = rt.getStep(f, live(f.args[0]), 0))]);
	yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(f.args[0]), 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

// /obj/item/weapon/reagent_containers/food/snacks/egg/proc/attackby  (code/modules/food_and_drinks/food/snacks_egg.dm:30)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null, clr: Value = null;
	f.vars = () => [C, clr];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/crayon")) ? 1 : 0))) {
		C = live(f.args[0]);
		if (!truthy((rt.isIn(f, (clr = rt.fv(f, "item_color", live(C))), rt.list("blue", "green", "mime", "orange", "purple", "rainbow", "red", "yellow")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>＀ refuses to take on this colour!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You colour ＀ ＀.</span>", [live(f.src), live(clr)])]);
		rt.setSv(f, "icon_state", fmt("egg-＀", [live(clr)]));
		rt.setSv(f, "item_color", live(clr));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(5973, "/obj/item/weapon/reagent_containers/food/snacks/egg/blue", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-blue",
	item_color: "blue",
});

// /obj/item/weapon/reagent_containers/food/snacks/egg/blue/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:47)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/blue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 4, "the back of class", 1]));
	return f.dot;
});

rt.type(5974, "/obj/item/weapon/reagent_containers/food/snacks/egg/green", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-green",
	item_color: "green",
});

// /obj/item/weapon/reagent_containers/food/snacks/egg/green/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:52)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/green/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 4, "the back of class", 1]));
	return f.dot;
});

rt.type(5975, "/obj/item/weapon/reagent_containers/food/snacks/egg/mime", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-mime",
	item_color: "mime",
});

// /obj/item/weapon/reagent_containers/food/snacks/egg/mime/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:57)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/mime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 4, "the back of class", 1]));
	return f.dot;
});

rt.type(5976, "/obj/item/weapon/reagent_containers/food/snacks/egg/orange", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-orange",
	item_color: "orange",
});

// /obj/item/weapon/reagent_containers/food/snacks/egg/orange/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:62)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/orange/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 4, "the back of class", 1]));
	return f.dot;
});

rt.type(5977, "/obj/item/weapon/reagent_containers/food/snacks/egg/purple", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-purple",
	item_color: "purple",
});

// /obj/item/weapon/reagent_containers/food/snacks/egg/purple/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:67)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/purple/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 4, "the back of class", 1]));
	return f.dot;
});

rt.type(5978, "/obj/item/weapon/reagent_containers/food/snacks/egg/rainbow", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-rainbow",
	item_color: "rainbow",
});

// /obj/item/weapon/reagent_containers/food/snacks/egg/rainbow/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:72)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/rainbow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 4, "the back of class", 1]));
	return f.dot;
});

rt.type(5979, "/obj/item/weapon/reagent_containers/food/snacks/egg/red", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-red",
	item_color: "red",
});

// /obj/item/weapon/reagent_containers/food/snacks/egg/red/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:77)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/red/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 4, "the back of class", 1]));
	return f.dot;
});

rt.type(5980, "/obj/item/weapon/reagent_containers/food/snacks/egg/yellow", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-yellow",
	item_color: "yellow",
});

// /obj/item/weapon/reagent_containers/food/snacks/egg/yellow/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:82)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/yellow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 4, "the back of class", 1]));
	return f.dot;
});

rt.type(5982, "/obj/item/weapon/reagent_containers/food/snacks/friedegg", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	bitesize: 1,
	filling_color: "#FFFFF0",
	tastes: null,
	name: "fried egg",
	desc: "A fried egg, with a touch of salt and pepper.",
	icon_state: "friedegg",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/friedegg/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:88)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/friedegg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 4, "salt", 1, "pepper", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3]));
	return f.dot;
});

rt.type(5983, "/obj/item/weapon/reagent_containers/food/snacks/boiledegg", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FFFFF0",
	tastes: null,
	name: "boiled egg",
	desc: "A hard boiled egg.",
	icon_state: "egg",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/boiledegg/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:98)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/boiledegg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 1]));
	return f.dot;
});

rt.type(5984, "/obj/item/weapon/reagent_containers/food/snacks/omelette", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	bitesize: 1,
	tastes: null,
	name: "omelette du fromage",
	desc: "That's all you can say!",
	icon_state: "omelette",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
	w_class: 3,
});

// /obj/item/weapon/reagent_containers/food/snacks/omelette/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:108)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/omelette/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 1, "cheese", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 8, "vitamin", 1]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/omelette/proc/attackby  (code/modules/food_and_drinks/food/snacks_egg.dm:115)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/omelette/proc/attackby", function* attackby(f: Frame) {
	let F: Value = null, R: Value = null;
	f.vars = () => [F, R];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/kitchen/fork")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "forkload", (F = live(f.args[0]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You already have omelette on your fork!</span>"]);
		} else {
			rt.setFv(f, "icon_state", live(F), "forkloaded");
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ takes a piece of omelette with their fork!", [live(f.args[1])]), "<span class='notice'>You take a piece of omelette with your fork.</span>"]);
			R = rt.op(f, "PickUnweighted", [1], [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]);
			yield* g.callName(f, rt.sv(f, "reagents"), "remove_reagent", [rt.fv(f, "id", live(R)), 1]);
			rt.setFv(f, "forkload", live(F), live(R));
			if (rt.le(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 0)) {
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		}
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(5985, "/obj/item/weapon/reagent_containers/food/snacks/benedict", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "eggs benedict",
	desc: "There is only one egg on this, how rude.",
	icon_state: "benedict",
	trash: rt.typePath("/obj/item/trash/plate"),
	w_class: 3,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/benedict/proc/<init>  (code/modules/food_and_drinks/food/snacks_egg.dm:136)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/benedict/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 1, "bacon", 1, "bun", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 4]));
	return f.dot;
});
