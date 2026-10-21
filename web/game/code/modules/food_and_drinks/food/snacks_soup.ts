// From code/modules/food_and_drinks/food/snacks_soup.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6154, "/obj/item/weapon/reagent_containers/food/snacks/soup", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 5,
	tastes: null,
	w_class: 3,
	icon: rt.rsc("icons/obj/food/soupsalad.dmi"),
	trash: rt.typePath("/obj/item/weapon/reagent_containers/glass/bowl"),
	volume: 80,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:8)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["tasteless soup", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 8, "water", 5, "vitamin", 4]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/proc/New  (code/modules/food_and_drinks/food/snacks_soup.dm:11)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "eatverb", rt.op(f, "PickUnweighted", [5], ["slurp", "sip", "suck", "inhale", "drink"]));
	return f.dot;
}, true);

rt.type(6155, "/obj/item/weapon/reagent_containers/food/snacks/soup/wish", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	tastes: null,
	name: "wish soup",
	desc: "I wish this was soup.",
	icon_state: "wishsoup",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/wish/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:19)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/wish/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["wishes", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["water", 10]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/wish/proc/New  (code/modules/food_and_drinks/food/snacks_soup.dm:22)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/wish/proc/New", function* New(f: Frame) {
	let wish_true: Value = null;
	f.vars = () => [wish_true];
	if (truthy((wish_true = rt.op(f, "Prob", [], [25])))) {
		rt.setSv(f, "desc", "A wish come true!");
		rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 9, "vitamin", 1]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(wish_true))) return f.dot;
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["nutriment", 9]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["vitamin", 1]);
	return f.dot;
}, true);

rt.type(6156, "/obj/item/weapon/reagent_containers/food/snacks/soup/meatball", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "meatball soup",
	desc: "You've got balls kid, BALLS!",
	icon_state: "meatballsoup",
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/meatball/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:35)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/meatball/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1]));
	return f.dot;
});

rt.type(6157, "/obj/item/weapon/reagent_containers/food/snacks/soup/slime", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "slime soup",
	desc: "If no water is available, you may substitute tears.",
	icon_state: "slimesoup",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/slime/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:42)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/slime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "slimejelly", 5, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["slime", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "slimejelly", 5, "water", 5, "vitamin", 4]));
	return f.dot;
});

rt.type(6158, "/obj/item/weapon/reagent_containers/food/snacks/soup/blood", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "tomato soup",
	desc: "Smells like copper.",
	icon_state: "tomatosoup",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/blood/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:50)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/blood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 6]));
	rt.setSv(f, "tastes", rt.alist(f, ["iron", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2, "blood", 10, "water", 5, "vitamin", 4]));
	return f.dot;
});

rt.type(6159, "/obj/item/weapon/reagent_containers/food/snacks/soup/wingfangchu", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "wing fang chu",
	desc: "A savory dish of alien wing wang in soy.",
	icon_state: "wingfangchu",
	trash: rt.typePath("/obj/item/weapon/reagent_containers/glass/bowl"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/wingfangchu/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:59)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/wingfangchu/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["soy", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "soysauce", 5, "vitamin", 2]));
	return f.dot;
});

rt.type(6160, "/obj/item/weapon/reagent_containers/food/snacks/soup/clownstears", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "clown's tears",
	desc: "Not very funny.",
	icon_state: "clownstears",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/clownstears/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:67)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/clownstears/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "banana", 5, "vitamin", 8]));
	rt.setSv(f, "tastes", rt.alist(f, ["a bad joke", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "banana", 5, "water", 5, "vitamin", 8]));
	return f.dot;
});

rt.type(6161, "/obj/item/weapon/reagent_containers/food/snacks/soup/vegetable", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "vegetable soup",
	desc: "A true vegan meal.",
	icon_state: "vegetablesoup",
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/vegetable/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:75)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/vegetable/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["vegetables", 1]));
	return f.dot;
});

rt.type(6162, "/obj/item/weapon/reagent_containers/food/snacks/soup/nettle", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "nettle soup",
	desc: "To think, the botanist would've beat you to death with one of these.",
	icon_state: "nettlesoup",
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/nettle/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:82)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/nettle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "omnizine", 5, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["nettles", 1]));
	return f.dot;
});

rt.type(6163, "/obj/item/weapon/reagent_containers/food/snacks/soup/mystery", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	extra_reagent: null,
	tastes: null,
	name: "mystery soup",
	desc: "The mystery is, why aren't you eating it?",
	icon_state: "mysterysoup",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/mystery/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:91)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/mystery/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["chaos", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/mystery/proc/New  (code/modules/food_and_drinks/food/snacks_soup.dm:94)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/mystery/proc/New", function* New(f: Frame) {
	rt.setSv(f, "extra_reagent", rt.op(f, "PickUnweighted", [10], ["capsaicin", "frostoil", "omnizine", "banana", "blood", "slimejelly", "toxin", "banana", "carbon", "oculine"]));
	rt.setSv(f, "bonus_reagents", rt.alist(f, [fmt("＀", [rt.sv(f, "extra_reagent")]), 5, "nutriment", 6]));
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [fmt("＀", [rt.sv(f, "extra_reagent")]), 5]);
	return f.dot;
}, true);

rt.type(6164, "/obj/item/weapon/reagent_containers/food/snacks/soup/hotchili", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "hot chili",
	desc: "A five alarm Texan Chili!",
	icon_state: "hotchili",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/hotchili/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:103)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/hotchili/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "tomatojuice", 2, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["hot peppers", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "capsaicin", 1, "tomatojuice", 2, "vitamin", 2]));
	return f.dot;
});

