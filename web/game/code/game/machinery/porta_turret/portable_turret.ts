// From code/game/machinery/porta_turret/portable_turret.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10750, "/obj/machinery/porta_turret", "/obj/machinery", {
	base_icon_state: "standard",
	emp_vunerable: 1,
	scan_range: 7,
	base: null,
	raised: 0,
	raising: 0,
	locked: 1,
	controllock: 0,
	installation: rt.typePath("/obj/item/weapon/gun/energy/e_gun/turret"),
	stored_gun: null,
	gun_charge: 0,
	mode: 0,
	stun_projectile: null,
	stun_projectile_sound: null,
	lethal_projectile: null,
	lethal_projectile_sound: null,
	reqpower: 500,
	always_up: 0,
	has_cover: 1,
	cover: null,
	last_fired: 0,
	shot_delay: 15,
	check_records: 1,
	criminals: 1,
	auth_weapons: 0,
	stun_all: 0,
	check_anomalies: 1,
	attacked: 0,
	on: 1,
	faction: "turret",
	spark_system: null,
	cp: null,
	anchored: 1,
	name: "turret",
	icon: rt.rsc("icons/obj/turrets.dmi"),
	icon_state: "turretCover",
	layer: 3,
	invisibility: 60,
	density: 1,
	use_power: 1,
	idle_power_usage: 50,
	active_power_usage: 300,
	req_access: null,
	power_channel: 1,
	obj_integrity: 160,
	max_integrity: 160,
	integrity_failure: 80,
	armor: null,
});

// /obj/machinery/porta_turret/proc/<init>  (code/game/machinery/porta_turret/portable_turret.dm:18)
rt.def("/obj/machinery/porta_turret/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(1));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 30, "laser", 30, "energy", 30, "bomb", 30, "bio", 0, "rad", 0, "fire", 90, "acid", 90]));
	return f.dot;
});

// /obj/machinery/porta_turret/proc/New  (code/game/machinery/porta_turret/portable_turret.dm:77)  may sleep
rt.def("/obj/machinery/porta_turret/proc/New", function* New(f: Frame) {
	let base: Value = null;
	f.vars = () => [base];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "base"))) {
		rt.setSv(f, "base", live(f.src));
	}
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "spark_system", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	yield* g.callName(f, rt.sv(f, "spark_system"), "set_up", [5, 0, live(f.src)]);
	yield* g.callName(f, rt.sv(f, "spark_system"), "attach", [live(f.src)]);
	yield* g.srcCall(f, "setup");
	if (truthy(rt.sv(f, "has_cover"))) {
		rt.setSv(f, "cover", (yield* g.new_(f, T("/obj/machinery/porta_turret_cover"), [live(f.args[0])])));
		rt.setFv(f, "parent_turret", rt.sv(f, "cover"), live(f.src));
		rt.setFv(f, "layer", (base = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/turrets.dmi"), "basedark"]))), 3.5);
		rt.modSrcVar(f, "underlays", live(base), add);
	}
	if (truthy(rt.sv(f, "has_cover"))) return f.dot;
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/machinery/porta_turret/proc/popUp")]);
	return f.dot;
}, true, { args: ["loc"] });

// /obj/machinery/porta_turret/proc/update_icon  (code/game/machinery/porta_turret/portable_turret.dm:97)
rt.def("/obj/machinery/porta_turret/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "anchored"))) {
		rt.setSv(f, "icon_state", "turretCover");
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.setSv(f, "icon_state", fmt("＀_broken", [rt.sv(f, "base_icon_state")]));
	} else {
		if (truthy(rt.callSrc(f, "powered", []))) {
			if ((truthy(rt.sv(f, "on")) && truthy(rt.sv(f, "raised")))) {
				$0 = rt.sv(f, "mode");
				if ($0 === 0) {
					rt.setSv(f, "icon_state", fmt("＀_stun", [rt.sv(f, "base_icon_state")]));
				} else if ($0 === 1) {
					rt.setSv(f, "icon_state", fmt("＀_lethal", [rt.sv(f, "base_icon_state")]));
				}
			} else {
				rt.setSv(f, "icon_state", fmt("＀_off", [rt.sv(f, "base_icon_state")]));
			}
		} else {
			rt.setSv(f, "icon_state", fmt("＀_unpowered", [rt.sv(f, "base_icon_state")]));
		}
	}
	return f.dot;
});

// /obj/machinery/porta_turret/proc/setup  (code/game/machinery/porta_turret/portable_turret.dm:119)  may sleep
rt.def("/obj/machinery/porta_turret/proc/setup", function* setup(f: Frame, turret_gun: Value) {
	let gun_properties: Value = null;
	f.vars = () => [turret_gun, gun_properties];
	if (truthy(rt.sv(f, "stored_gun"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "stored_gun")]);
		rt.setSv(f, "stored_gun", null);
	}
	if ((truthy(rt.sv(f, "installation")) && !truthy(live(turret_gun)))) {
		rt.setSv(f, "stored_gun", (yield* g.new_(f, rt.sv(f, "installation"), [live(f.src)])));
	} else {
		if (truthy(live(turret_gun))) {
			rt.setSv(f, "stored_gun", live(turret_gun));
		}
	}
	rt.setSv(f, "stun_projectile", rt.index((gun_properties = (yield* g.callName(f, rt.sv(f, "stored_gun"), "get_turret_properties", []))), "stun_projectile"));
	rt.setSv(f, "stun_projectile_sound", rt.at(live(gun_properties), "stun_projectile_sound"));
	rt.setSv(f, "lethal_projectile", rt.at(live(gun_properties), "lethal_projectile"));
	rt.setSv(f, "lethal_projectile_sound", rt.at(live(gun_properties), "lethal_projectile_sound"));
	rt.setSv(f, "base_icon_state", rt.at(live(gun_properties), "base_icon_state"));
	if (truthy(rt.at(live(gun_properties), "shot_delay"))) {
		rt.setSv(f, "shot_delay", rt.at(live(gun_properties), "shot_delay"));
	}
	if (truthy(rt.at(live(gun_properties), "reqpower"))) {
		rt.setSv(f, "reqpower", rt.at(live(gun_properties), "reqpower"));
	}
	yield* g.srcCall(f, "update_icon");
	return live(gun_properties);
}, true);

// /obj/machinery/porta_turret/proc/Destroy  (code/game/machinery/porta_turret/portable_turret.dm:148)  may sleep
rt.def("/obj/machinery/porta_turret/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "cover"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cover")]);
		rt.setSv(f, "cover", null);
	}
	rt.setSv(f, "base", null);
	if (truthy(rt.sv(f, "cp"))) {
		(rt.modField(f, rt.sv(f, "cp"), "turrets", live(f.src), subtract));
		rt.setSv(f, "cp", null);
	}
	if (truthy(rt.sv(f, "stored_gun"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "stored_gun")]);
		rt.setSv(f, "stored_gun", null);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "spark_system")]);
	rt.setSv(f, "spark_system", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/porta_turret/proc/attack_ai  (code/game/machinery/porta_turret/portable_turret.dm:163)  may sleep
rt.def("/obj/machinery/porta_turret/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/porta_turret/proc/attack_hand  (code/game/machinery/porta_turret/portable_turret.dm:166)  may sleep
rt.def("/obj/machinery/porta_turret/proc/attack_hand", function* attack_hand(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/porta_turret/proc/interact  (code/game/machinery/porta_turret/portable_turret.dm:174)  may sleep
rt.def("/obj/machinery/porta_turret/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, dat, popup, $0, $1];
	dat = null;
	$0 = live(f.src);
	if (truthy(rt.sv(f, "on"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	dat = rt.modify(live(dat), fmt("Status: <a href='?src=＃;power=1'>＀</a><br>", [$0, $1]), add);
	if (truthy(rt.sv(f, "locked"))) {
		$0 = "locked";
	} else {
		$0 = "unlocked";
	}
	dat = rt.modify(live(dat), fmt("Behaviour controls are ＀<br>", [$0]), add);
	if (!truthy(rt.sv(f, "locked"))) {
		$0 = live(f.src);
		if (truthy(rt.sv(f, "auth_weapons"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Check for Weapon Authorization: <A href='?src=＃;operation=authweapon'>＀</A><BR>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "check_records"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Check Security Records: <A href='?src=＃;operation=checkrecords'>＀</A><BR>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "criminals"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Neutralize Identified Criminals: <A href='?src=＃;operation=shootcrooks'>＀</A><BR>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "stun_all"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Neutralize All Non-Security and Non-Command Personnel: <A href='?src=＃;operation=shootall'>＀</A><BR>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "check_anomalies"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Neutralize All Unidentified Life Signs: <A href='?src=＃;operation=checkxenos'>＀</A><BR>", [$0, $1]), add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "autosec", "Automatic Portable Turret Installation", 300, 300]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/porta_turret/proc/Topic  (code/game/machinery/porta_turret/portable_turret.dm:189)  may sleep
rt.def("/obj/machinery/porta_turret/proc/Topic", function* Topic(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	if ((truthy(rt.at(live(f.args[1]), "power")) && !truthy(rt.sv(f, "locked")))) {
		if (truthy(rt.sv(f, "anchored"))) {
			rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>It has to be secured first!</span>"]);
		}
		yield* g.srcCall(f, "interact", live(f.usr));
		return live(f.dot);
	}
	if (!truthy(rt.at(live(f.args[1]), "operation"))) return f.dot;
	$0 = rt.at(live(f.args[1]), "operation");
	if ($0 === "authweapon") {
		rt.setSv(f, "auth_weapons", (!truthy(rt.sv(f, "auth_weapons")) ? 1 : 0));
	} else if ($0 === "checkrecords") {
		rt.setSv(f, "check_records", (!truthy(rt.sv(f, "check_records")) ? 1 : 0));
	} else if ($0 === "shootcrooks") {
		rt.setSv(f, "criminals", (!truthy(rt.sv(f, "criminals")) ? 1 : 0));
	} else if ($0 === "shootall") {
		rt.setSv(f, "stun_all", (!truthy(rt.sv(f, "stun_all")) ? 1 : 0));
	} else if ($0 === "checkxenos") {
		rt.setSv(f, "check_anomalies", (!truthy(rt.sv(f, "check_anomalies")) ? 1 : 0));
	}
	yield* g.srcCall(f, "interact", live(f.usr));
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/porta_turret/proc/power_change  (code/game/machinery/porta_turret/portable_turret.dm:217)
rt.def("/obj/machinery/porta_turret/proc/power_change", function power_change(f: Frame) {
	if (!truthy(rt.sv(f, "anchored"))) {
		rt.callSrc(f, "update_icon", []);
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.callSrc(f, "update_icon", []);
	} else {
		if (truthy(rt.callSrc(f, "powered", []))) {
			(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
			rt.callSrc(f, "update_icon", []);
		} else {
			rt.spawnTail(f, rt.call(f, P("/proc/rand"), null, [0, 15]), "/obj/machinery/porta_turret/proc/power_change: spawn at game/machinery/porta_turret/portable_turret.dm:225");
		}
	}
	return f.dot;
});

// a spawn(rt.call(f, P("/proc/rand"), null, [0, 15])) body of /obj/machinery/porta_turret/proc/power_change, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret/proc/power_change: spawn at game/machinery/porta_turret/portable_turret.dm:225", function* (f: Frame) {
	(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	yield* g.srcCall(f, "update_icon");
	return null;
});

// /obj/machinery/porta_turret/proc/attackby  (code/game/machinery/porta_turret/portable_turret.dm:233)  may sleep
rt.def("/obj/machinery/porta_turret/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null;
	let $0: any, $1: any;
	f.vars = () => [M, $0, $1];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You begin prying the metal coverings off...</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if (truthy(rt.op(f, "Prob", [], [70]))) {
					if (truthy(rt.sv(f, "stored_gun"))) {
						yield* g.callName(f, rt.sv(f, "stored_gun"), "forceMove", [rt.sv(f, "loc")]);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the turret and salvage some components.</span>"]);
					if (truthy(rt.op(f, "Prob", [], [50]))) {
						yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), (yield* g.call(f, P("/proc/rand"), null, [1, 4]))]);
					}
					if (truthy(rt.op(f, "Prob", [], [50]))) {
						yield* g.new_(f, T("/obj/item/device/assembly/prox_sensor"), [rt.sv(f, "loc")]);
					}
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the turret but did not manage to salvage anything.</span>"]);
				}
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		}
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.sv(f, "on")))) {
			if (truthy(rt.sv(f, "raised"))) {
				return live(f.dot);
			}
			if ((!truthy(rt.sv(f, "anchored")) && !truthy((yield* g.srcCall(f, "isinspace"))))) {
				rt.setSv(f, "anchored", 1);
				rt.setSv(f, "invisibility", 100);
				yield* g.srcCall(f, "update_icon");
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You secure the exterior bolts on the turret.</span>"]);
				if (truthy(rt.sv(f, "has_cover"))) {
					rt.setSv(f, "cover", (yield* g.new_(f, T("/obj/machinery/porta_turret_cover"), [rt.sv(f, "loc")])));
					rt.setFv(f, "parent_turret", rt.sv(f, "cover"), live(f.src));
				}
			} else {
				if (truthy(rt.sv(f, "anchored"))) {
					rt.setSv(f, "anchored", 0);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unsecure the exterior bolts on the turret.</span>"]);
					yield* g.srcCall(f, "update_icon");
					rt.setSv(f, "invisibility", 0);
					yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cover")]);
				}
			}
		} else {
			if (truthy((yield* g.callName(f, live(f.args[0]), "GetID", [])))) {
				if (truthy((yield* g.srcCall(f, "allowed", live(f.args[1]))))) {
					rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
					$0 = live(f.args[1]);
					if (truthy(rt.sv(f, "locked"))) {
						$1 = "locked";
					} else {
						$1 = "unlocked";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Controls are now ＀.</span>", [$1])]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Access denied.</span>"]);
				}
			} else {
				if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0)) && !truthy(rt.sv(f, "locked")))) {
					rt.setFv(f, "buffer", (M = live(f.args[0])), live(f.src));
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to multitool buffer.</span>", [live(f.src)])]);
				} else {
					return (yield* g.callSuper(f, [], rt.Args.Same));
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/porta_turret/proc/emag_act  (code/game/machinery/porta_turret/portable_turret.dm:286)  may sleep
rt.def("/obj/machinery/porta_turret/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You short out ＀'s threat assessment circuits.</span>", [live(f.src)])]);
	yield* g.srcCall(f, "visible_message", fmt("＀ hums oddly...", [live(f.src)]));
	rt.setSv(f, "emagged", 1);
	rt.setSv(f, "controllock", 1);
	rt.setSv(f, "on", 0);
	yield* g.srcCall(f, "update_icon");
	yield* g.call(f, P("/proc/sleep"), null, [60]);
	rt.setSv(f, "on", 1);
	return f.dot;
}, true);

// /obj/machinery/porta_turret/proc/emp_act  (code/game/machinery/porta_turret/portable_turret.dm:298)  may sleep
rt.def("/obj/machinery/porta_turret/proc/emp_act", function* emp_act(f: Frame) {
	if ((truthy(rt.sv(f, "on")) && truthy(rt.sv(f, "emp_vunerable")))) {
		rt.setSv(f, "check_records", rt.op(f, "PickUnweighted", [2], [0, 1]));
		rt.setSv(f, "criminals", rt.op(f, "PickUnweighted", [2], [0, 1]));
		rt.setSv(f, "auth_weapons", rt.op(f, "PickUnweighted", [2], [0, 1]));
		rt.setSv(f, "stun_all", rt.op(f, "PickUnweighted", [5], [0, 0, 0, 0, 1]));
		rt.setSv(f, "on", 0);
		rt.spawnTail(f, (yield* g.call(f, P("/proc/rand"), null, [60, 600])), "/obj/machinery/porta_turret/proc/emp_act: spawn at game/machinery/porta_turret/portable_turret.dm:304");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// a spawn((yield* g.call(f, P("/proc/rand"), null, [60, 600]))) body of /obj/machinery/porta_turret/proc/emp_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret/proc/emp_act: spawn at game/machinery/porta_turret/portable_turret.dm:304", function* (f: Frame) {
	if (!truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "on", 1);
	}
	return null;
});

// /obj/machinery/porta_turret/proc/take_damage  (code/game/machinery/porta_turret/portable_turret.dm:314)  may sleep
rt.def("/obj/machinery/porta_turret/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
	}
	if (!((truthy(rt.sv(f, "on")) && !truthy(rt.sv(f, "attacked"))) && !truthy(rt.sv(f, "emagged")))) return f.dot;
	rt.setSv(f, "attacked", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/porta_turret/proc/reset_attacked")])), 60]);
	return f.dot;
}, true, { args: ["damage", "damage_type", "damage_flag", "sound_effect"] });

// /obj/machinery/porta_turret/proc/deconstruct  (code/game/machinery/porta_turret/portable_turret.dm:326)  may sleep
rt.def("/obj/machinery/porta_turret/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/porta_turret/proc/obj_break  (code/game/machinery/porta_turret/portable_turret.dm:329)  may sleep
rt.def("/obj/machinery/porta_turret/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if (!(!truthy(rt.bitAnd(rt.sv(f, "flags"), 128)) && !truthy(rt.bitAnd(rt.sv(f, "stat"), 1)))) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "invisibility", 0);
	yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cover")]);
	return f.dot;
}, true);

// /obj/machinery/porta_turret/proc/process  (code/game/machinery/porta_turret/portable_turret.dm:342)  may sleep
rt.def("/obj/machinery/porta_turret/proc/process", function* process(f: Frame) {
	let targets: Value = null;
	f.vars = () => [targets];
	if ((rt.sv(f, "cover") === null && truthy(rt.sv(f, "anchored")))) {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cover")]);
		} else {
			if (truthy(rt.sv(f, "has_cover"))) {
				rt.setSv(f, "cover", (yield* g.new_(f, T("/obj/machinery/porta_turret_cover"), [rt.sv(f, "loc")])));
				rt.setFv(f, "parent_turret", rt.sv(f, "cover"), live(f.src));
			}
		}
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		if (!truthy(rt.sv(f, "always_up"))) {
			yield* g.srcCall(f, "popDown");
		}
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "on"))) {
		if (!truthy(rt.sv(f, "always_up"))) {
			yield* g.srcCall(f, "popDown");
		}
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "tryToShootAt", (targets = (yield* g.srcCall(f, "calculate_targets"))))))) return f.dot;
	if (truthy(rt.sv(f, "always_up"))) return f.dot;
	yield* g.srcCall(f, "popDown");
	return f.dot;
}, true, { waitfor: false });

