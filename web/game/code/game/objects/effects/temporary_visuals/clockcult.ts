// From code/game/objects/effects/temporary_visuals/clockcult.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11553, "/obj/effect/temp_visual/ratvar/mending_mantra", "/obj/effect/temp_visual/ratvar", {
	light_range: 1.5,
	light_color: "#1E8CE1",
	layer: 4.1,
	duration: 20,
	alpha: 200,
	icon_state: "mending_mantra",
});

// /obj/effect/temp_visual/ratvar/mending_mantra/proc/Initialize  (code/game/objects/effects/temporary_visuals/clockcult.dm:74)  may sleep
rt.def("/obj/effect/temp_visual/ratvar/mending_mantra/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 2));
	yield* g.callName(f, (M = rt.sv(f, "transform")), "Turn", [90]);
	rt.op(f, "Animate", [2, 10], [null, live(f.src), "alpha", 20, "time", rt.sv(f, "duration"), "easing", 4, "flags", 4]);
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", live(M), "time", rt.sv(f, "duration"), "flags", 4]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11554, "/obj/effect/temp_visual/ratvar/volt_hit", "/obj/effect/temp_visual/ratvar", {
	user: null,
	damage: 25,
	light_range: 1.5,
	light_power: 2,
	light_color: "#FA9632",
	name: "volt blast",
	layer: 4.1,
	duration: 8,
	icon_state: "volt_hit",
});

// /obj/effect/temp_visual/ratvar/volt_hit/proc/Initialize  (code/game/objects/effects/temporary_visuals/clockcult.dm:93)  may sleep
rt.def("/obj/effect/temp_visual/ratvar/volt_hit/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "user", live(f.args[1]));
	if (truthy(rt.sv(f, "user"))) {
		yield* g.callName(f, (M = (yield* g.new_(f, T("/matrix"), []))), "Turn", [(yield* g.call(f, P("/proc/Get_Angle"), null, [live(f.src), rt.sv(f, "user")]))]);
		rt.setSv(f, "transform", live(M));
	}
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/temp_visual/ratvar/volt_hit/proc/volthit")]);
	return f.dot;
}, true, { args: ["mapload", "caster"] });

// /obj/effect/temp_visual/ratvar/volt_hit/proc/volthit  (code/game/objects/effects/temporary_visuals/clockcult.dm:103)  may sleep
rt.def("/obj/effect/temp_visual/ratvar/volt_hit/proc/volthit", function* volthit(f: Frame) {
	let hit_amount: Value = null, _T: Value = null, L: Value = null, I: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [hit_amount, _T, L, I, M, $e];
	if (truthy(rt.sv(f, "user"))) {
		yield* g.callSrc(f, "Beam", [null, rt.getStep(f, rt.sv(f, "user"), 0), null, "volt_ray", "time", rt.sv(f, "duration"), "maxdistance", 8, "beam_type", T("/obj/effect/ebeam/volt_ray")], rt.Args.Named);
	}
	hit_amount = 0;
	_T = rt.getStep(f, live(f.src), 0);
	L = null;
	rt.forList(f, 0, live(_T), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)])))) {
			continue;
		}
		if (truthy((I = (yield* g.callName(f, live(L), "null_rod_check", []))))) {
			yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>Strange energy flows into ＀'s ＀!</span>", [live(L), rt.fv(f, "name", live(I))]), fmt("<span class='userdanger'>Your ＀ shields you from ＀!</span>", [rt.fv(f, "name", live(I)), live(f.src)])]);
			continue;
		}
		yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>＀ is struck by a ＀!</span>", [live(L), rt.sv(f, "name")]), fmt("<span class='userdanger'>You're struck by a ＀!</span>", [rt.sv(f, "name")])]);
		yield* g.callName(f, live(L), "apply_damage", [rt.sv(f, "damage"), "fire", "chest", (yield* g.callName(f, live(L), "run_armor_check", ["chest", "laser", fmt("Your armor absorbs ＀!", [live(f.src)]), fmt("Your armor blocks part of ＀!", [live(f.src)]), 0, fmt("Your armor was penetrated by ＀!", [live(f.src)])]))]);
		yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "user"), live(L), "struck with a volt blast"]);
		hit_amount = rt.inc(live(hit_amount), 1);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(_T), T("/obj/mecha"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.fv(f, "occupant", live(M)))) {
			if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.fv(f, "occupant", live(M))])))) {
				continue;
			}
			yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "occupant", live(M)), fmt("<span class='userdanger'>Your ＀ is struck by a ＀!</span>", [rt.fv(f, "name", live(M)), rt.sv(f, "name")])]);
		}
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ is struck by a ＀!</span>", [live(M), rt.sv(f, "name")])]);
		yield* g.callName(f, live(M), "take_damage", [rt.sv(f, "damage"), "fire", 0, 0]);
		hit_amount = rt.inc(live(hit_amount), 1);
	}
	rt.endFor(f, 0);
	if (truthy(live(hit_amount))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/defib_zap.ogg"), multiply(rt.sv(f, "damage"), live(hit_amount)), 1, -1]);
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "sparks", 50, 1]);
	}
	return f.dot;
}, true);

