// Based on /tg/station's code/game/machinery/computer/arcade.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// arcade.dm:8
rt.def("/obj/machinery/computer/arcade/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.prizes = rt.alist(f, [T("/obj/item/weapon/storage/box/snappops"), 2, T("/obj/item/toy/talking/AI"), 2, T("/obj/item/toy/talking/codex_gigas"), 2, T("/obj/item/clothing/under/syndicate/tacticool"), 2, T("/obj/item/toy/sword"), 2, T("/obj/item/toy/gun"), 2, T("/obj/item/weapon/gun/ballistic/shotgun/toy/crossbow"), 2, T("/obj/item/weapon/storage/box/fakesyndiesuit"), 2, T("/obj/item/weapon/storage/crayons"), 2, T("/obj/item/toy/spinningtoy"), 2, T("/obj/item/toy/prize/ripley"), 1, T("/obj/item/toy/prize/fireripley"), 1, T("/obj/item/toy/prize/deathripley"), 1, T("/obj/item/toy/prize/gygax"), 1, T("/obj/item/toy/prize/durand"), 1, T("/obj/item/toy/prize/honk"), 1, T("/obj/item/toy/prize/marauder"), 1, T("/obj/item/toy/prize/seraph"), 1, T("/obj/item/toy/prize/mauler"), 1, T("/obj/item/toy/prize/odysseus"), 1, T("/obj/item/toy/prize/phazon"), 1, T("/obj/item/toy/prize/reticence"), 1, T("/obj/item/toy/cards/deck"), 2, T("/obj/item/toy/nuke"), 2, T("/obj/item/toy/minimeteor"), 2, T("/obj/item/toy/redbutton"), 2, T("/obj/item/toy/talking/owl"), 2, T("/obj/item/toy/talking/griffin"), 2, T("/obj/item/weapon/coin/antagtoken"), 2, T("/obj/item/stack/tile/fakespace/loaded"), 2, T("/obj/item/stack/tile/fakepit/loaded"), 2, T("/obj/item/toy/toy_xeno"), 2, T("/obj/item/weapon/storage/box/actionfigure"), 1, T("/obj/item/weapon/restraints/handcuffs/fake"), 2, T("/obj/item/weapon/grenade/chem_grenade/glitter/pink"), 1, T("/obj/item/weapon/grenade/chem_grenade/glitter/blue"), 1, T("/obj/item/weapon/grenade/chem_grenade/glitter/white"), 1, T("/obj/item/toy/eightball"), 2, T("/obj/item/toy/windupToolbox"), 2]);
	return f.dot;
});

// arcade.dm:55
rt.def("/obj/machinery/computer/arcade/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.circuit) return f.dot;
	let choice: Value = pick(typesof(T("/obj/item/weapon/circuitboard/computer/arcade")) - T("/obj/item/weapon/circuitboard/computer/arcade"));
	let CB: Value = (yield* new_(choice));
	yield* new_(CB.build_path, this.loc, CB);
	yield* qdel(this);
	return f.dot;
}, true);

// arcade.dm:65
rt.def("/obj/machinery/computer/arcade/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.Reset();
	return f.dot;
}, true);

// arcade.dm:72
rt.def("/obj/machinery/computer/arcade/proc/prizevend", function* prizevend(f: Frame) {
	let prizeselect: Value = null;
	if (prob(0.0001)) {
		yield* new_(T("/obj/item/weapon/gun/energy/pulse/prize"), this);
	}
	if (!rt.len(f, this.contents)) {
		prizeselect = pickweight(this.prizes);
		yield* new_(prizeselect, this);
	}
	let prize: Value = pick(this.contents);
	this.visible_message(`<span class='notice'>${this} dispenses a ${prize}!</span>`, "<span class='notice'>You hear a chime and a clunk.</span>");
	prize.loc = this.loc;
	return f.dot;
}, true);

