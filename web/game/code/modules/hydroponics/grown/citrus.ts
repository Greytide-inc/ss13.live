// From code/modules/hydroponics/grown/citrus.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10019, "/obj/item/seeds/lime", "/obj/item/seeds", {
	species: "lime",
	plantname: "Lime Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/lime"),
	lifespan: 55,
	endurance: 50,
	yield: 4,
	potency: 15,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	genes: null,
	reagents_add: null,
	name: "pack of lime seeds",
	desc: "These are very sour seeds.",
	icon_state: "seed-lime",
	mutatelist: null,
});

// /obj/item/seeds/lime/proc/<init>  (code/modules/hydroponics/grown/citrus.dm:22)
rt.def("/obj/item/seeds/lime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.05000000074505806]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/orange")));
	return f.dot;
});

rt.type(10020, "/obj/item/seeds/orange", "/obj/item/seeds", {
	species: "orange",
	plantname: "Orange Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/orange"),
	lifespan: 60,
	endurance: 50,
	yield: 5,
	potency: 20,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_grow: "lime-grow",
	icon_dead: "lime-dead",
	genes: null,
	mutatelist: null,
	reagents_add: null,
	name: "pack of orange seeds",
	desc: "Sour seeds.",
	icon_state: "seed-orange",
});

// /obj/item/seeds/orange/proc/<init>  (code/modules/hydroponics/grown/citrus.dm:48)
rt.def("/obj/item/seeds/orange/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/lime")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.05000000074505806]));
	return f.dot;
});

rt.type(10021, "/obj/item/seeds/lemon", "/obj/item/seeds", {
	species: "lemon",
	plantname: "Lemon Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/lemon"),
	lifespan: 55,
	endurance: 45,
	yield: 4,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_grow: "lime-grow",
	icon_dead: "lime-dead",
	genes: null,
	reagents_add: null,
	name: "pack of lemon seeds",
	desc: "These are sour seeds.",
	icon_state: "seed-lemon",
	mutatelist: null,
});

// /obj/item/seeds/lemon/proc/<init>  (code/modules/hydroponics/grown/citrus.dm:73)
rt.def("/obj/item/seeds/lemon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.05000000074505806]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/firelemon")));
	return f.dot;
});

rt.type(10022, "/obj/item/seeds/firelemon", "/obj/item/seeds", {
	species: "firelemon",
	plantname: "Combustible Lemon Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon"),
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_grow: "lime-grow",
	icon_dead: "lime-dead",
	genes: null,
	lifespan: 55,
	endurance: 45,
	yield: 4,
	reagents_add: null,
	name: "pack of combustible lemon seeds",
	desc: "When life gives you lemons, don't make lemonade. Make life take the lemons back! Get mad! I don't want your damn lemons!",
	icon_state: "seed-firelemon",
});

// /obj/item/seeds/firelemon/proc/<init>  (code/modules/hydroponics/grown/citrus.dm:95)
rt.def("/obj/item/seeds/firelemon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["nutriment", 0.05000000074505806]));
	return f.dot;
});

rt.type(6297, "/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/firelemon"),
	name: "Combustible Lemon",
	desc: "Made for burning houses down.",
	icon_state: "firelemon",
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/attack_self  (code/modules/hydroponics/grown/citrus.dm:109)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let A: Value = null, message: Value = null, C: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, A, message, C, $0, $1, $2];
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(user)]));
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ primes the ＀!</span>", [live(user), live(f.src)]), fmt("<span class='userdanger'>You prime the ＀!</span>", [live(f.src)])]);
	$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
	$1 = live(A);
	if (truthy(live(user))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))])]);
	} else {
		$2 = "nonexistent location";
	}
	rt.modGl("bombers", (message = fmt("＀ primed a combustible lemon for detonation at ＀ ＀", [$0, $1, fmt("＀", [$2])])), add);
	yield* g.call(f, P("/proc/message_admins"), null, [live(message)]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ primed a combustible lemon for detonation at ＀ ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(A), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))])])]);
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (C = live(user)), "throw_mode_on", []);
	}
	rt.setSv(f, "icon_state", "firelemon_active");
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/armbomb.ogg"), 75, 1, -3]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/prime")])), (yield* g.call(f, P("/proc/rand"), null, [10, 60]))]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/burn  (code/modules/hydroponics/grown/citrus.dm:123)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/burn", function* burn(f: Frame) {
	yield* g.srcCall(f, "prime");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/update_mob  (code/modules/hydroponics/grown/citrus.dm:127)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/update_mob", function* update_mob(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.callName(f, (M = rt.sv(f, "loc")), "dropItemToGround", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/ex_act  (code/modules/hydroponics/grown/citrus.dm:132)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/prime  (code/modules/hydroponics/grown/citrus.dm:135)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/prime", function* prime(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.fv(f, "potency", rt.sv(f, "seed"));
	if (rt.inRange($0, 0, 30)) {
		yield* g.srcCall(f, "update_mob");
		yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, -1, null, -1, null, 2, "flame_range", 1], rt.Args.Named);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else if (rt.inRange($0, 31, 50)) {
		yield* g.srcCall(f, "update_mob");
		yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, -1, null, -1, null, 2, "flame_range", 2], rt.Args.Named);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else if (rt.inRange($0, 51, 70)) {
		yield* g.srcCall(f, "update_mob");
		yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, -1, null, -1, null, 2, "flame_range", 3], rt.Args.Named);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else if (rt.inRange($0, 71, 90)) {
		yield* g.srcCall(f, "update_mob");
		yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, -1, null, -1, null, 2, "flame_range", 4], rt.Args.Named);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.srcCall(f, "update_mob");
		yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, -1, null, -1, null, 2, "flame_range", 5], rt.Args.Named);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);
