// Based on /tg/station's code/game/objects/items/stacks/sheets/light.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9110, "/obj/item/stack/light_w", "/obj/item/stack", {
	singular_name: "wired glass floor tile",
	throw_speed: 3,
	throw_range: 7,
	flags: 64,
	max_amount: 60,
	name: "wired glass tile",
	desc: "A glass tile, which is wired, somehow.",
	icon: rt.rsc("icons/obj/tiles.dmi"),
	icon_state: "glass_wire",
	w_class: 3,
	force: 3,
	throwforce: 5,
});

// light.dm:17
rt.def("/obj/item/stack/light_w/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let CC: Value = null, G: Value = null, M: Value = null, L: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/wirecutters"))) {
		(CC = (yield* new_(T("/obj/item/stack/cable_coil"), user.loc))).amount = 5;
		yield* CC.add_fingerprint(user);
		this.amount--;
		yield* (G = (yield* new_(T("/obj/item/stack/sheet/glass"), user.loc))).add_fingerprint(user);
		if (this.amount <= 0) {
			yield* qdel(this);
		}
	} else if (rt.istype(O, T("/obj/item/stack/sheet/metal"))) {
		if (yield* (M = O).use(1)) {
			yield* this.use(1);
			L = (yield* new_(T("/obj/item/stack/tile/light"), user.loc));
			to_chat(user, "<span class='notice'>You make a light tile.</span>");
			yield* L.add_fingerprint(user);
		} else {
			to_chat(user, "<span class='warning'>You need one metal sheet to finish the light tile!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
