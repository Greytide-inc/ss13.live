// Based on /tg/station's code/modules/power/solar.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10320, "/obj/machinery/power/solar", "/obj/machinery/power", {
	id: 0,
	obscured: 0,
	sunfrac: 0,
	adir: 2,
	ndir: 2,
	turn_angle: 0,
	control: null,
	anchored: 1,
	name: "solar panel",
	desc: "A solar panel. Generates electricity when in contact with sunlight.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "sp_base",
	density: 1,
	use_power: 0,
	idle_power_usage: 0,
	active_power_usage: 0,
	obj_integrity: 150,
	max_integrity: 150,
	integrity_failure: 50,
});

// solar.dm:26
rt.def("/obj/machinery/power/solar/proc/New", function* New(f: Frame, loc: Value, S: Value) {
	yield* parent_proc(loc);
	yield* this.Make(S);
	yield* this.connect_to_network();
	return f.dot;
}, true);

// solar.dm:31
rt.def("/obj/machinery/power/solar/proc/Destroy", function* Destroy(f: Frame) {
	this.unset_control();
	return (yield* parent_proc());
}, true);

// solar.dm:36
rt.def("/obj/machinery/power/solar/proc/set_control", function set_control(f: Frame, SC: Value) {
	if (!SC || get_dist(this, SC) > SOLAR_MAX_DIST) {
		return 0;
	}
	this.control = SC;
	(rt.modField(f, SC, "connected_panels", this, rt.bitOr));
	return 1;
});

// solar.dm:45
rt.def("/obj/machinery/power/solar/proc/unset_control", function unset_control(f: Frame) {
	if (this.control) {
		this.control.connected_panels.Remove(this);
	}
	this.control = null;
	return f.dot;
});

// solar.dm:49
rt.def("/obj/machinery/power/solar/proc/Make", function* Make(f: Frame, S: Value) {
	if (!S) {
		(S = (yield* new_(T("/obj/item/solar_assembly"), this))).glass_type = T("/obj/item/stack/sheet/glass");
		S.anchored = 1;
	}
	S.loc = this;
	if (S.glass_type == T("/obj/item/stack/sheet/rglass")) {
		this.max_integrity *= 2;
		this.obj_integrity = this.max_integrity;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// solar.dm:60
rt.def("/obj/machinery/power/solar/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
		playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
		user.visible_message(`${user} begins to take the glass off the solar panel.`, "<span class='notice'>You begin to take the glass off the solar panel...</span>");
		if (yield* do_after(user, 50 * W.toolspeed, { target: this })) {
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			user.visible_message(`${user} takes the glass off the solar panel.`, "<span class='notice'>You take the glass off the solar panel.</span>");
			yield* this.deconstruct(1);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// solar.dm:71
rt.def("/obj/machinery/power/solar/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (rt.bitAnd(this.stat, 1)) {
			playsound(this.loc, rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 60, 1);
		} else {
			playsound(this.loc, rt.rsc("sound/effects/glasshit.ogg"), 90, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// solar.dm:82
rt.def("/obj/machinery/power/solar/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(!rt.bitAnd(this.stat, 1) && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	playsound(this.loc, rt.rsc("sound/effects/glassbr3.ogg"), 100, 1);
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.unset_control();
	this.update_icon();
	return f.dot;
});

// solar.dm:89
rt.def("/obj/machinery/power/solar/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let S: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (disassembled) {
			if (S = rt.locateIn(f, T("/obj/item/solar_assembly"), this)) {
				yield* S.forceMove(this.loc);
				yield* S.give_glass(rt.bitAnd(this.stat, 1));
			}
		} else {
			playsound(this, "shatter", 70, 1);
			yield* new_(T("/obj/item/weapon/shard"), this.loc);
			yield* new_(T("/obj/item/weapon/shard"), this.loc);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// solar.dm:103
rt.def("/obj/machinery/power/solar/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.cut_overlays();
	if (rt.bitAnd(this.stat, 1)) {
		this.add_overlay(mutable_appearance(this.icon, "solar_panel-b", 5));
	} else {
		this.add_overlay(mutable_appearance(this.icon, "solar_panel", 5));
		this.setDir(angle2dir(this.adir));
	}
	return f.dot;
});

// solar.dm:118
rt.def("/obj/machinery/power/solar/proc/update_solar_exposure", function update_solar_exposure(f: Frame) {
	let p_angle: Value = null;
	if (this.obscured) {
		this.sunfrac = 0;
		return f.dot;
	}
	if ((p_angle = min(rt.op(f, "Abs", [], [this.adir - GLOB.SSsun.angle]), 360 - rt.op(f, "Abs", [], [this.adir - GLOB.SSsun.angle]))) > 90) {
		this.sunfrac = 0;
		return f.dot;
	}
	this.sunfrac = rt.op(f, "Cos", [], [p_angle]) ** 2;
	return f.dot;
});

// solar.dm:128
rt.def("/obj/machinery/power/solar/proc/process", function process(f: Frame) {
	let sgen: Value = null;
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	if (!this.control) {
		return f.dot;
	}
	if (!this.powernet) return f.dot;
	if (this.powernet == this.control.powernet) {
		if (this.obscured) {
			return f.dot;
		}
		this.add_avail((sgen = SOLARGENRATE * this.sunfrac));
		this.control.gen += sgen;
	} else {
		this.unset_control();
	}
	return f.dot;
}, false, { waitfor: false });

rt.type(10321, "/obj/machinery/power/solar/fake", "/obj/machinery/power/solar", {});

// solar.dm:145
rt.def("/obj/machinery/power/solar/fake/proc/New", function* New(f: Frame, loc: Value, S: Value) {
	yield* parent_proc(loc, S, 0);
	return f.dot;
}, true);

// solar.dm:154
rt.def("/obj/machinery/power/solar/proc/occlusion", function occlusion(f: Frame) {
	let _T: Value = null, i: Value = null;
	let $e: any;
	let ax: Value = this.x;
	let ay: Value = this.y;
	let dx: Value = GLOB.SSsun.dx;
	let dy: Value = GLOB.SSsun.dy;
	rt.forRange(f, 0, 1, 20, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		ax += dx;
		ay += dy;
		if ((_T = rt.locate(round(ax, 0.5), round(ay, 0.5), this.z)).x == 1 || _T.x == rt.world().maxx || _T.y == 1 || _T.y == rt.world().maxy) {
			break;
		}
		if (_T.density) {
			this.obscured = 1;
			return f.dot;
		}
	}
	rt.endFor(f, 0);
	this.obscured = 0;
	this.update_solar_exposure();
	return f.dot;
});

rt.type(10134, "/obj/item/solar_assembly", "/obj/item", {
	tracker: 0,
	glass_type: null,
	item_state: "electropack",
	w_class: 4,
	anchored: 0,
	name: "solar panel assembly",
	desc: "A solar panel assembly kit, allows constructions of a solar panel, or with a tracking circuit board, a solar tracker.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "sp_base",
});

// solar.dm:193
rt.def("/obj/item/solar_assembly/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!(!this.anchored && isturf(this.loc))) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// solar.dm:199
rt.def("/obj/item/solar_assembly/proc/give_glass", function* give_glass(f: Frame, device_broken: Value) {
	let S: Value = null;
	if (device_broken) {
		yield* new_(T("/obj/item/weapon/shard"), this.loc);
		yield* new_(T("/obj/item/weapon/shard"), this.loc);
	} else if (this.glass_type) {
		(S = (yield* new_(this.glass_type, this.loc))).amount = 2;
	}
	this.glass_type = null;
	return f.dot;
}, true);

// solar.dm:208
rt.def("/obj/item/solar_assembly/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let S: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/wrench")) && isturf(this.loc)) {
		if (this.isinspace()) {
			to_chat(user, `<span class='warning'>You can't secure ${this} here.</span>`);
			return f.dot;
		}
		this.anchored = (!this.anchored ? 1 : 0);
		if (this.anchored) {
			user.visible_message(`${user} wrenches the solar assembly into place.`, "<span class='notice'>You wrench the solar assembly into place.</span>");
			playsound(this.loc, W.usesound, 75, 1);
		} else {
			user.visible_message(`${user} unwrenches the solar assembly from its place.`, "<span class='notice'>You unwrench the solar assembly from its place.</span>");
			playsound(this.loc, W.usesound, 75, 1);
		}
		return 1;
	}
	if (rt.istype(W, T("/obj/item/stack/sheet/glass")) || rt.istype(W, T("/obj/item/stack/sheet/rglass"))) {
		if (!this.anchored) {
			to_chat(user, "<span class='warning'>You need to secure the assembly before you can add glass.</span>");
			return f.dot;
		}
		if (yield* (S = W).use(2)) {
			this.glass_type = W.type;
			playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
			user.visible_message(`${user} places the glass on the solar assembly.`, "<span class='notice'>You place the glass on the solar assembly.</span>");
			if (this.tracker) {
				yield* new_(T("/obj/machinery/power/tracker"), rt.getStep(f, this, 0), this);
			} else {
				yield* new_(T("/obj/machinery/power/solar"), rt.getStep(f, this, 0), this);
			}
		} else {
			to_chat(user, "<span class='warning'>You need two sheets of glass to put them into a solar panel!</span>");
			return f.dot;
		}
		return 1;
	}
	if (!this.tracker) {
		if (rt.istype(W, T("/obj/item/weapon/electronics/tracker"))) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.tracker = 1;
			yield* qdel(W);
			user.visible_message(`${user} inserts the electronics into the solar assembly.`, "<span class='notice'>You insert the electronics into the solar assembly.</span>");
			return 1;
		}
	} else if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
		yield* new_(T("/obj/item/weapon/electronics/tracker"), this.loc);
		this.tracker = 0;
		user.visible_message(`${user} takes out the electronics from the solar assembly.`, "<span class='notice'>You take out the electronics from the solar assembly.</span>");
		return 1;
	}
	return (yield* parent_proc());
}, true);

rt.type(10322, "/obj/machinery/power/solar_control", "/obj/machinery/power", {
	icon_screen: "solar",
	icon_keyboard: "power_key",
	id: 0,
	currentdir: 0,
	targetdir: 0,
	gen: 0,
	lastgen: 0,
	track: 0,
	trackrate: 600,
	nexttime: 0,
	connected_tracker: null,
	connected_panels: null,
	anchored: 1,
	name: "solar panel control",
	desc: "A controller for solar panel arrays.",
	icon: rt.rsc("icons/obj/computer.dmi"),
	icon_state: "computer",
	density: 1,
	use_power: 1,
	idle_power_usage: 250,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 100,
});

// solar.dm:282
rt.def("/obj/machinery/power/solar_control/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.connected_panels = list();
	return f.dot;
});

