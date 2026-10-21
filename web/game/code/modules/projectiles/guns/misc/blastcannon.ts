// From code/modules/projectiles/guns/misc/blastcannon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5285, "/obj/item/weapon/gun/blastcannon", "/obj/item/weapon/gun", {
	icon_state_loaded: "loaded_blastcannon",
	bomb: null,
	air1: null,
	air2: null,
	fire_sound: rt.rsc("sound/weapons/blastcannon.ogg"),
	clumsy_check: 0,
	randomspread: 0,
	name: "pipe gun",
	desc: "A pipe welded onto a gun stock, with a mechanical trigger. The pipe has an opening near the top, and there seems to be a spring loaded wheel in the hole.",
	icon_state: "empty_blastcannon",
	item_state: "blastcannon_empty",
	w_class: 3,
	force: 10,
	needs_permit: 0,
});

// /obj/item/weapon/gun/blastcannon/proc/New  (code/modules/projectiles/guns/misc/blastcannon.dm:19)  may sleep
rt.def("/obj/item/weapon/gun/blastcannon/proc/New", function* New(f: Frame) {
	if (!truthy(rt.sv(f, "pin"))) {
		rt.setSv(f, "pin", (yield* g.new_(f, T("/obj/item/device/firing_pin"), [])));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/gun/blastcannon/proc/Destroy  (code/modules/projectiles/guns/misc/blastcannon.dm:25)  may sleep
rt.def("/obj/item/weapon/gun/blastcannon/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "bomb"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "bomb")]);
		rt.setSv(f, "bomb", null);
	}
	rt.setSv(f, "air1", null);
	rt.setSv(f, "air2", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/gun/blastcannon/proc/attack_self  (code/modules/projectiles/guns/misc/blastcannon.dm:33)  may sleep
rt.def("/obj/item/weapon/gun/blastcannon/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "bomb"))) {
		yield* g.callName(f, rt.sv(f, "bomb"), "forceMove", [rt.fv(f, "loc", live(user))]);
		yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "bomb")]);
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ detaches the ＀ from the ＀</span>", [live(user), rt.sv(f, "bomb"), live(f.src)])]);
		rt.setSv(f, "bomb", null);
	}
	yield* g.srcCall(f, "update_icon");
	f.dot = (yield* g.callSuper(f, [live(user)]));
	return f.dot;
}, true);

// /obj/item/weapon/gun/blastcannon/proc/update_icon  (code/modules/projectiles/guns/misc/blastcannon.dm:42)
rt.def("/obj/item/weapon/gun/blastcannon/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "bomb"))) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_state_loaded"));
		rt.setSv(f, "name", "blast cannon");
		rt.setSv(f, "desc", "A makeshift device used to concentrate a bomb's blast energy to a narrow wave.");
	} else {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
		rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/item/weapon/gun/blastcannon/proc/attackby  (code/modules/projectiles/guns/misc/blastcannon.dm:52)  may sleep
rt.def("/obj/item/weapon/gun/blastcannon/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/transfer_valve")) ? 1 : 0))) {
		if ((!truthy(rt.gv(f, "tank_one", (_T = live(f.args[0])))) || !truthy(rt.fv(f, "tank_two", live(_T))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>What good would an incomplete bomb do?</span>"]);
			return 0;
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [live(f.args[0])])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ seems to be stuck to your hand!</span>", [live(f.args[0])])]);
			return 0;
		}
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ attaches the ＀ to the ＀!</span>", [live(f.args[1]), live(f.args[0]), live(f.src)])]);
		rt.setSv(f, "bomb", live(f.args[0]));
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		yield* g.srcCall(f, "update_icon");
		return 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["O", "user"] });

// /obj/item/weapon/gun/blastcannon/proc/calculate_bomb  (code/modules/projectiles/guns/misc/blastcannon.dm:68)  may sleep
rt.def("/obj/item/weapon/gun/blastcannon/proc/calculate_bomb", function* calculate_bomb(f: Frame) {
	let temp: Value = null, i: Value = null, pressure: Value = null;
	let $e: any;
	f.vars = () => [temp, i, pressure, $e];
	if (((!truthy((rt.istype(rt.sv(f, "bomb"), T("/obj/item/device/transfer_valve")) ? 1 : 0)) || !truthy((rt.istype(rt.fv(f, "tank_one", rt.sv(f, "bomb")), T("/obj/item/weapon/tank")) ? 1 : 0))) || !truthy((rt.istype(rt.fv(f, "tank_two", rt.sv(f, "bomb")), T("/obj/item/weapon/tank")) ? 1 : 0)))) {
		return 0;
	}
	rt.setSv(f, "air1", rt.gv(f, "air_contents", rt.fv(f, "tank_one", rt.sv(f, "bomb"))));
	rt.setSv(f, "air2", rt.gv(f, "air_contents", rt.fv(f, "tank_two", rt.sv(f, "bomb"))));
	temp = null;
	rt.setFv(f, "volume", live(temp), add(rt.fv(f, "volume", rt.sv(f, "air1")), rt.fv(f, "volume", rt.sv(f, "air2"))));
	yield* g.callName(f, live(temp), "merge", [rt.sv(f, "air1")]);
	yield* g.callName(f, live(temp), "merge", [rt.sv(f, "air2")]);
	i = null;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.callName(f, live(temp), "react", []);
	}
	rt.endFor(f, 0);
	pressure = (yield* g.callName(f, live(temp), "return_pressure", []));
	yield* g.call(f, P("/proc/qdel"), null, [live(temp)]);
	if (rt.lt(live(pressure), 4053)) {
		return 0;
	}
	return divide(live(pressure), 607.949951171875);
}, true);

