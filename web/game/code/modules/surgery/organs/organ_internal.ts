// Based on /tg/station's code/modules/surgery/organs/organ_internal.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9439, "/obj/item/organ", "/obj/item", {
	owner: null,
	status: 1,
	zone: "chest",
	slot: null,
	vital: 0,
	name: "organ",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	origin_tech: "biotech=3",
	w_class: 2,
	throwforce: 0,
});

// organ_internal.dm:16
rt.def("/obj/item/organ/proc/Insert", function* Insert(f: Frame, M: Value, special: Value, drop_if_replaced: Value) {
	let replaced: Value = null, X: Value = null, A: Value = null;
	special ??= 0;
	drop_if_replaced ??= 1;
	if (!rt.istype(M, T("/mob/living/carbon")) || this.owner == M) {
		return f.dot;
	}
	if (replaced = M.getorganslot(this.slot)) {
		yield* replaced.Remove(M, { special: 1 });
		if (drop_if_replaced) {
			yield* replaced.forceMove(rt.getStep(f, this, 0));
		} else {
			yield* qdel(replaced);
		}
	}
	this.owner = M;
	(rt.modField(f, M, "internal_organs", this, rt.bitOr));
	rt.setAt(M.internal_organs_slot, this.slot, this);
	this.loc = null;
	for (X of each(this.actions)) {
		yield* (A = X).Grant(M);
	}
	return f.dot;
}, true);

// organ_internal.dm:39
rt.def("/obj/item/organ/proc/Remove", function* Remove(f: Frame, M: Value, special: Value) {
	let X: Value = null, A: Value = null;
	special ??= 0;
	this.owner = null;
	if (M) {
		M.internal_organs -= this;
		if (rt.index(M.internal_organs_slot, this.slot) == this) {
			yield* M.internal_organs_slot.Remove(this.slot);
		}
		if (this.vital && !special && !rt.bitAnd(M.status_flags, 4096)) {
			yield* M.death();
		}
	}
	for (X of each(this.actions)) {
		yield* (A = X).Remove(M);
	}
	return f.dot;
}, true);

// organ_internal.dm:56
rt.def("/obj/item/organ/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!(this.status == ORGAN_ROBOTIC && this.crit_fail)) return f.dot;
	to_chat(user, `<span class='warning'>${this} seems to be broken!</span>`);
	return f.dot;
}, false);

// organ_internal.dm:62
rt.def("/obj/item/organ/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = null;
	(S = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/organ")))).name = this.name;
	S.desc = this.desc;
	S.icon = this.icon;
	S.icon_state = this.icon_state;
	S.origin_tech = this.origin_tech;
	S.w_class = this.w_class;
	return S;
}, true);

rt.type(6357, "/obj/item/weapon/reagent_containers/food/snacks/organ", "/obj/item/weapon/reagent_containers/food/snacks", {
	name: "appendix",
	icon_state: "appendix",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	list_reagents: null,
});

// organ_internal.dm:76
rt.def("/obj/item/weapon/reagent_containers/food/snacks/organ/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nutriment", 5]);
	return f.dot;
});

// organ_internal.dm:83
rt.def("/obj/item/organ/proc/Destroy", function* Destroy(f: Frame) {
	if (this.owner) {
		yield* this.Remove(this.owner, { special: 1 });
	}
	return (yield* parent_proc());
}, true);

// organ_internal.dm:87
rt.def("/obj/item/organ/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let H: Value = null, S: Value = null;
	if (M == user && rt.istype(user, T("/mob/living/carbon/human"))) {
		H = user;
		if (this.status == ORGAN_ORGANIC) {
			if (S = (yield* this.prepare_eat())) {
				yield* H.drop_item();
				yield* H.put_in_active_hand(S);
				yield* S.attack(H, H);
				yield* qdel(this);
			}
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// organ_internal.dm:111
rt.def("/mob/living/carbon/proc/regenerate_organs", function* regenerate_organs(f: Frame) {
	let L: Value = null, H: Value = null, _T: Value = null, E: Value = null, ears: Value = null;
	let breathes: Value = 1;
	let blooded: Value = 1;
	if (this.dna && this.dna.species) {
		if (rt.isIn(f, NOBREATH, this.dna.species.species_traits)) {
			breathes = 0;
		}
		if (rt.isIn(f, NOBLOOD, this.dna.species.species_traits)) {
			blooded = 0;
		}
	}
	if (breathes && !this.getorganslot("lungs")) {
		yield* (L = (yield* new_(T("/obj/item/organ/lungs")))).Insert(this);
	}
	if (blooded && !this.getorganslot("heart")) {
		yield* (H = (yield* new_(T("/obj/item/organ/heart")))).Insert(this);
	}
	if (!this.getorganslot("tongue")) {
		if (this.dna && this.dna.species && this.dna.species.mutanttongue) {
			_T = (yield* new_(this.dna.species.mutanttongue));
		} else {
			_T = (yield* new_(T("/obj/item/organ/tongue")));
		}
		yield* _T.Insert(this);
	}
	if (!this.getorganslot("eye_sight")) {
		if (this.dna && this.dna.species && this.dna.species.mutanteyes) {
			E = (yield* new_(this.dna.species.mutanteyes));
		} else {
			E = (yield* new_(T("/obj/item/organ/eyes")));
		}
		yield* E.Insert(this);
	}
	if (this.getorganslot("ears")) return f.dot;
	if (this.dna && this.dna.species && this.dna.species.mutantears) {
		ears = (yield* new_(this.dna.species.mutantears));
	} else {
		ears = (yield* new_(T("/obj/item/organ/ears")));
	}
	yield* ears.Insert(this);
	return f.dot;
}, true);
