// Based on /tg/station's code/modules/mob/living/silicon/ai/ai.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


// ai.dm:6
rt.def("/proc/AutoUpdateAI", function* AutoUpdateAI(f: Frame, subject: Value) {
	let A: Value = null, M: Value = null;
	let is_in_use: Value = 0;
	if (subject !== null) {
		for (A of each(GLOB.ai_list)) {
			if ((M = A).client && M.machine == subject) {
				is_in_use = 1;
				yield* subject.attack_ai(M);
			}
		}
	}
	return is_in_use;
}, true);

rt.type(4833, "/mob/living/silicon/ai", "/mob/living/silicon", {
	network: null,
	current: null,
	connected_robots: null,
	aiRestorePowerRoutine: 0,
	requires_power: 1,
	can_be_carded: 1,
	alarms: null,
	viewalerts: 0,
	holo_icon: null,
	controlled_mech: null,
	radio_enabled: 1,
	aiPDA: null,
	aiMulti: null,
	Bot: null,
	tracking: 0,
	spark_system: null,
	malf_picker: null,
	current_modules: null,
	can_dominate_mechs: 0,
	shunted: 0,
	control_disabled: 0,
	malfhacking: 0,
	malf_cooldown: 0,
	malfhack: null,
	explosive: 0,
	parent: null,
	camera_light_on: 0,
	lit_cameras: null,
	track: null,
	last_paper_seen: null,
	can_shunt: 1,
	last_announcement: "",
	waypoint: null,
	waypoint_mode: 0,
	call_bot_cooldown: 0,
	apc_override: 0,
	nuking: 0,
	doomsday_device: null,
	sprint: 10,
	cooldown: 0,
	acceleration: 1,
	builtInCamera: null,
	linked_core: null,
	deployed_shell: null,
	deploy_action: null,
	redeploy_action: null,
	chnotify: 0,
	eyeobj: null,
	anchored: 1,
	name: "AI",
	icon: rt.rsc("icons/mob/ai.dmi"),
	icon_state: "ai",
	density: 1,
	canmove: 0,
	status_flags: 9,
	a_intent: "harm",
	sight: 28,
	see_in_dark: 8,
	med_hud: 3,
	sec_hud: 1,
	mob_size: 3,
	radiomod: ";",
});

// ai.dm:29
rt.def("/mob/living/silicon/ai/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.network = list("SS13");

	this.connected_robots = list();

	this.alarms = rt.alist(f, ["Motion", list(), "Fire", list(), "Atmosphere", list(), "Power", list(), "Camera", list(), "Burglar", list()]);

	this.current_modules = list();

	this.lit_cameras = list();

	this.track = (yield* new_(T("/datum/trackable")));

	this.deploy_action = (yield* new_(T("/datum/action/innate/deploy_shell")));

	this.redeploy_action = (yield* new_(T("/datum/action/innate/deploy_last_shell")));

	this.eyeobj = (yield* new_(T("/mob/camera/aiEye")));
	return f.dot;
}, true);

// ai.dm:91
rt.def("/mob/living/silicon/ai/proc/Initialize", function* Initialize(f: Frame, mapload: Value, L: Value, target_ai: Value) {
	yield* parent_proc();
	if (!target_ai) {
		yield* new_(T("/obj/structure/AIcore/deactivated"), this.loc);
		yield* qdel(this);
		return f.dot;
	}
	if (L && rt.istype(L, T("/datum/ai_laws"))) {
		this.laws = L;
		this.laws.associate(this);
	} else {
		yield* this.make_laws();
	}
	if (target_ai.mind) {
		yield* target_ai.mind.transfer_to(this);
		if (this.mind.special_role) {
			this.mind.store_memory("As an AI, you must obey your silicon laws above all else. Your objectives will consider you to be dead.");
			to_chat(this, "<span class='userdanger'>You have been installed as an AI! </span>");
			to_chat(this, "<span class='danger'>You must obey your silicon laws above all else. Your objectives will consider you to be dead.</span>");
		}
	}
	to_chat(this, "<B>You are playing the station's AI. The AI cannot move, but can interact with many objects while viewing them (through cameras).</B>");
	to_chat(this, "<B>To look at other parts of the station, click on yourself to get a camera menu.</B>");
	to_chat(this, "<B>While observing through a camera, you can use most (networked) devices which you can see, such as computers, APCs, intercoms, doors, etc.</B>");
	to_chat(this, "To use something, simply click on it.");
	to_chat(this, "Use say :b to speak to your cyborgs through binary.");
	to_chat(this, "For department channels, use the following say commands:");
	to_chat(this, ":o - AI Private, :c - Command, :s - Security, :e - Engineering, :u - Supply, :v - Service, :m - Medical, :n - Science.");
	yield* this.show_laws();
	to_chat(this, "<b>These laws may be changed by other players, or by you being the traitor.</b>");
	this.job = "AI";
	this.eyeobj.ai = this;
	this.eyeobj.loc = this.loc;
	yield* this.rename_self("ai");
	this.holo_icon = getHologramIcon(icon(rt.rsc("icons/mob/ai.dmi"), "default"));
	this.spark_system = (yield* new_(T("/datum/effect_system/spark_spread")));
	yield* this.spark_system.set_up(5, 0, this);
	yield* this.spark_system.attach(this);
	this.verbs += P("/mob/living/silicon/ai/proc/show_laws_verb");
	this.aiPDA = (yield* new_(T("/obj/item/device/pda/ai"), this));
	this.aiPDA.owner = this.name;
	this.aiPDA.ownjob = "AI";
	this.aiPDA.name = this.name + " (" + this.aiPDA.ownjob + ")";
	this.aiMulti = (yield* new_(T("/obj/item/device/multitool"), this));
	this.radio = (yield* new_(T("/obj/item/device/radio/headset/ai"), this));
	this.aicamera = (yield* new_(T("/obj/item/device/camera/siliconcam/ai_camera"), this));
	yield* this.deploy_action.Grant(this);
	if (isturf(this.loc)) {
		this.verbs.Add(P("/mob/living/silicon/ai/proc/ai_network_change"), P("/mob/living/silicon/ai/proc/ai_statuschange"), P("/mob/living/silicon/ai/proc/ai_hologram_change"), P("/mob/living/silicon/ai/proc/toggle_camera_light"), P("/mob/living/silicon/ai/proc/botcall"), P("/mob/living/silicon/ai/proc/control_integrated_radio"), P("/mob/living/silicon/ai/proc/set_automatic_say_channel"));
	}
	GLOB.ai_list += this;
	GLOB.shuttle_caller_list += this;
	this.builtInCamera = (yield* new_(T("/obj/machinery/camera/portable"), this));
	this.builtInCamera.network = list("SS13");
	return f.dot;
}, true);

