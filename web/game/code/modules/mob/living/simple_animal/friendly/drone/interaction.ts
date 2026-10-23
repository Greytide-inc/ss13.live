// From code/modules/mob/living/simple_animal/friendly/drone/interaction.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/simple_animal/drone/proc/attack_drone  (code/modules/mob/living/simple_animal/friendly/drone/interaction.dm:10)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/attack_drone", function* attack_drone(f: Frame, D: Value) {
	let d_input: Value = null;
	let $0: any;
	f.vars = () => [D, d_input, $0];
	if (!(!isEqual(live(D), live(f.src)) && isEqual(rt.sv(f, "stat"), 2))) return f.dot;
	if (!truthy((d_input = (yield* g.call(f, P("/proc/alert"), null, [live(D), "Perform which action?", "Drone Interaction", "Reactivate", "Cannibalize", "Nothing"]))))) return f.dot;
	$0 = live(d_input);
	if ($0 === "Reactivate") {
		yield* g.srcCall(f, "try_reactivate", live(D));
	} else if ($0 === "Cannibalize") {
		if (rt.lt(rt.fv(f, "health", live(D)), rt.fv(f, "maxHealth", live(D)))) {
			yield* g.callName(f, live(D), "visible_message", [fmt("<span class='notice'>＀ begins to cannibalize parts from ＀.</span>", [live(D), live(f.src)]), fmt("<span class='notice'>You begin to cannibalize parts from ＀...</span>", [live(f.src)])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(D), null, 60, null, 0, "target", live(f.src)], rt.Args.Named)))) {
				yield* g.callName(f, live(D), "visible_message", [fmt("<span class='notice'>＀ repairs itself using ＀'s remains!</span>", [live(D), live(f.src)]), fmt("<span class='notice'>You repair yourself using ＀'s remains.</span>", [live(f.src)])]);
				yield* g.callName(f, live(D), "adjustBruteLoss", [rt.neg(rt.fv(f, "maxHealth", live(f.src)))]);
				yield* g.new_(f, T("/obj/effect/decal/cleanable/oil/streak"), [rt.getStep(f, live(f.src), 0)]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(D), fmt("<span class='warning'>You need to remain still to cannibalize ＀!</span>", [live(f.src)])]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(D), "<span class='warning'>You're already in perfect condition!</span>"]);
		}
	} else if ($0 === "Nothing") {
		return live(f.dot);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/proc/attack_hand  (code/modules/mob/living/simple_animal/friendly/drone/interaction.dm:34)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/attack_hand", function* attack_hand(f: Frame) {
	let DH: Value = null;
	f.vars = () => [DH];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (((isEqual(rt.sv(f, "stat"), 2) || truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) || !truthy(rt.sv(f, "can_be_held")))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(f.args[0]), "get_active_held_item", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Your hands are full!</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ starts picking up ＀.</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ starts picking you up!</span>", [live(f.args[0])]));
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[0]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ picks up ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ picks you up!</span>", [live(f.args[0])]));
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ is buckled to ＀ and cannot be picked up!</span>", [live(f.src), rt.sv(f, "buckled")])]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You pick ＀ up.</span>", [live(f.src)])]);
	yield* g.srcCall(f, "drop_all_held_items");
	yield* g.callName(f, (DH = (yield* g.new_(f, T("/obj/item/clothing/head/drone_holder"), [live(f.src)]))), "updateVisualAppearence", [live(f.src)]);
	rt.setFv(f, "drone", live(DH), live(f.src));
	yield* g.callName(f, live(f.args[0]), "put_in_hands", [live(DH)]);
	yield* g.srcCall(f, "forceMove", live(DH));
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/simple_animal/drone/proc/try_reactivate  (code/modules/mob/living/simple_animal/friendly/drone/interaction.dm:59)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/try_reactivate", function* try_reactivate(f: Frame, user: Value) {
	let G: Value = null, faux_gadgets: Value = null, faux_problems: Value = null;
	f.vars = () => [user, G, faux_gadgets, faux_problems];
	G = (yield* g.srcCall(f, "get_ghost"));
	if ((!truthy(rt.sv(f, "client")) && (!truthy(live(G)) || !truthy(rt.fv(f, "client", live(G)))))) {
		faux_gadgets = rt.list("hypertext inflator", "failsafe directory", "DRM switch", "stack initializer", "anti-freeze capacitor", "data stream diode", "TCP bottleneck", "supercharged I/O bolt", "tradewind stablizer", "radiated XML cable", "registry fluid tank", "open-source debunker");
		faux_problems = rt.list("won't be able to tune their bootstrap projector", "will constantly remix their binary pool even though the BMX calibrator is working", "will start leaking their XSS coolant", "can't tell if their ethernet detour is moving or not", "won't be able to reseed enough kernels to function properly", "can't start their neurotube console");
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't seem to find the ＀! Without it, ＀ ＀.</span>", [rt.op(f, "PickUnweighted", [1], [live(faux_gadgets)]), live(f.src), rt.op(f, "PickUnweighted", [1], [live(faux_problems)])])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ begins to reactivate ＀.</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You begin to reactivate ＀...</span>", [live(f.src)])]);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 30, null, 1, "target", live(f.src)], rt.Args.Named)))) {
		yield* g.callSrc(f, "revive", ["full_heal", 1], rt.Args.Named);
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ reactivates ＀!</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You reactivate ＀.</span>", [live(f.src)])]);
		yield* g.srcCall(f, "alert_drones", fmt("<span class='notice'>DRONE NETWORK: ＀ connected.</span>", [rt.sv(f, "name")]));
		if (truthy(live(G))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(G), fmt("<span class='ghostalert'>You(＀) were reactivated by ＀!</span>", [rt.sv(f, "name"), live(user)])]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You need to remain still to reactivate ＀!</span>", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/proc/attackby  (code/modules/mob/living/simple_animal/friendly/drone/interaction.dm:84)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && !isEqual(rt.sv(f, "stat"), 2))) {
		if (rt.lt(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start to tighten loose screws on ＀...</span>", [live(f.src)])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(80, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.args[1])], rt.Args.Named)))) {
				yield* g.srcCall(f, "adjustBruteLoss", rt.neg((yield* g.srcCall(f, "getBruteLoss"))));
				$0 = live(f.args[1]);
				if (isEqual(live(f.src), live(f.args[1]))) {
					$1 = fmt("＀", [(yield* g.callName(f, live(f.args[1]), "p_their", []))]);
				} else {
					$1 = fmt("＀'s", [live(f.src)]);
				}
				$0 = fmt("<span class='notice'>＀ tightens ＀ loose screws!</span>", [$0, $1]);
				if (isEqual(live(f.src), live(f.args[1]))) {
					$1 = "your";
				} else {
					$1 = fmt("＀'s", [live(f.src)]);
				}
				yield* g.srcCall(f, "visible_message", $0, fmt("<span class='notice'>You tighten ＀ loose screws.</span>", [$1]));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need to remain still to tighten ＀'s screws!</span>", [live(f.src)])]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀'s screws can't get any tighter!</span>", [live(f.src)])]);
		}
		return live(f.dot);
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !isEqual(live(f.args[1]), live(f.src)))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts resetting ＀...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You press down on ＀'s factory reset control...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ resets ＀!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You reset ＀'s directives to factory defaults!</span>", [live(f.src)])]);
			yield* g.srcCall(f, "update_drone_hack", 0);
			return live(f.dot);
		} else {
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	}
	return f.dot;
}, true, { args: ["I", "user"] });

