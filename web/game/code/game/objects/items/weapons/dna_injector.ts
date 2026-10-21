// From code/game/objects/items/weapons/dna_injector.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7175, "/obj/item/weapon/dnainjector", "/obj/item/weapon", {
	damage_coeff: 1,
	fields: null,
	add_mutations: null,
	remove_mutations: null,
	add_mutations_static: null,
	remove_mutations_static: null,
	used: 0,
	throw_speed: 3,
	throw_range: 5,
	name: "１DNA injector",
	desc: "This injects the person with DNA.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "dnainjector",
	w_class: 1,
	origin_tech: "biotech=1",
});

// /obj/item/weapon/dnainjector/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:13)
rt.def("/obj/item/weapon/dnainjector/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations", rt.list());
	$0 = $0;
	rt.setSv(f, "remove_mutations", rt.list());
	$0 = $0;
	rt.setSv(f, "add_mutations_static", rt.list());
	$0 = $0;
	rt.setSv(f, "remove_mutations_static", rt.list());
	return f.dot;
});

// /obj/item/weapon/dnainjector/proc/attack_paw  (code/game/objects/items/weapons/dna_injector.dm:22)  may sleep
rt.def("/obj/item/weapon/dnainjector/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/item/weapon/dnainjector/proc/prepare  (code/game/objects/items/weapons/dna_injector.dm:25)
rt.def("/obj/item/weapon/dnainjector/proc/prepare", function prepare(f: Frame) {
	let mut_key: Value = null;
	let $e: any;
	f.vars = () => [mut_key, $e];
	mut_key = null;
	rt.forList(f, 0, rt.sv(f, "add_mutations_static"));
	while (($e = rt.next(f, 0)) !== undefined) {
		mut_key = $e;
		rt.callName(f, rt.sv(f, "add_mutations"), "Add", [rt.index(rt.gl("mutations_list"), live(mut_key))]);
	}
	rt.endFor(f, 0);
	mut_key = null;
	rt.forList(f, 0, rt.sv(f, "remove_mutations_static"));
	while (($e = rt.next(f, 0)) !== undefined) {
		mut_key = $e;
		rt.callName(f, rt.sv(f, "remove_mutations"), "Add", [rt.index(rt.gl("mutations_list"), live(mut_key))]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/dnainjector/proc/inject  (code/game/objects/items/weapons/dna_injector.dm:31)  may sleep
rt.def("/obj/item/weapon/dnainjector/proc/inject", function* inject(f: Frame, M: Value, user: Value) {
	let log_msg: Value = null, HM: Value = null;
	let $e: any;
	f.vars = () => [M, user, log_msg, HM, $e];
	yield* g.srcCall(f, "prepare");
	if (((truthy((yield* g.callName(f, live(M), "has_dna", []))) && !truthy((rt.isIn(f, 9, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(M))))) ? 1 : 0))) && !truthy(rt.bitAnd(rt.fv(f, "disabilities", live(M)), 128)))) {
		rt.modField(f, live(M), "radiation", (yield* g.call(f, P("/proc/rand"), null, [divide(20, rt.power(rt.sv(f, "damage_coeff"), 2)), divide(50, rt.power(rt.sv(f, "damage_coeff"), 2))])), add);
		log_msg = fmt("＀ injected ＀ with the ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)])), rt.sv(f, "name")]);
		HM = null;
		rt.forList(f, 0, rt.sv(f, "remove_mutations"), T("/datum/mutation/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			HM = $e;
			yield* g.callName(f, live(HM), "force_lose", [live(M)]);
		}
		rt.endFor(f, 0);
		HM = null;
		rt.forList(f, 0, rt.sv(f, "add_mutations"), T("/datum/mutation/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			HM = $e;
			if (isEqual(rt.fv(f, "name", live(HM)), "Monkified")) {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ injected ＀ with the ＀ <span class='danger'>(MONKEY)</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)])), rt.sv(f, "name")])]);
				log_msg = rt.modify(live(log_msg), " (MONKEY)", add);
			}
			yield* g.callName(f, live(HM), "force_give", [live(M)]);
		}
		rt.endFor(f, 0);
		if (truthy(rt.sv(f, "fields"))) {
			if (((truthy(rt.at(rt.sv(f, "fields"), "name")) && truthy(rt.at(rt.sv(f, "fields"), "UE"))) && truthy(rt.at(rt.sv(f, "fields"), "blood_type")))) {
				rt.setFv(f, "real_name", live(M), rt.at(rt.sv(f, "fields"), "name"));
				rt.setFv(f, "unique_enzymes", rt.fv(f, "dna", live(M)), rt.at(rt.sv(f, "fields"), "UE"));
				rt.setFv(f, "name", live(M), rt.fv(f, "real_name", live(M)));
				rt.setFv(f, "blood_type", rt.fv(f, "dna", live(M)), rt.at(rt.sv(f, "fields"), "blood_type"));
			}
			if (truthy(rt.at(rt.sv(f, "fields"), "UI"))) {
				rt.setFv(f, "uni_identity", rt.fv(f, "dna", live(M)), (yield* g.call(f, P("/proc/merge_text"), null, [rt.gv(f, "uni_identity", rt.fv(f, "dna", live(M))), rt.at(rt.sv(f, "fields"), "UI")])));
				yield* g.callName(f, live(M), "updateappearance", ["mutations_overlay_update", 1], rt.Args.Named);
			}
		}
		yield* g.call(f, P("/proc/log_attack"), null, [live(log_msg)]);
		return 1;
	}
	return 0;
}, true);

