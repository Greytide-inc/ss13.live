// From code/modules/food_and_drinks/food/snacks_pastry.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6061, "/obj/item/weapon/reagent_containers/food/snacks/donut", "/obj/item/weapon/reagent_containers/food/snacks", {
	extra_reagent: null,
	bitesize: 5,
	bonus_reagents: null,
	filling_color: "#D2691E",
	tastes: null,
	name: "donut",
	desc: "Goes great with Robust Coffee.",
	icon_state: "donut1",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/donut/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:10)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/donut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["sugar", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["donut", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "sugar", 2]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/donut/proc/Initialize  (code/modules/food_and_drinks/food/snacks_pastry.dm:17)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/donut/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.op(f, "Prob", [], [30]))) return f.dot;
	rt.setSv(f, "icon_state", "donut2");
	rt.setSv(f, "name", "frosted donut");
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["sprinkles", 2]);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["sprinkles", 2, "sugar", 1]));
	rt.setSv(f, "filling_color", "#FF69B4");
	return f.dot;
}, true);

rt.type(6062, "/obj/item/weapon/reagent_containers/food/snacks/donut/chaos", "/obj/item/weapon/reagent_containers/food/snacks/donut", {
	bitesize: 10,
	tastes: null,
	name: "chaos donut",
	desc: "Like life, it never quite tastes the same.",
});

// /obj/item/weapon/reagent_containers/food/snacks/donut/chaos/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:29)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/donut/chaos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["donut", 3, "chaos", 1]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/donut/chaos/proc/Initialize  (code/modules/food_and_drinks/food/snacks_pastry.dm:32)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/donut/chaos/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "extra_reagent", rt.op(f, "PickUnweighted", [10], ["nutriment", "capsaicin", "frostoil", "krokodil", "plasma", "cocoa", "slimejelly", "banana", "berryjuice", "omnizine"]));
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [fmt("＀", [rt.sv(f, "extra_reagent")]), 3]);
	rt.setSv(f, "bonus_reagents", rt.alist(f, [fmt("＀", [rt.sv(f, "extra_reagent")]), 3, "sugar", 1]));
	if (!truthy(rt.op(f, "Prob", [], [30]))) return f.dot;
	rt.setSv(f, "icon_state", "donut2");
	rt.setSv(f, "name", "frosted chaos donut");
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["sprinkles", 2]);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["sprinkles", 2, fmt("＀", [rt.sv(f, "extra_reagent")]), 3, "sugar", 1]));
	rt.setSv(f, "filling_color", "#FF69B4");
	return f.dot;
}, true);

rt.type(6063, "/obj/item/weapon/reagent_containers/food/snacks/donut/jelly", "/obj/item/weapon/reagent_containers/food/snacks/donut", {
	bonus_reagents: null,
	extra_reagent: "berryjuice",
	tastes: null,
	name: "jelly donut",
	desc: "You jelly?",
	icon_state: "jdonut1",
});

// /obj/item/weapon/reagent_containers/food/snacks/donut/jelly/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:47)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/donut/jelly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["sugar", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["jelly", 1, "donut", 3]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/donut/jelly/proc/Initialize  (code/modules/food_and_drinks/food/snacks_pastry.dm:52)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/donut/jelly/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "extra_reagent"))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [fmt("＀", [rt.sv(f, "extra_reagent")]), 3]);
	}
	if (!truthy(rt.op(f, "Prob", [], [30]))) return f.dot;
	rt.setSv(f, "icon_state", "jdonut2");
	rt.setSv(f, "name", "frosted jelly Donut");
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["sprinkles", 2]);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["sprinkles", 2, "sugar", 1]));
	rt.setSv(f, "filling_color", "#FF69B4");
	return f.dot;
}, true);

rt.type(6066, "/obj/item/weapon/reagent_containers/food/snacks/muffin", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#F4A460",
	tastes: null,
	name: "muffin",
	desc: "A delicious and spongy little cake.",
	icon_state: "muffin",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/muffin/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:80)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/muffin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["muffin", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6]));
	return f.dot;
});

