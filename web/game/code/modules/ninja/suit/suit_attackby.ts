// From code/modules/ninja/suit/suit_attackby.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/suit/space/space_ninja/proc/attackby  (code/modules/ninja/suit/suit_attackby.dm:4)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/attackby", function* attackby(f: Frame) {
	let total_reagent_transfer: Value = null, reagent_id: Value = null, R: Value = null, amount_to_transfer: Value = null, CELL: Value = null, old_cell: Value = null, TD: Value = null, has_research: Value = null, V: Value = null, V1: Value = null, new_data: Value = null, V2: Value = null, current_data: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [total_reagent_transfer, reagent_id, R, amount_to_transfer, CELL, old_cell, TD, has_research, V, V1, new_data, V2, current_data, $0, $1, $2, $e];
	if (isEqual(live(f.args[1]), rt.sv(f, "affecting"))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/glass")) ? 1 : 0))) {
			total_reagent_transfer = null;
			reagent_id = null;
			rt.forList(f, 0, rt.sv(f, "reagent_list"));
			while (($e = rt.next(f, 0)) !== undefined) {
				reagent_id = $e;
				$0 = (R = (yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "has_reagent", [live(reagent_id)])));
				if (truthy($0)) {
					$0 = (yield* g.callName(f, rt.sv(f, "reagents"), "get_reagent_amount", [live(reagent_id)]));
					$1 = rt.sv(f, "r_maxamount");
					if (isEqual(live(reagent_id), "radium")) {
						$2 = multiply(rt.sv(f, "a_boost"), rt.sv(f, "a_transfer"));
					} else {
						$2 = 0;
					}
					$0 = (rt.lt($0, add($1, $2)) ? 1 : 0);
				}
				if ((truthy($0) && rt.ge(rt.fv(f, "volume", live(R)), rt.sv(f, "a_transfer")))) {
					$0 = rt.sv(f, "r_maxamount");
					if (isEqual(live(reagent_id), "radium")) {
						$1 = multiply(rt.sv(f, "a_boost"), rt.sv(f, "a_transfer"));
					} else {
						$1 = 0;
					}
					amount_to_transfer = (yield* g.call(f, P("/proc/min"), null, [subtract(add($0, $1), (yield* g.callName(f, rt.sv(f, "reagents"), "get_reagent_amount", [live(reagent_id)]))), multiply((yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "volume", live(R)), rt.sv(f, "a_transfer"))])), rt.sv(f, "a_transfer"))]));
					(rt.modField(f, live(R), "volume", live(amount_to_transfer), subtract));
					yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [live(reagent_id), live(amount_to_transfer)]);
					total_reagent_transfer = rt.modify(live(total_reagent_transfer), live(amount_to_transfer), add);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("Added ＀ units of ＀.", [live(amount_to_transfer), rt.fv(f, "name", live(R))])]);
					yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "update_total", []);
				}
			}
			rt.endFor(f, 0);
			$0 = live(f.args[1]);
			if (truthy(live(total_reagent_transfer))) {
				$1 = live(total_reagent_transfer);
			} else {
				$1 = "zero";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("Replenished a total of ＀ chemical units.", [$1])]);
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
				if (((rt.gt(rt.gv(f, "maxcharge", (CELL = live(f.args[0]))), rt.fv(f, "maxcharge", rt.sv(f, "cell"))) && truthy(rt.sv(f, "n_gloves"))) && truthy(rt.fv(f, "candrain", rt.sv(f, "n_gloves"))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Higher maximum capacity detected.\nUpgrading...</span>"]);
					if (((truthy(rt.sv(f, "n_gloves")) && truthy(rt.fv(f, "candrain", rt.sv(f, "n_gloves")))) && truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, rt.sv(f, "s_delay"), "target", live(f.src)], rt.Args.Named))))) {
						yield* g.callName(f, live(f.args[1]), "drop_item", []);
						rt.setFv(f, "loc", live(CELL), live(f.src));
						rt.setFv(f, "charge", live(CELL), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "charge", live(CELL)), rt.fv(f, "charge", rt.sv(f, "cell"))), rt.fv(f, "maxcharge", live(CELL))])));
						rt.setFv(f, "charge", (old_cell = rt.sv(f, "cell")), 0);
						yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(old_cell)]);
						yield* g.callName(f, live(old_cell), "add_fingerprint", [live(f.args[1])]);
						yield* g.callName(f, live(old_cell), "corrupt", []);
						yield* g.callName(f, live(old_cell), "update_icon", []);
						rt.setSv(f, "cell", live(CELL));
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>Upgrade complete. Maximum capacity: <b>＀</b>%</span>", [(yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "maxcharge", rt.sv(f, "cell")), 100)]))])]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Procedure interrupted. Protocol terminated.</span>"]);
					}
				}
				return live(f.dot);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/disk/tech_disk")) ? 1 : 0))) {
					TD = live(f.args[0]);
					has_research = 0;
					V = null;
					rt.forList(f, 0, rt.fv(f, "tech_stored", live(TD)));
					while (($e = rt.next(f, 0)) !== undefined) {
						V = $e;
						if (truthy(live(V))) {
							has_research = 1;
							break;
						}
					}
					rt.endFor(f, 0);
					if (truthy(live(has_research))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "Research information detected, processing..."]);
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, rt.sv(f, "s_delay"), "target", live(f.src)], rt.Args.Named)))) {
							V1 = null;
							rt.forRange(f, 0, 1, rt.fv(f, "max_tech_stored", live(TD)), 1);
							while (($e = rt.next(f, 0)) !== undefined) {
								V1 = $e;
								new_data = rt.index(rt.fv(f, "tech_stored", live(TD)), live(V1));
								rt.setAt(rt.fv(f, "tech_stored", live(TD)), live(V1), null);
								if (!truthy(live(new_data))) {
									continue;
								}
								V2 = null;
								rt.forList(f, 1, rt.sv(f, "stored_research"));
								while (($e = rt.next(f, 1)) !== undefined) {
									V2 = $e;
									if (isEqual(rt.gv(f, "id", (current_data = live(V2))), rt.fv(f, "id", live(new_data)))) {
										rt.setFv(f, "level", live(current_data), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "level", live(current_data)), rt.fv(f, "level", live(new_data))])));
										break;
									}
								}
								rt.endFor(f, 1);
							}
							rt.endFor(f, 0);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Data analyzed and updated. Disk erased.</span>"]);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='userdanger'>ERROR</span>: Procedure interrupted. Process terminated."]);
						}
					} else {
						rt.setFv(f, "loc", live(f.args[0]), live(f.src));
						rt.setSv(f, "t_disk", live(f.args[0]));
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You slot ％！ into ％！.</span>", [live(f.args[0]), live(f.src)])]);
					}
					return live(f.dot);
				}
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "U", "params"] });