// /obj/item/weapon/dnainjector/proc/attack  (code/game/objects/items/weapons/dna_injector.dm:57)  may sleep
rt.def("/obj/item/weapon/dnainjector/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let humantarget: Value = null;
	f.vars = () => [target, user, humantarget];
	if (!truthy((yield* g.callName(f, live(user), "IsAdvancedToolUser", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "used"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This injector is used up!</span>"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, (humantarget = live(target)), "can_inject", [live(user), 1])))) {
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "attempted to inject", live(f.src)]);
	if (!isEqual(live(target), live(user))) {
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ is trying to inject ＀ with ＀!</span>", [live(user), live(target), live(f.src)]), fmt("<span class='userdanger'>＀ is trying to inject ＀ with ＀!</span>", [live(user), live(target), live(f.src)])]);
		if ((!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(target)]))) || truthy(rt.sv(f, "used")))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ injects ＀ with the syringe with ＀!", [live(user), live(target), live(f.src)]), fmt("<span class='userdanger'>＀ injects ＀ with the syringe with ＀!", [live(user), live(target), live(f.src)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You inject yourself with ＀.</span>", [live(f.src)])]);
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "injected", live(f.src)]);
	if (!truthy((yield* g.srcCall(f, "inject", live(target), live(user))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>It appears that ＀ does not have compatible DNA.</span>", [live(target)])]);
	}
	rt.setSv(f, "used", 1);
	rt.setSv(f, "icon_state", "dnainjector0");
	rt.modSrcVar(f, "desc", " This one is used up.", add);
	return f.dot;
}, true);

rt.type(7176, "/obj/item/weapon/dnainjector/antihulk", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Hulk)",
	desc: "Cures green skin.",
});

// /obj/item/weapon/dnainjector/antihulk/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:92)
rt.def("/obj/item/weapon/dnainjector/antihulk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Hulk"));
	return f.dot;
});

rt.type(7177, "/obj/item/weapon/dnainjector/hulkmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Hulk)",
	desc: "This will make you big and strong, but give you a bad skin condition.",
});

// /obj/item/weapon/dnainjector/hulkmut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:97)
rt.def("/obj/item/weapon/dnainjector/hulkmut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Hulk"));
	return f.dot;
});

rt.type(7178, "/obj/item/weapon/dnainjector/xraymut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Xray)",
	desc: "Finally you can see what the Captain does.",
});

// /obj/item/weapon/dnainjector/xraymut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:102)
rt.def("/obj/item/weapon/dnainjector/xraymut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("X Ray Vision"));
	return f.dot;
});

