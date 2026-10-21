// From code/modules/uplink/uplink_item.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaluplink_items  (code/modules/uplink/uplink_item.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobaluplink_items", function InitGlobaluplink_items(f: Frame) {
	rt.setGl("uplink_items", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "uplink_items", add);
	return f.dot;
});

// /proc/initialize_global_uplink_items  (code/modules/uplink/uplink_item.dm:4)  may sleep
rt.def("/proc/initialize_global_uplink_items", function* initialize_global_uplink_items(f: Frame) {
	let item: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [item, I, $e];
	rt.setGl("uplink_items", rt.list());
	item = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/uplink_item")])), T("/datum/uplink_item")));
	while (($e = rt.next(f, 0)) !== undefined) {
		item = $e;
		if (!truthy(rt.gv(f, "item", (I = (yield* g.new_(f, live(item), [])))))) {
			continue;
		}
		if (!truthy(rt.index(rt.gl("uplink_items"), rt.fv(f, "category", live(I))))) {
			rt.setAt(rt.gl("uplink_items"), rt.fv(f, "category", live(I)), rt.list());
		}
		rt.setAt(rt.index(rt.gl("uplink_items"), rt.fv(f, "category", live(I))), rt.fv(f, "name", live(I)), live(I));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/get_uplink_items  (code/modules/uplink/uplink_item.dm:14)  may sleep
rt.def("/proc/get_uplink_items", function* get_uplink_items(f: Frame, gamemode: Value) {
	let filtered_uplink_items: Value = null, sale_items: Value = null, category: Value = null, item: Value = null, I: Value = null, i: Value = null, I_3: Value = null, A: Value = null, discount: Value = null, disclaimer: Value = null;
	let $e: any;
	f.vars = () => [gamemode, filtered_uplink_items, sale_items, category, item, I, i, I_3, A, discount, disclaimer, $e];
	if (live(gamemode) === null) {
		gamemode = null;
	}
	if (!truthy(rt.len(f, rt.gl("uplink_items")))) {
		yield* g.call(f, P("/proc/initialize_global_uplink_items"), null, []);
	}
	filtered_uplink_items = rt.list();
	sale_items = rt.list();
	category = null;
	rt.forList(f, 0, rt.gl("uplink_items"));
	while (($e = rt.next(f, 0)) !== undefined) {
		category = $e;
		item = null;
		rt.forList(f, 1, rt.index(rt.gl("uplink_items"), live(category)));
		while (($e = rt.next(f, 1)) !== undefined) {
			item = $e;
			if (!truthy((rt.istype((I = rt.index(rt.index(rt.gl("uplink_items"), live(category)), live(item))), T("/datum/uplink_item")) ? 1 : 0))) {
				continue;
			}
			if (truthy(rt.getLen(f, rt.fv(f, "include_modes", live(I))))) {
				if (((!truthy(live(gamemode)) && truthy(rt.gl("SSticker"))) && !truthy((rt.isIn(f, rt.gv(f, "type", rt.fv(f, "mode", rt.gl("SSticker"))), rt.fv(f, "include_modes", live(I))) ? 1 : 0)))) {
					continue;
				}
				if ((truthy(live(gamemode)) && !truthy((rt.isIn(f, live(gamemode), rt.fv(f, "include_modes", live(I))) ? 1 : 0)))) {
					continue;
				}
			}
			if (truthy(rt.getLen(f, rt.fv(f, "exclude_modes", live(I))))) {
				if (((!truthy(live(gamemode)) && truthy(rt.gl("SSticker"))) && truthy((rt.isIn(f, rt.gv(f, "type", rt.fv(f, "mode", rt.gl("SSticker"))), rt.fv(f, "exclude_modes", live(I))) ? 1 : 0)))) {
					continue;
				}
				if ((truthy(live(gamemode)) && truthy((rt.isIn(f, live(gamemode), rt.fv(f, "exclude_modes", live(I))) ? 1 : 0)))) {
					continue;
				}
			}
			if ((truthy(rt.fv(f, "player_minimum", live(I))) && rt.gt(rt.fv(f, "player_minimum", live(I)), rt.len(f, rt.gl("joined_player_list"))))) {
				continue;
			}
			if (!truthy(rt.index(live(filtered_uplink_items), live(category)))) {
				rt.setAt(live(filtered_uplink_items), live(category), rt.list());
			}
			rt.setAt(rt.index(live(filtered_uplink_items), live(category)), live(item), live(I));
			if ((((rt.lt(rt.fv(f, "limited_stock", live(I)), 0) && !truthy(rt.fv(f, "cant_discount", live(I)))) && truthy(rt.fv(f, "item", live(I)))) && rt.gt(rt.fv(f, "cost", live(I)), 1))) {
				sale_items = rt.modify(live(sale_items), live(I), add);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		I_3 = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(sale_items)]));
		A = (yield* g.new_(f, rt.fv(f, "type", live(I_3)), []));
		discount = (yield* g.callName(f, live(A), "get_discount", []));
		disclaimer = rt.list("Void where prohibited.", "Not recommended for children.", "Contains small parts.", "Check local laws for legality in region.", "Do not taunt.", "Not responsible for direct, indirect, incidental or consequential damages resulting from any defect, error or failure to perform.", "Keep away from fire or flames.", "Product is provided \"as is\" without any implied or expressed warranties.", "As seen on TV.", "For recreational use only.", "Use only as directed.", "16% sales tax will be charged for orders originating within Space Nebraska.");
		rt.setFv(f, "limited_stock", live(A), 1);
		rt.setFv(f, "refundable", live(I_3), 0);
		rt.setFv(f, "refundable", live(A), 0);
		if (rt.ge(rt.fv(f, "cost", live(A)), 20)) {
			(discount = rt.modify(live(discount), 0.5, multiply));
		}
		rt.setFv(f, "cost", live(A), (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(rt.fv(f, "cost", live(A)), live(discount))])), 1])));
		rt.setFv(f, "category", live(A), "Discounted Gear");
		rt.modField(f, live(A), "name", fmt(" (＀% off!)", [(yield* g.call(f, P("/proc/round"), null, [multiply(divide(subtract(rt.initial(f, live(A), "cost"), rt.fv(f, "cost", live(A))), rt.initial(f, live(A), "cost")), 100)]))]), add);
		rt.modField(f, live(A), "desc", fmt(" Normally costs ＀ TC. All sales final. ＀", [rt.initial(f, live(A), "cost"), rt.op(f, "PickUnweighted", [1], [live(disclaimer)])]), add);
		rt.setFv(f, "item", live(A), rt.fv(f, "item", live(I_3)));
		if (!truthy(rt.index(live(filtered_uplink_items), rt.fv(f, "category", live(A))))) {
			rt.setAt(live(filtered_uplink_items), rt.fv(f, "category", live(A)), rt.list());
		}
		rt.setAt(rt.index(live(filtered_uplink_items), rt.fv(f, "category", live(A))), rt.fv(f, "name", live(A)), live(A));
	}
	rt.endFor(f, 0);
	return live(filtered_uplink_items);
}, true);

rt.type(4244, "/datum/uplink_item", "/datum", {
	name: "item name",
	category: "item category",
	desc: "item description",
	item: null,
	refund_path: null,
	cost: 0,
	refund_amount: 0,
	refundable: 0,
	surplus: 100,
	cant_discount: 0,
	limited_stock: -1,
	include_modes: null,
	exclude_modes: null,
	restricted_roles: null,
	player_minimum: null,
	purchase_log_vis: 1,
});

