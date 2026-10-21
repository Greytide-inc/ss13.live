// From code/game/machinery/computer/robot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10407, "/obj/machinery/computer/robotics", "/obj/machinery/computer", {
	temp: null,
	icon_screen: "robot",
	icon_keyboard: "rd_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/robotics"),
	light_color: "#E17DE1",
	name: "robotics control console",
	desc: "Used to remotely lockdown or detonate linked Cyborgs.",
	req_access: null,
});

// /obj/machinery/computer/robotics/proc/<init>  (code/game/machinery/computer/robot.dm:9)
rt.def("/obj/machinery/computer/robotics/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(29));
	return f.dot;
});

// /obj/machinery/computer/robotics/proc/can_control  (code/game/machinery/computer/robot.dm:16)
rt.def("/obj/machinery/computer/robotics/proc/can_control", function can_control(f: Frame, user: Value, R: Value) {
	if (!truthy((rt.istype(live(R), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		return 0;
	}
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		if (!isEqual(rt.fv(f, "connected_ai", live(R)), live(user))) {
			return 0;
		}
	}
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if (!isEqual(live(R), live(user))) {
			return 0;
		}
	}
	if (truthy(rt.fv(f, "scrambledcodes", live(R)))) {
		return 0;
	}
	return 1;
});

// /obj/machinery/computer/robotics/proc/attack_hand  (code/game/machinery/computer/robot.dm:29)  may sleep
rt.def("/obj/machinery/computer/robotics/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/robotics/proc/interact  (code/game/machinery/computer/robot.dm:34)  may sleep
rt.def("/obj/machinery/computer/robotics/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, robots: Value = null, R: Value = null, drones: Value = null, D: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [user, dat, robots, R, drones, D, popup, $0, $1, $2, $e];
	if (rt.gt(rt.fv(f, "z", live(f.src)), 6)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldannounce'>Unable to establish a connection</span>:  You're too far away from the station!"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = null;
	robots = 0;
	R = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/silicon/robot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (!truthy((yield* g.srcCall(f, "can_control", live(user), live(R))))) {
			continue;
		}
		robots = rt.inc(live(robots), 1);
		dat = rt.modify(live(dat), fmt("＀ |", [rt.fv(f, "name", live(R))]), add);
		if (truthy(rt.fv(f, "stat", live(R)))) {
			dat = rt.modify(live(dat), " Not Responding |", add);
		} else {
			if (!truthy(rt.fv(f, "canmove", live(R)))) {
				dat = rt.modify(live(dat), " Locked Down |", add);
			} else {
				dat = rt.modify(live(dat), " Operating Normally |", add);
			}
		}
		if (truthy(rt.fv(f, "canmove", live(R)))) {
			if (truthy(rt.fv(f, "cell", live(R)))) {
				dat = rt.modify(live(dat), fmt(" Battery Installed (＀/＀) |", [rt.gv(f, "charge", rt.fv(f, "cell", live(R))), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(R)))]), add);
			} else {
				dat = rt.modify(live(dat), " No Cell Installed |", add);
			}
		}
		if (truthy(rt.fv(f, "module", live(R)))) {
			dat = rt.modify(live(dat), fmt(" Module Installed (＀) |", [rt.gv(f, "name", rt.fv(f, "module", live(R)))]), add);
		} else {
			dat = rt.modify(live(dat), " No Module Installed |", add);
		}
		if (truthy(rt.fv(f, "connected_ai", live(R)))) {
			dat = rt.modify(live(dat), fmt(" Slaved to ＀ |", [rt.gv(f, "name", rt.fv(f, "connected_ai", live(R)))]), add);
		} else {
			dat = rt.modify(live(dat), " Independent from AI |", add);
		}
		if ((truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(user)]))))) {
			if ((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)]))) && !isEqual(live(user), live(R)))) {
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;convert=＃'>(<font color=#BE8700><i>Convert</i></font>)</A> ", [live(f.src), live(R)]), add);
			} else {
				if (((((truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/is_special_character"), null, [live(user)])))) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))) && !truthy(rt.fv(f, "emagged", live(R)))) && (!isEqual(live(user), live(R)) || truthy(rt.fv(f, "syndicate", live(R)))))) {
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;magbot=＃'>(<font color=blue><i>Hack</i></font>)</A> ", [live(f.src), live(R)]), add);
				}
			}
		}
		$0 = live(f.src);
		$1 = live(R);
		if (truthy(rt.fv(f, "canmove", live(R)))) {
			$2 = "Lockdown";
		} else {
			$2 = "Release";
		}
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;stopbot=＃'>(<font color=green><i>＀</i></font>)</A> ", [$0, $1, $2]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;killbot=＃'>(<font color=red><i>Destroy</i></font>)</A>", [live(f.src), live(R)]), add);
		dat = rt.modify(live(dat), "<BR>", add);
	}
	rt.endFor(f, 0);
	if (!truthy(live(robots))) {
		dat = rt.modify(live(dat), "No Cyborg Units detected within access parameters.", add);
		dat = rt.modify(live(dat), "<BR>", add);
	}
	drones = 0;
	D = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/simple_animal/drone"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (truthy(rt.fv(f, "hacked", live(D)))) {
			continue;
		}
		drones = rt.inc(live(drones), 1);
		dat = rt.modify(live(dat), fmt("＀ |", [rt.fv(f, "name", live(D))]), add);
		if (truthy(rt.fv(f, "stat", live(D)))) {
			dat = rt.modify(live(dat), " Not Responding |", add);
		}
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;killdrone=＃'>(<font color=red><i>Destroy</i></font>)</A>", [live(f.src), live(D)]), add);
		dat = rt.modify(live(dat), "<BR>", add);
	}
	rt.endFor(f, 0);
	if (!truthy(live(drones))) {
		dat = rt.modify(live(dat), "No Drone Units detected within access parameters.", add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "computer", "Cyborg Control Console", 400, 500]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/machinery/computer/robotics/proc/Topic  (code/game/machinery/computer/robot.dm:98)  may sleep
rt.def("/obj/machinery/computer/robotics/proc/Topic", function* Topic(f: Frame) {
	let R: Value = null, choice: Value = null, _T: Value = null, D: Value = null, s: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [R, choice, _T, D, s, $0, $1, $2, $3];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "temp"))) {
		rt.setFv(f, "temp", live(f.src), null);
	} else {
		if (truthy(rt.at(live(f.args[1]), "killbot"))) {
			if (truthy((yield* g.callName(f, live(f.src), "allowed", [live(f.usr)])))) {
				R = rt.locateIn(f, rt.at(live(f.args[1]), "killbot"), rt.gl("silicon_mobs"));
				if (truthy((yield* g.srcCall(f, "can_control", live(f.usr), live(R))))) {
					if (((isEqual((choice = (yield* g.op(f, "Prompt", [0], [null, null, null, fmt("Are you certain you wish to detonate ＀?", [rt.fv(f, "name", live(R))]), rt.list("Confirm", "Abort")]))), "Confirm") && truthy((yield* g.srcCall(f, "can_control", live(f.usr), live(R))))) && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
						if ((truthy(rt.fv(f, "syndicate", live(R))) && truthy(rt.fv(f, "emagged", live(R))))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(R), "Extreme danger.  Termination codes detected.  Scrambling security codes and automatic AI unlink triggered."]);
							if (truthy(rt.fv(f, "connected_ai", live(R)))) {
								yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "connected_ai", live(R)), fmt("<br><br><span class='alert'>ALERT - Cyborg detonation detected: ＀</span><br>", [rt.fv(f, "name", live(R))])]);
							}
							yield* g.callName(f, live(R), "ResetSecurityCodes", []);
						} else {
							_T = rt.getStep(f, live(R), 0);
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='notice'>＀ detonated ＀＀!</span>", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)])]), (yield* g.call(f, P("/proc/key_name"), null, [live(R), rt.fv(f, "client", live(R))])), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
							yield* g.call(f, P("/proc/log_game"), null, [fmt("<span class='notice'>＀ detonated ＀!</span>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(R)]))])]);
							if (truthy(rt.fv(f, "connected_ai", live(R)))) {
								yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "connected_ai", live(R)), fmt("<br><br><span class='alert'>ALERT - Cyborg detonation detected: ＀</span><br>", [rt.fv(f, "name", live(R))])]);
							}
							yield* g.callName(f, live(R), "self_destruct", []);
						}
					}
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Access Denied.</span>"]);
			}
		} else {
			if (truthy(rt.at(live(f.args[1]), "stopbot"))) {
				if (truthy((yield* g.callName(f, live(f.src), "allowed", [live(f.usr)])))) {
					R = rt.locateIn(f, rt.at(live(f.args[1]), "stopbot"), rt.gl("silicon_mobs"));
					if (truthy((yield* g.srcCall(f, "can_control", live(f.usr), live(R))))) {
						$0 = null;
						$1 = null;
						$2 = null;
						if (truthy(rt.fv(f, "canmove", live(R)))) {
							$3 = "lock down";
						} else {
							$3 = "release";
						}
						if (((isEqual((choice = (yield* g.op(f, "Prompt", [0], [$0, $1, $2, fmt("Are you certain you wish to ＀ ＀?", [$3, rt.fv(f, "name", live(R))]), rt.list("Confirm", "Abort")]))), "Confirm") && truthy((yield* g.srcCall(f, "can_control", live(f.usr), live(R))))) && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
							$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)])]);
							if (truthy(rt.fv(f, "canmove", live(R)))) {
								$1 = "locked down";
							} else {
								$1 = "released";
							}
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='notice'>＀ ＀ ＀＀!</span>", [$0, $1, (yield* g.call(f, P("/proc/key_name"), null, [live(R), rt.fv(f, "client", live(R))])), fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(R)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(R)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(R)])])])]);
							$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]));
							if (truthy(rt.fv(f, "canmove", live(R)))) {
								$1 = "locked down";
							} else {
								$1 = "released";
							}
							yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ ＀ ＀!", [$0, $1, (yield* g.call(f, P("/proc/key_name"), null, [live(R)]))])]);
							yield* g.callName(f, live(R), "SetLockdown", [(!truthy(rt.fv(f, "lockcharge", live(R))) ? 1 : 0)]);
							$0 = live(R);
							if (!truthy(rt.fv(f, "lockcharge", live(R)))) {
								$1 = "<span class='notice'>Your lockdown has been lifted!";
							} else {
								$1 = "<span class='alert'>You have been locked down!";
							}
							yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("＀</span>", [$1])]);
							if (truthy(rt.fv(f, "connected_ai", live(R)))) {
								$0 = rt.fv(f, "connected_ai", live(R));
								if (!truthy(rt.fv(f, "lockcharge", live(R)))) {
									$1 = "<span class='notice'>NOTICE - Cyborg lockdown lifted";
								} else {
									$1 = "<span class='alert'>ALERT - Cyborg lockdown detected";
								}
								yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("＀: <a href='?src=＃;track=＀'>＀</a></span><br>", [$1, rt.fv(f, "connected_ai", live(R)), (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "name", live(R))])), rt.fv(f, "name", live(R))])]);
							}
						}
					}
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Access Denied.</span>"]);
				}
			} else {
				if (truthy(rt.at(live(f.args[1]), "magbot"))) {
					if (((truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/is_special_character"), null, [live(f.usr)])))) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)]))))) {
						if (((((truthy((rt.istype((R = rt.locateIn(f, rt.at(live(f.args[1]), "magbot"), rt.gl("silicon_mobs"))), T("/mob/living/silicon/robot")) ? 1 : 0)) && !truthy(rt.fv(f, "emagged", live(R)))) && (((truthy(rt.fv(f, "syndicate", live(R))) && isEqual(live(R), live(f.usr))) || isEqual(rt.fv(f, "connected_ai", live(R)), live(f.usr))) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)]))))) && !truthy(rt.fv(f, "scrambledcodes", live(R)))) && truthy((yield* g.srcCall(f, "can_control", live(f.usr), live(R)))))) {
							yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ emagged ＀ using robotic console!", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.fv(f, "name", live(R))])]);
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ emagged cyborg ＀ using robotic console!", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(R)]))])]);
							yield* g.callName(f, live(R), "SetEmagged", [1]);
							if (truthy((yield* g.call(f, P("/proc/is_special_character"), null, [live(R)])))) {
								rt.modField(f, live(R), "verbs", P("/mob/living/silicon/robot/proc/ResetSecurityCodes"), add);
							}
						}
					}
				} else {
					if (truthy(rt.at(live(f.args[1]), "convert"))) {
						if ((truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/is_special_character"), null, [live(f.usr)]))))) {
							if ((((truthy((rt.istype((R = rt.locateIn(f, rt.at(live(f.args[1]), "convert"), rt.gl("silicon_mobs"))), T("/mob/living/silicon/robot")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(R)])))) && truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.usr)])))) && isEqual(rt.fv(f, "connected_ai", live(R)), live(f.usr)))) {
								yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ converted ＀ using robotic console!", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.fv(f, "name", live(R))])]);
								yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ converted cyborg ＀ using robotic console!", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(R)]))])]);
								yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [live(R)]);
							}
						}
					} else {
						if (truthy(rt.at(live(f.args[1]), "killdrone"))) {
							if (truthy((yield* g.callName(f, live(f.src), "allowed", [live(f.usr)])))) {
								if (truthy(rt.gv(f, "hacked", (D = rt.locateIn(f, rt.at(live(f.args[1]), "killdrone"), rt.world()))))) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>ERROR: ＀ is not responding to external commands.</span>", [live(D)])]);
								} else {
									yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [3, 1, live(D)]);
									yield* g.callName(f, live(s), "start", []);
									yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>％！ self destructs!</span>", [live(D)])]);
									yield* g.callName(f, live(D), "gib", []);
								}
							}
						}
					}
				}
			}
		}
	}
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });
