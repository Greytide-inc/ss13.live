// Based on /tg/station's code/modules/food_and_drinks/food/snacks_pie.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6091, "/obj/item/weapon/reagent_containers/food/snacks/pie", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 3,
	tastes: null,
	icon: rt.rsc("icons/obj/food/piecake.dmi"),
	trash: rt.typePath("/obj/item/trash/plate"),
	w_class: 3,
	volume: 80,
	list_reagents: null,
});

// snacks_pie.dm:9
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["pie", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 10, "vitamin", 2]);
	return f.dot;
});

rt.type(6092, "/obj/item/weapon/reagent_containers/food/snacks/pie/plain", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	custom_food_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/customizable/pie"),
	bonus_reagents: null,
	tastes: null,
	name: "plain pie",
	desc: "A simple pie, still delicious.",
	icon_state: "pie",
});

// snacks_pie.dm:16
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/plain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 8, "vitamin", 1]);
	this.tastes = rt.alist(f, ["pie", 1]);
	return f.dot;
});

rt.type(6093, "/obj/item/weapon/reagent_containers/food/snacks/pie/cream", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	bonus_reagents: null,
	tastes: null,
	name: "banana cream pie",
	desc: "Just like back home, on clown planet! HONK!",
	icon_state: "pie",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// snacks_pie.dm:24
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/cream/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 2, "vitamin", 2]);
	this.tastes = rt.alist(f, ["pie", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 6, "banana", 5, "vitamin", 2]);
	return f.dot;
});

// snacks_pie.dm:29
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/cream/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	let _T: Value = null, H: Value = null, creamoverlay: Value = null;
	if (yield* parent_proc()) return f.dot;
	yield* new_(T("/obj/effect/decal/cleanable/pie_smudge"), (_T = rt.getStep(f, hit_atom, 0)));
	yield* this.reagents.reaction(hit_atom, TOUCH);
	if (rt.istype(hit_atom, T("/mob/living/carbon/human"))) {
		H = hit_atom;
		creamoverlay = mutable_appearance(rt.rsc("icons/effects/creampie.dmi"));
		if (H.dna.species.id == "lizard") {
			creamoverlay.icon_state = "creampie_lizard";
		} else {
			creamoverlay.icon_state = "creampie_human";
		}
		yield* H.Knockdown(20);
		yield* H.adjust_blurriness(1);
		this.visible_message(`<span class='userdanger'>${H} was creamed by ${this}!!</span>`);
		H.add_overlay(creamoverlay);
	}
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

rt.type(6094, "/obj/item/weapon/reagent_containers/food/snacks/pie/berryclafoutis", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	bonus_reagents: null,
	tastes: null,
	name: "berry clafoutis",
	desc: "No black birds, this is a good sign.",
	icon_state: "berryclafoutis",
	list_reagents: null,
});

// snacks_pie.dm:53
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/berryclafoutis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 2]);
	this.tastes = rt.alist(f, ["pie", 1, "blackberries", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 10, "berryjuice", 5, "vitamin", 2]);
	return f.dot;
});

rt.type(6095, "/obj/item/weapon/reagent_containers/food/snacks/pie/bearypie", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	bonus_reagents: null,
	tastes: null,
	name: "beary pie",
	desc: "No brown bears, this is a good sign.",
	icon_state: "bearypie",
	list_reagents: null,
});

// snacks_pie.dm:61
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/bearypie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 2, "vitamin", 3]);
	this.tastes = rt.alist(f, ["pie", 1, "meat", 1, "salmon", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 2, "vitamin", 3]);
	return f.dot;
});

rt.type(6096, "/obj/item/weapon/reagent_containers/food/snacks/pie/meatpie", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	bonus_reagents: null,
	tastes: null,
	name: "meat-pie",
	icon_state: "meatpie",
	desc: "An old barber recipe, very delicious!",
});

// snacks_pie.dm:69
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/meatpie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 5]);
	this.tastes = rt.alist(f, ["pie", 1, "meat", 1]);
	return f.dot;
});

rt.type(6097, "/obj/item/weapon/reagent_containers/food/snacks/pie/tofupie", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	bonus_reagents: null,
	tastes: null,
	name: "tofu-pie",
	icon_state: "meatpie",
	desc: "A delicious tofu pie.",
});

