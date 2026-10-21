// From code/modules/reagents/reagent_containers/hypospray.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6517, "/obj/item/weapon/reagent_containers/hypospray", "/obj/item/weapon/reagent_containers", {
	ignore_flags: 0,
	infinite: 0,
	amount_per_transfer_from_this: 5,
	volume: 30,
	possible_transfer_amounts: null,
	container_type: 4096,
	name: "hypospray",
	desc: "The DeForest Medical Corporation hypospray is a sterile, air-needle autoinjector for rapid administration of drugs to patients.",
	icon: rt.rsc("icons/obj/syringe.dmi"),
	item_state: "hypo",
	icon_state: "hypo",
	resistance_flags: 32,
	slot_flags: 512,
});

// /obj/item/weapon/reagent_containers/hypospray/proc/<init>  (code/modules/reagents/reagent_containers/hypospray.dm:9)
rt.def("/obj/item/weapon/reagent_containers/hypospray/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list());
	return f.dot;
});

// /obj/item/weapon/reagent_containers/hypospray/proc/attack_paw  (code/modules/reagents/reagent_containers/hypospray.dm:17)  may sleep
rt.def("/obj/item/weapon/reagent_containers/hypospray/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/item/weapon/reagent_containers/hypospray/proc/attack  (code/modules/reagents/reagent_containers/hypospray.dm:20)  may sleep
rt.def("/obj/item/weapon/reagent_containers/hypospray/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let fraction: Value = null, injected: Value = null, R: Value = null, trans: Value = null, contained: Value = null;
	let $e: any;
	f.vars = () => [M, user, fraction, injected, R, trans, contained, $e];
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!(truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))) && (truthy(rt.sv(f, "ignore_flags")) || truthy((yield* g.callName(f, live(M), "can_inject", [live(user), 1])))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You feel a tiny prick!</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You inject ＀ with ＀.</span>", [live(M), live(f.src)])]);
	fraction = (yield* g.call(f, P("/proc/min"), null, [divide(rt.sv(f, "amount_per_transfer_from_this"), rt.fv(f, "total_volume", rt.sv(f, "reagents"))), 1]));
	yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(M), 5, live(fraction)]);
	if (!truthy(rt.fv(f, "reagents", live(M)))) return f.dot;
	injected = rt.list();
	R = null;
	rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		injected = rt.modify(live(injected), rt.fv(f, "name", live(R)), add);
	}
	rt.endFor(f, 0);
	trans = 0;
	if (!truthy(rt.sv(f, "infinite"))) {
		trans = (yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(M), rt.sv(f, "amount_per_transfer_from_this")]));
	} else {
		trans = (yield* g.callName(f, rt.sv(f, "reagents"), "copy_to", [live(M), rt.sv(f, "amount_per_transfer_from_this")]));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ unit５ injected.  ＀ unit５ remaining in ＀.</span>", [live(trans), rt.fv(f, "total_volume", rt.sv(f, "reagents")), live(f.src)])]);
	contained = (yield* g.call(f, P("/proc/english_list"), null, [live(injected)]));
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "injected", live(f.src), fmt("(＀)", [live(contained)])]);
	return f.dot;
}, true);

rt.type(6518, "/obj/item/weapon/reagent_containers/hypospray/CMO", "/obj/item/weapon/reagent_containers/hypospray", {
	list_reagents: null,
	resistance_flags: 99,
});

// /obj/item/weapon/reagent_containers/hypospray/CMO/proc/<init>  (code/modules/reagents/reagent_containers/hypospray.dm:49)
rt.def("/obj/item/weapon/reagent_containers/hypospray/CMO/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["omnizine", 30]));
	return f.dot;
});

rt.type(6519, "/obj/item/weapon/reagent_containers/hypospray/combat", "/obj/item/weapon/reagent_containers/hypospray", {
	amount_per_transfer_from_this: 10,
	volume: 90,
	ignore_flags: 1,
	list_reagents: null,
	name: "combat stimulant injector",
	desc: "A modified air-needle autoinjector, used by support operatives to quickly heal injuries in combat.",
	icon_state: "combat_hypo",
});