// solar.dm:285
rt.def("/obj/machinery/power/solar_control/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.powernet) {
		this.set_panels(this.currentdir);
	}
	yield* this.connect_to_network();
	return f.dot;
}, true);

// solar.dm:291
rt.def("/obj/machinery/power/solar_control/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null;
	for (M of each(this.connected_panels, T("/obj/machinery/power/solar"))) {
		M.unset_control();
	}
	if (this.connected_tracker) {
		this.connected_tracker.unset_control();
	}
	return (yield* parent_proc());
}, true);

// solar.dm:298
rt.def("/obj/machinery/power/solar_control/proc/disconnect_from_network", function* disconnect_from_network(f: Frame) {
	yield* parent_proc();
	yield* GLOB.SSsun.solars.Remove(this);
	return f.dot;
}, true);

// solar.dm:302
rt.def("/obj/machinery/power/solar_control/proc/connect_to_network", function* connect_to_network(f: Frame) {
	let to_return: Value = (yield* parent_proc());
	if (this.powernet) {
		(rt.modField(f, GLOB.SSsun, "solars", this, rt.bitOr));
	}
	return to_return;
}, true);

// solar.dm:310
rt.def("/obj/machinery/power/solar_control/proc/search_for_connected", function search_for_connected(f: Frame) {
	let M: Value = null, S: Value = null, _T: Value = null;
	if (!this.powernet) return f.dot;
	for (M of each(this.powernet.nodes, T("/obj/machinery/power"))) {
		if (rt.istype(M, T("/obj/machinery/power/solar"))) {
			if (!(S = M).control) {
				S.set_control(this);
			}
		} else if (rt.istype(M, T("/obj/machinery/power/tracker"))) {
			if (!this.connected_tracker) {
				if (!(_T = M).control) {
					_T.set_control(this);
				}
			}
		}
	}
	return f.dot;
});

