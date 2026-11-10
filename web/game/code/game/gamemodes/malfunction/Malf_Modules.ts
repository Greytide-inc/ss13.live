// Based on /tg/station's code/game/gamemodes/malfunction/Malf_Modules.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


// Malf_Modules.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalblacklisted_malf_machines", function InitGlobalblacklisted_malf_machines(f: Frame) {
	GLOB.blacklisted_malf_machines = typecacheof(list(T("/obj/machinery/field/containment"), T("/obj/machinery/power/supermatter_shard"), T("/obj/machinery/doomsday_device"), T("/obj/machinery/nuclearbomb"), T("/obj/machinery/nuclearbomb/selfdestruct"), T("/obj/machinery/nuclearbomb/syndicate"), T("/obj/machinery/syndicatebomb"), T("/obj/machinery/syndicatebomb/badmin"), T("/obj/machinery/syndicatebomb/badmin/clown"), T("/obj/machinery/syndicatebomb/empty"), T("/obj/machinery/syndicatebomb/self_destruct"), T("/obj/machinery/syndicatebomb/training")));
	this.gvars_datum_init_order += "blacklisted_malf_machines";
	return f.dot;
});

rt.type(102, "/datum/action/innate/ai", "/datum/action/innate", {
	owner_AI: null,
	uses: null,
	auto_use_uses: 1,
	cooldown_period: null,
	name: "AI Action",
	desc: "You aren't entirely sure what this does, but it's very beepy and boopy.",
	background_icon_state: "bg_tech_blue",
	icon_icon: rt.rsc("icons/mob/actions_AI.dmi"),
});

// Malf_Modules.dm:30
rt.def("/datum/action/innate/ai/proc/Grant", function* Grant(f: Frame, L: Value) {
	f.dot = (yield* parent_proc());
	if (!rt.istype(this.owner, T("/mob/living/silicon/ai"))) {
		warning(`${`AI action ${this.name} attempted to grant itself to non-AI mob ${L.real_name} (${L.key})!`} in ${"code/game/gamemodes/malfunction/Malf_Modules.dm"} at line ${32} src: ${this} usr: ${f.usr}.`);
		yield* qdel(this);
	} else {
		this.owner_AI = this.owner;
	}
	return f.dot;
}, true);

// Malf_Modules.dm:38
rt.def("/datum/action/innate/ai/proc/IsAvailable", function IsAvailable(f: Frame) {
	f.dot = parent_proc();
	if (!(this.owner_AI && this.owner_AI.malf_cooldown > rt.worldTime(f))) return f.dot;
	return f.dot;
});

// Malf_Modules.dm:43
rt.def("/datum/action/innate/ai/proc/Trigger", function* Trigger(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.auto_use_uses) {
		yield* this.adjust_uses(-1);
	}
	if (!this.cooldown_period) return f.dot;
	this.owner_AI.malf_cooldown = rt.worldTime(f) + this.cooldown_period;
	return f.dot;
}, true);

// Malf_Modules.dm:50
rt.def("/datum/action/innate/ai/proc/adjust_uses", function* adjust_uses(f: Frame, amt: Value, silent: Value) {
	this.uses += amt;
	if (!silent && this.uses) {
		to_chat(this.owner, `<span class='notice'>${this.name} now has <b>${this.uses}</b> use${this.uses > 1 ? "s" : ""} remaining.</span>`);
	}
	if (this.uses) return f.dot;
	if (rt.initial(f, this, "uses") > 1) {
		to_chat(this.owner, `<span class='warning'>${this.name} has run out of uses!</span>`);
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(103, "/datum/action/innate/ai/ranged", "/datum/action/innate/ai", {
	linked_ability: null,
	linked_ability_type: null,
	auto_use_uses: 0,
	name: "Ranged AI Action",
});

// Malf_Modules.dm:66
rt.def("/datum/action/innate/ai/ranged/proc/New", function* New(f: Frame) {
	if (!this.linked_ability_type) {
		warning(`${`Ranged AI action ${this.name} attempted to spawn without a linked ability!`} in ${"code/game/gamemodes/malfunction/Malf_Modules.dm"} at line ${67} src: ${this} usr: ${f.usr}.`);
		yield* qdel(this);
		return f.dot;
	}
	this.linked_ability = (yield* new_(this.linked_ability_type));
	this.linked_ability.attached_action = this;
	yield* parent_proc();
	return f.dot;
}, true);

// Malf_Modules.dm:75
rt.def("/datum/action/innate/ai/ranged/proc/adjust_uses", function* adjust_uses(f: Frame, amt: Value, silent: Value) {
	this.uses += amt;
	if (!silent && this.uses) {
		to_chat(this.owner, `<span class='notice'>${this.name} now has <b>${this.uses}</b> use${this.uses > 1 ? "s" : ""} remaining.</span>`);
	}
	if (this.uses) return f.dot;
	if (rt.initial(f, this, "uses") > 1) {
		to_chat(this.owner, `<span class='warning'>${this.name} has run out of uses!</span>`);
	}
	yield* this.Remove(this.owner);
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 100, 8);
	return f.dot;
}, true);

// Malf_Modules.dm:85
rt.def("/datum/action/innate/ai/ranged/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.linked_ability);
	this.linked_ability = null;
	return (yield* parent_proc());
}, true);

// Malf_Modules.dm:89
rt.def("/datum/action/innate/ai/ranged/proc/Activate", function* Activate(f: Frame) {
	yield* this.linked_ability.toggle(this.owner);
	return 1;
}, true);

rt.type(11271, "/obj/effect/proc_holder/ranged_ai", "/obj/effect/proc_holder", {
	enable_text: "<span class='notice'>Hello World!</span>",
	disable_text: "<span class='danger'>Goodbye Cruel World!</span>",
	attached_action: null,
});

// Malf_Modules.dm:99
rt.def("/obj/effect/proc_holder/ranged_ai/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.attached_action);
	this.attached_action = null;
	return (yield* parent_proc());
}, true);