// Speed: true if some candidate (carbon, simple_animal when check_anomalies, mecha) might be inside view(scan_range, base): same z and
// within scan_range of base's turf (view is a square box). Conservative: any doubt (base not on a turf) says true.
// Reads the atoms' loc/x/y/z/type directly (a turf has x > 0; the loc chain leads from a mob in a locker to its turf), which
// is much cheaper than rt.fv per field over the whole mob list.
const turretTypeOk = new Map();
function turretTypeCand(t: any, T0: any, T1: any, anom: any) {
	let r = turretTypeOk.get(t);
	if (r === undefined) { r = t.isSubtypeOf(T0) ? 1 : (t.isSubtypeOf(T1) ? 2 : 0); turretTypeOk.set(t, r); }
	return r === 1 || (r === 2 && anom);
}
function turretTurf(o: any) {
	let t = o;
	for (let i = 0; i < 20 && t !== null && t !== undefined && t.x === 0; i++) t = t.loc;
	return t === undefined ? null : t;
}
function turretHasCandidate(f: Frame) {
	const bt = turretTurf(live(rt.sv(f, "base")));
	if (bt === null || !(bt.x > 0)) return true;
	const r = rt.sv(f, "scan_range");
	if (typeof r !== "number") return true;
	const bx = bt.x, by = bt.y, bz = bt.z;
	const anom = truthy(rt.sv(f, "check_anomalies"));
	const carbonT = T("/mob/living/carbon"), saT = T("/mob/living/simple_animal");
	const ml: any = live(rt.gl("mob_list"));
	const items = ml.items;
	for (let i = 0; i < items.length; i++) {
		const m = items[i];
		if (m === null || typeof m !== "object" || m.deleted || !turretTypeCand(m.type, carbonT, saT, anom)) continue;
		const t = turretTurf(m);
		if (t !== null && t.z === bz && Math.abs(t.x - bx) <= r && Math.abs(t.y - by) <= r) return true;
	}
	const mechs: any = live(rt.gl("mechas_list"));
	const mi = mechs.items;
	for (let i = 0; i < mi.length; i++) {
		const m = mi[i];
		if (m === null || typeof m !== "object" || m.deleted) continue;
		const t = turretTurf(m);
		if (t !== null && t.z === bz && Math.abs(t.x - bx) <= r && Math.abs(t.y - by) <= r) return true;
	}
	return false;
}