// /obj/item/weapon/reagent_containers/hypospray/combat/proc/<init>  (code/modules/reagents/reagent_containers/hypospray.dm:59)
rt.def("/obj/item/weapon/reagent_containers/hypospray/combat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["epinephrine", 30, "omnizine", 30, "leporazine", 15, "atropine", 15]));
	return f.dot;
});

rt.type(6520, "/obj/item/weapon/reagent_containers/hypospray/combat/nanites", "/obj/item/weapon/reagent_containers/hypospray/combat", {
	volume: 100,
	list_reagents: null,
	desc: "A modified air-needle autoinjector for use in combat situations. Prefilled with expensive medical nanites for rapid healing.",
});

// /obj/item/weapon/reagent_containers/hypospray/combat/nanites/proc/<init>  (code/modules/reagents/reagent_containers/hypospray.dm:64)
rt.def("/obj/item/weapon/reagent_containers/hypospray/combat/nanites/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nanites", 80, "synaptizine", 20]));
	return f.dot;
});

rt.type(6521, "/obj/item/weapon/reagent_containers/hypospray/medipen", "/obj/item/weapon/reagent_containers/hypospray", {
	amount_per_transfer_from_this: 10,
	volume: 10,
	ignore_flags: 1,
	flags: null,
	list_reagents: null,
	name: "epinephrine medipen",
	desc: "A rapid and safe way to stabilize patients in critical condition for personnel without advanced medical knowledge.",
	icon_state: "medipen",
	item_state: "medipen",
});

// /obj/item/weapon/reagent_containers/hypospray/medipen/proc/<init>  (code/modules/reagents/reagent_containers/hypospray.dm:77)
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["epinephrine", 10]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/hypospray/medipen/proc/attack  (code/modules/reagents/reagent_containers/hypospray.dm:80)  may sleep
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/proc/attack", function* attack(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is empty!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		rt.setFv(f, "maximum_volume", rt.sv(f, "reagents"), 0);
		rt.setSv(f, "container_type", 0);
	}
	yield* g.srcCall(f, "update_icon");
	rt.spawnTail(f, 80, "/obj/item/weapon/reagent_containers/hypospray/medipen/proc/attack: spawn at modules/reagents/reagent_containers/hypospray.dm:88", R);
	return live(f.dot);
}, true, { args: ["M", "user"] });

// a spawn(80) body of /obj/item/weapon/reagent_containers/hypospray/medipen/proc/attack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/reagent_containers/hypospray/medipen/proc/attack: spawn at modules/reagents/reagent_containers/hypospray.dm:88", function* (f: Frame, R: Value) {
	f.vars = () => [R];
	if ((truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon/robot")) ? 1 : 0)) && !truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) {
		if (truthy((yield* g.callName(f, rt.gv(f, "cell", (R = live(f.args[1]))), "use", [100])))) {
			yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent_list", [rt.sv(f, "list_reagents")]);
			yield* g.srcCall(f, "update_icon");
		}
	}
	return null;
});

// /obj/item/weapon/reagent_containers/hypospray/medipen/proc/update_icon  (code/modules/reagents/reagent_containers/hypospray.dm:97)
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/proc/update_icon", function update_icon(f: Frame) {
	if (rt.gt(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 0)) {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	} else {
		rt.setSv(f, "icon_state", fmt("＀0", [rt.initial(f, live(f.src), "icon_state")]));
	}
	return f.dot;
});

// /obj/item/weapon/reagent_containers/hypospray/medipen/proc/examine  (code/modules/reagents/reagent_containers/hypospray.dm:103)
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "reagents")) && truthy(rt.getLen(f, rt.fv(f, "reagent_list", rt.sv(f, "reagents")))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>It is currently loaded.</span>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>It is spent.</span>"]);
	}
	return f.dot;
});

