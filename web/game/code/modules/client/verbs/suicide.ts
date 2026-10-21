// From code/modules/client/verbs/suicide.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/verb/suicide  (code/modules/client/verbs/suicide.dm:5)  may sleep
rt.def("/mob/living/carbon/human/verb/suicide", function* suicide(f: Frame) {
	let oldkey: Value = null, confirm: Value = null, held_item: Value = null, damagetype: Value = null, damage_mod: Value = null, _T: Value = null, suicide_message: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [oldkey, confirm, held_item, damagetype, damage_mod, _T, suicide_message, $0, $1, $e];
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	oldkey = rt.sv(f, "ckey");
	confirm = (yield* g.call(f, P("/proc/alert"), null, ["Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"]));
	if (!isEqual(rt.sv(f, "ckey"), live(oldkey))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	if (!isEqual(live(confirm), "Yes")) return f.dot;
	rt.setSv(f, "suiciding", 1);
	$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]));
	if (truthy(rt.sv(f, "job"))) {
		$1 = fmt("＀", [rt.sv(f, "job")]);
	} else {
		$1 = "None";
	}
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ (job: ＀) committed suicide at ＀.", [$0, $1, (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))])]);
	if (truthy((held_item = (yield* g.srcCall(f, "get_active_held_item"))))) {
		if (truthy((damagetype = (yield* g.callName(f, live(held_item), "suicide_act", [live(f.src)]))))) {
			if (truthy(rt.bitAnd(live(damagetype), 16))) {
				yield* g.srcCall(f, "adjustStaminaLoss", 200);
				rt.setSv(f, "suiciding", 0);
				return live(f.dot);
			}
			damage_mod = 0;
			_T = null;
			rt.forList(f, 0, rt.list(1, 2, 4, 8));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				if (truthy(rt.bitAnd(live(_T), live(damagetype)))) {
					$0 = 1;
				} else {
					$0 = 0;
				}
				damage_mod = rt.modify(live(damage_mod), $0, add);
			}
			rt.endFor(f, 0);
			damage_mod = (yield* g.call(f, P("/proc/max"), null, [1, live(damage_mod)]));
			if (truthy(rt.bitAnd(live(damagetype), 1))) {
				yield* g.srcCall(f, "adjustBruteLoss", divide(200, live(damage_mod)));
			}
			if (truthy(rt.bitAnd(live(damagetype), 2))) {
				yield* g.srcCall(f, "adjustFireLoss", divide(200, live(damage_mod)));
			}
			if (truthy(rt.bitAnd(live(damagetype), 4))) {
				yield* g.srcCall(f, "adjustToxLoss", divide(200, live(damage_mod)));
			}
			if (truthy(rt.bitAnd(live(damagetype), 8))) {
				yield* g.srcCall(f, "adjustOxyLoss", divide(200, live(damage_mod)));
			}
			if (!truthy(rt.bitAnd(live(damagetype), 15))) {
				yield* g.srcCall(f, "adjustOxyLoss", (yield* g.call(f, P("/proc/max"), null, [subtract(subtract(subtract(subtract(200, (yield* g.srcCall(f, "getToxLoss"))), (yield* g.srcCall(f, "getFireLoss"))), (yield* g.srcCall(f, "getBruteLoss"))), (yield* g.srcCall(f, "getOxyLoss"))), 0])));
			}
			yield* g.srcCall(f, "death", 0);
			return live(f.dot);
		}
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀</span>", [(suicide_message = rt.op(f, "PickUnweighted", [4], [fmt("＀ is attempting to bite ＀ tongue off! It looks like ＀ trying to commit suicide.", [live(f.src), (yield* g.srcCall(f, "p_their")), (yield* g.srcCall(f, "p_theyre"))]), fmt("＀ is jamming ＀ thumbs into ＀ eye sockets! It looks like ＀ trying to commit suicide.", [live(f.src), (yield* g.srcCall(f, "p_their")), (yield* g.srcCall(f, "p_their")), (yield* g.srcCall(f, "p_theyre"))]), fmt("＀ is twisting ＀ own neck! It looks like ＀ trying to commit suicide.", [live(f.src), (yield* g.srcCall(f, "p_their")), (yield* g.srcCall(f, "p_theyre"))]), fmt("＀ is holding ＀ breath! It looks like ＀ trying to commit suicide.", [live(f.src), (yield* g.srcCall(f, "p_their")), (yield* g.srcCall(f, "p_theyre"))])]))]), fmt("<span class='userdanger'>＀</span>", [live(suicide_message)]));
	yield* g.srcCall(f, "adjustOxyLoss", (yield* g.call(f, P("/proc/max"), null, [subtract(subtract(subtract(subtract(200, (yield* g.srcCall(f, "getToxLoss"))), (yield* g.srcCall(f, "getFireLoss"))), (yield* g.srcCall(f, "getBruteLoss"))), (yield* g.srcCall(f, "getOxyLoss"))), 0])));
	yield* g.srcCall(f, "death", 0);
	return f.dot;
}, true, { hidden: true });

