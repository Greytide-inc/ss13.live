// Based on /tg/station's code/game/objects/structures/mop_bucket.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12811, "/obj/structure/mopbucket", "/obj/structure", {
	amount_per_transfer_from_this: 5,
	container_type: 4096,
	name: "mop bucket",
	desc: "Fill it with water, but don't forget a mop!",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "mopbucket",
	density: 1,
});

// mop_bucket.dm:12
rt.def("/obj/structure/mopbucket/proc/New", function* New(f: Frame) {
	yield* this.create_reagents(100);
	yield* parent_proc();
	return f.dot;
}, true);

// mop_bucket.dm:16
rt.def("/obj/structure/mopbucket/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/mop"))) {
		if (this.reagents.total_volume < 1) {
			to_chat(user, `${this} is out of water!</span>`);
		} else {
			yield* this.reagents.trans_to(I, 5);
			to_chat(user, `<span class='notice'>You wet ${I} in ${this}.</span>`);
			playsound(this.loc, rt.rsc("sound/effects/slosh.ogg"), 25, 1);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
