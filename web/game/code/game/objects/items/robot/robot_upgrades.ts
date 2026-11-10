// Based on /tg/station's code/game/objects/items/robot/robot_upgrades.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9824, "/obj/item/borg/upgrade", "/obj/item/borg", {
	locked: 0,
	installed: 0,
	require_module: 0,
	module_type: null,
	one_use: 0,
	origin_tech: "programming=2",
	name: "borg upgrade module.",
	desc: "Protected by FRM.",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "cyborg_upgrade",
});

// robot_upgrades.dm:19
rt.def("/obj/item/borg/upgrade/proc/action", function action(f: Frame, R: Value) {
	if (R.stat == 2) {
		to_chat(f.usr, `<span class='notice'>${this} will not function on a deceased cyborg.</span>`);
		return 1;
	}
	if (!(this.module_type && !rt.op(f, "IsType", [], [R.module, this.module_type]))) return f.dot;
	to_chat(R, "Upgrade mounting error!  No suitable hardpoint detected!");
	to_chat(f.usr, "There's no mounting point for the module!");
	return 1;
});

rt.type(9825, "/obj/item/borg/upgrade/rename", "/obj/item/borg/upgrade", {
	heldname: "",
	one_use: 1,
	name: "cyborg reclassification board",
	desc: "Used to rename a cyborg.",
	icon_state: "cyborg_upgrade1",
});

// robot_upgrades.dm:35
rt.def("/obj/item/borg/upgrade/rename/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	this.heldname = (yield* stripped_input(user, "Enter new robot name", "Cyborg Reclassification", this.heldname, 42));
	return f.dot;
}, true);

// robot_upgrades.dm:38
rt.def("/obj/item/borg/upgrade/rename/proc/action", function action(f: Frame, R: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	let oldname: Value = R.real_name;
	R.custom_name = this.heldname;
	R.updatename();
	if (oldname == R.real_name) {
		R.notify_ai(RENAME, oldname, R.real_name);
	}
	return 1;
}, false);

rt.type(9826, "/obj/item/borg/upgrade/restart", "/obj/item/borg/upgrade", {
	one_use: 1,
	name: "cyborg emergency reboot module",
	desc: "Used to force a reboot of a disabled-but-repaired cyborg, bringing it back online.",
	icon_state: "cyborg_upgrade1",
});

// robot_upgrades.dm:58
rt.def("/obj/item/borg/upgrade/restart/proc/action", function* action(f: Frame, R: Value) {
	if (R.health < 0) {
		to_chat(f.usr, "<span class='warning'>You have to repair the cyborg before using this module!</span>");
		return 0;
	}
	if (R.mind) {
		yield* R.mind.grab_ghost();
		playsound(this.loc, rt.rsc("sound/voice/liveagain.ogg"), 75, 1);
	}
	yield* R.revive();
	return 1;
}, true);

rt.type(9827, "/obj/item/borg/upgrade/vtec", "/obj/item/borg/upgrade", {
	require_module: 1,
	origin_tech: "engineering=4;materials=5;programming=4",
	name: "cyborg VTEC module",
	desc: "Used to kick in a cyborg's VTEC systems, increasing their speed.",
	icon_state: "cyborg_upgrade2",
});

// robot_upgrades.dm:78
rt.def("/obj/item/borg/upgrade/vtec/proc/action", function action(f: Frame, R: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	if (R.speed < 0) {
		to_chat(R, "<span class='notice'>A VTEC unit is already installed!</span>");
		to_chat(f.usr, "<span class='notice'>There's no room for another VTEC unit!</span>");
		return f.dot;
	}
	R.speed = -2;
	return 1;
}, false);

rt.type(9828, "/obj/item/borg/upgrade/disablercooler", "/obj/item/borg/upgrade", {
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/security"),
	origin_tech: "engineering=4;powerstorage=4;combat=4",
	name: "cyborg rapid disabler cooling module",
	desc: "Used to cool a mounted disabler, increasing the potential current in it and thus its recharge rate.",
	icon_state: "cyborg_upgrade3",
});

// robot_upgrades.dm:98
rt.def("/obj/item/borg/upgrade/disablercooler/proc/action", function action(f: Frame, R: Value) {
	let _T: Value = null;
	if (parent_proc()) {
		return f.dot;
	}
	if (!(_T = rt.locateIn(f, T("/obj/item/weapon/gun/energy/disabler/cyborg"), R.module.modules))) {
		to_chat(f.usr, "<span class='notice'>There's no disabler in this unit!</span>");
		return f.dot;
	}
	if (_T.charge_delay <= 2) {
		to_chat(R, "<span class='notice'>A cooling unit is already installed!</span>");
		to_chat(f.usr, "<span class='notice'>There's no room for another cooling unit!</span>");
		return f.dot;
	}
	_T.charge_delay = max(2, _T.charge_delay - 4);
	return 1;
}, false);

rt.type(9829, "/obj/item/borg/upgrade/thrusters", "/obj/item/borg/upgrade", {
	origin_tech: "engineering=4;powerstorage=4",
	name: "ion thruster upgrade",
	desc: "A energy-operated thruster system for cyborgs.",
	icon_state: "cyborg_upgrade3",
});

// robot_upgrades.dm:121
rt.def("/obj/item/borg/upgrade/thrusters/proc/action", function action(f: Frame, R: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	if (R.ionpulse) {
		to_chat(f.usr, "<span class='notice'>This unit already has ion thrusters installed!</span>");
		return f.dot;
	}
	R.ionpulse = 1;
	return 1;
}, false);

rt.type(9830, "/obj/item/borg/upgrade/ddrill", "/obj/item/borg/upgrade", {
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/miner"),
	origin_tech: "engineering=4;materials=5",
	name: "mining cyborg diamond drill",
	desc: "A diamond drill replacement for the mining module's standard drill.",
	icon_state: "cyborg_upgrade3",
});

// robot_upgrades.dm:140
rt.def("/obj/item/borg/upgrade/ddrill/proc/action", function* action(f: Frame, R: Value) {
	let D: Value = null, S: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	for (D of each(R.module, T("/obj/item/weapon/pickaxe/drill/cyborg"))) {
		yield* R.module.remove_module(D, 1);
	}
	for (S of each(R.module, T("/obj/item/weapon/shovel"))) {
		yield* R.module.remove_module(S, 1);
	}
	let DD: Value = (yield* new_(T("/obj/item/weapon/pickaxe/drill/cyborg/diamond"), R.module));
	R.module.basic_modules += DD;
	yield* R.module.add_module(DD, 0, 1);
	return 1;
}, true);

rt.type(9831, "/obj/item/borg/upgrade/soh", "/obj/item/borg/upgrade", {
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/miner"),
	origin_tech: "engineering=4;materials=4;bluespace=4",
	name: "mining cyborg satchel of holding",
	desc: "A satchel of holding replacement for mining cyborg's ore satchel module.",
	icon_state: "cyborg_upgrade3",
});

// robot_upgrades.dm:162
rt.def("/obj/item/borg/upgrade/soh/proc/action", function* action(f: Frame, R: Value) {
	let S: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	for (S of each(R.module, T("/obj/item/weapon/storage/bag/ore/cyborg"))) {
		yield* R.module.remove_module(S, 1);
	}
	let H: Value = (yield* new_(T("/obj/item/weapon/storage/bag/ore/holding"), R.module));
	R.module.basic_modules += H;
	yield* R.module.add_module(H, 0, 1);
	return 1;
}, true);

rt.type(9832, "/obj/item/borg/upgrade/syndicate", "/obj/item/borg/upgrade", {
	require_module: 1,
	origin_tech: "combat=4;syndicate=1",
	name: "illegal equipment module",
	desc: "Unlocks the hidden, deadlier functions of a cyborg",
	icon_state: "cyborg_upgrade3",
});

// robot_upgrades.dm:181
rt.def("/obj/item/borg/upgrade/syndicate/proc/action", function* action(f: Frame, R: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (R.emagged) {
		return f.dot;
	}
	yield* R.SetEmagged(1);
	return 1;
}, true);

rt.type(9833, "/obj/item/borg/upgrade/lavaproof", "/obj/item/borg/upgrade", {
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/miner"),
	origin_tech: "engineering=4;materials=4;plasmatech=4",
	name: "mining cyborg lavaproof tracks",
	desc: "An upgrade kit to apply specialized coolant systems and insulation layers to mining cyborg tracks, enabling them to withstand exposure to molten rock.",
	icon_state: "ash_plating",
	resistance_flags: 3,
});

// robot_upgrades.dm:201
rt.def("/obj/item/borg/upgrade/lavaproof/proc/action", function action(f: Frame, R: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	R.weather_immunities += "lava";
	return 1;
}, false);