// /datum/uplink_item/proc/<init>  (code/modules/uplink/uplink_item.dm:83)
rt.def("/datum/uplink_item/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list());
	$0 = $0;
	rt.setSv(f, "exclude_modes", rt.list());
	$0 = $0;
	rt.setSv(f, "restricted_roles", rt.list());
	return f.dot;
});

// /datum/uplink_item/proc/get_discount  (code/modules/uplink/uplink_item.dm:90)
rt.def("/datum/uplink_item/proc/get_discount", function get_discount(f: Frame) {
	return rt.op(f, "PickWeighted", [3], [4, 0.75, 2, 0.5, 1, 0.25]);
});

// /datum/uplink_item/proc/spawn_item  (code/modules/uplink/uplink_item.dm:94)  may sleep
rt.def("/datum/uplink_item/proc/spawn_item", function* spawn_item(f: Frame, loc: Value, U: Value) {
	f.vars = () => [loc, U];
	if (!truthy(rt.sv(f, "item"))) return f.dot;
	return (yield* g.new_(f, rt.sv(f, "item"), [live(loc)]));
}, true);

// /datum/uplink_item/proc/buy  (code/modules/uplink/uplink_item.dm:98)  may sleep
rt.def("/datum/uplink_item/proc/buy", function* buy(f: Frame, user: Value, U: Value) {
	let A: Value = null, B: Value = null, I: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [user, U, A, B, I, H, $e];
	if (!truthy((rt.istype(live(U), T("/obj/item/device/uplink")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((!truthy(live(user)) || truthy((yield* g.callName(f, live(user), "incapacitated", []))))) {
		return live(f.dot);
	}
	if ((rt.lt(rt.fv(f, "telecrystals", live(U)), rt.sv(f, "cost")) || isEqual(rt.sv(f, "limited_stock"), 0))) {
		return live(f.dot);
	} else {
		(rt.modField(f, live(U), "telecrystals", rt.sv(f, "cost"), subtract));
		rt.modField(f, live(U), "spent_telecrystals", rt.sv(f, "cost"), add);
	}
	A = (yield* g.srcCall(f, "spawn_item", rt.getStep(f, live(user), 0), live(U)));
	if ((truthy((rt.istype((B = live(A)), T("/obj/item/weapon/storage/box")) ? 1 : 0)) && rt.gt(rt.getLen(f, rt.fv(f, "contents", live(B))), 0))) {
		I = null;
		rt.forList(f, 0, live(B), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			rt.modField(f, live(U), "purchase_log", fmt("<big>＀</big>", [(yield* g.call(f, P("/proc/bicon"), null, [live(I)]))]), add);
		}
		rt.endFor(f, 0);
	} else {
		if (truthy(rt.sv(f, "purchase_log_vis"))) {
			rt.modField(f, live(U), "purchase_log", fmt("<big>＀</big>", [(yield* g.call(f, P("/proc/bicon"), null, [live(A)]))]), add);
		}
	}
	if (rt.gt(rt.sv(f, "limited_stock"), 0)) {
		(rt.modSrcVar(f, "limited_stock", 1, subtract));
	}
	if ((truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy((rt.istype(live(A), T("/obj/item")) ? 1 : 0)))) {
		if (truthy((yield* g.callName(f, (H = live(user)), "put_in_hands", [live(A)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("＀ materializes into your hands!", [live(A)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("＄！ materializes onto the floor.", [live(A)])]);
		}
	}
	return 1;
}, true);

// /datum/uplink_item/proc/Destroy  (code/modules/uplink/uplink_item.dm:130)  may sleep
rt.def("/datum/uplink_item/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy((rt.isIn(f, live(f.src), rt.gl("uplink_items")) ? 1 : 0))) {
		(rt.modGl("uplink_items", live(f.src), subtract));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(4246, "/datum/uplink_item/nukeoffer", "/datum/uplink_item", {
	category: "Special Offers",
	surplus: 0,
	include_modes: null,
	cant_discount: 1,
});

// /datum/uplink_item/nukeoffer/proc/<init>  (code/modules/uplink/uplink_item.dm:142)
rt.def("/datum/uplink_item/nukeoffer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4256, "/datum/uplink_item/dangerous/shotgun", "/datum/uplink_item/dangerous", {
	name: "Bulldog Shotgun",
	desc: "A fully-loaded semi-automatic drum-fed shotgun. Compatible with all 12g rounds. Designed for close quarter anti-personnel engagements.",
	cost: 8,
	surplus: 40,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog"),
});

// /datum/uplink_item/dangerous/shotgun/proc/<init>  (code/modules/uplink/uplink_item.dm:210)
rt.def("/datum/uplink_item/dangerous/shotgun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4257, "/datum/uplink_item/dangerous/smg", "/datum/uplink_item/dangerous", {
	name: "C-20r Submachine Gun",
	desc: "A fully-loaded Scarborough Arms bullpup submachine gun. The C-20r fires .45 rounds with a 20-round magazine and is compatible with suppressors.",
	cost: 10,
	surplus: 40,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/c20r"),
});

// /datum/uplink_item/dangerous/smg/proc/<init>  (code/modules/uplink/uplink_item.dm:219)
rt.def("/datum/uplink_item/dangerous/smg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4258, "/datum/uplink_item/dangerous/smg/unrestricted", "/datum/uplink_item/dangerous/smg", {
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/c20r/unrestricted"),
});

// /datum/uplink_item/dangerous/smg/unrestricted/proc/<init>  (code/modules/uplink/uplink_item.dm:223)
rt.def("/datum/uplink_item/dangerous/smg/unrestricted/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4259, "/datum/uplink_item/dangerous/machinegun", "/datum/uplink_item/dangerous", {
	name: "L6 Squad Automatic Weapon",
	desc: "A fully-loaded Aussec Armoury belt-fed machine gun. This deadly weapon has a massive 50-round magazine of devastating 1.95x129mm ammunition.",
	cost: 18,
	surplus: 0,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/l6_saw"),
});

// /datum/uplink_item/dangerous/machinegun/proc/<init>  (code/modules/uplink/uplink_item.dm:232)
rt.def("/datum/uplink_item/dangerous/machinegun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4260, "/datum/uplink_item/dangerous/grenadier", "/datum/uplink_item/dangerous", {
	name: "Grenadier's belt",
	desc: "A belt of a large variety of lethally dangerous and destructive grenades.",
	include_modes: null,
	cost: 22,
	surplus: 0,
	item: rt.typePath("/obj/item/weapon/storage/belt/grenade/full"),
});

// /datum/uplink_item/dangerous/grenadier/proc/<init>  (code/modules/uplink/uplink_item.dm:238)
rt.def("/datum/uplink_item/dangerous/grenadier/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4261, "/datum/uplink_item/dangerous/sniper", "/datum/uplink_item/dangerous", {
	name: "Sniper Rifle",
	desc: "Ranged fury, Syndicate style. Guaranteed to cause shock and awe or your TC back!",
	cost: 16,
	surplus: 25,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle/syndicate"),
});

// /datum/uplink_item/dangerous/sniper/proc/<init>  (code/modules/uplink/uplink_item.dm:248)
rt.def("/datum/uplink_item/dangerous/sniper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4262, "/datum/uplink_item/dangerous/bolt_action", "/datum/uplink_item/dangerous", {
	name: "Surplus Rifle",
	desc: "A horribly outdated bolt action weapon. You've got to be desperate to use this.",
	cost: 2,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/shotgun/boltaction"),
});

// /datum/uplink_item/dangerous/bolt_action/proc/<init>  (code/modules/uplink/uplink_item.dm:255)
rt.def("/datum/uplink_item/dangerous/bolt_action/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4263, "/datum/uplink_item/dangerous/crossbow", "/datum/uplink_item/dangerous", {
	name: "Miniature Energy Crossbow",
	desc: "A short bow mounted across a tiller in miniature. Small enough to fit into a pocket or slip into a bag unnoticed. It will synthesize and fire bolts tipped with a paralyzing toxin that will briefly stun targets and cause them to slur as if inebriated. It can produce an infinite number of bolts, but takes time to automatically recharge after each shot.",
	cost: 12,
	surplus: 50,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow"),
});

// /datum/uplink_item/dangerous/crossbow/proc/<init>  (code/modules/uplink/uplink_item.dm:268)
rt.def("/datum/uplink_item/dangerous/crossbow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4264, "/datum/uplink_item/dangerous/flamethrower", "/datum/uplink_item/dangerous", {
	name: "Flamethrower",
	desc: "A flamethrower, fueled by a portion of highly flammable biotoxins stolen previously from Nanotrasen stations. Make a statement by roasting the filth in their own greed. Use with caution.",
	cost: 4,
	surplus: 40,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/flamethrower/full/tank"),
});

