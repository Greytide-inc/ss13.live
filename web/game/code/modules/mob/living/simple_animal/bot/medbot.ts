// From code/modules/mob/living/simple_animal/bot/medbot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5038, "/mob/living/simple_animal/bot/medbot", "/mob/living/simple_animal/bot", {
	reagent_glass: null,
	skin: null,
	patient: null,
	oldpatient: null,
	oldloc: null,
	last_found: 0,
	last_newpatient_speak: 0,
	injection_amount: 15,
	heal_threshold: 10,
	use_beaker: 0,
	declare_crit: 1,
	declare_cooldown: 0,
	stationary_mode: 0,
	treatment_brute_avoid: "tricordrazine",
	treatment_brute: "bicaridine",
	treatment_oxy_avoid: null,
	treatment_oxy: "dexalin",
	treatment_fire_avoid: "tricordrazine",
	treatment_fire: "kelotane",
	treatment_tox_avoid: "tricordrazine",
	treatment_tox: "charcoal",
	treatment_virus_avoid: null,
	treatment_virus: "spaceacillin",
	treat_virus: 1,
	shut_up: 0,
	anchored: 0,
	pass_flags: 16,
	radio_channel: "Medical",
	bot_type: 16,
	model: "Medibot",
	window_id: "automed",
	window_name: "Automatic Medical Unit v1.1",
	data_hud_type: 4,
	name: "１Medibot",
	desc: "A little medical robot. He looks somewhat underwhelmed.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "medibot0",
	density: 0,
	health: 20,
	maxHealth: 20,
	status_flags: 9,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_med"),
	bot_core_type: rt.typePath("/obj/machinery/bot_core/medbot"),
});

// /mob/living/simple_animal/bot/medbot/proc/update_icon  (code/modules/mob/living/simple_animal/bot/medbot.dm:79)
rt.def("/mob/living/simple_animal/bot/medbot/proc/update_icon", function update_icon(f: Frame) {
	if (!truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "icon_state", "medibot0");
		return live(f.dot);
	}
	if (truthy(rt.callSrc(f, "IsStun", []))) {
		rt.setSv(f, "icon_state", "medibota");
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "mode"), 10)) {
		rt.setSv(f, "icon_state", fmt("medibots＀", [rt.sv(f, "stationary_mode")]));
		return live(f.dot);
	} else {
		if (truthy(rt.sv(f, "stationary_mode"))) {
			rt.setSv(f, "icon_state", "medibot2");
		} else {
			rt.setSv(f, "icon_state", "medibot1");
		}
	}
	return f.dot;
});

// /mob/living/simple_animal/bot/medbot/proc/Initialize  (code/modules/mob/living/simple_animal/bot/medbot.dm:94)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/proc/Initialize", function* Initialize(f: Frame) {
	let J: Value = null;
	f.vars = () => [J];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	if (truthy(rt.sv(f, "skin"))) {
		yield* g.srcCall(f, "add_overlay", fmt("medskin_＀", [rt.sv(f, "skin")]));
	}
	J = (yield* g.new_(f, T("/datum/job/doctor"), []));
	rt.modField(f, rt.sv(f, "access_card"), "access", (yield* g.callName(f, live(J), "get_access", [])), add);
	rt.setSv(f, "prev_access", rt.fv(f, "access", rt.sv(f, "access_card")));
	yield* g.call(f, P("/proc/qdel"), null, [live(J)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/medbot/proc/update_canmove  (code/modules/mob/living/simple_animal/bot/medbot.dm:106)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/proc/update_canmove", function* update_canmove(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/medbot/proc/bot_reset  (code/modules/mob/living/simple_animal/bot/medbot.dm:110)
rt.def("/mob/living/simple_animal/bot/medbot/proc/bot_reset", function bot_reset(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "patient", null);
	rt.setSv(f, "oldpatient", null);
	rt.setSv(f, "oldloc", null);
	rt.setSv(f, "last_found", rt.worldTime(f));
	rt.setSv(f, "declare_cooldown", 0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /mob/living/simple_animal/bot/medbot/proc/soft_reset  (code/modules/mob/living/simple_animal/bot/medbot.dm:119)
rt.def("/mob/living/simple_animal/bot/medbot/proc/soft_reset", function soft_reset(f: Frame) {
	rt.setSv(f, "path", rt.list());
	rt.setSv(f, "patient", null);
	rt.setSv(f, "mode", 0);
	rt.setSv(f, "last_found", rt.worldTime(f));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /mob/living/simple_animal/bot/medbot/proc/set_custom_texts  (code/modules/mob/living/simple_animal/bot/medbot.dm:127)
rt.def("/mob/living/simple_animal/bot/medbot/proc/set_custom_texts", function set_custom_texts(f: Frame) {
	rt.setSv(f, "text_hack", fmt("You corrupt ＀'s reagent processor circuits.", [rt.sv(f, "name")]));
	rt.setSv(f, "text_dehack", fmt("You reset ＀'s reagent processor circuits.", [rt.sv(f, "name")]));
	rt.setSv(f, "text_dehack_fail", fmt("＀ seems damaged and does not respond to reprogramming!", [rt.sv(f, "name")]));
	return f.dot;
});

// /mob/living/simple_animal/bot/medbot/proc/attack_paw  (code/modules/mob/living/simple_animal/bot/medbot.dm:132)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /mob/living/simple_animal/bot/medbot/proc/get_controls  (code/modules/mob/living/simple_animal/bot/medbot.dm:136)
rt.def("/mob/living/simple_animal/bot/medbot/proc/get_controls", function get_controls(f: Frame, user: Value) {
	let dat: Value = null;
	let $0: any, $1: any;
	f.vars = () => [dat, $0, $1];
	dat = null;
	dat = rt.modify(live(dat), rt.callSrc(f, "hack", [live(user)]), add);
	dat = rt.modify(live(dat), rt.callSrc(f, "showpai", [live(user)]), add);
	dat = rt.modify(live(dat), "<TT><B>Medical Unit Controls v1.1</B></TT><BR><BR>", add);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "on"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	dat = rt.modify(live(dat), fmt("Status: <A href='?src=＃;power=1'>＀</A><BR>", [$0, $1]), add);
	if (truthy(rt.sv(f, "open"))) {
		$0 = "opened";
	} else {
		$0 = "closed";
	}
	dat = rt.modify(live(dat), fmt("Maintenance panel panel is ＀<BR>", [$0]), add);
	dat = rt.modify(live(dat), "Beaker: ", add);
	if (truthy(rt.sv(f, "reagent_glass"))) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;eject=1'>Loaded [＀/＀]</a>", [live(f.src), rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "reagent_glass"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "reagent_glass")))]), add);
	} else {
		dat = rt.modify(live(dat), "None Loaded", add);
	}
	if (truthy(rt.sv(f, "locked"))) {
		$0 = "locked";
	} else {
		$0 = "unlocked";
	}
	dat = rt.modify(live(dat), fmt("<br>Behaviour controls are ＀<hr>", [$0]), add);
	if (((!truthy(rt.sv(f, "locked")) || truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) || truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))) {
		dat = rt.modify(live(dat), "<TT>Healing Threshold: ", add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;adj_threshold=-10'>--</a> ", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;adj_threshold=-5'>-</a> ", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("＀ ", [rt.sv(f, "heal_threshold")]), add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;adj_threshold=5'>+</a> ", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;adj_threshold=10'>++</a>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "</TT><br>", add);
		dat = rt.modify(live(dat), "<TT>Injection Level: ", add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;adj_inject=-5'>-</a> ", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("＀ ", [rt.sv(f, "injection_amount")]), add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;adj_inject=5'>+</a> ", [live(f.src)]), add);
		dat = rt.modify(live(dat), "</TT><br>", add);
		dat = rt.modify(live(dat), "Reagent Source: ", add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "use_beaker"))) {
			$1 = "Loaded Beaker (When available)";
		} else {
			$1 = "Internal Synthesizer";
		}
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;use_beaker=1'>＀</a><br>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "treat_virus"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Treat Viral Infections: <a href='?src=＃;virus=1'>＀</a><br>", [$0, $1]), add);
		if (truthy(rt.sv(f, "shut_up"))) {
			$0 = "off";
		} else {
			$0 = "on";
		}
		dat = rt.modify(live(dat), fmt("The speaker switch is ＀. <a href='?src=＃;togglevoice=＀'>Toggle</a><br>", [$0, live(f.src), 1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "declare_crit"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Critical Patient Alerts: <a href='?src=＃;critalerts=1'>＀</a><br>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "auto_patrol"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Patrol Station: <a href='?src=＃;operation=patrol'>＀</a><br>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "stationary_mode"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Stationary Mode: <a href='?src=＃;stationary=1'>＀</a><br>", [$0, $1]), add);
	}
	return live(dat);
});

// /mob/living/simple_animal/bot/medbot/proc/Topic  (code/modules/mob/living/simple_animal/bot/medbot.dm:174)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/proc/Topic", function* Topic(f: Frame) {
	let adjust_num: Value = null;
	f.vars = () => [adjust_num];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if (truthy(rt.at(live(f.args[1]), "adj_threshold"))) {
		if (rt.lt((rt.modSrcVar(f, "heal_threshold", (adjust_num = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "adj_threshold")]))), add)), 5)) {
			rt.setSv(f, "heal_threshold", 5);
		}
		if (rt.gt(rt.sv(f, "heal_threshold"), 75)) {
			rt.setSv(f, "heal_threshold", 75);
		}
	} else {
		if (truthy(rt.at(live(f.args[1]), "adj_inject"))) {
			if (rt.lt((rt.modSrcVar(f, "injection_amount", (adjust_num = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "adj_inject")]))), add)), 5)) {
				rt.setSv(f, "injection_amount", 5);
			}
			if (rt.gt(rt.sv(f, "injection_amount"), 15)) {
				rt.setSv(f, "injection_amount", 15);
			}
		} else {
			if (truthy(rt.at(live(f.args[1]), "use_beaker"))) {
				rt.setSv(f, "use_beaker", (!truthy(rt.sv(f, "use_beaker")) ? 1 : 0));
			} else {
				if ((truthy(rt.at(live(f.args[1]), "eject")) && rt.sv(f, "reagent_glass") !== null)) {
					rt.setFv(f, "loc", rt.sv(f, "reagent_glass"), rt.getStep(f, live(f.src), 0));
					rt.setSv(f, "reagent_glass", null);
				} else {
					if (truthy(rt.at(live(f.args[1]), "togglevoice"))) {
						rt.setSv(f, "shut_up", (!truthy(rt.sv(f, "shut_up")) ? 1 : 0));
					} else {
						if (truthy(rt.at(live(f.args[1]), "critalerts"))) {
							rt.setSv(f, "declare_crit", (!truthy(rt.sv(f, "declare_crit")) ? 1 : 0));
						} else {
							if (truthy(rt.at(live(f.args[1]), "stationary"))) {
								rt.setSv(f, "stationary_mode", (!truthy(rt.sv(f, "stationary_mode")) ? 1 : 0));
								rt.setSv(f, "path", rt.list());
								yield* g.srcCall(f, "update_icon");
							} else {
								if (truthy(rt.at(live(f.args[1]), "virus"))) {
									rt.setSv(f, "treat_virus", (!truthy(rt.sv(f, "treat_virus")) ? 1 : 0));
								}
							}
						}
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "update_controls");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /mob/living/simple_animal/bot/medbot/proc/attackby  (code/modules/mob/living/simple_animal/bot/medbot.dm:218)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/proc/attackby", function* attackby(f: Frame) {
	let current_health: Value = null;
	f.vars = () => [current_health];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/glass")) ? 1 : 0))) {
		f.dot = 1;
		if (truthy(rt.sv(f, "locked"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You cannot insert a beaker because the panel is locked!</span>"]);
			return live(f.dot);
		}
		if (rt.sv(f, "reagent_glass") !== null) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a beaker loaded!</span>"]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		rt.setSv(f, "reagent_glass", live(f.args[0]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀.</span>", [live(f.args[0])])]);
		yield* g.srcCall(f, "show_controls", live(f.args[1]));
	} else {
		current_health = rt.sv(f, "health");
		yield* g.callSuper(f, [], rt.Args.Same);
		if (!rt.lt(rt.sv(f, "health"), live(current_health))) return f.dot;
		yield* g.call(f, P("/proc/step_to"), null, [live(f.src), (yield* g.call(f, P("/proc/get_step_away"), null, [live(f.src), live(f.args[1])]))]);
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /mob/living/simple_animal/bot/medbot/proc/emag_act  (code/modules/mob/living/simple_animal/bot/medbot.dm:241)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/proc/emag_act", function* emag_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.sv(f, "emagged"), 2)) return f.dot;
	rt.setSv(f, "declare_crit", 0);
	if (truthy(live(f.args[0]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You short out ＀'s reagent synthesis circuits.</span>", [live(f.src)])]);
	}
	yield* g.srcCall(f, "audible_message", fmt("<span class='danger'>＀ buzzes oddly!</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/flick"), null, ["medibot_spark", live(f.src)]);
	if (!truthy(live(f.args[0]))) return f.dot;
	rt.setSv(f, "oldpatient", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/simple_animal/bot/medbot/proc/process_scan  (code/modules/mob/living/simple_animal/bot/medbot.dm:252)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/proc/process_scan", function* process_scan(f: Frame, H: Value) {
	let messagevoice: Value = null, message: Value = null;
	f.vars = () => [H, messagevoice, message];
	if (isEqual(rt.fv(f, "stat", live(H)), 2)) {
		return live(f.dot);
	}
	if ((isEqual(live(H), rt.sv(f, "oldpatient")) && rt.lt(rt.worldTime(f), add(rt.sv(f, "last_found"), 200)))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "assess_patient", live(H))))) {
		rt.setSv(f, "last_found", rt.worldTime(f));
		if (rt.lt(add(rt.sv(f, "last_newpatient_speak"), 300), rt.worldTime(f))) {
			messagevoice = rt.alist(f, [fmt("Hey, ＀! Hold on, I'm coming.", [rt.fv(f, "name", live(H))]), rt.rsc("sound/voice/mcoming.ogg"), fmt("Wait ＀! I want to help!", [rt.fv(f, "name", live(H))]), rt.rsc("sound/voice/mhelp.ogg"), fmt("＀, you appear to be injured!", [rt.fv(f, "name", live(H))]), rt.rsc("sound/voice/minjured.ogg")]);
			yield* g.srcCall(f, "speak", (message = rt.op(f, "PickUnweighted", [1], [live(messagevoice)])));
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.index(live(messagevoice), live(message)), 50, 0]);
			rt.setSv(f, "last_newpatient_speak", rt.worldTime(f));
		}
		return live(H);
	} else {
		return live(f.dot);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/medbot/proc/handle_automated_action  (code/modules/mob/living/simple_animal/bot/medbot.dm:271)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let messagevoice: Value = null, message: Value = null, scan_range: Value = null;
	let $0: any;
	f.vars = () => [messagevoice, message, scan_range, $0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "mode"), 10)) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "IsStun")))) {
		rt.setSv(f, "oldpatient", rt.sv(f, "patient"));
		rt.setSv(f, "patient", null);
		rt.setSv(f, "mode", 0);
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "frustration"), 8)) {
		rt.setSv(f, "oldpatient", rt.sv(f, "patient"));
		yield* g.srcCall(f, "soft_reset");
	}
	if (!truthy(rt.sv(f, "patient"))) {
		if ((!truthy(rt.sv(f, "shut_up")) && truthy(rt.op(f, "Prob", [], [1])))) {
			messagevoice = rt.alist(f, ["Radar, put a mask on!", rt.rsc("sound/voice/mradar.ogg"), "There's always a catch, and I'm the best there is.", rt.rsc("sound/voice/mcatch.ogg"), "I knew it, I should've been a plastic surgeon.", rt.rsc("sound/voice/msurgeon.ogg"), "What kind of medbay is this? Everyone's dropping like flies.", rt.rsc("sound/voice/mflies.ogg"), "Delicious!", rt.rsc("sound/voice/mdelicious.ogg")]);
			yield* g.srcCall(f, "speak", (message = rt.op(f, "PickUnweighted", [1], [live(messagevoice)])));
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.index(live(messagevoice), live(message)), 50, 0]);
		}
		if (truthy(rt.sv(f, "stationary_mode"))) {
			$0 = 1;
		} else {
			$0 = 7;
		}
		scan_range = $0;
		rt.setSv(f, "patient", (yield* g.srcCall(f, "scan", T("/mob/living/carbon/human"), rt.sv(f, "oldpatient"), live(scan_range))));
		rt.setSv(f, "oldpatient", rt.sv(f, "patient"));
	}
	if ((truthy(rt.sv(f, "patient")) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "patient")])), 1))) {
		if (!isEqual(rt.sv(f, "mode"), 10)) {
			rt.setSv(f, "mode", 10);
			yield* g.srcCall(f, "update_icon");
			rt.setSv(f, "frustration", 0);
			yield* g.srcCall(f, "medicate_patient", rt.sv(f, "patient"));
		}
		return live(f.dot);
	} else {
		if (((truthy(rt.sv(f, "patient")) && truthy(rt.len(f, rt.sv(f, "path")))) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "patient"), rt.index(rt.sv(f, "path"), rt.len(f, rt.sv(f, "path")))])), 2))) {
			rt.setSv(f, "path", rt.list());
			rt.setSv(f, "mode", 0);
			rt.setSv(f, "last_found", rt.worldTime(f));
		} else {
			if ((truthy(rt.sv(f, "stationary_mode")) && truthy(rt.sv(f, "patient")))) {
				yield* g.srcCall(f, "soft_reset");
				return live(f.dot);
			}
		}
	}
	if (((truthy(rt.sv(f, "patient")) && isEqual(rt.len(f, rt.sv(f, "path")), 0)) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "patient")])), 1))) {
		rt.setSv(f, "path", (yield* g.call(f, P("/proc/get_path_to"), null, [null, live(f.src), null, rt.getStep(f, rt.sv(f, "patient"), 0), null, P("/turf/proc/Distance_cardinal"), null, 0, null, 30, "id", rt.sv(f, "access_card")], rt.Args.Named)));
		rt.setSv(f, "mode", 9);
		if (!truthy(rt.len(f, rt.sv(f, "path")))) {
			rt.setSv(f, "path", (yield* g.call(f, P("/proc/get_path_to"), null, [null, live(f.src), null, rt.getStep(f, rt.sv(f, "patient"), 0), null, P("/turf/proc/Distance_cardinal"), null, 0, null, 30, null, 1, "id", rt.sv(f, "access_card")], rt.Args.Named)));
			if (!truthy(rt.len(f, rt.sv(f, "path")))) {
				yield* g.srcCall(f, "soft_reset");
			}
		}
	}
	if ((rt.gt(rt.len(f, rt.sv(f, "path")), 0) && truthy(rt.sv(f, "patient")))) {
		if (!truthy((yield* g.srcCall(f, "bot_move", rt.index(rt.sv(f, "path"), rt.len(f, rt.sv(f, "path"))))))) {
			rt.setSv(f, "oldpatient", rt.sv(f, "patient"));
			yield* g.srcCall(f, "soft_reset");
		}
		return live(f.dot);
	}
	if ((rt.gt(rt.len(f, rt.sv(f, "path")), 8) && truthy(rt.sv(f, "patient")))) {
		rt.incSrcVar(f, "frustration", 1, true);
	}
	if (((truthy(rt.sv(f, "auto_patrol")) && !truthy(rt.sv(f, "stationary_mode"))) && !truthy(rt.sv(f, "patient")))) {
		if ((isEqual(rt.sv(f, "mode"), 0) || isEqual(rt.sv(f, "mode"), 4))) {
			yield* g.srcCall(f, "start_patrol");
		}
		if (isEqual(rt.sv(f, "mode"), 5)) {
			yield* g.srcCall(f, "bot_patrol");
		}
	}
	return live(f.dot);
}, true, { waitfor: false });

