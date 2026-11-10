// Based on /tg/station's code/modules/admin/verbs/onlyone.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// onlyone.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalhighlander", function InitGlobalhighlander(f: Frame) {
	GLOB.highlander = 0;
	this.gvars_datum_init_order += "highlander";
	return f.dot;
});

// onlyone.dm:3
rt.def("/client/proc/only_one", function* only_one(f: Frame) {
	let N: Value = null, H: Value = null;
	if (!GLOB.SSticker.HasRoundStarted()) {
		yield* alert("The game hasn't started yet!");
		return f.dot;
	}
	GLOB.highlander = 1;
	send_to_playing_players("<span class='boldannounce'><font size=6>THERE CAN BE ONLY ONE</font></span>");
	for (N of each(GLOB.poi_list, T("/obj/item/weapon/disk/nuclear"))) {
		yield* N.relocate();
	}
	for (H of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
		if (H.stat == 2 || !H.client) {
			continue;
		}
		yield* H.make_scottish();
	}
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} used THERE CAN BE ONLY ONE!</span>`);
	log_admin(`${key_name(f.usr)} used THERE CAN BE ONLY ONE.`);
	yield* addtimer((yield* new_(T("/datum/callback"), GLOB.SSshuttle.emergency, P("/obj/docking_port/mobile/emergency/proc/request"), null, 1)), 50);
	return f.dot;
}, true);

// onlyone.dm:23
rt.def("/client/proc/only_one_delayed", function* only_one_delayed(f: Frame) {
	send_to_playing_players("<span class='userdanger'>Bagpipes begin to blare. You feel Scottish pride coming over you.</span>");
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} used (delayed) THERE CAN BE ONLY ONE!</span>`);
	log_admin(`${key_name(f.usr)} used delayed THERE CAN BE ONLY ONE.`);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/client/proc/only_one"))), 420);
	return f.dot;
}, true);

// onlyone.dm:29
rt.def("/mob/living/carbon/human/proc/make_scottish", function* make_scottish(f: Frame) {
	let steal_objective: Value = null, hijack_objective: Value = null, I: Value = null, _P: Value = null, W: Value = null, antiwelder: Value = null;
	GLOB.SSticker.mode.traitors += this.mind;
	this.mind.special_role = "highlander";
	(rt.modField(f, this.dna.species, "species_traits", NOGUNS, rt.bitOr));
	(steal_objective = (yield* new_(T("/datum/objective/steal")))).owner = this.mind;
	yield* steal_objective.set_target((yield* new_(T("/datum/objective_item/steal/nukedisc"))));
	this.mind.objectives += steal_objective;
	(hijack_objective = (yield* new_(T("/datum/objective/hijack")))).explanation_text = "Escape on the shuttle alone. Ensure that nobody else makes it out.";
	hijack_objective.owner = this.mind;
	this.mind.objectives += hijack_objective;
	this.mind.announce_objectives();
	for (I of each(this.get_equipped_items(), T("/obj/item"))) {
		yield* qdel(I);
	}
	I = null;
	for (I of each(this.held_items, T("/obj/item"))) {
		yield* qdel(I);
	}
	yield* this.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/kilt/highlander"), this)), slot_w_uniform);
	yield* this.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset/heads/captain"), this)), slot_ears);
	yield* this.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/beret/highlander"), this)), slot_head);
	yield* this.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/combat"), this)), slot_shoes);
	yield* this.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/pinpointer"), this)), slot_l_store);
	for (_P of each(this, T("/obj/item/weapon/pinpointer"))) {
		yield* _P.attack_self(this);
	}
	(W = (yield* new_(T("/obj/item/weapon/card/id"), this))).icon_state = "centcom";
	W.access = get_all_accesses();
	W.access += get_all_centcom_access();
	W.assignment = "Highlander";
	W.registered_name = this.real_name;
	(rt.modField(f, W, "flags", NODROP, rt.bitOr));
	W.update_label(this.real_name);
	yield* this.equip_to_slot_or_del(W, slot_wear_id);
	let H1: Value = (yield* new_(T("/obj/item/weapon/claymore/highlander"), this));
	if (!GLOB.highlander) {
		H1.admin_spawned = 1;
	}
	yield* this.put_in_hands(H1);
	yield* H1.pickup(this);
	(antiwelder = (yield* new_(T("/obj/item/weapon/bloodcrawl"), this))).name = "compulsion of honor";
	antiwelder.desc = "You are unable to hold anything in this hand until you're the last one left!";
	antiwelder.icon_state = "bloodhand_right";
	yield* this.put_in_hands(antiwelder);
	to_chat(this, `<span class='boldannounce'>Your ${H1.name} cries out for blood. Claim the lives of others, and your own will be restored!\nActivate it in your hand, and it will lead to the nearest target. Attack the nuclear authentication disk with it, and you will store it.</span>`);
	return f.dot;
}, true);

// onlyone.dm:82
rt.def("/proc/only_me", function* only_me(f: Frame) {
	let H: Value = null, hijack_objective: Value = null, G: Value = null, slot_item_ID: Value = null, slot_item_hand: Value = null, multi: Value = null, W: Value = null;
	if (!GLOB.SSticker.HasRoundStarted()) {
		yield* alert("The game hasn't started yet!");
		return f.dot;
	}
	for (H of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
		if (H.stat == 2 || !H.client) {
			continue;
		}
		if (is_special_character(H)) {
			continue;
		}
		GLOB.SSticker.mode.traitors += H.mind;
		H.mind.special_role = `${H.real_name} Prime`;
		(hijack_objective = (yield* new_(T("/datum/objective/hijackclone")))).owner = H.mind;
		H.mind.objectives += hijack_objective;
		to_chat(H, "<B>You are the multiverse summoner. Activate your blade to summon copies of yourself from another universe to fight by your side.</B>");
		H.mind.announce_objectives();
		G = (yield* new_(T("/datum/gang/multiverse"), this, `${H.real_name}`));
		GLOB.SSticker.mode.gangs += G;
		rt.setAt(G.bosses, H.mind, 0);
		G.add_gang_hud(H.mind);
		H.mind.gang_datum = G;
		yield* qdel((slot_item_ID = H.get_item_by_slot(slot_wear_id)));
		slot_item_hand = H.get_item_for_held_index(2);
		yield* H.dropItemToGround(slot_item_hand);
		multi = (yield* new_(T("/obj/item/weapon/multisword"), H));
		yield* H.put_in_hands_or_del(multi);
		(W = (yield* new_(T("/obj/item/weapon/card/id"), H))).icon_state = "centcom";
		W.access = get_all_accesses();
		W.access += get_all_centcom_access();
		W.assignment = "Multiverse Summoner";
		W.registered_name = H.real_name;
		W.update_label(H.real_name);
		yield* H.equip_to_slot_or_del(W, slot_wear_id);
	}
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} used THERE CAN BE ONLY ME!</span>`);
	log_admin(`${key_name(f.usr)} used there can be only me.`);
	return f.dot;
}, true);
