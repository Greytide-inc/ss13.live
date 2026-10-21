// From code/modules/food_and_drinks/food/snacks_other.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5910, "/obj/item/weapon/reagent_containers/food/snacks/store/cheesewheel", "/obj/item/weapon/reagent_containers/food/snacks/store", {
	slices_num: 5,
	tastes: null,
	name: "cheese wheel",
	desc: "A big wheel of delcious Cheddar.",
	icon_state: "cheesewheel",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"),
	list_reagents: null,
	w_class: 3,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/cheesewheel/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:12)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cheesewheel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cheese", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 15, "vitamin", 5]));
	return f.dot;
});

rt.type(6012, "/obj/item/weapon/reagent_containers/food/snacks/cheesewedge", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#FFD700",
	tastes: null,
	name: "cheese wedge",
	desc: "A wedge of delicious Cheddar. The cheese wheel it was cut from can't have gone far.",
	icon_state: "cheesewedge",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cheesewedge/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:20)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cheese", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 1]));
	return f.dot;
});

rt.type(6013, "/obj/item/weapon/reagent_containers/food/snacks/watermelonslice", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#FF1493",
	tastes: null,
	name: "watermelon slice",
	desc: "A slice of watery goodness.",
	icon_state: "watermelonslice",
});

// /obj/item/weapon/reagent_containers/food/snacks/watermelonslice/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:27)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/watermelonslice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["watermelon", 1]));
	return f.dot;
});

rt.type(6014, "/obj/item/weapon/reagent_containers/food/snacks/candy_corn", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#FF8C00",
	tastes: null,
	name: "candy corn",
	desc: "It's a handful of candy corn. Can be stored in a detective's hat.",
	icon_state: "candy_corn",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/candy_corn/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:35)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/candy_corn/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["candy corn", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "sugar", 2]));
	return f.dot;
});

rt.type(6015, "/obj/item/weapon/reagent_containers/food/snacks/chocolatebar", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#A0522D",
	tastes: null,
	name: "chocolate bar",
	desc: "Such, sweet, fattening food.",
	icon_state: "chocolatebar",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/chocolatebar/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:43)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["chocolate", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2, "sugar", 2, "cocoa", 2]));
	return f.dot;
});

rt.type(6016, "/obj/item/weapon/reagent_containers/food/snacks/hugemushroomslice", "/obj/item/weapon/reagent_containers/food/snacks", {
	tastes: null,
	name: "huge mushroom slice",
	desc: "A slice from a huge mushroom.",
	icon_state: "hugemushroomslice",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/hugemushroomslice/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:50)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/hugemushroomslice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["mushroom", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 1]));
	return f.dot;
});

rt.type(6017, "/obj/item/weapon/reagent_containers/food/snacks/popcorn", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 0.1,
	filling_color: "#FFEFD5",
	tastes: null,
	name: "popcorn",
	desc: "Now let's find some cinema.",
	icon_state: "popcorn",
	trash: rt.typePath("/obj/item/trash/popcorn"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/popcorn/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:60)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/popcorn/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["popcorn", 3, "butter", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/popcorn/proc/New  (code/modules/food_and_drinks/food/snacks_other.dm:63)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/popcorn/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "eatverb", rt.op(f, "PickUnweighted", [6], ["bite", "crunch", "nibble", "gnaw", "gobble", "chomp"]));
	return f.dot;
}, true);

rt.type(6018, "/obj/item/weapon/reagent_containers/food/snacks/loadedbakedpotato", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#D2B48C",
	tastes: null,
	name: "loaded baked potato",
	desc: "Totally baked.",
	icon_state: "loadedbakedpotato",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/loadedbakedpotato/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:70)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/loadedbakedpotato/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["potato", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6]));
	return f.dot;
});

rt.type(6019, "/obj/item/weapon/reagent_containers/food/snacks/fries", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#FFD700",
	tastes: null,
	name: "space fries",
	desc: "AKA: French Fries, Freedom Fries, etc.",
	icon_state: "fries",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/fries/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:82)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/fries/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["fries", 3, "salt", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4]));
	return f.dot;
});

