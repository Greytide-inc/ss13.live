// From code/modules/mob/living/silicon/ai/ai_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/ai/proc/attacked_by  (code/modules/mob/living/silicon/ai/ai_defense.dm:3)  may sleep
rt.def("/mob/living/silicon/ai/proc/attacked_by", function* attacked_by(f: Frame) {
	if (((truthy(rt.fv(f, "force", live(f.args[0]))) && !isEqual(rt.fv(f, "damtype", live(f.args[0])), "stamina")) && !isEqual(rt.sv(f, "stat"), 2))) {
		yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "def_zone"] });

// /mob/living/silicon/ai/proc/attack_alien  (code/modules/mob/living/silicon/ai/ai_defense.dm:9)  may sleep
rt.def("/mob/living/silicon/ai/proc/attack_alien", function* attack_alien(f: Frame) {
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "You cannot attack people before the game has started."]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/silicon/ai/proc/blob_act  (code/modules/mob/living/silicon/ai/ai_defense.dm:18)  may sleep
rt.def("/mob/living/silicon/ai/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "adjustBruteLoss", 60);
		yield* g.srcCall(f, "updatehealth");
		return 1;
	}
	return 0;
}, true);

// /mob/living/silicon/ai/proc/emp_act  (code/modules/mob/living/silicon/ai/ai_defense.dm:25)  may sleep
rt.def("/mob/living/silicon/ai/proc/emp_act", function* emp_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.srcCall(f, "disconnect_shell");
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		$0 = rt.op(f, "PickUnweighted", [2], [1, 2]);
		if ($0 === 1) {
			yield* g.srcCall(f, "view_core");
		} else if ($0 === 2) {
			yield* g.callName(f, rt.gl("SSshuttle"), "requestEvac", [live(f.src), "ALERT: Energy surge detected in AI core! Station integrity may be compromised! Initiati--%m091#ar-BZZT"]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /mob/living/silicon/ai/proc/ex_act  (code/modules/mob/living/silicon/ai/ai_defense.dm:35)  may sleep
rt.def("/mob/living/silicon/ai/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let $0: any;
	f.vars = () => [severity, target, $0];
	$0 = live(severity);
	if ($0 === 1) {
		yield* g.srcCall(f, "gib");
	} else if ($0 === 2) {
		if (!isEqual(rt.sv(f, "stat"), 2)) {
			yield* g.srcCall(f, "adjustBruteLoss", 60);
			yield* g.srcCall(f, "adjustFireLoss", 60);
		}
	} else if ($0 === 3) {
		if (isEqual(rt.sv(f, "stat"), 2)) return f.dot;
		yield* g.srcCall(f, "adjustBruteLoss", 30);
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/silicon/ai/proc/bullet_act  (code/modules/mob/living/silicon/ai/ai_defense.dm:49)  may sleep
rt.def("/mob/living/silicon/ai/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	f.vars = () => [Proj];
	yield* g.callSuper(f, [live(Proj)]);
	yield* g.srcCall(f, "updatehealth");
	return 2;
}, true);
