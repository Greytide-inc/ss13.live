// From code/game/gamemodes/gang/gang.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalgang_name_pool  (code/game/gamemodes/gang/gang.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalgang_name_pool", function InitGlobalgang_name_pool(f: Frame) {
	rt.setGl("gang_name_pool", rt.list("Clandestine", "Prima", "Zero-G", "Max", "Blasto", "Waffle", "North", "Omni", "Newton", "Cyber", "Donk", "Gene", "Gib", "Tunnel", "Diablo", "Psyke", "Osiron", "Sirius", "Sleeping Carp"));
	rt.modSrcVar(f, "gvars_datum_init_order", "gang_name_pool", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalgang_colors_pool  (code/game/gamemodes/gang/gang.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobalgang_colors_pool", function InitGlobalgang_colors_pool(f: Frame) {
	rt.setGl("gang_colors_pool", rt.list("red", "orange", "yellow", "green", "blue", "purple", "white"));
	rt.modSrcVar(f, "gvars_datum_init_order", "gang_colors_pool", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalgang_outfit_pool  (code/game/gamemodes/gang/gang.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalgang_outfit_pool", function InitGlobalgang_outfit_pool(f: Frame) {
	rt.setGl("gang_outfit_pool", rt.list(T("/obj/item/clothing/suit/jacket/leather"), T("/obj/item/clothing/suit/jacket/leather/overcoat"), T("/obj/item/clothing/suit/jacket/puffer"), T("/obj/item/clothing/suit/jacket/miljacket"), T("/obj/item/clothing/suit/jacket/puffer"), T("/obj/item/clothing/suit/pirate"), T("/obj/item/clothing/suit/poncho"), T("/obj/item/clothing/suit/apron/overalls"), T("/obj/item/clothing/suit/jacket/letterman")));
	rt.modSrcVar(f, "gvars_datum_init_order", "gang_outfit_pool", add);
	return f.dot;
});

// /proc/is_gangster  (code/game/gamemodes/gang/gang.dm:13)
rt.def("/proc/is_gangster", function is_gangster(f: Frame, M: Value) {
	return (((rt.istype(live(M), T("/mob/living")) ? 1 : 0) && rt.fv(f, "mind", live(M))) && rt.gv(f, "gang_datum", rt.fv(f, "mind", live(M))));
});

// /proc/is_in_gang  (code/game/gamemodes/gang/gang.dm:16)
rt.def("/proc/is_in_gang", function is_in_gang(f: Frame, M: Value, gang_type: Value) {
	let G: Value = null;
	f.vars = () => [G];
	if ((!truthy(rt.call(f, P("/proc/is_gangster"), null, [live(M)])) || !truthy(live(gang_type)))) {
		return 0;
	}
	if (isEqual(rt.gv(f, "name", (G = rt.gv(f, "gang_datum", rt.fv(f, "mind", live(M))))), live(gang_type))) {
		return 1;
	}
	return 0;
});

rt.type(1093, "/datum/game_mode/gang", "/datum/game_mode", {
	name: "gang war",
	config_tag: "gang",
	antag_flag: "gangster",
	restricted_jobs: null,
	required_players: 20,
	required_enemies: 2,
	recommended_enemies: 2,
	announce_span: "danger",
	announce_text: "A violent turf war has erupted on the station!\n<span class='danger'>Gangsters</span>: Take over the station with a dominator.\n<span class='notice'>Crew</span>: Prevent the gangs from expanding and initiating takeover.",
});

// /datum/game_mode/gang/proc/pre_setup  (code/game/gamemodes/gang/gang.dm:42)  may sleep
rt.def("/datum/game_mode/gang/proc/pre_setup", function* pre_setup(f: Frame) {
	let gangs_to_create: Value = null, i: Value = null, G: Value = null, n: Value = null, boss: Value = null, title: Value = null;
	let $e: any;
	f.vars = () => [gangs_to_create, i, G, n, boss, title, $e];
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", rt.sv(f, "protected_jobs"), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", "Assistant", add);
	}
	gangs_to_create = 2;
	if (truthy(rt.op(f, "Prob", [], [multiply((yield* g.srcCall(f, "num_players")), 2)]))) {
		gangs_to_create = rt.inc(live(gangs_to_create), 1);
	}
	i = null;
	rt.forRange(f, 0, 1, live(gangs_to_create), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy(rt.len(f, rt.sv(f, "antag_candidates")))) {
			break;
		}
		rt.modSrcVar(f, "gangs", (G = (yield* g.new_(f, T("/datum/gang"), []))), add);
		n = null;
		rt.forRange(f, 1, 1, 3, 1);
		while (($e = rt.next(f, 1)) !== undefined) {
			n = $e;
			(rt.modSrcVar(f, "antag_candidates", (boss = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "antag_candidates")])), subtract));
			rt.setAt(rt.fv(f, "bosses", live(G)), live(boss), 20);
			rt.setFv(f, "gang_datum", live(boss), live(G));
			title = null;
			if (isEqual(live(n), 1)) {
				title = "Boss";
			} else {
				title = "Lieutenant";
			}
			rt.setFv(f, "special_role", live(boss), fmt("＀ Gang ＀", [rt.fv(f, "name", live(G)), live(title)]));
			rt.setFv(f, "restricted_roles", live(boss), rt.sv(f, "restricted_jobs"));
			yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has been selected as the ＀ for the ＀ Gang", [rt.fv(f, "key", live(boss)), live(title), rt.fv(f, "name", live(G))])]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	if (rt.lt(rt.len(f, rt.sv(f, "gangs")), 2)) {
		return 0;
	}
	return 1;
}, true);

// /datum/game_mode/gang/proc/post_setup  (code/game/gamemodes/gang/gang.dm:84)  may sleep
rt.def("/datum/game_mode/gang/proc/post_setup", function* post_setup(f: Frame) {
	let G: Value = null, boss_mind: Value = null;
	let $e: any;
	f.vars = () => [G, boss_mind, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [10, 100]))]);
	G = null;
	rt.forList(f, 0, rt.sv(f, "gangs"), T("/datum/gang"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		boss_mind = null;
		rt.forList(f, 1, rt.fv(f, "bosses", live(G)), T("/datum/mind"));
		while (($e = rt.next(f, 1)) !== undefined) {
			boss_mind = $e;
			rt.setAt(rt.fv(f, "bosses", live(G)), live(boss_mind), 20);
			yield* g.callName(f, live(G), "add_gang_hud", [live(boss_mind)]);
			yield* g.srcCall(f, "forge_gang_objectives", live(boss_mind));
			yield* g.srcCall(f, "greet_gang", live(boss_mind));
			yield* g.srcCall(f, "equip_gang", rt.fv(f, "current", live(boss_mind)), live(G));
			rt.modSrcVar(f, "modePlayer", live(boss_mind), add);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /datum/game_mode/proc/forge_gang_objectives  (code/game/gamemodes/gang/gang.dm:97)
rt.def("/datum/game_mode/proc/forge_gang_objectives", function forge_gang_objectives(f: Frame, boss_mind: Value) {
	let rival_obj: Value = null;
	f.vars = () => [rival_obj];
	rt.setFv(f, "owner", (rival_obj = rt.new_(f, T("/datum/objective"), [])), live(boss_mind));
	rt.setFv(f, "explanation_text", live(rival_obj), "Be the first gang to successfully takeover the station with a Dominator.");
	rt.modField(f, live(boss_mind), "objectives", live(rival_obj), add);
	return f.dot;
});

// /datum/game_mode/proc/greet_gang  (code/game/gamemodes/gang/gang.dm:104)
rt.def("/datum/game_mode/proc/greet_gang", function greet_gang(f: Frame, boss_mind: Value, you_are: Value) {
	f.vars = () => [you_are];
	if (live(you_are) === null) {
		you_are = 1;
	}
	if (truthy(live(you_are))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(boss_mind)), fmt("<FONT size=3 color=red><B>You are the Boss of the ＀ Gang!</B></FONT>", [rt.gv(f, "name", rt.fv(f, "gang_datum", live(boss_mind)))])]);
	}
	rt.callName(f, live(boss_mind), "announce_objectives", []);
	return f.dot;
});

// /datum/game_mode/proc/equip_gang  (code/game/gamemodes/gang/gang.dm:111)  may sleep
rt.def("/datum/game_mode/proc/equip_gang", function* equip_gang(f: Frame, mob: Value, gang: Value) {
	let gangtool: Value = null, _T: Value = null, SC: Value = null, C: Value = null, slots: Value = null, where: Value = null, where2: Value = null, where3: Value = null, where4: Value = null;
	f.vars = () => [mob, gang, gangtool, _T, SC, C, slots, where, where2, where3, where4];
	if (!truthy((rt.istype(live(mob), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "mind", live(mob)))) {
		if (isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(mob))), "Clown")) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(mob), "Your training has allowed you to overcome your clownish nature, allowing you to wield weapons without harming yourself."]);
			yield* g.callName(f, rt.fv(f, "dna", live(mob)), "remove_mutation", ["Clumsiness"]);
		}
	}
	gangtool = (yield* g.new_(f, T("/obj/item/device/gangtool"), [live(mob)]));
	_T = (yield* g.new_(f, T("/obj/item/weapon/pen/gang"), [live(mob)]));
	SC = (yield* g.new_(f, T("/obj/item/toy/crayon/spraycan/gang"), [live(mob), live(gang)]));
	C = (yield* g.new_(f, T("/obj/item/clothing/glasses/hud/security/chameleon"), [live(mob), live(gang)]));
	slots = rt.alist(f, ["backpack", 18, "left pocket", 15, "right pocket", 16]);
	f.dot = 0;
	if (!truthy((where = (yield* g.callName(f, live(mob), "equip_in_one_of_slots", [live(gangtool), live(slots)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), "Your Syndicate benefactors were unfortunately unable to get you a Gangtool."]);
		f.dot = rt.modify(live(f.dot), 1, add);
	} else {
		yield* g.callName(f, live(gangtool), "register_device", [live(mob)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), fmt("The <b>Gangtool</b> in your ＀ will allow you to purchase weapons and equipment, send messages to your gang, and recall the emergency shuttle from anywhere on the station.", [live(where)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), "As the gang boss, you can also promote your gang members to <b>lieutenant</b>. Unlike regular gangsters, Lieutenants cannot be deconverted and are able to use recruitment pens and gangtools."]);
	}
	if (!truthy((where2 = (yield* g.callName(f, live(mob), "equip_in_one_of_slots", [live(_T), live(slots)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), "Your Syndicate benefactors were unfortunately unable to get you a recruitment pen to start."]);
		f.dot = rt.modify(live(f.dot), 1, add);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), fmt("The <b>recruitment pen</b> in your ＀ will help you get your gang started. Stab unsuspecting crew members with it to recruit them.", [live(where2)])]);
	}
	if (!truthy((where3 = (yield* g.callName(f, live(mob), "equip_in_one_of_slots", [live(SC), live(slots)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), "Your Syndicate benefactors were unfortunately unable to get you a territory spraycan to start."]);
		f.dot = rt.modify(live(f.dot), 1, add);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), fmt("The <b>territory spraycan</b> in your ＀ can be used to claim areas of the station for your gang. The more territory your gang controls, the more influence you get. All gangsters can use these, so distribute them to grow your influence faster.", [live(where3)])]);
	}
	if (!truthy((where4 = (yield* g.callName(f, live(mob), "equip_in_one_of_slots", [live(C), live(slots)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), "Your Syndicate benefactors were unfortunately unable to get you a chameleon security HUD."]);
		f.dot = rt.modify(live(f.dot), 1, add);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), fmt("The <b>chameleon security HUD</b> in your ＀ will help you keep track of who is mindshield-implanted, and unable to be recruited.", [live(where4)])]);
	}
	return live(f.dot);
}, true);

// /datum/game_mode/proc/add_gangster  (code/game/gamemodes/gang/gang.dm:168)  may sleep
rt.def("/datum/game_mode/proc/add_gangster", function* add_gangster(f: Frame, gangster_mind: Value, G: Value, check: Value) {
	let carbon_mob: Value = null;
	f.vars = () => [gangster_mind, G, check, carbon_mob];
	if (live(check) === null) {
		check = 1;
	}
	if (((!truthy(live(G)) || truthy((rt.isIn(f, live(gangster_mind), (yield* g.srcCall(f, "get_all_gangsters"))) ? 1 : 0))) || (truthy(rt.fv(f, "enslaved_to", live(gangster_mind))) && !truthy((yield* g.call(f, P("/proc/is_gangster"), null, [rt.fv(f, "enslaved_to", live(gangster_mind))])))))) {
		if ((truthy((yield* g.call(f, P("/proc/is_in_gang"), null, [rt.fv(f, "current", live(gangster_mind)), rt.fv(f, "name", live(G))]))) && !truthy((rt.isIn(f, live(gangster_mind), (yield* g.srcCall(f, "get_gang_bosses"))) ? 1 : 0)))) {
			return 3;
		}
		return 0;
	}
	if ((truthy(live(check)) && truthy((yield* g.callName(f, rt.fv(f, "current", live(gangster_mind)), "isloyal", []))))) {
		return 1;
	}
	rt.setAt(rt.fv(f, "gangsters", live(G)), live(gangster_mind), 5);
	rt.setFv(f, "gang_datum", live(gangster_mind), live(G));
	if (truthy(live(check))) {
		if (truthy((rt.istype(rt.fv(f, "current", live(gangster_mind)), T("/mob/living/carbon")) ? 1 : 0))) {
			rt.setFv(f, "silent", (carbon_mob = rt.fv(f, "current", live(gangster_mind))), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "silent", live(carbon_mob)), 5])));
			yield* g.callName(f, live(carbon_mob), "flash_act", [1, 1]);
		}
		yield* g.callName(f, rt.fv(f, "current", live(gangster_mind)), "Stun", [100]);
	}
	if (truthy(rt.fv(f, "is_deconvertible", live(G)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(gangster_mind)), fmt("<FONT size=3 color=red><B>You are now a member of the ＀ Gang!</B></FONT>", [rt.fv(f, "name", live(G))])]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(gangster_mind)), "<font color='red'>Help your bosses take over the station by claiming territory with <b>special spraycans</b> only they can provide. Simply spray on any unclaimed area of the station.</font>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(gangster_mind)), "<font color='red'>Their ultimate objective is to take over the station with a Dominator machine.</font>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(gangster_mind)), fmt("<font color='red'>You can identify your bosses by their <b>large, bright ＀ [G] icon</b>.</font>", [rt.fv(f, "color", live(G))])]);
		yield* g.callName(f, live(gangster_mind), "store_memory", [fmt("You are a member of the ＀ Gang!", [rt.fv(f, "name", live(G))])]);
	}
	yield* g.callName(f, rt.fv(f, "current", live(gangster_mind)), "log_message", [fmt("<font color='red'>Has been converted to the ＀ Gang!</font>", [rt.fv(f, "name", live(G))]), "Attack log"]);
	rt.setFv(f, "special_role", live(gangster_mind), fmt("＀ Gangster", [rt.fv(f, "name", live(G))]));
	yield* g.callName(f, live(G), "add_gang_hud", [live(gangster_mind)]);
	if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [rt.fv(f, "current", live(gangster_mind)), "gangster"])))) {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/datum/game_mode/proc/replace_jobbaned_player"), rt.fv(f, "current", live(gangster_mind)), "gangster", "gangster"]);
	}
	return 2;
}, true);