rt.type(6020, "/obj/item/weapon/reagent_containers/food/snacks/tatortot", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "FFD700",
	tastes: null,
	name: "tator tot",
	desc: "A large fried potato nugget that may or may not try to valid you.",
	icon_state: "tatortot",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/tatortot/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:90)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/tatortot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["potato", 3, "valids", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4]));
	return f.dot;
});

rt.type(6021, "/obj/item/weapon/reagent_containers/food/snacks/soydope", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#DEB887",
	tastes: null,
	name: "soy dope",
	desc: "Dope from a soy.",
	icon_state: "soydope",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soydope/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:99)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soydope/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["soy", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2]));
	return f.dot;
});

rt.type(6022, "/obj/item/weapon/reagent_containers/food/snacks/cheesyfries", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FFD700",
	tastes: null,
	name: "cheesy fries",
	desc: "Fries. Covered in cheese. Duh.",
	icon_state: "cheesyfries",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cheesyfries/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:106)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cheesyfries/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["fries", 3, "cheese", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6]));
	return f.dot;
});

rt.type(6023, "/obj/item/weapon/reagent_containers/food/snacks/badrecipe", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#8B4513",
	name: "burned mess",
	desc: "Someone should be demoted from cook for this.",
	icon_state: "badrecipe",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/badrecipe/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:115)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/badrecipe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["bad_food", 30]));
	return f.dot;
});

rt.type(6024, "/obj/item/weapon/reagent_containers/food/snacks/carrotfries", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#FFA500",
	tastes: null,
	name: "carrot fries",
	desc: "Tasty fries from fresh Carrots.",
	icon_state: "carrotfries",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/carrotfries/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:125)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/carrotfries/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["carrots", 3, "salt", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "oculine", 3, "vitamin", 2]));
	return f.dot;
});

rt.type(6025, "/obj/item/weapon/reagent_containers/food/snacks/candiedapple", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 3,
	bonus_reagents: null,
	filling_color: "#FF4500",
	tastes: null,
	name: "candied apple",
	desc: "An apple coated in sugary sweetness.",
	icon_state: "candiedapple",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/candiedapple/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:132)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/candiedapple/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "sugar", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["apple", 2, "sweetness", 2]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "sugar", 2]));
	return f.dot;
});

rt.type(6026, "/obj/item/weapon/reagent_containers/food/snacks/mint", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 1,
	filling_color: "#800000",
	name: "mint",
	desc: "it is only wafer thin.",
	icon_state: "mint",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/mint/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:143)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/mint/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["minttoxin", 1]));
	return f.dot;
});

rt.type(6027, "/obj/item/weapon/reagent_containers/food/snacks/eggwrap", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#F0E68C",
	tastes: null,
	name: "egg wrap",
	desc: "The precursor to Pigs in a Blanket.",
	icon_state: "eggwrap",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/eggwrap/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:150)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/eggwrap/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["egg", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5]));
	return f.dot;
});

rt.type(6028, "/obj/item/weapon/reagent_containers/food/snacks/beans", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#B22222",
	tastes: null,
	name: "tin of beans",
	desc: "Musical fruit in a slightly less musical container.",
	icon_state: "beans",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/beans/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:159)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/beans/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["beans", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 10]));
	return f.dot;
});

rt.type(6029, "/obj/item/weapon/reagent_containers/food/snacks/spidereggs", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#008000",
	tastes: null,
	name: "spider eggs",
	desc: "A cluster of juicy spider eggs. A great side dish for when you care not for your health.",
	icon_state: "spidereggs",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/spidereggs/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:170)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/spidereggs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cobwebs", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2, "toxin", 2]));
	return f.dot;
});

rt.type(6030, "/obj/item/weapon/reagent_containers/food/snacks/chococoin", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#A0522D",
	tastes: null,
	name: "chocolate coin",
	desc: "A completely edible but nonflippable festive coin.",
	icon_state: "chococoin",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/chococoin/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:176)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/chococoin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "sugar", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["chocolate", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "cocoa", 1]));
	return f.dot;
});

