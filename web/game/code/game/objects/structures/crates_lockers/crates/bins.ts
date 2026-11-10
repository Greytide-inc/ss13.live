// Based on /tg/station's code/game/objects/structures/crates_lockers/crates/bins.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12266, "/obj/structure/closet/crate/bin", "/obj/structure/closet/crate", {
	open_sound: rt.rsc("sound/effects/bin_open.ogg"),
	close_sound: rt.rsc("sound/effects/bin_close.ogg"),
	anchored: 1,
	horizontal: 0,
	delivery_icon: null,
	desc: "A trash bin, place your trash here for the janitor to collect.",
	name: "trash bin",
	icon_state: "largebins",
});

// bins.dm:12
rt.def("/obj/structure/closet/crate/bin/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// bins.dm:16
rt.def("/obj/structure/closet/crate/bin/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.cut_overlays();
	if (rt.len(f, this.contents) == 0) {
		this.add_overlay("largebing");
	} else if (rt.len(f, this.contents) >= this.storage_capacity) {
		this.add_overlay("largebinr");
	} else {
		this.add_overlay("largebino");
	}
	return f.dot;
});

// bins.dm:26
rt.def("/obj/structure/closet/crate/bin/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null, O: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/storage/bag/trash"))) {
		_T = W;
		to_chat(user, "<span class='notice'>You fill the bag.</span>");
		for (O of each(this, T("/obj/item"))) {
			if (_T.can_be_inserted(O, 1)) {
				O.loc = _T;
			}
		}
		yield* _T.update_icon();
		yield* this.do_animate();
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		this.anchored = (!this.anchored ? 1 : 0);
		playsound(this.loc, W.usesound, 75, 1);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// bins.dm:41
rt.def("/obj/structure/closet/crate/bin/proc/do_animate", function do_animate(f: Frame) {
	playsound(this.loc, this.open_sound, 15, 1, -3);
	flick("animate_largebins", this);
	rt.spawnTail(f, 13, "/obj/structure/closet/crate/bin/proc/do_animate: spawn at game/objects/structures/crates_lockers/crates/bins.dm:43");
	return f.dot;
});

// a spawn(13) body of /obj/structure/closet/crate/bin/proc/do_animate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/closet/crate/bin/proc/do_animate: spawn at game/objects/structures/crates_lockers/crates/bins.dm:43", function* (f: Frame) {
	playsound(this.loc, this.close_sound, 15, 1, -3);
	yield* this.update_icon();
	return null;
});
