// Based on /tg/station's code/game/gamemodes/nuclear/pinpointer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(6688, "/obj/item/weapon/pinpointer", "/obj/item/weapon", {
	active: 0,
	target: null,
	constant_target: null,
	target_x: 0,
	target_y: 0,
	minimum_range: 0,
	nuke_warning: 0,
	mode: 1,
	flags: 64,
	throw_speed: 3,
	throw_range: 7,
	name: "pinpointer",
	desc: "A handheld tracking device that locks onto certain signals.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "pinoff",
	slot_flags: 512,
	w_class: 2,
	item_state: "electronic",
	materials: null,
	resistance_flags: 99,
});

// pinpointer.dm:13
rt.def("/obj/item/weapon/pinpointer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 500, "$glass", 250]);
	return f.dot;
});

// pinpointer.dm:25
rt.def("/obj/item/weapon/pinpointer/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	GLOB.pinpointer_list += this;
	return f.dot;
}, true);

// pinpointer.dm:29
rt.def("/obj/item/weapon/pinpointer/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	GLOB.pinpointer_list -= this;
	return (yield* parent_proc());
}, true);

// pinpointer.dm:34
rt.def("/obj/item/weapon/pinpointer/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $2: any;
	this.active = (!this.active ? 1 : 0);
	let $0: any = user;
	let $1: any = user;
	if (this.active) {

		$2 = "";
	} else {
		$2 = "de";
	}
	$1 = `<span class='notice'>${$1} ${$2}activates their pinpointer.</span>`;
	$0.visible_message($1, `<span class='notice'>You ${this.active ? "" : "de"}activate your pinpointer.</span>`);
	playsound(user, rt.rsc("sound/items/screwdriver2.ogg"), 50, 1);
	this.icon_state = `pin${this.active ? "onnull" : "off"}`;
	if (this.active) {
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSfastprocess.processing += this;
		}
	} else {
		this.target = null;
		this.isprocessing = 0;
		GLOB.SSfastprocess.processing -= this;
	}
	return f.dot;
});

// pinpointer.dm:45
rt.def("/obj/item/weapon/pinpointer/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.mode != TRACK_ATOM) {
		return (yield* parent_proc());
	}
	user.visible_message(`<span class='notice'>${user} tunes ${this} to ${I}.</span>`, `<span class='notice'>You fine-tune ${this}'s tracking to track ${I}.</span>`);
	playsound(this, rt.rsc("sound/machines/click.ogg"), 50, 1);
	this.constant_target = I;
	return f.dot;
}, true);

// pinpointer.dm:52
rt.def("/obj/item/weapon/pinpointer/proc/examine", function examine(f: Frame, user: Value) {
	let bomb: Value = null;
	let $e: any;
	parent_proc();
	let msg: Value = "Its tracking indicator reads ";
	let $0: any = this.mode;
	if ($0 === TRACK_NUKE_DISK) {
		msg += "\"nuclear_disk\".";
	} else if ($0 === TRACK_MALF_AI) {
		msg += "\"01000001 01001001\".";
	} else if ($0 === TRACK_INFILTRATOR) {
		msg += "\"vasvygengbefuvc\".";
	} else if ($0 === TRACK_OPERATIVES) {
		if (this.target) {
			$0 = `Operative ${this.target}`;
		} else {
			$0 = "friends";
		}
		msg += `"${$0}".`;
	} else if ($0 === TRACK_ATOM) {
		msg += `"${rt.initial(f, this.constant_target, "name")}".`;
	} else if ($0 === TRACK_COORDINATES) {
		msg += `"(${this.target_x}, ${this.target_y})".`;
	} else {
		msg = "Its tracking indicator is blank.";
	}
	to_chat(user, msg);
	for (bomb of each(GLOB.machines, T("/obj/machinery/nuclearbomb"))) {
		if (bomb.timing) {
			to_chat(user, `Extreme danger. Arming signal detected. Time remaining: ${bomb.get_time_left()}`);
		}
	}
	return f.dot;
}, false);

// pinpointer.dm:75
rt.def("/obj/item/weapon/pinpointer/proc/process", function* process(f: Frame) {
	if (!this.active) {
		this.isprocessing = 0;
		GLOB.SSfastprocess.processing -= this;
		return f.dot;
	}
	this.scan_for_target();
	this.point_to_target();
	this.my_god_jc_a_bomb();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/pinpointer/proc/refresh_target"))), 50, 1);
	return f.dot;
}, true, { waitfor: false });