rt.type(7179, "/obj/item/weapon/dnainjector/antixray", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Xray)",
	desc: "It will make you see harder.",
});

// /obj/item/weapon/dnainjector/antixray/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:107)
rt.def("/obj/item/weapon/dnainjector/antixray/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("X Ray Vision"));
	return f.dot;
});

rt.type(7180, "/obj/item/weapon/dnainjector/antiglasses", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Glasses)",
	desc: "Toss away those glasses!",
});

// /obj/item/weapon/dnainjector/antiglasses/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:113)
rt.def("/obj/item/weapon/dnainjector/antiglasses/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Near Sightness"));
	return f.dot;
});

rt.type(7181, "/obj/item/weapon/dnainjector/glassesmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Glasses)",
	desc: "Will make you need dorkish glasses.",
});

// /obj/item/weapon/dnainjector/glassesmut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:118)
rt.def("/obj/item/weapon/dnainjector/glassesmut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Near Sightness"));
	return f.dot;
});

rt.type(7182, "/obj/item/weapon/dnainjector/epimut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Epi.)",
	desc: "Shake shake shake the room!",
});

// /obj/item/weapon/dnainjector/epimut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:123)
rt.def("/obj/item/weapon/dnainjector/epimut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Epilepsy"));
	return f.dot;
});

rt.type(7183, "/obj/item/weapon/dnainjector/antiepi", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Epi.)",
	desc: "Will fix you up from shaking the room.",
});

// /obj/item/weapon/dnainjector/antiepi/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:128)
rt.def("/obj/item/weapon/dnainjector/antiepi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Epilepsy"));
	return f.dot;
});

rt.type(7184, "/obj/item/weapon/dnainjector/anticough", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Cough)",
	desc: "Will stop that aweful noise.",
});

// /obj/item/weapon/dnainjector/anticough/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:133)
rt.def("/obj/item/weapon/dnainjector/anticough/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Cough"));
	return f.dot;
});

rt.type(7185, "/obj/item/weapon/dnainjector/coughmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Cough)",
	desc: "Will bring forth a sound of horror from your throat.",
});

// /obj/item/weapon/dnainjector/coughmut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:138)
rt.def("/obj/item/weapon/dnainjector/coughmut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Cough"));
	return f.dot;
});

rt.type(7186, "/obj/item/weapon/dnainjector/antidwarf", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Dwarfism)",
	desc: "Helps you grow big and strong.",
});

// /obj/item/weapon/dnainjector/antidwarf/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:143)
rt.def("/obj/item/weapon/dnainjector/antidwarf/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Dwarfism"));
	return f.dot;
});

rt.type(7187, "/obj/item/weapon/dnainjector/dwarf", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Dwarfism)",
	desc: "It's a small world after all.",
});

// /obj/item/weapon/dnainjector/dwarf/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:148)
rt.def("/obj/item/weapon/dnainjector/dwarf/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Dwarfism"));
	return f.dot;
});

rt.type(7188, "/obj/item/weapon/dnainjector/clumsymut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Clumsy)",
	desc: "Makes clown minions.",
});

// /obj/item/weapon/dnainjector/clumsymut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:153)
rt.def("/obj/item/weapon/dnainjector/clumsymut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Clumsiness"));
	return f.dot;
});

rt.type(7189, "/obj/item/weapon/dnainjector/anticlumsy", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Clumsy)",
	desc: "Apply this for Security Clown.",
});

// /obj/item/weapon/dnainjector/anticlumsy/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:158)
rt.def("/obj/item/weapon/dnainjector/anticlumsy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Clumsiness"));
	return f.dot;
});

rt.type(7190, "/obj/item/weapon/dnainjector/antitour", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Tour.)",
	desc: "Will cure tourrets.",
});

// /obj/item/weapon/dnainjector/antitour/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:163)
rt.def("/obj/item/weapon/dnainjector/antitour/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Tourettes Syndrome"));
	return f.dot;
});