// solar.dm:323
rt.def("/obj/machinery/power/solar_control/proc/update", function* update(f: Frame) {
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (this.track === 1) {
		if (this.trackrate) {
			this.currentdir = this.targetdir;
		}
	} else if (this.track === 2) {
		if (this.connected_tracker) {
			this.connected_tracker.set_angle(GLOB.SSsun.angle);
		}
	}
	this.set_panels(this.currentdir);
	yield* this.updateDialog();
	return f.dot;
}, true);

// solar.dm:338
rt.def("/obj/machinery/power/solar_control/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (rt.bitAnd(this.stat, 2)) {
		this.add_overlay(`${this.icon_keyboard}_off`);
		return f.dot;
	}
	this.add_overlay(this.icon_keyboard);
	if (rt.bitAnd(this.stat, 1)) {
		this.add_overlay(`${this.icon_state}_broken`);
	} else {
		this.add_overlay(this.icon_screen);
	}
	if (!(this.currentdir > -1)) return f.dot;
	this.setDir(angle2dir(this.currentdir));
	this.add_overlay(mutable_appearance(this.icon, "solcon-o", 5));
	return f.dot;
});

// solar.dm:353
rt.def("/obj/machinery/power/solar_control/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "solar_control", this.name, 500, 400, master_ui, state))).open();
	return f.dot;
}, true);

// solar.dm:359
rt.def("/obj/machinery/power/solar_control/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	rt.setAt((data = list()), "generated", round(this.lastgen));
	rt.setAt(data, "angle", this.currentdir);
	rt.setAt(data, "direction", angle2text(this.currentdir));
	rt.setAt(data, "tracking_state", this.track);
	rt.setAt(data, "tracking_rate", this.trackrate);
	let $0: any = data;
	let $1: any = "rotating_way";
	rt.setAt($0, $1, this.trackrate < 0 ? "CCW" : "CW");
	rt.setAt(data, "connected_panels", rt.len(f, this.connected_panels));
	rt.setAt(data, "connected_tracker", this.connected_tracker ? 1 : 0);
	return data;
});

// solar.dm:374
rt.def("/obj/machinery/power/solar_control/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let adjust: Value = null, mode: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "direction") {
		if (adjust = text2num(rt.at(params, "adjust"))) {
			this.currentdir = max(0, min((360 + adjust + this.currentdir) % 360, 359));
			this.targetdir = this.currentdir;
			this.set_panels(this.currentdir);
			f.dot = 1;
		}
	} else if (action === "rate") {
		if (adjust = text2num(rt.at(params, "adjust"))) {
			this.trackrate = max(-7200, min(this.trackrate + adjust, 7200));
			if (this.trackrate) {
				this.nexttime = rt.worldTime(f) + 36000 / rt.op(f, "Abs", [], [this.trackrate]);
			}
			f.dot = 1;
		}
	} else if (action === "tracking") {
		if (mode = text2num(rt.at(params, "mode"))) {
			this.track = mode;
			f.dot = 1;
		}
		if (mode == 2 && this.connected_tracker) {
			this.connected_tracker.set_angle(GLOB.SSsun.angle);
			this.set_panels(this.currentdir);
		} else if (mode == 1) {
			this.targetdir = this.currentdir;
			if (this.trackrate) {
				this.nexttime = rt.worldTime(f) + 36000 / rt.op(f, "Abs", [], [this.trackrate]);
			}
			this.set_panels(this.targetdir);
		}
	} else if (action === "refresh") {
		this.search_for_connected();
		if (this.connected_tracker && this.track == 2) {
			this.connected_tracker.set_angle(GLOB.SSsun.angle);
		}
		this.set_panels(this.currentdir);
		f.dot = 1;
	}
	return f.dot;
}, true);