// /datum/game_mode/proc/remove_gangster  (code/game/gamemodes/gang/gang.dm:200)  may sleep
rt.def("/datum/game_mode/proc/remove_gangster", function* remove_gangster(f: Frame, gangster_mind: Value, beingborged: Value, silent: Value, remove_bosses: Value) {
	let gang: Value = null, O: Value = null, removed: Value = null, G: Value = null, tags_cache: Value = null, v: Value = null, c: Value = null;
	let $e: any;
	f.vars = () => [gangster_mind, beingborged, silent, remove_bosses, gang, O, removed, G, tags_cache, v, c, $e];
	if (live(remove_bosses) === null) {
		remove_bosses = 0;
	}
	gang = rt.fv(f, "gang_datum", live(gangster_mind));
	O = null;
	rt.forList(f, 0, rt.gv(f, "contents", rt.fv(f, "current", live(gangster_mind))), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (truthy((rt.istype(live(O), T("/obj/item/device/gangtool/soldier")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(gang))) {
		return 0;
	}
	removed = null;
	G = null;
	rt.forList(f, 0, rt.sv(f, "gangs"), T("/datum/gang"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if ((!truthy(rt.fv(f, "is_deconvertible", live(G))) && !truthy(live(remove_bosses)))) {
			return 0;
		}
		if (truthy((rt.isIn(f, live(gangster_mind), rt.fv(f, "gangsters", live(G))) ? 1 : 0))) {
			yield* g.callName(f, live(G), "reclaim_points", [rt.index(rt.fv(f, "gangsters", live(G)), live(gangster_mind))]);
			(rt.modField(f, live(G), "gangsters", live(gangster_mind), subtract));
			removed = 1;
		}
		if ((truthy(live(remove_bosses)) && truthy((rt.isIn(f, live(gangster_mind), rt.fv(f, "bosses", live(G))) ? 1 : 0)))) {
			yield* g.callName(f, live(G), "reclaim_points", [rt.index(rt.fv(f, "bosses", live(G)), live(gangster_mind))]);
			(rt.modField(f, live(G), "bosses", live(gangster_mind), subtract));
			removed = 1;
		}
		if ((truthy(rt.index(rt.fv(f, "tags_by_mind", live(G)), live(gangster_mind))) && truthy((rt.istype(rt.index(rt.fv(f, "tags_by_mind", live(G)), live(gangster_mind)), T("/list")) ? 1 : 0)))) {
			tags_cache = rt.index(rt.fv(f, "tags_by_mind", live(G)), live(gangster_mind));
			v = null;
			rt.forList(f, 1, live(tags_cache));
			while (($e = rt.next(f, 1)) !== undefined) {
				v = $e;
				yield* g.callName(f, (c = live(v)), "set_mind_owner", [null]);
			}
			rt.endFor(f, 1);
			(rt.modField(f, live(G), "tags_by_mind", live(gangster_mind), subtract));
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(removed))) {
		return 0;
	}
	rt.setFv(f, "special_role", live(gangster_mind), null);
	rt.setFv(f, "gang_datum", live(gangster_mind), null);
	if (rt.lt(live(silent), 2)) {
		yield* g.callName(f, rt.fv(f, "current", live(gangster_mind)), "log_message", [fmt("<font color='red'>Has reformed and defected from the ＀ Gang!</font>", [rt.fv(f, "name", live(gang))]), "Attack log"]);
		if (truthy(live(beingborged))) {
			if (!truthy(live(silent))) {
				yield* g.callName(f, rt.fv(f, "current", live(gangster_mind)), "visible_message", ["The frame beeps contentedly from the MMI before initalizing it."]);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(gangster_mind)), "<FONT size=3 color=red><B>The frame's firmware detects and deletes your criminal behavior! You are no longer a gangster!</B></FONT>"]);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been borged while being a member of the ＀ Gang. They are no longer a gangster.", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.fv(f, "current", live(gangster_mind))])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.fv(f, "current", live(gangster_mind))]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.fv(f, "current", live(gangster_mind))])]), rt.fv(f, "name", live(gang))])]);
		} else {
			if (!truthy(live(silent))) {
				yield* g.callName(f, rt.fv(f, "current", live(gangster_mind)), "Unconscious", [100]);
				yield* g.callName(f, rt.fv(f, "current", live(gangster_mind)), "visible_message", [fmt("<FONT size=3><B>＀ looks like they've given up the life of crime!<B></font>", [rt.fv(f, "current", live(gangster_mind))])]);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(gangster_mind)), "<FONT size=3 color=red><B>You have been reformed! You are no longer a gangster!</B><BR>You try as hard as you can, but you can't seem to recall any of the identities of your former gangsters...</FONT>"]);
			rt.setFv(f, "memory", live(gangster_mind), "");
		}
	}
	yield* g.callName(f, live(gang), "remove_gang_hud", [live(gangster_mind)]);
	return 1;
}, true);

// /datum/game_mode/proc/get_all_gangsters  (code/game/gamemodes/gang/gang.dm:257)
rt.def("/datum/game_mode/proc/get_all_gangsters", function get_all_gangsters(f: Frame) {
	let all_gangsters: Value = null;
	f.vars = () => [all_gangsters];
	all_gangsters = rt.list();
	all_gangsters = rt.modify(live(all_gangsters), rt.callSrc(f, "get_gangsters", []), add);
	return (all_gangsters = rt.modify(live(all_gangsters), rt.callSrc(f, "get_gang_bosses", []), add));
});

