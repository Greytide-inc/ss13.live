// Based on /tg/station's code/modules/ruins/objects_and_mobs/ash_walker_den.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// ash_walker_den.dm:9
rt.def("/mob/living/simple_animal/hostile/spawner/ash_walker/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("ashwalker");

	this.loot = list(T("/obj/effect/gibspawner"), T("/obj/item/device/assembly/signaler/anomaly"));
	return f.dot;
});

// ash_walker_den.dm:18
rt.def("/mob/living/simple_animal/hostile/spawner/ash_walker/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.emitted_light = (yield* new_(T("/obj/effect/light_emitter/tendril"), this.loc));
	return f.dot;
}, true);

// ash_walker_den.dm:22
rt.def("/mob/living/simple_animal/hostile/spawner/ash_walker/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.emitted_light);
	this.emitted_light = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// ash_walker_den.dm:26
rt.def("/mob/living/simple_animal/hostile/spawner/ash_walker/proc/Life", function* Life(f: Frame) {
	yield* parent_proc();
	if (this.stat) return f.dot;
	yield* this.consume();
	yield* this.spawn_mob();
	return f.dot;
}, true, { waitfor: false });

// ash_walker_den.dm:32
rt.def("/mob/living/simple_animal/hostile/spawner/ash_walker/proc/consume", function* consume(f: Frame) {
	let H: Value = null, W: Value = null;
	for (H of each(view(this, 1), T("/mob/living"))) {
		if (H.stat) {
			this.visible_message(`<span class='warning'>Serrated tendrils eagerly pull ${H} to ${this}, tearing the body apart as its blood seeps over the eggs.</span>`);
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/demon_consume.ogg"), 100, 1);
			if (rt.istype(H, T("/mob/living/simple_animal/hostile/megafauna"))) {
				this.meat_counter += 20;
			} else {
				this.meat_counter++;
			}
			W = null;
			for (W of each(H, T("/obj/item"))) {
				yield* H.dropItemToGround(W);
			}
			yield* H.gib();
			yield* this.adjustHealth(-this.maxHealth * 0.05);
		}
	}
	return f.dot;
}, true);

// ash_walker_den.dm:46
rt.def("/mob/living/simple_animal/hostile/spawner/ash_walker/proc/spawn_mob", function* spawn_mob(f: Frame) {
	if (!(this.meat_counter >= 2)) return f.dot;
	yield* new_(T("/obj/effect/mob_spawn/human/ash_walker"), rt.getStep(f, this.loc, 2));
	this.visible_message("<span class='danger'>One of the eggs swells to an unnatural size and tumbles free. It's ready to hatch!</span>");
	this.meat_counter -= 2;
	return f.dot;
}, true);
