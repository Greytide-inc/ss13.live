// Based on /tg/station's code/modules/reagents/reagent_containers/bottle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(6393, "/obj/item/weapon/reagent_containers/glass/bottle", "/obj/item/weapon/reagent_containers/glass", {
	name: "bottle",
	desc: "A small bottle.",
	icon_state: "bottle",
	item_state: "atoxinbottle",
	possible_transfer_amounts: null,
	volume: 30,
	full_icon_state: null,
});

// bottle.dm:13
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.icon_state) {
		this.icon_state = "bottle";
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// bottle.dm:19
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	this.update_icon();
	return f.dot;
});

// bottle.dm:22
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/proc/update_icon", function update_icon(f: Frame) {
	let percent: Value = null;
	this.cut_overlays();
	// Coloured culture/virus bottles (bottle16, bottle12...) keep their own sprite in full_icon_state;
	// when empty they show the plain "bottle" sprite, and the filling overlays use the own sprite's name.
	if (!this.full_icon_state) this.full_icon_state = this.icon_state;
	const own = String(this.full_icon_state);
	const coloured = /^bottle\d+$/.test(own);
	if (!this.reagents.total_volume) {
		if (coloured) this.icon_state = "bottle";
		return f.dot;
	}
	this.icon_state = own;
	let filling: Value = mutable_appearance(rt.rsc("icons/obj/reagentfillings.dmi"), `${this.icon_state}-10`);
	const subject = (percent = round(this.reagents.total_volume / this.volume * 100));
	if (rt.inRange(subject, 0, 9)) {
		filling.icon_state = `${this.icon_state}-10`;
	} else if (rt.inRange(subject, 10, 29)) {
		filling.icon_state = `${this.icon_state}25`;
	} else if (rt.inRange(subject, 30, 49)) {
		filling.icon_state = `${this.icon_state}50`;
	} else if (rt.inRange(subject, 50, 69)) {
		filling.icon_state = `${this.icon_state}75`;
	} else if (rt.inRange(subject, 70, 1e+31)) {
		filling.icon_state = `${this.icon_state}100`;
	}
	filling.color = mix_color_from_reagents(this.reagents.reagent_list);
	this.add_overlay(filling);
	return f.dot;
});

rt.type(6404, "/obj/item/weapon/reagent_containers/glass/bottle/epinephrine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "epinephrine bottle",
	desc: "A small bottle. Contains epinephrine - used to stabilize patients.",
	icon_state: "bottle16",
	list_reagents: null,
});

// bottle.dm:47
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/epinephrine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["epinephrine", 30]);
	return f.dot;
});

rt.type(6405, "/obj/item/weapon/reagent_containers/glass/bottle/toxin", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "toxin bottle",
	desc: "A small bottle of toxins. Do not drink, it is poisonous.",
	icon_state: "bottle12",
	list_reagents: null,
});

// bottle.dm:53
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/toxin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["toxin", 30]);
	return f.dot;
});

rt.type(6406, "/obj/item/weapon/reagent_containers/glass/bottle/cyanide", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "cyanide bottle",
	desc: "A small bottle of cyanide. Bitter almonds?",
	icon_state: "bottle12",
	list_reagents: null,
});

// bottle.dm:59
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/cyanide/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["cyanide", 30]);
	return f.dot;
});

rt.type(6407, "/obj/item/weapon/reagent_containers/glass/bottle/spewium", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "spewium bottle",
	desc: "A small bottle of spewium.",
	icon_state: "bottle12",
	list_reagents: null,
});

// bottle.dm:65
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/spewium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["spewium", 30]);
	return f.dot;
});

rt.type(6408, "/obj/item/weapon/reagent_containers/glass/bottle/morphine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "morphine bottle",
	desc: "A small bottle of morphine.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle20",
	list_reagents: null,
});

// bottle.dm:72
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/morphine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["morphine", 30]);
	return f.dot;
});

rt.type(6409, "/obj/item/weapon/reagent_containers/glass/bottle/chloralhydrate", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Chloral Hydrate Bottle",
	desc: "A small bottle of Choral Hydrate. Mickey's Favorite!",
	icon_state: "bottle20",
	list_reagents: null,
});

// bottle.dm:78
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/chloralhydrate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["chloralhydrate", 15]);
	return f.dot;
});

rt.type(6410, "/obj/item/weapon/reagent_containers/glass/bottle/charcoal", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "antitoxin bottle",
	desc: "A small bottle of charcoal.",
	icon_state: "bottle17",
	list_reagents: null,
});

// bottle.dm:84
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/charcoal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["charcoal", 30]);
	return f.dot;
});

rt.type(6411, "/obj/item/weapon/reagent_containers/glass/bottle/mutagen", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "unstable mutagen bottle",
	desc: "A small bottle of unstable mutagen. Randomly changes the DNA structure of whoever comes in contact.",
	icon_state: "bottle20",
	list_reagents: null,
});