rt.type(6067, "/obj/item/weapon/reagent_containers/food/snacks/muffin/berry", "/obj/item/weapon/reagent_containers/food/snacks/muffin", {
	tastes: null,
	name: "berry muffin",
	icon_state: "berrymuffin",
	desc: "A delicious and spongy little cake, with berries.",
});

// /obj/item/weapon/reagent_containers/food/snacks/muffin/berry/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:89)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/muffin/berry/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["muffin", 3, "berry", 1]));
	return f.dot;
});

rt.type(6068, "/obj/item/weapon/reagent_containers/food/snacks/muffin/booberry", "/obj/item/weapon/reagent_containers/food/snacks/muffin", {
	tastes: null,
	name: "booberry muffin",
	icon_state: "berrymuffin",
	alpha: 125,
	desc: "My stomach is a graveyard! No living being can quench my bloodthirst!",
});

// /obj/item/weapon/reagent_containers/food/snacks/muffin/booberry/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:96)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/muffin/booberry/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["muffin", 3, "spookiness", 1]));
	return f.dot;
});

rt.type(6069, "/obj/item/weapon/reagent_containers/food/snacks/chawanmushi", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FFE4E1",
	tastes: null,
	name: "chawanmushi",
	desc: "A legendary egg custard that makes friends out of enemies. Probably too hot for a cat to eat.",
	icon_state: "chawanmushi",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/chawanmushi/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:102)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/chawanmushi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["custard", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5]));
	return f.dot;
});

rt.type(6070, "/obj/item/weapon/reagent_containers/food/snacks/waffles", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#D2691E",
	tastes: null,
	name: "waffles",
	desc: "Mmm, waffles.",
	icon_state: "waffles",
	trash: rt.typePath("/obj/item/trash/waffles"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/waffles/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:114)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/waffles/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["waffles", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 8, "vitamin", 1]));
	return f.dot;
});

rt.type(6071, "/obj/item/weapon/reagent_containers/food/snacks/soylentgreen", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#9ACD32",
	tastes: null,
	name: "１Soylent Green",
	desc: "Not made of people. Honest.",
	icon_state: "soylent_green",
	trash: rt.typePath("/obj/item/trash/waffles"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soylentgreen/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:124)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soylentgreen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["waffles", 7, "people", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 10, "vitamin", 1]));
	return f.dot;
});

rt.type(6072, "/obj/item/weapon/reagent_containers/food/snacks/soylenviridians", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#9ACD32",
	tastes: null,
	name: "１Soylent Virdians",
	desc: "Not made of people. Honest.",
	icon_state: "soylent_yellow",
	trash: rt.typePath("/obj/item/trash/waffles"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soylenviridians/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:134)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soylenviridians/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["waffles", 7, "the colour green", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 10, "vitamin", 1]));
	return f.dot;
});

rt.type(6073, "/obj/item/weapon/reagent_containers/food/snacks/rofflewaffles", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 4,
	bonus_reagents: null,
	filling_color: "#00BFFF",
	tastes: null,
	name: "roffle waffles",
	desc: "Waffles from Roffle. Co.",
	icon_state: "rofflewaffles",
	trash: rt.typePath("/obj/item/trash/waffles"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/rofflewaffles/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:145)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/rofflewaffles/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["waffle", 1, "mushrooms", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 8, "mushroomhallucinogen", 2, "vitamin", 2]));
	return f.dot;
});

rt.type(6074, "/obj/item/weapon/reagent_containers/food/snacks/cookie", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 1,
	bonus_reagents: null,
	filling_color: "#F0E68C",
	tastes: null,
	name: "cookie",
	desc: "COOKIE!!!",
	icon_state: "COOKIE!!!",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cookie/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:157)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cookie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["cookie", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1]));
	return f.dot;
});

