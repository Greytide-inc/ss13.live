// From code/modules/events/holiday/xmas.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(329, "/datum/round_event/treevenge", "/datum/round_event", {});

// /datum/round_event/treevenge/proc/start  (code/modules/events/holiday/xmas.dm:9)  may sleep
rt.def("/datum/round_event/treevenge/proc/start", function* start(f: Frame) {
	let xmas: Value = null, evil_tree: Value = null;
	let $e: any;
	f.vars = () => [xmas, evil_tree, $e];
	xmas = null;
	rt.forList(f, 0, rt.world(), T("/obj/structure/flora/tree/pine"));
	while (($e = rt.next(f, 0)) !== undefined) {
		xmas = $e;
		rt.setFv(f, "icon_state", (evil_tree = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/tree"), [rt.fv(f, "loc", live(xmas))]))), rt.fv(f, "icon_state", live(xmas)));
		rt.setFv(f, "icon_living", live(evil_tree), rt.fv(f, "icon_state", live(evil_tree)));
		rt.setFv(f, "icon_dead", live(evil_tree), rt.fv(f, "icon_state", live(evil_tree)));
		rt.setFv(f, "icon_gib", live(evil_tree), rt.fv(f, "icon_state", live(evil_tree)));
		yield* g.call(f, P("/proc/qdel"), null, [live(xmas)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(330, "/datum/round_event/presents", "/datum/round_event", {});

// /datum/round_event/presents/proc/start  (code/modules/events/holiday/xmas.dm:27)  may sleep
rt.def("/datum/round_event/presents/proc/start", function* start(f: Frame) {
	let xmas: Value = null, _T: Value = null, i: Value = null, Ian: Value = null, Monitor: Value = null;
	let $e: any;
	f.vars = () => [xmas, _T, i, Ian, Monitor, $e];
	xmas = null;
	rt.forList(f, 0, rt.world(), T("/obj/structure/flora/tree/pine"));
	while (($e = rt.next(f, 0)) !== undefined) {
		xmas = $e;
		if (!isEqual(rt.fv(f, "z", live(xmas)), 2)) {
			continue;
		}
		_T = null;
		rt.forList(f, 1, (yield* g.call(f, P("/proc/orange"), null, [1, live(xmas)])), T("/turf/open/floor"));
		while (($e = rt.next(f, 1)) !== undefined) {
			_T = $e;
			i = null;
			i = 1;
			while (rt.le(live(i), (yield* g.call(f, P("/proc/rand"), null, [1, 5])))) {
				yield* g.new_(f, T("/obj/item/weapon/a_gift"), [live(_T)]);
				i = rt.inc(live(i), 1);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	Ian = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/simple_animal/pet/dog/corgi/Ian"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Ian = $e;
		yield* g.callName(f, live(Ian), "place_on_head", [(yield* g.new_(f, T("/obj/item/clothing/head/helmet/space/santahat"), [live(Ian)]))]);
	}
	rt.endFor(f, 0);
	Monitor = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/security/telescreen/entertainment"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Monitor = $e;
		rt.setFv(f, "icon_state", live(Monitor), "entertainment_xmas");
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/round_event/presents/proc/announce  (code/modules/events/holiday/xmas.dm:39)  may sleep
rt.def("/datum/round_event/presents/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, ["Ho Ho Ho, Merry Xmas!", "Unknown Transmission"]);
	return f.dot;
}, true);

rt.type(7482, "/obj/item/weapon/toy/xmas_cracker", "/obj/item/weapon/toy", {
	cracked: 0,
	name: "xmas cracker",
	icon: rt.rsc("icons/obj/christmas.dmi"),
	icon_state: "cracker",
	desc: "Directions for use: Requires two people, one to pull each end.",
});

// /obj/item/weapon/toy/xmas_cracker/proc/attack  (code/modules/events/holiday/xmas.dm:50)  may sleep
rt.def("/obj/item/weapon/toy/xmas_cracker/proc/attack", function* attack(f: Frame) {
	let Joke: Value = null, other_half: Value = null;
	f.vars = () => [Joke, other_half];
	if ((((!truthy(rt.sv(f, "cracked")) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) && isEqual(rt.fv(f, "stat", live(f.args[0])), 0)) && !truthy((yield* g.callName(f, live(f.args[0]), "get_active_held_item", []))))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("＀ and ＀ pop ＇！! *pop*", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You pull ＇！ with ＀! *pop*</span>", [live(f.src), live(f.args[0])]), "<span class='italics'>You hear a pop.</span>"]);
		rt.setFv(f, "name", (Joke = (yield* g.new_(f, T("/obj/item/weapon/paper"), [rt.fv(f, "loc", live(f.args[1]))]))), fmt("＀ joke", [rt.op(f, "PickUnweighted", [3], ["awful", "terrible", "unfunny"])]));
		rt.setFv(f, "info", live(Joke), rt.op(f, "PickUnweighted", [10], ["What did one snowman say to the other?\n\n<i>'Is it me or can you smell carrots?'</i>", "Why couldn't the snowman get laid?\n\n<i>He was frigid!</i>", "Where are santa's helpers educated?\n\n<i>Nowhere, they're ELF-taught.</i>", "What happened to the man who stole advent calanders?\n\n<i>He got 25 days.</i>", "What does Santa get when he gets stuck in a chimney?\n\n<i>Claus-trophobia.</i>", "Where do you find chili beans?\n\n<i>The north pole.</i>", "What do you get from eating tree decorations?\n\n<i>Tinsilitis!</i>", "What do snowmen wear on their heads?\n\n<i>Ice caps!</i>", "Why is Christmas just like life on ss13?\n\n<i>You do all the work and the fat guy gets all the credit.</i>", "Why doesn�t Santa have any children?\n\n<i>Because he only comes down the chimney.</i>"]));
		yield* g.new_(f, T("/obj/item/clothing/head/festive"), [rt.fv(f, "loc", live(f.args[0]))]);
		yield* g.callName(f, live(f.args[1]), "update_icons", []);
		rt.setSv(f, "cracked", 1);
		rt.setSv(f, "icon_state", "cracker1");
		rt.setFv(f, "cracked", (other_half = (yield* g.new_(f, T("/obj/item/weapon/toy/xmas_cracker"), [live(f.args[0])]))), 1);
		rt.setFv(f, "icon_state", live(other_half), "cracker2");
		yield* g.callName(f, live(f.args[0]), "put_in_active_hand", [live(other_half)]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), rt.rsc("sound/effects/snap.ogg"), 50, 1]);
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["target", "user"] });

rt.type(8198, "/obj/item/clothing/head/festive", "/obj/item/clothing/head", {
	name: "festive paper hat",
	icon_state: "xmashat",
	desc: "A crappy paper hat that you are REQUIRED to wear.",
	flags_inv: 0,
	armor: null,
});

// /obj/item/clothing/head/festive/proc/<init>  (code/modules/events/holiday/xmas.dm:81)
rt.def("/obj/item/clothing/head/festive/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(11523, "/obj/effect/landmark/xmastree", "/obj/effect/landmark", {
	tree: rt.typePath("/obj/structure/flora/tree/pine/xmas"),
	name: "christmas tree spawner",
});

// /obj/effect/landmark/xmastree/proc/Initialize  (code/modules/events/holiday/xmas.dm:88)  may sleep
rt.def("/obj/effect/landmark/xmastree/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.isIn(f, "Festive Season", rt.fv(f, "holidays", rt.gl("SSevents"))) ? 1 : 0))) {
		yield* g.new_(f, rt.sv(f, "tree"), [rt.getStep(f, live(f.src), 0)]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(331, "/datum/round_event/santa", "/datum/round_event", {
	santa: null,
});

// /datum/round_event/santa/proc/announce  (code/modules/events/holiday/xmas.dm:109)  may sleep
rt.def("/datum/round_event/santa/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, ["Santa is coming to town!", "Unknown Transmission"]);
	return f.dot;
}, true);

// /datum/round_event/santa/proc/start  (code/modules/events/holiday/xmas.dm:112)
rt.def("/datum/round_event/santa/proc/start", function start(f: Frame) {
	let M: Value = null, response: Value = null, santacard: Value = null, J: Value = null, bag: Value = null, gift: Value = null, santa_objective: Value = null, telespell: Value = null;
	let $e: any;
	f.vars = () => [M, response, santacard, J, bag, gift, santa_objective, telespell, $e];
	M = null;
	rt.forList(f, 0, rt.gl("dead_mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.spawnTail(f, 0, "/datum/round_event/santa/proc/start: spawn at modules/events/holiday/xmas.dm:113", M, response, santacard, J, bag, gift, santa_objective, telespell);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// a spawn(0) body of /datum/round_event/santa/proc/start, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/round_event/santa/proc/start: spawn at modules/events/holiday/xmas.dm:113", function* (f: Frame, M: Value, response: Value, santacard: Value, J: Value, bag: Value, gift: Value, santa_objective: Value, telespell: Value) {
	f.vars = () => [M, response, santacard, J, bag, gift, santa_objective, telespell];
	if (((((isEqual((response = (yield* g.call(f, P("/proc/alert"), null, [live(M), "Santa is coming to town! Do you want to be santa?", "Ho ho ho!", "Yes", "No"]))), "Yes") && truthy(live(M))) && truthy(rt.fv(f, "client", live(M)))) && isEqual(rt.fv(f, "stat", live(M)), 2)) && !truthy(rt.sv(f, "santa")))) {
		rt.setSv(f, "santa", (yield* g.new_(f, T("/mob/living/carbon/human"), [rt.op(f, "PickUnweighted", [1], [rt.gl("blobstart")])])));
		rt.setFv(f, "key", rt.sv(f, "santa"), rt.fv(f, "key", live(M)));
		yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
		rt.setFv(f, "real_name", rt.sv(f, "santa"), "Santa Claus");
		rt.setFv(f, "name", rt.sv(f, "santa"), "Santa Claus");
		rt.setFv(f, "name", rt.fv(f, "mind", rt.sv(f, "santa")), "Santa Claus");
		rt.setFv(f, "assigned_role", rt.fv(f, "mind", rt.sv(f, "santa")), "Santa");
		rt.setFv(f, "special_role", rt.fv(f, "mind", rt.sv(f, "santa")), "Santa");
		rt.setFv(f, "hair_style", rt.sv(f, "santa"), "Long Hair");
		rt.setFv(f, "facial_hair_style", rt.sv(f, "santa"), "Full Beard");
		rt.setFv(f, "hair_color", rt.sv(f, "santa"), "FFF");
		rt.setFv(f, "facial_hair_color", rt.sv(f, "santa"), "FFF");
		yield* g.callName(f, rt.sv(f, "santa"), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/color/red"), [])), 14]);
		yield* g.callName(f, rt.sv(f, "santa"), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/space/santa"), [])), 13]);
		yield* g.callName(f, rt.sv(f, "santa"), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/santa"), [])), 11]);
		yield* g.callName(f, rt.sv(f, "santa"), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/mask/breath"), [])), 2]);
		yield* g.callName(f, rt.sv(f, "santa"), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/gloves/color/red"), [])), 9]);
		yield* g.callName(f, rt.sv(f, "santa"), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/red"), [])), 12]);
		yield* g.callName(f, rt.sv(f, "santa"), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen/double"), [])), 5]);
		yield* g.callName(f, rt.sv(f, "santa"), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset/heads/captain"), [])), 7]);
		yield* g.callName(f, rt.sv(f, "santa"), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/storage/backpack/santabag"), [])), 1]);
		yield* g.callName(f, rt.sv(f, "santa"), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/flashlight"), [])), 16]);
		yield* g.callName(f, (santacard = (yield* g.new_(f, T("/obj/item/weapon/card/id/gold"), [rt.sv(f, "santa")]))), "update_label", ["Santa Claus", "Santa"]);
		J = (yield* g.new_(f, T("/datum/job/captain"), []));
		rt.setFv(f, "access", live(santacard), (yield* g.callName(f, live(J), "get_access", [])));
		yield* g.callName(f, rt.sv(f, "santa"), "equip_to_slot_or_del", [live(santacard), 6]);
		yield* g.callName(f, rt.sv(f, "santa"), "update_icons", []);
		bag = rt.fv(f, "back", rt.sv(f, "santa"));
		gift = (yield* g.new_(f, T("/obj/item/weapon/a_gift"), [rt.sv(f, "santa")]));
		while (truthy((yield* g.callName(f, live(bag), "can_be_inserted", [live(gift), 1])))) {
			yield* g.callName(f, live(bag), "handle_item_insertion", [live(gift), 1]);
			gift = (yield* g.new_(f, T("/obj/item/weapon/a_gift"), [rt.sv(f, "santa")]));
		}
		rt.setFv(f, "explanation_text", (santa_objective = (yield* g.new_(f, T("/datum/objective"), []))), "Bring joy and presents to the station!");
		rt.setFv(f, "completed", live(santa_objective), 1);
		rt.setFv(f, "owner", live(santa_objective), rt.fv(f, "mind", rt.sv(f, "santa")));
		rt.modField(f, rt.fv(f, "mind", rt.sv(f, "santa")), "objectives", live(santa_objective), add);
		yield* g.callName(f, rt.fv(f, "mind", rt.sv(f, "santa")), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/conjure/presents"), []))]);
		rt.setFv(f, "clothes_req", (telespell = (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/area_teleport/teleport"), [rt.sv(f, "santa")]))), 0);
		yield* g.callName(f, rt.fv(f, "mind", rt.sv(f, "santa")), "AddSpell", [live(telespell)]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "santa"), "<span class='boldannounce'>You are Santa! Your objective is to bring joy to the people on this station. You can conjure more presents using a spell, and there are several presents in your bag.</span>"]);
	}
	return null;
});