rt.type(7191, "/obj/item/weapon/dnainjector/tourmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Tour.)",
	desc: "Gives you a nasty case of Tourette's.",
});

// /obj/item/weapon/dnainjector/tourmut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:168)
rt.def("/obj/item/weapon/dnainjector/tourmut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Tourettes Syndrome"));
	return f.dot;
});

rt.type(7192, "/obj/item/weapon/dnainjector/stuttmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Stutt.)",
	desc: "Makes you s-s-stuttterrr",
});

// /obj/item/weapon/dnainjector/stuttmut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:173)
rt.def("/obj/item/weapon/dnainjector/stuttmut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Nervousness"));
	return f.dot;
});

rt.type(7193, "/obj/item/weapon/dnainjector/antistutt", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Stutt.)",
	desc: "Fixes that speaking impairment.",
});

// /obj/item/weapon/dnainjector/antistutt/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:178)
rt.def("/obj/item/weapon/dnainjector/antistutt/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Nervousness"));
	return f.dot;
});

rt.type(7194, "/obj/item/weapon/dnainjector/antifire", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Fire)",
	desc: "Cures fire.",
});

// /obj/item/weapon/dnainjector/antifire/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:183)
rt.def("/obj/item/weapon/dnainjector/antifire/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Cold Resistance"));
	return f.dot;
});

rt.type(7195, "/obj/item/weapon/dnainjector/firemut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Fire)",
	desc: "Gives you fire.",
});

// /obj/item/weapon/dnainjector/firemut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:188)
rt.def("/obj/item/weapon/dnainjector/firemut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Cold Resistance"));
	return f.dot;
});

rt.type(7196, "/obj/item/weapon/dnainjector/blindmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Blind)",
	desc: "Makes you not see anything.",
});

// /obj/item/weapon/dnainjector/blindmut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:193)
rt.def("/obj/item/weapon/dnainjector/blindmut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Blindness"));
	return f.dot;
});

rt.type(7197, "/obj/item/weapon/dnainjector/antiblind", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Blind)",
	desc: "IT'S A MIRACLE!!!",
});

// /obj/item/weapon/dnainjector/antiblind/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:198)
rt.def("/obj/item/weapon/dnainjector/antiblind/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Blindness"));
	return f.dot;
});

rt.type(7198, "/obj/item/weapon/dnainjector/antitele", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Tele.)",
	desc: "Will make you not able to control your mind.",
});

// /obj/item/weapon/dnainjector/antitele/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:203)
rt.def("/obj/item/weapon/dnainjector/antitele/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Telekinesis"));
	return f.dot;
});

rt.type(7199, "/obj/item/weapon/dnainjector/telemut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Tele.)",
	desc: "Super brain man!",
});

// /obj/item/weapon/dnainjector/telemut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:208)
rt.def("/obj/item/weapon/dnainjector/telemut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Telekinesis"));
	return f.dot;
});

rt.type(7201, "/obj/item/weapon/dnainjector/deafmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Deaf)",
	desc: "Sorry, what did you say?",
});

// /obj/item/weapon/dnainjector/deafmut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:217)
rt.def("/obj/item/weapon/dnainjector/deafmut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Deafness"));
	return f.dot;
});

rt.type(7202, "/obj/item/weapon/dnainjector/antideaf", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Deaf)",
	desc: "Will make you hear once more.",
});

// /obj/item/weapon/dnainjector/antideaf/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:222)
rt.def("/obj/item/weapon/dnainjector/antideaf/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Deafness"));
	return f.dot;
});

rt.type(7203, "/obj/item/weapon/dnainjector/h2m", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Human > Monkey)",
	desc: "Will make you a flea bag.",
});

// /obj/item/weapon/dnainjector/h2m/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:227)
rt.def("/obj/item/weapon/dnainjector/h2m/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Monkified"));
	return f.dot;
});

rt.type(7204, "/obj/item/weapon/dnainjector/m2h", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Monkey > Human)",
	desc: "Will make you...less hairy.",
});

// /obj/item/weapon/dnainjector/m2h/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:232)
rt.def("/obj/item/weapon/dnainjector/m2h/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Monkified"));
	return f.dot;
});

