// Based on /tg/station's code/modules/mob/living/carbon/carbon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


// carbon.dm:5
rt.def("/mob/living/carbon/proc/Initialize", function* Initialize(f: Frame) {
	yield* this.create_reagents(1000);
	yield* this.update_body_parts();
	yield* parent_proc();
	return f.dot;
}, true);

// carbon.dm:10
rt.def("/mob/living/carbon/proc/Destroy", function* Destroy(f: Frame) {
	let guts: Value = null, food: Value = null, BP: Value = null, imp: Value = null;
	for (guts of each(this.internal_organs)) {
		yield* qdel(guts);
	}
	for (food of each(this.stomach_contents, T("/atom/movable"))) {
		yield* qdel(food);
	}
	for (BP of each(this.bodyparts)) {
		yield* qdel(BP);
	}
	for (imp of each(this.implants)) {
		yield* qdel(imp);
	}
	this.bodyparts = list();
	this.remove_from_all_data_huds();
	if (this.dna) {
		yield* qdel(this.dna);
	}
	return (yield* parent_proc());
}, true);

// carbon.dm:25
rt.def("/mob/living/carbon/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	let I: Value = null, BP: Value = null, A: Value = null;
	if (!rt.isIn(f, user, this.stomach_contents)) return f.dot;
	if (!prob(40)) return f.dot;
	if (prob(25)) {
		this.audible_message(`<span class='warning'>You hear something rumbling inside ${this}'s stomach...</span>`, "<span class='warning'>You hear something rumbling.</span>", 4, "<span class='userdanger'>Something is rumbling inside your stomach!</span>");
	}
	if (!((I = user.get_active_held_item()) && I.force)) return f.dot;
	let d: Value = rand(round(I.force / 4), I.force);
	if (yield* (BP = this.get_bodypart("chest")).receive_damage(d, 0)) {
		this.update_damage_overlays();
	}
	this.visible_message(`<span class='danger'>${user} attacks ${this}'s stomach wall with the ${I.name}!</span>`, `<span class='userdanger'>${user} attacks your stomach wall with the ${I.name}!</span>`);
	playsound(user.loc, rt.rsc("sound/effects/attackblob.ogg"), 50, 1);
	if (!prob(this.getBruteLoss() - 50)) return f.dot;
	for (A of each(this.stomach_contents, T("/atom/movable"))) {
		A.loc = this.loc;
		yield* this.stomach_contents.Remove(A);
	}
	yield* this.gib();
	return f.dot;
}, true);

// carbon.dm:49
rt.def("/mob/living/carbon/proc/swap_hand", function swap_hand(f: Frame, held_index: Value) {
	let item_in_hand: Value = null, H: Value = null;
	if (!held_index) {
		held_index = this.active_hand_index % rt.len(f, this.held_items) + 1;
	}
	if (item_in_hand = this.get_active_held_item()) {
		if (rt.istype(item_in_hand, T("/obj/item/weapon/twohanded"))) {
			if (item_in_hand.wielded == 1) {
				to_chat(f.usr, `<span class='warning'>Your other hand is too busy holding the ${item_in_hand.name}</span>`);
				return f.dot;
			}
		}
	}
	let oindex: Value = this.active_hand_index;
	this.active_hand_index = held_index;
	if (!this.hud_used) return f.dot;
	if (H = rt.index(this.hud_used.hand_slots, `${oindex}`)) {
		H.update_icon();
	}
	if (!(H = rt.index(this.hud_used.hand_slots, `${held_index}`))) return f.dot;
	H.update_icon();
	return f.dot;
});

// carbon.dm:87
rt.def("/mob/living/carbon/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let S: Value = null;
	if (this.lying && rt.len(f, this.surgeries)) {
		if (user != this && user.a_intent == "help") {
			for (S of each(this.surgeries, T("/datum/surgery"))) {
				if (yield* S.next_step(user)) {
					return 1;
				}
			}
		}
	}
	return (yield* parent_proc());
}, true);

// carbon.dm:95
rt.def("/mob/living/carbon/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value, throwingdatum: Value) {
	let D: Value = null, R: Value = null, victim: Value = null;
	f.dot = (yield* parent_proc());
	let hurt: Value = 1;
	if (rt.istype(throwingdatum, T("/datum/thrownthing"))) {
		if (rt.istype((D = throwingdatum).thrower, T("/mob/living/silicon/robot"))) {
			if (!(R = D.thrower).emagged) {
				hurt = 0;
			}
		}
	}
	if (hit_atom.density && isturf(hit_atom)) {
		if (hurt) {
			yield* this.Knockdown(20);
			yield* this.take_bodypart_damage(10);
		}
	}
	if (!(rt.istype(hit_atom, T("/mob/living/carbon")) && hit_atom != this)) return f.dot;
	if (rt.bitAnd((victim = hit_atom).movement_type, 2)) {
		return f.dot;
	}
	if (hurt) {
		yield* victim.take_bodypart_damage(10);
		yield* this.take_bodypart_damage(10);
		yield* victim.Knockdown(20);
		yield* this.Knockdown(20);
		this.visible_message(`<span class='danger'>${this} crashes into ${victim}, knocking them both over!</span>`, `<span class='userdanger'>You violently crash into ${victim}!</span>`);
	}
	playsound(this, rt.rsc("sound/weapons/punch1.ogg"), 50, 1);
	return f.dot;
}, true, { waitfor: false });

