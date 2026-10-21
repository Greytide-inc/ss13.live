// From code/modules/food_and_drinks/food/snacks_burgers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5925, "/obj/item/weapon/reagent_containers/food/snacks/burger", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#CD853F",
	bitesize: 3,
	tastes: null,
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "hburger",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:7)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 4]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 1]));
	return f.dot;
});

rt.type(5926, "/obj/item/weapon/reagent_containers/food/snacks/burger/plain", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "burger",
	desc: "The cornerstone of every nutritious breakfast.",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/plain/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:12)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/plain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 1]));
	return f.dot;
});

rt.type(5927, "/obj/item/weapon/reagent_containers/food/snacks/burger/human", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	subjectname: "",
	subjectjob: null,
	bonus_reagents: null,
	name: "human burger",
	desc: "A bloody burger.",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/human/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:19)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/human/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 4]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/human/proc/CheckParts  (code/modules/food_and_drinks/food/snacks_burgers.dm:22)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/human/proc/CheckParts", function* CheckParts(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((M = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain/human"), rt.sv(f, "contents"))))) return f.dot;
	rt.setSv(f, "subjectname", rt.fv(f, "subjectname", live(M)));
	rt.setSv(f, "subjectjob", rt.fv(f, "subjectjob", live(M)));
	if (truthy(rt.sv(f, "subjectname"))) {
		rt.setSv(f, "name", fmt("＀ burger", [rt.sv(f, "subjectname")]));
	} else {
		if (truthy(rt.sv(f, "subjectjob"))) {
			rt.setSv(f, "name", fmt("＀ burger", [rt.sv(f, "subjectjob")]));
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
	return f.dot;
}, true, { args: ["parts_list"] });

rt.type(5928, "/obj/item/weapon/reagent_containers/food/snacks/burger/corgi", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "corgi burger",
	desc: "You monster.",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/corgi/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:37)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/corgi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 1]));
	return f.dot;
});

rt.type(5929, "/obj/item/weapon/reagent_containers/food/snacks/burger/appendix", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	tastes: null,
	name: "appendix burger",
	desc: "Tastes like appendicitis.",
	icon_state: "appendixburger",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/appendix/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:42)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/appendix/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 6]));
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 4, "grass", 2]));
	return f.dot;
});

rt.type(5930, "/obj/item/weapon/reagent_containers/food/snacks/burger/fish", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	tastes: null,
	name: "fillet -o- carp sandwich",
	desc: "Almost like a carp is yelling somewhere... Give me back that fillet -o- carp, give me that carp.",
	icon_state: "fishburger",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/fish/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:50)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/fish/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 4, "fish", 4]));
	return f.dot;
});

rt.type(5931, "/obj/item/weapon/reagent_containers/food/snacks/burger/tofu", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	tastes: null,
	name: "tofu burger",
	desc: "What.. is that meat?",
	icon_state: "tofuburger",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/tofu/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:57)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/tofu/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 4, "tofu", 4]));
	return f.dot;
});

rt.type(5932, "/obj/item/weapon/reagent_containers/food/snacks/burger/roburger", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	tastes: null,
	name: "roburger",
	desc: "The lettuce is the only organic component. Beep.",
	icon_state: "roburger",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/roburger/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:64)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/roburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "nanomachines", 2, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 4, "lettuce", 2, "sludge", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "nanomachines", 5, "vitamin", 1]));
	return f.dot;
});

rt.type(5933, "/obj/item/weapon/reagent_containers/food/snacks/burger/roburgerbig", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	tastes: null,
	name: "roburger",
	desc: "This massive patty looks like poison. Beep.",
	icon_state: "roburger",
	volume: 120,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/roburgerbig/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:73)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/roburgerbig/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "nanomachines", 70, "vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 4, "lettuce", 2, "sludge", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "nanomachines", 70, "vitamin", 5]));
	return f.dot;
});

