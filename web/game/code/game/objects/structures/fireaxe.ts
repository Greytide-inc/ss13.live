// From code/game/objects/structures/fireaxe.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12749, "/obj/structure/fireaxecabinet", "/obj/structure", {
	fireaxe: null,
	locked: 1,
	open: 0,
	anchored: 1,
	name: "fire axe cabinet",
	desc: "There is a small label that reads \"For Emergency use only\" along with details for safe use of the axe. As if.",
	icon: rt.rsc("icons/obj/wallmounts.dmi"),
	icon_state: "fireaxe",
	density: 0,
	armor: null,
	obj_integrity: 150,
	max_integrity: 150,
	integrity_failure: 50,
});

// /obj/structure/fireaxecabinet/proc/<init>  (code/game/objects/structures/fireaxe.dm:4)  may sleep
rt.def("/obj/structure/fireaxecabinet/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "fireaxe", (yield* g.new_(f, T("/obj/item/weapon/twohanded/fireaxe"), [])));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 20, "laser", 0, "energy", 100, "bomb", 10, "bio", 100, "rad", 100, "fire", 90, "acid", 50]));
	return f.dot;
}, true);

// /obj/structure/fireaxecabinet/proc/New  (code/game/objects/structures/fireaxe.dm:17)  may sleep
rt.def("/obj/structure/fireaxecabinet/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/fireaxecabinet/proc/Destroy  (code/game/objects/structures/fireaxe.dm:22)  may sleep
rt.def("/obj/structure/fireaxecabinet/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "fireaxe"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "fireaxe")]);
		rt.setSv(f, "fireaxe", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/fireaxecabinet/proc/attackby  (code/game/objects/structures/fireaxe.dm:26)  may sleep
rt.def("/obj/structure/fireaxecabinet/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, G: Value = null, F: Value = null;
	f.vars = () => [WT, G, F];
	if ((truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon/robot")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0)))) {
		yield* g.srcCall(f, "toggle_lock", live(f.args[1]));
	} else {
		if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help")) && !truthy(rt.sv(f, "broken")))) {
			WT = live(f.args[0]);
			if ((rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")) && truthy((yield* g.callName(f, live(WT), "remove_fuel", [2, live(f.args[1])]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin repairing ＀.</span>", [live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 40, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
					yield* g.srcCall(f, "update_icon");
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You repair ＀.</span>", [live(f.src)])]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is already in good condition!</span>", [live(f.src)])]);
			}
			return live(f.dot);
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/glass")) ? 1 : 0)) && truthy(rt.sv(f, "broken")))) {
				if (rt.lt((yield* g.callName(f, (G = live(f.args[0])), "get_amount", [])), 2)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need two glass sheets to fix ＀!</span>", [live(f.src)])]);
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start fixing ＀...</span>", [live(f.src)])]);
				if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(G), "use", [2]))))) {
					rt.setSv(f, "broken", 0);
					rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
					yield* g.srcCall(f, "update_icon");
				}
			} else {
				if ((truthy(rt.sv(f, "open")) || truthy(rt.sv(f, "broken")))) {
					if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/twohanded/fireaxe")) ? 1 : 0)) && !truthy(rt.sv(f, "fireaxe")))) {
						if (truthy(rt.gv(f, "wielded", (F = live(f.args[0]))))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Unwield the ＀ first.</span>", [rt.fv(f, "name", live(F))])]);
							return live(f.dot);
						}
						if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
							return live(f.dot);
						}
						rt.setSv(f, "fireaxe", live(F));
						yield* g.callName(f, live(F), "forceMove", [live(f.src)]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='caution'>You place the ＀ back in the ＀.</span>", [rt.fv(f, "name", live(F)), rt.sv(f, "name")])]);
						yield* g.srcCall(f, "update_icon");
						return live(f.dot);
					} else {
						if (!truthy(rt.sv(f, "broken"))) {
							yield* g.srcCall(f, "toggle_open");
						}
					}
				} else {
					return (yield* g.callSuper(f, [], rt.Args.Same));
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/fireaxecabinet/proc/play_attack_sound  (code/game/objects/structures/fireaxe.dm:70)
rt.def("/obj/structure/fireaxecabinet/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(rt.sv(f, "broken"))) {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 90, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/glasshit.ogg"), 90, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/structure/fireaxecabinet/proc/take_damage  (code/game/objects/structures/fireaxe.dm:82)  may sleep
rt.def("/obj/structure/fireaxecabinet/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	if (truthy(rt.sv(f, "open"))) {
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// /obj/structure/fireaxecabinet/proc/obj_break  (code/game/objects/structures/fireaxe.dm:87)  may sleep
rt.def("/obj/structure/fireaxecabinet/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if (!(!truthy(rt.sv(f, "broken")) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "broken", 1);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/glassbr3.ogg"), 100, 1]);
	yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.sv(f, "loc")]);
	yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.sv(f, "loc")]);
	return f.dot;
}, true);

// /obj/structure/fireaxecabinet/proc/deconstruct  (code/game/objects/structures/fireaxe.dm:95)  may sleep
rt.def("/obj/structure/fireaxecabinet/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if ((truthy(rt.sv(f, "fireaxe")) && truthy(rt.sv(f, "loc")))) {
			yield* g.callName(f, rt.sv(f, "fireaxe"), "forceMove", [rt.sv(f, "loc")]);
			rt.setSv(f, "fireaxe", null);
		}
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/fireaxecabinet/proc/blob_act  (code/game/objects/structures/fireaxe.dm:104)  may sleep
rt.def("/obj/structure/fireaxecabinet/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	if (truthy(rt.sv(f, "fireaxe"))) {
		yield* g.callName(f, rt.sv(f, "fireaxe"), "forceMove", [rt.sv(f, "loc")]);
		rt.setSv(f, "fireaxe", null);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/fireaxecabinet/proc/attack_hand  (code/game/objects/structures/fireaxe.dm:109)  may sleep
rt.def("/obj/structure/fireaxecabinet/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(rt.sv(f, "open")) || truthy(rt.sv(f, "broken")))) {
		if (truthy(rt.sv(f, "fireaxe"))) {
			yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "fireaxe")]);
			rt.setSv(f, "fireaxe", null);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='caution'>You take the fire axe from the ＀.</span>", [rt.sv(f, "name")])]);
			yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		}
	}
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ won't budge!</span>", [rt.sv(f, "name")])]);
		return live(f.dot);
	} else {
		rt.setSv(f, "open", (!truthy(rt.sv(f, "open")) ? 1 : 0));
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	return f.dot;
}, true);

// /obj/structure/fireaxecabinet/proc/attack_paw  (code/game/objects/structures/fireaxe.dm:126)  may sleep
rt.def("/obj/structure/fireaxecabinet/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /obj/structure/fireaxecabinet/proc/attack_ai  (code/game/objects/structures/fireaxe.dm:129)  may sleep
rt.def("/obj/structure/fireaxecabinet/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "toggle_lock", live(user));
	return live(f.dot);
}, true);

// /obj/structure/fireaxecabinet/proc/attack_tk  (code/game/objects/structures/fireaxe.dm:134)
rt.def("/obj/structure/fireaxecabinet/proc/attack_tk", function attack_tk(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "locked"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ won't budge!</span>", [rt.sv(f, "name")])]);
		return live(f.dot);
	} else {
		rt.setSv(f, "open", (!truthy(rt.sv(f, "open")) ? 1 : 0));
		rt.callSrc(f, "update_icon", []);
		return live(f.dot);
	}
	return f.dot;
});

// /obj/structure/fireaxecabinet/proc/update_icon  (code/game/objects/structures/fireaxe.dm:142)
rt.def("/obj/structure/fireaxecabinet/proc/update_icon", function update_icon(f: Frame) {
	let hp_percent: Value = null;
	let $0: any;
	f.vars = () => [hp_percent, $0];
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "fireaxe"))) {
		rt.callSrc(f, "add_overlay", ["axe"]);
	}
	if (!truthy(rt.sv(f, "open"))) {
		hp_percent = multiply(divide(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")), 100);
		if (truthy(rt.sv(f, "broken"))) {
			rt.callSrc(f, "add_overlay", ["glass4"]);
		} else {
			$0 = live(hp_percent);
			if (rt.inRange($0, -9.999999848243207e+30, 40)) {
				rt.callSrc(f, "add_overlay", ["glass3"]);
			} else if (rt.inRange($0, 40, 60)) {
				rt.callSrc(f, "add_overlay", ["glass2"]);
			} else if (rt.inRange($0, 60, 80)) {
				rt.callSrc(f, "add_overlay", ["glass1"]);
			} else if (rt.inRange($0, 80, 9.999999848243207e+30)) {
				rt.callSrc(f, "add_overlay", ["glass"]);
			}
		}
		if (truthy(rt.sv(f, "locked"))) {
			rt.callSrc(f, "add_overlay", ["locked"]);
		} else {
			rt.callSrc(f, "add_overlay", ["unlocked"]);
		}
	} else {
		rt.callSrc(f, "add_overlay", ["glass_raised"]);
	}
	return f.dot;
});

// /obj/structure/fireaxecabinet/proc/toggle_lock  (code/game/objects/structures/fireaxe.dm:167)  may sleep
rt.def("/obj/structure/fireaxecabinet/proc/toggle_lock", function* toggle_lock(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [user, $0, $1];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class = 'caution'> Resetting circuitry...</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/locktoggle.ogg"), 50, 1]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 20, "target", live(f.src)], rt.Args.Named)))) return f.dot;
	$0 = live(user);
	if (truthy(rt.sv(f, "locked"))) {
		$1 = "disable";
	} else {
		$1 = "re-enable";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='caution'>You ＀ the locking modules.</span>", [$1])]);
	rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/fireaxecabinet/verb/toggle_open  (code/game/objects/structures/fireaxe.dm:180)
rt.def("/obj/structure/fireaxecabinet/verb/toggle_open", function toggle_open(f: Frame) {
	if (truthy(rt.sv(f, "locked"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>The ＀ won't budge!</span>", [rt.sv(f, "name")])]);
		return live(f.dot);
	} else {
		rt.setSv(f, "open", (!truthy(rt.sv(f, "open")) ? 1 : 0));
		rt.callSrc(f, "update_icon", []);
		return live(f.dot);
	}
	return f.dot;
}, false, { verb: { name: "Open/Close", category: "Object", src: 3, range: 1 } });