rt.type(11555, "/obj/effect/temp_visual/ratvar/ocular_warden", "/obj/effect/temp_visual/ratvar", {
	name: "warden's gaze",
	layer: 4.1,
	icon_state: "warden_gaze",
	duration: 3,
});

// /obj/effect/temp_visual/ratvar/ocular_warden/proc/Initialize  (code/game/objects/effects/temporary_visuals/clockcult.dm:138)  may sleep
rt.def("/obj/effect/temp_visual/ratvar/ocular_warden/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-8, 8])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "alpha", 0, "time", 3, "easing", 128]);
	return f.dot;
}, true);

rt.type(11556, "/obj/effect/temp_visual/ratvar/prolonging_prism", "/obj/effect/temp_visual/ratvar", {
	icon: rt.rsc("icons/effects/64x64.dmi"),
	icon_state: "prismhex1",
	layer: 5.1,
	pixel_y: -16,
	pixel_x: -16,
	duration: 30,
});

// /obj/effect/temp_visual/ratvar/prolonging_prism/proc/Initialize  (code/game/objects/effects/temporary_visuals/clockcult.dm:152)  may sleep
rt.def("/obj/effect/temp_visual/ratvar/prolonging_prism/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "appearance", live(f.args[1]));
	}
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "alpha", 0, "time", rt.sv(f, "duration"), "easing", 4]);
	return f.dot;
}, true, { args: ["mapload", "set_appearance"] });

rt.type(11560, "/obj/effect/temp_visual/ratvar/component", "/obj/effect/temp_visual/ratvar", {
	icon: rt.rsc("icons/obj/clockwork_objects.dmi"),
	icon_state: "belligerent_eye",
	layer: 4.1,
	duration: 10,
});

// /obj/effect/temp_visual/ratvar/component/proc/Initialize  (code/game/objects/effects/temporary_visuals/clockcult.dm:177)  may sleep
rt.def("/obj/effect/temp_visual/ratvar/component/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 0.75));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-10, -2])));
	rt.op(f, "Animate", [2, 10], [null, live(f.src), "pixel_y", add(rt.sv(f, "pixel_y"), 10), "alpha", 50, "time", 10, "easing", 128]);
	return f.dot;
}, true);

rt.type(11566, "/obj/effect/temp_visual/ratvar/sigil/transgression", "/obj/effect/temp_visual/ratvar/sigil", {
	light_range: 5,
	light_power: 2,
	light_color: "#FAE48C",
	color: "#FAE48C",
	layer: 4.1,
	duration: 70,
});

// /obj/effect/temp_visual/ratvar/sigil/transgression/proc/Initialize  (code/game/objects/effects/temporary_visuals/clockcult.dm:208)  may sleep
rt.def("/obj/effect/temp_visual/ratvar/sigil/transgression/proc/Initialize", function* Initialize(f: Frame) {
	let oldtransform: Value = null;
	f.vars = () => [oldtransform];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	oldtransform = rt.sv(f, "transform");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 2), "time", 5]);
	rt.op(f, "Animate", [2, 6], ["transform", live(oldtransform), "alpha", 0, "time", 65]);
	return f.dot;
}, true);
