// tg_js addition (not from tg's DM): the vortex grenade. Its vortex pulls loose objects and living mobs in with the
// space-wind push (experience_pressure_difference, so magboots and anchoring hold like in a breach; the air is left alone),
// and whatever reaches its tile falls in like the lavaland chasm (chasm.ts drop) and is deleted. The floor stays.
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type("/obj/item/weapon/grenade/vortex", "/obj/item/weapon/grenade", {
	name: "vortex grenade",
	desc: "Pulls everything loose nearby into a tiny rift and swallows it. Stand well back.",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "bluefrag",
	item_state: "flashbang",
});

rt.def("/obj/item/weapon/grenade/vortex/proc/prime", function* prime(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.srcCall(f, "update_mob");
	if (truthy((_T = rt.getStep(f, live(f.src), 0)))) {
		yield* g.new_(f, T("/obj/effect/vortex"), [live(_T)]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type("/obj/effect/vortex", "/obj/effect", {
	name: "vortex",
	desc: "A tiny tear in space. It's hungry.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "bhole3",
	anchored: 1,
	density: 0,
	light_range: 3,
	light_color: "#8A2BE2",
	/** Tiles it pulls from (only what it can see, so not through walls). */
	pull_range: 6,
	/** The pressure difference it fakes: 50 moves almost anything not anchored or in magboots. */
	strength: 50,
	/** Deciseconds it lasts. */
	lifespan: 100,
	death_time: null,
	/** What's mid-fall, so it isn't swallowed twice. */
	falling: null,
});

rt.def("/obj/effect/vortex/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "falling", rt.list());
	rt.setSv(f, "death_time", add(rt.worldTime(f), rt.sv(f, "lifespan")));
	rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/magic/repulse.ogg"), 80, 1]);
	return f.dot;
}, true);

rt.def("/obj/effect/vortex/proc/Destroy", function* Destroy(f: Frame) {
	rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract);
	return yield* g.callSuper(f, [], rt.Args.Same);
}, true);

rt.def("/obj/effect/vortex/proc/process", function* process(f: Frame) {
	let here: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [here, AM, $e];
	here = rt.sv(f, "loc");
	if (rt.gt(rt.worldTime(f), rt.sv(f, "death_time")) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [live(here)])))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 26; // PROCESS_KILL
	}
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [rt.sv(f, "pull_range"), live(f.src)])), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if (isEqual(live(AM), live(f.src)) || truthy(rt.fv(f, "anchored", live(AM)))) continue;
		// Loose objects (not effects like blood and sparks) and living mobs; ghosts and camera eyes aren't living.
		if (!((rt.istype(live(AM), T("/obj")) && !rt.istype(live(AM), T("/obj/effect"))) || rt.istype(live(AM), T("/mob/living")))) continue;
		if (rt.isIn(f, live(AM), rt.sv(f, "falling"))) continue;
		if (isEqual(rt.fv(f, "loc", live(AM)), live(here))) {
			rt.modSrcVar(f, "falling", live(AM), add);
			yield* g.srcCall(f, "swallow", live(AM));
		} else {
			yield* g.callName(f, live(AM), "experience_pressure_difference", [rt.sv(f, "strength"), rt.getDir(f, live(AM), live(f.src))]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// The lavaland chasm's fall (chasm.ts, /turf/open/chasm/straight_down/lava_land_surface/proc/drop): shrink, fade, sink, delete.
rt.def("/obj/effect/vortex/proc/swallow", function* swallow(f: Frame, AM: Value) {
	let L: Value = null, i: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [AM, L, i, S, $e];
	yield* g.callName(f, live(AM), "visible_message", [fmt("<span class='boldwarning'>＀ is sucked into ＀!</span>", [live(AM), live(f.src)]), "<span class='userdanger'>You're pulled into the vortex, and the world folds shut around you.</span>"]);
	if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
		rt.setFv(f, "notransform", (L = live(AM)), 1);
		yield* g.callName(f, live(L), "Stun", [200]);
		rt.setFv(f, "resting", live(L), 1);
	}
	rt.op(f, "Animate", [2, 10], [null, live(AM), "transform", subtract((yield* g.call(f, P("/proc/matrix"), null, [])), (yield* g.call(f, P("/proc/matrix"), null, []))), "alpha", 0, "color", rt.op(f, "Rgb", [1, 3], [0, 0, 0]), "time", 10]);
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((!truthy(live(AM)) || truthy(rt.fv(f, "gc_destroyed", live(AM))))) {
			return live(f.dot);
		}
		rt.incField(f, live(AM), "pixel_y", -1, true);
		yield* g.call(f, P("/proc/sleep"), null, [2]);
	}
	rt.endFor(f, 0);
	if ((!truthy(live(AM)) || truthy(rt.fv(f, "gc_destroyed", live(AM))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(AM), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.gv(f, "mmi", (S = live(AM)))]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(AM)]);
	return f.dot;
}, true, { waitfor: false });