rt.type(9834, "/obj/item/borg/upgrade/selfrepair", "/obj/item/borg/upgrade", {
	repair_amount: -1,
	repair_tick: 1,
	msg_cooldown: 0,
	on: 0,
	powercost: 10,
	cyborg: null,
	toggle_action: null,
	require_module: 1,
	name: "self-repair module",
	desc: "This module will repair the cyborg over time.",
	icon_state: "cyborg_upgrade5",
});

// robot_upgrades.dm:220
rt.def("/obj/item/borg/upgrade/selfrepair/proc/action", function* action(f: Frame, R: Value) {
	let U: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (U = rt.locateIn(f, T("/obj/item/borg/upgrade/selfrepair"), R)) {
		to_chat(f.usr, "<span class='warning'>This unit is already equipped with a self-repair module.</span>");
		return 0;
	}
	this.cyborg = R;
	this.icon_state = "selfrepair_off";
	this.toggle_action = (yield* new_(T("/datum/action/item_action/toggle"), this));
	yield* this.toggle_action.Grant(R);
	return 1;
}, true);

// robot_upgrades.dm:235
rt.def("/obj/item/borg/upgrade/selfrepair/proc/dropped", function* dropped(f: Frame) {
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/borg/upgrade/selfrepair/proc/check_dropped"))), 1);
	return f.dot;
}, true);

// robot_upgrades.dm:238
rt.def("/obj/item/borg/upgrade/selfrepair/proc/check_dropped", function* check_dropped(f: Frame) {
	if (this.loc == this.cyborg) return f.dot;
	yield* this.toggle_action.Remove(this.cyborg);
	yield* qdel(this.toggle_action);
	this.toggle_action = null;
	this.cyborg = null;
	yield* this.deactivate();
	return f.dot;
}, true);

// robot_upgrades.dm:245
rt.def("/obj/item/borg/upgrade/selfrepair/proc/ui_action_click", function* ui_action_click(f: Frame) {
	this.on = (!this.on ? 1 : 0);
	if (this.on) {
		to_chat(this.cyborg, "<span class='notice'>You activate the self-repair module.</span>");
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	} else {
		to_chat(this.cyborg, "<span class='notice'>You deactivate the self-repair module.</span>");
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// robot_upgrades.dm:256
rt.def("/obj/item/borg/upgrade/selfrepair/proc/update_icon", function* update_icon(f: Frame) {
	let X: Value = null, A: Value = null;
	let $e: any;
	if (this.cyborg) {
		this.icon_state = `selfrepair_${this.on ? "on" : "off"}`;
		for (X of each(this.actions)) {
			yield* (A = X).UpdateButtonIcon();
		}
	} else {
		this.icon_state = "cyborg_upgrade5";
	}
	return f.dot;
}, true);

// robot_upgrades.dm:264
rt.def("/obj/item/borg/upgrade/selfrepair/proc/deactivate", function* deactivate(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	this.on = 0;
	yield* this.update_icon();
	return f.dot;
}, true);

// robot_upgrades.dm:269
rt.def("/obj/item/borg/upgrade/selfrepair/proc/process", function* process(f: Frame) {
	let msgmode: Value = null;
	if (!this.repair_tick) {
		this.repair_tick = 1;
		return f.dot;
	}
	if (this.cyborg && this.cyborg.stat != 2 && this.on) {
		if (!this.cyborg.cell) {
			to_chat(this.cyborg, "<span class='warning'>Self-repair module deactivated. Please, insert the power cell.</span>");
			yield* this.deactivate();
			return f.dot;
		}
		if (this.cyborg.cell.charge < this.powercost * 2) {
			to_chat(this.cyborg, "<span class='warning'>Self-repair module deactivated. Please recharge.</span>");
			yield* this.deactivate();
			return f.dot;
		}
		if (this.cyborg.health < this.cyborg.maxHealth) {
			if (this.cyborg.health < 0) {
				this.repair_amount = -2.5;
				this.powercost = 30;
			} else {
				this.repair_amount = -1;
				this.powercost = 10;
			}
			yield* this.cyborg.adjustBruteLoss(this.repair_amount);
			yield* this.cyborg.adjustFireLoss(this.repair_amount);
			yield* this.cyborg.updatehealth();
			yield* this.cyborg.cell.use(this.powercost);
		} else {
			yield* this.cyborg.cell.use(5);
		}
		this.repair_tick = 0;
		if (rt.worldTime(f) - 2000 > this.msg_cooldown) {
			msgmode = "standby";
			if (this.cyborg.health < 0) {
				msgmode = "critical";
			} else if (this.cyborg.health < this.cyborg.maxHealth) {
				msgmode = "normal";
			}
			to_chat(this.cyborg, `<span class='notice'>Self-repair is active in <span class='boldnotice'>${msgmode}</span> mode.</span>`);
			this.msg_cooldown = rt.worldTime(f);
		}
	} else {
		yield* this.deactivate();
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(9835, "/obj/item/borg/upgrade/hypospray", "/obj/item/borg/upgrade", {
	additional_reagents: null,
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/medical"),
	origin_tech: null,
	name: "medical cyborg hypospray advanced synthesiser",
	desc: "An upgrade to the Medical module cyborg's hypospray, allowing it to produce more advanced and complex medical reagents.",
	icon_state: "cyborg_upgrade3",
});

// robot_upgrades.dm:318
rt.def("/obj/item/borg/upgrade/hypospray/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.additional_reagents = list();
	return f.dot;
});

// robot_upgrades.dm:321
rt.def("/obj/item/borg/upgrade/hypospray/proc/action", function* action(f: Frame, R: Value) {
	let H: Value = null, re: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	for (H of each(R.module, T("/obj/item/weapon/reagent_containers/borghypo"))) {
		if (H.accepts_reagent_upgrades) {
			re = null;
			for (re of each(this.additional_reagents)) {
				yield* H.add_reagent(re);
			}
		}
	}
	return 1;
}, true);

rt.type(9838, "/obj/item/borg/upgrade/piercing_hypospray", "/obj/item/borg/upgrade", {
	origin_tech: "materials=5;engineering=7;combat=3",
	name: "cyborg piercing hypospray",
	desc: "An upgrade to a cyborg's hypospray, allowing it to pierce armor and thick material.",
	icon_state: "cyborg_upgrade3",
});

// robot_upgrades.dm:354
rt.def("/obj/item/borg/upgrade/piercing_hypospray/proc/action", function action(f: Frame, R: Value) {
	let H: Value = null;
	if (parent_proc()) {
		return f.dot;
	}
	let found_hypo: Value = 0;
	for (H of each(R.module, T("/obj/item/weapon/reagent_containers/borghypo"))) {
		H.bypass_protection = 1;
		found_hypo = 1;
	}
	if (!found_hypo) {
		return f.dot;
	}
	return 1;
}, false);

rt.type(9839, "/obj/item/borg/upgrade/defib", "/obj/item/borg/upgrade", {
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/medical"),
	origin_tech: "programming=4;engineering=6;materials=5;powerstorage=5;biotech=5",
	name: "medical cyborg defibrillator",
	desc: "An upgrade to the Medical module, installing a builtin defibrillator, for on the scene revival.",
	icon_state: "cyborg_upgrade3",
});

// robot_upgrades.dm:377
rt.def("/obj/item/borg/upgrade/defib/proc/action", function* action(f: Frame, R: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	let S: Value = (yield* new_(T("/obj/item/weapon/twohanded/shockpaddles/cyborg"), R.module));
	R.module.basic_modules += S;
	yield* R.module.add_module(S, 0, 1);
	return 1;
}, true);

rt.type(9840, "/obj/item/borg/upgrade/ai", "/obj/item/borg/upgrade", {
	origin_tech: "engineering=4;magnets=4;programming=4",
	name: "B.O.R.I.S. module",
	desc: "Bluespace Optimized Remote Intelligence Synchronization. An uplink device which takes the place of an MMI in cyborg endoskeletons, creating a robotic shell controlled by an AI.",
	icon_state: "boris",
});

// robot_upgrades.dm:393
rt.def("/obj/item/borg/upgrade/ai/proc/action", function* action(f: Frame, R: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (R.shell) {
		to_chat(f.usr, "<span class='warning'>This unit is already an AI shell!</span>");
		return f.dot;
	}
	if (R.key) {
		to_chat(f.usr, `<span class='warning'>Intelligence patterns detected in this ${R.braintype}. Aborting.</span>`);
		return f.dot;
	}
	yield* R.make_shell(this);
	return 1;
}, true);
