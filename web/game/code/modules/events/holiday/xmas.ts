// Based on /tg/station's code/modules/events/holiday/xmas.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(329, "/datum/round_event/treevenge", "/datum/round_event", {});

// xmas.dm:9
rt.def("/datum/round_event/treevenge/proc/start", function* start(f: Frame) {
	let xmas: Value = null, evil_tree: Value = null;
	for (xmas of each(rt.world(), T("/obj/structure/flora/tree/pine"))) {
		(evil_tree = (yield* new_(T("/mob/living/simple_animal/hostile/tree"), xmas.loc))).icon_state = xmas.icon_state;
		evil_tree.icon_living = evil_tree.icon_state;
		evil_tree.icon_dead = evil_tree.icon_state;
		evil_tree.icon_gib = evil_tree.icon_state;
		yield* qdel(xmas);
	}
	return f.dot;
}, true);

rt.type(330, "/datum/round_event/presents", "/datum/round_event", {});

// xmas.dm:27
rt.def("/datum/round_event/presents/proc/start", function* start(f: Frame) {
	let xmas: Value = null, _T: Value = null, i: Value = null, Ian: Value = null, Monitor: Value = null;
	for (xmas of each(rt.world(), T("/obj/structure/flora/tree/pine"))) {
		if (xmas.z != ZLEVEL_STATION) {
			continue;
		}
		_T = null;
		for (_T of each(orange(1, xmas), T("/turf/open/floor"))) {
			i = 1;
			while (i <= rand(1, 5)) {
				yield* new_(T("/obj/item/weapon/a_gift"), _T);
				i++;
			}
		}
	}
	for (Ian of each(GLOB.mob_list, T("/mob/living/simple_animal/pet/dog/corgi/Ian"))) {
		yield* Ian.place_on_head((yield* new_(T("/obj/item/clothing/head/helmet/space/santahat"), Ian)));
	}
	for (Monitor of each(GLOB.machines, T("/obj/machinery/computer/security/telescreen/entertainment"))) {
		Monitor.icon_state = "entertainment_xmas";
	}
	return f.dot;
}, true);

// xmas.dm:39
rt.def("/datum/round_event/presents/proc/announce", function* announce(f: Frame) {
	yield* priority_announce("Ho Ho Ho, Merry Xmas!", "Unknown Transmission");
	return f.dot;
}, true);

rt.type(7482, "/obj/item/weapon/toy/xmas_cracker", "/obj/item/weapon/toy", {
	cracked: 0,
	name: "xmas cracker",
	icon: rt.rsc("icons/obj/christmas.dmi"),
	icon_state: "cracker",
	desc: "Directions for use: Requires two people, one to pull each end.",
});

// xmas.dm:50
rt.def("/obj/item/weapon/toy/xmas_cracker/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let Joke: Value = null, other_half: Value = null;
	if (!this.cracked && rt.istype(target, T("/mob/living/carbon/human")) && target.stat == 0 && !target.get_active_held_item()) {
		target.visible_message(fmt("＀ and ＀ pop ＇！! *pop*", [user, target, this]), fmt("<span class='notice'>You pull ＇！ with ＀! *pop*</span>", [this, target]), "<span class='italics'>You hear a pop.</span>");
		(Joke = (yield* new_(T("/obj/item/weapon/paper"), user.loc))).name = `${pick("awful", "terrible", "unfunny")} joke`;
		Joke.info = pick("What did one snowman say to the other?\n\n<i>'Is it me or can you smell carrots?'</i>", "Why couldn't the snowman get laid?\n\n<i>He was frigid!</i>", "Where are santa's helpers educated?\n\n<i>Nowhere, they're ELF-taught.</i>", "What happened to the man who stole advent calanders?\n\n<i>He got 25 days.</i>", "What does Santa get when he gets stuck in a chimney?\n\n<i>Claus-trophobia.</i>", "Where do you find chili beans?\n\n<i>The north pole.</i>", "What do you get from eating tree decorations?\n\n<i>Tinsilitis!</i>", "What do snowmen wear on their heads?\n\n<i>Ice caps!</i>", "Why is Christmas just like life on ss13?\n\n<i>You do all the work and the fat guy gets all the credit.</i>", "Why doesn�t Santa have any children?\n\n<i>Because he only comes down the chimney.</i>");
		yield* new_(T("/obj/item/clothing/head/festive"), target.loc);
		yield* user.update_icons();
		this.cracked = 1;
		this.icon_state = "cracker1";
		(other_half = (yield* new_(T("/obj/item/weapon/toy/xmas_cracker"), target))).cracked = 1;
		other_half.icon_state = "cracker2";
		yield* target.put_in_active_hand(other_half);
		playsound(user, rt.rsc("sound/effects/snap.ogg"), 50, 1);
		return 1;
	}
	return (yield* parent_proc());
}, true);