rt.type(7205, "/obj/item/weapon/dnainjector/antichameleon", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Chameleon)",
});

// /obj/item/weapon/dnainjector/antichameleon/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:236)
rt.def("/obj/item/weapon/dnainjector/antichameleon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Chameleon"));
	return f.dot;
});

rt.type(7206, "/obj/item/weapon/dnainjector/chameleonmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Chameleon)",
});

// /obj/item/weapon/dnainjector/chameleonmut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:240)
rt.def("/obj/item/weapon/dnainjector/chameleonmut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Chameleon"));
	return f.dot;
});

rt.type(7207, "/obj/item/weapon/dnainjector/antiwacky", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Wacky)",
});

// /obj/item/weapon/dnainjector/antiwacky/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:244)
rt.def("/obj/item/weapon/dnainjector/antiwacky/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Wacky"));
	return f.dot;
});

rt.type(7208, "/obj/item/weapon/dnainjector/wackymut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Wacky)",
});

// /obj/item/weapon/dnainjector/wackymut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:248)
rt.def("/obj/item/weapon/dnainjector/wackymut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Wacky"));
	return f.dot;
});

rt.type(7209, "/obj/item/weapon/dnainjector/antimute", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Mute)",
});

// /obj/item/weapon/dnainjector/antimute/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:252)
rt.def("/obj/item/weapon/dnainjector/antimute/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Mute"));
	return f.dot;
});

rt.type(7210, "/obj/item/weapon/dnainjector/mutemut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Mute)",
});

// /obj/item/weapon/dnainjector/mutemut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:256)
rt.def("/obj/item/weapon/dnainjector/mutemut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Mute"));
	return f.dot;
});

rt.type(7211, "/obj/item/weapon/dnainjector/antismile", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Smile)",
});

// /obj/item/weapon/dnainjector/antismile/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:260)
rt.def("/obj/item/weapon/dnainjector/antismile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Smile"));
	return f.dot;
});

rt.type(7212, "/obj/item/weapon/dnainjector/smilemut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Smile)",
});

// /obj/item/weapon/dnainjector/smilemut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:264)
rt.def("/obj/item/weapon/dnainjector/smilemut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Smile"));
	return f.dot;
});

rt.type(7213, "/obj/item/weapon/dnainjector/unintelligablemut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Unintelligable)",
});

// /obj/item/weapon/dnainjector/unintelligablemut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:268)
rt.def("/obj/item/weapon/dnainjector/unintelligablemut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Unintelligable"));
	return f.dot;
});

rt.type(7214, "/obj/item/weapon/dnainjector/antiunintelligable", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Unintelligable)",
});

// /obj/item/weapon/dnainjector/antiunintelligable/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:272)
rt.def("/obj/item/weapon/dnainjector/antiunintelligable/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Unintelligable"));
	return f.dot;
});

rt.type(7215, "/obj/item/weapon/dnainjector/swedishmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Swedish)",
});

// /obj/item/weapon/dnainjector/swedishmut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:276)
rt.def("/obj/item/weapon/dnainjector/swedishmut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Swedish"));
	return f.dot;
});

rt.type(7216, "/obj/item/weapon/dnainjector/antiswedish", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Swedish)",
});

// /obj/item/weapon/dnainjector/antiswedish/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:280)
rt.def("/obj/item/weapon/dnainjector/antiswedish/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Swedish"));
	return f.dot;
});

rt.type(7217, "/obj/item/weapon/dnainjector/chavmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Chav)",
});

// /obj/item/weapon/dnainjector/chavmut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:284)
rt.def("/obj/item/weapon/dnainjector/chavmut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Chav"));
	return f.dot;
});

rt.type(7218, "/obj/item/weapon/dnainjector/antichav", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Chav)",
});

// /obj/item/weapon/dnainjector/antichav/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:288)
rt.def("/obj/item/weapon/dnainjector/antichav/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Chav"));
	return f.dot;
});

rt.type(7219, "/obj/item/weapon/dnainjector/elvismut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Elvis)",
});

