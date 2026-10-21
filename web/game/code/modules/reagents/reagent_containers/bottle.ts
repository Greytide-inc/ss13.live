// From code/modules/reagents/reagent_containers/bottle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6393, "/obj/item/weapon/reagent_containers/glass/bottle", "/obj/item/weapon/reagent_containers/glass", {
	name: "bottle",
	desc: "A small bottle.",
	icon_state: "bottle",
	item_state: "atoxinbottle",
	possible_transfer_amounts: null,
	volume: 30,
	full_icon_state: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/proc/Initialize  (code/modules/reagents/reagent_containers/bottle.dm:13)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "icon_state"))) {
		rt.setSv(f, "icon_state", "bottle");
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/glass/bottle/proc/on_reagent_change  (code/modules/reagents/reagent_containers/bottle.dm:19)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/glass/bottle/proc/update_icon  (code/modules/reagents/reagent_containers/bottle.dm:22)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/proc/update_icon", function update_icon(f: Frame) {
	let filling: Value = null, percent: Value = null;
	let $0: any;
	f.vars = () => [filling, percent, $0];
	rt.callSrc(f, "cut_overlays", []);
	// Coloured culture/virus bottles (bottle16, bottle12...) keep their own sprite in full_icon_state;
	// when empty they show the plain "bottle" sprite, and the filling overlays use the own sprite's name.
	if (!truthy(rt.sv(f, "full_icon_state"))) rt.setSv(f, "full_icon_state", rt.sv(f, "icon_state"));
	const own = String(rt.sv(f, "full_icon_state"));
	const coloured = /^bottle\d+$/.test(own);
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		if (coloured) rt.setSv(f, "icon_state", "bottle");
		return f.dot;
	}
	rt.setSv(f, "icon_state", own);
	filling = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/reagentfillings.dmi"), fmt("＀-10", [rt.sv(f, "icon_state")])]);
	$0 = (percent = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.sv(f, "volume")), 100)]));
	if (rt.inRange($0, 0, 9)) {
		rt.setFv(f, "icon_state", live(filling), fmt("＀-10", [rt.sv(f, "icon_state")]));
	} else if (rt.inRange($0, 10, 29)) {
		rt.setFv(f, "icon_state", live(filling), fmt("＀25", [rt.sv(f, "icon_state")]));
	} else if (rt.inRange($0, 30, 49)) {
		rt.setFv(f, "icon_state", live(filling), fmt("＀50", [rt.sv(f, "icon_state")]));
	} else if (rt.inRange($0, 50, 69)) {
		rt.setFv(f, "icon_state", live(filling), fmt("＀75", [rt.sv(f, "icon_state")]));
	} else if (rt.inRange($0, 70, 9.999999848243207e+30)) {
		rt.setFv(f, "icon_state", live(filling), fmt("＀100", [rt.sv(f, "icon_state")]));
	}
	rt.setFv(f, "color", live(filling), rt.call(f, P("/proc/mix_color_from_reagents"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]));
	rt.callSrc(f, "add_overlay", [live(filling)]);
	return f.dot;
});

rt.type(6404, "/obj/item/weapon/reagent_containers/glass/bottle/epinephrine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "epinephrine bottle",
	desc: "A small bottle. Contains epinephrine - used to stabilize patients.",
	icon_state: "bottle16",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/epinephrine/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:47)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/epinephrine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["epinephrine", 30]));
	return f.dot;
});

rt.type(6405, "/obj/item/weapon/reagent_containers/glass/bottle/toxin", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "toxin bottle",
	desc: "A small bottle of toxins. Do not drink, it is poisonous.",
	icon_state: "bottle12",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/toxin/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:53)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/toxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["toxin", 30]));
	return f.dot;
});

rt.type(6406, "/obj/item/weapon/reagent_containers/glass/bottle/cyanide", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "cyanide bottle",
	desc: "A small bottle of cyanide. Bitter almonds?",
	icon_state: "bottle12",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/cyanide/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:59)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/cyanide/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["cyanide", 30]));
	return f.dot;
});

rt.type(6407, "/obj/item/weapon/reagent_containers/glass/bottle/spewium", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "spewium bottle",
	desc: "A small bottle of spewium.",
	icon_state: "bottle12",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/spewium/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:65)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/spewium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["spewium", 30]));
	return f.dot;
});

rt.type(6408, "/obj/item/weapon/reagent_containers/glass/bottle/morphine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "morphine bottle",
	desc: "A small bottle of morphine.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle20",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/morphine/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:72)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/morphine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["morphine", 30]));
	return f.dot;
});

rt.type(6409, "/obj/item/weapon/reagent_containers/glass/bottle/chloralhydrate", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Chloral Hydrate Bottle",
	desc: "A small bottle of Choral Hydrate. Mickey's Favorite!",
	icon_state: "bottle20",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/chloralhydrate/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:78)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/chloralhydrate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["chloralhydrate", 15]));
	return f.dot;
});

