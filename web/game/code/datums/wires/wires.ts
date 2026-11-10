// Based on /tg/station's code/datums/wires/wires.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// wires.dm:4
rt.def("/proc/is_wire_tool", function is_wire_tool(f: Frame, I: Value) {
	let A: Value = null;
	if (rt.istype(I, T("/obj/item/device/multitool"))) {
		return 1;
	}
	if (rt.istype(I, T("/obj/item/weapon/wirecutters"))) {
		return 1;
	}
	if (rt.istype(I, T("/obj/item/device/assembly"))) {
		if ((A = I).attachable) {
			return 1;
		}
	}
	return f.dot;
});

rt.type(1058, "/datum/wires", "/datum", {
	holder: null,
	holder_type: null,
	proper_name: "Unknown",
	wires: null,
	cut_wires: null,
	colors: null,
	assemblies: null,
	randomize: 0,
});

// wires.dm:22
rt.def("/datum/wires/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.wires = list();

	this.cut_wires = list();

	this.colors = list();

	this.assemblies = list();
	return f.dot;
});

// wires.dm:30
rt.def("/datum/wires/proc/New", function New(f: Frame, holder: Value) {
	parent_proc();
	if (!rt.op(f, "IsType", [], [holder, this.holder_type])) {
		CRASH("Wire holder is not of the expected type!");
		return f.dot;
	}
	this.holder = holder;
	if (this.randomize) {
		this.randomize();
	} else if (!rt.index(GLOB.wire_color_directory, this.holder_type)) {
		this.randomize();
		rt.setAt(GLOB.wire_color_directory, this.holder_type, this.colors);
		rt.setAt(GLOB.wire_name_directory, this.holder_type, this.proper_name);
	} else {
		this.colors = rt.index(GLOB.wire_color_directory, this.holder_type);
	}
	return f.dot;
}, false);

// wires.dm:48
rt.def("/datum/wires/proc/Destroy", function* Destroy(f: Frame) {
	this.holder = null;
	this.assemblies = list();
	return (yield* parent_proc());
}, true);

// wires.dm:53
rt.def("/datum/wires/proc/add_duds", function add_duds(f: Frame, duds: Value) {
	let dud: Value = null;
	while (duds) {
		if (rt.isIn(f, (dud = "__dud" + `${--duds}`), this.wires)) {
			continue;
		}
		this.wires += dud;
	}
	return f.dot;
});

// wires.dm:78
rt.def("/datum/wires/proc/randomize", function randomize(f: Frame) {
	let wire: Value = null;
	let my_possible_colors: Value = GLOB.possible_colors.Copy();
	for (wire of each(shuffle(this.wires))) {
		rt.setAt(this.colors, pick_n_take(my_possible_colors), wire);
	}
	return f.dot;
});

// wires.dm:84
rt.def("/datum/wires/proc/shuffle_wires", function shuffle_wires(f: Frame) {
	this.colors.Cut();
	this.randomize();
	return f.dot;
});

// wires.dm:88
rt.def("/datum/wires/proc/repair", function repair(f: Frame) {
	this.cut_wires.Cut();
	return f.dot;
});

// wires.dm:91
rt.def("/datum/wires/proc/get_wire", function get_wire(f: Frame, color: Value) {
	return rt.index(this.colors, color);
});

// wires.dm:94
rt.def("/datum/wires/proc/get_attached", function get_attached(f: Frame, color: Value) {
	if (rt.index(this.assemblies, color)) {
		return rt.index(this.assemblies, color);
	}
	return null;
});

// wires.dm:99
rt.def("/datum/wires/proc/is_attached", function is_attached(f: Frame, color: Value) {
	if (!rt.index(this.assemblies, color)) return f.dot;
	return 1;
});

// wires.dm:103
rt.def("/datum/wires/proc/is_cut", function is_cut(f: Frame, wire: Value) {
	return (rt.isIn(f, wire, this.cut_wires) ? 1 : 0);
});

// wires.dm:106
rt.def("/datum/wires/proc/is_color_cut", function is_color_cut(f: Frame, color: Value) {
	return this.is_cut(this.get_wire(color));
});

// wires.dm:109
rt.def("/datum/wires/proc/is_all_cut", function is_all_cut(f: Frame) {
	if (rt.len(f, this.cut_wires) != rt.len(f, this.wires)) return f.dot;
	return 1;
});

// wires.dm:113
rt.def("/datum/wires/proc/cut", function* cut(f: Frame, wire: Value) {
	if (this.is_cut(wire)) {
		this.cut_wires -= wire;
		yield* this.on_cut(wire, { mend: 1 });
	} else {
		this.cut_wires += wire;
		yield* this.on_cut(wire, { mend: 0 });
	}
	return f.dot;
}, true);

// wires.dm:121
rt.def("/datum/wires/proc/cut_color", function* cut_color(f: Frame, color: Value) {
	yield* this.cut(this.get_wire(color));
	return f.dot;
}, true);

// wires.dm:124
rt.def("/datum/wires/proc/cut_random", function* cut_random(f: Frame) {
	yield* this.cut(rt.index(this.wires, rand(1, rt.len(f, this.wires))));
	return f.dot;
}, true);

// wires.dm:127
rt.def("/datum/wires/proc/cut_all", function* cut_all(f: Frame) {
	let wire: Value = null;
	for (wire of each(this.wires)) {
		yield* this.cut(wire);
	}
	return f.dot;
}, true);

// wires.dm:131
rt.def("/datum/wires/proc/pulse", function* pulse(f: Frame, wire: Value) {
	if (this.is_cut(wire)) {
		return f.dot;
	}
	yield* this.on_pulse(wire);
	return f.dot;
}, true);

