// Based on /tg/station's code/modules/mob/transform_procs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// transform_procs.dm:7
rt.def("/mob/living/carbon/proc/monkeyize", function* monkeyize(f: Frame, tr_flags: Value) {
	let X: Value = null, IMP: Value = null, cavity_object: Value = null, CH: Value = null, Itemlist: Value = null, W: Value = null, R: Value = null, D: Value = null, Y: Value = null, IMP_7: Value = null, X_6: Value = null, I: Value = null, missing_zone: Value = null, BP: Value = null, X_9: Value = null, G: Value = null, A: Value = null;
	tr_flags ??= 67;
	if (this.notransform) {
		return f.dot;
	}
	let stored_implants: Value = list();
	let int_organs: Value = list();
	if (rt.bitAnd(tr_flags, TR_KEEPIMPLANTS)) {
		for (X of each(this.implants)) {
			stored_implants += (IMP = X);
			yield* IMP.removed(this, TR_KEEPITEMS, TR_KEEPITEMS);
		}
	}
	let missing_bodyparts_zones: Value = this.get_missing_limbs();
	if ((CH = this.get_bodypart("chest")).cavity_item) {
		cavity_object = CH.cavity_item;
		CH.cavity_item = null;
	}
	if (rt.bitAnd(tr_flags, TR_KEEPITEMS)) {
		Itemlist = this.get_equipped_items();
		Itemlist += this.held_items;
		for (W of each(Itemlist, T("/obj/item"))) {
			yield* this.dropItemToGround(W);
		}
	}
	this.notransform = 1;
	this.canmove = 0;
	yield* this.Stun(22, { ignore_canstun: 1 });
	this.icon = null;
	this.cut_overlays();
	this.invisibility = INVISIBILITY_MAXIMUM;
	yield* new_(T("/obj/effect/temp_visual/monkeyify"), this.loc);
	yield* sleep(22);
	let O: Value = (yield* new_(T("/mob/living/carbon/monkey"), this.loc));
	if (rt.bitAnd(tr_flags, TR_HASHNAME)) {
		O.name = `monkey (${copytext(md5(this.real_name), 2, 6)})`;
		O.real_name = `monkey (${copytext(md5(this.real_name), 2, 6)})`;
	}
	yield* this.dna.transfer_identity(O);
	yield* O.updateappearance({ icon_update: 0 });
	if (rt.bitAnd(tr_flags, TR_KEEPSE)) {
		O.dna.struc_enzymes = this.dna.struc_enzymes;
		R = rt.at(GLOB.mutations_list, "Monkified");
		O.dna.struc_enzymes = (yield* R.set_se(O.dna.struc_enzymes, { on: 1 }));
	}
	if (this.suiciding) {
		O.suiciding = this.suiciding;
	}
	if (this.hellbound) {
		O.hellbound = this.hellbound;
	}
	O.loc = this.loc;
	O.a_intent = "harm";
	if (rt.bitAnd(tr_flags, TR_KEEPVIRUS)) {
		O.viruses = this.viruses;
		this.viruses = list();
		for (D of each(O.viruses, T("/datum/disease"))) {
			D.affected_mob = O;
			D.holder = O;
		}
	}
	if (rt.bitAnd(tr_flags, TR_KEEPDAMAGE)) {
		yield* O.setToxLoss(this.getToxLoss(), 0);
		yield* O.adjustBruteLoss(this.getBruteLoss(), 0);
		yield* O.setOxyLoss(this.getOxyLoss(), 0);
		yield* O.setCloneLoss(this.getCloneLoss(), 0);
		yield* O.adjustFireLoss(this.getFireLoss(), 0);
		O.setBrainLoss(this.getBrainLoss(), 0);
		yield* O.updatehealth();
		O.radiation = this.radiation;
	}
	if (rt.bitAnd(tr_flags, TR_KEEPIMPLANTS)) {
		for (Y of each(this.implants)) {
			yield* (IMP_7 = Y).implant(O, null, 1);
		}
	}
	if (rt.bitAnd(tr_flags, TR_KEEPORGANS)) {
		for (X_6 of each(O.internal_organs)) {
			yield* (I = X_6).Remove(O, 1);
		}
		if (this.mind) {
			yield* this.mind.transfer_to(O);
			if (O.mind.changeling) {
				O.mind.changeling.purchasedpowers += (yield* new_(T("/obj/effect/proc_holder/changeling/humanform"), null));
			}
		}
		X_6 = null;
		for (X_6 of each(this.internal_organs)) {
			int_organs += (I = X_6);
			yield* I.Remove(this, 1);
		}
		X_6 = null;
		for (X_6 of each(int_organs)) {
			yield* (I = X_6).Insert(O, 1);
		}
	}
	let torso: Value = O.get_bodypart("chest");
	if (cavity_object) {
		torso.cavity_item = cavity_object;
		cavity_object.loc = O;
	}
	for (missing_zone of each(missing_bodyparts_zones)) {
		yield* (BP = O.get_bodypart(missing_zone)).drop_limb(1);
		if (!rt.bitAnd(tr_flags, TR_KEEPORGANS)) {
			X_9 = null;
			for (X_9 of each(O.internal_organs)) {
				G = X_9;
				if (BP.body_zone == check_zone(G.zone)) {
					if (this.mind && this.mind.changeling && rt.istype(G, T("/obj/item/organ/brain"))) {
						continue;
					}
					yield* qdel(G);
				}
			}
		}
		yield* qdel(BP);
	}
	if (this.mind) {
		yield* this.mind.transfer_to(O);
		if (O.mind.changeling) {
			O.mind.changeling.purchasedpowers += (yield* new_(T("/obj/effect/proc_holder/changeling/humanform"), null));
		}
	}
	if (rt.bitAnd(tr_flags, TR_DEFAULTMSG)) {
		to_chat(O, "<B>You are now a monkey.</B>");
	}
	for (A of each(this.loc.vars)) {
		if (rt.index(this.loc.vars, A) == this) {
			rt.setAt(this.loc.vars, A, O);
		}
	}
	f.dot = O;
	yield* qdel(this);
	return f.dot;
}, true);