// arcade.dm:89
rt.def("/obj/machinery/computer/arcade/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let empprize: Value = null;
	yield* parent_proc(severity);
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	let num_of_prizes: Value = 0;
	if (severity === 1) {
		num_of_prizes = rand(1, 4);
	} else if (severity === 2) {
		num_of_prizes = rand(0, 2);
	}
	let i: Value = num_of_prizes;
	while (i > 0) {
		empprize = pickweight(this.prizes);
		yield* new_(empprize, this.loc);
		i--;
	}
	yield* explosion(this.loc, -1, 0, 1 + num_of_prizes, { flame_range: 1 + num_of_prizes });
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

// arcade.dm:130
rt.def("/obj/machinery/computer/arcade/battle/proc/Reset", function Reset(f: Frame) {
	let name_action: Value = pick("Defeat ", "Annihilate ", "Save ", "Strike ", "Stop ", "Destroy ", "Robust ", "Romance ", "Pwn ", "Own ", "Ban ");
	let name_part1: Value = pick("the Automatic ", "Farmer ", "Lord ", "Professor ", "the Cuban ", "the Evil ", "the Dread King ", "the Space ", "Lord ", "the Great ", "Duke ", "General ");
	let name_part2: Value = pick("Melonoid", "Murdertron", "Sorcerer", "Ruin", "Jeff", "Ectoplasm", "Crushulon", "Uhangoid", "Vhakoid", "Peteoid", "slime", "Griefer", "ERPer", "Lizard Man", "Unicorn", "Bloopers");
	this.enemy_name = replacetext(name_part1 + name_part2, "the ", "");
	this.name = name_action + name_part1 + name_part2;
	return f.dot;
});

// arcade.dm:139
rt.def("/obj/machinery/computer/arcade/battle/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let popup: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* user.set_machine(this);
	let dat: Value = fmt("<a href='byond://?src=＃;close=1'>Close</a>", [this]);
	dat += `<center><h4>${this.enemy_name}</h4></center>`;
	dat += `<br><center><h3>${this.temp}</h3></center>`;
	dat += `<br><center>Health: ${this.player_hp} | Magic: ${this.player_mp} | Enemy Health: ${this.enemy_hp}</center>`;
	if (this.gameover) {
		dat += fmt("<center><b><a href='byond://?src=＃;newgame=1'>New Game</a>", [this]);
	} else {
		dat += fmt("<center><b><a href='byond://?src=＃;attack=1'>Attack</a> | ", [this]);
		dat += fmt("<a href='byond://?src=＃;heal=1'>Heal</a> | ", [this]);
		dat += fmt("<a href='byond://?src=＃;charge=1'>Recharge Power</a>", [this]);
	}
	dat += "</b></center>";
	(popup = (yield* new_(T("/datum/browser"), user, "arcade", "Space Villian 2000"))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// arcade.dm:163
rt.def("/obj/machinery/computer/arcade/battle/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let attackamt: Value = null, pointamt: Value = null, healamt: Value = null, chargeamt: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!this.blocked && !this.gameover) {
		if (rt.at(href_list, "attack")) {
			this.blocked = 1;
			this.temp = `You attack for ${(attackamt = rand(2, 6))} damage!`;
			yield* playsound(this.loc, rt.rsc("sound/arcade/hit.ogg"), 50, 1, { extrarange: -3, falloff: 10 });
			yield* this.updateUsrDialog();
			if (this.turtle > 0) {
				this.turtle--;
			}
			yield* sleep(10);
			this.enemy_hp -= attackamt;
			yield* this.arcade_action();
		} else if (rt.at(href_list, "heal")) {
			this.blocked = 1;
			pointamt = rand(1, 3);
			healamt = rand(6, 8);
			this.temp = `You use ${pointamt} magic to heal for ${healamt} damage!`;
			yield* playsound(this.loc, rt.rsc("sound/arcade/heal.ogg"), 50, 1, { extrarange: -3, falloff: 10 });
			yield* this.updateUsrDialog();
			this.turtle++;
			yield* sleep(10);
			this.player_mp -= pointamt;
			this.player_hp += healamt;
			this.blocked = 1;
			yield* this.updateUsrDialog();
			yield* this.arcade_action();
		} else if (rt.at(href_list, "charge")) {
			this.blocked = 1;
			this.temp = `You regain ${(chargeamt = rand(4, 7))} points`;
			yield* playsound(this.loc, rt.rsc("sound/arcade/mana.ogg"), 50, 1, { extrarange: -3, falloff: 10 });
			this.player_mp += chargeamt;
			if (this.turtle > 0) {
				this.turtle--;
			}
			yield* this.updateUsrDialog();
			yield* sleep(10);
			yield* this.arcade_action();
		}
	}
	if (rt.at(href_list, "close")) {
		yield* f.usr.unset_machine();
		rt.op(f, "Browse", [], [f.usr, null, "window=arcade"], false);
	} else if (rt.at(href_list, "newgame")) {
		this.temp = "New Round";
		this.player_hp = 30;
		this.player_mp = 10;
		this.enemy_hp = 45;
		this.enemy_mp = 20;
		this.gameover = 0;
		this.turtle = 0;
		if (this.emagged) {
			yield* this.Reset();
			this.emagged = 0;
		}
	}
	yield* this.add_fingerprint(f.usr);
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// arcade.dm:231
rt.def("/obj/machinery/computer/arcade/battle/proc/arcade_action", function* arcade_action(f: Frame) {
	let boomamt: Value = null, stealamt: Value = null, attackamt: Value = null;
	if (this.enemy_mp <= 0 || this.enemy_hp <= 0) {
		if (!this.gameover) {
			this.gameover = 1;
			this.temp = `${this.enemy_name} has fallen! Rejoice!`;
			yield* playsound(this.loc, rt.rsc("sound/arcade/win.ogg"), 50, 1, { extrarange: -3, falloff: 10 });
			if (this.emagged) {
				yield* new_(T("/obj/effect/spawner/newbomb/timer/syndicate"), this.loc);
				yield* new_(T("/obj/item/clothing/head/collectable/petehat"), this.loc);
				message_admins(`${key_name_admin(f.usr)} has outbombed Cuban Pete and been awarded a bomb.`);
				log_game(`${key_name(f.usr)} has outbombed Cuban Pete and been awarded a bomb.`);
				yield* this.Reset();
				this.emagged = 0;
			} else {
				yield* this.prizevend();
			}
		}
	} else if (this.emagged && this.turtle >= 4) {
		boomamt = rand(5, 10);
		this.temp = `${this.enemy_name} throws a bomb, exploding you for ${boomamt} damage!`;
		yield* playsound(this.loc, rt.rsc("sound/arcade/boom.ogg"), 50, 1, { extrarange: -3, falloff: 10 });
		this.player_hp -= boomamt;
	} else if (this.enemy_mp <= 5 && prob(70)) {
		stealamt = rand(2, 3);
		this.temp = `${this.enemy_name} steals ${stealamt} of your power!`;
		yield* playsound(this.loc, rt.rsc("sound/arcade/steal.ogg"), 50, 1, { extrarange: -3, falloff: 10 });
		this.player_mp -= stealamt;
		yield* this.updateUsrDialog();
		if (this.player_mp <= 0) {
			this.gameover = 1;
			yield* sleep(10);
			this.temp = "You have been drained! GAME OVER";
			yield* playsound(this.loc, rt.rsc("sound/arcade/lose.ogg"), 50, 1, { extrarange: -3, falloff: 10 });
			if (this.emagged) {
				yield* f.usr.gib();
			}
		}
	} else if (this.enemy_hp <= 10 && this.enemy_mp > 4) {
		this.temp = `${this.enemy_name} heals for 4 health!`;
		yield* playsound(this.loc, rt.rsc("sound/arcade/heal.ogg"), 50, 1, { extrarange: -3, falloff: 10 });
		this.enemy_hp += 4;
		this.enemy_mp -= 4;
	} else {
		attackamt = rand(3, 6);
		this.temp = `${this.enemy_name} attacks for ${attackamt} damage!`;
		yield* playsound(this.loc, rt.rsc("sound/arcade/hit.ogg"), 50, 1, { extrarange: -3, falloff: 10 });
		this.player_hp -= attackamt;
	}
	if (this.player_mp <= 0 || this.player_hp <= 0) {
		this.gameover = 1;
		this.temp = "You have been crushed! GAME OVER";
		yield* playsound(this.loc, rt.rsc("sound/arcade/lose.ogg"), 50, 1, { extrarange: -3, falloff: 10 });
		if (this.emagged) {
			yield* f.usr.gib();
		}
	}
	this.blocked = 0;
	return f.dot;
}, true);

// arcade.dm:300
rt.def("/obj/machinery/computer/arcade/battle/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	this.temp = "If you die in the game, you die for real!";
	this.player_hp = 30;
	this.player_mp = 10;
	this.enemy_hp = 45;
	this.enemy_mp = 20;
	this.gameover = 0;
	this.blocked = 0;
	this.emagged = 1;
	this.enemy_name = "Cuban Pete";
	this.name = "Outbomb Cuban Pete";
	yield* this.updateUsrDialog();
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

// arcade.dm:356
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.settlers = list("Harry", "Larry", "Bob");
	this.events = rt.alist(f, ["Raiders", 3, "Interstellar Flux", 1, "Illness", 3, "Breakdown", 2, "Changelings?", 3, "Malfunction", 2, "Collision", 1, "Spaceport", 2]);

	this.stops = list();

	this.stopblurbs = list();
	return f.dot;
});

// arcade.dm:391
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/newgame", function newgame(f: Frame) {
	this.settlers = list();
	let i: Value = 1;
	while (i <= 3) {
		this.add_crewmember();
		i++;
	}
	this.add_crewmember(`${f.usr}`);
	this.engine = 1;
	this.hull = 1;
	this.electronics = 1;
	this.food = 80;
	this.fuel = 60;
	this.alive = 4;
	this.turns = 1;
	this.event = null;
	this.gameStatus = ORION_STATUS_NORMAL;
	this.lings_aboard = 0;
	this.spaceport_raided = 0;
	this.spaceport_freebie = 0;
	this.last_spaceport_action = "";
	return f.dot;
});

