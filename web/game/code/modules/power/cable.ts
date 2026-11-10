// Based on /tg/station's code/modules/power/cable.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(12532, "/obj/structure/cable", "/obj/structure", {
	powernet: null,
	d1: 0,
	d2: 1,
	cable_color: "red",
	stored: null,
	level: 1,
	anchored: 1,
	on_blueprints: 1,
	name: "power cable",
	desc: "A flexible, superconducting insulated cable for heavy-duty power transfer.",
	icon: rt.rsc("icons/obj/power_cond/power_cond_red.dmi"),
	icon_state: "0-1",
	layer: 2.4,
});

// cable.dm:70
rt.def("/obj/structure/cable/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let dash: Value = findtext(this.icon_state, "-");
	this.d1 = text2num(copytext(this.icon_state, 1, dash));
	this.d2 = text2num(copytext(this.icon_state, dash + 1));
	let _T: Value = this.loc;
	if (this.level == 1) {
		yield* this.hide(_T.intact);
	}
	GLOB.cable_list += this;
	if (this.d1) {
		this.stored = (yield* new_(T("/obj/item/stack/cable_coil"), null, 2, this.cable_color));
	} else {
		this.stored = (yield* new_(T("/obj/item/stack/cable_coil"), null, 1, this.cable_color));
	}
	return f.dot;
}, true);

// cable.dm:91
rt.def("/obj/structure/cable/proc/Destroy", function* Destroy(f: Frame) {
	if (this.powernet) {
		yield* this.cut_cable_from_powernet();
	}
	GLOB.cable_list -= this;
	return (yield* parent_proc());
}, true);