// carbon.dm:125
rt.def("/mob/living/carbon/proc/toggle_throw_mode", function toggle_throw_mode(f: Frame) {
	if (this.stat) {
		return f.dot;
	}
	if (this.in_throw_mode) {
		this.throw_mode_off();
	} else {
		this.throw_mode_on();
	}
	return f.dot;
});

// carbon.dm:132
rt.def("/mob/living/carbon/proc/throw_mode_off", function throw_mode_off(f: Frame) {
	this.in_throw_mode = 0;
	if (!(this.client && this.hud_used)) return f.dot;
	this.hud_used.throw_icon.icon_state = "act_throw_off";
	return f.dot;
});

// carbon.dm:138
rt.def("/mob/living/carbon/proc/throw_mode_on", function throw_mode_on(f: Frame) {
	this.in_throw_mode = 1;
	if (!(this.client && this.hud_used)) return f.dot;
	this.hud_used.throw_icon.icon_state = "act_throw_on";
	return f.dot;
});

// carbon.dm:145
rt.def("/mob/living/carbon/proc/throw_item", function* throw_item(f: Frame, target: Value) {
	let thrown_thing: Value = null, I: Value = null, throwable_mob: Value = null, start_T: Value = null, end_T: Value = null, start_T_descriptor: Value = null, end_T_descriptor: Value = null;
	this.throw_mode_off();
	if (!target || !isturf(this.loc)) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj/screen"))) {
		return f.dot;
	}
	if (!(I = this.get_active_held_item())) {
		if (this.pulling && rt.istype(this.pulling, T("/mob/living")) && this.grab_state >= 1) {
			if (!(throwable_mob = this.pulling).buckled) {
				thrown_thing = throwable_mob;
				yield* this.stop_pulling();
				start_T = rt.getStep(f, this.loc, 0);
				end_T = rt.getStep(f, target, 0);
				if (start_T && end_T) {
					start_T_descriptor = `<font color='#6b5d00'>tile at ${start_T.x}, ${start_T.y}, ${start_T.z} in area ${get_area(start_T)}</font>`;
					end_T_descriptor = `<font color='#6b4400'>tile at ${end_T.x}, ${end_T.y}, ${end_T.z} in area ${get_area(end_T)}</font>`;
					yield* add_logs(this, throwable_mob, "thrown", { addition: `from ${start_T_descriptor} with the target ${end_T_descriptor}` });
				}
			}
		}
	} else if (!rt.bitAnd(I.flags, 130)) {
		thrown_thing = I;
		yield* this.dropItemToGround(I);
	}
	if (!thrown_thing) return f.dot;
	this.visible_message(`<span class='danger'>${this} has thrown ${thrown_thing}.</span>`);
	yield* this.newtonian_move(rt.getDir(f, target, this));
	yield* thrown_thing.throw_at(target, thrown_thing.throw_range, thrown_thing.throw_speed, this);
	return f.dot;
}, true);

// carbon.dm:177
rt.def("/mob/living/carbon/proc/restrained", function restrained(f: Frame, ignore_grab: Value) {
	f.dot = (this.handcuffed || (((!ignore_grab ? 1 : 0) && this.pulledby) && (this.pulledby.grab_state >= 1 ? 1 : 0)));
	return f.dot;
});

