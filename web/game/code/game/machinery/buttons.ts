// Based on /tg/station's code/game/machinery/buttons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(10778, "/obj/machinery/button", "/obj/machinery", {
	skin: "doorctrl",
	device: null,
	board: null,
	device_type: null,
	id: null,
	initialized_button: 0,
	anchored: 1,
	name: "button",
	desc: "A remote control switch.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "doorctrl",
	power_channel: 3,
	armor: null,
	use_power: 1,
	idle_power_usage: 2,
	resistance_flags: 115,
});

// buttons.dm:13
rt.def("/obj/machinery/button/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 50, "bomb", 10, "bio", 100, "rad", 100, "fire", 90, "acid", 70]);
	return f.dot;
});

// buttons.dm:21
rt.def("/obj/machinery/button/proc/New", function* New(f: Frame) {
	let $0: any;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	yield* parent_proc();
	if (f.args[2]) {
		yield* this.setDir(f.args[1]);
		if (rt.bitAnd(this.dir, 3)) {
			$0 = 0;
		} else if (this.dir == 4) {
			$0 = -24;
		} else {
			$0 = 24;
		}
		this.pixel_x = $0;
		if (rt.bitAnd(this.dir, 3)) {
			if (this.dir == 1) {
				$0 = -24;
			} else {
				$0 = 24;
			}
		} else {
			$0 = 0;
		}
		this.pixel_y = $0;
		this.panel_open = 1;
		yield* this.update_icon();
	}
	if (!f.args[2] && !this.device && this.device_type) {
		this.device = (yield* new_(this.device_type, this));
	}
	this.check_access(null);
	if (!(rt.len(f, this.req_access) || rt.len(f, this.req_one_access))) return f.dot;
	this.board = (yield* new_(T("/obj/item/weapon/electronics/airlock"), this));
	if (rt.len(f, this.req_access)) {
		this.board.accesses = this.req_access;
	} else {
		this.board.one_access = 1;
		this.board.accesses = this.req_one_access;
	}
	return f.dot;
}, true, { args: ["loc", "ndir", "built"] });

// buttons.dm:45
rt.def("/obj/machinery/button/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (this.panel_open) {
		this.icon_state = "button-open";
		if (this.device) {
			this.add_overlay("button-device");
		}
		if (this.board) {
			this.add_overlay("button-board");
		}
	} else if (rt.bitAnd(this.stat, 3)) {
		this.icon_state = `${this.skin}-p`;
	} else {
		this.icon_state = this.skin;
	}
	return f.dot;
});

// buttons.dm:60
rt.def("/obj/machinery/button/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.panel_open || (yield* this.allowed(user))) {
			this.default_deconstruction_screwdriver(user, "button-open", `${this.skin}`, W);
			yield* this.update_icon();
		} else {
			to_chat(user, "<span class='danger'>Maintenance Access Denied</span>");
			flick(`${this.skin}-denied`, this);
		}
		return f.dot;
	}
	if (this.panel_open) {
		if (!this.device && rt.istype(W, T("/obj/item/device/assembly"))) {
			if (!(yield* user.transferItemToLoc(W, this))) {
				to_chat(user, fmt("<span class='warning'>＄！ is stuck to you!</span>", [W]));
				return f.dot;
			}
			this.device = W;
			to_chat(user, `<span class='notice'>You add ${W} to the button.</span>`);
		}
		if (!this.board && rt.istype(W, T("/obj/item/weapon/electronics/airlock"))) {
			if (!(yield* user.transferItemToLoc(W, this))) {
				to_chat(user, fmt("<span class='warning'>＄！ is stuck to you!</span>", [W]));
				return f.dot;
			}
			this.board = W;
			if (this.board.one_access) {
				this.req_one_access = this.board.accesses;
			} else {
				this.req_access = this.board.accesses;
			}
			to_chat(user, `<span class='notice'>You add ${W} to the button.</span>`);
		}
		if (!this.device && !this.board && rt.istype(W, T("/obj/item/weapon/wrench"))) {
			to_chat(user, "<span class='notice'>You start unsecuring the button frame...</span>");
			playsound(this.loc, W.usesound, 50, 1);
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				to_chat(user, "<span class='notice'>You unsecure the button frame.</span>");
				this.transfer_fingerprints_to((yield* new_(T("/obj/item/wallframe/button"), rt.getStep(f, this, 0))));
				playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
				yield* qdel(this);
			}
		}
		yield* this.update_icon();
		return f.dot;
	}
	if (user.a_intent != "harm" && !rt.bitAnd(W.flags, NOBLUDGEON)) {
		return (yield* this.attack_hand(user));
	}
	return (yield* parent_proc());
}, true);

