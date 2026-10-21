// From code/game/objects/items/weapons/storage/backpack.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5447, "/obj/item/weapon/storage/backpack/holding", "/obj/item/weapon/storage/backpack", {
	pshoom: rt.rsc("sound/items/pshoom.ogg"),
	alt_sound: rt.rsc("sound/items/pshoom_2.ogg"),
	name: "bag of holding",
	desc: "A backpack that opens into a localized pocket of Blue Space.",
	origin_tech: "bluespace=5;materials=4;engineering=4;plasmatech=5",
	icon_state: "holdingpack",
	item_state: "holdingpack",
	max_w_class: 6,
	max_combined_w_class: 35,
	resistance_flags: 2,
	armor: null,
});

// /obj/item/weapon/storage/backpack/holding/proc/<init>  (code/game/objects/items/weapons/storage/backpack.dm:44)
rt.def("/obj/item/weapon/storage/backpack/holding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 60, "acid", 50]));
	return f.dot;
});

// /obj/item/weapon/storage/backpack/holding/proc/suicide_act  (code/game/objects/items/weapons/storage/backpack.dm:48)  may sleep
rt.def("/obj/item/weapon/storage/backpack/holding/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is jumping into ＀! It looks like ＀ trying to commit suicide.</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_theyre", []))])]);
	yield* g.callName(f, live(user), "drop_item", []);
	yield* g.callName(f, live(user), "Stun", [null, 100, "ignore_canstun", 1], rt.Args.Named);
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "rustle", 50, 1, -5]);
	yield* g.call(f, P("/proc/qdel"), null, [live(user)]);
	return live(f.dot);
}, true);

// /obj/item/weapon/storage/backpack/holding/proc/content_can_dump  (code/game/objects/items/weapons/storage/backpack.dm:57)  may sleep
rt.def("/obj/item/weapon/storage/backpack/holding/proc/content_can_dump", function* content_can_dump(f: Frame, dest_object: Value, user: Value) {
	f.vars = () => [dest_object, user];
	if (truthy((yield* g.srcCall(f, "Adjacent", live(user))))) {
		if (rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(dest_object)])), 8)) {
			if (truthy((yield* g.callName(f, live(dest_object), "storage_contents_dump_act", [live(f.src), live(user)])))) {
				if ((truthy(rt.sv(f, "alt_sound")) && truthy(rt.op(f, "Prob", [], [1])))) {
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "alt_sound"), 40, 1]);
				} else {
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "pshoom"), 40, 1]);
				}
				yield* g.callName(f, live(user), "Beam", [null, live(dest_object), "icon_state", "rped_upgrade", "time", 5], rt.Args.Named);
				return 1;
			}
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("The ＀ buzzes.", [rt.fv(f, "name", live(f.src))])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 0]);
	}
	return 0;
}, true);

// /obj/item/weapon/storage/backpack/holding/proc/handle_item_insertion  (code/game/objects/items/weapons/storage/backpack.dm:71)  may sleep
rt.def("/obj/item/weapon/storage/backpack/holding/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	let safety: Value = null, singulo: Value = null;
	f.vars = () => [safety, singulo];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/backpack/holding")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/count_by_type"), null, [(yield* g.callName(f, live(f.args[0]), "GetAllContents", [])), T("/obj/item/weapon/storage/backpack/holding")]))))) {
		if (((((isEqual((safety = (yield* g.call(f, P("/proc/alert"), null, [live(f.args[2]), "Doing this will have extremely dire consequences for the station and its crew. Be sure you know what you're doing.", fmt("Put in ＀?", [rt.sv(f, "name")]), "Proceed", "Abort"]))), "Abort") || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[2])])), 1)) || !truthy(live(f.src))) || !truthy(live(f.args[0]))) || truthy((yield* g.callName(f, live(f.args[2]), "incapacitated", []))))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "investigate_log", fmt("has become a singularity. Caused by ＀", [rt.fv(f, "key", live(f.args[2]))]), "singulo");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[2]), "<span class='danger'>The Bluespace interfaces of the two devices catastrophically malfunction!</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		rt.setFv(f, "energy", (singulo = (yield* g.new_(f, T("/obj/singularity"), [rt.getStep(f, live(f.src), 0)]))), 300);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ detonated a bag of holding", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[2])]))])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ detonated a bag of holding", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[2])]))])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		yield* g.callName(f, live(singulo), "process", []);
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["W", "prevent_warning", "user"] });

