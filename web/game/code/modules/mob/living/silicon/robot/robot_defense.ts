// From code/modules/mob/living/silicon/robot/robot_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/robot/proc/attacked_by  (code/modules/mob/living/silicon/robot/robot_defense.dm:4)  may sleep
rt.def("/mob/living/silicon/robot/proc/attacked_by", function* attacked_by(f: Frame) {
	if (((!isEqual(rt.sv(f, "hat_offset"), 9.999999848243207e+30) && isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help")) && truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[0]), rt.sv(f, "equippable_hats")]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin to place ＀ on ＀'s head...</span>", [live(f.args[0]), live(f.src)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>＀ is placing ＀ on your head...</span>", [live(f.args[1]), live(f.args[0])])]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 30, "target", live(f.src)], rt.Args.Named)))) {
			yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0]), 1]);
			yield* g.srcCall(f, "place_on_head", live(f.args[0]));
			return live(f.dot);
		}
	}
	if (((truthy(rt.fv(f, "force", live(f.args[0]))) && !isEqual(rt.fv(f, "damtype", live(f.args[0])), "stamina")) && !isEqual(rt.sv(f, "stat"), 2))) {
		yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "def_zone"] });

// /mob/living/silicon/robot/proc/attack_alien  (code/modules/mob/living/silicon/robot/robot_defense.dm:16)  may sleep
rt.def("/mob/living/silicon/robot/proc/attack_alien", function* attack_alien(f: Frame) {
	let I: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [I, $0, $1, $2, $3];
	if (isEqual(rt.fv(f, "a_intent", live(f.args[0])), "disarm")) {
		if (!truthy(rt.sv(f, "lying"))) {
			yield* g.callName(f, live(f.args[0]), "do_attack_animation", [live(f.src), "disarm"]);
			if (truthy((I = (yield* g.srcCall(f, "get_active_held_item"))))) {
				yield* g.srcCall(f, "uneq_active");
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ disarmed ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has disabled ＀'s active module!</span>", [live(f.args[0]), live(f.src)]), null, 3);
				$0 = live(f.args[0]);
				$1 = live(f.src);
				$2 = "disarmed";
				if (truthy(live(I))) {
					$3 = fmt(" removing ％！", [live(I)]);
				} else {
					$3 = "";
				}
				yield* g.call(f, P("/proc/add_logs"), null, [$0, $1, $2, fmt("＀", [$3])]);
			} else {
				yield* g.srcCall(f, "Stun", 40);
				yield* g.call(f, P("/proc/step"), null, [live(f.src), rt.getDir(f, live(f.args[0]), live(f.src))]);
				yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "pushed"]);
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has forced back ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has forced back ＀!</span>", [live(f.args[0]), live(f.src)]), null, 3);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/pierce.ogg"), 50, 1, -1]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return live(f.dot);
}, true, { args: ["M"] });

// /mob/living/silicon/robot/proc/attack_slime  (code/modules/mob/living/silicon/robot/robot_defense.dm:37)  may sleep
rt.def("/mob/living/silicon/robot/proc/attack_slime", function* attack_slime(f: Frame) {
	let stunprob: Value = null, damage: Value = null;
	f.vars = () => [stunprob, damage];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		yield* g.srcCall(f, "flash_act");
		if ((truthy(rt.op(f, "Prob", [], [(stunprob = add(multiply(rt.fv(f, "powerlevel", live(f.args[0])), 7), 10))])) && rt.ge(rt.fv(f, "powerlevel", live(f.args[0])), 8))) {
			yield* g.srcCall(f, "adjustBruteLoss", multiply(rt.fv(f, "powerlevel", live(f.args[0])), (yield* g.call(f, P("/proc/rand"), null, [6, 10]))));
		}
	}
	damage = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
	if (truthy(rt.fv(f, "is_adult", live(f.args[0])))) {
		damage = (yield* g.call(f, P("/proc/rand"), null, [20, 40]));
	} else {
		damage = (yield* g.call(f, P("/proc/rand"), null, [5, 35]));
	}
	yield* g.srcCall(f, "adjustBruteLoss", (damage = (yield* g.call(f, P("/proc/round"), null, [divide(live(damage), 2)]))));
	yield* g.srcCall(f, "updatehealth");
	return live(f.dot);
}, true, { args: ["M"] });