rt.type(6031, "/obj/item/weapon/reagent_containers/food/snacks/fudgedice", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#A0522D",
	tastes: null,
	name: "fudge dice",
	desc: "A little cube of chocolate that tends to have a less intense taste if you eat too many at once.",
	icon_state: "chocodice",
	list_reagents: null,
	trash: rt.typePath("/obj/item/weapon/dice/fudge"),
});

// /obj/item/weapon/reagent_containers/food/snacks/fudgedice/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:185)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/fudgedice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "sugar", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["fudge", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "cocoa", 1]));
	return f.dot;
});

rt.type(6032, "/obj/item/weapon/reagent_containers/food/snacks/chocoorange", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#A0522D",
	tastes: null,
	name: "chocolate orange",
	desc: "A festive chocolate orange",
	icon_state: "chocoorange",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/chocoorange/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:195)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/chocoorange/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "sugar", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["chocolate", 3, "oranges", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "sugar", 1]));
	return f.dot;
});

rt.type(6033, "/obj/item/weapon/reagent_containers/food/snacks/eggplantparm", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#BA55D3",
	tastes: null,
	name: "eggplant parmigiana",
	desc: "The only good recipe for eggplant.",
	icon_state: "eggplantparm",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/eggplantparm/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:205)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/eggplantparm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["eggplant", 3, "cheese", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 2]));
	return f.dot;
});

rt.type(6034, "/obj/item/weapon/reagent_containers/food/snacks/tortilla", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#FFEFD5",
	tastes: null,
	name: "tortilla",
	desc: "The base for all your burritos.",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "tortilla",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/tortilla/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:217)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/tortilla/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["tortilla", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 1]));
	return f.dot;
});

rt.type(6035, "/obj/item/weapon/reagent_containers/food/snacks/burrito", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FFEFD5",
	tastes: null,
	name: "burrito",
	desc: "Tortilla wrapped goodness.",
	icon_state: "burrito",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/burrito/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:223)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burrito/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["torilla", 2, "meat", 3]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 1]));
	return f.dot;
});

rt.type(6036, "/obj/item/weapon/reagent_containers/food/snacks/cheesyburrito", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FFD800",
	tastes: null,
	name: "cheesy burrito",
	desc: "It's a burrito filled with cheese.",
	icon_state: "cheesyburrito",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cheesyburrito/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:232)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cheesyburrito/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["torilla", 2, "meat", 3, "cheese", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 2]));
	return f.dot;
});

rt.type(6037, "/obj/item/weapon/reagent_containers/food/snacks/carneburrito", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#A0522D",
	tastes: null,
	name: "carne asada burrito",
	desc: "The best burrito for meat lovers.",
	icon_state: "carneburrito",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/carneburrito/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:241)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/carneburrito/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["torilla", 2, "meat", 4]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 1]));
	return f.dot;
});

rt.type(6038, "/obj/item/weapon/reagent_containers/food/snacks/fuegoburrito", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FF2000",
	tastes: null,
	name: "fuego plasma burrito",
	desc: "A super spicy burrito.",
	icon_state: "fuegoburrito",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/fuegoburrito/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:250)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/fuegoburrito/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["torilla", 2, "meat", 3, "hot peppers", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "capsaicin", 5, "vitamin", 3]));
	return f.dot;
});

rt.type(6039, "/obj/item/weapon/reagent_containers/food/snacks/yakiimo", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#8B1105",
	tastes: null,
	name: "yaki imo",
	desc: "Made with roasted sweet potatoes!",
	icon_state: "yakiimo",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/yakiimo/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:262)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/yakiimo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["sweet potato", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 4]));
	return f.dot;
});

rt.type(6040, "/obj/item/weapon/reagent_containers/food/snacks/roastparsnip", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#FF5500",
	tastes: null,
	name: "roast parsnip",
	desc: "Sweet and crunchy.",
	icon_state: "roastparsnip",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/roastparsnip/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:271)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/roastparsnip/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["parsnip", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 4]));
	return f.dot;
});

