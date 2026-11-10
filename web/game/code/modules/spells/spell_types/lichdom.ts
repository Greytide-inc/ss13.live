// Based on /tg/station's code/modules/spells/spell_types/lichdom.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11325, "/obj/effect/proc_holder/spell/targeted/lichdom", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 1,
	name: "Bind Soul",
	desc: "A dark necromantic pact that can forever bind your soul to an item of your choosing. So long as both your body and the item remain intact and on the same plane you can revive from death, though the time between reincarnations grows steadily with use, along with the weakness that the new skeleton body will experience upon 'birth'. Note that becoming a lich destroys all internal organs except the brain.",
	school: "necromancy",
	charge_max: 10,
	clothes_req: 0,
	centcom_cancast: 0,
	invocation: "NECREM IMORTIUM!",
	invocation_type: "shout",
	range: -1,
	level_max: 0,
	cooldown_min: 10,
	action_icon_state: "skeleton",
});

// lichdom.dm:23
rt.def("/obj/effect/proc_holder/spell/targeted/lichdom/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let M: Value = null, hand_items: Value = null, marked_item: Value = null, item: Value = null, H: Value = null;
	let $0: any, $1: any, $e: any;
	user ??= f.usr;
	for (M of each(targets, T("/mob"))) {
		hand_items = list();
		if (rt.istype(M, T("/mob/living/carbon"))) {
			hand_items = list(M.get_active_held_item(), M.get_inactive_held_item());
		}
		if (!rt.len(f, hand_items)) {
			to_chat(M, "<span class='caution'>You must hold an item you wish to make your phylactery...</span>");
			return f.dot;
		}
		marked_item = null;
		item = null;
		for (item of each(hand_items, T("/obj"))) {
			$0 = (rt.isIn(f, ABSTRACT, (item.flags || NODROP)) ? 1 : 0);
			$1 = item.flags;
			if (!$1) {
				if (item.secondary_flags) {
					$1 = rt.index(item.secondary_flags, "stationloving");
				} else {
					$1 = 0;
				}
			}
			if (rt.isIn(f, $0, $1)) {
				continue;
			}
			marked_item = item;
			to_chat(M, `<span class='warning'>You begin to focus your very being into ${item}...</span>`);
			break;
		}
		if (!marked_item) {
			to_chat(M, "<span class='warning'>None of the items you hold are suitable for emplacement of your fragile soul.</span>");
			return f.dot;
		}
		playsound(user, rt.rsc("sound/effects/pope_entry.ogg"), 100);
		if (!(yield* do_after(M, 50, { needhand: 0, target: marked_item }))) {
			to_chat(M, `<span class='warning'>Your soul snaps back to your body as you stop ensouling ${marked_item}!</span>`);
			return f.dot;
		}
		marked_item.name = `ensouled ${marked_item.name}`;
		marked_item.desc += "\nA terrible aura surrounds this item, its very existence is offensive to life itself...";
		marked_item.add_atom_colour("#003300", ADMIN_COLOUR_PRIORITY);
		yield* new_(T("/obj/item/phylactery"), marked_item, M.mind);
		to_chat(M, "<span class='userdanger'>With a hideous feeling of emptiness you watch in horrified fascination as skin sloughs off bone! Blood boils, nerves disintegrate, eyes boil in their sockets! As your organs crumble to dust in your fleshless chest you come to terms with your choice. You're a lich!</span>");
		yield* M.set_species(T("/datum/species/skeleton"));
		if (rt.istype(M, T("/mob/living/carbon/human"))) {
			yield* (H = M).dropItemToGround(H.w_uniform);
			yield* H.dropItemToGround(H.wear_suit);
			yield* H.dropItemToGround(H.head);
			yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/suit/wizrobe/black"), H)), slot_wear_suit);
			yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/wizard/black"), H)), slot_head);
			yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/color/black"), H)), slot_w_uniform);
		}
		yield* M.mind.RemoveSpell(this);
	}
	return f.dot;
}, true);

rt.type(10162, "/obj/item/phylactery", "/obj/item", {
	lon_range: 3,
	resurrections: 0,
	mind: null,
	respawn_time: 1800,
	light_color: "#003300",
	name: "phylactery",
	desc: "Stores souls. Revives liches. Also repels mosquitos.",
	icon: rt.rsc("icons/obj/projectiles.dmi"),
	icon_state: "bluespace",
	color: "#003300",
}, { global: { active_phylacteries: 744 } });

// lichdom.dm:88
rt.def("/obj/item/phylactery/proc/Initialize", function* Initialize(f: Frame, mapload: Value, newmind: Value) {
	f.dot = (yield* parent_proc());
	this.mind = newmind;
	this.name = `phylactery of ${this.mind.name}`;
	GLOB.active_phylacteries++;
	(rt.modGl("poi_list", this, rt.bitOr));
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	this.set_light(this.lon_range);
	if (!rt.initial(f, GLOB.SSticker.mode, "round_ends_with_antag_death")) return f.dot;
	GLOB.SSticker.mode.round_ends_with_antag_death = 0;
	return f.dot;
}, true);

// lichdom.dm:100
rt.def("/obj/item/phylactery/proc/Destroy", function* Destroy(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	GLOB.active_phylacteries--;
	GLOB.poi_list -= this;
	if (!GLOB.active_phylacteries) {
		GLOB.SSticker.mode.round_ends_with_antag_death = rt.initial(f, GLOB.SSticker.mode, "round_ends_with_antag_death");
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["force"] });

// lichdom.dm:108
rt.def("/obj/item/phylactery/proc/process", function* process(f: Frame) {
	if (!this.mind || this.mind.gc_destroyed) {
		yield* qdel(this);
		return f.dot;
	}
	if (!(!this.mind.current || this.mind.current && this.mind.current.stat == 2)) return f.dot;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/phylactery/proc/rise"))), this.respawn_time, 1);
	return f.dot;
}, true, { waitfor: false });

// lichdom.dm:116
rt.def("/obj/item/phylactery/proc/rise", function* rise(f: Frame) {
	let item_turf: Value = null, lich: Value = null, C: Value = null, W: Value = null, X: Value = null, I: Value = null, wheres_wizdo: Value = null;
	if (this.mind.current && this.mind.current.stat != 2) {
		return `${this.mind} already has a living body: ${this.mind.current}`;
	}
	if (!(item_turf = rt.getStep(f, this, 0))) {
		return `${this} is not at a turf? NULLSPACE!?`;
	}
	let old_body: Value = this.mind.current;
	yield* (lich = (yield* new_(T("/mob/living/carbon/human"), item_turf))).equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/sandal/magic"), lich)), slot_shoes);
	yield* lich.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/color/black"), lich)), slot_w_uniform);
	yield* lich.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/suit/wizrobe/black"), lich)), slot_wear_suit);
	yield* lich.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/wizard/black"), lich)), slot_head);
	lich.real_name = this.mind.name;
	yield* this.mind.transfer_to(lich);
	yield* this.mind.grab_ghost({ force: 1 });
	yield* lich.hardset_dna(null, null, lich.real_name, null, T("/datum/species/skeleton"));
	to_chat(lich, "<span class='warning'>Your bones clatter and shutter as you are pulled back into this world!</span>");
	let body_turf: Value = rt.getStep(f, old_body, 0);
	yield* lich.Knockdown(200 + 200 * this.resurrections);
	this.resurrections++;
	if (old_body && old_body.loc) {
		if (rt.istype(old_body, T("/mob/living/carbon"))) {
			C = old_body;
			for (W of each(C, T("/obj/item"))) {
				yield* C.dropItemToGround(W);
			}
			for (X of each(C.internal_organs)) {
				yield* (I = X).Remove(C);
				yield* I.forceMove(body_turf);
			}
		}
		if (wheres_wizdo = dir2text(rt.getDir(f, body_turf, item_turf))) {
			old_body.visible_message(`<span class='warning'>Suddenly ${old_body.name}'s corpse falls to pieces! You see a strange energy rise from the remains, and speed off towards the ${wheres_wizdo}!</span>`);
			yield* body_turf.Beam(item_turf, { icon_state: "lichbeam", time: 10 + 10 * this.resurrections, maxdistance: 1e+31 });
		}
		yield* old_body.dust();
	}
	return `Respawn of ${this.mind} successful.`;
}, true);
