// Based on /tg/station's code/modules/mob/living/silicon/robot/robot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, subtract, fmt } = rt;


rt.type(4835, "/mob/living/silicon/robot", "/mob/living/silicon", {
	custom_name: "",
	braintype: "Cyborg",
	robot_suit: null,
	mmi: null,
	shell: 0,
	deployed: 0,
	mainframe: null,
	undeployment_action: null,
	inv1: null,
	inv2: null,
	inv3: null,
	lamp_button: null,
	thruster_button: null,
	hands: null,
	shown_robot_modules: 0,
	robot_modules_background: null,
	module: null,
	module_active: null,
	eye_lights: null,
	connected_ai: null,
	cell: null,
	camera: null,
	opened: 0,
	emagged: 0,
	emag_cooldown: 0,
	wiresexposed: 0,
	ident: 0,
	locked: 1,
	alarms: null,
	speed: 0,
	magpulse: 0,
	ionpulse: 0,
	ionpulse_on: 0,
	ion_trail: null,
	low_power_mode: 0,
	spark_system: null,
	lawupdate: 1,
	scrambledcodes: 0,
	lockcharge: null,
	toner: 0,
	tonermax: 40,
	lamp_max: 10,
	lamp_intensity: 0,
	lamp_recharging: 0,
	sight_mode: 0,
	updating: 0,
	upgrades: null,
	hat: null,
	hat_offset: -3,
	req_access: null,
	equippable_hats: null,
	hud_possible: null,
	can_buckle: 1,
	buckle_lying: 0,
	name: "Cyborg",
	real_name: "Cyborg",
	icon: rt.rsc("icons/mob/robots.dmi"),
	icon_state: "robot",
	maxHealth: 100,
	health: 100,
	macro_default: "robot-default",
	macro_hotkeys: "robot-hotkeys",
	bubble_icon: "robot",
	designation: "Default",
	has_limbs: 1,
	held_items: null,
	can_ride_typecache: null,
});

// robot.dm:22
rt.def("/mob/living/silicon/robot/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.undeployment_action = (yield* new_(T("/datum/action/innate/undeployment")));

	this.alarms = rt.alist(f, ["Motion", list(), "Fire", list(), "Atmosphere", list(), "Power", list(), "Camera", list(), "Burglar", list()]);
	this.hud_possible = list("15", "8", "9", "10", "13");

	this.upgrades = list();

	this.held_items = list(null, null, null);

	this.req_access = list(29);

	this.equippable_hats = list(T("/obj/item/clothing/head/caphat"), T("/obj/item/clothing/head/hardhat/cakehat"), T("/obj/item/clothing/head/centhat"), T("/obj/item/clothing/head/HoS"), T("/obj/item/clothing/head/hopcap"), T("/obj/item/clothing/head/wizard"), T("/obj/item/clothing/head/nursehat"), T("/obj/item/clothing/head/sombrero"), T("/obj/item/clothing/head/witchunter_hat"));

	this.can_ride_typecache = list(T("/mob/living/carbon/human"));
	return f.dot;
}, true);

// robot.dm:104
rt.def("/mob/living/silicon/robot/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	this.spark_system = (yield* new_(T("/datum/effect_system/spark_spread")));
	yield* this.spark_system.set_up(5, 0, this);
	yield* this.spark_system.attach(this);
	this.wires = (yield* new_(T("/datum/wires/robot"), this));
	this.robot_modules_background = (yield* new_(T("/obj/screen")));
	this.robot_modules_background.icon_state = "block";
	this.robot_modules_background.layer = HUD_LAYER;
	this.robot_modules_background.plane = HUD_PLANE;
	this.ident = rand(1, 999);
	if (!this.cell) {
		this.cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell"), this));
		this.cell.maxcharge = 7500;
		this.cell.charge = 7500;
	}
	if (this.lawupdate) {
		yield* this.make_laws();
		if (!(yield* this.TryConnectToAI())) {
			this.lawupdate = 0;
		}
	}
	this.radio = (yield* new_(T("/obj/item/device/radio/borg"), this));
	if (!this.scrambledcodes && !this.camera) {
		this.camera = (yield* new_(T("/obj/machinery/camera"), this));
		this.camera.c_tag = this.real_name;
		this.camera.network = list("SS13");
		if (this.wires.is_cut("Camera")) {
			this.camera.status = 0;
		}
	}
	this.module = (yield* new_(T("/obj/item/weapon/robot_module"), this));
	yield* this.module.rebuild_modules();
	yield* this.update_icons();
	yield* parent_proc();
	if (this.shell) {
		yield* this.make_shell();
	} else if (!this.mmi || !this.mmi.brainmob) {
		this.mmi = (yield* new_(T("/obj/item/device/mmi"), this));
		this.mmi.brain = (yield* new_(T("/obj/item/organ/brain"), this.mmi));
		this.mmi.brain.name = `${this.real_name}'s brain`;
		this.mmi.icon_state = "mmi_full";
		this.mmi.name = `Man-Machine Interface: ${this.real_name}`;
		this.mmi.brainmob = (yield* new_(T("/mob/living/brain"), this.mmi));
		this.mmi.brainmob.name = this.real_name;
		this.mmi.brainmob.real_name = this.real_name;
		this.mmi.brainmob.container = this.mmi;
	}
	this.updatename();
	this.equippable_hats = typecacheof(this.equippable_hats);
	playsound(this.loc, rt.rsc("sound/voice/liveagain.ogg"), 75, 1);
	this.aicamera = (yield* new_(T("/obj/item/device/camera/siliconcam/robot_camera"), this));
	this.toner = this.tonermax;
	this.diag_hud_set_borgcell();
	return f.dot;
}, true);

// robot.dm:166
rt.def("/mob/living/silicon/robot/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	if (this.mmi && this.mind) {
		if (_T = rt.getStep(f, this.loc, 0)) {
			this.mmi.loc = _T;
		}
		if (this.mmi.brainmob) {
			if (this.mmi.brainmob.stat == 2) {
				this.mmi.brainmob.stat = 0;
				GLOB.dead_mob_list -= this.mmi.brainmob;
				GLOB.living_mob_list += this.mmi.brainmob;
			}
			yield* this.mind.transfer_to(this.mmi.brainmob);
			yield* this.mmi.update_icon();
		} else {
			to_chat(this, "<span class='boldannounce'>Oops! Something went very wrong, your MMI was unable to receive your mind. You have been ghosted. Please make a bug report so we can fix this bug.</span>");
			yield* this.ghostize();
			stack_trace("Borg MMI lacked a brainmob");
		}
		this.mmi = null;
	}
	if (this.connected_ai) {
		this.connected_ai.connected_robots -= this;
	}
	if (this.shell) {
		GLOB.available_ai_shells -= this;
	}
	yield* qdel(this.wires);
	yield* qdel(this.module);
	yield* qdel(this.eye_lights);
	this.wires = null;
	this.module = null;
	this.eye_lights = null;
	this.camera = null;
	this.cell = null;
	return (yield* parent_proc());
}, true);