rt.type(6075, "/obj/item/weapon/reagent_containers/food/snacks/donkpocket", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#CD853F",
	tastes: null,
	name: "１Donk-pocket",
	desc: "The food of choice for the seasoned traitor.",
	icon_state: "donkpocket",
	list_reagents: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/donkpocket/warm"),
});

// /obj/item/weapon/reagent_containers/food/snacks/donkpocket/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:169)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/donkpocket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 2, "dough", 2, "laziness", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4]));
	return f.dot;
});

rt.type(6076, "/obj/item/weapon/reagent_containers/food/snacks/donkpocket/warm", "/obj/item/weapon/reagent_containers/food/snacks/donkpocket", {
	bonus_reagents: null,
	tastes: null,
	name: "warm Donk-pocket",
	desc: "The heated food of choice for the seasoned traitor.",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/donkpocket/warm/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:174)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/donkpocket/warm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["omnizine", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 2, "dough", 2, "laziness", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "omnizine", 3]));
	return f.dot;
});

rt.type(6077, "/obj/item/weapon/reagent_containers/food/snacks/dankpocket", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#00FF00",
	tastes: null,
	name: "１Dank-pocket",
	desc: "The food of choice for the seasoned botanist.",
	icon_state: "dankpocket",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/dankpocket/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:184)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/dankpocket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 2, "dough", 2]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["lipolicide", 3, "space_drugs", 3, "nutriment", 4]));
	return f.dot;
});

rt.type(6078, "/obj/item/weapon/reagent_containers/food/snacks/fortunecookie", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#F4A460",
	tastes: null,
	name: "fortune cookie",
	desc: "A true prophecy in each cookie!",
	icon_state: "fortune_cookie",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/fortunecookie/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:190)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/fortunecookie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["cookie", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3]));
	return f.dot;
});

rt.type(6079, "/obj/item/weapon/reagent_containers/food/snacks/poppypretzel", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#F0E68C",
	tastes: null,
	name: "poppy pretzel",
	desc: "It's all twisted up!",
	icon_state: "poppypretzel",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/poppypretzel/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:199)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/poppypretzel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["pretzel", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5]));
	return f.dot;
});

rt.type(6080, "/obj/item/weapon/reagent_containers/food/snacks/plumphelmetbiscuit", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#F0E68C",
	tastes: null,
	name: "plump helmet biscuit",
	desc: "This is a finely-prepared plump helmet biscuit. The ingredients are exceptionally minced plump helmet, and well-minced dwarven wheat flour.",
	icon_state: "phelmbiscuit",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/plumphelmetbiscuit/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:208)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/plumphelmetbiscuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["mushroom", 1, "biscuit", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/plumphelmetbiscuit/proc/Initialize  (code/modules/food_and_drinks/food/snacks_pastry.dm:214)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/plumphelmetbiscuit/proc/Initialize", function* Initialize(f: Frame) {
	let fey: Value = null;
	f.vars = () => [fey];
	if (truthy((fey = rt.op(f, "Prob", [], [10])))) {
		rt.setSv(f, "name", "exceptional plump helmet biscuit");
		rt.setSv(f, "desc", "Microwave is taken by a fey mood! It has cooked an exceptional plump helmet biscuit!");
		rt.setSv(f, "bonus_reagents", rt.alist(f, ["omnizine", 5, "nutriment", 1, "vitamin", 1]));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(fey))) return f.dot;
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["omnizine", 5]);
	return f.dot;
}, true);

rt.type(6081, "/obj/item/weapon/reagent_containers/food/snacks/cracker", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 1,
	bonus_reagents: null,
	filling_color: "#F0E68C",
	tastes: null,
	name: "cracker",
	desc: "It's a salted cracker.",
	icon_state: "cracker",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cracker/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:228)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cracker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["cracker", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1]));
	return f.dot;
});

