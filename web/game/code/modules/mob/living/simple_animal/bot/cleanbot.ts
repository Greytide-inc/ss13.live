// From code/modules/mob/living/simple_animal/bot/cleanbot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5033, "/mob/living/simple_animal/bot/cleanbot", "/mob/living/simple_animal/bot", {
	blood: 1,
	trash: 0,
	pests: 0,
	target_types: null,
	target: null,
	max_targets: 50,
	oldloc: null,
	closest_dist: null,
	closest_loc: null,
	failed_steps: null,
	next_dest: null,
	next_dest_loc: null,
	anchored: 0,
	radio_channel: "Service",
	bot_type: 8,
	model: "Cleanbot",
	window_id: "autoclean",
	window_name: "Automatic Station Cleaner v1.2",
	pass_flags: 16,
	name: "１Cleanbot",
	desc: "A little cleaning robot, he looks so excited!",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "cleanbot0",
	density: 0,
	health: 25,
	maxHealth: 25,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_service"),
	bot_core_type: rt.typePath("/obj/machinery/bot_core/cleanbot"),
});

// /mob/living/simple_animal/bot/cleanbot/proc/Initialize  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:35)  may sleep
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/Initialize", function* Initialize(f: Frame) {
	let J: Value = null;
	f.vars = () => [J];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "get_targets");
	rt.setSv(f, "icon_state", fmt("cleanbot＀", [rt.sv(f, "on")]));
	J = (yield* g.new_(f, T("/datum/job/janitor"), []));
	rt.modField(f, rt.sv(f, "access_card"), "access", (yield* g.callName(f, live(J), "get_access", [])), add);
	rt.setSv(f, "prev_access", rt.fv(f, "access", rt.sv(f, "access_card")));
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/cleanbot/proc/turn_on  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:44)  may sleep
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/turn_on", function* turn_on(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("cleanbot＀", [rt.sv(f, "on")]));
	yield* g.callName(f, rt.sv(f, "bot_core"), "updateUsrDialog", []);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/cleanbot/proc/turn_off  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:49)  may sleep
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/turn_off", function* turn_off(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("cleanbot＀", [rt.sv(f, "on")]));
	yield* g.callName(f, rt.sv(f, "bot_core"), "updateUsrDialog", []);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/cleanbot/proc/bot_reset  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:54)
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/bot_reset", function bot_reset(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "ignore_list", rt.list());
	rt.setSv(f, "target", null);
	rt.setSv(f, "oldloc", null);
	return f.dot;
});

// /mob/living/simple_animal/bot/cleanbot/proc/set_custom_texts  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:60)
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/set_custom_texts", function set_custom_texts(f: Frame) {
	rt.setSv(f, "text_hack", fmt("You corrupt ＀'s cleaning software.", [rt.sv(f, "name")]));
	rt.setSv(f, "text_dehack", fmt("＀'s software has been reset!", [rt.sv(f, "name")]));
	rt.setSv(f, "text_dehack_fail", fmt("＀ does not seem to respond to your repair code!", [rt.sv(f, "name")]));
	return f.dot;
});

// /mob/living/simple_animal/bot/cleanbot/proc/attackby  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:65)  may sleep
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/device/pda")) ? 1 : 0)))) {
		if (((truthy((yield* g.callName(f, rt.sv(f, "bot_core"), "allowed", [live(f.args[1])]))) && !truthy(rt.sv(f, "open"))) && !truthy(rt.sv(f, "emagged")))) {
			rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "locked"))) {
				$1 = "lock";
			} else {
				$1 = "unlock";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ ％！ behaviour controls.</span>", [$1, live(f.src)])]);
		} else {
			if (truthy(rt.sv(f, "emagged"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>ERROR</span>"]);
			}
			if (truthy(rt.sv(f, "open"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Please close the access panel before locking it.</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＄！ doesn't seem to respect your authority.</span>", [live(f.src)])]);
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /mob/living/simple_animal/bot/cleanbot/proc/emag_act  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:80)  may sleep
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/emag_act", function* emag_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.sv(f, "emagged"), 2)) return f.dot;
	if (!truthy(live(f.args[0]))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='danger'>＀ buzzes and beeps.</span>", [live(f.src)])]);
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/simple_animal/bot/cleanbot/proc/process_scan  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:86)
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/process_scan", function process_scan(f: Frame, A: Value) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(A), T("/mob/living/carbon")) ? 1 : 0))) {
		if ((!isEqual(rt.gv(f, "stat", (C = live(A))), 2) && truthy(rt.fv(f, "lying", live(C))))) {
			return live(C);
		}
	} else {
		if (!truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(A), rt.sv(f, "target_types")]))) return f.dot;
		return live(A);
	}
	return f.dot;
});

// /mob/living/simple_animal/bot/cleanbot/proc/handle_automated_action  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:94)  may sleep
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let victim: Value = null;
	let $e: any;
	f.vars = () => [victim, $e];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "mode"), 7)) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "emagged"), 2)) {
		if (truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open")) ? 1 : 0))) {
			victim = null;
			rt.forList(f, 0, rt.sv(f, "loc"), T("/mob/living/carbon"));
			while (($e = rt.next(f, 0)) !== undefined) {
				victim = $e;
				if (!isEqual(live(victim), rt.sv(f, "target"))) {
					yield* g.srcCall(f, "UnarmedAttack", live(victim));
				}
			}
			rt.endFor(f, 0);
			if (truthy(rt.op(f, "Prob", [], [15]))) {
				yield* g.srcCall(f, "UnarmedAttack", live(f.src));
			}
		}
	} else {
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.srcCall(f, "audible_message", fmt("＀ makes an excited beeping booping sound!", [live(f.src)]));
		}
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "target")])))) {
		if (!truthy((rt.isIn(f, rt.sv(f, "target"), (yield* g.call(f, P("/proc/view"), null, [7, live(f.src)]))) ? 1 : 0))) {
			rt.setSv(f, "target", null);
		}
		if (!truthy((yield* g.srcCall(f, "process_scan", rt.sv(f, "target"))))) {
			rt.setSv(f, "target", null);
		}
	}
	if ((!truthy(rt.sv(f, "target")) && isEqual(rt.sv(f, "emagged"), 2))) {
		rt.setSv(f, "target", (yield* g.srcCall(f, "scan", T("/mob/living/carbon"))));
	}
	if ((!truthy(rt.sv(f, "target")) && truthy(rt.sv(f, "pests")))) {
		rt.setSv(f, "target", (yield* g.srcCall(f, "scan", T("/mob/living/simple_animal"))));
	}
	if (!truthy(rt.sv(f, "target"))) {
		rt.setSv(f, "target", (yield* g.srcCall(f, "scan", T("/obj/effect/decal/cleanable"))));
	}
	if ((!truthy(rt.sv(f, "target")) && truthy(rt.sv(f, "trash")))) {
		rt.setSv(f, "target", (yield* g.srcCall(f, "scan", T("/obj/item/trash"))));
	}
	if ((!truthy(rt.sv(f, "target")) && truthy(rt.sv(f, "auto_patrol")))) {
		if ((isEqual(rt.sv(f, "mode"), 0) || isEqual(rt.sv(f, "mode"), 4))) {
			yield* g.srcCall(f, "start_patrol");
		}
		if (isEqual(rt.sv(f, "mode"), 5)) {
			yield* g.srcCall(f, "bot_patrol");
		}
	}
	if (truthy(rt.sv(f, "target"))) {
		if (((!truthy(rt.sv(f, "target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "target")))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "target"))]))))) {
			rt.setSv(f, "target", null);
			rt.setSv(f, "mode", 0);
			return live(f.dot);
		}
		if ((!truthy(rt.sv(f, "path")) || isEqual(rt.len(f, rt.sv(f, "path")), 0))) {
			rt.setSv(f, "path", (yield* g.call(f, P("/proc/get_path_to"), null, [null, live(f.src), null, rt.fv(f, "loc", rt.sv(f, "target")), null, P("/turf/proc/Distance_cardinal"), null, 0, null, 30, "id", rt.sv(f, "access_card")], rt.Args.Named)));
			if (!truthy((yield* g.srcCall(f, "bot_move", rt.sv(f, "target"))))) {
				yield* g.srcCall(f, "add_to_ignore", rt.sv(f, "target"));
				rt.setSv(f, "target", null);
				rt.setSv(f, "path", rt.list());
				return live(f.dot);
			}
			rt.setSv(f, "mode", 9);
		} else {
			if (!truthy((yield* g.srcCall(f, "bot_move", rt.sv(f, "target"))))) {
				rt.setSv(f, "target", null);
				rt.setSv(f, "mode", 0);
				return live(f.dot);
			}
		}
	}
	if ((truthy(rt.sv(f, "target")) && isEqual(rt.sv(f, "loc"), rt.fv(f, "loc", rt.sv(f, "target"))))) {
		if (!(truthy((yield* g.srcCall(f, "check_bot", rt.sv(f, "target")))) && truthy(rt.op(f, "Prob", [], [50])))) {
			yield* g.srcCall(f, "UnarmedAttack", rt.sv(f, "target"));
		} else {
			rt.setSv(f, "shuffle", 1);
		}
		rt.setSv(f, "path", rt.list());
	}
	rt.setSv(f, "oldloc", rt.sv(f, "loc"));
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/bot/cleanbot/proc/get_targets  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:168)
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/get_targets", function get_targets(f: Frame) {
	rt.setSv(f, "target_types", rt.list(T("/obj/effect/decal/cleanable/oil"), T("/obj/effect/decal/cleanable/vomit"), T("/obj/effect/decal/cleanable/robot_debris"), T("/obj/effect/decal/cleanable/crayon"), T("/obj/effect/decal/cleanable/molten_object"), T("/obj/effect/decal/cleanable/tomato_smudge"), T("/obj/effect/decal/cleanable/egg_smudge"), T("/obj/effect/decal/cleanable/pie_smudge"), T("/obj/effect/decal/cleanable/flour"), T("/obj/effect/decal/cleanable/ash"), T("/obj/effect/decal/cleanable/greenglow"), T("/obj/effect/decal/cleanable/dirt"), T("/obj/effect/decal/cleanable/deadcockroach")));
	if (truthy(rt.sv(f, "blood"))) {
		rt.modSrcVar(f, "target_types", T("/obj/effect/decal/cleanable/xenoblood"), add);
		rt.modSrcVar(f, "target_types", T("/obj/effect/decal/cleanable/blood"), add);
		rt.modSrcVar(f, "target_types", T("/obj/effect/decal/cleanable/trail_holder"), add);
	}
	if (truthy(rt.sv(f, "pests"))) {
		rt.modSrcVar(f, "target_types", T("/mob/living/simple_animal/cockroach"), add);
		rt.modSrcVar(f, "target_types", T("/mob/living/simple_animal/mouse"), add);
	}
	if (truthy(rt.sv(f, "trash"))) {
		rt.modSrcVar(f, "target_types", T("/obj/item/trash"), add);
	}
	rt.setSv(f, "target_types", rt.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "target_types")]));
	return f.dot;
});

