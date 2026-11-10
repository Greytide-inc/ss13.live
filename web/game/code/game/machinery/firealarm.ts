// Based on /tg/station's code/game/machinery/firealarm.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(10790, "/obj/machinery/firealarm", "/obj/machinery", {
	detecting: 1,
	buildstage: 2,
	anchored: 1,
	name: "fire alarm",
	desc: "<i>\"Pull this in case of emergency\"</i>. Thus, keep pulling it forever.",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "fire0",
	obj_integrity: 250,
	max_integrity: 250,
	integrity_failure: 100,
	armor: null,
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 6,
	power_channel: 3,
	resistance_flags: 2,
});

// firealarm.dm:21
rt.def("/obj/machinery/firealarm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 100, "fire", 90, "acid", 30]);
	return f.dot;
});

// firealarm.dm:32
rt.def("/obj/machinery/firealarm/proc/New", function* New(f: Frame, loc: Value, dir: Value, building: Value) {
	let $0: any;
	yield* parent_proc();
	if (dir) {
		yield* this.setDir(dir);
	}
	if (building) {
		this.buildstage = 0;
		this.panel_open = 1;
		if (rt.bitAnd(dir, 3)) {
			$0 = 0;
		} else if (dir == 4) {
			$0 = -24;
		} else {
			$0 = 24;
		}
		this.pixel_x = $0;
		if (rt.bitAnd(dir, 3)) {
			if (dir == 1) {
				$0 = -24;
			} else {
				$0 = 24;
			}
		} else {
			$0 = 0;
		}
		this.pixel_y = $0;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// firealarm.dm:43
rt.def("/obj/machinery/firealarm/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// firealarm.dm:47
rt.def("/obj/machinery/firealarm/proc/update_icon", function update_icon(f: Frame) {
	let A: Value = null;
	this.cut_overlays();
	A = (A = this.loc).loc;
	if (this.panel_open) {
		this.icon_state = `fire_b${this.buildstage}`;
		return f.dot;
	} else {
		this.icon_state = "fire0";
		if (rt.bitAnd(this.stat, 1)) {
			this.icon_state = "firex";
			return f.dot;
		}
		if (rt.bitAnd(this.stat, 2)) {
			return f.dot;
		}
		if (this.z == 2) {
			this.add_overlay(`overlay_${GLOB.security_level}`);
		} else {
			this.add_overlay(`overlay_${SEC_LEVEL_GREEN}`);
		}
		if (this.detecting) {
			this.add_overlay(`overlay_${A.fire ? "fire" : "clear"}`);
		} else {
			this.add_overlay("overlay_fire");
		}
	}
	return f.dot;
});

// firealarm.dm:77
rt.def("/obj/machinery/firealarm/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (prob(50 / severity)) {
		yield* this.alarm();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// firealarm.dm:82
rt.def("/obj/machinery/firealarm/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	this.emagged = 1;
	if (user) {
		user.visible_message(`<span class='warning'>Sparks fly out of the ${this}!</span>`, `<span class='notice'>You emag ${this}, disabling its thermal sensors.</span>`);
	}
	playsound(this.loc, rt.rsc("sound/effects/sparks4.ogg"), 50, 1);
	return f.dot;
});

// firealarm.dm:90
rt.def("/obj/machinery/firealarm/proc/temperature_expose", function temperature_expose(f: Frame, air: Value, temperature: Value, volume: Value) {
	if (!this.emagged && this.detecting && !this.stat && (temperature > 473.15 || temperature < BODYTEMP_COLD_DAMAGE_LIMIT)) {
		this.alarm();
	}
	parent_proc();
	return f.dot;
}, false);

// firealarm.dm:95
rt.def("/obj/machinery/firealarm/proc/alarm", function alarm(f: Frame) {
	let A: Value = null;
	if (!this.is_operational()) {
		return f.dot;
	}
	(A = get_area(this)).firealert(this);
	playsound(this.loc, rt.rsc("sound/machines/FireAlarm.ogg"), 50);
	return f.dot;
});

// firealarm.dm:105
rt.def("/obj/machinery/firealarm/proc/reset", function reset(f: Frame) {
	let A: Value = null;
	if (!this.is_operational()) {
		return f.dot;
	}
	(A = get_area(this)).firereset(this);
	return f.dot;
});

// firealarm.dm:115
rt.def("/obj/machinery/firealarm/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "firealarm", this.name, 300, 150, master_ui, state))).open();
	return f.dot;
}, true);

// firealarm.dm:121
rt.def("/obj/machinery/firealarm/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	rt.setAt((data = list()), "emagged", this.emagged);
	if (this.z == ZLEVEL_STATION) {
		rt.setAt(data, "seclevel", get_security_level());
	} else {
		rt.setAt(data, "seclevel", "green");
	}
	let A: Value = get_area(this);
	rt.setAt(data, "alarm", A.fire);
	return data;
});

// firealarm.dm:135
rt.def("/obj/machinery/firealarm/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if ((yield* parent_proc()) || this.buildstage != 2) {
		return f.dot;
	}
	if (action === "reset") {
		yield* this.reset();
		f.dot = 1;
	} else if (action === "alarm") {
		yield* this.alarm();
		f.dot = 1;
	}
	return f.dot;
}, true);

