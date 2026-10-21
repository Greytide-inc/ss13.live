// From code/game/objects/structures/crates_lockers/closets/secure/personal.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12384, "/obj/structure/closet/secure_closet/personal", "/obj/structure/closet/secure_closet", {
	registered_name: null,
	desc: "It's a secure locker for personnel. The first card swiped gains control.",
	name: "personal closet",
	req_access: null,
});

// /obj/structure/closet/secure_closet/personal/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/personal.dm:4)
rt.def("/obj/structure/closet/secure_closet/personal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(21));
	return f.dot;
});

// /obj/structure/closet/secure_closet/personal/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/personal.dm:8)  may sleep
rt.def("/obj/structure/closet/secure_closet/personal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.new_(f, T("/obj/item/weapon/storage/backpack/duffelbag"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.new_(f, T("/obj/item/weapon/storage/backpack"), [live(f.src)]);
	} else {
		yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel"), [live(f.src)]);
	}
	yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12385, "/obj/structure/closet/secure_closet/personal/patient", "/obj/structure/closet/secure_closet/personal", {
	name: "patient's closet",
});

// /obj/structure/closet/secure_closet/personal/patient/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/personal.dm:21)  may sleep
rt.def("/obj/structure/closet/secure_closet/personal/patient/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/under/color/white"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/white"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12386, "/obj/structure/closet/secure_closet/personal/cabinet", "/obj/structure/closet/secure_closet/personal", {
	icon_state: "cabinet",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
});

// /obj/structure/closet/secure_closet/personal/cabinet/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/personal.dm:31)  may sleep
rt.def("/obj/structure/closet/secure_closet/personal/cabinet/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/leather/withwallet"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/closet/secure_closet/personal/proc/attackby  (code/game/objects/structures/crates_lockers/closets/secure/personal.dm:35)  may sleep
rt.def("/obj/structure/closet/secure_closet/personal/proc/attackby", function* attackby(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (truthy((rt.istype((I = (yield* g.callName(f, live(f.args[0]), "GetID", []))), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "broken"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>It appears to be broken.</span>"]);
			return live(f.dot);
		}
		if ((!truthy(live(I)) || !truthy(rt.fv(f, "registered_name", live(I))))) {
			return live(f.dot);
		}
		if (((truthy((yield* g.srcCall(f, "allowed", live(f.args[1])))) || !truthy(rt.sv(f, "registered_name"))) || (truthy((rt.istype(live(I), T("/obj/item/weapon/card/id")) ? 1 : 0)) && isEqual(rt.sv(f, "registered_name"), rt.fv(f, "registered_name", live(I)))))) {
			rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
			yield* g.srcCall(f, "update_icon");
			if (!truthy(rt.sv(f, "registered_name"))) {
				rt.setSv(f, "registered_name", rt.fv(f, "registered_name", live(I)));
				rt.setSv(f, "desc", fmt("Owned by ＀.", [rt.fv(f, "registered_name", live(I))]));
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Access Denied.</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });
