// From code/modules/projectiles/guns/ballistic.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5201, "/obj/item/weapon/gun/ballistic", "/obj/item/weapon/gun", {
	spawnwithmagazine: 1,
	magazine: null,
	casing_ejector: 1,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m10mm"),
	desc: "Now comes in flavors like GUN. Uses 10mm ammo, for some reason",
	name: "projectile gun",
	icon_state: "pistol",
	origin_tech: "combat=2;materials=2",
	w_class: 3,
});

// /obj/item/weapon/gun/ballistic/proc/Initialize  (code/modules/projectiles/guns/ballistic.dm:13)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "spawnwithmagazine"))) {
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "magazine"))) {
		rt.setSv(f, "magazine", (yield* g.new_(f, rt.sv(f, "mag_type"), [live(f.src)])));
	}
	yield* g.srcCall(f, "chamber_round");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/proc/update_icon  (code/modules/projectiles/guns/ballistic.dm:23)
rt.def("/obj/item/weapon/gun/ballistic/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "current_skin"))) {
		$0 = rt.sv(f, "current_skin");
		if (truthy(rt.sv(f, "suppressed"))) {
			$1 = "-suppressed";
		} else {
			$1 = "";
		}
		if (truthy(rt.sv(f, "sawn_state"))) {
			$2 = "-sawn";
		} else {
			$2 = "";
		}
		rt.setSv(f, "icon_state", fmt("＀＀＀", [$0, $1, $2]));
	} else {
		$0 = rt.initial(f, live(f.src), "icon_state");
		if (truthy(rt.sv(f, "suppressed"))) {
			$1 = "-suppressed";
		} else {
			$1 = "";
		}
		if (truthy(rt.sv(f, "sawn_state"))) {
			$2 = "-sawn";
		} else {
			$2 = "";
		}
		rt.setSv(f, "icon_state", fmt("＀＀＀", [$0, $1, $2]));
	}
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/proc/process_chamber  (code/modules/projectiles/guns/ballistic.dm:31)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/proc/process_chamber", function* process_chamber(f: Frame, empty_chamber: Value) {
	let AC: Value = null;
	f.vars = () => [empty_chamber, AC];
	if (live(empty_chamber) === null) {
		empty_chamber = 1;
	}
	if (truthy((rt.istype((AC = rt.sv(f, "chambered")), T("/obj/item/ammo_casing")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "casing_ejector"))) {
			yield* g.callName(f, live(AC), "forceMove", [rt.getStep(f, live(f.src), 0)]);
			yield* g.callName(f, live(AC), "SpinAnimation", [10, 1]);
			rt.setSv(f, "chambered", null);
		} else {
			if (truthy(live(empty_chamber))) {
				rt.setSv(f, "chambered", null);
			}
		}
	}
	yield* g.srcCall(f, "chamber_round");
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/proc/chamber_round  (code/modules/projectiles/guns/ballistic.dm:43)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/proc/chamber_round", function* chamber_round(f: Frame) {
	if ((truthy(rt.sv(f, "chambered")) || !truthy(rt.sv(f, "magazine")))) {
		return live(f.dot);
	} else {
		if (!truthy((yield* g.callName(f, rt.sv(f, "magazine"), "ammo_count", [])))) return f.dot;
		rt.setSv(f, "chambered", (yield* g.callName(f, rt.sv(f, "magazine"), "get_round", [])));
		yield* g.callName(f, rt.sv(f, "chambered"), "forceMove", [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/proc/can_shoot  (code/modules/projectiles/guns/ballistic.dm:50)
rt.def("/obj/item/weapon/gun/ballistic/proc/can_shoot", function can_shoot(f: Frame) {
	if ((!truthy(rt.sv(f, "magazine")) || !truthy(rt.callName(f, rt.sv(f, "magazine"), "ammo_count", [0])))) {
		return 0;
	}
	return 1;
});

// /obj/item/weapon/gun/ballistic/proc/attackby  (code/modules/projectiles/guns/ballistic.dm:55)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/proc/attackby", function* attackby(f: Frame) {
	let AM: Value = null, S: Value = null;
	f.vars = () => [AM, S];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/ammo_box/magazine")) ? 1 : 0))) {
		AM = live(f.args[0]);
		if ((!truthy(rt.sv(f, "magazine")) && truthy(rt.op(f, "IsType", [], [live(AM), rt.sv(f, "mag_type")])))) {
			if (truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(AM), live(f.src)])))) {
				rt.setSv(f, "magazine", live(AM));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You load a new magazine into ％！.</span>", [live(f.src)])]);
				yield* g.srcCall(f, "chamber_round");
				yield* g.callName(f, live(f.args[0]), "update_icon", []);
				yield* g.srcCall(f, "update_icon");
				return 1;
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You cannot seem to get ％！ out of your hands!</span>", [live(f.src)])]);
				return live(f.dot);
			}
		} else {
			if (truthy(rt.sv(f, "magazine"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>There's already a magazine in ％！.</span>", [live(f.src)])]);
			}
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/suppressor")) ? 1 : 0))) {
		S = live(f.args[0]);
		if (truthy(rt.sv(f, "can_suppress"))) {
			if (!truthy(rt.sv(f, "suppressed"))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You screw ＀ onto ＀.</span>", [live(S), live(f.src)])]);
				rt.setSv(f, "suppressed", live(f.args[0]));
				rt.setFv(f, "oldsound", live(S), rt.sv(f, "fire_sound"));
				rt.setFv(f, "initial_w_class", live(S), rt.sv(f, "w_class"));
				rt.setSv(f, "fire_sound", rt.rsc("sound/weapons/gunshot_silenced.ogg"));
				rt.setSv(f, "w_class", 3);
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ already has a suppressor!</span>", [live(f.src)])]);
				return live(f.dot);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You can't seem to figure out how to fit ＀ on ＀!</span>", [live(S), live(f.src)])]);
			return live(f.dot);
		}
	}
	return 0;
}, true, { args: ["A", "user", "params"] });

// /obj/item/weapon/gun/ballistic/proc/attack_hand  (code/modules/projectiles/guns/ballistic.dm:94)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/proc/attack_hand", function* attack_hand(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (isEqual(rt.sv(f, "loc"), live(f.args[0]))) {
		if ((truthy(rt.sv(f, "suppressed")) && truthy(rt.sv(f, "can_unsuppress")))) {
			S = rt.sv(f, "suppressed");
			if (!truthy((yield* g.callName(f, live(f.args[0]), "is_holding", [live(f.src)])))) {
				yield* g.callSuper(f, [], rt.Args.Same);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You unscrew ＀ from ＀.</span>", [rt.sv(f, "suppressed"), live(f.src)])]);
			yield* g.callName(f, live(f.args[0]), "put_in_hands", [rt.sv(f, "suppressed")]);
			rt.setSv(f, "fire_sound", rt.fv(f, "oldsound", live(S)));
			rt.setSv(f, "w_class", rt.fv(f, "initial_w_class", live(S)));
			rt.setSv(f, "suppressed", 0);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/gun/ballistic/proc/attack_self  (code/modules/projectiles/guns/ballistic.dm:110)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let AC: Value = null;
	f.vars = () => [user, AC];
	AC = rt.sv(f, "chambered");
	if (truthy(rt.sv(f, "magazine"))) {
		rt.setFv(f, "loc", rt.sv(f, "magazine"), rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0));
		yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "magazine")]);
		yield* g.callName(f, rt.sv(f, "magazine"), "update_icon", []);
		rt.setSv(f, "magazine", null);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You pull the magazine out of ％！.</span>", [live(f.src)])]);
	} else {
		if (truthy(rt.sv(f, "chambered"))) {
			rt.setFv(f, "loc", live(AC), rt.getStep(f, live(f.src), 0));
			yield* g.callName(f, live(AC), "SpinAnimation", [10, 1]);
			rt.setSv(f, "chambered", null);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You unload the round from ％！'s chamber.</span>", [live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>There's no magazine in ％！.</span>", [live(f.src)])]);
		}
	}
	yield* g.srcCall(f, "update_icon");
	return live(f.dot);
}, true);

