// Based on /tg/station's code/modules/awaymissions/exile.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12407, "/obj/structure/closet/secure_closet/exile", "/obj/structure/closet/secure_closet", {
	name: "exile implants",
	req_access: null,
});

// exile.dm:4
rt.def("/obj/structure/closet/secure_closet/exile/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(58);
	return f.dot;
});

// exile.dm:7
rt.def("/obj/structure/closet/secure_closet/exile/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/implanter/exile"), this);
	yield* new_(T("/obj/item/weapon/implantcase/exile"), this);
	yield* new_(T("/obj/item/weapon/implantcase/exile"), this);
	yield* new_(T("/obj/item/weapon/implantcase/exile"), this);
	yield* new_(T("/obj/item/weapon/implantcase/exile"), this);
	yield* new_(T("/obj/item/weapon/implantcase/exile"), this);
	return f.dot;
}, true);
