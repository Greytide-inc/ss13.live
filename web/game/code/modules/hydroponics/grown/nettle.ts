// From code/modules/hydroponics/grown/nettle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10061, "/obj/item/seeds/nettle", "/obj/item/seeds", {
	species: "nettle",
	plantname: "Nettles",
	product: rt.typePath("/obj/item/weapon/grown/nettle/basic"),
	lifespan: 30,
	endurance: 40,
	yield: 4,
	growthstages: 5,
	genes: null,
	reagents_add: null,
	name: "pack of nettle seeds",
	desc: "These seeds grow into nettles.",
	icon_state: "seed-nettle",
	mutatelist: null,
});

// /obj/item/seeds/nettle/proc/<init>  (code/modules/hydroponics/grown/nettle.dm:12)
rt.def("/obj/item/seeds/nettle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest"), T("/datum/plant_gene/trait/plant_type/weed_hardy")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["sacid", 0.5]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/nettle/death")));
	return f.dot;
});

rt.type(10062, "/obj/item/seeds/nettle/death", "/obj/item/seeds/nettle", {
	species: "deathnettle",
	plantname: "Death Nettles",
	product: rt.typePath("/obj/item/weapon/grown/nettle/death"),
	endurance: 25,
	maturation: 8,
	yield: 2,
	genes: null,
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of death-nettle seeds",
	desc: "These seeds grow into death-nettles.",
	icon_state: "seed-deathnettle",
});

// /obj/item/seeds/nettle/death/proc/<init>  (code/modules/hydroponics/grown/nettle.dm:26)
rt.def("/obj/item/seeds/nettle/death/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest"), T("/datum/plant_gene/trait/plant_type/weed_hardy"), T("/datum/plant_gene/trait/stinging")));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["facid", 0.5, "sacid", 0.5]));
	return f.dot;
});

rt.type(7501, "/obj/item/weapon/grown/nettle", "/obj/item/weapon/grown", {
	throw_speed: 1,
	throw_range: 3,
	name: "nettle",
	desc: "It's probably <B>not</B> wise to touch it with bare hands...",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "nettle",
	damtype: "fire",
	force: 15,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	throwforce: 5,
	w_class: 1,
	origin_tech: "combat=3",
	attack_verb: null,
});

// /obj/item/weapon/grown/nettle/proc/<init>  (code/modules/hydroponics/grown/nettle.dm:44)
rt.def("/obj/item/weapon/grown/nettle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("stung"));
	return f.dot;
});

// /obj/item/weapon/grown/nettle/proc/suicide_act  (code/modules/hydroponics/grown/nettle.dm:47)
rt.def("/obj/item/weapon/grown/nettle/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is eating some of ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	return 5;
});

// /obj/item/weapon/grown/nettle/proc/pickup  (code/modules/hydroponics/grown/nettle.dm:51)  may sleep
rt.def("/obj/item/weapon/grown/nettle/proc/pickup", function* pickup(f: Frame) {
	let C: Value = null, H: Value = null, hit_zone: Value = null, affecting: Value = null;
	let $0: any;
	f.vars = () => [C, H, hit_zone, affecting, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(rt.gv(f, "gloves", (C = live(f.args[0]))))) {
		return 0;
	}
	if (truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "dna", (H = live(C)))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H)))))) {
			if (truthy((rt.isIn(f, 15, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
				return 0;
			}
		}
	}
	if (isEqual((yield* g.callName(f, live(C), "held_index_to_dir", [rt.fv(f, "active_hand_index", live(C))])), "l")) {
		$0 = "l_";
	} else {
		$0 = "r_";
	}
	hit_zone = add($0, "arm");
	if (truthy((affecting = (yield* g.callName(f, live(C), "get_bodypart", [live(hit_zone)]))))) {
		if (truthy((yield* g.callName(f, live(affecting), "receive_damage", [0, rt.sv(f, "force")])))) {
			yield* g.callName(f, live(C), "update_damage_overlays", []);
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='userdanger'>The nettle burns your bare hand!</span>"]);
	return 1;
}, true, { args: ["user"] });

// /obj/item/weapon/grown/nettle/proc/afterattack  (code/modules/hydroponics/grown/nettle.dm:71)  may sleep
rt.def("/obj/item/weapon/grown/nettle/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	f.vars = () => [A, user, proximity];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "force"), 0)) {
		(rt.modSrcVar(f, "force", (yield* g.call(f, P("/proc/rand"), null, [1, add(divide(rt.sv(f, "force"), 3), 1)])), subtract));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "All the leaves have fallen off the nettle from violent whacking."]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

rt.type(7502, "/obj/item/weapon/grown/nettle/basic", "/obj/item/weapon/grown/nettle", {
	seed: rt.typePath("/obj/item/seeds/nettle"),
});

// /obj/item/weapon/grown/nettle/basic/proc/add_juice  (code/modules/hydroponics/grown/nettle.dm:82)
rt.def("/obj/item/weapon/grown/nettle/basic/proc/add_juice", function add_juice(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "force", rt.call(f, P("/proc/round"), null, [add(5, divide(rt.fv(f, "potency", rt.sv(f, "seed")), 5)), 1]));
	return f.dot;
});

rt.type(7503, "/obj/item/weapon/grown/nettle/death", "/obj/item/weapon/grown/nettle", {
	seed: rt.typePath("/obj/item/seeds/nettle/death"),
	name: "deathnettle",
	desc: "The <span class='danger'>glowing</span> nettle incites <span class='boldannounce'>rage</span> in you just from looking at it!",
	icon_state: "deathnettle",
	force: 30,
	throwforce: 15,
	origin_tech: "combat=5",
});

// /obj/item/weapon/grown/nettle/death/proc/add_juice  (code/modules/hydroponics/grown/nettle.dm:95)
rt.def("/obj/item/weapon/grown/nettle/death/proc/add_juice", function add_juice(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "force", rt.call(f, P("/proc/round"), null, [add(5, divide(rt.fv(f, "potency", rt.sv(f, "seed")), 2.5)), 1]));
	return f.dot;
});

// /obj/item/weapon/grown/nettle/death/proc/pickup  (code/modules/hydroponics/grown/nettle.dm:99)  may sleep
rt.def("/obj/item/weapon/grown/nettle/death/proc/pickup", function* pickup(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "Knockdown", [100]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>You are stunned by the Deathnettle as you try picking it up!</span>"]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/grown/nettle/death/proc/attack  (code/modules/hydroponics/grown/nettle.dm:105)  may sleep
rt.def("/obj/item/weapon/grown/nettle/death/proc/attack", function* attack(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>You are stunned by the powerful acid of the Deathnettle!</span>"]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), "attacked", live(f.src)]);
	yield* g.callName(f, live(f.args[0]), "adjust_blurriness", [divide(rt.sv(f, "force"), 7)]);
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.callName(f, live(f.args[0]), "Unconscious", [divide(rt.sv(f, "force"), 0.30000001192092896)]);
		yield* g.callName(f, live(f.args[0]), "Knockdown", [divide(rt.sv(f, "force"), 0.75)]);
	}
	yield* g.callName(f, live(f.args[0]), "drop_item", []);
	return f.dot;
}, true, { args: ["M", "user"] });
