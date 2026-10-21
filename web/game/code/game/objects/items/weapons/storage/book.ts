// From code/game/objects/items/weapons/storage/book.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5544, "/obj/item/weapon/storage/book", "/obj/item/weapon/storage", {
	title: "book",
	throw_speed: 2,
	throw_range: 5,
	name: "hollowed book",
	desc: "I guess someone didn't like it.",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "book",
	storage_slots: 1,
	w_class: 3,
	resistance_flags: 4,
});

// /obj/item/weapon/storage/book/proc/attack_self  (code/game/objects/items/weapons/storage/book.dm:14)
rt.def("/obj/item/weapon/storage/book/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The pages of ＀ have been cut out!</span>", [rt.sv(f, "title")])]);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalbiblenames  (code/game/objects/items/weapons/storage/book.dm:16)
rt.def("/datum/controller/global_vars/proc/InitGlobalbiblenames", function InitGlobalbiblenames(f: Frame) {
	rt.setGl("biblenames", rt.list("Bible", "Quran", "Scrapbook", "Burning Bible", "Clown Bible", "Banana Bible", "Creeper Bible", "White Bible", "Holy Light", "The God Delusion", "Tome", "The King in Yellow", "Ithaqua", "Scientology", "Melted Bible", "Necronomicon"));
	rt.modSrcVar(f, "gvars_datum_init_order", "biblenames", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalbiblestates  (code/game/objects/items/weapons/storage/book.dm:17)
rt.def("/datum/controller/global_vars/proc/InitGlobalbiblestates", function InitGlobalbiblestates(f: Frame) {
	rt.setGl("biblestates", rt.list("bible", "koran", "scrapbook", "burning", "honk1", "honk2", "creeper", "white", "holylight", "atheist", "tome", "kingyellow", "ithaqua", "scientology", "melted", "necronomicon"));
	rt.modSrcVar(f, "gvars_datum_init_order", "biblestates", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalbibleitemstates  (code/game/objects/items/weapons/storage/book.dm:18)
rt.def("/datum/controller/global_vars/proc/InitGlobalbibleitemstates", function InitGlobalbibleitemstates(f: Frame) {
	rt.setGl("bibleitemstates", rt.list("bible", "koran", "scrapbook", "bible", "bible", "bible", "syringe_kit", "syringe_kit", "syringe_kit", "syringe_kit", "syringe_kit", "kingyellow", "ithaqua", "scientology", "melted", "necronomicon"));
	rt.modSrcVar(f, "gvars_datum_init_order", "bibleitemstates", add);
	return f.dot;
});

rt.type(5545, "/obj/item/weapon/storage/book/bible", "/obj/item/weapon/storage/book", {
	affecting: null,
	deity_name: "Christ",
	name: "bible",
	desc: "Apply to head repeatedly.",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "bible",
	item_state: "bible",
	force_string: "holy",
});

// /obj/item/weapon/storage/book/bible/proc/suicide_act  (code/game/objects/items/weapons/storage/book.dm:31)
rt.def("/obj/item/weapon/storage/book/bible/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is offering ＀self to ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_them", []), rt.sv(f, "deity_name"), rt.callName(f, live(user), "p_theyre", [])])]);
	return 1;
});

