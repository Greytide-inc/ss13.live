// Based on /tg/station's code/modules/mob/living/silicon/ai/ai_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// ai_defense.dm:3
rt.def("/mob/living/silicon/ai/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value, def_zone: Value) {
	if (I.force && I.damtype != "stamina" && this.stat != 2) {
		yield* this.spark_system.start();
	}
	return (yield* parent_proc());
}, true);

// ai_defense.dm:9
rt.def("/mob/living/silicon/ai/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	if (!GLOB.SSticker.HasRoundStarted()) {
		to_chat(M, "You cannot attack people before the game has started.");
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// ai_defense.dm:18
rt.def("/mob/living/silicon/ai/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (this.stat != 2) {
		yield* this.adjustBruteLoss(60);
		yield* this.updatehealth();
		return 1;
	}
	return 0;
}, true);

// ai_defense.dm:25
rt.def("/mob/living/silicon/ai/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.disconnect_shell();
	if (prob(30)) {
		const chosen = pick(1, 2);
		if (chosen === 1) {
			yield* this.view_core();
		} else if (chosen === 2) {
			yield* GLOB.SSshuttle.requestEvac(this, "ALERT: Energy surge detected in AI core! Station integrity may be compromised! Initiati--%m091#ar-BZZT");
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// ai_defense.dm:35
rt.def("/mob/living/silicon/ai/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (severity === 1) {
		yield* this.gib();
	} else if (severity === 2) {
		if (this.stat != 2) {
			yield* this.adjustBruteLoss(60);
			yield* this.adjustFireLoss(60);
		}
	} else if (severity === 3) {
		if (this.stat == 2) return f.dot;
		yield* this.adjustBruteLoss(30);
	}
	return f.dot;
}, true, { waitfor: false });

// ai_defense.dm:49
rt.def("/mob/living/silicon/ai/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	yield* parent_proc(Proj);
	yield* this.updatehealth();
	return 2;
}, true);