rt.type(6410, "/obj/item/weapon/reagent_containers/glass/bottle/charcoal", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "antitoxin bottle",
	desc: "A small bottle of charcoal.",
	icon_state: "bottle17",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/charcoal/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:84)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/charcoal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["charcoal", 30]));
	return f.dot;
});

rt.type(6411, "/obj/item/weapon/reagent_containers/glass/bottle/mutagen", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "unstable mutagen bottle",
	desc: "A small bottle of unstable mutagen. Randomly changes the DNA structure of whoever comes in contact.",
	icon_state: "bottle20",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/mutagen/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:90)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/mutagen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["mutagen", 30]));
	return f.dot;
});

rt.type(6412, "/obj/item/weapon/reagent_containers/glass/bottle/plasma", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "liquid plasma bottle",
	desc: "A small bottle of liquid plasma. Extremely toxic and reacts with micro-organisms inside blood.",
	icon_state: "bottle8",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/plasma/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:96)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["plasma", 30]));
	return f.dot;
});

rt.type(6413, "/obj/item/weapon/reagent_containers/glass/bottle/synaptizine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "synaptizine bottle",
	desc: "A small bottle of synaptizine.",
	icon_state: "bottle20",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/synaptizine/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:102)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/synaptizine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["synaptizine", 30]));
	return f.dot;
});

rt.type(6414, "/obj/item/weapon/reagent_containers/glass/bottle/ammonia", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "ammonia bottle",
	desc: "A small bottle of ammonia.",
	icon_state: "bottle20",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/ammonia/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:108)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/ammonia/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["ammonia", 30]));
	return f.dot;
});

rt.type(6415, "/obj/item/weapon/reagent_containers/glass/bottle/diethylamine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "diethylamine bottle",
	desc: "A small bottle of diethylamine.",
	icon_state: "bottle17",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/diethylamine/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:114)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/diethylamine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["diethylamine", 30]));
	return f.dot;
});

rt.type(6416, "/obj/item/weapon/reagent_containers/glass/bottle/facid", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Fluorosulfuric Acid Bottle",
	desc: "A small bottle. Contains a small amount of Fluorosulfuric Acid",
	icon_state: "bottle17",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/facid/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:120)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/facid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["facid", 30]));
	return f.dot;
});

rt.type(6417, "/obj/item/weapon/reagent_containers/glass/bottle/adminordrazine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Adminordrazine Bottle",
	desc: "A small bottle. Contains the liquid essence of the gods.",
	icon: rt.rsc("icons/obj/drinks.dmi"),
	icon_state: "holyflask",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/adminordrazine/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:127)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/adminordrazine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["adminordrazine", 30]));
	return f.dot;
});

rt.type(6418, "/obj/item/weapon/reagent_containers/glass/bottle/capsaicin", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Capsaicin Bottle",
	desc: "A small bottle. Contains hot sauce.",
	icon_state: "bottle3",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/capsaicin/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:133)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/capsaicin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["capsaicin", 30]));
	return f.dot;
});

rt.type(6419, "/obj/item/weapon/reagent_containers/glass/bottle/frostoil", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Frost Oil Bottle",
	desc: "A small bottle. Contains cold sauce.",
	icon_state: "bottle17",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/frostoil/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:139)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/frostoil/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["frostoil", 30]));
	return f.dot;
});

rt.type(6420, "/obj/item/weapon/reagent_containers/glass/bottle/traitor", "/obj/item/weapon/reagent_containers/glass/bottle", {
	extra_reagent: null,
	name: "syndicate bottle",
	desc: "A small bottle. Contains a random nasty chemical.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle16",
});

// /obj/item/weapon/reagent_containers/glass/bottle/traitor/proc/Initialize  (code/modules/reagents/reagent_containers/bottle.dm:149)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/traitor/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "extra_reagent", rt.op(f, "PickUnweighted", [6], ["polonium", "histamine", "formaldehyde", "venom", "neurotoxin2", "cyanide"]));
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [fmt("＀", [rt.sv(f, "extra_reagent")]), 3]);
	return f.dot;
}, true);

rt.type(6421, "/obj/item/weapon/reagent_containers/glass/bottle/polonium", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "polonium bottle",
	desc: "A small bottle. Contains Polonium.",
	icon_state: "bottle16",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/polonium/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:157)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/polonium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["polonium", 30]));
	return f.dot;
});

rt.type(6422, "/obj/item/weapon/reagent_containers/glass/bottle/venom", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "venom bottle",
	desc: "A small bottle. Contains Venom.",
	icon_state: "bottle16",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/venom/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:163)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/venom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["venom", 30]));
	return f.dot;
});

