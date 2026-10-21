// From code/modules/mining/equipment/mining_tools.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7529, "/obj/item/weapon/pickaxe", "/obj/item/weapon", {
	digspeed: 40,
	digsound: null,
	flags: 64,
	name: "pickaxe",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "pickaxe",
	slot_flags: 1536,
	force: 15,
	throwforce: 10,
	item_state: "pickaxe",
	w_class: 4,
	materials: null,
	origin_tech: "materials=2;engineering=3",
	attack_verb: null,
});

// /obj/item/weapon/pickaxe/proc/<init>  (code/modules/mining/equipment/mining_tools.dm:12)
rt.def("/obj/item/weapon/pickaxe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "digsound", rt.list(rt.rsc("sound/effects/picaxe1.ogg"), rt.rsc("sound/effects/picaxe2.ogg"), rt.rsc("sound/effects/picaxe3.ogg")));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	rt.setSv(f, "attack_verb", rt.list("hit", "pierced", "sliced", "attacked"));
	return f.dot;
});

rt.type(7530, "/obj/item/weapon/pickaxe/mini", "/obj/item/weapon/pickaxe", {
	name: "compact pickaxe",
	desc: "A smaller, compact version of the standard pickaxe.",
	icon_state: "minipick",
	force: 10,
	throwforce: 7,
	slot_flags: 512,
	w_class: 3,
	materials: null,
});

// /obj/item/weapon/pickaxe/mini/proc/<init>  (code/modules/mining/equipment/mining_tools.dm:26)
rt.def("/obj/item/weapon/pickaxe/mini/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000]));
	return f.dot;
});

// /obj/item/weapon/pickaxe/proc/playDigSound  (code/modules/mining/equipment/mining_tools.dm:29)
rt.def("/obj/item/weapon/pickaxe/proc/playDigSound", function playDigSound(f: Frame) {
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "digsound")]), 50, 1]);
	return f.dot;
});

rt.type(7533, "/obj/item/weapon/pickaxe/drill", "/obj/item/weapon/pickaxe", {
	digspeed: 25,
	digsound: null,
	name: "mining drill",
	icon_state: "handdrill",
	item_state: "jackhammer",
	slot_flags: 512,
	hitsound: rt.rsc("sound/weapons/drill.ogg"),
	origin_tech: "materials=2;powerstorage=2;engineering=3",
	desc: "An electric mining drill for the especially scrawny.",
});

// /obj/item/weapon/pickaxe/drill/proc/<init>  (code/modules/mining/equipment/mining_tools.dm:55)
rt.def("/obj/item/weapon/pickaxe/drill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "digsound", rt.list(rt.rsc("sound/weapons/drill.ogg")));
	return f.dot;
});

rt.type(7537, "/obj/item/weapon/pickaxe/drill/jackhammer", "/obj/item/weapon/pickaxe/drill", {
	digspeed: 5,
	digsound: null,
	name: "sonic jackhammer",
	icon_state: "jackhammer",
	item_state: "jackhammer",
	origin_tech: "materials=6;powerstorage=4;engineering=5;magnets=4",
	hitsound: rt.rsc("sound/weapons/sonic_jackhammer.ogg"),
	desc: "Cracks rocks with sonic blasts, and doubles as a demolition power tool for smashing walls.",
});

// /obj/item/weapon/pickaxe/drill/jackhammer/proc/<init>  (code/modules/mining/equipment/mining_tools.dm:83)
rt.def("/obj/item/weapon/pickaxe/drill/jackhammer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "digsound", rt.list(rt.rsc("sound/weapons/sonic_jackhammer.ogg")));
	return f.dot;
});

rt.type(7539, "/obj/item/weapon/shovel", "/obj/item/weapon", {
	digspeed: 20,
	flags: 64,
	name: "shovel",
	desc: "A large tool for digging and moving dirt.",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "shovel",
	slot_flags: 512,
	force: 8,
	throwforce: 4,
	item_state: "shovel",
	w_class: 3,
	materials: null,
	origin_tech: "materials=2;engineering=2",
	attack_verb: null,
	sharpness: 1,
});

// /obj/item/weapon/shovel/proc/<init>  (code/modules/mining/equipment/mining_tools.dm:99)
rt.def("/obj/item/weapon/shovel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50]));
	rt.setSv(f, "attack_verb", rt.list("bashed", "bludgeoned", "thrashed", "whacked"));
	return f.dot;
});
