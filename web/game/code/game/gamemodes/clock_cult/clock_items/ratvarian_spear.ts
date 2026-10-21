// From code/game/gamemodes/clock_cult/clock_items/ratvarian_spear.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8961, "/obj/item/clockwork/ratvarian_spear", "/obj/item/clockwork", {
	impale_cooldown: 50,
	attack_cooldown: 10,
	timerid: null,
	clockwork_desc: "A powerful spear of Ratvarian making. It's more effective against enemy cultists and silicons.",
	name: "ratvarian spear",
	desc: "A razor-sharp spear made of brass. It thrums with barely-contained energy.",
	icon: rt.rsc("icons/obj/clockwork_objects.dmi"),
	icon_state: "ratvarian_spear",
	item_state: "ratvarian_spear",
	force: 15,
	throwforce: 40,
	sharpness: 2,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	w_class: 4,
});

// /obj/item/clockwork/ratvarian_spear/proc/Destroy  (code/game/gamemodes/clock_cult/clock_items/ratvarian_spear.dm:20)  may sleep
rt.def("/obj/item/clockwork/ratvarian_spear/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "timerid")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clockwork/ratvarian_spear/proc/ratvar_act  (code/game/gamemodes/clock_cult/clock_items/ratvarian_spear.dm:28)  may sleep
rt.def("/obj/item/clockwork/ratvarian_spear/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.setSv(f, "force", 25);
		rt.setSv(f, "throwforce", 50);
		rt.setSv(f, "armour_penetration", 10);
		rt.setSv(f, "clockwork_desc", rt.initial(f, live(f.src), "clockwork_desc"));
		yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "timerid")]);
	} else {
		rt.setSv(f, "force", rt.initial(f, live(f.src), "force"));
		rt.setSv(f, "throwforce", rt.initial(f, live(f.src), "throwforce"));
		rt.setSv(f, "armour_penetration", 0);
		rt.setSv(f, "clockwork_desc", "A powerful spear of Ratvarian making. It's more effective against enemy cultists and silicons, though it won't last for long.");
		yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "timerid")]);
		rt.setSv(f, "timerid", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clockwork/ratvarian_spear/proc/break_spear")])), 1800, 8])));
	}
	return f.dot;
}, true);

rt.type(8962, "/obj/item/clockwork/ratvarian_spear/cyborg", "/obj/item/clockwork/ratvarian_spear", {});

// /obj/item/clockwork/ratvarian_spear/cyborg/proc/ratvar_act  (code/game/gamemodes/clock_cult/clock_items/ratvarian_spear.dm:42)
rt.def("/obj/item/clockwork/ratvarian_spear/cyborg/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.setSv(f, "force", 25);
		rt.setSv(f, "throwforce", 50);
		rt.setSv(f, "armour_penetration", 10);
	} else {
		rt.setSv(f, "force", rt.initial(f, live(f.src), "force"));
		rt.setSv(f, "throwforce", rt.initial(f, live(f.src), "throwforce"));
		rt.setSv(f, "armour_penetration", 0);
	}
	return f.dot;
});

