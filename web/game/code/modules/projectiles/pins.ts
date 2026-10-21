// From code/modules/projectiles/pins.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9151, "/obj/item/device/firing_pin", "/obj/item/device", {
	emagged: 0,
	fail_message: "<span class='warning'>INVALID USER.</span>",
	selfdestruct: 0,
	force_replace: 0,
	pin_removeable: 0,
	gun: null,
	flags: 64,
	name: "electronic firing pin",
	desc: "A small authentication device, to be inserted into a firearm receiver to allow operation. NT safety regulations require all new designs to incorporate one.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "firing_pin",
	item_state: "pen",
	origin_tech: "materials=2;combat=4",
	w_class: 1,
	attack_verb: null,
});

// /obj/item/device/firing_pin/proc/<init>  (code/modules/projectiles/pins.dm:10)
rt.def("/obj/item/device/firing_pin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("poked"));
	return f.dot;
});

// /obj/item/device/firing_pin/proc/New  (code/modules/projectiles/pins.dm:20)  may sleep
rt.def("/obj/item/device/firing_pin/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gun")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "gun", live(f.args[0]));
	return f.dot;
}, true, { args: ["newloc"] });

// /obj/item/device/firing_pin/proc/afterattack  (code/modules/projectiles/pins.dm:26)  may sleep
rt.def("/obj/item/device/firing_pin/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let G: Value = null;
	f.vars = () => [target, user, proximity_flag, G];
	if (!truthy(live(proximity_flag))) return f.dot;
	if (!truthy((rt.istype(live(target), T("/obj/item/weapon/gun")) ? 1 : 0))) return f.dot;
	if ((truthy(rt.gv(f, "pin", (G = live(target)))) && (truthy(rt.sv(f, "force_replace")) || truthy(rt.gv(f, "pin_removeable", rt.fv(f, "pin", live(G))))))) {
		rt.setFv(f, "loc", rt.fv(f, "pin", live(G)), rt.getStep(f, live(G), 0));
		yield* g.callName(f, rt.fv(f, "pin", live(G)), "gun_remove", [live(user)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class ='notice'>You remove ＀'s old pin.</span>", [live(G)])]);
	}
	if (!truthy(rt.fv(f, "pin", live(G)))) {
		if (!truthy((yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(f.src)])))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "gun_insert", live(user), live(G));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class ='notice'>You insert ＀ into ＀.</span>", [live(f.src), live(G)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class ='notice'>This firearm already has a firing pin installed.</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/device/firing_pin/proc/emag_act  (code/modules/projectiles/pins.dm:42)
rt.def("/obj/item/device/firing_pin/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "emagged", 1);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You override the authentication mechanism.</span>"]);
	return f.dot;
});

// /obj/item/device/firing_pin/proc/gun_insert  (code/modules/projectiles/pins.dm:47)  may sleep
rt.def("/obj/item/device/firing_pin/proc/gun_insert", function* gun_insert(f: Frame, user: Value, G: Value) {
	f.vars = () => [user, G];
	rt.setSv(f, "gun", live(G));
	yield* g.srcCall(f, "forceMove", rt.sv(f, "gun"));
	rt.setFv(f, "pin", rt.sv(f, "gun"), live(f.src));
	return live(f.dot);
}, true);

// /obj/item/device/firing_pin/proc/gun_remove  (code/modules/projectiles/pins.dm:53)
rt.def("/obj/item/device/firing_pin/proc/gun_remove", function gun_remove(f: Frame, user: Value) {
	rt.setFv(f, "pin", rt.sv(f, "gun"), null);
	rt.setSv(f, "gun", null);
	return live(f.dot);
});

// /obj/item/device/firing_pin/proc/auth_fail  (code/modules/projectiles/pins.dm:61)  may sleep
rt.def("/obj/item/device/firing_pin/proc/auth_fail", function* auth_fail(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "show_message", [rt.sv(f, "fail_message"), 1]);
	if (!truthy(rt.sv(f, "selfdestruct"))) return f.dot;
	yield* g.callName(f, live(user), "show_message", ["<span class='danger'>SELF-DESTRUCTING...</span><br>", 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='userdanger'>＀ explodes!</span>", [rt.sv(f, "gun")])]);
	yield* g.call(f, P("/proc/explosion"), null, [rt.getStep(f, rt.sv(f, "gun"), 0), -1, 0, 2, 3]);
	if (!truthy(rt.sv(f, "gun"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "gun")]);
	return f.dot;
}, true);

rt.type(9154, "/obj/item/device/firing_pin/test_range", "/obj/item/device/firing_pin", {
	fail_message: "<span class='warning'>TEST RANGE CHECK FAILED.</span>",
	pin_removeable: 1,
	name: "test-range firing pin",
	desc: "This safety firing pin allows weapons to be fired within proximity to a firing range.",
	origin_tech: "combat=2;materials=2",
});

// /obj/item/device/firing_pin/test_range/proc/pin_auth  (code/modules/projectiles/pins.dm:85)
rt.def("/obj/item/device/firing_pin/test_range/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [live(user), 3]), T("/obj/machinery/magnetic_controller"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		return 1;
	}
	rt.endFor(f, 0);
	return 0;
});

rt.type(9155, "/obj/item/device/firing_pin/implant", "/obj/item/device/firing_pin", {
	req_implant: null,
	fail_message: "<span class='warning'>IMPLANT CHECK FAILED.</span>",
	name: "implant-keyed firing pin",
	desc: "This is a security firing pin which only authorizes users who are implanted with a certain device.",
});

