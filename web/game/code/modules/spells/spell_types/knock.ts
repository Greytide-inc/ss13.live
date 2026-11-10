// Based on /tg/station's code/modules/spells/spell_types/knock.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


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

// knock.dm:16
rt.def("/obj/effect/proc_holder/spell/aoe_turf/knock/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null, door: Value = null, C: Value = null;
	user ??= f.usr;
	rt.op(f, "Output", [], [user, sound(rt.rsc("sound/magic/knock.ogg"))], false);
	for (_T of each(targets, T("/turf"))) {
		door = null;
		for (door of each(_T.contents, T("/obj/machinery/door"))) {
			ImmediateInvokeAsync(this, P("/obj/effect/proc_holder/spell/aoe_turf/knock/proc/open_door"), door);
		}
		C = null;
		for (C of each(_T.contents, T("/obj/structure/closet"))) {
			ImmediateInvokeAsync(this, P("/obj/effect/proc_holder/spell/aoe_turf/knock/proc/open_closet"), C);
		}
	}
	return f.dot;
});

// knock.dm:24
rt.def("/obj/effect/proc_holder/spell/aoe_turf/knock/proc/open_door", function* open_door(f: Frame, door: Value) {
	let A: Value = null;
	if (rt.istype(door, T("/obj/machinery/door/airlock"))) {
		(A = door).locked = 0;
	}
	yield* door.open();
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/machinery/door" }] });

// knock.dm:30
rt.def("/obj/effect/proc_holder/spell/aoe_turf/knock/proc/open_closet", function* open_closet(f: Frame, C: Value) {
	C.locked = 0;
	yield* C.open();
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/structure/closet" }] });