rt.type(6423, "/obj/item/weapon/reagent_containers/glass/bottle/neurotoxin2", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "neurotoxin bottle",
	desc: "A small bottle. Contains Neurotoxin.",
	icon_state: "bottle16",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/neurotoxin2/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:169)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/neurotoxin2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["neurotoxin2", 30]));
	return f.dot;
});

rt.type(6424, "/obj/item/weapon/reagent_containers/glass/bottle/formaldehyde", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "formaldehyde bottle",
	desc: "A small bottle. Contains Formaldehyde.",
	icon_state: "bottle16",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/formaldehyde/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:175)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/formaldehyde/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["formaldehyde", 30]));
	return f.dot;
});

rt.type(6425, "/obj/item/weapon/reagent_containers/glass/bottle/initropidril", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "initropidril bottle",
	desc: "A small bottle. Contains initropidril.",
	icon_state: "bottle16",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/initropidril/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:181)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/initropidril/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["initropidril", 30]));
	return f.dot;
});

rt.type(6426, "/obj/item/weapon/reagent_containers/glass/bottle/pancuronium", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "pancuronium bottle",
	desc: "A small bottle. Contains pancuronium.",
	icon_state: "bottle16",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/pancuronium/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:187)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/pancuronium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["pancuronium", 30]));
	return f.dot;
});

rt.type(6427, "/obj/item/weapon/reagent_containers/glass/bottle/sodium_thiopental", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "sodium thiopental bottle",
	desc: "A small bottle. Contains sodium thiopental.",
	icon_state: "bottle16",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/sodium_thiopental/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:193)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/sodium_thiopental/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sodium_thiopental", 30]));
	return f.dot;
});

rt.type(6428, "/obj/item/weapon/reagent_containers/glass/bottle/coniine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "coniine bottle",
	desc: "A small bottle. Contains coniine.",
	icon_state: "bottle16",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/coniine/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:199)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/coniine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["coniine", 30]));
	return f.dot;
});

rt.type(6429, "/obj/item/weapon/reagent_containers/glass/bottle/curare", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "curare bottle",
	desc: "A small bottle. Contains curare.",
	icon_state: "bottle16",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/curare/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:205)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/curare/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["curare", 30]));
	return f.dot;
});

rt.type(6430, "/obj/item/weapon/reagent_containers/glass/bottle/amanitin", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "amanitin bottle",
	desc: "A small bottle. Contains amanitin.",
	icon_state: "bottle16",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/amanitin/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:211)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/amanitin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["amanitin", 30]));
	return f.dot;
});

rt.type(6431, "/obj/item/weapon/reagent_containers/glass/bottle/histamine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "histamine bottle",
	desc: "A small bottle. Contains Histamine.",
	icon_state: "bottle16",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/histamine/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:217)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/histamine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["histamine", 30]));
	return f.dot;
});

rt.type(6432, "/obj/item/weapon/reagent_containers/glass/bottle/diphenhydramine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "antihistamine bottle",
	desc: "A small bottle of diphenhydramine.",
	icon_state: "bottle20",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/diphenhydramine/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:223)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/diphenhydramine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["diphenhydramine", 30]));
	return f.dot;
});

rt.type(6433, "/obj/item/weapon/reagent_containers/glass/bottle/potass_iodide", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "anti-radiation bottle",
	desc: "A small bottle of potassium iodide.",
	icon_state: "bottle11",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/potass_iodide/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:229)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/potass_iodide/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["potass_iodide", 30]));
	return f.dot;
});

rt.type(6434, "/obj/item/weapon/reagent_containers/glass/bottle/salglu_solution", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "saline-glucose solution bottle",
	desc: "A small bottle of saline-glucose solution.",
	icon_state: "bottle1",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/salglu_solution/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:235)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/salglu_solution/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["salglu_solution", 30]));
	return f.dot;
});

rt.type(6435, "/obj/item/weapon/reagent_containers/glass/bottle/atropine", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "atropine bottle",
	desc: "A small bottle of atropine.",
	icon_state: "bottle12",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/atropine/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:241)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/atropine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["atropine", 30]));
	return f.dot;
});

rt.type(6436, "/obj/item/weapon/reagent_containers/glass/bottle/romerol", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "romerol bottle",
	desc: "A small bottle of Romerol. The REAL zombie powder.",
	icon_state: "bottle12",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/romerol/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:247)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/romerol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["romerol", 30]));
	return f.dot;
});

rt.type(6453, "/obj/item/weapon/reagent_containers/glass/bottle/tuberculosiscure", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "BVAK bottle",
	desc: "A small bottle containing Bio Virus Antidote Kit.",
	icon_state: "bottle5",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/tuberculosiscure/proc/<init>  (code/modules/reagents/reagent_containers/bottle.dm:350)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/tuberculosiscure/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["atropine", 5, "epinephrine", 5, "salbutamol", 10, "spaceacillin", 10]));
	return f.dot;
});