// carbon.dm:184
rt.def("/mob/living/carbon/proc/show_inv", function* show_inv(f: Frame, user: Value) {
	yield* user.set_machine(this);
	// tg_js: one `strip` tgui window instead of the HTML popup (modules/mob/strip.ts)
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// carbon.dm:215
rt.def("/mob/living/carbon/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ITEM: Value = null;
	let $1: any, $2: any;
	yield* parent_proc();
	if (!f.usr.canUseTopic(this, BE_CLOSE, NO_DEXTERY)) return f.dot;
	if (!rt.at(href_list, "internal")) return f.dot;
	let slot: Value = text2num(rt.at(href_list, "internal"));
	if (!((ITEM = this.get_item_by_slot(slot)) && rt.istype(ITEM, T("/obj/item/weapon/tank")) && this.wear_mask && rt.bitAnd(this.wear_mask.flags, MASKINTERNALS))) return f.dot;
	let $0: any = f.usr;
	if (this.internal) {
		$1 = "close";
	} else {
		$1 = "open";
	}
	$0 = `<span class='danger'>${$0} tries to ${$1} the valve on ${this}'s ${ITEM.name}.</span>`;
	$1 = f.usr;
	if (this.internal) {
		$2 = "close";
	} else {
		$2 = "open";
	}
	this.visible_message($0, `<span class='userdanger'>${$1} tries to ${$2} the valve on ${this}'s ${ITEM.name}.</span>`);
	if (!(yield* do_mob(f.usr, this, POCKET_STRIP_DELAY))) return f.dot;
	if (this.internal) {
		this.internal = null;
		this.update_internals_hud_icon(0);
	} else if (ITEM && rt.istype(ITEM, T("/obj/item/weapon/tank"))) {
		if (this.wear_mask && rt.bitAnd(this.wear_mask.flags, MASKINTERNALS) || this.getorganslot("breathing_tube")) {
			this.internal = ITEM;
			this.update_internals_hud_icon(1);
		}
	}
	$0 = f.usr;
	$0 = `<span class='danger'>${$0} ${this.internal ? "opens" : "closes"} the valve on ${this}'s ${ITEM.name}.</span>`;
	$1 = f.usr;
	if (this.internal) {
		$2 = "opens";
	} else {
		$2 = "closes";
	}
	this.visible_message($0, `<span class='userdanger'>${$1} ${$2} the valve on ${this}'s ${ITEM.name}.</span>`);
	return f.dot;
}, true);

// carbon.dm:238
rt.def("/mob/living/carbon/proc/fall", function fall(f: Frame, forced: Value) {
	this.loc.handle_fall(this, forced);
	return f.dot;
});

// carbon.dm:241
rt.def("/mob/living/carbon/proc/is_muzzled", function is_muzzled(f: Frame) {
	return (rt.istype(this.wear_mask, T("/obj/item/clothing/mask/muzzle")) ? 1 : 0);
});

// carbon.dm:244
rt.def("/mob/living/carbon/proc/resist_buckle", function* resist_buckle(f: Frame) {
	if (this.restrained()) {
		this.changeNext_move(100);
		this.last_special = rt.worldTime(f) + 100;
		this.visible_message(`<span class='warning'>${this} attempts to unbuckle themself!</span>`, "<span class='notice'>You attempt to unbuckle yourself... (This will take around one minute and you need to stay still.)</span>");
		if (yield* do_after(this, 600, 0, { target: this })) {
			if (!this.buckled) {
				return f.dot;
			}
			yield* this.buckled.user_unbuckle_mob(this, this);
		} else if (this && this.buckled) {
			to_chat(this, "<span class='warning'>You fail to unbuckle yourself!</span>");
		}
	} else {
		yield* this.buckled.user_unbuckle_mob(this, this);
	}
	return f.dot;
}, true);

// carbon.dm:260
rt.def("/mob/living/carbon/proc/resist_fire", function* resist_fire(f: Frame) {
	this.fire_stacks -= 5;
	yield* this.Knockdown(60, 1, 1);
	yield* this.spin(32, 2);
	this.visible_message(`<span class='danger'>${this} rolls on the floor, trying to put themselves out!</span>`, "<span class='notice'>You stop, drop, and roll!</span>");
	yield* sleep(30);
	if (this.fire_stacks <= 0) {
		this.visible_message(`<span class='danger'>${this} has successfully extinguished themselves!</span>`, "<span class='notice'>You extinguish yourself.</span>");
		yield* this.ExtinguishMob();
	}
	return f.dot;
}, true);

// carbon.dm:276
rt.def("/mob/living/carbon/proc/resist_restraints", function* resist_restraints(f: Frame) {
	let I: Value = null;
	let type: Value = 0;
	if (this.handcuffed) {
		I = this.handcuffed;
		type = 1;
	} else if (this.legcuffed) {
		I = this.legcuffed;
		type = 2;
	}
	if (!I) return f.dot;
	if (type == 1) {
		this.changeNext_move(100);
		this.last_special = rt.worldTime(f) + 100;
	}
	if (type == 2) {
		this.changeNext_move(4);
		this.last_special = rt.worldTime(f) + 4;
	}
	yield* this.cuff_resist(I);
	return f.dot;
}, true);

// carbon.dm:293
rt.def("/mob/living/carbon/proc/cuff_resist", function* cuff_resist(f: Frame, I: Value, breakouttime: Value, cuff_break: Value) {
	breakouttime ??= 600;
	cuff_break ??= 0;
	breakouttime = I.breakouttime;
	let displaytime: Value = breakouttime / 600;
	if (!cuff_break) {
		this.visible_message(`<span class='warning'>${this} attempts to remove ${I}!</span>`);
		to_chat(this, `<span class='notice'>You attempt to remove ${I}... (This will take around ${displaytime} minutes and you need to stand still.)</span>`);
		if (yield* do_after(this, breakouttime, 0, { target: this })) {
			yield* this.clear_cuffs(I, cuff_break);
		} else {
			to_chat(this, `<span class='warning'>You fail to remove ${I}!</span>`);
		}
	} else if (cuff_break == 1) {
		breakouttime = 50;
		this.visible_message(`<span class='warning'>${this} is trying to break ${I}!</span>`);
		to_chat(this, `<span class='notice'>You attempt to break ${I}... (This will take around 5 seconds and you need to stand still.)</span>`);
		if (yield* do_after(this, breakouttime, 0, { target: this })) {
			yield* this.clear_cuffs(I, cuff_break);
		} else {
			to_chat(this, `<span class='warning'>You fail to break ${I}!</span>`);
		}
	} else {
		if (cuff_break != 2) return f.dot;
		yield* this.clear_cuffs(I, cuff_break);
	}
	return f.dot;
}, true);

// carbon.dm:316
rt.def("/mob/living/carbon/proc/uncuff", function* uncuff(f: Frame) {
	let W: Value = null;
	if (this.handcuffed) {
		W = this.handcuffed;
		this.handcuffed = null;
		if (this.buckled && this.buckled.buckle_requires_restraints) {
			yield* this.buckled.unbuckle_mob(this);
		}
		yield* this.update_handcuffed();
		if (this.client) {
			this.client.screen -= W;
		}
		if (W) {
			W.loc = this.loc;
			yield* W.dropped(this);
			if (W) {
				W.layer = rt.initial(f, W, "layer");
				W.plane = rt.initial(f, W, "plane");
			}
		}
		this.changeNext_move(0);
	}
	if (!this.legcuffed) return f.dot;
	W = this.legcuffed;
	this.legcuffed = null;
	yield* this.update_inv_legcuffed();
	if (this.client) {
		this.client.screen -= W;
	}
	if (W) {
		W.loc = this.loc;
		yield* W.dropped(this);
		if (W) {
			W.layer = rt.initial(f, W, "layer");
			W.plane = rt.initial(f, W, "plane");
		}
	}
	this.changeNext_move(0);
	return f.dot;
}, true);

// carbon.dm:345
rt.def("/mob/living/carbon/proc/clear_cuffs", function* clear_cuffs(f: Frame, I: Value, cuff_break: Value) {
	if (!I.loc || this.buckled) {
		return f.dot;
	}
	let $0: any = this;
	this.visible_message(`<span class='danger'>${$0} manages to ${cuff_break ? "break" : "remove"} ${I}!</span>`);
	to_chat(this, `<span class='notice'>You successfully ${cuff_break ? "break" : "remove"} ${I}.</span>`);
	if (cuff_break) {
		yield* qdel(I);
		if (I == this.handcuffed) {
			this.handcuffed = null;
			yield* this.update_handcuffed();
			return f.dot;
		} else if (I == this.legcuffed) {
			this.legcuffed = null;
			yield* this.update_inv_legcuffed();
			return f.dot;
		}
		return 1;
	} else {
		if (I == this.handcuffed) {
			this.handcuffed.loc = this.loc;
			yield* this.handcuffed.dropped(this);
			this.handcuffed = null;
			if (this.buckled && this.buckled.buckle_requires_restraints) {
				yield* this.buckled.unbuckle_mob(this);
			}
			yield* this.update_handcuffed();
			return f.dot;
		}
		if (I == this.legcuffed) {
			this.legcuffed.loc = this.loc;
			yield* this.legcuffed.dropped();
			this.legcuffed = null;
			yield* this.update_inv_legcuffed();
			return f.dot;
		} else {
			yield* this.dropItemToGround(I);
			return f.dot;
		}
		return 1;
	}
}, true);

// carbon.dm:384
rt.def("/mob/living/carbon/proc/get_standard_pixel_y_offset", function get_standard_pixel_y_offset(f: Frame, lying: Value) {
	lying ??= 0;
	if (lying) {
		return -6;
	} else {
		return rt.initial(f, this, "pixel_y");
	}
});

// carbon.dm:389
rt.def("/mob/living/carbon/proc/accident", function* accident(f: Frame, I: Value) {
	let target: Value = null, range: Value = null, i: Value = null, new_turf: Value = null;
	if (!I || rt.bitAnd(I.flags, 130)) {
		return f.dot;
	}
	yield* this.dropItemToGround(I);
	let modifier: Value = 0;
	if (rt.bitAnd(this.disabilities, 256)) {
		modifier -= 40;
	}
	const subject = rand(1, 100) + modifier;
	if (rt.inRange(subject, -1e+31, 0)) {
		yield* I.attack(this, this);
	} else if (rt.inRange(subject, 1, 30)) {
		yield* I.throw_impact(this);
	} else if (rt.inRange(subject, 31, 60)) {
		target = rt.getStep(f, this.loc, 0);
		range = rand(2, I.throw_range);
		i = 1;
		while (i < range) {
			target = (new_turf = rt.getStep(f, target, this.dir));
			if (new_turf.density) {
				break;
			}
			i++;
		}
		yield* I.throw_at(target, I.throw_range, I.throw_speed, this);
	} else if (rt.inRange(subject, 61, 90)) {
		target = rt.getStep(f, this.loc, 0);
		yield* I.throw_at(target, I.throw_range, I.throw_speed, this);
	}
	return f.dot;
}, true);

// carbon.dm:417
rt.def("/mob/living/carbon/proc/AddAbility", function* AddAbility(f: Frame, A: Value) {
	this.abilities.Add(A);
	yield* A.on_gain(this);
	if (A.has_action) {
		yield* A.action.Grant(this);
	}
	yield* sortInsert(this.abilities, P("/proc/cmp_abilities_cost"), 0);
	return f.dot;
}, true);

// carbon.dm:424
rt.def("/mob/living/carbon/proc/RemoveAbility", function* RemoveAbility(f: Frame, A: Value) {
	yield* this.abilities.Remove(A);
	A.on_lose(this);
	if (!A.action) return f.dot;
	yield* A.action.Remove(this);
	return f.dot;
}, true);

// carbon.dm:430
rt.def("/mob/living/carbon/proc/add_abilities_to_panel", function add_abilities_to_panel(f: Frame) {
	let A: Value = null;
	let $e: any;
	for (A of each(this.abilities, T("/obj/effect/proc_holder/alien"))) {
		statpanel(`${A.panel}`, A.plasma_cost > 0 ? `(${A.plasma_cost})` : "", A);
	}
	return f.dot;
});

// carbon.dm:434
rt.def("/mob/living/carbon/proc/Stat", function* Stat(f: Frame) {
	let vessel: Value = null;
	yield* parent_proc();
	if (statpanel("Status")) {
		if (vessel = this.getorgan(T("/obj/item/organ/alien/plasmavessel"))) {
			stat(null, `Plasma Stored: ${vessel.storedPlasma}/${vessel.max_plasma}`);
		}
		if (rt.locateIn(f, T("/obj/item/device/assembly/health"), this)) {
			stat(null, `Health: ${this.health}`);
		}
	}
	this.add_abilities_to_panel();
	return f.dot;
}, true);

// carbon.dm:445
rt.def("/mob/living/carbon/proc/attack_ui", function* attack_ui(f: Frame, slot: Value) {
	if (!this.has_hand_for_held_index(this.active_hand_index)) {
		return 0;
	}
	return (yield* parent_proc());
}, true);

// carbon.dm:450
rt.def("/mob/living/carbon/proc/vomit", function* vomit(f: Frame, lost_nutrition: Value, blood: Value, stun: Value, distance: Value, message: Value, toxic: Value) {
	let i: Value = null;
	let $e: any;
	lost_nutrition ??= 10;
	blood ??= 0;
	stun ??= 1;
	distance ??= 1;
	message ??= 1;
	toxic ??= 0;
	if (rt.isIn(f, ((this.dna && this.dna.species) && NOHUNGER), this.dna.species.species_traits)) {
		return 1;
	}
	if (this.nutrition < 100 && !blood) {
		if (message) {
			this.visible_message(`<span class='warning'>${this} dry heaves!</span>`, "<span class='userdanger'>You try to throw up, but there's nothing in your stomach!</span>");
		}
		if (stun) {
			yield* this.Knockdown(200);
		}
		return 1;
	}
	if (this.is_mouth_covered()) {
		if (message) {
			this.visible_message(`<span class='danger'>${this} throws up all over themself!</span>`, "<span class='userdanger'>You throw up all over yourself!</span>");
		}
		distance = 0;
	} else if (message) {
		this.visible_message(`<span class='danger'>${this} throws up!</span>`, "<span class='userdanger'>You throw up!</span>");
	}
	if (stun) {
		yield* this.Stun(80);
	}
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/splat.ogg"), 50, 1);
	let _T: Value = rt.getStep(f, this, 0);
	if (!blood) {
		this.nutrition -= lost_nutrition;
		yield* this.adjustToxLoss(-3);
	}
	rt.forRange(f, 0, 0, distance, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (blood) {
			if (_T) {
				yield* this.add_splatter_floor(_T);
			}
			if (stun) {
				yield* this.adjustBruteLoss(3);
			}
		} else if (_T) {
			yield* _T.add_vomit_floor(this, toxic);
		}
		if (is_blocked_turf((_T = rt.getStep(f, _T, this.dir)))) {
			break;
		}
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// carbon.dm:493
rt.def("/mob/living/carbon/proc/spew_organ", function* spew_organ(f: Frame, power: Value) {
	power ??= 5;
	if (!rt.len(f, this.internal_organs)) {
		return f.dot;
	}
	let guts: Value = pick(this.internal_organs);
	let _T: Value = rt.getStep(f, this, 0);
	yield* guts.Remove(this);
	yield* guts.forceMove(_T);
	let throw_target: Value = get_edge_target_turf(guts, this.dir);
	yield* guts.throw_at(throw_target, power, 4, this);
	return f.dot;
}, true);

// carbon.dm:504
rt.def("/mob/living/carbon/proc/fully_replace_character_name", function fully_replace_character_name(f: Frame, oldname: Value, newname: Value) {
	parent_proc();
	if (!this.dna) return f.dot;
	this.dna.real_name = this.real_name;
	return f.dot;
}, false);

// carbon.dm:510
rt.def("/mob/living/carbon/proc/updatehealth", function* updatehealth(f: Frame) {
	let X: Value = null, BP: Value = null;
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	let total_burn: Value = 0;
	let total_brute: Value = 0;
	for (X of each(this.bodyparts)) {
		total_brute += (BP = X).brute_dam;
		total_burn += BP.burn_dam;
	}
	this.health = this.maxHealth - this.getOxyLoss() - this.getToxLoss() - this.getCloneLoss() - total_burn - total_brute;
	yield* this.update_stat();
	if (this.maxHealth - total_burn < -100 && this.stat == 2) {
		yield* this.become_husk();
	}
	yield* this.med_hud_set_health();
	return f.dot;
}, true);

// carbon.dm:525
rt.def("/mob/living/carbon/proc/update_sight", function* update_sight(f: Frame) {
	let E: Value = null, A: Value = null, G: Value = null, X: Value = null, M: Value = null;
	if (!this.client) {
		return f.dot;
	}
	if (this.stat == 2) {
		this.sight = 28;
		this.see_in_dark = 8;
		this.see_invisible = 60;
		return f.dot;
	}
	this.sight = rt.initial(f, this, "sight");
	this.lighting_alpha = rt.initial(f, this, "lighting_alpha");
	if (!(E = this.getorganslot("eye_sight"))) {
		yield* this.update_tint();
	} else {
		this.see_invisible = E.see_invisible;
		this.see_in_dark = E.see_in_dark;
		(rt.modSrcVar(f, "sight", E.sight_flags, rt.bitOr));
		if (E.lighting_alpha !== null) {
			this.lighting_alpha = E.lighting_alpha;
		}
	}
	if (this.client.eye != this) {
		if ((A = this.client.eye).update_remote_sight(this)) {
			return f.dot;
		}
	}
	if (this.glasses) {
		(rt.modSrcVar(f, "sight", (G = this.glasses).vision_flags, rt.bitOr));
		this.see_in_dark = max(G.darkness_view, this.see_in_dark);
		if (G.invis_override) {
			this.see_invisible = G.invis_override;
		} else {
			this.see_invisible = min(G.invis_view, this.see_invisible);
		}
		if (G.lighting_alpha !== null) {
			this.lighting_alpha = min(this.lighting_alpha, G.lighting_alpha);
		}
	}
	if (this.dna) {
		for (X of each(this.dna.mutations)) {
			if ((M = X).name == "X Ray Vision") {
				(rt.modSrcVar(f, "sight", 28, rt.bitOr));
				this.see_in_dark = max(this.see_in_dark, 8);
			}
		}
	}
	if (this.see_override) {
		this.see_invisible = this.see_override;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// carbon.dm:574
rt.def("/mob/living/carbon/proc/update_tint", function* update_tint(f: Frame) {
	if (!GLOB.tinted_weldhelh) {
		return f.dot;
	}
	this.tinttotal = this.get_total_tint();
	if (this.tinttotal >= TINT_BLIND) {
		yield* this.overlay_fullscreen("tint", T("/obj/screen/fullscreen/blind"));
	} else if (this.tinttotal >= TINT_DARKENED) {
		yield* this.overlay_fullscreen("tint", T("/obj/screen/fullscreen/impaired"), 2);
	} else {
		yield* this.clear_fullscreen("tint", 0);
	}
	return f.dot;
}, true);

// carbon.dm:586
rt.def("/mob/living/carbon/proc/get_total_tint", function get_total_tint(f: Frame) {
	let HT: Value = null, E: Value = null;
	f.dot = 0;
	if (rt.istype(this.head, T("/obj/item/clothing/head"))) {
		f.dot += (HT = this.head).tint;
	}
	if (this.wear_mask) {
		f.dot += this.wear_mask.tint;
	}
	if (E = this.getorganslot("eye_sight")) {
		f.dot += E.tint;
	} else {
		f.dot += 1e+31;
	}
	return f.dot;
});

// carbon.dm:602
rt.def("/mob/living/carbon/proc/update_damage_hud", function* update_damage_hud(f: Frame) {
	let severity: Value = null, hurtdamage: Value = null, severity_1: Value = null;
	if (!this.client) {
		return f.dot;
	}
	if (this.stat == 1 && this.health <= 0) {
		severity = 0;
		if (rt.inRange(this.health, -20, -10)) {
			severity = 1;
		} else if (rt.inRange(this.health, -30, -20)) {
			severity = 2;
		} else if (rt.inRange(this.health, -40, -30)) {
			severity = 3;
		} else if (rt.inRange(this.health, -50, -40)) {
			severity = 4;
		} else if (rt.inRange(this.health, -60, -50)) {
			severity = 5;
		} else if (rt.inRange(this.health, -70, -60)) {
			severity = 6;
		} else if (rt.inRange(this.health, -80, -70)) {
			severity = 7;
		} else if (rt.inRange(this.health, -90, -80)) {
			severity = 8;
		} else if (rt.inRange(this.health, -95, -90)) {
			severity = 9;
		} else if (rt.inRange(this.health, -1e+31, -95)) {
			severity = 10;
		}
		yield* this.overlay_fullscreen("crit", T("/obj/screen/fullscreen/crit"), severity);
	} else {
		yield* this.clear_fullscreen("crit");
		if (this.oxyloss) {
			severity = 0;
			if (rt.inRange(this.oxyloss, 10, 20)) {
				severity = 1;
			} else if (rt.inRange(this.oxyloss, 20, 25)) {
				severity = 2;
			} else if (rt.inRange(this.oxyloss, 25, 30)) {
				severity = 3;
			} else if (rt.inRange(this.oxyloss, 30, 35)) {
				severity = 4;
			} else if (rt.inRange(this.oxyloss, 35, 40)) {
				severity = 5;
			} else if (rt.inRange(this.oxyloss, 40, 45)) {
				severity = 6;
			} else if (rt.inRange(this.oxyloss, 45, 1e+31)) {
				severity = 7;
			}
			yield* this.overlay_fullscreen("oxy", T("/obj/screen/fullscreen/oxy"), severity);
		} else {
			yield* this.clear_fullscreen("oxy");
		}
		if (hurtdamage = this.getBruteLoss() + this.getFireLoss() + this.damageoverlaytemp) {
			severity_1 = 0;
			if (rt.inRange(hurtdamage, 5, 15)) {
				severity_1 = 1;
			} else if (rt.inRange(hurtdamage, 15, 30)) {
				severity_1 = 2;
			} else if (rt.inRange(hurtdamage, 30, 45)) {
				severity_1 = 3;
			} else if (rt.inRange(hurtdamage, 45, 70)) {
				severity_1 = 4;
			} else if (rt.inRange(hurtdamage, 70, 85)) {
				severity_1 = 5;
			} else if (rt.inRange(hurtdamage, 85, 1e+31)) {
				severity_1 = 6;
			}
			yield* this.overlay_fullscreen("brute", T("/obj/screen/fullscreen/brute"), severity_1);
		} else {
			yield* this.clear_fullscreen("brute");
		}
	}
	return f.dot;
}, true);

// carbon.dm:651
rt.def("/mob/living/carbon/proc/update_health_hud", function update_health_hud(f: Frame, shown_health_amount: Value) {
	if (!this.client || !this.hud_used) {
		return f.dot;
	}
	if (!this.hud_used.healths) return f.dot;
	if (this.stat != 2) {
		f.dot = 1;
		if (!shown_health_amount) {
			shown_health_amount = this.health;
		}
		if (shown_health_amount >= this.maxHealth) {
			this.hud_used.healths.icon_state = "health0";
		} else if (shown_health_amount > this.maxHealth * 0.8) {
			this.hud_used.healths.icon_state = "health1";
		} else if (shown_health_amount > this.maxHealth * 0.6) {
			this.hud_used.healths.icon_state = "health2";
		} else if (shown_health_amount > this.maxHealth * 0.4) {
			this.hud_used.healths.icon_state = "health3";
		} else if (shown_health_amount > this.maxHealth * 0.2) {
			this.hud_used.healths.icon_state = "health4";
		} else if (shown_health_amount > 0) {
			this.hud_used.healths.icon_state = "health5";
		} else {
			this.hud_used.healths.icon_state = "health6";
		}
	} else {
		this.hud_used.healths.icon_state = "health7";
	}
	return f.dot;
});

// carbon.dm:676
rt.def("/mob/living/carbon/proc/update_internals_hud_icon", function update_internals_hud_icon(f: Frame, internal_state: Value) {
	internal_state ??= 0;
	if (!(this.hud_used && this.hud_used.internals)) return f.dot;
	this.hud_used.internals.icon_state = `internal${internal_state}`;
	return f.dot;
});

// carbon.dm:680
rt.def("/mob/living/carbon/proc/update_stat", function* update_stat(f: Frame) {
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	if (this.stat != 2) {
		if (this.health <= -100) {
			yield* this.death();
			return f.dot;
		}
		if (this.IsUnconscious() || this.IsSleeping() || this.getOxyLoss() > 50 || rt.bitAnd(this.status_flags, FAKEDEATH) || this.health <= 0) {
			if (this.stat == 0) {
				this.stat = 1;
				yield* this.blind_eyes(1);
				yield* this.update_canmove();
			}
		} else if (this.stat == 1) {
			this.stat = 0;
			this.resting = 0;
			yield* this.adjust_blindness(-1);
			yield* this.update_canmove();
		}
	}
	yield* this.update_damage_hud();
	this.update_health_hud();
	this.med_hud_set_status();
	return f.dot;
}, true);

// carbon.dm:704
rt.def("/mob/living/carbon/proc/update_handcuffed", function* update_handcuffed(f: Frame) {
	if (this.handcuffed) {
		yield* this.drop_all_held_items();
		yield* this.stop_pulling();
		yield* this.throw_alert("handcuffed", T("/obj/screen/alert/restrained/handcuffed"), { new_master: this.handcuffed });
	} else {
		yield* this.clear_alert("handcuffed");
	}
	yield* this.update_action_buttons_icon();
	this.update_inv_handcuffed();
	this.update_hud_handcuffed();
	return f.dot;
}, true);

// carbon.dm:715
rt.def("/mob/living/carbon/proc/fully_heal", function* fully_heal(f: Frame) {
	let B: Value = null, D: Value = null, R: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (this.reagents) {
		yield* this.reagents.clear_reagents();
	}
	if (B = this.getorgan(T("/obj/item/organ/brain"))) {
		B.damaged_brain = 0;
	}
	for (D of each(this.viruses, T("/datum/disease"))) {
		if (D.severity != "No threat") {
			yield* D.cure(0);
		}
	}
	if (f.args[0]) {
		yield* this.regenerate_limbs();
		yield* this.regenerate_organs();
		this.handcuffed = rt.initial(f, this, "handcuffed");
		for (R of each(this.contents, T("/obj/item/weapon/restraints"))) {
			yield* qdel(R);
		}
		yield* this.update_handcuffed();
		if (this.reagents) {
			this.reagents.addiction_list = list();
		}
	}
	yield* parent_proc();
	this.restoreEars();
	return f.dot;
}, true, { args: ["admin_revive"] });

// carbon.dm:737
rt.def("/mob/living/carbon/proc/can_be_revived", function can_be_revived(f: Frame) {
	f.dot = parent_proc();
	if (!(!this.getorgan(T("/obj/item/organ/brain")) && (!this.mind || !this.mind.changeling))) return f.dot;
	return 0;
});

// carbon.dm:742
rt.def("/mob/living/carbon/proc/harvest", function* harvest(f: Frame, user: Value) {
	let X: Value = null, O: Value = null;
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	let organs_amt: Value = 0;
	for (X of each(this.internal_organs)) {
		O = X;
		if (prob(50)) {
			organs_amt++;
			yield* O.Remove(this);
			O.loc = rt.getStep(f, this, 0);
		}
	}
	if (organs_amt) {
		to_chat(user, `<span class='notice'>You retrieve some of ${this}'s internal organs!</span>`);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// carbon.dm:757
rt.def("/mob/living/carbon/proc/ExtinguishMob", function* ExtinguishMob(f: Frame) {
	let X: Value = null, I: Value = null;
	for (X of each(this.get_equipped_items())) {
		(I = X).acid_level = 0;
		yield* I.extinguish();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// carbon.dm:764
rt.def("/mob/living/carbon/proc/fakefire", function fakefire(f: Frame, fire_icon: Value) {
	let new_fire_overlay: Value = null;
	fire_icon ??= "Generic_mob_burning";
	(new_fire_overlay = mutable_appearance(rt.rsc("icons/mob/onfire.dmi"), fire_icon, -1)).appearance_flags = 2;
	rt.setAt(this.overlays_standing, FIRE_LAYER, new_fire_overlay);
	this.apply_overlay(FIRE_LAYER);
	return f.dot;
});

// carbon.dm:770
rt.def("/mob/living/carbon/proc/fakefireextinguish", function fakefireextinguish(f: Frame) {
	this.remove_overlay(FIRE_LAYER);
	return f.dot;
});

// carbon.dm:774
rt.def("/mob/living/carbon/proc/devour_mob", function* devour_mob(f: Frame, C: Value, devour_time: Value) {
	devour_time ??= 130;
	C.visible_message(`<span class='danger'>${this} is attempting to devour ${C}!</span>`, `<span class='userdanger'>${this} is attempting to devour you!</span>`);
	if (!(yield* do_mob(this, C, devour_time))) {
		return f.dot;
	}
	if (!(this.pulling && this.pulling == C && this.grab_state >= 1 && this.a_intent == "grab")) return f.dot;
	C.visible_message(`<span class='danger'>${this} devours ${C}!</span>`, `<span class='userdanger'>${this} devours you!</span>`);
	yield* C.forceMove(this);
	this.stomach_contents.Add(C);
	add_logs(this, C, "devoured");
	return f.dot;
}, true);

// carbon.dm:788
rt.def("/mob/living/carbon/proc/create_bodyparts", function* create_bodyparts(f: Frame) {
	let X: Value = null, O: Value = null;
	let l_arm_index_next: Value = -1;
	let r_arm_index_next: Value = 0;
	for (X of each(this.bodyparts)) {
		(O = (yield* new_(X))).owner = this;
		yield* this.bodyparts.Remove(X);
		this.bodyparts.Add(O);
		if (O.body_part == ARM_LEFT) {
			l_arm_index_next += 2;
			O.held_index = l_arm_index_next;
			this.hand_bodyparts += O;
		} else if (O.body_part == ARM_RIGHT) {
			r_arm_index_next += 2;
			O.held_index = r_arm_index_next;
			this.hand_bodyparts += O;
		}
	}
	return f.dot;
}, true);

// carbon.dm:804
rt.def("/mob/living/carbon/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	let X: Value = null, I: Value = null;
	for (X of each(this.internal_organs)) {
		yield* (I = X).Insert(this);
	}
	return f.dot;
}, true);

// carbon.dm:809
rt.def("/mob/living/carbon/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = parent_proc();
	rt.setAt((f.dot += "---"), "Make AI", fmt("?_src_=vars;makeai=＃", [this]));
	rt.setAt(f.dot, "Modify bodypart", fmt("?_src_=vars;editbodypart=＃", [this]));
	rt.setAt(f.dot, "Modify organs", fmt("?_src_=vars;editorgans=＃", [this]));
	return f.dot;
});
