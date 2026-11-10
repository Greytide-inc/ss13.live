// tg_js addition (not from tg's DM): the vortex grenade. Its vortex pulls loose objects and living mobs in with the
// space-wind push (experience_pressure_difference, so magboots and anchoring hold like in a breach; the air is left alone),
// and whatever reaches its tile falls in like the lavaland chasm (chasm.ts drop) and is deleted. The floor stays.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type("/obj/item/weapon/grenade/vortex", "/obj/item/weapon/grenade", {
	name: "vortex grenade",
	desc: "Pulls everything loose nearby into a tiny rift and swallows it. Stand well back.",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "bluefrag",
	item_state: "flashbang",
});

rt.def("/obj/item/weapon/grenade/vortex/proc/prime", function* prime(f: Frame) {
	let _T: Value = null;
	yield* this.update_mob();
	if (_T = rt.getStep(f, this, 0)) {
		yield* new_(T("/obj/effect/vortex"), _T);
	}
	yield* qdel(this);
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
	yield* parent_proc();
	this.falling = list();
	this.death_time = rt.worldTime(f) + this.lifespan;
	GLOB.SSfastprocess.processing += this;
	playsound(this, rt.rsc("sound/magic/repulse.ogg"), 80, 1);
	return f.dot;
}, true);

rt.def("/obj/effect/vortex/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSfastprocess.processing -= this;
	return yield* parent_proc();
}, true);

rt.def("/obj/effect/vortex/proc/process", function* process(f: Frame) {
	let AM: Value = null;
	let here: Value = this.loc;
	if (rt.worldTime(f) > this.death_time || !isturf(here)) {
		yield* qdel(this);
		return 26; // PROCESS_KILL
	}
	for (AM of each(view(this.pull_range, this), T("/atom/movable"))) {
		if (AM == this || AM.anchored) continue;
		// Loose objects (not effects like blood and sparks) and living mobs; ghosts and camera eyes aren't living.
		if (!(rt.istype(AM, T("/obj")) && !rt.istype(AM, T("/obj/effect")) || rt.istype(AM, T("/mob/living")))) continue;
		if (rt.isIn(f, AM, this.falling)) continue;
		if (AM.loc == here) {
			this.falling += AM;
			yield* this.swallow(AM);
		} else {
			yield* AM.experience_pressure_difference(this.strength, rt.getDir(f, AM, this));
		}
	}
	return f.dot;
}, true, { waitfor: false });

// The lavaland chasm's fall (chasm.ts, /turf/open/chasm/straight_down/lava_land_surface/proc/drop): shrink, fade, sink, delete.
rt.def("/obj/effect/vortex/proc/swallow", function* swallow(f: Frame, AM: Value) {
	let L: Value = null, i: Value = null, S: Value = null;
	let $e: any;
	AM.visible_message(`<span class='boldwarning'>${AM} is sucked into ${this}!</span>`, "<span class='userdanger'>You're pulled into the vortex, and the world folds shut around you.</span>");
	if (rt.istype(AM, T("/mob/living"))) {
		(L = AM).notransform = 1;
		yield* L.Stun(200);
		L.resting = 1;
	}
	rt.op(f, "Animate", [2, 10], [null, AM, "transform", matrix() - matrix(), "alpha", 0, "color", rt.op(f, "Rgb", [1, 3], [0, 0, 0]), "time", 10]);
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!AM || AM.gc_destroyed) {
			return f.dot;
		}
		AM.pixel_y--;
		yield* sleep(2);
	}
	rt.endFor(f, 0);
	if (!AM || AM.gc_destroyed) {
		return f.dot;
	}
	if (rt.istype(AM, T("/mob/living/silicon/robot"))) {
		yield* qdel((S = AM).mmi);
	}
	yield* qdel(AM);
	return f.dot;
}, true, { waitfor: false });