// buttons.dm:106
rt.def("/obj/machinery/button/proc/emag_act", function emag_act(f: Frame, user: Value) {
	this.req_access = list();
	this.req_one_access = list();
	playsound(this.loc, "sparks", 100, 1);
	return f.dot;
});

// buttons.dm:111
rt.def("/obj/machinery/button/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	if (this.panel_open) return f.dot;
	return (yield* this.attack_hand(user));
}, true);

// buttons.dm:115
rt.def("/obj/machinery/button/proc/setup_device", function setup_device(f: Frame) {
	let A: Value = null;
	if (this.id && rt.istype(this.device, T("/obj/item/device/assembly/control"))) {
		(A = this.device).id = this.id;
	}
	this.initialized_button = 1;
	return f.dot;
});

// buttons.dm:121
rt.def("/obj/machinery/button/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!this.initialized_button) {
		yield* this.setup_device();
	}
	yield* this.add_fingerprint(user);
	if (this.panel_open) {
		if (this.device || this.board) {
			if (this.device) {
				this.device.loc = rt.getStep(f, this, 0);
				this.device = null;
			}
			if (this.board) {
				this.board.loc = rt.getStep(f, this, 0);
				this.req_access = list();
				this.req_one_access = list();
				this.board = null;
			}
			yield* this.update_icon();
			to_chat(user, "<span class='notice'>You remove electronics from the button frame.</span>");
		} else {
			if (this.skin == "doorctrl") {
				this.skin = "launcher";
			} else {
				this.skin = "doorctrl";
			}
			to_chat(user, "<span class='notice'>You change the button frame's front panel.</span>");
		}
		return f.dot;
	}
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (this.device && this.device.next_activate > rt.worldTime(f)) {
		return f.dot;
	}
	if (!(yield* this.allowed(user))) {
		to_chat(user, "<span class='danger'>Access Denied</span>");
		flick(`${this.skin}-denied`, this);
		return f.dot;
	}
	yield* this.use_power(5);
	this.icon_state = `${this.skin}1`;
	if (this.device) {
		this.device.pulsed();
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/button/proc/update_icon"))), 15);
	return f.dot;
}, true);

// buttons.dm:165
rt.def("/obj/machinery/button/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

rt.type(10779, "/obj/machinery/button/door", "/obj/machinery/button", {
	normaldoorcontrol: 0,
	specialfunctions: 1,
	name: "door button",
	desc: "A door remote control switch.",
});

// buttons.dm:176
rt.def("/obj/machinery/button/door/proc/setup_device", function* setup_device(f: Frame) {
	let A: Value = null;
	if (!this.device) {
		if (this.normaldoorcontrol) {
			this.device = (A = (yield* new_(T("/obj/item/device/assembly/control/airlock"), this)));
			A.specialfunctions = this.specialfunctions;
		} else {
			this.device = (yield* new_(T("/obj/item/device/assembly/control"), this));
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10783, "/obj/machinery/button/crematorium", "/obj/machinery/button", {
	skin: "launcher",
	device_type: rt.typePath("/obj/item/device/assembly/control/crematorium"),
	id: 1,
	name: "crematorium igniter",
	desc: "Burn baby burn!",
	icon_state: "launcher",
	req_access: null,
});

// buttons.dm:212
rt.def("/obj/machinery/button/crematorium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list();
	return f.dot;
});

rt.type(9540, "/obj/item/wallframe/button", "/obj/item/wallframe", {
	name: "button frame",
	desc: "Used for building buttons.",
	icon_state: "button",
	result_path: rt.typePath("/obj/machinery/button"),
	materials: null,
});

// buttons.dm:220
rt.def("/obj/item/wallframe/button/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 2000]);
	return f.dot;
});
