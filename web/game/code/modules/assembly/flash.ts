// From code/modules/assembly/flash.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9369, "/obj/item/device/assembly/flash", "/obj/item/device/assembly", {
	times_used: 0,
	last_used: 0,
	name: "flash",
	desc: "A powerful and versatile flashbulb device, with applications ranging from disorienting attackers to acting as visual receptors in robot production.",
	icon_state: "flash",
	item_state: "flashtool",
	throwforce: 0,
	w_class: 1,
	materials: null,
	origin_tech: "magnets=2;combat=1",
	crit_fail: 0,
});

// /obj/item/device/assembly/flash/proc/<init>  (code/modules/assembly/flash.dm:8)
rt.def("/obj/item/device/assembly/flash/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 300, "$glass", 300]));
	return f.dot;
});

// /obj/item/device/assembly/flash/proc/update_icon  (code/modules/assembly/flash.dm:17)  may sleep
rt.def("/obj/item/device/assembly/flash/proc/update_icon", function* update_icon(f: Frame, flash: Value) {
	f.vars = () => [flash];
	if (live(flash) === null) {
		flash = 0;
	}
	yield* g.srcCall(f, "cut_overlays");
	rt.setSv(f, "attached_overlays", rt.list());
	if (truthy(rt.sv(f, "crit_fail"))) {
		yield* g.srcCall(f, "add_overlay", "flashburnt");
		rt.modSrcVar(f, "attached_overlays", "flashburnt", add);
	}
	if (truthy(live(flash))) {
		yield* g.srcCall(f, "add_overlay", "flash-f");
		rt.modSrcVar(f, "attached_overlays", "flash-f", add);
		rt.spawnTail(f, 5, "/obj/item/device/assembly/flash/proc/update_icon: spawn at modules/assembly/flash.dm:26", flash);
	}
	if (!truthy(rt.sv(f, "holder"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "holder"), "update_icon", []);
	return f.dot;
}, true);

// a spawn(5) body of /obj/item/device/assembly/flash/proc/update_icon, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/flash/proc/update_icon: spawn at modules/assembly/flash.dm:26", function* (f: Frame, flash: Value) {
	f.vars = () => [flash];
	yield* g.srcCall(f, "update_icon");
	return null;
});

// /obj/item/device/assembly/flash/proc/clown_check  (code/modules/assembly/flash.dm:32)  may sleep
rt.def("/obj/item/device/assembly/flash/proc/clown_check", function* clown_check(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(user)), 256)) && truthy(rt.op(f, "Prob", [], [50])))) {
		yield* g.srcCall(f, "flash_carbon", live(user), live(user), 15, 0);
		return 0;
	}
	return 1;
}, true);

// /obj/item/device/assembly/flash/proc/activate  (code/modules/assembly/flash.dm:38)  may sleep
rt.def("/obj/item/device/assembly/flash/proc/activate", function* activate(f: Frame) {
	let _T: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [_T, M, $e];
	if (!truthy((yield* g.srcCall(f, "try_use_flash")))) {
		return 0;
	}
	yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "visible_message", [fmt("<span class='disarm'>＀ emits a blinding light!</span>", [live(f.src)])]);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [3, live(_T)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.srcCall(f, "flash_carbon", live(M), null, 5, 0);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/device/assembly/flash/proc/burn_out  (code/modules/assembly/flash.dm:47)  may sleep
rt.def("/obj/item/device/assembly/flash/proc/burn_out", function* burn_out(f: Frame) {
	let M: Value = null, _T: Value = null;
	f.vars = () => [M, _T];
	if (!truthy(rt.sv(f, "crit_fail"))) {
		rt.setSv(f, "crit_fail", 1);
		yield* g.srcCall(f, "update_icon");
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		yield* g.callName(f, (M = rt.sv(f, "loc")), "visible_message", [fmt("<span class='danger'>＀ burns out!</span>", [live(f.src)]), fmt("<span class='userdanger'>＀ burns out!</span>", [live(f.src)])]);
	} else {
		yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "visible_message", [fmt("<span class='danger'>＀ burns out!</span>", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/item/device/assembly/flash/proc/flash_recharge  (code/modules/assembly/flash.dm:59)  may sleep
rt.def("/obj/item/device/assembly/flash/proc/flash_recharge", function* flash_recharge(f: Frame, interval: Value) {
	let deciseconds_passed: Value = null, seconds: Value = null;
	f.vars = () => [interval, deciseconds_passed, seconds];
	if (live(interval) === null) {
		interval = 10;
	}
	if (truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "times_used"), 3)]))) {
		yield* g.srcCall(f, "burn_out");
		return 0;
	}
	deciseconds_passed = subtract(rt.worldTime(f), rt.sv(f, "last_used"));
	seconds = null;
	seconds = divide(live(deciseconds_passed), 10);
	while (rt.ge(live(seconds), live(interval))) {
		rt.incSrcVar(f, "times_used", -1, true);
		(seconds = rt.modify(live(seconds), live(interval), subtract));
	}
	rt.setSv(f, "last_used", rt.worldTime(f));
	rt.setSv(f, "times_used", (yield* g.call(f, P("/proc/max"), null, [0, rt.sv(f, "times_used")])));
	return 1;
}, true);

// /obj/item/device/assembly/flash/proc/try_use_flash  (code/modules/assembly/flash.dm:72)  may sleep
rt.def("/obj/item/device/assembly/flash/proc/try_use_flash", function* try_use_flash(f: Frame, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = null;
	}
	yield* g.srcCall(f, "flash_recharge", 10);
	if (truthy(rt.sv(f, "crit_fail"))) {
		return 0;
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/flash.ogg"), 100, 1]);
	yield* g.srcCall(f, "update_icon", 1);
	rt.incSrcVar(f, "times_used", 1, true);
	if ((truthy(live(user)) && !truthy((yield* g.srcCall(f, "clown_check", live(user)))))) {
		return 0;
	}
	return 1;
}, true);

// /obj/item/device/assembly/flash/proc/flash_carbon  (code/modules/assembly/flash.dm:88)  may sleep
rt.def("/obj/item/device/assembly/flash/proc/flash_carbon", function* flash_carbon(f: Frame, M: Value, user: Value, power: Value, targeted: Value) {
	f.vars = () => [M, user, power, targeted];
	if (live(user) === null) {
		user = null;
	}
	if (live(power) === null) {
		power = 15;
	}
	if (live(targeted) === null) {
		targeted = 1;
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "flashed", live(f.src)]);
	if ((truthy(live(user)) && truthy(live(targeted)))) {
		if (truthy((yield* g.callName(f, live(M), "flash_act", [1, 1])))) {
			rt.modField(f, live(M), "confused", live(power), add);
			yield* g.srcCall(f, "terrible_conversion_proc", live(M), live(user));
			yield* g.callName(f, live(M), "Knockdown", [(yield* g.call(f, P("/proc/rand"), null, [80, 120]))]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='disarm'>＀ blinds ＀ with the flash!</span>", [live(user), live(M)]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>You blind ＀ with the flash!</span>", [live(M)])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>＀ blinds you with the flash!</span>", [live(user)])]);
		} else {
			yield* g.srcCall(f, "visible_message", fmt("<span class='disarm'>＀ fails to blind ＀ with the flash!</span>", [live(user), live(M)]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You fail to blind ＀ with the flash!</span>", [live(M)])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='danger'>＀ fails to blind you with the flash!</span>", [live(user)])]);
		}
	} else {
		if (!truthy((yield* g.callName(f, live(M), "flash_act", [])))) return f.dot;
		rt.modField(f, live(M), "confused", live(power), add);
	}
	return f.dot;
}, true);

// /obj/item/device/assembly/flash/proc/attack  (code/modules/assembly/flash.dm:106)  may sleep
rt.def("/obj/item/device/assembly/flash/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let R: Value = null;
	f.vars = () => [M, user, R];
	if (!truthy((yield* g.srcCall(f, "try_use_flash", live(user))))) {
		return 0;
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.srcCall(f, "flash_carbon", live(M), live(user), 5, 1);
		return 1;
	} else {
		if (truthy((rt.istype(live(M), T("/mob/living/silicon")) ? 1 : 0))) {
			R = live(M);
			yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(R), "flashed", live(f.src)]);
			yield* g.srcCall(f, "update_icon", 1);
			yield* g.callName(f, live(M), "Knockdown", [(yield* g.call(f, P("/proc/rand"), null, [80, 120]))]);
			rt.modField(f, live(R), "confused", 5, add);
			yield* g.callName(f, live(R), "flash_act", ["affect_silicon", 1], rt.Args.Named);
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='disarm'>＀ overloads ＀'s sensors with the flash!</span>", [live(user), live(R)]), fmt("<span class='danger'>You overload ＀'s sensors with the flash!</span>", [live(R)])]);
			return 1;
		}
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='disarm'>＀ fails to blind ＀ with the flash!</span>", [live(user), live(M)]), fmt("<span class='warning'>You fail to blind ＀ with the flash!</span>", [live(M)])]);
	return f.dot;
}, true);