// /obj/item/weapon/dnainjector/elvismut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:292)
rt.def("/obj/item/weapon/dnainjector/elvismut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Elvis"));
	return f.dot;
});

rt.type(7220, "/obj/item/weapon/dnainjector/antielvis", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Elvis)",
});

// /obj/item/weapon/dnainjector/antielvis/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:296)
rt.def("/obj/item/weapon/dnainjector/antielvis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Elvis"));
	return f.dot;
});

rt.type(7221, "/obj/item/weapon/dnainjector/lasereyesmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Laser Eyes)",
});

// /obj/item/weapon/dnainjector/lasereyesmut/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:300)
rt.def("/obj/item/weapon/dnainjector/lasereyesmut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Laser Eyes"));
	return f.dot;
});

rt.type(7222, "/obj/item/weapon/dnainjector/antilasereyes", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Laser Eyes)",
});

// /obj/item/weapon/dnainjector/antilasereyes/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:304)
rt.def("/obj/item/weapon/dnainjector/antilasereyes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "remove_mutations_static", rt.list("Laser Eyes"));
	return f.dot;
});

rt.type(7223, "/obj/item/weapon/dnainjector/timed", "/obj/item/weapon/dnainjector", {
	duration: 600,
});

// /obj/item/weapon/dnainjector/timed/proc/inject  (code/game/objects/items/weapons/dna_injector.dm:310)  may sleep
rt.def("/obj/item/weapon/dnainjector/timed/proc/inject", function* inject(f: Frame, M: Value, user: Value) {
	let log_msg: Value = null, endtime: Value = null, HM: Value = null;
	let $e: any;
	f.vars = () => [M, user, log_msg, endtime, HM, $e];
	yield* g.srcCall(f, "prepare");
	if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You can't modify ＀'s DNA while ＀ dead.</span>", [live(M), (yield* g.callName(f, live(M), "p_theyre", []))])]);
		return 0;
	}
	if ((truthy((yield* g.callName(f, live(M), "has_dna", []))) && !truthy(rt.bitAnd(rt.fv(f, "disabilities", live(M)), 128)))) {
		rt.modField(f, live(M), "radiation", (yield* g.call(f, P("/proc/rand"), null, [divide(20, rt.power(rt.sv(f, "damage_coeff"), 2)), divide(50, rt.power(rt.sv(f, "damage_coeff"), 2))])), add);
		log_msg = fmt("＀ injected ＀ with the ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)])), rt.sv(f, "name")]);
		endtime = add(rt.worldTime(f), rt.sv(f, "duration"));
		HM = null;
		rt.forList(f, 0, rt.sv(f, "remove_mutations"), T("/datum/mutation/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			HM = $e;
			if (isEqual(rt.fv(f, "name", live(HM)), "Monkified")) {
				if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
					continue;
				}
				M = (yield* g.callName(f, live(HM), "force_lose", [live(M)]));
			} else {
				yield* g.callName(f, live(HM), "force_lose", [live(M)]);
			}
		}
		rt.endFor(f, 0);
		HM = null;
		rt.forList(f, 0, rt.sv(f, "add_mutations"), T("/datum/mutation/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			HM = $e;
			if ((truthy((rt.isIn(f, live(HM), rt.gv(f, "mutations", rt.fv(f, "dna", live(M)))) ? 1 : 0)) && !truthy(rt.index(rt.gv(f, "temporary_mutations", rt.fv(f, "dna", live(M))), rt.fv(f, "name", live(HM)))))) {
				continue;
			}
			if ((isEqual(rt.fv(f, "name", live(HM)), "Monkified") && truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ injected ＀ with the ＀ <span class='danger'>(MONKEY)</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)])), rt.sv(f, "name")])]);
				log_msg = rt.modify(live(log_msg), " (MONKEY)", add);
				M = (yield* g.callName(f, live(HM), "force_give", [live(M)]));
			} else {
				yield* g.callName(f, live(HM), "force_give", [live(M)]);
			}
			rt.setAt(rt.gv(f, "temporary_mutations", rt.fv(f, "dna", live(M))), rt.fv(f, "name", live(HM)), live(endtime));
		}
		rt.endFor(f, 0);
		if (truthy(rt.sv(f, "fields"))) {
			if (((truthy(rt.at(rt.sv(f, "fields"), "name")) && truthy(rt.at(rt.sv(f, "fields"), "UE"))) && truthy(rt.at(rt.sv(f, "fields"), "blood_type")))) {
				if (!truthy(rt.index(rt.gv(f, "previous", rt.fv(f, "dna", live(M))), "name"))) {
					rt.setAt(rt.gv(f, "previous", rt.fv(f, "dna", live(M))), "name", rt.fv(f, "real_name", live(M)));
				}
				if (!truthy(rt.index(rt.gv(f, "previous", rt.fv(f, "dna", live(M))), "UE"))) {
					rt.setAt(rt.gv(f, "previous", rt.fv(f, "dna", live(M))), "UE", rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(M))));
				}
				if (!truthy(rt.index(rt.gv(f, "previous", rt.fv(f, "dna", live(M))), "blood_type"))) {
					rt.setAt(rt.gv(f, "previous", rt.fv(f, "dna", live(M))), "blood_type", rt.gv(f, "blood_type", rt.fv(f, "dna", live(M))));
				}
				rt.setFv(f, "real_name", live(M), rt.at(rt.sv(f, "fields"), "name"));
				rt.setFv(f, "unique_enzymes", rt.fv(f, "dna", live(M)), rt.at(rt.sv(f, "fields"), "UE"));
				rt.setFv(f, "name", live(M), rt.fv(f, "real_name", live(M)));
				rt.setFv(f, "blood_type", rt.fv(f, "dna", live(M)), rt.at(rt.sv(f, "fields"), "blood_type"));
				rt.setAt(rt.gv(f, "temporary_mutations", rt.fv(f, "dna", live(M))), "ue changed", live(endtime));
			}
			if (truthy(rt.at(rt.sv(f, "fields"), "UI"))) {
				if (!truthy(rt.index(rt.gv(f, "previous", rt.fv(f, "dna", live(M))), "UI"))) {
					rt.setAt(rt.gv(f, "previous", rt.fv(f, "dna", live(M))), "UI", rt.gv(f, "uni_identity", rt.fv(f, "dna", live(M))));
				}
				rt.setFv(f, "uni_identity", rt.fv(f, "dna", live(M)), (yield* g.call(f, P("/proc/merge_text"), null, [rt.gv(f, "uni_identity", rt.fv(f, "dna", live(M))), rt.at(rt.sv(f, "fields"), "UI")])));
				yield* g.callName(f, live(M), "updateappearance", ["mutations_overlay_update", 1], rt.Args.Named);
				rt.setAt(rt.gv(f, "temporary_mutations", rt.fv(f, "dna", live(M))), "ui changed", live(endtime));
			}
		}
		yield* g.call(f, P("/proc/log_attack"), null, [live(log_msg)]);
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

rt.type(7224, "/obj/item/weapon/dnainjector/timed/hulk", "/obj/item/weapon/dnainjector/timed", {
	add_mutations_static: null,
	name: "１DNA injector (Hulk)",
	desc: "This will make you big and strong, but give you a bad skin condition.",
});

// /obj/item/weapon/dnainjector/timed/hulk/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:363)
rt.def("/obj/item/weapon/dnainjector/timed/hulk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Hulk"));
	return f.dot;
});

rt.type(7225, "/obj/item/weapon/dnainjector/timed/h2m", "/obj/item/weapon/dnainjector/timed", {
	add_mutations_static: null,
	name: "１DNA injector (Human > Monkey)",
	desc: "Will make you a flea bag.",
});

// /obj/item/weapon/dnainjector/timed/h2m/proc/<init>  (code/game/objects/items/weapons/dna_injector.dm:368)
rt.def("/obj/item/weapon/dnainjector/timed/h2m/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "add_mutations_static", rt.list("Monkified"));
	return f.dot;
});
