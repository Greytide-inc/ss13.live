// From code/game/gamemodes/cult/talisman.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6563, "/obj/item/weapon/paper/talisman", "/obj/item/weapon/paper", {
	cultist_name: "talisman",
	cultist_desc: "A basic talisman. It serves no purpose.",
	invocation: "Naise meam!",
	uses: 1,
	health_cost: 0,
	creation_time: 100,
});

// /obj/item/weapon/paper/talisman/proc/examine  (code/game/gamemodes/cult/talisman.dm:10)
rt.def("/obj/item/weapon/paper/talisman/proc/examine", function examine(f: Frame, user: Value) {
	if ((truthy(rt.call(f, P("/proc/iscultist"), null, [live(user)])) || isEqual(rt.fv(f, "stat", live(user)), 2))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<b>Name:</b> ＀", [rt.sv(f, "cultist_name")])]);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<b>Effect:</b> ＀", [rt.sv(f, "cultist_desc")])]);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<b>Uses Remaining:</b> ＀", [rt.sv(f, "uses")])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>There are indecipherable images scrawled on the paper in what looks to be... <i>blood?</i></span>"]);
	}
	return f.dot;
});

// /obj/item/weapon/paper/talisman/proc/attack_self  (code/game/gamemodes/cult/talisman.dm:18)  may sleep
rt.def("/obj/item/weapon/paper/talisman/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>There are indecipherable images scrawled on the paper in what looks to be... <i>blood?</i></span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "invoke", live(user))))) {
		rt.incSrcVar(f, "uses", -1, true);
	}
	if (!rt.le(rt.sv(f, "uses"), 0)) return f.dot;
	yield* g.callName(f, live(user), "drop_item", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/paper/talisman/proc/invoke  (code/game/gamemodes/cult/talisman.dm:28)  may sleep
rt.def("/obj/item/weapon/paper/talisman/proc/invoke", function* invoke(f: Frame, user: Value, successfuluse: Value) {
	let C: Value = null;
	f.vars = () => [user, successfuluse, C];
	if (live(successfuluse) === null) {
		successfuluse = 1;
	}
	f.dot = live(successfuluse);
	if (!truthy(live(successfuluse))) return f.dot;
	if (truthy(rt.sv(f, "invocation"))) {
		yield* g.callName(f, live(user), "whisper", [null, rt.sv(f, "invocation"), "language", T("/datum/language/common")], rt.Args.Named);
	}
	if (!(truthy(rt.sv(f, "health_cost")) && truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (C = live(user)), "apply_damage", [rt.sv(f, "health_cost"), "brute", rt.op(f, "PickUnweighted", [2], ["l_arm", "r_arm"])]);
	return f.dot;
}, true);

rt.type(6566, "/obj/item/weapon/paper/talisman/malformed", "/obj/item/weapon/paper/talisman", {
	cultist_name: "malformed talisman",
	cultist_desc: "A talisman with gibberish scrawlings. No good can come from invoking this.",
	invocation: "Ra'sha yoka!",
});

// /obj/item/weapon/paper/talisman/malformed/proc/invoke  (code/game/gamemodes/cult/talisman.dm:43)  may sleep
rt.def("/obj/item/weapon/paper/talisman/malformed/proc/invoke", function* invoke(f: Frame, user: Value, successfuluse: Value) {
	let C: Value = null;
	f.vars = () => [user, successfuluse, C];
	if (live(successfuluse) === null) {
		successfuluse = 1;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='cultitalic'>You feel a pain in your head. The Geometer is displeased.</span>"]);
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (C = live(user)), "apply_damage", [10, "brute", "head"]);
	return f.dot;
}, true);

rt.type(6567, "/obj/item/weapon/paper/talisman/teleport", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Teleportation",
	cultist_desc: "A single-use talisman that will teleport a user to a random rune of the same keyword.",
	invocation: "Sas'so c'arta forbici!",
	health_cost: 5,
	creation_time: 80,
	color: "#551A8B",
});

// /obj/item/weapon/paper/talisman/teleport/proc/invoke  (code/game/gamemodes/cult/talisman.dm:58)  may sleep
rt.def("/obj/item/weapon/paper/talisman/teleport/proc/invoke", function* invoke(f: Frame) {
	let potential_runes: Value = null, teleportnames: Value = null, R: Value = null, _T: Value = null, input_rune_key: Value = null, actual_selected_rune: Value = null, target: Value = null;
	let $e: any;
	f.vars = () => [potential_runes, teleportnames, R, _T, input_rune_key, actual_selected_rune, target, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	potential_runes = rt.list();
	teleportnames = rt.list();
	R = null;
	rt.forList(f, 0, rt.gl("teleport_runes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		_T = live(R);
		rt.setAt(live(potential_runes), (yield* g.call(f, P("/proc/avoid_assoc_duplicate_keys"), null, [rt.fv(f, "listkey", live(_T)), live(teleportnames)])), live(_T));
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(potential_runes)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>There are no valid runes to teleport to!</span>"]);
		yield* g.call(f, P("/proc/log_game"), null, ["Teleport talisman failed - no other teleport runes"]);
		return (yield* g.callSuper(f, [live(f.args[0]), 0]));
	}
	if (rt.gt(rt.fv(f, "z", live(f.args[0])), 12)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cultitalic'>You are not in the right dimension!</span>"]);
		yield* g.call(f, P("/proc/log_game"), null, ["Teleport talisman failed - user in away mission"]);
		return (yield* g.callSuper(f, [live(f.args[0]), 0]));
	}
	input_rune_key = (yield* g.op(f, "Prompt", [1], [null, "Rune to Teleport to", "Choose a rune to teleport to.", live(f.args[0]), live(potential_runes)]));
	actual_selected_rune = rt.index(live(potential_runes), live(input_rune_key));
	if ((((((!truthy(live(f.src)) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || !truthy(live(f.args[0]))) || !truthy((yield* g.callName(f, live(f.args[0]), "is_holding", [live(f.src)])))) || truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", [])))) || !truthy(live(actual_selected_rune)))) {
		return (yield* g.callSuper(f, [live(f.args[0]), 0]));
	}
	if (truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [(target = rt.getStep(f, live(actual_selected_rune), 0)), 1])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The target rune is blocked. Attempting to teleport to it would be massively unwise.</span>"]);
		return (yield* g.callSuper(f, [live(f.args[0]), 0]));
	}
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>Dust flows from ＀'s hand, and ＀ disappear＀ with a sharp crack!</span>", [live(f.args[0]), (yield* g.callName(f, live(f.args[0]), "p_they", [])), (yield* g.callName(f, live(f.args[0]), "p_s", []))]), "<span class='cultitalic'>You speak the words of the talisman and find yourself somewhere else!</span>", "<i>You hear a sharp crack.</i>"]);
	yield* g.callName(f, live(f.args[0]), "forceMove", [live(target)]);
	yield* g.callName(f, live(target), "visible_message", ["<span class='warning'>There is a boom of outrushing air as something appears above the rune!</span>", null, "<i>You hear a boom.</i>"]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "successfuluse"] });

rt.type(6568, "/obj/item/weapon/paper/talisman/summon_tome", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Tome Summoning",
	cultist_desc: "A one-use talisman that will call an untranslated tome from the archives of the Geometer.",
	invocation: "N'ath reth sh'yro eth d'raggathnor!",
	health_cost: 1,
	creation_time: 30,
	color: "#512727",
});

// /obj/item/weapon/paper/talisman/summon_tome/proc/invoke  (code/game/gamemodes/cult/talisman.dm:98)  may sleep
rt.def("/obj/item/weapon/paper/talisman/summon_tome/proc/invoke", function* invoke(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀'s hand glows red for a moment.</span>", [live(f.args[0])]), "<span class='cultitalic'>You speak the words of the talisman!</span>"]);
	yield* g.new_(f, T("/obj/item/weapon/tome"), [rt.getStep(f, live(f.args[0]), 0)]);
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>A tome appears at ＀'s feet!</span>", [live(f.args[0])]), "<span class='cultitalic'>An arcane tome materializes at your feet.</span>"]);
	return f.dot;
}, true, { args: ["user", "successfuluse"] });

rt.type(6569, "/obj/item/weapon/paper/talisman/true_sight", "/obj/item/weapon/paper/talisman", {
	revealing: 0,
	cultist_name: "Talisman of Veiling",
	cultist_desc: "A multi-use talisman that hides nearby runes. On its second use, will reveal nearby runes.",
	invocation: "Kla'atu barada nikt'o!",
	health_cost: 1,
	creation_time: 30,
	uses: 6,
	color: "#9c9c9c",
});

// /obj/item/weapon/paper/talisman/true_sight/proc/invoke  (code/game/gamemodes/cult/talisman.dm:116)  may sleep
rt.def("/obj/item/weapon/paper/talisman/true_sight/proc/invoke", function* invoke(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "revealing"))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>Thin grey dust falls from ＀'s hand!</span>", [live(f.args[0])]), "<span class='cultitalic'>You speak the words of the talisman, hiding nearby runes.</span>"]);
		rt.setSv(f, "invocation", "Nikt'o barada kla'atu!");
		rt.setSv(f, "revealing", 1);
		R = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [4, live(f.args[0])])), T("/obj/effect/rune"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			yield* g.callName(f, live(R), "talismanhide", []);
		}
		rt.endFor(f, 0);
	} else {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>A flash of light shines from ＀'s hand!</span>", [live(f.args[0])]), "<span class='cultitalic'>You speak the words of the talisman, revealing nearby runes.</span>"]);
		R = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [3, live(f.args[0])])), T("/obj/effect/rune"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			yield* g.callName(f, live(R), "talismanreveal", []);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true, { args: ["user", "successfuluse"] });