// bottle.dm:90
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/mutagen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["mutagen", 30]);
	return f.dot;
});

rt.type(6412, "/obj/item/weapon/reagent_containers/glass/bottle/plasma", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "liquid plasma bottle",
	desc: "A small bottle of liquid plasma. Extremely toxic and reacts with micro-organisms inside blood.",
	icon_state: "bottle8",
	list_reagents: null,
});

// bottle.dm:96
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/plasma/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["plasma", 30]);
	return f.dot;
});

rt.type(6413, "/obj/item/weapon/reagent_containers/glass/bottle/synaptizine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "synaptizine bottle",
	desc: "A small bottle of synaptizine.",
	icon_state: "bottle20",
	list_reagents: null,
});

// bottle.dm:102
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/synaptizine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["synaptizine", 30]);
	return f.dot;
});

rt.type(6414, "/obj/item/weapon/reagent_containers/glass/bottle/ammonia", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "ammonia bottle",
	desc: "A small bottle of ammonia.",
	icon_state: "bottle20",
	list_reagents: null,
});

// bottle.dm:108
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/ammonia/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["ammonia", 30]);
	return f.dot;
});

rt.type(6415, "/obj/item/weapon/reagent_containers/glass/bottle/diethylamine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "diethylamine bottle",
	desc: "A small bottle of diethylamine.",
	icon_state: "bottle17",
	list_reagents: null,
});

// bottle.dm:114
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/diethylamine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["diethylamine", 30]);
	return f.dot;
});

rt.type(6416, "/obj/item/weapon/reagent_containers/glass/bottle/facid", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Fluorosulfuric Acid Bottle",
	desc: "A small bottle. Contains a small amount of Fluorosulfuric Acid",
	icon_state: "bottle17",
	list_reagents: null,
});

// bottle.dm:120
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/facid/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["facid", 30]);
	return f.dot;
});

rt.type(6417, "/obj/item/weapon/reagent_containers/glass/bottle/adminordrazine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Adminordrazine Bottle",
	desc: "A small bottle. Contains the liquid essence of the gods.",
	icon: rt.rsc("icons/obj/drinks.dmi"),
	icon_state: "holyflask",
	list_reagents: null,
});

// bottle.dm:127
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/adminordrazine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["adminordrazine", 30]);
	return f.dot;
});

rt.type(6418, "/obj/item/weapon/reagent_containers/glass/bottle/capsaicin", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Capsaicin Bottle",
	desc: "A small bottle. Contains hot sauce.",
	icon_state: "bottle3",
	list_reagents: null,
});

// bottle.dm:133
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/capsaicin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["capsaicin", 30]);
	return f.dot;
});

rt.type(6419, "/obj/item/weapon/reagent_containers/glass/bottle/frostoil", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Frost Oil Bottle",
	desc: "A small bottle. Contains cold sauce.",
	icon_state: "bottle17",
	list_reagents: null,
});

// bottle.dm:139
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/frostoil/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["frostoil", 30]);
	return f.dot;
});

rt.type(6420, "/obj/item/weapon/reagent_containers/glass/bottle/traitor", "/obj/item/weapon/reagent_containers/glass/bottle", {
	extra_reagent: null,
	name: "syndicate bottle",
	desc: "A small bottle. Contains a random nasty chemical.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle16",
});

// bottle.dm:149
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/traitor/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.extra_reagent = pick("polonium", "histamine", "formaldehyde", "venom", "neurotoxin2", "cyanide");
	yield* this.reagents.add_reagent(`${this.extra_reagent}`, 3);
	return f.dot;
}, true);

rt.type(6421, "/obj/item/weapon/reagent_containers/glass/bottle/polonium", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "polonium bottle",
	desc: "A small bottle. Contains Polonium.",
	icon_state: "bottle16",
	list_reagents: null,
});

// bottle.dm:157
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/polonium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["polonium", 30]);
	return f.dot;
});

rt.type(6422, "/obj/item/weapon/reagent_containers/glass/bottle/venom", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "venom bottle",
	desc: "A small bottle. Contains Venom.",
	icon_state: "bottle16",
	list_reagents: null,
});

// bottle.dm:163
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/venom/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["venom", 30]);
	return f.dot;
});

rt.type(6423, "/obj/item/weapon/reagent_containers/glass/bottle/neurotoxin2", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "neurotoxin bottle",
	desc: "A small bottle. Contains Neurotoxin.",
	icon_state: "bottle16",
	list_reagents: null,
});

// bottle.dm:169
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/neurotoxin2/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["neurotoxin2", 30]);
	return f.dot;
});

