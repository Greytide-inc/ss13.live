// Based on /tg/station's code/_onclick/observer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// observer.dm:2
rt.def("/mob/dead/observer/proc/DblClickOn", function* DblClickOn(f: Frame, A: Value, params: Value) {
	if (this.client.click_intercept) {
		if (yield* g.callDyn(f, this.client.click_intercept, "InterceptClickOn", [this, params, A])) {
			return f.dot;
		}
	}
	if (this.can_reenter_corpse && this.mind && this.mind.current) {
		if (A == this.mind.current || rt.isIn(f, this.mind.current, A)) {
			yield* this.reenter_corpse();
			return f.dot;
		}
	}
	if (rt.istype(A, T("/atom/movable"))) {
		yield* this.ManualFollow(A);
	} else {
		if (!A.loc) return f.dot;
		this.loc = rt.getStep(f, A, 0);
		yield* this.update_parallax_contents();
	}
	return f.dot;
}, true);

// observer.dm:21
rt.def("/mob/dead/observer/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	let modifiers: Value = null;
	if (this.client.click_intercept) {
		if (yield* g.callDyn(f, this.client.click_intercept, "InterceptClickOn", [this, params, A])) {
			return f.dot;
		}
	}
	if (rt.index((modifiers = params2list(params)), "shift") && rt.at(modifiers, "middle")) {
		yield* this.ShiftMiddleClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "shift") && rt.at(modifiers, "ctrl")) {
		yield* this.CtrlShiftClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "middle")) {
		yield* this.MiddleClickOn(A);
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
	yield* A.attack_ghost(this);
	return f.dot;
}, true);

// observer.dm:53
rt.def("/atom/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	if (!user.client) return f.dot;
	if (IsAdminGhost(user)) {
		yield* this.attack_ai(user);
	}
	if (!user.client.prefs.inquisitive_ghost) return f.dot;
	yield* user.examinate(this);
	return f.dot;
}, true);

// observer.dm:64
rt.def("/obj/machinery/teleport/hub/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let com: Value = null;
	let l: Value = this.loc;
	if (!((com = rt.locateIn(f, T("/obj/machinery/computer/teleporter"), rt.locate(l.x - 2, l.y, l.z))) && com.locked)) return f.dot;
	yield* user.forceMove(rt.getStep(f, com.locked, 0));
	return f.dot;
}, true);

// observer.dm:71
rt.def("/obj/effect/portal/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	if (!this.linked) return f.dot;
	yield* user.forceMove(rt.getStep(f, this.linked, 0));
	return f.dot;
}, true);

// observer.dm:75
rt.def("/obj/machinery/gateway/centerstation/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	if (this.awaygate) {
		yield* user.forceMove(this.awaygate.loc);
	} else {
		to_chat(user, `${this} has no destination.`);
	}
	return f.dot;
}, true);

// observer.dm:81
rt.def("/obj/machinery/gateway/centeraway/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	if (this.stationgate) {
		yield* user.forceMove(this.stationgate.loc);
	} else {
		to_chat(user, `${this} has no destination.`);
	}
	return f.dot;
}, true);

// observer.dm:86
rt.def("/obj/item/weapon/storage/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	yield* this.orient2hud(user);
	yield* this.show_to(user);
	return f.dot;
}, true);

// observer.dm:90
rt.def("/obj/machinery/teleport/hub/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	if (!(this.power_station && this.power_station.engaged && this.power_station.teleporter_console && this.power_station.teleporter_console.target)) return f.dot;
	yield* user.forceMove(rt.getStep(f, this.power_station.teleporter_console.target, 0));
	return f.dot;
}, true);
