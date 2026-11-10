// Based on /tg/station's code/modules/spells/spell_types/summonitem.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11334, "/obj/effect/proc_holder/spell/targeted/summonitem", "/obj/effect/proc_holder/spell/targeted", {
	marked_item: null,
	include_user: 1,
	name: "Instant Summons",
	desc: "This spell can be used to recall a previously marked item to your hand from anywhere in the universe.",
	school: "transmutation",
	charge_max: 100,
	clothes_req: 0,
	invocation: "GAR YOK",
	invocation_type: "whisper",
	range: -1,
	level_max: 0,
	cooldown_min: 100,
	action_icon_state: "summons",
});

// summonitem.dm:19
rt.def("/obj/effect/proc_holder/spell/targeted/summonitem/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let L: Value = null, hand_items: Value = null, message: Value = null, item: Value = null, item_to_retrieve: Value = null, infinite_recursion: Value = null, organ: Value = null, M: Value = null, C: Value = null, X: Value = null, part: Value = null, _P: Value = null;
	user ??= f.usr;
	for (L of each(targets, T("/mob/living"))) {
		hand_items = list(L.get_active_held_item(), L.get_inactive_held_item());
		message = null;
		if (!this.marked_item) {
			message = "<span class='notice'>";
			item = null;
			for (item of each(hand_items, T("/obj"))) {
				if (rt.isIn(f, ABSTRACT, item.flags)) {
					continue;
				}
				if (rt.isIn(f, NODROP, item.flags)) {
					message += "Though it feels redundant, ";
				}
				this.marked_item = item;
				message += `You mark ${item} for recall.</span>`;
				this.name = `Recall ${item}`;
				break;
			}
			if (!this.marked_item) {
				if (hand_items) {
					message = "<span class='caution'>You aren't holding anything that can be marked for recall.</span>";
				} else {
					message = "<span class='notice'>You must hold the desired item in your hands to mark it for recall.</span>";
				}
			}
		} else if (rt.isIn(f, (this.marked_item && this.marked_item), hand_items)) {
			message = `<span class='notice'>You remove the mark on ${this.marked_item} to use elsewhere.</span>`;
			this.name = "Instant Summons";
			this.marked_item = null;
		} else if (this.marked_item && (!this.marked_item || this.marked_item.gc_destroyed)) {
			message = "<span class='warning'>You sense your marked item has been destroyed!</span>";
			this.name = "Instant Summons";
			this.marked_item = null;
		} else {
			item_to_retrieve = this.marked_item;
			infinite_recursion = 0;
			if (!item_to_retrieve.loc) {
				if (rt.istype(item_to_retrieve, T("/obj/item/organ"))) {
					if ((organ = item_to_retrieve).owner) {
						yield* add_logs(L, organ.owner, `magically removed ${organ.name} from`, { addition: `INTENT: ${uppertext(L.a_intent)}` });
						yield* organ.Remove(organ.owner);
					}
				}
			} else {
				while (!isturf(item_to_retrieve.loc) && infinite_recursion < 10) {
					if (ismob(item_to_retrieve.loc)) {
						if (rt.istype((M = item_to_retrieve.loc), T("/mob/living/silicon"))) {
							M.loc.visible_message(`<span class='warning'>${M} suddenly disappears!</span>`);
							M.loc = L.loc;
							M.loc.visible_message(`<span class='caution'>${M} suddenly appears!</span>`);
							item_to_retrieve = null;
							break;
						}
						yield* M.dropItemToGround(item_to_retrieve);
						if (rt.istype(M, T("/mob/living/carbon"))) {
							if (rt.isIn(f, ((C = M).stomach_contents && item_to_retrieve), C.stomach_contents)) {
								C.stomach_contents -= item_to_retrieve;
							}
							X = null;
							for (X of each(C.bodyparts)) {
								part = X;
								if (rt.isIn(f, item_to_retrieve, part.embedded_objects)) {
									part.embedded_objects -= item_to_retrieve;
									to_chat(C, `<span class='warning'>The ${item_to_retrieve} that was embedded in your ${L} has myseriously vanished. How fortunate!</span>`);
									if (!C.has_embedded_objects()) {
										yield* C.clear_alert("embeddedobject");
									}
									break;
								}
							}
						}
					} else {
						if (rt.istype(item_to_retrieve.loc, T("/obj/machinery/portable_atmospherics"))) {
							yield* (_P = item_to_retrieve.loc).disconnect();
							yield* _P.update_icon();
						}
						item_to_retrieve = item_to_retrieve.loc;
					}
					infinite_recursion += 1;
				}
			}
			if (!item_to_retrieve) {
				return f.dot;
			}
			if (item_to_retrieve.loc) {
				item_to_retrieve.loc.visible_message(`<span class='warning'>The ${item_to_retrieve.name} suddenly disappears!</span>`);
			}
			if (!(yield* L.put_in_hands(item_to_retrieve))) {
				item_to_retrieve.loc = L.loc;
				item_to_retrieve.loc.visible_message(`<span class='caution'>The ${item_to_retrieve.name} suddenly appears!</span>`);
				playsound(rt.getStep(f, L, 0), rt.rsc("sound/magic/summonitems_generic.ogg"), 50, 1);
			} else {
				item_to_retrieve.loc.visible_message(`<span class='caution'>The ${item_to_retrieve.name} suddenly appears in ${L}'s hand!</span>`);
				playsound(rt.getStep(f, L, 0), rt.rsc("sound/magic/summonitems_generic.ogg"), 50, 1);
			}
		}
		if (message) {
			to_chat(L, message);
		}
	}
	return f.dot;
}, true);