// /obj/item/device/assembly/flash/proc/attack_self  (code/modules/assembly/flash.dm:129)  may sleep
rt.def("/obj/item/device/assembly/flash/proc/attack_self", function* attack_self(f: Frame, user: Value, flag: Value, emp: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [user, flag, emp, M, $e];
	if (live(flag) === null) {
		flag = 0;
	}
	if (live(emp) === null) {
		emp = 0;
	}
	if (truthy(rt.sv(f, "holder"))) {
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "try_use_flash", live(user))))) {
		return 0;
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='disarm'>＀'s flash emits a blinding light!</span>", [live(user)]), "<span class='danger'>Your flash emits a blinding light!</span>"]);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oviewers"), null, [3, null])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.srcCall(f, "flash_carbon", live(M), live(user), 1, 0);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/device/assembly/flash/proc/emp_act  (code/modules/assembly/flash.dm:137)  may sleep
rt.def("/obj/item/device/assembly/flash/proc/emp_act", function* emp_act(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "try_use_flash")))) {
		return 0;
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.srcCall(f, "flash_carbon", rt.sv(f, "loc"), null, 10, 0);
	}
	yield* g.srcCall(f, "burn_out");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/item/device/assembly/flash/proc/terrible_conversion_proc  (code/modules/assembly/flash.dm:146)  may sleep