rt.type(6082, "/obj/item/weapon/reagent_containers/food/snacks/hotdog", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 3,
	bonus_reagents: null,
	filling_color: "#8B0000",
	tastes: null,
	name: "hotdog",
	desc: "Fresh footlong ready to go down on.",
	icon_state: "hotdog",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/hotdog/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:238)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/hotdog/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 3, "meat", 2]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "ketchup", 3, "vitamin", 3]));
	return f.dot;
});

rt.type(6083, "/obj/item/weapon/reagent_containers/food/snacks/meatbun", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#8B0000",
	tastes: null,
	name: "meat bun",
	desc: "Has the potential to not be Dog.",
	icon_state: "meatbun",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/meatbun/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:247)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meatbun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 3, "meat", 2]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 2]));
	return f.dot;
});

rt.type(6084, "/obj/item/weapon/reagent_containers/food/snacks/khachapuri", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#FFFF4D",
	tastes: null,
	name: "khachapuri",
	desc: "Bread with egg and cheese?",
	icon_state: "khachapuri",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/khachapuri/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:258)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/khachapuri/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["bread", 1, "egg", 1, "cheese", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 12, "vitamin", 2]));
	return f.dot;
});

rt.type(5871, "/obj/item/weapon/reagent_containers/food/snacks/sugarcookie", "/obj/item/weapon/reagent_containers/food/snacks", {
	name: "sugar cookie",
	desc: "Just like your little sister used to make.",
	icon_state: "sugarcookie",
	bonus_reagents: null,
	list_reagents: null,
	filling_color: "#CD853F",
	tastes: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/sugarcookie/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:265)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/sugarcookie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "sugar", 3]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "sugar", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["sweetness", 1]));
	return f.dot;
});

rt.type(6085, "/obj/item/weapon/reagent_containers/food/snacks/chococornet", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FFE4C4",
	tastes: null,
	name: "chocolate cornet",
	desc: "Which side's the head, the fat end or the thin end?",
	icon_state: "chococornet",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/chococornet/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:274)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/chococornet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["biscuit", 3, "chocolate", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 1]));
	return f.dot;
});

rt.type(6086, "/obj/item/weapon/reagent_containers/food/snacks/oatmealcookie", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#D2691E",
	tastes: null,
	name: "oatmeal cookie",
	desc: "The best of both cookie and oat",
	icon_state: "oatmealcookie",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/oatmealcookie/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:283)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/oatmealcookie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["cookie", 2, "oat", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 1]));
	return f.dot;
});

rt.type(6087, "/obj/item/weapon/reagent_containers/food/snacks/raisincookie", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#F0E68C",
	tastes: null,
	name: "raisin cookie",
	desc: "Why would you put raisins on a cookie?",
	icon_state: "raisincookie",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/raisincookie/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:292)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/raisincookie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["cookie", 1, "raisins", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 1]));
	return f.dot;
});

rt.type(6088, "/obj/item/weapon/reagent_containers/food/snacks/cherrycupcake", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#F0E68C",
	tastes: null,
	name: "cherry cupcake",
	desc: "A sweet cupcake with cherry bits.",
	icon_state: "cherrycupcake",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cherrycupcake/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:301)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cherrycupcake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 3, "cherry", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 1]));
	return f.dot;
});

rt.type(6089, "/obj/item/weapon/reagent_containers/food/snacks/bluecherrycupcake", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#F0E68C",
	tastes: null,
	name: "blue cherry cupcake",
	desc: "Blue cherries inside a delicious cupcake",
	icon_state: "bluecherrycupcake",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/bluecherrycupcake/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:310)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/bluecherrycupcake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["cake", 3, "blue cherry", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 1]));
	return f.dot;
});

rt.type(6090, "/obj/item/weapon/reagent_containers/food/snacks/honeybun", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#F2CE91",
	tastes: null,
	name: "honey bun",
	desc: "A sticky pastry bun glazed with honey.",
	icon_state: "honeybun",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/honeybun/proc/<init>  (code/modules/food_and_drinks/food/snacks_pastry.dm:319)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/honeybun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "honey", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["pastry", 1, "sweetness", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "honey", 5]));
	return f.dot;
});
