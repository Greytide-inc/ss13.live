// From code/game/objects/structures/crates_lockers/crates/bins.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/structure/closet/crate/bin/proc/New  (code/game/objects/structures/crates_lockers/crates/bins.dm:12)  may sleep
rt.def("/obj/structure/closet/crate/bin/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/closet/crate/bin/proc/update_icon  (code/game/objects/structures/crates_lockers/crates/bins.dm:16)
rt.def("/obj/structure/closet/crate/bin/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "cut_overlays", []);
	if (isEqual(rt.len(f, rt.sv(f, "contents")), 0)) {
		rt.callSrc(f, "add_overlay", ["largebing"]);
	} else {
		if (rt.ge(rt.len(f, rt.sv(f, "contents")), rt.sv(f, "storage_capacity"))) {
			rt.callSrc(f, "add_overlay", ["largebinr"]);
		} else {
			rt.callSrc(f, "add_overlay", ["largebino"]);
		}
	}
	return f.dot;
});

// /obj/structure/closet/crate/bin/proc/attackby  (code/game/objects/structures/crates_lockers/crates/bins.dm:26)  may sleep
rt.def("/obj/structure/closet/crate/bin/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [_T, O, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag/trash")) ? 1 : 0))) {
		_T = live(f.args[0]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You fill the bag.</span>"]);
		O = null;
		rt.forList(f, 0, live(f.src), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			if (truthy((yield* g.callName(f, live(_T), "can_be_inserted", [live(O), 1])))) {
				rt.setFv(f, "loc", live(O), live(_T));
			}
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(_T), "update_icon", []);
		yield* g.srcCall(f, "do_animate");
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/closet/crate/bin/proc/do_animate  (code/game/objects/structures/crates_lockers/crates/bins.dm:41)
rt.def("/obj/structure/closet/crate/bin/proc/do_animate", function do_animate(f: Frame) {
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "open_sound"), 15, 1, -3]);
	rt.call(f, P("/proc/flick"), null, ["animate_largebins", live(f.src)]);
	rt.spawnTail(f, 13, "/obj/structure/closet/crate/bin/proc/do_animate: spawn at game/objects/structures/crates_lockers/crates/bins.dm:43");
	return f.dot;
});

// a spawn(13) body of /obj/structure/closet/crate/bin/proc/do_animate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/closet/crate/bin/proc/do_animate: spawn at game/objects/structures/crates_lockers/crates/bins.dm:43", function* (f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "close_sound"), 15, 1, -3]);
	yield* g.srcCall(f, "update_icon");
	return null;
});
