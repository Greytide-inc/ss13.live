// From code/game/objects/items/weapons/storage/firstaid.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5569, "/obj/item/weapon/storage/firstaid/regular", "/obj/item/weapon/storage/firstaid", {
	icon_state: "firstaid",
	desc: "A first aid kit with the ability to heal common types of injuries.",
});

// /obj/item/weapon/storage/firstaid/regular/proc/PopulateContents  (code/game/objects/items/weapons/storage/firstaid.dm:26)  may sleep
rt.def("/obj/item/weapon/storage/firstaid/regular/proc/PopulateContents", function* PopulateContents(f: Frame) {
	if (truthy(rt.sv(f, "empty"))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/item/stack/medical/gauze"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/medical/bruise_pack"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/medical/bruise_pack"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/medical/ointment"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/medical/ointment"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/medipen"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/healthanalyzer"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5570, "/obj/item/weapon/storage/firstaid/ancient", "/obj/item/weapon/storage/firstaid", {
	icon_state: "firstaid",
	desc: "A first aid kit with the ability to heal common types of injuries.",
});

// /obj/item/weapon/storage/firstaid/ancient/proc/PopulateContents  (code/game/objects/items/weapons/storage/firstaid.dm:42)  may sleep
rt.def("/obj/item/weapon/storage/firstaid/ancient/proc/PopulateContents", function* PopulateContents(f: Frame) {
	if (truthy(rt.sv(f, "empty"))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/item/stack/medical/gauze"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/medical/bruise_pack"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/medical/bruise_pack"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/medical/bruise_pack"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/medical/ointment"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/medical/ointment"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/medical/ointment"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5571, "/obj/item/weapon/storage/firstaid/fire", "/obj/item/weapon/storage/firstaid", {
	name: "burn treatment kit",
	desc: "A specialized medical kit for when the toxins lab <i>-spontaneously-</i> burns down.",
	icon_state: "ointment",
	item_state: "firstaid-ointment",
});

// /obj/item/weapon/storage/firstaid/fire/proc/Initialize  (code/game/objects/items/weapons/storage/firstaid.dm:57)  may sleep
rt.def("/obj/item/weapon/storage/firstaid/fire/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", rt.op(f, "PickUnweighted", [2], ["ointment", "firefirstaid"]));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/weapon/storage/firstaid/fire/proc/PopulateContents  (code/game/objects/items/weapons/storage/firstaid.dm:63)  may sleep
rt.def("/obj/item/weapon/storage/firstaid/fire/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	if (truthy(rt.sv(f, "empty"))) {
		return live(f.dot);
	}
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/oxandrolone"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/oxandrolone"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/medipen"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/healthanalyzer"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5572, "/obj/item/weapon/storage/firstaid/toxin", "/obj/item/weapon/storage/firstaid", {
	name: "toxin treatment kit",
	desc: "Used to treat toxic blood content and radiation poisoning.",
	icon_state: "antitoxin",
	item_state: "firstaid-toxin",
});

// /obj/item/weapon/storage/firstaid/toxin/proc/Initialize  (code/game/objects/items/weapons/storage/firstaid.dm:77)  may sleep
rt.def("/obj/item/weapon/storage/firstaid/toxin/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "icon_state", rt.op(f, "PickUnweighted", [4], ["antitoxin", "antitoxfirstaid", "antitoxfirstaid2", "antitoxfirstaid3"]));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/weapon/storage/firstaid/toxin/proc/PopulateContents  (code/game/objects/items/weapons/storage/firstaid.dm:83)  may sleep
rt.def("/obj/item/weapon/storage/firstaid/toxin/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	if (truthy(rt.sv(f, "empty"))) {
		return live(f.dot);
	}
	i = null;
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/syringe/charcoal"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/storage/pill_bottle/charcoal"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/device/healthanalyzer"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5573, "/obj/item/weapon/storage/firstaid/o2", "/obj/item/weapon/storage/firstaid", {
	name: "oxygen deprivation treatment kit",
	desc: "A box full of oxygen goodies.",
	icon_state: "o2",
	item_state: "firstaid-o2",
});

// /obj/item/weapon/storage/firstaid/o2/proc/PopulateContents  (code/game/objects/items/weapons/storage/firstaid.dm:98)  may sleep
rt.def("/obj/item/weapon/storage/firstaid/o2/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	if (truthy(rt.sv(f, "empty"))) {
		return live(f.dot);
	}
	i = null;
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/salbutamol"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/medipen"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/medipen"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/healthanalyzer"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5574, "/obj/item/weapon/storage/firstaid/brute", "/obj/item/weapon/storage/firstaid", {
	name: "brute trauma treatment kit",
	desc: "A first aid kit for when you get toolboxed.",
	icon_state: "brute",
	item_state: "firstaid-brute",
});

// /obj/item/weapon/storage/firstaid/brute/proc/PopulateContents  (code/game/objects/items/weapons/storage/firstaid.dm:113)  may sleep
rt.def("/obj/item/weapon/storage/firstaid/brute/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	if (truthy(rt.sv(f, "empty"))) {
		return live(f.dot);
	}
	i = null;
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/patch/styptic"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/stack/medical/gauze"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/medical/gauze"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/healthanalyzer"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5575, "/obj/item/weapon/storage/firstaid/tactical", "/obj/item/weapon/storage/firstaid", {
	name: "combat medical kit",
	desc: "I hope you've got insurance.",
	icon_state: "bezerk",
	max_w_class: 3,
});

// /obj/item/weapon/storage/firstaid/tactical/proc/PopulateContents  (code/game/objects/items/weapons/storage/firstaid.dm:128)  may sleep
rt.def("/obj/item/weapon/storage/firstaid/tactical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	if (truthy(rt.sv(f, "empty"))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/item/stack/medical/gauze"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/defibrillator/compact/combat/loaded"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/combat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/patch/styptic"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/syringe/lethal/choral"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/hud/health/night"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5506, "/obj/item/weapon/storage/pill_bottle", "/obj/item/weapon/storage", {
	name: "pill bottle",
	desc: "It's an airtight container for storing medication.",
	icon_state: "pill_canister",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	item_state: "contsolid",
	w_class: 2,
	allow_quick_gather: 1,
	use_to_pickup: 1,
	can_hold: null,
});

// /obj/item/weapon/storage/pill_bottle/proc/<init>  (code/game/objects/items/weapons/storage/firstaid.dm:147)
rt.def("/obj/item/weapon/storage/pill_bottle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/reagent_containers/pill"), T("/obj/item/weapon/dice")));
	return f.dot;
});

// /obj/item/weapon/storage/pill_bottle/proc/MouseDrop  (code/game/objects/items/weapons/storage/firstaid.dm:153)  may sleep
rt.def("/obj/item/weapon/storage/pill_bottle/proc/MouseDrop", function* MouseDrop(f: Frame) {
	let M: Value = null, H: Value = null;
	f.vars = () => [M, H];
	if (!(truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(f.usr), T("/mob/living/carbon/monkey")) ? 1 : 0)))) return f.dot;
	M = live(f.usr);
	if ((!truthy((rt.istype(live(f.args[0]), T("/obj/screen")) ? 1 : 0)) || !truthy((yield* g.srcCall(f, "Adjacent", live(M)))))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if ((!truthy((yield* g.callName(f, live(M), "incapacitated", []))) && truthy((rt.istype(live(f.args[0]), T("/obj/screen/inventory/hand")) ? 1 : 0)))) {
		H = live(f.args[0]);
		if (truthy((yield* g.callName(f, live(M), "putItemFromInventoryInHandIfPossible", [live(f.src), rt.fv(f, "held_index", live(H))])))) {
			yield* g.srcCall(f, "add_fingerprint", live(f.usr));
		}
	}
	if (!((isEqual(live(f.args[0]), live(f.usr)) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1)) || truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)]))))) return f.dot;
	if (truthy(rt.fv(f, "s_active", live(f.usr)))) {
		yield* g.callName(f, rt.fv(f, "s_active", live(f.usr)), "close", [live(f.usr)]);
	}
	yield* g.callName(f, live(f.src), "show_to", [live(f.usr)]);
	return f.dot;
}, true, { args: ["over_object"] });

rt.type(5508, "/obj/item/weapon/storage/pill_bottle/charcoal", "/obj/item/weapon/storage/pill_bottle", {
	name: "bottle of charcoal pills",
	desc: "Contains pills used to counter toxins.",
});

// /obj/item/weapon/storage/pill_bottle/charcoal/proc/PopulateContents  (code/game/objects/items/weapons/storage/firstaid.dm:171)  may sleep
rt.def("/obj/item/weapon/storage/pill_bottle/charcoal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/charcoal"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5509, "/obj/item/weapon/storage/pill_bottle/epinephrine", "/obj/item/weapon/storage/pill_bottle", {
	name: "bottle of epinephrine pills",
	desc: "Contains pills used to stabilize patients.",
});

// /obj/item/weapon/storage/pill_bottle/epinephrine/proc/PopulateContents  (code/game/objects/items/weapons/storage/firstaid.dm:179)  may sleep
rt.def("/obj/item/weapon/storage/pill_bottle/epinephrine/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/epinephrine"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5510, "/obj/item/weapon/storage/pill_bottle/mutadone", "/obj/item/weapon/storage/pill_bottle", {
	name: "bottle of mutadone pills",
	desc: "Contains pills used to treat genetic abnormalities.",
});

// /obj/item/weapon/storage/pill_bottle/mutadone/proc/PopulateContents  (code/game/objects/items/weapons/storage/firstaid.dm:187)  may sleep
rt.def("/obj/item/weapon/storage/pill_bottle/mutadone/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/mutadone"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5511, "/obj/item/weapon/storage/pill_bottle/mannitol", "/obj/item/weapon/storage/pill_bottle", {
	name: "bottle of mannitol pills",
	desc: "Contains pills used to treat brain damage.",
});

// /obj/item/weapon/storage/pill_bottle/mannitol/proc/PopulateContents  (code/game/objects/items/weapons/storage/firstaid.dm:195)  may sleep
rt.def("/obj/item/weapon/storage/pill_bottle/mannitol/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/mannitol"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5512, "/obj/item/weapon/storage/pill_bottle/stimulant", "/obj/item/weapon/storage/pill_bottle", {
	name: "bottle of stimulant pills",
	desc: "Guaranteed to give you that extra burst of energy during a long shift!",
});

// /obj/item/weapon/storage/pill_bottle/stimulant/proc/PopulateContents  (code/game/objects/items/weapons/storage/firstaid.dm:203)  may sleep
rt.def("/obj/item/weapon/storage/pill_bottle/stimulant/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/stimulant"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5513, "/obj/item/weapon/storage/pill_bottle/mining", "/obj/item/weapon/storage/pill_bottle", {
	name: "bottle of patches",
	desc: "Contains patches used to treat brute and burn damage.",
});

// /obj/item/weapon/storage/pill_bottle/mining/proc/PopulateContents  (code/game/objects/items/weapons/storage/firstaid.dm:211)  may sleep
rt.def("/obj/item/weapon/storage/pill_bottle/mining/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/patch/styptic"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
