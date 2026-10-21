// From code/modules/surgery/organs/vocal_cords.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9532, "/obj/item/organ/vocal_cords", "/obj/item/organ", {
	spans: null,
	zone: "mouth",
	slot: "vocal_cords",
	name: "vocal cords",
	icon_state: "appendix",
	gender: "plural",
});

// /obj/item/organ/vocal_cords/proc/handle_speech  (code/modules/surgery/organs/vocal_cords.dm:21)  may sleep
rt.def("/obj/item/organ/vocal_cords/proc/handle_speech", function* handle_speech(f: Frame, message: Value) {
	f.vars = () => [message];
	yield* g.callName(f, rt.sv(f, "owner"), "say", [null, live(message), "spans", rt.sv(f, "spans"), "sanitize", 0], rt.Args.Named);
	return f.dot;
}, true);

rt.type(9533, "/obj/item/organ/vocal_cords/adamantine", "/obj/item/organ/vocal_cords", {
	zone: "mouth",
	slot: "vocal_cords",
	name: "adamantine vocal cords",
	desc: "When adamantine resonates, it causes all nearby pieces of adamantine to resonate as well. Adamantine golems use this to broadcast messages to nearby golems.",
	actions_types: null,
	icon_state: "adamantine_cords",
});

// /obj/item/organ/vocal_cords/adamantine/proc/<init>  (code/modules/surgery/organs/vocal_cords.dm:33)
rt.def("/obj/item/organ/vocal_cords/adamantine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/organ_action/use/adamantine_vocal_cords")));
	return f.dot;
});

rt.type(229, "/datum/action/item_action/organ_action/use/adamantine_vocal_cords", "/datum/action/item_action/organ_action/use", {});

// /datum/action/item_action/organ_action/use/adamantine_vocal_cords/proc/Trigger  (code/modules/surgery/organs/vocal_cords.dm:39)  may sleep
rt.def("/datum/action/item_action/organ_action/use/adamantine_vocal_cords/proc/Trigger", function* Trigger(f: Frame) {
	let message: Value = null;
	f.vars = () => [message];
	if (!truthy((yield* g.srcCall(f, "IsAvailable")))) {
		return live(f.dot);
	}
	message = (yield* g.op(f, "Prompt", [2], [null, "Resonate", "Resonate a message to all nearby golems.", rt.sv(f, "owner"), null]));
	if ((((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || (!truthy(rt.sv(f, "owner")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "owner"))))) || !truthy(live(message)))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "owner"), "say", [fmt(".x＀", [live(message)])]);
	return f.dot;
}, true);

// /obj/item/organ/vocal_cords/adamantine/proc/handle_speech  (code/modules/surgery/organs/vocal_cords.dm:47)
rt.def("/obj/item/organ/vocal_cords/adamantine/proc/handle_speech", function handle_speech(f: Frame, message: Value) {
	let msg: Value = null, m: Value = null, C: Value = null, link: Value = null;
	let $e: any;
	f.vars = () => [msg, m, C, link, $e];
	msg = fmt("<span class='resonate'><span class='name'>＀</span> <span class='message'>resonates, \"＀\"</span></span>", [rt.fv(f, "real_name", rt.sv(f, "owner")), live(message)]);
	m = null;
	rt.forList(f, 0, rt.gl("player_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		if (truthy((rt.istype(live(m), T("/mob/living/carbon")) ? 1 : 0))) {
			if (truthy(rt.callName(f, (C = live(m)), "getorganslot", ["adamantine_resonator"]))) {
				rt.call(f, P("/proc/to_chat"), null, [live(C), live(msg)]);
			}
		}
		if (truthy((rt.istype(live(m), T("/mob/dead/observer")) ? 1 : 0))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(m), rt.sv(f, "owner")]);
			rt.call(f, P("/proc/to_chat"), null, [live(m), fmt("＀ ＀", [live(link), live(msg)])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(9534, "/obj/item/organ/vocal_cords/colossus", "/obj/item/organ/vocal_cords", {
	next_command: 0,
	cooldown_mod: 1,
	base_multiplier: 1,
	zone: "mouth",
	slot: "vocal_cords",
	spans: null,
	name: "divine vocal cords",
	desc: "They carry the voice of an ancient god.",
	icon_state: "voice_of_god",
	actions_types: null,
});

// /obj/item/organ/vocal_cords/colossus/proc/<init>  (code/modules/surgery/organs/vocal_cords.dm:64)
rt.def("/obj/item/organ/vocal_cords/colossus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spans", rt.list("colossus", "yell"));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/organ_action/colossus")));
	return f.dot;
});

rt.type(231, "/datum/action/item_action/organ_action/colossus", "/datum/action/item_action/organ_action", {
	cords: null,
	name: "Voice of God",
});

// /datum/action/item_action/organ_action/colossus/proc/New  (code/modules/surgery/organs/vocal_cords.dm:75)  may sleep
rt.def("/datum/action/item_action/organ_action/colossus/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "cords", rt.sv(f, "target"));
	return f.dot;
}, true);

// /datum/action/item_action/organ_action/colossus/proc/IsAvailable  (code/modules/surgery/organs/vocal_cords.dm:79)
rt.def("/datum/action/item_action/organ_action/colossus/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (rt.lt(rt.worldTime(f), rt.fv(f, "next_command", rt.sv(f, "cords")))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "owner"))) {
		return 0;
	}
	if (!truthy(rt.callName(f, rt.sv(f, "owner"), "can_speak", []))) {
		return 0;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "check_flags"), 8))) {
		if (truthy(rt.fv(f, "stat", rt.sv(f, "owner")))) {
			return 0;
		}
	}
	return 1;
});

