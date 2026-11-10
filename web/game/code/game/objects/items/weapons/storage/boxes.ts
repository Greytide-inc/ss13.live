// Based on /tg/station's code/game/objects/items/weapons/storage/boxes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(5332, "/obj/item/weapon/storage/box", "/obj/item/weapon/storage", {
	illustration: "writing",
	foldable: rt.typePath("/obj/item/stack/sheet/cardboard"),
	name: "box",
	desc: "It's just an ordinary box.",
	icon_state: "box",
	item_state: "syringe_kit",
	resistance_flags: 4,
});

// boxes.dm:34
rt.def("/obj/item/weapon/storage/box/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// boxes.dm:38
rt.def("/obj/item/weapon/storage/box/proc/update_icon", function update_icon(f: Frame) {
	f.dot = parent_proc();
	if (!this.illustration) return f.dot;
	this.cut_overlays();
	this.add_overlay(this.illustration);
	return f.dot;
});

// boxes.dm:44
rt.def("/obj/item/weapon/storage/box/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* parent_proc();
	if (!this.foldable) {
		return f.dot;
	}
	if (rt.len(f, this.contents)) {
		to_chat(user, "<span class='warning'>You can't fold this box with items still inside!</span>");
		return f.dot;
	}
	if (!ispath(this.foldable)) {
		return f.dot;
	}
	this.close_all();
	to_chat(user, `<span class='notice'>You fold ${this} flat.</span>`);
	let I: Value = (yield* new_(this.foldable, rt.getStep(f, this, 0)));
	yield* user.drop_item();
	yield* user.put_in_hands(I);
	yield* user.update_inv_hands();
	yield* qdel(this);
	return f.dot;
}, true);

// boxes.dm:65
rt.def("/obj/item/weapon/storage/box/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/stack/packageWrap"))) {
		return 0;
	}
	return (yield* parent_proc());
}, true);

rt.type(5338, "/obj/item/weapon/storage/box/disks", "/obj/item/weapon/storage/box", {
	illustration: "disk_kit",
	name: "diskette box",
});

// boxes.dm:76
rt.def("/obj/item/weapon/storage/box/disks/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/disk/data"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5339, "/obj/item/weapon/storage/box/disks_plantgene", "/obj/item/weapon/storage/box", {
	illustration: "disk_kit",
	name: "plant data disks box",
});

// boxes.dm:85
rt.def("/obj/item/weapon/storage/box/disks_plantgene/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/disk/plantgene"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5340, "/obj/item/weapon/storage/box/survival", "/obj/item/weapon/storage/box", {});

// boxes.dm:90
rt.def("/obj/item/weapon/storage/box/survival/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/mask/breath"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/medipen"), this);
	return f.dot;
}, true);

rt.type(5341, "/obj/item/weapon/storage/box/survival/radio", "/obj/item/weapon/storage/box/survival", {});

// boxes.dm:95
rt.def("/obj/item/weapon/storage/box/survival/radio/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/device/radio/off"), this);
	return f.dot;
}, true);

rt.type(5342, "/obj/item/weapon/storage/box/survival_mining", "/obj/item/weapon/storage/box", {});

// boxes.dm:99
rt.def("/obj/item/weapon/storage/box/survival_mining/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/mask/gas/explorer"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen/engi"), this);
	yield* new_(T("/obj/item/weapon/crowbar/red"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/medipen"), this);
	return f.dot;
}, true);

rt.type(5343, "/obj/item/weapon/storage/box/engineer", "/obj/item/weapon/storage/box", {});

// boxes.dm:107
rt.def("/obj/item/weapon/storage/box/engineer/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/mask/breath"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen/engi"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/medipen"), this);
	return f.dot;
}, true);

rt.type(5344, "/obj/item/weapon/storage/box/engineer/radio", "/obj/item/weapon/storage/box/engineer", {});

// boxes.dm:112
rt.def("/obj/item/weapon/storage/box/engineer/radio/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/device/radio/off"), this);
	return f.dot;
}, true);

rt.type(5345, "/obj/item/weapon/storage/box/syndie", "/obj/item/weapon/storage/box", {});

// boxes.dm:117
rt.def("/obj/item/weapon/storage/box/syndie/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/mask/gas/syndicate"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen/engi"), this);
	return f.dot;
}, true);

rt.type(5346, "/obj/item/weapon/storage/box/security", "/obj/item/weapon/storage/box", {});

// boxes.dm:122
rt.def("/obj/item/weapon/storage/box/security/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/mask/gas/sechailer"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/medipen"), this);
	return f.dot;
}, true);