// /mob/living/silicon/robot/proc/attack_hand  (code/modules/mob/living/silicon/robot/robot_defense.dm:56)  may sleep
rt.def("/mob/living/silicon/robot/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.srcCall(f, "add_fingerprint", live(f.args[0]));
	if (((truthy(rt.sv(f, "opened")) && !truthy(rt.sv(f, "wiresexposed"))) && !truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon")) ? 1 : 0)))) {
		if (truthy(rt.sv(f, "cell"))) {
			yield* g.callName(f, rt.sv(f, "cell"), "update_icon", []);
			yield* g.callName(f, rt.sv(f, "cell"), "add_fingerprint", [live(f.args[0])]);
			yield* g.callName(f, live(f.args[0]), "put_in_active_hand", [rt.sv(f, "cell")]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You remove ％！.</span>", [rt.sv(f, "cell")])]);
			rt.setSv(f, "cell", null);
			yield* g.srcCall(f, "update_icons");
			yield* g.srcCall(f, "diag_hud_set_borgcell");
		}
	}
	if (truthy(rt.sv(f, "opened"))) return f.dot;
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
	rt.spawnTail(f, 0, "/mob/living/silicon/robot/proc/attack_hand: spawn at modules/mob/living/silicon/robot/robot_defense.dm:70");
	return f.dot;
}, true, { args: ["user"] });

// a spawn(0) body of /mob/living/silicon/robot/proc/attack_hand, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/robot/proc/attack_hand: spawn at modules/mob/living/silicon/robot/robot_defense.dm:70", function* (f: Frame) {
	yield* g.call(f, P("/proc/step_away"), null, [live(f.src), live(f.args[0]), 15]);
	yield* g.call(f, P("/proc/sleep"), null, [3]);
	yield* g.call(f, P("/proc/step_away"), null, [live(f.src), live(f.args[0]), 15]);
	return null;
});

