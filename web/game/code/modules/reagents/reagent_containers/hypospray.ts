// Based on /tg/station's code/modules/reagents/reagent_containers/hypospray.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// hypospray.dm:9
rt.def("/obj/item/weapon/reagent_containers/hypospray/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_transfer_amounts = list();
	return f.dot;
});

// hypospray.dm:17
rt.def("/obj/item/weapon/reagent_containers/hypospray/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// hypospray.dm:20
rt.def("/obj/item/weapon/reagent_containers/hypospray/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let R: Value = null;
	if (!this.reagents.total_volume) {
		to_chat(user, `<span class='warning'>${this} is empty!</span>`);
		return f.dot;
	}
	if (!rt.istype(M, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (!(this.reagents.total_volume && (this.ignore_flags || (yield* M.can_inject(user, 1))))) return f.dot;
	to_chat(M, "<span class='warning'>You feel a tiny prick!</span>");
	to_chat(user, `<span class='notice'>You inject ${M} with ${this}.</span>`);
	let fraction: Value = min(this.amount_per_transfer_from_this / this.reagents.total_volume, 1);
	yield* this.reagents.reaction(M, INJECT, fraction);
	if (!M.reagents) return f.dot;
	let injected: Value = list();
	for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
		injected += R.name;
	}
	let trans: Value = 0;
	if (!this.infinite) {
		trans = (yield* this.reagents.trans_to(M, this.amount_per_transfer_from_this));
	} else {
		trans = (yield* this.reagents.copy_to(M, this.amount_per_transfer_from_this));
	}
	to_chat(user, fmt("<span class='notice'>＀ unit５ injected.  ＀ unit５ remaining in ＀.</span>", [trans, this.reagents.total_volume, this]));
	let contained: Value = english_list(injected);
	add_logs(user, M, "injected", this, `(${contained})`);
	return f.dot;
}, true);

rt.type(6518, "/obj/item/weapon/reagent_containers/hypospray/CMO", "/obj/item/weapon/reagent_containers/hypospray", {
	list_reagents: null,
	resistance_flags: 99,
});

// hypospray.dm:49
rt.def("/obj/item/weapon/reagent_containers/hypospray/CMO/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["omnizine", 30]);
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

// hypospray.dm:59
rt.def("/obj/item/weapon/reagent_containers/hypospray/combat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["epinephrine", 30, "omnizine", 30, "leporazine", 15, "atropine", 15]);
	return f.dot;
});

rt.type(6520, "/obj/item/weapon/reagent_containers/hypospray/combat/nanites", "/obj/item/weapon/reagent_containers/hypospray/combat", {
	volume: 100,
	list_reagents: null,
	desc: "A modified air-needle autoinjector for use in combat situations. Prefilled with expensive medical nanites for rapid healing.",
});

// hypospray.dm:64
rt.def("/obj/item/weapon/reagent_containers/hypospray/combat/nanites/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nanites", 80, "synaptizine", 20]);
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

// hypospray.dm:77
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["epinephrine", 10]);
	return f.dot;
});

// hypospray.dm:80
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let R: Value = null;
	if (!this.reagents.total_volume) {
		to_chat(user, `<span class='warning'>${this} is empty!</span>`);
		return f.dot;
	}
	yield* parent_proc();
	if (!rt.istype(user, T("/mob/living/silicon/robot"))) {
		this.reagents.maximum_volume = 0;
		this.container_type = 0;
	}
	yield* this.update_icon();
	rt.spawnTail(f, 80, "/obj/item/weapon/reagent_containers/hypospray/medipen/proc/attack: spawn at modules/reagents/reagent_containers/hypospray.dm:88", R);
	return f.dot;
}, true);

// a spawn(80) body of /obj/item/weapon/reagent_containers/hypospray/medipen/proc/attack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/reagent_containers/hypospray/medipen/proc/attack: spawn at modules/reagents/reagent_containers/hypospray.dm:88", function* (f: Frame, R: Value) {
	if (rt.istype(f.args[1], T("/mob/living/silicon/robot")) && !this.reagents.total_volume) {
		if (yield* (R = f.args[1]).cell.use(100)) {
			yield* this.reagents.add_reagent_list(this.list_reagents);
			yield* this.update_icon();
		}
	}
	return null;
});

// hypospray.dm:97
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/proc/update_icon", function update_icon(f: Frame) {
	if (this.reagents.total_volume > 0) {
		this.icon_state = rt.initial(f, this, "icon_state");
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}0`;
	}
	return f.dot;
});

// hypospray.dm:103
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/proc/examine", function examine(f: Frame) {
	parent_proc();
	if (this.reagents && rt.len(f, this.reagents.reagent_list)) {
		to_chat(f.usr, "<span class='notice'>It is currently loaded.</span>");
	} else {
		to_chat(f.usr, "<span class='notice'>It is spent.</span>");
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

// hypospray.dm:115
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/stimpack/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["ephedrine", 10, "coffee", 10]);
	return f.dot;
});

rt.type(6523, "/obj/item/weapon/reagent_containers/hypospray/medipen/stimpack/traitor", "/obj/item/weapon/reagent_containers/hypospray/medipen/stimpack", {
	list_reagents: null,
	desc: "A modified stimulants autoinjector for use in combat situations. Has a mild healing effect.",
});

// hypospray.dm:119
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/stimpack/traitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["stimulants", 10, "omnizine", 10]);
	return f.dot;
});

rt.type(6524, "/obj/item/weapon/reagent_containers/hypospray/medipen/morphine", "/obj/item/weapon/reagent_containers/hypospray/medipen", {
	list_reagents: null,
	name: "morphine medipen",
	desc: "A rapid way to get you out of a tight situation and fast! You'll feel rather drowsy, though.",
});

// hypospray.dm:124
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/morphine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["morphine", 10]);
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

// hypospray.dm:132
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/tuberculosiscure/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["atropine", 10, "epinephrine", 10, "salbutamol", 20, "spaceacillin", 20]);
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

// hypospray.dm:140
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/survival/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["salbutamol", 10, "leporazine", 15, "tricordrazine", 15, "epinephrine", 10, "miningnanites", 2, "omnizine", 5]);
	return f.dot;
});

rt.type(6527, "/obj/item/weapon/reagent_containers/hypospray/medipen/species_mutator", "/obj/item/weapon/reagent_containers/hypospray/medipen", {
	volume: 1,
	amount_per_transfer_from_this: 1,
	list_reagents: null,
	name: "species mutator medipen",
	desc: "Embark on a whirlwind tour of racial insensitivity by literally appropriating other races.",
});

// hypospray.dm:148
rt.def("/obj/item/weapon/reagent_containers/hypospray/medipen/species_mutator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["unstablemutationtoxin", 1]);
	return f.dot;
});
