// Based on /tg/station's code/modules/food_and_drinks/food/snacks_egg.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5971, "/obj/item/weapon/reagent_containers/food/snacks/chocolateegg", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#A0522D",
	tastes: null,
	name: "chocolate egg",
	desc: "Such, sweet, fattening food.",
	icon_state: "chocolateegg",
	list_reagents: null,
});

// snacks_egg.dm:8
rt.def("/obj/item/weapon/reagent_containers/food/snacks/chocolateegg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 1]);
	this.tastes = rt.alist(f, ["chocolate", 4, "sweetness", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 4, "sugar", 2, "cocoa", 2]);
	return f.dot;
});

rt.type(5972, "/obj/item/weapon/reagent_containers/food/snacks/egg", "/obj/item/weapon/reagent_containers/food/snacks", {
	containsPrize: 0,
	amount_grown: 0,
	filling_color: "#F0E68C",
	tastes: null,
	name: "egg",
	desc: "An egg!",
	icon_state: "egg",
	list_reagents: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"),
});

// snacks_egg.dm:20
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["egg", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 1]);
	return f.dot;
});

// snacks_egg.dm:23
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	let _T: Value = null;
	if (yield* parent_proc()) return f.dot;
	yield* new_(T("/obj/effect/decal/cleanable/egg_smudge"), (_T = rt.getStep(f, hit_atom, 0)));
	yield* this.reagents.reaction(hit_atom, TOUCH);
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// snacks_egg.dm:30
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let C: Value = null, clr: Value = null;
	if (rt.istype(W, T("/obj/item/toy/crayon"))) {
		C = W;
		if (!rt.isIn(f, (clr = C.item_color), list("blue", "green", "mime", "orange", "purple", "rainbow", "red", "yellow"))) {
			to_chat(f.usr, `<span class='notice'>${this} refuses to take on this colour!</span>`);
			return f.dot;
		}
		to_chat(f.usr, `<span class='notice'>You colour ${this} ${clr}.</span>`);
		this.icon_state = `egg-${clr}`;
		this.item_color = clr;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(5973, "/obj/item/weapon/reagent_containers/food/snacks/egg/blue", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-blue",
	item_color: "blue",
});

// snacks_egg.dm:47
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/blue/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["egg", 4, "the back of class", 1]);
	return f.dot;
});

rt.type(5974, "/obj/item/weapon/reagent_containers/food/snacks/egg/green", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-green",
	item_color: "green",
});

// snacks_egg.dm:52
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/green/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["egg", 4, "the back of class", 1]);
	return f.dot;
});

rt.type(5975, "/obj/item/weapon/reagent_containers/food/snacks/egg/mime", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-mime",
	item_color: "mime",
});

// snacks_egg.dm:57
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/mime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["egg", 4, "the back of class", 1]);
	return f.dot;
});

rt.type(5976, "/obj/item/weapon/reagent_containers/food/snacks/egg/orange", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-orange",
	item_color: "orange",
});

// snacks_egg.dm:62
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/orange/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["egg", 4, "the back of class", 1]);
	return f.dot;
});

rt.type(5977, "/obj/item/weapon/reagent_containers/food/snacks/egg/purple", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-purple",
	item_color: "purple",
});

// snacks_egg.dm:67
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/purple/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["egg", 4, "the back of class", 1]);
	return f.dot;
});

rt.type(5978, "/obj/item/weapon/reagent_containers/food/snacks/egg/rainbow", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-rainbow",
	item_color: "rainbow",
});

// snacks_egg.dm:72
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/rainbow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["egg", 4, "the back of class", 1]);
	return f.dot;
});

rt.type(5979, "/obj/item/weapon/reagent_containers/food/snacks/egg/red", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-red",
	item_color: "red",
});

// snacks_egg.dm:77
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/red/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["egg", 4, "the back of class", 1]);
	return f.dot;
});

rt.type(5980, "/obj/item/weapon/reagent_containers/food/snacks/egg/yellow", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	tastes: null,
	icon_state: "egg-yellow",
	item_color: "yellow",
});

// snacks_egg.dm:82
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/yellow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["egg", 4, "the back of class", 1]);
	return f.dot;
});

rt.type(5982, "/obj/item/weapon/reagent_containers/food/snacks/friedegg", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	bitesize: 1,
	filling_color: "#FFFFF0",
	tastes: null,
	name: "fried egg",
	desc: "A fried egg, with a touch of salt and pepper.",
	icon_state: "friedegg",
	list_reagents: null,
});

// snacks_egg.dm:88
rt.def("/obj/item/weapon/reagent_containers/food/snacks/friedegg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 1]);
	this.tastes = rt.alist(f, ["egg", 4, "salt", 1, "pepper", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 3]);
	return f.dot;
});

rt.type(5983, "/obj/item/weapon/reagent_containers/food/snacks/boiledegg", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FFFFF0",
	tastes: null,
	name: "boiled egg",
	desc: "A hard boiled egg.",
	icon_state: "egg",
	list_reagents: null,
});

// snacks_egg.dm:98
rt.def("/obj/item/weapon/reagent_containers/food/snacks/boiledegg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 1]);
	this.tastes = rt.alist(f, ["egg", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 2, "vitamin", 1]);
	return f.dot;
});

rt.type(5984, "/obj/item/weapon/reagent_containers/food/snacks/omelette", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	bitesize: 1,
	tastes: null,
	name: "omelette du fromage",
	desc: "That's all you can say!",
	icon_state: "omelette",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
	w_class: 3,
});

// snacks_egg.dm:108
rt.def("/obj/item/weapon/reagent_containers/food/snacks/omelette/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 2]);
	this.tastes = rt.alist(f, ["egg", 1, "cheese", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 8, "vitamin", 1]);
	return f.dot;
});

// snacks_egg.dm:115
rt.def("/obj/item/weapon/reagent_containers/food/snacks/omelette/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let F: Value = null, R: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/kitchen/fork"))) {
		if ((F = W).forkload) {
			to_chat(user, "<span class='warning'>You already have omelette on your fork!</span>");
		} else {
			F.icon_state = "forkloaded";
			user.visible_message(`${user} takes a piece of omelette with their fork!`, "<span class='notice'>You take a piece of omelette with your fork.</span>");
			R = pick(this.reagents.reagent_list);
			yield* this.reagents.remove_reagent(R.id, 1);
			F.forkload = R;
			if (this.reagents.total_volume <= 0) {
				yield* qdel(this);
			}
		}
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(5985, "/obj/item/weapon/reagent_containers/food/snacks/benedict", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "eggs benedict",
	desc: "There is only one egg on this, how rude.",
	icon_state: "benedict",
	trash: rt.typePath("/obj/item/trash/plate"),
	w_class: 3,
	list_reagents: null,
});

// snacks_egg.dm:136
rt.def("/obj/item/weapon/reagent_containers/food/snacks/benedict/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["vitamin", 4]);
	this.tastes = rt.alist(f, ["egg", 1, "bacon", 1, "bun", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 6, "vitamin", 4]);
	return f.dot;
});
