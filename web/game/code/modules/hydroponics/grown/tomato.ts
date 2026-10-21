// From code/modules/hydroponics/grown/tomato.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10081, "/obj/item/seeds/tomato", "/obj/item/seeds", {
	species: "tomato",
	plantname: "Tomato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"),
	maturation: 8,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_grow: "tomato-grow",
	icon_dead: "tomato-dead",
	genes: null,
	reagents_add: null,
	name: "pack of tomato seeds",
	desc: "These seeds grow into tomato plants.",
	icon_state: "seed-tomato",
	mutatelist: null,
});

// /obj/item/seeds/tomato/proc/<init>  (code/modules/hydroponics/grown/tomato.dm:13)
rt.def("/obj/item/seeds/tomato/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/squash"), T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/tomato/blue"), T("/obj/item/seeds/tomato/blood"), T("/obj/item/seeds/tomato/killer")));
	return f.dot;
});

rt.type(10082, "/obj/item/seeds/tomato/blood", "/obj/item/seeds/tomato", {
	species: "bloodtomato",
	plantname: "Blood-Tomato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/blood"),
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of blood-tomato seeds",
	desc: "These seeds grow into blood-tomato plants.",
	icon_state: "seed-bloodtomato",
});

// /obj/item/seeds/tomato/blood/proc/<init>  (code/modules/hydroponics/grown/tomato.dm:34)
rt.def("/obj/item/seeds/tomato/blood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["blood", 0.20000000298023224, "vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	return f.dot;
});

rt.type(10083, "/obj/item/seeds/tomato/blue", "/obj/item/seeds/tomato", {
	species: "bluetomato",
	plantname: "Blue-Tomato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/blue"),
	yield: 2,
	icon_grow: "bluetomato-grow",
	genes: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of blue-tomato seeds",
	desc: "These seeds grow into blue-tomato plants.",
	icon_state: "seed-bluetomato",
	mutatelist: null,
});

// /obj/item/seeds/tomato/blue/proc/<init>  (code/modules/hydroponics/grown/tomato.dm:59)
rt.def("/obj/item/seeds/tomato/blue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/slip"), T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["lube", 0.20000000298023224, "vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/tomato/blue/bluespace")));
	return f.dot;
});

rt.type(10084, "/obj/item/seeds/tomato/blue/bluespace", "/obj/item/seeds/tomato/blue", {
	species: "bluespacetomato",
	plantname: "Bluespace Tomato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/blue/bluespace"),
	yield: 2,
	mutatelist: null,
	genes: null,
	reagents_add: null,
	rarity: 50,
	name: "pack of bluespace tomato seeds",
	desc: "These seeds grow into bluespace tomato plants.",
	icon_state: "seed-bluespacetomato",
});

// /obj/item/seeds/tomato/blue/bluespace/proc/<init>  (code/modules/hydroponics/grown/tomato.dm:81)
rt.def("/obj/item/seeds/tomato/blue/bluespace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	$0 = $0;
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/squash"), T("/datum/plant_gene/trait/slip"), T("/datum/plant_gene/trait/teleport"), T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["lube", 0.20000000298023224, "bluespace", 0.20000000298023224, "vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	return f.dot;
});

rt.type(10085, "/obj/item/seeds/tomato/killer", "/obj/item/seeds/tomato", {
	species: "killertomato",
	plantname: "Killer-Tomato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer"),
	yield: 2,
	genes: null,
	growthstages: 2,
	icon_grow: "killertomato-grow",
	icon_harvest: "killertomato-harvest",
	icon_dead: "killertomato-dead",
	mutatelist: null,
	rarity: 30,
	name: "pack of killer-tomato seeds",
	desc: "These seeds grow into killer-tomato plants.",
	icon_state: "seed-killertomato",
});

// /obj/item/seeds/tomato/killer/proc/<init>  (code/modules/hydroponics/grown/tomato.dm:103)
rt.def("/obj/item/seeds/tomato/killer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/squash")));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list());
	return f.dot;
});

rt.type(6348, "/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer", "/obj/item/weapon/reagent_containers/food/snacks/grown/tomato", {
	awakening: 0,
	filling_color: "#FF0000",
	seed: rt.typePath("/obj/item/seeds/tomato/killer"),
	name: "killer-tomato",
	desc: "I say to-mah-to, you say tom-mae-to... OH GOD IT'S EATING MY LEGS!!",
	icon_state: "killertomato",
	origin_tech: "biotech=4;combat=5",
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer/proc/attack  (code/modules/hydroponics/grown/tomato.dm:122)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer/proc/attack", function* attack(f: Frame) {
	if (truthy(rt.sv(f, "awakening"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The tomato is twitching and shaking, preventing you from eating it.</span>"]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "user", "def_zone"] });

// /obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer/proc/attack_self  (code/modules/hydroponics/grown/tomato.dm:127)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let K: Value = null;
	f.vars = () => [K];
	if ((truthy(rt.sv(f, "awakening")) || truthy((rt.istype(rt.fv(f, "loc", live(user)), T("/turf/open/space")) ? 1 : 0)))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin to awaken the Killer Tomato...</span>"]);
	rt.setSv(f, "awakening", 1);
	rt.spawnTail(f, 30, "/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer/proc/attack_self: spawn at modules/hydroponics/grown/tomato.dm:132", user, K);
	return f.dot;
});

// a spawn(30) body of /obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer/proc/attack_self: spawn at modules/hydroponics/grown/tomato.dm:132", function* (f: Frame, user: Value, K: Value) {
	f.vars = () => [user, K];
	if (!(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		rt.modField(f, (K = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/killertomato"), [rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0)]))), "maxHealth", (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "endurance", rt.sv(f, "seed")), 3)])), add);
		rt.modField(f, live(K), "melee_damage_lower", (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "potency", rt.sv(f, "seed")), 10)])), add);
		rt.modField(f, live(K), "melee_damage_upper", (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "potency", rt.sv(f, "seed")), 10)])), add);
		(rt.modField(f, live(K), "move_to_delay", (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "production", rt.sv(f, "seed")), 50)])), subtract));
		rt.setFv(f, "health", live(K), rt.fv(f, "maxHealth", live(K)));
		yield* g.callName(f, live(K), "visible_message", ["<span class='notice'>The Killer Tomato growls as it suddenly awakens.</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return null;
});