// /obj/machinery/porta_turret/proc/calculate_targets  (code/game/machinery/porta_turret/portable_turret.dm:369)
rt.def("/obj/machinery/porta_turret/proc/calculate_targets", function calculate_targets(f: Frame) {
	let targets: Value = null, turretview: Value = null, A: Value = null, AA: Value = null, SA: Value = null, C: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [targets, turretview, A, AA, SA, C, M, $e];
	targets = rt.list();
	if (!turretHasCandidate(f)) return live(targets);
	turretview = rt.call(f, P("/proc/view"), null, [rt.sv(f, "scan_range"), rt.sv(f, "base")]);
	A = null;
	rt.forList(f, 0, live(turretview));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (rt.gt(rt.gv(f, "invisibility", (AA = live(A))), 25)) {
			continue;
		}
		if (truthy(rt.sv(f, "check_anomalies"))) {
			if (truthy((rt.istype(live(A), T("/mob/living/simple_animal")) ? 1 : 0))) {
				if ((truthy(rt.gv(f, "stat", (SA = live(A)))) || truthy(rt.callSrc(f, "in_faction", [live(SA)])))) {
					continue;
				}
				targets = rt.modify(live(targets), live(SA), add);
			}
		}
		if (truthy((rt.istype(live(A), T("/mob/living/carbon")) ? 1 : 0))) {
			C = live(A);
			if ((!isEqual(rt.sv(f, "mode"), 1) && ((truthy(rt.fv(f, "stat", live(C))) || truthy(rt.fv(f, "handcuffed", live(C)))) || truthy(rt.fv(f, "lying", live(C)))))) {
				continue;
			}
			if ((isEqual(rt.sv(f, "mode"), 1) && isEqual(rt.fv(f, "stat", live(C)), 2))) {
				continue;
			}
			if ((truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy(rt.callSrc(f, "in_faction", [live(C)])))) {
				if (rt.ge(rt.callSrc(f, "assess_perp", [live(C)]), 4)) {
					targets = rt.modify(live(targets), live(C), add);
				}
			} else {
				if (truthy(rt.sv(f, "check_anomalies"))) {
					if (!truthy(rt.callSrc(f, "in_faction", [live(C)]))) {
						targets = rt.modify(live(targets), live(C), add);
					}
				}
			}
		}
		if (truthy((rt.istype(live(A), T("/obj/mecha")) ? 1 : 0))) {
			if ((truthy(rt.gv(f, "occupant", (M = live(A)))) && !truthy(rt.callSrc(f, "in_faction", [rt.fv(f, "occupant", live(M))])))) {
				if (rt.ge(rt.callSrc(f, "assess_perp", [rt.fv(f, "occupant", live(M))]), 4)) {
					targets = rt.modify(live(targets), live(M), add);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return live(targets);
});

// /obj/machinery/porta_turret/proc/tryToShootAt  (code/game/machinery/porta_turret/portable_turret.dm:412)
rt.def("/obj/machinery/porta_turret/proc/tryToShootAt", function tryToShootAt(f: Frame, targets: Value) {
	let M: Value = null;
	f.vars = () => [targets, M];
	while (rt.gt(rt.len(f, live(targets)), 0)) {
		(targets = rt.modify(live(targets), (M = rt.op(f, "PickUnweighted", [1], [live(targets)])), subtract));
		if (truthy(rt.callSrc(f, "target", [live(M)]))) {
			return 1;
		}
	}
	return f.dot;
});

// /obj/machinery/porta_turret/proc/popUp  (code/game/machinery/porta_turret/portable_turret.dm:420)  may sleep
rt.def("/obj/machinery/porta_turret/proc/popUp", function* popUp(f: Frame) {
	if (!truthy(rt.sv(f, "anchored"))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "raising")) || truthy(rt.sv(f, "raised")))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	rt.setSv(f, "invisibility", 0);
	rt.setSv(f, "raising", 1);
	if (truthy(rt.sv(f, "cover"))) {
		yield* g.call(f, P("/proc/flick"), null, ["popup", rt.sv(f, "cover")]);
	}
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	rt.setSv(f, "raising", 0);
	if (truthy(rt.sv(f, "cover"))) {
		rt.setFv(f, "icon_state", rt.sv(f, "cover"), "openTurretCover");
	}
	rt.setSv(f, "raised", 1);
	rt.setSv(f, "layer", 4);
	return f.dot;
}, true);

// /obj/machinery/porta_turret/proc/popDown  (code/game/machinery/porta_turret/portable_turret.dm:438)  may sleep
rt.def("/obj/machinery/porta_turret/proc/popDown", function* popDown(f: Frame) {
	if ((truthy(rt.sv(f, "raising")) || !truthy(rt.sv(f, "raised")))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	rt.setSv(f, "layer", 3);
	rt.setSv(f, "raising", 1);
	if (truthy(rt.sv(f, "cover"))) {
		yield* g.call(f, P("/proc/flick"), null, ["popdown", rt.sv(f, "cover")]);
	}
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	rt.setSv(f, "raising", 0);
	if (truthy(rt.sv(f, "cover"))) {
		rt.setFv(f, "icon_state", rt.sv(f, "cover"), "turretCover");
	}
	rt.setSv(f, "raised", 0);
	rt.setSv(f, "invisibility", 2);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/porta_turret/proc/assess_perp  (code/game/machinery/porta_turret/portable_turret.dm:460)
rt.def("/obj/machinery/porta_turret/proc/assess_perp", function assess_perp(f: Frame, perp: Value) {
	let threatcount: Value = null, perpname: Value = null, R: Value = null;
	f.vars = () => [threatcount, perpname, R];
	threatcount = 0;
	if (truthy(rt.sv(f, "emagged"))) {
		return 10;
	}
	if (((truthy(rt.sv(f, "stun_all")) || truthy(rt.sv(f, "attacked"))) && !truthy(rt.callSrc(f, "allowed", [live(perp)])))) {
		if (!truthy(rt.callSrc(f, "allowed", [live(perp)]))) {
			return 10;
		}
	}
	if (truthy(rt.sv(f, "auth_weapons"))) {
		if ((rt.fv(f, "wear_id", live(perp)) === null || truthy((rt.istype(rt.callName(f, rt.fv(f, "wear_id", live(perp)), "GetID", []), T("/obj/item/weapon/card/id/syndicate")) ? 1 : 0)))) {
			if (truthy(rt.callSrc(f, "allowed", [live(perp)]))) {
				return 0;
			}
			if ((truthy(rt.callName(f, live(perp), "is_holding_item_of_type", [T("/obj/item/weapon/gun")])) || truthy(rt.callName(f, live(perp), "is_holding_item_of_type", [T("/obj/item/weapon/melee/baton")])))) {
				threatcount = rt.modify(live(threatcount), 4, add);
			}
			if ((truthy((rt.istype(rt.fv(f, "belt", live(perp)), T("/obj/item/weapon/gun")) ? 1 : 0)) || truthy((rt.istype(rt.fv(f, "belt", live(perp)), T("/obj/item/weapon/melee/baton")) ? 1 : 0)))) {
				threatcount = rt.modify(live(threatcount), 2, add);
			}
		}
	}
	if (truthy(rt.sv(f, "check_records"))) {
		perpname = rt.callName(f, live(perp), "get_face_name", [rt.callName(f, live(perp), "get_id_name", [])]);
		if ((!truthy((R = rt.call(f, P("/proc/find_record"), null, ["name", live(perpname), rt.fv(f, "security", rt.gl("data_core"))]))) || isEqual(rt.index(rt.fv(f, "fields", live(R)), "criminal"), "*Arrest*"))) {
			threatcount = rt.modify(live(threatcount), 4, add);
		}
	}
	return live(threatcount);
});

// /obj/machinery/porta_turret/proc/in_faction  (code/game/machinery/porta_turret/portable_turret.dm:487)
rt.def("/obj/machinery/porta_turret/proc/in_faction", function in_faction(f: Frame, target: Value) {
	if (!truthy((rt.isIn(f, rt.sv(f, "faction"), rt.fv(f, "faction", live(target))) ? 1 : 0))) {
		return 0;
	}
	return 1;
});

// /obj/machinery/porta_turret/proc/target  (code/game/machinery/porta_turret/portable_turret.dm:493)
rt.def("/obj/machinery/porta_turret/proc/target", function target(f: Frame, target: Value) {
	if (truthy(live(target))) {
		rt.spawnTail(f, 0, "/obj/machinery/porta_turret/proc/target: spawn at game/machinery/porta_turret/portable_turret.dm:493", target);
		rt.callSrc(f, "setDir", [rt.getDir(f, rt.sv(f, "base"), live(target))]);
		rt.spawnTail(f, 0, "/obj/machinery/porta_turret/proc/target: spawn at game/machinery/porta_turret/portable_turret.dm:496", target);
		return 1;
	}
	return live(f.dot);
});

// a spawn(0) body of /obj/machinery/porta_turret/proc/target, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret/proc/target: spawn at game/machinery/porta_turret/portable_turret.dm:496", function* (f: Frame, target: Value) {
	f.vars = () => [target];
	yield* g.srcCall(f, "shootAt", live(target));
	return null;
});

// a spawn(0) body of /obj/machinery/porta_turret/proc/target, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret/proc/target: spawn at game/machinery/porta_turret/portable_turret.dm:493", function* (f: Frame, target: Value) {
	f.vars = () => [target];
	yield* g.srcCall(f, "popUp");
	return null;
});