// /obj/machinery/firealarm/proc/AltClick  (added: modern tg's alt-click toggle; same checks as the window's ui_act)  may sleep
rt.def("/obj/machinery/firealarm/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	if (!user.canUseTopic(this)) {
		return f.dot;
	}
	if (this.buildstage != 2 || !rt.callSrc(f, "is_operational", [])) {
		return f.dot;
	}
	let A: Value = rt.call(f, P("/proc/get_area"), null, [this]);
	if (A.fire) {
		to_chat(user, `<span class='notice'>You reset ${this}.</span>`);
		yield* this.reset();
	} else {
		to_chat(user, `<span class='notice'>You activate ${this}.</span>`);
		yield* this.alarm();
	}
	return f.dot;
}, true);

// firealarm.dm:146
rt.def("/obj/machinery/firealarm/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null, coil: Value = null, frame: Value = null;
	yield* this.add_fingerprint(user);
	if (rt.istype(W, T("/obj/item/weapon/screwdriver")) && this.buildstage == 2) {
		playsound(this.loc, W.usesound, 50, 1);
		this.panel_open = (!this.panel_open ? 1 : 0);
		to_chat(user, `<span class='notice'>The wires have been ${this.panel_open ? "exposed" : "unexposed"}.</span>`);
		yield* this.update_icon();
		return f.dot;
	}
	if (this.panel_open) {
		if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && user.a_intent == "help") {
			WT = W;
			if (this.obj_integrity < this.max_integrity) {
				if (yield* WT.remove_fuel(0, user)) {
					to_chat(user, `<span class='notice'>You begin repairing ${this}...</span>`);
					playsound(this.loc, WT.usesound, 40, 1);
					if (yield* do_after(user, 40 * WT.toolspeed, { target: this })) {
						this.obj_integrity = this.max_integrity;
						playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
						to_chat(user, `<span class='notice'>You repair ${this}.</span>`);
					}
				}
			} else {
				to_chat(user, `<span class='warning'>${this} is already in good condition!</span>`);
			}
			return f.dot;
		}
		if (this.buildstage === 2) {
			if (rt.istype(W, T("/obj/item/device/multitool"))) {
				this.detecting = (!this.detecting ? 1 : 0);
				if (this.detecting) {
					user.visible_message(`${user} has reconnected ${this}'s detecting unit!`, `<span class='notice'>You reconnect ${this}'s detecting unit.</span>`);
				} else {
					user.visible_message(`${user} has disconnected ${this}'s detecting unit!`, `<span class='notice'>You disconnect ${this}'s detecting unit.</span>`);
				}
				return f.dot;
			} else if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
				this.buildstage = 1;
				playsound(this.loc, W.usesound, 50, 1);
				yield* new_(T("/obj/item/stack/cable_coil"), user.loc, 5);
				to_chat(user, fmt("<span class='notice'>You cut the wires from ％！.</span>", [this]));
				yield* this.update_icon();
				return f.dot;
			}
		} else if (this.buildstage === 1) {
			if (rt.istype(W, T("/obj/item/stack/cable_coil"))) {
				if ((coil = W).get_amount() < 5) {
					to_chat(user, "<span class='warning'>You need more cable for this!</span>");
				} else {
					yield* coil.use(5);
					this.buildstage = 2;
					to_chat(user, fmt("<span class='notice'>You wire ％！.</span>", [this]));
					yield* this.update_icon();
				}
				return f.dot;
			} else if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
				playsound(this.loc, W.usesound, 50, 1);
				user.visible_message(`${user.name} removes the electronics from ${this.name}.`, "<span class='notice'>You start prying out the circuit...</span>");
				if (yield* do_after(user, 20 * W.toolspeed, { target: this })) {
					if (this.buildstage == 1) {
						if (rt.bitAnd(this.stat, 1)) {
							to_chat(user, "<span class='notice'>You remove the destroyed circuit.</span>");
							(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
						} else {
							to_chat(user, "<span class='notice'>You pry out the circuit.</span>");
							yield* new_(T("/obj/item/weapon/electronics/firealarm"), user.loc);
						}
						this.buildstage = 0;
						yield* this.update_icon();
					}
				}
				return f.dot;
			}
		} else if (this.buildstage === 0) {
			if (rt.istype(W, T("/obj/item/weapon/electronics/firealarm"))) {
				to_chat(user, "<span class='notice'>You insert the circuit.</span>");
				yield* qdel(W);
				this.buildstage = 1;
				yield* this.update_icon();
				return f.dot;
			} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
				user.visible_message(`${user} removes the fire alarm assembly from the wall.`, "<span class='notice'>You remove the fire alarm assembly from the wall.</span>");
				(frame = (yield* new_(T("/obj/item/wallframe/firealarm")))).loc = user.loc;
				playsound(this.loc, W.usesound, 50, 1);
				yield* qdel(this);
				return f.dot;
			}
		}
	}
	return (yield* parent_proc());
}, true);