rt.type(6570, "/obj/item/weapon/paper/talisman/emp", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Electromagnetic Pulse",
	cultist_desc: "A talisman that will cause a moderately-sized electromagnetic pulse.",
	invocation: "Ta'gh fara'qha fel d'amar det!",
	health_cost: 5,
	color: "#4d94ff",
});

// /obj/item/weapon/paper/talisman/emp/proc/invoke  (code/game/gamemodes/cult/talisman.dm:139)  may sleep
rt.def("/obj/item/weapon/paper/talisman/emp/proc/invoke", function* invoke(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀'s hand flashes a bright blue!</span>", [live(f.args[0])]), "<span class='cultitalic'>You speak the words of the talisman, emitting an EMP blast.</span>"]);
	yield* g.call(f, P("/proc/empulse"), null, [live(f.src), 4, 8]);
	return f.dot;
}, true, { args: ["user", "successfuluse"] });

rt.type(6571, "/obj/item/weapon/paper/talisman/stun", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Stunning",
	cultist_desc: "A talisman that will stun and inhibit speech on a single target. To use, attack target directly.",
	invocation: "Fuu ma'jin!",
	health_cost: 10,
	color: "#ff0000",
});

// /obj/item/weapon/paper/talisman/stun/proc/invoke  (code/game/gamemodes/cult/talisman.dm:155)  may sleep
rt.def("/obj/item/weapon/paper/talisman/stun/proc/invoke", function* invoke(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (truthy(live(f.args[1]))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>To use this talisman, attack the target directly.</span>"]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>There are indecipherable images scrawled on the paper in what looks to be... <i>blood?</i></span>"]);
	}
	return 0;
}, true, { args: ["user", "successfuluse"] });