// /obj/item/weapon/gun/blastcannon/proc/afterattack  (code/modules/projectiles/guns/misc/blastcannon.dm:85)  may sleep
rt.def("/obj/item/weapon/gun/blastcannon/proc/afterattack", function* afterattack(f: Frame) {
	let power: Value = null, heavy: Value = null, medium: Value = null, light: Value = null, starting: Value = null, A: Value = null, log_str: Value = null;
	let $0: any;
	f.vars = () => [power, heavy, medium, light, starting, A, log_str, $0];
	if (((((((!truthy(rt.sv(f, "bomb")) || isEqual(live(f.args[0]), live(f.args[1]))) || isEqual(rt.fv(f, "loc", live(f.args[0])), live(f.args[1]))) || !truthy(live(f.args[0]))) || isEqual(rt.fv(f, "loc", live(f.args[0])), rt.fv(f, "loc", live(f.args[1])))) || truthy((rt.isIn(f, rt.fv(f, "loc", live(f.args[0])), (yield* g.call(f, P("/proc/range"), null, [live(f.args[1]), 2]))) ? 1 : 0))) || truthy((rt.isIn(f, live(f.args[0]), (yield* g.call(f, P("/proc/range"), null, [live(f.args[1]), 2]))) ? 1 : 0)))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	power = (yield* g.srcCall(f, "calculate_bomb"));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "bomb")]);
	yield* g.srcCall(f, "update_icon");
	heavy = multiply(live(power), 0.20000000298023224);
	medium = multiply(live(power), 0.5);
	light = live(power);
	yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ opens ％！ on ＋ ＀ and fires a blast wave at ％！!</span>", [live(f.args[1]), rt.sv(f, "bomb"), rt.fv(f, "name", live(f.src)), live(f.args[0])]), fmt("<span class='danger'>You open ％！ on your ＀ and fire a blast wave at ％！!</span>", [rt.sv(f, "bomb"), rt.fv(f, "name", live(f.src)), live(f.args[0])])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), "explosion", 100, 1]);
	starting = rt.getStep(f, live(f.args[1]), 0);
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.args[1])]));
	if (truthy(live(starting))) {
		$0 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(starting)), rt.fv(f, "y", live(starting)), rt.fv(f, "z", live(starting))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(starting)), rt.fv(f, "y", live(starting)), rt.fv(f, "z", live(starting))])]);
	} else {
		$0 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [(log_str = fmt("Blast wave fired at ＀ (＀) by ＀(＀) with power ＀/＀/＀.", [fmt("＀", [$0]), rt.fv(f, "name", live(A)), rt.fv(f, "name", live(f.args[1])), rt.fv(f, "ckey", live(f.args[1])), live(heavy), live(medium), live(light)]))]);
	yield* g.call(f, P("/proc/log_game"), null, [live(log_str)]);
	return f.dot;
}, true, { args: ["target", "user", "flag", "params"] });

rt.type(8902, "/obj/item/projectile/blastwave", "/obj/item/projectile", {
	heavyr: 0,
	mediumr: 0,
	lightr: 0,
	damage: 0,
	nodamage: 0,
	forcedodge: 1,
	range: 150,
	name: "blast wave",
	icon_state: "blastwave",
});

// /obj/item/projectile/blastwave/proc/Range  (code/modules/projectiles/guns/misc/blastcannon.dm:113)  may sleep
rt.def("/obj/item/projectile/blastwave/proc/Range", function* Range(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "heavyr"))) {
		yield* g.callName(f, rt.sv(f, "loc"), "ex_act", [1]);
	} else {
		if (truthy(rt.sv(f, "mediumr"))) {
			yield* g.callName(f, rt.sv(f, "loc"), "ex_act", [2]);
		} else {
			if (truthy(rt.sv(f, "lightr"))) {
				yield* g.callName(f, rt.sv(f, "loc"), "ex_act", [3]);
			} else {
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		}
	}
	rt.incSrcVar(f, "heavyr", -1, true);
	rt.incSrcVar(f, "mediumr", -1, true);
	rt.incSrcVar(f, "lightr", -1, true);
	return f.dot;
}, true);