rt.type(5347, "/obj/item/weapon/storage/box/security/radio", "/obj/item/weapon/storage/box/security", {});

// boxes.dm:127
rt.def("/obj/item/weapon/storage/box/security/radio/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/device/radio/off"), this);
	return f.dot;
}, true);

rt.type(5348, "/obj/item/weapon/storage/box/gloves", "/obj/item/weapon/storage/box", {
	illustration: "latex",
	name: "box of latex gloves",
	desc: "Contains sterile latex gloves.",
});

// boxes.dm:136
rt.def("/obj/item/weapon/storage/box/gloves/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/gloves/color/latex"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5349, "/obj/item/weapon/storage/box/masks", "/obj/item/weapon/storage/box", {
	illustration: "sterile",
	name: "box of sterile masks",
	desc: "This box contains sterile medical masks.",
});

// boxes.dm:145
rt.def("/obj/item/weapon/storage/box/masks/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/mask/surgical"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5350, "/obj/item/weapon/storage/box/syringes", "/obj/item/weapon/storage/box", {
	illustration: "syringe",
	name: "box of syringes",
	desc: "A box full of syringes.",
});

// boxes.dm:154
rt.def("/obj/item/weapon/storage/box/syringes/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/syringe"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5351, "/obj/item/weapon/storage/box/medipens", "/obj/item/weapon/storage/box", {
	illustration: "syringe",
	name: "box of medipens",
	desc: "A box full of epinephrine MediPens.",
});

// boxes.dm:163
rt.def("/obj/item/weapon/storage/box/medipens/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/medipen"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5352, "/obj/item/weapon/storage/box/medipens/utility", "/obj/item/weapon/storage/box/medipens", {
	illustration: "syringe",
	name: "stimpack value kit",
	desc: "A box with several stimpack medipens for the economical miner.",
});

// boxes.dm:172
rt.def("/obj/item/weapon/storage/box/medipens/utility/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/medipen/stimpack"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5353, "/obj/item/weapon/storage/box/beakers", "/obj/item/weapon/storage/box", {
	illustration: "beaker",
	name: "box of beakers",
});

// boxes.dm:181
rt.def("/obj/item/weapon/storage/box/beakers/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5354, "/obj/item/weapon/storage/box/injectors", "/obj/item/weapon/storage/box", {
	name: "box of DNA injectors",
	desc: "This box contains injectors, it seems.",
});

// boxes.dm:189
rt.def("/obj/item/weapon/storage/box/injectors/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/dnainjector/h2m"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/dnainjector/m2h"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5355, "/obj/item/weapon/storage/box/flashbangs", "/obj/item/weapon/storage/box", {
	illustration: "flashbang",
	name: "box of flashbangs (WARNING)",
	desc: "<B>WARNING: These devices are extremely dangerous and can cause blindness or deafness in repeated use.</B>",
	icon_state: "secbox",
});

// boxes.dm:201
rt.def("/obj/item/weapon/storage/box/flashbangs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/grenade/flashbang"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5356, "/obj/item/weapon/storage/box/flashes", "/obj/item/weapon/storage/box", {
	illustration: "flashbang",
	name: "box of flashbulbs",
	desc: "<B>WARNING: Flashes can cause serious eye damage, protective eyewear is required.</B>",
	icon_state: "secbox",
});

// boxes.dm:211
rt.def("/obj/item/weapon/storage/box/flashes/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/device/assembly/flash/handheld"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5357, "/obj/item/weapon/storage/box/wall_flash", "/obj/item/weapon/storage/box", {
	illustration: "flashbang",
	name: "wall-mounted flash kit",
	desc: "This box contains everything necessary to build a wall-mounted flash. <B>WARNING: Flashes can cause serious eye damage, protective eyewear is required.</B>",
});

// boxes.dm:220
rt.def("/obj/item/weapon/storage/box/wall_flash/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let remote: Value = null, frame: Value = null;
	let id: Value = rand(1000, 9999);
	yield* new_(T("/obj/item/wallframe/button"), this);
	yield* new_(T("/obj/item/weapon/electronics/airlock"), this);
	(remote = (yield* new_(T("/obj/item/device/assembly/control/flasher"), this))).id = id;
	(frame = (yield* new_(T("/obj/item/wallframe/flasher"), this))).id = id;
	yield* new_(T("/obj/item/device/assembly/flash/handheld"), this);
	yield* new_(T("/obj/item/weapon/screwdriver"), this);
	return f.dot;
}, true);

