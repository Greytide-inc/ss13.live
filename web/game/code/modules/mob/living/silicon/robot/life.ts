// Based on /tg/station's code/modules/mob/living/silicon/robot/life.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// life.dm:5
rt.def("/mob/living/silicon/robot/proc/Life", function* Life(f: Frame) {
	if (this.notransform) {
		return f.dot;
	}
	yield* parent_proc();
	yield* this.handle_robot_hud_updates();
	yield* this.handle_robot_cell();
	return f.dot;
}, true, { waitfor: false });

// life.dm:13
rt.def("/mob/living/silicon/robot/proc/handle_robot_cell", function* handle_robot_cell(f: Frame) {
	if (this.stat == 2) return f.dot;
	if (this.low_power_mode) {
		if (this.cell && this.cell.charge) {
			this.low_power_mode = 0;
			yield* this.update_headlamp();
		}
	} else {
		if (this.stat != 0) return f.dot;
		yield* this.use_power();
	}
	return f.dot;
}, true);

// life.dm:22
rt.def("/mob/living/silicon/robot/proc/use_power", function* use_power(f: Frame) {
	let amt: Value = null;
	if (this.cell && this.cell.charge) {
		if (this.cell.charge <= 100) {
			yield* this.uneq_all();
		}
		amt = max(1, min((this.lamp_intensity - 2) * 2, this.cell.charge));
		yield* this.cell.use(amt);
	} else {
		yield* this.uneq_all();
		this.low_power_mode = 1;
		yield* this.update_headlamp();
	}
	this.diag_hud_set_borgcell();
	return f.dot;
}, true);

// life.dm:34
rt.def("/mob/living/silicon/robot/proc/handle_robot_hud_updates", function* handle_robot_hud_updates(f: Frame) {
	let tra: Value = null, I: Value = null;
	if (!this.client) {
		return f.dot;
	}
	yield* this.update_cell_hud_icon();
	if (!this.syndicate) return f.dot;
	if (GLOB.SSticker.mode.name == "traitor") {
		for (tra of each(GLOB.SSticker.mode.traitors, T("/datum/mind"))) {
			if (tra.current) {
				I = (yield* image(rt.rsc("icons/mob/mob.dmi"), { loc: tra.current, icon_state: "traitor" }));
				this.client.images += I;
			}
		}
	}
	if (this.connected_ai) {
		this.connected_ai.connected_robots -= this;
		this.connected_ai = null;
	}
	if (!this.mind) return f.dot;
	if (this.mind.special_role) return f.dot;
	this.mind.special_role = "traitor";
	GLOB.SSticker.mode.traitors += this.mind;
	return f.dot;
}, true);

// life.dm:55
rt.def("/mob/living/silicon/robot/proc/update_health_hud", function update_health_hud(f: Frame) {
	if (!this.client || !this.hud_used) {
		return f.dot;
	}
	if (!this.hud_used.healths) return f.dot;
	if (this.stat != 2) {
		if (this.health >= this.maxHealth) {
			this.hud_used.healths.icon_state = "health0";
		} else if (this.health > this.maxHealth * 0.6) {
			this.hud_used.healths.icon_state = "health2";
		} else if (this.health > this.maxHealth * 0.2) {
			this.hud_used.healths.icon_state = "health3";
		} else if (this.health > -this.maxHealth * 0.2) {
			this.hud_used.healths.icon_state = "health4";
		} else if (this.health > -this.maxHealth * 0.6) {
			this.hud_used.healths.icon_state = "health5";
		} else {
			this.hud_used.healths.icon_state = "health6";
		}
	} else {
		this.hud_used.healths.icon_state = "health7";
	}
	return f.dot;
});

// life.dm:76
rt.def("/mob/living/silicon/robot/proc/update_cell_hud_icon", function* update_cell_hud_icon(f: Frame) {
	let cellcharge: Value = null;
	if (this.cell) {
		const subject = (cellcharge = this.cell.charge / this.cell.maxcharge);
		if (rt.inRange(subject, 0.75, 1e+31)) {
			yield* this.clear_alert("charge");
		} else if (rt.inRange(subject, 0.5, 0.75)) {
			yield* this.throw_alert("charge", T("/obj/screen/alert/lowcell"), 1);
		} else if (rt.inRange(subject, 0.25, 0.5)) {
			yield* this.throw_alert("charge", T("/obj/screen/alert/lowcell"), 2);
		} else if (rt.inRange(subject, 0.01, 0.25)) {
			yield* this.throw_alert("charge", T("/obj/screen/alert/lowcell"), 3);
		} else {
			yield* this.throw_alert("charge", T("/obj/screen/alert/emptycell"));
		}
	} else {
		yield* this.throw_alert("charge", T("/obj/screen/alert/nocell"));
	}
	return f.dot;
}, true);

// life.dm:93
rt.def("/mob/living/silicon/robot/proc/handle_fire", function* handle_fire(f: Frame) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.fire_stacks > 0) {
		this.fire_stacks--;
		this.fire_stacks = max(0, this.fire_stacks);
	} else {
		yield* this.ExtinguishMob();
	}
	return f.dot;
}, true);

// life.dm:105
rt.def("/mob/living/silicon/robot/proc/update_fire", function update_fire(f: Frame) {
	let fire_overlay: Value = mutable_appearance(rt.rsc("icons/mob/onfire.dmi"), "Generic_mob_burning");
	if (this.on_fire) {
		this.add_overlay(fire_overlay);
	} else {
		this.cut_overlay(fire_overlay);
	}
	return f.dot;
});

// life.dm:112
rt.def("/mob/living/silicon/robot/proc/update_canmove", function* update_canmove(f: Frame) {
	if (this.stat || this.buckled || this.lockcharge) {
		this.canmove = 0;
	} else {
		this.canmove = 1;
	}
	yield* this.update_transform();
	yield* this.update_action_buttons_icon();
	return this.canmove;
}, true);