// /obj/item/weapon/storage/book/bible/proc/attack_self  (code/game/objects/items/weapons/storage/book.dm:35)
rt.def("/obj/item/weapon/storage/book/bible/proc/attack_self", function attack_self(f: Frame, H: Value) {
	let dat: Value = null, i: Value = null, bibleicon: Value = null, nicename: Value = null;
	let $e: any;
	f.vars = () => [dat, i, bibleicon, nicename, $e];
	if (!truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!(!truthy(rt.fv(f, "bible_icon_state", rt.gl("SSreligion"))) && isEqual(rt.fv(f, "job", live(H)), "Chaplain"))) return f.dot;
	dat = "<html><head><title>Pick Bible Style</title></head><body><center><h2>Pick a bible style</h2></center><table>";
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, rt.gl("biblestates")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		bibleicon = rt.call(f, P("/proc/icon"), null, [rt.rsc("icons/obj/storage.dmi"), rt.index(rt.gl("biblestates"), live(i))]);
		nicename = rt.index(rt.gl("biblenames"), live(i));
		rt.op(f, "BrowseResource", [], [live(H), live(bibleicon), live(nicename)], false);
		dat = rt.modify(live(dat), fmt("<tr><td><img src=\"＀\"></td><td><a href=\"?src=＃;seticon=＀\">＀</a></td></tr>", [live(nicename), live(f.src), live(i), live(nicename)]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "</table></body></html>", add);
	rt.op(f, "Browse", [], [live(H), live(dat), "window=editicon;can_close=0;can_minimize=0;size=250x650"], false);
	return f.dot;
});

// /obj/item/weapon/storage/book/bible/proc/Topic  (code/game/objects/items/weapons/storage/book.dm:49)  may sleep
rt.def("/obj/item/weapon/storage/book/bible/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let iconi: Value = null, biblename: Value = null, B: Value = null, H: Value = null;
	f.vars = () => [href, href_list, iconi, biblename, B, H];
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) {
		return live(f.dot);
	}
	if (!((truthy(rt.at(live(href_list), "seticon")) && truthy(rt.gl("SSreligion"))) && !truthy(rt.fv(f, "bible_icon_state", rt.gl("SSreligion"))))) return f.dot;
	iconi = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "seticon")]));
	// The href's icon number must be a real choice (a whole number in range), and the book is this one: tg located any object named by "src".
	if (!(typeof iconi === "number" && Number.isInteger(iconi) && iconi >= 1 && iconi <= rt.len(f, rt.gl("biblestates")))) return f.dot;
	biblename = rt.index(rt.gl("biblenames"), live(iconi));
	rt.setFv(f, "icon_state", (B = live(f.src)), rt.index(rt.gl("biblestates"), live(iconi)));
	rt.setFv(f, "item_state", live(B), rt.index(rt.gl("bibleitemstates"), live(iconi)));
	if ((isEqual(rt.fv(f, "icon_state", live(B)), "honk1") || isEqual(rt.fv(f, "icon_state", live(B)), "honk2"))) {
		yield* g.callName(f, rt.gv(f, "dna", (H = live(f.usr))), "add_mutation", ["Clumsiness"]);
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/mask/gas/clown_hat"), [live(H)])), 2]);
	}
	rt.setFv(f, "bible_icon_state", rt.gl("SSreligion"), rt.fv(f, "icon_state", live(B)));
	rt.setFv(f, "bible_item_state", rt.gl("SSreligion"), rt.fv(f, "item_state", live(B)));
	rt.op(f, "Browse", [], [live(f.usr), null, "window=editicon"], false);
	return f.dot;
}, true);

