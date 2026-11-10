// Based on /tg/station's code/_onclick/ai.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// ai.dm:13
rt.def("/mob/living/silicon/ai/proc/DblClickOn", function* DblClickOn(f: Frame, A: Value, params: Value) {
	if (this.client.click_intercept) {
		if (yield* g.callDyn(f, this.client.click_intercept, "InterceptClickOn", [this, params, A])) {
			return f.dot;
		}
	}
	if (this.control_disabled || this.stat) {
		return f.dot;
	}
	if (ismob(A)) {
		this.ai_actual_track(A);
	} else {
		yield* A.move_camera_by_click();
	}
	return f.dot;
}, true);

// ai.dm:26
rt.def("/mob/living/silicon/ai/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	let turf_visible: Value = null, modifiers: Value = null;
	let $0: any, $1: any, $2: any;
	if (rt.worldTime(f) <= this.next_click) {
		return f.dot;
	}
	this.next_click = rt.worldTime(f) + 1;
	if (this.client.click_intercept) {
		if (yield* g.callDyn(f, this.client.click_intercept, "InterceptClickOn", [this, params, A])) {
			return f.dot;
		}
	}
	if (this.control_disabled || this.stat) {
		return f.dot;
	}
	let pixel_turf: Value = get_turf_pixel(A);
	if (pixel_turf) {
		if (!(turf_visible = GLOB.cameranet.checkTurfVis(pixel_turf))) {
			if (rt.istype(this.loc, T("/obj/item/device/aicard")) && rt.isIn(f, pixel_turf, view(this.client.view, this.loc))) {
				turf_visible = 1;
			} else {
				if (pixel_turf.obscured) {
					log_admin(`${key_name_admin(this)} might be running a modified client! (failed checkTurfVis on AI click of ${A}(${`(${pixel_turf.x},${pixel_turf.y},${pixel_turf.z})`})`);
					$0 = key_name_admin(this);
					$1 = A;
					if (pixel_turf) {
						$2 = `${`(${pixel_turf.x},${pixel_turf.y},${pixel_turf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${pixel_turf.x};Y=${pixel_turf.y};Z=${pixel_turf.z}'>JMP</a>)`}`;
					} else {
						$2 = "nonexistent location";
					}
					message_admins(`${$0} might be running a modified client! (failed checkTurfVis on AI click of ${$1}(${`${$2}`}))`);
					$0 = rt.world().timeofday;
					$1 = 864000;
					if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
						$2 = update_midnight_rollover();
					} else {
						$2 = GLOB.midnight_rollovers;
					}
					if ($0 + $1 * $2 >= this.chnotify + 9000) {
						$0 = rt.world().timeofday;
						$1 = 864000;
						if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
							$2 = update_midnight_rollover();
						} else {
							$2 = GLOB.midnight_rollovers;
						}
						this.chnotify = $0 + $1 * $2;
					}
				}
				return f.dot;
			}
		}
	}
	if (rt.index((modifiers = params2list(params)), "shift") && rt.at(modifiers, "ctrl")) {
		yield* this.CtrlShiftClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "middle")) {
		if (this.controlled_mech) {
			yield* this.controlled_mech.click_action(A, this, params);
		}
		return f.dot;
	}
	if (rt.at(modifiers, "shift")) {
		yield* this.ShiftClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "alt")) {
		yield* this.AltClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "ctrl")) {
		yield* this.CtrlClickOn(A);
		return f.dot;
	}
	if (rt.worldTime(f) <= this.next_move) {
		return f.dot;
	}
	if (this.aicamera.in_camera_mode && pixel_turf && turf_visible) {
		this.aicamera.camera_mode_off();
		yield* this.aicamera.captureimage(pixel_turf, f.usr);
		return f.dot;
	}
	if (this.waypoint_mode) {
		this.waypoint_mode = 0;
		yield* this.set_waypoint(A);
		return f.dot;
	}
	yield* A.attack_ai(this);
	return f.dot;
}, true);

// ai.dm:100
rt.def("/mob/living/silicon/ai/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	yield* A.attack_ai(this);
	return f.dot;
}, true);