// /datum/uplink_item/dangerous/flamethrower/proc/<init>  (code/modules/uplink/uplink_item.dm:277)
rt.def("/datum/uplink_item/dangerous/flamethrower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4266, "/datum/uplink_item/dangerous/doublesword", "/datum/uplink_item/dangerous", {
	name: "Double-Bladed Energy Sword",
	desc: "The double-bladed energy sword does slightly more damage than a standard energy sword and will deflect all energy projectiles, but requires two hands to wield.",
	player_minimum: 25,
	cost: 16,
	item: rt.typePath("/obj/item/weapon/twohanded/dualsaber"),
});

// /datum/uplink_item/dangerous/doublesword/proc/get_discount  (code/modules/uplink/uplink_item.dm:295)
rt.def("/datum/uplink_item/dangerous/doublesword/proc/get_discount", function get_discount(f: Frame) {
	return rt.op(f, "PickWeighted", [3], [4, 0.800000011920929, 2, 0.6499999761581421, 1, 0.5]);
});

rt.type(4270, "/datum/uplink_item/dangerous/foamsmg", "/datum/uplink_item/dangerous", {
	name: "Toy Submachine Gun",
	desc: "A fully-loaded Donksoft bullpup submachine gun that fires riot grade rounds with a 20-round magazine.",
	cost: 5,
	surplus: 0,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/c20r/toy"),
});

// /datum/uplink_item/dangerous/foamsmg/proc/<init>  (code/modules/uplink/uplink_item.dm:326)
rt.def("/datum/uplink_item/dangerous/foamsmg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4271, "/datum/uplink_item/dangerous/foammachinegun", "/datum/uplink_item/dangerous", {
	name: "Toy Machine Gun",
	desc: "A fully-loaded Donksoft belt-fed machine gun. This weapon has a massive 50-round magazine of devastating riot grade darts, that can briefly incapacitate someone in just one volley.",
	cost: 10,
	surplus: 0,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/l6_saw/toy"),
});

// /datum/uplink_item/dangerous/foammachinegun/proc/<init>  (code/modules/uplink/uplink_item.dm:335)
rt.def("/datum/uplink_item/dangerous/foammachinegun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4272, "/datum/uplink_item/dangerous/viscerators", "/datum/uplink_item/dangerous", {
	name: "Viscerator Delivery Grenade",
	desc: "A unique grenade that deploys a swarm of viscerators upon activation, which will chase down and shred any non-operatives in the area.",
	cost: 5,
	surplus: 35,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/grenade/spawnergrenade/manhacks"),
});

// /datum/uplink_item/dangerous/viscerators/proc/<init>  (code/modules/uplink/uplink_item.dm:344)
rt.def("/datum/uplink_item/dangerous/viscerators/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4273, "/datum/uplink_item/dangerous/bioterrorfoam", "/datum/uplink_item/dangerous", {
	name: "Chemical Foam Grenade",
	desc: "A powerful chemical foam grenade which creates a deadly torrent of foam that will mute, blind, confuse, mutate, and irritate carbon lifeforms. Specially brewed by Tiger Cooperative chemical weapons specialists using additional spore toxin. Ensure suit is sealed before use.",
	cost: 5,
	surplus: 35,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/grenade/chem_grenade/bioterrorfoam"),
});

// /datum/uplink_item/dangerous/bioterrorfoam/proc/<init>  (code/modules/uplink/uplink_item.dm:354)
rt.def("/datum/uplink_item/dangerous/bioterrorfoam/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4274, "/datum/uplink_item/dangerous/bioterror", "/datum/uplink_item/dangerous", {
	name: "Biohazardous Chemical Sprayer",
	desc: "A chemical sprayer that allows a wide dispersal of selected chemicals. Especially tailored by the Tiger Cooperative, the deadly blend it comes stocked with will disorient, damage, and disable your foes... Use with extreme caution, to prevent exposure to yourself and your fellow operatives.",
	cost: 20,
	surplus: 0,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/reagent_containers/spray/chemsprayer/bioterror"),
});

// /datum/uplink_item/dangerous/bioterror/proc/<init>  (code/modules/uplink/uplink_item.dm:364)
rt.def("/datum/uplink_item/dangerous/bioterror/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4276, "/datum/uplink_item/stealthy_weapons/virus_grenade", "/datum/uplink_item/stealthy_weapons", {
	name: "Fungal Tuberculosis Grenade",
	desc: "A primed bio-grenade packed into a compact box. Comes with five Bio Virus Antidote Kit (BVAK) autoinjectors for rapid application on up to two targets each, a syringe, and a bottle containing the BVAK solution.",
	cost: 12,
	surplus: 35,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/tuberculosisgrenade"),
});

// /datum/uplink_item/stealthy_weapons/virus_grenade/proc/<init>  (code/modules/uplink/uplink_item.dm:374)
rt.def("/datum/uplink_item/stealthy_weapons/virus_grenade/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4297, "/datum/uplink_item/ammo/bolt_action", "/datum/uplink_item/ammo", {
	name: "Surplus Rifle Clip",
	desc: "A stripper clip used to quickly load bolt action rifles. Contains 5 rounds.",
	cost: 1,
	include_modes: null,
	item: rt.typePath("/obj/item/ammo_box/a762"),
});

// /datum/uplink_item/ammo/bolt_action/proc/<init>  (code/modules/uplink/uplink_item.dm:411)
rt.def("/datum/uplink_item/ammo/bolt_action/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4299, "/datum/uplink_item/ammo/shotgun", "/datum/uplink_item/ammo", {
	cost: 2,
	include_modes: null,
});

// /datum/uplink_item/ammo/shotgun/proc/<init>  (code/modules/uplink/uplink_item.dm:422)
rt.def("/datum/uplink_item/ammo/shotgun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4302, "/datum/uplink_item/ammo/shotgun/stun", "/datum/uplink_item/ammo/shotgun", {
	name: "12g Stun Slug Drum",
	desc: "An alternative 8-round stun slug magazine for use with the Bulldog shotgun. Saying that they're completely non-lethal would be lying.",
	include_modes: null,
	item: rt.typePath("/obj/item/ammo_box/magazine/m12g"),
});

// /datum/uplink_item/ammo/shotgun/stun/proc/<init>  (code/modules/uplink/uplink_item.dm:441)
rt.def("/datum/uplink_item/ammo/shotgun/stun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4303, "/datum/uplink_item/ammo/shotgun/dragon", "/datum/uplink_item/ammo/shotgun", {
	name: "12g Dragon's Breath Drum",
	desc: "An alternative 8-round dragon's breath magazine for use in the Bulldog shotgun. 'I'm a fire starter, twisted fire starter!'",
	include_modes: null,
	item: rt.typePath("/obj/item/ammo_box/magazine/m12g/dragon"),
});

// /datum/uplink_item/ammo/shotgun/dragon/proc/<init>  (code/modules/uplink/uplink_item.dm:448)
rt.def("/datum/uplink_item/ammo/shotgun/dragon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4304, "/datum/uplink_item/ammo/shotgun/breach", "/datum/uplink_item/ammo/shotgun", {
	name: "12g Breaching Shells",
	desc: "An economic variant of the CMC meteorshot slugs, not as effective for knocking down targets, but still great for blasting airlocks off their frames.",
	include_modes: null,
	item: rt.typePath("/obj/item/ammo_box/magazine/m12g/breach"),
});

// /datum/uplink_item/ammo/shotgun/breach/proc/<init>  (code/modules/uplink/uplink_item.dm:455)
rt.def("/datum/uplink_item/ammo/shotgun/breach/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4306, "/datum/uplink_item/ammo/smg", "/datum/uplink_item/ammo", {
	name: ".45 SMG Magazine",
	desc: "An additional 20-round .45 magazine suitable for use with the C-20r submachine gun. These bullets pack a lot of punch that can knock most targets down, but do limited overall damage.",
	cost: 3,
	include_modes: null,
	item: rt.typePath("/obj/item/ammo_box/magazine/smgm45"),
});

// /datum/uplink_item/ammo/smg/proc/<init>  (code/modules/uplink/uplink_item.dm:469)
rt.def("/datum/uplink_item/ammo/smg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4307, "/datum/uplink_item/ammo/smg/bag", "/datum/uplink_item/ammo/smg", {
	name: ".45 Ammo Duffel Bag",
	desc: "A duffel bag filled with enough .45 ammo to supply an entire team, at a discounted price.",
	cost: 20,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo/smg"),
});

// /datum/uplink_item/ammo/smg/bag/proc/<init>  (code/modules/uplink/uplink_item.dm:476)
rt.def("/datum/uplink_item/ammo/smg/bag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4308, "/datum/uplink_item/ammo/machinegun", "/datum/uplink_item/ammo", {
	cost: 6,
	surplus: 0,
	include_modes: null,
});

// /datum/uplink_item/ammo/machinegun/proc/<init>  (code/modules/uplink/uplink_item.dm:481)
rt.def("/datum/uplink_item/ammo/machinegun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4314, "/datum/uplink_item/ammo/sniper", "/datum/uplink_item/ammo", {
	cost: 4,
	include_modes: null,
});

// /datum/uplink_item/ammo/sniper/proc/<init>  (code/modules/uplink/uplink_item.dm:515)
rt.def("/datum/uplink_item/ammo/sniper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4320, "/datum/uplink_item/ammo/bioterror", "/datum/uplink_item/ammo", {
	name: "Box of Bioterror Syringes",
	desc: "A box full of preloaded syringes, containing various chemicals that seize up the victim's motor and broca systems, making it impossible for them to move or speak for some time.",
	cost: 6,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/bioterror"),
});

// /datum/uplink_item/ammo/bioterror/proc/<init>  (code/modules/uplink/uplink_item.dm:554)
rt.def("/datum/uplink_item/ammo/bioterror/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4321, "/datum/uplink_item/support", "/datum/uplink_item", {
	category: "Support and Mechanized Exosuits",
	surplus: 0,
	include_modes: null,
});

// /datum/uplink_item/support/proc/<init>  (code/modules/uplink/uplink_item.dm:560)
rt.def("/datum/uplink_item/support/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4277, "/datum/uplink_item/stealthy_weapons/martialarts", "/datum/uplink_item/stealthy_weapons", {
	name: "Martial Arts Scroll",
	desc: "This scroll contains the secrets of an ancient martial arts technique. You will master unarmed combat, deflecting all ranged weapon fire, but you also refuse to use dishonorable ranged weaponry.",
	cost: 17,
	surplus: 0,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/sleeping_carp_scroll"),
});

// /datum/uplink_item/stealthy_weapons/martialarts/proc/<init>  (code/modules/uplink/uplink_item.dm:610)
rt.def("/datum/uplink_item/stealthy_weapons/martialarts/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4278, "/datum/uplink_item/stealthy_weapons/cqc", "/datum/uplink_item/stealthy_weapons", {
	name: "CQC Manual",
	desc: "A manual that teaches a single user tactical Close-Quarters Combat before self-destructing.",
	include_modes: null,
	cost: 13,
	surplus: 0,
	item: rt.typePath("/obj/item/weapon/cqc_manual"),
});

// /datum/uplink_item/stealthy_weapons/cqc/proc/<init>  (code/modules/uplink/uplink_item.dm:616)
rt.def("/datum/uplink_item/stealthy_weapons/cqc/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4281, "/datum/uplink_item/stealthy_weapons/foampistol", "/datum/uplink_item/stealthy_weapons", {
	name: "Toy Gun with Riot Darts",
	desc: "An innocent-looking toy pistol designed to fire foam darts. Comes loaded with riot-grade darts effective at incapacitating a target.",
	cost: 3,
	surplus: 10,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/toy/pistol/riot"),
});

// /datum/uplink_item/stealthy_weapons/foampistol/proc/<init>  (code/modules/uplink/uplink_item.dm:640)
rt.def("/datum/uplink_item/stealthy_weapons/foampistol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4282, "/datum/uplink_item/stealthy_weapons/sleepy_pen", "/datum/uplink_item/stealthy_weapons", {
	name: "Sleepy Pen",
	desc: "A syringe disguised as a functional pen, filled with a potent mix of drugs, including a strong anesthetic and a chemical that prevents the target from speaking. The pen holds one dose of the mixture, and cannot be refilled. Note that before the target falls asleep, they will be able to move and act.",
	cost: 4,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/pen/sleepy"),
});

// /datum/uplink_item/stealthy_weapons/sleepy_pen/proc/<init>  (code/modules/uplink/uplink_item.dm:650)
rt.def("/datum/uplink_item/stealthy_weapons/sleepy_pen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4285, "/datum/uplink_item/stealthy_weapons/romerol_kit", "/datum/uplink_item/stealthy_weapons", {
	name: "Romerol",
	desc: "A highly experimental bioterror agent which creates dormant nodules to be etched into the grey matter of the brain. On death, these nodules take control of the dead body, causing limited revivification, along with slurred speech, aggression, and the ability to infect others with this agent.",
	cost: 25,
	cant_discount: 1,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/romerol"),
});

