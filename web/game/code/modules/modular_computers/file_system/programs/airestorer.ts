// Based on /tg/station's code/modules/modular_computers/file_system/programs/airestorer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(4160, "/datum/computer_file/program/aidiag", "/datum/computer_file/program", {
	restoring: 0,
	filename: "aidiag",
	filedesc: "AI Integrity Restorer",
	program_icon_state: "generic",
	extended_desc: "This program is capable of reconstructing damaged AI systems. Requires direct AI connection via intellicard slot.",
	size: 12,
	requires_ntnet: 0,
	usage_flags: 1,
	available_on_ntnet: 1,
	tgui_id: "ntos_ai_restorer",
	ui_x: 600,
	ui_y: 400,
	transfer_access: 19,
});

// airestorer.dm:22
rt.def("/datum/computer_file/program/aidiag/proc/get_ai", function get_ai(f: Frame, cardcheck: Value) {
	let ai_slot: Value = null;
	if (this.computer) {
		ai_slot = rt.index(this.computer.all_components, "AI");
	}
	if (this.computer && ai_slot && ai_slot.check_functionality()) {
		if (cardcheck == 1) {
			return ai_slot;
		}
		if (ai_slot.enabled && ai_slot.stored_card) {
			if (cardcheck == 2) {
				return ai_slot.stored_card;
			}
			if (ai_slot.stored_card.AI) {
				return ai_slot.stored_card.AI;
			}
		}
	}
	return null;
});

// airestorer.dm:36
rt.def("/datum/computer_file/program/aidiag/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let A: Value = null, ai_slot: Value = null;
	if (yield* parent_proc()) {
		return 1;
	}
	if (!(A = this.get_ai())) {
		this.restoring = 0;
	}
	if (action === "PRG_beginReconstruction") {
		if (A && A.health < 100) {
			this.restoring = 1;
		}
		return 1;
	} else if (action === "PRG_eject") {
		if (!rt.index(this.computer.all_components, "AI")) return f.dot;
		if (!((ai_slot = rt.index(this.computer.all_components, "AI")) && ai_slot.stored_card)) return f.dot;
		yield* ai_slot.try_eject(0, f.usr);
		return 1;
	}
	return f.dot;
}, true);

// airestorer.dm:56
rt.def("/datum/computer_file/program/aidiag/proc/process_tick", function* process_tick(f: Frame) {
	let A: Value = null;
	yield* parent_proc();
	if (!this.restoring) {
		return f.dot;
	}
	let cardhold: Value = this.get_ai(2);
	let ai_slot: Value = this.get_ai(1);
	if (!(A = this.get_ai()) || !cardhold) {
		this.restoring = 0;
		if (ai_slot) {
			ai_slot.locked = 0;
		}
		return f.dot;
	}
	if (cardhold.flush) {
		ai_slot.locked = 0;
		this.restoring = 0;
		return f.dot;
	}
	ai_slot.locked = 1;
	yield* A.adjustOxyLoss(-1, 0);
	yield* A.adjustFireLoss(-1, 0);
	yield* A.adjustToxLoss(-1, 0);
	yield* A.adjustBruteLoss(-1, 0);
	yield* A.updatehealth();
	if (A.health >= 0 && A.stat == 2) {
		yield* A.revive();
	}
	if (A.health >= 100) {
		ai_slot.locked = 0;
		this.restoring = 0;
	}
	return 1;
}, true);

// airestorer.dm:92
rt.def("/datum/computer_file/program/aidiag/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let aicard: Value = null, cardhold: Value = null;
	let data: Value = this.get_header_data();
	let AI: Value = this.get_ai();
	if (!(aicard = this.get_ai(2))) {
		rt.setAt(data, "nocard", 1);
		rt.setAt(data, "error", "Please insert an intelliCard.");
	} else if (!AI) {
		rt.setAt(data, "error", "No AI located");
	} else if ((cardhold = AI.loc).flush) {
		rt.setAt(data, "error", "Flush in progress");
	} else {
		rt.setAt(data, "name", AI.name);
		rt.setAt(data, "restoring", this.restoring);
		rt.setAt(data, "laws", AI.laws.get_law_list({ include_zeroth: 1 }));
		rt.setAt(data, "health", (AI.health + 100) / 2);
		rt.setAt(data, "isDead", (AI.stat == 2 ? 1 : 0));
		rt.setAt(data, "ai_laws", AI.laws.get_law_list({ include_zeroth: 1 }));
	}
	return data;
});

// airestorer.dm:121
rt.def("/datum/computer_file/program/aidiag/proc/kill_program", function kill_program(f: Frame, forced: Value) {
	this.restoring = 0;
	return parent_proc(forced);
});