// /obj/item/device/firing_pin/implant/proc/pin_auth  (code/modules/projectiles/pins.dm:98)
rt.def("/obj/item/device/firing_pin/implant/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if (truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
		I = null;
		rt.forList(f, 0, rt.fv(f, "implants", live(user)), T("/obj/item/weapon/implant"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if ((truthy(rt.sv(f, "req_implant")) && isEqual(rt.fv(f, "type", live(I)), rt.sv(f, "req_implant")))) {
				return 1;
			}
		}
		rt.endFor(f, 0);
	}
	return 0;
});

rt.type(9158, "/obj/item/device/firing_pin/clown", "/obj/item/device/firing_pin", {
	fail_message: "<span class='warning'>HONK!</span>",
	force_replace: 1,
	name: "hilarious firing pin",
	desc: "Advanced clowntech that can convert any firearm into a far more useful object.",
	color: "#FFFF00",
});

// /obj/item/device/firing_pin/clown/proc/pin_auth  (code/modules/projectiles/pins.dm:127)
rt.def("/obj/item/device/firing_pin/clown/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/bikehorn.ogg"), 50, 1]);
	return 0;
});

rt.type(9159, "/obj/item/device/firing_pin/clown/ultra", "/obj/item/device/firing_pin/clown", {});

// /obj/item/device/firing_pin/clown/ultra/proc/pin_auth  (code/modules/projectiles/pins.dm:133)
rt.def("/obj/item/device/firing_pin/clown/ultra/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/bikehorn.ogg"), 50, 1]);
	if ((!truthy(rt.bitAnd(rt.fv(f, "disabilities", live(user)), 256)) && !(truthy(rt.fv(f, "mind", live(user))) && isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(user))), "Clown")))) {
		return 0;
	}
	return 1;
});

// /obj/item/device/firing_pin/clown/ultra/proc/gun_insert  (code/modules/projectiles/pins.dm:139)  may sleep
rt.def("/obj/item/device/firing_pin/clown/ultra/proc/gun_insert", function* gun_insert(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "clumsy_check", live(f.args[1]), 0);
	return f.dot;
}, true, { args: ["user", "G"] });

// /obj/item/device/firing_pin/clown/ultra/proc/gun_remove  (code/modules/projectiles/pins.dm:143)
rt.def("/obj/item/device/firing_pin/clown/ultra/proc/gun_remove", function gun_remove(f: Frame) {
	rt.setFv(f, "clumsy_check", rt.sv(f, "gun"), rt.initial(f, rt.sv(f, "gun"), "clumsy_check"));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["user"] });

rt.type(9161, "/obj/item/device/firing_pin/dna", "/obj/item/device/firing_pin", {
	unique_enzymes: null,
	fail_message: "<span class='warning'>DNA CHECK FAILED.</span>",
	name: "DNA-keyed firing pin",
	desc: "This is a DNA-locked firing pin which only authorizes one user. Attempt to fire once to DNA-link.",
	icon_state: "firing_pin_dna",
});

// /obj/item/device/firing_pin/dna/proc/afterattack  (code/modules/projectiles/pins.dm:162)  may sleep
rt.def("/obj/item/device/firing_pin/dna/proc/afterattack", function* afterattack(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(live(f.args[2])) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)))) return f.dot;
	if (!(truthy(rt.gv(f, "dna", (M = live(f.args[0])))) && truthy(rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(M)))))) return f.dot;
	rt.setSv(f, "unique_enzymes", rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(M))));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>DNA-LOCK SET.</span>"]);
	return f.dot;
}, true, { args: ["target", "user", "proximity_flag"] });

// /obj/item/device/firing_pin/dna/proc/pin_auth  (code/modules/projectiles/pins.dm:170)
rt.def("/obj/item/device/firing_pin/dna/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	if (((truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0)) && truthy(rt.fv(f, "dna", live(user)))) && truthy(rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(user)))))) {
		if (isEqual(rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(user))), rt.sv(f, "unique_enzymes"))) {
			return 1;
		}
	}
	return 0;
});

// /obj/item/device/firing_pin/dna/proc/auth_fail  (code/modules/projectiles/pins.dm:177)  may sleep
rt.def("/obj/item/device/firing_pin/dna/proc/auth_fail", function* auth_fail(f: Frame) {
	if (!truthy(rt.sv(f, "unique_enzymes"))) {
		if (((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)) && truthy(rt.fv(f, "dna", live(f.args[0])))) && truthy(rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(f.args[0])))))) {
			rt.setSv(f, "unique_enzymes", rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(f.args[0]))));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>DNA-LOCK SET.</span>"]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

rt.type(9163, "/obj/item/device/firing_pin/tag", "/obj/item/device/firing_pin", {
	suit_requirement: null,
	tagcolor: "",
	fail_message: "<span class='warning'>SUIT CHECK FAILED.</span>",
	name: "laser tag firing pin",
	desc: "A recreational firing pin, used in laser tag units to ensure users have their vests on.",
});

// /obj/item/device/firing_pin/tag/proc/pin_auth  (code/modules/projectiles/pins.dm:198)
rt.def("/obj/item/device/firing_pin/tag/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy(rt.op(f, "IsType", [], [rt.gv(f, "wear_suit", (M = live(user))), rt.sv(f, "suit_requirement")]))) {
			return 1;
		}
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You need to be wearing ＀ laser tag armor!</span>", [rt.sv(f, "tagcolor")])]);
	return 0;
});

// /obj/item/device/firing_pin/proc/Destroy  (code/modules/projectiles/pins.dm:219)  may sleep
rt.def("/obj/item/device/firing_pin/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "gun"))) {
		rt.setFv(f, "pin", rt.sv(f, "gun"), null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
