// Based on /tg/station's code/game/objects/items/devices/aicard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9226, "/obj/item/device/aicard", "/obj/item/device", {
	flush: 0,
	AI: null,
	flags: 4,
	name: "intelliCard",
	desc: "A storage device for AIs. Patent pending.",
	icon: rt.rsc("icons/obj/aicards.dmi"),
	icon_state: "aicard",
	item_state: "electronic",
	w_class: 2,
	slot_flags: 512,
	origin_tech: "programming=3;materials=3",
});

// aicard.dm:15
rt.def("/obj/item/device/aicard/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	yield* parent_proc();
	if (!proximity || !target) {
		return f.dot;
	}
	if (this.AI) {
		yield* target.transfer_ai(AI_TRANS_FROM_CARD, user, this.AI, this);
		add_logs(user, this.AI, "carded", this);
	} else {
		yield* target.transfer_ai(AI_TRANS_TO_CARD, user, null, this);
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// aicard.dm:26
rt.def("/obj/item/device/aicard/proc/update_icon", function* update_icon(f: Frame) {
	this.cut_overlays();
	if (this.AI) {
		this.name = `${rt.initial(f, this, "name")}- ${this.AI.name}`;
		if (this.AI.stat == 2) {
			this.icon_state = "aicard-404";
		} else {
			this.icon_state = "aicard-full";
		}
		if (!this.AI.control_disabled) {
			this.add_overlay("aicard-on");
		}
		yield* this.AI.cancel_camera();
	} else {
		this.name = rt.initial(f, this, "name");
		this.icon_state = rt.initial(f, this, "icon_state");
	}
	return f.dot;
}, true);

// aicard.dm:42
rt.def("/obj/item/device/aicard/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.hands_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "intellicard", this.name, 500, 500, master_ui, state))).open();
	return f.dot;
}, true);

// aicard.dm:48
rt.def("/obj/item/device/aicard/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = list();
	if (this.AI) {
		rt.setAt(data, "name", this.AI.name);
		rt.setAt(data, "laws", this.AI.laws.get_law_list({ include_zeroth: 1 }));
		rt.setAt(data, "health", (this.AI.health + 100) / 2);
		rt.setAt(data, "wireless", (!this.AI.control_disabled ? 1 : 0));
		rt.setAt(data, "radio", this.AI.radio_enabled);
		rt.setAt(data, "isDead", (this.AI.stat == 2 ? 1 : 0));
		rt.setAt(data, "isBraindead", this.AI.client ? 0 : 1);
	}
	rt.setAt(data, "wiping", this.flush);
	return data;
});

// aicard.dm:61
rt.def("/obj/item/device/aicard/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let confirm: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "wipe") {
		if (this.flush) {
			this.flush = 0;
		} else if ((confirm = (yield* alert("Are you sure you want to wipe this card's memory?", this.name, "Yes", "No"))) == "Yes" && !(yield* parent_proc())) {
			this.flush = 1;
			if (this.AI && this.AI.loc == this) {
				to_chat(this.AI, "Your core files are being wiped!");
				while (this.AI.stat != 2 && this.flush) {
					yield* this.AI.adjustOxyLoss(1);
					yield* this.AI.updatehealth();
					yield* sleep(5);
				}
				this.flush = 0;
			}
		}
		f.dot = 1;
	} else if (action === "wireless") {
		this.AI.control_disabled = (!this.AI.control_disabled ? 1 : 0);
		to_chat(this.AI, `${this}'s wireless port has been ${this.AI.control_disabled ? "disabled" : "enabled"}!`);
		f.dot = 1;
	} else if (action === "radio") {
		this.AI.radio_enabled = (!this.AI.radio_enabled ? 1 : 0);
		to_chat(this.AI, `Your Subspace Transceiver has been ${this.AI.radio_enabled ? "enabled" : "disabled"}!`);
		f.dot = 1;
	}
	yield* this.update_icon();
	return f.dot;
}, true);