// /mob/living/simple_animal/bot/medbot/proc/assess_patient  (code/modules/mob/living/simple_animal/bot/medbot.dm:343)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/proc/assess_patient", function* assess_patient(f: Frame, C: Value) {
	let R: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [C, R, D, $e];
	if ((isEqual(rt.fv(f, "stat", live(C)), 2) || truthy(rt.bitAnd(rt.fv(f, "status_flags", live(C)), 8192)))) {
		return 0;
	}
	if (truthy(rt.fv(f, "suiciding", live(C)))) {
		return 0;
	}
	if (isEqual(rt.sv(f, "emagged"), 2)) {
		return 1;
	}
	if ((truthy(rt.sv(f, "declare_crit")) && rt.le(rt.fv(f, "health", live(C)), 0))) {
		yield* g.srcCall(f, "declare", live(C));
	}
	if (((truthy(rt.sv(f, "reagent_glass")) && truthy(rt.sv(f, "use_beaker"))) && (((rt.ge((yield* g.callName(f, live(C), "getBruteLoss", [])), rt.sv(f, "heal_threshold")) || rt.ge((yield* g.callName(f, live(C), "getToxLoss", [])), rt.sv(f, "heal_threshold"))) || rt.ge((yield* g.callName(f, live(C), "getToxLoss", [])), rt.sv(f, "heal_threshold"))) || rt.ge((yield* g.callName(f, live(C), "getOxyLoss", [])), add(rt.sv(f, "heal_threshold"), 15))))) {
		R = null;
		rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "reagent_glass"))), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			if (!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.fv(f, "id", live(R))])))) {
				return 1;
			}
		}
		rt.endFor(f, 0);
	}
	if (((!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_brute_avoid")]))) && rt.ge((yield* g.callName(f, live(C), "getBruteLoss", [])), rt.sv(f, "heal_threshold"))) && !truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_brute")]))))) {
		return 1;
	}
	if (((!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_oxy_avoid")]))) && rt.ge((yield* g.callName(f, live(C), "getOxyLoss", [])), add(15, rt.sv(f, "heal_threshold")))) && !truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_oxy")]))))) {
		return 1;
	}
	if (((!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_fire_avoid")]))) && rt.ge((yield* g.callName(f, live(C), "getFireLoss", [])), rt.sv(f, "heal_threshold"))) && !truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_fire")]))))) {
		return 1;
	}
	if (((!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_tox_avoid")]))) && rt.ge((yield* g.callName(f, live(C), "getToxLoss", [])), rt.sv(f, "heal_threshold"))) && !truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_tox")]))))) {
		return 1;
	}
	if (((truthy(rt.sv(f, "treat_virus")) && !truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_virus_avoid")])))) && !truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_virus")]))))) {
		D = null;
		rt.forList(f, 0, rt.fv(f, "viruses", live(C)), T("/datum/disease"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			if (((!(truthy(rt.bitAnd(rt.fv(f, "visibility_flags", live(D)), 1)) || truthy(rt.bitAnd(rt.fv(f, "visibility_flags", live(D)), 2))) && !isEqual(rt.fv(f, "severity", live(D)), "No threat")) && (rt.gt(rt.fv(f, "stage", live(D)), 1) || truthy(rt.bitAnd(rt.fv(f, "spread_flags", live(D)), 64))))) {
				return 1;
			}
		}
		rt.endFor(f, 0);
	}
	return 0;
}, true);

