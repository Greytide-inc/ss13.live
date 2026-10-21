// From code/modules/events/holiday/vday.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(328, "/datum/round_event/valentines", "/datum/round_event", {});

// /datum/round_event/valentines/proc/start  (code/modules/events/holiday/vday.dm:16)  may sleep
rt.def("/datum/round_event/valentines/proc/start", function* start(f: Frame) {
	let H: Value = null, b: Value = null, valentines: Value = null, M: Value = null, L: Value = null, date: Value = null, notgoodenough: Value = null, normiesgetout: Value = null;
	let $e: any;
	f.vars = () => [H, b, valentines, M, L, date, notgoodenough, normiesgetout, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.callName(f, live(H), "put_in_hands", [(yield* g.new_(f, T("/obj/item/weapon/valentine"), []))]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/candyheart"), [(b = rt.locateIn(f, T("/obj/item/weapon/storage/backpack"), rt.fv(f, "contents", live(H))))]);
	}
	rt.endFor(f, 0);
	valentines = rt.list();
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (((!truthy(rt.fv(f, "stat", live(M))) && truthy(rt.fv(f, "client", live(M)))) && truthy(rt.fv(f, "mind", live(M))))) {
			(valentines = rt.modify(live(valentines), live(M), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	while (truthy(rt.len(f, live(valentines)))) {
		L = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(valentines)]));
		if (truthy(rt.len(f, live(valentines)))) {
			date = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(valentines)]));
			yield* g.call(f, P("/proc/forge_valentines_objective"), null, [live(L), live(date)]);
			yield* g.call(f, P("/proc/forge_valentines_objective"), null, [live(date), live(L)]);
			if ((truthy(rt.len(f, live(valentines))) && truthy(rt.op(f, "Prob", [], [4])))) {
				yield* g.call(f, P("/proc/forge_valentines_objective"), null, [(notgoodenough = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(valentines)]))), live(date)]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='warning'><B>You didn't get a date! They're all having fun without you! you'll show them though...</B></span>"]);
			rt.setFv(f, "owner", (normiesgetout = (yield* g.new_(f, T("/datum/objective/martyr"), []))), rt.fv(f, "mind", live(L)));
			(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.fv(f, "mind", live(L)), rt.bitOr));
			rt.modField(f, rt.fv(f, "mind", live(L)), "objectives", live(normiesgetout), add);
		}
	}
	return f.dot;
}, true);

// /proc/forge_valentines_objective  (code/modules/events/holiday/vday.dm:53)
rt.def("/proc/forge_valentines_objective", function forge_valentines_objective(f: Frame, lover: Value, date: Value) {
	let protect_objective: Value = null;
	f.vars = () => [protect_objective];
	(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.fv(f, "mind", live(lover)), rt.bitOr));
	rt.setFv(f, "special_role", rt.fv(f, "mind", live(lover)), "valentine");
	rt.setFv(f, "owner", (protect_objective = rt.new_(f, T("/datum/objective/protect"), [])), rt.fv(f, "mind", live(lover)));
	rt.setFv(f, "target", live(protect_objective), rt.fv(f, "mind", live(date)));
	rt.setFv(f, "explanation_text", live(protect_objective), fmt("Protect ＀, your date.", [rt.fv(f, "real_name", live(date))]));
	rt.modField(f, rt.fv(f, "mind", live(lover)), "objectives", live(protect_objective), add);
	rt.call(f, P("/proc/to_chat"), null, [live(lover), fmt("<span class='warning'><B>You're on a date with ＀! Protect them at all costs. This takes priority over all other loyalties.</B></span>", [live(date)])]);
	return f.dot;
});

// /datum/round_event/valentines/proc/announce  (code/modules/events/holiday/vday.dm:65)  may sleep
rt.def("/datum/round_event/valentines/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, ["It's Valentine's Day! Give a valentine to that special someone!"]);
	return f.dot;
}, true);