// ai.dm:102
rt.def("/mob/living/silicon/ai/proc/RangedAttack", function* RangedAttack(f: Frame, A: Value) {
	yield* A.attack_ai(this);
	return f.dot;
}, true);

// ai.dm:114
rt.def("/mob/living/silicon/ai/proc/CtrlShiftClickOn", function* CtrlShiftClickOn(f: Frame, A: Value) {
	yield* A.AICtrlShiftClick(this);
	return f.dot;
}, true);

// ai.dm:116
rt.def("/mob/living/silicon/ai/proc/ShiftClickOn", function* ShiftClickOn(f: Frame, A: Value) {
	yield* A.AIShiftClick(this);
	return f.dot;
}, true);

// ai.dm:118
rt.def("/mob/living/silicon/ai/proc/CtrlClickOn", function* CtrlClickOn(f: Frame, A: Value) {
	yield* A.AICtrlClick(this);
	return f.dot;
}, true);

// ai.dm:120
rt.def("/mob/living/silicon/ai/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	yield* A.AIAltClick(this);
	return f.dot;
}, true);

// ai.dm:132
rt.def("/atom/proc/AIAltClick", function* AIAltClick(f: Frame, user: Value) {
	yield* this.AltClick(user);
	return f.dot;
}, true);

// ai.dm:144
rt.def("/obj/machinery/door/airlock/proc/AICtrlClick", function* AICtrlClick(f: Frame) {
	if (this.emagged) {
		return f.dot;
	}
	if (this.locked) {
		yield* this.Topic("aiEnable=4", rt.alist(f, ["aiEnable", "4"]), 1);
	} else {
		yield* this.Topic("aiDisable=4", rt.alist(f, ["aiDisable", "4"]), 1);
	}
	return f.dot;
}, true);

// ai.dm:151
rt.def("/obj/machinery/door/airlock/proc/AIAltClick", function* AIAltClick(f: Frame) {
	if (this.emagged) {
		return f.dot;
	}
	if (!this.secondsElectrified) {
		yield* this.Topic("aiEnable=6", rt.alist(f, ["aiEnable", "6"]), 1);
	} else {
		yield* this.Topic("aiDisable=5", rt.alist(f, ["aiDisable", "5"]), 1);
	}
	return f.dot;
}, true);

// ai.dm:162
rt.def("/obj/machinery/door/airlock/proc/AIShiftClick", function* AIShiftClick(f: Frame) {
	if (this.emagged) {
		return f.dot;
	}
	if (this.density) {
		yield* this.Topic("aiEnable=7", rt.alist(f, ["aiEnable", "7"]), 1);
	} else {
		yield* this.Topic("aiDisable=7", rt.alist(f, ["aiDisable", "7"]), 1);
	}
	return f.dot;
}, true);

// ai.dm:169
rt.def("/obj/machinery/door/airlock/proc/AICtrlShiftClick", function* AICtrlShiftClick(f: Frame) {
	if (this.emagged) {
		return f.dot;
	}
	if (!this.emergency) {
		yield* this.Topic("aiEnable=11", rt.alist(f, ["aiEnable", "11"]), 1);
	} else {
		yield* this.Topic("aiDisable=11", rt.alist(f, ["aiDisable", "11"]), 1);
	}
	return f.dot;
}, true);

// ai.dm:176
rt.def("/obj/machinery/power/apc/proc/AICtrlClick", function* AICtrlClick(f: Frame) {
	if (!this.can_use(f.usr, 1)) return f.dot;
	yield* this.toggle_breaker();
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true);

// ai.dm:182
rt.def("/obj/machinery/turretid/proc/AIAltClick", function* AIAltClick(f: Frame) {
	this.toggle_lethal();
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true);

// ai.dm:185
rt.def("/obj/machinery/turretid/proc/AICtrlClick", function* AICtrlClick(f: Frame) {
	this.toggle_on();
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true);

// ai.dm:193
rt.def("/mob/living/silicon/ai/proc/TurfAdjacent", function TurfAdjacent(f: Frame, _T: Value) {
	return (GLOB.cameranet && GLOB.cameranet.checkTurfVis(_T));
});
