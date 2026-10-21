// From code/datums/outfit.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(615, "/datum/outfit", "/datum", {
	name: "Naked",
	uniform: null,
	suit: null,
	toggle_helmet: 1,
	back: null,
	belt: null,
	gloves: null,
	shoes: null,
	head: null,
	mask: null,
	neck: null,
	ears: null,
	glasses: null,
	id: null,
	l_pocket: null,
	r_pocket: null,
	suit_store: null,
	r_hand: null,
	l_hand: null,
	internals_slot: null,
	backpack_contents: null,
	implants: null,
	accessory: null,
	can_be_admin_equipped: 1,
});

// /datum/outfit/proc/equip  (code/datums/outfit.dm:38)  may sleep
rt.def("/datum/outfit/proc/equip", function* equip(f: Frame, H: Value, visualsOnly: Value) {
	let U: Value = null, path: Value = null, number: Value = null, i: Value = null, HS: Value = null, implant_type: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [H, visualsOnly, U, path, number, i, HS, implant_type, I, $e];
	if (live(visualsOnly) === null) {
		visualsOnly = 0;
	}
	yield* g.srcCall(f, "pre_equip", live(H), live(visualsOnly));
	if (truthy(rt.sv(f, "uniform"))) {
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "uniform"), [live(H)])), 14]);
	}
	if (truthy(rt.sv(f, "suit"))) {
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "suit"), [live(H)])), 13]);
	}
	if (truthy(rt.sv(f, "back"))) {
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "back"), [live(H)])), 1]);
	}
	if (truthy(rt.sv(f, "belt"))) {
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "belt"), [live(H)])), 5]);
	}
	if (truthy(rt.sv(f, "gloves"))) {
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "gloves"), [live(H)])), 9]);
	}
	if (truthy(rt.sv(f, "shoes"))) {
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "shoes"), [live(H)])), 12]);
	}
	if (truthy(rt.sv(f, "head"))) {
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "head"), [live(H)])), 11]);
	}
	if (truthy(rt.sv(f, "mask"))) {
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "mask"), [live(H)])), 2]);
	}
	if (truthy(rt.sv(f, "neck"))) {
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "neck"), [live(H)])), 10]);
	}
	if (truthy(rt.sv(f, "ears"))) {
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "ears"), [live(H)])), 7]);
	}
	if (truthy(rt.sv(f, "glasses"))) {
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "glasses"), [live(H)])), 8]);
	}
	if (truthy(rt.sv(f, "id"))) {
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "id"), [live(H)])), 6]);
	}
	if (truthy(rt.sv(f, "suit_store"))) {
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "suit_store"), [live(H)])), 17]);
	}
	if (truthy(rt.sv(f, "accessory"))) {
		if (truthy((U = rt.fv(f, "w_uniform", live(H))))) {
			yield* g.callName(f, live(U), "attach_accessory", [(yield* g.new_(f, rt.sv(f, "accessory"), [live(H)]))]);
		} else {
			yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("Unable to equip accessory ＀ in outfit ＀. No uniform present!", [rt.sv(f, "accessory"), rt.sv(f, "name")]), "code/datums/outfit.dm", 73, live(f.src), live(f.usr)])]);
		}
	}
	if (truthy(rt.sv(f, "l_hand"))) {
		yield* g.callName(f, live(H), "put_in_l_hand", [(yield* g.new_(f, rt.sv(f, "l_hand"), [live(H)]))]);
	}
	if (truthy(rt.sv(f, "r_hand"))) {
		yield* g.callName(f, live(H), "put_in_r_hand", [(yield* g.new_(f, rt.sv(f, "r_hand"), [live(H)]))]);
	}
	if (!truthy(live(visualsOnly))) {
		if (truthy(rt.sv(f, "l_pocket"))) {
			yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "l_pocket"), [live(H)])), 15]);
		}
		if (truthy(rt.sv(f, "r_pocket"))) {
			yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, rt.sv(f, "r_pocket"), [live(H)])), 16]);
		}
		if (truthy(rt.sv(f, "backpack_contents"))) {
			path = null;
			rt.forList(f, 0, rt.sv(f, "backpack_contents"));
			while (($e = rt.next(f, 0)) !== undefined) {
				path = $e;
				number = rt.index(rt.sv(f, "backpack_contents"), live(path));
				i = null;
				i = 0;
				while (rt.lt(live(i), live(number))) {
					yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, live(path), [live(H)])), 18]);
					i = rt.inc(live(i), 1);
				}
			}
			rt.endFor(f, 0);
		}
	}
	if (((!truthy(rt.fv(f, "head", live(H))) && truthy(rt.sv(f, "toggle_helmet"))) && truthy((rt.istype(rt.fv(f, "wear_suit", live(H)), T("/obj/item/clothing/suit/space/hardsuit")) ? 1 : 0)))) {
		yield* g.callName(f, (HS = rt.fv(f, "wear_suit", live(H))), "ToggleHelmet", []);
	}
	yield* g.srcCall(f, "post_equip", live(H), live(visualsOnly));
	if (!truthy(live(visualsOnly))) {
		yield* g.srcCall(f, "apply_fingerprints", live(H));
		if (truthy(rt.sv(f, "internals_slot"))) {
			rt.setFv(f, "internal", live(H), (yield* g.callName(f, live(H), "get_item_by_slot", [rt.sv(f, "internals_slot")])));
			yield* g.callName(f, live(H), "update_action_buttons_icon", []);
		}
		if (truthy(rt.sv(f, "implants"))) {
			implant_type = null;
			rt.forList(f, 0, rt.sv(f, "implants"));
			while (($e = rt.next(f, 0)) !== undefined) {
				implant_type = $e;
				yield* g.callName(f, (I = (yield* g.new_(f, live(implant_type), [live(H)]))), "implant", [null, live(H), null, null, "silent", 1], rt.Args.Named);
			}
			rt.endFor(f, 0);
		}
	}
	yield* g.callName(f, live(H), "update_body", []);
	return 1;
}, true);

