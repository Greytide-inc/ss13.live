// Based on /tg/station's code/game/objects/items/weapons/storage/wallets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// wallets.dm:33
rt.def("/obj/item/weapon/storage/wallet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.combined_access = list();

	this.can_hold = list(T("/obj/item/stack/spacecash"), T("/obj/item/weapon/card"), T("/obj/item/clothing/mask/cigarette"), T("/obj/item/device/flashlight/pen"), T("/obj/item/seeds"), T("/obj/item/stack/medical"), T("/obj/item/toy/crayon"), T("/obj/item/weapon/coin"), T("/obj/item/weapon/dice"), T("/obj/item/weapon/disk"), T("/obj/item/weapon/implanter"), T("/obj/item/weapon/lighter"), T("/obj/item/weapon/lipstick"), T("/obj/item/weapon/match"), T("/obj/item/weapon/paper"), T("/obj/item/weapon/pen"), T("/obj/item/weapon/photo"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/stamp"));
	return f.dot;
});

// wallets.dm:37
rt.def("/obj/item/weapon/storage/wallet/proc/remove_from_storage", function* remove_from_storage(f: Frame, W: Value, new_location: Value) {
	f.dot = (yield* parent_proc(W, new_location));
	if (!f.dot) return f.dot;
	if (!rt.istype(W, T("/obj/item/weapon/card/id"))) return f.dot;
	if (W == this.front_id) {
		this.front_id = null;
	}
	this.refreshID();
	yield* this.update_icon();
	return f.dot;
}, true);

// wallets.dm:46
rt.def("/obj/item/weapon/storage/wallet/proc/refreshID", function refreshID(f: Frame) {
	let I: Value = null;
	this.combined_access.Cut();
	for (I of each(this.contents, T("/obj/item/weapon/card/id"))) {
		if (!this.front_id) {
			this.front_id = I;
			this.update_icon();
		}
		(rt.modSrcVar(f, "combined_access", I.access, rt.bitOr));
	}
	return f.dot;
});

// wallets.dm:54
rt.def("/obj/item/weapon/storage/wallet/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (!rt.istype(f.args[0], T("/obj/item/weapon/card/id"))) return f.dot;
	this.refreshID();
	return f.dot;
}, true, { args: ["W", "prevent_warning"] });

// wallets.dm:60
rt.def("/obj/item/weapon/storage/wallet/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = "wallet";
	if (!this.front_id) return f.dot;
	this.icon_state = `wallet_${this.front_id.icon_state}`;
	return f.dot;
});

// wallets.dm:70
rt.def("/obj/item/weapon/storage/wallet/proc/GetAccess", function GetAccess(f: Frame) {
	if (rt.len(f, this.combined_access)) {
		return this.combined_access;
	} else {
		return parent_proc();
	}
});

rt.type(5602, "/obj/item/weapon/storage/wallet/random", "/obj/item/weapon/storage/wallet", {});

// wallets.dm:76
rt.def("/obj/item/weapon/storage/wallet/random/proc/PopulateContents", function PopulateContents(f: Frame) {
	let item2_type: Value = null;
	let item1_type: Value = pick(T("/obj/item/stack/spacecash/c10"), T("/obj/item/stack/spacecash/c100"), T("/obj/item/stack/spacecash/c1000"), T("/obj/item/stack/spacecash/c20"), T("/obj/item/stack/spacecash/c200"), T("/obj/item/stack/spacecash/c50"), T("/obj/item/stack/spacecash/c500"));
	if (prob(50)) {
		item2_type = pick(T("/obj/item/stack/spacecash/c10"), T("/obj/item/stack/spacecash/c100"), T("/obj/item/stack/spacecash/c1000"), T("/obj/item/stack/spacecash/c20"), T("/obj/item/stack/spacecash/c200"), T("/obj/item/stack/spacecash/c50"), T("/obj/item/stack/spacecash/c500"));
	}
	let item3_type: Value = pick(T("/obj/item/weapon/coin/silver"), T("/obj/item/weapon/coin/silver"), T("/obj/item/weapon/coin/gold"), T("/obj/item/weapon/coin/iron"), T("/obj/item/weapon/coin/iron"), T("/obj/item/weapon/coin/iron"));
	rt.spawnTail(f, 2, "/obj/item/weapon/storage/wallet/random/proc/PopulateContents: spawn at game/objects/items/weapons/storage/wallets.dm:82", item1_type, item2_type, item3_type);
	return f.dot;
});

// a spawn(2) body of /obj/item/weapon/storage/wallet/random/proc/PopulateContents, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/storage/wallet/random/proc/PopulateContents: spawn at game/objects/items/weapons/storage/wallets.dm:82", function* (f: Frame, item1_type: Value, item2_type: Value, item3_type: Value) {
	if (item1_type) {
		yield* new_(item1_type, this);
	}
	if (item2_type) {
		yield* new_(item2_type, this);
	}
	if (item3_type) {
		yield* new_(item3_type, this);
	}
	return null;
});