// /obj/machinery/porta_turret/proc/shootAt  (code/game/machinery/porta_turret/portable_turret.dm:502)  may sleep
rt.def("/obj/machinery/porta_turret/proc/shootAt", function* shootAt(f: Frame, target: Value) {
	let _T: Value = null, U: Value = null, A: Value = null;
	f.vars = () => [target, _T, U, A];
	if (!truthy(rt.sv(f, "raised"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "emagged"))) {
		if (rt.gt(add(rt.sv(f, "last_fired"), rt.sv(f, "shot_delay")), rt.worldTime(f))) {
			return live(f.dot);
		}
		rt.setSv(f, "last_fired", rt.worldTime(f));
	}
	_T = rt.getStep(f, live(f.src), 0);
	U = rt.getStep(f, live(target), 0);
	if ((!truthy((rt.istype(live(_T), T("/turf")) ? 1 : 0)) || !truthy((rt.istype(live(U), T("/turf")) ? 1 : 0)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "update_icon");
	A = null;
	if (isEqual(rt.sv(f, "mode"), 0)) {
		yield* g.srcCall(f, "use_power", rt.sv(f, "reqpower"));
		A = (yield* g.new_(f, rt.sv(f, "stun_projectile"), [live(_T)]));
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "stun_projectile_sound"), 75, 1]);
	} else {
		yield* g.srcCall(f, "use_power", multiply(rt.sv(f, "reqpower"), 2));
		A = (yield* g.new_(f, rt.sv(f, "lethal_projectile"), [live(_T)]));
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "lethal_projectile_sound"), 75, 1]);
	}
	rt.setFv(f, "original", live(A), live(target));
	rt.setFv(f, "starting", live(A), live(_T));
	rt.setFv(f, "current", live(A), live(_T));
	rt.setFv(f, "yo", live(A), subtract(rt.fv(f, "y", live(U)), rt.fv(f, "y", live(_T))));
	rt.setFv(f, "xo", live(A), subtract(rt.fv(f, "x", live(U)), rt.fv(f, "x", live(_T))));
	yield* g.callName(f, live(A), "fire", []);
	return live(A);
}, true);

// /obj/machinery/porta_turret/proc/setState  (code/game/machinery/porta_turret/portable_turret.dm:543)
rt.def("/obj/machinery/porta_turret/proc/setState", function setState(f: Frame, on: Value, mode: Value) {
	if (truthy(rt.sv(f, "controllock"))) {
		return live(f.dot);
	}
	rt.setFv(f, "on", live(f.src), live(on));
	rt.setFv(f, "mode", live(f.src), live(mode));
	rt.callSrc(f, "power_change", []);
	return f.dot;
});

rt.type(10752, "/obj/machinery/porta_turret/syndicate", "/obj/machinery/porta_turret", {
	installation: null,
	always_up: 1,
	has_cover: 0,
	scan_range: 9,
	stun_projectile: rt.typePath("/obj/item/projectile/bullet"),
	lethal_projectile: rt.typePath("/obj/item/projectile/bullet"),
	lethal_projectile_sound: rt.rsc("sound/weapons/gunshot.ogg"),
	stun_projectile_sound: rt.rsc("sound/weapons/gunshot.ogg"),
	base_icon_state: "syndie",
	faction: "syndicate",
	emp_vunerable: 0,
	use_power: 0,
	req_access: null,
	icon_state: "syndie_off",
});

// /obj/machinery/porta_turret/syndicate/proc/<init>  (code/game/machinery/porta_turret/portable_turret.dm:556)
rt.def("/obj/machinery/porta_turret/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(150));
	return f.dot;
});

rt.type(10757, "/obj/machinery/porta_turret/aux_base", "/obj/machinery/porta_turret", {
	installation: null,
	lethal_projectile: rt.typePath("/obj/item/projectile/plasma/turret"),
	lethal_projectile_sound: rt.rsc("sound/weapons/plasma_cutter.ogg"),
	mode: 1,
	faction: "neutral",
	name: "perimeter defense turret",
	desc: "A plasma beam turret calibrated to defend outposts against non-humanoid fauna. It is more effective when exposed to the environment.",
});

// /obj/machinery/porta_turret/aux_base/proc/New  (code/game/machinery/porta_turret/portable_turret.dm:612)  may sleep
rt.def("/obj/machinery/porta_turret/aux_base/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "name", rt.sv(f, "cover"), rt.sv(f, "name"));
	rt.setFv(f, "desc", rt.sv(f, "cover"), rt.sv(f, "desc"));
	return f.dot;
}, true);

rt.type(10334, "/obj/machinery/turretid", "/obj/machinery", {
	enabled: 1,
	lethal: 0,
	locked: 1,
	control_area: null,
	ailock: 0,
	turrets: null,
	anchored: 1,
	name: "turret control panel",
	desc: "Used to control a room's automated defenses.",
	icon: rt.rsc("icons/obj/machines/turret_control.dmi"),
	icon_state: "control_standby",
	density: 0,
	req_access: null,
	resistance_flags: 115,
});

// /obj/machinery/turretid/proc/<init>  (code/game/machinery/porta_turret/portable_turret.dm:657)
rt.def("/obj/machinery/turretid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "turrets", rt.list());
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(16));
	return f.dot;
});

// /obj/machinery/turretid/proc/New  (code/game/machinery/porta_turret/portable_turret.dm:661)  may sleep
rt.def("/obj/machinery/turretid/proc/New", function* New(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[2]))) {
		yield* g.srcCall(f, "setDir", live(f.args[1]));
		rt.setSv(f, "locked", 0);
		if (truthy(rt.bitAnd(rt.sv(f, "dir"), 3))) {
			$0 = 0;
		} else {
			if (isEqual(rt.sv(f, "dir"), 4)) {
				$0 = -24;
			} else {
				$0 = 24;
			}
		}
		rt.setSv(f, "pixel_x", $0);
		if (truthy(rt.bitAnd(rt.sv(f, "dir"), 3))) {
			if (isEqual(rt.sv(f, "dir"), 1)) {
				$0 = -24;
			} else {
				$0 = 24;
			}
		} else {
			$0 = 0;
		}
		rt.setSv(f, "pixel_y", $0);
	}
	yield* g.srcCall(f, "power_change");
	return f.dot;
}, true, { args: ["loc", "ndir", "built"] });