rt.type(5358, "/obj/item/weapon/storage/box/teargas", "/obj/item/weapon/storage/box", {
	illustration: "flashbang",
	name: "box of tear gas grenades (WARNING)",
	desc: "<B>WARNING: These devices are extremely dangerous and can cause blindness and skin irritation.</B>",
});

// boxes.dm:239
rt.def("/obj/item/weapon/storage/box/teargas/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/grenade/chem_grenade/teargas"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5359, "/obj/item/weapon/storage/box/emps", "/obj/item/weapon/storage/box", {
	illustration: "flashbang",
	name: "box of emp grenades",
	desc: "A box with 5 emp grenades.",
});

// boxes.dm:248
rt.def("/obj/item/weapon/storage/box/emps/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/grenade/empgrenade"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5360, "/obj/item/weapon/storage/box/trackimp", "/obj/item/weapon/storage/box", {
	illustration: "implant",
	name: "boxed tracking implant kit",
	desc: "Box full of scum-bag tracking utensils.",
});

// boxes.dm:257
rt.def("/obj/item/weapon/storage/box/trackimp/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/implantcase/tracking"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/implanter"), this);
	yield* new_(T("/obj/item/weapon/implantpad"), this);
	yield* new_(T("/obj/item/weapon/locator"), this);
	return f.dot;
}, true);

rt.type(5361, "/obj/item/weapon/storage/box/minertracker", "/obj/item/weapon/storage/box", {
	illustration: "implant",
	name: "boxed tracking implant kit",
	desc: "For finding those who have died on the accursed lavaworld.",
});

// boxes.dm:269
rt.def("/obj/item/weapon/storage/box/minertracker/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/implantcase/tracking"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/implanter"), this);
	yield* new_(T("/obj/item/weapon/implantpad"), this);
	yield* new_(T("/obj/item/weapon/locator"), this);
	return f.dot;
}, true);

rt.type(5362, "/obj/item/weapon/storage/box/chemimp", "/obj/item/weapon/storage/box", {
	illustration: "implant",
	name: "boxed chemical implant kit",
	desc: "Box of stuff used to implant chemicals.",
});

// boxes.dm:281
rt.def("/obj/item/weapon/storage/box/chemimp/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/implantcase/chem"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/implanter"), this);
	yield* new_(T("/obj/item/weapon/implantpad"), this);
	return f.dot;
}, true);

rt.type(5363, "/obj/item/weapon/storage/box/exileimp", "/obj/item/weapon/storage/box", {
	illustration: "implant",
	name: "boxed exile implant kit",
	desc: "Box of exile implants. It has a picture of a clown being booted through the Gateway.",
});

// boxes.dm:292
rt.def("/obj/item/weapon/storage/box/exileimp/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/implantcase/exile"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/implanter"), this);
	return f.dot;
}, true);

rt.type(5364, "/obj/item/weapon/storage/box/bodybags", "/obj/item/weapon/storage/box", {
	illustration: "bodybags",
	name: "body bags",
	desc: "The label indicates that it contains body bags.",
});

// boxes.dm:302
rt.def("/obj/item/weapon/storage/box/bodybags/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/bodybag"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5365, "/obj/item/weapon/storage/box/rxglasses", "/obj/item/weapon/storage/box", {
	illustration: "glasses",
	name: "box of prescription glasses",
	desc: "This box contains nerd glasses.",
});

// boxes.dm:312
rt.def("/obj/item/weapon/storage/box/rxglasses/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/glasses/regular"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5366, "/obj/item/weapon/storage/box/drinkingglasses", "/obj/item/weapon/storage/box", {
	name: "box of drinking glasses",
	desc: "It has a picture of drinking glasses on it.",
});

// boxes.dm:320
rt.def("/obj/item/weapon/storage/box/drinkingglasses/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5367, "/obj/item/weapon/storage/box/condimentbottles", "/obj/item/weapon/storage/box", {
	name: "box of condiment bottles",
	desc: "It has a large ketchup smear on it.",
});

// boxes.dm:328
rt.def("/obj/item/weapon/storage/box/condimentbottles/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/condiment"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5368, "/obj/item/weapon/storage/box/cups", "/obj/item/weapon/storage/box", {
	name: "box of paper cups",
	desc: "It has pictures of paper cups on the front.",
});

// boxes.dm:336
rt.def("/obj/item/weapon/storage/box/cups/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/sillycup"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5369, "/obj/item/weapon/storage/box/donkpockets", "/obj/item/weapon/storage/box", {
	illustration: "donk_kit",
	name: "box of donk-pockets",
	desc: "<B>Instructions:</B> <I>Heat in microwave. Product will cool if not eaten within seven minutes.</I>",
});

// boxes.dm:345
rt.def("/obj/item/weapon/storage/box/donkpockets/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/donkpocket"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5370, "/obj/item/weapon/storage/box/monkeycubes", "/obj/item/weapon/storage/box", {
	illustration: null,
	name: "monkey cube box",
	desc: "Drymate brand monkey cubes. Just add water!",
	icon_state: "monkeycubebox",
	storage_slots: 7,
	can_hold: null,
});

// boxes.dm:353
rt.def("/obj/item/weapon/storage/box/monkeycubes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"));
	return f.dot;
});

// boxes.dm:357
rt.def("/obj/item/weapon/storage/box/monkeycubes/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5371, "/obj/item/weapon/storage/box/ids", "/obj/item/weapon/storage/box", {
	illustration: "id",
	name: "box of spare IDs",
	desc: "Has so many empty IDs.",
});

// boxes.dm:366
rt.def("/obj/item/weapon/storage/box/ids/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/card/id"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5372, "/obj/item/weapon/storage/box/PDAs", "/obj/item/weapon/storage/box", {
	illustration: "pda",
	name: "spare PDAs",
	desc: "A box of spare PDA microcomputers.",
});

// boxes.dm:376
rt.def("/obj/item/weapon/storage/box/PDAs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/device/pda"), this);
	yield* new_(T("/obj/item/device/pda"), this);
	yield* new_(T("/obj/item/device/pda"), this);
	yield* new_(T("/obj/item/device/pda"), this);
	yield* new_(T("/obj/item/weapon/cartridge/head"), this);
	let newcart: Value = pick(T("/obj/item/weapon/cartridge/engineering"), T("/obj/item/weapon/cartridge/security"), T("/obj/item/weapon/cartridge/medical"), T("/obj/item/weapon/cartridge/signal/toxins"), T("/obj/item/weapon/cartridge/quartermaster"));
	yield* new_(newcart, this);
	return f.dot;
}, true);

rt.type(5373, "/obj/item/weapon/storage/box/silver_ids", "/obj/item/weapon/storage/box", {
	illustration: "id",
	name: "box of spare silver IDs",
	desc: "Shiny IDs for important people.",
});

// boxes.dm:395
rt.def("/obj/item/weapon/storage/box/silver_ids/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/card/id/silver"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5374, "/obj/item/weapon/storage/box/prisoner", "/obj/item/weapon/storage/box", {
	illustration: "id",
	name: "box of prisoner IDs",
	desc: "Take away their last shred of dignity, their name.",
});

// boxes.dm:404
rt.def("/obj/item/weapon/storage/box/prisoner/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/card/id/prisoner/one"), this);
	yield* new_(T("/obj/item/weapon/card/id/prisoner/two"), this);
	yield* new_(T("/obj/item/weapon/card/id/prisoner/three"), this);
	yield* new_(T("/obj/item/weapon/card/id/prisoner/four"), this);
	yield* new_(T("/obj/item/weapon/card/id/prisoner/five"), this);
	yield* new_(T("/obj/item/weapon/card/id/prisoner/six"), this);
	yield* new_(T("/obj/item/weapon/card/id/prisoner/seven"), this);
	return f.dot;
}, true);

rt.type(5375, "/obj/item/weapon/storage/box/seccarts", "/obj/item/weapon/storage/box", {
	illustration: "pda",
	name: "box of PDA security cartridges",
	desc: "A box full of PDA cartridges used by Security.",
});

// boxes.dm:419
rt.def("/obj/item/weapon/storage/box/seccarts/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/weapon/cartridge/detective"), this);
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/cartridge/security"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5376, "/obj/item/weapon/storage/box/firingpins", "/obj/item/weapon/storage/box", {
	illustration: "id",
	name: "box of standard firing pins",
	desc: "A box full of standard firing pins, to allow newly-developed firearms to operate.",
});

// boxes.dm:429
rt.def("/obj/item/weapon/storage/box/firingpins/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/device/firing_pin"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5377, "/obj/item/weapon/storage/box/lasertagpins", "/obj/item/weapon/storage/box", {
	illustration: "id",
	name: "box of laser tag firing pins",
	desc: "A box full of laser tag firing pins, to allow newly-developed firearms to require wearing brightly coloured plastic armor before being able to be used.",
});