// /obj/item/weapon/storage/backpack/holding/proc/singularity_act  (code/game/objects/items/weapons/storage/backpack.dm:88)
rt.def("/obj/item/weapon/storage/backpack/holding/proc/singularity_act", function singularity_act(f: Frame, current_size: Value) {
	let dist: Value = null;
	f.vars = () => [dist];
	dist = rt.call(f, P("/proc/max"), null, [subtract(live(current_size), 2), 1]);
	rt.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), live(dist), multiply(live(dist), 2), multiply(live(dist), 4)]);
	return live(f.dot);
});

rt.type(5448, "/obj/item/weapon/storage/backpack/santabag", "/obj/item/weapon/storage/backpack", {
	name: "Santa's Gift Bag",
	desc: "Space Santa uses this to deliver toys to all the nice children in space in Christmas! Wow, it's pretty big!",
	icon_state: "giftbag0",
	item_state: "giftbag",
	w_class: 4,
	max_w_class: 3,
	max_combined_w_class: 60,
});

// /obj/item/weapon/storage/backpack/santabag/proc/suicide_act  (code/game/objects/items/weapons/storage/backpack.dm:103)
rt.def("/obj/item/weapon/storage/backpack/santabag/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ places ＀ over their head and pulls it tight! It looks like they aren't in the Christmas spirit...</span>", [live(user), live(f.src)])]);
	return 8;
});

rt.type(5462, "/obj/item/weapon/storage/backpack/satchel", "/obj/item/weapon/storage/backpack", {
	name: "satchel",
	desc: "A trendy looking satchel.",
	icon_state: "satchel-norm",
	species_exception: null,
});

// /obj/item/weapon/storage/backpack/satchel/proc/<init>  (code/game/objects/items/weapons/storage/backpack.dm:196)
rt.def("/obj/item/weapon/storage/backpack/satchel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_exception", rt.list(T("/datum/species/angel")));
	return f.dot;
});

rt.type(5464, "/obj/item/weapon/storage/backpack/satchel/leather/withwallet", "/obj/item/weapon/storage/backpack/satchel/leather", {});

// /obj/item/weapon/storage/backpack/satchel/leather/withwallet/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:205)  may sleep
rt.def("/obj/item/weapon/storage/backpack/satchel/leather/withwallet/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/storage/wallet/random"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5475, "/obj/item/weapon/storage/backpack/satchel/flat", "/obj/item/weapon/storage/backpack/satchel", {
	level: 1,
	name: "smuggler's satchel",
	desc: "A very slim satchel that can easily fit into tight spaces.",
	icon_state: "satchel-flat",
	w_class: 3,
	max_combined_w_class: 15,
	cant_hold: null,
});

// /obj/item/weapon/storage/backpack/satchel/flat/proc/<init>  (code/game/objects/items/weapons/storage/backpack.dm:277)
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cant_hold", rt.list(T("/obj/item/weapon/storage/backpack/satchel/flat")));
	return f.dot;
});

// /obj/item/weapon/storage/backpack/satchel/flat/proc/hide  (code/game/objects/items/weapons/storage/backpack.dm:283)
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/proc/hide", function hide(f: Frame, intact: Value) {
	if (truthy(live(intact))) {
		rt.setSv(f, "invisibility", 100);
		rt.setSv(f, "anchored", 1);
		rt.setSv(f, "icon_state", fmt("＀2", [rt.initial(f, live(f.src), "icon_state")]));
	} else {
		rt.setSv(f, "invisibility", rt.initial(f, live(f.src), "invisibility"));
		rt.setSv(f, "anchored", 0);
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	}
	return f.dot;
});

// /obj/item/weapon/storage/backpack/satchel/flat/proc/Initialize  (code/game/objects/items/weapons/storage/backpack.dm:290)  may sleep
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modField(f, rt.gl("SSpersistence"), "new_secret_satchels", live(f.src), add);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/weapon/storage/backpack/satchel/flat/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:294)  may sleep
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/stack/tile/plasteel"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar"), [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/storage/backpack/satchel/flat/proc/Destroy  (code/game/objects/items/weapons/storage/backpack.dm:298)  may sleep
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.gl("SSpersistence"), "new_secret_satchels", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(5476, "/obj/item/weapon/storage/backpack/satchel/flat/secret", "/obj/item/weapon/storage/backpack/satchel/flat", {
	reward_one_of_these: null,
	reward_all_of_these: null,
	revealed: 0,
});

// /obj/item/weapon/storage/backpack/satchel/flat/secret/proc/<init>  (code/game/objects/items/weapons/storage/backpack.dm:302)
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/secret/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reward_one_of_these", rt.list());
	$0 = $0;
	rt.setSv(f, "reward_all_of_these", rt.list());
	return f.dot;
});