// cable.dm:96
rt.def("/obj/structure/cable/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let _T: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		_T = this.loc;
		yield* this.stored.forceMove(_T);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// cable.dm:108
rt.def("/obj/structure/cable/proc/hide", function hide(f: Frame, i: Value) {
	if (this.level == 1 && isturf(this.loc)) {
		this.invisibility = i ? INVISIBILITY_MAXIMUM : 0;
	}
	this.update_icon();
	return f.dot;
});

// cable.dm:114
rt.def("/obj/structure/cable/proc/update_icon", function update_icon(f: Frame) {
	if (this.invisibility) {
		this.icon_state = `${this.d1}-${this.d2}-f`;
	} else {
		this.icon_state = `${this.d1}-${this.d2}`;
	}
	return f.dot;
});

// cable.dm:126
rt.def("/obj/structure/cable/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null, coil: Value = null;
	if ((_T = this.loc).intact) {
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
		if (yield* this.shock(user, 50)) {
			return f.dot;
		}
		user.visible_message(`${user} cuts the cable.`, "<span class='notice'>You cut the cable.</span>");
		yield* this.stored.add_fingerprint(user);
		this.investigate_log(`was cut by ${key_name(f.usr, f.usr.client)} in ${get_area(_T)}`, "wires");
		yield* this.deconstruct();
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/stack/cable_coil"))) {
		if ((coil = W).get_amount() < 1) {
			to_chat(user, "<span class='warning'>Not enough cable!</span>");
			return f.dot;
		}
		yield* coil.cable_join(this, user);
	} else if (rt.istype(W, T("/obj/item/device/multitool"))) {
		if (this.powernet && this.powernet.avail > 0) {
			to_chat(user, `<span class='danger'>${this.powernet.avail}W in power network.</span>`);
		} else {
			to_chat(user, "<span class='danger'>The cable is not powered.</span>");
		}
		yield* this.shock(user, 5, 0.2);
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// cable.dm:155
rt.def("/obj/structure/cable/proc/shock", function* shock(f: Frame, user: Value, prb: Value, siemens_coeff: Value) {
	siemens_coeff ??= 1;
	if (!prob(prb)) {
		return 0;
	}
	if (yield* electrocute_mob(user, this.powernet, this, siemens_coeff)) {
		yield* do_sparks(5, 1, this);
		return 1;
	} else {
		return 0;
	}
}, true);

// cable.dm:164
rt.def("/obj/structure/cable/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (!(current_size >= STAGE_FIVE)) return f.dot;
	yield* this.deconstruct();
	return f.dot;
}, true);

// cable.dm:168
rt.def("/obj/structure/cable/proc/cableColor", function cableColor(f: Frame, colorC: Value) {
	colorC ??= "red";
	this.cable_color = colorC;
	if (colorC === "red") {
		this.icon = rt.rsc("icons/obj/power_cond/power_cond_red.dmi");
	} else if (colorC === "yellow") {
		this.icon = rt.rsc("icons/obj/power_cond/power_cond_yellow.dmi");
	} else if (colorC === "green") {
		this.icon = rt.rsc("icons/obj/power_cond/power_cond_green.dmi");
	} else if (colorC === "blue") {
		this.icon = rt.rsc("icons/obj/power_cond/power_cond_blue.dmi");
	} else if (colorC === "pink") {
		this.icon = rt.rsc("icons/obj/power_cond/power_cond_pink.dmi");
	} else if (colorC === "orange") {
		this.icon = rt.rsc("icons/obj/power_cond/power_cond_orange.dmi");
	} else if (colorC === "cyan") {
		this.icon = rt.rsc("icons/obj/power_cond/power_cond_cyan.dmi");
	} else if (colorC === "white") {
		this.icon = rt.rsc("icons/obj/power_cond/power_cond_white.dmi");
	}
	return f.dot;
});

// cable.dm:190
rt.def("/obj/structure/cable/proc/update_stored", function update_stored(f: Frame, length: Value, colorC: Value) {
	length ??= 1;
	colorC ??= "red";
	this.stored.amount = length;
	this.stored.item_color = colorC;
	this.stored.update_icon();
	return f.dot;
});

// cable.dm:206
rt.def("/obj/structure/cable/proc/surplus", function surplus(f: Frame) {
	if (this.powernet) {
		return this.powernet.avail - this.powernet.load;
	}
	return 0;
});

// cable.dm:212
rt.def("/obj/structure/cable/proc/avail", function avail(f: Frame) {
	if (this.powernet) {
		return this.powernet.avail;
	}
	return 0;
});

// cable.dm:225
rt.def("/obj/structure/cable/proc/mergeDiagonalsNetworks", function* mergeDiagonalsNetworks(f: Frame, direction: Value) {
	let C: Value = null, newPN: Value = null;
	let _T: Value = rt.getStep(f, this, rt.bitAnd(direction, 3));
	for (C of each(_T, T("/obj/structure/cable"))) {
		if (!C) {
			continue;
		}
		if (this == C) {
			continue;
		}
		if (C.d1 == rt.bitXor(direction, 3) || C.d2 == rt.bitXor(direction, 3)) {
			if (!C.powernet) {
				yield* (newPN = (yield* new_(T("/datum/powernet")))).add_cable(C);
			}
			if (this.powernet) {
				yield* merge_powernets(this.powernet, C.powernet);
			} else {
				yield* C.powernet.add_cable(this);
			}
		}
	}
	_T = rt.getStep(f, this, rt.bitAnd(direction, 12));
	C = null;
	for (C of each(_T, T("/obj/structure/cable"))) {
		if (!C) {
			continue;
		}
		if (this == C) {
			continue;
		}
		if (C.d1 == rt.bitXor(direction, 12) || C.d2 == rt.bitXor(direction, 12)) {
			if (!C.powernet) {
				yield* (newPN = (yield* new_(T("/datum/powernet")))).add_cable(C);
			}
			if (this.powernet) {
				yield* merge_powernets(this.powernet, C.powernet);
			} else {
				yield* C.powernet.add_cable(this);
			}
		}
	}
	return f.dot;
}, true);

// cable.dm:268
rt.def("/obj/structure/cable/proc/mergeConnectedNetworks", function* mergeConnectedNetworks(f: Frame, direction: Value) {
	let C: Value = null, newPN: Value = null;
	let $e: any;
	let fdir: Value = !direction ? 0 : turn(direction, 180);
	if (!(this.d1 == direction || this.d2 == direction)) {
		return f.dot;
	}
	let TB: Value = rt.getStep(f, this, direction);
	for (C of each(TB, T("/obj/structure/cable"))) {
		if (!C) {
			continue;
		}
		if (this == C) {
			continue;
		}
		if (C.d1 == fdir || C.d2 == fdir) {
			if (!C.powernet) {
				yield* (newPN = (yield* new_(T("/datum/powernet")))).add_cable(C);
			}
			if (this.powernet) {
				yield* merge_powernets(this.powernet, C.powernet);
			} else {
				yield* C.powernet.add_cable(this);
			}
		}
	}
	return f.dot;
}, true);

// cable.dm:295
rt.def("/obj/structure/cable/proc/mergeConnectedNetworksOnTurf", function* mergeConnectedNetworksOnTurf(f: Frame) {
	let newPN: Value = null, AM: Value = null, C: Value = null, N: Value = null, M: Value = null, PM: Value = null;
	let to_connect: Value = list();
	if (!this.powernet) {
		yield* (newPN = (yield* new_(T("/datum/powernet")))).add_cable(this);
	}
	for (AM of each(this.loc)) {
		if (rt.istype(AM, T("/obj/structure/cable"))) {
			if ((C = AM).d1 == this.d1 || C.d2 == this.d1 || C.d1 == this.d2 || C.d2 == this.d2) {
				if (C.powernet == this.powernet) {
					continue;
				}
				if (C.powernet) {
					yield* merge_powernets(this.powernet, C.powernet);
				} else {
					yield* this.powernet.add_cable(C);
				}
			}
		} else if (rt.istype(AM, T("/obj/machinery/power/apc"))) {
			if (!(N = AM).terminal) {
				continue;
			}
			if (N.terminal.powernet == this.powernet) {
				continue;
			}
			to_connect += N.terminal;
		} else if (rt.istype(AM, T("/obj/machinery/power"))) {
			if ((M = AM).powernet == this.powernet) {
				continue;
			}
			to_connect += M;
		}
	}
	for (PM of each(to_connect, T("/obj/machinery/power"))) {
		if (!(yield* PM.connect_to_network())) {
			yield* PM.disconnect_from_network();
		}
	}
	return f.dot;
}, true);

// cable.dm:343
rt.def("/obj/structure/cable/proc/get_connections", function get_connections(f: Frame, powernetless_only: Value) {
	let _T: Value = null;
	powernetless_only ??= 0;
	f.dot = list();
	if (this.d1) {
		if (_T = rt.getStep(f, this, this.d1)) {
			f.dot += power_list(_T, this, turn(this.d1, 180), powernetless_only);
		}
	}
	if (rt.bitAnd(this.d1, this.d1 - 1)) {
		if (_T = rt.getStep(f, this, rt.bitAnd(this.d1, 3))) {
			f.dot += power_list(_T, this, rt.bitXor(this.d1, 3), powernetless_only);
		}
		if (_T = rt.getStep(f, this, rt.bitAnd(this.d1, 12))) {
			f.dot += power_list(_T, this, rt.bitXor(this.d1, 12), powernetless_only);
		}
	}
	f.dot += power_list(this.loc, this, this.d1, powernetless_only);
	if (_T = rt.getStep(f, this, this.d2)) {
		f.dot += power_list(_T, this, turn(this.d2, 180), powernetless_only);
	}
	if (rt.bitAnd(this.d2, this.d2 - 1)) {
		if (_T = rt.getStep(f, this, rt.bitAnd(this.d2, 3))) {
			f.dot += power_list(_T, this, rt.bitXor(this.d2, 3), powernetless_only);
		}
		if (_T = rt.getStep(f, this, rt.bitAnd(this.d2, 12))) {
			f.dot += power_list(_T, this, rt.bitXor(this.d2, 12), powernetless_only);
		}
	}
	return (f.dot += power_list(this.loc, this, this.d2, powernetless_only));
});

// cable.dm:381
rt.def("/obj/structure/cable/proc/denode", function* denode(f: Frame) {
	let T1: Value = null, powerlist: Value = null;
	if (!(T1 = this.loc)) {
		return f.dot;
	}
	if (!(rt.len(f, (powerlist = power_list(T1, this, 0, 0))) > 0)) return f.dot;
	let PN: Value = (yield* new_(T("/datum/powernet")));
	yield* propagate_network(rt.index(powerlist, 1), PN);
	if (!PN.is_empty()) return f.dot;
	yield* qdel(PN);
	return f.dot;
}, true);

// cable.dm:394
rt.def("/obj/structure/cable/proc/cut_cable_from_powernet", function* cut_cable_from_powernet(f: Frame) {
	let P_list: Value = null, _P: Value = null, newPN: Value = null, _P_3: Value = null;
	let T1: Value = this.loc;
	if (!T1) {
		return f.dot;
	}
	if (this.d1) {
		T1 = rt.getStep(f, T1, this.d1);
		P_list = (yield* power_list(T1, this, turn(this.d1, 180), 0, { cable_only: 1 }));
	}
	if (rt.len(f, (P_list += (yield* power_list(this.loc, this, this.d1, 0, { cable_only: 1 })))) == 0) {
		yield* this.powernet.remove_cable(this);
		for (_P of each(T1, T("/obj/machinery/power"))) {
			if (!(yield* _P.connect_to_network())) {
				yield* _P.disconnect_from_network();
			}
		}
		return f.dot;
	}
	let O: Value = rt.index(P_list, 1);
	this.loc = null;
	yield* this.powernet.remove_cable(this);
	rt.spawnTail(f, 0, "/obj/structure/cable/proc/cut_cable_from_powernet: spawn at modules/power/cable.dm:418", T1, P_list, _P, O, newPN, _P_3);
	if (this.d1 != 0) return f.dot;
	for (_P_3 of each(T1, T("/obj/machinery/power"))) {
		if (!(yield* _P_3.connect_to_network())) {
			yield* _P_3.disconnect_from_network();
		}
	}
	return f.dot;
}, true);

// a spawn(0) body of /obj/structure/cable/proc/cut_cable_from_powernet, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/cable/proc/cut_cable_from_powernet: spawn at modules/power/cable.dm:418", function* (f: Frame, T1: Value, P_list: Value, _P: Value, O: Value, newPN: Value, _P_3: Value) {
	if (O && !(!O || O.gc_destroyed)) {
		newPN = (yield* new_(T("/datum/powernet")));
		yield* propagate_network(O, newPN);
	}
	return null;
});

