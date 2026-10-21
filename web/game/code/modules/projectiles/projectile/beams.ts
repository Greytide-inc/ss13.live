// From code/modules/projectiles/projectile/beams.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8869, "/obj/item/projectile/beam/laser", "/obj/item/projectile/beam", {});

// /obj/item/projectile/beam/laser/proc/on_hit  (code/modules/projectiles/projectile/beams.dm:25)  may sleep
rt.def("/obj/item/projectile/beam/laser/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (M = live(f.args[0])), "IgniteMob", []);
	} else {
		if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.args[0])])))) return f.dot;
		rt.setSv(f, "impact_effect_type", T("/obj/effect/temp_visual/impact_effect/red_laser/wall"));
	}
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8877, "/obj/item/projectile/beam/pulse", "/obj/item/projectile/beam", {
	light_color: "#6496FA",
	name: "pulse",
	icon_state: "u_laser",
	damage: 50,
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/blue_laser"),
});

// /obj/item/projectile/beam/pulse/proc/on_hit  (code/modules/projectiles/projectile/beams.dm:75)  may sleep
rt.def("/obj/item/projectile/beam/pulse/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.args[0])]))) || truthy((rt.istype(live(f.args[0]), T("/obj/structure")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "ex_act", [2]);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8879, "/obj/item/projectile/beam/pulse/heavy", "/obj/item/projectile/beam/pulse", {
	life: 20,
	name: "heavy pulse laser",
	icon_state: "pulse1_bl",
});

// /obj/item/projectile/beam/pulse/heavy/proc/on_hit  (code/modules/projectiles/projectile/beams.dm:88)  may sleep
rt.def("/obj/item/projectile/beam/pulse/heavy/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	(rt.modSrcVar(f, "life", 10, subtract));
	if (rt.gt(rt.sv(f, "life"), 0)) {
		f.dot = -1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8881, "/obj/item/projectile/beam/lasertag", "/obj/item/projectile/beam", {
	suit_types: null,
	light_color: "#6496FA",
	name: "laser tag beam",
	icon_state: "omnilaser",
	hitsound: null,
	damage: 0,
	damage_type: "stamina",
	flag: "laser",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/blue_laser"),
});

// /obj/item/projectile/beam/lasertag/proc/<init>  (code/modules/projectiles/projectile/beams.dm:112)
rt.def("/obj/item/projectile/beam/lasertag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "suit_types", rt.list(T("/obj/item/clothing/suit/redtag"), T("/obj/item/clothing/suit/bluetag")));
	return f.dot;
});

// /obj/item/projectile/beam/lasertag/proc/on_hit  (code/modules/projectiles/projectile/beams.dm:117)  may sleep
rt.def("/obj/item/projectile/beam/lasertag/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!truthy((rt.istype(rt.gv(f, "wear_suit", (M = live(f.args[0]))), T("/obj/item")) ? 1 : 0))) return f.dot;
	if (!truthy((rt.isIn(f, rt.gv(f, "type", rt.fv(f, "wear_suit", live(M))), rt.sv(f, "suit_types")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(M), "adjustStaminaLoss", [34]);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8882, "/obj/item/projectile/beam/lasertag/redtag", "/obj/item/projectile/beam/lasertag", {
	suit_types: null,
	light_color: "#FA8282",
	icon_state: "laser",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/red_laser"),
});

// /obj/item/projectile/beam/lasertag/redtag/proc/<init>  (code/modules/projectiles/projectile/beams.dm:126)
rt.def("/obj/item/projectile/beam/lasertag/redtag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "suit_types", rt.list(T("/obj/item/clothing/suit/bluetag")));
	return f.dot;
});

rt.type(8883, "/obj/item/projectile/beam/lasertag/bluetag", "/obj/item/projectile/beam/lasertag", {
	suit_types: null,
	icon_state: "bluelaser",
});

// /obj/item/projectile/beam/lasertag/bluetag/proc/<init>  (code/modules/projectiles/projectile/beams.dm:132)
rt.def("/obj/item/projectile/beam/lasertag/bluetag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "suit_types", rt.list(T("/obj/item/clothing/suit/redtag")));
	return f.dot;
});

rt.type(8884, "/obj/item/projectile/beam/instakill", "/obj/item/projectile/beam", {
	light_color: "#952CF4",
	name: "instagib laser",
	icon_state: "purple_laser",
	damage: 200,
	damage_type: "fire",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/purple_laser"),
});

// /obj/item/projectile/beam/instakill/proc/on_hit  (code/modules/projectiles/projectile/beams.dm:153)  may sleep
rt.def("/obj/item/projectile/beam/instakill/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (M = live(f.args[0])), "visible_message", [fmt("<span class='danger'>＀ explodes into a shower of gibs!</span>", [live(M)])]);
	yield* g.callName(f, live(M), "gib", []);
	return f.dot;
}, true, { args: ["target"] });