// /mob/living/brain/verb/suicide  (code/modules/client/verbs/suicide.dm:61)  may sleep
rt.def("/mob/living/brain/verb/suicide", function* suicide(f: Frame) {
	let confirm: Value = null;
	f.vars = () => [confirm];
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	confirm = (yield* g.call(f, P("/proc/alert"), null, ["Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"]));
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	if (!isEqual(live(confirm), "Yes")) return f.dot;
	rt.setSv(f, "suiciding", 1);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀'s brain is growing dull and lifeless. ＀ look＀ like ＀ lost the will to live.</span>", [live(f.src), (yield* g.srcCall(f, "p_they", 1)), (yield* g.srcCall(f, "p_s")), (yield* g.srcCall(f, "p_theyve"))]), fmt("<span class='userdanger'>＀'s brain is growing dull and lifeless. ＀ look＀ like ＀ lost the will to live.</span>", [live(f.src), (yield* g.srcCall(f, "p_they", 1)), (yield* g.srcCall(f, "p_s")), (yield* g.srcCall(f, "p_theyve"))]));
	yield* g.srcCall(f, "death", 0);
	return f.dot;
}, true, { hidden: true });

// /mob/living/carbon/monkey/verb/suicide  (code/modules/client/verbs/suicide.dm:74)  may sleep
rt.def("/mob/living/carbon/monkey/verb/suicide", function* suicide(f: Frame) {
	let confirm: Value = null;
	f.vars = () => [confirm];
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	confirm = (yield* g.call(f, P("/proc/alert"), null, ["Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"]));
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	if (!isEqual(live(confirm), "Yes")) return f.dot;
	rt.setSv(f, "suiciding", 1);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ is attempting to bite ＀ tongue. It looks like ＀ trying to commit suicide.</span>", [live(f.src), (yield* g.srcCall(f, "p_their")), (yield* g.srcCall(f, "p_theyre"))]), fmt("<span class='userdanger'>＀ is attempting to bite ＀ tongue. It looks like ＀ trying to commit suicide.</span>", [live(f.src), (yield* g.srcCall(f, "p_their")), (yield* g.srcCall(f, "p_theyre"))]));
	yield* g.srcCall(f, "adjustOxyLoss", (yield* g.call(f, P("/proc/max"), null, [subtract(subtract(subtract(subtract(200, (yield* g.srcCall(f, "getToxLoss"))), (yield* g.srcCall(f, "getFireLoss"))), (yield* g.srcCall(f, "getBruteLoss"))), (yield* g.srcCall(f, "getOxyLoss"))), 0])));
	yield* g.srcCall(f, "death", 0);
	return f.dot;
}, true, { hidden: true });

// /mob/living/silicon/ai/verb/suicide  (code/modules/client/verbs/suicide.dm:88)  may sleep
rt.def("/mob/living/silicon/ai/verb/suicide", function* suicide(f: Frame) {
	let confirm: Value = null;
	f.vars = () => [confirm];
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	confirm = (yield* g.call(f, P("/proc/alert"), null, ["Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"]));
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	if (!isEqual(live(confirm), "Yes")) return f.dot;
	rt.setSv(f, "suiciding", 1);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ is powering down. It looks like ＀ trying to commit suicide.</span>", [live(f.src), (yield* g.srcCall(f, "p_theyre"))]), fmt("<span class='userdanger'>＀ is powering down. It looks like ＀ trying to commit suicide.</span>", [live(f.src), (yield* g.srcCall(f, "p_theyre"))]));
	yield* g.srcCall(f, "adjustOxyLoss", (yield* g.call(f, P("/proc/max"), null, [subtract(subtract(subtract(subtract(multiply(rt.sv(f, "maxHealth"), 2), (yield* g.srcCall(f, "getToxLoss"))), (yield* g.srcCall(f, "getFireLoss"))), (yield* g.srcCall(f, "getBruteLoss"))), (yield* g.srcCall(f, "getOxyLoss"))), 0])));
	yield* g.srcCall(f, "death", 0);
	return f.dot;
}, true, { hidden: true });

// /mob/living/silicon/robot/verb/suicide  (code/modules/client/verbs/suicide.dm:103)  may sleep
rt.def("/mob/living/silicon/robot/verb/suicide", function* suicide(f: Frame) {
	let confirm: Value = null;
	f.vars = () => [confirm];
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	confirm = (yield* g.call(f, P("/proc/alert"), null, ["Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"]));
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	if (!isEqual(live(confirm), "Yes")) return f.dot;
	rt.setSv(f, "suiciding", 1);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ is powering down. It looks like ＀ trying to commit suicide.</span>", [live(f.src), (yield* g.srcCall(f, "p_theyre"))]), fmt("<span class='userdanger'>＀ is powering down. It looks like ＀ trying to commit suicide.</span>", [live(f.src), (yield* g.srcCall(f, "p_theyre"))]));
	yield* g.srcCall(f, "adjustOxyLoss", (yield* g.call(f, P("/proc/max"), null, [subtract(subtract(subtract(subtract(multiply(rt.sv(f, "maxHealth"), 2), (yield* g.srcCall(f, "getToxLoss"))), (yield* g.srcCall(f, "getFireLoss"))), (yield* g.srcCall(f, "getBruteLoss"))), (yield* g.srcCall(f, "getOxyLoss"))), 0])));
	yield* g.srcCall(f, "death", 0);
	return f.dot;
}, true, { hidden: true });

