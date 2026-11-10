// Based on /tg/station's code/game/objects/structures/crates_lockers/crates/large.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12268, "/obj/structure/closet/crate/large", "/obj/structure/closet/crate", {
	material_drop: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	delivery_icon: "deliverybox",
	name: "large crate",
	desc: "A hefty wooden crate.",
	icon_state: "largecrate",
	density: 1,
});

// large.dm:10
rt.def("/obj/structure/closet/crate/large/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	if (this.manifest) {
		yield* this.tear_manifest(user);
	} else {
		to_chat(user, "<span class='warning'>You need a crowbar to pry this open!</span>");
	}
	return f.dot;
}, true);

// large.dm:17
rt.def("/obj/structure/closet/crate/large/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null, i: Value = null, AM: Value = null;
	let $e: any;
	if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
		_T = rt.getStep(f, this, 0);
		if (this.manifest) {
			yield* this.tear_manifest(user);
		}
		user.visible_message(fmt("＀ pries ％！ open.", [user, this]), fmt("<span class='notice'>You pry open ％！.</span>", [this]), "<span class='italics'>You hear splitting wood.</span>");
		playsound(this.loc, rt.rsc("sound/weapons/slashmiss.ogg"), 75, 1);
		rt.forRange(f, 0, 1, rand(2, 5), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* new_(this.material_drop, this);
		}
		rt.endFor(f, 0);
		for (AM of each(this.contents, T("/atom/movable"))) {
			yield* AM.forceMove(_T);
		}
		yield* qdel(this);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
