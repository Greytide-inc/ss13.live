// From code/modules/mob/living/silicon/ai/ai.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/AutoUpdateAI  (code/modules/mob/living/silicon/ai/ai.dm:6)  may sleep
rt.def("/proc/AutoUpdateAI", function* AutoUpdateAI(f: Frame, subject: Value) {
	let is_in_use: Value = null, A: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [subject, is_in_use, A, M, $e];
	is_in_use = 0;
	if (live(subject) !== null) {
		A = null;
		rt.forList(f, 0, rt.gl("ai_list"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			if ((truthy(rt.gv(f, "client", (M = live(A)))) && isEqual(rt.fv(f, "machine", live(M)), live(subject)))) {
				is_in_use = 1;
				yield* g.callName(f, live(subject), "attack_ai", [live(M)]);
			}
		}
		rt.endFor(f, 0);
	}
	return live(is_in_use);
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

// /mob/living/silicon/ai/proc/<init>  (code/modules/mob/living/silicon/ai/ai.dm:29)  may sleep
rt.def("/mob/living/silicon/ai/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "network", rt.list("SS13"));
	$0 = $0;
	rt.setSv(f, "connected_robots", rt.list());
	$0 = $0;
	rt.setSv(f, "alarms", rt.alist(f, ["Motion", rt.list(), "Fire", rt.list(), "Atmosphere", rt.list(), "Power", rt.list(), "Camera", rt.list(), "Burglar", rt.list()]));
	$0 = $0;
	rt.setSv(f, "current_modules", rt.list());
	$0 = $0;
	rt.setSv(f, "lit_cameras", rt.list());
	$0 = $0;
	rt.setSv(f, "track", (yield* g.new_(f, T("/datum/trackable"), [])));
	$0 = $0;
	rt.setSv(f, "deploy_action", (yield* g.new_(f, T("/datum/action/innate/deploy_shell"), [])));
	$0 = $0;
	rt.setSv(f, "redeploy_action", (yield* g.new_(f, T("/datum/action/innate/deploy_last_shell"), [])));
	$0 = $0;
	rt.setSv(f, "eyeobj", (yield* g.new_(f, T("/mob/camera/aiEye"), [])));
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/Initialize  (code/modules/mob/living/silicon/ai/ai.dm:91)  may sleep
rt.def("/mob/living/silicon/ai/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[2]))) {
		yield* g.new_(f, T("/obj/structure/AIcore/deactivated"), [rt.sv(f, "loc")]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if ((truthy(live(f.args[1])) && truthy((rt.istype(live(f.args[1]), T("/datum/ai_laws")) ? 1 : 0)))) {
		rt.setSv(f, "laws", live(f.args[1]));
		yield* g.callName(f, rt.sv(f, "laws"), "associate", [live(f.src)]);
	} else {
		yield* g.srcCall(f, "make_laws");
	}
	if (truthy(rt.fv(f, "mind", live(f.args[2])))) {
		yield* g.callName(f, rt.fv(f, "mind", live(f.args[2])), "transfer_to", [live(f.src)]);
		if (truthy(rt.fv(f, "special_role", rt.sv(f, "mind")))) {
			yield* g.callName(f, rt.sv(f, "mind"), "store_memory", ["As an AI, you must obey your silicon laws above all else. Your objectives will consider you to be dead."]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>You have been installed as an AI! </span>"]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You must obey your silicon laws above all else. Your objectives will consider you to be dead.</span>"]);
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<B>You are playing the station's AI. The AI cannot move, but can interact with many objects while viewing them (through cameras).</B>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<B>To look at other parts of the station, click on yourself to get a camera menu.</B>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<B>While observing through a camera, you can use most (networked) devices which you can see, such as computers, APCs, intercoms, doors, etc.</B>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "To use something, simply click on it."]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Use say :b to speak to your cyborgs through binary."]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "For department channels, use the following say commands:"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), ":o - AI Private, :c - Command, :s - Security, :e - Engineering, :u - Supply, :v - Service, :m - Medical, :n - Science."]);
	yield* g.srcCall(f, "show_laws");
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>These laws may be changed by other players, or by you being the traitor.</b>"]);
	rt.setSv(f, "job", "AI");
	rt.setFv(f, "ai", rt.sv(f, "eyeobj"), live(f.src));
	rt.setFv(f, "loc", rt.sv(f, "eyeobj"), rt.fv(f, "loc", live(f.src)));
	yield* g.srcCall(f, "rename_self", "ai");
	rt.setSv(f, "holo_icon", (yield* g.call(f, P("/proc/getHologramIcon"), null, [(yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/mob/ai.dmi"), "default"]))])));
	rt.setSv(f, "spark_system", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	yield* g.callName(f, rt.sv(f, "spark_system"), "set_up", [5, 0, live(f.src)]);
	yield* g.callName(f, rt.sv(f, "spark_system"), "attach", [live(f.src)]);
	rt.modSrcVar(f, "verbs", P("/mob/living/silicon/ai/proc/show_laws_verb"), add);
	rt.setSv(f, "aiPDA", (yield* g.new_(f, T("/obj/item/device/pda/ai"), [live(f.src)])));
	rt.setFv(f, "owner", rt.sv(f, "aiPDA"), rt.sv(f, "name"));
	rt.setFv(f, "ownjob", rt.sv(f, "aiPDA"), "AI");
	rt.setFv(f, "name", rt.sv(f, "aiPDA"), add(add(add(rt.sv(f, "name"), " ("), rt.fv(f, "ownjob", rt.sv(f, "aiPDA"))), ")"));
	rt.setSv(f, "aiMulti", (yield* g.new_(f, T("/obj/item/device/multitool"), [live(f.src)])));
	rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/device/radio/headset/ai"), [live(f.src)])));
	rt.setSv(f, "aicamera", (yield* g.new_(f, T("/obj/item/device/camera/siliconcam/ai_camera"), [live(f.src)])));
	yield* g.callName(f, rt.sv(f, "deploy_action"), "Grant", [live(f.src)]);
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		yield* g.callName(f, rt.sv(f, "verbs"), "Add", [P("/mob/living/silicon/ai/proc/ai_network_change"), P("/mob/living/silicon/ai/proc/ai_statuschange"), P("/mob/living/silicon/ai/proc/ai_hologram_change"), P("/mob/living/silicon/ai/proc/toggle_camera_light"), P("/mob/living/silicon/ai/proc/botcall"), P("/mob/living/silicon/ai/proc/control_integrated_radio"), P("/mob/living/silicon/ai/proc/set_automatic_say_channel")]);
	}
	rt.modGl("ai_list", live(f.src), add);
	rt.modGl("shuttle_caller_list", live(f.src), add);
	rt.setSv(f, "builtInCamera", (yield* g.new_(f, T("/obj/machinery/camera/portable"), [live(f.src)])));
	rt.setFv(f, "network", rt.sv(f, "builtInCamera"), rt.list("SS13"));
	return f.dot;
}, true, { args: ["mapload", "L", "target_ai"] });

// /mob/living/silicon/ai/proc/Destroy  (code/modules/mob/living/silicon/ai/ai.dm:159)  may sleep
rt.def("/mob/living/silicon/ai/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("ai_list", live(f.src), subtract));
	(rt.modGl("shuttle_caller_list", live(f.src), subtract));
	yield* g.callName(f, rt.gl("SSshuttle"), "autoEvac", []);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "eyeobj")]);
	rt.setSv(f, "malfhack", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/IgniteMob  (code/modules/mob/living/silicon/ai/ai.dm:169)  may sleep
rt.def("/mob/living/silicon/ai/proc/IgniteMob", function* IgniteMob(f: Frame) {
	rt.setSv(f, "fire_stacks", 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/living/silicon/ai/verb/pick_icon  (code/modules/mob/living/silicon/ai/ai.dm:174)  may sleep
rt.def("/mob/living/silicon/ai/verb/pick_icon", function* pick_icon(f: Frame) {
	let icontype: Value = null;
	f.vars = () => [icontype];
	if ((truthy(rt.sv(f, "stat")) || truthy(rt.sv(f, "aiRestorePowerRoutine")))) {
		return live(f.dot);
	}
	if (isEqual((icontype = (yield* g.op(f, "Prompt", [0], [null, null, "AI", "Please, select a display!", rt.list("Clown", "Monochrome", "Blue", "Inverted", "Firewall", "Green", "Red", "Static", "Red October", "House", "Heartline", "Hades", "Helios", "President", "Syndicat Meow", "Alien", "Too Deep", "Triumvirate", "Triumvirate-M", "Text", "Matrix", "Dorf", "Bliss", "Not Malf", "Fuzzy", "Goon", "Database", "Glitchman", "Murica", "Nanotrasen", "Gentoo", "Angel")]))), "Clown")) {
		rt.setSv(f, "icon_state", "ai-clown2");
	} else {
		if (isEqual(live(icontype), "Monochrome")) {
			rt.setSv(f, "icon_state", "ai-mono");
		} else {
			if (isEqual(live(icontype), "Blue")) {
				rt.setSv(f, "icon_state", "ai");
			} else {
				if (isEqual(live(icontype), "Inverted")) {
					rt.setSv(f, "icon_state", "ai-u");
				} else {
					if (isEqual(live(icontype), "Firewall")) {
						rt.setSv(f, "icon_state", "ai-magma");
					} else {
						if (isEqual(live(icontype), "Green")) {
							rt.setSv(f, "icon_state", "ai-wierd");
						} else {
							if (isEqual(live(icontype), "Red")) {
								rt.setSv(f, "icon_state", "ai-malf");
							} else {
								if (isEqual(live(icontype), "Static")) {
									rt.setSv(f, "icon_state", "ai-static");
								} else {
									if (isEqual(live(icontype), "Red October")) {
										rt.setSv(f, "icon_state", "ai-redoctober");
									} else {
										if (isEqual(live(icontype), "House")) {
											rt.setSv(f, "icon_state", "ai-house");
										} else {
											if (isEqual(live(icontype), "Heartline")) {
												rt.setSv(f, "icon_state", "ai-heartline");
											} else {
												if (isEqual(live(icontype), "Hades")) {
													rt.setSv(f, "icon_state", "ai-hades");
												} else {
													if (isEqual(live(icontype), "Helios")) {
														rt.setSv(f, "icon_state", "ai-helios");
													} else {
														if (isEqual(live(icontype), "President")) {
															rt.setSv(f, "icon_state", "ai-pres");
														} else {
															if (isEqual(live(icontype), "Syndicat Meow")) {
																rt.setSv(f, "icon_state", "ai-syndicatmeow");
															} else {
																if (isEqual(live(icontype), "Alien")) {
																	rt.setSv(f, "icon_state", "ai-alien");
																} else {
																	if (isEqual(live(icontype), "Too Deep")) {
																		rt.setSv(f, "icon_state", "ai-toodeep");
																	} else {
																		if (isEqual(live(icontype), "Triumvirate")) {
																			rt.setSv(f, "icon_state", "ai-triumvirate");
																		} else {
																			if (isEqual(live(icontype), "Triumvirate-M")) {
																				rt.setSv(f, "icon_state", "ai-triumvirate-malf");
																			} else {
																				if (isEqual(live(icontype), "Text")) {
																					rt.setSv(f, "icon_state", "ai-text");
																				} else {
																					if (isEqual(live(icontype), "Matrix")) {
																						rt.setSv(f, "icon_state", "ai-matrix");
																					} else {
																						if (isEqual(live(icontype), "Dorf")) {
																							rt.setSv(f, "icon_state", "ai-dorf");
																						} else {
																							if (isEqual(live(icontype), "Bliss")) {
																								rt.setSv(f, "icon_state", "ai-bliss");
																							} else {
																								if (isEqual(live(icontype), "Not Malf")) {
																									rt.setSv(f, "icon_state", "ai-notmalf");
																								} else {
																									if (isEqual(live(icontype), "Fuzzy")) {
																										rt.setSv(f, "icon_state", "ai-fuzz");
																									} else {
																										if (isEqual(live(icontype), "Goon")) {
																											rt.setSv(f, "icon_state", "ai-goon");
																										} else {
																											if (isEqual(live(icontype), "Database")) {
																												rt.setSv(f, "icon_state", "ai-database");
																											} else {
																												if (isEqual(live(icontype), "Glitchman")) {
																													rt.setSv(f, "icon_state", "ai-glitchman");
																												} else {
																													if (isEqual(live(icontype), "Murica")) {
																														rt.setSv(f, "icon_state", "ai-murica");
																													} else {
																														if (isEqual(live(icontype), "Nanotrasen")) {
																															rt.setSv(f, "icon_state", "ai-nanotrasen");
																														} else {
																															if (isEqual(live(icontype), "Gentoo")) {
																																rt.setSv(f, "icon_state", "ai-gentoo");
																															} else {
																																if (!isEqual(live(icontype), "Angel")) return f.dot;
																																rt.setSv(f, "icon_state", "ai-angel");
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { verb: { name: "Set AI Core Display", category: "AI Commands" } });

// /mob/living/silicon/ai/proc/Stat  (code/modules/mob/living/silicon/ai/ai.dm:248)  may sleep
rt.def("/mob/living/silicon/ai/proc/Stat", function* Stat(f: Frame) {
	let borg_area: Value = null, R: Value = null, robot_status: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [borg_area, R, robot_status, $0, $1, $2, $3, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	if (!truthy(rt.sv(f, "stat"))) {
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("System integrity: ＀%", [divide(add(rt.sv(f, "health"), 100), 2)])]);
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Connected cyborgs: ＀", [rt.len(f, rt.sv(f, "connected_robots"))])]);
		borg_area = null;
		R = null;
		rt.forList(f, 0, rt.sv(f, "connected_robots"), T("/mob/living/silicon/robot"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			borg_area = (yield* g.call(f, P("/proc/get_area"), null, [live(R)]));
			robot_status = "Nominal";
			if (truthy(rt.fv(f, "shell", live(R)))) {
				robot_status = "AI SHELL";
			} else {
				if ((truthy(rt.fv(f, "stat", live(R))) || !truthy(rt.fv(f, "client", live(R))))) {
					robot_status = "OFFLINE";
				} else {
					if ((!truthy(rt.fv(f, "cell", live(R))) || rt.le(rt.gv(f, "charge", rt.fv(f, "cell", live(R))), 0))) {
						robot_status = "DEPOWERED";
					}
				}
			}
			$0 = null;
			$1 = rt.fv(f, "name", live(R));
			$2 = rt.fv(f, "health", live(R));
			if (truthy(rt.fv(f, "cell", live(R)))) {
				$3 = fmt("＀/＀", [rt.gv(f, "charge", rt.fv(f, "cell", live(R))), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(R)))]);
			} else {
				$3 = "Empty";
			}
			yield* g.call(f, P("/proc/stat"), null, [$0, fmt("＀ | S.Integrity: ＀% | Cell: ＀ | Module: ＀ | Loc: ＀ | Status: ＀", [$1, $2, $3, rt.fv(f, "designation", live(R)), rt.fv(f, "name", live(borg_area)), live(robot_status)])]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("AI shell beacons detected: ＀", [rt.length(rt.gl("available_ai_shells"))])]);
	} else {
		yield* g.call(f, P("/proc/stat"), null, [null, "Systems nonfunctional"]);
	}
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/ai_alerts  (code/modules/mob/living/silicon/ai/ai.dm:271)
rt.def("/mob/living/silicon/ai/proc/ai_alerts", function ai_alerts(f: Frame) {
	let dat: Value = null, cat: Value = null, L: Value = null, alarm: Value = null, alm: Value = null, A: Value = null, C: Value = null, sources: Value = null, dat2: Value = null, I: Value = null, Ctmp: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [dat, cat, L, alarm, alm, A, C, sources, dat2, I, Ctmp, $0, $1, $e];
	dat = "<HEAD><TITLE>Current Station Alerts</TITLE><META HTTP-EQUIV='Refresh' CONTENT='10'></HEAD><BODY>\n";
	dat = rt.modify(live(dat), fmt("<A HREF='?src=＃;mach_close=aialerts'>Close</A><BR><BR>", [live(f.src)]), add);
	cat = null;
	rt.forList(f, 0, rt.sv(f, "alarms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		cat = $e;
		dat = rt.modify(live(dat), fmt("<B>＀</B><BR>\n", [live(cat)]), add);
		if (truthy(rt.getLen(f, (L = rt.index(rt.sv(f, "alarms"), live(cat)))))) {
			alarm = null;
			rt.forList(f, 1, live(L));
			while (($e = rt.next(f, 1)) !== undefined) {
				alarm = $e;
				alm = rt.index(live(L), live(alarm));
				A = rt.index(live(alm), 1);
				C = rt.index(live(alm), 2);
				sources = rt.index(live(alm), 3);
				dat = rt.modify(live(dat), "<NOBR>", add);
				if ((truthy(live(C)) && truthy((rt.istype(live(C), T("/list")) ? 1 : 0)))) {
					dat2 = "";
					I = null;
					rt.forList(f, 2, live(C), T("/obj/machinery/camera"));
					while (($e = rt.next(f, 2)) !== undefined) {
						I = $e;
						if (isEqual(live(dat2), "")) {
							$0 = "";
						} else {
							$0 = " | ";
						}
						dat2 = rt.modify(live(dat2), fmt("＀<A HREF=?src=＃;switchcamera=＃>＀</A>", [$0, live(f.src), live(I), rt.fv(f, "c_tag", live(I))]), add);
					}
					rt.endFor(f, 2);
					$0 = rt.fv(f, "name", live(A));
					if (!isEqual(live(dat2), "")) {
						$1 = live(dat2);
					} else {
						$1 = "No Camera";
					}
					dat = rt.modify(live(dat), fmt("-- ＀ (＀)", [$0, $1]), add);
				} else {
					if ((truthy(live(C)) && truthy((rt.istype(live(C), T("/obj/machinery/camera")) ? 1 : 0)))) {
						Ctmp = live(C);
						dat = rt.modify(live(dat), fmt("-- ＀ (<A HREF=?src=＃;switchcamera=＃>＀</A>)", [rt.fv(f, "name", live(A)), live(f.src), live(C), rt.fv(f, "c_tag", live(Ctmp))]), add);
					} else {
						dat = rt.modify(live(dat), fmt("-- ＀ (No Camera)", [rt.fv(f, "name", live(A))]), add);
					}
				}
				if (rt.gt(rt.len(f, live(sources)), 1)) {
					dat = rt.modify(live(dat), fmt("- ＀ sources", [rt.len(f, live(sources))]), add);
				}
				dat = rt.modify(live(dat), "</NOBR><BR>\n", add);
			}
			rt.endFor(f, 1);
		} else {
			dat = rt.modify(live(dat), "-- All Systems Nominal<BR>\n", add);
		}
		dat = rt.modify(live(dat), "<BR>\n", add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "viewalerts", 1);
	rt.op(f, "Browse", [], [live(f.src), live(dat), "window=aialerts&can_close=0"], false);
	return f.dot;
});

// /mob/living/silicon/ai/proc/ai_roster  (code/modules/mob/living/silicon/ai/ai.dm:304)
rt.def("/mob/living/silicon/ai/proc/ai_roster", function ai_roster(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	dat = "<html><head><title>Crew Roster</title></head><body><b>Crew Roster:</b><br><br>";
	dat = rt.modify(live(dat), rt.callName(f, rt.gl("data_core"), "get_manifest", []), add);
	dat = rt.modify(live(dat), "</body></html>", add);
	rt.op(f, "Browse", [], [live(f.src), live(dat), "window=airoster"], false);
	rt.call(f, P("/proc/onclose"), null, [live(f.src), "airoster"]);
	return f.dot;
});

// /mob/living/silicon/ai/proc/ai_call_shuttle  (code/modules/mob/living/silicon/ai/ai.dm:313)  may sleep
rt.def("/mob/living/silicon/ai/proc/ai_call_shuttle", function* ai_call_shuttle(f: Frame) {
	let AI: Value = null, reason: Value = null, C: Value = null;
	f.vars = () => [AI, reason, C];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "control_disabled", (AI = live(f.src))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Wireless control is disabled!"]);
			return live(f.dot);
		}
	}
	if (truthy((yield* g.call(f, P("/proc/trim"), null, [(reason = (yield* g.op(f, "Prompt", [3], [null, "Confirm Shuttle Call", fmt("What is the nature of your emergency? (＀ characters required.)", [12]), live(f.src), null])))])))) {
		yield* g.callName(f, rt.gl("SSshuttle"), "requestEvac", [live(f.src), live(reason)]);
	}
	if (truthy(rt.fv(f, "emergency", rt.gl("SSshuttle"))) && (isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "idle") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "recall"))) return f.dot;
	if (!truthy((C = rt.locateIn(f, T("/obj/machinery/computer/communications"), rt.gl("machines"))))) return f.dot;
	yield* g.callName(f, live(C), "post_status", ["shuttle"]);
	return f.dot;
}, true);

// /mob/living/silicon/ai/cancel_camera  (code/modules/mob/living/silicon/ai/ai.dm:333)  may sleep
rt.def("/mob/living/silicon/ai/cancel_camera", function* cancel_camera(f: Frame) {
	yield* g.srcCall(f, "view_core");
	return f.dot;
}, true, { verb: { name: "Cancel Camera View", category: "OOC" } });

// /mob/living/silicon/ai/verb/toggle_anchor  (code/modules/mob/living/silicon/ai/ai.dm:338)
rt.def("/mob/living/silicon/ai/verb/toggle_anchor", function toggle_anchor(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (!truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
	$0 = live(f.src);
	if (truthy(rt.sv(f, "anchored"))) {
		$1 = "";
	} else {
		$1 = "un";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<b>You are now ＀anchored.</b>", [$1])]);
	return f.dot;
}, false, { verb: { name: "Toggle Floor Bolts", category: "AI Commands" } });

// /mob/living/silicon/ai/proc/ai_cancel_call  (code/modules/mob/living/silicon/ai/ai.dm:352)  may sleep
rt.def("/mob/living/silicon/ai/proc/ai_cancel_call", function* ai_cancel_call(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "control_disabled", (AI = live(f.src))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Wireless control is disabled!"]);
			return live(f.dot);
		}
	}
	yield* g.callName(f, rt.gl("SSshuttle"), "cancelEvac", [live(f.src)]);
	return live(f.dot);
}, true, { verb: { category: "Malfunction" } });

// /mob/living/silicon/ai/proc/Topic  (code/modules/mob/living/silicon/ai/ai.dm:366)  may sleep
rt.def("/mob/living/silicon/ai/proc/Topic", function* Topic(f: Frame) {
	let t1: Value = null, H: Value = null, string: Value = null, trackeable: Value = null, target: Value = null, I: Value = null, M: Value = null, M_0: Value = null;
	let $e: any;
	f.vars = () => [t1, H, string, trackeable, target, I, M, M_0, $e];
	if (!isEqual(live(f.usr), live(f.src))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.at(live(f.args[1]), "mach_close"))) {
		if (isEqual(rt.at(live(f.args[1]), "mach_close"), "aialerts")) {
			rt.setSv(f, "viewalerts", 0);
		}
		t1 = fmt("window=＀", [rt.at(live(f.args[1]), "mach_close")]);
		yield* g.srcCall(f, "unset_machine");
		rt.op(f, "Browse", [], [live(f.src), null, live(t1)], false);
	}
	if (truthy(rt.at(live(f.args[1]), "switchcamera"))) {
		(rt.isIn(f, (yield* g.srcCall(f, "switchCamera", rt.locateIn(f, rt.at(live(f.args[1]), "switchcamera"), rt.world()))), rt.fv(f, "cameras", rt.gl("cameranet"))) ? 1 : 0);
	}
	if (truthy(rt.at(live(f.args[1]), "showalerts"))) {
		yield* g.srcCall(f, "ai_alerts");
	}
	if (truthy(rt.at(live(f.args[1]), "say_word"))) {
		yield* g.call(f, P("/proc/play_vox_word"), null, [rt.at(live(f.args[1]), "say_word"), null, live(f.src)]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "show_paper"))) {
		if (truthy(rt.sv(f, "last_paper_seen"))) {
			rt.op(f, "Browse", [], [live(f.src), rt.sv(f, "last_paper_seen"), "window=show_paper"], false);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "jumptoholopad"))) {
		H = rt.locateIn(f, rt.at(live(f.args[1]), "jumptoholopad"), rt.world());
		if (isEqual(rt.sv(f, "stat"), 0)) {
			if (truthy(live(H))) {
				yield* g.callName(f, live(H), "attack_ai", [live(f.src)]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Unable to locate the holopad.</span>"]);
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "track"))) {
		string = rt.at(live(f.args[1]), "track");
		yield* g.srcCall(f, "trackable_mobs");
		trackeable = rt.list();
		trackeable = rt.modify(live(trackeable), add(rt.fv(f, "humans", rt.sv(f, "track")), rt.fv(f, "others", rt.sv(f, "track"))), add);
		target = rt.list();
		I = null;
		rt.forList(f, 0, live(trackeable));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (isEqual(rt.gv(f, "name", (M = rt.index(live(trackeable), live(I)))), live(string))) {
				target = rt.modify(live(target), live(M), add);
			}
		}
		rt.endFor(f, 0);
		if (isEqual(rt.sv(f, "name"), live(string))) {
			target = rt.modify(live(target), live(f.src), add);
		}
		if (truthy(rt.len(f, live(target)))) {
			yield* g.srcCall(f, "ai_actual_track", rt.op(f, "PickUnweighted", [1], [live(target)]));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Target is not on or near any active cameras on the station."]);
		}
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "callbot"))) {
		if (rt.gt(rt.sv(f, "call_bot_cooldown"), rt.worldTime(f))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Error: Your last call bot command is still processing, please wait for the bot to finish calculating a route.</span>"]);
			return live(f.dot);
		}
		rt.setSv(f, "Bot", rt.locateIn(f, rt.at(live(f.args[1]), "callbot"), rt.gl("living_mob_list")));
		if (((!truthy(rt.sv(f, "Bot")) || truthy(rt.fv(f, "remote_disabled", rt.sv(f, "Bot")))) || truthy(rt.fv(f, "control_disabled", live(f.src))))) {
			return live(f.dot);
		}
		rt.setSv(f, "waypoint_mode", 1);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Set your waypoint by clicking on a valid location free of obstructions.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "interface"))) {
		rt.setSv(f, "Bot", rt.locateIn(f, rt.at(live(f.args[1]), "interface"), rt.gl("living_mob_list")));
		if (((!truthy(rt.sv(f, "Bot")) || truthy(rt.fv(f, "remote_disabled", rt.sv(f, "Bot")))) || truthy(rt.fv(f, "control_disabled", live(f.src))))) {
			return live(f.dot);
		}
		yield* g.callName(f, rt.sv(f, "Bot"), "attack_ai", [live(f.src)]);
	}
	if (truthy(rt.at(live(f.args[1]), "botrefresh"))) {
		yield* g.srcCall(f, "botcall");
		return live(f.dot);
	}
	if (!truthy(rt.at(live(f.args[1]), "ai_take_control"))) return f.dot;
	M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "ai_take_control"), rt.world());
	if (truthy(rt.sv(f, "controlled_mech"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You are already loaded into an onboard computer!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, rt.gl("cameranet"), "checkCameraVis", [live(M_0)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Exosuit is no longer near active cameras.</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "lacks_power")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You're depowered!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You aren't in your core!</span>"]);
		return live(f.dot);
	}
	if (!truthy(live(M_0))) return f.dot;
	yield* g.callName(f, live(M_0), "transfer_ai", [3, live(f.src), live(f.usr)]);
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /mob/living/silicon/ai/proc/switchCamera  (code/modules/mob/living/silicon/ai/ai.dm:451)  may sleep
rt.def("/mob/living/silicon/ai/proc/switchCamera", function* switchCamera(f: Frame, C: Value) {
	f.vars = () => [C];
	if (!truthy(rt.sv(f, "tracking"))) {
		rt.setSv(f, "cameraFollow", null);
	}
	if ((!truthy(live(C)) || isEqual(rt.sv(f, "stat"), 2))) {
		return 0;
	}
	if (!truthy(rt.fv(f, "eyeobj", live(f.src)))) {
		yield* g.srcCall(f, "view_core");
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "eyeobj"), "setLoc", [rt.getStep(f, live(C), 0)]);
	return 1;
}, true);

// /mob/living/silicon/ai/proc/botcall  (code/modules/mob/living/silicon/ai/ai.dm:470)  may sleep
rt.def("/mob/living/silicon/ai/proc/botcall", function* botcall(f: Frame) {
	let ai_current_turf: Value = null, ai_Zlevel: Value = null, d: Value = null, bot_area: Value = null, bot_mode: Value = null, popup: Value = null;
	let $0: any, $e: any;
	f.vars = () => [ai_current_turf, ai_Zlevel, d, bot_area, bot_mode, popup, $0, $e];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "control_disabled"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Wireless communication is disabled."]);
		return live(f.dot);
	}
	ai_current_turf = rt.getStep(f, live(f.src), 0);
	ai_Zlevel = rt.fv(f, "z", live(ai_current_turf));
	d = null;
	bot_area = null;
	d = rt.modify(live(d), fmt("<A HREF=?src=＃;botrefresh=1>Query network status</A><br>", [live(f.src)]), add);
	d = rt.modify(live(d), "<table width='100%'><tr><td width='40%'><h3>Name</h3></td><td width='30%'><h3>Status</h3></td><td width='30%'><h3>Location</h3></td><td width='10%'><h3>Control</h3></td></tr>", add);
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/simple_animal/bot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		rt.setSv(f, "Bot", $e);
		if ((isEqual(rt.fv(f, "z", rt.sv(f, "Bot")), live(ai_Zlevel)) && !truthy(rt.fv(f, "remote_disabled", rt.sv(f, "Bot"))))) {
			bot_area = (yield* g.call(f, P("/proc/get_area"), null, [rt.sv(f, "Bot")]));
			bot_mode = (yield* g.callName(f, rt.sv(f, "Bot"), "get_mode", []));
			if (truthy(rt.fv(f, "hacked", rt.sv(f, "Bot")))) {
				$0 = "<span class='bad'>(!)</span>";
			} else {
				$0 = "";
			}
			d = rt.modify(live(d), fmt("<tr><td width='30%'>＀ ＀</A> (＀)</td>", [$0, rt.fv(f, "name", rt.sv(f, "Bot")), rt.fv(f, "model", rt.sv(f, "Bot"))]), add);
			d = rt.modify(live(d), fmt("<td width='30%'>＀</td>", [live(bot_mode)]), add);
			d = rt.modify(live(d), fmt("<td width='30%'>＀</td>", [rt.fv(f, "name", live(bot_area))]), add);
			d = rt.modify(live(d), fmt("<td width='10%'><A HREF=?src=＃;interface=＃>Interface</A></td>", [live(f.src), rt.sv(f, "Bot")]), add);
			d = rt.modify(live(d), fmt("<td width='10%'><A HREF=?src=＃;callbot=＃>Call</A></td>", [live(f.src), rt.sv(f, "Bot")]), add);
			d = (yield* g.call(f, P("/proc/format_text"), null, [(d = rt.modify(live(d), "</tr>", add))]));
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.src), "botcall", "Remote Robot Control", 700, 400]))), "set_content", [live(d)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true, { verb: { name: "Access Robot Control", category: "AI Commands", desc: "Wirelessly control various automatic robots." } });

// /mob/living/silicon/ai/proc/set_waypoint  (code/modules/mob/living/silicon/ai/ai.dm:501)  may sleep
rt.def("/mob/living/silicon/ai/proc/set_waypoint", function* set_waypoint(f: Frame, A: Value) {
	let turf_check: Value = null;
	f.vars = () => [A, turf_check];
	if (truthy((rt.isIn(f, (turf_check = rt.getStep(f, live(A), 0)), (yield* g.call(f, P("/proc/range"), null, [rt.getStep(f, live(f.src), 0)]))) ? 1 : 0))) {
		yield* g.srcCall(f, "call_bot", live(turf_check));
	} else {
		if ((truthy(rt.gl("cameranet")) && truthy((yield* g.callName(f, rt.gl("cameranet"), "checkTurfVis", [live(turf_check)]))))) {
			yield* g.srcCall(f, "call_bot", live(turf_check));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Selected location is not visible.</span>"]);
		}
	}
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/call_bot  (code/modules/mob/living/silicon/ai/ai.dm:512)  may sleep
rt.def("/mob/living/silicon/ai/proc/call_bot", function* call_bot(f: Frame, waypoint: Value) {
	f.vars = () => [waypoint];
	if (!truthy(rt.sv(f, "Bot"))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "calling_ai", rt.sv(f, "Bot"))) && !isEqual(rt.fv(f, "calling_ai", rt.sv(f, "Bot")), live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Interface error. Unit is already in use.</span>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Sending command to bot...</span>"]);
	rt.setSv(f, "call_bot_cooldown", add(rt.worldTime(f), 900));
	yield* g.callName(f, rt.sv(f, "Bot"), "call_bot", [live(f.src), live(waypoint)]);
	rt.setSv(f, "call_bot_cooldown", 0);
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/triggerAlarm  (code/modules/mob/living/silicon/ai/ai.dm:525)
rt.def("/mob/living/silicon/ai/proc/triggerAlarm", function triggerAlarm(f: Frame, _class: Value, A: Value, O: Value, alarmsource: Value) {
	let L: Value = null, I: Value = null, alarm: Value = null, sources: Value = null, C: Value = null, CL: Value = null, foo: Value = null, dat2: Value = null, I_5: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [L, I, alarm, sources, C, CL, foo, dat2, I_5, $0, $1, $2, $3, $e];
	if (!isEqual(rt.fv(f, "z", live(alarmsource)), rt.sv(f, "z"))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return 1;
	}
	L = rt.index(rt.sv(f, "alarms"), live(_class));
	I = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual(live(I), rt.fv(f, "name", live(A)))) {
			alarm = rt.index(live(L), live(I));
			sources = rt.index(live(alarm), 3);
			if (!truthy((rt.isIn(f, live(alarmsource), live(sources)) ? 1 : 0))) {
				sources = rt.modify(live(sources), live(alarmsource), add);
			}
			return 1;
		}
	}
	rt.endFor(f, 0);
	C = null;
	CL = null;
	if ((truthy(live(O)) && truthy((rt.istype(live(O), T("/list")) ? 1 : 0)))) {
		if (isEqual(rt.getLen(f, (CL = live(O))), 1)) {
			C = rt.index(live(CL), 1);
		}
	} else {
		if ((truthy(live(O)) && truthy((rt.istype(live(O), T("/obj/machinery/camera")) ? 1 : 0)))) {
			C = live(O);
		}
	}
	$0 = live(L);
	$1 = rt.fv(f, "name", live(A));
	$2 = live(A);
	if (truthy(live(C))) {
		$3 = live(C);
	} else {
		$3 = live(O);
	}
	rt.setAt($0, $1, rt.list($2, $3, rt.list(live(alarmsource))));
	if (truthy(live(O))) {
		if ((truthy(live(C)) && truthy(rt.callName(f, live(C), "can_use", [])))) {
			rt.callSrc(f, "queueAlarm", [fmt("--- ＀ alarm detected in ＀! (<A HREF=?src=＃;switchcamera=＃>＀</A>)", [live(_class), rt.fv(f, "name", live(A)), live(f.src), live(C), rt.fv(f, "c_tag", live(C))]), live(_class)]);
		} else {
			if ((truthy(live(CL)) && truthy(rt.len(f, live(CL))))) {
				foo = 0;
				dat2 = "";
				I_5 = null;
				rt.forList(f, 0, live(CL), T("/obj/machinery/camera"));
				while (($e = rt.next(f, 0)) !== undefined) {
					I_5 = $e;
					if (!truthy(live(foo))) {
						$0 = "";
					} else {
						$0 = " | ";
					}
					dat2 = rt.modify(live(dat2), fmt("＀<A HREF=?src=＃;switchcamera=＃>＀</A>", [$0, live(f.src), live(I_5), rt.fv(f, "c_tag", live(I_5))]), add);
					foo = 1;
				}
				rt.endFor(f, 0);
				rt.callSrc(f, "queueAlarm", [fmt("--- ＀ alarm detected in ＀! (＀)", [live(_class), rt.fv(f, "name", live(A)), live(dat2)]), live(_class)]);
			} else {
				rt.callSrc(f, "queueAlarm", [fmt("--- ＀ alarm detected in ＀! (No Camera)", [live(_class), rt.fv(f, "name", live(A))]), live(_class)]);
			}
		}
	} else {
		rt.callSrc(f, "queueAlarm", [fmt("--- ＀ alarm detected in ＀! (No Camera)", [live(_class), rt.fv(f, "name", live(A))]), live(_class)]);
	}
	if (truthy(rt.sv(f, "viewalerts"))) {
		rt.callSrc(f, "ai_alerts", []);
	}
	return 1;
});

// /mob/living/silicon/ai/proc/cancelAlarm  (code/modules/mob/living/silicon/ai/ai.dm:564)
rt.def("/mob/living/silicon/ai/proc/cancelAlarm", function cancelAlarm(f: Frame, _class: Value, A: Value, origin: Value) {
	let L: Value = null, cleared: Value = null, I: Value = null, alarm: Value = null, srcs: Value = null;
	let $e: any;
	f.vars = () => [L, cleared, I, alarm, srcs, $e];
	L = rt.index(rt.sv(f, "alarms"), live(_class));
	cleared = 0;
	I = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual(live(I), rt.fv(f, "name", live(A)))) {
			alarm = rt.index(live(L), live(I));
			srcs = rt.index(live(alarm), 3);
			if (truthy((rt.isIn(f, live(origin), live(srcs)) ? 1 : 0))) {
				(srcs = rt.modify(live(srcs), live(origin), subtract));
			}
			if (isEqual(rt.len(f, live(srcs)), 0)) {
				cleared = 1;
				(L = rt.modify(live(L), live(I), subtract));
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(cleared))) {
		rt.callSrc(f, "queueAlarm", [fmt("--- ＀ alarm in ＀ has been cleared.", [live(_class), rt.fv(f, "name", live(A))]), live(_class), 0]);
		if (truthy(rt.sv(f, "viewalerts"))) {
			rt.callSrc(f, "ai_alerts", []);
		}
	}
	return (!truthy(live(cleared)) ? 1 : 0);
});

// /mob/living/silicon/ai/proc/ai_network_change  (code/modules/mob/living/silicon/ai/ai.dm:586)  may sleep
rt.def("/mob/living/silicon/ai/proc/ai_network_change", function* ai_network_change(f: Frame) {
	let cameralist: Value = null, U: Value = null, C: Value = null, tempnetwork: Value = null, i: Value = null, old_network: Value = null, C_3: Value = null;
	let $e: any;
	f.vars = () => [cameralist, U, C, tempnetwork, i, old_network, C_3, $e];
	yield* g.srcCall(f, "unset_machine");
	rt.setSv(f, "cameraFollow", null);
	cameralist = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	U = live(f.usr);
	C = null;
	rt.forList(f, 0, rt.fv(f, "cameras", rt.gl("cameranet")), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (!truthy((yield* g.callName(f, live(C), "can_use", [])))) {
			continue;
		}
		yield* g.callName(f, (tempnetwork = rt.fv(f, "network", live(C))), "Remove", ["CREED", "thunder", "RD", "toxins", "Prison"]);
		if (truthy(rt.len(f, live(tempnetwork)))) {
			i = null;
			rt.forList(f, 1, rt.fv(f, "network", live(C)));
			while (($e = rt.next(f, 1)) !== undefined) {
				i = $e;
				rt.setAt(live(cameralist), live(i), live(i));
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	old_network = rt.sv(f, "network");
	rt.setSv(f, "network", (yield* g.op(f, "Prompt", [1], [null, null, "Which network would you like to view?", live(U), live(cameralist)])));
	if (!truthy(rt.fv(f, "eyeobj", live(U)))) {
		yield* g.callName(f, live(U), "view_core", []);
		return live(f.dot);
	}
	if (rt.sv(f, "network") === null) {
		rt.setSv(f, "network", live(old_network));
	} else {
		C_3 = null;
		rt.forList(f, 0, rt.fv(f, "cameras", rt.gl("cameranet")), T("/obj/machinery/camera"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C_3 = $e;
			if (!truthy((yield* g.callName(f, live(C_3), "can_use", [])))) {
				continue;
			}
			if (truthy((rt.isIn(f, rt.sv(f, "network"), rt.fv(f, "network", live(C_3))) ? 1 : 0))) {
				yield* g.callName(f, rt.fv(f, "eyeobj", live(U)), "setLoc", [rt.getStep(f, live(C_3), 0)]);
				break;
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>Switched to ＀ camera network.</span>", [rt.sv(f, "network")])]);
	return f.dot;
}, true, { verb: { name: "Jump To Network", category: "AI Commands" } });

// /mob/living/silicon/ai/proc/choose_modules  (code/modules/mob/living/silicon/ai/ai.dm:628)  may sleep
rt.def("/mob/living/silicon/ai/proc/choose_modules", function* choose_modules(f: Frame) {
	yield* g.callName(f, rt.sv(f, "malf_picker"), "use", [live(f.src)]);
	return f.dot;
}, true, { verb: { name: "Choose Module", category: "Malfunction" } });

// /mob/living/silicon/ai/proc/ai_statuschange  (code/modules/mob/living/silicon/ai/ai.dm:634)  may sleep
rt.def("/mob/living/silicon/ai/proc/ai_statuschange", function* ai_statuschange(f: Frame) {
	let ai_emotions: Value = null, emote: Value = null, M: Value = null, AISD: Value = null, SD: Value = null;
	let $e: any;
	f.vars = () => [ai_emotions, emote, M, AISD, SD, $e];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	ai_emotions = rt.list("Very Happy", "Happy", "Neutral", "Unsure", "Confused", "Sad", "BSOD", "Blank", "Problems?", "Awesome", "Facepalm", "Friend Computer", "Dorfy", "Blue Glow", "Red Glow");
	emote = (yield* g.op(f, "Prompt", [0], [null, null, "AI Status", "Please, select a status!", live(ai_emotions)]));
	M = null;
	rt.forList(f, 0, rt.gl("ai_status_displays"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/obj/machinery/ai_status_display")) ? 1 : 0))) {
			rt.setFv(f, "emotion", (AISD = live(M)), live(emote));
		} else {
			if (truthy((rt.istype(live(M), T("/obj/machinery/status_display")) ? 1 : 0))) {
				SD = live(M);
				if (isEqual(live(emote), "Friend Computer")) {
					rt.setFv(f, "friendc", live(SD), 1);
				} else {
					rt.setFv(f, "friendc", live(SD), 0);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true, { verb: { name: "AI Status", category: "AI Commands" } });

// /mob/living/silicon/ai/proc/ai_hologram_change  (code/modules/mob/living/silicon/ai/ai.dm:657)  may sleep
rt.def("/mob/living/silicon/ai/proc/ai_hologram_change", function* ai_hologram_change(f: Frame) {
	let input: Value = null, icon_list: Value = null, personnel_list: Value = null, t: Value = null, character_icon: Value = null;
	let $0: any, $e: any;
	f.vars = () => [input, icon_list, personnel_list, t, character_icon, $0, $e];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	input = null;
	$0 = (yield* g.call(f, P("/proc/alert"), null, ["Would you like to select a hologram based on a crew member, an animal, or switch to a unique avatar?", null, "Crew Member", "Unique", "Animal"]));
	if ($0 === "Crew Member") {
		personnel_list = rt.list();
		t = null;
		rt.forList(f, 0, rt.fv(f, "locked", rt.gl("data_core")), T("/datum/data/record"));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			rt.setAt(live(personnel_list), fmt("＀: ＀", [rt.index(rt.fv(f, "fields", live(t)), "name"), rt.index(rt.fv(f, "fields", live(t)), "rank")]), rt.index(rt.fv(f, "fields", live(t)), "image"));
		}
		rt.endFor(f, 0);
		if (truthy(rt.len(f, live(personnel_list)))) {
			input = (yield* g.op(f, "Prompt", [1], [null, null, null, "Select a crew member:", live(personnel_list)]));
			if (truthy((character_icon = rt.index(live(personnel_list), live(input))))) {
				yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "holo_icon")]);
				rt.setSv(f, "holo_icon", (yield* g.call(f, P("/proc/getHologramIcon"), null, [(yield* g.call(f, P("/proc/icon"), null, [live(character_icon)]))])));
			}
		} else {
			yield* g.call(f, P("/proc/alert"), null, ["No suitable records found. Aborting."]);
		}
	} else if ($0 === "Animal") {
		icon_list = rt.alist(f, ["bear", rt.rsc("icons/mob/animal.dmi"), "carp", rt.rsc("icons/mob/animal.dmi"), "chicken", rt.rsc("icons/mob/animal.dmi"), "corgi", rt.rsc("icons/mob/pets.dmi"), "cow", rt.rsc("icons/mob/animal.dmi"), "crab", rt.rsc("icons/mob/animal.dmi"), "fox", rt.rsc("icons/mob/pets.dmi"), "goat", rt.rsc("icons/mob/animal.dmi"), "cat", rt.rsc("icons/mob/pets.dmi"), "cat2", rt.rsc("icons/mob/pets.dmi"), "poly", rt.rsc("icons/mob/animal.dmi"), "pug", rt.rsc("icons/mob/pets.dmi"), "spider", rt.rsc("icons/mob/animal.dmi")]);
		if (truthy((input = (yield* g.op(f, "Prompt", [1], [null, null, null, "Please select a hologram:", live(icon_list)]))))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "holo_icon")]);
			$0 = live(input);
			if ($0 === "poly") {
				rt.setSv(f, "holo_icon", (yield* g.call(f, P("/proc/getHologramIcon"), null, [(yield* g.call(f, P("/proc/icon"), null, [rt.index(live(icon_list), live(input)), "parrot_fly"]))])));
			} else if ($0 === "chicken") {
				rt.setSv(f, "holo_icon", (yield* g.call(f, P("/proc/getHologramIcon"), null, [(yield* g.call(f, P("/proc/icon"), null, [rt.index(live(icon_list), live(input)), "chicken_brown"]))])));
			} else if ($0 === "spider") {
				rt.setSv(f, "holo_icon", (yield* g.call(f, P("/proc/getHologramIcon"), null, [(yield* g.call(f, P("/proc/icon"), null, [rt.index(live(icon_list), live(input)), "guard"]))])));
			} else {
				rt.setSv(f, "holo_icon", (yield* g.call(f, P("/proc/getHologramIcon"), null, [(yield* g.call(f, P("/proc/icon"), null, [rt.index(live(icon_list), live(input)), live(input)]))])));
			}
		}
	} else {
		icon_list = rt.alist(f, ["default", rt.rsc("icons/mob/ai.dmi"), "floating face", rt.rsc("icons/mob/ai.dmi"), "xeno queen", rt.rsc("icons/mob/alien.dmi"), "horror", rt.rsc("icons/mob/ai.dmi")]);
		if (truthy((input = (yield* g.op(f, "Prompt", [1], [null, null, null, "Please select a hologram:", live(icon_list)]))))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "holo_icon")]);
			$0 = live(input);
			if ($0 === "xeno queen") {
				rt.setSv(f, "holo_icon", (yield* g.call(f, P("/proc/getHologramIcon"), null, [(yield* g.call(f, P("/proc/icon"), null, [rt.index(live(icon_list), live(input)), "alienq"]))])));
			} else {
				rt.setSv(f, "holo_icon", (yield* g.call(f, P("/proc/getHologramIcon"), null, [(yield* g.call(f, P("/proc/icon"), null, [rt.index(live(icon_list), live(input)), live(input)]))])));
			}
		}
	}
	return live(f.dot);
}, true, { verb: { name: "Change Hologram", category: "AI Commands", desc: "Change the default hologram available to AI to something else." } });

// /mob/living/silicon/ai/proc/corereturn  (code/modules/mob/living/silicon/ai/ai.dm:728)  may sleep
rt.def("/mob/living/silicon/ai/proc/corereturn", function* corereturn(f: Frame) {
	let apc: Value = null;
	f.vars = () => [apc];
	if (!truthy((rt.istype((apc = rt.fv(f, "loc", live(f.src))), T("/obj/machinery/power/apc")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You are already in your Main Core.</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(apc), "malfvacate", []);
	return f.dot;
}, true, { verb: { name: "Return to Main Core", category: "Malfunction" } });

// /mob/living/silicon/ai/proc/toggle_camera_light  (code/modules/mob/living/silicon/ai/ai.dm:734)
rt.def("/mob/living/silicon/ai/proc/toggle_camera_light", function toggle_camera_light(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	if (!isEqual(rt.sv(f, "stat"), 0)) {
		return live(f.dot);
	}
	rt.setSv(f, "camera_light_on", (!truthy(rt.sv(f, "camera_light_on")) ? 1 : 0));
	if (!truthy(rt.sv(f, "camera_light_on"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "Camera lights deactivated."]);
		C = null;
		rt.forList(f, 0, rt.sv(f, "lit_cameras"), T("/obj/machinery/camera"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			rt.callName(f, live(C), "set_light", [0]);
			rt.setSv(f, "lit_cameras", rt.list());
		}
		rt.endFor(f, 0);
		return live(f.dot);
	}
	rt.callSrc(f, "light_cameras", []);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "Camera lights activated."]);
	return f.dot;
});

// /mob/living/silicon/ai/proc/light_cameras  (code/modules/mob/living/silicon/ai/ai.dm:755)
rt.def("/mob/living/silicon/ai/proc/light_cameras", function light_cameras(f: Frame) {
	let _add: Value = null, remove: Value = null, visible: Value = null, CC: Value = null, C: Value = null, C_3: Value = null;
	let $e: any;
	f.vars = () => [_add, remove, visible, CC, C, C_3, $e];
	_add = rt.list();
	remove = rt.list();
	visible = rt.list();
	CC = null;
	rt.forList(f, 0, rt.fv(f, "visibleCameraChunks", rt.sv(f, "eyeobj")), T("/datum/camerachunk"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CC = $e;
		C = null;
		rt.forList(f, 1, rt.fv(f, "cameras", live(CC)), T("/obj/machinery/camera"));
		while (($e = rt.next(f, 1)) !== undefined) {
			C = $e;
			if ((!truthy(rt.callName(f, live(C), "can_use", [])) || rt.gt(rt.call(f, P("/proc/get_dist"), null, [live(C), rt.sv(f, "eyeobj")]), 7))) {
				continue;
			}
			(visible = rt.modify(live(visible), live(C), rt.bitOr));
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	_add = subtract(live(visible), rt.sv(f, "lit_cameras"));
	remove = subtract(rt.sv(f, "lit_cameras"), live(visible));
	C_3 = null;
	rt.forList(f, 0, live(remove), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C_3 = $e;
		(rt.modSrcVar(f, "lit_cameras", live(C_3), subtract));
		rt.callName(f, live(C_3), "Togglelight", [0]);
	}
	rt.endFor(f, 0);
	C_3 = null;
	rt.forList(f, 0, live(_add), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C_3 = $e;
		rt.callName(f, live(C_3), "Togglelight", [1]);
		(rt.modSrcVar(f, "lit_cameras", live(C_3), rt.bitOr));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/silicon/ai/proc/control_integrated_radio  (code/modules/mob/living/silicon/ai/ai.dm:779)  may sleep
rt.def("/mob/living/silicon/ai/proc/control_integrated_radio", function* control_integrated_radio(f: Frame) {
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Accessing Subspace Transceiver control..."]);
	if (!truthy(rt.sv(f, "radio"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "radio"), "interact", [live(f.src)]);
	return f.dot;
}, true, { verb: { name: "Transceiver Settings", category: "AI Commands", desc: "Allows you to change settings of your radio." } });

// /mob/living/silicon/ai/proc/set_syndie_radio  (code/modules/mob/living/silicon/ai/ai.dm:788)  may sleep
rt.def("/mob/living/silicon/ai/proc/set_syndie_radio", function* set_syndie_radio(f: Frame) {
	if (!truthy(rt.sv(f, "radio"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "radio"), "make_syndie", []);
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/set_automatic_say_channel  (code/modules/mob/living/silicon/ai/ai.dm:795)  may sleep
rt.def("/mob/living/silicon/ai/proc/set_automatic_say_channel", function* set_automatic_say_channel(f: Frame) {
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "set_autosay");
	return f.dot;
}, true, { verb: { name: "Set Auto Announce Mode", category: "AI Commands", desc: "Modify the default radio setting for your automatic announcements." } });

// /mob/living/silicon/ai/proc/transfer_ai  (code/modules/mob/living/silicon/ai/ai.dm:800)  may sleep
rt.def("/mob/living/silicon/ai/proc/transfer_ai", function* transfer_ai(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!isEqual(live(f.args[0]), 1)) return f.dot;
	if (!truthy(rt.sv(f, "can_be_carded"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='boldwarning'>Transfer failed.</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "disconnect_shell");
	if (!truthy(rt.sv(f, "mind"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>No intelligence patterns detected.</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "ShutOffDoomsdayDevice");
	yield* g.new_(f, T("/obj/structure/AIcore/deactivated"), [rt.sv(f, "loc")]);
	yield* g.srcCall(f, "ai_restore_power");
	rt.setSv(f, "control_disabled", 1);
	rt.setSv(f, "radio_enabled", 0);
	yield* g.srcCall(f, "forceMove", live(f.args[3]));
	rt.setFv(f, "AI", live(f.args[3]), live(f.src));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "You have been downloaded to a mobile storage device. Remote device connection severed."]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='boldnotice'>Transfer successful</span>: ＀ (＀.exe) removed from host terminal and stored within local memory.", [rt.sv(f, "name"), (yield* g.call(f, P("/proc/rand"), null, [1000, 9999]))])]);
	return f.dot;
}, true, { args: ["interaction", "user", "AI", "card"] });

// /mob/living/silicon/ai/proc/canUseTopic  (code/modules/mob/living/silicon/ai/ai.dm:826)
rt.def("/mob/living/silicon/ai/proc/canUseTopic", function canUseTopic(f: Frame, M: Value, be_close: Value) {
	f.vars = () => [be_close];
	if (live(be_close) === null) {
		be_close = 0;
	}
	if (truthy(rt.sv(f, "stat"))) {
		return live(f.dot);
	}
	if ((truthy(live(be_close)) && !rt.le(rt.call(f, P("/proc/get_dist"), null, [live(M), live(f.src)]), 1))) {
		return live(f.dot);
	}
	if ((((truthy(live(M)) && truthy(rt.gl("cameranet"))) && !truthy(rt.callName(f, rt.gl("cameranet"), "checkTurfVis", [rt.call(f, P("/proc/get_turf_pixel"), null, [live(M)])]))) && !truthy(rt.sv(f, "apc_override")))) {
		return live(f.dot);
	}
	return 1;
});

// /mob/living/silicon/ai/proc/relay_speech  (code/modules/mob/living/silicon/ai/ai.dm:836)  may sleep
rt.def("/mob/living/silicon/ai/proc/relay_speech", function* relay_speech(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	let start: Value = null, namepart: Value = null, hrefpart: Value = null, jobpart: Value = null, S: Value = null, rendered: Value = null;
	f.vars = () => [message, speaker, message_language, raw_message, radio_freq, spans, message_mode, start, namepart, hrefpart, jobpart, S, rendered];
	raw_message = (yield* g.srcCall(f, "lang_treat", live(speaker), live(message_language), live(raw_message), live(spans), live(message_mode)));
	start = "Relayed Speech: ";
	namepart = fmt("＀＀", [(yield* g.callName(f, live(speaker), "GetVoice", [])), (yield* g.callName(f, live(speaker), "get_alt_name", []))]);
	hrefpart = fmt("<a href='?src=＃;track=＀'>", [live(f.src), (yield* g.call(f, P("/proc/html_encode"), null, [live(namepart)]))]);
	jobpart = null;
	if (truthy((rt.istype(live(speaker), T("/mob/living/carbon")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "job", (S = live(speaker))))) {
			jobpart = fmt("＀", [rt.fv(f, "job", live(S))]);
		}
	} else {
		jobpart = "Unknown";
	}
	yield* g.srcCall(f, "show_message", (rendered = fmt("<i><span class='game say'>＀<span class='name'>＀＀ (＀)</a> </span><span class='message'>＀</span></span></i>", [live(start), live(hrefpart), live(namepart), live(jobpart), live(raw_message)])), 2);
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/fully_replace_character_name  (code/modules/mob/living/silicon/ai/ai.dm:854)  may sleep
rt.def("/mob/living/silicon/ai/proc/fully_replace_character_name", function* fully_replace_character_name(f: Frame) {
	let Slave: Value = null;
	let $e: any;
	f.vars = () => [Slave, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(live(f.args[0]), rt.sv(f, "real_name"))) return f.dot;
	if (truthy(rt.sv(f, "eyeobj"))) {
		rt.setFv(f, "name", rt.sv(f, "eyeobj"), fmt("＀ (AI Eye)", [live(f.args[1])]));
	}
	Slave = null;
	rt.forList(f, 0, rt.sv(f, "connected_robots"), T("/mob/living/silicon/robot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Slave = $e;
		yield* g.callName(f, live(Slave), "show_laws", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["oldname", "newname"] });

// /mob/living/silicon/ai/proc/replace_identification_name  (code/modules/mob/living/silicon/ai/ai.dm:866)
rt.def("/mob/living/silicon/ai/proc/replace_identification_name", function replace_identification_name(f: Frame, oldname: Value, newname: Value) {
	if (!truthy(rt.sv(f, "aiPDA"))) return f.dot;
	rt.setFv(f, "owner", rt.sv(f, "aiPDA"), live(newname));
	rt.setFv(f, "name", rt.sv(f, "aiPDA"), add(add(add(live(newname), " ("), rt.fv(f, "ownjob", rt.sv(f, "aiPDA"))), ")"));
	return f.dot;
});

// /mob/living/silicon/ai/proc/add_malf_picker  (code/modules/mob/living/silicon/ai/ai.dm:870)  may sleep
rt.def("/mob/living/silicon/ai/proc/add_malf_picker", function* add_malf_picker(f: Frame) {
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "In the top right corner of the screen you will find the Malfunctions tab, where you can purchase various abilities, from upgraded surveillance to station ending doomsday devices."]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "You are also capable of hacking APCs, which grants you more points to spend on your Malfunction powers. The drawback is that a hacked APC will give you away if spotted by the crew. Hacking an APC takes 60 seconds."]);
	yield* g.srcCall(f, "view_core");
	rt.modSrcVar(f, "verbs", P("/mob/living/silicon/ai/proc/choose_modules"), add);
	rt.setSv(f, "malf_picker", (yield* g.new_(f, T("/datum/module_picker"), [])));
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/reset_perspective  (code/modules/mob/living/silicon/ai/ai.dm:879)  may sleep
rt.def("/mob/living/silicon/ai/proc/reset_perspective", function* reset_perspective(f: Frame, A: Value) {
	let AT: Value = null;
	f.vars = () => [A, AT];
	if (truthy(rt.sv(f, "camera_light_on"))) {
		yield* g.srcCall(f, "light_cameras");
	}
	if (truthy((rt.istype(live(A), T("/obj/machinery/camera")) ? 1 : 0))) {
		rt.setSv(f, "current", live(A));
	}
	if (!truthy(rt.sv(f, "client"))) return f.dot;
	if (truthy((rt.istype(live(A), T("/atom/movable")) ? 1 : 0))) {
		rt.setFv(f, "perspective", rt.sv(f, "client"), 1);
		rt.setFv(f, "eye", rt.sv(f, "client"), live(A));
	} else {
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
			if (truthy(rt.sv(f, "eyeobj"))) {
				rt.setFv(f, "eye", rt.sv(f, "client"), rt.sv(f, "eyeobj"));
				rt.setFv(f, "perspective", rt.sv(f, "client"), 1);
			} else {
				rt.setFv(f, "eye", rt.sv(f, "client"), rt.fv(f, "mob", rt.sv(f, "client")));
				rt.setFv(f, "perspective", rt.sv(f, "client"), 0);
			}
		} else {
			rt.setFv(f, "perspective", rt.sv(f, "client"), 1);
			rt.setFv(f, "eye", rt.sv(f, "client"), rt.sv(f, "loc"));
		}
	}
	yield* g.srcCall(f, "update_sight");
	if (!isEqual(rt.fv(f, "eye", rt.sv(f, "client")), live(f.src))) {
		yield* g.callName(f, (AT = rt.fv(f, "eye", rt.sv(f, "client"))), "get_remote_view_fullscreens", [live(f.src)]);
	} else {
		yield* g.srcCall(f, "clear_fullscreen", "remote_view", 0);
	}
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/revive  (code/modules/mob/living/silicon/ai/ai.dm:905)  may sleep
rt.def("/mob/living/silicon/ai/proc/revive", function* revive(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	rt.setSv(f, "icon_state", "ai");
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// /mob/living/silicon/ai/proc/malfhacked  (code/modules/mob/living/silicon/ai/ai.dm:912)  may sleep
rt.def("/mob/living/silicon/ai/proc/malfhacked", function* malfhacked(f: Frame, apc: Value) {
	f.vars = () => [apc];
	rt.setSv(f, "malfhack", null);
	rt.setSv(f, "malfhacking", 0);
	yield* g.srcCall(f, "clear_alert", "hackingapc");
	if (((!truthy((rt.istype(live(apc), T("/obj/machinery/power/apc")) ? 1 : 0)) || (!truthy(live(apc)) || truthy(rt.fv(f, "gc_destroyed", live(apc))))) || truthy(rt.bitAnd(rt.fv(f, "stat", live(apc)), 1)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Hack aborted. The designated APC no longer exists on the power network.</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/buzz-two.ogg"), 50, 1]);
	} else {
		if (truthy(rt.fv(f, "aidisabled", live(apc)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='danger'>Hack aborted. ＄！ is no longer responding to our systems.</span>", [live(apc)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 1]);
		} else {
			rt.modField(f, rt.sv(f, "malf_picker"), "processing_time", 10, add);
			rt.setFv(f, "malfai", live(apc), (rt.sv(f, "parent") || live(f.src)));
			rt.setFv(f, "malfhack", live(apc), 1);
			rt.setFv(f, "locked", live(apc), 1);
			rt.setFv(f, "coverlocked", live(apc), 1);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/ding.ogg"), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Hack complete. ＄！ is now under your exclusive control.", [live(apc)])]);
			yield* g.callName(f, live(apc), "update_icon", []);
		}
	}
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/machinery/power/apc" }] });

// /mob/living/silicon/ai/verb/deploy_to_shell  (code/modules/mob/living/silicon/ai/ai.dm:936)  may sleep
rt.def("/mob/living/silicon/ai/verb/deploy_to_shell", function* deploy_to_shell(f: Frame, target: Value) {
	let possible: Value = null, borgie: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [target, possible, borgie, R, $e];
	if (((truthy(rt.sv(f, "stat")) || truthy((yield* g.srcCall(f, "lacks_power")))) || truthy(rt.sv(f, "control_disabled")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Wireless networking module is offline.</span>"]);
		return live(f.dot);
	}
	possible = rt.list();
	borgie = null;
	rt.forList(f, 0, rt.gl("available_ai_shells"));
	while (($e = rt.next(f, 0)) !== undefined) {
		borgie = $e;
		if ((((truthy(rt.gv(f, "shell", (R = live(borgie)))) && !truthy(rt.fv(f, "deployed", live(R)))) && !isEqual(rt.fv(f, "stat", live(R)), 2)) && (!truthy(rt.fv(f, "connected_ai", live(R))) || isEqual(rt.fv(f, "connected_ai", live(R)), live(f.src))))) {
			possible = rt.modify(live(possible), live(R), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.length(live(possible)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "No usable AI shell beacons detected."]);
	}
	if ((!truthy(live(target)) || !truthy((rt.isIn(f, live(target), live(possible)) ? 1 : 0)))) {
		target = (yield* g.op(f, "Prompt", [1], [null, null, "Which body to control?", live(f.src), live(possible)]));
	}
	if ((((!truthy(live(target)) || isEqual(rt.fv(f, "stat", live(target)), 2)) || truthy(rt.fv(f, "deployed", live(target)))) || !(!truthy(rt.fv(f, "connected_ai", live(target))) || isEqual(rt.fv(f, "connected_ai", live(target)), live(f.src))))) {
		return live(f.dot);
	} else {
		if (truthy(rt.sv(f, "mind"))) {
			yield* g.call(f, P("/proc/soullink"), null, [T("/datum/soullink/sharedbody"), live(f.src), live(target)]);
			rt.setSv(f, "deployed_shell", live(target));
			yield* g.callName(f, live(target), "deploy_init", [live(f.src)]);
			yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(target)]);
		}
	}
	yield* g.srcCall(f, "diag_hud_set_deployed");
	return f.dot;
}, true, { verb: { name: "Deploy to Shell", category: "AI Commands" }, argTypes: [{ type: 8, path: "/mob/living/silicon/robot" }] });

rt.type(155, "/datum/action/innate/deploy_shell", "/datum/action/innate", {
	name: "Deploy to AI Shell",
	desc: "Wirelessly control a specialized cyborg shell.",
	button_icon_state: "ai_shell",
});

// /datum/action/innate/deploy_shell/proc/Trigger  (code/modules/mob/living/silicon/ai/ai.dm:969)  may sleep
rt.def("/datum/action/innate/deploy_shell/proc/Trigger", function* Trigger(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (!truthy((AI = rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(AI), "deploy_to_shell", []);
	return f.dot;
}, true);

rt.type(156, "/datum/action/innate/deploy_last_shell", "/datum/action/innate", {
	last_used_shell: null,
	name: "Reconnect to shell",
	desc: "Reconnect to the most recently used AI shell.",
	button_icon_state: "ai_last_shell",
});

// /datum/action/innate/deploy_last_shell/proc/Trigger  (code/modules/mob/living/silicon/ai/ai.dm:981)  may sleep
rt.def("/datum/action/innate/deploy_last_shell/proc/Trigger", function* Trigger(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "last_used_shell"))) {
		yield* g.callName(f, (AI = rt.sv(f, "owner")), "deploy_to_shell", [rt.sv(f, "last_used_shell")]);
	} else {
		yield* g.srcCall(f, "Remove", rt.sv(f, "owner"));
	}
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/disconnect_shell  (code/modules/mob/living/silicon/ai/ai.dm:991)  may sleep
rt.def("/mob/living/silicon/ai/proc/disconnect_shell", function* disconnect_shell(f: Frame) {
	if (truthy(rt.sv(f, "deployed_shell"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Your remote connection has been reset!</span>"]);
		yield* g.callName(f, rt.sv(f, "deployed_shell"), "undeploy", []);
	}
	yield* g.srcCall(f, "diag_hud_set_deployed");
	return f.dot;
}, true);

rt.type(4834, "/mob/living/silicon/ai/spawned", "/mob/living/silicon/ai", {});

// /mob/living/silicon/ai/spawned/proc/Initialize  (code/modules/mob/living/silicon/ai/ai.dm:999)  may sleep
rt.def("/mob/living/silicon/ai/spawned/proc/Initialize", function* Initialize(f: Frame) {
	if (!truthy(live(f.args[2]))) {
		f.args[2] = live(f.src);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["mapload", "L", "target_ai"] });
