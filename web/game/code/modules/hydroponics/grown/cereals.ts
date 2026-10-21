// From code/modules/hydroponics/grown/cereals.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10012, "/obj/item/seeds/wheat", "/obj/item/seeds", {
	species: "wheat",
	plantname: "Wheat Stalks",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/wheat"),
	production: 1,
	yield: 4,
	potency: 15,
	icon_dead: "wheat-dead",
	reagents_add: null,
	name: "pack of wheat seeds",
	desc: "These may, or may not, grow into wheat.",
	icon_state: "seed-wheat",
	mutatelist: null,
});

// /obj/item/seeds/wheat/proc/<init>  (code/modules/hydroponics/grown/cereals.dm:14)
rt.def("/obj/item/seeds/wheat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_add", rt.alist(f, ["nutriment", 0.03999999910593033]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/wheat/oat"), T("/obj/item/seeds/wheat/meat")));
	return f.dot;
});

rt.type(10013, "/obj/item/seeds/wheat/oat", "/obj/item/seeds/wheat", {
	species: "oat",
	plantname: "Oat Stalks",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/oat"),
	mutatelist: null,
	name: "pack of oat seeds",
	desc: "These may, or may not, grow into oat.",
	icon_state: "seed-oat",
});

// /obj/item/seeds/wheat/oat/proc/<init>  (code/modules/hydroponics/grown/cereals.dm:33)
rt.def("/obj/item/seeds/wheat/oat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	return f.dot;
});

rt.type(10014, "/obj/item/seeds/wheat/rice", "/obj/item/seeds/wheat", {
	species: "rice",
	plantname: "Rice Stalks",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/rice"),
	mutatelist: null,
	growthstages: 3,
	name: "pack of rice seeds",
	desc: "These may, or may not, grow into rice.",
	icon_state: "seed-rice",
});

// /obj/item/seeds/wheat/rice/proc/<init>  (code/modules/hydroponics/grown/cereals.dm:52)
rt.def("/obj/item/seeds/wheat/rice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	return f.dot;
});

rt.type(10015, "/obj/item/seeds/wheat/meat", "/obj/item/seeds/wheat", {
	species: "meatwheat",
	plantname: "Meatwheat",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/meatwheat"),
	mutatelist: null,
	name: "pack of meatwheat seeds",
	desc: "If you ever wanted to drive a vegetarian to insanity, here's how.",
	icon_state: "seed-meatwheat",
});

// /obj/item/seeds/wheat/meat/proc/<init>  (code/modules/hydroponics/grown/cereals.dm:72)
rt.def("/obj/item/seeds/wheat/meat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	return f.dot;
});

rt.type(6289, "/obj/item/weapon/reagent_containers/food/snacks/grown/meatwheat", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#960000",
	bitesize_mod: 2,
	name: "meatwheat",
	desc: "Some blood-drenched wheat stalks. You can crush them into what passes for meat if you squint hard enough.",
	icon_state: "meatwheat",
	gender: "plural",
	seed: rt.typePath("/obj/item/seeds/wheat/meat"),
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/meatwheat/proc/attack_self  (code/modules/hydroponics/grown/cereals.dm:84)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/meatwheat/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let M: Value = null;
	f.vars = () => [user, M];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ crushes ＀ into meat.</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You crush ＀ into something that resembles meat.</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/effects/blobattack.ogg"), 50, 1]);
	M = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/meatwheat"), [rt.getStep(f, live(user), 0)]));
	yield* g.callName(f, live(user), "drop_item", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.callName(f, live(user), "put_in_hands", [live(M)]);
	return 1;
}, true);
