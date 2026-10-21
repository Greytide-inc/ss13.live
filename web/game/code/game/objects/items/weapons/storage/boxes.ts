// From code/game/objects/items/weapons/storage/boxes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5332, "/obj/item/weapon/storage/box", "/obj/item/weapon/storage", {
	illustration: "writing",
	foldable: rt.typePath("/obj/item/stack/sheet/cardboard"),
	name: "box",
	desc: "It's just an ordinary box.",
	icon_state: "box",
	item_state: "syringe_kit",
	resistance_flags: 4,
});

// /obj/item/weapon/storage/box/proc/Initialize  (code/game/objects/items/weapons/storage/boxes.dm:34)  may sleep
rt.def("/obj/item/weapon/storage/box/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/weapon/storage/box/proc/update_icon  (code/game/objects/items/weapons/storage/boxes.dm:38)
rt.def("/obj/item/weapon/storage/box/proc/update_icon", function update_icon(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "illustration"))) return f.dot;
	rt.callSrc(f, "cut_overlays", []);
	rt.callSrc(f, "add_overlay", [rt.sv(f, "illustration")]);
	return f.dot;
});

// /obj/item/weapon/storage/box/proc/attack_self  (code/game/objects/items/weapons/storage/boxes.dm:44)  may sleep
rt.def("/obj/item/weapon/storage/box/proc/attack_self", function* attack_self(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "foldable"))) {
		return live(f.dot);
	}
	if (truthy(rt.len(f, rt.sv(f, "contents")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't fold this box with items still inside!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "foldable")])))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "close_all");
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You fold ＀ flat.</span>", [live(f.src)])]);
	I = (yield* g.new_(f, rt.sv(f, "foldable"), [rt.getStep(f, live(f.src), 0)]));
	yield* g.callName(f, live(f.args[0]), "drop_item", []);
	yield* g.callName(f, live(f.args[0]), "put_in_hands", [live(I)]);
	yield* g.callName(f, live(f.args[0]), "update_inv_hands", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/storage/box/proc/attackby  (code/game/objects/items/weapons/storage/boxes.dm:65)  may sleep
rt.def("/obj/item/weapon/storage/box/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/packageWrap")) ? 1 : 0))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

rt.type(5338, "/obj/item/weapon/storage/box/disks", "/obj/item/weapon/storage/box", {
	illustration: "disk_kit",
	name: "diskette box",
});

// /obj/item/weapon/storage/box/disks/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:76)  may sleep
rt.def("/obj/item/weapon/storage/box/disks/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/disk/data"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5339, "/obj/item/weapon/storage/box/disks_plantgene", "/obj/item/weapon/storage/box", {
	illustration: "disk_kit",
	name: "plant data disks box",
});

// /obj/item/weapon/storage/box/disks_plantgene/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:85)  may sleep
rt.def("/obj/item/weapon/storage/box/disks_plantgene/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/disk/plantgene"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5340, "/obj/item/weapon/storage/box/survival", "/obj/item/weapon/storage/box", {});

// /obj/item/weapon/storage/box/survival/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:90)  may sleep
rt.def("/obj/item/weapon/storage/box/survival/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/mask/breath"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/medipen"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5341, "/obj/item/weapon/storage/box/survival/radio", "/obj/item/weapon/storage/box/survival", {});

// /obj/item/weapon/storage/box/survival/radio/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:95)  may sleep
rt.def("/obj/item/weapon/storage/box/survival/radio/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/device/radio/off"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5342, "/obj/item/weapon/storage/box/survival_mining", "/obj/item/weapon/storage/box", {});

// /obj/item/weapon/storage/box/survival_mining/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:99)  may sleep
rt.def("/obj/item/weapon/storage/box/survival_mining/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/mask/gas/explorer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen/engi"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/medipen"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5343, "/obj/item/weapon/storage/box/engineer", "/obj/item/weapon/storage/box", {});

// /obj/item/weapon/storage/box/engineer/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:107)  may sleep
rt.def("/obj/item/weapon/storage/box/engineer/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/mask/breath"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen/engi"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/medipen"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5344, "/obj/item/weapon/storage/box/engineer/radio", "/obj/item/weapon/storage/box/engineer", {});

// /obj/item/weapon/storage/box/engineer/radio/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:112)  may sleep
rt.def("/obj/item/weapon/storage/box/engineer/radio/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/device/radio/off"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5345, "/obj/item/weapon/storage/box/syndie", "/obj/item/weapon/storage/box", {});

// /obj/item/weapon/storage/box/syndie/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:117)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/mask/gas/syndicate"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen/engi"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5346, "/obj/item/weapon/storage/box/security", "/obj/item/weapon/storage/box", {});

// /obj/item/weapon/storage/box/security/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:122)  may sleep
rt.def("/obj/item/weapon/storage/box/security/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/mask/gas/sechailer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/medipen"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5347, "/obj/item/weapon/storage/box/security/radio", "/obj/item/weapon/storage/box/security", {});

// /obj/item/weapon/storage/box/security/radio/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:127)  may sleep
rt.def("/obj/item/weapon/storage/box/security/radio/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/device/radio/off"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5348, "/obj/item/weapon/storage/box/gloves", "/obj/item/weapon/storage/box", {
	illustration: "latex",
	name: "box of latex gloves",
	desc: "Contains sterile latex gloves.",
});

// /obj/item/weapon/storage/box/gloves/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:136)  may sleep
rt.def("/obj/item/weapon/storage/box/gloves/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/gloves/color/latex"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5349, "/obj/item/weapon/storage/box/masks", "/obj/item/weapon/storage/box", {
	illustration: "sterile",
	name: "box of sterile masks",
	desc: "This box contains sterile medical masks.",
});

// /obj/item/weapon/storage/box/masks/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:145)  may sleep
rt.def("/obj/item/weapon/storage/box/masks/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/mask/surgical"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5350, "/obj/item/weapon/storage/box/syringes", "/obj/item/weapon/storage/box", {
	illustration: "syringe",
	name: "box of syringes",
	desc: "A box full of syringes.",
});

// /obj/item/weapon/storage/box/syringes/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:154)  may sleep
rt.def("/obj/item/weapon/storage/box/syringes/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/syringe"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5351, "/obj/item/weapon/storage/box/medipens", "/obj/item/weapon/storage/box", {
	illustration: "syringe",
	name: "box of medipens",
	desc: "A box full of epinephrine MediPens.",
});

// /obj/item/weapon/storage/box/medipens/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:163)  may sleep
rt.def("/obj/item/weapon/storage/box/medipens/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/medipen"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5352, "/obj/item/weapon/storage/box/medipens/utility", "/obj/item/weapon/storage/box/medipens", {
	illustration: "syringe",
	name: "stimpack value kit",
	desc: "A box with several stimpack medipens for the economical miner.",
});

// /obj/item/weapon/storage/box/medipens/utility/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:172)  may sleep
rt.def("/obj/item/weapon/storage/box/medipens/utility/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/medipen/stimpack"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5353, "/obj/item/weapon/storage/box/beakers", "/obj/item/weapon/storage/box", {
	illustration: "beaker",
	name: "box of beakers",
});

// /obj/item/weapon/storage/box/beakers/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:181)  may sleep
rt.def("/obj/item/weapon/storage/box/beakers/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5354, "/obj/item/weapon/storage/box/injectors", "/obj/item/weapon/storage/box", {
	name: "box of DNA injectors",
	desc: "This box contains injectors, it seems.",
});

// /obj/item/weapon/storage/box/injectors/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:189)  may sleep
rt.def("/obj/item/weapon/storage/box/injectors/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/dnainjector/h2m"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/dnainjector/m2h"), [live(f.src)]);
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

// /obj/item/weapon/storage/box/flashbangs/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:201)  may sleep
rt.def("/obj/item/weapon/storage/box/flashbangs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/grenade/flashbang"), [live(f.src)]);
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

// /obj/item/weapon/storage/box/flashes/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:211)  may sleep
rt.def("/obj/item/weapon/storage/box/flashes/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/device/assembly/flash/handheld"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5357, "/obj/item/weapon/storage/box/wall_flash", "/obj/item/weapon/storage/box", {
	illustration: "flashbang",
	name: "wall-mounted flash kit",
	desc: "This box contains everything necessary to build a wall-mounted flash. <B>WARNING: Flashes can cause serious eye damage, protective eyewear is required.</B>",
});

// /obj/item/weapon/storage/box/wall_flash/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:220)  may sleep
rt.def("/obj/item/weapon/storage/box/wall_flash/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let id: Value = null, remote: Value = null, frame: Value = null;
	f.vars = () => [id, remote, frame];
	id = (yield* g.call(f, P("/proc/rand"), null, [1000, 9999]));
	yield* g.new_(f, T("/obj/item/wallframe/button"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/electronics/airlock"), [live(f.src)]);
	rt.setFv(f, "id", (remote = (yield* g.new_(f, T("/obj/item/device/assembly/control/flasher"), [live(f.src)]))), live(id));
	rt.setFv(f, "id", (frame = (yield* g.new_(f, T("/obj/item/wallframe/flasher"), [live(f.src)]))), live(id));
	yield* g.new_(f, T("/obj/item/device/assembly/flash/handheld"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/screwdriver"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5358, "/obj/item/weapon/storage/box/teargas", "/obj/item/weapon/storage/box", {
	illustration: "flashbang",
	name: "box of tear gas grenades (WARNING)",
	desc: "<B>WARNING: These devices are extremely dangerous and can cause blindness and skin irritation.</B>",
});

// /obj/item/weapon/storage/box/teargas/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:239)  may sleep
rt.def("/obj/item/weapon/storage/box/teargas/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/grenade/chem_grenade/teargas"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5359, "/obj/item/weapon/storage/box/emps", "/obj/item/weapon/storage/box", {
	illustration: "flashbang",
	name: "box of emp grenades",
	desc: "A box with 5 emp grenades.",
});

// /obj/item/weapon/storage/box/emps/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:248)  may sleep
rt.def("/obj/item/weapon/storage/box/emps/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/grenade/empgrenade"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5360, "/obj/item/weapon/storage/box/trackimp", "/obj/item/weapon/storage/box", {
	illustration: "implant",
	name: "boxed tracking implant kit",
	desc: "Box full of scum-bag tracking utensils.",
});

// /obj/item/weapon/storage/box/trackimp/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:257)  may sleep
rt.def("/obj/item/weapon/storage/box/trackimp/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/implantcase/tracking"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/implanter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/implantpad"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/locator"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5361, "/obj/item/weapon/storage/box/minertracker", "/obj/item/weapon/storage/box", {
	illustration: "implant",
	name: "boxed tracking implant kit",
	desc: "For finding those who have died on the accursed lavaworld.",
});

// /obj/item/weapon/storage/box/minertracker/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:269)  may sleep
rt.def("/obj/item/weapon/storage/box/minertracker/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/implantcase/tracking"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/implanter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/implantpad"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/locator"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5362, "/obj/item/weapon/storage/box/chemimp", "/obj/item/weapon/storage/box", {
	illustration: "implant",
	name: "boxed chemical implant kit",
	desc: "Box of stuff used to implant chemicals.",
});

// /obj/item/weapon/storage/box/chemimp/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:281)  may sleep
rt.def("/obj/item/weapon/storage/box/chemimp/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/implantcase/chem"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/implanter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/implantpad"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5363, "/obj/item/weapon/storage/box/exileimp", "/obj/item/weapon/storage/box", {
	illustration: "implant",
	name: "boxed exile implant kit",
	desc: "Box of exile implants. It has a picture of a clown being booted through the Gateway.",
});

// /obj/item/weapon/storage/box/exileimp/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:292)  may sleep
rt.def("/obj/item/weapon/storage/box/exileimp/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/implantcase/exile"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/implanter"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5364, "/obj/item/weapon/storage/box/bodybags", "/obj/item/weapon/storage/box", {
	illustration: "bodybags",
	name: "body bags",
	desc: "The label indicates that it contains body bags.",
});

// /obj/item/weapon/storage/box/bodybags/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:302)  may sleep
rt.def("/obj/item/weapon/storage/box/bodybags/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/bodybag"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5365, "/obj/item/weapon/storage/box/rxglasses", "/obj/item/weapon/storage/box", {
	illustration: "glasses",
	name: "box of prescription glasses",
	desc: "This box contains nerd glasses.",
});

// /obj/item/weapon/storage/box/rxglasses/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:312)  may sleep
rt.def("/obj/item/weapon/storage/box/rxglasses/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/glasses/regular"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5366, "/obj/item/weapon/storage/box/drinkingglasses", "/obj/item/weapon/storage/box", {
	name: "box of drinking glasses",
	desc: "It has a picture of drinking glasses on it.",
});

// /obj/item/weapon/storage/box/drinkingglasses/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:320)  may sleep
rt.def("/obj/item/weapon/storage/box/drinkingglasses/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5367, "/obj/item/weapon/storage/box/condimentbottles", "/obj/item/weapon/storage/box", {
	name: "box of condiment bottles",
	desc: "It has a large ketchup smear on it.",
});

// /obj/item/weapon/storage/box/condimentbottles/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:328)  may sleep
rt.def("/obj/item/weapon/storage/box/condimentbottles/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/condiment"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5368, "/obj/item/weapon/storage/box/cups", "/obj/item/weapon/storage/box", {
	name: "box of paper cups",
	desc: "It has pictures of paper cups on the front.",
});

// /obj/item/weapon/storage/box/cups/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:336)  may sleep
rt.def("/obj/item/weapon/storage/box/cups/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/sillycup"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5369, "/obj/item/weapon/storage/box/donkpockets", "/obj/item/weapon/storage/box", {
	illustration: "donk_kit",
	name: "box of donk-pockets",
	desc: "<B>Instructions:</B> <I>Heat in microwave. Product will cool if not eaten within seven minutes.</I>",
});

// /obj/item/weapon/storage/box/donkpockets/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:345)  may sleep
rt.def("/obj/item/weapon/storage/box/donkpockets/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/donkpocket"), [live(f.src)]);
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

// /obj/item/weapon/storage/box/monkeycubes/proc/<init>  (code/game/objects/items/weapons/storage/boxes.dm:353)
rt.def("/obj/item/weapon/storage/box/monkeycubes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube")));
	return f.dot;
});