rt.type(6165, "/obj/item/weapon/reagent_containers/food/snacks/soup/coldchili", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "cold chili",
	desc: "This slush is barely a liquid!",
	icon_state: "coldchili",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/coldchili/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:111)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/coldchili/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "tomatojuice", 2, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["tomato", 1, "mint", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "frostoil", 1, "tomatojuice", 2, "vitamin", 2]));
	return f.dot;
});

rt.type(6166, "/obj/item/weapon/reagent_containers/food/snacks/soup/monkeysdelight", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "monkey's delight",
	desc: "A delicious soup with dumplings and hunks of monkey meat simmered to perfection, in a broth that tastes faintly of bananas.",
	icon_state: "monkeysdelight",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/monkeysdelight/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:119)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/monkeysdelight/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["the jungle", 1, "banana", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 10, "banana", 5, "vitamin", 5]));
	return f.dot;
});

rt.type(6167, "/obj/item/weapon/reagent_containers/food/snacks/soup/tomato", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "tomato soup",
	desc: "Drinking this feels like being a vampire! A tomato vampire...",
	icon_state: "tomatosoup",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/tomato/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:127)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/tomato/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "tomatojuice", 10, "vitamin", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["tomato", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "tomatojuice", 10, "vitamin", 3]));
	return f.dot;
});

rt.type(6168, "/obj/item/weapon/reagent_containers/food/snacks/soup/tomato/eyeball", "/obj/item/weapon/reagent_containers/food/snacks/soup/tomato", {
	bonus_reagents: null,
	tastes: null,
	name: "eyeball soup",
	desc: "It looks back at you...",
	icon_state: "eyeballsoup",
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/tomato/eyeball/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:135)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/tomato/eyeball/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "liquidgibs", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["tomato", 1, "squirming", 1]));
	return f.dot;
});

rt.type(6169, "/obj/item/weapon/reagent_containers/food/snacks/soup/milo", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "milosoup",
	desc: "The universes best soup! Yum!!!",
	icon_state: "milosoup",
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/milo/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:142)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/milo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["milo", 1]));
	return f.dot;
});

rt.type(6170, "/obj/item/weapon/reagent_containers/food/snacks/soup/mushroom", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "chantrelle soup",
	desc: "A delicious and hearty mushroom soup.",
	icon_state: "mushroomsoup",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/mushroom/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:149)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/mushroom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["mushroom", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 8, "vitamin", 4]));
	return f.dot;
});

rt.type(6171, "/obj/item/weapon/reagent_containers/food/snacks/soup/beet", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	name: "beet soup",
	desc: "Wait, how do you spell it again..?",
	icon_state: "beetsoup",
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/beet/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:157)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/beet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 5]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/beet/proc/New  (code/modules/food_and_drinks/food/snacks_soup.dm:160)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/beet/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", rt.op(f, "PickUnweighted", [6], ["borsch", "bortsch", "borstch", "borsh", "borshch", "borscht"]));
	rt.setSv(f, "tastes", rt.alist(f, ["name", 1]));
	return f.dot;
}, true);

rt.type(6173, "/obj/item/weapon/reagent_containers/food/snacks/soup/spacylibertyduff", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bitesize: 3,
	bonus_reagents: null,
	tastes: null,
	name: "spacy liberty duff",
	desc: "Jello gelatin, from Alfred Hubbard's cookbook.",
	icon_state: "spacylibertyduff",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/spacylibertyduff/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:170)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/spacylibertyduff/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["jelly", 1, "mushroom", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "mushroomhallucinogen", 6]));
	return f.dot;
});

rt.type(6174, "/obj/item/weapon/reagent_containers/food/snacks/soup/amanitajelly", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bitesize: 3,
	bonus_reagents: null,
	tastes: null,
	name: "amanita jelly",
	desc: "Looks curiously toxic.",
	icon_state: "amanitajelly",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/amanitajelly/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:179)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/amanitajelly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["jelly", 1, "mushroom", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "mushroomhallucinogen", 3, "amatoxin", 6]));
	return f.dot;
});

rt.type(6175, "/obj/item/weapon/reagent_containers/food/snacks/soup/stew", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	bitesize: 7,
	tastes: null,
	name: "stew",
	desc: "A nice and warm stew. Healthy and strong.",
	icon_state: "stew",
	list_reagents: null,
	volume: 100,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/stew/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:187)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/stew/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "tomatojuice", 5, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["tomato", 1, "carrot", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 10, "oculine", 5, "tomatojuice", 5, "vitamin", 5]));
	return f.dot;
});

rt.type(6176, "/obj/item/weapon/reagent_containers/food/snacks/soup/sweetpotato", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	tastes: null,
	name: "sweet potato soup",
	desc: "Delicious sweet potato in soup form.",
	icon_state: "sweetpotatosoup",
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/sweetpotato/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:197)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/sweetpotato/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["sweet potato", 1]));
	return f.dot;
});

rt.type(6172, "/obj/item/weapon/reagent_containers/food/snacks/soup/beet/red", "/obj/item/weapon/reagent_containers/food/snacks/soup/beet", {
	bonus_reagents: null,
	tastes: null,
	name: "red beet soup",
	desc: "Quite a delicacy.",
	icon_state: "redbeetsoup",
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/beet/red/proc/<init>  (code/modules/food_and_drinks/food/snacks_soup.dm:204)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/beet/red/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 6]));
	rt.setSv(f, "tastes", rt.alist(f, ["beet", 1]));
	return f.dot;
});