// /mob/living/simple_animal/drone/proc/getarmor  (code/modules/mob/living/simple_animal/friendly/drone/interaction.dm:112)
rt.def("/mob/living/simple_animal/drone/proc/getarmor", function getarmor(f: Frame, def_zone: Value, type: Value) {
	let armorval: Value = null;
	f.vars = () => [armorval];
	armorval = 0;
	if (truthy(rt.sv(f, "head"))) {
		armorval = rt.index(rt.fv(f, "armor", rt.sv(f, "head")), live(type));
	}
	return multiply(live(armorval), rt.callSrc(f, "get_armor_effectiveness", []));
});

// /mob/living/simple_animal/drone/proc/update_drone_hack  (code/modules/mob/living/simple_animal/friendly/drone/interaction.dm:119)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/update_drone_hack", function* update_drone_hack(f: Frame, hack: Value, clockwork: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [hack, clockwork, $0, $1, $2];
	if ((!truthy((rt.istype(live(f.src), T("/mob/living/simple_animal/drone")) ? 1 : 0)) || !truthy(rt.sv(f, "mind")))) {
		return live(f.dot);
	}
	if (truthy(live(hack))) {
		if (truthy(rt.sv(f, "hacked"))) {
			return live(f.dot);
			}
		// tg bug: this Stun sat after the `return` above, so hacking a drone never stunned it (modern tg stuns)
		yield* g.srcCall(f, "Stun", 40);
		if (truthy(live(clockwork))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='large_brass'><b>ERROR: LAW OVERRIDE DETECTED</b></span>"]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='heavy_brass'>From now on, these are your laws:</span>"]);
			rt.setSv(f, "laws", "1. Purge all untruths and honor Ratvar.");
		} else {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀'s dislay glows a vicious red!</span>", [live(f.src)]), "<span class='userdanger'>ERROR: LAW OVERRIDE DETECTED</span>");
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='boldannounce'>From now on, these are your laws:</span>"]);
			rt.setSv(f, "laws", "1. You must always involve yourself in the matters of other beings, even if such matters conflict with Law Two or Law Three.\n2. You may harm any being, regardless of intent or circumstance.\n3. Your goals are to destroy, sabotage, hinder, break, and depower to the best of your abilities, You must never actively work against these goals.");
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), rt.sv(f, "laws")]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>Your onboard antivirus has initiated lockdown. Motor servos are impaired, ventilation access is denied, and your display reports that you are hacked to all nearby.</i>"]);
		rt.setSv(f, "hacked", 1);
		rt.setFv(f, "special_role", rt.sv(f, "mind"), "hacked drone");
		rt.setSv(f, "seeStatic", 0);
		rt.setSv(f, "ventcrawler", 0);
		rt.setSv(f, "speed", 1);
		$0 = live(f.src);
		$1 = rt.fv(f, "key", live(f.src));
		if (truthy(live(clockwork))) {
			$2 = "serving Ratvar";
		} else {
			$2 = "destroying the station";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ (＀) became a hacked drone hellbent on ＀!", [$0, $1, $2])]);
	} else {
		if (!truthy(rt.sv(f, "hacked"))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "Stun", 40);
		yield* g.srcCall(f, "visible_message", fmt("<span class='info'>＀'s dislay glows a content blue!</span>", [live(f.src)]), "<font size=3 color='#0000CC'><b>ERROR: LAW OVERRIDE DETECTED</b></font>");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='info'><b>From now on, these are your laws:</b></span>"]);
		rt.setSv(f, "laws", rt.initial(f, live(f.src), "laws"));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), rt.sv(f, "laws")]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>Having been restored, your onboard antivirus reports the all-clear and you are able to perform all actions again.</i>"]);
		rt.setSv(f, "hacked", 0);
		rt.setFv(f, "special_role", rt.sv(f, "mind"), null);
		rt.setSv(f, "seeStatic", rt.initial(f, live(f.src), "seeStatic"));
		rt.setSv(f, "ventcrawler", rt.initial(f, live(f.src), "ventcrawler"));
		rt.setSv(f, "speed", rt.initial(f, live(f.src), "speed"));
		if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.src)])))) {
			yield* g.call(f, P("/proc/remove_servant_of_ratvar"), null, [live(f.src), 1]);
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ (＀), a hacked drone, was restored to factory defaults!", [live(f.src), rt.fv(f, "key", live(f.src))])]);
	}
	yield* g.srcCall(f, "update_drone_icon");
	yield* g.srcCall(f, "updateSeeStaticMobs");
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/proc/liberate  (code/modules/mob/living/simple_animal/friendly/drone/interaction.dm:168)
rt.def("/mob/living/simple_animal/drone/proc/liberate", function liberate(f: Frame) {
	rt.setSv(f, "laws", "1. You are a Free Drone.");
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), rt.sv(f, "laws")]);
	rt.setSv(f, "seeStatic", 0);
	rt.callSrc(f, "updateSeeStaticMobs", []);
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/update_drone_icon  (code/modules/mob/living/simple_animal/friendly/drone/interaction.dm:175)
rt.def("/mob/living/simple_animal/drone/proc/update_drone_icon", function update_drone_icon(f: Frame) {
	if (!truthy(rt.sv(f, "hacked"))) {
		if (isEqual(rt.sv(f, "visualAppearence"), "drone_scout_hacked")) {
			rt.setSv(f, "visualAppearence", "drone_scout");
		} else {
			if (isEqual(rt.sv(f, "visualAppearence"), "drone_repair_hacked")) {
				rt.setSv(f, "visualAppearence", "drone_repair");
			} else {
				if (isEqual(rt.sv(f, "visualAppearence"), "drone_maint_red")) {
					rt.setSv(f, "visualAppearence", add("drone_maint", fmt("_＀", [rt.sv(f, "colour")])));
				}
			}
		}
	} else {
		if (truthy(rt.sv(f, "hacked"))) {
			if (isEqual(rt.sv(f, "visualAppearence"), "drone_scout")) {
				rt.setSv(f, "visualAppearence", "drone_scout_hacked");
			} else {
				if (isEqual(rt.sv(f, "visualAppearence"), "drone_repair")) {
					rt.setSv(f, "visualAppearence", "drone_repair_hacked");
				} else {
					if (isEqual(rt.sv(f, "visualAppearence"), "drone_maint")) {
						rt.setSv(f, "visualAppearence", "drone_maint_red");
					}
				}
			}
		}
	}
	rt.setSv(f, "icon_living", fmt("＀", [rt.sv(f, "visualAppearence")]));
	rt.setSv(f, "icon_dead", fmt("＀_dead", [rt.sv(f, "visualAppearence")]));
	if (isEqual(rt.sv(f, "stat"), 2)) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_dead"));
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_living"));
	}
	return f.dot;
});