// /obj/item/weapon/storage/box/monkeycubes/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:357)  may sleep
rt.def("/obj/item/weapon/storage/box/monkeycubes/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5371, "/obj/item/weapon/storage/box/ids", "/obj/item/weapon/storage/box", {
	illustration: "id",
	name: "box of spare IDs",
	desc: "Has so many empty IDs.",
});

// /obj/item/weapon/storage/box/ids/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:366)  may sleep
rt.def("/obj/item/weapon/storage/box/ids/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/card/id"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5372, "/obj/item/weapon/storage/box/PDAs", "/obj/item/weapon/storage/box", {
	illustration: "pda",
	name: "spare PDAs",
	desc: "A box of spare PDA microcomputers.",
});

// /obj/item/weapon/storage/box/PDAs/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:376)  may sleep
rt.def("/obj/item/weapon/storage/box/PDAs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let newcart: Value = null;
	f.vars = () => [newcart];
	yield* g.new_(f, T("/obj/item/device/pda"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/pda"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/pda"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/pda"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/cartridge/head"), [live(f.src)]);
	newcart = rt.op(f, "PickUnweighted", [5], [T("/obj/item/weapon/cartridge/engineering"), T("/obj/item/weapon/cartridge/security"), T("/obj/item/weapon/cartridge/medical"), T("/obj/item/weapon/cartridge/signal/toxins"), T("/obj/item/weapon/cartridge/quartermaster")]);
	yield* g.new_(f, live(newcart), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5373, "/obj/item/weapon/storage/box/silver_ids", "/obj/item/weapon/storage/box", {
	illustration: "id",
	name: "box of spare silver IDs",
	desc: "Shiny IDs for important people.",
});

// /obj/item/weapon/storage/box/silver_ids/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:395)  may sleep
rt.def("/obj/item/weapon/storage/box/silver_ids/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/card/id/silver"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5374, "/obj/item/weapon/storage/box/prisoner", "/obj/item/weapon/storage/box", {
	illustration: "id",
	name: "box of prisoner IDs",
	desc: "Take away their last shred of dignity, their name.",
});

// /obj/item/weapon/storage/box/prisoner/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:404)  may sleep
rt.def("/obj/item/weapon/storage/box/prisoner/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/card/id/prisoner/one"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/card/id/prisoner/two"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/card/id/prisoner/three"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/card/id/prisoner/four"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/card/id/prisoner/five"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/card/id/prisoner/six"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/card/id/prisoner/seven"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5375, "/obj/item/weapon/storage/box/seccarts", "/obj/item/weapon/storage/box", {
	illustration: "pda",
	name: "box of PDA security cartridges",
	desc: "A box full of PDA cartridges used by Security.",
});

// /obj/item/weapon/storage/box/seccarts/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:419)  may sleep
rt.def("/obj/item/weapon/storage/box/seccarts/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.new_(f, T("/obj/item/weapon/cartridge/detective"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/cartridge/security"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5376, "/obj/item/weapon/storage/box/firingpins", "/obj/item/weapon/storage/box", {
	illustration: "id",
	name: "box of standard firing pins",
	desc: "A box full of standard firing pins, to allow newly-developed firearms to operate.",
});

// /obj/item/weapon/storage/box/firingpins/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:429)  may sleep
rt.def("/obj/item/weapon/storage/box/firingpins/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/device/firing_pin"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5377, "/obj/item/weapon/storage/box/lasertagpins", "/obj/item/weapon/storage/box", {
	illustration: "id",
	name: "box of laser tag firing pins",
	desc: "A box full of laser tag firing pins, to allow newly-developed firearms to require wearing brightly coloured plastic armor before being able to be used.",
});

// /obj/item/weapon/storage/box/lasertagpins/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:438)  may sleep
rt.def("/obj/item/weapon/storage/box/lasertagpins/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/device/firing_pin/tag/red"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/firing_pin/tag/blue"), [live(f.src)]);
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

// /obj/item/weapon/storage/box/handcuffs/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:449)  may sleep
rt.def("/obj/item/weapon/storage/box/handcuffs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs"), [live(f.src)]);
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

// /obj/item/weapon/storage/box/zipties/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:459)  may sleep
rt.def("/obj/item/weapon/storage/box/zipties/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs/cable/zipties"), [live(f.src)]);
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