rt.type(6041, "/obj/item/weapon/reagent_containers/food/snacks/melonfruitbowl", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FF5500",
	tastes: null,
	name: "melon fruit bowl",
	desc: "For people who wants edible fruit bowls.",
	icon_state: "melonfruitbowl",
	list_reagents: null,
	w_class: 3,
});

// /obj/item/weapon/reagent_containers/food/snacks/melonfruitbowl/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:277)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/melonfruitbowl/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["melon", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 4]));
	return f.dot;
});

rt.type(6042, "/obj/item/weapon/reagent_containers/food/snacks/spacefreezy", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#87CEFA",
	tastes: null,
	name: "space freezy",
	desc: "The best icecream in space.",
	icon_state: "spacefreezy",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/spacefreezy/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:287)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/spacefreezy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["blue cherries", 2, "ice cream", 2]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "bluecherryjelly", 5, "vitamin", 4]));
	return f.dot;
});

rt.type(6043, "/obj/item/weapon/reagent_containers/food/snacks/sundae", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FFFACD",
	tastes: null,
	name: "sundae",
	desc: "A classic dessert.",
	icon_state: "sundae",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/sundae/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:296)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/sundae/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["ice cream", 1, "banana", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "banana", 5, "vitamin", 2]));
	return f.dot;
});

rt.type(6044, "/obj/item/weapon/reagent_containers/food/snacks/honkdae", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FFFACD",
	tastes: null,
	name: "honkdae",
	desc: "The clown's favorite dessert.",
	icon_state: "honkdae",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/honkdae/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:305)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/honkdae/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["ice cream", 1, "banana", 1, "a bad joke", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "banana", 10, "vitamin", 4]));
	return f.dot;
});

rt.type(6045, "/obj/item/weapon/reagent_containers/food/snacks/nachos", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#F4A460",
	tastes: null,
	name: "nachos",
	desc: "Chips from Space Mexico.",
	icon_state: "nachos",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/nachos/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:314)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/nachos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["nachos", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 2]));
	return f.dot;
});

rt.type(6046, "/obj/item/weapon/reagent_containers/food/snacks/cheesynachos", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FFD700",
	tastes: null,
	name: "cheesy nachos",
	desc: "The delicious combination of nachos and melting cheese.",
	icon_state: "cheesynachos",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cheesynachos/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:323)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cheesynachos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["nachos", 2, "cheese", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 3]));
	return f.dot;
});

rt.type(6047, "/obj/item/weapon/reagent_containers/food/snacks/cubannachos", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#DC143C",
	tastes: null,
	name: "cuban nachos",
	desc: "That's some dangerously spicy nachos.",
	icon_state: "cubannachos",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cubannachos/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:332)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cubannachos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["nachos", 2, "hot pepper", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 7, "capsaicin", 8, "vitamin", 4]));
	return f.dot;
});

rt.type(6048, "/obj/item/weapon/reagent_containers/food/snacks/melonkeg", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FFD700",
	bitesize: 5,
	tastes: null,
	name: "melon keg",
	desc: "Who knew vodka was a fruit?",
	icon_state: "melonkeg",
	list_reagents: null,
	volume: 80,
});

// /obj/item/weapon/reagent_containers/food/snacks/melonkeg/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:341)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/melonkeg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["grain alcohol", 1, "fruit", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 9, "vodka", 15, "vitamin", 4]));
	return f.dot;
});

rt.type(6049, "/obj/item/weapon/reagent_containers/food/snacks/honeybar", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#F2CE91",
	tastes: null,
	name: "honey nut bar",
	desc: "Oats and nuts compressed together into a bar, held together with a honey glaze.",
	icon_state: "honeybar",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/honeybar/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:352)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/honeybar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "honey", 2, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["oats", 3, "nuts", 2, "honey", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "honey", 5]));
	return f.dot;
});

rt.type(6050, "/obj/item/weapon/reagent_containers/food/snacks/stuffedlegion", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "stuffed legion",
	desc: "The former skull of a damned human, filled with goliath meat. It has a decorative lava pool made of ketchup and hotsauce.",
	icon_state: "stuffed_legion",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/stuffedlegion/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:361)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/stuffedlegion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 3, "capsaicin", 1, "tricordrazine", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["death", 2, "rock", 1, "meat", 1, "hot peppers", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 5, "capsaicin", 2, "tricordrazine", 10]));
	return f.dot;
});