rt.def("/obj/item/device/assembly/flash/proc/terrible_conversion_proc", function* terrible_conversion_proc(f: Frame, H: Value, user: Value) {
	let resisted: Value = null;
	f.vars = () => [H, user, resisted];
	if (!((truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) && !isEqual(rt.fv(f, "stat", live(H)), 2))) return f.dot;
	if (!(truthy(rt.fv(f, "mind", live(user))) && truthy((rt.isIn(f, rt.fv(f, "mind", live(user)), rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)))) return f.dot;
	if (truthy(rt.fv(f, "client", live(H)))) {
		if (isEqual(rt.fv(f, "stat", live(H)), 0)) {
			yield* g.callName(f, live(H), "mind_initialize", []);
			resisted = null;
			if (!truthy((yield* g.callName(f, live(H), "isloyal", [])))) {
				if (truthy((rt.isIn(f, rt.fv(f, "mind", live(user)), rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
					if (truthy((yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_revolutionary", [rt.fv(f, "mind", live(H))])))) {
						yield* g.callName(f, live(H), "Stun", [60]);
						rt.incSrcVar(f, "times_used", -1, true);
					} else {
						resisted = 1;
					}
				}
			} else {
				resisted = 1;
			}
			if (truthy(live(resisted))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This mind seems resistant to the flash!</span>"]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>They must be conscious before you can convert them!</span>"]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This mind is so vacant that it is not susceptible to influence!</span>"]);
	}
	return f.dot;
}, true);

rt.type(9370, "/obj/item/device/assembly/flash/cyborg", "/obj/item/device/assembly/flash", {
	origin_tech: null,
});

// /obj/item/device/assembly/flash/cyborg/proc/attack  (code/modules/assembly/flash.dm:174)  may sleep
rt.def("/obj/item/device/assembly/flash/cyborg/proc/attack", function* attack(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/effect/temp_visual/borgflash"), [rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/device/assembly/flash/cyborg/proc/attack_self  (code/modules/assembly/flash.dm:178)  may sleep
rt.def("/obj/item/device/assembly/flash/cyborg/proc/attack_self", function* attack_self(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/effect/temp_visual/borgflash"), [rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(9373, "/obj/item/device/assembly/flash/armimplant", "/obj/item/device/assembly/flash", {
	flashcd: 20,
	overheat: 0,
	I: null,
	name: "photon projector",
	desc: "A high-powered photon projector implant normally used for lighting purposes, but also doubles as a flashbulb weapon. Self-repair protocals fix the flashbulb if it ever burns out.",
});

// /obj/item/device/assembly/flash/armimplant/proc/burn_out  (code/modules/assembly/flash.dm:201)  may sleep
rt.def("/obj/item/device/assembly/flash/armimplant/proc/burn_out", function* burn_out(f: Frame) {
	if ((truthy(rt.sv(f, "I")) && truthy(rt.fv(f, "owner", rt.sv(f, "I"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", rt.sv(f, "I")), "<span class='warning'>Your photon projector implant overheats and deactivates!</span>"]);
		yield* g.callName(f, rt.sv(f, "I"), "Retract", []);
	}
	rt.setSv(f, "overheat", 0);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/device/assembly/flash/armimplant/proc/cooldown")])), multiply(rt.sv(f, "flashcd"), 2)]);
	return f.dot;
}, true);

// /obj/item/device/assembly/flash/armimplant/proc/try_use_flash  (code/modules/assembly/flash.dm:209)  may sleep
rt.def("/obj/item/device/assembly/flash/armimplant/proc/try_use_flash", function* try_use_flash(f: Frame, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = null;
	}
	if (truthy(rt.sv(f, "overheat"))) {
		if ((truthy(rt.sv(f, "I")) && truthy(rt.fv(f, "owner", rt.sv(f, "I"))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", rt.sv(f, "I")), "<span class='warning'>Your photon projector is running too hot to be used again so quickly!</span>"]);
		}
		return 0;
	}
	rt.setSv(f, "overheat", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/device/assembly/flash/armimplant/proc/cooldown")])), rt.sv(f, "flashcd")]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/flash.ogg"), 100, 1]);
	yield* g.srcCall(f, "update_icon", 1);
	return 1;
}, true);

rt.type(9374, "/obj/item/device/assembly/flash/shield", "/obj/item/device/assembly/flash", {
	throw_speed: 2,
	throw_range: 3,
	name: "strobe shield",
	desc: "A shield with a built in, high intensity light capable of blinding and disorienting suspects. Takes regular handheld flashes as bulbs.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "flashshield",
	item_state: "flashshield",
	slot_flags: 1024,
	force: 10,
	throwforce: 5,
	w_class: 4,
	materials: null,
	origin_tech: "materials=3;combat=4",
	attack_verb: null,
	block_chance: 50,
	armor: null,
});

// /obj/item/device/assembly/flash/shield/proc/<init>  (code/modules/assembly/flash.dm:234)
rt.def("/obj/item/device/assembly/flash/shield/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 7500, "$metal", 1000]));
	rt.setSv(f, "attack_verb", rt.list("shoved", "bashed"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 0, "bomb", 30, "bio", 0, "rad", 0, "fire", 80, "acid", 70]));
	return f.dot;
});

// /obj/item/device/assembly/flash/shield/proc/flash_recharge  (code/modules/assembly/flash.dm:241)  may sleep
rt.def("/obj/item/device/assembly/flash/shield/proc/flash_recharge", function* flash_recharge(f: Frame, interval: Value) {
	f.vars = () => [interval];
	if (live(interval) === null) {
		interval = 10;
	}
	if (rt.ge(rt.sv(f, "times_used"), 4)) {
		yield* g.srcCall(f, "burn_out");
		return 0;
	}
	return 1;
}, true);

// /obj/item/device/assembly/flash/shield/proc/attackby  (code/modules/assembly/flash.dm:247)  may sleep
rt.def("/obj/item/device/assembly/flash/shield/proc/attackby", function* attackby(f: Frame) {
	let flash: Value = null;
	f.vars = () => [flash];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/flash/handheld")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "crit_fail", (flash = live(f.args[0]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "No sense replacing it with a broken bulb."]);
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "You begin to replace the bulb."]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
				if (((truthy(rt.fv(f, "crit_fail", live(flash))) || !truthy(live(flash))) || (!truthy(live(flash)) || truthy(rt.fv(f, "gc_destroyed", live(flash)))))) {
					return live(f.dot);
				}
				rt.setSv(f, "crit_fail", 0);
				rt.setSv(f, "times_used", 0);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
				yield* g.srcCall(f, "update_icon");
				rt.setFv(f, "crit_fail", live(flash), 1);
				yield* g.callName(f, live(flash), "update_icon", []);
				return live(f.dot);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["W", "user"] });

// /obj/item/device/assembly/flash/shield/proc/update_icon  (code/modules/assembly/flash.dm:267)  may sleep
rt.def("/obj/item/device/assembly/flash/shield/proc/update_icon", function* update_icon(f: Frame, flash: Value) {
	f.vars = () => [flash];
	if (live(flash) === null) {
		flash = 0;
	}
	rt.setSv(f, "item_state", "flashshield");
	rt.setSv(f, "item_state", "flashshield");
	if (truthy(rt.sv(f, "crit_fail"))) {
		rt.setSv(f, "icon_state", "riot");
		rt.setSv(f, "item_state", "riot");
	} else {
		if (truthy(live(flash))) {
			rt.setSv(f, "item_state", "flashshield_flash");
			rt.setSv(f, "item_state", "flashshield_flash");
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/device/assembly/flash/shield/proc/update_icon")])), 5]);
		}
	}
	if (!truthy(rt.sv(f, "holder"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "holder"), "update_icon", []);
	return f.dot;
}, true);

// /obj/item/device/assembly/flash/shield/proc/hit_reaction  (code/modules/assembly/flash.dm:282)  may sleep
rt.def("/obj/item/device/assembly/flash/shield/proc/hit_reaction", function* hit_reaction(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = "the attack";
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 0;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 1;
	}
	yield* g.srcCall(f, "activate");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });
