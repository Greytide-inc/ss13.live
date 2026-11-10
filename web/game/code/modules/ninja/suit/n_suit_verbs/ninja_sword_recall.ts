// Based on /tg/station's code/modules/ninja/suit/n_suit_verbs/ninja_sword_recall.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// ninja_sword_recall.dm:3
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninja_sword_recall", function* ninja_sword_recall(f: Frame) {
	let C: Value = null;
	let H: Value = this.affecting;
	let cost: Value = 0;
	let inview: Value = 1;
	if (!this.energyKatana) {
		to_chat(H, "<span class='warning'>Could not locate Energy Katana!</span>");
		return f.dot;
	}
	if (rt.isIn(f, this.energyKatana, H)) {
		return f.dot;
	}
	let distance: Value = get_dist(H, this.energyKatana);
	if (!rt.isIn(f, this.energyKatana, view(H))) {
		cost = distance;
		inview = 0;
	}
	if (this.ninjacost(cost)) return f.dot;
	if (rt.istype(this.energyKatana.loc, T("/mob/living/carbon"))) {
		yield* (C = this.energyKatana.loc).transferItemToLoc(this.energyKatana, rt.getStep(f, this.energyKatana, 0), 1);
		if (rt.isIn(f, this.energyKatana, C.stomach_contents)) {
			C.stomach_contents -= this.energyKatana;
		}
	} else {
		yield* this.energyKatana.forceMove(rt.getStep(f, this.energyKatana, 0));
	}
	if (inview) {
		yield* this.energyKatana.spark_system.start();
		playsound(H, "sparks", 50, 1);
		H.visible_message(fmt("<span class='danger'>％！ flies towards ＀!</span>", [this.energyKatana, H]), fmt("<span class='warning'>You hold out your hand and ％！ flies towards you!</span>", [this.energyKatana]));
		yield* this.energyKatana.throw_at(H, distance + 1, this.energyKatana.throw_speed, H);
	} else {
		yield* this.energyKatana.returnToOwner(H, 1);
	}
	return f.dot;
}, true);
