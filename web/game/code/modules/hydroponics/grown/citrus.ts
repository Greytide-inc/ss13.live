// Based on /tg/station's code/modules/hydroponics/grown/citrus.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


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

// citrus.dm:22
rt.def("/obj/item/seeds/lime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["vitamin", 0.04, "nutriment", 0.05]);

	this.mutatelist = list(T("/obj/item/seeds/orange"));
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

// citrus.dm:48
rt.def("/obj/item/seeds/orange/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));

	this.mutatelist = list(T("/obj/item/seeds/lime"));
	this.reagents_add = rt.alist(f, ["vitamin", 0.04, "nutriment", 0.05]);
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

// citrus.dm:73
rt.def("/obj/item/seeds/lemon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["vitamin", 0.04, "nutriment", 0.05]);

	this.mutatelist = list(T("/obj/item/seeds/firelemon"));
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

// citrus.dm:95
rt.def("/obj/item/seeds/firelemon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["nutriment", 0.05]);
	return f.dot;
});

rt.type(6297, "/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/firelemon"),
	name: "Combustible Lemon",
	desc: "Made for burning houses down.",
	icon_state: "firelemon",
});

// citrus.dm:109
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let message: Value = null, C: Value = null;
	let $2: any;
	let A: Value = get_area(user);
	user.visible_message(`<span class='warning'>${user} primes the ${this}!</span>`, `<span class='userdanger'>You prime the ${this}!</span>`);
	let $0: any = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
	let $1: any = A;
	if (user) {
		$2 = `${`(${user.x},${user.y},${user.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${user.x};Y=${user.y};Z=${user.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	GLOB.bombers += (message = `${$0} primed a combustible lemon for detonation at ${$1} ${`${$2}`}`);
	message_admins(message);
	log_game(`${key_name(user)} primed a combustible lemon for detonation at ${A} ${`(${user.x},${user.y},${user.z})`}.`);
	if (rt.istype(user, T("/mob/living/carbon"))) {
		(C = user).throw_mode_on();
	}
	this.icon_state = "firelemon_active";
	playsound(this.loc, rt.rsc("sound/weapons/armbomb.ogg"), 75, 1, -3);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/prime"))), rand(10, 60));
	return f.dot;
}, true);

// citrus.dm:123
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/burn", function* burn(f: Frame) {
	yield* this.prime();
	yield* parent_proc();
	return f.dot;
}, true);

// citrus.dm:127
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/update_mob", function* update_mob(f: Frame) {
	let M: Value = null;
	if (!ismob(this.loc)) return f.dot;
	yield* (M = this.loc).dropItemToGround(this);
	return f.dot;
}, true);

// citrus.dm:132
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// citrus.dm:135
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/firelemon/proc/prime", function* prime(f: Frame) {
	if (rt.inRange(this.seed.potency, 0, 30)) {
		yield* this.update_mob();
		yield* explosion(this.loc, -1, -1, 2, { flame_range: 1 });
		yield* qdel(this);
	} else if (rt.inRange(this.seed.potency, 31, 50)) {
		yield* this.update_mob();
		yield* explosion(this.loc, -1, -1, 2, { flame_range: 2 });
		yield* qdel(this);
	} else if (rt.inRange(this.seed.potency, 51, 70)) {
		yield* this.update_mob();
		yield* explosion(this.loc, -1, -1, 2, { flame_range: 3 });
		yield* qdel(this);
	} else if (rt.inRange(this.seed.potency, 71, 90)) {
		yield* this.update_mob();
		yield* explosion(this.loc, -1, -1, 2, { flame_range: 4 });
		yield* qdel(this);
	} else {
		yield* this.update_mob();
		yield* explosion(this.loc, -1, -1, 2, { flame_range: 5 });
		yield* qdel(this);
	}
	return f.dot;
}, true);