// /mob/living/silicon/pai/verb/suicide  (code/modules/client/verbs/suicide.dm:120)  may sleep
rt.def("/mob/living/silicon/pai/verb/suicide", function* suicide(f: Frame) {
	let answer: Value = null, _T: Value = null;
	f.vars = () => [answer, _T];
	if (isEqual((answer = (yield* g.op(f, "Prompt", [0], [null, "No", "Suicide", "REALLY kill yourself? This action can't be undone.", rt.list("Yes", "No")]))), "Yes")) {
		yield* g.callName(f, (_T = rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0)), "visible_message", [fmt("<span class='notice'>＀ flashes a message across its screen, \"Wiping core files. Please acquire a new personality to continue using pAI device functions.\"</span>", [live(f.src)]), null, fmt("<span class='notice'>＀ bleeps electronically.</span>", [live(f.src)])]);
		yield* g.srcCall(f, "death", 0);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Aborting suicide attempt."]);
	}
	return f.dot;
}, true, { verb: { name: "pAI Suicide", category: "pAI Commands", desc: "Kill yourself and become a ghost (You will receive a confirmation prompt)" } });

// /mob/living/carbon/alien/humanoid/verb/suicide  (code/modules/client/verbs/suicide.dm:131)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/verb/suicide", function* suicide(f: Frame) {
	let confirm: Value = null;
	f.vars = () => [confirm];
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	confirm = (yield* g.call(f, P("/proc/alert"), null, ["Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"]));
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	if (!isEqual(live(confirm), "Yes")) return f.dot;
	rt.setSv(f, "suiciding", 1);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ is thrashing wildly! It looks like ＀ trying to commit suicide.</span>", [live(f.src), (yield* g.srcCall(f, "p_theyre"))]), fmt("<span class='userdanger'>＀ is thrashing wildly! It looks like ＀ trying to commit suicide.</span>", [live(f.src), (yield* g.srcCall(f, "p_theyre"))]), "<span class='italics'>You hear thrashing.</span>");
	yield* g.srcCall(f, "adjustOxyLoss", (yield* g.call(f, P("/proc/max"), null, [subtract(subtract(subtract(200, (yield* g.srcCall(f, "getFireLoss"))), (yield* g.srcCall(f, "getBruteLoss"))), (yield* g.srcCall(f, "getOxyLoss"))), 0])));
	yield* g.srcCall(f, "death", 0);
	return f.dot;
}, true, { hidden: true });

// /mob/living/simple_animal/verb/suicide  (code/modules/client/verbs/suicide.dm:147)  may sleep
rt.def("/mob/living/simple_animal/verb/suicide", function* suicide(f: Frame) {
	let confirm: Value = null;
	f.vars = () => [confirm];
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	confirm = (yield* g.call(f, P("/proc/alert"), null, ["Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"]));
	if (!truthy((yield* g.srcCall(f, "canSuicide")))) {
		return live(f.dot);
	}
	if (!isEqual(live(confirm), "Yes")) return f.dot;
	rt.setSv(f, "suiciding", 1);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ begins to fall down. It looks like ＀ lost the will to live.</span>", [live(f.src), (yield* g.srcCall(f, "p_theyve"))]), fmt("<span class='userdanger'>＀ begins to fall down. It looks like ＀ lost the will to live.</span>", [live(f.src), (yield* g.srcCall(f, "p_theyve"))]));
	yield* g.srcCall(f, "death", 0);
	return f.dot;
}, true, { hidden: true });

// /mob/living/proc/canSuicide  (code/modules/client/verbs/suicide.dm:160)
rt.def("/mob/living/proc/canSuicide", function canSuicide(f: Frame) {
	if (isEqual(rt.sv(f, "stat"), 0)) {
		return 1;
	} else {
		if (isEqual(rt.sv(f, "stat"), 2)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "You're already dead!"]);
		} else {
			if (isEqual(rt.sv(f, "stat"), 1)) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.src), "You need to be conscious to suicide!"]);
			}
		}
	}
	return live(f.dot);
});

// /mob/living/carbon/proc/canSuicide  (code/modules/client/verbs/suicide.dm:169)
rt.def("/mob/living/carbon/proc/canSuicide", function canSuicide(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "canmove")) || truthy(rt.callSrc(f, "restrained", [])))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "You can't commit suicide whilst restrained! ((You can type Ghost instead however.))"]);
		return live(f.dot);
	}
	return 1;
});