rt.type(6051, "/obj/item/weapon/reagent_containers/food/snacks/powercrepe", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "Powercrepe",
	desc: "With great power, comes great crepes.  It looks like a pancake filled with jelly but packs quite a punch.",
	icon_state: "powercrepe",
	list_reagents: null,
	force: 20,
	throwforce: 10,
	block_chance: 50,
	armour_penetration: 75,
	attack_verb: null,
	w_class: 4,
});

// /obj/item/weapon/reagent_containers/food/snacks/powercrepe/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:370)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/powercrepe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 3, "iron", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["cherry", 1, "crepe", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 10, "vitamin", 5, "cherryjelly", 5]));
	rt.setSv(f, "attack_verb", rt.list("slapped", "slathered"));
	return f.dot;
});

rt.type(6052, "/obj/item/weapon/reagent_containers/food/snacks/lollipop", "/obj/item/weapon/reagent_containers/food/snacks", {
	head: null,
	headcolor: "#000000",
	tastes: null,
	name: "lollipop",
	desc: "A delicious lollipop. Makes for a great Valentine's present.",
	icon: rt.rsc("icons/obj/lollipop.dmi"),
	icon_state: "lollipop_stick",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/lollipop/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:388)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/lollipop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["candy", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1, "iron", 10, "sugar", 5, "omnizine", 2]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/lollipop/proc/New  (code/modules/food_and_drinks/food/snacks_other.dm:391)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/lollipop/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "head", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/lollipop.dmi"), "lollipop_head"])));
	yield* g.srcCall(f, "change_head_color", rt.op(f, "Rgb", [1, 3], [(yield* g.call(f, P("/proc/rand"), null, [0, 255])), (yield* g.call(f, P("/proc/rand"), null, [0, 255])), (yield* g.call(f, P("/proc/rand"), null, [0, 255]))]));
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/lollipop/proc/change_head_color  (code/modules/food_and_drinks/food/snacks_other.dm:396)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/lollipop/proc/change_head_color", function change_head_color(f: Frame, C: Value) {
	rt.setSv(f, "headcolor", live(C));
	rt.callSrc(f, "cut_overlay", [rt.sv(f, "head")]);
	rt.setFv(f, "color", rt.sv(f, "head"), live(C));
	rt.callSrc(f, "add_overlay", [rt.sv(f, "head")]);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/lollipop/proc/throw_impact  (code/modules/food_and_drinks/food/snacks_other.dm:402)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/lollipop/proc/throw_impact", function throw_impact(f: Frame, A: Value) {
	rt.callSuper(f, [live(A)]);
	rt.setSv(f, "throw_speed", 1);
	rt.setSv(f, "throwforce", 0);
	return f.dot;
}, false, { waitfor: false });

rt.type(6053, "/obj/item/weapon/reagent_containers/food/snacks/lollipop/cyborg", "/obj/item/weapon/reagent_containers/food/snacks/lollipop", {
	spamchecking: 1,
});

