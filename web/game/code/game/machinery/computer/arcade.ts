// From code/game/machinery/computer/arcade.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10364, "/obj/machinery/computer/arcade", "/obj/machinery/computer", {
	prizes: null,
	light_color: "#64C864",
	name: "random arcade",
	desc: "random arcade machine",
	icon_state: "arcade",
	icon_keyboard: null,
	icon_screen: "invaders",
	clockwork: 1,
});

// /obj/machinery/computer/arcade/proc/<init>  (code/game/machinery/computer/arcade.dm:8)
rt.def("/obj/machinery/computer/arcade/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "prizes", rt.alist(f, [T("/obj/item/weapon/storage/box/snappops"), 2, T("/obj/item/toy/talking/AI"), 2, T("/obj/item/toy/talking/codex_gigas"), 2, T("/obj/item/clothing/under/syndicate/tacticool"), 2, T("/obj/item/toy/sword"), 2, T("/obj/item/toy/gun"), 2, T("/obj/item/weapon/gun/ballistic/shotgun/toy/crossbow"), 2, T("/obj/item/weapon/storage/box/fakesyndiesuit"), 2, T("/obj/item/weapon/storage/crayons"), 2, T("/obj/item/toy/spinningtoy"), 2, T("/obj/item/toy/prize/ripley"), 1, T("/obj/item/toy/prize/fireripley"), 1, T("/obj/item/toy/prize/deathripley"), 1, T("/obj/item/toy/prize/gygax"), 1, T("/obj/item/toy/prize/durand"), 1, T("/obj/item/toy/prize/honk"), 1, T("/obj/item/toy/prize/marauder"), 1, T("/obj/item/toy/prize/seraph"), 1, T("/obj/item/toy/prize/mauler"), 1, T("/obj/item/toy/prize/odysseus"), 1, T("/obj/item/toy/prize/phazon"), 1, T("/obj/item/toy/prize/reticence"), 1, T("/obj/item/toy/cards/deck"), 2, T("/obj/item/toy/nuke"), 2, T("/obj/item/toy/minimeteor"), 2, T("/obj/item/toy/redbutton"), 2, T("/obj/item/toy/talking/owl"), 2, T("/obj/item/toy/talking/griffin"), 2, T("/obj/item/weapon/coin/antagtoken"), 2, T("/obj/item/stack/tile/fakespace/loaded"), 2, T("/obj/item/stack/tile/fakepit/loaded"), 2, T("/obj/item/toy/toy_xeno"), 2, T("/obj/item/weapon/storage/box/actionfigure"), 1, T("/obj/item/weapon/restraints/handcuffs/fake"), 2, T("/obj/item/weapon/grenade/chem_grenade/glitter/pink"), 1, T("/obj/item/weapon/grenade/chem_grenade/glitter/blue"), 1, T("/obj/item/weapon/grenade/chem_grenade/glitter/white"), 1, T("/obj/item/toy/eightball"), 2, T("/obj/item/toy/windupToolbox"), 2]));
	return f.dot;
});

// /obj/machinery/computer/arcade/proc/New  (code/game/machinery/computer/arcade.dm:55)  may sleep
rt.def("/obj/machinery/computer/arcade/proc/New", function* New(f: Frame) {
	let choice: Value = null, CB: Value = null;
	f.vars = () => [choice, CB];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "circuit"))) return f.dot;
	choice = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/circuitboard/computer/arcade")])), T("/obj/item/weapon/circuitboard/computer/arcade"))]);
	CB = (yield* g.new_(f, live(choice), []));
	yield* g.new_(f, rt.fv(f, "build_path", live(CB)), [rt.sv(f, "loc"), live(CB)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/computer/arcade/proc/Initialize  (code/game/machinery/computer/arcade.dm:65)  may sleep
rt.def("/obj/machinery/computer/arcade/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "Reset");
	return f.dot;
}, true);

// /obj/machinery/computer/arcade/proc/prizevend  (code/game/machinery/computer/arcade.dm:72)  may sleep
rt.def("/obj/machinery/computer/arcade/proc/prizevend", function* prizevend(f: Frame) {
	let prizeselect: Value = null, prize: Value = null;
	f.vars = () => [prizeselect, prize];
	if (truthy(rt.op(f, "Prob", [], [0.00009999999747378752]))) {
		yield* g.new_(f, T("/obj/item/weapon/gun/energy/pulse/prize"), [live(f.src)]);
	}
	if (!truthy(rt.len(f, rt.sv(f, "contents")))) {
		prizeselect = (yield* g.call(f, P("/proc/pickweight"), null, [rt.sv(f, "prizes")]));
		yield* g.new_(f, live(prizeselect), [live(f.src)]);
	}
	prize = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "contents")]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ dispenses a ＀!</span>", [live(f.src), live(prize)]), "<span class='notice'>You hear a chime and a clunk.</span>");
	rt.setFv(f, "loc", live(prize), rt.sv(f, "loc"));
	return f.dot;
}, true);

// /obj/machinery/computer/arcade/proc/emp_act  (code/game/machinery/computer/arcade.dm:89)  may sleep
rt.def("/obj/machinery/computer/arcade/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let empprize: Value = null, num_of_prizes: Value = null, i: Value = null;
	let $0: any;
	f.vars = () => [severity, empprize, num_of_prizes, i, $0];
	yield* g.callSuper(f, [live(severity)]);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	empprize = null;
	num_of_prizes = 0;
	$0 = live(severity);
	if ($0 === 1) {
		num_of_prizes = (yield* g.call(f, P("/proc/rand"), null, [1, 4]));
	} else if ($0 === 2) {
		num_of_prizes = (yield* g.call(f, P("/proc/rand"), null, [0, 2]));
	}
	i = null;
	i = live(num_of_prizes);
	while (rt.gt(live(i), 0)) {
		empprize = (yield* g.call(f, P("/proc/pickweight"), null, [rt.sv(f, "prizes")]));
		yield* g.new_(f, live(empprize), [rt.sv(f, "loc")]);
		i = rt.inc(live(i), -1);
	}
	yield* g.call(f, P("/proc/explosion"), null, [null, rt.sv(f, "loc"), null, -1, null, 0, null, add(1, live(num_of_prizes)), "flame_range", add(1, live(num_of_prizes))], rt.Args.Named);
	return f.dot;
}, true);

rt.type(10365, "/obj/machinery/computer/arcade/battle", "/obj/machinery/computer/arcade", {
	enemy_name: "Space Villian",
	temp: "Winners don't use space drugs",
	player_hp: 30,
	player_mp: 10,
	enemy_hp: 45,
	enemy_mp: 20,
	gameover: 0,
	blocked: 0,
	turtle: 0,
	name: "arcade machine",
	desc: "Does not support Pinball.",
	icon_state: "arcade",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/arcade/battle"),
});

// /obj/machinery/computer/arcade/battle/proc/Reset  (code/game/machinery/computer/arcade.dm:130)
rt.def("/obj/machinery/computer/arcade/battle/proc/Reset", function Reset(f: Frame) {
	let name_action: Value = null, name_part1: Value = null, name_part2: Value = null;
	f.vars = () => [name_action, name_part1, name_part2];
	name_action = null;
	name_part1 = null;
	name_part2 = null;
	name_action = rt.op(f, "PickUnweighted", [11], ["Defeat ", "Annihilate ", "Save ", "Strike ", "Stop ", "Destroy ", "Robust ", "Romance ", "Pwn ", "Own ", "Ban "]);
	name_part1 = rt.op(f, "PickUnweighted", [12], ["the Automatic ", "Farmer ", "Lord ", "Professor ", "the Cuban ", "the Evil ", "the Dread King ", "the Space ", "Lord ", "the Great ", "Duke ", "General "]);
	name_part2 = rt.op(f, "PickUnweighted", [16], ["Melonoid", "Murdertron", "Sorcerer", "Ruin", "Jeff", "Ectoplasm", "Crushulon", "Uhangoid", "Vhakoid", "Peteoid", "slime", "Griefer", "ERPer", "Lizard Man", "Unicorn", "Bloopers"]);
	rt.setSv(f, "enemy_name", rt.call(f, P("/proc/replacetext"), null, [add(live(name_part1), live(name_part2)), "the ", ""]));
	rt.setSv(f, "name", add(add(live(name_action), live(name_part1)), live(name_part2)));
	return f.dot;
});

// /obj/machinery/computer/arcade/battle/proc/attack_hand  (code/game/machinery/computer/arcade.dm:139)  may sleep
rt.def("/obj/machinery/computer/arcade/battle/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, popup: Value = null;
	f.vars = () => [dat, popup];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	dat = fmt("<a href='byond://?src=＃;close=1'>Close</a>", [live(f.src)]);
	dat = rt.modify(live(dat), fmt("<center><h4>＀</h4></center>", [rt.sv(f, "enemy_name")]), add);
	dat = rt.modify(live(dat), fmt("<br><center><h3>＀</h3></center>", [rt.sv(f, "temp")]), add);
	dat = rt.modify(live(dat), fmt("<br><center>Health: ＀ | Magic: ＀ | Enemy Health: ＀</center>", [rt.sv(f, "player_hp"), rt.sv(f, "player_mp"), rt.sv(f, "enemy_hp")]), add);
	if (truthy(rt.sv(f, "gameover"))) {
		dat = rt.modify(live(dat), fmt("<center><b><a href='byond://?src=＃;newgame=1'>New Game</a>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), fmt("<center><b><a href='byond://?src=＃;attack=1'>Attack</a> | ", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;heal=1'>Heal</a> | ", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;charge=1'>Recharge Power</a>", [live(f.src)]), add);
	}
	dat = rt.modify(live(dat), "</b></center>", add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "arcade", "Space Villian 2000"]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.sv(f, "icon"), rt.sv(f, "icon_state")]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/computer/arcade/battle/proc/Topic  (code/game/machinery/computer/arcade.dm:163)  may sleep
rt.def("/obj/machinery/computer/arcade/battle/proc/Topic", function* Topic(f: Frame) {
	let attackamt: Value = null, pointamt: Value = null, healamt: Value = null, chargeamt: Value = null;
	f.vars = () => [attackamt, pointamt, healamt, chargeamt];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "blocked")) && !truthy(rt.sv(f, "gameover")))) {
		if (truthy(rt.at(live(f.args[1]), "attack"))) {
			rt.setSv(f, "blocked", 1);
			rt.setSv(f, "temp", fmt("You attack for ＀ damage!", [(attackamt = (yield* g.call(f, P("/proc/rand"), null, [2, 6])))]));
			yield* g.call(f, P("/proc/playsound"), null, [null, rt.sv(f, "loc"), null, rt.rsc("sound/arcade/hit.ogg"), null, 50, null, 1, "extrarange", -3, "falloff", 10], rt.Args.Named);
			yield* g.srcCall(f, "updateUsrDialog");
			if (rt.gt(rt.sv(f, "turtle"), 0)) {
				rt.incSrcVar(f, "turtle", -1, true);
			}
			yield* g.call(f, P("/proc/sleep"), null, [10]);
			(rt.modSrcVar(f, "enemy_hp", live(attackamt), subtract));
			yield* g.srcCall(f, "arcade_action");
		} else {
			if (truthy(rt.at(live(f.args[1]), "heal"))) {
				rt.setSv(f, "blocked", 1);
				pointamt = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
				healamt = (yield* g.call(f, P("/proc/rand"), null, [6, 8]));
				rt.setSv(f, "temp", fmt("You use ＀ magic to heal for ＀ damage!", [live(pointamt), live(healamt)]));
				yield* g.call(f, P("/proc/playsound"), null, [null, rt.sv(f, "loc"), null, rt.rsc("sound/arcade/heal.ogg"), null, 50, null, 1, "extrarange", -3, "falloff", 10], rt.Args.Named);
				yield* g.srcCall(f, "updateUsrDialog");
				rt.incSrcVar(f, "turtle", 1, true);
				yield* g.call(f, P("/proc/sleep"), null, [10]);
				(rt.modSrcVar(f, "player_mp", live(pointamt), subtract));
				rt.modSrcVar(f, "player_hp", live(healamt), add);
				rt.setSv(f, "blocked", 1);
				yield* g.srcCall(f, "updateUsrDialog");
				yield* g.srcCall(f, "arcade_action");
			} else {
				if (truthy(rt.at(live(f.args[1]), "charge"))) {
					rt.setSv(f, "blocked", 1);
					rt.setSv(f, "temp", fmt("You regain ＀ points", [(chargeamt = (yield* g.call(f, P("/proc/rand"), null, [4, 7])))]));
					yield* g.call(f, P("/proc/playsound"), null, [null, rt.sv(f, "loc"), null, rt.rsc("sound/arcade/mana.ogg"), null, 50, null, 1, "extrarange", -3, "falloff", 10], rt.Args.Named);
					rt.modSrcVar(f, "player_mp", live(chargeamt), add);
					if (rt.gt(rt.sv(f, "turtle"), 0)) {
						rt.incSrcVar(f, "turtle", -1, true);
					}
					yield* g.srcCall(f, "updateUsrDialog");
					yield* g.call(f, P("/proc/sleep"), null, [10]);
					yield* g.srcCall(f, "arcade_action");
				}
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		yield* g.callName(f, live(f.usr), "unset_machine", []);
		rt.op(f, "Browse", [], [live(f.usr), null, "window=arcade"], false);
	} else {
		if (truthy(rt.at(live(f.args[1]), "newgame"))) {
			rt.setSv(f, "temp", "New Round");
			rt.setSv(f, "player_hp", 30);
			rt.setSv(f, "player_mp", 10);
			rt.setSv(f, "enemy_hp", 45);
			rt.setSv(f, "enemy_mp", 20);
			rt.setSv(f, "gameover", 0);
			rt.setSv(f, "turtle", 0);
			if (truthy(rt.sv(f, "emagged"))) {
				yield* g.srcCall(f, "Reset");
				rt.setSv(f, "emagged", 0);
			}
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/arcade/battle/proc/arcade_action  (code/game/machinery/computer/arcade.dm:231)  may sleep
rt.def("/obj/machinery/computer/arcade/battle/proc/arcade_action", function* arcade_action(f: Frame) {
	let boomamt: Value = null, stealamt: Value = null, attackamt: Value = null;
	f.vars = () => [boomamt, stealamt, attackamt];
	if ((rt.le(rt.sv(f, "enemy_mp"), 0) || rt.le(rt.sv(f, "enemy_hp"), 0))) {
		if (!truthy(rt.sv(f, "gameover"))) {
			rt.setSv(f, "gameover", 1);
			rt.setSv(f, "temp", fmt("＀ has fallen! Rejoice!", [rt.sv(f, "enemy_name")]));
			yield* g.call(f, P("/proc/playsound"), null, [null, rt.sv(f, "loc"), null, rt.rsc("sound/arcade/win.ogg"), null, 50, null, 1, "extrarange", -3, "falloff", 10], rt.Args.Named);
			if (truthy(rt.sv(f, "emagged"))) {
				yield* g.new_(f, T("/obj/effect/spawner/newbomb/timer/syndicate"), [rt.sv(f, "loc")]);
				yield* g.new_(f, T("/obj/item/clothing/head/collectable/petehat"), [rt.sv(f, "loc")]);
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has outbombed Cuban Pete and been awarded a bomb.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
				yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has outbombed Cuban Pete and been awarded a bomb.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
				yield* g.srcCall(f, "Reset");
				rt.setSv(f, "emagged", 0);
			} else {
				yield* g.srcCall(f, "prizevend");
			}
		}
	} else {
		if ((truthy(rt.sv(f, "emagged")) && rt.ge(rt.sv(f, "turtle"), 4))) {
			boomamt = (yield* g.call(f, P("/proc/rand"), null, [5, 10]));
			rt.setSv(f, "temp", fmt("＀ throws a bomb, exploding you for ＀ damage!", [rt.sv(f, "enemy_name"), live(boomamt)]));
			yield* g.call(f, P("/proc/playsound"), null, [null, rt.sv(f, "loc"), null, rt.rsc("sound/arcade/boom.ogg"), null, 50, null, 1, "extrarange", -3, "falloff", 10], rt.Args.Named);
			(rt.modSrcVar(f, "player_hp", live(boomamt), subtract));
		} else {
			if ((rt.le(rt.sv(f, "enemy_mp"), 5) && truthy(rt.op(f, "Prob", [], [70])))) {
				stealamt = (yield* g.call(f, P("/proc/rand"), null, [2, 3]));
				rt.setSv(f, "temp", fmt("＀ steals ＀ of your power!", [rt.sv(f, "enemy_name"), live(stealamt)]));
				yield* g.call(f, P("/proc/playsound"), null, [null, rt.sv(f, "loc"), null, rt.rsc("sound/arcade/steal.ogg"), null, 50, null, 1, "extrarange", -3, "falloff", 10], rt.Args.Named);
				(rt.modSrcVar(f, "player_mp", live(stealamt), subtract));
				yield* g.srcCall(f, "updateUsrDialog");
				if (rt.le(rt.sv(f, "player_mp"), 0)) {
					rt.setSv(f, "gameover", 1);
					yield* g.call(f, P("/proc/sleep"), null, [10]);
					rt.setSv(f, "temp", "You have been drained! GAME OVER");
					yield* g.call(f, P("/proc/playsound"), null, [null, rt.sv(f, "loc"), null, rt.rsc("sound/arcade/lose.ogg"), null, 50, null, 1, "extrarange", -3, "falloff", 10], rt.Args.Named);
					if (truthy(rt.sv(f, "emagged"))) {
						yield* g.callName(f, live(f.usr), "gib", []);
					}
				}
			} else {
				if ((rt.le(rt.sv(f, "enemy_hp"), 10) && rt.gt(rt.sv(f, "enemy_mp"), 4))) {
					rt.setSv(f, "temp", fmt("＀ heals for 4 health!", [rt.sv(f, "enemy_name")]));
					yield* g.call(f, P("/proc/playsound"), null, [null, rt.sv(f, "loc"), null, rt.rsc("sound/arcade/heal.ogg"), null, 50, null, 1, "extrarange", -3, "falloff", 10], rt.Args.Named);
					rt.modSrcVar(f, "enemy_hp", 4, add);
					(rt.modSrcVar(f, "enemy_mp", 4, subtract));
				} else {
					attackamt = (yield* g.call(f, P("/proc/rand"), null, [3, 6]));
					rt.setSv(f, "temp", fmt("＀ attacks for ＀ damage!", [rt.sv(f, "enemy_name"), live(attackamt)]));
					yield* g.call(f, P("/proc/playsound"), null, [null, rt.sv(f, "loc"), null, rt.rsc("sound/arcade/hit.ogg"), null, 50, null, 1, "extrarange", -3, "falloff", 10], rt.Args.Named);
					(rt.modSrcVar(f, "player_hp", live(attackamt), subtract));
				}
			}
		}
	}
	if ((rt.le(rt.sv(f, "player_mp"), 0) || rt.le(rt.sv(f, "player_hp"), 0))) {
		rt.setSv(f, "gameover", 1);
		rt.setSv(f, "temp", "You have been crushed! GAME OVER");
		yield* g.call(f, P("/proc/playsound"), null, [null, rt.sv(f, "loc"), null, rt.rsc("sound/arcade/lose.ogg"), null, 50, null, 1, "extrarange", -3, "falloff", 10], rt.Args.Named);
		if (truthy(rt.sv(f, "emagged"))) {
			yield* g.callName(f, live(f.usr), "gib", []);
		}
	}
	rt.setSv(f, "blocked", 0);
	return live(f.dot);
}, true);

// /obj/machinery/computer/arcade/battle/proc/emag_act  (code/game/machinery/computer/arcade.dm:300)  may sleep
rt.def("/obj/machinery/computer/arcade/battle/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "temp", "If you die in the game, you die for real!");
	rt.setSv(f, "player_hp", 30);
	rt.setSv(f, "player_mp", 10);
	rt.setSv(f, "enemy_hp", 45);
	rt.setSv(f, "enemy_mp", 20);
	rt.setSv(f, "gameover", 0);
	rt.setSv(f, "blocked", 0);
	rt.setSv(f, "emagged", 1);
	rt.setSv(f, "enemy_name", "Cuban Pete");
	rt.setSv(f, "name", "Outbomb Cuban Pete");
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

rt.type(10366, "/obj/machinery/computer/arcade/orion_trail", "/obj/machinery/computer/arcade", {
	busy: 0,
	engine: 0,
	hull: 0,
	electronics: 0,
	food: 80,
	fuel: 60,
	turns: 4,
	alive: 4,
	eventdat: null,
	event: null,
	settlers: null,
	events: null,
	stops: null,
	stopblurbs: null,
	lings_aboard: 0,
	spaceport_raided: 0,
	spaceport_freebie: 0,
	last_spaceport_action: "",
	gameStatus: 1,
	canContinueEvent: 0,
	name: "The Orion Trail",
	desc: "Learn how our ancestors got to Orion, and have fun in the process!",
	icon_state: "arcade",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/arcade/orion_trail"),
});

// /obj/machinery/computer/arcade/orion_trail/proc/<init>  (code/game/machinery/computer/arcade.dm:356)
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "settlers", rt.list("Harry", "Larry", "Bob"));
	rt.setSv(f, "events", rt.alist(f, ["Raiders", 3, "Interstellar Flux", 1, "Illness", 3, "Breakdown", 2, "Changelings?", 3, "Malfunction", 2, "Collision", 1, "Spaceport", 2]));
	$0 = $0;
	rt.setSv(f, "stops", rt.list());
	$0 = $0;
	rt.setSv(f, "stopblurbs", rt.list());
	return f.dot;
});

// /obj/machinery/computer/arcade/orion_trail/proc/newgame  (code/game/machinery/computer/arcade.dm:391)
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/newgame", function newgame(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	rt.setSv(f, "settlers", rt.list());
	i = null;
	i = 1;
	while (rt.le(live(i), 3)) {
		rt.callSrc(f, "add_crewmember", []);
		i = rt.inc(live(i), 1);
	}
	rt.callSrc(f, "add_crewmember", [fmt("＀", [live(f.usr)])]);
	rt.setSv(f, "engine", 1);
	rt.setSv(f, "hull", 1);
	rt.setSv(f, "electronics", 1);
	rt.setSv(f, "food", 80);
	rt.setSv(f, "fuel", 60);
	rt.setSv(f, "alive", 4);
	rt.setSv(f, "turns", 1);
	rt.setSv(f, "event", null);
	rt.setSv(f, "gameStatus", 2);
	rt.setSv(f, "lings_aboard", 0);
	rt.setSv(f, "spaceport_raided", 0);
	rt.setSv(f, "spaceport_freebie", 0);
	rt.setSv(f, "last_spaceport_action", "");
	return f.dot;
});

// /obj/machinery/computer/arcade/orion_trail/proc/attack_hand  (code/game/machinery/computer/arcade.dm:413)  may sleep
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, M: Value = null, title: Value = null, subtext: Value = null, popup: Value = null;
	f.vars = () => [dat, M, title, subtext, popup];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (((rt.le(rt.sv(f, "fuel"), 0) || rt.le(rt.sv(f, "food"), 0)) || isEqual(rt.len(f, rt.sv(f, "settlers")), 0))) {
		rt.setSv(f, "gameStatus", 3);
		rt.setSv(f, "event", null);
	}
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	dat = "";
	if (isEqual(rt.sv(f, "gameStatus"), 3)) {
		dat = "<center><h1>Game Over</h1></center>";
		dat = rt.modify(live(dat), "Like many before you, your crew never made it to Orion, lost to space... <br><b>Forever</b>.", add);
		if (isEqual(rt.len(f, rt.sv(f, "settlers")), 0)) {
			dat = rt.modify(live(dat), "<br>Your entire crew died, your ship joins the fleet of ghost-ships littering the galaxy.", add);
		} else {
			if (rt.le(rt.sv(f, "food"), 0)) {
				dat = rt.modify(live(dat), "<br>You ran out of food and starved.", add);
				if (truthy(rt.sv(f, "emagged"))) {
					rt.setFv(f, "nutrition", live(f.args[0]), 0);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'><font size=3>Your body instantly contracts to that of one who has not eaten in months. Agonizing cramps seize you as you fall to the floor.</span>"]);
				}
			}
			if (rt.le(rt.sv(f, "fuel"), 0)) {
				dat = rt.modify(live(dat), "<br>You ran out of fuel, and drift, slowly, into a star.", add);
				if (truthy(rt.sv(f, "emagged"))) {
					yield* g.callName(f, (M = live(f.args[0])), "adjust_fire_stacks", [5]);
					yield* g.callName(f, live(M), "IgniteMob", []);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'><font size=3>You feel an immense wave of heat emanate from the arcade machine. Your skin bursts into flames.</span>"]);
				}
			}
		}
		dat = rt.modify(live(dat), fmt("<br><P ALIGN=Right><a href='byond://?src=＃;menu=1'>OK...</a></P>", [live(f.src)]), add);
		if (truthy(rt.sv(f, "emagged"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'><font size=3>You're never going to make it to Orion...</span></font>"]);
			yield* g.callName(f, live(f.args[0]), "death", []);
			rt.setSv(f, "emagged", 0);
			rt.setSv(f, "gameStatus", 1);
			rt.setSv(f, "name", "The Orion Trail");
			rt.setSv(f, "desc", "Learn how our ancestors got to Orion, and have fun in the process!");
		}
	} else {
		if (truthy(rt.sv(f, "event"))) {
			dat = rt.sv(f, "eventdat");
		} else {
			if (isEqual(rt.sv(f, "gameStatus"), 2)) {
				title = rt.index(rt.sv(f, "stops"), rt.sv(f, "turns"));
				subtext = rt.index(rt.sv(f, "stopblurbs"), rt.sv(f, "turns"));
				dat = fmt("<center><h1>＀</h1></center>", [live(title)]);
				dat = rt.modify(live(dat), fmt("＀", [live(subtext)]), add);
				dat = rt.modify(live(dat), "<h3><b>Crew:</b></h3>", add);
				dat = rt.modify(live(dat), (yield* g.call(f, P("/proc/english_list"), null, [rt.sv(f, "settlers")])), add);
				dat = rt.modify(live(dat), fmt("<br><b>Food: </b>＀ | <b>Fuel: </b>＀", [rt.sv(f, "food"), rt.sv(f, "fuel")]), add);
				dat = rt.modify(live(dat), fmt("<br><b>Engine Parts: </b>＀ | <b>Hull Panels: </b>＀ | <b>Electronics: </b>＀", [rt.sv(f, "engine"), rt.sv(f, "hull"), rt.sv(f, "electronics")]), add);
				if (isEqual(rt.sv(f, "turns"), 7)) {
					dat = rt.modify(live(dat), fmt("<P ALIGN=Right><a href='byond://?src=＃;pastblack=1'>Go Around</a> <a href='byond://?src=＃;blackhole=1'>Continue</a></P>", [live(f.src), live(f.src)]), add);
				} else {
					dat = rt.modify(live(dat), fmt("<P ALIGN=Right><a href='byond://?src=＃;continue=1'>Continue</a></P>", [live(f.src)]), add);
				}
				dat = rt.modify(live(dat), fmt("<P ALIGN=Right><a href='byond://?src=＃;killcrew=1'>Kill a crewmember</a></P>", [live(f.src)]), add);
				dat = rt.modify(live(dat), fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [live(f.src)]), add);
			} else {
				dat = "<center><h2>The Orion Trail</h2></center>";
				dat = rt.modify(live(dat), "<br><center><h3>Experience the journey of your ancestors!</h3></center><br><br>", add);
				dat = rt.modify(live(dat), fmt("<center><b><a href='byond://?src=＃;newgame=1'>New Game</a></b></center>", [live(f.src)]), add);
				dat = rt.modify(live(dat), fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [live(f.src)]), add);
			}
		}
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "arcade", "The Orion Trail", 400, 700]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.sv(f, "icon"), rt.sv(f, "icon_state")]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/computer/arcade/orion_trail/proc/Topic  (code/game/machinery/computer/arcade.dm:477)  may sleep
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/Topic", function* Topic(f: Frame) {
	let M: Value = null, severity: Value = null, F: Value = null, _T: Value = null, oldfood: Value = null, oldfuel: Value = null, L: Value = null, S: Value = null, sheriff: Value = null, bought: Value = null, sold: Value = null, success: Value = null, FU: Value = null, FO: Value = null, lost_crew: Value = null, i: Value = null, O: Value = null;
	let $0: any, $e: any;
	f.vars = () => [M, severity, F, _T, oldfood, oldfuel, L, S, sheriff, bought, sold, success, FU, FO, lost_crew, i, O, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		yield* g.callName(f, live(f.usr), "unset_machine", []);
		rt.op(f, "Browse", [], [live(f.usr), null, "window=arcade"], false);
	}
	if (truthy(rt.sv(f, "busy"))) {
		return live(f.dot);
	}
	rt.setSv(f, "busy", 1);
	if (truthy(rt.at(live(f.args[1]), "continue"))) {
		if (((isEqual(rt.sv(f, "gameStatus"), 2) && !truthy(rt.sv(f, "event"))) && !isEqual(rt.sv(f, "turns"), 7))) {
			if (rt.ge(rt.sv(f, "turns"), 9)) {
				yield* g.srcCall(f, "win");
			} else {
				(rt.modSrcVar(f, "food", multiply(add(rt.sv(f, "alive"), rt.sv(f, "lings_aboard")), 2), subtract));
				(rt.modSrcVar(f, "fuel", 5, subtract));
				if ((isEqual(rt.sv(f, "turns"), 2) && truthy(rt.op(f, "Prob", [], [30])))) {
					rt.setSv(f, "event", "Collision");
					yield* g.srcCall(f, "event");
				} else {
					if (truthy(rt.op(f, "Prob", [], [75]))) {
						rt.setSv(f, "event", (yield* g.call(f, P("/proc/pickweight"), null, [rt.sv(f, "events")])));
						if (truthy(rt.sv(f, "lings_aboard"))) {
							if ((isEqual(rt.sv(f, "event"), "Changelings?") || truthy(rt.op(f, "Prob", [], [55])))) {
								rt.setSv(f, "event", "Changeling Ambush");
							}
						}
						yield* g.srcCall(f, "event");
					}
				}
				rt.modSrcVar(f, "turns", 1, add);
			}
			if (truthy(rt.sv(f, "emagged"))) {
				M = live(f.usr);
				$0 = rt.sv(f, "event");
				if ($0 === "Raiders") {
					if (truthy(rt.op(f, "Prob", [], [50]))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='userdanger'>You hear battle shouts. The tramping of boots on cold metal. Screams of agony. The rush of venting air. Are you going insane?</span>"]);
						rt.modField(f, live(M), "hallucination", 30, add);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='userdanger'>Something strikes you from behind! It hurts like hell and feel like a blunt weapon, but nothing is there...</span>"]);
						yield* g.callName(f, live(M), "take_bodypart_damage", [30]);
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/genhit2.ogg"), 100, 1]);
					}
				} else if ($0 === "Illness") {
					if (isEqual((severity = (yield* g.call(f, P("/proc/rand"), null, [1, 3]))), 1)) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>You suddenly feel slightly nauseous.</span>"]);
					}
					if (isEqual(live(severity), 2)) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='userdanger'>You suddenly feel extremely nauseous and hunch over until it passes.</span>"]);
						yield* g.callName(f, live(M), "Stun", [60]);
					}
					if (rt.ge(live(severity), 3)) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>An overpowering wave of nausea consumes over you. You hunch over, your stomach's contents preparing for a spectacular exit.</span>"]);
						yield* g.callName(f, live(M), "Stun", [100]);
						yield* g.call(f, P("/proc/sleep"), null, [30]);
						yield* g.callName(f, live(M), "vomit", [null, 10, "distance", 5], rt.Args.Named);
					}
				} else if ($0 === "Interstellar Flux") {
					if (truthy(rt.op(f, "Prob", [], [75]))) {
						yield* g.callName(f, live(M), "Knockdown", [60]);
						yield* g.srcCall(f, "say", fmt("A sudden gust of powerful wind slams ＀ into the floor!", [live(M)]));
						yield* g.callName(f, live(M), "take_bodypart_damage", [25]);
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/genhit.ogg"), 100, 1]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>A violent gale blows past you, and you barely manage to stay standing!</span>"]);
					}
				} else if ($0 === "Collision") {
					if (truthy(rt.op(f, "Prob", [], [90]))) {
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/bang.ogg"), 100, 1]);
						F = null;
						rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, live(f.src)])), T("/turf/open/floor"));
						while (($e = rt.next(f, 0)) !== undefined) {
							F = $e;
							yield* g.callName(f, live(F), "ChangeTurf", [rt.fv(f, "baseturf", live(F))]);
						}
						rt.endFor(f, 0);
						yield* g.srcCall(f, "say", fmt("Something slams into the floor around ＀, exposing it to space!", [live(f.src)]));
						if (truthy(rt.sv(f, "hull"))) {
							yield* g.call(f, P("/proc/sleep"), null, [10]);
							yield* g.srcCall(f, "say", fmt("A new floor suddenly appears around ＀. What the hell?", [live(f.src)]));
							yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/genhit.ogg"), 100, 1]);
							_T = null;
							rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, live(f.src)])), T("/turf/open/space"));
							while (($e = rt.next(f, 0)) !== undefined) {
								_T = $e;
								yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/open/floor/plating")]);
							}
							rt.endFor(f, 0);
						}
					} else {
						yield* g.srcCall(f, "say", fmt("Something slams into the floor around ＀ - luckily, it didn't get through!", [live(f.src)]));
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/bang.ogg"), 50, 1]);
					}
				} else if ($0 === "Malfunction") {
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/empulse.ogg"), 50, 1]);
					yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ malfunctions, randomizing in-game stats!</span>", [live(f.src)]));
					oldfood = rt.sv(f, "food");
					oldfuel = rt.sv(f, "fuel");
					rt.setSv(f, "food", divide((yield* g.call(f, P("/proc/rand"), null, [10, 80])), (yield* g.call(f, P("/proc/rand"), null, [1, 2]))));
					rt.setSv(f, "fuel", divide((yield* g.call(f, P("/proc/rand"), null, [10, 60])), (yield* g.call(f, P("/proc/rand"), null, [1, 2]))));
					if (truthy(rt.sv(f, "electronics"))) {
						yield* g.call(f, P("/proc/sleep"), null, [10]);
						if ((rt.gt(live(oldfuel), rt.sv(f, "fuel")) && rt.gt(live(oldfood), rt.sv(f, "food")))) {
							yield* g.srcCall(f, "audible_message", fmt("<span class='danger'>＀ lets out a somehow reassuring chime.</span>", [live(f.src)]));
						} else {
							if ((rt.lt(live(oldfuel), rt.sv(f, "fuel")) || rt.lt(live(oldfood), rt.sv(f, "food")))) {
								yield* g.srcCall(f, "audible_message", fmt("<span class='danger'>＀ lets out a somehow ominous chime.</span>", [live(f.src)]));
							}
						}
						rt.setSv(f, "food", live(oldfood));
						rt.setSv(f, "fuel", live(oldfuel));
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/chime.ogg"), 50, 1]);
					}
				}
			}
		}
	} else {
		if (truthy(rt.at(live(f.args[1]), "newgame"))) {
			if (isEqual(rt.sv(f, "gameStatus"), 1)) {
				yield* g.srcCall(f, "newgame");
			}
		} else {
			if (truthy(rt.at(live(f.args[1]), "menu"))) {
				if (isEqual(rt.sv(f, "gameStatus"), 3)) {
					rt.setSv(f, "gameStatus", 1);
					rt.setSv(f, "event", null);
					rt.setSv(f, "food", 80);
					rt.setSv(f, "fuel", 60);
					rt.setSv(f, "settlers", rt.list("Harry", "Larry", "Bob"));
				}
			} else {
				if (truthy(rt.at(live(f.args[1]), "slow"))) {
					if (isEqual(rt.sv(f, "event"), "Interstellar Flux")) {
						(rt.modSrcVar(f, "food", multiply(add(rt.sv(f, "alive"), rt.sv(f, "lings_aboard")), 2), subtract));
						(rt.modSrcVar(f, "fuel", 5, subtract));
					}
					rt.setSv(f, "event", null);
				} else {
					if (truthy(rt.at(live(f.args[1]), "pastblack"))) {
						if (isEqual(rt.sv(f, "turns"), 7)) {
							(rt.modSrcVar(f, "food", multiply(multiply(add(rt.sv(f, "alive"), rt.sv(f, "lings_aboard")), 2), 3), subtract));
							(rt.modSrcVar(f, "fuel", 15, subtract));
							rt.modSrcVar(f, "turns", 1, add);
							rt.setSv(f, "event", null);
						}
					} else {
						if (truthy(rt.at(live(f.args[1]), "useengine"))) {
							if (isEqual(rt.sv(f, "event"), "Breakdown")) {
								rt.setSv(f, "engine", (yield* g.call(f, P("/proc/max"), null, [0, rt.incSrcVar(f, "engine", -1, false)])));
								rt.setSv(f, "event", null);
							}
						} else {
							if (truthy(rt.at(live(f.args[1]), "useelec"))) {
								if (isEqual(rt.sv(f, "event"), "Malfunction")) {
									rt.setSv(f, "electronics", (yield* g.call(f, P("/proc/max"), null, [0, rt.incSrcVar(f, "electronics", -1, false)])));
									rt.setSv(f, "event", null);
								}
							} else {
								if (truthy(rt.at(live(f.args[1]), "usehull"))) {
									if (isEqual(rt.sv(f, "event"), "Collision")) {
										rt.setSv(f, "hull", (yield* g.call(f, P("/proc/max"), null, [0, rt.incSrcVar(f, "hull", -1, false)])));
										rt.setSv(f, "event", null);
									}
								} else {
									if (truthy(rt.at(live(f.args[1]), "wait"))) {
										if (((isEqual(rt.sv(f, "event"), "Breakdown") || isEqual(rt.sv(f, "event"), "Malfunction")) || isEqual(rt.sv(f, "event"), "Collision"))) {
											(rt.modSrcVar(f, "food", multiply(multiply(add(rt.sv(f, "alive"), rt.sv(f, "lings_aboard")), 2), 3), subtract));
											rt.setSv(f, "event", null);
										}
									} else {
										if (truthy(rt.at(live(f.args[1]), "keepspeed"))) {
											if (isEqual(rt.sv(f, "event"), "Interstellar Flux")) {
												if (truthy(rt.op(f, "Prob", [], [75]))) {
													rt.setSv(f, "event", "Breakdown");
													yield* g.srcCall(f, "event");
												} else {
													rt.setSv(f, "event", null);
												}
											}
										} else {
											if (truthy(rt.at(live(f.args[1]), "blackhole"))) {
												if (isEqual(rt.sv(f, "turns"), 7)) {
													if (truthy(rt.op(f, "Prob", [], [75]))) {
														rt.setSv(f, "event", "BlackHole");
														yield* g.srcCall(f, "event");
														if (truthy(rt.sv(f, "emagged"))) {
															yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/supermatter.ogg"), 100, 1]);
															yield* g.srcCall(f, "say", fmt("A miniature black hole suddenly appears in front of ＀, devouring ＀ alive!", [live(f.src), live(f.usr)]));
															if (truthy((rt.istype(live(f.usr), T("/mob/living")) ? 1 : 0))) {
																yield* g.callName(f, (L = live(f.usr)), "Stun", [null, 200, "ignore_canstun", 1], rt.Args.Named);
															}
															S = (yield* g.new_(f, T("/obj/singularity/academy"), [rt.fv(f, "loc", live(f.usr))]));
															rt.setSv(f, "emagged", 0);
															yield* g.call(f, P("/proc/sleep"), null, [50]);
															yield* g.srcCall(f, "say", fmt("＀ winks out, just as suddenly as it appeared.", [live(S)]));
															yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
														}
													} else {
														rt.setSv(f, "event", null);
														rt.modSrcVar(f, "turns", 1, add);
													}
												}
											} else {
												if (truthy(rt.at(live(f.args[1]), "holedeath"))) {
													if (isEqual(rt.sv(f, "event"), "BlackHole")) {
														rt.setSv(f, "gameStatus", 3);
														rt.setSv(f, "event", null);
													}
												} else {
													if (truthy(rt.at(live(f.args[1]), "eventclose"))) {
														if (truthy(rt.sv(f, "canContinueEvent"))) {
															rt.setSv(f, "event", null);
														}
													} else {
														if (truthy(rt.at(live(f.args[1]), "killcrew"))) {
															if ((isEqual(rt.sv(f, "gameStatus"), 2) || isEqual(rt.sv(f, "event"), "Changelings?"))) {
																sheriff = (yield* g.srcCall(f, "remove_crewmember"));
																yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/gunshot.ogg"), 100, 1]);
																if ((isEqual(rt.len(f, rt.sv(f, "settlers")), 0) || isEqual(rt.sv(f, "alive"), 0))) {
																	yield* g.srcCall(f, "say", fmt("The last crewmember ＀, shot themselves, GAME OVER!", [live(sheriff)]));
																	if (truthy(rt.sv(f, "emagged"))) {
																		yield* g.callName(f, live(f.usr), "death", [0]);
																		rt.setSv(f, "emagged", 0);
																	}
																	rt.setSv(f, "gameStatus", 3);
																	rt.setSv(f, "event", null);
																} else {
																	if (truthy(rt.sv(f, "emagged"))) {
																		if (isEqual(rt.fv(f, "name", live(f.usr)), live(sheriff))) {
																			yield* g.srcCall(f, "say", fmt("The crew of the ship chose to kill ＀!", [rt.fv(f, "name", live(f.usr))]));
																			yield* g.callName(f, live(f.usr), "death", [0]);
																		}
																	}
																}
																if (isEqual(rt.sv(f, "event"), "Changelings?")) {
																	rt.setSv(f, "event", null);
																}
															}
														} else {
															if (truthy(rt.at(live(f.args[1]), "buycrew"))) {
																if (isEqual(rt.sv(f, "gameStatus"), 4)) {
																	if (((!truthy(rt.sv(f, "spaceport_raided")) && rt.ge(rt.sv(f, "food"), 10)) && rt.ge(rt.sv(f, "fuel"), 10))) {
																		rt.setSv(f, "last_spaceport_action", fmt("You hired ＀ as a new crewmember.", [(bought = (yield* g.srcCall(f, "add_crewmember")))]));
																		(rt.modSrcVar(f, "fuel", 10, subtract));
																		(rt.modSrcVar(f, "food", 10, subtract));
																		yield* g.srcCall(f, "event");
																	}
																}
															} else {
																if (truthy(rt.at(live(f.args[1]), "sellcrew"))) {
																	if (isEqual(rt.sv(f, "gameStatus"), 4)) {
																		if ((!truthy(rt.sv(f, "spaceport_raided")) && rt.gt(rt.len(f, rt.sv(f, "settlers")), 1))) {
																			rt.setSv(f, "last_spaceport_action", fmt("You sold your crewmember, ＀!", [(sold = (yield* g.srcCall(f, "remove_crewmember")))]));
																			rt.modSrcVar(f, "fuel", 7, add);
																			rt.modSrcVar(f, "food", 7, add);
																			yield* g.srcCall(f, "event");
																		}
																	}
																} else {
																	if (truthy(rt.at(live(f.args[1]), "leave_spaceport"))) {
																		if (isEqual(rt.sv(f, "gameStatus"), 4)) {
																			rt.setSv(f, "event", null);
																			rt.setSv(f, "gameStatus", 2);
																			rt.setSv(f, "spaceport_raided", 0);
																			rt.setSv(f, "spaceport_freebie", 0);
																			rt.setSv(f, "last_spaceport_action", "");
																		}
																	} else {
																		if (truthy(rt.at(live(f.args[1]), "raid_spaceport"))) {
																			if (isEqual(rt.sv(f, "gameStatus"), 4)) {
																				if (!truthy(rt.sv(f, "spaceport_raided"))) {
																					success = (yield* g.call(f, P("/proc/min"), null, [multiply(15, rt.sv(f, "alive")), 100]));
																					rt.setSv(f, "spaceport_raided", 1);
																					FU = 0;
																					FO = 0;
																					if (truthy(rt.op(f, "Prob", [], [live(success)]))) {
																						FU = (yield* g.call(f, P("/proc/rand"), null, [5, 15]));
																						FO = (yield* g.call(f, P("/proc/rand"), null, [5, 15]));
																						rt.setSv(f, "last_spaceport_action", fmt("You successfully raided the spaceport! you gained ＀ Fuel and ＀ Food! (+＀FU,+＀FO)", [live(FU), live(FO), live(FU), live(FO)]));
																					} else {
																						FU = (yield* g.call(f, P("/proc/rand"), null, [-5, -15]));
																						FO = (yield* g.call(f, P("/proc/rand"), null, [-5, -15]));
																						rt.setSv(f, "last_spaceport_action", fmt("You failed to raid the spaceport! you lost ＀ Fuel and ＀ Food in your scramble to escape! (＀FU,＀FO)", [multiply(live(FU), -1), multiply(live(FO), -1), live(FU), live(FO)]));
																						if (truthy(rt.op(f, "Prob", [], [multiply(live(success), 5)]))) {
																							lost_crew = (yield* g.srcCall(f, "remove_crewmember"));
																							rt.setSv(f, "last_spaceport_action", fmt("You failed to raid the spaceport! you lost ＀ Fuel and ＀ Food, AND ＀ in your scramble to escape! (＀FI,＀FO,-Crew)", [multiply(live(FU), -1), multiply(live(FO), -1), live(lost_crew), live(FU), live(FO)]));
																							if (truthy(rt.sv(f, "emagged"))) {
																								yield* g.srcCall(f, "say", "WEEWOO WEEWOO, Spaceport Security en route!");
																								i = null;
																								live(i);
																								while (rt.le(live(i), 3)) {
																									rt.setFv(f, "target", (O = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/syndicate/ranged/orion"), [rt.getStep(f, live(f.src), 0)]))), live(f.usr));
																									i = rt.inc(live(i), 1);
																								}
																							}
																						}
																					}
																					rt.modSrcVar(f, "fuel", live(FU), add);
																					rt.modSrcVar(f, "food", live(FO), add);
																					yield* g.srcCall(f, "event");
																				}
																			}
																		} else {
																			if (truthy(rt.at(live(f.args[1]), "buyparts"))) {
																				if (isEqual(rt.sv(f, "gameStatus"), 4)) {
																					if ((!truthy(rt.sv(f, "spaceport_raided")) && rt.gt(rt.sv(f, "fuel"), 5))) {
																						$0 = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "buyparts")]));
																						if ($0 === 1) {
																							rt.incSrcVar(f, "engine", 1, true);
																							rt.setSv(f, "last_spaceport_action", "Bought Engine Parts");
																						} else if ($0 === 2) {
																							rt.incSrcVar(f, "hull", 1, true);
																							rt.setSv(f, "last_spaceport_action", "Bought Hull Plates");
																						} else if ($0 === 3) {
																							rt.incSrcVar(f, "electronics", 1, true);
																							rt.setSv(f, "last_spaceport_action", "Bought Spare Electronics");
																						}
																						(rt.modSrcVar(f, "fuel", 5, subtract));
																						yield* g.srcCall(f, "event");
																					}
																				}
																			} else {
																				if (truthy(rt.at(live(f.args[1]), "trade"))) {
																					if (isEqual(rt.sv(f, "gameStatus"), 4)) {
																						if (!truthy(rt.sv(f, "spaceport_raided"))) {
																							$0 = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "trade")]));
																							if ($0 === 1) {
																								if (rt.gt(rt.sv(f, "fuel"), 5)) {
																									(rt.modSrcVar(f, "fuel", 5, subtract));
																									rt.modSrcVar(f, "food", 5, add);
																									rt.setSv(f, "last_spaceport_action", "Traded Fuel for Food");
																									yield* g.srcCall(f, "event");
																								}
																							} else if ($0 === 2) {
																								if (rt.gt(rt.sv(f, "food"), 5)) {
																									rt.modSrcVar(f, "fuel", 5, add);
																									(rt.modSrcVar(f, "food", 5, subtract));
																									rt.setSv(f, "last_spaceport_action", "Traded Food for Fuel");
																									yield* g.srcCall(f, "event");
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	yield* g.srcCall(f, "updateUsrDialog");
	rt.setSv(f, "busy", 0);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/arcade/orion_trail/proc/event  (code/game/machinery/computer/arcade.dm:762)
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/event", function event(f: Frame) {
	let sfood: Value = null, sfuel: Value = null, deadname: Value = null, ling1: Value = null, ling2: Value = null, chance2attack: Value = null, chancetokill: Value = null, deadguy: Value = null, FU: Value = null, FO: Value = null, freecrew: Value = null;
	let $0: any, $1: any;
	f.vars = () => [sfood, sfuel, deadname, ling1, ling2, chance2attack, chancetokill, deadguy, FU, FO, freecrew, $0, $1];
	rt.setSv(f, "eventdat", fmt("<center><h1>＀</h1></center>", [rt.sv(f, "event")]));
	rt.setSv(f, "canContinueEvent", 0);
	$0 = rt.sv(f, "event");
	if ($0 === "Raiders") {
		rt.modSrcVar(f, "eventdat", "Raiders have come aboard your ship!", add);
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			sfood = rt.call(f, P("/proc/rand"), null, [1, 10]);
			sfuel = rt.call(f, P("/proc/rand"), null, [1, 10]);
			(rt.modSrcVar(f, "food", live(sfood), subtract));
			(rt.modSrcVar(f, "fuel", live(sfuel), subtract));
			rt.modSrcVar(f, "eventdat", fmt("<br>They have stolen ＀ <b>Food</b> and ＀ <b>Fuel</b>.", [live(sfood), live(sfuel)]), add);
		} else {
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				rt.modSrcVar(f, "eventdat", fmt("<br>＀ tried to fight back but was killed.", [(deadname = rt.callSrc(f, "remove_crewmember", []))]), add);
			} else {
				rt.modSrcVar(f, "eventdat", "<br>Fortunately you fended them off without any trouble.", add);
			}
		}
		rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;eventclose=1'>Continue</a></P>", [live(f.src)]), add);
		rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [live(f.src)]), add);
		rt.setSv(f, "canContinueEvent", 1);
	} else if ($0 === "Interstellar Flux") {
		rt.modSrcVar(f, "eventdat", "This region of space is highly turbulent. <br>If we go slowly we may avoid more damage, but if we keep our speed we won't waste supplies.", add);
		rt.modSrcVar(f, "eventdat", "<br>What will you do?", add);
		rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;slow=1'>Slow Down</a> <a href='byond://?src=＃;keepspeed=1'>Continue</a></P>", [live(f.src), live(f.src)]), add);
		rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [live(f.src)]), add);
	} else if ($0 === "Illness") {
		rt.modSrcVar(f, "eventdat", "A deadly illness has been contracted!", add);
		rt.modSrcVar(f, "eventdat", fmt("<br>＀ was killed by the disease.", [(deadname = rt.callSrc(f, "remove_crewmember", []))]), add);
		rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;eventclose=1'>Continue</a></P>", [live(f.src)]), add);
		rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [live(f.src)]), add);
		rt.setSv(f, "canContinueEvent", 1);
	} else if ($0 === "Breakdown") {
		rt.modSrcVar(f, "eventdat", "Oh no! The engine has broken down!", add);
		rt.modSrcVar(f, "eventdat", "<br>You can repair it with an engine part, or you can make repairs for 3 days.", add);
		if (rt.ge(rt.sv(f, "engine"), 1)) {
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;useengine=1'>Use Part</a><a href='byond://?src=＃;wait=1'>Wait</a></P>", [live(f.src), live(f.src)]), add);
		} else {
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;wait=1'>Wait</a></P>", [live(f.src)]), add);
		}
		rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [live(f.src)]), add);
	} else if ($0 === "Malfunction") {
		rt.modSrcVar(f, "eventdat", "The ship's systems are malfunctioning!", add);
		rt.modSrcVar(f, "eventdat", "<br>You can replace the broken electronics with spares, or you can spend 3 days troubleshooting the AI.", add);
		if (rt.ge(rt.sv(f, "electronics"), 1)) {
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;useelec=1'>Use Part</a><a href='byond://?src=＃;wait=1'>Wait</a></P>", [live(f.src), live(f.src)]), add);
		} else {
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;wait=1'>Wait</a></P>", [live(f.src)]), add);
		}
		rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [live(f.src)]), add);
	} else if ($0 === "Collision") {
		rt.modSrcVar(f, "eventdat", "Something hit us! Looks like there's some hull damage.", add);
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			sfood = rt.call(f, P("/proc/rand"), null, [5, 15]);
			sfuel = rt.call(f, P("/proc/rand"), null, [5, 15]);
			(rt.modSrcVar(f, "food", live(sfood), subtract));
			(rt.modSrcVar(f, "fuel", live(sfuel), subtract));
			rt.modSrcVar(f, "eventdat", fmt("<br>＀ <b>Food</b> and ＀ <b>Fuel</b> was vented out into space.", [live(sfood), live(sfuel)]), add);
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			rt.modSrcVar(f, "eventdat", fmt("<br>＀ was killed by rapid depressurization.", [(deadname = rt.callSrc(f, "remove_crewmember", []))]), add);
		}
		rt.modSrcVar(f, "eventdat", "<br>You can repair the damage with hull plates, or you can spend the next 3 days welding scrap together.", add);
		if (rt.ge(rt.sv(f, "hull"), 1)) {
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;usehull=1'>Use Part</a><a href='byond://?src=＃;wait=1'>Wait</a></P>", [live(f.src), live(f.src)]), add);
		} else {
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;wait=1'>Wait</a></P>", [live(f.src)]), add);
		}
		rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [live(f.src)]), add);
	} else if ($0 === "BlackHole") {
		rt.modSrcVar(f, "eventdat", "You were swept away into the black hole.", add);
		rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;holedeath=1'>Oh...</a></P>", [live(f.src)]), add);
		rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [live(f.src)]), add);
		rt.setSv(f, "settlers", rt.list());
	} else if ($0 === "Changelings?") {
		rt.modSrcVar(f, "eventdat", "Strange reports warn of changelings infiltrating crews on trips to Orion...", add);
		if (rt.le(rt.len(f, rt.sv(f, "settlers")), 2)) {
			rt.modSrcVar(f, "eventdat", "<br>Your crew's chance of reaching Orion is so slim the changelings likely avoided your ship...", add);
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;eventclose=1'>Continue</a></P>", [live(f.src)]), add);
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [live(f.src)]), add);
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				rt.setSv(f, "lings_aboard", rt.call(f, P("/proc/min"), null, [rt.incSrcVar(f, "lings_aboard", 1, false), 2]));
			}
		} else {
			if (truthy(rt.sv(f, "lings_aboard"))) {
				if (truthy(rt.op(f, "Prob", [], [20]))) {
					rt.setSv(f, "lings_aboard", rt.call(f, P("/proc/min"), null, [rt.incSrcVar(f, "lings_aboard", 1, false), 2]));
				}
			} else {
				if (truthy(rt.op(f, "Prob", [], [70]))) {
					rt.setSv(f, "lings_aboard", rt.call(f, P("/proc/min"), null, [rt.incSrcVar(f, "lings_aboard", 1, false), 2]));
				}
			}
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;killcrew=1'>Kill a crewmember</a></P>", [live(f.src)]), add);
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;eventclose=1'>Risk it</a></P>", [live(f.src)]), add);
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [live(f.src)]), add);
		}
		rt.setSv(f, "canContinueEvent", 1);
	} else if ($0 === "Changeling Ambush") {
		if (rt.le(rt.sv(f, "lings_aboard"), 0)) {
			rt.modSrcVar(f, "eventdat", "Haha, fooled you, there are no changelings on board!", add);
			rt.modSrcVar(f, "eventdat", "<br>(You should report this to a coder :S)", add);
		} else {
			ling1 = rt.callSrc(f, "remove_crewmember", []);
			ling2 = "";
			if (rt.ge(rt.sv(f, "lings_aboard"), 2)) {
				ling2 = rt.callSrc(f, "remove_crewmember", []);
			}
			rt.modSrcVar(f, "eventdat", "Oh no, some of your crew are Changelings!", add);
			if (truthy(live(ling2))) {
				rt.modSrcVar(f, "eventdat", fmt("<br>＀ and ＀'s arms twist and contort into grotesque blades!", [live(ling1), live(ling2)]), add);
			} else {
				rt.modSrcVar(f, "eventdat", fmt("<br>＀'s arm twists and contorts into a grotesque blade!", [live(ling1)]), add);
			}
			if (truthy(rt.op(f, "Prob", [], [(chance2attack = multiply(rt.sv(f, "alive"), 20))]))) {
				if (truthy(rt.op(f, "Prob", [], [(chancetokill = subtract(multiply(30, rt.sv(f, "lings_aboard")), multiply(5, rt.sv(f, "alive"))))]))) {
					deadguy = rt.callSrc(f, "remove_crewmember", []);
					if (truthy(live(ling2))) {
						$0 = "s";
					} else {
						$0 = "";
					}
					if (truthy(live(ling2))) {
						$1 = "";
					} else {
						$1 = "s";
					}
					rt.modSrcVar(f, "eventdat", fmt("<br>The Changeling＀ run＀ up to ＀ and capitulates them!", [$0, $1, live(deadguy)]), add);
				} else {
					if (truthy(live(ling2))) {
						$0 = "s";
					} else {
						$0 = "";
					}
					rt.modSrcVar(f, "eventdat", fmt("<br>You valiantly fight off the Changeling＀!", [$0]), add);
					if (truthy(live(ling2))) {
						$0 = "s";
					} else {
						$0 = "";
					}
					rt.modSrcVar(f, "eventdat", fmt("<br>You cut the Changeling＀ up into meat... Eww", [$0]), add);
					if (truthy(live(ling2))) {
						rt.modSrcVar(f, "food", 30, add);
						rt.setSv(f, "lings_aboard", rt.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "lings_aboard"), 2)]));
					} else {
						rt.modSrcVar(f, "food", 15, add);
						rt.setSv(f, "lings_aboard", rt.call(f, P("/proc/max"), null, [0, rt.incSrcVar(f, "lings_aboard", -1, false)]));
					}
				}
			} else {
				if (truthy(live(ling2))) {
					$0 = "s";
				} else {
					$0 = "";
				}
				if (truthy(live(ling2))) {
					$1 = "";
				} else {
					$1 = "s";
				}
				rt.modSrcVar(f, "eventdat", fmt("<br>The Changeling＀ run＀ away, What wimps!", [$0, $1]), add);
				if (truthy(live(ling2))) {
					rt.setSv(f, "lings_aboard", rt.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "lings_aboard"), 2)]));
				} else {
					rt.setSv(f, "lings_aboard", rt.call(f, P("/proc/max"), null, [0, rt.incSrcVar(f, "lings_aboard", -1, false)]));
				}
			}
		}
		rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;eventclose=1'>Continue</a></P>", [live(f.src)]), add);
		rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [live(f.src)]), add);
		rt.setSv(f, "canContinueEvent", 1);
	} else if ($0 === "Spaceport") {
		rt.setSv(f, "gameStatus", 4);
		if (truthy(rt.sv(f, "spaceport_raided"))) {
			rt.modSrcVar(f, "eventdat", "The Spaceport is on high alert! They won't let you dock since you tried to attack them!", add);
			if (truthy(rt.sv(f, "last_spaceport_action"))) {
				rt.modSrcVar(f, "eventdat", fmt("<br>Last Spaceport Action: ＀", [rt.sv(f, "last_spaceport_action")]), add);
			}
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;leave_spaceport=1'>Depart Spaceport</a></P>", [live(f.src)]), add);
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [live(f.src)]), add);
		} else {
			rt.modSrcVar(f, "eventdat", "You pull the ship up to dock at a nearby Spaceport, lucky find!", add);
			rt.modSrcVar(f, "eventdat", "<br>This Spaceport is home to travellers who failed to reach Orion, but managed to find a different home...", add);
			rt.modSrcVar(f, "eventdat", "<br>Trading terms: FU = Fuel, FO = Food", add);
			if (truthy(rt.sv(f, "last_spaceport_action"))) {
				rt.modSrcVar(f, "eventdat", fmt("<br>Last Spaceport Action: ＀", [rt.sv(f, "last_spaceport_action")]), add);
			}
			rt.modSrcVar(f, "eventdat", "<h3><b>Crew:</b></h3>", add);
			rt.modSrcVar(f, "eventdat", rt.call(f, P("/proc/english_list"), null, [rt.sv(f, "settlers")]), add);
			rt.modSrcVar(f, "eventdat", fmt("<br><b>Food: </b>＀ | <b>Fuel: </b>＀", [rt.sv(f, "food"), rt.sv(f, "fuel")]), add);
			rt.modSrcVar(f, "eventdat", fmt("<br><b>Engine Parts: </b>＀ | <b>Hull Panels: </b>＀ | <b>Electronics: </b>＀", [rt.sv(f, "engine"), rt.sv(f, "hull"), rt.sv(f, "electronics")]), add);
			if ((!truthy(rt.sv(f, "spaceport_freebie")) && (rt.lt(rt.sv(f, "fuel"), 20) || rt.lt(rt.sv(f, "food"), 20)))) {
				rt.incSrcVar(f, "spaceport_freebie", 1, true);
				FU = 10;
				FO = 10;
				freecrew = 0;
				if (truthy(rt.op(f, "Prob", [], [30]))) {
					FU = 25;
					FO = 25;
				}
				if (truthy(rt.op(f, "Prob", [], [10]))) {
					rt.callSrc(f, "add_crewmember", []);
					freecrew = rt.inc(live(freecrew), 1);
				}
				rt.modSrcVar(f, "eventdat", fmt("<br>The traders of the spaceport take pitty on you, and give you some food and fuel (+＀FU,+＀FO)", [live(FU), live(FO)]), add);
				if (truthy(live(freecrew))) {
					rt.modSrcVar(f, "eventdat", "<br>You also gain a new crewmember!", add);
				}
				rt.modSrcVar(f, "fuel", live(FU), add);
				rt.modSrcVar(f, "food", live(FO), add);
			}
			rt.modSrcVar(f, "eventdat", "<P ALIGN=Right>Crew Management:</P>", add);
			if ((rt.ge(rt.sv(f, "food"), 10) && rt.ge(rt.sv(f, "fuel"), 10))) {
				rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;buycrew=1'>Hire a new Crewmember (-10FU,-10FO)</a></P>", [live(f.src)]), add);
			} else {
				rt.modSrcVar(f, "eventdat", "<P ALIGN=Right>Cant afford a new Crewmember</P>", add);
			}
			if (rt.gt(rt.len(f, rt.sv(f, "settlers")), 1)) {
				rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;sellcrew=1'>Sell crew for Fuel and Food (+7FU,+7FO)</a></P>", [live(f.src)]), add);
			} else {
				rt.modSrcVar(f, "eventdat", "<P ALIGN=Right>Cant afford to sell a Crewmember</P>", add);
			}
			rt.modSrcVar(f, "eventdat", "<P ALIGN=Right>Spare Parts:</P>", add);
			if (rt.gt(rt.sv(f, "fuel"), 5)) {
				rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;buyparts=1'>Buy Engine Parts (-5FU)</a></P>", [live(f.src)]), add);
			} else {
				rt.modSrcVar(f, "eventdat", "<P ALIGN=Right>Cant afford to buy Engine Parts</a>", add);
			}
			if (rt.gt(rt.sv(f, "fuel"), 5)) {
				rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;buyparts=2'>Buy Hull Plates (-5FU)</a></P>", [live(f.src)]), add);
			} else {
				rt.modSrcVar(f, "eventdat", "<P ALIGN=Right>Cant afford to buy Hull Plates</a>", add);
			}
			if (rt.gt(rt.sv(f, "fuel"), 5)) {
				rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;buyparts=3'>Buy Spare Electronics (-5FU)</a></P>", [live(f.src)]), add);
			} else {
				rt.modSrcVar(f, "eventdat", "<P ALIGN=Right>Cant afford to buy Spare Electronics</a>", add);
			}
			if (rt.gt(rt.sv(f, "fuel"), 5)) {
				rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;trade=1'>Trade Fuel for Food (-5FU,+5FO)</a></P>", [live(f.src)]), add);
			} else {
				rt.modSrcVar(f, "eventdat", "<P ALIGN=Right>Cant afford to Trade Fuel for Food</P", add);
			}
			if (rt.gt(rt.sv(f, "food"), 5)) {
				rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;trade=2'>Trade Food for Fuel (+5FU,-5FO)</a></P>", [live(f.src)]), add);
			} else {
				rt.modSrcVar(f, "eventdat", "<P ALIGN=Right>Cant afford to Trade Food for Fuel</P", add);
			}
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;raid_spaceport=1'>!! Raid Spaceport !!</a></P>", [live(f.src)]), add);
			rt.modSrcVar(f, "eventdat", fmt("<P ALIGN=Right><a href='byond://?src=＃;leave_spaceport=1'>Depart Spaceport</a></P>", [live(f.src)]), add);
		}
	}
	return f.dot;
});

