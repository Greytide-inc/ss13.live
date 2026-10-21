// From code/game/objects/items/weapons/powerfist.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5660, "/obj/item/weapon/melee/powerfist", "/obj/item/weapon/melee", {
	click_delay: 1.5,
	fisto_setting: 1,
	gasperfist: 3,
	tank: null,
	flags: 64,
	throw_range: 7,
	name: "power-fist",
	desc: "A metal gauntlet with a piston-powered ram ontop for that extra 'ompfh' in your punch.",
	icon_state: "powerfist",
	item_state: "powerfist",
	attack_verb: null,
	force: 20,
	throwforce: 10,
	w_class: 3,
	origin_tech: "combat=5;powerstorage=3;syndicate=3",
	armor: null,
	resistance_flags: 2,
});

// /obj/item/weapon/melee/powerfist/proc/<init>  (code/game/objects/items/weapons/powerfist.dm:13)
rt.def("/obj/item/weapon/melee/powerfist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("whacked", "fisted", "power-punched"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 40]));
	return f.dot;
});

// /obj/item/weapon/melee/powerfist/proc/examine  (code/game/objects/items/weapons/powerfist.dm:22)
rt.def("/obj/item/weapon/melee/powerfist/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!rt.le(rt.call(f, P("/proc/get_dist"), null, [live(f.args[0]), live(f.src)]), 1)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You'll need to get closer to see any more.</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "tank"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀ It has ％！ mounted onto it.</span>", [rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "tank")]), rt.sv(f, "tank")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/melee/powerfist/proc/attackby  (code/game/objects/items/weapons/powerfist.dm:31)  may sleep
rt.def("/obj/item/weapon/melee/powerfist/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let IT: Value = null;
	let $0: any;
	f.vars = () => [W, user, params, IT, $0];
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/tank/internals")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "tank"))) {
			if (rt.le(rt.gv(f, "volume", (IT = live(W))), 3)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is too small for ％！.</span>", [live(IT), live(f.src)])]);
				return live(f.dot);
			}
			yield* g.srcCall(f, "updateTank", live(W), 0, live(user));
		}
	} else {
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			$0 = rt.sv(f, "fisto_setting");
			if ($0 === 1) {
				rt.setSv(f, "fisto_setting", 2);
			} else if ($0 === 2) {
				rt.setSv(f, "fisto_setting", 3);
			} else if ($0 === 3) {
				rt.setSv(f, "fisto_setting", 1);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(W)), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You tweak ％！'s piston valve to ＀.</span>", [live(f.src), rt.sv(f, "fisto_setting")])]);
		} else {
			if (!truthy((rt.istype(live(W), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) return f.dot;
			if (!truthy(rt.sv(f, "tank"))) return f.dot;
			yield* g.srcCall(f, "updateTank", rt.sv(f, "tank"), 1, live(user));
		}
	}
	return f.dot;
}, true);

// /obj/item/weapon/melee/powerfist/proc/updateTank  (code/game/objects/items/weapons/powerfist.dm:55)  may sleep
rt.def("/obj/item/weapon/melee/powerfist/proc/updateTank", function* updateTank(f: Frame, thetank: Value, removing: Value, user: Value) {
	f.vars = () => [thetank, removing, user];
	if (live(removing) === null) {
		removing = 0;
	}
	if (truthy(live(removing))) {
		if (!truthy(rt.sv(f, "tank"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＄！ currently has no tank attached to it.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You detach ％！ from ％！.</span>", [live(thetank), live(f.src)])]);
		yield* g.callName(f, rt.sv(f, "tank"), "forceMove", [rt.getStep(f, live(user), 0)]);
		yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "tank")]);
		rt.setSv(f, "tank", null);
	}
	if (truthy(live(removing))) return f.dot;
	if (truthy(rt.sv(f, "tank"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ already has a tank.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(thetank), live(f.src)])))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You hook ％！ up to ％！.</span>", [live(thetank), live(f.src)])]);
	rt.setSv(f, "tank", live(thetank));
	return f.dot;
}, true);

// /obj/item/weapon/melee/powerfist/proc/attack  (code/game/objects/items/weapons/powerfist.dm:73)  may sleep
rt.def("/obj/item/weapon/melee/powerfist/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let throw_target: Value = null;
	f.vars = () => [target, user, throw_target];
	if (!truthy(rt.sv(f, "tank"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ can't operate without a source of gas!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "tank")) && !truthy((yield* g.callName(f, rt.fv(f, "air_contents", rt.sv(f, "tank")), "remove", [multiply(rt.sv(f, "gasperfist"), rt.sv(f, "fisto_setting"))]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！'s piston-ram lets out a weak hiss, it needs more gas!</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/refill.ogg"), 50, 1]);
		return live(f.dot);
	}
	yield* g.callName(f, live(target), "apply_damage", [multiply(rt.sv(f, "force"), rt.sv(f, "fisto_setting")), "brute"]);
	yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀'s powerfist lets out a loud hiss as they punch ＀!</span>", [live(user), rt.fv(f, "name", live(target))]), fmt("<span class='userdanger'>You cry out in pain as ＀'s punch flings you backwards!</span>", [live(user)])]);
	yield* g.new_(f, T("/obj/effect/temp_visual/kinetic_blast"), [rt.fv(f, "loc", live(target))]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/resonator_blast.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/genhit2.ogg"), 50, 1]);
	throw_target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(target), rt.getDir(f, live(f.src), (yield* g.call(f, P("/proc/get_step_away"), null, [live(target), live(f.src)])))]));
	yield* g.callName(f, live(target), "throw_at", [live(throw_target), multiply(5, rt.sv(f, "fisto_setting")), 0.20000000298023224]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "power fisted", live(f.src)]);
	yield* g.callName(f, live(user), "changeNext_move", [multiply(8, rt.sv(f, "click_delay"))]);
	return live(f.dot);
}, true);