// /obj/item/weapon/paper/talisman/stun/proc/attack  (code/game/gamemodes/cult/talisman.dm:163)  may sleep
rt.def("/obj/item/weapon/paper/talisman/stun/proc/attack", function* attack(f: Frame) {
	let N: Value = null, S: Value = null, C: Value = null;
	f.vars = () => [N, S, C];
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[1])])))) {
		yield* g.srcCall(f, "invoke", live(f.args[1]), 1);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ holds up ＀, which explodes in a flash of red light!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='cultitalic'>You stun ＀ with the talisman!</span>", [live(f.args[0])])]);
		if (truthy((N = rt.locateIn(f, T("/obj/item/weapon/nullrod"), live(f.args[0]))))) {
			yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀'s holy weapon absorbs the talisman's light!</span>", [live(f.args[0])]), "<span class='userdanger'>Your holy weapon absorbs the blinding light!</span>"]);
		} else {
			yield* g.callName(f, live(f.args[0]), "Knockdown", [200]);
			yield* g.callName(f, live(f.args[0]), "flash_act", [1, 1]);
			if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon")) ? 1 : 0))) {
				yield* g.callName(f, (S = live(f.args[0])), "emp_act", [1]);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
					rt.modField(f, (C = live(f.args[0])), "silent", 5, add);
					rt.modField(f, live(C), "stuttering", 15, add);
					rt.modField(f, live(C), "cultslurring", 15, add);
					yield* g.callName(f, live(C), "Jitter", [15]);
				}
			}
			if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])))) {
				yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [15]);
			}
		}
		yield* g.callName(f, live(f.args[1]), "drop_item", []);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "successfuluse"] });

