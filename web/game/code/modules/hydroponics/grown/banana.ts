// From code/modules/hydroponics/grown/banana.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9993, "/obj/item/seeds/banana", "/obj/item/seeds", {
	species: "banana",
	plantname: "Banana Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"),
	lifespan: 50,
	endurance: 30,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_dead: "banana-dead",
	genes: null,
	reagents_add: null,
	name: "pack of banana seeds",
	desc: "They're seeds that grow into banana trees. When grown, keep away from clown.",
	icon_state: "seed-banana",
	mutatelist: null,
});

// /obj/item/seeds/banana/proc/<init>  (code/modules/hydroponics/grown/banana.dm:13)
rt.def("/obj/item/seeds/banana/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/slip"), T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["banana", 0.10000000149011612, "potassium", 0.10000000149011612, "vitamin", 0.03999999910593033, "nutriment", 0.019999999552965164]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/banana/mime"), T("/obj/item/seeds/banana/bluespace")));
	return f.dot;
});

rt.type(6268, "/obj/item/weapon/reagent_containers/food/snacks/grown/banana", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FFFF00",
	bitesize: 5,
	seed: rt.typePath("/obj/item/seeds/banana"),
	name: "banana",
	desc: "It's an excellent prop for a clown.",
	icon_state: "banana",
	item_state: "banana",
	trash: rt.typePath("/obj/item/weapon/grown/bananapeel"),
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/banana/proc/suicide_act  (code/modules/hydroponics/grown/banana.dm:28)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/banana/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is aiming ＀ at ＀self! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_them", [])), (yield* g.callName(f, live(user), "p_theyre", []))])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/bikehorn.ogg"), 50, 1, -1]);
	yield* g.call(f, P("/proc/sleep"), null, [25]);
	if (!truthy(live(user))) {
		return 8;
	}
	yield* g.callName(f, live(user), "say", ["BANG!"]);
	yield* g.call(f, P("/proc/sleep"), null, [25]);
	if (!truthy(live(user))) {
		return 8;
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<B>＀</B> laughs so hard they begin to suffocate!", [live(user)])]);
	return 8;
}, true);

rt.type(7493, "/obj/item/weapon/grown/bananapeel", "/obj/item/weapon/grown", {
	throw_speed: 3,
	throw_range: 7,
	seed: rt.typePath("/obj/item/seeds/banana"),
	name: "banana peel",
	desc: "A peel from a banana.",
	icon_state: "banana_peel",
	item_state: "banana_peel",
	w_class: 1,
	throwforce: 0,
});

// /obj/item/weapon/grown/bananapeel/proc/suicide_act  (code/modules/hydroponics/grown/banana.dm:52)
rt.def("/obj/item/weapon/grown/bananapeel/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is deliberately slipping on ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/misc/slip.ogg"), 50, 1, -1]);
	return 1;
});

rt.type(9994, "/obj/item/seeds/banana/mime", "/obj/item/seeds/banana", {
	species: "mimana",
	plantname: "Mimana Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/banana/mime"),
	growthstages: 4,
	mutatelist: null,
	reagents_add: null,
	rarity: 15,
	name: "pack of mimana seeds",
	desc: "They're seeds that grow into mimana trees. When grown, keep away from mime.",
	icon_state: "seed-mimana",
});

// /obj/item/seeds/banana/mime/proc/<init>  (code/modules/hydroponics/grown/banana.dm:66)
rt.def("/obj/item/seeds/banana/mime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["nothing", 0.10000000149011612, "mutetoxin", 0.10000000149011612, "nutriment", 0.019999999552965164]));
	return f.dot;
});

rt.type(9995, "/obj/item/seeds/banana/bluespace", "/obj/item/seeds/banana", {
	species: "bluespacebanana",
	icon_grow: "banana-grow",
	plantname: "Bluespace Banana Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/banana/bluespace"),
	mutatelist: null,
	genes: null,
	reagents_add: null,
	rarity: 30,
	name: "pack of bluespace banana seeds",
	desc: "They're seeds that grow into bluespace banana trees. When grown, keep away from bluespace clown.",
	icon_state: "seed-banana-blue",
});

// /obj/item/seeds/banana/bluespace/proc/<init>  (code/modules/hydroponics/grown/banana.dm:93)
rt.def("/obj/item/seeds/banana/bluespace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	$0 = $0;
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/slip"), T("/datum/plant_gene/trait/teleport"), T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["bluespace", 0.20000000298023224, "banana", 0.10000000149011612, "vitamin", 0.03999999910593033, "nutriment", 0.019999999552965164]));
	return f.dot;
});

rt.type(7496, "/obj/item/weapon/grown/bananapeel/specialpeel", "/obj/item/weapon/grown/bananapeel", {
	name: "synthesized banana peel",
	desc: "A synthetic banana peel.",
});

// /obj/item/weapon/grown/bananapeel/specialpeel/proc/Crossed  (code/modules/hydroponics/grown/banana.dm:118)  may sleep
rt.def("/obj/item/weapon/grown/bananapeel/specialpeel/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let carbon: Value = null;
	f.vars = () => [AM, carbon];
	if (!truthy((rt.istype(live(AM), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	if (!truthy((yield* g.callName(f, (carbon = live(AM)), "slip", [40, live(f.src), 0])))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