// /obj/item/weapon/storage/book/bible/proc/bless  (code/game/objects/items/weapons/storage/book.dm:70)  may sleep
rt.def("/obj/item/weapon/storage/book/bible/proc/bless", function* bless(f: Frame, H: Value, user: Value) {
	let X: Value = null, BP: Value = null, heal_amt: Value = null, hurt_limbs: Value = null, X_2: Value = null, affecting: Value = null;
	let $e: any;
	f.vars = () => [H, user, X, BP, heal_amt, hurt_limbs, X_2, affecting, $e];
	X = null;
	rt.forList(f, 0, rt.fv(f, "bodyparts", live(H)));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (isEqual(rt.gv(f, "status", (BP = live(X))), 2)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ refuses to heal this metallic taint!</span>", [rt.fv(f, "deity_name", live(f.src))])]);
			return 0;
		}
	}
	rt.endFor(f, 0);
	heal_amt = 10;
	if (truthy(rt.getLen(f, (hurt_limbs = (yield* g.callName(f, live(H), "get_damaged_bodyparts", [1, 1])))))) {
		X_2 = null;
		rt.forList(f, 0, live(hurt_limbs));
		while (($e = rt.next(f, 0)) !== undefined) {
			X_2 = $e;
			if (truthy((yield* g.callName(f, (affecting = live(X_2)), "heal_damage", [live(heal_amt), live(heal_amt)])))) {
				yield* g.callName(f, live(H), "update_damage_overlays", []);
			}
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(H), "visible_message", [fmt("<span class='notice'>＀ heals ＀ with the power of ＀!</span>", [live(user), live(H), rt.sv(f, "deity_name")])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='boldnotice'>May the power of ＀ compel you to be healed!</span>", [rt.sv(f, "deity_name")])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "punch", 25, 1, -1]);
	}
	return 1;
}, true);

// /obj/item/weapon/storage/book/bible/proc/attack  (code/game/objects/items/weapons/storage/book.dm:91)  may sleep
rt.def("/obj/item/weapon/storage/book/bible/proc/attack", function* attack(f: Frame) {
	let chaplain: Value = null, smack: Value = null, C: Value = null;
	f.vars = () => [chaplain, smack, C];
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (!truthy((yield* g.callName(f, live(f.args[1]), "IsAdvancedToolUser", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
		return live(f.dot);
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[1])), 256)) && truthy(rt.op(f, "Prob", [], [50])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='danger'>＀ slips out of your hand and hits your head.</span>", [live(f.src)])]);
		yield* g.callName(f, live(f.args[1]), "take_bodypart_damage", [10]);
		yield* g.callName(f, live(f.args[1]), "Unconscious", [400]);
		return live(f.dot);
	}
	chaplain = 0;
	if ((truthy(rt.fv(f, "mind", live(f.args[1]))) && truthy(rt.gv(f, "isholy", rt.fv(f, "mind", live(f.args[1])))))) {
		chaplain = 1;
	}
	if (!truthy(live(chaplain))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>The book sizzles in your hands.</span>"]);
		yield* g.callName(f, live(f.args[1]), "take_bodypart_damage", [0, 10]);
		return live(f.dot);
	}
	if (!truthy(live(f.args[2]))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	smack = 1;
	if (!isEqual(rt.fv(f, "stat", live(f.args[0])), 2)) {
		if ((truthy(live(chaplain)) && isEqual(live(f.args[1]), live(f.args[0])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't heal yourself!</span>"]);
			return live(f.dot);
		}
		if (((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy(rt.op(f, "Prob", [], [60]))) && truthy((yield* g.srcCall(f, "bless", live(f.args[0]), live(f.args[1])))))) {
			smack = 0;
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
				if (!truthy((rt.istype(rt.gv(f, "head", (C = live(f.args[0]))), T("/obj/item/clothing/head/helmet")) ? 1 : 0))) {
					yield* g.callName(f, live(C), "adjustBrainLoss", [10]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='danger'>You feel dumber.</span>"]);
				}
			}
		}
		if (truthy(live(smack))) {
			yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ beats ＀ over the head with ＀!</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ beats ＀ over the head with ＀!</span>", [live(f.args[1]), live(f.args[0]), live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "punch", 25, 1, -1]);
			yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), "attacked", live(f.src)]);
		}
	} else {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ smacks ＀'s lifeless corpse with ＀.</span>", [live(f.args[1]), live(f.args[0]), live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "punch", 25, 1, -1]);
	}
	return f.dot;
}, true, { args: ["M", "user", "heal_mode"] });

// /obj/item/weapon/storage/book/bible/proc/afterattack  (code/game/objects/items/weapons/storage/book.dm:139)  may sleep
rt.def("/obj/item/weapon/storage/book/bible/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let R: Value = null, water2holy: Value = null, unholy2clean: Value = null;
	let $e: any;
	f.vars = () => [A, user, proximity, R, water2holy, unholy2clean, $e];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(A), T("/turf/open/floor")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You hit the floor with the bible.</span>"]);
		if ((truthy(rt.fv(f, "mind", live(user))) && truthy(rt.gv(f, "isholy", rt.fv(f, "mind", live(user)))))) {
			R = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [2, live(user)])), T("/obj/effect/rune"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				rt.setFv(f, "invisibility", live(R), 0);
			}
			rt.endFor(f, 0);
		}
	}
	if (!(truthy(rt.fv(f, "mind", live(user))) && truthy(rt.gv(f, "isholy", rt.fv(f, "mind", live(user)))))) return f.dot;
	if ((truthy(rt.fv(f, "reagents", live(A))) && truthy((yield* g.callName(f, rt.fv(f, "reagents", live(A)), "has_reagent", ["water"]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You bless ＀.</span>", [live(A)])]);
		water2holy = (yield* g.callName(f, rt.fv(f, "reagents", live(A)), "get_reagent_amount", ["water"]));
		yield* g.callName(f, rt.fv(f, "reagents", live(A)), "del_reagent", ["water"]);
		yield* g.callName(f, rt.fv(f, "reagents", live(A)), "add_reagent", ["holywater", live(water2holy)]);
	}
	if (!(truthy(rt.fv(f, "reagents", live(A))) && truthy((yield* g.callName(f, rt.fv(f, "reagents", live(A)), "has_reagent", ["unholywater"]))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You purify ＀.</span>", [live(A)])]);
	unholy2clean = (yield* g.callName(f, rt.fv(f, "reagents", live(A)), "get_reagent_amount", ["unholywater"]));
	yield* g.callName(f, rt.fv(f, "reagents", live(A)), "del_reagent", ["unholywater"]);
	yield* g.callName(f, rt.fv(f, "reagents", live(A)), "add_reagent", ["holywater", live(unholy2clean)]);
	return f.dot;
}, true);

rt.type(5546, "/obj/item/weapon/storage/book/bible/booze", "/obj/item/weapon/storage/book/bible", {
	desc: "To be applied to the head repeatedly.",
});

// /obj/item/weapon/storage/book/bible/booze/proc/PopulateContents  (code/game/objects/items/weapons/storage/book.dm:162)  may sleep
rt.def("/obj/item/weapon/storage/book/bible/booze/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5547, "/obj/item/weapon/storage/book/bible/syndicate", "/obj/item/weapon/storage/book/bible", {
	uses: 1,
	deity_name: "The Syndicate",
	throw_speed: 2,
	throw_range: 7,
	icon_state: "ebook",
	throwforce: 18,
	force: 18,
	hitsound: rt.rsc("sound/weapons/sear.ogg"),
	damtype: "fire",
	name: "Syndicate Tome",
	attack_verb: null,
});

// /obj/item/weapon/storage/book/bible/syndicate/proc/attack_self  (code/game/objects/items/weapons/storage/book.dm:182)  may sleep
rt.def("/obj/item/weapon/storage/book/bible/syndicate/proc/attack_self", function* attack_self(f: Frame, H: Value) {
	let ownername: Value = null;
	f.vars = () => [H, ownername];
	if (!truthy(rt.sv(f, "uses"))) return f.dot;
	rt.setFv(f, "isholy", rt.fv(f, "mind", live(H)), 1);
	(rt.modSrcVar(f, "uses", 1, subtract));
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='userdanger'>You try to open the book AND IT BITES YOU!</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/snap.ogg"), 50, 1]);
	yield* g.callName(f, live(H), "apply_damage", [5, "brute", rt.op(f, "PickUnweighted", [2], ["l_arm", "r_arm"])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>Your name appears on the inside cover, in blood.</span>"]);
	rt.modSrcVar(f, "desc", fmt("<span class='warning'>The name ＀ is written in blood inside the cover.</span>", [(ownername = rt.fv(f, "real_name", live(H)))]), add);
	return f.dot;
}, true);

// /obj/item/weapon/storage/book/bible/syndicate/proc/attack  (code/game/objects/items/weapons/storage/book.dm:191)  may sleep
rt.def("/obj/item/weapon/storage/book/bible/syndicate/proc/attack", function* attack(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help")) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return (yield* g.callSuper(f, [null, live(f.args[0]), null, live(f.args[1]), "heal_mode", 0], rt.Args.Named));
}, true, { args: ["M", "user", "heal_mode"] });