// arcade.dm:413
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let M: Value = null, title: Value = null, subtext: Value = null, popup: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.fuel <= 0 || this.food <= 0 || rt.len(f, this.settlers) == 0) {
		this.gameStatus = ORION_STATUS_GAMEOVER;
		this.event = null;
	}
	yield* user.set_machine(this);
	let dat: Value = "";
	if (this.gameStatus == ORION_STATUS_GAMEOVER) {
		dat = "<center><h1>Game Over</h1></center>";
		dat += "Like many before you, your crew never made it to Orion, lost to space... <br><b>Forever</b>.";
		if (rt.len(f, this.settlers) == 0) {
			dat += "<br>Your entire crew died, your ship joins the fleet of ghost-ships littering the galaxy.";
		} else {
			if (this.food <= 0) {
				dat += "<br>You ran out of food and starved.";
				if (this.emagged) {
					user.nutrition = 0;
					to_chat(user, "<span class='userdanger'><font size=3>Your body instantly contracts to that of one who has not eaten in months. Agonizing cramps seize you as you fall to the floor.</span>");
				}
			}
			if (this.fuel <= 0) {
				dat += "<br>You ran out of fuel, and drift, slowly, into a star.";
				if (this.emagged) {
					yield* (M = user).adjust_fire_stacks(5);
					yield* M.IgniteMob();
					to_chat(user, "<span class='userdanger'><font size=3>You feel an immense wave of heat emanate from the arcade machine. Your skin bursts into flames.</span>");
				}
			}
		}
		dat += fmt("<br><P ALIGN=Right><a href='byond://?src=＃;menu=1'>OK...</a></P>", [this]);
		if (this.emagged) {
			to_chat(user, "<span class='userdanger'><font size=3>You're never going to make it to Orion...</span></font>");
			yield* user.death();
			this.emagged = 0;
			this.gameStatus = ORION_STATUS_START;
			this.name = "The Orion Trail";
			this.desc = "Learn how our ancestors got to Orion, and have fun in the process!";
		}
	} else if (this.event) {
		dat = this.eventdat;
	} else if (this.gameStatus == ORION_STATUS_NORMAL) {
		title = rt.index(this.stops, this.turns);
		subtext = rt.index(this.stopblurbs, this.turns);
		dat = `<center><h1>${title}</h1></center>`;
		dat += `${subtext}`;
		dat += "<h3><b>Crew:</b></h3>";
		dat += english_list(this.settlers);
		dat += `<br><b>Food: </b>${this.food} | <b>Fuel: </b>${this.fuel}`;
		dat += `<br><b>Engine Parts: </b>${this.engine} | <b>Hull Panels: </b>${this.hull} | <b>Electronics: </b>${this.electronics}`;
		if (this.turns == 7) {
			dat += fmt("<P ALIGN=Right><a href='byond://?src=＃;pastblack=1'>Go Around</a> <a href='byond://?src=＃;blackhole=1'>Continue</a></P>", [this, this]);
		} else {
			dat += fmt("<P ALIGN=Right><a href='byond://?src=＃;continue=1'>Continue</a></P>", [this]);
		}
		dat += fmt("<P ALIGN=Right><a href='byond://?src=＃;killcrew=1'>Kill a crewmember</a></P>", [this]);
		dat += fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [this]);
	} else {
		dat = "<center><h2>The Orion Trail</h2></center>";
		dat += "<br><center><h3>Experience the journey of your ancestors!</h3></center><br><br>";
		dat += fmt("<center><b><a href='byond://?src=＃;newgame=1'>New Game</a></b></center>", [this]);
		dat += fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [this]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "arcade", "The Orion Trail", 400, 700))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// arcade.dm:477
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let M: Value = null, severity: Value = null, F: Value = null, _T: Value = null, oldfood: Value = null, oldfuel: Value = null, L: Value = null, S: Value = null, sheriff: Value = null, bought: Value = null, sold: Value = null, success: Value = null, FU: Value = null, FO: Value = null, lost_crew: Value = null, i: Value = null, O: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.at(href_list, "close")) {
		yield* f.usr.unset_machine();
		rt.op(f, "Browse", [], [f.usr, null, "window=arcade"], false);
	}
	if (this.busy) {
		return f.dot;
	}
	this.busy = 1;
	if (rt.at(href_list, "continue")) {
		if (this.gameStatus == ORION_STATUS_NORMAL && !this.event && this.turns != 7) {
			if (this.turns >= ORION_TRAIL_WINTURN) {
				yield* this.win();
			} else {
				this.food -= (this.alive + this.lings_aboard) * 2;
				this.fuel -= 5;
				if (this.turns == 2 && prob(30)) {
					this.event = "Collision";
					yield* this.event();
				} else if (prob(75)) {
					this.event = pickweight(this.events);
					if (this.lings_aboard) {
						if (this.event == "Changelings?" || prob(55)) {
							this.event = "Changeling Ambush";
						}
					}
					yield* this.event();
				}
				this.turns += 1;
			}
			if (this.emagged) {
				M = f.usr;
				if (this.event === "Raiders") {
					if (prob(50)) {
						to_chat(f.usr, "<span class='userdanger'>You hear battle shouts. The tramping of boots on cold metal. Screams of agony. The rush of venting air. Are you going insane?</span>");
						M.hallucination += 30;
					} else {
						to_chat(f.usr, "<span class='userdanger'>Something strikes you from behind! It hurts like hell and feel like a blunt weapon, but nothing is there...</span>");
						yield* M.take_bodypart_damage(30);
						playsound(this.loc, rt.rsc("sound/weapons/genhit2.ogg"), 100, 1);
					}
				} else if (this.event === "Illness") {
					if ((severity = rand(1, 3)) == 1) {
						to_chat(M, "<span class='userdanger'>You suddenly feel slightly nauseous.</span>");
					}
					if (severity == 2) {
						to_chat(f.usr, "<span class='userdanger'>You suddenly feel extremely nauseous and hunch over until it passes.</span>");
						yield* M.Stun(60);
					}
					if (severity >= 3) {
						to_chat(M, "<span class='warning'>An overpowering wave of nausea consumes over you. You hunch over, your stomach's contents preparing for a spectacular exit.</span>");
						yield* M.Stun(100);
						yield* sleep(30);
						yield* M.vomit(10, { distance: 5 });
					}
				} else if (this.event === "Interstellar Flux") {
					if (prob(75)) {
						yield* M.Knockdown(60);
						yield* this.say(`A sudden gust of powerful wind slams ${M} into the floor!`);
						yield* M.take_bodypart_damage(25);
						playsound(this.loc, rt.rsc("sound/weapons/genhit.ogg"), 100, 1);
					} else {
						to_chat(M, "<span class='userdanger'>A violent gale blows past you, and you barely manage to stay standing!</span>");
					}
				} else if (this.event === "Collision") {
					if (prob(90)) {
						playsound(this.loc, rt.rsc("sound/effects/bang.ogg"), 100, 1);
						for (F of each(orange(1, this), T("/turf/open/floor"))) {
							yield* F.ChangeTurf(F.baseturf);
						}
						yield* this.say(`Something slams into the floor around ${this}, exposing it to space!`);
						if (this.hull) {
							yield* sleep(10);
							yield* this.say(`A new floor suddenly appears around ${this}. What the hell?`);
							playsound(this.loc, rt.rsc("sound/weapons/genhit.ogg"), 100, 1);
							for (_T of each(orange(1, this), T("/turf/open/space"))) {
								yield* _T.ChangeTurf(T("/turf/open/floor/plating"));
							}
						}
					} else {
						yield* this.say(`Something slams into the floor around ${this} - luckily, it didn't get through!`);
						playsound(this.loc, rt.rsc("sound/effects/bang.ogg"), 50, 1);
					}
				} else if (this.event === "Malfunction") {
					playsound(this.loc, rt.rsc("sound/effects/empulse.ogg"), 50, 1);
					this.visible_message(`<span class='danger'>${this} malfunctions, randomizing in-game stats!</span>`);
					oldfood = this.food;
					oldfuel = this.fuel;
					this.food = rand(10, 80) / rand(1, 2);
					this.fuel = rand(10, 60) / rand(1, 2);
					if (this.electronics) {
						yield* sleep(10);
						if (oldfuel > this.fuel && oldfood > this.food) {
							this.audible_message(`<span class='danger'>${this} lets out a somehow reassuring chime.</span>`);
						} else if (oldfuel < this.fuel || oldfood < this.food) {
							this.audible_message(`<span class='danger'>${this} lets out a somehow ominous chime.</span>`);
						}
						this.food = oldfood;
						this.fuel = oldfuel;
						playsound(this.loc, rt.rsc("sound/machines/chime.ogg"), 50, 1);
					}
				}
			}
		}
	} else if (rt.at(href_list, "newgame")) {
		if (this.gameStatus == ORION_STATUS_START) {
			this.newgame();
		}
	} else if (rt.at(href_list, "menu")) {
		if (this.gameStatus == ORION_STATUS_GAMEOVER) {
			this.gameStatus = ORION_STATUS_START;
			this.event = null;
			this.food = 80;
			this.fuel = 60;
			this.settlers = list("Harry", "Larry", "Bob");
		}
	} else if (rt.at(href_list, "slow")) {
		if (this.event == "Interstellar Flux") {
			this.food -= (this.alive + this.lings_aboard) * 2;
			this.fuel -= 5;
		}
		this.event = null;
	} else if (rt.at(href_list, "pastblack")) {
		if (this.turns == 7) {
			this.food -= (this.alive + this.lings_aboard) * 2 * 3;
			this.fuel -= 15;
			this.turns += 1;
			this.event = null;
		}
	} else if (rt.at(href_list, "useengine")) {
		if (this.event == "Breakdown") {
			this.engine = max(0, --this.engine);
			this.event = null;
		}
	} else if (rt.at(href_list, "useelec")) {
		if (this.event == "Malfunction") {
			this.electronics = max(0, --this.electronics);
			this.event = null;
		}
	} else if (rt.at(href_list, "usehull")) {
		if (this.event == "Collision") {
			this.hull = max(0, --this.hull);
			this.event = null;
		}
	} else if (rt.at(href_list, "wait")) {
		if (this.event == "Breakdown" || this.event == "Malfunction" || this.event == "Collision") {
			this.food -= (this.alive + this.lings_aboard) * 2 * 3;
			this.event = null;
		}
	} else if (rt.at(href_list, "keepspeed")) {
		if (this.event == "Interstellar Flux") {
			if (prob(75)) {
				this.event = "Breakdown";
				yield* this.event();
			} else {
				this.event = null;
			}
		}
	} else if (rt.at(href_list, "blackhole")) {
		if (this.turns == 7) {
			if (prob(75)) {
				this.event = "BlackHole";
				yield* this.event();
				if (this.emagged) {
					playsound(this.loc, rt.rsc("sound/effects/supermatter.ogg"), 100, 1);
					yield* this.say(`A miniature black hole suddenly appears in front of ${this}, devouring ${f.usr} alive!`);
					if (rt.istype(f.usr, T("/mob/living"))) {
						yield* (L = f.usr).Stun(200, { ignore_canstun: 1 });
					}
					S = (yield* new_(T("/obj/singularity/academy"), f.usr.loc));
					this.emagged = 0;
					yield* sleep(50);
					yield* this.say(`${S} winks out, just as suddenly as it appeared.`);
					yield* qdel(S);
				}
			} else {
				this.event = null;
				this.turns += 1;
			}
		}
	} else if (rt.at(href_list, "holedeath")) {
		if (this.event == "BlackHole") {
			this.gameStatus = ORION_STATUS_GAMEOVER;
			this.event = null;
		}
	} else if (rt.at(href_list, "eventclose")) {
		if (this.canContinueEvent) {
			this.event = null;
		}
	} else if (rt.at(href_list, "killcrew")) {
		if (this.gameStatus == ORION_STATUS_NORMAL || this.event == "Changelings?") {
			sheriff = this.remove_crewmember();
			playsound(this.loc, rt.rsc("sound/weapons/gunshot.ogg"), 100, 1);
			if (rt.len(f, this.settlers) == 0 || this.alive == 0) {
				yield* this.say(`The last crewmember ${sheriff}, shot themselves, GAME OVER!`);
				if (this.emagged) {
					yield* f.usr.death(0);
					this.emagged = 0;
				}
				this.gameStatus = ORION_STATUS_GAMEOVER;
				this.event = null;
			} else if (this.emagged) {
				if (f.usr.name == sheriff) {
					yield* this.say(`The crew of the ship chose to kill ${f.usr.name}!`);
					yield* f.usr.death(0);
				}
			}
			if (this.event == "Changelings?") {
				this.event = null;
			}
		}
	} else if (rt.at(href_list, "buycrew")) {
		if (this.gameStatus == ORION_STATUS_MARKET) {
			if (!this.spaceport_raided && this.food >= 10 && this.fuel >= 10) {
				this.last_spaceport_action = `You hired ${(bought = this.add_crewmember())} as a new crewmember.`;
				this.fuel -= 10;
				this.food -= 10;
				yield* this.event();
			}
		}
	} else if (rt.at(href_list, "sellcrew")) {
		if (this.gameStatus == ORION_STATUS_MARKET) {
			if (!this.spaceport_raided && rt.len(f, this.settlers) > 1) {
				this.last_spaceport_action = `You sold your crewmember, ${(sold = this.remove_crewmember())}!`;
				this.fuel += 7;
				this.food += 7;
				yield* this.event();
			}
		}
	} else if (rt.at(href_list, "leave_spaceport")) {
		if (this.gameStatus == ORION_STATUS_MARKET) {
			this.event = null;
			this.gameStatus = ORION_STATUS_NORMAL;
			this.spaceport_raided = 0;
			this.spaceport_freebie = 0;
			this.last_spaceport_action = "";
		}
	} else if (rt.at(href_list, "raid_spaceport")) {
		if (this.gameStatus == ORION_STATUS_MARKET) {
			if (!this.spaceport_raided) {
				success = min(15 * this.alive, 100);
				this.spaceport_raided = 1;
				FU = 0;
				FO = 0;
				if (prob(success)) {
					FU = rand(5, 15);
					FO = rand(5, 15);
					this.last_spaceport_action = `You successfully raided the spaceport! you gained ${FU} Fuel and ${FO} Food! (+${FU}FU,+${FO}FO)`;
				} else {
					FU = rand(-5, -15);
					FO = rand(-5, -15);
					this.last_spaceport_action = `You failed to raid the spaceport! you lost ${FU * -1} Fuel and ${FO * -1} Food in your scramble to escape! (${FU}FU,${FO}FO)`;
					if (prob(success * 5)) {
						lost_crew = this.remove_crewmember();
						this.last_spaceport_action = `You failed to raid the spaceport! you lost ${FU * -1} Fuel and ${FO * -1} Food, AND ${lost_crew} in your scramble to escape! (${FU}FI,${FO}FO,-Crew)`;
						if (this.emagged) {
							yield* this.say("WEEWOO WEEWOO, Spaceport Security en route!");
							i;
							while (i <= 3) {
								(O = (yield* new_(T("/mob/living/simple_animal/hostile/syndicate/ranged/orion"), rt.getStep(f, this, 0)))).target = f.usr;
								i++;
							}
						}
					}
				}
				this.fuel += FU;
				this.food += FO;
				yield* this.event();
			}
		}
	} else if (rt.at(href_list, "buyparts")) {
		if (this.gameStatus == ORION_STATUS_MARKET) {
			if (!this.spaceport_raided && this.fuel > 5) {
				const text2num_2 = text2num(rt.at(href_list, "buyparts"));
				if (text2num_2 === 1) {
					this.engine++;
					this.last_spaceport_action = "Bought Engine Parts";
				} else if (text2num_2 === 2) {
					this.hull++;
					this.last_spaceport_action = "Bought Hull Plates";
				} else if (text2num_2 === 3) {
					this.electronics++;
					this.last_spaceport_action = "Bought Spare Electronics";
				}
				this.fuel -= 5;
				yield* this.event();
			}
		}
	} else if (rt.at(href_list, "trade")) {
		if (this.gameStatus == ORION_STATUS_MARKET) {
			if (!this.spaceport_raided) {
				const text2num_2 = text2num(rt.at(href_list, "trade"));
				if (text2num_2 === 1) {
					if (this.fuel > 5) {
						this.fuel -= 5;
						this.food += 5;
						this.last_spaceport_action = "Traded Fuel for Food";
						yield* this.event();
					}
				} else if (text2num_2 === 2) {
					if (this.food > 5) {
						this.fuel += 5;
						this.food -= 5;
						this.last_spaceport_action = "Traded Food for Fuel";
						yield* this.event();
					}
				}
			}
		}
	}
	yield* this.add_fingerprint(f.usr);
	yield* this.updateUsrDialog();
	this.busy = 0;
	return f.dot;
}, true);

