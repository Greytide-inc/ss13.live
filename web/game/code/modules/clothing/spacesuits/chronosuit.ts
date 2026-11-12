// Based on /tg/station's code/modules/clothing/spacesuits/chronosuit.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(7969, "/obj/item/clothing/head/helmet/space/chronos", "/obj/item/clothing/head/helmet/space", {
	suit: null,
	name: "Chronosuit Helmet",
	desc: "A white helmet with an opaque blue visor.",
	icon_state: "chronohelmet",
	item_state: "chronohelmet",
	slowdown: 1,
	armor: null,
	resistance_flags: 34,
});

// chronosuit.dm:7
rt.def("/obj/item/clothing/head/helmet/space/chronos/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 60, "bullet", 30, "laser", 60, "energy", 60, "bomb", 30, "bio", 90, "rad", 90, "fire", 100, "acid", 100]);
	return f.dot;
});

// chronosuit.dm:13
rt.def("/obj/item/clothing/head/helmet/space/chronos/proc/dropped", function* dropped(f: Frame) {
	if (this.suit) {
		yield* this.suit.deactivate(1, 1);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// chronosuit.dm:17
rt.def("/obj/item/clothing/head/helmet/space/chronos/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.dropped();
	return (yield* parent_proc());
}, true);

rt.type(7737, "/obj/item/clothing/suit/space/chronos", "/obj/item/clothing/suit/space", {
	chronosafe_items: null,
	hands_nodrop: null,
	helmet: null,
	camera: null,
	teleport_now: null,
	activating: 0,
	activated: 0,
	cooldowntime: 50,
	teleporting: 0,
	walker: null,
	phase_timer_id: null,
	name: "Chronosuit",
	desc: "An advanced spacesuit equipped with time-bluespace teleportation and anti-compression technology",
	icon_state: "chronosuit",
	item_state: "chronosuit",
	actions_types: null,
	armor: null,
	resistance_flags: 34,
});

// chronosuit.dm:29
rt.def("/obj/item/clothing/suit/space/chronos/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.chronosafe_items = list(T("/obj/item/weapon/chrono_eraser"), T("/obj/item/weapon/gun/energy/chrono_gun"));

	this.hands_nodrop = list();

	this.teleport_now = (yield* new_(T("/datum/action/innate/chrono_teleport")));

	this.actions_types = list(T("/datum/action/item_action/toggle"));
	this.armor = rt.alist(f, ["melee", 60, "bullet", 60, "laser", 60, "energy", 60, "bomb", 30, "bio", 90, "rad", 90, "fire", 100, "acid", 1000]);
	return f.dot;
}, true);

// chronosuit.dm:41
rt.def("/obj/item/clothing/suit/space/chronos/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.teleport_now.chronosuit = this;
	this.teleport_now.target = this;
	return f.dot;
}, true);

// chronosuit.dm:47
rt.def("/obj/item/clothing/suit/space/chronos/proc/new_camera", function* new_camera(f: Frame, user: Value) {
	if (this.camera) {
		yield* qdel(this.camera);
	}
	this.camera = (yield* new_(T("/obj/effect/chronos_cam"), user));
	this.camera.holder = user;
	this.camera.chronosuit = this;
	user.remote_control = this.camera;
	return f.dot;
}, true);

// chronosuit.dm:54
rt.def("/obj/item/clothing/suit/space/chronos/proc/ui_action_click", function* ui_action_click(f: Frame) {
	if (!(this.cooldown <= rt.worldTime(f) && !this.teleporting && !this.activating)) return f.dot;
	if (!this.activated) {
		yield* this.activate();
	} else {
		yield* this.deactivate();
	}
	return f.dot;
}, true);