// wires.dm:136
rt.def("/datum/wires/proc/pulse_color", function* pulse_color(f: Frame, color: Value) {
	yield* this.pulse(this.get_wire(color));
	return f.dot;
}, true);

// wires.dm:139
rt.def("/datum/wires/proc/pulse_assembly", function* pulse_assembly(f: Frame, S: Value) {
	let color: Value = null;
	for (color of each(this.assemblies)) {
		if (S == rt.index(this.assemblies, color)) {
			yield* this.pulse_color(color);
			return 1;
		}
	}
	return f.dot;
}, true);

// wires.dm:145
rt.def("/datum/wires/proc/attach_assembly", function attach_assembly(f: Frame, color: Value, S: Value) {
	if (!(S && rt.istype(S, T("/obj/item/device/assembly")) && S.attachable && !this.is_attached(color))) return f.dot;
	rt.setAt(this.assemblies, color, S);
	S.loc = this.holder;
	S.connected = this;
	return S;
});

// wires.dm:152
rt.def("/datum/wires/proc/detach_assembly", function detach_assembly(f: Frame, color: Value) {
	let S: Value = null;
	if (!((S = this.get_attached(color)) && rt.istype(S, T("/obj/item/device/assembly")))) return f.dot;
	this.assemblies -= color;
	S.connected = null;
	S.loc = this.holder.loc;
	return S;
});

// wires.dm:160
rt.def("/datum/wires/proc/emp_pulse", function* emp_pulse(f: Frame) {
	let wire: Value = null;
	let possible_wires: Value = shuffle(this.wires);
	let remaining_pulses: Value = 3;
	for (wire of each(possible_wires)) {
		if (prob(33)) {
			yield* this.pulse(wire);
		}
		remaining_pulses--;
		if (remaining_pulses >= 0) {
			break;
		}
	}
	return f.dot;
}, true);

// wires.dm:175
rt.def("/datum/wires/proc/get_status", function get_status(f: Frame) {
	return list();
});

// wires.dm:185
rt.def("/datum/wires/proc/interact", function* interact(f: Frame, user: Value) {
	let A: Value = null, I: Value = null;
	if (!(yield* this.interactable(user))) {
		return f.dot;
	}
	yield* this.ui_interact(user);
	for (A of each(this.assemblies)) {
		if (rt.istype((I = rt.index(this.assemblies, A)), T("/obj/item")) && (yield* I.on_found(user))) {
			return f.dot;
		}
	}
	return f.dot;
}, true);

// wires.dm:197
rt.def("/datum/wires/proc/ui_status", function* ui_status(f: Frame, user: Value) {
	if (yield* this.interactable(user)) {
		return (yield* parent_proc());
	}
	return UI_CLOSE;
}, true);

// wires.dm:203
rt.def("/datum/wires/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "wires";
	force_open ??= 0;
	state ??= GLOB.physical_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "wires", `${this.holder.name} wires`, 350, 150 + rt.len(f, this.wires) * 30, master_ui, state))).open();
	return f.dot;
}, true);

// wires.dm:209
rt.def("/datum/wires/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let color: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $e: any;
	let data: Value = list();
	let payload: Value = list();
	for (color of each(this.colors)) {
		$0 = payload;
		$1 = "color";
		$2 = color;
		$3 = "wire";
		if (IsAdminGhost(user) || user.is_holding_item_of_type(T("/obj/item/device/multitool/abductor"))) {
			$4 = this.get_wire(color);
		} else {
			$4 = null;
		}
		$0.Add(list(rt.alist(f, [$1, $2, $3, $4, "cut", this.is_color_cut(color), "attached", this.is_attached(color)])));
	}
	rt.setAt(data, "wires", payload);
	rt.setAt(data, "status", this.get_status());
	return data;
});

// wires.dm:223
rt.def("/datum/wires/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let O: Value = null, A: Value = null;
	if ((yield* parent_proc()) || !(yield* this.interactable(f.usr))) {
		return f.dot;
	}
	let target_wire: Value = rt.at(params, "wire");
	let L: Value = f.usr;
	let I: Value = L.get_active_held_item();
	if (action === "cut") {
		if (rt.istype(I, T("/obj/item/weapon/wirecutters")) || IsAdminGhost(f.usr)) {
			playsound(this.holder, I.usesound, 20, 1);
			yield* this.cut_color(target_wire);
			f.dot = 1;
		} else {
			to_chat(L, "<span class='warning'>You need wirecutters!</span>");
		}
	} else if (action === "pulse") {
		if (rt.istype(I, T("/obj/item/device/multitool")) || IsAdminGhost(f.usr)) {
			playsound(this.holder, rt.rsc("sound/weapons/empty.ogg"), 20, 1);
			yield* this.pulse_color(target_wire);
			f.dot = 1;
		} else {
			to_chat(L, "<span class='warning'>You need a multitool!</span>");
		}
	} else if (action === "attach") {
		if (this.is_attached(target_wire)) {
			if (O = this.detach_assembly(target_wire)) {
				yield* L.put_in_hands(O);
				f.dot = 1;
			}
		} else {
			if (!rt.istype(I, T("/obj/item/device/assembly"))) return f.dot;
			if ((A = I).attachable) {
				if (!(yield* L.drop_item())) {
					return f.dot;
				}
				this.attach_assembly(target_wire, A);
				f.dot = 1;
			} else {
				to_chat(L, "<span class='warning'>You need an attachable assembly!</span>");
			}
		}
	}
	return f.dot;
}, true);