// firealarm.dm:235
rt.def("/obj/machinery/firealarm/proc/take_damage", function* take_damage(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (!(this.obj_integrity > 0 && !rt.bitAnd(this.stat, 1) && this.buildstage != 0)) return f.dot;
	if (!prob(33)) return f.dot;
	yield* this.alarm();
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// firealarm.dm:242
rt.def("/obj/machinery/firealarm/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(!rt.bitAnd(this.stat, 1) && !rt.bitAnd(this.flags, NODECONSTRUCT) && this.buildstage != 0)) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.update_icon();
	return f.dot;
});

// firealarm.dm:247
rt.def("/obj/machinery/firealarm/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let I: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 1);
		if (!rt.bitAnd(this.stat, 1)) {
			I = (yield* new_(T("/obj/item/weapon/electronics/firealarm"), this.loc));
			if (!disassembled) {
				I.obj_integrity = I.max_integrity * 0.5;
			}
		}
		yield* new_(T("/obj/item/stack/cable_coil"), this.loc, 3);
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10791, "/obj/machinery/firealarm/partyalarm", "/obj/machinery/firealarm", {
	name: "１PARTY BUTTON",
	desc: "Cuban Pete is in the house!",
});

// firealarm.dm:266
rt.def("/obj/machinery/firealarm/partyalarm/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let d1: Value = null, dat: Value = null, popup: Value = null;
	if (user.stat && !IsAdminGhost(user) || rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (this.buildstage != 2) {
		return f.dot;
	}
	yield* user.set_machine(this);
	let A: Value = this.loc;
	if (rt.istype(user, T("/mob/living/carbon/human")) || user.has_unlimited_silicon_privilege) {
		if ((A = A.loc).party) {
			d1 = fmt("<A href='?src=＃;reset=1'>No Party :(</A>", [this]);
		} else {
			d1 = fmt("<A href='?src=＃;alarm=1'>PARTY!!!</A>", [this]);
		}
		dat = `<HTML><HEAD></HEAD><BODY><TT><B>Party Button</B> ${d1}</BODY></HTML>`;
	} else {
		if ((A = A.loc).fire) {
			d1 = fmt("<A href='?src=＃;reset=1'>＀</A>", [this, stars("No Party :(")]);
		} else {
			d1 = fmt("<A href='?src=＃;alarm=1'>＀</A>", [this, stars("PARTY!!!")]);
		}
		dat = `<HTML><HEAD></HEAD><BODY><TT><B>${stars("Party Button")}</B> ${d1}`;
	}
	(popup = (yield* new_(T("/datum/browser"), user, "firealarm", "Party Alarm"))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// firealarm.dm:300
rt.def("/obj/machinery/firealarm/partyalarm/proc/reset", function reset(f: Frame) {
	let A: Value = null, RA: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!rt.istype((A = (A = this.loc).loc), T("/area"))) {
		return f.dot;
	}
	for (RA of each(A.related, T("/area"))) {
		RA.partyreset();
	}
	return f.dot;
});

// firealarm.dm:311
rt.def("/obj/machinery/firealarm/partyalarm/proc/alarm", function alarm(f: Frame) {
	let A: Value = null, RA: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!rt.istype((A = (A = this.loc).loc), T("/area"))) {
		return f.dot;
	}
	for (RA of each(A.related, T("/area"))) {
		RA.partyalert();
	}
	return f.dot;
});
