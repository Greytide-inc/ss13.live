// Based on /tg/station's code/game/objects/items/weapons/storage/firstaid.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5569, "/obj/item/weapon/storage/firstaid/regular", "/obj/item/weapon/storage/firstaid", {
	icon_state: "firstaid",
	desc: "A first aid kit with the ability to heal common types of injuries.",
});

// firstaid.dm:26
rt.def("/obj/item/weapon/storage/firstaid/regular/proc/PopulateContents", function* PopulateContents(f: Frame) {
	if (this.empty) {
		return f.dot;
	}
	yield* new_(T("/obj/item/stack/medical/gauze"), this);
	yield* new_(T("/obj/item/stack/medical/bruise_pack"), this);
	yield* new_(T("/obj/item/stack/medical/bruise_pack"), this);
	yield* new_(T("/obj/item/stack/medical/ointment"), this);
	yield* new_(T("/obj/item/stack/medical/ointment"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/medipen"), this);
	yield* new_(T("/obj/item/device/healthanalyzer"), this);
	return f.dot;
}, true);

rt.type(5570, "/obj/item/weapon/storage/firstaid/ancient", "/obj/item/weapon/storage/firstaid", {
	icon_state: "firstaid",
	desc: "A first aid kit with the ability to heal common types of injuries.",
});

// firstaid.dm:42
rt.def("/obj/item/weapon/storage/firstaid/ancient/proc/PopulateContents", function* PopulateContents(f: Frame) {
	if (this.empty) {
		return f.dot;
	}
	yield* new_(T("/obj/item/stack/medical/gauze"), this);
	yield* new_(T("/obj/item/stack/medical/bruise_pack"), this);
	yield* new_(T("/obj/item/stack/medical/bruise_pack"), this);
	yield* new_(T("/obj/item/stack/medical/bruise_pack"), this);
	yield* new_(T("/obj/item/stack/medical/ointment"), this);
	yield* new_(T("/obj/item/stack/medical/ointment"), this);
	yield* new_(T("/obj/item/stack/medical/ointment"), this);
	return f.dot;
}, true);

rt.type(5571, "/obj/item/weapon/storage/firstaid/fire", "/obj/item/weapon/storage/firstaid", {
	name: "burn treatment kit",
	desc: "A specialized medical kit for when the toxins lab <i>-spontaneously-</i> burns down.",
	icon_state: "ointment",
	item_state: "firstaid-ointment",
});

// firstaid.dm:57
rt.def("/obj/item/weapon/storage/firstaid/fire/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	this.icon_state = pick("ointment", "firefirstaid");
	return f.dot;
}, true);

// firstaid.dm:63
rt.def("/obj/item/weapon/storage/firstaid/fire/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	if (this.empty) {
		return f.dot;
	}
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/reagent_containers/pill/oxandrolone"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/pill/oxandrolone"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/medipen"), this);
	yield* new_(T("/obj/item/device/healthanalyzer"), this);
	return f.dot;
}, true);

rt.type(5572, "/obj/item/weapon/storage/firstaid/toxin", "/obj/item/weapon/storage/firstaid", {
	name: "toxin treatment kit",
	desc: "Used to treat toxic blood content and radiation poisoning.",
	icon_state: "antitoxin",
	item_state: "firstaid-toxin",
});

// firstaid.dm:77
rt.def("/obj/item/weapon/storage/firstaid/toxin/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	this.icon_state = pick("antitoxin", "antitoxfirstaid", "antitoxfirstaid2", "antitoxfirstaid3");
	return f.dot;
}, true);

// firstaid.dm:83
rt.def("/obj/item/weapon/storage/firstaid/toxin/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	if (this.empty) {
		return f.dot;
	}
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/syringe/charcoal"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/storage/pill_bottle/charcoal"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/device/healthanalyzer"), this);
	return f.dot;
}, true);

rt.type(5573, "/obj/item/weapon/storage/firstaid/o2", "/obj/item/weapon/storage/firstaid", {
	name: "oxygen deprivation treatment kit",
	desc: "A box full of oxygen goodies.",
	icon_state: "o2",
	item_state: "firstaid-o2",
});

// firstaid.dm:98
rt.def("/obj/item/weapon/storage/firstaid/o2/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	if (this.empty) {
		return f.dot;
	}
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/pill/salbutamol"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/medipen"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/medipen"), this);
	yield* new_(T("/obj/item/device/healthanalyzer"), this);
	return f.dot;
}, true);

rt.type(5574, "/obj/item/weapon/storage/firstaid/brute", "/obj/item/weapon/storage/firstaid", {
	name: "brute trauma treatment kit",
	desc: "A first aid kit for when you get toolboxed.",
	icon_state: "brute",
	item_state: "firstaid-brute",
});

// firstaid.dm:113
rt.def("/obj/item/weapon/storage/firstaid/brute/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	if (this.empty) {
		return f.dot;
	}
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/pill/patch/styptic"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/stack/medical/gauze"), this);
	yield* new_(T("/obj/item/stack/medical/gauze"), this);
	yield* new_(T("/obj/item/device/healthanalyzer"), this);
	return f.dot;
}, true);

rt.type(5575, "/obj/item/weapon/storage/firstaid/tactical", "/obj/item/weapon/storage/firstaid", {
	name: "combat medical kit",
	desc: "I hope you've got insurance.",
	icon_state: "bezerk",
	max_w_class: 3,
});

// firstaid.dm:128
rt.def("/obj/item/weapon/storage/firstaid/tactical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	if (this.empty) {
		return f.dot;
	}
	yield* new_(T("/obj/item/stack/medical/gauze"), this);
	yield* new_(T("/obj/item/weapon/defibrillator/compact/combat/loaded"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/combat"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/pill/patch/styptic"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/syringe/lethal/choral"), this);
	yield* new_(T("/obj/item/clothing/glasses/hud/health/night"), this);
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

// firstaid.dm:147
rt.def("/obj/item/weapon/storage/pill_bottle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/reagent_containers/pill"), T("/obj/item/weapon/dice"));
	return f.dot;
});

// firstaid.dm:153
rt.def("/obj/item/weapon/storage/pill_bottle/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let H: Value = null;
	if (!(rt.istype(f.usr, T("/mob/living/carbon/human")) || rt.istype(f.usr, T("/mob/living/carbon/monkey")))) return f.dot;
	let M: Value = f.usr;
	if (!rt.istype(over_object, T("/obj/screen")) || !this.Adjacent(M)) {
		return (yield* parent_proc());
	}
	if (!M.incapacitated() && rt.istype(over_object, T("/obj/screen/inventory/hand"))) {
		H = over_object;
		if (yield* M.putItemFromInventoryInHandIfPossible(this, H.held_index)) {
			yield* this.add_fingerprint(f.usr);
		}
	}
	if (!(over_object == f.usr && get_dist(this, f.usr) <= 1 || f.usr.contents.Find(this))) return f.dot;
	if (f.usr.s_active) {
		yield* f.usr.s_active.close(f.usr);
	}
	yield* this.show_to(f.usr);
	return f.dot;
}, true);

rt.type(5508, "/obj/item/weapon/storage/pill_bottle/charcoal", "/obj/item/weapon/storage/pill_bottle", {
	name: "bottle of charcoal pills",
	desc: "Contains pills used to counter toxins.",
});

// firstaid.dm:171
rt.def("/obj/item/weapon/storage/pill_bottle/charcoal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/pill/charcoal"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5509, "/obj/item/weapon/storage/pill_bottle/epinephrine", "/obj/item/weapon/storage/pill_bottle", {
	name: "bottle of epinephrine pills",
	desc: "Contains pills used to stabilize patients.",
});

// firstaid.dm:179
rt.def("/obj/item/weapon/storage/pill_bottle/epinephrine/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/pill/epinephrine"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5510, "/obj/item/weapon/storage/pill_bottle/mutadone", "/obj/item/weapon/storage/pill_bottle", {
	name: "bottle of mutadone pills",
	desc: "Contains pills used to treat genetic abnormalities.",
});

// firstaid.dm:187
rt.def("/obj/item/weapon/storage/pill_bottle/mutadone/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/pill/mutadone"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5511, "/obj/item/weapon/storage/pill_bottle/mannitol", "/obj/item/weapon/storage/pill_bottle", {
	name: "bottle of mannitol pills",
	desc: "Contains pills used to treat brain damage.",
});

// firstaid.dm:195
rt.def("/obj/item/weapon/storage/pill_bottle/mannitol/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/pill/mannitol"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5512, "/obj/item/weapon/storage/pill_bottle/stimulant", "/obj/item/weapon/storage/pill_bottle", {
	name: "bottle of stimulant pills",
	desc: "Guaranteed to give you that extra burst of energy during a long shift!",
});

// firstaid.dm:203
rt.def("/obj/item/weapon/storage/pill_bottle/stimulant/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/pill/stimulant"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5513, "/obj/item/weapon/storage/pill_bottle/mining", "/obj/item/weapon/storage/pill_bottle", {
	name: "bottle of patches",
	desc: "Contains patches used to treat brute and burn damage.",
});

// firstaid.dm:211
rt.def("/obj/item/weapon/storage/pill_bottle/mining/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/pill/patch/styptic"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