// /datum/uplink_item/stealthy_weapons/romerol_kit/proc/<init>  (code/modules/uplink/uplink_item.dm:673)
rt.def("/datum/uplink_item/stealthy_weapons/romerol_kit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4328, "/datum/uplink_item/stealthy_tools/chameleon", "/datum/uplink_item/stealthy_tools", {
	name: "Chameleon Kit",
	desc: "A set of items that contain chameleon technology allowing you to disguise as pretty much anything on the station, and more!",
	cost: 4,
	exclude_modes: null,
	player_minimum: 20,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/chameleon"),
});

// /datum/uplink_item/stealthy_tools/chameleon/proc/<init>  (code/modules/uplink/uplink_item.dm:730)
rt.def("/datum/uplink_item/stealthy_tools/chameleon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4329, "/datum/uplink_item/stealthy_tools/chameleon/nuke", "/datum/uplink_item/stealthy_tools/chameleon", {
	cost: 6,
	exclude_modes: null,
	include_modes: null,
});

// /datum/uplink_item/stealthy_tools/chameleon/nuke/proc/<init>  (code/modules/uplink/uplink_item.dm:735)
rt.def("/datum/uplink_item/stealthy_tools/chameleon/nuke/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list());
	$0 = $0;
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4330, "/datum/uplink_item/stealthy_tools/syndigaloshes", "/datum/uplink_item/stealthy_tools", {
	name: "No-Slip Chameleon Shoes",
	desc: "These shoes will allow the wearer to run on wet floors and slippery objects without falling down. They do not work on heavily lubricated surfaces.",
	cost: 2,
	exclude_modes: null,
	player_minimum: 20,
	item: rt.typePath("/obj/item/clothing/shoes/chameleon"),
});

// /datum/uplink_item/stealthy_tools/syndigaloshes/proc/<init>  (code/modules/uplink/uplink_item.dm:744)
rt.def("/datum/uplink_item/stealthy_tools/syndigaloshes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4331, "/datum/uplink_item/stealthy_tools/syndigaloshes/nuke", "/datum/uplink_item/stealthy_tools/syndigaloshes", {
	name: "Stealthy No-Slip Chameleon Shoes",
	desc: "These shoes will allow the wearer to run on wet floors and slippery objects without falling down. They do not work on heavily lubricated surfaces. The manufacturer claims they are much more stealthy than the normal brand.",
	cost: 4,
	exclude_modes: null,
	include_modes: null,
	item: rt.typePath("/obj/item/clothing/shoes/chameleon"),
});

// /datum/uplink_item/stealthy_tools/syndigaloshes/nuke/proc/<init>  (code/modules/uplink/uplink_item.dm:762)
rt.def("/datum/uplink_item/stealthy_tools/syndigaloshes/nuke/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list());
	$0 = $0;
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4334, "/datum/uplink_item/stealthy_tools/chameleon_proj", "/datum/uplink_item/stealthy_tools", {
	name: "Chameleon Projector",
	desc: "Projects an image across a user, disguising them as an object scanned with it, as long as they don't move the projector from their hand. Disguised users move slowly, and projectiles pass over them.",
	cost: 7,
	exclude_modes: null,
	item: rt.typePath("/obj/item/device/chameleon"),
});

// /datum/uplink_item/stealthy_tools/chameleon_proj/proc/<init>  (code/modules/uplink/uplink_item.dm:781)
rt.def("/datum/uplink_item/stealthy_tools/chameleon_proj/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4338, "/datum/uplink_item/stealthy_tools/mulligan", "/datum/uplink_item/stealthy_tools", {
	name: "Mulligan",
	desc: "Screwed up and have security on your tail? This handy syringe will give you a completely new identity and appearance.",
	cost: 4,
	surplus: 30,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/reagent_containers/syringe/mulligan"),
});

// /datum/uplink_item/stealthy_tools/mulligan/proc/<init>  (code/modules/uplink/uplink_item.dm:815)
rt.def("/datum/uplink_item/stealthy_tools/mulligan/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4342, "/datum/uplink_item/suits", "/datum/uplink_item", {
	category: "Space Suits and Hardsuits",
	exclude_modes: null,
	surplus: 40,
});

// /datum/uplink_item/suits/proc/<init>  (code/modules/uplink/uplink_item.dm:843)
rt.def("/datum/uplink_item/suits/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4344, "/datum/uplink_item/suits/hardsuit", "/datum/uplink_item/suits", {
	name: "Syndicate Hardsuit",
	desc: "The feared suit of a syndicate nuclear agent. Features slightly better armoring and a built in jetpack that runs off standard atmospheric tanks. When the built in helmet is deployed your identity will be protected, even in death, as the suit cannot be removed by outside forces. Toggling the suit in and out of combat mode will allow you all the mobility of a loose fitting uniform without sacrificing armoring. Additionally the suit is collapsible, making it small enough to fit within a backpack. Nanotrasen crew who spot these suits are known to panic.",
	cost: 8,
	exclude_modes: null,
	item: rt.typePath("/obj/item/clothing/suit/space/hardsuit/syndi"),
});

// /datum/uplink_item/suits/hardsuit/proc/<init>  (code/modules/uplink/uplink_item.dm:864)
rt.def("/datum/uplink_item/suits/hardsuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4345, "/datum/uplink_item/suits/hardsuit/elite", "/datum/uplink_item/suits/hardsuit", {
	name: "Elite Syndicate Hardsuit",
	desc: "An upgraded, elite version of the syndicate hardsuit. It features fireproofing, and also provides the user with superior armor and mobility compared to the standard syndicate hardsuit.",
	cost: 8,
	include_modes: null,
	exclude_modes: null,
	item: rt.typePath("/obj/item/clothing/suit/space/hardsuit/syndi/elite"),
});

// /datum/uplink_item/suits/hardsuit/elite/proc/<init>  (code/modules/uplink/uplink_item.dm:872)
rt.def("/datum/uplink_item/suits/hardsuit/elite/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	$0 = $0;
	rt.setSv(f, "exclude_modes", rt.list());
	return f.dot;
});

rt.type(4346, "/datum/uplink_item/suits/hardsuit/shielded", "/datum/uplink_item/suits/hardsuit", {
	name: "Shielded Syndicate Hardsuit",
	desc: "An upgraded version of the standard syndicate hardsuit. It features a built-in energy shielding system. The shields can handle up to three impacts within a short duration and will rapidly recharge while not under fire.",
	cost: 30,
	include_modes: null,
	exclude_modes: null,
	item: rt.typePath("/obj/item/clothing/suit/space/hardsuit/shielded/syndi"),
});

// /datum/uplink_item/suits/hardsuit/shielded/proc/<init>  (code/modules/uplink/uplink_item.dm:881)
rt.def("/datum/uplink_item/suits/hardsuit/shielded/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	$0 = $0;
	rt.setSv(f, "exclude_modes", rt.list());
	return f.dot;
});

rt.type(4348, "/datum/uplink_item/device_tools/emag", "/datum/uplink_item/device_tools", {
	name: "Cryptographic Sequencer",
	desc: "The cryptographic sequencer, electromagnetic card, or emag, is a small card that unlocks hidden functions in electronic devices, subverts intended functions, and easily breaks security mechanisms.",
	cost: 6,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/card/emag"),
});

// /datum/uplink_item/device_tools/emag/proc/<init>  (code/modules/uplink/uplink_item.dm:894)
rt.def("/datum/uplink_item/device_tools/emag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4351, "/datum/uplink_item/device_tools/military_belt", "/datum/uplink_item/device_tools", {
	name: "Chest Rig",
	desc: "A robust seven-slot set of webbing that is capable of holding all manner of tactical equipment.",
	cost: 1,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/belt/military"),
});