// boxes.dm:438
rt.def("/obj/item/weapon/storage/box/lasertagpins/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/device/firing_pin/tag/red"), this);
		yield* new_(T("/obj/item/device/firing_pin/tag/blue"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5378, "/obj/item/weapon/storage/box/handcuffs", "/obj/item/weapon/storage/box", {
	illustration: "handcuff",
	name: "box of spare handcuffs",
	desc: "A box full of handcuffs.",
	icon_state: "secbox",
});

// boxes.dm:449
rt.def("/obj/item/weapon/storage/box/handcuffs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/restraints/handcuffs"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5379, "/obj/item/weapon/storage/box/zipties", "/obj/item/weapon/storage/box", {
	illustration: "handcuff",
	name: "box of spare zipties",
	desc: "A box full of zipties.",
	icon_state: "secbox",
});

// boxes.dm:459
rt.def("/obj/item/weapon/storage/box/zipties/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/restraints/handcuffs/cable/zipties"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5380, "/obj/item/weapon/storage/box/alienhandcuffs", "/obj/item/weapon/storage/box", {
	illustration: "handcuff",
	name: "box of spare handcuffs",
	desc: "A box full of handcuffs.",
	icon_state: "alienbox",
});

// boxes.dm:469
rt.def("/obj/item/weapon/storage/box/alienhandcuffs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/restraints/handcuffs/alien"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5381, "/obj/item/weapon/storage/box/fakesyndiesuit", "/obj/item/weapon/storage/box", {
	name: "boxed space suit and helmet",
	desc: "A sleek, sturdy box used to hold replica spacesuits.",
	icon_state: "syndiebox",
});

// boxes.dm:478
rt.def("/obj/item/weapon/storage/box/fakesyndiesuit/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/head/syndicatefake"), this);
	yield* new_(T("/obj/item/clothing/suit/syndicatefake"), this);
	return f.dot;
}, true);

rt.type(5382, "/obj/item/weapon/storage/box/mousetraps", "/obj/item/weapon/storage/box", {
	illustration: "mousetraps",
	name: "box of Pest-B-Gon mousetraps",
	desc: "<span class='alert'>Keep out of reach of children.</span>",
});

// boxes.dm:487
rt.def("/obj/item/weapon/storage/box/mousetraps/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/device/assembly/mousetrap"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5383, "/obj/item/weapon/storage/box/pillbottles", "/obj/item/weapon/storage/box", {
	illustration: "pillbox",
	name: "box of pill bottles",
	desc: "It has pictures of pill bottles on its front.",
});

// boxes.dm:496
rt.def("/obj/item/weapon/storage/box/pillbottles/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/storage/pill_bottle"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5384, "/obj/item/weapon/storage/box/snappops", "/obj/item/weapon/storage/box", {
	name: "snap pop box",
	desc: "Eight wrappers of fun! Ages 8 and up. Not suitable for children.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "spbox",
	storage_slots: 8,
	can_hold: null,
});

// boxes.dm:505
rt.def("/obj/item/weapon/storage/box/snappops/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/toy/snappop"));
	return f.dot;
});

// boxes.dm:508
rt.def("/obj/item/weapon/storage/box/snappops/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, this.storage_slots, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/toy/snappop"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5385, "/obj/item/weapon/storage/box/matches", "/obj/item/weapon/storage/box", {
	name: "matchbox",
	desc: "A small box of Almost But Not Quite Plasma Premium Matches.",
	icon: rt.rsc("icons/obj/cigarettes.dmi"),
	icon_state: "matchbox",
	item_state: "zippo",
	storage_slots: 10,
	w_class: 1,
	slot_flags: 512,
	can_hold: null,
});

// boxes.dm:520
rt.def("/obj/item/weapon/storage/box/matches/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/match"));
	return f.dot;
});

// boxes.dm:523
rt.def("/obj/item/weapon/storage/box/matches/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, this.storage_slots, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/match"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// boxes.dm:527
rt.def("/obj/item/weapon/storage/box/matches/proc/attackby", function attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (!rt.istype(W, T("/obj/item/weapon/match"))) return f.dot;
	W.matchignite();
	return f.dot;
});

rt.type(5386, "/obj/item/weapon/storage/box/lights", "/obj/item/weapon/storage/box", {
	illustration: "light",
	name: "box of replacement bulbs",
	icon: rt.rsc("icons/obj/storage.dmi"),
	desc: "This box is shaped on the inside so that only light tubes and bulbs fit.",
	item_state: "syringe_kit",
	foldable: rt.typePath("/obj/item/stack/sheet/cardboard"),
	storage_slots: 21,
	max_combined_w_class: 21,
	use_to_pickup: 1,
	can_hold: null,
});