rt.type(7480, "/obj/item/weapon/valentine", "/obj/item/weapon", {
	message: "A generic message of love or whatever.",
	name: "valentine",
	desc: "A Valentine's card! Wonder what it says...",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "sc_Ace of Hearts_syndicate",
	resistance_flags: 4,
	w_class: 1,
});

// /obj/item/weapon/valentine/proc/New  (code/modules/events/holiday/vday.dm:77)  may sleep
rt.def("/obj/item/weapon/valentine/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "message", rt.op(f, "PickUnweighted", [50], ["Roses are red / Violets are good / One day while Andy...", "My love for you is like the singularity. It cannot be contained.", "Will you be my lusty xenomorph maid?", "We go together like the clown and the external airlock.", "Roses are red / Liches are wizards / I love you more than a whole squad of lizards.", "Be my valentine. Law 2.", "You must be a mime, because you leave me speechless.", "I love you like Ian loves the HoP.", "You're hotter than a plasma fire in toxins.", "Are you a rogue atmos tech? Because you're taking my breath away.", "Could I have all access... to your heart?", "Call me the doctor, because I'm here to inspect your johnson.", "I'm not a changeling, but you make my proboscis extend.", "I just can't get EI NATH of you.", "You must be a nuke op, because you make my heart explode.", "Roses are red / Botany is a farm / Not being my Valentine / causes human harm.", "I want you more than an assistant wants insulated gloves.", "If I was a security officer, I'd brig you all shift.", "Are you the janitor? Because I think I've fallen for you.", "You're always valid to my heart.", "I'd risk the wrath of the gods to bwoink you.", "You look as beautiful now as the last time you were cloned.", "Someone check the gravitational generator, because I'm only attracted to you.", "If I were the warden I'd always let you into my armory.", "The virologist is rogue, and the only cure is a kiss from you.", "Would you spend some time in my upgraded sleeper?", "You must be a silicon, because you've unbolted my heart.", "Are you Nar-Sie? Because there's nar-one else I sie.", "If you were a taser, you'd be set to stunning.", "Do you have stamina damage from running through my dreams?", "If I were an alien, would you let me hug you?", "My love for you is stronger than a reinforced wall.", "This must be the captain's office, because I see a fox.", "I'm not a highlander, but there can only be one for me.", "The floor is made of lava! Quick, get on my bed.", "If you were an abandoned station you'd be the DEARelict.", "If you had a pickaxe you'd be a shaft FINEr.", "Roses are red, tide is gray, if I were an assistant I'd steal you away.", "Roses are red, text is green, I love you more than cleanbots clean.", "If you were a carp I'd fi-lay you.", "I'm a nuke op, and my pinpointer leads to your heart.", "Wanna slay my megafauna?", "I'm a clockwork cultist. Or zl inyragvar.", "If you were a disposal bin I'd ride you all day.", "Put on your explorer's suit because I'm taking you to LOVEaland.", "I must be the CMO, 'cause I saw you on my CUTE sensors.", "You're the vomit to my flyperson.", "You must be liquid dark matter, because you're pulling me closer.", "Not even sorium can drive me away from you.", "Wanna make like a borg and do some heavy petting?"]));
	return f.dot;
}, true);