// ai.dm:159
rt.def("/mob/living/silicon/ai/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.ai_list -= this;
	GLOB.shuttle_caller_list -= this;
	yield* GLOB.SSshuttle.autoEvac();
	yield* qdel(this.eyeobj);
	this.malfhack = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// ai.dm:169
rt.def("/mob/living/silicon/ai/proc/IgniteMob", function* IgniteMob(f: Frame) {
	this.fire_stacks = 0;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// ai.dm:174
rt.def("/mob/living/silicon/ai/verb/pick_icon", function* pick_icon(f: Frame) {
	let icontype: Value = null;
	if (this.stat || this.aiRestorePowerRoutine) {
		return f.dot;
	}
	if ((icontype = (yield* g.op(f, "Prompt", [0], [null, null, "AI", "Please, select a display!", list("Clown", "Monochrome", "Blue", "Inverted", "Firewall", "Green", "Red", "Static", "Red October", "House", "Heartline", "Hades", "Helios", "President", "Syndicat Meow", "Alien", "Too Deep", "Triumvirate", "Triumvirate-M", "Text", "Matrix", "Dorf", "Bliss", "Not Malf", "Fuzzy", "Goon", "Database", "Glitchman", "Murica", "Nanotrasen", "Gentoo", "Angel")]))) == "Clown") {
		this.icon_state = "ai-clown2";
	} else if (icontype == "Monochrome") {
		this.icon_state = "ai-mono";
	} else if (icontype == "Blue") {
		this.icon_state = "ai";
	} else if (icontype == "Inverted") {
		this.icon_state = "ai-u";
	} else if (icontype == "Firewall") {
		this.icon_state = "ai-magma";
	} else if (icontype == "Green") {
		this.icon_state = "ai-wierd";
	} else if (icontype == "Red") {
		this.icon_state = "ai-malf";
	} else if (icontype == "Static") {
		this.icon_state = "ai-static";
	} else if (icontype == "Red October") {
		this.icon_state = "ai-redoctober";
	} else if (icontype == "House") {
		this.icon_state = "ai-house";
	} else if (icontype == "Heartline") {
		this.icon_state = "ai-heartline";
	} else if (icontype == "Hades") {
		this.icon_state = "ai-hades";
	} else if (icontype == "Helios") {
		this.icon_state = "ai-helios";
	} else if (icontype == "President") {
		this.icon_state = "ai-pres";
	} else if (icontype == "Syndicat Meow") {
		this.icon_state = "ai-syndicatmeow";
	} else if (icontype == "Alien") {
		this.icon_state = "ai-alien";
	} else if (icontype == "Too Deep") {
		this.icon_state = "ai-toodeep";
	} else if (icontype == "Triumvirate") {
		this.icon_state = "ai-triumvirate";
	} else if (icontype == "Triumvirate-M") {
		this.icon_state = "ai-triumvirate-malf";
	} else if (icontype == "Text") {
		this.icon_state = "ai-text";
	} else if (icontype == "Matrix") {
		this.icon_state = "ai-matrix";
	} else if (icontype == "Dorf") {
		this.icon_state = "ai-dorf";
	} else if (icontype == "Bliss") {
		this.icon_state = "ai-bliss";
	} else if (icontype == "Not Malf") {
		this.icon_state = "ai-notmalf";
	} else if (icontype == "Fuzzy") {
		this.icon_state = "ai-fuzz";
	} else if (icontype == "Goon") {
		this.icon_state = "ai-goon";
	} else if (icontype == "Database") {
		this.icon_state = "ai-database";
	} else if (icontype == "Glitchman") {
		this.icon_state = "ai-glitchman";
	} else if (icontype == "Murica") {
		this.icon_state = "ai-murica";
	} else if (icontype == "Nanotrasen") {
		this.icon_state = "ai-nanotrasen";
	} else if (icontype == "Gentoo") {
		this.icon_state = "ai-gentoo";
	} else {
		if (icontype != "Angel") return f.dot;
		this.icon_state = "ai-angel";
	}
	return f.dot;
}, true, { verb: { name: "Set AI Core Display", category: "AI Commands" } });

// ai.dm:248
rt.def("/mob/living/silicon/ai/proc/Stat", function* Stat(f: Frame) {
	let borg_area: Value = null, R: Value = null, robot_status: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	if (!this.stat) {
		stat(null, `System integrity: ${(this.health + 100) / 2}%`);
		stat(null, `Connected cyborgs: ${rt.len(f, this.connected_robots)}`);
		for (R of each(this.connected_robots, T("/mob/living/silicon/robot"))) {
			borg_area = get_area(R);
			robot_status = "Nominal";
			if (R.shell) {
				robot_status = "AI SHELL";
			} else if (R.stat || !R.client) {
				robot_status = "OFFLINE";
			} else if (!R.cell || R.cell.charge <= 0) {
				robot_status = "DEPOWERED";
			}
			$0 = null;
			$1 = R.name;
			$2 = R.health;
			if (R.cell) {
				$3 = `${R.cell.charge}/${R.cell.maxcharge}`;
			} else {
				$3 = "Empty";
			}
			stat($0, `${$1} | S.Integrity: ${$2}% | Cell: ${$3} | Module: ${R.designation} | Loc: ${borg_area.name} | Status: ${robot_status}`);
		}
		stat(null, `AI shell beacons detected: ${rt.length(GLOB.available_ai_shells)}`);
	} else {
		stat(null, "Systems nonfunctional");
	}
	return f.dot;
}, true);

// ai.dm:271
rt.def("/mob/living/silicon/ai/proc/ai_alerts", function ai_alerts(f: Frame) {
	let cat: Value = null, L: Value = null, alarm: Value = null, alm: Value = null, A: Value = null, C: Value = null, sources: Value = null, dat2: Value = null, I: Value = null, Ctmp: Value = null;
	let $e: any;
	let dat: Value = "<HEAD><TITLE>Current Station Alerts</TITLE><META HTTP-EQUIV='Refresh' CONTENT='10'></HEAD><BODY>\n";
	dat += fmt("<A HREF='?src=＃;mach_close=aialerts'>Close</A><BR><BR>", [this]);
	for (cat of each(this.alarms)) {
		dat += `<B>${cat}</B><BR>\n`;
		if (rt.len(f, (L = rt.index(this.alarms, cat)))) {
			alarm = null;
			for (alarm of each(L)) {
				alm = rt.index(L, alarm);
				A = rt.index(alm, 1);
				C = rt.index(alm, 2);
				sources = rt.index(alm, 3);
				dat += "<NOBR>";
				if (C && rt.istype(C, T("/list"))) {
					dat2 = "";
					I = null;
					for (I of each(C, T("/obj/machinery/camera"))) {
						dat2 += fmt("＀<A HREF=?src=＃;switchcamera=＃>＀</A>", [dat2 == "" ? "" : " | ", this, I, I.c_tag]);
					}
					dat += `-- ${A.name} (${dat2 != "" ? dat2 : "No Camera"})`;
				} else if (C && rt.istype(C, T("/obj/machinery/camera"))) {
					Ctmp = C;
					dat += fmt("-- ＀ (<A HREF=?src=＃;switchcamera=＃>＀</A>)", [A.name, this, C, Ctmp.c_tag]);
				} else {
					dat += `-- ${A.name} (No Camera)`;
				}
				if (rt.len(f, sources) > 1) {
					dat += `- ${rt.len(f, sources)} sources`;
				}
				dat += "</NOBR><BR>\n";
			}
		} else {
			dat += "-- All Systems Nominal<BR>\n";
		}
		dat += "<BR>\n";
	}
	this.viewalerts = 1;
	rt.op(f, "Browse", [], [this, dat, "window=aialerts&can_close=0"], false);
	return f.dot;
});

// ai.dm:304
rt.def("/mob/living/silicon/ai/proc/ai_roster", function ai_roster(f: Frame) {
	let dat: Value = "<html><head><title>Crew Roster</title></head><body><b>Crew Roster:</b><br><br>";
	dat += GLOB.data_core.get_manifest();
	dat += "</body></html>";
	rt.op(f, "Browse", [], [this, dat, "window=airoster"], false);
	onclose(this, "airoster");
	return f.dot;
});

// ai.dm:313
rt.def("/mob/living/silicon/ai/proc/ai_call_shuttle", function* ai_call_shuttle(f: Frame) {
	let AI: Value = null, reason: Value = null, C: Value = null;
	if (this.stat == 2) {
		return f.dot;
	}
	if (rt.istype(f.usr, T("/mob/living/silicon/ai"))) {
		if ((AI = this).control_disabled) {
			to_chat(f.usr, "Wireless control is disabled!");
			return f.dot;
		}
	}
	if (trim((reason = (yield* g.op(f, "Prompt", [3], [null, "Confirm Shuttle Call", `What is the nature of your emergency? (${CALL_SHUTTLE_REASON_LENGTH} characters required.)`, this, null]))))) {
		yield* GLOB.SSshuttle.requestEvac(this, reason);
	}
	if (GLOB.SSshuttle.emergency && (GLOB.SSshuttle.emergency.mode == "idle" || GLOB.SSshuttle.emergency.mode == "recall")) return f.dot;
	if (!(C = rt.locateIn(f, T("/obj/machinery/computer/communications"), GLOB.machines))) return f.dot;
	yield* C.post_status("shuttle");
	return f.dot;
}, true);

// ai.dm:333
rt.def("/mob/living/silicon/ai/cancel_camera", function* cancel_camera(f: Frame) {
	yield* this.view_core();
	return f.dot;
}, true, { verb: { name: "Cancel Camera View", category: "OOC" } });

// ai.dm:338
rt.def("/mob/living/silicon/ai/verb/toggle_anchor", function toggle_anchor(f: Frame) {
	if (!isturf(this.loc)) {
		return f.dot;
	}
	if (this.stat == 2) {
		return f.dot;
	}
	this.anchored = (!this.anchored ? 1 : 0);
	let $0: any = this;
	to_chat($0, `<b>You are now ${this.anchored ? "" : "un"}anchored.</b>`);
	return f.dot;
}, false, { verb: { name: "Toggle Floor Bolts", category: "AI Commands" } });

// ai.dm:352
rt.def("/mob/living/silicon/ai/proc/ai_cancel_call", function* ai_cancel_call(f: Frame) {
	let AI: Value = null;
	if (this.stat == 2) {
		return f.dot;
	}
	if (rt.istype(f.usr, T("/mob/living/silicon/ai"))) {
		if ((AI = this).control_disabled) {
			to_chat(this, "Wireless control is disabled!");
			return f.dot;
		}
	}
	yield* GLOB.SSshuttle.cancelEvac(this);
	return f.dot;
}, true, { verb: { category: "Malfunction" } });

// ai.dm:366
rt.def("/mob/living/silicon/ai/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let t1: Value = null, H: Value = null, string: Value = null, trackeable: Value = null, target: Value = null, I: Value = null, M: Value = null;
	if (f.usr != this) {
		return f.dot;
	}
	yield* parent_proc();
	if (rt.at(href_list, "mach_close")) {
		if (rt.at(href_list, "mach_close") == "aialerts") {
			this.viewalerts = 0;
		}
		t1 = `window=${rt.at(href_list, "mach_close")}`;
		yield* this.unset_machine();
		rt.op(f, "Browse", [], [this, null, t1], false);
	}
	if (rt.at(href_list, "switchcamera")) {
		(rt.isIn(f, (yield* this.switchCamera(rt.locateIn(f, rt.at(href_list, "switchcamera"), rt.world()))), GLOB.cameranet.cameras) ? AI_VOX : 0);
	}
	if (rt.at(href_list, "showalerts")) {
		this.ai_alerts();
	}
	if (rt.at(href_list, "say_word")) {
		play_vox_word(rt.at(href_list, "say_word"), null, this);
		return f.dot;
	}
	if (rt.at(href_list, "show_paper")) {
		if (this.last_paper_seen) {
			rt.op(f, "Browse", [], [this, this.last_paper_seen, "window=show_paper"], false);
		}
	}
	if (rt.at(href_list, "jumptoholopad")) {
		H = rt.locateIn(f, rt.at(href_list, "jumptoholopad"), rt.world());
		if (this.stat == 0) {
			if (H) {
				yield* H.attack_ai(this);
			} else {
				to_chat(this, "<span class='notice'>Unable to locate the holopad.</span>");
			}
		}
	}
	if (rt.at(href_list, "track")) {
		string = rt.at(href_list, "track");
		yield* this.trackable_mobs();
		trackeable = list();
		trackeable += this.track.humans + this.track.others;
		target = list();
		for (I of each(trackeable)) {
			if ((M = rt.index(trackeable, I)).name == string) {
				target += M;
			}
		}
		if (this.name == string) {
			target += this;
		}
		if (rt.len(f, target)) {
			this.ai_actual_track(pick(target));
		} else {
			to_chat(this, "Target is not on or near any active cameras on the station.");
		}
		return f.dot;
	}
	if (rt.at(href_list, "callbot")) {
		if (this.call_bot_cooldown > rt.worldTime(f)) {
			to_chat(this, "<span class='danger'>Error: Your last call bot command is still processing, please wait for the bot to finish calculating a route.</span>");
			return f.dot;
		}
		this.Bot = rt.locateIn(f, rt.at(href_list, "callbot"), GLOB.living_mob_list);
		if (!this.Bot || this.Bot.remote_disabled || this.control_disabled) {
			return f.dot;
		}
		this.waypoint_mode = 1;
		to_chat(this, "<span class='notice'>Set your waypoint by clicking on a valid location free of obstructions.</span>");
		return f.dot;
	}
	if (rt.at(href_list, "interface")) {
		this.Bot = rt.locateIn(f, rt.at(href_list, "interface"), GLOB.living_mob_list);
		if (!this.Bot || this.Bot.remote_disabled || this.control_disabled) {
			return f.dot;
		}
		yield* this.Bot.attack_ai(this);
	}
	if (rt.at(href_list, "botrefresh")) {
		yield* this.botcall();
		return f.dot;
	}
	if (!rt.at(href_list, "ai_take_control")) return f.dot;
	let M_0: Value = rt.locateIn(f, rt.at(href_list, "ai_take_control"), rt.world());
	if (this.controlled_mech) {
		to_chat(this, "<span class='warning'>You are already loaded into an onboard computer!</span>");
		return f.dot;
	}
	if (!GLOB.cameranet.checkCameraVis(M_0)) {
		to_chat(this, "<span class='warning'>Exosuit is no longer near active cameras.</span>");
		return f.dot;
	}
	if (this.lacks_power()) {
		to_chat(this, "<span class='warning'>You're depowered!</span>");
		return f.dot;
	}
	if (!isturf(this.loc)) {
		to_chat(this, "<span class='warning'>You aren't in your core!</span>");
		return f.dot;
	}
	if (!M_0) return f.dot;
	yield* M_0.transfer_ai(AI_MECH_HACK, this, f.usr);
	return f.dot;
}, true);

// ai.dm:451
rt.def("/mob/living/silicon/ai/proc/switchCamera", function* switchCamera(f: Frame, C: Value) {
	if (!this.tracking) {
		this.cameraFollow = null;
	}
	if (!C || this.stat == 2) {
		return 0;
	}
	if (!this.eyeobj) {
		yield* this.view_core();
		return f.dot;
	}
	yield* this.eyeobj.setLoc(rt.getStep(f, C, 0));
	return 1;
}, true);

// ai.dm:470
rt.def("/mob/living/silicon/ai/proc/botcall", function* botcall(f: Frame) {
	let d: Value = null, bot_area: Value = null, bot_mode: Value = null, popup: Value = null;
	let $0: any, $e: any;
	if (this.stat == 2) {
		return f.dot;
	}
	if (this.control_disabled) {
		to_chat(this, "Wireless communication is disabled.");
		return f.dot;
	}
	let ai_current_turf: Value = rt.getStep(f, this, 0);
	let ai_Zlevel: Value = ai_current_turf.z;
	d += fmt("<A HREF=?src=＃;botrefresh=1>Query network status</A><br>", [this]);
	d += "<table width='100%'><tr><td width='40%'><h3>Name</h3></td><td width='30%'><h3>Status</h3></td><td width='30%'><h3>Location</h3></td><td width='10%'><h3>Control</h3></td></tr>";
	rt.forList(f, 0, GLOB.living_mob_list, T("/mob/living/simple_animal/bot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		this.Bot = $e;
		if (this.Bot.z == ai_Zlevel && !this.Bot.remote_disabled) {
			bot_area = get_area(this.Bot);
			bot_mode = this.Bot.get_mode();
			if (this.Bot.hacked) {
				$0 = "<span class='bad'>(!)</span>";
			} else {
				$0 = "";
			}
			d += `<tr><td width='30%'>${$0} ${this.Bot.name}</A> (${this.Bot.model})</td>`;
			d += `<td width='30%'>${bot_mode}</td>`;
			d += `<td width='30%'>${bot_area.name}</td>`;
			d += fmt("<td width='10%'><A HREF=?src=＃;interface=＃>Interface</A></td>", [this, this.Bot]);
			d += fmt("<td width='10%'><A HREF=?src=＃;callbot=＃>Call</A></td>", [this, this.Bot]);
			d = format_text((d += "</tr>"));
		}
	}
	rt.endFor(f, 0);
	(popup = (yield* new_(T("/datum/browser"), this, "botcall", "Remote Robot Control", 700, 400))).set_content(d);
	yield* popup.open();
	return f.dot;
}, true, { verb: { name: "Access Robot Control", category: "AI Commands", desc: "Wirelessly control various automatic robots." } });

// ai.dm:501
rt.def("/mob/living/silicon/ai/proc/set_waypoint", function* set_waypoint(f: Frame, A: Value) {
	let turf_check: Value = null;
	if (rt.isIn(f, (turf_check = rt.getStep(f, A, 0)), range(rt.getStep(f, this, 0)))) {
		yield* this.call_bot(turf_check);
	} else if (GLOB.cameranet && GLOB.cameranet.checkTurfVis(turf_check)) {
		yield* this.call_bot(turf_check);
	} else {
		to_chat(this, "<span class='danger'>Selected location is not visible.</span>");
	}
	return f.dot;
}, true);

// ai.dm:512
rt.def("/mob/living/silicon/ai/proc/call_bot", function* call_bot(f: Frame, waypoint: Value) {
	if (!this.Bot) {
		return f.dot;
	}
	if (this.Bot.calling_ai && this.Bot.calling_ai != this) {
		to_chat(this, "<span class='danger'>Interface error. Unit is already in use.</span>");
		return f.dot;
	}
	to_chat(this, "<span class='notice'>Sending command to bot...</span>");
	this.call_bot_cooldown = rt.worldTime(f) + 900;
	yield* this.Bot.call_bot(this, waypoint);
	this.call_bot_cooldown = 0;
	return f.dot;
}, true);

// ai.dm:525
rt.def("/mob/living/silicon/ai/proc/triggerAlarm", function triggerAlarm(f: Frame, _class: Value, A: Value, O: Value, alarmsource: Value) {
	let I: Value = null, alarm: Value = null, sources: Value = null, C: Value = null, CL: Value = null, foo: Value = null, dat2: Value = null, I_5: Value = null;
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
	if (O) {
		if (C && C.can_use()) {
			this.queueAlarm(fmt("--- ＀ alarm detected in ＀! (<A HREF=?src=＃;switchcamera=＃>＀</A>)", [_class, A.name, this, C, C.c_tag]), _class);
		} else if (CL && rt.len(f, CL)) {
			foo = 0;
			dat2 = "";
			for (I_5 of each(CL, T("/obj/machinery/camera"))) {
				dat2 += fmt("＀<A HREF=?src=＃;switchcamera=＃>＀</A>", [!foo ? "" : " | ", this, I_5, I_5.c_tag]);
				foo = 1;
			}
			this.queueAlarm(`--- ${_class} alarm detected in ${A.name}! (${dat2})`, _class);
		} else {
			this.queueAlarm(`--- ${_class} alarm detected in ${A.name}! (No Camera)`, _class);
		}
	} else {
		this.queueAlarm(`--- ${_class} alarm detected in ${A.name}! (No Camera)`, _class);
	}
	if (this.viewalerts) {
		this.ai_alerts();
	}
	return 1;
});

// ai.dm:564
rt.def("/mob/living/silicon/ai/proc/cancelAlarm", function cancelAlarm(f: Frame, _class: Value, A: Value, origin: Value) {
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
		if (this.viewalerts) {
			this.ai_alerts();
		}
	}
	return (!cleared ? 1 : 0);
});

// ai.dm:586
rt.def("/mob/living/silicon/ai/proc/ai_network_change", function* ai_network_change(f: Frame) {
	let C: Value = null, tempnetwork: Value = null, i: Value = null, C_3: Value = null;
	yield* this.unset_machine();
	this.cameraFollow = null;
	let cameralist: Value = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	if (this.stat == 2) {
		return f.dot;
	}
	let U: Value = f.usr;
	for (C of each(GLOB.cameranet.cameras, T("/obj/machinery/camera"))) {
		if (!C.can_use()) {
			continue;
		}
		yield* (tempnetwork = C.network).Remove("CREED", "thunder", "RD", "toxins", "Prison");
		if (rt.len(f, tempnetwork)) {
			i = null;
			for (i of each(C.network)) {
				rt.setAt(cameralist, i, i);
			}
		}
	}
	let old_network: Value = this.network;
	this.network = (yield* g.op(f, "Prompt", [1], [null, null, "Which network would you like to view?", U, cameralist]));
	if (!U.eyeobj) {
		yield* U.view_core();
		return f.dot;
	}
	if (this.network === null) {
		this.network = old_network;
	} else {
		for (C_3 of each(GLOB.cameranet.cameras, T("/obj/machinery/camera"))) {
			if (!C_3.can_use()) {
				continue;
			}
			if (rt.isIn(f, this.network, C_3.network)) {
				yield* U.eyeobj.setLoc(rt.getStep(f, C_3, 0));
				break;
			}
		}
	}
	to_chat(this, `<span class='notice'>Switched to ${this.network} camera network.</span>`);
	return f.dot;
}, true, { verb: { name: "Jump To Network", category: "AI Commands" } });

// ai.dm:628
rt.def("/mob/living/silicon/ai/proc/choose_modules", function* choose_modules(f: Frame) {
	yield* this.malf_picker.use(this);
	return f.dot;
}, true, { verb: { name: "Choose Module", category: "Malfunction" } });

// ai.dm:634
rt.def("/mob/living/silicon/ai/proc/ai_statuschange", function* ai_statuschange(f: Frame) {
	let M: Value = null, AISD: Value = null, SD: Value = null;
	if (this.stat == 2) {
		return f.dot;
	}
	let ai_emotions: Value = list("Very Happy", "Happy", "Neutral", "Unsure", "Confused", "Sad", "BSOD", "Blank", "Problems?", "Awesome", "Facepalm", "Friend Computer", "Dorfy", "Blue Glow", "Red Glow");
	let emote: Value = (yield* g.op(f, "Prompt", [0], [null, null, "AI Status", "Please, select a status!", ai_emotions]));
	for (M of each(GLOB.ai_status_displays)) {
		if (rt.istype(M, T("/obj/machinery/ai_status_display"))) {
			(AISD = M).emotion = emote;
		} else if (rt.istype(M, T("/obj/machinery/status_display"))) {
			SD = M;
			if (emote == "Friend Computer") {
				SD.friendc = 1;
			} else {
				SD.friendc = 0;
			}
		}
	}
	return f.dot;
}, true, { verb: { name: "AI Status", category: "AI Commands" } });

// ai.dm:657
rt.def("/mob/living/silicon/ai/proc/ai_hologram_change", function* ai_hologram_change(f: Frame) {
	let input: Value = null, icon_list: Value = null, personnel_list: Value = null, t: Value = null, character_icon: Value = null;
	let $e: any;
	if (this.stat == 2) {
		return f.dot;
	}
	const subject = (yield* alert("Would you like to select a hologram based on a crew member, an animal, or switch to a unique avatar?", null, "Crew Member", "Unique", "Animal"));
	if (subject === "Crew Member") {
		personnel_list = list();
		for (t of each(GLOB.data_core.locked, T("/datum/data/record"))) {
			rt.setAt(personnel_list, `${rt.index(t.fields, "name")}: ${rt.index(t.fields, "rank")}`, rt.index(t.fields, "image"));
		}
		if (rt.len(f, personnel_list)) {
			input = (yield* g.op(f, "Prompt", [1], [null, null, null, "Select a crew member:", personnel_list]));
			if (character_icon = rt.index(personnel_list, input)) {
				yield* qdel(this.holo_icon);
				this.holo_icon = getHologramIcon(icon(character_icon));
			}
		} else {
			yield* alert("No suitable records found. Aborting.");
		}
	} else if (subject === "Animal") {
		icon_list = rt.alist(f, ["bear", rt.rsc("icons/mob/animal.dmi"), "carp", rt.rsc("icons/mob/animal.dmi"), "chicken", rt.rsc("icons/mob/animal.dmi"), "corgi", rt.rsc("icons/mob/pets.dmi"), "cow", rt.rsc("icons/mob/animal.dmi"), "crab", rt.rsc("icons/mob/animal.dmi"), "fox", rt.rsc("icons/mob/pets.dmi"), "goat", rt.rsc("icons/mob/animal.dmi"), "cat", rt.rsc("icons/mob/pets.dmi"), "cat2", rt.rsc("icons/mob/pets.dmi"), "poly", rt.rsc("icons/mob/animal.dmi"), "pug", rt.rsc("icons/mob/pets.dmi"), "spider", rt.rsc("icons/mob/animal.dmi")]);
		if (input = (yield* g.op(f, "Prompt", [1], [null, null, null, "Please select a hologram:", icon_list]))) {
			yield* qdel(this.holo_icon);
			if (input === "poly") {
				this.holo_icon = getHologramIcon(icon(rt.index(icon_list, input), "parrot_fly"));
			} else if (input === "chicken") {
				this.holo_icon = getHologramIcon(icon(rt.index(icon_list, input), "chicken_brown"));
			} else if (input === "spider") {
				this.holo_icon = getHologramIcon(icon(rt.index(icon_list, input), "guard"));
			} else {
				this.holo_icon = getHologramIcon(icon(rt.index(icon_list, input), input));
			}
		}
	} else {
		icon_list = rt.alist(f, ["default", rt.rsc("icons/mob/ai.dmi"), "floating face", rt.rsc("icons/mob/ai.dmi"), "xeno queen", rt.rsc("icons/mob/alien.dmi"), "horror", rt.rsc("icons/mob/ai.dmi")]);
		if (input = (yield* g.op(f, "Prompt", [1], [null, null, null, "Please select a hologram:", icon_list]))) {
			yield* qdel(this.holo_icon);
			if (input === "xeno queen") {
				this.holo_icon = getHologramIcon(icon(rt.index(icon_list, input), "alienq"));
			} else {
				this.holo_icon = getHologramIcon(icon(rt.index(icon_list, input), input));
			}
		}
	}
	return f.dot;
}, true, { verb: { name: "Change Hologram", category: "AI Commands", desc: "Change the default hologram available to AI to something else." } });

// ai.dm:728
rt.def("/mob/living/silicon/ai/proc/corereturn", function* corereturn(f: Frame) {
	let apc: Value = null;
	if (!rt.istype((apc = this.loc), T("/obj/machinery/power/apc"))) {
		to_chat(this, "<span class='notice'>You are already in your Main Core.</span>");
		return f.dot;
	}
	yield* apc.malfvacate();
	return f.dot;
}, true, { verb: { name: "Return to Main Core", category: "Malfunction" } });

// ai.dm:734
rt.def("/mob/living/silicon/ai/proc/toggle_camera_light", function toggle_camera_light(f: Frame) {
	let C: Value = null;
	if (this.stat != 0) {
		return f.dot;
	}
	this.camera_light_on = (!this.camera_light_on ? 1 : 0);
	if (!this.camera_light_on) {
		to_chat(this, "Camera lights deactivated.");
		for (C of each(this.lit_cameras, T("/obj/machinery/camera"))) {
			C.set_light(0);
			this.lit_cameras = list();
		}
		return f.dot;
	}
	this.light_cameras();
	to_chat(this, "Camera lights activated.");
	return f.dot;
});

// ai.dm:755
rt.def("/mob/living/silicon/ai/proc/light_cameras", function light_cameras(f: Frame) {
	let CC: Value = null, C: Value = null, C_3: Value = null;
	let _add: Value = list();
	let remove: Value = list();
	let visible: Value = list();
	for (CC of each(this.eyeobj.visibleCameraChunks, T("/datum/camerachunk"))) {
		C = null;
		for (C of each(CC.cameras, T("/obj/machinery/camera"))) {
			if (!C.can_use() || get_dist(C, this.eyeobj) > 7) {
				continue;
			}
			(visible = rt.modify(visible, C, rt.bitOr));
		}
	}
	_add = visible - this.lit_cameras;
	remove = this.lit_cameras - visible;
	for (C_3 of each(remove, T("/obj/machinery/camera"))) {
		this.lit_cameras -= C_3;
		C_3.Togglelight(0);
	}
	C_3 = null;
	for (C_3 of each(_add, T("/obj/machinery/camera"))) {
		C_3.Togglelight(1);
		(rt.modSrcVar(f, "lit_cameras", C_3, rt.bitOr));
	}
	return f.dot;
});

// ai.dm:779
rt.def("/mob/living/silicon/ai/proc/control_integrated_radio", function* control_integrated_radio(f: Frame) {
	if (this.stat == 2) {
		return f.dot;
	}
	to_chat(this, "Accessing Subspace Transceiver control...");
	if (!this.radio) return f.dot;
	yield* this.radio.interact(this);
	return f.dot;
}, true, { verb: { name: "Transceiver Settings", category: "AI Commands", desc: "Allows you to change settings of your radio." } });

// ai.dm:788
rt.def("/mob/living/silicon/ai/proc/set_syndie_radio", function* set_syndie_radio(f: Frame) {
	if (!this.radio) return f.dot;
	yield* this.radio.make_syndie();
	return f.dot;
}, true);

// ai.dm:795
rt.def("/mob/living/silicon/ai/proc/set_automatic_say_channel", function* set_automatic_say_channel(f: Frame) {
	if (this.stat == 2) {
		return f.dot;
	}
	yield* this.set_autosay();
	return f.dot;
}, true, { verb: { name: "Set Auto Announce Mode", category: "AI Commands", desc: "Modify the default radio setting for your automatic announcements." } });

// ai.dm:800
rt.def("/mob/living/silicon/ai/proc/transfer_ai", function* transfer_ai(f: Frame, interaction: Value, user: Value, AI: Value, card: Value) {
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (interaction != AI_TRANS_TO_CARD) return f.dot;
	if (!this.can_be_carded) {
		to_chat(user, "<span class='boldwarning'>Transfer failed.</span>");
		return f.dot;
	}
	yield* this.disconnect_shell();
	if (!this.mind) {
		to_chat(user, "<span class='warning'>No intelligence patterns detected.</span>");
		return f.dot;
	}
	yield* this.ShutOffDoomsdayDevice();
	yield* new_(T("/obj/structure/AIcore/deactivated"), this.loc);
	yield* this.ai_restore_power();
	this.control_disabled = 1;
	this.radio_enabled = 0;
	yield* this.forceMove(card);
	card.AI = this;
	to_chat(this, "You have been downloaded to a mobile storage device. Remote device connection severed.");
	to_chat(user, `<span class='boldnotice'>Transfer successful</span>: ${this.name} (${rand(1000, 9999)}.exe) removed from host terminal and stored within local memory.`);
	return f.dot;
}, true);

// ai.dm:826
rt.def("/mob/living/silicon/ai/proc/canUseTopic", function canUseTopic(f: Frame, M: Value, be_close: Value) {
	be_close ??= 0;
	if (this.stat) {
		return f.dot;
	}
	if (be_close && !(get_dist(M, this) <= 1)) {
		return f.dot;
	}
	if (M && GLOB.cameranet && !GLOB.cameranet.checkTurfVis(get_turf_pixel(M)) && !this.apc_override) {
		return f.dot;
	}
	return 1;
});

// ai.dm:836
rt.def("/mob/living/silicon/ai/proc/relay_speech", function* relay_speech(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	let jobpart: Value = null, S: Value = null, rendered: Value = null;
	raw_message = (yield* this.lang_treat(speaker, message_language, raw_message, spans, message_mode));
	let start: Value = "Relayed Speech: ";
	let namepart: Value = `${speaker.GetVoice()}${speaker.get_alt_name()}`;
	let hrefpart: Value = fmt("<a href='?src=＃;track=＀'>", [this, html_encode(namepart)]);
	if (rt.istype(speaker, T("/mob/living/carbon"))) {
		if ((S = speaker).job) {
			jobpart = `${S.job}`;
		}
	} else {
		jobpart = "Unknown";
	}
	this.show_message((rendered = `<i><span class='game say'>${start}<span class='name'>${hrefpart}${namepart} (${jobpart})</a> </span><span class='message'>${raw_message}</span></span></i>`), 2);
	return f.dot;
}, true);

// ai.dm:854
rt.def("/mob/living/silicon/ai/proc/fully_replace_character_name", function* fully_replace_character_name(f: Frame, oldname: Value, newname: Value) {
	let Slave: Value = null;
	yield* parent_proc();
	if (oldname == this.real_name) return f.dot;
	if (this.eyeobj) {
		this.eyeobj.name = `${newname} (AI Eye)`;
	}
	for (Slave of each(this.connected_robots, T("/mob/living/silicon/robot"))) {
		yield* Slave.show_laws();
	}
	return f.dot;
}, true);

// ai.dm:866
rt.def("/mob/living/silicon/ai/proc/replace_identification_name", function replace_identification_name(f: Frame, oldname: Value, newname: Value) {
	if (!this.aiPDA) return f.dot;
	this.aiPDA.owner = newname;
	this.aiPDA.name = newname + " (" + this.aiPDA.ownjob + ")";
	return f.dot;
});

// ai.dm:870
rt.def("/mob/living/silicon/ai/proc/add_malf_picker", function* add_malf_picker(f: Frame) {
	to_chat(this, "In the top right corner of the screen you will find the Malfunctions tab, where you can purchase various abilities, from upgraded surveillance to station ending doomsday devices.");
	to_chat(this, "You are also capable of hacking APCs, which grants you more points to spend on your Malfunction powers. The drawback is that a hacked APC will give you away if spotted by the crew. Hacking an APC takes 60 seconds.");
	yield* this.view_core();
	this.verbs += P("/mob/living/silicon/ai/proc/choose_modules");
	this.malf_picker = (yield* new_(T("/datum/module_picker")));
	return f.dot;
}, true);

// ai.dm:879
rt.def("/mob/living/silicon/ai/proc/reset_perspective", function* reset_perspective(f: Frame, A: Value) {
	let AT: Value = null;
	if (this.camera_light_on) {
		this.light_cameras();
	}
	if (rt.istype(A, T("/obj/machinery/camera"))) {
		this.current = A;
	}
	if (!this.client) return f.dot;
	if (rt.istype(A, T("/atom/movable"))) {
		this.client.perspective = 1;
		this.client.eye = A;
	} else if (isturf(this.loc)) {
		if (this.eyeobj) {
			this.client.eye = this.eyeobj;
			this.client.perspective = 1;
		} else {
			this.client.eye = this.client.mob;
			this.client.perspective = 0;
		}
	} else {
		this.client.perspective = 1;
		this.client.eye = this.loc;
	}
	yield* this.update_sight();
	if (this.client.eye != this) {
		yield* (AT = this.client.eye).get_remote_view_fullscreens(this);
	} else {
		yield* this.clear_fullscreen("remote_view", 0);
	}
	return f.dot;
}, true);

// ai.dm:905
rt.def("/mob/living/silicon/ai/proc/revive", function* revive(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	this.icon_state = "ai";
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// ai.dm:912
rt.def("/mob/living/silicon/ai/proc/malfhacked", function* malfhacked(f: Frame, apc: Value) {
	this.malfhack = null;
	this.malfhacking = 0;
	yield* this.clear_alert("hackingapc");
	if (!rt.istype(apc, T("/obj/machinery/power/apc")) || !apc || apc.gc_destroyed || rt.bitAnd(apc.stat, 1)) {
		to_chat(this, "<span class='danger'>Hack aborted. The designated APC no longer exists on the power network.</span>");
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/buzz-two.ogg"), 50, 1);
	} else if (apc.aidisabled) {
		to_chat(this, fmt("<span class='danger'>Hack aborted. ＄！ is no longer responding to our systems.</span>", [apc]));
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 1);
	} else {
		this.malf_picker.processing_time += 10;
		apc.malfai = (this.parent || this);
		apc.malfhack = 1;
		apc.locked = 1;
		apc.coverlocked = 1;
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/ding.ogg"), 50, 1);
		to_chat(this, fmt("Hack complete. ＄！ is now under your exclusive control.", [apc]));
		yield* apc.update_icon();
	}
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/machinery/power/apc" }] });

// ai.dm:936
rt.def("/mob/living/silicon/ai/verb/deploy_to_shell", function* deploy_to_shell(f: Frame, target: Value) {
	let borgie: Value = null, R: Value = null;
	if (this.stat || this.lacks_power() || this.control_disabled) {
		to_chat(this, "<span class='danger'>Wireless networking module is offline.</span>");
		return f.dot;
	}
	let possible: Value = list();
	for (borgie of each(GLOB.available_ai_shells)) {
		if ((R = borgie).shell && !R.deployed && R.stat != 2 && (!R.connected_ai || R.connected_ai == this)) {
			possible += R;
		}
	}
	if (!rt.length(possible)) {
		to_chat(this, "No usable AI shell beacons detected.");
	}
	if (!target || !rt.isIn(f, target, possible)) {
		target = (yield* g.op(f, "Prompt", [1], [null, null, "Which body to control?", this, possible]));
	}
	if (!target || target.stat == 2 || target.deployed || !(!target.connected_ai || target.connected_ai == this)) {
		return f.dot;
	} else if (this.mind) {
		yield* soullink(T("/datum/soullink/sharedbody"), this, target);
		this.deployed_shell = target;
		yield* target.deploy_init(this);
		yield* this.mind.transfer_to(target);
	}
	this.diag_hud_set_deployed();
	return f.dot;
}, true, { verb: { name: "Deploy to Shell", category: "AI Commands" }, argTypes: [{ type: 8, path: "/mob/living/silicon/robot" }] });

rt.type(155, "/datum/action/innate/deploy_shell", "/datum/action/innate", {
	name: "Deploy to AI Shell",
	desc: "Wirelessly control a specialized cyborg shell.",
	button_icon_state: "ai_shell",
});

// ai.dm:969
rt.def("/datum/action/innate/deploy_shell/proc/Trigger", function* Trigger(f: Frame) {
	let AI: Value = null;
	if (!(AI = this.owner)) {
		return f.dot;
	}
	yield* AI.deploy_to_shell();
	return f.dot;
}, true);

rt.type(156, "/datum/action/innate/deploy_last_shell", "/datum/action/innate", {
	last_used_shell: null,
	name: "Reconnect to shell",
	desc: "Reconnect to the most recently used AI shell.",
	button_icon_state: "ai_last_shell",
});

// ai.dm:981
rt.def("/datum/action/innate/deploy_last_shell/proc/Trigger", function* Trigger(f: Frame) {
	let AI: Value = null;
	if (!this.owner) {
		return f.dot;
	}
	if (this.last_used_shell) {
		yield* (AI = this.owner).deploy_to_shell(this.last_used_shell);
	} else {
		yield* this.Remove(this.owner);
	}
	return f.dot;
}, true);

// ai.dm:991
rt.def("/mob/living/silicon/ai/proc/disconnect_shell", function* disconnect_shell(f: Frame) {
	if (this.deployed_shell) {
		to_chat(this, "<span class='danger'>Your remote connection has been reset!</span>");
		yield* this.deployed_shell.undeploy();
	}
	this.diag_hud_set_deployed();
	return f.dot;
}, true);

rt.type(4834, "/mob/living/silicon/ai/spawned", "/mob/living/silicon/ai", {});

// ai.dm:999
rt.def("/mob/living/silicon/ai/spawned/proc/Initialize", function* Initialize(f: Frame) {
	if (!f.args[2]) {
		f.args[2] = this;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["mapload", "L", "target_ai"] });
