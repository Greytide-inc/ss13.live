// Based on /tg/station's code/_onclick/hud/alert.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(4808, "/mob", "/atom/movable", {
	memory_throttle_time: 0,
	next_click: 0,
	next_move_adjust: 0,
	next_move_modifier: 1,
	alerts: null,
	screens: null,
	skincmds: null,
	sandbox: null,
	client_colours: null,
	suiciding: 0,
	bloody_hands: 0,
	lighting_alpha: 255,
	mind: null,
	typing_overlay: null,
	typing_timer: null,
	actions: null,
	stat: 0,
	zone_selected: null,
	macro_default: "default",
	macro_hotkeys: "hotkeys",
	damageoverlaytemp: 0,
	computer_id: null,
	lastattacker: null,
	lastattacked: null,
	logging: null,
	machine: null,
	other_mobs: null,
	disabilities: 0,
	movement_type: 1,
	pulling: null,
	grab_state: 0,
	next_move: null,
	notransform: null,
	eye_blind: 0,
	eye_blurry: 0,
	stuttering: 0,
	slurring: 0,
	cultslurring: 0,
	real_name: null,
	druggy: 0,
	confused: 0,
	resting: 0,
	lying: 0,
	lying_prev: 0,
	canmove: 1,
	lastpuke: 0,
	name_archive: null,
	timeofdeath: 0,
	cpr_time: 1,
	bodytemperature: 310.055,
	drowsyness: 0,
	dizziness: 0,
	jitteriness: 0,
	nutrition: 400,
	satiety: 0,
	overeatduration: 0,
	losebreath: 0,
	a_intent: "help",
	possible_a_intents: null,
	m_intent: "run",
	lastKnownIP: null,
	buckled: null,
	active_hand_index: 1,
	held_items: null,
	s_active: null,
	see_override: 0,
	hud_used: null,
	research_scanner: 0,
	mapobjs: null,
	in_throw_mode: 0,
	music_lastplayed: "null",
	job: null,
	radiation: 0,
	voice_name: "unidentifiable voice",
	faction: null,
	move_on_shuttle: 1,
	LAssailant: null,
	mob_spell_list: null,
	viruses: null,
	resistances: null,
	status_flags: 15,
	digitalcamo: 0,
	digitalinvis: 0,
	digitaldisguise: null,
	has_unlimited_silicon_privilege: 0,
	control_object: null,
	remote_control: null,
	listed_turf: null,
	permanent_huds: null,
	resize: 1,
	observers: null,
	progressbars: null,
	can_ride_typecache: null,
	open_uis: null,
	client: null,
	key: null,
	ckey: null,
	group: null,
	see_invisible: 0,
	see_infrared: 0,
	sight: 0,
	see_in_dark: 2,
	flags: 16,
	hud_possible: null,
	pressure_resistance: 8,
	density: 1,
	layer: 4,
	animate_movement: 2,
	mouse_drag_pointer: 1,
}, { global: { next_mob_id: 726 }, tmp: ["ckey","group"] });

// alert.dm:18
rt.def("/mob/proc/throw_alert", function* throw_alert(f: Frame, category: Value, type: Value, severity: Value, new_master: Value, override: Value) {
	let thealert: Value = null, old_layer: Value = null, old_plane: Value = null;
	override ??= 0;
	if (!category) {
		return f.dot;
	}
	if (rt.index(this.alerts, category)) {
		if ((thealert = rt.index(this.alerts, category)).override_alerts) {
			return 0;
		}
		if (new_master && new_master != thealert.master) {
			warning(`${`${this} threw alert ${category} with new_master ${new_master} while already having that alert with master ${thealert.master}`} in ${"code/_onclick/hud/alert.dm"} at line ${27} src: ${this} usr: ${f.usr}.`);
			yield* this.clear_alert(category);
			return (yield* g.callSelf(f, []));
		}
		if (thealert.type != type) {
			yield* this.clear_alert(category);
			return (yield* g.callSelf(f, []));
		}
		if (!severity || severity == thealert.severity) {
			if (thealert.timeout) {
				yield* this.clear_alert(category);
				return (yield* g.callSelf(f, []));
			}
			return 0;
		}
	} else {
		(thealert = (yield* new_(type))).override_alerts = override;
		if (override) {
			thealert.timeout = null;
		}
	}
	thealert.mob_viewer = this;
	if (new_master) {
		old_layer = new_master.layer;
		old_plane = new_master.plane;
		new_master.layer = -1;
		new_master.plane = -32767;
		thealert.add_overlay(new_master);
		new_master.layer = old_layer;
		new_master.plane = old_plane;
		thealert.icon_state = "template";
		thealert.master = new_master;
	} else {
		thealert.icon_state = `${rt.initial(f, thealert, "icon_state")}${severity}`;
		thealert.severity = severity;
	}
	rt.setAt(this.alerts, category, thealert);
	if (this.client && this.hud_used) {
		this.hud_used.reorganize_alerts();
	}
	thealert.transform = matrix(32, 6, 7);
	rt.op(f, "Animate", [2, 8], [null, thealert, "transform", matrix(), "time", 2.5, "easing", 3]);
	if (thealert.timeout) {
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/proc/alert_timeout"), thealert, category)), thealert.timeout);
		thealert.timeout = rt.worldTime(f) + thealert.timeout - rt.world().tick_lag;
	}
	return thealert;
}, true);

