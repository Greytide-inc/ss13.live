// Based on /tg/station's code/modules/ninja/suit/suit_attackby.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// suit_attackby.dm:4
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/attackby", function* attackby(f: Frame, I: Value, U: Value, params: Value) {
	let total_reagent_transfer: Value = null, reagent_id: Value = null, R: Value = null, amount_to_transfer: Value = null, CELL: Value = null, old_cell: Value = null, TD: Value = null, has_research: Value = null, V: Value = null, V1: Value = null, new_data: Value = null, V2: Value = null, current_data: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (U == this.affecting) {
		if (rt.istype(I, T("/obj/item/weapon/reagent_containers/glass"))) {
			for (reagent_id of each(this.reagent_list)) {
				$0 = (R = I.reagents.has_reagent(reagent_id));
				if ($0) {
					$0 = this.reagents.get_reagent_amount(reagent_id);
					$1 = this.r_maxamount;
					if (reagent_id == "radium") {
						$2 = this.a_boost * this.a_transfer;
					} else {
						$2 = 0;
					}
					$0 = ($0 < $1 + $2 ? 1 : 0);
				}
				if ($0 && R.volume >= this.a_transfer) {
					$0 = this.r_maxamount;
					if (reagent_id == "radium") {
						$1 = this.a_boost * this.a_transfer;
					} else {
						$1 = 0;
					}
					amount_to_transfer = min($0 + $1 - this.reagents.get_reagent_amount(reagent_id), round(R.volume / this.a_transfer) * this.a_transfer);
					R.volume -= amount_to_transfer;
					yield* this.reagents.add_reagent(reagent_id, amount_to_transfer);
					total_reagent_transfer += amount_to_transfer;
					to_chat(U, `Added ${amount_to_transfer} units of ${R.name}.`);
					yield* I.reagents.update_total();
				}
			}
			to_chat(U, `Replenished a total of ${total_reagent_transfer ? total_reagent_transfer : "zero"} chemical units.`);
			return f.dot;
		} else if (rt.istype(I, T("/obj/item/weapon/stock_parts/cell"))) {
			if ((CELL = I).maxcharge > this.cell.maxcharge && this.n_gloves && this.n_gloves.candrain) {
				to_chat(U, "<span class='notice'>Higher maximum capacity detected.\nUpgrading...</span>");
				if (this.n_gloves && this.n_gloves.candrain && (yield* do_after(U, this.s_delay, { target: this }))) {
					yield* U.drop_item();
					CELL.loc = this;
					CELL.charge = min(CELL.charge + this.cell.charge, CELL.maxcharge);
					(old_cell = this.cell).charge = 0;
					yield* U.put_in_hands(old_cell);
					yield* old_cell.add_fingerprint(U);
					old_cell.corrupt();
					yield* old_cell.update_icon();
					this.cell = CELL;
					to_chat(U, `<span class='notice'>Upgrade complete. Maximum capacity: <b>${round(this.cell.maxcharge / 100)}</b>%</span>`);
				} else {
					to_chat(U, "<span class='danger'>Procedure interrupted. Protocol terminated.</span>");
				}
			}
			return f.dot;
		} else if (rt.istype(I, T("/obj/item/weapon/disk/tech_disk"))) {
			TD = I;
			has_research = 0;
			for (V of each(TD.tech_stored)) {
				if (V) {
					has_research = 1;
					break;
				}
			}
			if (has_research) {
				to_chat(U, "Research information detected, processing...");
				if (yield* do_after(U, this.s_delay, { target: this })) {
					rt.forRange(f, 0, 1, TD.max_tech_stored, 1);
					while (($e = rt.next(f, 0)) !== undefined) {
						V1 = $e;
						new_data = rt.index(TD.tech_stored, V1);
						rt.setAt(TD.tech_stored, V1, null);
						if (!new_data) {
							continue;
						}
						V2 = null;
						for (V2 of each(this.stored_research)) {
							if ((current_data = V2).id == new_data.id) {
								current_data.level = max(current_data.level, new_data.level);
								break;
							}
						}
					}
					rt.endFor(f, 0);
					to_chat(U, "<span class='notice'>Data analyzed and updated. Disk erased.</span>");
				} else {
					to_chat(U, "<span class='userdanger'>ERROR</span>: Procedure interrupted. Process terminated.");
				}
			} else {
				I.loc = this;
				this.t_disk = I;
				to_chat(U, fmt("<span class='notice'>You slot ％！ into ％！.</span>", [I, this]));
			}
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);
