// From code/game/objects/items/weapons/storage/wallets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5601, "/obj/item/weapon/storage/wallet", "/obj/item/weapon/storage", {
	front_id: null,
	combined_access: null,
	storage_slots: 4,
	name: "wallet",
	desc: "It can hold a few small and personal things.",
	icon_state: "wallet",
	w_class: 2,
	resistance_flags: 4,
	can_hold: null,
	slot_flags: 256,
});

// /obj/item/weapon/storage/wallet/proc/<init>  (code/game/objects/items/weapons/storage/wallets.dm:33)
rt.def("/obj/item/weapon/storage/wallet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "combined_access", rt.list());
	$0 = $0;
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/stack/spacecash"), T("/obj/item/weapon/card"), T("/obj/item/clothing/mask/cigarette"), T("/obj/item/device/flashlight/pen"), T("/obj/item/seeds"), T("/obj/item/stack/medical"), T("/obj/item/toy/crayon"), T("/obj/item/weapon/coin"), T("/obj/item/weapon/dice"), T("/obj/item/weapon/disk"), T("/obj/item/weapon/implanter"), T("/obj/item/weapon/lighter"), T("/obj/item/weapon/lipstick"), T("/obj/item/weapon/match"), T("/obj/item/weapon/paper"), T("/obj/item/weapon/pen"), T("/obj/item/weapon/photo"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/stamp")));
	return f.dot;
});

// /obj/item/weapon/storage/wallet/proc/remove_from_storage  (code/game/objects/items/weapons/storage/wallets.dm:37)  may sleep
rt.def("/obj/item/weapon/storage/wallet/proc/remove_from_storage", function* remove_from_storage(f: Frame, W: Value, new_location: Value) {
	f.vars = () => [W, new_location];
	f.dot = (yield* g.callSuper(f, [live(W), live(new_location)]));
	if (!truthy(live(f.dot))) return f.dot;
	if (!truthy((rt.istype(live(W), T("/obj/item/weapon/card/id")) ? 1 : 0))) return f.dot;
	if (isEqual(live(W), rt.sv(f, "front_id"))) {
		rt.setSv(f, "front_id", null);
	}
	yield* g.srcCall(f, "refreshID");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/storage/wallet/proc/refreshID  (code/game/objects/items/weapons/storage/wallets.dm:46)
rt.def("/obj/item/weapon/storage/wallet/proc/refreshID", function refreshID(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	rt.callName(f, rt.sv(f, "combined_access"), "Cut", []);
	I = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/card/id"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy(rt.sv(f, "front_id"))) {
			rt.setSv(f, "front_id", live(I));
			rt.callSrc(f, "update_icon", []);
		}
		(rt.modSrcVar(f, "combined_access", rt.fv(f, "access", live(I)), rt.bitOr));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/storage/wallet/proc/handle_item_insertion  (code/game/objects/items/weapons/storage/wallets.dm:54)  may sleep
rt.def("/obj/item/weapon/storage/wallet/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "refreshID");
	return f.dot;
}, true, { args: ["W", "prevent_warning"] });

// /obj/item/weapon/storage/wallet/proc/update_icon  (code/game/objects/items/weapons/storage/wallets.dm:60)
rt.def("/obj/item/weapon/storage/wallet/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", "wallet");
	if (!truthy(rt.sv(f, "front_id"))) return f.dot;
	rt.setSv(f, "icon_state", fmt("wallet_＀", [rt.fv(f, "icon_state", rt.sv(f, "front_id"))]));
	return f.dot;
});

// /obj/item/weapon/storage/wallet/proc/GetAccess  (code/game/objects/items/weapons/storage/wallets.dm:70)
rt.def("/obj/item/weapon/storage/wallet/proc/GetAccess", function GetAccess(f: Frame) {
	if (truthy(rt.len(f, rt.sv(f, "combined_access")))) {
		return rt.sv(f, "combined_access");
	} else {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
});

rt.type(5602, "/obj/item/weapon/storage/wallet/random", "/obj/item/weapon/storage/wallet", {});

// /obj/item/weapon/storage/wallet/random/proc/PopulateContents  (code/game/objects/items/weapons/storage/wallets.dm:76)
rt.def("/obj/item/weapon/storage/wallet/random/proc/PopulateContents", function PopulateContents(f: Frame) {
	let item1_type: Value = null, item2_type: Value = null, item3_type: Value = null;
	f.vars = () => [item1_type, item2_type, item3_type];
	item1_type = rt.op(f, "PickUnweighted", [7], [T("/obj/item/stack/spacecash/c10"), T("/obj/item/stack/spacecash/c100"), T("/obj/item/stack/spacecash/c1000"), T("/obj/item/stack/spacecash/c20"), T("/obj/item/stack/spacecash/c200"), T("/obj/item/stack/spacecash/c50"), T("/obj/item/stack/spacecash/c500")]);
	item2_type = null;
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		item2_type = rt.op(f, "PickUnweighted", [7], [T("/obj/item/stack/spacecash/c10"), T("/obj/item/stack/spacecash/c100"), T("/obj/item/stack/spacecash/c1000"), T("/obj/item/stack/spacecash/c20"), T("/obj/item/stack/spacecash/c200"), T("/obj/item/stack/spacecash/c50"), T("/obj/item/stack/spacecash/c500")]);
	}
	item3_type = rt.op(f, "PickUnweighted", [6], [T("/obj/item/weapon/coin/silver"), T("/obj/item/weapon/coin/silver"), T("/obj/item/weapon/coin/gold"), T("/obj/item/weapon/coin/iron"), T("/obj/item/weapon/coin/iron"), T("/obj/item/weapon/coin/iron")]);
	rt.spawnTail(f, 2, "/obj/item/weapon/storage/wallet/random/proc/PopulateContents: spawn at game/objects/items/weapons/storage/wallets.dm:82", item1_type, item2_type, item3_type);
	return f.dot;
});

// a spawn(2) body of /obj/item/weapon/storage/wallet/random/proc/PopulateContents, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/storage/wallet/random/proc/PopulateContents: spawn at game/objects/items/weapons/storage/wallets.dm:82", function* (f: Frame, item1_type: Value, item2_type: Value, item3_type: Value) {
	f.vars = () => [item1_type, item2_type, item3_type];
	if (truthy(live(item1_type))) {
		yield* g.new_(f, live(item1_type), [live(f.src)]);
	}
	if (truthy(live(item2_type))) {
		yield* g.new_(f, live(item2_type), [live(f.src)]);
	}
	if (truthy(live(item3_type))) {
		yield* g.new_(f, live(item3_type), [live(f.src)]);
	}
	return null;
});