// pinpointer.dm:85
rt.def("/obj/item/weapon/pinpointer/proc/scan_for_target", function scan_for_target(f: Frame) {
	let L: Value = null, N: Value = null, V: Value = null, A: Value = null, possible_targets: Value = null, here: Value = null, V_2: Value = null, M: Value = null, closest_operative: Value = null, _T: Value = null;
	let $e: any;
	if (this.target) {
		if (rt.istype(this.target, T("/mob/living"))) {
			if ((L = this.target).stat == 2) {
				this.target = null;
			}
		}
		return f.dot;
	}
	if (this.mode === 1) {
		this.target = (N = rt.locateIn(f, T("/obj/item/weapon/disk/nuclear"), rt.world()));
	} else if (this.mode === 2) {
		for (V of each(GLOB.ai_list)) {
			if ((A = V).nuking) {
				this.target = A;
			}
		}
		V = null;
		for (V of each(GLOB.apcs_list)) {
			if ((A = V).malfhack && A.occupier) {
				this.target = A;
			}
		}
	} else if (this.mode === 3) {
		this.target = GLOB.SSshuttle.getShuttle("syndicate");
	} else if (this.mode === 4) {
		possible_targets = list();
		here = rt.getStep(f, this, 0);
		for (V_2 of each(GLOB.SSticker.mode.syndicates)) {
			if ((M = V_2).current && M.current.stat != 2) {
				(possible_targets = rt.modify(possible_targets, M.current, rt.bitOr));
			}
		}
		if (closest_operative = get_closest_atom(T("/mob/living/carbon/human"), possible_targets, here)) {
			this.target = closest_operative;
		}
	} else if (this.mode === 5) {
		if (this.constant_target) {
			this.target = this.constant_target;
		}
	} else if (this.mode === 6) {
		_T = rt.getStep(f, this, 0);
		this.target = rt.locate(this.target_x, this.target_y, _T.z);
	}
	return f.dot;
});

// pinpointer.dm:123
rt.def("/obj/item/weapon/pinpointer/proc/point_to_target", function point_to_target(f: Frame) {
	let $0: any;
	if (!this.active) {
		return f.dot;
	}
	if (!this.target || this.mode == TRACK_ATOM && !this.constant_target) {
		this.icon_state = `pinon${this.nuke_warning ? "alert" : ""}null`;
		return f.dot;
	}
	let here: Value = rt.getStep(f, this, 0);
	let there: Value = rt.getStep(f, this.target, 0);
	if (here.z != there.z) {
		this.icon_state = `pinon${this.nuke_warning ? "alert" : ""}null`;
		return f.dot;
	}
	if (get_dist_euclidian(here, there) <= this.minimum_range) {
		this.icon_state = `pinon${this.nuke_warning ? "alert" : ""}direct`;
	} else {
		this.setDir(rt.getDir(f, here, there));
		$0 = get_dist(here, there);
		if (rt.inRange($0, 1, 8)) {
			if (this.nuke_warning) {
				$0 = "alert";
			} else {
				$0 = "close";
			}
			this.icon_state = `pinon${$0}`;
		} else if (rt.inRange($0, 9, 16)) {
			if (this.nuke_warning) {
				$0 = "alert";
			} else {
				$0 = "medium";
			}
			this.icon_state = `pinon${$0}`;
		} else if (rt.inRange($0, 16, 1e+31)) {
			this.icon_state = `pinon${this.nuke_warning ? "alert" : "far"}`;
		}
	}
	return f.dot;
});

// pinpointer.dm:146
rt.def("/obj/item/weapon/pinpointer/proc/my_god_jc_a_bomb", function my_god_jc_a_bomb(f: Frame) {
	let bomb: Value = null, L: Value = null;
	for (bomb of each(GLOB.nuke_list, T("/obj/machinery/nuclearbomb"))) {
		if (bomb.timing) {
			if (!this.nuke_warning) {
				this.nuke_warning = 1;
				playsound(this, rt.rsc("sound/items/nuke_toy_lowpower.ogg"), 50, 0);
				if (rt.istype(this.loc, T("/mob/living"))) {
					to_chat((L = this.loc), `<span class='userdanger'>Your ${this.name} vibrates and lets out a tinny alarm. Uh oh.</span>`);
				}
			}
		}
	}
	return f.dot;
});

// pinpointer.dm:156
rt.def("/obj/item/weapon/pinpointer/proc/switch_mode_to", function switch_mode_to(f: Frame, new_mode: Value) {
	let L: Value = null;
	if (rt.istype(this.loc, T("/mob/living"))) {
		to_chat((L = this.loc), `<span class='userdanger'>Your ${this.name} beeps as it reconfigures its tracking algorithms.</span>`);
		playsound(L, rt.rsc("sound/machines/triple_beep.ogg"), 50, 1);
	}
	this.mode = new_mode;
	this.target = null;
	return f.dot;
});

// pinpointer.dm:164
rt.def("/obj/item/weapon/pinpointer/proc/refresh_target", function refresh_target(f: Frame) {
	this.target = null;
	return f.dot;
});