// alert.dm:73
rt.def("/mob/proc/alert_timeout", function* alert_timeout(f: Frame, alert: Value, category: Value) {
	if (!(alert.timeout && rt.index(this.alerts, category) == alert && rt.worldTime(f) >= alert.timeout)) return f.dot;
	yield* this.clear_alert(category);
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/screen/alert" }, {  }] });

// alert.dm:78
rt.def("/mob/proc/clear_alert", function* clear_alert(f: Frame, category: Value, clear_override: Value) {
	let alert: Value = null;
	clear_override ??= 0;
	if (!(alert = rt.index(this.alerts, category))) {
		return 0;
	}
	if (alert.override_alerts && !clear_override) {
		return 0;
	}
	this.alerts -= category;
	if (this.client && this.hud_used) {
		this.hud_used.reorganize_alerts();
		this.client.screen -= alert;
	}
	yield* qdel(alert);
	return f.dot;
}, true);

rt.type(11021, "/obj/screen/alert", "/obj/screen", {
	timeout: 0,
	severity: 0,
	alerttooltipstyle: "",
	override_alerts: 0,
	mob_viewer: null,
	icon: rt.rsc("icons/mob/screen_alert.dmi"),
	icon_state: "default",
	name: "Alert",
	desc: "Something seems to have gone wrong with this alert, so report this bug please",
	mouse_opacity: 1,
});

// alert.dm:104
rt.def("/obj/screen/alert/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	openToolTip(f.usr, this, params, { title: this.name, content: this.desc, theme: this.alerttooltipstyle });
	return f.dot;
});

// alert.dm:108
rt.def("/obj/screen/alert/proc/MouseExited", function MouseExited(f: Frame) {
	closeToolTip(f.usr);
	return f.dot;
});

rt.type(11038, "/obj/screen/alert/embeddedobject", "/obj/screen/alert", {
	name: "Embedded Object",
	desc: "Something got lodged into your flesh and is causing major bleeding. It might fall out with time, but surgery is the safest way. If you're feeling frisky, click yourself in help intent to pull the object out.",
	icon_state: "embeddedobject",
});

// alert.dm:204
rt.def("/obj/screen/alert/embeddedobject/proc/Click", function* Click(f: Frame) {
	let M: Value = null;
	if (!rt.istype(f.usr, T("/mob/living"))) return f.dot;
	return (yield* (M = f.usr).help_shake_act(M));
}, true);

rt.type(11040, "/obj/screen/alert/fire", "/obj/screen/alert", {
	name: "On Fire",
	desc: "You're on fire. Stop, drop and roll to put the fire out or move to a vacuum area.",
	icon_state: "fire",
});

// alert.dm:222
rt.def("/obj/screen/alert/fire/proc/Click", function* Click(f: Frame) {
	let L: Value = null;
	if (!rt.istype(f.usr, T("/mob/living"))) return f.dot;
	return (yield* (L = f.usr).resist());
}, true);

rt.type(11045, "/obj/screen/alert/bloodsense", "/obj/screen/alert", {
	angle: 0,
	Cviewer: null,
	alerttooltipstyle: "cult",
	name: "Blood Sense",
	desc: "Allows you to sense blood that is manipulated by dark magicks.",
	icon_state: "cult_sense",
}, { global: { narnar: 773 } });

// alert.dm:268
rt.def("/obj/screen/alert/bloodsense/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	GLOB.narnar = new_(T("/image"), rt.rsc("icons/mob/screen_alert.dmi"), "mini_nar");
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSprocessing.processing += this;
	return f.dot;
});

