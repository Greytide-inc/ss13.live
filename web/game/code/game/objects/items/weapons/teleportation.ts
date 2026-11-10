// Based on /tg/station's code/game/objects/items/weapons/teleportation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add, fmt } = rt;


rt.type(7345, "/obj/item/weapon/locator", "/obj/item/weapon", {
	temp: null,
	frequency: 1451,
	broadcasting: null,
	listening: 1,
	flags: 64,
	throw_speed: 3,
	throw_range: 7,
	name: "locator",
	desc: "Used to track those with locater implants.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "locator",
	w_class: 2,
	item_state: "electronic",
	materials: null,
	origin_tech: "magnets=3;bluespace=2",
});

// teleportation.dm:28
rt.def("/obj/item/weapon/locator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 400]);
	return f.dot;
});

// teleportation.dm:32
rt.def("/obj/item/weapon/locator/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null;
	yield* user.set_machine(this);
	if (this.temp) {
		dat = fmt("＀<BR><BR><A href='byond://?src=＃;temp=1'>Clear</A>", [this.temp, this]);
	} else {
		dat = fmt("\n<B>Persistent Signal Locator</B><HR>\nFrequency:\n<A href='byond://?src=＃;freq=-10'>-</A>\n<A href='byond://?src=＃;freq=-2'>-</A> ＀\n<A href='byond://?src=＃;freq=2'>+</A>\n<A href='byond://?src=＃;freq=10'>+</A><BR>\n\n<A href='?src=＃;refresh=1'>Refresh</A>", [this, this, format_frequency(this.frequency), this, this, this]);
	}
	rt.op(f, "Browse", [], [user, dat, "window=radio"], false);
	onclose(user, "radio");
	return f.dot;
}, true);

// teleportation.dm:51
rt.def("/obj/item/weapon/locator/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let current_location: Value = null, sr: Value = null, W: Value = null, tr: Value = null, direct: Value = null, M: Value = null, M_1: Value = null;
	yield* parent_proc();
	if (f.usr.stat || f.usr.restrained()) {
		return f.dot;
	}
	if (!(current_location = rt.getStep(f, f.usr, 0)) || current_location.z == 2) {
		to_chat(f.usr, `The ${this} is malfunctioning.`);
		return f.dot;
	}
	if (f.usr.contents.Find(this) || get_dist(this, f.usr) <= 1 && isturf(this.loc)) {
		yield* f.usr.set_machine(this);
		if (rt.at(href_list, "refresh")) {
			this.temp = "<B>Persistent Signal Locator</B><HR>";
			if (sr = rt.getStep(f, this, 0)) {
				rt.modField(f, this, "temp", "<B>Located Beacons:</B><BR>", add);
				for (W of each(GLOB.teleportbeacons, T("/obj/item/device/radio/beacon"))) {
					if (W.frequency == this.frequency) {
						if ((tr = rt.getStep(f, W, 0)).z == sr.z && tr) {
							if ((direct = max(rt.op(f, "Abs", [], [tr.x - sr.x]), rt.op(f, "Abs", [], [tr.y - sr.y]))) < 5) {
								direct = "very strong";
							} else if (direct < 10) {
								direct = "strong";
							} else if (direct < 20) {
								direct = "weak";
							} else {
								direct = "very weak";
							}
							rt.modField(f, this, "temp", `${W.code}-${dir2text(rt.getDir(f, sr, tr))}-${direct}<BR>`, add);
						}
					}
				}
				rt.modField(f, this, "temp", "<B>Extranneous Signals:</B><BR>", add);
				W = null;
				for (W of each(GLOB.tracked_implants, T("/obj/item/weapon/implant/tracking"))) {
					if (!W.imp_in || !ismob(W.loc)) {
						continue;
					}
					if ((M = W.loc).stat == 2) {
						if (M.timeofdeath + 6000 < rt.worldTime(f)) {
							continue;
						}
					}
					if ((tr = rt.getStep(f, W, 0)).z == sr.z && tr) {
						if ((direct = max(rt.op(f, "Abs", [], [tr.x - sr.x]), rt.op(f, "Abs", [], [tr.y - sr.y]))) < 20) {
							if (direct < 5) {
								direct = "very strong";
							} else if (direct < 10) {
								direct = "strong";
							} else {
								direct = "weak";
							}
							rt.modField(f, this, "temp", `${W.imp_in.name}-${dir2text(rt.getDir(f, sr, tr))}-${direct}<BR>`, add);
						}
					}
				}
				rt.modField(f, this, "temp", fmt("<B>You are at [＀,＀,＀]</B> in orbital coordinates.<BR><BR><A href='byond://?src=＃;refresh=1'>Refresh</A><BR>", [sr.x, sr.y, sr.z, this]), add);
			} else {
				rt.modField(f, this, "temp", "<B><FONT color='red'>Processing Error:</FONT></B> Unable to locate orbital position.<BR>", add);
			}
		} else if (rt.at(href_list, "freq")) {
			rt.modField(f, this, "frequency", text2num(rt.at(href_list, "freq")), add);
			this.frequency = sanitize_frequency(this.frequency);
		} else if (rt.at(href_list, "temp")) {
			this.temp = null;
		}
		if (ismob(this.loc)) {
			yield* this.attack_self(this.loc);
		} else {
			for (M_1 of each(viewers(1, this), T("/mob"))) {
				if (M_1.client) {
					yield* this.attack_self(M_1);
				}
			}
		}
	}
	return f.dot;
}, true);