// chronosuit.dm:62
rt.def("/obj/item/clothing/suit/space/chronos/proc/dropped", function* dropped(f: Frame) {
	// tg_js: losing the suit switches it off, mid time-walk too (tg's deactivate() refused during a walk, so a dropped
	// suit stayed on and its helmet stayed stuck to the head).
	if (this.activated) {
		yield* this.deactivate(1);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// chronosuit.dm:66
rt.def("/obj/item/clothing/suit/space/chronos/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.dropped();
	return (yield* parent_proc());
}, true);

// chronosuit.dm:71
rt.def("/obj/item/clothing/suit/space/chronos/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let user: Value = this.loc;
	if (severity === 1) {
		if (this.activated && user && rt.istype(user, T("/mob/living/carbon/human")) && user.wear_suit == this) {
			to_chat(user, "<span class='danger'>E:FATAL:RAM_READ_FAIL\nE:FATAL:STACK_EMPTY\nE:FATAL:READ_NULL_POINT\nE:FATAL:PWR_BUS_OVERLOAD</span>");
			to_chat(user, `<span class='userdanger'>An electromagnetic pulse disrupts your ${this.name} and violently tears you out of time-bluespace!</span>`);
			yield* user.emote("scream");
		}
		yield* this.deactivate(1, 1);
	}
	return f.dot;
}, true);

// chronosuit.dm:80
rt.def("/obj/item/clothing/suit/space/chronos/proc/finish_chronowalk", function* finish_chronowalk(f: Frame, user: Value, to_turf: Value) {
	let I: Value = null;
	// tg_js: the one way a time-walk ends (each phase, deactivate, a lost suit or wearer). The suit is idle or walking
	// (`teleporting`, with `walker` the mob mid-walk); this sets it idle first, whoever is left to restore (tg returned
	// before clearing `teleporting` when the wearer was gone, so the suit never switched on again).
	if (!user) {
		user = this.walker || this.loc;
	}
	if (this.phase_timer_id) {
		yield* deltimer(this.phase_timer_id);
		this.phase_timer_id = 0;
	}
	this.teleporting = 0;
	this.walker = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) return f.dot;
	if (to_turf && user.wear_suit == this) {
		yield* user.forceMove(to_turf);
	}
	yield* user.SetStun(0);
	user.next_move = 1;
	user.alpha = 255;
	user.update_atom_colour();
	user.animate_movement = 1;
	user.notransform = 0;
	user.anchored = 0;
	for (I of each(user.held_items, T("/obj/item"))) {
		if (rt.isIn(f, I, this.hands_nodrop)) {
			(rt.modField(f, I, "flags", 16777213, rt.bitAnd));
		}
	}
	if (this.camera) {
		yield* this.camera.remove_target_ui();
		this.camera.loc = user;
	}
	yield* this.teleport_now.UpdateButtonIcon();
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { path: "/turf" }] });

// chronosuit.dm:106
rt.def("/obj/item/clothing/suit/space/chronos/proc/chronowalk", function* chronowalk(f: Frame, location: Value) {
	let slot: Value = null, slot_item: Value = null, exposed_item: Value = null, exposed_I: Value = null, I: Value = null;
	let user: Value = this.loc;
	if (!(this.activated && !this.teleporting && user && rt.istype(user, T("/mob/living/carbon/human")) && location && user.loc && location.loc && user.wear_suit == this && user.stat == 0)) return f.dot;
	this.teleporting = 1;
	this.walker = user;
	let from_turf: Value = rt.getStep(f, user, 0);
	let to_turf: Value = rt.getStep(f, location, 0);
	let distance: Value = cheap_hypotenuse(from_turf.x, from_turf.y, to_turf.x, to_turf.y);
	let phase_in_ds: Value = distance * 2;
	if (this.camera) {
		yield* this.camera.remove_target_ui();
	}
	yield* this.teleport_now.UpdateButtonIcon();
	let nonsafe_slots: Value = list(slot_belt, slot_back);
	let exposed: Value = list();
	for (slot of each(nonsafe_slots)) {
		exposed += (slot_item = user.get_item_by_slot(slot));
	}
	exposed += user.held_items;
	for (exposed_item of each(exposed)) {
		if ((exposed_I = exposed_item) && !rt.isIn(f, exposed_I.type, this.chronosafe_items) && (yield* user.dropItemToGround(exposed_I))) {
			to_chat(user, `<span class='notice'>Your ${exposed_I.name} got left behind.</span>`);
		}
	}
	yield* user.ExtinguishMob();
	this.hands_nodrop = list();
	for (I of each(user.held_items, T("/obj/item"))) {
		if (!rt.bitAnd(I.flags, NODROP)) {
			this.hands_nodrop += I;
			(rt.modField(f, I, "flags", NODROP, rt.bitOr));
		}
	}
	user.animate_movement = 0;
	user.changeNext_move(8 + phase_in_ds);
	user.notransform = 1;
	user.anchored = 1;
	yield* user.Stun(1e+31);
	rt.op(f, "Animate", [2, 6], [null, user, "color", "#00ccee", "time", 3]);
	this.phase_timer_id = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/chronos/proc/phase_2"), user, to_turf, phase_in_ds)), 3, 8));
	return f.dot;
}, true);

