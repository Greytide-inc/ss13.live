// From code/game/objects/items/weapons/implants/implant_storage.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5515, "/obj/item/weapon/storage/internal/implant", "/obj/item/weapon/storage/internal", {
	name: "bluespace pocket",
	max_w_class: 3,
	max_combined_w_class: 6,
	silent: 1,
	cant_hold: null,
});

// /obj/item/weapon/storage/internal/implant/proc/<init>  (code/game/objects/items/weapons/implants/implant_storage.dm:5)
rt.def("/obj/item/weapon/storage/internal/implant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cant_hold", rt.list(T("/obj/item/weapon/disk/nuclear")));
	return f.dot;
});

rt.type(7414, "/obj/item/weapon/implant/storage", "/obj/item/weapon/implant", {
	storage: null,
	name: "storage implant",
	desc: "Stores up to two big items in a bluespace pocket.",
	icon_state: "storage",
	origin_tech: "materials=2;magnets=4;bluespace=5;syndicate=4",
	item_color: "r",
});

// /obj/item/weapon/implant/storage/proc/New  (code/game/objects/items/weapons/implants/implant_storage.dm:18)  may sleep
rt.def("/obj/item/weapon/implant/storage/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "storage", (yield* g.new_(f, T("/obj/item/weapon/storage/internal/implant"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/weapon/implant/storage/proc/activate  (code/game/objects/items/weapons/implants/implant_storage.dm:22)  may sleep
rt.def("/obj/item/weapon/implant/storage/proc/activate", function* activate(f: Frame) {
	yield* g.callName(f, rt.sv(f, "storage"), "MouseDrop", [rt.sv(f, "imp_in")]);
	return f.dot;
}, true);

// /obj/item/weapon/implant/storage/proc/removed  (code/game/objects/items/weapons/implants/implant_storage.dm:25)  may sleep
rt.def("/obj/item/weapon/implant/storage/proc/removed", function* removed(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (!truthy(live(f.args[2]))) {
		yield* g.callName(f, rt.sv(f, "storage"), "close_all", []);
		I = null;
		rt.forList(f, 0, rt.sv(f, "storage"), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.callName(f, rt.sv(f, "storage"), "remove_from_storage", [live(I), rt.getStep(f, live(f.args[0]), 0)]);
		}
		rt.endFor(f, 0);
	}
	return 1;
}, true, { args: ["source", "silent", "special"] });

// /obj/item/weapon/implant/storage/proc/implant  (code/game/objects/items/weapons/implants/implant_storage.dm:33)  may sleep
rt.def("/obj/item/weapon/implant/storage/proc/implant", function* implant(f: Frame) {
	let X: Value = null, imp_e: Value = null;
	let $e: any;
	f.vars = () => [X, imp_e, $e];
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	X = null;
	rt.forList(f, 0, rt.fv(f, "implants", live(f.args[0])));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy(rt.op(f, "IsType", [], [live(X), rt.sv(f, "type")]))) {
			rt.modField(f, rt.gv(f, "storage", (imp_e = live(X))), "storage_slots", rt.fv(f, "storage_slots", rt.sv(f, "storage")), add);
			rt.modField(f, rt.fv(f, "storage", live(imp_e)), "max_combined_w_class", rt.fv(f, "max_combined_w_class", rt.sv(f, "storage")), add);
			rt.modField(f, rt.fv(f, "storage", live(imp_e)), "contents", rt.fv(f, "contents", rt.sv(f, "storage")), add);
			yield* g.callName(f, rt.sv(f, "storage"), "close_all", []);
			yield* g.callName(f, rt.sv(f, "storage"), "show_to", [live(f.args[0])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return 1;
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["target", "user", "silent"] });
