// From code/modules/food_and_drinks/drinks/drinks/bottle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5802, "/obj/item/weapon/reagent_containers/food/drinks/bottle", "/obj/item/weapon/reagent_containers/food/drinks", {
	duration: 13,
	isGlass: 1,
	amount_per_transfer_from_this: 10,
	volume: 100,
	throwforce: 15,
	item_state: "broken_beer",
}, { const: ["duration"] });

// /obj/item/weapon/reagent_containers/food/drinks/bottle/proc/throw_impact  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:16)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/proc/throw_impact", function* throw_impact(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "smash", live(f.args[0]), live(f.args[1]), 1);
	return f.dot;
}, true, { args: ["target", "thrower"], waitfor: false });

// /obj/item/weapon/reagent_containers/food/drinks/bottle/proc/smash  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:22)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/proc/smash", function* smash(f: Frame, target: Value, user: Value, ranged: Value) {
	let new_location: Value = null, B: Value = null, I: Value = null;
	f.vars = () => [target, user, ranged, new_location, B, I];
	if (live(ranged) === null) {
		ranged = 0;
	}
	new_location = rt.getStep(f, rt.sv(f, "loc"), 0);
	B = (yield* g.new_(f, T("/obj/item/weapon/broken_bottle"), [live(new_location)]));
	if (truthy(live(ranged))) {
		rt.setFv(f, "loc", live(B), live(new_location));
	} else {
		yield* g.callName(f, live(user), "drop_item", []);
		yield* g.callName(f, live(user), "put_in_active_hand", [live(B)]);
	}
	rt.setFv(f, "icon_state", live(B), rt.fv(f, "icon_state", live(f.src)));
	yield* g.callName(f, (I = (yield* g.new_(f, T("/icon"), [rt.rsc("icons/obj/drinks.dmi"), rt.fv(f, "icon_state", live(f.src))]))), "Blend", [rt.fv(f, "broken_outline", live(B)), 3, (yield* g.call(f, P("/proc/rand"), null, [5])), 1]);
	yield* g.callName(f, live(I), "SwapColor", ["#ff00dcff", "#00000000"]);
	rt.setFv(f, "icon", live(B), live(I));
	if (truthy(rt.sv(f, "isGlass"))) {
		if (truthy(rt.op(f, "Prob", [], [33]))) {
			yield* g.new_(f, T("/obj/item/weapon/shard"), [live(new_location)]);
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "shatter", 70, 1]);
	} else {
		rt.setFv(f, "name", live(B), "broken carton");
		rt.setFv(f, "force", live(B), 0);
		rt.setFv(f, "throwforce", live(B), 0);
		rt.setFv(f, "desc", live(B), "A carton with the bottom half burst open. Might give you a papercut.");
	}
	yield* g.callName(f, live(f.src), "transfer_fingerprints_to", [live(B)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/drinks/bottle/proc/attack  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:51)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/proc/attack", function* attack(f: Frame) {
	let affecting: Value = null, armor_block: Value = null, armor_duration: Value = null, H: Value = null, headarmor: Value = null, head_attack_message: Value = null;
	f.vars = () => [affecting, armor_block, armor_duration, H, headarmor, head_attack_message];
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	if ((!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm") || !truthy(rt.sv(f, "isGlass")))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	rt.setSv(f, "force", 15);
	affecting = rt.fv(f, "zone_selected", live(f.args[1]));
	armor_block = 0;
	armor_duration = 0;
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(f.args[0]);
		headarmor = 0;
		armor_block = (yield* g.callName(f, live(H), "run_armor_check", [live(affecting), "melee", "", "", rt.sv(f, "armour_penetration")]));
		if ((truthy((rt.istype(rt.fv(f, "head", live(H)), T("/obj/item/clothing/head")) ? 1 : 0)) && isEqual(live(affecting), "head"))) {
			if (truthy(rt.index(rt.gv(f, "armor", rt.fv(f, "head", live(H))), "melee"))) {
				headarmor = rt.index(rt.gv(f, "armor", rt.fv(f, "head", live(H))), "melee");
			} else {
				headarmor = 0;
			}
		} else {
			headarmor = 0;
		}
		armor_duration = add(subtract(13, live(headarmor)), rt.sv(f, "force"));
	} else {
		armor_block = (yield* g.callName(f, live(f.args[0]), "run_armor_check", [live(affecting), "melee"]));
		if (isEqual(live(affecting), "head")) {
			armor_duration = add(13, rt.sv(f, "force"));
		}
	}
	armor_block = (yield* g.call(f, P("/proc/min"), null, [90, live(armor_block)]));
	yield* g.callName(f, live(f.args[0]), "apply_damage", [rt.sv(f, "force"), "brute", live(affecting), live(armor_block)]);
	head_attack_message = "";
	if ((isEqual(live(affecting), "head") && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)))) {
		head_attack_message = " on the head";
		if (truthy(live(armor_duration))) {
			yield* g.callName(f, live(f.args[0]), "apply_effect", [(yield* g.call(f, P("/proc/min"), null, [live(armor_duration), 200])), "knockdown"]);
		}
	}
	if (!isEqual(live(f.args[0]), live(f.args[1]))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ has hit ＀＀ with a bottle of ＀!</span>", [live(f.args[1]), live(f.args[0]), live(head_attack_message), rt.fv(f, "name", live(f.src))]), fmt("<span class='userdanger'>＀ has hit ＀＀ with a bottle of ＀!</span>", [live(f.args[1]), live(f.args[0]), live(head_attack_message), rt.fv(f, "name", live(f.src))])]);
	} else {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ hits ＀self with a bottle of ＀＀!</span>", [live(f.args[0]), (yield* g.callName(f, live(f.args[0]), "p_them", [])), rt.fv(f, "name", live(f.src)), live(head_attack_message)]), fmt("<span class='userdanger'>＀ hits ＀self with a bottle of ＀＀!</span>", [live(f.args[0]), (yield* g.callName(f, live(f.args[0]), "p_them", [])), rt.fv(f, "name", live(f.src)), live(head_attack_message)])]);
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), "attacked", live(f.src)]);
	yield* g.srcCall(f, "SplashReagents", live(f.args[0]));
	yield* g.callName(f, live(f.src), "smash", [live(f.args[0]), live(f.args[1])]);
	return live(f.dot);
}, true, { args: ["target", "user"] });

rt.type(7485, "/obj/item/weapon/broken_bottle", "/obj/item/weapon", {
	broken_outline: null,
	throw_speed: 3,
	throw_range: 5,
	name: "Broken Bottle",
	desc: "A bottle with a sharp broken bottom.",
	icon: rt.rsc("icons/obj/drinks.dmi"),
	icon_state: "broken_bottle",
	force: 9,
	throwforce: 5,
	w_class: 1,
	item_state: "beer",
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
	sharpness: 1,
});

// /obj/item/weapon/broken_bottle/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:137)
rt.def("/obj/item/weapon/broken_bottle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("stabbed", "slashed", "attacked"));
	$0 = $0;
	rt.setSv(f, "broken_outline", rt.call(f, P("/proc/icon"), null, [rt.rsc("icons/obj/drinks.dmi"), "broken"]));
	return f.dot;
});

rt.type(5804, "/obj/item/weapon/reagent_containers/food/drinks/bottle/gin", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Griffeater Gin",
	desc: "A bottle of high quality gin, produced in the New London Space Station.",
	icon_state: "ginbottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/gin/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:144)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/gin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["gin", 100]));
	return f.dot;
});

rt.type(5805, "/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Uncle Git's Special Reserve",
	desc: "A premium single-malt whiskey, gently matured inside the tunnels of a nuclear shelter. TUNNEL WHISKEY RULES.",
	icon_state: "whiskeybottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:150)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["whiskey", 100]));
	return f.dot;
});

rt.type(5806, "/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Tunguska Triple Distilled",
	desc: "Aah, vodka. Prime choice of drink AND fuel by Russians worldwide.",
	icon_state: "vodkabottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/vodka/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:156)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["vodka", 100]));
	return f.dot;
});

rt.type(5807, "/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka/badminka", "/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka", {
	name: "Badminka Vodka",
	desc: "The label's written in Cyrillic. All you can make out is the name and a word that looks vaguely like 'Vodka'.",
	icon_state: "badminka",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/vodka/badminka/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:162)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka/badminka/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["vodka", 100]));
	return f.dot;
});

rt.type(5808, "/obj/item/weapon/reagent_containers/food/drinks/bottle/tequila", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Caccavo Guaranteed Quality Tequila",
	desc: "Made from premium petroleum distillates, pure thalidomide and other fine quality ingredients!",
	icon_state: "tequilabottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/tequila/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:168)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/tequila/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["tequila", 100]));
	return f.dot;
});

rt.type(5809, "/obj/item/weapon/reagent_containers/food/drinks/bottle/bottleofnothing", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Bottle of Nothing",
	desc: "A bottle filled with nothing.",
	icon_state: "bottleofnothing",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/bottleofnothing/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:174)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/bottleofnothing/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nothing", 100]));
	return f.dot;
});