// /obj/machinery/turretid/proc/Destroy  (code/game/machinery/porta_turret/portable_turret.dm:670)  may sleep
rt.def("/obj/machinery/turretid/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.sv(f, "turrets"), "Cut", []);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/turretid/proc/Initialize  (code/game/machinery/porta_turret/portable_turret.dm:674)  may sleep
rt.def("/obj/machinery/turretid/proc/Initialize", function* Initialize(f: Frame) {
	let V: Value = null, A: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [V, A, _T, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "control_area")) && truthy((yield* g.call(f, P("/proc/istext"), null, [rt.sv(f, "control_area")]))))) {
		V = null;
		rt.forList(f, 0, rt.gl("sortedAreas"));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			if (isEqual(rt.gv(f, "name", (A = live(V))), rt.sv(f, "control_area"))) {
				rt.setSv(f, "control_area", live(A));
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "control_area"))) {
		rt.setSv(f, "control_area", (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])));
	}
	_T = null;
	rt.forList(f, 0, rt.sv(f, "control_area"), T("/obj/machinery/porta_turret"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		(rt.modSrcVar(f, "turrets", live(_T), rt.bitOr));
		rt.setFv(f, "cp", live(_T), live(f.src));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/turretid/proc/attackby  (code/game/machinery/porta_turret/portable_turret.dm:692)  may sleep
rt.def("/obj/machinery/turretid/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let M: Value = null;
	let $0: any, $1: any;
	f.vars = () => [I, user, params, M, $0, $1];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(I), T("/obj/item/device/multitool")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "buffer", (M = live(I)))) && truthy((rt.istype(rt.fv(f, "buffer", live(M)), T("/obj/machinery/porta_turret")) ? 1 : 0)))) {
			(rt.modSrcVar(f, "turrets", rt.fv(f, "buffer", live(M)), rt.bitOr));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("You link ％！ with ％！", [rt.fv(f, "buffer", live(M)), live(f.src)])]);
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
		return (yield* g.srcCall(f, "attack_hand", live(user)));
	}
	if (!isEqual((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 0)) return f.dot;
	if (truthy((yield* g.srcCall(f, "allowed", live(f.usr))))) {
		if (truthy(rt.sv(f, "emagged"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The turret control is unresponsive.</span>"]);
			return live(f.dot);
		}
		rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
		$0 = live(user);
		if (truthy(rt.sv(f, "locked"))) {
			$1 = "lock";
		} else {
			$1 = "unlock";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the panel.</span>", [$1])]);
		if (truthy(rt.sv(f, "locked"))) {
			if (isEqual(rt.fv(f, "machine", live(user)), live(f.src))) {
				yield* g.callName(f, live(user), "unset_machine", []);
				rt.op(f, "Browse", [], [live(user), null, "window=turretid"], false);
			}
		} else {
			if (isEqual(rt.fv(f, "machine", live(user)), live(f.src))) {
				yield* g.callName(f, live(f.src), "attack_hand", [live(user)]);
			}
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Access denied.</span>"]);
	}
	return f.dot;
}, true);

// /obj/machinery/turretid/proc/emag_act  (code/game/machinery/porta_turret/portable_turret.dm:723)  may sleep
rt.def("/obj/machinery/turretid/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You short out the turret controls' access analysis module.</span>"]);
	rt.setSv(f, "emagged", 1);
	rt.setSv(f, "locked", 0);
	if (!(truthy(live(user)) && isEqual(rt.fv(f, "machine", live(user)), live(f.src)))) return f.dot;
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /obj/machinery/turretid/proc/attack_ai  (code/game/machinery/porta_turret/portable_turret.dm:731)  may sleep
rt.def("/obj/machinery/turretid/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((!truthy(rt.sv(f, "ailock")) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(user)]))))) {
		return (yield* g.srcCall(f, "attack_hand", live(user)));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>There seems to be a firewall preventing you from accessing this device.</span>"]);
	return f.dot;
}, true);

// /obj/machinery/turretid/proc/attack_hand  (code/game/machinery/porta_turret/portable_turret.dm:737)  may sleep
rt.def("/obj/machinery/turretid/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let area: Value = null, t: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, area, t, popup, $0, $1, $2];
	if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 0)) {
		if (!(truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(user)]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You are too far away.</span>"]);
			yield* g.callName(f, live(user), "unset_machine", []);
			rt.op(f, "Browse", [], [live(user), null, "window=turretid"], false);
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	area = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	t = "";
	if ((truthy(rt.sv(f, "locked")) && !(truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))))) {
		t = rt.modify(live(t), "<div class='notice icon'>Swipe ID card to unlock interface</div>", add);
	} else {
		if ((!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(user)]))))) {
			t = rt.modify(live(t), "<div class='notice icon'>Swipe ID card to lock interface</div>", add);
		}
		if (truthy(rt.sv(f, "enabled"))) {
			$0 = "activated";
		} else {
			$0 = "deactivated";
		}
		$1 = live(f.src);
		if (truthy(rt.sv(f, "enabled"))) {
			$2 = "Disable";
		} else {
			$2 = "Enable";
		}
		t = rt.modify(live(t), fmt("Turrets ＀ - <A href='?src=＃;toggleOn=1'>＀?</a><br>", [$0, $1, $2]), add);
		if (truthy(rt.sv(f, "lethal"))) {
			$0 = "lethal";
		} else {
			$0 = "stun repeatedly";
		}
		$1 = live(f.src);
		if (truthy(rt.sv(f, "lethal"))) {
			$2 = "Stun repeatedly";
		} else {
			$2 = "Lethal";
		}
		t = rt.modify(live(t), fmt("Currently set for ＀ - <A href='?src=＃;toggleLethal=1'>Change to ＀?</a><br>", [$0, $1, $2]), add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "turretid", fmt("Turret Control Panel (＀)", [rt.fv(f, "name", live(area))])]))), "set_content", [live(t)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/turretid/proc/Topic  (code/game/machinery/porta_turret/portable_turret.dm:762)  may sleep
rt.def("/obj/machinery/turretid/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "locked"))) {
		if (!(truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Control panel is locked!"]);
			return live(f.dot);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "toggleOn"))) {
		yield* g.srcCall(f, "toggle_on");
	} else {
		if (truthy(rt.at(live(f.args[1]), "toggleLethal"))) {
			yield* g.srcCall(f, "toggle_lethal");
		}
	}
	yield* g.callName(f, live(f.src), "attack_hand", [live(f.usr)]);
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/turretid/proc/toggle_lethal  (code/game/machinery/porta_turret/portable_turret.dm:775)
rt.def("/obj/machinery/turretid/proc/toggle_lethal", function toggle_lethal(f: Frame) {
	rt.setSv(f, "lethal", (!truthy(rt.sv(f, "lethal")) ? 1 : 0));
	rt.callSrc(f, "updateTurrets", []);
	return f.dot;
});

// /obj/machinery/turretid/proc/toggle_on  (code/game/machinery/porta_turret/portable_turret.dm:779)
rt.def("/obj/machinery/turretid/proc/toggle_on", function toggle_on(f: Frame) {
	rt.setSv(f, "enabled", (!truthy(rt.sv(f, "enabled")) ? 1 : 0));
	rt.callSrc(f, "updateTurrets", []);
	return f.dot;
});

// /obj/machinery/turretid/proc/updateTurrets  (code/game/machinery/porta_turret/portable_turret.dm:783)
rt.def("/obj/machinery/turretid/proc/updateTurrets", function updateTurrets(f: Frame) {
	let aTurret: Value = null;
	let $e: any;
	f.vars = () => [aTurret, $e];
	aTurret = null;
	rt.forList(f, 0, rt.sv(f, "turrets"), T("/obj/machinery/porta_turret"));
	while (($e = rt.next(f, 0)) !== undefined) {
		aTurret = $e;
		rt.callName(f, live(aTurret), "setState", [rt.sv(f, "enabled"), rt.sv(f, "lethal")]);
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/turretid/proc/power_change  (code/game/machinery/porta_turret/portable_turret.dm:788)
rt.def("/obj/machinery/turretid/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/turretid/proc/update_icon  (code/game/machinery/porta_turret/portable_turret.dm:792)
rt.def("/obj/machinery/turretid/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "icon_state", "control_off");
	} else {
		if (truthy(rt.sv(f, "enabled"))) {
			if (truthy(rt.sv(f, "lethal"))) {
				rt.setSv(f, "icon_state", "control_kill");
			} else {
				rt.setSv(f, "icon_state", "control_stun");
			}
		} else {
			rt.setSv(f, "icon_state", "control_standby");
		}
	}
	return f.dot;
});

rt.type(9545, "/obj/item/wallframe/turret_control", "/obj/item/wallframe", {
	name: "turret control frame",
	desc: "Used for building turret control panels",
	icon_state: "apc",
	result_path: rt.typePath("/obj/machinery/turretid"),
	materials: null,
});

// /obj/item/wallframe/turret_control/proc/<init>  (code/game/machinery/porta_turret/portable_turret.dm:808)
rt.def("/obj/item/wallframe/turret_control/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	return f.dot;
});

// /obj/item/weapon/gun/proc/get_turret_properties  (code/game/machinery/porta_turret/portable_turret.dm:811)
rt.def("/obj/item/weapon/gun/proc/get_turret_properties", function get_turret_properties(f: Frame) {
	f.dot = rt.list();
	rt.setAt(live(f.dot), "lethal_projectile", null);
	rt.setAt(live(f.dot), "lethal_projectile_sound", null);
	rt.setAt(live(f.dot), "stun_projectile", null);
	rt.setAt(live(f.dot), "stun_projectile_sound", null);
	rt.setAt(live(f.dot), "base_icon_state", "standard");
	return f.dot;
});

// /obj/item/weapon/gun/energy/proc/get_turret_properties  (code/game/machinery/porta_turret/portable_turret.dm:819)
rt.def("/obj/item/weapon/gun/energy/proc/get_turret_properties", function get_turret_properties(f: Frame) {
	let primary_ammo: Value = null, secondary_ammo: Value = null;
	f.vars = () => [primary_ammo, secondary_ammo];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	primary_ammo = rt.index(rt.sv(f, "ammo_type"), 1);
	rt.setAt(live(f.dot), "stun_projectile", rt.initial(f, live(primary_ammo), "projectile_type"));
	rt.setAt(live(f.dot), "stun_projectile_sound", rt.initial(f, live(primary_ammo), "fire_sound"));
	if (rt.gt(rt.len(f, rt.sv(f, "ammo_type")), 1)) {
		secondary_ammo = rt.index(rt.sv(f, "ammo_type"), 2);
		rt.setAt(live(f.dot), "lethal_projectile", rt.initial(f, live(secondary_ammo), "projectile_type"));
		rt.setAt(live(f.dot), "lethal_projectile_sound", rt.initial(f, live(secondary_ammo), "fire_sound"));
	} else {
		rt.setAt(live(f.dot), "lethal_projectile", rt.at(live(f.dot), "stun_projectile"));
		rt.setAt(live(f.dot), "lethal_projectile_sound", rt.at(live(f.dot), "stun_projectile_sound"));
	}
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/proc/get_turret_properties  (code/game/machinery/porta_turret/portable_turret.dm:835)
rt.def("/obj/item/weapon/gun/ballistic/proc/get_turret_properties", function get_turret_properties(f: Frame) {
	let mag: Value = null, primary_ammo: Value = null;
	f.vars = () => [mag, primary_ammo];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	mag = rt.sv(f, "mag_type");
	primary_ammo = rt.initial(f, live(mag), "ammo_type");
	rt.setAt(live(f.dot), "base_icon_state", "syndie");
	rt.setAt(live(f.dot), "stun_projectile", rt.initial(f, live(primary_ammo), "projectile_type"));
	rt.setAt(live(f.dot), "stun_projectile_sound", rt.initial(f, live(primary_ammo), "fire_sound"));
	rt.setAt(live(f.dot), "lethal_projectile", rt.at(live(f.dot), "stun_projectile"));
	rt.setAt(live(f.dot), "lethal_projectile_sound", rt.at(live(f.dot), "stun_projectile_sound"));
	return f.dot;
});

// /obj/item/weapon/gun/energy/laser/bluetag/proc/get_turret_properties  (code/game/machinery/porta_turret/portable_turret.dm:847)
rt.def("/obj/item/weapon/gun/energy/laser/bluetag/proc/get_turret_properties", function get_turret_properties(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setAt(live(f.dot), "stun_projectile", T("/obj/item/projectile/beam/lasertag/bluetag"));
	rt.setAt(live(f.dot), "lethal_projectile", T("/obj/item/projectile/beam/lasertag/bluetag"));
	rt.setAt(live(f.dot), "base_icon_state", "blue");
	rt.setAt(live(f.dot), "shot_delay", 30);
	rt.setAt(live(f.dot), "team_color", "blue");
	return f.dot;
});

// /obj/item/weapon/gun/energy/laser/redtag/proc/get_turret_properties  (code/game/machinery/porta_turret/portable_turret.dm:855)
rt.def("/obj/item/weapon/gun/energy/laser/redtag/proc/get_turret_properties", function get_turret_properties(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setAt(live(f.dot), "stun_projectile", T("/obj/item/projectile/beam/lasertag/redtag"));
	rt.setAt(live(f.dot), "lethal_projectile", T("/obj/item/projectile/beam/lasertag/redtag"));
	rt.setAt(live(f.dot), "base_icon_state", "red");
	rt.setAt(live(f.dot), "shot_delay", 30);
	rt.setAt(live(f.dot), "team_color", "red");
	return f.dot;
});

// /obj/item/weapon/gun/energy/e_gun/turret/proc/get_turret_properties  (code/game/machinery/porta_turret/portable_turret.dm:863)
rt.def("/obj/item/weapon/gun/energy/e_gun/turret/proc/get_turret_properties", function get_turret_properties(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(10759, "/obj/machinery/porta_turret/lasertag", "/obj/machinery/porta_turret", {
	team_color: null,
	check_records: 0,
	criminals: 0,
	auth_weapons: 1,
	stun_all: 0,
	check_anomalies: 0,
	req_access: null,
});

// /obj/machinery/porta_turret/lasertag/proc/assess_perp  (code/game/machinery/porta_turret/portable_turret.dm:876)
rt.def("/obj/machinery/porta_turret/lasertag/proc/assess_perp", function assess_perp(f: Frame, perp: Value) {
	f.dot = 0;
	if (isEqual(rt.sv(f, "team_color"), "blue")) {
		f.dot = 0;
		if (truthy((rt.istype(rt.fv(f, "wear_suit", live(perp)), T("/obj/item/clothing/suit/redtag")) ? 1 : 0))) {
			f.dot = rt.modify(live(f.dot), 4, add);
		}
		if (truthy(rt.callName(f, live(perp), "is_holding_item_of_type", [T("/obj/item/weapon/gun/energy/laser/redtag")]))) {
			f.dot = rt.modify(live(f.dot), 4, add);
		}
		if (truthy((rt.istype(rt.fv(f, "belt", live(perp)), T("/obj/item/weapon/gun/energy/laser/redtag")) ? 1 : 0))) {
			f.dot = rt.modify(live(f.dot), 2, add);
		}
	}
	if (!isEqual(rt.sv(f, "team_color"), "red")) return f.dot;
	f.dot = 0;
	if (truthy((rt.istype(rt.fv(f, "wear_suit", live(perp)), T("/obj/item/clothing/suit/bluetag")) ? 1 : 0))) {
		f.dot = rt.modify(live(f.dot), 4, add);
	}
	if (truthy(rt.callName(f, live(perp), "is_holding_item_of_type", [T("/obj/item/weapon/gun/energy/laser/bluetag")]))) {
		f.dot = rt.modify(live(f.dot), 4, add);
	}
	if (!truthy((rt.istype(rt.fv(f, "belt", live(perp)), T("/obj/item/weapon/gun/energy/laser/bluetag")) ? 1 : 0))) return f.dot;
	f.dot = rt.modify(live(f.dot), 2, add);
	return f.dot;
});

// /obj/machinery/porta_turret/lasertag/proc/setup  (code/game/machinery/porta_turret/portable_turret.dm:895)  may sleep
rt.def("/obj/machinery/porta_turret/lasertag/proc/setup", function* setup(f: Frame) {
	let properties: Value = null;
	f.vars = () => [properties];
	if (!truthy(rt.index((properties = (yield* g.callSuper(f, [], rt.Args.Same))), "team_color"))) return f.dot;
	rt.setSv(f, "team_color", rt.at(live(properties), "team_color"));
	return f.dot;
}, true, { args: ["gun"] });

// /obj/machinery/porta_turret/lasertag/proc/interact  (code/game/machinery/porta_turret/portable_turret.dm:900)  may sleep
rt.def("/obj/machinery/porta_turret/lasertag/proc/interact", function* interact(f: Frame, user: Value) {
	let H: Value = null, dat: Value = null, popup: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, H, dat, popup, $0, $1];
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(user);
		if ((isEqual(rt.sv(f, "team_color"), "blue") && truthy((rt.istype(rt.fv(f, "wear_suit", live(H)), T("/obj/item/clothing/suit/redtag")) ? 1 : 0)))) {
			return live(f.dot);
		}
		if ((isEqual(rt.sv(f, "team_color"), "red") && truthy((rt.istype(rt.fv(f, "wear_suit", live(H)), T("/obj/item/clothing/suit/bluetag")) ? 1 : 0)))) {
			return live(f.dot);
		}
	}
	$0 = live(f.src);
	if (truthy(rt.sv(f, "on"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	dat = fmt("Status: <a href='?src=＃;power=1'>＀</a>", [$0, $1]);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "autosec", "Automatic Portable Turret Installation", 300, 300]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/porta_turret/lasertag/proc/bullet_act  (code/game/machinery/porta_turret/portable_turret.dm:923)  may sleep
rt.def("/obj/machinery/porta_turret/lasertag/proc/bullet_act", function* bullet_act(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "on"))) return f.dot;
	if (isEqual(rt.sv(f, "team_color"), "blue")) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/beam/lasertag/redtag")) ? 1 : 0))) {
			rt.setSv(f, "on", 0);
			rt.spawnTail(f, 100, "/obj/machinery/porta_turret/lasertag/proc/bullet_act: spawn at game/machinery/porta_turret/portable_turret.dm:928");
		}
	} else {
		if (!isEqual(rt.sv(f, "team_color"), "red")) return f.dot;
		if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/beam/lasertag/bluetag")) ? 1 : 0))) return f.dot;
		rt.setSv(f, "on", 0);
		rt.spawnTail(f, 100, "/obj/machinery/porta_turret/lasertag/proc/bullet_act: spawn at game/machinery/porta_turret/portable_turret.dm:933");
	}
	return f.dot;
}, true, { args: ["P"] });

// a spawn(100) body of /obj/machinery/porta_turret/lasertag/proc/bullet_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret/lasertag/proc/bullet_act: spawn at game/machinery/porta_turret/portable_turret.dm:933", function* (f: Frame) {
	rt.setSv(f, "on", 1);
	return null;
});

// a spawn(100) body of /obj/machinery/porta_turret/lasertag/proc/bullet_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret/lasertag/proc/bullet_act: spawn at game/machinery/porta_turret/portable_turret.dm:928", function* (f: Frame) {
	rt.setSv(f, "on", 1);
	return null;
});
