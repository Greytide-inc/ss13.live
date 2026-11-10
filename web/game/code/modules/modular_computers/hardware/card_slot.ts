// Based on /tg/station's code/modules/modular_computers/hardware/card_slot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7581, "/obj/item/weapon/computer_hardware/card_slot", "/obj/item/weapon/computer_hardware", {
	stored_card: null,
	stored_card2: null,
	power_usage: 10,
	device_type: "CARD",
	name: "identification card authentication module",
	desc: "A module allowing this computer to read or write data on ID cards. Necessary for some programs to run properly.",
	icon_state: "card_mini",
	w_class: 1,
	origin_tech: "programming=2",
});

// card_slot.dm:14
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.try_eject();
	return (yield* parent_proc());
}, true);

// card_slot.dm:18
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/GetAccess", function GetAccess(f: Frame) {
	if (this.stored_card && this.stored_card2) {
		return rt.bitOr(this.stored_card.GetAccess(), this.stored_card2.GetAccess());
	}
	if (this.stored_card) {
		return this.stored_card.GetAccess();
	}
	if (this.stored_card2) {
		return this.stored_card2.GetAccess();
	}
	return parent_proc();
});

// card_slot.dm:28
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/GetID", function GetID(f: Frame) {
	if (this.stored_card) {
		return this.stored_card;
	} else if (this.stored_card2) {
		return this.stored_card2;
	}
	return parent_proc();
});

// card_slot.dm:34
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/on_install", function on_install(f: Frame, M: Value, user: Value) {
	M.add_verb(this.device_type);
	return f.dot;
});

// card_slot.dm:37
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/on_remove", function on_remove(f: Frame, M: Value, user: Value) {
	M.remove_verb(this.device_type);
	return f.dot;
});

// card_slot.dm:40
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/try_insert", function* try_insert(f: Frame, I: Value, user: Value) {
	if (!this.holder) {
		return 0;
	}
	if (!rt.istype(I, T("/obj/item/weapon/card/id"))) {
		return 0;
	}
	if (this.stored_card && this.stored_card2) {
		to_chat(user, fmt("<span class='warning'>You try to insert ％！ into ％！, but its slots are occupied.</span>", [I, this]));
		return 0;
	}
	if (user) {
		if (!(yield* user.transferItemToLoc(I, this))) {
			return 0;
		}
	} else {
		yield* I.forceMove(this);
	}
	if (!this.stored_card) {
		this.stored_card = I;
	} else {
		this.stored_card2 = I;
	}
	to_chat(user, fmt("<span class='notice'>You insert ％！ into ％！.</span>", [I, this]));
	return 1;
}, true);

// card_slot.dm:65
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/try_eject", function* try_eject(f: Frame, slot: Value, user: Value, forced: Value) {
	let I: Value = null, _P: Value = null;
	let $e: any;
	slot ??= 0;
	forced ??= 0;
	if (!this.stored_card && !this.stored_card2) {
		to_chat(user, fmt("<span class='warning'>There are no cards in ％！.</span>", [this]));
		return 0;
	}
	let ejected: Value = 0;
	if (this.stored_card && (!slot || slot == 1)) {
		if (user) {
			yield* user.put_in_hands(this.stored_card);
		} else {
			yield* this.stored_card.forceMove(rt.getStep(f, this, 0));
		}
		this.stored_card = null;
		ejected++;
	}
	if (this.stored_card2 && (!slot || slot == 2)) {
		if (user) {
			yield* user.put_in_hands(this.stored_card2);
		} else {
			yield* this.stored_card2.forceMove(rt.getStep(f, this, 0));
		}
		this.stored_card2 = null;
		ejected++;
	}
	if (ejected) {
		if (this.holder) {
			if (this.holder.active_program) {
				this.holder.active_program.event_idremoved(0, slot);
			}
			for (I of each(this.holder.idle_threads)) {
				(_P = I).event_idremoved(1, slot);
			}
		}
		to_chat(user, fmt("<span class='notice'>You remove the card＀ from ％！.</span>", [ejected > 1 ? "s" : "", this]));
		return 1;
	}
	return 0;
}, true);

// card_slot.dm:100
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/attackby", function* attackby(f: Frame, I: Value, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!rt.istype(I, T("/obj/item/weapon/screwdriver"))) return f.dot;
	to_chat(user, fmt("<span class='notice'>You press down on the manual eject button with ％！.</span>", [I]));
	yield* this.try_eject(0, user);
	return f.dot;
}, true);

// card_slot.dm:108
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!(this.stored_card || this.stored_card2)) return f.dot;
	to_chat(user, "There appears to be something loaded in the card slots.");
	return f.dot;
}, false);