// robot.dm:198
rt.def("/mob/living/silicon/robot/proc/pick_module", function* pick_module(f: Frame) {
	let input_module: Value = null;
	if (this.module.type != T("/obj/item/weapon/robot_module")) {
		return f.dot;
	}
	if (this.wires.is_cut("Reset Module")) {
		to_chat(this, "<span class='userdanger'>ERROR: Module installer reply timeout. Please check internal connections.</span>");
		return f.dot;
	}
	let modulelist: Value = rt.alist(f, ["Standard", T("/obj/item/weapon/robot_module/standard"), "Engineering", T("/obj/item/weapon/robot_module/engineering"), "Medical", T("/obj/item/weapon/robot_module/medical"), "Miner", T("/obj/item/weapon/robot_module/miner"), "Janitor", T("/obj/item/weapon/robot_module/janitor"), "Service", T("/obj/item/weapon/robot_module/butler")]);
	if (!GLOB.config.forbid_peaceborg) {
		rt.setAt(modulelist, "Peacekeeper", T("/obj/item/weapon/robot_module/peacekeeper"));
	}
	if (!GLOB.config.forbid_secborg) {
		rt.setAt(modulelist, "Security", T("/obj/item/weapon/robot_module/security"));
	}
	if (!(input_module = (yield* g.op(f, "Prompt", [1], [null, null, "Robot", "Please, select a module!", modulelist]))) || this.module.type != T("/obj/item/weapon/robot_module")) {
		return f.dot;
	}
	yield* this.module.transform_to(rt.index(modulelist, input_module));
	return f.dot;
}, true);

// robot.dm:226
rt.def("/mob/living/silicon/robot/proc/updatename", function updatename(f: Frame) {
	if (this.shell) {
		return f.dot;
	}
	let changed_name: Value = "";
	if (this.custom_name) {
		changed_name = this.custom_name;
	}
	if (changed_name == "" && this.client) {
		changed_name = rt.index(this.client.prefs.custom_names, "cyborg");
	}
	if (!changed_name) {
		changed_name = this.get_standard_name();
	}
	this.real_name = changed_name;
	this.name = this.real_name;
	if (!this.camera) return f.dot;
	this.camera.c_tag = this.real_name;
	return f.dot;
});

// robot.dm:240
rt.def("/mob/living/silicon/robot/proc/get_standard_name", function get_standard_name(f: Frame) {
	return `${this.designation ? `${this.designation} ` : ""}${this.mmi.braintype}-${this.ident}`;
});

// robot.dm:245
rt.def("/mob/living/silicon/robot/verb/cmd_robot_alerts", function* cmd_robot_alerts(f: Frame) {
	if (f.usr.stat == 2) {
		to_chat(this, "<span class='userdanger'>Alert: You are dead.</span>");
		return f.dot;
	}
	yield* this.robot_alerts();
	return f.dot;
}, true, { verb: { name: "Show Alerts", category: "Robot Commands" } });

// robot.dm:254
rt.def("/mob/living/silicon/robot/verb/cmd_toggle_module", function cmd_toggle_module(f: Frame, module: Value) {
	this.toggle_module(module);
	return f.dot;
}, false, { hidden: true, verb: { name: "Toggle Module" }, argTypes: [{ type: 32 }] });

// robot.dm:259
rt.def("/mob/living/silicon/robot/verb/cmd_unequip_module", function* cmd_unequip_module(f: Frame) {
	yield* this.uneq_active();
	return f.dot;
}, true, { hidden: true, verb: { name: "Unequip Module" } });

// robot.dm:262
rt.def("/mob/living/silicon/robot/proc/robot_alerts", function* robot_alerts(f: Frame) {
	let cat: Value = null, L: Value = null, alarm: Value = null, alm: Value = null, A: Value = null, alerts: Value = null;
	let dat: Value = "";
	for (cat of each(this.alarms)) {
		dat += `<B>${cat}</B><BR>\n`;
		if (rt.len(f, (L = rt.index(this.alarms, cat)))) {
			alarm = null;
			for (alarm of each(L)) {
				alm = rt.index(L, alarm);
				A = rt.index(alm, 1);
				dat += "<NOBR>";
				dat += `-- ${A.name}`;
				dat += "</NOBR><BR>\n";
			}
		} else {
			dat += "-- All Systems Nominal<BR>\n";
		}
		dat += "<BR>\n";
	}
	(alerts = (yield* new_(T("/datum/browser"), f.usr, "robotalerts", "Current Station Alerts", 400, 410))).set_content(dat);
	yield* alerts.open();
	return f.dot;
}, true);

// robot.dm:282
rt.def("/mob/living/silicon/robot/proc/ionpulse", function* ionpulse(f: Frame) {
	if (!this.ionpulse_on) {
		return f.dot;
	}
	if (this.cell.charge <= 50) {
		yield* this.toggle_ionpulse();
		return f.dot;
	}
	this.cell.charge -= 50;
	return 1;
}, true);

// robot.dm:293
rt.def("/mob/living/silicon/robot/proc/toggle_ionpulse", function* toggle_ionpulse(f: Frame) {
	if (!this.ionpulse) {
		to_chat(this, "<span class='notice'>No thrusters are installed!</span>");
		return f.dot;
	}
	if (!this.ion_trail) {
		this.ion_trail = (yield* new_(T("/datum/effect_system/trail_follow/ion")));
		yield* this.ion_trail.set_up(this);
	}
	this.ionpulse_on = (!this.ionpulse_on ? 1 : 0);
	let $0: any = this;
	to_chat($0, `<span class='notice'>You ${this.ionpulse_on ? null : "de"}activate your ion thrusters.</span>`);
	if (this.ionpulse_on) {
		yield* this.ion_trail.start();
	} else {
		yield* this.ion_trail.stop();
	}
	if (!this.thruster_button) return f.dot;
	this.thruster_button.icon_state = `ionpulse${this.ionpulse_on}`;
	return f.dot;
}, true);

// robot.dm:311
rt.def("/mob/living/silicon/robot/proc/Stat", function* Stat(f: Frame) {
	let st: Value = null;
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	if (this.cell) {
		stat("Charge Left:", `${this.cell.charge}/${this.cell.maxcharge}`);
	} else {
		stat(null, "No Cell Inserted!");
	}
	if (this.module) {
		for (st of each(this.module.storages, T("/datum/robot_energy_storage"))) {
			stat(`${st.name}:`, `${st.energy}/${st.max_energy}`);
		}
	}
	if (!this.connected_ai) return f.dot;
	stat("Master AI:", this.connected_ai.name);
	return f.dot;
}, true);

