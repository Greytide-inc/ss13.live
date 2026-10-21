// From code/modules/ruins/objects_and_mobs/sin_ruins.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13031, "/obj/structure/cursed_slot_machine", "/obj/structure", {
	win_prob: 5,
	anchored: 1,
	name: "greed's slot machine",
	desc: "High stakes, high rewards.",
	icon: rt.rsc("icons/obj/economy.dmi"),
	icon_state: "slots1",
	density: 1,
});

// /obj/structure/cursed_slot_machine/proc/attack_hand  (code/modules/ruins/objects_and_mobs/sin_ruins.dm:13)  may sleep
rt.def("/obj/structure/cursed_slot_machine/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "in_use"))) {
		return live(f.dot);
	}
	rt.setSv(f, "in_use", 1);
	yield* g.callName(f, live(user), "adjustCloneLoss", [20]);
	if (truthy(rt.fv(f, "stat", live(user)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='userdanger'>No... just one more try...</span>"]);
		yield* g.callName(f, live(user), "gib", []);
	} else {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ pulls ＀'s lever with a glint in ＀ eyes!</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_their", []))]), "<span class='warning'>You feel a draining as you pull the lever, but you know it'll be worth it.</span>"]);
	}
	rt.setSv(f, "icon_state", "slots2");
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/lavaland/cursed_slot_machine.ogg"), 50, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	rt.setSv(f, "icon_state", "slots1");
	rt.setSv(f, "in_use", 0);
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "win_prob")]))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/lavaland/cursed_slot_machine_jackpot.ogg"), 50, 0]);
		yield* g.new_(f, T("/obj/structure/cursed_money"), [rt.getStep(f, live(f.src), 0)]);
		if (truthy(live(user))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldwarning'>You've hit jackpot. Laughter echoes around you as your reward appears in the machine's place.</span>"]);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		if (!truthy(live(user))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldwarning'>Fucking machine! Must be rigged. Still... one more try couldn't hurt, right?</span>"]);
	}
	return f.dot;
}, true);

rt.type(13032, "/obj/structure/cursed_money", "/obj/structure", {
	anchored: 0,
	name: "bag of money",
	desc: "RICH! YES! YOU KNEW IT WAS WORTH IT! YOU'RE RICH! RICH! RICH!",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "moneybag",
	density: 1,
});

// /obj/structure/cursed_money/proc/Initialize  (code/modules/ruins/objects_and_mobs/sin_ruins.dm:49)  may sleep
rt.def("/obj/structure/cursed_money/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/cursed_money/proc/collapse")])), 600]);
	return f.dot;
}, true);

// /obj/structure/cursed_money/proc/collapse  (code/modules/ruins/objects_and_mobs/sin_ruins.dm:53)  may sleep
rt.def("/obj/structure/cursed_money/proc/collapse", function* collapse(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ falls in on itself, canvas rotting away and contents vanishing.</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/cursed_money/proc/attack_hand  (code/modules/ruins/objects_and_mobs/sin_ruins.dm:58)  may sleep
rt.def("/obj/structure/cursed_money/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let _T: Value = null, critical_fail: Value = null;
	f.vars = () => [user, _T, critical_fail];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ opens the bag and and removes a die. The bag then vanishes.</span>", [live(user)]), "<span class='boldwarning'>You open the bag...!</span>\n<span class='danger'>And see a bag full of dice. Confused, you take one... and the bag vanishes.</span>"]);
	_T = rt.getStep(f, live(user), 0);
	critical_fail = (yield* g.new_(f, T("/obj/item/weapon/dice/d20/fate/one_use"), [live(_T)]));
	yield* g.callName(f, live(user), "put_in_hands", [live(critical_fail)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12099, "/obj/effect/gluttony", "/obj/effect", {
	anchored: 1,
	name: "gluttony's wall",
	desc: "Only those who truly indulge may pass.",
	density: 1,
	icon_state: "blob",
	icon: rt.rsc("icons/mob/blob.dmi"),
	color: "#919600",
});

// /obj/effect/gluttony/proc/CanPass  (code/modules/ruins/objects_and_mobs/sin_ruins.dm:80)
rt.def("/obj/effect/gluttony/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let H: Value = null;
	f.vars = () => [height, H];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(height), 0)) {
		return 1;
	}
	if (truthy((rt.istype(live(mover), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (rt.ge(rt.gv(f, "nutrition", (H = live(mover))), 600)) {
			rt.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀ pushes through ＀!</span>", [live(H), live(f.src)]), "<span class='notice'>You've seen and eaten worse than this.</span>"]);
			return 1;
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='warning'>You're repulsed by even looking at ＀. Only a pig could force themselves to go through it.</span>", [live(f.src)])]);
		}
	}
	if (truthy((rt.istype(live(mover), T("/mob/living/simple_animal/hostile/morph")) ? 1 : 0))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

rt.type(12810, "/obj/structure/mirror/magic/pride", "/obj/structure/mirror/magic", {
	name: "pride's mirror",
	desc: "Pride cometh before the...",
	icon_state: "magic_mirror",
});

// /obj/structure/mirror/magic/pride/proc/curse  (code/modules/ruins/objects_and_mobs/sin_ruins.dm:102)  may sleep
rt.def("/obj/structure/mirror/magic/pride/proc/curse", function* curse(f: Frame, user: Value) {
	let _T: Value = null, C: Value = null;
	f.vars = () => [user, _T, C];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'><B>The ground splits beneath ＀ as ＀ hand leaves the mirror!</B></span>", [live(user), (yield* g.callName(f, live(user), "p_their", []))]), "<span class='notice'>Perfect. Much better! Now <i>nobody</i> will be able to resist yo-</span>"]);
	yield* g.callName(f, (_T = rt.getStep(f, live(user), 0)), "ChangeTurf", [T("/turf/open/chasm/straight_down")]);
	yield* g.callName(f, (C = live(_T)), "drop", [live(user)]);
	return f.dot;
}, true);

rt.type(7279, "/obj/item/weapon/kitchen/knife/envy", "/obj/item/weapon/kitchen/knife", {
	name: "envy's knife",
	desc: "Their success will be yours.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "render",
	item_state: "render",
	force: 18,
	throwforce: 10,
	w_class: 3,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
});

// /obj/item/weapon/kitchen/knife/envy/proc/afterattack  (code/modules/ruins/objects_and_mobs/sin_ruins.dm:123)  may sleep
rt.def("/obj/item/weapon/kitchen/knife/envy/proc/afterattack", function* afterattack(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[2]))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	H = live(f.args[0]);
	if (isEqual(rt.fv(f, "real_name", live(f.args[1])), rt.gv(f, "real_name", rt.fv(f, "dna", live(H))))) return f.dot;
	rt.setFv(f, "real_name", live(f.args[1]), rt.gv(f, "real_name", rt.fv(f, "dna", live(H))));
	yield* g.callName(f, rt.fv(f, "dna", live(H)), "transfer_identity", [null, live(f.args[1]), "transfer_SE", 1], rt.Args.Named);
	yield* g.callName(f, live(f.args[1]), "updateappearance", ["mutcolor_update", 1], rt.Args.Named);
	yield* g.callName(f, live(f.args[1]), "domutcheck", []);
	yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀'s appearance shifts into ＀'s!</span>", [live(f.args[1]), live(H)]), "<span class='boldannounce'>They think they're <i>sooo</i> much better than you. Not anymore, they won't.</span>"]);
	return f.dot;
}, true, { args: ["AM", "user", "proximity"] });
