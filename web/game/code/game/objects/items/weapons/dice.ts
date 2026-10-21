// From code/game/objects/items/weapons/dice.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5507, "/obj/item/weapon/storage/pill_bottle/dice", "/obj/item/weapon/storage/pill_bottle", {
	name: "bag of dice",
	desc: "Contains all the luck you'll ever need.",
	icon: rt.rsc("icons/obj/dice.dmi"),
	icon_state: "dicebag",
});

// /obj/item/weapon/storage/pill_bottle/dice/proc/New  (code/game/objects/items/weapons/dice.dm:8)  may sleep
rt.def("/obj/item/weapon/storage/pill_bottle/dice/proc/New", function* New(f: Frame) {
	let special_die: Value = null;
	f.vars = () => [special_die];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual((special_die = rt.op(f, "PickUnweighted", [8], ["1", "2", "fudge", "space", "00", "8bd20", "4dd6", "100"])), "1")) {
		yield* g.new_(f, T("/obj/item/weapon/dice/d1"), [live(f.src)]);
	}
	if (isEqual(live(special_die), "2")) {
		yield* g.new_(f, T("/obj/item/weapon/dice/d2"), [live(f.src)]);
	}
	yield* g.new_(f, T("/obj/item/weapon/dice/d4"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/dice/d6"), [live(f.src)]);
	if (isEqual(live(special_die), "fudge")) {
		yield* g.new_(f, T("/obj/item/weapon/dice/fudge"), [live(f.src)]);
	}
	if (isEqual(live(special_die), "space")) {
		yield* g.new_(f, T("/obj/item/weapon/dice/d6/space"), [live(f.src)]);
	}
	yield* g.new_(f, T("/obj/item/weapon/dice/d8"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/dice/d10"), [live(f.src)]);
	if (isEqual(live(special_die), "00")) {
		yield* g.new_(f, T("/obj/item/weapon/dice/d00"), [live(f.src)]);
	}
	yield* g.new_(f, T("/obj/item/weapon/dice/d12"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/dice/d20"), [live(f.src)]);
	if (isEqual(live(special_die), "8bd20")) {
		yield* g.new_(f, T("/obj/item/weapon/dice/eightbd20"), [live(f.src)]);
	}
	if (isEqual(live(special_die), "4dd6")) {
		yield* g.new_(f, T("/obj/item/weapon/dice/fourdd6"), [live(f.src)]);
	}
	if (!isEqual(live(special_die), "100")) return f.dot;
	yield* g.new_(f, T("/obj/item/weapon/dice/d100"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(7158, "/obj/item/weapon/dice", "/obj/item/weapon", {
	sides: 6,
	result: null,
	special_faces: null,
	can_be_rigged: 1,
	rigged: 0,
	name: "die",
	desc: "A die with six sides. Basic and servicable.",
	icon: rt.rsc("icons/obj/dice.dmi"),
	icon_state: "d6",
	w_class: 1,
});

// /obj/item/weapon/dice/proc/<init>  (code/game/objects/items/weapons/dice.dm:41)
rt.def("/obj/item/weapon/dice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "special_faces", rt.list());
	return f.dot;
});

// /obj/item/weapon/dice/proc/New  (code/game/objects/items/weapons/dice.dm:46)  may sleep
rt.def("/obj/item/weapon/dice/proc/New", function* New(f: Frame) {
	rt.setSv(f, "result", (yield* g.call(f, P("/proc/rand"), null, [1, rt.sv(f, "sides")])));
	yield* g.srcCall(f, "update_icon");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(7163, "/obj/item/weapon/dice/d6/space", "/obj/item/weapon/dice/d6", {
	name: "space cube",
	desc: "A die with six sides. 6 TIMES 255 TIMES 255 TILE TOTAL EXISTENCE, SQUARE YOUR MIND OF EDUCATED STUPID: 2 DOES NOT EXIST.",
	icon_state: "spaced6",
});

// /obj/item/weapon/dice/d6/space/proc/New  (code/game/objects/items/weapons/dice.dm:77)  may sleep
rt.def("/obj/item/weapon/dice/d6/space/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.op(f, "Prob", [], [10]))) return f.dot;
	rt.setSv(f, "name", "spess cube");
	return f.dot;
}, true);

// /obj/item/weapon/dice/proc/attack_self  (code/game/objects/items/weapons/dice.dm:148)  may sleep
rt.def("/obj/item/weapon/dice/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "diceroll", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/dice/proc/throw_at  (code/game/objects/items/weapons/dice.dm:151)  may sleep
rt.def("/obj/item/weapon/dice/proc/throw_at", function* throw_at(f: Frame) {
	if (live(f.args[4]) === null) {
		f.args[4] = 1;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "diceroll", live(f.args[3]));
	return f.dot;
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// /obj/item/weapon/dice/proc/diceroll  (code/game/objects/items/weapons/dice.dm:156)
rt.def("/obj/item/weapon/dice/proc/diceroll", function diceroll(f: Frame, user: Value) {
	let fake_result: Value = null, comment: Value = null;
	f.vars = () => [fake_result, comment];
	rt.setSv(f, "result", rt.call(f, P("/proc/rand"), null, [1, rt.sv(f, "sides")]));
	if ((truthy(rt.sv(f, "rigged")) && !isEqual(rt.sv(f, "result"), rt.sv(f, "rigged")))) {
		if (truthy(rt.op(f, "Prob", [], [rt.call(f, P("/proc/max"), null, [25, rt.call(f, P("/proc/min"), null, [multiply(divide(1, subtract(rt.sv(f, "sides"), 1)), 100), 80])])]))) {
			rt.setSv(f, "result", rt.sv(f, "rigged"));
		}
	}
	fake_result = rt.call(f, P("/proc/rand"), null, [1, rt.sv(f, "sides")]);
	comment = "";
	if ((isEqual(rt.sv(f, "sides"), 20) && isEqual(rt.sv(f, "result"), 20))) {
		comment = "Nat 20!";
	} else {
		if ((isEqual(rt.sv(f, "sides"), 20) && isEqual(rt.sv(f, "result"), 1))) {
			comment = "Ouch, bad luck.";
		}
	}
	rt.callSrc(f, "update_icon", []);
	if (isEqual(rt.initial(f, live(f.src), "icon_state"), "d00")) {
		rt.setSv(f, "result", multiply(subtract(rt.sv(f, "result"), 1), 10));
	}
	if (isEqual(rt.len(f, rt.sv(f, "special_faces")), rt.sv(f, "sides"))) {
		rt.setSv(f, "result", rt.index(rt.sv(f, "special_faces"), rt.sv(f, "result")));
	}
	if (live(user) !== null) {
		rt.callName(f, live(user), "visible_message", [fmt("＀ has thrown ＀. It lands on ＀. ＀", [live(user), live(f.src), rt.sv(f, "result"), live(comment)]), fmt("<span class='notice'>You throw ＀. It lands on ＀. ＀</span>", [live(f.src), rt.sv(f, "result"), live(comment)]), fmt("<span class='italics'>You hear ＀ rolling, it sounds like a ＀.</span>", [live(f.src), live(fake_result)])]);
	} else {
		if (truthy(rt.fv(f, "throwing", live(f.src)))) return f.dot;
		rt.callSrc(f, "visible_message", [fmt("<span class='notice'>＀ rolls to a stop, landing on ＀. ＀</span>", [live(f.src), rt.sv(f, "result"), live(comment)])]);
	}
	return f.dot;
});

rt.type(7161, "/obj/item/weapon/dice/d4", "/obj/item/weapon/dice", {
	sides: 4,
	name: "d4",
	desc: "A die with four sides. The nerd's caltrop.",
	icon_state: "d4",
});

// /obj/item/weapon/dice/d4/proc/Crossed  (code/game/objects/items/weapons/dice.dm:179)  may sleep
rt.def("/obj/item/weapon/dice/d4/proc/Crossed", function* Crossed(f: Frame, H: Value) {
	f.vars = () => [H];
	if (!(truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy(rt.fv(f, "shoes", live(H))))) return f.dot;
	if (truthy((rt.isIn(f, 15, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='userdanger'>You step on the D4!</span>"]);
	yield* g.callName(f, live(H), "apply_damage", [4, "brute", rt.op(f, "PickUnweighted", [2], ["l_leg", "r_leg"])]);
	yield* g.callName(f, live(H), "Knockdown", [60]);
	return f.dot;
}, true);

// /obj/item/weapon/dice/proc/update_icon  (code/game/objects/items/weapons/dice.dm:187)
rt.def("/obj/item/weapon/dice/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	rt.callSrc(f, "add_overlay", [fmt("＀＀", [rt.fv(f, "icon_state", live(f.src)), rt.fv(f, "result", live(f.src))])]);
	return f.dot;
});

// /obj/item/weapon/dice/proc/microwave_act  (code/game/objects/items/weapons/dice.dm:192)
rt.def("/obj/item/weapon/dice/proc/microwave_act", function microwave_act(f: Frame, M: Value) {
	if (truthy(rt.sv(f, "can_be_rigged"))) {
		rt.setSv(f, "rigged", rt.sv(f, "result"));
	}
	rt.callSuper(f, [live(M)]);
	return f.dot;
});
