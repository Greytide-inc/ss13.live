// From code/game/gamemodes/objective.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1102, "/datum/objective", "/datum", {
	owner: null,
	explanation_text: "Nothing",
	target: null,
	target_amount: 0,
	completed: 0,
	dangerrating: 0,
	martyr_compatible: 0,
});

// /datum/objective/proc/New  (code/game/gamemodes/objective.dm:12)
rt.def("/datum/objective/proc/New", function New(f: Frame, text: Value) {
	if (!truthy(live(text))) return f.dot;
	rt.setSv(f, "explanation_text", live(text));
	return f.dot;
});

// /datum/objective/proc/is_unique_objective  (code/game/gamemodes/objective.dm:18)
rt.def("/datum/objective/proc/is_unique_objective", function is_unique_objective(f: Frame, possible_target: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	O = null;
	rt.forList(f, 0, rt.fv(f, "objectives", rt.sv(f, "owner")), T("/datum/objective"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((truthy(rt.op(f, "IsType", [], [live(O), rt.sv(f, "type")])) && isEqual(rt.callName(f, live(O), "get_target", []), live(possible_target)))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/objective/proc/get_crewmember_minds  (code/game/gamemodes/objective.dm:28)
rt.def("/datum/objective/proc/get_crewmember_minds", function get_crewmember_minds(f: Frame) {
	let V: Value = null, R: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [V, R, M, $e];
	f.dot = rt.list();
	V = null;
	rt.forList(f, 0, rt.fv(f, "locked", rt.gl("data_core")));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		R = live(V);
		if ((truthy((M = rt.index(rt.fv(f, "fields", live(R)), "reference"))) && truthy(rt.fv(f, "mind", live(M))))) {
			f.dot = rt.modify(live(f.dot), rt.fv(f, "mind", live(M)), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/objective/proc/find_target  (code/game/gamemodes/objective.dm:36)
rt.def("/datum/objective/proc/find_target", function find_target(f: Frame) {
	let possible_targets: Value = null, possible_target: Value = null;
	let $e: any;
	f.vars = () => [possible_targets, possible_target, $e];
	possible_targets = rt.list();
	possible_target = null;
	rt.forList(f, 0, rt.callSrc(f, "get_crewmember_minds", []), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		possible_target = $e;
		if ((((!isEqual(live(possible_target), rt.sv(f, "owner")) && truthy((rt.istype(rt.fv(f, "current", live(possible_target)), T("/mob/living/carbon/human")) ? 1 : 0))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(possible_target))), 2)) && truthy(rt.callSrc(f, "is_unique_objective", [live(possible_target)])))) {
			possible_targets = rt.modify(live(possible_targets), live(possible_target), add);
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.len(f, live(possible_targets)), 0)) {
		rt.setSv(f, "target", rt.op(f, "PickUnweighted", [1], [live(possible_targets)]));
	}
	rt.callSrc(f, "update_explanation_text", []);
	return rt.sv(f, "target");
});

// /datum/objective/proc/find_target_by_role  (code/game/gamemodes/objective.dm:46)
rt.def("/datum/objective/proc/find_target_by_role", function find_target_by_role(f: Frame, role: Value, role_type: Value, invert: Value) {
	let possible_target: Value = null, is_role: Value = null;
	let $e: any;
	f.vars = () => [role_type, invert, possible_target, is_role, $e];
	if (live(role_type) === null) {
		role_type = 0;
	}
	if (live(invert) === null) {
		invert = 0;
	}
	possible_target = null;
	rt.forList(f, 0, rt.callSrc(f, "get_crewmember_minds", []), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		possible_target = $e;
		if ((!isEqual(live(possible_target), rt.sv(f, "owner")) && truthy((rt.istype(rt.fv(f, "current", live(possible_target)), T("/mob/living/carbon/human")) ? 1 : 0)))) {
			is_role = 0;
			if (truthy(live(role_type))) {
				if (isEqual(rt.fv(f, "special_role", live(possible_target)), live(role))) {
					is_role = rt.inc(live(is_role), 1);
				}
			} else {
				if (isEqual(rt.fv(f, "assigned_role", live(possible_target)), live(role))) {
					is_role = rt.inc(live(is_role), 1);
				}
			}
			if (truthy(live(invert))) {
				if (truthy(live(is_role))) {
					continue;
				}
				rt.setSv(f, "target", live(possible_target));
				break;
			}
			if (truthy(live(is_role))) {
				rt.setSv(f, "target", live(possible_target));
				break;
			}
		}
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "update_explanation_text", []);
	return f.dot;
});

// /datum/objective/proc/give_special_equipment  (code/game/gamemodes/objective.dm:71)  may sleep
rt.def("/datum/objective/proc/give_special_equipment", function* give_special_equipment(f: Frame, special_equipment: Value) {
	let H: Value = null, slots: Value = null, eq_path: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [special_equipment, H, slots, eq_path, O, $e];
	if (!(truthy(rt.sv(f, "owner")) && truthy(rt.fv(f, "current", rt.sv(f, "owner"))))) return f.dot;
	if (!truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	H = rt.fv(f, "current", rt.sv(f, "owner"));
	slots = rt.alist(f, ["backpack", 18]);
	eq_path = null;
	rt.forList(f, 0, live(special_equipment));
	while (($e = rt.next(f, 0)) !== undefined) {
		eq_path = $e;
		O = (yield* g.new_(f, live(eq_path), []));
		yield* g.callName(f, live(H), "equip_in_one_of_slots", [live(O), live(slots)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(1103, "/datum/objective/assassinate", "/datum/objective", {
	target_role_type: 0,
	dangerrating: 10,
	martyr_compatible: 1,
});

// /datum/objective/assassinate/proc/find_target_by_role  (code/game/gamemodes/objective.dm:85)
rt.def("/datum/objective/assassinate/proc/find_target_by_role", function find_target_by_role(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy(live(f.args[2]))) {
		rt.setSv(f, "target_role_type", live(f.args[1]));
	}
	rt.callSuper(f, [], rt.Args.Same);
	return rt.sv(f, "target");
}, false, { args: ["role", "role_type", "invert"] });

// /datum/objective/assassinate/proc/check_completion  (code/game/gamemodes/objective.dm:91)
rt.def("/datum/objective/assassinate/proc/check_completion", function check_completion(f: Frame) {
	if ((truthy(rt.sv(f, "target")) && truthy(rt.fv(f, "current", rt.sv(f, "target"))))) {
		if (((((isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "target"))), 2) || truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "target")), T("/mob/living/silicon")) ? 1 : 0))) || truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "target")), T("/mob/living/brain")) ? 1 : 0))) || rt.gt(rt.gv(f, "z", rt.fv(f, "current", rt.sv(f, "target"))), 6)) || !truthy(rt.gv(f, "ckey", rt.fv(f, "current", rt.sv(f, "target")))))) {
			return 1;
		}
		return 0;
	}
	return 1;
});

// /datum/objective/assassinate/proc/update_explanation_text  (code/game/gamemodes/objective.dm:98)
rt.def("/datum/objective/assassinate/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "target")) && truthy(rt.fv(f, "current", rt.sv(f, "target"))))) {
		$0 = rt.fv(f, "name", rt.sv(f, "target"));
		if (!truthy(rt.sv(f, "target_role_type"))) {
			$1 = rt.fv(f, "assigned_role", rt.sv(f, "target"));
		} else {
			$1 = rt.fv(f, "special_role", rt.sv(f, "target"));
		}
		rt.setSv(f, "explanation_text", fmt("Assassinate ＀, the ＀.", [$0, $1]));
	} else {
		rt.setSv(f, "explanation_text", "Free Objective");
	}
	return f.dot;
});

rt.type(1104, "/datum/objective/assassinate/internal", "/datum/objective/assassinate", {
	stolen: 0,
});