// /obj/item/weapon/storage/backpack/satchel/flat/secret/proc/Initialize  (code/game/objects/items/weapons/storage/backpack.dm:307)  may sleep
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/secret/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open/floor")) ? 1 : 0)) && !truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open/floor/plating")) ? 1 : 0)))) return f.dot;
	yield* g.srcCall(f, "hide", 1);
	return f.dot;
}, true);

// /obj/item/weapon/storage/backpack/satchel/flat/secret/proc/hide  (code/game/objects/items/weapons/storage/backpack.dm:313)  may sleep
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/secret/proc/hide", function* hide(f: Frame) {
	let reward: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [reward, R, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(!truthy(live(f.args[0])) && !truthy(rt.sv(f, "revealed")))) return f.dot;
	if (rt.gt(rt.len(f, rt.sv(f, "reward_one_of_these")), 0)) {
		reward = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "reward_one_of_these")]);
		yield* g.new_(f, live(reward), [live(f.src)]);
	}
	R = null;
	rt.forList(f, 0, rt.sv(f, "reward_all_of_these"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		yield* g.new_(f, live(R), [live(f.src)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "revealed", 1);
	return f.dot;
}, true, { args: ["intact"] });

rt.type(5480, "/obj/item/weapon/storage/backpack/duffelbag/med/surgery", "/obj/item/weapon/storage/backpack/duffelbag/med", {
	name: "surgical duffel bag",
	desc: "A large duffel bag for holding extra medical supplies - this one seems to be designed for holding surgical tools.",
});

// /obj/item/weapon/storage/backpack/duffelbag/med/surgery/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:348)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/med/surgery/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/scalpel"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/hemostat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/retractor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/circular_saw"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/surgicaldrill"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/cautery"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/surgical_drapes"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/surgical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/razor"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5482, "/obj/item/weapon/storage/backpack/duffelbag/sec/surgery", "/obj/item/weapon/storage/backpack/duffelbag/sec", {
	name: "surgical duffel bag",
	desc: "A large duffel bag for holding extra supplies - this one has a material inlay with space for various sharp-looking tools.",
});

// /obj/item/weapon/storage/backpack/duffelbag/sec/surgery/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:369)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/sec/surgery/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/scalpel"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/hemostat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/retractor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/circular_saw"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/surgicaldrill"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/cautery"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/surgical_drapes"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/surgical"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5484, "/obj/item/weapon/storage/backpack/duffelbag/drone", "/obj/item/weapon/storage/backpack/duffelbag", {
	name: "drone duffel bag",
	desc: "A large duffel bag for holding tools and hats.",
	icon_state: "duffel-drone",
	item_state: "duffel-drone",
	resistance_flags: 2,
});

// /obj/item/weapon/storage/backpack/duffelbag/drone/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:393)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/drone/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/screwdriver"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wrench"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/weldingtool"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil/random"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wirecutters"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/multitool"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5486, "/obj/item/weapon/storage/backpack/duffelbag/clown/cream_pie", "/obj/item/weapon/storage/backpack/duffelbag/clown", {});

// /obj/item/weapon/storage/backpack/duffelbag/clown/cream_pie/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:408)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/clown/cream_pie/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/pie/cream"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5488, "/obj/item/weapon/storage/backpack/duffelbag/syndie/hitman", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {
	desc: "A large duffel bag for holding extra things. There is a NanoTrasen logo on the back.",
	icon_state: "duffel-syndieammo",
	item_state: "duffel-syndieammo",
});

// /obj/item/weapon/storage/backpack/duffelbag/syndie/hitman/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:426)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/hitman/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/under/lawyer/blacksuit"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/waistcoat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/lawyer/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/laceup"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/sunglasses"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/fedora"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5492, "/obj/item/weapon/storage/backpack/duffelbag/syndie/surgery", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {
	name: "surgery duffel bag",
	desc: "A suspicious looking duffel bag for holding surgery tools.",
	icon_state: "duffel-syndiemed",
	item_state: "duffel-syndiemed",
});

// /obj/item/weapon/storage/backpack/duffelbag/syndie/surgery/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:447)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/surgery/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/scalpel"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/hemostat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/retractor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/circular_saw"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/surgicaldrill"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/cautery"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/surgical_drapes"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/straight_jacket"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/muzzle"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/mmi/syndie"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5494, "/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo/shotgun", "/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo", {
	desc: "A large duffel bag, packed to the brim with Bulldog shotgun ammo.",
});

// /obj/item/weapon/storage/backpack/duffelbag/syndie/ammo/shotgun/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:468)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo/shotgun/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/ammo_box/magazine/m12g"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/ammo_box/magazine/m12g/buckshot"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/magazine/m12g/slug"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/magazine/m12g/dragon"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5495, "/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo/smg", "/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo", {
	desc: "A large duffel bag, packed to the brim with C20r magazines.",
});

// /obj/item/weapon/storage/backpack/duffelbag/syndie/ammo/smg/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:478)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo/smg/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 9, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/ammo_box/magazine/smgm45"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5496, "/obj/item/weapon/storage/backpack/duffelbag/syndie/c20rbundle", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {
	desc: "A large duffel bag containing a C20r, some magazines, and a cheap looking suppressor.",
});

// /obj/item/weapon/storage/backpack/duffelbag/syndie/c20rbundle/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:485)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/c20rbundle/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/ammo_box/magazine/smgm45"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/magazine/smgm45"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/c20r"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/suppressor/specialoffer"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5497, "/obj/item/weapon/storage/backpack/duffelbag/syndie/bulldogbundle", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {
	desc: "A large duffel bag containing a Bulldog, several drums, and a collapsed hardsuit.",
});

// /obj/item/weapon/storage/backpack/duffelbag/syndie/bulldogbundle/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:494)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/bulldogbundle/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/ammo_box/magazine/m12g"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/magazine/m12g/buckshot"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/thermal/syndi"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5490, "/obj/item/weapon/storage/backpack/duffelbag/syndie/med/medicalbundle", "/obj/item/weapon/storage/backpack/duffelbag/syndie/med", {
	desc: "A large duffel bag containing a medical equipment, a Donksoft machine gun, a big jumbo box of darts, and a knock-off pair of magboots.",
});

// /obj/item/weapon/storage/backpack/duffelbag/syndie/med/medicalbundle/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:503)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/med/medicalbundle/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/shoes/magboots/syndie"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/firstaid/tactical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/l6_saw/toy"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/foambox/riot"), [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/storage/backpack/duffelbag/syndie/med/medicalbundle/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:512)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/med/medicalbundle/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/shoes/magboots/syndie"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/firstaid/tactical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/l6_saw/toy"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/foambox/riot"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5491, "/obj/item/weapon/storage/backpack/duffelbag/syndie/med/bioterrorbundle", "/obj/item/weapon/storage/backpack/duffelbag/syndie/med", {
	desc: "A large duffel bag containing a deadly chemicals, a chemical spray, chemical grenade, a Donksoft assault rifle, riot grade darts, a minature syringe gun, and a box of syringes",
});

// /obj/item/weapon/storage/backpack/duffelbag/syndie/med/bioterrorbundle/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:521)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/med/bioterrorbundle/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/spray/chemsprayer/bioterror"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/syndie_kit/chemical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/syringe/syndicate"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/c20r/toy"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/syringes"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/foambox/riot"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/chem_grenade/bioterrorfoam"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5498, "/obj/item/weapon/storage/backpack/duffelbag/syndie/c4", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {});

// /obj/item/weapon/storage/backpack/duffelbag/syndie/c4/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:530)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/c4/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/grenade/plastic/c4"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5499, "/obj/item/weapon/storage/backpack/duffelbag/syndie/x4", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {});

// /obj/item/weapon/storage/backpack/duffelbag/syndie/x4/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:534)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/x4/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/grenade/plastic/x4"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5500, "/obj/item/weapon/storage/backpack/duffelbag/syndie/firestarter", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {
	desc: "A large duffel bag containing New Russian pyro backpack sprayer, a pistol, a pipebomb, fireproof hardsuit, ammo, and other equipment.",
});

// /obj/item/weapon/storage/backpack/duffelbag/syndie/firestarter/proc/PopulateContents  (code/game/objects/items/weapons/storage/backpack.dm:541)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/firestarter/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/under/syndicate/soviet"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/watertank/operator"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/space/hardsuit/syndi/elite"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/pistol/APS"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/magazine/pistolm9mm"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/magazine/pistolm9mm"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka/badminka"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/syringe/stimulants"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb"), [live(f.src)]);
	return f.dot;
}, true);
