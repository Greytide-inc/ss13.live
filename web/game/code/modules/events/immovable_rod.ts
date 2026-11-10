// Based on /tg/station's code/modules/events/immovable_rod.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(303, "/datum/round_event/immovable_rod", "/datum/round_event", {
	announceWhen: 5,
});

// immovable_rod.dm:20
rt.def("/datum/round_event/immovable_rod/proc/announce", function* announce(f: Frame) {
	yield* priority_announce("What the fuck was that?!", "General Alert");
	return f.dot;
}, true);

// immovable_rod.dm:23
rt.def("/datum/round_event/immovable_rod/proc/start", function* start(f: Frame) {
	let startside: Value = pick(GLOB.cardinal);
	let startT: Value = spaceDebrisStartLoc(startside, ZLEVEL_STATION);
	let endT: Value = spaceDebrisFinishLoc(startside, ZLEVEL_STATION);
	yield* new_(T("/obj/effect/immovablerod"), startT, endT);
	return f.dot;
}, true);

rt.type(12048, "/obj/effect/immovablerod", "/obj/effect", {
	z_original: 0,
	destination: null,
	notify: 1,
	anchored: 1,
	name: "immovable rod",
	desc: "What the fuck is that?",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "immrod",
	throwforce: 100,
	density: 1,
});

// immovable_rod.dm:41
rt.def("/obj/effect/immovablerod/proc/New", function* New(f: Frame, start: Value, end: Value) {
	yield* parent_proc();
	if (GLOB.SSaugury) {
		GLOB.SSaugury.register_doom(this, 2000);
	}
	this.z_original = this.z;
	this.destination = end;
	if (this.notify) {
		yield* notify_ghosts(fmt("＆！ is inbound!", [this]), { enter_link: fmt("<a href=?src=＃;orbit=1>(Click to orbit)</a>", [this]), source: this, action: "orbit" });
	}
	GLOB.poi_list += this;
	if (!(end && end.z == this.z_original)) return f.dot;
	walk_towards(this, this.destination, 1);
	return f.dot;
}, true);

// immovable_rod.dm:55
rt.def("/obj/effect/immovablerod/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	if (!rt.at(href_list, "orbit")) return f.dot;
	if (!rt.istype((ghost = f.usr), T("/mob/dead/observer"))) return f.dot;
	yield* ghost.ManualFollow(this);
	return f.dot;
}, true);

// immovable_rod.dm:61
rt.def("/obj/effect/immovablerod/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.poi_list -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// immovable_rod.dm:65
rt.def("/obj/effect/immovablerod/proc/Move", function* Move(f: Frame) {
	if (this.z != this.z_original || this.loc == this.destination) {
		yield* qdel(this);
	}
	return (yield* parent_proc());
}, true);

// immovable_rod.dm:73
rt.def("/obj/effect/immovablerod/proc/Bump", function* Bump(f: Frame, clong: Value) {
	let other: Value = null, smoke: Value = null;
	if (prob(10)) {
		playsound(this, rt.rsc("sound/effects/bang.ogg"), 50, 1);
		this.audible_message("<span class='danger'>You hear a CLANG!</span>");
	}
	if (clong && prob(25)) {
		this.x = clong.x;
		this.y = clong.y;
	}
	if (isturf(clong) || rt.istype(clong, T("/obj"))) {
		if (clong.density) {
			yield* clong.ex_act(2);
		}
	} else if (rt.istype(clong, T("/mob/living"))) {
		yield* this.penetrate(clong);
	} else {
		if (!rt.op(f, "IsType", [], [clong, this.type])) return f.dot;
		other = clong;
		this.visible_message(`<span class='danger'>${this} collides with ${other}!</span>`);
		yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(2, rt.getStep(f, this, 0));
		yield* smoke.start();
		yield* qdel(this);
		yield* qdel(other);
	}
	return f.dot;
}, true);

// immovable_rod.dm:98
rt.def("/obj/effect/immovablerod/proc/penetrate", function* penetrate(f: Frame, L: Value) {
	let H: Value = null;
	L.visible_message(`<span class='danger'>${L} is penetrated by an immovable rod!</span>`, "<span class='userdanger'>The rod penetrates you!</span>", "<span class ='danger'>You hear a CLANG!</span>");
	if (rt.istype(L, T("/mob/living/carbon/human"))) {
		yield* (H = L).adjustBruteLoss(160);
	}
	if (!(L && (L.density || prob(10)))) return f.dot;
	yield* L.ex_act(2);
	return f.dot;
}, true);