rt.type(5934, "/obj/item/weapon/reagent_containers/food/snacks/burger/xeno", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	tastes: null,
	name: "xenoburger",
	desc: "Smells caustic. Tastes like heresy.",
	icon_state: "xburger",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/xeno/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:81)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/xeno/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 6]));
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 4, "acid", 4]));
	return f.dot;
});

rt.type(5935, "/obj/item/weapon/reagent_containers/food/snacks/burger/bearger", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "bearger",
	desc: "Best served rawr.",
	icon_state: "bearger",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/bearger/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:88)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/bearger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 6]));
	return f.dot;
});

rt.type(5936, "/obj/item/weapon/reagent_containers/food/snacks/burger/clown", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "clown burger",
	desc: "This tastes funny...",
	icon_state: "clownburger",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/clown/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:94)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 6, "banana", 6]));
	return f.dot;
});

rt.type(5937, "/obj/item/weapon/reagent_containers/food/snacks/burger/mime", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "mime burger",
	desc: "Its taste defies language.",
	icon_state: "mimeburger",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/mime/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:100)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/mime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 6, "nothing", 6]));
	return f.dot;
});

rt.type(5938, "/obj/item/weapon/reagent_containers/food/snacks/burger/brain", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	tastes: null,
	name: "brainburger",
	desc: "A strange looking burger. It looks almost sentient.",
	icon_state: "brainburger",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/brain/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:106)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/brain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 6, "mannitol", 6, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 4, "brains", 2]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "mannitol", 5, "vitamin", 1]));
	return f.dot;
});

rt.type(5939, "/obj/item/weapon/reagent_containers/food/snacks/burger/ghost", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	tastes: null,
	name: "ghost burger",
	desc: "Too Spooky!",
	alpha: 125,
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/ghost/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:114)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/ghost/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 12]));
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 4, "ectoplasm", 2]));
	return f.dot;
});

rt.type(5940, "/obj/item/weapon/reagent_containers/food/snacks/burger/red", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "red burger",
	desc: "Perfect for hiding the fact it's burnt to a crisp.",
	icon_state: "cburger",
	color: "#DA0000FF",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/red/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:122)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/red/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["redcrayonpowder", 10, "vitamin", 5]));
	return f.dot;
});

rt.type(5941, "/obj/item/weapon/reagent_containers/food/snacks/burger/orange", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "orange burger",
	desc: "Contains 0% juice.",
	icon_state: "cburger",
	color: "#FF9300FF",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/orange/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:129)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/orange/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["orangecrayonpowder", 10, "vitamin", 5]));
	return f.dot;
});

rt.type(5942, "/obj/item/weapon/reagent_containers/food/snacks/burger/yellow", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "yellow burger",
	desc: "Bright to the last bite.",
	icon_state: "cburger",
	color: "#FFF200FF",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/yellow/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:136)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/yellow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["yellowcrayonpowder", 10, "vitamin", 5]));
	return f.dot;
});

rt.type(5943, "/obj/item/weapon/reagent_containers/food/snacks/burger/green", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "green burger",
	desc: "It's not tainted meat, it's painted meat!",
	icon_state: "cburger",
	color: "#A8E61DFF",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/green/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:143)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/green/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["greencrayonpowder", 10, "vitamin", 5]));
	return f.dot;
});

rt.type(5944, "/obj/item/weapon/reagent_containers/food/snacks/burger/blue", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "blue burger",
	desc: "Is this blue rare?",
	icon_state: "cburger",
	color: "#00B7EFFF",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/blue/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:150)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/blue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["bluecrayonpowder", 10, "vitamin", 5]));
	return f.dot;
});

rt.type(5945, "/obj/item/weapon/reagent_containers/food/snacks/burger/purple", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "purple burger",
	desc: "Regal and low class at the same time.",
	icon_state: "cburger",
	color: "#DA00FFFF",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/purple/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:157)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/purple/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["purplecrayonpowder", 10, "vitamin", 5]));
	return f.dot;
});

rt.type(5946, "/obj/item/weapon/reagent_containers/food/snacks/burger/spell", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	tastes: null,
	name: "spell burger",
	desc: "This is absolutely Ei Nath.",
	icon_state: "spellburger",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/spell/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:163)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/spell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 4, "magic", 2]));
	return f.dot;
});

rt.type(5947, "/obj/item/weapon/reagent_containers/food/snacks/burger/bigbite", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "big bite burger",
	desc: "Forget the Big Mac. THIS is the future!",
	icon_state: "bigbiteburger",
	list_reagents: null,
	w_class: 3,
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/bigbite/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:170)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/bigbite/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 6]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 10, "vitamin", 2]));
	return f.dot;
});

rt.type(5948, "/obj/item/weapon/reagent_containers/food/snacks/burger/jelly", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	tastes: null,
	name: "jelly burger",
	desc: "Culinary delight..?",
	icon_state: "jellyburger",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/jelly/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:178)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/jelly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 4, "jelly", 2]));
	return f.dot;
});

rt.type(5949, "/obj/item/weapon/reagent_containers/food/snacks/burger/jelly/slime", "/obj/item/weapon/reagent_containers/food/snacks/burger/jelly", {
	bonus_reagents: null,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/jelly/slime/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:181)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/jelly/slime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["slimejelly", 5, "vitamin", 5]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "slimejelly", 5, "vitamin", 1]));
	return f.dot;
});

rt.type(5950, "/obj/item/weapon/reagent_containers/food/snacks/burger/jelly/cherry", "/obj/item/weapon/reagent_containers/food/snacks/burger/jelly", {
	bonus_reagents: null,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/jelly/cherry/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:185)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/jelly/cherry/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["cherryjelly", 5, "vitamin", 5]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "cherryjelly", 5, "vitamin", 1]));
	return f.dot;
});

rt.type(5951, "/obj/item/weapon/reagent_containers/food/snacks/burger/superbite", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	bitesize: 7,
	tastes: null,
	name: "super bite burger",
	desc: "This is a mountain of a burger. FOOD!",
	icon_state: "superbiteburger",
	list_reagents: null,
	w_class: 3,
	volume: 100,
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/superbite/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:192)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/superbite/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 10]));
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 4, "type two diabetes", 10]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 40, "vitamin", 5]));
	return f.dot;
});

rt.type(5952, "/obj/item/weapon/reagent_containers/food/snacks/burger/fivealarm", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "five alarm burger",
	desc: "HOT! HOT!",
	icon_state: "fivealarmburger",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/fivealarm/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:203)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/fivealarm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 5]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "capsaicin", 5, "condensedcapsaicin", 5, "vitamin", 1]));
	return f.dot;
});

rt.type(5953, "/obj/item/weapon/reagent_containers/food/snacks/burger/rat", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "rat burger",
	desc: "Pretty much what you'd expect...",
	icon_state: "ratburger",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/rat/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:210)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/rat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	return f.dot;
});

rt.type(5954, "/obj/item/weapon/reagent_containers/food/snacks/burger/baseball", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	name: "home run baseball burger",
	desc: "It's still warm. The steam coming off of it looks like baseball.",
	icon_state: "baseball",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/baseball/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:216)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/baseball/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	return f.dot;
});

rt.type(5955, "/obj/item/weapon/reagent_containers/food/snacks/burger/baconburger", "/obj/item/weapon/reagent_containers/food/snacks/burger", {
	bonus_reagents: null,
	tastes: null,
	name: "bacon burger",
	desc: "The perfect combination of all things American.",
	icon_state: "baconburger",
});

// /obj/item/weapon/reagent_containers/food/snacks/burger/baconburger/proc/<init>  (code/modules/food_and_drinks/food/snacks_burgers.dm:222)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/burger/baconburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 8, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["bun", 4, "bacon", 2]));
	return f.dot;
});
