// Based on /tg/station's code/modules/mob/living/carbon/human/interactive.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, add } = rt;


rt.type(4813, "/mob/living/carbon/human/interactive", "/mob/living/carbon/human", {
	doing: 0,
	interest: 10,
	maxInterest: 10,
	timeout: 0,
	inactivity_period: 0,
	TARGET: null,
	LAST_TARGET: null,
	nearby: null,
	best_force: 0,
	retal: 0,
	retal_target: null,
	update_hands: 0,
	blacklistItems: null,
	maxStepsTick: 6,
	MYID: null,
	RPID: null,
	MYPDA: null,
	main_hand: null,
	other_hand: null,
	TRAITS: 0,
	Path_ID: null,
	myjob: null,
	myPath: null,
	robustness: 50,
	smartness: 50,
	attitude: 50,
	slyness: 50,
	graytide: 0,
	favoured_types: null,
	chattyness: 1,
	targetInterestShift: 5,
	functions: null,
	restrictedJob: 0,
	forceProcess: 0,
	lastProc: 0,
	walkdebug: 0,
	debugexamine: 0,
	showexaminetext: 1,
	knownStrings: null,
	isTraitor: 0,
	traitorTarget: null,
	traitorScale: 0,
	traitorType: 0,
	voice_saved: 0,
	name: "interactive station member",
	faction: null,
});

// interactive.dm:40
rt.def("/mob/living/carbon/human/interactive/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.nearby = list();

	this.blacklistItems = list();

	this.myPath = list();

	this.favoured_types = list();
	this.functions = list("nearbyscan", "combat", "shitcurity", "chatter");

	this.knownStrings = list();

	this.faction = list("synth");
	return f.dot;
});

// interactive.dm:90
rt.def("/mob/living/carbon/human/interactive/proc/loadVoice", function loadVoice(f: Frame) {
	let S: Value = null;
	this.knownStrings = rt.input(f, rt.R.index, null, [(S = new_(T("/savefile"), "data/npc_saves/snpc.sav")), "knownStrings"]);
	if (this.knownStrings !== null) return f.dot;
	this.knownStrings = list();
	return f.dot;
});

// interactive.dm:99
rt.def("/mob/living/carbon/human/interactive/proc/saveVoice", function saveVoice(f: Frame) {
	let S: Value = null;
	if (this.voice_saved) {
		return f.dot;
	}
	rt.op(f, "OutputReference", [rt.R.index], [(S = new_(T("/savefile"), "data/npc_saves/snpc.sav")), "knownStrings", this.knownStrings], false);
	return f.dot;
});

// interactive.dm:104
rt.def("/mob/living/carbon/human/interactive/proc/takeDelegate", function takeDelegate(f: Frame, from: Value, doReset: Value) {
	doReset ??= 1;
	this.eye_color = "red";
	if (from == this) {
		return 0;
	}
	this.TARGET = from.TARGET;
	this.LAST_TARGET = from.LAST_TARGET;
	this.retal = from.retal;
	this.retal_target = from.retal_target;
	this.doing = from.doing;
	this.timeout = 0;
	this.inactivity_period = 0;
	this.interest = this.maxInterest;
	this.update_icons();
	if (doReset) {
		from.TARGET = null;
		from.LAST_TARGET = null;
		from.retal = 0;
		from.retal_target = null;
		from.doing = 0;
	}
	return 1;
});

// interactive.dm:130
rt.def("/mob/living/carbon/human/interactive/proc/random", function* random(f: Frame) {
	this.age = rand(AGE_MIN, AGE_MAX);
	this.myjob = (yield* new_(T("/datum/job/assistant")));
	this.job = this.myjob.title;
	yield* this.myjob.equip(this);
	return f.dot;
}, true);

// interactive.dm:137
rt.def("/mob/living/carbon/human/interactive/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value, def_zone: Value) {
	f.dot = (yield* parent_proc());
	this.retal = 1;
	this.retal_target = user;
	return f.dot;
}, true);

// interactive.dm:142
rt.def("/mob/living/carbon/human/interactive/proc/bullet_act", function* bullet_act(f: Frame) {
	let potentialAssault: Value = null;
	if (potentialAssault = rt.locateIn(f, T("/mob/living"), view(2, f.args[0].starting))) {
		this.retal = 1;
		this.retal_target = potentialAssault;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["P", "def_zone"] });

// interactive.dm:153
rt.def("/client/proc/resetSNPC", function resetSNPC(f: Frame, A: Value) {
	let _T: Value = null;
	if (!this.holder) {
		return f.dot;
	}
	if (!A) return f.dot;
	if (!rt.istype(A, T("/mob/living/carbon/human/interactive"))) {
		return f.dot;
	}
	if (!(_T = A)) return f.dot;
	_T.timeout = 100;
	_T.retal = 0;
	_T.doing = 0;
	return f.dot;
}, false, { verb: { name: "Reset SNPC", category: "Debug", desc: "Reset the SNPC" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// interactive.dm:170
rt.def("/client/proc/customiseSNPC", function* customiseSNPC(f: Frame, A: Value) {
	let choice: Value = null, job: Value = null, j: Value = null, J: Value = null, W: Value = null, W_2: Value = null, validchoices: Value = null, M: Value = null, chosen: Value = null, toDoppel: Value = null, cType: Value = null, cjob: Value = null, W_3: Value = null, shouldDoppel: Value = null, validchoices_4: Value = null, M_5: Value = null, chosen_5: Value = null, toDoppel_6: Value = null, doTrait: Value = null, tType: Value = null, cType_6: Value = null, value: Value = null, doTele: Value = null;
	let $0: any, $e: any;
	if (!this.holder) {
		return f.dot;
	}
	if (!A) return f.dot;
	if (!rt.istype(A, T("/mob/living/carbon/human/interactive"))) {
		return f.dot;
	}
	let _T: Value = A;
	if (!(choice = (yield* g.op(f, "Prompt", [1], [null, null, null, "Customization Choices", list("Service NPC", "Security NPC", "Random", "Custom")])))) return f.dot;
	if (choice == "Service NPC" || choice == "Security NPC") {
		if (choice == "Service NPC") {
			$0 = pick("Bartender", "Cook", "Botanist", "Janitor");
		} else {
			$0 = pick("Warden", "Detective", "Security Officer");
		}
		job = $0;
		for (j of each(GLOB.SSjob.occupations)) {
			if ((J = j).title == job) {
				_T.myjob = J;
				_T.job = _T.myjob.title;
				W = null;
				for (W of each(_T, T("/obj/item"))) {
					yield* qdel(W);
				}
				yield* _T.myjob.equip(_T);
				yield* _T.doSetup();
				break;
			}
		}
	}
	if (choice == "Random") {
		_T.myjob = pick(GLOB.SSjob.occupations);
		_T.job = _T.myjob.title;
		for (W_2 of each(_T, T("/obj/item"))) {
			yield* qdel(W_2);
		}
		yield* _T.myjob.equip(_T);
		yield* _T.doSetup();
		if (prob(25)) {
			validchoices = list();
			for (M of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
				validchoices += M;
			}
			chosen = pick(validchoices);
			toDoppel = chosen.dna;
			_T.real_name = toDoppel.real_name;
			yield* toDoppel.transfer_identity(_T, { transfer_SE: 1 });
			yield* _T.updateappearance({ mutcolor_update: 1 });
			yield* _T.domutcheck();
		}
		if (prob(25)) {
			cType = pick(list(SNPC_BRUTE, SNPC_STEALTH, SNPC_MARTYR, SNPC_PSYCHO));
			yield* _T.makeTraitor(cType);
		}
		_T.loc = pick(get_area_turfs(_T.job2area(_T.myjob)));
	}
	if (choice != "Custom") return f.dot;
	if (cjob = (yield* g.op(f, "Prompt", [1], [null, null, null, "Choose Job", GLOB.SSjob.occupations]))) {
		_T.myjob = cjob;
		_T.job = _T.myjob.title;
		for (W_3 of each(_T, T("/obj/item"))) {
			yield* qdel(W_3);
		}
		yield* _T.myjob.equip(_T);
		yield* _T.doSetup();
	}
	if (shouldDoppel = (yield* g.op(f, "Prompt", [1], [null, null, null, "Do you want the SNPC to disguise themself as a crewmember?", list("Yes", "No")]))) {
		if (shouldDoppel == "Yes") {
			validchoices_4 = list();
			for (M_5 of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
				validchoices_4 += M_5;
			}
			if (chosen_5 = (yield* g.op(f, "Prompt", [1], [null, null, null, "Which crewmember?", validchoices_4]))) {
				toDoppel_6 = chosen_5.dna;
				_T.real_name = toDoppel_6.real_name;
				yield* toDoppel_6.transfer_identity(_T, { transfer_SE: 1 });
				yield* _T.updateappearance({ mutcolor_update: 1 });
				yield* _T.domutcheck();
			}
		}
	}
	if (doTrait = (yield* g.op(f, "Prompt", [1], [null, null, null, "Do you want the SNPC to be a traitor?", list("Yes", "No")]))) {
		if (doTrait == "Yes") {
			tType = rt.alist(f, ["Brute", 1, "Stealth", SNPC_STEALTH, "Martyr", SNPC_MARTYR, "Psycho", SNPC_PSYCHO]);
			if (cType_6 = (yield* g.op(f, "Prompt", [1], [null, null, null, "Choose the traitor personality.", tType]))) {
				value = rt.index(tType, cType_6);
				yield* _T.makeTraitor(value);
			}
		}
	}
	if (!(doTele = (yield* g.op(f, "Prompt", [1], [null, null, null, "Place the SNPC in their department?", list("Yes", "No")])))) return f.dot;
	if (doTele != "Yes") return f.dot;
	_T.loc = pick(get_area_turfs(_T.job2area(_T.myjob)));
	return f.dot;
}, true, { verb: { name: "Customize SNPC", category: "Debug", desc: "Customise the SNPC" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// interactive.dm:252
rt.def("/mob/living/carbon/human/interactive/proc/doSetup", function* doSetup(f: Frame) {
	let X: Value = null, BP: Value = null;
	let $e: any;
	this.Path_ID = (yield* new_(T("/obj/item/weapon/card/id"), this));
	let C: Value = (yield* new_(T("/datum/job/captain")));
	this.Path_ID.access = C.get_access();
	this.MYID = (yield* new_(T("/obj/item/weapon/card/id"), this));
	this.MYID.name = `${this.real_name}'s ID Card (${this.myjob.title})`;
	this.MYID.assignment = `${this.myjob.title}`;
	this.MYID.registered_name = this.real_name;
	this.MYID.access = this.Path_ID.access;
	this.RPID = (yield* new_(T("/obj/item/weapon/card/id"), this));
	this.RPID.name = `${this.real_name}'s ID Card (${this.myjob.title})`;
	this.RPID.assignment = `${this.myjob.title}`;
	this.RPID.registered_name = this.real_name;
	this.RPID.access = this.myjob.get_access();
	yield* this.equip_to_slot_or_del(this.MYID, slot_wear_id);
	this.MYPDA = (yield* new_(T("/obj/item/device/pda"), this));
	this.MYPDA.owner = this.real_name;
	this.MYPDA.ownjob = "Crew";
	this.MYPDA.name = `PDA-${this.real_name} (${this.myjob.title})`;
	yield* this.equip_to_slot_or_del(this.MYPDA, slot_belt);
	this.zone_selected = "chest";
	for (X of each(this.bodyparts)) {
		BP = X;
		if (prob(33.75)) {
			yield* BP.change_bodypart_status(BODYPART_ROBOTIC, 0, 1);
		}
	}
	yield* this.update_icons();
	this.update_damage_overlays();
	this.functions = list("nearbyscan", "combat", "shitcurity", "chatter");
	if (this.myjob.title === "Assistant") {
		this.favoured_types = list(T("/obj/item/clothing"), T("/obj/item/weapon"));
	} else if (this.myjob.title === "Captain" || this.myjob.title === "Head of Personnel") {
		this.favoured_types = list(T("/obj/item/clothing"), T("/obj/item/weapon/stamp/captain"), T("/obj/item/weapon/disk/nuclear"));
	} else if (this.myjob.title === "Cook") {
		this.favoured_types = list(T("/obj/item/weapon/reagent_containers/food"), T("/obj/item/weapon/kitchen"));
		this.functions += "souschef";
		this.restrictedJob = 1;
	} else if (this.myjob.title === "Bartender") {
		this.favoured_types = list(T("/obj/item/weapon/reagent_containers/food"), T("/obj/item/weapon/kitchen"));
		this.functions += "bartend";
		this.restrictedJob = 1;
	} else if (this.myjob.title === "Station Engineer" || this.myjob.title === "Chief Engineer" || this.myjob.title === "Atmospheric Technician") {
		this.favoured_types = list(T("/obj/item/stack"), T("/obj/item/weapon"), T("/obj/item/clothing"));
	} else if (this.myjob.title === "Chief Medical Officer" || this.myjob.title === "Medical Doctor" || this.myjob.title === "Chemist" || this.myjob.title === "Virologist" || this.myjob.title === "Geneticist") {
		this.favoured_types = list(T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/storage/firstaid"), T("/obj/item/stack/medical"), T("/obj/item/weapon/reagent_containers/syringe"));
		this.functions += "healpeople";
	} else if (this.myjob.title === "Research Director" || this.myjob.title === "Scientist" || this.myjob.title === "Roboticist") {
		this.favoured_types = list(T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/stack"), T("/obj/item/weapon/reagent_containers"));
	} else if (this.myjob.title === "Head of Security" || this.myjob.title === "Warden" || this.myjob.title === "Security Officer" || this.myjob.title === "Detective") {
		this.favoured_types = list(T("/obj/item/clothing"), T("/obj/item/weapon"), T("/obj/item/weapon/restraints"));
	} else if (this.myjob.title === "Janitor") {
		this.favoured_types = list(T("/obj/item/weapon/mop"), T("/obj/item/weapon/reagent_containers/glass/bucket"), T("/obj/item/weapon/reagent_containers/spray/cleaner"), T("/obj/effect/decal/cleanable"));
		this.functions += "dojanitor";
	} else if (this.myjob.title === "Clown") {
		this.favoured_types = list(T("/obj/item/weapon/soap"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), T("/obj/item/weapon/grown/bananapeel"));
		this.functions += "clowning";
	} else if (this.myjob.title === "Mime") {
		this.functions -= "chatter";
	} else if (this.myjob.title === "Botanist") {
		this.favoured_types = list(T("/obj/machinery/hydroponics"), T("/obj/item/weapon/reagent_containers"), T("/obj/item/weapon"));
		this.functions += "botany";
		this.restrictedJob = 1;
	} else {
		this.favoured_types = list(T("/obj/item/clothing"));
	}
	if (rt.bitAnd(this.TRAITS, TRAIT_ROBUST)) {
		this.robustness = 75;
	} else if (rt.bitAnd(this.TRAITS, TRAIT_UNROBUST)) {
		this.robustness = 25;
	}
	if (rt.bitAnd(this.TRAITS, TRAIT_SMART)) {
		this.smartness = 75;
	} else if (rt.bitAnd(this.TRAITS, TRAIT_DUMB)) {
		(rt.modSrcVar(f, "disabilities", 256, rt.bitOr));
		this.smartness = 25;
	}
	if (rt.bitAnd(this.TRAITS, TRAIT_MEAN)) {
		this.attitude = 75;
	} else if (rt.bitAnd(this.TRAITS, TRAIT_FRIENDLY)) {
		this.attitude = 1;
	}
	if (!rt.bitAnd(this.TRAITS, TRAIT_THIEVING)) return f.dot;
	this.slyness = 75;
	return f.dot;
}, true);

// interactive.dm:346
rt.def("/mob/living/carbon/human/interactive/proc/makeTraitor", function* makeTraitor(f: Frame, inPers: Value) {
	let A: Value = null, S: Value = null, targetType: Value = null;
	this.isTraitor = 1;
	this.traitorScale = this.slyness + this.smartness + rand(-10, 10);
	this.traitorType = inPers;
	if (this.traitorType === SNPC_BRUTE) {
		this.traitorTarget = pick(GLOB.mob_list);
	} else if (this.traitorType === SNPC_STEALTH) {
		A = pick(typesof(T("/datum/objective_item/steal")) - T("/datum/objective_item/steal"));
		this.traitorTarget = rt.locateIn(f, (S = (yield* new_(A))).targetitem, rt.world());
	} else if (this.traitorType === SNPC_MARTYR) {
		this.traitorTarget = rt.locateIn(f, (targetType = pick(T("/obj/machinery/gravity_generator/main/station"), T("/obj/machinery/power/smes/engineering"), T("/obj/machinery/telecomms/hub"))), GLOB.machines);
	} else if (this.traitorType === SNPC_PSYCHO) {
		this.traitorTarget = null;
	}
	this.functions += "traitor";
	this.faction -= "neutral";
	this.faction += "hostile";
	return f.dot;
}, true);

// interactive.dm:367
rt.def("/mob/living/carbon/human/interactive/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.set_species(T("/datum/species/synth"));
	yield* this.random();
	yield* this.doSetup();
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSnpcpool.processing += this;
	}
	this.loadVoice();
	this.robustness += rand(-10, 10);
	this.smartness += rand(-10, 10);
	this.attitude += rand(-10, 10);
	this.slyness += rand(-10, 10);
	return f.dot;
}, true);

// interactive.dm:386
rt.def("/mob/living/carbon/human/interactive/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSnpcpool.stop_processing(this);
	return (yield* parent_proc());
}, true);

// interactive.dm:390
rt.def("/mob/living/carbon/human/interactive/proc/retalTarget", function* retalTarget(f: Frame, target: Value) {
	let M: Value = target;
	if (!target) return f.dot;
	if (!(this.health > 0)) return f.dot;
	if (M.a_intent == "help") {
		yield* this.chatter();
	}
	if (M.a_intent != "harm") return f.dot;
	this.retal = 1;
	this.retal_target = target;
	return f.dot;
}, true);

// interactive.dm:402
rt.def("/mob/living/carbon/human/interactive/proc/hitby", function* hitby(f: Frame, AM: Value, skipcatch: Value, hitpush: Value, blocked: Value) {
	let C: Value = null;
	yield* parent_proc(AM, skipcatch, hitpush, blocked);
	if (!(C = rt.locateIn(f, T("/mob/living/carbon"), view(MIN_RANGE_FIND, this)))) return f.dot;
	yield* this.retalTarget(C);
	return f.dot;
}, true);

// interactive.dm:408
rt.def("/mob/living/carbon/human/interactive/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	yield* parent_proc(M);
	yield* this.retalTarget(M);
	return f.dot;
}, true);

// interactive.dm:412
rt.def("/mob/living/carbon/human/interactive/proc/show_inv", function* show_inv(f: Frame, user: Value) {
	yield* parent_proc(user);
	yield* this.retalTarget(user);
	return f.dot;
}, true);

// interactive.dm:416
rt.def("/mob/living/carbon/human/interactive/proc/can_inject", function* can_inject(f: Frame, user: Value, error_msg: Value, target_zone: Value, penetrate_thick: Value) {
	penetrate_thick ??= 0;
	yield* parent_proc(user, error_msg, target_zone, penetrate_thick);
	yield* this.retalTarget(user);
	return f.dot;
}, true);

// interactive.dm:422
rt.def("/mob/living/carbon/human/interactive/proc/doing2string", function doing2string(f: Frame, doin: Value) {
	let toReturn: Value = "";
	if (!doin) {
		toReturn = "not doing anything";
	}
	if (rt.bitAnd(doin, INTERACTING)) {
		toReturn += "interacting with something, ";
	}
	if (rt.bitAnd(doin, FIGHTING)) {
		toReturn += "engaging in combat, ";
	}
	if (rt.bitAnd(doin, TRAVEL)) {
		toReturn += "and going somewhere";
	}
	return toReturn;
});

// interactive.dm:434
rt.def("/mob/living/carbon/human/interactive/proc/interest2string", function interest2string(f: Frame, inter: Value) {
	let toReturn: Value = "Flatlined";
	if (inter >= 0 && inter <= 25) {
		toReturn = "Very Bored";
	}
	if (inter >= 26 && inter <= 50) {
		toReturn = "Bored";
	}
	if (inter >= 51 && inter <= 75) {
		toReturn = "Content";
	}
	if (inter >= 76) {
		toReturn = "Excited";
	}
	return toReturn;
});

// interactive.dm:447
rt.def("/mob/living/carbon/human/interactive/proc/IsDeadOrIncap", function IsDeadOrIncap(f: Frame, checkDead: Value) {
	checkDead ??= 1;
	if (!this.canmove) {
		return 1;
	}
	if (this.health <= 0 && checkDead) {
		return 1;
	}
	if (this.restrained()) {
		return 1;
	}
	if (this.IsUnconscious()) {
		return 1;
	}
	if (this.IsStun()) {
		return 1;
	}
	if (this.stat) {
		return 1;
	}
	if (this.inactivity_period > 0) {
		return 1;
	}
	return 0;
});

// interactive.dm:465
rt.def("/mob/living/carbon/human/interactive/proc/enforce_hands", function enforce_hands(f: Frame) {
	if (this.main_hand) {
		if (this.main_hand.loc != this) {
			this.main_hand = null;
		}
	}
	if (this.other_hand) {
		if (this.other_hand.loc != this) {
			this.other_hand = null;
		}
	}
	let L: Value = this.get_item_for_held_index(1);
	let R: Value = this.get_item_for_held_index(2);
	if (this.active_hand_index == 1) {
		if (!L) {
			this.main_hand = null;
			if (R) {
				this.swap_hands();
			}
		}
	} else {
		if (R) return f.dot;
		this.main_hand = null;
		if (!L) return f.dot;
		this.swap_hands();
	}
	return f.dot;
});

// interactive.dm:486
rt.def("/mob/living/carbon/human/interactive/proc/swap_hands", function swap_hands(f: Frame) {
	let oindex: Value = this.active_hand_index;
	if (this.active_hand_index == 1) {
		this.active_hand_index = 2;
	} else {
		this.active_hand_index = 1;
	}
	this.main_hand = this.get_active_held_item();
	this.other_hand = this.get_item_for_held_index(oindex);
	this.update_hands = 1;
	return f.dot;
});

// interactive.dm:496
rt.def("/mob/living/carbon/human/interactive/proc/take_to_slot", function* take_to_slot(f: Frame, G: Value, hands: Value) {
	hands ??= 0;
	let slots: Value = rt.alist(f, ["left pocket", slot_l_store, "right pocket", slot_r_store, "left hand", slot_hands, "right hand", slot_hands]);
	if (hands) {
		slots = rt.alist(f, ["left hand", slot_hands, "right hand", slot_hands]);
	}
	G.loc = this;
	if (G.force && G.force > this.best_force) {
		this.best_force = G.force;
	}
	yield* this.equip_in_one_of_slots(G, slots);
	this.update_hands = 1;
	return f.dot;
}, true);

// interactive.dm:506
rt.def("/mob/living/carbon/human/interactive/proc/insert_into_backpack", function* insert_into_backpack(f: Frame) {
	let slots: Value = rt.alist(f, ["left pocket", slot_l_store, "right pocket", slot_r_store, "left hand", slot_hands, "right hand", slot_hands]);
	let I: Value = this.get_item_by_slot(pick(slots));
	let BP: Value = this.get_item_by_slot(slot_back);
	if (this.back && BP && I) {
		if (BP.can_be_inserted(I, 0)) {
			yield* BP.handle_item_insertion(I, 0);
		}
	} else {
		yield* this.dropItemToGround(I, 1);
	}
	this.update_hands = 1;
	return f.dot;
}, true);

// interactive.dm:517
rt.def("/mob/living/carbon/human/interactive/proc/targetRange", function targetRange(f: Frame, towhere: Value) {
	return get_dist(rt.getStep(f, towhere, 0), rt.getStep(f, this, 0));
});

// interactive.dm:520
rt.def("/mob/living/carbon/human/interactive/proc/InteractiveProcess", function InteractiveProcess(f: Frame) {
	if (GLOB.SSticker.current_state == GAME_STATE_FINISHED) {
		this.saveVoice();
	}
	this.doProcess();
	return f.dot;
});

// interactive.dm:525
rt.def("/mob/living/carbon/human/interactive/proc/death", function* death(f: Frame) {
	this.saveVoice();
	yield* parent_proc();
	return f.dot;
}, true);

// interactive.dm:529
rt.def("/mob/living/carbon/human/interactive/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	if (speaker != this) {
		(rt.modSrcVar(f, "knownStrings", html_decode(raw_message), rt.bitOr));
	}
	yield* parent_proc();
	return f.dot;
}, true);

// interactive.dm:537
rt.def("/mob/living/carbon/human/interactive/proc/doProcess", function* doProcess(f: Frame) {
	let dir: Value = null, _T: Value = null, D: Value = null, AL: Value = null, l_hand: Value = null, r_hand: Value = null, Proc: Value = null, D_0: Value = null, W: Value = null, STR: Value = null, W_1: Value = null, choice: Value = null;
	let $e: any;
	if (this.interest < 0 || this.inactivity_period < 0) {
		if (this.interest < 0) {
			this.interest = 0;
		}
		if (this.inactivity_period < 0) {
			this.inactivity_period = 0;
		}
	}
	if (this.interest > this.maxInterest) {
		this.interest = this.maxInterest;
	}
	for (dir of each(GLOB.alldirs)) {
		if (_T = rt.getStep(f, this, dir)) {
			D = null;
			for (D of each(_T.contents, T("/obj/machinery/door"))) {
				if (!rt.istype(D, T("/obj/machinery/door/poddoor")) && D.density) {
					if (rt.istype(D, T("/obj/machinery/door/airlock"))) {
						if (!(AL = D).CanAStarPass(this.RPID)) {
							this.inactivity_period = 20;
							AL.panel_open = 1;
							yield* AL.update_icon();
							yield* AL.shock(this, (100 - this.smartness) / 2);
							yield* sleep(5);
							if (!AL || AL.gc_destroyed) {
								return f.dot;
							}
							AL.unbolt();
							if (!AL.wires.is_cut("Bolts")) {
								yield* AL.wires.cut("Bolts");
							}
							if (!AL.wires.is_cut("Main Power 1")) {
								yield* AL.wires.cut("Main Power 1");
							}
							if (!AL.wires.is_cut("Main Power 2")) {
								yield* AL.wires.cut("Main Power 2");
							}
							yield* sleep(5);
							if (!AL || AL.gc_destroyed) {
								return f.dot;
							}
							AL.panel_open = 0;
							yield* AL.update_icon();
							yield* D.open(2);
						} else {
							yield* D.open();
						}
					} else {
						yield* D.open();
					}
				}
			}
		}
	}
	if (this.update_hands) {
		l_hand = this.get_item_for_held_index(1);
		r_hand = this.get_item_for_held_index(2);
		if (l_hand || r_hand) {
			if (l_hand) {
				this.active_hand_index = 1;
				this.main_hand = l_hand;
				if (r_hand) {
					this.other_hand = r_hand;
				}
			} else if (r_hand) {
				this.active_hand_index = 2;
				this.main_hand = r_hand;
				if (l_hand) {
					this.other_hand = l_hand;
				}
			}
			yield* this.update_icons();
		}
		this.update_hands = 0;
	}
	if (this.pulledby) {
		if (this.Adjacent(this.pulledby)) {
			this.a_intent = "disarm";
			yield* this.pulledby.attack_hand(this);
			this.inactivity_period = 10;
		}
	}
	if (this.buckled) {
		yield* this.resist();
		this.inactivity_period = 10;
	}
	for (Proc of each(this.functions)) {
		if (!this.IsDeadOrIncap()) {
			yield* ImmediateInvokeAsync(this, Proc);
		}
	}
	if (this.TARGET) {
		if (rt.isIn(f, this.TARGET, this.blacklistItems)) {
			this.TARGET = null;
		}
	}
	if (this.TARGET && this.Adjacent(this.TARGET)) {
		(rt.modSrcVar(f, "doing", INTERACTING, rt.bitOr));
		if (rt.istype(this.TARGET, T("/obj/machinery/door"))) {
			if ((D_0 = this.TARGET).check_access(this.MYID) && !rt.istype(D_0, T("/obj/machinery/door/poddoor"))) {
				this.inactivity_period = 10;
				yield* D_0.open();
				yield* this.tryWalk((_T = rt.getStep(f, rt.getStep(f, D_0.loc, this.dir), this.dir)));
			}
		}
		if (rt.isIn(f, (!this.TARGET ? 1 : 0), this.blacklistItems)) {
			yield* this.insert_into_backpack();
			if (rt.istype(this.TARGET, T("/obj/item"))) {
				if (rt.istype(this.TARGET, T("/obj/item/weapon"))) {
					if ((W = this.TARGET).force >= this.best_force || prob(67.5)) {
						if (!this.get_item_for_held_index(1) || !this.get_item_for_held_index(2)) {
							yield* this.put_in_hands(W);
						} else {
							yield* this.insert_into_backpack();
						}
					}
				} else if (!this.get_item_for_held_index(1) || !this.get_item_for_held_index(2)) {
					yield* this.put_in_hands(this.TARGET);
				} else {
					yield* this.insert_into_backpack();
				}
			}
			if (rt.istype(this.TARGET, T("/obj/item/clothing"))) {
				yield* this.drop_item();
				yield* this.dressup(this.TARGET);
				this.update_hands = 1;
				if (rt.isIn(f, (rt.isIn(f, this.MYPDA, (this.loc || this.MYID)) ? 1 : 0), this.loc)) {
					if (rt.isIn(f, this.MYPDA, this.loc)) {
						yield* this.equip_to_appropriate_slot(this.MYPDA);
					}
					if (rt.isIn(f, this.MYID, this.loc)) {
						yield* this.equip_to_appropriate_slot(this.MYID);
					}
				}
			}
		}
		if (rt.istype(this.TARGET, T("/obj/structure"))) {
			STR = this.TARGET;
			if (this.main_hand) {
				W_1 = this.main_hand;
				yield* STR.attackby(W_1, this);
			} else {
				yield* STR.attack_hand(this);
			}
		}
		this.interest += this.targetInterestShift;
		this.doing = rt.bitAnd(this.doing, 16777213);
		this.timeout = 0;
		this.TARGET = null;
	} else if (this.TARGET) {
		yield* this.tryWalk(this.TARGET);
		this.timeout++;
	}
	if (this.doing == 0) {
		this.interest--;
	} else {
		this.interest++;
	}
	if (this.inactivity_period > 0) {
		this.inactivity_period--;
	}
	if (this.interest <= 0 || this.timeout >= 10) {
		this.TARGET = null;
		this.doing = 0;
		this.timeout = 0;
		this.myPath = list();
	}
	if (!this.doing && !this.IsDeadOrIncap() && !this.TARGET) {
		(rt.modSrcVar(f, "doing", TRAVEL, rt.bitOr));
		if (!this.isTraitor || !this.traitorTarget) {
			const subject = (choice = rand(1, 50));
			if (rt.inRange(subject, 1, 30)) {
				this.TARGET = rt.locateIn(f, T("/obj/item"), this.favouredObjIn(oview(MIN_RANGE_FIND, this)));
			} else if (rt.inRange(subject, 31, 40)) {
				this.TARGET = safepick(get_area_turfs(this.job2area(this.myjob)));
			} else if (rt.inRange(subject, 41, 45)) {
				this.TARGET = pick(this.target_filter(this.favouredObjIn(urange(MAX_RANGE_FIND, this, 1))));
			} else if (rt.inRange(subject, 46, 50)) {
				this.TARGET = pick(this.target_filter(oview(MIN_RANGE_FIND, this)));
			}
		} else if (this.isTraitor && this.traitorTarget) {
			this.TARGET = this.traitorTarget;
		}
		yield* this.tryWalk(this.TARGET);
	}
	this.LAST_TARGET = this.TARGET;
	return f.dot;
}, true, { waitfor: false });

// interactive.dm:713
rt.def("/mob/living/carbon/human/interactive/proc/dressup", function* dressup(f: Frame, C: Value) {
	let I: Value = null;
	this.inactivity_period = 12;
	yield* sleep(5);
	if (!(!(!C || C.gc_destroyed) && !(!this || this.gc_destroyed))) return f.dot;
	yield* this.take_to_slot(C, 1);
	if (yield* this.equip_to_appropriate_slot(C)) return f.dot;
	yield* this.dropItemToGround((I = this.get_item_by_slot(C)));
	yield* sleep(5);
	if (!(!(!this || this.gc_destroyed) && !(!C || C.gc_destroyed))) return f.dot;
	yield* this.equip_to_appropriate_slot(C);
	return f.dot;
}, true, { waitfor: false });

// interactive.dm:724
rt.def("/mob/living/carbon/human/interactive/proc/favouredObjIn", function favouredObjIn(f: Frame, inList: Value) {
	let i: Value = null, path: Value = null;
	let outList: Value = list();
	for (i of each(inList)) {
		path = null;
		for (path of each(this.favoured_types)) {
			if (ispath(i, path)) {
				outList += i;
			}
		}
	}
	if (rt.len(f, outList) <= 0) {
		outList = inList;
	}
	return outList;
});

// interactive.dm:734
rt.def("/mob/living/carbon/human/interactive/proc/tryWalk", function* tryWalk(f: Frame, inTarget: Value, override: Value) {
	override ??= 0;
	if (this.restrictedJob && !override) {
		if (!rt.isIn(f, rt.getStep(f, inTarget, 0), get_area_turfs(this.job2area(this.myjob)))) {
			this.TARGET = null;
			return f.dot;
		}
	}
	if (!this.IsDeadOrIncap()) {
		if (!(yield* this.walk2derpless(inTarget))) {
			this.timeout++;
		}
	} else {
		this.timeout++;
	}
	return f.dot;
}, true);

// interactive.dm:773
rt.def("/mob/living/carbon/human/interactive/proc/walk2derpless", function* walk2derpless(f: Frame, target: Value) {
	let spark_system: Value = null, i: Value = null;
	if (!target) {
		return 0;
	}
	if (this.walkdebug) {
		yield* (spark_system = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(5, 0, target);
		yield* spark_system.attach(target);
		yield* spark_system.start();
	}
	if (rt.len(f, this.myPath) <= 0) {
		this.myPath = (yield* get_path_to(this, rt.getStep(f, target, 0), P("/turf/proc/Distance"), 33, 250, 1, { id: this.Path_ID }));
	}
	if (this.myPath) {
		if (rt.len(f, this.myPath) > 0) {
			this.doing = rt.bitAnd(this.doing, 16777211);
			i = 0;
			while (i < this.maxStepsTick) {
				if (!this.IsDeadOrIncap()) {
					if (rt.len(f, this.myPath) >= 1) {
						walk_to(this, rt.index(this.myPath, 1), 0, 5);
						this.myPath -= rt.index(this.myPath, 1);
					}
				}
				i++;
				yield* sleep(-1);
			}
			return 1;
		}
	}
	return 0;
}, true);

// interactive.dm:798
rt.def("/mob/living/carbon/human/interactive/proc/job2area", function job2area(f: Frame, target: Value) {
	let _T: Value = null;
	if ((_T = target).title == "Assistant") {
		return T("/area/hallway/primary");
	}
	if (_T.title == "Captain" || _T.title == "Head of Personnel") {
		return T("/area/bridge");
	}
	if (_T.title == "Bartender") {
		return T("/area/crew_quarters/bar");
	}
	if (_T.title == "Cook") {
		return T("/area/crew_quarters/kitchen");
	}
	if (_T.title == "Station Engineer" || _T.title == "Chief Engineer" || _T.title == "Atmospheric Technician") {
		return T("/area/engine");
	}
	if (_T.title == "Chief Medical Officer" || _T.title == "Medical Doctor" || _T.title == "Chemist" || _T.title == "Virologist" || _T.title == "Geneticist") {
		return T("/area/medical");
	}
	if (_T.title == "Research Director" || _T.title == "Scientist" || _T.title == "Roboticist") {
		return T("/area/science");
	}
	if (_T.title == "Head of Security" || _T.title == "Warden" || _T.title == "Security Officer" || _T.title == "Detective") {
		return T("/area/security");
	}
	if (_T.title == "Botanist") {
		return T("/area/hydroponics");
	}
	return pick(T("/area/hallway"), T("/area/crew_quarters/locker"));
});

// interactive.dm:821
rt.def("/mob/living/carbon/human/interactive/proc/target_filter", function target_filter(f: Frame, target: Value) {
	let A: Value = null;
	let filtered_targets: Value = list(T("/area"), T("/turf"), T("/obj/machinery/door"), T("/atom/movable/light"), T("/obj/structure/cable"), T("/obj/machinery/atmospherics"));
	let L: Value = target;
	for (A of each(target, T("/atom"))) {
		if (is_type_in_list(A, filtered_targets)) {
			L -= A;
		}
	}
	return L;
});

// interactive.dm:829
rt.def("/mob/living/carbon/human/interactive/proc/shouldModulePass", function shouldModulePass(f: Frame) {
	if (rt.bitAnd(this.doing, FIGHTING)) {
		return 1;
	}
	if (this.retal) {
		return 1;
	}
	return 0;
});

// interactive.dm:837
rt.def("/mob/living/carbon/human/interactive/proc/chatter", function* chatter(f: Frame, obj: Value) {
	let what: Value = null, toSay: Value = null, i: Value = null;
	let verbs_use: Value = pick(strings("npc_chatter.json", "verbs_use"));
	let verbs_touch: Value = pick(strings("npc_chatter.json", "verbs_touch"));
	let verbs_move: Value = pick(strings("npc_chatter.json", "verbs_move"));
	let nouns_insult: Value = pick(strings("npc_chatter.json", "nouns_insult"));
	let nouns_generic: Value = pick(strings("npc_chatter.json", "nouns_generic"));
	let nouns_objects: Value = pick(strings("npc_chatter.json", "nouns_objects"));
	let nouns_body: Value = pick(strings("npc_chatter.json", "nouns_body"));
	let adjective_insult: Value = pick(strings("npc_chatter.json", "adjective_insult"));
	let adjective_objects: Value = pick(strings("npc_chatter.json", "adjective_objects"));
	let adjective_generic: Value = pick(strings("npc_chatter.json", "adjective_generic"));
	let curse_words: Value = pick(strings("npc_chatter.json", "curse_words"));
	let chatmsg: Value = "";
	if (prob(10)) {
		chatmsg = ";";
	}
	if (prob(this.chattyness) || rt.len(f, this.knownStrings) < 10) {
		if (rt.bitAnd(this.doing, INTERACTING)) {
			if (prob(this.chattyness)) {
				chatmsg += pick(`This ${nouns_objects} is a little ${adjective_objects}.`, `Well ${verbs_use} my ${nouns_body}, this ${nouns_insult} is pretty ${adjective_insult}.`, `${capitalize(curse_words)}, what am I meant to do with this ${adjective_insult} ${nouns_objects}.`);
			}
		} else if (rt.bitAnd(this.doing, TRAVEL)) {
			if (prob(this.chattyness)) {
				chatmsg += pick(`Oh ${curse_words}, ${verbs_move}!`, `Time to get my ${adjective_generic} ${adjective_insult} ${nouns_body} elsewhere.`, `I wonder if there is anything to ${verbs_use} and ${verbs_touch} somewhere else..`);
			}
		} else if (rt.bitAnd(this.doing, FIGHTING)) {
			if (prob(this.chattyness)) {
				chatmsg += pick(`I'm going to ${verbs_use} you, you ${adjective_insult} ${nouns_insult}!`, `Rend and ${verbs_touch}, rend and ${verbs_use}!`, `You ${nouns_insult}, I'm going to ${verbs_use} you right in the ${nouns_body}. JUST YOU WAIT!`);
			}
		}
		if (prob(this.chattyness / 2)) {
			chatmsg = ";";
			const subject = (what = pick(1, 2, 3, 4, 5));
			if (subject === 1) {
				chatmsg += `Well ${curse_words}, this is a ${adjective_generic} situation.`;
			} else if (subject === 2) {
				chatmsg += `Oh ${curse_words}, that ${nouns_insult} was one hell of an ${adjective_insult} ${nouns_body}.`;
			} else if (subject === 3) {
				chatmsg += `I want to ${verbs_use} that ${nouns_insult} when I find them.`;
			} else if (subject === 4) {
				chatmsg += `${pick("Innocent", "Guilty", "Traitorous", "Honk")} until proven ${adjective_generic}!`;
			} else if (subject === 5) {
				toSay = "";
				i = 0;
				while (i < 5) {
					toSay += `${(curse_words = pick(strings("npc_chatter.json", "curse_words")))} `;
					i++;
				}
				chatmsg += `Hey ${nouns_generic}, why dont you go ${toSay}, you ${nouns_insult}!`;
			}
		}
	} else if (prob(this.chattyness)) {
		chatmsg += pick(this.knownStrings);
		if (prob(25)) {
			this.knownStrings -= pick(chatmsg);
		}
	}
	if (!(chatmsg != ";" && chatmsg != "")) return f.dot;
	yield* this.say(chatmsg);
	return f.dot;
}, true);

// interactive.dm:898
rt.def("/mob/living/carbon/human/interactive/proc/getAllContents", function getAllContents(f: Frame) {
	let A: Value = null, B: Value = null;
	let allContents: Value = list();
	for (A of each(this.contents, T("/atom"))) {
		allContents += A;
		if (rt.len(f, A.contents) > 0) {
			B = null;
			for (B of each(A, T("/atom"))) {
				allContents += B;
			}
		}
	}
	return allContents;
});

// interactive.dm:907
rt.def("/mob/living/carbon/human/interactive/proc/enforceHome", function* enforceHome(f: Frame) {
	let tcheck: Value = null;
	let validHome: Value = get_area_turfs(this.job2area(this.myjob));
	if (this.TARGET) {
		if (tcheck = this.TARGET) {
			if (!rt.isIn(f, rt.getStep(f, tcheck, 0), validHome)) {
				this.TARGET = null;
				return 1;
			}
		}
	}
	if (!rt.isIn(f, rt.getStep(f, this, 0), validHome)) {
		yield* this.tryWalk(pick(get_area_turfs(this.job2area(this.myjob))));
		return 1;
	}
	return 0;
}, true);

// interactive.dm:923
rt.def("/mob/living/carbon/human/interactive/proc/npcDrop", function npcDrop(f: Frame, A: Value, blacklist: Value) {
	blacklist ??= 0;
	if (blacklist) {
		this.blacklistItems += A;
	}
	A.loc = rt.getStep(f, this, 0);
	this.enforce_hands();
	this.update_icons();
	return f.dot;
});

// interactive.dm:930
rt.def("/mob/living/carbon/human/interactive/proc/traitor", function* traitor(f: Frame, obj: Value) {
	let M: Value = null, I: Value = null, choice: Value = null;
	if (this.traitorType == SNPC_PSYCHO) {
		this.traitorTarget = pick(this.nearby);
	}
	if (!prob(this.traitorScale)) return f.dot;
	if (!this.Adjacent(this.traitorTarget) && this.traitorType != SNPC_PSYCHO) {
		yield* this.tryWalk(rt.getStep(f, this.traitorTarget, 0));
	} else if (this.traitorType === SNPC_BRUTE) {
		this.retal = 1;
		this.retal_target = this.traitorTarget;
	} else if (this.traitorType === SNPC_STEALTH) {
		if (ismob(this.traitorTarget)) {
			if (!(M = this.traitorTarget).stat) {
				this.retal = 1;
				this.retal_target = this.traitorTarget;
			} else {
				(I = this.traitorTarget).loc = rt.getStep(f, this.traitorTarget, 0);
			}
		} else {
			yield* this.take_to_slot(this.traitorTarget);
		}
	} else if (this.traitorType === SNPC_MARTYR) {
		this.customEmote(`${this}'s chest opens up, revealing a large mass of explosives and tangled wires!`);
		if (this.inactivity_period <= 0) {
			this.inactivity_period = 9999;
			if (yield* do_after(this, 60, { target: this.traitorTarget })) {
				this.customEmote(`A fire bursts from ${this}'s eyes, igniting white hot and consuming their body in a flaming explosion!`);
				yield* explosion(this, 6, 6, 6);
			} else {
				this.inactivity_period = 0;
				this.customEmote(`${this}'s chest closes, hiding their insides.`);
			}
		}
	} else if (this.traitorType === SNPC_PSYCHO) {
		choice = pick(typesof(T("/obj/item/weapon/grenade/chem_grenade")) - T("/obj/item/weapon/grenade/chem_grenade"));
		yield* new_(choice, this);
		this.retal = 1;
		this.retal_target = this.traitorTarget;
	}
	return f.dot;
}, true);

// interactive.dm:971
rt.def("/mob/living/carbon/human/interactive/proc/botany", function* botany(f: Frame, obj: Value) {
	let internalBag: Value = null, HP: Value = null, tester: Value = null, A: Value = null, seedType: Value = null, SEED: Value = null, change: Value = null, GF: Value = null, SF: Value = null, toLoad: Value = null;
	if (this.shouldModulePass()) {
		return f.dot;
	}
	if (yield* this.enforceHome()) {
		return f.dot;
	}
	let allContents: Value = this.getAllContents();
	let internalBeaker: Value = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), allContents);
	if (!(internalBag = rt.locateIn(f, T("/obj/item/weapon/storage/bag/plants"), allContents))) {
		internalBag = (yield* new_(T("/obj/item/weapon/storage/bag/plants"), this));
	}
	if (!internalBeaker) {
		(internalBeaker = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), this))).name = "Grow-U-All Super Spray";
	}
	if (!(internalBeaker && internalBag)) return f.dot;
	let considered: Value = list();
	for (tester of each(view(12, this), T("/obj/machinery/hydroponics"))) {
		rt.setAt(considered, tester, 1);
		if (!tester.myseed) {
			rt.modAt(considered, tester, 50, add);
		}
		if (tester.weedlevel > 0) {
			rt.modAt(considered, tester, 5, add);
		}
		if (tester.pestlevel > 0) {
			rt.modAt(considered, tester, 5, add);
		}
		if (tester.nutrilevel < tester.maxnutri) {
			rt.modAt(considered, tester, 15, add);
		}
		if (tester.waterlevel < tester.maxwater) {
			rt.modAt(considered, tester, 15, add);
		}
		if (tester.harvest || tester.dead) {
			rt.modAt(considered, tester, 100, add);
		}
		rt.setAt(considered, tester, max(1, rt.index(considered, tester) - get_dist(this, tester)));
	}
	let index: Value = 0;
	for (A of each(considered)) {
		index++;
		if (rt.index(considered, A) > rt.index(considered, HP) || !HP) {
			HP = rt.index(considered, index);
		}
	}
	if (HP) {
		this.TARGET = HP;
		if (!this.Adjacent(HP)) {
			yield* this.tryWalk(rt.getStep(f, HP, 0));
		} else if (HP.harvest || HP.dead) {
			yield* HP.attack_hand(this);
		} else if (!HP.myseed) {
			seedType = pick(typesof(T("/obj/item/seeds")) - T("/obj/item/seeds"));
			SEED = (yield* new_(seedType, this));
			this.customEmote(`${this} ${pick("gibbers", "drools", "slobbers", "claps wildly", "spits")} towards ${this.TARGET}, producing a ${SEED}!`);
			yield* HP.attackby(SEED, this);
		} else {
			change = 0;
			if (HP.weedlevel > 0) {
				change = 1;
				if (!internalBeaker.reagents.has_reagent("weedkiller", 10)) {
					yield* internalBeaker.reagents.add_reagent("weedkiller", 10);
				}
			}
			if (HP.pestlevel > 0) {
				change = 1;
				if (!internalBeaker.reagents.has_reagent("pestkiller", 10)) {
					yield* internalBeaker.reagents.add_reagent("pestkiller", 10);
				}
			}
			if (HP.nutrilevel < HP.maxnutri) {
				change = 1;
				if (!internalBeaker.reagents.has_reagent("eznutriment", 15)) {
					yield* internalBeaker.reagents.add_reagent("eznutriment", 15);
				}
				if (!internalBeaker.reagents.has_reagent("diethylamine", 15)) {
					yield* internalBeaker.reagents.add_reagent("diethylamine", 15);
				}
			}
			if (HP.waterlevel < HP.maxwater) {
				change = 1;
				if (!internalBeaker.reagents.has_reagent("holywater", 50)) {
					yield* internalBeaker.reagents.add_reagent("holywater", 50);
				}
			}
			if (change) {
				yield* HP.attackby(internalBeaker, this);
			}
		}
	}
	if (GF = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown"), view(12, this))) {
		if (!this.Adjacent(GF)) {
			yield* this.tryWalk(rt.getStep(f, GF, 0));
		} else {
			yield* GF.attackby(internalBag, this);
		}
	}
	if (!(rt.len(f, internalBag.contents) > 0)) return f.dot;
	if (!this.Adjacent((SF = rt.locateIn(f, T("/obj/machinery/smartfridge"), range(12, this))))) {
		yield* this.tryWalk(rt.getStep(f, SF, 0), 1);
	} else {
		this.customEmote(`${this} ${pick("gibbers", "drools", "slobbers", "claps wildly", "spits")}, upending the ${internalBag}'s contents all over the ${SF}!`);
		for (toLoad of each(internalBag.contents, T("/obj"))) {
			if (rt.len(f, this.contents) >= SF.max_n_of_items) {
				break;
			}
			if (SF.accept_check(toLoad)) {
				yield* SF.load(toLoad);
			} else {
				yield* qdel(toLoad);
			}
		}
	}
	return f.dot;
}, true);

// interactive.dm:1075
rt.def("/mob/living/carbon/human/interactive/proc/bartend", function* bartend(f: Frame, obj: Value) {
	let RT: Value = null, serveTarget: Value = null, H: Value = null, drinkChoice: Value = null, D: Value = null;
	if (this.shouldModulePass()) {
		return f.dot;
	}
	if (yield* this.enforceHome()) {
		return f.dot;
	}
	let rangeCheck: Value = oview(6, this);
	for (H of each(rangeCheck, T("/mob/living/carbon/human"))) {
		if (!rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/drinks"), orange(1, H))) {
			serveTarget = H;
		}
	}
	if (serveTarget) {
		RT = rt.locateIn(f, T("/obj/structure/table"), orange(1, serveTarget));
	}
	if (!(RT && serveTarget)) return f.dot;
	if (!this.Adjacent(RT)) {
		yield* this.tryWalk(rt.getStep(f, RT, 0));
	} else {
		if (!(drinkChoice = pick(typesof(T("/obj/item/weapon/reagent_containers/food/drinks")) - T("/obj/item/weapon/reagent_containers/food/drinks")))) return f.dot;
		D = (yield* new_(drinkChoice, rt.getStep(f, this, 0)));
		yield* RT.attackby(D, this);
		yield* this.say(`${pick("Something to wet your whistle!", "Down the hatch, a tasty beverage!", "One drink, coming right up!", "Tasty liquid for your oral intake!", "Enjoy!")}`);
		this.customEmote(`${this} ${pick("gibbers", "drools", "slobbers", "claps wildly", "spits")}, serving up a ${D}!`);
	}
	return f.dot;
}, true);

// interactive.dm:1106
rt.def("/mob/living/carbon/human/interactive/proc/shitcurity", function* shitcurity(f: Frame, obj: Value) {
	let C: Value = null, perpname: Value = null, R: Value = null, I: Value = null;
	let $e: any;
	let allContents: Value = this.getAllContents();
	for (C of each(this.nearby, T("/mob/living/carbon/human"))) {
		perpname = C.get_face_name(C.get_id_name());
		if ((R = find_record("name", perpname, GLOB.data_core.security)) && rt.index(R.fields, "criminal")) {
			if (rt.index(R.fields, "criminal") === "*Arrest*") {
				yield* this.retalTarget(C);
			}
		}
	}
	if (!(this.retal && this.TARGET)) return f.dot;
	for (I of each(allContents, T("/obj/item"))) {
		if (rt.istype(I, T("/obj/item/weapon/restraints"))) {
			yield* I.attack(this.TARGET, this);
			this.inactivity_period = 25;
			break;
		}
	}
	return f.dot;
}, true);

// interactive.dm:1124
rt.def("/mob/living/carbon/human/interactive/proc/clowning", function* clowning(f: Frame, obj: Value) {
	let clownTarget: Value = null, S: Value = null, C: Value = null, pranksNearby: Value = null, _T: Value = null, A: Value = null, A_5: Value = null, hasPranked: Value = null, A_6: Value = null, B: Value = null;
	if (this.shouldModulePass()) {
		return f.dot;
	}
	let allContents: Value = this.getAllContents();
	let rangeCheck: Value = orange(12, this);
	let clownPriority: Value = list();
	if (!(S = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/spray"), allContents))) {
		(S = (yield* new_(T("/obj/item/weapon/reagent_containers/spray"), this))).amount_per_transfer_from_this = 10;
	}
	for (C of each(rangeCheck, T("/mob/living/carbon/human"))) {
		pranksNearby = 100;
		_T = null;
		for (_T of each(orange(1, C), T("/turf/open"))) {
			A = null;
			for (A of each(_T, T("/obj/item"))) {
				if (rt.istype(A, T("/obj/item/weapon/soap")) || rt.istype(A, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana")) || rt.istype(A, T("/obj/item/weapon/grown/bananapeel"))) {
					pranksNearby--;
				}
			}
			if (_T.wet) {
				pranksNearby -= 10;
			}
		}
		rt.setAt(clownPriority, C, pranksNearby);
	}
	for (A_5 of each(clownPriority)) {
		if (!clownTarget) {
			clownTarget = A_5;
		} else if (rt.index(clownPriority, A_5) > rt.index(clownPriority, clownTarget)) {
			clownTarget = rt.index(clownPriority, A_5);
		}
	}
	if (!clownTarget) return f.dot;
	if (!this.Adjacent(clownTarget)) {
		yield* this.tryWalk(clownTarget);
	} else {
		hasPranked = 0;
		for (A_6 of each(allContents)) {
			if (prob(this.smartness / 2) && !hasPranked) {
				if (rt.istype(A_6, T("/obj/item/weapon/soap"))) {
					this.npcDrop(A_6);
					hasPranked = 1;
				}
				if (rt.istype(A_6, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"))) {
					yield* (B = A_6).attack(this, this);
				}
				if (rt.istype(A_6, T("/obj/item/weapon/grown/bananapeel"))) {
					this.npcDrop(A_6);
					hasPranked = 1;
				}
			}
		}
		if (hasPranked) return f.dot;
		if (S.reagents.total_volume <= 5) {
			yield* S.reagents.add_reagent("water", 25);
		}
		yield* S.afterattack(rt.getStep(f, pick(orange(1, clownTarget)), 0), this);
	}
	return f.dot;
}, true);

// interactive.dm:1181
rt.def("/mob/living/carbon/human/interactive/proc/healpeople", function* healpeople(f: Frame, obj: Value) {
	let M: Value = null, A: Value = null, HPS: Value = null, C: Value = null;
	let shouldTryHeal: Value = 0;
	let allContents: Value = this.getAllContents();
	for (A of each(allContents)) {
		if (rt.istype(A, T("/obj/item/stack/medical"))) {
			shouldTryHeal = 1;
			M = A;
		}
	}
	if (!rt.locateIn(f, T("/obj/item/weapon/reagent_containers/hypospray"), allContents)) {
		yield* new_(T("/obj/item/weapon/reagent_containers/hypospray"), this);
	} else {
		HPS = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/hypospray"), allContents);
		if (!shouldTryHeal) {
			shouldTryHeal = 2;
		}
	}
	if (shouldTryHeal == 1) {
		for (C of each(this.nearby, T("/mob/living/carbon/human"))) {
			if (C.health <= 75) {
				if (get_dist(this, C) <= 2) {
					yield* this.say(`Wait, ${C}, let me heal you!`);
					yield* M.attack(C, this);
					this.inactivity_period = 25;
				} else {
					yield* this.tryWalk(rt.getStep(f, C, 0));
				}
			}
		}
	} else {
		if (shouldTryHeal != 2) return f.dot;
		if (!HPS) return f.dot;
		if (HPS.reagents.total_volume <= 0) {
			yield* HPS.reagents.add_reagent("tricordrazine", 30);
		}
		C = null;
		for (C of each(this.nearby, T("/mob/living/carbon/human"))) {
			if (C.health <= 75 && C.reagents.get_reagent_amount("tricordrazine") <= 0) {
				if (get_dist(this, C) <= 2) {
					yield* this.say(`Wait, ${C}, let me heal you!`);
					yield* HPS.attack(C, this);
					this.inactivity_period = 25;
				} else {
					yield* this.tryWalk(rt.getStep(f, C, 0));
				}
			}
		}
	}
	return f.dot;
}, true);

// interactive.dm:1221
rt.def("/mob/living/carbon/human/interactive/proc/dojanitor", function* dojanitor(f: Frame, obj: Value) {
	let S: Value = null, TC: Value = null;
	if (this.shouldModulePass()) {
		return f.dot;
	}
	let allContents: Value = this.getAllContents();
	if (!rt.locateIn(f, T("/obj/item/weapon/reagent_containers/spray"), allContents)) {
		yield* new_(T("/obj/item/weapon/reagent_containers/spray"), this);
	} else {
		S = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/spray"), allContents);
	}
	if (!S) return f.dot;
	if (S.reagents.total_volume <= 5) {
		yield* S.reagents.add_reagent("cleaner", 25);
	}
	if (!(TC = rt.locateIn(f, T("/obj/effect/decal/cleanable"), range(MAX_RANGE_FIND, this)))) return f.dot;
	if (!this.Adjacent(TC)) {
		yield* this.tryWalk(TC);
	} else {
		yield* S.afterattack(TC, this);
		this.inactivity_period = 25;
	}
	return f.dot;
}, true);

// interactive.dm:1246
rt.def("/mob/living/carbon/human/interactive/proc/customEmote", function customEmote(f: Frame, text: Value) {
	this.visible_message(`<span class='notice'>${text}</span>`);
	return f.dot;
});

// interactive.dm:1250
rt.def("/mob/living/carbon/human/interactive/proc/cookingwithmagic", function* cookingwithmagic(f: Frame, target: Value) {
	let S: Value = null;
	if (this.Adjacent(target)) {
		this.customEmote(`${this} ${pick("gibbers", "drools", "slobbers", "claps wildly", "spits")} towards ${target}, and with a bang, it's instantly cooked!`);
		S = (yield* new_(target.cooked_type, rt.getStep(f, this, 0)));
		yield* target.initialize_cooked_food(S, 100);
		if (target) {
			yield* qdel(target);
		}
	} else {
		yield* this.tryWalk(target);
	}
	return f.dot;
}, true);

// interactive.dm:1260
rt.def("/mob/living/carbon/human/interactive/proc/souschef", function* souschef(f: Frame, obj: Value) {
	let RP: Value = null, KK: Value = null, foundCustom: Value = null, DP: Value = null, customType: Value = null, A: Value = null, SF: Value = null, FC: Value = null, toMake: Value = null, choice: Value = null, toCook: Value = null, toDisplay: Value = null, toGrab: Value = null, RT: Value = null, toCheck: Value = null, counted: Value = null, S: Value = null, toPlop: Value = null, A_15: Value = null, O: Value = null, newSnack: Value = null;
	if (this.shouldModulePass()) {
		return f.dot;
	}
	if (yield* this.enforceHome()) {
		return f.dot;
	}
	let allContents: Value = this.getAllContents();
	if (!(RP = rt.locateIn(f, T("/obj/item/weapon/kitchen/rollingpin"), allContents))) {
		yield* new_(T("/obj/item/weapon/kitchen/rollingpin"), this);
	}
	if (!(KK = rt.locateIn(f, T("/obj/item/weapon/kitchen/knife"), allContents))) {
		yield* new_(T("/obj/item/weapon/kitchen/knife"), this);
	}
	let foundCookable: Value = 0;
	if (!(RP && KK)) return f.dot;
	let rangeCheck: Value = view(6, this);
	let customableTypes: Value = list(T("/obj/item/weapon/reagent_containers/food/snacks/customizable"), T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), T("/obj/item/weapon/reagent_containers/food/snacks/pizzabread"), T("/obj/item/weapon/reagent_containers/food/snacks/bun"), T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"));
	for (DP of each(rangeCheck, T("/obj/item/weapon/reagent_containers/food/snacks/donkpocket"))) {
		if (prob(50)) {
			this.customEmote(`${this} points at the ${DP}, emitting a loud ${pick("bellow", "screech", "yell", "scream")}, and it bursts into flame.`);
			yield* qdel(DP);
		}
	}
	for (customType of each(customableTypes)) {
		if (A = rt.locateIn(f, customType, rangeCheck)) {
			foundCustom = A;
		}
	}
	if (SF = rt.locateIn(f, T("/obj/machinery/smartfridge"), rangeCheck)) {
		if (rt.len(f, SF.contents) > 0) {
			if (!this.Adjacent(SF)) {
				yield* this.tryWalk(rt.getStep(f, SF, 0), 1);
			} else {
				this.customEmote(`${this} ${pick("gibbers", "drools", "slobbers", "claps wildly", "spits")}, grabbing various foodstuffs from ${SF} and sticking them in it's mouth!`);
				A = null;
				for (A of each(SF.contents, T("/obj/item"))) {
					if (prob(this.smartness / 2)) {
						A.loc = this;
					}
				}
			}
		}
	}
	if (foundCustom) {
		FC = foundCustom;
		for (toMake of each(allContents, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
			if (prob(this.smartness)) {
				if (FC.reagents) {
					yield* FC.attackby(toMake, this);
				} else {
					yield* qdel(FC);
				}
			}
		}
	}
	let D: Value = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/snacks/dough"), rangeCheck);
	let FD: Value = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/snacks/flatdough"), rangeCheck);
	let CB: Value = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/snacks/cakebatter"), rangeCheck);
	let PD: Value = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/snacks/piedough"), rangeCheck);
	if (D) {
		this.TARGET = D;
		if ((choice = pick(1, 2)) == 1) {
			yield* this.tryWalk(rt.getStep(f, D, 0));
			this.inactivity_period = get_dist(this, D);
			yield* D.attackby(RP, this);
		} else {
			yield* this.cookingwithmagic(D);
		}
		foundCookable = 1;
	} else if (FD) {
		this.TARGET = FD;
		if ((choice = pick(1, 2)) == 1) {
			yield* this.tryWalk(rt.getStep(f, D, 0));
			this.inactivity_period = get_dist(this, D);
			yield* FD.attackby(KK, this);
		} else {
			yield* this.cookingwithmagic(FD);
		}
		foundCookable = 1;
	} else if (CB) {
		this.TARGET = CB;
		if ((choice = pick(1, 2)) == 1) {
			yield* this.tryWalk(rt.getStep(f, D, 0));
			this.inactivity_period = get_dist(this, D);
			yield* CB.attackby(RP, this);
		} else {
			yield* this.cookingwithmagic(CB);
		}
		foundCookable = 1;
	} else if (PD) {
		this.TARGET = PD;
		if ((choice = pick(1, 2)) == 1) {
			yield* this.tryWalk(rt.getStep(f, D, 0));
			this.inactivity_period = get_dist(this, D);
			yield* PD.attackby(KK, this);
		} else {
			yield* this.cookingwithmagic(PD);
		}
		foundCookable = 1;
	}
	if (toCook = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/snacks"), rangeCheck)) {
		if (toCook.cooked_type) {
			this.TARGET = toCook;
			foundCookable = 1;
			if (this.Adjacent(toCook)) {
				yield* this.cookingwithmagic(toCook);
			} else {
				yield* this.tryWalk(rt.getStep(f, toCook, 0));
			}
		}
	}
	let finishedList: Value = list();
	for (toDisplay of each(allContents, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		if (!toDisplay.cooked_type && !rt.istype(toDisplay, T("/obj/item/weapon/reagent_containers/food/snacks/grown"))) {
			finishedList += toDisplay;
		}
	}
	for (toGrab of each(rangeCheck, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		if (!rt.locateIn(f, T("/obj/structure/table/reinforced"), rt.getStep(f, toGrab, 0))) {
			foundCookable = 1;
			if (!this.Adjacent(toGrab)) {
				yield* this.tryWalk(toGrab);
			} else {
				toGrab.loc = this;
			}
		}
	}
	if (rt.len(f, finishedList) > 0) {
		for (toCheck of each(rangeCheck, T("/obj/structure/table/reinforced"))) {
			counted = 0;
			S = null;
			for (S of each(rt.getStep(f, toCheck, 0), T("/obj/item/weapon/reagent_containers/food/snacks"))) {
				counted++;
			}
			if (counted < 12) {
				RT = toCheck;
				break;
			}
		}
		if (RT) {
			foundCookable = 1;
			if (!this.Adjacent(RT)) {
				yield* this.tryWalk(rt.getStep(f, RT, 0));
			} else {
				for (toPlop of each(allContents, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
					yield* RT.attackby(toPlop, this);
				}
			}
		}
	}
	if (foundCookable) return f.dot;
	let allTypes: Value = list(T("/obj/item/weapon/reagent_containers/food/snacks/piedough"), T("/obj/item/weapon/reagent_containers/food/snacks/cakebatter"), T("/obj/item/weapon/reagent_containers/food/snacks/dough"), T("/obj/item/weapon/reagent_containers/food/snacks/flatdough"));
	for (A_15 of each(typesof(T("/obj/item/weapon/reagent_containers/food/snacks")))) {
		if (rt.initial(f, (O = A_15), "cooked_type")) {
			allTypes += A_15;
		}
	}
	let chosenType: Value = pick(allTypes);
	this.TARGET = (newSnack = (yield* new_(chosenType, rt.getStep(f, this, 0))));
	yield* newSnack.reagents.remove_any(newSnack.reagents.total_volume / 2 - 1);
	newSnack.name = `Synthetic ${newSnack.name}`;
	this.customEmote(`${this} ${pick("gibbers", "drools", "slobbers", "claps wildly", "spits")} as they vomit ${newSnack} from their mouth!`);
	return f.dot;
}, true);

// interactive.dm:1432
rt.def("/mob/living/carbon/human/interactive/proc/compareFaction", function compareFaction(f: Frame, targetFactions: Value) {
	let A: Value = null;
	let hasSame: Value = 0;
	for (A of each(targetFactions)) {
		if (rt.isIn(f, A, this.faction)) {
			hasSame = 1;
		}
	}
	return hasSame;
});

// interactive.dm:1439
rt.def("/mob/living/carbon/human/interactive/proc/combat", function* combat(f: Frame, obj: Value) {
	let M: Value = null, best: Value = null, test: Value = null, a: Value = null, R: Value = null, G: Value = null, M_3: Value = null, A: Value = null, W: Value = null, G_4: Value = null, _P: Value = null, stunning: Value = null, A_7: Value = null, shouldFire: Value = null, stunCheck: Value = null;
	this.enforce_hands();
	if (this.canmove) {
		if (this.graytide || rt.bitAnd(this.TRAITS, TRAIT_MEAN) || this.retal) {
			this.interest += this.targetInterestShift;
			this.a_intent = "harm";
			this.zone_selected = pick("chest", "r_leg", "l_leg", "r_arm", "l_arm", "head");
			(rt.modSrcVar(f, "doing", FIGHTING, rt.bitOr));
			if (this.retal) {
				this.TARGET = this.retal_target;
			} else if (!(M = rt.locateIn(f, T("/mob/living"), oview(7, this)))) {
				this.doing = rt.bitAnd(this.doing, 16777207);
			} else if (M != this && !this.compareFaction(M.faction)) {
				this.TARGET = M;
			}
		}
	}
	if (this.retal) {
		if (this.retal_target) {
			if (this.compareFaction(this.retal_target.faction)) {
				this.retal = 0;
				this.retal_target = null;
				this.TARGET = null;
				this.doing = 0;
			}
		}
	}
	let foundFav: Value = 0;
	let allContents: Value = this.getAllContents();
	for (test of each(allContents)) {
		a = null;
		for (a of each(this.favoured_types)) {
			if (ispath(test, a) && !rt.bitAnd(this.doing, FIGHTING)) {
				best = test;
				foundFav = 1;
				return f.dot;
			}
		}
		if (!foundFav) {
			if (rt.istype(test, T("/obj/item/weapon"))) {
				if ((R = test).force > 2) {
					if (!best) {
						best = R;
					} else if (best.force < R.force) {
						best = R;
					}
					if (rt.istype(R, T("/obj/item/weapon/gun"))) {
						if ((G = R).can_shoot()) {
							best = R;
							break;
						}
					}
				}
			}
		}
	}
	if (best) {
		yield* this.take_to_slot(best, 1);
	}
	if (!(this.TARGET && rt.bitAnd(this.doing, FIGHTING))) return f.dot;
	if (rt.istype((M_3 = this.TARGET), T("/mob/living"))) {
		if (M_3.health > 1) {
			for (A of each(allContents)) {
				if (rt.istype(A, T("/obj/item/weapon/gun"))) {
					continue;
				}
				if (prob(this.robustness)) {
					if (rt.istype(A, T("/obj/item/weapon"))) {
						if ((W = A).throwforce > 19) {
							this.npcDrop(W, 1);
							yield* this.throw_item(this.TARGET);
						}
					}
					if (rt.istype(A, T("/obj/item/weapon/grenade"))) {
						yield* (G = A).attack_self(this);
						if (prob(this.smartness)) {
							this.npcDrop(G, 1);
							this.inactivity_period = 15;
							yield* sleep(15);
							yield* this.throw_item(this.TARGET);
						}
					}
				}
			}
			if (!this.main_hand && this.other_hand) {
				this.swap_hands();
			}
			if (this.main_hand) {
				if (this.main_hand.force != 0) {
					if (rt.istype(this.main_hand, T("/obj/item/weapon/gun"))) {
						if (yield* (G_4 = this.main_hand).can_trigger_gun(this)) {
							if (rt.istype(this.main_hand, T("/obj/item/weapon/gun/ballistic"))) {
								if (!(_P = this.main_hand).chambered) {
									yield* _P.chamber_round();
									yield* _P.update_icon();
								} else if (_P.get_ammo(1) == 0) {
									yield* _P.update_icon();
									this.npcDrop(_P, 1);
								} else {
									yield* _P.afterattack(this.TARGET, this);
								}
							} else if (rt.istype(this.main_hand, T("/obj/item/weapon/gun/energy"))) {
								_P = this.main_hand;
								stunning = 0;
								for (A_7 of each(_P.ammo_type)) {
									if (ispath(A_7, T("/obj/item/ammo_casing/energy/electrode"))) {
										stunning = 1;
									}
								}
								shouldFire = 1;
								stunCheck = this.TARGET;
								if (stunning && rt.istype(stunCheck, T("/mob/living")) && stunCheck.IsStun()) {
									shouldFire = 0;
								}
								if (shouldFire) {
									if (_P.cell.charge <= 10) {
										yield* _P.update_icon();
										this.npcDrop(_P, 1);
									} else {
										yield* _P.afterattack(this.TARGET, this);
									}
								}
							} else if (get_dist(this, this.TARGET) > 6) {
								if (!(yield* this.walk2derpless(this.TARGET))) {
									this.timeout++;
								}
							} else {
								yield* (W = this.main_hand).attack(this.TARGET, this);
							}
						} else {
							G_4.loc = rt.getStep(f, this, 0);
							this.enforce_hands();
							yield* this.update_icons();
						}
					}
				}
			} else if (this.targetRange(this.TARGET) > 2) {
				yield* this.tryWalk(this.TARGET);
			} else if (this.Adjacent(this.TARGET)) {
				this.a_intent = pick("disarm", "harm");
				yield* M_3.attack_hand(this);
			}
		}
		this.timeout++;
	} else if (this.timeout >= 10 || !(this.targetRange(M_3) > 14)) {
		this.doing = rt.bitAnd(this.doing, 16777207);
		this.timeout = 0;
		this.TARGET = null;
		this.retal = 0;
		this.retal_target = null;
	} else {
		this.timeout++;
	}
	return f.dot;
}, true);

// interactive.dm:1578
rt.def("/mob/living/carbon/human/interactive/proc/nearbyscan", function nearbyscan(f: Frame, obj: Value) {
	let M: Value = null;
	this.nearby = list();
	for (M of each(view(4, this), T("/mob/living"))) {
		if (M != this) {
			this.nearby += M;
		}
	}
	return f.dot;
});

rt.type(4814, "/mob/living/carbon/human/interactive/angry", "/mob/living/carbon/human/interactive", {});

// interactive.dm:1585
rt.def("/mob/living/carbon/human/interactive/angry/proc/Initialize", function* Initialize(f: Frame) {
	(rt.modSrcVar(f, "TRAITS", TRAIT_ROBUST, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", TRAIT_MEAN, rt.bitOr));
	this.faction += "bot_angry";
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(4815, "/mob/living/carbon/human/interactive/friendly", "/mob/living/carbon/human/interactive", {});

// interactive.dm:1591
rt.def("/mob/living/carbon/human/interactive/friendly/proc/Initialize", function* Initialize(f: Frame) {
	(rt.modSrcVar(f, "TRAITS", TRAIT_FRIENDLY, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", TRAIT_UNROBUST, rt.bitOr));
	this.faction += "bot_friendly";
	this.faction += "neutral";
	this.functions -= "combat";
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(4816, "/mob/living/carbon/human/interactive/greytide", "/mob/living/carbon/human/interactive", {});

// interactive.dm:1599
rt.def("/mob/living/carbon/human/interactive/greytide/proc/Initialize", function* Initialize(f: Frame) {
	(rt.modSrcVar(f, "TRAITS", TRAIT_ROBUST, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", TRAIT_MEAN, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", TRAIT_THIEVING, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", TRAIT_DUMB, rt.bitOr));
	this.maxInterest = 5;
	this.targetInterestShift = 2;
	this.faction += "bot_grey";
	this.graytide = 1;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(4817, "/mob/living/carbon/human/interactive/robust", "/mob/living/carbon/human/interactive", {});

// interactive.dm:1611
rt.def("/mob/living/carbon/human/interactive/robust/proc/Initialize", function* Initialize(f: Frame) {
	(rt.modSrcVar(f, "TRAITS", TRAIT_FRIENDLY, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", TRAIT_ROBUST, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", TRAIT_SMART, rt.bitOr));
	this.faction += "bot_power";
	yield* parent_proc();
	return f.dot;
}, true);