rt.type(7346, "/obj/item/weapon/hand_tele", "/obj/item/weapon", {
	active_portal_pairs: null,
	max_portal_pairs: 3,
	throw_speed: 3,
	throw_range: 5,
	name: "hand tele",
	desc: "A portable item using blue-space technology.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "hand_tele",
	item_state: "electronic",
	throwforce: 0,
	w_class: 2,
	materials: null,
	origin_tech: "magnets=3;bluespace=4",
	armor: null,
	resistance_flags: 99,
});

// teleportation.dm:139
rt.def("/obj/item/weapon/hand_tele/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 10000]);
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 30, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
	return f.dot;
});

// teleportation.dm:147
rt.def("/obj/item/weapon/hand_tele/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.active_portal_pairs = list();
	return f.dot;
}, true);

// teleportation.dm:151
rt.def("/obj/item/weapon/hand_tele/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value, params: Value) {
	if (this.is_parent_of_portal(target)) {
		yield* qdel(target);
		to_chat(user, fmt("<span class='notice'>You dispel ＀ remotely with ％！!</span>", [target, this]));
	}
	return (yield* parent_proc());
}, true);

// teleportation.dm:158
rt.def("/obj/item/weapon/hand_tele/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let com: Value = null, A: Value = null, _T: Value = null, A_5: Value = null, t1: Value = null, A_6: Value = null, created: Value = null;
	let current_location: Value = rt.getStep(f, user, 0);
	let current_area: Value = current_location.loc;
	if (!current_location || current_area.noteleport || current_location.z > ZLEVEL_SPACEMAX || !isturf(user.loc)) {
		to_chat(user, fmt("<span class='notice'>＄！ is malfunctioning.</span>", [this]));
		return f.dot;
	}
	let L: Value = list();
	for (com of each(GLOB.machines, T("/obj/machinery/computer/teleporter"))) {
		if (com.target) {
			if (!(A = get_area(com.target)) || A.noteleport) {
				continue;
			}
			if (com.power_station && com.power_station.teleporter_hub && com.power_station.engaged) {
				rt.setAt(L, `${get_area(com.target)} (Active)`, com.target);
			} else {
				rt.setAt(L, `${get_area(com.target)} (Inactive)`, com.target);
			}
		}
	}
	let turfs: Value = list();
	for (_T of each((yield* urange(10, { orange: 1 })), T("/turf"))) {
		if (_T.x > rt.world().maxx - 8 || _T.x < 8) {
			continue;
		}
		if (_T.y > rt.world().maxy - 8 || _T.y < 8) {
			continue;
		}
		if ((A_5 = _T.loc).noteleport) {
			continue;
		}
		turfs += _T;
	}
	if (rt.len(f, turfs)) {
		rt.setAt(L, "None (Dangerous)", pick(turfs));
	}
	if (!(t1 = (yield* g.op(f, "Prompt", [1], [null, "Hand Teleporter", "Please select a teleporter to lock in on.", user, L]))) || user.get_active_held_item() != this || user.incapacitated()) {
		return f.dot;
	}
	if (rt.len(f, this.active_portal_pairs) >= this.max_portal_pairs) {
		user.show_message(fmt("<span class='notice'>＄！ is recharging!</span>", [this]));
		return f.dot;
	}
	let _T_5: Value = rt.index(L, t1);
	if ((A_6 = get_area(_T_5)).noteleport) {
		to_chat(user, fmt("<span class='notice'>＄！ is malfunctioning.</span>", [this]));
		return f.dot;
	}
	user.show_message("<span class='notice'>Locked In.</span>", 2);
	if (rt.length((created = (yield* create_portal_pair(current_location, get_teleport_turf(rt.getStep(f, _T_5, 0)), this, 300, 1)))) != 2) {
		return f.dot;
	}
	yield* try_move_adjacent(rt.index(created, 1));
	rt.setAt(this.active_portal_pairs, rt.index(created, 1), rt.index(created, 2));
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// teleportation.dm:205
rt.def("/obj/item/weapon/hand_tele/proc/on_portal_destroy", function on_portal_destroy(f: Frame, _P: Value) {
	this.active_portal_pairs -= _P;
	return f.dot;
});

// teleportation.dm:208
rt.def("/obj/item/weapon/hand_tele/proc/is_parent_of_portal", function is_parent_of_portal(f: Frame, _P: Value) {
	let i: Value = null;
	if (!rt.istype(_P, T("/obj/effect/portal"))) {
		return 0;
	}
	if (rt.index(this.active_portal_pairs, _P)) {
		return 1;
	}
	for (i of each(this.active_portal_pairs)) {
		if (rt.index(this.active_portal_pairs, i) == _P) {
			return 2;
		}
	}
	return 0;
});