// /datum/outfit/proc/apply_fingerprints  (code/datums/outfit.dm:111)  may sleep
rt.def("/datum/outfit/proc/apply_fingerprints", function* apply_fingerprints(f: Frame, H: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [H, I, $e];
	if (!truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "back", live(H)))) {
		yield* g.callName(f, rt.fv(f, "back", live(H)), "add_fingerprint", [live(H), 1]);
		I = null;
		rt.forList(f, 0, rt.gv(f, "contents", rt.fv(f, "back", live(H))), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.callName(f, live(I), "add_fingerprint", [live(H), 1]);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.fv(f, "wear_id", live(H)))) {
		yield* g.callName(f, rt.fv(f, "wear_id", live(H)), "add_fingerprint", [live(H), 1]);
	}
	if (truthy(rt.fv(f, "w_uniform", live(H)))) {
		yield* g.callName(f, rt.fv(f, "w_uniform", live(H)), "add_fingerprint", [live(H), 1]);
	}
	if (truthy(rt.fv(f, "wear_suit", live(H)))) {
		yield* g.callName(f, rt.fv(f, "wear_suit", live(H)), "add_fingerprint", [live(H), 1]);
	}
	if (truthy(rt.fv(f, "wear_mask", live(H)))) {
		yield* g.callName(f, rt.fv(f, "wear_mask", live(H)), "add_fingerprint", [live(H), 1]);
	}
	if (truthy(rt.fv(f, "wear_neck", live(H)))) {
		yield* g.callName(f, rt.fv(f, "wear_neck", live(H)), "add_fingerprint", [live(H), 1]);
	}
	if (truthy(rt.fv(f, "head", live(H)))) {
		yield* g.callName(f, rt.fv(f, "head", live(H)), "add_fingerprint", [live(H), 1]);
	}
	if (truthy(rt.fv(f, "shoes", live(H)))) {
		yield* g.callName(f, rt.fv(f, "shoes", live(H)), "add_fingerprint", [live(H), 1]);
	}
	if (truthy(rt.fv(f, "gloves", live(H)))) {
		yield* g.callName(f, rt.fv(f, "gloves", live(H)), "add_fingerprint", [live(H), 1]);
	}
	if (truthy(rt.fv(f, "ears", live(H)))) {
		yield* g.callName(f, rt.fv(f, "ears", live(H)), "add_fingerprint", [live(H), 1]);
	}
	if (truthy(rt.fv(f, "glasses", live(H)))) {
		yield* g.callName(f, rt.fv(f, "glasses", live(H)), "add_fingerprint", [live(H), 1]);
	}
	if (truthy(rt.fv(f, "belt", live(H)))) {
		yield* g.callName(f, rt.fv(f, "belt", live(H)), "add_fingerprint", [live(H), 1]);
		I = null;
		rt.forList(f, 0, rt.gv(f, "contents", rt.fv(f, "belt", live(H))), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.callName(f, live(I), "add_fingerprint", [live(H), 1]);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.fv(f, "s_store", live(H)))) {
		yield* g.callName(f, rt.fv(f, "s_store", live(H)), "add_fingerprint", [live(H), 1]);
	}
	if (truthy(rt.fv(f, "l_store", live(H)))) {
		yield* g.callName(f, rt.fv(f, "l_store", live(H)), "add_fingerprint", [live(H), 1]);
	}
	if (truthy(rt.fv(f, "r_store", live(H)))) {
		yield* g.callName(f, rt.fv(f, "r_store", live(H)), "add_fingerprint", [live(H), 1]);
	}
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(H)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(I), "add_fingerprint", [live(H), 1]);
	}
	rt.endFor(f, 0);
	return 1;
}, true);
