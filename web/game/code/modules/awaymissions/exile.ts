// From code/modules/awaymissions/exile.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12407, "/obj/structure/closet/secure_closet/exile", "/obj/structure/closet/secure_closet", {
	name: "exile implants",
	req_access: null,
});

// /obj/structure/closet/secure_closet/exile/proc/<init>  (code/modules/awaymissions/exile.dm:4)
rt.def("/obj/structure/closet/secure_closet/exile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(58));
	return f.dot;
});

// /obj/structure/closet/secure_closet/exile/proc/New  (code/modules/awaymissions/exile.dm:7)  may sleep
rt.def("/obj/structure/closet/secure_closet/exile/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/implanter/exile"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/implantcase/exile"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/implantcase/exile"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/implantcase/exile"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/implantcase/exile"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/implantcase/exile"), [live(f.src)]);
	return f.dot;
}, true);