// chronosuit.dm:146
rt.def("/obj/item/clothing/suit/space/chronos/proc/phase_2", function* phase_2(f: Frame, user: Value, to_turf: Value, phase_in_ds: Value) {
	if (this.teleporting && this.activated && user) {
		rt.op(f, "Animate", [2, 6], [null, user, "alpha", 0, "time", 2]);
		this.phase_timer_id = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/chronos/proc/phase_3"), user, to_turf, phase_in_ds)), 2, 8));
	} else {
		yield* this.finish_chronowalk(user, to_turf);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { path: "/turf" }, {  }] });

// chronosuit.dm:153
rt.def("/obj/item/clothing/suit/space/chronos/proc/phase_3", function* phase_3(f: Frame, user: Value, to_turf: Value, phase_in_ds: Value) {
	if (this.teleporting && this.activated && user) {
		yield* user.forceMove(to_turf);
		rt.op(f, "Animate", [2, 6], [null, user, "alpha", 255, "time", phase_in_ds]);
		this.phase_timer_id = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/chronos/proc/phase_4"), user, to_turf)), phase_in_ds, 8));
	} else {
		yield* this.finish_chronowalk(user, to_turf);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { path: "/turf" }, {  }] });

// chronosuit.dm:161
rt.def("/obj/item/clothing/suit/space/chronos/proc/phase_4", function* phase_4(f: Frame, user: Value, to_turf: Value) {
	if (this.teleporting && this.activated && user) {
		rt.op(f, "Animate", [2, 6], [null, user, "color", "#ffffff", "time", 3]);
		this.phase_timer_id = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/chronos/proc/finish_chronowalk"), user, to_turf)), 3, 8));
	} else {
		yield* this.finish_chronowalk(user, to_turf);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { path: "/turf" }] });