// /datum/action/item_action/organ_action/colossus/proc/Trigger  (code/modules/surgery/organs/vocal_cords.dm:91)  may sleep
rt.def("/datum/action/item_action/organ_action/colossus/proc/Trigger", function* Trigger(f: Frame) {
	let command: Value = null;
	f.vars = () => [command];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((yield* g.srcCall(f, "IsAvailable")))) {
		if (rt.lt(rt.worldTime(f), rt.fv(f, "next_command", rt.sv(f, "cords")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='notice'>You must wait ＀ seconds before Speaking again.</span>", [divide(subtract(rt.fv(f, "next_command", rt.sv(f, "cords")), rt.worldTime(f)), 10)])]);
		}
		return live(f.dot);
	}
	command = (yield* g.op(f, "Prompt", [2], [null, "Command", "Speak with the Voice of God", rt.sv(f, "owner"), null]));
	if (((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || (!truthy(rt.sv(f, "owner")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "owner")))))) {
		return live(f.dot);
	}
	if (!truthy(live(command))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "owner"), "say", [fmt(".x＀", [live(command)])]);
	return f.dot;
}, true);

// /obj/item/organ/vocal_cords/colossus/proc/can_speak_with  (code/modules/surgery/organs/vocal_cords.dm:104)
rt.def("/obj/item/organ/vocal_cords/colossus/proc/can_speak_with", function can_speak_with(f: Frame) {
	if (rt.lt(rt.worldTime(f), rt.sv(f, "next_command"))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='notice'>You must wait ＀ seconds before Speaking again.</span>", [divide(subtract(rt.sv(f, "next_command"), rt.worldTime(f)), 10)])]);
		return 0;
	}
	if (!truthy(rt.sv(f, "owner"))) {
		return 0;
	}
	if (!truthy(rt.callName(f, rt.sv(f, "owner"), "can_speak", []))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You are unable to speak!</span>"]);
		return 0;
	}
	return 1;
});

// /obj/item/organ/vocal_cords/colossus/proc/handle_speech  (code/modules/surgery/organs/vocal_cords.dm:115)  may sleep
rt.def("/obj/item/organ/vocal_cords/colossus/proc/handle_speech", function* handle_speech(f: Frame, message: Value) {
	f.vars = () => [message];
	yield* g.callName(f, rt.sv(f, "owner"), "say", [null, (yield* g.call(f, P("/proc/uppertext"), null, [live(message)])), "spans", rt.sv(f, "spans"), "sanitize", 0], rt.Args.Named);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, rt.sv(f, "owner"), 0), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 300, 1, 5]);
	return live(f.dot);
}, true);

// /obj/item/organ/vocal_cords/colossus/proc/speak_with  (code/modules/surgery/organs/vocal_cords.dm:120)  may sleep
rt.def("/obj/item/organ/vocal_cords/colossus/proc/speak_with", function* speak_with(f: Frame, message: Value) {
	let cooldown: Value = null;
	f.vars = () => [message, cooldown];
	cooldown = (yield* g.call(f, P("/proc/voice_of_god"), null, [live(message), rt.sv(f, "owner"), rt.sv(f, "spans"), rt.sv(f, "base_multiplier")]));
	rt.setSv(f, "next_command", add(rt.worldTime(f), multiply(live(cooldown), rt.sv(f, "cooldown_mod"))));
	return f.dot;
}, true);

// /proc/voice_of_god  (code/modules/surgery/organs/vocal_cords.dm:130)  may sleep
rt.def("/proc/voice_of_god", function* voice_of_god(f: Frame, message: Value, user: Value, span_list: Value, base_multiplier: Value) {
	let cooldown: Value = null, log_message: Value = null, listeners: Value = null, L: Value = null, H: Value = null, power_multiplier: Value = null, specific_listeners: Value = null, found_string: Value = null, V: Value = null, L_7: Value = null, devilinfo: Value = null, start: Value = null, C: Value = null, H_6: Value = null, throwtarget: Value = null, S: Value = null, direction: Value = null, i: Value = null, V_8: Value = null, L_9: Value = null, chair: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [message, user, span_list, base_multiplier, cooldown, log_message, listeners, L, H, power_multiplier, specific_listeners, found_string, V, L_7, devilinfo, start, C, H_6, throwtarget, S, direction, i, V_8, L_9, chair, $0, $1, $e];
	if (live(base_multiplier) === null) {
		base_multiplier = 1;
	}
	cooldown = 0;
	if (((!truthy(live(user)) || !truthy((yield* g.callName(f, live(user), "can_speak", [])))) || truthy(rt.fv(f, "stat", live(user))))) {
		return 0;
	}
	log_message = (yield* g.call(f, P("/proc/uppertext"), null, [live(message)]));
	if ((!truthy(live(span_list)) || !truthy(rt.len(f, live(span_list))))) {
		if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) {
			span_list = rt.list("narsiesmall");
		} else {
			if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)])))) {
				span_list = rt.list("ratvar");
			} else {
				span_list = rt.list();
			}
		}
	}
	message = (yield* g.call(f, P("/proc/lowertext"), null, [live(message)]));
	listeners = rt.list();
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [8, live(user)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((((truthy((yield* g.callName(f, live(L), "can_hear", []))) && !truthy((yield* g.callName(f, live(L), "null_rod_check", [])))) && !isEqual(live(L), live(user))) && !isEqual(rt.fv(f, "stat", live(L)), 2))) {
			if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
				if (truthy((rt.istype(rt.gv(f, "ears", (H = live(L))), T("/obj/item/clothing/ears/earmuffs")) ? 1 : 0))) {
					continue;
				}
			}
			listeners = rt.modify(live(listeners), live(L), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(listeners)))) {
		return (cooldown = 100);
	}
	power_multiplier = live(base_multiplier);
	if (truthy(rt.fv(f, "mind", live(user)))) {
		if (isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(user))), "Chaplain")) {
			(power_multiplier = rt.modify(live(power_multiplier), 2, multiply));
		}
		if (truthy((rt.isIn(f, rt.gv(f, "assigned_role", rt.fv(f, "mind", live(user))), rt.gl("command_positions")) ? 1 : 0))) {
			(power_multiplier = rt.modify(live(power_multiplier), 1.399999976158142, multiply));
		}
		if (isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(user))), "Mime")) {
			(power_multiplier = rt.modify(live(power_multiplier), 0.5, multiply));
		}
	}
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) {
		(power_multiplier = rt.modify(live(power_multiplier), 2, multiply));
	} else {
		if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)])))) {
			(power_multiplier = rt.modify(live(power_multiplier), 2, multiply));
		}
	}
	specific_listeners = rt.list();
	found_string = null;
	message = (yield* g.call(f, P("/proc/get_full_job_name"), null, [live(message)]));
	V = null;
	rt.forList(f, 0, live(listeners));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		L_7 = live(V);
		if ((truthy((devilinfo = (yield* g.call(f, P("/proc/is_devil"), null, [live(L_7)])))) && truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.fv(f, "truename", live(devilinfo))]))))) {
			start = (yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.fv(f, "truename", live(devilinfo))]));
			listeners = rt.list(live(L_7));
			(power_multiplier = rt.modify(live(power_multiplier), 5, multiply));
			message = add((yield* g.call(f, P("/proc/copytext"), null, [live(message), 0, live(start)])), (yield* g.call(f, P("/proc/copytext"), null, [live(message), add(live(start), rt.length(rt.fv(f, "truename", live(devilinfo)))), add(rt.length(live(message)), 1)])));
			break;
		} else {
			if (truthy((yield* g.call(f, P("/proc/dd_hasprefix"), null, [live(message), rt.fv(f, "real_name", live(L_7))])))) {
				specific_listeners = rt.modify(live(specific_listeners), live(L_7), add);
				found_string = rt.fv(f, "real_name", live(L_7));
			} else {
				if (truthy((yield* g.call(f, P("/proc/dd_hasprefix"), null, [live(message), (yield* g.callName(f, live(L_7), "first_name", []))])))) {
					specific_listeners = rt.modify(live(specific_listeners), live(L_7), add);
					found_string = (yield* g.callName(f, live(L_7), "first_name", []));
				} else {
					if ((truthy(rt.fv(f, "mind", live(L_7))) && truthy((yield* g.call(f, P("/proc/dd_hasprefix"), null, [live(message), rt.gv(f, "assigned_role", rt.fv(f, "mind", live(L_7)))]))))) {
						specific_listeners = rt.modify(live(specific_listeners), live(L_7), add);
						found_string = rt.gv(f, "assigned_role", rt.fv(f, "mind", live(L_7)));
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(specific_listeners)))) {
		listeners = live(specific_listeners);
		(power_multiplier = rt.modify(live(power_multiplier), add(1, divide(1, rt.len(f, live(specific_listeners)))), multiply));
		message = add((yield* g.call(f, P("/proc/copytext"), null, [live(message), 0, 1])), (yield* g.call(f, P("/proc/copytext"), null, [live(message), add(1, rt.length(live(found_string))), add(rt.length(live(message)), 1)])));
	}
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("stun_words")])))) {
		cooldown = 1200;
		V = null;
		rt.forList(f, 0, live(listeners));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			yield* g.callName(f, (L_7 = live(V)), "Stun", [multiply(60, live(power_multiplier))]);
		}
		rt.endFor(f, 0);
	} else {
		if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("knockdown_words")])))) {
			cooldown = 1200;
			V = null;
			rt.forList(f, 0, live(listeners));
			while (($e = rt.next(f, 0)) !== undefined) {
				V = $e;
				yield* g.callName(f, (L_7 = live(V)), "Knockdown", [multiply(60, live(power_multiplier))]);
			}
			rt.endFor(f, 0);
		} else {
			if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("sleep_words")])))) {
				cooldown = 1200;
				C = null;
				rt.forList(f, 0, live(listeners), T("/mob/living/carbon"));
				while (($e = rt.next(f, 0)) !== undefined) {
					C = $e;
					yield* g.callName(f, live(C), "Sleeping", [multiply(40, live(power_multiplier))]);
				}
				rt.endFor(f, 0);
			} else {
				if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("vomit_words")])))) {
					cooldown = 1200;
					C = null;
					rt.forList(f, 0, live(listeners), T("/mob/living/carbon"));
					while (($e = rt.next(f, 0)) !== undefined) {
						C = $e;
						yield* g.callName(f, live(C), "vomit", [null, multiply(10, live(power_multiplier)), "distance", live(power_multiplier)], rt.Args.Named);
					}
					rt.endFor(f, 0);
				} else {
					if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("silence_words")])))) {
						cooldown = 1200;
						C = null;
						rt.forList(f, 0, live(listeners), T("/mob/living/carbon"));
						while (($e = rt.next(f, 0)) !== undefined) {
							C = $e;
							if ((truthy(rt.fv(f, "mind", live(user))) && (isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(user))), "Curator") || isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(user))), "Mime")))) {
								(power_multiplier = rt.modify(live(power_multiplier), 3, multiply));
							}
							rt.modField(f, live(C), "silent", multiply(10, live(power_multiplier)), add);
						}
						rt.endFor(f, 0);
					} else {
						if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("hallucinate_words")])))) {
							cooldown = 300;
							V = null;
							rt.forList(f, 0, live(listeners));
							while (($e = rt.next(f, 0)) !== undefined) {
								V = $e;
								yield* g.new_(f, T("/obj/effect/hallucination/delusion"), [rt.getStep(f, (L_7 = live(V)), 0), live(L_7), null, multiply(150, live(power_multiplier)), 0]);
							}
							rt.endFor(f, 0);
						} else {
							if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("wakeup_words")])))) {
								cooldown = 600;
								V = null;
								rt.forList(f, 0, live(listeners));
								while (($e = rt.next(f, 0)) !== undefined) {
									V = $e;
									yield* g.callName(f, (L_7 = live(V)), "SetSleeping", [0]);
								}
								rt.endFor(f, 0);
							} else {
								if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("heal_words")])))) {
									cooldown = 600;
									V = null;
									rt.forList(f, 0, live(listeners));
									while (($e = rt.next(f, 0)) !== undefined) {
										V = $e;
										yield* g.callName(f, (L_7 = live(V)), "heal_overall_damage", [multiply(10, live(power_multiplier)), multiply(10, live(power_multiplier)), 0, 0]);
									}
									rt.endFor(f, 0);
								} else {
									if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("hurt_words")])))) {
										cooldown = 600;
										V = null;
										rt.forList(f, 0, live(listeners));
										while (($e = rt.next(f, 0)) !== undefined) {
											V = $e;
											yield* g.callName(f, (L_7 = live(V)), "apply_damage", [null, multiply(15, live(power_multiplier)), "def_zone", "chest"], rt.Args.Named);
										}
										rt.endFor(f, 0);
									} else {
										if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("bleed_words")])))) {
											cooldown = 600;
											H_6 = null;
											rt.forList(f, 0, live(listeners), T("/mob/living/carbon/human"));
											while (($e = rt.next(f, 0)) !== undefined) {
												H_6 = $e;
												rt.modField(f, live(H_6), "bleed_rate", multiply(5, live(power_multiplier)), add);
											}
											rt.endFor(f, 0);
										} else {
											if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("burn_words")])))) {
												cooldown = 600;
												V = null;
												rt.forList(f, 0, live(listeners));
												while (($e = rt.next(f, 0)) !== undefined) {
													V = $e;
													yield* g.callName(f, (L_7 = live(V)), "adjust_fire_stacks", [multiply(1, live(power_multiplier))]);
													yield* g.callName(f, live(L_7), "IgniteMob", []);
												}
												rt.endFor(f, 0);
											} else {
												if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("hot_words")])))) {
													cooldown = 600;
													V = null;
													rt.forList(f, 0, live(listeners));
													while (($e = rt.next(f, 0)) !== undefined) {
														V = $e;
														rt.modField(f, (L_7 = live(V)), "bodytemperature", multiply(50, live(power_multiplier)), add);
													}
													rt.endFor(f, 0);
												} else {
													if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("cold_words")])))) {
														cooldown = 600;
														V = null;
														rt.forList(f, 0, live(listeners));
														while (($e = rt.next(f, 0)) !== undefined) {
															V = $e;
															(rt.modField(f, (L_7 = live(V)), "bodytemperature", multiply(50, live(power_multiplier)), subtract));
														}
														rt.endFor(f, 0);
													} else {
														if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("repulse_words")])))) {
															cooldown = 600;
															V = null;
															rt.forList(f, 0, live(listeners));
															while (($e = rt.next(f, 0)) !== undefined) {
																V = $e;
																L_7 = live(V);
																throwtarget = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(user), rt.getDir(f, live(user), (yield* g.call(f, P("/proc/get_step_away"), null, [live(L_7), live(user)])))]));
																yield* g.callName(f, live(L_7), "throw_at", [live(throwtarget), multiply(3, live(power_multiplier)), multiply(1, live(power_multiplier))]);
															}
															rt.endFor(f, 0);
														} else {
															if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("attract_words")])))) {
																cooldown = 600;
																V = null;
																rt.forList(f, 0, live(listeners));
																while (($e = rt.next(f, 0)) !== undefined) {
																	V = $e;
																	yield* g.callName(f, (L_7 = live(V)), "throw_at", [(yield* g.call(f, P("/proc/get_step_towards"), null, [live(user), live(L_7)])), multiply(3, live(power_multiplier)), multiply(1, live(power_multiplier))]);
																}
																rt.endFor(f, 0);
															} else {
																if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("whoareyou_words")])))) {
																	cooldown = 300;
																	V = null;
																	rt.forList(f, 0, live(listeners));
																	while (($e = rt.next(f, 0)) !== undefined) {
																		V = $e;
																		if (truthy((yield* g.call(f, P("/proc/is_devil"), null, [(L_7 = live(V))])))) {
																			devilinfo = (yield* g.call(f, P("/proc/is_devil"), null, [live(L_7)]));
																			yield* g.callName(f, live(L_7), "say", [fmt("＀", [rt.fv(f, "truename", live(devilinfo))])]);
																		} else {
																			yield* g.callName(f, live(L_7), "say", [fmt("＀", [rt.fv(f, "real_name", live(L_7))])]);
																		}
																		yield* g.call(f, P("/proc/sleep"), null, [5]);
																	}
																	rt.endFor(f, 0);
																} else {
																	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("saymyname_words")])))) {
																		cooldown = 300;
																		V = null;
																		rt.forList(f, 0, live(listeners));
																		while (($e = rt.next(f, 0)) !== undefined) {
																			V = $e;
																			yield* g.callName(f, (L_7 = live(V)), "say", [fmt("＀!", [rt.fv(f, "name", live(user))])]);
																			yield* g.call(f, P("/proc/sleep"), null, [5]);
																		}
																		rt.endFor(f, 0);
																	} else {
																		if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("knockknock_words")])))) {
																			cooldown = 300;
																			V = null;
																			rt.forList(f, 0, live(listeners));
																			while (($e = rt.next(f, 0)) !== undefined) {
																				V = $e;
																				yield* g.callName(f, (L_7 = live(V)), "say", ["Who's there?"]);
																				yield* g.call(f, P("/proc/sleep"), null, [5]);
																			}
																			rt.endFor(f, 0);
																		} else {
																			if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("statelaws_words")])))) {
																				cooldown = 1200;
																				S = null;
																				rt.forList(f, 0, live(listeners), T("/mob/living/silicon"));
																				while (($e = rt.next(f, 0)) !== undefined) {
																					S = $e;
																					yield* g.callName(f, live(S), "statelaws", ["force", 1], rt.Args.Named);
																				}
																				rt.endFor(f, 0);
																			} else {
																				if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("move_words")])))) {
																					cooldown = 300;
																					direction = null;
																					if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("up_words")])))) {
																						direction = 1;
																					} else {
																						if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("down_words")])))) {
																							direction = 2;
																						} else {
																							if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("left_words")])))) {
																								direction = 8;
																							} else {
																								if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("right_words")])))) {
																									direction = 4;
																								}
																							}
																						}
																					}
																					i = null;
																					i = 1;
																					while (rt.le(live(i), multiply(5, live(power_multiplier)))) {
																						V_8 = null;
																						rt.forList(f, 0, live(listeners));
																						while (($e = rt.next(f, 0)) !== undefined) {
																							V_8 = $e;
																							$0 = (L_9 = live(V_8));
																							if (truthy(live(direction))) {
																								$0 = $0;
																								$1 = live(direction);
																							} else {
																								$1 = rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]);
																							}
																							yield* g.call(f, P("/proc/step"), null, [$0, $1]);
																						}
																						rt.endFor(f, 0);
																						yield* g.call(f, P("/proc/sleep"), null, [10]);
																						i = rt.inc(live(i), 1);
																					}
																				} else {
																					if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("walk_words")])))) {
																						cooldown = 300;
																						V = null;
																						rt.forList(f, 0, live(listeners));
																						while (($e = rt.next(f, 0)) !== undefined) {
																							V = $e;
																							if (!isEqual(rt.gv(f, "m_intent", (L_7 = live(V))), "walk")) {
																								yield* g.callName(f, live(L_7), "toggle_move_intent", []);
																							}
																						}
																						rt.endFor(f, 0);
																					} else {
																						if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("run_words")])))) {
																							cooldown = 300;
																							V = null;
																							rt.forList(f, 0, live(listeners));
																							while (($e = rt.next(f, 0)) !== undefined) {
																								V = $e;
																								if (!isEqual(rt.gv(f, "m_intent", (L_7 = live(V))), "run")) {
																									yield* g.callName(f, live(L_7), "toggle_move_intent", []);
																								}
																							}
																							rt.endFor(f, 0);
																						} else {
																							if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("helpintent_words")])))) {
																								cooldown = 300;
																								H_6 = null;
																								rt.forList(f, 0, live(listeners), T("/mob/living/carbon/human"));
																								while (($e = rt.next(f, 0)) !== undefined) {
																									H_6 = $e;
																									yield* g.callName(f, live(H_6), "a_intent_change", ["help"]);
																									yield* g.callName(f, live(H_6), "click_random_mob", []);
																									yield* g.call(f, P("/proc/sleep"), null, [2]);
																								}
																								rt.endFor(f, 0);
																							} else {
																								if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("disarmintent_words")])))) {
																									cooldown = 300;
																									H_6 = null;
																									rt.forList(f, 0, live(listeners), T("/mob/living/carbon/human"));
																									while (($e = rt.next(f, 0)) !== undefined) {
																										H_6 = $e;
																										yield* g.callName(f, live(H_6), "a_intent_change", ["disarm"]);
																										yield* g.callName(f, live(H_6), "click_random_mob", []);
																										yield* g.call(f, P("/proc/sleep"), null, [2]);
																									}
																									rt.endFor(f, 0);
																								} else {
																									if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("grabintent_words")])))) {
																										cooldown = 300;
																										H_6 = null;
																										rt.forList(f, 0, live(listeners), T("/mob/living/carbon/human"));
																										while (($e = rt.next(f, 0)) !== undefined) {
																											H_6 = $e;
																											yield* g.callName(f, live(H_6), "a_intent_change", ["grab"]);
																											yield* g.callName(f, live(H_6), "click_random_mob", []);
																											yield* g.call(f, P("/proc/sleep"), null, [2]);
																										}
																										rt.endFor(f, 0);
																									} else {
																										if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("harmintent_words")])))) {
																											cooldown = 300;
																											H_6 = null;
																											rt.forList(f, 0, live(listeners), T("/mob/living/carbon/human"));
																											while (($e = rt.next(f, 0)) !== undefined) {
																												H_6 = $e;
																												yield* g.callName(f, live(H_6), "a_intent_change", ["harm"]);
																												yield* g.callName(f, live(H_6), "click_random_mob", []);
																												yield* g.call(f, P("/proc/sleep"), null, [2]);
																											}
																											rt.endFor(f, 0);
																										} else {
																											if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("throwmode_words")])))) {
																												cooldown = 300;
																												C = null;
																												rt.forList(f, 0, live(listeners), T("/mob/living/carbon"));
																												while (($e = rt.next(f, 0)) !== undefined) {
																													C = $e;
																													yield* g.callName(f, live(C), "throw_mode_on", []);
																												}
																												rt.endFor(f, 0);
																											} else {
																												if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("flip_words")])))) {
																													cooldown = 300;
																													V = null;
																													rt.forList(f, 0, live(listeners));
																													while (($e = rt.next(f, 0)) !== undefined) {
																														V = $e;
																														yield* g.callName(f, (L_7 = live(V)), "emote", ["flip"]);
																													}
																													rt.endFor(f, 0);
																												} else {
																													if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("speak_words")])))) {
																														cooldown = 300;
																														V = null;
																														rt.forList(f, 0, live(listeners));
																														while (($e = rt.next(f, 0)) !== undefined) {
																															V = $e;
																															yield* g.callName(f, (L_7 = live(V)), "say", [(yield* g.call(f, P("/proc/strings_replacement"), null, ["brain_damage_lines.json", "brain_damage"]))]);
																															yield* g.call(f, P("/proc/sleep"), null, [5]);
																														}
																														rt.endFor(f, 0);
																													} else {
																														if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("getup_words")])))) {
																															cooldown = 600;
																															V = null;
																															rt.forList(f, 0, live(listeners));
																															while (($e = rt.next(f, 0)) !== undefined) {
																																V = $e;
																																if (truthy(rt.gv(f, "resting", (L_7 = live(V))))) {
																																	yield* g.callName(f, live(L_7), "lay_down", []);
																																}
																																yield* g.callName(f, live(L_7), "SetStun", [0]);
																																yield* g.callName(f, live(L_7), "SetKnockdown", [0]);
																																yield* g.callName(f, live(L_7), "SetUnconscious", [0]);
																															}
																															rt.endFor(f, 0);
																														} else {
																															if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("sit_words")])))) {
																																cooldown = 300;
																																V = null;
																																rt.forList(f, 0, live(listeners));
																																while (($e = rt.next(f, 0)) !== undefined) {
																																	V = $e;
																																	L_7 = live(V);
																																	chair = null;
																																	rt.forList(f, 1, rt.getStep(f, live(L_7), 0), T("/obj/structure/chair"));
																																	if (($e = rt.next(f, 1)) !== undefined) {
																																		chair = $e;
																																		yield* g.callName(f, live(chair), "buckle_mob", [live(L_7)]);
																																	}
																																	rt.endFor(f, 1);
																																}
																																rt.endFor(f, 0);
																															} else {
																																if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("stand_words")])))) {
																																	cooldown = 300;
																																	V = null;
																																	rt.forList(f, 0, live(listeners));
																																	while (($e = rt.next(f, 0)) !== undefined) {
																																		V = $e;
																																		if ((truthy(rt.gv(f, "buckled", (L_7 = live(V)))) && truthy((rt.istype(rt.fv(f, "buckled", live(L_7)), T("/obj/structure/chair")) ? 1 : 0)))) {
																																			yield* g.callName(f, rt.fv(f, "buckled", live(L_7)), "unbuckle_mob", [live(L_7)]);
																																		}
																																	}
																																	rt.endFor(f, 0);
																																} else {
																																	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("dance_words")])))) {
																																		cooldown = 300;
																																		V = null;
																																		rt.forList(f, 0, live(listeners));
																																		while (($e = rt.next(f, 0)) !== undefined) {
																																			V = $e;
																																			yield* g.callName(f, (L_7 = live(V)), "emote", ["dance"]);
																																			yield* g.call(f, P("/proc/sleep"), null, [5]);
																																		}
																																		rt.endFor(f, 0);
																																	} else {
																																		if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("jump_words")])))) {
																																			cooldown = 300;
																																			V = null;
																																			rt.forList(f, 0, live(listeners));
																																			while (($e = rt.next(f, 0)) !== undefined) {
																																				V = $e;
																																				L_7 = live(V);
																																				if (truthy(rt.op(f, "Prob", [], [25]))) {
																																					yield* g.callName(f, live(L_7), "say", ["HOW HIGH?!!"]);
																																				}
																																				yield* g.callName(f, live(L_7), "emote", ["jump"]);
																																				yield* g.call(f, P("/proc/sleep"), null, [5]);
																																			}
																																			rt.endFor(f, 0);
																																		} else {
																																			if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("salute_words")])))) {
																																				cooldown = 300;
																																				V = null;
																																				rt.forList(f, 0, live(listeners));
																																				while (($e = rt.next(f, 0)) !== undefined) {
																																					V = $e;
																																					yield* g.callName(f, (L_7 = live(V)), "emote", ["salute"]);
																																					yield* g.call(f, P("/proc/sleep"), null, [5]);
																																				}
																																				rt.endFor(f, 0);
																																			} else {
																																				if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("deathgasp_words")])))) {
																																					cooldown = 300;
																																					V = null;
																																					rt.forList(f, 0, live(listeners));
																																					while (($e = rt.next(f, 0)) !== undefined) {
																																						V = $e;
																																						yield* g.callName(f, (L_7 = live(V)), "emote", ["deathgasp"]);
																																						yield* g.call(f, P("/proc/sleep"), null, [5]);
																																					}
																																					rt.endFor(f, 0);
																																				} else {
																																					if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("clap_words")])))) {
																																						cooldown = 300;
																																						V = null;
																																						rt.forList(f, 0, live(listeners));
																																						while (($e = rt.next(f, 0)) !== undefined) {
																																							V = $e;
																																							yield* g.callName(f, (L_7 = live(V)), "emote", ["clap"]);
																																							yield* g.call(f, P("/proc/sleep"), null, [5]);
																																						}
																																						rt.endFor(f, 0);
																																					} else {
																																						if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("honk_words")])))) {
																																							cooldown = 300;
																																							yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/playsound"), rt.getStep(f, live(user), 0), rt.rsc("sound/items/bikehorn.ogg"), 300, 1])), 25]);
																																							if ((truthy(rt.fv(f, "mind", live(user))) && isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(user))), "Clown"))) {
																																								C = null;
																																								rt.forList(f, 0, live(listeners), T("/mob/living/carbon"));
																																								while (($e = rt.next(f, 0)) !== undefined) {
																																									C = $e;
																																									yield* g.callName(f, live(C), "slip", [multiply(140, live(power_multiplier))]);
																																								}
																																								rt.endFor(f, 0);
																																								cooldown = 300;
																																							}
																																						} else {
																																							if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), rt.gl("multispin_words")])))) {
																																								cooldown = 300;
																																								V = null;
																																								rt.forList(f, 0, live(listeners));
																																								while (($e = rt.next(f, 0)) !== undefined) {
																																									V = $e;
																																									yield* g.callName(f, (L_7 = live(V)), "SpinAnimation", ["speed", 10, "loops", 5], rt.Args.Named);
																																								}
																																								rt.endFor(f, 0);
																																							} else {
																																								cooldown = 100;
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
								}
							}
						}
					}
				}
			}
		}
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has said '＀' with a Voice of God, affecting ＀, with a power multiplier of ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), live(log_message), (yield* g.call(f, P("/proc/english_list"), null, [live(listeners)])), live(power_multiplier)])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has said '＀' with a Voice of God, affecting ＀, with a power multiplier of ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(log_message), (yield* g.call(f, P("/proc/english_list"), null, [live(listeners)])), live(power_multiplier)])]);
	return live(cooldown);
}, true);