rt.type(8198, "/obj/item/clothing/head/festive", "/obj/item/clothing/head", {
	name: "festive paper hat",
	icon_state: "xmashat",
	desc: "A crappy paper hat that you are REQUIRED to wear.",
	flags_inv: 0,
	armor: null,
});

// xmas.dm:81
rt.def("/obj/item/clothing/head/festive/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]);
	return f.dot;
});

rt.type(11523, "/obj/effect/landmark/xmastree", "/obj/effect/landmark", {
	tree: rt.typePath("/obj/structure/flora/tree/pine/xmas"),
	name: "christmas tree spawner",
});

// xmas.dm:88
rt.def("/obj/effect/landmark/xmastree/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	if (rt.isIn(f, "Festive Season", GLOB.SSevents.holidays)) {
		yield* new_(this.tree, rt.getStep(f, this, 0));
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(331, "/datum/round_event/santa", "/datum/round_event", {
	santa: null,
});

// xmas.dm:109
rt.def("/datum/round_event/santa/proc/announce", function* announce(f: Frame) {
	yield* priority_announce("Santa is coming to town!", "Unknown Transmission");
	return f.dot;
}, true);

// xmas.dm:112
rt.def("/datum/round_event/santa/proc/start", function start(f: Frame) {
	let M: Value = null, response: Value = null, santacard: Value = null, J: Value = null, bag: Value = null, gift: Value = null, santa_objective: Value = null, telespell: Value = null;
	for (M of each(GLOB.dead_mob_list, T("/mob"))) {
		rt.spawnTail(f, 0, "/datum/round_event/santa/proc/start: spawn at modules/events/holiday/xmas.dm:113", M, response, santacard, J, bag, gift, santa_objective, telespell);
	}
	return f.dot;
});

// a spawn(0) body of /datum/round_event/santa/proc/start, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/round_event/santa/proc/start: spawn at modules/events/holiday/xmas.dm:113", function* (f: Frame, M: Value, response: Value, santacard: Value, J: Value, bag: Value, gift: Value, santa_objective: Value, telespell: Value) {
	if ((response = (yield* alert(M, "Santa is coming to town! Do you want to be santa?", "Ho ho ho!", "Yes", "No"))) == "Yes" && M && M.client && M.stat == 2 && !this.santa) {
		this.santa = (yield* new_(T("/mob/living/carbon/human"), pick(GLOB.blobstart)));
		this.santa.key = M.key;
		yield* qdel(M);
		this.santa.real_name = "Santa Claus";
		this.santa.name = "Santa Claus";
		this.santa.mind.name = "Santa Claus";
		this.santa.mind.assigned_role = "Santa";
		this.santa.mind.special_role = "Santa";
		this.santa.hair_style = "Long Hair";
		this.santa.facial_hair_style = "Full Beard";
		this.santa.hair_color = "FFF";
		this.santa.facial_hair_color = "FFF";
		yield* this.santa.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/color/red"))), 14);
		yield* this.santa.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/suit/space/santa"))), 13);
		yield* this.santa.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/santa"))), 11);
		yield* this.santa.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/mask/breath"))), 2);
		yield* this.santa.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/gloves/color/red"))), 9);
		yield* this.santa.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/sneakers/red"))), 12);
		yield* this.santa.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen/double"))), 5);
		yield* this.santa.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset/heads/captain"))), 7);
		yield* this.santa.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/storage/backpack/santabag"))), 1);
		yield* this.santa.equip_to_slot_or_del((yield* new_(T("/obj/item/device/flashlight"))), 16);
		(santacard = (yield* new_(T("/obj/item/weapon/card/id/gold"), this.santa))).update_label("Santa Claus", "Santa");
		J = (yield* new_(T("/datum/job/captain")));
		santacard.access = J.get_access();
		yield* this.santa.equip_to_slot_or_del(santacard, 6);
		yield* this.santa.update_icons();
		bag = this.santa.back;
		gift = (yield* new_(T("/obj/item/weapon/a_gift"), this.santa));
		while (bag.can_be_inserted(gift, 1)) {
			yield* bag.handle_item_insertion(gift, 1);
			gift = (yield* new_(T("/obj/item/weapon/a_gift"), this.santa));
		}
		(santa_objective = (yield* new_(T("/datum/objective")))).explanation_text = "Bring joy and presents to the station!";
		santa_objective.completed = 1;
		santa_objective.owner = this.santa.mind;
		this.santa.mind.objectives += santa_objective;
		yield* this.santa.mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/conjure/presents"))));
		(telespell = (yield* new_(T("/obj/effect/proc_holder/spell/targeted/area_teleport/teleport"), this.santa))).clothes_req = 0;
		yield* this.santa.mind.AddSpell(telespell);
		to_chat(this.santa, "<span class='boldannounce'>You are Santa! Your objective is to bring joy to the people on this station. You can conjure more presents using a spell, and there are several presents in your bag.</span>");
	}
	return null;
});