// cable.dm:432
rt.def("/obj/structure/cable/proc/beforeShuttleMove", function* beforeShuttleMove(f: Frame, T1: Value, rotation: Value) {
	let D: Value = null;
	let on_edge: Value = 0;
	let A: Value = get_area(this);
	for (D of each(GLOB.alldirs)) {
		if (A != get_area(rt.getStep(f, this, D))) {
			on_edge = 1;
			break;
		}
	}
	if (!(on_edge && this.powernet)) return f.dot;
	let tmp_loc: Value = this.loc;
	yield* this.cut_cable_from_powernet();
	this.loc = tmp_loc;
	return f.dot;
}, true);

// cable.dm:446
rt.def("/obj/structure/cable/proc/afterShuttleMove", function* afterShuttleMove(f: Frame) {
	let D: Value = null, PN: Value = null;
	let on_edge: Value = 0;
	let A: Value = get_area(this);
	for (D of each(GLOB.alldirs)) {
		if (A != get_area(rt.getStep(f, this, D))) {
			on_edge = 1;
			break;
		}
	}
	if (!on_edge) return f.dot;
	yield* (PN = (yield* new_(T("/datum/powernet")))).add_cable(this);
	yield* this.mergeConnectedNetworks(this.d1);
	yield* this.mergeConnectedNetworks(this.d2);
	yield* this.mergeConnectedNetworksOnTurf();
	if (rt.bitAnd(this.d1, this.d1 - 1)) {
		yield* this.mergeDiagonalsNetworks(this.d1);
	}
	if (!rt.bitAnd(this.d2, this.d2 - 1)) return f.dot;
	yield* this.mergeDiagonalsNetworks(this.d2);
	return f.dot;
}, true);

