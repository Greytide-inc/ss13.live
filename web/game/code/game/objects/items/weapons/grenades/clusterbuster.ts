// Based on /tg/station's code/game/objects/items/weapons/grenades/clusterbuster.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(6901, "/obj/item/weapon/grenade/clusterbuster", "/obj/item/weapon/grenade", {
	payload: rt.typePath("/obj/item/weapon/grenade/flashbang/cluster"),
	desc: "Use of this weapon may constiute a war crime in your area, consult your local captain.",
	name: "clusterbang",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "clusterbang",
});

// clusterbuster.dm:12
rt.def("/obj/item/weapon/grenade/clusterbuster/proc/prime", function* prime(f: Frame) {
	yield* this.update_mob();
	let numspawned: Value = rand(4, 8);
	let again: Value = 0;
	let more: Value = numspawned;
	while (more > 0) {
		if (prob(35)) {
			again++;
			numspawned--;
		}
		more--;
	}
	let loop: Value = again;
	while (loop > 0) {
		yield* new_(T("/obj/item/weapon/grenade/clusterbuster/segment"), this.loc, this.payload);
		loop--;
	}
	yield* new_(T("/obj/effect/payload_spawner"), this.loc, this.payload, numspawned);
	playsound(this.loc, rt.rsc("sound/weapons/armbomb.ogg"), 75, 1, -3);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(6902, "/obj/item/weapon/grenade/clusterbuster/segment", "/obj/item/weapon/grenade/clusterbuster", {
	desc: "A smaller segment of a clusterbang. Better run.",
	name: "clusterbang segment",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "clusterbang_segment",
});

// clusterbuster.dm:41
rt.def("/obj/item/weapon/grenade/clusterbuster/segment/proc/New", function* New(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = T("/obj/item/weapon/grenade/flashbang/cluster");
	}
	yield* parent_proc();
	this.icon_state = "clusterbang_segment_active";
	this.payload = f.args[1];
	this.active = 1;
	walk_away(this, f.args[0], rand(1, 4));
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/grenade/clusterbuster/segment/proc/prime"))), rand(15, 60));
	return f.dot;
}, true, { args: ["loc", "payload_type"] });

// clusterbuster.dm:50
rt.def("/obj/item/weapon/grenade/clusterbuster/segment/proc/prime", function* prime(f: Frame) {
	yield* new_(T("/obj/effect/payload_spawner"), this.loc, this.payload, rand(4, 8));
	playsound(this.loc, rt.rsc("sound/weapons/armbomb.ogg"), 75, 1, -3);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11952, "/obj/effect/payload_spawner", "/obj/effect", {});

// clusterbuster.dm:61
rt.def("/obj/effect/payload_spawner/proc/New", function* New(f: Frame, newloc: Value, type: Value, numspawned: Value) {
	let _P: Value = null;
	let loop: Value = numspawned;
	while (loop > 0) {
		(_P = (yield* new_(type, this.loc))).active = 1;
		walk_away(_P, this.loc, rand(1, 4));
		rt.spawnTail(f, rand(15, 60), "/obj/effect/payload_spawner/proc/New: spawn at game/objects/items/weapons/grenades/clusterbuster.dm:64", newloc, type, numspawned, loop, _P);
		loop--;
	}
	return f.dot;
}, true);

// a spawn((yield* g.call(f, P("/proc/rand"), null, [15, 60]))) body of /obj/effect/payload_spawner/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/payload_spawner/proc/New: spawn at game/objects/items/weapons/grenades/clusterbuster.dm:64", function* (f: Frame, newloc: Value, type: Value, numspawned: Value, loop: Value, _P: Value) {
	if (_P && !(!_P || _P.gc_destroyed)) {
		yield* _P.prime();
	}
	yield* qdel(this);
	return null;
});

rt.type(6916, "/obj/item/weapon/grenade/clusterbuster/random", "/obj/item/weapon/grenade/clusterbuster", {});

// clusterbuster.dm:133
rt.def("/obj/item/weapon/grenade/clusterbuster/random/proc/New", function* New(f: Frame) {
	let real_type: Value = pick(typesof(T("/obj/item/weapon/grenade/clusterbuster")) - T("/obj/item/weapon/grenade/clusterbuster"));
	yield* new_(real_type, this.loc);
	yield* qdel(this);
	return f.dot;
}, true);
