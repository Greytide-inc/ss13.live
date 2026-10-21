// From code/game/objects/effects/spawners/bundle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11841, "/obj/effect/spawner/bundle", "/obj/effect/spawner", {
	items: null,
	name: "bundle spawner",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x2",
	color: "#00FF00",
});

// /obj/effect/spawner/bundle/proc/Initialize  (code/game/objects/effects/spawners/bundle.dm:10)  may sleep
rt.def("/obj/effect/spawner/bundle/proc/Initialize", function* Initialize(f: Frame) {
	let _T: Value = null, path: Value = null;
	let $e: any;
	f.vars = () => [_T, path, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "items")) && truthy(rt.len(f, rt.sv(f, "items"))))) {
		_T = rt.getStep(f, live(f.src), 0);
		path = null;
		rt.forList(f, 0, rt.sv(f, "items"));
		while (($e = rt.next(f, 0)) !== undefined) {
			path = $e;
			yield* g.new_(f, live(path), [live(_T)]);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11843, "/obj/effect/spawner/bundle/costume/chicken", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "chicken costume spawner",
});

// /obj/effect/spawner/bundle/costume/chicken/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:19)
rt.def("/obj/effect/spawner/bundle/costume/chicken/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/suit/chickensuit"), T("/obj/item/clothing/head/chicken"), T("/obj/item/weapon/reagent_containers/food/snacks/egg")));
	return f.dot;
});

rt.type(11844, "/obj/effect/spawner/bundle/costume/gladiator", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "gladitator costume spawner",
});

// /obj/effect/spawner/bundle/costume/gladiator/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:26)
rt.def("/obj/effect/spawner/bundle/costume/gladiator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/under/gladiator"), T("/obj/item/clothing/head/helmet/gladiator")));
	return f.dot;
});

rt.type(11845, "/obj/effect/spawner/bundle/costume/madscientist", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "mad scientist costume spawner",
});

// /obj/effect/spawner/bundle/costume/madscientist/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:32)
rt.def("/obj/effect/spawner/bundle/costume/madscientist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/under/gimmick/rank/captain/suit"), T("/obj/item/clothing/head/flatcap"), T("/obj/item/clothing/suit/toggle/labcoat/mad")));
	return f.dot;
});

rt.type(11846, "/obj/effect/spawner/bundle/costume/elpresidente", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "el presidente costume spawner",
});

// /obj/effect/spawner/bundle/costume/elpresidente/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:39)
rt.def("/obj/effect/spawner/bundle/costume/elpresidente/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/under/gimmick/rank/captain/suit"), T("/obj/item/clothing/head/flatcap"), T("/obj/item/clothing/mask/cigarette/cigar/havana"), T("/obj/item/clothing/shoes/jackboots")));
	return f.dot;
});

rt.type(11847, "/obj/effect/spawner/bundle/costume/nyangirl", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "nyangirl costume spawner",
});

// /obj/effect/spawner/bundle/costume/nyangirl/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:47)
rt.def("/obj/effect/spawner/bundle/costume/nyangirl/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/under/schoolgirl"), T("/obj/item/clothing/head/kitty"), T("/obj/item/clothing/glasses/sunglasses/blindfold")));
	return f.dot;
});

rt.type(11848, "/obj/effect/spawner/bundle/costume/maid", "/obj/effect/spawner/bundle/costume", {
	name: "maid costume spawner",
	items: null,
});

// /obj/effect/spawner/bundle/costume/maid/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:54)
rt.def("/obj/effect/spawner/bundle/costume/maid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/under/skirt/black"), T("/obj/effect/spawner/lootdrop/minor/beret_or_rabbitears"), T("/obj/item/clothing/glasses/sunglasses/blindfold")));
	return f.dot;
});

rt.type(11849, "/obj/effect/spawner/bundle/costume/butler", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "butler costume spawner",
});

// /obj/effect/spawner/bundle/costume/butler/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:62)
rt.def("/obj/effect/spawner/bundle/costume/butler/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/accessory/waistcoat"), T("/obj/item/clothing/under/suit_jacket"), T("/obj/item/clothing/head/that")));
	return f.dot;
});

rt.type(11850, "/obj/effect/spawner/bundle/costume/highlander", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "highlander costume spawner",
});

// /obj/effect/spawner/bundle/costume/highlander/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:69)
rt.def("/obj/effect/spawner/bundle/costume/highlander/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/under/kilt"), T("/obj/item/clothing/head/beret")));
	return f.dot;
});

rt.type(11851, "/obj/effect/spawner/bundle/costume/prig", "/obj/effect/spawner/bundle/costume", {
	name: "prig costume spawner",
	items: null,
});

// /obj/effect/spawner/bundle/costume/prig/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:75)
rt.def("/obj/effect/spawner/bundle/costume/prig/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/accessory/waistcoat"), T("/obj/item/clothing/glasses/monocle"), T("/obj/effect/spawner/lootdrop/minor/bowler_or_that"), T("/obj/item/clothing/shoes/sneakers/black"), T("/obj/item/weapon/cane"), T("/obj/item/clothing/under/sl_suit"), T("/obj/item/clothing/mask/fakemoustache")));
	return f.dot;
});

rt.type(11852, "/obj/effect/spawner/bundle/costume/plaguedoctor", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "plague doctor costume spawner",
});

// /obj/effect/spawner/bundle/costume/plaguedoctor/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:86)
rt.def("/obj/effect/spawner/bundle/costume/plaguedoctor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/suit/bio_suit/plaguedoctorsuit"), T("/obj/item/clothing/head/plaguedoctorhat"), T("/obj/item/clothing/mask/gas/plaguedoctor")));
	return f.dot;
});

rt.type(11853, "/obj/effect/spawner/bundle/costume/nightowl", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "night owl costume spawner",
});

// /obj/effect/spawner/bundle/costume/nightowl/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:93)
rt.def("/obj/effect/spawner/bundle/costume/nightowl/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/suit/toggle/owlwings"), T("/obj/item/clothing/under/owl"), T("/obj/item/clothing/mask/gas/owl_mask")));
	return f.dot;
});

rt.type(11854, "/obj/effect/spawner/bundle/costume/griffin", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "griffin costume spawner",
});

// /obj/effect/spawner/bundle/costume/griffin/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:100)
rt.def("/obj/effect/spawner/bundle/costume/griffin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/suit/toggle/owlwings/griffinwings"), T("/obj/item/clothing/shoes/griffin"), T("/obj/item/clothing/under/griffin"), T("/obj/item/clothing/head/griffin")));
	return f.dot;
});

rt.type(11855, "/obj/effect/spawner/bundle/costume/waiter", "/obj/effect/spawner/bundle/costume", {
	name: "waiter costume spawner",
	items: null,
});

// /obj/effect/spawner/bundle/costume/waiter/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:108)
rt.def("/obj/effect/spawner/bundle/costume/waiter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/under/waiter"), T("/obj/effect/spawner/lootdrop/minor/kittyears_or_rabbitears"), T("/obj/item/clothing/suit/apron")));
	return f.dot;
});

rt.type(11856, "/obj/effect/spawner/bundle/costume/pirate", "/obj/effect/spawner/bundle/costume", {
	name: "pirate costume spawner",
	items: null,
});

// /obj/effect/spawner/bundle/costume/pirate/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:115)
rt.def("/obj/effect/spawner/bundle/costume/pirate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/under/pirate"), T("/obj/item/clothing/suit/pirate"), T("/obj/effect/spawner/lootdrop/minor/pirate_or_bandana"), T("/obj/item/clothing/glasses/eyepatch")));
	return f.dot;
});

rt.type(11857, "/obj/effect/spawner/bundle/costume/commie", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "commie costume spawner",
});

// /obj/effect/spawner/bundle/costume/commie/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:123)
rt.def("/obj/effect/spawner/bundle/costume/commie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/under/soviet"), T("/obj/item/clothing/head/ushanka")));
	return f.dot;
});

rt.type(11858, "/obj/effect/spawner/bundle/costume/imperium_monk", "/obj/effect/spawner/bundle/costume", {
	name: "imperium monk costume spawner",
	items: null,
});

// /obj/effect/spawner/bundle/costume/imperium_monk/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:129)
rt.def("/obj/effect/spawner/bundle/costume/imperium_monk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/suit/imperium_monk"), T("/obj/effect/spawner/lootdrop/minor/twentyfive_percent_cyborg_mask")));
	return f.dot;
});

rt.type(11859, "/obj/effect/spawner/bundle/costume/holiday_priest", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "holiday priest costume spawner",
});

// /obj/effect/spawner/bundle/costume/holiday_priest/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:135)
rt.def("/obj/effect/spawner/bundle/costume/holiday_priest/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/suit/holidaypriest")));
	return f.dot;
});

rt.type(11860, "/obj/effect/spawner/bundle/costume/marisawizard", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "marisa wizard costume spawner",
});

// /obj/effect/spawner/bundle/costume/marisawizard/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:140)
rt.def("/obj/effect/spawner/bundle/costume/marisawizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/shoes/sandal/marisa"), T("/obj/item/clothing/head/wizard/marisa/fake"), T("/obj/item/clothing/suit/wizrobe/marisa/fake")));
	return f.dot;
});

rt.type(11861, "/obj/effect/spawner/bundle/costume/cutewitch", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "cute witch costume spawner",
});

// /obj/effect/spawner/bundle/costume/cutewitch/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:147)
rt.def("/obj/effect/spawner/bundle/costume/cutewitch/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/under/sundress"), T("/obj/item/clothing/head/witchwig"), T("/obj/item/weapon/staff/broom")));
	return f.dot;
});

rt.type(11862, "/obj/effect/spawner/bundle/costume/wizard", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "wizard costume spawner",
});

// /obj/effect/spawner/bundle/costume/wizard/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:154)
rt.def("/obj/effect/spawner/bundle/costume/wizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/shoes/sandal"), T("/obj/item/clothing/suit/wizrobe/fake"), T("/obj/item/clothing/head/wizard/fake"), T("/obj/item/weapon/staff")));
	return f.dot;
});

rt.type(11863, "/obj/effect/spawner/bundle/costume/sexyclown", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "sexy clown costume spawner",
});

// /obj/effect/spawner/bundle/costume/sexyclown/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:162)
rt.def("/obj/effect/spawner/bundle/costume/sexyclown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/mask/gas/sexyclown"), T("/obj/item/clothing/under/rank/clown/sexy")));
	return f.dot;
});

rt.type(11864, "/obj/effect/spawner/bundle/costume/sexymime", "/obj/effect/spawner/bundle/costume", {
	items: null,
	name: "sexy mime costume spawner",
});

// /obj/effect/spawner/bundle/costume/sexymime/proc/<init>  (code/game/objects/effects/spawners/bundle.dm:168)
rt.def("/obj/effect/spawner/bundle/costume/sexymime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items", rt.list(T("/obj/item/clothing/mask/gas/sexymime"), T("/obj/item/clothing/under/sexymime")));
	return f.dot;
});
