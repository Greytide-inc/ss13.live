// From code/game/machinery/syndicatebomb.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10849, "/obj/machinery/syndicatebomb", "/obj/machinery", {
	minimum_timer: 90,
	timer_set: 90,
	maximum_timer: 60000,
	can_unanchor: 1,
	open_panel: 0,
	active: 0,
	defused: 0,
	payload: rt.typePath("/obj/item/weapon/bombcore"),
	beepsound: rt.rsc("sound/items/timer.ogg"),
	delayedbig: 0,
	delayedlittle: 0,
	countdown: null,
	next_beep: null,
	detonation_timer: null,
	explode_now: 0,
	anchored: 0,
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	name: "syndicate bomb",
	icon_state: "syndicate-bomb",
	desc: "A large and menacing device. Can be bolted down with a wrench.",
	density: 0,
	layer: 3.7,
	resistance_flags: 34,
});

// /obj/machinery/syndicatebomb/proc/try_detonate  (code/game/machinery/syndicatebomb.dm:35)  may sleep
rt.def("/obj/machinery/syndicatebomb/proc/try_detonate", function* try_detonate(f: Frame, ignore_active: Value) {
	f.vars = () => [ignore_active];
	if (live(ignore_active) === null) {
		ignore_active = 0;
	}
	f.dot = (((rt.isIn(f, rt.sv(f, "payload"), live(f.src)) ? 1 : 0) && (rt.sv(f, "active") || live(ignore_active))) && (!truthy(rt.sv(f, "defused")) ? 1 : 0));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.callName(f, rt.sv(f, "payload"), "detonate", []);
	return f.dot;
}, true);