// /datum/objective/assassinate/internal/proc/update_explanation_text  (code/game/gamemodes/objective.dm:108)
rt.def("/datum/objective/assassinate/internal/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "target")) && !truthy(rt.fv(f, "current", rt.sv(f, "target"))))) return f.dot;
	rt.setSv(f, "explanation_text", fmt("Assassinate ＀, who was obliterated", [rt.fv(f, "name", rt.sv(f, "target"))]));
	return f.dot;
});

rt.type(1105, "/datum/objective/mutiny", "/datum/objective", {
	target_role_type: 0,
	martyr_compatible: 1,
});

// /datum/objective/mutiny/proc/find_target_by_role  (code/game/gamemodes/objective.dm:118)
rt.def("/datum/objective/mutiny/proc/find_target_by_role", function find_target_by_role(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy(live(f.args[2]))) {
		rt.setSv(f, "target_role_type", live(f.args[1]));
	}
	rt.callSuper(f, [], rt.Args.Same);
	return rt.sv(f, "target");
}, false, { args: ["role", "role_type", "invert"] });

// /datum/objective/mutiny/proc/check_completion  (code/game/gamemodes/objective.dm:124)
rt.def("/datum/objective/mutiny/proc/check_completion", function check_completion(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if ((truthy(rt.sv(f, "target")) && truthy(rt.fv(f, "current", rt.sv(f, "target"))))) {
		if (((isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "target"))), 2) || !truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "target")), T("/mob/living/carbon/human")) ? 1 : 0))) || !truthy(rt.gv(f, "ckey", rt.fv(f, "current", rt.sv(f, "target")))))) {
			return 1;
		}
		if (((truthy((_T = rt.getStep(f, rt.fv(f, "current", rt.sv(f, "target")), 0))) && rt.gt(rt.fv(f, "z", live(_T)), 2)) || (truthy(rt.gv(f, "client", rt.fv(f, "current", rt.sv(f, "target")))) && truthy(rt.callName(f, rt.gv(f, "client", rt.fv(f, "current", rt.sv(f, "target"))), "is_afk", []))))) {
			return 2;
		}
		return 0;
	}
	return 1;
});

// /datum/objective/mutiny/proc/update_explanation_text  (code/game/gamemodes/objective.dm:134)
rt.def("/datum/objective/mutiny/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "target")) && truthy(rt.fv(f, "current", rt.sv(f, "target"))))) {
		$0 = rt.fv(f, "name", rt.sv(f, "target"));
		if (!truthy(rt.sv(f, "target_role_type"))) {
			$1 = rt.fv(f, "assigned_role", rt.sv(f, "target"));
		} else {
			$1 = rt.fv(f, "special_role", rt.sv(f, "target"));
		}
		rt.setSv(f, "explanation_text", fmt("Assassinate or exile ＀, the ＀.", [$0, $1]));
	} else {
		rt.setSv(f, "explanation_text", "Free Objective");
	}
	return f.dot;
});

rt.type(1106, "/datum/objective/maroon", "/datum/objective", {
	target_role_type: 0,
	dangerrating: 5,
	martyr_compatible: 1,
});

// /datum/objective/maroon/proc/find_target_by_role  (code/game/gamemodes/objective.dm:148)
rt.def("/datum/objective/maroon/proc/find_target_by_role", function find_target_by_role(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy(live(f.args[2]))) {
		rt.setSv(f, "target_role_type", live(f.args[1]));
	}
	rt.callSuper(f, [], rt.Args.Same);
	return rt.sv(f, "target");
}, false, { args: ["role", "role_type", "invert"] });

// /datum/objective/maroon/proc/check_completion  (code/game/gamemodes/objective.dm:154)
rt.def("/datum/objective/maroon/proc/check_completion", function check_completion(f: Frame) {
	if ((truthy(rt.sv(f, "target")) && truthy(rt.fv(f, "current", rt.sv(f, "target"))))) {
		if (((((isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "target"))), 2) || truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "target")), T("/mob/living/silicon")) ? 1 : 0))) || truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "target")), T("/mob/living/brain")) ? 1 : 0))) || rt.gt(rt.gv(f, "z", rt.fv(f, "current", rt.sv(f, "target"))), 6)) || !truthy(rt.gv(f, "ckey", rt.fv(f, "current", rt.sv(f, "target")))))) {
			return 1;
		}
		if ((truthy(rt.callName(f, rt.fv(f, "current", rt.sv(f, "target")), "onCentcom", [])) || truthy(rt.callName(f, rt.fv(f, "current", rt.sv(f, "target")), "onSyndieBase", [])))) {
			return 0;
		}
	}
	return 1;
});

// /datum/objective/maroon/proc/update_explanation_text  (code/game/gamemodes/objective.dm:162)
rt.def("/datum/objective/maroon/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if ((truthy(rt.sv(f, "target")) && truthy(rt.fv(f, "current", rt.sv(f, "target"))))) {
		$0 = rt.fv(f, "name", rt.sv(f, "target"));
		if (!truthy(rt.sv(f, "target_role_type"))) {
			$1 = rt.fv(f, "assigned_role", rt.sv(f, "target"));
		} else {
			$1 = rt.fv(f, "special_role", rt.sv(f, "target"));
		}
		rt.setSv(f, "explanation_text", fmt("Prevent ＀, the ＀, from escaping alive.", [$0, $1]));
	} else {
		rt.setSv(f, "explanation_text", "Free Objective");
	}
	return f.dot;
});

rt.type(1107, "/datum/objective/debrain", "/datum/objective", {
	target_role_type: 0,
	dangerrating: 20,
});

// /datum/objective/debrain/proc/find_target_by_role  (code/game/gamemodes/objective.dm:174)
rt.def("/datum/objective/debrain/proc/find_target_by_role", function find_target_by_role(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy(live(f.args[2]))) {
		rt.setSv(f, "target_role_type", live(f.args[1]));
	}
	rt.callSuper(f, [], rt.Args.Same);
	return rt.sv(f, "target");
}, false, { args: ["role", "role_type", "invert"] });

// /datum/objective/debrain/proc/check_completion  (code/game/gamemodes/objective.dm:180)
rt.def("/datum/objective/debrain/proc/check_completion", function check_completion(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (!truthy(rt.sv(f, "target"))) {
		return 1;
	}
	if ((!truthy(rt.fv(f, "current", rt.sv(f, "owner"))) || isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "owner"))), 2))) {
		return 0;
	}
	if ((!truthy(rt.fv(f, "current", rt.sv(f, "target"))) || !truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "target")), T("/mob/living/brain")) ? 1 : 0)))) {
		return 0;
	}
	A = rt.fv(f, "current", rt.sv(f, "target"));
	while (truthy(rt.fv(f, "loc", live(A)))) {
		if (isEqual((A = rt.fv(f, "loc", live(A))), rt.fv(f, "current", rt.sv(f, "owner")))) {
			return 1;
		}
	}
	return 0;
});

// /datum/objective/debrain/proc/update_explanation_text  (code/game/gamemodes/objective.dm:194)
rt.def("/datum/objective/debrain/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "target")) && truthy(rt.fv(f, "current", rt.sv(f, "target"))))) {
		$0 = rt.fv(f, "name", rt.sv(f, "target"));
		if (!truthy(rt.sv(f, "target_role_type"))) {
			$1 = rt.fv(f, "assigned_role", rt.sv(f, "target"));
		} else {
			$1 = rt.fv(f, "special_role", rt.sv(f, "target"));
		}
		rt.setSv(f, "explanation_text", fmt("Steal the brain of ＀, the ＀.", [$0, $1]));
	} else {
		rt.setSv(f, "explanation_text", "Free Objective");
	}
	return f.dot;
});

rt.type(1108, "/datum/objective/protect", "/datum/objective", {
	target_role_type: 0,
	dangerrating: 10,
	martyr_compatible: 1,
});

