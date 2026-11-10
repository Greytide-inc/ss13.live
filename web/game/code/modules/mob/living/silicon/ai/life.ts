// Based on /tg/station's code/modules/mob/living/silicon/ai/life.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// life.dm:7
rt.def("/mob/living/silicon/ai/proc/Life", function* Life(f: Frame) {
	let home: Value = null;
	if (this.stat == 2) {
		return f.dot;
	} else {
		yield* this.update_gravity(this.mob_has_gravity());
		yield* this.handle_status_effects();
		if (this.malfhack && this.malfhack.aidisabled) {
			yield* deltimer(this.malfhacking);
			yield* this.malfhacked(this.malfhack);
		}
		if (!this.eyeobj || !this.eyeobj || this.eyeobj.gc_destroyed || !this.eyeobj.loc) {
			yield* this.view_core();
		}
		if (this.machine) {
			yield* this.machine.check_eye(this);
		}
		if (this.aiRestorePowerRoutine) {
			yield* this.adjustOxyLoss(1);
		} else if (this.getOxyLoss()) {
			yield* this.adjustOxyLoss(-1);
		}
		if (!this.lacks_power()) {
			if ((home = get_area(this)).powered(1)) {
				yield* home.use_power(1000, 1);
			}
			if (this.aiRestorePowerRoutine >= POWER_RESTORATION_SEARCH_APC) {
				yield* this.ai_restore_power();
				return f.dot;
			}
		} else {
			if (this.aiRestorePowerRoutine) return f.dot;
			yield* this.ai_lose_power();
		}
	}
	return f.dot;
}, true, { waitfor: false });

// life.dm:50
rt.def("/mob/living/silicon/ai/proc/lacks_power", function lacks_power(f: Frame) {
	let ST: Value = null;
	let $e: any;
	let _T: Value = rt.getStep(f, this, 0);
	let A: Value = get_area(this);
	if (this.requires_power === 0) {
		return 0;
	} else if (this.requires_power === 1) {
		return (((!_T ? 1 : 0) || (!A ? 1 : 0)) || (((!A.power_equip ? 1 : 0) || (rt.istype(_T, T("/turf/open/space")) ? 1 : 0)) && (!is_type_in_list(this.loc, list(T("/obj/item"), T("/obj/mecha"))) ? 1 : 0)));
	} else if (this.requires_power === 2) {
		for (ST of each(range(this, 2), T("/obj/effect/clockwork/sigil/transmission"))) {
			return 0;
		}
		return (((!_T ? 1 : 0) || (!A ? 1 : 0)) || (((!rt.istype(_T, T("/turf/open/floor/clockwork")) ? 1 : 0) && ((!A.power_equip ? 1 : 0) || (rt.istype(_T, T("/turf/open/space")) ? 1 : 0))) && (!is_type_in_list(this.loc, list(T("/obj/item"), T("/obj/mecha"))) ? 1 : 0)));
	}
	return f.dot;
});

// life.dm:63
rt.def("/mob/living/silicon/ai/proc/updatehealth", function* updatehealth(f: Frame) {
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	this.health = this.maxHealth - this.getOxyLoss() - this.getToxLoss() - this.getBruteLoss() - this.getFireLoss();
	yield* this.update_stat();
	this.diag_hud_set_health();
	yield* this.disconnect_shell();
	return f.dot;
}, true);

// life.dm:71
rt.def("/mob/living/silicon/ai/proc/update_stat", function* update_stat(f: Frame) {
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	if (this.stat != 2) {
		if (this.health <= -100) {
			yield* this.death();
			return f.dot;
		} else if (this.stat == 1) {
			this.stat = 0;
			yield* this.adjust_blindness(-1);
		}
	}
	this.diag_hud_set_status();
	return f.dot;
}, true);

// life.dm:83
rt.def("/mob/living/silicon/ai/proc/update_sight", function update_sight(f: Frame) {
	this.see_invisible = rt.initial(f, this, "see_invisible");
	this.see_in_dark = rt.initial(f, this, "see_in_dark");
	this.sight = rt.initial(f, this, "sight");
	if (this.aiRestorePowerRoutine) {
		this.sight = rt.bitAnd(this.sight, 16777199);
		this.sight = rt.bitAnd(this.sight, 16777211);
		this.sight = rt.bitAnd(this.sight, 16777207);
		this.see_in_dark = 0;
	}
	if (this.see_override) {
		this.see_invisible = this.see_override;
	}
	this.sync_lighting_plane_alpha();
	return f.dot;
});

// life.dm:98
rt.def("/mob/living/silicon/ai/proc/start_RestorePowerRoutine", function* start_RestorePowerRoutine(f: Frame) {
	let AIarea: Value = null, theAPC: Value = null, A: Value = null, APC: Value = null;
	let $e: any;
	to_chat(this, "Backup battery online. Scanners, camera, and radio interface offline. Beginning fault-detection.");
	yield* sleep(50);
	let _T: Value = rt.getStep(f, this, 0);
	if ((AIarea = get_area(this)) && AIarea.power_equip) {
		if (!rt.istype(_T, T("/turf/open/space"))) {
			yield* this.ai_restore_power();
			return f.dot;
		}
	}
	to_chat(this, "Fault confirmed: missing external power. Shutting down main control system to save power.");
	yield* sleep(20);
	to_chat(this, "Emergency control system online. Verifying connection to power network.");
	yield* sleep(50);
	if (rt.istype((_T = rt.getStep(f, this, 0)), T("/turf/open/space"))) {
		to_chat(this, "Unable to verify! No power connection detected!");
		this.aiRestorePowerRoutine = POWER_RESTORATION_SEARCH_APC;
		return f.dot;
	}
	to_chat(this, "Connection verified. Searching for APC in power network.");
	yield* sleep(50);
	let PRP: Value = 1;
	while (PRP <= 4) {
		_T = rt.getStep(f, this, 0);
		if (AIarea = get_area(this)) {
			A = null;
			for (A of each(AIarea.related, T("/area"))) {
				APC = null;
				for (APC of each(A, T("/obj/machinery/power/apc"))) {
					if (!rt.bitAnd(APC.stat, 1)) {
						theAPC = APC;
						break;
					}
				}
			}
		}
		if (!theAPC) {
			if (PRP === 1) {
				to_chat(this, "Unable to locate APC!");
			} else {
				to_chat(this, "Lost connection with the APC!");
			}
			this.aiRestorePowerRoutine = POWER_RESTORATION_SEARCH_APC;
			return f.dot;
		}
		if (AIarea.power_equip) {
			if (!rt.istype(_T, T("/turf/open/space"))) {
				yield* this.ai_restore_power();
				return f.dot;
			}
		}
		if (PRP === 1) {
			to_chat(this, "APC located. Optimizing route to APC to avoid needless power waste.");
		} else if (PRP === 2) {
			to_chat(this, "Best route identified. Hacking offline APC power port.");
		} else if (PRP === 3) {
			to_chat(this, "Power port upload access confirmed. Loading control program into APC power port software.");
		} else if (PRP === 4) {
			to_chat(this, "Transfer complete. Forcing APC to execute program.");
			yield* sleep(50);
			to_chat(this, "Receiving control information from APC.");
			yield* sleep(2);
			this.apc_override = 1;
			yield* theAPC.ui_interact(this, { state: GLOB.conscious_state });
			this.apc_override = 0;
			this.aiRestorePowerRoutine = POWER_RESTORATION_APC_FOUND;
		}
		yield* sleep(50);
		theAPC = null;
		PRP++;
	}
	return f.dot;
}, true);

// life.dm:159
rt.def("/mob/living/silicon/ai/proc/ai_restore_power", function* ai_restore_power(f: Frame) {
	if (!this.aiRestorePowerRoutine) return f.dot;
	if (this.aiRestorePowerRoutine == POWER_RESTORATION_APC_FOUND) {
		to_chat(this, "Alert cancelled. Power has been restored.");
	} else {
		to_chat(this, "Alert cancelled. Power has been restored without our assistance.");
	}
	this.aiRestorePowerRoutine = POWER_RESTORATION_OFF;
	yield* this.set_blindness(0);
	yield* this.update_sight();
	return f.dot;
}, true);

// life.dm:168
rt.def("/mob/living/silicon/ai/proc/ai_lose_power", function* ai_lose_power(f: Frame) {
	yield* this.disconnect_shell();
	this.aiRestorePowerRoutine = POWER_RESTORATION_START;
	yield* this.blind_eyes(1);
	yield* this.update_sight();
	to_chat(this, "You've lost power!");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/silicon/ai/proc/start_RestorePowerRoutine"))), 20);
	return f.dot;
}, true);