// /obj/item/weapon/storage/box/alienhandcuffs/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:469)  may sleep
rt.def("/obj/item/weapon/storage/box/alienhandcuffs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs/alien"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5381, "/obj/item/weapon/storage/box/fakesyndiesuit", "/obj/item/weapon/storage/box", {
	name: "boxed space suit and helmet",
	desc: "A sleek, sturdy box used to hold replica spacesuits.",
	icon_state: "syndiebox",
});

// /obj/item/weapon/storage/box/fakesyndiesuit/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:478)  may sleep
rt.def("/obj/item/weapon/storage/box/fakesyndiesuit/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/head/syndicatefake"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/syndicatefake"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5382, "/obj/item/weapon/storage/box/mousetraps", "/obj/item/weapon/storage/box", {
	illustration: "mousetraps",
	name: "box of Pest-B-Gon mousetraps",
	desc: "<span class='alert'>Keep out of reach of children.</span>",
});

// /obj/item/weapon/storage/box/mousetraps/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:487)  may sleep
rt.def("/obj/item/weapon/storage/box/mousetraps/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/device/assembly/mousetrap"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5383, "/obj/item/weapon/storage/box/pillbottles", "/obj/item/weapon/storage/box", {
	illustration: "pillbox",
	name: "box of pill bottles",
	desc: "It has pictures of pill bottles on its front.",
});

// /obj/item/weapon/storage/box/pillbottles/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:496)  may sleep
rt.def("/obj/item/weapon/storage/box/pillbottles/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/storage/pill_bottle"), [live(f.src)]);
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

// /obj/item/weapon/storage/box/snappops/proc/<init>  (code/game/objects/items/weapons/storage/boxes.dm:505)
rt.def("/obj/item/weapon/storage/box/snappops/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/toy/snappop")));
	return f.dot;
});

// /obj/item/weapon/storage/box/snappops/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:508)  may sleep
rt.def("/obj/item/weapon/storage/box/snappops/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "storage_slots"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/toy/snappop"), [live(f.src)]);
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

// /obj/item/weapon/storage/box/matches/proc/<init>  (code/game/objects/items/weapons/storage/boxes.dm:520)
rt.def("/obj/item/weapon/storage/box/matches/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/match")));
	return f.dot;
});

// /obj/item/weapon/storage/box/matches/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:523)  may sleep
rt.def("/obj/item/weapon/storage/box/matches/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "storage_slots"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/match"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/storage/box/matches/proc/attackby  (code/game/objects/items/weapons/storage/boxes.dm:527)
rt.def("/obj/item/weapon/storage/box/matches/proc/attackby", function attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (!truthy((rt.istype(live(W), T("/obj/item/weapon/match")) ? 1 : 0))) return f.dot;
	rt.callName(f, live(W), "matchignite", []);
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

// /obj/item/weapon/storage/box/lights/proc/<init>  (code/game/objects/items/weapons/storage/boxes.dm:538)
rt.def("/obj/item/weapon/storage/box/lights/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/light/tube"), T("/obj/item/weapon/light/bulb")));
	return f.dot;
});

rt.type(5387, "/obj/item/weapon/storage/box/lights/bulbs", "/obj/item/weapon/storage/box/lights", {});

// /obj/item/weapon/storage/box/lights/bulbs/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:543)  may sleep
rt.def("/obj/item/weapon/storage/box/lights/bulbs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 21, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/light/bulb"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5388, "/obj/item/weapon/storage/box/lights/tubes", "/obj/item/weapon/storage/box/lights", {
	illustration: "lighttube",
	name: "box of replacement tubes",
});

// /obj/item/weapon/storage/box/lights/tubes/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:551)  may sleep
rt.def("/obj/item/weapon/storage/box/lights/tubes/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 21, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/light/tube"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5389, "/obj/item/weapon/storage/box/lights/mixed", "/obj/item/weapon/storage/box/lights", {
	illustration: "lightmixed",
	name: "box of replacement lights",
});

// /obj/item/weapon/storage/box/lights/mixed/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:559)  may sleep
rt.def("/obj/item/weapon/storage/box/lights/mixed/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 14, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/light/tube"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/light/bulb"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5390, "/obj/item/weapon/storage/box/deputy", "/obj/item/weapon/storage/box", {
	name: "box of deputy armbands",
	desc: "To be issued to those authorized to act as deputy of security.",
});