// /mob/living/simple_animal/bot/medbot/proc/UnarmedAttack  (code/modules/mob/living/simple_animal/bot/medbot.dm:385)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/proc/UnarmedAttack", function* UnarmedAttack(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		rt.setSv(f, "patient", (C = live(f.args[0])));
		rt.setSv(f, "mode", 10);
		yield* g.srcCall(f, "update_icon");
		yield* g.srcCall(f, "medicate_patient", live(C));
		yield* g.srcCall(f, "update_icon");
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["A"] });

// /mob/living/simple_animal/bot/medbot/examinate  (code/modules/mob/living/simple_animal/bot/medbot.dm:396)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/examinate", function* examinate(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.call(f, P("/proc/is_blind"), null, [live(f.src)])))) return f.dot;
	yield* g.call(f, P("/proc/chemscan"), null, [live(f.src), live(f.args[0])]);
	return f.dot;
}, true, { args: ["A"], verb: { name: "Examine", category: "IC" }, argTypes: [{ type: 28, path: "/atom", source: "view" }] });

// /mob/living/simple_animal/bot/medbot/proc/medicate_patient  (code/modules/mob/living/simple_animal/bot/medbot.dm:401)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/proc/medicate_patient", function* medicate_patient(f: Frame, C: Value) {
	let messagevoice: Value = null, message: Value = null, reagent_id: Value = null, virus: Value = null, D: Value = null, R: Value = null, messagevoice_1: Value = null, message_2: Value = null, failed: Value = null, fraction: Value = null;
	let $e: any;
	f.vars = () => [C, messagevoice, message, reagent_id, virus, D, R, messagevoice_1, message_2, failed, fraction, $e];
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(C), T("/mob/living/carbon")) ? 1 : 0))) {
		rt.setSv(f, "oldpatient", rt.sv(f, "patient"));
		yield* g.srcCall(f, "soft_reset");
		return live(f.dot);
	}
	if ((isEqual(rt.fv(f, "stat", live(C)), 2) || truthy(rt.bitAnd(rt.fv(f, "status_flags", live(C)), 8192)))) {
		messagevoice = rt.alist(f, ["No! Stay with me!", rt.rsc("sound/voice/mno.ogg"), "Live, damnit! LIVE!", rt.rsc("sound/voice/mlive.ogg"), "I...I've never lost a patient before. Not today, I mean.", rt.rsc("sound/voice/mlost.ogg")]);
		yield* g.srcCall(f, "speak", (message = rt.op(f, "PickUnweighted", [1], [live(messagevoice)])));
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.index(live(messagevoice), live(message)), 50, 0]);
		rt.setSv(f, "oldpatient", rt.sv(f, "patient"));
		yield* g.srcCall(f, "soft_reset");
		return live(f.dot);
	}
	reagent_id = null;
	if (isEqual(rt.sv(f, "emagged"), 2)) {
		reagent_id = "toxin";
	} else {
		if (truthy(rt.sv(f, "treat_virus"))) {
			virus = 0;
			D = null;
			rt.forList(f, 0, rt.fv(f, "viruses", live(C)), T("/datum/disease"));
			while (($e = rt.next(f, 0)) !== undefined) {
				D = $e;
				if ((!truthy(rt.bitAnd(rt.fv(f, "visibility_flags", live(D)), 1)) || !truthy(rt.bitAnd(rt.fv(f, "visibility_flags", live(D)), 2)))) {
					if (!isEqual(rt.fv(f, "severity", live(D)), "No threat")) {
						if ((rt.gt(rt.fv(f, "stage", live(D)), 1) || truthy(rt.bitAnd(rt.fv(f, "spread_flags", live(D)), 64)))) {
							virus = 1;
						}
					}
				}
			}
			rt.endFor(f, 0);
			if ((!truthy(live(reagent_id)) && truthy(live(virus)))) {
				if ((!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_virus")]))) && !truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_virus_avoid")]))))) {
					reagent_id = rt.sv(f, "treatment_virus");
				}
			}
		}
		if ((!truthy(live(reagent_id)) && rt.ge((yield* g.callName(f, live(C), "getBruteLoss", [])), rt.sv(f, "heal_threshold")))) {
			if ((!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_brute")]))) && !truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_brute_avoid")]))))) {
				reagent_id = rt.sv(f, "treatment_brute");
			}
		}
		if ((!truthy(live(reagent_id)) && rt.ge((yield* g.callName(f, live(C), "getOxyLoss", [])), add(15, rt.sv(f, "heal_threshold"))))) {
			if ((!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_oxy")]))) && !truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_oxy_avoid")]))))) {
				reagent_id = rt.sv(f, "treatment_oxy");
			}
		}
		if ((!truthy(live(reagent_id)) && rt.ge((yield* g.callName(f, live(C), "getFireLoss", [])), rt.sv(f, "heal_threshold")))) {
			if ((!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_fire")]))) && !truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_fire_avoid")]))))) {
				reagent_id = rt.sv(f, "treatment_fire");
			}
		}
		if ((!truthy(live(reagent_id)) && rt.ge((yield* g.callName(f, live(C), "getToxLoss", [])), rt.sv(f, "heal_threshold")))) {
			if ((!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_tox")]))) && !truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.sv(f, "treatment_tox_avoid")]))))) {
				reagent_id = rt.sv(f, "treatment_tox");
			}
		}
		if ((((truthy(live(reagent_id)) && truthy(rt.sv(f, "use_beaker"))) && truthy(rt.sv(f, "reagent_glass"))) && truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "reagent_glass")))))) {
			R = null;
			rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "reagent_glass"))), T("/datum/reagent"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				if (!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "has_reagent", [rt.fv(f, "id", live(R))])))) {
					reagent_id = "internal_beaker";
					break;
				}
			}
			rt.endFor(f, 0);
		}
	}
	if (!truthy(live(reagent_id))) {
		messagevoice_1 = rt.alist(f, ["All patched up!", rt.rsc("sound/voice/mpatchedup.ogg"), "An apple a day keeps me away.", rt.rsc("sound/voice/mapple.ogg"), "Feel better soon!", rt.rsc("sound/voice/mfeelbetter.ogg")]);
		yield* g.srcCall(f, "speak", (message_2 = rt.op(f, "PickUnweighted", [1], [live(messagevoice_1)])));
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.index(live(messagevoice_1), live(message_2)), 50, 0]);
		yield* g.srcCall(f, "bot_reset");
		return live(f.dot);
	} else {
		if ((!truthy(rt.sv(f, "emagged")) && truthy((yield* g.srcCall(f, "check_overdose", rt.sv(f, "patient"), live(reagent_id), rt.sv(f, "injection_amount")))))) {
			yield* g.srcCall(f, "soft_reset");
			return live(f.dot);
		}
		yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ is trying to inject ＀!</span>", [live(f.src), rt.sv(f, "patient")]), fmt("<span class='userdanger'>＀ is trying to inject you!</span>", [live(f.src)])]);
		failed = 0;
		if (truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.src), rt.sv(f, "patient"), 30])))) {
			if (((rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "patient")])), 1) && truthy(rt.sv(f, "on"))) && truthy((yield* g.srcCall(f, "assess_patient", rt.sv(f, "patient")))))) {
				if (isEqual(live(reagent_id), "internal_beaker")) {
					if (((truthy(rt.sv(f, "use_beaker")) && truthy(rt.sv(f, "reagent_glass"))) && truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "reagent_glass")))))) {
						fraction = (yield* g.call(f, P("/proc/min"), null, [divide(rt.sv(f, "injection_amount"), rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "reagent_glass")))), 1]));
						yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "reagent_glass")), "reaction", [rt.sv(f, "patient"), 5, live(fraction)]);
						yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "reagent_glass")), "trans_to", [rt.sv(f, "patient"), rt.sv(f, "injection_amount")]);
					}
				} else {
					yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "patient")), "add_reagent", [live(reagent_id), rt.sv(f, "injection_amount")]);
				}
				yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ injects ＀ with its syringe!</span>", [live(f.src), rt.sv(f, "patient")]), fmt("<span class='userdanger'>＀ injects you with its syringe!</span>", [live(f.src)])]);
			} else {
				failed = 1;
			}
		} else {
			failed = 1;
		}
		if (truthy(live(failed))) {
			yield* g.srcCall(f, "visible_message", fmt("＀ retracts its syringe.", [live(f.src)]));
		}
		yield* g.srcCall(f, "update_icon");
		yield* g.srcCall(f, "soft_reset");
		return live(f.dot);
	}
	reagent_id = null;
	return live(f.dot);
}, true);