// /datum/objective/protect/proc/find_target_by_role  (code/game/gamemodes/objective.dm:208)
rt.def("/datum/objective/protect/proc/find_target_by_role", function find_target_by_role(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy(live(f.args[2]))) {
		rt.setSv(f, "target_role_type", live(f.args[1]));
	}
	rt.callSuper(f, [], rt.Args.Same);
	return rt.sv(f, "target");
}, false, { args: ["role", "role_type", "invert"] });

// /datum/objective/protect/proc/check_completion  (code/game/gamemodes/objective.dm:214)
rt.def("/datum/objective/protect/proc/check_completion", function check_completion(f: Frame) {
	if (!truthy(rt.sv(f, "target"))) {
		return 1;
	}
	if (truthy(rt.fv(f, "current", rt.sv(f, "target")))) {
		if (((isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "target"))), 2) || truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "target")), T("/mob/living/silicon")) ? 1 : 0))) || truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "target")), T("/mob/living/brain")) ? 1 : 0)))) {
			return 0;
		}
		return 1;
	}
	return 0;
});

// /datum/objective/protect/proc/update_explanation_text  (code/game/gamemodes/objective.dm:223)
rt.def("/datum/objective/protect/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "target")) && truthy(rt.fv(f, "current", rt.sv(f, "target"))))) {
		$0 = rt.fv(f, "name", rt.sv(f, "target"));
		if (!truthy(rt.sv(f, "target_role_type"))) {
			$1 = rt.fv(f, "assigned_role", rt.sv(f, "target"));
		} else {
			$1 = rt.fv(f, "special_role", rt.sv(f, "target"));
		}
		rt.setSv(f, "explanation_text", fmt("Protect ＀, the ＀.", [$0, $1]));
	} else {
		rt.setSv(f, "explanation_text", "Free Objective");
	}
	return f.dot;
});

rt.type(1109, "/datum/objective/hijack", "/datum/objective", {
	explanation_text: "Hijack the shuttle to ensure no loyalist Nanotrasen crew escape alive and out of custody.",
	dangerrating: 25,
	martyr_compatible: 0,
});

// /datum/objective/hijack/proc/check_completion  (code/game/gamemodes/objective.dm:237)
rt.def("/datum/objective/hijack/proc/check_completion", function check_completion(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if ((!truthy(rt.fv(f, "current", rt.sv(f, "owner"))) || truthy(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "owner")))))) {
		return 0;
	}
	if (!isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "endgame: game over")) {
		return 0;
	}
	if (truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/silicon")) ? 1 : 0))) {
		return 0;
	}
	A = rt.call(f, P("/proc/get_area"), null, [rt.fv(f, "current", rt.sv(f, "owner"))]);
	if (!isEqual(rt.gv(f, "areaInstance", rt.fv(f, "emergency", rt.gl("SSshuttle"))), live(A))) {
		return 0;
	}
	return rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "is_hijacked", []);
});

rt.type(1110, "/datum/objective/hijackclone", "/datum/objective", {
	explanation_text: "Hijack the emergency shuttle by ensuring only you (or your copies) escape.",
	dangerrating: 25,
	martyr_compatible: 0,
});

// /datum/objective/hijackclone/proc/check_completion  (code/game/gamemodes/objective.dm:257)
rt.def("/datum/objective/hijackclone/proc/check_completion", function check_completion(f: Frame) {
	let A: Value = null, player: Value = null, location: Value = null;
	let $e: any;
	f.vars = () => [A, player, location, $e];
	if (!truthy(rt.fv(f, "current", rt.sv(f, "owner")))) {
		return 0;
	}
	if (!isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "endgame: game over")) {
		return 0;
	}
	A = rt.gv(f, "areaInstance", rt.fv(f, "emergency", rt.gl("SSshuttle")));
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if ((truthy(rt.fv(f, "mind", live(player))) && !isEqual(rt.fv(f, "mind", live(player)), rt.sv(f, "owner")))) {
			if (!isEqual(rt.fv(f, "stat", live(player)), 2)) {
				if (truthy((rt.istype(live(player), T("/mob/living/silicon")) ? 1 : 0))) {
					continue;
				}
				if (truthy((rt.istype(live(player), T("/mob/living/simple_animal")) ? 1 : 0))) {
					continue;
				}
				if (truthy((rt.istype(live(player), T("/mob/living/brain")) ? 1 : 0))) {
					continue;
				}
				if (isEqual(rt.call(f, P("/proc/get_area"), null, [live(player)]), live(A))) {
					location = rt.getStep(f, rt.gv(f, "current", rt.fv(f, "mind", live(player))), 0);
					if (((!isEqual(rt.fv(f, "real_name", live(player)), rt.gv(f, "real_name", rt.fv(f, "current", rt.sv(f, "owner")))) && !truthy((rt.istype(live(location), T("/turf/open/floor/plasteel/shuttle/red")) ? 1 : 0))) && !truthy((rt.istype(live(location), T("/turf/open/floor/mineral/plastitanium/brig")) ? 1 : 0)))) {
						return 0;
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if ((truthy(rt.fv(f, "mind", live(player))) && !isEqual(rt.fv(f, "mind", live(player)), rt.sv(f, "owner")))) {
			if (!isEqual(rt.fv(f, "stat", live(player)), 2)) {
				if (truthy((rt.istype(live(player), T("/mob/living/silicon")) ? 1 : 0))) {
					continue;
				}
				if (truthy((rt.istype(live(player), T("/mob/living/simple_animal")) ? 1 : 0))) {
					continue;
				}
				if (truthy((rt.istype(live(player), T("/mob/living/brain")) ? 1 : 0))) {
					continue;
				}
				if (isEqual(rt.call(f, P("/proc/get_area"), null, [live(player)]), live(A))) {
					location = rt.getStep(f, rt.gv(f, "current", rt.fv(f, "mind", live(player))), 0);
					if (((isEqual(rt.fv(f, "real_name", live(player)), rt.gv(f, "real_name", rt.fv(f, "current", rt.sv(f, "owner")))) && !truthy((rt.istype(live(location), T("/turf/open/floor/plasteel/shuttle/red")) ? 1 : 0))) && !truthy((rt.istype(live(location), T("/turf/open/floor/mineral/plastitanium/brig")) ? 1 : 0)))) {
						return 1;
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	return 0;
});

rt.type(1111, "/datum/objective/block", "/datum/objective", {
	explanation_text: "Do not allow any organic lifeforms to escape on the shuttle alive.",
	dangerrating: 25,
	martyr_compatible: 1,
});

// /datum/objective/block/proc/check_completion  (code/game/gamemodes/objective.dm:299)
rt.def("/datum/objective/block/proc/check_completion", function check_completion(f: Frame) {
	let A: Value = null, player: Value = null;
	let $e: any;
	f.vars = () => [A, player, $e];
	if (!truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/silicon")) ? 1 : 0))) {
		return 0;
	}
	if (!isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "endgame: game over")) {
		return 1;
	}
	A = rt.gv(f, "areaInstance", rt.fv(f, "emergency", rt.gl("SSshuttle")));
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if (truthy((rt.istype(live(player), T("/mob/living/silicon")) ? 1 : 0))) {
			continue;
		}
		if (truthy(rt.fv(f, "mind", live(player)))) {
			if (!isEqual(rt.fv(f, "stat", live(player)), 2)) {
				if (isEqual(rt.call(f, P("/proc/get_area"), null, [live(player)]), live(A))) {
					return 0;
				}
			}
		}
	}
	rt.endFor(f, 0);
	return 1;
});

rt.type(1112, "/datum/objective/purge", "/datum/objective", {
	explanation_text: "Ensure no mutant humanoid species are present aboard the escape shuttle.",
	dangerrating: 25,
	martyr_compatible: 1,
});

// /datum/objective/purge/proc/check_completion  (code/game/gamemodes/objective.dm:323)
rt.def("/datum/objective/purge/proc/check_completion", function check_completion(f: Frame) {
	let A: Value = null, player: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [A, player, H, $e];
	if (!isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "endgame: game over")) {
		return 1;
	}
	A = rt.gv(f, "areaInstance", rt.fv(f, "emergency", rt.gl("SSshuttle")));
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if ((((isEqual(rt.call(f, P("/proc/get_area"), null, [live(player)]), live(A)) && truthy(rt.fv(f, "mind", live(player)))) && !isEqual(rt.fv(f, "stat", live(player)), 2)) && truthy((rt.istype(live(player), T("/mob/living/carbon/human")) ? 1 : 0)))) {
			if (!isEqual(rt.gv(f, "id", rt.gv(f, "species", rt.gv(f, "dna", (H = live(player))))), "human")) {
				return 0;
			}
		}
	}
	rt.endFor(f, 0);
	return 1;
});

rt.type(1113, "/datum/objective/robot_army", "/datum/objective", {
	explanation_text: "Have at least eight active cyborgs synced to you.",
	dangerrating: 25,
	martyr_compatible: 0,
});

// /datum/objective/robot_army/proc/check_completion  (code/game/gamemodes/objective.dm:343)
rt.def("/datum/objective/robot_army/proc/check_completion", function check_completion(f: Frame) {
	let A: Value = null, counter: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [A, counter, R, $e];
	if (!truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		return 0;
	}
	A = rt.fv(f, "current", rt.sv(f, "owner"));
	counter = 0;
	R = null;
	rt.forList(f, 0, rt.fv(f, "connected_robots", live(A)), T("/mob/living/silicon/robot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (!isEqual(rt.fv(f, "stat", live(R)), 2)) {
			counter = rt.inc(live(counter), 1);
		}
	}
	rt.endFor(f, 0);
	if (rt.lt(live(counter), 8)) {
		return 0;
	}
	return 1;
});

rt.type(1114, "/datum/objective/escape", "/datum/objective", {
	explanation_text: "Escape on the shuttle or an escape pod alive and without being in custody.",
	dangerrating: 5,
});

// /datum/objective/escape/proc/check_completion  (code/game/gamemodes/objective.dm:362)
rt.def("/datum/objective/escape/proc/check_completion", function check_completion(f: Frame) {
	let location: Value = null;
	f.vars = () => [location];
	if (truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/silicon")) ? 1 : 0))) {
		return 0;
	}
	if (truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/brain")) ? 1 : 0))) {
		return 0;
	}
	if ((!truthy(rt.fv(f, "current", rt.sv(f, "owner"))) || isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "owner"))), 2))) {
		return 0;
	}
	if (truthy(rt.fv(f, "force_ending", rt.gl("SSticker")))) {
		return 1;
	}
	if (truthy(rt.gv(f, "station_was_nuked", rt.fv(f, "mode", rt.gl("SSticker"))))) {
		return 1;
	}
	if (!isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "endgame: game over")) {
		return 0;
	}
	if (!truthy((location = rt.getStep(f, rt.fv(f, "current", rt.sv(f, "owner")), 0)))) {
		return 0;
	}
	if ((truthy((rt.istype(live(location), T("/turf/open/floor/plasteel/shuttle/red")) ? 1 : 0)) || truthy((rt.istype(live(location), T("/turf/open/floor/mineral/plastitanium/brig")) ? 1 : 0)))) {
		return 0;
	}
	if ((truthy(rt.callName(f, live(location), "onCentcom", [])) || truthy(rt.callName(f, live(location), "onSyndieBase", [])))) {
		return 1;
	}
	return 0;
});

rt.type(1115, "/datum/objective/escape/escape_with_identity", "/datum/objective/escape", {
	target_real_name: null,
	target_missing_id: null,
	dangerrating: 10,
});

// /datum/objective/escape/escape_with_identity/proc/find_target  (code/game/gamemodes/objective.dm:392)
rt.def("/datum/objective/escape/escape_with_identity/proc/find_target", function find_target(f: Frame) {
	rt.setSv(f, "target", rt.callSuper(f, [], rt.Args.Same));
	rt.callSrc(f, "update_explanation_text", []);
	return f.dot;
});

// /datum/objective/escape/escape_with_identity/proc/update_explanation_text  (code/game/gamemodes/objective.dm:396)
rt.def("/datum/objective/escape/escape_with_identity/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if ((truthy(rt.sv(f, "target")) && truthy(rt.fv(f, "current", rt.sv(f, "target"))))) {
		rt.setSv(f, "target_real_name", rt.gv(f, "real_name", rt.fv(f, "current", rt.sv(f, "target"))));
		rt.setSv(f, "explanation_text", fmt("Escape on the shuttle or an escape pod with the identity of ＀, the ＀", [rt.sv(f, "target_real_name"), rt.fv(f, "assigned_role", rt.sv(f, "target"))]));
		H = null;
		if (truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "target")), T("/mob/living/carbon/human")) ? 1 : 0))) {
			H = rt.fv(f, "current", rt.sv(f, "target"));
		}
		if ((truthy(live(H)) && !isEqual(rt.callName(f, live(H), "get_id_name", []), rt.sv(f, "target_real_name")))) {
			rt.setSv(f, "target_missing_id", 1);
		} else {
			rt.modSrcVar(f, "explanation_text", " while wearing their identification card", add);
		}
		rt.modSrcVar(f, "explanation_text", ".", add);
	} else {
		rt.setSv(f, "explanation_text", "Free Objective.");
	}
	return f.dot;
});

// /datum/objective/escape/escape_with_identity/proc/check_completion  (code/game/gamemodes/objective.dm:412)
rt.def("/datum/objective/escape/escape_with_identity/proc/check_completion", function check_completion(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy(rt.sv(f, "target_real_name"))) {
		return 1;
	}
	if (!truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 0;
	}
	H = rt.fv(f, "current", rt.sv(f, "owner"));
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		if (isEqual(rt.gv(f, "real_name", rt.fv(f, "dna", live(H))), rt.sv(f, "target_real_name"))) {
			if ((isEqual(rt.callName(f, live(H), "get_id_name", []), rt.sv(f, "target_real_name")) || truthy(rt.sv(f, "target_missing_id")))) {
				return 1;
			}
		}
	}
	return 0;
});

rt.type(1116, "/datum/objective/survive", "/datum/objective", {
	explanation_text: "Stay alive until the end.",
	dangerrating: 3,
});

// /datum/objective/survive/proc/check_completion  (code/game/gamemodes/objective.dm:429)
rt.def("/datum/objective/survive/proc/check_completion", function check_completion(f: Frame) {
	if (((!truthy(rt.fv(f, "current", rt.sv(f, "owner"))) || isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "owner"))), 2)) || truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/brain")) ? 1 : 0)))) {
		return 0;
	}
	if (!truthy(rt.call(f, P("/proc/is_special_character"), null, [rt.fv(f, "current", rt.sv(f, "owner"))]))) {
		return 0;
	}
	return 1;
});

rt.type(1117, "/datum/objective/martyr", "/datum/objective", {
	explanation_text: "Die a glorious death.",
	dangerrating: 1,
});

// /datum/objective/martyr/proc/check_completion  (code/game/gamemodes/objective.dm:441)
rt.def("/datum/objective/martyr/proc/check_completion", function check_completion(f: Frame) {
	if (!truthy(rt.fv(f, "current", rt.sv(f, "owner")))) {
		return 1;
	}
	if ((truthy(rt.fv(f, "current", rt.sv(f, "owner"))) && isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "owner"))), 2))) {
		return 1;
	}
	return 0;
});

rt.type(1118, "/datum/objective/nuclear", "/datum/objective", {
	explanation_text: "Destroy the station with a nuclear device.",
	martyr_compatible: 1,
});