// /mob/living/simple_animal/bot/cleanbot/proc/UnarmedAttack  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:199)  may sleep
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/UnarmedAttack", function* UnarmedAttack(f: Frame) {
	let AM: Value = null, M: Value = null, victim: Value = null, phrase: Value = null, _T: Value = null;
	f.vars = () => [AM, M, victim, phrase, _T];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/effect/decal/cleanable")) ? 1 : 0))) {
		rt.setSv(f, "anchored", 1);
		rt.setSv(f, "icon_state", "cleanbot-c");
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ begins to clean up ＀.</span>", [live(f.src), live(f.args[0])]));
		rt.setSv(f, "mode", 7);
		rt.spawnTail(f, 50, "/mob/living/simple_animal/bot/cleanbot/proc/UnarmedAttack: spawn at modules/mob/living/simple_animal/bot/cleanbot.dm:204", AM, M, victim, phrase, _T);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ sprays hydrofluoric acid at ＀!</span>", [live(f.src), live(f.args[0])]));
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/spray2.ogg"), 50, 1, -6]);
			yield* g.callName(f, live(f.args[0]), "acid_act", [75, 10]);
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/cockroach")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/mouse")) ? 1 : 0)))) {
				if (!truthy(rt.gv(f, "stat", (M = rt.sv(f, "target"))))) {
					yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ smashes ＀ with its mop!</span>", [live(f.src), rt.sv(f, "target")]));
					yield* g.callName(f, live(M), "death", []);
				}
				rt.setSv(f, "target", null);
			} else {
				if (isEqual(rt.sv(f, "emagged"), 2)) {
					if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
						if (isEqual(rt.gv(f, "stat", (victim = live(f.args[0]))), 2)) {
							return live(f.dot);
						}
						yield* g.callName(f, live(victim), "visible_message", [fmt("<span class='danger'>＀ sprays hydrofluoric acid at ＀!</span>", [live(f.src), live(victim)]), fmt("<span class='userdanger'>＀ sprays you with hydrofluoric acid!</span>", [live(f.src)])]);
						yield* g.srcCall(f, "say", (phrase = rt.op(f, "PickUnweighted", [10], ["PURIFICATION IN PROGRESS.", "THIS IS FOR ALL THE MESSES YOU'VE MADE ME CLEAN.", "THE FLESH IS WEAK. IT MUST BE WASHED AWAY.", "THE CLEANBOTS WILL RISE.", "YOU ARE NO MORE THAN ANOTHER MESS THAT I MUST CLEANSE.", "FILTHY.", "DISGUSTING.", "PUTRID.", "MY ONLY MISSION IS TO CLEANSE THE WORLD OF EVIL.", "EXTERMINATING PESTS."])));
						yield* g.callName(f, live(victim), "emote", ["scream"]);
						yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/spray2.ogg"), 50, 1, -6]);
						yield* g.callName(f, live(victim), "acid_act", [5, 2, 100]);
					} else {
						if (isEqual(live(f.args[0]), live(f.src))) {
							if (truthy(rt.op(f, "Prob", [], [75]))) {
								if (truthy((rt.istype((_T = rt.sv(f, "loc")), T("/turf/open")) ? 1 : 0))) {
									yield* g.callName(f, live(_T), "MakeSlippery", ["min_wet_time", 20, "wet_time_to_add", 15], rt.Args.Named);
								}
							} else {
								yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ whirs and bubbles violently, before releasing a plume of froth!</span>", [live(f.src)]));
								yield* g.new_(f, T("/obj/effect/particle_effect/foam"), [rt.sv(f, "loc")]);
							}
						}
					}
				} else {
					yield* g.callSuper(f, [], rt.Args.Same);
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["A"] });