// /datum/game_mode/proc/get_gangsters  (code/game/gamemodes/gang/gang.dm:263)
rt.def("/datum/game_mode/proc/get_gangsters", function get_gangsters(f: Frame) {
	let gangsters: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [gangsters, G, $e];
	gangsters = rt.list();
	G = null;
	rt.forList(f, 0, rt.sv(f, "gangs"), T("/datum/gang"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		gangsters = rt.modify(live(gangsters), rt.fv(f, "gangsters", live(G)), add);
	}
	rt.endFor(f, 0);
	return live(gangsters);
});

// /datum/game_mode/proc/get_gang_bosses  (code/game/gamemodes/gang/gang.dm:269)
rt.def("/datum/game_mode/proc/get_gang_bosses", function get_gang_bosses(f: Frame) {
	let gang_bosses: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [gang_bosses, G, $e];
	gang_bosses = rt.list();
	G = null;
	rt.forList(f, 0, rt.sv(f, "gangs"), T("/datum/gang"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		gang_bosses = rt.modify(live(gang_bosses), rt.fv(f, "bosses", live(G)), add);
	}
	rt.endFor(f, 0);
	return live(gang_bosses);
});

// /datum/game_mode/proc/shuttle_check  (code/game/gamemodes/gang/gang.dm:275)  may sleep
rt.def("/datum/game_mode/proc/shuttle_check", function* shuttle_check(f: Frame) {
	let alive: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [alive, L, $e];
	if (truthy(rt.fv(f, "emergencyNoRecall", rt.gl("SSshuttle")))) {
		return live(f.dot);
	}
	alive = 0;
	L = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (!isEqual(rt.fv(f, "stat", live(L)), 2)) {
			alive = rt.inc(live(alive), 1);
		}
	}
	rt.endFor(f, 0);
	if (!(rt.lt(live(alive), multiply(rt.len(f, rt.gl("joined_player_list")), 0.4000000059604645)) && rt.gt((yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "timeLeft", [1])), multiply(rt.fv(f, "emergencyCallTime", rt.gl("SSshuttle")), 0.4000000059604645)))) return f.dot;
	rt.setFv(f, "emergencyNoRecall", rt.gl("SSshuttle"), 1);
	yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "request", [null, null, "set_coefficient", 0.4000000059604645], rt.Args.Named);
	yield* g.call(f, P("/proc/priority_announce"), null, ["Catastrophic casualties detected: crisis shuttle protocols activated - jamming recall signals across all frequencies."]);
	return f.dot;
}, true);

// /proc/determine_domination_time  (code/game/gamemodes/gang/gang.dm:289)
rt.def("/proc/determine_domination_time", function determine_domination_time(f: Frame, G: Value) {
	return rt.call(f, P("/proc/max"), null, [180, subtract(480, multiply(rt.call(f, P("/proc/round"), null, [multiply(divide(rt.getLen(f, rt.fv(f, "territory", live(G))), rt.fv(f, "num_territories", rt.gl("start_state"))), 100), 1]), 9))]);
});