rt.type(6424, "/obj/item/weapon/reagent_containers/glass/bottle/formaldehyde", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "formaldehyde bottle",
	desc: "A small bottle. Contains Formaldehyde.",
	icon_state: "bottle16",
	list_reagents: null,
});

// bottle.dm:175
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/formaldehyde/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["formaldehyde", 30]);
	return f.dot;
});

rt.type(6425, "/obj/item/weapon/reagent_containers/glass/bottle/initropidril", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "initropidril bottle",
	desc: "A small bottle. Contains initropidril.",
	icon_state: "bottle16",
	list_reagents: null,
});

// bottle.dm:181
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/initropidril/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["initropidril", 30]);
	return f.dot;
});

rt.type(6426, "/obj/item/weapon/reagent_containers/glass/bottle/pancuronium", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "pancuronium bottle",
	desc: "A small bottle. Contains pancuronium.",
	icon_state: "bottle16",
	list_reagents: null,
});

// bottle.dm:187
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/pancuronium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["pancuronium", 30]);
	return f.dot;
});

rt.type(6427, "/obj/item/weapon/reagent_containers/glass/bottle/sodium_thiopental", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "sodium thiopental bottle",
	desc: "A small bottle. Contains sodium thiopental.",
	icon_state: "bottle16",
	list_reagents: null,
});

// bottle.dm:193
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/sodium_thiopental/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sodium_thiopental", 30]);
	return f.dot;
});

rt.type(6428, "/obj/item/weapon/reagent_containers/glass/bottle/coniine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "coniine bottle",
	desc: "A small bottle. Contains coniine.",
	icon_state: "bottle16",
	list_reagents: null,
});

// bottle.dm:199
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/coniine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["coniine", 30]);
	return f.dot;
});

rt.type(6429, "/obj/item/weapon/reagent_containers/glass/bottle/curare", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "curare bottle",
	desc: "A small bottle. Contains curare.",
	icon_state: "bottle16",
	list_reagents: null,
});

// bottle.dm:205
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/curare/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["curare", 30]);
	return f.dot;
});

rt.type(6430, "/obj/item/weapon/reagent_containers/glass/bottle/amanitin", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "amanitin bottle",
	desc: "A small bottle. Contains amanitin.",
	icon_state: "bottle16",
	list_reagents: null,
});

// bottle.dm:211
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/amanitin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["amanitin", 30]);
	return f.dot;
});

rt.type(6431, "/obj/item/weapon/reagent_containers/glass/bottle/histamine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "histamine bottle",
	desc: "A small bottle. Contains Histamine.",
	icon_state: "bottle16",
	list_reagents: null,
});

// bottle.dm:217
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/histamine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["histamine", 30]);
	return f.dot;
});

rt.type(6432, "/obj/item/weapon/reagent_containers/glass/bottle/diphenhydramine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "antihistamine bottle",
	desc: "A small bottle of diphenhydramine.",
	icon_state: "bottle20",
	list_reagents: null,
});

// bottle.dm:223
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/diphenhydramine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["diphenhydramine", 30]);
	return f.dot;
});

rt.type(6433, "/obj/item/weapon/reagent_containers/glass/bottle/potass_iodide", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "anti-radiation bottle",
	desc: "A small bottle of potassium iodide.",
	icon_state: "bottle11",
	list_reagents: null,
});

// bottle.dm:229
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/potass_iodide/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["potass_iodide", 30]);
	return f.dot;
});

rt.type(6434, "/obj/item/weapon/reagent_containers/glass/bottle/salglu_solution", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "saline-glucose solution bottle",
	desc: "A small bottle of saline-glucose solution.",
	icon_state: "bottle1",
	list_reagents: null,
});

// bottle.dm:235
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/salglu_solution/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["salglu_solution", 30]);
	return f.dot;
});

rt.type(6435, "/obj/item/weapon/reagent_containers/glass/bottle/atropine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "atropine bottle",
	desc: "A small bottle of atropine.",
	icon_state: "bottle12",
	list_reagents: null,
});

// bottle.dm:241
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/atropine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["atropine", 30]);
	return f.dot;
});

rt.type(6436, "/obj/item/weapon/reagent_containers/glass/bottle/romerol", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "romerol bottle",
	desc: "A small bottle of Romerol. The REAL zombie powder.",
	icon_state: "bottle12",
	list_reagents: null,
});

// bottle.dm:247
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/romerol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["romerol", 30]);
	return f.dot;
});

rt.type(6453, "/obj/item/weapon/reagent_containers/glass/bottle/tuberculosiscure", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "BVAK bottle",
	desc: "A small bottle containing Bio Virus Antidote Kit.",
	icon_state: "bottle5",
	list_reagents: null,
});

// bottle.dm:350
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/tuberculosiscure/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["atropine", 5, "epinephrine", 5, "salbutamol", 10, "spaceacillin", 10]);
	return f.dot;
});