// boxes.dm:538
rt.def("/obj/item/weapon/storage/box/lights/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/light/tube"), T("/obj/item/weapon/light/bulb"));
	return f.dot;
});

rt.type(5387, "/obj/item/weapon/storage/box/lights/bulbs", "/obj/item/weapon/storage/box/lights", {});

// boxes.dm:543
rt.def("/obj/item/weapon/storage/box/lights/bulbs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 21, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/light/bulb"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5388, "/obj/item/weapon/storage/box/lights/tubes", "/obj/item/weapon/storage/box/lights", {
	illustration: "lighttube",
	name: "box of replacement tubes",
});

// boxes.dm:551
rt.def("/obj/item/weapon/storage/box/lights/tubes/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 21, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/light/tube"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5389, "/obj/item/weapon/storage/box/lights/mixed", "/obj/item/weapon/storage/box/lights", {
	illustration: "lightmixed",
	name: "box of replacement lights",
});

// boxes.dm:559
rt.def("/obj/item/weapon/storage/box/lights/mixed/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 14, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/light/tube"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/light/bulb"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5390, "/obj/item/weapon/storage/box/deputy", "/obj/item/weapon/storage/box", {
	name: "box of deputy armbands",
	desc: "To be issued to those authorized to act as deputy of security.",
});

// boxes.dm:570
rt.def("/obj/item/weapon/storage/box/deputy/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/accessory/armband/deputy"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5391, "/obj/item/weapon/storage/box/metalfoam", "/obj/item/weapon/storage/box", {
	illustration: "flashbang",
	name: "box of metal foam grenades",
	desc: "To be used to rapidly seal hull breaches.",
});

// boxes.dm:579
rt.def("/obj/item/weapon/storage/box/metalfoam/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/grenade/chem_grenade/metalfoam"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5392, "/obj/item/weapon/storage/box/hug", "/obj/item/weapon/storage/box", {
	illustration: "heart",
	name: "box of hugs",
	desc: "A special box for sensitive people.",
	icon_state: "hugbox",
	foldable: null,
});

// boxes.dm:590
rt.def("/obj/item/weapon/storage/box/hug/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} clamps the box of hugs on ${user.p_their()} jugular! Guess it wasn't such a hugbox after all..</span>`);
	return 1;
});

// boxes.dm:594
rt.def("/obj/item/weapon/storage/box/hug/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* parent_proc();
	user.changeNext_move(8);
	playsound(this.loc, "rustle", 50, 1, -5);
	user.visible_message(fmt("<span class='notice'>＀ hugs ％！.</span>", [user, this]), fmt("<span class='notice'>You hug ％！.</span>", [this]));
	return f.dot;
}, true);

rt.type(5393, "/obj/item/weapon/storage/box/hug/medical", "/obj/item/weapon/storage/box/hug", {});

// boxes.dm:600
rt.def("/obj/item/weapon/storage/box/hug/medical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/stack/medical/bruise_pack"), this);
	yield* new_(T("/obj/item/stack/medical/ointment"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/medipen"), this);
	return f.dot;
}, true);

rt.type(5394, "/obj/item/weapon/storage/box/hug/survival", "/obj/item/weapon/storage/box/hug", {});

// boxes.dm:605
rt.def("/obj/item/weapon/storage/box/hug/survival/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/mask/breath"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/medipen"), this);
	return f.dot;
}, true);

rt.type(5396, "/obj/item/weapon/storage/box/rubbershot", "/obj/item/weapon/storage/box", {
	illustration: null,
	name: "box of rubber shots",
	desc: "A box full of rubber shots, designed for riot shotguns.",
	icon_state: "rubbershot_box",
});

// boxes.dm:616
rt.def("/obj/item/weapon/storage/box/rubbershot/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/ammo_casing/shotgun/rubbershot"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5397, "/obj/item/weapon/storage/box/lethalshot", "/obj/item/weapon/storage/box", {
	illustration: null,
	name: "box of lethal shotgun shots",
	desc: "A box full of lethal shots, designed for riot shotguns.",
	icon_state: "lethalshot_box",
});

// boxes.dm:626
rt.def("/obj/item/weapon/storage/box/lethalshot/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/ammo_casing/shotgun/buckshot"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5398, "/obj/item/weapon/storage/box/beanbag", "/obj/item/weapon/storage/box", {
	illustration: null,
	name: "box of beanbags",
	desc: "A box full of beanbag shells.",
	icon_state: "rubbershot_box",
});

// boxes.dm:636
rt.def("/obj/item/weapon/storage/box/beanbag/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/ammo_casing/shotgun/beanbag"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5399, "/obj/item/weapon/storage/box/actionfigure", "/obj/item/weapon/storage/box", {
	name: "box of action figures",
	desc: "The latest set of collectable action figures.",
	icon_state: "box",
});

// boxes.dm:645
rt.def("/obj/item/weapon/storage/box/actionfigure/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null, randomFigure: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		randomFigure = pick(typesof(T("/obj/item/toy/figure")) - T("/obj/item/toy/figure"));
		yield* new_(randomFigure, this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5400, "/obj/item/weapon/storage/box/papersack", "/obj/item/weapon/storage/box", {
	design: "None",
	name: "paper sack",
	desc: "A sack neatly crafted out of paper.",
	icon_state: "paperbag_None",
	item_state: "paperbag_None",
	resistance_flags: 4,
	foldable: null,
});

// boxes.dm:665
rt.def("/obj/item/weapon/storage/box/papersack/proc/update_icon", function update_icon(f: Frame) {
	if (rt.len(f, this.contents) == 0) {
		this.icon_state = `${this.item_state}`;
	} else {
		this.icon_state = `${this.item_state}_closed`;
	}
	return f.dot;
});

// boxes.dm:670
rt.def("/obj/item/weapon/storage/box/papersack/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let designs: Value = null, switchDesign: Value = null, choice: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/pen"))) {
		if (rt.len(f, this.contents)) {
			to_chat(user, `<span class='warning'>You can't modify this ${this} with items still inside!</span>`);
			return f.dot;
		}
		designs = list("None", "NanotrasenStandard", "SyndiSnacks", "Heart", "SmileyFace", "Cancel");
		switchDesign = (yield* g.op(f, "Prompt", [0], [null, rt.index(designs, 1), "Paper Sack Design", "Select a Design:", designs]));
		if (get_dist(f.usr, this) > 1) {
			to_chat(f.usr, "<span class='warning'>You have moved too far away!</span>");
			return f.dot;
		}
		choice = designs.Find(switchDesign);
		if (this.design == rt.index(designs, choice) || rt.index(designs, choice) == "Cancel") {
			return 0;
		}
		to_chat(f.usr, `<span class='notice'>You make some modifications to the ${this} using your pen.</span>`);
		this.design = rt.index(designs, choice);
		this.icon_state = `paperbag_${this.design}`;
		this.item_state = `paperbag_${this.design}`;
		const item = rt.index(designs, choice);
		if (item === "None") {
			this.desc = "A sack neatly crafted out of paper.";
		} else if (item === "NanotrasenStandard") {
			this.desc = "A standard Nanotrasen paper lunch sack for loyal employees on the go.";
		} else if (item === "SyndiSnacks") {
			this.desc = "The design on this paper sack is a remnant of the notorious 'SyndieSnacks' program.";
		} else if (item === "Heart") {
			this.desc = "A paper sack with a heart etched onto the side.";
		} else if (item === "SmileyFace") {
			this.desc = "A paper sack with a crude smile etched onto the side.";
		}
		return 0;
	} else if (W.is_sharp()) {
		if (!rt.len(f, this.contents)) {
			if (this.item_state == "paperbag_None") {
				user.show_message(`<span class='notice'>You cut eyeholes into the ${this}.</span>`, 1);
				yield* new_(T("/obj/item/clothing/head/papersack"), user.loc);
				yield* qdel(this);
				return 0;
			} else if (this.item_state == "paperbag_SmileyFace") {
				user.show_message(`<span class='notice'>You cut eyeholes into the ${this} and modify the design.</span>`, 1);
				yield* new_(T("/obj/item/clothing/head/papersack/smiley"), user.loc);
				yield* qdel(this);
				return 0;
			}
		}
	}
	return (yield* parent_proc());
}, true);

rt.type(5401, "/obj/item/weapon/storage/box/ingredients", "/obj/item/weapon/storage/box", {
	illustration: "donk_kit",
	name: "ingredients box",
	item_state: null,
});

// boxes.dm:725
rt.def("/obj/item/weapon/storage/box/ingredients/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (!this.item_state) return f.dot;
	this.name = `${this.name} (${this.item_state})`;
	this.desc = `A box containing supplementary ingredients for the aspiring chef. This box's theme is '${this.item_state}'.`;
	return f.dot;
}, true);

rt.type(5402, "/obj/item/weapon/storage/box/ingredients/wildcard", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "wildcard",
});

// boxes.dm:734
rt.def("/obj/item/weapon/storage/box/ingredients/wildcard/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null, randomFood: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		randomFood = pick(T("/obj/item/weapon/reagent_containers/food/snacks/grown/chili"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/sweet"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/cherries"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/plumphelmet"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/chanterelle"));
		yield* new_(randomFood, this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5403, "/obj/item/weapon/storage/box/ingredients/fiesta", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "fiesta",
});

// boxes.dm:755
rt.def("/obj/item/weapon/storage/box/ingredients/fiesta/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/tortilla"), this);
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/chili"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5404, "/obj/item/weapon/storage/box/ingredients/italian", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "italian",
});

// boxes.dm:765
rt.def("/obj/item/weapon/storage/box/ingredients/italian/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/bottle/wine"), this);
	return f.dot;
}, true);

rt.type(5405, "/obj/item/weapon/storage/box/ingredients/vegetarian", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "vegetarian",
});

// boxes.dm:774
rt.def("/obj/item/weapon/storage/box/ingredients/vegetarian/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/eggplant"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), this);
	return f.dot;
}, true);

rt.type(5406, "/obj/item/weapon/storage/box/ingredients/american", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "american",
});

// boxes.dm:786
rt.def("/obj/item/weapon/storage/box/ingredients/american/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), this);
	return f.dot;
}, true);

rt.type(5407, "/obj/item/weapon/storage/box/ingredients/fruity", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "fruity",
});

// boxes.dm:796
rt.def("/obj/item/weapon/storage/box/ingredients/fruity/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/orange"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/lemon"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/lime"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/watermelon"), this);
	return f.dot;
}, true);

rt.type(5408, "/obj/item/weapon/storage/box/ingredients/sweets", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "sweets",
});

// boxes.dm:807
rt.def("/obj/item/weapon/storage/box/ingredients/sweets/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/cherries"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/cocoapod"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), this);
	return f.dot;
}, true);

rt.type(5409, "/obj/item/weapon/storage/box/ingredients/delights", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "delights",
});

// boxes.dm:818
rt.def("/obj/item/weapon/storage/box/ingredients/delights/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/sweet"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/bluecherries"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/vanillapod"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/cocoapod"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), this);
	return f.dot;
}, true);

rt.type(5410, "/obj/item/weapon/storage/box/ingredients/grains", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "grains",
});

// boxes.dm:829
rt.def("/obj/item/weapon/storage/box/ingredients/grains/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/oat"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/wheat"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/cocoapod"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/honeycomb"), this);
	yield* new_(T("/obj/item/seeds/poppy"), this);
	return f.dot;
}, true);

rt.type(5411, "/obj/item/weapon/storage/box/ingredients/carnivore", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "carnivore",
});

// boxes.dm:840
rt.def("/obj/item/weapon/storage/box/ingredients/carnivore/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/bear"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/spider"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/spidereggs"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/carpmeat"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), this);
	return f.dot;
}, true);

rt.type(5412, "/obj/item/weapon/storage/box/ingredients/exotic", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "exotic",
});

// boxes.dm:852
rt.def("/obj/item/weapon/storage/box/ingredients/exotic/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/carpmeat"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/chili"), this);
	return f.dot;
}, true);

rt.type(5413, "/obj/item/weapon/storage/box/emptysandbags", "/obj/item/weapon/storage/box", {
	name: "box of empty sandbags",
});

// boxes.dm:862
rt.def("/obj/item/weapon/storage/box/emptysandbags/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/emptysandbag"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5414, "/obj/item/weapon/storage/box/rndboards", "/obj/item/weapon/storage/box", {
	name: "０the liberator's legacy",
	desc: "A box containing a gift for worthy golems.",
});

// boxes.dm:870
rt.def("/obj/item/weapon/storage/box/rndboards/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/circuitboard/machine/protolathe"), this);
	yield* new_(T("/obj/item/weapon/circuitboard/machine/destructive_analyzer"), this);
	yield* new_(T("/obj/item/weapon/circuitboard/machine/circuit_imprinter"), this);
	yield* new_(T("/obj/item/weapon/circuitboard/computer/rdconsole"), this);
	return f.dot;
}, true);

rt.type(5415, "/obj/item/weapon/storage/box/silver_sulf", "/obj/item/weapon/storage/box", {
	name: "box of silver sulfadiazine patches",
	desc: "Contains patches used to treat burns.",
});

// boxes.dm:880
rt.def("/obj/item/weapon/storage/box/silver_sulf/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5416, "/obj/item/weapon/storage/box/fountainpens", "/obj/item/weapon/storage/box", {
	name: "box of fountain pens",
});

// boxes.dm:888
rt.def("/obj/item/weapon/storage/box/fountainpens/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/pen/fountain"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