// arcade.dm:762
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/event", function event(f: Frame) {
	let sfood: Value = null, sfuel: Value = null, deadname: Value = null, ling1: Value = null, ling2: Value = null, chance2attack: Value = null, chancetokill: Value = null, deadguy: Value = null, FU: Value = null, FO: Value = null, freecrew: Value = null;
	this.eventdat = `<center><h1>${this.event}</h1></center>`;
	this.canContinueEvent = 0;
	let $0: any = this.event;
	if ($0 === "Raiders") {
		this.eventdat += "Raiders have come aboard your ship!";
		if (prob(50)) {
			sfood = rand(1, 10);
			sfuel = rand(1, 10);
			this.food -= sfood;
			this.fuel -= sfuel;
			this.eventdat += `<br>They have stolen ${sfood} <b>Food</b> and ${sfuel} <b>Fuel</b>.`;
		} else if (prob(10)) {
			this.eventdat += `<br>${(deadname = this.remove_crewmember())} tried to fight back but was killed.`;
		} else {
			this.eventdat += "<br>Fortunately you fended them off without any trouble.";
		}
		this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;eventclose=1'>Continue</a></P>", [this]);
		this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [this]);
		this.canContinueEvent = 1;
	} else if ($0 === "Interstellar Flux") {
		this.eventdat += "This region of space is highly turbulent. <br>If we go slowly we may avoid more damage, but if we keep our speed we won't waste supplies.";
		this.eventdat += "<br>What will you do?";
		this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;slow=1'>Slow Down</a> <a href='byond://?src=＃;keepspeed=1'>Continue</a></P>", [this, this]);
		this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [this]);
	} else if ($0 === "Illness") {
		this.eventdat += "A deadly illness has been contracted!";
		this.eventdat += `<br>${(deadname = this.remove_crewmember())} was killed by the disease.`;
		this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;eventclose=1'>Continue</a></P>", [this]);
		this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [this]);
		this.canContinueEvent = 1;
	} else if ($0 === "Breakdown") {
		this.eventdat += "Oh no! The engine has broken down!";
		this.eventdat += "<br>You can repair it with an engine part, or you can make repairs for 3 days.";
		if (this.engine >= 1) {
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;useengine=1'>Use Part</a><a href='byond://?src=＃;wait=1'>Wait</a></P>", [this, this]);
		} else {
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;wait=1'>Wait</a></P>", [this]);
		}
		this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [this]);
	} else if ($0 === "Malfunction") {
		this.eventdat += "The ship's systems are malfunctioning!";
		this.eventdat += "<br>You can replace the broken electronics with spares, or you can spend 3 days troubleshooting the AI.";
		if (this.electronics >= 1) {
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;useelec=1'>Use Part</a><a href='byond://?src=＃;wait=1'>Wait</a></P>", [this, this]);
		} else {
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;wait=1'>Wait</a></P>", [this]);
		}
		this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [this]);
	} else if ($0 === "Collision") {
		this.eventdat += "Something hit us! Looks like there's some hull damage.";
		if (prob(25)) {
			sfood = rand(5, 15);
			sfuel = rand(5, 15);
			this.food -= sfood;
			this.fuel -= sfuel;
			this.eventdat += `<br>${sfood} <b>Food</b> and ${sfuel} <b>Fuel</b> was vented out into space.`;
		}
		if (prob(10)) {
			this.eventdat += `<br>${(deadname = this.remove_crewmember())} was killed by rapid depressurization.`;
		}
		this.eventdat += "<br>You can repair the damage with hull plates, or you can spend the next 3 days welding scrap together.";
		if (this.hull >= 1) {
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;usehull=1'>Use Part</a><a href='byond://?src=＃;wait=1'>Wait</a></P>", [this, this]);
		} else {
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;wait=1'>Wait</a></P>", [this]);
		}
		this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [this]);
	} else if ($0 === "BlackHole") {
		this.eventdat += "You were swept away into the black hole.";
		this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;holedeath=1'>Oh...</a></P>", [this]);
		this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [this]);
		this.settlers = list();
	} else if ($0 === "Changelings?") {
		this.eventdat += "Strange reports warn of changelings infiltrating crews on trips to Orion...";
		if (rt.len(f, this.settlers) <= 2) {
			this.eventdat += "<br>Your crew's chance of reaching Orion is so slim the changelings likely avoided your ship...";
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;eventclose=1'>Continue</a></P>", [this]);
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [this]);
			if (prob(10)) {
				this.lings_aboard = min(++this.lings_aboard, 2);
			}
		} else {
			if (this.lings_aboard) {
				if (prob(20)) {
					this.lings_aboard = min(++this.lings_aboard, 2);
				}
			} else if (prob(70)) {
				this.lings_aboard = min(++this.lings_aboard, 2);
			}
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;killcrew=1'>Kill a crewmember</a></P>", [this]);
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;eventclose=1'>Risk it</a></P>", [this]);
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [this]);
		}
		this.canContinueEvent = 1;
	} else if ($0 === "Changeling Ambush") {
		if (this.lings_aboard <= 0) {
			this.eventdat += "Haha, fooled you, there are no changelings on board!";
			this.eventdat += "<br>(You should report this to a coder :S)";
		} else {
			ling1 = this.remove_crewmember();
			ling2 = "";
			if (this.lings_aboard >= 2) {
				ling2 = this.remove_crewmember();
			}
			this.eventdat += "Oh no, some of your crew are Changelings!";
			if (ling2) {
				this.eventdat += `<br>${ling1} and ${ling2}'s arms twist and contort into grotesque blades!`;
			} else {
				this.eventdat += `<br>${ling1}'s arm twists and contorts into a grotesque blade!`;
			}
			if (prob((chance2attack = this.alive * 20))) {
				if (prob((chancetokill = 30 * this.lings_aboard - 5 * this.alive))) {
					deadguy = this.remove_crewmember();
					if (ling2) {
						$0 = "s";
					} else {
						$0 = "";
					}
					this.eventdat += `<br>The Changeling${$0} run${ling2 ? "" : "s"} up to ${deadguy} and capitulates them!`;
				} else {
					if (ling2) {
						$0 = "s";
					} else {
						$0 = "";
					}
					this.eventdat += `<br>You valiantly fight off the Changeling${$0}!`;
					if (ling2) {
						$0 = "s";
					} else {
						$0 = "";
					}
					this.eventdat += `<br>You cut the Changeling${$0} up into meat... Eww`;
					if (ling2) {
						this.food += 30;
						this.lings_aboard = max(0, this.lings_aboard - 2);
					} else {
						this.food += 15;
						this.lings_aboard = max(0, --this.lings_aboard);
					}
				}
			} else {
				if (ling2) {
					$0 = "s";
				} else {
					$0 = "";
				}
				this.eventdat += `<br>The Changeling${$0} run${ling2 ? "" : "s"} away, What wimps!`;
				if (ling2) {
					this.lings_aboard = max(0, this.lings_aboard - 2);
				} else {
					this.lings_aboard = max(0, --this.lings_aboard);
				}
			}
		}
		this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;eventclose=1'>Continue</a></P>", [this]);
		this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [this]);
		this.canContinueEvent = 1;
	} else if ($0 === "Spaceport") {
		this.gameStatus = ORION_STATUS_MARKET;
		if (this.spaceport_raided) {
			this.eventdat += "The Spaceport is on high alert! They won't let you dock since you tried to attack them!";
			if (this.last_spaceport_action) {
				this.eventdat += `<br>Last Spaceport Action: ${this.last_spaceport_action}`;
			}
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;leave_spaceport=1'>Depart Spaceport</a></P>", [this]);
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;close=1'>Close</a></P>", [this]);
		} else {
			this.eventdat += "You pull the ship up to dock at a nearby Spaceport, lucky find!";
			this.eventdat += "<br>This Spaceport is home to travellers who failed to reach Orion, but managed to find a different home...";
			this.eventdat += "<br>Trading terms: FU = Fuel, FO = Food";
			if (this.last_spaceport_action) {
				this.eventdat += `<br>Last Spaceport Action: ${this.last_spaceport_action}`;
			}
			this.eventdat += "<h3><b>Crew:</b></h3>";
			this.eventdat += english_list(this.settlers);
			this.eventdat += `<br><b>Food: </b>${this.food} | <b>Fuel: </b>${this.fuel}`;
			this.eventdat += `<br><b>Engine Parts: </b>${this.engine} | <b>Hull Panels: </b>${this.hull} | <b>Electronics: </b>${this.electronics}`;
			if (!this.spaceport_freebie && (this.fuel < 20 || this.food < 20)) {
				this.spaceport_freebie++;
				FU = 10;
				FO = 10;
				freecrew = 0;
				if (prob(30)) {
					FU = 25;
					FO = 25;
				}
				if (prob(10)) {
					this.add_crewmember();
					freecrew++;
				}
				this.eventdat += `<br>The traders of the spaceport take pitty on you, and give you some food and fuel (+${FU}FU,+${FO}FO)`;
				if (freecrew) {
					this.eventdat += "<br>You also gain a new crewmember!";
				}
				this.fuel += FU;
				this.food += FO;
			}
			this.eventdat += "<P ALIGN=Right>Crew Management:</P>";
			if (this.food >= 10 && this.fuel >= 10) {
				this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;buycrew=1'>Hire a new Crewmember (-10FU,-10FO)</a></P>", [this]);
			} else {
				this.eventdat += "<P ALIGN=Right>Cant afford a new Crewmember</P>";
			}
			if (rt.len(f, this.settlers) > 1) {
				this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;sellcrew=1'>Sell crew for Fuel and Food (+7FU,+7FO)</a></P>", [this]);
			} else {
				this.eventdat += "<P ALIGN=Right>Cant afford to sell a Crewmember</P>";
			}
			this.eventdat += "<P ALIGN=Right>Spare Parts:</P>";
			if (this.fuel > 5) {
				this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;buyparts=1'>Buy Engine Parts (-5FU)</a></P>", [this]);
			} else {
				this.eventdat += "<P ALIGN=Right>Cant afford to buy Engine Parts</a>";
			}
			if (this.fuel > 5) {
				this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;buyparts=2'>Buy Hull Plates (-5FU)</a></P>", [this]);
			} else {
				this.eventdat += "<P ALIGN=Right>Cant afford to buy Hull Plates</a>";
			}
			if (this.fuel > 5) {
				this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;buyparts=3'>Buy Spare Electronics (-5FU)</a></P>", [this]);
			} else {
				this.eventdat += "<P ALIGN=Right>Cant afford to buy Spare Electronics</a>";
			}
			if (this.fuel > 5) {
				this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;trade=1'>Trade Fuel for Food (-5FU,+5FO)</a></P>", [this]);
			} else {
				this.eventdat += "<P ALIGN=Right>Cant afford to Trade Fuel for Food</P";
			}
			if (this.food > 5) {
				this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;trade=2'>Trade Food for Fuel (+5FU,-5FO)</a></P>", [this]);
			} else {
				this.eventdat += "<P ALIGN=Right>Cant afford to Trade Food for Fuel</P";
			}
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;raid_spaceport=1'>!! Raid Spaceport !!</a></P>", [this]);
			this.eventdat += fmt("<P ALIGN=Right><a href='byond://?src=＃;leave_spaceport=1'>Depart Spaceport</a></P>", [this]);
		}
	}
	return f.dot;
});

// arcade.dm:997
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/add_crewmember", function add_crewmember(f: Frame, specific: Value) {
	specific ??= "";
	let newcrew: Value = "";
	if (specific) {
		newcrew = specific;
	} else if (prob(50)) {
		newcrew = pick(GLOB.first_names_male);
	} else {
		newcrew = pick(GLOB.first_names_female);
	}
	if (newcrew) {
		this.settlers += newcrew;
		this.alive++;
	}
	return newcrew;
});

// arcade.dm:1013
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/remove_crewmember", function remove_crewmember(f: Frame, specific: Value, dont_remove: Value) {
	specific ??= "";
	dont_remove ??= "";
	let safe2remove: Value = this.settlers;
	let removed: Value = "";
	if (dont_remove) {
		safe2remove -= dont_remove;
	}
	if (specific && specific != dont_remove) {
		safe2remove = list(specific);
	} else {
		removed = pick(safe2remove);
	}
	if (removed) {
		if (this.lings_aboard && prob(40 * this.lings_aboard)) {
			this.lings_aboard = max(0, --this.lings_aboard);
		}
		this.settlers -= removed;
		this.alive--;
	}
	return removed;
});

// arcade.dm:1032
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/win", function* win(f: Frame) {
	this.gameStatus = ORION_STATUS_START;
	yield* this.say("Congratulations, you made it to Orion!");
	if (this.emagged) {
		yield* new_(T("/obj/item/weapon/orion_ship"), this.loc);
		message_admins(`${key_name_admin(f.usr)} made it to Orion on an emagged machine and got an explosive toy ship.`);
		log_game(`${key_name(f.usr)} made it to Orion on an emagged machine and got an explosive toy ship.`);
	} else {
		yield* this.prizevend();
	}
	this.emagged = 0;
	this.name = "The Orion Trail";
	this.desc = "Learn how our ancestors got to Orion, and have fun in the process!";
	return f.dot;
}, true);

// arcade.dm:1044
rt.def("/obj/machinery/computer/arcade/orion_trail/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	to_chat(user, `<span class='notice'>You override the cheat code menu and skip to Cheat #${rand(1, 50)}: Realism Mode.</span>`);
	this.name = "The Orion Trail: Realism Edition";
	this.desc = "Learn how our ancestors got to Orion, and try not to die in the process!";
	this.newgame();
	this.emagged = 1;
	return f.dot;
});

rt.type(4891, "/mob/living/simple_animal/hostile/syndicate/ranged/orion", "/mob/living/simple_animal/hostile/syndicate/ranged", {
	name: "Spaceport Security",
	desc: "The Premier security forces for all spaceports found along the Orion Trail.",
	faction: null,
	loot: null,
	del_on_death: 1,
});

// arcade.dm:1054
rt.def("/mob/living/simple_animal/hostile/syndicate/ranged/orion/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("orion");

	this.loot = list();
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

// arcade.dm:1067
rt.def("/obj/item/weapon/orion_ship/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!(get_dist(user, this) <= 1)) {
		return f.dot;
	}
	if (!this.active) {
		to_chat(user, "<span class='notice'>There's a little switch on the bottom. It's flipped down.</span>");
	} else {
		to_chat(user, "<span class='notice'>There's a little switch on the bottom. It's flipped up.</span>");
	}
	return f.dot;
}, false);

