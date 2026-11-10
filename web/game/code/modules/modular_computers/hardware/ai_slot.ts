// Based on /tg/station's code/modules/modular_computers/hardware/ai_slot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7579, "/obj/item/weapon/computer_hardware/ai_slot", "/obj/item/weapon/computer_hardware", {
	stored_card: null,
	locked: 0,
	power_usage: 100,
	device_type: "AI",
	name: "intelliCard interface slot",
	desc: "A module allowing this computer to interface with most common intelliCard modules. Necessary for some programs to run properly.",
	icon_state: "card_mini",
	w_class: 2,
	origin_tech: "programming=2",
});

// ai_slot.dm:15
rt.def("/obj/item/weapon/computer_hardware/ai_slot/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.stored_card) return f.dot;
	to_chat(user, "There appears to be an intelliCard loaded. There appears to be a pinhole protecting a manual eject button. A screwdriver could probably press it");
	return f.dot;
}, false);

// ai_slot.dm:20
rt.def("/obj/item/weapon/computer_hardware/ai_slot/proc/on_install", function on_install(f: Frame, M: Value, user: Value) {
	M.add_verb(this.device_type);
	return f.dot;
});

// ai_slot.dm:23
rt.def("/obj/item/weapon/computer_hardware/ai_slot/proc/on_remove", function on_remove(f: Frame, M: Value, user: Value) {
	M.remove_verb(this.device_type);
	return f.dot;
});

// ai_slot.dm:26
rt.def("/obj/item/weapon/computer_hardware/ai_slot/proc/try_insert", function* try_insert(f: Frame, I: Value, user: Value) {
	if (!this.holder) {
		return 0;
	}
	if (!rt.istype(I, T("/obj/item/device/aicard"))) {
		return 0;
	}
	if (this.stored_card) {
		to_chat(user, fmt("<span class='warning'>You try to insert ％！ into ％！, but the slot is occupied.</span>", [I, this]));
		return 0;
	}
	if (user && !(yield* user.transferItemToLoc(I, this))) {
		return 0;
	}
	this.stored_card = I;
	to_chat(user, fmt("<span class='notice'>You insert ％！ into ％！.</span>", [I, this]));
	return 1;
}, true);

// ai_slot.dm:45
rt.def("/obj/item/weapon/computer_hardware/ai_slot/proc/try_eject", function* try_eject(f: Frame, slot: Value, user: Value, forced: Value) {
	slot ??= 0;
	forced ??= 0;
	if (!this.stored_card) {
		to_chat(user, fmt("<span class='warning'>There is no card in ％！.</span>", [this]));
		return 0;
	}
	if (this.locked && !forced) {
		to_chat(user, "<span class='warning'>Safeties prevent you from removing the card until reconstruction is complete...</span>");
		return 0;
	}
	if (this.stored_card) {
		yield* this.stored_card.forceMove(rt.getStep(f, this, 0));
		this.locked = 0;
		yield* this.stored_card.verb_pickup();
		this.stored_card = null;
		to_chat(user, fmt("<span class='notice'>You remove the card from ％！.</span>", [this]));
		return 1;
	}
	return 0;
}, true);

// ai_slot.dm:64
rt.def("/obj/item/weapon/computer_hardware/ai_slot/proc/attackby", function* attackby(f: Frame, I: Value, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!rt.istype(I, T("/obj/item/weapon/screwdriver"))) return f.dot;
	to_chat(user, fmt("<span class='notice'>You press down on the manual eject button with ％！.</span>", [I]));
	yield* this.try_eject(null, user, 1);
	return f.dot;
}, true);