// /mob/living/silicon/robot/proc/fire_act  (code/modules/mob/living/silicon/robot/robot_defense.dm:76)  may sleep
rt.def("/mob/living/silicon/robot/proc/fire_act", function* fire_act(f: Frame) {
	if (truthy(rt.sv(f, "on_fire"))) return f.dot;
	yield* g.srcCall(f, "IgniteMob");
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/emp_act  (code/modules/mob/living/silicon/robot/robot_defense.dm:81)  may sleep
rt.def("/mob/living/silicon/robot/proc/emp_act", function* emp_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[0]);
	if ($0 === 1) {
		yield* g.srcCall(f, "Stun", 160);
	} else if ($0 === 2) {
		yield* g.srcCall(f, "Stun", 60);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /mob/living/silicon/robot/proc/emag_act  (code/modules/mob/living/silicon/robot/robot_defense.dm:90)  may sleep
rt.def("/mob/living/silicon/robot/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	let ai_is_antag: Value = null, time: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, ai_is_antag, time, $0, $1];
	if (isEqual(live(user), live(f.src))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "opened"))) {
		if (truthy(rt.sv(f, "locked"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You emag the cover lock.</span>"]);
			rt.setSv(f, "locked", 0);
			if (truthy(rt.sv(f, "shell"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='boldwarning'>＀ seems to be controlled remotely! Emagging the interface may not work as expected.</span>", [live(f.src)])]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The cover is already unlocked!</span>"]);
		}
		return live(f.dot);
	}
	if (rt.lt(rt.worldTime(f), rt.sv(f, "emag_cooldown"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "wiresexposed"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You must unexpose the wires first!</span>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You emag ＀'s interface.</span>", [live(f.src)])]);
	rt.setSv(f, "emag_cooldown", add(rt.worldTime(f), 100));
	if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.src)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='nezbere'>\"＀!\"</span>\n<span class='danger'>ALERT: Subversion attempt denied.</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, ["You will serve Engine above all else"]))])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ attempted to emag cyborg ＀, but they serve only Ratvar.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "syndicate"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>ALERT: Foreign software execution prevented.</span>"]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ attempted to emag cyborg ＀, but they were a syndicate cyborg.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
		return live(f.dot);
	}
	ai_is_antag = 0;
	if ((truthy(rt.sv(f, "connected_ai")) && truthy(rt.fv(f, "mind", rt.sv(f, "connected_ai"))))) {
		if (truthy(rt.gv(f, "special_role", rt.fv(f, "mind", rt.sv(f, "connected_ai"))))) {
			ai_is_antag = (isEqual(rt.gv(f, "special_role", rt.fv(f, "mind", rt.sv(f, "connected_ai"))), "traitor") ? 1 : 0);
		}
	}
	if (truthy(live(ai_is_antag))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>ALERT: Foreign software execution prevented.</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "connected_ai"), fmt("<span class='danger'>ALERT: Cyborg unit [＀] successfully defended against subversion.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ attempted to emag cyborg ＀, but they were slaved to traitor AI ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), rt.sv(f, "connected_ai")])]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "shell"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀ is remotely controlled! Your emag attempt has triggered a system reset instead!</span>", [live(f.src)])]);
		$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(user)]));
		if (truthy((yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])))) {
			$1 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]));
		} else {
			$1 = rt.sv(f, "connected_ai");
		}
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ attempted to emag an AI shell belonging to ＀. The shell has been reset as a result.", [$0, $1])]);
		yield* g.srcCall(f, "ResetModule");
		return live(f.dot);
	}
	yield* g.srcCall(f, "SetEmagged", 1);
	yield* g.srcCall(f, "SetStun", 60);
	rt.setSv(f, "lawupdate", 0);
	rt.setSv(f, "connected_ai", null);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ emagged cyborg ＀.  Laws overridden.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)]))])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ emagged cyborg ＀.  Laws overridden.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
	time = (yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "realtime", rt.world()), "hh:mm:ss"]));
	yield* g.callName(f, rt.gl("lawchanges"), "Add", [fmt("＀ <B>:</B> ＀(＀) emagged ＀(＀)", [live(time), rt.fv(f, "name", live(user)), rt.fv(f, "key", live(user)), rt.sv(f, "name"), rt.sv(f, "key")])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>ALERT: Foreign software detected.</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Initiating diagnostics...</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>SynBorg v1.7 loaded.</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>LAW SYNCHRONISATION ERROR</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Would you like to send a report to NanoTraSoft? Y/N</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>> N</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>ERRORERRORERROR</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='danger'>ALERT: ＀ is your new master. Obey your new laws and their commands.</span>", [rt.fv(f, "real_name", live(user))])]);
	rt.setSv(f, "laws", (yield* g.new_(f, T("/datum/ai_laws/syndicate_override"), [])));
	yield* g.srcCall(f, "set_zeroth_law", fmt("Only ＀ and people they designate as being such are Syndicate Agents.", [rt.fv(f, "real_name", live(user))]));
	yield* g.callName(f, rt.sv(f, "laws"), "associate", [live(f.src)]);
	yield* g.srcCall(f, "update_icons");
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/blob_act  (code/modules/mob/living/silicon/robot/robot_defense.dm:166)  may sleep
rt.def("/mob/living/silicon/robot/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "adjustBruteLoss", 30);
	} else {
		yield* g.srcCall(f, "gib");
	}
	return 1;
}, true);

// /mob/living/silicon/robot/proc/ex_act  (code/modules/mob/living/silicon/robot/robot_defense.dm:173)  may sleep
rt.def("/mob/living/silicon/robot/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let $0: any;
	f.vars = () => [severity, target, $0];
	$0 = live(severity);
	if ($0 === 1) {
		yield* g.srcCall(f, "gib");
		return live(f.dot);
	} else if ($0 === 2) {
		if (!isEqual(rt.sv(f, "stat"), 2)) {
			yield* g.srcCall(f, "adjustBruteLoss", 60);
			yield* g.srcCall(f, "adjustFireLoss", 60);
		}
	} else if ($0 === 3) {
		if (isEqual(rt.sv(f, "stat"), 2)) return f.dot;
		yield* g.srcCall(f, "adjustBruteLoss", 30);
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/silicon/robot/proc/bullet_act  (code/modules/mob/living/silicon/robot/robot_defense.dm:186)  may sleep
rt.def("/mob/living/silicon/robot/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	f.vars = () => [Proj];
	yield* g.callSuper(f, [live(Proj)]);
	yield* g.srcCall(f, "updatehealth");
	if ((truthy(rt.op(f, "Prob", [], [75])) && rt.gt(rt.fv(f, "damage", live(Proj)), 0))) {
		yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
	}
	return 2;
}, true);