// arcade.dm:1079
rt.def("/obj/item/weapon/orion_ship/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.active) {
		return f.dot;
	}
	message_admins(`${key_name_admin(f.usr)} primed an explosive Orion ship for detonation.`);
	log_game(`${key_name(f.usr)} primed an explosive Orion ship for detonation.`);
	to_chat(user, `<span class='warning'>You flip the switch on the underside of ${this}.</span>`);
	this.active = 1;
	this.visible_message(`<span class='notice'>${this} softly beeps and whirs to life!</span>`);
	playsound(this.loc, rt.rsc("sound/machines/defib_SaftyOn.ogg"), 25, 1);
	yield* this.say(`This is ship ID #${rand(1, 1000)} to Orion Port Authority. We're coming in for landing, over.`);
	yield* sleep(20);
	this.visible_message(`<span class='warning'>${this} begins to vibrate...</span>`);
	yield* this.say("Uh, Port? Having some issues with our reactor, could you check it out? Over.");
	yield* sleep(30);
	yield* this.say("Oh, God! Code Eight! CODE EIGHT! IT'S GONNA BL-");
	playsound(this.loc, rt.rsc("sound/machines/buzz-sigh.ogg"), 25, 1);
	yield* sleep(3.6);
	this.visible_message(`<span class='userdanger'>${this} explodes!</span>`);
	yield* explosion(this.loc, 2, 4, 8, { flame_range: 16 });
	yield* qdel(this);
	return f.dot;
}, true);