// /obj/machinery/computer/arcade/orion_trail/proc/add_crewmember  (code/game/machinery/computer/arcade.dm:997)
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/add_crewmember", function add_crewmember(f: Frame, specific: Value) {
	let newcrew: Value = null;
	f.vars = () => [specific, newcrew];
	if (live(specific) === null) {
		specific = "";
	}
	newcrew = "";
	if (truthy(live(specific))) {
		newcrew = live(specific);
	} else {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			newcrew = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_male")]);
		} else {
			newcrew = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_female")]);
		}
	}
	if (truthy(live(newcrew))) {
		rt.modSrcVar(f, "settlers", live(newcrew), add);
		rt.incSrcVar(f, "alive", 1, true);
	}
	return live(newcrew);
});

// /obj/machinery/computer/arcade/orion_trail/proc/remove_crewmember  (code/game/machinery/computer/arcade.dm:1013)
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/remove_crewmember", function remove_crewmember(f: Frame, specific: Value, dont_remove: Value) {
	let safe2remove: Value = null, removed: Value = null;
	f.vars = () => [specific, dont_remove, safe2remove, removed];
	if (live(specific) === null) {
		specific = "";
	}
	if (live(dont_remove) === null) {
		dont_remove = "";
	}
	safe2remove = rt.sv(f, "settlers");
	removed = "";
	if (truthy(live(dont_remove))) {
		(safe2remove = rt.modify(live(safe2remove), live(dont_remove), subtract));
	}
	if ((truthy(live(specific)) && !isEqual(live(specific), live(dont_remove)))) {
		safe2remove = rt.list(live(specific));
	} else {
		removed = rt.op(f, "PickUnweighted", [1], [live(safe2remove)]);
	}
	if (truthy(live(removed))) {
		if ((truthy(rt.sv(f, "lings_aboard")) && truthy(rt.op(f, "Prob", [], [multiply(40, rt.sv(f, "lings_aboard"))])))) {
			rt.setSv(f, "lings_aboard", rt.call(f, P("/proc/max"), null, [0, rt.incSrcVar(f, "lings_aboard", -1, false)]));
		}
		(rt.modSrcVar(f, "settlers", live(removed), subtract));
		rt.incSrcVar(f, "alive", -1, true);
	}
	return live(removed);
});