// /obj/item/weapon/storage/box/deputy/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:570)  may sleep
rt.def("/obj/item/weapon/storage/box/deputy/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/accessory/armband/deputy"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5391, "/obj/item/weapon/storage/box/metalfoam", "/obj/item/weapon/storage/box", {
	illustration: "flashbang",
	name: "box of metal foam grenades",
	desc: "To be used to rapidly seal hull breaches.",
});

// /obj/item/weapon/storage/box/metalfoam/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:579)  may sleep
rt.def("/obj/item/weapon/storage/box/metalfoam/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/grenade/chem_grenade/metalfoam"), [live(f.src)]);
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

// /obj/item/weapon/storage/box/hug/proc/suicide_act  (code/game/objects/items/weapons/storage/boxes.dm:590)
rt.def("/obj/item/weapon/storage/box/hug/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ clamps the box of hugs on ＀ jugular! Guess it wasn't such a hugbox after all..</span>", [live(user), rt.callName(f, live(user), "p_their", [])])]);
	return 1;
});

// /obj/item/weapon/storage/box/hug/proc/attack_self  (code/game/objects/items/weapons/storage/boxes.dm:594)  may sleep
rt.def("/obj/item/weapon/storage/box/hug/proc/attack_self", function* attack_self(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, live(f.args[0]), "changeNext_move", [8]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "rustle", 50, 1, -5]);
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='notice'>＀ hugs ％！.</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You hug ％！.</span>", [live(f.src)])]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(5393, "/obj/item/weapon/storage/box/hug/medical", "/obj/item/weapon/storage/box/hug", {});

// /obj/item/weapon/storage/box/hug/medical/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:600)  may sleep
rt.def("/obj/item/weapon/storage/box/hug/medical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/stack/medical/bruise_pack"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/medical/ointment"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/medipen"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5394, "/obj/item/weapon/storage/box/hug/survival", "/obj/item/weapon/storage/box/hug", {});

// /obj/item/weapon/storage/box/hug/survival/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:605)  may sleep
rt.def("/obj/item/weapon/storage/box/hug/survival/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/mask/breath"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/medipen"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5396, "/obj/item/weapon/storage/box/rubbershot", "/obj/item/weapon/storage/box", {
	illustration: null,
	name: "box of rubber shots",
	desc: "A box full of rubber shots, designed for riot shotguns.",
	icon_state: "rubbershot_box",
});

// /obj/item/weapon/storage/box/rubbershot/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:616)  may sleep
rt.def("/obj/item/weapon/storage/box/rubbershot/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/ammo_casing/shotgun/rubbershot"), [live(f.src)]);
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

// /obj/item/weapon/storage/box/lethalshot/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:626)  may sleep
rt.def("/obj/item/weapon/storage/box/lethalshot/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/ammo_casing/shotgun/buckshot"), [live(f.src)]);
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

// /obj/item/weapon/storage/box/beanbag/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:636)  may sleep
rt.def("/obj/item/weapon/storage/box/beanbag/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/ammo_casing/shotgun/beanbag"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5399, "/obj/item/weapon/storage/box/actionfigure", "/obj/item/weapon/storage/box", {
	name: "box of action figures",
	desc: "The latest set of collectable action figures.",
	icon_state: "box",
});