// /obj/item/weapon/gun/ballistic/proc/examine  (code/modules/projectiles/guns/ballistic.dm:129)
rt.def("/obj/item/weapon/gun/ballistic/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Has ＀ round５ remaining.", [rt.callSrc(f, "get_ammo", [])])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/gun/ballistic/proc/get_ammo  (code/modules/projectiles/guns/ballistic.dm:134)
rt.def("/obj/item/weapon/gun/ballistic/proc/get_ammo", function get_ammo(f: Frame, countchambered: Value) {
	let boolets: Value = null;
	f.vars = () => [countchambered, boolets];
	if (live(countchambered) === null) {
		countchambered = 1;
	}
	boolets = 0;
	if ((truthy(rt.sv(f, "chambered")) && truthy(live(countchambered)))) {
		boolets = rt.inc(live(boolets), 1);
	}
	if (truthy(rt.sv(f, "magazine"))) {
		boolets = rt.modify(live(boolets), rt.callName(f, rt.sv(f, "magazine"), "ammo_count", []), add);
	}
	return live(boolets);
});

// /obj/item/weapon/gun/ballistic/proc/suicide_act  (code/modules/projectiles/guns/ballistic.dm:141)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((((truthy(rt.sv(f, "chambered")) && truthy(rt.fv(f, "BB", rt.sv(f, "chambered")))) && truthy((yield* g.srcCall(f, "can_trigger_gun", live(user))))) && !truthy(rt.gv(f, "nodamage", rt.fv(f, "BB", rt.sv(f, "chambered")))))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is putting the barrel of ＀ in ＀ mouth.  It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_theyre", []))])]);
		yield* g.call(f, P("/proc/sleep"), null, [25]);
		if (truthy((yield* g.callName(f, live(user), "is_holding", [live(f.src)])))) {
			yield* g.callSrc(f, "process_fire", [null, live(user), null, live(user), null, 0, "zone_override", "head"], rt.Args.Named);
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ blows ＀ brain＀ out with ＀!</span>", [live(user), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_s", [])), live(f.src)])]);
			return 1;
		} else {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ panics and starts choking to death!</span>", [live(user)])]);
			return 8;
		}
	} else {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is pretending to blow ＀ brain＀ out with ＀! It looks like ＀ trying to commit suicide!</b></span>", [live(user), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_s", [])), live(f.src), (yield* g.callName(f, live(user), "p_theyre", []))])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/empty.ogg"), 50, 1, -1]);
		return 8;
	}
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/proc/sawoff  (code/modules/projectiles/guns/ballistic.dm:159)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/proc/sawoff", function* sawoff(f: Frame, user: Value) {
	f.vars = () => [user];
	if (isEqual(rt.sv(f, "sawn_state"), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is already shortened!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ begins to shorten ％！.", [live(user), live(f.src)]), fmt("<span class='notice'>You begin to shorten ％！...</span>", [live(f.src)])]);
	if (truthy((yield* g.srcCall(f, "blow_up", live(user))))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＄！ goes off!</span>", [live(f.src)]), fmt("<span class='danger'>＄！ goes off in your face!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 30, "target", live(f.src)], rt.Args.Named)))) return f.dot;
	if (isEqual(rt.sv(f, "sawn_state"), 1)) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ shortens ％！!", [live(user), live(f.src)]), fmt("<span class='notice'>You shorten ％！.</span>", [live(f.src)])]);
	rt.setSv(f, "name", fmt("sawn-off ＀", [rt.fv(f, "name", live(f.src))]));
	rt.setSv(f, "desc", rt.sv(f, "sawn_desc"));
	rt.setSv(f, "w_class", 3);
	rt.setSv(f, "item_state", "gun");
	(rt.modSrcVar(f, "slot_flags", 16776191, rt.bitAnd));
	(rt.modSrcVar(f, "slot_flags", 512, rt.bitOr));
	rt.setSv(f, "sawn_state", 1);
	yield* g.srcCall(f, "update_icon");
	return 1;
}, true);

// /obj/item/weapon/gun/ballistic/proc/blow_up  (code/modules/projectiles/guns/ballistic.dm:187)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/proc/blow_up", function* blow_up(f: Frame, user: Value) {
	let AC: Value = null;
	let $e: any;
	f.vars = () => [user, AC, $e];
	f.dot = 0;
	AC = null;
	rt.forList(f, 0, rt.fv(f, "stored_ammo", rt.sv(f, "magazine")), T("/obj/item/ammo_casing"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AC = $e;
		if (truthy(rt.fv(f, "BB", live(AC)))) {
			yield* g.srcCall(f, "process_fire", live(user), live(user), 0);
			f.dot = 1;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