// /datum/objective/nuclear/proc/check_completion  (code/game/gamemodes/objective.dm:453)
rt.def("/datum/objective/nuclear/proc/check_completion", function check_completion(f: Frame) {
	if (((truthy(rt.gl("SSticker")) && truthy(rt.fv(f, "mode", rt.gl("SSticker")))) && truthy(rt.gv(f, "station_was_nuked", rt.fv(f, "mode", rt.gl("SSticker")))))) {
		return 1;
	}
	return 0;
});

// /datum/controller/global_vars/proc/InitGlobalpossible_items  (code/game/gamemodes/objective.dm:457)
rt.def("/datum/controller/global_vars/proc/InitGlobalpossible_items", function InitGlobalpossible_items(f: Frame) {
	rt.setGl("possible_items", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "possible_items", add);
	return f.dot;
});

rt.type(1119, "/datum/objective/steal", "/datum/objective", {
	targetinfo: null,
	steal_target: null,
	dangerrating: 5,
	martyr_compatible: 0,
});

// /datum/objective/steal/proc/New  (code/game/gamemodes/objective.dm:468)  may sleep
rt.def("/datum/objective/steal/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.len(f, rt.gl("possible_items")))) return f.dot;
	yield* g.call(f, P("/proc/init_subtypes"), null, [T("/datum/objective_item/steal"), rt.gl("possible_items")]);
	return f.dot;
}, true);