// robot.dm:328
rt.def("/mob/living/silicon/robot/proc/triggerAlarm", function triggerAlarm(f: Frame, _class: Value, A: Value, O: Value, alarmsource: Value) {
	let I: Value = null, alarm: Value = null, sources: Value = null, C: Value = null, CL: Value = null;
	let $e: any;
	if (alarmsource.z != this.z) {
		return f.dot;
	}
	if (this.stat == 2) {
		return 1;
	}
	let L: Value = rt.index(this.alarms, _class);
	for (I of each(L)) {
		if (I == A.name) {
			alarm = rt.index(L, I);
			sources = rt.index(alarm, 3);
			if (!rt.isIn(f, alarmsource, sources)) {
				sources += alarmsource;
			}
			return 1;
		}
	}
	if (O && rt.istype(O, T("/list"))) {
		if (rt.len(f, (CL = O)) == 1) {
			C = rt.index(CL, 1);
		}
	} else if (O && rt.istype(O, T("/obj/machinery/camera"))) {
		C = O;
	}
	let $0: any = L;
	let $1: any = A.name;
	let $2: any = A;
	rt.setAt($0, $1, list($2, C ? C : O, list(alarmsource)));
	this.queueAlarm(`--- ${_class} alarm detected in ${A.name}!`, _class);
	return 1;
});

// robot.dm:353
rt.def("/mob/living/silicon/robot/proc/cancelAlarm", function cancelAlarm(f: Frame, _class: Value, A: Value, origin: Value) {
	let I: Value = null, alarm: Value = null, srcs: Value = null;
	let L: Value = rt.index(this.alarms, _class);
	let cleared: Value = 0;
	for (I of each(L)) {
		if (I == A.name) {
			alarm = rt.index(L, I);
			srcs = rt.index(alarm, 3);
			if (rt.isIn(f, origin, srcs)) {
				srcs -= origin;
			}
			if (rt.len(f, srcs) == 0) {
				cleared = 1;
				L -= I;
			}
		}
	}
	if (cleared) {
		this.queueAlarm(`--- ${_class} alarm in ${A.name} has been cleared.`, _class, 0);
	}
	return (!cleared ? 1 : 0);
});