// /datum/uplink_item/device_tools/military_belt/proc/<init>  (code/modules/uplink/uplink_item.dm:915)
rt.def("/datum/uplink_item/device_tools/military_belt/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4352, "/datum/uplink_item/device_tools/medkit", "/datum/uplink_item/device_tools", {
	name: "Syndicate Combat Medic Kit",
	desc: "This first aid kit is a suspicious brown and red. Included is a combat stimulant injector for rapid healing, a medical HUD for quick identification of injured personnel, and other supplies helpful for a field medic.",
	cost: 4,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/firstaid/tactical"),
});

// /datum/uplink_item/device_tools/medkit/proc/<init>  (code/modules/uplink/uplink_item.dm:924)
rt.def("/datum/uplink_item/device_tools/medkit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4359, "/datum/uplink_item/device_tools/briefcase_launchpad", "/datum/uplink_item/device_tools", {
	name: "Briefcase Launchpad",
	desc: "A briefcase containing a launchpad, a device able to teleport items and people to and from targets up to three tiles away from the briefcase. Also includes a remote control. Touch the briefcase with the remote to link it.",
	surplus: 0,
	cost: 6,
	item: rt.typePath("/obj/item/briefcase_launchpad"),
});

// /datum/uplink_item/device_tools/briefcase_launchpad/proc/buy  (code/modules/uplink/uplink_item.dm:984)  may sleep
rt.def("/datum/uplink_item/device_tools/briefcase_launchpad/proc/buy", function* buy(f: Frame) {
	let L: Value = null, H: Value = null;
	f.vars = () => [L, H];
	L = (yield* g.new_(f, T("/obj/item/device/launchpad_remote"), [rt.getStep(f, live(f.args[0]), 0)]));
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (H = live(f.args[0])), "put_in_hands", [live(L)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("＀ materializes into your hands!", [live(L)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("＄！ materializes onto the floor.", [live(L)])]);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "U"] });

rt.type(4360, "/datum/uplink_item/device_tools/magboots", "/datum/uplink_item/device_tools", {
	name: "Blood-Red Magboots",
	desc: "A pair of magnetic boots with a Syndicate paintjob that assist with freer movement in space or on-station during gravitational generator failures. These reverse-engineered knockoffs of Nanotrasen's 'Advanced Magboots' slow you down in simulated-gravity environments much like the standard issue variety.",
	cost: 2,
	include_modes: null,
	item: rt.typePath("/obj/item/clothing/shoes/magboots/syndie"),
});

// /datum/uplink_item/device_tools/magboots/proc/<init>  (code/modules/uplink/uplink_item.dm:1000)
rt.def("/datum/uplink_item/device_tools/magboots/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4365, "/datum/uplink_item/device_tools/singularity_beacon", "/datum/uplink_item/device_tools", {
	name: "Power Beacon",
	desc: "When screwed to wiring attached to an electric grid and activated, this large device pulls any active gravitational singularities or tesla balls towards it. This will not work when the engine is still in containment. Because of its size, it cannot be carried. Ordering this sends you a small beacon that will teleport the larger beacon to your location upon activation.",
	cost: 14,
	exclude_modes: null,
	item: rt.typePath("/obj/item/device/sbeacondrop"),
});

// /datum/uplink_item/device_tools/singularity_beacon/proc/<init>  (code/modules/uplink/uplink_item.dm:1041)
rt.def("/datum/uplink_item/device_tools/singularity_beacon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4367, "/datum/uplink_item/device_tools/syndicate_detonator", "/datum/uplink_item/device_tools", {
	name: "Syndicate Detonator",
	desc: "The Syndicate detonator is a companion device to the Syndicate bomb. Simply press the included button and an encrypted radio frequency will instruct all live Syndicate bombs to detonate. Useful for when speed matters or you wish to synchronize multiple bomb blasts. Be sure to stand clear of the blast radius before using the detonator.",
	cost: 3,
	include_modes: null,
	item: rt.typePath("/obj/item/device/syndicatedetonator"),
});

// /datum/uplink_item/device_tools/syndicate_detonator/proc/<init>  (code/modules/uplink/uplink_item.dm:1061)
rt.def("/datum/uplink_item/device_tools/syndicate_detonator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4369, "/datum/uplink_item/device_tools/assault_pod", "/datum/uplink_item/device_tools", {
	name: "Assault Pod Targeting Device",
	desc: "Use to select the landing zone of your assault pod.",
	cost: 30,
	surplus: 0,
	include_modes: null,
	item: rt.typePath("/obj/item/device/assault_pod"),
});

// /datum/uplink_item/device_tools/assault_pod/proc/<init>  (code/modules/uplink/uplink_item.dm:1078)
rt.def("/datum/uplink_item/device_tools/assault_pod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4370, "/datum/uplink_item/device_tools/shield", "/datum/uplink_item/device_tools", {
	name: "Energy Shield",
	desc: "An incredibly useful personal shield projector, capable of reflecting energy projectiles and defending against other attacks. Pair with an Energy Sword for a killer combination.",
	cost: 16,
	surplus: 20,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/shield/energy"),
});

// /datum/uplink_item/device_tools/shield/proc/<init>  (code/modules/uplink/uplink_item.dm:1087)
rt.def("/datum/uplink_item/device_tools/shield/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4371, "/datum/uplink_item/device_tools/medgun", "/datum/uplink_item/device_tools", {
	name: "Medbeam Gun",
	desc: "A wonder of Syndicate engineering, the Medbeam gun, or Medi-Gun enables a medic to keep his fellow operatives in the fight, even while under fire.",
	cost: 15,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/medbeam"),
});

// /datum/uplink_item/device_tools/medgun/proc/<init>  (code/modules/uplink/uplink_item.dm:1095)
rt.def("/datum/uplink_item/device_tools/medgun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4372, "/datum/uplink_item/device_tools/potion", "/datum/uplink_item/device_tools", {
	name: "Sentience Potion",
	desc: "A potion recovered at great risk by undercover syndicate operatives. Using it will make any animal sentient, and bound to serve you.",
	cost: 4,
	include_modes: null,
	item: rt.typePath("/obj/item/slimepotion/sentience"),
});

// /datum/uplink_item/device_tools/potion/proc/<init>  (code/modules/uplink/uplink_item.dm:1102)
rt.def("/datum/uplink_item/device_tools/potion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4377, "/datum/uplink_item/device_tools/codespeak_manual", "/datum/uplink_item/device_tools", {
	name: "Codespeak Manual",
	desc: "Syndicate agents can be trained to use a series of codewords to convey complex information, which sounds like random concepts and drinks to anyone listening. This manual teaches you this Codespeak. You can also hit someone else with the manual in order to teach them. One use.",
	cost: 2,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/codespeak_manual"),
});

// /datum/uplink_item/device_tools/codespeak_manual/proc/<init>  (code/modules/uplink/uplink_item.dm:1138)
rt.def("/datum/uplink_item/device_tools/codespeak_manual/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4378, "/datum/uplink_item/device_tools/codespeak_manual_deluxe", "/datum/uplink_item/device_tools", {
	name: "Deluxe Codespeak Manual",
	desc: "Syndicate agents can be trained to use a series of codewords to convey complex information, which sounds like random concepts and drinks to anyone listening. This manual teaches you this Codespeak. You can also hit someone else with the manual in order to teach them. This is the deluxe edition, which has unlimited uses.",
	cost: 8,
	include_modes: null,
});

// /datum/uplink_item/device_tools/codespeak_manual_deluxe/proc/<init>  (code/modules/uplink/uplink_item.dm:1144)
rt.def("/datum/uplink_item/device_tools/codespeak_manual_deluxe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4384, "/datum/uplink_item/implants/microbomb", "/datum/uplink_item/implants", {
	name: "Microbomb Implant",
	desc: "An implant injected into the body, and later activated either manually or automatically upon death. The more implants inside of you, the higher the explosive power. This will permanently destroy your body, however.",
	cost: 2,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/imp_microbomb"),
});

// /datum/uplink_item/implants/microbomb/proc/<init>  (code/modules/uplink/uplink_item.dm:1188)
rt.def("/datum/uplink_item/implants/microbomb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4385, "/datum/uplink_item/implants/macrobomb", "/datum/uplink_item/implants", {
	name: "Macrobomb Implant",
	desc: "An implant injected into the body, and later activated either manually or automatically upon death. Upon death, releases a massive explosion that will wipe out everything nearby.",
	cost: 20,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/imp_macrobomb"),
});

// /datum/uplink_item/implants/macrobomb/proc/<init>  (code/modules/uplink/uplink_item.dm:1196)
rt.def("/datum/uplink_item/implants/macrobomb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4386, "/datum/uplink_item/cyber_implants", "/datum/uplink_item", {
	category: "Cybernetic Implants",
	surplus: 0,
	include_modes: null,
});

// /datum/uplink_item/cyber_implants/proc/<init>  (code/modules/uplink/uplink_item.dm:1203)
rt.def("/datum/uplink_item/cyber_implants/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "include_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

// /datum/uplink_item/cyber_implants/proc/spawn_item  (code/modules/uplink/uplink_item.dm:1207)  may sleep
rt.def("/datum/uplink_item/cyber_implants/proc/spawn_item", function* spawn_item(f: Frame) {
	if (!truthy(rt.sv(f, "item"))) return f.dot;
	if (truthy((rt.istype(rt.sv(f, "item"), T("/obj/item/organ")) ? 1 : 0))) {
		return (yield* g.new_(f, T("/obj/item/weapon/storage/box/cyber_implants"), [live(f.args[0]), rt.sv(f, "item")]));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["loc", "U"] });

rt.type(4392, "/datum/uplink_item/role_restricted", "/datum/uplink_item", {
	category: "Role-Restricted",
	exclude_modes: null,
	surplus: 0,
});

// /datum/uplink_item/role_restricted/proc/<init>  (code/modules/uplink/uplink_item.dm:1248)
rt.def("/datum/uplink_item/role_restricted/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/nuclear")));
	return f.dot;
});

rt.type(4393, "/datum/uplink_item/role_restricted/reverse_revolver", "/datum/uplink_item/role_restricted", {
	name: "Reverse Revolver",
	desc: "A revolver that always fires at its user. \"Accidentally\" drop your weapon, then watch as the greedy corporate pigs blow their own brains all over the wall. The revolver itself is actually real. Only clumsy people, and clowns, can fire it normally. Comes in a box of hugs. Honk.",
	cost: 14,
	restricted_roles: null,
	item: rt.typePath("/obj/item/weapon/storage/box/hug/reverse_revolver"),
});

// /datum/uplink_item/role_restricted/reverse_revolver/proc/<init>  (code/modules/uplink/uplink_item.dm:1257)
rt.def("/datum/uplink_item/role_restricted/reverse_revolver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_roles", rt.list("Clown"));
	return f.dot;
});

rt.type(4394, "/datum/uplink_item/role_restricted/mimery", "/datum/uplink_item/role_restricted", {
	name: "Guide to Advanced Mimery Series",
	desc: "The classical two part series on how to further hone your mime skills. Upon studying the series, the user should be able to make 3x1 invisible walls, and shoot bullets out of their fingers. Obviously only works for Mimes.",
	cost: 12,
	restricted_roles: null,
	surplus: 0,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/mimery"),
});

// /datum/uplink_item/role_restricted/mimery/proc/<init>  (code/modules/uplink/uplink_item.dm:1264)
rt.def("/datum/uplink_item/role_restricted/mimery/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_roles", rt.list("Mime"));
	return f.dot;
});

rt.type(4395, "/datum/uplink_item/role_restricted/ez_clean_bundle", "/datum/uplink_item/role_restricted", {
	name: "EZ Clean Grenade Bundle",
	desc: "A box with three cleaner grenades using the trademark Waffle Co. formula. Serves as a cleaner and causes acid damage to anyone standing nearby. The acid only affects carbon-based creatures.",
	cost: 6,
	surplus: 20,
	restricted_roles: null,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/ez_clean"),
});

// /datum/uplink_item/role_restricted/ez_clean_bundle/proc/<init>  (code/modules/uplink/uplink_item.dm:1273)
rt.def("/datum/uplink_item/role_restricted/ez_clean_bundle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_roles", rt.list("Janitor"));
	return f.dot;
});

rt.type(4396, "/datum/uplink_item/role_restricted/his_grace", "/datum/uplink_item/role_restricted", {
	name: "His Grace",
	desc: "An incredibly dangerous weapon recovered from a station overcome by the grey tide. Once activated, He will thirst for blood and must be used to kill to sate that thirst. His Grace grants gradual regeneration and complete stun immunity to His wielder, but be wary: if He gets too hungry, He will become impossible to drop and eventually kill you if not fed. However, if left alone for long enough, He will fall back to slumber. To activate His Grace, simply unlatch Him.",
	cost: 20,
	restricted_roles: null,
	surplus: 5,
	item: rt.typePath("/obj/item/weapon/his_grace"),
});

// /datum/uplink_item/role_restricted/his_grace/proc/<init>  (code/modules/uplink/uplink_item.dm:1283)
rt.def("/datum/uplink_item/role_restricted/his_grace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_roles", rt.list("Chaplain"));
	return f.dot;
});

rt.type(4397, "/datum/uplink_item/role_restricted/pie_cannon", "/datum/uplink_item/role_restricted", {
	name: "Banana Cream Pie Cannon",
	desc: "A special pie cannon for a special clown, this gadget can hold up to 20 pies and automatically fabricates one every two seconds!",
	cost: 10,
	restricted_roles: null,
	surplus: 0,
	item: rt.typePath("/obj/item/weapon/pneumatic_cannon/pie/selfcharge"),
});

// /datum/uplink_item/role_restricted/pie_cannon/proc/<init>  (code/modules/uplink/uplink_item.dm:1291)
rt.def("/datum/uplink_item/role_restricted/pie_cannon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_roles", rt.list("Clown"));
	return f.dot;
});

rt.type(4398, "/datum/uplink_item/role_restricted/ancient_jumpsuit", "/datum/uplink_item/role_restricted", {
	name: "Ancient Jumpsuit",
	desc: "A tattered old jumpsuit that will provide absolutely no benefit to you. It fills the wearer with a strange compulsion to blurt out 'glorf'.",
	cost: 20,
	restricted_roles: null,
	surplus: 0,
	item: rt.typePath("/obj/item/clothing/under/color/grey/glorf"),
});

// /datum/uplink_item/role_restricted/ancient_jumpsuit/proc/<init>  (code/modules/uplink/uplink_item.dm:1299)
rt.def("/datum/uplink_item/role_restricted/ancient_jumpsuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_roles", rt.list("Assistant"));
	return f.dot;
});

rt.type(4399, "/datum/uplink_item/role_restricted/haunted_magic_eightball", "/datum/uplink_item/role_restricted", {
	name: "Haunted Magic Eightball",
	desc: "Most magic eightballs are toys with dice inside. Although identical in appearance to the harmless toys, this occult device reaches into the spirit world to find its answers. Be warned, that spirits are often capricious or just little assholes. To use, simply speak your question aloud, then begin shaking.",
	cost: 2,
	restricted_roles: null,
	limited_stock: 1,
	item: rt.typePath("/obj/item/toy/eightball/haunted"),
});

// /datum/uplink_item/role_restricted/haunted_magic_eightball/proc/<init>  (code/modules/uplink/uplink_item.dm:1307)
rt.def("/datum/uplink_item/role_restricted/haunted_magic_eightball/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_roles", rt.list("Curator"));
	return f.dot;
});

rt.type(4401, "/datum/uplink_item/role_restricted/pressure_mod", "/datum/uplink_item/role_restricted", {
	name: "Kinetic Accelerator Pressure Mod",
	desc: "A modification kit which allows Kinetic Accelerators to do greatly increased damage while indoors. Occupies 35% mod capacity.",
	cost: 5,
	limited_stock: 2,
	restricted_roles: null,
	item: rt.typePath("/obj/item/borg/upgrade/modkit/indoors"),
});

// /datum/uplink_item/role_restricted/pressure_mod/proc/<init>  (code/modules/uplink/uplink_item.dm:1323)
rt.def("/datum/uplink_item/role_restricted/pressure_mod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_roles", rt.list("Shaft Miner"));
	return f.dot;
});

rt.type(4407, "/datum/uplink_item/badass/bundle", "/datum/uplink_item/badass", {
	name: "Syndicate Bundle",
	desc: "Syndicate Bundles are specialized groups of items that arrive in a plain box. These items are collectively worth more than 20 telecrystals, but you do not know which specialization you will receive.",
	cost: 20,
	exclude_modes: null,
	cant_discount: 1,
	item: rt.typePath("/obj/item/weapon/storage/box/syndicate"),
});

// /datum/uplink_item/badass/bundle/proc/<init>  (code/modules/uplink/uplink_item.dm:1368)
rt.def("/datum/uplink_item/badass/bundle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang")));
	return f.dot;
});

rt.type(4408, "/datum/uplink_item/badass/surplus", "/datum/uplink_item/badass", {
	name: "Syndicate Surplus Crate",
	desc: "A dusty crate from the back of the Syndicate warehouse. Rumored to contain a valuable assortment of items, but you never know. Contents are sorted to always be worth 50 TC.",
	cost: 20,
	player_minimum: 25,
	exclude_modes: null,
	cant_discount: 1,
	item: rt.typePath("/obj/structure/closet/crate"),
});

// /datum/uplink_item/badass/surplus/proc/<init>  (code/modules/uplink/uplink_item.dm:1378)
rt.def("/datum/uplink_item/badass/surplus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_modes", rt.list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang")));
	return f.dot;
});

// /datum/uplink_item/badass/surplus/proc/spawn_item  (code/modules/uplink/uplink_item.dm:1382)  may sleep
rt.def("/datum/uplink_item/badass/surplus/proc/spawn_item", function* spawn_item(f: Frame, loc: Value, U: Value) {
	let uplink_items: Value = null, crate_value: Value = null, C: Value = null, category: Value = null, item: Value = null, I: Value = null;
	f.vars = () => [loc, U, uplink_items, crate_value, C, category, item, I];
	uplink_items = (yield* g.call(f, P("/proc/get_uplink_items"), null, [rt.fv(f, "mode", rt.gl("SSticker"))]));
	crate_value = 50;
	C = (yield* g.new_(f, T("/obj/structure/closet/crate"), [live(loc)]));
	while (truthy(live(crate_value))) {
		category = rt.op(f, "PickUnweighted", [1], [live(uplink_items)]);
		item = rt.op(f, "PickUnweighted", [1], [rt.index(live(uplink_items), live(category))]);
		if ((!truthy(rt.gv(f, "surplus", (I = rt.index(rt.index(live(uplink_items), live(category)), live(item))))) || truthy(rt.op(f, "Prob", [], [subtract(100, rt.fv(f, "surplus", live(I)))])))) {
			continue;
		}
		if (rt.lt(live(crate_value), rt.fv(f, "cost", live(I)))) {
			continue;
		}
		(crate_value = rt.modify(live(crate_value), rt.fv(f, "cost", live(I)), subtract));
		yield* g.new_(f, rt.fv(f, "item", live(I)), [live(C)]);
		rt.modField(f, live(U), "purchase_log", fmt("<big>＀</big>", [(yield* g.call(f, P("/proc/bicon"), null, [rt.fv(f, "item", live(I))]))]), add);
	}
	return live(C);
}, true);

rt.type(4409, "/datum/uplink_item/badass/random", "/datum/uplink_item/badass", {
	name: "Random Item",
	desc: "Picking this will purchase a random item. Useful if you have some TC to spare or if you haven't decided on a strategy yet.",
	cost: 0,
	cant_discount: 1,
	item: rt.typePath("/obj/item/weapon/paper"),
});

// /datum/uplink_item/badass/random/proc/spawn_item  (code/modules/uplink/uplink_item.dm:1410)  may sleep
rt.def("/datum/uplink_item/badass/random/proc/spawn_item", function* spawn_item(f: Frame, loc: Value, U: Value) {
	let uplink_items: Value = null, possible_items: Value = null, category: Value = null, item: Value = null, I: Value = null, I_2: Value = null;
	let $e: any;
	f.vars = () => [loc, U, uplink_items, possible_items, category, item, I, I_2, $e];
	uplink_items = (yield* g.call(f, P("/proc/get_uplink_items"), null, [rt.fv(f, "mode", rt.gl("SSticker"))]));
	possible_items = rt.list();
	category = null;
	rt.forList(f, 0, live(uplink_items));
	while (($e = rt.next(f, 0)) !== undefined) {
		category = $e;
		item = null;
		rt.forList(f, 1, rt.index(live(uplink_items), live(category)));
		while (($e = rt.next(f, 1)) !== undefined) {
			item = $e;
			I = rt.index(rt.index(live(uplink_items), live(category)), live(item));
			if ((isEqual(live(f.src), live(I)) || !truthy(rt.fv(f, "item", live(I))))) {
				continue;
			}
			if (rt.lt(rt.fv(f, "telecrystals", live(U)), rt.fv(f, "cost", live(I)))) {
				continue;
			}
			possible_items = rt.modify(live(possible_items), live(I), add);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(possible_items)))) return f.dot;
	I_2 = rt.op(f, "PickUnweighted", [1], [live(possible_items)]);
	(rt.modField(f, live(U), "telecrystals", rt.fv(f, "cost", live(I_2)), subtract));
	rt.modField(f, live(U), "spent_telecrystals", rt.fv(f, "cost", live(I_2)), add);
	return (yield* g.new_(f, rt.fv(f, "item", live(I_2)), [live(loc)]));
}, true);