// alert.dm:274
rt.def("/obj/screen/alert/bloodsense/proc/Destroy", function* Destroy(f: Frame) {
	this.Cviewer = null;
	this.isprocessing = 0;
	GLOB.SSprocessing.processing -= this;
	return (yield* parent_proc());
}, true);

// alert.dm:280
rt.def("/obj/screen/alert/bloodsense/proc/process", function process(f: Frame) {
	let blood_target: Value = null, final: Value = null;
	if (GLOB.blood_target) {
		if (!rt.getStep(f, GLOB.blood_target, 0)) {
			GLOB.blood_target = null;
		} else {
			blood_target = GLOB.blood_target;
		}
	}
	if (this.Cviewer && this.Cviewer.seeking && this.Cviewer.master) {
		blood_target = this.Cviewer.master;
		this.desc = `Your blood sense is leading you to ${this.Cviewer.master}`;
	}
	if (!blood_target) {
		if (!GLOB.sac_complete) {
			if (this.icon_state == "runed_sense0") {
				return f.dot;
			}
			rt.op(f, "Animate", [2, 8], [null, this, "transform", null, "time", 1, "loop", 0]);
			this.angle = 0;
			this.cut_overlays();
			this.icon_state = "runed_sense0";
			this.desc = `Nar-Sie demands that ${GLOB.sac_mind} be sacrificed before the summoning ritual can begin.`;
			this.add_overlay(GLOB.sac_image);
		} else {
			if (this.icon_state == "runed_sense1") {
				return f.dot;
			}
			rt.op(f, "Animate", [2, 8], [null, this, "transform", null, "time", 1, "loop", 0]);
			this.angle = 0;
			this.cut_overlays();
			this.icon_state = "runed_sense1";
			this.desc = `The sacrifice is complete, summon Nar-Sie! The summoning can only take place in ${english_list(GLOB.summon_spots)}!`;
			this.add_overlay(GLOB.narnar);
		}
		return f.dot;
	}
	let _P: Value = rt.getStep(f, blood_target, 0);
	let Q: Value = rt.getStep(f, this.mob_viewer, 0);
	let A: Value = get_area(_P);
	if (_P.z != Q.z) {
		this.icon_state = "runed_sense2";
		this.desc = `${blood_target} is no longer in your sector, you cannot sense its presence here.`;
		return f.dot;
	}
	this.desc = `You are currently tracking ${blood_target} in ${A.name}.`;
	let target_angle: Value = Get_Angle(Q, _P);
	let target_dist: Value = get_dist(_P, Q);
	this.cut_overlays();
	if (rt.inRange(target_dist, 0, 1)) {
		this.icon_state = "runed_sense2";
	} else if (rt.inRange(target_dist, 2, 8)) {
		this.icon_state = "arrow8";
	} else if (rt.inRange(target_dist, 9, 15)) {
		this.icon_state = "arrow7";
	} else if (rt.inRange(target_dist, 16, 22)) {
		this.icon_state = "arrow6";
	} else if (rt.inRange(target_dist, 23, 29)) {
		this.icon_state = "arrow5";
	} else if (rt.inRange(target_dist, 30, 36)) {
		this.icon_state = "arrow4";
	} else if (rt.inRange(target_dist, 37, 43)) {
		this.icon_state = "arrow3";
	} else if (rt.inRange(target_dist, 44, 50)) {
		this.icon_state = "arrow2";
	} else if (rt.inRange(target_dist, 51, 57)) {
		this.icon_state = "arrow1";
	} else if (rt.inRange(target_dist, 58, 64)) {
		this.icon_state = "arrow0";
	} else if (rt.inRange(target_dist, 65, 400)) {
		this.icon_state = "arrow";
	}
	let difference: Value = target_angle - this.angle;
	this.angle = target_angle;
	if (!difference) {
		return f.dot;
	}
	(final = matrix(this.transform)).Turn(difference);
	rt.op(f, "Animate", [2, 8], [null, this, "transform", final, "time", 5, "loop", 0]);
	return f.dot;
}, false, { waitfor: false });

rt.type(11047, "/obj/screen/alert/clockwork/scripture_reqs", "/obj/screen/alert/clockwork", {
	name: "Next Tier Requirements",
	desc: "You shouldn't be seeing this description unless you're very fast. If you're very fast, good job!",
	icon_state: "no-servants-caches",
});

