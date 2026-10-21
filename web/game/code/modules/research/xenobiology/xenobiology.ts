// From code/modules/research/xenobiology/xenobiology.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10137, "/obj/item/slime_extract", "/obj/item", {
	Uses: 1,
	qdel_timer: null,
	w_class: 1,
	throw_speed: 3,
	throw_range: 6,
	origin_tech: "biotech=3",
	container_type: 1024,
	name: "slime extract",
	desc: "Goo extracted from a slime. Legends claim these to have \"magical powers\".",
	icon: rt.rsc("icons/mob/slimes.dmi"),
	icon_state: "grey slime extract",
	force: 1,
	throwforce: 0,
});

// /obj/item/slime_extract/proc/attackby  (code/modules/research/xenobiology/xenobiology.dm:20)  may sleep
rt.def("/obj/item/slime_extract/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/slimepotion/enhancer")) ? 1 : 0))) {
		if (rt.ge(rt.sv(f, "Uses"), 5)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You cannot enhance this extract further!</span>"]);
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You apply the enhancer to the slime extract. It may now be reused one more time.</span>"]);
		rt.incSrcVar(f, "Uses", 1, true);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["O", "user"] });

// /obj/item/slime_extract/proc/Initialize  (code/modules/research/xenobiology/xenobiology.dm:30)  may sleep
rt.def("/obj/item/slime_extract/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "create_reagents", 100);
	return f.dot;
}, true);

rt.type(10093, "/obj/item/slimepotion", "/obj/item", {
	w_class: 1,
	origin_tech: "biotech=4",
	name: "slime potion",
	desc: "A hard yet gelatinous capsule excreted by a slime, containing mysterious substances.",
});

// /obj/item/slimepotion/proc/afterattack  (code/modules/research/xenobiology/xenobiology.dm:130)
rt.def("/obj/item/slimepotion/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	if (!truthy((rt.istype(live(target), T("/obj/item/weapon/reagent_containers")) ? 1 : 0))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You cannot transfer ＀ to ＀! It appears the potion must be given directly to a slime to absorb.</span>", [live(f.src), live(target)])]);
	return live(f.dot);
});

rt.type(10096, "/obj/item/slimepotion/docility", "/obj/item/slimepotion", {
	name: "docility potion",
	desc: "A potent chemical mix that nullifies a slime's hunger, causing it to become docile and tame.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potsilver",
});

// /obj/item/slimepotion/docility/proc/attack  (code/modules/research/xenobiology/xenobiology.dm:141)  may sleep
rt.def("/obj/item/slimepotion/docility/proc/attack", function* attack(f: Frame) {
	let newname: Value = null;
	f.vars = () => [newname];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The potion only works on slimes!</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(rt.fv(f, "stat", live(f.args[0])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The slime is dead!</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	rt.setFv(f, "docile", live(f.args[0]), 1);
	rt.setFv(f, "nutrition", live(f.args[0]), 700);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You absorb the potion and feel your intense desire to feed melt away.</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You feed the slime the potion, removing its hunger and calming it.</span>"]);
	if (!truthy((newname = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], ["pet slime", "Name your new pet", "Would you like to give the slime a name?", live(f.args[1]), null]))])), 1, 42]))))) {
		newname = "pet slime";
	}
	rt.setFv(f, "name", live(f.args[0]), live(newname));
	rt.setFv(f, "real_name", live(f.args[0]), live(newname));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(10094, "/obj/item/slimepotion/sentience", "/obj/item/slimepotion", {
	not_interested: null,
	being_used: 0,
	sentience_type: 1,
	origin_tech: "biotech=6",
	name: "intelligence potion",
	desc: "A miraculous chemical mix that grants human like intelligence to living beings.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potpink",
});

// /obj/item/slimepotion/sentience/proc/<init>  (code/modules/research/xenobiology/xenobiology.dm:166)
rt.def("/obj/item/slimepotion/sentience/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "not_interested", rt.list());
	return f.dot;
});