// /obj/item/clockwork/ratvarian_spear/proc/examine  (code/game/gamemodes/clock_cult/clock_items/ratvarian_spear.dm:49)
rt.def("/obj/item/clockwork/ratvarian_spear/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='brass'>Stabbing a human you are pulling or have grabbed with the spear will impale them, doing massive damage and stunning.</span>"]);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/robot")) ? 1 : 0))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='brass'>Throwing the spear will do massive damage, break the spear, and knock down the target.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/clockwork/ratvarian_spear/proc/attack  (code/game/gamemodes/clock_cult/clock_items/ratvarian_spear.dm:57)  may sleep
rt.def("/obj/item/clockwork/ratvarian_spear/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let impaling: Value = null, S: Value = null, M: Value = null, remove_verb: Value = null, _T: Value = null, B: Value = null;
	f.vars = () => [target, user, impaling, S, M, remove_verb, _T, B];
	impaling = 0;
	if (rt.gt(rt.sv(f, "attack_cooldown"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't attack right now, wait ＀ seconds!</span>", [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(subtract(rt.sv(f, "attack_cooldown"), rt.worldTime(f)), 0.10000000149011612), 0.10000000149011612])), 0]))])]);
		return live(f.dot);
	}
	if (((truthy(rt.fv(f, "pulling", live(user))) && truthy((rt.istype(rt.fv(f, "pulling", live(user)), T("/mob/living/carbon/human")) ? 1 : 0))) && isEqual(rt.fv(f, "pulling", live(user)), live(target)))) {
		if (rt.gt(rt.sv(f, "impale_cooldown"), rt.worldTime(f))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't impale ＀ yet, wait ＀ seconds!</span>", [live(target), (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(subtract(rt.sv(f, "impale_cooldown"), rt.worldTime(f)), 0.10000000149011612), 0.10000000149011612])), 0]))])]);
		} else {
			impaling = 1;
			rt.setSv(f, "attack_verb", rt.list("impaled"));
			rt.modSrcVar(f, "force", 22, add);
			rt.modSrcVar(f, "armour_penetration", 10, add);
			yield* g.callName(f, live(user), "stop_pulling", []);
		}
	}
	if (truthy(rt.sv(f, "hitsound"))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "hitsound"), (yield* g.srcCall(f, "get_clamped_volume")), 1, -1]);
	}
	rt.setFv(f, "lastattacked", live(user), live(target));
	rt.setFv(f, "lastattacker", live(target), live(user));
	yield* g.callName(f, live(user), "do_attack_animation", [live(target)]);
	if (!truthy((yield* g.callName(f, live(target), "attacked_by", [live(f.src), live(user)])))) {
		impaling = 0;
	} else {
		if (!truthy((yield* g.callName(f, live(target), "null_rod_check", [])))) {
			if (truthy((rt.istype(live(target), T("/mob/living/silicon")) ? 1 : 0))) {
				if (!isEqual(rt.gv(f, "stat", (S = live(target))), 2)) {
					yield* g.callName(f, live(S), "visible_message", [fmt("<span class='warning'>＀ shudders violently at ＀'s touch!</span>", [live(S), live(f.src)]), "<span class='userdanger'>ERROR: Temperature rising!</span>"]);
					yield* g.callName(f, live(S), "adjustFireLoss", [22]);
				}
			} else {
				if ((truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(target)]))) || truthy((rt.istype(live(target), T("/mob/living/simple_animal/hostile/construct")) ? 1 : 0)))) {
					if (!isEqual(rt.gv(f, "stat", (M = live(target))), 2)) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>Your body flares with agony at ＀'s presence!</span>", [live(f.src)])]);
						yield* g.callName(f, live(M), "adjustFireLoss", [15]);
					}
				} else {
					yield* g.callName(f, live(target), "adjustFireLoss", [3]);
				}
			}
		}
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "attacked", rt.fv(f, "name", live(f.src)), fmt("(INTENT: ＀) (DAMTYPE: ＀)", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "a_intent", live(user))])), (yield* g.call(f, P("/proc/uppertext"), null, [rt.sv(f, "damtype")]))])]);
	yield* g.srcCall(f, "add_fingerprint", live(user));
	rt.setSv(f, "attack_verb", rt.list("stabbed", "poked", "slashed"));
	yield* g.srcCall(f, "ratvar_act");
	if (!truthy(live(impaling))) return f.dot;
	rt.setSv(f, "impale_cooldown", add(rt.worldTime(f), rt.initial(f, live(f.src), "impale_cooldown")));
	rt.setSv(f, "attack_cooldown", add(rt.worldTime(f), rt.initial(f, live(f.src), "attack_cooldown")));
	if (!truthy(live(target))) return f.dot;
	yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/bloodsplatter"), [rt.getStep(f, live(target), 0), rt.getDir(f, live(user), live(target))]);
	yield* g.callName(f, live(target), "Stun", [80]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='brass'>You prepare to remove your ratvarian spear from ＀...</span>", [live(target)])]);
	remove_verb = rt.op(f, "PickUnweighted", [3], ["pull", "yank", "drag"]);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(user), 10, 1, live(target)])))) {
		_T = rt.getStep(f, live(target), 0);
		B = (yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/bloodsplatter"), [live(_T), rt.getDir(f, live(target), live(user))]));
		yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/misc/splort.ogg"), 200, 1]);
		yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/weapons/pierce.ogg"), 200, 1]);
		if (!isEqual(rt.fv(f, "stat", live(target)), 0)) {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ ＀s ＀ out of ＀!</span>", [live(user), live(remove_verb), live(f.src), live(target)]), fmt("<span class='warning'>You ＀ your spear from ＀!</span>", [live(remove_verb), live(target)])]);
		} else {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ kicks ＀ off of ＀!</span>", [live(user), live(target), live(f.src)]), fmt("<span class='warning'>You kick ＀ off of ＀!</span>", [live(target), live(f.src)])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(target), fmt("<span class='userdanger'>You scream in pain as you're kicked off of ＀!</span>", [live(f.src)])]);
			yield* g.callName(f, live(target), "emote", ["scream"]);
			yield* g.call(f, P("/proc/step"), null, [live(target), rt.getDir(f, live(user), live(target))]);
			_T = rt.getStep(f, live(target), 0);
			yield* g.callName(f, live(B), "forceMove", [live(_T)]);
			yield* g.callName(f, live(target), "Knockdown", [40]);
			yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1]);
		}
		yield* g.call(f, P("/proc/flash_color"), null, [null, live(target), "flash_color", "#911414", "flash_time", 8], rt.Args.Named);
	} else {
		if (!truthy(live(target))) return f.dot;
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ ＀s ＀ out of ＀!</span>", [live(user), live(remove_verb), live(f.src), live(target)]), fmt("<span class='warning'>You ＀ your spear from ＀!</span>", [live(remove_verb), live(target)])]);
		if (isEqual(rt.fv(f, "stat", live(target)), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(target), fmt("<span class='userdanger'>You scream in pain as ＀ is suddenly ＀ed out of you!</span>", [live(f.src), live(remove_verb)])]);
			yield* g.callName(f, live(target), "emote", ["scream"]);
		}
		yield* g.call(f, P("/proc/flash_color"), null, [null, live(target), "flash_color", "#911414", "flash_time", 4], rt.Args.Named);
	}
	return f.dot;
}, true);

// /obj/item/clockwork/ratvarian_spear/proc/throw_impact  (code/game/gamemodes/clock_cult/clock_items/ratvarian_spear.dm:128)  may sleep
rt.def("/obj/item/clockwork/ratvarian_spear/proc/throw_impact", function* throw_impact(f: Frame) {
	let _T: Value = null, L: Value = null;
	f.vars = () => [_T, L];
	_T = rt.getStep(f, live(f.args[0]), 0);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [(L = live(f.args[0]))])))) {
			if (truthy((yield* g.callName(f, live(L), "put_in_active_hand", [live(f.src)])))) {
				yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>＀ catches ＀ out of the air!</span>", [live(L), live(f.src)])]);
			} else {
				yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>＀ bounces off of ＀, as if repelled by an unseen force!</span>", [live(f.src), live(L)])]);
			}
		} else {
			if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
				if (!truthy((yield* g.callName(f, live(L), "null_rod_check", [])))) {
					if ((truthy((rt.istype(live(L), T("/mob/living/silicon")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(L)]))))) {
						yield* g.callName(f, live(L), "Knockdown", [100]);
					} else {
						yield* g.callName(f, live(L), "Knockdown", [40]);
					}
				}
				yield* g.srcCall(f, "break_spear", live(_T));
			}
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["target"], waitfor: false });

// /obj/item/clockwork/ratvarian_spear/proc/break_spear  (code/game/gamemodes/clock_cult/clock_items/ratvarian_spear.dm:148)  may sleep
rt.def("/obj/item/clockwork/ratvarian_spear/proc/break_spear", function* break_spear(f: Frame, _T: Value) {
	f.vars = () => [_T];
	if (!truthy(live(f.src))) return f.dot;
	if (!truthy(live(_T))) {
		_T = rt.getStep(f, live(f.src), 0);
	}
	if (truthy(live(_T))) {
		yield* g.callName(f, live(_T), "visible_message", [fmt("<span class='warning'>＀ ＀!</span>", [live(f.src), rt.op(f, "PickUnweighted", [2], ["cracks in two and fades away", "snaps in two and dematerializes"])])]);
		yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/spearbreak"), [live(_T)]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });
