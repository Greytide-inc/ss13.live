// From code/modules/mob/living/carbon/human/interactive.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /mob/living/carbon/human/interactive/proc/<init>  (code/modules/mob/living/carbon/human/interactive.dm:40)
rt.def("/mob/living/carbon/human/interactive/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "nearby", rt.list());
	$0 = $0;
	rt.setSv(f, "blacklistItems", rt.list());
	$0 = $0;
	rt.setSv(f, "myPath", rt.list());
	$0 = $0;
	rt.setSv(f, "favoured_types", rt.list());
	rt.setSv(f, "functions", rt.list("nearbyscan", "combat", "shitcurity", "chatter"));
	$0 = $0;
	rt.setSv(f, "knownStrings", rt.list());
	$0 = $0;
	rt.setSv(f, "faction", rt.list("synth"));
	return f.dot;
});

// /mob/living/carbon/human/interactive/proc/loadVoice  (code/modules/mob/living/carbon/human/interactive.dm:90)
rt.def("/mob/living/carbon/human/interactive/proc/loadVoice", function loadVoice(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	rt.setSv(f, "knownStrings", rt.input(f, rt.R.index, null, [(S = rt.new_(f, T("/savefile"), ["data/npc_saves/snpc.sav"])), "knownStrings"]));
	if (rt.sv(f, "knownStrings") !== null) return f.dot;
	rt.setSv(f, "knownStrings", rt.list());
	return f.dot;
});

// /mob/living/carbon/human/interactive/proc/saveVoice  (code/modules/mob/living/carbon/human/interactive.dm:99)
rt.def("/mob/living/carbon/human/interactive/proc/saveVoice", function saveVoice(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (truthy(rt.sv(f, "voice_saved"))) {
		return live(f.dot);
	}
	rt.op(f, "OutputReference", [rt.R.index], [(S = rt.new_(f, T("/savefile"), ["data/npc_saves/snpc.sav"])), "knownStrings", rt.sv(f, "knownStrings")], false);
	return f.dot;
});

// /mob/living/carbon/human/interactive/proc/takeDelegate  (code/modules/mob/living/carbon/human/interactive.dm:104)
rt.def("/mob/living/carbon/human/interactive/proc/takeDelegate", function takeDelegate(f: Frame, from: Value, doReset: Value) {
	f.vars = () => [doReset];
	if (live(doReset) === null) {
		doReset = 1;
	}
	rt.setSv(f, "eye_color", "red");
	if (isEqual(live(from), live(f.src))) {
		return 0;
	}
	rt.setSv(f, "TARGET", rt.fv(f, "TARGET", live(from)));
	rt.setSv(f, "LAST_TARGET", rt.fv(f, "LAST_TARGET", live(from)));
	rt.setSv(f, "retal", rt.fv(f, "retal", live(from)));
	rt.setSv(f, "retal_target", rt.fv(f, "retal_target", live(from)));
	rt.setSv(f, "doing", rt.fv(f, "doing", live(from)));
	rt.setSv(f, "timeout", 0);
	rt.setSv(f, "inactivity_period", 0);
	rt.setSv(f, "interest", rt.sv(f, "maxInterest"));
	rt.callSrc(f, "update_icons", []);
	if (truthy(live(doReset))) {
		rt.setFv(f, "TARGET", live(from), null);
		rt.setFv(f, "LAST_TARGET", live(from), null);
		rt.setFv(f, "retal", live(from), 0);
		rt.setFv(f, "retal_target", live(from), null);
		rt.setFv(f, "doing", live(from), 0);
	}
	return 1;
});

// /mob/living/carbon/human/interactive/proc/random  (code/modules/mob/living/carbon/human/interactive.dm:130)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/random", function* random(f: Frame) {
	rt.setSv(f, "age", (yield* g.call(f, P("/proc/rand"), null, [17, 85])));
	rt.setSv(f, "myjob", (yield* g.new_(f, T("/datum/job/assistant"), [])));
	rt.setSv(f, "job", rt.fv(f, "title", rt.sv(f, "myjob")));
	yield* g.callName(f, rt.sv(f, "myjob"), "equip", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/attacked_by  (code/modules/mob/living/carbon/human/interactive.dm:137)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/attacked_by", function* attacked_by(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "retal", 1);
	rt.setSv(f, "retal_target", live(f.args[1]));
	return f.dot;
}, true, { args: ["I", "user", "def_zone"] });

// /mob/living/carbon/human/interactive/proc/bullet_act  (code/modules/mob/living/carbon/human/interactive.dm:142)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/bullet_act", function* bullet_act(f: Frame) {
	let potentialAssault: Value = null;
	f.vars = () => [potentialAssault];
	if (truthy((potentialAssault = rt.locateIn(f, T("/mob/living"), (yield* g.call(f, P("/proc/view"), null, [2, rt.fv(f, "starting", live(f.args[0]))])))))) {
		rt.setSv(f, "retal", 1);
		rt.setSv(f, "retal_target", live(potentialAssault));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["P", "def_zone"] });

// /client/proc/resetSNPC  (code/modules/mob/living/carbon/human/interactive.dm:153)
rt.def("/client/proc/resetSNPC", function resetSNPC(f: Frame, A: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	if (!truthy(live(A))) return f.dot;
	if (!truthy((rt.istype(live(A), T("/mob/living/carbon/human/interactive")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((_T = live(A)))) return f.dot;
	rt.setFv(f, "timeout", live(_T), 100);
	rt.setFv(f, "retal", live(_T), 0);
	rt.setFv(f, "doing", live(_T), 0);
	return f.dot;
}, false, { verb: { name: "Reset SNPC", category: "Debug", desc: "Reset the SNPC" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /client/proc/customiseSNPC  (code/modules/mob/living/carbon/human/interactive.dm:170)  may sleep
rt.def("/client/proc/customiseSNPC", function* customiseSNPC(f: Frame, A: Value) {
	let _T: Value = null, choice: Value = null, job: Value = null, j: Value = null, J: Value = null, W: Value = null, W_2: Value = null, validchoices: Value = null, M: Value = null, chosen: Value = null, toDoppel: Value = null, cType: Value = null, cjob: Value = null, W_3: Value = null, shouldDoppel: Value = null, validchoices_4: Value = null, M_5: Value = null, chosen_5: Value = null, toDoppel_6: Value = null, doTrait: Value = null, tType: Value = null, cType_6: Value = null, value: Value = null, doTele: Value = null;
	let $0: any, $e: any;
	f.vars = () => [A, _T, choice, job, j, J, W, W_2, validchoices, M, chosen, toDoppel, cType, cjob, W_3, shouldDoppel, validchoices_4, M_5, chosen_5, toDoppel_6, doTrait, tType, cType_6, value, doTele, $0, $e];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	if (!truthy(live(A))) return f.dot;
	if (!truthy((rt.istype(live(A), T("/mob/living/carbon/human/interactive")) ? 1 : 0))) {
		return live(f.dot);
	}
	_T = live(A);
	if (!truthy((choice = (yield* g.op(f, "Prompt", [1], [null, null, null, "Customization Choices", rt.list("Service NPC", "Security NPC", "Random", "Custom")]))))) return f.dot;
	if ((isEqual(live(choice), "Service NPC") || isEqual(live(choice), "Security NPC"))) {
		if (isEqual(live(choice), "Service NPC")) {
			$0 = rt.op(f, "PickUnweighted", [4], ["Bartender", "Cook", "Botanist", "Janitor"]);
		} else {
			$0 = rt.op(f, "PickUnweighted", [3], ["Warden", "Detective", "Security Officer"]);
		}
		job = $0;
		j = null;
		rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")));
		while (($e = rt.next(f, 0)) !== undefined) {
			j = $e;
			if (isEqual(rt.gv(f, "title", (J = live(j))), live(job))) {
				rt.setFv(f, "myjob", live(_T), live(J));
				rt.setFv(f, "job", live(_T), rt.gv(f, "title", rt.fv(f, "myjob", live(_T))));
				W = null;
				rt.forList(f, 1, live(_T), T("/obj/item"));
				while (($e = rt.next(f, 1)) !== undefined) {
					W = $e;
					yield* g.call(f, P("/proc/qdel"), null, [live(W)]);
				}
				rt.endFor(f, 1);
				yield* g.callName(f, rt.fv(f, "myjob", live(_T)), "equip", [live(_T)]);
				yield* g.callName(f, live(_T), "doSetup", []);
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (isEqual(live(choice), "Random")) {
		rt.setFv(f, "myjob", live(_T), rt.op(f, "PickUnweighted", [1], [rt.fv(f, "occupations", rt.gl("SSjob"))]));
		rt.setFv(f, "job", live(_T), rt.gv(f, "title", rt.fv(f, "myjob", live(_T))));
		W_2 = null;
		rt.forList(f, 0, live(_T), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			W_2 = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(W_2)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.fv(f, "myjob", live(_T)), "equip", [live(_T)]);
		yield* g.callName(f, live(_T), "doSetup", []);
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			validchoices = rt.list();
			M = null;
			rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				validchoices = rt.modify(live(validchoices), live(M), add);
			}
			rt.endFor(f, 0);
			chosen = rt.op(f, "PickUnweighted", [1], [live(validchoices)]);
			toDoppel = rt.fv(f, "dna", live(chosen));
			rt.setFv(f, "real_name", live(_T), rt.fv(f, "real_name", live(toDoppel)));
			yield* g.callName(f, live(toDoppel), "transfer_identity", [null, live(_T), "transfer_SE", 1], rt.Args.Named);
			yield* g.callName(f, live(_T), "updateappearance", ["mutcolor_update", 1], rt.Args.Named);
			yield* g.callName(f, live(_T), "domutcheck", []);
		}
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			cType = rt.op(f, "PickUnweighted", [1], [rt.list(1, 2, 3, 4)]);
			yield* g.callName(f, live(_T), "makeTraitor", [live(cType)]);
		}
		rt.setFv(f, "loc", live(_T), rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/get_area_turfs"), null, [(yield* g.callName(f, live(_T), "job2area", [rt.fv(f, "myjob", live(_T))]))]))]));
	}
	if (!isEqual(live(choice), "Custom")) return f.dot;
	if (truthy((cjob = (yield* g.op(f, "Prompt", [1], [null, null, null, "Choose Job", rt.fv(f, "occupations", rt.gl("SSjob"))]))))) {
		rt.setFv(f, "myjob", live(_T), live(cjob));
		rt.setFv(f, "job", live(_T), rt.gv(f, "title", rt.fv(f, "myjob", live(_T))));
		W_3 = null;
		rt.forList(f, 0, live(_T), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			W_3 = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(W_3)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.fv(f, "myjob", live(_T)), "equip", [live(_T)]);
		yield* g.callName(f, live(_T), "doSetup", []);
	}
	if (truthy((shouldDoppel = (yield* g.op(f, "Prompt", [1], [null, null, null, "Do you want the SNPC to disguise themself as a crewmember?", rt.list("Yes", "No")]))))) {
		if (isEqual(live(shouldDoppel), "Yes")) {
			validchoices_4 = rt.list();
			M_5 = null;
			rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M_5 = $e;
				validchoices_4 = rt.modify(live(validchoices_4), live(M_5), add);
			}
			rt.endFor(f, 0);
			if (truthy((chosen_5 = (yield* g.op(f, "Prompt", [1], [null, null, null, "Which crewmember?", live(validchoices_4)]))))) {
				toDoppel_6 = rt.fv(f, "dna", live(chosen_5));
				rt.setFv(f, "real_name", live(_T), rt.fv(f, "real_name", live(toDoppel_6)));
				yield* g.callName(f, live(toDoppel_6), "transfer_identity", [null, live(_T), "transfer_SE", 1], rt.Args.Named);
				yield* g.callName(f, live(_T), "updateappearance", ["mutcolor_update", 1], rt.Args.Named);
				yield* g.callName(f, live(_T), "domutcheck", []);
			}
		}
	}
	if (truthy((doTrait = (yield* g.op(f, "Prompt", [1], [null, null, null, "Do you want the SNPC to be a traitor?", rt.list("Yes", "No")]))))) {
		if (isEqual(live(doTrait), "Yes")) {
			tType = rt.alist(f, ["Brute", 1, "Stealth", 2, "Martyr", 3, "Psycho", 4]);
			if (truthy((cType_6 = (yield* g.op(f, "Prompt", [1], [null, null, null, "Choose the traitor personality.", live(tType)]))))) {
				value = rt.index(live(tType), live(cType_6));
				yield* g.callName(f, live(_T), "makeTraitor", [live(value)]);
			}
		}
	}
	if (!truthy((doTele = (yield* g.op(f, "Prompt", [1], [null, null, null, "Place the SNPC in their department?", rt.list("Yes", "No")]))))) return f.dot;
	if (!isEqual(live(doTele), "Yes")) return f.dot;
	rt.setFv(f, "loc", live(_T), rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/get_area_turfs"), null, [(yield* g.callName(f, live(_T), "job2area", [rt.fv(f, "myjob", live(_T))]))]))]));
	return f.dot;
}, true, { verb: { name: "Customize SNPC", category: "Debug", desc: "Customise the SNPC" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /mob/living/carbon/human/interactive/proc/doSetup  (code/modules/mob/living/carbon/human/interactive.dm:252)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/doSetup", function* doSetup(f: Frame) {
	let C: Value = null, X: Value = null, BP: Value = null;
	let $0: any, $e: any;
	f.vars = () => [C, X, BP, $0, $e];
	rt.setSv(f, "Path_ID", (yield* g.new_(f, T("/obj/item/weapon/card/id"), [live(f.src)])));
	C = (yield* g.new_(f, T("/datum/job/captain"), []));
	rt.setFv(f, "access", rt.sv(f, "Path_ID"), (yield* g.callName(f, live(C), "get_access", [])));
	rt.setSv(f, "MYID", (yield* g.new_(f, T("/obj/item/weapon/card/id"), [live(f.src)])));
	rt.setFv(f, "name", rt.sv(f, "MYID"), fmt("＀'s ID Card (＀)", [rt.fv(f, "real_name", live(f.src)), rt.fv(f, "title", rt.sv(f, "myjob"))]));
	rt.setFv(f, "assignment", rt.sv(f, "MYID"), fmt("＀", [rt.fv(f, "title", rt.sv(f, "myjob"))]));
	rt.setFv(f, "registered_name", rt.sv(f, "MYID"), rt.fv(f, "real_name", live(f.src)));
	rt.setFv(f, "access", rt.sv(f, "MYID"), rt.fv(f, "access", rt.sv(f, "Path_ID")));
	rt.setSv(f, "RPID", (yield* g.new_(f, T("/obj/item/weapon/card/id"), [live(f.src)])));
	rt.setFv(f, "name", rt.sv(f, "RPID"), fmt("＀'s ID Card (＀)", [rt.fv(f, "real_name", live(f.src)), rt.fv(f, "title", rt.sv(f, "myjob"))]));
	rt.setFv(f, "assignment", rt.sv(f, "RPID"), fmt("＀", [rt.fv(f, "title", rt.sv(f, "myjob"))]));
	rt.setFv(f, "registered_name", rt.sv(f, "RPID"), rt.fv(f, "real_name", live(f.src)));
	rt.setFv(f, "access", rt.sv(f, "RPID"), (yield* g.callName(f, rt.sv(f, "myjob"), "get_access", [])));
	yield* g.srcCall(f, "equip_to_slot_or_del", rt.sv(f, "MYID"), 6);
	rt.setSv(f, "MYPDA", (yield* g.new_(f, T("/obj/item/device/pda"), [live(f.src)])));
	rt.setFv(f, "owner", rt.sv(f, "MYPDA"), rt.sv(f, "real_name"));
	rt.setFv(f, "ownjob", rt.sv(f, "MYPDA"), "Crew");
	rt.setFv(f, "name", rt.sv(f, "MYPDA"), fmt("PDA-＀ (＀)", [rt.sv(f, "real_name"), rt.fv(f, "title", rt.sv(f, "myjob"))]));
	yield* g.srcCall(f, "equip_to_slot_or_del", rt.sv(f, "MYPDA"), 5);
	rt.setSv(f, "zone_selected", "chest");
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		BP = live(X);
		if (truthy(rt.op(f, "Prob", [], [33.75]))) {
			yield* g.callName(f, live(BP), "change_bodypart_status", [2, 0, 1]);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_icons");
	yield* g.srcCall(f, "update_damage_overlays");
	rt.setSv(f, "functions", rt.list("nearbyscan", "combat", "shitcurity", "chatter"));
	$0 = rt.fv(f, "title", rt.sv(f, "myjob"));
	if ($0 === "Assistant") {
		rt.setSv(f, "favoured_types", rt.list(T("/obj/item/clothing"), T("/obj/item/weapon")));
	} else if ($0 === "Captain" || $0 === "Head of Personnel") {
		rt.setSv(f, "favoured_types", rt.list(T("/obj/item/clothing"), T("/obj/item/weapon/stamp/captain"), T("/obj/item/weapon/disk/nuclear")));
	} else if ($0 === "Cook") {
		rt.setSv(f, "favoured_types", rt.list(T("/obj/item/weapon/reagent_containers/food"), T("/obj/item/weapon/kitchen")));
		rt.modSrcVar(f, "functions", "souschef", add);
		rt.setSv(f, "restrictedJob", 1);
	} else if ($0 === "Bartender") {
		rt.setSv(f, "favoured_types", rt.list(T("/obj/item/weapon/reagent_containers/food"), T("/obj/item/weapon/kitchen")));
		rt.modSrcVar(f, "functions", "bartend", add);
		rt.setSv(f, "restrictedJob", 1);
	} else if ($0 === "Station Engineer" || $0 === "Chief Engineer" || $0 === "Atmospheric Technician") {
		rt.setSv(f, "favoured_types", rt.list(T("/obj/item/stack"), T("/obj/item/weapon"), T("/obj/item/clothing")));
	} else if ($0 === "Chief Medical Officer" || $0 === "Medical Doctor" || $0 === "Chemist" || $0 === "Virologist" || $0 === "Geneticist") {
		rt.setSv(f, "favoured_types", rt.list(T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/storage/firstaid"), T("/obj/item/stack/medical"), T("/obj/item/weapon/reagent_containers/syringe")));
		rt.modSrcVar(f, "functions", "healpeople", add);
	} else if ($0 === "Research Director" || $0 === "Scientist" || $0 === "Roboticist") {
		rt.setSv(f, "favoured_types", rt.list(T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/stack"), T("/obj/item/weapon/reagent_containers")));
	} else if ($0 === "Head of Security" || $0 === "Warden" || $0 === "Security Officer" || $0 === "Detective") {
		rt.setSv(f, "favoured_types", rt.list(T("/obj/item/clothing"), T("/obj/item/weapon"), T("/obj/item/weapon/restraints")));
	} else if ($0 === "Janitor") {
		rt.setSv(f, "favoured_types", rt.list(T("/obj/item/weapon/mop"), T("/obj/item/weapon/reagent_containers/glass/bucket"), T("/obj/item/weapon/reagent_containers/spray/cleaner"), T("/obj/effect/decal/cleanable")));
		rt.modSrcVar(f, "functions", "dojanitor", add);
	} else if ($0 === "Clown") {
		rt.setSv(f, "favoured_types", rt.list(T("/obj/item/weapon/soap"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), T("/obj/item/weapon/grown/bananapeel")));
		rt.modSrcVar(f, "functions", "clowning", add);
	} else if ($0 === "Mime") {
		(rt.modSrcVar(f, "functions", "chatter", subtract));
	} else if ($0 === "Botanist") {
		rt.setSv(f, "favoured_types", rt.list(T("/obj/machinery/hydroponics"), T("/obj/item/weapon/reagent_containers"), T("/obj/item/weapon")));
		rt.modSrcVar(f, "functions", "botany", add);
		rt.setSv(f, "restrictedJob", 1);
	} else {
		rt.setSv(f, "favoured_types", rt.list(T("/obj/item/clothing")));
	}
	if (truthy(rt.bitAnd(rt.sv(f, "TRAITS"), 2))) {
		rt.setSv(f, "robustness", 75);
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "TRAITS"), 4))) {
			rt.setSv(f, "robustness", 25);
		}
	}
	if (truthy(rt.bitAnd(rt.sv(f, "TRAITS"), 8))) {
		rt.setSv(f, "smartness", 75);
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "TRAITS"), 16))) {
			(rt.modSrcVar(f, "disabilities", 256, rt.bitOr));
			rt.setSv(f, "smartness", 25);
		}
	}
	if (truthy(rt.bitAnd(rt.sv(f, "TRAITS"), 32))) {
		rt.setSv(f, "attitude", 75);
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "TRAITS"), 64))) {
			rt.setSv(f, "attitude", 1);
		}
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "TRAITS"), 128))) return f.dot;
	rt.setSv(f, "slyness", 75);
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/makeTraitor  (code/modules/mob/living/carbon/human/interactive.dm:346)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/makeTraitor", function* makeTraitor(f: Frame, inPers: Value) {
	let A: Value = null, S: Value = null, targetType: Value = null;
	let $0: any;
	f.vars = () => [inPers, A, S, targetType, $0];
	rt.setSv(f, "isTraitor", 1);
	rt.setSv(f, "traitorScale", add(add(rt.sv(f, "slyness"), rt.sv(f, "smartness")), (yield* g.call(f, P("/proc/rand"), null, [-10, 10]))));
	rt.setSv(f, "traitorType", live(inPers));
	$0 = rt.sv(f, "traitorType");
	if ($0 === 1) {
		rt.setSv(f, "traitorTarget", rt.op(f, "PickUnweighted", [1], [rt.gl("mob_list")]));
	} else if ($0 === 2) {
		A = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/objective_item/steal")])), T("/datum/objective_item/steal"))]);
		rt.setSv(f, "traitorTarget", rt.locateIn(f, rt.gv(f, "targetitem", (S = (yield* g.new_(f, live(A), [])))), rt.world()));
	} else if ($0 === 3) {
		rt.setSv(f, "traitorTarget", rt.locateIn(f, (targetType = rt.op(f, "PickUnweighted", [3], [T("/obj/machinery/gravity_generator/main/station"), T("/obj/machinery/power/smes/engineering"), T("/obj/machinery/telecomms/hub")])), rt.gl("machines")));
	} else if ($0 === 4) {
		rt.setSv(f, "traitorTarget", null);
	}
	rt.modSrcVar(f, "functions", "traitor", add);
	(rt.modSrcVar(f, "faction", "neutral", subtract));
	rt.modSrcVar(f, "faction", "hostile", add);
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/Initialize  (code/modules/mob/living/carbon/human/interactive.dm:367)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_species", T("/datum/species/synth"));
	yield* g.srcCall(f, "random");
	yield* g.srcCall(f, "doSetup");
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSnpcpool"), "processing", live(f.src), add);
	}
	yield* g.srcCall(f, "loadVoice");
	rt.modSrcVar(f, "robustness", (yield* g.call(f, P("/proc/rand"), null, [-10, 10])), add);
	rt.modSrcVar(f, "smartness", (yield* g.call(f, P("/proc/rand"), null, [-10, 10])), add);
	rt.modSrcVar(f, "attitude", (yield* g.call(f, P("/proc/rand"), null, [-10, 10])), add);
	rt.modSrcVar(f, "slyness", (yield* g.call(f, P("/proc/rand"), null, [-10, 10])), add);
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/Destroy  (code/modules/mob/living/carbon/human/interactive.dm:386)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.gl("SSnpcpool"), "stop_processing", [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/carbon/human/interactive/proc/retalTarget  (code/modules/mob/living/carbon/human/interactive.dm:390)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/retalTarget", function* retalTarget(f: Frame, target: Value) {
	let M: Value = null;
	f.vars = () => [target, M];
	M = live(target);
	if (!truthy(live(target))) return f.dot;
	if (!rt.gt(rt.sv(f, "health"), 0)) return f.dot;
	if (isEqual(rt.fv(f, "a_intent", live(M)), "help")) {
		yield* g.srcCall(f, "chatter");
	}
	if (!isEqual(rt.fv(f, "a_intent", live(M)), "harm")) return f.dot;
	rt.setSv(f, "retal", 1);
	rt.setSv(f, "retal_target", live(target));
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/hitby  (code/modules/mob/living/carbon/human/interactive.dm:402)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/hitby", function* hitby(f: Frame, AM: Value, skipcatch: Value, hitpush: Value, blocked: Value) {
	let C: Value = null;
	f.vars = () => [AM, skipcatch, hitpush, blocked, C];
	yield* g.callSuper(f, [live(AM), live(skipcatch), live(hitpush), live(blocked)]);
	if (!truthy((C = rt.locateIn(f, T("/mob/living/carbon"), (yield* g.call(f, P("/proc/view"), null, [16, live(f.src)])))))) return f.dot;
	yield* g.srcCall(f, "retalTarget", live(C));
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/attack_hand  (code/modules/mob/living/carbon/human/interactive.dm:408)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callSuper(f, [live(M)]);
	yield* g.srcCall(f, "retalTarget", live(M));
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/show_inv  (code/modules/mob/living/carbon/human/interactive.dm:412)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/show_inv", function* show_inv(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callSuper(f, [live(user)]);
	yield* g.srcCall(f, "retalTarget", live(user));
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/can_inject  (code/modules/mob/living/carbon/human/interactive.dm:416)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/can_inject", function* can_inject(f: Frame, user: Value, error_msg: Value, target_zone: Value, penetrate_thick: Value) {
	f.vars = () => [user, error_msg, target_zone, penetrate_thick];
	if (live(penetrate_thick) === null) {
		penetrate_thick = 0;
	}
	yield* g.callSuper(f, [live(user), live(error_msg), live(target_zone), live(penetrate_thick)]);
	yield* g.srcCall(f, "retalTarget", live(user));
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/doing2string  (code/modules/mob/living/carbon/human/interactive.dm:422)
rt.def("/mob/living/carbon/human/interactive/proc/doing2string", function doing2string(f: Frame, doin: Value) {
	let toReturn: Value = null;
	f.vars = () => [toReturn];
	toReturn = "";
	if (!truthy(live(doin))) {
		toReturn = "not doing anything";
	}
	if (truthy(rt.bitAnd(live(doin), 2))) {
		toReturn = rt.modify(live(toReturn), "interacting with something, ", add);
	}
	if (truthy(rt.bitAnd(live(doin), 8))) {
		toReturn = rt.modify(live(toReturn), "engaging in combat, ", add);
	}
	if (truthy(rt.bitAnd(live(doin), 4))) {
		toReturn = rt.modify(live(toReturn), "and going somewhere", add);
	}
	return live(toReturn);
});

// /mob/living/carbon/human/interactive/proc/interest2string  (code/modules/mob/living/carbon/human/interactive.dm:434)
rt.def("/mob/living/carbon/human/interactive/proc/interest2string", function interest2string(f: Frame, inter: Value) {
	let toReturn: Value = null;
	f.vars = () => [toReturn];
	toReturn = "Flatlined";
	if ((rt.ge(live(inter), 0) && rt.le(live(inter), 25))) {
		toReturn = "Very Bored";
	}
	if ((rt.ge(live(inter), 26) && rt.le(live(inter), 50))) {
		toReturn = "Bored";
	}
	if ((rt.ge(live(inter), 51) && rt.le(live(inter), 75))) {
		toReturn = "Content";
	}
	if (rt.ge(live(inter), 76)) {
		toReturn = "Excited";
	}
	return live(toReturn);
});

// /mob/living/carbon/human/interactive/proc/IsDeadOrIncap  (code/modules/mob/living/carbon/human/interactive.dm:447)
rt.def("/mob/living/carbon/human/interactive/proc/IsDeadOrIncap", function IsDeadOrIncap(f: Frame, checkDead: Value) {
	f.vars = () => [checkDead];
	if (live(checkDead) === null) {
		checkDead = 1;
	}
	if (!truthy(rt.sv(f, "canmove"))) {
		return 1;
	}
	if ((rt.le(rt.sv(f, "health"), 0) && truthy(live(checkDead)))) {
		return 1;
	}
	if (truthy(rt.callSrc(f, "restrained", []))) {
		return 1;
	}
	if (truthy(rt.callSrc(f, "IsUnconscious", []))) {
		return 1;
	}
	if (truthy(rt.callSrc(f, "IsStun", []))) {
		return 1;
	}
	if (truthy(rt.sv(f, "stat"))) {
		return 1;
	}
	if (rt.gt(rt.sv(f, "inactivity_period"), 0)) {
		return 1;
	}
	return 0;
});

// /mob/living/carbon/human/interactive/proc/enforce_hands  (code/modules/mob/living/carbon/human/interactive.dm:465)
rt.def("/mob/living/carbon/human/interactive/proc/enforce_hands", function enforce_hands(f: Frame) {
	let L: Value = null, R: Value = null;
	f.vars = () => [L, R];
	if (truthy(rt.sv(f, "main_hand"))) {
		if (!isEqual(rt.fv(f, "loc", rt.sv(f, "main_hand")), live(f.src))) {
			rt.setSv(f, "main_hand", null);
		}
	}
	if (truthy(rt.sv(f, "other_hand"))) {
		if (!isEqual(rt.fv(f, "loc", rt.sv(f, "other_hand")), live(f.src))) {
			rt.setSv(f, "other_hand", null);
		}
	}
	L = rt.callSrc(f, "get_item_for_held_index", [1]);
	R = rt.callSrc(f, "get_item_for_held_index", [2]);
	if (isEqual(rt.sv(f, "active_hand_index"), 1)) {
		if (!truthy(live(L))) {
			rt.setSv(f, "main_hand", null);
			if (truthy(live(R))) {
				rt.callSrc(f, "swap_hands", []);
			}
		}
	} else {
		if (truthy(live(R))) return f.dot;
		rt.setSv(f, "main_hand", null);
		if (!truthy(live(L))) return f.dot;
		rt.callSrc(f, "swap_hands", []);
	}
	return f.dot;
});

// /mob/living/carbon/human/interactive/proc/swap_hands  (code/modules/mob/living/carbon/human/interactive.dm:486)
rt.def("/mob/living/carbon/human/interactive/proc/swap_hands", function swap_hands(f: Frame) {
	let oindex: Value = null;
	f.vars = () => [oindex];
	oindex = rt.sv(f, "active_hand_index");
	if (isEqual(rt.sv(f, "active_hand_index"), 1)) {
		rt.setSv(f, "active_hand_index", 2);
	} else {
		rt.setSv(f, "active_hand_index", 1);
	}
	rt.setSv(f, "main_hand", rt.callSrc(f, "get_active_held_item", []));
	rt.setSv(f, "other_hand", rt.callSrc(f, "get_item_for_held_index", [live(oindex)]));
	rt.setSv(f, "update_hands", 1);
	return f.dot;
});

// /mob/living/carbon/human/interactive/proc/take_to_slot  (code/modules/mob/living/carbon/human/interactive.dm:496)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/take_to_slot", function* take_to_slot(f: Frame, G: Value, hands: Value) {
	let slots: Value = null;
	f.vars = () => [G, hands, slots];
	if (live(hands) === null) {
		hands = 0;
	}
	slots = rt.alist(f, ["left pocket", 15, "right pocket", 16, "left hand", 4, "right hand", 4]);
	if (truthy(live(hands))) {
		slots = rt.alist(f, ["left hand", 4, "right hand", 4]);
	}
	rt.setFv(f, "loc", live(G), live(f.src));
	if ((truthy(rt.fv(f, "force", live(G))) && rt.gt(rt.fv(f, "force", live(G)), rt.sv(f, "best_force")))) {
		rt.setSv(f, "best_force", rt.fv(f, "force", live(G)));
	}
	yield* g.srcCall(f, "equip_in_one_of_slots", live(G), live(slots));
	rt.setSv(f, "update_hands", 1);
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/insert_into_backpack  (code/modules/mob/living/carbon/human/interactive.dm:506)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/insert_into_backpack", function* insert_into_backpack(f: Frame) {
	let slots: Value = null, I: Value = null, BP: Value = null;
	f.vars = () => [slots, I, BP];
	slots = rt.alist(f, ["left pocket", 15, "right pocket", 16, "left hand", 4, "right hand", 4]);
	I = (yield* g.srcCall(f, "get_item_by_slot", rt.op(f, "PickUnweighted", [1], [live(slots)])));
	BP = (yield* g.srcCall(f, "get_item_by_slot", 1));
	if (((truthy(rt.sv(f, "back")) && truthy(live(BP))) && truthy(live(I)))) {
		if (truthy((yield* g.callName(f, live(BP), "can_be_inserted", [live(I), 0])))) {
			yield* g.callName(f, live(BP), "handle_item_insertion", [live(I), 0]);
		}
	} else {
		yield* g.srcCall(f, "dropItemToGround", live(I), 1);
	}
	rt.setSv(f, "update_hands", 1);
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/targetRange  (code/modules/mob/living/carbon/human/interactive.dm:517)
rt.def("/mob/living/carbon/human/interactive/proc/targetRange", function targetRange(f: Frame, towhere: Value) {
	return rt.call(f, P("/proc/get_dist"), null, [rt.getStep(f, live(towhere), 0), rt.getStep(f, live(f.src), 0)]);
});

// /mob/living/carbon/human/interactive/proc/InteractiveProcess  (code/modules/mob/living/carbon/human/interactive.dm:520)
rt.def("/mob/living/carbon/human/interactive/proc/InteractiveProcess", function InteractiveProcess(f: Frame) {
	if (isEqual(rt.fv(f, "current_state", rt.gl("SSticker")), 4)) {
		rt.callSrc(f, "saveVoice", []);
	}
	rt.callSrc(f, "doProcess", []);
	return f.dot;
});

// /mob/living/carbon/human/interactive/proc/death  (code/modules/mob/living/carbon/human/interactive.dm:525)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/death", function* death(f: Frame) {
	yield* g.srcCall(f, "saveVoice");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/Hear  (code/modules/mob/living/carbon/human/interactive.dm:529)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/Hear", function* Hear(f: Frame) {
	if (!isEqual(live(f.args[1]), live(f.src))) {
		(rt.modSrcVar(f, "knownStrings", (yield* g.call(f, P("/proc/html_decode"), null, [live(f.args[3])])), rt.bitOr));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["message", "speaker", "message_langs", "raw_message", "radio_freq", "spans", "message_mode"] });

// /mob/living/carbon/human/interactive/proc/doProcess  (code/modules/mob/living/carbon/human/interactive.dm:537)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/doProcess", function* doProcess(f: Frame) {
	let dir: Value = null, _T: Value = null, D: Value = null, AL: Value = null, l_hand: Value = null, r_hand: Value = null, Proc: Value = null, D_0: Value = null, W: Value = null, STR: Value = null, W_1: Value = null, choice: Value = null;
	let $0: any, $e: any;
	f.vars = () => [dir, _T, D, AL, l_hand, r_hand, Proc, D_0, W, STR, W_1, choice, $0, $e];
	if ((rt.lt(rt.sv(f, "interest"), 0) || rt.lt(rt.sv(f, "inactivity_period"), 0))) {
		if (rt.lt(rt.sv(f, "interest"), 0)) {
			rt.setSv(f, "interest", 0);
		}
		if (rt.lt(rt.sv(f, "inactivity_period"), 0)) {
			rt.setSv(f, "inactivity_period", 0);
		}
	}
	if (rt.gt(rt.sv(f, "interest"), rt.sv(f, "maxInterest"))) {
		rt.setSv(f, "interest", rt.sv(f, "maxInterest"));
	}
	dir = null;
	rt.forList(f, 0, rt.gl("alldirs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		dir = $e;
		if (truthy((_T = rt.getStep(f, live(f.src), live(dir))))) {
			D = null;
			rt.forList(f, 1, rt.fv(f, "contents", live(_T)), T("/obj/machinery/door"));
			while (($e = rt.next(f, 1)) !== undefined) {
				D = $e;
				if ((!truthy((rt.istype(live(D), T("/obj/machinery/door/poddoor")) ? 1 : 0)) && truthy(rt.fv(f, "density", live(D))))) {
					if (truthy((rt.istype(live(D), T("/obj/machinery/door/airlock")) ? 1 : 0))) {
						if (!truthy((yield* g.callName(f, (AL = live(D)), "CanAStarPass", [rt.sv(f, "RPID")])))) {
							rt.setSv(f, "inactivity_period", 20);
							rt.setFv(f, "panel_open", live(AL), 1);
							yield* g.callName(f, live(AL), "update_icon", []);
							yield* g.callName(f, live(AL), "shock", [live(f.src), divide(subtract(100, rt.sv(f, "smartness")), 2)]);
							yield* g.call(f, P("/proc/sleep"), null, [5]);
							if ((!truthy(live(AL)) || truthy(rt.fv(f, "gc_destroyed", live(AL))))) {
								return live(f.dot);
							}
							yield* g.callName(f, live(AL), "unbolt", []);
							if (!truthy((yield* g.callName(f, rt.fv(f, "wires", live(AL)), "is_cut", ["Bolts"])))) {
								yield* g.callName(f, rt.fv(f, "wires", live(AL)), "cut", ["Bolts"]);
							}
							if (!truthy((yield* g.callName(f, rt.fv(f, "wires", live(AL)), "is_cut", ["Main Power 1"])))) {
								yield* g.callName(f, rt.fv(f, "wires", live(AL)), "cut", ["Main Power 1"]);
							}
							if (!truthy((yield* g.callName(f, rt.fv(f, "wires", live(AL)), "is_cut", ["Main Power 2"])))) {
								yield* g.callName(f, rt.fv(f, "wires", live(AL)), "cut", ["Main Power 2"]);
							}
							yield* g.call(f, P("/proc/sleep"), null, [5]);
							if ((!truthy(live(AL)) || truthy(rt.fv(f, "gc_destroyed", live(AL))))) {
								return live(f.dot);
							}
							rt.setFv(f, "panel_open", live(AL), 0);
							yield* g.callName(f, live(AL), "update_icon", []);
							yield* g.callName(f, live(D), "open", [2]);
						} else {
							yield* g.callName(f, live(D), "open", []);
						}
					} else {
						yield* g.callName(f, live(D), "open", []);
					}
				}
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "update_hands"))) {
		l_hand = (yield* g.srcCall(f, "get_item_for_held_index", 1));
		r_hand = (yield* g.srcCall(f, "get_item_for_held_index", 2));
		if ((truthy(live(l_hand)) || truthy(live(r_hand)))) {
			if (truthy(live(l_hand))) {
				rt.setSv(f, "active_hand_index", 1);
				rt.setSv(f, "main_hand", live(l_hand));
				if (truthy(live(r_hand))) {
					rt.setSv(f, "other_hand", live(r_hand));
				}
			} else {
				if (truthy(live(r_hand))) {
					rt.setSv(f, "active_hand_index", 2);
					rt.setSv(f, "main_hand", live(r_hand));
					if (truthy(live(l_hand))) {
						rt.setSv(f, "other_hand", live(l_hand));
					}
				}
			}
			yield* g.srcCall(f, "update_icons");
		}
		rt.setSv(f, "update_hands", 0);
	}
	if (truthy(rt.sv(f, "pulledby"))) {
		if (truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "pulledby"))))) {
			rt.setSv(f, "a_intent", "disarm");
			yield* g.callName(f, rt.sv(f, "pulledby"), "attack_hand", [live(f.src)]);
			rt.setSv(f, "inactivity_period", 10);
		}
	}
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.srcCall(f, "resist");
		rt.setSv(f, "inactivity_period", 10);
	}
	Proc = null;
	rt.forList(f, 0, rt.sv(f, "functions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Proc = $e;
		if (!truthy((yield* g.srcCall(f, "IsDeadOrIncap")))) {
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), live(Proc)]);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "TARGET"))) {
		if (truthy((rt.isIn(f, rt.sv(f, "TARGET"), rt.sv(f, "blacklistItems")) ? 1 : 0))) {
			rt.setSv(f, "TARGET", null);
		}
	}
	if ((truthy(rt.sv(f, "TARGET")) && truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "TARGET")))))) {
		(rt.modSrcVar(f, "doing", 2, rt.bitOr));
		if (truthy((rt.istype(rt.sv(f, "TARGET"), T("/obj/machinery/door")) ? 1 : 0))) {
			if ((truthy((yield* g.callName(f, (D_0 = rt.sv(f, "TARGET")), "check_access", [rt.sv(f, "MYID")]))) && !truthy((rt.istype(live(D_0), T("/obj/machinery/door/poddoor")) ? 1 : 0)))) {
				rt.setSv(f, "inactivity_period", 10);
				yield* g.callName(f, live(D_0), "open", []);
				yield* g.srcCall(f, "tryWalk", (_T = rt.getStep(f, rt.getStep(f, rt.fv(f, "loc", live(D_0)), rt.sv(f, "dir")), rt.sv(f, "dir"))));
			}
		}
		if (truthy((rt.isIn(f, (!truthy(rt.sv(f, "TARGET")) ? 1 : 0), rt.sv(f, "blacklistItems")) ? 1 : 0))) {
			yield* g.srcCall(f, "insert_into_backpack");
			if (truthy((rt.istype(rt.sv(f, "TARGET"), T("/obj/item")) ? 1 : 0))) {
				if (truthy((rt.istype(rt.sv(f, "TARGET"), T("/obj/item/weapon")) ? 1 : 0))) {
					if ((rt.ge(rt.gv(f, "force", (W = rt.sv(f, "TARGET"))), rt.sv(f, "best_force")) || truthy(rt.op(f, "Prob", [], [67.5])))) {
						if ((!truthy((yield* g.srcCall(f, "get_item_for_held_index", 1))) || !truthy((yield* g.srcCall(f, "get_item_for_held_index", 2))))) {
							yield* g.srcCall(f, "put_in_hands", live(W));
						} else {
							yield* g.srcCall(f, "insert_into_backpack");
						}
					}
				} else {
					if ((!truthy((yield* g.srcCall(f, "get_item_for_held_index", 1))) || !truthy((yield* g.srcCall(f, "get_item_for_held_index", 2))))) {
						yield* g.srcCall(f, "put_in_hands", rt.sv(f, "TARGET"));
					} else {
						yield* g.srcCall(f, "insert_into_backpack");
					}
				}
			}
			if (truthy((rt.istype(rt.sv(f, "TARGET"), T("/obj/item/clothing")) ? 1 : 0))) {
				yield* g.srcCall(f, "drop_item");
				yield* g.srcCall(f, "dressup", rt.sv(f, "TARGET"));
				rt.setSv(f, "update_hands", 1);
				if (truthy((rt.isIn(f, (rt.isIn(f, rt.sv(f, "MYPDA"), (rt.fv(f, "loc", live(f.src)) || rt.sv(f, "MYID"))) ? 1 : 0), rt.fv(f, "loc", live(f.src))) ? 1 : 0))) {
					if (truthy((rt.isIn(f, rt.sv(f, "MYPDA"), rt.fv(f, "loc", live(f.src))) ? 1 : 0))) {
						yield* g.srcCall(f, "equip_to_appropriate_slot", rt.sv(f, "MYPDA"));
					}
					if (truthy((rt.isIn(f, rt.sv(f, "MYID"), rt.fv(f, "loc", live(f.src))) ? 1 : 0))) {
						yield* g.srcCall(f, "equip_to_appropriate_slot", rt.sv(f, "MYID"));
					}
				}
			}
		}
		if (truthy((rt.istype(rt.sv(f, "TARGET"), T("/obj/structure")) ? 1 : 0))) {
			STR = rt.sv(f, "TARGET");
			if (truthy(rt.sv(f, "main_hand"))) {
				W_1 = rt.sv(f, "main_hand");
				yield* g.callName(f, live(STR), "attackby", [live(W_1), live(f.src)]);
			} else {
				yield* g.callName(f, live(STR), "attack_hand", [live(f.src)]);
			}
		}
		rt.modSrcVar(f, "interest", rt.sv(f, "targetInterestShift"), add);
		rt.setSv(f, "doing", rt.bitAnd(rt.sv(f, "doing"), 16777213));
		rt.setSv(f, "timeout", 0);
		rt.setSv(f, "TARGET", null);
	} else {
		if (truthy(rt.sv(f, "TARGET"))) {
			yield* g.srcCall(f, "tryWalk", rt.sv(f, "TARGET"));
			rt.incSrcVar(f, "timeout", 1, true);
		}
	}
	if (isEqual(rt.sv(f, "doing"), 0)) {
		rt.incSrcVar(f, "interest", -1, true);
	} else {
		rt.incSrcVar(f, "interest", 1, true);
	}
	if (rt.gt(rt.sv(f, "inactivity_period"), 0)) {
		rt.incSrcVar(f, "inactivity_period", -1, true);
	}
	if ((rt.le(rt.sv(f, "interest"), 0) || rt.ge(rt.sv(f, "timeout"), 10))) {
		rt.setSv(f, "TARGET", null);
		rt.setSv(f, "doing", 0);
		rt.setSv(f, "timeout", 0);
		rt.setSv(f, "myPath", rt.list());
	}
	if (((!truthy(rt.sv(f, "doing")) && !truthy((yield* g.srcCall(f, "IsDeadOrIncap")))) && !truthy(rt.sv(f, "TARGET")))) {
		(rt.modSrcVar(f, "doing", 4, rt.bitOr));
		if ((!truthy(rt.sv(f, "isTraitor")) || !truthy(rt.sv(f, "traitorTarget")))) {
			$0 = (choice = (yield* g.call(f, P("/proc/rand"), null, [1, 50])));
			if (rt.inRange($0, 1, 30)) {
				rt.setSv(f, "TARGET", rt.locateIn(f, T("/obj/item"), (yield* g.srcCall(f, "favouredObjIn", (yield* g.call(f, P("/proc/oview"), null, [16, live(f.src)]))))));
			} else if (rt.inRange($0, 31, 40)) {
				rt.setSv(f, "TARGET", (yield* g.call(f, P("/proc/safepick"), null, [(yield* g.call(f, P("/proc/get_area_turfs"), null, [(yield* g.srcCall(f, "job2area", rt.sv(f, "myjob")))]))])));
			} else if (rt.inRange($0, 41, 45)) {
				rt.setSv(f, "TARGET", rt.op(f, "PickUnweighted", [1], [(yield* g.srcCall(f, "target_filter", (yield* g.srcCall(f, "favouredObjIn", (yield* g.call(f, P("/proc/urange"), null, [32, live(f.src), 1]))))))]));
			} else if (rt.inRange($0, 46, 50)) {
				rt.setSv(f, "TARGET", rt.op(f, "PickUnweighted", [1], [(yield* g.srcCall(f, "target_filter", (yield* g.call(f, P("/proc/oview"), null, [16, live(f.src)]))))]));
			}
		} else {
			if ((truthy(rt.sv(f, "isTraitor")) && truthy(rt.sv(f, "traitorTarget")))) {
				rt.setSv(f, "TARGET", rt.sv(f, "traitorTarget"));
			}
		}
		yield* g.srcCall(f, "tryWalk", rt.sv(f, "TARGET"));
	}
	rt.setSv(f, "LAST_TARGET", rt.sv(f, "TARGET"));
	return f.dot;
}, true, { waitfor: false });

// /mob/living/carbon/human/interactive/proc/dressup  (code/modules/mob/living/carbon/human/interactive.dm:713)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/dressup", function* dressup(f: Frame, C: Value) {
	let I: Value = null;
	f.vars = () => [C, I];
	rt.setSv(f, "inactivity_period", 12);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	if (!(!(!truthy(live(C)) || truthy(rt.fv(f, "gc_destroyed", live(C)))) && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) return f.dot;
	yield* g.srcCall(f, "take_to_slot", live(C), 1);
	if (truthy((yield* g.srcCall(f, "equip_to_appropriate_slot", live(C))))) return f.dot;
	yield* g.srcCall(f, "dropItemToGround", (I = (yield* g.srcCall(f, "get_item_by_slot", live(C)))));
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	if (!(!(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) && !(!truthy(live(C)) || truthy(rt.fv(f, "gc_destroyed", live(C)))))) return f.dot;
	yield* g.srcCall(f, "equip_to_appropriate_slot", live(C));
	return f.dot;
}, true, { waitfor: false });

// /mob/living/carbon/human/interactive/proc/favouredObjIn  (code/modules/mob/living/carbon/human/interactive.dm:724)
rt.def("/mob/living/carbon/human/interactive/proc/favouredObjIn", function favouredObjIn(f: Frame, inList: Value) {
	let outList: Value = null, i: Value = null, path: Value = null;
	let $e: any;
	f.vars = () => [outList, i, path, $e];
	outList = rt.list();
	i = null;
	rt.forList(f, 0, live(inList));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		path = null;
		rt.forList(f, 1, rt.sv(f, "favoured_types"));
		while (($e = rt.next(f, 1)) !== undefined) {
			path = $e;
			if (truthy(rt.call(f, P("/proc/ispath"), null, [live(i), live(path)]))) {
				outList = rt.modify(live(outList), live(i), add);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	if (rt.le(rt.len(f, live(outList)), 0)) {
		outList = live(inList);
	}
	return live(outList);
});

// /mob/living/carbon/human/interactive/proc/tryWalk  (code/modules/mob/living/carbon/human/interactive.dm:734)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/tryWalk", function* tryWalk(f: Frame, inTarget: Value, override: Value) {
	f.vars = () => [inTarget, override];
	if (live(override) === null) {
		override = 0;
	}
	if ((truthy(rt.sv(f, "restrictedJob")) && !truthy(live(override)))) {
		if (!truthy((rt.isIn(f, rt.getStep(f, live(inTarget), 0), (yield* g.call(f, P("/proc/get_area_turfs"), null, [(yield* g.srcCall(f, "job2area", rt.sv(f, "myjob")))]))) ? 1 : 0))) {
			rt.setSv(f, "TARGET", null);
			return live(f.dot);
		}
	}
	if (!truthy((yield* g.srcCall(f, "IsDeadOrIncap")))) {
		if (!truthy((yield* g.srcCall(f, "walk2derpless", live(inTarget))))) {
			rt.incSrcVar(f, "timeout", 1, true);
		}
	} else {
		rt.incSrcVar(f, "timeout", 1, true);
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/getGoodPath  (code/modules/mob/living/carbon/human/interactive.dm:747)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/getGoodPath", function* getGoodPath(f: Frame, target: Value, maxtries: Value) {
	let end: Value = null, current: Value = null, path: Value = null, tries: Value = null, shortest: Value = null, _T: Value = null, foundDense: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [target, maxtries, end, current, path, tries, shortest, _T, foundDense, A, $e];
	if (live(maxtries) === null) {
		maxtries = 512;
	}
	end = rt.getStep(f, live(target), 0);
	current = rt.getStep(f, live(f.src), 0);
	path = rt.list();
	tries = 0;
	while (!isEqual(live(current), live(end)) && rt.lt(live(tries), live(maxtries))) {
		shortest = live(current);
		_T = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [live(current), 1])), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			foundDense = 0;
			A = null;
			rt.forList(f, 1, live(_T), T("/atom"));
			while (($e = rt.next(f, 1)) !== undefined) {
				A = $e;
				if (truthy(rt.fv(f, "density", live(A)))) {
					foundDense = 1;
				}
				yield* g.call(f, P("/proc/sleep"), null, [-1]);
			}
			rt.endFor(f, 1);
			if ((isEqual(rt.fv(f, "density", live(_T)), 0) && !truthy(live(foundDense)))) {
				if (rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [live(_T), live(target)])), (yield* g.call(f, P("/proc/get_dist"), null, [live(shortest), live(target)])))) {
					shortest = live(_T);
				} else {
					tries = rt.inc(live(tries), 1);
				}
			} else {
				tries = rt.inc(live(tries), 1);
			}
			yield* g.call(f, P("/proc/sleep"), null, [-1]);
		}
		rt.endFor(f, 0);
		current = live(shortest);
		path = rt.modify(live(path), live(shortest), add);
		yield* g.call(f, P("/proc/sleep"), null, [-1]);
	}
	return live(path);
}, true);

// /mob/living/carbon/human/interactive/proc/walk2derpless  (code/modules/mob/living/carbon/human/interactive.dm:773)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/walk2derpless", function* walk2derpless(f: Frame, target: Value) {
	let spark_system: Value = null, i: Value = null;
	f.vars = () => [target, spark_system, i];
	if (!truthy(live(target))) {
		return 0;
	}
	if (truthy(rt.sv(f, "walkdebug"))) {
		yield* g.callName(f, (spark_system = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [5, 0, live(target)]);
		yield* g.callName(f, live(spark_system), "attach", [live(target)]);
		yield* g.callName(f, live(spark_system), "start", []);
	}
	if (rt.le(rt.len(f, rt.sv(f, "myPath")), 0)) {
		rt.setSv(f, "myPath", (yield* g.call(f, P("/proc/get_path_to"), null, [null, live(f.src), null, rt.getStep(f, live(target), 0), null, P("/turf/proc/Distance"), null, 33, null, 250, null, 1, "id", rt.sv(f, "Path_ID")], rt.Args.Named)));
	}
	if (truthy(rt.sv(f, "myPath"))) {
		if (rt.gt(rt.len(f, rt.sv(f, "myPath")), 0)) {
			rt.setSv(f, "doing", rt.bitAnd(rt.sv(f, "doing"), 16777211));
			i = null;
			i = 0;
			while (rt.lt(live(i), rt.sv(f, "maxStepsTick"))) {
				if (!truthy((yield* g.srcCall(f, "IsDeadOrIncap")))) {
					if (rt.ge(rt.len(f, rt.sv(f, "myPath")), 1)) {
						yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), rt.index(rt.sv(f, "myPath"), 1), 0, 5]);
						(rt.modSrcVar(f, "myPath", rt.index(rt.sv(f, "myPath"), 1), subtract));
					}
				}
				i = rt.inc(live(i), 1);
				yield* g.call(f, P("/proc/sleep"), null, [-1]);
			}
			return 1;
		}
	}
	return 0;
}, true);

// /mob/living/carbon/human/interactive/proc/job2area  (code/modules/mob/living/carbon/human/interactive.dm:798)
rt.def("/mob/living/carbon/human/interactive/proc/job2area", function job2area(f: Frame, target: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (isEqual(rt.gv(f, "title", (_T = live(target))), "Assistant")) {
		return T("/area/hallway/primary");
	}
	if ((isEqual(rt.fv(f, "title", live(_T)), "Captain") || isEqual(rt.fv(f, "title", live(_T)), "Head of Personnel"))) {
		return T("/area/bridge");
	}
	if (isEqual(rt.fv(f, "title", live(_T)), "Bartender")) {
		return T("/area/crew_quarters/bar");
	}
	if (isEqual(rt.fv(f, "title", live(_T)), "Cook")) {
		return T("/area/crew_quarters/kitchen");
	}
	if (((isEqual(rt.fv(f, "title", live(_T)), "Station Engineer") || isEqual(rt.fv(f, "title", live(_T)), "Chief Engineer")) || isEqual(rt.fv(f, "title", live(_T)), "Atmospheric Technician"))) {
		return T("/area/engine");
	}
	if (((((isEqual(rt.fv(f, "title", live(_T)), "Chief Medical Officer") || isEqual(rt.fv(f, "title", live(_T)), "Medical Doctor")) || isEqual(rt.fv(f, "title", live(_T)), "Chemist")) || isEqual(rt.fv(f, "title", live(_T)), "Virologist")) || isEqual(rt.fv(f, "title", live(_T)), "Geneticist"))) {
		return T("/area/medical");
	}
	if (((isEqual(rt.fv(f, "title", live(_T)), "Research Director") || isEqual(rt.fv(f, "title", live(_T)), "Scientist")) || isEqual(rt.fv(f, "title", live(_T)), "Roboticist"))) {
		return T("/area/science");
	}
	if ((((isEqual(rt.fv(f, "title", live(_T)), "Head of Security") || isEqual(rt.fv(f, "title", live(_T)), "Warden")) || isEqual(rt.fv(f, "title", live(_T)), "Security Officer")) || isEqual(rt.fv(f, "title", live(_T)), "Detective"))) {
		return T("/area/security");
	}
	if (isEqual(rt.fv(f, "title", live(_T)), "Botanist")) {
		return T("/area/hydroponics");
	}
	return rt.op(f, "PickUnweighted", [2], [T("/area/hallway"), T("/area/crew_quarters/locker")]);
});

// /mob/living/carbon/human/interactive/proc/target_filter  (code/modules/mob/living/carbon/human/interactive.dm:821)
rt.def("/mob/living/carbon/human/interactive/proc/target_filter", function target_filter(f: Frame, target: Value) {
	let filtered_targets: Value = null, L: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [filtered_targets, L, A, $e];
	filtered_targets = rt.list(T("/area"), T("/turf"), T("/obj/machinery/door"), T("/atom/movable/light"), T("/obj/structure/cable"), T("/obj/machinery/atmospherics"));
	L = live(target);
	A = null;
	rt.forList(f, 0, live(target), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy(rt.call(f, P("/proc/is_type_in_list"), null, [live(A), live(filtered_targets)]))) {
			(L = rt.modify(live(L), live(A), subtract));
		}
	}
	rt.endFor(f, 0);
	return live(L);
});

// /mob/living/carbon/human/interactive/proc/shouldModulePass  (code/modules/mob/living/carbon/human/interactive.dm:829)
rt.def("/mob/living/carbon/human/interactive/proc/shouldModulePass", function shouldModulePass(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "doing"), 8))) {
		return 1;
	}
	if (truthy(rt.sv(f, "retal"))) {
		return 1;
	}
	return 0;
});

// /mob/living/carbon/human/interactive/proc/chatter  (code/modules/mob/living/carbon/human/interactive.dm:837)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/chatter", function* chatter(f: Frame, obj: Value) {
	let verbs_use: Value = null, verbs_touch: Value = null, verbs_move: Value = null, nouns_insult: Value = null, nouns_generic: Value = null, nouns_objects: Value = null, nouns_body: Value = null, adjective_insult: Value = null, adjective_objects: Value = null, adjective_generic: Value = null, curse_words: Value = null, chatmsg: Value = null, what: Value = null, toSay: Value = null, i: Value = null;
	let $0: any;
	f.vars = () => [obj, verbs_use, verbs_touch, verbs_move, nouns_insult, nouns_generic, nouns_objects, nouns_body, adjective_insult, adjective_objects, adjective_generic, curse_words, chatmsg, what, toSay, i, $0];
	verbs_use = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/strings"), null, ["npc_chatter.json", "verbs_use"]))]);
	verbs_touch = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/strings"), null, ["npc_chatter.json", "verbs_touch"]))]);
	verbs_move = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/strings"), null, ["npc_chatter.json", "verbs_move"]))]);
	nouns_insult = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/strings"), null, ["npc_chatter.json", "nouns_insult"]))]);
	nouns_generic = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/strings"), null, ["npc_chatter.json", "nouns_generic"]))]);
	nouns_objects = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/strings"), null, ["npc_chatter.json", "nouns_objects"]))]);
	nouns_body = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/strings"), null, ["npc_chatter.json", "nouns_body"]))]);
	adjective_insult = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/strings"), null, ["npc_chatter.json", "adjective_insult"]))]);
	adjective_objects = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/strings"), null, ["npc_chatter.json", "adjective_objects"]))]);
	adjective_generic = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/strings"), null, ["npc_chatter.json", "adjective_generic"]))]);
	curse_words = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/strings"), null, ["npc_chatter.json", "curse_words"]))]);
	chatmsg = "";
	if (truthy(rt.op(f, "Prob", [], [10]))) {
		chatmsg = ";";
	}
	if ((truthy(rt.op(f, "Prob", [], [rt.sv(f, "chattyness")])) || rt.lt(rt.len(f, rt.sv(f, "knownStrings")), 10))) {
		if (truthy(rt.bitAnd(rt.sv(f, "doing"), 2))) {
			if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "chattyness")]))) {
				chatmsg = rt.modify(live(chatmsg), rt.op(f, "PickUnweighted", [3], [fmt("This ＀ is a little ＀.", [live(nouns_objects), live(adjective_objects)]), fmt("Well ＀ my ＀, this ＀ is pretty ＀.", [live(verbs_use), live(nouns_body), live(nouns_insult), live(adjective_insult)]), fmt("＀, what am I meant to do with this ＀ ＀.", [(yield* g.call(f, P("/proc/capitalize"), null, [live(curse_words)])), live(adjective_insult), live(nouns_objects)])]), add);
			}
		} else {
			if (truthy(rt.bitAnd(rt.sv(f, "doing"), 4))) {
				if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "chattyness")]))) {
					chatmsg = rt.modify(live(chatmsg), rt.op(f, "PickUnweighted", [3], [fmt("Oh ＀, ＀!", [live(curse_words), live(verbs_move)]), fmt("Time to get my ＀ ＀ ＀ elsewhere.", [live(adjective_generic), live(adjective_insult), live(nouns_body)]), fmt("I wonder if there is anything to ＀ and ＀ somewhere else..", [live(verbs_use), live(verbs_touch)])]), add);
				}
			} else {
				if (truthy(rt.bitAnd(rt.sv(f, "doing"), 8))) {
					if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "chattyness")]))) {
						chatmsg = rt.modify(live(chatmsg), rt.op(f, "PickUnweighted", [3], [fmt("I'm going to ＀ you, you ＀ ＀!", [live(verbs_use), live(adjective_insult), live(nouns_insult)]), fmt("Rend and ＀, rend and ＀!", [live(verbs_touch), live(verbs_use)]), fmt("You ＀, I'm going to ＀ you right in the ＀. JUST YOU WAIT!", [live(nouns_insult), live(verbs_use), live(nouns_body)])]), add);
					}
				}
			}
		}
		if (truthy(rt.op(f, "Prob", [], [divide(rt.sv(f, "chattyness"), 2)]))) {
			chatmsg = ";";
			$0 = (what = rt.op(f, "PickUnweighted", [5], [1, 2, 3, 4, 5]));
			if ($0 === 1) {
				chatmsg = rt.modify(live(chatmsg), fmt("Well ＀, this is a ＀ situation.", [live(curse_words), live(adjective_generic)]), add);
			} else if ($0 === 2) {
				chatmsg = rt.modify(live(chatmsg), fmt("Oh ＀, that ＀ was one hell of an ＀ ＀.", [live(curse_words), live(nouns_insult), live(adjective_insult), live(nouns_body)]), add);
			} else if ($0 === 3) {
				chatmsg = rt.modify(live(chatmsg), fmt("I want to ＀ that ＀ when I find them.", [live(verbs_use), live(nouns_insult)]), add);
			} else if ($0 === 4) {
				chatmsg = rt.modify(live(chatmsg), fmt("＀ until proven ＀!", [rt.op(f, "PickUnweighted", [4], ["Innocent", "Guilty", "Traitorous", "Honk"]), live(adjective_generic)]), add);
			} else if ($0 === 5) {
				toSay = "";
				i = null;
				i = 0;
				while (rt.lt(live(i), 5)) {
					toSay = rt.modify(live(toSay), fmt("＀ ", [(curse_words = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/strings"), null, ["npc_chatter.json", "curse_words"]))]))]), add);
					i = rt.inc(live(i), 1);
				}
				chatmsg = rt.modify(live(chatmsg), fmt("Hey ＀, why dont you go ＀, you ＀!", [live(nouns_generic), live(toSay), live(nouns_insult)]), add);
			}
		}
	} else {
		if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "chattyness")]))) {
			chatmsg = rt.modify(live(chatmsg), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "knownStrings")]), add);
			if (truthy(rt.op(f, "Prob", [], [25]))) {
				(rt.modSrcVar(f, "knownStrings", rt.op(f, "PickUnweighted", [1], [live(chatmsg)]), subtract));
			}
		}
	}
	if (!(!isEqual(live(chatmsg), ";") && !isEqual(live(chatmsg), ""))) return f.dot;
	yield* g.callName(f, live(f.src), "say", [live(chatmsg)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/getAllContents  (code/modules/mob/living/carbon/human/interactive.dm:898)
rt.def("/mob/living/carbon/human/interactive/proc/getAllContents", function getAllContents(f: Frame) {
	let allContents: Value = null, A: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [allContents, A, B, $e];
	allContents = rt.list();
	A = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		allContents = rt.modify(live(allContents), live(A), add);
		if (rt.gt(rt.getLen(f, rt.fv(f, "contents", live(A))), 0)) {
			B = null;
			rt.forList(f, 1, live(A), T("/atom"));
			while (($e = rt.next(f, 1)) !== undefined) {
				B = $e;
				allContents = rt.modify(live(allContents), live(B), add);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return live(allContents);
});

// /mob/living/carbon/human/interactive/proc/enforceHome  (code/modules/mob/living/carbon/human/interactive.dm:907)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/enforceHome", function* enforceHome(f: Frame) {
	let validHome: Value = null, tcheck: Value = null;
	f.vars = () => [validHome, tcheck];
	validHome = (yield* g.call(f, P("/proc/get_area_turfs"), null, [(yield* g.srcCall(f, "job2area", rt.sv(f, "myjob")))]));
	if (truthy(rt.sv(f, "TARGET"))) {
		if (truthy((tcheck = rt.sv(f, "TARGET")))) {
			if (!truthy((rt.isIn(f, rt.getStep(f, live(tcheck), 0), live(validHome)) ? 1 : 0))) {
				rt.setSv(f, "TARGET", null);
				return 1;
			}
		}
	}
	if (!truthy((rt.isIn(f, rt.getStep(f, live(f.src), 0), live(validHome)) ? 1 : 0))) {
		yield* g.srcCall(f, "tryWalk", rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/get_area_turfs"), null, [(yield* g.srcCall(f, "job2area", rt.sv(f, "myjob")))]))]));
		return 1;
	}
	return 0;
}, true);

// /mob/living/carbon/human/interactive/proc/npcDrop  (code/modules/mob/living/carbon/human/interactive.dm:923)
rt.def("/mob/living/carbon/human/interactive/proc/npcDrop", function npcDrop(f: Frame, A: Value, blacklist: Value) {
	f.vars = () => [blacklist];
	if (live(blacklist) === null) {
		blacklist = 0;
	}
	if (truthy(live(blacklist))) {
		rt.modSrcVar(f, "blacklistItems", live(A), add);
	}
	rt.setFv(f, "loc", live(A), rt.getStep(f, live(f.src), 0));
	rt.callSrc(f, "enforce_hands", []);
	rt.callSrc(f, "update_icons", []);
	return f.dot;
});

// /mob/living/carbon/human/interactive/proc/traitor  (code/modules/mob/living/carbon/human/interactive.dm:930)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/traitor", function* traitor(f: Frame, obj: Value) {
	let M: Value = null, I: Value = null, choice: Value = null;
	let $0: any;
	f.vars = () => [obj, M, I, choice, $0];
	if (isEqual(rt.sv(f, "traitorType"), 4)) {
		rt.setSv(f, "traitorTarget", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "nearby")]));
	}
	if (!truthy(rt.op(f, "Prob", [], [rt.sv(f, "traitorScale")]))) return f.dot;
	if ((!truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "traitorTarget")))) && !isEqual(rt.sv(f, "traitorType"), 4))) {
		yield* g.srcCall(f, "tryWalk", rt.getStep(f, rt.sv(f, "traitorTarget"), 0));
	} else {
		$0 = rt.sv(f, "traitorType");
		if ($0 === 1) {
			rt.setSv(f, "retal", 1);
			rt.setSv(f, "retal_target", rt.sv(f, "traitorTarget"));
		} else if ($0 === 2) {
			if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "traitorTarget")])))) {
				if (!truthy(rt.gv(f, "stat", (M = rt.sv(f, "traitorTarget"))))) {
					rt.setSv(f, "retal", 1);
					rt.setSv(f, "retal_target", rt.sv(f, "traitorTarget"));
				} else {
					rt.setFv(f, "loc", (I = rt.sv(f, "traitorTarget")), rt.getStep(f, rt.sv(f, "traitorTarget"), 0));
				}
			} else {
				yield* g.srcCall(f, "take_to_slot", rt.sv(f, "traitorTarget"));
			}
		} else if ($0 === 3) {
			yield* g.srcCall(f, "customEmote", fmt("＀'s chest opens up, revealing a large mass of explosives and tangled wires!", [live(f.src)]));
			if (rt.le(rt.sv(f, "inactivity_period"), 0)) {
				rt.setSv(f, "inactivity_period", 9999);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.src), null, 60, "target", rt.sv(f, "traitorTarget")], rt.Args.Named)))) {
					yield* g.srcCall(f, "customEmote", fmt("A fire bursts from ＀'s eyes, igniting white hot and consuming their body in a flaming explosion!", [live(f.src)]));
					yield* g.call(f, P("/proc/explosion"), null, [live(f.src), 6, 6, 6]);
				} else {
					rt.setSv(f, "inactivity_period", 0);
					yield* g.srcCall(f, "customEmote", fmt("＀'s chest closes, hiding their insides.", [live(f.src)]));
				}
			}
		} else if ($0 === 4) {
			choice = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/grenade/chem_grenade")])), T("/obj/item/weapon/grenade/chem_grenade"))]);
			yield* g.new_(f, live(choice), [live(f.src)]);
			rt.setSv(f, "retal", 1);
			rt.setSv(f, "retal_target", rt.sv(f, "traitorTarget"));
		}
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/botany  (code/modules/mob/living/carbon/human/interactive.dm:971)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/botany", function* botany(f: Frame, obj: Value) {
	let allContents: Value = null, internalBeaker: Value = null, internalBag: Value = null, HP: Value = null, considered: Value = null, tester: Value = null, index: Value = null, A: Value = null, seedType: Value = null, SEED: Value = null, change: Value = null, GF: Value = null, SF: Value = null, toLoad: Value = null;
	let $e: any;
	f.vars = () => [obj, allContents, internalBeaker, internalBag, HP, considered, tester, index, A, seedType, SEED, change, GF, SF, toLoad, $e];
	if (truthy((yield* g.srcCall(f, "shouldModulePass")))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "enforceHome")))) {
		return live(f.dot);
	}
	allContents = (yield* g.srcCall(f, "getAllContents"));
	internalBeaker = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), live(allContents));
	if (!truthy((internalBag = rt.locateIn(f, T("/obj/item/weapon/storage/bag/plants"), live(allContents))))) {
		internalBag = (yield* g.new_(f, T("/obj/item/weapon/storage/bag/plants"), [live(f.src)]));
	}
	if (!truthy(live(internalBeaker))) {
		rt.setFv(f, "name", (internalBeaker = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), [live(f.src)]))), "Grow-U-All Super Spray");
	}
	if (!(truthy(live(internalBeaker)) && truthy(live(internalBag)))) return f.dot;
	HP = null;
	considered = rt.list();
	tester = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [12, live(f.src)])), T("/obj/machinery/hydroponics"));
	while (($e = rt.next(f, 0)) !== undefined) {
		tester = $e;
		rt.setAt(live(considered), live(tester), 1);
		if (!truthy(rt.fv(f, "myseed", live(tester)))) {
			rt.modAt(live(considered), live(tester), 50, add);
		}
		if (rt.gt(rt.fv(f, "weedlevel", live(tester)), 0)) {
			rt.modAt(live(considered), live(tester), 5, add);
		}
		if (rt.gt(rt.fv(f, "pestlevel", live(tester)), 0)) {
			rt.modAt(live(considered), live(tester), 5, add);
		}
		if (rt.lt(rt.fv(f, "nutrilevel", live(tester)), rt.fv(f, "maxnutri", live(tester)))) {
			rt.modAt(live(considered), live(tester), 15, add);
		}
		if (rt.lt(rt.fv(f, "waterlevel", live(tester)), rt.fv(f, "maxwater", live(tester)))) {
			rt.modAt(live(considered), live(tester), 15, add);
		}
		if ((truthy(rt.fv(f, "harvest", live(tester))) || truthy(rt.fv(f, "dead", live(tester))))) {
			rt.modAt(live(considered), live(tester), 100, add);
		}
		rt.setAt(live(considered), live(tester), (yield* g.call(f, P("/proc/max"), null, [1, subtract(rt.index(live(considered), live(tester)), (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(tester)])))])));
	}
	rt.endFor(f, 0);
	index = 0;
	A = null;
	rt.forList(f, 0, live(considered));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		index = rt.inc(live(index), 1);
		if ((rt.gt(rt.index(live(considered), live(A)), rt.index(live(considered), live(HP))) || !truthy(live(HP)))) {
			HP = rt.index(live(considered), live(index));
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(HP))) {
		rt.setSv(f, "TARGET", live(HP));
		if (!truthy((yield* g.srcCall(f, "Adjacent", live(HP))))) {
			yield* g.srcCall(f, "tryWalk", rt.getStep(f, live(HP), 0));
		} else {
			if ((truthy(rt.fv(f, "harvest", live(HP))) || truthy(rt.fv(f, "dead", live(HP))))) {
				yield* g.callName(f, live(HP), "attack_hand", [live(f.src)]);
			} else {
				if (!truthy(rt.fv(f, "myseed", live(HP)))) {
					seedType = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/seeds")])), T("/obj/item/seeds"))]);
					SEED = (yield* g.new_(f, live(seedType), [live(f.src)]));
					yield* g.srcCall(f, "customEmote", fmt("＀ ＀ towards ＀, producing a ＀!", [live(f.src), rt.op(f, "PickUnweighted", [5], ["gibbers", "drools", "slobbers", "claps wildly", "spits"]), rt.sv(f, "TARGET"), live(SEED)]));
					yield* g.callName(f, live(HP), "attackby", [live(SEED), live(f.src)]);
				} else {
					change = 0;
					if (rt.gt(rt.fv(f, "weedlevel", live(HP)), 0)) {
						change = 1;
						if (!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(internalBeaker)), "has_reagent", ["weedkiller", 10])))) {
							yield* g.callName(f, rt.fv(f, "reagents", live(internalBeaker)), "add_reagent", ["weedkiller", 10]);
						}
					}
					if (rt.gt(rt.fv(f, "pestlevel", live(HP)), 0)) {
						change = 1;
						if (!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(internalBeaker)), "has_reagent", ["pestkiller", 10])))) {
							yield* g.callName(f, rt.fv(f, "reagents", live(internalBeaker)), "add_reagent", ["pestkiller", 10]);
						}
					}
					if (rt.lt(rt.fv(f, "nutrilevel", live(HP)), rt.fv(f, "maxnutri", live(HP)))) {
						change = 1;
						if (!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(internalBeaker)), "has_reagent", ["eznutriment", 15])))) {
							yield* g.callName(f, rt.fv(f, "reagents", live(internalBeaker)), "add_reagent", ["eznutriment", 15]);
						}
						if (!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(internalBeaker)), "has_reagent", ["diethylamine", 15])))) {
							yield* g.callName(f, rt.fv(f, "reagents", live(internalBeaker)), "add_reagent", ["diethylamine", 15]);
						}
					}
					if (rt.lt(rt.fv(f, "waterlevel", live(HP)), rt.fv(f, "maxwater", live(HP)))) {
						change = 1;
						if (!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(internalBeaker)), "has_reagent", ["holywater", 50])))) {
							yield* g.callName(f, rt.fv(f, "reagents", live(internalBeaker)), "add_reagent", ["holywater", 50]);
						}
					}
					if (truthy(live(change))) {
						yield* g.callName(f, live(HP), "attackby", [live(internalBeaker), live(f.src)]);
					}
				}
			}
		}
	}
	if (truthy((GF = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown"), (yield* g.call(f, P("/proc/view"), null, [12, live(f.src)])))))) {
		if (!truthy((yield* g.srcCall(f, "Adjacent", live(GF))))) {
			yield* g.srcCall(f, "tryWalk", rt.getStep(f, live(GF), 0));
		} else {
			yield* g.callName(f, live(GF), "attackby", [live(internalBag), live(f.src)]);
		}
	}
	if (!rt.gt(rt.getLen(f, rt.fv(f, "contents", live(internalBag))), 0)) return f.dot;
	if (!truthy((yield* g.srcCall(f, "Adjacent", (SF = rt.locateIn(f, T("/obj/machinery/smartfridge"), (yield* g.call(f, P("/proc/range"), null, [12, live(f.src)])))))))) {
		yield* g.srcCall(f, "tryWalk", rt.getStep(f, live(SF), 0), 1);
	} else {
		yield* g.srcCall(f, "customEmote", fmt("＀ ＀, upending the ＀'s contents all over the ＀!", [live(f.src), rt.op(f, "PickUnweighted", [5], ["gibbers", "drools", "slobbers", "claps wildly", "spits"]), live(internalBag), live(SF)]));
		toLoad = null;
		rt.forList(f, 0, rt.fv(f, "contents", live(internalBag)), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			toLoad = $e;
			if (rt.ge(rt.len(f, rt.sv(f, "contents")), rt.fv(f, "max_n_of_items", live(SF)))) {
				break;
			}
			if (truthy((yield* g.callName(f, live(SF), "accept_check", [live(toLoad)])))) {
				yield* g.callName(f, live(SF), "load", [live(toLoad)]);
			} else {
				yield* g.call(f, P("/proc/qdel"), null, [live(toLoad)]);
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/bartend  (code/modules/mob/living/carbon/human/interactive.dm:1075)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/bartend", function* bartend(f: Frame, obj: Value) {
	let rangeCheck: Value = null, RT: Value = null, serveTarget: Value = null, H: Value = null, drinkChoice: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [obj, rangeCheck, RT, serveTarget, H, drinkChoice, D, $e];
	if (truthy((yield* g.srcCall(f, "shouldModulePass")))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "enforceHome")))) {
		return live(f.dot);
	}
	rangeCheck = (yield* g.call(f, P("/proc/oview"), null, [6, live(f.src)]));
	RT = null;
	serveTarget = null;
	H = null;
	rt.forList(f, 0, live(rangeCheck), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (!truthy(rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/drinks"), (yield* g.call(f, P("/proc/orange"), null, [1, live(H)]))))) {
			serveTarget = live(H);
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(serveTarget))) {
		RT = rt.locateIn(f, T("/obj/structure/table"), (yield* g.call(f, P("/proc/orange"), null, [1, live(serveTarget)])));
	}
	if (!(truthy(live(RT)) && truthy(live(serveTarget)))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "Adjacent", live(RT))))) {
		yield* g.srcCall(f, "tryWalk", rt.getStep(f, live(RT), 0));
	} else {
		if (!truthy((drinkChoice = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/reagent_containers/food/drinks")])), T("/obj/item/weapon/reagent_containers/food/drinks"))])))) return f.dot;
		D = (yield* g.new_(f, live(drinkChoice), [rt.getStep(f, live(f.src), 0)]));
		yield* g.callName(f, live(RT), "attackby", [live(D), live(f.src)]);
		yield* g.callName(f, live(f.src), "say", [fmt("＀", [rt.op(f, "PickUnweighted", [5], ["Something to wet your whistle!", "Down the hatch, a tasty beverage!", "One drink, coming right up!", "Tasty liquid for your oral intake!", "Enjoy!"])])]);
		yield* g.srcCall(f, "customEmote", fmt("＀ ＀, serving up a ＀!", [live(f.src), rt.op(f, "PickUnweighted", [5], ["gibbers", "drools", "slobbers", "claps wildly", "spits"]), live(D)]));
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/shitcurity  (code/modules/mob/living/carbon/human/interactive.dm:1106)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/shitcurity", function* shitcurity(f: Frame, obj: Value) {
	let allContents: Value = null, C: Value = null, perpname: Value = null, R: Value = null, I: Value = null;
	let $0: any, $e: any;
	f.vars = () => [obj, allContents, C, perpname, R, I, $0, $e];
	allContents = (yield* g.srcCall(f, "getAllContents"));
	C = null;
	rt.forList(f, 0, rt.sv(f, "nearby"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		perpname = (yield* g.callName(f, live(C), "get_face_name", [(yield* g.callName(f, live(C), "get_id_name", []))]));
		if ((truthy((R = (yield* g.call(f, P("/proc/find_record"), null, ["name", live(perpname), rt.fv(f, "security", rt.gl("data_core"))])))) && truthy(rt.index(rt.fv(f, "fields", live(R)), "criminal")))) {
			$0 = rt.index(rt.fv(f, "fields", live(R)), "criminal");
			if ($0 === "*Arrest*") {
				yield* g.srcCall(f, "retalTarget", live(C));
			}
		}
	}
	rt.endFor(f, 0);
	if (!(truthy(rt.sv(f, "retal")) && truthy(rt.sv(f, "TARGET")))) return f.dot;
	I = null;
	rt.forList(f, 0, live(allContents), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/restraints")) ? 1 : 0))) {
			yield* g.callName(f, live(I), "attack", [rt.sv(f, "TARGET"), live(f.src)]);
			rt.setSv(f, "inactivity_period", 25);
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/clowning  (code/modules/mob/living/carbon/human/interactive.dm:1124)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/clowning", function* clowning(f: Frame, obj: Value) {
	let allContents: Value = null, rangeCheck: Value = null, clownTarget: Value = null, clownPriority: Value = null, S: Value = null, C: Value = null, pranksNearby: Value = null, _T: Value = null, A: Value = null, A_5: Value = null, hasPranked: Value = null, A_6: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [obj, allContents, rangeCheck, clownTarget, clownPriority, S, C, pranksNearby, _T, A, A_5, hasPranked, A_6, B, $e];
	if (truthy((yield* g.srcCall(f, "shouldModulePass")))) {
		return live(f.dot);
	}
	allContents = (yield* g.srcCall(f, "getAllContents"));
	rangeCheck = (yield* g.call(f, P("/proc/orange"), null, [12, live(f.src)]));
	clownTarget = null;
	clownPriority = rt.list();
	if (!truthy((S = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/spray"), live(allContents))))) {
		rt.setFv(f, "amount_per_transfer_from_this", (S = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/spray"), [live(f.src)]))), 10);
	}
	C = null;
	rt.forList(f, 0, live(rangeCheck), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		pranksNearby = 100;
		_T = null;
		rt.forList(f, 1, (yield* g.call(f, P("/proc/orange"), null, [1, live(C)])), T("/turf/open"));
		while (($e = rt.next(f, 1)) !== undefined) {
			_T = $e;
			A = null;
			rt.forList(f, 2, live(_T), T("/obj/item"));
			while (($e = rt.next(f, 2)) !== undefined) {
				A = $e;
				if (((truthy((rt.istype(live(A), T("/obj/item/weapon/soap")) ? 1 : 0)) || truthy((rt.istype(live(A), T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/obj/item/weapon/grown/bananapeel")) ? 1 : 0)))) {
					pranksNearby = rt.inc(live(pranksNearby), -1);
				}
			}
			rt.endFor(f, 2);
			if (truthy(rt.fv(f, "wet", live(_T)))) {
				(pranksNearby = rt.modify(live(pranksNearby), 10, subtract));
			}
		}
		rt.endFor(f, 1);
		rt.setAt(live(clownPriority), live(C), live(pranksNearby));
	}
	rt.endFor(f, 0);
	A_5 = null;
	rt.forList(f, 0, live(clownPriority));
	while (($e = rt.next(f, 0)) !== undefined) {
		A_5 = $e;
		if (!truthy(live(clownTarget))) {
			clownTarget = live(A_5);
		} else {
			if (rt.gt(rt.index(live(clownPriority), live(A_5)), rt.index(live(clownPriority), live(clownTarget)))) {
				clownTarget = rt.index(live(clownPriority), live(A_5));
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(clownTarget))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "Adjacent", live(clownTarget))))) {
		yield* g.srcCall(f, "tryWalk", live(clownTarget));
	} else {
		hasPranked = 0;
		A_6 = null;
		rt.forList(f, 0, live(allContents));
		while (($e = rt.next(f, 0)) !== undefined) {
			A_6 = $e;
			if ((truthy(rt.op(f, "Prob", [], [divide(rt.sv(f, "smartness"), 2)])) && !truthy(live(hasPranked)))) {
				if (truthy((rt.istype(live(A_6), T("/obj/item/weapon/soap")) ? 1 : 0))) {
					yield* g.srcCall(f, "npcDrop", live(A_6));
					hasPranked = 1;
				}
				if (truthy((rt.istype(live(A_6), T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana")) ? 1 : 0))) {
					yield* g.callName(f, (B = live(A_6)), "attack", [live(f.src), live(f.src)]);
				}
				if (truthy((rt.istype(live(A_6), T("/obj/item/weapon/grown/bananapeel")) ? 1 : 0))) {
					yield* g.srcCall(f, "npcDrop", live(A_6));
					hasPranked = 1;
				}
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(hasPranked))) return f.dot;
		if (rt.le(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(S))), 5)) {
			yield* g.callName(f, rt.fv(f, "reagents", live(S)), "add_reagent", ["water", 25]);
		}
		yield* g.callName(f, live(S), "afterattack", [rt.getStep(f, rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/orange"), null, [1, live(clownTarget)]))]), 0), live(f.src)]);
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/healpeople  (code/modules/mob/living/carbon/human/interactive.dm:1181)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/healpeople", function* healpeople(f: Frame, obj: Value) {
	let shouldTryHeal: Value = null, M: Value = null, allContents: Value = null, A: Value = null, HPS: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [obj, shouldTryHeal, M, allContents, A, HPS, C, $e];
	shouldTryHeal = 0;
	M = null;
	allContents = (yield* g.srcCall(f, "getAllContents"));
	A = null;
	rt.forList(f, 0, live(allContents));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((rt.istype(live(A), T("/obj/item/stack/medical")) ? 1 : 0))) {
			shouldTryHeal = 1;
			M = live(A);
		}
	}
	rt.endFor(f, 0);
	HPS = null;
	if (!truthy(rt.locateIn(f, T("/obj/item/weapon/reagent_containers/hypospray"), live(allContents)))) {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray"), [live(f.src)]);
	} else {
		HPS = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/hypospray"), live(allContents));
		if (!truthy(live(shouldTryHeal))) {
			shouldTryHeal = 2;
		}
	}
	if (isEqual(live(shouldTryHeal), 1)) {
		C = null;
		rt.forList(f, 0, rt.sv(f, "nearby"), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (rt.le(rt.fv(f, "health", live(C)), 75)) {
				if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(C)])), 2)) {
					yield* g.callName(f, live(f.src), "say", [fmt("Wait, ＀, let me heal you!", [live(C)])]);
					yield* g.callName(f, live(M), "attack", [live(C), live(f.src)]);
					rt.setSv(f, "inactivity_period", 25);
				} else {
					yield* g.srcCall(f, "tryWalk", rt.getStep(f, live(C), 0));
				}
			}
		}
		rt.endFor(f, 0);
	} else {
		if (!isEqual(live(shouldTryHeal), 2)) return f.dot;
		if (!truthy(live(HPS))) return f.dot;
		if (rt.le(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(HPS))), 0)) {
			yield* g.callName(f, rt.fv(f, "reagents", live(HPS)), "add_reagent", ["tricordrazine", 30]);
		}
		C = null;
		rt.forList(f, 0, rt.sv(f, "nearby"), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if ((rt.le(rt.fv(f, "health", live(C)), 75) && rt.le((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "get_reagent_amount", ["tricordrazine"])), 0))) {
				if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(C)])), 2)) {
					yield* g.callName(f, live(f.src), "say", [fmt("Wait, ＀, let me heal you!", [live(C)])]);
					yield* g.callName(f, live(HPS), "attack", [live(C), live(f.src)]);
					rt.setSv(f, "inactivity_period", 25);
				} else {
					yield* g.srcCall(f, "tryWalk", rt.getStep(f, live(C), 0));
				}
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/dojanitor  (code/modules/mob/living/carbon/human/interactive.dm:1221)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/dojanitor", function* dojanitor(f: Frame, obj: Value) {
	let allContents: Value = null, S: Value = null, TC: Value = null;
	f.vars = () => [obj, allContents, S, TC];
	if (truthy((yield* g.srcCall(f, "shouldModulePass")))) {
		return live(f.dot);
	}
	allContents = (yield* g.srcCall(f, "getAllContents"));
	S = null;
	if (!truthy(rt.locateIn(f, T("/obj/item/weapon/reagent_containers/spray"), live(allContents)))) {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/spray"), [live(f.src)]);
	} else {
		S = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/spray"), live(allContents));
	}
	if (!truthy(live(S))) return f.dot;
	if (rt.le(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(S))), 5)) {
		yield* g.callName(f, rt.fv(f, "reagents", live(S)), "add_reagent", ["cleaner", 25]);
	}
	TC = null;
	if (!truthy((TC = rt.locateIn(f, T("/obj/effect/decal/cleanable"), (yield* g.call(f, P("/proc/range"), null, [32, live(f.src)])))))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "Adjacent", live(TC))))) {
		yield* g.srcCall(f, "tryWalk", live(TC));
	} else {
		yield* g.callName(f, live(S), "afterattack", [live(TC), live(f.src)]);
		rt.setSv(f, "inactivity_period", 25);
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/customEmote  (code/modules/mob/living/carbon/human/interactive.dm:1246)
rt.def("/mob/living/carbon/human/interactive/proc/customEmote", function customEmote(f: Frame, text: Value) {
	rt.callSrc(f, "visible_message", [fmt("<span class='notice'>＀</span>", [live(text)])]);
	return f.dot;
});

// /mob/living/carbon/human/interactive/proc/cookingwithmagic  (code/modules/mob/living/carbon/human/interactive.dm:1250)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/cookingwithmagic", function* cookingwithmagic(f: Frame, target: Value) {
	let S: Value = null;
	f.vars = () => [target, S];
	if (truthy((yield* g.srcCall(f, "Adjacent", live(target))))) {
		yield* g.srcCall(f, "customEmote", fmt("＀ ＀ towards ＀, and with a bang, it's instantly cooked!", [live(f.src), rt.op(f, "PickUnweighted", [5], ["gibbers", "drools", "slobbers", "claps wildly", "spits"]), live(target)]));
		S = (yield* g.new_(f, rt.fv(f, "cooked_type", live(target)), [rt.getStep(f, live(f.src), 0)]));
		yield* g.callName(f, live(target), "initialize_cooked_food", [live(S), 100]);
		if (truthy(live(target))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(target)]);
		}
	} else {
		yield* g.srcCall(f, "tryWalk", live(target));
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/souschef  (code/modules/mob/living/carbon/human/interactive.dm:1260)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/souschef", function* souschef(f: Frame, obj: Value) {
	let allContents: Value = null, RP: Value = null, KK: Value = null, foundCookable: Value = null, rangeCheck: Value = null, customableTypes: Value = null, foundCustom: Value = null, DP: Value = null, customType: Value = null, A: Value = null, SF: Value = null, FC: Value = null, toMake: Value = null, D: Value = null, FD: Value = null, CB: Value = null, PD: Value = null, choice: Value = null, toCook: Value = null, finishedList: Value = null, toDisplay: Value = null, toGrab: Value = null, RT: Value = null, toCheck: Value = null, counted: Value = null, S: Value = null, toPlop: Value = null, allTypes: Value = null, A_15: Value = null, O: Value = null, chosenType: Value = null, newSnack: Value = null;
	let $e: any;
	f.vars = () => [obj, allContents, RP, KK, foundCookable, rangeCheck, customableTypes, foundCustom, DP, customType, A, SF, FC, toMake, D, FD, CB, PD, choice, toCook, finishedList, toDisplay, toGrab, RT, toCheck, counted, S, toPlop, allTypes, A_15, O, chosenType, newSnack, $e];
	if (truthy((yield* g.srcCall(f, "shouldModulePass")))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "enforceHome")))) {
		return live(f.dot);
	}
	allContents = (yield* g.srcCall(f, "getAllContents"));
	if (!truthy((RP = rt.locateIn(f, T("/obj/item/weapon/kitchen/rollingpin"), live(allContents))))) {
		yield* g.new_(f, T("/obj/item/weapon/kitchen/rollingpin"), [live(f.src)]);
	}
	if (!truthy((KK = rt.locateIn(f, T("/obj/item/weapon/kitchen/knife"), live(allContents))))) {
		yield* g.new_(f, T("/obj/item/weapon/kitchen/knife"), [live(f.src)]);
	}
	foundCookable = 0;
	if (!(truthy(live(RP)) && truthy(live(KK)))) return f.dot;
	rangeCheck = (yield* g.call(f, P("/proc/view"), null, [6, live(f.src)]));
	customableTypes = rt.list(T("/obj/item/weapon/reagent_containers/food/snacks/customizable"), T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), T("/obj/item/weapon/reagent_containers/food/snacks/pizzabread"), T("/obj/item/weapon/reagent_containers/food/snacks/bun"), T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"));
	foundCustom = null;
	DP = null;
	rt.forList(f, 0, live(rangeCheck), T("/obj/item/weapon/reagent_containers/food/snacks/donkpocket"));
	while (($e = rt.next(f, 0)) !== undefined) {
		DP = $e;
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.srcCall(f, "customEmote", fmt("＀ points at the ＀, emitting a loud ＀, and it bursts into flame.", [live(f.src), live(DP), rt.op(f, "PickUnweighted", [4], ["bellow", "screech", "yell", "scream"])]));
			yield* g.call(f, P("/proc/qdel"), null, [live(DP)]);
		}
	}
	rt.endFor(f, 0);
	customType = null;
	rt.forList(f, 0, live(customableTypes));
	while (($e = rt.next(f, 0)) !== undefined) {
		customType = $e;
		if (truthy((A = rt.locateIn(f, live(customType), live(rangeCheck))))) {
			foundCustom = live(A);
		}
	}
	rt.endFor(f, 0);
	if (truthy((SF = rt.locateIn(f, T("/obj/machinery/smartfridge"), live(rangeCheck))))) {
		if (rt.gt(rt.getLen(f, rt.fv(f, "contents", live(SF))), 0)) {
			if (!truthy((yield* g.srcCall(f, "Adjacent", live(SF))))) {
				yield* g.srcCall(f, "tryWalk", rt.getStep(f, live(SF), 0), 1);
			} else {
				yield* g.srcCall(f, "customEmote", fmt("＀ ＀, grabbing various foodstuffs from ＀ and sticking them in it's mouth!", [live(f.src), rt.op(f, "PickUnweighted", [5], ["gibbers", "drools", "slobbers", "claps wildly", "spits"]), live(SF)]));
				A = null;
				rt.forList(f, 0, rt.fv(f, "contents", live(SF)), T("/obj/item"));
				while (($e = rt.next(f, 0)) !== undefined) {
					A = $e;
					if (truthy(rt.op(f, "Prob", [], [divide(rt.sv(f, "smartness"), 2)]))) {
						rt.setFv(f, "loc", live(A), live(f.src));
					}
				}
				rt.endFor(f, 0);
			}
		}
	}
	if (truthy(live(foundCustom))) {
		FC = live(foundCustom);
		toMake = null;
		rt.forList(f, 0, live(allContents), T("/obj/item/weapon/reagent_containers/food/snacks"));
		while (($e = rt.next(f, 0)) !== undefined) {
			toMake = $e;
			if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "smartness")]))) {
				if (truthy(rt.fv(f, "reagents", live(FC)))) {
					yield* g.callName(f, live(FC), "attackby", [live(toMake), live(f.src)]);
				} else {
					yield* g.call(f, P("/proc/qdel"), null, [live(FC)]);
				}
			}
		}
		rt.endFor(f, 0);
	}
	D = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/snacks/dough"), live(rangeCheck));
	FD = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/snacks/flatdough"), live(rangeCheck));
	CB = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/snacks/cakebatter"), live(rangeCheck));
	PD = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/snacks/piedough"), live(rangeCheck));
	if (truthy(live(D))) {
		rt.setSv(f, "TARGET", live(D));
		if (isEqual((choice = rt.op(f, "PickUnweighted", [2], [1, 2])), 1)) {
			yield* g.srcCall(f, "tryWalk", rt.getStep(f, live(D), 0));
			rt.setSv(f, "inactivity_period", (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(D)])));
			yield* g.callName(f, live(D), "attackby", [live(RP), live(f.src)]);
		} else {
			yield* g.srcCall(f, "cookingwithmagic", live(D));
		}
		foundCookable = 1;
	} else {
		if (truthy(live(FD))) {
			rt.setSv(f, "TARGET", live(FD));
			if (isEqual((choice = rt.op(f, "PickUnweighted", [2], [1, 2])), 1)) {
				yield* g.srcCall(f, "tryWalk", rt.getStep(f, live(D), 0));
				rt.setSv(f, "inactivity_period", (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(D)])));
				yield* g.callName(f, live(FD), "attackby", [live(KK), live(f.src)]);
			} else {
				yield* g.srcCall(f, "cookingwithmagic", live(FD));
			}
			foundCookable = 1;
		} else {
			if (truthy(live(CB))) {
				rt.setSv(f, "TARGET", live(CB));
				if (isEqual((choice = rt.op(f, "PickUnweighted", [2], [1, 2])), 1)) {
					yield* g.srcCall(f, "tryWalk", rt.getStep(f, live(D), 0));
					rt.setSv(f, "inactivity_period", (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(D)])));
					yield* g.callName(f, live(CB), "attackby", [live(RP), live(f.src)]);
				} else {
					yield* g.srcCall(f, "cookingwithmagic", live(CB));
				}
				foundCookable = 1;
			} else {
				if (truthy(live(PD))) {
					rt.setSv(f, "TARGET", live(PD));
					if (isEqual((choice = rt.op(f, "PickUnweighted", [2], [1, 2])), 1)) {
						yield* g.srcCall(f, "tryWalk", rt.getStep(f, live(D), 0));
						rt.setSv(f, "inactivity_period", (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(D)])));
						yield* g.callName(f, live(PD), "attackby", [live(KK), live(f.src)]);
					} else {
						yield* g.srcCall(f, "cookingwithmagic", live(PD));
					}
					foundCookable = 1;
				}
			}
		}
	}
	if (truthy((toCook = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/snacks"), live(rangeCheck))))) {
		if (truthy(rt.fv(f, "cooked_type", live(toCook)))) {
			rt.setSv(f, "TARGET", live(toCook));
			foundCookable = 1;
			if (truthy((yield* g.srcCall(f, "Adjacent", live(toCook))))) {
				yield* g.srcCall(f, "cookingwithmagic", live(toCook));
			} else {
				yield* g.srcCall(f, "tryWalk", rt.getStep(f, live(toCook), 0));
			}
		}
	}
	finishedList = rt.list();
	toDisplay = null;
	rt.forList(f, 0, live(allContents), T("/obj/item/weapon/reagent_containers/food/snacks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		toDisplay = $e;
		if ((!truthy(rt.fv(f, "cooked_type", live(toDisplay))) && !truthy((rt.istype(live(toDisplay), T("/obj/item/weapon/reagent_containers/food/snacks/grown")) ? 1 : 0)))) {
			finishedList = rt.modify(live(finishedList), live(toDisplay), add);
		}
	}
	rt.endFor(f, 0);
	toGrab = null;
	rt.forList(f, 0, live(rangeCheck), T("/obj/item/weapon/reagent_containers/food/snacks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		toGrab = $e;
		if (!truthy(rt.locateIn(f, T("/obj/structure/table/reinforced"), rt.getStep(f, live(toGrab), 0)))) {
			foundCookable = 1;
			if (!truthy((yield* g.srcCall(f, "Adjacent", live(toGrab))))) {
				yield* g.srcCall(f, "tryWalk", live(toGrab));
			} else {
				rt.setFv(f, "loc", live(toGrab), live(f.src));
			}
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.len(f, live(finishedList)), 0)) {
		RT = null;
		toCheck = null;
		rt.forList(f, 0, live(rangeCheck), T("/obj/structure/table/reinforced"));
		while (($e = rt.next(f, 0)) !== undefined) {
			toCheck = $e;
			counted = 0;
			S = null;
			rt.forList(f, 1, rt.getStep(f, live(toCheck), 0), T("/obj/item/weapon/reagent_containers/food/snacks"));
			while (($e = rt.next(f, 1)) !== undefined) {
				S = $e;
				counted = rt.inc(live(counted), 1);
			}
			rt.endFor(f, 1);
			if (rt.lt(live(counted), 12)) {
				RT = live(toCheck);
				break;
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(RT))) {
			foundCookable = 1;
			if (!truthy((yield* g.srcCall(f, "Adjacent", live(RT))))) {
				yield* g.srcCall(f, "tryWalk", rt.getStep(f, live(RT), 0));
			} else {
				toPlop = null;
				rt.forList(f, 0, live(allContents), T("/obj/item/weapon/reagent_containers/food/snacks"));
				while (($e = rt.next(f, 0)) !== undefined) {
					toPlop = $e;
					yield* g.callName(f, live(RT), "attackby", [live(toPlop), live(f.src)]);
				}
				rt.endFor(f, 0);
			}
		}
	}
	if (truthy(live(foundCookable))) return f.dot;
	allTypes = rt.list(T("/obj/item/weapon/reagent_containers/food/snacks/piedough"), T("/obj/item/weapon/reagent_containers/food/snacks/cakebatter"), T("/obj/item/weapon/reagent_containers/food/snacks/dough"), T("/obj/item/weapon/reagent_containers/food/snacks/flatdough"));
	A_15 = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/reagent_containers/food/snacks")])));
	while (($e = rt.next(f, 0)) !== undefined) {
		A_15 = $e;
		if (truthy(rt.initial(f, (O = live(A_15)), "cooked_type"))) {
			allTypes = rt.modify(live(allTypes), live(A_15), add);
		}
	}
	rt.endFor(f, 0);
	chosenType = rt.op(f, "PickUnweighted", [1], [live(allTypes)]);
	rt.setSv(f, "TARGET", (newSnack = (yield* g.new_(f, live(chosenType), [rt.getStep(f, live(f.src), 0)]))));
	yield* g.callName(f, rt.fv(f, "reagents", live(newSnack)), "remove_any", [subtract(divide(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(newSnack))), 2), 1)]);
	rt.setFv(f, "name", live(newSnack), fmt("Synthetic ＀", [rt.fv(f, "name", live(newSnack))]));
	yield* g.srcCall(f, "customEmote", fmt("＀ ＀ as they vomit ＀ from their mouth!", [live(f.src), rt.op(f, "PickUnweighted", [5], ["gibbers", "drools", "slobbers", "claps wildly", "spits"]), live(newSnack)]));
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/compareFaction  (code/modules/mob/living/carbon/human/interactive.dm:1432)
rt.def("/mob/living/carbon/human/interactive/proc/compareFaction", function compareFaction(f: Frame, targetFactions: Value) {
	let hasSame: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [hasSame, A, $e];
	hasSame = 0;
	A = null;
	rt.forList(f, 0, live(targetFactions));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((rt.isIn(f, live(A), rt.sv(f, "faction")) ? 1 : 0))) {
			hasSame = 1;
		}
	}
	rt.endFor(f, 0);
	return live(hasSame);
});

// /mob/living/carbon/human/interactive/proc/combat  (code/modules/mob/living/carbon/human/interactive.dm:1439)  may sleep
rt.def("/mob/living/carbon/human/interactive/proc/combat", function* combat(f: Frame, obj: Value) {
	let M: Value = null, best: Value = null, foundFav: Value = null, allContents: Value = null, test: Value = null, a: Value = null, R: Value = null, G: Value = null, M_3: Value = null, A: Value = null, W: Value = null, G_4: Value = null, _P: Value = null, stunning: Value = null, A_7: Value = null, shouldFire: Value = null, stunCheck: Value = null;
	let $e: any;
	f.vars = () => [obj, M, best, foundFav, allContents, test, a, R, G, M_3, A, W, G_4, _P, stunning, A_7, shouldFire, stunCheck, $e];
	yield* g.srcCall(f, "enforce_hands");
	if (truthy(rt.sv(f, "canmove"))) {
		if (((truthy(rt.sv(f, "graytide")) || truthy(rt.bitAnd(rt.sv(f, "TRAITS"), 32))) || truthy(rt.sv(f, "retal")))) {
			rt.modSrcVar(f, "interest", rt.sv(f, "targetInterestShift"), add);
			rt.setSv(f, "a_intent", "harm");
			rt.setSv(f, "zone_selected", rt.op(f, "PickUnweighted", [6], ["chest", "r_leg", "l_leg", "r_arm", "l_arm", "head"]));
			(rt.modSrcVar(f, "doing", 8, rt.bitOr));
			if (truthy(rt.sv(f, "retal"))) {
				rt.setSv(f, "TARGET", rt.sv(f, "retal_target"));
			} else {
				if (!truthy((M = rt.locateIn(f, T("/mob/living"), (yield* g.call(f, P("/proc/oview"), null, [7, live(f.src)])))))) {
					rt.setSv(f, "doing", rt.bitAnd(rt.sv(f, "doing"), 16777207));
				} else {
					if ((!isEqual(live(M), live(f.src)) && !truthy((yield* g.srcCall(f, "compareFaction", rt.fv(f, "faction", live(M))))))) {
						rt.setSv(f, "TARGET", live(M));
					}
				}
			}
		}
	}
	if (truthy(rt.sv(f, "retal"))) {
		if (truthy(rt.sv(f, "retal_target"))) {
			if (truthy((yield* g.srcCall(f, "compareFaction", rt.fv(f, "faction", rt.sv(f, "retal_target")))))) {
				rt.setSv(f, "retal", 0);
				rt.setSv(f, "retal_target", null);
				rt.setSv(f, "TARGET", null);
				rt.setSv(f, "doing", 0);
			}
		}
	}
	best = null;
	foundFav = 0;
	allContents = (yield* g.srcCall(f, "getAllContents"));
	test = null;
	rt.forList(f, 0, live(allContents));
	while (($e = rt.next(f, 0)) !== undefined) {
		test = $e;
		a = null;
		rt.forList(f, 1, rt.sv(f, "favoured_types"));
		while (($e = rt.next(f, 1)) !== undefined) {
			a = $e;
			if ((truthy((yield* g.call(f, P("/proc/ispath"), null, [live(test), live(a)]))) && !truthy(rt.bitAnd(rt.sv(f, "doing"), 8)))) {
				best = live(test);
				foundFav = 1;
				return live(f.dot);
			}
		}
		rt.endFor(f, 1);
		if (!truthy(live(foundFav))) {
			if (truthy((rt.istype(live(test), T("/obj/item/weapon")) ? 1 : 0))) {
				if (rt.gt(rt.gv(f, "force", (R = live(test))), 2)) {
					if (!truthy(live(best))) {
						best = live(R);
					} else {
						if (rt.lt(rt.fv(f, "force", live(best)), rt.fv(f, "force", live(R)))) {
							best = live(R);
						}
					}
					if (truthy((rt.istype(live(R), T("/obj/item/weapon/gun")) ? 1 : 0))) {
						if (truthy((yield* g.callName(f, (G = live(R)), "can_shoot", [])))) {
							best = live(R);
							break;
						}
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(best))) {
		yield* g.srcCall(f, "take_to_slot", live(best), 1);
	}
	if (!(truthy(rt.sv(f, "TARGET")) && truthy(rt.bitAnd(rt.sv(f, "doing"), 8)))) return f.dot;
	if (truthy((rt.istype((M_3 = rt.sv(f, "TARGET")), T("/mob/living")) ? 1 : 0))) {
		if (rt.gt(rt.fv(f, "health", live(M_3)), 1)) {
			A = null;
			rt.forList(f, 0, live(allContents));
			while (($e = rt.next(f, 0)) !== undefined) {
				A = $e;
				if (truthy((rt.istype(live(A), T("/obj/item/weapon/gun")) ? 1 : 0))) {
					continue;
				}
				if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "robustness")]))) {
					if (truthy((rt.istype(live(A), T("/obj/item/weapon")) ? 1 : 0))) {
						if (rt.gt(rt.gv(f, "throwforce", (W = live(A))), 19)) {
							yield* g.srcCall(f, "npcDrop", live(W), 1);
							yield* g.srcCall(f, "throw_item", rt.sv(f, "TARGET"));
						}
					}
					if (truthy((rt.istype(live(A), T("/obj/item/weapon/grenade")) ? 1 : 0))) {
						yield* g.callName(f, (G = live(A)), "attack_self", [live(f.src)]);
						if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "smartness")]))) {
							yield* g.srcCall(f, "npcDrop", live(G), 1);
							rt.setSv(f, "inactivity_period", 15);
							yield* g.call(f, P("/proc/sleep"), null, [15]);
							yield* g.srcCall(f, "throw_item", rt.sv(f, "TARGET"));
						}
					}
				}
			}
			rt.endFor(f, 0);
			if ((!truthy(rt.sv(f, "main_hand")) && truthy(rt.sv(f, "other_hand")))) {
				yield* g.srcCall(f, "swap_hands");
			}
			if (truthy(rt.sv(f, "main_hand"))) {
				if (!isEqual(rt.fv(f, "force", rt.sv(f, "main_hand")), 0)) {
					if (truthy((rt.istype(rt.sv(f, "main_hand"), T("/obj/item/weapon/gun")) ? 1 : 0))) {
						if (truthy((yield* g.callName(f, (G_4 = rt.sv(f, "main_hand")), "can_trigger_gun", [live(f.src)])))) {
							if (truthy((rt.istype(rt.sv(f, "main_hand"), T("/obj/item/weapon/gun/ballistic")) ? 1 : 0))) {
								if (!truthy(rt.gv(f, "chambered", (_P = rt.sv(f, "main_hand"))))) {
									yield* g.callName(f, live(_P), "chamber_round", []);
									yield* g.callName(f, live(_P), "update_icon", []);
								} else {
									if (isEqual((yield* g.callName(f, live(_P), "get_ammo", [1])), 0)) {
										yield* g.callName(f, live(_P), "update_icon", []);
										yield* g.srcCall(f, "npcDrop", live(_P), 1);
									} else {
										yield* g.callName(f, live(_P), "afterattack", [rt.sv(f, "TARGET"), live(f.src)]);
									}
								}
							} else {
								if (truthy((rt.istype(rt.sv(f, "main_hand"), T("/obj/item/weapon/gun/energy")) ? 1 : 0))) {
									_P = rt.sv(f, "main_hand");
									stunning = 0;
									A_7 = null;
									rt.forList(f, 0, rt.fv(f, "ammo_type", live(_P)));
									while (($e = rt.next(f, 0)) !== undefined) {
										A_7 = $e;
										if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(A_7), T("/obj/item/ammo_casing/energy/electrode")])))) {
											stunning = 1;
										}
									}
									rt.endFor(f, 0);
									shouldFire = 1;
									stunCheck = rt.sv(f, "TARGET");
									if (((truthy(live(stunning)) && truthy((rt.istype(live(stunCheck), T("/mob/living")) ? 1 : 0))) && truthy((yield* g.callName(f, live(stunCheck), "IsStun", []))))) {
										shouldFire = 0;
									}
									if (truthy(live(shouldFire))) {
										if (rt.le(rt.gv(f, "charge", rt.fv(f, "cell", live(_P))), 10)) {
											yield* g.callName(f, live(_P), "update_icon", []);
											yield* g.srcCall(f, "npcDrop", live(_P), 1);
										} else {
											yield* g.callName(f, live(_P), "afterattack", [rt.sv(f, "TARGET"), live(f.src)]);
										}
									}
								} else {
									if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "TARGET")])), 6)) {
										if (!truthy((yield* g.srcCall(f, "walk2derpless", rt.sv(f, "TARGET"))))) {
											rt.incSrcVar(f, "timeout", 1, true);
										}
									} else {
										yield* g.callName(f, (W = rt.sv(f, "main_hand")), "attack", [rt.sv(f, "TARGET"), live(f.src)]);
									}
								}
							}
						} else {
							rt.setFv(f, "loc", live(G_4), rt.getStep(f, live(f.src), 0));
							yield* g.srcCall(f, "enforce_hands");
							yield* g.srcCall(f, "update_icons");
						}
					}
				}
			} else {
				if (rt.gt((yield* g.srcCall(f, "targetRange", rt.sv(f, "TARGET"))), 2)) {
					yield* g.srcCall(f, "tryWalk", rt.sv(f, "TARGET"));
				} else {
					if (truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "TARGET"))))) {
						rt.setSv(f, "a_intent", rt.op(f, "PickUnweighted", [2], ["disarm", "harm"]));
						yield* g.callName(f, live(M_3), "attack_hand", [live(f.src)]);
					}
				}
			}
		}
		rt.incSrcVar(f, "timeout", 1, true);
	} else {
		if ((rt.ge(rt.sv(f, "timeout"), 10) || !rt.gt((yield* g.srcCall(f, "targetRange", live(M_3))), 14))) {
			rt.setSv(f, "doing", rt.bitAnd(rt.sv(f, "doing"), 16777207));
			rt.setSv(f, "timeout", 0);
			rt.setSv(f, "TARGET", null);
			rt.setSv(f, "retal", 0);
			rt.setSv(f, "retal_target", null);
		} else {
			rt.incSrcVar(f, "timeout", 1, true);
		}
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/interactive/proc/nearbyscan  (code/modules/mob/living/carbon/human/interactive.dm:1578)
rt.def("/mob/living/carbon/human/interactive/proc/nearbyscan", function nearbyscan(f: Frame, obj: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	rt.setSv(f, "nearby", rt.list());
	M = null;
	rt.forList(f, 0, rt.call(f, P("/proc/view"), null, [4, live(f.src)]), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!isEqual(live(M), live(f.src))) {
			rt.modSrcVar(f, "nearby", live(M), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(4814, "/mob/living/carbon/human/interactive/angry", "/mob/living/carbon/human/interactive", {});

// /mob/living/carbon/human/interactive/angry/proc/Initialize  (code/modules/mob/living/carbon/human/interactive.dm:1585)  may sleep
rt.def("/mob/living/carbon/human/interactive/angry/proc/Initialize", function* Initialize(f: Frame) {
	(rt.modSrcVar(f, "TRAITS", 2, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", 32, rt.bitOr));
	rt.modSrcVar(f, "faction", "bot_angry", add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(4815, "/mob/living/carbon/human/interactive/friendly", "/mob/living/carbon/human/interactive", {});

// /mob/living/carbon/human/interactive/friendly/proc/Initialize  (code/modules/mob/living/carbon/human/interactive.dm:1591)  may sleep
rt.def("/mob/living/carbon/human/interactive/friendly/proc/Initialize", function* Initialize(f: Frame) {
	(rt.modSrcVar(f, "TRAITS", 64, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", 4, rt.bitOr));
	rt.modSrcVar(f, "faction", "bot_friendly", add);
	rt.modSrcVar(f, "faction", "neutral", add);
	(rt.modSrcVar(f, "functions", "combat", subtract));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(4816, "/mob/living/carbon/human/interactive/greytide", "/mob/living/carbon/human/interactive", {});

// /mob/living/carbon/human/interactive/greytide/proc/Initialize  (code/modules/mob/living/carbon/human/interactive.dm:1599)  may sleep
rt.def("/mob/living/carbon/human/interactive/greytide/proc/Initialize", function* Initialize(f: Frame) {
	(rt.modSrcVar(f, "TRAITS", 2, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", 32, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", 128, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", 16, rt.bitOr));
	rt.setSv(f, "maxInterest", 5);
	rt.setSv(f, "targetInterestShift", 2);
	rt.modSrcVar(f, "faction", "bot_grey", add);
	rt.setSv(f, "graytide", 1);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(4817, "/mob/living/carbon/human/interactive/robust", "/mob/living/carbon/human/interactive", {});

// /mob/living/carbon/human/interactive/robust/proc/Initialize  (code/modules/mob/living/carbon/human/interactive.dm:1611)  may sleep
rt.def("/mob/living/carbon/human/interactive/robust/proc/Initialize", function* Initialize(f: Frame) {
	(rt.modSrcVar(f, "TRAITS", 64, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", 2, rt.bitOr));
	(rt.modSrcVar(f, "TRAITS", 8, rt.bitOr));
	rt.modSrcVar(f, "faction", "bot_power", add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
