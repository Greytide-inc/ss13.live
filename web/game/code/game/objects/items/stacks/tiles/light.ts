// Based on /tg/station's code/game/objects/items/stacks/tiles/light.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8973, "/obj/item/stack/tile/light", "/obj/item/stack/tile", {
	state: 0,
	flags: 64,
	name: "light tile",
	singular_name: "light floor tile",
	desc: "A floor tile, made out of glass. It produces light.",
	icon_state: "tile_e",
	attack_verb: null,
	turf_type: rt.typePath("/turf/open/floor/light"),
});

// light.dm:12
rt.def("/obj/item/stack/tile/light/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	yield* parent_proc();
	if (prob(5)) {
		this.state = 3;
	} else if (prob(5)) {
		this.state = 2;
	} else if (prob(10)) {
		this.state = 1;
	} else {
		this.state = 0;
	}
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// light.dm:23
rt.def("/obj/item/stack/tile/light/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/crowbar"))) {
		yield* new_(T("/obj/item/stack/sheet/metal"), user.loc);
		this.amount--;
		yield* new_(T("/obj/item/stack/light_w"), user.loc);
		if (this.amount <= 0) {
			yield* qdel(this);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