rt.type(5810, "/obj/item/weapon/reagent_containers/food/drinks/bottle/patron", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Wrapp Artiste Patron",
	desc: "Silver laced tequila, served in space night clubs across the galaxy.",
	icon_state: "patronbottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/patron/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:180)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/patron/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["patron", 100]));
	return f.dot;
});

rt.type(5811, "/obj/item/weapon/reagent_containers/food/drinks/bottle/rum", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Captain Pete's Cuban Spiced Rum",
	desc: "This isn't just rum, oh no. It's practically GRIFF in a bottle.",
	icon_state: "rumbottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/rum/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:186)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/rum/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["rum", 100]));
	return f.dot;
});

rt.type(5812, "/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Flask of Holy Water",
	desc: "A flask of the chaplain's holy water.",
	icon_state: "holyflask",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/holywater/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:192)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["holywater", 100]));
	return f.dot;
});

rt.type(5813, "/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater/hell", "/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater", {
	desc: "A flask of holy water...it's been sitting in the Necropolis a while though.",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/holywater/hell/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:196)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater/hell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["hell_water", 100]));
	return f.dot;
});

rt.type(5814, "/obj/item/weapon/reagent_containers/food/drinks/bottle/vermouth", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Goldeneye Vermouth",
	desc: "Sweet, sweet dryness~",
	icon_state: "vermouthbottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/vermouth/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:202)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/vermouth/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["vermouth", 100]));
	return f.dot;
});

rt.type(5815, "/obj/item/weapon/reagent_containers/food/drinks/bottle/kahlua", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Robert Robust's Coffee Liqueur",
	desc: "A widely known, Mexican coffee-flavoured liqueur. In production since 1936, HONK.",
	icon_state: "kahluabottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/kahlua/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:208)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/kahlua/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["kahlua", 100]));
	return f.dot;
});

rt.type(5816, "/obj/item/weapon/reagent_containers/food/drinks/bottle/goldschlager", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "College Girl Goldschlager",
	desc: "Because they are the only ones who will drink 100 proof cinnamon schnapps.",
	icon_state: "goldschlagerbottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/goldschlager/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:214)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/goldschlager/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["goldschlager", 100]));
	return f.dot;
});

rt.type(5817, "/obj/item/weapon/reagent_containers/food/drinks/bottle/cognac", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Chateau De Baton Premium Cognac",
	desc: "A sweet and strongly alchoholic drink, made after numerous distillations and years of maturing. You might as well not scream 'SHITCURITY' this time.",
	icon_state: "cognacbottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/cognac/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:220)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/cognac/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["cognac", 100]));
	return f.dot;
});

rt.type(5818, "/obj/item/weapon/reagent_containers/food/drinks/bottle/wine", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Doublebeard Bearded Special Wine",
	desc: "A faint aura of unease and asspainery surrounds the bottle.",
	icon_state: "winebottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/wine/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:226)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/wine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["wine", 100]));
	return f.dot;
});

rt.type(5819, "/obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Extra-Strong Absinthe",
	desc: "An strong alcoholic drink brewed and distributed by",
	icon_state: "absinthebottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:232)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["absinthe", 100]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe/proc/New  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:235)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "redact");
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe/proc/redact  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:242)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe/proc/redact", function redact(f: Frame) {
	let shortname: Value = null, fullname: Value = null, removals: Value = null, chance: Value = null, final_fullname: Value = null, word: Value = null;
	let $0: any, $e: any;
	f.vars = () => [shortname, fullname, removals, chance, final_fullname, word, $0, $e];
	shortname = rt.call(f, P("/proc/pickweight"), null, [rt.alist(f, ["T&T", 1, "A&A", 1, "Generic", 1])]);
	fullname = null;
	$0 = live(shortname);
	if ($0 === "T&T") {
		fullname = "Teal and Tealer";
	} else if ($0 === "A&A") {
		fullname = "Ash and Asher";
	} else if ($0 === "Generic") {
		fullname = "Nanotrasen Cheap Imitations";
	}
	removals = rt.list("[REDACTED]", "[EXPLETIVE DELETED]", "[EXPUNGED]", "[INFORMATION ABOVE YOUR SECURITY CLEARANCE]", "[MOVE ALONG CITIZEN]", "[NOTHING TO SEE HERE]");
	if (truthy(rt.op(f, "Prob", [], [(chance = 50)]))) {
		shortname = rt.call(f, P("/proc/pick_n_take"), null, [live(removals)]);
	}
	final_fullname = rt.list();
	word = null;
	rt.forList(f, 0, rt.call(f, P("/proc/splittext"), null, [live(fullname), " "]));
	while (($e = rt.next(f, 0)) !== undefined) {
		word = $e;
		if (truthy(rt.op(f, "Prob", [], [live(chance)]))) {
			word = rt.call(f, P("/proc/pick_n_take"), null, [live(removals)]);
		}
		final_fullname = rt.modify(live(final_fullname), live(word), add);
	}
	rt.endFor(f, 0);
	fullname = rt.call(f, P("/proc/jointext"), null, [live(final_fullname), " "]);
	rt.setSv(f, "name", fmt("＀ ＀", [live(shortname), rt.sv(f, "name")]));
	rt.setSv(f, "desc", fmt("＀ ＀ Inc.", [rt.sv(f, "desc"), live(fullname)]));
	return f.dot;
});

rt.type(5821, "/obj/item/weapon/reagent_containers/food/drinks/bottle/lizardwine", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Bottle of lizard wine",
	desc: "An alcoholic beverage from Space China, made by infusing lizard tails in ethanol. Inexplicably popular among command staff.",
	icon_state: "lizardwine",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/lizardwine/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:285)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/lizardwine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["lizardwine", 100]));
	return f.dot;
});

rt.type(5822, "/obj/item/weapon/reagent_containers/food/drinks/bottle/hcider", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Jian Hard Cider",
	desc: "Apple juice for adults.",
	icon_state: "hcider",
	volume: 50,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/hcider/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:292)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/hcider/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["hcider", 50]));
	return f.dot;
});

rt.type(5823, "/obj/item/weapon/reagent_containers/food/drinks/bottle/grappa", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Phillipes well-aged Grappa",
	desc: "Bottle of Grappa.",
	icon_state: "grappabottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/grappa/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:298)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/grappa/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["grappa", 100]));
	return f.dot;
});

rt.type(5824, "/obj/item/weapon/reagent_containers/food/drinks/bottle/orangejuice", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	isGlass: 0,
	name: "Orange Juice",
	desc: "Full of vitamins and deliciousness!",
	icon_state: "orangejuice",
	item_state: "carton",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/orangejuice/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:308)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/orangejuice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["orangejuice", 100]));
	return f.dot;
});

rt.type(5825, "/obj/item/weapon/reagent_containers/food/drinks/bottle/cream", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	isGlass: 0,
	name: "Milk Cream",
	desc: "It's cream. Made from milk. What else did you think you'd find in there?",
	icon_state: "cream",
	item_state: "carton",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/cream/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:316)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/cream/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["cream", 100]));
	return f.dot;
});

rt.type(5826, "/obj/item/weapon/reagent_containers/food/drinks/bottle/tomatojuice", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	isGlass: 0,
	name: "Tomato Juice",
	desc: "Well, at least it LOOKS like tomato juice. You can't tell with all that redness.",
	icon_state: "tomatojuice",
	item_state: "carton",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/tomatojuice/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:324)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/tomatojuice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["tomatojuice", 100]));
	return f.dot;
});

rt.type(5827, "/obj/item/weapon/reagent_containers/food/drinks/bottle/limejuice", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	isGlass: 0,
	name: "Lime Juice",
	desc: "Sweet-sour goodness.",
	icon_state: "limejuice",
	item_state: "carton",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/limejuice/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:332)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/limejuice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["limejuice", 100]));
	return f.dot;
});

rt.type(5828, "/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	accelerants: null,
	active: 0,
	name: "molotov cocktail",
	desc: "A throwing weapon used to ignite things, typically filled with an accelerant. Recommended highly by rioters and revolutionaries. Light and toss.",
	icon_state: "vodkabottle",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:341)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "accelerants", rt.list(T("/datum/reagent/consumable/ethanol"), T("/datum/reagent/fuel"), T("/datum/reagent/clf3"), T("/datum/reagent/phlogiston"), T("/datum/reagent/napalm"), T("/datum/reagent/hellwater"), T("/datum/reagent/toxin/plasma"), T("/datum/reagent/toxin/spore_burning")));
	$0 = $0;
	rt.setSv(f, "list_reagents", rt.list());
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/CheckParts  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:346)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/CheckParts", function* CheckParts(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((B = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/drinks/bottle"), rt.sv(f, "contents"))))) {
		rt.setSv(f, "icon_state", rt.fv(f, "icon_state", live(B)));
		yield* g.callName(f, rt.fv(f, "reagents", live(B)), "copy_to", [live(f.src), 100]);
		if (!truthy(rt.fv(f, "isGlass", live(B)))) {
			rt.modSrcVar(f, "desc", " You're not sure if making this out of a carton was the brightest idea.", add);
			rt.setSv(f, "isGlass", 0);
		}
	}
	return live(f.dot);
}, true, { args: ["parts_list"] });