// cable.dm:470
rt.def("/obj/structure/cable/proc/shuttleRotate", function shuttleRotate(f: Frame, rotation: Value) {
	let temp: Value = null;
	if (this.d1) {
		this.d1 = angle2dir(rotation + dir2angle(this.d1));
	}
	if (this.d2) {
		this.d2 = angle2dir(rotation + dir2angle(this.d2));
	}
	if (this.d1 > this.d2) {
		temp = this.d1;
		this.d1 = this.d2;
		this.d2 = temp;
	}
	this.update_icon();
	return f.dot;
});

// cable.dm:490
rt.def("/datum/controller/global_vars/proc/InitGlobalcable_coil_recipes", function InitGlobalcable_coil_recipes(f: Frame) {
	GLOB.cable_coil_recipes = list(new_(T("/datum/stack_recipe"), "cable restraints", T("/obj/item/weapon/restraints/handcuffs/cable"), 15));
	this.gvars_datum_init_order += "cable_coil_recipes";
	return f.dot;
});

rt.type(9077, "/obj/item/stack/cable_coil", "/obj/item/stack", {
	throw_speed: 3,
	throw_range: 5,
	flags: 64,
	name: "cable coil",
	gender: "neuter",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "coil_red",
	item_state: "coil_red",
	max_amount: 30,
	amount: 30,
	merge_type: rt.typePath("/obj/item/stack/cable_coil"),
	item_color: "red",
	desc: "A coil of insulated power cable.",
	throwforce: 0,
	w_class: 2,
	materials: null,
	slot_flags: 512,
	attack_verb: null,
	singular_name: "cable piece",
	full_w_class: 2,
});