// /obj/item/weapon/storage/box/actionfigure/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:645)  may sleep
rt.def("/obj/item/weapon/storage/box/actionfigure/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null, randomFigure: Value = null;
	let $e: any;
	f.vars = () => [i, randomFigure, $e];
	i = null;
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		randomFigure = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/toy/figure")])), T("/obj/item/toy/figure"))]);
		yield* g.new_(f, live(randomFigure), [live(f.src)]);
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

// /obj/item/weapon/storage/box/papersack/proc/update_icon  (code/game/objects/items/weapons/storage/boxes.dm:665)
rt.def("/obj/item/weapon/storage/box/papersack/proc/update_icon", function update_icon(f: Frame) {
	if (isEqual(rt.len(f, rt.sv(f, "contents")), 0)) {
		rt.setSv(f, "icon_state", fmt("＀", [rt.sv(f, "item_state")]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀_closed", [rt.sv(f, "item_state")]));
	}
	return f.dot;
});

// /obj/item/weapon/storage/box/papersack/proc/attackby  (code/game/objects/items/weapons/storage/boxes.dm:670)  may sleep
rt.def("/obj/item/weapon/storage/box/papersack/proc/attackby", function* attackby(f: Frame) {
	let designs: Value = null, switchDesign: Value = null, choice: Value = null;
	let $0: any;
	f.vars = () => [designs, switchDesign, choice, $0];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
		if (truthy(rt.len(f, rt.sv(f, "contents")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You can't modify this ＀ with items still inside!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		designs = rt.list("None", "NanotrasenStandard", "SyndiSnacks", "Heart", "SmileyFace", "Cancel");
		switchDesign = (yield* g.op(f, "Prompt", [0], [null, rt.index(live(designs), 1), "Paper Sack Design", "Select a Design:", live(designs)]));
		if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.usr), live(f.src)])), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You have moved too far away!</span>"]);
			return live(f.dot);
		}
		choice = (yield* g.callName(f, live(designs), "Find", [live(switchDesign)]));
		if ((isEqual(rt.sv(f, "design"), rt.index(live(designs), live(choice))) || isEqual(rt.index(live(designs), live(choice)), "Cancel"))) {
			return 0;
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You make some modifications to the ＀ using your pen.</span>", [live(f.src)])]);
		rt.setSv(f, "design", rt.index(live(designs), live(choice)));
		rt.setSv(f, "icon_state", fmt("paperbag_＀", [rt.sv(f, "design")]));
		rt.setSv(f, "item_state", fmt("paperbag_＀", [rt.sv(f, "design")]));
		$0 = rt.index(live(designs), live(choice));
		if ($0 === "None") {
			rt.setSv(f, "desc", "A sack neatly crafted out of paper.");
		} else if ($0 === "NanotrasenStandard") {
			rt.setSv(f, "desc", "A standard Nanotrasen paper lunch sack for loyal employees on the go.");
		} else if ($0 === "SyndiSnacks") {
			rt.setSv(f, "desc", "The design on this paper sack is a remnant of the notorious 'SyndieSnacks' program.");
		} else if ($0 === "Heart") {
			rt.setSv(f, "desc", "A paper sack with a heart etched onto the side.");
		} else if ($0 === "SmileyFace") {
			rt.setSv(f, "desc", "A paper sack with a crude smile etched onto the side.");
		}
		return 0;
	} else {
		if (truthy((yield* g.callName(f, live(f.args[0]), "is_sharp", [])))) {
			if (!truthy(rt.len(f, rt.sv(f, "contents")))) {
				if (isEqual(rt.sv(f, "item_state"), "paperbag_None")) {
					yield* g.callName(f, live(f.args[1]), "show_message", [fmt("<span class='notice'>You cut eyeholes into the ＀.</span>", [live(f.src)]), 1]);
					yield* g.new_(f, T("/obj/item/clothing/head/papersack"), [rt.fv(f, "loc", live(f.args[1]))]);
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					return 0;
				} else {
					if (isEqual(rt.sv(f, "item_state"), "paperbag_SmileyFace")) {
						yield* g.callName(f, live(f.args[1]), "show_message", [fmt("<span class='notice'>You cut eyeholes into the ＀ and modify the design.</span>", [live(f.src)]), 1]);
						yield* g.new_(f, T("/obj/item/clothing/head/papersack/smiley"), [rt.fv(f, "loc", live(f.args[1]))]);
						yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
						return 0;
					}
				}
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

rt.type(5401, "/obj/item/weapon/storage/box/ingredients", "/obj/item/weapon/storage/box", {
	illustration: "donk_kit",
	name: "ingredients box",
	item_state: null,
});

// /obj/item/weapon/storage/box/ingredients/proc/Initialize  (code/game/objects/items/weapons/storage/boxes.dm:725)  may sleep
rt.def("/obj/item/weapon/storage/box/ingredients/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "item_state"))) return f.dot;
	rt.setSv(f, "name", fmt("＀ (＀)", [rt.sv(f, "name"), rt.sv(f, "item_state")]));
	rt.setSv(f, "desc", fmt("A box containing supplementary ingredients for the aspiring chef. This box's theme is '＀'.", [rt.sv(f, "item_state")]));
	return f.dot;
}, true);

rt.type(5402, "/obj/item/weapon/storage/box/ingredients/wildcard", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "wildcard",
});

// /obj/item/weapon/storage/box/ingredients/wildcard/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:734)  may sleep
rt.def("/obj/item/weapon/storage/box/ingredients/wildcard/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null, randomFood: Value = null;
	let $e: any;
	f.vars = () => [i, randomFood, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		randomFood = rt.op(f, "PickUnweighted", [14], [T("/obj/item/weapon/reagent_containers/food/snacks/grown/chili"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/sweet"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/cherries"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/plumphelmet"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/chanterelle")]);
		yield* g.new_(f, live(randomFood), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5403, "/obj/item/weapon/storage/box/ingredients/fiesta", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "fiesta",
});

// /obj/item/weapon/storage/box/ingredients/fiesta/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:755)  may sleep
rt.def("/obj/item/weapon/storage/box/ingredients/fiesta/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/tortilla"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/chili"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5404, "/obj/item/weapon/storage/box/ingredients/italian", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "italian",
});

// /obj/item/weapon/storage/box/ingredients/italian/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:765)  may sleep
rt.def("/obj/item/weapon/storage/box/ingredients/italian/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/wine"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5405, "/obj/item/weapon/storage/box/ingredients/vegetarian", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "vegetarian",
});

// /obj/item/weapon/storage/box/ingredients/vegetarian/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:774)  may sleep
rt.def("/obj/item/weapon/storage/box/ingredients/vegetarian/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/eggplant"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5406, "/obj/item/weapon/storage/box/ingredients/american", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "american",
});

// /obj/item/weapon/storage/box/ingredients/american/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:786)  may sleep
rt.def("/obj/item/weapon/storage/box/ingredients/american/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5407, "/obj/item/weapon/storage/box/ingredients/fruity", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "fruity",
});

// /obj/item/weapon/storage/box/ingredients/fruity/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:796)  may sleep
rt.def("/obj/item/weapon/storage/box/ingredients/fruity/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/orange"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/lemon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/lime"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/watermelon"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5408, "/obj/item/weapon/storage/box/ingredients/sweets", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "sweets",
});

// /obj/item/weapon/storage/box/ingredients/sweets/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:807)  may sleep
rt.def("/obj/item/weapon/storage/box/ingredients/sweets/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cherries"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cocoapod"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5409, "/obj/item/weapon/storage/box/ingredients/delights", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "delights",
});

// /obj/item/weapon/storage/box/ingredients/delights/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:818)  may sleep
rt.def("/obj/item/weapon/storage/box/ingredients/delights/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/sweet"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/bluecherries"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/vanillapod"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cocoapod"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5410, "/obj/item/weapon/storage/box/ingredients/grains", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "grains",
});

// /obj/item/weapon/storage/box/ingredients/grains/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:829)  may sleep
rt.def("/obj/item/weapon/storage/box/ingredients/grains/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/oat"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/wheat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cocoapod"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/honeycomb"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/seeds/poppy"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5411, "/obj/item/weapon/storage/box/ingredients/carnivore", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "carnivore",
});

// /obj/item/weapon/storage/box/ingredients/carnivore/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:840)  may sleep
rt.def("/obj/item/weapon/storage/box/ingredients/carnivore/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/bear"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/spider"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/spidereggs"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/carpmeat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5412, "/obj/item/weapon/storage/box/ingredients/exotic", "/obj/item/weapon/storage/box/ingredients", {
	item_state: "exotic",
});

// /obj/item/weapon/storage/box/ingredients/exotic/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:852)  may sleep
rt.def("/obj/item/weapon/storage/box/ingredients/exotic/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/carpmeat"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/chili"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5413, "/obj/item/weapon/storage/box/emptysandbags", "/obj/item/weapon/storage/box", {
	name: "box of empty sandbags",
});

// /obj/item/weapon/storage/box/emptysandbags/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:862)  may sleep
rt.def("/obj/item/weapon/storage/box/emptysandbags/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/emptysandbag"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5414, "/obj/item/weapon/storage/box/rndboards", "/obj/item/weapon/storage/box", {
	name: "０the liberator's legacy",
	desc: "A box containing a gift for worthy golems.",
});

// /obj/item/weapon/storage/box/rndboards/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:870)  may sleep
rt.def("/obj/item/weapon/storage/box/rndboards/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/protolathe"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/destructive_analyzer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/circuit_imprinter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/circuitboard/computer/rdconsole"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5415, "/obj/item/weapon/storage/box/silver_sulf", "/obj/item/weapon/storage/box", {
	name: "box of silver sulfadiazine patches",
	desc: "Contains patches used to treat burns.",
});

// /obj/item/weapon/storage/box/silver_sulf/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:880)  may sleep
rt.def("/obj/item/weapon/storage/box/silver_sulf/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5416, "/obj/item/weapon/storage/box/fountainpens", "/obj/item/weapon/storage/box", {
	name: "box of fountain pens",
});

// /obj/item/weapon/storage/box/fountainpens/proc/PopulateContents  (code/game/objects/items/weapons/storage/boxes.dm:888)  may sleep
rt.def("/obj/item/weapon/storage/box/fountainpens/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/pen/fountain"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