// alert.dm:361
rt.def("/obj/screen/alert/clockwork/scripture_reqs/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSprocessing.processing += this;
	}
	this.process();
	return f.dot;
});

// alert.dm:366
rt.def("/obj/screen/alert/clockwork/scripture_reqs/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSprocessing.processing -= this;
	return (yield* parent_proc());
}, true);

// alert.dm:371
rt.def("/obj/screen/alert/clockwork/scripture_reqs/proc/process", function* process(f: Frame) {
	let current_state: Value = null, i: Value = null, G: Value = null, gate_area: Value = null, validservants: Value = null, unconverted_ais_exist: Value = null, L: Value = null, req_servants: Value = null, req_caches: Value = null, req_cv: Value = null, req_ai: Value = null, textlist: Value = null;
	let $e: any;
	if (GLOB.clockwork_gateway_activated) {
		yield* this.mob_viewer.clear_alert("scripturereq");
		return f.dot;
	}
	for (i of each(GLOB.SSticker.scripture_states)) {
		if (!rt.index(GLOB.SSticker.scripture_states, i)) {
			current_state = i;
			break;
		}
	}
	this.icon_state = "no";
	if (!current_state) {
		this.name = "Current Objective";
		for (G of each(GLOB.all_clockwork_objects, T("/obj/structure/destructible/clockwork/massive/celestial_gateway"))) {
			this.desc = `<b>Protect the Ark at ${(gate_area = get_area(G)).map_name}!</b>`;
			return f.dot;
		}
		this.desc = "<b>All tiers of Scripture are unlocked.<br>Acquire components and summon the Ark.</b>";
	} else {
		this.name = "Next Tier Requirements";
		validservants = 0;
		unconverted_ais_exist = get_unconverted_ais();
		for (L of each(GLOB.living_mob_list, T("/mob/living"))) {
			if (is_servant_of_ratvar(L) && (rt.istype(L, T("/mob/living/carbon/human")) || rt.istype(L, T("/mob/living/silicon")))) {
				validservants++;
			}
		}
		req_servants = 0;
		req_caches = 0;
		req_cv = 0;
		req_ai = 0;
		textlist = list(`Requirements for <b>${current_state} Scripture:</b>`);
		if (current_state === "Script") {
			req_servants = 6;
			req_caches = 1;
		} else if (current_state === "Application") {
			req_servants = 9;
			req_caches = 3;
			req_cv = 100;
		} else if (current_state === "Judgement") {
			req_servants = 12;
			req_caches = 5;
			req_cv = 300;
			req_ai = 1;
		}
		textlist += `<br><b>${validservants}/${req_servants}</b> Servants`;
		if (validservants < req_servants) {
			this.icon_state += "-servants";
		} else {
			textlist += ": <b><font color=#5A6068>[CHECK]</font></b>";
		}
		textlist += `<br><b>${GLOB.clockwork_caches}/${req_caches}</b> Tinkerer's Caches`;
		if (GLOB.clockwork_caches < req_caches) {
			this.icon_state += "-caches";
		} else {
			textlist += ": <b><font color=#5A6068>[CHECK]</font></b>";
		}
		if (req_cv) {
			textlist += `<br><b>${GLOB.clockwork_construction_value}/${req_cv}</b> Construction Value`;
			if (GLOB.clockwork_construction_value < req_cv) {
				this.icon_state += "-cv";
			} else {
				textlist += ": <b><font color=#5A6068>[CHECK]</font></b>";
			}
		}
		if (req_ai) {
			if (unconverted_ais_exist) {
				if (unconverted_ais_exist > 1) {
					textlist += `<br><b>${unconverted_ais_exist} unconverted AIs exist!</b><br>`;
				} else {
					textlist += "<br><b>An unconverted AI exists!</b>";
				}
				this.icon_state += "-ai";
			} else {
				textlist += "<br>No unconverted AIs exist: <b><font color=#5A6068>[CHECK]</font></b>";
			}
		}
		this.desc = textlist.Join();
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(11048, "/obj/screen/alert/clockwork/infodump", "/obj/screen/alert/clockwork", {
	name: "Global Records",
	desc: "You shouldn't be seeing this description, because it should be dynamically generated.",
	icon_state: "clockinfo",
});

// alert.dm:446
rt.def("/obj/screen/alert/clockwork/infodump/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	let servants: Value = null, validservants: Value = null, unconverted_ais_exist: Value = null, textlist: Value = null, L: Value = null, G: Value = null, gate_area: Value = null, i: Value = null, i_4: Value = null;
	let $0: any, $1: any, $e: any;
	if (GLOB.ratvar_awakens) {
		this.desc = "<font size=3><b>CHETR<br>NYY<br>HAGEHUGF-NAQ-UBABE<br>RATVAR.</b></font>";
	} else {
		servants = 0;
		validservants = 0;
		unconverted_ais_exist = get_unconverted_ais();
		for (L of each(GLOB.living_mob_list, T("/mob/living"))) {
			if (is_servant_of_ratvar(L)) {
				servants++;
				if (rt.istype(L, T("/mob/living/carbon/human")) || rt.istype(L, T("/mob/living/silicon"))) {
					validservants++;
				}
			}
		}
		if (servants > 1) {
			if (validservants > 1) {
				textlist = list(`<b>${servants}</b> Servants, <b>${validservants}</b> of which count towards scripture.<br>`);
			} else {
				$0 = servants;
				if (validservants) {
					$1 = `<b>${validservants}</b> of which counts`;
				} else {
					$1 = "none of which count";
				}
				textlist = list(`<b>${$0}</b> Servants, ${$1} towards scripture.<br>`);
			}
		} else {
			$0 = servants;
			textlist = list(`<b>${$0}</b> Servant, who ${validservants ? "counts" : "does not count"} towards scripture.<br>`);
		}
		if (GLOB.clockwork_caches) {
			$0 = `${GLOB.clockwork_caches}</b> Tinkerer's Caches.`;
		} else {
			$0 = "No Tinkerer's Caches, construct one!</b>";
		}
		textlist += `<b>${$0}<br><b>${GLOB.clockwork_construction_value}</b> Construction Value.<br>`;
		textlist += `<b>${Floor(servants * 0.2)}</b> Tinkerer's Daemons can be active at once. <b>${rt.length(GLOB.active_daemons)}</b> are active.<br>`;
		rt.forList(f, 0, GLOB.all_clockwork_objects, T("/obj/structure/destructible/clockwork/massive/celestial_gateway"));
		if (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			textlist += `Ark Location: <b>${uppertext((gate_area = get_area(G)).map_name)}</b><br>`;
			if (G.still_needs_components()) {
				textlist += "Ark Components required: ";
				for (i of each(G.required_components)) {
					if (rt.index(G.required_components, i)) {
						textlist += `<b><font color=${get_component_color_bright(i)}>${rt.index(G.required_components, i)}</font></b> `;
					}
				}
				textlist += "<br>";
			} else {
				textlist += `Seconds until Ratvar's arrival: <b>${G.get_arrival_text(1)}</b><br>`;
			}
		}
		rt.endFor(f, 0);
		if (unconverted_ais_exist) {
			if (unconverted_ais_exist > 1) {
				textlist += `<b>${unconverted_ais_exist} unconverted AIs exist!</b><br>`;
			} else {
				textlist += "<b>An unconverted AI exists!</b><br>";
			}
		}
		for (i_4 of each(GLOB.SSticker.scripture_states)) {
			if (i_4 != "Driver") {
				textlist += `${i_4} Scripture: <b>${rt.index(GLOB.SSticker.scripture_states, i_4) ? "UNLOCKED" : "LOCKED"}</b><br>`;
			}
		}
		this.desc = textlist.Join();
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(11058, "/obj/screen/alert/hackingapc", "/obj/screen/alert", {
	target: null,
	timeout: 600,
	name: "Hacking APC",
	desc: "An Area Power Controller is being hacked. When the process is complete, you will have exclusive control of it, and you will gain additional processing time to unlock more malfunction abilities.",
	icon_state: "hackingapc",
});

// alert.dm:557
rt.def("/obj/screen/alert/hackingapc/proc/Click", function* Click(f: Frame) {
	let _T: Value = null;
	if (!f.usr || !f.usr.client) {
		return f.dot;
	}
	if (!this.target) {
		return f.dot;
	}
	let AI: Value = f.usr;
	if (!(_T = rt.getStep(f, this.target, 0))) return f.dot;
	yield* AI.eyeobj.setLoc(_T);
	return f.dot;
}, true);

rt.type(11060, "/obj/screen/alert/notify_cloning", "/obj/screen/alert", {
	timeout: 300,
	name: "Revival",
	desc: "Someone is trying to revive you. Re-enter your corpse if you want to be revived!",
	icon_state: "template",
});

// alert.dm:581
rt.def("/obj/screen/alert/notify_cloning/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	if (!f.usr || !f.usr.client) {
		return f.dot;
	}
	yield* (G = f.usr).reenter_corpse();
	return f.dot;
}, true);

rt.type(11061, "/obj/screen/alert/notify_action", "/obj/screen/alert", {
	target: null,
	action: "jump",
	timeout: 300,
	name: "Body created",
	desc: "A body was created. You can enter it.",
	icon_state: "template",
});

// alert.dm:594
rt.def("/obj/screen/alert/notify_action/proc/Click", function* Click(f: Frame) {
	let G: Value = null, _T: Value = null;
	if (!f.usr || !f.usr.client) {
		return f.dot;
	}
	if (!this.target) {
		return f.dot;
	}
	if (!rt.istype((G = f.usr), T("/mob/dead/observer"))) {
		return f.dot;
	}
	if (this.action === "attack") {
		yield* this.target.attack_ghost(G);
	} else if (this.action === "jump") {
		if ((_T = rt.getStep(f, this.target, 0)) && isturf(_T)) {
			G.loc = _T;
		}
	} else if (this.action === "orbit") {
		yield* G.ManualFollow(this.target);
	}
	return f.dot;
}, true);

rt.type(11062, "/obj/screen/alert/restrained", "/obj/screen/alert", {});

// alert.dm:623
rt.def("/obj/screen/alert/restrained/proc/Click", function* Click(f: Frame) {
	let L: Value = null;
	if (!rt.istype(f.usr, T("/mob/living"))) return f.dot;
	return (yield* (L = f.usr).resist());
}, true);

// alert.dm:633
rt.def("/datum/hud/proc/reorganize_alerts", function reorganize_alerts(f: Frame) {
	let icon_pref: Value = null, i: Value = null, alert: Value = null;
	let alerts: Value = this.mymob.alerts;
	if (!this.hud_shown) {
		i = 1;
		while (i <= rt.len(f, alerts)) {
			this.mymob.client.screen -= rt.index(alerts, rt.index(alerts, i));
			i++;
		}
		return 1;
	}
	i = 1;
	while (i <= rt.len(f, alerts)) {
		if ((alert = rt.index(alerts, rt.index(alerts, i))).icon_state == "template") {
			if (!icon_pref) {
				icon_pref = ui_style2icon(this.mymob.client.prefs.UI_style);
			}
			alert.icon = icon_pref;
		}
		if (i === 1) {
			f.dot = "EAST-1:28,CENTER+5:27";
		} else if (i === 2) {
			f.dot = "EAST-1:28,CENTER+4:25";
		} else if (i === 3) {
			f.dot = "EAST-1:28,CENTER+3:23";
		} else if (i === 4) {
			f.dot = "EAST-1:28,CENTER+2:21";
		} else if (i === 5) {
			f.dot = "EAST-1:28,CENTER+1:19";
		} else {
			f.dot = "";
		}
		alert.screen_loc = f.dot;
		(rt.modField(f, this.mymob.client, "screen", alert, rt.bitOr));
		i++;
	}
	return 1;
});

// alert.dm:661
rt.def("/mob/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.alerts = list();

	this.screens = list();

	this.skincmds = list();

	this.client_colours = list();

	this.hud_possible = list("15");

	this.actions = list();
	this.logging = list("Attack log", "Say log", "Emote log", "OOC log");

	this.held_items = list(null, null);

	this.mapobjs = list();

	this.faction = list("neutral");

	this.mob_spell_list = list();

	this.viruses = list();

	this.resistances = list();

	this.permanent_huds = list();

	this.can_ride_typecache = list();

	this.open_uis = list();
	return f.dot;
});

// alert.dm:664
rt.def("/obj/screen/alert/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let paramslist: Value = null;
	if (!f.usr || !f.usr.client) {
		return f.dot;
	}
	if (rt.index((paramslist = params2list(params)), "shift")) {
		to_chat(f.usr, `<span class='boldnotice'>${this.name}</span> - <span class='info'>${this.desc}</span>`);
		return f.dot;
	}
	if (!this.master) return f.dot;
	return (yield* f.usr.client.Click(this.master, location, control, params));
}, true);

// alert.dm:674
rt.def("/obj/screen/alert/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* parent_proc());
	this.severity = 0;
	this.master = null;
	this.screen_loc = "";
	return f.dot;
}, true);