// /obj/item/weapon/reagent_containers/food/snacks/lollipop/cyborg/proc/New  (code/modules/food_and_drinks/food/snacks_other.dm:410)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/lollipop/cyborg/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/reagent_containers/food/snacks/lollipop/cyborg/proc/spamcheck")])), 1200]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/lollipop/cyborg/proc/equipped  (code/modules/food_and_drinks/food/snacks_other.dm:414)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/lollipop/cyborg/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	f.vars = () => [user, slot];
	f.dot = (yield* g.callSuper(f, [live(user), live(slot)]));
	rt.setSv(f, "spamchecking", 0);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/lollipop/cyborg/proc/spamcheck  (code/modules/food_and_drinks/food/snacks_other.dm:419)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/lollipop/cyborg/proc/spamcheck", function* spamcheck(f: Frame) {
	if (!truthy(rt.sv(f, "spamchecking"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(6054, "/obj/item/weapon/reagent_containers/food/snacks/gumball", "/obj/item/weapon/reagent_containers/food/snacks", {
	tastes: null,
	name: "gumball",
	desc: "A colorful, sugary gumball.",
	icon: rt.rsc("icons/obj/lollipop.dmi"),
	icon_state: "gumball",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/gumball/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:427)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/gumball/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.list("candy"));
	rt.setSv(f, "list_reagents", rt.alist(f, ["sugar", 5, "bicaridine", 2, "kelotane", 2]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/gumball/proc/New  (code/modules/food_and_drinks/food/snacks_other.dm:430)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/gumball/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "color", rt.op(f, "Rgb", [1, 3], [(yield* g.call(f, P("/proc/rand"), null, [0, 255])), (yield* g.call(f, P("/proc/rand"), null, [0, 255])), (yield* g.call(f, P("/proc/rand"), null, [0, 255]))]));
	return f.dot;
}, true);

rt.type(6055, "/obj/item/weapon/reagent_containers/food/snacks/gumball/cyborg", "/obj/item/weapon/reagent_containers/food/snacks/gumball", {
	spamchecking: 1,
});

// /obj/item/weapon/reagent_containers/food/snacks/gumball/cyborg/proc/New  (code/modules/food_and_drinks/food/snacks_other.dm:437)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/gumball/cyborg/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/reagent_containers/food/snacks/gumball/cyborg/proc/spamcheck")])), 1200]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/gumball/cyborg/proc/equipped  (code/modules/food_and_drinks/food/snacks_other.dm:441)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/gumball/cyborg/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	f.vars = () => [user, slot];
	f.dot = (yield* g.callSuper(f, [live(user), live(slot)]));
	rt.setSv(f, "spamchecking", 0);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/gumball/cyborg/proc/spamcheck  (code/modules/food_and_drinks/food/snacks_other.dm:446)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/gumball/cyborg/proc/spamcheck", function* spamcheck(f: Frame) {
	if (!truthy(rt.sv(f, "spamchecking"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(6056, "/obj/item/weapon/reagent_containers/food/snacks/taco", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "F0D830",
	tastes: null,
	name: "taco",
	desc: "A traditional taco with meat, cheese, and lettuce.",
	icon_state: "taco",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/taco/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:452)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/taco/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["taco", 4, "meat", 2, "cheese", 2, "lettuce", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 2]));
	return f.dot;
});

rt.type(6057, "/obj/item/weapon/reagent_containers/food/snacks/taco/plain", "/obj/item/weapon/reagent_containers/food/snacks/taco", {
	bonus_reagents: null,
	tastes: null,
	desc: "A traditional taco with meat and cheese, minus the rabbit food.",
	icon_state: "taco_plain",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/taco/plain/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:460)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/taco/plain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["taco", 4, "meat", 2, "cheese", 2]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 1]));
	return f.dot;
});

rt.type(6058, "/obj/item/weapon/reagent_containers/food/snacks/branrequests", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "Bran Requests Cereal",
	desc: "A dry cereal that satiates your requests for bran. Tastes uniquely like raisins and salt.",
	icon_state: "bran_requests",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/branrequests/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:469)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/branrequests/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["sodiumchloride", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["bran", 4, "raisins", 3, "salt", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 2, "sodiumchloride", 5]));
	return f.dot;
});

rt.type(6059, "/obj/item/weapon/reagent_containers/food/snacks/butter", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#FFD700",
	tastes: null,
	name: "stick of butter",
	desc: "A stick of delicious, golden, fatty goodness.",
	icon_state: "butter",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/butter/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:478)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/butter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["butter", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5]));
	return f.dot;
});

rt.type(6060, "/obj/item/weapon/reagent_containers/food/snacks/onionrings", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#C0C9A0",
	tastes: null,
	name: "onion rings",
	desc: "Onion slices coated in batter.",
	icon_state: "onionrings",
	list_reagents: null,
	gender: "plural",
});

// /obj/item/weapon/reagent_containers/food/snacks/onionrings/proc/<init>  (code/modules/food_and_drinks/food/snacks_other.dm:487)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/onionrings/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["batter", 3, "onion", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3]));
	return f.dot;
});