rt.type(6522, "/obj/item/weapon/reagent_containers/hypospray/medipen/stimpack", "/obj/item/weapon/reagent_containers/hypospray/medipen", {
	volume: 20,
	amount_per_transfer_from_this: 20,
	list_reagents: null,
	name: "stimpack medipen",
	desc: "A rapid way to stimulate your body's adrenaline, allowing for freer movement in restrictive armor.",
	icon_state: "stimpen",
});

// /obj/item/weapon/reagent_containers/hypospray/medipen/stimpack/proc/<init>  (code/modules/reagents/reagent_containers/hypospray.dm:115)
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/stimpack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["ephedrine", 10, "coffee", 10]));
	return f.dot;
});

rt.type(6523, "/obj/item/weapon/reagent_containers/hypospray/medipen/stimpack/traitor", "/obj/item/weapon/reagent_containers/hypospray/medipen/stimpack", {
	list_reagents: null,
	desc: "A modified stimulants autoinjector for use in combat situations. Has a mild healing effect.",
});

// /obj/item/weapon/reagent_containers/hypospray/medipen/stimpack/traitor/proc/<init>  (code/modules/reagents/reagent_containers/hypospray.dm:119)
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/stimpack/traitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["stimulants", 10, "omnizine", 10]));
	return f.dot;
});

rt.type(6524, "/obj/item/weapon/reagent_containers/hypospray/medipen/morphine", "/obj/item/weapon/reagent_containers/hypospray/medipen", {
	list_reagents: null,
	name: "morphine medipen",
	desc: "A rapid way to get you out of a tight situation and fast! You'll feel rather drowsy, though.",
});

// /obj/item/weapon/reagent_containers/hypospray/medipen/morphine/proc/<init>  (code/modules/reagents/reagent_containers/hypospray.dm:124)
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/morphine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["morphine", 10]));
	return f.dot;
});

rt.type(6525, "/obj/item/weapon/reagent_containers/hypospray/medipen/tuberculosiscure", "/obj/item/weapon/reagent_containers/hypospray/medipen", {
	volume: 60,
	amount_per_transfer_from_this: 30,
	list_reagents: null,
	name: "BVAK autoinjector",
	desc: "Bio Virus Antidote Kit autoinjector. Has a two use system for yourself, and someone else. Inject when infected.",
	icon_state: "stimpen",
});

// /obj/item/weapon/reagent_containers/hypospray/medipen/tuberculosiscure/proc/<init>  (code/modules/reagents/reagent_containers/hypospray.dm:132)
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/tuberculosiscure/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["atropine", 10, "epinephrine", 10, "salbutamol", 20, "spaceacillin", 20]));
	return f.dot;
});

rt.type(6526, "/obj/item/weapon/reagent_containers/hypospray/medipen/survival", "/obj/item/weapon/reagent_containers/hypospray/medipen", {
	volume: 57,
	amount_per_transfer_from_this: 57,
	list_reagents: null,
	name: "survival medipen",
	desc: "A medipen for surviving in the harshest of environments, heals and protects from environmental hazards. WARNING: Do not inject more than one pen in quick succession.",
	icon_state: "stimpen",
});

// /obj/item/weapon/reagent_containers/hypospray/medipen/survival/proc/<init>  (code/modules/reagents/reagent_containers/hypospray.dm:140)
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/survival/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["salbutamol", 10, "leporazine", 15, "tricordrazine", 15, "epinephrine", 10, "miningnanites", 2, "omnizine", 5]));
	return f.dot;
});

rt.type(6527, "/obj/item/weapon/reagent_containers/hypospray/medipen/species_mutator", "/obj/item/weapon/reagent_containers/hypospray/medipen", {
	volume: 1,
	amount_per_transfer_from_this: 1,
	list_reagents: null,
	name: "species mutator medipen",
	desc: "Embark on a whirlwind tour of racial insensitivity by literally appropriating other races.",
});

// /obj/item/weapon/reagent_containers/hypospray/medipen/species_mutator/proc/<init>  (code/modules/reagents/reagent_containers/hypospray.dm:148)
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/species_mutator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["unstablemutationtoxin", 1]));
	return f.dot;
});
