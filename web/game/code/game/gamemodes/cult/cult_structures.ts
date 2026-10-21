// From code/game/gamemodes/cult/cult_structures.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12167, "/obj/structure/destructible/cult", "/obj/structure/destructible", {
	cooldowntime: 0,
	anchored: 1,
	density: 1,
	icon: rt.rsc("icons/obj/cult.dmi"),
	break_sound: rt.rsc("sound/hallucinations/veryfar_noise.ogg"),
	debris: null,
});

// /obj/structure/destructible/cult/proc/<init>  (code/game/gamemodes/cult/cult_structures.dm:7)
rt.def("/obj/structure/destructible/cult/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "debris", rt.alist(f, [T("/obj/item/stack/sheet/runed_metal"), 1]));
	return f.dot;
});

// /obj/structure/destructible/cult/proc/examine  (code/game/gamemodes/cult/cult_structures.dm:10)
rt.def("/obj/structure/destructible/cult/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	$1 = live(f.src);
	if (truthy(rt.sv(f, "anchored"))) {
		$1 = $1;
		$2 = "";
	} else {
		$2 = "not ";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＄！ is ＀secured to the floor.</span>", [$1, $2])]);
	if (!((truthy(rt.call(f, P("/proc/iscultist"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0))) && rt.gt(rt.sv(f, "cooldowntime"), rt.worldTime(f)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='cultitalic'>The magic in ＀ is too weak, ＀ will be ready to use again in ＀.</span>", [live(f.src), rt.callSrc(f, "p_they", []), rt.callSrc(f, "getETA", [])])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/destructible/cult/proc/examine_status  (code/game/gamemodes/cult/cult_structures.dm:16)
rt.def("/obj/structure/destructible/cult/proc/examine_status", function examine_status(f: Frame) {
	let t_It: Value = null, t_is: Value = null;
	f.vars = () => [t_It, t_is];
	if ((truthy(rt.call(f, P("/proc/iscultist"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) {
		t_It = rt.callSrc(f, "p_they", [1]);
		t_is = rt.callSrc(f, "p_are", []);
		return fmt("<span class='cult'>＀ ＀ at <b>＀%</b> stability.</span>", [live(t_It), live(t_is), rt.call(f, P("/proc/round"), null, [divide(multiply(rt.sv(f, "obj_integrity"), 100), rt.sv(f, "max_integrity"))])]);
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user"] });

// /obj/structure/destructible/cult/proc/attack_animal  (code/game/gamemodes/cult/cult_structures.dm:23)  may sleep
rt.def("/obj/structure/destructible/cult/proc/attack_animal", function* attack_animal(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/hostile/construct/builder")) ? 1 : 0))) {
		if (rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity"))) {
			yield* g.callName(f, live(f.args[0]), "changeNext_move", [8]);
			rt.setSv(f, "obj_integrity", (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "max_integrity"), add(rt.sv(f, "obj_integrity"), 5)])));
			yield* g.callSrc(f, "Beam", [null, live(f.args[0]), "icon_state", "sendbeam", "time", 4], rt.Args.Named);
			yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ repairs ％<b>！</b>.</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='cult'>You repair <b>＀</b>, leaving ＀ at <b>＀%</b> stability.</span>", [live(f.src), (yield* g.srcCall(f, "p_they")), (yield* g.call(f, P("/proc/round"), null, [divide(multiply(rt.sv(f, "obj_integrity"), 100), rt.sv(f, "max_integrity"))]))])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='cult'>You cannot repair ＀, as ＀ ＀ undamaged!</span>", [live(f.src), (yield* g.srcCall(f, "p_they")), (yield* g.srcCall(f, "p_are"))])]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M"] });

// /obj/structure/destructible/cult/proc/attackby  (code/game/gamemodes/cult/cult_structures.dm:36)  may sleep
rt.def("/obj/structure/destructible/cult/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [$0, $1, $2, $3];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/tome")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[1])]))))) {
		rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
		$0 = live(f.args[1]);
		if (truthy(rt.sv(f, "anchored"))) {
			$1 = "";
		} else {
			$1 = "un";
		}
		$2 = live(f.src);
		if (truthy(rt.sv(f, "anchored"))) {
			$3 = "to";
		} else {
			$3 = "from";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀secure ％！ ＀ the floor.</span>", [$1, $2, $3])]);
		if (!truthy(rt.sv(f, "anchored"))) {
			rt.setSv(f, "icon_state", fmt("＀_off", [rt.initial(f, live(f.src), "icon_state")]));
		} else {
			rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/destructible/cult/proc/ratvar_act  (code/game/gamemodes/cult/cult_structures.dm:47)  may sleep
rt.def("/obj/structure/destructible/cult/proc/ratvar_act", function* ratvar_act(f: Frame) {
	let previouscolor: Value = null;
	f.vars = () => [previouscolor];
	if (!(truthy((yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/rand"), null, [25, 50])), "fire"))) && truthy(live(f.src)))) return f.dot;
	previouscolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#FAE48C");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(previouscolor), "time", 8]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
	return f.dot;
}, true);

// /obj/structure/destructible/cult/proc/getETA  (code/game/gamemodes/cult/cult_structures.dm:54)
rt.def("/obj/structure/destructible/cult/proc/getETA", function getETA(f: Frame) {
	let time: Value = null, eta: Value = null;
	f.vars = () => [time, eta];
	time = divide(subtract(rt.sv(f, "cooldowntime"), rt.worldTime(f)), 600);
	eta = fmt("＀ minutes", [rt.call(f, P("/proc/round"), null, [live(time), 1])]);
	if (rt.le(live(time), 1)) {
		eta = fmt("＀ seconds", [rt.call(f, P("/proc/round"), null, [(time = multiply(subtract(rt.sv(f, "cooldowntime"), rt.worldTime(f)), 0.10000000149011612)), 1])]);
	}
	return live(eta);
});

rt.type(12168, "/obj/structure/destructible/cult/talisman", "/obj/structure/destructible/cult", {
	name: "altar",
	desc: "A bloodstained altar dedicated to Nar-Sie.",
	icon_state: "talismanaltar",
	break_message: "<span class='warning'>The altar shatters, leaving only the wailing of the damned!</span>",
});

// /obj/structure/destructible/cult/talisman/proc/attack_hand  (code/game/gamemodes/cult/cult_structures.dm:68)  may sleep
rt.def("/obj/structure/destructible/cult/talisman/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let choice: Value = null, pickedtype: Value = null, N: Value = null;
	let $0: any;
	f.vars = () => [user, choice, pickedtype, N, $0];
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You're pretty sure you know exactly what this is used for and you can't seem to touch it.</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "anchored"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>You need to anchor ＀ to the floor with a tome first.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "cooldowntime"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>The magic in ＀ is weak, it will be ready to use again in ＀.</span>", [live(f.src), (yield* g.srcCall(f, "getETA"))])]);
		return live(f.dot);
	}
	choice = (yield* g.call(f, P("/proc/alert"), null, [live(user), "You study the schematics etched into the forge...", null, "Eldritch Whetstone", "Zealot's Blindfold", "Flask of Unholy Water"]));
	pickedtype = null;
	$0 = live(choice);
	if ($0 === "Eldritch Whetstone") {
		pickedtype = T("/obj/item/weapon/sharpener/cult");
	} else if ($0 === "Zealot's Blindfold") {
		pickedtype = T("/obj/item/clothing/glasses/night/cultblind");
	} else if ($0 === "Flask of Unholy Water") {
		pickedtype = T("/obj/item/weapon/reagent_containers/food/drinks/bottle/unholywater");
	}
	if (!(((((((truthy(live(f.src)) && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) && truthy(rt.sv(f, "anchored"))) && truthy(live(pickedtype))) && truthy((yield* g.srcCall(f, "Adjacent", live(user))))) && !truthy((yield* g.callName(f, live(user), "incapacitated", [])))) && truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) && rt.le(rt.sv(f, "cooldowntime"), rt.worldTime(f)))) return f.dot;
	rt.setSv(f, "cooldowntime", add(rt.worldTime(f), 2400));
	N = (yield* g.new_(f, live(pickedtype), [rt.getStep(f, live(f.src), 0)]));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>You kneel before the altar and your faith is rewarded with an ＀!</span>", [live(N)])]);
	return f.dot;
}, true);

rt.type(12169, "/obj/structure/destructible/cult/forge", "/obj/structure/destructible/cult", {
	light_range: 3,
	light_color: "#C48A18",
	name: "daemon forge",
	desc: "A forge used in crafting the unholy weapons used by the armies of Nar-Sie.",
	icon_state: "forge",
	break_message: "<span class='warning'>The force breaks apart into shards with a howling scream!</span>",
});

// /obj/structure/destructible/cult/forge/proc/attack_hand  (code/game/gamemodes/cult/cult_structures.dm:101)  may sleep
rt.def("/obj/structure/destructible/cult/forge/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let choice: Value = null, pickedtype: Value = null, N: Value = null;
	let $0: any;
	f.vars = () => [user, choice, pickedtype, N, $0];
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The heat radiating from ＀ pushes you back.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "anchored"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>You need to anchor ＀ to the floor with a tome first.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "cooldowntime"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>The magic in ＀ is weak, it will be ready to use again in ＀.</span>", [live(f.src), (yield* g.srcCall(f, "getETA"))])]);
		return live(f.dot);
	}
	choice = (yield* g.call(f, P("/proc/alert"), null, [live(user), "You study the schematics etched into the forge...", null, "Shielded Robe", "Flagellant's Robe", "Nar-Sien Hardsuit"]));
	pickedtype = null;
	$0 = live(choice);
	if ($0 === "Shielded Robe") {
		pickedtype = T("/obj/item/clothing/suit/hooded/cultrobes/cult_shield");
	} else if ($0 === "Flagellant's Robe") {
		pickedtype = T("/obj/item/clothing/suit/hooded/cultrobes/berserker");
	} else if ($0 === "Nar-Sien Hardsuit") {
		pickedtype = T("/obj/item/clothing/suit/space/hardsuit/cult");
	}
	if (!(((((((truthy(live(f.src)) && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) && truthy(rt.sv(f, "anchored"))) && truthy(live(pickedtype))) && truthy((yield* g.srcCall(f, "Adjacent", live(user))))) && !truthy((yield* g.callName(f, live(user), "incapacitated", [])))) && truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) && rt.le(rt.sv(f, "cooldowntime"), rt.worldTime(f)))) return f.dot;
	rt.setSv(f, "cooldowntime", add(rt.worldTime(f), 2400));
	N = (yield* g.new_(f, live(pickedtype), [rt.getStep(f, live(f.src), 0)]));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>You work the forge as dark knowledge guides your hands, creating ＀!</span>", [live(N)])]);
	return f.dot;
}, true);

rt.type(12170, "/obj/structure/destructible/cult/pylon", "/obj/structure/destructible/cult", {
	heal_delay: 25,
	last_heal: 0,
	corrupt_delay: 50,
	last_corrupt: 0,
	light_range: 5,
	light_color: "#FA8282",
	name: "pylon",
	desc: "A floating crystal that slowly heals those faithful to Nar'Sie.",
	icon_state: "pylon",
	break_sound: rt.rsc("sound/effects/glassbr2.ogg"),
	break_message: "<span class='warning'>The blood-red crystal falls to the floor and shatters!</span>",
});

// /obj/structure/destructible/cult/pylon/proc/New  (code/game/gamemodes/cult/cult_structures.dm:140)  may sleep
rt.def("/obj/structure/destructible/cult/pylon/proc/New", function* New(f: Frame) {
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/destructible/cult/pylon/proc/Destroy  (code/game/gamemodes/cult/cult_structures.dm:144)  may sleep
rt.def("/obj/structure/destructible/cult/pylon/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/destructible/cult/pylon/proc/process  (code/game/gamemodes/cult/cult_structures.dm:148)  may sleep
rt.def("/obj/structure/destructible/cult/pylon/proc/process", function* process(f: Frame) {
	let L: Value = null, M: Value = null, validturfs: Value = null, cultturfs: Value = null, _T: Value = null, F: Value = null;
	let $e: any;
	f.vars = () => [L, M, validturfs, cultturfs, _T, F, $e];
	if (!truthy(rt.sv(f, "anchored"))) {
		return live(f.dot);
	}
	if (rt.le(rt.sv(f, "last_heal"), rt.worldTime(f))) {
		rt.setSv(f, "last_heal", add(rt.worldTime(f), rt.sv(f, "heal_delay")));
		L = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [5, live(f.src)])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (((truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(L)]))) || truthy((rt.istype(live(L), T("/mob/living/simple_animal/shade")) ? 1 : 0))) || truthy((rt.istype(live(L), T("/mob/living/simple_animal/hostile/construct")) ? 1 : 0)))) {
				if (!isEqual(rt.fv(f, "health", live(L)), rt.fv(f, "maxHealth", live(L)))) {
					yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [rt.getStep(f, live(f.src), 0), "#960000"]);
					if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
						yield* g.callName(f, live(L), "adjustBruteLoss", [-1, 0]);
						yield* g.callName(f, live(L), "adjustFireLoss", [-1, 0]);
						yield* g.callName(f, live(L), "updatehealth", []);
					}
					if ((truthy((rt.istype(live(L), T("/mob/living/simple_animal/shade")) ? 1 : 0)) || truthy((rt.istype(live(L), T("/mob/living/simple_animal/hostile/construct")) ? 1 : 0)))) {
						if (rt.lt(rt.gv(f, "health", (M = live(L))), rt.fv(f, "maxHealth", live(M)))) {
							yield* g.callName(f, live(M), "adjustHealth", [-1]);
						}
					}
				}
				if ((truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0)) && rt.lt(rt.fv(f, "blood_volume", live(L)), 560))) {
					rt.modField(f, live(L), "blood_volume", 1, add);
				}
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
	}
	if (!rt.le(rt.sv(f, "last_corrupt"), rt.worldTime(f))) return f.dot;
	validturfs = rt.list();
	cultturfs = rt.list();
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/circleviewturfs"), null, [live(f.src), 5])));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy((rt.istype(live(_T), T("/turf/open/floor/engine/cult")) ? 1 : 0))) {
			(cultturfs = rt.modify(live(cultturfs), live(_T), rt.bitOr));
			continue;
		}
		if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(_T), rt.gl("blacklisted_pylon_turfs")])))) {
			continue;
		}
		(validturfs = rt.modify(live(validturfs), live(_T), rt.bitOr));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "last_corrupt", add(rt.worldTime(f), rt.sv(f, "corrupt_delay")));
	if (truthy((_T = (yield* g.call(f, P("/proc/safepick"), null, [live(validturfs)]))))) {
		yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/open/floor/engine/cult")]);
	} else {
		if (truthy((F = (yield* g.call(f, P("/proc/safepick"), null, [live(cultturfs)]))))) {
			yield* g.new_(f, T("/obj/effect/temp_visual/cult/turf/floor"), [live(F)]);
		} else {
			rt.setSv(f, "last_corrupt", add(rt.worldTime(f), multiply(rt.sv(f, "corrupt_delay"), 2)));
		}
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(12171, "/obj/structure/destructible/cult/tome", "/obj/structure/destructible/cult", {
	light_range: 1.4,
	light_color: "#FAA019",
	name: "archives",
	desc: "A desk covered in arcane manuscripts and tomes in unknown languages. Looking at the text makes your skin crawl.",
	icon_state: "tomealtar",
	break_message: "<span class='warning'>The books and tomes of the archives burn into ash as the desk shatters!</span>",
});

// /obj/structure/destructible/cult/tome/proc/attack_hand  (code/game/gamemodes/cult/cult_structures.dm:208)  may sleep
rt.def("/obj/structure/destructible/cult/tome/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let choice: Value = null, pickedtype: Value = null, N: Value = null, D: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, choice, pickedtype, N, D, $0, $e];
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>All of these books seem to be gibberish.</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "anchored"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>You need to anchor ＀ to the floor with a tome first.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "cooldowntime"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>The magic in ＀ is weak, it will be ready to use again in ＀.</span>", [live(f.src), (yield* g.srcCall(f, "getETA"))])]);
		return live(f.dot);
	}
	choice = (yield* g.call(f, P("/proc/alert"), null, [live(user), "You flip through the black pages of the archives...", null, "Supply Talisman", "Shuttle Curse", "Veil Walker Set"]));
	pickedtype = rt.list();
	$0 = live(choice);
	if ($0 === "Supply Talisman") {
		pickedtype = rt.modify(live(pickedtype), T("/obj/item/weapon/paper/talisman/supply/weak"), add);
	} else if ($0 === "Shuttle Curse") {
		pickedtype = rt.modify(live(pickedtype), T("/obj/item/device/shuttle_curse"), add);
	} else if ($0 === "Veil Walker Set") {
		pickedtype = rt.modify(live(pickedtype), T("/obj/item/device/cult_shift"), add);
		pickedtype = rt.modify(live(pickedtype), T("/obj/item/device/flashlight/flare/culttorch"), add);
	}
	if (!(((((((truthy(live(f.src)) && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) && truthy(rt.sv(f, "anchored"))) && truthy(rt.len(f, live(pickedtype)))) && truthy((yield* g.srcCall(f, "Adjacent", live(user))))) && !truthy((yield* g.callName(f, live(user), "incapacitated", [])))) && truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) && rt.le(rt.sv(f, "cooldowntime"), rt.worldTime(f)))) return f.dot;
	rt.setSv(f, "cooldowntime", add(rt.worldTime(f), 2400));
	N = null;
	rt.forList(f, 0, live(pickedtype));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		D = (yield* g.new_(f, live(N), [rt.getStep(f, live(f.src), 0)]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>You summon ＀ from the archives!</span>", [live(D)])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
