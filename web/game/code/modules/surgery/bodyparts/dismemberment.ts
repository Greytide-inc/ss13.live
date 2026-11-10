// Based on /tg/station's code/modules/surgery/bodyparts/dismemberment.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// dismemberment.dm:4
rt.def("/obj/item/bodypart/proc/can_dismember", function can_dismember(f: Frame, I: Value) {
	if (!this.dismemberable) return f.dot;
	f.dot = (this.get_damage() >= this.max_damage - I.armour_penetration / 2 ? 1 : 0);
	return f.dot;
});

// dismemberment.dm:8
rt.def("/obj/item/bodypart/proc/dismember", function* dismember(f: Frame, dam_type: Value) {
	let H: Value = null, affecting: Value = null, location: Value = null, i: Value = null, new_turf: Value = null;
	let $e: any;
	dam_type ??= "brute";
	if (!this.owner) {
		return 0;
	}
	let C: Value = this.owner;
	if (!this.dismemberable) {
		return 0;
	}
	if (rt.bitAnd(C.status_flags, 4096)) {
		return 0;
	}
	if (rt.istype(C, T("/mob/living/carbon/human"))) {
		H = C;
		if (rt.isIn(f, NODISMEMBER, H.dna.species.species_traits)) {
			return 0;
		}
	}
	yield* (affecting = C.get_bodypart("chest")).receive_damage(max(15, min(this.brute_dam / 2, 50)), max(0, min(this.burn_dam / 2, 50)));
	C.visible_message(`<span class='danger'><B>${C}'s ${this.name} has been violently dismembered!</B></span>`);
	yield* C.emote("scream");
	yield* this.drop_limb();
	if (dam_type == "fire") {
		yield* this.burn();
		return 1;
	}
	yield* this.add_mob_blood(C);
	if (rt.istype((location = C.loc), T("/turf"))) {
		yield* C.add_splatter_floor(location);
	}
	let direction: Value = pick(GLOB.cardinal);
	let t_range: Value = rand(2, max(this.throw_range / 2, 2));
	let target_turf: Value = rt.getStep(f, this, 0);
	rt.forRange(f, 0, 1, t_range - 1, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!(new_turf = rt.getStep(f, target_turf, direction))) {
			break;
		}
		target_turf = new_turf;
		if (new_turf.density) {
			break;
		}
	}
	rt.endFor(f, 0);
	yield* this.throw_at(target_turf, this.throw_range, this.throw_speed);
	return 1;
}, true);

// dismemberment.dm:48
rt.def("/obj/item/bodypart/chest/proc/dismember", function* dismember(f: Frame) {
	let H: Value = null, X: Value = null, O: Value = null, org_zone: Value = null;
	if (!this.owner) {
		return 0;
	}
	let C: Value = this.owner;
	if (!this.dismemberable) {
		return 0;
	}
	if (rt.istype(C, T("/mob/living/carbon/human"))) {
		H = C;
		if (rt.isIn(f, NODISMEMBER, H.dna.species.species_traits)) {
			return 0;
		}
	}
	let organ_spilled: Value = 0;
	let _T: Value = rt.getStep(f, C, 0);
	yield* C.add_splatter_floor(_T);
	playsound(rt.getStep(f, C, 0), rt.rsc("sound/misc/splort.ogg"), 80, 1);
	for (X of each(C.internal_organs)) {
		O = X;
		if ((org_zone = check_zone(O.zone)) != "chest") {
			continue;
		}
		yield* O.Remove(C);
		yield* O.forceMove(_T);
		organ_spilled = 1;
	}
	if (this.cavity_item) {
		yield* this.cavity_item.forceMove(_T);
		this.cavity_item = null;
		organ_spilled = 1;
	}
	if (organ_spilled) {
		C.visible_message(`<span class='danger'><B>${C}'s internal organs spill out onto the floor!</B></span>`);
	}
	return 1;
}, true);