rt.type(6572, "/obj/item/weapon/paper/talisman/armor", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Arming",
	cultist_desc: "A talisman that will equip the invoker with cultist equipment if there is a slot to equip it to.",
	invocation: "N'ath reth sh'yro eth draggathnor!",
	creation_time: 80,
	color: "#33cc33",
});

// /obj/item/weapon/paper/talisman/armor/proc/invoke  (code/game/gamemodes/cult/talisman.dm:200)  may sleep
rt.def("/obj/item/weapon/paper/talisman/armor/proc/invoke", function* invoke(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>Otherworldly armor suddenly appears on ＀!</span>", [live(f.args[0])]), "<span class='cultitalic'>You speak the words of the talisman, arming yourself!</span>"]);
	yield* g.callName(f, live(f.args[0]), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/culthood/alt"), [live(f.args[0])])), 11]);
	yield* g.callName(f, live(f.args[0]), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/cultrobes/alt"), [live(f.args[0])])), 13]);
	yield* g.callName(f, live(f.args[0]), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/cult/alt"), [live(f.args[0])])), 12]);
	yield* g.callName(f, live(f.args[0]), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/storage/backpack/cultpack"), [live(f.args[0])])), 1]);
	yield* g.callName(f, live(f.args[0]), "drop_item", []);
	yield* g.callName(f, live(f.args[0]), "put_in_hands", [(yield* g.new_(f, T("/obj/item/weapon/melee/cultblade"), [live(f.args[0])]))]);
	yield* g.callName(f, live(f.args[0]), "put_in_hands", [(yield* g.new_(f, T("/obj/item/weapon/restraints/legcuffs/bola/cult"), [live(f.args[0])]))]);
	return f.dot;
}, true, { args: ["user", "successfuluse"] });

// /obj/item/weapon/paper/talisman/armor/proc/attack  (code/game/gamemodes/cult/talisman.dm:212)  may sleep
rt.def("/obj/item/weapon/paper/talisman/armor/proc/attack", function* attack(f: Frame) {
	if ((truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[1])]))) && truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])]))))) {
		yield* g.callName(f, live(f.args[1]), "drop_item", []);
		yield* g.srcCall(f, "invoke", live(f.args[0]));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user"] });

rt.type(6573, "/obj/item/weapon/paper/talisman/horror", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Horrors",
	cultist_desc: "A talisman that will break the mind of the victim with nightmarish hallucinations.",
	invocation: "Lo'Nab Na'Dm!",
	creation_time: 80,
	color: "#ffb366",
});

