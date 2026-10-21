// From code/datums/diseases/transformation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(962, "/datum/disease/transformation", "/datum/disease", {
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/carbon/human"),
	name: "Transformation",
	max_stages: 5,
	spread_text: "Acute",
	spread_flags: 1,
	cure_text: "A coder's love (theoretical).",
	agent: "Shenanigans",
	severity: "Harmful",
	stage_prob: 10,
	visibility_flags: 3,
	disease_flags: 1,
	viable_mobtypes: null,
});

// /datum/disease/transformation/proc/<init>  (code/datums/diseases/transformation.dm:13)
rt.def("/datum/disease/transformation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stage1", rt.list("You feel unremarkable."));
	$0 = $0;
	rt.setSv(f, "stage2", rt.list("You feel boring."));
	$0 = $0;
	rt.setSv(f, "stage3", rt.list("You feel utterly plain."));
	$0 = $0;
	rt.setSv(f, "stage4", rt.list("You feel white bread."));
	$0 = $0;
	rt.setSv(f, "stage5", rt.list("Oh the humanity!"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"), T("/mob/living/carbon/alien")));
	return f.dot;
});

// /datum/disease/transformation/proc/stage_act  (code/datums/diseases/transformation.dm:21)  may sleep
rt.def("/datum/disease/transformation/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 1) {
		if ((truthy(rt.op(f, "Prob", [], [rt.sv(f, "stage_prob")])) && truthy(rt.sv(f, "stage1")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "stage1")])]);
		}
	} else if ($0 === 2) {
		if ((truthy(rt.op(f, "Prob", [], [rt.sv(f, "stage_prob")])) && truthy(rt.sv(f, "stage2")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "stage2")])]);
		}
	} else if ($0 === 3) {
		if ((truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "stage_prob"), 2)])) && truthy(rt.sv(f, "stage3")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "stage3")])]);
		}
	} else if ($0 === 4) {
		if ((truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "stage_prob"), 2)])) && truthy(rt.sv(f, "stage4")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "stage4")])]);
		}
	} else if ($0 === 5) {
		yield* g.srcCall(f, "do_disease_transformation", rt.sv(f, "affected_mob"));
	}
	return f.dot;
}, true);

// /datum/disease/transformation/proc/do_disease_transformation  (code/datums/diseases/transformation.dm:39)  may sleep
rt.def("/datum/disease/transformation/proc/do_disease_transformation", function* do_disease_transformation(f: Frame, affected_mob: Value) {
	let W: Value = null, I: Value = null, new_mob: Value = null;
	let $e: any;
	f.vars = () => [affected_mob, W, I, new_mob, $e];
	if (!(truthy((rt.istype(live(affected_mob), T("/mob/living/carbon")) ? 1 : 0)) && !isEqual(rt.fv(f, "stat", live(affected_mob)), 2))) return f.dot;
	if (truthy(rt.sv(f, "stage5"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(affected_mob), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "stage5")])]);
	}
	if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(affected_mob), rt.sv(f, "new_form")])))) {
		yield* g.callName(f, live(affected_mob), "death", [1]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "notransform", live(affected_mob)))) {
		return live(f.dot);
	}
	rt.setFv(f, "notransform", live(affected_mob), 1);
	W = null;
	rt.forList(f, 0, (yield* g.callName(f, live(affected_mob), "get_equipped_items", [])), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		yield* g.callName(f, live(affected_mob), "dropItemToGround", [live(W)]);
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(affected_mob)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(affected_mob), "dropItemToGround", [live(I)]);
	}
	rt.endFor(f, 0);
	if (truthy((rt.istype((new_mob = (yield* g.new_(f, rt.sv(f, "new_form"), [rt.fv(f, "loc", live(affected_mob))]))), T("/mob/living")) ? 1 : 0))) {
		rt.setFv(f, "a_intent", live(new_mob), "harm");
		if (truthy(rt.fv(f, "mind", live(affected_mob)))) {
			yield* g.callName(f, rt.fv(f, "mind", live(affected_mob)), "transfer_to", [live(new_mob)]);
		} else {
			rt.setFv(f, "key", live(new_mob), rt.fv(f, "key", live(affected_mob)));
		}
	}
	rt.setFv(f, "name", live(new_mob), rt.fv(f, "real_name", live(affected_mob)));
	rt.setFv(f, "real_name", live(new_mob), rt.fv(f, "name", live(new_mob)));
	yield* g.call(f, P("/proc/qdel"), null, [live(affected_mob)]);
	return f.dot;
}, true);

rt.type(963, "/datum/disease/transformation/jungle_fever", "/datum/disease/transformation", {
	name: "Jungle Fever",
	cure_text: "Bananas",
	cures: null,
	spread_text: "Monkey Bites",
	spread_flags: 1,
	permeability_mod: 1,
	cure_chance: 1,
	disease_flags: 6,
	longevity: 30,
	desc: "Monkeys with this disease will bite humans, causing humans to mutate into a monkey.",
	severity: "BIOHAZARD THREAT!",
	stage_prob: 4,
	visibility_flags: 0,
	agent: "Kongey Vibrion M-909",
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	viable_mobtypes: null,
	new_form: rt.typePath("/mob/living/carbon/monkey"),
});

// /datum/disease/transformation/jungle_fever/proc/<init>  (code/datums/diseases/transformation.dm:69)
rt.def("/datum/disease/transformation/jungle_fever/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("banana"));
	rt.setSv(f, "stage1", null);
	rt.setSv(f, "stage2", null);
	rt.setSv(f, "stage3", null);
	rt.setSv(f, "stage4", rt.list("<span class='warning'>Your back hurts.</span>", "<span class='warning'>You breathe through your mouth.</span>", "<span class='warning'>You have a craving for bananas.</span>", "<span class='warning'>Your mind feels clouded.</span>"));
	$0 = $0;
	rt.setSv(f, "stage5", rt.list("<span class='warning'>You feel like monkeying around.</span>"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/monkey"), T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/disease/transformation/jungle_fever/proc/do_disease_transformation  (code/datums/diseases/transformation.dm:92)  may sleep
rt.def("/datum/disease/transformation/jungle_fever/proc/do_disease_transformation", function* do_disease_transformation(f: Frame, affected_mob: Value) {
	f.vars = () => [affected_mob];
	if (truthy((rt.istype(live(affected_mob), T("/mob/living/carbon/monkey")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_monkey", [rt.fv(f, "mind", live(affected_mob))]);
	yield* g.callName(f, live(affected_mob), "monkeyize", [311]);
	return f.dot;
}, true);

// /datum/disease/transformation/jungle_fever/proc/stage_act  (code/datums/diseases/transformation.dm:97)  may sleep
rt.def("/datum/disease/transformation/jungle_fever/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), fmt("<span class='notice'>Your ＀ itches.</span>", [rt.op(f, "PickUnweighted", [5], ["back", "arm", "leg", "elbow", "head"])])]);
		}
	} else if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [4]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel a stabbing pain in your head.</span>"]);
			rt.modField(f, rt.sv(f, "affected_mob"), "confused", 10, add);
		}
	} else if ($0 === 4) {
		if (!truthy(rt.op(f, "Prob", [], [3]))) return f.dot;
		yield* g.callName(f, rt.sv(f, "affected_mob"), "say", [rt.op(f, "PickUnweighted", [4], ["Eeek, ook ook!", "Eee-eeek!", "Eeee!", "Ungh, ungh."])]);
	}
	return f.dot;
}, true);

// /datum/disease/transformation/jungle_fever/proc/cure  (code/datums/diseases/transformation.dm:111)  may sleep
rt.def("/datum/disease/transformation/jungle_fever/proc/cure", function* cure(f: Frame) {
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_monkey", [rt.fv(f, "mind", rt.sv(f, "affected_mob"))]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(964, "/datum/disease/transformation/robot", "/datum/disease/transformation", {
	name: "Robotic Transformation",
	cure_text: "An injection of copper.",
	cures: null,
	cure_chance: 5,
	agent: "R2D2 Nanomachines",
	desc: "This disease, actually acute nanomachine infection, converts the victim into a cyborg.",
	severity: "Dangerous!",
	visibility_flags: 0,
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/silicon/robot"),
});

// /datum/disease/transformation/robot/proc/<init>  (code/datums/diseases/transformation.dm:119)
rt.def("/datum/disease/transformation/robot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("copper"));
	rt.setSv(f, "stage1", null);
	rt.setSv(f, "stage2", rt.list("Your joints feel stiff.", "<span class='danger'>Beep...boop..</span>"));
	rt.setSv(f, "stage3", rt.list("<span class='danger'>Your joints feel very stiff.</span>", "Your skin feels loose.", "<span class='danger'>You can feel something move...inside.</span>"));
	rt.setSv(f, "stage4", rt.list("<span class='danger'>Your skin feels very loose.</span>", "<span class='danger'>You can feel... something...inside you.</span>"));
	$0 = $0;
	rt.setSv(f, "stage5", rt.list("<span class='danger'>Your skin feels as if it's about to burst off!</span>"));
	return f.dot;
});

// /datum/disease/transformation/robot/proc/stage_act  (code/datums/diseases/transformation.dm:134)  may sleep
rt.def("/datum/disease/transformation/robot/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [8]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "say", [rt.op(f, "PickUnweighted", [3], ["Beep, boop", "beep, beep!", "Boop...bop"])]);
		}
		if (truthy(rt.op(f, "Prob", [], [4]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel a stabbing pain in your head.</span>"]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "Unconscious", [40]);
		}
	} else if ($0 === 4) {
		if (!truthy(rt.op(f, "Prob", [], [20]))) return f.dot;
		yield* g.callName(f, rt.sv(f, "affected_mob"), "say", [rt.op(f, "PickUnweighted", [4], ["beep, beep!", "Boop bop boop beep.", "kkkiiiill mmme", "I wwwaaannntt tttoo dddiiieeee..."])]);
	}
	return f.dot;
}, true);

rt.type(965, "/datum/disease/transformation/xeno", "/datum/disease/transformation", {
	name: "Xenomorph Transformation",
	cure_text: "Spaceacillin & Glycerol",
	cures: null,
	cure_chance: 5,
	agent: "Rip-LEY Alien Microbes",
	desc: "This disease changes the victim into a xenomorph.",
	severity: "BIOHAZARD THREAT!",
	visibility_flags: 0,
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/carbon/alien/humanoid/hunter"),
});

// /datum/disease/transformation/xeno/proc/<init>  (code/datums/diseases/transformation.dm:161)
rt.def("/datum/disease/transformation/xeno/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("spaceacillin", "glycerol"));
	rt.setSv(f, "stage1", null);
	rt.setSv(f, "stage2", rt.list("Your throat feels scratchy.", "<span class='danger'>Kill...</span>"));
	rt.setSv(f, "stage3", rt.list("<span class='danger'>Your throat feels very scratchy.</span>", "Your skin feels tight.", "<span class='danger'>You can feel something move...inside.</span>"));
	rt.setSv(f, "stage4", rt.list("<span class='danger'>Your skin feels very tight.</span>", "<span class='danger'>Your blood boils!</span>", "<span class='danger'>You can feel... something...inside you.</span>"));
	$0 = $0;
	rt.setSv(f, "stage5", rt.list("<span class='danger'>Your skin feels as if it's about to burst off!</span>"));
	return f.dot;
});

// /datum/disease/transformation/xeno/proc/stage_act  (code/datums/diseases/transformation.dm:165)  may sleep
rt.def("/datum/disease/transformation/xeno/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [4]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel a stabbing pain in your head.</span>"]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "Unconscious", [40]);
		}
	} else if ($0 === 4) {
		if (!truthy(rt.op(f, "Prob", [], [20]))) return f.dot;
		yield* g.callName(f, rt.sv(f, "affected_mob"), "say", [rt.op(f, "PickUnweighted", [3], ["You look delicious.", "Going to... devour you...", "Hsssshhhhh!"])]);
	}
	return f.dot;
}, true);

rt.type(966, "/datum/disease/transformation/slime", "/datum/disease/transformation", {
	name: "Advanced Mutation Transformation",
	cure_text: "frost oil",
	cures: null,
	cure_chance: 80,
	agent: "Advanced Mutation Toxin",
	desc: "This highly concentrated extract converts anything into more of itself.",
	severity: "BIOHAZARD THREAT!",
	visibility_flags: 0,
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/simple_animal/slime/random"),
});

// /datum/disease/transformation/slime/proc/<init>  (code/datums/diseases/transformation.dm:179)
rt.def("/datum/disease/transformation/slime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("frostoil"));
	$0 = $0;
	rt.setSv(f, "stage1", rt.list("You don't feel very well."));
	$0 = $0;
	rt.setSv(f, "stage2", rt.list("Your skin feels a little slimy."));
	rt.setSv(f, "stage3", rt.list("<span class='danger'>Your appendages are melting away.</span>", "<span class='danger'>Your limbs begin to lose their shape.</span>"));
	$0 = $0;
	rt.setSv(f, "stage4", rt.list("<span class='danger'>You are turning into a slime.</span>"));
	$0 = $0;
	rt.setSv(f, "stage5", rt.list("<span class='danger'>You have become a slime.</span>"));
	return f.dot;
});

// /datum/disease/transformation/slime/proc/stage_act  (code/datums/diseases/transformation.dm:193)  may sleep
rt.def("/datum/disease/transformation/slime/proc/stage_act", function* stage_act(f: Frame) {
	let human: Value = null;
	let $0: any;
	f.vars = () => [human, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 1) {
		if (((truthy((rt.istype(rt.sv(f, "affected_mob"), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy(rt.fv(f, "dna", rt.sv(f, "affected_mob")))) && isEqual(rt.gv(f, "id", rt.gv(f, "species", rt.fv(f, "dna", rt.sv(f, "affected_mob")))), "slime"))) {
			rt.setSv(f, "stage", 5);
		}
	} else if ($0 === 3) {
		if (!truthy((rt.istype(rt.sv(f, "affected_mob"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
		if (isEqual(rt.gv(f, "id", rt.gv(f, "species", rt.gv(f, "dna", (human = rt.sv(f, "affected_mob"))))), "slime")) return f.dot;
		yield* g.callName(f, live(human), "set_species", [T("/datum/species/jelly/slime")]);
	}
	return f.dot;
}, true);

rt.type(967, "/datum/disease/transformation/corgi", "/datum/disease/transformation", {
	name: "The Barkening",
	cure_text: "Death",
	cures: null,
	agent: "Fell Doge Majicks",
	desc: "This disease transforms the victim into a corgi.",
	visibility_flags: 0,
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/simple_animal/pet/dog/corgi"),
});

// /datum/disease/transformation/corgi/proc/<init>  (code/datums/diseases/transformation.dm:207)
rt.def("/datum/disease/transformation/corgi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("adminordrazine"));
	$0 = $0;
	rt.setSv(f, "stage1", rt.list("BARK."));
	$0 = $0;
	rt.setSv(f, "stage2", rt.list("You feel the need to wear silly hats."));
	rt.setSv(f, "stage3", rt.list("<span class='danger'>Must... eat... chocolate....</span>", "<span class='danger'>YAP</span>"));
	$0 = $0;
	rt.setSv(f, "stage4", rt.list("<span class='danger'>Visions of washing machines assail your mind!</span>"));
	$0 = $0;
	rt.setSv(f, "stage5", rt.list("<span class='danger'>AUUUUUU!!!</span>"));
	return f.dot;
});

// /datum/disease/transformation/corgi/proc/stage_act  (code/datums/diseases/transformation.dm:219)  may sleep
rt.def("/datum/disease/transformation/corgi/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [8]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "say", [rt.op(f, "PickUnweighted", [2], ["YAP", "Woof!"])]);
		}
	} else if ($0 === 4) {
		if (!truthy(rt.op(f, "Prob", [], [20]))) return f.dot;
		yield* g.callName(f, rt.sv(f, "affected_mob"), "say", [rt.op(f, "PickUnweighted", [2], ["Bark!", "AUUUUUU"])]);
	}
	return f.dot;
}, true);

rt.type(968, "/datum/disease/transformation/morph", "/datum/disease/transformation", {
	name: "Gluttony's Blessing",
	cure_text: "nothing",
	cures: null,
	agent: "Gluttony's Blessing",
	desc: "A 'gift' from somewhere terrible.",
	stage_prob: 20,
	severity: "BIOHAZARD THREAT!",
	visibility_flags: 0,
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/simple_animal/hostile/morph"),
});

// /datum/disease/transformation/morph/proc/<init>  (code/datums/diseases/transformation.dm:231)
rt.def("/datum/disease/transformation/morph/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("adminordrazine"));
	$0 = $0;
	rt.setSv(f, "stage1", rt.list("Your stomach rumbles."));
	$0 = $0;
	rt.setSv(f, "stage2", rt.list("Your skin feels saggy."));
	rt.setSv(f, "stage3", rt.list("<span class='danger'>Your appendages are melting away.</span>", "<span class='danger'>Your limbs begin to lose their shape.</span>"));
	$0 = $0;
	rt.setSv(f, "stage4", rt.list("<span class='danger'>You're ravenous.</span>"));
	$0 = $0;
	rt.setSv(f, "stage5", rt.list("<span class='danger'>You have become a morph.</span>"));
	return f.dot;
});