// cable.dm:507
rt.def("/obj/item/stack/cable_coil/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 10, "$glass", 5]);
	this.attack_verb = list("whipped", "lashed", "disciplined", "flogged");
	return f.dot;
});

rt.type(9078, "/obj/item/stack/cable_coil/cyborg", "/obj/item/stack/cable_coil", {
	is_cyborg: 1,
	materials: null,
	cost: 1,
});

// cable.dm:516
rt.def("/obj/item/stack/cable_coil/cyborg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

// cable.dm:520
rt.def("/obj/item/stack/cable_coil/cyborg/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let cable_color: Value = null;
	this.item_color = (cable_color = (yield* g.op(f, "Prompt", [0], [null, "Cable Color", "Pick a cable color.", user, list("red", "yellow", "green", "blue", "pink", "orange", "cyan", "white")])));
	yield* this.update_icon();
	return f.dot;
}, true);

// cable.dm:525
rt.def("/obj/item/stack/cable_coil/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	if (rt.locateIn(f, T("/obj/structure/chair/stool"), rt.getStep(f, user, 0))) {
		user.visible_message(`<span class='suicide'>${user} is making a noose with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	} else {
		user.visible_message(`<span class='suicide'>${user} is strangling ${user.p_them()}self with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	}
	return 8;
});

// cable.dm:532
rt.def("/obj/item/stack/cable_coil/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = null;
	}
	if (f.args[2] === null) {
		f.args[2] = null;
	}
	f.dot = (yield* parent_proc());
	if (f.args[1]) {
		this.amount = f.args[1];
	}
	if (f.args[2]) {
		this.item_color = f.args[2];
	}
	this.pixel_x = rand(-2, 2);
	this.pixel_y = rand(-2, 2);
	yield* this.update_icon();
	this.recipes = GLOB.cable_coil_recipes;
	return f.dot;
}, true, { args: ["mapload", "new_amount", "param_color"] });

// cable.dm:548
rt.def("/obj/item/stack/cable_coil/proc/attack", function* attack(f: Frame, H: Value, user: Value) {
	let affecting: Value = null;
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return (yield* parent_proc());
	}
	if ((affecting = H.get_bodypart(check_zone(user.zone_selected))) && affecting.status == BODYPART_ROBOTIC) {
		if (user == H) {
			user.visible_message(`<span class='notice'>${user} starts to fix some of the wires in ${H}'s ${affecting.name}.</span>`, `<span class='notice'>You start fixing some of the wires in ${H}'s ${affecting.name}.</span>`);
			if (!(yield* do_mob(user, H, 50))) {
				return f.dot;
			}
		}
		if (yield* item_heal_robotic(H, user, 0, 15)) {
			yield* this.use(1);
		}
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
}, true);

// cable.dm:565
rt.def("/obj/item/stack/cable_coil/proc/update_icon", function update_icon(f: Frame) {
	if (!this.item_color) {
		this.item_color = pick("red", "yellow", "blue", "green");
	}
	this.item_state = `coil_${this.item_color}`;
	if (this.amount == 1) {
		this.icon_state = `coil_${this.item_color}1`;
		this.name = "cable piece";
	} else if (this.amount == 2) {
		this.icon_state = `coil_${this.item_color}2`;
		this.name = "cable piece";
	} else {
		this.icon_state = `coil_${this.item_color}`;
		this.name = "cable coil";
	}
	return f.dot;
});

// cable.dm:579
rt.def("/obj/item/stack/cable_coil/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let new_cable: Value = null;
	if (!rt.istype((new_cable = (yield* parent_proc())), T("/obj/item/stack/cable_coil"))) return f.dot;
	new_cable.item_color = this.item_color;
	yield* new_cable.update_icon();
	return f.dot;
}, true);

// cable.dm:586
rt.def("/obj/item/stack/cable_coil/proc/give", function give(f: Frame, extra: Value) {
	if (this.amount + extra > this.max_amount) {
		this.amount = this.max_amount;
	} else {
		this.amount += extra;
	}
	this.update_icon();
	return f.dot;
});

// cable.dm:599
rt.def("/obj/item/stack/cable_coil/proc/get_new_cable", function* get_new_cable(f: Frame, location: Value) {
	let $0: any = "/obj/structure/cable";
	let path: Value = $0 + (this.item_color == "red" ? "" : "/" + this.item_color);
	return (yield* new_(path, location));
}, true);

// cable.dm:604
rt.def("/obj/item/stack/cable_coil/proc/place_turf", function* place_turf(f: Frame, _T: Value, user: Value) {
	let dirn: Value = null, LC: Value = null, C: Value = null, PN: Value = null;
	if (!isturf(user.loc)) {
		return f.dot;
	}
	if (!_T.can_have_cabling()) {
		to_chat(user, "<span class='warning'>You can only lay cables on catwalks and plating!</span>");
		return f.dot;
	}
	if (this.get_amount() < 1) {
		to_chat(user, "<span class='warning'>There is no cable left!</span>");
		return f.dot;
	}
	if (get_dist(_T, user) > 1) {
		to_chat(user, "<span class='warning'>You can't lay cable at a place that far away!</span>");
		return f.dot;
	} else {
		if (user.loc == _T) {
			dirn = user.dir;
		} else {
			dirn = rt.getDir(f, _T, user);
		}
		for (LC of each(_T, T("/obj/structure/cable"))) {
			if (LC.d2 == dirn && LC.d1 == 0) {
				to_chat(user, "<span class='warning'>There's already a cable at that position!</span>");
				return f.dot;
			}
		}
		(C = (yield* this.get_new_cable(_T))).d1 = 0;
		C.d2 = dirn;
		yield* C.add_fingerprint(user);
		yield* C.update_icon();
		yield* (PN = (yield* new_(T("/datum/powernet")))).add_cable(C);
		yield* C.mergeConnectedNetworks(C.d2);
		yield* C.mergeConnectedNetworksOnTurf();
		if (rt.bitAnd(C.d2, C.d2 - 1)) {
			yield* C.mergeDiagonalsNetworks(C.d2);
		}
		yield* this.use(1);
		if (!(yield* C.shock(user, 50))) return f.dot;
		if (!prob(50)) return f.dot;
		yield* C.deconstruct();
	}
	return f.dot;
}, true);

