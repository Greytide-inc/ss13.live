// From code/modules/ruins/objects_and_mobs/ash_walker_den.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4932, "/mob/living/simple_animal/hostile/spawner/ash_walker", "/mob/living/simple_animal/hostile/spawner", {
	meat_counter: null,
	emitted_light: null,
	name: "ash walker nest",
	desc: "A nest built around a necropolis tendril. The eggs seem to grow unnaturally fast...",
	icon: rt.rsc("icons/mob/nest.dmi"),
	icon_state: "ash_walker_nest",
	icon_living: "ash_walker_nest",
	faction: null,
	health: 200,
	maxHealth: 200,
	loot: null,
	del_on_death: 1,
});

// /mob/living/simple_animal/hostile/spawner/ash_walker/proc/<init>  (code/modules/ruins/objects_and_mobs/ash_walker_den.dm:9)
rt.def("/mob/living/simple_animal/hostile/spawner/ash_walker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("ashwalker"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/gibspawner"), T("/obj/item/device/assembly/signaler/anomaly")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/spawner/ash_walker/proc/Initialize  (code/modules/ruins/objects_and_mobs/ash_walker_den.dm:18)  may sleep
rt.def("/mob/living/simple_animal/hostile/spawner/ash_walker/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "emitted_light", (yield* g.new_(f, T("/obj/effect/light_emitter/tendril"), [rt.sv(f, "loc")])));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/spawner/ash_walker/proc/Destroy  (code/modules/ruins/objects_and_mobs/ash_walker_den.dm:22)  may sleep
rt.def("/mob/living/simple_animal/hostile/spawner/ash_walker/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "emitted_light")]);
	rt.setSv(f, "emitted_light", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/spawner/ash_walker/proc/Life  (code/modules/ruins/objects_and_mobs/ash_walker_den.dm:26)  may sleep
rt.def("/mob/living/simple_animal/hostile/spawner/ash_walker/proc/Life", function* Life(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "stat"))) return f.dot;
	yield* g.srcCall(f, "consume");
	yield* g.srcCall(f, "spawn_mob");
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/spawner/ash_walker/proc/consume  (code/modules/ruins/objects_and_mobs/ash_walker_den.dm:32)  may sleep
rt.def("/mob/living/simple_animal/hostile/spawner/ash_walker/proc/consume", function* consume(f: Frame) {
	let H: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [H, W, $e];
	H = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [live(f.src), 1])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (truthy(rt.fv(f, "stat", live(H)))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>Serrated tendrils eagerly pull ＀ to ＀, tearing the body apart as its blood seeps over the eggs.</span>", [live(H), live(f.src)]));
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/demon_consume.ogg"), 100, 1]);
			if (truthy((rt.istype(live(H), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0))) {
				rt.modSrcVar(f, "meat_counter", 20, add);
			} else {
				rt.incSrcVar(f, "meat_counter", 1, true);
			}
			W = null;
			rt.forList(f, 1, live(H), T("/obj/item"));
			while (($e = rt.next(f, 1)) !== undefined) {
				W = $e;
				yield* g.callName(f, live(H), "dropItemToGround", [live(W)]);
			}
			rt.endFor(f, 1);
			yield* g.callName(f, live(H), "gib", []);
			yield* g.srcCall(f, "adjustHealth", multiply(rt.neg(rt.sv(f, "maxHealth")), 0.05000000074505806));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/spawner/ash_walker/proc/spawn_mob  (code/modules/ruins/objects_and_mobs/ash_walker_den.dm:46)  may sleep
rt.def("/mob/living/simple_animal/hostile/spawner/ash_walker/proc/spawn_mob", function* spawn_mob(f: Frame) {
	if (!rt.ge(rt.sv(f, "meat_counter"), 2)) return f.dot;
	yield* g.new_(f, T("/obj/effect/mob_spawn/human/ash_walker"), [rt.getStep(f, rt.fv(f, "loc", live(f.src)), 2)]);
	yield* g.srcCall(f, "visible_message", "<span class='danger'>One of the eggs swells to an unnatural size and tumbles free. It's ready to hatch!</span>");
	(rt.modSrcVar(f, "meat_counter", 2, subtract));
	return f.dot;
}, true);
