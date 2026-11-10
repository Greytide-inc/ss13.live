// Based on /tg/station's code/modules/ninja/suit/n_suit_verbs/ninja_cost_check.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// ninja_cost_check.dm:5
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninjacost", function ninjacost(f: Frame, cost: Value, specificCheck: Value) {
	let H: Value = null;
	cost ??= 0;
	specificCheck ??= 0;
	if (((H = this.affecting).stat || H.incorporeal_move) && specificCheck != N_ADRENALINE) {
		to_chat(H, "<span class='danger'>You must be conscious and solid to do this.</span>");
		return 1;
	}
	let actualCost: Value = cost * 10;
	if (cost && this.cell.charge < actualCost) {
		to_chat(H, "<span class='danger'>Not enough energy.</span>");
		return 1;
	} else {
		this.cell.charge -= actualCost;
	}
	if (specificCheck === N_STEALTH_CANCEL) {
		this.cancel_stealth();
	} else if (specificCheck === N_SMOKE_BOMB) {
		if (!this.s_bombs) {
			to_chat(H, "<span class='danger'>There are no more smoke bombs remaining.</span>");
			return 1;
		}
	} else if (specificCheck === N_ADRENALINE) {
		if (!this.a_boost) {
			to_chat(H, "<span class='danger'>You do not have any more adrenaline boosters.</span>");
			return 1;
		}
	}
	return this.s_coold;
});
