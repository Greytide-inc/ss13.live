// Based on /tg/station's code/game/objects/effects/spawners/bombspawner.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11836, "/obj/effect/spawner/newbomb", "/obj/effect/spawner", {
	btemp1: 1500,
	btemp2: 1000,
	assembly_type: null,
	name: "bomb",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x",
});

// bombspawner.dm:10
rt.def("/obj/effect/spawner/newbomb/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null;
	yield* parent_proc();
	let V: Value = (yield* new_(T("/obj/item/device/transfer_valve"), this.loc));
	let PT: Value = (yield* new_(T("/obj/item/weapon/tank/internals/plasma/full"), V));
	let OT: Value = (yield* new_(T("/obj/item/weapon/tank/internals/oxygen"), V));
	PT.air_contents.temperature = this.btemp1 + T0C;
	OT.air_contents.temperature = this.btemp2 + T0C;
	V.tank_one = PT;
	V.tank_two = OT;
	PT.master = V;
	OT.master = V;
	if (this.assembly_type) {
		A = (yield* new_(this.assembly_type, V));
		V.attached_device = A;
		A.holder = V;
		yield* A.toggle_secure();
	}
	yield* V.update_icon();
	yield* qdel(this);
	return f.dot;
}, true);
