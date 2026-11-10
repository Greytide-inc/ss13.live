// Based on /tg/station's code/game/objects/effects/bump_teleporter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11790, "/obj/effect/bump_teleporter", "/obj/effect", {
	id: null,
	id_target: null,
	anchored: 1,
	name: "bump-teleporter",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x2",
	invisibility: 101,
	density: 1,
	opacity: 0,
}, { global: { AllTeleporters: 779 } });

// bump_teleporter.dm:15
rt.def("/obj/effect/bump_teleporter/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (!GLOB.AllTeleporters) {
		GLOB.AllTeleporters = list();
	}
	GLOB.AllTeleporters += this;
	return f.dot;
}, true);

// bump_teleporter.dm:19
rt.def("/obj/effect/bump_teleporter/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.AllTeleporters) {
		GLOB.AllTeleporters -= this;
		if (!rt.len(f, GLOB.AllTeleporters)) {
			GLOB.AllTeleporters = null;
		}
	}
	return (yield* parent_proc());
}, true);

// bump_teleporter.dm:23
rt.def("/obj/effect/bump_teleporter/proc/Bumped", function Bumped(f: Frame, user: Value) {
	let BT: Value = null;
	if (!ismob(user)) {
		return f.dot;
	}
	if (!this.id_target) {
		return f.dot;
	}
	for (BT of each(GLOB.AllTeleporters, T("/obj/effect/bump_teleporter"))) {
		if (BT.id == this.id_target) {
			f.usr.loc = BT.loc;
			return f.dot;
		}
	}
	return f.dot;
});
