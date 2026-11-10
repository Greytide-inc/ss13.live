// Based on /tg/station's code/game/mecha/equipment/mecha_equipment.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(9606, "/obj/item/mecha_parts/mecha_equipment", "/obj/item/mecha_parts", {
	equip_cooldown: 0,
	equip_ready: 1,
	energy_drain: 0,
	chassis: null,
	range: 1,
	salvageable: 1,
	selectable: 1,
	name: "mecha equipment",
	icon: rt.rsc("icons/mecha/mecha_equipment.dmi"),
	icon_state: "mecha_equip",
	force: 5,
	origin_tech: "materials=2;engineering=2",
	obj_integrity: 300,
	max_integrity: 300,
});

// mecha_equipment.dm:22
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/update_chassis_page", function update_chassis_page(f: Frame) {
	if (this.chassis) {
		send_byjax(this.chassis.occupant, "exosuit.browser", "eq_list", this.chassis.get_equipment_list());
		send_byjax(this.chassis.occupant, "exosuit.browser", "equipment_menu", this.chassis.get_equipment_menu(), "dropdowns");
		return 1;
	}
	return f.dot;
});

// mecha_equipment.dm:29
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/update_equip_info", function update_equip_info(f: Frame) {
	if (this.chassis) {
		send_byjax(this.chassis.occupant, "exosuit.browser", fmt("＃", [this]), this.get_equip_info());
		return 1;
	}
	return f.dot;
});

// mecha_equipment.dm:35
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/Destroy", function* Destroy(f: Frame) {
	if (this.chassis) {
		this.chassis.equipment -= this;
		if (this.chassis.selected == this) {
			this.chassis.selected = null;
		}
		this.update_chassis_page();
		this.chassis.occupant_message(`<span class='danger'>The ${this} is destroyed!</span>`);
		this.chassis.log_append_to_last(`${this} is destroyed.`, 1);
		if (rt.istype(this, T("/obj/item/mecha_parts/mecha_equipment/weapon"))) {
			rt.op(f, "OutputReference", [rt.R.field("occupant")], [this.chassis, (yield* sound(rt.rsc("sound/mecha/weapdestr.ogg"), { volume: 50 }))], false);
		} else {
			rt.op(f, "OutputReference", [rt.R.field("occupant")], [this.chassis, (yield* sound(rt.rsc("sound/mecha/critdestr.ogg"), { volume: 50 }))], false);
		}
		this.chassis = null;
	}
	return (yield* parent_proc());
}, true);

// mecha_equipment.dm:50
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/critfail", function critfail(f: Frame) {
	if (!this.chassis) return f.dot;
	this.log_message("Critical failure", 1);
	return f.dot;
});

// mecha_equipment.dm:53
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/get_equip_info", function get_equip_info(f: Frame) {
	if (!this.chassis) {
		return f.dot;
	}
	let txt: Value = `<span style="color:${this.equip_ready ? "#0f0" : "#f00"};">*</span>&nbsp;`;
	if (this.chassis.selected == this) {
		txt += `<b>${this.name}</b>`;
	} else if (this.selectable) {
		txt += fmt("<a href='?src=＃;select_equip=＃'>＀</a>", [this.chassis, this, this.name]);
	} else {
		txt += `${this.name}`;
	}
	return txt;
});

// mecha_equipment.dm:65
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/is_ranged", function is_ranged(f: Frame) {
	return rt.bitAnd(this.range, 2);
});

// mecha_equipment.dm:68
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/is_melee", function is_melee(f: Frame) {
	return rt.bitAnd(this.range, 1);
});

// mecha_equipment.dm:72
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/action_checks", function action_checks(f: Frame, target: Value) {
	if (!target) {
		return 0;
	}
	if (!this.chassis) {
		return 0;
	}
	if (!this.equip_ready) {
		return 0;
	}
	if (this.crit_fail) {
		return 0;
	}
	if (this.energy_drain && !this.chassis.has_charge(this.energy_drain)) {
		return 0;
	}
	return 1;
});

// mecha_equipment.dm:88
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/start_cooldown", function* start_cooldown(f: Frame) {
	this.set_ready_state(0);
	yield* this.chassis.use_power(this.energy_drain);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/mecha_parts/mecha_equipment/proc/set_ready_state"), 1)), this.equip_cooldown);
	return f.dot;
}, true);

// mecha_equipment.dm:93
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/do_after_cooldown", function* do_after_cooldown(f: Frame, target: Value) {
	if (!this.chassis) {
		return f.dot;
	}
	let C: Value = this.chassis.loc;
	this.set_ready_state(0);
	yield* this.chassis.use_power(this.energy_drain);
	f.dot = (yield* do_after(this.chassis.occupant, this.equip_cooldown, { target: target }));
	this.set_ready_state(1);
	if (!(!this.chassis || this.chassis.loc != C || this != this.chassis.selected)) return f.dot;
	return 0;
}, true);

// mecha_equipment.dm:105
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (!(rt.len(f, M.equipment) < M.max_equip)) return f.dot;
	return 1;
});

// mecha_equipment.dm:110
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/attach", function attach(f: Frame, M: Value) {
	M.equipment += this;
	this.chassis = M;
	this.loc = M;
	M.log_message(`${this} initialized.`);
	if (!M.selected && this.selectable) {
		M.selected = this;
	}
	this.update_chassis_page();
	return f.dot;
});

// mecha_equipment.dm:119
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/detach", function* detach(f: Frame, moveto: Value) {
	moveto = (moveto || rt.getStep(f, this.chassis, 0));
	if (yield* this.Move(moveto)) {
		this.chassis.equipment -= this;
		if (this.chassis.selected == this) {
			this.chassis.selected = null;
		}
		this.update_chassis_page();
		this.chassis.log_message(`${this} removed from equipment.`);
		this.chassis = null;
		this.set_ready_state(1);
	}
	return f.dot;
}, true);

// mecha_equipment.dm:132
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (!rt.at(href_list, "detach")) return f.dot;
	// Only the mech's pilot may detach its equipment (the href could name any equipment from anywhere).
	if (this.chassis.occupant != f.usr) return f.dot;
	yield* this.detach();
	return f.dot;
}, true);

// mecha_equipment.dm:136
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/set_ready_state", function set_ready_state(f: Frame, state: Value) {
	this.equip_ready = state;
	if (this.chassis) {
		send_byjax(this.chassis.occupant, "exosuit.browser", fmt("＃", [this]), this.get_equip_info());
	}
	return f.dot;
});

// mecha_equipment.dm:143
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/occupant_message", function occupant_message(f: Frame, message: Value) {
	if (this.chassis) {
		this.chassis.occupant_message(`${bicon(this)} ${message}`);
	}
	return f.dot;
});

// mecha_equipment.dm:148
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/log_message", function log_message(f: Frame, message: Value) {
	if (this.chassis) {
		this.chassis.log_message(`<i>${this}:</i> ${message}`);
	}
	return f.dot;
});