// /obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/throw_impact  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:358)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/throw_impact", function* throw_impact(f: Frame) {
	let firestarter: Value = null, R: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [firestarter, R, A, $e];
	firestarter = 0;
	R = null;
	rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		A = null;
		rt.forList(f, 1, rt.sv(f, "accelerants"));
		while (($e = rt.next(f, 1)) !== undefined) {
			A = $e;
			if (truthy(rt.op(f, "IsType", [], [live(R), live(A)]))) {
				firestarter = 1;
				break;
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	if ((truthy(live(firestarter)) && truthy(rt.sv(f, "active")))) {
		yield* g.callName(f, live(f.args[0]), "fire_act", []);
		yield* g.new_(f, T("/obj/effect/hotspot"), [rt.getStep(f, live(f.args[0]), 0)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "thrower"], waitfor: false });

// /obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/attackby  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:369)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/attackby", function attackby(f: Frame, I: Value, user: Value, params: Value) {
	let bombturf: Value = null, bombarea: Value = null, message: Value = null, counter: Value = null, target: Value = null, S: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [bombturf, bombarea, message, counter, target, S, A, $0, $1, $2];
	if (!(truthy(rt.callName(f, live(I), "is_hot", [])) && !truthy(rt.sv(f, "active")))) return f.dot;
	rt.setSv(f, "active", 1);
	bombturf = rt.getStep(f, live(f.src), 0);
	bombarea = rt.call(f, P("/proc/get_area"), null, [live(bombturf)]);
	$0 = fmt("＀＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(user)]), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)])]);
	$1 = rt.sv(f, "name");
	if (truthy(live(bombturf))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])]);
	} else {
		$2 = "nonexistent location";
	}
	rt.modGl("bombers", (message = fmt("＀ has primed a ＀ for detonation at ＀.", [$0, $1, fmt("＀", [$2])])), add);
	rt.call(f, P("/proc/message_admins"), null, [live(message)]);
	rt.call(f, P("/proc/log_game"), null, [fmt("＀ has primed a ＀ for detonation at ＀ ＀.", [rt.call(f, P("/proc/key_name"), null, [live(user)]), rt.sv(f, "name"), live(bombarea), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])])]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>You light ＀ on fire.</span>", [live(f.src)])]);
	rt.callSrc(f, "add_overlay", [rt.gl("fire_overlay")]);
	if (truthy(rt.sv(f, "isGlass"))) return f.dot;
	rt.spawnTail(f, 50, "/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/attackby: spawn at modules/food_and_drinks/drinks/drinks/bottle.dm:381", I, user, params, bombturf, bombarea, message, counter, target, S, A);
	return f.dot;
});

// a spawn(50) body of /obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/attackby, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/attackby: spawn at modules/food_and_drinks/drinks/drinks/bottle.dm:381", function* (f: Frame, I: Value, user: Value, params: Value, bombturf: Value, bombarea: Value, message: Value, counter: Value, target: Value, S: Value, A: Value) {
	f.vars = () => [I, user, params, bombturf, bombarea, message, counter, target, S, A];
	if (truthy(rt.sv(f, "active"))) {
		counter = null;
		target = rt.fv(f, "loc", live(f.src));
		counter = 0;
		while (rt.lt(live(counter), 2)) {
			if (truthy((rt.istype(live(target), T("/obj/item/weapon/storage")) ? 1 : 0))) {
				target = rt.gv(f, "loc", (S = live(target)));
			}
			counter = rt.inc(live(counter), 1);
		}
		if (truthy((rt.istype(live(target), T("/atom")) ? 1 : 0))) {
			yield* g.srcCall(f, "SplashReagents", (A = live(target)));
			yield* g.callName(f, live(A), "fire_act", []);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return null;
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/attack_self  (code/modules/food_and_drinks/drinks/drinks/bottle.dm:397)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!truthy(rt.sv(f, "active"))) return f.dot;
	if (!truthy(rt.sv(f, "isGlass"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>The flame's spread too far on it!</span>"]);
		return live(f.dot);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>You snuff out the flame on ＀.</span>", [live(f.src)])]);
	rt.callSrc(f, "cut_overlay", [rt.gl("fire_overlay")]);
	rt.setSv(f, "active", 0);
	return f.dot;
});