// snacks_pie.dm:77
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/tofupie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 2]);
	this.tastes = rt.alist(f, ["pie", 1, "tofu", 1]);
	return f.dot;
});

rt.type(6098, "/obj/item/weapon/reagent_containers/food/snacks/pie/amanita_pie", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	bitesize: 4,
	bonus_reagents: null,
	tastes: null,
	name: "amanita pie",
	desc: "Sweet and tasty poison pie.",
	icon_state: "amanita_pie",
	list_reagents: null,
});

// snacks_pie.dm:86
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/amanita_pie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 4]);
	this.tastes = rt.alist(f, ["pie", 1, "mushroom", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 6, "amatoxin", 3, "mushroomhallucinogen", 1, "vitamin", 4]);
	return f.dot;
});

rt.type(6099, "/obj/item/weapon/reagent_containers/food/snacks/pie/plump_pie", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	bonus_reagents: null,
	tastes: null,
	name: "plump pie",
	desc: "I bet you love stuff made out of plump helmets!",
	icon_state: "plump_pie",
});

// snacks_pie.dm:95
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/plump_pie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 4]);
	this.tastes = rt.alist(f, ["pie", 1, "mushroom", 1]);
	return f.dot;
});

// snacks_pie.dm:100
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/plump_pie/proc/New", function* New(f: Frame) {
	let fey: Value = null;
	if (fey = prob(10)) {
		this.name = "exceptional plump pie";
		this.desc = "Microwave is taken by a fey mood! It has cooked an exceptional plump pie!";
		this.bonus_reagents = rt.alist(f, ["nutriment", 1, "omnizine", 5, "vitamin", 4]);
	}
	yield* parent_proc();
	if (!fey) return f.dot;
	yield* this.reagents.add_reagent("omnizine", 5);
	return f.dot;
}, true);

rt.type(6100, "/obj/item/weapon/reagent_containers/food/snacks/pie/xemeatpie", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	bonus_reagents: null,
	tastes: null,
	name: "xeno-pie",
	icon_state: "xenomeatpie",
	desc: "A delicious meatpie. Probably heretical.",
	trash: rt.typePath("/obj/item/trash/plate"),
});

// snacks_pie.dm:115
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/xemeatpie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 5]);
	this.tastes = rt.alist(f, ["pie", 1, "meat", 1, "acid", 1]);
	return f.dot;
});

rt.type(6101, "/obj/item/weapon/reagent_containers/food/snacks/pie/applepie", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	bonus_reagents: null,
	tastes: null,
	name: "apple pie",
	desc: "A pie containing sweet sweet love...or apple.",
	icon_state: "applepie",
});

// snacks_pie.dm:123
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/applepie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 3]);
	this.tastes = rt.alist(f, ["pie", 1, "apple", 1]);
	return f.dot;
});

rt.type(6102, "/obj/item/weapon/reagent_containers/food/snacks/pie/cherrypie", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	bonus_reagents: null,
	tastes: null,
	name: "cherry pie",
	desc: "Taste so good, make a grown man cry.",
	icon_state: "cherrypie",
});

// snacks_pie.dm:132
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/cherrypie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 2]);
	this.tastes = rt.alist(f, ["pie", 7, "Nicole Paige Brooks", 2]);
	return f.dot;
});

rt.type(6103, "/obj/item/weapon/reagent_containers/food/snacks/pie/pumpkinpie", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	slices_num: 5,
	bonus_reagents: null,
	tastes: null,
	name: "pumpkin pie",
	desc: "A delicious treat for the autumn months.",
	icon_state: "pumpkinpie",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pumpkinpieslice"),
});

// snacks_pie.dm:142
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/pumpkinpie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 5]);
	this.tastes = rt.alist(f, ["pie", 1, "pumpkin", 1]);
	return f.dot;
});

rt.type(6109, "/obj/item/weapon/reagent_containers/food/snacks/pumpkinpieslice", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#FFA500",
	tastes: null,
	name: "pumpkin pie slice",
	desc: "A slice of pumpkin pie, with whipped cream on top. Perfection.",
	icon: rt.rsc("icons/obj/food/piecake.dmi"),
	icon_state: "pumpkinpieslice",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// snacks_pie.dm:153
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pumpkinpieslice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["pie", 1, "pumpkin", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 2]);
	return f.dot;
});

