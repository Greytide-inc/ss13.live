// From code/game/gamemodes/gang/gang_pen.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6644, "/obj/item/weapon/pen/gang", "/obj/item/weapon/pen", {
	cooldown: null,
	last_used: 0,
	charges: 1,
	origin_tech: "materials=2;syndicate=3",
});

// /obj/item/weapon/pen/gang/proc/New  (code/game/gamemodes/gang/gang_pen.dm:11)  may sleep
rt.def("/obj/item/weapon/pen/gang/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "last_used", rt.worldTime(f));
	return f.dot;
}, true);

// /obj/item/weapon/pen/gang/proc/attack  (code/game/gamemodes/gang/gang_pen.dm:15)  may sleep
rt.def("/obj/item/weapon/pen/gang/proc/attack", function* attack(f: Frame) {
	let G: Value = null, recruitable: Value = null, O: Value = null;
	let $0: any, $e: any;
	f.vars = () => [G, recruitable, O, $0, $e];
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon/human")) ? 1 : 0))) && !isEqual(rt.fv(f, "stat", live(f.args[0])), 2))) {
		if ((truthy(rt.fv(f, "mind", live(f.args[1]))) && truthy((rt.isIn(f, rt.fv(f, "mind", live(f.args[1])), (yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "get_gang_bosses", []))) ? 1 : 0)))) {
			if (truthy((yield* g.callSuper(f, [live(f.args[0]), live(f.args[1]), 1])))) {
				if (truthy(rt.sv(f, "cooldown"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ needs more time to recharge before it can be used.</span>", [live(f.src)])]);
					return live(f.dot);
				}
				if (truthy(rt.fv(f, "client", live(f.args[0])))) {
					yield* g.callName(f, live(f.args[0]), "mind_initialize", []);
					G = rt.gv(f, "gang_datum", rt.fv(f, "mind", live(f.args[1])));
					$0 = (recruitable = (yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_gangster", [rt.fv(f, "mind", live(f.args[0])), live(G)])));
					if ($0 === 3) {
						O = null;
						rt.forList(f, 0, rt.fv(f, "contents", live(f.args[0])), T("/obj"));
						while (($e = rt.next(f, 0)) !== undefined) {
							O = $e;
							if (truthy((rt.istype(live(O), T("/obj/item/device/gangtool/soldier")) ? 1 : 0))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This gangster already has an uplink!</span>"]);
								return live(f.dot);
							}
						}
						rt.endFor(f, 0);
						yield* g.new_(f, T("/obj/item/device/gangtool/soldier"), [live(f.args[0])]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You inject ＀ with a new gangtool!</span>", [live(f.args[0])])]);
						yield* g.srcCall(f, "cooldown", live(G));
					} else if ($0 === 2) {
						yield* g.new_(f, T("/obj/item/device/gangtool/soldier"), [live(f.args[0])]);
						yield* g.callName(f, live(f.args[0]), "Unconscious", [100]);
						yield* g.srcCall(f, "cooldown", live(G));
					} else if ($0 === 1) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This mind is resistant to recruitment!</span>"]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This mind has already been recruited into a gang!</span>"]);
					}
				}
			}
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "user", "stealth"] });

// /obj/item/weapon/pen/gang/proc/cooldown  (code/game/gamemodes/gang/gang_pen.dm:49)  may sleep
rt.def("/obj/item/weapon/pen/gang/proc/cooldown", function* cooldown(f: Frame, gang: Value) {
	let cooldown_time: Value = null, time_passed: Value = null, time: Value = null, M: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [gang, cooldown_time, time_passed, time, M, $0, $1, $2, $3];
	cooldown_time = add(600, multiply(600, rt.getLen(f, rt.fv(f, "bosses", live(gang)))));
	rt.setSv(f, "cooldown", 1);
	rt.setSv(f, "icon_state", "pen_blink");
	time_passed = subtract(rt.worldTime(f), rt.sv(f, "last_used"));
	time = null;
	time = live(time_passed);
	while (rt.ge(live(time), live(cooldown_time))) {
		rt.incSrcVar(f, "charges", 1, true);
		(time = rt.modify(live(time), live(cooldown_time), subtract));
	}
	rt.setSv(f, "charges", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "charges"), 1)])));
	rt.setSv(f, "last_used", subtract(rt.worldTime(f), live(time)));
	if (truthy(rt.sv(f, "charges"))) {
		cooldown_time = 50;
	}
	yield* g.call(f, P("/proc/sleep"), null, [live(cooldown_time)]);
	rt.setSv(f, "cooldown", 0);
	rt.setSv(f, "icon_state", "pen");
	$0 = (M = (yield* g.call(f, P("/proc/get"), null, [live(f.src), T("/mob")])));
	$1 = (yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]));
	$2 = live(f.src);
	if (isEqual(rt.fv(f, "loc", live(f.src)), live(M))) {
		$3 = "";
	} else {
		$3 = fmt(" in your ＀", [rt.fv(f, "loc", live(f.src))]);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ ＀＀ vibrates softly. It is ready to be used again.</span>", [$1, $2, $3])]);
	return f.dot;
}, true, { waitfor: false });