// Malf_Modules.dm:104
rt.def("/obj/effect/proc_holder/ranged_ai/proc/toggle", function* toggle(f: Frame, user: Value) {
	if (this.active) {
		yield* this.remove_ranged_ability(this.disable_text);
	} else {
		yield* this.add_ranged_ability(user, this.enable_text);
	}
	return f.dot;
}, true);

rt.type(1290, "/datum/module_picker", "/datum", {
	temp: null,
	processing_time: 50,
	possible_modules: null,
});

// Malf_Modules.dm:116
rt.def("/datum/module_picker/proc/New", function* New(f: Frame) {
	let type: Value = null, AM: Value = null;
	this.possible_modules = list();
	for (type of each(typesof(T("/datum/AI_Module")))) {
		if ((AM = (yield* new_(type))).power_type && AM.power_type != T("/datum/action/innate/ai") || AM.upgrade) {
			this.possible_modules += AM;
		}
	}
	return f.dot;
}, true);

// Malf_Modules.dm:123
rt.def("/datum/module_picker/proc/remove_malf_verbs", function* remove_malf_verbs(f: Frame, AI: Value) {
	let AM: Value = null, A: Value = null;
	for (AM of each(this.possible_modules, T("/datum/AI_Module"))) {
		A = null;
		for (A of each(AI.actions, T("/datum/action"))) {
			if (rt.op(f, "IsType", [], [A, rt.initial(f, AM, "power_type")])) {
				yield* qdel(A);
			}
		}
	}
	return f.dot;
}, true);

// Malf_Modules.dm:129
rt.def("/datum/module_picker/proc/use", function* use(f: Frame, user: Value) {
	let module: Value = null, popup: Value = null;
	let dat: Value = list();
	dat += `<B>Select use of processing time: (currently #${this.processing_time} left.)</B><BR>`;
	dat += "<HR>";
	dat += "<B>Install Module:</B><BR>";
	dat += "<I>The number afterwards is the amount of processing time it consumes.</I><BR>";
	for (module of each(this.possible_modules, T("/datum/AI_Module/large"))) {
		dat += fmt("<A href='byond://?src=＃;＀=1'>＀</A><A href='byond://?src=＃;showdesc=＀'>[?]</A> (＀)<BR>", [this, module.mod_pick_name, module.module_name, this, module.mod_pick_name, module.cost]);
	}
	module = null;
	for (module of each(this.possible_modules, T("/datum/AI_Module/small"))) {
		dat += fmt("<A href='byond://?src=＃;＀=1'>＀</A><A href='byond://?src=＃;showdesc=＀'>[?]</A> (＀)<BR>", [this, module.mod_pick_name, module.module_name, this, module.mod_pick_name, module.cost]);
	}
	dat += "<HR>";
	if (this.temp) {
		dat += `${this.temp}`;
	}
	(popup = (yield* new_(T("/datum/browser"), user, "modpicker", "Malf Module Menu"))).set_content(dat.Join());
	yield* popup.open();
	return f.dot;
}, true);

// Malf_Modules.dm:146
rt.def("/datum/module_picker/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let A: Value = null, AM: Value = null, action: Value = null, AC: Value = null;
	let $e: any;
	yield* parent_proc();
	if (!rt.istype(f.usr, T("/mob/living/silicon/ai"))) {
		return f.dot;
	}
	if ((A = f.usr).stat == 2) {
		to_chat(A, "<span class='warning'>You are already dead!</span>");
		return f.dot;
	}
	for (AM of each(this.possible_modules, T("/datum/AI_Module"))) {
		if (rt.index(href_list, AM.mod_pick_name)) {
			if (AM.cost > this.processing_time) {
				this.temp = "You cannot afford this module.";
				break;
			}
			action = rt.locateIn(f, AM.power_type, A.actions);
			if (AM.upgrade) {
				yield* AM.upgrade(A);
				this.possible_modules -= AM;
				to_chat(A, AM.unlock_text);
				A.playsound_local(A, AM.unlock_sound, 50, 0);
			} else if (AM.power_type) {
				if (!action) {
					yield* (AC = (yield* new_(AM.power_type))).Grant(A);
					A.current_modules += (yield* new_(AM.type));
					this.temp = AM.description;
					if (AM.one_purchase) {
						this.possible_modules -= AM;
					}
					if (AM.unlock_text) {
						to_chat(A, AM.unlock_text);
					}
					if (AM.unlock_sound) {
						A.playsound_local(A, AM.unlock_sound, 50, 0);
					}
				} else {
					action.uses += rt.initial(f, action, "uses");
					this.temp = `Additional use${action.uses > 1 ? "s" : ""} added to ${action.name}!`;
				}
			}
			this.processing_time -= AM.cost;
		}
		if (rt.at(href_list, "showdesc")) {
			if (AM.mod_pick_name == rt.at(href_list, "showdesc")) {
				this.temp = AM.description;
			}
		}
	}
	yield* this.use(f.usr);
	return f.dot;
}, true);