// transform_procs.dm:153
rt.def("/mob/living/carbon/proc/humanize", function* humanize(f: Frame, tr_flags: Value) {
	let X: Value = null, IMP: Value = null, cavity_object: Value = null, CH: Value = null, Itemlist: Value = null, W: Value = null, C: Value = null, R: Value = null, D: Value = null, Y: Value = null, IMP_7: Value = null, X_6: Value = null, I: Value = null, HF: Value = null, missing_zone: Value = null, BP: Value = null, X_9: Value = null, G: Value = null, HF_7: Value = null, A: Value = null;
	tr_flags ??= 67;
	if (this.notransform) {
		return f.dot;
	}
	let stored_implants: Value = list();
	let int_organs: Value = list();
	if (rt.bitAnd(tr_flags, TR_KEEPIMPLANTS)) {
		for (X of each(this.implants)) {
			stored_implants += (IMP = X);
			yield* IMP.removed(this, TR_KEEPITEMS, TR_KEEPITEMS);
		}
	}
	let missing_bodyparts_zones: Value = this.get_missing_limbs();
	if ((CH = this.get_bodypart("chest")).cavity_item) {
		cavity_object = CH.cavity_item;
		CH.cavity_item = null;
	}
	if (rt.bitAnd(tr_flags, TR_KEEPITEMS)) {
		Itemlist = this.get_equipped_items();
		Itemlist += this.held_items;
		for (W of each(Itemlist, T("/obj/item"))) {
			yield* this.dropItemToGround(W, TR_KEEPITEMS);
			if (this.client) {
				this.client.screen -= W;
			}
		}
	}
	this.notransform = 1;
	this.canmove = 0;
	yield* this.Stun(22, { ignore_canstun: 1 });
	this.icon = null;
	this.cut_overlays();
	this.invisibility = INVISIBILITY_MAXIMUM;
	yield* new_(T("/obj/effect/temp_visual/monkeyify/humanify"), this.loc);
	yield* sleep(22);
	let O: Value = (yield* new_(T("/mob/living/carbon/human"), this.loc));
	for (C of each(O.loc, T("/obj/item"))) {
		yield* O.equip_to_appropriate_slot(C);
	}
	yield* this.dna.transfer_identity(O);
	yield* O.updateappearance({ mutcolor_update: 1 });
	if (cmptext("monkey", copytext(O.dna.real_name, 1, 7))) {
		O.real_name = random_unique_name(O.gender);
		O.dna.generate_unique_enzymes(O);
	} else {
		O.real_name = O.dna.real_name;
	}
	O.name = O.real_name;
	if (rt.bitAnd(tr_flags, TR_KEEPSE)) {
		O.dna.struc_enzymes = this.dna.struc_enzymes;
		R = rt.at(GLOB.mutations_list, "Monkified");
		O.dna.struc_enzymes = (yield* R.set_se(O.dna.struc_enzymes, { on: 0 }));
		yield* O.domutcheck();
	}
	if (this.suiciding) {
		O.suiciding = this.suiciding;
	}
	if (this.hellbound) {
		O.hellbound = this.hellbound;
	}
	O.loc = this.loc;
	if (rt.bitAnd(tr_flags, TR_KEEPVIRUS)) {
		O.viruses = this.viruses;
		this.viruses = list();
		for (D of each(O.viruses, T("/datum/disease"))) {
			D.affected_mob = O;
			D.holder = O;
		}
		O.med_hud_set_status();
	}
	if (rt.bitAnd(tr_flags, TR_KEEPDAMAGE)) {
		yield* O.setToxLoss(this.getToxLoss(), 0);
		yield* O.adjustBruteLoss(this.getBruteLoss(), 0);
		yield* O.setOxyLoss(this.getOxyLoss(), 0);
		yield* O.setCloneLoss(this.getCloneLoss(), 0);
		yield* O.adjustFireLoss(this.getFireLoss(), 0);
		O.setBrainLoss(this.getBrainLoss(), 0);
		yield* O.updatehealth();
		O.radiation = this.radiation;
	}
	if (rt.bitAnd(tr_flags, TR_KEEPIMPLANTS)) {
		for (Y of each(this.implants)) {
			yield* (IMP_7 = Y).implant(O, null, 1);
		}
	}
	if (rt.bitAnd(tr_flags, TR_KEEPORGANS)) {
		for (X_6 of each(O.internal_organs)) {
			yield* (I = X_6).Remove(O, 1);
		}
		if (this.mind) {
			yield* this.mind.transfer_to(O);
			if (O.mind.changeling) {
				for (HF of each(O.mind.changeling.purchasedpowers, T("/obj/effect/proc_holder/changeling/humanform"))) {
					O.mind.changeling.purchasedpowers -= HF;
				}
			}
		}
		X_6 = null;
		for (X_6 of each(this.internal_organs)) {
			int_organs += (I = X_6);
			yield* I.Remove(this, 1);
		}
		X_6 = null;
		for (X_6 of each(int_organs)) {
			yield* (I = X_6).Insert(O, 1);
		}
	}
	let torso: Value = this.get_bodypart("chest");
	if (cavity_object) {
		torso.cavity_item = cavity_object;
		cavity_object.loc = O;
	}
	for (missing_zone of each(missing_bodyparts_zones)) {
		yield* (BP = O.get_bodypart(missing_zone)).drop_limb(1);
		if (!rt.bitAnd(tr_flags, TR_KEEPORGANS)) {
			X_9 = null;
			for (X_9 of each(O.internal_organs)) {
				G = X_9;
				if (BP.body_zone == check_zone(G.zone)) {
					if (this.mind && this.mind.changeling && rt.istype(G, T("/obj/item/organ/brain"))) {
						continue;
					}
					yield* qdel(G);
				}
			}
		}
		yield* qdel(BP);
	}
	if (this.mind) {
		yield* this.mind.transfer_to(O);
		if (O.mind.changeling) {
			for (HF_7 of each(O.mind.changeling.purchasedpowers, T("/obj/effect/proc_holder/changeling/humanform"))) {
				O.mind.changeling.purchasedpowers -= HF_7;
			}
		}
	}
	O.a_intent = "help";
	if (rt.bitAnd(tr_flags, TR_DEFAULTMSG)) {
		to_chat(O, "<B>You are now a human.</B>");
	}
	f.dot = O;
	for (A of each(this.loc.vars)) {
		if (rt.index(this.loc.vars, A) == this) {
			rt.setAt(this.loc.vars, A, O);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// transform_procs.dm:303
rt.def("/mob/living/carbon/human/proc/AIize", function* AIize(f: Frame) {
	let t: Value = null;
	if (this.notransform) {
		return f.dot;
	}
	for (t of each(this.bodyparts)) {
		yield* qdel(t);
	}
	return (yield* parent_proc());
}, true);

// transform_procs.dm:311
rt.def("/mob/living/carbon/proc/AIize", function* AIize(f: Frame) {
	let W: Value = null;
	if (this.notransform) {
		return f.dot;
	}
	for (W of each(this, T("/obj/item"))) {
		yield* this.dropItemToGround(W);
	}
	yield* this.regenerate_icons();
	this.notransform = 1;
	this.canmove = 0;
	this.icon = null;
	this.invisibility = INVISIBILITY_MAXIMUM;
	return (yield* parent_proc());
}, true);

// transform_procs.dm:322
rt.def("/mob/proc/AIize", function* AIize(f: Frame, transfer_after: Value) {
	let loc_landmark: Value = null, sloc: Value = null, tripai: Value = null;
	transfer_after ??= 1;
	if (this.client) {
		this.stop_sound_channel(1024);
	}
	for (sloc of each(GLOB.landmarks_list, T("/obj/effect/landmark/start"))) {
		if (sloc.name != "AI") {
			continue;
		}
		if (rt.locateIn(f, T("/mob/living/silicon/ai"), sloc.loc)) {
			continue;
		}
		loc_landmark = sloc.loc;
	}
	if (!loc_landmark) {
		for (tripai of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
			if (tripai.name == "tripai") {
				if (rt.locateIn(f, T("/mob/living/silicon/ai"), tripai.loc)) {
					continue;
				}
				loc_landmark = tripai.loc;
			}
		}
	}
	if (!loc_landmark) {
		to_chat(this, "Oh god sorry we can't find an unoccupied AI spawn location, so we're spawning you on top of someone.");
		sloc = null;
		for (sloc of each(GLOB.landmarks_list, T("/obj/effect/landmark/start"))) {
			if (sloc.name == "AI") {
				loc_landmark = sloc.loc;
			}
		}
	}
	if (!transfer_after) {
		this.mind.active = 0;
	}
	f.dot = (yield* new_(T("/mob/living/silicon/ai"), loc_landmark, null, this));
	yield* qdel(this);
	return f.dot;
}, true);

// transform_procs.dm:353
rt.def("/mob/living/carbon/human/proc/Robotize", function* Robotize(f: Frame, delete_items: Value, transfer_after: Value) {
	let W: Value = null, t: Value = null, R: Value = null;
	delete_items ??= 0;
	transfer_after ??= 1;
	if (this.notransform) {
		return f.dot;
	}
	for (W of each(this, T("/obj/item"))) {
		if (delete_items) {
			yield* qdel(W);
		} else {
			yield* this.dropItemToGround(W);
		}
	}
	yield* this.regenerate_icons();
	this.notransform = 1;
	this.canmove = 0;
	this.icon = null;
	this.invisibility = INVISIBILITY_MAXIMUM;
	for (t of each(this.bodyparts)) {
		yield* qdel(t);
	}
	(R = (yield* new_(T("/mob/living/silicon/robot"), this.loc))).cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell"), R));
	R.cell.maxcharge = 7500;
	R.cell.charge = 7500;
	R.gender = this.gender;
	R.invisibility = 0;
	if (this.mind) {
		if (!transfer_after) {
			this.mind.active = 0;
		}
		yield* this.mind.transfer_to(R);
		// 2017 tg bug: read src.mind.special_role after transfer_to had emptied src.mind, a runtime that stopped Robotize half way (the player kept a frozen human); modern tg reads R.mind
		if (R.mind.special_role) {
			R.mind.store_memory("In case you look at this after being borged, the objectives are only here until I find a way to make them not show up for you, as I can't simply delete them without screwing up round-end reporting. --NeoFite");
		}
	} else if (transfer_after) {
		R.key = this.key;
	}
	if (GLOB.config.rename_cyborg) {
		yield* R.rename_self("cyborg");
	}
	if (R.mmi) {
		R.mmi.name = `Man-Machine Interface: ${this.real_name}`;
		if (R.mmi.brain) {
			R.mmi.brain.name = `${this.real_name}'s brain`;
		}
		if (R.mmi.brainmob) {
			R.mmi.brainmob.real_name = this.real_name;
			R.mmi.brainmob.name = this.real_name;
		}
	}
	R.loc = this.loc;
	R.job = "Cyborg";
	R.notify_ai(NEW_BORG);
	f.dot = R;
	yield* qdel(this);
	return f.dot;
}, true);

// transform_procs.dm:408
rt.def("/mob/living/carbon/human/proc/Alienize", function* Alienize(f: Frame) {
	let W: Value = null, t: Value = null, new_xeno: Value = null;
	let $e: any;
	if (this.notransform) {
		return f.dot;
	}
	for (W of each(this, T("/obj/item"))) {
		yield* this.dropItemToGround(W);
	}
	yield* this.regenerate_icons();
	this.notransform = 1;
	this.canmove = 0;
	this.icon = null;
	this.invisibility = INVISIBILITY_MAXIMUM;
	for (t of each(this.bodyparts)) {
		yield* qdel(t);
	}
	let alien_caste: Value = pick("Hunter", "Sentinel", "Drone");
	if (alien_caste === "Hunter") {
		new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/hunter"), this.loc));
	} else if (alien_caste === "Sentinel") {
		new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/sentinel"), this.loc));
	} else if (alien_caste === "Drone") {
		new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/drone"), this.loc));
	}
	new_xeno.a_intent = "harm";
	new_xeno.key = this.key;
	to_chat(new_xeno, "<B>You are now an alien.</B>");
	f.dot = new_xeno;
	yield* qdel(this);
	return f.dot;
}, true);

// transform_procs.dm:438
rt.def("/mob/living/carbon/human/proc/slimeize", function* slimeize(f: Frame, reproduce: Value) {
	let W: Value = null, t: Value = null, new_slime: Value = null, number: Value = null, babies: Value = null, i: Value = null, M: Value = null;
	if (this.notransform) {
		return f.dot;
	}
	for (W of each(this, T("/obj/item"))) {
		yield* this.dropItemToGround(W);
	}
	yield* this.regenerate_icons();
	this.notransform = 1;
	this.canmove = 0;
	this.icon = null;
	this.invisibility = INVISIBILITY_MAXIMUM;
	for (t of each(this.bodyparts)) {
		yield* qdel(t);
	}
	if (reproduce) {
		number = rt.op(f, "PickWeighted", [3], [14, 2, 100, 3, 100, 4]);
		babies = list();
		i = 1;
		while (i <= number) {
			(M = (yield* new_(T("/mob/living/simple_animal/slime"), this.loc))).nutrition = round(this.nutrition / number);
			yield* step_away(M, this);
			babies += M;
			i++;
		}
		new_slime = pick(babies);
	} else {
		new_slime = (yield* new_(T("/mob/living/simple_animal/slime"), this.loc));
	}
	new_slime.a_intent = "harm";
	new_slime.key = this.key;
	to_chat(new_slime, "<B>You are now a slime. Skreee!</B>");
	f.dot = new_slime;
	yield* qdel(this);
	return f.dot;
}, true);

// transform_procs.dm:468
rt.def("/mob/proc/become_overmind", function* become_overmind(f: Frame, mode_made: Value, starting_points: Value) {
	starting_points ??= 60;
	let B: Value = (yield* new_(T("/mob/camera/blob"), this.loc, 0, mode_made, starting_points));
	if (this.mind) {
		yield* this.mind.transfer_to(B);
	} else {
		B.key = this.key;
	}
	f.dot = B;
	yield* qdel(this);
	return f.dot;
}, true);

// transform_procs.dm:480
rt.def("/mob/living/carbon/human/proc/corgize", function* corgize(f: Frame) {
	let W: Value = null, t: Value = null, new_corgi: Value = null;
	if (this.notransform) {
		return f.dot;
	}
	for (W of each(this, T("/obj/item"))) {
		yield* this.dropItemToGround(W);
	}
	yield* this.regenerate_icons();
	this.notransform = 1;
	this.canmove = 0;
	this.icon = null;
	this.invisibility = INVISIBILITY_MAXIMUM;
	for (t of each(this.bodyparts)) {
		yield* qdel(t);
	}
	(new_corgi = (yield* new_(T("/mob/living/simple_animal/pet/dog/corgi"), this.loc))).a_intent = "harm";
	new_corgi.key = this.key;
	to_chat(new_corgi, "<B>You are now a Corgi. Yap Yap!</B>");
	f.dot = new_corgi;
	yield* qdel(this);
	return f.dot;
}, true);

// transform_procs.dm:500
rt.def("/mob/living/carbon/human/proc/Animalize", function* Animalize(f: Frame) {
	let mobpath: Value = null, W: Value = null, t: Value = null, new_mob: Value = null;
	let mobtypes: Value = typesof(T("/mob/living/simple_animal"));
	if (!this.safe_animal((mobpath = (yield* g.op(f, "Prompt", [0], [null, null, "Choose a type", `Which type of mob should ${this} turn into?`, mobtypes]))))) {
		to_chat(f.usr, "<span class='danger'>Sorry but this mob type is currently unavailable.</span>");
		return f.dot;
	}
	if (this.notransform) {
		return f.dot;
	}
	for (W of each(this, T("/obj/item"))) {
		yield* this.dropItemToGround(W);
	}
	yield* this.regenerate_icons();
	this.notransform = 1;
	this.canmove = 0;
	this.icon = null;
	this.invisibility = INVISIBILITY_MAXIMUM;
	for (t of each(this.bodyparts)) {
		yield* qdel(t);
	}
	(new_mob = (yield* new_(mobpath, this.loc))).key = this.key;
	new_mob.a_intent = "harm";
	to_chat(new_mob, "You suddenly feel more... animalistic.");
	f.dot = new_mob;
	yield* qdel(this);
	return f.dot;
}, true);

// transform_procs.dm:533
rt.def("/mob/proc/Animalize", function* Animalize(f: Frame) {
	let mobpath: Value = null, new_mob: Value = null;
	let mobtypes: Value = typesof(T("/mob/living/simple_animal"));
	if (!this.safe_animal((mobpath = (yield* g.op(f, "Prompt", [0], [null, null, "Choose a type", `Which type of mob should ${this} turn into?`, mobtypes]))))) {
		to_chat(f.usr, "<span class='danger'>Sorry but this mob type is currently unavailable.</span>");
		return f.dot;
	}
	(new_mob = (yield* new_(mobpath, this.loc))).key = this.key;
	new_mob.a_intent = "harm";
	to_chat(new_mob, "You feel more... animalistic");
	f.dot = new_mob;
	yield* qdel(this);
	return f.dot;
}, true);

// transform_procs.dm:557
rt.def("/mob/proc/safe_animal", function safe_animal(f: Frame, MP: Value) {
	if (!MP) {
		return 0;
	}
	if (ispath(MP, T("/mob/living/simple_animal/hostile/construct"))) {
		return 0;
	}
	if (ispath(MP, T("/mob/living/simple_animal/pet/cat"))) {
		return 1;
	}
	if (ispath(MP, T("/mob/living/simple_animal/pet/dog/corgi"))) {
		return 1;
	}
	if (ispath(MP, T("/mob/living/simple_animal/crab"))) {
		return 1;
	}
	if (ispath(MP, T("/mob/living/simple_animal/hostile/carp"))) {
		return 1;
	}
	if (ispath(MP, T("/mob/living/simple_animal/hostile/mushroom"))) {
		return 1;
	}
	if (ispath(MP, T("/mob/living/simple_animal/shade"))) {
		return 1;
	}
	if (ispath(MP, T("/mob/living/simple_animal/hostile/killertomato"))) {
		return 1;
	}
	if (ispath(MP, T("/mob/living/simple_animal/mouse"))) {
		return 1;
	}
	if (ispath(MP, T("/mob/living/simple_animal/hostile/bear"))) {
		return 1;
	}
	if (ispath(MP, T("/mob/living/simple_animal/parrot"))) {
		return 1;
	}
	return 0;
});