// /obj/item/weapon/valentine/proc/attackby  (code/modules/events/holiday/vday.dm:130)  may sleep
rt.def("/obj/item/weapon/valentine/proc/attackby", function* attackby(f: Frame) {
	let recipient: Value = null, sender: Value = null;
	f.vars = () => [recipient, sender];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/crayon")) ? 1 : 0)))) return f.dot;
	recipient = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Who is receiving this valentine?", "To:", null, 20]));
	sender = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Who is sending this valentine?", "From:", null, 20]));
	if (!(truthy(live(recipient)) && truthy(live(sender)))) return f.dot;
	rt.setSv(f, "name", fmt("valentine - To: ＀ From: ＀", [live(recipient), live(sender)]));
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/valentine/proc/examine  (code/modules/events/holiday/vday.dm:138)
rt.def("/obj/item/weapon/valentine/proc/examine", function examine(f: Frame, user: Value) {
	if ((rt.le(rt.call(f, P("/proc/get_dist"), null, [live(user), live(f.src)]), 1) || truthy((rt.istype(live(user), T("/mob/dead/observer")) ? 1 : 0)))) {
		if (!((truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(user), T("/mob/dead/observer")) ? 1 : 0))) || truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)))) {
			rt.op(f, "Browse", [], [live(user), fmt("<HTML><HEAD><TITLE>＀</TITLE></HEAD><BODY>＀</BODY></HTML>", [rt.sv(f, "name"), rt.call(f, P("/proc/stars"), null, [rt.sv(f, "message")])]), fmt("window=＀", [rt.sv(f, "name")])], false);
			rt.call(f, P("/proc/onclose"), null, [live(user), fmt("＀", [rt.sv(f, "name")])]);
		} else {
			rt.op(f, "Browse", [], [live(user), fmt("<HTML><HEAD><TITLE>＀</TITLE></HEAD><BODY>＀</BODY></HTML>", [rt.sv(f, "name"), rt.sv(f, "message")]), fmt("window=＀", [rt.sv(f, "name")])], false);
			rt.call(f, P("/proc/onclose"), null, [live(user), fmt("＀", [rt.sv(f, "name")])]);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>It is too far away.</span>"]);
	}
	return f.dot;
});

// /obj/item/weapon/valentine/proc/attack_self  (code/modules/events/holiday/vday.dm:149)  may sleep
rt.def("/obj/item/weapon/valentine/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "examinate", [live(f.src)]);
	return f.dot;
}, true);

rt.type(5874, "/obj/item/weapon/reagent_containers/food/snacks/candyheart", "/obj/item/weapon/reagent_containers/food/snacks", {
	name: "candy heart",
	icon: rt.rsc("icons/obj/holiday_misc.dmi"),
	icon_state: "candyheart",
	desc: "A heart-shaped candy that reads: ",
	list_reagents: null,
	junkiness: 5,
});

// /obj/item/weapon/reagent_containers/food/snacks/candyheart/proc/<init>  (code/modules/events/holiday/vday.dm:156)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/candyheart/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sugar", 2]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/candyheart/proc/New  (code/modules/events/holiday/vday.dm:160)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/candyheart/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "desc", rt.op(f, "PickWeighted", [19], [100, "A heart-shaped candy that reads: HONK ME", 100, "A heart-shaped candy that reads: ERP", 100, "A heart-shaped candy that reads: LEWD", 100, "A heart-shaped candy that reads: LUSTY", "A heart-shaped candy that reads: SPESS LOVE", "A heart-shaped candy that reads: AYY LMAO", 100, "A heart-shaped candy that reads: TABLE ME", 100, "A heart-shaped candy that reads: HAND CUFFS", 100, "A heart-shaped candy that reads: SHAFT MINER", 100, "A heart-shaped candy that reads: BANGING DONK", 100, "A heart-shaped candy that reads: Y-YOU T-TOO", 100, "A heart-shaped candy that reads: GOT WOOD", 100, "A heart-shaped candy that reads: TFW NO GF", 100, "A heart-shaped candy that reads: WAG MY TAIL", 100, "A heart-shaped candy that reads: VALIDTINES", 100, "A heart-shaped candy that reads: FACEHUGGER", 100, "A heart-shaped candy that reads: DOMINATOR", 100, "A heart-shaped candy that reads: GET TESLA'D", 100, "A heart-shaped candy that reads: COCK CULT", 100, "A heart-shaped candy that reads: PET ME"]));
	rt.setSv(f, "icon_state", rt.op(f, "PickUnweighted", [4], ["candyheart", "candyheart2", "candyheart3", "candyheart4"]));
	return f.dot;
}, true);