rt.type(106, "/datum/action/innate/ai/nuke_station", "/datum/action/innate/ai", {
	auto_use_uses: 0,
	name: "Doomsday Device",
	desc: "Activates the doomsday device. This is not reversible.",
	button_icon_state: "doomsday_device",
});

// Malf_Modules.dm:234
rt.def("/datum/action/innate/ai/nuke_station/proc/Activate", function* Activate(f: Frame) {
	let _T: Value = null;
	if (!rt.istype((_T = rt.getStep(f, this.owner, 0)), T("/turf")) || _T.z != ZLEVEL_STATION) {
		to_chat(this.owner, "<span class='warning'>You cannot activate the doomsday device while off-station!</span>");
		return f.dot;
	}
	if ((yield* alert(this.owner, "Send arming signal? (true = arm, false = cancel)", "purge_all_life()", "confirm = TRUE;", "confirm = FALSE;")) != "confirm = TRUE;") {
		return f.dot;
	}
	this.active = 1;
	yield* this.set_us_up_the_bomb(this.owner);
	return f.dot;
}, true);

// Malf_Modules.dm:245
rt.def("/datum/action/innate/ai/nuke_station/proc/set_us_up_the_bomb", function* set_us_up_the_bomb(f: Frame, owner: Value) {
	let i: Value = null, pinpointer: Value = null, _P: Value = null;
	let $e: any;
	to_chat(owner, "<span class='small boldannounce'>run -o -a 'selfdestruct'</span>");
	yield* sleep(5);
	if (!owner || !owner || owner.gc_destroyed) {
		return f.dot;
	}
	to_chat(owner, "<span class='small boldannounce'>Running executable 'selfdestruct'...</span>");
	yield* sleep(rand(10, 30));
	if (!owner || !owner || owner.gc_destroyed) {
		return f.dot;
	}
	owner.playsound_local(owner, rt.rsc("sound/misc/bloblarm.ogg"), 50, 0);
	to_chat(owner, "<span class='userdanger'>!!! UNAUTHORIZED SELF-DESTRUCT ACCESS !!!</span>");
	to_chat(owner, "<span class='boldannounce'>This is a class-3 security violation. This incident will be reported to Central Command.</span>");
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* sleep(20);
		if (!owner || !owner || owner.gc_destroyed) {
			return f.dot;
		}
		to_chat(owner, `<span class='boldannounce'>Sending security report to Central Command.....${rand(0, 9) + rand(20, 30) * i}%</span>`);
	}
	rt.endFor(f, 0);
	yield* sleep(3);
	if (!owner || !owner || owner.gc_destroyed) {
		return f.dot;
	}
	to_chat(owner, "<span class='small boldannounce'>auth 'akjv9c88asdf12nb' ******************</span>");
	owner.playsound_local(owner, rt.rsc("sound/items/timer.ogg"), 50, 0);
	yield* sleep(30);
	if (!owner || !owner || owner.gc_destroyed) {
		return f.dot;
	}
	to_chat(owner, "<span class='boldnotice'>Credentials accepted. Welcome, akjv9c88asdf12nb.</span>");
	owner.playsound_local(owner, rt.rsc("sound/misc/server-ready.ogg"), 50, 0);
	yield* sleep(5);
	if (!owner || !owner || owner.gc_destroyed) {
		return f.dot;
	}
	to_chat(owner, "<span class='boldnotice'>Arm self-destruct device? (Y/N)</span>");
	owner.playsound_local(owner, rt.rsc("sound/misc/compiler-stage1.ogg"), 50, 0);
	yield* sleep(20);
	if (!owner || !owner || owner.gc_destroyed) {
		return f.dot;
	}
	to_chat(owner, "<span class='small boldannounce'>Y</span>");
	yield* sleep(15);
	if (!owner || !owner || owner.gc_destroyed) {
		return f.dot;
	}
	to_chat(owner, "<span class='boldnotice'>Confirm arming of self-destruct device? (Y/N)</span>");
	owner.playsound_local(owner, rt.rsc("sound/misc/compiler-stage2.ogg"), 50, 0);
	yield* sleep(10);
	if (!owner || !owner || owner.gc_destroyed) {
		return f.dot;
	}
	to_chat(owner, "<span class='small boldannounce'>Y</span>");
	yield* sleep(rand(15, 25));
	if (!owner || !owner || owner.gc_destroyed) {
		return f.dot;
	}
	to_chat(owner, "<span class='boldnotice'>Please repeat password to confirm.</span>");
	owner.playsound_local(owner, rt.rsc("sound/misc/compiler-stage2.ogg"), 50, 0);
	yield* sleep(14);
	if (!owner || !owner || owner.gc_destroyed) {
		return f.dot;
	}
	to_chat(owner, "<span class='small boldannounce'>******************</span>");
	yield* sleep(40);
	if (!owner || !owner || owner.gc_destroyed) {
		return f.dot;
	}
	to_chat(owner, "<span class='boldnotice'>Credentials accepted. Transmitting arming signal...</span>");
	owner.playsound_local(owner, rt.rsc("sound/misc/server-ready.ogg"), 50, 0);
	yield* sleep(30);
	if (!owner || !owner || owner.gc_destroyed) {
		return f.dot;
	}
	yield* priority_announce("Hostile runtimes detected in all station systems, please deactivate your AI to prevent possible damage to its morality core.", "Anomaly Alert", rt.rsc("sound/ai/aimalf.ogg"));
	set_security_level("delta");
	let DOOM: Value = (yield* new_(T("/obj/machinery/doomsday_device"), this.owner_AI));
	this.owner_AI.nuking = 1;
	this.owner_AI.doomsday_device = DOOM;
	yield* this.owner_AI.doomsday_device.start();
	for (pinpointer of each(GLOB.pinpointer_list)) {
		(_P = pinpointer).switch_mode_to(TRACK_MALF_AI);
	}
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

rt.type(10348, "/obj/machinery/doomsday_device", "/obj/machinery", {
	timing: 0,
	countdown: null,
	detonation_timer: null,
	milestones: null,
	anchored: 1,
	verb_exclaim: "blares",
	icon: rt.rsc("icons/obj/machines/nuke_terminal.dmi"),
	name: "doomsday device",
	icon_state: "nuclearbomb_base",
	desc: "A weapon which disintegrates all organic life in a large area.",
	density: 1,
});

// Malf_Modules.dm:331
rt.def("/obj/machinery/doomsday_device/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.countdown = (yield* new_(T("/obj/effect/countdown/doomsday"), this));
	this.milestones = list();
	return f.dot;
}, true);