// chronosuit.dm:170
rt.def("/obj/item/clothing/suit/space/chronos/proc/process", function* process(f: Frame) {
	let user: Value = null;
	if (this.activated) {
		if ((user = this.loc) && rt.istype(user, T("/mob/living/carbon/human")) && user.wear_suit == this) {
			if (this.camera && user.remote_control == this.camera) {
				if (!this.teleporting) {
					if (this.camera.loc != user && (this.camera.x != user.x || this.camera.y != user.y || this.camera.z != user.z)) {
						if (this.camera.phase_time <= rt.worldTime(f)) {
							yield* this.chronowalk(this.camera);
						}
					} else {
						yield* this.camera.remove_target_ui();
					}
				}
			} else {
				yield* this.new_camera(user);
			}
		}
	} else {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	return f.dot;
}, true, { waitfor: false });

// chronosuit.dm:184
rt.def("/obj/item/clothing/suit/space/chronos/proc/activate", function* activate(f: Frame) {
	let user: Value = null;
	if (!(!this.activating && !this.activated && !this.teleporting)) return f.dot;
	this.activating = 1;
	if ((user = this.loc) && rt.istype(user, T("/mob/living/carbon/human")) && user.wear_suit == this) {
		to_chat(user, "\nChronosuitMK4 login: root");
		to_chat(user, "Password:\n");
		to_chat(user, "root@ChronosuitMK4# chronowalk4 --start\n");
		if (user.head && rt.istype(user.head, T("/obj/item/clothing/head/helmet/space/chronos"))) {
			to_chat(user, "[ <span style='color: #00ff00;'>ok</span> ] Mounting /dev/helm");
			this.helmet = user.head;
			(rt.modField(f, this.helmet, "flags", NODROP, rt.bitOr));
			this.helmet.suit = this;
			(rt.modField(f, this, "flags", NODROP, rt.bitOr));
			to_chat(user, "[ <span style='color: #00ff00;'>ok</span> ] Starting brainwave scanner");
			to_chat(user, "[ <span style='color: #00ff00;'>ok</span> ] Starting ui display driver");
			to_chat(user, "[ <span style='color: #00ff00;'>ok</span> ] Initializing chronowalk4-view");
			yield* this.new_camera(user);
			if (!this.isprocessing) {
				this.isprocessing = 1;
				GLOB.SSobj.processing += this;
			}
			this.activated = 1;
		} else {
			to_chat(user, "[ <span style='color: #ff0000;'>fail</span> ] Mounting /dev/helm");
			to_chat(user, "<span style='color: #ff0000;'><b>FATAL: </b>Unable to locate /dev/helm. <b>Aborting...</b>");
		}
		yield* this.teleport_now.Grant(user);
	}
	this.cooldown = rt.worldTime(f) + this.cooldowntime;
	this.activating = 0;
	return f.dot;
}, true);

// chronosuit.dm:211
rt.def("/obj/item/clothing/suit/space/chronos/proc/deactivate", function* deactivate(f: Frame, force: Value, silent: Value) {
	force ??= 0;
	silent ??= 0;
	if (!(this.activated && (!this.teleporting || force))) return f.dot;
	this.activating = 1;
	let user: Value = this.loc;
	let hard_landing: Value = (this.teleporting && force);
	(rt.modField(f, this, "flags", 16777213, rt.bitAnd));
	this.cooldown = rt.worldTime(f) + this.cooldowntime * 1.5;
	this.activated = 0;
	this.activating = 0;
	yield* this.finish_chronowalk();
	if (user && rt.istype(user, T("/mob/living/carbon/human"))) {
		yield* this.teleport_now.Remove(user);
		if (user.wear_suit == this) {
			if (hard_landing) {
				yield* user.electrocute_act(35, this, { safety: 1 });
				yield* user.Knockdown(200);
			}
			if (!silent) {
				to_chat(user, "\nroot@ChronosuitMK4# chronowalk4 --stop\n");
				if (this.camera) {
					to_chat(user, "[ <span style='color: #ff5500;'>ok</span> ] Sending TERM signal to chronowalk4-view");
				}
				if (this.helmet) {
					to_chat(user, "[ <span style='color: #ff5500;'>ok</span> ] Stopping ui display driver");
					to_chat(user, "[ <span style='color: #ff5500;'>ok</span> ] Stopping brainwave scanner");
					to_chat(user, "[ <span style='color: #ff5500;'>ok</span> ] Unmounting /dev/helmet");
				}
				to_chat(user, "logout");
			}
		}
	}
	if (this.helmet) {
		(rt.modField(f, this.helmet, "flags", 16777213, rt.bitAnd));
		this.helmet.suit = null;
		this.helmet = null;
	}
	if (!this.camera) return f.dot;
	yield* qdel(this.camera);
	return f.dot;
}, true);

rt.type(12047, "/obj/effect/chronos_cam", "/obj/effect", {
	holder: null,
	phase_time: 0,
	phase_time_length: 3,
	target_ui: null,
	chronosuit: null,
	anchored: 1,
	name: "Chronosuit View",
	density: 0,
	invisibility: 101,
	opacity: 0,
	mouse_opacity: 0,
});

// chronosuit.dm:256
rt.def("/obj/effect/chronos_cam/proc/create_target_ui", function* create_target_ui(f: Frame) {
	if (!(this.holder && this.holder.client && this.chronosuit)) return f.dot;
	if (this.target_ui) {
		yield* this.remove_target_ui();
	}
	this.target_ui = (yield* new_(T("/obj/screen/chronos_target"), null, this.holder));
	this.holder.client.screen += this.target_ui;
	return f.dot;
}, true);

// chronosuit.dm:264
rt.def("/obj/effect/chronos_cam/proc/remove_target_ui", function* remove_target_ui(f: Frame) {
	if (!this.target_ui) return f.dot;
	yield* qdel(this.target_ui);
	this.target_ui = null;
	return f.dot;
}, true);

// chronosuit.dm:269
rt.def("/obj/effect/chronos_cam/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	let step: Value = null;
	if (this.holder) {
		if (user == this.holder) {
			if (this.loc == user) {
				this.loc = rt.getStep(f, user, 0);
			}
			if (user.client && user.client.eye != this) {
				this.loc = rt.getStep(f, user, 0);
				yield* user.reset_perspective(this);
				yield* user.set_machine(this);
			}
			if (step = rt.getStep(f, this, direction)) {
				if (step.x <= TRANSITIONEDGE || step.x >= rt.world().maxx - TRANSITIONEDGE - 1 || step.y <= TRANSITIONEDGE || step.y >= rt.world().maxy - TRANSITIONEDGE - 1) {
					if (!(yield* this.Move(step))) {
						this.loc = step;
					}
				} else {
					this.loc = step;
				}
				if (this.x == this.holder.x && this.y == this.holder.y && this.z == this.holder.z) {
					yield* this.remove_target_ui();
					this.loc = user;
				} else if (!this.target_ui) {
					yield* this.create_target_ui();
				}
				this.phase_time = rt.worldTime(f) + this.phase_time_length;
			}
		}
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true);

// chronosuit.dm:293
rt.def("/obj/effect/chronos_cam/proc/check_eye", function* check_eye(f: Frame, user: Value) {
	if (user == this.holder) return f.dot;
	yield* user.unset_machine();
	return f.dot;
}, true);

// chronosuit.dm:297
rt.def("/obj/effect/chronos_cam/proc/on_unset_machine", function* on_unset_machine(f: Frame, user: Value) {
	yield* user.reset_perspective(null);
	return f.dot;
}, true);

// chronosuit.dm:301
rt.def("/obj/effect/chronos_cam/proc/Destroy", function* Destroy(f: Frame) {
	if (this.holder) {
		if (this.holder.remote_control == this) {
			this.holder.remote_control = null;
		}
		if (this.holder.client && this.holder.client.eye == this) {
			yield* this.holder.unset_machine();
		}
	}
	return (yield* parent_proc());
}, true);

rt.type(11206, "/obj/screen/chronos_target", "/obj/screen", {
	name: "target display",
	screen_loc: "CENTER,CENTER",
	color: "#ff3311",
	blend_mode: 3,
});

// chronosuit.dm:315
rt.def("/obj/screen/chronos_target/proc/New", function* New(f: Frame, loc: Value, user: Value) {
	let user_icon: Value = null;
	if (user) {
		this.icon = (user_icon = getFlatIcon(user));
		this.transform = user.transform;
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true);

rt.type(137, "/datum/action/innate/chrono_teleport", "/datum/action/innate", {
	chronosuit: null,
	name: "Teleport Now",
	button_icon_state: "chrono_phase",
	check_flags: 8,
});

// chronosuit.dm:328
rt.def("/datum/action/innate/chrono_teleport/proc/IsAvailable", function IsAvailable(f: Frame) {
	return (((this.chronosuit && this.chronosuit.activated) && this.chronosuit.camera) && (!this.chronosuit.teleporting ? 1 : 0));
});

// chronosuit.dm:331
rt.def("/datum/action/innate/chrono_teleport/proc/Activate", function* Activate(f: Frame) {
	if (!(yield* this.IsAvailable())) return f.dot;
	if (!this.chronosuit.camera) return f.dot;
	yield* this.chronosuit.chronowalk(this.chronosuit.camera);
	return f.dot;
}, true);