// /obj/item/slimepotion/sentience/proc/afterattack  (code/modules/research/xenobiology/xenobiology.dm:171)  may sleep
rt.def("/obj/item/slimepotion/sentience/proc/afterattack", function* afterattack(f: Frame) {
	let SM: Value = null, candidates: Value = null, theghost: Value = null;
	f.vars = () => [SM, candidates, theghost];
	if ((truthy(rt.sv(f, "being_used")) || !truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])]))))) {
		return live(f.dot);
	}
	if ((!truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal")) ? 1 : 0)) || truthy(rt.fv(f, "ckey", live(f.args[0]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is already too intelligent for this to work!</span>", [live(f.args[0])])]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(rt.fv(f, "stat", live(f.args[0])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is dead!</span>", [live(f.args[0])])]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!isEqual(rt.gv(f, "sentience_type", (SM = live(f.args[0]))), rt.sv(f, "sentience_type"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ won't work on ＀.</span>", [live(f.src), live(SM)])]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You offer ＀ to ＀...</span>", [live(f.src), live(SM)])]);
	rt.setSv(f, "being_used", 1);
	candidates = (yield* g.call(f, P("/proc/pollCandidatesForMob"), null, [fmt("Do you want to play as ＀?", [rt.fv(f, "name", live(SM))]), "xenomorph", null, "xenomorph", 50, live(SM), "sentience_potion"]));
	theghost = null;
	if (truthy(rt.len(f, live(candidates)))) {
		theghost = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
		rt.setFv(f, "key", live(SM), rt.fv(f, "key", live(theghost)));
		yield* g.callName(f, rt.fv(f, "mind", live(SM)), "enslave_mind_to_creator", [live(f.args[1])]);
		yield* g.callName(f, live(SM), "sentience_act", []);
		yield* g.call(f, P("/proc/to_chat"), null, [live(SM), "<span class='warning'>All at once it makes sense: you know what you are and who you are! Self awareness is yours!</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(SM), fmt("<span class='userdanger'>You are grateful to be self aware and owe ＀ a great debt. Serve ＀, and assist ＀ in completing ＀ goals at any cost.</span>", [live(f.args[1]), live(f.args[1]), (yield* g.callName(f, live(f.args[1]), "p_them", [])), (yield* g.callName(f, live(f.args[1]), "p_their", []))])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ accepts ＀ and suddenly becomes attentive and aware. It worked!</span>", [live(SM), live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ looks interested for a moment, but then looks back down. Maybe you should try again later.</span>", [live(SM)])]);
		rt.setSv(f, "being_used", 0);
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(10097, "/obj/item/slimepotion/transference", "/obj/item/slimepotion", {
	prompted: 0,
	animal_type: 1,
	origin_tech: "biotech=6",
	name: "consciousness transference potion",
	desc: "A strange slime-based chemical that, when used, allows the user to transfer their consciousness to a lesser being.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potorange",
});

// /obj/item/slimepotion/transference/proc/afterattack  (code/modules/research/xenobiology/xenobiology.dm:215)  may sleep
rt.def("/obj/item/slimepotion/transference/proc/afterattack", function* afterattack(f: Frame) {
	let SM: Value = null;
	f.vars = () => [SM];
	if ((truthy(rt.sv(f, "prompted")) || !truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])]))))) {
		return live(f.dot);
	}
	if ((!truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal")) ? 1 : 0)) || truthy(rt.fv(f, "ckey", live(f.args[0]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ already has a higher consciousness!</span>", [live(f.args[0])])]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(rt.fv(f, "stat", live(f.args[0])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is dead!</span>", [live(f.args[0])])]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!isEqual(rt.gv(f, "sentience_type", (SM = live(f.args[0]))), rt.sv(f, "animal_type"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You cannot transfer your consciousness to ＀.</span>", [live(SM)])]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(f.args[1]), "xenomorph"])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Your mind goes blank as you attempt to use the potion.</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "prompted", 1);
	if (isEqual((yield* g.call(f, P("/proc/alert"), null, [fmt("This will permanently transfer your consciousness to ＀. Are you sure you want to do this?", [live(SM)]), null, "Yes", "No"])), "No")) {
		rt.setSv(f, "prompted", 0);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You drink the potion then place your hands on ＀...</span>", [live(SM)])]);
	yield* g.callName(f, rt.fv(f, "mind", live(f.args[1])), "transfer_to", [live(SM)]);
	rt.setFv(f, "faction", live(SM), (yield* g.callName(f, rt.fv(f, "faction", live(f.args[1])), "Copy", [])));
	yield* g.callName(f, live(SM), "sentience_act", []);
	yield* g.callName(f, live(f.args[1]), "death", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(SM), fmt("<span class='notice'>In a quick flash, you feel your consciousness flow into ＀!</span>", [live(SM)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(SM), fmt("<span class='warning'>You are now ＀. Your allegiances, alliances, and role is still the same as it was prior to consciousness transfer!</span>", [live(SM)])]);
	rt.setFv(f, "name", live(SM), fmt("＀ as ＀", [rt.fv(f, "name", live(SM)), rt.fv(f, "real_name", live(f.args[1]))]));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(10098, "/obj/item/slimepotion/steroid", "/obj/item/slimepotion", {
	name: "slime steroid",
	desc: "A potent chemical mix that will cause a baby slime to generate more extract.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potred",
});

// /obj/item/slimepotion/steroid/proc/attack  (code/modules/research/xenobiology/xenobiology.dm:255)  may sleep
rt.def("/obj/item/slimepotion/steroid/proc/attack", function* attack(f: Frame) {
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The steroid only works on baby slimes!</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(rt.fv(f, "is_adult", live(f.args[0])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Only baby slimes can use the steroid!</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(rt.fv(f, "stat", live(f.args[0])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The slime is dead!</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (rt.ge(rt.fv(f, "cores", live(f.args[0])), 5)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The slime already has the maximum amount of extract!</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You feed the slime the steroid. It will now produce one more extract.</span>"]);
	rt.incField(f, live(f.args[0]), "cores", 1, true);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(10100, "/obj/item/slimepotion/stabilizer", "/obj/item/slimepotion", {
	name: "slime stabilizer",
	desc: "A potent chemical mix that will reduce the chance of a slime mutating.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potcyan",
});

// /obj/item/slimepotion/stabilizer/proc/attack  (code/modules/research/xenobiology/xenobiology.dm:285)  may sleep
rt.def("/obj/item/slimepotion/stabilizer/proc/attack", function* attack(f: Frame) {
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The stabilizer only works on slimes!</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(rt.fv(f, "stat", live(f.args[0])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The slime is dead!</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (isEqual(rt.fv(f, "mutation_chance", live(f.args[0])), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The slime already has no chance of mutating!</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You feed the slime the stabilizer. It is now less likely to mutate.</span>"]);
	rt.setFv(f, "mutation_chance", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [subtract(rt.fv(f, "mutation_chance", live(f.args[0])), 15), 100]))])));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(10101, "/obj/item/slimepotion/mutator", "/obj/item/slimepotion", {
	name: "slime mutator",
	desc: "A potent chemical mix that will increase the chance of a slime mutating.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potgreen",
});

// /obj/item/slimepotion/mutator/proc/attack  (code/modules/research/xenobiology/xenobiology.dm:306)  may sleep
rt.def("/obj/item/slimepotion/mutator/proc/attack", function* attack(f: Frame) {
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The mutator only works on slimes!</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(rt.fv(f, "stat", live(f.args[0])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The slime is dead!</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(rt.fv(f, "mutator_used", live(f.args[0])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This slime has already consumed a mutator, any more would be far too unstable!</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (isEqual(rt.fv(f, "mutation_chance", live(f.args[0])), 100)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The slime is already guaranteed to mutate!</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You feed the slime the mutator. It is now more likely to mutate.</span>"]);
	rt.setFv(f, "mutation_chance", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "mutation_chance", live(f.args[0])), 12), 100]))])));
	rt.setFv(f, "mutator_used", live(f.args[0]), 1);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(10102, "/obj/item/slimepotion/speed", "/obj/item/slimepotion", {
	origin_tech: "biotech=5",
	name: "slime speed potion",
	desc: "A potent chemical mix that will remove the slowdown from any item.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potyellow",
});

// /obj/item/slimepotion/speed/proc/afterattack  (code/modules/research/xenobiology/xenobiology.dm:332)  may sleep
rt.def("/obj/item/slimepotion/speed/proc/afterattack", function* afterattack(f: Frame) {
	let I: Value = null, V: Value = null, R: Value = null;
	f.vars = () => [I, V, R];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/obj")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The potion can only be used on items or vehicles!</span>"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) {
		if (rt.le(rt.gv(f, "slowdown", (I = live(f.args[0]))), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ can't be made any faster!</span>", [live(f.args[0])])]);
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
		rt.setFv(f, "slowdown", live(I), 0);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/vehicle")) ? 1 : 0))) {
		V = live(f.args[0]);
		R = rt.fv(f, "riding_datum", live(V));
		if (truthy(rt.fv(f, "riding_datum", live(V)))) {
			if (rt.le(rt.fv(f, "vehicle_move_delay", live(R)), 0)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ can't be made any faster!</span>", [live(f.args[0])])]);
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
			rt.setFv(f, "vehicle_move_delay", live(R), 0);
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You slather the red gunk over the ＀, making it faster.</span>", [live(f.args[0])])]);
	yield* g.callName(f, live(f.args[0]), "remove_atom_colour", [3]);
	yield* g.callName(f, live(f.args[0]), "add_atom_colour", ["#FF0000", 4]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["C", "user"] });

rt.type(10103, "/obj/item/slimepotion/fireproof", "/obj/item/slimepotion", {
	uses: 3,
	origin_tech: "biotech=5",
	name: "slime chill potion",
	desc: "A potent chemical mix that will fireproof any article of clothing. Has three uses.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potblue",
});

// /obj/item/slimepotion/fireproof/proc/afterattack  (code/modules/research/xenobiology/xenobiology.dm:367)  may sleep
rt.def("/obj/item/slimepotion/fireproof/proc/afterattack", function* afterattack(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "uses"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The potion can only be used on clothing!</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "max_heat_protection_temperature", live(f.args[0])), 35000)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ is already fireproof!</span>", [live(f.args[0])])]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You slather the blue gunk over the ＀, fireproofing it.</span>", [live(f.args[0])])]);
	rt.setFv(f, "name", live(f.args[0]), fmt("fireproofed ＀", [rt.fv(f, "name", live(f.args[0]))]));
	yield* g.callName(f, live(f.args[0]), "remove_atom_colour", [3]);
	yield* g.callName(f, live(f.args[0]), "add_atom_colour", ["#000080", 4]);
	rt.setFv(f, "max_heat_protection_temperature", live(f.args[0]), 35000);
	rt.setFv(f, "heat_protection", live(f.args[0]), rt.fv(f, "body_parts_covered", live(f.args[0])));
	(rt.modField(f, live(f.args[0]), "resistance_flags", 2, rt.bitOr));
	rt.incSrcVar(f, "uses", -1, true);
	if (truthy(rt.sv(f, "uses"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["C", "user"] });

rt.type(10104, "/obj/item/slimepotion/genderchange", "/obj/item/slimepotion", {
	name: "gender change potion",
	desc: "An interesting chemical mix that changes the biological gender of what its applied to. Cannot be used on things that lack gender entirely.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potlightpink",
});

// /obj/item/slimepotion/genderchange/proc/attack  (code/modules/research/xenobiology/xenobiology.dm:395)  may sleep
rt.def("/obj/item/slimepotion/genderchange/proc/attack", function* attack(f: Frame, L: Value, user: Value) {
	f.vars = () => [L, user];
	if ((!truthy((rt.istype(live(L), T("/mob/living")) ? 1 : 0)) || isEqual(rt.fv(f, "stat", live(L)), 2))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The potion can only be used on living things!</span>"]);
		return live(f.dot);
	}
	if ((!isEqual(rt.fv(f, "gender", live(L)), "male") && !isEqual(rt.fv(f, "gender", live(L)), "female"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The potion can only be used on gendered things!</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "gender", live(L)), "male")) {
		rt.setFv(f, "gender", live(L), "female");
		yield* g.callName(f, live(L), "visible_message", [fmt("<span class='boldnotice'>＀ suddenly looks more feminine!</span>", [live(L)]), "<span class='boldwarning'>You suddenly feel more feminine!</span>"]);
	} else {
		rt.setFv(f, "gender", live(L), "male");
		yield* g.callName(f, live(L), "visible_message", [fmt("<span class='boldnotice'>＀ suddenly looks more masculine!</span>", [live(L)]), "<span class='boldwarning'>You suddenly feel more masculine!</span>"]);
	}
	yield* g.callName(f, live(L), "regenerate_icons", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12095, "/obj/effect/golemrune", "/obj/effect", {
	anchored: 1,
	desc: "a strange rune used to create golems. It glows when spirits are nearby.",
	name: "rune",
	icon: rt.rsc("icons/obj/rune.dmi"),
	icon_state: "golem",
	resistance_flags: 51,
	layer: 2,
});

// /obj/effect/golemrune/proc/Initialize  (code/modules/research/xenobiology/xenobiology.dm:487)  may sleep
rt.def("/obj/effect/golemrune/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("Golem rune created in ＀.", [(yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))]), null, rt.rsc("sound/effects/ghost2.ogg"), "source", live(f.src)], rt.Args.Named);
	return f.dot;
}, true);

// /obj/effect/golemrune/proc/Destroy  (code/modules/research/xenobiology/xenobiology.dm:492)  may sleep
rt.def("/obj/effect/golemrune/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/golemrune/proc/process  (code/modules/research/xenobiology/xenobiology.dm:497)
rt.def("/obj/effect/golemrune/proc/process", function process(f: Frame) {
	let ghost: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [ghost, O, $e];
	ghost = null;
	O = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (!truthy(rt.fv(f, "client", live(O)))) {
			continue;
		}
		if (((truthy(rt.fv(f, "mind", live(O))) && truthy(rt.gv(f, "current", rt.fv(f, "mind", live(O))))) && !isEqual(rt.gv(f, "stat", rt.gv(f, "current", rt.fv(f, "mind", live(O)))), 2))) {
			continue;
		}
		if (truthy(rt.fv(f, "orbiting", live(O)))) {
			continue;
		}
		ghost = live(O);
		break;
	}
	rt.endFor(f, 0);
	if (truthy(live(ghost))) {
		rt.setSv(f, "icon_state", "golem2");
	} else {
		rt.setSv(f, "icon_state", "golem");
	}
	return f.dot;
}, false, { waitfor: false });

// /obj/effect/golemrune/proc/attack_hand  (code/modules/research/xenobiology/xenobiology.dm:513)  may sleep
rt.def("/obj/effect/golemrune/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let ghost: Value = null, O: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [user, ghost, O, G, $e];
	ghost = null;
	O = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (!truthy(rt.fv(f, "client", live(O)))) {
			continue;
		}
		if (((truthy(rt.fv(f, "mind", live(O))) && truthy(rt.gv(f, "current", rt.fv(f, "mind", live(O))))) && !isEqual(rt.gv(f, "stat", rt.gv(f, "current", rt.fv(f, "mind", live(O)))), 2))) {
			continue;
		}
		if (truthy(rt.fv(f, "orbiting", live(O)))) {
			continue;
		}
		ghost = live(O);
		break;
	}
	rt.endFor(f, 0);
	if (!truthy(live(ghost))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The rune fizzles uselessly! There is no spirit nearby.</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, (G = (yield* g.new_(f, T("/mob/living/carbon/human"), []))), "set_species", [T("/datum/species/golem/adamantine")]);
	yield* g.callName(f, live(G), "set_cloned_appearance", []);
	rt.setFv(f, "real_name", live(G), (yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", live(G))), "random_name", [])));
	rt.setFv(f, "name", live(G), rt.fv(f, "real_name", live(G)));
	rt.setFv(f, "unique_enzymes", rt.fv(f, "dna", live(G)), (yield* g.callName(f, rt.fv(f, "dna", live(G)), "generate_unique_enzymes", [])));
	yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", live(G))), "auto_equip", [live(G)]);
	rt.setFv(f, "loc", live(G), rt.fv(f, "loc", live(f.src)));
	rt.setFv(f, "key", live(G), rt.fv(f, "key", live(ghost)));
	yield* g.call(f, P("/proc/to_chat"), null, [live(G), fmt("You are an adamantine golem. You move slowly, but are highly resistant to heat and cold as well as blunt trauma. You are unable to wear clothes, but can still use most tools. Serve ＀, and assist ＀ in completing their goals at any cost.", [live(user), (yield* g.callName(f, live(user), "p_them", []))])]);
	yield* g.callName(f, rt.fv(f, "mind", live(G)), "store_memory", [fmt("<b>Serve ＀, your creator.</b>", [rt.fv(f, "real_name", live(user))])]);
	yield* g.callName(f, rt.fv(f, "mind", live(G)), "enslave_mind_to_creator", [live(user)]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ was made a golem by ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(G)])), (yield* g.call(f, P("/proc/key_name"), null, [live(user)]))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ was made a golem by ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(G)])), (yield* g.call(f, P("/proc/key_name"), null, [live(user)]))])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12096, "/obj/effect/timestop", "/obj/effect", {
	immune: null,
	stopped_atoms: null,
	freezerange: 2,
	duration: 140,
	anchored: 1,
	name: "chronofield",
	desc: "ZA WARUDO",
	icon: rt.rsc("icons/effects/160x160.dmi"),
	icon_state: "time",
	layer: 5,
	pixel_x: -64,
	pixel_y: -64,
	mouse_opacity: 0,
	alpha: 125,
});

// /obj/effect/timestop/proc/<init>  (code/modules/research/xenobiology/xenobiology.dm:557)
rt.def("/obj/effect/timestop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "immune", rt.list());
	$0 = $0;
	rt.setSv(f, "stopped_atoms", rt.list());
	return f.dot;
});

// /obj/effect/timestop/proc/Initialize  (code/modules/research/xenobiology/xenobiology.dm:564)
rt.def("/obj/effect/timestop/proc/Initialize", function Initialize(f: Frame) {
	let M: Value = null, L: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [M, L, _T, $e];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	M = null;
	rt.forList(f, 0, rt.gl("living_mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		L = live(M);
		_T = null;
		rt.forList(f, 1, rt.gv(f, "spell_list", rt.fv(f, "mind", live(L))), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/timestop"));
		while (($e = rt.next(f, 1)) !== undefined) {
			_T = $e;
			(rt.modSrcVar(f, "immune", live(L), rt.bitOr));
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "timestop", []);
	return f.dot;
});

// /obj/effect/timestop/proc/timestop  (code/modules/research/xenobiology/xenobiology.dm:574)  may sleep
rt.def("/obj/effect/timestop/proc/timestop", function* timestop(f: Frame) {
	let i: Value = null, A: Value = null, M: Value = null, H: Value = null, _P: Value = null, M_1: Value = null, M_0: Value = null, _P_0: Value = null;
	let $e: any;
	f.vars = () => [i, A, M, H, _P, M_1, M_0, _P_0, $e];
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/timeparadox2.ogg"), 100, 1, -1]);
	i = null;
	rt.forRange(f, 0, 1, subtract(rt.sv(f, "duration"), 1), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		A = null;
		rt.forList(f, 1, (yield* g.call(f, P("/proc/orange"), null, [rt.sv(f, "freezerange"), rt.fv(f, "loc", live(f.src))])), T("/atom"));
		while (($e = rt.next(f, 1)) !== undefined) {
			A = $e;
			if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
				if (truthy((rt.isIn(f, (M = live(A)), rt.sv(f, "immune")) ? 1 : 0))) {
					continue;
				}
				yield* g.callName(f, live(M), "Stun", [200, 1, 1]);
				rt.setFv(f, "anchored", live(M), 1);
				if (truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile")) ? 1 : 0))) {
					rt.setFv(f, "AIStatus", (H = live(M)), 3);
					yield* g.callName(f, live(H), "LoseTarget", []);
				}
				(rt.modSrcVar(f, "stopped_atoms", live(M), rt.bitOr));
			} else {
				if (truthy((rt.istype(live(A), T("/obj/item/projectile")) ? 1 : 0))) {
					rt.setFv(f, "paused", (_P = live(A)), 1);
					(rt.modSrcVar(f, "stopped_atoms", live(_P), rt.bitOr));
				}
			}
		}
		rt.endFor(f, 1);
		M_1 = null;
		rt.forList(f, 1, rt.sv(f, "stopped_atoms"), T("/mob/living"));
		while (($e = rt.next(f, 1)) !== undefined) {
			M_1 = $e;
			if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [rt.getStep(f, live(M_1), 0), rt.getStep(f, live(f.src), 0)])), rt.sv(f, "freezerange"))) {
				yield* g.srcCall(f, "unfreeze_mob", live(M_1));
				(rt.modSrcVar(f, "stopped_atoms", live(M_1), subtract));
			}
		}
		rt.endFor(f, 1);
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	rt.endFor(f, 0);
	M_0 = null;
	rt.forList(f, 0, rt.sv(f, "stopped_atoms"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M_0 = $e;
		yield* g.srcCall(f, "unfreeze_mob", live(M_0));
	}
	rt.endFor(f, 0);
	_P_0 = null;
	rt.forList(f, 0, rt.sv(f, "stopped_atoms"), T("/obj/item/projectile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P_0 = $e;
		rt.setFv(f, "paused", live(_P_0), 0);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true, { waitfor: false });

// /obj/effect/timestop/proc/unfreeze_mob  (code/modules/research/xenobiology/xenobiology.dm:611)  may sleep
rt.def("/obj/effect/timestop/proc/unfreeze_mob", function* unfreeze_mob(f: Frame, M: Value) {
	let H: Value = null;
	f.vars = () => [M, H];
	yield* g.callName(f, live(M), "AdjustStun", [-200, 1, 1]);
	rt.setFv(f, "anchored", live(M), 0);
	if (!truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "AIStatus", (H = live(M)), rt.initial(f, live(H), "AIStatus"));
	return f.dot;
}, true);

rt.type(9004, "/obj/item/stack/tile/bluespace", "/obj/item/stack/tile", {
	throw_speed: 3,
	throw_range: 7,
	flags: 64,
	turf_type: rt.typePath("/turf/open/floor/bluespace"),
	name: "bluespace floor tile",
	singular_name: "floor tile",
	desc: "Through a series of micro-teleports these tiles let people move at incredible speeds",
	icon_state: "tile-bluespace",
	w_class: 3,
	force: 6,
	materials: null,
	throwforce: 10,
	max_amount: 60,
});

// /obj/item/stack/tile/bluespace/proc/<init>  (code/modules/research/xenobiology/xenobiology.dm:629)
rt.def("/obj/item/stack/tile/bluespace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500]));
	return f.dot;
});

rt.type(9005, "/obj/item/stack/tile/sepia", "/obj/item/stack/tile", {
	throw_speed: 3,
	throw_range: 7,
	flags: 64,
	turf_type: rt.typePath("/turf/open/floor/sepia"),
	name: "sepia floor tile",
	singular_name: "floor tile",
	desc: "Time seems to flow very slowly around these tiles",
	icon_state: "tile-sepia",
	w_class: 3,
	force: 6,
	materials: null,
	throwforce: 10,
	max_amount: 60,
});

// /obj/item/stack/tile/sepia/proc/<init>  (code/modules/research/xenobiology/xenobiology.dm:645)
rt.def("/obj/item/stack/tile/sepia/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500]));
	return f.dot;
});

rt.type(9654, "/obj/item/areaeditor/blueprints/slime", "/obj/item/areaeditor/blueprints", {
	name: "cerulean prints",
	desc: "A one use yet of blueprints made of jelly like organic material. Renaming an area to 'Xenobiology Lab' will extend the reach of the management console.",
	color: "#2956B2",
});

// /obj/item/areaeditor/blueprints/slime/proc/edit_area  (code/modules/research/xenobiology/xenobiology.dm:660)  may sleep
rt.def("/obj/item/areaeditor/blueprints/slime/proc/edit_area", function* edit_area(f: Frame) {
	let success: Value = null, A: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [success, A, _T, $e];
	success = (yield* g.callSuper(f, [], rt.Args.Same));
	A = (yield* g.srcCall(f, "get_area", live(f.src)));
	if (!truthy(live(success))) return f.dot;
	_T = null;
	rt.forList(f, 0, live(A), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.callName(f, live(_T), "remove_atom_colour", [3]);
		yield* g.callName(f, live(_T), "add_atom_colour", ["#2956B2", 4]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