// robot.dm:369
rt.def("/mob/living/silicon/robot/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null, coil: Value = null, MOD: Value = null, U: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && (user.a_intent != "harm" || user == this)) {
		user.changeNext_move(8);
		WT = W;
		if (!this.getBruteLoss()) {
			to_chat(user, `<span class='warning'>${this} is already in good condition!</span>`);
			return f.dot;
		}
		if (yield* WT.remove_fuel(0, user)) {
			if (this == user) {
				to_chat(user, "<span class='notice'>You start fixing yourself...</span>");
				if (!(yield* do_after(user, 50, { target: this }))) {
					return f.dot;
				}
			}
			yield* this.adjustBruteLoss(-30);
			yield* this.updatehealth();
			yield* this.add_fingerprint(user);
			this.visible_message(`<span class='notice'>${user} has fixed some of the dents on ${this}.</span>`);
			return f.dot;
		} else {
			to_chat(user, "<span class='warning'>The welder must be on for this task!</span>");
			return f.dot;
		}
	} else if (rt.istype(W, T("/obj/item/stack/cable_coil")) && this.wiresexposed) {
		user.changeNext_move(8);
		coil = W;
		if (this.getFireLoss() > 0) {
			if (this == user) {
				to_chat(user, "<span class='notice'>You start fixing yourself...</span>");
				if (!(yield* do_after(user, 50, { target: this }))) {
					return f.dot;
				}
			}
			if (yield* coil.use(1)) {
				yield* this.adjustFireLoss(-30);
				yield* this.updatehealth();
				user.visible_message(`${user} has fixed some of the burnt wires on ${this}.`, `<span class='notice'>You fix some of the burnt wires on ${this}.</span>`);
			} else {
				to_chat(user, `<span class='warning'>You need more cable to repair ${this}!</span>`);
			}
		} else {
			to_chat(user, "The wires seem fine, there's no need to fix them.");
		}
	} else if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
		if (this.opened) {
			to_chat(user, "<span class='notice'>You close the cover.</span>");
			this.opened = 0;
			yield* this.update_icons();
		} else if (this.locked) {
			to_chat(user, "<span class='warning'>The cover is locked and cannot be opened!</span>");
		} else {
			to_chat(user, "<span class='notice'>You open the cover.</span>");
			this.opened = 1;
			yield* this.update_icons();
		}
	} else if (rt.istype(W, T("/obj/item/weapon/stock_parts/cell")) && this.opened) {
		if (this.wiresexposed) {
			to_chat(user, "<span class='warning'>Close the cover first!</span>");
		} else if (this.cell) {
			to_chat(user, "<span class='warning'>There is a power cell already installed!</span>");
		} else {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			W.loc = this;
			this.cell = W;
			to_chat(user, "<span class='notice'>You insert the power cell.</span>");
		}
		yield* this.update_icons();
		this.diag_hud_set_borgcell();
	} else if (is_wire_tool(W)) {
		if (this.wiresexposed) {
			yield* this.wires.interact(user);
		} else {
			to_chat(user, "<span class='warning'>You can't reach the wiring!</span>");
		}
	} else if (rt.istype(W, T("/obj/item/weapon/screwdriver")) && this.opened && !this.cell) {
		this.wiresexposed = (!this.wiresexposed ? 1 : 0);
		to_chat(user, `The wires have been ${this.wiresexposed ? "exposed" : "unexposed"}`);
		yield* this.update_icons();
	} else if (rt.istype(W, T("/obj/item/weapon/screwdriver")) && this.opened && this.cell) {
		if (this.shell) {
			to_chat(user, "You cannot seem to open the radio compartment");
		} else if (this.radio) {
			yield* this.radio.attackby(W, user);
		} else {
			to_chat(user, "<span class='warning'>Unable to locate a radio!</span>");
		}
		yield* this.update_icons();
	} else if (rt.istype(W, T("/obj/item/weapon/wrench")) && this.opened && !this.cell) {
		if (!this.lockcharge) {
			to_chat(user, `<span class='boldannounce'>${this}'s bolts spark! Maybe you should lock them down first!</span>`);
			yield* this.spark_system.start();
			return f.dot;
		} else {
			playsound(this, W.usesound, 50, 1);
			to_chat(user, `<span class='notice'>You start to unfasten ${this}'s securing bolts...</span>`);
			if ((yield* do_after(user, 50 * W.toolspeed, { target: this })) && !this.cell) {
				user.visible_message(`${user} deconstructs ${this}!`, `<span class='notice'>You unfasten the securing bolts, and ${this} falls to pieces!</span>`);
				yield* this.deconstruct();
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/aiModule"))) {
		MOD = W;
		if (!this.opened) {
			to_chat(user, "<span class='warning'>You need access to the robot's insides to do that!</span>");
			return f.dot;
		}
		if (this.wiresexposed) {
			to_chat(user, "<span class='warning'>You need to close the wire panel to do that!</span>");
			return f.dot;
		}
		if (!this.cell) {
			to_chat(user, "<span class='warning'>You need to install a power cell to do that!</span>");
			return f.dot;
		}
		if (this.shell) {
			to_chat(user, `<span class='warning'>${this} is controlled remotely! You cannot upload new laws this way!</span>`);
			return f.dot;
		}
		if (this.emagged || this.connected_ai && this.lawupdate) {
			yield* this.emote(`buzz-${user.name}`);
			return f.dot;
		}
		if (!this.mind) {
			to_chat(user, `<span class='warning'>${this} is entirely unresponsive!</span>`);
			return f.dot;
		}
		yield* MOD.install(this.laws, user);
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/device/encryptionkey")) && this.opened) {
		if (this.radio) {
			yield* this.radio.attackby(W, user);
		} else {
			to_chat(user, "<span class='warning'>Unable to locate a radio!</span>");
		}
	} else if (rt.istype(W, T("/obj/item/weapon/card/id")) || rt.istype(W, T("/obj/item/device/pda"))) {
		if (this.emagged) {
			to_chat(user, "<span class='notice'>The interface seems slightly damaged.</span>");
		}
		if (this.opened) {
			to_chat(user, "<span class='warning'>You must close the cover to swipe an ID card!</span>");
		} else if (yield* this.allowed(f.usr)) {
			this.locked = (!this.locked ? 1 : 0);
			to_chat(user, `<span class='notice'>You ${this.locked ? "lock" : "unlock"} ${this}'s cover.</span>`);
			yield* this.update_icons();
		} else {
			to_chat(user, "<span class='danger'>Access denied.</span>");
		}
	} else if (rt.istype(W, T("/obj/item/borg/upgrade"))) {
		U = W;
		if (!this.opened) {
			to_chat(user, "<span class='warning'>You must access the borg's internals!</span>");
		} else if (!this.module && U.require_module) {
			to_chat(user, "<span class='warning'>The borg must choose a module before it can be upgraded!</span>");
		} else if (U.locked) {
			to_chat(user, "<span class='warning'>The upgrade is locked and cannot be used yet!</span>");
		} else {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			if (yield* U.action(this)) {
				to_chat(user, `<span class='notice'>You apply the upgrade to ${this}.</span>`);
				if (U.one_use) {
					yield* qdel(U);
				} else {
					yield* U.forceMove(this);
					this.upgrades += U;
				}
			} else {
				to_chat(user, "<span class='danger'>Upgrade error.</span>");
			}
		}
	} else if (rt.istype(W, T("/obj/item/device/toner"))) {
		if (this.toner >= this.tonermax) {
			to_chat(user, `<span class='warning'>The toner level of ${this} is at its highest level possible!</span>`);
		} else {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.toner = this.tonermax;
			yield* qdel(W);
			to_chat(user, `<span class='notice'>You fill the toner level of ${this} to its max capacity.</span>`);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// robot.dm:545
rt.def("/mob/living/silicon/robot/verb/unlock_own_cover", function* unlock_own_cover(f: Frame) {
	if (this.stat == 2) {
		return f.dot;
	}
	if (!this.locked) return f.dot;
	if ((yield* alert("You cannot lock your cover again, are you sure?\n      (You can still ask for a human to lock it)", "Unlock Own Cover", "Yes", "No")) === "Yes") {
		this.locked = 0;
		yield* this.update_icons();
		to_chat(f.usr, "<span class='notice'>You unlock your cover.</span>");
	}
	return f.dot;
}, true, { verb: { name: "Unlock Cover", category: "Robot Commands", desc: "Unlocks your own cover if it is locked. You can not lock it again. A human will have to lock it for you." } });

// robot.dm:556
rt.def("/mob/living/silicon/robot/proc/allowed", function allowed(f: Frame, M: Value) {
	let H: Value = null, george: Value = null;
	if (this.check_access(null)) {
		return 1;
	}
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if (this.check_access((H = M).get_active_held_item()) || this.check_access(H.wear_id)) {
			return 1;
		}
	} else if (rt.istype(M, T("/mob/living/carbon/monkey"))) {
		if (rt.istype((george = M).get_active_held_item(), T("/obj/item"))) {
			return this.check_access(george.get_active_held_item());
		}
	}
	return 0;
});

// robot.dm:571
rt.def("/mob/living/silicon/robot/proc/check_access", function check_access(f: Frame, I: Value) {
	let L: Value = null, req: Value = null;
	if (!rt.istype(this.req_access, T("/list"))) {
		return 1;
	}
	if (!rt.len(f, (L = this.req_access))) {
		return 1;
	}
	if (!rt.istype(I, T("/obj/item/weapon/card/id")) && rt.istype(I, T("/obj/item"))) {
		I = I.GetID();
	}
	if (!I || !I.access) {
		return 0;
	}
	for (req of each(this.req_access)) {
		if (!rt.isIn(f, req, I.access)) {
			return 0;
		}
	}
	return 1;
});

// robot.dm:589
rt.def("/mob/living/silicon/robot/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	return this.update_icons();
});

// robot.dm:592
rt.def("/mob/living/silicon/robot/proc/update_icons", function update_icons(f: Frame) {
	let head_overlay: Value = null;
	let $0: any, $1: any;
	this.cut_overlays();
	this.icon_state = this.module.cyborg_base_icon;
	if (this.stat != 2 && !(this.IsUnconscious() || this.IsStun() || this.IsKnockdown() || this.low_power_mode)) {
		if (!this.eye_lights) {
			this.eye_lights = new_(T("/mutable_appearance"));
		}
		if (this.lamp_intensity > 2) {
			$0 = this.eye_lights;
			if (this.module.special_light_key) {
				$1 = `${this.module.special_light_key}`;
			} else {
				$1 = `${this.module.cyborg_base_icon}`;
			}
			$0.icon_state = `${$1}_l`;
		} else {
			$0 = this.eye_lights;
			if (this.module.special_light_key) {
				$1 = `${this.module.special_light_key}`;
			} else {
				$1 = `${this.module.cyborg_base_icon}`;
			}
			$0.icon_state = `${$1}_e${is_servant_of_ratvar(this) ? "_r" : ""}`;
		}
		this.eye_lights.icon = this.icon;
		this.add_overlay(this.eye_lights);
	}
	if (this.opened) {
		if (this.wiresexposed) {
			this.add_overlay("ov-opencover +w");
		} else if (this.cell) {
			this.add_overlay("ov-opencover +c");
		} else {
			this.add_overlay("ov-opencover -c");
		}
	}
	if (this.hat) {
		(head_overlay = this.hat.build_worn_icon({ state: this.hat.icon_state, default_layer: 20, default_icon_file: rt.rsc("icons/mob/head.dmi") })).pixel_y += this.hat_offset;
		this.add_overlay(head_overlay);
	}
	this.update_fire();
	return f.dot;
});

// robot.dm:620
rt.def("/mob/living/silicon/robot/proc/do_camera_update", function do_camera_update(f: Frame, oldLoc: Value) {
	if (oldLoc != this.loc) {
		GLOB.cameranet.updatePortableCamera(this.camera);
	}
	this.updating = 0;
	return f.dot;
});

// robot.dm:626
rt.def("/mob/living/silicon/robot/proc/Move", function* Move(f: Frame, a: Value, b: Value, flag: Value) {
	let I: Value = null;
	let oldLoc: Value = this.loc;
	f.dot = (yield* parent_proc());
	if (f.dot) {
		if (this.camera) {
			if (!this.updating) {
				this.updating = 1;
				yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/silicon/robot/proc/do_camera_update"), oldLoc)), 30);
			}
		}
	}
	if (!this.module) return f.dot;
	if (!rt.istype(this.module, T("/obj/item/weapon/robot_module/miner"))) return f.dot;
	if (!rt.istype(this.loc, T("/turf/open/floor/plating/asteroid"))) return f.dot;
	for (I of each(this.held_items, T("/obj/item"))) {
		if (rt.istype(I, T("/obj/item/weapon/storage/bag/ore"))) {
			yield* this.loc.attackby(I, this);
		}
	}
	return f.dot;
}, true);

// robot.dm:643
rt.def("/mob/living/silicon/robot/proc/self_destruct", function* self_destruct(f: Frame) {
	if (this.emagged) {
		if (this.mmi) {
			yield* qdel(this.mmi);
		}
		yield* explosion(this.loc, 1, 2, 4, { flame_range: 2 });
	} else {
		yield* explosion(this.loc, -1, 0, 2);
	}
	yield* this.gib();
	return f.dot;
}, true);

// robot.dm:650
rt.def("/mob/living/silicon/robot/proc/UnlinkSelf", function* UnlinkSelf(f: Frame) {
	if (this.connected_ai) {
		this.connected_ai.connected_robots -= this;
		this.connected_ai = null;
	}
	this.lawupdate = 0;
	this.lockcharge = 0;
	this.canmove = 1;
	this.scrambledcodes = 1;
	if (!this.camera) return f.dot;
	yield* qdel(this.camera);
	this.camera = null;
	return f.dot;
}, true);

// robot.dm:671
rt.def("/mob/living/silicon/robot/proc/ResetSecurityCodes", function* ResetSecurityCodes(f: Frame) {
	let R: Value = null;
	if (!(R = this)) return f.dot;
	yield* R.UnlinkSelf();
	to_chat(R, "Buffers flushed and reset. Camera system shutdown.  All systems operational.");
	(rt.modField(f, this, "verbs", P("/mob/living/silicon/robot/proc/ResetSecurityCodes"), subtract));
	return f.dot;
}, true, { verb: { name: "Reset Identity Codes", category: "Robot Commands", desc: "Scrambles your security and identification codes and resets your current buffers. Unlocks you and permanently severs you from your AI and the robotics console and will deactivate your camera system." } });

// robot.dm:683
rt.def("/mob/living/silicon/robot/mode", function* mode(f: Frame) {
	let W: Value = null;
	if (this.incapacitated()) {
		return f.dot;
	}
	if (!(W = this.get_active_held_item())) return f.dot;
	yield* W.attack_self(this);
	return f.dot;
}, true, { verb: { name: "Activate Held Object", category: "Object", src: 10 } });

// robot.dm:692
rt.def("/mob/living/silicon/robot/proc/SetLockdown", function* SetLockdown(f: Frame, state: Value) {
	state ??= 1;
	if (this.wires.is_cut("Lockdown")) {
		state = 1;
	}
	if (state) {
		yield* this.throw_alert("locked", T("/obj/screen/alert/locked"));
	} else {
		yield* this.clear_alert("locked");
	}
	this.lockcharge = state;
	yield* this.update_canmove();
	return f.dot;
}, true);

// robot.dm:702
rt.def("/mob/living/silicon/robot/proc/SetEmagged", function* SetEmagged(f: Frame, new_state: Value) {
	this.emagged = new_state;
	yield* this.module.rebuild_modules();
	yield* this.update_icons();
	if (this.emagged) {
		yield* this.throw_alert("hacked", T("/obj/screen/alert/hacked"));
	} else {
		yield* this.clear_alert("hacked");
	}
	return f.dot;
}, true);

// robot.dm:714
rt.def("/mob/living/silicon/robot/verb/outputlaws", function outputlaws(f: Frame) {
	if (f.usr.stat == 2) {
		return f.dot;
	}
	this.checklaws();
	return f.dot;
}, false, { verb: { name: "State Laws", category: "Robot Commands" } });

// robot.dm:723
rt.def("/mob/living/silicon/robot/verb/set_automatic_say_channel", function* set_automatic_say_channel(f: Frame) {
	if (f.usr.stat == 2) {
		return f.dot;
	}
	yield* this.set_autosay();
	return f.dot;
}, true, { verb: { name: "Set Auto Announce Mode", category: "Robot Commands", desc: "Modify the default radio setting for stating your laws." } });

// robot.dm:728
rt.def("/mob/living/silicon/robot/proc/control_headlamp", function* control_headlamp(f: Frame) {
	let $1: any;
	if (this.stat || this.lamp_recharging || this.low_power_mode) {
		to_chat(this, "<span class='danger'>This function is currently offline.</span>");
		return f.dot;
	}
	this.lamp_intensity = (this.lamp_intensity + 2) % (this.lamp_max + 2);
	let $0: any = this;
	if (this.lamp_intensity) {
		$1 = `Headlamp power set to Level ${this.lamp_intensity / 2}`;
	} else {
		$1 = "Headlamp disabled.";
	}
	to_chat($0, `${$1}`);
	yield* this.update_headlamp();
	return f.dot;
}, true);

// robot.dm:738
rt.def("/mob/living/silicon/robot/proc/update_headlamp", function* update_headlamp(f: Frame, turn_off: Value, cooldown: Value) {
	turn_off ??= 0;
	cooldown ??= 100;
	this.set_light(0);
	if (this.lamp_intensity && (turn_off || this.stat || this.low_power_mode)) {
		to_chat(this, "<span class='danger'>Your headlamp has been deactivated.</span>");
		this.lamp_intensity = 0;
		this.lamp_recharging = 1;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/silicon/robot/proc/reset_headlamp"))), cooldown);
	} else {
		this.set_light(this.lamp_intensity);
	}
	if (this.lamp_button) {
		this.lamp_button.icon_state = `lamp${this.lamp_intensity}`;
	}
	yield* this.update_icons();
	return f.dot;
}, true);

// robot.dm:757
rt.def("/mob/living/silicon/robot/proc/deconstruct", function* deconstruct(f: Frame) {
	let b: Value = null, F: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	if (this.robot_suit) {
		this.robot_suit.loc = _T;
		this.robot_suit.l_leg.loc = _T;
		this.robot_suit.l_leg = null;
		this.robot_suit.r_leg.loc = _T;
		this.robot_suit.r_leg = null;
		yield* new_(T("/obj/item/stack/cable_coil"), _T, this.robot_suit.chest.wired);
		this.robot_suit.chest.loc = _T;
		this.robot_suit.chest.wired = 0;
		this.robot_suit.chest = null;
		this.robot_suit.l_arm.loc = _T;
		this.robot_suit.l_arm = null;
		this.robot_suit.r_arm.loc = _T;
		this.robot_suit.r_arm = null;
		this.robot_suit.head.loc = _T;
		this.robot_suit.head.flash1.loc = _T;
		yield* this.robot_suit.head.flash1.burn_out();
		this.robot_suit.head.flash1 = null;
		this.robot_suit.head.flash2.loc = _T;
		yield* this.robot_suit.head.flash2.burn_out();
		this.robot_suit.head.flash2 = null;
		this.robot_suit.head = null;
		this.robot_suit.updateicon();
	} else {
		yield* new_(T("/obj/item/robot_suit"), _T);
		yield* new_(T("/obj/item/bodypart/l_leg/robot"), _T);
		yield* new_(T("/obj/item/bodypart/r_leg/robot"), _T);
		yield* new_(T("/obj/item/stack/cable_coil"), _T, 1);
		yield* new_(T("/obj/item/bodypart/chest/robot"), _T);
		yield* new_(T("/obj/item/bodypart/l_arm/robot"), _T);
		yield* new_(T("/obj/item/bodypart/r_arm/robot"), _T);
		yield* new_(T("/obj/item/bodypart/head/robot"), _T);
		b = 0;
		while (b != 2) {
			yield* (F = (yield* new_(T("/obj/item/device/assembly/flash/handheld"), _T))).burn_out();
			b++;
		}
	}
	if (this.cell) {
		this.cell.loc = _T;
		this.cell = null;
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(4836, "/mob/living/silicon/robot/syndicate", "/mob/living/silicon/robot", {
	playstyle_string: "<span class='userdanger'>You are a Syndicate assault cyborg!</span><br><b>You are armed with powerful offensive tools to aid you in your mission: help the operatives secure the nuclear authentication disk. Your cyborg LMG will slowly produce ammunition from your power supply, and your operative pinpointer will find and locate fellow nuclear operatives. <i>Help the operatives secure the disk at all costs!</i></b>",
	set_module: rt.typePath("/obj/item/weapon/robot_module/syndicate"),
	lawupdate: 0,
	scrambledcodes: 1,
	ionpulse: 1,
	icon_state: "syndie_bloodhound",
	faction: null,
	bubble_icon: "syndibot",
	req_access: null,
});

// robot.dm:801
rt.def("/mob/living/silicon/robot/syndicate/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.faction = list("syndicate");

	this.req_access = list(150);
	return f.dot;
}, true);

// robot.dm:814
rt.def("/mob/living/silicon/robot/syndicate/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.cell.maxcharge = 25000;
	this.cell.charge = 25000;
	this.radio = (yield* new_(T("/obj/item/device/radio/borg/syndicate"), this));
	yield* this.module.transform_to(this.set_module);
	this.laws = (yield* new_(T("/datum/ai_laws/syndicate_override")));
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/silicon/robot/syndicate/proc/show_playstyle"))), 5);
	return f.dot;
}, true);

// robot.dm:824
rt.def("/mob/living/silicon/robot/syndicate/proc/show_playstyle", function show_playstyle(f: Frame) {
	if (!this.playstyle_string) return f.dot;
	to_chat(this, this.playstyle_string);
	return f.dot;
});

// robot.dm:840
rt.def("/mob/living/silicon/robot/proc/notify_ai", function notify_ai(f: Frame, notifytype: Value, oldname: Value, newname: Value) {
	if (!this.connected_ai) {
		return f.dot;
	}
	if (notifytype === NEW_BORG) {
		to_chat(this.connected_ai, fmt("<br><br><span class='notice'>NOTICE - New cyborg connection detected: <a href='?src=＃;track=＀'>＀</a></span><br>", [this.connected_ai, html_encode(this.name), this.name]));
	} else if (notifytype === NEW_MODULE) {
		to_chat(this.connected_ai, `<br><br><span class='notice'>NOTICE - Cyborg module change detected: ${this.name} has loaded the ${this.designation} module.</span><br>`);
	} else if (notifytype === RENAME) {
		to_chat(this.connected_ai, `<br><br><span class='notice'>NOTICE - Cyborg reclassification detected: ${oldname} is now designated as ${newname}.</span><br>`);
	} else if (notifytype === AI_SHELL) {
		to_chat(this.connected_ai, fmt("<br><br><span class='notice'>NOTICE - New cyborg shell detected: <a href='?src=＃;track=＀'>＀</a></span><br>", [this.connected_ai, html_encode(this.name), this.name]));
	}
	return f.dot;
});

// robot.dm:853
rt.def("/mob/living/silicon/robot/proc/canUseTopic", function canUseTopic(f: Frame, M: Value, be_close: Value) {
	be_close ??= 0;
	if (this.stat || this.lockcharge || this.low_power_mode) {
		return f.dot;
	}
	if (be_close && !(get_dist(M, this) <= 1)) {
		return f.dot;
	}
	return 1;
});

// robot.dm:860
rt.def("/mob/living/silicon/robot/proc/updatehealth", function* updatehealth(f: Frame) {
	yield* parent_proc();
	if (!(this.health < this.maxHealth * 0.5)) return f.dot;
	if (yield* this.uneq_module(rt.index(this.held_items, 3))) {
		to_chat(this, "<span class='warning'>SYSTEM ERROR: Module 3 OFFLINE.</span>");
	}
	if (!(this.health < 0)) return f.dot;
	if (yield* this.uneq_module(rt.index(this.held_items, 2))) {
		to_chat(this, "<span class='warning'>SYSTEM ERROR: Module 2 OFFLINE.</span>");
	}
	if (!(this.health < -this.maxHealth * 0.5)) return f.dot;
	if (!(yield* this.uneq_module(rt.index(this.held_items, 1)))) return f.dot;
	to_chat(this, "<span class='warning'>CRITICAL ERROR: All modules OFFLINE.</span>");
	return f.dot;
}, true);

// robot.dm:872
rt.def("/mob/living/silicon/robot/proc/update_sight", function update_sight(f: Frame) {
	let A: Value = null;
	if (!this.client) {
		return f.dot;
	}
	if (this.stat == 2) {
		this.sight = 28;
		this.see_in_dark = 8;
		this.see_invisible = 60;
		return f.dot;
	}
	this.see_invisible = rt.initial(f, this, "see_invisible");
	this.see_in_dark = rt.initial(f, this, "see_in_dark");
	this.sight = rt.initial(f, this, "sight");
	if (this.client.eye != this) {
		if ((A = this.client.eye).update_remote_sight(this)) {
			return f.dot;
		}
	}
	if (rt.bitAnd(this.sight_mode, 1)) {
		(rt.modSrcVar(f, "sight", 16, rt.bitOr));
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_INVISIBLE;
		this.see_in_dark = 1;
	}
	if (rt.bitAnd(this.sight_mode, 8)) {
		(rt.modSrcVar(f, "sight", 8, rt.bitOr));
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_MOSTLY_INVISIBLE;
		this.see_in_dark = 1;
	}
	if (rt.bitAnd(this.sight_mode, 4)) {
		(rt.modSrcVar(f, "sight", 28, rt.bitOr));
		this.see_invisible = 25;
		this.see_in_dark = 8;
	}
	if (rt.bitAnd(this.sight_mode, 2)) {
		(rt.modSrcVar(f, "sight", 4, rt.bitOr));
		this.see_invisible = min(this.see_invisible, 25);
		this.see_in_dark = 8;
	}
	if (this.see_override) {
		this.see_invisible = this.see_override;
	}
	this.sync_lighting_plane_alpha();
	return f.dot;
});

// robot.dm:914
rt.def("/mob/living/silicon/robot/proc/update_stat", function* update_stat(f: Frame) {
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	if (this.stat != 2) {
		if (this.health <= -this.maxHealth) {
			yield* this.death();
			return f.dot;
		}
		if (this.IsUnconscious() || this.IsStun() || this.IsKnockdown() || this.getOxyLoss() > this.maxHealth * 0.5) {
			if (this.stat == 0) {
				this.stat = 1;
				yield* this.blind_eyes(1);
				yield* this.update_canmove();
				yield* this.update_headlamp();
			}
		} else if (this.stat == 1) {
			this.stat = 0;
			yield* this.adjust_blindness(-1);
			yield* this.update_canmove();
			yield* this.update_headlamp();
		}
	}
	this.diag_hud_set_status();
	this.diag_hud_set_health();
	this.diag_hud_set_aishell();
	this.update_health_hud();
	return f.dot;
}, true);

// robot.dm:938
rt.def("/mob/living/silicon/robot/proc/revive", function* revive(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	if (this.camera && !this.wires.is_cut("Camera")) {
		yield* this.camera.toggle_cam(this, 0);
	}
	yield* this.update_headlamp();
	if (f.args[1]) {
		this.locked = 1;
	}
	this.notify_ai(NEW_BORG);
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// robot.dm:948
rt.def("/mob/living/silicon/robot/proc/fully_replace_character_name", function fully_replace_character_name(f: Frame, oldname: Value, newname: Value) {
	parent_proc();
	if (oldname != this.real_name) {
		this.notify_ai(RENAME, oldname, newname);
	}
	if (this.camera) {
		this.camera.c_tag = this.real_name;
	}
	this.custom_name = newname;
	return f.dot;
}, false);

// robot.dm:957
rt.def("/mob/living/silicon/robot/proc/ResetModule", function* ResetModule(f: Frame) {
	let I: Value = null;
	yield* this.uneq_all();
	this.shown_robot_modules = 0;
	if (this.hud_used) {
		this.hud_used.update_robot_modules_display();
	}
	yield* this.module.transform_to(T("/obj/item/weapon/robot_module"));
	for (I of each(this.upgrades, T("/obj/item"))) {
		yield* I.forceMove(rt.getStep(f, this, 0));
	}
	this.upgrades.Cut();
	this.speed = 0;
	this.ionpulse = 0;
	yield* this.revert_shell();
	return 1;
}, true);

// robot.dm:976
rt.def("/mob/living/silicon/robot/proc/has_module", function has_module(f: Frame) {
	if (!this.module || this.module.type == T("/obj/item/weapon/robot_module")) {
		f.dot = 0;
	} else {
		f.dot = 1;
	}
	return f.dot;
});

// robot.dm:984
rt.def("/mob/living/silicon/robot/proc/update_module_innate", function update_module_innate(f: Frame) {
	this.designation = this.module.name;
	if (this.hands) {
		this.hands.icon_state = this.module.moduleselect_icon;
	}
	if (this.module.can_be_pushed) {
		(rt.modSrcVar(f, "status_flags", 8, rt.bitOr));
	} else {
		(rt.modSrcVar(f, "status_flags", 16777207, rt.bitAnd));
	}
	if (this.module.clean_on_move) {
		(rt.modSrcVar(f, "flags", 2048, rt.bitOr));
	} else {
		(rt.modSrcVar(f, "flags", 16775167, rt.bitAnd));
	}
	this.hat_offset = this.module.hat_offset;
	this.magpulse = this.module.magpulsing;
	this.updatename();
	return f.dot;
});

// robot.dm:1003
rt.def("/mob/living/silicon/robot/proc/place_on_head", function* place_on_head(f: Frame, new_hat: Value) {
	if (this.hat) {
		yield* this.hat.forceMove(rt.getStep(f, this, 0));
	}
	this.hat = new_hat;
	yield* new_hat.forceMove(this);
	yield* this.update_icons();
	return f.dot;
}, true);

// robot.dm:1009
rt.def("/mob/living/silicon/robot/proc/make_shell", function* make_shell(f: Frame, board: Value) {
	if (!board) {
		(rt.modSrcVar(f, "upgrades", (yield* new_(T("/obj/item/borg/upgrade/ai"), this)), rt.bitOr));
	}
	this.shell = 1;
	this.braintype = "AI Shell";
	this.name = `${this.designation} AI Shell ${rand(100, 999)}`;
	this.real_name = this.name;
	(rt.modGl("available_ai_shells", this, rt.bitOr));
	if (this.camera) {
		this.camera.c_tag = this.real_name;
	}
	this.diag_hud_set_aishell();
	this.notify_ai(AI_SHELL);
	return f.dot;
}, true);

// robot.dm:1022
rt.def("/mob/living/silicon/robot/proc/revert_shell", function* revert_shell(f: Frame) {
	let boris: Value = null;
	if (!this.shell) {
		return f.dot;
	}
	yield* this.undeploy();
	for (boris of each(this, T("/obj/item/borg/upgrade/ai"))) {
		yield* qdel(boris);
	}
	this.shell = 0;
	GLOB.available_ai_shells -= this;
	this.name = `Unformatted Cyborg ${rand(100, 999)}`;
	this.real_name = this.name;
	if (this.camera) {
		this.camera.c_tag = this.real_name;
	}
	this.diag_hud_set_aishell();
	return f.dot;
}, true);

// robot.dm:1037
rt.def("/mob/living/silicon/robot/proc/deploy_init", function* deploy_init(f: Frame, AI: Value) {
	let chan: Value = null;
	this.real_name = `${AI.real_name} shell ${rand(100, 999)} - ${this.designation}`;
	this.name = this.real_name;
	if (this.camera) {
		this.camera.c_tag = this.real_name;
	}
	this.mainframe = AI;
	this.deployed = 1;
	this.connected_ai = this.mainframe;
	(rt.modField(f, this.mainframe, "connected_robots", this, rt.bitOr));
	this.lawupdate = 1;
	yield* this.lawsync();
	if (this.radio && AI.radio) {
		if (AI.radio.syndie) {
			yield* this.radio.make_syndie();
		}
		this.radio.subspace_transmission = 1;
		this.radio.channels = AI.radio.channels;
		for (chan of each(this.radio.channels)) {
			rt.setAt(this.radio.secure_radio_connections, chan, add_radio(this.radio, rt.index(GLOB.radiochannels, chan)));
		}
	}
	this.diag_hud_set_aishell();
	yield* this.undeployment_action.Grant(this);
	return f.dot;
}, true);

rt.type(162, "/datum/action/innate/undeployment", "/datum/action/innate", {
	name: "Disconnect from shell",
	desc: "Stop controlling your shell and resume normal core operations.",
	button_icon_state: "ai_core",
});

// robot.dm:1064
rt.def("/datum/action/innate/undeployment/proc/Trigger", function* Trigger(f: Frame) {
	let R: Value = null;
	if (!(yield* parent_proc())) {
		return 0;
	}
	yield* (R = this.owner).undeploy();
	return 1;
}, true);

// robot.dm:1074
rt.def("/mob/living/silicon/robot/proc/undeploy", function* undeploy(f: Frame) {
	if (!this.deployed || !this.mind || !this.mainframe) {
		return f.dot;
	}
	yield* this.mainframe.redeploy_action.Grant(this.mainframe);
	this.mainframe.redeploy_action.last_used_shell = this;
	yield* this.mind.transfer_to(this.mainframe);
	this.deployed = 0;
	this.mainframe.deployed_shell = null;
	yield* this.undeployment_action.Remove(this);
	if (this.radio) {
		this.radio.recalculateChannels();
	}
	if (this.camera) {
		this.camera.c_tag = this.real_name;
	}
	this.diag_hud_set_aishell();
	this.mainframe.diag_hud_set_deployed();
	if (this.mainframe.laws) {
		yield* this.mainframe.laws.show_laws(this.mainframe);
	}
	this.mainframe = null;
	return f.dot;
}, true);

// robot.dm:1093
rt.def("/mob/living/silicon/robot/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	let AI: Value = null;
	if (!(this.shell && (!this.connected_ai || this.connected_ai == user))) return f.dot;
	yield* (AI = user).deploy_to_shell(this);
	return f.dot;
}, true);

// robot.dm:1101
rt.def("/mob/living/silicon/robot/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, M: Value, user: Value) {
	f.dot = (yield* parent_proc());
	if (!(!rt.isIn(f, M, this.buckled_mobs) && rt.istype(M, T("/mob/living")))) return f.dot;
	yield* this.buckle_mob(M);
	return f.dot;
}, true);

// robot.dm:1106
rt.def("/mob/living/silicon/robot/proc/buckle_mob", function* buckle_mob(f: Frame, M: Value, force: Value, check_loc: Value) {
	force ??= 0;
	check_loc ??= 1;
	if (!is_type_in_typecache(M, this.can_ride_typecache)) {
		M.visible_message(`<span class='warning'>${M} really can't seem to mount the ${this}...</span>`);
		return f.dot;
	}
	if (!this.riding_datum) {
		this.riding_datum = (yield* new_(T("/datum/riding/cyborg"), this));
	}
	if (this.buckled_mobs) {
		if (rt.len(f, this.buckled_mobs) >= this.max_buckled_mobs) {
			return f.dot;
		}
		if (rt.isIn(f, M, this.buckled_mobs)) {
			return f.dot;
		}
	}
	if (this.stat) {
		return f.dot;
	}
	if (this.incapacitated()) {
		return f.dot;
	}
	if (M.incapacitated()) {
		return f.dot;
	}
	if (this.module) {
		if (!this.module.allow_riding) {
			M.visible_message(`<span class='boldwarning'>Unfortunately, ${M} just can't seem to hold onto ${this}!</span>`);
			return f.dot;
		}
	}
	if (rt.istype(M, T("/mob/living/carbon")) && !(yield* this.riding_datum.equip_buckle_inhands(M, 1))) {
		M.visible_message(`<span class='boldwarning'>${M} can't climb onto ${this} because ${M.p_their()} hands are full!</span>`);
		return f.dot;
	}
	f.dot = (yield* parent_proc(M, force, check_loc));
	return f.dot;
}, true);

// robot.dm:1132
rt.def("/mob/living/silicon/robot/proc/unbuckle_mob", function* unbuckle_mob(f: Frame, user: Value) {
	if (rt.istype(user, T("/mob/living/carbon"))) {
		if (this.riding_datum) {
			yield* this.riding_datum.unequip_buckle_inhands(user);
			yield* this.riding_datum.restore_position(user);
		}
	}
	f.dot = (yield* parent_proc(user));
	return f.dot;
}, true);

// robot.dm:1139
rt.def("/mob/living/silicon/robot/proc/TryConnectToAI", function* TryConnectToAI(f: Frame) {
	this.connected_ai = select_active_ai_with_fewest_borgs();
	if (this.connected_ai) {
		this.connected_ai.connected_robots += this;
		yield* this.lawsync();
		this.lawupdate = 1;
		return 1;
	}
	return 0;
}, true);