// solar.dm:412
rt.def("/obj/machinery/power/solar_control/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let A: Value = null, M: Value = null, C: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		playsound(this.loc, I.usesound, 50, 1);
		if (yield* do_after(user, 20 * I.toolspeed, { target: this })) {
			if (rt.bitAnd(this.stat, 1)) {
				to_chat(user, "<span class='notice'>The broken glass falls out.</span>");
				A = (yield* new_(T("/obj/structure/frame/computer"), this.loc));
				yield* new_(T("/obj/item/weapon/shard"), this.loc);
				M = (yield* new_(T("/obj/item/weapon/circuitboard/computer/solar_control"), A));
				for (C of each(this, T("/obj"))) {
					C.loc = this.loc;
				}
				A.circuit = M;
				A.state = 3;
				A.icon_state = "3";
				A.anchored = 1;
				yield* qdel(this);
			} else {
				to_chat(user, "<span class='notice'>You disconnect the monitor.</span>");
				A = (yield* new_(T("/obj/structure/frame/computer"), this.loc));
				M = (yield* new_(T("/obj/item/weapon/circuitboard/computer/solar_control"), A));
				C = null;
				for (C of each(this, T("/obj"))) {
					C.loc = this.loc;
				}
				A.circuit = M;
				A.state = 4;
				A.icon_state = "4";
				A.anchored = 1;
				yield* qdel(this);
			}
		}
	} else if (user.a_intent != "harm" && !rt.bitAnd(I.flags, NOBLUDGEON)) {
		yield* this.attack_hand(user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// solar.dm:444
rt.def("/obj/machinery/power/solar_control/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (rt.bitAnd(this.stat, 1)) {
			playsound(this.loc, rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 70, 1);
		} else {
			playsound(this.loc, rt.rsc("sound/effects/glasshit.ogg"), 75, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// solar.dm:454
rt.def("/obj/machinery/power/solar_control/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(!rt.bitAnd(this.stat, 1) && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	playsound(this.loc, rt.rsc("sound/effects/glassbr3.ogg"), 100, 1);
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.update_icon();
	return f.dot;
});

// solar.dm:460
rt.def("/obj/machinery/power/solar_control/proc/process", function process(f: Frame) {
	this.lastgen = this.gen;
	this.gen = 0;
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (this.connected_tracker) {
		if (this.connected_tracker.powernet != this.powernet) {
			this.connected_tracker.unset_control();
		}
	}
	if (!(this.track == 1 && this.trackrate)) return f.dot;
	if (!(this.nexttime <= rt.worldTime(f))) return f.dot;
	this.targetdir = (this.targetdir + this.trackrate / rt.op(f, "Abs", [], [this.trackrate]) + 360) % 360;
	this.nexttime += 36000 / rt.op(f, "Abs", [], [this.trackrate]);
	return f.dot;
}, false, { waitfor: false });

// solar.dm:478
rt.def("/obj/machinery/power/solar_control/proc/set_panels", function set_panels(f: Frame, currentdir: Value) {
	let S: Value = null;
	for (S of each(this.connected_panels, T("/obj/machinery/power/solar"))) {
		S.adir = currentdir;
		S.occlusion();
		S.update_icon();
	}
	this.update_icon();
	return f.dot;
});

// solar.dm:487
rt.def("/obj/machinery/power/solar_control/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});