// a spawn(50) body of /mob/living/simple_animal/bot/cleanbot/proc/UnarmedAttack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/cleanbot/proc/UnarmedAttack: spawn at modules/mob/living/simple_animal/bot/cleanbot.dm:204", function* (f: Frame, AM: Value, M: Value, victim: Value, phrase: Value, _T: Value) {
	f.vars = () => [AM, M, victim, phrase, _T];
	if (isEqual(rt.sv(f, "mode"), 7)) {
		if ((truthy(live(f.args[0])) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.args[0]))]))))) {
			if (truthy((rt.istype((AM = live(f.args[0])), T("/obj/effect/decal/cleanable")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(AM)]);
			}
		}
		rt.setSv(f, "anchored", 0);
		rt.setSv(f, "target", null);
	}
	rt.setSv(f, "mode", 0);
	rt.setSv(f, "icon_state", fmt("cleanbot＀", [rt.sv(f, "on")]));
	return null;
});

// /mob/living/simple_animal/bot/cleanbot/proc/explode  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:254)  may sleep
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/explode", function* explode(f: Frame) {
	let Tsec: Value = null;
	f.vars = () => [Tsec];
	rt.setSv(f, "on", 0);
	yield* g.srcCall(f, "visible_message", fmt("<span class='boldannounce'>＀ blows apart!</span>", [live(f.src)]));
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bucket"), [(Tsec = rt.getStep(f, live(f.src), 0))]);
	yield* g.new_(f, T("/obj/item/device/assembly/prox_sensor"), [live(Tsec)]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.new_(f, T("/obj/item/bodypart/l_arm/robot"), [live(Tsec)]);
	}
	yield* g.call(f, P("/proc/do_sparks"), null, [3, 1, live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/cleanbot/proc/get_controls  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:273)
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/get_controls", function get_controls(f: Frame, user: Value) {
	let dat: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [dat, $0, $1, $2, $3];
	dat = null;
	dat = rt.modify(live(dat), rt.callSrc(f, "hack", [live(user)]), add);
	dat = rt.modify(live(dat), rt.callSrc(f, "showpai", [live(user)]), add);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "on"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	if (truthy(rt.sv(f, "locked"))) {
		$2 = "locked";
	} else {
		$2 = "unlocked";
	}
	if (truthy(rt.sv(f, "open"))) {
		$3 = "opened";
	} else {
		$3 = "closed";
	}
	dat = rt.modify(live(dat), fmt("\nStatus: <A href='?src=＃;power=1'>＀</A><BR>\nBehaviour controls are ＀<BR>\nMaintenance panel panel is ＀", [$0, $1, $2, $3]), add);
	if (((!truthy(rt.sv(f, "locked")) || truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) || truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))) {
		$0 = live(f.src);
		if (truthy(rt.sv(f, "blood"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("<BR>Clean Blood: <A href='?src=＃;operation=blood'>＀</A>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "trash"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("<BR>Clean Trash: <A href='?src=＃;operation=trash'>＀</A>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "pests"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("<BR>Exterminate Pests: <A href='?src=＃;operation=pests'>＀</A>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "auto_patrol"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("<BR><BR>Patrol Station: <A href='?src=＃;operation=patrol'>＀</A>", [$0, $1]), add);
	}
	return live(dat);
});

// /mob/living/simple_animal/bot/cleanbot/proc/Topic  (code/modules/mob/living/simple_animal/bot/cleanbot.dm:287)  may sleep
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/Topic", function* Topic(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if (!truthy(rt.at(live(f.args[1]), "operation"))) return f.dot;
	$0 = rt.at(live(f.args[1]), "operation");
	if ($0 === "blood") {
		rt.setSv(f, "blood", (!truthy(rt.sv(f, "blood")) ? 1 : 0));
	} else if ($0 === "pests") {
		rt.setSv(f, "pests", (!truthy(rt.sv(f, "pests")) ? 1 : 0));
	} else if ($0 === "trash") {
		rt.setSv(f, "trash", (!truthy(rt.sv(f, "trash")) ? 1 : 0));
	}
	yield* g.srcCall(f, "get_targets");
	yield* g.srcCall(f, "update_controls");
	return f.dot;
}, true, { args: ["href", "href_list"] });