// /datum/game_mode/proc/auto_declare_completion_gang  (code/game/gamemodes/gang/gang.dm:297)
rt.def("/datum/game_mode/proc/auto_declare_completion_gang", function auto_declare_completion_gang(f: Frame, winner: Value) {
	let G: Value = null, text: Value = null, boss: Value = null, gangster: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [G, text, boss, gangster, $0, $1, $e];
	if (!truthy(rt.len(f, rt.sv(f, "gangs")))) {
		return live(f.dot);
	}
	if (!truthy(live(winner))) {
		$0 = rt.world();
		if (truthy(rt.sv(f, "station_was_nuked"))) {
			$1 = "destroyed!";
		} else {
			$1 = "evacuated before a gang could claim it! The station wins!";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='redtext'>The station was ＀</span><br>", [$1])]);
		rt.setFv(f, "mode_result", rt.gl("SSticker"), "loss - gangs failed takeover");
		rt.setFv(f, "news_report", rt.gl("SSticker"), 6);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='redtext'>The ＀ Gang successfully performed a hostile takeover of the station!</span><br>", [rt.fv(f, "name", live(winner))])]);
		rt.setFv(f, "mode_result", rt.gl("SSticker"), "win - gang domination complete");
		rt.setFv(f, "news_report", rt.gl("SSticker"), 7);
	}
	G = null;
	rt.forList(f, 0, rt.sv(f, "gangs"), T("/datum/gang"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		$0 = rt.fv(f, "name", live(G));
		if (isEqual(live(winner), live(G))) {
			$1 = "<span class='greenannounce'>victorious</span>";
		} else {
			$1 = "<span class='boldannounce'>defeated</span>";
		}
		text = fmt("<b>The ＀ Gang was ＀ with ＀% control of the station!</b>", [$0, $1, rt.call(f, P("/proc/round"), null, [multiply(divide(rt.getLen(f, rt.fv(f, "territory", live(G))), rt.fv(f, "num_territories", rt.gl("start_state"))), 100), 1])]);
		text = rt.modify(live(text), fmt("<br>The ＀ Gang Bosses were:", [rt.fv(f, "name", live(G))]), add);
		boss = null;
		rt.forList(f, 1, rt.fv(f, "bosses", live(G)), T("/datum/mind"));
		while (($e = rt.next(f, 1)) !== undefined) {
			boss = $e;
			text = rt.modify(live(text), rt.callSrc(f, "printplayer", [live(boss), 1]), add);
		}
		rt.endFor(f, 1);
		text = rt.modify(live(text), fmt("<br>The ＀ Gangsters were:", [rt.fv(f, "name", live(G))]), add);
		gangster = null;
		rt.forList(f, 1, rt.fv(f, "gangsters", live(G)), T("/datum/mind"));
		while (($e = rt.next(f, 1)) !== undefined) {
			gangster = $e;
			text = rt.modify(live(text), rt.callSrc(f, "printplayer", [live(gangster), 1]), add);
		}
		rt.endFor(f, 1);
		text = rt.modify(live(text), "<br>", add);
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(1246, "/datum/gang_points", "/datum", {
	next_point_interval: 1800,
	next_point_time: null,
});

// /datum/gang_points/proc/New  (code/game/gamemodes/gang/gang.dm:330)
rt.def("/datum/gang_points/proc/New", function New(f: Frame) {
	rt.setSv(f, "next_point_time", add(rt.worldTime(f), rt.sv(f, "next_point_interval")));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
});

// /datum/gang_points/proc/process  (code/game/gamemodes/gang/gang.dm:334)  may sleep
rt.def("/datum/gang_points/proc/process", function* process(f: Frame, seconds: Value) {
	let winners: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [seconds, winners, G, $e];
	winners = rt.list();
	G = null;
	rt.forList(f, 0, rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/gang"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (rt.gt(rt.worldTime(f), rt.sv(f, "next_point_time"))) {
			yield* g.callName(f, live(G), "income", []);
		}
		if (truthy(rt.fv(f, "is_dominating", live(G)))) {
			if (rt.lt((yield* g.callName(f, live(G), "domination_time_remaining", [])), 0)) {
				winners = rt.modify(live(winners), live(G), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.worldTime(f), rt.sv(f, "next_point_time"))) {
		rt.setSv(f, "next_point_time", add(rt.worldTime(f), rt.sv(f, "next_point_interval")));
	}
	if (!truthy(rt.len(f, live(winners)))) return f.dot;
	if (rt.gt(rt.len(f, live(winners)), 1)) {
		G = null;
		rt.forList(f, 0, live(winners), T("/datum/gang"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			yield* g.callName(f, live(G), "domination", [0.5]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/priority_announce"), null, ["Multiple station takeover attempts have made simultaneously. Conflicting takeover attempts appears to have restarted.", "Network Alert"]);
	} else {
		rt.setFv(f, "is_dominating", (G = rt.index(live(winners), 1)), 0);
		rt.setFv(f, "explosion_in_progress", rt.fv(f, "mode", rt.gl("SSticker")), 1);
		yield* g.callName(f, rt.gl("SSticker"), "station_explosion_cinematic", [1, "gang war", null]);
		rt.setFv(f, "explosion_in_progress", rt.fv(f, "mode", rt.gl("SSticker")), 0);
		rt.setFv(f, "force_ending", rt.gl("SSticker"), 1);
	}
	return f.dot;
}, true, { waitfor: false });