// /mob/living/simple_animal/bot/medbot/proc/check_overdose  (code/modules/mob/living/simple_animal/bot/medbot.dm:501)
rt.def("/mob/living/simple_animal/bot/medbot/proc/check_overdose", function check_overdose(f: Frame, patient: Value, reagent_id: Value, injection_amount: Value) {
	let R: Value = null, current_volume: Value = null;
	f.vars = () => [R, current_volume];
	if (!truthy(rt.gv(f, "overdose_threshold", (R = rt.index(rt.gl("chemical_reagents_list"), live(reagent_id)))))) {
		return 0;
	}
	if (rt.gt(add((current_volume = rt.callName(f, rt.fv(f, "reagents", live(patient)), "get_reagent_amount", [live(reagent_id)])), live(injection_amount)), rt.fv(f, "overdose_threshold", live(R)))) {
		return 1;
	}
	return 0;
});

// /mob/living/simple_animal/bot/medbot/proc/explode  (code/modules/mob/living/simple_animal/bot/medbot.dm:511)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/proc/explode", function* explode(f: Frame) {
	let Tsec: Value = null;
	f.vars = () => [Tsec];
	rt.setSv(f, "on", 0);
	yield* g.srcCall(f, "visible_message", fmt("<span class='boldannounce'>＀ blows apart!</span>", [live(f.src)]));
	yield* g.new_(f, T("/obj/item/weapon/storage/firstaid"), [(Tsec = rt.getStep(f, live(f.src), 0))]);
	yield* g.new_(f, T("/obj/item/device/assembly/prox_sensor"), [live(Tsec)]);
	yield* g.new_(f, T("/obj/item/device/healthanalyzer"), [live(Tsec)]);
	if (truthy(rt.sv(f, "reagent_glass"))) {
		rt.setFv(f, "loc", rt.sv(f, "reagent_glass"), live(Tsec));
		rt.setSv(f, "reagent_glass", null);
	}
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.new_(f, T("/obj/item/bodypart/l_arm/robot"), [live(Tsec)]);
	}
	if ((truthy(rt.sv(f, "emagged")) && truthy(rt.op(f, "Prob", [], [25])))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/voice/minsult.ogg"), 50, 0]);
	}
	yield* g.call(f, P("/proc/do_sparks"), null, [3, 1, live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/medbot/proc/declare  (code/modules/mob/living/simple_animal/bot/medbot.dm:534)  may sleep
rt.def("/mob/living/simple_animal/bot/medbot/proc/declare", function* declare(f: Frame, crit_patient: Value) {
	let location: Value = null;
	let $0: any;
	f.vars = () => [crit_patient, location, $0];
	if (rt.gt(rt.sv(f, "declare_cooldown"), rt.worldTime(f))) {
		return live(f.dot);
	}
	location = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	if (truthy(live(crit_patient))) {
		$0 = fmt("<b>＀</b>", [live(crit_patient)]);
	} else {
		$0 = "A patient";
	}
	yield* g.srcCall(f, "speak", fmt("Medical emergency! ＀ is in critical condition at ＀!", [$0, live(location)]), rt.sv(f, "radio_channel"));
	rt.setSv(f, "declare_cooldown", add(rt.worldTime(f), 200));
	return f.dot;
}, true);