// dismemberment.dm:83
rt.def("/obj/item/bodypart/proc/drop_limb", function* drop_limb(f: Frame, special: Value) {
	let X: Value = null, S: Value = null, I: Value = null, MT: Value = null, O: Value = null, org_zone: Value = null;
	if (!this.owner) {
		return f.dot;
	}
	let _T: Value = rt.getStep(f, this.owner, 0);
	let C: Value = this.owner;
	this.update_limb(1);
	C.bodyparts -= this;
	if (this.held_index) {
		yield* C.dropItemToGround(this.owner.get_item_for_held_index(this.held_index), 1);
		rt.setAt(C.hand_bodyparts, this.held_index, null);
	}
	this.owner = null;
	for (X of each(C.surgeries)) {
		if ((S = X).operated_bodypart == this) {
			C.surgeries -= S;
			yield* qdel(S);
			break;
		}
	}
	for (I of each(this.embedded_objects, T("/obj/item"))) {
		this.embedded_objects -= I;
		I.loc = this;
	}
	if (!C.has_embedded_objects()) {
		yield* C.clear_alert("embeddedobject");
	}
	if (!special) {
		if (C.dna) {
			X = null;
			for (X of each(C.dna.mutations)) {
				if ((MT = X).limb_req && MT.limb_req == this.body_zone) {
					yield* MT.force_lose(C);
				}
			}
		}
		X = null;
		for (X of each(C.internal_organs)) {
			O = X;
			if ((org_zone = check_zone(O.zone)) != this.body_zone) {
				continue;
			}
			yield* O.transfer_to_limb(this, C);
		}
	}
	this.update_icon_dropped();
	yield* this.forceMove(_T);
	C.update_health_hud();
	yield* C.update_body();
	yield* C.update_hair();
	yield* C.update_canmove();
	if (!this.is_pseudopart) return f.dot;
	yield* this.drop_organs(C);
	yield* qdel(this);
	return f.dot;
}, true);

// dismemberment.dm:136
rt.def("/obj/item/organ/proc/transfer_to_limb", function* transfer_to_limb(f: Frame, LB: Value, C: Value) {
	yield* this.Remove(C);
	this.loc = LB;
	return f.dot;
}, true);

// dismemberment.dm:140
rt.def("/obj/item/organ/brain/proc/transfer_to_limb", function* transfer_to_limb(f: Frame, LB: Value, C: Value) {
	yield* this.Remove(C);
	this.loc = LB;
	LB.brain = this;
	if (!this.brainmob) return f.dot;
	LB.brainmob = this.brainmob;
	this.brainmob = null;
	LB.brainmob.loc = LB;
	LB.brainmob.container = LB;
	LB.brainmob.stat = 2;
	return f.dot;
}, true);

// dismemberment.dm:152
rt.def("/obj/item/organ/eyes/proc/transfer_to_limb", function* transfer_to_limb(f: Frame, LB: Value, C: Value) {
	LB.eyes = this;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10178, "/obj/item/bodypart/r_arm", "/obj/item/bodypart", {
	attack_verb: null,
	max_damage: 50,
	body_zone: "r_arm",
	body_part: 256,
	held_index: 2,
	px_x: 6,
	px_y: 0,
	name: "right arm",
	desc: "Over 87% of humans are right handed. That figure is much lower among humans missing their right arm.",
	icon_state: "default_human_r_arm",
});

// dismemberment.dm:158
rt.def("/obj/item/bodypart/r_arm/proc/drop_limb", function* drop_limb(f: Frame, special: Value) {
	let R: Value = null;
	let C: Value = this.owner;
	yield* parent_proc();
	if (!(C && !special)) return f.dot;
	if (C.handcuffed) {
		C.handcuffed.loc = C.loc;
		yield* C.handcuffed.dropped(C);
		C.handcuffed = null;
		yield* C.update_handcuffed();
	}
	if (C.hud_used) {
		if (R = rt.index(C.hud_used.hand_slots, `${this.held_index}`)) {
			yield* R.update_icon();
		}
	}
	if (C.gloves) {
		yield* C.dropItemToGround(C.gloves, 1);
	}
	C.update_inv_gloves();
	return f.dot;
}, true);

rt.type(10172, "/obj/item/bodypart/l_arm", "/obj/item/bodypart", {
	attack_verb: null,
	max_damage: 50,
	body_zone: "l_arm",
	body_part: 128,
	held_index: 1,
	px_x: -6,
	px_y: 0,
	name: "left arm",
	desc: "Did you know that the word 'sinister' stems originally from the Latin 'sinestra' (left hand), because the left hand was supposed to be possessed by the devil? This arm appears to be possessed by no one though.",
	icon_state: "default_human_l_arm",
});

// dismemberment.dm:176
rt.def("/obj/item/bodypart/l_arm/proc/drop_limb", function* drop_limb(f: Frame, special: Value) {
	let L: Value = null;
	let C: Value = this.owner;
	yield* parent_proc();
	if (!(C && !special)) return f.dot;
	if (C.handcuffed) {
		C.handcuffed.loc = C.loc;
		yield* C.handcuffed.dropped(C);
		C.handcuffed = null;
		yield* C.update_handcuffed();
	}
	if (C.hud_used) {
		if (L = rt.index(C.hud_used.hand_slots, `${this.held_index}`)) {
			yield* L.update_icon();
		}
	}
	if (C.gloves) {
		yield* C.dropItemToGround(C.gloves, 1);
	}
	C.update_inv_gloves();
	return f.dot;
}, true);

rt.type(10191, "/obj/item/bodypart/r_leg", "/obj/item/bodypart", {
	attack_verb: null,
	max_damage: 50,
	body_zone: "r_leg",
	body_part: 16,
	px_x: 2,
	px_y: 12,
	name: "right leg",
	desc: "You put your right leg in, your right leg out. In, out, in, out, shake it all about. And apparently then it detaches.\nThe hokey pokey has certainly changed a lot since space colonisation.",
	icon_state: "default_human_r_leg",
});

// dismemberment.dm:194
rt.def("/obj/item/bodypart/r_leg/proc/drop_limb", function* drop_limb(f: Frame, special: Value) {
	if (this.owner && !special) {
		if (this.owner.legcuffed) {
			this.owner.legcuffed.loc = this.owner.loc;
			yield* this.owner.legcuffed.dropped(this.owner);
			this.owner.legcuffed = null;
			yield* this.owner.update_inv_legcuffed();
		}
		if (this.owner.shoes) {
			yield* this.owner.dropItemToGround(this.owner.shoes, 1);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10184, "/obj/item/bodypart/l_leg", "/obj/item/bodypart", {
	attack_verb: null,
	max_damage: 50,
	body_zone: "l_leg",
	body_part: 8,
	px_x: -2,
	px_y: 12,
	name: "left leg",
	desc: "Some athletes prefer to tie their left shoelaces first for good luck. In this instance, it probably would not have helped.",
	icon_state: "default_human_l_leg",
});

// dismemberment.dm:205
rt.def("/obj/item/bodypart/l_leg/proc/drop_limb", function* drop_limb(f: Frame, special: Value) {
	if (this.owner && !special) {
		if (this.owner.legcuffed) {
			this.owner.legcuffed.loc = this.owner.loc;
			yield* this.owner.legcuffed.dropped(this.owner);
			this.owner.legcuffed = null;
			yield* this.owner.update_inv_legcuffed();
		}
		if (this.owner.shoes) {
			yield* this.owner.dropItemToGround(this.owner.shoes, 1);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// dismemberment.dm:216
rt.def("/obj/item/bodypart/head/proc/drop_limb", function* drop_limb(f: Frame, special: Value) {
	let X: Value = null, I: Value = null, AP: Value = null, pill: Value = null;
	if (!special) {
		for (X of each(list(this.owner.glasses, this.owner.ears, this.owner.wear_mask, this.owner.head))) {
			I = X;
			yield* this.owner.dropItemToGround(I, 1);
		}
	}
	for (AP of each(this.owner.actions, T("/datum/action/item_action/hands_free/activate_pill"))) {
		yield* AP.Remove(this.owner);
		if (pill = AP.target) {
			yield* pill.forceMove(this);
		}
	}
	this.name = `${this.owner.real_name}'s head`;
	yield* parent_proc();
	return f.dot;
}, true);

// dismemberment.dm:259
rt.def("/obj/item/bodypart/proc/attach_limb", function* attach_limb(f: Frame, C: Value, special: Value) {
	let hand: Value = null, X: Value = null, S: Value = null, surgery_zone: Value = null, O: Value = null;
	this.loc = null;
	this.owner = C;
	C.bodyparts += this;
	if (this.held_index) {
		if (this.held_index > rt.len(f, C.hand_bodyparts)) {
			C.hand_bodyparts.len = this.held_index;
		}
		rt.setAt(C.hand_bodyparts, this.held_index, this);
		if (C.dna.species.mutanthands && !this.is_pseudopart) {
			yield* C.put_in_hand((yield* new_(C.dna.species.mutanthands)), this.held_index);
		}
		if (C.hud_used) {
			if (hand = rt.index(C.hud_used.hand_slots, `${this.held_index}`)) {
				yield* hand.update_icon();
			}
		}
		C.update_inv_gloves();
	}
	if (special) {
		for (X of each(C.surgeries)) {
			S = X;
			if ((surgery_zone = check_zone(S.location)) == this.body_zone) {
				C.surgeries -= S;
				yield* qdel(S);
				break;
			}
		}
	}
	for (O of each(this.contents, T("/obj/item/organ"))) {
		yield* O.Insert(C);
	}
	this.update_bodypart_damage_state();
	yield* C.updatehealth();
	yield* C.update_body();
	yield* C.update_hair();
	C.update_damage_overlays();
	yield* C.update_canmove();
	return f.dot;
}, true);

// dismemberment.dm:298
rt.def("/obj/item/bodypart/head/proc/attach_limb", function* attach_limb(f: Frame, C: Value, special: Value) {
	let H: Value = null, _P: Value = null, AP: Value = null;
	let $e: any;
	if (this.brain) {
		if (this.brainmob) {
			this.brainmob.container = null;
			this.brainmob.loc = this.brain;
			this.brain.brainmob = this.brainmob;
			this.brainmob = null;
		}
		yield* this.brain.Insert(C);
		this.brain = null;
	}
	if (rt.istype(C, T("/mob/living/carbon/human"))) {
		(H = C).hair_color = this.hair_color;
		H.hair_style = this.hair_style;
		H.facial_hair_color = this.facial_hair_color;
		H.facial_hair_style = this.facial_hair_style;
		H.lip_style = this.lip_style;
		H.lip_color = this.lip_color;
	}
	if (this.real_name) {
		C.real_name = this.real_name;
	}
	this.real_name = "";
	this.name = rt.initial(f, this, "name");
	for (_P of each(this, T("/obj/item/weapon/reagent_containers/pill"))) {
		AP = null;
		rt.forList(f, 1, _P.actions, T("/datum/action/item_action/hands_free/activate_pill"));
		if (($e = rt.next(f, 1)) !== undefined) {
			AP = $e;
			yield* _P.forceMove(C);
			yield* AP.Grant(C);
		}
		rt.endFor(f, 1);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// dismemberment.dm:335
rt.def("/mob/living/carbon/proc/regenerate_limbs", function* regenerate_limbs(f: Frame, noheal: Value, excluded_limbs: Value) {
	let Z: Value = null;
	let limb_list: Value = list("head", "chest", "r_arm", "l_arm", "r_leg", "l_leg");
	if (excluded_limbs) {
		limb_list -= excluded_limbs;
	}
	for (Z of each(limb_list)) {
		f.dot += (yield* this.regenerate_limb(Z, noheal));
	}
	return f.dot;
}, true);

// dismemberment.dm:344
rt.def("/mob/living/carbon/proc/regenerate_limb", function* regenerate_limb(f: Frame, limb_zone: Value, noheal: Value) {
	let L: Value = null;
	if (this.get_bodypart(limb_zone)) {
		return 0;
	}
	if (!(L = (yield* this.newBodyPart(limb_zone, 0, 0)))) return f.dot;
	if (!noheal) {
		L.brute_dam = 0;
		L.burn_dam = 0;
		L.brutestate = 0;
		L.burnstate = 0;
	}
	yield* L.attach_limb(this, 1);
	return 1;
}, true);