// /obj/machinery/computer/arcade/orion_trail/proc/win  (code/game/machinery/computer/arcade.dm:1032)  may sleep
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/win", function* win(f: Frame) {
	rt.setSv(f, "gameStatus", 1);
	yield* g.srcCall(f, "say", "Congratulations, you made it to Orion!");
	if (truthy(rt.sv(f, "emagged"))) {
		yield* g.new_(f, T("/obj/item/weapon/orion_ship"), [rt.sv(f, "loc")]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ made it to Orion on an emagged machine and got an explosive toy ship.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ made it to Orion on an emagged machine and got an explosive toy ship.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	} else {
		yield* g.srcCall(f, "prizevend");
	}
	rt.setSv(f, "emagged", 0);
	rt.setSv(f, "name", "The Orion Trail");
	rt.setSv(f, "desc", "Learn how our ancestors got to Orion, and have fun in the process!");
	return f.dot;
}, true);

// /obj/machinery/computer/arcade/orion_trail/proc/emag_act  (code/game/machinery/computer/arcade.dm:1044)
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You override the cheat code menu and skip to Cheat #＀: Realism Mode.</span>", [rt.call(f, P("/proc/rand"), null, [1, 50])])]);
	rt.setSv(f, "name", "The Orion Trail: Realism Edition");
	rt.setSv(f, "desc", "Learn how our ancestors got to Orion, and try not to die in the process!");
	rt.callSrc(f, "newgame", []);
	rt.setSv(f, "emagged", 1);
	return f.dot;
});

rt.type(4891, "/mob/living/simple_animal/hostile/syndicate/ranged/orion", "/mob/living/simple_animal/hostile/syndicate/ranged", {
	name: "Spaceport Security",
	desc: "The Premier security forces for all spaceports found along the Orion Trail.",
	faction: null,
	loot: null,
	del_on_death: 1,
});

// /mob/living/simple_animal/hostile/syndicate/ranged/orion/proc/<init>  (code/game/machinery/computer/arcade.dm:1054)
rt.def("/mob/living/simple_animal/hostile/syndicate/ranged/orion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("orion"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list());
	return f.dot;
});

rt.type(6981, "/obj/item/weapon/orion_ship", "/obj/item/weapon", {
	active: 0,
	name: "model settler ship",
	desc: "A model spaceship, it looks like those used back in the day when travelling to Orion! It even has a miniature FX-293 reactor, which was renowned for its instability and tendency to explode...",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "ship",
	w_class: 2,
});

// /obj/item/weapon/orion_ship/proc/examine  (code/game/machinery/computer/arcade.dm:1067)
rt.def("/obj/item/weapon/orion_ship/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!rt.le(rt.call(f, P("/proc/get_dist"), null, [live(f.args[0]), live(f.src)]), 1)) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "active"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>There's a little switch on the bottom. It's flipped down.</span>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>There's a little switch on the bottom. It's flipped up.</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/orion_ship/proc/attack_self  (code/game/machinery/computer/arcade.dm:1079)  may sleep
rt.def("/obj/item/weapon/orion_ship/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "active"))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ primed an explosive Orion ship for detonation.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ primed an explosive Orion ship for detonation.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You flip the switch on the underside of ＀.</span>", [live(f.src)])]);
	rt.setSv(f, "active", 1);
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ softly beeps and whirs to life!</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/defib_SaftyOn.ogg"), 25, 1]);
	yield* g.srcCall(f, "say", fmt("This is ship ID #＀ to Orion Port Authority. We're coming in for landing, over.", [(yield* g.call(f, P("/proc/rand"), null, [1, 1000]))]));
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ begins to vibrate...</span>", [live(f.src)]));
	yield* g.srcCall(f, "say", "Uh, Port? Having some issues with our reactor, could you check it out? Over.");
	yield* g.call(f, P("/proc/sleep"), null, [30]);
	yield* g.srcCall(f, "say", "Oh, God! Code Eight! CODE EIGHT! IT'S GONNA BL-");
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/buzz-sigh.ogg"), 25, 1]);
	yield* g.call(f, P("/proc/sleep"), null, [3.5999999046325684]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='userdanger'>＀ explodes!</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/explosion"), null, [null, rt.sv(f, "loc"), null, 2, null, 4, null, 8, "flame_range", 16], rt.Args.Named);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