// /obj/item/weapon/paper/talisman/horror/proc/afterattack  (code/game/gamemodes/cult/talisman.dm:229)  may sleep
rt.def("/obj/item/weapon/paper/talisman/horror/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value) {
	let H: Value = null;
	f.vars = () => [target, user, H];
	if (!(truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)]))) && rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(target)])), 7))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>You disturb ＀ with visions of madness!</span>", [live(target)])]);
	if (truthy((rt.istype(live(target), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, rt.gv(f, "reagents", (H = live(target))), "add_reagent", ["mindbreaker", 12]);
		if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(target)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<span class='userdanger'>You see a brief but horrible vision of Ratvar, rusted and scrapped, being torn apart.</span>"]);
			yield* g.callName(f, live(target), "emote", ["scream"]);
			rt.setFv(f, "confused", live(target), (yield* g.call(f, P("/proc/max"), null, [0, add(rt.fv(f, "confused", live(target)), 3)])));
			yield* g.callName(f, live(target), "flash_act", []);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(6574, "/obj/item/weapon/paper/talisman/construction", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Construction",
	cultist_desc: "Use this talisman on at least twenty-five metal sheets to create an empty construct shell",
	invocation: "Ethra p'ni dedol!",
	uses: 25,
	creation_time: 80,
	color: "#000000",
});

// /obj/item/weapon/paper/talisman/construction/proc/attack_self  (code/game/gamemodes/cult/talisman.dm:252)
rt.def("/obj/item/weapon/paper/talisman/construction/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (truthy(rt.call(f, P("/proc/iscultist"), null, [live(user)]))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>To use this talisman, place it upon a stack of metal sheets.</span>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>There are indecipherable images scrawled on the paper in what looks to be... <i>blood?</i></span>"]);
	}
	return f.dot;
});

// /obj/item/weapon/paper/talisman/construction/proc/attack  (code/game/gamemodes/cult/talisman.dm:259)  may sleep
rt.def("/obj/item/weapon/paper/talisman/construction/proc/attack", function* attack(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[1])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='cultitalic'>This talisman will only work on a stack of metal or plasteel sheets!</span>"]);
		yield* g.call(f, P("/proc/log_game"), null, ["Construct talisman failed - not a valid target"]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/paper/talisman/construction/proc/afterattack  (code/game/gamemodes/cult/talisman.dm:266)  may sleep
rt.def("/obj/item/weapon/paper/talisman/construction/proc/afterattack", function* afterattack(f: Frame) {
	let _T: Value = null, quantity: Value = null;
	f.vars = () => [_T, quantity];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(live(f.args[2])) && truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[1])]))))) return f.dot;
	_T = rt.getStep(f, live(f.args[0]), 0);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/metal")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, live(f.args[0]), "use", [25])))) {
			yield* g.new_(f, T("/obj/structure/constructshell"), [live(_T)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The talisman clings to the metal and twists it into a construct shell!</span>"]);
			rt.op(f, "Output", [], [live(f.args[1]), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/magic.ogg"), 0, 1, 25]))], false);
			yield* g.srcCall(f, "invoke", live(f.args[1]), 1);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more metal to produce a construct shell!</span>"]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/plasteel")) ? 1 : 0))) {
			(rt.modSrcVar(f, "uses", (quantity = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "amount", live(f.args[0])), rt.sv(f, "uses")]))), subtract));
			yield* g.new_(f, T("/obj/item/stack/sheet/runed_metal"), [live(_T), live(quantity)]);
			yield* g.callName(f, live(f.args[0]), "use", [live(quantity)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The talisman clings to the plasteel, transforming it into runed metal!</span>"]);
			rt.op(f, "Output", [], [live(f.args[1]), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/magic.ogg"), 0, 1, 25]))], false);
			yield* g.srcCall(f, "invoke", live(f.args[1]), 1);
			if (rt.le(rt.sv(f, "uses"), 0)) {
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The talisman must be used on metal or plasteel!</span>"]);
		}
	}
	return f.dot;
}, true, { args: ["target", "user", "proximity_flag", "click_parameters"] });

rt.type(6575, "/obj/item/weapon/paper/talisman/shackle", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Shackling",
	cultist_desc: "Use this talisman on a victim to handcuff them with dark bindings.",
	invocation: "In'totum Lig'abis!",
	uses: 6,
	color: "#B27300",
});

// /obj/item/weapon/paper/talisman/shackle/proc/invoke  (code/game/gamemodes/cult/talisman.dm:302)  may sleep
rt.def("/obj/item/weapon/paper/talisman/shackle/proc/invoke", function* invoke(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (truthy(live(f.args[1]))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>To use this talisman, attack the target directly.</span>"]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>There are indecipherable images scrawled on the paper in what looks to be... <i>blood?</i></span>"]);
	}
	return 0;
}, true, { args: ["user", "successfuluse"] });

// /obj/item/weapon/paper/talisman/shackle/proc/attack  (code/game/gamemodes/cult/talisman.dm:310)  may sleep
rt.def("/obj/item/weapon/paper/talisman/shackle/proc/attack", function* attack(f: Frame) {
	if ((truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[1])]))) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)))) {
		if (isEqual(rt.fv(f, "stat", live(f.args[0])), 2)) {
			yield* g.callName(f, live(f.args[1]), "visible_message", ["<span class='cultitalic'>This talisman's magic does not affect the dead!</span>"]);
			return live(f.dot);
		}
		yield* g.srcCall(f, "CuffAttack", live(f.args[0]), live(f.args[1]));
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/paper/talisman/shackle/proc/CuffAttack  (code/game/gamemodes/cult/talisman.dm:319)  may sleep
rt.def("/obj/item/weapon/paper/talisman/shackle/proc/CuffAttack", function* CuffAttack(f: Frame, C: Value, user: Value) {
	f.vars = () => [C, user];
	if (!truthy(rt.fv(f, "handcuffed", live(C)))) {
		yield* g.srcCall(f, "invoke", live(user), 1);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/cablecuff.ogg"), 30, 1, -2]);
		yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ begins restraining ＀ with dark magic!</span>", [live(user), live(C)]), fmt("<span class='userdanger'>＀ begins shaping a dark magic around your wrists!</span>", [live(user)])]);
		if (truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(C), 30])))) {
			if (!truthy(rt.fv(f, "handcuffed", live(C)))) {
				rt.setFv(f, "handcuffed", live(C), (yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs/energy/cult/used"), [live(C)])));
				yield* g.callName(f, live(C), "update_handcuffed", []);
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You shackle ＀.</span>", [live(C)])]);
				yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(C), "handcuffed"]);
				rt.incSrcVar(f, "uses", -1, true);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is already bound.</span>", [live(C)])]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You fail to shackle ＀.</span>", [live(C)])]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is already bound.</span>", [live(C)])]);
	}
	if (!rt.le(rt.sv(f, "uses"), 0)) return f.dot;
	yield* g.callName(f, live(user), "drop_item", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(5778, "/obj/item/weapon/restraints/handcuffs/energy/cult/used", "/obj/item/weapon/restraints/handcuffs/energy/cult", {});

// /obj/item/weapon/restraints/handcuffs/energy/cult/used/proc/dropped  (code/game/gamemodes/cult/talisman.dm:349)  may sleep
rt.def("/obj/item/weapon/restraints/handcuffs/energy/cult/used/proc/dropped", function* dropped(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀'s shackles shatter in a discharge of dark magic!</span>", [live(f.args[0])]), fmt("<span class='userdanger'>Your ＀ shatters in a discharge of dark magic!</span>", [live(f.src)])]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["user"] });
