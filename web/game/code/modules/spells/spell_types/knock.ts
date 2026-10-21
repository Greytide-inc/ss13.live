// From code/modules/spells/spell_types/knock.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11372, "/obj/effect/proc_holder/spell/aoe_turf/knock", "/obj/effect/proc_holder/spell/aoe_turf", {
	name: "Knock",
	desc: "This spell opens nearby doors and does not require wizard garb.",
	school: "transmutation",
	charge_max: 100,
	clothes_req: 0,
	invocation: "AULIE OXIN FIERA",
	invocation_type: "whisper",
	range: 3,
	cooldown_min: 20,
	action_icon_state: "knock",
});

// /obj/effect/proc_holder/spell/aoe_turf/knock/proc/cast  (code/modules/spells/spell_types/knock.dm:16)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/knock/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null, door: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [user, _T, door, C, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	rt.op(f, "Output", [], [live(user), rt.call(f, P("/proc/sound"), null, [rt.rsc("sound/magic/knock.ogg")])], false);
	_T = null;
	rt.forList(f, 0, live(targets), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		door = null;
		rt.forList(f, 1, rt.fv(f, "contents", live(_T)), T("/obj/machinery/door"));
		while (($e = rt.next(f, 1)) !== undefined) {
			door = $e;
			rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/proc_holder/spell/aoe_turf/knock/proc/open_door"), live(door)]);
		}
		rt.endFor(f, 1);
		C = null;
		rt.forList(f, 1, rt.fv(f, "contents", live(_T)), T("/obj/structure/closet"));
		while (($e = rt.next(f, 1)) !== undefined) {
			C = $e;
			rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/proc_holder/spell/aoe_turf/knock/proc/open_closet"), live(C)]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/effect/proc_holder/spell/aoe_turf/knock/proc/open_door  (code/modules/spells/spell_types/knock.dm:24)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/knock/proc/open_door", function* open_door(f: Frame, door: Value) {
	let A: Value = null;
	f.vars = () => [door, A];
	if (truthy((rt.istype(live(door), T("/obj/machinery/door/airlock")) ? 1 : 0))) {
		rt.setFv(f, "locked", (A = live(door)), 0);
	}
	yield* g.callName(f, live(door), "open", []);
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/machinery/door" }] });

// /obj/effect/proc_holder/spell/aoe_turf/knock/proc/open_closet  (code/modules/spells/spell_types/knock.dm:30)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/knock/proc/open_closet", function* open_closet(f: Frame, C: Value) {
	f.vars = () => [C];
	rt.setFv(f, "locked", live(C), 0);
	yield* g.callName(f, live(C), "open", []);
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/structure/closet" }] });
