// Based on /tg/station's code/game/gamemodes/changeling/powers/transform.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(8205, "/obj/item/clothing/glasses/changeling", "/obj/item/clothing/glasses", {
	flags: 2,
	name: "flesh",
});

// transform.dm:14
rt.def("/obj/item/clothing/glasses/changeling/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user && user.mind && user.mind.changeling) {
		to_chat(user, `<span class='notice'>You reabsorb ${this} into your body.</span>`);
		yield* qdel(this);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8260, "/obj/item/clothing/under/changeling", "/obj/item/clothing/under", {
	flags: 2,
	name: "flesh",
});

// transform.dm:25
rt.def("/obj/item/clothing/under/changeling/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user && user.mind && user.mind.changeling) {
		to_chat(user, `<span class='notice'>You reabsorb ${this} into your body.</span>`);
		yield* qdel(this);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7804, "/obj/item/clothing/suit/changeling", "/obj/item/clothing/suit", {
	flags: 2,
	name: "flesh",
	allowed: null,
});

// transform.dm:34
rt.def("/obj/item/clothing/suit/changeling/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/changeling"));
	return f.dot;
});

// transform.dm:37
rt.def("/obj/item/clothing/suit/changeling/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user && user.mind && user.mind.changeling) {
		to_chat(user, `<span class='notice'>You reabsorb ${this} into your body.</span>`);
		yield* qdel(this);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8024, "/obj/item/clothing/head/changeling", "/obj/item/clothing/head", {
	flags: 2,
	name: "flesh",
});

// transform.dm:48
rt.def("/obj/item/clothing/head/changeling/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user && user.mind && user.mind.changeling) {
		to_chat(user, `<span class='notice'>You reabsorb ${this} into your body.</span>`);
		yield* qdel(this);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8457, "/obj/item/clothing/shoes/changeling", "/obj/item/clothing/shoes", {
	flags: 2,
	name: "flesh",
});

// transform.dm:59
rt.def("/obj/item/clothing/shoes/changeling/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user && user.mind && user.mind.changeling) {
		to_chat(user, `<span class='notice'>You reabsorb ${this} into your body.</span>`);
		yield* qdel(this);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7660, "/obj/item/clothing/gloves/changeling", "/obj/item/clothing/gloves", {
	flags: 2,
	name: "flesh",
});

// transform.dm:70
rt.def("/obj/item/clothing/gloves/changeling/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user && user.mind && user.mind.changeling) {
		to_chat(user, `<span class='notice'>You reabsorb ${this} into your body.</span>`);
		yield* qdel(this);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8516, "/obj/item/clothing/mask/changeling", "/obj/item/clothing/mask", {
	flags: 2,
	name: "flesh",
});

// transform.dm:81
rt.def("/obj/item/clothing/mask/changeling/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user && user.mind && user.mind.changeling) {
		to_chat(user, `<span class='notice'>You reabsorb ${this} into your body.</span>`);
		yield* qdel(this);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8926, "/obj/item/changeling", "/obj/item", {
	flags: 2,
	name: "flesh",
	slot_flags: 16777215,
	allowed: null,
});

// transform.dm:91
rt.def("/obj/item/changeling/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/changeling"));
	return f.dot;
});

// transform.dm:94
rt.def("/obj/item/changeling/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user && user.mind && user.mind.changeling) {
		to_chat(user, `<span class='notice'>You reabsorb ${this} into your body.</span>`);
		yield* qdel(this);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11261, "/obj/effect/proc_holder/changeling/transform", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 5,
	dna_cost: 0,
	req_dna: 1,
	req_human: 1,
	name: "Transform",
	desc: "We take on the appearance and voice of one we have absorbed.",
});

// transform.dm:102
rt.def("/obj/effect/proc_holder/changeling/transform/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let chosen_prof: Value = null;
	let changeling: Value = user.mind.changeling;
	if (!(chosen_prof = (yield* changeling.select_dna("Select the target DNA: ", "Target DNA", user)))) {
		return f.dot;
	}
	yield* changeling_transform(user, chosen_prof);
	return 1;
}, true);

// transform.dm:112
rt.def("/datum/changeling/proc/select_dna", function* select_dna(f: Frame, prompt: Value, title: Value, user: Value) {
	let prof: Value = null, chosen_name: Value = null, slot: Value = null, prof_2: Value = null;
	let names: Value = list("Drop Flesh Disguise");
	for (prof of each(this.stored_profiles, T("/datum/changelingprofile"))) {
		names += `${prof.name}`;
	}
	if (!(chosen_name = (yield* g.op(f, "Prompt", [1], [null, null, title, prompt, names])))) {
		return f.dot;
	}
	if (chosen_name == "Drop Flesh Disguise") {
		for (slot of each(GLOB.slots)) {
			if (rt.op(f, "IsType", [], [rt.index(user.vars, slot), rt.index(GLOB.slot2type, slot)])) {
				yield* qdel(rt.index(user.vars, slot));
			}
		}
	}
	return (prof_2 = this.get_dna(chosen_name));
}, true);
