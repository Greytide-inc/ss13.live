// Based on /tg/station's code/modules/mob/living/silicon/robot/inventory.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// inventory.dm:12
rt.def("/mob/living/silicon/robot/proc/uneq_module", function* uneq_module(f: Frame, O: Value) {
	let S: Value = null, _T: Value = null;
	if (!O) {
		return 0;
	}
	O.mouse_opacity = 2;
	if (rt.istype(O, T("/obj/item/borg/sight"))) {
		(rt.modSrcVar(f, "sight_mode", rt.op(f, "BitNot", [], [(S = O).sight_mode]), rt.bitAnd));
		yield* this.update_sight();
	} else if (rt.istype(O, T("/obj/item/weapon/storage/bag/tray"))) {
		yield* (_T = O).do_quick_empty();
	}
	if (this.client) {
		this.client.screen -= O;
	}
	this.observer_screen_update(O, 0);
	yield* O.forceMove(this.module);
	if (rt.bitAnd(DROPDEL, O.flags)) {
		(rt.modField(f, O, "flags", 16760831, rt.bitAnd));
	}
	yield* O.dropped(this);
	if (this.module_active == O) {
		this.module_active = null;
	}
	if (rt.index(this.held_items, 1) == O) {
		this.inv1.icon_state = "inv1";
		rt.setAt(this.held_items, 1, null);
	} else if (rt.index(this.held_items, 2) == O) {
		this.inv2.icon_state = "inv2";
		rt.setAt(this.held_items, 2, null);
	} else if (rt.index(this.held_items, 3) == O) {
		this.inv3.icon_state = "inv3";
		rt.setAt(this.held_items, 3, null);
	}
	this.hud_used.update_robot_modules_display();
	return 1;
}, true);

// inventory.dm:48
rt.def("/mob/living/silicon/robot/proc/activate_module", function* activate_module(f: Frame, O: Value) {
	let S: Value = null;
	f.dot = 0;
	if (!rt.isIn(f, O, this.module.modules)) {
		return f.dot;
	}
	if (this.activated(O)) {
		to_chat(this, "<span class='warning'>That module is already activated.</span>");
		return f.dot;
	}
	if (!rt.index(this.held_items, 1)) {
		rt.setAt(this.held_items, 1, O);
		O.screen_loc = this.inv1.screen_loc;
		f.dot = 1;
	} else if (!rt.index(this.held_items, 2)) {
		rt.setAt(this.held_items, 2, O);
		O.screen_loc = this.inv2.screen_loc;
		f.dot = 1;
	} else if (!rt.index(this.held_items, 3)) {
		rt.setAt(this.held_items, 3, O);
		O.screen_loc = this.inv3.screen_loc;
		f.dot = 1;
	} else {
		to_chat(this, "<span class='warning'>You need to disable a module first!</span>");
	}
	if (!f.dot) return f.dot;
	yield* O.equipped(this, slot_hands);
	O.mouse_opacity = rt.initial(f, O, "mouse_opacity");
	O.layer = ABOVE_HUD_LAYER;
	O.plane = ABOVE_HUD_PLANE;
	this.observer_screen_update(O, 1);
	yield* O.forceMove(this);
	if (!rt.istype(O, T("/obj/item/borg/sight"))) return f.dot;
	(rt.modSrcVar(f, "sight_mode", (S = O).sight_mode, rt.bitOr));
	yield* this.update_sight();
	return f.dot;
}, true);

// inventory.dm:81
rt.def("/mob/living/silicon/robot/proc/observer_screen_update", function observer_screen_update(f: Frame, I: Value, _add: Value) {
	let M: Value = null, observe: Value = null;
	_add ??= 1;
	if (!(this.observers && rt.len(f, this.observers))) return f.dot;
	for (M of each(this.observers)) {
		if ((observe = M).client && observe.client.eye == this) {
			if (_add) {
				observe.client.screen += I;
			} else {
				observe.client.screen -= I;
			}
		} else {
			this.observers -= observe;
			if (!rt.len(f, this.observers)) {
				this.observers = null;
				break;
			}
		}
	}
	return f.dot;
});

// inventory.dm:96
rt.def("/mob/living/silicon/robot/proc/uneq_active", function* uneq_active(f: Frame) {
	yield* this.uneq_module(this.module_active);
	return f.dot;
}, true);