// Malf_Modules.dm:336
rt.def("/obj/machinery/doomsday_device/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null, AI: Value = null;
	yield* qdel(this.countdown);
	this.countdown = null;
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	yield* GLOB.SSshuttle.clearHostileEnvironment(this);
	GLOB.SSmapping.remove_nuke_threat(this);
	for (A of each(GLOB.ai_list)) {
		if ((AI = A).doomsday_device == this) {
			AI.doomsday_device = null;
		}
	}
	return (yield* parent_proc());
}, true);

// Malf_Modules.dm:347
rt.def("/obj/machinery/doomsday_device/proc/start", function* start(f: Frame) {
	this.detonation_timer = rt.worldTime(f) + DEFAULT_DOOMSDAY_TIMER;
	this.timing = 1;
	yield* this.countdown.start();
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSfastprocess.processing += this;
	}
	yield* GLOB.SSshuttle.registerHostileEnvironment(this);
	GLOB.SSmapping.add_nuke_threat(this);
	return f.dot;
}, true);

// Malf_Modules.dm:355
rt.def("/obj/machinery/doomsday_device/proc/seconds_remaining", function seconds_remaining(f: Frame) {
	f.dot = max(0, round((this.detonation_timer - rt.worldTime(f)) / 10));
	return f.dot;
});

// Malf_Modules.dm:358
rt.def("/obj/machinery/doomsday_device/proc/process", function* process(f: Frame) {
	let _T: Value = null, sec_left: Value = null, key: Value = null;
	if (!(_T = rt.getStep(f, this, 0)) || _T.z != ZLEVEL_STATION) {
		minor_announce("DOOMSDAY DEVICE OUT OF STATION RANGE, ABORTING", "ERROR ER0RR $R0RRO$!R41.%%!!(%$^^__+ @#F0E4", 1);
		yield* GLOB.SSshuttle.clearHostileEnvironment(this);
		yield* qdel(this);
		return f.dot;
	}
	if (!this.timing) {
		this.isprocessing = 0;
		GLOB.SSfastprocess.processing -= this;
		return f.dot;
	}
	if (!(sec_left = this.seconds_remaining())) {
		this.timing = 0;
		yield* this.detonate(_T.z);
	} else {
		key = num2text(sec_left);
		if (!(!(sec_left % 60) && !rt.isIn(f, key, this.milestones))) return f.dot;
		rt.setAt(this.milestones, key, 1);
		minor_announce(`${key} SECONDS UNTIL DOOMSDAY DEVICE ACTIVATION!`, "ERROR ER0RR $R0RRO$!R41.%%!!(%$^^__+ @#F0E4", 1);
	}
	return f.dot;
}, true, { waitfor: false });

// Malf_Modules.dm:378
rt.def("/obj/machinery/doomsday_device/proc/detonate", function* detonate(f: Frame, z_level: Value) {
	let M: Value = null, L: Value = null, _T: Value = null;
	z_level ??= ZLEVEL_STATION;
	for (M of each(GLOB.player_list, T("/mob"))) {
		rt.op(f, "Output", [], [M, rt.rsc("sound/machines/alarm.ogg")], false);
	}
	yield* sleep(100);
	for (L of each(GLOB.mob_list, T("/mob/living"))) {
		if (!(_T = rt.getStep(f, L, 0)) || _T.z != z_level) {
			continue;
		}
		if (rt.istype(L, T("/mob/living/silicon"))) {
			continue;
		}
		to_chat(L, `<span class='userdanger'>The blast wave from ${this} tears you atom from atom!</span>`);
		yield* L.dust();
	}
	to_chat(rt.world(), "<B>The AI cleansed the station of life with the doomsday device!</B>");
	GLOB.SSticker.force_ending = 1;
	return f.dot;
}, true);

rt.type(1294, "/datum/AI_Module/large/upgrade_turrets", "/datum/AI_Module/large", {
	module_name: "AI Turret Upgrade",
	mod_pick_name: "turret",
	description: "Improves the power and health of all AI turrets. This effect is permanent.",
	cost: 30,
	upgrade: 1,
	unlock_text: "<span class='notice'>You establish a power diversion to your turrets, upgrading their health and damage.</span>",
	unlock_sound: rt.rsc("sound/items/rped.ogg"),
});

// Malf_Modules.dm:404
rt.def("/datum/AI_Module/large/upgrade_turrets/proc/upgrade", function upgrade(f: Frame, AI: Value) {
	let turret: Value = null;
	for (turret of each(GLOB.machines, T("/obj/machinery/porta_turret/ai"))) {
		turret.obj_integrity += 30;
		turret.lethal_projectile = T("/obj/item/projectile/beam/laser/heavylaser");
		turret.lethal_projectile_sound = rt.rsc("sound/weapons/lasercannonfire.ogg");
	}
	return f.dot;
});

rt.type(107, "/datum/action/innate/ai/lockdown", "/datum/action/innate/ai", {
	uses: 1,
	name: "Lockdown",
	desc: "Closes, bolts, and depowers every airlock, firelock, and blast door on the station. After 90 seconds, they will reset themselves.",
	button_icon_state: "lockdown",
});

// Malf_Modules.dm:429
rt.def("/datum/action/innate/ai/lockdown/proc/Activate", function* Activate(f: Frame) {
	let D: Value = null, C: Value = null;
	for (D of each(GLOB.airlocks, T("/obj/machinery/door"))) {
		if (D.z != ZLEVEL_STATION) {
			continue;
		}
		yield* ImmediateInvokeAsync(D, P("/obj/machinery/door/proc/hostile_lockdown"), this);
		yield* addtimer((yield* new_(T("/datum/callback"), D, P("/obj/machinery/door/proc/disable_lockdown"))), 900);
	}
	if (C = rt.locateIn(f, T("/obj/machinery/computer/communications"), GLOB.machines)) {
		yield* C.post_status("alert", "lockdown");
	}
	minor_announce("Hostile runtime detected in door controllers. Isolation lockdown protocols are now in effect. Please remain calm.", "Network Alert:", 1);
	to_chat(this.owner, "<span class='danger'>Lockdown initiated. Network reset in 90 seconds.</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/minor_announce"), "Automatic system reboot complete. Have a secure day.", "Network reset:")), 900);
	return f.dot;
}, true);

rt.type(108, "/datum/action/innate/ai/destroy_rcds", "/datum/action/innate/ai", {
	uses: 1,
	cooldown_period: 100,
	name: "Destroy RCDs",
	desc: "Detonate all non-cyborg RCDs on the station.",
	button_icon_state: "detonate_rcds",
});

// Malf_Modules.dm:465
rt.def("/datum/action/innate/ai/destroy_rcds/proc/Activate", function* Activate(f: Frame) {
	let I: Value = null, RCD: Value = null;
	for (I of each(GLOB.rcd_list)) {
		if (!rt.istype(I, T("/obj/item/weapon/construction/rcd/borg"))) {
			yield* (RCD = I).detonate_pulse();
		}
	}
	to_chat(this.owner, "<span class='danger'>RCD detonation pulse emitted.</span>");
	this.owner.playsound_local(this.owner, rt.rsc("sound/machines/twobeep.ogg"), 50, 0);
	return f.dot;
}, true);

rt.type(1297, "/datum/AI_Module/large/mecha_domination", "/datum/AI_Module/large", {
	module_name: "Unlock Mech Domination",
	mod_pick_name: "mechjack",
	description: "Allows you to hack into a mech's onboard computer, shunting all processes into it and ejecting any occupants. Once uploaded to the mech, it is impossible to leave.Do not allow the mech to leave the station's vicinity or allow it to be destroyed.",
	cost: 30,
	upgrade: 1,
	unlock_text: "<span class='notice'>Virus package compiled. Select a target mech at any time. <b>You must remain on the station at all times. Loss of signal will result in total system lockout.</b></span>",
	unlock_sound: rt.rsc("sound/mecha/nominal.ogg"),
});

// Malf_Modules.dm:485
rt.def("/datum/AI_Module/large/mecha_domination/proc/upgrade", function upgrade(f: Frame, AI: Value) {
	AI.can_dominate_mechs = 1;
	return f.dot;
});

rt.type(109, "/datum/action/innate/ai/break_fire_alarms", "/datum/action/innate/ai", {
	uses: 1,
	name: "Override Thermal Sensors",
	desc: "Disables the automatic temperature sensing on all fire alarms, making them effectively useless.",
	button_icon_state: "break_fire_alarms",
});

// Malf_Modules.dm:507
rt.def("/datum/action/innate/ai/break_fire_alarms/proc/Activate", function Activate(f: Frame) {
	let F: Value = null;
	for (F of each(GLOB.machines, T("/obj/machinery/firealarm"))) {
		if (F.z != ZLEVEL_STATION) {
			continue;
		}
		F.emagged = 1;
	}
	to_chat(this.owner, "<span class='notice'>All thermal sensors on the station have been disabled. Fire alerts will no longer be recognized.</span>");
	this.owner.playsound_local(this.owner, rt.rsc("sound/machines/terminal_off.ogg"), 50, 0);
	return f.dot;
});

rt.type(110, "/datum/action/innate/ai/break_air_alarms", "/datum/action/innate/ai", {
	uses: 1,
	name: "Override Air Alarm Safeties",
	desc: "Enables the Flood setting on all air alarms.",
	button_icon_state: "break_air_alarms",
});

// Malf_Modules.dm:534
rt.def("/datum/action/innate/ai/break_air_alarms/proc/Activate", function Activate(f: Frame) {
	let AA: Value = null;
	for (AA of each(GLOB.machines, T("/obj/machinery/airalarm"))) {
		if (AA.z != ZLEVEL_STATION) {
			continue;
		}
		AA.emagged = 1;
	}
	to_chat(this.owner, "<span class='notice'>All air alarm safeties on the station have been overriden. Air alarms may now use the Flood environmental mode.");
	this.owner.playsound_local(this.owner, rt.rsc("sound/machines/terminal_off.ogg"), 50, 0);
	return f.dot;
});

rt.type(104, "/datum/action/innate/ai/ranged/overload_machine", "/datum/action/innate/ai/ranged", {
	uses: 2,
	name: "Overload Machine",
	desc: "Overheats a machine, causing a small explosion after a short time.",
	button_icon_state: "overload_machine",
	linked_ability_type: rt.typePath("/obj/effect/proc_holder/ranged_ai/overload_machine"),
});

// Malf_Modules.dm:560
rt.def("/datum/action/innate/ai/ranged/overload_machine/proc/detonate_machine", function* detonate_machine(f: Frame, M: Value) {
	if (!(M && !(!M || M.gc_destroyed))) return f.dot;
	yield* explosion(rt.getStep(f, M, 0), 0, 2, 3, 0);
	if (!M) return f.dot;
	yield* qdel(M);
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/machinery" }] });

rt.type(11272, "/obj/effect/proc_holder/ranged_ai/overload_machine", "/obj/effect/proc_holder/ranged_ai", {
	enable_text: "<span class='notice'>You tap into the station's powernet. Click on a machine to detonate it, or use the ability again to cancel.</span>",
	disable_text: "<span class='notice'>You release your hold on the powernet.</span>",
	active: 0,
	ranged_mousepointer: rt.rsc("icons/effects/overload_machine_target.dmi"),
});

// Malf_Modules.dm:572
rt.def("/obj/effect/proc_holder/ranged_ai/overload_machine/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, target: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.ranged_ability_user.incapacitated()) {
		yield* this.remove_ranged_ability();
		return f.dot;
	}
	if (!rt.istype(target, T("/obj/machinery"))) {
		to_chat(this.ranged_ability_user, "<span class='warning'>You can only overload machines!</span>");
		return f.dot;
	}
	if (is_type_in_typecache(target, GLOB.blacklisted_malf_machines)) {
		to_chat(this.ranged_ability_user, "<span class='warning'>You cannot overload that device!</span>");
		return f.dot;
	}
	this.ranged_ability_user.playsound_local(this.ranged_ability_user, "sparks", 50, 0);
	yield* this.attached_action.adjust_uses(-1);
	target.audible_message(`<span class='userdanger'>You hear a loud electrical buzzing sound coming from ${target}!</span>`);
	yield* addtimer((yield* new_(T("/datum/callback"), this.attached_action, P("/datum/action/innate/ai/ranged/overload_machine/proc/detonate_machine"), target)), 50);
	yield* this.remove_ranged_ability("<span class='danger'>Overcharging machine...</span>");
	return 1;
}, true);

rt.type(105, "/datum/action/innate/ai/ranged/override_machine", "/datum/action/innate/ai/ranged", {
	uses: 4,
	name: "Override Machine",
	desc: "Animates a targeted machine, causing it to attack anyone nearby.",
	button_icon_state: "override_machine",
	linked_ability_type: rt.typePath("/obj/effect/proc_holder/ranged_ai/override_machine"),
});

// Malf_Modules.dm:609
rt.def("/datum/action/innate/ai/ranged/override_machine/proc/animate_machine", function* animate_machine(f: Frame, M: Value) {
	if (!(M && !(!M || M.gc_destroyed))) return f.dot;
	yield* new_(T("/mob/living/simple_animal/hostile/mimic/copy/machine"), rt.getStep(f, M, 0), M, this.owner, 1);
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/machinery" }] });

rt.type(11273, "/obj/effect/proc_holder/ranged_ai/override_machine", "/obj/effect/proc_holder/ranged_ai", {
	enable_text: "<span class='notice'>You tap into the station's powernet. Click on a machine to animate it, or use the ability again to cancel.</span>",
	disable_text: "<span class='notice'>You release your hold on the powernet.</span>",
	active: 0,
	ranged_mousepointer: rt.rsc("icons/effects/override_machine_target.dmi"),
});

// Malf_Modules.dm:619
rt.def("/obj/effect/proc_holder/ranged_ai/override_machine/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, target: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.ranged_ability_user.incapacitated()) {
		yield* this.remove_ranged_ability();
		return f.dot;
	}
	if (!rt.istype(target, T("/obj/machinery"))) {
		to_chat(this.ranged_ability_user, "<span class='warning'>You can only animate machines!</span>");
		return f.dot;
	}
	if (!target.can_be_overridden() || is_type_in_typecache(target, GLOB.blacklisted_malf_machines)) {
		to_chat(this.ranged_ability_user, "<span class='warning'>That machine can't be overriden!</span>");
		return f.dot;
	}
	this.ranged_ability_user.playsound_local(this.ranged_ability_user, rt.rsc("sound/misc/interference.ogg"), 50, 0);
	yield* this.attached_action.adjust_uses(-1);
	target.audible_message(`<span class='userdanger'>You hear a loud electrical buzzing sound coming from ${target}!</span>`);
	yield* addtimer((yield* new_(T("/datum/callback"), this.attached_action, P("/datum/action/innate/ai/ranged/override_machine/proc/animate_machine"), target)), 50);
	yield* this.remove_ranged_ability("<span class='danger'>Sending override signal...</span>");
	return 1;
}, true);

rt.type(111, "/datum/action/innate/ai/place_transformer", "/datum/action/innate/ai", {
	turfOverlays: null,
	uses: 1,
	auto_use_uses: 0,
	name: "Place Robotics Factory",
	desc: "Places a machine that converts humans into cyborgs. Conveyor belts included!",
	button_icon_state: "robotic_factory",
});

// Malf_Modules.dm:658
rt.def("/datum/action/innate/ai/place_transformer/proc/New", function* New(f: Frame) {
	let i: Value = null, I: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		I = (yield* image({ icon: rt.rsc("icons/turf/overlays.dmi") }));
		if (!this.turfOverlays) {
			this.turfOverlays = list();
		}
		this.turfOverlays += I;
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// Malf_Modules.dm:664
rt.def("/datum/action/innate/ai/place_transformer/proc/Activate", function* Activate(f: Frame) {
	let conveyor: Value = null;
	if (!(yield* this.owner_AI.can_place_transformer(this))) {
		return f.dot;
	}
	this.active = 1;
	if ((yield* alert(this.owner, "Are you sure you want to place the machine here?", "Are you sure?", "Yes", "No")) == "No") {
		this.active = 0;
		return f.dot;
	}
	if (!(yield* this.owner_AI.can_place_transformer(this))) {
		return f.dot;
	}
	let _T: Value = rt.getStep(f, this.owner_AI.eyeobj, 0);
	(conveyor = (yield* new_(T("/obj/machinery/transformer"), _T))).masterAI = this.owner;
	playsound(_T, rt.rsc("sound/effects/phasein.ogg"), 100, 1);
	this.owner_AI.can_shunt = 1;
	to_chat(this.owner, "<span class='warning'>You are no longer able to shunt your core to APCs.</span>");
	yield* this.adjust_uses(-1);
	return f.dot;
}, true);

// Malf_Modules.dm:681
rt.def("/mob/living/silicon/ai/proc/remove_transformer_image", function remove_transformer_image(f: Frame, C: Value, I: Value, _T: Value) {
	if (!(C && I.loc == _T)) return f.dot;
	C.images -= I;
	return f.dot;
}, false, { argTypes: [{ path: "/client" }, { path: "/image" }, { path: "/turf" }] });

// Malf_Modules.dm:685
rt.def("/mob/living/silicon/ai/proc/can_place_transformer", function* can_place_transformer(f: Frame, action: Value) {
	let n: Value = null, _T: Value = null, C: Value = null, AM: Value = null, I: Value = null;
	let $e: any;
	if (!this.eyeobj || !isturf(this.loc) || !this.canUseTopic() || !action) {
		return f.dot;
	}
	let middle: Value = rt.getStep(f, this.eyeobj, 0);
	let turfs: Value = list(middle, rt.locate(middle.x - 1, middle.y, middle.z), rt.locate(middle.x + 1, middle.y, middle.z));
	let alert_msg: Value = "There isn't enough room! Make sure you are placing the machine in a clear area and on a floor.";
	let success: Value = 1;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		n = $e;
		if (!rt.istype((_T = rt.index(turfs, n)), T("/turf/open/floor"))) {
			success = 0;
		}
		if (!rt.index((C = GLOB.cameranet.getCameraChunk(_T.x, _T.y, _T.z)).visibleTurfs, _T)) {
			alert_msg = "You don't have camera vision of this location!";
			success = 0;
		}
		AM = null;
		for (AM of each(_T.contents, T("/atom/movable"))) {
			if (AM.density) {
				alert_msg = "That area must be clear of objects!";
				success = 0;
			}
		}
		(I = rt.index(action.turfOverlays, n)).loc = _T;
		this.client.images += I;
		I.icon_state = `${success ? "green" : "red"}Overlay`;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/silicon/ai/proc/remove_transformer_image"), this.client, I, _T)), 30);
	}
	rt.endFor(f, 0);
	if (!success) {
		to_chat(this, `<span class='warning'>${alert_msg}</span>`);
	}
	return success;
}, true);

rt.type(112, "/datum/action/innate/ai/blackout", "/datum/action/innate/ai", {
	uses: 3,
	name: "Blackout",
	desc: "Overloads lights across the station.",
	button_icon_state: "blackout",
});

// Malf_Modules.dm:730
rt.def("/datum/action/innate/ai/blackout/proc/Activate", function* Activate(f: Frame) {
	let apc: Value = null;
	for (apc of each(GLOB.apcs_list, T("/obj/machinery/power/apc"))) {
		if (prob(30 * apc.overload)) {
			yield* apc.overload_lighting();
		} else {
			apc.overload++;
		}
	}
	to_chat(this.owner, "<span class='notice'>Overcurrent applied to the powernet.</span>");
	this.owner.playsound_local(this.owner, "sparks", 50, 0);
	return f.dot;
}, true);

rt.type(113, "/datum/action/innate/ai/reactivate_cameras", "/datum/action/innate/ai", {
	uses: 30,
	auto_use_uses: 0,
	cooldown_period: 30,
	name: "Reactivate Cameras",
	desc: "Reactivates disabled cameras across the station; remaining uses can be used later.",
	button_icon_state: "reactivate_cameras",
});

// Malf_Modules.dm:759
rt.def("/datum/action/innate/ai/reactivate_cameras/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.desc = `${this.desc} There are 30 reactivations remaining.`;
	this.button.desc = this.desc;
	return f.dot;
}, true);

// Malf_Modules.dm:765
rt.def("/datum/action/innate/ai/reactivate_cameras/proc/Activate", function* Activate(f: Frame) {
	let V: Value = null, C: Value = null;
	let fixed_cameras: Value = 0;
	for (V of each(GLOB.cameranet.cameras)) {
		if (!this.uses) {
			break;
		}
		if (!(C = V).status || C.view_range != rt.initial(f, C, "view_range")) {
			yield* C.toggle_cam(this.owner_AI, 0);
			C.view_range = rt.initial(f, C, "view_range");
			fixed_cameras++;
			this.uses--;
		}
	}
	to_chat(this.owner, `<span class='notice'>Diagnostic complete! Cameras reactivated: <b>${fixed_cameras}</b>. Reactivations remaining: <b>${this.uses}</b>.</span>`);
	this.owner.playsound_local(this.owner, rt.rsc("sound/items/wirecutter.ogg"), 50, 0);
	yield* this.adjust_uses(0, 1);
	if (!(this && this.uses)) return f.dot;
	this.desc = `${rt.initial(f, this, "desc")} There are ${this.uses} reactivations remaining.`;
	return f.dot;
}, true);

rt.type(1301, "/datum/AI_Module/large/upgrade_cameras", "/datum/AI_Module/large", {
	module_name: "Upgrade Camera Network",
	mod_pick_name: "upgradecam",
	description: "Install broad-spectrum scanning and electrical redundancy firmware to the camera network, enabling EMP-proofing and light-amplified X-ray vision.",
	one_purchase: 1,
	cost: 35,
	upgrade: 1,
	unlock_text: "<span class='notice'>OTA firmware distribution complete! Cameras upgraded: CAMSUPGRADED. Light amplification system online.</span>",
	unlock_sound: rt.rsc("sound/items/rped.ogg"),
});

// Malf_Modules.dm:794
rt.def("/datum/AI_Module/large/upgrade_cameras/proc/upgrade", function* upgrade(f: Frame, AI: Value) {
	let V: Value = null, C: Value = null, upgraded: Value = null;
	AI.see_override = 5;
	yield* AI.update_sight();
	let upgraded_cameras: Value = 0;
	for (V of each(GLOB.cameranet.cameras)) {
		if ((C = V).assembly) {
			upgraded = 0;
			if (!C.isXRay()) {
				yield* C.upgradeXRay();
				GLOB.cameranet.updateVisibility(C, 0);
				upgraded = 1;
			}
			if (!C.isEmpProof()) {
				yield* C.upgradeEmpProof();
				upgraded = 1;
			}
			if (upgraded) {
				upgraded_cameras++;
			}
		}
	}
	this.unlock_text = replacetext(this.unlock_text, "CAMSUPGRADED", `<b>${upgraded_cameras}</b>`);
	return f.dot;
}, true);

rt.type(1302, "/datum/AI_Module/large/eavesdrop", "/datum/AI_Module/large", {
	module_name: "Enhanced Surveillance",
	mod_pick_name: "eavesdrop",
	description: "Via a combination of hidden microphones and lip reading software, you are able to use your cameras to listen in on conversations.",
	cost: 30,
	one_purchase: 1,
	upgrade: 1,
	unlock_text: "<span class='notice'>OTA firmware distribution complete! Cameras upgraded: Enhanced surveillance package online.</span>",
	unlock_sound: rt.rsc("sound/items/rped.ogg"),
});

// Malf_Modules.dm:829
rt.def("/datum/AI_Module/large/eavesdrop/proc/upgrade", function upgrade(f: Frame, AI: Value) {
	if (!AI.eyeobj) return f.dot;
	AI.eyeobj.relay_speech = 1;
	return f.dot;
});