// cable.dm:661
rt.def("/obj/item/stack/cable_coil/proc/cable_join", function* cable_join(f: Frame, C: Value, user: Value) {
	let U: Value = null, _T: Value = null, fdirn: Value = null, LC: Value = null, NC: Value = null, newPN: Value = null, nd1: Value = null, nd2: Value = null, LC_5: Value = null;
	if (!isturf((U = user.loc))) {
		return f.dot;
	}
	if (!isturf((_T = C.loc)) || _T.intact) {
		return f.dot;
	}
	if (get_dist(C, user) > 1) {
		to_chat(user, "<span class='warning'>You can't lay cable at a place that far away!</span>");
		return f.dot;
	}
	if (U == _T) {
		yield* this.place_turf(_T, user);
		return f.dot;
	}
	let dirn: Value = rt.getDir(f, C, user);
	if (C.d1 == dirn || C.d2 == dirn) {
		if (!U.can_have_cabling()) {
			to_chat(user, "<span class='warning'>You can only lay cables on catwalks and plating!</span>");
			return f.dot;
		}
		if (U.intact) {
			to_chat(user, "<span class='warning'>You can't lay cable there unless the floor tiles are removed!</span>");
			return f.dot;
		} else {
			fdirn = turn(dirn, 180);
			for (LC of each(U, T("/obj/structure/cable"))) {
				if (LC.d1 == fdirn || LC.d2 == fdirn) {
					to_chat(user, "<span class='warning'>There's already a cable at that position!</span>");
					return f.dot;
				}
			}
			(NC = (yield* this.get_new_cable(U))).d1 = 0;
			NC.d2 = fdirn;
			yield* NC.add_fingerprint();
			yield* NC.update_icon();
			yield* (newPN = (yield* new_(T("/datum/powernet")))).add_cable(NC);
			yield* NC.mergeConnectedNetworks(NC.d2);
			yield* NC.mergeConnectedNetworksOnTurf();
			if (rt.bitAnd(NC.d2, NC.d2 - 1)) {
				yield* NC.mergeDiagonalsNetworks(NC.d2);
			}
			yield* this.use(1);
			if (yield* NC.shock(user, 50)) {
				if (prob(50)) {
					yield* NC.deconstruct();
				}
			}
			return f.dot;
		}
	} else {
		if (C.d1 != 0) return f.dot;
		nd1 = C.d2;
		nd2 = dirn;
		if (nd1 > nd2) {
			nd1 = dirn;
			nd2 = C.d2;
		}
		for (LC_5 of each(_T, T("/obj/structure/cable"))) {
			if (LC_5 == C) {
				continue;
			}
			if (LC_5.d1 == nd1 && LC_5.d2 == nd2 || LC_5.d1 == nd2 && LC_5.d2 == nd1) {
				to_chat(user, "<span class='warning'>There's already a cable at that position!</span>");
				return f.dot;
			}
		}
		C.cableColor(this.item_color);
		C.d1 = nd1;
		C.d2 = nd2;
		C.update_stored(2, this.item_color);
		yield* C.add_fingerprint();
		yield* C.update_icon();
		yield* C.mergeConnectedNetworks(C.d1);
		yield* C.mergeConnectedNetworks(C.d2);
		yield* C.mergeConnectedNetworksOnTurf();
		if (rt.bitAnd(C.d1, C.d1 - 1)) {
			yield* C.mergeDiagonalsNetworks(C.d1);
		}
		if (rt.bitAnd(C.d2, C.d2 - 1)) {
			yield* C.mergeDiagonalsNetworks(C.d2);
		}
		yield* this.use(1);
		if (yield* C.shock(user, 50)) {
			if (prob(50)) {
				yield* C.deconstruct();
				return f.dot;
			}
		}
		yield* C.denode();
		return f.dot;
	}
}, true);

rt.type(9079, "/obj/item/stack/cable_coil/cut", "/obj/item/stack/cable_coil", {
	item_state: "coil_red2",
});

// cable.dm:784
rt.def("/obj/item/stack/cable_coil/cut/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	this.amount = rand(1, 2);
	this.pixel_x = rand(-2, 2);
	this.pixel_y = rand(-2, 2);
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(9088, "/obj/item/stack/cable_coil/random", "/obj/item/stack/cable_coil", {});

// cable.dm:824
rt.def("/obj/item/stack/cable_coil/random/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	this.item_color = pick("red", "orange", "yellow", "green", "cyan", "blue", "pink", "white");
	this.icon_state = `coil_${this.item_color}`;
	return f.dot;
}, true);
