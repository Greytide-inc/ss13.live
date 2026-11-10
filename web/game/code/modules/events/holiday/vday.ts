// Based on /tg/station's code/modules/events/holiday/vday.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(328, "/datum/round_event/valentines", "/datum/round_event", {});

// vday.dm:16
rt.def("/datum/round_event/valentines/proc/start", function* start(f: Frame) {
	let H: Value = null, b: Value = null, M: Value = null, L: Value = null, date: Value = null, notgoodenough: Value = null, normiesgetout: Value = null;
	yield* parent_proc();
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		yield* H.put_in_hands((yield* new_(T("/obj/item/weapon/valentine"))));
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/candyheart"), (b = rt.locateIn(f, T("/obj/item/weapon/storage/backpack"), H.contents)));
	}
	let valentines: Value = list();
	for (M of each(GLOB.player_list, T("/mob/living"))) {
		if (!M.stat && M.client && M.mind) {
			(valentines = rt.modify(valentines, M, rt.bitOr));
		}
	}
	while (rt.len(f, valentines)) {
		L = pick_n_take(valentines);
		if (rt.len(f, valentines)) {
			date = pick_n_take(valentines);
			forge_valentines_objective(L, date);
			forge_valentines_objective(date, L);
			if (rt.len(f, valentines) && prob(4)) {
				forge_valentines_objective((notgoodenough = pick_n_take(valentines)), date);
			}
		} else {
			to_chat(L, "<span class='warning'><B>You didn't get a date! They're all having fun without you! you'll show them though...</B></span>");
			(normiesgetout = (yield* new_(T("/datum/objective/martyr")))).owner = L.mind;
			(rt.modField(f, GLOB.SSticker.mode, "traitors", L.mind, rt.bitOr));
			L.mind.objectives += normiesgetout;
		}
	}
	return f.dot;
}, true);

// vday.dm:53
rt.def("/proc/forge_valentines_objective", function forge_valentines_objective(f: Frame, lover: Value, date: Value) {
	let protect_objective: Value = null;
	(rt.modField(f, GLOB.SSticker.mode, "traitors", lover.mind, rt.bitOr));
	lover.mind.special_role = "valentine";
	(protect_objective = new_(T("/datum/objective/protect"))).owner = lover.mind;
	protect_objective.target = date.mind;
	protect_objective.explanation_text = `Protect ${date.real_name}, your date.`;
	lover.mind.objectives += protect_objective;
	to_chat(lover, `<span class='warning'><B>You're on a date with ${date}! Protect them at all costs. This takes priority over all other loyalties.</B></span>`);
	return f.dot;
});

// vday.dm:65
rt.def("/datum/round_event/valentines/proc/announce", function* announce(f: Frame) {
	yield* priority_announce("It's Valentine's Day! Give a valentine to that special someone!");
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

// vday.dm:77
rt.def("/obj/item/weapon/valentine/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	rt.setSv(f, "message", pick("Roses are red / Violets are good / One day while Andy...", "My love for you is like the singularity. It cannot be contained.", "Will you be my lusty xenomorph maid?", "We go together like the clown and the external airlock.", "Roses are red / Liches are wizards / I love you more than a whole squad of lizards.", "Be my valentine. Law 2.", "You must be a mime, because you leave me speechless.", "I love you like Ian loves the HoP.", "You're hotter than a plasma fire in toxins.", "Are you a rogue atmos tech? Because you're taking my breath away.", "Could I have all access... to your heart?", "Call me the doctor, because I'm here to inspect your johnson.", "I'm not a changeling, but you make my proboscis extend.", "I just can't get EI NATH of you.", "You must be a nuke op, because you make my heart explode.", "Roses are red / Botany is a farm / Not being my Valentine / causes human harm.", "I want you more than an assistant wants insulated gloves.", "If I was a security officer, I'd brig you all shift.", "Are you the janitor? Because I think I've fallen for you.", "You're always valid to my heart.", "I'd risk the wrath of the gods to bwoink you.", "You look as beautiful now as the last time you were cloned.", "Someone check the gravitational generator, because I'm only attracted to you.", "If I were the warden I'd always let you into my armory.", "The virologist is rogue, and the only cure is a kiss from you.", "Would you spend some time in my upgraded sleeper?", "You must be a silicon, because you've unbolted my heart.", "Are you Nar-Sie? Because there's nar-one else I sie.", "If you were a taser, you'd be set to stunning.", "Do you have stamina damage from running through my dreams?", "If I were an alien, would you let me hug you?", "My love for you is stronger than a reinforced wall.", "This must be the captain's office, because I see a fox.", "I'm not a highlander, but there can only be one for me.", "The floor is made of lava! Quick, get on my bed.", "If you were an abandoned station you'd be the DEARelict.", "If you had a pickaxe you'd be a shaft FINEr.", "Roses are red, tide is gray, if I were an assistant I'd steal you away.", "Roses are red, text is green, I love you more than cleanbots clean.", "If you were a carp I'd fi-lay you.", "I'm a nuke op, and my pinpointer leads to your heart.", "Wanna slay my megafauna?", "I'm a clockwork cultist. Or zl inyragvar.", "If you were a disposal bin I'd ride you all day.", "Put on your explorer's suit because I'm taking you to LOVEaland.", "I must be the CMO, 'cause I saw you on my CUTE sensors.", "You're the vomit to my flyperson.", "You must be liquid dark matter, because you're pulling me closer.", "Not even sorium can drive me away from you.", "Wanna make like a borg and do some heavy petting?"));
	return f.dot;
}, true);

// vday.dm:130
rt.def("/obj/item/weapon/valentine/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* parent_proc();
	if (!(rt.istype(W, T("/obj/item/weapon/pen")) || rt.istype(W, T("/obj/item/toy/crayon")))) return f.dot;
	let recipient: Value = (yield* stripped_input(user, "Who is receiving this valentine?", "To:", null, 20));
	let sender: Value = (yield* stripped_input(user, "Who is sending this valentine?", "From:", null, 20));
	if (!(recipient && sender)) return f.dot;
	this.name = `valentine - To: ${recipient} From: ${sender}`;
	return f.dot;
}, true);

// vday.dm:138
rt.def("/obj/item/weapon/valentine/proc/examine", function examine(f: Frame, user: Value) {
	if (get_dist(user, this) <= 1 || rt.istype(user, T("/mob/dead/observer"))) {
		if (!(rt.istype(user, T("/mob/living/carbon/human")) || rt.istype(user, T("/mob/dead/observer")) || rt.istype(user, T("/mob/living/silicon")))) {
			rt.op(f, "Browse", [], [user, `<HTML><HEAD><TITLE>${this.name}</TITLE></HEAD><BODY>${stars(rt.sv(f, "message"))}</BODY></HTML>`, `window=${this.name}`], false);
			onclose(user, `${this.name}`);
		} else {
			rt.op(f, "Browse", [], [user, `<HTML><HEAD><TITLE>${this.name}</TITLE></HEAD><BODY>${rt.sv(f, "message")}</BODY></HTML>`, `window=${this.name}`], false);
			onclose(user, `${this.name}`);
		}
	} else {
		to_chat(user, "<span class='notice'>It is too far away.</span>");
	}
	return f.dot;
});

// vday.dm:149
rt.def("/obj/item/weapon/valentine/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* user.examinate(this);
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

// vday.dm:156
rt.def("/obj/item/weapon/reagent_containers/food/snacks/candyheart/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sugar", 2]);
	return f.dot;
});

// vday.dm:160
rt.def("/obj/item/weapon/reagent_containers/food/snacks/candyheart/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.desc = rt.op(f, "PickWeighted", [19], [100, "A heart-shaped candy that reads: HONK ME", 100, "A heart-shaped candy that reads: ERP", 100, "A heart-shaped candy that reads: LEWD", 100, "A heart-shaped candy that reads: LUSTY", "A heart-shaped candy that reads: SPESS LOVE", "A heart-shaped candy that reads: AYY LMAO", 100, "A heart-shaped candy that reads: TABLE ME", 100, "A heart-shaped candy that reads: HAND CUFFS", 100, "A heart-shaped candy that reads: SHAFT MINER", 100, "A heart-shaped candy that reads: BANGING DONK", 100, "A heart-shaped candy that reads: Y-YOU T-TOO", 100, "A heart-shaped candy that reads: GOT WOOD", 100, "A heart-shaped candy that reads: TFW NO GF", 100, "A heart-shaped candy that reads: WAG MY TAIL", 100, "A heart-shaped candy that reads: VALIDTINES", 100, "A heart-shaped candy that reads: FACEHUGGER", 100, "A heart-shaped candy that reads: DOMINATOR", 100, "A heart-shaped candy that reads: GET TESLA'D", 100, "A heart-shaped candy that reads: COCK CULT", 100, "A heart-shaped candy that reads: PET ME"]);
	this.icon_state = pick("candyheart", "candyheart2", "candyheart3", "candyheart4");
	return f.dot;
}, true);