// /obj/machinery/syndicatebomb/proc/obj_break  (code/game/machinery/syndicatebomb.dm:40)  may sleep
rt.def("/obj/machinery/syndicatebomb/proc/obj_break", function* obj_break(f: Frame) {
	if (truthy((yield* g.srcCall(f, "try_detonate")))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/syndicatebomb/proc/obj_destruction  (code/game/machinery/syndicatebomb.dm:44)  may sleep
rt.def("/obj/machinery/syndicatebomb/proc/obj_destruction", function* obj_destruction(f: Frame) {
	if (truthy((yield* g.srcCall(f, "try_detonate")))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/syndicatebomb/proc/process  (code/game/machinery/syndicatebomb.dm:48)  may sleep
rt.def("/obj/machinery/syndicatebomb/proc/process", function* process(f: Frame) {
	let volume: Value = null;
	let $0: any;
	f.vars = () => [volume, $0];
	if (!truthy(rt.sv(f, "active"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
		rt.setSv(f, "detonation_timer", null);
		rt.setSv(f, "next_beep", null);
		yield* g.callName(f, rt.sv(f, "countdown"), "stop", []);
		return live(f.dot);
	}
	if ((rt.sv(f, "next_beep") !== null && rt.le(rt.sv(f, "next_beep"), rt.worldTime(f)))) {
		volume = null;
		$0 = (yield* g.srcCall(f, "seconds_remaining"));
		if (rt.inRange($0, 0, 5)) {
			volume = 50;
		} else if (rt.inRange($0, 5, 10)) {
			volume = 40;
		} else if (rt.inRange($0, 10, 15)) {
			volume = 30;
		} else if (rt.inRange($0, 15, 20)) {
			volume = 20;
		} else if (rt.inRange($0, 20, 25)) {
			volume = 10;
		} else {
			volume = 5;
		}
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "beepsound"), live(volume), 0]);
		rt.setSv(f, "next_beep", add(rt.worldTime(f), 10));
	}
	if (((truthy(rt.sv(f, "active")) && !truthy(rt.sv(f, "defused"))) && (rt.le(rt.sv(f, "detonation_timer"), rt.worldTime(f)) || truthy(rt.sv(f, "explode_now"))))) {
		rt.setSv(f, "active", 0);
		rt.setSv(f, "timer_set", rt.initial(f, live(f.src), "timer_set"));
		yield* g.srcCall(f, "update_icon");
		yield* g.srcCall(f, "try_detonate", 1);
	} else {
		if (!(!truthy(rt.sv(f, "active")) || truthy(rt.sv(f, "defused")))) return f.dot;
		if (!truthy((rt.isIn(f, (rt.sv(f, "defused") && rt.sv(f, "payload")), live(f.src)) ? 1 : 0))) return f.dot;
		yield* g.callName(f, rt.sv(f, "payload"), "defuse", []);
		yield* g.callName(f, rt.sv(f, "countdown"), "stop", []);
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/syndicatebomb/proc/New  (code/game/machinery/syndicatebomb.dm:86)  may sleep
rt.def("/obj/machinery/syndicatebomb/proc/New", function* New(f: Frame) {
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/syndicatebomb"), [live(f.src)])));
	if (truthy(rt.fv(f, "payload", live(f.src)))) {
		rt.setSv(f, "payload", (yield* g.new_(f, rt.sv(f, "payload"), [live(f.src)])));
	}
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "countdown", (yield* g.new_(f, T("/obj/effect/countdown/syndicatebomb"), [live(f.src)])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/syndicatebomb/proc/Destroy  (code/game/machinery/syndicatebomb.dm:94)  may sleep
rt.def("/obj/machinery/syndicatebomb/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	if (truthy(rt.sv(f, "countdown"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "countdown")]);
		rt.setSv(f, "countdown", null);
	}
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/syndicatebomb/proc/examine  (code/game/machinery/syndicatebomb.dm:103)
rt.def("/obj/machinery/syndicatebomb/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("A digital display on it reads \"＀\".", [rt.callSrc(f, "seconds_remaining", [])])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/syndicatebomb/proc/update_icon  (code/game/machinery/syndicatebomb.dm:107)
rt.def("/obj/machinery/syndicatebomb/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "active"))) {
		$1 = "-active";
	} else {
		$1 = "-inactive";
	}
	if (truthy(rt.sv(f, "open_panel"))) {
		$2 = "-wires";
	} else {
		$2 = "";
	}
	rt.setSv(f, "icon_state", fmt("＀＀＀", [$0, $1, $2]));
	return f.dot;
});

// /obj/machinery/syndicatebomb/proc/seconds_remaining  (code/game/machinery/syndicatebomb.dm:111)
rt.def("/obj/machinery/syndicatebomb/proc/seconds_remaining", function seconds_remaining(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		f.dot = rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/round"), null, [divide(subtract(rt.sv(f, "detonation_timer"), rt.worldTime(f)), 10)])]);
	} else {
		f.dot = rt.sv(f, "timer_set");
	}
	return f.dot;
});

// /obj/machinery/syndicatebomb/proc/attackby  (code/game/machinery/syndicatebomb.dm:116)  may sleep
rt.def("/obj/machinery/syndicatebomb/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, old_integ: Value = null;
	let $0: any, $1: any;
	f.vars = () => [WT, old_integ, $0, $1];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && truthy(rt.sv(f, "can_unanchor")))) {
		if (!truthy(rt.sv(f, "anchored"))) {
			if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) || truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open/space")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The bomb must be placed on solid ground to attach it.</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You firmly wrench the bomb to the floor.</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				rt.setSv(f, "anchored", 1);
				if (truthy(rt.sv(f, "active"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The bolts lock in place.</span>"]);
				}
			}
		} else {
			if (!truthy(rt.sv(f, "active"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You wrench the bomb from the floor.</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				rt.setSv(f, "anchored", 0);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The bolts are locked down!</span>"]);
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			rt.setSv(f, "open_panel", (!truthy(rt.sv(f, "open_panel")) ? 1 : 0));
			yield* g.srcCall(f, "update_icon");
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "open_panel"))) {
				$1 = "open";
			} else {
				$1 = "close";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the wire panel.</span>", [$1])]);
		} else {
			if ((truthy((yield* g.call(f, P("/proc/is_wire_tool"), null, [live(f.args[0])]))) && truthy(rt.sv(f, "open_panel")))) {
				yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[1])]);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
					if ((truthy(rt.sv(f, "open_panel")) && truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_all_cut", []))))) {
						if (truthy(rt.sv(f, "payload"))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You carefully pry out ＀.</span>", [rt.sv(f, "payload")])]);
							rt.setFv(f, "loc", rt.sv(f, "payload"), rt.fv(f, "loc", live(f.args[1])));
							rt.setSv(f, "payload", null);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There isn't anything in here to remove!</span>"]);
						}
					} else {
						if (truthy(rt.sv(f, "open_panel"))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The wires connecting the shell to the explosives are holding it down!</span>"]);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The cover is screwed on, it won't pry off!</span>"]);
						}
					}
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/bombcore")) ? 1 : 0))) {
						if (!truthy(rt.sv(f, "payload"))) {
							if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
								return live(f.dot);
							}
							rt.setSv(f, "payload", live(f.args[0]));
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You place ＀ into ＀.</span>", [rt.sv(f, "payload"), live(f.src)])]);
							rt.setFv(f, "loc", rt.sv(f, "payload"), live(f.src));
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is already loaded into ＀! You'll have to remove it first.</span>", [rt.sv(f, "payload"), live(f.src)])]);
						}
					} else {
						if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
							if (((truthy(rt.sv(f, "payload")) || !truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_all_cut", [])))) || !truthy(rt.sv(f, "open_panel")))) {
								return live(f.dot);
							}
							if (!truthy((yield* g.callName(f, (WT = live(f.args[0])), "isOn", [])))) {
								return live(f.dot);
							}
							if (rt.lt((yield* g.callName(f, live(WT), "get_fuel", [])), 5)) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more fuel to complete this task!</span>"]);
								return live(f.dot);
							}
							yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start to cut the ＀ apart...</span>", [live(f.src)])]);
							if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
								if ((!truthy((yield* g.callName(f, live(WT), "isOn", []))) || !truthy((yield* g.callName(f, live(WT), "remove_fuel", [5, live(f.args[1])]))))) {
									return live(f.dot);
								}
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You cut the ＀ apart.</span>", [live(f.src)])]);
								yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [rt.sv(f, "loc"), 5]);
								yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
							}
						} else {
							old_integ = rt.sv(f, "obj_integrity");
							f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
							if (!(((rt.gt(live(old_integ), rt.sv(f, "obj_integrity")) && truthy(rt.sv(f, "active"))) && !truthy(rt.sv(f, "defused"))) && truthy((rt.isIn(f, rt.sv(f, "payload"), live(f.src)) ? 1 : 0)))) return f.dot;
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>That seems like a really bad idea...</span>"]);
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/syndicatebomb/proc/attack_hand  (code/game/machinery/syndicatebomb.dm:188)  may sleep
rt.def("/obj/machinery/syndicatebomb/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/syndicatebomb/proc/interact  (code/game/machinery/syndicatebomb.dm:194)  may sleep
rt.def("/obj/machinery/syndicatebomb/proc/interact", function* interact(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(user)]);
	if (truthy(rt.sv(f, "open_panel"))) return f.dot;
	if (!truthy(rt.sv(f, "active"))) {
		yield* g.srcCall(f, "settings", live(user));
	} else {
		if (!truthy(rt.sv(f, "anchored"))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The bomb is bolted to the floor!</span>"]);
	}
	return f.dot;
}, true);

// /obj/machinery/syndicatebomb/proc/activate  (code/game/machinery/syndicatebomb.dm:203)
rt.def("/obj/machinery/syndicatebomb/proc/activate", function activate(f: Frame) {
	rt.setSv(f, "active", 1);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	}
	rt.callName(f, rt.sv(f, "countdown"), "start", []);
	rt.setSv(f, "next_beep", add(rt.worldTime(f), 10));
	rt.setSv(f, "detonation_timer", add(rt.worldTime(f), multiply(rt.sv(f, "timer_set"), 10)));
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/click.ogg"), 30, 1]);
	return f.dot;
});

// /obj/machinery/syndicatebomb/proc/settings  (code/game/machinery/syndicatebomb.dm:210)  may sleep
rt.def("/obj/machinery/syndicatebomb/proc/settings", function* settings(f: Frame, user: Value) {
	let new_timer: Value = null, bombturf: Value = null, A: Value = null;
	f.vars = () => [user, new_timer, bombturf, A];
	new_timer = (yield* g.op(f, "Prompt", [32], [fmt("＀", [rt.sv(f, "timer_set")]), "Timer", "Please set the timer.", live(user), null]));
	if ((rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1) && truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)))) {
		rt.setSv(f, "timer_set", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "minimum_timer"), (yield* g.call(f, P("/proc/min"), null, [live(new_timer), rt.sv(f, "maximum_timer")]))])));
		yield* g.callName(f, rt.fv(f, "loc", live(f.src)), "visible_message", [fmt("<span class='notice'>＀ timer set for ＀ seconds.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)])), rt.sv(f, "timer_set")])]);
	}
	if (!((isEqual((yield* g.call(f, P("/proc/alert"), null, [live(user), "Would you like to start the countdown now?", null, "Yes", "No"])), "Yes") && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1)) && truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)))) return f.dot;
	if ((truthy(rt.sv(f, "defused")) || truthy(rt.sv(f, "active")))) {
		if (truthy(rt.sv(f, "defused"))) {
			yield* g.callName(f, rt.fv(f, "loc", live(f.src)), "visible_message", [fmt("<span class='warning'>＀ Device error: User intervention required.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
		}
		return live(f.dot);
	} else {
		yield* g.callName(f, rt.fv(f, "loc", live(f.src)), "visible_message", [fmt("<span class='danger'>＀ ＀ seconds until detonation, please clear the area.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)])), rt.sv(f, "timer_set")])]);
		yield* g.srcCall(f, "activate");
		yield* g.srcCall(f, "update_icon");
		yield* g.srcCall(f, "add_fingerprint", live(user));
		bombturf = rt.getStep(f, live(f.src), 0);
		A = (yield* g.call(f, P("/proc/get_area"), null, [live(bombturf)]));
		if (!(truthy(rt.sv(f, "payload")) && !truthy((rt.istype(rt.sv(f, "payload"), T("/obj/item/weapon/bombcore/training")) ? 1 : 0)))) return f.dot;
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has primed a ＀ (＀) for detonation at ＀ ＀</a>.", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]), rt.sv(f, "name"), rt.sv(f, "payload"), rt.fv(f, "name", live(A)), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has primed a ＀ (＀) for detonation at ＀＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.sv(f, "name"), rt.sv(f, "payload"), rt.fv(f, "name", live(A)), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])])]);
		rt.setFv(f, "adminlog", rt.sv(f, "payload"), fmt("The ＀ that ＀ had primed detonated!", [rt.fv(f, "name", live(f.src)), (yield* g.call(f, P("/proc/key_name"), null, [live(user)]))]));
	}
	return f.dot;
}, true);

rt.type(10853, "/obj/machinery/syndicatebomb/empty", "/obj/machinery/syndicatebomb", {
	payload: null,
	open_panel: 1,
	timer_set: 120,
	name: "bomb",
	icon_state: "base-bomb",
	desc: "An ominous looking device designed to detonate an explosive payload. Can be bolted down using a wrench.",
});

// /obj/machinery/syndicatebomb/empty/proc/New  (code/game/machinery/syndicatebomb.dm:261)  may sleep
rt.def("/obj/machinery/syndicatebomb/empty/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "wires"), "cut_all", []);
	return f.dot;
}, true);

rt.type(6941, "/obj/item/weapon/bombcore", "/obj/item/weapon", {
	adminlog: null,
	range_heavy: 3,
	range_medium: 9,
	range_light: 17,
	range_flame: 17,
	name: "bomb payload",
	desc: "A powerful secondary explosive of syndicate design and unknown composition, it should be stable under normal conditions...",
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	icon_state: "bombcore",
	item_state: "eshield0",
	w_class: 3,
	origin_tech: "syndicate=5;combat=6",
	resistance_flags: 4,
});

// /obj/item/weapon/bombcore/proc/defuse  empty
rt.def("/obj/item/weapon/bombcore/proc/defuse");

// /obj/item/weapon/bombcore/proc/ex_act  (code/game/machinery/syndicatebomb.dm:288)  may sleep
rt.def("/obj/item/weapon/bombcore/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	f.vars = () => [severity, target];
	yield* g.srcCall(f, "detonate");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/bombcore/proc/burn  (code/game/machinery/syndicatebomb.dm:292)  may sleep
rt.def("/obj/item/weapon/bombcore/proc/burn", function* burn(f: Frame) {
	yield* g.srcCall(f, "detonate");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/bombcore/proc/detonate  (code/game/machinery/syndicatebomb.dm:297)  may sleep
rt.def("/obj/item/weapon/bombcore/proc/detonate", function* detonate(f: Frame) {
	if (truthy(rt.sv(f, "adminlog"))) {
		yield* g.call(f, P("/proc/message_admins"), null, [rt.sv(f, "adminlog")]);
		yield* g.call(f, P("/proc/log_game"), null, [rt.sv(f, "adminlog")]);
	}
	yield* g.call(f, P("/proc/explosion"), null, [null, rt.getStep(f, live(f.src), 0), null, rt.sv(f, "range_heavy"), null, rt.sv(f, "range_medium"), null, rt.sv(f, "range_light"), "flame_range", rt.sv(f, "range_flame")], rt.Args.Named);
	if ((truthy(rt.sv(f, "loc")) && truthy((rt.istype(rt.sv(f, "loc"), T("/obj/machinery/syndicatebomb")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "loc")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(6942, "/obj/item/weapon/bombcore/training", "/obj/item/weapon/bombcore", {
	defusals: 0,
	attempts: 0,
	name: "dummy payload",
	desc: "A nanotrasen replica of a syndicate payload. Its not intended to explode but to announce that it WOULD have exploded, then rewire itself to allow for more training.",
	origin_tech: null,
});

// /obj/item/weapon/bombcore/training/proc/reset  (code/game/machinery/syndicatebomb.dm:318)  may sleep
rt.def("/obj/item/weapon/bombcore/training/proc/reset", function* reset(f: Frame) {
	let holder: Value = null;
	f.vars = () => [holder];
	if (!truthy((rt.istype((holder = rt.sv(f, "loc")), T("/obj/machinery/syndicatebomb")) ? 1 : 0))) return f.dot;
	if (truthy(rt.fv(f, "wires", live(holder)))) {
		yield* g.callName(f, rt.fv(f, "wires", live(holder)), "repair", []);
		yield* g.callName(f, rt.fv(f, "wires", live(holder)), "shuffle_wires", []);
	}
	rt.setFv(f, "defused", live(holder), 0);
	rt.setFv(f, "open_panel", live(holder), 0);
	rt.setFv(f, "delayedbig", live(holder), 0);
	rt.setFv(f, "delayedlittle", live(holder), 0);
	yield* g.callName(f, live(holder), "update_icon", []);
	yield* g.callName(f, live(holder), "updateDialog", []);
	return f.dot;
}, true);

// /obj/item/weapon/bombcore/training/proc/detonate  (code/game/machinery/syndicatebomb.dm:331)  may sleep
rt.def("/obj/item/weapon/bombcore/training/proc/detonate", function* detonate(f: Frame) {
	let holder: Value = null;
	f.vars = () => [holder];
	if (truthy((rt.istype((holder = rt.sv(f, "loc")), T("/obj/machinery/syndicatebomb")) ? 1 : 0))) {
		rt.incSrcVar(f, "attempts", 1, true);
		yield* g.callName(f, rt.fv(f, "loc", live(holder)), "visible_message", [fmt("<span class='danger'>＀ Alert: Bomb has detonated. Your score is now ＀ for ＀. Resetting wires...</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(holder)])), rt.sv(f, "defusals"), rt.sv(f, "attempts")])]);
		yield* g.srcCall(f, "reset");
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/bombcore/training/proc/defuse  (code/game/machinery/syndicatebomb.dm:340)  may sleep
rt.def("/obj/item/weapon/bombcore/training/proc/defuse", function* defuse(f: Frame) {
	let holder: Value = null;
	f.vars = () => [holder];
	if (!truthy((rt.istype((holder = rt.sv(f, "loc")), T("/obj/machinery/syndicatebomb")) ? 1 : 0))) return f.dot;
	rt.incSrcVar(f, "attempts", 1, true);
	rt.incSrcVar(f, "defusals", 1, true);
	yield* g.callName(f, rt.fv(f, "loc", live(holder)), "visible_message", [fmt("<span class='notice'>＀ Alert: Bomb has been defused. Your score is now ＀ for ＀! Resetting wires in 5 seconds...</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(holder)])), rt.sv(f, "defusals"), rt.sv(f, "attempts")])]);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	if (!truthy((rt.istype(live(holder), T("/obj/machinery/syndicatebomb")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "reset");
	return f.dot;
}, true);

rt.type(6943, "/obj/item/weapon/bombcore/badmin", "/obj/item/weapon/bombcore", {
	name: "badmin payload",
	desc: "If you're seeing this someone has either made a mistake or gotten dangerously savvy with var editing!",
	origin_tech: null,
});

// /obj/item/weapon/bombcore/badmin/proc/defuse  (code/game/machinery/syndicatebomb.dm:355)  may sleep
rt.def("/obj/item/weapon/bombcore/badmin/proc/defuse", function* defuse(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.call(f, P("/proc/qdel"), null, [(B = rt.sv(f, "loc"))]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(6944, "/obj/item/weapon/bombcore/badmin/summon", "/obj/item/weapon/bombcore/badmin", {
	summon_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cookie"),
	amt_summon: 1,
});

// /obj/item/weapon/bombcore/badmin/summon/proc/detonate  (code/game/machinery/syndicatebomb.dm:365)  may sleep
rt.def("/obj/item/weapon/bombcore/badmin/summon/proc/detonate", function* detonate(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	B = rt.fv(f, "loc", live(f.src));
	yield* g.call(f, P("/proc/spawn_and_random_walk"), null, [null, rt.sv(f, "summon_path"), null, live(f.src), null, rt.sv(f, "amt_summon"), "walk_chance", 50, "admin_spawn", 1], rt.Args.Named);
	yield* g.call(f, P("/proc/qdel"), null, [live(B)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(6945, "/obj/item/weapon/bombcore/badmin/summon/clown", "/obj/item/weapon/bombcore/badmin/summon", {
	summon_path: rt.typePath("/mob/living/simple_animal/hostile/retaliate/clown"),
	amt_summon: 100,
});

// /obj/item/weapon/bombcore/badmin/summon/clown/proc/defuse  (code/game/machinery/syndicatebomb.dm:374)  may sleep
rt.def("/obj/item/weapon/bombcore/badmin/summon/clown/proc/defuse", function* defuse(f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/misc/sadtrombone.ogg"), 50]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(6949, "/obj/item/weapon/bombcore/chemical", "/obj/item/weapon/bombcore", {
	beakers: null,
	max_beakers: 1,
	spread_range: 5,
	temp_boost: 50,
	time_release: 0,
	name: "chemical payload",
	desc: "An explosive payload designed to spread chemicals, dangerous or otherwise, across a large area. It is able to hold up to four chemical containers, and must be loaded before use.",
	origin_tech: "combat=4;materials=3",
	icon_state: "chemcore",
});

// /obj/item/weapon/bombcore/chemical/proc/<init>  (code/game/machinery/syndicatebomb.dm:400)
rt.def("/obj/item/weapon/bombcore/chemical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "beakers", rt.list());
	return f.dot;
});

// /obj/item/weapon/bombcore/chemical/proc/detonate  (code/game/machinery/syndicatebomb.dm:408)  may sleep
rt.def("/obj/item/weapon/bombcore/chemical/proc/detonate", function* detonate(f: Frame) {
	let total_volume: Value = null, RC: Value = null, fraction: Value = null, reactants: Value = null, RC_3: Value = null, reactants_0: Value = null, G: Value = null, S: Value = null, G_2: Value = null;
	let $e: any;
	f.vars = () => [total_volume, RC, fraction, reactants, RC_3, reactants_0, G, S, G_2, $e];
	if (rt.gt(rt.sv(f, "time_release"), 0)) {
		total_volume = 0;
		RC = null;
		rt.forList(f, 0, rt.sv(f, "beakers"), T("/obj/item/weapon/reagent_containers"));
		while (($e = rt.next(f, 0)) !== undefined) {
			RC = $e;
			total_volume = rt.modify(live(total_volume), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(RC))), add);
		}
		rt.endFor(f, 0);
		if (rt.lt(live(total_volume), rt.sv(f, "time_release"))) {
			if ((truthy(rt.sv(f, "loc")) && truthy((rt.istype(rt.sv(f, "loc"), T("/obj/machinery/syndicatebomb")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "loc")]);
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
		fraction = divide(rt.sv(f, "time_release"), live(total_volume));
		rt.setFv(f, "my_atom", (reactants = (yield* g.new_(f, T("/datum/reagents"), [rt.sv(f, "time_release")]))), live(f.src));
		RC_3 = null;
		rt.forList(f, 0, rt.sv(f, "beakers"), T("/obj/item/weapon/reagent_containers"));
		while (($e = rt.next(f, 0)) !== undefined) {
			RC_3 = $e;
			yield* g.callName(f, rt.fv(f, "reagents", live(RC_3)), "trans_to", [live(reactants), multiply(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(RC_3))), live(fraction)), 1, 1, 1]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/chem_splash"), null, [rt.getStep(f, live(f.src), 0), rt.sv(f, "spread_range"), rt.list(live(reactants)), rt.sv(f, "temp_boost")]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/bombcore/chemical/proc/detonate")])), 10]);
	}
	reactants_0 = rt.list();
	G = null;
	rt.forList(f, 0, rt.sv(f, "beakers"), T("/obj/item/weapon/reagent_containers/glass"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		reactants_0 = rt.modify(live(reactants_0), rt.fv(f, "reagents", live(G)), add);
	}
	rt.endFor(f, 0);
	S = null;
	rt.forList(f, 0, rt.sv(f, "beakers"), T("/obj/item/slime_extract"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (truthy(rt.fv(f, "Uses", live(S)))) {
			G_2 = null;
			rt.forList(f, 1, rt.sv(f, "beakers"), T("/obj/item/weapon/reagent_containers/glass"));
			while (($e = rt.next(f, 1)) !== undefined) {
				G_2 = $e;
				yield* g.callName(f, rt.fv(f, "reagents", live(G_2)), "trans_to", [live(S), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(G_2)))]);
			}
			rt.endFor(f, 1);
			if (((truthy(live(S)) && truthy(rt.fv(f, "reagents", live(S)))) && truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(S)))))) {
				reactants_0 = rt.modify(live(reactants_0), rt.fv(f, "reagents", live(S)), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy((yield* g.call(f, P("/proc/chem_splash"), null, [rt.getStep(f, live(f.src), 0), rt.sv(f, "spread_range"), live(reactants_0), rt.sv(f, "temp_boost")])))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/screwdriver2.ogg"), 50, 1]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "adminlog"))) {
		yield* g.call(f, P("/proc/message_admins"), null, [rt.sv(f, "adminlog")]);
		yield* g.call(f, P("/proc/log_game"), null, [rt.sv(f, "adminlog")]);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/bamf.ogg"), 75, 1, 5]);
	if ((truthy(rt.sv(f, "loc")) && truthy((rt.istype(rt.sv(f, "loc"), T("/obj/machinery/syndicatebomb")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "loc")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/bombcore/chemical/proc/attackby  (code/game/machinery/syndicatebomb.dm:459)  may sleep
rt.def("/obj/item/weapon/bombcore/chemical/proc/attackby", function* attackby(f: Frame) {
	let B: Value = null;
	let $e: any;
	f.vars = () => [B, $e];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0)) && rt.gt(rt.len(f, rt.sv(f, "beakers")), 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		B = null;
		rt.forList(f, 0, rt.sv(f, "beakers"), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			rt.setFv(f, "loc", live(B), rt.getStep(f, live(f.src), 0));
			(rt.modSrcVar(f, "beakers", live(B), subtract));
		}
		rt.endFor(f, 0);
		return live(f.dot);
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/glass/beaker")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/glass/bottle")) ? 1 : 0)))) {
			if (rt.lt(rt.len(f, rt.sv(f, "beakers")), rt.sv(f, "max_beakers"))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				rt.modSrcVar(f, "beakers", live(f.args[0]), add);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You load ＀ with ＀.</span>", [live(f.src), live(f.args[0])])]);
				rt.setFv(f, "loc", live(f.args[0]), live(f.src));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ wont fit! The ＀ can only hold up to ＀ containers.</span>", [live(f.args[0]), live(f.src), rt.sv(f, "max_beakers")])]);
				return live(f.dot);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/bombcore/chemical/proc/CheckParts  (code/game/machinery/syndicatebomb.dm:478)  may sleep
rt.def("/obj/item/weapon/bombcore/chemical/proc/CheckParts", function* CheckParts(f: Frame) {
	let MB: Value = null, G: Value = null, LG: Value = null, S: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [MB, G, LG, S, B, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((MB = rt.locateIn(f, T("/obj/item/weapon/stock_parts/matter_bin"), live(f.src))))) {
		rt.modSrcVar(f, "max_beakers", rt.fv(f, "rating", live(MB)), add);
		yield* g.call(f, P("/proc/qdel"), null, [live(MB)]);
	}
	G = null;
	rt.forList(f, 0, live(f.src), T("/obj/item/weapon/grenade/chem_grenade"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (truthy((rt.istype(live(G), T("/obj/item/weapon/grenade/chem_grenade/large")) ? 1 : 0))) {
			LG = live(G);
			rt.modSrcVar(f, "max_beakers", 1, add);
			rt.modSrcVar(f, "spread_range", 2, add);
			rt.modSrcVar(f, "temp_boost", 50, add);
			S = null;
			rt.forList(f, 1, rt.fv(f, "beakers", live(LG)), T("/obj/item/slime_extract"));
			while (($e = rt.next(f, 1)) !== undefined) {
				S = $e;
				if (rt.lt(rt.len(f, rt.sv(f, "beakers")), rt.sv(f, "max_beakers"))) {
					rt.modSrcVar(f, "beakers", live(S), add);
					rt.setFv(f, "loc", live(S), live(f.src));
				} else {
					rt.setFv(f, "loc", live(S), rt.getStep(f, live(f.src), 0));
				}
			}
			rt.endFor(f, 1);
		}
		if (truthy((rt.istype(live(G), T("/obj/item/weapon/grenade/chem_grenade/cryo")) ? 1 : 0))) {
			(rt.modSrcVar(f, "spread_range", 1, subtract));
			(rt.modSrcVar(f, "temp_boost", 100, subtract));
		}
		if (truthy((rt.istype(live(G), T("/obj/item/weapon/grenade/chem_grenade/pyro")) ? 1 : 0))) {
			rt.modSrcVar(f, "temp_boost", 150, add);
		}
		if (truthy((rt.istype(live(G), T("/obj/item/weapon/grenade/chem_grenade/adv_release")) ? 1 : 0))) {
			rt.modSrcVar(f, "time_release", 50, add);
		}
		B = null;
		rt.forList(f, 1, live(G), T("/obj/item/weapon/reagent_containers/glass"));
		while (($e = rt.next(f, 1)) !== undefined) {
			B = $e;
			if (rt.lt(rt.len(f, rt.sv(f, "beakers")), rt.sv(f, "max_beakers"))) {
				rt.modSrcVar(f, "beakers", live(B), add);
				rt.setFv(f, "loc", live(B), live(f.src));
			} else {
				rt.setFv(f, "loc", live(B), rt.getStep(f, live(f.src), 0));
			}
		}
		rt.endFor(f, 1);
		yield* g.call(f, P("/proc/qdel"), null, [live(G)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["parts_list"] });

rt.type(9225, "/obj/item/device/syndicatedetonator", "/obj/item/device", {
	timer: 0,
	detonated: 0,
	existant: 0,
	name: "big red button",
	desc: "Your standard issue bomb synchronizing button. Five second safety delay to prevent 'accidents'",
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	icon_state: "bigred",
	item_state: "electronic",
	w_class: 1,
	origin_tech: "syndicate=3",
});

// /obj/item/device/syndicatedetonator/proc/attack_self  (code/game/machinery/syndicatebomb.dm:535)
rt.def("/obj/item/device/syndicatedetonator/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let B: Value = null, _T: Value = null, A: Value = null, log_str: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [B, _T, A, log_str, $0, $1, $e];
	if (!rt.lt(rt.sv(f, "timer"), rt.worldTime(f))) return f.dot;
	B = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/syndicatebomb"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		if (truthy(rt.fv(f, "active", live(B)))) {
			rt.setFv(f, "detonation_timer", live(B), add(rt.worldTime(f), 50));
			rt.incSrcVar(f, "detonated", 1, true);
		}
		rt.incSrcVar(f, "existant", 1, true);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/machines/click.ogg"), 20, 1]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ found, ＀ triggered.</span>", [rt.sv(f, "existant"), rt.sv(f, "detonated")])]);
	if (truthy(rt.sv(f, "detonated"))) {
		_T = rt.getStep(f, live(f.src), 0);
		A = rt.call(f, P("/proc/get_area"), null, [live(_T)]);
		rt.incSrcVar(f, "detonated", -1, true);
		$0 = fmt("＀＀ ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(user)]), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
		if (truthy(rt.sv(f, "detonated"))) {
			$1 = "syndicate bombs";
		} else {
			$1 = "a syndicate bomb";
		}
		rt.modGl("bombers", (log_str = fmt("＀ has remotely detonated ＀ using a ＀ at ＀ ＀</a>.", [$0, $1, rt.sv(f, "name"), rt.fv(f, "name", live(A)), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])), add);
		rt.call(f, P("/proc/message_admins"), null, [live(log_str)]);
		$0 = rt.call(f, P("/proc/key_name"), null, [live(user)]);
		if (truthy(rt.sv(f, "detonated"))) {
			$1 = "syndicate bombs";
		} else {
			$1 = "a syndicate bomb";
		}
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ has remotely detonated ＀ using a ＀ at ＀＀", [$0, $1, rt.sv(f, "name"), rt.fv(f, "name", live(A)), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
	}
	rt.setSv(f, "detonated", 0);
	rt.setSv(f, "existant", 0);
	rt.setSv(f, "timer", add(rt.worldTime(f), 60));
	return f.dot;
});