// /datum/objective/steal/proc/find_target  (code/game/gamemodes/objective.dm:473)  may sleep
rt.def("/datum/objective/steal/proc/find_target", function* find_target(f: Frame) {
	let approved_targets: Value = null, possible_item: Value = null;
	let $e: any;
	f.vars = () => [approved_targets, possible_item, $e];
	approved_targets = rt.list();
	possible_item = null;
	rt.forList(f, 0, rt.gl("possible_items"), T("/datum/objective_item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		possible_item = $e;
		if ((truthy((yield* g.srcCall(f, "is_unique_objective", rt.fv(f, "targetitem", live(possible_item))))) && !truthy((rt.isIn(f, rt.gv(f, "assigned_role", rt.gv(f, "mind", rt.fv(f, "current", rt.sv(f, "owner")))), rt.fv(f, "excludefromjob", live(possible_item))) ? 1 : 0)))) {
			approved_targets = rt.modify(live(approved_targets), live(possible_item), add);
		}
	}
	rt.endFor(f, 0);
	return (yield* g.srcCall(f, "set_target", (yield* g.call(f, P("/proc/safepick"), null, [live(approved_targets)]))));
}, true);

// /datum/objective/steal/proc/set_target  (code/game/gamemodes/objective.dm:481)  may sleep
rt.def("/datum/objective/steal/proc/set_target", function* set_target(f: Frame, item: Value) {
	f.vars = () => [item];
	if (truthy(live(item))) {
		rt.setSv(f, "targetinfo", live(item));
		rt.setSv(f, "steal_target", rt.fv(f, "targetitem", rt.sv(f, "targetinfo")));
		rt.setSv(f, "explanation_text", fmt("Steal ＀.", [rt.fv(f, "name", rt.sv(f, "targetinfo"))]));
		rt.setSv(f, "dangerrating", rt.fv(f, "difficulty", rt.sv(f, "targetinfo")));
		yield* g.srcCall(f, "give_special_equipment", rt.fv(f, "special_equipment", rt.sv(f, "targetinfo")));
		return rt.sv(f, "steal_target");
	} else {
		rt.setSv(f, "explanation_text", "Free objective");
		return live(f.dot);
	}
	return f.dot;
}, true);

// /datum/objective/steal/proc/select_target  (code/game/gamemodes/objective.dm:493)  may sleep
rt.def("/datum/objective/steal/proc/select_target", function* select_target(f: Frame) {
	let possible_items_all: Value = null, new_target: Value = null, custom_target: Value = null, custom_name: Value = null;
	f.vars = () => [possible_items_all, new_target, custom_target, custom_name];
	possible_items_all = add(rt.gl("possible_items"), "custom");
	if (!truthy((new_target = (yield* g.op(f, "Prompt", [1], [null, rt.sv(f, "steal_target"), "Objective target", "Select target:", live(possible_items_all)]))))) {
		return live(f.dot);
	}
	if (isEqual(live(new_target), "custom")) {
		if (!truthy((custom_target = (yield* g.op(f, "Prompt", [1], [null, null, "Type", "Select type:", (yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item")]))]))))) {
			return live(f.dot);
		}
		custom_name = rt.initial(f, live(custom_target), "name");
		if (!truthy((custom_name = (yield* g.call(f, P("/proc/stripped_input"), null, ["Enter target name:", "Objective target", live(custom_name)]))))) {
			return live(f.dot);
		}
		rt.setSv(f, "steal_target", live(custom_target));
		rt.setSv(f, "explanation_text", fmt("Steal ＀.", [live(custom_name)]));
	} else {
		yield* g.srcCall(f, "set_target", live(new_target));
	}
	return rt.sv(f, "steal_target");
}, true);

// /datum/objective/steal/proc/check_completion  (code/game/gamemodes/objective.dm:511)
rt.def("/datum/objective/steal/proc/check_completion", function check_completion(f: Frame) {
	let all_items: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [all_items, I, $e];
	if (!truthy(rt.sv(f, "steal_target"))) {
		return 1;
	}
	if (!truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living")) ? 1 : 0))) {
		return 0;
	}
	all_items = rt.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "GetAllContents", []);
	I = null;
	rt.forList(f, 0, live(all_items), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.op(f, "IsType", [], [live(I), rt.sv(f, "steal_target")]))) {
			if (!truthy(rt.sv(f, "targetinfo"))) {
				return 1;
			} else {
				if (truthy(rt.callName(f, rt.sv(f, "targetinfo"), "check_special_completion", [live(I)]))) {
					return 1;
				}
			}
		}
		if (truthy((rt.isIn(f, (rt.sv(f, "targetinfo") && rt.fv(f, "type", live(I))), rt.fv(f, "altitems", rt.sv(f, "targetinfo"))) ? 1 : 0))) {
			if (truthy(rt.callName(f, rt.sv(f, "targetinfo"), "check_special_completion", [live(I)]))) {
				return 1;
			}
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /datum/controller/global_vars/proc/InitGlobalpossible_items_special  (code/game/gamemodes/objective.dm:530)
rt.def("/datum/controller/global_vars/proc/InitGlobalpossible_items_special", function InitGlobalpossible_items_special(f: Frame) {
	rt.setGl("possible_items_special", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "possible_items_special", add);
	return f.dot;
});

rt.type(1120, "/datum/objective/steal/special", "/datum/objective/steal", {});

// /datum/objective/steal/special/proc/New  (code/game/gamemodes/objective.dm:534)  may sleep
rt.def("/datum/objective/steal/special/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.len(f, rt.gl("possible_items_special")))) return f.dot;
	yield* g.call(f, P("/proc/init_subtypes"), null, [T("/datum/objective_item/special"), rt.gl("possible_items_special")]);
	yield* g.call(f, P("/proc/init_subtypes"), null, [T("/datum/objective_item/stack"), rt.gl("possible_items_special")]);
	return f.dot;
}, true);

// /datum/objective/steal/special/proc/find_target  (code/game/gamemodes/objective.dm:540)  may sleep
rt.def("/datum/objective/steal/special/proc/find_target", function* find_target(f: Frame) {
	return (yield* g.srcCall(f, "set_target", rt.op(f, "PickUnweighted", [1], [rt.gl("possible_items_special")])));
}, true);

rt.type(1121, "/datum/objective/steal/exchange", "/datum/objective/steal", {
	dangerrating: 10,
	martyr_compatible: 0,
});

// /datum/objective/steal/exchange/proc/set_faction  (code/game/gamemodes/objective.dm:547)
rt.def("/datum/objective/steal/exchange/proc/set_faction", function set_faction(f: Frame, faction: Value, otheragent: Value) {
	rt.setSv(f, "target", live(otheragent));
	if (isEqual(live(faction), "red")) {
		rt.setSv(f, "targetinfo", rt.new_(f, T("/datum/objective_item/unique/docs_blue"), []));
	} else {
		if (isEqual(live(faction), "blue")) {
			rt.setSv(f, "targetinfo", rt.new_(f, T("/datum/objective_item/unique/docs_red"), []));
		}
	}
	rt.setSv(f, "explanation_text", fmt("Acquire ＀ held by ＀, the ＀ and syndicate agent", [rt.fv(f, "name", rt.sv(f, "targetinfo")), rt.gv(f, "real_name", rt.fv(f, "current", rt.sv(f, "target"))), rt.fv(f, "assigned_role", rt.sv(f, "target"))]));
	rt.setSv(f, "steal_target", rt.fv(f, "targetitem", rt.sv(f, "targetinfo")));
	return f.dot;
});

// /datum/objective/steal/exchange/proc/update_explanation_text  (code/game/gamemodes/objective.dm:557)
rt.def("/datum/objective/steal/exchange/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "target")) && truthy(rt.fv(f, "current", rt.sv(f, "target"))))) {
		rt.setSv(f, "explanation_text", fmt("Acquire ＀ held by ＀, the ＀ and syndicate agent", [rt.fv(f, "name", rt.sv(f, "targetinfo")), rt.fv(f, "name", rt.sv(f, "target")), rt.fv(f, "assigned_role", rt.sv(f, "target"))]));
	} else {
		rt.setSv(f, "explanation_text", "Free Objective");
	}
	return f.dot;
});

rt.type(1122, "/datum/objective/steal/exchange/backstab", "/datum/objective/steal/exchange", {
	dangerrating: 3,
});

// /datum/objective/steal/exchange/backstab/proc/set_faction  (code/game/gamemodes/objective.dm:568)
rt.def("/datum/objective/steal/exchange/backstab/proc/set_faction", function set_faction(f: Frame, faction: Value) {
	if (isEqual(live(faction), "red")) {
		rt.setSv(f, "targetinfo", rt.new_(f, T("/datum/objective_item/unique/docs_red"), []));
	} else {
		if (isEqual(live(faction), "blue")) {
			rt.setSv(f, "targetinfo", rt.new_(f, T("/datum/objective_item/unique/docs_blue"), []));
		}
	}
	rt.setSv(f, "explanation_text", fmt("Do not give up or lose ＀.", [rt.fv(f, "name", rt.sv(f, "targetinfo"))]));
	rt.setSv(f, "steal_target", rt.fv(f, "targetitem", rt.sv(f, "targetinfo")));
	return f.dot;
});

rt.type(1123, "/datum/objective/download", "/datum/objective", {
	dangerrating: 10,
});

// /datum/objective/download/proc/gen_amount_goal  (code/game/gamemodes/objective.dm:580)
rt.def("/datum/objective/download/proc/gen_amount_goal", function gen_amount_goal(f: Frame) {
	rt.setSv(f, "target_amount", rt.call(f, P("/proc/rand"), null, [10, 20]));
	rt.setSv(f, "explanation_text", fmt("Download ＀ research level５.", [rt.sv(f, "target_amount")]));
	return rt.sv(f, "target_amount");
});

// /datum/objective/download/proc/check_completion  (code/game/gamemodes/objective.dm:585)
rt.def("/datum/objective/download/proc/check_completion", function check_completion(f: Frame) {
	let H: Value = null, SN: Value = null, current_amount: Value = null, current_data: Value = null;
	let $e: any;
	f.vars = () => [H, SN, current_amount, current_data, $e];
	if (!truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 0;
	}
	if ((!truthy((H = rt.fv(f, "current", rt.sv(f, "owner")))) || isEqual(rt.fv(f, "stat", live(H)), 2))) {
		return 0;
	}
	if (!truthy((rt.istype(rt.fv(f, "wear_suit", live(H)), T("/obj/item/clothing/suit/space/space_ninja")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy(rt.gv(f, "s_initialized", (SN = rt.fv(f, "wear_suit", live(H)))))) {
		return 0;
	}
	current_amount = null;
	if (!truthy(rt.getLen(f, rt.fv(f, "stored_research", live(SN))))) {
		return 0;
	} else {
		current_data = null;
		rt.forList(f, 0, rt.fv(f, "stored_research", live(SN)), T("/datum/tech"));
		while (($e = rt.next(f, 0)) !== undefined) {
			current_data = $e;
			if (truthy(rt.fv(f, "level", live(current_data)))) {
				current_amount = rt.modify(live(current_amount), subtract(rt.fv(f, "level", live(current_data)), 1), add);
			}
		}
		rt.endFor(f, 0);
	}
	if (rt.lt(live(current_amount), rt.sv(f, "target_amount"))) {
		return 0;
	}
	return 1;
});

rt.type(1124, "/datum/objective/capture", "/datum/objective", {
	dangerrating: 10,
});

// /datum/objective/capture/proc/gen_amount_goal  (code/game/gamemodes/objective.dm:616)
rt.def("/datum/objective/capture/proc/gen_amount_goal", function gen_amount_goal(f: Frame) {
	rt.setSv(f, "target_amount", rt.call(f, P("/proc/rand"), null, [5, 10]));
	rt.setSv(f, "explanation_text", fmt("Capture ＀ lifeform５ with an energy net. Live, rare specimens are worth more.", [rt.sv(f, "target_amount")]));
	return rt.sv(f, "target_amount");
});

// /datum/objective/capture/proc/check_completion  (code/game/gamemodes/objective.dm:622)
rt.def("/datum/objective/capture/proc/check_completion", function check_completion(f: Frame) {
	let captured_amount: Value = null, A: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [captured_amount, A, M, $e];
	captured_amount = 0;
	A = rt.locateIn(f, T("/area/centcom/holding"), rt.world());
	M = null;
	rt.forList(f, 0, live(A), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
			captured_amount = rt.modify(live(captured_amount), 0.5, add);
			continue;
		}
		captured_amount = rt.modify(live(captured_amount), 1, add);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(A), T("/mob/living/carbon/monkey"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		captured_amount = rt.modify(live(captured_amount), 0.10000000149011612, add);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(A), T("/mob/living/carbon/alien/larva"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
			captured_amount = rt.modify(live(captured_amount), 0.5, add);
			continue;
		}
		captured_amount = rt.modify(live(captured_amount), 1, add);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(A), T("/mob/living/carbon/alien/humanoid"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/mob/living/carbon/alien/humanoid/royal/queen")) ? 1 : 0))) {
			if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
				captured_amount = rt.modify(live(captured_amount), 1.5, add);
			} else {
				captured_amount = rt.modify(live(captured_amount), 3, add);
			}
			continue;
		}
		if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
			captured_amount = rt.modify(live(captured_amount), 1, add);
			continue;
		}
		captured_amount = rt.modify(live(captured_amount), 2, add);
	}
	rt.endFor(f, 0);
	if (rt.lt(live(captured_amount), rt.sv(f, "target_amount"))) {
		return 0;
	}
	return 1;
});

rt.type(1125, "/datum/objective/absorb", "/datum/objective", {
	dangerrating: 10,
});

// /datum/objective/absorb/proc/gen_amount_goal  (code/game/gamemodes/objective.dm:656)
rt.def("/datum/objective/absorb/proc/gen_amount_goal", function gen_amount_goal(f: Frame, lowbound: Value, highbound: Value) {
	let n_p: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [lowbound, highbound, n_p, _P, $e];
	if (live(lowbound) === null) {
		lowbound = 4;
	}
	if (live(highbound) === null) {
		highbound = 6;
	}
	rt.setSv(f, "target_amount", rt.call(f, P("/proc/rand"), null, [live(lowbound), live(highbound)]));
	if (truthy(rt.gl("SSticker"))) {
		n_p = 1;
		if (isEqual(rt.fv(f, "current_state", rt.gl("SSticker")), 2)) {
			_P = null;
			rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/new_player"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_P = $e;
				if (((truthy(rt.fv(f, "client", live(_P))) && isEqual(rt.fv(f, "ready", live(_P)), 1)) && !isEqual(rt.fv(f, "mind", live(_P)), rt.sv(f, "owner")))) {
					n_p = rt.inc(live(n_p), 1);
				}
			}
			rt.endFor(f, 0);
		} else {
			if (truthy(rt.callName(f, rt.gl("SSticker"), "IsRoundInProgress", []))) {
				_P = null;
				rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
				while (($e = rt.next(f, 0)) !== undefined) {
					_P = $e;
					if (((truthy(rt.fv(f, "client", live(_P))) && !truthy((rt.isIn(f, rt.fv(f, "mind", live(_P)), rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) && !isEqual(rt.fv(f, "mind", live(_P)), rt.sv(f, "owner")))) {
						n_p = rt.inc(live(n_p), 1);
					}
				}
				rt.endFor(f, 0);
			}
		}
		rt.setSv(f, "target_amount", rt.call(f, P("/proc/min"), null, [rt.sv(f, "target_amount"), live(n_p)]));
	}
	rt.setSv(f, "explanation_text", fmt("Extract ＀ compatible genome５.", [rt.sv(f, "target_amount")]));
	return rt.sv(f, "target_amount");
});

// /datum/objective/absorb/proc/check_completion  (code/game/gamemodes/objective.dm:673)
rt.def("/datum/objective/absorb/proc/check_completion", function check_completion(f: Frame) {
	if ((((truthy(rt.sv(f, "owner")) && truthy(rt.fv(f, "changeling", rt.sv(f, "owner")))) && truthy(rt.gv(f, "stored_profiles", rt.fv(f, "changeling", rt.sv(f, "owner"))))) && rt.ge(rt.gv(f, "absorbedcount", rt.fv(f, "changeling", rt.sv(f, "owner"))), rt.sv(f, "target_amount")))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

rt.type(1126, "/datum/objective/destroy", "/datum/objective", {
	dangerrating: 10,
	martyr_compatible: 1,
});

// /datum/objective/destroy/proc/find_target  (code/game/gamemodes/objective.dm:685)
rt.def("/datum/objective/destroy/proc/find_target", function find_target(f: Frame) {
	let possible_targets: Value = null, target_ai: Value = null;
	f.vars = () => [possible_targets, target_ai];
	possible_targets = rt.call(f, P("/proc/active_ais"), null, [1]);
	rt.setSv(f, "target", rt.gv(f, "mind", (target_ai = rt.op(f, "PickUnweighted", [1], [live(possible_targets)]))));
	rt.callSrc(f, "update_explanation_text", []);
	return rt.sv(f, "target");
});

// /datum/objective/destroy/proc/check_completion  (code/game/gamemodes/objective.dm:692)
rt.def("/datum/objective/destroy/proc/check_completion", function check_completion(f: Frame) {
	if ((truthy(rt.sv(f, "target")) && truthy(rt.fv(f, "current", rt.sv(f, "target"))))) {
		if (((isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "target"))), 2) || rt.gt(rt.gv(f, "z", rt.fv(f, "current", rt.sv(f, "target"))), 6)) || !truthy(rt.gv(f, "ckey", rt.fv(f, "current", rt.sv(f, "target")))))) {
			return 1;
		}
		return 0;
	}
	return 1;
});

// /datum/objective/destroy/proc/update_explanation_text  (code/game/gamemodes/objective.dm:699)
rt.def("/datum/objective/destroy/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "target")) && truthy(rt.fv(f, "current", rt.sv(f, "target"))))) {
		rt.setSv(f, "explanation_text", fmt("Destroy ＀, the experimental AI.", [rt.fv(f, "name", rt.sv(f, "target"))]));
	} else {
		rt.setSv(f, "explanation_text", "Free Objective");
	}
	return f.dot;
});

rt.type(1128, "/datum/objective/steal_five_of_type", "/datum/objective", {
	wanted_items: null,
	explanation_text: "Steal at least five items!",
});

// /datum/objective/steal_five_of_type/proc/<init>  (code/game/gamemodes/objective.dm:710)
rt.def("/datum/objective/steal_five_of_type/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "wanted_items", rt.list(T("/obj/item")));
	return f.dot;
});

// /datum/objective/steal_five_of_type/proc/New  (code/game/gamemodes/objective.dm:713)
rt.def("/datum/objective/steal_five_of_type/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "wanted_items", rt.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "wanted_items")]));
	return f.dot;
});

rt.type(1129, "/datum/objective/steal_five_of_type/summon_guns", "/datum/objective/steal_five_of_type", {
	explanation_text: "Steal at least five guns!",
	wanted_items: null,
});

// /datum/objective/steal_five_of_type/summon_guns/proc/<init>  (code/game/gamemodes/objective.dm:718)
rt.def("/datum/objective/steal_five_of_type/summon_guns/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "wanted_items", rt.list(T("/obj/item/weapon/gun")));
	return f.dot;
});

rt.type(1130, "/datum/objective/steal_five_of_type/summon_magic", "/datum/objective/steal_five_of_type", {
	explanation_text: "Steal at least five magical artefacts!",
	wanted_items: null,
});

// /datum/objective/steal_five_of_type/summon_magic/proc/<init>  (code/game/gamemodes/objective.dm:722)
rt.def("/datum/objective/steal_five_of_type/summon_magic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "wanted_items", rt.list(T("/obj/item/weapon/spellbook"), T("/obj/item/weapon/gun/magic"), T("/obj/item/clothing/suit/space/hardsuit/wizard"), T("/obj/item/weapon/scrying"), T("/obj/item/weapon/antag_spawner/contract"), T("/obj/item/device/necromantic_stone")));
	return f.dot;
});

// /datum/objective/steal_five_of_type/proc/check_completion  (code/game/gamemodes/objective.dm:725)
rt.def("/datum/objective/steal_five_of_type/proc/check_completion", function check_completion(f: Frame) {
	let stolen_count: Value = null, all_items: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [stolen_count, all_items, I, $e];
	if (!truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living")) ? 1 : 0))) {
		return 0;
	}
	stolen_count = 0;
	all_items = rt.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "GetAllContents", []);
	I = null;
	rt.forList(f, 0, live(all_items), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(I), rt.sv(f, "wanted_items")]))) {
			stolen_count = rt.inc(live(stolen_count), 1);
		}
	}
	rt.endFor(f, 0);
	if (rt.ge(live(stolen_count), 5)) {
		return 1;
	} else {
		return 0;
	}
	return 0;
});

rt.type(1132, "/datum/objective/changeling_team_objective/impersonate_department", "/datum/objective/changeling_team_objective", {
	command_staff_only: 0,
	department_minds: null,
	department_real_names: null,
	department_string: "",
	explanation_text: "Ensure X derpartment are killed, impersonated, and replaced by Changelings",
});

// /datum/objective/changeling_team_objective/impersonate_department/proc/<init>  (code/game/gamemodes/objective.dm:756)
rt.def("/datum/objective/changeling_team_objective/impersonate_department/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_minds", rt.list());
	$0 = $0;
	rt.setSv(f, "department_real_names", rt.list());
	return f.dot;
});

// /datum/objective/changeling_team_objective/impersonate_department/proc/get_department_staff  (code/game/gamemodes/objective.dm:762)  may sleep
rt.def("/datum/objective/changeling_team_objective/impersonate_department/proc/get_department_staff", function* get_department_staff(f: Frame) {
	let departments: Value = null, department_head: Value = null, ling_count: Value = null, M: Value = null;
	let $0: any, $e: any;
	f.vars = () => [departments, department_head, ling_count, M, $0, $e];
	rt.setSv(f, "department_minds", rt.list());
	rt.setSv(f, "department_real_names", rt.list());
	departments = rt.list("Head of Security", "Research Director", "Chief Engineer", "Chief Medical Officer");
	$0 = (department_head = rt.op(f, "PickUnweighted", [1], [live(departments)]));
	if ($0 === "Head of Security") {
		rt.setSv(f, "department_string", "security");
	} else if ($0 === "Research Director") {
		rt.setSv(f, "department_string", "science");
	} else if ($0 === "Chief Engineer") {
		rt.setSv(f, "department_string", "engineering");
	} else if ($0 === "Chief Medical Officer") {
		rt.setSv(f, "department_string", "medical");
	}
	ling_count = rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")));
	M = null;
	rt.forList(f, 0, rt.fv(f, "minds", rt.gl("SSticker")), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.isIn(f, live(M), rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
			continue;
		}
		if (truthy((rt.isIn(f, live(department_head), (yield* g.call(f, P("/proc/get_department_heads"), null, [rt.fv(f, "assigned_role", live(M))]))) ? 1 : 0))) {
			if (truthy(live(ling_count))) {
				ling_count = rt.inc(live(ling_count), -1);
				rt.modSrcVar(f, "department_minds", live(M), add);
				rt.modSrcVar(f, "department_real_names", rt.gv(f, "real_name", rt.fv(f, "current", live(M))), add);
			} else {
				break;
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, rt.sv(f, "department_minds")))) return f.dot;
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has failed to find department staff, and has removed itself. the round will continue normally", [rt.sv(f, "type")])]);
	(rt.modField(f, rt.sv(f, "owner"), "objectives", live(f.src), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

// /datum/objective/changeling_team_objective/impersonate_department/proc/get_heads  (code/game/gamemodes/objective.dm:798)  may sleep
rt.def("/datum/objective/changeling_team_objective/impersonate_department/proc/get_heads", function* get_heads(f: Frame) {
	let needed_heads: Value = null, heads: Value = null, head: Value = null;
	let $e: any;
	f.vars = () => [needed_heads, heads, head, $e];
	rt.setSv(f, "department_minds", rt.list());
	rt.setSv(f, "department_real_names", rt.list());
	needed_heads = (yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "min_lings"), rt.len(f, rt.gl("command_positions"))]));
	needed_heads = (yield* g.call(f, P("/proc/min"), null, [rt.getLen(f, rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))), live(needed_heads)]));
	heads = (yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "get_living_heads", []));
	head = null;
	rt.forList(f, 0, live(heads), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		head = $e;
		if (truthy((rt.isIn(f, live(head), rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
			continue;
		}
		if (truthy(live(needed_heads))) {
			rt.modSrcVar(f, "department_minds", live(head), add);
			rt.modSrcVar(f, "department_real_names", rt.gv(f, "real_name", rt.fv(f, "current", live(head))), add);
			needed_heads = rt.inc(live(needed_heads), -1);
		} else {
			break;
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, rt.sv(f, "department_minds")))) return f.dot;
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has failed to find department heads, and has removed itself. the round will continue normally", [rt.sv(f, "type")])]);
	(rt.modField(f, rt.sv(f, "owner"), "objectives", live(f.src), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

// /datum/objective/changeling_team_objective/impersonate_department/proc/New  (code/game/gamemodes/objective.dm:827)  may sleep
rt.def("/datum/objective/changeling_team_objective/impersonate_department/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "command_staff_only"))) {
		yield* g.srcCall(f, "get_heads");
	} else {
		yield* g.srcCall(f, "get_department_staff");
	}
	yield* g.srcCall(f, "update_explanation_text");
	return f.dot;
}, true, { args: ["text"] });

// /datum/objective/changeling_team_objective/impersonate_department/proc/update_explanation_text  (code/game/gamemodes/objective.dm:837)
rt.def("/datum/objective/changeling_team_objective/impersonate_department/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let first: Value = null, M: Value = null, string: Value = null;
	let $e: any;
	f.vars = () => [first, M, string, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if ((!truthy(rt.len(f, rt.sv(f, "department_real_names"))) || !truthy(rt.len(f, rt.sv(f, "department_minds"))))) {
		rt.setSv(f, "explanation_text", "Free Objective");
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "command_staff_only"))) {
		rt.setSv(f, "explanation_text", "Ensure changelings impersonate and escape as the following heads of staff: ");
	} else {
		rt.setSv(f, "explanation_text", fmt("Ensure changelings impersonate and escape as the following members of ％！ department: ", [rt.sv(f, "department_string")]));
	}
	first = 1;
	M = null;
	rt.forList(f, 0, rt.sv(f, "department_minds"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		string = fmt("＀ the ＀", [rt.fv(f, "name", live(M)), rt.fv(f, "assigned_role", live(M))]);
		if (!truthy(live(first))) {
			string = fmt(", ＀ the ＀", [rt.fv(f, "name", live(M)), rt.fv(f, "assigned_role", live(M))]);
		} else {
			first = rt.inc(live(first), -1);
		}
		rt.modSrcVar(f, "explanation_text", live(string), add);
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "command_staff_only"))) {
		rt.modSrcVar(f, "explanation_text", ", while the real heads are dead. This is a team objective.", add);
	} else {
		rt.modSrcVar(f, "explanation_text", ", while the real members are dead. This is a team objective.", add);
	}
	return f.dot;
});

// /datum/objective/changeling_team_objective/impersonate_department/proc/check_completion  (code/game/gamemodes/objective.dm:863)
rt.def("/datum/objective/changeling_team_objective/impersonate_department/proc/check_completion", function check_completion(f: Frame) {
	let check_names: Value = null, M: Value = null, mloc: Value = null, success: Value = null, changeling: Value = null, H: Value = null, cloc: Value = null, name: Value = null;
	let $e: any;
	f.vars = () => [check_names, M, mloc, success, changeling, H, cloc, name, $e];
	if ((!truthy(rt.len(f, rt.sv(f, "department_real_names"))) || !truthy(rt.len(f, rt.sv(f, "department_minds"))))) {
		return 1;
	}
	check_names = rt.callName(f, rt.sv(f, "department_real_names"), "Copy", []);
	M = null;
	rt.forList(f, 0, rt.sv(f, "department_minds"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.isIn(f, live(M), rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
			continue;
		}
		if (truthy(rt.fv(f, "current", live(M)))) {
			if ((truthy(rt.callName(f, (mloc = rt.getStep(f, rt.fv(f, "current", live(M)), 0)), "onCentcom", [])) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(M))), 2))) {
				return 0;
			}
		}
	}
	rt.endFor(f, 0);
	success = 0;
	changeling = null;
	rt.forList(f, 0, rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
	loop41: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		changeling = $e;
		if (rt.ge(live(success), rt.len(f, rt.sv(f, "department_minds")))) {
			return 1;
		}
		if (truthy((rt.istype(rt.fv(f, "current", live(changeling)), T("/mob/living/carbon/human")) ? 1 : 0))) {
			H = rt.fv(f, "current", live(changeling));
			if (((truthy((cloc = rt.getStep(f, rt.fv(f, "current", live(changeling)), 0))) && truthy(rt.callName(f, live(cloc), "onCentcom", []))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(changeling))), 2))) {
				name = null;
				rt.forList(f, 1, live(check_names));
				while (($e = rt.next(f, 1)) !== undefined) {
					name = $e;
					if (isEqual(rt.gv(f, "real_name", rt.fv(f, "dna", live(H))), live(name))) {
						(check_names = rt.modify(live(check_names), live(name), subtract));
						success = rt.inc(live(success), 1);
						continue loop41;
					}
				}
				rt.endFor(f, 1);
			}
		}
	}
	rt.endFor(f, 0);
	if (rt.ge(live(success), rt.len(f, rt.sv(f, "department_minds")))) {
		return 1;
	}
	return 0;
});
