// From code/game/objects/effects/bump_teleporter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/effect/bump_teleporter/proc/New  (code/game/objects/effects/bump_teleporter.dm:15)  may sleep
rt.def("/obj/effect/bump_teleporter/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.gl("AllTeleporters"))) {
		rt.setGl("AllTeleporters", rt.list());
	}
	rt.modGl("AllTeleporters", live(f.src), add);
	return f.dot;
}, true);

// /obj/effect/bump_teleporter/proc/Destroy  (code/game/objects/effects/bump_teleporter.dm:19)  may sleep
rt.def("/obj/effect/bump_teleporter/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("AllTeleporters"))) {
		(rt.modGl("AllTeleporters", live(f.src), subtract));
		if (!truthy(rt.len(f, rt.gl("AllTeleporters")))) {
			rt.setGl("AllTeleporters", null);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/bump_teleporter/proc/Bumped  (code/game/objects/effects/bump_teleporter.dm:23)
rt.def("/obj/effect/bump_teleporter/proc/Bumped", function Bumped(f: Frame, user: Value) {
	let BT: Value = null;
	let $e: any;
	f.vars = () => [BT, $e];
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [live(user)]))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "id_target"))) {
		return live(f.dot);
	}
	BT = null;
	rt.forList(f, 0, rt.gl("AllTeleporters"), T("/obj/effect/bump_teleporter"));
	while (($e = rt.next(f, 0)) !== undefined) {
		BT = $e;
		if (isEqual(rt.fv(f, "id", live(BT)), rt.fv(f, "id_target", live(f.src)))) {
			rt.setFv(f, "loc", live(f.usr), rt.fv(f, "loc", live(BT)));
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
