// From code/modules/modular_computers/file_system/programs/airestorer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/computer_file/program/aidiag/proc/get_ai  (code/modules/modular_computers/file_system/programs/airestorer.dm:22)
rt.def("/datum/computer_file/program/aidiag/proc/get_ai", function get_ai(f: Frame, cardcheck: Value) {
	let ai_slot: Value = null;
	f.vars = () => [ai_slot];
	ai_slot = null;
	if (truthy(rt.sv(f, "computer"))) {
		ai_slot = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "AI");
	}
	if (((truthy(rt.sv(f, "computer")) && truthy(live(ai_slot))) && truthy(rt.callName(f, live(ai_slot), "check_functionality", [])))) {
		if (isEqual(live(cardcheck), 1)) {
			return live(ai_slot);
		}
		if ((truthy(rt.fv(f, "enabled", live(ai_slot))) && truthy(rt.fv(f, "stored_card", live(ai_slot))))) {
			if (isEqual(live(cardcheck), 2)) {
				return rt.fv(f, "stored_card", live(ai_slot));
			}
			if (truthy(rt.gv(f, "AI", rt.fv(f, "stored_card", live(ai_slot))))) {
				return rt.gv(f, "AI", rt.fv(f, "stored_card", live(ai_slot)));
			}
		}
	}
	return null;
});

// /datum/computer_file/program/aidiag/proc/ui_act  (code/modules/modular_computers/file_system/programs/airestorer.dm:36)  may sleep
rt.def("/datum/computer_file/program/aidiag/proc/ui_act", function* ui_act(f: Frame) {
	let A: Value = null, ai_slot: Value = null;
	let $0: any;
	f.vars = () => [A, ai_slot, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if (!truthy((A = (yield* g.srcCall(f, "get_ai"))))) {
		rt.setSv(f, "restoring", 0);
	}
	$0 = live(f.args[0]);
	if ($0 === "PRG_beginReconstruction") {
		if ((truthy(live(A)) && rt.lt(rt.fv(f, "health", live(A)), 100))) {
			rt.setSv(f, "restoring", 1);
		}
		return 1;
	} else if ($0 === "PRG_eject") {
		if (!truthy(rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "AI"))) return f.dot;
		if (!(truthy((ai_slot = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "AI"))) && truthy(rt.fv(f, "stored_card", live(ai_slot))))) return f.dot;
		yield* g.callName(f, live(ai_slot), "try_eject", [0, live(f.usr)]);
		return 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /datum/computer_file/program/aidiag/proc/process_tick  (code/modules/modular_computers/file_system/programs/airestorer.dm:56)  may sleep
rt.def("/datum/computer_file/program/aidiag/proc/process_tick", function* process_tick(f: Frame) {
	let cardhold: Value = null, ai_slot: Value = null, A: Value = null;
	f.vars = () => [cardhold, ai_slot, A];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "restoring"))) {
		return live(f.dot);
	}
	cardhold = (yield* g.srcCall(f, "get_ai", 2));
	ai_slot = (yield* g.srcCall(f, "get_ai", 1));
	if ((!truthy((A = (yield* g.srcCall(f, "get_ai")))) || !truthy(live(cardhold)))) {
		rt.setSv(f, "restoring", 0);
		if (truthy(live(ai_slot))) {
			rt.setFv(f, "locked", live(ai_slot), 0);
		}
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "flush", live(cardhold)))) {
		rt.setFv(f, "locked", live(ai_slot), 0);
		rt.setSv(f, "restoring", 0);
		return live(f.dot);
	}
	rt.setFv(f, "locked", live(ai_slot), 1);
	yield* g.callName(f, live(A), "adjustOxyLoss", [-1, 0]);
	yield* g.callName(f, live(A), "adjustFireLoss", [-1, 0]);
	yield* g.callName(f, live(A), "adjustToxLoss", [-1, 0]);
	yield* g.callName(f, live(A), "adjustBruteLoss", [-1, 0]);
	yield* g.callName(f, live(A), "updatehealth", []);
	if ((rt.ge(rt.fv(f, "health", live(A)), 0) && isEqual(rt.fv(f, "stat", live(A)), 2))) {
		yield* g.callName(f, live(A), "revive", []);
	}
	if (rt.ge(rt.fv(f, "health", live(A)), 100)) {
		rt.setFv(f, "locked", live(ai_slot), 0);
		rt.setSv(f, "restoring", 0);
	}
	return 1;
}, true);

// /datum/computer_file/program/aidiag/proc/ui_data  (code/modules/modular_computers/file_system/programs/airestorer.dm:92)
rt.def("/datum/computer_file/program/aidiag/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, AI: Value = null, aicard: Value = null, cardhold: Value = null;
	f.vars = () => [data, AI, aicard, cardhold];
	data = rt.callSrc(f, "get_header_data", []);
	AI = null;
	AI = rt.callSrc(f, "get_ai", []);
	if (!truthy((aicard = rt.callSrc(f, "get_ai", [2])))) {
		rt.setAt(live(data), "nocard", 1);
		rt.setAt(live(data), "error", "Please insert an intelliCard.");
	} else {
		if (!truthy(live(AI))) {
			rt.setAt(live(data), "error", "No AI located");
		} else {
			if (truthy(rt.gv(f, "flush", (cardhold = rt.fv(f, "loc", live(AI)))))) {
				rt.setAt(live(data), "error", "Flush in progress");
			} else {
				rt.setAt(live(data), "name", rt.fv(f, "name", live(AI)));
				rt.setAt(live(data), "restoring", rt.sv(f, "restoring"));
				rt.setAt(live(data), "laws", rt.callName(f, rt.fv(f, "laws", live(AI)), "get_law_list", ["include_zeroth", 1], rt.Args.Named));
				rt.setAt(live(data), "health", divide(add(rt.fv(f, "health", live(AI)), 100), 2));
				rt.setAt(live(data), "isDead", (isEqual(rt.fv(f, "stat", live(AI)), 2) ? 1 : 0));
				rt.setAt(live(data), "ai_laws", rt.callName(f, rt.fv(f, "laws", live(AI)), "get_law_list", ["include_zeroth", 1], rt.Args.Named));
			}
		}
	}
	return live(data);
});

// /datum/computer_file/program/aidiag/proc/kill_program  (code/modules/modular_computers/file_system/programs/airestorer.dm:121)
rt.def("/datum/computer_file/program/aidiag/proc/kill_program", function kill_program(f: Frame, forced: Value) {
	rt.setSv(f, "restoring", 0);
	return rt.callSuper(f, [live(forced)]);
});