rt.type(6104, "/obj/item/weapon/reagent_containers/food/snacks/pie/appletart", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	bonus_reagents: null,
	tastes: null,
	name: "golden apple streusel tart",
	desc: "A tasty dessert that won't make it through a metal detector.",
	icon_state: "gappletart",
	list_reagents: null,
});

// snacks_pie.dm:159
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/appletart/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 4]);
	this.tastes = rt.alist(f, ["pie", 1, "apple", 1, "expensive metal", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 8, "gold", 5, "vitamin", 4]);
	return f.dot;
});

rt.type(6105, "/obj/item/weapon/reagent_containers/food/snacks/pie/grapetart", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	bonus_reagents: null,
	tastes: null,
	name: "grape tart",
	desc: "A tasty dessert that reminds you of the wine you didn't make.",
	icon_state: "grapetart",
	list_reagents: null,
});

// snacks_pie.dm:167
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/grapetart/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 4]);
	this.tastes = rt.alist(f, ["pie", 1, "grape", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 4, "vitamin", 4]);
	return f.dot;
});

rt.type(6106, "/obj/item/weapon/reagent_containers/food/snacks/pie/blumpkinpie", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	slices_num: 5,
	bonus_reagents: null,
	tastes: null,
	name: "blumpkin pie",
	desc: "An odd blue pie made with toxic blumpkin.",
	icon_state: "blumpkinpie",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/blumpkinpieslice"),
});

// snacks_pie.dm:177
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/blumpkinpie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 3, "vitamin", 6]);
	this.tastes = rt.alist(f, ["pie", 1, "a mouthful of pool water", 1]);
	return f.dot;
});

rt.type(6110, "/obj/item/weapon/reagent_containers/food/snacks/blumpkinpieslice", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#1E90FF",
	tastes: null,
	name: "blumpkin pie slice",
	desc: "A slice of blumpkin pie, with whipped cream on top. Is this edible?",
	icon: rt.rsc("icons/obj/food/piecake.dmi"),
	icon_state: "blumpkinpieslice",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// snacks_pie.dm:188
rt.def("/obj/item/weapon/reagent_containers/food/snacks/blumpkinpieslice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["pie", 1, "a mouthful of pool water", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 2]);
	return f.dot;
});

rt.type(6107, "/obj/item/weapon/reagent_containers/food/snacks/pie/dulcedebatata", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	slices_num: 5,
	bonus_reagents: null,
	tastes: null,
	name: "dulce de batata",
	desc: "A delicious jelly made with sweet potatoes.",
	icon_state: "dulcedebatata",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/dulcedebatataslice"),
});

// snacks_pie.dm:196
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/dulcedebatata/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 4, "vitamin", 8]);
	this.tastes = rt.alist(f, ["jelly", 1, "sweet potato", 1]);
	return f.dot;
});

rt.type(6111, "/obj/item/weapon/reagent_containers/food/snacks/dulcedebatataslice", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#8B4513",
	tastes: null,
	name: "dulce de batata slice",
	desc: "A slice of sweet dulce de batata jelly.",
	icon: rt.rsc("icons/obj/food/piecake.dmi"),
	icon_state: "dulcedebatataslice",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// snacks_pie.dm:207
rt.def("/obj/item/weapon/reagent_containers/food/snacks/dulcedebatataslice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["jelly", 1, "sweet potato", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 2]);
	return f.dot;
});

rt.type(6108, "/obj/item/weapon/reagent_containers/food/snacks/pie/frostypie", "/obj/item/weapon/reagent_containers/food/snacks/pie", {
	bonus_reagents: null,
	tastes: null,
	name: "frosty pie",
	desc: "Tastes like blue and cold.",
	icon_state: "frostypie",
});

// snacks_pie.dm:213
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pie/frostypie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 4, "vitamin", 6]);
	this.tastes = rt.alist(f, ["mint", 1, "pie", 1]);
	return f.dot;
});
