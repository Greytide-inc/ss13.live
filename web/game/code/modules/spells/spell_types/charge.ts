// Based on /tg/station's code/modules/spells/spell_types/charge.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11284, "/obj/effect/proc_holder/spell/targeted/charge", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 1,
	name: "Charge",
	desc: "This spell can be used to recharge a variety of things in your hands, from magical artifacts to electrical components. A creative wizard can even use it to grant magical power to a fellow magic user.",
	school: "transmutation",
	charge_max: 600,
	clothes_req: 0,
	invocation: "DIRI CEL",
	invocation_type: "whisper",
	range: -1,
	cooldown_min: 400,
});

// charge.dm:16
rt.def("/obj/effect/proc_holder/spell/targeted/charge/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let L: Value = null, hand_items: Value = null, charged_item: Value = null, burnt_out: Value = null, M: Value = null, S: Value = null, item: Value = null, I: Value = null, W: Value = null, C: Value = null, C_6: Value = null, G: Value = null;
	user ??= f.usr;
	for (L of each(targets, T("/mob/living"))) {
		hand_items = list(L.get_active_held_item(), L.get_inactive_held_item());
		charged_item = null;
		burnt_out = 0;
		if (L.pulling && rt.istype(L.pulling, T("/mob/living"))) {
			if (rt.len(f, (M = L.pulling).mob_spell_list) != 0 || M.mind && rt.len(f, M.mind.spell_list) != 0) {
				S = null;
				for (S of each(M.mob_spell_list, T("/obj/effect/proc_holder/spell"))) {
					S.charge_counter = S.charge_max;
				}
				if (M.mind) {
					S = null;
					for (S of each(M.mind.spell_list, T("/obj/effect/proc_holder/spell"))) {
						S.charge_counter = S.charge_max;
					}
				}
				to_chat(M, "<span class='notice'>You feel raw magic flowing through you. It feels good!</span>");
			} else {
				to_chat(M, "<span class='notice'>You feel very strange for a moment, but then it passes.</span>");
				burnt_out = 1;
			}
			charged_item = M;
			break;
		}
		item = null;
		for (item of each(hand_items, T("/obj"))) {
			if (rt.istype(item, T("/obj/item/weapon/spellbook"))) {
				if (rt.istype(item, T("/obj/item/weapon/spellbook/oneuse"))) {
					I = item;
					if (prob(80)) {
						L.visible_message(`<span class='warning'>${I} catches fire!</span>`);
						yield* qdel(I);
					} else {
						I.used = 0;
						charged_item = I;
						break;
					}
				} else {
					to_chat(L, "<span class='danger'>Glowing red letters appear on the front cover...</span>");
					to_chat(L, `<span class='warning'>${pick("NICE TRY BUT NO!", "CLEVER BUT NOT CLEVER ENOUGH!", "SUCH FLAGRANT CHEESING IS WHY WE ACCEPTED YOUR APPLICATION!", "CUTE! VERY CUTE!", "YOU DIDN'T THINK IT'D BE THAT EASY, DID YOU?")}</span>`);
					burnt_out = 1;
				}
			} else if (rt.istype(item, T("/obj/item/weapon/gun/magic"))) {
				I = item;
				if (prob(80) && !I.can_charge) {
					I.max_charges--;
				}
				if (I.max_charges <= 0) {
					I.max_charges = 0;
					burnt_out = 1;
				}
				I.charges = I.max_charges;
				if (rt.istype(item, T("/obj/item/weapon/gun/magic/wand")) && I.max_charges != 0) {
					(W = item).icon_state = rt.initial(f, W, "icon_state");
				}
				yield* I.recharge_newshot();
				charged_item = I;
				break;
			} else if (rt.istype(item, T("/obj/item/weapon/stock_parts/cell"))) {
				if (!(C = item).self_recharge) {
					if (prob(80)) {
						C.maxcharge -= 200;
					}
					if (C.maxcharge <= 1) {
						C.maxcharge = 1;
						burnt_out = 1;
					}
				}
				C.charge = C.maxcharge;
				charged_item = C;
				break;
			} else if (item.contents) {
				I = null;
				for (I of each(item.contents, T("/obj"))) {
					if (rt.istype(I, T("/obj/item/weapon/stock_parts/cell"))) {
						if (!(C_6 = I).self_recharge) {
							if (prob(80)) {
								C_6.maxcharge -= 200;
							}
							if (C_6.maxcharge <= 1) {
								C_6.maxcharge = 1;
								burnt_out = 1;
							}
						}
						C_6.charge = C_6.maxcharge;
						if (rt.istype(C_6.loc, T("/obj/item/weapon/gun"))) {
							yield* (G = C_6.loc).process_chamber();
						}
						yield* item.update_icon();
						charged_item = item;
						break;
					}
				}
			}
		}
		if (!charged_item) {
			to_chat(L, "<span class='notice'>You feel magical power surging through your hands, but the feeling rapidly fades...</span>");
		} else if (burnt_out) {
			to_chat(L, `<span class='caution'>${charged_item} doesn't seem to be reacting to the spell...</span>`);
		} else {
			playsound(rt.getStep(f, L, 0), rt.rsc("sound/magic/charge.ogg"), 50, 1);
			to_chat(L, `<span class='notice'>${charged_item} suddenly feels very warm!</span>`);
		}
	}
	return f.dot;
}, true);