// inventory.dm:99
rt.def("/mob/living/silicon/robot/proc/uneq_all", function* uneq_all(f: Frame) {
	let I: Value = null;
	for (I of each(this.held_items, T("/obj/item"))) {
		yield* this.uneq_module(I);
	}
	return f.dot;
}, true);

// inventory.dm:103
rt.def("/mob/living/silicon/robot/proc/activated", function activated(f: Frame, O: Value) {
	if (rt.isIn(f, O, this.held_items)) {
		return 1;
	}
	return 0;
});

// inventory.dm:112
rt.def("/mob/living/silicon/robot/proc/module_selected", function module_selected(f: Frame, module: Value) {
	return (module == this.get_selected_module() ? 1 : 0);
});

// inventory.dm:116
rt.def("/mob/living/silicon/robot/proc/module_active", function module_active(f: Frame, module: Value) {
	if (module < 1 || module > 3) {
		return 0;
	}
	if (rt.length(this.held_items) >= module) {
		if (rt.index(this.held_items, module)) {
			return 1;
		}
	}
	return 0;
});

// inventory.dm:127
rt.def("/mob/living/silicon/robot/proc/get_selected_module", function get_selected_module(f: Frame) {
	if (this.module_active) {
		return this.held_items.Find(this.module_active);
	}
	return 0;
});

// inventory.dm:133
rt.def("/mob/living/silicon/robot/proc/select_module", function select_module(f: Frame, module: Value) {
	if (module < 1 || module > 3) {
		return f.dot;
	}
	if (!this.module_active(module)) {
		return f.dot;
	}
	if (module === 1) {
		if (this.module_active != rt.index(this.held_items, module)) {
			this.inv1.icon_state = "inv1 +a";
			this.inv2.icon_state = "inv2";
			this.inv3.icon_state = "inv3";
		}
	} else if (module === 2) {
		if (this.module_active != rt.index(this.held_items, module)) {
			this.inv1.icon_state = "inv1";
			this.inv2.icon_state = "inv2 +a";
			this.inv3.icon_state = "inv3";
		}
	} else if (module === 3) {
		if (this.module_active != rt.index(this.held_items, module)) {
			this.inv1.icon_state = "inv1";
			this.inv2.icon_state = "inv2";
			this.inv3.icon_state = "inv3 +a";
		}
	}
	this.module_active = rt.index(this.held_items, module);
	return f.dot;
});

// inventory.dm:159
rt.def("/mob/living/silicon/robot/proc/deselect_module", function deselect_module(f: Frame, module: Value) {
	if (module < 1 || module > 3) {
		return f.dot;
	}
	if (!this.module_active(module)) {
		return f.dot;
	}
	if (module === 1) {
		if (this.module_active == rt.index(this.held_items, module)) {
			this.inv1.icon_state = "inv1";
		}
	} else if (module === 2) {
		if (this.module_active == rt.index(this.held_items, module)) {
			this.inv2.icon_state = "inv2";
		}
	} else if (module === 3) {
		if (this.module_active == rt.index(this.held_items, module)) {
			this.inv3.icon_state = "inv3";
		}
	}
	this.module_active = null;
	return f.dot;
});

// inventory.dm:179
rt.def("/mob/living/silicon/robot/proc/toggle_module", function toggle_module(f: Frame, module: Value) {
	if (module < 1 || module > 3) {
		return f.dot;
	}
	if (this.module_selected(module)) {
		this.deselect_module(module);
	} else if (this.module_active(module)) {
		this.select_module(module);
	} else {
		this.deselect_module(this.get_selected_module());
	}
	return f.dot;
});

// inventory.dm:192
rt.def("/mob/living/silicon/robot/proc/cycle_modules", function cycle_modules(f: Frame) {
	let slot_start: Value = null, slot_num: Value = null;
	if (slot_start = this.get_selected_module()) {
		this.deselect_module(slot_start);
	}
	if (slot_start == 0) {
		slot_num = 1;
		slot_start = 4;
	} else {
		slot_num = slot_start + 1;
	}
	while (slot_num != slot_start) {
		if (this.module_active(slot_num)) {
			this.select_module(slot_num);
			return f.dot;
		}
		slot_num++;
		if (slot_num > 4) {
			slot_num = 1;
		}
	}
	return f.dot;
});

// inventory.dm:214
rt.def("/mob/living/silicon/robot/proc/swap_hand", function swap_hand(f: Frame) {
	this.cycle_modules();
	return f.dot;
});
