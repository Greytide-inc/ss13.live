// From code/game/objects/structures/crates_lockers/crates.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12253, "/obj/structure/closet/crate", "/obj/structure/closet", {
	manifest: null,
	can_weld_shut: 0,
	horizontal: 1,
	allow_objects: 1,
	allow_dense: 1,
	dense_when_open: 1,
	delivery_icon: "deliverycrate",
	name: "crate",
	desc: "A rectangular steel crate.",
	icon: rt.rsc("icons/obj/crates.dmi"),
	icon_state: "crate",
	req_access: null,
	climbable: 1,
	climb_time: 10,
	climb_stun: 0,
});

// /obj/structure/closet/crate/proc/New  (code/game/objects/structures/crates_lockers/crates.dm:19)  may sleep
rt.def("/obj/structure/closet/crate/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/closet/crate/proc/CanPass  (code/game/objects/structures/crates_lockers/crates.dm:23)
rt.def("/obj/structure/closet/crate/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let locatedcrate: Value = null;
	f.vars = () => [height, locatedcrate];
	if (live(height) === null) {
		height = 0;
	}
	if (!truthy((rt.istype(live(mover), T("/obj/structure/closet")) ? 1 : 0))) {
		if (truthy((locatedcrate = rt.locateIn(f, T("/obj/structure/closet/crate"), rt.getStep(f, live(mover), 0))))) {
			if (truthy(rt.sv(f, "opened"))) {
				return 1;
			}
			if (!truthy(rt.fv(f, "opened", live(locatedcrate)))) {
				return 1;
			}
		}
	}
	return (!truthy(rt.sv(f, "density")) ? 1 : 0);
});

// /obj/structure/closet/crate/proc/update_icon  (code/game/objects/structures/crates_lockers/crates.dm:33)
rt.def("/obj/structure/closet/crate/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "opened"))) {
		$1 = "open";
	} else {
		$1 = "";
	}
	rt.setSv(f, "icon_state", fmt("＀＀", [$0, $1]));
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "manifest"))) return f.dot;
	rt.callSrc(f, "add_overlay", ["manifest"]);
	return f.dot;
});

// /obj/structure/closet/crate/proc/attack_hand  (code/game/objects/structures/crates_lockers/crates.dm:41)  may sleep
rt.def("/obj/structure/closet/crate/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy(rt.sv(f, "manifest"))) {
		yield* g.srcCall(f, "tear_manifest", live(f.args[0]));
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/closet/crate/proc/open  (code/game/objects/structures/crates_lockers/crates.dm:46)  may sleep
rt.def("/obj/structure/closet/crate/proc/open", function* open(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy(rt.sv(f, "manifest")))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>The manifest is torn off ＀.</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/poster_ripped.ogg"), 75, 1]);
	yield* g.callName(f, rt.sv(f, "manifest"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	rt.setSv(f, "manifest", null);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/closet/crate/proc/tear_manifest  (code/game/objects/structures/crates_lockers/crates.dm:55)  may sleep
rt.def("/obj/structure/closet/crate/proc/tear_manifest", function* tear_manifest(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You tear the manifest off of ＀.</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/poster_ripped.ogg"), 75, 1]);
	yield* g.callName(f, rt.sv(f, "manifest"), "forceMove", [rt.sv(f, "loc")]);
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "manifest")]);
	}
	rt.setSv(f, "manifest", null);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(12258, "/obj/structure/closet/crate/freezer/blood", "/obj/structure/closet/crate/freezer", {
	name: "blood freezer",
	desc: "A freezer containing packs of blood.",
});

// /obj/structure/closet/crate/freezer/blood/proc/PopulateContents  (code/game/objects/structures/crates_lockers/crates.dm:89)  may sleep
rt.def("/obj/structure/closet/crate/freezer/blood/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/blood/empty"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/blood/empty"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/blood/AMinus"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/blood/BMinus"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/blood/BPlus"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/blood/OMinus"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/blood/OPlus"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/blood/lizard"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/blood/random"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12259, "/obj/structure/closet/crate/freezer/surplus_limbs", "/obj/structure/closet/crate/freezer", {
	name: "surplus prosthetic limbs",
	desc: "A crate containing an assortment of cheap prosthetic limbs.",
});

// /obj/structure/closet/crate/freezer/surplus_limbs/proc/PopulateContents  (code/game/objects/structures/crates_lockers/crates.dm:106)  may sleep
rt.def("/obj/structure/closet/crate/freezer/surplus_limbs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.new_(f, T("/obj/item/bodypart/l_arm/robot/surplus"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/bodypart/l_arm/robot/surplus"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/bodypart/r_arm/robot/surplus"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/bodypart/r_arm/robot/surplus"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/bodypart/l_leg/robot/surplus"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/bodypart/l_leg/robot/surplus"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/bodypart/r_leg/robot/surplus"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/bodypart/r_leg/robot/surplus"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12264, "/obj/structure/closet/crate/rcd", "/obj/structure/closet/crate", {
	desc: "A crate for the storage of an RCD.",
	name: "１RCD crate",
	icon_state: "engi_crate",
});

// /obj/structure/closet/crate/rcd/proc/PopulateContents  (code/game/objects/structures/crates_lockers/crates.dm:139)  may sleep
rt.def("/obj/structure/closet/crate/rcd/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/rcd_ammo"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/construction/rcd"), [live(f.src)]);
	return f.dot;
}, true);
